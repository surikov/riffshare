console.log('start');
var tiler = new TileLevel("contentSVG", 'cntnt');
tiler.resetInnerSize(4000, 3000);
var bg = tiler.addLayer();
var sheetY = 10.5 * tiler.tapSize;
var sheetX = 6 * tiler.tapSize;
var contentWidth = 256 * 3 * tiler.tapSize;
var contentHeight = 50 * tiler.tapSize;
var fgColor = '#000';
var barCount = 16;
var barSize = 16;
tiler.resetInnerSize(contentWidth, contentHeight);
tiler.addZoomLevel(2, function (left, top, width, height) {
	console.log('render', 3, tiler.translateZ);
	var lineWidth = 0.01 * tiler.tapSize;
	tileLines(left, top, width, height, tiler, bg, lineWidth, '#ff9');
	tileBars(left, top, width, height, tiler, bg, lineWidth);
	tileSmallMeasureNumbers(left, top, width, height, tiler, bg, lineWidth);
});
tiler.addZoomLevel(9, function (left, top, width, height) {
	console.log('render', 7, tiler.translateZ);
	var lineWidth = 0.05 * tiler.tapSize;
	tileLines(left, top, width, height, tiler, bg, lineWidth, '#fcf');
	for (var n = 0; n < barCount; n++) {
		tileMeasureGrid(left, top, width, height, tiler, bg, lineWidth, n);
	}
	tileBars(left, top, width, height, tiler, bg, lineWidth);
	tileBigMeasureNumbers(left, top, width, height, tiler, bg, lineWidth);
});
tiler.addZoomLevel(15, function (left, top, width, height) {
	console.log('render', 15, tiler.translateZ);
	var lineWidth = 0.1 * tiler.tapSize;
	tileLines(left, top, width, height, tiler, bg, lineWidth, '#cf9');
	tileBars(left, top, width, height, tiler, bg, lineWidth);
});
function tileLines(left, top, width, height, tileLevel, layer, lineWidth, color) {
	var tg = tileLevel.tileGroup(0, 0, contentWidth, contentHeight, 'bgrec', layer, left, top, width, height);
	if (tg) {
		tileLevel.tileRectangle(tg.g, tg.x, tg.y, tg.w, tg.h, color);
		tileNoteHead(0, 0, tg, tileLevel);
		tileNoteHead(48, 5, tg, tileLevel);
		tileNoteHead(192, 6, tg, tileLevel);
		//tileLevel.tileCircle(tg.g, 1.5 * tileLevel.tapSize, 1.5 * tileLevel.tapSize, 1.5 * tileLevel.tapSize, '#333');
		tileLevel.tileRectangle(tg.g, sheetX, sheetY + 0 * tileLevel.tapSize, contentWidth, lineWidth, fgColor);
		tileLevel.tileRectangle(tg.g, sheetX, sheetY + 3 * tileLevel.tapSize, contentWidth, lineWidth, fgColor);
		tileLevel.tileRectangle(tg.g, sheetX, sheetY + 6 * tileLevel.tapSize, contentWidth, lineWidth, fgColor);
		tileLevel.tileRectangle(tg.g, sheetX, sheetY + 9 * tileLevel.tapSize, contentWidth, lineWidth, fgColor);
		tileLevel.tileRectangle(tg.g, sheetX, sheetY + 12 * tileLevel.tapSize, contentWidth, lineWidth, fgColor);
	}
}
function tileBars(left, top, width, height, tileLevel, layer, lineWidth) {
	for (var i = 0; i < barCount; i++) {
		var xx = sheetX + i * 3 * barSize * tileLevel.tapSize;
		var tg = tileLevel.tileGroup(0, 0, contentWidth, contentHeight, 'brLine' + i, layer, left, top, width, height);
		if (tg) {
			tileLevel.tileRectangle(tg.g, xx, sheetY, lineWidth, 3 * 4 * tileLevel.tapSize, fgColor);
		}
	}
}
function tileMeasureGrid(left, top, width, height, tileLevel, layer, lineWidth, n) {
	var xx = sheetX + n * 3 * barSize * tileLevel.tapSize;
	var tg = tileLevel.tileGroup(0, 0, contentWidth, contentHeight, 'brGrid' + n, layer, left, top, width, height);
	if (tg) {
		for (var x = 0; x < barSize; x++) {
			tileLevel.tileRectangle(tg.g, xx + x * 3 * tileLevel.tapSize, 0, lineWidth / 10, contentHeight, fgColor);
		}
		for (var y = 0; y < contentHeight; y = y + 3) {
			tileLevel.tileRectangle(tg.g, xx, y * tileLevel.tapSize, 3 * barSize * tileLevel.tapSize, lineWidth / 10, fgColor);
		}
	}
}
function tileBigMeasureNumbers(left, top, width, height, tileLevel, layer) {
	for (var i = 0; i < barCount; i++) {
		var xx = sheetX + i * 3 * barSize * tileLevel.tapSize;
		var tg = tileLevel.tileGroup(0, 0, contentWidth, contentHeight, 'brNum' + i, layer, left, top, width, height);
		if (tg) {
			tileLevel.tileText(tg.g, xx, sheetY, 6 * tileLevel.tapSize, '' + (1 + i));

		}
	}
}
function tileSmallMeasureNumbers(left, top, width, height, tileLevel, layer) {
	for (var i = 0; i < barCount; i++) {
		var xx = sheetX + i * 3 * barSize * tileLevel.tapSize;
		var tg = tileLevel.tileGroup(0, 0, contentWidth, contentHeight, 'brNum' + i, layer, left, top, width, height);
		if (tg) {
			tileLevel.tileText(tg.g, xx, sheetY, 2 * tileLevel.tapSize, '' + (1 + i));
		}
	}
}
function tileNoteHead(x, y, tg, tileLevel) {
	//tileLevel.tileCircle(tg.g, tg.x+(x*3+1.5) * tileLevel.tapSize, tg.y+(y*3+1.5) * tileLevel.tapSize, 1.5 * tileLevel.tapSize, '#f33');
	tileLevel.tilePath(tg.g, tg.x + sheetX + (x * 3 + 0.8) * tileLevel.tapSize, tg.y + (y * 3 + 0.4) * tileLevel.tapSize, 0.09 * tileLevel.tapSize //
	, "M0,25c-4.03729,-0.90252 -7.9074,-4.60195 -7.14222,-9.02873c0.05883,-5.52261 4.10862,-9.82038 8.21857,-12.80907c5.30957,-3.66664 13.99142,-5.87541 19.0695,-1.31335c5.07808,4.56206 2.7264,11.70948 0.16548,14.59555c-4.73015,5.95609 -12.62795,9.9081 -20.31133,8.55559l0,0.00001z" //
	, '#030');
}
