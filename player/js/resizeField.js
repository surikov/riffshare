function resizeField() {
	console.log('resizeField');
	levelEngine.viewWidth = document.getElementById('contentSVG').clientWidth;
	levelEngine.viewHeight = document.getElementById('contentSVG').clientHeight;
	fillModelControls();
	fillSetting();
	levelEngine.model[4].shiftX= levelEngine.viewWidth / levelEngine.tapSize - 2;
	//levelEngine.clearAllDetails ();
	//levelEngine.tileFromModel();
	levelEngine.resetModel();
	//console.log(document.getElementById('controls'));
}
