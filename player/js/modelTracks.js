function replaceSong(song) {
	currentSong = song;
selectedTrack=0;
	timelineModel.length = 0;
	octavesModel.length = 0;
	addOctaveLine(song, octavesModel, 'octave13', 'octave1', [1, 3]);
	addOctaveLine(song, octavesModel, 'octave39', 'octave9', [3, 20]);
	addTimeLine(song, timelineModel, 'time1x', 'timeLabel1', 1, [1, 3]);
	addTimeLine(song, timelineModel, 'time3x', 'timeLabel3', 1, [3, 5]);
	addTimeLine(song, timelineModel, 'time5x', 'timeLabel5', 1, [5, 10]);
	addTimeLine(song, timelineModel, 'time10x', 'timeLabel10', 2, [10, 30]);
	addTimeLine(song, timelineModel, 'time30x', 'timeLabel30', 5, [30, 100]);
	addTimeLine(song, timelineModel, 'time100x', 'timeLabel100', 10, [100, 512]);

	resetSongTracks();
	fillSetting();
	fillBG();
	levelEngine.innerWidth = (song.duration * cellsPerSecond + settingPanelWidth) * levelEngine.tapSize;
	levelEngine.resetModel();
}

function addBars(song, tracksModel, activeModel) {
	for (var i = 0; i < song.duration; i = i + barDuration) {
		tracksModel.push({
			id: 'bar' + i,
			x: i * cellsPerSecond + settingPanelWidth,
			y: 0,
			w: barDuration * cellsPerSecond,
			h: 128 * noteLineHeight,
			z: [1, 100],
			l: []
		});
		activeModel.push({
			id: 'active' + i,
			x: i * cellsPerSecond + settingPanelWidth,
			y: 0,
			w: barDuration * cellsPerSecond,
			h: 128 * noteLineHeight,
			z: [1, 512],
			l: []
		});
	}
}

function addPlaceholders(song, tracksModel) {
	var counts = [];
	var mx=0;
	/*for (var i = 0; i < song.duration; i = i + barDuration) {
		tracksModel.push({
			id: 'bar' + i,
			x: i * cellsPerSecond + settingPanelWidth,
			y: 0,
			w: barDuration * cellsPerSecond,
			h: 128 * noteLineHeight,
			z: [100, 512],
			l: []
		});
	}*/
	for (var t = 0; t < currentSong.beats.length; t++) {
		var beat = currentSong.beats[t];
		for (var i = 0; i < beat.notes.length; i++) {
			var note = beat.notes[i];
			if (note) {
				var nn = Math.floor(note.when / barDuration);
				counts[nn] = counts[nn] ? counts[nn] : 0;
				counts[nn]++;
				if(mx<counts[nn]){
					mx=counts[nn];
				}
			}
		}
	}
	for (var t = 0; t < currentSong.tracks.length; t++) {
		var track = currentSong.tracks[t];
		for (var i = 0; i < track.notes.length; i++) {
			var note = track.notes[i];
			if (note) {
				var nn = Math.floor(note.when / barDuration);
				counts[nn] = counts[nn] ? counts[nn] : 0;
				counts[nn]++;
				if(mx<counts[nn]){
					mx=counts[nn];
				}
			}
		}
	}
	//console.log(mx,counts);
	for(var i=0;i<counts.length;i++){
		counts[i] = counts[i] ? counts[i] : 0;
		if(counts[i]>1*mx/6){
			var css='density1';
			if(counts[i]>2*mx/6){
				css='density2';
			}
			if(counts[i]>3*mx/6){
				css='density3';
			}
			if(counts[i]>4*mx/6){
				css='density4';
			}
			if(counts[i]>5*mx/6){
				css='density5';
			}

			tracksModel.push({
				id: 'placeholder' + i,
				x: i* barDuration* cellsPerSecond + settingPanelWidth,
				y: 0,
				w: barDuration* cellsPerSecond,
				h: 128 * noteLineHeight,
				z: [100, 512],
				l: [{
					kind: 'r',
					x: i* barDuration* cellsPerSecond + settingPanelWidth,
					y: 0,
					w: barDuration* cellsPerSecond,
					h: 128 * noteLineHeight,
					css: css
				}]
			});
		}
	}
}

function resetSongTracks() {
	tracksModel.length = 0;
	activeModel.length = 0;
	addBars(currentSong, tracksModel, activeModel);
	var cntr = 0;
	for (var t = 0; t < currentSong.tracks.length; t++) {
		var track = currentSong.tracks[t];
		if (cntr != selectedTrack) {
			addInsTrack(track, tracksModel);
		}
		cntr++;
	}
	for (var t = 0; t < currentSong.beats.length; t++) {
		var beat = currentSong.beats[t];
		if (cntr != selectedTrack) {
			addDrumTrack(beat, tracksModel);
		}
		cntr++;
	}
	addPlaceholders(currentSong, tracksModel);
	if (selectedTrack < currentSong.tracks.length) {
		addInsTrack(currentSong.tracks[selectedTrack], activeModel, true);
	} else {
		addDrumTrack(currentSong.beats[selectedTrack - currentSong.tracks.length], activeModel, true);
	}
}

function addDrumTrack(beat, tracksModel, hl) {
	var css = 'abeat';
	if (hl) {
		css = 'selbeat';
		console.log(beat);
	}
	for (var i = 0; i < beat.notes.length; i++) {
		var note = beat.notes[i];
		if (note) {
			var x = note.when * cellsPerSecond + settingPanelWidth;
			var d = 0.01;
			var nn = Math.floor(note.when / barDuration);
			var g = tracksModel[nn];
			g.l.push({
				kind: 'r',
				x: x,
				y: beat.n * noteLineHeight - 30 * noteLineHeight,
				w: 1.5 * noteLineHeight,
				h: 1.5 * noteLineHeight,
				rx: 0.3 * noteLineHeight,
				ry: 0.3 * noteLineHeight,
				css: css
			});
		}
	}
}

function addInsTrack(track, tracksModel, hl) {
	var css = 'atrack';
	if (hl) {
		css = 'seltrack';
		//console.log(track);
	}
	for (var i = 0; i < track.notes.length; i++) {
		var note = track.notes[i];
		var d = note.duration * cellsPerSecond - noteLineHeight;
		d = (d) ? d : 0.001;
		var x1 = note.when * cellsPerSecond + 0.5 * noteLineHeight + settingPanelWidth;
		var y1 = 127 * noteLineHeight - note.pitch * noteLineHeight;
		var x2 = x1 + d;
		var y2 = 127 * noteLineHeight - note.pitch * noteLineHeight;
		if (note.duration > 9) {
			note.duration = 1;
		}
		var nn = Math.floor(note.when / barDuration);
		var g = tracksModel[nn];
		if (note.slides.length) {
			x1 = (note.when + note.slides[0].when) * cellsPerSecond + 0.5 * noteLineHeight + settingPanelWidth;
			y1 = 127 * noteLineHeight - note.slides[0].pitch * noteLineHeight;
			for (var s = 0; s < note.slides.length - 1; s++) {
				g.l.push({
					kind: 'l',
					x1: x1,
					y1: y1,
					x2: (note.when + note.slides[s].when) * cellsPerSecond + 0.5 * noteLineHeight + settingPanelWidth,
					y2: 127 * noteLineHeight - note.slides[s].pitch * noteLineHeight,
					css: css
				});
				x1 = (note.when + note.slides[s].when) * cellsPerSecond + 0.5 * noteLineHeight + settingPanelWidth;
				y1 = 127 * noteLineHeight - note.slides[s].pitch * noteLineHeight;
			}
			x1 = (note.when + note.slides[note.slides.length - 1].when) * cellsPerSecond + 0.5 * noteLineHeight + settingPanelWidth;
			y1 = 127 * noteLineHeight - note.slides[note.slides.length - 1].pitch * noteLineHeight;
		}
		g.l.push({
			kind: 'l',
			x1: x1,
			y1: y1,
			x2: x2,
			y2: y2,
			css: css
		});
	}
}