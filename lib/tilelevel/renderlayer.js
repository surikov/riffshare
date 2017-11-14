function RenderLayer() {
	this.svgns = "http://www.w3.org/2000/svg";
	this.placeHolder=false;
	return this;
};
RenderLayer.prototype.collision = function (x1, y1, w1, h1, x2, y2, w2, h2) {
	//console.log('collision',x1, y1, w1, h1, x2, y2, w2, h2);
	if (this.collisionX(x1, w1, x2, w2) //
		&& this.collisionX(y1, h1, y2, h2) //
	) {
		return true;
	} else {
		return false;

	}
};
RenderLayer.prototype.collisionX = function (x, w, left, width) {
	//console.log('collision',x1, y1, w1, h1, x2, y2, w2, h2);
	if (x + w < left //
		|| x > left + width //
	) {
		return false;
	} else {
		return true;

	}
};
RenderLayer.prototype.collisionY = function (y, h, top, height) {
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
		c = this.collision(x - sx *  this.g.calculatedX, y - sy * this.g.calculatedY, w, h, left, top, width, height);
	} else {
		if (width) {
			c = this.collisionX(x - sx * this.g.calculatedX, w, left, width);
		} else {
			//console.log('check',y,sy,layer.calculatedY);
			c = this.collisionY(y - sy *  this.g.calculatedY, h, top, height);
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
	return !(this.collision(tbb.x, tbb.y, tbb.width, tbb.height, x, y, w, h));
};
