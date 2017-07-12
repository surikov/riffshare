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
RiffShare2D.prototype.clearAllTiles = function () {
	this.clearLayers([this.hugeGroup, this.largeGroup, this.mediumGroup, this.smallGroup]);
	this.resetSize();
	this.adjustContentPosition();
	this.queueTiles();
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
var msLog = 0;
RiffShare2D.prototype.addContent = function (xx, yy, ww, hh, zz) {

	msLog = new Date().getTime();
	if (zz < 0.5) {
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
			if (zz < 25) {
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
	//console.log('addContent done',(new Date().getTime()-msLog));
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
	)
	{
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
RiffShare2D.prototype.pitch12to7 = function (pitch) {
	var octave = Math.floor(pitch / 12);
	var n12 = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6];
	var idx = pitch % 12;
	var r = n12[idx];
	var n7 = octave * 7 + r;
	return n7;
};
RiffShare2D.prototype.channelStringKey = function (order, channel) {
	for (var i = 0; i < channel.string.length; i++) {
		if (channel.string[i].order == order) {
			return channel.string[i].pitch;
		}
	}
};
RiffShare2D.prototype.calculateMeasureX = function (n) {
	var m = this.marginLeft * this.tapSize;
	for (var i = 0; i < n; i++) {
		m = m + this.measureWidth32th(i);
	}
	return m;
};
RiffShare2D.prototype.calculateRollGridY = function () {
	return this.calculateRollTitleY() + this.heightPRTitle * this.tapSize;
}
RiffShare2D.prototype.calculateRollTitleY = function () {
	return this.calculateTrackY(this.currentSong.channels.length);
}
RiffShare2D.prototype.calculateTrackFretY = function (n) {
	var h = this.calculateTrackY(n);
	h = h + this.heightTrTitle * this.tapSize;
	if (!(this.hideTrackSheet[n])) {
		h = h + this.heightTrSheet * this.tapSize;
	}
	if (!(this.hideTrackChords[n])) {
		h = h + this.heightTrChords * this.tapSize;
	}
	if (!(this.hideTrackText[n])) {
		h = h + this.heightTrText * this.tapSize;
	}
	return h;
};
RiffShare2D.prototype.calculateTrackTextY = function (n) {
	var h = this.calculateTrackY(n);
	h = h + this.heightTrTitle * this.tapSize;
	if (!(this.hideTrackSheet[n])) {
		h = h + this.heightTrSheet * this.tapSize;
	}
	if (!(this.hideTrackChords[n])) {
		h = h + this.heightTrChords * this.tapSize;
	}
	return h;
};
RiffShare2D.prototype.calculateTrackChordsY = function (n) {
	var h = this.calculateTrackY(n);
	h = h + this.heightTrTitle * this.tapSize;
	if (!(this.hideTrackSheet[n])) {
		h = h + this.heightTrSheet * this.tapSize;
	}
	return h;
};
RiffShare2D.prototype.calculateTrackSheetY = function (n) {
	var h = this.calculateTrackY(n);
	h = h + this.heightTrTitle * this.tapSize;
	return h;
};
RiffShare2D.prototype.calculateTrackY = function (n) {
	var h = (this.marginTop + this.heightSongTitle + this.heightSongText) * this.tapSize;
	for (var i = 0; i < n; i++) {
		h = h + this.calculateTrackHeight(i);
	}
	return h;
};
RiffShare2D.prototype.calculateTrackHeight = function (n) {
	var h = this.heightTrTitle;
	if (!(this.hideTrackSheet[n])) {
		h = h + this.heightTrSheet;
	}
	if (!(this.hideTrackChords[n])) {
		h = h + this.heightTrChords;
	}
	if (!(this.hideTrackText[n])) {
		h = h + this.heightTrText;
	}
	if (!(this.hideTrackFret[n])) {
		h = h + 2*this.currentSong.channels[n].string.length;
	}
	return h * this.tapSize;
};
RiffShare2D.prototype.calculateAllTracksHeight = function () {
	//console.log('calculateAllTracksHeight',this);
	var h = 0;
	for (var i = 0; i < this.currentSong.channels.length; i++) {
		h = h + this.calculateTrackHeight(i);
	}
	return h;
};
RiffShare2D.prototype.calculateRollHeight = function () {
	var h = this.heightPRTitle;
	if (!(this.hideRoll)) {
		h = h + this.heightPRGrid;
	}
	return h * this.tapSize;
};
RiffShare2D.prototype.songWidth32th = function () {
	if (this.currentSong) {
		var m = 0;
		for (var i = 0; i < this.currentSong.positions.length; i++) {
			m = m + this.measureWidth32th(i); //currentSong.positions[i].meter * song.positions[i].by;
		}
		return m;
	} else {
		return 1;
	}
};
RiffShare2D.prototype.measureMargin = function (i) {
	if (i > 0) {
		if (this.currentSong.positions[i - 1].meter != this.currentSong.positions[i].meter || this.currentSong.positions[i - 1].by != this.currentSong.positions[i].by) {
			return this.marginChangedMeasure * this.tapSize;
		} else {
			return 0;
		}
	} else {
		return this.marginFirstMeasure * this.tapSize;
	}
}
RiffShare2D.prototype.measureWidth32th = function (i) {
	/*var le=this.currentSong.positions[i].meter * song.positions[i].by;
	if(i>0){
	if(this.currentSong.positions[i-1].meter!=this.currentSong.positions[i].meter || song.positions[i-1].by!=song.positions[i].by){
	le=le+this.marginChangedMeasure;
	}
	}else{
	le=le+this.marginFirstMeasure;
	}
	return le;*/
	var len16=16*this.currentSong.positions[i].meter / this.currentSong.positions[i].by;
	//return this.measureMargin(i) + this.cellWidth * this.currentSong.positions[i].meter * this.currentSong.positions[i].by * this.tapSize;
	return this.measureMargin(i) + this.cellWidth * len16 * this.tapSize;
};
