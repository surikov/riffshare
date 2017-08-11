console.log('riffshare2d v1.0.1');
function RiffShare2D() {
	return this;
}
RiffShare2D.prototype.init = function () {
	console.log('start init');
	this.tapSize = 32;
	try {
		console.log('window.devicePixelRatio', window.devicePixelRatio);
		var pixelRatio = window.devicePixelRatio;
		this.tapSize = 30 * pixelRatio;
		if (isNaN(this.tapSize)) {
			this.tapSize = 51;
		}

	} catch (ex) {
		console.log(ex);
	}
	console.log('tapSize', this.tapSize, 'devicePixelRatio', window.devicePixelRatio);

	//this.selectedChannel = 0;

	this.currentSong = null;

	this.lineWidth = 0.05 * this.tapSize;
	this.svgns = "http://www.w3.org/2000/svg";
	this.contentDiv = document.getElementById('contentDiv');
	this.contentSVG = document.getElementById('contentSVG');
	this.rakeDiv = document.getElementById('rakeDiv');

	this.menuDiv = document.getElementById('menuDiv');

	this.hugeGroup = document.getElementById('huge');
	this.hugeborders = document.getElementById('hugeborders');
	this.hugetitles = document.getElementById('hugetitles');
	this.hugetracknames = document.getElementById('hugetracknames');
	this.hugeholders = document.getElementById('hugeholders');

	this.hugespots = document.getElementById('hugespots');

	this.largeGroup = document.getElementById('large');
	this.largetitles = document.getElementById('largetitles');
	this.largetracknames = document.getElementById('largetracknames');
	this.largelines = document.getElementById('largelines');
	this.largeborders = document.getElementById('largeborders');
	this.largeshadow = document.getElementById('largeshadow');
	this.largesymbols = document.getElementById('largesymbols');
	this.largespots = document.getElementById('largespots');

	this.mediumGroup = document.getElementById('medium');
	this.mediumtitles = document.getElementById('mediumtitles');
	this.mediumtracknames = document.getElementById('mediumtracknames');
	this.mediumgrid = document.getElementById('mediumgrid');
	this.mediumlines = document.getElementById('mediumlines');
	this.mediumborders = document.getElementById('mediumborders');
	this.mediumshadow = document.getElementById('mediumshadow');
	this.mediumsymbols = document.getElementById('mediumsymbols');
	this.mediumspots = document.getElementById('mediumspots');

	this.smallGroup = document.getElementById('small');
	this.smalltitles = document.getElementById('smalltitles');
	this.smalltracknames = document.getElementById('smalltracknames');
	this.smallgrid = document.getElementById('smallgrid');
	this.smalllines = document.getElementById('smalllines');
	this.smallborders = document.getElementById('smallborders');
	this.smallshadow = document.getElementById('smallshadow');
	this.smallsymbols = document.getElementById('smallsymbols');
	this.smallspots = document.getElementById('smallhotspots');

	this.overlayGroup = document.getElementById('overlay');

	this.menuTitleSpan = document.getElementById('menuTitle');
	this.menuTable = document.getElementById('menuTable');

	this.undoQueue = [];
	this.undoStep = 0;
	this.undoSize = 99;
	
	this.translateX = 0;
	this.translateY = 0;
	this.translateZ = 10;
	this.innerWidth = 3000;
	this.innerHeight = 2000;
	this.lastUsedLevel = 0;

	this.minZoomHuge = 17;
	this.minZoomLarge = 3;
	this.minZoomMedium = 0.5;

	this.spots = [];

	this.timeOutID = 0;

	this.stickedX = 0;

	this.marginLeft = 50;
	this.marginRight = 20;
	this.marginTop = 10;
	this.marginBottom = 20;
	this.heightSongTitle = 30;
	this.heightSongText = 20;
	this.heightTrTitle = 17;
	this.heightTrChords = 10;
	this.heightTrSheet = 29;
	this.marginTrSheetLines = 14;
	this.marginFret = 10;
	//this.heightTrFret = 10;
	//this.heightTrText = 10;
	this.heightPRTitle = 19;
	this.heightPRGrid = 128;
	this.marginFirstMeasure = 50;
	this.marginChangedMeasure = 40;
	this.cellWidth = 3.75;
	//this.cellDuration = '1/16';
	//this.cellDuration = '1/32';

	//this.slideIntervalID=0;

	this.lowStair = 28;
	this.highStair = this.lowStair + 12;

	this.colorGrid = '#bcf';
	this.colorPianoKeys = '#eee';
	this.colorHugeHolder = '#ddd';
	this.colorSharp = '#bbb';
	this.colorComment = '#333';
	this.colorMain = '#000';
	//this.colorAction = '#f60';
	this.colorAction = '#bcf';
	this.colorButton = '#000';
	this.colorMarked = '#603';
	/*
	this.hideTrackSheet = [];
	this.hideTrackChords = [];
	this.hideTrackFret = [];
	this.hideTrackText = [];
	this.hideRoll = false;
	 */
	this.drumNames = [];
	this.drumNames[35] = "Bass Drum 2";
	this.drumNames[36] = "Bass Drum 1";
	this.drumNames[37] = "Side Stick/Rimshot";
	this.drumNames[38] = "Snare Drum 1";
	this.drumNames[39] = "Hand Clap";
	this.drumNames[40] = "Snare Drum 2";
	this.drumNames[41] = "Low Tom 2";
	this.drumNames[42] = "Closed Hi-hat";
	this.drumNames[43] = "Low Tom 1";
	this.drumNames[44] = "Pedal Hi-hat";
	this.drumNames[45] = "Mid Tom 2";
	this.drumNames[46] = "Open Hi-hat";
	this.drumNames[47] = "Mid Tom 1";
	this.drumNames[48] = "High Tom 2";
	this.drumNames[49] = "Crash Cymbal 1";
	this.drumNames[50] = "High Tom 1";
	this.drumNames[51] = "Ride Cymbal 1";
	this.drumNames[52] = "Chinese Cymbal";
	this.drumNames[53] = "Ride Bell";
	this.drumNames[54] = "Tambourine";
	this.drumNames[55] = "Splash Cymbal";
	this.drumNames[56] = "Cowbell";
	this.drumNames[57] = "Crash Cymbal 2";
	this.drumNames[58] = "Vibra Slap";
	this.drumNames[59] = "Ride Cymbal 2";
	this.drumNames[60] = "High Bongo";
	this.drumNames[61] = "Low Bongo";
	this.drumNames[62] = "Mute High Conga";
	this.drumNames[63] = "Open High Conga";
	this.drumNames[64] = "Low Conga";
	this.drumNames[65] = "High Timbale";
	this.drumNames[66] = "Low Timbale";
	this.drumNames[67] = "High Agogo";
	this.drumNames[68] = "Low Agogo";
	this.drumNames[69] = "Cabasa";
	this.drumNames[70] = "Maracas";
	this.drumNames[71] = "Short Whistle";
	this.drumNames[72] = "Long Whistle";
	this.drumNames[73] = "Short Guiro";
	this.drumNames[74] = "Long Guiro";
	this.drumNames[75] = "Claves";
	this.drumNames[76] = "High Wood Block";
	this.drumNames[77] = "Low Wood Block";
	this.drumNames[78] = "Mute Cuica";
	this.drumNames[79] = "Open Cuica";
	this.drumNames[80] = "Mute Triangle";
	this.drumNames[81] = "Open Triangle";

	this.insNames = [];
	this.insNames[0] = "Acoustic Grand Piano: Piano";
	this.insNames[1] = "Bright Acoustic Piano: Piano";
	this.insNames[2] = "Electric Grand Piano: Piano";
	this.insNames[3] = "Honky-tonk Piano: Piano";
	this.insNames[4] = "Electric Piano 1: Piano";
	this.insNames[5] = "Electric Piano 2: Piano";
	this.insNames[6] = "Harpsichord: Piano";
	this.insNames[7] = "Clavinet: Piano";
	this.insNames[8] = "Celesta: Chromatic Percussion";
	this.insNames[9] = "Glockenspiel: Chromatic Percussion";
	this.insNames[10] = "Music Box: Chromatic Percussion";
	this.insNames[11] = "Vibraphone: Chromatic Percussion";
	this.insNames[12] = "Marimba: Chromatic Percussion";
	this.insNames[13] = "Xylophone: Chromatic Percussion";
	this.insNames[14] = "Tubular Bells: Chromatic Percussion";
	this.insNames[15] = "Dulcimer: Chromatic Percussion";
	this.insNames[16] = "Drawbar Organ: Organ";
	this.insNames[17] = "Percussive Organ: Organ";
	this.insNames[18] = "Rock Organ: Organ";
	this.insNames[19] = "Church Organ: Organ";
	this.insNames[20] = "Reed Organ: Organ";
	this.insNames[21] = "Accordion: Organ";
	this.insNames[22] = "Harmonica: Organ";
	this.insNames[23] = "Tango Accordion: Organ";
	this.insNames[24] = "Acoustic Guitar (nylon): Guitar";
	this.insNames[25] = "Acoustic Guitar (steel): Guitar";
	this.insNames[26] = "Electric Guitar (jazz): Guitar";
	this.insNames[27] = "Electric Guitar (clean): Guitar";
	this.insNames[28] = "Electric Guitar (muted): Guitar";
	this.insNames[29] = "Overdriven Guitar: Guitar";
	this.insNames[30] = "Distortion Guitar: Guitar";
	this.insNames[31] = "Guitar Harmonics: Guitar";
	this.insNames[32] = "Acoustic Bass: Bass";
	this.insNames[33] = "Electric Bass (finger): Bass";
	this.insNames[34] = "Electric Bass (pick): Bass";
	this.insNames[35] = "Fretless Bass: Bass";
	this.insNames[36] = "Slap Bass 1: Bass";
	this.insNames[37] = "Slap Bass 2: Bass";
	this.insNames[38] = "Synth Bass 1: Bass";
	this.insNames[39] = "Synth Bass 2: Bass";
	this.insNames[40] = "Violin: Strings";
	this.insNames[41] = "Viola: Strings";
	this.insNames[42] = "Cello: Strings";
	this.insNames[43] = "Contrabass: Strings";
	this.insNames[44] = "Tremolo Strings: Strings";
	this.insNames[45] = "Pizzicato Strings: Strings";
	this.insNames[46] = "Orchestral Harp: Strings";
	this.insNames[47] = "Timpani: Strings";
	this.insNames[48] = "String Ensemble 1: Ensemble";
	this.insNames[49] = "String Ensemble 2: Ensemble";
	this.insNames[50] = "Synth Strings 1: Ensemble";
	this.insNames[51] = "Synth Strings 2: Ensemble";
	this.insNames[52] = "Choir Aahs: Ensemble";
	this.insNames[53] = "Voice Oohs: Ensemble";
	this.insNames[54] = "Synth Choir: Ensemble";
	this.insNames[55] = "Orchestra Hit: Ensemble";
	this.insNames[56] = "Trumpet: Brass";
	this.insNames[57] = "Trombone: Brass";
	this.insNames[58] = "Tuba: Brass";
	this.insNames[59] = "Muted Trumpet: Brass";
	this.insNames[60] = "French Horn: Brass";
	this.insNames[61] = "Brass Section: Brass";
	this.insNames[62] = "Synth Brass 1: Brass";
	this.insNames[63] = "Synth Brass 2: Brass";
	this.insNames[64] = "Soprano Sax: Reed";
	this.insNames[65] = "Alto Sax: Reed";
	this.insNames[66] = "Tenor Sax: Reed";
	this.insNames[67] = "Baritone Sax: Reed";
	this.insNames[68] = "Oboe: Reed";
	this.insNames[69] = "English Horn: Reed";
	this.insNames[70] = "Bassoon: Reed";
	this.insNames[71] = "Clarinet: Reed";
	this.insNames[72] = "Piccolo: Pipe";
	this.insNames[73] = "Flute: Pipe";
	this.insNames[74] = "Recorder: Pipe";
	this.insNames[75] = "Pan Flute: Pipe";
	this.insNames[76] = "Blown bottle: Pipe";
	this.insNames[77] = "Shakuhachi: Pipe";
	this.insNames[78] = "Whistle: Pipe";
	this.insNames[79] = "Ocarina: Pipe";
	this.insNames[80] = "Lead 1 (square): Synth Lead";
	this.insNames[81] = "Lead 2 (sawtooth): Synth Lead";
	this.insNames[82] = "Lead 3 (calliope): Synth Lead";
	this.insNames[83] = "Lead 4 (chiff): Synth Lead";
	this.insNames[84] = "Lead 5 (charang): Synth Lead";
	this.insNames[85] = "Lead 6 (voice): Synth Lead";
	this.insNames[86] = "Lead 7 (fifths): Synth Lead";
	this.insNames[87] = "Lead 8 (bass + lead): Synth Lead";
	this.insNames[88] = "Pad 1 (new age): Synth Pad";
	this.insNames[89] = "Pad 2 (warm): Synth Pad";
	this.insNames[90] = "Pad 3 (polysynth): Synth Pad";
	this.insNames[91] = "Pad 4 (choir): Synth Pad";
	this.insNames[92] = "Pad 5 (bowed): Synth Pad";
	this.insNames[93] = "Pad 6 (metallic): Synth Pad";
	this.insNames[94] = "Pad 7 (halo): Synth Pad";
	this.insNames[95] = "Pad 8 (sweep): Synth Pad";
	this.insNames[96] = "FX 1 (rain): Synth Effects";
	this.insNames[97] = "FX 2 (soundtrack): Synth Effects";
	this.insNames[98] = "FX 3 (crystal): Synth Effects";
	this.insNames[99] = "FX 4 (atmosphere): Synth Effects";
	this.insNames[100] = "FX 5 (brightness): Synth Effects";
	this.insNames[101] = "FX 6 (goblins): Synth Effects";
	this.insNames[102] = "FX 7 (echoes): Synth Effects";
	this.insNames[103] = "FX 8 (sci-fi): Synth Effects";
	this.insNames[104] = "Sitar: Ethnic";
	this.insNames[105] = "Banjo: Ethnic";
	this.insNames[106] = "Shamisen: Ethnic";
	this.insNames[107] = "Koto: Ethnic";
	this.insNames[108] = "Kalimba: Ethnic";
	this.insNames[109] = "Bagpipe: Ethnic";
	this.insNames[110] = "Fiddle: Ethnic";
	this.insNames[111] = "Shanai: Ethnic";
	this.insNames[112] = "Tinkle Bell: Percussive";
	this.insNames[113] = "Agogo: Percussive";
	this.insNames[114] = "Steel Drums: Percussive";
	this.insNames[115] = "Woodblock: Percussive";
	this.insNames[116] = "Taiko Drum: Percussive";
	this.insNames[117] = "Melodic Tom: Percussive";
	this.insNames[118] = "Synth Drum: Percussive";
	this.insNames[119] = "Reverse Cymbal: Percussive";
	this.insNames[120] = "Guitar Fret Noise: Sound effects";
	this.insNames[121] = "Breath Noise: Sound effects";
	this.insNames[122] = "Seashore: Sound effects";
	this.insNames[123] = "Bird Tweet: Sound effects";
	this.insNames[124] = "Telephone Ring: Sound effects";
	this.insNames[125] = "Helicopter: Sound effects";
	this.insNames[126] = "Applause: Sound effects";
	this.insNames[127] = "Gunshot: Sound effects";

	this.setupInput();
	var o = readObjectFromlocalStorage('currentSong');

	if (o) {
		console.log('load saved song');
		this.setSong(o);
	} else {
		this.setSong(this.emptySong());
	}
	window.onresize = function () {
		riffShare2d.resetSize(); //(riffShare2d.innerWidth, riffShare2d.innerHeight);
	};
	window.onunload = function () {
		riffShare2d.currentSong.selection = {};
		riffShare2d.currentSong.selection.translateX = riffShare2d.translateX;
		riffShare2d.currentSong.selection.translateY = riffShare2d.translateY;
		riffShare2d.currentSong.selection.translateZ = riffShare2d.translateZ;
		riffShare2d.currentSong.selection.cellWidth = riffShare2d.cellWidth;

		console.log('song.selection', riffShare2d.currentSong.selection);

		saveObject2localStorage('currentSong', riffShare2d.currentSong);
	};
	console.log('done init');
};
RiffShare2D.prototype.cellDurationRatio = function (order, channel) {
	//return 1;// 1/16
	return 2;// 1/32
};
RiffShare2D.prototype.channelStringKey = function (order, channel) {
	for (var i = 0; i < channel.string.length; i++) {
		if (channel.string[i].order == order) {
			return channel.string[i].pitch;
		}
	}
};
RiffShare2D.prototype.cleffOffset = function (clef) {
	if (clef == 2)
		return -20;
	return 0;
};
RiffShare2D.prototype.fretLineColor = function (n) {
	//var n=1*fret;
	if (n > 6)
		return '#aaa';
	if (n > 4)
		return '#999';
	if (n > 2)
		return '#666';
	if (n > 0)
		return '#333';
	return '#000';
};
RiffShare2D.prototype.findMotifInPosByChannel = function (motifs, channel) {
	for (var i = 0; i < motifs.length; i++) {
		if (motifs[i].channel == channel) {
			return motifs[i];
		}
	}
	return null;
};
RiffShare2D.prototype.findCreateStepChord=function (songMeasure, step) {
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
RiffShare2D.prototype.findMotifById = function (id) {
	for (var i = 0; i < this.currentSong.motifs.length; i++) {
		if (this.currentSong.motifs[i].id == id) {
			return this.currentSong.motifs[i];
		}
	}
	return null;
};
RiffShare2D.prototype.findPositionMotifByChannel = function (position, channelID) {
	var m = [];
	for (var n = 0; n < position.motifs.length; n++) {
		var motif = position.motifs[n];
		if (motif.channel == channelID) {
			//return motif;
			m.push(motif);
		}
	}
	return m;
};
RiffShare2D.prototype.positionOptionsChanges = function () {
	var changes = [];
	var info = {
		clef : -1,

	};
	for (var p = 1; p < this.currentSong.positions.length; p++) {
		var cur = this.currentSong.positions[p];
		var pre = this.currentSong.positions[p - 1];
		if (cur.tempo != pre.tempo || cur.meter != pre.meter || cur.by != pre.by) {
			changes[p] = 1;
		} else {
			for (var i = 0; i < this.currentSong.channels.length; i++) {
				var channel = this.currentSong.channels[i];
				var curMo = this.findMotifInPosByChannel(cur.motifs, channel.id);
				var preMo = this.findMotifInPosByChannel(pre.motifs, channel.id);
				if (curMo) {
					if (preMo) {
						if (curMo.clef != preMo.clef || curMo.sign != preMo.sign) {
							changes[p] = 1;
							break;
						}
					}
				}
			}
		}
	}
	return changes;
};
RiffShare2D.prototype.linesYshift = function () {
	return (0.5 + this.marginTrSheetLines + 2 * 5) * this.tapSize;
};
RiffShare2D.prototype.emptySong = function () {
	console.log('create empty song');
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
};
RiffShare2D.prototype.resetAllLayersNow = function () {
	//console.log('resetAllLayersNow');
	this.clearLayers([riffShare2d.hugeGroup, riffShare2d.largeGroup, riffShare2d.mediumGroup, riffShare2d.smallGroup]);
	this.clearSpots();
	this.resetSize();
	this.resetTiles();
};
RiffShare2D.prototype.queueTiles = function () {
	if (this.timeOutID > 0) {
		//console.log('still wait redraw');
		return;
	}
	this.timeOutID = setTimeout(function () {
			//console.log(this);
			riffShare2d.timeOutID = 0;
			riffShare2d.resetTiles();
		}, 100);
};

RiffShare2D.prototype.setSong = function (song) {
	//if (!(song.selectedChannel)) {
	//	song.selectedChannel = 0;
	//}

	for (var i = 0; i < song.channels.length; i++) {
		var c = song.channels[i];
		if (c.equalizer) {
			for (var v = 0; v < 10; v++) {
				if (c.equalizer[v] < -5 || c.equalizer[v] > 5) {
					c.equalizer[v] = 0;
				}
			}
		} else {
			c.equalizer = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		}
	}
	if (!(song.volumes)) {
		song.volumes = [{
				position : 0,
				value : 127
			}
		];
	}
	if (song.echo + 1) {}
	else {
		song.echo = 1;
	}
	//song.channels[0].equalizer[3]=-2;
	/*
	if(!(song.hideTrackSheet)){
	song.hideTrackSheet = [];
	}
	if(!(song.hideTrackChords)){
	song.hideTrackChords = [];
	}
	if(!(song.hideTrackFret)){
	song.hideTrackFret = [];
	}
	if(!(song.hideTrackSheet)){
	song.hideTrackSheet = [];
	}
	if(!(song.hideRoll)){
	song.hideRoll = false;
	}*/
	this.currentSong = song;
	console.log(this.currentSong);
	/*
	this.hideTrackSheet = [];
	this.hideTrackChords = [];
	this.hideTrackFret = [];
	this.hideTrackText = [];
	this.hideRoll = false;
	 */
	/*
	this.hideTrackSheet[1] = true;
	this.hideTrackChords[1] = true;
	this.hideTrackFret[1] = true;
	this.hideTrackText[1] = true;
	 */
	//this.hideRoll=true;
	if (song.selection) {
		//console.log('song.selection', song.selection);
		if (song.selection.translateX) {
			this.translateX = song.selection.translateX;
		}
		if (song.selection.translateY) {
			this.translateY = song.selection.translateY;
		}
		if (song.selection.translateZ) {
			this.translateZ = song.selection.translateZ;
		}
		if (riffShare2d.currentSong.selection.cellWidth > 5) {
			this.cellWidth = 6.0;
		} else {
			if (riffShare2d.currentSong.selection.cellWidth > 2) {
				this.cellWidth = 2.5;
			} else {
				this.cellWidth = 1.00;
			}
		}
	}
	this.startedNoteInfo=null;
	this.resetSize();
};
RiffShare2D.prototype.resetSize = function () {
	//console.log('set size', width, height, this.contentDiv.clientWidth);
	//var ml = this.songWidth32th();
	/*var tc = 1;
	if (this.currentSong) {
	tc = this.currentSong.channels.length
	}*/
	this.innerWidth = (this.marginLeft + this.marginRight) * this.tapSize + this.songWidth32th();
	this.innerHeight = (this.marginTop + this.heightSongTitle + this.heightSongText + this.marginBottom //
	) * this.tapSize
	+this.calculateAllTracksHeight()
	+this.calculateRollHeight() //
;
	this.contentSVG.style.width = this.contentDiv.clientWidth;
	this.contentSVG.style.height = this.contentDiv.clientHeight;
	
	document.getElementById('undobutton').style.width = this.tapSize;
	document.getElementById('undobutton').style.height = this.tapSize;
	
	document.getElementById('redobutton').style.width = this.tapSize;
	document.getElementById('redobutton').style.height = this.tapSize;
	document.getElementById('redobutton').style.top = this.tapSize;
	
	
	
	this.adjustContentPosition();
	this.queueTiles();
};
window.onload = function () {
	console.log('create riffShare2d');
	window.riffShare2d = new RiffShare2D();
	window.riffShare2d.init();
};
console.log('test start');
var by16=[2,1,0.5,0.25];//1/8-
var chords = [//1-3
			{start:0,notes:[{key:36,l6th:2,string:3}]}
			,{start:2,notes:[{key:36,l6th:2,string:3}]}
			,{start:4,notes:[{key:43,l6th:2,string:1}]}
			,{start:6,notes:[{key:43,l6th:2,string:1}]}
			,{start:8,notes:[{key:45,l6th:2,string:1}]}
			,{start:10,notes:[{key:45,l6th:2,string:1}]}
			,{start:12,notes:[{key:43,l6th:4,string:1}]}
			];
chords.sort(function(o1,o2){
	return o1.start-o2.start;
});
/*
var s=[];
for(var i=0;i<chords.length;i++){
	s.push(chords[i].start);
}
s.sort();
*/
console.log(chords);
console.log('test done');
