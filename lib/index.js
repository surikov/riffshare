console.log('FretChordSheet');
function FretChordSheet() {
	console.log('create FretChordSheet');
	return this;
}
FretChordSheet.prototype.init = function () {
	console.log('init FretChordSheet');

	this.tiler = new TileLevel("contentSVG", 'cntnt');
	this.tiler.translateZ = 6.9;
	this.layerBarNumbers = this.tiler.addRowLayer();
	this.layerOctaveNumbers = this.tiler.addColumnLayer();
	this.layerBack = this.tiler.addBaseLayer();

	//this.layerBarNumbers.placeHolder=true;
	//this.layerOctaveNumbers.placeHolder=true;
	//this.layerBarNumbers = this.tiler.addBaseLayer();
	//this.layerSongName = this.tiler.addBaseLayer();
	this.layerTest = this.tiler.addBaseLayer();
	//this.layerUndo = this.tiler.addLayer(true,true);
	this.margins = {
		sheetLeft: 60 * this.tiler.tapSize
		, sheetTop: 71 * 3 * this.tiler.tapSize
		, pianorollTop: 1 * 3 * this.tiler.tapSize
		, drumsTop: 62 * 3 * this.tiler.tapSize
		, fretTop: 114 * 3 * this.tiler.tapSize
	};
	this.options = {
		measureLen: 32
		, measureCount: 16
		, swingMode: 0

	};
	//this.sheetY = 10.5 * this.tiler.tapSize;
	//this.sheetX = 6 * this.tiler.tapSize;
	this.contentWidth = this.margins.sheetLeft + 3 * this.options.measureLen * (1 + this.options.measureCount) * this.tiler.tapSize;
	this.contentHeight = 125 * 3 * this.tiler.tapSize;
	//this.fgColor = '#000';
	//console.log(this.contentWidth,this.contentHeight);
	//this.gridColor = '#666';
	this.colors = {
		base: '#000'
		, grid: '#000'
		, barCounter: 'rgba(0,0,0,0.3)'
		, staff: '#000'
		, whiteKey: 'rgba(255,255,255,0.1)'
		, blackKey: 'rgba(0,0,0,0.1)'
		, buttonFill: '#ffc'
		, buttonShadow: '#999'
		, buttonLabel: '#000'
	};
	//this.barCount = 16;
	//this.barSize = 32;
	this.tiler.resetInnerSize(this.contentWidth, this.contentHeight);
	this.tiler.adjustContentPosition();
	var me = this;
	this.tiler.addZoomLevel(1.3, function (left, top, width, height) {
		//console.log('render', 1.3, me.tiler.translateZ);
		var lineWidth = 0.1 * me.tiler.tapSize;
		me.tileStaff(left, top, width, height, me.layerBack, lineWidth);
		//me.tileBars(left, top, width, height,  me.layerBack, lineWidth);
		//me.tileSmallMeasureNumbers(left, top, width, height,  me.layerBarNumbers, lineWidth);
		//me.tileSongName(left, top, width, height, me.layerSongName, lineWidth);
		//me.tileTest(left, top, width, height,  me.layerTest, lineWidth);
		me.tileBarNumbers(9 * me.tiler.tapSize, left, top, width, height, me.layerBarNumbers, lineWidth);
		me.tileOctaveNumbers(11 * me.tiler.tapSize, left, top, width, height, me.layerOctaveNumbers, lineWidth);
		me.tileDrumGrid(left, top, width, height, me.layerBack, lineWidth);
		me.tilFretGrid(left, top, width, height, me.layerBack, lineWidth);
		me.tilePianorollOctaves(left, top, width, height, me.layerBack, lineWidth);
		me.testButtons(left, top, width, height, me.layerBack, lineWidth);

	});

	this.tiler.addZoomLevel(9, function (left, top, width, height) {
		//console.log('render', 7, me.tiler.translateZ);
		var lineWidth = 0.2 * me.tiler.tapSize;
		me.tileStaff(left, top, width, height, me.layerBack, lineWidth);
		//for (var n = 0; n < me.barCount; n++) {
		//me.tileMeasureGrid(left, top, width, height,  me.layerBack, lineWidth, n);
		//}
		//me.tileBars(left, top, width, height,  me.layerBack, lineWidth);
		//me.tileBigMeasureNumbers(left, top, width, height, me.layerBarNumbers, lineWidth);
		//me.tileSongName(left, top, width, height, me.layerSongName, lineWidth);
		//me.tileTest(left, top, width, height,  me.layerTest, lineWidth);
		me.tileBarNumbers(9 * me.tiler.tapSize, left, top, width, height, me.layerBarNumbers, lineWidth);
		me.tileOctaveNumbers(11 * me.tiler.tapSize, left, top, width, height, me.layerOctaveNumbers, lineWidth);
		me.tileDrumGrid(left, top, width, height, me.layerBack, lineWidth);
		me.tilFretGrid(left, top, width, height, me.layerBack, lineWidth);
		me.tilePianorollOctaves(left, top, width, height, me.layerBack, lineWidth);
		me.testButtons(left, top, width, height, me.layerBack, lineWidth);
	});
	this.tiler.addZoomLevel(50, function (left, top, width, height) {
		//console.log('render', 15, me.tiler.translateZ);
		var lineWidth = 0.3 * me.tiler.tapSize;
		me.tileStaff(left, top, width, height, me.layerBack, lineWidth);
		//me.tileBars(left, top, width, height,  me.layerBack, lineWidth);
		//me.tileSongName(left, top, width, height, me.layerSongName, lineWidth);
		//me.tileTest(left, top, width, height,  me.layerTest, lineWidth);
		//me.tileSomeBarNumbers(left, top, width, height,  me.layerTest, lineWidth);
		me.tileBarNumbers(9 * me.tiler.tapSize, left, top, width, height, me.layerBarNumbers, lineWidth);
		me.tileOctaveNumbers(11 * me.tiler.tapSize, left, top, width, height, me.layerOctaveNumbers, lineWidth);
		me.tileDrumGrid(left, top, width, height, me.layerBack, lineWidth);
		me.tilFretGrid(left, top, width, height, me.layerBack, lineWidth);
		me.tilePianorollOctaves(left, top, width, height, me.layerBack, lineWidth);
		me.testButtons(left, top, width, height, me.layerBack, lineWidth);
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

};

