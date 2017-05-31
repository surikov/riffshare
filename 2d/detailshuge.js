RiffShare2D.prototype.addHugeTiles = function (xx, yy, ww, hh, detailRatio) {
	//var detailRatio = 30;
	//this.tilePlaceHolder(0, 0, this.innerWidth, this.innerHeight, 'huge', this.hugetitles, xx, yy, ww, hh, detailRatio);
	/*this.tilePlaceHolder(this.cfg.marginLeft*this.tapSize,this.cfg.marginTop*this.tapSize,this.innerWidth-(this.cfg.marginLeft+this.cfg.marginRight)*this.tapSize,this.innerHeight-(this.cfg.marginTop+this.cfg.marginBottom)*this.tapSize,'songbody',this.hugetitles,xx, yy, ww, hh);
	 */
	//var g=this.rakeGroup(0,0,1000,10000,'testSymbol',this.hugetitles, xx, yy, ww, hh);if(g){this.tileSymbol(g,220,0,500,1000,'#testSymbol');}
	this.tileSongTitle(this.hugetitles, xx, yy, ww, hh);
	this.tileSongTracks(this.hugetitles, xx, yy, ww, hh);
	this.tileSongRoll(this.hugetitles, xx, yy, ww, hh);
	this.tileHugeMeasureLines(xx, yy, ww, hh, detailRatio);
};
RiffShare2D.prototype.tileSongTitle = function (layer, left, top, width, height) {
	var x = this.marginLeft * this.tapSize;
	var y = this.marginTop * this.tapSize;
	var w = this.measuresLength16th() * this.tapSize;
	var h = this.heightSongTitle * this.tapSize;
	var id = 'songTitle';
	//this.tilePlaceHolder(x, y, w, h, '_' + id, layer, left, top, width, height, 1);
	var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
	if (g) {
		this.tileText(g, x, y, 33 * this.tapSize, this.currentSong.name, this.colorComment);
	}
};
RiffShare2D.prototype.tileSongTracks = function (layer, left, top, width, height) {
	var x = this.marginLeft * this.tapSize;
	var y = (this.marginTop + this.heightSongTitle + this.heightSongText) * this.tapSize;
	var w = this.measuresLength16th() * this.tapSize;
	var h = this.heightTrTitle * this.tapSize;
	for (var i = 0; i < this.currentSong.channels.length; i++) {
		/*var y = (this.cfg.marginTop + this.cfg.heightSongTitle+this.cfg.heightSongText //
		+i * (this.cfg.heightTrackTitle + this.cfg.heightTrackChords + this.cfg.heightTrackSheet + this.cfg.heightTrackFret + this.cfg.heightTrackText) //
		) * this.tapSize;*/
		var id = 'trackTitle' + i;
		//console.log(id,y,this.calculateTrackHeight(i));
		//this.tilePlaceHolder(x, y, w, h, '_' + id, layer, left, top, width, height, 1);
		this.addSpot(id, x, y, w, h, function () {
			if (!(riffShare2d.hideTrackSheet[this.channelOrder])) {
				riffShare2d.hideTrackSheet[this.channelOrder] = true;
				riffShare2d.hideTrackChords[this.channelOrder] = true;
				riffShare2d.hideTrackFret[this.channelOrder] = true;
				riffShare2d.hideTrackText[this.channelOrder] = true;
			} else {
				riffShare2d.hideTrackSheet[this.channelOrder] = false;
				riffShare2d.hideTrackChords[this.channelOrder] = false;
				riffShare2d.hideTrackFret[this.channelOrder] = false;
				riffShare2d.hideTrackText[this.channelOrder] = false;
			}
			riffShare2d.clearAllTiles();
		}).channelOrder = i;
		var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
		if (g) {
			this.tileText(g, x, y, 11 * this.tapSize, this.currentSong.channels[i].channel + ' / ' + this.currentSong.channels[i].track, this.colorComment);
		}
		if (!(riffShare2d.hideTrackChords[this.channelOrder])) {
			id = 'trackTitle' + i + 'chords';
			g = this.rakeGroup(x, y + (this.heightTrTitle + this.heightTrSheet) * this.tapSize, w, h, id, layer, left, top, width, height);
			if (g) {
				this.tileText(g, x, y + (this.heightTrTitle + this.heightTrSheet) * this.tapSize, 5 * this.tapSize, id, this.colorComment);
			}
			/*id = 'trackTitle' + i + 'text';
			g = this.rakeGroup(x, y + (this.heightTrTitle + this.heightTrSheet + this.heightTrChords) * this.tapSize, w, h, id, layer, left, top, width, height);
			if (g) {
				this.tileText(g, x, y + (this.heightTrTitle + this.heightTrSheet + this.heightTrChords) * this.tapSize, 5 * this.tapSize, id, this.colorComment);
			}
			id = 'trackTitle' + i + 'fret';
			g = this.rakeGroup(x, y + (this.heightTrTitle + this.heightTrSheet + this.heightTrChords + this.heightTrText) * this.tapSize, w, h, id, layer, left, top, width, height);
			if (g) {
				this.tileText(g, x, y + (this.heightTrTitle + this.heightTrSheet + this.heightTrChords + this.heightTrText) * this.tapSize, 5 * this.tapSize, id, this.colorComment);
			}*/
		}
		if (!(riffShare2d.hideTrackText[this.channelOrder])) {
			id = 'trackTitle' + i + 'text';
			g = this.rakeGroup(x, y + (this.heightTrTitle + this.heightTrSheet + this.heightTrChords) * this.tapSize, w, h, id, layer, left, top, width, height);
			if (g) {
				this.tileText(g, x, y + (this.heightTrTitle + this.heightTrSheet + this.heightTrChords) * this.tapSize, 5 * this.tapSize, id, this.colorComment);
			}
		}
		if (!(riffShare2d.hideTrackFret[this.channelOrder])) {
			id = 'trackTitle' + i + 'fret';
			g = this.rakeGroup(x, y + (this.heightTrTitle + this.heightTrSheet + this.heightTrChords + this.heightTrText) * this.tapSize, w, h, id, layer, left, top, width, height);
			if (g) {
				this.tileText(g, x, y + (this.heightTrTitle + this.heightTrSheet + this.heightTrChords + this.heightTrText) * this.tapSize, 5 * this.tapSize, id, this.colorComment);
			}
		}
		y = y + this.calculateTrackHeight(i) * this.tapSize;
	}
};
RiffShare2D.prototype.tileHugeMeasureLines = function (left, top, width, height, ratio) {
	var w = this.lineWidth * ratio;
	var m = 0;
	for (var t = 0; t < this.currentSong.positions.length; t++) {
		if (t % 10 == 0) {
			var x = (this.marginLeft + m) * this.tapSize;
			var y = (this.marginTop + this.heightSongTitle + this.heightSongText) * this.tapSize;
			for (var i = 0; i < this.currentSong.channels.length; i++) {
				var h = this.calculateTrackHeight(i) - this.heightTrTitle;
				if (h > this.heightTrTitle) {
					h = h * this.tapSize;
					var tY = y + this.heightTrTitle * this.tapSize;
					var id = 'ln' + i + 'x' + x + 'x' + y;
					var g = this.rakeGroup(x, tY, w, h, id, this.hugetitles, left, top, width, height);
					if (g) {
						this.tileRectangle(g, x, tY, w, h, this.colorComment);
						this.tileText(g, x, tY, 9 * this.tapSize, '' + (1 + t), this.colorComment);
					}
				}
				y = y + this.calculateTrackHeight(i) * this.tapSize;
			}
			if (!this.hideRoll) {
				var h = this.heightPRGrid * this.tapSize;
				y = (this.marginTop + this.heightSongTitle + this.heightSongText + this.calculateAllTracksHeight() + this.heightPRTitle) * this.tapSize;
				var id = 'lnPR' + x;
				var g = this.rakeGroup(x, y, w, h, id, this.hugetitles, left, top, width, height);
				if (g) {
					this.tileRectangle(g, x, y, w, h, this.colorComment);
					this.tileText(g, x, y, 9 * this.tapSize, '' + (1 + t), this.colorComment);
				}
			}
		}
		m = m + this.currentSong.positions[t].meter * song.positions[i].by;
	}
};
RiffShare2D.prototype.tileSongRoll = function (layer, left, top, width, height) {
	var x = this.marginLeft * this.tapSize;
	/*var y = (this.cfg.marginTop + this.cfg.heightSongTitle+this.cfg.heightSongText //
	+this.currentSong.channels.length * (this.cfg.heightTrackTitle + this.cfg.heightTrackChords + this.cfg.heightTrackSheet + this.cfg.heightTrackFret + this.cfg.heightTrackText) //
	) * this.tapSize;
	 */
	var y = (this.marginTop + this.heightSongTitle + this.heightSongText + this.calculateAllTracksHeight()) * this.tapSize;
	var w = this.measuresLength16th() * this.tapSize;
	//var h = (this.cfg.heightRollTitle+this.cfg.heightRollGrid) * this.tapSize;
	//var h=this.calculateRollHeight()* this.tapSize;
	var h = this.heightPRTitle * this.tapSize;
	var id = 'roll';
	//this.tilePlaceHolder(x, y, w, h, '_'+id, layer, left, top, width, height, 1);
	var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
	if (g) {
		this.tileText(g, x, y, 3 * this.tapSize, 'Pianoroll', this.colorComment);
	}
	this.addSpot(id, x, y, w, h, function () {
		riffShare2d.hideRoll = !(riffShare2d.hideRoll);
		riffShare2d.clearAllTiles();
	});
}
