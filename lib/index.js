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
		me.layerOctaveNumbers.renderGroup(100, 200, 300, 400, 'btn1', left, top, width, height, function (tg) {
			me.layerOctaveNumbers.addSpot('btn1', tg.x, tg.y, tg.w, tg.h, function () {
				console.log('btn1 click');
			}, false, false);
			me.layerOctaveNumbers.tileRectangle(tg.g, tg.x, tg.y, tg.w, tg.h, '#f00');
		});
		me.layerBarNumbers.renderGroup(450, 200, 300, 400, 'btn2', left, top, width, height, function (tg) {
			me.layerBarNumbers.addSpot('btn2', tg.x, tg.y, tg.w, tg.h, function () {
				console.log('btn2 click');
			}, false, false);
			me.layerBarNumbers.tileRectangle(tg.g, tg.x, tg.y, tg.w, tg.h, '#ff0');
		});
		me.layerBack.renderGroup(800, 200, 300, 400, 'btn3', left, top, width, height, function (tg) {
			me.layerBack.addSpot('btn3', tg.x, tg.y, tg.w, tg.h, function () {
				console.log('btn3 click');
			}, false, false);
			me.layerBack.tileRectangle(tg.g, tg.x, tg.y, tg.w, tg.h, '#0f0');
		});

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
		me.layerOctaveNumbers.renderGroup(100, 200, 300, 400, 'btn1', left, top, width, height, function (tg) {
			me.layerOctaveNumbers.addSpot('btn1', tg.x, tg.y, tg.w, tg.h, function () {
				console.log('btn1 click');
			}, false, false);
			me.layerOctaveNumbers.tileRectangle(tg.g, tg.x, tg.y, tg.w, tg.h, '#f00');
		});
		me.layerBarNumbers.renderGroup(450, 200, 300, 400, 'btn2', left, top, width, height, function (tg) {
			me.layerBarNumbers.addSpot('btn2', tg.x, tg.y, tg.w, tg.h, function () {
				console.log('btn2 click');
			}, false, false);
			me.layerBarNumbers.tileRectangle(tg.g, tg.x, tg.y, tg.w, tg.h, '#ff0');
		});
		me.layerBack.renderGroup(800, 200, 300, 400, 'btn3', left, top, width, height, function (tg) {
			me.layerBack.addSpot('btn3', tg.x, tg.y, tg.w, tg.h, function () {
				console.log('btn3 click');
			}, false, false);
			me.layerBack.tileRectangle(tg.g, tg.x, tg.y, tg.w, tg.h, '#0f0');
		});
	});
	this.tiler.addZoomLevel(25, function (left, top, width, height) {
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
		me.layerOctaveNumbers.renderGroup(100, 200, 300, 400, 'btn1', left, top, width, height, function (tg) {
			me.layerOctaveNumbers.addSpot('btn1', tg.x, tg.y, tg.w, tg.h, function () {
				console.log('btn1 click');
			}, false, false);
			me.layerOctaveNumbers.tileRectangle(tg.g, tg.x, tg.y, tg.w, tg.h, '#f00');
		});
		me.layerBarNumbers.renderGroup(450, 200, 300, 400, 'btn2', left, top, width, height, function (tg) {
			me.layerBarNumbers.addSpot('btn2', tg.x, tg.y, tg.w, tg.h, function () {
				console.log('btn2 click');
			}, false, false);
			me.layerBarNumbers.tileRectangle(tg.g, tg.x, tg.y, tg.w, tg.h, '#ff0');
		});
		me.layerBack.renderGroup(800, 200, 300, 400, 'btn3', left, top, width, height, function (tg) {
			me.layerBack.addSpot('btn3', tg.x, tg.y, tg.w, tg.h, function () {
				console.log('btn3 click');
			}, false, false);
			me.layerBack.tileRectangle(tg.g, tg.x, tg.y, tg.w, tg.h, '#0f0');
		});
	});

};

