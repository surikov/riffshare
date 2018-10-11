function verticalSlider(id, minZ, maxZ, xx, yy, ww, hh, count, value, action) {
	var size = masterVolume * (hh - ww);
	var slider = {
		id: id,
		x: xx,
		y: yy,
		w: ww,
		h: hh,
		z: [minZ, maxZ],
		l: [{
				kind: 'l',
				x1: xx,
				y1: yy + ww / 2,
				x2: xx,
				y2: yy + hh - ww / 2,
				css: 'masterShadow'
			}, {
				kind: 'l',
				x1: xx,
				y1: yy + hh - ww / 2 - size,
				x2: xx + 0.0001,
				y2: yy + hh - ww / 2,
				css: 'masterLines'
			}
		]
	};
	for (var i = 0; i < count; i++) {
		addVerticalSliderSpot(xx, yy, hh, ww, count, i, slider, action);
	}
	return slider;
}
function addVerticalSliderSpot(xx, yy, hh, ww, count, n, slider, action) {
	slider.l.push({
		kind: 'r',
		x: xx - ww / 2,
		y: yy + n * hh / count,
		w: ww,
		h: hh / count - 0.1,
		css: 'buttonSpot',
		a: function (x, y) {
			if (action) {
				action(1 - n / (count - 1));
			}
		}
	});
}
