var mme;
console.log('clicktap v1.06');
var twodistance = 1;

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
	return new Vector(touch.screenX, touch.screenY);
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
		if (zoom < 0.01) {
			zoom = 0.01;
		}
		if (zoom > 1) {
			zoom = 1;
		}
		//var xy = me.rake2content(e.layerX, e.layerY, me.translateZ);
		//var t = me.content2rake(e.layerX, e.layerY, xy.x, xy.y, zoom);
		var xy = me.rake2content(e.screenX, e.screenY, me.translateZ);
		var t = me.content2rake(e.screenX, e.screenY, xy.x, xy.y, zoom);
		me.translateX = t.x;
		me.translateY = t.y;
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
		startMouseScreenX = mouseEvent.screenX;
		startMouseScreenY = mouseEvent.screenY;
		clickX = startMouseScreenX;
		clickY = startMouseScreenY;
		//var xy = me.rake2content(mouseEvent.layerX, mouseEvent.layerY, me.translateZ);
		//var xy = me.rake2content(startMouseScreenX, startMouseScreenY, me.translateZ);
		//me.setMark(xy.x, xy.y);
		//clickX = mouseEvent.screenX;
		//clickY = mouseEvent.screenY;
	};
	var rakeMouseMove = function (mouseEvent) {
		//console.log('rakeMouseMove', mouseEvent);
		mouseEvent.preventDefault();

		var dX = mouseEvent.screenX - startMouseScreenX;
		var dY = mouseEvent.screenY - startMouseScreenY;
		me.translateX = me.translateX + dX;
		me.translateY = me.translateY + dY;
		startMouseScreenX = mouseEvent.screenX;
		startMouseScreenY = mouseEvent.screenY;
		me.setTransform(me.contentDiv, me.translateX, me.translateY, me.translateZ);
	};
	var rakeMouseUp = function (mouseEvent) {
		//console.log('rakeMouseUp', mouseEvent);
		mouseEvent.preventDefault();

		me.rakeDiv.removeEventListener('mousemove', rakeMouseMove, true);
		if (Math.abs(clickX - mouseEvent.screenX) < me.tapSize / 4 && Math.abs(clickY - mouseEvent.screenY) < me.tapSize / 4) {
			click(me);
		}
		me.adjustCountentPosition();
		me.reDraw();
	};
	var rakeTouchStart = function (touchEvent) {
		touchEvent.preventDefault();
		console.log('rakeTouchStart', touchEvent);
		if (touchEvent.targetTouches.length < 2) {
			startMouseScreenX = touchEvent.targetTouches[0].screenX;
			startMouseScreenY = touchEvent.targetTouches[0].screenY;
			clickX = startMouseScreenX;
			clickY = startMouseScreenY;
			twodistance = 0;
			return;
		} else {
			var p1 = Vector.fromTouch(touchEvent.targetTouches[0]);
			var p2 = Vector.fromTouch(touchEvent.targetTouches[1]);
			twocenter = Vector.findCenter(p1, p2);
			//direction = p1.subtract(p2);
			var d = Vector.distance(p1, p2);
			if(d<=0)d=1;
			twodistance = d;
		}
	};
	var rakeTouchMove = function (touchEvent) {
		touchEvent.preventDefault();
		console.log('rakeTouchMove', touchEvent);
		if (touchEvent.targetTouches.length < 2) {
			var dX = touchEvent.targetTouches[0].screenX - startMouseScreenX;
			var dY = touchEvent.targetTouches[0].screenY - startMouseScreenY;
			me.translateX = me.translateX + dX;
			me.translateY = me.translateY + dY;
			startMouseScreenX = touchEvent.targetTouches[0].screenX;
			startMouseScreenY = touchEvent.targetTouches[0].screenY;
			me.setTransform(me.contentDiv, me.translateX, me.translateY, me.translateZ);
			return;
		} else {
			var p1 = Vector.fromTouch(touchEvent.targetTouches[0]);
			var p2 = Vector.fromTouch(touchEvent.targetTouches[1]);
			var d = Vector.distance(p1, p2);
			if(d<=0)d=1;
			var ratio=d/twodistance;
			twodistance = d;
			
			
			
			var zoom = me.translateZ *ratio;
		if (zoom < 0.01) {
			zoom = 0.01;
		}
		if (zoom > 1) {
			zoom = 1;
		}
		var xy = me.rake2content(twocenter.x, twocenter.y, me.translateZ);
		var t = me.content2rake(twocenter.x, twocenter.y, xy.x, xy.y, zoom);
		me.translateX = t.x;
		me.translateY = t.y;
		me.translateZ = zoom;
		//console.log('wheel zoom to', zoom);
		me.adjustCountentPosition();
		me.reDraw();

		
		}
	};
	var rakeTouchEnd = function (touchEvent) {
		touchEvent.preventDefault();
		console.log('rakeTouchEnd', touchEvent);
		if (touchEvent.targetTouches.length < 2) {
			if (Math.abs(clickX - startMouseScreenX) < me.tapSize / 4 && Math.abs(clickY - startMouseScreenY) < me.tapSize / 4) {
				click(me);
			}
			me.adjustCountentPosition();
			me.reDraw();
			return;
		}
	};
	var click = function (me) {
		console.log('click');
		//console.log('point',xx,yy);
		//console.log('size',ww,hh);
		//console.log('translate',me.translateX,me.translateY,me.translateZ);
	};
	me.rakeDiv.addEventListener('mousedown', rakeMouseDown, false);
	me.rakeDiv.addEventListener("mousewheel", rakeMouseWheel, false);
	me.rakeDiv.addEventListener("DOMMouseScroll", rakeMouseWheel, false);
	//me.rakeDiv.addEventListener("gestureend", rakeGestureEnd, false);
	me.rakeDiv.addEventListener("touchstart", rakeTouchStart, false);
	me.rakeDiv.addEventListener("touchmove", rakeTouchMove, false);
	me.rakeDiv.addEventListener("touchend", rakeTouchEnd, false);
}
