var mme;
function attachTapMouse(me){
	console.log('attachTapMouse',me);
	mme=me;
	var startMouseScreenX = 0.0;
	var startMouseScreenY = 0.0;
	var clickX=0;
	var clickY=0;
	var rakeMouseWheel = function (e) {
		
		e.preventDefault();
		
		var e = window.event || e;
		var wheelVal=e.wheelDelta || -e.detail;
		var min=Math.min(1, wheelVal);
		var delta = Math.max(-1,min );
		var zoom = me.translateZ + delta * (me.translateZ)*0.01;
		if (zoom <0.01) {zoom=0.01;}
		if ( zoom >1) {zoom=1;}
		var xy = me.rake2content(e.layerX, e.layerY, me.translateZ);
		var t = me.content2rake(e.layerX, e.layerY,  xy.x, xy.y, zoom);
		me.translateX = t.x;
		me.translateY = t.y;
		me.translateZ = zoom;
		console.log('wheel zoom to',zoom);
		me.adjustCountentPosition();
		me.reDraw();
		
		return false;
	};
	var rakeMouseDown = function (mouseEvent) {
		
		mouseEvent.preventDefault();
		//console.log('down',mouseEvent);
		me.rakeDiv.addEventListener('mousemove', rakeMouseMove, true);
		window.addEventListener('mouseup', rakeMouseUp, false);
		startMouseScreenX = mouseEvent.screenX;
		startMouseScreenY = mouseEvent.screenY;
		var xy = me.rake2content(mouseEvent.layerX, mouseEvent.layerY, me.translateZ);
		//me.setMark(xy.x, xy.y);
		clickX = mouseEvent.screenX;
		clickY = mouseEvent.screenY;
	};
	var rakeMouseMove = function (mouseEvent) {
		
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
		
		mouseEvent.preventDefault();
		
		me.rakeDiv.removeEventListener('mousemove', rakeMouseMove, true);
		if(Math.abs(clickX-mouseEvent.screenX)<me.tapSize/4 && Math.abs(clickY-mouseEvent.screenY)<me.tapSize/4){
			click(me);
		}
		me.adjustCountentPosition();
		me.reDraw();
	};
	var rakeTouchStart = function (e) {
		e.preventDefault();
		console.log('rakeTouchStart',e);
		
	};
	var rakeTouchMove = function (e) {
		e.preventDefault();
		console.log('rakeTouchMove',e);
	};
	var rakeTouchEnd = function (e) {
		e.preventDefault();
		console.log('rakeTouchEnd',e);
	};
	var click=function(me){
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
