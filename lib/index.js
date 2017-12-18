console.log('FretChordSheet v1.44');
function MeasureToneNote() {
	this.string = 0;
	this.pitch = 0;
	this.palmMute = 0;
	this.slap = 0;
	this.deadNote = 0;
	this.slides = [];
	return this;
}
function MeasureToneChord() {
	this.notes = [];
	this.direction = 0;
	return this;
}
function MeasureBeat() {
	this.start192 = 0;
	this.chords = [new MeasureToneChord(), new MeasureToneChord(), new MeasureToneChord(), new MeasureToneChord(), new MeasureToneChord(), new MeasureToneChord(), new MeasureToneChord(), new MeasureToneChord()];
	this.drums = [0, 0, 0, 0, 0, 0, 0, 0];
	return this;
}
function MeasureInfo() {
	this.beats = [];
	this.meter = 120;
	this.duration4 = 4;
	this.keys = 0;
	return this;
}
function FretChordSheet() {
	console.log('create FretChordSheet');
	return this;
}
FretChordSheet.prototype.saveState = function (prefix) {
	saveObject2localStorage(prefix + '_position', {
		tx: this.tiler.translateX
		, ty: this.tiler.translateY
		, tz: this.tiler.translateZ
		, feel: this.options.feel
		, measureMode: this.options.measureMode
		, measures: this.measures
		, trackOrder: this.trackOrder
		, markNotesCount: this.options.markNotesCount
		, breakMode: this.options.breakMode
		, hidePiano: this.options.hidePiano
		, hideStaff: this.options.hideStaff
		, hideFrets: this.options.hideFrets
		, hideDrums: this.options.hideDrums
	});
};
FretChordSheet.prototype.loadState = function (prefix) {
	try {
		var p = readObjectFromlocalStorage(prefix + '_position');
		this.tiler.translateX = sureNumeric(p.tx, -999999999, 0, 0);
		this.tiler.translateY = sureNumeric(p.ty, -999999999, 0, 0);
		this.tiler.translateZ = sureNumeric(p.tz, 1, 9, 500);
		this.options.feel = sureNumeric(p.feel, 0, 0, 4);
		this.options.breakMode = sureNumeric(p.breakMode, 0, 1, 2);
		this.options.markNotesCount = sureNumeric(p.markNotesCount, 1, 1, 3);
		this.options.measureMode = sureNumeric(p.measureMode, 0, 1, 4);
		this.options.hidePiano = sureNumeric(p.hidePiano, 1, 1, 2);
		this.options.hideStaff = sureNumeric(p.hideStaff, 1, 1, 2);
		this.options.hideFrets = sureNumeric(p.hideFrets, 1, 1, 2);
		this.options.hideDrums = sureNumeric(p.hideDrums, 1, 1, 2);
		this.resetHeaderWidth();
		this.measures = sureArray(p.measures, []);
		this.trackOrder = sureArray(p.trackOrder, [0, 1, 2, 3, 4, 5, 6, 7]);
		this.shrinkMeasures();
	} catch (e) {
		console.log(e);
	}

};
FretChordSheet.prototype.resetHeaderWidth = function () {
	if (this.options.breakMode > 1) {
		this.options.measureHeader = 10;
	} else {
		if (this.options.breakMode > 0) {
			this.options.measureHeader = 5;
		} else {
			this.options.measureHeader = 0;
		}
	}
};
FretChordSheet.prototype.reCalcContentSize = function () {

	this.contentHeight = 121 * 3 * this.tiler.tapSize;
	//this.options.sheetTop= (1 + 12 * 5 + 1) * 3 * this.tiler.tapSize;
	//this.options.fretTop= (1 + 12 * 5 + 1 + 6 * 7 + 1) * 3 * this.tiler.tapSize;
	//this.options.drumsTop= (1 + 12 * 5 + 1 + 6 * 7 + 1 + 6 + 1) * 3 * this.tiler.tapSize;
	this.margins.sheetTop = 1 * 3 * this.tiler.tapSize;
	this.margins.fretTop = 1 * 3 * this.tiler.tapSize;
	this.margins.drumsTop = 1 * 3 * this.tiler.tapSize;
	if (this.options.hidePiano < 2) {
		this.margins.sheetTop = this.margins.sheetTop + (12 * 5 + 1) * 3 * this.tiler.tapSize;
		this.margins.fretTop = this.margins.fretTop + (12 * 5 + 1) * 3 * this.tiler.tapSize;
		this.margins.drumsTop = this.margins.drumsTop + (12 * 5 + 1) * 3 * this.tiler.tapSize;
	}
	if (this.options.hideStaff < 2) {
		this.margins.fretTop = this.margins.fretTop + (6 * 7 + 1) * 3 * this.tiler.tapSize;
		this.margins.drumsTop = this.margins.drumsTop + (6 * 7 + 1) * 3 * this.tiler.tapSize;
	}
	if (this.options.hideFrets < 2) {
		this.margins.drumsTop = this.margins.drumsTop + (6 + 1) * 3 * this.tiler.tapSize;
	}
	//console.log(this.options);



	this.tiler.resetInnerSize(this.calcContentWidth(), this.contentHeight);
	this.tiler.resetSize();
};
FretChordSheet.prototype.calcContentWidth = function () {
	var minfo = this.measureInfo(0);
	var r = this.margins.sheetLeft;
	for (var i = 0; i < this.measures.length; i++) {
		minfo = this.measureInfo(i);
		r = r + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
	minfo = this.measureInfo(this.measureInfo.length - 1);
	r = r + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	return r;
};
FretChordSheet.prototype.measureInfo = function (n) {
	for (var i = 0; i <= n; i++) {
		if (this.measures[i]) {
			//
		} else {
			this.measures[i] = new MeasureInfo();
		}
	}
	return this.measures[n];
};
FretChordSheet.prototype.beatInfo = function (minfo, start192) {
	for (var i = 0; i < minfo.beats.length; i++) {
		if (minfo.beats[i].start192 == start192) {
			return minfo.beats[i];
		}
	}
	var b = new MeasureBeat();
	b.start192 = start192;
	minfo.beats.push(b);
	return b;
};

/*FretChordSheet.prototype.dropNoteFromChord = function (chord, pitch) {
	for (var i = 0; i < chord.notes.length; i++) {
		if (chord.notes[i].pitch == pitch) {
			chord.notes.splice(i, 1);
			break;
		}
	}
};*/
FretChordSheet.prototype.init = function () {
	console.log('init FretChordSheet');
	this.prefix = 'as13';
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
	this.margins = {
		sheetLeft: 60 * this.tiler.tapSize
		, pianorollTop: (1) * 3 * this.tiler.tapSize
		, sheetTop: (1 + 12 * 5 + 1) * 3 * this.tiler.tapSize
		, fretTop: (1 + 12 * 5 + 1 + 6 * 7 + 1) * 3 * this.tiler.tapSize
		, drumsTop: (1 + 12 * 5 + 1 + 6 * 7 + 1 + 6 + 1) * 3 * this.tiler.tapSize

	};
	this.feelNames = ['straight 1/8', 'straight 1/16', 'swing 1/16', 'triplet 2/16', 'straight 1/32'];
	this.breakNames = ['none', 'narrow', 'wide'];

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
	this.strings = [28, 23, 19, 14, 9, 4];
	this.markNotes = [];
	//this.markNotesCount = 2;
	this.markStaff = null;
	this.markFret = null;
	this.contentHeight = 121 * 3 * this.tiler.tapSize;
	this.trackOrder = [0, 1, 2, 3, 4, 5, 6, 7];
	this.colors = {
		base: '#000'
		, grid: 'rgba(0,0,0,0.2)'
		, barCounter: 'rgba(0,0,0,0.2)'
		, staff: '#000'
		, whiteKey: 'rgba(255,255,255,0.3)'
		, blackKey: 'rgba(0,0,0,0.1)'
		, buttonFill: '#cdc'//'#00D9A3'
		, buttonShadow: '#eee'
		, buttonLabel: '#000'
		, bgCopy: '#fff'
		, noteLabel: '#fff'
		, fretLine0: '#000'
		, fretLine1: '#333'
		, fretLine4: '#666'
		, fretLine8: '#999'
		//, noteLabel: '#dddddd'
	};
	this.drumInfo = [{
		//sound: _drum_35_0_Chaos_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'drum0'), 0, 70, 100),
		pitch: 36, //36
		title: 'Bass drum',
		id: 0,
		volumeRatio: 0.95,
		length: 0.5
	}, {
		//sound: _drum_41_26_JCLive_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'drum1'), 0, 70, 100),
		pitch: 41, //43
		title: 'Low Tom',
		id: 1,
		volumeRatio: 0.5,
		length: 0.5
	}, {
		//sound: _drum_38_22_FluidR3_GM_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'drum2'), 0, 70, 100),
		pitch: 38, //40
		title: 'Snare drum',
		id: 2,
		volumeRatio: 1.0,
		length: 0.5
	}, {
		//sound: _drum_45_26_JCLive_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'drum3'), 0, 70, 100),
		pitch: 45, //47,48,50
		title: 'Mid Tom',
		id: 3,
		volumeRatio: 0.75,
		length: 0.5
	}, {
		//sound: _drum_42_26_JCLive_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'drum4'), 0, 70, 100),
		pitch: 42, //44
		title: 'Closed Hi-hat',
		id: 4,
		volumeRatio: 0.5,
		length: 1
	}, {
		//sound: _drum_46_26_JCLive_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'drum5'), 0, 70, 100),
		pitch: 46, //
		title: 'Open Hi-hat',
		id: 5,
		volumeRatio: 0.5,
		length: 1
	}, {
		//sound: _drum_39_0_Chaos_sf2_file,//_drum_51_26_JCLive_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'drum6'), 0, 70, 100),
		pitch: 51, //rest
		title: 'Hand Clap',
		id: 6,
		volumeRatio: 0.3,
		length: 2
	}, {
		//sound: _drum_49_26_JCLive_sf2_file,
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
		shadow: 'rgba(255,127,0,0.4)',
		title: 'Synth Bass',
		order: 2,
		//sound: _tone_0390_GeneralUserGS_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'track7'), 0, 70, 100),
		nn: 7,
		octave: 3,
		inChordDelay: 0.01,
		volumeRatio: 0.5
	}, {
		color: 'rgb(127,178,0)',
		shadow: 'rgba(127,178,0,0.4)',
		title: 'String Ensemble',
		order: 1,
		//sound: _tone_0490_Chaos_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'track6'), 0, 70, 100),
		nn: 6,
		octave: 3,
		inChordDelay: 0,
		volumeRatio: 0.3
	}, {
		color: 'rgb(153,0,153)',
		shadow: 'rgba(153,0,153,0.4)',
		title: 'Bass guitar',
		order: 5,
		//sound: _tone_0340_Aspirin_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'track5'), 0, 70, 100),
		nn: 5,
		octave: 2,
		inChordDelay: 0.01,
		volumeRatio: 0.75
		, linkedSlap: {
			//sound: _tone_0360_Aspirin_sf2_file,
			octave: 2,
			inChordDelay: 0.01,
			volumeRatio: 0.75
		}
	}, {
		color: 'rgb(0,127,255)',
		shadow: 'rgba(0,127,255,0.4)',
		title: 'Grand Piano',
		order: 3,
		//sound: _tone_0001_FluidR3_GM_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'track4'), 0, 70, 100),
		nn: 4,
		octave: 3,
		inChordDelay: 0,
		volumeRatio: 0.5
	}, {
		color: 'rgb(140,35,25)',
		shadow: 'rgba(140,35,25,0.4)',
		title: 'Jazz guitar',
		order: 4,
		//sound: _tone_0260_GeneralUserGS_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'track3'), 0, 70, 100),
		nn: 3,
		octave: 3,
		inChordDelay: 0,
		volumeRatio: 1.0
	}, {
		color: 'rgb(35,0,140)',
		shadow: 'rgba(35,0,140,0.4)',
		title: 'Percussive Organ',
		order: 0,
		inChordDelay: 0,
		//sound: _tone_0170_SBLive_sf2,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'track2'), 0, 70, 100),
		nn: 2,
		octave: 4,
		volumeRatio: 0.7
	}, {
		color: 'rgb(0,102,0)',
		shadow: 'rgba(0,102,0,0.4)',
		title: 'Acoustic guitar',
		order: 6,
		//sound: _tone_0250_Chaos_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'track1'), 0, 70, 100),
		nn: 1,
		octave: 3,
		inChordDelay: 0.01,
		volumeRatio: 0.5
		, linkedPalmMute: {
			//sound: _tone_0280_JCLive_sf2_file,
			octave: 3,
			inChordDelay: 0.01,
			volumeRatio: 0.75
		}
		, linkedHarmonics: {
			//sound: _tone_0310_SoundBlasterOld_sf2,
			octave: 3,
			inChordDelay: 0.01,
			volumeRatio: 0.75
		}
	}, {
		color: 'rgb(255,0,0)',
		shadow: 'rgba(255,0,0,0.4)',
		title: 'Distortion guitar',
		order: 7,
		//sound: _tone_0300_LesPaul_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'track0'), 0, 70, 100),
		nn: 0,
		octave: 3,
		inChordDelay: 0.01,
		volumeRatio: 0.7
		, linkedPalmMute: {
			//sound: _tone_0280_LesPaul_sf2_file,
			octave: 3,
			inChordDelay: 0.01,
			volumeRatio: 0.75
		}
		, linkedHarmonics: {
			//sound: _tone_0310_LesPaul_sf2_file,
			octave: 3,
			inChordDelay: 0.01,
			volumeRatio: 0.75
		}
	}

	];
	this.tiler.adjustContentPosition();
	var me = this;
	this.tiler.addZoomLevel(3, function (left, top, width, height) {
		var lineWidth = 0.1 * me.tiler.tapSize;
		me.tileBackground(left, top, width, height, lineWidth);
		me.tileLeftMenu(left, top, width, height, lineWidth);

		me.tileBarNumbers(9 * me.tiler.tapSize, left, top, width, height, lineWidth);
		if (me.options.hidePiano < 2) {
			me.tilePianoOctaveLines(left, top, width, height, lineWidth);
			me.tileOctaveNumbers(2 * me.tiler.tapSize, 3 * me.tiler.tapSize, left, top, width, height, lineWidth);
			me.tilePianorollNotes(left, top, width, height, lineWidth);
		}
		if (me.options.hideStaff < 2) {
			me.tileStaffLines(left, top, width, height, lineWidth);
			me.tileStaffKeySigns(left, top, width, height, lineWidth);
			me.tileStaffNotes(left, top, width, height, lineWidth);
		}
		if (me.options.hideFrets < 2) {
			me.tileFretLines(left, top, width, height, lineWidth);
		}
		if (me.options.hideDrums < 2) {
			me.tileDrumLines(left, top, width, height, lineWidth);
			me.tileDrumNotes(left, top, width, height, lineWidth);
			me.tileDrumNames(left, top, width, height, lineWidth);
		}
	});

	this.tiler.addZoomLevel(9, function (left, top, width, height) {
		var lineWidth = 0.2 * me.tiler.tapSize;
		me.tileBackground(left, top, width, height, lineWidth);
		me.tileLeftMenu(left, top, width, height, lineWidth);
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
			//me.tileStaffButtons(left, top, width, height, lineWidth);
			me.tileStaffKeySigns(left, top, width, height, lineWidth);
			me.tileStaffNotes(left, top, width, height, lineWidth);

		}
		if (me.options.hideFrets < 2) {
			me.tileFretLines(left, top, width, height, lineWidth);
			me.tileFretGrid(left, top, width, height, lineWidth);
		}
		if (me.options.hideDrums < 2) {
			me.tileDrumLines(left, top, width, height, lineWidth);
			me.tileDrumGrid(left, top, width, height, lineWidth);
			me.tileDrumNames(left, top, width, height, lineWidth);
			me.tileDrumSpot(left, top, width, height, lineWidth);
			me.tileDrumNotes(left, top, width, height, lineWidth);
		}
	});
	this.tiler.addZoomLevel(50, function (left, top, width, height) {
		var lineWidth = 0.3 * me.tiler.tapSize;
		me.tileBackground(left, top, width, height, lineWidth);
		me.tileLeftMenu(left, top, width, height, lineWidth);
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
			me.tileStaffNotes(left, top, width, height, lineWidth);
		}
		if (me.options.hideFrets < 2) {
			me.tileFretLines(left, top, width, height, lineWidth);
		}
		if (me.options.hideDrums < 2) {
			me.tileDrumLines(left, top, width, height, lineWidth);
			me.tileDrumNotes(left, top, width, height, lineWidth);
		}
	});
	this.tiler.addZoomLevel(500, function (left, top, width, height) {
		var lineWidth = 1 * me.tiler.tapSize;
		me.tileBackground(left, top, width, height, lineWidth);
		me.tileSomeBarNumbers(left, top, width, height, lineWidth);
		me.tileMeasurePlaceholders(left, top, width, height, lineWidth);
	});
	window.addEventListener("beforeunload", function () { me.saveState(me.prefix); });
	window.addEventListener("blur", function () { me.saveState(me.prefix); });
	document.getElementById('chooseFileInput').addEventListener('change', function (evt) { me.doImport(evt); }, false);
	me.resetUndoStatus();
	me.loadState(me.prefix);
	me.reCalcContentSize();
};
FretChordSheet.prototype.findMeasureBeat192 = function (clickX, measureX, measure) {
	var quarter = Math.floor((clickX - measureX) / (8 * 3 * this.tiler.tapSize));
	var remains = (clickX - measureX) % (8 * 3 * this.tiler.tapSize)
	var r6 = -1;
	var l6 = -1;
	var fl = this.feelPattern6[this.options.feel];
	for (var i = 1; i < fl.length; i++) {
		if (remains >= fl[i - 1] * 3 * this.tiler.tapSize / 6 && remains <= fl[i] * 3 * this.tiler.tapSize / 6) {
			r6 = fl[i - 1];
			l6 = fl[i] - fl[i - 1];
			break;
		}
	}
	var r = { quarter: quarter, left6: r6, duration6: l6 };
	return r;
}
FretChordSheet.prototype.findBeatDistance = function (measureNum, step192, toNum, toStep192) {
	if (measureNum == toNum) {
		return toStep192 - step192;
	} else {
		var minfo = this.measureInfo(measureNum);
		var len192 = minfo.duration4 * 8 * 6 - step192;
		for (var i = measureNum + 1; i <= toNum - 1; i++) {
			minfo = this.measureInfo(i);
			len192 = len192 + minfo.duration4 * 8 * 6
		}
		return len192 + toStep192;
	}
};
FretChordSheet.prototype.findBeatX = function (measureNum, step192) {
	var x = this.margins.sheetLeft + this.options.measureHeader * 3 * this.tiler.tapSize;
	for (var i = 0; i < this.measures.length; i++) {
		if (i < measureNum) {
			x = x + (this.options.measureHeader + this.measures[i].duration4 * 8) * 3 * this.tiler.tapSize;
		} else {
			break;
		}
	}
	var ms192 = 0;
	var m = null;
	for (var i = measureNum; i < this.measures.length; i++) {
		m = this.measures[i];
		if (step192 < ms192 + m.duration4 * 8 * 6) {
			x = x + (step192 - ms192) / 6 * 3 * this.tiler.tapSize;
			return x;
		} else {
			x = x + (this.options.measureHeader + m.duration4 * 8) * 3 * this.tiler.tapSize;
			ms192 = ms192 + m.duration4 * 8 * 6;
		}
	}
	x = x + (step192 - ms192) / 6 * 3 * this.tiler.tapSize;
	return x;
};
FretChordSheet.prototype.note7 = function (pitch) {
	var n12 = pitch - Math.floor(pitch / 12) * 12;
	var n7 = 0;
	if (n12 == 2 || n12 == 3) n7 = 1;
	if (n12 == 4) n7 = 2;
	if (n12 == 5 || n12 == 6) n7 = 3;
	if (n12 == 7 || n12 == 8) n7 = 4;
	if (n12 == 9 || n12 == 10) n7 = 5;
	if (n12 == 11) n7 = 6;
	return n7;
};
FretChordSheet.prototype.note12 = function (n7) {
	if (n7 == 0) return 0;
	if (n7 == 1) return 2;
	if (n7 == 2) return 4;
	if (n7 == 3) return 5;
	if (n7 == 4) return 7;
	if (n7 == 5) return 9;
	return 11;
};
FretChordSheet.prototype.name7 = function (pitch) {
	var n12 = pitch - Math.floor(pitch / 12) * 12;
	var n7 = 'C';
	if (n12 == 1) n7 = 'C#';
	if (n12 == 2) n7 = 'D';
	if (n12 == 3) n7 = 'D#';
	if (n12 == 4) n7 = 'E';
	if (n12 == 5) n7 = 'F';
	if (n12 == 6) n7 = 'F#';
	if (n12 == 7) n7 = 'G';
	if (n12 == 8) n7 = 'G#';
	if (n12 == 9) n7 = 'A';
	if (n12 == 10) n7 = 'A#';
	if (n12 == 11) n7 = 'B';
	return n7;
};
FretChordSheet.prototype.stringNumber = function (pitch) {
	var r6 = 1;
	for (var i = 0; i < this.strings.length; i++) {
		r6 = i + 1;
		if (this.strings[i] <= pitch) {
			break;
		}
	}
	return r6;
};
FretChordSheet.prototype.tileBackground = function (left, top, width, height, lineWidth) {
	/*var me = this;
	this.layerBack.renderGroup(0, 0, this.calcContentWidth(), this.contentHeight
		, 'bgPane', left, top, width, height, function (tg) {
			tg.layer.tileRectangle(tg.g, tg.x, tg.y, tg.w, tg.h, 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.05)', tg.layer.tapSize);
		});*/
};
FretChordSheet.prototype.findDrums = function (morder, start192, duration192, drum) {
	var noteDrums = [];
	if (morder < this.measures.length) {
		minfo = this.measures[morder];
		for (var i = 0; i < minfo.beats.length; i++) {
			var measureBeat = minfo.beats[i];
			if (measureBeat.start192 >= start192 && measureBeat.start192 < start192 + duration192) {
				if (measureBeat.drums[drum]) {
					noteDrums.push({ morder: morder, beatStart: measureBeat.start192, drum: drum });
				}
			}
		}
	}
	return noteDrums;
};
FretChordSheet.prototype.findNotes = function (track, morder, start192, duration192, pitch) {
	var notes = [];
	if (morder < this.measures.length) {
		minfo = this.measures[morder];
		for (var i = 0; i < minfo.beats.length; i++) {
			var measureBeat = minfo.beats[i];
			if (measureBeat.start192 >= start192 && measureBeat.start192 < start192 + duration192) {
				/*if (measureBeat.drums[drum]) {
					notes.push({ morder: morder, beatStart: measureBeat.start192, drum: drum });
				}*/
				var measureToneChord = measureBeat.chords[track];
				for (var n = 0; n < measureToneChord.notes.length; n++) {
					var measureToneNote = measureToneChord.notes[n];
					if (measureToneNote.pitch == pitch) {
						//measureToneChord.notes.splice(n, 1);
						//console.log('found',track, morder, beatStart, pitch);
						//break;
						notes.push({ track: track, morder: morder, beatStart: measureBeat.start192, note: measureToneNote });
					}
				}
			}
		}
	}
	return notes;
};
FretChordSheet.prototype.dropDrumAtBeat = function (morder, beatStart, drum) {
	if (morder < this.measures.length) {
		minfo = this.measures[morder];
		for (var i = 0; i < minfo.beats.length; i++) {
			var measureBeat = minfo.beats[i];
			if (measureBeat.start192 == beatStart) {
				measureBeat.drums[drum] = 0;
			}
		}
	}
};
FretChordSheet.prototype.dropNoteAtBeat = function (track, morder, beatStart, pitch) {
	//console.log('dropNoteAtBeat',track, morder, beatStart, pitch);
	if (morder < this.measures.length) {
		minfo = this.measures[morder];
		for (var i = 0; i < minfo.beats.length; i++) {
			var measureBeat = minfo.beats[i];
			if (measureBeat.start192 == beatStart) {
				var measureToneChord = measureBeat.chords[track];
				for (var n = 0; n < measureToneChord.notes.length; n++) {
					var measureToneNote = measureToneChord.notes[n];
					if (measureToneNote.pitch == pitch) {
						measureToneChord.notes.splice(n, 1);
						//console.log('found',track, morder, beatStart, pitch);
						break;
					}
				}
			}
		}
	}
};
FretChordSheet.prototype.cloneNote = function (measureToneNote) {
	var clone = new MeasureToneNote();
	clone.string = measureToneNote.string;
	clone.pitch = measureToneNote.pitch;
	clone.palmMute = measureToneNote.palmMute;
	clone.slap = measureToneNote.slap;
	clone.deadNote = measureToneNote.deadNote;
	for (var i = 0; i < measureToneNote.slides.length; i++) {
		clone.slides[i] = { shift: measureToneNote.slides[i].shift, end192: measureToneNote.slides[i].end192 };
	}
	return clone;
};
FretChordSheet.prototype.cloneChord = function (measureToneChord) {
	var clone = new MeasureToneChord();
	clone.direction = measureToneChord.direction;
	for (var i = 0; i < measureToneChord.notes.length; i++) {
		clone.notes[i] = this.cloneNote(measureToneChord.notes[i]);
	}
	return clone;
};
FretChordSheet.prototype.cloneBeat = function (measureBeat) {
	var clone = new MeasureBeat();
	clone.start192 = measureBeat.start192;
	for (var i = 0; i < measureBeat.drums.length; i++) {
		clone.drums[i] = measureBeat.drums[i];
	}
	for (var i = 0; i < measureBeat.chords.length; i++) {
		clone.chords[i] = this.cloneChord(measureBeat.chords[i]);
	}
	return clone;
};
FretChordSheet.prototype.cloneMeasure = function (morder) {
	var clone = new MeasureInfo();
	if (morder < this.measures.length) {
		minfo = this.measures[morder];
		clone.meter = minfo.meter;
		clone.duration4 = minfo.duration4;
		for (var i = 0; i < minfo.beats.length; i++) {
			clone.beats[i] = this.cloneBeat(minfo.beats[i]);
		}
	}
	return clone;
};
FretChordSheet.prototype.tilePianoSpot = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	var minfo = this.measureInfo(0);
	for (var x = 0; x <= this.measures.length; x++) {
		var d32 = 0;
		if (x < this.measures.length) {
			d32 = this.measures[x].duration4 * 8;
		} else {
			d32 = this.measures[x - 1].duration4 * 8;
		}
		for (var y = 0; y < 5; y++) {
			this.layerOctaves.renderGroup(mx + this.margins.sheetLeft + this.options.measureHeader * 3 * this.tiler.tapSize
				, this.margins.pianorollTop + y * 3 * 12 * this.tiler.tapSize
				, (this.options.measureHeader + d32) * 3 * this.tiler.tapSize - this.options.measureHeader * 3 * this.tiler.tapSize
				, 12 * 3 * this.tiler.tapSize
				, 'sptPR' + x + 'x' + y, left, top, width, height, function (tg) {
					var s = tg.layer.addSpot(tg.id, tg.x, tg.y, tg.w, tg.h, function () {
						var measure = me.measureInfo(this.morder);
						var _x = me.findMeasureBeat192(me.tiler.clickContentX, this.mx, measure);//this.minfo);
						var start192 = _x.quarter * 8 * 6 + _x.left6;
						var duration192 = _x.duration6;
						var pitch = 59 - Math.floor((me.tiler.clickContentY - me.margins.pianorollTop) / (3 * me.tiler.tapSize));
						var track = -1;
						for (var k = 0; k < me.trackOrder.length; k++) {
							if (me.trackOrder[k] == 0) {
								track = k;
								break;
							}
						}
						//console.log('track',track);
						if (me.markNotes.length >= me.options.markNotesCount) {
							me.markNotes.splice(0, 0, { minfo: measure, morder: this.morder, start192: start192, duration192: duration192, pitch: pitch });
							me.markNotes.sort(function (a, b) {
								return a.morder * 1000 + a.start192 - (b.morder * 1000 + b.start192);
							});
							var note = new MeasureToneNote();
							note.pitch = me.markNotes[0].pitch;
							//var beat = me.beatInfo(me.markNotes[0].minfo, me.markNotes[0].start192);
							//beat.chords[track].notes.push(note);
							//console.log('start192', me.markNotes[0].start192, 'morder', me.markNotes[0].morder);
							for (var mm = 1; mm < me.markNotes.length; mm++) {
								var from = me.markNotes[mm - 1];
								var to = me.markNotes[mm];
								var fullTo192 = me.findBeatDistance(me.markNotes[0].morder, me.markNotes[0].start192, to.morder, to.start192);
								note.slides.push({ shift: from.pitch - to.pitch, end192: fullTo192 + to.duration192 });
							}

							me.userActionAddNote(track, me.markNotes[0].morder, me.markNotes[0].start192, note);
							me.markNotes = [];
							me.shrinkMeasures();
							me.reCalcContentSize();
						} else {
							if (me.markNotes.length > 0) {
								me.markNotes.push({ minfo: me.measureInfo(this.morder), morder: this.morder, start192: start192, duration192: duration192, pitch: pitch });
							} else {
								var noteBeats = me.findNotes(track, this.morder, start192, duration192, pitch);
								if (noteBeats.length > 0) {
									/*for (var d = 0; d < noteBeats.length; d++) {
										me.dropNoteAtBeat(noteBeats[d].track, noteBeats[d].morder, noteBeats[d].beatStart, noteBeats[d].note.pitch);
									}*/
									me.userActionDropNotes(track, this.morder, start192, duration192, pitch)
								} else {
									me.markNotes.push({ minfo: me.measureInfo(this.morder), morder: this.morder, start192: start192, duration192: duration192, pitch: pitch });
								}
							}
						}

					});
					s.mx = tg.x;
					s.morder = x;
				});
		}
		mx = mx + (this.options.measureHeader + d32) * 3 * this.tiler.tapSize;
	}
};



FretChordSheet.prototype.tileDrumSpot = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	var minfo = this.measureInfo(0);
	for (var x = 0; x <= this.measures.length; x++) {
		var d32 = 0;
		if (x < this.measures.length) {
			d32 = this.measures[x].duration4 * 8;
		} else {
			d32 = this.measures[x - 1].duration4 * 8;
		}
		//for (var y = 0; y < 5; y++) {
		this.layerOctaves.renderGroup(mx + this.margins.sheetLeft + this.options.measureHeader * 3 * this.tiler.tapSize
			, this.margins.drumsTop //+ y * 3 * 12 * this.tiler.tapSize
			, (this.options.measureHeader + d32) * 3 * this.tiler.tapSize - this.options.measureHeader * 3 * this.tiler.tapSize
			, 8 * 3 * this.tiler.tapSize
			, 'sptDrms' + x, left, top, width, height, function (tg) {
				//tg.layer.tileCircle(tg.g, tg.x , tg.y , 3 * me.tiler.tapSize / 2, '#ff00ff');
				//tg.layer.tileRectangle(tg.g, tg.x, tg.y, tg.w, tg.h, 'rgba(255,0,0,0)', 'rgba(255,0,0,0.25)', tg.w*tg.h/100000);
				var s = tg.layer.addSpot(tg.id, tg.x, tg.y, tg.w, tg.h, function () {
					var measure = me.measureInfo(this.morder);

					var _x = me.findMeasureBeat192(me.tiler.clickContentX, this.mx, measure);//this.minfo);
					console.log('moreder', this.morder, 'measureX', this.mx, 'contentX', me.tiler.clickContentX, _x);
					var start192 = _x.quarter * 8 * 6 + _x.left6;
					var duration192 = _x.duration6;
					var drum = Math.floor((me.tiler.clickContentY - me.margins.drumsTop) / (3 * me.tiler.tapSize));
					//console.log(this.morder,start192,duration192,drum);
					var noteDrums = me.findDrums(this.morder, start192, duration192, drum);
					//console.log(noteDrums);
					if (noteDrums.length > 0) {
						me.userActionDropDrums(this.morder, start192, duration192, drum);
					} else {
						me.userActionAddDrum(this.morder, start192, drum);
					}
				});
				s.mx = tg.x;
				s.morder = x;
			});
		//}
		mx = mx + (this.options.measureHeader + d32) * 3 * this.tiler.tapSize;
	}
};

FretChordSheet.prototype.tilePianoOctaveLines = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	for (var x = 0; x < this.measures.length; x++) {
		var minfo = this.measureInfo(x);
		for (var y = 0; y < 5; y++) {
			this.layerOctaves.renderGroup(mx + this.margins.sheetLeft
				, this.margins.pianorollTop + y * 3 * 12 * this.tiler.tapSize
				, (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize
				, 12 * 3 * this.tiler.tapSize
				, 'octaveLines' + x + 'x' + y, left, top, width, height, function (tg) {
					if (y > 0) {
						tg.layer.tileRectangle(tg.g, tg.x, tg.y, tg.w, lineWidth, me.colors.base);
					}
					tg.layer.tileRectangle(tg.g, tg.x + tg.w, tg.y, 3 * lineWidth, tg.h, me.colors.base);
				});
		}
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
};



/*

*/
FretChordSheet.prototype.tileNoteNatural = function (x, y, tg) {
	tg.layer.tilePath(tg.g, tg.x + (x * 3 + 0.1) * tg.layer.tapSize
		, tg.y + (y * 3 - 4) * tg.layer.tapSize
		, 0.033 * tg.layer.tapSize //
		, "M 66.61286,320.84315 C 64.805667,319.79356 64.742121,318.17445 65.11286,282.62356 L 65.5,245.5 L 62,245.56379 C 60.075,245.59887 51.075,247.32926 42,249.40909 C 20.083352,254.43201 15.849529,254.84953 13.244763,252.24476 C 10.986338,249.98634 10.943053,248.75921 8.9679622,131 C 7.6544471,52.685357 7.7097889,27.690211 9.2,26.2 C 10.706751,24.693249 17.453715,24.63727 20.203121,26.108707 C 22.252486,27.205494 22.270595,27.616751 21.88738,64.358707 L 21.5,101.5 L 25,101.43621 C 26.925,101.40113 35.925,99.670743 45,97.590908 C 66.833242,92.587101 71.155059,92.155059 73.719854,94.719854 C 76.353767,97.353767 76.651799,106.06811 78.164429,224.67735 C 79.150878,302.02738 79.132272,319.1357 78.060294,320.42735 C 76.540709,322.25834 69.490449,322.51442 66.61286,320.84315 z M 35.661336,214.47043 C 49.2338,211.30284 62.99097,208.00194 65.134277,207.39867 C 66.410233,207.03954 66.89879,205.13656 67.362552,198.71934 C 68.228165,186.74158 68.616094,130.284 67.838133,129.50537 C 67.474106,129.14103 60.049106,130.52033 51.338133,132.57049 C 42.62716,134.62065 32.35,137.03321 28.5,137.93173 L 21.5,139.5654 L 20.858534,145.5327 C 20.505727,148.81471 20.168227,166.2375 20.108534,184.25 L 20,217 L 22.411336,217 C 23.737571,217 29.700071,215.8617 35.661336,214.47043 z " //
		, this.colors.base);
}
FretChordSheet.prototype.tileNoteSharp = function (x, y, tg) {
	tg.layer.tilePath(tg.g, tg.x + (x * 3 - 42) * tg.layer.tapSize
		, tg.y + (y * 3 - 220.75) * tg.layer.tapSize
		, 0.5 * tg.layer.tapSize //
		, "M 86.102000,447.45700 L 86.102000,442.75300 L 88.102000,442.20100 L 88.102000,446.88100 L 86.102000,447.45700 z M 90.040000,446.31900 L 88.665000,446.71300 L 88.665000,442.03300 L 90.040000,441.64900 L 90.040000,439.70500 L 88.665000,440.08900 L 88.665000,435.30723 L 88.102000,435.30723 L 88.102000,440.23400 L 86.102000,440.80900 L 86.102000,436.15923 L 85.571000,436.15923 L 85.571000,440.98600 L 84.196000,441.37100 L 84.196000,443.31900 L 85.571000,442.93500 L 85.571000,447.60600 L 84.196000,447.98900 L 84.196000,449.92900 L 85.571000,449.54500 L 85.571000,454.29977 L 86.102000,454.29977 L 86.102000,449.37500 L 88.102000,448.82500 L 88.102000,453.45077 L 88.665000,453.45077 L 88.665000,448.65100 L 90.040000,448.26600 L 90.040000,446.31900 z " //
		, this.colors.base);
}
FretChordSheet.prototype.tileNoteFlat = function (x, y, tg) {
	tg.layer.tilePath(tg.g, tg.x + (x * 3 - 81) * tg.layer.tapSize
		, tg.y + (y * 3 - 376.5) * tg.layer.tapSize
		, 0.85 * tg.layer.tapSize //
		, "M 98.166,443.657 C 98.166,444.232 97.950425,444.78273 97.359,445.52188 C 96.732435,446.30494 96.205,446.75313 95.51,447.28013 L 95.51,443.848 C 95.668,443.449 95.901,443.126 96.21,442.878 C 96.518,442.631 96.83,442.507 97.146,442.507 C 97.668,442.507 97.999,442.803 98.142,443.393 C 98.158,443.441 98.166,443.529 98.166,443.657 z M 98.091,441.257 C 97.66,441.257 97.222,441.376 96.776,441.615 C 96.33,441.853 95.908,442.172 95.51,442.569 L 95.51,435.29733 L 94.947,435.29733 L 94.947,447.75213 C 94.947,448.10413 95.043,448.28013 95.235,448.28013 C 95.346,448.28013 95.483913,448.18713 95.69,448.06413 C 96.27334,447.71598 96.636935,447.48332 97.032,447.23788 C 97.482617,446.95792 97.99,446.631 98.661,445.991 C 99.124,445.526 99.459,445.057 99.667,444.585 C 99.874,444.112 99.978,443.644 99.978,443.179 C 99.978,442.491 99.795,442.002 99.429,441.713 C 99.015,441.409 98.568,441.257 98.091,441.257 z " //
		, this.colors.base);
}
FretChordSheet.prototype.tileNoteHead = function (x, y, tg) {
	tg.layer.tilePath(tg.g
		, tg.x + x * 3 * tg.layer.tapSize //+ 1.5 * tg.layer.tapSize
		, tg.y + (y * 3 - 0.5) * tg.layer.tapSize
		, 0.17 * tg.layer.tapSize //
		, "M0,25c-4.03729,-0.90252 -7.9074,-4.60195 -7.14222,-9.02873c0.05883,-5.52261 4.10862,-9.82038 8.21857,-12.80907c5.30957,-3.66664 13.99142,-5.87541 19.0695,-1.31335c5.07808,4.56206 2.7264,11.70948 0.16548,14.59555c-4.73015,5.95609 -12.62795,9.9081 -20.31133,8.55559l0,0.00001z" //
		, this.colors.base);
}

FretChordSheet.prototype.tileStaffKeys = function (minfo, tg, left, top, width, height, yShift) {
	var me = this;
	/*me.tileNoteHead(0, 0, tg);
	me.tileNoteHead(1, 1, tg);
	me.tileNoteHead(2, 2, tg);
	me.tileNoteHead(3, 3, tg);
	me.tileNoteHead(4, 4, tg);*/
	var keyArr = me.keys[minfo.keys];
	if (keyArr[0] == 1) me.tileNoteSharp(2, yShift * 7 + 7 * 6 - 1 - 7 * 4 - 0, tg);
	if (keyArr[1] == 1) me.tileNoteSharp(4, yShift * 7 + 7 * 6 - 1 - 7 * 4 - 1, tg);
	if (keyArr[2] == 1) me.tileNoteSharp(6, yShift * 7 + 7 * 6 - 1 - 7 * 4 - 2, tg);
	if (keyArr[3] == 1) me.tileNoteSharp(1, yShift * 7 + 7 * 6 - 1 - 7 * 4 - 3, tg);
	if (keyArr[4] == 1) me.tileNoteSharp(3, yShift * 7 + 7 * 6 - 1 - 7 * 4 - 4, tg);
	if (keyArr[5] == 1) me.tileNoteSharp(5, yShift * 7 + 7 * 6 - 1 - 7 * 4 + 2, tg);
	if (keyArr[6] == 1) me.tileNoteSharp(7, yShift * 7 + 7 * 6 - 1 - 7 * 4 + 1, tg);

	//me.tileNoteFlat(1,1,tg);

	if (keyArr[0] == -1) me.tileNoteFlat(6, yShift * 7 + 7 * 6 - 1 - 7 * 4 - 0, tg);
	if (keyArr[1] == -1) me.tileNoteFlat(4, yShift * 7 + 7 * 6 - 1 - 7 * 4 - 1, tg);
	if (keyArr[2] == -1) me.tileNoteFlat(2, yShift * 7 + 7 * 6 - 1 - 7 * 4 - 2, tg);
	if (keyArr[3] == -1) me.tileNoteFlat(7, yShift * 7 + 7 * 6 - 1 - 7 * 4 + 4, tg);
	if (keyArr[4] == -1) me.tileNoteFlat(5, yShift * 7 + 7 * 6 - 1 - 7 * 4 + 3, tg);
	if (keyArr[5] == -1) me.tileNoteFlat(3, yShift * 7 + 7 * 6 - 1 - 7 * 4 + 2, tg);
	if (keyArr[6] == -1) me.tileNoteFlat(1, yShift * 7 + 7 * 6 - 1 - 7 * 4 + 1, tg);
	/*
	if(me.keys[minfo.keys][0]==1)me.tileNoteSharp(12-9,9+yShift,tg);
	if(me.keys[minfo.keys][1]==1)me.tileNoteSharp(10-9,10+yShift,tg);
	if(me.keys[minfo.keys][2]==1)me.tileNoteSharp(15-9,11+yShift,tg);
	if(me.keys[minfo.keys][3]==1)me.tileNoteSharp(13-9,12+yShift,tg);
	if(me.keys[minfo.keys][4]==1)me.tileNoteSharp(11-9,13+yShift,tg);
	if(me.keys[minfo.keys][5]==1)me.tileNoteSharp(16-9,14+yShift,tg);
	if(me.keys[minfo.keys][6]==1)me.tileNoteSharp(14-9,15+yShift,tg);
	
	if(me.keys[minfo.keys][6]==-1)me.tileNoteFlat(12-11,14+yShift,tg);
	if(me.keys[minfo.keys][2]==-1)me.tileNoteFlat(13-11,11+yShift,tg);
	if(me.keys[minfo.keys][5]==-1)me.tileNoteFlat(14-11,15+yShift,tg);
	if(me.keys[minfo.keys][1]==-1)me.tileNoteFlat(15-11,12+yShift,tg);
	if(me.keys[minfo.keys][4]==-1)me.tileNoteFlat(16-11,16+yShift,tg);
	if(me.keys[minfo.keys][0]==-1)me.tileNoteFlat(17-11,13+yShift,tg);
	if(me.keys[minfo.keys][3]==-1)me.tileNoteFlat(18-11,17+yShift,tg);
	*/

}
FretChordSheet.prototype.pitch2staffY = function (pitch, hintOctave, hintStep) {
	var y = 0;
	var o = Math.floor(pitch / 12);
	var d = pitch % 12;
	var n = 0;
	if (d == 0 || d == 1) n = 0;
	if (d == 2 || d == 3) n = 1;
	if (d == 4) n = 2;
	if (d == 5 || d == 6) n = 3;
	if (d == 7 || d == 8) n = 4;
	if (d == 9 || d == 10) n = 5;
	if (d == 11) n = 6;
	return 6 * 7 - 7 * o - n - 1;
};
FretChordSheet.prototype.tileStaffNotes = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	for (var x = 0; x < this.measures.length; x++) {
		var minfo = this.measureInfo(x);
		this.layerOctaves.renderGroup(mx + this.margins.sheetLeft
			, this.margins.sheetTop
			, (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize
			, 6 * 7 * 3 * this.tiler.tapSize
			, 'staffNotes' + x, left, top, width, height, function (tg) {





				for (var b = 0; b < minfo.beats.length; b++) {
					var beat = minfo.beats[b];
					if (beat) {

						for (var c = 0; c < beat.chords.length; c++) {
							var o = me.trackOrder[c];
							if (o == 0) {
								var chord = beat.chords[c];
								if (chord)
									for (var n = 0; n < chord.notes.length; n++) {
										var note = chord.notes[n];
										if (note) {
											//if (note.pitch >= 12 * (4 - y) && note.pitch < 12 * (5 - y)) {
											//console.log(beat.start192 / 6, me.pitch2staffY(note.pitch, 0, 0));
											me.tileNoteHead(me.options.measureHeader+beat.start192 / 6, me.pitch2staffY(note.pitch, 0, 0), tg);
											/*
																						me.tilePianorollNoteLine(tg, note, beat.start192, x, me.trackInfo[c].color);
																						var dd = (beat.start192 / 6) * (3 * tg.layer.tapSize) + 0.95 * tg.layer.tapSize;
																						//console.log(tg.x,beat.start192,dd,tg.layer.tapSize);
																						tg.layer.tileText(tg.g, tg.x + dd, tg.y + (12 - note.pitch % 12) * 3 * tg.layer.tapSize - 0.5 * tg.layer.tapSize
																							, 2.5 * tg.layer.tapSize, me.keyName(note.pitch)
																							, me.colors.noteLabel);*/
											//}
										}
									}
							}
						}
					}
				}

























			});
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
};
FretChordSheet.prototype.tileStaffButtons = function (left, top, width, height, lineWidth) {
	//console.log('tileStaffButtons');
	var me = this;
	var mx = 0;
	for (var x = 0; x < this.measures.length; x++) {
		var minfo = this.measureInfo(x);
		this.layerOctaves.renderGroup(mx + this.margins.sheetLeft
			, this.margins.sheetTop
			, (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize
			, 6 * 7 * 3 * this.tiler.tapSize
			, 'staffButtons' + x, left, top, width, height, function (tg) {
				//tg.layer.tileRectangle(tg.g, tg.x + tg.w, tg.y + (31.5 + 6 * 0) * tg.layer.tapSize, lineWidth * 3, 81 * tg.layer.tapSize, me.colors.base);
				//me.tileNoteSharp(1,1,tg);
				//me.tileNoteFlat(1,1,tg);
				//me.tileNoteNatural(1,1,tg);
				var _x = x;
				s = me.tileKnob(tg, 'rollKyesSel_' + x, 3 * me.tiler.tapSize, 33 * me.tiler.tapSize, 20 * me.tiler.tapSize, '', function () {
					//console.log('test',_x);
					me.userActionRollKeys(_x);
				});
				s = me.tileKnob(tg, 'rollKyesSel2_' + x, 3 * me.tiler.tapSize, 90 * me.tiler.tapSize, 20 * me.tiler.tapSize, '', function () {
					//console.log('test',_x);
					me.userActionRollKeys(_x);
				});
				//console.log(x,me.keys[minfo.keys]);
				//if(me.keys[minfo.keys][0]==1){me.tileNoteSharp(9,10,tg);}
				//if(me.keys[minfo.keys][0]==1){me.tileNoteSharp(9,10,tg);}
				//me.tileStaffKeys(minfo,tg,left, top, width, height, 0);
				//me.tileStaffKeys(minfo,tg,left, top, width, height, 21);
			});
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
};
FretChordSheet.prototype.tileStaffKeySigns = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	for (var x = 0; x < this.measures.length; x++) {
		var minfo = this.measureInfo(x);
		this.layerOctaves.renderGroup(mx + this.margins.sheetLeft
			, this.margins.sheetTop
			, (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize
			, 6 * 7 * 3 * this.tiler.tapSize
			, 'staffKeys' + x, left, top, width, height, function (tg) {
				me.tileStaffKeys(minfo, tg, left, top, width, height, 0);
				me.tileStaffKeys(minfo, tg, left, top, width, height, 3);
			});
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
};

FretChordSheet.prototype.tileStaffLines = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	for (var x = 0; x < this.measures.length; x++) {
		var minfo = this.measureInfo(x);
		this.layerOctaves.renderGroup(mx + this.margins.sheetLeft
			, this.margins.sheetTop
			, (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize
			, 6 * 7 * 3 * this.tiler.tapSize
			, 'staffLines' + x, left, top, width, height, function (tg) {
				tg.layer.tileRectangle(tg.g, tg.x + tg.w, tg.y + (31.5 + 6 * 0) * tg.layer.tapSize, lineWidth * 3, 81 * tg.layer.tapSize, me.colors.base);

				tg.layer.tileRectangle(tg.g, tg.x, tg.y + (31.5 + 6 * 0) * tg.layer.tapSize, tg.w, lineWidth, me.colors.staff);
				tg.layer.tileRectangle(tg.g, tg.x, tg.y + (31.5 + 6 * 1) * tg.layer.tapSize, tg.w, lineWidth, me.colors.staff);
				tg.layer.tileRectangle(tg.g, tg.x, tg.y + (31.5 + 6 * 2) * tg.layer.tapSize, tg.w, lineWidth, me.colors.staff);
				tg.layer.tileRectangle(tg.g, tg.x, tg.y + (31.5 + 6 * 3) * tg.layer.tapSize, tg.w, lineWidth, me.colors.staff);
				tg.layer.tileRectangle(tg.g, tg.x, tg.y + (31.5 + 6 * 4) * tg.layer.tapSize, tg.w, lineWidth, me.colors.staff);
				var sk = 57;
				tg.layer.tileRectangle(tg.g, tg.x, tg.y + (31.5 + sk + 6 * 0) * tg.layer.tapSize, tg.w, lineWidth, me.colors.staff);
				tg.layer.tileRectangle(tg.g, tg.x, tg.y + (31.5 + sk + 6 * 1) * tg.layer.tapSize, tg.w, lineWidth, me.colors.staff);
				tg.layer.tileRectangle(tg.g, tg.x, tg.y + (31.5 + sk + 6 * 2) * tg.layer.tapSize, tg.w, lineWidth, me.colors.staff);
				tg.layer.tileRectangle(tg.g, tg.x, tg.y + (31.5 + sk + 6 * 3) * tg.layer.tapSize, tg.w, lineWidth, me.colors.staff);
				tg.layer.tileRectangle(tg.g, tg.x, tg.y + (31.5 + sk + 6 * 4) * tg.layer.tapSize, tg.w, lineWidth, me.colors.staff);
			});
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
};
FretChordSheet.prototype.tileDrumLines = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	for (var x = 0; x < this.measures.length; x++) {
		var minfo = this.measureInfo(x);
		this.layerOctaves.renderGroup(mx + this.margins.sheetLeft
			, this.margins.drumsTop //+ y * 3 * 12 * this.tiler.tapSize
			, (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize
			, 8 * 3 * this.tiler.tapSize
			, 'drumLines' + x, left, top, width, height, function (tg) {
				tg.layer.tileRectangle(tg.g, tg.x + tg.w, tg.y, 3 * lineWidth, tg.h, me.colors.base);
			});
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
};
FretChordSheet.prototype.tileFretLines = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	for (var x = 0; x < this.measures.length; x++) {
		var minfo = this.measureInfo(x);
		this.layerOctaves.renderGroup(mx + this.margins.sheetLeft
			, this.margins.fretTop //+ y * 3 * 12 * this.tiler.tapSize
			, (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize
			, 6 * 3 * this.tiler.tapSize
			, 'frtLines' + x, left, top, width, height, function (tg) {
				tg.layer.tileRectangle(tg.g, tg.x + tg.w, tg.y, 3 * lineWidth, tg.h, me.colors.base);
				for (var i = 0; i < 6; i++) {
					tg.layer.tileRectangle(tg.g, tg.x, tg.y + (1.5 + i * 3) * tg.layer.tapSize, tg.w, lineWidth, me.colors.base);
				}
			});
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
};

FretChordSheet.prototype.tilePianoOctaveKeys = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	var minfo = null;
	for (var x = 0; x <= this.measures.length; x++) {
		if (x < this.measures.length)
			minfo = this.measureInfo(x);
		else
			minfo = this.measureInfo(this.measures.length - 1);
		for (var y = 0; y < 5; y++) {
			this.layerOctaveKeys.renderGroup(mx + this.margins.sheetLeft + this.options.measureHeader * 3 * this.tiler.tapSize
				, this.margins.pianorollTop + y * 3 * 12 * this.tiler.tapSize
				, (this.options.measureHeader + minfo.duration4 * 8 - this.options.measureHeader) * 3 * this.tiler.tapSize
				, 12 * 3 * this.tiler.tapSize
				, 'octaveKeys' + x + 'x' + y, left, top, width, height, function (tg) {
					if (y > 0) {
						tg.layer.tileRectangle(tg.g, tg.x, tg.y + 0 * 3 * tg.layer.tapSize, tg.w, lineWidth, me.colors.blackKey);
					}
					tg.layer.tileRectangle(tg.g, tg.x, tg.y + 0 * 3 * tg.layer.tapSize, tg.w, 3 * tg.layer.tapSize, me.colors.whiteKey);
					tg.layer.tileRectangle(tg.g, tg.x, tg.y + 1 * 3 * tg.layer.tapSize, tg.w, 3 * tg.layer.tapSize, me.colors.blackKey);
					tg.layer.tileRectangle(tg.g, tg.x, tg.y + 2 * 3 * tg.layer.tapSize, tg.w, 3 * tg.layer.tapSize, me.colors.whiteKey);
					tg.layer.tileRectangle(tg.g, tg.x, tg.y + 3 * 3 * tg.layer.tapSize, tg.w, 3 * tg.layer.tapSize, me.colors.blackKey);
					tg.layer.tileRectangle(tg.g, tg.x, tg.y + 4 * 3 * tg.layer.tapSize, tg.w, 3 * tg.layer.tapSize, me.colors.whiteKey);
					tg.layer.tileRectangle(tg.g, tg.x, tg.y + 5 * 3 * tg.layer.tapSize, tg.w, 3 * tg.layer.tapSize, me.colors.blackKey);
					tg.layer.tileRectangle(tg.g, tg.x, tg.y + 6 * 3 * tg.layer.tapSize, tg.w, 3 * tg.layer.tapSize, me.colors.whiteKey);
					tg.layer.tileRectangle(tg.g, tg.x, tg.y + 7 * 3 * tg.layer.tapSize, tg.w, lineWidth, me.colors.blackKey);
					tg.layer.tileRectangle(tg.g, tg.x, tg.y + 7 * 3 * tg.layer.tapSize, tg.w, 3 * tg.layer.tapSize, me.colors.whiteKey);
					tg.layer.tileRectangle(tg.g, tg.x, tg.y + 8 * 3 * tg.layer.tapSize, tg.w, 3 * tg.layer.tapSize, me.colors.blackKey);
					tg.layer.tileRectangle(tg.g, tg.x, tg.y + 9 * 3 * tg.layer.tapSize, tg.w, 3 * tg.layer.tapSize, me.colors.whiteKey);
					tg.layer.tileRectangle(tg.g, tg.x, tg.y + 10 * 3 * tg.layer.tapSize, tg.w, 3 * tg.layer.tapSize, me.colors.blackKey);
					tg.layer.tileRectangle(tg.g, tg.x, tg.y + 11 * 3 * tg.layer.tapSize, tg.w, 3 * tg.layer.tapSize, me.colors.whiteKey);

				});
		}
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
};
FretChordSheet.prototype.tileDrumNames = function (left, top, width, height, lineWidth) {
	var me = this;
	this.layerDrumNames.marginX = me.margins.sheetLeft;
	//this.layerDrumNames.lockX = me.margins.sheetLeft;//me.tiler.svg.clientWidth - 6 * this.tiler.tapSize;
	//console.log('tileDrumNames',this.layerDrumNames.lockX,this.margins);
	this.layerDrumNames.renderGroup(0//
		, me.margins.drumsTop //
		, 300 * this.tiler.tapSize//
		, 8 * 3 * this.tiler.tapSize//
		, 'drumNames', left, top, width, height, function (tg) {

			//console.log(tg);
			//tg.layer.tileRectangle(tg.g, tg.x, tg.y, tg.w, tg.h, 'rgba(255,0,0,0.05)', 'rgba(0,255,0,0.05)', tg.layer.tapSize);
			for (var k = 0; k < 8; k++) {

				tg.layer.tileText(tg.g, tg.x, tg.y + k * 3 * tg.layer.tapSize + 2.5 * tg.layer.tapSize, 3 * tg.layer.tapSize, '' + (me.drumInfo[k].title), me.colors.barCounter);
			}
		});

};
FretChordSheet.prototype.tileDrumGrid = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	var minfo = null;
	for (var x = 0; x <= this.measures.length; x++) {
		if (x < this.measures.length) {
			minfo = this.measureInfo(x);
		}
		else { minfo = this.measureInfo(this.measures.length - 1); }
		//for (var y = 0; y < 5; y++) {
		this.layerGrid.renderGroup(mx + this.margins.sheetLeft + this.options.measureHeader * 3 * this.tiler.tapSize
			, this.margins.drumsTop //+ y * 3 * 12 * this.tiler.tapSize
			, (this.options.measureHeader + minfo.duration4 * 8 - this.options.measureHeader) * 3 * this.tiler.tapSize
			, 8 * 3 * this.tiler.tapSize
			, 'drumGrid' + x, left, top, width, height, function (tg) {
				for (var k = 0; k < minfo.duration4; k++) {
					if (k > 0) {
						tg.layer.tileRectangle(tg.g, tg.x + 8 * k * 3 * tg.layer.tapSize, tg.y
							, lineWidth * 2, 8 * 3 * tg.layer.tapSize, me.colors.grid);
					}
					for (var nn = 1; nn < me.feelPattern6[me.options.feel].length - 1; nn++) {
						tg.layer.tileRectangle(tg.g, tg.x + (8 * k + me.feelPattern6[me.options.feel][nn] / 6) * 3 * tg.layer.tapSize, tg.y
							, lineWidth * 0.5, 8 * 3 * tg.layer.tapSize, me.colors.grid);
					}
				}
				for (var k = 1; k < 8; k++) {
					tg.layer.tileRectangle(tg.g
						, tg.x
						, tg.y + k * 3 * tg.layer.tapSize
						, tg.w
						, lineWidth
						, me.colors.grid);
				}
				/*if(x==0){
					for (var k = 0; k < 8; k++) {
					tg.layer.tileText(tg.g, tg.x , tg.y + k* 3 * tg.layer.tapSize+2.5*tg.layer.tapSize,  3 * tg.layer.tapSize, '' + (me.drumInfo[k].title), me.colors.barCounter);
					}
				}*/
			});
		//}
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
};
FretChordSheet.prototype.tilStaffGrid = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	var minfo = null;
	for (var x = 0; x <= this.measures.length; x++) {
		if (x < this.measures.length) {
			minfo = this.measureInfo(x);
		} else {
			minfo = this.measureInfo(this.measures.length - 1);
		}
		this.layerGrid.renderGroup(mx + this.margins.sheetLeft + this.options.measureHeader * 3 * this.tiler.tapSize
			, this.margins.sheetTop //
			, (this.options.measureHeader + minfo.duration4 * 8 - this.options.measureHeader) * 3 * this.tiler.tapSize
			, 6 * 7 * 3 * this.tiler.tapSize
			, 'staffGrid' + x, left, top, width, height, function (tg) {
				for (var k = 0; k < minfo.duration4; k++) {
					if (k > 0) {
						tg.layer.tileRectangle(tg.g, tg.x + 8 * k * 3 * tg.layer.tapSize, tg.y
							, lineWidth * 2, 6 * 7 * 3 * tg.layer.tapSize, me.colors.grid);
					}
					for (var nn = 1; nn < me.feelPattern6[me.options.feel].length - 1; nn++) {
						tg.layer.tileRectangle(tg.g, tg.x + (8 * k + me.feelPattern6[me.options.feel][nn] / 6) * 3 * tg.layer.tapSize, tg.y
							, lineWidth * 0.5, 6 * 7 * 3 * tg.layer.tapSize, me.colors.grid);
					}
				}
				for (var k = 1; k < 6 * 7; k++) {
					tg.layer.tileRectangle(tg.g
						, tg.x
						, tg.y + k * 3 * tg.layer.tapSize
						, tg.w
						, lineWidth
						, me.colors.grid);
				}
			});
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
};
FretChordSheet.prototype.tileFretGrid = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	var minfo = null;
	for (var x = 0; x <= this.measures.length; x++) {
		if (x < this.measures.length) {
			minfo = this.measureInfo(x);
		} else {
			minfo = this.measureInfo(this.measures.length - 1);
		}
		this.layerGrid.renderGroup(mx + this.margins.sheetLeft + this.options.measureHeader * 3 * this.tiler.tapSize
			, this.margins.fretTop //
			, (this.options.measureHeader + minfo.duration4 * 8 - this.options.measureHeader) * 3 * this.tiler.tapSize
			, 6 * 3 * this.tiler.tapSize
			, 'frtGrid' + x, left, top, width, height, function (tg) {
				for (var k = 0; k < minfo.duration4; k++) {
					if (k > 0) {
						tg.layer.tileRectangle(tg.g, tg.x + 8 * k * 3 * tg.layer.tapSize, tg.y
							, lineWidth * 2, 6 * 3 * tg.layer.tapSize, me.colors.grid);
					}
					for (var nn = 1; nn < me.feelPattern6[me.options.feel].length - 1; nn++) {
						tg.layer.tileRectangle(tg.g, tg.x + (8 * k + me.feelPattern6[me.options.feel][nn] / 6) * 3 * tg.layer.tapSize, tg.y
							, lineWidth * 0.5, 6 * 3 * tg.layer.tapSize, me.colors.grid);
					}
				}
				for (var k = 1; k < 6; k++) {
					tg.layer.tileRectangle(tg.g
						, tg.x
						, tg.y + k * 3 * tg.layer.tapSize
						, tg.w
						, lineWidth
						, me.colors.grid);
				}
			});
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
};
FretChordSheet.prototype.tilePianorollGrid = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	var minfo = null;
	for (var x = 0; x <= this.measures.length; x++) {
		if (x < this.measures.length)
			minfo = this.measureInfo(x);
		else
			minfo = this.measureInfo(this.measures.length - 1);
		for (var y = 0; y < 5; y++) {
			this.layerGrid.renderGroup(mx + this.margins.sheetLeft + this.options.measureHeader * 3 * this.tiler.tapSize
				, this.margins.pianorollTop + y * 3 * 12 * this.tiler.tapSize
				, (this.options.measureHeader + minfo.duration4 * 8 - this.options.measureHeader) * 3 * this.tiler.tapSize
				, 12 * 3 * this.tiler.tapSize
				, 'prgrd' + x + 'x' + y, left, top, width, height, function (tg) {
					for (var k = 0; k < minfo.duration4; k++) {
						if (k > 0) {
							tg.layer.tileRectangle(tg.g, tg.x + 8 * k * 3 * tg.layer.tapSize, tg.y
								, lineWidth * 2, 12 * 3 * tg.layer.tapSize, me.colors.grid);
						}
						for (var nn = 1; nn < me.feelPattern6[me.options.feel].length - 1; nn++) {
							tg.layer.tileRectangle(tg.g, tg.x + (8 * k + me.feelPattern6[me.options.feel][nn] / 6) * 3 * tg.layer.tapSize, tg.y
								, lineWidth * 0.5, 12 * 3 * tg.layer.tapSize, me.colors.grid);
						}
					}
				});
		}
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
};

FretChordSheet.prototype.tilePianorollNoteLine = function (tg, tonenote, start192, measureNum, color,o) {
	var tx1 = tg.x + start192 / 6 * 3 * tg.layer.tapSize + 1.5 * tg.layer.tapSize;
	var ty1 = (5 * 12 - tonenote.pitch - 1) * 3 * tg.layer.tapSize + this.margins.pianorollTop + 1.5 * tg.layer.tapSize;
	for (var i = 0; i < tonenote.slides.length; i++) {
		var tx2 = this.findBeatX(measureNum, start192 + tonenote.slides[i].end192 - 6) + 1.5 * tg.layer.tapSize;
		if (tx2 - tx1 < 1) {
			tx2 = tx1 + 1;
		}
		var ty2 = ty1 + tonenote.slides[i].shift * 3 * tg.layer.tapSize;
		var delta=0;
		if(o){
			delta=(0.2+o*0.05)*this.tiler.tapSize;
		}
		tg.layer.tileLine(tg.g, tx1+delta
								, ty1+delta
								, tx2+delta
								, ty2+delta
								, color, 2.9 * tg.layer.tapSize);
		tx1 = tx2;
		ty1 = ty2;
	}
};
FretChordSheet.prototype.tilePianorollNotes = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	for (var x = 0; x < this.measures.length; x++) {
		var minfo = this.measureInfo(x);
		if (minfo)
			for (var y = 0; y < 5; y++) {
				this.layerNotes.renderGroup(mx + this.margins.sheetLeft + this.options.measureHeader * 3 * this.tiler.tapSize
					, this.margins.pianorollTop + y * 3 * 12 * this.tiler.tapSize
					, (this.options.measureHeader + minfo.duration4 * 8 - this.options.measureHeader) * 3 * this.tiler.tapSize
					, 12 * 3 * this.tiler.tapSize
					, 'nts' + x + 'x' + y, left, top, width, height, function (tg) {
						for (var b = 0; b < minfo.beats.length; b++) {
							var beat = minfo.beats[b];
							if (beat) {
								for (var c = 0; c < beat.chords.length; c++) {
									var o = me.trackOrder[c];
									if (o > 0) {
										var chord = beat.chords[c];
										if (chord)
											for (var n = 0; n < chord.notes.length; n++) {
												var note = chord.notes[n];
												if (note)
													if (note.pitch >= 12 * (4 - y) && note.pitch < 12 * (5 - y)) {
														//var orderShift=o*0.1*me.tiler.tapSize;
														me.tilePianorollNoteLine(tg, note, beat.start192, x, me.trackInfo[c].shadow,o);
													}
											}
									}
								}
							}
						}




						for (var b = 0; b < minfo.beats.length; b++) {
							var beat = minfo.beats[b];
							if (beat) {
								for (var c = 0; c < beat.chords.length; c++) {
									var o = me.trackOrder[c];
									if (o == 0) {
										var chord = beat.chords[c];
										if (chord)
											for (var n = 0; n < chord.notes.length; n++) {
												var note = chord.notes[n];
												if (note)
													if (note.pitch >= 12 * (4 - y) && note.pitch < 12 * (5 - y)) {
														me.tilePianorollNoteLine(tg, note, beat.start192, x, me.trackInfo[c].color,0);
														var dd = (beat.start192 / 6) * (3 * tg.layer.tapSize) + 0.95 * tg.layer.tapSize;
														//console.log(tg.x,beat.start192,dd,tg.layer.tapSize);
														tg.layer.tileText(tg.g, tg.x + dd, tg.y + (12 - note.pitch % 12) * 3 * tg.layer.tapSize - 0.5 * tg.layer.tapSize
															, 2.5 * tg.layer.tapSize, me.keyName(note.pitch)
															, me.colors.noteLabel);
													}
											}
									}
								}
							}
						}


					});
			}
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
};
FretChordSheet.prototype.keyName = function (pitch) {
	var n = pitch % 12;
	if (n == 0) { return 'C' }
	if (n == 1) { return 'C#' }
	if (n == 2) { return 'D' }
	if (n == 3) { return 'D#' }
	if (n == 4) { return 'E' }
	if (n == 5) { return 'F' }
	if (n == 6) { return 'F#' }
	if (n == 7) { return 'G' }
	if (n == 8) { return 'G#' }
	if (n == 9) { return 'A' }
	if (n == 10) { return 'A#' }
	return 'B';
};
FretChordSheet.prototype.tileDrumNotes = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	for (var x = 0; x < this.measures.length; x++) {
		var minfo = this.measureInfo(x);
		if (minfo)
			this.layerNotes.renderGroup(mx + this.margins.sheetLeft + this.options.measureHeader * 3 * this.tiler.tapSize
				, this.margins.drumsTop //+ y * 3 * 12 * this.tiler.tapSize
				, (this.options.measureHeader + minfo.duration4 * 8 - this.options.measureHeader) * 3 * this.tiler.tapSize
				, 8 * 3 * this.tiler.tapSize
				, 'ntsdrm' + x, left, top, width, height, function (tg) {
					for (var b = 0; b < minfo.beats.length; b++) {
						var beat = minfo.beats[b];
						//console.log(beat);
						if (beat)
							for (var c = 0; c < beat.drums.length; c++) {
								if (beat.drums[c]) {
									var tx = tg.x + beat.start192 / 6 * 3 * tg.layer.tapSize + 1.5 * tg.layer.tapSize;
									var ty = tg.y + c * 3 * tg.layer.tapSize + 1.5 * tg.layer.tapSize;
									//console.log(tx,ty);
									tg.layer.tileLine(tg.g
										, tx, ty
										, tx + 1, ty
										, me.colors.base, 2.9 * tg.layer.tapSize);
								}
							}
					}
				});
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
};
FretChordSheet.prototype.tilePianorollMark = function (left, top, width, height, lineWidth) {
	if (this.markNotes.length > 0) {
		var me = this;
		for (var mm = 0; mm < me.markNotes.length; mm++) {
			var curMark = me.markNotes[mm];
			var mx = 0;
			for (var x = 0; x <= this.measures.length; x++) {
				var minfo = null;
				if (x < this.measures.length) {
					minfo = this.measureInfo(x);
				} else {
					minfo = this.measureInfo(x - 1);
				}
				if (minfo)
					if (curMark.morder == x) {
						for (var y = 0; y < 5; y++) {
							var s = 4 - y;
							if (curMark.pitch >= s * 12 && curMark.pitch < s * 12 + 12) {
								this.layerNotes.renderGroup(mx + this.margins.sheetLeft + this.options.measureHeader * 3 * this.tiler.tapSize
									, this.margins.pianorollTop + y * 3 * 12 * this.tiler.tapSize
									, (this.options.measureHeader + minfo.duration4 * 8 - this.options.measureHeader) * 3 * this.tiler.tapSize
									, 12 * 3 * this.tiler.tapSize
									, 'markNote' + mm, left, top, width, height, function (tg) {
										tg.layer.tileCircle(tg.g
											, tg.x + curMark.start192 / 6 * 3 * me.tiler.tapSize + 3 * me.tiler.tapSize / 2
											, tg.y + tg.h - (curMark.pitch % 12) * 3 * me.tiler.tapSize - +3 * me.tiler.tapSize / 2
											, 3 * me.tiler.tapSize / 2, me.colors.buttonFill);
									});
								break;
							}
						}
						break;
					}
				mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
			}
		}
	}
};
FretChordSheet.prototype.tileOctaveNumbers = function (lx, sz, left, top, width, height, lineWidth) {
	var me = this;
	this.layerOctaveNumbers.lockX = me.tiler.svg.clientWidth - lx;
	for (var i = 0; i < 5; i++) {
		this.layerOctaveNumbers.renderGroup(0//
			, me.margins.pianorollTop + i * 12 * 3 * this.tiler.tapSize - 2 * 3 * this.tiler.tapSize//
			, me.options.measureLen * 3 * this.tiler.tapSize//
			, 12 * 3 * this.tiler.tapSize//
			, 'octaveNum' + i, left, top, width, height, function (tg) {
				tg.layer.tileText(tg.g, tg.x + sz * 0 * tg.layer.tapSize, tg.y + tg.h - sz / 10, sz, '' + (5 - i), me.colors.barCounter);
			});
	}
};
FretChordSheet.prototype.tileBarButtons = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	for (var x = 0; x < this.measures.length; x++) {
		var minfo = this.measureInfo(x);
		this.layerBarNumbers.renderGroup(mx + this.margins.sheetLeft
			, 0
			, (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize
			, 22 * me.tiler.tapSize * 0.03 * this.tiler.tapSize
			, 'barButn' + x, left, top, width, height, function (tg) {
				//tg.layer.tileText(tg.g, tg.x + 22 * me.tiler.tapSize / 50 * tg.layer.tapSize, tg.y + tg.h, 7 * me.tiler.tapSize, '' + minfo.duration4+"/4", me.colors.barCounter);
				var _x = x;
				s = me.tileKnob(tg, 'rollMeter_' + x, 20 * me.tiler.tapSize, 10 * me.tiler.tapSize, 10 * me.tiler.tapSize, '' + minfo.duration4 + "/4", function () {
					//console.log('test',_x);
					me.userActionRollMeter(_x);
				});

				//console.log('barButn' + x);

			});
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
}
FretChordSheet.prototype.tileMeasurePlaceholders = function (left, top, width, height, lineWidth) {
	var me = this;
	this.layerBack.renderGroup(0, 0, this.calcContentWidth(), this.contentHeight
		, 'bgPane', left, top, width, height, function (tg) {
			tg.layer.tileRectangle(tg.g, tg.x, tg.y, tg.w, tg.h, 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.05)', 5 * tg.layer.tapSize);
			var mx = 0;
			for (var x = 0; x < me.measures.length; x++) {
				var minfo = me.measureInfo(x);
				if (x % 10 == 0) {
					tg.layer.tileRectangle(tg.g, tg.x + mx, tg.y, 15 * tg.layer.tapSize, tg.h, 'rgba(0,0,0,0.05)');
				}
				mx = mx + (me.options.measureHeader + minfo.duration4 * 8) * 3 * me.tiler.tapSize;
			}
		});
};
FretChordSheet.prototype.tileSomeBarNumbers = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	var sz = 5000;
	//console.log('tileSomeBarNumbers',this.measures.length,left, top, width, height, lineWidth);
	for (var x = 0; x < this.measures.length; x++) {
		if (x % 10 == 0) {
			var minfo = this.measureInfo(x);
			//console.log(x,minfo);
			this.layerBarNumbers.renderGroup(mx + this.margins.sheetLeft
				, 0
				, (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize
				, sz * 0.03 * this.tiler.tapSize
				, 'barNum' + x, left, top, width, height, function (tg) {
					tg.layer.tileText(tg.g, tg.x + (sz / 200) * tg.layer.tapSize, tg.y + tg.h, sz, '' + (1 + x), me.colors.barCounter);
					//console.log(tg);
				});
		}
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
};
FretChordSheet.prototype.tileBarNumbers = function (sz, left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	for (var x = 0; x < this.measures.length; x++) {
		var minfo = this.measureInfo(x);
		this.layerBarNumbers.renderGroup(mx + this.margins.sheetLeft
			, 0
			, (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize
			, sz * 0.03 * this.tiler.tapSize
			, 'barNum' + x, left, top, width, height, function (tg) {
				tg.layer.tileText(tg.g, tg.x + (sz / 200) * tg.layer.tapSize, tg.y + tg.h, sz, '' + (1 + x), me.colors.barCounter);
			});
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
};
FretChordSheet.prototype.tileLeftMenu = function (left, top, width, height, lineWidth) {
	var me = this;
	this.layerLeftMenu.renderGroup(0
		, 0
		, this.margins.sheetLeft
		, this.contentHeight
		, 'lemenu', left, top, width, height, function (tg) {
			me.tileRange(tg, 'btnFeel'
				, 3 * me.tiler.tapSize
				, 3 * me.tiler.tapSize
				, me.margins.sheetLeft - 6 * me.tiler.tapSize
				, 1 * 3 * me.tiler.tapSize
				, 1 + me.options.feel, 5, 'Feel: ' + me.feelNames[me.options.feel], function (v) {
					me.userActionChangeFeel(v - 1);
				});
			me.tileKnob(tg, 'resetsng', 3 * me.tiler.tapSize, 9 * me.tiler.tapSize, 3 * me.tiler.tapSize, 'Clear song', function () {
				me.userActionClearSong();
			});
			me.tileKnob(tg, 'hideStaff', 3 * me.tiler.tapSize, 15 * me.tiler.tapSize, 3 * me.tiler.tapSize, me.options.hideStaff == 1 ? 'Hide staff' : 'Show staff', function () {
				me.userActionSetHideStaff(me.options.hideStaff == 1 ? 2 : 1);
			});
			me.tileKnob(tg, 'hideDrums', 3 * me.tiler.tapSize, 21 * me.tiler.tapSize, 3 * me.tiler.tapSize, me.options.hideDrums == 1 ? 'Hide drums' : 'Show drums', function () {
				me.userActionSetHideDrums(me.options.hideDrums == 1 ? 2 : 1);
			});
			me.tileKnob(tg, 'hideRoll', 3 * me.tiler.tapSize, 27 * me.tiler.tapSize, 3 * me.tiler.tapSize, me.options.hidePiano == 1 ? 'Hide pianoroll' : 'Show pianoroll', function () {
				me.userActionSetHidePiano(me.options.hidePiano == 1 ? 2 : 1);
			});
			me.tileKnob(tg, 'hideFret', 3 * me.tiler.tapSize, 33 * me.tiler.tapSize, 3 * me.tiler.tapSize, me.options.hideFrets == 1 ? 'Hide fretboard' : 'Show fretboard', function () {
				me.userActionSetHideFrets(me.options.hideFrets == 1 ? 2 : 1);
			});

			me.tileKnob(tg, 'imprtmxml', 3 * me.tiler.tapSize, 39 * me.tiler.tapSize, 3 * me.tiler.tapSize, 'Import .mxml', function () {
				me.promptImport();
			});


			for (var i = 0; i < me.trackInfo.length; i++) {
				var o = me.trackOrder[i];
				if (o > 0) {
					var kb = me.tileKnob(tg, 'tr' + i, 3 * me.tiler.tapSize, (45 + o * 4) * me.tiler.tapSize, 3 * me.tiler.tapSize, me.trackInfo[i].title, function (s) {
						me.userActionTrackUp(s.toneNum);
					}, me.trackInfo[i].color);
					kb.toneNum = i;
				} else {
					tg.layer.tileText(tg.g
						, tg.x + 3 * me.tiler.tapSize + (3 * me.tiler.tapSize) / 4
						, tg.y + (45 + o * 4) * me.tiler.tapSize + 0.8 * (3 * me.tiler.tapSize)
						, 0.025 * (3 * me.tiler.tapSize) * tg.layer.tapSize, me.trackInfo[i].title, me.trackInfo[i].color);
				}
			}
			me.tileRange(tg, 'btnMarkNotesCount'
				, 3 * me.tiler.tapSize
				, 79 * me.tiler.tapSize
				, me.margins.sheetLeft - 6 * me.tiler.tapSize
				, 1 * 3 * me.tiler.tapSize
				, me.options.markNotesCount, 3, 'Taps per note: ' + me.options.markNotesCount, function (v) {
					me.userActionChangeMarkMode(v);
				});

			me.tileRange(tg, 'btnBreakWidth'
				, 3 * me.tiler.tapSize
				, 85 * me.tiler.tapSize
				, me.margins.sheetLeft - 6 * me.tiler.tapSize
				, 1 * 3 * me.tiler.tapSize
				, me.options.breakMode + 1, 3, 'Measure break: ' + me.breakNames[me.options.breakMode], function (v) {
					me.userActionBreakMode(v);
				});
		});
};
FretChordSheet.prototype.createTrackUp = function (n) {
	var newOrder = [];
	for (var i = 0; i < this.trackOrder.length; i++) {
		if (this.trackOrder[i] < this.trackOrder[n]) {
			newOrder[i] = this.trackOrder[i] + 1;
		} else {
			newOrder[i] = this.trackOrder[i];
		}
	}
	newOrder[n] = 0;
	return newOrder;
};
FretChordSheet.prototype.tileRange = function (tg, id, x, y, w, h, v, mx, label, action) {
	tg.layer.tileLine(tg.g, tg.x + x + h / 2, tg.y + y + h / 2, tg.x + x + w - h / 2, tg.y + y + h / 2, this.colors.buttonShadow, h);
	tg.layer.tileLine(tg.g, tg.x + x + h / 2, tg.y + y + h / 2, tg.x + x + w * v / mx - h / 2, tg.y + y + h / 2, this.colors.buttonFill, h);
	tg.layer.tileText(tg.g, tg.x + x + h / 4, tg.y + y + 0.8 * h, 0.025 * h * tg.layer.tapSize, label, this.colors.buttonLabel);
	for (var i = 0; i < mx; i++) {
		var s = tg.layer.addSpot(id + '_' + i, tg.x + x + i * w / mx, tg.y + y, w / mx, h, function (sv) {
			action(this.selectedValue);
		});
		s.selectedValue = i + 1;
	}
};
FretChordSheet.prototype.tileKnob = function (tg, id, x, y, sz, label, action, color) {
	var c = this.colors.buttonLabel;
	if (color) { c = color; }
	tg.layer.tileCircle(tg.g, tg.x + x + sz / 2, tg.y + y + sz / 2, sz / 2, this.colors.buttonFill);
	tg.layer.tileText(tg.g, tg.x + x + sz / 4, tg.y + y + 0.8 * sz, 0.025 * sz * tg.layer.tapSize, label, c);
	var s = tg.layer.addSpot(id, tg.x + x, tg.y + y, sz, sz, function () {
		action(s);
	});
	return s;
};
FretChordSheet.prototype.shrinkMeasures = function () {
	var minfo = this.measureInfo(0);
	var mx = 1;
	for (var i = 0; i < this.measures.length; i++) {
		if (!this.isMeasureEmpty(this.measures[i])) {
			mx = i;
		}
	}
	this.measures.splice(mx + 1);
};
FretChordSheet.prototype.isEmptyMeasureBeat = function (beat) {
	for (var i = 0; i < beat.drums.length; i++) {
		if (beat.drums[i]) {
			return false;
		}
	}
	for (var i = 0; i < beat.chords.length; i++) {
		if (beat.chords[i].notes.length > 0) {
			return false;
		}
	}
	return true;
};
FretChordSheet.prototype.isMeasureEmpty = function (measure) {
	for (var i = 0; i < measure.beats.length; i++) {
		if (!this.isEmptyMeasureBeat(measure.beats[i])) {
			return false;
		}
	}
	return true;
};

