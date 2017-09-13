console.log('riffshareflat v1.0.3');
function RiffShareFlat() {
	window.riffshareflat = this;
	return this;
}
RiffShareFlat.prototype.init = function () {
	this.tapSize = 32;
	try {
		console.log('window.devicePixelRatio', window.devicePixelRatio);
		var pixelRatio = window.devicePixelRatio;
		this.tapSize = 31 * pixelRatio;
		if (isNaN(this.tapSize)) {
			this.tapSize = 51;
		}
	} catch (ex) {
		console.log(ex);
	}
	console.log('tapSize', this.tapSize, 'devicePixelRatio', window.devicePixelRatio);
	this.tickID = -1;
	this.onAir = false;
	this.queueAhead = 0.3;
	console.log('queueAhead', this.queueAhead);
	this.svgns = "http://www.w3.org/2000/svg";
	this.contentDiv = document.getElementById('contentDiv');
	this.contentSVG = document.getElementById('contentSVG');
	this.rakeDiv = document.getElementById('rakeDiv');
	this.contentGroup = document.getElementById('contentGroup');
	this.paneGroup = document.getElementById('paneGroup');
	this.linesGroup = document.getElementById('linesGroup');
	this.textGroup = document.getElementById('textGroup');
	this.drumGroup = document.getElementById('drumGroup');
	this.upperGroup = document.getElementById('upperGroup');
	this.counterGroup = document.getElementById('counterGroup');
	this.counterLine = null;
	this.trackGroups = [];
	this.trackGroups[7] = document.getElementById('track1Group');
	this.trackGroups[6] = document.getElementById('track2Group');
	this.trackGroups[5] = document.getElementById('track3Group');
	this.trackGroups[4] = document.getElementById('track4Group');
	this.trackGroups[3] = document.getElementById('track5Group');
	this.trackGroups[2] = document.getElementById('track6Group');
	this.trackGroups[1] = document.getElementById('track7Group');
	this.trackGroups[0] = document.getElementById('track8Group');
	//this.bgGroup = document.getElementById('bgGroup');
	//this.bgImage = document.getElementById('bgImage');
	//this.bgImageWidth = 1280;
	//this.bgImageHeight = 800;
	this.sentWhen = 0;
	this.sentMeasure = 0;
	this.nextBeat = 0;
	this.nextWhen = 0;
	this.mark = null;
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
	this.marginLeft = 18.5;
	this.marginRight = 17;
	this.marginTop = 1;
	this.marginBottom = 1;
	this.tempo = sureInList(readTextFromlocalStorage('tempo'), 120, [80, 100, 120, 140, 160, 180, 200, 220]);
	this.drumVolumes = [];
	for (var i = 0; i < 8; i++) {
		this.drumVolumes.push(sureNumeric(readObjectFromlocalStorage('drum' + i), 0, 70, 100));
	}
	this.equalizer = [];
	for (var i = 0; i < 10; i++) {
		this.equalizer.push(sureNumeric(readObjectFromlocalStorage('equalizer' + i), -10, 0, 10));
	}
	this.drumInfo=drumInfo;
	this.trackInfo=trackInfo;
	/*
	this.drumInfo = [{
			sound: _drum_35_0_Chaos_sf2_file,
			pitch: 36, //36
			title: 'Bass drum',
			id: 0,
			volumeRatio: 0.5,
			length: 0.5
		}, {
			sound: _drum_41_26_JCLive_sf2_file,
			pitch: 41, //43
			title: 'Low Tom',
			id: 1,
			volumeRatio: 0.5,
			length: 0.5
		}, {
			sound: _drum_38_22_FluidR3_GM_sf2_file,
			pitch: 38, //40
			title: 'Snare drum',
			id: 2,
			volumeRatio: 0.75,
			length: 0.5
		}, {
			sound: _drum_45_26_JCLive_sf2_file,
			pitch: 45, //47,48,50
			title: 'Mid Tom',
			id: 3,
			volumeRatio: 0.75,
			length: 0.5
		}, {
			sound: _drum_42_26_JCLive_sf2_file,
			pitch: 42, //44
			title: 'Closed Hi-hat',
			id: 4,
			volumeRatio: 0.5,
			length: 1
		}, {
			sound: _drum_46_26_JCLive_sf2_file,
			pitch: 46, //
			title: 'Open Hi-hat',
			id: 5,
			volumeRatio: 0.5,
			length: 1
		}, {
			sound: _drum_51_26_JCLive_sf2_file,
			pitch: 51, //rest
			title: 'Ride Cymbal',
			id: 6,
			volumeRatio: 0.3,
			length: 2
		}, {
			sound: _drum_49_26_JCLive_sf2_file,
			pitch: 49, //
			title: 'Splash Cymbal',
			id: 7,
			volumeRatio: 0.3,
			length: 3
		}
	];
	this.trackInfo = [{
			color: 'rgba(255,204,187,1)',
			shadow: 'rgba(255,204,187,0.4)',
			title: 'Synth Bass',
			order: 2,
			sound: _tone_0390_GeneralUserGS_sf2_file,
			volume: sureNumeric(readObjectFromlocalStorage('track7'), 0, 70, 100),
			nn: 7,
			octave: 3,
			volumeRatio: 0.5
		}, {
			color: 'rgba(204,153,0,1)',
			shadow: 'rgba(204,153,0,0.4)',
			title: 'String Ensemble',
			order: 1,
			sound: _tone_0480_Aspirin_sf2_file,
			volume: sureNumeric(readObjectFromlocalStorage('track6'), 0, 70, 100),
			nn: 6,
			octave: 3,
			volumeRatio: 0.6
		}, {
			color: 'rgba(204,0,204,1)',
			shadow: 'rgba(204,0,204,0.4)',
			title: 'Bass guitar',
			order: 5,
			sound: _tone_0330_SoundBlasterOld_sf2,
			volume: sureNumeric(readObjectFromlocalStorage('track5'), 0, 70, 100),
			nn: 5,
			octave: 2,
			volumeRatio: 0.99
		}, {
			color: 'rgba(00,153,255,1)',
			shadow: 'rgba(00,153,255,0.4)',
			title: 'Acoustic Piano',
			order: 3,
			sound: _tone_0000_Chaos_sf2_file,
			volume: sureNumeric(readObjectFromlocalStorage('track4'), 0, 70, 100),
			nn: 4,
			octave: 3,
			volumeRatio: 0.9
		}, {
			color: 'rgba(153,51,0,1)',
			shadow: 'rgba(153,51,0,0.4)',
			title: 'PalmMute guitar',
			order: 4,
			sound: _tone_0280_LesPaul_sf2_file,
			volume: sureNumeric(readObjectFromlocalStorage('track3'), 0, 70, 100),
			nn: 3,
			octave: 3,
			volumeRatio: 0.9
		}, {
			color: 'rgba(51,51,255,1)',
			shadow: 'rgba(51,51,255,0.4)',
			title: 'Percussive Organ',
			order: 0,
			sound: _tone_0170_JCLive_sf2_file,
			volume: sureNumeric(readObjectFromlocalStorage('track2'), 0, 70, 100),
			nn: 2,
			octave: 4,
			volumeRatio: 0.6
		}, {
			color: 'rgba(0,153,0,1)',
			shadow: 'rgba(0,153,0,0.4)',
			title: 'Acoustic guitar',
			order: 6,
			sound: _tone_0250_Chaos_sf2_file,
			volume: sureNumeric(readObjectFromlocalStorage('track1'), 0, 70, 100),
			nn: 1,
			octave: 3,
			volumeRatio: 0.75
		}, {
			color: 'rgba(255,0,0,1)',
			shadow: 'rgba(255,0,0,0.4)',
			title: 'Distortion guitar',
			order: 7,
			sound: _tone_0300_LesPaul_sf2_file,
			volume: sureNumeric(readObjectFromlocalStorage('track0'), 0, 70, 100),
			nn: 0,
			octave: 3,
			volumeRatio: 0.9
		}

	];*/
	this.setupInput();
	window.onresize = function () {
		riffshareflat.resetSize();
	};
	window.onbeforeunload = function () {
		riffshareflat.saveState();
	};
	window.onblur = function () {
		riffshareflat.saveState();
	};
	var flatstate = readObjectFromlocalStorage('flatstate');
	//console.log(flatstate);
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
					var o = sureNumeric(flatstate.orders[i], 0, i, 7)
						riffshareflat.trackInfo[i].order = o;
				}
				flatstate.orders.sort();
				for (var i = 0; i < 8; i++) {
					if (flatstate.orders[i] == i) {
						//
					} else {
						for (var n = 0; n < 8; n++) {
							riffshareflat.trackInfo[n].order = riffshareflat.trackInfo[n].nn;
						}
						break;
					}
				}
			}
		} catch (ex) {
			console.log(ex);
		}
	}
	this.storeDrums = sureArray(readObjectFromlocalStorage('storeDrums'), []);
	//console.log(this.storeDrums, readObjectFromlocalStorage('storeDrums'));
	/*try {
	var le = this.storeDrums.length;
	} catch (t) {
	console.log(t);
	this.storeDrums = [];
	}*/
	this.storeTracks = sureArray(readObjectFromlocalStorage('storeTracks'), []);
	//console.log(this.storeTracks, readObjectFromlocalStorage('storeTracks'));
	/*try {
	var le = this.storeTracks.length;
	} catch (t) {
	console.log(t);
	this.storeTracks = [];
	}*/
	var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
	this.audioContext = new AudioContextFunc();
	this.player = new WebAudioFontPlayer();
	this.reverberator = new WebAudioFontReverberator(this.audioContext);
	this.reverberator.output.connect(this.audioContext.destination);
	this.master = new WebAudioFontChannel(this.audioContext);
	this.master.output.connect(this.reverberator.input);
	for (var i = 0; i < 8; i++) {
		this.trackInfo[i].audioNode = this.audioContext.createGain();
		this.trackInfo[i].audioNode.connect(this.master.input);
		this.drumInfo[i].audioNode = this.audioContext.createGain();
		this.drumInfo[i].audioNode.connect(this.master.input);
	}
	for (var i = 0; i < this.drumInfo.length; i++) {
		this.player.adjustPreset(this.audioContext, this.drumInfo[i].sound);
	}
	for (var i = 0; i < this.trackInfo.length; i++) {
		this.player.adjustPreset(this.audioContext, this.trackInfo[i].sound);
	}
	this.resetSize();
	//setInterval(riffshareflat.moveCounter, 100);
	setInterval(riffshareflat.moveBeatCounter, 100);
	
	console.log('done init');
};
RiffShareFlat.prototype.saveState = function () {
	this.stopPlay();
	var flatstate = {
		tx: this.translateX,
		ty: this.translateY,
		tz: this.translateZ,
		orders: []
	};
	for (var i = 0; i < 8; i++) {
		flatstate.orders.push(this.trackInfo[i].order);
	}
	saveObject2localStorage('flatstate', flatstate);
	saveText2localStorage('tempo', '' + this.tempo);
	for (var i = 0; i < 8; i++) {
		saveText2localStorage('drum' + i, '' + this.drumVolumes[i]);
		saveText2localStorage('track' + i, '' + this.trackInfo[7 - i].volume);
	}
	for (var i = 0; i < 10; i++) {
		saveText2localStorage('equalizer' + i, '' + this.equalizer[i]);
	}
	saveObject2localStorage('storeDrums', this.storeDrums);
	saveObject2localStorage('storeTracks', this.storeTracks);
	window.onunload = null;
};
RiffShareFlat.prototype.copyDrums = function () {
	var drums = [];
	for (var i = 0; i < this.storeDrums.length; i++) {
		drums.push({
			beat: this.storeDrums[i].beat,
			drum: this.storeDrums[i].drum
		});
	}
	return drums;
};
RiffShareFlat.prototype.copyTones = function () {
	//console.log(this.storeTracks);
	var tones = [];
	for (var i = 0; i < this.storeTracks.length; i++) {
		tones.push({
			beat: this.storeTracks[i].beat,
			pitch: this.storeTracks[i].pitch,
			track: this.storeTracks[i].track,
			shift: this.storeTracks[i].shift,
			length: this.storeTracks[i].length
		});
	}
	return tones;
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
	riffshareflat.translateX = riffshareflat.translateX - (riffshareflat.translateZ - zoom) * e.layerX;
	riffshareflat.translateY = riffshareflat.translateY - (riffshareflat.translateZ - zoom) * e.layerY;
	riffshareflat.translateZ = zoom;
	riffshareflat.adjustContentPosition();
	riffshareflat.queueTiles();
	return false;
};
RiffShareFlat.prototype.rakeMouseDown = function (mouseEvent) {
	mouseEvent.preventDefault();
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
	var d = riffshareflat.vectorDistance(p1, p2);
	if (d <= 0) {
		d = 1;
	}
	riffshareflat.twodistance = d;
};
RiffShareFlat.prototype.rakeTouchStart = function (touchEvent) {
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
			if (zoom < riffshareflat.minZoom) {
				zoom = riffshareflat.minZoom;
			}
			if (zoom > riffshareflat.maxZoom) {
				zoom = riffshareflat.maxZoom;
			}
			riffshareflat.translateX = riffshareflat.translateX - (riffshareflat.translateZ - zoom) * riffshareflat.twocenter.x;
			riffshareflat.translateY = riffshareflat.translateY - (riffshareflat.translateZ - zoom) * riffshareflat.twocenter.y;
			riffshareflat.translateZ = zoom;
			riffshareflat.adjustContentPosition();
		}
	}
};

RiffShareFlat.prototype.rakeTouchEnd = function (touchEvent) {
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
	this.spots.push(spot);
	return spot;
};
RiffShareFlat.prototype.runSpots = function (x, y) {
	var needRedraw = false;
	for (var i = this.spots.length - 1; i >= 0; i--) {
		var spot = this.spots[i];
		var checkX = spot.x;
		var checkY = spot.y;
		if (spot.sx) {
			checkX = spot.x + this.stickedX;
		}
		if (this.collision(x, y, 1, 1, checkX, checkY, spot.w, spot.h)) {
			if (spot.a) {
				spot.a();
			}
			if (spot.tz < this.translateZ && spot.tz > 0) {
				var tox = -checkX;
				if (spot.sx) {
					if (-tox > spot.x) {
						tox = this.translateX;
					} else {
						tox = -spot.x;
					}
				}
				this.startSlideTo(tox, -checkY, spot.tz);
			} else {
				needRedraw = true;
			}
			break;
		}
	}
	if (needRedraw) {
		this.resetAllLayersNow();
	}
};
RiffShareFlat.prototype.startSlideTo = function (x, y, z) {
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
	this.stepSlideTo(xyz);
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
	this.contentSVG.setAttribute("viewBox", "" + x + " " + y + " " + w + " " + h + "");
	this.reLayoutVertical();
	//this.reLayoutBackGroundImge();
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
};
RiffShareFlat.prototype.__reLayoutBackGroundImge = function () {
	//var zdiff=this.maxZoom-this.minZoom;

	var rw = this.contentDiv.clientWidth / this.bgImageWidth;
	var rh = this.contentDiv.clientHeight / this.bgImageHeight;

	var rz = rw;
	if (rw < rh) {
		rz = rh;
	}
	//3-1
	//20-
	var r = (1 + 0.5 * (this.maxZoom - this.translateZ) / (this.maxZoom - this.minZoom));
	rz = rz * r;
	x = -this.translateX / r;
	if (this.translateX > 0) {
		x = -this.translateX;
	}
	y = -this.translateY / r;
	if (this.translateY > 0) {
		y = -this.translateY;
	}
	var z = rz * this.translateZ;
	console.log(-this.translateX, x);
	var transformAttr = ' translate(' + x + ',' + y + ') scale(' + z + ')';
	this.bgImage.setAttribute('transform', transformAttr);
}
RiffShareFlat.prototype._reLayoutBackGroundImge = function () {
	var rz = 1;

	var w = this.innerWidth;
	var h = this.innerHeight;

	//var rw =
	console.log(w, this.bgImageWidth * this.translateZ);

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
	x = -this.translateX;
	y = -this.translateY;
	/*
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
	}*/
	var z = rz * this.translateZ;
	var transformAttr = ' translate(' + x + ',' + y + ') scale(' + z * rz + ')';
	//console.log(transformAttr);
	this.bgImage.setAttribute('transform', transformAttr);
};
RiffShareFlat.prototype.resetAllLayersNow = function () {
	this.clearLayerChildren([this.contentGroup]);
	this.clearSpots();
	this.resetSize();
	this.resetTiles();
};
RiffShareFlat.prototype.queueTiles = function () {
	//console.log('queueTiles', this.timeOutID);
	if (this.timeOutID > 0) {
		return;
	}
	this.timeOutID = setTimeout(function () {
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
	this.clearUselessDetails(x, y, w, h, this.contentGroup);
	this.addSmallTiles(x, y, w, h);
};
RiffShareFlat.prototype.startPlay = function () {
	if (this.onAir) {
		console.log('on air already');
		return;
	}
	console.log('startPlay');
	this.onAir = true;
	this.resetNodeValues();
	/*var N = 4 * 60 / this.tempo;
	var beatLen = 1 / 16 * N;
	var pieceLen = this.cauntMeasures() * N;
	var when=this.audioContext.currentTime;
	this.sendNextPiece(when);
	this.queueNextPiece(pieceLen/2,when+pieceLen);*/
	//this.tickID = 0;
	//this.queueNextPiece(this.audioContext.currentTime, 0);
	this.nextBeat=0;
	this.nextWhen=0;
	this.queueNextBeats();
	//this.tickID
	//this.onAir
};
//sendNextBeats
RiffShareFlat.prototype.queueNextBeats = function () {
	//console.log('queueNextBeats', this.nextWhen,this.audioContext.currentTime);
	if (this.onAir) {
		var beat16duration = (4 * 60 / this.tempo)/16;
		var pieceLen16 = 16 * riffshareflat.cauntMeasures();
		var t=this.audioContext.currentTime;
		if(this.nextWhen<t){
			this.nextWhen=t;
		}
		while(this.sentWhen<t+this.queueAhead){
			this.sendNextBeats(this.nextWhen, this.nextBeat, this.nextBeat);
			this.nextWhen=this.sentWhen+beat16duration;
			this.nextBeat=this.nextBeat+1;
			if(this.nextBeat>=pieceLen16){
				this.nextBeat=0;
			}
		}
		//console.log('	envelopes', this.player.envelopes.length);
		var wait = 0.5 * 1000 * (this.nextWhen - this.audioContext.currentTime);
		this.moveBeatCounter();
		this.tickID = setTimeout(function () {
				riffshareflat.queueNextBeats();
			}, wait);
	}
}
RiffShareFlat.prototype.moveBeatCounter = function () {
	if (this.onAir) {
		if (this.counterLine) {
			var N = 4 * 60 / this.tempo;
			var beatLen = 1 / 16 * N;
			var c16 = 16 * this.cauntMeasures();
			var diff = this.nextBeat + (this.audioContext.currentTime - this.nextWhen) / beatLen;
			while (diff < 0) {
				diff = diff + c16;
			}
			var x = diff * this.tapSize;
			var transformAttr = ' translate(' + x + ',0)';
			this.counterLine.setAttribute('transform', transformAttr);
		}
	}
};

RiffShareFlat.prototype.stopPlay = function () {
	this.onAir = false;
	clearTimeout(this.tickID);
	this.player.cancelQueue(this.audioContext);
	this.resetAllLayersNow();
};
RiffShareFlat.prototype.resetNodeValues = function () {
	for (var i = 0; i < 8; i++) {
		this.trackInfo[i].audioNode.gain.value = this.trackInfo[i].volume / 100;
		this.drumInfo[i].audioNode.gain.value = this.drumVolumes[i] / 100;
	}
	this.master.band32.gain.value = this.equalizer[0];
	this.master.band64.gain.value = this.equalizer[1];
	this.master.band128.gain.value = this.equalizer[2];
	this.master.band256.gain.value = this.equalizer[3];
	this.master.band512.gain.value = this.equalizer[4];
	this.master.band1k.gain.value = this.equalizer[5];
	this.master.band2k.gain.value = this.equalizer[6];
	this.master.band4k.gain.value = this.equalizer[7];
	this.master.band8k.gain.value = this.equalizer[8];
	this.master.band16k.gain.value = this.equalizer[9];
	//this.master.output.gain.value = 0.1;
};
RiffShareFlat.prototype.cauntMeasures = function () {
	var mx = 0;
	for (var i = 0; i < this.storeDrums.length; i++) {
		if (mx < this.storeDrums[i].beat) {
			mx = this.storeDrums[i].beat;
		}
	}
	for (var i = 0; i < this.storeTracks.length; i++) {
		if (mx < this.storeTracks[i].beat) {
			mx = this.storeTracks[i].beat;
		}
	}
	var le = Math.ceil((mx + 1) / 16);
	return le;
}
RiffShareFlat.prototype.sendNextBeats = function (when, startBeat, endBeat) {
	//console.log('sendNextMeasure', when, startBeat, endBeat);
	this.sentWhen = when;
	this.sentBeat = startBeat;
	var N = 4 * 60 / this.tempo;
	var beatLen = 1 / 16 * N;

	for (var i = 0; i < this.storeDrums.length; i++) {
		var hit = this.storeDrums[i];
		if (hit.beat >= startBeat && hit.beat <= endBeat) {
			var channel = this.drumInfo[hit.drum];
			this.player.queueWaveTable(this.audioContext, channel.audioNode, channel.sound, when + beatLen * (hit.beat - startBeat), channel.pitch, channel.length, channel.volumeRatio);
		}
	}

	for (var i = 0; i < this.storeTracks.length; i++) {
		var note = this.storeTracks[i];
		if (note.beat >= startBeat && note.beat <= endBeat) {
			var channel = this.trackInfo[7 - note.track];
			var shift = [{
					when: note.length * beatLen,
					pitch: note.shift + channel.octave * 12 + note.pitch
				}
			];
			this.player.queueWaveTable(this.audioContext, channel.audioNode, channel.sound, when + beatLen * (note.beat - startBeat), channel.octave * 12 + note.pitch, note.length * beatLen, channel.volumeRatio, shift);
		}
	}
};

RiffShareFlat.prototype.addSmallTiles = function (left, top, width, height) {
	var x = 0;
	var y = 0;
	var w = this.innerWidth;
	var h = this.innerHeight;
	var g = this.rakeGroup(x, y, w, h, 'grdlin', this.paneGroup, left, top, width, height);
	if (g) {
		//this.tileRectangle(g, 0, 0, this.innerWidth, this.innerHeight, 'rgba(0,0,0,0.8)');
		//this.tileText(g, x - this.tapSize * 0.5, y + this.tapSize * 4, this.tapSize * 7, 'RiffShare', '#333');

		this.tileCircle(g, 6 * this.tapSize, 6 * this.tapSize, 5 * this.tapSize, '#999');
		var startLabel = 'Play';
		if (this.onAir) {
			startLabel = 'Stop';
		}
		this.tileText(g, 4 * this.tapSize, y + this.tapSize * 9, this.tapSize * 10, startLabel, '#fff');
		this.addSpot('plybt', 0, 1 * this.tapSize, this.leftMargin  * this.tapSize, this.tapSize * 10, function () {
			if (riffshareflat.onAir) {
				riffshareflat.stopPlay();
			} else {
				riffshareflat.startPlay();
			}
		});
		/*
		this.tileCircle(g, 1.5 * this.tapSize, (9 + 1.5 * 1) * this.tapSize, 0.5 * this.tapSize, '#999');
		this.tileText(g, 2.5 * this.tapSize, y + this.tapSize * (9.3 + 1.5 * 1), this.tapSize * 0.9, 'Save & Share', '#fff');
		this.addSpot('svsh', 1 * this.tapSize, (8.5 + 1.5 * 1) * this.tapSize, (this.leftMargin - 2) * this.tapSize, this.tapSize, function () {
		window.open('export.html', '_self')
		});*/
		this.tileCircle(g, 4 * this.tapSize, 15 * this.tapSize, 3 * this.tapSize, '#999');
		this.tileText(g, 3 * this.tapSize, y + this.tapSize * 17, 7*this.tapSize, 'File', '#fff');
		this.addSpot('flop', 0, 12 * this.tapSize, this.leftMargin * this.tapSize, this.tapSize*6, function () {
			window.open('file.html', '_self')
		});
		this.tileCircle(g, 3 * this.tapSize, 21 * this.tapSize, 2 * this.tapSize, '#999');
		this.tileText(g, 2.5 * this.tapSize, y + this.tapSize * 22, 4*this.tapSize, 'Clear all', '#fff');
		this.addSpot('clrsng', 0, 19 * this.tapSize, this.leftMargin * this.tapSize, 4*this.tapSize, function () {
			riffshareflat.userActionClearAll();
		});

		this.tileCircle(g, 7 * this.tapSize, 52 * this.tapSize, 0.5 * this.tapSize, this.findTrackInfo(0).color);
		this.tileText(g, 7 * this.tapSize, y + this.tapSize * 52.3, this.tapSize * 1.0, 'Swap with ' + this.findTrackInfo(1).title, this.findTrackInfo(1).color);
		this.addSpot('swp', 6.5 * this.tapSize, 51.5 * this.tapSize, (this.leftMargin - 7.5) * this.tapSize, this.tapSize, function () {
			//console.log(riffshareflat.findTrackInfo(0).title,'<->',riffshareflat.findTrackInfo(1).title);
			riffshareflat.userActionSwap(); //riffshareflat.findTrackInfo(0).nn,riffshareflat.findTrackInfo(1).nn);
		});
		/*this.tileCircle(g, 7 * this.tapSize, 51.5 * this.tapSize, 0.5 * this.tapSize, '#999');
		this.tileText(g, 8 * this.tapSize, y + this.tapSize * 51.8, this.tapSize * 0.9, 'Transpose down', this.findTrackInfo(0).color);
		this.addSpot('trdwn', 6.5 * this.tapSize, 51 * this.tapSize, (this.leftMargin - 2) * this.tapSize, this.tapSize, function () {
		console.log('trdwn');
		});
		this.tileCircle(g, 7 * this.tapSize, 50.5 * this.tapSize, 0.5 * this.tapSize, '#999');
		this.tileText(g, 8 * this.tapSize, y + this.tapSize * 50.8, this.tapSize * 0.9, 'Transpose up', this.findTrackInfo(0).color);
		this.addSpot('trupp', 6.5 * this.tapSize, 50 * this.tapSize, (this.leftMargin - 2) * this.tapSize, this.tapSize, function () {
		console.log('trupp');
		});*/

	}

	this.tileEqualizer(left, top, width, height);
	this.tileDrumVolumes(left, top, width, height);
	this.tileToneVolumes(left, top, width, height);
	this.tileTempo(left, top, width, height);
	this.tilePianoLines(left, top, width, height);
	this.tileCounter(left, top, width, height);

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
	var x = this.tapSize * (this.marginLeft + n * 16);
	var y = this.tapSize * (this.marginTop + 12 * 5);
	var w = this.tapSize * 16;
	var h = this.tapSize * 8;
	var g = this.rakeGroup(x, y, w, h, 'drms' + n, this.drumGroup, left, top, width, height);
	if (g) {
		var track = this.findTrackInfo(0);
		this.tileText(g, x + this.tapSize * 13, y + this.tapSize * 2.5, this.tapSize * 3, '' + (n + 1), track.color);
		for (var i = 0; i < 8; i++) {
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
				var xx = x + this.tapSize * (0.5 + this.storeDrums[i].beat - n * 16);
				var yy = y + this.tapSize * (0.5 + this.storeDrums[i].drum);
				this.tileLine(g, xx, yy, 1 + xx, yy, '#fff', this.tapSize);
			}
		}
	}
};
RiffShareFlat.prototype.existsDrum = function (beat, drum) {
	for (var i = 0; i < this.storeDrums.length; i++) {
		if (this.storeDrums[i].beat == beat && this.storeDrums[i].drum == drum) {
			return true;
		}
	}
	return false;
}
RiffShareFlat.prototype.dropDrum = function (beat, drum) {
	for (var i = 0; i < this.storeDrums.length; i++) {
		if (this.storeDrums[i].beat == beat && this.storeDrums[i].drum == drum) {
			this.storeDrums.splice(i, 1);
			break;
		}
	}
}
RiffShareFlat.prototype.setDrum = function (beat, drum) {
	this.dropDrum(beat, drum);
	this.storeDrums.push({
		beat: beat,
		drum: drum
	});
}
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
			this.tileRectangle(g, x, y + this.tapSize * (7 + i * 12), w, this.tapSize * 0.9, 'rgba(255,255,255,0.1)');
			this.tileRectangle(g, x, y + this.tapSize * (9 + i * 12), w, this.tapSize * 0.9, 'rgba(255,255,255,0.1)');
			this.tileRectangle(g, x, y + this.tapSize * (11 + i * 12), w, this.tapSize * 0.9, 'rgba(255,255,255,0.1)');
		}

		for (var i = 1; i < 16 * 16; i++) {
			this.tileRectangle(g, x + this.tapSize * i, y, this.tapSize * 0.03, this.tapSize * 5 * 12, 'rgba(0,0,0,0.75)');
		}
		var track = this.findTrackInfo(0);
		for (var i = 0; i < 4; i++) {
			this.tileRectangle(g, x, y + this.tapSize * (11.94 + i * 12), w, this.tapSize * 0.03, track.color);
		}
		for (var i = 16; i < 16 * 16; i = i + 16) {
			this.tileRectangle(g, x + this.tapSize * i, y, this.tapSize * 0.03, this.tapSize * (8 + 5 * 12), track.color);
		}
	}
};
RiffShareFlat.prototype.tileDrums = function (left, top, width, height) {
	for (var i = 0; i < 16; i++) {
		this.tileDrumMeasure(i, left, top, width, height);
	}
	this.addSpot('drumSpot', this.tapSize * this.marginLeft, this.tapSize * (this.marginTop + 12 * 5), this.tapSize * 16 * 16, this.tapSize * 8, function () {
		var beat = Math.floor((riffshareflat.clickContentX - riffshareflat.tapSize * riffshareflat.marginLeft) / riffshareflat.tapSize);
		var drum = Math.floor((riffshareflat.clickContentY - riffshareflat.tapSize * (riffshareflat.marginTop + 12 * 5)) / riffshareflat.tapSize);
		if (riffshareflat.existsDrum(beat, drum)) {
			riffshareflat.userActionDropDrum(beat, drum);
		} else {
			riffshareflat.userActionAddDrum(beat, drum);
		}
	});
};
RiffShareFlat.prototype.findNote = function (beat, pitch, track) {
	for (var i = 0; i < this.storeTracks.length; i++) {
		if (this.storeTracks[i].track == track && this.storeTracks[i].pitch == pitch && this.storeTracks[i].beat == beat) {
			return this.storeTracks[i];
		}
	}
	return null;
};
RiffShareFlat.prototype.dropNote = function (beat, pitch, track) {
	for (var i = 0; i < this.storeTracks.length; i++) {
		if (this.storeTracks[i].track == track && this.storeTracks[i].pitch == pitch && this.storeTracks[i].beat == beat) {
			this.storeTracks.splice(i, 1);
			break;
		}
	}
};
RiffShareFlat.prototype.addNote = function (beat, pitch, track, length, shift) {
	this.storeTracks.push({
		beat: beat,
		pitch: pitch,
		track: track,
		length: length,
		shift: shift
	});
};
RiffShareFlat.prototype.tilePartTones = function (measure, octave, track, left, top, width, height) {
	var x = this.tapSize * (this.marginLeft + 16 * measure);
	var y = this.tapSize * (this.marginTop + 12 * (4 - octave));
	var w = this.tapSize * 16;
	var h = this.tapSize * 12;
	var g = this.rakeGroup(x, y, w, h, 'tnOm' + measure + 'x' + octave + 'x' + track.nn, this.trackGroups[track.order], left, top, width, height);
	if (g) {
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
								if (track.order > 0) {
									this.tileLine(g, xx, yy, 1 + xx + this.tapSize * le, yy - this.tapSize * p.shift, track.shadow, r);
								} else {
									this.tileLine(g, xx, yy, 1 + xx + this.tapSize * le, yy - this.tapSize * p.shift, track.color, r);
									this.tileCircle(g, xx, yy, this.tapSize / 5, '#000');
								}
							}
						}
					}
				}
			}
		}
	}
};

RiffShareFlat.prototype.tileCounter = function (left, top, width, height) {
	if (this.onAir) {
		var x = this.tapSize * this.marginLeft;
		var y = 0;
		var w = this.innerWidth;
		var h = this.innerHeight;
		var g = this.rakeGroup(x, y, w, h, 'cntr', this.counterGroup, left, top, width, height);
		if (g) {
			this.tileRectangle(g, 0, 0, this.tapSize * 0.001, this.tapSize * 0.001, '#000');
			this.tileRectangle(g, this.innerWidth, this.innerHeight, this.tapSize * 0.001, this.tapSize * 0.001, '#000');

			this.counterLine = this.tileRectangle(g, x + this.tapSize * 0.3, y, this.tapSize * 0.4, h, this.findTrackInfo(0).color);
		}
	}
};
RiffShareFlat.prototype.tileTones = function (left, top, width, height) {
	for (var m = 0; m < 16; m++) {
		for (var o = 0; o < 5; o++) {
			for (var t = 0; t < 8; t++) {
				this.tilePartTones(m, o, this.findTrackInfo(7 - t), left, top, width, height);
			}
		}
	}
	if (this.mark) {
		var x = this.tapSize * (this.marginLeft + this.mark.beat);
		var y = this.tapSize * (this.marginTop + 12 * 5 - this.mark.pitch - 1);
		var w = this.tapSize;
		var h = this.tapSize;
		var g = this.rakeGroup(x, y, w, h, 'mrk', this.upperGroup, left, top, width, height);
		if (g) {
			this.tileCircle(g, x + this.tapSize * 0.5, y + this.tapSize * 0.5, this.tapSize / 3, '#fff');
		}
	}
	this.addSpot('toneSpot', this.tapSize * this.marginLeft, this.tapSize * this.marginTop, this.tapSize * 16 * 17, this.tapSize * 12 * 5, function () {
		var beat = Math.floor((riffshareflat.clickContentX - riffshareflat.tapSize * riffshareflat.marginLeft) / riffshareflat.tapSize);
		var pitch = 60 - Math.floor((riffshareflat.clickContentY - riffshareflat.tapSize * riffshareflat.marginTop) / riffshareflat.tapSize) - 1;
		var nn = riffshareflat.findTrackInfo(0).nn;
		if (riffshareflat.findNote(beat, pitch, nn)) {
			riffshareflat.userActionDropNote(beat, pitch, nn);
		} else {
			if (riffshareflat.mark) {
				var abeat = riffshareflat.mark.beat;
				var alength = beat - riffshareflat.mark.beat + 1;
				var apitch = riffshareflat.mark.pitch;
				var ashift = pitch - riffshareflat.mark.pitch;
				if (abeat > beat) {
					abeat = beat;
					alength = riffshareflat.mark.beat + 1 - beat;
					apitch = pitch;
					ashift = riffshareflat.mark.pitch - pitch;
				}
				riffshareflat.userActionAddNote(abeat, apitch, nn, alength, ashift);
				riffshareflat.mark = null;
			} else {
				if (beat < 16 * 16) {
					riffshareflat.mark = {
						beat: beat,
						pitch: pitch
					};
				}
			}
		}

	});
};
RiffShareFlat.prototype.tileTempo = function (left, top, width, height) {
	var x = this.tapSize * (this.marginLeft - 12);
	var y = this.tapSize * (this.marginTop + 12 * 5 - 36 + 1);
	var w = this.tapSize * 12;
	var h = this.tapSize * 8;
	var g = this.rakeGroup(x, y, w, h, 'tmpo', this.textGroup, left, top, width, height);
	var cw = 11 / 8;
	if (g) {
		this.tileRectangle(g, x, y + this.tapSize * 0, this.tapSize * 11, this.tapSize * 0.9, 'rgba(255,255,255,0.5)');
		this.tileRectangle(g, x, y + this.tapSize * 0, this.tapSize * cw * (this.tempo - 60) / 20, this.tapSize * 0.9, 'rgba(255,255,255,0.9)');
		this.tileText(g, x - this.tapSize * 5.5, y + this.tapSize * 0.75, this.tapSize, 'Tempo ' + this.tempo + ' bpm', '#ffffff');
		for (var i = 0; i < 8; i++) {
			var s = this.addSpot('tempo' + i, x + this.tapSize * cw * i, y, this.tapSize * cw, this.tapSize, function () {
					riffshareflat.userActionTempo(this.tempo);
				});
			s.tempo = i * 20 + 80;
		}
	}
};
RiffShareFlat.prototype.findTrackInfo = function (order) {
	//console.log(this.trackInfo);
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
	for (var i = 0; i < 8; i++) {
		if (this.trackInfo[i].order < track.order) {
			this.trackInfo[i].order++;
		}
	}
	track.order = 0;
};
RiffShareFlat.prototype.tileToneVolumes = function (left, top, width, height) {
	var x = this.tapSize * (this.marginLeft - 18);
	var y = this.tapSize * (this.marginTop + 12 * 5 - 11);
	var w = this.tapSize * 12;
	var h = this.tapSize * 8;
	var g = this.rakeGroup(x, y, w, h, 'tnvlm', this.linesGroup, left, top, width, height);
	var sk = 0;
	if (g) {
		for (var i = 0; i < 8; i++) {
			var track = this.findTrackInfo(i);
			if (i > 0) {
				sk = 2;
				//this.tileRectangle(g, x + this.tapSize * (0 + 6), y + this.tapSize * (i + sk), this.tapSize * 11, this.tapSize * 0.9, 'rgba(255,255,255,0.3)');
				this.tileRectangle(g, x + this.tapSize * 6, y + this.tapSize * (i + sk), this.tapSize * (1 + track.volume / 10), this.tapSize * 0.9, track.color);
				this.tileCircle(g, x + this.tapSize * 1, y + this.tapSize * (i + 0.5 + sk), this.tapSize * 0.5, '#fff');
				var s = this.addSpot('up' + i, x + this.tapSize * 0.0, y + this.tapSize * (i + 0.2 + sk), this.tapSize * 17, this.tapSize * 1, function () {
						riffshareflat.userActionUpTrack(this.order);
					});
				s.order = i;
				this.tileText(g, x + this.tapSize * 1, y + this.tapSize * (i + 0.75 + sk), this.tapSize * 1.0, track.title, track.color);
				/*for (var v = 0; v < 11; v++) {
				var s = this.addSpot('volton' + i + 'x' + v, x + this.tapSize * (6 + v), y + this.tapSize * (i + sk), this.tapSize, this.tapSize, function () {
				riffshareflat.userActionToneVolume(this.track, this.volume);
				});
				s.track = track;
				s.volume = v * 10;
				}*/
			} else {
				this.tileRectangle(g, x + this.tapSize * (0 + 6), y + this.tapSize * (i + sk), this.tapSize * 11, this.tapSize * 0.9, 'rgba(255,255,255,0.3)');
				this.tileRectangle(g, x + this.tapSize * 6, y + this.tapSize * (i + sk), this.tapSize * (1 + track.volume / 10), this.tapSize * 0.9, track.color);
				this.tileCircle(g, x + this.tapSize * 1, y + this.tapSize * (i + 0.5 + sk), this.tapSize * 0.5, '#fff');
				/*var s = this.addSpot('up' + i, x + this.tapSize * 0.0, y + this.tapSize * (i + 0.2 + sk), this.tapSize * 5, this.tapSize * 1, function () {
				riffshareflat.userActionUpTrack(this.order);
				});
				s.order = i;*/
				this.tileText(g, x + this.tapSize * 1, y + this.tapSize * (i + 0.75 + sk), this.tapSize * 1.0, track.title, track.color);
				for (var v = 0; v < 11; v++) {
					var s = this.addSpot('volton' + i + 'x' + v, x + this.tapSize * (6 + v), y + this.tapSize * (i + sk), this.tapSize, this.tapSize, function () {
							riffshareflat.userActionToneVolume(this.track, this.volume);
						});
					s.track = track;
					s.volume = v * 10;
				}
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
			this.tileRectangle(g, x + this.tapSize * 6, y + this.tapSize * i, this.tapSize * 11, this.tapSize * 0.9, 'rgba(255,255,255,0.3)');
			var n = this.drumVolumes[i] / 10;
			this.tileRectangle(g, x + this.tapSize * 6, y + this.tapSize * i, this.tapSize * (1 + n), this.tapSize * 0.9, 'rgba(255,255,255,0.9)');
			for (var v = 0; v < 11; v++) {
				var s = this.addSpot('voldru' + i + 'x' + v, x + this.tapSize * (6 + v), y + this.tapSize * i, this.tapSize, this.tapSize, function () {
						riffshareflat.userActionDrumVolume(this.drum, this.volume);
					});
				s.drum = i;
				s.volume = v * 10;
			}
			this.tileText(g, x + this.tapSize * 0.5, y + this.tapSize * (i + 0.75), this.tapSize, this.drumInfo[i].title, '#ffffff');
		}
		/*
		this.tileText(g, x + this.tapSize * 0.5, y + this.tapSize * 0.75, this.tapSize * 0.9, 'Bass drum', '#ffffff');
		this.tileText(g, x + this.tapSize * 0.5, y + this.tapSize * 1.75, this.tapSize * 0.9, 'Low tom', '#ffffff');
		this.tileText(g, x + this.tapSize * 0.5, y + this.tapSize * 2.75, this.tapSize * 0.9, 'Snare drum', '#ffffff');
		this.tileText(g, x + this.tapSize * 0.5, y + this.tapSize * 3.75, this.tapSize * 0.9, 'Mid Tom', '#ffffff');
		this.tileText(g, x + this.tapSize * 0.5, y + this.tapSize * 4.75, this.tapSize * 0.9, 'Closed Hi-hat', '#ffffff');
		this.tileText(g, x + this.tapSize * 0.5, y + this.tapSize * 5.75, this.tapSize * 0.9, 'Open Hi-hat', '#ffffff');
		this.tileText(g, x + this.tapSize * 0.5, y + this.tapSize * 6.75, this.tapSize * 0.9, 'Ride Cymbal', '#ffffff');
		this.tileText(g, x + this.tapSize * 0.5, y + this.tapSize * 7.75, this.tapSize * 0.9, 'Splash Cymbal', '#ffffff');
		 */
	}
};
RiffShareFlat.prototype.tileEqualizer = function (left, top, width, height) {
	var x = this.tapSize * (this.marginLeft - 17.5);
	var y = this.tapSize * (this.marginTop + 12 * 5 - 34 + 1);
	var w = this.tapSize * 10;
	var h = this.tapSize * 21;
	var sz = 1.65;
	var g = this.rakeGroup(x, y, w, h, 'eqlzr', this.textGroup, left, top, width, height);
	if (g) {
		for (var i = 0; i < 10; i++) {
			this.tileRectangle(g, x + this.tapSize * i * sz, y, this.tapSize * 0.95 * sz, this.tapSize * 21, 'rgba(255,255,255,0.3)');
			var n = this.equalizer[i];
			var ey = n < 0 ? y + this.tapSize * 10 : y + this.tapSize * 10 - this.tapSize * n;
			this.tileRectangle(g, x + this.tapSize * i * sz, ey, this.tapSize * 0.95 * sz, this.tapSize * (1 + Math.abs(n)), 'rgba(255,255,255,0.9)');
			for (var v = -10; v <= 10; v++) {
				var s = this.addSpot('eq' + i + 'x' + v, x + this.tapSize * i * sz, y - this.tapSize * (v - 10), this.tapSize * 0.95 * sz, this.tapSize, function () {
						riffshareflat.userActionEqualizer(this.band, this.volume);
					});
				s.band = i;
				s.volume = v;
			}
		}
		this.tileText(g, x + this.tapSize * (0 * sz + 0.3), y + this.tapSize * 10.75, this.tapSize * 0.75, '65', '#000');
		this.tileText(g, x + this.tapSize * (1 * sz + 0.3), y + this.tapSize * 10.75, this.tapSize * 0.75, '125', '#000');
		this.tileText(g, x + this.tapSize * (2 * sz + 0.3), y + this.tapSize * 10.75, this.tapSize * 0.75, '250', '#000');
		this.tileText(g, x + this.tapSize * (3 * sz + 0.3), y + this.tapSize * 10.75, this.tapSize * 0.75, '500', '#000');
		this.tileText(g, x + this.tapSize * (4 * sz + 0.3), y + this.tapSize * 10.75, this.tapSize * 0.75, '1k', '#000');
		this.tileText(g, x + this.tapSize * (5 * sz + 0.3), y + this.tapSize * 10.75, this.tapSize * 0.75, '1k', '#000');
		this.tileText(g, x + this.tapSize * (6 * sz + 0.3), y + this.tapSize * 10.75, this.tapSize * 0.75, '2k', '#000');
		this.tileText(g, x + this.tapSize * (7 * sz + 0.3), y + this.tapSize * 10.75, this.tapSize * 0.75, '4k', '#000');
		this.tileText(g, x + this.tapSize * (8 * sz + 0.3), y + this.tapSize * 10.75, this.tapSize * 0.75, '8k', '#000');
		this.tileText(g, x + this.tapSize * (9 * sz + 0.3), y + this.tapSize * 10.75, this.tapSize * 0.75, '16k', '#000');
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
	) {
		return false;
	} else {
		return true;

	}
};
RiffShareFlat.prototype.resetSize = function () {
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
	return rect;
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
RiffShareFlat.prototype.clearLayerChildren = function (layers) {
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
			riffshareflat.mark = null;
		},
		redo: function () {
			riffshareflat.setTrackOrders(after);
			riffshareflat.mark = null;
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
			riffshareflat.mark = null;
			riffshareflat.resetNodeValues();
		},
		redo: function () {
			track.volume = volume;
			riffshareflat.setTrackOrders(after);
			riffshareflat.mark = null;
			riffshareflat.resetNodeValues();
		}
	});
};
RiffShareFlat.prototype.userActionDrumVolume = function (nn, volume) {
	var old = this.drumVolumes[nn];
	riffshareflat.pushAction({
		caption: 'Volume ' + volume + ' for drum ' + nn,
		undo: function () {
			riffshareflat.drumVolumes[nn] = old;
			riffshareflat.resetNodeValues();
		},
		redo: function () {
			riffshareflat.drumVolumes[nn] = volume;
			riffshareflat.resetNodeValues();
		}
	});
};
RiffShareFlat.prototype.userActionTempo = function (tempo) {
	var old = this.tempo;
	riffshareflat.pushAction({
		caption: 'Tempo ' + tempo,
		undo: function () {
			riffshareflat.tempo = old;
		},
		redo: function () {
			riffshareflat.tempo = tempo;
		}
	});
};
RiffShareFlat.prototype.userActionEqualizer = function (band, volume) {
	var old = this.equalizer[band];
	riffshareflat.pushAction({
		caption: 'Equalizer ' + band + ' = ' + volume,
		undo: function () {
			riffshareflat.equalizer[band] = old;
			riffshareflat.resetNodeValues();
		},
		redo: function () {
			riffshareflat.equalizer[band] = volume;
			riffshareflat.resetNodeValues();
		}
	});
};
RiffShareFlat.prototype.userActionAddDrum = function (beat, drum) {
	riffshareflat.pushAction({
		caption: 'Add drum ' + drum + ' to ' + beat,
		undo: function () {
			riffshareflat.dropDrum(beat, drum);
		},
		redo: function () {
			riffshareflat.setDrum(beat, drum);
		}
	});
};
RiffShareFlat.prototype.userActionDropDrum = function (beat, drum) {
	riffshareflat.pushAction({
		caption: 'Drop drum ' + drum + ' from ' + beat,
		undo: function () {
			riffshareflat.setDrum(beat, drum);
		},
		redo: function () {
			riffshareflat.dropDrum(beat, drum);
		}
	});
};
RiffShareFlat.prototype.userActionAddNote = function (beat, pitch, track, length, shift) {
	riffshareflat.pushAction({
		caption: 'Add note ' + beat + '/' + pitch + '/' + track + '/' + length + '/' + shift,
		undo: function () {
			riffshareflat.dropNote(beat, pitch, track);
		},
		redo: function () {
			riffshareflat.addNote(beat, pitch, track, length, shift);
		}
	});
};
RiffShareFlat.prototype.userActionDropNote = function (beat, pitch, track) {
	var old = this.findNote(beat, pitch, track);
	riffshareflat.pushAction({
		caption: 'Drop note ' + beat + '/' + pitch + '/' + track,
		undo: function () {
			riffshareflat.addNote(old.beat, old.pitch, old.track, old.length, old.shift);
		},
		redo: function () {

			riffshareflat.dropNote(beat, pitch, track);
		}
	});
};
RiffShareFlat.prototype.userActionSwap = function () {
	//console.log(riffshareflat.findTrackInfo(0).title,'<->',riffshareflat.findTrackInfo(1).title);
	var track0 = this.findTrackInfo(0);
	var track1 = this.findTrackInfo(1);
	var old = this.copyTones();
	var nw = this.copyTones();
	for (var i = 0; i < nw.length; i++) {
		if (nw[i].track == track0.nn) {
			nw[i].track = track1.nn;
		} else {
			if (nw[i].track == track1.nn) {
				nw[i].track = track0.nn;
			}
		}
	}
	//console.log(fromN, toN);
	var before = this.getTrackOrders();
	this.upTrack(track1.order);
	var after = this.getTrackOrders();
	riffshareflat.pushAction({
		caption: 'Swap ' + track1.title + ' with ' + track0.title,
		undo: function () {
			riffshareflat.storeTracks = old;
			riffshareflat.setTrackOrders(before);
			riffshareflat.mark = null;
		},
		redo: function () {
			riffshareflat.storeTracks = nw;
			riffshareflat.setTrackOrders(after);
			riffshareflat.mark = null;
		}
	});
};
RiffShareFlat.prototype.userActionClearAll = function () {
	this.saveState();
	addStateToHistory();
	var d = this.copyDrums();
	var t = this.copyTones();
	riffshareflat.pushAction({
		caption: 'Clear all',
		undo: function () {
			riffshareflat.storeDrums = d;
			riffshareflat.storeTracks = t;
			riffshareflat.mark = null;
		},
		redo: function () {
			riffshareflat.storeDrums = [];
			riffshareflat.storeTracks = [];
			riffshareflat.mark = null;
		}
	});
};
window.onload = function () {
	console.log('create riffshareflat');
	new RiffShareFlat();
	riffshareflat.init();
};
