﻿function pinClickAction(x, y) {
	if (anchor) {
		iconPinSetting.l = pathList;
		levelEngine.startSlideTo(anchor.x, anchor.y, anchor.z);
		anchor = null;
	} else {
		anchor = {
			x: levelEngine.translateX,
			y: levelEngine.translateY,
			z: levelEngine.translateZ
		};
		iconPinSetting.l = pathPin;
		levelEngine.startSlideTo(0 * levelEngine.tapSize, 0 * levelEngine.tapSize, 1);
	}
	levelEngine.clearGroupDetails(document.getElementById('controls'));
	levelEngine.tileFromModel();
}
function promptClickAction(x, y) {
	document.getElementById('chooseFileInput').click();
}
