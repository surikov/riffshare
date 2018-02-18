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
		this.startPlayLoop([], 120, 1/32, 0);
	}
};
FretChordSheet.prototype.startPlayLoop = function (beats, bpm, density, fromBeat) {
	this.stopPlayLoop();
	var wholeNoteDuration = 4 * 60 / bpm;
	if (fromBeat < beats.length) {
		this.beatIndex = fromBeat;
	} else {
		this.beatIndex = 0;
	}
	this.playBeatAt(this.audioContext.currentTime, beats[this.beatIndex], bpm);
	var nextLoopTime = this.audioContext.currentTime + density * wholeNoteDuration;
	var me = this;
	this.loopIntervalID = setInterval(function () {
		if (me.air) {
			if (me.audioContext.currentTime > nextLoopTime - density * wholeNoteDuration) {
				me.beatIndex++;
				if (me.beatIndex >= beats.length) {
					me.beatIndex = 0;
				}
				me.playBeatAt(nextLoopTime, beats[me.beatIndex], bpm);
				nextLoopTime = nextLoopTime + density * wholeNoteDuration;
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
FretChordSheet.prototype.playBeatAt = function (when, beat, bpm) {
	console.log('playBeatAt', when, beat, bpm);
};