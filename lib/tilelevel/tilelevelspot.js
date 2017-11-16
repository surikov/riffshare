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
