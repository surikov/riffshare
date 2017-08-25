RiffShare2D.prototype.addLargeTiles = function (xx, yy, ww, hh, detailRatio) {
	this.tileSongTitleMenu(this.largetitles, xx, yy, ww, hh, detailRatio);
	this.tileHugeSongOptions(this.largetitles, xx, yy, ww, hh, detailRatio);
	this.tileHugeSongTitle(this.largetracknames, xx, yy, ww, hh, detailRatio);
	this.tileSongTexts(this.largetitles, xx, yy, ww, hh);
	this.tileHugeTracksTitles(this.largetracknames, xx, yy, ww, hh, detailRatio);
	this.tileHugeTracksOptions(this.largetitles, xx, yy, ww, hh, detailRatio);
	//this.tileTracksTitles(this.largetracknames, xx, yy, ww, hh);
	this.tileMarkers(this.largetitles, xx, yy, ww, hh);
	this.tileLargeMeasureLines(this.largeborders, xx, yy, ww, hh, detailRatio);
	this.tileOctaveLines(this.largeborders, xx, yy, ww, hh, detailRatio);

	this.tileScoreLines(this.largeborders, xx, yy, ww, hh, detailRatio);
	this.tileStrings(this.largesymbols, xx, yy, ww, hh, detailRatio);
	this.tileFretMotifs(this.largesymbols, xx, yy, ww, hh, detailRatio);
	this.tileChordMotifs(this.largesymbols, xx, yy, ww, hh, detailRatio);
	this.tileSheetMotifs(this.largesymbols, xx, yy, ww, hh, detailRatio);
	this.tileSheetClefs(this.largesymbols, xx, yy, ww, hh, detailRatio);

	this.tileRollOctaves(this.largesymbols, this.largeshadow, xx, yy, ww, hh, detailRatio);
	//this.tileHugeTrackControls(this.largespots, xx, yy, ww, hh, detailRatio);

	//this.tileMainMenu(this.largespots, xx, yy, ww, hh, detailRatio);
	this.tilePianoRollMenu(this.largetitles, xx, yy, ww, hh, detailRatio);

	this.tileNewMeasureButton(this.largetitles, xx, yy, ww, hh, detailRatio);
};
/*
RiffShare2D.prototype.tileSongTitle = function (layer, left, top, width, height, ratio) {
var x = this.marginLeft * this.tapSize;
var y = this.marginTop * this.tapSize;
var w = this.songWidth32th();
var h = this.heightSongTitle * this.tapSize;
var lw = 2 * this.lineWidth * ratio;
var id = 'songTitleL';
var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
if (g) {
//this.tileText(g, x, y + h, 33 * this.tapSize, this.currentSong.name, this.colorComment);
this.addButton(id, this.currentSong.name, h / 1, g, 1 * (1.2 * h) + x, y, h, true //, lw //, function () {
var r = prompt('Song title', riffShare2d.currentSong.name);
if (r) {
riffShare2d.currentSong.name = r;
}
});


//console.log('lw',lw);
this.addButton('btMenSng', 'Options', h/3 , g, x, y, h, true //, lw //, null,0.9*this.minZoomLarge);
}
}*/
RiffShare2D.prototype.tileSongTitleMenu = function (layer, left, top, width, height, ratio) {
	var x = this.marginLeft * this.tapSize;
	var y = this.marginTop * this.tapSize;
	var w = this.songWidth32th();
	var h = this.heightSongTitle * this.tapSize;
	var id = 'sngTitleMe';
	var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
	/*if (g) {
	this.tileCircle(g, x + h / 2, y + h / 2, h / 2, this.colorAction);
	this.addSpot('tileSongTitleMenu', x, y, h, h, function () {
	var r = prompt('Song title', riffShare2d.currentSong.name);
	if (r) {
	riffShare2d.currentSong.name = r;
	}
	//riffShare2d.resetAllLayersNow();
	});
	}*/
	var lw = 2 * this.lineWidth * ratio;
	x = 0;
	w = this.marginLeft * this.tapSize;
	id = 'sngOpts';
	/*var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
	if (g) {
	this.tileRectangle(g, x + 4 * this.tapSize, y, w - 8 * this.tapSize, h - 4 * this.tapSize, 'none', this.colorAction, lw, 4 * this.tapSize);
	}*/

};

RiffShare2D.prototype._____tileTracksSelectors = function (layer, left, top, width, height, ratio) {
	for (var i = 0; i < this.currentSong.channels.length; i++) {
		this.tileOneTrackSelector(i, layer, left, top, width, height, ratio);
	}
};
RiffShare2D.prototype.tileOneMeasureNum = function (g,x,y,n) {
	this.addZoomAnchor('measureNum_' + x+'x'+y, '' + n, g, x - 1*this.tapSize, y, 5 * this.tapSize, 0.9 * this.minZoomMedium);
};
RiffShare2D.prototype.tileOneMeasureLine = function (layer, i, left, top, width, height, ratio) {
	var changes = this.positionOptionsChanges();
	var x = this.calculateMeasureX(i, changes);
	var w = this.measureWidth32th(i, changes);
	for (var n = 0; n < this.currentSong.channels.length; n++) {
		if (!(this.currentSong.channels[n].hideTrackSheet)) {
			var y = this.calculateTrackSheetY(n) + (0.5 + this.marginTrSheetLines - 4) * this.tapSize;
			var h = (4 + 2 * 4) * this.tapSize;
			var id = 'ln' + i + 'x' + x + 'x' + y;
			var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
			if (g) {
				//this.tileText(g, x + 3 * this.tapSize, y - 7 * this.tapSize, 5 * this.tapSize, '' + (1 + i), this.colorBase);
				this.tileRectangle(g, x, y + 4 * this.tapSize, this.lineWidth * ratio, h - 4 * this.tapSize, this.colorBase);
				this.tileOneMeasureNum(g, x, y,1 + i);
			}
		}
		if (!(this.currentSong.channels[n].hideTrackFret)) {
			var y = this.calculateTrackFretY(n) - 1 * this.tapSize;
			var h = (3 + 2 * this.currentSong.channels[n].string.length) * this.tapSize;
			var id = 'frl' + i + 'x' + x + 'x' + y;
			var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
			if (g) {
				//this.tileText(g, x, y, 5 * this.tapSize, '' + (1 + i), this.colorBase);
				this.tileOneMeasureNum(g, x, y,1 + i);
				this.tileRectangle(g, x, y + 1 * this.tapSize, this.lineWidth * ratio, h - 4 * this.tapSize, this.colorBase);
			}
		}
	}
	if (!(this.currentSong.hideRoll)) {
		var y = this.calculateRollGridY();
		var h = 128 * this.tapSize;
		var id = 'rlli' + i;
		var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
		if (g) {
			this.tileRectangle(g, x, y, this.lineWidth * ratio, h, this.colorBase);
			this.tileOneMeasureNum(g, x, y,1 + i);
			//this.addZoomAnchor('btMenMsrRl' + i, '' + (1 + i), g, x + this.tapSize, y, 10 * this.tapSize, 0.9 * this.minZoomMedium);
		}
	}
};
RiffShare2D.prototype.tileLargeMeasureLines = function (layer, left, top, width, height, ratio) {
	//var y=this.calculateTrackY(0);
	//var h=this.calculateAllTracksHeight()+this.calculateRollHeight();
	for (var i = 0; i < this.currentSong.positions.length; i++) {
		this.tileOneMeasureLine(layer, i, left, top, width, height, ratio);
		/*var x=this.calculateMeasureX(i);
		var w=this.measureWidth32th(i);
		var id = 'ln' + i + 'x' + x + 'x' + y;
		var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
		if (g) {
		this.tileText(g, x, y, 3 * this.tapSize, '' + (1 + i), this.colorComment);
		this.tileRectangle(g, x, y, this.lineWidth * ratio, h, this.colorComment);
		}*/
	}
};
RiffShare2D.prototype.tileOctaveLines = function (layer, left, top, width, height, ratio) {
	if (!riffShare2d.currentSong.hideRoll) {
		var x = this.marginLeft * this.tapSize;
		var w = this.songWidth32th();
		var h = this.lineWidth * ratio;
		for (var i = 12; i < 128; i = i + 12) {
			//y = (this.marginTop + this.heightSongTitle + this.heightSongText + this.calculateAllTracksHeight() + this.heightPRTitle + this.heightPRGrid - i) * this.tapSize;
			y = this.calculateRollGridY() + (this.heightPRGrid - i) * this.tapSize;
			var id = 'octa' + i;
			var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
			if (g) {
				this.tileRectangle(g, x, y, w, h, this.colorBase);
			}
		}
	}
};
RiffShare2D.prototype.tileScoreLines = function (layer, left, top, width, height, ratio) {
	var x = this.marginLeft * this.tapSize;
	//var y = this.//(this.marginTop + this.heightSongTitle + this.heightSongText) * this.tapSize;
	var w = this.songWidth32th();
	//var h = this.lineWidth * ratio;
	var h = this.heightTrSheet * this.tapSize
		for (var i = 0; i < this.currentSong.channels.length; i++) {
			if (!(this.currentSong.channels[i].hideTrackSheet)) {
				var y = this.calculateTrackSheetY(i);
				var id = 'sco' + i;
				var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
				if (g) {
					for (var s = 0; s < 5; s++) {
						//this.tileRectangle(g, x, y + (0.5 + s * 2 + this.heightTrTitle + this.marginTrSheetLines) * this.tapSize, w, h, this.colorComment);
						this.tileRectangle(g, x, y + (0.5 + this.marginTrSheetLines + 2 * s) * this.tapSize, w, this.lineWidth * ratio, this.colorBase);
					}
				}
			}
			//y = y + this.calculateTrackHeight(i) * this.tapSize;
		}
};
RiffShare2D.prototype.tileStrings = function (layer, left, top, width, height, ratio, active) {
	var x = this.marginLeft * this.tapSize;
	//var y = (this.marginTop + this.heightSongTitle + this.heightSongText) * this.tapSize;
	var w = this.songWidth32th();
	var clr = this.colorBase;
	if (active) {
		clr = this.colorHot;
	}
	for (var i = 0; i < this.currentSong.channels.length; i++) {
		if (!(this.currentSong.channels[i].hideTrackFret)) {
			var y = this.calculateTrackFretY(i);
			var h = (2 * this.currentSong.channels[i].string.length + 1) * this.tapSize;
			var id = 'str' + i;
			var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
			if (g) {
				for (var s = 0; s < this.currentSong.channels[i].string.length; s++) {
					this.tileRectangle(g, x, y + (0.5 + 2 * s) * this.tapSize, w, this.lineWidth * ratio, clr);
				}
			}
		}
		//y = y + this.calculateTrackHeight(i) * this.tapSize;
	}
};
RiffShare2D.prototype.tileFretMotifs = function (layer, left, top, width, height, ratio) {
	var x = this.marginLeft * this.tapSize;
	//var y = (this.marginTop + this.heightSongTitle + this.heightSongText) * this.tapSize;
	var w = this.songWidth32th();
	var changes = this.positionOptionsChanges();
	for (var i = 0; i < this.currentSong.channels.length; i++) {
		if (!(riffShare2d.currentSong.channels[i].hideTrackFret)) {
			var channel = this.currentSong.channels[i];
			var h = 2 * this.currentSong.channels[i].string.length * this.tapSize;
			//y=y+(this.heightTrTitle+this.heightTrSheet+this.heightTrChords+this.heightTrText) * this.tapSize;
			y = this.calculateTrackFretY(i);
			if (this.collision(x, y, w, h, left, top, width, height)) {
				//console.log('fret',i);
				//this.tilePlaceHolder(x, y, w, h, '_fch' + i, layer, left, top, width, height, 1);
				for (var k = 0; k < this.currentSong.positions.length; k++) {
					var posX = this.calculateMeasureX(k, changes);
					var posW = this.measureWidth32th(k, changes);
					if (this.collision(posX, y, posW, h, left, top, width, height)) {
						var position = this.currentSong.positions[k];
						for (var n = 0; n < position.motifs.length; n++) {
							var motif = position.motifs[n];
							if (motif.channel == channel.id) {
								//var id = 'fretPos' + motif.channel + 'x' + motif.motif;
								var id = 'fretPos' + channel.id + 'x' + motif.motif + 'x' + position.order;
								var offset = channel.offset; //+this.cleffOffset(motif.clef);
								var g = this.rakeGroup(posX, y, posW, h, id, layer, left, top, width, height);
								if (g) {
									var data = this.findMotifById(motif.motif);
									//console.log(i,k,data);
									if (data.chords.length > 0) {
										for (var c = 0; c < data.chords.length; c++) {
											var chord = data.chords[c];
											for (var n = 0; n < chord.notes.length; n++) {
												var note = chord.notes[n];
												if (note.key > 0 && note.l6th > 0) {
													//console.log(note);
													if (!(note.string > 0)) {
														note.string = 1;
													}
													var t = note.key - offset - this.channelStringKey(note.string, channel);
													var colordeep = this.fretLineColor(t);
													var ny = y + this.tapSize * 2 * (channel.string.length - 1) - this.tapSize * 2 * (channel.string.length - note.string) + this.tapSize * 0.5;
													var nx = posX + this.measureMargin(k, changes) + chord.start * this.cellWidth * this.tapSize * this.cellDurationRatio() + this.tapSize * 1;
													this.tileLine(g, nx, ny, nx + 1 + this.tapSize * (this.cellWidth * note.l6th * this.cellDurationRatio() - 2), ny, colordeep, this.tapSize * 1.9);
													this.tileText(g, nx - 0.65 * this.tapSize, ny + 0.65 * this.tapSize, 2.2 * this.tapSize, '' + t, '#fff', colordeep, this.tapSize / 50); //, 'Oswald, sans-serif', 'normal');
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
		}
	}
};

RiffShare2D.prototype.tileChordMotifs = function (layer, left, top, width, height, ratio) {
	var x = this.marginLeft * this.tapSize;
	var w = this.songWidth32th();
	var changes = this.positionOptionsChanges();
	for (var i = 0; i < this.currentSong.channels.length; i++) {
		if (!(riffShare2d.currentSong.channels[i].hideTrackChords)) {
			var channel = this.currentSong.channels[i];
			var h = 2 * this.currentSong.channels[i].string.length * this.tapSize;
			y = this.calculateTrackChordsY(i);
			if (this.collision(x, y, w, h, left, top, width, height)) {
				//console.log(i,'tileChordMotifs');

				for (var k = 0; k < this.currentSong.positions.length; k++) {
					var posX = this.calculateMeasureX(k, changes);
					var posW = this.measureWidth32th(k, changes);
					if (this.collision(posX, y, posW, h, left, top, width, height)) {
						var position = this.currentSong.positions[k];
						for (var n = 0; n < position.motifs.length; n++) {
							var motif = position.motifs[n];
							if (motif.channel == channel.id) {
								var id = 'chrdPos' + channel.id + 'x' + motif.motif + 'x' + position.order;
								var offset = channel.offset; //+this.cleffOffset(motif.clef);
								var g = this.rakeGroup(posX, y, posW, h, id, layer, left, top, width, height);
								if (g) {
									var data = this.findMotifById(motif.motif);
									if (data.chords.length > 0) {
										for (var c = 0; c < data.chords.length; c++) {
											var chord = data.chords[c];
											var nx = posX + this.measureMargin(k, changes) + chord.start * this.cellWidth * this.tapSize * this.cellDurationRatio() + this.tapSize * 1;
											if (chord.name) {
												console.log(chord.name);
												this.tileText(g, nx - 0.2 * this.tapSize, y + h - 3 * this.tapSize, 3.9 * this.tapSize, chord.name, this.colorAux);
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
	}
};

RiffShare2D.prototype.__tileSheetStairsMotifs = function (g, x, y, chords, layer, left, top, width, height, ratio, offset) {
	for (var c = 0; c < chords.length; c++) {
		var chord = chords[c];
		var minNote = 129;
		var maxNote = -1;
		for (var n = 0; n < chord.notes.length; n++) {
			var note = chord.notes[n];
			var py = this.pitch12to7(note.key - offset);
			if (py < minNote) {
				minNote = py;
			}
			if (py > maxNote) {
				maxNote = py;
			}
		}
		var linesY = y + (0.5 + this.marginTrSheetLines + 2 * 5) * this.tapSize;
		/*var nx = x + chord.start * this.cellWidth * this.tapSize + this.tapSize * this.cellWidth * 0.5;
		var ny=linesY-this.tapSize * minNote+this.tapSize * 28;
		this.tileEllipse(g, nx, ny, this.tapSize * 0.75 * this.cellWidth, this.tapSize * 0.9, '#ff0000');
		ny=linesY-this.tapSize * maxNote+this.tapSize * 28;
		this.tileEllipse(g, nx, ny, this.tapSize * 0.75 * this.cellWidth, this.tapSize * 0.9, '#ff00ff');*/
		lowStair = 28;
		ny = linesY - this.tapSize * lowStair + this.tapSize * 28;
		this.tileRectangle(g, x, ny, 7.5 * this.tapSize, this.lineWidth * ratio, '#009999');
		highStair = 28 + 12;
		ny = linesY - this.tapSize * highStair + this.tapSize * 28;
		this.tileRectangle(g, x, ny, 7.5 * this.tapSize, this.lineWidth * ratio, '#99ff33');
	}
};
RiffShare2D.prototype.findStartMM = function (start, minMax) {
	for (var i = 0; i < minMax.length; i++) {
		if (minMax[i].start == start) {
			return i;
		}
	}
	minMax.push({
		start: start,
		mn: 128,
		mx: -1
	});
	return minMax.length - 1;
};
RiffShare2D.prototype.createMinMax = function (chords, offset) {
	var minMax = [];
	for (var c = 0; c < chords.length; c++) {
		var chord = chords[c];
		var mm = minMax[this.findStartMM(chord.start, minMax)];
		for (var n = 0; n < chord.notes.length; n++) {
			var note = chord.notes[n];
			if (note.key > 0 && note.l6th > 0) {
				mm.l6th = note.l6th;
				var ny = this.pitch12to7(note.key - offset);
				if (ny < mm.mn) {
					mm.mn = ny;
				}
				if (ny > mm.mx) {
					mm.mx = ny;
				}
			}
		}
	}
	return minMax;
};
RiffShare2D.prototype.tileNoteStick = function (g, x, ratio, mm, linesY) {
	if (mm.l6th <= 4) {
		var lh = this.tapSize * (mm.mx - mm.mn + 7);
		var lw = this.lineWidth * ratio * 4;
		var ry = this.tapSize * 0.9;
		var rx = ry * 1.5;
		//var nx = x + mm.start * this.cellWidth * this.tapSize + this.tapSize * this.cellWidth *(0.5+0.45)-lw ;
		var nx = x + mm.start * this.cellWidth * this.tapSize * this.cellDurationRatio() + this.tapSize * this.cellWidth / 2 + rx - lw;
		var ny = linesY - this.tapSize * mm.mn + this.tapSize * 28;

		this.tileRectangle(g, nx, ny - lh, lw, lh, this.colorBase);
		var cnt = 0;
		if (mm.l6th == 0.25) {
			cnt = 4;
		} else {
			if (mm.l6th == 0.5) {
				cnt = 3;
			} else {
				if (mm.l6th == 1) {
					cnt = 2;
				} else {
					if (mm.l6th == 2) {
						cnt = 1;
					} else {
						/*if (mm.l6th == 4) {
						cnt = 0.5;
						} else {
						if (mm.l6th == 8) {
						cnt = 0.25;
						} else {
						console.log(mm);
						}
						}*/
						//console.log(mm);
					}
				}
			}
		}
		//cnt=cnt*2;
		var liWi = 4 * this.lineWidth * ratio;
		for (var i = 0; i < cnt; i++) {
			var y = ny - lh + i * 0.75 * this.tapSize;
			//this.tileLine(g, nx+liWi/2, y+liWi/2, nx + 2 * this.tapSize, y + this.tapSize, this.colorMain, liWi);
			this.tileNoteTail(g, this.colorBase, nx + liWi / 2, y + liWi / 2);
			//this.tileLine(g, nx+liWi/2, y+liWi/2, nx + 2 * this.tapSize, y + this.tapSize, '#ff0000', liWi);
		}
	}
};
RiffShare2D.prototype.tileSheetStairsMotifs = function (g, x, y, chords, ratio, offset) {
	var linesY = y + this.linesYshift();
	var minMax = this.createMinMax(chords, offset);

	for (var i = 0; i < minMax.length; i++) {
		var mm = minMax[i];
		var nx = x + mm.start * this.cellWidth * this.tapSize * this.cellDurationRatio();
		if (mm.mn <= this.lowStair) {
			for (var s = this.lowStair; s >= mm.mn; s = s - 2) {
				var ny = linesY - this.tapSize * s + this.tapSize * 28;
				this.tileRectangle(g, nx, ny, this.cellWidth * this.tapSize * 0.9, this.lineWidth * ratio, this.colorBase);
			}
		}
		if (mm.mx >= this.highStair) {
			for (var s = this.highStair; s <= mm.mx; s = s + 2) {
				var ny = linesY - this.tapSize * s + this.tapSize * 28;
				this.tileRectangle(g, nx, ny, this.cellWidth * this.tapSize * 0.9, this.lineWidth * ratio, this.colorBase);
			}
		}

		this.tileNoteStick(g, x, ratio, mm, linesY);
	}
};
RiffShare2D.prototype.tileLargeTempo = function (g, x, y, position) {
	this.addSimpleButton('bpmButn', '', g, x + 7 * this.tapSize, y + 2 * this.tapSize, 4 * this.tapSize, function () {
		riffShare2d.promptMeasureBPM(position);
	});
	this.tileText(g, x + 9 * this.tapSize, y + 5 * this.tapSize, 3 * this.tapSize, '&nbsp;&nbsp;=' + position.tempo, this.colorBase);
	this.tileText(g, x + 9 * this.tapSize, y + 5 * this.tapSize, 3 * this.tapSize, '&#0113;', this.colorBase, null, null, 'ttfPe', null);
};
RiffShare2D.prototype.tileLargeClef = function (g, x, y, clef) {
	if (clef == 1) { //treble G4
		this.tileText(g, x + 5 * this.tapSize, y + 20.5 * this.tapSize, 9 * this.tapSize, '&#0038;', this.colorBase, null, null, 'ttfPe', null);
	} else {
		if (clef == 2) { //bass F3
			this.tileText(g, x + 5 * this.tapSize, y + 16.5 * this.tapSize, 9 * this.tapSize, '&#0063;', this.colorBase, null, null, 'ttfPe', null);
		} else {
			if (clef == 3) { //alto C4
				this.tileText(g, x + 5 * this.tapSize, y + 18.5 * this.tapSize, 8 * this.tapSize, '&#0066;', this.colorBase, null, null, 'ttfPe', null);
			} else {
				if (clef == 4) { //alto C4
					this.tileText(g, x + 5 * this.tapSize, y + 16.5 * this.tapSize, 8 * this.tapSize, '&#0066;', this.colorBase, null, null, 'ttfPe', null);
				} else {//unknown
					if (clef == 5) { //drums
						this.tileText(g, x + 5 * this.tapSize, y + 18.5 * this.tapSize, 8 * this.tapSize, '&#0214;', this.colorBase, null, null, 'ttfPe', null);
					} else {//unknown
						this.tileText(g, x + 5 * this.tapSize, y + 20.5 * this.tapSize, 8 * this.tapSize, '?', this.colorBase);
					}
				}
			}
		}
	}
};
/*
RiffShare2D.prototype.clefSymbol = function (clef) {
if(clef==2){
return '&#0063;';//f
}
if(clef==3){
return '&#0066;';//tr
}
return '&#0038;';//g
}*/
RiffShare2D.prototype.tileSheetClefs = function (layer, left, top, width, height, ratio) {
	var x = this.marginLeft * this.tapSize;
	var w = this.songWidth32th();
	var changes = this.positionOptionsChanges();
	for (var i = 0; i < this.currentSong.channels.length; i++) {
		if (!(riffShare2d.currentSong.channels[i].hideTrackSheet)) {
			var channel = this.currentSong.channels[i];
			var h = this.heightTrSheet * this.tapSize;
			var y = this.calculateTrackSheetY(i);
			if (this.collision(x, y, w, h, left, top, width, height)) {
				for (var k = 0; k < this.currentSong.positions.length; k++) {
					if (changes[k] || k == 0) {
						var position = this.currentSong.positions[k];
						var posX = this.calculateMeasureX(k, changes);
						var posW = this.measureWidth32th(k, changes);
						var id = 'clefPos' + channel.id + 'x' + position.order;
						var g = this.rakeGroup(posX, y, posW, h, id, layer, left, top, width, height);
						if (g) {
							var mInP = this.findMotifInPosByChannel(position.motifs, channel.id);
							this.tileLargeTempo(g, posX, y, position);

							/*
							this.tileText(g, posX + 5 * this.tapSize, y + (0 + 14) * this.tapSize, 7 * this.tapSize //, 'tempo' + position.tempo //, this.colorAux);
							 */
							 /*
							this.tileText(g, posX + 15 * this.tapSize, y + (7 + 14) * this.tapSize, 7 * this.tapSize //
							, '' + position.meter + '/' + position.by //
							, this.colorAux);
							*/
							this.tileText(g, posX + 15 * this.tapSize, y + 18 * this.tapSize, 4 * this.tapSize , '' + position.meter , this.colorBase);
							this.tileText(g, posX + 15 * this.tapSize, y + 21.5 * this.tapSize, 4 * this.tapSize , '' + position.by , this.colorBase);
							if (mInP) {
								/*
								this.tileText(g, posX + 5 * this.tapSize, y + (14 + 14) * this.tapSize, 7 * this.tapSize //, 'clef' + mInP.clef + ':sign' + mInP.sign //, this.colorAux);
								 */

								this.tileLargeClef(g, posX, y, mInP.clef);
							}
						}
					}
				}
			}
		}
	}
};
RiffShare2D.prototype.tileSheetMotifs = function (layer, left, top, width, height, ratio) {
	var x = this.marginLeft * this.tapSize;
	var w = this.songWidth32th();
	var changes = this.positionOptionsChanges();
	for (var i = 0; i < this.currentSong.channels.length; i++) {
		if (!(riffShare2d.currentSong.channels[i].hideTrackSheet)) {
			var channel = this.currentSong.channels[i];
			var h = this.heightTrSheet * this.tapSize;
			var y = this.calculateTrackSheetY(i);
			//var linesY = y + (0.5 + this.marginTrSheetLines + 2 * 5) * this.tapSize;
			var linesY = y + this.linesYshift();
			if (this.collision(x, y, w, h, left, top, width, height)) {
				for (var k = 0; k < this.currentSong.positions.length; k++) {
					var posX = this.calculateMeasureX(k, changes);
					var posW = this.measureWidth32th(k, changes);
					//this.tilePlaceHolder(posX, y, posW, h, '_' + posX+"-"+y, layer, left, top, width, height, 1);
					if (this.collision(posX, y, posW, h, left, top, width, height)) {
						var position = this.currentSong.positions[k];

						//var motif = this.findPositionMotifByChannel(position, channel.id);
						//if (motif) {
						var motifs = this.findPositionMotifByChannel(position, channel.id);
						for (var mi = 0; mi < motifs.length; mi++) {
							var motif = motifs[mi];
							//console.log(motif);
							//for (var n = 0; n < position.motifs.length; n++) {
							//var motif = position.motifs[n];
							//if (motif.channel == channel.id) {
							//var id = 'sheetPos' + motif.channel + 'x' + motif.motif;
							var id = 'sheetPos' + channel.id + 'x' + motif.motif + 'x' + position.order;
							var offset = channel.offset + this.cleffOffset(motif.clef);
							//this.tileRectangle(layer, posX, y, posW, h, 'rgba(0,0,110,0.5)', 'rgba(0,110,110,0.5)',15*this.lineWidth *ratio);
							/*if(this.childExists(id, layer)){
							console.log(id,'exists');
							}*/
							var g = this.rakeGroup(posX, y, posW, h, id, layer, left, top, width, height);
							if (g) {

								var data = this.findMotifById(motif.motif);
								if (data.chords.length > 0) {
									//var lines = [];
									//if(i==3 && k==5){
									//console.log(y,data.chords);
									//this.tileSheetStairsMotifs(g, posX + this.measureMargin(k), y-this.tapSize, data.chords, ratio, offset);
									//}else{
									//this.tileSheetStairsMotifs(g,posX + this.measureMargin(k), y, data.chords, layer, left, top, width, height, ratio, offset);

									//}
									this.tileSheetStairsMotifs(g, posX + this.measureMargin(k, changes), y, data.chords, ratio, offset);
									//this.tileRectangle(g, posX, y, posW, h, 'rgba(0,0,110,0.5)', 'rgba(0,110,110,0.5)',15*this.lineWidth *ratio);
									for (var c = 0; c < data.chords.length; c++) {
										var chord = data.chords[c];
										for (var n = 0; n < chord.notes.length; n++) {
											var note = chord.notes[n];
											if (note.key > 0) {
												//var ny = y + this.tapSize * (this.heightTrSheet - this.pitch12to7(note.key - offset) + 3 * 7 - 3 + 2.5);
												var noteY = this.tapSize * this.pitch12to7(note.key - offset);
												var ny = linesY - noteY + this.tapSize * 28;
												var nx = posX + this.measureMargin(k, changes) + chord.start * this.cellWidth * this.tapSize * this.cellDurationRatio() + this.tapSize * this.cellWidth * 0.5;
												//this.tileLine(g, nx, ny, nx + 1, ny, this.colorMain, this.tapSize * 0.99);
												/*lines.push([{
												x : nx,
												y : ny
												}, {
												x : nx + 1 ,
												y : ny
												}
												]);*/
												var ry = this.tapSize * 0.9;
												var rx = ry * 1.5;
												//this.tileEllipse(g, nx, ny, this.tapSize * 0.45 * this.cellWidth, this.tapSize * 0.9, this.colorMain);
												//this.tileEllipse(g, nx, ny, rx, ry, this.colorMain);
												//console.log(note);
												if (note.l6th >= 16) {
													this.tileEllipse(g, nx, ny, rx, ry, '#ffffff', this.colorBase, 4 * this.lineWidth * ratio);
												} else {
													this.tileEllipse(g, nx, ny, rx, ry, this.colorBase);
												}
											}
										}
									}
									//if (lines.length > 0) {
									//	this.tileMultiLine(g, lines, this.colorMain, this.tapSize * 0.9);
									//}
								}
								//}
							}
						}
					}
				}
			}
		}
	}
};
RiffShare2D.prototype.hasChordInOctave = function (chords, channel, octaveN, drumShift) {
	for (var c = 0; c < chords.length; c++) {
		var chord = chords[c];
		for (var n = 0; n < chord.notes.length; n++) {
			var note = chord.notes[n];
			var nkey = note.key + channel.offset + drumShift;
			if (Math.floor(nkey / 12) == octaveN) {
				return true;
			}
		}
	}
	return false;
};
RiffShare2D.prototype.tileMeasureOctave = function (measureN, octaveN, channelN, layer, left, top, width, height, ratio, color) {
	//console.log('tileMeasureOctave',measureN, octaveN, channelN);
	var channel = this.currentSong.channels[channelN];
	var drumShift = 0;
	if (channel.program == 128) {
		drumShift = -34; //console.log(channel);
	}
	var changes = this.positionOptionsChanges();
	var position = this.currentSong.positions[measureN];
	for (var n = 0; n < position.motifs.length; n++) {
		var motif = position.motifs[n];

		if (motif.channel == channel.id) {
			var data = this.findMotifById(motif.motif);
			if (this.hasChordInOctave(data.chords, channel, octaveN, drumShift)) {

				//var id = 'oct' + measureN + "x" + octaveN + "x" + channelN;
				var id = 'ch' + channelN + 'oct' + octaveN + 'msr' + measureN;
				var x = this.calculateMeasureX(measureN, changes);
				var y = this.calculateRollGridY() + (this.heightPRGrid - 12 * (octaveN + 1)) * this.tapSize;
				var w = this.measureWidth32th(measureN, changes) - this.tapSize;
				var h = 12 * this.tapSize - this.tapSize;
				var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
				if (g) {
					//console.log('add', id);
					var lines = [];
					for (var c = 0; c < data.chords.length; c++) {
						var chord = data.chords[c];
						for (var n = 0; n < chord.notes.length; n++) {
							var note = chord.notes[n];
							if (note.key > 0 && note.l6th > 0) {
								var nkey = note.key + channel.offset + drumShift;
								//if(drumShift<0)
								if (Math.floor((nkey) / 12) == octaveN) {
									//console.log(channel.program,':',(note.key + channel.offset),'>',nkey);
									var ny = y + 12 * this.tapSize - (nkey % 12 - 0.5) * this.tapSize;
									var nx = x + this.measureMargin(measureN, changes) - this.tapSize * 0.5 + chord.start * this.cellWidth * this.tapSize * this.cellDurationRatio() + this.tapSize * 1;
									lines.push([{
												x: nx,
												y: ny
											}, {
												x: nx + 1 + this.tapSize * (this.cellWidth * note.l6th * this.cellDurationRatio() - 1),
												y: ny
											}
										]);
								}
							}
						}
					}
					if (lines.length > 0) {
						this.tileMultiLine(g, lines, color, this.tapSize * 0.9);
					}
				}
			}

			if (this.currentSong.channels.length == channelN + 1) {
				if (this.startedNoteInfo) {
					if (this.startedNoteInfo.position.order == position.order) {
						if (octaveN == Math.floor((this.startedNoteInfo.key + drumShift) / 12)) {
							var id = 'mrk' + channelN + 'oct' + octaveN + 'msr' + measureN;
							var x = this.calculateMeasureX(measureN, changes);
							var y = this.calculateRollGridY() + (this.heightPRGrid - 12 * (octaveN + 1)) * this.tapSize;
							var w = this.measureWidth32th(measureN, changes) - this.tapSize;
							var h = 12 * this.tapSize - this.tapSize;
							var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
							if (g) {
								var nkey = this.startedNoteInfo.key + channel.offset + drumShift;
								var ny = y + (12 - (nkey % 12) - 0.5) * this.tapSize; // + 12 * this.tapSize - (nkey % 12 - 0.5) * this.tapSize;
								var nx = x + this.measureMargin(measureN, changes) - this.tapSize * 0.5 + this.startedNoteInfo.start * this.cellWidth * this.tapSize + this.tapSize * 1;
								this.tileCircle(g, nx + (this.cellWidth - 0.5) * this.tapSize / 2, ny, this.tapSize / 1.5, this.colorTarget);
								//console.log(measureN, octaveN, channelN, nx, ny,drumShift,this.startedNoteInfo);
							}
						}
					}
				}

			}

		}
	}
};
RiffShare2D.prototype.tileMeasureOctave__ = function (measureN, octaveN, channelN, layer, left, top, width, height, ratio, color) {
	var channel = this.currentSong.channels[channelN];
	var position = this.currentSong.positions[measureN];
	for (var n = 0; n < position.motifs.length; n++) {
		var motif = position.motifs[n];
		if (motif.channel == channel.id) {
			var id = 'oct' + measureN + "x" + octaveN + "x" + channelN;
			var x = this.calculateMeasureX(measureN);
			var y = this.calculateRollGridY() + (this.heightPRGrid - 12 * (octaveN + 1)) * this.tapSize;
			var w = this.measureWidth32th(measureN) - this.tapSize;
			var h = 12 * this.tapSize - this.tapSize;
			var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
			if (g) {
				var data = this.findMotifById(motif.motif);
				if (data.chords.length > 0) {
					for (var c = 0; c < data.chords.length; c++) {
						var chord = data.chords[c];
						for (var n = 0; n < chord.notes.length; n++) {
							var note = chord.notes[n];
							var nkey = note.key + channel.offset;
							if (Math.floor(nkey / 12) == octaveN) {
								var ny = y + 12 * this.tapSize - (nkey % 12 - 0.5) * this.tapSize;
								var nx = x + this.measureMargin(measureN, changes) - this.tapSize * 0.5 + chord.start * this.cellWidth * this.tapSize * this.cellDurationRatio() + this.tapSize * 1;
								this.tileLine(g, nx, ny, nx + 1 + this.tapSize * (this.cellWidth * note.l6th - 1), ny, color, this.tapSize * 0.8);
							}
						}
					}
				}
			}
		}
	}
};
RiffShare2D.prototype.tileRollOctaves = function (layerSymbols, layerShadows, left, top, width, height, ratio) {
	var changes = this.positionOptionsChanges();
	if (!(this.currentSong.hideRoll)) {
		//var t = new Date().getTime();
		var x = this.marginLeft * this.tapSize;
		var y = this.calculateRollGridY();
		var w = this.songWidth32th();
		var h = this.heightPRGrid * this.tapSize;
		for (var k = 0; k < this.currentSong.positions.length; k++) {
			var posX = this.calculateMeasureX(k, changes);
			var posW = this.measureWidth32th(k, changes);
			if (this.collision(posX, y, posW, h, left, top, width, height)) {
				for (var o = 0; o < 10; o++) {
					var oY = y + (this.heightPRGrid - 12 * (o + 1)) * this.tapSize;
					if (this.collision(posX, oY, posW, 12 * this.tapSize, left, top, width, height)) {
						for (var i = 0; i < this.currentSong.channels.length; i++) {
							if (i == this.currentSong.channels.length - 1) {
								//if (i == this.currentSong.selectedChannel) {

								this.tileMeasureOctave(k, o, i, layerSymbols, left, top, width, height, ratio, this.colorBase);

							} else {
								this.tileMeasureOctave(k, o, i, layerShadows, left, top, width, height, ratio, this.colorAux);
							}
						}
					}
				}
			}
		}
		//console.log('tileRollOctaves done', (new Date().getTime() - t));
	}
};
RiffShare2D.prototype.tileSongTexts = function (layer, left, top, width, height) {
	var y = (this.marginTop + this.heightSongTitle + this.heightSongText) * this.tapSize;
	var w = this.songWidth32th();
	var h = this.heightSongText * this.tapSize;
	var g = this.rakeGroup(this.marginLeft * this.tapSize, y, w, h, 'songlyr', layer, left, top, width, height);
	if (g) {
		var changes = this.positionOptionsChanges();
		for (var i = 0; i < this.currentSong.lyrics.length; i++) {
			var text = this.currentSong.lyrics[i].text;
			var start = 1 * this.currentSong.lyrics[i].start;
			var x = this.calculateMeasureX(start - 1, changes);
			this.tileText(g, x, y - 7 * this.tapSize, 7 * this.tapSize, text, this.colorAux);
		}
	}
};
