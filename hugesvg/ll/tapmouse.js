var mme;
console.log('tapmouse v1.08');
var twodistance = 1;
var clickContentX = 0;
var clickContentY = 0;
var twoZoom = false;
var Vector = function (x, y) {
	this.x = x;
	this.y = y;
};
var twocenter = new Vector(0, 0);
Vector.prototype.add = function (p) {
	return new Vector(this.x + p.x, this.y + p.y);
};

Vector.prototype.subtract = function (p) {
	return new Vector(this.x - p.x, this.y - p.y);
};

Vector.prototype.scale = function (coef) {
	return new Vector(this.x * coef, this.y * coef);
};

Vector.prototype.normSquared = function () {
	return this.x * this.x + this.y * this.y;
};

Vector.prototype.norm = function () {
	return Math.sqrt(this.normSquared());
};

Vector.fromTouch = function (touch) {
	return new Vector(touch.clientX, touch.clientY);
};

Vector.findCenter = function (p1, p2) {
	return p1.add(p2).scale(.5);
};

Vector.distanceSquared = function (p1, p2) {
	return p1.subtract(p2).normSquared();
};

Vector.distance = function (p1, p2) {
	return p1.subtract(p2).norm();
};

// Calculates the cross product ( http://en.wikipedia.org/wiki/Cross_product ) of two vectors.
Vector.crossProduct = function (p1, p2) {
	return p1.x * p2.y - p1.y * p2.x;
};
var unzoom = function (x, y, z) {
	var xy = {
		x : x * z - mme.translateX,
		y : y * z - mme.translateY
	};
	if (mme.contentDiv.clientWidth * z > mme.innerWidth) {
		//console.log('half',me.contentDiv.clientWidth  , me.innerWidth);
		xy.x = x * z - ((mme.contentDiv.clientWidth * z - mme.innerWidth) / 2);
	}
	if (mme.contentDiv.clientHeight * z > mme.innerHeight) {
		//console.log('half',me.contentDiv.clientWidth  , me.innerWidth);
		xy.y = y * z - ((mme.contentDiv.clientHeight * z - mme.innerHeight) / 2);
	}

	return xy;
};
function attachTapMouse(me) {
	console.log('attachTapMouse', me);
	mme = me;
	var startMouseScreenX = 0.0;
	var startMouseScreenY = 0.0;
	var clickX = 0;
	var clickY = 0;
	var rakeMouseWheel = function (e) {

		e.preventDefault();

		var e = window.event || e;
		var wheelVal = e.wheelDelta || -e.detail;
		var min = Math.min(1, wheelVal);
		var delta = Math.max(-1, min);
		var zoom = me.translateZ + delta * (me.translateZ) * 0.077;
		if (zoom < 1) {
			zoom = 1;
		}
		if (zoom > 100) {
			zoom = 100;
		}

		//console.log('wheel',zoom);

		//var xy = me.rake2content(e.layerX, e.layerY, me.translateZ);
		//var t = me.content2rake(e.layerX, e.layerY, xy.x, xy.y, zoom);
		//var xy = me.rake2content(e.clientX, e.clientY, me.translateZ);
		//var t = me.content2rake(e.clientX, e.clientY, xy.x, xy.y, zoom);
		//me.translateX = t.x;
		//me.translateY = t.y;
		me.translateX = me.translateX - (me.translateZ - zoom) * e.layerX;
		me.translateY = me.translateY - (me.translateZ - zoom) * e.layerY;
		me.translateZ = zoom;
		//console.log('wheel zoom to', zoom);
		me.adjustCountentPosition();
		me.reDraw();

		return false;
	};
	var rakeMouseDown = function (mouseEvent) {
		//console.log('rakeMouseDown', mouseEvent);
		mouseEvent.preventDefault();
		//console.log('down',mouseEvent);
		me.rakeDiv.addEventListener('mousemove', rakeMouseMove, true);
		window.addEventListener('mouseup', rakeMouseUp, false);
		startMouseScreenX = mouseEvent.clientX;
		startMouseScreenY = mouseEvent.clientY;
		clickX = startMouseScreenX;
		clickY = startMouseScreenY;
		//var xy = me.rake2content(mouseEvent.layerX, mouseEvent.layerY, me.translateZ);
		//var xy = me.rake2content(startMouseScreenX, startMouseScreenY, me.translateZ);
		//me.setMark(xy.x, xy.y);
		//clickX = mouseEvent.clientX;
		//clickY = mouseEvent.clientY;
	};
	var rakeMouseMove = function (mouseEvent) {
		//console.log('rakeMouseMove', mouseEvent);
		mouseEvent.preventDefault();

		var dX = mouseEvent.clientX - startMouseScreenX;
		var dY = mouseEvent.clientY - startMouseScreenY;
		me.translateX = me.translateX + dX * mme.translateZ;
		me.translateY = me.translateY + dY * mme.translateZ;
		startMouseScreenX = mouseEvent.clientX;
		startMouseScreenY = mouseEvent.clientY;
		//me.setTransform(me.contentDiv, me.translateX, me.translateY, me.translateZ);
		me.moveZoom();
	};
	var rakeMouseUp = function (mouseEvent) {
		//console.log('rakeMouseUp', mouseEvent);
		mouseEvent.preventDefault();

		me.rakeDiv.removeEventListener('mousemove', rakeMouseMove, true);
		if (Math.abs(clickX - mouseEvent.clientX) < me.tapSize / 4 && Math.abs(clickY - mouseEvent.clientY) < me.tapSize / 4) {
			click(me);
		}
		me.adjustCountentPosition();
		me.reDraw();
	};
	var startTouchZoom = function (touchEvent) {
		twoZoom = true;
		var p1 = Vector.fromTouch(touchEvent.touches[0]);
		var p2 = Vector.fromTouch(touchEvent.touches[1]);
		twocenter = Vector.findCenter(p1, p2);
		//direction = p1.subtract(p2);
		var d = Vector.distance(p1, p2);
		if (d <= 0) {
			d = 1;
		}
		twodistance = d;
	};
	var rakeTouchStart = function (touchEvent) {
		touchEvent.preventDefault();
		//console.log('-rakeTouchStart', touchEvent.targetTouches.length);
		if (touchEvent.touches.length < 2) {
			twoZoom = false;
			startMouseScreenX = touchEvent.touches[0].clientX;
			startMouseScreenY = touchEvent.touches[0].clientY;
			clickX = startMouseScreenX;
			clickY = startMouseScreenY;
			twodistance = 0;
			return;
		} else {
			startTouchZoom(touchEvent);
		}
	};
	var rakeTouchMove = function (touchEvent) {
		touchEvent.preventDefault();
		//console.log('-----rakeTouchMove', touchEvent.targetTouches.length, touchEvent.touches.length);

		if (touchEvent.touches.length < 2) {
			if (twoZoom) {
				//
			} else {
				var dX = touchEvent.touches[0].clientX - startMouseScreenX;
				var dY = touchEvent.touches[0].clientY - startMouseScreenY;
				me.translateX = me.translateX + dX * me.translateZ;
				me.translateY = me.translateY + dY * me.translateZ;
				startMouseScreenX = touchEvent.touches[0].clientX;
				startMouseScreenY = touchEvent.touches[0].clientY;
				//console.log('move', me.translateZ, dX, dY);
				//me.setTransform(me.contentDiv, me.translateX, me.translateY, me.translateZ);
				/*me.adjustCountentPosition();
				me.reDraw();*/
				me.moveZoom();
				return;
			}
		} else {
			if (!twoZoom) {
				startTouchZoom(touchEvent);
			} else {
				var p1 = Vector.fromTouch(touchEvent.touches[0]);
				var p2 = Vector.fromTouch(touchEvent.touches[1]);
				var d = Vector.distance(p1, p2);
				if (d <= 0) {
					d = 1;
				}
				var ratio = d / twodistance;
				twodistance = d;

				var zoom = me.translateZ / ratio;
				if (zoom < 1) {
					zoom = 1;
				}
				if (zoom > 100) {
					zoom = 100;
				}
				//var xy = me.rake2content(twocenter.x, twocenter.y, me.translateZ);
				//var t = me.content2rake(twocenter.x, twocenter.y, xy.x, xy.y, zoom);
				/*
				var xy1 = unzoom(twocenter.x, twocenter.y, me.translateZ);
				var xy2 = unzoom(twocenter.x, twocenter.y, zoom);
				me.translateX = me.translateX + (xy1.x - xy2.x)/2;
				me.translateY = me.translateY + (xy1.y - xy2.y)/2;
				*/
				//console.log('zoom to', zoom, ratio,me.translateX , me.translateX - (me.translateZ - zoom) * twocenter.x,twocenter.x);
				me.translateX = me.translateX - (me.translateZ - zoom) * twocenter.x;
				me.translateY = me.translateY - (me.translateZ - zoom) * twocenter.y;
				me.translateZ = zoom;
				
				me.adjustCountentPosition();
				me.reDraw();
			}
		}
	};

	var rakeTouchEnd = function (touchEvent) {
		touchEvent.preventDefault();
		//console.log('---rakeTouchEnd', touchEvent.targetTouches.length);
		if (!twoZoom) {
			if (touchEvent.touches.length < 2) {
				if (Math.abs(clickX - startMouseScreenX) < me.tapSize / 4 && Math.abs(clickY - startMouseScreenY) < me.tapSize / 4) {
					click(me);
				}
				me.adjustCountentPosition();
				me.reDraw();
				return;
			}
		}
		twoZoom = false;
	};
	var click = function (me) {
		/*
		var halfW = 0;
		var halfH = 0;

		if (me.innerWidth * me.translateZ < me.rakeDiv.clientWidth) {
		halfW = (me.rakeDiv.clientWidth - me.innerWidth * me.translateZ) / 2;
		}
		if (me.innerHeight * me.translateZ < me.rakeDiv.clientHeight) {
		halfH = (me.rakeDiv.clientHeight - me.innerHeight * me.translateZ) / 2;
		}
		 */
		//var xy = me.rake2content(clickX - halfW, clickY - halfH, me.translateZ);
		//clickContentX = xy.x;
		//clickContentY = xy.y;
		//console.log('click', clickX, clickY, clickContentX, clickContentY, me);
		//console.log('point',xx,yy);
		//console.log('size',ww,hh);
		//console.log('translate',me.translateX,me.translateY,me.translateZ);
		var xy = unzoom(clickX, clickY, me.translateZ);
		clickContentX = xy.x;
		clickContentY = xy.y;
		console.log('click', clickX, clickY, 'content', clickContentX, clickContentY, 'zoom', me.translateZ);
	};
	me.rakeDiv.addEventListener('mousedown', rakeMouseDown, false);
	me.rakeDiv.addEventListener("mousewheel", rakeMouseWheel, false);
	me.rakeDiv.addEventListener("DOMMouseScroll", rakeMouseWheel, false);
	//me.rakeDiv.addEventListener("gestureend", rakeGestureEnd, false);
	me.rakeDiv.addEventListener("touchstart", rakeTouchStart, false);
	me.rakeDiv.addEventListener("touchmove", rakeTouchMove, false);
	me.rakeDiv.addEventListener("touchend", rakeTouchEnd, false);
}
