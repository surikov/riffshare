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
