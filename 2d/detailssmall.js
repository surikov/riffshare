RiffShare2D.prototype.addSmallTiles = function (xx, yy, ww, hh, detailRatio) {
	//var detailRatio = 0.5;
	//this.tilePlaceHolder(0, 0, this.innerWidth, this.innerHeight, 'small', this.smalltitles, xx, yy, ww, hh, detailRatio);
	//var g=this.rakeGroup(0,0,1000,10000,'testSymbol',this.hugetitles, xx, yy, ww, hh);if(g){this.tileSymbol(g,220,0,500,1000,'#testSymbol');}
	this.tileSongTitle(this.smalltitles, xx, yy, ww, hh);
	this.tileTracksTitles(this.smalltitles, xx, yy, ww, hh);
	this.tileSongRollTitle(this.smalltitles, xx, yy, ww, hh);
	this.tilePianoLines(this.smallgrid, xx, yy, ww, hh, detailRatio);
	this.tileGridVericalLines(this.smallgrid, xx, yy, ww, hh, detailRatio);
	this.tileGridHorLines(this.smallgrid, xx, yy, ww, hh, detailRatio);
	this.tileMeasureLines(this.smallborders, xx, yy, ww, hh, detailRatio);
	this.tileOctaveLines(this.smallborders, xx, yy, ww, hh, detailRatio);
	this.tileScoreLines(this.smallborders, xx, yy, ww, hh, detailRatio);
	this.tileStrings(this.smallsymbols, xx, yy, ww, hh, detailRatio);
	this.tileFretMotifs(this.smallsymbols, xx, yy, ww, hh, detailRatio);
	this.tileSheetMotifs(this.smallsymbols, xx, yy, ww, hh, detailRatio);
	this.tileRollOctaves(this.smallsymbols, this.smallshadow, xx, yy, ww, hh, detailRatio);
	
	//this.tileHugeTrackControls(this.smallspots, xx, yy, ww, hh, detailRatio);
	this.tileMediumTrackControls(this.smallspots, xx, yy, ww, hh, detailRatio);
	
	this.tileMenu( xx, yy, ww, hh, detailRatio);
};
