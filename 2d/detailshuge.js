RiffShare2D.prototype.addHugeTiles = function (xx, yy, ww, hh, detailRatio) {
	this.tileSongTitle(this.hugetitles, xx, yy, ww, hh);
	this.tileHugeSongTracks(this.hugeholders, xx, yy, ww, hh, detailRatio);
	this.tileTracksTitles(this.hugetitles, xx, yy, ww, hh);
	this.tileSongRollTitle(this.hugeholders, xx, yy, ww, hh);
	this.tileHugeMeasureLines(this.hugeborders,xx, yy, ww, hh, detailRatio);
	this.tileHugeTrackControls(this.hugespots, xx, yy, ww, hh, detailRatio);
	
	this.tileMenu(this.hugespots,xx, yy, ww, hh, detailRatio);
};
RiffShare2D.prototype.tileSongTitle = function (layer, left, top, width, height) {
	var x = this.marginLeft * this.tapSize;
	var y = this.marginTop * this.tapSize;
	var w = this.songWidth32th() ;
	var h = this.heightSongTitle * this.tapSize;
	var id = 'songTitle';
	var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
	if (g) {
		this.tileText(g, x, y+h, 33 * this.tapSize, this.currentSong.name, this.colorComment);
	}
};
RiffShare2D.prototype.tileHugeSongTracks = function (layer, left, top, width, height,ratio) {
	var x = this.marginLeft * this.tapSize;
	var w = this.songWidth32th() ;
	for (var i = 0; i < this.currentSong.channels.length; i++) {
		if(!(this.hideTrackSheet[i])){
			var y = this.calculateTrackSheetY(i)+(0.5+this.marginTrSheetLines)*this.tapSize;
			var h = 8 * this.tapSize;
			var id = 'plHuge'+i;
			var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
			if (g) {
				this.tileRectangle(g, x, y, w, h, this.colorHugeHolder);
			}
		}
		if(!(this.hideTrackFret[i])){
			var y = this.calculateTrackFretY(i);
			var h = this.currentSong.channels[i].string.length*this.tapSize;
			var id = 'frpHuge'+i;
			var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
			if (g) {
				this.tileRectangle(g, x, y, w, h, this.colorHugeHolder);
			}
		}
	}
	if (!this.hideRoll) {
		
		var x = this.marginLeft * this.tapSize;
		var y = this.calculateRollGridY();
		var w = this.songWidth32th();
		var h = 128*this.tapSize;
		var id='hugprli';
		var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
		//console.log('add',x, y, w, h, id, layer, left, top, width, height);
		if (g) {
			var h = this.lineWidth * ratio;
			for (var i = 12; i < 128; i = i + 12) {
				y = this.calculateRollGridY() + (this.heightPRGrid - i) * this.tapSize;
				var id = 'octali' + i;
				var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
				if (g) {
					this.tileRectangle(g, x, y, w, h, this.colorHugeHolder);
					//console.log('add',id);
				}
			}
		}
	}
};
RiffShare2D.prototype.tileOneTrack = function (i,layer, left, top, width, height) {
	var x = (this.marginLeft+this.heightPRTitle) * this.tapSize;
	var y = this.calculateTrackY(i);
	var w = this.songWidth32th() ;
	var h = this.heightTrText*this.tapSize;
	if (this.collision(x, y, w, h, left, top, width, height)) {
		var id = 'trackTitle' + i;
		var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
		if (g) {
			this.tileText(g, x, y+this.heightTrText*this.tapSize, 11 * this.tapSize, this.currentSong.channels[i].channel + ' / ' + this.currentSong.channels[i].track, this.colorComment);
			this.addSpot('trackSelect' + i, x,y,w,h, function () {
					riffShare2d.selectedChannel = i;
				});
		}
	}
};
RiffShare2D.prototype.tileTracksTitles = function (layer, left, top, width, height) {
	for (var i = 0; i < this.currentSong.channels.length; i++) {
		this.tileOneTrack(i,layer, left, top, width, height) ;
	}
};
RiffShare2D.prototype.tileHugeMeasureLines = function (layer,left, top, width, height, ratio) {
	for (var i = 0; i < this.currentSong.positions.length; i++) {
		if (i % 10 == 0) {
			var x=this.calculateMeasureX(i);
			var y=this.calculateTrackY(0);
			var w=this.measureWidth32th(i);
			var h=this.calculateAllTracksHeight()+this.calculateRollHeight();
			var id = 'ln' + i + 'x' + x + 'x' + y;
			var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
			if (g) {
				this.tileText(g, x+this.lineWidth * ratio*3, y, 19 * this.tapSize, '' + (1 + i), this.colorComment);
				this.tileRectangle(g, x, y, this.lineWidth * ratio, h, this.colorHugeHolder);
			}
		}
	}
};
RiffShare2D.prototype.tileSongRollTitle = function (layer, left, top, width, height) {
	var x = this.marginLeft * this.tapSize;
	var y = this.calculateRollTitleY();
	var w = this.songWidth32th() ;
	var h = this.heightPRTitle*this.tapSize;
	var id = 'roll';
	var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
	if (g) {
		this.tileText(g, x, y+0.75*this.heightPRTitle*this.tapSize, 3 * this.tapSize, 'Pianoroll', this.colorComment);
		this.addSpot(id, x, y, w, h, function () {
			riffShare2d.hideRoll = !(riffShare2d.hideRoll);
			riffShare2d.clearAllTiles();
		});
	}
}
RiffShare2D.prototype.tileOneHugeTrackControl = function (i,layer, left, top, width, height, detailRatio) {
	var x = 1 * this.tapSize;
	var y = this.calculateTrackY(i);
	var w = this.marginLeft * this.tapSize;
	var h = this.calculateTrackHeight(i);
	var r=0.45*Math.min(w,this.heightTrText * this.tapSize);
	if (this.collision(x, y, w, h, left, top, width, height)) {
		var id = 'trackControls' + i;
		var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
		if (g) {
			//this.tileText(g, x, y+this.heightTrText*this.tapSize, 11 * this.tapSize, this.currentSong.channels[i].channel + ' / ' + this.currentSong.channels[i].track, this.colorAction);
			this.tileCircle(g, x+w/2, y+r, r, 'none',  this.colorAction, this.lineWidth * detailRatio);
		}
	}
};
RiffShare2D.prototype.tileHugeTrackControls = function (layer, left, top, width, height, detailRatio) {
	for (var i = 0; i < this.currentSong.channels.length; i++) {
		this.tileOneHugeTrackControl(i,layer, left, top, width, height, detailRatio) ;
	}
};
