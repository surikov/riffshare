console.log('start');
var tiler = new TileLevel("contentSVG", 'cntnt');
tiler.translateZ = 6.9;

//tiler.resetInnerSize(4000, 3000);
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
tiler.adjustContentPosition();
tiler.addZoomLevel(1.3, function (left, top, width, height) {
	console.log('render', 1.3, tiler.translateZ);
	var lineWidth = 0.1 * tiler.tapSize;
	tileStaff(left, top, width, height, tiler, bg, lineWidth);
	tileBars(left, top, width, height, tiler, bg, lineWidth);
	tileSmallMeasureNumbers(left, top, width, height, tiler, bg, lineWidth);
});
tiler.addZoomLevel(7, function (left, top, width, height) {
	console.log('render', 7, tiler.translateZ);
	var lineWidth = 0.1 * tiler.tapSize;
	tileStaff(left, top, width, height, tiler, bg, lineWidth);
	for (var n = 0; n < barCount; n++) {
		tileMeasureGrid(left, top, width, height, tiler, bg, lineWidth, n);
	}
	tileBars(left, top, width, height, tiler, bg, lineWidth);
	tileBigMeasureNumbers(left, top, width, height, tiler, bg, lineWidth);
});
tiler.addZoomLevel(15, function (left, top, width, height) {
	console.log('render', 15, tiler.translateZ);
	var lineWidth = 0.2 * tiler.tapSize;
	tileStaff(left, top, width, height, tiler, bg, lineWidth);
	tileBars(left, top, width, height, tiler, bg, lineWidth);
});
function tileStaff(left, top, width, height, tileLevel, layer, lineWidth) {
	var tg = tileLevel.tileGroup(0, 0, contentWidth, contentHeight, 'bgrec', layer, left, top, width, height);
	if (tg) {
		//tileLevel.tileRectangle(tg.g, tg.x, tg.y, tg.w, tg.h, color);
		tileNoteGroupUp([{
					step32: 16,duration32:2,
					chord: [14, 15]
				}, {
					step32: 18,duration32:4,
					chord: [9, 11]
				}, {
					step32: 22,duration32:4,
					chord: [4, 5, 6]
				}, {
					step32: 26,duration32:4,
					chord: [7, 15]
				}, {
					step32: 30,duration32:1,
					chord: [5, 6]
				}, {
					step32: 31,duration32:1,
					chord: [3, 4, 6]
				}
			], tg, tileLevel);
		tileNoteGroupUp([{
					step32: 36,duration32:4,
					chord: [4, 5]
				}, {
					step32: 40,duration32:1,
					chord: [9, 11]
				}, {
					step32: 41,duration32:1,
					chord: [6, 7, 9]
				}
			], tg, tileLevel);
		tileNoteGroupDown([{
					step32: 64,duration32:2,
					chord: [14, 15]
				}, {
					step32: 66,duration32:2,
					chord: [9, 11]
				}, {
					step32: 68,duration32:2,
					chord: [4, 5, 6]
				}, {
					step32: 70,duration32:2,
					chord: [7, 15]
				}, {
					step32: 72,duration32:1,
					chord: [5, 6]
				}, {
					step32: 73,duration32:1,
					chord: [3, 4, 6]
				}
			], tg, tileLevel);
		tileNoteGroupDown([{
					step32: 46,duration32:4,
					chord: [4, 5]
				}, {
					step32: 50,duration32:2,
					chord: [9, 11]
				}, {
					step32: 52,duration32:2,
					chord: [6, 7, 9]
				}
			], tg, tileLevel);
		/*
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
		 */
		tileNoteSingle16down(2, 4, tg, tileLevel);
		tileNoteSingle16up(4, 10, tg, tileLevel);
		tileNoteSingle8down(8, 4, tg, tileLevel);
		tileNoteSingle8up(10, 10, tg, tileLevel);

		//tileNoteTest(tg, tileLevel);
		//tileLevel.tileCircle(tg.g, 1.5 * tileLevel.tapSize, 1.5 * tileLevel.tapSize, 1.5 * tileLevel.tapSize, '#333');
		//tileNoteBeam(100, 50, 300, 100, 10, tg, tileLevel);
		tileLevel.tileRectangle(tg.g, sheetX, sheetY + 6 * 0 * tileLevel.tapSize, contentWidth, lineWidth, fgColor);
		tileLevel.tileRectangle(tg.g, sheetX, sheetY + 6 * 1 * tileLevel.tapSize, contentWidth, lineWidth, fgColor);
		tileLevel.tileRectangle(tg.g, sheetX, sheetY + 6 * 2 * tileLevel.tapSize, contentWidth, lineWidth, fgColor);
		tileLevel.tileRectangle(tg.g, sheetX, sheetY + 6 * 3 * tileLevel.tapSize, contentWidth, lineWidth, fgColor);
		tileLevel.tileRectangle(tg.g, sheetX, sheetY + 6 * 4 * tileLevel.tapSize, contentWidth, lineWidth, fgColor);
	}
}
function tileBars(left, top, width, height, tileLevel, layer, lineWidth) {
	for (var i = 0; i < barCount; i++) {
		var xx = sheetX + i * 3 * barSize * tileLevel.tapSize;
		var tg = tileLevel.tileGroup(0, 0, contentWidth, contentHeight, 'brLine' + i, layer, left, top, width, height);
		if (tg) {
			tileLevel.tileRectangle(tg.g, xx, sheetY, lineWidth, 2 * 3 * 4 * tileLevel.tapSize, fgColor);
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
		for (var y = 0; y < contentHeight; y = y + 3 * tileLevel.tapSize) {
			tileLevel.tileRectangle(tg.g, xx, y, 3 * barSize * tileLevel.tapSize, lineWidth / 7, gridColor);
			//console.log(y);
		}
	}
}
function tileBigMeasureNumbers(left, top, width, height, tileLevel, layer) {
	for (var i = 0; i < barCount; i++) {
		var xx = sheetX + i * 3 * barSize * tileLevel.tapSize;
		var tg = tileLevel.tileGroup(0, 0, contentWidth, contentHeight, 'brNum' + i, layer, left, top, width, height);
		if (tg) {
			tileLevel.tileText(tg.g, xx, sheetY, 6 * tileLevel.tapSize, 'nn' + (1 + i), '#060', null, null, null, null, 'textA');

		}
	}
}
function tileSmallMeasureNumbers(left, top, width, height, tileLevel, layer) {
	for (var i = 0; i < barCount; i++) {
		var xx = sheetX + i * 3 * barSize * tileLevel.tapSize;
		var tg = tileLevel.tileGroup(0, 0, contentWidth, contentHeight, 'brNum' + i, layer, left, top, width, height);
		if (tg) {
			tileLevel.tileText(tg.g, xx, sheetY, 2 * tileLevel.tapSize, 'n' + (1 + i), '#060', null, null, null, null, 'textA');
		}
	}
}
function tileNoteChordHead(x, ys, tg, tileLevel) {
	for (var i = 0; i < ys.length; i++) {
		tileNoteHead(x, ys[i], tg, tileLevel);
	}
}

function tileNoteHead(x, y, tg, tileLevel) {
	tileLevel.tilePath(tg.g, tg.x + sheetX + (x * 3 + 0.5) * tileLevel.tapSize, tg.y + (y * 3 - 0.5) * tileLevel.tapSize, 0.17 * tileLevel.tapSize //
	, "M0,25c-4.03729,-0.90252 -7.9074,-4.60195 -7.14222,-9.02873c0.05883,-5.52261 4.10862,-9.82038 8.21857,-12.80907c5.30957,-3.66664 13.99142,-5.87541 19.0695,-1.31335c5.07808,4.56206 2.7264,11.70948 0.16548,14.59555c-4.73015,5.95609 -12.62795,9.9081 -20.31133,8.55559l0,0.00001z" //
	, fgColor);
	//tileNoteNatural(x, y, tg, tileLevel);
}
function tileNoteSharp(x, y, tg, tileLevel) {
	tileLevel.tilePath(tg.g, tg.x + sheetX + (x * 3 + 0.5-38) * tileLevel.tapSize, tg.y + (y * 3 - 0.5-176) * tileLevel.tapSize, 0.4 * tileLevel.tapSize //
	, "M 86.102000,447.45700 L 86.102000,442.75300 L 88.102000,442.20100 L 88.102000,446.88100 L 86.102000,447.45700 z M 90.040000,446.31900 L 88.665000,446.71300 L 88.665000,442.03300 L 90.040000,441.64900 L 90.040000,439.70500 L 88.665000,440.08900 L 88.665000,435.30723 L 88.102000,435.30723 L 88.102000,440.23400 L 86.102000,440.80900 L 86.102000,436.15923 L 85.571000,436.15923 L 85.571000,440.98600 L 84.196000,441.37100 L 84.196000,443.31900 L 85.571000,442.93500 L 85.571000,447.60600 L 84.196000,447.98900 L 84.196000,449.92900 L 85.571000,449.54500 L 85.571000,454.29977 L 86.102000,454.29977 L 86.102000,449.37500 L 88.102000,448.82500 L 88.102000,453.45077 L 88.665000,453.45077 L 88.665000,448.65100 L 90.040000,448.26600 L 90.040000,446.31900 z " //
	, fgColor);
}
function tileNoteFlat(x, y, tg, tileLevel) {
	tileLevel.tilePath(tg.g, tg.x + sheetX + (x * 3 + 0.5-52) * tileLevel.tapSize, tg.y + (y * 3 - 0.5-219) * tileLevel.tapSize, 0.5 * tileLevel.tapSize //
	, "M 98.166,443.657 C 98.166,444.232 97.950425,444.78273 97.359,445.52188 C 96.732435,446.30494 96.205,446.75313 95.51,447.28013 L 95.51,443.848 C 95.668,443.449 95.901,443.126 96.21,442.878 C 96.518,442.631 96.83,442.507 97.146,442.507 C 97.668,442.507 97.999,442.803 98.142,443.393 C 98.158,443.441 98.166,443.529 98.166,443.657 z M 98.091,441.257 C 97.66,441.257 97.222,441.376 96.776,441.615 C 96.33,441.853 95.908,442.172 95.51,442.569 L 95.51,435.29733 L 94.947,435.29733 L 94.947,447.75213 C 94.947,448.10413 95.043,448.28013 95.235,448.28013 C 95.346,448.28013 95.483913,448.18713 95.69,448.06413 C 96.27334,447.71598 96.636935,447.48332 97.032,447.23788 C 97.482617,446.95792 97.99,446.631 98.661,445.991 C 99.124,445.526 99.459,445.057 99.667,444.585 C 99.874,444.112 99.978,443.644 99.978,443.179 C 99.978,442.491 99.795,442.002 99.429,441.713 C 99.015,441.409 98.568,441.257 98.091,441.257 z " //
	, fgColor);
}
function tileNoteNatural(x, y, tg, tileLevel) {
	tileLevel.tilePath(tg.g, tg.x + sheetX + (x * 3 + 0.5-4) * tileLevel.tapSize, tg.y + (y * 3 - 0.5-2) * tileLevel.tapSize, 0.025 * tileLevel.tapSize //
	, "M 66.61286,320.84315 C 64.805667,319.79356 64.742121,318.17445 65.11286,282.62356 L 65.5,245.5 L 62,245.56379 C 60.075,245.59887 51.075,247.32926 42,249.40909 C 20.083352,254.43201 15.849529,254.84953 13.244763,252.24476 C 10.986338,249.98634 10.943053,248.75921 8.9679622,131 C 7.6544471,52.685357 7.7097889,27.690211 9.2,26.2 C 10.706751,24.693249 17.453715,24.63727 20.203121,26.108707 C 22.252486,27.205494 22.270595,27.616751 21.88738,64.358707 L 21.5,101.5 L 25,101.43621 C 26.925,101.40113 35.925,99.670743 45,97.590908 C 66.833242,92.587101 71.155059,92.155059 73.719854,94.719854 C 76.353767,97.353767 76.651799,106.06811 78.164429,224.67735 C 79.150878,302.02738 79.132272,319.1357 78.060294,320.42735 C 76.540709,322.25834 69.490449,322.51442 66.61286,320.84315 z M 35.661336,214.47043 C 49.2338,211.30284 62.99097,208.00194 65.134277,207.39867 C 66.410233,207.03954 66.89879,205.13656 67.362552,198.71934 C 68.228165,186.74158 68.616094,130.284 67.838133,129.50537 C 67.474106,129.14103 60.049106,130.52033 51.338133,132.57049 C 42.62716,134.62065 32.35,137.03321 28.5,137.93173 L 21.5,139.5654 L 20.858534,145.5327 C 20.505727,148.81471 20.168227,166.2375 20.108534,184.25 L 20,217 L 22.411336,217 C 23.737571,217 29.700071,215.8617 35.661336,214.47043 z " //
	, fgColor);
}
function tileNoteStemUp(x, y, tg, tileLevel) { //, yShift, hShift) {
	//var dy = yShift || 0;
	//var dh = hShift || 0;
	tileLevel.tileRectangle(tg.g, tg.x + sheetX + (x * 3 + 4.05) * tileLevel.tapSize, tg.y + (y * 3 + 1.1 - 6.6 * 3) * tileLevel.tapSize // - dy
	, 0.4 * tileLevel.tapSize, 6.6 * 3 * tileLevel.tapSize //+ dy + dh
	, fgColor);
}
function tileNoteStemDown(x, y, tg, tileLevel) {
	tileLevel.tileRectangle(tg.g, tg.x + sheetX + (x * 3 - 0.7) * tileLevel.tapSize, tg.y + (y * 3 + 2.4) * tileLevel.tapSize, 0.4 * tileLevel.tapSize, 6.6 * 3 * tileLevel.tapSize, fgColor);
}
function tileNoteSingle4up(x, y, tg, tileLevel) {
	tileNoteHead(x, y, tg, tileLevel);
	tileNoteStemUp(x, y, tg, tileLevel);
}
function tileNoteSingle4down(x, y, tg, tileLevel) {
	tileNoteHead(x, y, tg, tileLevel);
	tileNoteStemDown(x, y, tg, tileLevel);
}

function tileNoteSingle8up(x, y, tg, tileLevel) {
	tileNoteHead(x, y, tg, tileLevel);
	tileNoteStemUp(x, y, tg, tileLevel);
	tileLevel.tilePath(tg.g, tg.x + sheetX + (x * 3 + 4.2) * tileLevel.tapSize, tg.y + (y * 3 - 9.6 - 9) * tileLevel.tapSize, 0.05 * tileLevel.tapSize //
	, "M0,0c12.6003,-3.05094 8.52623,13.44614 11.38796,21.0753c2.73069,22.43386 17.77757,40.03692 32.75498,55.75559c18.58194,19.75765 38.31331,40.70672 44.35311,68.07965c6.59531,31.75856 -3.94836,64.2479 -17.63124,92.70964c-0.99081,9.12171 -17.72272,22.31873 -9.75105,5.83532c13.4229,-28.19774 24.51194,-60.67212 15.34996,-91.8967c-8.72487,-31.15624 -43.57272,-59.84605 -75.94619,-64.51167l-0.51753,-87.04713z" //
	, fgColor);
}
function tileNoteSingle8down(x, y, tg, tileLevel) {
	tileNoteHead(x, y, tg, tileLevel);
	tileNoteStemDown(x, y, tg, tileLevel);
	tileLevel.tilePath(tg.g, tg.x + sheetX + (x * 3 - 0.5) * tileLevel.tapSize, tg.y + (y * 3 + 12.8 + 9.4) * tileLevel.tapSize, 0.05 * tileLevel.tapSize //
	, "M0,0c12.6003,3.13153 8.52623,-13.80134 11.38796,-21.63203c2.73069,-23.02648 17.77757,-41.09454 32.75498,-57.22844c18.58194,-20.27957 38.31331,-41.78204 44.35311,-69.87805c6.59531,-32.5975 -3.94836,-65.94508 -17.63124,-95.15867c-0.99081,-9.36267 -17.72272,-22.90831 -9.75105,-5.98947c13.4229,28.94262 24.51194,62.27485 15.34996,94.32426c-8.72487,31.97927 -43.57272,61.42695 -75.94619,66.21582l-0.51753,89.34658z" //
	, fgColor);
}
function tileNoteSingle16down(x, y, tg, tileLevel) {
	tileNoteHead(x, y, tg, tileLevel);
	tileNoteStemDown(x, y, tg, tileLevel);
	tileLevel.tilePath(tg.g, tg.x + sheetX + (x * 3 - 0.5) * tileLevel.tapSize, tg.y + (y * 3 + 12.8 + 9.4) * tileLevel.tapSize, 0.05 * tileLevel.tapSize //
	, "M0,0c12.6003,3.13154 8.52623,-13.80133 11.38796,-21.63203c2.73069,-23.02647 17.77757,-41.09454 32.75498,-57.22844c18.58194,-20.27957 38.31331,-41.78203 44.35311,-69.87805c6.59531,-32.5975 7.44227,-54.13258 -6.24061,-83.34617c3.67185,22.95315 3.37026,44.47287 -5.79172,76.52229c-8.72487,31.97927 -43.57272,61.42695 -75.94619,66.21582l-0.51753,89.34658z" //
	, fgColor);
	tileLevel.tilePath(tg.g, tg.x + sheetX + (x * 3 - 0.5) * tileLevel.tapSize, tg.y + (y * 3 + 10.8 + 8.4) * tileLevel.tapSize, 0.05 * tileLevel.tapSize //
	, "M0,0c12.6003,3.13153 8.52623,-13.80134 11.38796,-21.63203c2.73069,-23.02648 17.77757,-41.09454 32.75498,-57.22844c18.58194,-20.27957 38.31331,-41.78204 44.35311,-69.87805c6.59531,-32.5975 -3.94836,-65.94508 -17.63124,-95.15867c-0.99081,-9.36267 -17.72272,-22.90831 -9.75105,-5.98947c13.4229,28.94262 24.51194,62.27485 15.34996,94.32426c-8.72487,31.97927 -43.57272,61.42695 -75.94619,66.21582l-0.51753,89.34658z" //
	, fgColor);
}
function tileNoteSingle16up(x, y, tg, tileLevel) {
	tileNoteHead(x, y, tg, tileLevel);
	tileNoteStemUp(x, y, tg, tileLevel);
	tileLevel.tilePath(tg.g, tg.x + sheetX + (x * 3 + 4.2) * tileLevel.tapSize, tg.y + (y * 3 - 9.6 - 9) * tileLevel.tapSize, 0.05 * tileLevel.tapSize //
	, "M0,0c12.6003,-3.11981 8.52623,13.74965 11.38796,21.55103c2.73069,22.94025 17.77757,40.94066 32.75498,57.01415c18.58194,20.20363 38.31331,41.62558 44.35311,69.61639c6.59531,32.47544 7.44227,53.92988 -6.24061,83.03408c3.67185,-22.8672 3.37026,-44.30634 -5.79172,-76.23575c-8.72487,-31.85952 -43.57272,-61.19694 -75.94619,-65.96788l-0.51753,-89.01202z" //
	, fgColor);
	tileLevel.tilePath(tg.g, tg.x + sheetX + (x * 3 + 4.2) * tileLevel.tapSize, tg.y + (y * 3 - 7.6 - 8) * tileLevel.tapSize, 0.05 * tileLevel.tapSize //
	, "M0,0c12.6003,-3.05094 8.52623,13.44614 11.38796,21.0753c2.73069,22.43386 17.77757,40.03692 32.75498,55.75559c18.58194,19.75765 38.31331,40.70672 44.35311,68.07965c6.59531,31.75856 -3.94836,64.2479 -17.63124,92.70964c-0.99081,9.12171 -17.72272,22.31873 -9.75105,5.83532c13.4229,-28.19774 24.51194,-60.67212 15.34996,-91.8967c-8.72487,-31.15624 -43.57272,-59.84605 -75.94619,-64.51167l-0.51753,-87.04713z" //
	, fgColor);
}
function tileNoteBeam(fromX, fromY, toX, toY, size, tg, tileLevel) {

	tileLevel.tilePolygon(tg.g, '' + fromX + ',' + fromY
		 + ' ' + toX + ',' + toY
		 + ' ' + toX + ',' + (toY + size)
		 + ' ' + fromX + ',' + (fromY + size), fgColor);
}
function tileNoteTest(tg, tileLevel) {
	var x1 = 0;
	var y1 = 5;
	var x2 = 8;
	var y2 = 8;
	tileNoteSingle4up(x1, y1, tg, tileLevel);
	tileNoteSingle4up(x2, y2, tg, tileLevel);
	tileNoteBeam(tg.x + (9.25 + 3 * x1) * tileLevel.tapSize, tg.y + (3 * y1 - 9.7) * tileLevel.tapSize, tg.x + (8.9 + 3 * x2) * tileLevel.tapSize, tg.y + (3 * y2 - 9.7) * tileLevel.tapSize, 0.99 * tileLevel.tapSize, tg, tileLevel);
}
function arrayMax(array) {
	return array.reduce(function (a, b) {
		return Math.max(a, b);
	});
}

function arrayMin(array) {
	return array.reduce(function (a, b) {
		return Math.min(a, b);
	});
}
function tileNoteGroupUp(group, tg, tileLevel) {
	for (var i = 0; i < group.length; i++) {
		tileNoteChordHead(group[i].step32, group[i].chord, tg, tileLevel);
	}
	var x1 = group[0].step32;
	var y1 = group[0].chord[0];
	var x2 = group[group.length - 1].step32;
	var y2 = group[group.length - 1].chord[0];
	var r = (y2 - y1) / (x2 - x1);
	//console.log(r, ':', x1, y1, '>', x2, y2);
	var dy = 0;
	for (var i = 0; i < group.length; i++) {
		var iy = group[i].chord[0];
		var ry = group[0].chord[0] + r * (group[i].step32 - group[0].step32);
		if (dy < ry - iy) {
			dy = ry - iy;
		}
		//console.log(i, iy, ry, ry - iy, dy);

	}
	for (var i = 0; i < group.length; i++) {
		var iy = group[i].chord[0];
		var ry = group[0].chord[0] + r * (group[i].step32 - group[0].step32);
		var x = group[i].step32;
		var y = ry - dy; //group[i].chord[0];
		var h = (6.6 + dy + iy - ry + group[i].chord[group[i].chord.length - 1] - group[i].chord[0]) * 3 * tileLevel.tapSize;
		tileLevel.tileRectangle(tg.g, tg.x + sheetX + (x * 3 + 4.05) * tileLevel.tapSize, tg.y + (y * 3 + 1.1 - 6.6 * 3) * tileLevel.tapSize, 0.4 * tileLevel.tapSize, h //6.6 * 3 * tileLevel.tapSize
		, fgColor);
	}
	for (var i = 0; i < group.length-1; i++) {
		if( group[i].duration32<4){
			var sx1 = group[i].step32;
			var sy1 =group[0].chord[group[0].chord.length - 1]+r * (group[i].step32 - group[0].step32);
			var sx2 = group[i+1].step32;
			var sy2 = group[0].chord[group[0].chord.length - 1]+r * (group[i+1].step32 - group[0].step32);
			var bx1 = tg.x + (10.3 + 3 * sx1 ) * tileLevel.tapSize;
			var by1 = tg.y + (3 * sy1 + - 9.7 - 9 - dy * 3) * tileLevel.tapSize;
			var bx2 = tg.x + (10.8 + 3 * sx2 - 0.65) * tileLevel.tapSize;
			var by2 = tg.y + (3 * sy2 + - 9.7 - 9 - dy * 3) * tileLevel.tapSize;
			tileNoteBeam(bx1, by1, bx2, by2, 1.99 * tileLevel.tapSize, tg, tileLevel);
			if( group[i].duration32<2){
				tileNoteBeam(bx1, by1+1*3*tileLevel.tapSize, bx2, by2+1*3*tileLevel.tapSize, 1.99 * tileLevel.tapSize, tg, tileLevel);
			}
		}
	}
	var bx1 = tg.x + (10.3 + 3 * x1) * tileLevel.tapSize;
	var by1 = tg.y + (3 * y1 - 9.7 - 9 - dy * 3) * tileLevel.tapSize;
	var bx2 = tg.x + (10.1 + 3 * x2) * tileLevel.tapSize;
	var by2 = tg.y + (3 * y2 - 9.7 - 9 - dy * 3) * tileLevel.tapSize;
	tileNoteBeam(bx1, by1, bx2, by2, 1.99 * tileLevel.tapSize, tg, tileLevel);
};
function tileNoteGroupDown(group, tg, tileLevel) {
	for (var i = 0; i < group.length; i++) {
		tileNoteChordHead(group[i].step32, group[i].chord, tg, tileLevel);
	}
	var x1 = group[0].step32;
	var y1 = group[0].chord[group[0].chord.length - 1];
	var x2 = group[group.length - 1].step32;
	var y2 = group[group.length - 1].chord[group[group.length - 1].chord.length - 1];
	var r = (y2 - y1) / (x2 - x1);
	var dy = 0;
	for (var i = 0; i < group.length; i++) {
		var iy = group[i].chord[group[i].chord.length - 1];
		var ry = group[0].chord[group[0].chord.length - 1] + r * (group[i].step32 - group[0].step32);
		if (dy > ry - iy) {
			dy = ry - iy;
		}
		console.log(i, iy, ry, ry - iy, dy);
	}
	for (var i = 0; i < group.length; i++) {
		var iy = group[i].chord[group[i].chord.length - 1];
		var ry = group[0].chord[group[0].chord.length - 1] + r * (group[i].step32 - group[0].step32);
		var x = group[i].step32;
		var y = group[i].chord[group[i].chord.length - 1];
		//var h = (6.6  + group[i].chord[group[i].chord.length - 1] - group[i].chord[0]) * 3 * tileLevel.tapSize;
		var h = (6.6 - (dy + iy - ry) + group[i].chord[group[i].chord.length - 1] - group[i].chord[0]) * 3 * tileLevel.tapSize;
		/*tileLevel.tileRectangle(tg.g //, tg.x + sheetX + (x * 3 + 4.05) * tileLevel.tapSize //, tg.y + (y * 3 + 1.1 - 6.6 * 3) * tileLevel.tapSize //, 0.4 * tileLevel.tapSize //, h //, fgColor);*/
		tileLevel.tileRectangle(tg.g, tg.x + sheetX + (x * 3 - 0.7) * tileLevel.tapSize, tg.y + (y * 3 + 2.4 - 3 * (group[i].chord[group[i].chord.length - 1] - group[i].chord[0])) * tileLevel.tapSize, 0.4 * tileLevel.tapSize, h - dy, fgColor);
		
	}
	for (var i = 0; i < group.length-1; i++) {
		if( group[i].duration32<4){
			var sx1 = group[i].step32;
			var sy1 =group[0].chord[group[0].chord.length - 1]+r * (group[i].step32 - group[0].step32);
			var sx2 = group[i+1].step32;
			var sy2 = group[0].chord[group[0].chord.length - 1]+r * (group[i+1].step32 - group[0].step32);
			var bx1 = tg.x + (6.3 + 3 * sx1 - 0.65) * tileLevel.tapSize;
			var by1 = tg.y + (3 * sy1 + 20.4-3 - dy * 3) * tileLevel.tapSize;
			var bx2 = tg.x + (6.1 + 3 * sx2 - 0.65) * tileLevel.tapSize;
			var by2 = tg.y + (3 * sy2 + 20.4-3 - dy * 3) * tileLevel.tapSize;
			tileNoteBeam(bx1, by1, bx2, by2, 1.99 * tileLevel.tapSize, tg, tileLevel);
			//console.log('s',sx1,sy1,sx2,sy2);
			if( group[i].duration32<2){
				tileNoteBeam(bx1, by1-1*3*tileLevel.tapSize, bx2, by2-1*3*tileLevel.tapSize, 1.99 * tileLevel.tapSize, tg, tileLevel);
			}
		}
	}
	var bx1 = tg.x + (6.3 + 3 * x1 - 0.65) * tileLevel.tapSize;
	var by1 = tg.y + (3 * y1 + 20.4 - dy * 3) * tileLevel.tapSize;
	var bx2 = tg.x + (6.1 + 3 * x2 - 0.65) * tileLevel.tapSize;
	var by2 = tg.y + (3 * y2 + 20.4 - dy * 3) * tileLevel.tapSize;
	tileNoteBeam(bx1, by1, bx2, by2, 1.99 * tileLevel.tapSize, tg, tileLevel);
};
