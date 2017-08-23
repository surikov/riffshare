RiffShare2D.prototype.addMediumTiles = function (xx, yy, ww, hh, detailRatio) {
	this.tileSongTitleMenu(this.mediumtitles, xx, yy, ww, hh, detailRatio);
	this.tileMeiumSongOptions(this.mediumtitles, xx, yy, ww, hh, detailRatio);
	this.tileHugeSongTitle(this.mediumtracknames, xx, yy, ww, hh, detailRatio);
	this.tileSongTexts(this.mediumtitles, xx, yy, ww, hh);
	this.tileMediumTracksTitles(this.mediumtracknames, xx, yy, ww, hh, detailRatio);
	this.tileMediumTracksOptions(this.mediumtitles, xx, yy, ww, hh, detailRatio);

	//this.tileTracksTitles(this.mediumtracknames, xx, yy, ww, hh);
	this.tileMarkers(this.mediumtitles, xx, yy, ww, hh);

	this.tileDrumNames(this.mediumtracknames, xx, yy, ww, hh, detailRatio);

	this.tilePianoLines(this.mediumtitles, xx, yy, ww, hh, detailRatio, true);
	//this.tileGridVericalLines(this.mediumgrid, xx, yy, ww, hh, detailRatio);
	//this.tileGridHorLines(this.mediumgrid, xx, yy, ww, hh, detailRatio);
	this.tileSheetGrid(this.mediumgrid, xx, yy, ww, hh, detailRatio);
	this.tileChordGrid(this.mediumgrid, xx, yy, ww, hh, detailRatio);
	this.tileRollGrid(this.mediumgrid, xx, yy, ww, hh, detailRatio);
	this.tileFretGrid(this.mediumgrid, xx, yy, ww, hh, detailRatio);
	this.tileLargeMeasureLines(this.mediumborders, xx, yy, ww, hh, detailRatio);
	this.tileOctaveLines(this.mediumborders, xx, yy, ww, hh, detailRatio);
	this.tileScoreLines(this.mediumborders, xx, yy, ww, hh, detailRatio);
	this.tileStrings(this.mediumsymbols, xx, yy, ww, hh, detailRatio, true);
	this.tileFretMotifs(this.mediumsymbols, xx, yy, ww, hh, detailRatio);
	this.tileChordMotifs(this.mediumsymbols, xx, yy, ww, hh, detailRatio);
	this.tileSheetMotifs(this.mediumsymbols, xx, yy, ww, hh, detailRatio);
	this.tileSheetClefs(this.mediumsymbols, xx, yy, ww, hh, detailRatio);
	this.tileRollOctaves(this.mediumsymbols, this.mediumshadow, xx, yy, ww, hh, detailRatio);

	//this.tileHugeTrackControls(this.mediumspots, xx, yy, ww, hh, detailRatio);
	//this.tileMediumTrackControls(this.mediumspots, xx, yy, ww, hh, detailRatio);

	//this.tileMainMenu(this.mediumspots, xx, yy, ww, hh, detailRatio);
	this.tilePianoRollMenu(this.mediumtitles, xx, yy, ww, hh, detailRatio);

	this.tileNewMeasureButton(this.mediumgrid, xx, yy, ww, hh, detailRatio);

	this.addRollSpot(this.mediumgrid, xx, yy, ww, hh, detailRatio);
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
			this.tileText(layer, x, y + h - (n - 34.75) * this.tapSize, 0.75 * this.tapSize, this.drumNames[n], this.colorAux);
		}
		//n=36;
		//this.tileText(layer, x , y + h-(n-35)*this.tapSize, 1*this.tapSize, this.drumNames[n], this.colorComment);
	}
};

RiffShare2D.prototype.tileMediumOneTrackTitle = function (i, layer, left, top, width, height, ratio) {
	var x = this.marginLeft * this.tapSize;
	var y = this.calculateTrackY(i);
	var w = this.songWidth32th();
	var h = this.heightTrTitle * this.tapSize;
	var lw = 2 * this.lineWidth * ratio;
	if (this.collision(x, y, w, h, left, top, width, height)) {
		var id = 'trackTitleText' + i;
		var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
		if (g) {
			//this.tileText(g, x , y + h * 2 / 3, h * 0.75, this.currentSong.channels[i].track, this.colorHot);
			this.tileText(g, x, y + h, h * 0.25, this.currentSong.channels[i].track, this.colorHot);
		}
	}
};
RiffShare2D.prototype.tileMediumOneTrackOptions = function (i, layer, left, top, width, height, ratio) {
	//var x = (this.marginLeft + this.heightPRTitle) * this.tapSize;
	var x = 0; //this.marginLeft * this.tapSize;
	var y = this.calculateTrackY(i);
	var w = this.songWidth32th();
	var h = this.heightTrTitle * this.tapSize;
	var lw = 2 * this.lineWidth * ratio;
	var channelI = riffShare2d.currentSong.channels[i];
	if (this.collision(x, y, w, h, left, top, width, height)) {
		var id = 'trackTitle' + i;
		var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
		if (g) {
			this.addSpot(id, x + this.marginLeft * this.tapSize, y, w - this.marginLeft * this.tapSize - this.marginRight * this.tapSize, h, function () {
				riffShare2d.redoSelectChannel(i);
			});

			this.tileRectangle(g, x + this.marginLeft * this.tapSize, y, w, this.lineWidth * ratio, this.colorHot);
			var s = h / 11;
			var f = h / 15;
			var d = h / 9;
			var e = this.tapSize * 20; //x + h / 2;
			var k = h / 27;
			var u = h / 50;

			this.addSimpleButton('btMenTrDel' + i, 'Delete channel', g, e, y + 1 * d, s, function () {
				riffShare2d.promptDropChannel(riffShare2d.currentSong.channels[i]);
			});
			this.addSimpleButton('btMenTrMIDI' + i, 'Change sound', g, e, y + 2 * d, s, function () {
				alert('Not implemented yet');
			});
			if (this.currentSong.channels[i].hideTrackSheet) {
				this.addHollowButton('btMenTrSheet123' + i, 'Show sheet', g, e, y + 3 * d, s, function () {
					riffShare2d.redoToggleChannelSheet(riffShare2d.currentSong.channels[i]);
				});
			} else {
				this.addSimpleButton('btMenTrSheet123' + i, 'Hide sheet', g, e, y + 3 * d, s, function () {
					riffShare2d.redoToggleChannelSheet(riffShare2d.currentSong.channels[i]);
				});
			}
			if (this.currentSong.channels[i].hideTrackChords) {
				this.addHollowButton('btMenTrCho12345' + i, 'Show chords', g, e, y + 4 * d, s, function () {
					riffShare2d.redoToggleChannelChords(riffShare2d.currentSong.channels[i]);
				});
			} else {
				this.addSimpleButton('btMenTrCho12345' + i, 'Hide chords', g, e, y + 4 * d, s, function () {
					riffShare2d.redoToggleChannelChords(riffShare2d.currentSong.channels[i]);
				});
			}
			if (this.currentSong.channels[i].hideTrackFret) {
				this.addHollowButton('btMenTrShowFret' + i, 'Show frets', g, e, y + 5 * d, s, function () {
					riffShare2d.redoToggleChannelFrets(riffShare2d.currentSong.channels[i]);
				});
			} else {
				this.addSimpleButton('btMenTrShowFret' + i, 'Hide frets', g, e, y + 5 * d, s, function () {
					riffShare2d.redoToggleChannelFrets(riffShare2d.currentSong.channels[i]);
				});
			}
			/*this.addSimpleButton('btMenTrToBg' + i, 'Select', g, e, y + 6 * d, s, function () {
			riffShare2d.redoSelectChannel(i);
			});*/
			this.addSimpleButton('btMenTrTitle' + i, 'Change title', g, e, y + 6 * d, s, function () {
				var r = prompt('Track title', riffShare2d.currentSong.channels[i].track);
				if (r) {
					riffShare2d.redoChannelTitleChange(riffShare2d.currentSong.channels[i], riffShare2d.currentSong.channels[i].track, r);
				}
			});
			var curVol = Math.round(100 * this.currentSong.channels[i].volumes[0].value / 127);
			this.addRangeButtons('btMenTrVoX' + i + '_', 'Volume', curVol, g, e, y + 7 * d, s, [{
						label : 'Mute',
						value : 0
					}, {
						label : '20%',
						value : 20
					}, {
						label : '40%',
						value : 40
					}, {
						label : '60%',
						value : 60
					}, {
						label : '80%',
						value : 80
					}, {
						label : 'Max',
						value : 100
					}
				], function (newVal) {
				riffShare2d.redoChangeChannelVolume(channelI, channelI.volumes[0].value, newVal * 127 / 100);
			});

			for (var b = 0; b < 10; b++) {
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
					var spot = null;
					if (v >= stb && v <= enb) {
						spot = this.addSimpleButton('eq' + b + 'v' + v + 'c' + i, '', g, 27 * this.tapSize + x + 1.2 * b * k, y + h / 7 + v * k, k, function () {
								riffShare2d.redoChangeChannelEqualizer(riffShare2d.currentSong.channels[this.track], this.band, riffShare2d.currentSong.channels[this.track].equalizer[this.band], this.value);
							});
					} else {
						spot = this.addHollowButton('eq' + b + 'v' + v + 'c' + i, '', g, 27 * this.tapSize + x + 1.2 * b * k, y + h / 7 + v * k, k, function () {
								riffShare2d.redoChangeChannelEqualizer(riffShare2d.currentSong.channels[this.track], this.band, riffShare2d.currentSong.channels[this.track].equalizer[this.band], this.value);
							});
					}
					spot.band = b;
					spot.value = 5 - v;
					if (v == 5) {
						spot.value = 0;
					}
					spot.track = i;
				}
			}
			this.tileText(g, 27 * this.tapSize + x + 0 * 1.2 * k + k / 3, y + h / 7 + 5.75 * k, u, '32', this.colorBase);
			this.tileText(g, 27 * this.tapSize + x + 1 * 1.2 * k + k / 3, y + h / 7 + 5.75 * k, u, '64', this.colorBase);
			this.tileText(g, 27 * this.tapSize + x + 2 * 1.2 * k + k / 3, y + h / 7 + 5.75 * k, u, '128', this.colorBase);
			this.tileText(g, 27 * this.tapSize + x + 3 * 1.2 * k + k / 3, y + h / 7 + 5.75 * k, u, '256', this.colorBase);
			this.tileText(g, 27 * this.tapSize + x + 4 * 1.2 * k + k / 3, y + h / 7 + 5.75 * k, u, '512', this.colorBase);
			this.tileText(g, 27 * this.tapSize + x + 5 * 1.2 * k + k / 3, y + h / 7 + 5.75 * k, u, '1k', this.colorBase);
			this.tileText(g, 27 * this.tapSize + x + 6 * 1.2 * k + k / 3, y + h / 7 + 5.75 * k, u, '2k', this.colorBase);
			this.tileText(g, 27 * this.tapSize + x + 7 * 1.2 * k + k / 3, y + h / 7 + 5.75 * k, u, '4k', this.colorBase);
			this.tileText(g, 27 * this.tapSize + x + 8 * 1.2 * k + k / 3, y + h / 7 + 5.75 * k, u, '8k', this.colorBase);
			this.tileText(g, 27 * this.tapSize + x + 9 * 1.2 * k + k / 3, y + h / 7 + 5.75 * k, u, '16k', this.colorBase);
		}
	}
};
RiffShare2D.prototype.tileMediumTracksOptions = function (layer, left, top, width, height, ratio) {
	for (var i = 0; i < this.currentSong.channels.length; i++) {
		this.tileMediumOneTrackOptions(i, layer, left, top, width, height, ratio);
	}
};
RiffShare2D.prototype.tileMediumTracksTitles = function (layer, left, top, width, height, ratio) {
	for (var i = 0; i < this.currentSong.channels.length; i++) {
		this.tileMediumOneTrackTitle(i, layer, left, top, width, height, ratio);
	}
};
RiffShare2D.prototype.tileMeiumSongOptions = function (layer, left, top, width, height, ratio) {
	var x = this.marginLeft * this.tapSize - 30 * this.tapSize;
	var y = this.marginTop * this.tapSize + 10 * this.tapSize;
	var w = this.songWidth32th();
	var h = 10 * this.tapSize;
	var id = 'songOptMenu';
	var lw = 2 * this.lineWidth * ratio;
	var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
	if (g) {
		this.addSimpleStuckButton('btMenImp', 'Import song  ', g, x, y + 0 * h / 6, h / 7, this.promptImportSong);
		this.addSimpleStuckButton('btMenNwSn', 'New song', g, x, y + 1 * h / 6, h / 7, function () {
			riffShare2d.promptNewSong();
		});
		this.addSimpleStuckButton('btMenChT', 'Change title ', g, x, y + 2 * h / 6, h / 7, this.promptChangeSongTitle);
		this.addRangeButtons('btMenWi_', 'Cell width', riffShare2d.cellWidth, g, x, y + 3 * h / 6, h / 7, [{
					label : 'tiny',
					value : riffShare2d.cellWidth1
				}, {
					label : 'normal',
					value : riffShare2d.cellWidth2
				}, {
					label : 'wide',
					value : riffShare2d.cellWidth3
				}
			], function (newVal) {
			riffShare2d.redoChangeCellWidth(riffShare2d.cellWidth, newVal);
		});
		var curVol = Math.round(100 * this.currentSong.volumes[0].value / 127);
		this.addRangeButtons('btMenLoud_', 'Volume', curVol, g, x, y + 4 * h / 6, h / 7, [{
					label : 'min',
					value : 0
				}, {
					label : '20%',
					value : 20
				}, {
					label : '40%',
					value : 40
				}, {
					label : '60%',
					value : 60
				}, {
					label : '80%',
					value : 80
				}, {
					label : 'max',
					value : 100
				}
			], function (newVal) {
			riffShare2d.redoChangeSongVolume(riffShare2d.currentSong.volumes[0].value, newVal * 127 / 100);
		});
		this.addRangeButtons('btMenEch_', 'Echo', riffShare2d.currentSong.echo, g, x, y + 5 * h / 6, h / 7, [{
					label : 'none',
					value : 0
				}, {
					label : 'small',
					value : 1
				}, {
					label : 'big',
					value : 2
				}
			], function (newVal) {
			riffShare2d.redoChangeEcho(riffShare2d.currentSong.echo, newVal);
		});
	}
};
RiffShare2D.prototype.tilePianoLines = function (layer, left, top, width, height, ratio, act) {
	var clr = this.colorNearBG;
	if (act) {
		clr = this.colorHot;
	}
	if (!riffShare2d.currentSong.hideRoll) {
		var x = this.marginLeft * this.tapSize;
		var w = this.songWidth32th();
		var h = 12 * this.tapSize;
		for (var i = 0; i < 12 * 9; i = i + 12) {
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
						this.tileRectangle(g, x + this.measureMargin(t, changes) + this.cellWidth * s * this.tapSize, y, this.lineWidth * ratio, h, this.colorHot);
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
				var len16 = 16 * this.currentSong.positions[t].meter / this.currentSong.positions[t].by * this.cellDurationRatio();
				//for (var s = 1; s < this.currentSong.positions[t].meter * this.currentSong.positions[t].by; s++) {
				for (var s = 1; s < len16; s++) {
					this.tileRectangle(g, x + this.measureMargin(t, changes) + this.cellWidth * s * this.tapSize, y, this.lineWidth * ratio, h, this.colorHot);
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
					this.tileRectangle(g, x, y + s, w, this.lineWidth * ratio, this.colorHot);
				}
			}
		}
		//y = y + this.calculateTrackHeight(i) * this.tapSize;
	}
};
RiffShare2D.prototype.tileOneMediumTrackControlSpot = function (channel, fill, nn, r, g, x, y, w, h, layer, left, top, width, height, detailRatio, text, action) {
	//this.tileCircle(g, x + w / 2 - r, y + nn * 2.0 * this.tapSize, 0.9 * this.tapSize, this.colorAction, 'none', 0);
	if (fill) {
		this.tileCircle(g, x + w / 2 - r, y + nn * 2.0 * this.tapSize, 0.9 * this.tapSize, this.colorHot, 'none', this.lineWidth * detailRatio);
	} else {
		this.tileCircle(g, x + w / 2 - r, y + nn * 2.0 * this.tapSize, 0.9 * this.tapSize, 'none', this.colorHot, this.lineWidth * detailRatio);
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
					var len16 = 16 * this.currentSong.positions[t].meter / this.currentSong.positions[t].by * this.cellDurationRatio();
					var xPos = x + this.measureMargin(t, changes);
					for (var s = 0; s < len16; s++) {
						this.tileRectangle(g, xPos + this.cellWidth * s * this.tapSize, y, this.lineWidth * ratio, h, this.colorHot);
					}
					for (var s = 1; s < this.heightTrSheet; s++) {
						this.tileRectangle(g, xPos, y + s * this.tapSize, w, this.lineWidth * ratio, this.colorHot);
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
				var h = this.currentSong.channels[i].string.length * this.tapSize * 2 - this.tapSize;
				//if (h > this.heightTrTitle * this.tapSize) {
				var y = this.calculateTrackFretY(i);
				var id = 'frv' + i + 'x' + x + 'x' + y;
				var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
				if (g) {
					var len16 = 16 * this.currentSong.positions[t].meter / this.currentSong.positions[t].by * this.cellDurationRatio();
					var xPos = x + this.measureMargin(t, changes);
					for (var s = 0; s < len16; s++) {
						this.tileRectangle(g, xPos + this.cellWidth * s * this.tapSize, y, this.lineWidth * ratio, h, this.colorHot);
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
					var len16 = 16 * this.currentSong.positions[t].meter / this.currentSong.positions[t].by * this.cellDurationRatio();
					var xPos = x + this.measureMargin(t, changes);
					for (var s = 0; s < len16; s++) {
						this.tileRectangle(g, xPos + this.cellWidth * s * this.tapSize, y + (this.heightTrChords - 3.5) * this.tapSize, this.lineWidth * ratio, h, this.colorHot);
					}
					this.tileRectangle(g, xPos, y + (this.heightTrChords - 3) * this.tapSize, w, this.lineWidth * ratio, this.colorHot);
				}
			}
		}
	}
};
RiffShare2D.prototype.tileRollGrid = function (layer, left, top, width, height, ratio) {
	var changes = this.positionOptionsChanges();
	for (var t = 0; t < this.currentSong.positions.length; t++) {
		var x = this.calculateMeasureX(t, changes);
		var y = this.calculateRollGridY() + (128 - 12 * 9) * this.tapSize;
		var w = this.measureWidth32th(t, changes);
		var h = 12 * 9 * this.tapSize;
		for (var i = 0; i < this.currentSong.channels.length; i++) {
			if (this.currentSong.channels[i].hideTrackChords) {
				//
			} else {
				var id = 'rllG' + i + 'x' + x;
				var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
				if (g) {
					var len16 = 16 * this.currentSong.positions[t].meter / this.currentSong.positions[t].by * this.cellDurationRatio();
					var xPos = x + this.measureMargin(t, changes);
					for (var s = 0; s < len16; s++) {
						this.tileRectangle(g, xPos + this.cellWidth * s * this.tapSize, y, this.lineWidth * ratio / 2, h, this.colorHot);
					}
				}
			}
		}
	}
};
RiffShare2D.prototype.addRollSpot = function (layer, left, top, width, height, ratio) {
	var id = 'rollNotes';
	var x = this.marginLeft * this.tapSize;
	var y = this.calculateRollGridY() + (128 - 12 * 9) * this.tapSize;
	var w = this.songWidth32th();
	var h = 12 * 9 * this.tapSize;
	var g = this.rakeGroup(x + 9 * this.tapSize, y, w, h, id, layer, left, top, width, height);
	if (g) {
		//this.tileRectangle(g, x+9*this.tapSize, y, w, h);
	}
	this.addSpot(id, x, y, w, h, function () {
		//console.log('roll',riffShare2d.clickContentX,riffShare2d.clickContentY,riffShare2d.findPositionByContentY());
		var n = riffShare2d.findPositionByContentY();
		if (n) {
			riffShare2d.startNote(n); //.start,n.key,n.position);
		}
	});
}
