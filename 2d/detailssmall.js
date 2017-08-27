RiffShare2D.prototype.addSmallTiles = function (xx, yy, ww, hh, detailRatio) {
	//var detailRatio = 0.5;
	//this.tilePlaceHolder(0, 0, this.innerWidth, this.innerHeight, 'small', this.smalltitles, xx, yy, ww, hh, detailRatio);
	//var g=this.rakeGroup(0,0,1000,10000,'testSymbol',this.hugetitles, xx, yy, ww, hh);if(g){this.tileSymbol(g,220,0,500,1000,'#testSymbol');}
	this.tileSongTitleMenu(this.smalltitles, xx, yy, ww, hh, detailRatio);
	this.tileHugeSongTitle(this.smalltracknames, xx, yy, ww, hh, detailRatio);
	this.tileMeiumSongOptions(this.smalltitles, xx, yy, ww, hh, detailRatio);
	this.tileSongTexts(this.smalltitles, xx, yy, ww, hh);
	this.tileMediumTracksTitles(this.smalltracknames, xx, yy, ww, hh, detailRatio);
	this.tileMediumTracksOptions(this.smalltitles, xx, yy, ww, hh, detailRatio);
	//this.tileTracksTitles(this.smalltracknames, xx, yy, ww, hh);
	this.tileMarkers(this.smalltitles, xx, yy, ww, hh);

	this.tileDrumNames(this.smalltracknames, xx, yy, ww, hh, detailRatio);

	this.tilePianoLines(this.smallgrid, xx, yy, ww, hh, detailRatio);
	//this.tileGridVericalLines(this.smallgrid, xx, yy, ww, hh, detailRatio);
	//this.tileGridHorLines(this.smallgrid, xx, yy, ww, hh, detailRatio);
	this.tileSmallMeasureLines(this.smallborders, xx, yy, ww, hh, detailRatio);
	this.tileOctaveLines(this.smallborders, xx, yy, ww, hh, detailRatio);
	this.tileScoreLines(this.smallborders, xx, yy, ww, hh, detailRatio);
	this.tileStrings(this.smallsymbols, xx, yy, ww, hh, detailRatio);
	this.tileFretMotifs(this.smallsymbols, xx, yy, ww, hh, detailRatio);
	this.tileChordMotifs(this.smallsymbols, xx, yy, ww, hh, detailRatio);
	this.tileSheetMotifs(this.smallsymbols, xx, yy, ww, hh, detailRatio);
	this.tileSheetClefs(this.smallsymbols, xx, yy, ww, hh, detailRatio);
	this.tileRollOctaves(this.smallsymbols, this.smallshadow, xx, yy, ww, hh, detailRatio);

	//this.tileHugeTrackControls(this.smallspots, xx, yy, ww, hh, detailRatio);
	//this.tileMediumTrackControls(this.smallspots, xx, yy, ww, hh, detailRatio);

	//this.tileMainMenu(this.smallspots,  xx, yy, ww, hh, detailRatio);
	this.tilePianoRollMenu(this.smalltitles, xx, yy, ww, hh, detailRatio);

	this.tileNewMeasureButton(this.smalltitles, xx, yy, ww, hh, detailRatio);
};
RiffShare2D.prototype.tileOneSmallMeasureLine = function (layer, i, left, top, width, height, ratio) {
	//var changes = this.positionOptionsChanges();
	var x = this.calculateMeasureX(i);
	var w = this.measureWidth32th(i);
	var position = this.currentSong.positions[i];
	for (var n = 0; n < this.currentSong.channels.length; n++) {
		var channel=this.currentSong.channels[n];
		var motif = this.findMotifInPosByChannel(position.motifs, channel.id);
		if (!(channel.hideTrackSheet)) {
			var y = this.calculateTrackSheetY(n) + (0.5 + this.marginTrSheetLines - 4) * this.tapSize;
			var h = (4 + 2 * 4) * this.tapSize;
			var id = 'ln' + i + 'x' + x + 'x' + y;
			var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
			if (g) {
				this.tileText(g, x + 3 * this.tapSize, y - 7 * this.tapSize, 5 * this.tapSize, '' + (1 + i), this.colorBase);
				this.tileRectangle(g, x, y + 4 * this.tapSize, this.lineWidth * ratio, h - 4 * this.tapSize, this.colorBase);
			}
		}
		if (!(channel.hideTrackFret)) {
			var y = this.calculateTrackFretY(n) - 1 * this.tapSize;
			var h = (3 + 2 * this.currentSong.channels[n].string.length) * this.tapSize;
			var id = 'frl' + i + 'x' + x + 'x' + y;
			var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
			if (g) {
				this.tileText(g, x, y, 5 * this.tapSize, '' + (1 + i), this.colorBase);
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
			var channel=this.currentSong.channels[this.currentSong.channels.length-1];
			var motif = this.findMotifInPosByChannel(position.motifs, channel.id);
			//this.tileText(g, x, y, 3 * this.tapSize, '' + (1 + i), this.colorComment);
			this.tileText(g, x + 4 * this.tapSize, y + 9 * this.tapSize, 5 * this.tapSize, '' + (1 + i), this.colorBase);
			this.tileRectangle(g, x, y, this.lineWidth * ratio, h, this.colorBase);

			/*this.addButton('btDlMsre' + i, 'Delete measure', 1 * this.tapSize, g, x, y, 1 * this.tapSize, false //, 0 //, function () {
			riffShare2d.promptDropMeasure(i);
			}, 0);*/
			//this.addZoomAnchor('btMenMsrRl', '' + (1 + i), g, x+this.tapSize, y, 10 * this.tapSize, 0.9 * this.minZoomMedium);

			this.addSimpleButton('btDlMsre' + i, 'Delete measure', g, x + this.tapSize * 2, y + this.tapSize * 1.0, this.tapSize / 2, function () {
				riffShare2d.promptDropMeasure(i);
			});
			this.addSimpleButton('btTmpRlChMsre' + i, 'Change tempo', g, x + this.tapSize * 2, y + this.tapSize * 1.5, this.tapSize / 2, function () {
				riffShare2d.promptMeasureBPM(riffShare2d.currentSong.positions[i]);
			});
			this.addToggleList('btClfRl' + i + '_', motif.clef-1, g, x + this.tapSize * 2, y + this.tapSize * 2.0, this.tapSize / 2, [{
						label: '&#0038;',
						up:-0.05*this.tapSize,
						action: function () {
							riffShare2d.redoChangeClef(motif,1);
						}
					}, {
						label: '&#0063;',
						up:0,
						action: function () {
							riffShare2d.redoChangeClef(motif,2);
						}
					}, {
						label: '&#0066;',
						up:-0.05*this.tapSize,
						action: function () {
							riffShare2d.redoChangeClef(motif,3);
						}
					}, {
						label: '&#0066;',
						up:0.05*this.tapSize,
						action: function () {
							riffShare2d.redoChangeClef(motif,4);
						}
					}	
					, {
						label: '&#0214;',
						up:0,
						action: function () {
							riffShare2d.redoChangeClef(motif,5);
						}
					}, {
						label: '',
						up:0,
						action: function () {
							riffShare2d.redoChangeClef(motif,6);
						}
					}
				]);
		}
	}
};
RiffShare2D.prototype.tileSmallMeasureLines = function (layer, left, top, width, height, ratio) {
	for (var i = 0; i < this.currentSong.positions.length; i++) {
		this.tileOneSmallMeasureLine(layer, i, left, top, width, height, ratio);
	}
};
