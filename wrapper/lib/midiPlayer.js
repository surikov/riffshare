console.log('midiPlayer v1.06');
var player = null;
var reverberator = null;
var songStart = 0;
var input = null;
var currentSongTime = 0;
var nextStepTime = 0;
var onAir = false;
var intervalID1 = 0;
var intervalID2 = 0;
var currentSong = null;
function handleExample(path) {
	console.log(path);
	var xmlHttpRequest = new XMLHttpRequest();
	xmlHttpRequest.open("GET", path, true);
	xmlHttpRequest.responseType = "arraybuffer";
	xmlHttpRequest.onload = function (e) {
		var arrayBuffer = xmlHttpRequest.response;
		var midiFile = new MIDIFile(arrayBuffer);
		var song = midiFile.parseSong();
		startLoad(song);
	};
	xmlHttpRequest.send(null);
}
function handleFileSelect(event) {
	console.log(event);
	var file = event.target.files[0];
	console.log(file);
	var fileReader = new FileReader();
	fileReader.onload = function (progressEvent ) {
		console.log(progressEvent);
		var arrayBuffer = progressEvent.target.result;
		console.log(arrayBuffer);
		var midiFile = new MIDIFile(arrayBuffer);
		var song = midiFile.parseSong();
		startLoad(song);
	};
	fileReader.readAsArrayBuffer(file);
}
function findFirstIns(player, nn) {
	for (var i = 0; i < player.loader.instrumentKeys().length; i++) {
		if (nn == 1 * player.loader.instrumentKeys()[i].substring(0, 3)) {
			return i;
		}
	}
}
function findFirstDrum(player, nn) {
	for (var i = 0; i < player.loader.drumKeys().length; i++) {
		if (nn == 1 * player.loader.drumKeys()[i].substring(0, 2)) {
			return i;
		}
	}
}
function startLoad(song) {
	console.log(song);
	if (onAir) {
		togglePlay();
	}
	player = player || new WebAudioFontPlayer();
	if (!(reverberator)) {
		reverberator = player.createReverberator(audioContext);
		reverberator.output.connect(output);
		input = reverberator.input;
	}
	for (var i = 0; i < song.tracks.length; i++) {
		var nn = findFirstIns(player, song.tracks[i].program);
		var info = player.loader.instrumentInfo(nn);
		song.tracks[i].info = info;
		song.tracks[i].id = nn;
		player.loader.startLoad(audioContext, info.url, info.variable);
	}
	for (var i = 0; i < song.beats.length; i++) {
		var nn = findFirstDrum(player, song.beats[i].n);
		var info = player.loader.drumInfo(nn);
		song.beats[i].info = info;
		song.beats[i].id = nn;
		player.loader.startLoad(audioContext, info.url, info.variable);
	}
	player.loader.waitLoad(function () {
		console.log('loaded');
		buildControls(song);
		startPlay(song);
	});
}
function chooserIns(n, track) {
	var html = '<select id="selins' + track + '">';
	for (var i = 0; i < player.loader.instrumentKeys().length; i++) {
		var sel = '';
		if (i == n) {
			sel = ' selected';
		}
		html = html + '<option value="' + i + '"' + sel + '>' + i + ': ' + player.loader.instrumentInfo(i).title + '</option>';
	}
	html = html + '</select>';
	return html;
}
function setVolumeAction(i, song) {
	var vlm = document.getElementById('channel' + i);
	vlm.oninput = function (e) {
		var v = vlm.value / 100;
		if (v < 0.000001) {
			v = 0.000001;
		}
		song.tracks[i].volume = v;
	};
}
function buildControls(song) {
	console.log(song);
	currentSong = song;
	var o = document.getElementById('midiTracks');
	var html = '<p><input id="position" type="range" min="0" max="100" value="0" step="1" /> <a href="javascript:togglePlay()">Start/Stop</a> </p>';
	html = html + '';
	if (song.beats.length > 0) {
		var v = 100 * song.beats[0].volume;
		html = html + '<p><input id="drumsVolume" type="range" min="0" max="100" value="' + v + '" step="1" /> Drums</p>';
	}
	html = html + '<p>uncheck track to listen original instrument</p>';
	for (var i = 0; i < song.tracks.length; i++) {
		var v = 100 * song.tracks[i].volume;
		html = html + '<p><input type="checkbox" id="replace'
			 + i + '"  /> <input id="channel'
			 + i + '" type="range" min="0" max="100" value="' + v + '" step="1" /> '
			 + player.loader.instrumentInfo(song.tracks[i].id).title + '</p>';
	}
	o.innerHTML = html;
	var pos = document.getElementById('position');
	pos.oninput = function (e) {
		player.cancelQueue(audioContext);
		var next = song.duration * pos.value / 100;
		songStart = songStart - (next - currentSongTime);
		currentSongTime = next;
	};
	for (var i = 0; i < song.tracks.length; i++) {
		setVolumeAction(i, song);
		var checkbox = document.getElementById('replace' + i);
		checkbox.track = song.tracks[i];
		checkbox.track.replace = true;
		checkbox.addEventListener('change', function () {
			this.track.replace = this.checked;
			console.log(this.track);
		});
	}
	if (song.beats.length > 0) {
		var vlm = document.getElementById('drumsVolume');
		vlm.oninput = function (e) {
			player.cancelQueue(audioContext);
			var v = vlm.value / 100;
			if (v < 0.000001) {
				v = 0.000001;
			}
			for (var i = 0; i < song.beats.length; i++) {
				currentSong.beats[i].volume = v;
			}
		};
	}
}
function togglePlay() {
	if (onAir) {
		onAir = false;
		clearInterval(intervalID1);
		clearInterval(intervalID2);
		player.cancelQueue(audioContext);
		cancelCurrentSynth();
	} else {
		startPlay(currentSong)
	}
}
function startPlay(song) {
	currentSongTime = 0;
	songStart = audioContext.currentTime;
	nextStepTime = audioContext.currentTime;
	var stepDuration = 44 / 1000;
	intervalID1 = setInterval(function () {
			if (audioContext.currentTime > nextStepTime - stepDuration) {
				sendNotes(song, songStart, currentSongTime, currentSongTime + stepDuration, audioContext, input, player);
				currentSongTime = currentSongTime + stepDuration;
				nextStepTime = nextStepTime + stepDuration;
				if (currentSongTime > song.duration) {
					currentSongTime = currentSongTime - song.duration;
					sendNotes(song, songStart, 0, currentSongTime, audioContext, input, player);
					songStart = songStart + song.duration;
				}
			}
		}, 22);
	intervalID2 = setInterval(function () {
			showPosition(song, currentSongTime);
		}, 1234);
	onAir = true;
}
function sendNotes(song, songStart, start, end, audioContext, input, player) {
	if (onAir) {
		for (var t = 0; t < song.tracks.length; t++) {
			var track = song.tracks[t];
			for (var i = 0; i < track.notes.length; i++) {
				if (track.notes[i].when >= start && track.notes[i].when < end) {
					var when = songStart + track.notes[i].when;
					var duration = track.notes[i].duration;
					if (duration > 5) {
						duration = 5;
					}
					if (track.replace) {
						if (currentSynth) {
							queueNote(currentSynth, audioContext, when, track.notes[i].pitch, track.volume * 99, duration);
						}
					} else {
						var instr = track.info.variable;
						var v = track.volume / 7;
						player.queueWaveTable(audioContext, input, window[instr], when, track.notes[i].pitch, duration, v, track.notes[i].slides);
					}
				}
			}
		}
		for (var b = 0; b < song.beats.length; b++) {
			var beat = song.beats[b];
			for (var i = 0; i < beat.notes.length; i++) {
				if (beat.notes[i].when >= start && beat.notes[i].when < end) {
					var when = songStart + beat.notes[i].when;
					var duration = 1.5;
					var instr = beat.info.variable;
					var v = beat.volume / 2;
					player.queueWaveTable(audioContext, input, window[instr], when, beat.n, duration, v);
				}
			}
		}
	}
}
function showPosition(song, currentSongTime) {
	var o = document.getElementById('position');
	o.value = 100 * currentSongTime / song.duration;
}
