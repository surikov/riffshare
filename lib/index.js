console.log('FretChordSheet');
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
	});
};
FretChordSheet.prototype.loadState = function (prefix) {
	try {
		var p = readObjectFromlocalStorage(prefix + '_position');
		this.tiler.translateX = sureNumeric(p.tx, -999999999, 0, 0);
		this.tiler.translateY = sureNumeric(p.ty, -999999999, 0, 0);
		this.tiler.translateZ = sureNumeric(p.tz, 1, 9, 99);
		this.options.feel = sureNumeric(p.feel, 0, 0, 4);
		this.options.breakMode = sureNumeric(p.breakMode, 0, 1, 2);
		this.options.markNotesCount = sureNumeric(p.markNotesCount, 1, 1, 3);
		this.options.measureMode = sureNumeric(p.measureMode, 0, 1, 4);
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
		this.options.measureHeader = 8;
	} else {
		if (this.options.breakMode > 0) {
			this.options.measureHeader = 5;
		} else {
			this.options.measureHeader = 0;
		}
	}
};
FretChordSheet.prototype.reCalcContentSize = function () {
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
	this.layerNotes = this.tiler.addBaseLayer();
	this.layerDrumLabels = this.tiler.addColumnLayer();
	this.layerLeftMenu = this.tiler.addBaseLayer();
	this.margins = {
		sheetLeft: 60 * this.tiler.tapSize
		, sheetTop: 64 * 3 * this.tiler.tapSize
		, pianorollTop: 2 * 3 * this.tiler.tapSize
		, drumsTop: 116 * 3 * this.tiler.tapSize
		, fretTop: 107 * 3 * this.tiler.tapSize
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
	};
	this.measures = [];
	this.strings = [28, 23, 19, 14, 9, 4];
	this.markNotes = [];
	//this.markNotesCount = 2;
	this.markStaff = null;
	this.markFret = null;
	this.contentHeight = 125 * 3 * this.tiler.tapSize;
	this.trackOrder = [0, 1, 2, 3, 4, 5, 6, 7];
	this.colors = {
		base: '#000'
		, grid: 'rgba(0,0,0,0.2)'
		, barCounter: 'rgba(0,0,0,0.2)'
		, staff: '#000'
		, whiteKey: 'rgba(255,255,255,0.3)'
		, blackKey: 'rgba(0,0,0,0.1)'
		, buttonFill: '#9cf'
		, buttonShadow: 'rgba(0,0,0,0.1)'
		, buttonLabel: '#000'
		, bgCopy: '#fff'
		, noteLabel: '#fff'
		, fretLine0: '#000'
		, fretLine1: '#333'
		, fretLine4: '#666'
		, fretLine8: '#999'
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
		color: 'rgb(255,77,0)',
		shadow: 'rgba(255,77,0,0.4)',
		title: 'Synth Bass',
		order: 2,
		//sound: _tone_0390_GeneralUserGS_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'track7'), 0, 70, 100),
		nn: 7,
		octave: 3,
		inChordDelay: 0.01,
		volumeRatio: 0.5
	}, {
		color: 'rgb(127,127,0)',
		shadow: 'rgba(127,127,0,0.4)',
		title: 'String Ensemble',
		order: 1,
		//sound: _tone_0490_Chaos_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'track6'), 0, 70, 100),
		nn: 6,
		octave: 3,
		inChordDelay: 0,
		volumeRatio: 0.3
	}, {
		color: 'rgb(178,0,64)',
		shadow: 'rgba(178,0,64,0.4)',
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
		title: 'Acoustic Piano',
		order: 3,
		//sound: _tone_0001_FluidR3_GM_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'track4'), 0, 70, 100),
		nn: 4,
		octave: 3,
		inChordDelay: 0,
		volumeRatio: 0.5
	}, {
		color: 'rgb(140,35,0)',
		shadow: 'rgba(140,35,0,0.4)',
		title: 'Jazz guitar',
		order: 4,
		//sound: _tone_0260_GeneralUserGS_sf2_file,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'track3'), 0, 70, 100),
		nn: 3,
		octave: 3,
		inChordDelay: 0,
		volumeRatio: 1.0
	}, {
		color: 'rgb(0,0,127)',
		shadow: 'rgba(0,0,127,0.4)',
		title: 'Percussive Organ',
		order: 0,
		inChordDelay: 0,
		//sound: _tone_0170_SBLive_sf2,
		volume: sureNumeric(readObjectFromlocalStorage(this.prefix + 'track2'), 0, 70, 100),
		nn: 2,
		octave: 4,
		volumeRatio: 0.7
	}, {
		color: 'rgb(0,99,0)',
		shadow: 'rgba(0,99,0,0.4)',
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
		me.tilePianoOctaveLines(left, top, width, height, lineWidth);
		me.tileStaffLines(left, top, width, height, lineWidth);
		me.tileDrumLines(left, top, width, height, lineWidth);
		//me.tileDrumGrid(left, top, width, height, lineWidth);
		me.tileOctaveNumbers(2 * me.tiler.tapSize, 3 * me.tiler.tapSize, left, top, width, height, lineWidth);
		me.tileBarNumbers(9 * me.tiler.tapSize, left, top, width, height, me.layerBarNumbers, lineWidth);
		me.tilePianorollNotes(left, top, width, height, lineWidth);
	});

	this.tiler.addZoomLevel(9, function (left, top, width, height) {
		var lineWidth = 0.2 * me.tiler.tapSize;
		me.tileBackground(left, top, width, height, lineWidth);
		me.tileLeftMenu(left, top, width, height, lineWidth);
		me.tilePianoOctaveLines(left, top, width, height, lineWidth);
		me.tileStaffLines(left, top, width, height, lineWidth);
		me.tileDrumLines(left, top, width, height, lineWidth);
		me.tilePianoSpot(left, top, width, height, lineWidth);
		me.tilePianoOctaveKeys(left, top, width, height, lineWidth);
		me.tileOctaveNumbers(1.5 * me.tiler.tapSize, 7 * me.tiler.tapSize, left, top, width, height, lineWidth);
		me.tileBarNumbers(11 * me.tiler.tapSize, left, top, width, height, me.layerBarNumbers, lineWidth);
		me.tilePianorollGrid(left, top, width, height, lineWidth);
		me.tileDrumGrid(left, top, width, height, lineWidth);
		me.tilePianorollNotes(left, top, width, height, lineWidth);
		me.tilePianorollMark(left, top, width, height, lineWidth);
	});
	this.tiler.addZoomLevel(50, function (left, top, width, height) {
		var lineWidth = 0.3 * me.tiler.tapSize;
		me.tileBackground(left, top, width, height, lineWidth);
		me.tileLeftMenu(left, top, width, height, lineWidth);
		me.tilePianoOctaveLines(left, top, width, height, lineWidth);
		me.tileStaffLines(left, top, width, height, lineWidth);
		me.tileDrumLines(left, top, width, height, lineWidth);
		me.tileBarNumbers(15 * me.tiler.tapSize, left, top, width, height, me.layerBarNumbers, lineWidth);
		me.tilePianorollNotes(left, top, width, height, lineWidth);
	});
	window.addEventListener("beforeunload", function () { me.saveState(me.prefix); });
	window.addEventListener("blur", function () { me.saveState(me.prefix); });
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
FretChordSheet.prototype.findNotes = function (track, morder, start192, duration192, pitch) {
	var noteBeats = [];
	if (morder < this.measures.length) {
		minfo = this.measures[morder];
		for (var i = 0; i < minfo.beats.length; i++) {
			var measureBeat = minfo.beats[i];
			if (measureBeat.start192 >= start192 && measureBeat.start192 < start192 + duration192) {
				//for (var c = 0; c < measureBeat.chords.length; c++) {
				var measureToneChord = measureBeat.chords[track];
				for (var n = 0; n < measureToneChord.notes.length; n++) {
					var measureToneNote = measureToneChord.notes[n];
					if (measureToneNote.pitch == pitch) {
						noteBeats.push({ track: track, morder: morder, beatStart: measureBeat.start192, note: measureToneChord.notes[n] });
					}
				}
				//}
			}
		}
	}
	return noteBeats;
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
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
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
					tg.layer.tileRectangle(tg.g, tg.x + tg.w, tg.y, lineWidth, tg.h, me.colors.base);
				});
		}
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
			, 6*7 * 3 * this.tiler.tapSize
			, 'staffLines' + x, left, top, width, height, function (tg) {
				tg.layer.tileRectangle(tg.g, tg.x+tg.w , tg.y+ (31.5 + 6 * 0) * tg.layer.tapSize, lineWidth, 81 * tg.layer.tapSize, me.colors.base);

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
				tg.layer.tileRectangle(tg.g, tg.x + tg.w, tg.y, lineWidth, tg.h, me.colors.base);
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
FretChordSheet.prototype.tileDrumGrid = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	var minfo = null;
	for (var x = 0; x <= this.measures.length; x++) {
		if (x < this.measures.length)
			minfo = this.measureInfo(x);
		else
			minfo = this.measureInfo(this.measures.length - 1);
		//for (var y = 0; y < 5; y++) {
			this.layerGrid.renderGroup(mx + this.margins.sheetLeft + this.options.measureHeader * 3 * this.tiler.tapSize
				, this.margins.drumsTop //+ y * 3 * 12 * this.tiler.tapSize
				, (this.options.measureHeader + minfo.duration4 * 8 - this.options.measureHeader) * 3 * this.tiler.tapSize
				, 8 * 3 * this.tiler.tapSize
				, 'drumGrid' + x , left, top, width, height, function (tg) {
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
							, tg.y+ k*3 * tg.layer.tapSize
							, tg.w
							,lineWidth
							, me.colors.grid);
					}
				});
		//}
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

FretChordSheet.prototype.tilePianorollNoteLine = function (tg, tonenote, start192, measureNum, color) {
	var tx1 = tg.x + start192 / 6 * 3 * tg.layer.tapSize + 1.5 * tg.layer.tapSize;
	var ty1 = (5 * 12 - tonenote.pitch - 1) * 3 * tg.layer.tapSize + this.margins.pianorollTop + 1.5 * tg.layer.tapSize;
	for (var i = 0; i < tonenote.slides.length; i++) {
		var tx2 = this.findBeatX(measureNum, start192 + tonenote.slides[i].end192 - 6) + 1.5 * tg.layer.tapSize;
		if (tx2 - tx1 < 1) {
			tx2 = tx1 + 1;
		}
		var ty2 = ty1 + tonenote.slides[i].shift * 3 * tg.layer.tapSize;
		tg.layer.tileLine(tg.g, tx1, ty1, tx2, ty2, color, 2.9 * tg.layer.tapSize);
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
							if (beat)
								for (var c = 0; c < beat.chords.length; c++) {
									var chord = beat.chords[c];
									if (chord)
										for (var n = 0; n < chord.notes.length; n++) {
											var note = chord.notes[n];
											if (note)
												if (note.pitch >= 12 * (4 - y) && note.pitch < 12 * (5 - y)) {
													me.tilePianorollNoteLine(tg, note, beat.start192, x, me.trackInfo[c].color);
												}
										}
								}
						}
					});
			}
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
				tg.layer.tileText(tg.g, tg.x + sz / 50 * tg.layer.tapSize, tg.y + tg.h, sz, '' + (1 + x), me.colors.barCounter);
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
			me.tileKnob(tg, 'hideStaff', 3 * me.tiler.tapSize, 15 * me.tiler.tapSize, 3 * me.tiler.tapSize, 'Hide staff', function () {
				console.log(this);
			});
			me.tileKnob(tg, 'hideDrums', 3 * me.tiler.tapSize, 21 * me.tiler.tapSize, 3 * me.tiler.tapSize, 'Hide drums', function () {
				console.log(this);
			});
			me.tileKnob(tg, 'hideRoll', 3 * me.tiler.tapSize, 27 * me.tiler.tapSize, 3 * me.tiler.tapSize, 'Hide pianoroll', function () {
				console.log(this);
			});
			me.tileKnob(tg, 'hideFret', 3 * me.tiler.tapSize, 33 * me.tiler.tapSize, 3 * me.tiler.tapSize, 'Hide fretboard', function () {
				console.log(this);
			});
			me.tileKnob(tg, 'hideChords', 3 * me.tiler.tapSize, 39 * me.tiler.tapSize, 3 * me.tiler.tapSize, 'Hide chords', function () {
				console.log(this);
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

