﻿

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
	//console.log('tileTest');
	layer.renderGroup(//
		this.margins.sheetLeft//
		, this.margins.sheetTop//
		, this.options.measureLen * 3 * layer.tapSize//
		, 6 * 7 * 3 * layer.tapSize//
		, 'tstxt23txt', left, top, width, height, function (tg) {
			for (var o = 0; o < 6; o++) {
				for (var n = 0; n < 7; n++) {
					me.tileNoteHead(n, 7 * o + n, tg);
				}
			}
		});
};
FretChordSheet.prototype.tileOctaveNumbers = function (sz, left, top, width, height, layer, lineWidth) {
	var me = this;
	//console.log(sz,3 * layer.tapSize);
	//layer.lockX = layer.tiler.svg.clientWidth - sz/10;//3 * layer.tapSize;
	for (var i = 0; i < 5; i++) {
		layer.renderGroup(0//me.margins.sheetLeft //-sz/50 //5 * 3 * layer.tapSize//
			, me.margins.pianorollTop + i * 12 * 3 * layer.tapSize//
			, me.options.measureLen * 3 * layer.tapSize//
			, 12 * 3 * layer.tapSize//
			, 'octaveNum' + i, left, top, width, height, function (tg) {
				layer.tileText(tg.g, tg.x + sz * 0 * layer.tapSize, tg.y + tg.h - sz / 10, sz, '' + (5 - i), me.colors.barCounter);
			});
	}
};
FretChordSheet.prototype.tileBarNumbers = function (sz, left, top, width, height, layer, lineWidth) {
	var me = this;
	for (var i = 0; i < this.calcMeasureCount(); i++) {
		var minfo=this.measureInfo(i);
		layer.renderGroup(minfo.left* 3 * layer.tapSize //this.margins.sheetLeft + i * this.options.measureLen * 3 * layer.tapSize//
			, 0//
			, minfo.duration192/6* 3 * layer.tapSize //this.options.measureLen * 3 * layer.tapSize//
			, sz//
			, 'barNum' + i, left, top, width, height, function (tg) {
				layer.tileText(tg.g, tg.x + sz / 50 * layer.tapSize, tg.y + tg.h, sz, '' + (1 + i), me.colors.barCounter);
			});
	}
};
FretChordSheet.prototype.tileLeftMenu = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	layer.renderGroup(0, 0, me.margins.sheetLeft, this.contentHeight, 'lemenu', left, top, width, height, function (tg) {
		me.tileRange(tg, 'btnFeel', 3 * me.tiler.tapSize, 1 * 3 * me.tiler.tapSize, 3 * me.tiler.tapSize, me.margins.sheetLeft - 6 * me.tiler.tapSize, 1 + me.options.feel, 5, 'Feel: ' + me.feelNames[me.options.feel], function (v) {
			//console.log('btnFeel', v);
			//me.options.feel = v - 1;
			me.userActionChangeFeel(v - 1);
		});
		me.tileRange(tg, 'btnMtr', 3 * me.tiler.tapSize, 3 * 3 * me.tiler.tapSize, 3 * me.tiler.tapSize, me.margins.sheetLeft - 6 * me.tiler.tapSize, 1 + me.options.measureMode, 5, 'Meter: ' + me.measureModeNames[me.options.measureMode], function (v) {
			//console.log('btnFeel', v);
			//me.options.measureMode = v - 1;
			//me.options.measureLen = (me.options.measureMode + 3) * 8;
			me.userActionChangeMeasureMode(v - 1);
		});
	});
};

FretChordSheet.prototype.tilePianoSpot = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	layer.renderGroup(this.margins.sheetLeft //
		, this.margins.pianorollTop//
		, (1 + this.calcMeasureCount()) * this.options.measureLen * 3 * layer.tapSize//
		, 12 * 5 * 3 * layer.tapSize//
		, 'pianospt', left, top, width, height, function (tg) {
			var s = tg.layer.addSpot('pianoSpot', tg.x, tg.y, tg.w, tg.h, function () {
				var x = me.clickedBeat();
				var y = Math.floor((me.tiler.clickContentY - me.margins.pianorollTop) / (3 * me.tiler.tapSize));
				var pitch = 0;//5 * 12 - y-1;	
				var tone = 0;
				var shift = 0;
				console.log('tilePianoSpot', me.markNote);
				if (me.markNote) {
					var len = x.x6 + x.l6 - me.markNote.start192;
					var start = me.markNote.start192;
					pitch = me.markNote.pitch;
					shift = pitch - (5 * 12 - y - 1);
					if (me.markNote.start192 > x.x6) {
						len = me.markNote.start192 + me.markNote.len192 - x.x6;
						start = x.x6;
						pitch = 5 * 12 - y - 1;
						shift = pitch - me.markNote.pitch;


					}
					console.log('pitch', pitch);
					me.userActionAddNote(me.markNote.tone, start, len, pitch, shift);
					me.markNote = null;
				} else {
					var notes = me.findNotes(tone, x.x6, x.l6, 5 * 12 - y - 1);
					if (notes.length > 0) {
						me.userActionDropNotes(tone, x.x6, x.l6, 5 * 12 - y - 1);
					} else {
						me.markNote = { tone: tone, start192: x.x6, len192: x.l6, pitch: 5 * 12 - y - 1, shift: shift };
						//console.log(me.markNote,y);
					}
				}
			});
		});
};

FretChordSheet.prototype.tilePianoMark = function (left, top, width, height, layer, lineWidth) {
	if (this.markNote) {
		var me = this;
		for (var n = 0; n < 5; n++) {
			for (var i = 0; i < this.calcMeasureCount() + 1; i++) {
				var minfo=this.measureInfo(i);
				layer.renderGroup(minfo.left* 3 * layer.tapSize //this.margins.sheetLeft + i * this.options.measureLen * 3 * layer.tapSize//
					, this.margins.pianorollTop + n * 3 * 12 * layer.tapSize//
					, minfo.duration192/6* 3 * layer.tapSize //this.options.measureLen * 3 * layer.tapSize//
					, 12 * 3 * layer.tapSize//
					, 'pianoMark' + i + 'x' + n, left, top, width, height, function (tg) {
						//for (var t = 0; t < me.tones.length; t++) {
						var tx = me.markNote.start192 / 6 * 3 * layer.tapSize + me.margins.sheetLeft;
						var ty = (5 * 12 - me.markNote.pitch - 1) * 3 * layer.tapSize + me.margins.pianorollTop;
						//console.log('tilePianoMark', tx, ty);
						if (tx >= tg.x
							&& tx <= tg.x + tg.w
							&& ty >= tg.y
							&& ty <= tg.y + tg.h
						) {
							/*tg.layer.tileLine(tg.g
								, tx + 1.5 * layer.tapSize
								, ty + 1.5 * layer.tapSize
								, tx + 1.5 * layer.tapSize + 1
								, ty + 1.5 * layer.tapSize
								, me.colors.buttonFill, 3 * layer.tapSize);
								*/
							tg.layer.tileCircle(tg.g, tx + 1.5 * layer.tapSize, ty + 1.5 * layer.tapSize, 1.5 * layer.tapSize, 'rgba(0,0,0,0)', me.colors.base, 0.5 * layer.tapSize);
							return;
						}
						//}
					});
			}
		}
	}
};
FretChordSheet.prototype.tilePianorollNotes = function (left, top, width, height, layer, lineWidth) {
	//console.log(this.tones,left, top, width, height);
	var me = this;
	for (var n = 0; n < 5; n++) {
		for (var i = 0; i < this.calcMeasureCount(); i++) {
			var minfo=this.measureInfo(i);
			layer.renderGroup(minfo.left* 3 * layer.tapSize //this.margins.sheetLeft + i * this.options.measureLen * 3 * layer.tapSize//
				, this.margins.pianorollTop + n * 3 * 12 * layer.tapSize//
				, minfo.duration192/6* 3 * layer.tapSize //this.options.measureLen * 3 * layer.tapSize//
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
							//console.log(me.tones[t]);
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
};
FretChordSheet.prototype.tilePianorollGrid = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	for (var n = 0; n < 5; n++) {
		for (var i = 0; i < this.calcMeasureCount() + 1; i++) {
			var minfo=this.measureInfo(i);
			layer.renderGroup(minfo.left* 3 * layer.tapSize //this.margins.sheetLeft + i * this.options.measureLen * 3 * layer.tapSize//
				, this.margins.pianorollTop + n * 3 * 12 * layer.tapSize//
				, minfo.duration192/6* 3 * layer.tapSize //this.options.measureLen * 3 * layer.tapSize//
				, 12 * 3 * layer.tapSize//
				, 'prgrd' + i + 'x' + n, left, top, width, height, function (tg) {
					for (var k = 0; k < me.options.measureLen / 8; k++) {
						if (k > 0) {
							layer.tileRectangle(tg.g, tg.x + 8 * k * 3 * layer.tapSize, tg.y
								, lineWidth * 2, 12 * 3 * layer.tapSize, me.colors.grid);
						}
						for (var nn = 1; nn < me.feelPattern6[me.options.feel].length - 1; nn++) {
							//console.log(nn,me.feelPattern6[me.options.feel][nn]);
							layer.tileRectangle(tg.g, tg.x + (8 * k + me.feelPattern6[me.options.feel][nn] / 6) * 3 * layer.tapSize, tg.y
								, lineWidth * 0.5, 12 * 3 * layer.tapSize, me.colors.grid);
						}
						/*if (me.options.feel == 0) {
							for (var nn = 1; nn < 4; nn++) {
								layer.tileRectangle(tg.g, tg.x + (8 * k + nn * 2) * 3 * layer.tapSize, tg.y
									, lineWidth * 0.5, 12 * 3 * layer.tapSize, me.colors.grid);
							}
						} else {
							if (me.options.feel == 2) {
								for (var nn = 1; nn < 6; nn++) {
									layer.tileRectangle(tg.g, tg.x + (8 * k + nn * 8 / 6) * 3 * layer.tapSize, tg.y
										, lineWidth * 0.5, 12 * 3 * layer.tapSize, me.colors.grid);
								}
							} else {
								if (me.options.feel == 1) {
									layer.tileRectangle(tg.g, tg.x + (8 * k + 2.5) * 3 * layer.tapSize, tg.y
										, lineWidth * 0.5, 12 * 3 * layer.tapSize, me.colors.grid);
									layer.tileRectangle(tg.g, tg.x + (8 * k + 5) * 3 * layer.tapSize, tg.y
										, lineWidth * 0.5, 12 * 3 * layer.tapSize, me.colors.grid);
									layer.tileRectangle(tg.g, tg.x + (8 * k + 6.5) * 3 * layer.tapSize, tg.y
										, lineWidth * 0.5, 12 * 3 * layer.tapSize, me.colors.grid);
								} else {
									if (me.options.feel == 3) {
										for (var nn = 1; nn < 8; nn++) {
											layer.tileRectangle(tg.g, tg.x + (8 * k + nn) * 3 * layer.tapSize, tg.y
												, lineWidth * 0.5, 12 * 3 * layer.tapSize, me.colors.grid);
										}
									}
								}
							}
						}*/
					}
				});
		}
	}
};
FretChordSheet.prototype.tilePianorollOctaves = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	for (var n = 0; n < 5; n++) {
		for (var i = 0; i < this.calcMeasureCount() + 1; i++) {
			var minfo=this.measureInfo(i);
			layer.renderGroup(minfo.left* 3 * layer.tapSize //this.margins.sheetLeft + i * this.options.measureLen * 3 * layer.tapSize//
				, this.margins.pianorollTop + n * 3 * 12 * layer.tapSize//
				, minfo.duration192/6* 3 * layer.tapSize //this.options.measureLen * 3 * layer.tapSize//
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
	for (var n = 0; n < 5; n++) {
		for (var i = 0; i < this.calcMeasureCount() + 1; i++) {
			var minfo=this.measureInfo(i);
			layer.renderGroup(minfo.left* 3 * layer.tapSize //this.margins.sheetLeft + i * this.options.measureLen * 3 * layer.tapSize//
				, this.margins.pianorollTop + n * 3 * 12 * layer.tapSize//
				, minfo.duration192/6* 3 * layer.tapSize //this.options.measureLen * 3 * layer.tapSize//
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

	//console.log('tileDrumRollLabels',left, top, width, height,this.margins.drumsTop,8 * 3 * layer.tapSize);
	layer.renderGroup(0//
		, this.margins.drumsTop//
		, 1//
		, 8 * 3 * layer.tapSize//
		, 'drumLabels', left, top, width, height, function (tg) {
			//console.log('drumLabels',tg);
			for (var i = 0; i < 8; i++) {
				layer.tileText(tg.g, tg.x, tg.y + tg.h - i * 3 * layer.tapSize - 0.75 * layer.tapSize, 2.1 * layer.tapSize, 'Qwerty asdf ' + i, me.colors.base);
			}

		});

}
FretChordSheet.prototype.___tileDrumRollSpot = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	layer.renderGroup(this.margins.sheetLeft //
		, this.margins.drumsTop//
		, (1 + this.calcMeasureCount()) * this.options.measureLen * 3 * layer.tapSize//
		, 8 * 3 * layer.tapSize//
		, 'drspt', left, top, width, height, function (tg) {
			/*var s = tg.layer.addSpot('drumSpot', tg.x, tg.y, tg.w, tg.h, function () {
				var x6 = me.clickedBeat();
				var y = Math.floor((me.tiler.clickContentY - me.margins.drumsTop) / (3 * me.tiler.tapSize));
				console.log('drums x6', x6, 'y', y);
			});
*/
			var s = tg.layer.addSpot('drumSpot', tg.x, tg.y, tg.w, tg.h, function () {
				var x = me.clickedBeat();
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
};

FretChordSheet.prototype.tileDrumRollSpot = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	for (var i = 0; i < this.calcMeasureCount() + 1; i++) {
		var minfo=this.measureInfo(i);
		layer.renderGroup(minfo.left* 3 * layer.tapSize //this.margins.sheetLeft + i * (this.options.measureLen + this.options.measureHeader) * 3 * layer.tapSize + this.options.measureHeader * 3 * layer.tapSize//
			, this.margins.drumsTop//
			, minfo.duration192/6* 3 * layer.tapSize //this.options.measureLen * 3 * layer.tapSize//
			, 8 * 3 * layer.tapSize//
			, 'drumsptot_' + i, left, top, width, height, function (tg) {
				//layer.tileRectangle(tg.g, tg.x, tg.y, tg.w,  tg.h,'rgba(255,0,0,0.5)');
				var s = tg.layer.addSpot('drumSpot_' + i, tg.x, tg.y, tg.w, tg.h, function () {
					var x = me.clickedMeasureBeat();
					//console.log(x);
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









/*
FretChordSheet.prototype.tilePianoSpot = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	layer.renderGroup(this.margins.sheetLeft //
		, this.margins.pianorollTop//
		, this.calcMeasureCount() * this.options.measureLen * 3 * layer.tapSize//
		, 12 * 5 * 3 * layer.tapSize//
		, 'pianospt', left, top, width, height, function (tg) {
			var s = tg.layer.addSpot('pianoSpot', tg.x, tg.y, tg.w, tg.h, function () {
				var x = me.clickedBeat();
				var y = Math.floor((me.tiler.clickContentY - me.margins.pianorollTop) / (3 * me.tiler.tapSize));
				//console.log('piano x6', x6, 'y', y);
				var tone = 0;
				var shift = 0;
				var notes = me.findNotes(tone, x.x6, x.l6, 5 * 12 - y);
				if (notes.length > 0) {
					me.userActionDropNotes(tone, x.x6, x.l6, 5 * 12 - y);
				} else {
					me.userActionAddNote(tone, x.x6, x.l6, 5 * 12 - y, shift);
				}
			});
		});
};

*/













FretChordSheet.prototype.clickedMeasureBeat = function () {
	var cellSz = 3 * this.tiler.tapSize;
	var xX = (this.tiler.clickContentX - this.margins.sheetLeft) / cellSz;

	var beatMeasure = Math.floor(xX / (this.options.measureLen + this.options.measureHeader));
	var beatQuarter = Math.floor((xX % (this.options.measureLen + this.options.measureHeader) - this.options.measureHeader) / 8);
	var remainX = xX - beatMeasure * (this.options.measureLen+ this.options.measureHeader) - beatQuarter * 8- this.options.measureHeader;
	var r6 = 0;
	var l6 = 0;
	var fl = this.feelPattern6[this.options.feel];
	for (var i = 1; i < fl.length; i++) {
		if (6 * remainX >= fl[i - 1] && 6 * remainX <= fl[i]) {
			r6 = beatMeasure * this.options.measureLen * 6 + beatQuarter * 8 * 6 + fl[i - 1];
			l6 = fl[i] - fl[i - 1];
		}
	}
	//console.log(xX, beatQuarter, beatMeasure,remainX,'r6',r6);
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
	//console.log(fl);
	for (var i = 1; i < fl.length; i++) {
		if (6 * remainX >= fl[i - 1] && 6 * remainX <= fl[i]) {
			r6 = beatMeasure * this.options.measureLen * 6 + beatQuarter * 8 * 6 + fl[i - 1];
			l6 = fl[i] - fl[i - 1];
		}
	}
	/*if (this.options.feel == 0) {
		r = Math.floor(remainX / 2);
	} else {
		if (this.options.feel == 1) {
			//r=Math.floor(remainX/6);
		} else {
			if (this.options.feel == 2) {
				r = Math.floor(remainX / 4*3);
			}
		}
	}*/
	//console.log(this.options.feel, 'beatMeasure', beatMeasure, 'beatQuarter', beatQuarter, 'remainX', remainX, 'r6', r6);
	return { x6: r6, l6: l6 };
};
FretChordSheet.prototype.tileDrumRollGrid = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	for (var i = 0; i < this.calcMeasureCount() + 1; i++) {
		var minfo=this.measureInfo(i);
		layer.renderGroup(minfo.left* 3 * layer.tapSize //this.margins.sheetLeft + i * (this.options.measureLen + this.options.measureHeader) * 3 * layer.tapSize//
			, this.margins.drumsTop//
			, minfo.duration192/6* 3 * layer.tapSize //(this.options.measureLen + this.options.measureHeader) * 3 * layer.tapSize//
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
					/*if (me.options.feel == 0) {
						for (var nn = 1; nn < 4; nn++) {
							layer.tileRectangle(tg.g, tg.x + (8 * k + nn * 2) * 3 * layer.tapSize, tg.y
								, lineWidth * 0.5, 8 * 3 * layer.tapSize, me.colors.bgCopy);
						}
					} else {
						if (me.options.feel == 2) {
							for (var nn = 1; nn < 6; nn++) {
								layer.tileRectangle(tg.g, tg.x + (8 * k + nn * 8 / 6) * 3 * layer.tapSize, tg.y
									, lineWidth * 0.5, 8 * 3 * layer.tapSize, me.colors.bgCopy);
							}
						} else {
							if (me.options.feel == 1) {
								layer.tileRectangle(tg.g, tg.x + (8 * k + 2.5) * 3 * layer.tapSize, tg.y
									, lineWidth * 0.5, 8 * 3 * layer.tapSize, me.colors.bgCopy);
								layer.tileRectangle(tg.g, tg.x + (8 * k + 5) * 3 * layer.tapSize, tg.y
									, lineWidth * 0.5, 8 * 3 * layer.tapSize, me.colors.bgCopy);
								layer.tileRectangle(tg.g, tg.x + (8 * k + 6.5) * 3 * layer.tapSize, tg.y
									, lineWidth * 0.5, 8 * 3 * layer.tapSize, me.colors.bgCopy);
							} else {
								if (me.options.feel == 3) {
									for (var nn = 1; nn < 8; nn++) {
										layer.tileRectangle(tg.g, tg.x + (8 * k + nn) * 3 * layer.tapSize, tg.y
											, lineWidth * 0.5, 8 * 3 * layer.tapSize, me.colors.bgCopy);
									}
								}
							}
						}
					}*/
				}
			});
	}
};



FretChordSheet.prototype.tileDrumRollPoints = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	for (var i = 0; i < this.calcMeasureCount(); i++) {
		var minfo=this.measureInfo(i);
		layer.renderGroup(minfo.left* 3 * layer.tapSize //this.margins.sheetLeft + i * (this.options.measureLen + this.options.measureHeader) * 3 * layer.tapSize//
			, this.margins.drumsTop//
			, minfo.duration192/6* 3 * layer.tapSize //this.options.measureLen * 3 * layer.tapSize//
			, 8 * 3 * layer.tapSize//
			, 'drpnts' + i, left, top, width, height, function (tg) {
				/*for (var k = 0; k < me.options.measureLen / 8; k++) {
					if (k > 0) {
						layer.tileRectangle(tg.g, tg.x + 8 * k * 3 * layer.tapSize, tg.y
							, lineWidth * 2, 8 * 3 * layer.tapSize, me.colors.bgCopy);
					}
					for (var nn = 1; nn < me.feelPattern6[me.options.feel].length - 1; nn++) {
						layer.tileRectangle(tg.g, tg.x + (8 * k + me.feelPattern6[me.options.feel][nn] / 6) * 3 * layer.tapSize, tg.y
							, lineWidth * 0.5, 8 * 3 * layer.tapSize, me.colors.bgCopy);
					}
				}*/
				for (var t = 0; t < me.drums.length; t++) {
					if (me.drums[t].start192 / 6 >= i * me.options.measureLen
						&& me.drums[t].start192 / 6 < (i + 1) * me.options.measureLen
					) {
						var mn = Math.floor((me.drums[t].start192 / 6) / me.options.measureLen);
						var smst = me.drums[t].start192 / 6 - mn * me.options.measureLen;
						//var tx = me.drums[t].start192 / 6 * 3 * layer.tapSize + me.margins.sheetLeft;
						var tx = smst * 3 * layer.tapSize + me.margins.sheetLeft
							+ mn * (me.options.measureLen + me.options.measureHeader) * 3 * layer.tapSize
							+ me.options.measureHeader * 3 * layer.tapSize;
						var ty = (8 - me.drums[t].kind) * 3 * layer.tapSize + me.margins.drumsTop;
						var tw = me.drums[t].len192 / 6 * 3 * layer.tapSize - 0.2 * layer.tapSize;
						//console.log(t,tx,ty, tw);
						if (tw < 1) tw = 1;
						layer.tileRectangle(tg.g, tx, ty, tw, 3 * layer.tapSize - 0.2 * layer.tapSize, me.colors.base);
						//console.log(t,tx,ty);
						/*if (tx >= tg.x
							&& tx <= tg.x + tg.w
							&& ty >= tg.y
							&& ty <= tg.y + tg.h
						) {
							layer.tileRectangle(tg.g, tx, ty, tw, 3 * layer.tapSize - 0.2 * layer.tapSize, me.colors.base);
						}*/
					}
				}
			});
	}
};







FretChordSheet.prototype.tileDrumRoll = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	for (var i = 0; i < this.calcMeasureCount() + 1; i++) {
		//console.log(this,this.margins,this.margins.drumTop);
		var minfo=this.measureInfo(i);
		layer.renderGroup(minfo.left* 3 * layer.tapSize //this.margins.sheetLeft + i * (this.options.measureLen + this.options.measureHeader) * 3 * layer.tapSize//
			, this.margins.drumsTop//
			, minfo.duration192/6* 3 * layer.tapSize //(this.options.measureLen + this.options.measureHeader) * 3 * layer.tapSize//
			, 8 * 3 * layer.tapSize//
			, 'drumbg' + i, left, top, width, height, function (tg) {
				layer.tileRectangle(tg.g, tg.x + me.options.measureHeader * 3 * layer.tapSize, tg.y
					, me.options.measureLen * 3 * layer.tapSize, 8 * 3 * layer.tapSize
					, me.colors.blackKey);
				/*for (var yy = 0; yy < 8; yy++) {
					layer.tileRectangle(tg.g, tg.x, tg.y + 3 * yy * layer.tapSize, tg.w, 2.8 * layer.tapSize, me.colors.blackKey);
				}*/
				if (i < me.calcMeasureCount()) {
					layer.tileRectangle(tg.g, tg.x + tg.w, tg.y, lineWidth, 8 * 3 * layer.tapSize, me.colors.staff);
				}
			});
	}
};


FretChordSheet.prototype.tileFretSpot = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	if (me.markFret) {
		//console.log(this.margins.sheetLeft +me.markFret.start192/6*3*layer.tapSize,this.margins.fretTop,me.markFret,left, top, width, height);
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
					//console.log('fret', x, 'y', y);
					var notes = me.findFrets(tone, x.x6, x.l6, string);
					//console.log(notes);
					if (notes.length > 0) {
						me.userActionDropFrets(tone, x.x6, x.l6, string);
					} else {
						me.markFret = { tone: tone, start192: x.x6, len192: x.l6, string: string };
						//me.markStaff = { tone: tone, start192: x.x6, len192: x.l6, pitch: po * 12 + pn, shift: shift };

					}
				});
			});
	}
};

FretChordSheet.prototype.tileFretGrid = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	for (var i = 0; i < this.calcMeasureCount() + 1; i++) {
		var minfo=this.measureInfo(i);
		layer.renderGroup(minfo.left* 3 * layer.tapSize //this.margins.sheetLeft + i * this.options.measureLen * 3 * layer.tapSize//
			, this.margins.fretTop//
			, minfo.duration192/6* 3 * layer.tapSize //this.options.measureLen * 3 * layer.tapSize//
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
					/*if (me.options.feel == 0) {
						for (var nn = 1; nn < 4; nn++) {
							layer.tileRectangle(tg.g, tg.x + (8 * k + nn * 2) * 3 * layer.tapSize, tg.y
								, lineWidth * 0.5, 6 * 3 * layer.tapSize, me.colors.grid);
						}
					} else {
						if (me.options.feel == 2) {
							for (var nn = 1; nn < 6; nn++) {
								layer.tileRectangle(tg.g, tg.x + (8 * k + nn * 8 / 6) * 3 * layer.tapSize, tg.y
									, lineWidth * 0.5, 6 * 3 * layer.tapSize, me.colors.grid);
							}
						} else {
							if (me.options.feel == 1) {
								layer.tileRectangle(tg.g, tg.x + (8 * k + 2.5) * 3 * layer.tapSize, tg.y
									, lineWidth * 0.5, 6 * 3 * layer.tapSize, me.colors.grid);
								layer.tileRectangle(tg.g, tg.x + (8 * k + 5) * 3 * layer.tapSize, tg.y
									, lineWidth * 0.5, 6 * 3 * layer.tapSize, me.colors.grid);
								layer.tileRectangle(tg.g, tg.x + (8 * k + 6.5) * 3 * layer.tapSize, tg.y
									, lineWidth * 0.5, 6 * 3 * layer.tapSize, me.colors.grid);
							} else {
								if (me.options.feel == 3) {
									for (var nn = 1; nn < 8; nn++) {
										layer.tileRectangle(tg.g, tg.x + (8 * k + nn) * 3 * layer.tapSize, tg.y
											, lineWidth * 0.5, 6 * 3 * layer.tapSize, me.colors.grid);
									}
								}
							}
						}
					}*/
				}
			});
	}
};
FretChordSheet.prototype.tilFretStrings = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	for (var i = 0; i < this.calcMeasureCount() + 1; i++) {
		var minfo=this.measureInfo(i);
		//console.log(this,this.margins,this.margins.drumTop);
		layer.renderGroup(minfo.left* 3 * layer.tapSize //this.margins.sheetLeft + i * this.options.measureLen * 3 * layer.tapSize//
			, this.margins.fretTop//
			, minfo.duration192/6* 3 * layer.tapSize //this.options.measureLen * 3 * layer.tapSize//
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

FretChordSheet.prototype.tileFretNotes = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	for (var i = 0; i < this.calcMeasureCount(); i++) {
		var minfo=this.measureInfo(i);
		layer.renderGroup(minfo.left* 3 * layer.tapSize //this.margins.sheetLeft + i * this.options.measureLen * 3 * layer.tapSize//
			, this.margins.fretTop//
			, minfo.duration192/6* 3 * layer.tapSize //this.options.measureLen * 3 * layer.tapSize//
			, 6 * 3 * layer.tapSize//
			, 'fretNotes' + i, left, top, width, height, function (tg) {



				for (var t = 0; t < me.tones.length; t++) {
					var tx = me.tones[t].start192 / 6 * 3 * layer.tapSize + me.margins.sheetLeft;
					//var ty = tg.y+tg.h-me.stringNumber(me.tones[t].pitch)* 3 * layer.tapSize;
					var st = me.stringNumber(me.tones[t].pitch);
					var ty = 6 * 3 * layer.tapSize + me.margins.fretTop - (1 + 6 - st) * 3 * layer.tapSize;
					if (tx >= tg.x
						&& tx <= tg.x + tg.w
						&& ty >= tg.y
						&& ty <= tg.y + tg.h
					) {
						//console.log(me.tones[t]);
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

FretChordSheet.prototype.tileStaffMark = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	if (me.markStaff) {
		for (var i = 0; i < this.calcMeasureCount(); i++) {
			var minfo=this.measureInfo(i);
			layer.renderGroup(minfo.left* 3 * layer.tapSize //this.margins.sheetLeft + i * this.options.measureLen * 3 * layer.tapSize//
				, this.margins.sheetTop//
				, minfo.duration192/6* 3 * layer.tapSize //this.options.measureLen * 3 * layer.tapSize//
				, 6 * 7 * 3 * layer.tapSize//
				, 'stfmrk' + i, left, top, width, height, function (tg) {
					//for (var t = 0; t < me.tones.length; t++) {
					var tx = me.markStaff.start192 / 6 * 3 * layer.tapSize + me.margins.sheetLeft;
					var ty = tg.y + tg.h - (7 * me.octave(me.markStaff.pitch) + me.note7(me.markStaff.pitch) + 1) * 3 * layer.tapSize;
					//(5 * 12 - me.tones[t].pitch - 1) * 3 * layer.tapSize + me.margins.sheetTop;
					//console.log(me.tones[t],tx,ty,left, top, width, height);
					if (tx >= tg.x
						&& tx <= tg.x + tg.w
						&& ty >= tg.y
						&& ty <= tg.y + tg.h
					) {
						//console.log(me.tones[t]);
						/*tg.layer.tileLine(tg.g
							, tx + 1.5 * layer.tapSize
							, ty + 1.5 * layer.tapSize
							, tx + 1.5 * layer.tapSize + 1//me.tones[t].len192 / 6 * 3 * layer.tapSize
							, ty + 1.5 * layer.tapSize //+ me.tones[t].shift * 3 * layer.tapSize
							, me.colors.base, 2.9 * layer.tapSize);
							*/
						tg.layer.tileCircle(tg.g, tx + 1.5 * layer.tapSize, ty + 1.5 * layer.tapSize, 1.5 * layer.tapSize, 'rgba(0,0,0,0)', me.colors.base, 0.5 * layer.tapSize);
						return;

					}
					//}
				});
		}
	}
}
FretChordSheet.prototype.tileStaffSpot = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	layer.renderGroup(this.margins.sheetLeft //
		, this.margins.sheetTop//
		, (1 + this.calcMeasureCount()) * this.options.measureLen * 3 * layer.tapSize//
		, 6 * 7 * 3 * layer.tapSize//
		, 'stffspt', left, top, width, height, function (tg) {
			var s = tg.layer.addSpot('staffSpot', tg.x, tg.y, tg.w, tg.h, function () {
				/*var x6 = me.clickedBeat();
				var y = Math.floor((me.tiler.clickContentY - me.margins.sheetTop) / (3 * me.tiler.tapSize));
				console.log('staff x6', x6, 'y', y);
				*/
				var x = me.clickedBeat();
				var y = Math.floor((me.tiler.clickContentY - me.margins.sheetTop) / (3 * me.tiler.tapSize));
				var pitch = 0;//5 * 12 - y-1;	
				var tone = 0;
				var shift = 0;
				var p = 6 * 7 - y - 1;
				var po = Math.floor(p / 7);
				var pn = me.note12(p % 7);
				console.log('tilePianoSpot', me.markStaff);
				if (me.markStaff) {
					var len = x.x6 + x.l6 - me.markStaff.start192;
					var start = me.markStaff.start192;
					pitch = me.markStaff.pitch;
					//shift = pitch - (5 * 12 - y - 1);
					if (me.markStaff.start192 > x.x6) {
						len = me.markStaff.start192 + me.markStaff.len192 - x.x6;
						start = x.x6;
						pitch = po * 12 + pn;//5 * 12 - y - 1;
						//shift = pitch - me.markStaff.pitch;


					}
					console.log('pitch', pitch);
					me.userActionAddNote(me.markStaff.tone, start, len, pitch, shift);
					me.markStaff = null;
				} else {
					var notes = me.findNotes(tone, x.x6, x.l6, po * 12 + pn);
					if (notes.length > 0) {
						me.userActionDropNotes(tone, x.x6, x.l6, po * 12 + pn);
					} else {
						me.markStaff = { tone: tone, start192: x.x6, len192: x.l6, pitch: po * 12 + pn, shift: shift };
						console.log(me.markStaff, y, po * 12 + pn);
					}
				}
			});
		});
};

FretChordSheet.prototype.tileStaffNotes = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	for (var i = 0; i < this.calcMeasureCount(); i++) {
		var minfo=this.measureInfo(i);
		layer.renderGroup(minfo.left* 3 * layer.tapSize //this.margins.sheetLeft + i * this.options.measureLen * 3 * layer.tapSize//
			, this.margins.sheetTop//
			, minfo.duration192/6* 3 * layer.tapSize //this.options.measureLen * 3 * layer.tapSize//
			, 6 * 7 * 3 * layer.tapSize//
			, 'stfnotes' + i, left, top, width, height, function (tg) {
				for (var t = 0; t < me.tones.length; t++) {
					var tx = me.tones[t].start192 / 6 * 3 * layer.tapSize + me.margins.sheetLeft;
					var ty = tg.y + tg.h - (7 * me.octave(me.tones[t].pitch) + me.note7(me.tones[t].pitch) + 1) * 3 * layer.tapSize;
					//(5 * 12 - me.tones[t].pitch - 1) * 3 * layer.tapSize + me.margins.sheetTop;
					//console.log(me.tones[t],tx,ty,left, top, width, height);
					if (tx >= tg.x
						&& tx <= tg.x + tg.w
						&& ty >= tg.y
						&& ty <= tg.y + tg.h
					) {

						me.tileNoteHead(me.tones[t].start192 / 6 - i * me.options.measureLen, 6 * 7 - (7 * me.octave(me.tones[t].pitch) + me.note7(me.tones[t].pitch)) - 1, tg);
						//console.log(me.tones[t]);
						/*tg.layer.tileLine(tg.g
							, tx + 1.5 * layer.tapSize
							, ty + 1.5 * layer.tapSize
							, tx + 1.5 * layer.tapSize + 1//me.tones[t].len192 / 6 * 3 * layer.tapSize
							, ty + 1.5 * layer.tapSize //+ me.tones[t].shift * 3 * layer.tapSize
							, '#f00', 2.9 * layer.tapSize);
*/







					}
				}
			});
	}
};


FretChordSheet.prototype.tileStaffGrid = function (left, top, width, height, layer, lineWidth) {
	var me = this;
	for (var i = 0; i < this.calcMeasureCount() + 1; i++) {
		var minfo=this.measureInfo(i);
		layer.renderGroup(minfo.left* 3 * layer.tapSize//this.margins.sheetLeft + i * this.options.measureLen * 3 * layer.tapSize//
			, this.margins.sheetTop//
			,  minfo.duration192/6* 3 * layer.tapSize //this.options.measureLen * 3 * layer.tapSize//
			, 6 * 7 * 3 * layer.tapSize//
			, 'stfgrd' + i, left, top, width, height, function (tg) {
				for (var k = 1; k < 6 * 7; k++) {
					layer.tileRectangle(tg.g, tg.x, tg.y + k * 3 * layer.tapSize
						, tg.w, lineWidth * 0.5, me.colors.grid);
				}
				for (var k = 0; k < me.options.measureLen / 8; k++) {
					//if (k > 0) {
					layer.tileRectangle(tg.g, tg.x + 8 * (1 + k) * 3 * layer.tapSize, tg.y
						, lineWidth * 2, 6 * 7 * 3 * layer.tapSize, me.colors.grid);
					//}
					//console.log('feel',me.options.feel,me.feelPattern6[me.options.feel]);
					for (var nn = 1; nn < me.feelPattern6[me.options.feel].length - 1; nn++) {
						//console.log(nn,me.feelPattern6[me.options.feel][nn]);
						layer.tileRectangle(tg.g, tg.x + (8 * k + me.feelPattern6[me.options.feel][nn] / 6) * 3 * layer.tapSize, tg.y
							, lineWidth * 0.5, 6 * 7 * 3 * layer.tapSize, me.colors.grid);
					}
					/*if (me.options.feel == 0) {
						for (var nn = 1; nn < 4; nn++) {
							layer.tileRectangle(tg.g, tg.x + (8 * k + nn * 2) * 3 * layer.tapSize, tg.y
								, lineWidth * 0.5, 6 * 7 * 3 * layer.tapSize, me.colors.grid);
						}
					} else {
						if (me.options.feel == 2) {
							for (var nn = 1; nn < 6; nn++) {
								layer.tileRectangle(tg.g, tg.x + (8 * k + nn * 8 / 6) * 3 * layer.tapSize, tg.y
									, lineWidth * 0.5, 6 * 7 * 3 * layer.tapSize, me.colors.grid);
							}
						} else {
							if (me.options.feel == 1) {
								layer.tileRectangle(tg.g, tg.x + (8 * k + 2.5) * 3 * layer.tapSize, tg.y
									, lineWidth * 0.5, 6 * 7 * 3 * layer.tapSize, me.colors.grid);
								layer.tileRectangle(tg.g, tg.x + (8 * k + 5) * 3 * layer.tapSize, tg.y
									, lineWidth * 0.5, 6 * 7 * 3 * layer.tapSize, me.colors.grid);
								layer.tileRectangle(tg.g, tg.x + (8 * k + 6.5) * 3 * layer.tapSize, tg.y
									, lineWidth * 0.5, 6 * 7 * 3 * layer.tapSize, me.colors.grid);
							} else {
								if (me.options.feel == 3) {
									for (var nn = 1; nn < 8; nn++) {
										layer.tileRectangle(tg.g, tg.x + (8 * k + nn) * 3 * layer.tapSize, tg.y
											, lineWidth * 0.5, 6 * 7 * 3 * layer.tapSize, me.colors.grid);
									}
								}
							}
						}
					}*/
				}
			});
	}
};



FretChordSheet.prototype.tileStaff = function (left, top, width, height, layer, lineWidth) {
	//console.log(this.sheetTop, this.sheetLeft,this.margins.measureLen*3*layer.tapSize, this.contentHeight);
	var me = this;
	var sk = 57;
	for (var i = 0; i < this.calcMeasureCount() + 1; i++) {
		var minfo=this.measureInfo(i);
		layer.renderGroup(minfo.left* 3 * layer.tapSize //this.margins.sheetLeft + i * this.options.measureLen * 3 * layer.tapSize//
			, this.margins.sheetTop//
			, minfo.duration192/6* 3 * layer.tapSize //this.options.measureLen * 3 * layer.tapSize//
			, 6 * 7 * 3 * layer.tapSize//
			, 'stff' + i, left, top, width, height, function (tg) {

				layer.tileRectangle(tg.g, tg.x, tg.y + (31.5 + 6 * 0) * layer.tapSize, tg.w, lineWidth, me.colors.staff);
				layer.tileRectangle(tg.g, tg.x, tg.y + (31.5 + 6 * 1) * layer.tapSize, tg.w, lineWidth, me.colors.staff);
				layer.tileRectangle(tg.g, tg.x, tg.y + (31.5 + 6 * 2) * layer.tapSize, tg.w, lineWidth, me.colors.staff);
				layer.tileRectangle(tg.g, tg.x, tg.y + (31.5 + 6 * 3) * layer.tapSize, tg.w, lineWidth, me.colors.staff);
				layer.tileRectangle(tg.g, tg.x, tg.y + (31.5 + 6 * 4) * layer.tapSize, tg.w, lineWidth, me.colors.staff);

				layer.tileRectangle(tg.g, tg.x, tg.y + (31.5 + sk + 6 * 0) * layer.tapSize, tg.w, lineWidth, me.colors.staff);
				layer.tileRectangle(tg.g, tg.x, tg.y + (31.5 + sk + 6 * 1) * layer.tapSize, tg.w, lineWidth, me.colors.staff);
				layer.tileRectangle(tg.g, tg.x, tg.y + (31.5 + sk + 6 * 2) * layer.tapSize, tg.w, lineWidth, me.colors.staff);
				layer.tileRectangle(tg.g, tg.x, tg.y + (31.5 + sk + 6 * 3) * layer.tapSize, tg.w, lineWidth, me.colors.staff);
				layer.tileRectangle(tg.g, tg.x, tg.y + (31.5 + sk + 6 * 4) * layer.tapSize, tg.w, lineWidth, me.colors.staff);
				if (i < me.calcMeasureCount()) {
					layer.tileRectangle(tg.g, tg.x + tg.w, tg.y + (31.5 + 6 * 0) * layer.tapSize, lineWidth, 81 * layer.tapSize, me.colors.staff);
				}

			});
	}
};
FretChordSheet.prototype.__tileStaff = function (left, top, width, height, layer, lineWidth) {
	//console.log(layer);
	var me = this;
	layer.renderGroup(this.sheetTop, this.sheetLeft, this.calcContentWidth(), this.contentHeight, 'stff', left, top, width, height, function (tg) {

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
		var cw = this.calcContentWidth();
		layer.tileRectangle(tg.g, me.margins.sheetLeft, me.margins.sheetTop + 6 * 0 * layer.tapSize, cw, lineWidth, me.colors.base);
		layer.tileRectangle(tg.g, me.margins.sheetLeft, me.margins.sheetTop + 6 * 1 * layer.tapSize, cw, lineWidth, me.colors.base);
		layer.tileRectangle(tg.g, me.margins.sheetLeft, me.margins.sheetTop + 6 * 2 * layer.tapSize, cw, lineWidth, me.colors.base);
		layer.tileRectangle(tg.g, me.margins.sheetLeft, me.margins.sheetTop + 6 * 3 * layer.tapSize, cw, lineWidth, me.colors.base);
		layer.tileRectangle(tg.g, me.margins.sheetLeft, me.margins.sheetTop + 6 * 4 * layer.tapSize, cw, lineWidth, me.colors.base);
		var sk = 51.5;
		layer.tileRectangle(tg.g, me.margins.sheetLeft, me.margins.sheetTop + (sk + 6 * 0) * layer.tapSize, cw, lineWidth, me.colors.base);
		layer.tileRectangle(tg.g, me.margins.sheetLeft, me.margins.sheetTop + (sk + 6 * 1) * layer.tapSize, cw, lineWidth, me.colors.base);
		layer.tileRectangle(tg.g, me.margins.sheetLeft, me.margins.sheetTop + (sk + 6 * 2) * layer.tapSize, cw, lineWidth, me.colors.base);
		layer.tileRectangle(tg.g, me.margins.sheetLeft, me.margins.sheetTop + (sk + 6 * 3) * layer.tapSize, cw, lineWidth, me.colors.base);
		layer.tileRectangle(tg.g, me.margins.sheetLeft, me.margins.sheetTop + (sk + 6 * 4) * layer.tapSize, cw, lineWidth, me.colors.base);


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
	var tg = layer.tileGroup(0, 0, this.calcContentWidth(), this.contentHeight, 'brGrid' + n, left, top, width, height);
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
/*
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
}*/
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
	//console.log(v,(v-Math.floor(mx/2))/mx,v-Math.floor(mx/2));
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
	//console.log(tg, id, x, y, sz, label);
	tg.layer.tileCircle(tg.g, tg.x + x + sz / 2, tg.y + y + sz / 2, sz / 2, this.colors.buttonFill);
	tg.layer.tileText(tg.g, tg.x + x + sz / 4, tg.y + y + 0.8 * sz, 0.025 * sz * tg.layer.tapSize, label, this.colors.buttonLabel);
	tg.layer.addSpot(id, tg.x + x, tg.y + y, sz, sz, action);
};
FretChordSheet.prototype.tileNoteHead = function (x, y, tg) {
	tg.layer.tilePath(tg.g, tg.x + x * 3 * tg.layer.tapSize + 0.5 * tg.layer.tapSize, tg.y + (y * 3 - 0.5) * tg.layer.tapSize
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

