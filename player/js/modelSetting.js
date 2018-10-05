function findFirstIns(player, nn) {
	for (var i = 0; i < player.loader.instrumentKeys().length; i++) {
		if (nn == 1 * player.loader.instrumentKeys()[i].substring(0, 3)) {
			return i;
		}
	}
}
function findFirstDrum(player, nn) {
	for (var i = 0; i < player.loader.drumKeys().length; i++) {
		if (nn == 1 * player.loader.drumKeys()[i].substring(0, 2)) {
			return i;
		}
	}
}
function selectTrack() {
	//console.log(this.nn);
	selectedTrack = this.nn;
	fillSetting();
	resetSongTracks();
	if (anchor) {
		iconPinSetting.l = pathList;
		levelEngine.startSlideTo(anchor.x, anchor.y, anchor.z);
		anchor = null;
	}
	levelEngine.resetModel();
}
function addTrackSelectSpot(title, names, y, nn, selected) {
	if (!(selected)) {
		names.l.push({
			kind: 'r',
			x: 0.5,
			y: y,
			w: 1.5,
			h: 1.5,
			rx: 0.75,
			ry: 0.75,
			css: 'trackButton'
		});
	}
	names.l.push({
		kind: 't',
		x: 1,
		y: y + 1.5,
		t: title,
		css: 'trackNames'
	});
	if (!(selected)) {
		var spot = {
			kind: 'r',
			x: 0.5,
			y: y,
			w: 1.5,
			h: 1.5,
			css: 'buttonSpot',
			nn: nn,
			a: null
		};
		spot.a = selectTrack.bind(spot);
		names.l.push(spot);
	}
}
function fillSetting() {
	//console.log('selectedTrack',selectedTrack);
	settingModel.length = 0;
	var ww = settingWidth;
	if (currentSong) {
		ww = settingWidth + currentSong.duration * noteRatio;
	}
	if (currentSong) {
		var names = {
			id: 'namesLayer',
			x: 0,
			y: 0,
			w: settingWidth,
			h: 128,
			z: [1, 6],
			l: []
		};
		var cntr = 0;
		for (var t = 0; t < currentSong.tracks.length; t++) {
			var track = currentSong.tracks[t];
			var nn = findFirstIns(player, track.program);
			var info = player.loader.instrumentInfo(nn);
			addTrackSelectSpot(info.title, names, 2 * t + 0.5, cntr, selectedTrack == cntr);
			cntr++;
		}
		for (var t = 0; t < currentSong.beats.length; t++) {
			var beat = currentSong.beats[t];
			var nn = findFirstDrum(player, beat.n);
			var info = player.loader.drumInfo(nn);
			addTrackSelectSpot(info.title + ': Percussion', names, 2 * (t + currentSong.tracks.length) + 0.5, cntr, selectedTrack == cntr);
			cntr++;
		}
		settingModel.push(names);
	}
}
