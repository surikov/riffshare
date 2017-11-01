console.log('start');
var tiler = new TileLevel("contentSVG", 'cntnt');
tiler.resetInnerSize(4000, 3000);
var bg = tiler.addLayer();
var sheetY = 10.5 * tiler.tapSize;
var sheetX = 6 * tiler.tapSize;
var contentWidth = 256 * 3 * tiler.tapSize;
var contentHeight = 50 * tiler.tapSize;
var fgColor = '#000';
var gridColor = '#666';
var barCount = 16;
var barSize = 32;
tiler.resetInnerSize(contentWidth, contentHeight);
tiler.addZoomLevel(1.3, function (left, top, width, height) {
	console.log('render', 1.3, tiler.translateZ);
	var lineWidth = 0.1 * tiler.tapSize;
	tileLines(left, top, width, height, tiler, bg, lineWidth);
	tileBars(left, top, width, height, tiler, bg, lineWidth);
	tileSmallMeasureNumbers(left, top, width, height, tiler, bg, lineWidth);
});
tiler.addZoomLevel(7, function (left, top, width, height) {
	console.log('render', 7, tiler.translateZ);
	var lineWidth = 0.1 * tiler.tapSize;
	tileLines(left, top, width, height, tiler, bg, lineWidth);
	for (var n = 0; n < barCount; n++) {
		tileMeasureGrid(left, top, width, height, tiler, bg, lineWidth, n);
	}
	tileBars(left, top, width, height, tiler, bg, lineWidth);
	tileBigMeasureNumbers(left, top, width, height, tiler, bg, lineWidth);
});
tiler.addZoomLevel(15, function (left, top, width, height) {
	console.log('render', 15, tiler.translateZ);
	var lineWidth = 0.2 * tiler.tapSize;
	tileLines(left, top, width, height, tiler, bg, lineWidth);
	tileBars(left, top, width, height, tiler, bg, lineWidth);
});
function tileLines(left, top, width, height, tileLevel, layer, lineWidth) {
	var tg = tileLevel.tileGroup(0, 0, contentWidth, contentHeight, 'bgrec', layer, left, top, width, height);
	if (tg) {
		//tileLevel.tileRectangle(tg.g, tg.x, tg.y, tg.w, tg.h, color);
		tileNoteHead(0, 0, tg, tileLevel);
		tileNoteHead(48, 5, tg, tileLevel);
		tileNoteHead(192, 6, tg, tileLevel);
		tileNoteHead(4, 4, tg, tileLevel);
		tileNoteHead(4, 5, tg, tileLevel);
		tileNoteHead(4, 6, tg, tileLevel);
		tileNoteSingle4up(5, 6, tg, tileLevel);
		tileNoteSingle4down(12, 2, tg, tileLevel);
		tileNoteSingle8up(7, 8, tg, tileLevel);
		tileNoteSingle8down(14, 5, tg, tileLevel);
		tileNoteSingle16down(17, 5, tg, tileLevel);
		tileNoteSingle16up(19, 8, tg, tileLevel);
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
			tileLevel.tileRectangle(tg.g, xx + x * 3 * tileLevel.tapSize, 0, lineWidth / 7, contentHeight, gridColor);
		}
		for (var y = 0; y < contentHeight; y = y + 3) {
			tileLevel.tileRectangle(tg.g, xx, y * tileLevel.tapSize, 3 * barSize * tileLevel.tapSize, lineWidth / 7, gridColor);
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
	tileLevel.tilePath(tg.g, tg.x + sheetX + (x * 3 + 0.5) * tileLevel.tapSize, tg.y + (y * 3 - 0.1) * tileLevel.tapSize, 0.13 * tileLevel.tapSize //
	, "M0,25c-4.03729,-0.90252 -7.9074,-4.60195 -7.14222,-9.02873c0.05883,-5.52261 4.10862,-9.82038 8.21857,-12.80907c5.30957,-3.66664 13.99142,-5.87541 19.0695,-1.31335c5.07808,4.56206 2.7264,11.70948 0.16548,14.59555c-4.73015,5.95609 -12.62795,9.9081 -20.31133,8.55559l0,0.00001z" //
	, fgColor);
}
function tileNoteSingle4up(x, y, tg, tileLevel) {
	tileNoteHead(x, y, tg, tileLevel);
	tileLevel.tileRectangle(tg.g, tg.x + sheetX + (x * 3 + 3.1) * tileLevel.tapSize,  tg.y + (y * 3 + 1.1-3.6*3) * tileLevel.tapSize, 0.4* tileLevel.tapSize, 3.6*3* tileLevel.tapSize, fgColor);
}
function tileNoteSingle4down(x, y, tg, tileLevel) {
	tileNoteHead(x, y, tg, tileLevel);
	tileLevel.tileRectangle(tg.g, tg.x + sheetX + (x * 3 - 0.45) * tileLevel.tapSize,  tg.y + (y * 3 + 2.1) * tileLevel.tapSize, 0.4* tileLevel.tapSize, 3.6*3* tileLevel.tapSize, fgColor);
}
function tileNoteSingle8up(x, y, tg, tileLevel) {
	//console.log('tileNoteSingle8down');
	tileNoteHead(x, y, tg, tileLevel);
	tileLevel.tileRectangle(tg.g, tg.x + sheetX + (x * 3 + 3.1) * tileLevel.tapSize,  tg.y + (y * 3 + 1.1-3.6*3) * tileLevel.tapSize, 0.4* tileLevel.tapSize, 3.6*3* tileLevel.tapSize, fgColor);
	tileLevel.tilePath(tg.g, tg.x + sheetX + (x * 3 + 3.2) * tileLevel.tapSize, tg.y + (y * 3 -9.6) * tileLevel.tapSize, 0.03 * tileLevel.tapSize //
	, "M0,0c12.6003,-3.05094 8.52623,13.44614 11.38796,21.0753c2.73069,22.43386 17.77757,40.03692 32.75498,55.75559c18.58194,19.75765 38.31331,40.70672 44.35311,68.07965c6.59531,31.75856 -3.94836,64.2479 -17.63124,92.70964c-0.99081,9.12171 -17.72272,22.31873 -9.75105,5.83532c13.4229,-28.19774 24.51194,-60.67212 15.34996,-91.8967c-8.72487,-31.15624 -43.57272,-59.84605 -75.94619,-64.51167l-0.51753,-87.04713z" //
	,  fgColor);
}
function tileNoteSingle8down(x, y, tg, tileLevel) {
	//console.log('tileNoteSingle8down');
	tileNoteHead(x, y, tg, tileLevel);
	tileLevel.tileRectangle(tg.g, tg.x + sheetX + (x * 3 - 0.45) * tileLevel.tapSize,  tg.y + (y * 3 + 2.1) * tileLevel.tapSize, 0.4* tileLevel.tapSize, 3.6*3* tileLevel.tapSize, fgColor);
	tileLevel.tilePath(tg.g, tg.x + sheetX + (x * 3 - 0.3) * tileLevel.tapSize, tg.y + (y * 3 +12.8) * tileLevel.tapSize, 0.03 * tileLevel.tapSize //
	, "M0,0c12.6003,3.13153 8.52623,-13.80134 11.38796,-21.63203c2.73069,-23.02648 17.77757,-41.09454 32.75498,-57.22844c18.58194,-20.27957 38.31331,-41.78204 44.35311,-69.87805c6.59531,-32.5975 -3.94836,-65.94508 -17.63124,-95.15867c-0.99081,-9.36267 -17.72272,-22.90831 -9.75105,-5.98947c13.4229,28.94262 24.51194,62.27485 15.34996,94.32426c-8.72487,31.97927 -43.57272,61.42695 -75.94619,66.21582l-0.51753,89.34658z" //
	, fgColor);
}
function tileNoteSingle16down(x, y, tg, tileLevel) {
	//console.log('tileNoteSingle8down');
	tileNoteHead(x, y, tg, tileLevel);
	tileLevel.tileRectangle(tg.g, tg.x + sheetX + (x * 3 - 0.45) * tileLevel.tapSize,  tg.y + (y * 3 + 2.1) * tileLevel.tapSize, 0.4* tileLevel.tapSize, 3.6*3* tileLevel.tapSize, fgColor);
	tileLevel.tilePath(tg.g, tg.x + sheetX + (x * 3 - 0.3) * tileLevel.tapSize, tg.y + (y * 3 +12.8) * tileLevel.tapSize, 0.03 * tileLevel.tapSize //
	, "M0,0c12.6003,3.13154 8.52623,-13.80133 11.38796,-21.63203c2.73069,-23.02647 17.77757,-41.09454 32.75498,-57.22844c18.58194,-20.27957 38.31331,-41.78203 44.35311,-69.87805c6.59531,-32.5975 7.44227,-54.13258 -6.24061,-83.34617c3.67185,22.95315 3.37026,44.47287 -5.79172,76.52229c-8.72487,31.97927 -43.57272,61.42695 -75.94619,66.21582l-0.51753,89.34658z" //
	, fgColor);
	tileLevel.tilePath(tg.g, tg.x + sheetX + (x * 3 - 0.3) * tileLevel.tapSize, tg.y + (y * 3 +10.8) * tileLevel.tapSize, 0.03 * tileLevel.tapSize //
	, "M0,0c12.6003,3.13153 8.52623,-13.80134 11.38796,-21.63203c2.73069,-23.02648 17.77757,-41.09454 32.75498,-57.22844c18.58194,-20.27957 38.31331,-41.78204 44.35311,-69.87805c6.59531,-32.5975 -3.94836,-65.94508 -17.63124,-95.15867c-0.99081,-9.36267 -17.72272,-22.90831 -9.75105,-5.98947c13.4229,28.94262 24.51194,62.27485 15.34996,94.32426c-8.72487,31.97927 -43.57272,61.42695 -75.94619,66.21582l-0.51753,89.34658z" //
	, fgColor);
}
function tileNoteSingle16up(x, y, tg, tileLevel) {
	//console.log('tileNoteSingle8down');
	tileNoteHead(x, y, tg, tileLevel);
	tileLevel.tileRectangle(tg.g, tg.x + sheetX + (x * 3 + 3.1) * tileLevel.tapSize,  tg.y + (y * 3 + 1.1-3.6*3) * tileLevel.tapSize, 0.4* tileLevel.tapSize, 3.6*3* tileLevel.tapSize, fgColor);
	tileLevel.tilePath(tg.g, tg.x + sheetX + (x * 3 + 3.2) * tileLevel.tapSize, tg.y + (y * 3 -9.6) * tileLevel.tapSize, 0.03 * tileLevel.tapSize //
	, "M0,0c12.6003,-3.11981 8.52623,13.74965 11.38796,21.55103c2.73069,22.94025 17.77757,40.94066 32.75498,57.01415c18.58194,20.20363 38.31331,41.62558 44.35311,69.61639c6.59531,32.47544 7.44227,53.92988 -6.24061,83.03408c3.67185,-22.8672 3.37026,-44.30634 -5.79172,-76.23575c-8.72487,-31.85952 -43.57272,-61.19694 -75.94619,-65.96788l-0.51753,-89.01202z" //
	,  fgColor);
	tileLevel.tilePath(tg.g, tg.x + sheetX + (x * 3 + 3.2) * tileLevel.tapSize, tg.y + (y * 3 -7.6) * tileLevel.tapSize, 0.03 * tileLevel.tapSize //
	, "M0,0c12.6003,-3.05094 8.52623,13.44614 11.38796,21.0753c2.73069,22.43386 17.77757,40.03692 32.75498,55.75559c18.58194,19.75765 38.31331,40.70672 44.35311,68.07965c6.59531,31.75856 -3.94836,64.2479 -17.63124,92.70964c-0.99081,9.12171 -17.72272,22.31873 -9.75105,5.83532c13.4229,-28.19774 24.51194,-60.67212 15.34996,-91.8967c-8.72487,-31.15624 -43.57272,-59.84605 -75.94619,-64.51167l-0.51753,-87.04713z" //
	,  fgColor);
}
