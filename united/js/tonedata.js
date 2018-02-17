function MeasureToneNote() {
	this.string = 0;
	//this.pitch = 0;
	this.palmMute = 0;
	this.slap = 0;
	this.deadNote = 0;
	this.slides = [];
	this.octave = 0;
	this.step = 0;
	this.accidental = 0;
	this.fret = 0;
	return this;
}
function MeasureToneChord() {
	this.notes = [];
	this.direction = 0;
	return this;
}
function MeasureBeat() {
	this.start192 = 0;
	this.chords = [new MeasureToneChord(), new MeasureToneChord(), new MeasureToneChord(), new MeasureToneChord(), new MeasureToneChord(), new MeasureToneChord(), new MeasureToneChord(), new MeasureToneChord()];
	this.drums = [0, 0, 0, 0, 0, 0, 0, 0];
	return this;
}
function MeasureInfo() {
	this.beats = [];
	this.meter = 120;
	this.duration4 = 4;
	this.keys = 0;
	this.shifts = [];
	return this;
}
FretChordSheet.prototype.measureInfo = function (n) {
	for (var i = 0; i <= n; i++) {
		if (this.measures[i]) {
			//
		} else {
			this.measures[i] = new MeasureInfo();
			/*for(var n=0;n<i;n++){
				console.log(this.measures[n]);
			}
			console.log(this.measures[i]);*/
			if (i > 0) {
				this.measures[i].keys = this.measures[i - 1].keys;
			}
		}
	}
	return this.measures[n];
};
FretChordSheet.prototype.beatInfo = function (minfo, start192) {
	for (var i = 0; i < minfo.beats.length; i++) {
		if (minfo.beats[i].start192 == start192) {
			return minfo.beats[i];
		}
	}
	var b = new MeasureBeat();
	b.start192 = start192;
	minfo.beats.push(b);
	return b;
};
FretChordSheet.prototype.notePitchAt = function (binfo, track, pitch) {
	var chord = binfo.chords[track];
	for (var i = 0; i < chord.notes.length; i++) {
		if (this.octaveStepAccidental(chord.notes[i].octave, chord.notes[i].step, chord.notes[i].accidental) == pitch) {
			return chord.notes[i];
		}
	}
	return null;
};
