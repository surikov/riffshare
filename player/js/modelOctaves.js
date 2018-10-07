function addOctaveLine(song, modelOctaves, labelPrefix, css, zoom) {
	for (var i = 1; i < 10; i++) {
		octavesModel.push({
			id: labelPrefix + i,
			x: 0,
			y: 127*noteLineHeight - i * 12*noteLineHeight,
			w: 50,
			h: 2,
			z: zoom,
			l: [{
				kind: 't',
				x: 0,
				y: 127*noteLineHeight - i * 12*noteLineHeight,
				t: '' + i,
				css: css
			}]
		});
	}
}
