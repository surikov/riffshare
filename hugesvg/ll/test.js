﻿console.log('test 1');
function RakeView(rakeName, contentName, svgName, width, height) {
	var me = this;
	me.testProperty = function (props) {
		var style = document.documentElement.style;
		for (var i = 0; i < props.length; i++) {
			if (props[i]in style) {
				return props[i];
			}
		}
		return false;
	};

	me.rake2content = function (x, y) {
		var xy = {};
		var maxX = me.innerWidth * (me.translateZ - 1) / 2;
		xy.x = (x - me.translateX + maxX) / me.translateZ;
		var maxY = me.innerHeight * (me.translateZ - 1) / 2;
		xy.y = (y - me.translateY + maxY) / me.translateZ;
		return xy;
	};
	me.rakeMouseDown = function (mouseEvent) {
		me.rakeDiv.addEventListener('mousemove', me.rakeMouseMove, true);
		window.addEventListener('mouseup', me.rakeMouseUp, false);
		me.startMouseScreenX = mouseEvent.screenX;
		me.startMouseScreenY = mouseEvent.screenY;
		//
		var xy = me.rake2content(mouseEvent.layerX, mouseEvent.layerY);
		/*console.log(mouseEvent);
		var maxX = me.innerWidth * (me.translateZ - 1) / 2;
		var cx=(mouseEvent.layerX-me.translateX+maxX)/me.translateZ;
		var maxY = me.innerHeight * (me.translateZ - 1) / 2;
		var cy=(mouseEvent.layerY-me.translateY+maxY)/me.translateZ;
		console.log('layer',mouseEvent.layerX,mouseEvent.layerY);
		console.log('translate',me.translateX,me.translateY,me.translateZ);
		console.log('max',maxX);
		console.log('c',cx,cy);*/
		//me.mark.setAttributeNS(null, "cx", xy.x);
		//me.mark.setAttributeNS(null, "cy", xy.y);
		me.setMark(xy.x, xy.y);
	};
	me.rakeMouseMove = function (mouseEvent) {
		var dX = mouseEvent.screenX - me.startMouseScreenX;
		var dY = mouseEvent.screenY - me.startMouseScreenY;
		me.translateX = me.translateX + dX;
		me.translateY = me.translateY + dY;
		me.startMouseScreenX = mouseEvent.screenX;
		me.startMouseScreenY = mouseEvent.screenY;
		me.setTransform(me.contentDiv, me.translateX, me.translateY, me.translateZ);
	};
	me.rakeMouseUp = function (mouseEvent) {
		me.rakeDiv.removeEventListener('mousemove', me.rakeMouseMove, true);
		me.adjustCountentPosition();
	};
	me.adjustCountentPosition = function () {
		if (me.innerWidth * me.translateZ < me.rakeDiv.clientWidth) {
			me.translateX = (me.rakeDiv.clientWidth - me.innerWidth) / 2;
		} else {
			var maxX = me.innerWidth * (me.translateZ - 1) / 2;
			if (me.translateX > maxX) {
				me.translateX = maxX;
			}
			var minX = me.rakeDiv.clientWidth - me.innerWidth * me.translateZ + maxX;
			if (me.translateX < minX) {
				me.translateX = minX;
			}
		}
		if (me.innerHeight * me.translateZ < me.rakeDiv.clientHeight) {
			me.translateY = (me.rakeDiv.clientHeight - me.innerHeight) / 2;
		} else {
			var maxY = me.innerHeight * (me.translateZ - 1) / 2;
			if (me.translateY > maxY) {
				me.translateY = maxY;
			}
			var minY = me.rakeDiv.clientHeight - me.innerHeight * me.translateZ + maxY;
			if (me.translateY < minY) {
				me.translateY = minY;
			}
		}
		me.setTransform(me.contentDiv, me.translateX, me.translateY, me.translateZ);
	};
	me.setTransform = function (el, x, y, scale) {
		var transformString = 'translate3d(' + x + 'px,' + y + 'px,0)';
		if (me.ie3d) {
			transformString = 'translate(' + x + 'px,' + y + 'px)';
		}
		var style = transformString;
		if (scale) {
			style = style + ' scale(' + scale + ')';
		}
		el.style[me.info.idxTransform] = style;
	};
	me.addSVGRectangle = function (x, y, w, h) {
		/*
		var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute('style', 'border:1px solid #660000; transform:translate3d(' + x + 'px,' + y + 'px,0px); position:absolute');
		svg.setAttribute('width', '' + w);
		svg.setAttribute('height', '' + h);
		me.contentSVG.appendChild(svg);
		 */
		var rect = document.createElementNS(me.svgns, 'rect');
		rect.setAttributeNS(null, 'x', x);
		rect.setAttributeNS(null, 'y', y);
		rect.setAttributeNS(null, 'height', w);
		rect.setAttributeNS(null, 'width', h);
		rect.setAttributeNS(null, 'fill', '#' + Math.round(0xffffff * Math.random()).toString(16));
		me.contentSVG.appendChild(rect);
		return rect;
	};
	me.addSVGCircle = function (cx, cy, r) {
		var shape = document.createElementNS(me.svgns, "circle");
		shape.setAttributeNS(null, "cx", cx);
		shape.setAttributeNS(null, "cy", cy);
		shape.setAttributeNS(null, "r", r);
		shape.setAttributeNS(null, "fill", "none");
		shape.setAttributeNS(null, "stroke", "black");
		shape.setAttributeNS(null, "stroke-width", "1");
		me.contentSVG.appendChild(shape);
		return shape;
	};
	me.addSVGFillCircle = function (cx, cy, r) {
		var shape = document.createElementNS(me.svgns, "circle");
		shape.setAttributeNS(null, "cx", cx);
		shape.setAttributeNS(null, "cy", cy);
		shape.setAttributeNS(null, "r", r);
		shape.setAttributeNS(null, "fill", "black");
		shape.setAttributeNS(null, "stroke", "none");
		shape.setAttributeNS(null, "stroke-width", "0");
		me.contentSVG.appendChild(shape);
		return shape;
	};
	/*me.addSvgPolyline = function (x, y, w, h) {
	var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	//svg.setAttribute('style', 'border:30px solid #00ff00; transform:translate3d(' + x + 'px,' + y + 'px,0px); position:absolute');
	svg.setAttribute('style', 'border:30px solid #00ff00; position:absolute');
	svg.setAttribute('version', '1.1');
	svg.setAttribute('width', '' + w);
	svg.setAttribute('height', '' + h);
	var polyline = document.createElementNS("http://www.w3.org/2000/svg", "path");
	console.log('polyline', polyline);
	//var points='M150 0 L75 200 L225 200 Z';
	//var points='M 150 0 L 75 200 L 225 200 Z';
	var points = 'm 236 648';
	points = points + ' c 246 648 238 648 242 648';
	points = points + ' c 288 646 261 648 283 648';
	points = points + ' c 472 513 364 634 428 587';
	points = points + ' c 514 347 502 464 514 413';
	points = points + ' c 462 163 514 272 499 217';
	points = points + ' c 257 44 409 83 333 44';
	points = points + ' c 50 163 181 44 103 83';
	points = points + ' c 0 347 14 217 0 272';
	points = points + ' c 40 513 0 413 12 464';
	points = points + ' c 236 648 87 591 155 638';
	points = points + ' m 277 614';
	points = points + ' c 253 616 273 616 261 616';
	points = points + ' c 242 616 247 616 243 616';
	points = points + ' c 170 499 193 609 181 589';
	points = points + ' c 159 348 163 446 159 398';
	points = points + ' c 166 222 159 308 161 266';
	points = points + ' c 201 91 174 138 183 106';
	points = points + ' c 257 76 215 81 235 76';
	points = points + ' c 311 91 277 76 299 81';
	points = points + ' c 347 222 330 106 338 138';
	points = points + ' c 353 348 352 266 353 308';
	points = points + ' c 344 499 353 398 351 446';
	points = points + ' c 277 614 333 587 322 606';
	points = points + ' m 257 -1 l 258 -1 l 255 -1 l 257 -1';
	points = points + ' m 257 673 l 258 673 l 255 673 l 257 673 ';
	points = points + ' M150 0 L75 200 L225 200 Z';
	//points=points+'z';
	polyline.setAttribute('d', points);
	svg.appendChild(polyline);
	me.setTransform(svg, -5000, -5000, 0.05);
	me.contentDiv.appendChild(svg);
	};*/
	me.checkEnvironment = function () {
		var env = {};
		env.ua = navigator.userAgent.toLowerCase();
		env.doc = document.documentElement;
		env.ie = 'ActiveXObject' in window;
		env.webkit = env.ua.indexOf('webkit') !== -1;
		env.phantomjs = env.ua.indexOf('phantom') !== -1;
		env.android23 = env.ua.search('android [23]') !== -1;
		env.chrome = env.ua.indexOf('chrome') !== -1;
		env.gecko = env.ua.indexOf('gecko') !== -1 && !env.webkit && !window.opera && !env.ie;
		env.win = navigator.platform.indexOf('Win') === 0;
		env.mobile = typeof orientation !== 'undefined' || env.ua.indexOf('mobile') !== -1;
		env.msPointer = !window.PointerEvent && window.MSPointerEvent;
		env.pointer = window.PointerEvent || env.msPointer;
		env.ie3d = env.ie && ('transition' in env.doc.style);
		env.webkit3d = ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()) && !env.android23;
		env.gecko3d = 'MozPerspective' in env.doc.style;
		env.opera12 = 'OTransition' in env.doc.style;
		env.idxTransform = me.testProperty(['transform', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform']);
		return env;
	};
	me.setMark = function (x, y) {
		me.mark.setAttributeNS(null, "cx", x);
		me.mark.setAttributeNS(null, "cy", y);
	};
	me.setMark2 = function (x, y) {
		me.mark2.setAttributeNS(null, "cx", x);
		me.mark2.setAttributeNS(null, "cy", y);
	};
	me.rakeMouseWheel = function (e) {
		//console.log(e);//wheelEvent
		var e = window.event || e;
		var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
		var zoom = me.translateZ + delta * 0.001;
		//if (zoom > 0) {
			if (zoom > 0.001) {
				var xy = me.rake2content(e.layerX, e.layerY);
				me.setMark2(xy.x,xy.y);
				//var before=me.rake2content(e.layerX,e.layerY);
				//var bz=me.translateZ;
				var ratio = 1.0001;//zoom / me.translateZ;
				if(delta>0){
					ratio=2-ratio;
				}
				
				console.log(me.translateZ, '>', zoom, '=', ratio);
				console.log('x', me.translateX);
				me.translateX = me.translateX * ratio ;//- e.layerX * ratio + e.layerX;
				me.translateY = me.translateY * ratio ;//- e.layerY * ratio + e.layerY;
				me.translateZ = zoom;
				me.adjustCountentPosition();
				//var after=me.rake2content(e.layerX,e.layerY);
				//console.log(bz,before,me.translateZ,after);
				console.log('>', me.translateX);
			}
		//}
		e.preventDefault();
		return false;
	};
	me.svgns = "http://www.w3.org/2000/svg";
	me.info = me.checkEnvironment();
	me.contentDiv = document.getElementById(contentName);
	me.contentSVG = document.getElementById(svgName);
	me.rakeDiv = document.getElementById(rakeName);
	me.startMouseScreenX = 0.0;
	me.startMouseScreenY = 0.0;
	me.translateX = 0.0;
	me.translateY = 0.0;
	me.translateZ = 1.0;
	me.innerWidth = width;
	me.innerHeight = height;
	me.contentDiv.style.width = width;
	me.contentDiv.style.height = height;
	me.contentSVG.style.width = width;
	me.contentSVG.style.height = height;
	me.rakeDiv.addEventListener('mousedown', me.rakeMouseDown, false);
	me.rakeDiv.addEventListener("mousewheel", me.rakeMouseWheel, false);
	me.rakeDiv.addEventListener("DOMMouseScroll", me.rakeMouseWheel, false);
	me.adjustCountentPosition();
	return me;
}
function startInit() {
	console.log('start init');
	var sz = 50;
	var w = 2000;
	var h = 1300;
	var rv = new RakeView('rakeDiv', 'contentDiv', 'contentSVG', w, h);

	//var n=
	rv.addSVGCircle(sz, sz, sz);
	for (var i = 3; i < 120; i++) {
		rv.addSVGCircle(sz * i, sz * i, sz * i);
	}
	/*rv.addSVGCircle(sz * 2, sz * 2, sz * 2);
	rv.addSVGCircle(sz * 3, sz * 3, sz * 3);
	rv.addSVGCircle(sz * 4, sz * 4, sz * 4);
	rv.addSVGCircle(sz * 5, sz * 5, sz * 5);
	rv.addSVGCircle(sz * 5, sz * 5, sz * 5);
	rv.addSVGCircle(sz * 5, sz * 5, sz * 5);
	rv.addSVGCircle(sz * 5, sz * 5, sz * 5);
	rv.addSVGCircle(sz * 5, sz * 5, sz * 5);
	rv.addSVGCircle(sz * 5, sz * 5, sz * 5);*/
	//rv.setTransform(n,30,0,2);
	//console.log(n);
	rv.addSVGCircle(w - sz, sz, sz);
	rv.addSVGCircle(w - sz, h - sz, sz);
	rv.addSVGCircle(sz, h - sz, sz);
	rv.addSVGCircle(w / 2, h / 2, sz);
	rv.mark = rv.addSVGCircle(0, 0, 25);
	rv.mark2 = rv.addSVGCircle(0, 0, 15);
	//rv.addSvgPolyline(0,0,10000,10000);
	console.log('done init');
}
