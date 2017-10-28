console.log('tilelevel.js v1.01');
function TileLevel(svgid) {
	//window.tilelevel = this;
	
	this.svgid = svgid;
	this.translateX = 0;
	this.translateY = 0;
	this.translateZ = 1;
	this.minZoom = 1;
	this.maxZoom = 20;
	this.setupPane();
	this.setupTapSize();
	this.setupTouchMouse();
	console.log('created',this);
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
	this.svg.backlink=this;
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
TileLevel.prototype.resetTiles = function () {
	//console.log('resetTiles', this);
};
