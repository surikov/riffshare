console.log('test 1');
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
	var timeOutID = 0;
	me.reDraw = function () {
		if (timeOutID > 0) {
			console.log('still wait redraw');
			return;
		}
		timeOutID = setTimeout(function () {
				timeOutID = 0;
				me.realDraw();
			}, 50);
	};
	me.realDraw = function () {
		var lt = me.rake2content(0, 0, me.translateZ);
		//console.log('left top',lt);
		var rightBottomX = me.rakeDiv.clientWidth;
		if (me.innerWidth * me.translateZ < me.rakeDiv.clientWidth) {
			var half = (me.rakeDiv.clientWidth - me.innerWidth * me.translateZ) / 2;
			rightBottomX = rightBottomX - half;
		}
		var rightBottomY = me.rakeDiv.clientHeight;
		if (me.innerHeight * me.translateZ < me.rakeDiv.clientHeight) {
			var half = (me.rakeDiv.clientHeight - me.innerHeight * me.translateZ) / 2;
			rightBottomY = rightBottomY - half;
		}
		var rb = me.rake2content(rightBottomX, rightBottomY, me.translateZ);
		//console.log('right bottom',rb);
		me.removeContent(lt.x, rb.x, lt.y, rb.y, me.translateZ);
		me.addContent(lt.x, lt.y, rb.x - lt.x, rb.y - lt.y, me.translateZ);
	};
	me.addContent = function (xx, yy, ww, hh, zz) {
		//console.log('-------------addContent from',xx,yy);
		/*console.log('size',ww,hh);
		console.log('translate',me.translateX,me.translateY,me.translateZ);*/
		me.addNumbers(xx, yy, ww, hh, zz, 56 * me.tapSize, 'a'); //base
		if (zz > 0.05) { //preview
			me.addNumbers(xx, yy, ww, hh, zz, 14 * me.tapSize, 'b');
		}
		if (zz > 0.1) { //measure
			me.addNumbers(xx, yy, ww, hh, zz, 7 * me.tapSize, 'c');
		}
		if (zz > 0.7) { //note
			me.addNumbers(xx, yy, ww, hh, zz, me.tapSize, 'd');
		}
		//addSVGFillCircle(me,xx,yy,1000);

		addSVGFillCircle(me, clickContentX, clickContentY, (me.tapSize / 2) / me.translateZ);
	};
	me.addNumbers = function (left, top, width, height, zoom, detailSize, key) {

		var w = me.innerWidth;
		var h = me.innerHeight;
		var cntr = 0;
		var stpx = 8 * detailSize;
		var stpy = 3 * detailSize;
		var sx = Math.floor(left / stpx) * stpx;
		var sy = Math.floor(top / stpy) * stpy;
		//console.log('addNumbers',left, top, width, height, zoom, detailSize, key,stpx,stpy);
		for (var x = sx; x < left + width; x = x + stpx) {
			for (var y = sy; y < top + height; y = y + stpy) {
				var nx = x / stpx;
				var ny = y / stpy;
				var msg = key + Math.round(nx) + 'x' + Math.round(ny) + ':' + Math.round(me.translateZ * 100);
				addSVGText(me, x, y, detailSize, msg);
				addSVGCircle(me, x, y, detailSize / 2);
				//console.log(x,y,msg);
				cntr++;
				if (cntr > 199)
					break;
			}
			if (cntr > 199)
				break;
		}
	};
	me.removeContent = function (x, y, w, h, z) {
		for (var i = 0; i < me.contentSVG.children.length; i++) {
			var t = me.contentSVG.children[i];
			if (me.contentSVG.children[i].noremove) {
				//console.log('skip',t);
			} else {
				me.contentSVG.removeChild(t);
				i--;
			}
		}
	};

	me.rake2content = function (rakeLeft, rakeTop, zoom) {
		if (me.innerWidth * zoom < me.rakeDiv.clientWidth) {
			var half = (me.rakeDiv.clientWidth - me.innerWidth * zoom) / 2;
			rakeLeft = rakeLeft + half;
		}
		if (me.innerHeight * zoom < me.rakeDiv.clientHeight) {
			var half = (me.rakeDiv.clientHeight - me.innerHeight * zoom) / 2;
			//console.log('margin',rakeTop,half);
			rakeTop = rakeTop + half;

		}
		var contentPoint = {};
		var maxX = me.innerWidth * (zoom - 1) / 2;
		contentPoint.x = Math.round((rakeLeft - me.translateX + maxX) / zoom);
		var maxY = me.innerHeight * (zoom - 1) / 2;
		contentPoint.y = Math.round((rakeTop - me.translateY + maxY) / zoom);
		/*if (me.innerWidth * me.translateZ < me.rakeDiv.clientWidth) {
		contentPoint.x=contentPoint.x+(me.rakeDiv.clientWidth*me.translateZ-me.innerWidth)/2;
		}
		if (me.innerHeight * me.translateZ < me.rakeDiv.clientHeight) {
		contentPoint.y=contentPoint.y+(me.rakeDiv.clientHeight*me.translateZ-me.innerHeight)/2;
		}*/

		return contentPoint;
	};
	me.content2rake = function (rakeLeft, rakeTop, contentLeft, contentTop, zoom) {
		var t = {};
		var maxX = me.innerWidth * (zoom - 1) / 2;
		t.x =  - (contentLeft * zoom - rakeLeft - maxX);
		var maxY = me.innerHeight * (zoom - 1) / 2;
		t.y =  - (contentTop * zoom - rakeTop - maxY);
		return t;
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
	/*me.setMark = function (x, y) {
	me.clickMark.setAttributeNS(null, "cx", x);
	me.clickMark.setAttributeNS(null, "cy", y);
	};*/
	/*me.rakeMouseWheel = function (e) {
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
	me.adjustCountentPosition();
	me.reDraw();
	e.preventDefault();
	return false;
	};*/
	me.tapSize = 32;
	try {
		var pixelRatio = window.devicePixelRatio;
		me.tapSize = 50 * pixelRatio;
		if (isNaN(me.tapSize)) {
			me.tapSize = 51;
		}

	} catch (ex) {
		console.log(ex);
	}
	console.log('tapSize',me.tapSize,window.devicePixelRatio);
	document.title='5:'+me.tapSize;

	me.svgns = "http://www.w3.org/2000/svg";
	me.info = me.checkEnvironment();
	me.contentDiv = document.getElementById(contentName);
	me.contentSVG = document.getElementById(svgName);
	me.rakeDiv = document.getElementById(rakeName);
	//me.startMouseScreenX = 0.0;
	//me.startMouseScreenY = 0.0;
	me.translateX = 0.0;
	me.translateY = 0.0;
	me.translateZ = 1.0;
	me.innerWidth = width;
	me.innerHeight = height;
	me.contentDiv.style.width = width;
	me.contentDiv.style.height = height;
	me.contentSVG.style.width = width;
	me.contentSVG.style.height = height;
	//me.rakeDiv.addEventListener('mousedown', me.rakeMouseDown, false);
	//me.rakeDiv.addEventListener("mousewheel", me.rakeMouseWheel, false);
	//me.rakeDiv.addEventListener("DOMMouseScroll", me.rakeMouseWheel, false);
	attachTapMouse(me);
	me.adjustCountentPosition();
	return me;
}
function startInit() {
	console.log('start init');
	var w = 32 * 32 * 500; //357000;
	var h = (32 * 128 + 32 * 50); //5000;
	var rv = new RakeView('rakeDiv', 'contentDiv', 'contentSVG', w, h);

	//rv.addSVGFillCircle(w / 2, h / 2, 10);
	//rv.clickMark = rv.addSVGCircle(400, 300, 16);
	//rv.clickMark.noremove=true;
	var z = 0.01;
	rv.translateZ = z;
	var t = rv.content2rake(rv.rakeDiv.clientWidth / 2, rv.rakeDiv.clientHeight / 2, w / 2, h / 2, z);
	//rv.translateX = t.x;
	//rv.translateY = t.y;
	//rv.translateZ = z;
	rv.adjustCountentPosition();
	rv.reDraw();
	console.log('done init');
}
