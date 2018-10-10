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
function addSelectTrackSpot(names, y, nn) {
	names.l.push({
		kind: 'r',
		x: 3.5,
		y: y + 3,
		w: 6,
		h: 6,
		css: 'buttonSpot',
		a: function (xx, yy) {
			levelEngine.startSlideTo(0,  - (y + 2) * levelEngine.tapSize, 1);
		}
	});
}
function addTrackTitle(title, names, controls, y, nn, selected) {
	names.l.push({
		kind: 'r',
		x: 3.5,
		y: y + 3,
		w: 6,
		h: 6,
		rx: 3,
		ry: 3,
		css: selected ? 'trackActiveButton' : 'trackButton'
	});
	names.l.push({
		kind: 't',
		x: 11,
		y: y + 8,
		t: title,
		css: 'trackNames'
	});
	addSelectTrackSpot(names, y, nn)
	controls.l.push({
		kind: 't',
		x: 1,
		y: y + 3,
		t: title,
		css: 'smallNames'
	});
}
function fillSetting() {
	settingModel.length = 0;
	//subSettingModel.length = 0;
	var ww = settingPanelWidth;
	if (currentSong) {
		ww = settingPanelWidth + currentSong.duration * cellsPerSecond;
	}
	if (currentSong) {
		var names = {
			id: 'namesLayer',
			x: 0,
			y: 0,
			w: settingPanelWidth,
			h: 128 * noteLineHeight,
			z: [3, 9],
			l: []
		};
		var controls = {
			id: 'namesControlsLayer',
			x: 0,
			y: 0,
			w: settingPanelWidth,
			h: 128 * noteLineHeight,
			z: [1, 3],
			l: []
		};
		var cntr = 0;
		for (var t = 0; t < currentSong.tracks.length; t++) {
			var track = currentSong.tracks[t];
			var nn = findFirstIns(player, track.program);
			var info = player.loader.instrumentInfo(nn);
			addTrackTitle(info.title, names, controls, settingTracksTop + 10 * t, cntr, selectedTrack == cntr);
			cntr++;
		}
		for (var t = 0; t < currentSong.beats.length; t++) {
			var beat = currentSong.beats[t];
			var nn = findFirstDrum(player, beat.n);
			var info = player.loader.drumInfo(nn);
			addTrackTitle(info.title + ': Percussion', names, controls, settingTracksTop + 10 * (t + currentSong.tracks.length), cntr, selectedTrack == cntr);
			cntr++;
		}
		settingModel.push(names);
		settingModel.push(controls);
		fillMaster(6.5,4,40,6,11);
	}
}
function addMasterVolumeSpot(xx,yy,hh,ww,cnt,n, master) {
	
	master.l.push({
		kind: 'r',
		x: xx-ww/2,
		y: yy+n*hh/cnt,
		w: ww+10,
		h: hh/cnt-0.1,
		css: 'buttonSpot',
		a: function (x, y) {
			console.log(masterVolume);
			masterVolume = 1 - n / 9;
			console.log(masterVolume);
			fillSetting();
			//resetSongTracks();
			levelEngine.resetModel();
		}
	});
}
function fillMaster(xx,yy,hh,ww,cnt) {
	console.log(yy+hh-masterVolume*(hh-ww),yy+hh-ww/2);
	console.log(yy+hh-0.5*hh+ww/2,yy+hh-ww/2);
	var master = {
		id: 'masterLayer',
		x: 0,
		y: 0,
		w: settingPanelWidth,
		h: 128 * noteLineHeight,
		z: [1, 100],
		l: [{
				kind: 'l',
				x1: xx,
				y1: yy+ww/2,
				x2: xx,
				y2: yy+hh-ww/2,
				css: 'masterShadow'
			}, {
				kind: 'l',
				x1: xx,
				y1: yy+hh-ww/2-masterVolume*(hh-ww),
				x2: xx+0.0001,
				y2: yy+hh-ww/2,//5.999999 + 6 * (9 - 9 * masterVolume),
				css: 'masterLines'
			}
		]
	};
	for (var i = 0; i < cnt; i++) {
		addMasterVolumeSpot(xx,yy,hh,ww,cnt,i, master);
	}
	settingModel.push(master);
}
function createSlider(){
	return {
				kind: 'l',
				x1: 6.5,
				y1: 6,
				x2: 6.5,
				y2: 6 * 8 + 6,
				css: 'masterShadow'
			}, {
				kind: 'l',
				x1: 6.5,
				y1: 6 * 9,
				x2: 6.501,
				y2: 5.999999 + 6 * (9 - 9 * masterVolume),
				css: 'masterLines'
			};
}