function replaceSong(song) {
	currentSong=song;
	tracksModel.length = 0;
	timelineModel.length = 0;
	octavesModel.length = 0;
	addOctaveLine(song, octavesModel, 'octave13', 'octave1', [1, 3]);
	addOctaveLine(song, octavesModel, 'octave39', 'octave9', [3, 9]);
	addTimeLine(song, timelineModel, 'time1x', 'timeLabel1', 1, [1, 3]);
	addTimeLine(song, timelineModel, 'time3x', 'timeLabel3', 2, [3, 5]);
	addTimeLine(song, timelineModel, 'time5x', 'timeLabel5', 2, [5, 10]);
	addTimeLine(song, timelineModel, 'time10x', 'timeLabel10', 5, [10, 30]);
	addTimeLine(song, timelineModel, 'time30x', 'timeLabel30', 15, [30, 100]);
	addBars(song, tracksModel);
	for (var t = 0; t < song.tracks.length; t++) {
		var track = song.tracks[t];
		for (var i = 0; i < track.notes.length; i++) {
			var note = track.notes[i];
			var d = note.duration * noteRatio - 1;
			d = (d) ? d : 0.001;
			var x1 = note.when * noteRatio + 0.5 + settingWidth;
			var y1 = 127 - note.pitch;
			var x2 = x1 + d;
			var y2 = 127 - note.pitch;
			if (note.duration > 9) {
				note.duration = 1;
			}
			var nn = Math.floor(note.when / 3);
			var g = tracksModel[nn];
			if (note.slides.length) {
				x1 = (note.when + note.slides[0].when) * noteRatio + 0.5 + settingWidth;
				y1 = 127 - note.slides[0].pitch;
				for (var s = 0; s < note.slides.length - 1; s++) {
					g.l.push({
						kind: 'l',
						x1: x1,
						y1: y1,
						x2: (note.when + note.slides[s].when) * noteRatio + 0.5 + settingWidth,
						y2: 127 - note.slides[s].pitch,
						css: 'atrack'
					});
					x1 = (note.when + note.slides[s].when) * noteRatio + 0.5 + settingWidth;
					y1 = 127 - note.slides[s].pitch;
				}
				x1 = (note.when + note.slides[note.slides.length - 1].when) * noteRatio + 0.5 + settingWidth;
				y1 = 127 - note.slides[note.slides.length - 1].pitch;
			}
			g.l.push({
				kind: 'l',
				x1: x1,
				y1: y1,
				x2: x2,
				y2: y2,
				css: 'atrack'
			});
		}
	}
	for (var t = 0; t < song.beats.length; t++) {
		var beat = song.beats[t];
		for (var i = 0; i < beat.notes.length; i++) {
			var note = beat.notes[i];
			if (note) {
				var x = note.when * noteRatio + settingWidth;
				var d = 0.01;
				var nn = Math.floor(note.when / 3);
				var g = tracksModel[nn];
				g.l.push({
					kind: 'r',
					x: x,
					y: beat.n - 30,
					w: 1.5,
					h: 1.5,
					rx: 0.3,
					ry: 0.3,
					css: 'abeat'
				});
			}
		}
	}
	fillSetting();
	levelEngine.innerWidth = (song.duration * noteRatio + settingWidth) * levelEngine.tapSize;
	levelEngine.resetModel();	
}
function addBars(song, modelTracks) {
	for (var i = 0; i < song.duration; i = i + 3) {
		var g = {
			id: 'bar' + i,
			x: i * noteRatio + settingWidth,
			y: 0,
			w: 3 * noteRatio,
			h: 128,
			z: [1, 100],
			l: []
		}
		modelTracks.push(g);
	}
}
