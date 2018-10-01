function addOctaveLine(song, modelOctaves, labelPrefix, css, zoom) {
	for (var i = 1; i < 10; i++) {
		octavesModel.push({
			id: labelPrefix + i,
			x: 0,
			y: 127 - i * 12,
			w: 50,
			h: 2,
			z: zoom,
			l: [{
				kind: 't',
				x: 0,
				y: 127 - i * 12,
				t: '' + i,
				css: css
			}]
		});
	}
}
