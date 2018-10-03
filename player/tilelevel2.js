console.log('tilelevel.js v2.33');

function TileLevel(svg) {
	var me = this;
	me.svgns = "http://www.w3.org/2000/svg";
	me.svg = svg;
	me.viewWidth = me.svg.clientWidth;
	me.viewHeight = me.svg.clientHeight;
	me.innerWidth = me.viewWidth;
	me.innerHeight = me.viewHeight;
	me.pxCmRatio = 1;
	me.twoZoom = false;
	me.startMouseScreenX = 0;
	me.startMouseScreenY = 0;
	me.clickX = 0;
	me.clickY = 0;
	me.clicked = false;
	me.valid = false;
	me.translateX = 0;
	me.translateY = 0;
	me.translateZ = 1;
	me.twodistance = 0;
	me.startedTouch = false;
	me.mx = 100;
	me.layerNormal = 0;
	me.layerOverlay = 1;
	me.layerColumn = 2;
	me.layerRow = 3;
	var rect = document.createElementNS(this.svgns, 'rect');
	rect.setAttributeNS(null, 'height', '1cm');
	rect.setAttributeNS(null, 'width', '1cm');
	me.svg.appendChild(rect);
	var tbb = rect.getBBox();
	me.tapSize = tbb.width;
	me.clickLimit = me.tapSize / 8;
	me.svg.removeChild(rect);
	me.dragZoom = 1;
	me.startDragZoom = function() {
		me.dragZoom = 1.01;
		me.applyZoomPosition();
	};
	me.cancelDragZoom = function() {
		me.dragZoom = 1.0;
		me.applyZoomPosition();
	};
	me.applyZoomPosition = function() {
		/*
		var rx = -me.translateX;
		var ry = -me.translateY;
		var rw = me.viewWidth * me.translateZ;
		var rh = me.viewHeight * me.translateZ;
		*/
		var 	rx = -me.translateX - me.dragZoom * me.translateZ * (me.viewWidth - me.viewWidth / me.dragZoom) * (me.clickX / me.viewWidth);
		var 	ry = -me.translateY - me.dragZoom * me.translateZ * (me.viewHeight - me.viewHeight / me.dragZoom) * (me.clickY / me.viewHeight);
		var 	rw = me.viewWidth * me.translateZ * me.dragZoom;
		var 	rh = me.viewHeight * me.translateZ * me.dragZoom;
		//console.log(Math.round(rx) ,Math.round(ry),Math.round(rw),Math.round( rh));
		me.svg.setAttribute('viewBox', rx + ' ' + ry + ' ' + rw + ' ' + rh);
		if (me.model) {
			for (var k = 0; k < me.model.length; k++) {
				var layer = me.model[k];
				var tx = 0;
				var ty = 0;
				var tz = 1;
				var cX = 0;
				var cY = 0;
				var sX = 0;
				var sY = 0;
				if (me.viewWidth * me.translateZ > me.innerWidth) {
					cX = (me.viewWidth * me.translateZ - me.innerWidth) / 2;
				}
				if (me.viewHeight * me.translateZ > me.innerHeight) {
					cY = (me.viewHeight * me.translateZ - me.innerHeight) / 2;
				}
				if (layer.kind == me.layerOverlay) {
					tz = me.translateZ;
					tx = -me.translateX;
					ty = -me.translateY;
					cX = 0;
					cY = 0;
				} else {
					if (layer.kind == me.layerColumn) {
						tx = -me.translateX;
						cX = 0;
						if (layer.shiftX) {
							sX = layer.shiftX * me.tapSize * me.translateZ;
						}
					} else {
						if (layer.kind == me.layerRow) {
							ty = -me.translateY;
							cY = 0;
							if (layer.shiftY) {
								sY = layer.shiftY * me.tapSize * me.translateZ;
							}
						}
					}
				}
				layer.g.setAttribute('transform', 'translate(' + (tx + cX + sX) +
					',' + (ty + cY + sY) + ') scale(' + tz + ',' + tz + ')');
			}
		}
	};
	me.setModel = function(model) {
		me.model = model;

		me.resetModel();
	};
	me.resetModel = function() {
		me.clearAllDetails();
		me.applyZoomPosition();
		me.adjustContentPosition();
		me.slideToContentPosition();
		me.valid = false;
	};
	me.adjustContentPosition = function() {
		var a = me.adjusted();
		if (a.x != me.translateX || a.y != me.translateY || a.z != me.translateZ) {
			me.translateX = a.x;
			me.translateY = a.y;
			me.translateZ = a.z;
			me.applyZoomPosition();
		}
	};
	me.slideToContentPosition = function() {
		var a = me.adjusted();
		if (a.x != me.translateX || a.y != me.translateY || a.z != me.translateZ) {
			me.startSlideTo(a.x, a.y, a.z);
		}
	};
	me.adjusted = function() {
		var vX = me.translateX;
		var vY = me.translateY;
		var vZ = me.translateZ;
		if (me.translateX > 0) {
			vX = 0;
		} else {
			if (me.viewWidth - me.translateX / me.translateZ > me.innerWidth / me.translateZ) {
				if (me.viewWidth * me.translateZ - me.innerWidth <= 0) {
					vX = me.viewWidth * me.translateZ - me.innerWidth;
				} else {
					vX = 0;
				}
			}
		}
		if (me.translateY > 0) {
			vY = 0;
		} else {
			if (me.viewHeight - me.translateY / me.translateZ > me.innerHeight / me.translateZ) {
				if (me.viewHeight * me.translateZ - me.innerHeight <= 0) {
					vY = me.viewHeight * me.translateZ - me.innerHeight;
				} else {
					vY = 0;
				}
			}
		}
		if (me.translateZ < 1) {
			vZ = 1;
		} else {
			if (me.translateZ > me.mx) {
				vZ = me.mx;
			}
		}
		return {
			x: vX,
			y: vY,
			z: vZ
		};
	};
	me.queueTiles = function() {
		me.clearUselessDetails();
		me.tileFromModel();
	};
	me.maxZoom = function() {
		return me.mx;
	};
	me.rakeMouseDown = function(mouseEvent) {
		mouseEvent.preventDefault();
		me.svg.addEventListener('mousemove', me.rakeMouseMove, true);
		me.svg.addEventListener('mouseup', me.rakeMouseUp, false);
		me.startMouseScreenX = mouseEvent.offsetX;
		me.startMouseScreenY = mouseEvent.offsetY;
		me.clickX = me.startMouseScreenX;
		me.clickY = me.startMouseScreenY;
		me.clicked = false;
		me.startDragZoom();
	};
	me.rakeMouseMove = function(mouseEvent) {
		mouseEvent.preventDefault();
		var dX = mouseEvent.offsetX - me.startMouseScreenX;
		var dY = mouseEvent.offsetY - me.startMouseScreenY;
		me.translateX = me.translateX + dX * me.translateZ;
		me.translateY = me.translateY + dY * me.translateZ;
		me.startMouseScreenX = mouseEvent.offsetX;
		me.startMouseScreenY = mouseEvent.offsetY;
		me.applyZoomPosition();
	};
	me.rakeMouseUp = function(mouseEvent) {
		mouseEvent.preventDefault();
		
		me.svg.removeEventListener('mousemove', me.rakeMouseMove, true);
		if (Math.abs(me.clickX - mouseEvent.offsetX) <  me.clickLimit //
			&&
			Math.abs(me.clickY - mouseEvent.offsetY) < me.clickLimit) {
			//console.log(Math.abs(me.clickX - mouseEvent.offsetX)+'x'+Math.abs(me.clickY - mouseEvent.offsetY));
			//console.log(me.translateZ * me.clickLimit,me.translateZ , me.clickLimit);
			me.clicked = true;
		}
		me.cancelDragZoom();
		me.slideToContentPosition();
		me.valid = false;		
	};
	me.rakeMouseWheel = function(e) {
		e.preventDefault();
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
		me.translateX = me.translateX - (me.translateZ - zoom) * e.offsetX;
		me.translateY = me.translateY - (me.translateZ - zoom) * e.offsetY;
		me.translateZ = zoom;
		me.applyZoomPosition();
		me.adjustContentPosition();
		me.valid = false;
		return false;
	};
	me.vectorDistance = function(xy1, xy2) {
		var xy = me.vectorSubstract(xy1, xy2);
		var n = me.vectorNorm(xy);
		return n;
	};
	me.vectorSubstract = function(xy1, xy2) {
		return {
			x: xy1.x - xy2.x,
			y: xy1.y - xy2.y
		};
	};
	me.vectorNorm = function(xy) {
		return Math.sqrt(me.vectorNormSquared(xy));
	};
	me.vectorNormSquared = function(xy) {
		return xy.x * xy.x + xy.y * xy.y;
	};
	me.vectorFromTouch = function(touch) {
		return {
			x: touch.clientX,
			y: touch.clientY
		};
	};
	me.vectorFindCenter = function(xy1, xy2) {
		var xy = me.vectorAdd(xy1, xy2);
		return me.vectorScale(xy, 0.5);
	};
	me.vectorAdd = function(xy1, xy2) {
		return {
			x: xy1.x + xy2.x,
			y: xy1.y + xy2.y
		};
	};
	me.vectorScale = function(xy, coef) {
		return {
			x: xy.x * coef,
			y: xy.y * coef
		};
	};
	me.startTouchZoom = function(touchEvent) {
		me.twoZoom = true;
		var p1 = me.vectorFromTouch(touchEvent.touches[0]);
		var p2 = me.vectorFromTouch(touchEvent.touches[1]);
		me.twocenter = me.vectorFindCenter(p1, p2);
		console.log('start',me.twocenter);
		var d = me.vectorDistance(p1, p2);
		if (d <= 0) {
			d = 1;
		}
		me.twodistance = d;
	};
	me.rakeTouchStart = function(touchEvent) {
		touchEvent.preventDefault();
		me.startedTouch = true;
		if (touchEvent.touches.length < 2) {
			me.twoZoom = false;
			me.startMouseScreenX = touchEvent.touches[0].clientX;
			me.startMouseScreenY = touchEvent.touches[0].clientY;
			me.clickX = me.startMouseScreenX;
			me.clickY = me.startMouseScreenY;
			me.twodistance = 0;
			me.startDragZoom();
			return;
		} else {
			me.startTouchZoom(touchEvent);
		}
		me.clicked = false;
	};
	me.rakeTouchMove = function(touchEvent) {
		touchEvent.preventDefault();
		if (touchEvent.touches.length < 2) {
			if (me.twoZoom) {
				//
			} else {
				var dX = touchEvent.touches[0].clientX - me.startMouseScreenX;
				var dY = touchEvent.touches[0].clientY - me.startMouseScreenY;
				me.translateX = me.translateX + dX * me.translateZ;
				me.translateY = me.translateY + dY * me.translateZ;
				me.startMouseScreenX = touchEvent.touches[0].clientX;
				me.startMouseScreenY = touchEvent.touches[0].clientY;
				me.applyZoomPosition();
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
				me.translateX = me.translateX - (me.translateZ - zoom) * me.twocenter.x;
				me.translateY = me.translateY - (me.translateZ - zoom) * me.twocenter.y;
				me.translateZ = zoom;
				me.dragZoom = 1.0;
				me.applyZoomPosition();
				//me.adjustContentPosition();
				//me.valid = false;
			}
		}
	};
	me.rakeTouchEnd = function(touchEvent) {
		touchEvent.preventDefault();
		me.cancelDragZoom();
		me.valid = false;
		if (!me.twoZoom) {
			if (touchEvent.touches.length < 2) {
				if (me.startedTouch) {
					if (Math.abs(me.clickX - me.startMouseScreenX) < me.translateZ * me.clickLimit //
						&&
						Math.abs(me.clickY - me.startMouseScreenY) < me.translateZ * me.clickLimit) {
						me.clicked = true;
					}
				} else {
					//console.log('touch ended already');
				}
				me.slideToContentPosition();
				return;
			}
		}
		me.twoZoom = false;
		me.startedTouch = false;		
		me.slideToContentPosition();
	};
	me.msEdgeHook = function(g) {
		if (g.childNodes && (!(g.children))) {
			g.children = g.childNodes;
		}
	};
	me.tileGroup = function(g) {
		var gg = document.createElementNS(me.svgns, 'g');
		g.appendChild(gg);
		return gg;
	};
	me.clearUselessDetails = function() {
		/*var x = -me.translateX;
		var y = -me.translateY;
		var w = me.svg.clientWidth * me.translateZ;
		var h = me.svg.clientHeight * me.translateZ;
		var cX=0;
		var cY=0;
		if (me.viewWidth * me.translateZ > me.innerWidth) {
			cX = (me.viewWidth * me.translateZ - me.innerWidth) / 2;
			//x=x-cX;
		}
		if (me.viewHeight * me.translateZ > me.innerHeight) {
			cY = (me.viewHeight * me.translateZ - me.innerHeight) / 2;
			//y=y-cY;
		}
		console.log('clearUselessDetails',me.translateZ,':',x,'x',y,',',w,'/',h,'center',cX,'x',cY);*/
		if (me.model) {
			for (var k = 0; k < me.model.length; k++) {
				var group = me.model[k].g;
				me.clearUselessGroups(group, me.model[k].kind);
			}
		}
	};
	me.clearUselessGroups = function(group, kind) {
		var x = -me.translateX;
		var y = -me.translateY;
		var w = me.svg.clientWidth * me.translateZ;
		var h = me.svg.clientHeight * me.translateZ;
		if (me.viewWidth * me.translateZ > me.innerWidth) {
			cX = (me.viewWidth * me.translateZ - me.innerWidth) / 2;
			x=x-cX;
		}
		if (me.viewHeight * me.translateZ > me.innerHeight) {
			cY = (me.viewHeight * me.translateZ - me.innerHeight) / 2;
			y=y-cY;
		}
		if (kind == me.layerOverlay) {
			x = 0;
			y = 0;
		} else {
			if (kind == me.layerColumn) {
				x = 0;
			} else {
				if (kind == me.layerRow) {
					y = 0;
				}
			}
		}
		me.msEdgeHook(group);
		for (var i = 0; i < group.children.length; i++) {
			var child = group.children[i];
			if (me.outOfWatch(child, x, y, w, h) || child.minZoom > me.translateZ || child.maxZoom <= me.translateZ) {
				group.removeChild(child);
				i--;
			} else {
				if (child.localName == 'g') {
					me.clearUselessGroups(child, kind);
				}
			}
		}
	};
	me.tileFromModel = function() {
		if (me.model) {
			for (var k = 0; k < me.model.length; k++) {
				var group = me.model[k].g;
				var arr = me.model[k].m;
				for (var i = 0; i < arr.length; i++) {
					var a = arr[i];
					me.addGroupTile(group, a, me.model[k].kind);
				}
			}
		}
		me.valid = true;
	};
	me.addGroupTile = function(parentGroup, definitions, kind) {
		var x = -me.translateX;
		var y = -me.translateY;
		var w = me.svg.clientWidth * me.translateZ;
		var h = me.svg.clientHeight * me.translateZ;
		if (kind == me.layerOverlay) {
			x = 0;
			y = 0;
		} else {
			if (kind == me.layerColumn) {
				x = 0;
			} else {
				if (kind == me.layerRow) {
					y = 0;
				}
			}
		}
		if (definitions.z[0] <= me.translateZ && definitions.z[1] > me.translateZ) {
			if (me.collision(definitions.x * me.tapSize, definitions.y * me.tapSize, definitions.w * me.tapSize, definitions.h * me.tapSize //
					, x, y, w, h)) {
				var xg = me.childExists(parentGroup, definitions.id);
				if (xg) {
					for (var n = 0; n < definitions.l.length; n++) {
						var d = definitions.l[n];
						if (d.kind == 'g') {
							me.addElement(xg, d, kind);
						}
					}
				} else {
					var g = document.createElementNS(me.svgns, 'g');
					g.id = definitions.id;
					g.watchX = definitions.x * me.tapSize;
					g.watchY = definitions.y * me.tapSize;
					g.watchW = definitions.w * me.tapSize;
					g.watchH = definitions.h * me.tapSize;
					parentGroup.appendChild(g);
					g.minZoom = definitions.z[0];
					g.maxZoom = definitions.z[1];
					for (var n = 0; n < definitions.l.length; n++) {
						var d = definitions.l[n];
						me.addElement(g, d, kind);
					}
				}
			}
		}
	};
	me.addElement = function(g, d, kind) {
		var element = null;
		if (d.kind == 'r') {
			element = me.tileRectangle(g, d.x * me.tapSize, d.y * me.tapSize, d.w * me.tapSize, d.h * me.tapSize, d.rx * me.tapSize, d.ry * me.tapSize, d.css);
		}
		if (d.kind == 't') {
			element = me.tileText(g, d.x * me.tapSize, d.y * me.tapSize, d.t, d.css);
		}
		if (d.kind == 'p') {
			element = me.tilePath(g, d.x * me.tapSize, d.y * me.tapSize, d.z, d.l, d.css);
		}
		if (d.kind == 'l') {
			element = me.tileLine(g, d.x1 * me.tapSize, d.y1 * me.tapSize, d.x2 * me.tapSize, d.y2 * me.tapSize, d.css);
		}
		if (d.kind == 'g') {
			me.addGroupTile(g, d, kind);
		}
		if (element) {
			if (d.a) {
				element.onClickFunction = d.a;
				element.onclick = function() {
					if (me.clicked) {
						if (element) {
							if (element.onClickFunction) {
								var xx = element.getBoundingClientRect().x - me.svg.getBoundingClientRect().x;
								var yy = element.getBoundingClientRect().y - me.svg.getBoundingClientRect().y;
								element.onClickFunction(me.translateZ * (me.clickX - xx) / me.tapSize, me.translateZ * (me.clickY - yy) / me.tapSize);
							}
						}
					}
				}
				element.ontouchend = element.onclick
			}
		}
	};
	me.tilePath = function(g, x, y, z, data, cssClass) {
		var path = document.createElementNS(this.svgns, 'path');
		path.setAttributeNS(null, 'd', data);
		var t = "";
		if ((x) || (y)) {
			t = 'translate(' + x + ',' + y + ')';
		}
		if (z) {
			t = t + ' scale(' + z + ')';
		}
		if (t.length > 0) {
			path.setAttributeNS(null, 'transform', t);
		}
		if (cssClass) {
			path.classList.add(cssClass);
		}
		g.appendChild(path);
		return path;
	};
	me.tileRectangle = function(g, x, y, w, h, rx, ry, cssClass) {
		var rect = document.createElementNS(me.svgns, 'rect');
		rect.setAttributeNS(null, 'x', x);
		rect.setAttributeNS(null, 'y', y);
		rect.setAttributeNS(null, 'height', h);
		rect.setAttributeNS(null, 'width', w);
		if (rx) {
			rect.setAttributeNS(null, 'rx', rx);
		}
		if (ry) {
			rect.setAttributeNS(null, 'ry', ry);
		}
		if (cssClass) {
			rect.classList.add(cssClass);
		}
		g.appendChild(rect);
		return rect;
	};
	me.tileLine = function(g, x1, y1, x2, y2, cssClass) {
		var line = document.createElementNS(me.svgns, 'line');
		line.setAttributeNS(null, 'x1', x1);
		line.setAttributeNS(null, 'y1', y1);
		line.setAttributeNS(null, 'x2', x2);
		line.setAttributeNS(null, 'y2', y2);
		if (cssClass) {
			line.classList.add(cssClass);
		}
		g.appendChild(line);
		return line;
	};
	me.tileText = function(g, x, y, html, cssClass) {
		var txt = document.createElementNS(this.svgns, 'text');
		txt.setAttributeNS(null, 'x', x);
		txt.setAttributeNS(null, 'y', y);
		if (cssClass) {
			txt.setAttributeNS(null, 'class', cssClass);
		}
		txt.innerHTML = html;
		g.appendChild(txt);
		return txt;
	};
	me.childExists = function(group, id) {
		me.msEdgeHook(group);
		for (var i = 0; i < group.children.length; i++) {
			var child = group.children[i];
			if (child.id == id) {
				return child;
			}
		}
		return null;
	};
	me.clearAllDetails = function() {
		if (me.model) {
			for (var i = 0; i < me.model.length; i++) {
				me.clearGroupDetails(me.model[i].g);
			}
		}
	};
	me.clearGroupDetails = function(group) {
		me.msEdgeHook(group);
		while (group.children.length) {
			group.removeChild(group.children[0]);
		}
	};
	me.outOfView = function(child, x, y, w, h) {
		var tbb = child.getBBox();
		return !(me.collision(tbb.x, tbb.y, tbb.width, tbb.height, x, y, w, h));
	};
	me.outOfWatch = function(g, x, y, w, h) {
		return !(me.collision(g.watchX, g.watchY, g.watchW, g.watchH, x, y, w, h));
	};
	me.collision = function(x1, y1, w1, h1, x2, y2, w2, h2) {
		if (this.collision2(x1, w1, x2, w2) && this.collision2(y1, h1, y2, h2)) {
			return true;
		} else {
			return false;
		}
	};
	me.startSlideTo = function(x, y, z) {
		me.startStepSlideTo(30, x, y, z);
	}
	me.startStepSlideTo = function(s, x, y, z) {
		var stepCount = s;
		var dx = (x - me.translateX) / stepCount;
		var dy = (y - me.translateY) / stepCount;
		var dz = (z - me.translateZ) / stepCount;
		var xyz = [];
		for (var i = 0; i < stepCount; i++) {
			xyz.push({
				x: me.translateX + dx * i,
				y: me.translateY + dy * i,
				z: me.translateZ + dz * i
			});
		}
		xyz.push({
			x: x,
			y: y,
			z: z
		});
		/*for(var i=0;i<xyz.length;i++){
			console.log(xyz[i]);
		}*/
		me.stepSlideTo(xyz);
	};
	me.stepSlideTo = function(xyz) {
		var n = xyz.shift();
		if (n) {
			me.translateX = n.x;
			me.translateY = n.y;
			me.translateZ = n.z;
			me.applyZoomPosition();
			me.queueTiles();
			var main = me;
			setTimeout(function() {
				main.stepSlideTo(xyz);
			}, 10);
		} else {
			me.adjustContentPosition();
			me.valid = true;
			me.queueTiles();
		}
	};
	me.collision2 = function(x, w, left, width) {
		if (x + w <= left || x >= left + width) {
			return false;
		} else {
			return true;

		}
	};
	me.startLoop = function() {
		var last = new Date().getTime();
		var step = function(timestamp) {
			var now = new Date().getTime();
			if (last + 222 < now) {
				if (!(me.valid)) {
					me.queueTiles();
				}
				last = new Date().getTime();
			}
			window.requestAnimationFrame(step);
		};
		step();
	};
	me.svg.addEventListener('mousedown', me.rakeMouseDown, false);
	me.svg.addEventListener("mousewheel", me.rakeMouseWheel, false);
	me.svg.addEventListener("DOMMouseScroll", me.rakeMouseWheel, false);
	me.svg.addEventListener("touchstart", me.rakeTouchStart, false);
	me.svg.addEventListener("touchmove", me.rakeTouchMove, false);
	me.svg.addEventListener("touchend", me.rakeTouchEnd, false);
	me.startLoop();
	return me;
}
if (typeof module === 'object' && module.exports) {
	module.exports = TileLevel;
}
if (typeof window !== 'undefined') {
	window.TileLevel = TileLevel;
}