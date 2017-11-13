

FretChordSheet.prototype.____tileSongName = function (left, top, width, height, layer, lineWidth) {
	/*var tg = layer.tileGroupX(0, this.contentHeight, 'sngnm', top, height);
	//console.log('tileSongName',tg);
	if (tg) {
		var txt = tileLevel.tileText(tg.g, 2 * layer.tapSize, 1 * layer.tapSize, 6 * layer.tapSize, 'Song name', this.colors.barCounter);
		//console.log('txt',txt);		
	}*/
	var me = this;

	layer.renderGroup(2 * layer.tapSize, 1 * layer.tapSize, 50 * layer.tapSize, 50 * layer.tapSize, 'sngnm', left, top, width, height, function (tg) {
		layer.tileText(tg.g, tg.x, tg.y + tg.h, 6 * layer.tapSize, 'Song name', me.colors.barCounter);
	});
};
FretChordSheet.prototype.tileTest = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	//console.log( me.margins.shiftTop, me.margins);
	//layer.renderGroup(32*3 * layer.tapSize, me.margins.sheetTop+(1.5+3-2*7*3)* layer.tapSize, 50 * layer.tapSize, 70 * layer.tapSize
	//layer.renderGroup(32*3 * layer.tapSize, me.margins.sheetTop+(1.5+3-2*7*3)* layer.tapSize, 50 * layer.tapSize, 70 * layer.tapSize
	layer.renderGroup(this.margins.sheetLeft, this.margins.sheetTop//
		, this.margins.measureLen * 3 * layer.tapSize
		, 6 * 7 * 3 * layer.tapSize//
		//, 'stff', left, top, width, height, function (tg) {

		, 'tstxt23', left, top, width, height, function (tg) {
			//layer.tileRectangle(tg.g, tg.x, tg.y, 2 * layer.tapSize, 1 * layer.tapSize, me.colors.base);
			for (var o = 0; o < 6; o++) {
				for (var n = 0; n < 7; n++) {
					me.tileNoteHead(n, 7 * o + n, tg);
				}
			}
		});
	/*
		var tg = layer.tileGroup(0, 0, this.contentWidth, this.contentHeight, 'tstxt', left, top, width, height);
		if (tg) {
			var txt=tileLevel.tileText(tg.g, 20* layer.tapSize, 40 * layer.tapSize, 36 * layer.tapSize, 'Test text', this.colors.barCounter);
		}*/
};
FretChordSheet.prototype.tileBarNumbers = function (sz,left, top, width, height, layer, lineWidth) {
	var me = this;
	for (var i = 0; i < this.margins.measureCount; i++) {
		layer.renderGroup(this.margins.sheetLeft + i * this.margins.measureLen * 3 * layer.tapSize//
			, 0//
			, this.margins.measureLen * 3 * layer.tapSize//
			,  sz//
			, 'allbrnum' + i, left, top, width, height, function (tg) {
				layer.tileText(tg.g, tg.x, tg.y+ tg.h, sz, '' + (1 + i), me.colors.barCounter);				
			});
	}
};

FretChordSheet.prototype.tileStaff = function (left, top, width, height, layer, lineWidth) {
	//console.log(this.sheetTop, this.sheetLeft,this.margins.measureLen*3*layer.tapSize, this.contentHeight);
	var me = this;
	var sk = 51;
	for (var i = 0; i < this.margins.measureCount; i++) {
		layer.renderGroup(this.margins.sheetLeft + i * this.margins.measureLen * 3 * layer.tapSize//
			, this.margins.sheetTop//
			, this.margins.measureLen * 3 * layer.tapSize//
			, 6 * 7 * 3 * layer.tapSize//
			, 'stff' + i, left, top, width, height, function (tg) {

				layer.tileRectangle(tg.g, tg.x, tg.y + (37.5 + 6 * 0) * layer.tapSize, tg.w, lineWidth, me.colors.base);
				layer.tileRectangle(tg.g, tg.x, tg.y + (37.5 + 6 * 1) * layer.tapSize, tg.w, lineWidth, me.colors.base);
				layer.tileRectangle(tg.g, tg.x, tg.y + (37.5 + 6 * 2) * layer.tapSize, tg.w, lineWidth, me.colors.base);
				layer.tileRectangle(tg.g, tg.x, tg.y + (37.5 + 6 * 3) * layer.tapSize, tg.w, lineWidth, me.colors.base);
				layer.tileRectangle(tg.g, tg.x, tg.y + (37.5 + 6 * 4) * layer.tapSize, tg.w, lineWidth, me.colors.base);

				layer.tileRectangle(tg.g, tg.x, tg.y + (37.5 + sk + 6 * 0) * layer.tapSize, tg.w, lineWidth, me.colors.base);
				layer.tileRectangle(tg.g, tg.x, tg.y + (37.5 + sk + 6 * 1) * layer.tapSize, tg.w, lineWidth, me.colors.base);
				layer.tileRectangle(tg.g, tg.x, tg.y + (37.5 + sk + 6 * 2) * layer.tapSize, tg.w, lineWidth, me.colors.base);
				layer.tileRectangle(tg.g, tg.x, tg.y + (37.5 + sk + 6 * 3) * layer.tapSize, tg.w, lineWidth, me.colors.base);
				layer.tileRectangle(tg.g, tg.x, tg.y + (37.5 + sk + 6 * 4) * layer.tapSize, tg.w, lineWidth, me.colors.base);


			});
	}
};
FretChordSheet.prototype.__tileStaff = function (left, top, width, height, layer, lineWidth) {
	//console.log(layer);
	var me = this;
	layer.renderGroup(this.sheetTop, this.sheetLeft, this.contentWidth, this.contentHeight, 'stff', left, top, width, height, function (tg) {

		//var tg = layer.tileGroup(0, 0, this.contentWidth, this.contentHeight, 'bgrec', left, top, width, height);
		//if (tg) {
		//tileLevel.this.tilerectangle(tg.g, tg.x, tg.y, tg.w, tg.h, color);
		/*me.tileNoteGroupUp([{
			step32: 16, duration32: 2,
			chord: [14, 15]
		}, {
			step32: 18, duration32: 4,
			chord: [9, 11]
		}, {
			step32: 22, duration32: 4,
			chord: [4, 5, 6]
		}, {
			step32: 26, duration32: 4,
			chord: [7, 15]
		}, {
			step32: 30, duration32: 1,
			chord: [5, 6]
		}, {
			step32: 31, duration32: 1,
			chord: [3, 4, 6]
		}
		], tg);
		me.tileNoteGroupUp([{
			step32: 36, duration32: 4,
			chord: [4, 5]
		}, {
			step32: 40, duration32: 1,
			chord: [9, 11]
		}, {
			step32: 41, duration32: 1,
			chord: [6, 7, 9]
		}
		], tg);
		me.tileNoteGroupDown([{
			step32: 64, duration32: 2,
			chord: [14, 15]
		}, {
			step32: 66, duration32: 2,
			chord: [9, 11]
		}, {
			step32: 68, duration32: 2,
			chord: [4, 5, 6]
		}, {
			step32: 70, duration32: 2,
			chord: [7, 15]
		}, {
			step32: 72, duration32: 1,
			chord: [5, 6]
		}, {
			step32: 73, duration32: 1,
			chord: [3, 4, 6]
		}
		], tg);
		me.tileNoteGroupDown([{
			step32: 46, duration32: 4,
			chord: [4, 5]
		}, {
			step32: 50, duration32: 2,
			chord: [9, 11]
		}, {
			step32: 52, duration32: 2,
			chord: [6, 7, 9]
		}
		], tg);
*/
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
		/*
				me.tileNoteSingle16down(2, 4, tg);
				me.tileNoteSingle16up(4, 10, tg);
				me.tileNoteSingle8down(8, 4, tg);
				me.tileNoteSingle8up(10, 10, tg);
		*/
		/*for (var o = 0; o < 5; o++) {
			for (var n = 0; n < 12; n++) {
				me.tileNoteSingle8up(12 * o + n, 12 * o + n, tg);
			}
		}*/
		//me.tileNoteSingle8up(21, 1, tg);

		//tileNoteTest(tg, tileLevel);
		//tileLevel.tileCircle(tg.g, 1.5 * layer.tapSize, 1.5 * layer.tapSize, 1.5 * layer.tapSize, '#333');
		//tileNoteBeam(100, 50, 300, 100, 10, tg, tileLevel);
		layer.tileRectangle(tg.g, me.margins.sheetLeft, me.margins.sheetTop + 6 * 0 * layer.tapSize, me.contentWidth, lineWidth, me.colors.base);
		layer.tileRectangle(tg.g, me.margins.sheetLeft, me.margins.sheetTop + 6 * 1 * layer.tapSize, me.contentWidth, lineWidth, me.colors.base);
		layer.tileRectangle(tg.g, me.margins.sheetLeft, me.margins.sheetTop + 6 * 2 * layer.tapSize, me.contentWidth, lineWidth, me.colors.base);
		layer.tileRectangle(tg.g, me.margins.sheetLeft, me.margins.sheetTop + 6 * 3 * layer.tapSize, me.contentWidth, lineWidth, me.colors.base);
		layer.tileRectangle(tg.g, me.margins.sheetLeft, me.margins.sheetTop + 6 * 4 * layer.tapSize, me.contentWidth, lineWidth, me.colors.base);
		var sk = 51.5;
		layer.tileRectangle(tg.g, me.margins.sheetLeft, me.margins.sheetTop + (sk + 6 * 0) * layer.tapSize, me.contentWidth, lineWidth, me.colors.base);
		layer.tileRectangle(tg.g, me.margins.sheetLeft, me.margins.sheetTop + (sk + 6 * 1) * layer.tapSize, me.contentWidth, lineWidth, me.colors.base);
		layer.tileRectangle(tg.g, me.margins.sheetLeft, me.margins.sheetTop + (sk + 6 * 2) * layer.tapSize, me.contentWidth, lineWidth, me.colors.base);
		layer.tileRectangle(tg.g, me.margins.sheetLeft, me.margins.sheetTop + (sk + 6 * 3) * layer.tapSize, me.contentWidth, lineWidth, me.colors.base);
		layer.tileRectangle(tg.g, me.margins.sheetLeft, me.margins.sheetTop + (sk + 6 * 4) * layer.tapSize, me.contentWidth, lineWidth, me.colors.base);


		/*tileLevel.tiler.tilerectangle(tg.g, sheetX, sheetY + 6 * 1 * layer.tapSize, contentWidth, lineWidth, fgColor);
		tileLevel.tiler.tilerectangle(tg.g, sheetX, sheetY + 6 * 2 * layer.tapSize, contentWidth, lineWidth, fgColor);
		tileLevel.tiler.tilerectangle(tg.g, sheetX, sheetY + 6 * 3 * layer.tapSize, contentWidth, lineWidth, fgColor);
		tileLevel.tiler.tilerectangle(tg.g, sheetX, sheetY + 6 * 4 * layer.tapSize, contentWidth, lineWidth, fgColor);*/
	});
}
FretChordSheet.prototype.tileBars = function (left, top, width, height, layer, lineWidth) {
	for (var i = 0; i < this.barCount; i++) {
		var xx = this.margins.sheetLeft + i * 3 * this.barSize * layer.tapSize;
		var me = this;
		layer.renderGroup(xx, this.margins.sheetTop
			, 1 * layer.tapSize, 60 * layer.tapSize, 'brLine' + i, left, top, width, height
			, function (tg) {
				layer.tileRectangle(tg.g, xx, me.margins.sheetTop, lineWidth, 2 * 3 * 4 * layer.tapSize, me.colors.base);

				/*
				var tg = layer.tileGroup(0, 0, this.contentWidth, this.contentHeight, 'brLine' + i, left, top, width, height);
				if (tg) {
					layer.tileRectangle(tg.g, xx, this.margins.sheetTop, lineWidth, 2 * 3 * 4 * layer.tapSize, this.colors.base);
				}*/
			});
	}
}
FretChordSheet.prototype.tileMeasureGrid = function (left, top, width, height, layer, lineWidth, n) {
	var xx = this.margins.sheetLeft + n * 3 * this.barSize * layer.tapSize;
	var tg = layer.tileGroup(0, 0, this.contentWidth, this.contentHeight, 'brGrid' + n, left, top, width, height);
	if (tg) {
		for (var x = 0; x < this.barSize; x++) {
			layer.tileRectangle(tg.g, xx + x * 3 * layer.tapSize, 0, lineWidth / 7, this.contentHeight, this.colors.grid);
		}
		for (var y = 0; y < this.contentHeight; y = y + 3 * layer.tapSize) {
			layer.tileRectangle(tg.g, xx, y, 3 * this.barSize * layer.tapSize, lineWidth / 7, this.colors.grid);
			//console.log(y);
		}
	}
}

FretChordSheet.prototype.tileBigMeasureNumbers = function (left, top, width, height, layer) {

	for (var i = 0; i < this.barCount; i++) {
		var xx = this.margins.sheetLeft + i * 3 * this.barSize * layer.tapSize;
		var ww = xx + 3 * this.barSize * layer.tapSize;
		var tg = layer.tileGroupY(xx, ww, 'brNum' + i, left, width);
		//console.log('tileBigMeasureNumbers',i,'/', xx,0,ww, this.contentHeight,'/',left, top, width, height,tg);
		if (tg) {
			layer.tileText(tg.g, xx + layer.tapSize, 5 * layer.tapSize, 6 * layer.tapSize, '' + (1 + i), this.colors.barCounter);

		}
	}
}
FretChordSheet.prototype.tileSmallMeasureNumbers = function (left, top, width, height, layer) {
	for (var i = 0; i < this.barCount; i++) {
		var xx = this.margins.sheetLeft + i * 3 * this.barSize * layer.tapSize;
		var tg = layer.tileGroupY(0, this.contentWidth, 'brNum' + i, left, width);
		if (tg) {
			layer.tileText(tg.g, xx + layer.tapSize, 2 * layer.tapSize, 2 * layer.tapSize, '' + (1 + i), this.colors.barCounter);
		}
	}
}
FretChordSheet.prototype.tileNoteChordHead = function (x, ys, tg) {
	for (var i = 0; i < ys.length; i++) {
		this.tileNoteHead(x, ys[i], tg);
	}
}

FretChordSheet.prototype.tileNoteHead = function (x, y, tg) {
	tg.layer.tilePath(tg.g, tg.x + (x * 3 + 0.5) * tg.layer.tapSize, tg.y + (y * 3 - 0.5) * tg.layer.tapSize
		, 0.17 * tg.layer.tapSize //
		, "M0,25c-4.03729,-0.90252 -7.9074,-4.60195 -7.14222,-9.02873c0.05883,-5.52261 4.10862,-9.82038 8.21857,-12.80907c5.30957,-3.66664 13.99142,-5.87541 19.0695,-1.31335c5.07808,4.56206 2.7264,11.70948 0.16548,14.59555c-4.73015,5.95609 -12.62795,9.9081 -20.31133,8.55559l0,0.00001z" //
		, this.colors.base);
	//tileNoteNatural(x, y, tg, tileLevel);
}
FretChordSheet.prototype.tileNoteSharp = function (x, y, tg) {
	tg.layer.tilePath(tg.g, tg.x + (x * 3 + 0.5 - 38) * tg.layer.tapSize
		, tg.y + (y * 3 - 0.5 - 176) * tg.layer.tapSize, 0.4 * tg.layer.tapSize //
		, "M 86.102000,447.45700 L 86.102000,442.75300 L 88.102000,442.20100 L 88.102000,446.88100 L 86.102000,447.45700 z M 90.040000,446.31900 L 88.665000,446.71300 L 88.665000,442.03300 L 90.040000,441.64900 L 90.040000,439.70500 L 88.665000,440.08900 L 88.665000,435.30723 L 88.102000,435.30723 L 88.102000,440.23400 L 86.102000,440.80900 L 86.102000,436.15923 L 85.571000,436.15923 L 85.571000,440.98600 L 84.196000,441.37100 L 84.196000,443.31900 L 85.571000,442.93500 L 85.571000,447.60600 L 84.196000,447.98900 L 84.196000,449.92900 L 85.571000,449.54500 L 85.571000,454.29977 L 86.102000,454.29977 L 86.102000,449.37500 L 88.102000,448.82500 L 88.102000,453.45077 L 88.665000,453.45077 L 88.665000,448.65100 L 90.040000,448.26600 L 90.040000,446.31900 z " //
		, this.colors.base);
}
FretChordSheet.prototype.tileNoteFlat = function (x, y, tg) {
	tg.layer.tilePath(tg.g, tg.x + (x * 3 + 0.5 - 52) * tg.layer.tapSize, tg.y + (y * 3 - 0.5 - 219) * tg.layer.tapSize
		, 0.5 * tg.layer.tapSize //
		, "M 98.166,443.657 C 98.166,444.232 97.950425,444.78273 97.359,445.52188 C 96.732435,446.30494 96.205,446.75313 95.51,447.28013 L 95.51,443.848 C 95.668,443.449 95.901,443.126 96.21,442.878 C 96.518,442.631 96.83,442.507 97.146,442.507 C 97.668,442.507 97.999,442.803 98.142,443.393 C 98.158,443.441 98.166,443.529 98.166,443.657 z M 98.091,441.257 C 97.66,441.257 97.222,441.376 96.776,441.615 C 96.33,441.853 95.908,442.172 95.51,442.569 L 95.51,435.29733 L 94.947,435.29733 L 94.947,447.75213 C 94.947,448.10413 95.043,448.28013 95.235,448.28013 C 95.346,448.28013 95.483913,448.18713 95.69,448.06413 C 96.27334,447.71598 96.636935,447.48332 97.032,447.23788 C 97.482617,446.95792 97.99,446.631 98.661,445.991 C 99.124,445.526 99.459,445.057 99.667,444.585 C 99.874,444.112 99.978,443.644 99.978,443.179 C 99.978,442.491 99.795,442.002 99.429,441.713 C 99.015,441.409 98.568,441.257 98.091,441.257 z " //
		, this.colors.base);
}
FretChordSheet.prototype.tileNoteNatural = function (x, y, tg) {
	tg.layer.tilePath(tg.g, tg.x + (x * 3 + 0.5 - 4) * tg.layer.tapSize, tg.y + (y * 3 - 0.5 - 2) * tg.layer.tapSize
		, 0.025 * tg.layer.tapSize //
		, "M 66.61286,320.84315 C 64.805667,319.79356 64.742121,318.17445 65.11286,282.62356 L 65.5,245.5 L 62,245.56379 C 60.075,245.59887 51.075,247.32926 42,249.40909 C 20.083352,254.43201 15.849529,254.84953 13.244763,252.24476 C 10.986338,249.98634 10.943053,248.75921 8.9679622,131 C 7.6544471,52.685357 7.7097889,27.690211 9.2,26.2 C 10.706751,24.693249 17.453715,24.63727 20.203121,26.108707 C 22.252486,27.205494 22.270595,27.616751 21.88738,64.358707 L 21.5,101.5 L 25,101.43621 C 26.925,101.40113 35.925,99.670743 45,97.590908 C 66.833242,92.587101 71.155059,92.155059 73.719854,94.719854 C 76.353767,97.353767 76.651799,106.06811 78.164429,224.67735 C 79.150878,302.02738 79.132272,319.1357 78.060294,320.42735 C 76.540709,322.25834 69.490449,322.51442 66.61286,320.84315 z M 35.661336,214.47043 C 49.2338,211.30284 62.99097,208.00194 65.134277,207.39867 C 66.410233,207.03954 66.89879,205.13656 67.362552,198.71934 C 68.228165,186.74158 68.616094,130.284 67.838133,129.50537 C 67.474106,129.14103 60.049106,130.52033 51.338133,132.57049 C 42.62716,134.62065 32.35,137.03321 28.5,137.93173 L 21.5,139.5654 L 20.858534,145.5327 C 20.505727,148.81471 20.168227,166.2375 20.108534,184.25 L 20,217 L 22.411336,217 C 23.737571,217 29.700071,215.8617 35.661336,214.47043 z " //
		, this.colors.base);
}
FretChordSheet.prototype.tileNoteStemUp = function (x, y, tg) { //, yShift, hShift) {
	//var dy = yShift || 0;
	//var dh = hShift || 0;
	tg.layer.tileRectangle(tg.g, tg.x + (x * 3 + 4.05) * tg.layer.tapSize
		, tg.y + (y * 3 + 1.1 - 6.6 * 3) * tg.layer.tapSize // - dy
		, 0.4 * tg.layer.tapSize, 6.6 * 3 * tg.layer.tapSize //+ dy + dh
		, this.colors.base);
}
FretChordSheet.prototype.tileNoteStemDown = function (x, y, tg) {
	tg.layer.tileRectangle(tg.g, tg.x + (x * 3 - 0.7) * tg.layer.tapSize, tg.y + (y * 3 + 2.4) * tg.layer.tapSize
		, 0.4 * tg.layer.tapSize, 6.6 * 3 * tg.layer.tapSize, this.colors.base);
}
FretChordSheet.prototype.tileNoteSingle4up = function (x, y, tg) {
	this.tileNoteHead(x, y, tg);
	this.tileNoteStemUp(x, y, tg);
}
FretChordSheet.prototype.tileNoteSingle4down = function (x, y, tg) {
	this.tileNoteHead(x, y, tg);
	this.tileNoteStemDown(x, y, tg);
}

FretChordSheet.prototype.tileNoteSingle8up = function (x, y, tg) {
	this.tileNoteHead(x, y, tg);
	this.tileNoteStemUp(x, y, tg);
	tg.layer.tilePath(tg.g, tg.x + (x * 3 + 4.2) * tg.layer.tapSize, tg.y + (y * 3 - 9.6 - 9) * tg.layer.tapSize
		, 0.05 * tg.layer.tapSize //
		, "M0,0c12.6003,-3.05094 8.52623,13.44614 11.38796,21.0753c2.73069,22.43386 17.77757,40.03692 32.75498,55.75559c18.58194,19.75765 38.31331,40.70672 44.35311,68.07965c6.59531,31.75856 -3.94836,64.2479 -17.63124,92.70964c-0.99081,9.12171 -17.72272,22.31873 -9.75105,5.83532c13.4229,-28.19774 24.51194,-60.67212 15.34996,-91.8967c-8.72487,-31.15624 -43.57272,-59.84605 -75.94619,-64.51167l-0.51753,-87.04713z" //
		, this.colors.base);
}
FretChordSheet.prototype.tileNoteSingle8down = function (x, y, tg) {
	this.tileNoteHead(x, y, tg);
	this.tileNoteStemDown(x, y, tg);
	tg.layer.tilePath(tg.g, tg.x + (x * 3 - 0.5) * tg.layer.tapSize, tg.y + (y * 3 + 12.8 + 9.4) * tg.layer.tapSize
		, 0.05 * tg.layer.tapSize //
		, "M0,0c12.6003,3.13153 8.52623,-13.80134 11.38796,-21.63203c2.73069,-23.02648 17.77757,-41.09454 32.75498,-57.22844c18.58194,-20.27957 38.31331,-41.78204 44.35311,-69.87805c6.59531,-32.5975 -3.94836,-65.94508 -17.63124,-95.15867c-0.99081,-9.36267 -17.72272,-22.90831 -9.75105,-5.98947c13.4229,28.94262 24.51194,62.27485 15.34996,94.32426c-8.72487,31.97927 -43.57272,61.42695 -75.94619,66.21582l-0.51753,89.34658z" //
		, this.colors.base);
}
FretChordSheet.prototype.tileNoteSingle16down = function (x, y, tg) {
	this.tileNoteHead(x, y, tg);
	this.tileNoteStemDown(x, y, tg);
	tg.layer.tilePath(tg.g, tg.x + (x * 3 - 0.5) * tg.layer.tapSize, tg.y + (y * 3 + 12.8 + 9.4) * tg.layer.tapSize
		, 0.05 * tg.layer.tapSize //
		, "M0,0c12.6003,3.13154 8.52623,-13.80133 11.38796,-21.63203c2.73069,-23.02647 17.77757,-41.09454 32.75498,-57.22844c18.58194,-20.27957 38.31331,-41.78203 44.35311,-69.87805c6.59531,-32.5975 7.44227,-54.13258 -6.24061,-83.34617c3.67185,22.95315 3.37026,44.47287 -5.79172,76.52229c-8.72487,31.97927 -43.57272,61.42695 -75.94619,66.21582l-0.51753,89.34658z" //
		, this.colors.base);
	tg.layer.tilePath(tg.g, tg.x + (x * 3 - 0.5) * tg.layer.tapSize, tg.y + (y * 3 + 10.8 + 8.4) * tg.layer.tapSize
		, 0.05 * tg.layer.tapSize //
		, "M0,0c12.6003,3.13153 8.52623,-13.80134 11.38796,-21.63203c2.73069,-23.02648 17.77757,-41.09454 32.75498,-57.22844c18.58194,-20.27957 38.31331,-41.78204 44.35311,-69.87805c6.59531,-32.5975 -3.94836,-65.94508 -17.63124,-95.15867c-0.99081,-9.36267 -17.72272,-22.90831 -9.75105,-5.98947c13.4229,28.94262 24.51194,62.27485 15.34996,94.32426c-8.72487,31.97927 -43.57272,61.42695 -75.94619,66.21582l-0.51753,89.34658z" //
		, this.colors.base);
}
FretChordSheet.prototype.tileNoteSingle16up = function (x, y, tg) {
	this.tileNoteHead(x, y, tg);
	this.tileNoteStemUp(x, y, tg);
	tg.layer.tilePath(tg.g, tg.x + (x * 3 + 4.2) * tg.layer.tapSize, tg.y + (y * 3 - 9.6 - 9) * tg.layer.tapSize
		, 0.05 * tg.layer.tapSize //
		, "M0,0c12.6003,-3.11981 8.52623,13.74965 11.38796,21.55103c2.73069,22.94025 17.77757,40.94066 32.75498,57.01415c18.58194,20.20363 38.31331,41.62558 44.35311,69.61639c6.59531,32.47544 7.44227,53.92988 -6.24061,83.03408c3.67185,-22.8672 3.37026,-44.30634 -5.79172,-76.23575c-8.72487,-31.85952 -43.57272,-61.19694 -75.94619,-65.96788l-0.51753,-89.01202z" //
		, this.colors.base);
	tg.layer.tilePath(tg.g, tg.x + (x * 3 + 4.2) * tg.layer.tapSize, tg.y + (y * 3 - 7.6 - 8) * tg.layer.tapSize
		, 0.05 * tg.layer.tapSize //
		, "M0,0c12.6003,-3.05094 8.52623,13.44614 11.38796,21.0753c2.73069,22.43386 17.77757,40.03692 32.75498,55.75559c18.58194,19.75765 38.31331,40.70672 44.35311,68.07965c6.59531,31.75856 -3.94836,64.2479 -17.63124,92.70964c-0.99081,9.12171 -17.72272,22.31873 -9.75105,5.83532c13.4229,-28.19774 24.51194,-60.67212 15.34996,-91.8967c-8.72487,-31.15624 -43.57272,-59.84605 -75.94619,-64.51167l-0.51753,-87.04713z" //
		, this.colors.base);
}
FretChordSheet.prototype.tileNoteBeam = function (fromX, fromY, toX, toY, size, tg) {

	tg.layer.tilePolygon(tg.g, '' + fromX + ',' + fromY
		+ ' ' + toX + ',' + toY
		+ ' ' + toX + ',' + (toY + size)
		+ ' ' + fromX + ',' + (fromY + size), this.colors.base);
}
/*
FretChordSheet.prototype.tileNoteTest = function (tg) {
	var x1 = 0;
	var y1 = 5;
	var x2 = 8;
	var y2 = 8;
	this.tileNoteSingle4up(x1, y1, tg);
	this.tileNoteSingle4up(x2, y2, tg);
	this.tileNoteBeam(tg.x + (9.25 + 3 * x1) * tg.layer.tapSize, tg.y + (3 * y1 - 9.7) * tg.layer.tapSize
	, tg.x + (8.9 + 3 * x2) * tg.layer.tapSize, tg.y + (3 * y2 - 9.7) * tg.layer.tapSize, 0.99 * tg.layer.tapSize, tg);
}*/
FretChordSheet.prototype.arrayMax = function (array) {
	return array.reduce(function (a, b) {
		return Math.max(a, b);
	});
}

FretChordSheet.prototype.arrayMin = function (array) {
	return array.reduce(function (a, b) {
		return Math.min(a, b);
	});
}
FretChordSheet.prototype.tileNoteGroupUp = function (group, tg) {
	for (var i = 0; i < group.length; i++) {
		this.tileNoteChordHead(group[i].step32, group[i].chord, tg);
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
		var h = (6.6 + dy + iy - ry + group[i].chord[group[i].chord.length - 1] - group[i].chord[0]) * 3 * tg.layer.tapSize;
		tg.layer.tileRectangle(tg.g, tg.x + (x * 3 + 4.05) * tg.layer.tapSize
			, tg.y + (y * 3 + 1.1 - 6.6 * 3) * tg.layer.tapSize, 0.4 * tg.layer.tapSize, h //6.6 * 3 * layer.tapSize
			, this.colors.base);
	}
	for (var i = 0; i < group.length - 1; i++) {
		if (group[i].duration32 < 4) {
			var sx1 = group[i].step32;
			var sy1 = group[0].chord[group[0].chord.length - 1] + r * (group[i].step32 - group[0].step32);
			var sx2 = group[i + 1].step32;
			var sy2 = group[0].chord[group[0].chord.length - 1] + r * (group[i + 1].step32 - group[0].step32);
			var bx1 = tg.x + (4.3 + 3 * sx1) * tg.layer.tapSize;
			var by1 = tg.y + (3 * sy1 + - 9.7 - 9 - dy * 3) * tg.layer.tapSize;
			var bx2 = tg.x + (4.8 + 3 * sx2 - 0.65) * tg.layer.tapSize;
			var by2 = tg.y + (3 * sy2 + - 9.7 - 9 - dy * 3) * tg.layer.tapSize;
			this.tileNoteBeam(bx1, by1, bx2, by2, 1.99 * tg.layer.tapSize, tg);
			if (group[i].duration32 < 2) {
				this.tileNoteBeam(bx1, by1 + 1 * 3 * tg.layer.tapSize, bx2, by2 + 1 * 3 * tg.layer.tapSize, 1.99 * tg.layer.tapSize, tg);
			}
		}
	}
	var bx1 = tg.x + (4.3 + 3 * x1) * tg.layer.tapSize;
	var by1 = tg.y + (3 * y1 - 9.7 - 9 - dy * 3) * tg.layer.tapSize;
	var bx2 = tg.x + (4.1 + 3 * x2) * tg.layer.tapSize;
	var by2 = tg.y + (3 * y2 - 9.7 - 9 - dy * 3) * tg.layer.tapSize;
	this.tileNoteBeam(bx1, by1, bx2, by2, 1.99 * tg.layer.tapSize, tg);
};
FretChordSheet.prototype.tileNoteGroupDown = function (group, tg) {
	for (var i = 0; i < group.length; i++) {
		this.tileNoteChordHead(group[i].step32, group[i].chord, tg);
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
		//console.log(i, iy, ry, ry - iy, dy);
	}
	for (var i = 0; i < group.length; i++) {
		var iy = group[i].chord[group[i].chord.length - 1];
		var ry = group[0].chord[group[0].chord.length - 1] + r * (group[i].step32 - group[0].step32);
		var x = group[i].step32;
		var y = group[i].chord[group[i].chord.length - 1];
		//var h = (6.6  + group[i].chord[group[i].chord.length - 1] - group[i].chord[0]) * 3 * layer.tapSize;
		var h = (6.6 - (dy + iy - ry) + group[i].chord[group[i].chord.length - 1] - group[i].chord[0]) * 3 * tg.layer.tapSize;
		/*tileLevel.this.tilerectangle(tg.g //, tg.x + sheetX + (x * 3 + 4.05) * layer.tapSize //, tg.y + (y * 3 + 1.1 - 6.6 * 3) * layer.tapSize //, 0.4 * layer.tapSize //, h //, fgColor);*/
		tg.layer.tileRectangle(tg.g, tg.x + (x * 3 - 0.7) * tg.layer.tapSize
			, tg.y + (y * 3 + 2.4 - 3 * (group[i].chord[group[i].chord.length - 1] - group[i].chord[0])) * tg.layer.tapSize
			, 0.4 * tg.layer.tapSize, h - dy, this.colors.base);

	}
	for (var i = 0; i < group.length - 1; i++) {
		if (group[i].duration32 < 4) {
			var sx1 = group[i].step32;
			var sy1 = group[0].chord[group[0].chord.length - 1] + r * (group[i].step32 - group[0].step32);
			var sx2 = group[i + 1].step32;
			var sy2 = group[0].chord[group[0].chord.length - 1] + r * (group[i + 1].step32 - group[0].step32);
			var bx1 = tg.x + (0.3 + 3 * sx1 - 0.65) * tg.layer.tapSize;
			var by1 = tg.y + (3 * sy1 + 20.4 - 3 - dy * 3) * tg.layer.tapSize;
			var bx2 = tg.x + (0.1 + 3 * sx2 - 0.65) * tg.layer.tapSize;
			var by2 = tg.y + (3 * sy2 + 20.4 - 3 - dy * 3) * tg.layer.tapSize;
			this.tileNoteBeam(bx1, by1, bx2, by2, 1.99 * tg.layer.tapSize, tg);
			//console.log('s',sx1,sy1,sx2,sy2);
			if (group[i].duration32 < 2) {
				this.tileNoteBeam(bx1, by1 - 1 * 3 * tg.layer.tapSize, bx2, by2 - 1 * 3 * tg.layer.tapSize, 1.99 * tg.layer.tapSize, tg);
			}
		}
	}
	var bx1 = tg.x + (0.3 + 3 * x1 - 0.65) * tg.layer.tapSize;
	var by1 = tg.y + (3 * y1 + 20.4 - dy * 3) * tg.layer.tapSize;
	var bx2 = tg.x + (0.1 + 3 * x2 - 0.65) * tg.layer.tapSize;
	var by2 = tg.y + (3 * y2 + 20.4 - dy * 3) * tg.layer.tapSize;
	this.tileNoteBeam(bx1, by1, bx2, by2, 1.99 * tg.layer.tapSize, tg);
};

