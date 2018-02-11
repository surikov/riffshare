FretChordSheet.prototype.tileModalDialog = function (left, top, width, height, lineWidth) {
	if (this.modalDialogMode) {
		var me = this;
		this.layerDialogs.renderGroup(0, 0, this.calcContentWidth(), this.contentHeight
			, 'bgDialog', left, top, width, height, function (tg) {
				//me.tiler.clearSpots();
				//tg.layer.tileRectangle(tg.g, tg.x, tg.y, tg.w, tg.h, 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.05)', tg.layer.tapSize);
				var rect = document.createElementNS(tg.layer.svgns, 'rect');
				rect.setAttributeNS(null, 'x', tg.x);
				rect.setAttributeNS(null, 'y', tg.y);
				rect.setAttributeNS(null, 'height', tg.h);
				rect.setAttributeNS(null, 'width', tg.w);
				rect.setAttributeNS(null, 'fill', 'rgba(0,0,0,0.25)');//'#f00');
				tg.g.appendChild(rect);
				//console.log(tg.layer.svgns,rect);

			});
		//this.tiler.clearSpots();
		var s = this.layerDialogs.addSpot('cancelModalFog', 0, 0, this.calcContentWidth(), this.contentHeight, function () {
			me.modalDialogMode = false;
		});
		//console.log(s);
	}
};
