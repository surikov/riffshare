RiffShare2D.prototype.addLargeTiles = function (xx, yy, ww, hh, detailRatio) {
	this.tileSongTitle(this.largetitles, xx, yy, ww, hh);
	this.tileSongTracks(this.largetitles, xx, yy, ww, hh);
	this.tileSongRoll(this.largetitles, xx, yy, ww, hh);
	this.tileMeasureLines(this.largetitles, xx, yy, ww, hh, detailRatio);
	this.tileOctaveLines(this.largetitles, xx, yy, ww, hh, detailRatio);
	this.tileScoreLines(this.largetitles, xx, yy, ww, hh, detailRatio);
	this.tileStrings(this.largetitles, xx, yy, ww, hh, detailRatio);
	this.tileFretMotifs(this.largetitles, xx, yy, ww, hh, detailRatio);
	
	
	//this.tilePianoLines(this.largetitles, xx, yy, ww, hh, detailRatio);
};
RiffShare2D.prototype.tileMeasureLines = function (layer,left, top, width, height, ratio) {
	var y=this.calculateTrackY(0);
	var h=this.calculateAllTracksHeight()+this.calculateRollHeight();
	for (var i = 0; i < this.currentSong.positions.length; i++) {
		var x=this.calculateMeasureX(i);
		var w=this.measureLength(i);
		var id = 'ln' + i + 'x' + x + 'x' + y;
		var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
		if (g) {
			this.tileText(g, x, y, 3 * this.tapSize, '' + (1 + i), this.colorComment);
			this.tileRectangle(g, x, y, this.lineWidth * ratio, h, this.colorComment);
		}
	}
};
RiffShare2D.prototype.tileOctaveLines = function (layer, left, top, width, height, ratio) {
	if (!riffShare2d.hideRoll) {
		var x = this.marginLeft * this.tapSize;
		var w = this.measuresLength16th();
		var h = this.lineWidth * ratio;
		for (var i = 12; i < 128; i = i + 12) {
			//y = (this.marginTop + this.heightSongTitle + this.heightSongText + this.calculateAllTracksHeight() + this.heightPRTitle + this.heightPRGrid - i) * this.tapSize;
			y=this.calculateRollGridY()+(this.heightPRGrid - i)*this.tapSize;
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
	var w = this.measuresLength16th() ;
	//var h = this.lineWidth * ratio;
	var h=this.heightTrSheet* this.tapSize
	for (var i = 0; i < this.currentSong.channels.length; i++) {
		if (!(this.hideTrackSheet[i])) {
			var y=this.calculateTrackSheetY(i);
			var id = 'sco' + i;
			var g = this.rakeGroup(x, y, w, h , id, layer, left, top, width, height);
			if (g) {
				for (var s = 0; s < 5; s++) {
					//this.tileRectangle(g, x, y + (0.5 + s * 2 + this.heightTrTitle + this.marginTrSheetLines) * this.tapSize, w, h, this.colorComment);
					this.tileRectangle(g, x, y +(0.5+this.marginTrSheetLines+2*s) * this.tapSize, w, this.lineWidth * ratio, this.colorComment);
				}
			}
		}
		//y = y + this.calculateTrackHeight(i) * this.tapSize;
	}
};
RiffShare2D.prototype.tileStrings = function (layer, left, top, width, height, ratio) {
	var x = this.marginLeft * this.tapSize;
	//var y = (this.marginTop + this.heightSongTitle + this.heightSongText) * this.tapSize;
	var w = this.measuresLength16th() * this.tapSize;
	
	for (var i = 0; i < this.currentSong.channels.length; i++) {
		if (!(this.hideTrackFret[i])) {
			var y=this.calculateTrackFretY(i);
			var h=(this.currentSong.channels[i].string.length+1)* this.tapSize;
			var id = 'str' + i;
			var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
			if (g) {
				for (var s = 0; s < this.currentSong.channels[i].string.length; s++) {
					this.tileRectangle(g, x, y + (0.5+s ) * this.tapSize, w, this.lineWidth * ratio, this.colorComment);
				}
			}
		}
		//y = y + this.calculateTrackHeight(i) * this.tapSize;
	}
};
RiffShare2D.prototype.tileFretMotifs = function (layer, left, top, width, height, ratio) {
	var x = this.marginLeft * this.tapSize;
	//var y = (this.marginTop + this.heightSongTitle + this.heightSongText) * this.tapSize;
	var w = this.measuresLength16th();
	
	for (var i = 0; i < this.currentSong.channels.length; i++) {
		var channel=this.currentSong.channels[i];
		var h=this.currentSong.channels[i].string.length* this.tapSize;
		//y=y+(this.heightTrTitle+this.heightTrSheet+this.heightTrChords+this.heightTrText) * this.tapSize;
		y=this.calculateTrackFretY(i);
		if (this.collision(x, y, w, h, left, top, width, height)) {
			//console.log('fret',i);
			//this.tilePlaceHolder(x, y, w, h, '_fch' + i, layer, left, top, width, height, 1);
			for(var k=0;k<this.currentSong.positions.length;k++){
				var posX=this.calculateMeasureX(k);
				var posW=this.measureLength(k);
				if (this.collision(posX, y, posW, h, left, top, width, height)) {
					var position=this.currentSong.positions[k];
					for (var n = 0; n < position.motifs.length; n++) {
						var motif = position.motifs[n];
						if (motif.channel == channel.id) {
							var id='fretPos'+motif.channel+'x'+motif.motif;
							var offset=channel.offset;//+this.cleffOffset(motif.clef);
							var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
							if (g) {
								var data=this.findMotifById(motif.motif);
								//console.log(i,k,data);
								if (data.chords.length > 0) {
									for (var c = 0; c < data.chords.length; c++) {
										var chord = data.chords[c];
										for (var n = 0; n < chord.notes.length; n++) {
											var note = chord.notes[n];
											var t=note.key-offset-this.channelStringKey(note.string,channel);
											var colordeep=this.fretLineColor(t);
											var ny=y + this.tapSize * 1 * (channel.string.length-1)-this.tapSize * 1 *(channel.string.length-note.string)+this.tapSize*0.5;
											var nx=posX+this.measureMargin(k)-this.tapSize*0.5 + chord.start * 1 * this.tapSize + this.tapSize * 1;
											this.tileLine(g
												, nx
												, ny
												, nx + 1+1*this.tapSize*(note.l6th-1)
												, ny
												, colordeep, this.tapSize *0.99);
											this.tileText(g, nx-0.3*this.tapSize, ny-0.7*this.tapSize, 1.3*this.tapSize, ''+t, '#fff', colordeep, this.tapSize / 50);
										}
									}
								}
							}
						}
					}
				}
				
			}
		}
		//y=y+h;
	}
}
