RiffShare2D.prototype.addMediumTiles = function (xx, yy, ww, hh, detailRatio) {
	this.tileSongTitle(this.mediumtitles, xx, yy, ww, hh);
	this.tileTracksTitles(this.mediumtitles, xx, yy, ww, hh);
	this.tileSongRollTitle(this.mediumtitles, xx, yy, ww, hh);
	this.tilePianoLines(this.mediumtitles, xx, yy, ww, hh, detailRatio);
	this.tileGridVericalLines(this.mediumgrid, xx, yy, ww, hh, detailRatio);
	this.tileGridHorLines(this.mediumgrid, xx, yy, ww, hh, detailRatio);
	this.tileMeasureLines(this.mediumborders, xx, yy, ww, hh, detailRatio);
	this.tileOctaveLines(this.mediumborders, xx, yy, ww, hh, detailRatio);
	this.tileScoreLines(this.mediumborders, xx, yy, ww, hh, detailRatio);
	this.tileStrings(this.mediumsymbols, xx, yy, ww, hh, detailRatio);
	this.tileFretMotifs(this.mediumsymbols, xx, yy, ww, hh, detailRatio);
	this.tileSheetMotifs(this.mediumsymbols, xx, yy, ww, hh, detailRatio);
	this.tileRollOctaves(this.mediumsymbols, this.mediumshadow, xx, yy, ww, hh, detailRatio);

	//this.tileHugeTrackControls(this.mediumspots, xx, yy, ww, hh, detailRatio);
	this.tileMediumTrackControls(this.mediumspots, xx, yy, ww, hh, detailRatio);
	
	this.tileMenu(xx, yy, ww, hh, detailRatio);
};
/*
RiffShare2D.prototype.tileOnePianoLine = function (x, y, w, h, id, layer, left, top, width, height) {
var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
if (g) {
this.tileRectangle(g, x, y, w, h, this.colorSharp);
}
};*/
RiffShare2D.prototype.tilePianoLines = function (layer, left, top, width, height, ratio) {
	if (!riffShare2d.hideRoll) {
		var x = this.marginLeft * this.tapSize;
		var w = this.songWidth32th();
		var h = 12 * this.tapSize;
		for (var i = 0; i < 128; i = i + 12) {
			var id = 'pili' + i; // + 'ef';
			var y = this.calculateRollGridY() + 128 * this.tapSize - i * this.tapSize;
			var g = this.rakeGroup(x, y - h, w, h, id, layer, left, top, width, height);
			if (g) {
				this.tileRectangle(g, x, y - 2 * this.tapSize, w, this.tapSize, this.colorGrid);
				this.tileRectangle(g, x, y - 4 * this.tapSize, w, this.tapSize, this.colorGrid);
				this.tileRectangle(g, x, y - 5 * this.tapSize, w, this.lineWidth * ratio, this.colorGrid);
				this.tileRectangle(g, x, y - 7 * this.tapSize, w, this.tapSize, this.colorGrid);
				if (i < 120) {
					this.tileRectangle(g, x, y - 9 * this.tapSize, w, this.tapSize, this.colorGrid);
					this.tileRectangle(g, x, y - 11 * this.tapSize, w, this.tapSize, this.colorGrid);
				}
				//y = (this.marginTop + this.heightSongTitle + this.heightSongText + this.calculateAllTracksHeight() + this.heightPRTitle + this.heightPRGrid - i) * this.tapSize;

				/*
				var hEF = this.lineWidth * ratio;
				var yEF = y - 5 * this.tapSize;

				this.tileRectangle(g, x, yEF, w, hEF, this.colorGrid);

				this.tileOnePianoLine(x, y - 2 * this.tapSize, w, h, 'pili' + i + 'cs', layer, left, top, width, height);
				this.tileOnePianoLine(x, y - 4 * this.tapSize, w, h, 'pili' + i + 'ds', layer, left, top, width, height);
				this.tileOnePianoLine(x, y - 7 * this.tapSize, w, h, 'pili' + i + 'fs', layer, left, top, width, height);
				if (i < 120) {
				this.tileOnePianoLine(x, y - 9 * this.tapSize, w, h, 'pili' + i + 'gs', layer, left, top, width, height);
				this.tileOnePianoLine(x, y - 11 * this.tapSize, w, h, 'pili' + i + 'as', layer, left, top, width, height);
				}*/
			}
		}
	}
};

RiffShare2D.prototype.tileGridVericalLines = function (layer, left, top, width, height, ratio) {
	for (var t = 0; t < this.currentSong.positions.length; t++) {
		var x = this.calculateMeasureX(t);
		//var y = (this.marginTop + this.heightSongTitle + this.heightSongText) * this.tapSize;
		var w = this.measureWidth32th(t);
		for (var i = 0; i < this.currentSong.channels.length; i++) {
			var h = this.calculateTrackHeight(i) - this.heightTrTitle * this.tapSize;
			if (h > this.heightTrTitle * this.tapSize) {
				//h = h * this.tapSize;
				var y = this.calculateTrackSheetY(i);
				var id = 'gv' + i + 'x' + x + 'x' + y;
				var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
				if (g) {
					//this.tileRectangle(g, x, tY, w, h, this.colorComment);
					//this.tileText(g, x, tY, 5 * this.tapSize, '' + (1 + t), this.colorComment);
					for (var s = 0; s < this.currentSong.positions[i].meter * song.positions[i].by; s++) {
						this.tileRectangle(g, x + this.measureMargin(t) + this.cellWidth * s * this.tapSize, y, this.lineWidth * ratio, h, this.colorGrid);
					}
				}
			}
		}
		if (!this.hideRoll) {
			var h = this.heightPRGrid * this.tapSize;
			y = this.calculateRollGridY();
			var id = 'gvR' + x;
			var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
			if (g) {
				//this.tileRectangle(g, x, y, w, h, this.colorComment);
				//this.tileText(g, x, y, 5 * this.tapSize, '' + (1 + t), this.colorComment);
				for (var s = 1; s < this.currentSong.positions[i].meter * song.positions[i].by; s++) {
					this.tileRectangle(g, x + this.measureMargin(t) + this.cellWidth * s * this.tapSize, y, this.lineWidth * ratio, h, this.colorGrid);
				}
			}
		}
	}
};
RiffShare2D.prototype.tileGridHorLines = function (layer, left, top, width, height, ratio) {

	var x = this.marginLeft * this.tapSize;
	//var y = (this.marginTop + this.heightSongTitle + this.heightSongText) * this.tapSize;
	var w = this.songWidth32th();
	//var h = this.lineWidth * ratio;
	for (var i = 0; i < this.currentSong.channels.length; i++) {
		if (!(riffShare2d.hideTrackSheet[i])) {
			var id = 'ghor' + i + 'x' + y;
			var y = this.calculateTrackSheetY(i);
			var h = this.calculateTrackHeight(i) - this.heightTrTitle * this.tapSize;
			var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
			if (g) {
				for (var s = 0; s < h; s = s + this.tapSize) {
					this.tileRectangle(g, x, y + s, w, this.lineWidth * ratio, this.colorGrid);
				}
			}
		}
		//y = y + this.calculateTrackHeight(i) * this.tapSize;
	}
};
RiffShare2D.prototype.tileOneMediumTrackControlSpot = function (channel, fill, nn, r, g, x, y, w, h, layer, left, top, width, height, detailRatio, text, action) {
	//this.tileCircle(g, x + w / 2 - r, y + nn * 2.0 * this.tapSize, 0.9 * this.tapSize, this.colorAction, 'none', 0);
	if (fill) {
		this.tileCircle(g, x + w / 2 - r, y + nn * 2.0 * this.tapSize, 0.9 * this.tapSize, this.colorAction, 'none', this.lineWidth * detailRatio);
	} else {
		this.tileCircle(g, x + w / 2 - r, y + nn * 2.0 * this.tapSize, 0.9 * this.tapSize, 'none', this.colorAction, this.lineWidth * detailRatio);
	}
	this.tileText(g, x + w / 2.0 - r, y + nn * 2.0 * this.tapSize, 2 * this.tapSize, text);
	if (action) {
		this.addSpot('trackControl' + nn + 'x' + channel, x + w / 2 - r-this.tapSize, y + nn * 2* this.tapSize-this.tapSize , 2* this.tapSize,2* this.tapSize, action);
	}
}
RiffShare2D.prototype.tileOneMediumTrackControl = function (i, layer, left, top, width, height, detailRatio) {
	var x = 1 * this.tapSize;
	var y = this.calculateTrackY(i);
	var w = this.marginLeft * this.tapSize;
	var h = this.calculateTrackHeight(i);
	var r = 0.45 * Math.min(w, this.heightTrText * this.tapSize);
	if (this.collision(x, y, w, h, left, top, width, height)) {
		var id = 'trackPanelControls' + i;
		var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
		if (g) {
			/*this.tileCircle(g, x + w / 2-r, y + 0.0 * this.tapSize, 0.9 * this.tapSize, this.colorAction, 'none', 0);
			this.tileText(g, x + w / 2.0-r, y + 0.0 * this.tapSize, 2 * this.tapSize, 'Select in Pianoroll');
			this.tileCircle(g, x + w / 2-r, y + 2.0 * this.tapSize, 0.9 * this.tapSize, this.colorAction, 'none', 0);
			this.tileText(g, x + w / 2.0-r, y + 2.0 * this.tapSize, 2 * this.tapSize, 'Show notesheet');
			this.tileCircle(g, x + w / 2-r, y + 4.0 * this.tapSize, 0.9 * this.tapSize, this.colorAction, 'none', 0);
			this.tileText(g, x + w / 2.0-r, y + 4.0 * this.tapSize, 2 * this.tapSize, 'Show chords');
			this.tileCircle(g, x + w / 2-r, y + 6.0 * this.tapSize, 0.9 * this.tapSize, this.colorAction, 'none', 0);
			this.tileText(g, x + w / 2.0-r, y + 6.0 * this.tapSize, 2 * this.tapSize, 'Show text');
			this.tileCircle(g, x + w / 2-r, y + 8.0 * this.tapSize, 0.9 * this.tapSize, this.colorAction, 'none', 0);
			this.tileText(g, x + w / 2.0-r, y + 8.0 * this.tapSize, 2 * this.tapSize, 'Show fretboard');*/
			var action = null;
			if (i == this.selectedChannel) {
				this.tileOneMediumTrackControlSpot(i, true, 0, r, g, x, y, w, h, layer, left, top, width, height, detailRatio, 'Selected in Pianoroll');
			} else {
				this.tileOneMediumTrackControlSpot(i, false, 0, r, g, x, y, w, h, layer, left, top, width, height, detailRatio, 'Select in Pianoroll', function () {
					riffShare2d.selectedChannel = i;
					//riffShare2d.resetAllLayersNow();
				});
			}
			if (!this.hideTrackSheet[i]) {
				this.tileOneMediumTrackControlSpot(i, true, 1, r, g, x, y, w, h, layer, left, top, width, height, detailRatio, 'Hide notesheet', function () {
					riffShare2d.hideTrackSheet[i] = true;
				});
			} else {
				this.tileOneMediumTrackControlSpot(i, false, 1, r, g, x, y, w, h, layer, left, top, width, height, detailRatio, 'Show notesheet', function () {
					riffShare2d.hideTrackSheet[i] = false;
				});
			}
			//this.tileOneMediumTrackControlSpot(i, !this.hideTrackChords[i], 2, r, g, x, y, w, h, layer, left, top, width, height, detailRatio, 'Show chords', action);
			if (!this.hideTrackChords[i]) {
				this.tileOneMediumTrackControlSpot(i, true, 2, r, g, x, y, w, h, layer, left, top, width, height, detailRatio, 'Hide chords', function () {
					riffShare2d.hideTrackChords[i] = true;
				});
			} else {
				this.tileOneMediumTrackControlSpot(i, false, 2, r, g, x, y, w, h, layer, left, top, width, height, detailRatio, 'Show chords', function () {
					riffShare2d.hideTrackChords[i] = false;
				});
			}
			//this.tileOneMediumTrackControlSpot(i, !this.hideTrackText[i], 3, r, g, x, y, w, h, layer, left, top, width, height, detailRatio, 'Show text', action);
			if (!this.hideTrackText[i]) {
				this.tileOneMediumTrackControlSpot(i, true, 3, r, g, x, y, w, h, layer, left, top, width, height, detailRatio, 'Hide text', function () {
					riffShare2d.hideTrackText[i] = true;
				});
			} else {
				this.tileOneMediumTrackControlSpot(i, false, 3, r, g, x, y, w, h, layer, left, top, width, height, detailRatio, 'Show text', function () {
					riffShare2d.hideTrackText[i] = false;
				});
			}
			//this.tileOneMediumTrackControlSpot(i, !this.hideTrackFret[i], 4, r, g, x, y, w, h, layer, left, top, width, height, detailRatio, 'Show fretboard', action);
			if (!this.hideTrackFret[i]) {
				this.tileOneMediumTrackControlSpot(i, true, 4, r, g, x, y, w, h, layer, left, top, width, height, detailRatio, 'Hide fretboard', function () {
					riffShare2d.hideTrackFret[i] = true;
				});
			} else {
				this.tileOneMediumTrackControlSpot(i, false, 4, r, g, x, y, w, h, layer, left, top, width, height, detailRatio, 'Show fretboard', function () {
					riffShare2d.hideTrackFret[i] = false;
				});
			}
		}
	}
};
RiffShare2D.prototype.tileMediumTrackControls = function (layer, left, top, width, height, detailRatio) {
	for (var i = 0; i < this.currentSong.channels.length; i++) {
		this.tileOneMediumTrackControl(i, layer, left, top, width, height, detailRatio);
	}
};
