function fillModelControls() {
	var dividing=0.25;
	iconPinSetting = {
		kind: 'p',
		x: (levelEngine.viewWidth / levelEngine.tapSize) / 2 - 1/2-dividing -1,
		y: levelEngine.viewHeight / levelEngine.tapSize - 1.5,
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
		z: [1, 512],
		l: [{
				kind: 'r',
				x: (levelEngine.viewWidth / levelEngine.tapSize) / 2 - 1/2-dividing -1  ,
				y: levelEngine.viewHeight / levelEngine.tapSize - 1.5,
				w: 1,
				h: 1,
				css: 'buttonShadow',
				rx: 0.5,
				ry: 0.5
			}, {
				kind: 'r',
				x: (levelEngine.viewWidth / levelEngine.tapSize) / 2 - 1/2-dividing -1 + 0.05,
				y: levelEngine.viewHeight / levelEngine.tapSize - 1.5 + 0.05,
				w: 1 - 0.1,
				h: 1 - 0.1,
				css: 'buttonBack',
				rx: 0.45,
				ry: 0.45
			} // //
		, iconPinSetting //
		, {
				kind: 'r',
				x: (levelEngine.viewWidth / levelEngine.tapSize) / 2 - 1/2-dividing -1,
				y: levelEngine.viewHeight / levelEngine.tapSize - 1.5,
				w: 1,
				h: 1,
				css: 'buttonSpot',
				a: pinClickAction
			}
			//------------------------------------------------------------
		, {
				kind: 'r',
				x: (levelEngine.viewWidth / levelEngine.tapSize) / 2 - 1 / 2 ,
				y: levelEngine.viewHeight / levelEngine.tapSize - 1.5 ,
				w: 1,
				h: 1 ,
				css: 'buttonShadow',
				rx: 0.5,
				ry: 0.5
			}, {
				kind: 'r',
				x: (levelEngine.viewWidth / levelEngine.tapSize) / 2 - 1 / 2 + 0.05,
				y: levelEngine.viewHeight / levelEngine.tapSize - 1.5 + 0.05,
				w: 1 - 0.1,
				h: 1 - 0.1,
				css: 'buttonBack',
				rx: 0.45,
				ry: 0.45
			}, {
				kind: 'p',
				x: (levelEngine.viewWidth / levelEngine.tapSize) / 2 - 1 / 2,
				y: levelEngine.viewHeight / levelEngine.tapSize - 1.5,
				z: levelEngine.tapSize / 300,
				l: pathFolderBg,
				css: 'buttonFill'
			}, {
				kind: 'p',
				x: (levelEngine.viewWidth / levelEngine.tapSize) / 2 - 1 / 2,
				y: levelEngine.viewHeight / levelEngine.tapSize - 1.5,
				z: levelEngine.tapSize / 300,
				l: pathFolderFg,
				css: 'buttonFill'
			}, {
				kind: 'r',
				x: (levelEngine.viewWidth / levelEngine.tapSize) / 2 - 1 / 2,
				y: levelEngine.viewHeight / levelEngine.tapSize - 1.5,
				w: 1,
				h: 1,
				css: 'buttonSpot',
				a: promptClickAction
			}
			//------------------------------------------------------------
		, {
				kind: 'r',
				x: (levelEngine.viewWidth / levelEngine.tapSize) / 2 + 1 / 2 + dividing ,
				y: levelEngine.viewHeight / levelEngine.tapSize - 1.5 ,
				w: 1 ,
				h: 1,
				css: 'buttonShadow',
				rx: 0.5,
				ry: 0.5
			}, {
				kind: 'r',
				x: (levelEngine.viewWidth / levelEngine.tapSize) / 2 + 1 / 2 + dividing + 0.05,
				y: levelEngine.viewHeight / levelEngine.tapSize - 1.5 + 0.05,
				w: 1 - 0.1,
				h: 1 - 0.1,
				css: 'buttonBack',
				rx: 0.45,
				ry: 0.45
			}, {
				kind: 'p',
				x: (levelEngine.viewWidth / levelEngine.tapSize) / 2 + 1 / 2 + dividing,
				y: levelEngine.viewHeight / levelEngine.tapSize - 1.5,
				z: levelEngine.tapSize / 300,
				l: pathPlay,
				css: 'buttonFill'
			}, {
				kind: 'r',
				x: (levelEngine.viewWidth / levelEngine.tapSize) / 2 + 1 / 2 + dividing,
				y: levelEngine.viewHeight / levelEngine.tapSize - 1.5,
				w: 1,
				h: 1,
				css: 'buttonSpot',
				a: playClickAction
			}
			
			
			/*
			, {kind: 'p',x: 0,y: 0,z: 1,l: gearPath1,css: 'buttonStoke'}
			, {kind: 'p',x: 0,y: 0,z: 1,l: gearPath2,css: 'buttonStoke'}
			, {kind: 'p',x: 0,y: 0,z: 1,l: gearPath3,css: 'buttonStoke'}
			, {kind: 'p',x: 0,y: 0,z: 1,l: gearPath4,css: 'buttonStoke'}
			, {kind: 'p',x: 0,y: 0,z: 1,l: gearPath5,css: 'buttonStoke'}
			, {kind: 'p',x: 0,y: 0,z: 1,l: gearPath6,css: 'buttonStoke'}
			*/
		]
	});
}
