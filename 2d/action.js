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
	console.log('runSpots', this.menuFog);
	var found = false;
	for (var i = 0; i < this.spots.length; i++) {
		var spot = this.spots[i];
		if (this.collision(x, y, 1, 1, spot.x, spot.y, spot.w, spot.h)) {
			spot.a();
			found = true;
		}
	}
	/*if (this.menuFog) {
	this.hideMenu();
	} else {
	this.showMenu();
	}*/
	if (found) {
		this.resetAllLayersNow();
	}
};
RiffShare2D.prototype.showMenu = function (title, items) {
	//this.removeMenu();
	//this.menuInfo={x:x,y:y,r:this.translateZ};
	//console.log(this.translateZ);
	this.menuTitleSpan.innerText = "Song";

	var tbody = this.menuTable.tBodies[0];
	while (tbody.rows.length > 0) {
		tbody.deleteRow(0);
	}
	this.currentMenuActions = [];
	for (var i = 0; i < items.length; i++) {
		var row = tbody.insertRow(0);
		var cell = row.insertCell(0);
		this.currentMenuActions.push(items[i].action);
		cell.innerHTML = '<a href="javascript:riffShare2d.popAction(' + i + ');"><div><nobr>' + items[i].title + '</nobr></div></a>';
	}
	/*
	var row = tbody.insertRow(0);
	var cell = row.insertCell(0);
	cell.innerHTML = '<a href="javascript:riffShare2d.hideMenu();"><div><nobr>'+'test 333'+'</nobr></div></a>';
	row = tbody.insertRow(0);
	cell = row.insertCell(0);
	cell.innerHTML = '<a href="javascript:riffShare2d.hideMenu();"><div><nobr>'+'test 222'+'</nobr></div></a>';
	row = tbody.insertRow(0);
	cell = row.insertCell(0);
	cell.innerHTML = '<a href="javascript:riffShare2d.hideMenu();"><div><nobr>'+'test 111'+'</nobr></div></a>';
	 */

	this.menuDiv.style.visibility = "visible";
	this.menuDiv.scrollTop = 0;
	this.menuFog = true;
};
RiffShare2D.prototype.popAction = function (nn) {
	console.log('popAction', nn);
	this.hideMenu();
	this.currentMenuActions[nn]();
};
RiffShare2D.prototype.tileMainMenu = function (layer, left, top, width, height, detailRatio) {
	var x = 30 * this.tapSize;
	var y = 30 * this.tapSize;
	var w = 13 * this.tapSize;
	var h = 13 * this.tapSize;
	var id = 'buttonMainMenu';
	var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
	if (g) {
		this.tileCircle(g, x + w / 2, y + w / 2, w / 2, this.colorAction, this.colorAction, this.lineWidth * detailRatio);
		this.addSpot('optControlsSpot', x, y, w, h, function () {
			riffShare2d.showMenu('Song', [{
						title : 'open example 1',
						action : function () {
							//alert('qwerty');
							window.location.href = 'song.html';
						}
					}, {
						title : 'open example 2',
						action : function () {
							window.location.href = 'song2.html';
						}
					},  {
						title : 'open example 3',
						action : function () {
							window.location.href = 'song3.html';
						}
					},{
						title : 'change title',
						action : function () {
							var r = prompt('Song title', riffShare2d.currentSong.name);
							if (r) {
								riffShare2d.currentSong.name = r;
							}
							riffShare2d.resetAllLayersNow();
						}
					}, {
						title : 'new song',
						action : function () {
							var r = confirm('Create new song');
							if (r) {
								riffShare2d.currentSong = riffShare2d.emptySong();
							}
							riffShare2d.resetAllLayersNow();
						}
					}, {
						title : 'save current song',
						action : function () {
							saveObject2localStorage('currentSong',riffShare2d.currentSong);
						}
					}
				]);
		});
	}
};
RiffShare2D.prototype.hideMenu = function () {
	/*if(this.overlayGroup.children.length>0){
	this.overlayGroup.removeChild(this.overlayGroup.children[0]);
	}
	this.menuInfo=null;*/
	this.menuDiv.style.visibility = "hidden";
	this.menuFog = false;
};
