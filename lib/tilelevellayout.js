TileLevel.prototype.resetInnerSize = function (w,h) {
	this.innerWidth = w;
	this.innerHeight = h;
	this.moveZoom();
};
TileLevel.prototype.moveZoom = function () {
	//console.log(this.svg.clientWidth,'x',this.svg.clientHeight);
	var x = -this.translateX;
	var y = -this.translateY;
	var w = this.svg.clientWidth * this.translateZ;
	var h = this.svg.clientHeight * this.translateZ;
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
	this.svg.setAttribute("viewBox", "" + x + " " + y + " " + w + " " + h + "");
	this.reLayoutVertical();
};
TileLevel.prototype.reLayoutVertical = function () {
	var leftTopX = 0;
	var leftTopY = 0;
	var rightBottomX = this.svg.clientWidth;
	var rightBottomY = this.svg.clientHeight;
	if (this.svg.clientWidth * this.translateZ > this.innerWidth) {
		leftTopX = (this.svg.clientWidth - this.innerWidth / this.translateZ) / 2;
		rightBottomX = this.svg.clientWidth - leftTopX;
	}
	if (this.svg.clientHeight * this.translateZ > this.innerHeight) {
		leftTopY = (this.svg.clientHeight - this.innerHeight / this.translateZ) / 2;
		rightBottomY = this.svg.clientHeight - leftTopY;
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
};
TileLevel.prototype.unzoom = function (x, y, z) {
	var xy = {
		x: x * z - this.translateX,
		y: y * z - this.translateY
	};
	if (this.svg.clientWidth * z > this.innerWidth) {
		xy.x = x * z - ((this.svg.clientWidth * z - this.innerWidth) / 2);
	}
	if (this.svg.clientHeight * z > this.innerHeight) {
		xy.y = y * z - ((this.svg.clientHeight * z - this.innerHeight) / 2);
	}
	xy.x = Math.round(xy.x);
	xy.y = Math.round(xy.y);
	return xy;
};
TileLevel.prototype.adjustContentPosition = function () {
	if (this.svg.clientWidth * this.translateZ < this.innerWidth) {
		if (this.translateX < this.svg.clientWidth * this.translateZ - this.innerWidth) {
			this.translateX = this.svg.clientWidth * this.translateZ - this.innerWidth;
		}
		if (this.translateX > 0) {
			this.translateX = 0;
		}
	} else {
		this.translateX = (this.svg.clientWidth * this.translateZ - this.innerWidth) / 2;
	}
	if (this.svg.clientHeight * this.translateZ < this.innerHeight) {
		if (this.translateY < this.svg.clientHeight * this.translateZ - this.innerHeight) {
			this.translateY = this.svg.clientHeight * this.translateZ - this.innerHeight;
		}
		if (this.translateY > 0) {
			this.translateY = 0;
		}
	} else {
		this.translateY = (this.svg.clientHeight * this.translateZ - this.innerHeight) / 2;
	}
	this.moveZoom();
};
TileLevel.prototype.vectorDistance = function (xy1, xy2) {
	var xy = this.vectorSubstract(xy1, xy2);
	var n = this.vectorNorm(xy);
	return n;
};
TileLevel.prototype.vectorSubstract = function (xy1, xy2) {
	return {
		x: xy1.x - xy2.x,
		y: xy1.y - xy2.y
	};
};
TileLevel.prototype.vectorNorm = function (xy) {
	return Math.sqrt(this.vectorNormSquared(xy));
};
TileLevel.prototype.vectorNormSquared = function (xy) {
	return xy.x * xy.x + xy.y * xy.y;
};
TileLevel.prototype.vectorFromTouch = function (touch) {
	return {
		x: touch.clientX,
		y: touch.clientY
	};
};
TileLevel.prototype.vectorFindCenter = function (xy1, xy2) {
	var xy = this.vectorAdd(xy1, xy2);
	return this.vectorScale(xy, 0.5);
};
TileLevel.prototype.vectorAdd = function (xy1, xy2) {
	return {
		x: xy1.x + xy2.x,
		y: xy1.y + xy2.y
	};
};
TileLevel.prototype.vectorScale = function (xy, coef) {
	return {
		x: xy.x * coef,
		y: xy.y * coef
	};
};