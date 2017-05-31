RiffShare2D.prototype.addSpot = function (id,x,y,w,h,a) {
	this.dropSpot(id);
	var spot={id:id,x:x,y:y,w:w,h:h,a:a};
	this.spots.push(spot);
	return spot;
};
RiffShare2D.prototype.findSpot = function (id) {
	for(var i=0;i<this.spots.length;i++){
		if(this.spots[i].id==id){
			return this.spots[i];
		}
	}
	return null;
};
RiffShare2D.prototype.dropSpot = function (id) {
	for(var i=0;i<this.spots.length;i++){
		if(this.spots[i].id==id){
			this.spots.splice(i,1);
			break;
		}
	}
};
RiffShare2D.prototype.clearSpots = function () {
	this.spots=[];
};
RiffShare2D.prototype.runSpots = function (x,y) {
	for(var i=0;i<this.spots.length;i++){
		var spot=this.spots[i];
		if (this.collision(x, y, 1, 1, spot.x, spot.y, spot.w, spot.h)) {
			spot.a();
		}
	}
};
