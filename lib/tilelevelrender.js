TileLevel.prototype.resetTiles = function () {
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
	if(this.zoomLevelChanged()){
		this.clearLayerChildren([this.contentGroup]);
		this.clearSpots();
	}
	this.addContent(xx, yy, ww, hh);
	this.reLayoutVertical();
};
TileLevel.prototype.addContent = function (x, y, w, h) {
	//console.log(this);
	this.clearUselessDetails(x, y, w, h, this.contentGroup);
	this.addTiles(x, y, w, h);
};
TileLevel.prototype.addTiles = function (x, y, w, h) {
	this.renderers[this.zoomLevel].render(x, y, w, h);
};
TileLevel.prototype.zoomLevelChanged = function () {
	//zoomLevel
	var newLevel=this.zoomLevel;
	for(var i=0;i<this.renderers.length;i++){
		if(this.translateZ<=this.renderers[i].zoom){
			newLevel=i;
			break;
		}
	}
	if(newLevel!=this.zoomLevel){
		console.log(this.zoomLevel,'->',newLevel,'/',this.translateZ);
		this.zoomLevel=newLevel;
		return true;
	}else{
		return false;
	}
};
TileLevel.prototype.tileRectangle = function (g, x, y, w, h, fillColor, strokeColor, strokeWidth, r) {
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