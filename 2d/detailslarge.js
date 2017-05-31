RiffShare2D.prototype.addLargeTiles = function (xx, yy, ww, hh, detailRatio) {
	//var detailRatio = 3;
	//this.tilePlaceHolder(0, 0, this.innerWidth, this.innerHeight, 'large', this.largetitles, xx, yy, ww, hh, detailRatio);
	//var g=this.rakeGroup(0,0,1000,10000,'testSymbol',this.hugetitles, xx, yy, ww, hh);if(g){this.tileSymbol(g,220,0,500,1000,'#testSymbol');}
	this.tileSongTitle(this.largetitles, xx, yy, ww, hh);
	this.tileSongTracks(this.largetitles, xx, yy, ww, hh);
	this.tileSongRoll(this.largetitles, xx, yy, ww, hh);
	this.tileMeasureLines(this.largetitles, xx, yy, ww, hh, detailRatio);
	this.tileOctaveLines(this.largetitles, xx, yy, ww, hh, detailRatio);
	this.tileScoreLines(this.largetitles, xx, yy, ww, hh, detailRatio);
	this.tileStrings(this.largetitles, xx, yy, ww, hh, detailRatio);
};
RiffShare2D.prototype.tileMeasureLines = function (layer, left, top, width, height, ratio) {
	var w = this.lineWidth * ratio;
	var m = 0;
	for (var t = 0; t < this.currentSong.positions.length; t++) {
		var x = (this.marginLeft + m) * this.tapSize;
		var y = (this.marginTop + this.heightSongTitle + this.heightSongText) * this.tapSize;
		for (var i = 0; i < this.currentSong.channels.length; i++) {
			var h = this.calculateTrackHeight(i) - this.heightTrTitle;
			if (h > this.heightTrTitle) {
				h = h * this.tapSize;
				var tY = y + this.heightTrTitle * this.tapSize;
				var id = 'ln' + i + 'x' + x + 'x' + y;
				var g = this.rakeGroup(x, tY, w, h, id, layer, left, top, width, height);
				if (g) {
					this.tileRectangle(g, x, tY, w, h, this.colorComment);
					this.tileText(g, x, tY, 5 * this.tapSize, '' + (1 + t), this.colorComment);
				}
			}
			y = y + this.calculateTrackHeight(i) * this.tapSize;
		}
		if (!this.hideRoll) {
			var h = this.heightPRGrid * this.tapSize;
			y = (this.marginTop + this.heightSongTitle + this.heightSongText + this.calculateAllTracksHeight() + this.heightPRTitle) * this.tapSize;
			var id = 'lnPR' + x;
			var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
			if (g) {
				this.tileRectangle(g, x, y, w, h, this.colorComment);
				this.tileText(g, x, y, 5 * this.tapSize, '' + (1 + t), this.colorComment);
			}
		}
		//m = m + this.currentSong.positions[t].meter * song.positions[i].by;
		m = m + this.measureLength(t);
	}
};
RiffShare2D.prototype.tileOctaveLines = function (layer, left, top, width, height, ratio) {
	if (!riffShare2d.hideRoll) {
		var x = this.marginLeft * this.tapSize;
		var w = this.measuresLength16th() * this.tapSize;
		var h = this.lineWidth * ratio;
		for (var i = 12; i < 128; i = i + 12) {
			y = (this.marginTop + this.heightSongTitle + this.heightSongText + this.calculateAllTracksHeight() + this.heightPRTitle + this.heightPRGrid - i) * this.tapSize;
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
	var y = (this.marginTop + this.heightSongTitle + this.heightSongText) * this.tapSize;
	var w = this.measuresLength16th() * this.tapSize;
	var h = this.lineWidth * ratio;
	for (var i = 0; i < this.currentSong.channels.length; i++) {
		var id = 'sco' + i;
		var g = this.rakeGroup(x, y, w, this.calculateTrackHeight(i) * this.tapSize, id, layer, left, top, width, height);
		if (g) {
			for (var s = 0; s < 5; s++) {
				this.tileRectangle(g, x, y + (0.5 + s * 2 + this.heightTrTitle + this.marginTrSheetLines) * this.tapSize, w, h, this.colorComment);
			}
		}
		y = y + this.calculateTrackHeight(i) * this.tapSize;
	}
};
RiffShare2D.prototype.tileStrings = function (layer, left, top, width, height, ratio) {
	var x = this.marginLeft * this.tapSize;
	var y = (this.marginTop + this.heightSongTitle + this.heightSongText) * this.tapSize;
	var w = this.measuresLength16th() * this.tapSize;
	var h = this.lineWidth * ratio;
	for (var i = 0; i < this.currentSong.channels.length; i++) {
		var id = 'str' + i;
		var g = this.rakeGroup(x, y, w, this.calculateTrackHeight(i) * this.tapSize, id, layer, left, top, width, height);
		if (g) {
			for (var s = 0; s < this.currentSong.channels[i].string.length; s++) {
				this.tileRectangle(g, x, y + (s + this.heightTrTitle + this.heightTrChords + this.heightTrSheet + this.heightTrText) * this.tapSize, w, h, this.colorComment);
			}
		}
		y = y + this.calculateTrackHeight(i) * this.tapSize;
	}
};
