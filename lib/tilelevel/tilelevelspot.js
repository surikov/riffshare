TileLevel.prototype.runSpots = function (x, y) {
	console.log('runSpots',x, y,'/',this.translateX,this.translateY,this.translateZ);
	var needRedraw = false;
	for (var i = this.spots.length - 1; i >= 0; i--) {
		var spot = this.spots[i];
		
		var checkX = spot.x;
		var checkY = spot.y;
		/*if (spot.sx) {
			checkX = spot.x + this.stickedX;
		}*/
		if(spot.lockVertical){
			checkY = spot.y - this.translateY;
		}
		if(spot.lockHorizontal){
			checkX = spot.x - this.translateX;
		}
		//console.log(spot,x, y, checkX, checkY);
		if (this.collision(x, y, 1, 1, checkX, checkY, spot.w, spot.h)) {
			
			//if (spot.a) {
				spot.a();
			//}
			//if (spot.toZoom < this.translateZ && spot.toZoom > 0) {
				//var tox = -checkX;
				/*if (spot.sx) {
					if (-tox > spot.x) {
						tox = this.translateX;
					} else {
						tox = -spot.x;
					}
				}*/
				//this.startSlideTo(tox, -checkY, spot.toZoom);
				//this.startSlideTo(-checkX, -checkY, spot.toZoom);
			//} else {
				needRedraw = true;
			//}
			break;
		}
	}
	if (needRedraw) {
		this.resetAllLayersNow();
	}
};
/*TileLevel.prototype.addSpot = function (id, x, y, w, h, a, stickX, toZoom) {
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
};*/
TileLevel.prototype.addSpot = function (id, x, y, w, h, a, lockVertical, lockHorizontal) {
	this.dropSpot(id);
	var spot = {
		id: id,
		x: x,
		y: y,
		w: w,
		h: h,
		a: a,
		lockVertical: lockVertical,
		lockHorizontal: lockHorizontal
		//,toZoom:toZoom
	};
	this.spots.push(spot);
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
