console.log('test 1');
function RakeView(rakeName, contentName, width, height) {
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
	me.rakeMouseDown = function (mouseEvent) {
		me.rakeDiv.addEventListener('mousemove', me.rakeMouseMove, true);
		window.addEventListener('mouseup', me.rakeMouseUp, false);
		me.startMouseScreenX = mouseEvent.screenX;
		me.startMouseScreenY = mouseEvent.screenY;
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
		var minX = 0;
		var minY = 0;
		var maxX = me.rakeDiv.clientWidth;
		var maxY = me.rakeDiv.clientHeight;
		if (maxX > me.innerWidth) {
			minX = (maxX - me.innerWidth) / 2;
			maxX = maxX - (maxX - me.innerWidth) / 2;
		}
		if (maxY > me.innerHeight) {
			minY = (maxY - me.innerHeight) / 2;
			maxY = maxY - (maxY - me.innerHeight) / 2;
		}
		if (me.translateX > minX) {
			me.translateX = minX;
		}
		if (me.translateY > minY) {
			me.translateY = minY;
		}
		if (me.translateX + me.innerWidth < maxX) {
			me.translateX = maxX - me.innerWidth;
		}
		if (me.translateY + me.innerHeight < maxY) {
			me.translateY = maxY - me.innerHeight;
		}
		me.setTransform(me.contentDiv, me.translateX, me.translateY, me.translateZ);
		//console.log(rakeDiv.clientHeight);
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
		var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute('style', 'border:1px solid #660000; transform:translate3d(' + x + 'px,' + y + 'px,0px); position:absolute');
		svg.setAttribute('width', '' + w);
		svg.setAttribute('height', '' + h);
		me.contentDiv.appendChild(svg);
		return svg;
	};
	me.addSvgPolyline = function (x, y, w, h) {
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
	};
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
	me.rakeMouseWheel = function (e) {
		//console.log(e);
		var e = window.event || e;
		var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
		var d = me.translateZ + delta * 0.1;
		if (d > 0) {
			me.translateZ = d;
			console.log(me.translateZ);
			me.setTransform(me.contentDiv, me.translateX, me.translateY, me.translateZ);
		}
		e.preventDefault();
		return false;
	};
	me.info = me.checkEnvironment();
	me.contentDiv = document.getElementById(contentName);
	me.rakeDiv = document.getElementById(rakeName);
	me.startMouseScreenX = 0;
	me.startMouseScreenY = 0;
	me.translateX = 0;
	me.translateY = 0;
	me.translateZ = 1;
	me.innerWidth = width;
	me.innerHeight = height;
	me.contentDiv.style.width = width;
	me.contentDiv.style.height = height;
	me.rakeDiv.addEventListener('mousedown', me.rakeMouseDown, false);
	me.rakeDiv.addEventListener("mousewheel", me.rakeMouseWheel, false);
	me.rakeDiv.addEventListener("DOMMouseScroll", me.rakeMouseWheel, false);
	me.adjustCountentPosition();
	return me;
}
function startInit() {
	console.log('start init');
	var sz = 50;
	var w = 900;
	var h = 800;
	var rv = new RakeView('rakeDiv', 'contentDiv', w, h);

	//var n=
	rv.addSVGRectangle(0, 0, sz, sz);
	rv.addSVGRectangle(10, 10, sz, sz);
	//rv.setTransform(n,30,0,2);
	//console.log(n);
	rv.addSVGRectangle(w - sz, 0, sz, sz, 0.5);

	rv.addSVGRectangle(w - sz, h - sz, sz, sz);
	rv.addSVGRectangle(0, h - sz, sz, sz);
	rv.addSVGRectangle(w / 2 - sz / 2, h / 2 - sz / 2, sz, sz);
	//rv.addSvgPolyline(0,0,10000,10000);
	console.log('done init');
}
