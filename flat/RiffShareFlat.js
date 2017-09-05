console.log('riffshareflat v1.0.1');
function RiffShareFlat() {
	window.riffshareflat = this;
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
	this.contentGroup = document.getElementById('contentGroup');
	this.paneGroup = document.getElementById('paneGroup');
	this.linesGroup = document.getElementById('linesGroup');
	this.textGroup = document.getElementById('textGroup');
	this.drumGroup = document.getElementById('drumGroup');
	this.trackGroups = [];
	this.trackGroups[7] = document.getElementById('track1Group');
	this.trackGroups[6] = document.getElementById('track2Group');
	this.trackGroups[5] = document.getElementById('track3Group');
	this.trackGroups[4] = document.getElementById('track4Group');
	this.trackGroups[3] = document.getElementById('track5Group');
	this.trackGroups[2] = document.getElementById('track6Group');
	this.trackGroups[1] = document.getElementById('track7Group');
	this.trackGroups[0] = document.getElementById('track8Group');
	this.bgGroup = document.getElementById('bgGroup');
	this.bgImage = document.getElementById('bgImage');
	//console.log('bgImage',this.bgImage.width,'x',this.bgImage.height);
	this.bgImageWidth = 1920;
	this.bgImageHeight = 1080;
	//this.bgImageWidth = 1600;
	//this.bgImageHeight = 816;
	this.undoQueue = [];
	this.undoStep = 0;
	this.undoSize = 99;
	this.translateX = 0;
	this.translateY = 0;
	this.translateZ = 1;
	this.innerWidth = 3000;
	this.innerHeight = 2000;
	this.minZoom = 1;
	this.maxZoom = 20;
	this.spots = [];
	this.timeOutID = 0;
	this.marginLeft = 18;
	this.marginRight = 17;
	this.marginTop = 1;
	this.marginBottom = 1;
	//this.storeDrums = readObjectFromlocalStorage('storeDrums');
	this.tempo = sureInList(readTextFromlocalStorage('tempo'), 120, [80, 100, 120, 140, 160, 180, 200, 220]);
	this.drumVolumes = [];
	for (var i = 0; i < 8; i++) {
		this.drumVolumes.push(sureNumeric(readObjectFromlocalStorage('drum' + i), 0, 70, 100));
	}
	this.trackInfo = [{
			//color: '#eeccbb',
			color: 'rgba(238,204,187,1)',
			shadow: 'rgba(238,204,187,0.4)',
			title: 'Synth Bass',
			order: 2,
			volume: sureNumeric(readObjectFromlocalStorage('track7'), 0, 70, 100),
			nn: 7
		}, {
			//color: '#cc9900',
			color: 'rgba(204,153,0,1)',
			shadow: 'rgba(204,153,0,0.4)',
			title: 'String Ensemble',
			order: 1,
			volume: sureNumeric(readObjectFromlocalStorage('track6'), 0, 70, 100),
			nn: 6
		}, {
			//color: '#CC00CC',
			//color: 'rgba(0xCC,0x00,0xCC,0.5)'+0xff,
			color: 'rgba(204,0,204,1)',
			shadow: 'rgba(204,0,204,0.4)',
			title: 'Bass guitar',
			order: 5,
			volume: sureNumeric(readObjectFromlocalStorage('track5'), 0, 70, 100),
			nn: 5
		}, {
			//color: '#0099FF',
			color: 'rgba(00,153,255,1)',
			shadow: 'rgba(00,153,255,0.4)',
			title: 'Acoustic Piano',
			order: 3,
			volume: sureNumeric(readObjectFromlocalStorage('track4'), 0, 70, 100),
			nn: 4
		}, {
			//color: '#996633',
			color: 'rgba(153,102,51,1)',
			shadow: 'rgba(153,102,51,0.4)',
			title: 'Palm mute guitar',
			order: 4,
			volume: sureNumeric(readObjectFromlocalStorage('track3'), 0, 70, 100),
			nn: 3
		}, {
			//color: '#3333ff',
			color: 'rgba(102,51,255,1)',
			shadow: 'rgba(102,51,255,0.4)',
			title: 'Percussive Organ',
			order: 0,
			volume: sureNumeric(readObjectFromlocalStorage('track2'), 0, 70, 100),
			nn: 2
		}, {
			//color: '#009900',
			color: 'rgba(0,153,0,1)',
			shadow: 'rgba(0,153,0,0.4)',
			title: 'Acoustic guitar',
			order: 6,
			volume: sureNumeric(readObjectFromlocalStorage('track1'), 0, 70, 100),
			nn: 1
		}, {
			//color: '#FF3300',
			color: 'rgba(255,51,0,1)',
			shadow: 'rgba(255,51,0,0.4)',
			title: 'Distortion guitar',
			order: 7,
			volume: sureNumeric(readObjectFromlocalStorage('track0'), 0, 70, 100),
			nn: 0
		}

	];
	//console.log(this.trackInfo);
	this.setupInput();
	window.onresize = function () {
		riffshareflat.resetSize();
	};
	window.onunload = function () {
		var flatstate = {
			tx: riffshareflat.translateX,
			ty: riffshareflat.translateY,
			tz: riffshareflat.translateZ,
			orders: []
		};
		for (var i = 0; i < 8; i++) {
			flatstate.orders.push(riffshareflat.trackInfo[i].order);
		}
		saveObject2localStorage('flatstate', flatstate);
	};
	var flatstate = readObjectFromlocalStorage('flatstate');
	console.log(flatstate);
	if (flatstate) {
		try {
			if (flatstate.tx) {
				this.translateX = flatstate.tx;
			}
			if (flatstate.ty) {
				this.translateY = flatstate.ty;
			}
			if (flatstate.tz) {
				this.translateZ = flatstate.tz;
			}
			if (flatstate.orders) {
				for (var i = 0; i < 8; i++) {
					riffshareflat.trackInfo[i].order = flatstate.orders[i];
				}
			}
		} catch (ex) {
			console.log(ex);
		}
	}
	this.storeDrums = readObjectFromlocalStorage('storeDrums');
	//console.log(storeDrums);
	this.storeTracks = readObjectFromlocalStorage('storeTracks');
	//console.log(storeTracks);
	//console.log(readObjectFromlocalStorage('drum0'));
	//console.log(readObjectFromlocalStorage('track0'));
	//console.log(readObjectFromlocalStorage('equalizer0'));
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
			//zoom = riffshareflat.safeZoom(zoom);
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
RiffShareFlat.prototype.addSpot = function (id, x, y, w, h, a, stickX, toZoom) {
	this.dropSpot(id);
	var spot = {
		id: id,
		x: x,
		y: y,
		w: w,
		h: h,
		a: a,
		sx: stickX,
		tz: toZoom
	};
	//if (stickX) {}
	this.spots.push(spot);
	return spot;
};
RiffShareFlat.prototype.runSpots = function (x, y) {
	//console.log('runSpots', x, y,this.spots);
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
RiffShareFlat.prototype.startSlideTo = function (x, y, z) {
	//console.log('startSlideTo', x, y, z, 'from', this.translateX, this.translateY, this.translateZ);

	var stepCount = 20;

	var dx = (x - this.translateX) / stepCount;
	var dy = (y - this.translateY) / stepCount;
	var dz = (z - this.translateZ) / stepCount;
	var xyz = [];
	for (var i = 0; i < stepCount; i++) {
		xyz.push({
			x: this.translateX + dx * i,
			y: this.translateY + dy * i,
			z: this.translateZ + dz * i
		});
	}
	xyz.push({
		x: x,
		y: y,
		z: z
	});
	this.stepSlideTo(xyz); //stepCount, dx, dy, dz);
};
RiffShareFlat.prototype.stepSlideTo = function (xyz) {
	var n = xyz.shift();
	if (n) {
		this.translateX = n.x;
		this.translateY = n.y;
		this.translateZ = n.z;
		this.adjustContentPosition();
		setTimeout(function () {
			riffshareflat.stepSlideTo(xyz);
		}, 20);
	} else {
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
		}
	}
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
RiffShareFlat.prototype.resetAllLayersNow = function () {
	//console.log('resetAllLayersNow');
	this.clearLayerChildrent([this.contentGroup]);
	/*this.clearLayers([this.paneGroup, this.linesGroup, this.textGroup, this.drumGroup]);
	for (var i = 0; i < this.trackGroups.length; i++) {
	this.clearLayers([this.trackGroups[i]]);
	}*/
	this.clearSpots();
	this.resetSize();
	this.resetTiles();
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
	this.addContent(xx, yy, ww, hh);
	this.reLayoutVertical();

};
RiffShareFlat.prototype.addContent = function (x, y, w, h) {
	//this.clearLayers([this.gridLayer]);
	//this.clearSpots();
	/*this.clearUselessDetails(x, y, w, h, this.paneGroup);
	this.clearUselessDetails(x, y, w, h, this.linesGroup);
	this.clearUselessDetails(x, y, w, h, this.textGroup);
	this.clearUselessDetails(x, y, w, h, this.drumGroup);
	for (var i = 0; i < this.trackGroups.length; i++) {
	this.clearUselessDetails(x, y, w, h, this.trackGroups[i]);
	}*/
	/*
	this.clearUselessDetails(x, y, w, h, this.track1Group);
	this.clearUselessDetails(x, y, w, h, this.track2Group);
	this.clearUselessDetails(x, y, w, h, this.track3Group);
	this.clearUselessDetails(x, y, w, h, this.track4Group);
	this.clearUselessDetails(x, y, w, h, this.track5Group);
	this.clearUselessDetails(x, y, w, h, this.track6Group);
	this.clearUselessDetails(x, y, w, h, this.track7Group);
	this.clearUselessDetails(x, y, w, h, this.track8Group);
	 */
	this.clearUselessDetails(x, y, w, h, this.contentGroup);
	this.addSmallTiles(x, y, w, h);
	//console.log('addContent');
};

RiffShareFlat.prototype.addSmallTiles = function (left, top, width, height) {
	var x = 0;
	var y = 0;
	var w = this.innerWidth;
	var h = this.innerHeight;
	var g = this.rakeGroup(x, y, w, h, 'grdlin', this.paneGroup, left, top, width, height);
	if (g) {
		this.tileRectangle(g, 0, 0, this.innerWidth, this.innerHeight, 'rgba(0,0,0,0.8)');
		this.tileText(g, x + this.tapSize * 0.5, y + this.tapSize * 4, this.tapSize * 5, 'RiffShare', '#fff');
	}
	this.tileEqualizer(left, top, width, height);
	this.tileDrumVolumes(left, top, width, height);
	this.tileToneVolumes(left, top, width, height);
	this.tileTempo(left, top, width, height);
	this.tilePianoLines(left, top, width, height);
	try {
		this.tileDrums(left, top, width, height);
	} catch (e) {
		console.log(e);
	}
	try {
		this.tileTones(left, top, width, height);
	} catch (e) {
		console.log(e);
	}
};
RiffShareFlat.prototype.tileDrumMeasure = function (n, left, top, width, height) {
	//console.log('tileDrumMeasure',n);
	var x = this.tapSize * (this.marginLeft + n * 16);
	var y = this.tapSize * (this.marginTop + 12 * 5);
	var w = this.tapSize * 16;
	var h = this.tapSize * 8;
	var g = this.rakeGroup(x, y, w, h, 'drms' + n, this.drumGroup, left, top, width, height);
	if (g) {
		var track = this.findTrackInfo(0);
		this.tileText(g, x + this.tapSize * 13, y + this.tapSize * 2.5, this.tapSize * 3, '' + (n + 1), track.color);
		for (var i = 0; i < 8; i++) {
			/*
			for (var k = 0; k < 4; k++) {
			//this.tileRectangle(g, x + this.tapSize * (0 + i * 2), y + this.tapSize * (0 + k * 2), this.tapSize * 1, this.tapSize * 1, 'rgba(0,0,0,0.5)');
			this.tileRectangle(g, x + this.tapSize * (0 + i * 2), y + this.tapSize * (1 + k * 2), this.tapSize * 1, this.tapSize * 1, 'rgba(255,255,255,0.25)');
			this.tileRectangle(g, x + this.tapSize * (1 + i * 2), y + this.tapSize * (0 + k * 2), this.tapSize * 1, this.tapSize * 1, 'rgba(255,255,255,0.25)');
			//this.tileRectangle(g, x + this.tapSize * (1 + i * 2), y + this.tapSize * (1 + k * 2), this.tapSize * 1, this.tapSize * 1, 'rgba(0,0,0,0.5)');
			}
			 */
			this.tileRectangle(g, x + this.tapSize * (0 + i * 2), y + this.tapSize * (0 + 0 * 2), this.tapSize * 1, this.tapSize * 1, 'rgba(255,255,255,0.05)');
			this.tileRectangle(g, x + this.tapSize * (1 + i * 2), y + this.tapSize * (1 + 0 * 2), this.tapSize * 1, this.tapSize * 1, 'rgba(255,255,255,0.10)');
			this.tileRectangle(g, x + this.tapSize * (0 + i * 2), y + this.tapSize * (0 + 1 * 2), this.tapSize * 1, this.tapSize * 1, 'rgba(255,255,255,0.15)');
			this.tileRectangle(g, x + this.tapSize * (1 + i * 2), y + this.tapSize * (1 + 1 * 2), this.tapSize * 1, this.tapSize * 1, 'rgba(255,255,255,0.20)');
			this.tileRectangle(g, x + this.tapSize * (0 + i * 2), y + this.tapSize * (0 + 2 * 2), this.tapSize * 1, this.tapSize * 1, 'rgba(255,255,255,0.25)');
			this.tileRectangle(g, x + this.tapSize * (1 + i * 2), y + this.tapSize * (1 + 2 * 2), this.tapSize * 1, this.tapSize * 1, 'rgba(255,255,255,0.30)');
			this.tileRectangle(g, x + this.tapSize * (0 + i * 2), y + this.tapSize * (0 + 3 * 2), this.tapSize * 1, this.tapSize * 1, 'rgba(255,255,255,0.35)');
			this.tileRectangle(g, x + this.tapSize * (1 + i * 2), y + this.tapSize * (1 + 3 * 2), this.tapSize * 1, this.tapSize * 1, 'rgba(255,255,255,0.40)');
		}
		for (var i = 0; i < this.storeDrums.length; i++) {

			if (this.storeDrums[i].beat >= n * 16 && this.storeDrums[i].beat < (n + 1) * 16) {
				//console.log(n,this.storeDrums[i]);
				var xx = x + this.tapSize * (0.5 + this.storeDrums[i].beat - n * 16);
				var yy = y + this.tapSize * (0.5 + this.storeDrums[i].drum);
				this.tileLine(g, xx, yy, 1 + xx, yy, '#fff', this.tapSize);
			}
		}
	}
};

RiffShareFlat.prototype.tilePianoLines = function (left, top, width, height) {
	var x = this.tapSize * this.marginLeft;
	var y = this.tapSize * this.marginTop;
	var w = this.tapSize * 16 * 17;
	var h = this.tapSize * 12 * 5;
	var g = this.rakeGroup(x, y, w, h, 'pnlins', this.linesGroup, left, top, width, height);
	if (g) {
		for (var i = 0; i < 5; i++) {
			this.tileRectangle(g, x, y + this.tapSize * (0 + i * 12), w, this.tapSize * 0.9, 'rgba(255,255,255,0.1)');
			this.tileRectangle(g, x, y + this.tapSize * (2 + i * 12), w, this.tapSize * 0.9, 'rgba(255,255,255,0.1)');
			this.tileRectangle(g, x, y + this.tapSize * (4 + i * 12), w, this.tapSize * 0.9, 'rgba(255,255,255,0.1)');
			this.tileRectangle(g, x, y + this.tapSize * (6 + i * 12), w, this.tapSize * 0.9, 'rgba(255,255,255,0.1)');
			this.tileRectangle(g, x, y + this.tapSize * (7 + i * 12), w, this.tapSize * 0.9, 'rgba(255,255,255,0.2)');
			this.tileRectangle(g, x, y + this.tapSize * (9 + i * 12), w, this.tapSize * 0.9, 'rgba(255,255,255,0.3)');
			this.tileRectangle(g, x, y + this.tapSize * (11 + i * 12), w, this.tapSize * 0.9, 'rgba(255,255,255,0.4)');
		}
		for (var i = 1; i < 16 * 16; i++) {
			this.tileRectangle(g, x + this.tapSize * i, y, this.tapSize * 0.05, this.tapSize * 5 * 12, 'rgba(0,0,0,0.2)');
		}
		var track = this.findTrackInfo(0);
		for (var i = 16; i < 16 * 16; i = i + 16) {
			this.tileRectangle(g, x + this.tapSize * i, y, this.tapSize * 0.1, this.tapSize * (8 + 5 * 12), track.color);
		}
	}
};
RiffShareFlat.prototype.tileDrums = function (left, top, width, height) {
	//console.log('tileDrums',this.storeDrums);
	//var storeDrums = readObjectFromlocalStorage('storeDrums');
	for (var i = 0; i < 16; i++) {

		this.tileDrumMeasure(i, left, top, width, height);
	}
	/*
	var x = this.tapSize * this.marginLeft ;
	var y = this.tapSize * (this.marginTop + 12 * 5);
	var w = this.tapSize * 16*16;
	var h = this.tapSize * 8;
	var g = this.rakeGroup(x, y, w, h, 'drms', this.gridGroup, left, top, width, height);
	if (g) {
	var storeDrums = readObjectFromlocalStorage('storeDrums');
	for(var i=0;i<storeDrums.length;i++){
	var xx=x+this.tapSize * (0.5+storeDrums[i].beat);
	var yy=y+ this.tapSize * (0.5+storeDrums[i].drum);
	this.tileLine(g, xx, yy, 1+xx, yy, '#fff', this.tapSize);
	}
	}
	 */
};
RiffShareFlat.prototype.tilePartTones = function (measure, octave, track, left, top, width, height) {
	//console.log(measure,octave,track);
	var x = this.tapSize * (this.marginLeft + 16 * measure);
	var y = this.tapSize * (this.marginTop + 12 * (4 - octave));
	var w = this.tapSize * 16;
	var h = this.tapSize * 12;
	var g = this.rakeGroup(x, y, w, h, 'tnOm' + measure + 'x' + octave + 'x' + track.nn, this.trackGroups[track.order], left, top, width, height);
	if (g) {
		//this.tileCircle(g, x, y, this.tapSize / 3, 'rgba(255,0,0,0.95)');
		for (var i = 0; i < this.storeTracks.length; i++) {
			var p = this.storeTracks[i];
			if (p.track == track.nn) {
				if (p.beat >= measure * 16) {
					if (p.beat < (measure + 1) * 16) {
						if (p.pitch >= octave * 12) {
							if (p.pitch < (1 + octave) * 12) {
								var far = track.order * 0.03 * this.tapSize;
								var xx = x + this.tapSize * (0.5 + p.beat % 16) + far;
								var yy = y + this.tapSize * (12.5 - p.pitch % 12 - 1) - far;
								var le = p.length - 1;
								var r = this.tapSize;
								//this.tileLine(g, xx, yy, 1 + xx + this.tapSize * le, yy - this.tapSize * p.shift, this.trackInfo[7 - p.track].color, r);
								if (track.order > 0) {
									this.tileLine(g, xx, yy, 1 + xx + this.tapSize * le, yy - this.tapSize * p.shift, track.shadow, r);
								} else {
									this.tileLine(g, xx, yy, 1 + xx + this.tapSize * le, yy - this.tapSize * p.shift, track.color, r);
									this.tileCircle(g, xx, yy, this.tapSize / 3, 'rgba(255,255,255,0.5)');
								}
							}
						}
					}
				}
			}
		}
	}
};
RiffShareFlat.prototype._tilePartLines = function (measure, octave, left, top, width, height) {
	var x = this.tapSize * (this.marginLeft + 16 * measure);
	var y = this.tapSize * (this.marginTop + 12 * octave);
	var w = this.tapSize * 16;
	var h = this.tapSize * 12;
	var g = this.rakeGroup(x, y, w, h, 'moli' + measure + 'x' + octave, this.linesGroup, left, top, width, height);
	if (g) {
		var track = this.findTrackInfo(0);
		//this.tileText(g, x + this.tapSize * 13, y + this.tapSize * 2.5, this.tapSize * 3, ''+(n+1),track.shadow);
		this.tileText(g, x + this.tapSize * 13, y + this.tapSize * 2.5, this.tapSize * 3, '' + (measure + 1), track.shadow);
		//this.tileText(g, x + this.tapSize * 0.5, y + this.tapSize * 11.5, this.tapSize * 1, ''+(5-octave), '#333');
	}
};
RiffShareFlat.prototype.tileTones = function (left, top, width, height) {
	for (var m = 0; m < 16; m++) {
		for (var o = 0; o < 5; o++) {
			//this.tilePartLines(m, o, left, top, width, height);
			for (var t = 0; t < 8; t++) {
				this.tilePartTones(m, o, this.findTrackInfo(7 - t), left, top, width, height);
			}
		}
	}
	/*var x = this.tapSize * this.marginLeft;
	var y = this.tapSize * this.marginTop;
	var w = this.tapSize * 16 * 16;
	var h = this.tapSize * 12 * 5;

	var g = this.rakeGroup(x, y, w, h, 'tns', this.gridGroup, left, top, width, height);
	if (g) {
	var storeTracks = readObjectFromlocalStorage('storeTracks');
	for (var i = 0; i < storeTracks.length; i++) {
	//console.log(storeTracks[i]);
	var far = storeTracks[i].track * 0.03 * this.tapSize;
	var xx = x + this.tapSize * (0.5 + storeTracks[i].beat) + far;
	var yy = y + this.tapSize * (0.5 + 12 * 5 - storeTracks[i].pitch - 1) - far;
	var le = storeTracks[i].length - 1;

	var r = this.tapSize;
	//console.log(xx,yy,this.icolors[storeTracks[i].track-1]);
	this.tileLine(g, xx, yy, 1 + xx + this.tapSize * le, yy - this.tapSize * storeTracks[i].shift, this.icolors[7 - storeTracks[i].track].color, r);
	this.tileCircle(g, xx, yy, this.tapSize / 3, 'rgba(255,255,255,0.25)');
	}
	}*/
};
RiffShareFlat.prototype.tileTempo = function (left, top, width, height) {
	var x = this.tapSize * (this.marginLeft - 12);
	var y = this.tapSize * (this.marginTop + 12 * 5 - 33);
	var w = this.tapSize * 12;
	var h = this.tapSize * 8;
	var g = this.rakeGroup(x, y, w, h, 'tmpo', this.textGroup, left, top, width, height);
	var cw = 11 / 8;
	if (g) {
		this.tileRectangle(g, x, y + this.tapSize * 0, this.tapSize * 11, this.tapSize * 0.9, 'rgba(255,255,255,0.5)');
		//var n = sureInList(readTextFromlocalStorage('tempo'), 120, [80, 100, 120, 140, 160, 180, 200, 220]);
		//console.log(n);
		this.tileRectangle(g, x, y + this.tapSize * 0, this.tapSize * cw * (this.tempo - 60) / 20, this.tapSize * 0.9, 'rgba(255,255,255,0.9)');
		this.tileText(g, x - this.tapSize * 5.5, y + this.tapSize * 0.75, this.tapSize * 0.9, 'Tempo ' + this.tempo + ' bpm', '#ffffff');
		//[80, 100, 120, 140, 160, 180, 200, 220]
		for (var i = 0; i < 8; i++) {
			//this.tileRectangle(g, x + this.tapSize * cw * i, y, this.tapSize * 0.5, this.tapSize * 0.5, 'rgba(255,0,255,0.9)');
			var s = this.addSpot('tempo' + i, x + this.tapSize * cw * i, y , this.tapSize * cw, this.tapSize, function () {
					riffshareflat.userActionTempo(this.tempo);
				});
			s.tempo = i*20+80;
		}
	}
};
RiffShareFlat.prototype.findTrackInfo = function (order) {
	for (var i = 0; i < 8; i++) {
		if (this.trackInfo[i].order == order) {
			return this.trackInfo[i];
		}
	}
	return null;
};
RiffShareFlat.prototype.getTrackOrders = function () {
	var o = [];
	for (var i = 0; i < 8; i++) {
		o.push(this.trackInfo[i].order);
	}
	return o;
};
RiffShareFlat.prototype.setTrackOrders = function (o) {
	for (var i = 0; i < 8; i++) {
		this.trackInfo[i].order = o[i];
	}
};
RiffShareFlat.prototype.upTrack = function (order) {

	var track = this.findTrackInfo(order);
	//console.log('upTrack',order,track);
	for (var i = 0; i < 8; i++) {
		if (this.trackInfo[i].order < track.order) {
			this.trackInfo[i].order++;
		}
	}
	track.order = 0;
};
RiffShareFlat.prototype.tileToneVolumes = function (left, top, width, height) {
	var x = this.tapSize * (this.marginLeft - 18);
	var y = this.tapSize * (this.marginTop + 12 * 5 - 9);
	var w = this.tapSize * 12;
	var h = this.tapSize * 8;
	var g = this.rakeGroup(x, y, w, h, 'tnvlm', this.linesGroup, left, top, width, height);
	if (g) {
		for (var i = 0; i < 8; i++) {
			var track = this.findTrackInfo(i);
			this.tileRectangle(g, x + this.tapSize * (0 + 6), y + this.tapSize * i, this.tapSize * 11, this.tapSize * 0.9, 'rgba(255,255,255,0.5)');
			this.tileRectangle(g, x + this.tapSize * 6, y + this.tapSize * i, this.tapSize * (1 + track.volume / 10), this.tapSize * 0.9, track.color);
			this.tileCircle(g, x + this.tapSize * 0.9, y + this.tapSize * (i + 0.5), this.tapSize * 0.5, 'rgba(255,255,255,0.3)');
			var s = this.addSpot('up' + i, x + this.tapSize * 0.0, y + this.tapSize * (i + 0.2), this.tapSize * 5, this.tapSize * 1, function () {
					riffshareflat.userActionUpTrack(this.order);
				});
			s.order = i;
			this.tileText(g, x + this.tapSize * 0.5, y + this.tapSize * (i + 0.75), this.tapSize * 0.9, track.title, track.color);
			for (var v = 0; v < 11; v++) {
				var s = this.addSpot('volton' + i + 'x' + v, x + this.tapSize * (6 + v), y + this.tapSize * i, this.tapSize, this.tapSize, function () {
						riffshareflat.userActionToneVolume(this.track, this.volume);
					});
				s.track = track;
				s.volume = v * 10;
			}
		}
	}
};
RiffShareFlat.prototype.tileDrumVolumes = function (left, top, width, height) {
	var x = this.tapSize * (this.marginLeft - 18);
	var y = this.tapSize * (this.marginTop + 12 * 5);
	var w = this.tapSize * 12;
	var h = this.tapSize * 8;
	var g = this.rakeGroup(x, y, w, h, 'drvlm', this.textGroup, left, top, width, height);
	if (g) {
		for (var i = 0; i < 8; i++) {
			this.tileRectangle(g, x + this.tapSize * 6, y + this.tapSize * i, this.tapSize * 11, this.tapSize * 0.9, 'rgba(255,255,255,0.5)');
			//var n = sureNumeric(readObjectFromlocalStorage('drum' + i), 0, 70, 100) / 10;
			var n = this.drumVolumes[i] / 10;
			//console.log(i,n);
			this.tileRectangle(g, x + this.tapSize * 6, y + this.tapSize * i, this.tapSize * (1 + n), this.tapSize * 0.9, 'rgba(255,255,255,0.9)');
			for(var v=0;v<11;v++){
				//this.tileRectangle(g, x + this.tapSize * (6+v), y + this.tapSize * i, this.tapSize * 0.3, this.tapSize * 0.9, 'rgba(77,44,255,0.9)');
				//this.userActionDrumVolume
				var s = this.addSpot('voldru' + i + 'x' + v, x + this.tapSize * (6 + v), y + this.tapSize * i, this.tapSize, this.tapSize, function () {
						riffshareflat.userActionDrumVolume(this.drum, this.volume);
					});
				s.drum = i;
				s.volume = v * 10;
			}
		}
		this.tileText(g, x + this.tapSize * 0.5, y + this.tapSize * 0.75, this.tapSize * 0.9, 'Bass drum', '#ffffff');
		this.tileText(g, x + this.tapSize * 0.5, y + this.tapSize * 1.75, this.tapSize * 0.9, 'Low tom', '#ffffff');
		this.tileText(g, x + this.tapSize * 0.5, y + this.tapSize * 2.75, this.tapSize * 0.9, 'Snare drum', '#ffffff');
		this.tileText(g, x + this.tapSize * 0.5, y + this.tapSize * 3.75, this.tapSize * 0.9, 'Mid Tom', '#ffffff');
		this.tileText(g, x + this.tapSize * 0.5, y + this.tapSize * 4.75, this.tapSize * 0.9, 'Closed Hi-hat', '#ffffff');
		this.tileText(g, x + this.tapSize * 0.5, y + this.tapSize * 5.75, this.tapSize * 0.9, 'Open Hi-hat', '#ffffff');
		this.tileText(g, x + this.tapSize * 0.5, y + this.tapSize * 6.75, this.tapSize * 0.9, 'Ride Cymbal', '#ffffff');
		this.tileText(g, x + this.tapSize * 0.5, y + this.tapSize * 7.75, this.tapSize * 0.9, 'Splash Cymbal', '#ffffff');
	}
};
RiffShareFlat.prototype.tileEqualizer = function (left, top, width, height) {
	var x = this.tapSize * (this.marginLeft - 12);
	var y = this.tapSize * (this.marginTop + 12 * 5 - 31);
	var w = this.tapSize * 10;
	var h = this.tapSize * 21;

	var g = this.rakeGroup(x, y, w, h, 'eqlzr', this.textGroup, left, top, width, height);
	if (g) {
		for (var i = 0; i < 10; i++) {
			this.tileRectangle(g, x + this.tapSize * i * 1.1, y, this.tapSize * 1.05, this.tapSize * 21, 'rgba(255,255,255,0.5)');
			var n = sureNumeric(readObjectFromlocalStorage('equalizer' + i), -10, 0, 10);
			//console.log(n);
			var ey = n < 0 ? y + this.tapSize * 10 : y + this.tapSize * 10 - this.tapSize * n;

			this.tileRectangle(g, x + this.tapSize * i * 1.1, ey, this.tapSize * 1.05, this.tapSize * (1 + Math.abs(n)), 'rgba(255,255,255,0.9)');
		}
		//this.tileRectangle(g, x, y + this.tapSize * 10, this.tapSize * 9.9, this.tapSize * 1, '#fff');
		this.tileText(g, x + this.tapSize * (0 * 1.1 + 0.2), y + this.tapSize * 10.75, this.tapSize * 0.5, '65', '#000');
		this.tileText(g, x + this.tapSize * (1 * 1.1 + 0.2), y + this.tapSize * 10.75, this.tapSize * 0.5, '125', '#000');
		this.tileText(g, x + this.tapSize * (2 * 1.1 + 0.2), y + this.tapSize * 10.75, this.tapSize * 0.5, '250', '#000');
		this.tileText(g, x + this.tapSize * (3 * 1.1 + 0.2), y + this.tapSize * 10.75, this.tapSize * 0.5, '500', '#000');
		this.tileText(g, x + this.tapSize * (4 * 1.1 + 0.2), y + this.tapSize * 10.75, this.tapSize * 0.5, '1k', '#000');
		this.tileText(g, x + this.tapSize * (5 * 1.1 + 0.2), y + this.tapSize * 10.75, this.tapSize * 0.5, '1k', '#000');
		this.tileText(g, x + this.tapSize * (6 * 1.1 + 0.2), y + this.tapSize * 10.75, this.tapSize * 0.5, '2k', '#000');
		this.tileText(g, x + this.tapSize * (7 * 1.1 + 0.2), y + this.tapSize * 10.75, this.tapSize * 0.5, '4k', '#000');
		this.tileText(g, x + this.tapSize * (8 * 1.1 + 0.2), y + this.tapSize * 10.75, this.tapSize * 0.5, '8k', '#000');
		this.tileText(g, x + this.tapSize * (9 * 1.1 + 0.2), y + this.tapSize * 10.75, this.tapSize * 0.5, '16k', '#000');
	}
};
RiffShareFlat.prototype.clearUselessDetails = function (x, y, w, h, layer) {
	for (var i = 0; i < layer.children.length; i++) {
		var group = layer.children[i];
		this.clearUselessNodes(x, y, w, h, group);
	}
};
RiffShareFlat.prototype.clearUselessNodes = function (x, y, w, h, layer) {
	for (var i = 0; i < layer.children.length; i++) {
		var t = layer.children[i];
		if (this.outOfView(t, x, y, w, h)) {
			layer.removeChild(t);
			i--;
		} else {
			//
		}
	}
};
RiffShareFlat.prototype.outOfView = function (child, x, y, w, h) {
	var tbb = child.getBBox();
	return !(this.collision(tbb.x, tbb.y, tbb.width, tbb.height, x, y, w, h));
};
RiffShareFlat.prototype.clearSpots = function () {
	this.spots = [];
};
RiffShareFlat.prototype.findSpot = function (id) {
	for (var i = 0; i < this.spots.length; i++) {
		if (this.spots[i].id == id) {
			return this.spots[i];
		}
	}
	return null;
};
RiffShareFlat.prototype.dropSpot = function (id) {
	for (var i = 0; i < this.spots.length; i++) {
		if (this.spots[i].id == id) {
			this.spots.splice(i, 1);
			break;
		}
	}
};
RiffShareFlat.prototype.rakeGroup = function (x, y, w, h, id, layer, left, top, width, height) {
	if (this.collision(x, y, w, h, left, top, width, height)) {
		if (!this.childExists(id, layer)) {
			var g = document.createElementNS(this.svgns, 'g');
			g.id = id;
			layer.appendChild(g);
			return g;
		} else {
			//console.log(id,'exists');
		}
	}
	return null;
};
RiffShareFlat.prototype.childExists = function (id, layer) {
	for (var i = 0; i < layer.children.length; i++) {
		var t = layer.children[i];
		if (t.id == id) {
			return true;
		}
	}
	return false;
};
RiffShareFlat.prototype.collision = function (x1, y1, w1, h1, x2, y2, w2, h2) {
	if (x1 + w1 < x2 //
		 || x1 > x2 + w2 //
		 || y1 + h1 < y2 //
		 || y1 > y2 + h2 //
	)
	{
		return false;
	} else {
		return true;

	}
};
RiffShareFlat.prototype.resetSize = function () {

	//var ml = this.songWidth32th();
	/*var tc = 1;
	if (this.currentSong) {
	tc = this.currentSong.channels.length
	}*/
	this.innerWidth = (this.marginLeft + this.marginRight + 16 * 16) * this.tapSize;
	this.innerHeight = (this.marginTop + this.marginBottom + 8 + 5 * 12) * this.tapSize;
	this.contentSVG.style.width = this.contentDiv.clientWidth + 'px';
	this.contentSVG.style.height = this.contentDiv.clientHeight + 'px';

	document.getElementById('undobutton').style.width = this.tapSize + 'px';
	document.getElementById('undobutton').style.height = this.tapSize + 'px';
	document.getElementById('redobutton').style.width = this.tapSize + 'px';
	document.getElementById('redobutton').style.height = this.tapSize + 'px';
	document.getElementById('redobutton').style.top = (5 * 2 + this.tapSize) + 'px';

	this.adjustContentPosition();
	this.queueTiles();
};
RiffShareFlat.prototype.undoLast = function () {
	//
};
RiffShareFlat.prototype.redoNext = function () {
	//
};
RiffShareFlat.prototype.tileLine = function (g, x1, y1, x2, y2, strokeColor, strokeWidth) {
	var line = document.createElementNS(this.svgns, 'line');
	line.setAttributeNS(null, 'x1', x1);
	line.setAttributeNS(null, 'y1', y1);
	line.setAttributeNS(null, 'x2', x2);
	line.setAttributeNS(null, 'y2', y2);
	if (strokeColor) {
		line.setAttributeNS(null, 'stroke', strokeColor);
	}
	if (strokeWidth) {
		line.setAttributeNS(null, 'stroke-width', strokeWidth);
	}
	line.setAttributeNS(null, 'stroke-linecap', 'round');
	g.appendChild(line);
	return line;
};
RiffShareFlat.prototype.tileEllipse = function (g, x, y, rx, ry, fillColor, strokeColor, strokeWidth) {
	var e = document.createElementNS(this.svgns, 'ellipse');
	e.setAttributeNS(null, 'cx', x);
	e.setAttributeNS(null, 'cy', y);
	e.setAttributeNS(null, 'rx', rx);
	e.setAttributeNS(null, 'ry', ry);
	if (fillColor) {
		e.setAttributeNS(null, 'fill', fillColor);
	}
	if (strokeColor) {
		e.setAttributeNS(null, 'stroke', strokeColor);
	}
	if (strokeWidth) {
		e.setAttributeNS(null, 'stroke-width', strokeWidth);
	}
	g.appendChild(e);
};
RiffShareFlat.prototype.tileCircle = function (g, x, y, r, fillColor, strokeColor, strokeWidth) {
	var circle = document.createElementNS(this.svgns, 'circle');
	circle.setAttributeNS(null, 'cx', x);
	circle.setAttributeNS(null, 'cy', y);
	circle.setAttributeNS(null, 'r', r);
	if (fillColor) {
		circle.setAttributeNS(null, 'fill', fillColor);
	}
	if (strokeColor) {
		circle.setAttributeNS(null, 'stroke', strokeColor);
	}
	if (strokeWidth) {
		circle.setAttributeNS(null, 'stroke-width', strokeWidth);
	}
	g.appendChild(circle);
};
RiffShareFlat.prototype.tileRectangle = function (g, x, y, w, h, fillColor, strokeColor, strokeWidth, r) {
	var rect = document.createElementNS(this.svgns, 'rect');
	rect.setAttributeNS(null, 'x', x);
	rect.setAttributeNS(null, 'y', y);
	rect.setAttributeNS(null, 'height', h);
	rect.setAttributeNS(null, 'width', w);
	if (fillColor) {
		rect.setAttributeNS(null, 'fill', fillColor);
	}
	if (strokeColor) {
		rect.setAttributeNS(null, 'stroke', strokeColor);
	}
	if (strokeWidth) {
		rect.setAttributeNS(null, 'stroke-width', strokeWidth);
	}
	if (r) {
		rect.setAttributeNS(null, 'rx', r);
		rect.setAttributeNS(null, 'ry', r);
	}
	g.appendChild(rect);
};
RiffShareFlat.prototype.tileText = function (g, x, y, fontSize, text, bgColor, strokeColor, strokeWidth, fontFamily, fontStyle) {
	var txt = document.createElementNS(this.svgns, 'text');
	txt.setAttributeNS(null, 'x', x);
	txt.setAttributeNS(null, 'y', y);
	txt.setAttributeNS(null, 'font-size', fontSize);
	if (bgColor) {
		txt.setAttributeNS(null, 'fill', bgColor);
	}
	if (fontFamily) {
		txt.setAttributeNS(null, 'font-family', fontFamily);
	}
	if (fontStyle) {
		txt.setAttributeNS(null, 'font-style', fontStyle);
	}
	if (strokeColor) {
		txt.setAttributeNS(null, 'stroke', strokeColor);
	}
	if (strokeWidth) {
		txt.setAttributeNS(null, 'stroke-width', strokeWidth);
	}
	txt.innerHTML = text;
	g.appendChild(txt);
};
RiffShareFlat.prototype.clearLayerChildrent = function (layers) {
	for (var i = 0; i < layers.length; i++) {
		var layer = layers[i];
		for (var n = 0; n < layer.children.length; n++) {
			var g = layer.children[n];
			while (g.children.length > 0) {
				g.removeChild(g.children[0]);
			}
		}
	}
};
RiffShareFlat.prototype.makeUndo = function (level) {
	console.log('makeUndo', level);
	var last = null;
	for (var i = this.undoQueue.length - 1; i >= level; i--) {
		var u = this.undoQueue.pop();
		//console.log(u);
		u.undo();
		last = u;
	}
	if (last) {
		this.resetAllLayersNow();
		this.startSlideTo(last.x, last.y, last.z);
	}
};
RiffShareFlat.prototype.clearUndo = function () {
	this.undoQueue = [];
	this.undoStep = 0;
}
RiffShareFlat.prototype.setUndoStatus = function () {
	if (this.undoStep < this.undoQueue.length) {
		document.getElementById('redoimg').src = "redoActive.png";
	} else {
		document.getElementById('redoimg').src = "redo.png";
	}
	if (this.undoStep > 0) {
		document.getElementById('undoimg').src = "undoActive.png";
	} else {
		document.getElementById('undoimg').src = "undo.png";
	}
	//console.log('setUndoStatus', this.undoStep, this.undoQueue.length);
};
RiffShareFlat.prototype.redoNext = function () {
	if (this.undoStep < this.undoQueue.length) {
		var a = this.undoQueue[this.undoStep];
		console.log('redo', a.caption);
		a.redo();
		this.undoStep++;
		this.resetAllLayersNow();
		this.startSlideTo(a.x, a.y, a.z);
		this.setUndoStatus();
	}
};
RiffShareFlat.prototype.undoLast = function () {
	if (this.undoStep > 0) {
		this.undoStep--;
		var a = this.undoQueue[this.undoStep];
		console.log('undo', a.caption);
		a.undo();
		this.resetAllLayersNow();
		this.startSlideTo(a.x, a.y, a.z);
		this.setUndoStatus();
	}
};
RiffShareFlat.prototype.pushAction = function (action) {
	console.log('pushAction', action.caption);
	action.x = this.translateX;
	action.y = this.translateY;
	action.z = this.translateZ;
	action.redo();
	var rm = this.undoQueue.length - this.undoStep;
	for (var i = 0; i < rm; i++) {
		this.undoQueue.pop();
	}
	this.undoQueue.push(action);
	this.undoStep++;
	rm = this.undoQueue.length - this.undoSize;
	for (var i = 0; i < rm; i++) {
		this.undoQueue.shift();
		this.undoStep--;
	}
	this.setUndoStatus();
};

RiffShareFlat.prototype.userActionUpTrack = function (order) {
	var before = this.getTrackOrders();
	this.upTrack(order);
	var after = this.getTrackOrders();
	riffshareflat.pushAction({
		caption: 'Up ' + order,
		undo: function () {
			riffshareflat.setTrackOrders(before);
		},
		redo: function () {
			riffshareflat.setTrackOrders(after);
		}
	});
};
RiffShareFlat.prototype.userActionToneVolume = function (track, volume) {
	var before = this.getTrackOrders();
	this.upTrack(track.order);
	var after = this.getTrackOrders();
	var old = track.volume;
	riffshareflat.pushAction({
		caption: 'Volume ' + volume + ' for ' + track.title,
		undo: function () {
			track.volume = old;
			riffshareflat.setTrackOrders(before);
		},
		redo: function () {
			track.volume = volume;
			riffshareflat.setTrackOrders(after);
		}
	});
};
RiffShareFlat.prototype.userActionDrumVolume = function (nn, volume) {
	var old = this.drumVolumes[nn];
	riffshareflat.pushAction({
		caption: 'Volume ' + volume + ' for drum ' + nn,
		undo: function () {
			riffshareflat.drumVolumes[nn]=old;
		},
		redo: function () {
			riffshareflat.drumVolumes[nn]=volume;
		}
	});
};
RiffShareFlat.prototype.userActionTempo = function (tempo) {
	var old = this.tempo;
	riffshareflat.pushAction({
		caption: 'Tempo ' + tempo ,
		undo: function () {
			riffshareflat.tempo = old;
		},
		redo: function () {
			riffshareflat.tempo = tempo;
		}
	});
};
window.onload = function () {
	console.log('create riffshareflat');
	new RiffShareFlat();
	riffshareflat.init();
};
