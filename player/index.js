console.log('play v1.01');

var levelEngine = null;
var modelTracks = [];
var modelTimeline = [];
var modelOctaves = [];
var anchor = null;

var pathList = 'M149.996,0C67.157,0,0.001,67.161,0.001,149.997C0.001,232.837,67.157,300,149.996,300s150.003-67.163,150.003-150.003' +
	'S232.835,0,149.996,0z M90.318,204.463c-5.727,0-10.361-4.635-10.361-10.364c0-5.724,4.635-10.359,10.361-10.359' +
	'c5.724,0,10.361,4.635,10.361,10.359C100.679,199.828,96.042,204.463,90.318,204.463z M90.318,160.361' +
	'c-5.727,0-10.361-4.635-10.361-10.367c0-5.724,4.635-10.359,10.361-10.359c5.724,0,10.361,4.635,10.361,10.359' +
	'C100.679,155.727,96.042,160.361,90.318,160.361z M90.318,116.26c-5.727,0-10.361-4.635-10.361-10.364' +
	'c0-5.724,4.635-10.359,10.361-10.359c5.724,0,10.361,4.635,10.361,10.359C100.679,111.625,96.042,116.26,90.318,116.26z' +
	' M220.044,203.814h-97.143c-5.729,0-10.374-4.645-10.374-10.374s4.645-10.374,10.374-10.374h97.143' +
	'c5.729,0,10.374,4.645,10.374,10.374S225.773,203.814,220.044,203.814z M220.044,160.048h-97.143' +
	'c-5.729,0-10.374-4.645-10.374-10.374s4.645-10.374,10.374-10.374h97.143c5.729,0,10.374,4.645,10.374,10.374' +
	'C230.418,155.402,225.773,160.048,220.044,160.048z M220.044,116.281h-97.143c-5.729,0-10.374-4.645-10.374-10.374' +
	's4.645-10.374,10.374-10.374h97.143c5.729,0,10.374,4.645,10.374,10.374S225.773,116.281,220.044,116.281z';
var pathPin = 'M149.996,0C67.157,0,0.001,67.161,0.001,149.997S67.157,300,149.996,300s150.003-67.163,150.003-150.003' +
	'S232.835,0,149.996,0z M78.081,221.593l35.517-57.227c2.983,3.934,6.323,7.827,10.102,11.606' +
	'c3.737,3.74,7.628,7.114,11.588,10.118L78.081,221.593z M218.641,128.074c-3.779,3.781-10.185,4.152-17.302,1.73l-19.027,19.021' +
	'c9.563,15.536,11.84,30.664,4.375,38.136c-3.022,3.022-7.298,4.451-12.348,4.451c-9.298,0-21.221-4.866-32.762-13.585' +
	'c-0.257-0.192-0.511-0.394-0.765-0.594c-0.822-0.633-1.642-1.286-2.459-1.961c-0.324-0.267-0.646-0.534-0.97-0.807' +
	'c-0.778-0.659-1.551-1.338-2.321-2.031c-0.303-0.272-0.609-0.539-0.913-0.817c-1.048-0.965-2.088-1.953-3.115-2.98' +
	'c-1.172-1.172-2.295-2.36-3.382-3.558c-0.674-0.742-1.307-1.491-1.95-2.241c-0.35-0.41-0.713-0.817-1.056-1.232' +
	'c-0.833-1.001-1.621-2.007-2.394-3.016c-0.096-0.127-0.195-0.252-0.288-0.376c-13.531-17.852-17.857-36.627-9.251-45.232' +
	'c3.022-3.022,7.298-4.451,12.348-4.451c7.436,0,16.544,3.115,25.798,8.813l19.014-19.011c-2.422-7.119-2.049-13.523,1.735-17.302' +
	'c7.083-7.088,23.36-2.303,36.346,10.686C220.946,104.706,225.731,120.983,218.641,128.074z';
var pathPlay = 'M150,0C67.157,0,0,67.162,0,150c0,82.841,67.157,150,150,150s150-67.159,150-150C300,67.162,232.843,0,150,0z' +
	'M205.846,158.266l-86.557,49.971c-1.32,0.765-2.799,1.144-4.272,1.144c-1.473,0-2.949-0.379-4.274-1.144' +
	'c-2.64-1.525-4.269-4.347-4.269-7.402V100.89c0-3.053,1.631-5.88,4.269-7.402c2.648-1.528,5.906-1.528,8.551,0l86.557,49.974' +
	'c2.645,1.53,4.274,4.352,4.269,7.402C210.12,153.916,208.494,156.741,205.846,158.266z';
var iconPinSetting = null;

function init() {
	console.log('init');
	levelEngine = new LevelEngine(document.getElementById('contentSVG'));
	levelEngine.innerWidth = 100 * levelEngine.tapSize;
	levelEngine.innerHeight = 128 * levelEngine.tapSize;

	levelEngine.mx = 99;
	levelEngine.translateZ = 7;


	iconPinSetting = {
		kind: 'p',
		x: (levelEngine.viewWidth / levelEngine.tapSize) / 2 - 1.1, //0.25,
		y: 0.25,
		z: levelEngine.tapSize / 300,
		l: pathList,
		css: 'buttonFill'
	};
	var controlsModel = [{
		id: 'controlsLayer',
		x: 0.25,
		y: 0.25,
		w: 3,
		h: 1,
		z: [1, 100],
		l: [{
				kind: 'r',
				x: (levelEngine.viewWidth / levelEngine.tapSize) / 2 - 1.1-0.05, //0.25,
				y: 0.25-0.05,
				w: 1+0.1,
				h: 1+0.1,
				css: 'buttonBack',
				rx: 0.5,
				ry: 0.5
			},
			/*{
					kind: 'p',
					x: (levelEngine.viewWidth / levelEngine.tapSize) / 2 - 1.1, //0.25,
					y: 0.25,
					z: levelEngine.tapSize / 300,
					l: pathPin,
					css: 'buttonFill'
				}*/
			iconPinSetting, {
				kind: 'r',
				x: (levelEngine.viewWidth / levelEngine.tapSize) / 2 - 1.1, //0.25,
				y: 0.25,
				w: 1,
				h: 1,
				css: 'buttonSpot',
				a: function(xx, yy) {
					if (anchor) {
						iconPinSetting.l = pathList;
						levelEngine.startSlideTo(anchor.x, anchor.y, anchor.z);
						//console.log('back', anchor);
						anchor = null;
					} else {
						anchor = {
							x: levelEngine.translateX,
							y: levelEngine.translateY,
							z: levelEngine.translateZ
						};
						iconPinSetting.l = pathPin;
						//console.log('go', anchor);
						levelEngine.startSlideTo(-6.9 * levelEngine.tapSize, -10.9 * levelEngine.tapSize, 1);
					}
					levelEngine.clearGroupDetails(document.getElementById('controls'));
					levelEngine.tileFromModel();
				}
			}, {
				kind: 'r',
				x: (levelEngine.viewWidth / levelEngine.tapSize) / 2 + 0.1-0.05, //1.5,
				y: 0.25-0.05,
				w: 1+0.1,
				h: 1+0.1,
				css: 'buttonBack',
				rx: 0.5,
				ry: 0.5
			}, {
				kind: 'p',
				x: (levelEngine.viewWidth / levelEngine.tapSize) / 2 + 0.1, //1.5,
				y: 0.25,
				z: levelEngine.tapSize / 300,
				l: 'M207.597,115.365h-71.22l-18.759-17.029H85.649c-2.446,0-4.435,1.989-4.435,4.432v108.899' +
					'c0,2.443,1.989,4.432,4.435,4.432h3.369l17.688-91.03h105.32v-5.27C212.027,117.357,210.038,115.365,207.597,115.365z',
				css: 'buttonFill'
			}, {
				kind: 'p',
				x: (levelEngine.viewWidth / levelEngine.tapSize) / 2 + 0.1, //1.5,
				y: 0.25,
				z: levelEngine.tapSize / 300,
				l: 'M149.996,0C67.157,0,0.001,67.161,0.001,149.997S67.157,300,149.996,300s150.003-67.163,150.003-150.003' +
					'S232.835,0,149.996,0z M227.241,212.721c-0.542,10.333-8.948,18.601-19.343,18.912c-0.101,0.005-0.197,0.031-0.301,0.031' +
					'l-9.231,0.005l-112.72-0.005c-11.023,0-19.991-8.969-19.991-19.994V102.768c0-11.025,8.969-19.994,19.997-19.994h37.975' +
					'l18.759,17.029h65.211c11.023,0,19.991,8.969,19.991,19.997v5.27l17.904,0.003L227.241,212.721z',
				css: 'buttonFill'
			}, {
				kind: 'r',
				x: (levelEngine.viewWidth / levelEngine.tapSize) / 2 + 0.1, //1.5,
				y: 0.25,
				w: 1,
				h: 1,
				css: 'buttonSpot',
				a: function(xx, yy) {
					console.log('button2', xx, yy);
					document.getElementById('chooseFileInput').click();
				}
			}
		]
	}];
	levelEngine.setModel([{
		g: document.getElementById('controls'),
		m: controlsModel,
		kind: levelEngine.layerOverlay
	}, {
		g: document.getElementById('tracks'),
		m: modelTracks
	}, {
		g: document.getElementById('subcontrols'),
		m: [{
			id: 'subLayer',
			x: 7,
			y: 11,
			w: 5,
			h: 7,
			z: [1, 100],
			l: [{
				kind: 'r',
				x: 7,
				y: 11,
				w: 5,
				h: 5,
				rx: 0.2,
				ry: 0.2,
				css: 'bgField',
				a: function(xx, yy) {
					console.log('spot', levelEngine.translateX, levelEngine.translateY, levelEngine.translateZ);
				}
			}]
		}]
	}, {
		g: document.getElementById('timeline'),
		m: modelTimeline,
		kind: levelEngine.layerRow,
		shiftY: levelEngine.viewHeight / levelEngine.tapSize - 1.2
	}, {
		g: document.getElementById('octaves'),
		m: modelOctaves,
		kind: levelEngine.layerColumn,
		shiftX: levelEngine.viewWidth / levelEngine.tapSize - 2
	}]);
	levelEngine.applyZoomPosition();
	document.getElementById('chooseFileInput').addEventListener('change', function(event) {
		var file = event.target.files[0];
		var fileReader = new FileReader();
		fileReader.onload = function(progressEvent ) {
			var arrayBuffer = progressEvent.target.result;
			var midiFile = new MIDIFile(arrayBuffer);
			var parsedSong = midiFile.parseSong();
			setModel(parsedSong);
			levelEngine.innerWidth = parsedSong.duration * 20 * levelEngine.tapSize;
			levelEngine.resetModel();
		};
		fileReader.readAsArrayBuffer(file);
	}, false);

};

function setModel(song) {
	modelTracks.length = 0;
	modelTimeline.length = 0;
	modelOctaves.length = 0;

	addOctaveLine(song, modelOctaves, 'octave13', 'octave1', [1, 3]);
	addOctaveLine(song, modelOctaves, 'octave39', 'octave9', [3, 9]);

	addTimeLine(song, modelTimeline, 'time1x', 'timeLabel1', 1, [1, 3]);
	addTimeLine(song, modelTimeline, 'time3x', 'timeLabel3', 2, [3, 5]);
	addTimeLine(song, modelTimeline, 'time5x', 'timeLabel5', 3, [5, 10]);
	addTimeLine(song, modelTimeline, 'time10x', 'timeLabel10', 15, [10, 30]);
	addTimeLine(song, modelTimeline, 'time30x', 'timeLabel30', 40, [30, 100]);
	addBars(song, modelTracks);
	for (var t = 0; t < song.tracks.length; t++) {
		var track = song.tracks[t];
		for (var i = 0; i < track.notes.length; i++) {
			var note = track.notes[i];
			var d = note.duration * 20 - 1;
			d = (d) ? d : 0.001;
			var x1 = note.when * 20 + 0.5;
			var y1 = 127 - note.pitch;
			var x2 = x1 + d;
			var y2 = 127 - note.pitch;
			if (note.duration > 9) {
				note.duration = 1;
			}
			var nn = Math.floor(note.when / 3);
			var g = modelTracks[nn];
			if (note.slides.length) {
				x1 = (note.when + note.slides[0].when) * 20 + 0.5;
				y1 = 127 - note.slides[0].pitch;
				for (var s = 0; s < note.slides.length - 1; s++) {
					g.l.push({
						kind: 'l',
						x1: x1,
						y1: y1,
						x2: (note.when + note.slides[s].when) * 20 + 0.5,
						y2: 127 - note.slides[s].pitch,
						css: 'atrack'
					});
					x1 = (note.when + note.slides[s].when) * 20 + 0.5;
					y1 = 127 - note.slides[s].pitch;
				}
				x1 = (note.when + note.slides[note.slides.length - 1].when) * 20 + 0.5;
				y1 = 127 - note.slides[note.slides.length - 1].pitch;
			}
			g.l.push({
				kind: 'l',
				x1: x1,
				y1: y1,
				x2: x2,
				y2: y2,
				css: 'atrack'
			});
		}
	}

	for (var t = 0; t < song.beats.length; t++) {
		var beat = song.beats[t];
		for (var i = 0; i < beat.notes.length; i++) {
			var note = beat.notes[i];
			if (note) {
				var x = note.when * 20;
				var d = 0.01;
				var nn = Math.floor(note.when / 3);
				var g = modelTracks[nn];
				g.l.push({
					kind: 'r',
					x: x,
					y: beat.n - 30,
					w: 1.5,
					h: 1.5,
					rx: 0.3,
					ry: 0.3,
					css: 'abeat'
				});
			}
		}
	}
};

function addBars(song, modelTracks) {
	for (var i = 0; i < song.duration; i = i + 3) {
		var g = {
			id: 'bar' + i,
			x: i * 20,
			y: 0,
			w: 3 * 20,
			h: 128,
			z: [1, 100],
			l: []
		}
		modelTracks.push(g);
	}
}

function addOctaveLine(song, modelOctaves, labelPrefix, css, zoom) {
	for (var i = 1; i < 10; i++) {
		modelOctaves.push({
			id: labelPrefix + i,
			x: 0,
			y: 127 - i * 12,
			w: 50,
			h: 2,
			z: zoom,
			l: [{
				kind: 't',
				x: 0,
				y: 127 - i * 12,
				t: '' + i,
				css: css
			}]
		});
	}
}

function addTimeLine(song, modelTimeline, labelPrefix, css, step, zoom) {
	for (var i = 0; i < song.duration; i = i + step) {
		modelTimeline.push({
			id: labelPrefix + i,
			x: i * 20,
			y: 0,
			w: 50,
			h: 200,
			z: zoom,
			l: [{
				kind: 't',
				x: i * 20,
				y: 1,
				t: formatSeconds(i),
				css: css
			}]
		});
	}
}

function formatSeconds(t) {
	var h = Math.floor(t / 3600);
	var m = Math.floor(t / 60) % 60;
	var s = Math.floor(t % 60);
	return '' + ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2) + ':' + ('0' + s).slice(-2);
}