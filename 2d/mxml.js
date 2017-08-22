console.log("import from mxml v1.1");
function parsemxml(arrayBuffer) {
	//console.log('parsemxml', arrayBuffer);
	//var xml = String.fromCharCode.apply(null, new Uint8Array(arrayBuffer));
	var u8a=new Uint8Array(arrayBuffer);
	//var chrs=[]
	var xml='';
	var i=0;
	var sz=12345;
	for(i=0;i<u8a.length;i=i+sz){
		var str=String.fromCharCode.apply(null, u8a.subarray(i,i+sz));
		xml=xml+str;
	}
	var str=String.fromCharCode.apply(null, u8a.subarray,i,u8a.length-i);
	xml=xml+str;
	//console.log('xml',xml);
	var tree = new ValueTree();
	tree.fromXMLstring(xml);
	console.log('tree', tree);
	song = emptySong();
	song.name = tree.of('score-partwise').of('credit').of('credit-words').value;
	if (!(song.name)) {
		song.name = tree.of('score-partwise').of('movement-title').value;
	}
	song.channels = [];
	song.motifs = [];
	song.positions = [];
	var score_part = tree.of('score-partwise').of('part-list').all('score-part');
	for (var i = 0; i < score_part.length; i++) {
		var title = score_part[i].of('part-name').value;
		var id = score_part[i].of('id').value;
		var channel = emptyChannel(id, title);
		channel.id = score_part[i].of('id').value;
		channel.track = score_part[i].of('part-name').value;
		channel.channel = score_part[i].of('score-instrument').of('instrument-name').value;
		song.channels.push(channel);
		var part = findPart(id, tree);

		console.log(id, channel.track);
		var measure = part.all('measure');
		measure.sort(function (a, b) {
			return 1 * a.of('number').value - 1 * b.of('number').value;
		});
		var mem = {
			currentDivisions : 8
		};

		for (var m = 0; m < measure.length; m++) {
			//console.log(m, measure[m].of('number').value);
			var songMeasure = createMotif(m, mem, measure[m]);
			//console.log('songMeasure', songMeasure);
			song.motifs.push(songMeasure);
			addPositionMotif(song.positions,m,channel.id,songMeasure.id);
		}
	}
	console.log(song);
	return song;
}
function addPositionMotif(positions,order,channelID,motifID){
	findCreatePositionMotif(positions,order);
	positions[order].motifs.push({motif:motifID,channel:channelID,clef:1,sign:0});
}
function findCreatePositionMotif(positions,order) {
	if(positions[order]){
		//
	}else{
		positions[order]={order:order,tempo:100,meter:4,by:4,motifs:[]
			
		};
	}
	return positions[order];
}
function findCreateStepChord(songMeasure, step) {
	for (var i = 0; i < songMeasure.chords.length; i++) {
		if (songMeasure.chords[i].start == step) {
			return songMeasure.chords[i];
		}
	}
	songMeasure.chords.push({
		start : step,
		notes : []
	});
	return songMeasure.chords[songMeasure.chords.length - 1];
}
function createMotif(m, mem, measureTree) {
	//console.log('createMotif',measureTree.of('id'));
	var divisions = measureTree.of('attributes').of('divisions').value;
	if (divisions) {
		//console.log('change divisions to',divisions);
		mem.currentDivisions = 1.0 * divisions;
	}
console.log(m,mem.currentDivisions);
	var songMeasure = {
		id : rid(measureTree.of('id').value),
		chords : []
	};
	var voiceStep = [];
	var note = measureTree.all('note');
	for (var i = 0; i < note.length; i++) {
		var n = note[i];
		var duration16 = (n.of('duration').value / mem.currentDivisions) * 4;
		//console.log(n.of('voice').value,n.of('duration').value+'/'+mem.currentDivisions,n.of('pitch').of('step').value+n.of('pitch').of('octave').value);
		var voice = 0;
		if (n.of('voice').value) {
			voice = 1 * n.of('voice').value;
		}
		if (!(voiceStep[voice])) {
			voiceStep[voice] = 0;
		}
		var step = (voiceStep[voice] / mem.currentDivisions) * 4;
		var ch = findCreateStepChord(songMeasure, step);
		var s = n.of('pitch').of('step').value;
		var o = n.of('pitch').of('octave').value;
		var a = n.of('pitch').of('alter').value;
		var key = keyByOctavePitch(s, o, a);
		ch.notes.push({
			key : key,
			l6th : duration16
		});
		voiceStep[voice] = voiceStep[voice] + 1 * n.of('duration').value
	}
	//console.log(voiceStep);
	return songMeasure;
}
function keyByOctavePitch(step, octave, alter) {
	var key = -1;
	if (step == 'C')
		key = 0;
	else if (step == 'D')
		key = 2;
	else if (step == 'E')
		key = 4;
	else if (step == 'F')
		key = 5;
	else if (step == 'G')
		key = 7;
	else if (step == 'A')
		key = 9;
	else if (step == 'B')
		key = 11;
	if (key >= 0) {
		key = key + octave * 12 + 1. * alter;
	}
	return key
}
function findPart(id, tree) {
	var part = tree.of('score-partwise').all('part');
	for (var i = 0; i < part.length; i++) {
		if (part[i].of('id').value == id) {
			return part[i];
		}
	}
	return null;
}
function emptyPosition() {
	return {
		order : 0,
		tempo : 100,
		meter : 4,
		by : 4,
		motifs : []
	};
};
function emptyChannel() {
	return {
		id : 'id',
		program : 0,
		color : 'rgb(176,218,136)',
		offset : 0,
		track : 'track',
		channel : 'channel',
		volumes : [{
				position : 0,
				value : 127
			}
		],
		string : guitar6strings()
	};
}
function guitar6strings() {
	return [{
			order : 1,
			pitch : 64
		}, {
			order : 2,
			pitch : 59
		}, {
			order : 3,
			pitch : 55
		}, {
			order : 4,
			pitch : 50
		}, {
			order : 5,
			pitch : 45
		}, {
			order : 6,
			pitch : 40
		}
	];
}

function emptySong() {
	//console.log('create empty song');
	var emptysong = {
		version : '2.21',
		album : '',
		artist : '',
		author : '',
		comments : '',
		copyright : '',
		date : '',
		name : 'New empty song',
		transcriber : '',
		writer : '',
		lyrics : [
		],
		channels : [{
				id : 70490,
				program : 0,
				color : 'rgb(176,218,136)',
				offset : 0,
				track : 'Piano',
				channel : 'Default',
				volumes : [{
						position : 0,
						value : 127
					}
				],
				string : [{
						order : 1,
						pitch : 64
					}, {
						order : 2,
						pitch : 59
					}, {
						order : 3,
						pitch : 55
					}, {
						order : 4,
						pitch : 50
					}, {
						order : 5,
						pitch : 45
					}, {
						order : 6,
						pitch : 40
					}
				]
			}
		],
		positions : [{
				order : 0,
				tempo : 100,
				meter : 4,
				by : 4,
				motifs : [{
						motif : 43914,
						channel : 70490,
						clef : 1,
						sign : 0
					}
				]
			}
		],
		motifs : [{
				id : 43914,
				chords : [
				]
			}
		]
	};
	return emptysong;
}
function rid(id) {
	if (id) {
		return id;
	}
	return '_' + Math.round(Math.random() * 100000);
}
function importmxml(evt) {
	console.log('importmxml', evt);
	var fileList = evt.target.files;
	if (fileList.length > 0) {
		var file = fileList.item(0);
		var fileReader = new FileReader();
		fileReader.onload = function (progressEvent) {
			//console.log(progressEvent);
			if (progressEvent.target.readyState == FileReader.DONE) {
				var arrayBuffer = progressEvent.target.result;
				var song=parsemxml(arrayBuffer);
				//saveObject2localStorage('currentSong',song);
				//window.location.href = 'index.html';
			} else {
				console.log(progressEvent.target.readyState);
			}
		};
		fileReader.readAsArrayBuffer(file);
	}
}
document.getElementById('filesOpen').addEventListener('change', importmxml, false);
