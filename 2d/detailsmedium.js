RiffShare2D.prototype.addMediumTiles = function (xx, yy, ww, hh, detailRatio) {
	this.tileSongTitleMenu(this.mediumtitles, xx, yy, ww, hh, detailRatio);
	this.tileMeiumSongOptions(this.mediumtracknames, xx, yy, ww, hh, detailRatio);
	this.tileHugeSongTitle(this.mediumtracknames, xx, yy, ww, hh, detailRatio);
	this.tileSongTexts(this.mediumtitles, xx, yy, ww, hh);
	this.tileMediumTracksTitles(this.mediumtracknames, xx, yy, ww, hh, detailRatio);
	//this.tileTracksTitles(this.mediumtracknames, xx, yy, ww, hh);
	this.tileMarkers(this.mediumtitles, xx, yy, ww, hh);

	this.tileDrumNames(this.mediumtracknames, xx, yy, ww, hh, detailRatio);

	this.tilePianoLines(this.mediumtitles, xx, yy, ww, hh, detailRatio, true);
	//this.tileGridVericalLines(this.mediumgrid, xx, yy, ww, hh, detailRatio);
	//this.tileGridHorLines(this.mediumgrid, xx, yy, ww, hh, detailRatio);
	this.tileSheetGrid(this.mediumgrid, xx, yy, ww, hh, detailRatio);
	this.tileChordGrid(this.mediumgrid, xx, yy, ww, hh, detailRatio);
	
	this.tileFretGrid(this.mediumgrid, xx, yy, ww, hh, detailRatio);
	this.tileMeasureLines(this.mediumborders, xx, yy, ww, hh, detailRatio);
	this.tileOctaveLines(this.mediumborders, xx, yy, ww, hh, detailRatio);
	this.tileScoreLines(this.mediumborders, xx, yy, ww, hh, detailRatio);
	this.tileStrings(this.mediumsymbols, xx, yy, ww, hh, detailRatio,true);
	this.tileFretMotifs(this.mediumsymbols, xx, yy, ww, hh, detailRatio);
	this.tileChordMotifs(this.mediumsymbols, xx, yy, ww, hh, detailRatio);
	this.tileSheetMotifs(this.mediumsymbols, xx, yy, ww, hh, detailRatio);
	this.tileSheetClefs(this.mediumsymbols, xx, yy, ww, hh, detailRatio);
	this.tileRollOctaves(this.mediumsymbols, this.mediumshadow, xx, yy, ww, hh, detailRatio);

	//this.tileHugeTrackControls(this.mediumspots, xx, yy, ww, hh, detailRatio);
	//this.tileMediumTrackControls(this.mediumspots, xx, yy, ww, hh, detailRatio);

	//this.tileMainMenu(this.mediumspots, xx, yy, ww, hh, detailRatio);
	this.tilePianoRollMenu(this.mediumtracknames, xx, yy, ww, hh, detailRatio);
};
/*
RiffShare2D.prototype.tileOnePianoLine = function (x, y, w, h, id, layer, left, top, width, height) {
var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
if (g) {
this.tileRectangle(g, x, y, w, h, this.colorSharp);
}
};*/
RiffShare2D.prototype.tileDrumNames = function (layer, left, top, width, height, ratio) {
	var x = this.marginLeft * this.tapSize;
	var y = this.calculateRollGridY() + 48 * this.tapSize;
	var w = this.songWidth32th();
	var h = 80 * this.tapSize;
	var id = 'drumNames';
	var lw = 2 * this.lineWidth * ratio;
	var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
	//console.log('g',x, y, w, h,'>', left, top, width, height);
	if (g) {
		//console.log('tileDrumNames');
		var n = 35;
		for (var n = 35; n <= 81; n++) {
			this.tileText(layer, x, y + h - (n - 34.75) * this.tapSize, 0.75 * this.tapSize, this.drumNames[n], this.colorComment);
		}
		//n=36;
		//this.tileText(layer, x , y + h-(n-35)*this.tapSize, 1*this.tapSize, this.drumNames[n], this.colorComment);
	}
};
RiffShare2D.prototype.tileMediumOneTrackTitle = function (i, layer, left, top, width, height, ratio) {
	//var x = (this.marginLeft + this.heightPRTitle) * this.tapSize;
	var x = this.marginLeft * this.tapSize;
	var y = this.calculateTrackY(i);
	var w = this.songWidth32th();
	var h = this.heightTrTitle * this.tapSize;
	var lw = 2 * this.lineWidth * ratio;
	if (this.collision(x, y, w, h, left, top, width, height)) {
		var id = 'trackTitle' + i;
		var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
		if (g) {
			var s = h / 11;
			var f = h / 15;
			var d = h / 9;
			var e = x + h / 2;
			var k = h / 27;
			var u = h / 50;
			this.tileText(g, x + 1.2 * h, y + h * 2 / 3, h * 0.75, this.currentSong.channels[i].track, this.colorComment);
			//this.tileText(g, x + 1.2 * h, y + h, h / 1, this.currentSong.channels[i].track, this.colorComment);
			this.addButton('btMenTrTitle' + i, 'Change title', f, g, e, y + 0 * d, s, true, 0, function () {
				var r = prompt('Song title', riffShare2d.currentSong.channels[i].track);
				if (r) {
					//riffShare2d.currentSong.channels[i].track = r;
					riffShare2d.redoChannelTitleChange(riffShare2d.currentSong.channels[i],riffShare2d.currentSong.channels[i].track , r);
				}
			});
			this.addButton('btMenTrDel' + i, 'Delete channel', f, g, e, y + 1 * d, s, true, 0, function () {
				alert('Not implemented yet');
			});
			this.addButton('btMenTrMIDI' + i, 'Change sound', f, g, e, y + 2 * d, s, true, 0, function () {
				alert('Not implemented yet');
			});
			this.addButton('btMenTrSheet123' + i, 'Show sheet', f, g, e, y + 3 * d, s, true, this.currentSong.channels[i].hideTrackSheet ? lw : 0, function () {
				//riffShare2d.currentSong.channels[i].hideTrackSheet = !(!(!(riffShare2d.currentSong.channels[i].hideTrackSheet)));
				riffShare2d.redoToggleChannelSheet(riffShare2d.currentSong.channels[i]);
			});
			this.addButton('btMenTrCho12345' + i, 'Show chords', f, g, e, y + 4 * d, s, true, this.currentSong.channels[i].hideTrackChords ? lw : 0, function () {
				//riffShare2d.currentSong.channels[i].hideTrackChords = !(!(!(riffShare2d.currentSong.channels[i].hideTrackChords)));
				riffShare2d.redoToggleChannelChords(riffShare2d.currentSong.channels[i]);
			});
			this.addButton('btMenTrShowFret' + i, 'Show Fret', f, g, e, y + 5 * d, s, true, this.currentSong.channels[i].hideTrackFret ? lw : 0, function () {
				//riffShare2d.currentSong.channels[i].hideTrackFret = !(!(!(riffShare2d.currentSong.channels[i].hideTrackFret)));
				riffShare2d.redoToggleChannelFrets(riffShare2d.currentSong.channels[i]);
			});
			this.addButton('btMenTrToBg' + i, 'Select', f, g, e, y + 6 * d, s, true, 0, function () {
				//var c = riffShare2d.currentSong.channels.splice(i, 1)[0];
				//riffShare2d.currentSong.channels.push(c);
				//riffShare2d.startSlideTo(riffShare2d.translateX, -riffShare2d.calculateTrackY(riffShare2d.currentSong.channels.length - 1), riffShare2d.minZoomHuge * 0.9);
				riffShare2d.redoSelectChannel(i);
			});
			//
			//console.log(this.currentSong.channels[i].volumes);
			var curVol = Math.round(100 * this.currentSong.channels[i].volumes[0].value / 127);
			//var txVol=Math.round(curVol);
			var spot = this.addButton('btMenTrVoX' + i, '' + curVol + '%', f, g, e + 5 * s, y + 7 * d, s, true, curVol > 90 ? 0 : lw, function () {
				riffShare2d.redoChangeChannelVolume(riffShare2d.currentSong.channels[this.track],riffShare2d.currentSong.channels[this.track].volumes[0].value,100 * 127 / 100);
					/*riffShare2d.currentSong.channels[this.track].volumes = [{
							position : 0,
							value : 100 * 127 / 100
						}
					];*/
				});
			spot.track = i;
			spot = this.addButton('btMenTrVo8' + i, '', f, g, e + 4 * s, y + 7 * d, s, true, curVol > 70 ? 0 : lw, function () {
				riffShare2d.redoChangeChannelVolume(riffShare2d.currentSong.channels[this.track],riffShare2d.currentSong.channels[this.track].volumes[0].value,80 * 127 / 100);
					/*riffShare2d.currentSong.channels[this.track].volumes = [{
							position : 0,
							value : 80 * 127 / 100
						}
					];*/
				});
			spot.track = i;
			spot = this.addButton('btMenTrVo6' + i, '', f, g, e + 3 * s, y + 7 * d, s, true, curVol > 50 ? 0 : lw, function () {
				riffShare2d.redoChangeChannelVolume(riffShare2d.currentSong.channels[this.track],riffShare2d.currentSong.channels[this.track].volumes[0].value,60 * 127 / 100);
					/*riffShare2d.currentSong.channels[this.track].volumes = [{
							position : 0,
							value : 60 * 127 / 100
						}
					];*/
				});
			spot.track = i;
			spot = this.addButton('btMenTrVo4' + i, '', f, g, e + 2 * s, y + 7 * d, s, true, curVol > 30 ? 0 : lw, function () {
				riffShare2d.redoChangeChannelVolume(riffShare2d.currentSong.channels[this.track],riffShare2d.currentSong.channels[this.track].volumes[0].value,40 * 127 / 100);
					/*riffShare2d.currentSong.channels[this.track].volumes = [{
							position : 0,
							value : 40 * 127 / 100
						}
					];*/
				});
			spot.track = i;
			spot = this.addButton('btMenTrVo2' + i, '', f, g, e + 1 * s, y + 7 * d, s, true, curVol > 10 ? 0 : lw, function () {
				riffShare2d.redoChangeChannelVolume(riffShare2d.currentSong.channels[this.track],riffShare2d.currentSong.channels[this.track].volumes[0].value,20 * 127 / 100);
					/*riffShare2d.currentSong.channels[this.track].volumes = [{
							position : 0,
							value : 20 * 127 / 100
						}
					];*/
				});
			spot.track = i;
			spot = this.addButton('btMenTrVo1' + i, 'Volume', f, g, e + 0 * s, y + 7 * d, s, true, 0, function () {
				riffShare2d.redoChangeChannelVolume(riffShare2d.currentSong.channels[this.track],riffShare2d.currentSong.channels[this.track].volumes[0].value,0 * 127 / 100);
					/*riffShare2d.currentSong.channels[this.track].volumes = [{
							position : 0,
							value : 0
						}
					];*/
				});
			spot.track = i;

			//for(var b=32;b<=10;b=b+2){
			//var lbls=['32','64','128','256','512','1k','2k','4k','8k','16k'];
			for (var b = 0; b < 10; b++) {
				//console.log(i,this.currentSong.channels[i]);
				var chv = this.currentSong.channels[i].equalizer[b];
				var stb = 5;
				var enb = 5;
				if (chv > 0) {
					stb = 5 - chv;
					enb = 5;
				} else {
					stb = 5;
					enb = 5 - chv;
				}

				for (var v = 0; v < 11; v++) {

					var spot = this.addButton('eq' + b + 'v' + v + 'c' + i, '', u, g, x + 1.2 * b * k, y + h / 3 + v * k, k, true, v >= stb && v <= enb ? 0 : lw / 3, function () {
							//console.log(this.track,this.band,this.value,this);
							//riffShare2d.currentSong.channels[this.track].equalizer[this.band] = this.value;
							riffShare2d.redoChangeChannelEqualizer(riffShare2d.currentSong.channels[this.track],this.band,riffShare2d.currentSong.channels[this.track].equalizer[this.band],this.value);
						});
					spot.band = b;
					spot.value = 5 - v;
					if (v == 5) {
						spot.value = 0;
					}

					spot.track = i;
				}
			}
			this.tileText(g, x + 0 * 1.2 * k + k / 3, y + h / 3 + 5.75 * k, u, '32', this.colorComment);
			this.tileText(g, x + 1 * 1.2 * k + k / 3, y + h / 3 + 5.75 * k, u, '64', this.colorComment);
			this.tileText(g, x + 2 * 1.2 * k + k / 3, y + h / 3 + 5.75 * k, u, '128', this.colorComment);
			this.tileText(g, x + 3 * 1.2 * k + k / 3, y + h / 3 + 5.75 * k, u, '256', this.colorComment);
			this.tileText(g, x + 4 * 1.2 * k + k / 3, y + h / 3 + 5.75 * k, u, '512', this.colorComment);
			this.tileText(g, x + 5 * 1.2 * k + k / 3, y + h / 3 + 5.75 * k, u, '1k', this.colorComment);
			this.tileText(g, x + 6 * 1.2 * k + k / 3, y + h / 3 + 5.75 * k, u, '2k', this.colorComment);
			this.tileText(g, x + 7 * 1.2 * k + k / 3, y + h / 3 + 5.75 * k, u, '4k', this.colorComment);
			this.tileText(g, x + 8 * 1.2 * k + k / 3, y + h / 3 + 5.75 * k, u, '8k', this.colorComment);
			this.tileText(g, x + 9 * 1.2 * k + k / 3, y + h / 3 + 5.75 * k, u, '16k', this.colorComment);

		}
	}
};
RiffShare2D.prototype.tileMediumTracksTitles = function (layer, left, top, width, height, ratio) {
	for (var i = 0; i < this.currentSong.channels.length; i++) {
		this.tileMediumOneTrackTitle(i, layer, left, top, width, height, ratio);
	}
};

RiffShare2D.prototype.tileMeiumSongOptions = function (layer, left, top, width, height, ratio) {
	var x = this.marginLeft * this.tapSize;
	var y = this.marginTop * this.tapSize;
	var w = this.songWidth32th();
	var h = 10 * this.tapSize;
	var id = 'songOptMenu';
	var lw = 2 * this.lineWidth * ratio;
	var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
	if (g) {
		//this.addButton('btMenSng', '', h/3 , g, x, y, h, true , lw , null,0.9*this.minZoomLarge);


		this.addButton('btMenImp', 'Import song  ', h / 11, g, x, y + 0 * h / 6, h / 7, true, 0, this.promptImportSong);

		this.addButton('btMenExprt', 'Export song', h / 11, g, x, y + 1 * h / 6, h / 7, true, 0, function () {
			alert('Not implemented yet');
		});
		this.addButton('btMenChT', 'Change title ', h / 11, g, x, y + 2 * h / 6, h / 7, true, 0, this.promptChangeSongTitle);
		//this.addButton('btMenAdCh', 'Add channel ', h / 7, g, x, y + 3 * h / 6, h / 7, true, 0, null);

		//console.log('riffShare2d.cellWidth',riffShare2d.cellWidth);

		this.addButton('btMenWi3', '', h / 11, g, x + 2 * h / 7, y + 3 * h / 6, h / 7, true, riffShare2d.cellWidth > 5 ? 0 : lw, function () {
			//console.log('a');
			riffShare2d.cellWidth = 5.75;
		});
		this.addButton('btMenWi2', '', h / 11, g, x + 1 * h / 7, y + 3 * h / 6, h / 7, true, riffShare2d.cellWidth > 3 ? 0 : lw, function () {
			//console.log('b');
			riffShare2d.cellWidth = 3.75;
		});
		this.addButton('btMenWi1', 'Cell width', h / 11, g, x + 0 * h / 7, y + 3 * h / 6, h / 7, true, riffShare2d.cellWidth > 1 ? 0 : lw, function () {
			//console.log('c');
			riffShare2d.cellWidth = 1.75;
		});
		var curVol = Math.round(100 * this.currentSong.volumes[0].value / 127);
		this.addButton('btMenLoud10', '' + curVol + '%', h / 11, g, x + 5 * h / 7, y + 4 * h / 6, h / 7, true, curVol > 90 ? 0 : lw, function () {
			riffShare2d.currentSong.volumes = [{
					position : 0,
					value : 100 * 127 / 100
				}
			];
		});
		this.addButton('btMenLoud8', '           ', h / 7, g, x + 4 * h / 7, y + 4 * h / 6, h / 7, true, curVol > 70 ? 0 : lw, function () {
			riffShare2d.currentSong.volumes = [{
					position : 0,
					value : 80 * 127 / 100
				}
			];
		});
		this.addButton('btMenLoud6', '           ', h / 7, g, x + 3 * h / 7, y + 4 * h / 6, h / 7, true, curVol > 50 ? 0 : lw, function () {
			riffShare2d.currentSong.volumes = [{
					position : 0,
					value : 60 * 127 / 100
				}
			];
		});
		this.addButton('btMenLoud4', '           ', h / 7, g, x + 2 * h / 7, y + 4 * h / 6, h / 7, true, curVol > 30 ? 0 : lw, function () {
			riffShare2d.currentSong.volumes = [{
					position : 0,
					value : 40 * 127 / 100
				}
			];
		});
		this.addButton('btMenLoud2', '           ', h / 7, g, x + 1 * h / 7, y + 4 * h / 6, h / 7, true, curVol > 10 ? 0 : lw, function () {
			riffShare2d.currentSong.volumes = [{
					position : 0,
					value : 20 * 127 / 100
				}
			];
		});
		this.addButton('btMenLoud0', 'Volume    ', h / 11, g, x + 0 * h / 7, y + 4 * h / 6, h / 7, true, 0, function () {
			riffShare2d.currentSong.volumes = [{
					position : 0,
					value : 0 * 127 / 100
				}
			];
		});
		var curEch = Math.round(100 * this.currentSong.echo / 127);
		this.addButton('btMenEch2', '' + (curEch * 50) + '%       ', h / 11, g, x + 2 * h / 7, y + 5 * h / 6, h / 7, true, curEch > 1 ? 0 : lw, function () {
			riffShare2d.currentSong.echo = 2;
		});
		this.addButton('btMenEch1', '           ', h / 7, g, x + 1 * h / 7, y + 5 * h / 6, h / 7, true, curEch > 0 ? 0 : lw, function () {
			riffShare2d.currentSong.echo = 1;
		});
		this.addButton('btMenEch0', 'Echo      ', h / 11, g, x + 0 * h / 7, y + 5 * h / 6, h / 7, true, 0, function () {
			riffShare2d.currentSong.echo = 0;
		});

	}
};
RiffShare2D.prototype.tilePianoLines = function (layer, left, top, width, height, ratio, act) {
	var clr = this.colorPianoKeys;
	if (act) {
		clr = this.colorGrid;
	}
	if (!riffShare2d.currentSong.hideRoll) {
		var x = this.marginLeft * this.tapSize;
		var w = this.songWidth32th();
		var h = 12 * this.tapSize;
		for (var i = 0; i < 128; i = i + 12) {
			var id = 'pili' + i; // + 'ef';
			var y = this.calculateRollGridY() + 128 * this.tapSize - i * this.tapSize;
			var g = this.rakeGroup(x, y - h, w, h, id, layer, left, top, width, height);
			if (g) {
				this.tileRectangle(g, x, y - 2 * this.tapSize, w, this.tapSize, clr);
				this.tileRectangle(g, x, y - 4 * this.tapSize, w, this.tapSize, clr);
				this.tileRectangle(g, x, y - 5 * this.tapSize, w, this.lineWidth * ratio, clr);
				this.tileRectangle(g, x, y - 7 * this.tapSize, w, this.tapSize, clr);
				if (i < 120) {
					this.tileRectangle(g, x, y - 9 * this.tapSize, w, this.tapSize, clr);
					this.tileRectangle(g, x, y - 11 * this.tapSize, w, this.tapSize, clr);
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
	var changes = this.positionOptionsChanges();
	for (var t = 0; t < this.currentSong.positions.length; t++) {
		var x = this.calculateMeasureX(t, changes);
		//var y = (this.marginTop + this.heightSongTitle + this.heightSongText) * this.tapSize;
		var w = this.measureWidth32th(t, changes);
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
					var len16 = 16 * this.currentSong.positions[t].meter / this.currentSong.positions[t].by;
					//for (var s = 0; s < this.currentSong.positions[t].meter * this.currentSong.positions[t].by; s++) {
					for (var s = 0; s < len16; s++) {
						this.tileRectangle(g, x + this.measureMargin(t, changes) + this.cellWidth * s * this.tapSize, y, this.lineWidth * ratio, h, this.colorGrid);
					}
				}
			}
		}
		if (!this.currentSong.hideRoll) {
			var h = this.heightPRGrid * this.tapSize;
			y = this.calculateRollGridY();
			var id = 'gvR' + x;
			var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
			if (g) {
				//this.tileRectangle(g, x, y, w, h, this.colorComment);
				//this.tileText(g, x, y, 5 * this.tapSize, '' + (1 + t), this.colorComment);
				var len16 = 16 * this.currentSong.positions[t].meter / this.currentSong.positions[t].by;
				//for (var s = 1; s < this.currentSong.positions[t].meter * this.currentSong.positions[t].by; s++) {
				for (var s = 1; s < len16; s++) {
					this.tileRectangle(g, x + this.measureMargin(t, changes) + this.cellWidth * s * this.tapSize, y, this.lineWidth * ratio, h, this.colorGrid);
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
		if (!(riffShare2d.currentSong.channels[i].hideTrackSheet)) {
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
		this.addSpot('trackControl' + nn + 'x' + channel, x + w / 2 - r - this.tapSize, y + nn * 2 * this.tapSize - this.tapSize, 2 * this.tapSize, 2 * this.tapSize, action);
	}
}
/*
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
 */
RiffShare2D.prototype.tileSheetGrid = function (layer, left, top, width, height, ratio) {
	var changes = this.positionOptionsChanges();
	for (var t = 0; t < this.currentSong.positions.length; t++) {
		var x = this.calculateMeasureX(t, changes);
		var w = this.measureWidth32th(t, changes);
		for (var i = 0; i < this.currentSong.channels.length; i++) {
			if (this.currentSong.channels[i].hideTrackSheet) {
				//
			} else {
				var h = this.heightTrSheet * this.tapSize;
				//if (h > this.heightTrTitle * this.tapSize) {
				var y = this.calculateTrackSheetY(i);
				var id = 'gv' + i + 'x' + x + 'x' + y;
				var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
				if (g) {
					var len16 = 16 * this.currentSong.positions[t].meter / this.currentSong.positions[t].by;
					var xPos = x + this.measureMargin(t, changes);
					for (var s = 0; s < len16; s++) {
						this.tileRectangle(g, xPos + this.cellWidth * s * this.tapSize, y, this.lineWidth * ratio, h, this.colorGrid);
					}
					for (var s = 1; s < this.heightTrSheet; s++) {
						this.tileRectangle(g, xPos, y + s * this.tapSize, w, this.lineWidth * ratio, this.colorGrid);
					}
				}
			}
		}
	}
};
RiffShare2D.prototype.tileFretGrid = function (layer, left, top, width, height, ratio) {
	var changes = this.positionOptionsChanges();
	for (var t = 0; t < this.currentSong.positions.length; t++) {
		var x = this.calculateMeasureX(t, changes);
		var w = this.measureWidth32th(t, changes);
		for (var i = 0; i < this.currentSong.channels.length; i++) {
			if (this.currentSong.channels[i].hideTrackFret) {
				//
			} else {
				var h = this.currentSong.channels[i].string.length * this.tapSize*2-this.tapSize;
				//if (h > this.heightTrTitle * this.tapSize) {
				var y = this.calculateTrackFretY(i);
				var id = 'frv' + i + 'x' + x + 'x' + y;
				var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
				if (g) {
					var len16 = 16 * this.currentSong.positions[t].meter / this.currentSong.positions[t].by;
					var xPos = x + this.measureMargin(t, changes);
					for (var s = 0; s < len16; s++) {
						this.tileRectangle(g, xPos + this.cellWidth * s * this.tapSize, y, this.lineWidth * ratio, h, this.colorGrid);
					}
				}
			}
		}
	}
};
RiffShare2D.prototype.tileChordGrid = function (layer, left, top, width, height, ratio) {
	var changes = this.positionOptionsChanges();
	for (var t = 0; t < this.currentSong.positions.length; t++) {
		var x = this.calculateMeasureX(t, changes);
		var w = this.measureWidth32th(t, changes);
		for (var i = 0; i < this.currentSong.channels.length; i++) {
			if (this.currentSong.channels[i].hideTrackChords) {
				//
			} else {
				var h = 1 * this.tapSize;
				//if (h > this.heightTrTitle * this.tapSize) {
				//var y = this.calculateTrackChordsY(i)+(this.heightTrChords-0.5) * this.tapSize;
				var y = this.calculateTrackChordsY(i);
				var id = 'chrG' + i + 'x' + x + 'x' + y;
				var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
				if (g) {
					var len16 = 16 * this.currentSong.positions[t].meter / this.currentSong.positions[t].by;
					var xPos = x + this.measureMargin(t, changes);
					for (var s = 0; s < len16; s++) {
						this.tileRectangle(g, xPos + this.cellWidth * s * this.tapSize, y+(this.heightTrChords-3.5) * this.tapSize, this.lineWidth * ratio, h, this.colorGrid);
					}
					this.tileRectangle(g, xPos , y+(this.heightTrChords-3) * this.tapSize, w,this.lineWidth * ratio, this.colorGrid);
				}
			}
		}
	}
};

