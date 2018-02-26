FretChordSheet.prototype.startPlayAll = function () {
	console.log('startPlayAll');
	this.initAudio();
	this.air = true;
	var me = this;
	this.waitPresets(function () { me.startQueue(); });
};
FretChordSheet.prototype.stopPlay = function () {
	console.log('stopPlay');
	this.air = false;
	this.hideTicker();
	this.stopPlayLoop();
};
FretChordSheet.prototype.isMobile = function () {
	var Uagent = navigator.userAgent || navigator.vendor || window.opera;
	return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(Uagent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(Uagent.substr(0, 4)));
};
FretChordSheet.prototype.initAudio = function () {
	console.log('initAudio');
	if (!(this.audioContext)) {
		console.log('create audio context');
		var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
		this.audioContext = new AudioContextFunc();
	}
	if (this.audioContext.state == 'suspended') {
		console.log('resume audio context');
		try { this.audioContext.resume(); } catch (e) { console.log(e); };
	}
	if (!(this.player)) {
		console.log('create player');
		this.player = new WebAudioFontPlayer();
	}
	if (!(this.equalizer)) {
		console.log('create channel');
		this.destination = this.audioContext.destination;
		this.equalizer = this.player.createChannel(this.audioContext);
		this.output = this.audioContext.createGain();
		if (this.isMobile()) {
			console.log('no echo for mobile mode');
			this.equalizer.output.connect(this.output);
		} else {
			this.echo = this.player.createReverberator(this.audioContext);
			this.echo.wet.gain.setTargetAtTime(0.5, 0, 0.0001);
			this.echo.output.connect(this.output);
			this.equalizer.output.connect(this.echo.input);
		}
		/*
		this.delay1=this.audioContext.createDelay();
		this.delay1.delayTime.setTargetAtTime(0.025, 0, 0.0001);
		this.amount1=this.audioContext.createGain();
		this.amount1.gain.setTargetAtTime(0.1, 0, 0.0001);
		this.delay1.connect(this.amount1);
		this.amount1.connect(this.output);		
		this.equalizer.output.connect(this.delay1);

		this.delay2=this.audioContext.createDelay();
		this.delay2.delayTime.setTargetAtTime(0.05, 0, 0.0001);
		this.amount2=this.audioContext.createGain();
		this.amount2.gain.setTargetAtTime(0.1, 0, 0.0001);
		this.delay2.connect(this.amount2);
		this.amount2.connect(this.output);		
		this.equalizer.output.connect(this.delay2);

		this.delay3=this.audioContext.createDelay();
		this.delay3.delayTime.setTargetAtTime(0.075, 0, 0.0001);
		this.amount3=this.audioContext.createGain();
		this.amount3.gain.setTargetAtTime(0.1, 0, 0.0001);
		this.delay3.connect(this.amount3);
		this.amount3.connect(this.output);		
		this.equalizer.output.connect(this.delay3);

		this.equalizer.output.connect(this.output);
		*/

		this.output.connect(this.destination);
		this.initPresets();
	}
};
FretChordSheet.prototype.initPresets = function () {
	for (var i = 0; i < this.drumInfo.length; i++) {
		this.player.adjustPreset(this.audioContext, this.drumInfo[i].sound);
	}
	for (var i = 0; i < this.trackInfo.length; i++) {
		this.player.adjustPreset(this.audioContext, this.trackInfo[i].sound);
		if (this.trackInfo[i].linkedSlap) {
			this.player.adjustPreset(this.audioContext, this.trackInfo[i].linkedSlap.sound);
		}
		if (this.trackInfo[i].linkedPalmMute) {
			this.player.adjustPreset(this.audioContext, this.trackInfo[i].linkedPalmMute.sound);
		}
		if (this.trackInfo[i].linkedHarmonics) {
			this.player.adjustPreset(this.audioContext, this.trackInfo[i].linkedHarmonics.sound);
		}
	}
	//this.checkPresets();
};
FretChordSheet.prototype.checkZones = function (preset) {
	for (var i = 0; i < preset.zones.length; i++) {
		if (!(preset.zones[i].buffer)) {
			return false;
		}
	}
	return true;
};
FretChordSheet.prototype.waitPresets = function (afterDone) {
	if (this.air) {
		var ratio = this.checkPresets();
		console.log('wait', ratio);
		if (ratio < 1) {
			var me = this;
			setTimeout(
				function () {
					me.waitPresets(afterDone);
				}
				, 1111);
		} else {
			afterDone();
		}
	}
};
FretChordSheet.prototype.checkPresets = function () {
	var presetCount = 0;
	var checkedCount = 0;
	for (var i = 0; i < this.drumInfo.length; i++) {
		presetCount++;
		if (this.checkZones(this.drumInfo[i].sound)) {
			checkedCount++;
		}
	}
	for (var i = 0; i < this.trackInfo.length; i++) {
		presetCount++;
		if (this.checkZones(this.trackInfo[i].sound)) {
			checkedCount++;
		}
		if (this.trackInfo[i].linkedSlap) {
			presetCount++;
			if (this.checkZones(this.trackInfo[i].linkedSlap.sound)) {
				checkedCount++;
			}
		}
		if (this.trackInfo[i].linkedPalmMute) {
			presetCount++;
			if (this.checkZones(this.trackInfo[i].linkedPalmMute.sound)) {
				checkedCount++;
			}
		}
		if (this.trackInfo[i].linkedHarmonics) {
			presetCount++;
			if (this.checkZones(this.trackInfo[i].linkedHarmonics.sound)) {
				checkedCount++;
			}
		}
	}
	console.log('presets', presetCount, checkedCount);
	return checkedCount / presetCount;
};
FretChordSheet.prototype.startQueue = function () {
	if (this.air) {
		console.log('startQueue');
		this.showTicker();
		this.startPlayLoop();
	}
};
FretChordSheet.prototype.moveTicker = function (measureNum, beat16) {
	if (this.tickerLine) {
		this.tickerX = this.findBeatX(measureNum, beat16 * 12);
		//beat4*this.tiler.tapSize*3*8;
		//console.log(this.tickerX);
		var minfo = this.measureInfo(measureNum);
		this.tickerLine.setAttributeNS(null, 'width', this.tiler.tapSize * 3 * minfo.duration4 * 8);
		//this.tickerLine.setAttribute('transform', 'translate(' + this.tickerX + ')');
		this.tickerLine.setAttributeNS(null, 'x', this.tickerX);
	}
};
FretChordSheet.prototype.hideTicker = function () {
	if (this.tickerLine) {
		this.tickerLine.setAttributeNS(null, 'fill', 'rgba(255,255,255,0.0000001)');
	}
};
FretChordSheet.prototype.showTicker = function () {
	if (this.tickerLine) {
		this.tickerLine.setAttributeNS(null, 'fill', 'rgba(255,255,255,0.5)');
	}
};
FretChordSheet.prototype.startPlayLoop = function () {
	this.stopPlayLoop();
	var minfo = this.measureInfo(0);
	var wholeNoteDuration = 4 * 60 / minfo.tempo;
	var measureNum = 0;
	if (this.selection) {
		if (this.selection.to) {
			measureNum = this.selection.from - 1;
		}
	}
	//var beat4 = 0;
	var beat16 = 0;
	this.playBeatAt(this.audioContext.currentTime, measureNum, beat16);
	this.moveTicker(measureNum, beat16);
	var nextLoopTime = this.audioContext.currentTime + 1 / 16 * wholeNoteDuration;
	var me = this;
	this.loopIntervalID = setInterval(function () {
		if (me.air) {
			if (me.audioContext.currentTime > nextLoopTime - 1 / 16 * wholeNoteDuration) {
				try {
					//me.moveTicker(measureNum,beat4);
					beat16++;
					if (beat16 >= 4 * me.measures[measureNum].duration4) {
						beat16 = 0;
						measureNum++;
						var firstMeasureNum = 0;
						var lastMeasureNum = me.measures.length - 1;
						if (me.selection) {
							if (me.selection.to) {
								firstMeasureNum = me.selection.from - 1;
								lastMeasureNum = me.selection.to - 1;
							}
						}
						if (measureNum > lastMeasureNum) {
							measureNum = firstMeasureNum;
						}
						me.moveTicker(measureNum, beat16);
						minfo = me.measureInfo(measureNum, beat16);
						wholeNoteDuration = 4 * 60 / minfo.tempo;
						//console.log(measureNum, 'nodes', me.player.envelopes.length, 'now', me.audioContext.currentTime, 'tick', 1 / 16 * wholeNoteDuration);
					}
					if (nextLoopTime <= me.audioContext.currentTime) {
						nextLoopTime = me.audioContext.currentTime
					}
					me.playBeatAt(nextLoopTime, measureNum, beat16);
					nextLoopTime = nextLoopTime + 1 / 16 * wholeNoteDuration;

				} catch (ex) {
					console.log(ex);
					me.stopPlay();
					document.getElementById('playimg').src = 'img/play.png';
				}
			}
		}
	}, 33);
}
FretChordSheet.prototype.stopPlayLoop = function () {
	clearInterval(this.loopIntervalID);
	this.cancelQueue();
}
FretChordSheet.prototype.cancelQueue = function () {
	this.player.cancelQueue(this.audioContext);
}
FretChordSheet.prototype.playBeatAt = function (when, measureNum, beat16) {
	//console.log('playBeatAt', when, measureNum, beat4);
	var minfo = this.measures[measureNum];
	wholeNoteDuration = 4 * 60 / minfo.tempo;
	for (var i = 0; i < minfo.beats.length; i++) {
		var binfo = minfo.beats[i];
		var whenPlay = when + wholeNoteDuration * binfo.start192 / 192 - wholeNoteDuration * beat16 / 16;
		if (binfo.start192 >= 12 * beat16 && binfo.start192 < 12 * (beat16 + 1)) {
			//console.log('send', whenPlay, measureNum, beat16);
			for (var d = 0; d < binfo.drums.length; d++) {
				if (binfo.drums[d]) {
					var drum = this.drumInfo[d].sound;
					var pitch = drum.zones[0].keyRangeLow;
					var volume = this.drumInfo[d].volumeRatio;

					volume = volume * this.volumes[d + 8];
					volume = volume + 0.0000001;
					this.player.queueWaveTable(this.audioContext, this.equalizer.input, drum, whenPlay, pitch, 3, volume);
				}
			}
			for (var c = 0; c < binfo.chords.length; c++) {
				var chord = binfo.chords[c];
				if (chord.notes.length > 0) {
					var track = this.trackInfo[c];
					var volume = track.volumeRatio;
					volume = volume * this.volumes[c];
					volume = volume + 0.0000001;
					//console.log(c,track);
					for (var n = 0; n < chord.notes.length; n++) {
						var note = chord.notes[n];
						//console.log(note, note.slides[0].shift, note.slides.length);
						var aslides = null;
						var pitch = this.octaveStepAccidental(note.octave, note.step, note.accidental) + track.octave * 12;
						var duration = wholeNoteDuration * note.slides[note.slides.length - 1].end192 / 192;
						if (note.vibrato) {
							var stepDuration = 0.05;
							aslides = [];
							var pitchSlide = pitch;
							var dir = 1;
							var bend = 0.6;
							for (var du = 0; du < duration; du = du + stepDuration) {
								var whenSlide = du;
								pitchSlide = pitch + dir * bend;
								dir = -dir;
								//console.log(whenPlay, whenSlide, pitchSlide);
								aslides.push({ when: whenSlide, pitch: pitchSlide });
							}
							//console.log(aslides);
						} else {
							if ((note.slides[0].shift != 0) || (note.slides.length > 1)) {
								aslides = [];
								var pitchSlide = pitch;
								for (var s = 0; s < note.slides.length; s++) {
									var whenSlide = wholeNoteDuration * note.slides[s].end192 / 192;
									pitchSlide = pitchSlide + note.slides[s].shift;
									//console.log(whenPlay, whenSlide, pitchSlide);
									aslides.push({ when: whenSlide, pitch: pitchSlide });
								}
							}
						}
						this.player.queueWaveTable(this.audioContext, this.equalizer.input
							, this.cachedInstrument(track), whenPlay, pitch, duration, volume, aslides);
					}
				}
			}
		}
	}
};
FretChordSheet.prototype.cachedInstrument = function (track) {
	if (!(track.subSample == undefined)) {
		//console.log(track.subSample);
		var key = this.player.loader.instrumentKeys()[track.subSample];
		//console.log(key);
		if (this.player.loader.loaded(['_tone_' + key])) {
			var instrument=window['_tone_' + key];
			//console.log(instrument);
			return instrument;
		}
	}
	return track.sound;
};