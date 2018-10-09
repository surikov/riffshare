function pinClickAction(x, y) {
	if (anchor) {
		iconPinSetting.l = pathList;
		levelEngine.startSlideTo(anchor.x, anchor.y, anchor.z);
		anchor = null;
		levelEngine.clearGroupDetails(document.getElementById('controls'));
		levelEngine.tileFromModel();
	} else {
		console.log('slide to pin');
		var back = {
			x: levelEngine.translateX,
			y: levelEngine.translateY,
			z: levelEngine.translateZ
		};
		var y = 0;
		if (selectedTrack > -1) {
			//if (selectedTrack < currentSong.tracks.length) {
				y = settingTracksTop + selectedTrack * 10;
			//} else {
			//	y = settingTracksTop +( currentSong.tracks.length + selectedTrack) * 10;
			//}
		}
		//console.log(y, y * levelEngine.tapSize);
		levelEngine.startSlideTo(0 * levelEngine.tapSize, -y * levelEngine.tapSize, 7, function () {
			console.log('pin');
			anchor = back;
			iconPinSetting.l = pathPin;
			levelEngine.clearGroupDetails(document.getElementById('controls'));
			levelEngine.tileFromModel();
		});
	}
}
function promptClickAction(x, y) {
	document.getElementById('chooseFileInput').click();
}
function playClickAction(x, y) {
	console.log(levelEngine.translateX, levelEngine.translateY, levelEngine.translateZ);
}
