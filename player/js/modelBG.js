function fillBG(song) {
	bgModel.length = 0;
	var ww = settingWidth;
	if (currentSong) {
		ww = settingWidth + currentSong.duration * noteRatio;
	}
	bgModel.push({
		id: 'subLayer1',
		x: 0,
		y: 0,
		w: ww,
		h: 128,
		z: [1, 2],
		l: [{
				kind: 'r',
				x: 0,
				y: 0,
				w: ww,
				h: 128,
				rx: 0.5,
				ry: 0.5,
				css: 'tilecomb1',
				a: function (xx, yy) {
					console.log('spot 1', ww, levelEngine.translateX, levelEngine.translateY, levelEngine.translateZ);
				}
			}
		]
	});
	bgModel.push({
		id: 'subLayer2',
		x: 0,
		y: 0,
		w: ww,
		h: 128,
		z: [2, 4],
		l: [{
				kind: 'r',
				x: 0,
				y: 0,
				w: ww,
				h: 128,
				rx: 0.5,
				ry: 0.5,
				css: 'tilecomb2',
				a: function (xx, yy) {
					console.log('spot 2', ww, levelEngine.translateX, levelEngine.translateY, levelEngine.translateZ);
				}
			}
		]
	});
	bgModel.push({
		id: 'subLayer3',
		x: 0,
		y: 0,
		w: ww,
		h: 128,
		z: [4, 8],
		l: [{
				kind: 'r',
				x: 0,
				y: 0,
				w: ww,
				h: 128,
				rx: 0.5,
				ry: 0.5,
				css: 'tilecomb4',
				a: function (xx, yy) {
					console.log('spot 3', ww, levelEngine.translateX, levelEngine.translateY, levelEngine.translateZ);
				}
			}
		]
	});
	bgModel.push({
		id: 'subLayer4',
		x: 0,
		y: 0,
		w: ww,
		h: 128,
		z: [8, 16],
		l: [{
				kind: 'r',
				x: 0,
				y: 0,
				w: ww,
				h: 128,
				rx: 0.5,
				ry: 0.5,
				css: 'tilecomb8',
				a: function (xx, yy) {
					console.log('spot 4', ww, levelEngine.translateX, levelEngine.translateY, levelEngine.translateZ);
				}
			}
		]
	});
	bgModel.push({
		id: 'subLayer5',
		x: 0,
		y: 0,
		w: ww,
		h: 128,
		z: [16, 100],
		l: [{
				kind: 'r',
				x: 0,
				y: 0,
				w: ww,
				h: 128,
				rx: 0.5,
				ry: 0.5,
				css: 'tilecomb16',
				a: function (xx, yy) {
					console.log('spot 5', ww, levelEngine.translateX, levelEngine.translateY, levelEngine.translateZ);
				}
			}
		]
	});
}
