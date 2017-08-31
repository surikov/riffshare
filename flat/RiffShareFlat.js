console.log('riffshareflat v1.0.1');
function RiffShareFlat() {
	window.riffshareflat=this;
	return this;
}
RiffShareFlat.prototype.init = function () {
	this.tapSize = 32;
	try {
		console.log('window.devicePixelRatio', window.devicePixelRatio);
		var pixelRatio = window.devicePixelRatio;
		this.tapSize = 30 * pixelRatio;
		if (isNaN(this.tapSize)) {
			this.tapSize = 51;
		}

	} catch (ex) {
		console.log(ex);
	}
	console.log('tapSize', this.tapSize, 'devicePixelRatio', window.devicePixelRatio);
	this.svgns = "http://www.w3.org/2000/svg";
	this.contentDiv = document.getElementById('contentDiv');
	this.contentSVG = document.getElementById('contentSVG');
	this.rakeDiv = document.getElementById('rakeDiv');
	this.gridGroup = document.getElementById('grid');
	this.bgGroup = document.getElementById('bgGroup');
	this.bgImage = document.getElementById('bgImage');
	this.bgImageWidth = 1920;
	this.bgImageHeight = 1080;
	this.undoQueue = [];
	this.undoStep = 0;
	this.undoSize = 99;
	this.translateX = 0;
	this.translateY = 0;
	this.translateZ = 10;
	this.innerWidth = 3000;
	this.innerHeight = 2000;
	this.minZoom=0.25;
	this.maxZoom=200;
	this.spots = [];
	this.timeOutID = 0;
	this.marginLeft = 50;
	this.marginRight = 20;
	this.marginTop = 10;
	this.marginBottom = 20;
	this.setupInput();
	window.onresize = function () {
		riffshareflat.resetSize(); 
	};
	window.onunload = function () {
		//saveObject2localStorage('currentSong', riffshareflat.currentSong);
	};
	this.resetSize();
	console.log('done init');
};
RiffShareFlat.prototype.setupInput = function () {
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
	this.rakeDiv.addEventListener('mousedown', this.rakeMouseDown, false);
	this.rakeDiv.addEventListener("mousewheel", this.rakeMouseWheel, false);
	this.rakeDiv.addEventListener("DOMMouseScroll", this.rakeMouseWheel, false);
	this.rakeDiv.addEventListener("touchstart", this.rakeTouchStart, false);
	this.rakeDiv.addEventListener("touchmove", this.rakeTouchMove, false);
	this.rakeDiv.addEventListener("touchend", this.rakeTouchEnd, false);
	console.log('done setupInput');
};
RiffShareFlat.prototype.rakeMouseWheel = function (e) {
	e.preventDefault();
	var e = window.event || e;
	var wheelVal = e.wheelDelta || -e.detail;
	var min = Math.min(1, wheelVal);
	var delta = Math.max(-1, min);
	var zoom = riffshareflat.translateZ + delta * (riffshareflat.translateZ) * 0.077;
	if (zoom < riffshareflat.minZoom) {
		zoom = riffshareflat.minZoom;
	}
	if (zoom > riffshareflat.maxZoom) {
		zoom = riffshareflat.maxZoom;
	}
	//if(riffshareflat.canZoomTo(zoom)){
	//zoom = riffshareflat.safeZoom(zoom);
	riffshareflat.translateX = riffshareflat.translateX - (riffshareflat.translateZ - zoom) * e.layerX;
	riffshareflat.translateY = riffshareflat.translateY - (riffshareflat.translateZ - zoom) * e.layerY;
	riffshareflat.translateZ = zoom;
	riffshareflat.adjustContentPosition();
	riffshareflat.queueTiles();
	//}
	return false;
};
RiffShareFlat.prototype.rakeMouseDown = function (mouseEvent) {
	mouseEvent.preventDefault();
	//console.log('::',riffshareflat.rakeDiv,this);
	riffshareflat.rakeDiv.addEventListener('mousemove', riffshareflat.rakeMouseMove, true);
	window.addEventListener('mouseup', riffshareflat.rakeMouseUp, false);
	riffshareflat.startMouseScreenX = mouseEvent.clientX;
	riffshareflat.startMouseScreenY = mouseEvent.clientY;
	riffshareflat.clickX = riffshareflat.startMouseScreenX;
	riffshareflat.clickY = riffshareflat.startMouseScreenY;
};
RiffShareFlat.prototype.rakeMouseMove = function (mouseEvent) {
	mouseEvent.preventDefault();
	var dX = mouseEvent.clientX - riffshareflat.startMouseScreenX;
	var dY = mouseEvent.clientY - riffshareflat.startMouseScreenY;
	riffshareflat.translateX = riffshareflat.translateX + dX * riffshareflat.translateZ;
	riffshareflat.translateY = riffshareflat.translateY + dY * riffshareflat.translateZ;
	riffshareflat.startMouseScreenX = mouseEvent.clientX;
	riffshareflat.startMouseScreenY = mouseEvent.clientY;
	riffshareflat.moveZoom();
};
RiffShareFlat.prototype.rakeMouseUp = function (mouseEvent) {
	mouseEvent.preventDefault();
	riffshareflat.rakeDiv.removeEventListener('mousemove', riffshareflat.rakeMouseMove, true);
	if (Math.abs(riffshareflat.clickX - mouseEvent.clientX) < riffshareflat.translateZ * riffshareflat.tapSize / 8 //
		 && Math.abs(riffshareflat.clickY - mouseEvent.clientY) < riffshareflat.translateZ * riffshareflat.tapSize / 8) {
		riffshareflat.click();
	}
	riffshareflat.adjustContentPosition();
	riffshareflat.queueTiles();
};
RiffShareFlat.prototype.startTouchZoom = function (touchEvent) {
	riffshareflat.twoZoom = true;
	var p1 = riffshareflat.vectorFromTouch(touchEvent.touches[0]);
	var p2 = riffshareflat.vectorFromTouch(touchEvent.touches[1]);
	riffshareflat.twocenter = riffshareflat.vectorFindCenter(p1, p2);
	//direction = p1.subtract(p2);
	var d = riffshareflat.vectorDistance(p1, p2);
	if (d <= 0) {
		d = 1;
	}
	riffshareflat.twodistance = d;
};
RiffShareFlat.prototype.rakeTouchStart = function (touchEvent) {
	//console.log('rakeTouchStart', touchEvent.touches.length);
	touchEvent.preventDefault();
	riffshareflat.startedTouch = true;
	if (touchEvent.touches.length < 2) {
		riffshareflat.twoZoom = false;
		riffshareflat.startMouseScreenX = touchEvent.touches[0].clientX;
		riffshareflat.startMouseScreenY = touchEvent.touches[0].clientY;
		riffshareflat.clickX = riffshareflat.startMouseScreenX;
		riffshareflat.clickY = riffshareflat.startMouseScreenY;
		riffshareflat.twodistance = 0;
		return;
	} else {
		riffshareflat.startTouchZoom(touchEvent);
	}
};
RiffShareFlat.prototype.rakeTouchMove = function (touchEvent) {
	//console.log('rakeTouchMove', touchEvent.touches.length);
	touchEvent.preventDefault();
	if (touchEvent.touches.length < 2) {
		if (riffshareflat.twoZoom) {
			//
		} else {
			var dX = touchEvent.touches[0].clientX - riffshareflat.startMouseScreenX;
			var dY = touchEvent.touches[0].clientY - riffshareflat.startMouseScreenY;
			riffshareflat.translateX = riffshareflat.translateX + dX * riffshareflat.translateZ;
			riffshareflat.translateY = riffshareflat.translateY + dY * riffshareflat.translateZ;
			riffshareflat.startMouseScreenX = touchEvent.touches[0].clientX;
			riffshareflat.startMouseScreenY = touchEvent.touches[0].clientY;
			riffshareflat.moveZoom();
			return;
		}
	} else {
		if (!riffshareflat.twoZoom) {
			riffshareflat.startTouchZoom(touchEvent);
		} else {
			var p1 = riffshareflat.vectorFromTouch(touchEvent.touches[0]);
			var p2 = riffshareflat.vectorFromTouch(touchEvent.touches[1]);
			var d = riffshareflat.vectorDistance(p1, p2);
			if (d <= 0) {
				d = 1;
			}
			var ratio = d / riffshareflat.twodistance;
			riffshareflat.twodistance = d;
			var zoom = riffshareflat.translateZ / ratio;
			/*if (zoom < 0.5) {
			zoom = 0.5;
			}
			if (zoom > 100) {
			zoom = 100;
			}*/
			if (zoom < riffshareflat.minZoom) {
				zoom = riffshareflat.minZoom;
			}
			if (zoom > riffshareflat.maxZoom) {
				zoom = riffshareflat.maxZoom;
			}
			zoom = riffshareflat.safeZoom(zoom);
			//if(riffshareflat.canZoomTo(zoom)){
			riffshareflat.translateX = riffshareflat.translateX - (riffshareflat.translateZ - zoom) * riffshareflat.twocenter.x;
			riffshareflat.translateY = riffshareflat.translateY - (riffshareflat.translateZ - zoom) * riffshareflat.twocenter.y;
			riffshareflat.translateZ = zoom;
			riffshareflat.adjustContentPosition();
			//}
		}
	}
};

RiffShareFlat.prototype.rakeTouchEnd = function (touchEvent) {
	//console.log('rakeTouchEnd', touchEvent.touches.length);
	touchEvent.preventDefault();
	riffshareflat.queueTiles();
	if (!riffshareflat.twoZoom) {
		if (touchEvent.touches.length < 2) {
			if (riffshareflat.startedTouch) {
				if (Math.abs(riffshareflat.clickX - riffshareflat.startMouseScreenX) < riffshareflat.translateZ * riffshareflat.tapSize / 8 //
					 && Math.abs(riffshareflat.clickY - riffshareflat.startMouseScreenY) < riffshareflat.translateZ * riffshareflat.tapSize / 8) {
					riffshareflat.click();
				}
			} else {
				//console.log('touch ended already');
			}
			riffshareflat.adjustContentPosition();
			return;
		}
	}
	riffshareflat.twoZoom = false;
	riffshareflat.startedTouch = false;
	riffshareflat.adjustContentPosition();
};
RiffShareFlat.prototype.click = function () {
	var xy = this.unzoom(this.clickX, this.clickY, this.translateZ);
	this.clickContentX = xy.x;
	this.clickContentY = xy.y;
	//console.log('click', this.clickX, this.clickY, 'content', this.clickContentX, this.clickContentY, 'zoom', this.translateZ);
	this.runSpots(this.clickContentX, this.clickContentY);
};
RiffShareFlat.prototype.vectorDistance = function (xy1, xy2) {
	var xy = this.vectorSubstract(xy1, xy2);
	var n = this.vectorNorm(xy);
	return n;
};
RiffShareFlat.prototype.vectorSubstract = function (xy1, xy2) {
	return {
		x: xy1.x - xy2.x,
		y: xy1.y - xy2.y
	};
};
RiffShareFlat.prototype.vectorNorm = function (xy) {
	return Math.sqrt(this.vectorNormSquared(xy));
};
RiffShareFlat.prototype.vectorNormSquared = function (xy) {
	return xy.x * xy.x + xy.y * xy.y;
};
RiffShareFlat.prototype.vectorFromTouch = function (touch) {
	return {
		x: touch.clientX,
		y: touch.clientY
	};
};
RiffShareFlat.prototype.vectorFindCenter = function (xy1, xy2) {
	var xy = this.vectorAdd(xy1, xy2);
	return this.vectorScale(xy, 0.5);
};
RiffShareFlat.prototype.vectorAdd = function (xy1, xy2) {
	return {
		x: xy1.x + xy2.x,
		y: xy1.y + xy2.y
	};
};
RiffShareFlat.prototype.vectorScale = function (xy, coef) {
	return {
		x: xy.x * coef,
		y: xy.y * coef
	};
};
RiffShareFlat.prototype.unzoom = function (x, y, z) {
	var xy = {
		x: x * z - this.translateX,
		y: y * z - this.translateY
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
RiffShareFlat.prototype.runSpots = function (x, y) {
	//console.log('runSpots', this.spots);
	var needRedraw = false;
	for (var i = this.spots.length - 1; i >= 0; i--) {
		var spot = this.spots[i];
		var checkX = spot.x;
		var checkY = spot.y;
		if (spot.sx) {
			checkX = spot.x + this.stickedX;
		}
		//console.log(x, y, 1, 1, checkX, checkY, spot.w, spot.h);
		if (this.collision(x, y, 1, 1, checkX, checkY, spot.w, spot.h)) {
			//console.log('spot', spot);
			if (spot.a) {
				spot.a();
			}
			if (spot.tz < this.translateZ && spot.tz > 0) {
				//console.log('slide spot', spot);

				var tox = -checkX;
				if (spot.sx) {
					//console.log(tox, spot.x);
					if (-tox > spot.x) {

						tox = this.translateX; //-spot.x;//
						//console.log('rest');
					} else {
						tox = -spot.x;
						//console.log('left');
					}
				}
				this.startSlideTo(tox, -checkY, spot.tz);
			} else {
				//this.startSlideTo(0,0,5);
				needRedraw = true;
			}
			break;
		}
	}
	/*if (this.menuFog) {
	this.hideMenu();
	} else {
	this.showMenu();
	}*/
	if (needRedraw) {
		this.resetAllLayersNow();
	}
};
RiffShareFlat.prototype.adjustContentPosition = function () {
	if (this.contentDiv.clientWidth * this.translateZ < this.innerWidth) {
		if (this.translateX < this.contentDiv.clientWidth * this.translateZ - this.innerWidth) {
			this.translateX = this.contentDiv.clientWidth * this.translateZ - this.innerWidth;
		}
		if (this.translateX > 0) {
			this.translateX = 0;
		}
	} else {
		this.translateX = (this.contentDiv.clientWidth * this.translateZ - this.innerWidth) / 2;
	}
	if (this.contentDiv.clientHeight * this.translateZ < this.innerHeight) {
		if (this.translateY < this.contentDiv.clientHeight * this.translateZ - this.innerHeight) {
			this.translateY = this.contentDiv.clientHeight * this.translateZ - this.innerHeight;
		}
		if (this.translateY > 0) {
			this.translateY = 0;
		}
	} else {
		this.translateY = (this.contentDiv.clientHeight * this.translateZ - this.innerHeight) / 2;
	}
	//console.log(this.translateX,this.translateY,this.translateZ);
	this.moveZoom();
};
RiffShareFlat.prototype.moveZoom = function () {
	var x = -this.translateX;
	var y = -this.translateY;
	var w = this.contentDiv.clientWidth * this.translateZ;
	var h = this.contentDiv.clientHeight * this.translateZ;
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
	//console.log(x,y,w,h);
	this.contentSVG.setAttribute("viewBox", "" + x + " " + y + " " + w + " " + h + "");
	this.reLayoutVertical();
	this.reLayoutBackGroundImge();
};
RiffShareFlat.prototype.reLayoutVertical = function () {

	var leftTopX = 0;
	var leftTopY = 0;
	var rightBottomX = this.contentDiv.clientWidth;
	var rightBottomY = this.contentDiv.clientHeight;
	if (this.contentDiv.clientWidth * this.translateZ > this.innerWidth) {
		leftTopX = (this.contentDiv.clientWidth - this.innerWidth / this.translateZ) / 2;
		rightBottomX = this.contentDiv.clientWidth - leftTopX;
	}
	if (this.contentDiv.clientHeight * this.translateZ > this.innerHeight) {
		leftTopY = (this.contentDiv.clientHeight - this.innerHeight / this.translateZ) / 2;
		rightBottomY = this.contentDiv.clientHeight - leftTopY;
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
	//console.log(this.stickedX);
	/*
	this.hugetracknames.setAttribute('transform', 'translate(' + this.stickedX + ',0)');
	this.largetracknames.setAttribute('transform', 'translate(' + this.stickedX + ',0)');
	this.mediumtracknames.setAttribute('transform', 'translate(' + this.stickedX + ',0)');
	this.smalltracknames.setAttribute('transform', 'translate(' + this.stickedX + ',0)');
	*/
};
RiffShareFlat.prototype.reLayoutBackGroundImge = function () {
	var rz = 1.0;
	var w = this.innerWidth; //this.marginLeft * this.tapSize + this.songWidth32th() + this.marginRight * this.tapSize;
	var h = this.innerHeight; //this.workHeight();
	var maxTranslX = w - this.contentDiv.clientWidth * this.translateZ;
	var maxTranslY = h - this.contentDiv.clientHeight * this.translateZ;
	var maxImgX = w - this.bgImageWidth * rz * this.translateZ;
	var maxImgY = h - this.bgImageHeight * rz * this.translateZ;
	var x = x = -maxImgX * this.translateX / maxTranslX;
	var y = y = -maxImgY * this.translateY / maxTranslY;
	if (maxTranslX == 0) {
		x = 0;
	}
	if (maxTranslY == 0) {
		y = 0;
	}
	if (w < this.contentDiv.clientWidth * this.translateZ) {
		x = -this.translateX;
	} else {
	if (this.translateX > 0) {
		x = -this.translateX;
	} else {
		if (-this.translateX > maxTranslX) {
			x = maxImgX - maxTranslX - this.translateX;
		}
	}}
	if (h < this.contentDiv.clientHeight * this.translateZ) {
		y = -this.translateY;
	} else {
		if (this.translateY > 0) {
			y = -this.translateY;
		} else {
			if (-this.translateY > maxTranslY) {
				y = maxImgY - maxTranslY - this.translateY;
			}
		}
	}
	var z = rz * this.translateZ;
	//console.log(y, this.translateY, h, this.contentDiv.clientHeight * this.translateZ);
	var transformAttr = ' translate(' + x + ',' + y + ') scale(' + z * rz + ')';
	this.bgImage.setAttribute('transform', transformAttr);
	//console.log(h, this.contentDiv.clientHeight * this.translateZ);
};
RiffShareFlat.prototype.queueTiles = function () {
	if (this.timeOutID > 0) {
		//console.log('still wait redraw');
		return;
	}
	this.timeOutID = setTimeout(function () {
			//console.log(this);
			riffshareflat.timeOutID = 0;
			riffshareflat.resetTiles();
		}, 100);
};
RiffShareFlat.prototype.resetTiles = function () {
	var leftTopX = 0;
	var leftTopY = 0;
	var rightBottomX = this.contentDiv.clientWidth;
	var rightBottomY = this.contentDiv.clientHeight;
	if (this.contentDiv.clientWidth * this.translateZ > this.innerWidth) {
		leftTopX = (this.contentDiv.clientWidth - this.innerWidth / this.translateZ) / 2;
		rightBottomX = this.contentDiv.clientWidth - leftTopX;
	}
	if (this.contentDiv.clientHeight * this.translateZ > this.innerHeight) {
		leftTopY = (this.contentDiv.clientHeight - this.innerHeight / this.translateZ) / 2;
		rightBottomY = this.contentDiv.clientHeight - leftTopY;
	}
	var lt = this.unzoom(leftTopX, leftTopY, this.translateZ);
	var rb = this.unzoom(rightBottomX, rightBottomY, this.translateZ);
	var xx = lt.x;
	var yy = lt.y;
	var ww = rb.x - lt.x;
	var hh = rb.y - lt.y;
	this.addContent(xx, yy, ww, hh, this.translateZ);
	this.reLayoutVertical();

};
RiffShareFlat.prototype.addContent = function (xx, yy, ww, hh, zz) {
	//this.clearLayers([this.hugeGroup, this.largeGroup, this.mediumGroup]);
	//this.clearSpots();
	//this.clearUselessDetails(xx, yy, ww, hh, this.smallGroup);
	//this.addSmallTiles(xx, yy, ww, hh, 0.5);
};
RiffShareFlat.prototype.resetSize = function () {
	console.log('set size', document.getElementById('undobutton').style.width);
	console.log('style', document.getElementById('undobutton').style);
	console.log('obj', document.getElementById('undobutton'));
	//var ml = this.songWidth32th();
	/*var tc = 1;
	if (this.currentSong) {
	tc = this.currentSong.channels.length
	}*/
	this.innerWidth = (this.marginLeft + this.marginRight +16*16) * this.tapSize ;
	this.innerHeight = (this.marginTop +  this.marginBottom +8+5*12	) * this.tapSize;
	this.contentSVG.style.width = this.contentDiv.clientWidth;
	this.contentSVG.style.height = this.contentDiv.clientHeight;
	
	document.getElementById('undobutton').style.width = this.tapSize;
	document.getElementById('undobutton').style.height = this.tapSize;
	
	console.log('get size', document.getElementById('undobutton').style.width);
	
	document.getElementById('redobutton').style.width = this.tapSize;
	document.getElementById('redobutton').style.height = this.tapSize;
	document.getElementById('redobutton').style.top = this.tapSize;
	
	
	
	this.adjustContentPosition();
	this.queueTiles();
};
RiffShareFlat.prototype.undoLast = function () {
	//
};
RiffShareFlat.prototype.redoNext = function () {
	//
};
window.onload = function () {
	console.log('create riffshareflat');
	new RiffShareFlat();
	riffshareflat.init();
};

