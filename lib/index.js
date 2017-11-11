console.log('FretChordSheet');
function FretChordSheet() {
	console.log('create FretChordSheet');
	return this;
}
FretChordSheet.prototype.init = function () {
	console.log('init FretChordSheet');

	this.tiler = new TileLevel("contentSVG", 'cntnt');
	this.tiler.translateZ = 6.9;
	this.layerBack = this.tiler.addBaseLayer();
	this.layerBarNumbers = this.tiler.addBaseLayer();
	this.layerSongName = this.tiler.addBaseLayer();
	this.layerTest = this.tiler.addRowLayer();
	//this.layerUndo = this.tiler.addLayer(true,true);
	this.margins={
		sheetY : 10.5 * this.tiler.tapSize
		,sheetX : 6 * this.tiler.tapSize
	};
	//this.sheetY = 10.5 * this.tiler.tapSize;
	//this.sheetX = 6 * this.tiler.tapSize;
	this.contentWidth = 256 * 3 * this.tiler.tapSize;
	this.contentHeight = 50 * this.tiler.tapSize;
	//this.fgColor = '#000';

	//this.gridColor = '#666';
	this.colors = {
		base: '#000'
		, grid: '#666'
		, barCounter: '#666'
	};
	this.barCount = 16;
	this.barSize = 32;
	this.tiler.resetInnerSize(this.contentWidth, this.contentHeight);
	this.tiler.adjustContentPosition();
	var me = this;
	this.tiler.addZoomLevel(1.3, function (left, top, width, height) {
		//console.log('render', 1.3, me.tiler.translateZ);
		var lineWidth = 0.1 * me.tiler.tapSize;
		me.tileStaff(left, top, width, height, me.layerBack, lineWidth);
		me.tileBars(left, top, width, height,  me.layerBack, lineWidth);
		me.tileSmallMeasureNumbers(left, top, width, height,  me.layerBarNumbers, lineWidth);
		me.tileSongName(left, top, width, height, me.layerSongName, lineWidth);
		me.tileTest(left, top, width, height,  me.layerTest, lineWidth);
	});

	this.tiler.addZoomLevel(7, function (left, top, width, height) {
		//console.log('render', 7, me.tiler.translateZ);
		var lineWidth = 0.1 * me.tiler.tapSize;
		me.tileStaff(left, top, width, height, me.layerBack, lineWidth);
		for (var n = 0; n < me.barCount; n++) {
			me.tileMeasureGrid(left, top, width, height,  me.layerBack, lineWidth, n);
		}
		me.tileBars(left, top, width, height,  me.layerBack, lineWidth);
		me.tileBigMeasureNumbers(left, top, width, height, me.layerBarNumbers, lineWidth);
		me.tileSongName(left, top, width, height, me.layerSongName, lineWidth);
		me.tileTest(left, top, width, height,  me.layerTest, lineWidth);
	});
	this.tiler.addZoomLevel(15, function (left, top, width, height) {
		//console.log('render', 15, me.tiler.translateZ);
		var lineWidth = 0.2 * me.tiler.tapSize;
		me.tileStaff(left, top, width, height,  me.layerBack, lineWidth);
		me.tileBars(left, top, width, height,  me.layerBack, lineWidth);
		me.tileSongName(left, top, width, height, me.layerSongName, lineWidth);
		me.tileTest(left, top, width, height,  me.layerTest, lineWidth);

	});

};

