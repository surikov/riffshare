RiffShare2D.prototype.addLargeTiles = function (xx, yy, ww, hh, detailRatio) {

	this.tileSongTitle(this.largetitles, xx, yy, ww, hh);
	this.tileTracksTitles(this.largetitles, xx, yy, ww, hh);
	this.tileSongRollTitle(this.largetitles, xx, yy, ww, hh);
	this.tileMeasureLines(this.largeborders, xx, yy, ww, hh, detailRatio);
	this.tileOctaveLines(this.largeborders, xx, yy, ww, hh, detailRatio);
	this.tileScoreLines(this.largeborders, xx, yy, ww, hh, detailRatio);
	this.tileStrings(this.largesymbols, xx, yy, ww, hh, detailRatio);
	this.tileFretMotifs(this.largesymbols, xx, yy, ww, hh, detailRatio);
	this.tileSheetMotifs(this.largesymbols, xx, yy, ww, hh, detailRatio);

	this.tileRollOctaves(this.largesymbols, this.largeshadow, xx, yy, ww, hh, detailRatio);
	this.tileHugeTrackControls(this.largespots, xx, yy, ww, hh, detailRatio);

};
RiffShare2D.prototype.tileOneMeasureLine = function (layer, i, left, top, width, height, ratio) {
	var x = this.calculateMeasureX(i);
	var w = this.measureWidth32th(i);
	for (var n = 0; n < this.currentSong.channels.length; n++) {
		if (!(this.hideTrackSheet[n])) {
			var y = this.calculateTrackSheetY(n) + (0.5 + this.marginTrSheetLines - 4) * this.tapSize;
			var h = (4 + 2 * 4) * this.tapSize;
			var id = 'ln' + i + 'x' + x + 'x' + y;
			var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
			if (g) {
				this.tileText(g, x, y, 3 * this.tapSize, '' + (1 + i), this.colorComment);
				this.tileRectangle(g, x, y + 4 * this.tapSize, this.lineWidth * ratio, h - 4 * this.tapSize, this.colorComment);
			}
		}
		if (!(this.hideTrackFret[n])) {
			var y = this.calculateTrackFretY(n) - 4 * this.tapSize;
			var h = (4 + this.currentSong.channels[n].string.length) * this.tapSize;
			var id = 'frl' + i + 'x' + x + 'x' + y;
			var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
			if (g) {
				this.tileText(g, x, y, 3 * this.tapSize, '' + (1 + i), this.colorComment);
				this.tileRectangle(g, x, y + 4 * this.tapSize, this.lineWidth * ratio, h - 4 * this.tapSize, this.colorComment);
			}
		}
	}
	if (!(this.hideRoll)) {
		var y = this.calculateRollGridY();
		var h = 128 * this.tapSize;
		var id = 'rlli' + i;
		var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
		if (g) {
			//this.tileText(g, x, y, 3 * this.tapSize, '' + (1 + i), this.colorComment);
			this.tileRectangle(g, x, y, this.lineWidth * ratio, h, this.colorComment);
		}
	}
};
RiffShare2D.prototype.tileMeasureLines = function (layer, left, top, width, height, ratio) {
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
	if (!riffShare2d.hideRoll) {
		var x = this.marginLeft * this.tapSize;
		var w = this.songWidth32th();
		var h = this.lineWidth * ratio;
		for (var i = 12; i < 128; i = i + 12) {
			//y = (this.marginTop + this.heightSongTitle + this.heightSongText + this.calculateAllTracksHeight() + this.heightPRTitle + this.heightPRGrid - i) * this.tapSize;
			y = this.calculateRollGridY() + (this.heightPRGrid - i) * this.tapSize;
			var id = 'octa' + i;
			var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
			if (g) {
				this.tileRectangle(g, x, y, w, h, this.colorComment);
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
			if (!(this.hideTrackSheet[i])) {
				var y = this.calculateTrackSheetY(i);
				var id = 'sco' + i;
				var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
				if (g) {
					for (var s = 0; s < 5; s++) {
						//this.tileRectangle(g, x, y + (0.5 + s * 2 + this.heightTrTitle + this.marginTrSheetLines) * this.tapSize, w, h, this.colorComment);
						this.tileRectangle(g, x, y + (0.5 + this.marginTrSheetLines + 2 * s) * this.tapSize, w, this.lineWidth * ratio, this.colorComment);
					}
				}
			}
			//y = y + this.calculateTrackHeight(i) * this.tapSize;
		}
};
RiffShare2D.prototype.tileStrings = function (layer, left, top, width, height, ratio) {
	var x = this.marginLeft * this.tapSize;
	//var y = (this.marginTop + this.heightSongTitle + this.heightSongText) * this.tapSize;
	var w = this.songWidth32th();

	for (var i = 0; i < this.currentSong.channels.length; i++) {
		if (!(this.hideTrackFret[i])) {
			var y = this.calculateTrackFretY(i);
			var h = (this.currentSong.channels[i].string.length + 1) * this.tapSize;
			var id = 'str' + i;
			var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
			if (g) {
				for (var s = 0; s < this.currentSong.channels[i].string.length; s++) {
					this.tileRectangle(g, x, y + (0.5 + s) * this.tapSize, w, this.lineWidth * ratio, this.colorComment);
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

	for (var i = 0; i < this.currentSong.channels.length; i++) {
		if (!(riffShare2d.hideTrackFret[i])) {
			var channel = this.currentSong.channels[i];
			var h = this.currentSong.channels[i].string.length * this.tapSize;
			//y=y+(this.heightTrTitle+this.heightTrSheet+this.heightTrChords+this.heightTrText) * this.tapSize;
			y = this.calculateTrackFretY(i);
			if (this.collision(x, y, w, h, left, top, width, height)) {
				//console.log('fret',i);
				//this.tilePlaceHolder(x, y, w, h, '_fch' + i, layer, left, top, width, height, 1);
				for (var k = 0; k < this.currentSong.positions.length; k++) {
					var posX = this.calculateMeasureX(k);
					var posW = this.measureWidth32th(k);
					if (this.collision(posX, y, posW, h, left, top, width, height)) {
						var position = this.currentSong.positions[k];
						for (var n = 0; n < position.motifs.length; n++) {
							var motif = position.motifs[n];
							if (motif.channel == channel.id) {
								var id = 'fretPos' + motif.channel + 'x' + motif.motif;
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
												var t = note.key - offset - this.channelStringKey(note.string, channel);
												var colordeep = this.fretLineColor(t);
												var ny = y + this.tapSize * 1 * (channel.string.length - 1) - this.tapSize * 1 * (channel.string.length - note.string) + this.tapSize * 0.5;
												var nx = posX + this.measureMargin(k) - this.tapSize * 0.5 + chord.start * this.cellWidth * this.tapSize + this.tapSize * 1;
												this.tileLine(g, nx, ny, nx + 1 + this.tapSize * (this.cellWidth * note.l6th - 1), ny, colordeep, this.tapSize * 0.9);
												this.tileText(g, nx - 0.2 * this.tapSize, ny + 0.35 * this.tapSize, 0.9 * this.tapSize, '' + t, '#fff', colordeep, this.tapSize / 50,'Anton, sans-serif','normal');
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
RiffShare2D.prototype.tileSheetMotifs = function (layer, left, top, width, height, ratio) {
	var x = this.marginLeft * this.tapSize;
	var w = this.songWidth32th();
	for (var i = 0; i < this.currentSong.channels.length; i++) {
		if (!(riffShare2d.hideTrackSheet[i])) {
			var channel = this.currentSong.channels[i];
			var h = this.heightTrSheet * this.tapSize;
			y = this.calculateTrackSheetY(i);
			if (this.collision(x, y, w, h, left, top, width, height)) {
				for (var k = 0; k < this.currentSong.positions.length; k++) {
					var posX = this.calculateMeasureX(k);
					var posW = this.measureWidth32th(k);
					//this.tilePlaceHolder(posX, y, posW, h, '_' + posX+"-"+y, layer, left, top, width, height, 1);
					if (this.collision(posX, y, posW, h, left, top, width, height)) {
						var position = this.currentSong.positions[k];
						for (var n = 0; n < position.motifs.length; n++) {
							var motif = position.motifs[n];
							if (motif.channel == channel.id) {
								var id = 'sheetPos' + motif.channel + 'x' + motif.motif;
								var offset = channel.offset + this.cleffOffset(motif.clef);
								var g = this.rakeGroup(posX, y, posW, h, id, layer, left, top, width, height);
								if (g) {
									var data = this.findMotifById(motif.motif);
									if (data.chords.length > 0) {
										var lines = [];
										for (var c = 0; c < data.chords.length; c++) {
											var chord = data.chords[c];
											for (var n = 0; n < chord.notes.length; n++) {
												var note = chord.notes[n];
												var ny = y + this.tapSize * (this.heightTrSheet - this.pitch12to7(note.key - offset) + 3 * 7 - 3 + 2.5);
												var nx = posX + this.measureMargin(k) + chord.start * this.cellWidth * this.tapSize + this.tapSize * this.cellWidth * 0.5;
												//this.tileLine(g, nx, ny, nx + 1, ny, this.colorMain, this.tapSize * 0.99);
												lines.push([{
														x : nx,
														y : ny
													}, {
														x : nx + 1 ,
														y : ny
													}
												]);
											}
										}
										if (lines.length > 0) {
											this.tileMultiLine(g, lines, this.colorMain, this.tapSize * 0.9);
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
RiffShare2D.prototype.hasChordInOctave = function (chords, channel,octaveN) {
	for (var c = 0; c < chords.length; c++) {
		var chord = chords[c];
		for (var n = 0; n < chord.notes.length; n++) {
			var note = chord.notes[n];
			var nkey = note.key + channel.offset;
			if (Math.floor(nkey / 12) == octaveN) {
				return true;
			}
		}
	}
	return false;
};
RiffShare2D.prototype.tileMeasureOctave = function (measureN, octaveN, channelN, layer, left, top, width, height, ratio, color) {
	var channel = this.currentSong.channels[channelN];
	var position = this.currentSong.positions[measureN];
	for (var n = 0; n < position.motifs.length; n++) {
		var motif = position.motifs[n];
		if (motif.channel == channel.id) {
			var data = this.findMotifById(motif.motif);
			if (this.hasChordInOctave(data.chords, channel,octaveN)) {
				//var id = 'oct' + measureN + "x" + octaveN + "x" + channelN;
				var id = 'ch' + channelN + 'oct' + octaveN + 'msr' + measureN;
				var x = this.calculateMeasureX(measureN);
				var y = this.calculateRollGridY() + (this.heightPRGrid - 12 * (octaveN + 1)) * this.tapSize;
				var w = this.measureWidth32th(measureN) - this.tapSize;
				var h = 12 * this.tapSize - this.tapSize;
				var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
				if (g) {
					//console.log('add', id);
					var lines = [];
					for (var c = 0; c < data.chords.length; c++) {
						var chord = data.chords[c];
						for (var n = 0; n < chord.notes.length; n++) {
							var note = chord.notes[n];
							var nkey = note.key + channel.offset;
							if (Math.floor(nkey / 12) == octaveN) {
								var ny = y + 12 * this.tapSize - (nkey % 12 - 0.5) * this.tapSize;
								var nx = x + this.measureMargin(measureN) - this.tapSize * 0.5 + chord.start * this.cellWidth * this.tapSize + this.tapSize * 1;
								lines.push([{
											x : nx,
											y : ny
										}, {
											x : nx + 1 + this.tapSize * (this.cellWidth * note.l6th - 1),
											y : ny
										}
									]);
							}
						}
					}
					if (lines.length > 0) {
						this.tileMultiLine(g, lines, color, this.tapSize * 0.9);
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
								var nx = x + this.measureMargin(measureN) - this.tapSize * 0.5 + chord.start * this.cellWidth * this.tapSize + this.tapSize * 1;
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
	if (!(this.hideRoll)) {
		//var t = new Date().getTime();
		var x = this.marginLeft * this.tapSize;
		var y = this.calculateRollGridY();
		var w = this.songWidth32th();
		var h = this.heightPRGrid * this.tapSize;
		for (var k = 0; k < this.currentSong.positions.length; k++) {
			var posX = this.calculateMeasureX(k);
			var posW = this.measureWidth32th(k);
			if (this.collision(posX, y, posW, h, left, top, width, height)) {
				for (var o = 0; o < 10; o++) {
					var oY = y + (this.heightPRGrid - 12 * (o + 1)) * this.tapSize;
					if (this.collision(posX, oY, posW, 12 * this.tapSize, left, top, width, height)) {
						for (var i = 0; i < this.currentSong.channels.length; i++) {
							if (i == this.selectedChannel) {
								this.tileMeasureOctave(k, o, i, layerSymbols, left, top, width, height, ratio, this.colorMain);
							} else {
								this.tileMeasureOctave(k, o, i, layerShadows, left, top, width, height, ratio, this.colorSharp);
							}
						}
					}
				}
			}
		}
		//console.log('tileRollOctaves done', (new Date().getTime() - t));
	}
};
