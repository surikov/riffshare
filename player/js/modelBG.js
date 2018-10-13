function fillBG(song) {
	bgModel.length = 0;
	var ww = settingPanelWidth;
	if (currentSong) {
		ww = settingPanelWidth + currentSong.duration * cellsPerSecond;
	}
	bgModel.push({
		id: 'subLayer1',
		x: 0,
		y: 0,
		w: ww,
		h: 128*noteLineHeight,
		z: [1, 2],
		l: [{
				kind: 'r',
				x: 0,
				y: 0,
				w: ww,
				h: 128*noteLineHeight,
				rx: 0.5,
				ry: 0.5,
				css: 'hexback1',
				a: function (xx, yy) {
					console.log('spot 1', xx, yy,ww, levelEngine.translateX, levelEngine.translateY, levelEngine.translateZ);
				}
			}
		]
	});
	bgModel.push({
		id: 'subLayer2',
		x: 0,
		y: 0,
		w: ww,
		h: 128*noteLineHeight,
		z: [2, 4],
		l: [{
				kind: 'r',
				x: 0,
				y: 0,
				w: ww,
				h: 128*noteLineHeight,
				rx: 0.5,
				ry: 0.5,
				css: 'hexback2',
				a: function (xx, yy) {
					console.log('spot 2', xx, yy, ww, levelEngine.translateX, levelEngine.translateY, levelEngine.translateZ);
				}
			}
		]
	});
	bgModel.push({
		id: 'subLayer3',
		x: 0,
		y: 0,
		w: ww,
		h: 128*noteLineHeight,
		z: [4, 8],
		l: [{
				kind: 'r',
				x: 0,
				y: 0,
				w: ww,
				h: 128*noteLineHeight,
				rx: 0.5,
				ry: 0.5,
				css: 'hexback3',
				a: function (xx, yy) {
					console.log('spot 3', xx, yy, ww, levelEngine.translateX, levelEngine.translateY, levelEngine.translateZ);
				}
			}
		]
	});
	bgModel.push({
		id: 'subLayer4',
		x: 0,
		y: 0,
		w: ww,
		h: 128*noteLineHeight,
		z: [8, 16],
		l: [{
				kind: 'r',
				x: 0,
				y: 0,
				w: ww,
				h: 128*noteLineHeight,
				rx: 0.5,
				ry: 0.5,
				css: 'hexback4',
				a: function (xx, yy) {
					console.log('spot 4', xx, yy, ww, levelEngine.translateX, levelEngine.translateY, levelEngine.translateZ);
				}
			}
		]
	});
	bgModel.push({
		id: 'subLayer5',
		x: 0,
		y: 0,
		w: ww,
		h: 128*noteLineHeight,
		z: [16, 32],
		l: [{
				kind: 'r',
				x: 0,
				y: 0,
				w: ww,
				h: 128*noteLineHeight,
				rx: 0.5,
				ry: 0.5,
				css: 'hexback5',
				a: function (xx, yy) {
					console.log('spot 5', xx, yy, ww, levelEngine.translateX, levelEngine.translateY, levelEngine.translateZ);
				}
			}
		]
	});
	bgModel.push({
		id: 'subLayer6',
		x: 0,
		y: 0,
		w: ww,
		h: 128*noteLineHeight,
		z: [32, 64],
		l: [{
				kind: 'r',
				x: 0,
				y: 0,
				w: ww,
				h: 128*noteLineHeight,
				rx: 0.5,
				ry: 0.5,
				css: 'hexback6',
				a: function (xx, yy) {
					console.log('spot 6', xx, yy, ww, levelEngine.translateX, levelEngine.translateY, levelEngine.translateZ);
				}
			}
		]
	});
	bgModel.push({
		id: 'subLayer7',
		x: 0,
		y: 0,
		w: ww,
		h: 128*noteLineHeight,
		z: [64, 128],
		l: [{
				kind: 'r',
				x: 0,
				y: 0,
				w: ww,
				h: 128*noteLineHeight,
				rx: 0.5,
				ry: 0.5,
				css: 'hexback7',
				a: function (xx, yy) {
					console.log('spot 7', xx, yy, ww, levelEngine.translateX, levelEngine.translateY, levelEngine.translateZ);
				}
			}
		]
	});
	bgModel.push({
		id: 'subLayer8',
		x: 0,
		y: 0,
		w: ww,
		h: 128*noteLineHeight,
		z: [128, 512],
		l: [{
				kind: 'r',
				x: 0,
				y: 0,
				w: ww,
				h: 128*noteLineHeight,
				rx: 0.5,
				ry: 0.5,
				css: 'hexback8',
				a: function (xx, yy) {
					console.log('spot 8', xx, yy, ww, levelEngine.translateX, levelEngine.translateY, levelEngine.translateZ);
				}
			}
		]
	});
}
