function addTimeLine(song, modelTimeline, labelPrefix, css, step, zoom) {
	for (var i = 0; i < song.duration; i = i + step) {
		modelTimeline.push({
			id: labelPrefix + i,
			x: i * noteRatio+settingWidth,
			y: 0,
			w: 50,
			h: 200,
			z: zoom,
			l: [{
				kind: 't',
				x: i * noteRatio+settingWidth,
				y: 1,
				t: formatSeconds(i),
				css: css
			}]
		});
	}
}

function formatSeconds(t) {
	var h = Math.floor(t / 3600);
	var m = Math.floor(t / 60) % 60;
	var s = Math.floor(t % 60);
	return '' + ('0' + h).slice(-2) + ':' + ('0' + m).slice(-2) + ':' + ('0' + s).slice(-2);
}
