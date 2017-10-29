TileLevel.prototype.setupTouchMouse = function () {
	this.startMouseScreenX = 0;
	this.startMouseScreenY = 0;
	this.clickX = 0;
	this.clickY = 0;
	this.twoZoom = false;
	this.twodistance = 0;
	this.twocenter = {
		x: 0,
		y: 0
	};
	this.svg.addEventListener('mousedown', this.rakeMouseDown, false);
	this.svg.addEventListener("mousewheel", this.rakeMouseWheel, false);
	this.svg.addEventListener("DOMMouseScroll", this.rakeMouseWheel, false);
	this.svg.addEventListener("touchstart", this.rakeTouchStart, false);
	this.svg.addEventListener("touchmove", this.rakeTouchMove, false);
	this.svg.addEventListener("touchend", this.rakeTouchEnd, false);
};
TileLevel.prototype.rakeMouseWheel = function (e) {
	e.preventDefault();
	var me=this.backlink;
	//var e = window.event || e;
	//console.log(e);
	var wheelVal = e.wheelDelta || -e.detail;
	var min = Math.min(1, wheelVal);
	var delta = Math.max(-1, min);
	var zoom = me.translateZ + delta * (me.translateZ) * 0.077;
	if (zoom < 1) {
		zoom = 1;
	}
	if (zoom > me.maxZoom()) {
		zoom = me.maxZoom();
	}
	/*if (zoom < me.minZoom) {
		zoom = me.minZoom;
	}
	if (zoom > me.maxZoom) {
		zoom = me.maxZoom;
	}*/
	//me.translateX = me.translateX - (me.translateZ - zoom) * e.layerX;
	//me.translateY = me.translateY - (me.translateZ - zoom) * e.layerY;
	me.translateX = me.translateX - (me.translateZ - zoom) * e.offsetX;
	me.translateY = me.translateY - (me.translateZ - zoom) * e.offsetY;
	me.translateZ = zoom;
	//console.log('set',me.translateX,me.translateY,me.translateZ);
	me.adjustContentPosition();
	me.queueTiles();
	//console.log(me.translateX,me.translateY,me.translateZ);
	return false;
};
TileLevel.prototype.rakeMouseDown = function (mouseEvent) {
	mouseEvent.preventDefault();
	//console.log('rakeMouseDown',this.backlink);
	var me=this.backlink;
	me.svg.addEventListener('mousemove', me.rakeMouseMove, true);
	me.svg.addEventListener('mouseup', me.rakeMouseUp, false);
	//window.addEventListener('mouseup', me.rakeMouseUp, false);
	//me.startMouseScreenX = mouseEvent.clientX;
	//me.startMouseScreenY = mouseEvent.clientY;
	me.startMouseScreenX = mouseEvent.offsetX;
	me.startMouseScreenY = mouseEvent.offsetY;
	me.clickX = me.startMouseScreenX;
	me.clickY = me.startMouseScreenY;
};
TileLevel.prototype.rakeMouseMove = function (mouseEvent) {
	mouseEvent.preventDefault();
	var me=this.backlink;
	var dX = mouseEvent.offsetX - me.startMouseScreenX;
	var dY = mouseEvent.offsetY - me.startMouseScreenY;
	//var dX = mouseEvent.clientX - me.startMouseScreenX;
	//var dY = mouseEvent.clientY - me.startMouseScreenY;
	me.translateX = me.translateX + dX * me.translateZ;
	me.translateY = me.translateY + dY * me.translateZ;
	//me.startMouseScreenX = mouseEvent.clientX;
	//me.startMouseScreenY = mouseEvent.clientY;
	me.startMouseScreenX = mouseEvent.offsetX;
	me.startMouseScreenY = mouseEvent.offsetY;
	me.moveZoom();
};
TileLevel.prototype.rakeMouseUp = function (mouseEvent) {
	mouseEvent.preventDefault();
	var me=this.backlink;
	//console.log('rakeMouseUp');
	me.svg.removeEventListener('mousemove', me.rakeMouseMove, true);
	//if (Math.abs(me.clickX - mouseEvent.clientX) < me.translateZ * me.tapSize / 8 //
	//	 && Math.abs(me.clickY - mouseEvent.clientY) < me.translateZ * me.tapSize / 8) {
	if (Math.abs(me.clickX - mouseEvent.offsetX) < me.translateZ * me.tapSize / 8 //
		 && Math.abs(me.clickY - mouseEvent.offsetY) < me.translateZ * me.tapSize / 8) {
		me.click();
	}
	me.adjustContentPosition();
	me.queueTiles();
};
TileLevel.prototype.startTouchZoom = function (touchEvent) {
	var me=this.backlink;
	me.twoZoom = true;
	var p1 = me.vectorFromTouch(touchEvent.touches[0]);
	var p2 = me.vectorFromTouch(touchEvent.touches[1]);
	me.twocenter = me.vectorFindCenter(p1, p2);
	var d = me.vectorDistance(p1, p2);
	if (d <= 0) {
		d = 1;
	}
	me.twodistance = d;
};
TileLevel.prototype.rakeTouchStart = function (touchEvent) {
	touchEvent.preventDefault();
	var me=this.backlink;
	me.startedTouch = true;
	if (touchEvent.touches.length < 2) {
		me.twoZoom = false;
		//me.startMouseScreenX = touchEvent.touches[0].clientX;
		//me.startMouseScreenY = touchEvent.touches[0].clientY;
		me.startMouseScreenX = touchEvent.touches[0].offsetX;
		me.startMouseScreenY = touchEvent.touches[0].offsetY;
		me.clickX = me.startMouseScreenX;
		me.clickY = me.startMouseScreenY;
		me.twodistance = 0;
		return;
	} else {
		me.startTouchZoom(touchEvent);
	}
};
TileLevel.prototype.rakeTouchMove = function (touchEvent) {
	touchEvent.preventDefault();
	var me=this.backlink;
	if (touchEvent.touches.length < 2) {
		if (me.twoZoom) {
			//
		} else {
			var dX = touchEvent.touches[0].offsetX - me.startMouseScreenX;
			var dY = touchEvent.touches[0].offsetY - me.startMouseScreenY;
			//var dX = touchEvent.touches[0].clientX - me.startMouseScreenX;
			//var dY = touchEvent.touches[0].clientY - me.startMouseScreenY;
			me.translateX = me.translateX + dX * me.translateZ;
			me.translateY = me.translateY + dY * me.translateZ;
			//me.startMouseScreenX = touchEvent.touches[0].clientX;
			//me.startMouseScreenY = touchEvent.touches[0].clientY;
			me.startMouseScreenX = touchEvent.touches[0].offsetX;
			me.startMouseScreenY = touchEvent.touches[0].offsetY;
			me.moveZoom();
			return;
		}
	} else {
		if (!me.twoZoom) {
			me.startTouchZoom(touchEvent);
		} else {
			var p1 = me.vectorFromTouch(touchEvent.touches[0]);
			var p2 = me.vectorFromTouch(touchEvent.touches[1]);
			var d = me.vectorDistance(p1, p2);
			if (d <= 0) {
				d = 1;
			}
			var ratio = d / me.twodistance;
			me.twodistance = d;
			var zoom = me.translateZ / ratio;
			if (zoom < 1) {
				zoom = 1;
			}
			if (zoom > me.maxZoom()) {
				zoom = me.maxZoom();
			}
			/*if (zoom < me.minZoom) {
				zoom = me.minZoom;
			}
			if (zoom > me.maxZoom) {
				zoom = me.maxZoom;
			}*/
			me.translateX = me.translateX - (me.translateZ - zoom) * me.twocenter.x;
			me.translateY = me.translateY - (me.translateZ - zoom) * me.twocenter.y;
			me.translateZ = zoom;
			me.adjustContentPosition();
		}
	}
};

TileLevel.prototype.rakeTouchEnd = function (touchEvent) {
	touchEvent.preventDefault();
	var me=this.backlink;
	me.queueTiles();
	if (!me.twoZoom) {
		if (touchEvent.touches.length < 2) {
			if (me.startedTouch) {
				if (Math.abs(me.clickX - me.startMouseScreenX) < me.translateZ * me.tapSize / 8 //
					 && Math.abs(me.clickY - me.startMouseScreenY) < me.translateZ * me.tapSize / 8) {
					me.click();
				}
			} else {
				//console.log('touch ended already');
			}
			me.adjustContentPosition();
			return;
		}
	}
	me.twoZoom = false;
	me.startedTouch = false;
	me.adjustContentPosition();
};
TileLevel.prototype.click = function () {
	var xy = this.unzoom(this.clickX, this.clickY, this.translateZ);
	this.clickContentX = xy.x;
	this.clickContentY = xy.y;
	//console.log(this.clickX, this.clickY,this.clickContentX,this.clickContentY);
	this.runSpots(this.clickContentX, this.clickContentY);
};
