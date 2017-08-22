<<<<<<< HEAD
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
	this.reLayoutVertical();

};
var msLog = 0;
RiffShare2D.prototype.addContent = function (xx, yy, ww, hh, zz) {

	msLog = new Date().getTime();
	if (zz < this.minZoomMedium) {
		if (this.lastUsedLevel != 0) {
			console.log('small details level', this.lastUsedLevel, '->', 0);
			this.lastUsedLevel = 0;
			this.clearLayers([this.hugeGroup, this.largeGroup, this.mediumGroup]);
			this.clearSpots();
		}
		this.clearUselessDetails(xx, yy, ww, hh, this.smallGroup);
		this.addSmallTiles(xx, yy, ww, hh, 0.5);
	} else {
		if (zz < this.minZoomLarge) {
			if (this.lastUsedLevel != 1) {
				console.log('medium details level', this.lastUsedLevel, '->', 1);
				this.lastUsedLevel = 1;
				this.clearLayers([this.hugeGroup, this.largeGroup, this.smallGroup]);
				this.clearSpots();
			}
			this.clearUselessDetails(xx, yy, ww, hh, this.mediumGroup);
			this.addMediumTiles(xx, yy, ww, hh, 0.75);
		} else {
			if (zz < this.minZoomHuge) {
				if (this.lastUsedLevel != 2) {
					console.log('large details level', this.lastUsedLevel, '->', 2);
					this.lastUsedLevel = 2;
					this.clearLayers([this.hugeGroup, this.mediumGroup, this.smallGroup]);
					this.clearSpots();
				}
				this.clearUselessDetails(xx, yy, ww, hh, this.largeGroup);
				this.addLargeTiles(xx, yy, ww, hh, 1.25);
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
RiffShare2D.prototype.reLayoutVertical = function () {

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
	var xx = lt.x;

	var x = this.marginLeft * this.tapSize;
	var h = this.heightTrTitle * this.tapSize;
	var dx = 45 * this.tapSize + x + h / 2;
	var dx = x;
	var shift = xx - dx;
	if (xx < dx) {
		shift = 0;
	}

	this.stickedX = shift;
	//console.log(this.stickedX);
	this.hugetracknames.setAttribute('transform', 'translate(' + this.stickedX + ',0)');
	this.largetracknames.setAttribute('transform', 'translate(' + this.stickedX + ',0)');
	this.mediumtracknames.setAttribute('transform', 'translate(' + this.stickedX + ',0)');
	this.smalltracknames.setAttribute('transform', 'translate(' + this.stickedX + ',0)');
};
RiffShare2D.prototype.moveZoom = function () {
	var x = -this.translateX;
	var y = -this.translateY;
	var w = this.contentDiv.clientWidth * this.translateZ;
	var h = this.contentDiv.clientHeight * this.translateZ;
	if (w > 1) {
		//
	} else {
		w = 1;
	}
	if (h > 1) {
		//
	} else {
		h = 1;
	}
	//console.log(x,y,w,h);
	this.contentSVG.setAttribute("viewBox", "" + x + " " + y + " " + w + " " + h + "");
	this.reLayoutVertical();
	this.reLayoutBackGroundImge();
};
RiffShare2D.prototype.reLayoutBackGroundImge = function () {
	var rz = 1.0;
	var w = this.innerWidth; //this.marginLeft * this.tapSize + this.songWidth32th() + this.marginRight * this.tapSize;
	var h = this.innerHeight; //this.workHeight();
	var maxTranslX = w - this.contentDiv.clientWidth * this.translateZ;
	var maxTranslY = h - this.contentDiv.clientHeight * this.translateZ;
	var maxImgX = w - this.bgImageWidth * rz * this.translateZ;
	var maxImgY = h - this.bgImageHeight * rz * this.translateZ;
	var x = x = -maxImgX * this.translateX / maxTranslX;
	var y = y = -maxImgY * this.translateY / maxTranslY;
	if (maxTranslX == 0) {
		x = 0;
	}
	if (maxTranslY == 0) {
		y = 0;
	}
	if (w < this.contentDiv.clientWidth * this.translateZ) {
		x = -this.translateX;
	} else {
	if (this.translateX > 0) {
		x = -this.translateX;
	} else {
		if (-this.translateX > maxTranslX) {
			x = maxImgX - maxTranslX - this.translateX;
		}
	}}
	if (h < this.contentDiv.clientHeight * this.translateZ) {
		y = -this.translateY;
	} else {
		if (this.translateY > 0) {
			y = -this.translateY;
		} else {
			if (-this.translateY > maxTranslY) {
				y = maxImgY - maxTranslY - this.translateY;
			}
		}
	}
	var z = rz * this.translateZ;
	//console.log(y, this.translateY, h, this.contentDiv.clientHeight * this.translateZ);
	var transformAttr = ' translate(' + x + ',' + y + ') scale(' + z * rz + ')';
	this.bgImage.setAttribute('transform', transformAttr);
	//console.log(h, this.contentDiv.clientHeight * this.translateZ);
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
	//console.log(x, y, w, h, layer);
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
RiffShare2D.prototype.calculateMeasureX = function (n, changes) {
	var m = this.marginLeft * this.tapSize;
	for (var i = 0; i < n; i++) {
		m = m + this.measureWidth32th(i, changes);
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
	if (!(this.currentSong.channels[n].hideTrackSheet)) {
		h = h + this.heightTrSheet * this.tapSize;
	}
	if (!(this.currentSong.channels[n].hideTrackChords)) {
		h = h + this.heightTrChords * this.tapSize;
	}
	h = h + this.marginFret * this.tapSize;
	/*if (!(this.hideTrackText[n])) {
	h = h + this.heightTrText * this.tapSize;
	}*/
	return h;
};
RiffShare2D.prototype.calculateTrackTextY = function (n) {
	var h = this.calculateTrackY(n);
	h = h + this.heightTrTitle * this.tapSize;
	if (!(this.currentSong.channels[n].hideTrackSheet)) {
		h = h + this.heightTrSheet * this.tapSize;
	}
	if (!(this.currentSong.channels[n].hideTrackChords)) {
		h = h + this.heightTrChords * this.tapSize;
	}
	return h;
};
RiffShare2D.prototype.calculateTrackChordsY = function (n) {
	var h = this.calculateTrackY(n);
	h = h + this.heightTrTitle * this.tapSize;
	if (!(this.currentSong.channels[n].hideTrackSheet)) {
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
	if (!(this.currentSong.channels[n].hideTrackSheet)) {
		h = h + this.heightTrSheet;
	}
	if (!(this.currentSong.channels[n].hideTrackChords)) {
		h = h + this.heightTrChords;
	}
	/*if (!(this.hideTrackText[n])) {
	h = h + this.heightTrText;
	}*/
	if (!(this.currentSong.channels[n].hideTrackFret)) {
		h = h + 2 * this.currentSong.channels[n].string.length + this.marginFret;
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
	if (!(this.currentSong.hideRoll)) {
		h = h + this.heightPRGrid;
	}
	return h * this.tapSize;
};
RiffShare2D.prototype.songWidth32th = function () {
	if (this.currentSong) {
		var m = 0;
		var changes = this.positionOptionsChanges();
		for (var i = 0; i < this.currentSong.positions.length; i++) {
			m = m + this.measureWidth32th(i, changes); //currentSong.positions[i].meter * song.positions[i].by;
		}
		return m;
	} else {
		return 1;
	}
};
RiffShare2D.prototype.workHeight = function () {
	var h = this.calculateRollGridY() + this.marginBottom * this.tapSize;
	if (!this.currentSong.hideRoll) {
		h = h + 128 * this.tapSize;
	}
	return h;
}
RiffShare2D.prototype.measureMargin = function (i, changes) {
	if (i > 0) {
		//var changes=this.positionOptionsChanges();
		//if (this.currentSong.positions[i - 1].meter != this.currentSong.positions[i].meter || this.currentSong.positions[i - 1].by != this.currentSong.positions[i].by) {
		if (changes[i]) {
			return this.marginChangedMeasure * this.tapSize;
		} else {
			return 0;
		}
	} else {
		return this.marginFirstMeasure * this.tapSize;
	}
}
RiffShare2D.prototype.measureWidth32th = function (i, changes) {
	/*var le=this.currentSong.positions[i].meter * song.positions[i].by;
	if(i>0){
	if(this.currentSong.positions[i-1].meter!=this.currentSong.positions[i].meter || song.positions[i-1].by!=song.positions[i].by){
	le=le+this.marginChangedMeasure;
	}
	}else{
	le=le+this.marginFirstMeasure;
	}
	return le;*/
	var len16 = 16 * this.currentSong.positions[i].meter / this.currentSong.positions[i].by * this.cellDurationRatio();
	//return this.measureMargin(i) + this.cellWidth * this.currentSong.positions[i].meter * this.currentSong.positions[i].by * this.tapSize;
	return this.measureMargin(i, changes) + this.cellWidth * len16 * this.tapSize;
};
RiffShare2D.prototype.startSlideTo = function (x, y, z) {
	//console.log('startSlideTo', x, y, z, 'from', this.translateX, this.translateY, this.translateZ);

	var stepCount = 20;

	var dx = (x - this.translateX) / stepCount;
	var dy = (y - this.translateY) / stepCount;
	var dz = (z - this.translateZ) / stepCount;
	var xyz = [];
	for (var i = 0; i < stepCount; i++) {
		xyz.push({
			x : this.translateX + dx * i,
			y : this.translateY + dy * i,
			z : this.translateZ + dz * i
		});
	}
	xyz.push({
		x : x,
		y : y,
		z : z
	});
	this.stepSlideTo(xyz); //stepCount, dx, dy, dz);
};
RiffShare2D.prototype.stepSlideTo = function (xyz) { //stepCount, dx, dy, dz) {
	//console.log(stepCount, dx, dy, dz, this.translateX, this.translateY, this.translateZ);
	//this.translateX = this.translateX + dx;
	//this.translateY = this.translateY + dy;
	//this.translateZ = this.translateZ + dz;
	//console.log(stepCount, dx, dy, dz, this.translateX, this.translateY, this.translateZ);
	var n = xyz.shift();
	if (n) {
		this.translateX = n.x;
		this.translateY = n.y;
		this.translateZ = n.z;
		this.adjustContentPosition();
		setTimeout(function () {
			riffShare2d.stepSlideTo(xyz);
		}, 20);
	} else {
		this.resetAllLayersNow();
		//console.log(this.translateX, this.translateY, this.translateZ);
	}
	/*
	if (stepCount > 1) {

	} else {
	this.resetAllLayersNow();
	console.log(this.translateX, this.translateY, this.translateZ);
	}*/
};
RiffShare2D.prototype.findPositionByContentY = function () {
	var changes = this.positionOptionsChanges();
	var position = null;
	var dx = 0;
	var startAt = 0;
	for (var t = 0; t < this.currentSong.positions.length; t++) {
		var x = this.calculateMeasureX(t, changes);
		if (x > this.clickContentX) {
			if (t > 0) {
				position = this.currentSong.positions[t - 1];
			}
			break;
		}
		dx = this.clickContentX - x - this.measureMargin(t, changes);
		startAt = startAt + 16 * this.currentSong.positions[t].meter / this.currentSong.positions[t].by * this.cellDurationRatio();
		//console.log(startAt,this.currentSong.positions[t ]);

	}
	if (position) {
		if (dx > 0) {
			var drumShift = 0;
			var curChan = this.currentSong.channels[this.currentSong.channels.length - 1];
			if (curChan.program == 128) {
				drumShift = -34;
			}
			var key = Math.floor((this.calculateRollGridY() + 128 * this.tapSize - this.clickContentY) / this.tapSize) - drumShift - curChan.offset;
			var start = Math.floor(dx / (this.cellWidth * this.tapSize));
			//console.log(start,startAt);
			var r = {
				start : start,
				key : key,
				position : position,
				startAt : startAt
			};
			//console.log('findPositionByContentY',r);
			return r;
		}
	}
	return null;
};
=======
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
	this.reLayoutVertical();

};
var msLog = 0;
RiffShare2D.prototype.addContent = function (xx, yy, ww, hh, zz) {

	msLog = new Date().getTime();
	if (zz < this.minZoomMedium) {
		if (this.lastUsedLevel != 0) {
			console.log('small details level', this.lastUsedLevel, '->', 0);
			this.lastUsedLevel = 0;
			this.clearLayers([this.hugeGroup, this.largeGroup, this.mediumGroup]);
			this.clearSpots();
		}
		this.clearUselessDetails(xx, yy, ww, hh, this.smallGroup);
		this.addSmallTiles(xx, yy, ww, hh, 0.5);
	} else {
		if (zz < this.minZoomLarge) {
			if (this.lastUsedLevel != 1) {
				console.log('medium details level', this.lastUsedLevel, '->', 1);
				this.lastUsedLevel = 1;
				this.clearLayers([this.hugeGroup, this.largeGroup, this.smallGroup]);
				this.clearSpots();
			}
			this.clearUselessDetails(xx, yy, ww, hh, this.mediumGroup);
			this.addMediumTiles(xx, yy, ww, hh, 0.75);
		} else {
			if (zz < this.minZoomHuge) {
				if (this.lastUsedLevel != 2) {
					console.log('large details level', this.lastUsedLevel, '->', 2);
					this.lastUsedLevel = 2;
					this.clearLayers([this.hugeGroup, this.mediumGroup, this.smallGroup]);
					this.clearSpots();
				}
				this.clearUselessDetails(xx, yy, ww, hh, this.largeGroup);
				this.addLargeTiles(xx, yy, ww, hh, 1.25);
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
RiffShare2D.prototype.reLayoutVertical = function () {

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
	var xx = lt.x;

	var x = this.marginLeft * this.tapSize;
	var h = this.heightTrTitle * this.tapSize;
	var dx = 45 * this.tapSize + x + h / 2;
	var dx = x;
	var shift = xx - dx;
	if (xx < dx) {
		shift = 0;
	}

	this.stickedX = shift;
	//console.log(this.stickedX);
	this.hugetracknames.setAttribute('transform', 'translate(' + this.stickedX + ',0)');
	this.largetracknames.setAttribute('transform', 'translate(' + this.stickedX + ',0)');
	this.mediumtracknames.setAttribute('transform', 'translate(' + this.stickedX + ',0)');
	this.smalltracknames.setAttribute('transform', 'translate(' + this.stickedX + ',0)');
};
RiffShare2D.prototype.moveZoom = function () {
	var x = -this.translateX;
	var y = -this.translateY;
	var w = this.contentDiv.clientWidth * this.translateZ;
	var h = this.contentDiv.clientHeight * this.translateZ;
	if (w > 1) {
		//
	} else {
		w = 1;
	}
	if (h > 1) {
		//
	} else {
		h = 1;
	}
	//console.log(x,y,w,h);
	this.contentSVG.setAttribute("viewBox", "" + x + " " + y + " " + w + " " + h + "");
	this.reLayoutVertical();
	this.reLayoutBackGroundImge();
};
RiffShare2D.prototype.reLayoutBackGroundImge = function () {
	var rz = 1.0;
	var w = this.innerWidth; //this.marginLeft * this.tapSize + this.songWidth32th() + this.marginRight * this.tapSize;
	var h = this.innerHeight; //this.workHeight();
	var maxTranslX = w - this.contentDiv.clientWidth * this.translateZ;
	var maxTranslY = h - this.contentDiv.clientHeight * this.translateZ;
	var maxImgX = w - this.bgImageWidth * rz * this.translateZ;
	var maxImgY = h - this.bgImageHeight * rz * this.translateZ;
	var x = x = -maxImgX * this.translateX / maxTranslX;
	var y = y = -maxImgY * this.translateY / maxTranslY;
	if (maxTranslX == 0) {
		x = 0;
	}
	if (maxTranslY == 0) {
		y = 0;
	}
	if (w < this.contentDiv.clientWidth * this.translateZ) {
		x = -this.translateX;
	} else {
	if (this.translateX > 0) {
		x = -this.translateX;
	} else {
		if (-this.translateX > maxTranslX) {
			x = maxImgX - maxTranslX - this.translateX;
		}
	}}
	if (h < this.contentDiv.clientHeight * this.translateZ) {
		y = -this.translateY;
	} else {
		if (this.translateY > 0) {
			y = -this.translateY;
		} else {
			if (-this.translateY > maxTranslY) {
				y = maxImgY - maxTranslY - this.translateY;
			}
		}
	}
	var z = rz * this.translateZ;
	//console.log(y, this.translateY, h, this.contentDiv.clientHeight * this.translateZ);
	var transformAttr = ' translate(' + x + ',' + y + ') scale(' + z * rz + ')';
	this.bgImage.setAttribute('transform', transformAttr);
	//console.log(h, this.contentDiv.clientHeight * this.translateZ);
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
	//console.log(x, y, w, h, layer);
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
RiffShare2D.prototype.calculateMeasureX = function (n, changes) {
	var m = this.marginLeft * this.tapSize;
	for (var i = 0; i < n; i++) {
		m = m + this.measureWidth32th(i, changes);
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
	if (!(this.currentSong.channels[n].hideTrackSheet)) {
		h = h + this.heightTrSheet * this.tapSize;
	}
	if (!(this.currentSong.channels[n].hideTrackChords)) {
		h = h + this.heightTrChords * this.tapSize;
	}
	h = h + this.marginFret * this.tapSize;
	/*if (!(this.hideTrackText[n])) {
	h = h + this.heightTrText * this.tapSize;
	}*/
	return h;
};
RiffShare2D.prototype.calculateTrackTextY = function (n) {
	var h = this.calculateTrackY(n);
	h = h + this.heightTrTitle * this.tapSize;
	if (!(this.currentSong.channels[n].hideTrackSheet)) {
		h = h + this.heightTrSheet * this.tapSize;
	}
	if (!(this.currentSong.channels[n].hideTrackChords)) {
		h = h + this.heightTrChords * this.tapSize;
	}
	return h;
};
RiffShare2D.prototype.calculateTrackChordsY = function (n) {
	var h = this.calculateTrackY(n);
	h = h + this.heightTrTitle * this.tapSize;
	if (!(this.currentSong.channels[n].hideTrackSheet)) {
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
	if (!(this.currentSong.channels[n].hideTrackSheet)) {
		h = h + this.heightTrSheet;
	}
	if (!(this.currentSong.channels[n].hideTrackChords)) {
		h = h + this.heightTrChords;
	}
	/*if (!(this.hideTrackText[n])) {
	h = h + this.heightTrText;
	}*/
	if (!(this.currentSong.channels[n].hideTrackFret)) {
		h = h + 2 * this.currentSong.channels[n].string.length + this.marginFret;
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
	if (!(this.currentSong.hideRoll)) {
		h = h + this.heightPRGrid;
	}
	return h * this.tapSize;
};
RiffShare2D.prototype.songWidth32th = function () {
	if (this.currentSong) {
		var m = 0;
		var changes = this.positionOptionsChanges();
		for (var i = 0; i < this.currentSong.positions.length; i++) {
			m = m + this.measureWidth32th(i, changes); //currentSong.positions[i].meter * song.positions[i].by;
		}
		return m;
	} else {
		return 1;
	}
};
RiffShare2D.prototype.workHeight = function () {
	var h = this.calculateRollGridY() + this.marginBottom * this.tapSize;
	if (!this.currentSong.hideRoll) {
		h = h + 128 * this.tapSize;
	}
	return h;
}
RiffShare2D.prototype.measureMargin = function (i, changes) {
	if (i > 0) {
		//var changes=this.positionOptionsChanges();
		//if (this.currentSong.positions[i - 1].meter != this.currentSong.positions[i].meter || this.currentSong.positions[i - 1].by != this.currentSong.positions[i].by) {
		if (changes[i]) {
			return this.marginChangedMeasure * this.tapSize;
		} else {
			return 0;
		}
	} else {
		return this.marginFirstMeasure * this.tapSize;
	}
}
RiffShare2D.prototype.measureWidth32th = function (i, changes) {
	/*var le=this.currentSong.positions[i].meter * song.positions[i].by;
	if(i>0){
	if(this.currentSong.positions[i-1].meter!=this.currentSong.positions[i].meter || song.positions[i-1].by!=song.positions[i].by){
	le=le+this.marginChangedMeasure;
	}
	}else{
	le=le+this.marginFirstMeasure;
	}
	return le;*/
	var len16 = 16 * this.currentSong.positions[i].meter / this.currentSong.positions[i].by * this.cellDurationRatio();
	//return this.measureMargin(i) + this.cellWidth * this.currentSong.positions[i].meter * this.currentSong.positions[i].by * this.tapSize;
	return this.measureMargin(i, changes) + this.cellWidth * len16 * this.tapSize;
};
RiffShare2D.prototype.startSlideTo = function (x, y, z) {
	//console.log('startSlideTo', x, y, z, 'from', this.translateX, this.translateY, this.translateZ);

	var stepCount = 20;

	var dx = (x - this.translateX) / stepCount;
	var dy = (y - this.translateY) / stepCount;
	var dz = (z - this.translateZ) / stepCount;
	var xyz = [];
	for (var i = 0; i < stepCount; i++) {
		xyz.push({
			x : this.translateX + dx * i,
			y : this.translateY + dy * i,
			z : this.translateZ + dz * i
		});
	}
	xyz.push({
		x : x,
		y : y,
		z : z
	});
	this.stepSlideTo(xyz); //stepCount, dx, dy, dz);
};
RiffShare2D.prototype.stepSlideTo = function (xyz) { //stepCount, dx, dy, dz) {
	//console.log(stepCount, dx, dy, dz, this.translateX, this.translateY, this.translateZ);
	//this.translateX = this.translateX + dx;
	//this.translateY = this.translateY + dy;
	//this.translateZ = this.translateZ + dz;
	//console.log(stepCount, dx, dy, dz, this.translateX, this.translateY, this.translateZ);
	var n = xyz.shift();
	if (n) {
		this.translateX = n.x;
		this.translateY = n.y;
		this.translateZ = n.z;
		this.adjustContentPosition();
		setTimeout(function () {
			riffShare2d.stepSlideTo(xyz);
		}, 20);
	} else {
		this.resetAllLayersNow();
		//console.log(this.translateX, this.translateY, this.translateZ);
	}
	/*
	if (stepCount > 1) {

	} else {
	this.resetAllLayersNow();
	console.log(this.translateX, this.translateY, this.translateZ);
	}*/
};
RiffShare2D.prototype.findPositionByContentY = function () {
	var changes = this.positionOptionsChanges();
	var position = null;
	var dx = 0;
	var startAt = 0;
	for (var t = 0; t < this.currentSong.positions.length; t++) {
		var x = this.calculateMeasureX(t, changes);
		if (x > this.clickContentX) {
			if (t > 0) {
				position = this.currentSong.positions[t - 1];
			}
			break;
		}
		dx = this.clickContentX - x - this.measureMargin(t, changes);
		startAt = startAt + 16 * this.currentSong.positions[t].meter / this.currentSong.positions[t].by * this.cellDurationRatio();
		//console.log(startAt,this.currentSong.positions[t ]);

	}
	if (position) {
		if (dx > 0) {
			var drumShift = 0;
			var curChan = this.currentSong.channels[this.currentSong.channels.length - 1];
			if (curChan.program == 128) {
				drumShift = -34;
			}
			var key = Math.floor((this.calculateRollGridY() + 128 * this.tapSize - this.clickContentY) / this.tapSize) - drumShift - curChan.offset;
			var start = Math.floor(dx / (this.cellWidth * this.tapSize));
			//console.log(start,startAt);
			var r = {
				start : start,
				key : key,
				position : position,
				startAt : startAt
			};
			//console.log('findPositionByContentY',r);
			return r;
		}
	}
	return null;
};
>>>>>>> origin/master
