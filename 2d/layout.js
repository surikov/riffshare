RiffShare2D.prototype.clearDetailLevel = function (layer) {
	for (var i = 0; i < layer.children.length; i++) {
		var group = layer.children[i];
		while (group.children.length > 0) {
			group.removeChild(group.children[0]);
		}
	}
};
RiffShare2D.prototype.adjustContentPosition = function () {
	if (this.contentDiv.clientWidth * this.translateZ < this.innerWidth) {
		if (this.translateX < this.contentDiv.clientWidth * this.translateZ - this.innerWidth) {
			this.translateX = this.contentDiv.clientWidth * this.translateZ - this.innerWidth;
		}
		if (this.translateX > 0) {
			this.translateX = 0;
		}
	} else {
		this.translateX = (this.contentDiv.clientWidth * this.translateZ - this.innerWidth) / 2;
	}
	if (this.contentDiv.clientHeight * this.translateZ < this.innerHeight) {
		if (this.translateY < this.contentDiv.clientHeight * this.translateZ - this.innerHeight) {
			this.translateY = this.contentDiv.clientHeight * this.translateZ - this.innerHeight;
		}
		if (this.translateY > 0) {
			this.translateY = 0;
		}
	} else {
		this.translateY = (this.contentDiv.clientHeight * this.translateZ - this.innerHeight) / 2;
	}
	//console.log(this.translateX,this.translateY,this.translateZ);
	this.moveZoom();
};
RiffShare2D.prototype.resetTiles = function () {
	var leftTopX = 0;
	var leftTopY = 0;
	var rightBottomX = this.contentDiv.clientWidth;
	var rightBottomY = this.contentDiv.clientHeight;
	if (this.contentDiv.clientWidth * this.translateZ > this.innerWidth) {
		leftTopX = (this.contentDiv.clientWidth - this.innerWidth / this.translateZ) / 2;
		rightBottomX = this.contentDiv.clientWidth - leftTopX;
	}
	if (this.contentDiv.clientHeight * this.translateZ > this.innerHeight) {
		leftTopY = (this.contentDiv.clientHeight - this.innerHeight / this.translateZ) / 2;
		rightBottomY = this.contentDiv.clientHeight - leftTopY;
	}
	var lt = this.unzoom(leftTopX, leftTopY, this.translateZ);
	var rb = this.unzoom(rightBottomX, rightBottomY, this.translateZ);
	var xx = lt.x;
	var yy = lt.y;
	var ww = rb.x - lt.x;
	var hh = rb.y - lt.y;
	this.addContent(xx, yy, ww, hh, this.translateZ);
};
RiffShare2D.prototype.addContent = function (xx, yy, ww, hh, zz) {
	//console.log(this);
	if (zz < 0.75) {
		if (this.lastUsedLevel != 0) {
			console.log('small details level', this.lastUsedLevel, '->', 0);
			this.lastUsedLevel = 0;
			this.clearLayers([this.hugeGroup, this.largeGroup, this.mediumGroup]);
			this.clearSpots();
		}
		this.clearUselessDetails(xx, yy, ww, hh, this.smallGroup);
		this.addSmallTiles(xx, yy, ww, hh, 0.5);
	} else {
		if (zz < 3) {
			if (this.lastUsedLevel != 1) {
				console.log('medium details level', this.lastUsedLevel, '->', 1);
				this.lastUsedLevel = 1;
				this.clearLayers([this.hugeGroup, this.largeGroup, this.smallGroup]);
				this.clearSpots();
			}
			this.clearUselessDetails(xx, yy, ww, hh, this.mediumGroup);
			this.addMediumTiles(xx, yy, ww, hh, 0.75);
		} else {
			if (zz < 30) {
				if (this.lastUsedLevel != 2) {
					console.log('large details level', this.lastUsedLevel, '->', 2);
					this.lastUsedLevel = 2;
					this.clearLayers([this.hugeGroup, this.mediumGroup, this.smallGroup]);
					this.clearSpots();
				}
				this.clearUselessDetails(xx, yy, ww, hh, this.largeGroup);
				this.addLargeTiles(xx, yy, ww, hh, 3);
			} else {
				if (this.lastUsedLevel != 3) {
					console.log('huge details level', this.lastUsedLevel, '->', 3);
					this.lastUsedLevel = 3;
					this.clearLayers([this.largeGroup, this.mediumGroup, this.smallGroup]);
					this.clearSpots();
				}
				this.clearUselessDetails(xx, yy, ww, hh, this.hugeGroup);
				this.addHugeTiles(xx, yy, ww, hh, 30);
			}
		}
	}
};
RiffShare2D.prototype.moveZoom = function () {
	var x = -this.translateX;
	var y = -this.translateY;
	var w = this.contentDiv.clientWidth * this.translateZ;
	var h = this.contentDiv.clientHeight * this.translateZ;
	this.contentSVG.setAttribute("viewBox", "" + x + " " + y + " " + w + " " + h + "");
};
RiffShare2D.prototype.collision = function (x1, y1, w1, h1, x2, y2, w2, h2) {
	if (x1 + w1 < x2 //
		 || x1 > x2 + w2 //
		 || y1 + h1 < y2 //
		 || y1 > y2 + h2 //
	) {
		return false;
	} else {
		return true;

	}
};
RiffShare2D.prototype.childExists = function (id, layer) {
	for (var i = 0; i < layer.children.length; i++) {
		var t = layer.children[i];
		if (t.id == id) {
			return true;
		}
	}
	return false;
};
RiffShare2D.prototype.outOfView = function (child, x, y, w, h) {
	var tbb = child.getBBox();
	return !(this.collision(tbb.x, tbb.y, tbb.width, tbb.height, x, y, w, h));
};
RiffShare2D.prototype.clearUselessNodes = function (x, y, w, h, layer) {
	for (var i = 0; i < layer.children.length; i++) {
		var t = layer.children[i];
		if (this.outOfView(t, x, y, w, h)) {
			layer.removeChild(t);
			i--;
		} else {
			//
		}
	}
};
RiffShare2D.prototype.clearUselessDetails = function (x, y, w, h, layer) {
	for (var i = 0; i < layer.children.length; i++) {
		var group = layer.children[i];
		this.clearUselessNodes(x, y, w, h, group);
	}
};
RiffShare2D.prototype.clearLayers = function (layers) {
	for (var i = 0; i < layers.length; i++) {
		var layer = layers[i];
		for (var n = 0; n < layer.children.length; n++) {
			var g = layer.children[n];
			while (g.children.length > 0) {
				g.removeChild(g.children[0]);
			}
		}
	}
};
RiffShare2D.prototype.calculateTrackHeight = function (n) {
	var h=this.heightTrTitle;
	if(!(this.hideTrackSheet[n])){h=h+this.heightTrSheet;}
	if(!(this.hideTrackChords[n])){h=h+this.heightTrChords;}
	if(!(this.hideTrackFret[n])){h=h+this.heightTrFret;}
	if(!(this.hideTrackText[n])){h=h+this.heightTrText;}
	return h;
};
RiffShare2D.prototype.calculateAllTracksHeight = function () {
	var h=0;
	for(var i=0;i<this.currentSong.channels.length;i++){
		h=h+this.calculateTrackHeight(i);
	}
	return h;
};
RiffShare2D.prototype.calculateRollHeight = function () {
	var h=this.heightPRTitle;
	if(!(this.hideRoll)){h=h+this.heightPRGrid;}
	return h;
};
RiffShare2D.prototype.addHugeTiles = function (xx, yy, ww, hh, detailRatio) {
	//var detailRatio = 30;
	this.tilePlaceHolder(0, 0, this.innerWidth, this.innerHeight, 'huge', this.hugetitles, xx, yy, ww, hh, detailRatio);
	/*this.tilePlaceHolder(this.cfg.marginLeft*this.tapSize,this.cfg.marginTop*this.tapSize,this.innerWidth-(this.cfg.marginLeft+this.cfg.marginRight)*this.tapSize,this.innerHeight-(this.cfg.marginTop+this.cfg.marginBottom)*this.tapSize,'songbody',this.hugetitles,xx, yy, ww, hh);
	 */
	//var g=this.rakeGroup(0,0,1000,10000,'testSymbol',this.hugetitles, xx, yy, ww, hh);if(g){this.tileSymbol(g,220,0,500,1000,'#testSymbol');}
	this.tileSongTitle(this.hugetitles, xx, yy, ww, hh);
	this.tileSongTracks(this.hugetitles, xx, yy, ww, hh);
	this.tileSongRoll(this.hugetitles, xx, yy, ww, hh);
};
RiffShare2D.prototype.addLargeTiles = function (xx, yy, ww, hh, detailRatio) {
	//var detailRatio = 3;
	this.tilePlaceHolder(0, 0, this.innerWidth, this.innerHeight, 'large', this.largetitles, xx, yy, ww, hh, detailRatio);
	//var g=this.rakeGroup(0,0,1000,10000,'testSymbol',this.hugetitles, xx, yy, ww, hh);if(g){this.tileSymbol(g,220,0,500,1000,'#testSymbol');}
	this.tileSongTitle(this.largetitles, xx, yy, ww, hh);
	this.tileSongTracks(this.largetitles, xx, yy, ww, hh);
	this.tileSongRoll(this.largetitles, xx, yy, ww, hh);
};
RiffShare2D.prototype.addMediumTiles = function (xx, yy, ww, hh, detailRatio) {
	//var detailRatio = 0.75;
	this.tilePlaceHolder(0, 0, this.innerWidth, this.innerHeight, 'medium', this.mediumtitles, xx, yy, ww, hh, detailRatio);
	//var g=this.rakeGroup(0,0,1000,10000,'testSymbol',this.hugetitles, xx, yy, ww, hh);if(g){this.tileSymbol(g,220,0,500,1000,'#testSymbol');}
	this.tileSongTitle(this.mediumtitles, xx, yy, ww, hh);
	this.tileSongTracks(this.mediumtitles, xx, yy, ww, hh);
	this.tileSongRoll(this.mediumtitles, xx, yy, ww, hh);
};
RiffShare2D.prototype.addSmallTiles = function (xx, yy, ww, hh, detailRatio) {
	//var detailRatio = 0.5;
	this.tilePlaceHolder(0, 0, this.innerWidth, this.innerHeight, 'small', this.smalltitles, xx, yy, ww, hh, detailRatio);
	//var g=this.rakeGroup(0,0,1000,10000,'testSymbol',this.hugetitles, xx, yy, ww, hh);if(g){this.tileSymbol(g,220,0,500,1000,'#testSymbol');}
	this.tileSongTitle(this.smalltitles, xx, yy, ww, hh);
	this.tileSongTracks(this.smalltitles, xx, yy, ww, hh);
	this.tileSongRoll(this.smalltitles, xx, yy, ww, hh);
};
RiffShare2D.prototype.tileSongTitle = function (layer, left, top, width, height) {
	var x = this.marginLeft * this.tapSize;
	var y = this.marginTop * this.tapSize;
	var w = this.measuresLength16th() * this.tapSize;
	var h = this.heightSongTitle * this.tapSize;
	var id = 'songTitle';
	this.tilePlaceHolder(x, y, w, h, '_' + id, layer, left, top, width, height, 1);
	var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
	if (g) {
		this.tileText(g, x, y, 33 * this.tapSize, this.currentSong.name, this.colorComment);
	}
};
RiffShare2D.prototype.tileSongTracks = function (layer, left, top, width, height) {
	var x = this.marginLeft * this.tapSize;
	var w = this.measuresLength16th() * this.tapSize;
	var h = this.heightTrTitle * this.tapSize;
	var y=(this.marginTop + this.heightSongTitle+this.heightSongText) * this.tapSize;
	for (var i = 0; i < this.currentSong.channels.length; i++) {
		/*var y = (this.cfg.marginTop + this.cfg.heightSongTitle+this.cfg.heightSongText //
			+i * (this.cfg.heightTrackTitle + this.cfg.heightTrackChords + this.cfg.heightTrackSheet + this.cfg.heightTrackFret + this.cfg.heightTrackText) //
		) * this.tapSize;*/
		var id = 'trackTitle' + i;
		//console.log(id,y,this.calculateTrackHeight(i));
		this.tilePlaceHolder(x, y, w, h, '_' + id, layer, left, top, width, height, 1);
		var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
		if (g) {
			this.tileText(g, x, y, 11 * this.tapSize, this.currentSong.channels[i].channel+' / '+ this.currentSong.channels[i].track, this.colorComment);
		}
		y=y+this.calculateTrackHeight(i)* this.tapSize;
	}
};
RiffShare2D.prototype.tileSongRoll = function (layer, left, top, width, height) {
	var x = this.marginLeft * this.tapSize;
	/*var y = (this.cfg.marginTop + this.cfg.heightSongTitle+this.cfg.heightSongText //
			+this.currentSong.channels.length * (this.cfg.heightTrackTitle + this.cfg.heightTrackChords + this.cfg.heightTrackSheet + this.cfg.heightTrackFret + this.cfg.heightTrackText) //
		) * this.tapSize;
		*/
	var y=(this.marginTop + this.heightSongTitle+this.heightSongText+this.calculateAllTracksHeight()) * this.tapSize;
	var w = this.measuresLength16th() * this.tapSize;
	//var h = (this.cfg.heightRollTitle+this.cfg.heightRollGrid) * this.tapSize;
	var h=this.calculateRollHeight()* this.tapSize;
	this.tilePlaceHolder(x, y, w, h, '_roll', layer, left, top, width, height, 1);
}
