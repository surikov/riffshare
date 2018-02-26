FretChordSheet.prototype.saveState = function (prefix) {
	saveObject2localStorage(prefix + '_position', {
		tx: this.tiler.translateX
		, ty: this.tiler.translateY
		, tz: this.tiler.translateZ
		, feel: this.options.feel
		, measureMode: this.options.measureMode
		, measures: this.measures
		, trackOrder: this.trackOrder
		, markNotesCount: this.options.markNotesCount
		, breakMode: this.options.breakMode
		, hidePiano: this.options.hidePiano
		, hideStaff: this.options.hideStaff
		, hideFrets: this.options.hideFrets
		, hideDrums: this.options.hideDrums
		,volumes:this.volumes//=[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
		,subSamples:this.subSamples//=[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
	});
};
FretChordSheet.prototype.loadState = function (prefix) {
	try {
		var p = readObjectFromlocalStorage(prefix + '_position');
		this.tiler.translateX = sureNumeric(p.tx, -999999999, 0, 0);
		this.tiler.translateY = sureNumeric(p.ty, -999999999, 0, 0);
		this.tiler.translateZ = sureNumeric(p.tz, 1, 9, 500);
		this.options.feel = sureNumeric(p.feel, 0, 0, 4);
		this.options.breakMode = sureNumeric(p.breakMode, 0, 1, 2);
		this.options.markNotesCount = sureNumeric(p.markNotesCount, 1, 1, 3);
		this.options.measureMode = sureNumeric(p.measureMode, 0, 1, 4);
		this.options.hidePiano = sureNumeric(p.hidePiano, 1, 1, 2);
		this.options.hideStaff = sureNumeric(p.hideStaff, 1, 1, 2);
		this.options.hideFrets = sureNumeric(p.hideFrets, 1, 1, 2);
		this.options.hideDrums = sureNumeric(p.hideDrums, 1, 1, 2);
		this.resetHeaderWidth();
		this.measures = sureArray(p.measures, []);
		this.trackOrder = sureArray(p.trackOrder, [0, 1, 2, 3, 4, 5, 6, 7]);
		this.volumes = sureArray(p.volumes, [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]);
		this.subSamples = sureArray(p.subSamples, [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
		this.shrinkMeasures();
	} catch (e) {
		console.log(e);
	}
	//console.log(this.subSamples);
};