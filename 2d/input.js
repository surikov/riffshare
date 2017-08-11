RiffShare2D.prototype.setupInput = function () {
	console.log('setup input');
	this.startMouseScreenX = 0;
	this.startMouseScreenY = 0;
	this.clickX = 0;
	this.clickY = 0;
	this.twoZoom = false;
	this.twodistance = 0;
	this.twocenter = {
		x : 0,
		y : 0
	};
	this.rakeDiv.addEventListener('mousedown', this.rakeMouseDown, false);
	this.rakeDiv.addEventListener("mousewheel", this.rakeMouseWheel, false);
	this.rakeDiv.addEventListener("DOMMouseScroll", this.rakeMouseWheel, false);
	this.rakeDiv.addEventListener("touchstart", this.rakeTouchStart, false);
	this.rakeDiv.addEventListener("touchmove", this.rakeTouchMove, false);
	this.rakeDiv.addEventListener("touchend", this.rakeTouchEnd, false);
};
RiffShare2D.prototype.rakeMouseWheel = function (e) {
	e.preventDefault();
	var e = window.event || e;
	var wheelVal = e.wheelDelta || -e.detail;
	var min = Math.min(1, wheelVal);
	var delta = Math.max(-1, min);
	var zoom = riffShare2d.translateZ + delta * (riffShare2d.translateZ) * 0.077;
	if (zoom < 0.125) {
		zoom = 0.125;
	}
	if (zoom > 200) {
		zoom = 200;
	}
	riffShare2d.translateX = riffShare2d.translateX - (riffShare2d.translateZ - zoom) * e.layerX;
	riffShare2d.translateY = riffShare2d.translateY - (riffShare2d.translateZ - zoom) * e.layerY;
	riffShare2d.translateZ = zoom;
	riffShare2d.adjustContentPosition();
	riffShare2d.queueTiles();
	return false;
};
RiffShare2D.prototype.rakeMouseDown = function (mouseEvent) {
	mouseEvent.preventDefault();
	//console.log('::',riffShare2d.rakeDiv,this);
	riffShare2d.rakeDiv.addEventListener('mousemove', riffShare2d.rakeMouseMove, true);
	window.addEventListener('mouseup', riffShare2d.rakeMouseUp, false);
	riffShare2d.startMouseScreenX = mouseEvent.clientX;
	riffShare2d.startMouseScreenY = mouseEvent.clientY;
	riffShare2d.clickX = riffShare2d.startMouseScreenX;
	riffShare2d.clickY = riffShare2d.startMouseScreenY;
};
RiffShare2D.prototype.rakeMouseMove = function (mouseEvent) {
	mouseEvent.preventDefault();
	var dX = mouseEvent.clientX - riffShare2d.startMouseScreenX;
	var dY = mouseEvent.clientY - riffShare2d.startMouseScreenY;
	riffShare2d.translateX = riffShare2d.translateX + dX * riffShare2d.translateZ;
	riffShare2d.translateY = riffShare2d.translateY + dY * riffShare2d.translateZ;
	riffShare2d.startMouseScreenX = mouseEvent.clientX;
	riffShare2d.startMouseScreenY = mouseEvent.clientY;
	riffShare2d.moveZoom();
};
RiffShare2D.prototype.rakeMouseUp = function (mouseEvent) {
	mouseEvent.preventDefault();
	riffShare2d.rakeDiv.removeEventListener('mousemove', riffShare2d.rakeMouseMove, true);
	if (Math.abs(riffShare2d.clickX - mouseEvent.clientX) < riffShare2d.translateZ * riffShare2d.tapSize / 8 //
		 && Math.abs(riffShare2d.clickY - mouseEvent.clientY) < riffShare2d.translateZ * riffShare2d.tapSize / 8) {
		riffShare2d.click();
	}
	riffShare2d.adjustContentPosition();
	riffShare2d.queueTiles();
};
RiffShare2D.prototype.startTouchZoom = function (touchEvent) {
	riffShare2d.twoZoom = true;
	var p1 = riffShare2d.vectorFromTouch(touchEvent.touches[0]);
	var p2 = riffShare2d.vectorFromTouch(touchEvent.touches[1]);
	riffShare2d.twocenter = riffShare2d.vectorFindCenter(p1, p2);
	//direction = p1.subtract(p2);
	var d = riffShare2d.vectorDistance(p1, p2);
	if (d <= 0) {
		d = 1;
	}
	riffShare2d.twodistance = d;
};
RiffShare2D.prototype.rakeTouchStart = function (touchEvent) {
	//console.log('rakeTouchStart', touchEvent.touches.length);
	touchEvent.preventDefault();
	riffShare2d.startedTouch = true;
	if (touchEvent.touches.length < 2) {
		riffShare2d.twoZoom = false;
		riffShare2d.startMouseScreenX = touchEvent.touches[0].clientX;
		riffShare2d.startMouseScreenY = touchEvent.touches[0].clientY;
		riffShare2d.clickX = riffShare2d.startMouseScreenX;
		riffShare2d.clickY = riffShare2d.startMouseScreenY;
		riffShare2d.twodistance = 0;
		return;
	} else {
		riffShare2d.startTouchZoom(touchEvent);
	}
};
RiffShare2D.prototype.rakeTouchMove = function (touchEvent) {
	//console.log('rakeTouchMove', touchEvent.touches.length);
	touchEvent.preventDefault();
	if (touchEvent.touches.length < 2) {
		if (riffShare2d.twoZoom) {
			//
		} else {
			var dX = touchEvent.touches[0].clientX - riffShare2d.startMouseScreenX;
			var dY = touchEvent.touches[0].clientY - riffShare2d.startMouseScreenY;
			riffShare2d.translateX = riffShare2d.translateX + dX * riffShare2d.translateZ;
			riffShare2d.translateY = riffShare2d.translateY + dY * riffShare2d.translateZ;
			riffShare2d.startMouseScreenX = touchEvent.touches[0].clientX;
			riffShare2d.startMouseScreenY = touchEvent.touches[0].clientY;
			riffShare2d.moveZoom();
			return;
		}
	} else {
		if (!riffShare2d.twoZoom) {
			riffShare2d.startTouchZoom(touchEvent);
		} else {
			var p1 = riffShare2d.vectorFromTouch(touchEvent.touches[0]);
			var p2 = riffShare2d.vectorFromTouch(touchEvent.touches[1]);
			var d = riffShare2d.vectorDistance(p1, p2);
			if (d <= 0) {
				d = 1;
			}
			var ratio = d / riffShare2d.twodistance;
			riffShare2d.twodistance = d;
			var zoom = riffShare2d.translateZ / ratio;
			if (zoom < 0.5) {
				zoom = 0.5;
			}
			if (zoom > 100) {
				zoom = 100;
			}
			riffShare2d.translateX = riffShare2d.translateX - (riffShare2d.translateZ - zoom) * riffShare2d.twocenter.x;
			riffShare2d.translateY = riffShare2d.translateY - (riffShare2d.translateZ - zoom) * riffShare2d.twocenter.y;
			riffShare2d.translateZ = zoom;
			riffShare2d.adjustContentPosition();
		}
	}
};

RiffShare2D.prototype.rakeTouchEnd = function (touchEvent) {
	//console.log('rakeTouchEnd', touchEvent.touches.length);
	touchEvent.preventDefault();
	riffShare2d.queueTiles();
	if (!riffShare2d.twoZoom) {
		if (touchEvent.touches.length < 2) {
			if (riffShare2d.startedTouch) {
				if (Math.abs(riffShare2d.clickX - riffShare2d.startMouseScreenX) < riffShare2d.translateZ * riffShare2d.tapSize / 8 //
					 && Math.abs(riffShare2d.clickY - riffShare2d.startMouseScreenY) < riffShare2d.translateZ * riffShare2d.tapSize / 8) {
					riffShare2d.click();
				}
			} else {
				//console.log('touch ended already');
			}
			riffShare2d.adjustContentPosition();
			return;
		}
	}
	riffShare2d.twoZoom = false;
	riffShare2d.startedTouch = false;
	riffShare2d.adjustContentPosition();
};
RiffShare2D.prototype.click = function () {
	var xy = this.unzoom(this.clickX, this.clickY, this.translateZ);
	this.clickContentX = xy.x;
	this.clickContentY = xy.y;
	//console.log('click', this.clickX, this.clickY, 'content', this.clickContentX, this.clickContentY, 'zoom', this.translateZ);
	this.runSpots(this.clickContentX, this.clickContentY);
};
RiffShare2D.prototype.vectorDistance = function (xy1, xy2) {
	var xy = this.vectorSubstract(xy1, xy2);
	var n = this.vectorNorm(xy);
	return n;
};
RiffShare2D.prototype.vectorSubstract = function (xy1, xy2) {
	return {
		x : xy1.x - xy2.x,
		y : xy1.y - xy2.y
	};
};
RiffShare2D.prototype.vectorNorm = function (xy) {
	return Math.sqrt(this.vectorNormSquared(xy));
};
RiffShare2D.prototype.vectorNormSquared = function (xy) {
	return xy.x * xy.x + xy.y * xy.y;
};
RiffShare2D.prototype.vectorFromTouch = function (touch) {
	return {
		x : touch.clientX,
		y : touch.clientY
	};
};
RiffShare2D.prototype.vectorFindCenter = function (xy1, xy2) {
	var xy = this.vectorAdd(xy1, xy2);
	return this.vectorScale(xy, 0.5);
};
RiffShare2D.prototype.vectorAdd = function (xy1, xy2) {
	return {
		x : xy1.x + xy2.x,
		y : xy1.y + xy2.y
	};
};
RiffShare2D.prototype.vectorScale = function (xy, coef) {
	return {
		x : xy.x * coef,
		y : xy.y * coef
	};
};
RiffShare2D.prototype.unzoom = function (x, y, z) {
	var xy = {
		x : x * z - this.translateX,
		y : y * z - this.translateY
	};
	if (this.contentDiv.clientWidth * z > this.innerWidth) {
		xy.x = x * z - ((this.contentDiv.clientWidth * z - this.innerWidth) / 2);
	}
	if (this.contentDiv.clientHeight * z > this.innerHeight) {
		xy.y = y * z - ((this.contentDiv.clientHeight * z - this.innerHeight) / 2);
	}
	xy.x = Math.round(xy.x);
	xy.y = Math.round(xy.y);
	return xy;
};
