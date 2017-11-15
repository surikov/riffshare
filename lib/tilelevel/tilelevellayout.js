TileLevel.prototype.resetInnerSize = function (w, h) {
	this.innerWidth = w;
	this.innerHeight = h;
	this.moveZoom();
};
TileLevel.prototype.moveZoom = function () {

	var x = -this.translateX;
	var y = -this.translateY;
	var w = this.svg.clientWidth * this.translateZ;
	var h = this.svg.clientHeight * this.translateZ;
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
	//console.log('moveZoom',x , y , w , h,'/',this.translateX,this.translateY,this.translateZ,this.tapSize);
	this.svg.setAttribute("viewBox", "" + x + " " + y + " " + w + " " + h + "");
	this.reStick();
};
TileLevel.prototype.reStick = function () {
	//console.log('reStick');
	for (var i = 0; i < this.layers.length; i++) {
		var x = 0;
		var y = 0;
		if (this.layers[i].lockVertical) {
			y = -this.translateY+this.layers[i].lockY*this.translateZ;
		}
		if (this.layers[i].lockHorizontal) {
			x = -this.translateX+this.layers[i].lockX*this.translateZ;
		}
		/*if((x)||(y)){
		this.layers[i].g.setAttribute('transform', 'translate(' + x + ','+y+')');

		}*/
		this.layers[i].g.setAttribute('transform', 'translate(' + x + ',' + y + ')');
		this.layers[i].g.calculatedX = x;
		this.layers[i].g.calculatedY = y;
	}
};
TileLevel.prototype.unzoom = function (x, y, z) {
	var xy = {
		x: x * z - this.translateX,
		y: y * z - this.translateY
	};
	if (this.svg.clientWidth * z > this.innerWidth) {
		xy.x = x * z - ((this.svg.clientWidth * z - this.innerWidth) / 2);
	}
	if (this.svg.clientHeight * z > this.innerHeight) {
		xy.y = y * z - ((this.svg.clientHeight * z - this.innerHeight) / 2);
	}
	xy.x = Math.round(xy.x);
	xy.y = Math.round(xy.y);
	return xy;
};
TileLevel.prototype.adjustContentPosition = function () {
	//console.log('adjustContentPosition');
	if (this.svg.clientWidth * this.translateZ < this.innerWidth) {
		if (this.translateX < this.svg.clientWidth * this.translateZ - this.innerWidth) {
			this.translateX = this.svg.clientWidth * this.translateZ - this.innerWidth;
		}
		if (this.translateX > 0) {
			this.translateX = 0;
		}
	} else {
		this.translateX = (this.svg.clientWidth * this.translateZ - this.innerWidth) / 2;
	}
	if (this.svg.clientHeight * this.translateZ < this.innerHeight) {
		if (this.translateY < this.svg.clientHeight * this.translateZ - this.innerHeight) {
			this.translateY = this.svg.clientHeight * this.translateZ - this.innerHeight;
		}
		if (this.translateY > 0) {
			this.translateY = 0;
		}
	} else {
		this.translateY = (this.svg.clientHeight * this.translateZ - this.innerHeight) / 2;
	}
	this.moveZoom();
};
TileLevel.prototype.vectorDistance = function (xy1, xy2) {
	var xy = this.vectorSubstract(xy1, xy2);
	var n = this.vectorNorm(xy);
	return n;
};
TileLevel.prototype.vectorSubstract = function (xy1, xy2) {
	return {
		x: xy1.x - xy2.x,
		y: xy1.y - xy2.y
	};
};
TileLevel.prototype.vectorNorm = function (xy) {
	return Math.sqrt(this.vectorNormSquared(xy));
};
TileLevel.prototype.vectorNormSquared = function (xy) {
	return xy.x * xy.x + xy.y * xy.y;
};
TileLevel.prototype.vectorFromTouch = function (touch) {
	return {
		x: touch.clientX,
		y: touch.clientY
	};
};
TileLevel.prototype.vectorFindCenter = function (xy1, xy2) {
	var xy = this.vectorAdd(xy1, xy2);
	return this.vectorScale(xy, 0.5);
};
TileLevel.prototype.vectorAdd = function (xy1, xy2) {
	return {
		x: xy1.x + xy2.x,
		y: xy1.y + xy2.y
	};
};
TileLevel.prototype.vectorScale = function (xy, coef) {
	return {
		x: xy.x * coef,
		y: xy.y * coef
	};
};


/*TileLevel.prototype.collision = function (x1, y1, w1, h1, x2, y2, w2, h2) {
	//console.log('collision',x1, y1, w1, h1, x2, y2, w2, h2);
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
};*/

TileLevel.prototype.maxZoom = function () {
	var mx = 1;
	if (this.renderers.length > 0) {
		mx = this.renderers[this.renderers.length - 1].zoom;
		//console.log('maxZoom',mx,this.renderers.length);
	}

	return mx;
};
TileLevel.prototype.startSlideTo = function (x, y, z) {
	//console.log('startSlideTo',x, y, z);
	var stepCount = 10;
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
TileLevel.prototype.stepSlideTo = function (xyz) {
	var n = xyz.shift();
	if (n) {
		this.translateX = n.x;
		this.translateY = n.y;
		this.translateZ = n.z;
		this.adjustContentPosition();
		var me = this;
		setTimeout(function () {
			me.stepSlideTo(xyz);
		}, 20);
	} else {
		this.resetAllLayersNow();
	}
};
TileLevel.prototype.resetAllLayersNow = function () {
	//console.log('resetAllLayersNow');
	this.clearAllLayersChildren();
	this.clearSpots();
	this.resetSize();
	this.resetTiles();
};
TileLevel.prototype.resetSize = function () {
	//console.log('resetSize');
	/*this.innerWidth = (this.marginLeft + this.marginRight + 16 * 16) * this.tapSize;
	this.innerHeight = (this.marginTop + this.marginBottom + 8 + 5 * 12 ) * this.tapSize;
	this.contentSVG.style.width = this.contentDiv.clientWidth + 'px';
	this.contentSVG.style.height = this.contentDiv.clientHeight + 'px';
	document.getElementById('undobutton').style.width = this.tapSize + 'px';
	document.getElementById('undobutton').style.height = this.tapSize + 'px';
	document.getElementById('redobutton').style.width = this.tapSize + 'px';
	document.getElementById('redobutton').style.height = this.tapSize + 'px';
	document.getElementById('redobutton').style.top = (5 * 2 + this.tapSize) + 'px';
	 */
	this.adjustContentPosition();
	this.queueTiles();
};
