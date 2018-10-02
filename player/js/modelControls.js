function fillModelControls() {
	iconPinSetting = {
		kind: 'p',
		x: (levelEngine.viewWidth / levelEngine.tapSize) / 2 - 1 - 0.1 - 1 / 2,
		y: levelEngine.viewHeight/ levelEngine.tapSize-1.5,
		z: levelEngine.tapSize / 300,
		l: pathList,
		css: 'buttonFill'
	};
	controlsModel.length = 0;
	controlsModel.push(
		//------------------------------------------------------------
	{
		id: 'controlsLayer',
		x: 0.25,
		y: 0.25,
		w: 3,
		h: 1,
		z: [1, 100],
		l: [{
				kind: 'r',
				x: (levelEngine.viewWidth / levelEngine.tapSize) / 2 - 1 - 0.1 - 1 / 2 - 0.05,
				y: levelEngine.viewHeight/ levelEngine.tapSize-1.5 - 0.05,
				w: 1 + 0.1,
				h: 1 + 0.1,
				css: 'buttonBack',
				rx: 0.55,
				ry: 0.55
			} //
		, iconPinSetting //
		, {
				kind: 'r',
				x: (levelEngine.viewWidth / levelEngine.tapSize) / 2 - 1 - 0.1 - 1 / 2,
				y: levelEngine.viewHeight/ levelEngine.tapSize-1.5,
				w: 1,
				h: 1,
				css: 'buttonSpot',
				a: pinClickAction
			}
			//------------------------------------------------------------
		, {
				kind: 'r',
				x: (levelEngine.viewWidth / levelEngine.tapSize) / 2 -1/2 - 0.05,
				y: levelEngine.viewHeight/ levelEngine.tapSize-1.5 - 0.05,
				w: 1 + 0.1,
				h: 1 + 0.1,
				css: 'buttonBack',
				rx: 0.55,
				ry: 0.55
			}, {
				kind: 'p',
				x: (levelEngine.viewWidth / levelEngine.tapSize) / 2 -1/2,
				y: levelEngine.viewHeight/ levelEngine.tapSize-1.5,
				z: levelEngine.tapSize / 300,
				l: pathFolderBg,
				css: 'buttonFill'
			}, {
				kind: 'p',
				x: (levelEngine.viewWidth / levelEngine.tapSize) / 2 -1/2,
				y: levelEngine.viewHeight/ levelEngine.tapSize-1.5,
				z: levelEngine.tapSize / 300,
				l: pathFolderFg,
				css: 'buttonFill'
			}, {
				kind: 'r',
				x: (levelEngine.viewWidth / levelEngine.tapSize) / 2 -1/2,
				y: levelEngine.viewHeight/ levelEngine.tapSize-1.5,
				w: 1,
				h: 1,
				css: 'buttonSpot',
				a: promptClickAction
			}
			//------------------------------------------------------------
		, {
				kind: 'r',
				x: (levelEngine.viewWidth / levelEngine.tapSize) / 2 + 1/2 +0.1- 0.05,
				y: levelEngine.viewHeight/ levelEngine.tapSize-1.5 - 0.05,
				w: 1 + 0.1,
				h: 1 + 0.1,
				css: 'buttonBack',
				rx: 0.55,
				ry: 0.55
			}, {
				kind: 'p',
				x: (levelEngine.viewWidth / levelEngine.tapSize) / 2 + 1/2+0.1,
				y: levelEngine.viewHeight/ levelEngine.tapSize-1.5,
				z: levelEngine.tapSize / 300,
				l: pathPlay,
				css: 'buttonFill'
			}, {
				kind: 'r',
				x: (levelEngine.viewWidth / levelEngine.tapSize) / 2 + 1/2+0.1,
				y: levelEngine.viewHeight/ levelEngine.tapSize-1.5,
				w: 1,
				h: 1,
				css: 'buttonSpot',
				a: playClickAction
			}
		]
	});
}
