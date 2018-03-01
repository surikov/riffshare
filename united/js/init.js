FretChordSheet.prototype.init = function () {
	console.log('init FretChordSheet');
	var vars=getUrlVars();
	console.log('url commands',vars);
	this.prefix = 'testinUnite';
	if(vars.clear){
		saveObject2localStorage(this.prefix + '_position', {});
		window.location = "index.html";
	}
	this.air=false;
	this.tiler = new TileLevel("contentSVG", 'cntnt');
	this.tiler.translateZ = 6.9;
	this.layerBack = this.tiler.addBaseLayer();
	this.layerOctaveKeys = this.tiler.addBaseLayer();
	this.layerGrid = this.tiler.addBaseLayer();
	this.layerOctaves = this.tiler.addBaseLayer();
	this.layerBarNumbers = this.tiler.addRowLayer();
	this.layerOctaveNumbers = this.tiler.addColumnLayer();
	this.layerDrumNames = this.tiler.addColumnLayer();
	this.layerNotes = this.tiler.addBaseLayer();
	this.layerDrumLabels = this.tiler.addColumnLayer();
	this.layerLeftMenu = this.tiler.addBaseLayer();
	this.layerDialogs = this.tiler.addBaseLayer();
	this.margins = {
		sheetLeft: 1 * this.tiler.tapSize
		//, pianorollTop: (1) * 3 * this.tiler.tapSize
		//, sheetTop: (1 + 12 * 5 + 1) * 3 * this.tiler.tapSize
		//, fretTop: (1 + 12 * 5 + 1 + 6 * 7 + 1) * 3 * this.tiler.tapSize
		//, drumsTop: (1 + 12 * 5 + 1 + 6 * 7 + 1 + 6 + 1) * 3 * this.tiler.tapSize
		, pianorollTop: 0
		, sheetTop: 0
		, fretTop: 0
		, drumsTop: 0
	};
	/*this.margins.pianorollTop=3 * this.tiler.tapSize;
	this.margins.sheetTop=this.margins.pianorollTop+(5*12+1)* 3 * this.tiler.tapSize;
	this.margins.fretTop=this.margins.sheetTop+(6*7+1)* 3 * this.tiler.tapSize;
	this.margins.drumsTop=this.margins.fretTop+(6+1)* 3 * this.tiler.tapSize;
*/
	
	this.feelNames = ['straight 1/8', 'straight 1/16', 'swing 1/16', 'triplet 2/16', 'straight 1/32'];
	this.breakNames = ['none', 'narrow', 'wide'];

	this.selection=null;

	this.feelPattern6 = [[0, 24, 48], [0, 12, 24, 36, 48], [0, 15, 30, 39, 48], [0, 8, 16, 24, 32, 40, 48], [0, 6, 12, 18, 24, 30, 36, 42, 48]];
	this.measureModeNames = ['3/4', '4/4', '5/4', '6/4', '7/4'];
	this.options = {
		measureHeader: 5
		, feel: 0
		, measureMode: 1
		, markNotesCount: 1
		, hidePiano: 1
		, hideStaff: 1
		, hideFrets: 1
		, hideDrums: 1
		, clef8: [0, 0, 0, 0, 0, 0, 0, 0]
	};
	
	this.keys = [
		[0, 0, 0, 0, 0, 0, 0]//C 0
		, [0, 0, 0, 1, 0, 0, 0]//G 1
		, [1, 0, 0, 1, 0, 0, 0]//D 2
		, [1, 0, 0, 1, 1, 0, 0]//A 3
		, [1, 1, 0, 1, 1, 0, 0]//E 4
		, [1, 1, 0, 1, 1, 1, 0]//BCb 5
		, [1, 1, 1, 1, 1, 1, 0]//F#Gb 6
		, [1, 1, 1, 1, 1, 1, 1]//DbC# 7
		, [0, 0, 0, 0, 0, 0, -1]//F 8
		, [0, 0, -1, 0, 0, 0, -1]//Bb 9
		, [0, 0, -1, 0, 0, -1, -1]//Eb 10
		, [0, -1, -1, 0, 0, -1, -1]//Ab 11
		, [0, -1, -1, 0, -1, -1, -1]//C#Bb 12
		, [-1, -1, -1, 0, -1, -1, -1]//F#Gb 13
		, [-1, -1, -1, -1, -1, -1, -1]//BCb 14
	];

	this.measures = [];
	this.stringPitches = [28, 23, 19, 14, 9, 4];
	this.markNotes = [];
	//this.markStaff = null;
	//this.markFret = null;
	this.contentHeight = 121 * 3 * this.tiler.tapSize;
	this.trackOrder = [0, 1, 2, 3, 4, 5, 6, 7];
	this.colors = {
		base: '#000'
		, grid: 'rgba(0,0,0,0.2)'
		, barCounter: 'rgba(0,0,0,0.2)'
		, staff: '#000'
		, whiteKey: 'rgba(255,255,255,0.3)'
		, blackKey: 'rgba(0,0,0,0.1)'
		, buttonFill: 'rgba(255,255,255,0.5)'//'#cdc'//'#00D9A3'
		, buttonShadow: 'rgba(0,0,0,0.05)'
		, buttonLabel: '#000'
		, bgCopy: '#fff'
		, noteLabel: '#fff'
		, fretLine0: '#000'
		, fretLine1: '#333'
		, fretLine4: '#666'
		, fretLine8: '#999'
	};
	this.modalDialogMode = false;
	this.volumes= [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
	this.subSamples=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	this.drumInfo = [{
		sound: _drum_35_0_Chaos_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'drum0'), 0, 70, 100),
		pitch: 36, //36
		title: 'Bass drum',
		id: 0,
		volumeRatio: 0.95,
		length: 0.5
	}, {
		sound: _drum_41_26_JCLive_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'drum1'), 0, 70, 100),
		pitch: 41, //43
		title: 'Low Tom',
		id: 1,
		volumeRatio: 0.5,
		length: 0.5
	}, {
		sound: _drum_38_22_FluidR3_GM_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'drum2'), 0, 70, 100),
		pitch: 38, //40
		title: 'Snare drum',
		id: 2,
		volumeRatio: 1.0,
		length: 0.5
	}, {
		sound: _drum_45_26_JCLive_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'drum3'), 0, 70, 100),
		pitch: 45, //47,48,50
		title: 'Mid Tom',
		id: 3,
		volumeRatio: 0.75,
		length: 0.5
	}, {
		sound: _drum_42_26_JCLive_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'drum4'), 0, 70, 100),
		pitch: 42, //44
		title: 'Closed Hi-hat',
		id: 4,
		volumeRatio: 0.5,
		length: 1
	}, {
		sound: _drum_46_26_JCLive_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'drum5'), 0, 70, 100),
		pitch: 46, //
		title: 'Open Hi-hat',
		id: 5,
		volumeRatio: 0.5,
		length: 1
	}, {
		sound: _drum_39_0_Chaos_sf2_file,//_drum_51_26_JCLive_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'drum6'), 0, 70, 100),
		pitch: 51, //rest
		title: 'Hand Clap',
		id: 6,
		volumeRatio: 0.3,
		length: 2
	}, {
		sound: _drum_49_26_JCLive_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'drum7'), 0, 70, 100),
		pitch: 49, //
		title: 'Splash Cymbal',
		id: 7,
		volumeRatio: 0.3,
		length: 3
	}
	];
	this.trackInfo = [{
		color: 'rgb(255,127,0)',
		shadow: 'rgba(255,127,0,0.25)',
		title: 'Synth Bass',
		order: 2,
		sound: _tone_0390_GeneralUserGS_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'track7'), 0, 70, 100),
		nn: 7,
		octave: 2,
		inChordDelay: 0.01,
		volumeRatio: 0.5
	}, {
		color: 'rgb(96,96,0)',
		shadow: 'rgba(96,96,0,0.25)',
		title: 'String Ensemble',
		order: 1,
		sound: _tone_0490_Chaos_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'track6'), 0, 70, 100),
		nn: 6,
		octave: 2,
		inChordDelay: 0,
		volumeRatio: 0.3
	}, {
		color: 'rgb(153,0,153)',
		shadow: 'rgba(153,0,153,0.25)',
		title: 'Bass guitar',
		order: 5,
		sound: _tone_0340_Aspirin_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'track5'), 0, 70, 100),
		nn: 5,
		octave: 2,
		inChordDelay: 0.01,
		volumeRatio: 0.75
		, linkedSlap: {
			sound: _tone_0360_Aspirin_sf2_file,
			octave: 2,
			inChordDelay: 0.01,
			volumeRatio: 0.75
		}
	}, {
		color: 'rgb(0,127,255)',
		shadow: 'rgba(0,127,255,0.25)',
		title: 'Grand Piano',
		order: 3,
		sound: _tone_0001_FluidR3_GM_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'track4'), 0, 70, 100),
		nn: 4,
		octave: 2,
		inChordDelay: 0,
		volumeRatio: 0.5
	}, {
		color: 'rgb(140,35,25)',
		shadow: 'rgba(140,35,25,0.25)',
		title: 'Jazz guitar',
		order: 4,
		sound: _tone_0260_GeneralUserGS_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'track3'), 0, 70, 100),
		nn: 3,
		octave: 2,
		inChordDelay: 0,
		volumeRatio: 1.0
	}, {
		color: 'rgb(35,0,140)',
		shadow: 'rgba(35,0,140,0.25)',
		title: 'Percussive Organ',
		order: 0,
		inChordDelay: 0,
		sound: _tone_0170_SBLive_sf2,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'track2'), 0, 70, 100),
		nn: 2,
		octave: 4,
		volumeRatio: 0.7
	}, {
		color: 'rgb(0,102,0)',
		shadow: 'rgba(0,102,0,0.25)',
		title: 'Acoustic guitar',
		order: 6,
		sound: _tone_0250_Chaos_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'track1'), 0, 70, 100),
		nn: 1,
		octave: 2,
		inChordDelay: 0.01,
		volumeRatio: 0.5
		, linkedPalmMute: {
			sound: _tone_0280_JCLive_sf2_file,
			octave: 2,
			inChordDelay: 0.01,
			volumeRatio: 0.75
		}
		, linkedHarmonics: {
			sound: _tone_0310_SoundBlasterOld_sf2,
			octave: 2,
			inChordDelay: 0.01,
			volumeRatio: 0.75
		}
	}, {
		color: 'rgb(255,0,0)',
		shadow: 'rgba(255,0,0,0.25)',
		title: 'Distortion guitar',
		order: 7,
		sound: _tone_0300_LesPaul_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'track0'), 0, 70, 100),
		nn: 0,
		octave: 2,
		inChordDelay: 0.01,
		volumeRatio: 0.7
		, linkedPalmMute: {
			sound: _tone_0280_LesPaul_sf2_file,
			octave: 2,
			inChordDelay: 0.01,
			volumeRatio: 0.75
		}
		, linkedHarmonics: {
			sound: _tone_0310_LesPaul_sf2_file,
			octave: 2,
			inChordDelay: 0.01,
			volumeRatio: 0.75
		}
	}

	];
	this.tiler.adjustContentPosition();
	
	var me = this;
	var accidentalLevel=3;
	var noteLevel=9;
	var measureLevel=50;
	var wholeLevel=500;
	this.tiler.addZoomLevel(accidentalLevel, function (left, top, width, height) {
		var lineWidth = 0.1 * me.tiler.tapSize;
		me.tileBackground(left, top, width, height, lineWidth);
		//me.tileLeftMenu(left, top, width, height, lineWidth);

		me.tileBarNumbers(9 * me.tiler.tapSize, left, top, width, height, lineWidth);
		if (me.options.hidePiano < 2) {
			me.tilePianoOctaveLines(left, top, width, height, lineWidth);
			me.tileOctaveNumbers(2 * me.tiler.tapSize, 3 * me.tiler.tapSize, left, top, width, height, lineWidth);
			me.tilePianorollNotes(left, top, width, height, lineWidth);
			me.tilePianoNoteSpot(left, top, width, height, lineWidth);
		}
		if (me.options.hideStaff < 2) {
			me.tileStaffLines(left, top, width, height, lineWidth);
			me.tileStaffKeySigns(left, top, width, height, lineWidth);
			me.tileStaffStems(left, top, width, height, lineWidth);
			me.tileStaffNotes(left, top, width, height, lineWidth);
			
			me.tileStaffNoteSpot(left, top, width, height, lineWidth);
		}
		if (me.options.hideFrets < 2) {
			me.tileFretLines(left, top, width, height, lineWidth);
			me.tileFretNotes(left, top, width, height, lineWidth);
			me.tileFretNoteSpot(left, top, width, height, lineWidth);
		}
		if (me.options.hideDrums < 2) {
			me.tileDrumLines(left, top, width, height, lineWidth);
			me.tileDrumNotes(left, top, width, height, lineWidth);
			me.tileDrumNames(left, top, width, height, lineWidth);
		}
		me.tileModalDialog(left, top, width, height, lineWidth);
	});

	this.tiler.addZoomLevel(noteLevel, function (left, top, width, height) {
		var lineWidth = 0.2 * me.tiler.tapSize;
		me.tileBackground(left, top, width, height, lineWidth);
		//me.tileLeftMenu(left, top, width, height, lineWidth);
		me.tileBarNumbers(11 * me.tiler.tapSize, left, top, width, height, lineWidth);
		if (me.options.hidePiano < 2) {
			me.tilePianoOctaveLines(left, top, width, height, lineWidth);
			me.tilePianoSpot(left, top, width, height, lineWidth);
			me.tilePianoOctaveKeys(left, top, width, height, lineWidth);
			me.tileOctaveNumbers(1.5 * me.tiler.tapSize, 7 * me.tiler.tapSize, left, top, width, height, lineWidth);
			me.tilePianorollGrid(left, top, width, height, lineWidth);
			me.tilePianorollNotes(left, top, width, height, lineWidth);
			me.tilePianorollMark(left, top, width, height, lineWidth);
		}
		if (me.options.hideStaff < 2) {
			me.tileStaffLines(left, top, width, height, lineWidth);
			me.tilStaffGrid(left, top, width, height, lineWidth);
			me.tileStaffKeySigns(left, top, width, height, lineWidth);
			me.tileStaffStems(left, top, width, height, lineWidth);
			me.tileStaffNotes(left, top, width, height, lineWidth);
			
			me.tileStaffMark(left, top, width, height, lineWidth);
			me.tileStaffSpot(left, top, width, height, lineWidth);
		}
		if (me.options.hideFrets < 2) {
			me.tileFretLines(left, top, width, height, lineWidth);
			me.tileFretGrid(left, top, width, height, lineWidth);
			me.tileFretNotes(left, top, width, height, lineWidth);
			me.tileFretSpot(left, top, width, height, lineWidth);
			me.tileFretMark(left, top, width, height, lineWidth);
		}
		if (me.options.hideDrums < 2) {
			me.tileDrumLines(left, top, width, height, lineWidth);
			me.tileDrumGrid(left, top, width, height, lineWidth);
			me.tileDrumNames(left, top, width, height, lineWidth);
			me.tileDrumSpot(left, top, width, height, lineWidth);
			me.tileDrumNotes(left, top, width, height, lineWidth);
		}
		me.tileModalDialog(left, top, width, height, lineWidth);
	});
	this.tiler.addZoomLevel(measureLevel, function (left, top, width, height) {
		var lineWidth = 0.3 * me.tiler.tapSize;
		me.tileBackground(left, top, width, height, lineWidth);
		//me.tileLeftMenu(left, top, width, height, lineWidth);
		me.tileBarNumbers(15 * me.tiler.tapSize, left, top, width, height, lineWidth);
		me.tileBarButtons(left, top, width, height, lineWidth);
		if (me.options.hidePiano < 2) {
			me.tilePianoOctaveLines(left, top, width, height, lineWidth);
			me.tilePianorollNotes(left, top, width, height, lineWidth);
		}
		if (me.options.hideStaff < 2) {
			me.tileStaffButtons(left, top, width, height, lineWidth);
			me.tileStaffLines(left, top, width, height, lineWidth);
			me.tileStaffKeySigns(left, top, width, height, lineWidth);
			me.tileStaffStems(left, top, width, height, lineWidth);
			me.tileStaffNotes(left, top, width, height, lineWidth);
			
		}
		if (me.options.hideFrets < 2) {
			me.tileFretLines(left, top, width, height, lineWidth);
			me.tileFretNotes(left, top, width, height, lineWidth);
		}
		if (me.options.hideDrums < 2) {
			me.tileDrumLines(left, top, width, height, lineWidth);
			me.tileDrumNotes(left, top, width, height, lineWidth);
		}
		me.tileModalDialog(left, top, width, height, lineWidth);
	});
	this.tiler.addZoomLevel(wholeLevel, function (left, top, width, height) {
		var lineWidth = 1 * me.tiler.tapSize;
		me.tileBackground(left, top, width, height, lineWidth);
		me.tileSomeBarNumbers(left, top, width, height, lineWidth);
		me.tileMeasurePlaceholders(left, top, width, height, lineWidth);
		me.tileModalDialog(left, top, width, height, lineWidth);
	});
	
	window.addEventListener("beforeunload", function () { me.saveState(me.prefix); });
	window.addEventListener("blur", function () { me.saveState(me.prefix); });
	document.getElementById('chooseFileInput').addEventListener('change', function (evt) { me.doImport(evt); }, false);
	me.resetUndoStatus();
	me.resetPinStatus();
	me.loadState(me.prefix);
	me.reCalcContentSize();
};



