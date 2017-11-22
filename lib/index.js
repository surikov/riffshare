console.log('FretChordSheet');
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
		,drums:this.drums
		,tones:this.tones
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
		this.options.measureLen = (this.options.measureMode + 3) * 8;
		this.tones=sureArray(p.tones,[]);
		this.drums=sureArray(p.drums,[]);
		this.tiler.resetSize();
	} catch (e) {
		console.log(e);
	}

};
FretChordSheet.prototype.init = function () {
	console.log('init FretChordSheet');

	this.prefix = 'as12';

	this.tiler = new TileLevel("contentSVG", 'cntnt');
	this.tiler.translateZ = 6.9;

	this.layerBarNumbers = this.tiler.addRowLayer();
	this.layerOctaveNumbers = this.tiler.addColumnLayer();

	this.layerBack = this.tiler.addBaseLayer();
	this.layerDrumLabels = this.tiler.addColumnLayer();

	//this.layerBarNumbers.placeHolder=true;
	//this.layerOctaveNumbers.placeHolder=true;
	//this.layerBarNumbers = this.tiler.addBaseLayer();
	//this.layerSongName = this.tiler.addBaseLayer();
	this.layerTest = this.tiler.addBaseLayer();
	this.layerTest.placeHolder = true;
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
		measureLen: 32
		, measureCount: 16
		, feel: 0
		, measureMode: 1
	};
	this.tones = [];
	this.drums = [];
	this.markNote=null;
	//this.sheetY = 10.5 * this.tiler.tapSize;
	//this.sheetX = 6 * this.tiler.tapSize;
	this.contentWidth = this.margins.sheetLeft + 3 * this.options.measureLen * (1 + this.options.measureCount) * this.tiler.tapSize;
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
		, buttonFill: '#fff'
		, buttonShadow: 'rgba(0,0,0,0.1)'
		, buttonLabel: '#000'
		, bgCopy: '#cde'
	};
	//this.barCount = 16;
	//this.barSize = 32;
	this.tiler.resetInnerSize(this.contentWidth, this.contentHeight);
	this.tiler.adjustContentPosition();
	var me = this;
	this.tiler.addZoomLevel(3, function (left, top, width, height) {
		//console.log('render', 1.3, me.tiler.translateZ);
		var lineWidth = 0.1 * me.tiler.tapSize;
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
	});

	this.tiler.addZoomLevel(9, function (left, top, width, height) {
		//console.log('render', 7, me.tiler.translateZ);
		var lineWidth = 0.2 * me.tiler.tapSize;
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
		me.layerOctaveNumbers.lockX = me.tiler.svg.clientWidth - 3 * me.tiler.tapSize;
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
	});
	this.tiler.addZoomLevel(50, function (left, top, width, height) {
		//console.log('render', 15, me.tiler.translateZ);
		var lineWidth = 0.3 * me.tiler.tapSize;
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

	});
	this.testButtons = function (left, top, width, height) {
		/*
				me.layerOctaveNumbers.renderGroup(100, 200, 300, 400, 'btn1', left, top, width, height, function (tg) {
					me.tileButton(tg, 'b1', 0, 0, me.tiler.tapSize*3, 'First Button', function () {
						console.log('btn1 click');
					});
				});
				me.layerBarNumbers.renderGroup(450, 200, 300, 400, 'btn2', left, top, width, height, function (tg) {
					me.tileButton(tg, 'b2', 0, 0, me.tiler.tapSize*3, 'Second Button', function () {
						console.log('btn2 click');
					});
				});
				*/
		me.layerBack.renderGroup(0, 0, me.margins.sheetLeft, this.contentHeight, 'me', left, top, width, height, function (tg) {
			me.tileButton(tg, 'b3', 3 * me.tiler.tapSize, 1 * 3 * me.tiler.tapSize, 3 * me.tiler.tapSize, 'Third Button', function () {
				console.log('btn3 click');
			});
			me.tileRange(tg, 'rngt', 3 * me.tiler.tapSize, 3 * 3 * me.tiler.tapSize, 3 * me.tiler.tapSize, me.margins.sheetLeft - 6 * me.tiler.tapSize, 1, 7, 'Range button', function (v) {
				console.log('v', v);
			});
			me.tileRange(tg, 'rngt2', 3 * me.tiler.tapSize, 5 * 3 * me.tiler.tapSize, 3 * me.tiler.tapSize, me.margins.sheetLeft - 6 * me.tiler.tapSize, 2, 7, 'Range button2', function (v) {
				console.log('v2', v);
			});

			me.tileRange(tg, 'rngt3', 3 * me.tiler.tapSize, 7 * 3 * me.tiler.tapSize, 3 * me.tiler.tapSize, me.margins.sheetLeft - 6 * me.tiler.tapSize, 3, 7, 'Range button 3', function (v) {
				console.log('v3', v);
			});
			me.tileRange(tg, 'rngt7', 3 * me.tiler.tapSize, 9 * 3 * me.tiler.tapSize, 3 * me.tiler.tapSize, me.margins.sheetLeft - 6 * me.tiler.tapSize, 7, 7, 'Range button 7', function (v) {
				console.log('v7', v);
			});
			me.tileDoubleRange(tg, 'drnge1', 3 * me.tiler.tapSize, 11 * 3 * me.tiler.tapSize, 3 * me.tiler.tapSize, me.margins.sheetLeft - 6 * me.tiler.tapSize
				, 4, 21, '64', function (v) {
					console.log('dr1', v);
				});
			me.tileDoubleRange(tg, 'drnge2', 3 * me.tiler.tapSize, 12 * 3 * me.tiler.tapSize, 3 * me.tiler.tapSize, me.margins.sheetLeft - 6 * me.tiler.tapSize
				, 2, 21, '512', function (v) {
					console.log('dr2', v);
				});
			me.tileDoubleRange(tg, 'drnge3', 3 * me.tiler.tapSize, 13 * 3 * me.tiler.tapSize, 3 * me.tiler.tapSize, me.margins.sheetLeft - 6 * me.tiler.tapSize
				, 11, 21, '1k', function (v) {
					console.log('dr3', v);
				});
			me.tileDoubleRange(tg, 'drnge4', 3 * me.tiler.tapSize, 14 * 3 * me.tiler.tapSize, 3 * me.tiler.tapSize, me.margins.sheetLeft - 6 * me.tiler.tapSize
				, 21, 21, '4k', function (v) {
					console.log('dr4', v);
				});
			me.tileDoubleRange(tg, 'drnge5', 3 * me.tiler.tapSize, 15 * 3 * me.tiler.tapSize, 3 * me.tiler.tapSize, me.margins.sheetLeft - 6 * me.tiler.tapSize
				, 20, 21, '16K', function (v) {
					console.log('dr5', v);
				});
		});

	}
	window.addEventListener("beforeunload", function () { me.saveState(me.prefix); });
	window.addEventListener("blur", function () { me.saveState(me.prefix); });
	me.resetUndoStatus();
	me.loadState(me.prefix);
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
			&& this.tones[i].start192 == note.start192
		) {
			this.tones.splice(i, 1);
			return;
		}
	}
};
FretChordSheet.prototype.dropDrum = function (drum) {
	for (var i = 0; i < this.drums.length; i++) {
		if ( this.drums[i].kind == drum.kind
			&& this.drums[i].start192 == drum.start192
		) {
			this.drums.splice(i, 1);
			return;
		}
	}
};
FretChordSheet.prototype.findNotes = function (tone, start192, len192,pitch) {
	var notes = [];
	for (var i = 0; i < this.tones.length; i++) {
		if (this.tones[i].tone == tone
			&& this.tones[i].pitch == pitch
			&& this.tones[i].start192 >= start192
			&& this.tones[i].start192 < start192+len192
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
			&& this.drums[i].start192 < start192+len192
		) {
			drums.push(this.drums[i]);
		}
	}
	return drums;
};
