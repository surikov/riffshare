TileLevel.prototype.queueTiles = function () {
	console.log('queueTiles', this);
	if (this.timeOutID > 0) {
		return;
	}
	var me=this;
	this.timeOutID = setTimeout(function () {
			me.timeOutID = 0;
			me.resetTiles();
		}, 100);
		
};
