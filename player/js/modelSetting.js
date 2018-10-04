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
function fillSetting() {
	settingModel.length = 0;
	var ww = settingWidth;
	if (currentSong) {
		ww = settingWidth + currentSong.duration * noteRatio;
	}
	//console.log(currentSong);
	
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
		/*names.l.push({
			kind: 't',
			x: 10,
			y: 20,
			t: 'Name Qwerty Asdf',
			css: 'octave9'
		});
		names.l.push({
			kind: 't',
			x: 10,
			y: 10,
			t: '22222',
			css: 'octave9'
		});*/
		var cntr=0;
		for (var t = 0; t < currentSong.tracks.length; t++) {
			var track = currentSong.tracks[t];
			var nn = findFirstIns(player, track.program);
			var info = player.loader.instrumentInfo(nn);
			//console.log(track,info);
			names.l.push({
				kind: 'r',
				x: 0.5,
				y: 2*t+0.5,
				w:1.5,
				h:1.5,
				rx:0.75,
				ry:0.75,
				css: 'trackButton'
			});
			names.l.push({
				kind: 't',
				x: 1,
				y: 2*t+2,
				t: info.title,
				css: 'trackNames'
			});
			var f=function(){console.dir(this);};
			console.dir(f);
			var spot={
				kind: 'r',
				x: 0.5,
				y: 2*t+0.5,
				w: 1.5,
				h: 1.5,
				css: 'buttonSpot',
				nn:cntr,
				a: f
			};
			names.l.push(spot);
			cntr++;
		}
		for (var t = 0; t < currentSong.beats.length; t++) {
			var beat = currentSong.beats[t];
			var nn = findFirstDrum(player, beat.n);
			var info = player.loader.drumInfo(nn);
			//console.log(beat,info);
			names.l.push({
				kind: 't',
				x: 1,
				y: 2*(t+currentSong.tracks.length)+2,
				t: info.title+': Percussion',
				css: 'trackNames'
			});
		}
		settingModel.push(names);
	}
}
