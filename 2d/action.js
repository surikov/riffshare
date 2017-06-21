RiffShare2D.prototype.addSpot = function (id, x, y, w, h, a) {
	this.dropSpot(id);
	var spot = {
		id : id,
		x : x,
		y : y,
		w : w,
		h : h,
		a : a
	};
	this.spots.push(spot);
	return spot;
};
RiffShare2D.prototype.findSpot = function (id) {
	for (var i = 0; i < this.spots.length; i++) {
		if (this.spots[i].id == id) {
			return this.spots[i];
		}
	}
	return null;
};
RiffShare2D.prototype.dropSpot = function (id) {
	for (var i = 0; i < this.spots.length; i++) {
		if (this.spots[i].id == id) {
			this.spots.splice(i, 1);
			break;
		}
	}
};
RiffShare2D.prototype.clearSpots = function () {
	this.spots = [];
};
RiffShare2D.prototype.runSpots = function (x, y) {
	console.log('runSpots',this.menuFog);
	var found = false;
	for (var i = 0; i < this.spots.length; i++) {
		var spot = this.spots[i];
		if (this.collision(x, y, 1, 1, spot.x, spot.y, spot.w, spot.h)) {
			spot.a();
			found = true;
		}
	}
	if (this.menuFog) {
		this.hideMenu();
	} else {
		this.showMenu();
	}
	if (found) {
		this.resetAllLayersNow();
	}
};
RiffShare2D.prototype.showMenu = function (x, y) {
	//this.removeMenu();
	//this.menuInfo={x:x,y:y,r:this.translateZ};
	//console.log(this.translateZ);
	this.menuDiv.style.visibility = "visible";
	this.menuFog = true;
};
RiffShare2D.prototype.tileMenu = function (left, top, width, height, ratio) {
	/*if(this.menuInfo){
	var x=this.menuInfo.x;
	var y=this.menuInfo.y;
	var w=this.menuInfo.r*this.tapSize*2;
	var h=this.menuInfo.r*this.tapSize*3;
	var id='menuPane';*/
	/*var g = this.rakeGroup(x, y, w, h, id, this.overlayGroup, left, top, width, height);
	if (g) {
	this.tileRectangle(g, x, y, w, h, this.colorHugeHolder);
	}*/
	/*if (!this.childExists(id, this.overlayGroup)) {
	var g = document.createElementNS(this.svgns, 'g');
	g.id = id;
	this.overlayGroup.appendChild(g);
	this.tileRectangle(g, 10, 30, 100, 200, this.colorHugeHolder);
	}
	}*/
};
RiffShare2D.prototype.hideMenu = function () {
	/*if(this.overlayGroup.children.length>0){
	this.overlayGroup.removeChild(this.overlayGroup.children[0]);
	}
	this.menuInfo=null;*/
	this.menuDiv.style.visibility = "hidden";
	this.menuFog = false;
};
