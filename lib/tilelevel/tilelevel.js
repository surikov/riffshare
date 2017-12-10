console.log('tilelevel.js v1.01');


function TileLevel(svgid, groupid) {
	//window.tilelevel = this;
	this.contentGroup = document.getElementById(groupid);
	this.svgid = svgid;
	//this.svgns = "http://www.w3.org/2000/svg";
	this.translateX = 0;
	this.translateY = 0;
	this.translateZ = 1;
	this.zoomLevel = 0;
	//this.minZoom = 1;
	//this.maxZoom = 20;
	this.renderers=[];
	this.spots=[];
	this.layers=[];
	this.setupPane();
	this.setupTapSize();
	this.setupTouchMouse();
	//console.log('created',this);
	this.queueTiles();
	return this;
}
function RenderLayer() {
	this.svgns = "http://www.w3.org/2000/svg";
	this.placeHolder=false;
	this.lockX=0;
	this.lockY=0;
	return this;
};
TileLevel.prototype.collision = function (x1, y1, w1, h1, x2, y2, w2, h2) {
	//console.log('collision',x1, y1, w1, h1, x2, y2, w2, h2);
	if (this.collisionX(x1, w1, x2, w2) //
		&& this.collisionX(y1, h1, y2, h2) //
	) {
		return true;
	} else {
		return false;

	}
};
TileLevel.prototype.collisionX = function (x, w, left, width) {
	//console.log('collision',x1, y1, w1, h1, x2, y2, w2, h2);
	if (x + w < left //
		|| x > left + width //
	) {
		return false;
	} else {
		return true;

	}
};
TileLevel.prototype.collisionY = function (y, h, top, height) {
	//console.log('collisionY', y, h, top, height);
	if (y + h < top //
		|| y > top + height //
	) {
		return false;
	} else {
		return true;

	}
};
RenderLayer.prototype.renderGroup = function (x, y, w, h, id,  left, top, width, height,render) {
	var tg=null;
	if((!this.lockVertical) && (!this.lockHorizontal)){
		tg = this.tileGroup(x, y, w, h, id,  left, top, width, height);
	}else{
		if(this.lockVertical){
			tg = this.tileGroupY(x, w, id,  left, width);
		}else{
			if(this.lockHorizontal){
				tg = this.tileGroupX(y, h, id,  top, height);
			}
		}
	}
	/*if(!(this.kind)){
		if(this.kind==1){//column
			tg = this.tileGroupX(y, h, id,  top, height);
		}else{
			if(this.kind==2){//row
				tg = this.tileGroupY(x, w, id,  left, width);
			}
		}
	}else{
		tg = this.tileGroup(x, y, w, h, id,  left, top, width, height);
	}*/
	
	if (tg) {
		tg.x=x;
		tg.y=y;
		tg.w=w;
		tg.h=h;
		if(this.placeHolder){
			this.tileRectangle(tg.g, x, y, w, h, 'rgba(255,0,0,0)', 'rgba(255,0,0,0.25)', w*h/100000);
			this.tileText(tg.g, x, y+h, w*h/500000 * this.tapSize, ':'+id, 'rgba(255,0,0,0.25)');
		}
		render(tg);
	}
};
RenderLayer.prototype.tileGroupY = function (x, w, id,  left, width) {
	return this.tileGroup(x, 0, w, 0, id,  left, 0, width, 0);
};
RenderLayer.prototype.tileGroupX = function (y, h, id,  top, height) {
	return this.tileGroup(0, y, 0, h, id,  0, top, 0, height);
};
RenderLayer.prototype.tileGroup = function (x, y, w, h, id,  left, top, width, height) {
	var g = this.rakeGroup(x, y, w, h, id,  left, top, width, height);
	if (g) {
		return {
			x: x,
			y: y,
			w: w,
			h: h,
			layer:this
			,g: g
			,id:id
		};
	} else {
		return null;
	}
};
RenderLayer.prototype.rakeGroup = function (x, y, w, h, id,  left, top, width, height) {
	//
	var sx = 1;
	if (this.translateX < 0) {
		sx = -1;
	}
	var sy = 1;
	if (this.translateY < 0) {
		sy = -1;
	}
	//console.log('test collision',x - sx * layer.calculatedX, y - sy * layer.calculatedY, w, h, left, top, width, height);
	var c = true;
	if ((width) & (height)) {
		c = this.tiler.collision(x - sx *  this.g.calculatedX, y - sy * this.g.calculatedY, w, h, left, top, width, height);
	} else {
		if (width) {
			c = this.tiler.collisionX(x - sx * this.g.calculatedX, w, left, width);
		} else {
			//console.log('check',y,sy,layer.calculatedY);
			c = this.tiler.collisionY(y - sy *  this.g.calculatedY, h, top, height);
		}
	}



	if (c) {
		if (!this.childExists(id)) {
			var g = document.createElementNS(this.svgns, 'g');
			g.id = id;
			this.g.appendChild(g);
			return g;
		}
	}
	return null;
};
RenderLayer.prototype.childExists = function (id) {
	//console.log('childExists',id, layer);
	this.msEdgeHook( this.g);
	for (var i = 0; i <  this.g.children.length; i++) {
		var t =  this.g.children[i];
		if (t.id == id) {
			return true;
		}
	}
	return false;
};
RenderLayer.prototype.clearLayerChildren = function () {
	//var layer =this.g;
	this.msEdgeHook( this.g);
	while (this.g.children.length > 0) {
		this.g.removeChild(this.g.children[0]);
	}
	/*
	for (var n = 0; n <  this.g.children.length; n++) {
		var g =  this.g.children[n];
		this.msEdgeHook(g);
		while (g.children.length > 0) {
			g.removeChild(g.children[0]);
		}
	}*/
}
/*
RenderLayer.prototype.clearLayerChildren = function (layers) {
	for (var i = 0; i < layers.length; i++) {
		var layer = layers[i];
		this.msEdgeHook(layer);
		for (var n = 0; n < layer.children.length; n++) {
			var g = layer.children[n];
			this.msEdgeHook(g);
			while (g.children.length > 0) {
				g.removeChild(g.children[0]);
			}
		}
	}
};*/
RenderLayer.prototype.msEdgeHook = function (g) {
	if (g.childNodes && (!(g.children))) {
		g.children = g.childNodes;
		//console.log('try layer.children',layer.children);
	}
};
RenderLayer.prototype.clearUselessDetails = function (x, y, w, h){//, layer) {
	//console.log('clearUselessDetails',x, y, w, h);
	//var layer =this.g;
	this.msEdgeHook(this.g);
	for (var i = 0; i < this.g.children.length; i++) {
		var group = this.g.children[i];
		this.clearUselessNodes(x, y, w, h, group);
	}
};
//RenderLayer.prototype.clearUselessNodes = function (x, y, w, h, layer) {
RenderLayer.prototype.clearUselessNodes = function (x, y, w, h,group) {
	//var layer =this.g;
	this.msEdgeHook(group);
	if (this.outOfView(group, x, y, w, h)) {
		this.g.removeChild(group);
	}
	/*
	for (var i = 0; i < group.children.length; i++) {
		var t = group.children[i];
		if (this.outOfView(t, x, y, w, h)) {
			group.removeChild(t);
			i--;
		} else {
			//
		}
	}*/
};
RenderLayer.prototype.outOfView = function (child, x, y, w, h) {
	//console.log(child, x, y, w, h);
	var tbb = child.getBBox();
	return !(this.tiler.collision(tbb.x, tbb.y, tbb.width, tbb.height, x, y, w, h));
};

TileLevel.prototype.setupTapSize = function () {
	this.tapSize = 33;
	try {
		var pixelRatio = window.devicePixelRatio;
		this.tapSize = 31 * pixelRatio;
		if (isNaN(this.tapSize)) {
			this.tapSize = 51;
		}
	} catch (ex) {
		console.log(ex);
	}
};
TileLevel.prototype.setupPane = function () {
	this.svg = document.getElementById(this.svgid);
	this.svg.backlink = this;
	this.svg.setAttribute("viewBox", "0 0 100 100");
	this.innerWidth = this.svg.clientWidth;
	this.innerHeight = this.svg.clientHeight;
};
TileLevel.prototype.setupTouchMouse = function () {
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
	this.svg.addEventListener('mousedown', this.rakeMouseDown, false);
	this.svg.addEventListener("mousewheel", this.rakeMouseWheel, false);
	this.svg.addEventListener("DOMMouseScroll", this.rakeMouseWheel, false);
	this.svg.addEventListener("touchstart", this.rakeTouchStart, false);
	this.svg.addEventListener("touchmove", this.rakeTouchMove, false);
	this.svg.addEventListener("touchend", this.rakeTouchEnd, false);
};
TileLevel.prototype.addBaseLayer = function () {
	var layer=new RenderLayer();
	layer.tiler=this;
	layer.tapSize=this.tapSize;
	layer.g = document.createElementNS(layer.svgns, 'g');
	//layer.kind=0;
	layer.lockVertical=false;
	layer.lockHorizontal=false;
	this.contentGroup.appendChild(layer.g);
	layer.g.calculatedX=0;
	layer.g.calculatedY=0;
	this.layers.push(layer);
	return layer;
};
TileLevel.prototype.addColumnLayer = function () {
	var layer=new RenderLayer();
	layer.tiler=this;
	layer.tapSize=this.tapSize;
	layer.g = document.createElementNS(layer.svgns, 'g');
	//layer.kind=1;
	layer.lockVertical=false;
	layer.lockHorizontal=true;
	layer.lockX=0;
	this.contentGroup.appendChild(layer.g);
	layer.g.calculatedX=0;
	layer.g.calculatedY=0;
	this.layers.push(layer);
	return layer;
};
TileLevel.prototype.addRowLayer = function () {
	var layer=new RenderLayer();
	layer.tiler=this;
	layer.tapSize=this.tapSize;
	layer.g = document.createElementNS(layer.svgns, 'g');
	//layer.kind=2;
	layer.lockVertical=true;
	layer.lockHorizontal=false;
	layer.lockY=0;
	this.contentGroup.appendChild(layer.g);
	layer.g.calculatedX=0;
	layer.g.calculatedY=0;
	this.layers.push(layer);
	return layer;
};
/*TileLevel.prototype.addLayer = function (lockVertical,lockHorizontal) {
	var layer=new RenderLayer();
	layer.tapSize=this.tapSize;
	layer.g = document.createElementNS(layer.svgns, 'g');
	layer.lockVertical=lockVertical;
	layer.lockHorizontal=lockHorizontal;
	this.contentGroup.appendChild(layer.g);
	layer.g.calculatedX=0;
	layer.g.calculatedY=0;
	/*this.layers.push({
		g:g,lockVertical:lockVertical,lockHorizontal:lockHorizontal
	});*/
	/*this.layers.push(layer);
	return layer;
};*/
TileLevel.prototype.addZoomLevel = function (zoom,render) {
	this.renderers.push({
		zoom:zoom,render:render
	});
	this.renderers.sort(function (a, b) {
	  return a.zoom - b.zoom;
	});
	this.queueTiles();
};


TileLevel.prototype.setupTouchMouse = function () {
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
	this.svg.addEventListener('mousedown', this.rakeMouseDown, false);
	this.svg.addEventListener("mousewheel", this.rakeMouseWheel, false);
	this.svg.addEventListener("DOMMouseScroll", this.rakeMouseWheel, false);
	this.svg.addEventListener("touchstart", this.rakeTouchStart, false);
	this.svg.addEventListener("touchmove", this.rakeTouchMove, false);
	this.svg.addEventListener("touchend", this.rakeTouchEnd, false);
};
TileLevel.prototype.rakeMouseWheel = function (e) {
	e.preventDefault();
	var me=this.backlink;
	//var e = window.event || e;
	//console.log(e);
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
	/*if (zoom < me.minZoom) {
		zoom = me.minZoom;
	}
	if (zoom > me.maxZoom) {
		zoom = me.maxZoom;
	}*/
	//me.translateX = me.translateX - (me.translateZ - zoom) * e.layerX;
	//me.translateY = me.translateY - (me.translateZ - zoom) * e.layerY;
	me.translateX = me.translateX - (me.translateZ - zoom) * e.offsetX;
	me.translateY = me.translateY - (me.translateZ - zoom) * e.offsetY;
	me.translateZ = zoom;
	//console.log('set',me.translateX,me.translateY,me.translateZ);
	me.adjustContentPosition();
	me.queueTiles();
	//console.log(me.translateX,me.translateY,me.translateZ);
	return false;
};
TileLevel.prototype.rakeMouseDown = function (mouseEvent) {
	mouseEvent.preventDefault();
	//console.log('rakeMouseDown',this.backlink);
	var me=this.backlink;
	me.svg.addEventListener('mousemove', me.rakeMouseMove, true);
	me.svg.addEventListener('mouseup', me.rakeMouseUp, false);
	//window.addEventListener('mouseup', me.rakeMouseUp, false);
	//me.startMouseScreenX = mouseEvent.clientX;
	//me.startMouseScreenY = mouseEvent.clientY;
	me.startMouseScreenX = mouseEvent.offsetX;
	me.startMouseScreenY = mouseEvent.offsetY;
	me.clickX = me.startMouseScreenX;
	me.clickY = me.startMouseScreenY;
};
TileLevel.prototype.rakeMouseMove = function (mouseEvent) {
	mouseEvent.preventDefault();
	var me=this.backlink;
	var dX = mouseEvent.offsetX - me.startMouseScreenX;
	var dY = mouseEvent.offsetY - me.startMouseScreenY;
	//var dX = mouseEvent.clientX - me.startMouseScreenX;
	//var dY = mouseEvent.clientY - me.startMouseScreenY;
	me.translateX = me.translateX + dX * me.translateZ;
	me.translateY = me.translateY + dY * me.translateZ;
	//me.startMouseScreenX = mouseEvent.clientX;
	//me.startMouseScreenY = mouseEvent.clientY;
	me.startMouseScreenX = mouseEvent.offsetX;
	me.startMouseScreenY = mouseEvent.offsetY;
	me.moveZoom();
};
TileLevel.prototype.rakeMouseUp = function (mouseEvent) {
	mouseEvent.preventDefault();
	var me=this.backlink;
	//console.log('rakeMouseUp');
	me.svg.removeEventListener('mousemove', me.rakeMouseMove, true);
	//if (Math.abs(me.clickX - mouseEvent.clientX) < me.translateZ * me.tapSize / 8 //
	//	 && Math.abs(me.clickY - mouseEvent.clientY) < me.translateZ * me.tapSize / 8) {
	if (Math.abs(me.clickX - mouseEvent.offsetX) < me.translateZ * me.tapSize / 8 //
		 && Math.abs(me.clickY - mouseEvent.offsetY) < me.translateZ * me.tapSize / 8) {
		me.click();
	}
	me.adjustContentPosition();
	me.queueTiles();
};
TileLevel.prototype.startTouchZoom = function (touchEvent) {
	//console.log('startTouchZoom',this);
	var me=this;//.backlink;
	me.twoZoom = true;
	var p1 = me.vectorFromTouch(touchEvent.touches[0]);
	var p2 = me.vectorFromTouch(touchEvent.touches[1]);
	me.twocenter = me.vectorFindCenter(p1, p2);
	var d = me.vectorDistance(p1, p2);
	if (d <= 0) {
		d = 1;
	}
	me.twodistance = d;
};
TileLevel.prototype.rakeTouchStart = function (touchEvent) {
	touchEvent.preventDefault();
	var me=this.backlink;
	me.startedTouch = true;
	if (touchEvent.touches.length < 2) {
		me.twoZoom = false;
		me.startMouseScreenX = touchEvent.touches[0].clientX;
		me.startMouseScreenY = touchEvent.touches[0].clientY;
		//me.startMouseScreenX = touchEvent.touches[0].offsetX;
		//me.startMouseScreenY = touchEvent.touches[0].offsetY;
		me.clickX = me.startMouseScreenX;
		me.clickY = me.startMouseScreenY;
		me.twodistance = 0;
		return;
	} else {
		me.startTouchZoom(touchEvent);
	}
};
TileLevel.prototype.rakeTouchMove = function (touchEvent) {
	touchEvent.preventDefault();
	var me=this.backlink;
	if (touchEvent.touches.length < 2) {
		if (me.twoZoom) {
			//
		} else {
			//var dX = touchEvent.touches[0].offsetX - me.startMouseScreenX;
			//var dY = touchEvent.touches[0].offsetY - me.startMouseScreenY;
			var dX = touchEvent.touches[0].clientX - me.startMouseScreenX;
			var dY = touchEvent.touches[0].clientY - me.startMouseScreenY;
			me.translateX = me.translateX + dX * me.translateZ;
			me.translateY = me.translateY + dY * me.translateZ;
			me.startMouseScreenX = touchEvent.touches[0].clientX;
			me.startMouseScreenY = touchEvent.touches[0].clientY;
			//me.startMouseScreenX = touchEvent.touches[0].offsetX;
			//me.startMouseScreenY = touchEvent.touches[0].offsetY;
			//console.log('rakeTouchMove',me.translateX,me.translateY,me.translateZ,'/',touchEvent.touches,me.startMouseScreenX);
			me.moveZoom();
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
			/*if (zoom < me.minZoom) {
				zoom = me.minZoom;
			}
			if (zoom > me.maxZoom) {
				zoom = me.maxZoom;
			}*/
			me.translateX = me.translateX - (me.translateZ - zoom) * me.twocenter.x;
			me.translateY = me.translateY - (me.translateZ - zoom) * me.twocenter.y;
			me.translateZ = zoom;
			me.adjustContentPosition();
		}
	}
};

TileLevel.prototype.rakeTouchEnd = function (touchEvent) {
	touchEvent.preventDefault();
	var me=this.backlink;
	me.queueTiles();
	if (!me.twoZoom) {
		if (touchEvent.touches.length < 2) {
			if (me.startedTouch) {
				if (Math.abs(me.clickX - me.startMouseScreenX) < me.translateZ * me.tapSize / 8 //
					 && Math.abs(me.clickY - me.startMouseScreenY) < me.translateZ * me.tapSize / 8) {
					me.click();
				}
			} else {
				//console.log('touch ended already');
			}
			me.adjustContentPosition();
			return;
		}
	}
	me.twoZoom = false;
	me.startedTouch = false;
	me.adjustContentPosition();
};
TileLevel.prototype.click = function () {
	var xy = this.unzoom(this.clickX, this.clickY, this.translateZ);
	this.clickContentX = xy.x;
	this.clickContentY = xy.y;
	//console.log(this.clickX, this.clickY,this.clickContentX,this.clickContentY);
	this.runSpots(this.clickContentX, this.clickContentY);
};

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
	*/
	
	
	this.adjustContentPosition();
	this.queueTiles();
};

TileLevel.prototype.queueTiles = function () {
	//console.log('queueTiles', this);
	if (this.timeOutID > 0) {
		return;
	}
	var me=this;
	this.timeOutID = setTimeout(function () {
			me.timeOutID = 0;
			me.resetTiles();
		}, 100);
		
};

TileLevel.prototype.resetTiles = function () {
	//console.log('resetTiles');
	var leftTopX = 0;
	var leftTopY = 0;
	var rightBottomX = this.svg.clientWidth;
	var rightBottomY = this.svg.clientHeight;
	if (this.svg.clientWidth * this.translateZ > this.innerWidth) {
		leftTopX = (this.svg.clientWidth - this.innerWidth / this.translateZ) / 2;
		rightBottomX = this.svg.clientWidth - leftTopX;
	}
	if (this.svg.clientHeight * this.translateZ > this.innerHeight) {
		leftTopY = (this.svg.clientHeight - this.innerHeight / this.translateZ) / 2;
		rightBottomY = this.svg.clientHeight - leftTopY;
	}
	var lt = this.unzoom(leftTopX, leftTopY, this.translateZ);
	var rb = this.unzoom(rightBottomX, rightBottomY, this.translateZ);
	var xx = lt.x;
	var yy = lt.y;
	var ww = rb.x - lt.x;
	var hh = rb.y - lt.y;
	if (this.zoomLevelChanged()) {
		//this.clearLayerChildren([this.contentGroup]);
		this.clearAllLayersChildren();
		this.clearSpots();
	}
	this.addContent(xx, yy, ww, hh);
	this.reStick();
};
TileLevel.prototype.clearAllLayersChildren = function () {
	for(var i=0;i<this.layers.length;i++){
		this.layers[i].clearLayerChildren();
	}
};
TileLevel.prototype.clearAllUselessDetails = function (x, y, w, h) {
	for(var i=0;i<this.layers.length;i++){
		this.layers[i].clearUselessDetails(x, y, w, h);
	}
};
TileLevel.prototype.addContent = function (x, y, w, h) {
	//console.log(this);
	this.clearAllUselessDetails(x, y, w, h);//, this.contentGroup);
	this.addTiles(x, y, w, h);
};
TileLevel.prototype.addTiles = function (x, y, w, h) {
	this.renderers[this.zoomLevel].render(x, y, w, h);
};
TileLevel.prototype.zoomLevelChanged = function () {
	//zoomLevel
	var newLevel = this.zoomLevel;
	for (var i = 0; i < this.renderers.length; i++) {
		if (this.translateZ <= this.renderers[i].zoom) {
			newLevel = i;
			break;
		}
	}
	if (newLevel != this.zoomLevel) {
		//console.log('zoom level', this.zoomLevel, '->', newLevel, '/', this.translateZ);
		this.zoomLevel = newLevel;
		return true;
	} else {
		return false;
	}
};
RenderLayer.prototype.tileRectangle = function (g, x, y, w, h, fillColor, strokeColor, strokeWidth, rx, ry) {
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
	if (rx) {
		rect.setAttributeNS(null, 'rx', r);
	}
	if (ry) {
		rect.setAttributeNS(null, 'ry', r);
	}
	g.appendChild(rect);
	return rect;
};
RenderLayer.prototype.tileText = function (g, x, y, fontSize, html, fill, strokeColor, strokeWidth, fontFamily, fontStyle, cssClass) {
	//console.log('tileSongName',html);
	var txt = document.createElementNS(this.svgns, 'text');
	txt.setAttributeNS(null, 'x', x);
	txt.setAttributeNS(null, 'y', y);
	txt.setAttributeNS(null, 'font-size', fontSize);
	if (cssClass) {
		txt.setAttributeNS(null, 'class', cssClass);
	}

	if (fill) {
		txt.setAttributeNS(null, 'fill', fill);
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
	txt.innerHTML = html;
	g.appendChild(txt);
	return txt;
};
RenderLayer.prototype.tileLine = function (g, x1, y1, x2, y2, strokeColor, strokeWidth) {
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
RenderLayer.prototype.tileCircle = function (g, x, y, r, fill, strokeColor, strokeWidth) {
	var circle = document.createElementNS(this.svgns, 'circle');
	circle.setAttributeNS(null, 'cx', x);
	circle.setAttributeNS(null, 'cy', y);
	circle.setAttributeNS(null, 'r', r);
	if (fill) {
		circle.setAttributeNS(null, 'fill', fill);
	}
	if (strokeColor) {
		circle.setAttributeNS(null, 'stroke', strokeColor);
	}
	if (strokeWidth) {
		circle.setAttributeNS(null, 'stroke-width', strokeWidth);
	}
	g.appendChild(circle);
	return circle;
};
RenderLayer.prototype.tilePath = function (g, x, y, z, data, fill, strokeColor, strokeWidth) {
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
	if (fill) {
		path.setAttributeNS(null, 'fill', fill);
	}
	if (strokeColor) {
		path.setAttributeNS(null, 'stroke', strokeColor);
	}
	if (strokeWidth) {
		path.setAttributeNS(null, 'stroke-width', strokeWidth);
	}
	g.appendChild(path);
	return path;
};
RenderLayer.prototype.tilePolygon = function (g, points, fill, strokeColor, strokeWidth) {
	//console.log('tilePolygon',points);
	var p = document.createElementNS(this.svgns, 'polygon');
	p.setAttributeNS(null, 'points', points);
	if (fill) {
		p.setAttributeNS(null, 'fill', fill);
	}
	if (strokeColor) {
		p.setAttributeNS(null, 'stroke', strokeColor);
	}
	if (strokeWidth) {
		p.setAttributeNS(null, 'stroke-width', strokeWidth);
	}
	g.appendChild(p);
	return p;
};

TileLevel.prototype.runSpots = function (x, y) {
	//console.log('runSpots', x, y, '/', this.translateX, this.translateY, this.translateZ,this.spots);
	var needRedraw = false;
	for (var i = this.spots.length - 1; i >= 0; i--) {
		var spot = this.spots[i];
		var checkX = spot.x;
		var checkY = spot.y;
		if (spot.layer.lockVertical) {
			checkY = spot.y - this.translateY+ spot.layer.lockY*this.translateZ;
			//y = -this.translateY+this.layers[i].lockY*this.translateZ;
			//checkY = spot.y + spot.layer.lockY*this.translateZ;
			//console.log(x,y,spot.layer.lockY,this.translateZ,spot.layer.lockY*this.translateZ,spot);
		}
		if (spot.layer.lockHorizontal) {
			checkX = spot.x - this.translateX+ spot.layer.lockX*this.translateZ;
			//console.log(x,y,spot.layer.lockX,this.translateZ,spot.layer.lockX*this.translateZ,spot);
		}
		//console.log('collision',x, y, 1, 1, 'check',checkX, checkY, spot.w, spot.h);
		if (this.collision(x, y, 1, 1, checkX, checkY, spot.w, spot.h)) {
			spot.a();
			needRedraw = true;
			break;
		}
	}
	if (needRedraw) {
		this.resetAllLayersNow();
	}
};
RenderLayer.prototype.addSpot = function (id, x, y, w, h, a) {
	//console.log('addSpot',id, x, y, w, h);
	this.tiler.dropSpot(id);
	var spot = {
		id: id,
		x: x,
		y: y,
		w: w,
		h: h,
		a: a,
		layer:this

	};
	this.tiler.spots.push(spot);
	return spot;
};
TileLevel.prototype.clearSpots = function () {
	this.spots = [];
};
TileLevel.prototype.findSpot = function (id) {
	for (var i = 0; i < this.spots.length; i++) {
		if (this.spots[i].id == id) {
			return this.spots[i];
		}
	}
	return null;
};
TileLevel.prototype.dropSpot = function (id) {
	for (var i = 0; i < this.spots.length; i++) {
		if (this.spots[i].id == id) {
			this.spots.splice(i, 1);
			break;
		}
	}
};


console.log('ValueTree v1.14');
function ValueTree(name) {
	this.children = [];
	this.value = "";
	this.name = name;
	return this;
}
ValueTree.prototype.of = function (name) {
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i].name == name) {
			return this.children[i];
		}
	}
	var v = new ValueTree(name);
	this.children.push(v);
	return v;
};
ValueTree.prototype.numeric = function (minValue, defaultValue, maxValue) {
	var r = defaultValue;
	try {
		r = Number.parseFloat(this.value);
	} catch (ex) {
		console.log(ex);
	}
	if (isNaN(r)) {
		r = defaultValue;
	}
	if (r < minValue) {
		r = minValue;
	}
	if (r > maxValue) {
		r = maxValue;
	}
	return r;
};
ValueTree.prototype.inlist = function (values) {
	for(var i=0;i<values.length;i++){
		if(this.value==values[i]){
			return this.value;
		}
	}
	return values[0];
};
ValueTree.prototype.all = function (name) {
	var r = [];
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i].name == name) {
			r.push(this.children[i]);
		}
	}
	return r;
};
ValueTree.prototype.fromXMLstring = function (xml) {
	var windowDOMParser = new window.DOMParser();
	var dom = windowDOMParser.parseFromString(xml, "text/xml");
	this.fromNodes(dom.childNodes);
};
ValueTree.prototype.dump = function (pad,symbol) {
	console.log(pad,this.name,':',this.value);
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].dump(pad+symbol,symbol);
	}
};
ValueTree.prototype.fromNodes = function (nodes) {
	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i].nodeType == 1) {
			var v = new ValueTree(nodes[i].nodeName);
			this.children.push(v);
			v.fromNodes(nodes[i].childNodes);
			for (var n = 0; n < nodes[i].attributes.length; n++) {
				var a = new ValueTree(nodes[i].attributes[n].name);
				a.value = nodes[i].attributes[n].value;
				v.children.push(a);
			}
		} else {
			if (nodes[i].nodeType == 3) {
				this.value = this.value + nodes[i].nodeValue.trim();
			}
		}
	}
};
ValueTree.prototype.has = function (name) {
	for (var i = 0; i < this.children.length; i++) {
		if (this.children[i].name == name) {
			return true;
		}
	}
	return false;
};

function saveObject2localStorage(name, o) {
	console.log('saveObject2localStorage', name, o);
	localStorage.setItem(name, JSON.stringify(o));
}
function readObjectFromlocalStorage(name) {
	var o = null;
	try {
		o = JSON.parse(localStorage.getItem(name));
	} catch (ex) {
		console.log(ex);
		return {};
	}
	return o;
}
function saveText2localStorage(name, text) {
	console.log('saveText2localStorage', name, text);
	localStorage.setItem(name, text);
}
function readTextFromlocalStorage(name) {
	var o = '';
	try {
		o = localStorage.getItem(name);
	} catch (ex) {
		console.log(ex);
	}
	return o;
}
function sureArray(v, defaultValue) {
	if (v) {
		if (v.length > 0) {
			return v;
		} else {
			return defaultValue;
		}
	} else {
		return defaultValue;
	}
}
function sureNumeric(v, minValue, defaultValue, maxValue) {
	var r = defaultValue;
	try {
		r = Number.parseFloat(v);
	} catch (ex) {
		console.log(ex);
	}
	if (isNaN(r)) {
		r = defaultValue;
	}
	if (r < minValue) {
		r = minValue;
	}
	if (r > maxValue) {
		r = maxValue;
	}
	return r;
}
function sureInList(v, defaultValue, items) {
	var r = defaultValue;
	for (var i = 0; i < items.length; i++) {
		if (items[i] == v) {
			return v;
		}
	}
	return r;
}
function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
			vars[key] = value;
		});
	return vars;
}
function decodeState(encoded) {
	try {
		//addStateToHistory();
		var strings = encoded.split('-');
		var tempo = parseInt(strings[0], 16);
		//console.log('tempo',tempo);
		saveText2localStorage('tempo', '' + tempo);
		for (var i = 0; i < 8; i++) {
			var n = 10 * parseInt(strings[1].substring(i, i + 1), 16);
			//console.log('track'+i,n);
			saveText2localStorage('track' + i, '' + n);
		}
		for (var i = 0; i < 8; i++) {
			var n = 10 * parseInt(strings[2].substring(i, i + 1), 16);
			//console.log('drum'+i,n);
			saveText2localStorage('drum' + i, '' + n);
		}
		//console.log(strings[3]);
		for (var i = 0; i < 10; i++) {
			var t = strings[3].substring(i * 2, i * 2 + 2);
			var n = parseInt(t, 16) - 10;
			//console.log('equalizer'+i,n,t);
			saveText2localStorage('equalizer' + i, '' + n);
		}
		var storeDrums = [];
		var cnt = strings[4].length / 4;
		//console.log(cnt,strings[4]);
		for (var i = 0; i < cnt; i++) {
			var key = parseInt(strings[4].substring(i * 4, i * 4 + 2), 16);
			var data = parseInt(strings[4].substring(i * 4 + 2, i * 4 + 4), 16);
			var drum = key >> 5;
			var i32 = key & parseInt('11111', 2);
			//console.log(pad0(key.toString(2),8),pad0(data.toString(2),8),drum,i32);
			if ((data | parseInt('00000001', 2)) == data)
				storeDrums.push({
					drum: drum,
					beat: i32 * 8 + 0
				}); //console.log('drum',drum,i32*8+0);
			if ((data | parseInt('00000010', 2)) == data)
				storeDrums.push({
					drum: drum,
					beat: i32 * 8 + 1
				}); //console.log('drum',drum,i32*8+1);
			if ((data | parseInt('00000100', 2)) == data)
				storeDrums.push({
					drum: drum,
					beat: i32 * 8 + 2
				}); //console.log('drum',drum,i32*8+2);
			if ((data | parseInt('00001000', 2)) == data)
				storeDrums.push({
					drum: drum,
					beat: i32 * 8 + 3
				}); //console.log('drum',drum,i32*8+3);
			if ((data | parseInt('00010000', 2)) == data)
				storeDrums.push({
					drum: drum,
					beat: i32 * 8 + 4
				}); //console.log('drum',drum,i32*8+4);
			if ((data | parseInt('00100000', 2)) == data)
				storeDrums.push({
					drum: drum,
					beat: i32 * 8 + 5
				}); //console.log('drum',drum,i32*8+5);
			if ((data | parseInt('01000000', 2)) == data)
				storeDrums.push({
					drum: drum,
					beat: i32 * 8 + 6
				}); //console.log('drum',drum,i32*8+6);
			if ((data | parseInt('10000000', 2)) == data)
				storeDrums.push({
					drum: drum,
					beat: i32 * 8 + 7
				}); //console.log('drum',drum,i32*8+7);
		}
		saveObject2localStorage('storeDrums', storeDrums);
		var storeTracks = [];
		cnt = strings[5].length / 9;
		for (var i = 0; i < cnt; i++) {
			var beat = parseInt(strings[5].substring(i * 9, i * 9 + 2), 16);
			var track = parseInt(strings[5].substring(i * 9 + 2, i * 9 + 2 + 1), 16);
			var length = parseInt(strings[5].substring(i * 9 + 3, i * 9 + 3 + 2), 16);
			var pitch = parseInt(strings[5].substring(i * 9 + 5, i * 9 + 5 + 2), 16);
			var shift = parseInt(strings[5].substring(i * 9 + 7, i * 9 + 7 + 2), 16) - 64;
			//console.log(beat,track,length,pitch,shift);
			storeTracks.push({
				track: track,
				beat: beat,
				length: length,
				shift: shift,
				pitch: pitch
			});
		}
		saveObject2localStorage('storeTracks', storeTracks);
	} catch (ex) {
		console.log(ex);
	}
}
function pad0(value, size) {
	for (var i = value.length; i < size; i++) {
		value = '0' + value;
	}
	return value;
}
function encodeState() {
	var txt = '';
	try {
		var tempo = 1 * sureInList(readTextFromlocalStorage('tempo'), 120, [80, 100, 120, 140, 160, 180, 200, 220]);
		txt = tempo.toString(16);
		var tracks = '';
		for (var i = 0; i < 8; i++) {
			var n = Math.round(sureNumeric(readTextFromlocalStorage('track' + i), 0, 60, 100) / 10).toString(16);
			tracks = tracks + n;
		}
		txt = txt + '-' + tracks;
		var drums = '';
		for (var i = 0; i < 8; i++) {
			var n = Math.round(sureNumeric(readTextFromlocalStorage('drum' + i), 0, 60, 100) / 10).toString(16);
			drums = drums + n;
		}
		txt = txt + '-' + drums;
		var equalizer = '';
		for (var i = 0; i < 10; i++) {
			var n = pad0(Math.round(sureNumeric(readTextFromlocalStorage('equalizer' + i), -10, 60, 10) + 10).toString(16), 2);
			equalizer = equalizer + n;
		}
		txt = txt + '-' + equalizer;
		var storeDrums = readObjectFromlocalStorage('storeDrums');
		var drumData = "";
		for (var di = 0; di < 8; di++) {
			for (var bi = 0; bi < 32; bi++) {
				var part = [];
				for (var i = 0; i < storeDrums.length; i++) {
					var drum = storeDrums[i].drum;
					var beat = storeDrums[i].beat;
					if (drum == di && beat >= bi * 8 && beat < (bi + 1) * 8) {
						part.push(beat - bi * 8);
					}
				}
				if (part.length > 0) {
					var key = di << 5 | bi;
					var data = 0;
					for (var t = 0; t < part.length; t++) {
						data = data | (1 << part[t]);
					}
					drumData = drumData + pad0(key.toString(16), 2) + pad0(data.toString(16), 2);
				}
			}
		}
		txt = txt + '-' + drumData;
		var storeTracks = readObjectFromlocalStorage('storeTracks');
		var pitchData = '';
		for (var bi = 0; bi < 256; bi++) {
			var data = '';
			for (var i = 0; i < storeTracks.length; i++) {
				var beat = storeTracks[i].beat;
				var length = storeTracks[i].length;
				var pitch = storeTracks[i].pitch;
				var shift = 64 + storeTracks[i].shift;
				var track = storeTracks[i].track;
				if (beat == bi) {
					var nd=pad0(beat.toString(16), 2) + track.toString(16) + pad0(length.toString(16), 2) + pad0(pitch.toString(16), 2) + pad0(shift.toString(16), 2);
					pitchData = pitchData + nd;
					//console.log(beat,track.toString(16),shift,nd);
				}
			}
		}
		txt = txt +'-'+pitchData;
	} catch (ex) {
		console.log(ex);
	}
	console.log(txt);
	return txt;
}
function addStateToHistory(nocut) {
	var hstry = sureArray(readObjectFromlocalStorage('history'), []);
	var state = {};
	state.label = '' + new Date();
	state.storeDrums = sureArray(readObjectFromlocalStorage('storeDrums'), []);
	state.storeTracks = sureArray(readObjectFromlocalStorage('storeTracks'), []);
	
	for (var i = 0; i < 10; i++) {
		state['equalizer' + i] = readTextFromlocalStorage('equalizer' + i);
	}
	for (var i = 0; i < 8; i++) {
		state['drum' + i] = readTextFromlocalStorage('drum' + i);
		state['track' + i] = readTextFromlocalStorage('track' + i);
	}
	state['tempo'] = readTextFromlocalStorage('tempo');
	state['flatstate'] = readObjectFromlocalStorage('flatstate');
	hstry.push(state);
	if(nocut){
		//
	}else{
		while (hstry.length > 23) {
			hstry.shift();
		}
	}
	saveObject2localStorage('history', hstry);
}
function removeStateFromHistory(n) {
	var hstry = sureArray(readObjectFromlocalStorage('history'), []);
	if (hstry.length > n) {
		var state = hstry[n];
		hstry.splice(n, 1);
		saveObject2localStorage('history', hstry);
		saveObject2localStorage('storeDrums', state.storeDrums);
		saveObject2localStorage('storeTracks', state.storeTracks);
		saveObject2localStorage('flatstate', state.flatstate);
		saveText2localStorage('tempo', state.tempo);
		for (var i = 0; i < 10; i++) {
			saveText2localStorage('equalizer' + i, state['equalizer' + i]);
		}
		for (var i = 0; i < 8; i++) {
			saveText2localStorage('drum' + i, state['drum' + i]);
			saveText2localStorage('track' + i, state['track' + i]);
		}
	}
}

function modeDrumColor  (bgMode) {
	if (bgMode == 2) {
		return '#233';
	}
	return '#ccc';
}
function modeDrumShadow  (bgMode) {
	if (bgMode == 2) {
		return '#9a9';
	}
	return '#566';
}
function modeNoteName  (bgMode) {
	if (bgMode == 0) {
		return '#000';
	}
	return '#fff';
}
function modeBackground  (bgMode) {
	if (bgMode == 1) {
		return '#31424C';
	}
	if (bgMode == 2) {
		//return '#C8D1D2';
		return '#eef';
	}
	return '#000609';
}


