function resizeField() {
	console.log('resizeField');
	levelEngine.viewWidth = document.getElementById('contentSVG').clientWidth;
	levelEngine.viewHeight = document.getElementById('contentSVG').clientHeight;
	fillModelControls();
	fillSetting();
	
	//levelEngine.clearAllDetails ();
	//levelEngine.tileFromModel();
	levelEngine.resetModel();
	//console.log(document.getElementById('controls'));
}
