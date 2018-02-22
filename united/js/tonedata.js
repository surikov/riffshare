function MeasureToneNote() {
	this.string = 0;
	//this.pitch = 0;
	this.palmMute = 0;
	this.vibrato = 0;
	this.flageolet  = 0;
	this.slap = 0;
	this.deadNote = 0;
	this.slides = [];
	this.octave = 0;
	this.step = 0;
	this.accidental = 0;
	this.fret = 0;
	return this;
}
FretChordSheet.prototype.cloneNote = function (measureToneNote) {
	var clone = new MeasureToneNote();
	clone.string = measureToneNote.string;
	clone.fret = measureToneNote.fret;
	clone.octave = measureToneNote.octave;
	clone.step = measureToneNote.step;
	clone.accidental = measureToneNote.accidental;
	clone.palmMute = measureToneNote.palmMute;
	clone.slap = measureToneNote.slap;
	clone.vibrato = measureToneNote.vibrato;
	clone.flageolet = measureToneNote.flageolet;
	clone.deadNote = measureToneNote.deadNote;
	for (var i = 0; i < measureToneNote.slides.length; i++) {
		clone.slides[i] = { shift: measureToneNote.slides[i].shift, end192: measureToneNote.slides[i].end192 };
	}
	return clone;
};
function MeasureToneChord() {
	this.notes = [];
	this.direction = 0;
	return this;
}
FretChordSheet.prototype.cloneChord = function (measureToneChord) {
	var clone = new MeasureToneChord();
	clone.direction = measureToneChord.direction;
	for (var i = 0; i < measureToneChord.notes.length; i++) {
		clone.notes[i] = this.cloneNote(measureToneChord.notes[i]);
	}
	return clone;
};
function MeasureBeat() {
	this.start192 = 0;
	this.chords = [new MeasureToneChord(), new MeasureToneChord(), new MeasureToneChord(), new MeasureToneChord(), new MeasureToneChord(), new MeasureToneChord(), new MeasureToneChord(), new MeasureToneChord()];
	this.drums = [0, 0, 0, 0, 0, 0, 0, 0];
	return this;
}
FretChordSheet.prototype.cloneBeat = function (measureBeat) {
	var clone = new MeasureBeat();
	clone.start192 = measureBeat.start192;
	for (var i = 0; i < measureBeat.drums.length; i++) {
		clone.drums[i] = measureBeat.drums[i];
	}
	for (var i = 0; i < measureBeat.chords.length; i++) {
		clone.chords[i] = this.cloneChord(measureBeat.chords[i]);
	}
	return clone;
};
function MeasureInfo() {
	this.beats = [];
	this.tempo = 121;
	this.duration4 = 4;
	this.keys = 0;
	this.shifts = [];
	return this;
}
FretChordSheet.prototype.cloneMeasure = function (morder) {
	var clone = new MeasureInfo();
	if (morder < this.measures.length) {
		minfo = this.measures[morder];
		clone.meter = minfo.meter;
		clone.tempo = minfo.tempo;		
		clone.keys = minfo.keys;
		clone.duration4 = minfo.duration4;
		for (var i = 0; i < minfo.beats.length; i++) {
			clone.beats[i] = this.cloneBeat(minfo.beats[i]);
		}
		for(var i=0;i<8;i++){
			clone.shifts[i]=minfo.shifts[i]||0;
		}
	}
	return clone;
};
















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
				this.measures[i].meter = this.measures[i - 1].meter;
				this.measures[i].tempo = this.measures[i - 1].tempo;
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
