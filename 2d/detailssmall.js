RiffShare2D.prototype.addSmallTiles = function (xx, yy, ww, hh, detailRatio) {
	//var detailRatio = 0.5;
	//this.tilePlaceHolder(0, 0, this.innerWidth, this.innerHeight, 'small', this.smalltitles, xx, yy, ww, hh, detailRatio);
	//var g=this.rakeGroup(0,0,1000,10000,'testSymbol',this.hugetitles, xx, yy, ww, hh);if(g){this.tileSymbol(g,220,0,500,1000,'#testSymbol');}
	this.tileSongTitle(this.smalltitles, xx, yy, ww, hh);
	this.tileSongTracks(this.smalltitles, xx, yy, ww, hh);
	this.tileSongRoll(this.smalltitles, xx, yy, ww, hh);
	this.tilePianoLines(this.smalltitles, xx, yy, ww, hh, detailRatio);
	this.tileGridVericalLines(this.smalltitles, xx, yy, ww, hh, detailRatio);
	this.tileGridHorLines(this.smalltitles, xx, yy, ww, hh, detailRatio);
	this.tileMeasureLines(this.smalltitles, xx, yy, ww, hh, detailRatio);
	this.tileOctaveLines(this.smalltitles, xx, yy, ww, hh, detailRatio);
	this.tileScoreLines(this.smalltitles, xx, yy, ww, hh, detailRatio);
	this.tileStrings(this.smalltitles, xx, yy, ww, hh, detailRatio);
	this.tileFretMotifs(this.smalltitles, xx, yy, ww, hh, detailRatio);
	this.tileSheetMotifs(this.smalltitles, xx, yy, ww, hh, detailRatio);
	this.tileRollOctaves(this.smalltitles, xx, yy, ww, hh, detailRatio);
};
