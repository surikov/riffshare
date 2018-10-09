function startWatchState() {
	var step = function (timestamp) {
		watchState(timestamp)
		window.requestAnimationFrame(step);
	};
	step();
}
function watchState(timestamp) {
	//console.log(new Date(), timestamp,levelEngine.translateX,levelEngine.translateY,levelEngine.translateZ);
	//console.log(levelEngine.translateX,levelEngine.tapSize,settingPanelWidth);
	if (anchor) {
		if (-levelEngine.translateX > levelEngine.tapSize * settingPanelWidth || levelEngine.translateZ > 16) {
			unpin();
		}
	}
}
function unpin() {
	console.log('unpin');
	anchor = null;
	iconPinSetting.l = pathList;
	levelEngine.clearGroupDetails(document.getElementById('controls'));
	levelEngine.tileFromModel();
}
