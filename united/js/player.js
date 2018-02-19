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
		this.echo = this.player.createReverberator(this.audioContext);
		this.echo.wet.gain.setTargetAtTime(0.5, 0, 0.0001);
		this.echo.output.connect(this.output);
		this.equalizer.output.connect(this.echo.input);
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
				, 111);
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
FretChordSheet.prototype.moveTicker = function (measureNum,beat16) {
	if(this.tickerLine){
		this.tickerX=this.findBeatX(measureNum,beat16*12);
		//beat4*this.tiler.tapSize*3*8;
		//console.log(this.tickerX);
		var minfo = this.measureInfo(measureNum);
		this.tickerLine.setAttributeNS(null, 'width',this.tiler.tapSize*3*minfo.duration4*8);
		this.tickerLine.setAttribute('transform', 'translate(' + this.tickerX + ')');
	}
};
FretChordSheet.prototype.hideTicker = function () {
	if(this.tickerLine){
		this.tickerLine.setAttributeNS(null, 'fill', 'rgba(255,255,255,0.0000001)');
	}
};
FretChordSheet.prototype.showTicker = function () {
	if(this.tickerLine){
		this.tickerLine.setAttributeNS(null, 'fill', 'rgba(255,255,255,0.5)');
	}
};
FretChordSheet.prototype.startPlayLoop = function () {
	this.stopPlayLoop();
	var minfo = this.measureInfo(0);
	var wholeNoteDuration = 4 * 60 / minfo.tempo;
	var measureNum = 0;
	//var beat4 = 0;
	var beat16 = 0;
	this.playBeatAt(this.audioContext.currentTime, measureNum, beat16);
	this.moveTicker(measureNum,beat16);
	var nextLoopTime = this.audioContext.currentTime + 1 / 16 * wholeNoteDuration;
	var me = this;
	this.loopIntervalID = setInterval(function () {
		if (me.air) {
			if (me.audioContext.currentTime > nextLoopTime - 1 / 16 * wholeNoteDuration) {
				try {
					//me.moveTicker(measureNum,beat4);
					beat16++;
					if (beat16 >= 4*me.measures[measureNum].duration4) {
						beat16 = 0;
						measureNum++;
						if (measureNum > me.measures.length - 1) {
							measureNum = 0;
						}
						me.moveTicker(measureNum,beat16);
						minfo = me.measureInfo(measureNum,beat16);
						wholeNoteDuration = 4 * 60 / minfo.tempo;
					}
					me.playBeatAt(nextLoopTime, measureNum, beat16);
					nextLoopTime = nextLoopTime + 1 / 16 * wholeNoteDuration;
					
				} catch (ex) { 
					console.log(ex); 
					me.stopPlay();
				}
			}
		}
	}, 22);
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
			//console.log('send', whenPlay, binfo);
			for (var d = 0; d < binfo.drums.length; d++) {
				if (binfo.drums[d]) {
					var drum = this.drumInfo[d].sound;
					var pitch = drum.zones[0].keyRangeLow;
					var volume = this.drumInfo[d].volumeRatio;
					this.player.queueWaveTable(this.audioContext, this.equalizer.input, drum, whenPlay, pitch, 3, volume);
				}
			}
			for (var c = 0; c < binfo.chords.length; c++) {
				var chord = binfo.chords[c];
				if (chord.notes.length > 0) {
					var track = this.trackInfo[c];
					var volume = track.volumeRatio;
					for (var n = 0; n < chord.notes.length; n++) {
						var note = chord.notes[n];
						var pitch = this.octaveStepAccidental(note.octave, note.step, note.accidental) + track.octave * 12;
						var duration = wholeNoteDuration * note.slides[note.slides.length - 1].end192 / 192;
						this.player.queueWaveTable(this.audioContext, this.equalizer.input, track.sound, whenPlay, pitch, duration, volume);
					}
				}
			}
		}
	}
};