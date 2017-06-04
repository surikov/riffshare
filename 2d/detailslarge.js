RiffShare2D.prototype.addLargeTiles = function (xx, yy, ww, hh, detailRatio) {
	this.tileSongTitle(this.largetitles, xx, yy, ww, hh);
	this.tileSongTracks(this.largetitles, xx, yy, ww, hh);
	this.tileSongRoll(this.largetitles, xx, yy, ww, hh);
	this.tileMeasureLines(this.largetitles, xx, yy, ww, hh, detailRatio);
	this.tileOctaveLines(this.largetitles, xx, yy, ww, hh, detailRatio);
	this.tileScoreLines(this.largetitles, xx, yy, ww, hh, detailRatio);
	this.tileStrings(this.largetitles, xx, yy, ww, hh, detailRatio);
	this.tileFretMotifs(this.largetitles, xx, yy, ww, hh, detailRatio);
	this.tileSheetMotifs(this.largetitles, xx, yy, ww, hh, detailRatio);
	this.tileRollOctaves(this.largetitles, xx, yy, ww, hh, detailRatio);
	//this.tilePianoLines(this.largetitles, xx, yy, ww, hh, detailRatio);
};
RiffShare2D.prototype.tileMeasureLines = function (layer,left, top, width, height, ratio) {
	var y=this.calculateTrackY(0);
	var h=this.calculateAllTracksHeight()+this.calculateRollHeight();
	for (var i = 0; i < this.currentSong.positions.length; i++) {
		var x=this.calculateMeasureX(i);
		var w=this.measureWidth32th(i);
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
		var w = this.songWidth32th();
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
	var w = this.songWidth32th() ;
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
	var w = this.songWidth32th();
	
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
	var w = this.songWidth32th();
	
	for (var i = 0; i < this.currentSong.channels.length; i++) {
		if (!(riffShare2d.hideTrackSheet[i])) {
		var channel=this.currentSong.channels[i];
		var h=this.currentSong.channels[i].string.length* this.tapSize;
		//y=y+(this.heightTrTitle+this.heightTrSheet+this.heightTrChords+this.heightTrText) * this.tapSize;
		y=this.calculateTrackFretY(i);
		if (this.collision(x, y, w, h, left, top, width, height)) {
			//console.log('fret',i);
			//this.tilePlaceHolder(x, y, w, h, '_fch' + i, layer, left, top, width, height, 1);
			for(var k=0;k<this.currentSong.positions.length;k++){
				var posX=this.calculateMeasureX(k);
				var posW=this.measureWidth32th(k);
				if (this.collision(posX, y, posW, h, left, top, width, height)) {
					var position=this.currentSong.positions[k];
					for (var n = 0; n < position.motifs.length; n++) {
						var motif = position.motifs[n];
						if (motif.channel == channel.id) {
							var id='fretPos'+motif.channel+'x'+motif.motif;
							var offset=channel.offset;//+this.cleffOffset(motif.clef);
							var g = this.rakeGroup(posX, y, posW, h, id, layer, left, top, width, height);
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
											var nx=posX+this.measureMargin(k)-this.tapSize*0.5 + chord.start * 2 * this.tapSize + this.tapSize * 1;
											this.tileLine(g
												, nx
												, ny
												, nx + 1+this.tapSize*(2*note.l6th-1)
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
		}
	}
};
RiffShare2D.prototype.tileSheetMotifs = function (layer, left, top, width, height, ratio) {
	var x = this.marginLeft * this.tapSize;
	var w = this.songWidth32th();
	for (var i = 0; i < this.currentSong.channels.length; i++) {
		if (!(riffShare2d.hideTrackSheet[i])) {
		var channel=this.currentSong.channels[i];
		var h=this.heightTrSheet* this.tapSize;
		y=this.calculateTrackSheetY(i);
		if (this.collision(x, y, w, h, left, top, width, height)) {
			for(var k=0;k<this.currentSong.positions.length;k++){
				var posX=this.calculateMeasureX(k);
				var posW=this.measureWidth32th(k);
				//this.tilePlaceHolder(posX, y, posW, h, '_' + posX+"-"+y, layer, left, top, width, height, 1);
				if (this.collision(posX, y, posW, h, left, top, width, height)) {
					var position=this.currentSong.positions[k];
					for (var n = 0; n < position.motifs.length; n++) {
						var motif = position.motifs[n];
						if (motif.channel == channel.id) {
							var id='sheetPos'+motif.channel+'x'+motif.motif;
							var offset=channel.offset+this.cleffOffset(motif.clef);
							var g = this.rakeGroup(posX, y, posW, h, id, layer, left, top, width, height);
							if (g) {
								var data=this.findMotifById(motif.motif);
								if (data.chords.length > 0) {
									for (var c = 0; c < data.chords.length; c++) {
										var chord = data.chords[c];
										for (var n = 0; n < chord.notes.length; n++) {
											var note = chord.notes[n];
											var ny=y + this.tapSize * (this.heightTrSheet - this.pitch12to7(note.key-offset) + 3 * 7 - 3+2.5);
											var nx=posX+this.measureMargin(k) + chord.start * 2 * this.tapSize + this.tapSize * 1;
											this.tileLine(g
												, nx
												, ny
												, nx + 1
												, ny
												, this.colorMain, this.tapSize *0.99);
											//this.tilePlaceHolder(nx, y, this.tapSize, this.tapSize, '_' + nx+"-"+ny, layer, left, top, width, height, 1);
											/*for(var by=y;by<y+this.marginTrSheetLines*this.tapSize;by=by+2*this.tapSize){
												if(by>=ny){
													var bx=nx-9*this.tapSize/10;
													var id='liup'+chord.start+'x'+by;
													var gl = this.rakeGroup(bx, by, this.tapSize*1.5, ratio * this.lineWidth, id, layer, left, top, width, height);
													if (gl) {
														tileRectangle('#f00',bx, by, this.tapSize*1.5, ratio * this.lineWidth, gl, id);
													}
												}
											}*/
											/*for(var b=y+(sng.notationTop+2*5)*me.tapSize;b<=ny;b=b+2*me.tapSize){
												var bx=nx-9*me.tapSize/10;
												var by=b;//+me.tapSize/5;
												var id='lidown'+chord.start+'x'+by;
												if (!me.childExists(id, g)) {
													tileRectangle(sng.foreColor,bx, by, me.tapSize+8*me.tapSize/10, detailRatio * me.lineWidth, g, id);
												}
											}*/
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}}
};
RiffShare2D.prototype.tileMeasureOctave = function (measureN,octaveN,channelN,layer, left, top, width, height, ratio) {
	var channel=this.currentSong.channels[channelN];
	var position=this.currentSong.positions[measureN];
	for (var n = 0; n < position.motifs.length; n++) {
			var motif = position.motifs[n];
			if (motif.channel == channel.id) {
				var id='oct'+measureN+"x"+octaveN+"x"+channelN;
				//var offset=channel.offset+this.cleffOffset(motif.clef);
				var x = this.calculateMeasureX(measureN);
				var y=this.calculateRollGridY()+(this.heightPRGrid-12*(octaveN+1))*this.tapSize;
				var w = this.measureWidth32th(measureN)-this.tapSize;
				var h=12*this.tapSize-this.tapSize;
				//this.tilePlaceHolder(x, y, w, h, '_' + id, layer, left, top, width, height, 1);
				var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
				if (g) {
					//console.log(measureN,octaveN,channelN);
					var data=this.findMotifById(motif.motif);
					if (data.chords.length > 0) {
						for (var c = 0; c < data.chords.length; c++) {
							var chord = data.chords[c];
							for (var n = 0; n < chord.notes.length; n++) {
								var note = chord.notes[n];
								var nkey=note.key+channel.offset;
								if(Math.floor(nkey/12)==octaveN){
									//console.log(note);
									//var ny=y + this.tapSize * 1 * (channel.string.length-1)-this.tapSize * 1 *(channel.string.length-note.string)+this.tapSize*0.5;
									
									var ny=y+12*this.tapSize-(nkey%12-0.5)*this.tapSize;
									var nx=x+this.measureMargin(measureN)-this.tapSize*0.5 + chord.start * 2 * this.tapSize + this.tapSize * 1;
									this.tileLine(g
										, nx
										, ny
										, nx + 1+this.tapSize*(2*note.l6th-1)
										, ny
										, this.colorMain, this.tapSize *0.99);
								}
							}
						}
					}
				}
			}
		}
};
RiffShare2D.prototype.tileRollOctaves = function (layer, left, top, width, height, ratio) {
	if (!(this.hideRoll)) {
		var x = this.marginLeft * this.tapSize;
		var y=this.calculateRollGridY();
		var w = this.songWidth32th();
		var h=this.heightPRGrid*this.tapSize;
		for(var k=0;k<this.currentSong.positions.length;k++){
			var posX=this.calculateMeasureX(k);
			var posW=this.measureWidth32th(k);
			if (this.collision(posX, y, posW, h, left, top, width, height)) {
				for(var o=0;o<10;o++){
					var oY=y+(this.heightPRGrid-12*(o+1))*this.tapSize;
					//this.tilePlaceHolder(posX, oY, posW, 12*this.tapSize, '_' + posX+"-"+oY, layer, left, top, width, height, 1);
					if (this.collision(posX, oY, posW, 12*this.tapSize, left, top, width, height)) {
						for (var i = 0; i < this.currentSong.channels.length; i++) {
							this.tileMeasureOctave(k,o,i,layer, left, top, width, height, ratio);
						}
					}
				}
			}
		}
	}
};
