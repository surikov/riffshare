RiffShare2D.prototype.addMediumTiles = function (xx, yy, ww, hh, detailRatio) {
	//var detailRatio = 0.75;
	//this.tilePlaceHolder(0, 0, this.innerWidth, this.innerHeight, 'medium', this.mediumtitles, xx, yy, ww, hh, detailRatio);
	//var g=this.rakeGroup(0,0,1000,10000,'testSymbol',this.hugetitles, xx, yy, ww, hh);if(g){this.tileSymbol(g,220,0,500,1000,'#testSymbol');}
	this.tileSongTitle(this.mediumtitles, xx, yy, ww, hh);
	this.tileSongTracks(this.mediumtitles, xx, yy, ww, hh);
	this.tileSongRoll(this.mediumtitles, xx, yy, ww, hh);
	this.tilePianoLines(this.mediumtitles, xx, yy, ww, hh, detailRatio);
	this.tileGridVericalLines(this.mediumtitles, xx, yy, ww, hh, detailRatio);
	this.tileGridHorLines(this.mediumtitles, xx, yy, ww, hh, detailRatio);
	this.tileMeasureLines(this.mediumtitles, xx, yy, ww, hh, detailRatio);
	this.tileOctaveLines(this.mediumtitles, xx, yy, ww, hh, detailRatio);
	this.tileScoreLines(this.mediumtitles, xx, yy, ww, hh, detailRatio);
	this.tileStrings(this.mediumtitles, xx, yy, ww, hh, detailRatio);
	this.tileFretMotifs(this.mediumtitles, xx, yy, ww, hh, detailRatio);
	this.tileSheetMotifs(this.mediumtitles, xx, yy, ww, hh, detailRatio);
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
		var w = this.songWidth32th() ;
		var h = 12*this.tapSize;
		for (var i = 0; i < 128; i = i + 12) {
			var id = 'pili' + i;// + 'ef';
			var y=this.calculateRollGridY()+128*this.tapSize-i*this.tapSize;
			var g = this.rakeGroup(x, y-h, w, h, id, layer, left, top, width, height);
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
			var h = this.calculateTrackHeight(i) - this.heightTrTitle*this.tapSize;
			if (h > this.heightTrTitle*this.tapSize) {
				//h = h * this.tapSize;
				var y = this.calculateTrackSheetY(i);
				var id = 'gv' + i + 'x' + x + 'x' + y;
				var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
				if (g) {
					//this.tileRectangle(g, x, tY, w, h, this.colorComment);
					//this.tileText(g, x, tY, 5 * this.tapSize, '' + (1 + t), this.colorComment);
					for (var s = 0; s < this.currentSong.positions[i].meter * song.positions[i].by; s++) {
						this.tileRectangle(g, x + this.measureMargin(t) + 2*s * this.tapSize, y, this.lineWidth * ratio, h, this.colorGrid);
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
					this.tileRectangle(g, x + this.measureMargin(t) + 2*s * this.tapSize, y, this.lineWidth * ratio, h, this.colorGrid);
				}
			}
		}
	}
};
RiffShare2D.prototype.tileGridHorLines = function (layer, left, top, width, height, ratio) {
	
	var x = this.marginLeft * this.tapSize;
	//var y = (this.marginTop + this.heightSongTitle + this.heightSongText) * this.tapSize;
	var w = this.songWidth32th() ;
	//var h = this.lineWidth * ratio;
	for (var i = 0; i < this.currentSong.channels.length; i++) {
		if (!(riffShare2d.hideTrackSheet[i])) {
			var id = 'ghor' + i + 'x' + y;
			var y = this.calculateTrackSheetY(i);
			var h=this.calculateTrackHeight(i)-this.heightTrTitle*this.tapSize;
			var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
			if (g) {
				for (var s = 0; s < h; s=s+this.tapSize) {
					this.tileRectangle(g, x, y + s , w, this.lineWidth * ratio, this.colorGrid);
				}
			}
		}
		//y = y + this.calculateTrackHeight(i) * this.tapSize;
	}
};
