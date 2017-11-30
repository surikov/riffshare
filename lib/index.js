console.log('FretChordSheet');
function MeasureToneNote() {
	this.duration192 = 6 * 8;
	this.shift = 0;
	this.string = 0;
	this.pitch = 0;
	this.palmMute = 0;
	this.slap = 0;
	this.deadNote = 0;
	return this;
}
function MeasureToneChord() {
	this.notes = [];
	this.direction = 0;
	return this;
}
function MeasureBeat() {
	this.start192 = 0;
	this.chords = [new MeasureToneChord(), new MeasureToneChord(), new MeasureToneChord(), new MeasureToneChord()
		, new MeasureToneChord(), new MeasureToneChord(), new MeasureToneChord(), new MeasureToneChord()];
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
		//, drums: this.drums
		//, tones: this.tones
		, measures: this.measures
	});
};
FretChordSheet.prototype.loadState = function (prefix) {
	try {
		var p = readObjectFromlocalStorage(prefix + '_position');
		//console.log(p);
		this.tiler.translateX = sureNumeric(p.tx, -999999999, 0, 0);
		this.tiler.translateY = sureNumeric(p.ty, -999999999, 0, 0);
		this.tiler.translateZ = sureNumeric(p.tz, 1, 9, 99);
		this.options.feel = sureNumeric(p.feel, 0, 0, 4);
		this.options.measureMode = sureNumeric(p.measureMode, 0, 1, 4);
		//this.options.measureDuration = (this.options.measureMode + 3) * 8;
		//this.tones = sureArray(p.tones, []);
		//this.drums = sureArray(p.drums, []);
		this.measures = sureArray(p.measures, []);
		this.shrinkMeasures();
	} catch (e) {
		console.log(e);
	}

};
FretChordSheet.prototype.reCalcContentSize = function () {
	this.tiler.resetInnerSize(this.calcContentWidth(), this.contentHeight);
	this.tiler.resetSize();
};
FretChordSheet.prototype.calcContentWidth = function () {

	var r = this.margins.sheetLeft;
	for (var i = 0; i < this.measures.length; i++) {
		var minfo = this.measureInfo(i);
		r = r + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
		//console.log();
	}
	/*var mx = this.calcMaxStart192;
	var i = 0;
	var cu = 0;
	while (cu < mx) {
		var minfo = this.measureInfo(i);
		cu = cu + minfo.duration192;
		r = r + this.options.measureHeader * 3 * this.tapSize + minfo.duration192 / 6 * 3 * this.tapSize;
		i++;
	}*/
	return r;
};
FretChordSheet.prototype._____calcMeasureCount = function () {
	var mx = this.calcMaxStart192();
	var i = 0;
	var cu = 0;
	while (cu < mx) {
		var minfo = this.measureInfo(i);
		cu = cu + minfo.duration192;
		i++;
	}
	return i;
};
FretChordSheet.prototype._____calcMaxStart192 = function () {
	var mx = 0;
	for (var i = 0; i < this.tones.length; i++) {
		if (mx < this.tones[i].start192) {
			mx = this.tones[i].start192;
		}
	}
	for (var i = 0; i < this.drums.length; i++) {
		if (mx < this.drums[i].start192) {
			mx = this.drums[i].start192;
		}
	}
	/*var cu=0;
	while(cu<mx){
		cu=
	}*/
	//return Math.ceil((1+mx/6)/this.options.measureLen);
	return mx;
};
FretChordSheet.prototype.measureInfo = function (n) {
	//var x = this.margins.sheetLeft;
	for (var i = 0; i <= n; i++) {
		if (this.measures[i]) {
			//
		} else {
			this.measures[i] = new MeasureInfo();
		}
		//this.measures[i].left = x;
		//x = x + this.options.measureHeader + this.measures[i].duration192 / 6;
	}
	return this.measures[n];
};
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

	//this.layerBarNumbers.placeHolder=true;
	//this.layerOctaveNumbers.placeHolder=true;
	//this.layerBarNumbers = this.tiler.addBaseLayer();
	//this.layerSongName = this.tiler.addBaseLayer();
	//this.layerTest = this.tiler.addBaseLayer();
	//this.layerTest.placeHolder = true;
	//this.layerUndo = this.tiler.addLayer(true,true);
	this.margins = {
		sheetLeft: 60 * this.tiler.tapSize
		, sheetTop: 64 * 3 * this.tiler.tapSize
		, pianorollTop: 2 * 3 * this.tiler.tapSize
		, drumsTop: 116 * 3 * this.tiler.tapSize
		, fretTop: 107 * 3 * this.tiler.tapSize
	};
	//this.feels={straight:0,swing:1,triplet:2};
	this.feelNames = ['straight 1/8', 'straight 1/16', 'swing 1/16', 'triplet 2/16', 'straight 1/32'];
	this.feelPattern6 = [[0, 24, 48], [0, 12, 24, 36, 48], [0, 15, 30, 39, 48], [0, 8, 16, 24, 32, 40, 48], [0, 6, 12, 18, 24, 30, 36, 42, 48]];
	this.measureModeNames = ['3/4', '4/4', '5/4', '6/4', '7/4'];
	this.options = {
		//measureDuration: 32
		//, measureCount: 16
		//,
		measureHeader: 5
		, feel: 0
		, measureMode: 1
	};
	this.tones = [];
	this.drums = [];
	this.measures = [];
	this.strings = [28, 23, 19, 14, 9, 4];
	this.markNote = null;
	this.markStaff = null;
	this.markFret = null;
	//this.sheetY = 10.5 * this.tiler.tapSize;
	//this.sheetX = 6 * this.tiler.tapSize;
	//this.contentWidth = this.margins.sheetLeft + 3 * this.options.measureLen * (1 + this.options.measureCount) * this.tiler.tapSize;
	this.contentHeight = 125 * 3 * this.tiler.tapSize;
	//this.fgColor = '#000';
	//console.log(this.contentWidth,this.contentHeight);
	//this.gridColor = '#666';
	this.colors = {
		base: '#000'
		, grid: 'rgba(0,0,0,0.1)'
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
	//this.barCount = 16;
	//this.barSize = 32;

	this.tiler.adjustContentPosition();
	var me = this;
	this.tiler.addZoomLevel(3, function (left, top, width, height) {
		//console.log('render', 1.3, me.tiler.translateZ);
		var lineWidth = 0.1 * me.tiler.tapSize;

		me.tileBackground(left, top, width, height, lineWidth);
		me.tileLeftMenu(left, top, width, height, lineWidth);
		me.tilePianoOctaveLines(left, top, width, height, lineWidth);
		me.tilePianoOctaveKeys(left, top, width, height, lineWidth);
		me.tileOctaveNumbers(2 * me.tiler.tapSize, 3 * me.tiler.tapSize, left, top, width, height, lineWidth);
		me.tileBarNumbers(9 * me.tiler.tapSize, left, top, width, height, me.layerBarNumbers, lineWidth);
		me.tilePianorollNotes(left, top, width, height, lineWidth);
		/*
		me.tileStaff(left, top, width, height, me.layerBack, lineWidth);
		//me.tileBars(left, top, width, height,  me.layerBack, lineWidth);
		//me.tileSmallMeasureNumbers(left, top, width, height,  me.layerBarNumbers, lineWidth);
		//me.tileSongName(left, top, width, height, me.layerSongName, lineWidth);
		//me.tileTest(left, top, width, height,  me.layerTest, lineWidth);
		//me.tileBarNumbers(9 * me.tiler.tapSize, left, top, width, height, me.layerBarNumbers, lineWidth);
		//me.layerOctaveNumbers.lockX = me.tiler.svg.clientWidth - 7 * me.tiler.tapSize;
		//me.tileOctaveNumbers(10 * me.tiler.tapSize, left, top, width, height, me.layerOctaveNumbers, lineWidth);
		me.tileDrumRoll(left, top, width, height, me.layerBack, lineWidth);
		me.tileDrumRollLabels(left, top, width, height, me.layerDrumLabels, lineWidth);
		me.tilePianorollKeys(left, top, width, height, me.layerBack, lineWidth);
		me.tilFretStrings(left, top, width, height, me.layerBack, lineWidth);
		me.tilePianorollOctaves(left, top, width, height, me.layerBack, lineWidth);
		//me.testButtons(left, top, width, height, me.layerBack, lineWidth);
		me.tileLeftMenu(left, top, width, height, me.layerBack, lineWidth);
		me.tilePianorollNotes(left, top, width, height, me.layerBack, lineWidth);
		me.tileDrumRollPoints(left, top, width, height, me.layerBack, lineWidth);
		me.tileStaffNotes(left, top, width, height, me.layerBack, lineWidth);
		me.tileFretNotes(left, top, width, height, me.layerBack, lineWidth);
		*/
	});

	this.tiler.addZoomLevel(9, function (left, top, width, height) {
		//console.log('render', 7, me.tiler.translateZ);
		var lineWidth = 0.2 * me.tiler.tapSize;
		me.tileBackground(left, top, width, height, lineWidth);
		me.tileLeftMenu(left, top, width, height, lineWidth);
		me.tilePianoOctaveLines(left, top, width, height, lineWidth);
		me.tilePianoOctaveKeys(left, top, width, height, lineWidth);
		me.tileOctaveNumbers(1.5 * me.tiler.tapSize, 7 * me.tiler.tapSize, left, top, width, height, lineWidth);
		me.tileBarNumbers(3 * me.tiler.tapSize, left, top, width, height, me.layerBarNumbers, lineWidth);
		me.tilePianorollGrid(left, top, width, height, lineWidth);
		me.tilePianorollNotes(left, top, width, height, lineWidth);

		/*
		me.tileStaff(left, top, width, height, me.layerBack, lineWidth);
		me.tileStaffGrid(left, top, width, height, me.layerBack, lineWidth);
		//for (var n = 0; n < me.barCount; n++) {
		//me.tileMeasureGrid(left, top, width, height,  me.layerBack, lineWidth, n);
		//}
		//me.tileBars(left, top, width, height,  me.layerBack, lineWidth);
		//me.tileBigMeasureNumbers(left, top, width, height, me.layerBarNumbers, lineWidth);
		//me.tileSongName(left, top, width, height, me.layerSongName, lineWidth);
		//me.tileTest(left, top, width, height, me.layerTest, lineWidth);
		me.tileBarNumbers(5 * me.tiler.tapSize, left, top, width, height, me.layerBarNumbers, lineWidth);
		me.layerOctaveNumbers.lockX = me.tiler.svg.clientWidth - 2 * me.tiler.tapSize;
		me.tileOctaveNumbers(7 * me.tiler.tapSize, left, top, width, height, me.layerOctaveNumbers, lineWidth);
		me.tileDrumRoll(left, top, width, height, me.layerBack, lineWidth);
		me.tileDrumRollGrid(left, top, width, height, me.layerBack, lineWidth);
		me.tileDrumRollLabels(left, top, width, height, me.layerDrumLabels, lineWidth);
		me.tileDrumRollSpot(left, top, width, height, me.layerBack, lineWidth);
		me.tileFretSpot(left, top, width, height, me.layerBack, lineWidth);
		me.tileStaffSpot(left, top, width, height, me.layerBack, lineWidth);
		me.tilePianoSpot(left, top, width, height, me.layerBack, lineWidth);
		me.tilFretStrings(left, top, width, height, me.layerBack, lineWidth);
		me.tileFretGrid(left, top, width, height, me.layerBack, lineWidth);
		me.tilePianorollKeys(left, top, width, height, me.layerBack, lineWidth);
		me.tilePianorollGrid(left, top, width, height, me.layerBack, lineWidth);
		me.tilePianorollOctaves(left, top, width, height, me.layerBack, lineWidth);
		//me.testButtons(left, top, width, height, me.layerBack, lineWidth);
		me.tileLeftMenu(left, top, width, height, me.layerBack, lineWidth);
		me.tilePianorollNotes(left, top, width, height, me.layerBack, lineWidth);
		me.tileDrumRollPoints(left, top, width, height, me.layerBack, lineWidth);
		me.tilePianoMark(left, top, width, height, me.layerBack, lineWidth);
		me.tileStaffMark(left, top, width, height, me.layerBack, lineWidth);
		me.tileStaffNotes(left, top, width, height, me.layerBack, lineWidth);
		me.tileFretNotes(left, top, width, height, me.layerBack, lineWidth);
		*/
	});
	this.tiler.addZoomLevel(50, function (left, top, width, height) {
		//console.log('render', 15, me.tiler.translateZ);
		var lineWidth = 0.3 * me.tiler.tapSize;
		me.tileBackground(left, top, width, height, lineWidth);
		me.tileLeftMenu(left, top, width, height, lineWidth);
		me.tilePianoOctaveLines(left, top, width, height, lineWidth);
		me.tileBarNumbers(15 * me.tiler.tapSize, left, top, width, height, me.layerBarNumbers, lineWidth);
		me.tilePianorollNotes(left, top, width, height, lineWidth);

		/*
		me.tileStaff(left, top, width, height, me.layerBack, lineWidth);
		//me.tileBars(left, top, width, height,  me.layerBack, lineWidth);
		//me.tileSongName(left, top, width, height, me.layerSongName, lineWidth);
		//me.tileTest(left, top, width, height, me.layerTest, lineWidth);
		//me.tileSomeBarNumbers(left, top, width, height,  me.layerTest, lineWidth);
		me.tileBarNumbers(15 * me.tiler.tapSize, left, top, width, height, me.layerBarNumbers, lineWidth);
		//me.layerOctaveNumbers.lockX = me.tiler.svg.clientWidth - 3 * me.tiler.tapSize;
		//me.tileOctaveNumbers(30 * me.tiler.tapSize, left, top, width, height, me.layerOctaveNumbers, lineWidth);
		me.tileDrumRoll(left, top, width, height, me.layerBack, lineWidth);
		me.tilFretStrings(left, top, width, height, me.layerBack, lineWidth);

		me.tilePianorollOctaves(left, top, width, height, me.layerBack, lineWidth);
		//me.testButtons(left, top, width, height, me.layerBack, lineWidth);
		me.tileLeftMenu(left, top, width, height, me.layerBack, lineWidth);
		me.tilePianorollNotes(left, top, width, height, me.layerBack, lineWidth);
		me.tileDrumRollPoints(left, top, width, height, me.layerBack, lineWidth);
		me.tileStaffNotes(left, top, width, height, me.layerBack, lineWidth);
		me.tileFretNotes(left, top, width, height, me.layerBack, lineWidth);
*/
	});

	window.addEventListener("beforeunload", function () { me.saveState(me.prefix); });
	window.addEventListener("blur", function () { me.saveState(me.prefix); });
	me.resetUndoStatus();
	me.loadState(me.prefix);
	me.reCalcContentSize();
};
FretChordSheet.prototype.findBeatX = function (measureNum, step192) {
	var x = this.margins.sheetLeft+this.options.measureHeader* 3 * this.tiler.tapSize;
	
	for (var i = 0; i < this.measures.length; i++) {
		if (i < measureNum) {
			x = x + (this.options.measureHeader + this.measures[i].duration4 * 8) * 3 * this.tiler.tapSize;
			//ms192 = ms192 + this.measures[i].duration4 * 8 * 6;
		} else {
			break;
		}
	}
	var ms192 = 0;
	console.log('x', x);
	for (var i = measureNum; i < this.measures.length; i++) {
		if (step192 < ms192 + this.measures[i].duration4 * 8 * 6) {
			//console.log(step192, ms192);
			x = x + (step192 - ms192) / 6 * 3 * this.tiler.tapSize;
			console.log('findBeatX',  x);
			return x;
		} else {
			x = x + (this.options.measureHeader + this.measures[i].duration4 * 8) * 3 * this.tiler.tapSize;
			ms192 = ms192 + this.measures[i].duration4 * 8 * 6;
		}
		//console.log('x', x);
	}
	//console.log('no findBeatX', measureNum, step192);
	return x;
};
FretChordSheet.prototype.addNote = function (note) {
	if (note) {
		this.tones.push(note);
	}
};
FretChordSheet.prototype.addDrum = function (drum) {
	if (drum) {
		this.drums.push(drum);
	}
};
FretChordSheet.prototype.dropNote = function (note) {
	for (var i = 0; i < this.tones.length; i++) {
		if (this.tones[i].tone == note.tone
			&& this.tones[i].pitch == note.pitch
			&& ((!(this.tones[i].string)) || (this.tones[i].string == note.string))
			&& this.tones[i].start192 == note.start192
		) {
			this.tones.splice(i, 1);
			return;
		}
	}
};
FretChordSheet.prototype.dropDrum = function (drum) {
	for (var i = 0; i < this.drums.length; i++) {
		if (this.drums[i].kind == drum.kind
			&& this.drums[i].start192 == drum.start192
		) {
			this.drums.splice(i, 1);
			return;
		}
	}
};
/*FretChordSheet.prototype.findByString = function (tone, start192, len192, string) {
	var notes = [];
	for (var i = 0; i < this.tones.length; i++) {
		if (this.tones[i].tone == tone
			&& this.tones[i].pitch == pitch
			&& this.tones[i].start192 >= start192
			&& this.tones[i].start192 < start192 + len192
		) {
			notes.push(this.tones[i]);
		}
	}
	return notes;
};*/
FretChordSheet.prototype.findNotes = function (tone, start192, len192, pitch) {//, string) {
	var notes = [];
	for (var i = 0; i < this.tones.length; i++) {
		if (this.tones[i].tone == tone
			&& this.tones[i].pitch == pitch
			//&& ((!(this.tones[i].string)) || (this.tones[i].string == string))
			&& this.tones[i].start192 >= start192
			&& this.tones[i].start192 < start192 + len192
		) {
			notes.push(this.tones[i]);
		}
	}
	return notes;
};
FretChordSheet.prototype.findFrets = function (tone, start192, len192, string) {//, string) {
	var notes = [];
	for (var i = 0; i < this.tones.length; i++) {
		this.tones[i].string = this.tones[i].string | this.stringNumber(this.tones[i].pitch);
		if (this.tones[i].tone == tone
			//&& this.tones[i].pitch == pitch
			&& this.tones[i].string == string
			&& this.tones[i].start192 >= start192
			&& this.tones[i].start192 < start192 + len192
		) {
			notes.push(this.tones[i]);
		}
	}
	return notes;
};
FretChordSheet.prototype.findDrums = function (kind, start192, len192) {
	var drums = [];
	for (var i = 0; i < this.drums.length; i++) {
		if (this.drums[i].kind == kind
			&& this.drums[i].start192 >= start192
			&& this.drums[i].start192 < start192 + len192
		) {
			drums.push(this.drums[i]);
		}
	}
	return drums;
};
FretChordSheet.prototype.octave = function (pitch) {
	return Math.floor(pitch / 12);
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
	//console.log('pitch',pitch,'string',r6,this.strings[r6],'fret',(pitch-this.strings[r6]));
	return r6;
};
FretChordSheet.prototype.tileBackground = function (left, top, width, height, lineWidth) {
	/*var me = this;
	this.layerBack.renderGroup(0, 0, this.calcContentWidth(), this.contentHeight
		, 'bgPane', left, top, width, height, function (tg) {
			tg.layer.tileRectangle(tg.g, tg.x, tg.y, tg.w, tg.h, 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.05)', tg.layer.tapSize);
		});*/
};
FretChordSheet.prototype.tilePianoOctaveLines = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	for (var x = 0; x < this.measures.length; x++) {
		var minfo = this.measureInfo(x);
		for (var y = 0; y < 5; y++) {
			this.layerOctaves.renderGroup(mx + this.margins.sheetLeft + this.options.measureHeader * 3 * this.tiler.tapSize
				, this.margins.pianorollTop + y * 3 * 12 * this.tiler.tapSize
				, (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize - this.options.measureHeader * 3 * this.tiler.tapSize
				, 12 * 3 * this.tiler.tapSize
				, 'octaveLines' + x + 'x' + y, left, top, width, height, function (tg) {
					//tg.layer.tileRectangle(tg.g, tg.x, tg.y, tg.w, tg.h, 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.05)', tg.layer.tapSize);
					if (y > 0) {
						tg.layer.tileRectangle(tg.g, tg.x, tg.y, tg.w, lineWidth, me.colors.base);
					}
					tg.layer.tileRectangle(tg.g, tg.x + tg.w, tg.y, lineWidth, tg.h, me.colors.base);
				});
		}
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
};

FretChordSheet.prototype.tilePianoOctaveKeys = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	for (var x = 0; x < this.measures.length; x++) {
		var minfo = this.measureInfo(x);
		for (var y = 0; y < 5; y++) {
			this.layerOctaveKeys.renderGroup(mx + this.margins.sheetLeft + this.options.measureHeader * 3 * this.tiler.tapSize
				, this.margins.pianorollTop + y * 3 * 12 * this.tiler.tapSize
				, (this.options.measureHeader + minfo.duration4 * 8 - this.options.measureHeader) * 3 * this.tiler.tapSize
				, 12 * 3 * this.tiler.tapSize
				, 'octaveKeys' + x + 'x' + y, left, top, width, height, function (tg) {
					//tg.layer.tileRectangle(tg.g, tg.x, tg.y, tg.w, tg.h, 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.05)', tg.layer.tapSize);
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
FretChordSheet.prototype.tilePianorollGrid = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	for (var x = 0; x < this.measures.length; x++) {
		var minfo = this.measureInfo(x);
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
FretChordSheet.prototype.tilePianorollNoteLine = function (tg, tonenote, start192, measureNum) {
	var tx = start192 / 6 * 3 * tg.layer.tapSize;
	var ty = (5 * 12 - tonenote.pitch - 1) * 3 * tg.layer.tapSize + this.margins.pianorollTop;
	console.log('tx', tg.x + tx + 1.5 * tg.layer.tapSize);
	var tw = this.findBeatX(measureNum, start192 + tonenote.duration192) - (tg.x + tx + 1.5 * tg.layer.tapSize);
	console.log('tw',tw);
	tg.layer.tileLine(tg.g
		, tg.x + tx + 1.5 * tg.layer.tapSize
		, ty + 1.5 * tg.layer.tapSize
		, tg.x + tx +tw //tg.x + tx - 1.5 * tg.layer.tapSize + tonenote.duration192 / 6 * 3 * tg.layer.tapSize
		, ty + 1.5 * tg.layer.tapSize + tonenote.shift * 3 * tg.layer.tapSize
		, this.colors.base, 2.9 * tg.layer.tapSize);
};

FretChordSheet.prototype.tilePianorollNotes = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	for (var x = 0; x < this.measures.length; x++) {
		var minfo = this.measureInfo(x);
		for (var y = 0; y < 5; y++) {
			this.layerNotes.renderGroup(mx + this.margins.sheetLeft + this.options.measureHeader * 3 * this.tiler.tapSize
				, this.margins.pianorollTop + y * 3 * 12 * this.tiler.tapSize
				, (this.options.measureHeader + minfo.duration4 * 8 - this.options.measureHeader) * 3 * this.tiler.tapSize
				, 12 * 3 * this.tiler.tapSize
				, 'nts' + x + 'x' + y, left, top, width, height, function (tg) {
					for (var b = 0; b < minfo.beats.length; b++) {
						var beat = minfo.beats[b];
						for (var c = 0; c < beat.chords.length; c++) {
							var chord = beat.chords[c];
							for (var n = 0; n < chord.notes.length; n++) {
								var note = chord.notes[n];
								if (note.pitch >= 12 * (4 - y) && note.pitch < 12 * (5 - y)) {
									//console.log(x, y, tg, note);
									me.tilePianorollNoteLine(tg, note, beat.start192, x);
								}
							}
						}
					}
				});
		}
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
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
		});
};
FretChordSheet.prototype.tileRange = function (tg, id, x, y, w, h, v, mx, label, action) {
	tg.layer.tileLine(tg.g, tg.x + x + h / 2, tg.y + y + h / 2, tg.x + x + w - h / 2, tg.y + y + h / 2, this.colors.buttonShadow, h);
	tg.layer.tileLine(tg.g, tg.x + x + h / 2, tg.y + y + h / 2, tg.x + x + w * v / mx - h / 2, tg.y + y + h / 2, this.colors.buttonFill, h);
	tg.layer.tileText(tg.g, tg.x + x + h / 4, tg.y + y + 0.8 * h, 0.025 * h * tg.layer.tapSize, label, this.colors.buttonLabel);
	for (var i = 0; i < mx; i++) {
		var s = tg.layer.addSpot(id + '_' + i, tg.x + x + i * w / mx, tg.y + y, w / mx, h, function (v) {
			action(this.selectedValue);
		});
		s.selectedValue = i + 1;
	}
};
FretChordSheet.prototype.shrinkMeasures = function () {

	this.measures=[];
	var minfo = this.measureInfo(7);
	var beat = new MeasureBeat();
	minfo.beats[0] = beat;
	var chord = new MeasureToneChord();
	beat.chords[0] = chord;
	var note = new MeasureToneNote();
	note.duration192 = 6 * 8 * 7;
	chord.notes[0] = note;
	note.pitch = 0;
	note = new MeasureToneNote();
	note.duration192 = 6 * 8 * 8;
	chord.notes[1] = note;
	note.pitch = 3;
	note = new MeasureToneNote();
	note.duration192 = 6 * 8 * 9;
	chord.notes[2] = note;
	note.pitch = 5;
	//console.log(this.measures);
	minfo = this.measureInfo(10);
	beat = new MeasureBeat();
	minfo.beats[0] = beat;
	var chord = new MeasureToneChord();
	beat.chords[0] = chord;
	var note = new MeasureToneNote();
	chord.notes[0] = note;
	note.pitch = 8;
console.log(this.measures);

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

