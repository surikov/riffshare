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
	if(this.zoomLevelChanged()){
		this.clearLayerChildren([this.contentGroup]);
		this.clearSpots();
	}
	this.addContent(xx, yy, ww, hh);
	this.reStick();
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
TileLevel.prototype.tileRectangle = function (g, x, y, w, h, fillColor, strokeColor, strokeWidth, rx,ry) {
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
TileLevel.prototype.tileText = function (g, x, y, fontSize, html, fill, strokeColor, strokeWidth, fontFamily, fontStyle) {
	var txt = document.createElementNS(this.svgns, 'text');
	txt.setAttributeNS(null, 'x', x);
	txt.setAttributeNS(null, 'y', y);
	txt.setAttributeNS(null, 'font-size', fontSize);
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
TileLevel.prototype.tileLine = function (g, x1, y1, x2, y2, strokeColor, strokeWidth) {
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
TileLevel.prototype.tileCircle = function (g, x, y, r, fill, strokeColor, strokeWidth) {
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
TileLevel.prototype.tilePath = function (g, x,y,z, data, fill, strokeColor, strokeWidth) {
	var path = document.createElementNS(this.svgns, 'path');
	path.setAttributeNS(null, 'd', data);	
	var t="";
	if((x)||(y)){
		t='translate('+x+','+y+')';
	}
	if(z){
		t=t+' scale('+z+')';
	}
	if(t.length>0){
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
TileLevel.prototype.tilePolygon = function (g,  points, fill, strokeColor, strokeWidth) {
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