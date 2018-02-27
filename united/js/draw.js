
/*FretChordSheet.prototype.tileOctaveNumbers = function (sz, left, top, width, height, layer, lineWidth) {
	var me = this;
	for (var i = 0; i < 6; i++) {
		layer.renderGroup(0//me.margins.sheetLeft //-sz/50 //5 * 3 * layer.tapSize//
			, me.margins.pianorollTop + i * 12 * 3 * layer.tapSize//
			, me.options.measureLen * 3 * layer.tapSize//
			, 12 * 3 * layer.tapSize//
			, 'octaveNum' + i, left, top, width, height, function (tg) {
				layer.tileText(tg.g, tg.x + sz * 0 * layer.tapSize, tg.y + tg.h - sz / 10, sz, '' + (5 - i), me.colors.barCounter);
			});
	}
};*/
/*FretChordSheet.prototype.tileBarNumbers = function (sz, left, top, width, height, layer, lineWidth) {
	var me = this;
	for (var i = 0; i < this.calcMeasureCount(); i++) {
		var minfo = this.measureInfo(i);
		layer.renderGroup(minfo.left * 3 * layer.tapSize //this.margins.sheetLeft + i * this.options.measureLen * 3 * layer.tapSize//
			, 0//
			, minfo.duration192 / 6 * 3 * layer.tapSize //this.options.measureLen * 3 * layer.tapSize//
			, sz//
			, 'barNum' + i, left, top, width, height, function (tg) {
				layer.tileText(tg.g, tg.x + sz / 50 * layer.tapSize, tg.y + tg.h, sz, '' + (1 + i), me.colors.barCounter);
			});
	}
};*/
/*FretChordSheet.prototype.tileLeftMenu = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	layer.renderGroup(0, 0, me.margins.sheetLeft, this.contentHeight, 'lemenu', left, top, width, height, function (tg) {
		me.tileRange(tg, 'btnFeel', 3 * me.tiler.tapSize, 1 * 3 * me.tiler.tapSize, 3 * me.tiler.tapSize, me.margins.sheetLeft - 6 * me.tiler.tapSize, 1 + me.options.feel, 5, 'Feel: ' + me.feelNames[me.options.feel], function (v) {
			me.userActionChangeFeel(v - 1);
		});
		me.tileRange(tg, 'btnMtr', 3 * me.tiler.tapSize, 3 * 3 * me.tiler.tapSize, 3 * me.tiler.tapSize, me.margins.sheetLeft - 6 * me.tiler.tapSize, 1 + me.options.measureMode, 5, 'Meter: ' + me.measureModeNames[me.options.measureMode], function (v) {
			me.userActionChangeMeasureMode(v - 1);
		});
	});
};*/
/*
FretChordSheet.prototype.tilePianoMark = function (left, top, width, height, layer, lineWidth) {
	if (this.markNote) {
		var me = this;
		for (var n = 0; n < 5; n++) {
			for (var i = 0; i < this.calcMeasureCount() + 1; i++) {
				var minfo = this.measureInfo(i);
				layer.renderGroup(minfo.left * 3 * layer.tapSize //this.margins.sheetLeft + i * this.options.measureLen * 3 * layer.tapSize//
					, this.margins.pianorollTop + n * 3 * 12 * layer.tapSize//
					, minfo.duration192 / 6 * 3 * layer.tapSize //this.options.measureLen * 3 * layer.tapSize//
					, 12 * 3 * layer.tapSize//
					, 'pianoMark' + i + 'x' + n, left, top, width, height, function (tg) {
						var tx = me.markNote.start192 / 6 * 3 * layer.tapSize + me.margins.sheetLeft;
						var ty = (5 * 12 - me.markNote.pitch - 1) * 3 * layer.tapSize + me.margins.pianorollTop;
						if (tx >= tg.x
							&& tx <= tg.x + tg.w
							&& ty >= tg.y
							&& ty <= tg.y + tg.h
						) {
							tg.layer.tileCircle(tg.g, tx + 1.5 * layer.tapSize, ty + 1.5 * layer.tapSize, 1.5 * layer.tapSize, 'rgba(0,0,0,0)', me.colors.base, 0.5 * layer.tapSize);
							return;
						}
					});
			}
		}
	}
};*/
/*FretChordSheet.prototype.tilePianorollNotes = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	for (var n = 0; n < 6; n++) {
		for (var i = 0; i < this.calcMeasureCount(); i++) {
			var minfo = this.measureInfo(i);
			layer.renderGroup(minfo.left * 3 * layer.tapSize //this.margins.sheetLeft + i * this.options.measureLen * 3 * layer.tapSize//
				, this.margins.pianorollTop + n * 3 * 12 * layer.tapSize//
				, minfo.duration192 / 6 * 3 * layer.tapSize //this.options.measureLen * 3 * layer.tapSize//
				, 12 * 3 * layer.tapSize//
				, 'pianoNotes' + i + 'x' + n, left, top, width, height, function (tg) {
					for (var t = 0; t < me.tones.length; t++) {
						var tx = me.tones[t].start192 / 6 * 3 * layer.tapSize + me.margins.sheetLeft;
						var ty = (5 * 12 - me.tones[t].pitch - 1) * 3 * layer.tapSize + me.margins.pianorollTop;

						if (tx >= tg.x
							&& tx <= tg.x + tg.w
							&& ty >= tg.y
							&& ty <= tg.y + tg.h
						) {
							tg.layer.tileLine(tg.g
								, tx + 1.5 * layer.tapSize
								, ty + 1.5 * layer.tapSize
								, tx - 1.5 * layer.tapSize + me.tones[t].len192 / 6 * 3 * layer.tapSize
								, ty + 1.5 * layer.tapSize + me.tones[t].shift * 3 * layer.tapSize
								, me.colors.base, 2.9 * layer.tapSize);
							tg.layer.tileText(tg.g, tx + 0.8 * layer.tapSize, ty + 2.2 * layer.tapSize
								, 2.5 * layer.tapSize, me.name7(me.tones[t].pitch), me.colors.noteLabel);
						}
					}
				});
		}
	}
};*/
/*FretChordSheet.prototype.tilePianorollGrid = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	for (var n = 0; n < 6; n++) {
		for (var i = 0; i < this.calcMeasureCount() + 1; i++) {
			var minfo = this.measureInfo(i);
			layer.renderGroup(minfo.left * 3 * layer.tapSize //this.margins.sheetLeft + i * this.options.measureLen * 3 * layer.tapSize//
				, this.margins.pianorollTop + n * 3 * 12 * layer.tapSize//
				, minfo.duration192 / 6 * 3 * layer.tapSize //this.options.measureLen * 3 * layer.tapSize//
				, 12 * 3 * layer.tapSize//
				, 'prgrd' + i + 'x' + n, left, top, width, height, function (tg) {
					for (var k = 0; k < me.options.measureLen / 8; k++) {
						if (k > 0) {
							layer.tileRectangle(tg.g, tg.x + 8 * k * 3 * layer.tapSize, tg.y
								, lineWidth * 2, 12 * 3 * layer.tapSize, me.colors.grid);
						}
						for (var nn = 1; nn < me.feelPattern6[me.options.feel].length - 1; nn++) {
							layer.tileRectangle(tg.g, tg.x + (8 * k + me.feelPattern6[me.options.feel][nn] / 6) * 3 * layer.tapSize, tg.y
								, lineWidth * 0.5, 12 * 3 * layer.tapSize, me.colors.grid);
						}
					}
				});
		}
	}
};*/
FretChordSheet.prototype.tilePianorollOctaves = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	for (var n = 0; n < 6; n++) {
		for (var i = 0; i < this.calcMeasureCount() + 1; i++) {
			var minfo = this.measureInfo(i);
			layer.renderGroup(minfo.left * 3 * layer.tapSize //this.margins.sheetLeft + i * this.options.measureLen * 3 * layer.tapSize//
				, this.margins.pianorollTop + n * 3 * 12 * layer.tapSize//
				, minfo.duration192 / 6 * 3 * layer.tapSize //this.options.measureLen * 3 * layer.tapSize//
				, 12 * 3 * layer.tapSize//
				, 'octave' + i + 'x' + n, left, top, width, height, function (tg) {
					if (i < me.calcMeasureCount()) {
						layer.tileRectangle(tg.g, tg.x + tg.w, tg.y, lineWidth, 12 * 3 * layer.tapSize, me.colors.staff);
					}
					if (n < 4) {
						layer.tileRectangle(tg.g, tg.x, tg.y + 12 * 3 * layer.tapSize, tg.w, lineWidth, me.colors.staff);
					}
				});
		}
	}
};
FretChordSheet.prototype.tilePianorollKeys = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	for (var n = 0; n < 6; n++) {
		for (var i = 0; i < this.calcMeasureCount() + 1; i++) {
			var minfo = this.measureInfo(i);
			layer.renderGroup(minfo.left * 3 * layer.tapSize //this.margins.sheetLeft + i * this.options.measureLen * 3 * layer.tapSize//
				, this.margins.pianorollTop + n * 3 * 12 * layer.tapSize//
				, minfo.duration192 / 6 * 3 * layer.tapSize //this.options.measureLen * 3 * layer.tapSize//
				, 12 * 3 * layer.tapSize//
				, 'pkeys' + i + 'x' + n, left, top, width, height, function (tg) {
					layer.tileRectangle(tg.g, tg.x, tg.y + 0 * 3 * layer.tapSize, tg.w, 2.7 * layer.tapSize, me.colors.whiteKey);
					layer.tileRectangle(tg.g, tg.x, tg.y + 1 * 3 * layer.tapSize, tg.w, 2.7 * layer.tapSize, me.colors.blackKey);
					layer.tileRectangle(tg.g, tg.x, tg.y + 2 * 3 * layer.tapSize, tg.w, 2.7 * layer.tapSize, me.colors.whiteKey);
					layer.tileRectangle(tg.g, tg.x, tg.y + 3 * 3 * layer.tapSize, tg.w, 2.7 * layer.tapSize, me.colors.blackKey);
					layer.tileRectangle(tg.g, tg.x, tg.y + 4 * 3 * layer.tapSize, tg.w, 2.7 * layer.tapSize, me.colors.whiteKey);
					layer.tileRectangle(tg.g, tg.x, tg.y + 5 * 3 * layer.tapSize, tg.w, 2.7 * layer.tapSize, me.colors.blackKey);
					layer.tileRectangle(tg.g, tg.x, tg.y + 6 * 3 * layer.tapSize, tg.w, 2.7 * layer.tapSize, me.colors.whiteKey);
					layer.tileRectangle(tg.g, tg.x, tg.y + 7 * 3 * layer.tapSize, tg.w, 2.7 * layer.tapSize, me.colors.whiteKey);
					layer.tileRectangle(tg.g, tg.x, tg.y + 8 * 3 * layer.tapSize, tg.w, 2.7 * layer.tapSize, me.colors.blackKey);
					layer.tileRectangle(tg.g, tg.x, tg.y + 9 * 3 * layer.tapSize, tg.w, 2.7 * layer.tapSize, me.colors.whiteKey);
					layer.tileRectangle(tg.g, tg.x, tg.y + 10 * 3 * layer.tapSize, tg.w, 2.7 * layer.tapSize, me.colors.blackKey);
					layer.tileRectangle(tg.g, tg.x, tg.y + 11 * 3 * layer.tapSize, tg.w, 2.7 * layer.tapSize, me.colors.whiteKey);
				});
		}
	}
};
FretChordSheet.prototype.tileDrumRollLabels = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	layer.renderGroup(0//
		, this.margins.drumsTop//
		, 1//
		, 8 * 3 * layer.tapSize//
		, 'drumLabels', left, top, width, height, function (tg) {
			for (var i = 0; i < 8; i++) {
				layer.tileText(tg.g, tg.x, tg.y + tg.h - i * 3 * layer.tapSize - 0.75 * layer.tapSize, 2.1 * layer.tapSize, 'Qwerty asdf ' + i, me.colors.base);
			}

		});

}


FretChordSheet.prototype.tileDrumRollSpot = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	for (var i = 0; i < this.calcMeasureCount() + 1; i++) {
		var minfo = this.measureInfo(i);
		layer.renderGroup(minfo.left * 3 * layer.tapSize //this.margins.sheetLeft + i * (this.options.measureLen + this.options.measureHeader) * 3 * layer.tapSize + this.options.measureHeader * 3 * layer.tapSize//
			, this.margins.drumsTop//
			, minfo.duration192 / 6 * 3 * layer.tapSize //this.options.measureLen * 3 * layer.tapSize//
			, 8 * 3 * layer.tapSize//
			, 'drumsptot_' + i, left, top, width, height, function (tg) {
				var s = tg.layer.addSpot('drumSpot_' + i, tg.x, tg.y, tg.w, tg.h, function () {
					var x = me.clickedMeasureBeat();
					var y = Math.floor((me.tiler.clickContentY - me.margins.drumsTop) / (3 * me.tiler.tapSize));
					var kind = 0;
					var drums = me.findDrums(8 - y, x.x6, x.l6);
					if (drums.length > 0) {
						me.userActionDropDrums(8 - y, x.x6, x.l6);
					} else {
						me.userActionAddDrum(8 - y, x.x6, x.l6);
					}
				});
			});
	}
};
FretChordSheet.prototype.clickedMeasureBeat = function () {
	var cellSz = 3 * this.tiler.tapSize;
	var xX = (this.tiler.clickContentX - this.margins.sheetLeft) / cellSz;

	var beatMeasure = Math.floor(xX / (this.options.measureLen + this.options.measureHeader));
	var beatQuarter = Math.floor((xX % (this.options.measureLen + this.options.measureHeader) - this.options.measureHeader) / 8);
	var remainX = xX - beatMeasure * (this.options.measureLen + this.options.measureHeader) - beatQuarter * 8 - this.options.measureHeader;
	var r6 = 0;
	var l6 = 0;
	var fl = this.feelPattern6[this.options.feel];
	for (var i = 1; i < fl.length; i++) {
		if (6 * remainX >= fl[i - 1] && 6 * remainX <= fl[i]) {
			r6 = beatMeasure * this.options.measureLen * 6 + beatQuarter * 8 * 6 + fl[i - 1];
			l6 = fl[i] - fl[i - 1];
		}
	}
	return { x6: r6, l6: l6 };
};

FretChordSheet.prototype.clickedBeat = function () {
	var cellSz = 3 * this.tiler.tapSize;
	var beatX = (this.tiler.clickContentX - this.margins.sheetLeft) / cellSz;
	var beatMeasure = Math.floor(beatX / this.options.measureLen);
	var beatQuarter = Math.floor((beatX % this.options.measureLen) / 8);
	var remainX = beatX - beatMeasure * this.options.measureLen - beatQuarter * 8;
	var r6 = 0;//Math.floor(remainX);
	var l6 = 0;
	var fl = this.feelPattern6[this.options.feel];
	for (var i = 1; i < fl.length; i++) {
		if (6 * remainX >= fl[i - 1] && 6 * remainX <= fl[i]) {
			r6 = beatMeasure * this.options.measureLen * 6 + beatQuarter * 8 * 6 + fl[i - 1];
			l6 = fl[i] - fl[i - 1];
		}
	}
	return { x6: r6, l6: l6 };
};
FretChordSheet.prototype.tileDrumRollGrid = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	for (var i = 0; i < this.calcMeasureCount() + 1; i++) {
		var minfo = this.measureInfo(i);
		layer.renderGroup(minfo.left * 3 * layer.tapSize //this.margins.sheetLeft + i * (this.options.measureLen + this.options.measureHeader) * 3 * layer.tapSize//
			, this.margins.drumsTop//
			, minfo.duration192 / 6 * 3 * layer.tapSize //(this.options.measureLen + this.options.measureHeader) * 3 * layer.tapSize//
			, 8 * 3 * layer.tapSize//
			, 'drgrd' + i, left, top, width, height, function (tg) {
				for (var k = 1; k < 8; k++) {
					layer.tileRectangle(tg.g, tg.x + me.options.measureHeader * 3 * layer.tapSize, tg.y + k * 3 * layer.tapSize
						, me.options.measureLen * 3 * layer.tapSize, lineWidth
						, me.colors.bgCopy);
				}
				for (var k = 0; k < me.options.measureLen / 8; k++) {
					if (k > 0) {
						layer.tileRectangle(tg.g, tg.x + (8 * k + me.options.measureHeader) * 3 * layer.tapSize, tg.y
							, lineWidth * 2, 8 * 3 * layer.tapSize, me.colors.bgCopy);
					}
					for (var nn = 1; nn < me.feelPattern6[me.options.feel].length - 1; nn++) {
						layer.tileRectangle(tg.g, tg.x + (8 * k + me.feelPattern6[me.options.feel][nn] / 6 + me.options.measureHeader) * 3 * layer.tapSize
							, tg.y
							, lineWidth * 0.5, 8 * 3 * layer.tapSize, me.colors.bgCopy);
					}
				}
			});
	}
};
FretChordSheet.prototype.tileDrumRollPoints = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	for (var i = 0; i < this.calcMeasureCount(); i++) {
		var minfo = this.measureInfo(i);
		layer.renderGroup(minfo.left * 3 * layer.tapSize //this.margins.sheetLeft + i * (this.options.measureLen + this.options.measureHeader) * 3 * layer.tapSize//
			, this.margins.drumsTop//
			, minfo.duration192 / 6 * 3 * layer.tapSize //this.options.measureLen * 3 * layer.tapSize//
			, 8 * 3 * layer.tapSize//
			, 'drpnts' + i, left, top, width, height, function (tg) {
				for (var t = 0; t < me.drums.length; t++) {
					if (me.drums[t].start192 / 6 >= i * me.options.measureLen
						&& me.drums[t].start192 / 6 < (i + 1) * me.options.measureLen
					) {
						var mn = Math.floor((me.drums[t].start192 / 6) / me.options.measureLen);
						var smst = me.drums[t].start192 / 6 - mn * me.options.measureLen;
						var tx = smst * 3 * layer.tapSize + me.margins.sheetLeft
							+ mn * (me.options.measureLen + me.options.measureHeader) * 3 * layer.tapSize
							+ me.options.measureHeader * 3 * layer.tapSize;
						var ty = (8 - me.drums[t].kind) * 3 * layer.tapSize + me.margins.drumsTop;
						var tw = me.drums[t].len192 / 6 * 3 * layer.tapSize - 0.2 * layer.tapSize;
						if (tw < 1) tw = 1;
						layer.tileRectangle(tg.g, tx, ty, tw, 3 * layer.tapSize - 0.2 * layer.tapSize, me.colors.base);
					}
				}
			});
	}
};
FretChordSheet.prototype.tileDrumRoll = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	for (var i = 0; i < this.calcMeasureCount() + 1; i++) {
		var minfo = this.measureInfo(i);
		layer.renderGroup(minfo.left * 3 * layer.tapSize //this.margins.sheetLeft + i * (this.options.measureLen + this.options.measureHeader) * 3 * layer.tapSize//
			, this.margins.drumsTop//
			, minfo.duration192 / 6 * 3 * layer.tapSize //(this.options.measureLen + this.options.measureHeader) * 3 * layer.tapSize//
			, 8 * 3 * layer.tapSize//
			, 'drumbg' + i, left, top, width, height, function (tg) {
				layer.tileRectangle(tg.g, tg.x + me.options.measureHeader * 3 * layer.tapSize, tg.y
					, me.options.measureLen * 3 * layer.tapSize, 8 * 3 * layer.tapSize
					, me.colors.blackKey);
				if (i < me.calcMeasureCount()) {
					layer.tileRectangle(tg.g, tg.x + tg.w, tg.y, lineWidth, 8 * 3 * layer.tapSize, me.colors.staff);
				}
			});
	}
};

/*
FretChordSheet.prototype.tileFretSpot = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	if (me.markFret) {
		layer.renderGroup(this.margins.sheetLeft + me.markFret.start192 / 6 * 3 * layer.tapSize//
			, this.margins.fretTop//
			, 8 * 3 * layer.tapSize//
			, 5 * 3 * layer.tapSize//
			, 'frtchooser', left, top, width, height, function (tg) {
				layer.tileRectangle(tg.g, tg.x, tg.y, tg.w, tg.h, 'rgba(127,127,127,0.5)');
			});
	}
	else {
		layer.renderGroup(this.margins.sheetLeft //
			, this.margins.fretTop//
			, (1 + this.calcMeasureCount()) * this.options.measureLen * 3 * layer.tapSize//
			, 6 * 3 * layer.tapSize//
			, 'frtspt', left, top, width, height, function (tg) {
				var s = tg.layer.addSpot('fretSpot', tg.x, tg.y, tg.w, tg.h, function () {
					var tone = 0;
					var x = me.clickedBeat();
					var y = Math.floor((me.tiler.clickContentY - me.margins.fretTop) / (3 * me.tiler.tapSize));
					var string = 1 + y;
					var pitch = me.strings[y];
					var notes = me.findFrets(tone, x.x6, x.l6, string);
					if (notes.length > 0) {
						me.userActionDropFrets(tone, x.x6, x.l6, string);
					} else {
						me.markFret = { tone: tone, start192: x.x6, len192: x.l6, string: string };
					}
				});
			});
	}
};
*/
/*FretChordSheet.prototype.tileFretGrid = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	for (var i = 0; i < this.calcMeasureCount() + 1; i++) {
		var minfo = this.measureInfo(i);
		layer.renderGroup(minfo.left * 3 * layer.tapSize //this.margins.sheetLeft + i * this.options.measureLen * 3 * layer.tapSize//
			, this.margins.fretTop//
			, minfo.duration192 / 6 * 3 * layer.tapSize //this.options.measureLen * 3 * layer.tapSize//
			, 6 * 3 * layer.tapSize//
			, 'frtgrd' + i, left, top, width, height, function (tg) {
				for (var k = 0; k < me.options.measureLen / 8; k++) {
					if (k > 0) {
						layer.tileRectangle(tg.g, tg.x + 8 * k * 3 * layer.tapSize, tg.y
							, lineWidth * 2, 6 * 3 * layer.tapSize, me.colors.grid);
					}
					for (var nn = 1; nn < me.feelPattern6[me.options.feel].length - 1; nn++) {
						layer.tileRectangle(tg.g, tg.x + (8 * k + me.feelPattern6[me.options.feel][nn] / 6) * 3 * layer.tapSize, tg.y
							, lineWidth * 0.5, 6 * 3 * layer.tapSize, me.colors.grid);
					}
				}
			});
	}
};*/
FretChordSheet.prototype.tilFretStrings = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	for (var i = 0; i < this.calcMeasureCount() + 1; i++) {
		var minfo = this.measureInfo(i);
		layer.renderGroup(minfo.left * 3 * layer.tapSize //this.margins.sheetLeft + i * this.options.measureLen * 3 * layer.tapSize//
			, this.margins.fretTop//
			, minfo.duration192 / 6 * 3 * layer.tapSize //this.options.measureLen * 3 * layer.tapSize//
			, 6 * 3 * layer.tapSize//
			, 'fret' + i, left, top, width, height, function (tg) {

				for (var yy = 0; yy < 6; yy++) {
					layer.tileRectangle(tg.g, tg.x, tg.y + 3 * yy * layer.tapSize + 1.5 * layer.tapSize, tg.w, lineWidth * (yy / 2 + 1), me.colors.staff);
				}
				if (i < me.calcMeasureCount()) {
					layer.tileRectangle(tg.g, tg.x + tg.w, tg.y, lineWidth, 6 * 3 * layer.tapSize, me.colors.staff);
				}
			});
	}
};
/*
FretChordSheet.prototype.tileFretNotes = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	for (var i = 0; i < this.calcMeasureCount(); i++) {
		var minfo = this.measureInfo(i);
		layer.renderGroup(minfo.left * 3 * layer.tapSize //this.margins.sheetLeft + i * this.options.measureLen * 3 * layer.tapSize//
			, this.margins.fretTop//
			, minfo.duration192 / 6 * 3 * layer.tapSize //this.options.measureLen * 3 * layer.tapSize//
			, 6 * 3 * layer.tapSize//
			, 'fretNotes' + i, left, top, width, height, function (tg) {
				for (var t = 0; t < me.tones.length; t++) {
					var tx = me.tones[t].start192 / 6 * 3 * layer.tapSize + me.margins.sheetLeft;
					var st = me.stringNumber(me.tones[t].pitch);
					var ty = 6 * 3 * layer.tapSize + me.margins.fretTop - (1 + 6 - st) * 3 * layer.tapSize;
					if (tx >= tg.x
						&& tx <= tg.x + tg.w
						&& ty >= tg.y
						&& ty <= tg.y + tg.h
					) {
						var frnum = me.tones[t].pitch - me.strings[st - 1];
						var clr = me.colors.fretLine0;
						if (frnum >= 1) clr = me.colors.fretLine1;
						if (frnum >= 4) clr = me.colors.fretLine4;
						if (frnum >= 8) clr = me.colors.fretLine8;
						tg.layer.tileLine(tg.g
							, tx + 1.5 * layer.tapSize
							, ty + 1.5 * layer.tapSize
							, tx - 1.5 * layer.tapSize + me.tones[t].len192 / 6 * 3 * layer.tapSize
							, ty + 1.5 * layer.tapSize
							, clr, 2.9 * layer.tapSize);

						tg.layer.tileText(tg.g, tx + 0.8 * layer.tapSize, ty + 2.2 * layer.tapSize
							, 2.5 * layer.tapSize, '' + frnum, me.colors.noteLabel);
					}
				}
			});
	}
};
*/




FretChordSheet.prototype.tileNoteChordHead = function (x, ys, tg) {
	for (var i = 0; i < ys.length; i++) {
		this.tileNoteHead(x, ys[i], tg);
	}
}
FretChordSheet.prototype.tileRange = function (tg, id, x, y, h, w, v, mx, label, action) {
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
FretChordSheet.prototype.tileDoubleRange = function (tg, id, x, y, h, w, v, mx, label, action) {
	var shft = w / 2 - 0.5 * w / mx;
	var sz = w * (v - Math.floor(mx / 2)) / mx;
	if (v < mx / 2) {
		sz = w * (Math.floor(mx / 2) - v + 2) / mx;
		shft = w * (v - 1) / mx;
	}
	tg.layer.tileLine(tg.g, tg.x + x + h / 2, tg.y + y + h / 2, tg.x + x + w - h / 2, tg.y + y + h / 2, this.colors.buttonShadow, h);
	tg.layer.tileLine(tg.g //
		, tg.x + x + h / 2 + shft//
		, tg.y + y + h / 2 //
		, tg.x + x - h / 2 + shft + sz//
		, tg.y + y + h / 2 //
		, this.colors.buttonFill, h);
	tg.layer.tileText(tg.g, tg.x + x + h / 4, tg.y + y + 0.8 * h, 0.025 * h * tg.layer.tapSize, label, this.colors.buttonLabel);
	for (var i = 0; i < mx; i++) {
		var s = tg.layer.addSpot(id + '_' + i, tg.x + x + i * w / mx, tg.y + y, w / mx, h, function (v) {
			action(this.selectedValue);
		});
		s.selectedValue = i + 1;
	}
};
FretChordSheet.prototype.tileButton = function (tg, id, x, y, sz, label, action) {
	tg.layer.tileCircle(tg.g, tg.x + x + sz / 2, tg.y + y + sz / 2, sz / 2, this.colors.buttonFill);
	tg.layer.tileText(tg.g, tg.x + x + sz / 4, tg.y + y + 0.8 * sz, 0.025 * sz * tg.layer.tapSize, label, this.colors.buttonLabel);
	tg.layer.addSpot(id, tg.x + x, tg.y + y, sz, sz, action);
};
/*
FretChordSheet.prototype.tileNoteHead = function (x, y, tg) {
	tg.layer.tilePath(tg.g, tg.x + x * 3 * tg.layer.tapSize + 0.5 * tg.layer.tapSize, tg.y + (y * 3 - 0.5) * tg.layer.tapSize
		, 0.17 * tg.layer.tapSize //
		, "M0,25c-4.03729,-0.90252 -7.9074,-4.60195 -7.14222,-9.02873c0.05883,-5.52261 4.10862,-9.82038 8.21857,-12.80907c5.30957,-3.66664 13.99142,-5.87541 19.0695,-1.31335c5.07808,4.56206 2.7264,11.70948 0.16548,14.59555c-4.73015,5.95609 -12.62795,9.9081 -20.31133,8.55559l0,0.00001z" //
		, this.colors.base);
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
}*/
FretChordSheet.prototype.tileNoteStemUp = function (x, y, tg) { //, yShift, hShift) {
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
	var dy = 0;
	for (var i = 0; i < group.length; i++) {
		var iy = group[i].chord[0];
		var ry = group[0].chord[0] + r * (group[i].step32 - group[0].step32);
		if (dy < ry - iy) {
			dy = ry - iy;
		}
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
	}
	for (var i = 0; i < group.length; i++) {
		var iy = group[i].chord[group[i].chord.length - 1];
		var ry = group[0].chord[group[0].chord.length - 1] + r * (group[i].step32 - group[0].step32);
		var x = group[i].step32;
		var y = group[i].chord[group[i].chord.length - 1];
		var h = (6.6 - (dy + iy - ry) + group[i].chord[group[i].chord.length - 1] - group[i].chord[0]) * 3 * tg.layer.tapSize;
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

FretChordSheet.prototype.tileBackground = function (left, top, width, height, lineWidth) {
	var me = this;
	var w1 = this.calcContentWidth();
	this.layerBack.renderGroup(0, 0, w1, this.contentHeight
		, 'bgPane', left, top, width, height, function (tg) {
			var rect = document.createElementNS(tg.layer.svgns, 'rect');
			rect.setAttributeNS(null, 'x', tg.x);
			rect.setAttributeNS(null, 'y', tg.y);
			rect.setAttributeNS(null, 'height', tg.h);
			rect.setAttributeNS(null, 'width', tg.w);
			rect.setAttributeNS(null, 'fill', 'url(#bgGradient)');//'#f00');
			tg.g.appendChild(rect);

			if (!(me.tickerLine)) {
				me.tickerLine = document.createElementNS(tg.layer.svgns, 'rect');
			}

			me.tickerLine.setAttributeNS(null, 'x', tg.x);
			me.tickerLine.setAttributeNS(null, 'y', tg.y);
			me.tickerLine.setAttributeNS(null, 'height', tg.h);
			me.tickerLine.setAttributeNS(null, 'width', me.tiler.tapSize * 3 * 16);
			if (me.air) {
				me.tickerLine.setAttributeNS(null, 'fill', 'rgba(255,255,255,0.5)');//'#f00');
			} else {
				me.tickerLine.setAttributeNS(null, 'fill', 'rgba(255,255,255,0.0000001)');
			}
			tg.g.appendChild(me.tickerLine);

			if (me.selection) {
				if (!(me.selectionFrame)) {
					me.selectionFrame = document.createElementNS(tg.layer.svgns, 'rect');
				}
				var mx = me.findBeatX(me.selection.from - 1, 0);
				var minfo = me.measureInfo(me.selection.from - 1);
				var endx = mx + me.tiler.tapSize * 3 * minfo.duration4 * 8;
				var selCol = 'rgba(0,0,0,0.25)';
				if (me.selection.to) {
					minfo = me.measureInfo(me.selection.to - 1);
					endx = me.findBeatX(me.selection.to - 1, 0) + me.tiler.tapSize * 3 * minfo.duration4 * 8;
					selCol = 'rgba(0,0,0,0.15)';
				}
				me.selectionFrame.setAttributeNS(null, 'x', mx);
				me.selectionFrame.setAttributeNS(null, 'y', tg.y);
				me.selectionFrame.setAttributeNS(null, 'height', tg.h);
				me.selectionFrame.setAttributeNS(null, 'width', endx - mx);
				me.selectionFrame.setAttributeNS(null, 'fill', selCol);
				tg.g.appendChild(me.selectionFrame);
			}

		});
};

FretChordSheet.prototype.tileNoteTools = function (morder, note, xx, yy, tg) {
	var me = this;
	this.tileKnob(tg, 'noteAlt' + xx + 'x' + yy
		, xx * 3 * this.tiler.tapSize - 1 * this.tiler.tapSize
		, yy * 3 * this.tiler.tapSize - 1 * this.tiler.tapSize
		, this.tiler.tapSize, '#?b', function () {
			//console.log(me.note7(note.pitch), note);
			me.userActionAlterNote(morder, note);
		});
	var vibratoLabel = '+';
	if (note.vibrato) {
		vibratoLabel = 'x ~~~';
	}
	this.tileKnob(tg, 'noteVibrato' + xx + 'x' + yy
		, xx * 3 * this.tiler.tapSize + 3 * this.tiler.tapSize
		, yy * 3 * this.tiler.tapSize + 3 * this.tiler.tapSize
		, this.tiler.tapSize, vibratoLabel, function () {
			//console.log(me.note7(note.pitch), note);
			me.userActionVibratoNote(morder, note);
		});
};
FretChordSheet.prototype.tilePianoOctaveLines = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	for (var x = 0; x < this.measures.length; x++) {
		var minfo = this.measureInfo(x);
		for (var y = 0; y < 6; y++) {
			this.layerOctaves.renderGroup(mx + this.margins.sheetLeft
				, this.margins.pianorollTop + y * 3 * 12 * this.tiler.tapSize
				, (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize
				, 12 * 3 * this.tiler.tapSize
				, 'octaveLines' + x + 'x' + y, left, top, width, height, function (tg) {
					if (y > 0) {
						tg.layer.tileRectangle(tg.g, tg.x, tg.y, tg.w, lineWidth, me.colors.base);
					}
					var upperColor = me.trackInfo[me.upperTrackNum()].color;
					tg.layer.tileRectangle(tg.g, tg.x + tg.w, tg.y, 3 * lineWidth, tg.h, upperColor);
				});
		}
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
};

FretChordSheet.prototype.tileSmallNoteNatural = function (x, y, tg, color, shift) {
	var c = color || '#999';
	shift = shift || 0;
	tg.layer.tilePath(tg.g, tg.x + (x * 3 + 0.75) * tg.layer.tapSize + shift * 0.05 * tg.layer.tapSize
		, tg.y + (y * 3 - 2) * tg.layer.tapSize + shift * 0.05 * tg.layer.tapSize
		, 0.02 * tg.layer.tapSize //
		, "M 66.61286,320.84315 C 64.805667,319.79356 64.742121,318.17445 65.11286,282.62356 L 65.5,245.5 L 62,245.56379 C 60.075,245.59887 51.075,247.32926 42,249.40909 C 20.083352,254.43201 15.849529,254.84953 13.244763,252.24476 C 10.986338,249.98634 10.943053,248.75921 8.9679622,131 C 7.6544471,52.685357 7.7097889,27.690211 9.2,26.2 C 10.706751,24.693249 17.453715,24.63727 20.203121,26.108707 C 22.252486,27.205494 22.270595,27.616751 21.88738,64.358707 L 21.5,101.5 L 25,101.43621 C 26.925,101.40113 35.925,99.670743 45,97.590908 C 66.833242,92.587101 71.155059,92.155059 73.719854,94.719854 C 76.353767,97.353767 76.651799,106.06811 78.164429,224.67735 C 79.150878,302.02738 79.132272,319.1357 78.060294,320.42735 C 76.540709,322.25834 69.490449,322.51442 66.61286,320.84315 z M 35.661336,214.47043 C 49.2338,211.30284 62.99097,208.00194 65.134277,207.39867 C 66.410233,207.03954 66.89879,205.13656 67.362552,198.71934 C 68.228165,186.74158 68.616094,130.284 67.838133,129.50537 C 67.474106,129.14103 60.049106,130.52033 51.338133,132.57049 C 42.62716,134.62065 32.35,137.03321 28.5,137.93173 L 21.5,139.5654 L 20.858534,145.5327 C 20.505727,148.81471 20.168227,166.2375 20.108534,184.25 L 20,217 L 22.411336,217 C 23.737571,217 29.700071,215.8617 35.661336,214.47043 z " //
		, c);//this.colors.base);
}
FretChordSheet.prototype.tileNoteNatural = function (x, y, tg) {
	tg.layer.tilePath(tg.g, tg.x + (x * 3 + 0.1) * tg.layer.tapSize
		, tg.y + (y * 3 - 4) * tg.layer.tapSize
		, 0.033 * tg.layer.tapSize //
		, "M 66.61286,320.84315 C 64.805667,319.79356 64.742121,318.17445 65.11286,282.62356 L 65.5,245.5 L 62,245.56379 C 60.075,245.59887 51.075,247.32926 42,249.40909 C 20.083352,254.43201 15.849529,254.84953 13.244763,252.24476 C 10.986338,249.98634 10.943053,248.75921 8.9679622,131 C 7.6544471,52.685357 7.7097889,27.690211 9.2,26.2 C 10.706751,24.693249 17.453715,24.63727 20.203121,26.108707 C 22.252486,27.205494 22.270595,27.616751 21.88738,64.358707 L 21.5,101.5 L 25,101.43621 C 26.925,101.40113 35.925,99.670743 45,97.590908 C 66.833242,92.587101 71.155059,92.155059 73.719854,94.719854 C 76.353767,97.353767 76.651799,106.06811 78.164429,224.67735 C 79.150878,302.02738 79.132272,319.1357 78.060294,320.42735 C 76.540709,322.25834 69.490449,322.51442 66.61286,320.84315 z M 35.661336,214.47043 C 49.2338,211.30284 62.99097,208.00194 65.134277,207.39867 C 66.410233,207.03954 66.89879,205.13656 67.362552,198.71934 C 68.228165,186.74158 68.616094,130.284 67.838133,129.50537 C 67.474106,129.14103 60.049106,130.52033 51.338133,132.57049 C 42.62716,134.62065 32.35,137.03321 28.5,137.93173 L 21.5,139.5654 L 20.858534,145.5327 C 20.505727,148.81471 20.168227,166.2375 20.108534,184.25 L 20,217 L 22.411336,217 C 23.737571,217 29.700071,215.8617 35.661336,214.47043 z " //
		, this.colors.base);
}
FretChordSheet.prototype.tileSmallNoteSharp = function (x, y, tg, color, shift) {
	var c = color || '#999';
	shift = shift || 0;
	tg.layer.tilePath(tg.g, tg.x + (x * 3 - 24) * tg.layer.tapSize + shift * 0.05 * tg.layer.tapSize
		, tg.y + (y * 3 - 132) * tg.layer.tapSize + shift * 0.05 * tg.layer.tapSize
		, 0.3 * tg.layer.tapSize //
		, "M 86.102000,447.45700 L 86.102000,442.75300 L 88.102000,442.20100 L 88.102000,446.88100 L 86.102000,447.45700 z M 90.040000,446.31900 L 88.665000,446.71300 L 88.665000,442.03300 L 90.040000,441.64900 L 90.040000,439.70500 L 88.665000,440.08900 L 88.665000,435.30723 L 88.102000,435.30723 L 88.102000,440.23400 L 86.102000,440.80900 L 86.102000,436.15923 L 85.571000,436.15923 L 85.571000,440.98600 L 84.196000,441.37100 L 84.196000,443.31900 L 85.571000,442.93500 L 85.571000,447.60600 L 84.196000,447.98900 L 84.196000,449.92900 L 85.571000,449.54500 L 85.571000,454.29977 L 86.102000,454.29977 L 86.102000,449.37500 L 88.102000,448.82500 L 88.102000,453.45077 L 88.665000,453.45077 L 88.665000,448.65100 L 90.040000,448.26600 L 90.040000,446.31900 z " //
		, c);//this.colors.base);
}
FretChordSheet.prototype.tileNoteSharp = function (x, y, tg) {
	tg.layer.tilePath(tg.g, tg.x + (x * 3 - 42) * tg.layer.tapSize
		, tg.y + (y * 3 - 220.75) * tg.layer.tapSize
		, 0.5 * tg.layer.tapSize //
		, "M 86.102000,447.45700 L 86.102000,442.75300 L 88.102000,442.20100 L 88.102000,446.88100 L 86.102000,447.45700 z M 90.040000,446.31900 L 88.665000,446.71300 L 88.665000,442.03300 L 90.040000,441.64900 L 90.040000,439.70500 L 88.665000,440.08900 L 88.665000,435.30723 L 88.102000,435.30723 L 88.102000,440.23400 L 86.102000,440.80900 L 86.102000,436.15923 L 85.571000,436.15923 L 85.571000,440.98600 L 84.196000,441.37100 L 84.196000,443.31900 L 85.571000,442.93500 L 85.571000,447.60600 L 84.196000,447.98900 L 84.196000,449.92900 L 85.571000,449.54500 L 85.571000,454.29977 L 86.102000,454.29977 L 86.102000,449.37500 L 88.102000,448.82500 L 88.102000,453.45077 L 88.665000,453.45077 L 88.665000,448.65100 L 90.040000,448.26600 L 90.040000,446.31900 z " //
		, this.colors.base);
}
FretChordSheet.prototype.tileSmallNoteFlat = function (x, y, tg, color, shift) {
	var c = color || '#999';
	shift = shift || 0;
	tg.layer.tilePath(tg.g
		, tg.x + (x * 3 - 47) * tg.layer.tapSize + shift * 0.05 * tg.layer.tapSize
		, tg.y + (y * 3 - 220) * tg.layer.tapSize + shift * 0.05 * tg.layer.tapSize
		, 0.5 * tg.layer.tapSize //
		, "M 98.166,443.657 C 98.166,444.232 97.950425,444.78273 97.359,445.52188 C 96.732435,446.30494 96.205,446.75313 95.51,447.28013 L 95.51,443.848 C 95.668,443.449 95.901,443.126 96.21,442.878 C 96.518,442.631 96.83,442.507 97.146,442.507 C 97.668,442.507 97.999,442.803 98.142,443.393 C 98.158,443.441 98.166,443.529 98.166,443.657 z M 98.091,441.257 C 97.66,441.257 97.222,441.376 96.776,441.615 C 96.33,441.853 95.908,442.172 95.51,442.569 L 95.51,435.29733 L 94.947,435.29733 L 94.947,447.75213 C 94.947,448.10413 95.043,448.28013 95.235,448.28013 C 95.346,448.28013 95.483913,448.18713 95.69,448.06413 C 96.27334,447.71598 96.636935,447.48332 97.032,447.23788 C 97.482617,446.95792 97.99,446.631 98.661,445.991 C 99.124,445.526 99.459,445.057 99.667,444.585 C 99.874,444.112 99.978,443.644 99.978,443.179 C 99.978,442.491 99.795,442.002 99.429,441.713 C 99.015,441.409 98.568,441.257 98.091,441.257 z " //
		, c);//this.colors.base);
}
FretChordSheet.prototype.tileNoteFlat = function (x, y, tg) {
	tg.layer.tilePath(tg.g, tg.x + (x * 3 - 81) * tg.layer.tapSize
		, tg.y + (y * 3 - 376.5) * tg.layer.tapSize
		, 0.85 * tg.layer.tapSize //
		, "M 98.166,443.657 C 98.166,444.232 97.950425,444.78273 97.359,445.52188 C 96.732435,446.30494 96.205,446.75313 95.51,447.28013 L 95.51,443.848 C 95.668,443.449 95.901,443.126 96.21,442.878 C 96.518,442.631 96.83,442.507 97.146,442.507 C 97.668,442.507 97.999,442.803 98.142,443.393 C 98.158,443.441 98.166,443.529 98.166,443.657 z M 98.091,441.257 C 97.66,441.257 97.222,441.376 96.776,441.615 C 96.33,441.853 95.908,442.172 95.51,442.569 L 95.51,435.29733 L 94.947,435.29733 L 94.947,447.75213 C 94.947,448.10413 95.043,448.28013 95.235,448.28013 C 95.346,448.28013 95.483913,448.18713 95.69,448.06413 C 96.27334,447.71598 96.636935,447.48332 97.032,447.23788 C 97.482617,446.95792 97.99,446.631 98.661,445.991 C 99.124,445.526 99.459,445.057 99.667,444.585 C 99.874,444.112 99.978,443.644 99.978,443.179 C 99.978,442.491 99.795,442.002 99.429,441.713 C 99.015,441.409 98.568,441.257 98.091,441.257 z " //
		, this.colors.base);
}
FretChordSheet.prototype.tileNoteHead = function (x, y, tg, color, shift) {
	var c = color || '#999';
	shift = shift || 0;
	tg.layer.tilePath(tg.g
		, tg.x + x * 3 * tg.layer.tapSize + shift * 0.05 * tg.layer.tapSize//+ 1.5 * tg.layer.tapSize
		, tg.y + (y * 3 - 0.5) * tg.layer.tapSize + shift * 0.05 * tg.layer.tapSize
		, 0.17 * tg.layer.tapSize //
		, "M0,25c-4.03729,-0.90252 -7.9074,-4.60195 -7.14222,-9.02873c0.05883,-5.52261 4.10862,-9.82038 8.21857,-12.80907c5.30957,-3.66664 13.99142,-5.87541 19.0695,-1.31335c5.07808,4.56206 2.7264,11.70948 0.16548,14.59555c-4.73015,5.95609 -12.62795,9.9081 -20.31133,8.55559l0,0.00001z" //
		, c);//this.colors.base);
}
//var nnn=1;
//var kkk='';
FretChordSheet.prototype.tileStaffKeys = function (minfo, tg, left, top, width, height, yShift) {
	var me = this;
	var keyArr = me.keys[minfo.keys];
	if (keyArr[0] == 1) me.tileNoteSharp(2, yShift * 2 * 7 + 7 * 6 - 1 - 7 * 4 - 0, tg);
	if (keyArr[1] == 1) me.tileNoteSharp(4, yShift * 2 * 7 + 7 * 6 - 1 - 7 * 4 - 1, tg);
	if (keyArr[2] == 1) me.tileNoteSharp(6, yShift * 2 * 7 + 7 * 6 - 1 - 7 * 4 - 2, tg);
	if (keyArr[3] == 1) me.tileNoteSharp(1, yShift * 2 * 7 + 7 * 6 - 1 - 7 * 4 - 3, tg);
	if (keyArr[4] == 1) me.tileNoteSharp(3, yShift * 2 * 7 + 7 * 6 - 1 - 7 * 4 - 4, tg);
	if (keyArr[5] == 1) me.tileNoteSharp(5, yShift * 2 * 7 + 7 * 6 - 1 - 7 * 4 + 2, tg);
	if (keyArr[6] == 1) me.tileNoteSharp(7, yShift * 2 * 7 + 7 * 6 - 1 - 7 * 4 + 1, tg);
	if (keyArr[0] == -1) me.tileNoteFlat(6, yShift * 2 * 7 + 7 * 6 - 1 - 7 * 4 - 0, tg);
	if (keyArr[1] == -1) me.tileNoteFlat(4, yShift * 2 * 7 + 7 * 6 - 1 - 7 * 4 - 1, tg);
	if (keyArr[2] == -1) me.tileNoteFlat(2, yShift * 2 * 7 + 7 * 6 - 1 - 7 * 4 - 2, tg);
	if (keyArr[3] == -1) me.tileNoteFlat(7, yShift * 2 * 7 + 7 * 6 - 1 - 7 * 4 + 4, tg);
	if (keyArr[4] == -1) me.tileNoteFlat(5, yShift * 2 * 7 + 7 * 6 - 1 - 7 * 4 + 3, tg);
	if (keyArr[5] == -1) me.tileNoteFlat(3, yShift * 2 * 7 + 7 * 6 - 1 - 7 * 4 + 2, tg);
	if (keyArr[6] == -1) me.tileNoteFlat(1, yShift * 2 * 7 + 7 * 6 - 1 - 7 * 4 + 1, tg);


}
FretChordSheet.prototype.tileStaffTrackShift = function (minfo, tg) {
	var me = this;

	var trackNum = me.upperTrackNum();
	var color = me.trackInfo[trackNum].color;
	/*for (var i = 0; i < 8; i++) {
		if (me.trackOrder[i] == 0) {
			trackNum=i;
			color = me.trackInfo[i].color;
			break;
		}
	}*/
	//var nn = minfo.clefOctaveChange || 0;
	var nn = minfo.shifts[trackNum] || 0;
	var lbl = '';
	if (nn > 0) {
		lbl = '+1';
	}
	if (nn < 0) {
		lbl = '-1';
	}
	tg.layer.tileText(tg.g
		, tg.x + 5 * tg.layer.tapSize
		, tg.y + (63 + 0 * 19) * tg.layer.tapSize
		, 7 * tg.layer.tapSize
		, lbl
		, color);
	tg.layer.tileText(tg.g
		, tg.x + 5 * tg.layer.tapSize
		, tg.y + (63 + 36) * tg.layer.tapSize
		, 7 * tg.layer.tapSize
		, lbl
		, color);
}
/*
FretChordSheet.prototype.tileNoteAltSharp = function (pitch, alts, xx, yy, tg) {
	var step = this.note7(pitch);
	var half = pitch % 12;
	var octave = Math.floor(pitch / 12);
	var rePitch = octave * 12 + this.note12(step);
	var diff = pitch - rePitch - alts[step];
	if (diff > 0) {
		this.tileSmallNoteSharp(xx - 1.5, yy, tg);
		alts[step] = diff;
	} else {
		if (diff < 0) {
			this.tileSmallNoteNatural(xx - 1.5, yy, tg);
			alts[step] = 0;
		}
	}
};
FretChordSheet.prototype.tileNoteAltFlat = function (pitch, alts, xx, yy, tg) {
	var step = this.note7(pitch);
	var half = pitch % 12;
	var octave = Math.floor(pitch / 12);
	var rePitch = octave * 12 + this.note12(step);
	var diff = pitch - rePitch + alts[step];
	if (diff > 0) {
		this.tileSmallNoteFlat(xx - 1.5, yy, tg);
		alts[step] = -diff;
	} else {
		if (diff < 0) {
			this.tileSmallNoteNatural(xx - 1.5, yy, tg);
			alts[step] = 0;
		}
	}
};*/
FretChordSheet.prototype.tileStaffMeasureNotes = function (x, minfo, mx, trackNum, left, top, width, height, lineWidth) {
	var me = this;
	var alts = [];
	for (var i = 0; i < 6; i++) {
		alts[0 + i * 7] = me.keys[minfo.keys][0];
		alts[1 + i * 7] = me.keys[minfo.keys][1];
		alts[2 + i * 7] = me.keys[minfo.keys][2];
		alts[3 + i * 7] = me.keys[minfo.keys][3];
		alts[4 + i * 7] = me.keys[minfo.keys][4];
		alts[5 + i * 7] = me.keys[minfo.keys][5];
		alts[6 + i * 7] = me.keys[minfo.keys][6];
	}
	this.layerOctaves.renderGroup(mx + this.margins.sheetLeft
		, this.margins.sheetTop
		, (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize
		, 6 * 7 * 3 * this.tiler.tapSize
		, 'staffNotes' + trackNum + 'x' + x, left, top, width, height, function (tg) {
			minfo.beats.sort(function (a, b) { return a.start192 - b.start192; });
			for (var b = 0; b < minfo.beats.length; b++) {
				var beat = minfo.beats[b];
				if (beat) {
					for (var c = 0; c < beat.chords.length; c++) {
						if (c == trackNum) {
							var chord = beat.chords[c];
							if (chord) {
								for (var n = 0; n < chord.notes.length; n++) {
									var note = chord.notes[n];
									if (note) {
										var color = me.trackInfo[c].shadow;
										if (me.trackOrder[trackNum] == 0) {
											color = me.trackInfo[c].color;
										}
										var octaveShift = minfo.shifts[trackNum] || 0;
										var yy = 6 * 7 - 7 * (note.octave - octaveShift) - note.step - 1;
										var xx = me.options.measureHeader + beat.start192 / 6;
										me.tileNoteHead(xx, yy, tg, color, me.trackOrder[trackNum]);
										var a = alts[note.step + note.octave * 7];
										//console.log(xx, note.step,note.accidental,a);
										if (note.accidental == 0 && a != 0) {
											alts[note.step + note.octave * 7] = 0;
											me.tileSmallNoteNatural(xx - 1.5, yy, tg, color, me.trackOrder[trackNum]);
										} else {
											if (note.accidental > 0 && (!(a > 0))) {
												alts[note.step + note.octave * 7] = 1;
												me.tileSmallNoteSharp(xx - 1.5, yy, tg, color, me.trackOrder[trackNum]);
											} else {
												if (note.accidental < 0 && (!(a < 0))) {
													alts[note.step + note.octave * 7] = -1;
													me.tileSmallNoteFlat(xx - 1.5, yy, tg, color, me.trackOrder[trackNum]);
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		});
};
FretChordSheet.prototype.tileStaffNotes = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	for (var x = 0; x < this.measures.length; x++) {
		var minfo = this.measureInfo(x);
		if (minfo) {
			minfo.beats.sort(function (a, b) { return a.start192 - b.start192; });
			for (var i = 0; i < 8; i++) {
				for (var trackNum = 0; trackNum < 8; trackNum++) {
					if (me.trackOrder[trackNum] == 7 - i) {
						me.tileStaffMeasureNotes(x, minfo, mx, trackNum, left, top, width, height, lineWidth);
					}
				}
			}
		}
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
	/*
		var me = this;
		var mx = 0;
		for (var x = 0; x < this.measures.length; x++) {
			var minfo = this.measureInfo(x);
			this.layerOctaves.renderGroup(mx + this.margins.sheetLeft
				, this.margins.sheetTop
				, (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize
				, 6 * 7 * 3 * this.tiler.tapSize
				, 'staffNotes' + x, left, top, width, height, function (tg) {
					var alts = [];
					for (var i = 0; i < 6; i++) {
						alts[0 + i * 7] = me.keys[minfo.keys][0];
						alts[1 + i * 7] = me.keys[minfo.keys][1];
						alts[2 + i * 7] = me.keys[minfo.keys][2];
						alts[3 + i * 7] = me.keys[minfo.keys][3];
						alts[4 + i * 7] = me.keys[minfo.keys][4];
						alts[5 + i * 7] = me.keys[minfo.keys][5];
						alts[6 + i * 7] = me.keys[minfo.keys][6];
					}
					minfo.beats.sort(function (a, b) { return a.start192 - b.start192; });
					for (var b = 0; b < minfo.beats.length; b++) {
						var beat = minfo.beats[b];
						if (beat) {
							for (var c = 0; c < beat.chords.length; c++) {
								var o = me.trackOrder[c];
								if (o > 0) {
									var chord = beat.chords[c];
									if (chord) {
										for (var n = 0; n < chord.notes.length; n++) {
											var note = chord.notes[n];
											if (note) {
												//var yy = me.pitch2staffY(note.pitch);//, 0, 0, !altModeSharp);
												var yy = 6 * 7 - 7 * note.octave - note.step - 1;
												var xx = me.options.measureHeader + beat.start192 / 6;
												me.tileNoteHead(xx, yy, tg, me.trackInfo[c].shadow);
	
											}
										}
									}
								}
							}
						}
					}
					for (var b = 0; b < minfo.beats.length; b++) {
						var beat = minfo.beats[b];
						if (beat) {
							for (var c = 0; c < beat.chords.length; c++) {
								var o = me.trackOrder[c];
								if (o == 0) {
									var chord = beat.chords[c];
									if (chord) {
										for (var n = 0; n < chord.notes.length; n++) {
											var note = chord.notes[n];
											if (note) {
												//var yy = me.pitch2staffY(note.pitch);//, 0, 0, !altModeSharp);
												var yy = 6 * 7 - 7 * note.octave - note.step - 1;
												var xx = me.options.measureHeader + beat.start192 / 6;
												me.tileNoteHead(xx, yy, tg, me.trackInfo[c].color);
											}
										}
									}
								}
							}
						}
					}
				});
			mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
		}*/
};
FretChordSheet.prototype.tileStaffButtons = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	for (var x = 0; x < this.measures.length; x++) {
		var minfo = this.measureInfo(x);
		this.layerOctaves.renderGroup(mx + this.margins.sheetLeft
			, this.margins.sheetTop
			, (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize
			, 6 * 7 * 3 * this.tiler.tapSize
			, 'staffButtons' + x, left, top, width, height, function (tg) {
				var _x = x;
				s = me.tileKnob(tg, 'rollKyesSel_' + x, 3 * me.tiler.tapSize, 33 * me.tiler.tapSize, 20 * me.tiler.tapSize, '', function () {
					me.userActionRollKeys(_x);
				});
				s = me.tileKnob(tg, 'rollKyesSel2_' + x, 3 * me.tiler.tapSize, (90 - 21) * me.tiler.tapSize, 20 * me.tiler.tapSize, '', function () {
					me.userActionRollKeys(_x);
				});

				s = me.tileKnob(tg, 'rollOctaveSel1_' + x, 3 * me.tiler.tapSize, 55 * me.tiler.tapSize, 10 * me.tiler.tapSize, '', function () {
					me.userActionRollClefOctave(_x);
				});
				s = me.tileKnob(tg, 'rollOctaveSel2_' + x, 3 * me.tiler.tapSize, (3 * 19 + 55 - 21) * me.tiler.tapSize, 10 * me.tiler.tapSize, '', function () {
					me.userActionRollClefOctave(_x);
				});
			});
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
};
FretChordSheet.prototype.tileStaffKeySigns = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	for (var x = 0; x < this.measures.length; x++) {
		var minfo = this.measureInfo(x);
		this.layerOctaves.renderGroup(mx + this.margins.sheetLeft
			, this.margins.sheetTop
			, (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize
			, 6 * 7 * 3 * this.tiler.tapSize
			, 'staffKeys' + x, left, top, width, height, function (tg) {
				me.tileStaffKeys(minfo, tg, left, top, width, height, 0);
				me.tileStaffKeys(minfo, tg, left, top, width, height, 1);
				me.tileStaffTrackShift(minfo, tg);
			});
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
			, 6 * 7 * 3 * this.tiler.tapSize
			, 'staffLines' + x, left, top, width, height, function (tg) {

				var upperColor = me.trackInfo[me.upperTrackNum()].color;

				tg.layer.tileRectangle(tg.g, tg.x + tg.w, tg.y + (31.45 + 6 * 0) * tg.layer.tapSize, lineWidth * 3, (81.2 - 7 * 3) * tg.layer.tapSize, upperColor);

				tg.layer.tileRectangle(tg.g, tg.x, tg.y + (31.5 + 6 * 0) * tg.layer.tapSize, tg.w, lineWidth, me.colors.staff);
				tg.layer.tileRectangle(tg.g, tg.x, tg.y + (31.5 + 6 * 1) * tg.layer.tapSize, tg.w, lineWidth, me.colors.staff);
				tg.layer.tileRectangle(tg.g, tg.x, tg.y + (31.5 + 6 * 2) * tg.layer.tapSize, tg.w, lineWidth, me.colors.staff);
				tg.layer.tileRectangle(tg.g, tg.x, tg.y + (31.5 + 6 * 3) * tg.layer.tapSize, tg.w, lineWidth, me.colors.staff);
				tg.layer.tileRectangle(tg.g, tg.x, tg.y + (31.5 + 6 * 4) * tg.layer.tapSize, tg.w, lineWidth, me.colors.staff);
				var sk = 57 - 7 * 3;
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
				tg.layer.tileRectangle(tg.g, tg.x + tg.w, tg.y, 3 * lineWidth, tg.h, me.colors.base);
			});
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
};
FretChordSheet.prototype.tileFretLines = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	for (var x = 0; x < this.measures.length; x++) {
		var minfo = this.measureInfo(x);
		this.layerOctaves.renderGroup(mx + this.margins.sheetLeft
			, this.margins.fretTop //+ y * 3 * 12 * this.tiler.tapSize
			, (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize
			, 12 * 3 * this.tiler.tapSize
			, 'frtLines' + x, left, top, width, height, function (tg) {
				var upperColor = me.trackInfo[me.upperTrackNum()].color;
				tg.layer.tileRectangle(tg.g, tg.x + tg.w, tg.y, 3 * lineWidth, tg.h, upperColor);
				for (var i = 0; i < 6; i++) {
					tg.layer.tileRectangle(tg.g, tg.x, tg.y + (1.5 + 2 * i * 3) * tg.layer.tapSize, tg.w, lineWidth, me.colors.base);
				}
			});
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
};

FretChordSheet.prototype.tilePianoOctaveKeys = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	var minfo = null;
	for (var x = 0; x <= this.measures.length; x++) {
		if (x < this.measures.length) {
			minfo = this.measureInfo(x);
		}
		else {
			minfo = this.measureInfo(this.measures.length - 1);
		}
		var keyArr = me.keys[minfo.keys];//, [1, 0, 0, 1, 0, 0, 0]//D 2
		for (var y = 0; y < 6; y++) {
			this.layerOctaveKeys.renderGroup(mx + this.margins.sheetLeft + this.options.measureHeader * 3 * this.tiler.tapSize
				, this.margins.pianorollTop + y * 3 * 12 * this.tiler.tapSize
				, (this.options.measureHeader + minfo.duration4 * 8 - this.options.measureHeader) * 3 * this.tiler.tapSize
				, 12 * 3 * this.tiler.tapSize
				, 'octaveKeys' + x + 'x' + y, left, top, width, height, function (tg) {
					if (y > 0) {
						tg.layer.tileRectangle(tg.g, tg.x, tg.y + 0 * 3 * tg.layer.tapSize, tg.w, lineWidth, me.colors.blackKey);
					}
					tg.layer.tileRectangle(tg.g, tg.x, tg.y + (0 - keyArr[6]) * 3 * tg.layer.tapSize, tg.w, 2.8 * tg.layer.tapSize, me.colors.whiteKey);
					tg.layer.tileRectangle(tg.g, tg.x, tg.y + (2 - keyArr[5]) * 3 * tg.layer.tapSize, tg.w, 2.8 * tg.layer.tapSize, me.colors.whiteKey);
					tg.layer.tileRectangle(tg.g, tg.x, tg.y + (4 - keyArr[4]) * 3 * tg.layer.tapSize, tg.w, 2.8 * tg.layer.tapSize, me.colors.whiteKey);
					tg.layer.tileRectangle(tg.g, tg.x, tg.y + (6 - keyArr[3]) * 3 * tg.layer.tapSize, tg.w, 2.8 * tg.layer.tapSize, me.colors.whiteKey);
					tg.layer.tileRectangle(tg.g, tg.x, tg.y + (7 - keyArr[2]) * 3 * tg.layer.tapSize, tg.w, 2.8 * tg.layer.tapSize, me.colors.whiteKey);
					tg.layer.tileRectangle(tg.g, tg.x, tg.y + (9 - keyArr[1]) * 3 * tg.layer.tapSize, tg.w, 2.8 * tg.layer.tapSize, me.colors.whiteKey);
					tg.layer.tileRectangle(tg.g, tg.x, tg.y + (11 - keyArr[0]) * 3 * tg.layer.tapSize, tg.w, 2.8 * tg.layer.tapSize, me.colors.whiteKey);
				});
		}
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
};
FretChordSheet.prototype.tileDrumNames = function (left, top, width, height, lineWidth) {
	var me = this;
	this.layerDrumNames.marginX = me.margins.sheetLeft;
	this.layerDrumNames.renderGroup(0//
		, me.margins.drumsTop //
		, 300 * this.tiler.tapSize//
		, 8 * 3 * this.tiler.tapSize//
		, 'drumNames', left, top, width, height, function (tg) {
			for (var k = 0; k < 8; k++) {
				tg.layer.tileText(tg.g, tg.x, tg.y + k * 3 * tg.layer.tapSize + 2.5 * tg.layer.tapSize, 3 * tg.layer.tapSize, '' + (me.drumInfo[k].title), me.colors.barCounter);
			}
		});

};
FretChordSheet.prototype.tileDrumGrid = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	var minfo = null;
	for (var x = 0; x <= this.measures.length; x++) {
		if (x < this.measures.length) {
			minfo = this.measureInfo(x);
		}
		else { minfo = this.measureInfo(this.measures.length - 1); }
		this.layerGrid.renderGroup(mx + this.margins.sheetLeft + this.options.measureHeader * 3 * this.tiler.tapSize
			, this.margins.drumsTop //+ y * 3 * 12 * this.tiler.tapSize
			, (this.options.measureHeader + minfo.duration4 * 8 - this.options.measureHeader) * 3 * this.tiler.tapSize
			, 8 * 3 * this.tiler.tapSize
			, 'drumGrid' + x, left, top, width, height, function (tg) {
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
						, tg.y + k * 3 * tg.layer.tapSize
						, tg.w
						, lineWidth
						, me.colors.grid);
				}
			});
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
};
FretChordSheet.prototype.tilStaffGrid = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	var minfo = null;
	for (var x = 0; x <= this.measures.length; x++) {
		if (x < this.measures.length) {
			minfo = this.measureInfo(x);
		} else {
			minfo = this.measureInfo(this.measures.length - 1);
		}
		this.layerGrid.renderGroup(mx + this.margins.sheetLeft + this.options.measureHeader * 3 * this.tiler.tapSize
			, this.margins.sheetTop //
			, (this.options.measureHeader + minfo.duration4 * 8 - this.options.measureHeader) * 3 * this.tiler.tapSize
			, 6 * 7 * 3 * this.tiler.tapSize
			, 'staffGrid' + x, left, top, width, height, function (tg) {
				for (var k = 0; k < minfo.duration4; k++) {
					if (k > 0) {
						tg.layer.tileRectangle(tg.g, tg.x + 8 * k * 3 * tg.layer.tapSize, tg.y
							, lineWidth * 2, 6 * 7 * 3 * tg.layer.tapSize, me.colors.grid);
					}
					for (var nn = 1; nn < me.feelPattern6[me.options.feel].length - 1; nn++) {
						tg.layer.tileRectangle(tg.g, tg.x + (8 * k + me.feelPattern6[me.options.feel][nn] / 6) * 3 * tg.layer.tapSize, tg.y
							, lineWidth * 0.5, 6 * 7 * 3 * tg.layer.tapSize, me.colors.grid);
					}
				}
				for (var k = 1; k < 6 * 7; k++) {
					tg.layer.tileRectangle(tg.g
						, tg.x
						, tg.y + k * 3 * tg.layer.tapSize
						, tg.w
						, lineWidth
						, me.colors.grid);
				}
			});
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
};
FretChordSheet.prototype.tileFretGrid = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	var minfo = null;
	for (var x = 0; x <= this.measures.length; x++) {
		if (x < this.measures.length) {
			minfo = this.measureInfo(x);
		} else {
			minfo = this.measureInfo(this.measures.length - 1);
		}
		this.layerGrid.renderGroup(mx + this.margins.sheetLeft + this.options.measureHeader * 3 * this.tiler.tapSize
			, this.margins.fretTop //
			, (this.options.measureHeader + minfo.duration4 * 8 - this.options.measureHeader) * 3 * this.tiler.tapSize
			, 12 * 3 * this.tiler.tapSize
			, 'frtGrid' + x, left, top, width, height, function (tg) {
				for (var k = 0; k < minfo.duration4; k++) {
					if (k > 0) {
						tg.layer.tileRectangle(tg.g, tg.x + 8 * k * 3 * tg.layer.tapSize, tg.y
							, lineWidth * 2, (2 * 6 - 1) * 3 * tg.layer.tapSize, me.colors.grid);
					}
					for (var nn = 1; nn < me.feelPattern6[me.options.feel].length - 1; nn++) {
						tg.layer.tileRectangle(tg.g, tg.x + (8 * k + me.feelPattern6[me.options.feel][nn] / 6) * 3 * tg.layer.tapSize, tg.y
							, lineWidth * 0.5, (2 * 6 - 1) * 3 * tg.layer.tapSize, me.colors.grid);
					}
				}
				/*for (var k = 1; k < 6; k++) {
					tg.layer.tileRectangle(tg.g
						, tg.x
						, tg.y + k * 3 * tg.layer.tapSize
						, tg.w
						, lineWidth
						, me.colors.grid);
				}*/
			});
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
		for (var y = 0; y < 6; y++) {
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

FretChordSheet.prototype.tilePianorollNoteLine = function (tg, tonenote, start192, measureNum, color, o) {
	var tx1 = tg.x + start192 / 6 * 3 * tg.layer.tapSize + 1.5 * tg.layer.tapSize;
	var p = tonenote.octave * 12 + this.note12(tonenote.step) + tonenote.accidental;
	var ty1 = (6 * 12 - p - 1) * 3 * tg.layer.tapSize + this.margins.pianorollTop + 1.5 * tg.layer.tapSize;
	//console.log(tonenote);
	for (var i = 0; i < tonenote.slides.length; i++) {
		var tx2 = this.findBeatX(measureNum, start192 + tonenote.slides[i].end192 - 6) + 1.5 * tg.layer.tapSize;
		if (tx2 - tx1 < 1) {
			tx2 = tx1 + 1;
		}
		var ty2 = ty1 + tonenote.slides[i].shift * 3 * tg.layer.tapSize;
		var delta = 0;
		if (o) {
			delta = (0.2 + o * 0.05) * this.tiler.tapSize;
		}
		//console.log(ty1, delta,p,tonenote);
		tg.layer.tileLine(tg.g, tx1 + delta
			, ty1 + delta
			, tx2 + delta
			, ty2 + delta
			, color, 2.9 * tg.layer.tapSize);
		tx1 = tx2;
		ty1 = ty2;
	}
};
FretChordSheet.prototype.tilePianorollMeasureNotes = function (x, minfo, mx, trackNum, left, top, width, height, lineWidth) {
	var me = this;
	for (var y = 0; y < 6; y++) {
		this.layerNotes.renderGroup(mx + this.margins.sheetLeft + this.options.measureHeader * 3 * this.tiler.tapSize
			, this.margins.pianorollTop + y * 3 * 12 * this.tiler.tapSize
			, (this.options.measureHeader + minfo.duration4 * 8 - this.options.measureHeader) * 3 * this.tiler.tapSize
			, 12 * 3 * this.tiler.tapSize
			, 'pianoMeasure' + trackNum + 'x' + x + 'x' + y, left, top, width, height, function (tg) {
				for (var b = 0; b < minfo.beats.length; b++) {
					var beat = minfo.beats[b];
					if (beat) {
						for (var c = 0; c < beat.chords.length; c++) {
							if (c == trackNum) {
								var chord = beat.chords[c];
								if (chord) {
									for (var n = 0; n < chord.notes.length; n++) {
										var note = chord.notes[n];
										if (note) {
											if (note.octave >= (5 - y) && note.octave < (6 - y)) {
												var color = me.trackInfo[c].color;
												if (me.trackOrder[trackNum] > 0) {
													color = me.trackInfo[c].shadow;
												}
												me.tilePianorollNoteLine(tg, note, beat.start192, x, color, me.trackOrder[trackNum]);
												if (me.trackOrder[trackNum] == 0) {
													var dd = (beat.start192 / 6) * (3 * tg.layer.tapSize) + 0.95 * tg.layer.tapSize;
													var label = me.keyName(note);
													if (note.vibrato) {
														label = label + '~';
													}
													tg.layer.tileText(tg.g
														, tg.x + dd
														, tg.y + (12 - me.note12(note.step) - note.accidental) * 3 * tg.layer.tapSize - 0.5 * tg.layer.tapSize
														, 2.5 * tg.layer.tapSize
														, label
														, me.colors.noteLabel);
												}
											}
										}
									}
								}
							}
						}
					}
				}
			});
	}
}
FretChordSheet.prototype.tilePianorollNotes = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	for (var x = 0; x < this.measures.length; x++) {
		var minfo = this.measureInfo(x);
		if (minfo) {
			for (var i = 0; i < 8; i++) {
				for (var trackNum = 0; trackNum < 8; trackNum++) {
					if (me.trackOrder[trackNum] == 7 - i) {
						me.tilePianorollMeasureNotes(x, minfo, mx, trackNum, left, top, width, height, lineWidth);
					}
				}
			}
		}
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
};
FretChordSheet.prototype.tileFretButtonNoteTools = function (tg, note, x, y, morder) {
	var me = this;
	var vibratoLabel = '+';
	if (note.vibrato) {
		vibratoLabel = 'x ~~~';
	}
	me.tileKnob(tg, 'noteFretVibrato' + x + 'x' + y
		, x
		, y
		, me.tiler.tapSize, vibratoLabel, function () {
			//console.log(me.note7(note.pitch), note);
			me.userActionVibratoNote(morder, note);
		});
};
FretChordSheet.prototype.tileFretMeasureNoteTools = function (x, minfo, mx, left, top, width, height, lineWidth) {
	var trackNum = this.upperTrackNum();
	var me = this;
	this.layerOctaves.renderGroup(mx + this.margins.sheetLeft
		, this.margins.fretTop
		, (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize
		, 7 * 3 * this.tiler.tapSize
		, 'fretNoteTools' + trackNum + 'x' + x, left, top, width, height, function (tg) {
			for (var b = 0; b < minfo.beats.length; b++) {
				var beat = minfo.beats[b];
				if (beat) {
					for (var c = 0; c < beat.chords.length; c++) {
						if (c == trackNum) {
							var chord = beat.chords[c];
							if (chord) {
								for (var n = 0; n < chord.notes.length; n++) {
									var note = chord.notes[n];
									if (note) {
										var octaveShift = minfo.shifts[trackNum] || 0;
										var ss = me.stringFret(note);
										var tx1 = me.options.measureHeader * 3 * tg.layer.tapSize + tg.x + beat.start192 / 6 * 3 * tg.layer.tapSize - 0.5 * tg.layer.tapSize;
										var ty1 = tg.y + 2 * ss.string * 3 * tg.layer.tapSize + 2.5 * tg.layer.tapSize;
										/*tg.layer.tileLine(tg.g
											,tx1
											, ty1
											,tx1+1
											, ty1+1
											, '#000', 2.9 * tg.layer.tapSize);
											*/
										/*var vibratoLabel = '+';
										if (note.vibrato) {
											vibratoLabel = 'x ~~~';
										}
										me.tileKnob(tg, 'noteFretVibrato' + tx1 + 'x' + ty1
											, tx1 - tg.x
											, ty1 - tg.y
											, me.tiler.tapSize, vibratoLabel, function () {
												//console.log(me.note7(note.pitch), note);
												me.userActionVibratoNote(morder, note);
											});*/
										me.tileFretButtonNoteTools(tg, note, tx1 - tg.x, ty1 - tg.y, x);
									}
								}
							}
						}
					}
				}
			}
		});
};
FretChordSheet.prototype.tileFretMeasureNotes = function (x, minfo, mx, trackNum, left, top, width, height, lineWidth, o) {
	//console.log(x);
	var me = this;
	var alts = [];
	var delta = 0;
	if (o) {
		delta = (0.2 + o * 0.05) * this.tiler.tapSize;
	}
	this.layerOctaves.renderGroup(mx + this.margins.sheetLeft
		, this.margins.fretTop
		, (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize
		, 7 * 3 * this.tiler.tapSize
		, 'fretNotes' + trackNum + 'x' + x, left, top, width, height, function (tg) {
			//console.log('track',trackNum,'x',x);
			//minfo.beats.sort(function (a, b) { return a.start192 - b.start192; });
			for (var b = 0; b < minfo.beats.length; b++) {
				var beat = minfo.beats[b];
				if (beat) {
					for (var c = 0; c < beat.chords.length; c++) {
						if (c == trackNum) {
							var chord = beat.chords[c];
							if (chord) {
								for (var n = 0; n < chord.notes.length; n++) {
									var note = chord.notes[n];
									if (note) {
										var color = me.trackInfo[c].shadow;
										if (me.trackOrder[trackNum] == 0) {
											color = me.trackInfo[c].color;
											//var ss=me.stringFret(note);
										}
										var octaveShift = minfo.shifts[trackNum] || 0;
										//var yy = 6 * 7 - 7 * (note.octave-octaveShift) - note.step - 1;
										//var xx = me.options.measureHeader + beat.start192 / 6;
										var ss = me.stringFret(note);
										var tx1 = me.options.measureHeader * 3 * tg.layer.tapSize + tg.x + beat.start192 / 6 * 3 * tg.layer.tapSize + 1.5 * tg.layer.tapSize;
										var tx2 = me.findBeatX(x, beat.start192 + note.slides[note.slides.length - 1].end192 - 6) + 1.5 * tg.layer.tapSize;
										if (tx2 - tx1 < 1) {
											tx2 = tx1 + 1;
										}
										var ty1 = tg.y + 2 * ss.string * 3 * tg.layer.tapSize + 1.5 * tg.layer.tapSize;
										//console.log(trackNum,me.stringFret(note));
										//me.tileFretNoteLine(tg, note, beat.start192, x, color, me.trackOrder[trackNum]);
										tg.layer.tileLine(tg.g
											//, tg.x + xx * 3 * tg.layer.tapSize
											, tx1 + delta
											, ty1 + delta
											//, tg.x + xx * 3 * tg.layer.tapSize + 1
											, tx2 + delta
											, tg.y + 2 * ss.string * 3 * tg.layer.tapSize + 1.5 * tg.layer.tapSize + delta
											, color, 2.9 * tg.layer.tapSize);
										if (me.trackOrder[trackNum] == 0) {
											var label = '' + ss.fret;
											if (note.vibrato) {
												label = label + '~';
											}
											tg.layer.tileText(tg.g, tx1, ty1 + 1 * tg.layer.tapSize, 2.5 * tg.layer.tapSize, label, me.colors.noteLabel);
										}
									}
								}
							}
						}
					}
				}
			}
		});
};

/*
FretChordSheet.prototype.tileFretNoteLine = function (tg, tonenote, start192, measureNum, color, o) {
	var tx1 = tg.x + start192 / 6 * 3 * tg.layer.tapSize + 1.5 * tg.layer.tapSize;
	var p = tonenote.octave * 12 + this.note12(tonenote.step) + tonenote.accidental;
	var ty1 = (6 * 12 - p - 1) * 3 * tg.layer.tapSize + this.margins.pianorollTop + 1.5 * tg.layer.tapSize;
	//console.log(tonenote);
	for (var i = 0; i < tonenote.slides.length; i++) {
		var tx2 = this.findBeatX(measureNum, start192 + tonenote.slides[i].end192 - 6) + 1.5 * tg.layer.tapSize;
		if (tx2 - tx1 < 1) {
			tx2 = tx1 + 1;
		}
		var ty2 = ty1 + tonenote.slides[i].shift * 3 * tg.layer.tapSize;
		var delta = 0;
		if (o) {
			delta = (0.2 + o * 0.05) * this.tiler.tapSize;
		}
		//console.log(ty1, delta,p,tonenote);
		tg.layer.tileLine(tg.g, tx1 + delta
			, ty1 + delta
			, tx2 + delta
			, ty2 + delta
			, color, 2.9 * tg.layer.tapSize);
		tx1 = tx2;
		ty1 = ty2;
	}
};
*/


FretChordSheet.prototype.tileFretNoteSpot = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	for (var x = 0; x < this.measures.length; x++) {
		var minfo = this.measureInfo(x);
		if (minfo) {
			me.tileFretMeasureNoteTools(x, minfo, mx, left, top, width, height, lineWidth);
			/*minfo.beats.sort(function (a, b) { return a.start192 - b.start192; });
			for (var i = 0; i < 8; i++) {
				for (var trackNum = 0; trackNum < 8; trackNum++) {
					if (me.trackOrder[trackNum] == 7 - i) {
						me.tileFretMeasureNotes(x, minfo, mx, trackNum, left, top, width, height, lineWidth,me.trackOrder[trackNum]);
					}
				}
			}*/
		}
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
};
FretChordSheet.prototype.tileFretNotes = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	for (var x = 0; x < this.measures.length; x++) {
		var minfo = this.measureInfo(x);
		if (minfo) {
			minfo.beats.sort(function (a, b) { return a.start192 - b.start192; });
			for (var i = 0; i < 8; i++) {
				for (var trackNum = 0; trackNum < 8; trackNum++) {
					if (me.trackOrder[trackNum] == 7 - i) {
						me.tileFretMeasureNotes(x, minfo, mx, trackNum, left, top, width, height, lineWidth, me.trackOrder[trackNum]);
					}
				}
			}
		}
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
};
FretChordSheet.prototype.tileDrumNotes = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	for (var x = 0; x < this.measures.length; x++) {
		var minfo = this.measureInfo(x);
		if (minfo)
			this.layerNotes.renderGroup(mx + this.margins.sheetLeft + this.options.measureHeader * 3 * this.tiler.tapSize
				, this.margins.drumsTop //+ y * 3 * 12 * this.tiler.tapSize
				, (this.options.measureHeader + minfo.duration4 * 8 - this.options.measureHeader) * 3 * this.tiler.tapSize
				, 8 * 3 * this.tiler.tapSize
				, 'ntsdrm' + x, left, top, width, height, function (tg) {
					for (var b = 0; b < minfo.beats.length; b++) {
						var beat = minfo.beats[b];
						if (beat)
							for (var c = 0; c < beat.drums.length; c++) {
								if (beat.drums[c]) {
									var tx = tg.x + beat.start192 / 6 * 3 * tg.layer.tapSize + 1.5 * tg.layer.tapSize;
									var ty = tg.y + c * 3 * tg.layer.tapSize + 1.5 * tg.layer.tapSize;
									tg.layer.tileLine(tg.g
										, tx, ty
										, tx + 1, ty
										, me.colors.base, 2.9 * tg.layer.tapSize);
								}
							}
					}
				});
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
};

FretChordSheet.prototype.tileStaffMark = function (left, top, width, height, lineWidth) {
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
						var octaveShift = minfo.shifts[me.upperTrackNum()] || 0;
						this.layerNotes.renderGroup(mx + this.margins.sheetLeft + this.options.measureHeader * 3 * this.tiler.tapSize
							, this.margins.sheetTop// + y * 3 * 12 * this.tiler.tapSize
							, (this.options.measureHeader + minfo.duration4 * 8 - this.options.measureHeader) * 3 * this.tiler.tapSize
							, 7 * 6 * 3 * this.tiler.tapSize
							, 'markStafNote' + mm, left, top, width, height, function (tg) {
								tg.layer.tileCircle(tg.g
									, tg.x + curMark.start192 / 6 * 3 * me.tiler.tapSize + 3 * me.tiler.tapSize / 2
									, tg.y + tg.h - (curMark.step + (curMark.octave - octaveShift) * 7) * 3 * me.tiler.tapSize - 3 * me.tiler.tapSize / 2
									, 3 * me.tiler.tapSize / 2, me.colors.buttonFill);
							});
					}
				mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
			}
		}
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
						for (var y = 0; y < 6; y++) {
							var s = 5 - y;

							//if (curMark.pitch >= s * 12 && curMark.pitch < s * 12 + 12) {
							if (curMark.octave == s) {
								//console.log(s, curMark);
								this.layerNotes.renderGroup(mx + this.margins.sheetLeft + this.options.measureHeader * 3 * this.tiler.tapSize
									, this.margins.pianorollTop + y * 3 * 12 * this.tiler.tapSize
									, (this.options.measureHeader + minfo.duration4 * 8 - this.options.measureHeader) * 3 * this.tiler.tapSize
									, 12 * 3 * this.tiler.tapSize
									, 'markNote' + mm, left, top, width, height, function (tg) {
										tg.layer.tileCircle(tg.g
											, tg.x + curMark.start192 / 6 * 3 * me.tiler.tapSize + 3 * me.tiler.tapSize / 2
											, tg.y + tg.h - (me.note12(curMark.step) + curMark.accidental) * 3 * me.tiler.tapSize - 3 * me.tiler.tapSize / 2
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
	for (var i = 0; i < 6; i++) {
		this.layerOctaveNumbers.renderGroup(0//
			, me.margins.pianorollTop + i * 12 * 3 * this.tiler.tapSize - 14 * 3 * this.tiler.tapSize//
			, me.options.measureLen * 3 * this.tiler.tapSize//
			, 12 * 4 * this.tiler.tapSize//
			, 'octaveNum' + i, left, top, width, height, function (tg) {
				tg.layer.tileText(tg.g, tg.x + sz * 0 * tg.layer.tapSize, tg.y + tg.h - sz / 10, sz, '' + (6 - i), me.colors.barCounter);
			});
	}
};
FretChordSheet.prototype.tileBarButtons = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	for (var x = 0; x < this.measures.length; x++) {
		var minfo = this.measureInfo(x);
		this.layerBarNumbers.renderGroup(mx + this.margins.sheetLeft
			, 0
			, (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize
			, 22 * me.tiler.tapSize * 0.03 * this.tiler.tapSize
			, 'barButn' + x, left, top, width, height, function (tg) {
				var _x = x;
				s = me.tileKnob(tg, 'rollMeter_' + x, 20 * me.tiler.tapSize, 10 * me.tiler.tapSize, 10 * me.tiler.tapSize, '' + minfo.duration4 + "/4", function () {
					me.userActionRollMeter(_x);
				});
				s = me.tileKnob(tg, 'rollTempo_' + x, 35 * me.tiler.tapSize, 10 * me.tiler.tapSize, 10 * me.tiler.tapSize, '' + minfo.tempo, function () {
					me.userActionRollTempo(_x);
				});
				var selabel = 'Select';
				if (me.selection) {
					if (me.selection.to) {
						if (_x >= me.selection.from - 1 && _x <= me.selection.to - 1) {
							selabel = '🗸';
						} else {
							selabel = '';
						}
					} else {
						if (_x == me.selection.from - 1) {
							selabel = '🗸';
						} else {
							selabel = '+';
						}
					}
				}
				s = me.tileKnob(tg, 'selection_' + x, 50 * me.tiler.tapSize, 10 * me.tiler.tapSize, 10 * me.tiler.tapSize, selabel, function () {
					me.selectMeasures(_x);
				});
			});
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
}
FretChordSheet.prototype.tileMeasurePlaceholders = function (left, top, width, height, lineWidth) {
	var me = this;
	this.layerGrid.renderGroup(0, 0, this.calcContentWidth(), this.contentHeight
		, 'bgPane', left, top, width, height, function (tg) {
			var mx = 0;
			for (var x = 0; x < me.measures.length; x++) {
				var minfo = me.measureInfo(x);
				if (x % 10 == 0) {
					tg.layer.tileRectangle(tg.g, tg.x + mx, tg.y, 15 * tg.layer.tapSize, tg.h, 'rgba(0,0,0,0.05)');
				}
				mx = mx + (me.options.measureHeader + minfo.duration4 * 8) * 3 * me.tiler.tapSize;
			}
		});
};
FretChordSheet.prototype.tileSomeBarNumbers = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	var sz = 5000;
	for (var x = 0; x < this.measures.length; x++) {
		if (x % 10 == 0) {
			var minfo = this.measureInfo(x);
			this.layerBarNumbers.renderGroup(mx + this.margins.sheetLeft
				, 0
				, (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize
				, sz * 0.03 * this.tiler.tapSize
				, 'barNum' + x, left, top, width, height, function (tg) {
					tg.layer.tileText(tg.g, tg.x + (sz / 200) * tg.layer.tapSize, tg.y + tg.h, sz, '' + (1 + x), me.colors.barCounter);
				});
		}
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
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
				tg.layer.tileText(tg.g, tg.x + (sz / 200) * tg.layer.tapSize, tg.y + tg.h, sz, '' + (1 + x), me.colors.barCounter);
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
			me.tileKnob(tg, 'resetsng', 3 * me.tiler.tapSize, 12 * me.tiler.tapSize, 3 * me.tiler.tapSize, 'Clear song', function () {
				me.userActionClearSong();
			});
			me.tileKnob(tg, 'hideStaff', 3 * me.tiler.tapSize, 18 * me.tiler.tapSize, 3 * me.tiler.tapSize, me.options.hideStaff == 1 ? 'Hide staff' : 'Show staff', function () {
				me.userActionSetHideStaff(me.options.hideStaff == 1 ? 2 : 1);
			});
			me.tileKnob(tg, 'hideDrums', 3 * me.tiler.tapSize, 22 * me.tiler.tapSize, 3 * me.tiler.tapSize, me.options.hideDrums == 1 ? 'Hide drums' : 'Show drums', function () {
				me.userActionSetHideDrums(me.options.hideDrums == 1 ? 2 : 1);
			});
			me.tileKnob(tg, 'hideRoll', 3 * me.tiler.tapSize, 26 * me.tiler.tapSize, 3 * me.tiler.tapSize, me.options.hidePiano == 1 ? 'Hide pianoroll' : 'Show pianoroll', function () {
				me.userActionSetHidePiano(me.options.hidePiano == 1 ? 2 : 1);
			});
			me.tileKnob(tg, 'hideFret', 3 * me.tiler.tapSize, 30 * me.tiler.tapSize, 3 * me.tiler.tapSize, me.options.hideFrets == 1 ? 'Hide fretboard' : 'Show fretboard', function () {
				me.userActionSetHideFrets(me.options.hideFrets == 1 ? 2 : 1);
			});

			me.tileKnob(tg, 'imprtmxml', 3 * me.tiler.tapSize, 36 * me.tiler.tapSize, 3 * me.tiler.tapSize, 'Import .mxml', function () {
				me.promptImport();
			});
			for (var i = 0; i < me.trackInfo.length; i++) {
				var o = me.trackOrder[i];
				if (o > 0) {
					var kb = me.tileKnob(tg, 'tr' + i, 3 * me.tiler.tapSize, (42 + o * 4) * me.tiler.tapSize, 3 * me.tiler.tapSize, me.trackInfo[i].title, function (s) {
						me.userActionTrackUp(s.toneNum);
					}, me.trackInfo[i].color);
					kb.toneNum = i;
				} else {
					tg.layer.tileText(tg.g
						, tg.x + 3 * me.tiler.tapSize + (3 * me.tiler.tapSize) / 4
						, tg.y + (42 + o * 4) * me.tiler.tapSize + 0.8 * (3 * me.tiler.tapSize)
						, 0.017 * (3 * me.tiler.tapSize) * tg.layer.tapSize, me.trackInfo[i].title, me.trackInfo[i].color);
				}
			}
			me.tileRange(tg, 'btnMarkNotesCount'
				, 3 * me.tiler.tapSize
				, 76 * me.tiler.tapSize
				, me.margins.sheetLeft - 6 * me.tiler.tapSize
				, 1 * 3 * me.tiler.tapSize
				, me.options.markNotesCount, 3, 'Taps per note: ' + me.options.markNotesCount, function (v) {
					me.userActionChangeMarkMode(v);
				});

			me.tileRange(tg, 'btnBreakWidth'
				, 3 * me.tiler.tapSize
				, 82 * me.tiler.tapSize
				, me.margins.sheetLeft - 6 * me.tiler.tapSize
				, 1 * 3 * me.tiler.tapSize
				, me.options.breakMode + 1, 3, 'Measure break: ' + me.breakNames[me.options.breakMode], function (v) {
					me.userActionBreakMode(v);
				});
			me.tileKnob(tg, 'dlgtst', 3 * me.tiler.tapSize, 91 * me.tiler.tapSize, 3 * me.tiler.tapSize, 'Dialog', function () {
				console.log('dialog');
				me.modalDialogMode = true;
			});
		});
};

FretChordSheet.prototype.tileRange = function (tg, id, x, y, w, h, v, mx, label, action) {
	for (var i = 0; i < mx; i++) {
		var c = this.colors.buttonShadow;
		if (i < v) {
			c = this.colors.buttonFill;
		}
		tg.layer.tileLine(tg.g
			, tg.x + x + i * w / mx + h / 2
			, tg.y + y + h / 2 + h
			, tg.x + x + i * w / mx + w / mx - h / 2
			, tg.y + y + h / 2 + h
			, c
			, h);
		var s = tg.layer.addSpot(id + '_' + i
			, tg.x + x + i * w / mx
			, tg.y + y + h
			, w / mx
			, h
			, function (sv) {
				action(this.selectedValue);
			});
		s.selectedValue = i + 1;
	}
	tg.layer.tileText(tg.g, tg.x + x + h / 4, tg.y + y + 0.8 * h, 0.017 * h * tg.layer.tapSize, label, this.colors.buttonLabel);
};
FretChordSheet.prototype.tileKnob = function (tg, id, x, y, sz, label, action, color) {
	var c = this.colors.buttonLabel;
	if (color) { 
		c = color; 
	}
	//tg.layer.tileCircle(tg.g, tg.x + x + sz / 2, tg.y + y + sz / 2, sz / 2, this.colors.buttonFill);
	tg.layer.tileCircle(tg.g, tg.x + x + sz / 2, tg.y + y + sz / 2, sz / 2, "rgba(0,0,0,0)",this.colors.buttonFill,sz/20);
	tg.layer.tileText(tg.g, tg.x + x + sz / 4, tg.y + y + 0.8 * sz, 0.017 * sz * tg.layer.tapSize, label, c);
	var s = tg.layer.addSpot(id, tg.x + x, tg.y + y, sz, sz, function () {
		action(s);
	});
	return s;
};
