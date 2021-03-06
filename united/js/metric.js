FretChordSheet.prototype.resetHeaderWidth = function () {
	if (this.options.breakMode > 1) {
		this.options.measureHeader = 10;
	} else {
		if (this.options.breakMode > 0) {
			this.options.measureHeader = 5;
		} else {
			this.options.measureHeader = 0;
		}
	}
};

FretChordSheet.prototype.upperTrackNum = function () {
	return this.findTrackNum(0);
};

FretChordSheet.prototype.findTrackNum = function (nn) {
	var track = -1;
	for (var k = 0; k < this.trackOrder.length; k++) {
		if (this.trackOrder[k] == nn) {
			track = k;
			break;
		}
	}
	return track;
};

FretChordSheet.prototype.reCalcContentSize = function () {
	this.contentHeight = 143 * 3 * this.tiler.tapSize;
	this.margins.pianorollTop = 5 * 3 * this.tiler.tapSize;
	this.margins.sheetTop = this.margins.pianorollTop;
	this.margins.fretTop = this.margins.pianorollTop;
	this.margins.drumsTop = this.margins.pianorollTop;
	if (this.options.hidePiano < 2) {
		this.margins.sheetTop = this.margins.sheetTop + (12 * 6 + 1) * 3 * this.tiler.tapSize;
		this.margins.fretTop = this.margins.fretTop + (12 * 6 + 1) * 3 * this.tiler.tapSize;
		this.margins.drumsTop = this.margins.drumsTop + (12 * 6 + 1) * 3 * this.tiler.tapSize;
	}
	if (this.options.hideStaff < 2) {
		this.margins.fretTop = this.margins.fretTop + (6 * 7 + 1) * 3 * this.tiler.tapSize;
		this.margins.drumsTop = this.margins.drumsTop + (6 * 7 + 1) * 3 * this.tiler.tapSize;
	}
	if (this.options.hideFrets < 2) {
		this.margins.drumsTop = this.margins.drumsTop + (12 + 1) * 3 * this.tiler.tapSize;
	}
	/*this.margins.sheetTop = 1 * 3 * this.tiler.tapSize;
	this.margins.fretTop = 1 * 3 * this.tiler.tapSize;
	this.margins.drumsTop = 1 * 3 * this.tiler.tapSize;
	if (this.options.hidePiano < 2) {
		this.margins.sheetTop = this.margins.sheetTop + (12 * 6 + 1) * 3 * this.tiler.tapSize;
		this.margins.fretTop = this.margins.fretTop + (12 * 6 + 1) * 3 * this.tiler.tapSize;
		this.margins.drumsTop = this.margins.drumsTop + (12 * 6 + 1) * 3 * this.tiler.tapSize;
	}
	if (this.options.hideStaff < 2) {
		this.margins.fretTop = this.margins.fretTop + (6 * 7 + 1) * 3 * this.tiler.tapSize;
		this.margins.drumsTop = this.margins.drumsTop + (6 * 7 + 1) * 3 * this.tiler.tapSize;
	}
	if (this.options.hideFrets < 2) {
		this.margins.drumsTop = this.margins.drumsTop + (6 + 1) * 3 * this.tiler.tapSize;
	}*/
	this.tiler.resetInnerSize(this.calcContentWidth(), this.contentHeight);
	this.tiler.resetSize();
};
FretChordSheet.prototype.calcContentWidth = function () {
	var minfo = this.measureInfo(0);
	var r = this.margins.sheetLeft;
	for (var i = 0; i < this.measures.length; i++) {
		minfo = this.measureInfo(i);
		r = r + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
	minfo = this.measureInfo(this.measureInfo.length - 1);
	r = r + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	return r;
};
FretChordSheet.prototype.findMeasureBeat192 = function (clickX, measureX, measure) {
	var quarter = Math.floor((clickX - measureX) / (8 * 3 * this.tiler.tapSize));
	var remains = (clickX - measureX) % (8 * 3 * this.tiler.tapSize)
	var r6 = -1;
	var l6 = -1;
	var fl = this.feelPattern6[this.options.feel];
	for (var i = 1; i < fl.length; i++) {
		if (remains >= fl[i - 1] * 3 * this.tiler.tapSize / 6 && remains <= fl[i] * 3 * this.tiler.tapSize / 6) {
			r6 = fl[i - 1];
			l6 = fl[i] - fl[i - 1];
			break;
		}
	}
	var r = { quarter: quarter, left6: r6, duration6: l6 };
	return r;
}
FretChordSheet.prototype.findBeatDistance = function (_measureNum, _step192, _toNum, _toStep192) {
	var measureNum=_measureNum;
	var step192=_step192;
	var toNum=_toNum;
	var toStep192=_toStep192;
	var direction=1;
	if((measureNum>toNum) || (measureNum==toNum && step192>toStep192)){
		direction=-1;
		measureNum=_toNum;
		step192=_toStep192;
		toNum=_measureNum;
		toStep192=_step192;
	}
	if (measureNum == toNum) {
		return direction*(toStep192 - step192);
	} else {
		
		var minfo = this.measureInfo(measureNum);
		var len192 = minfo.duration4 * 8 * 6 - step192;
		for (var i = measureNum + 1; i <= toNum - 1; i++) {
			minfo = this.measureInfo(i);
			len192 = len192 + minfo.duration4 * 8 * 6
		}
		return direction*(len192 + toStep192);
	}
};
FretChordSheet.prototype.findBeatX = function (measureNum, step192) {
	var x = this.margins.sheetLeft + this.options.measureHeader * 3 * this.tiler.tapSize;
	for (var i = 0; i < this.measures.length; i++) {
		if (i < measureNum) {
			x = x + (this.options.measureHeader + this.measures[i].duration4 * 8) * 3 * this.tiler.tapSize;
		} else {
			break;
		}
	}
	var ms192 = 0;
	var m = null;
	for (var i = measureNum; i < this.measures.length; i++) {
		m = this.measures[i];
		if (step192 < ms192 + m.duration4 * 8 * 6) {
			x = x + (step192 - ms192) / 6 * 3 * this.tiler.tapSize;
			return x;
		} else {
			x = x + (this.options.measureHeader + m.duration4 * 8) * 3 * this.tiler.tapSize;
			ms192 = ms192 + m.duration4 * 8 * 6;
		}
	}
	x = x + (step192 - ms192) / 6 * 3 * this.tiler.tapSize;
	return x;
};
FretChordSheet.prototype.stringFret = function (note) {
	if(note.string){
		return {
			string: note.string
			, fret: note.fret
		};
	}else{
		return this.defaultStringFret(note);
	}
};
FretChordSheet.prototype.defaultStringFret = function (note) {
	var pitch = this.octaveStepAccidental(note.octave, note.step, note.accidental)-12;
	//console.log('stringFret', pitch);
	var r = {
		string: 5 - 0
		, fret: pitch - this.stringPitches[5 - 0]
	};
	for (var i = 1; i < this.stringPitches.length; i++) {
		//console.log(i, 'string',r.string, 'fret',r.fret,'sp',this.stringPitches[5 - i]);
		if (this.stringPitches[5 - i] > pitch) {
			break;
		}
		r = {
			string: 5 - i
			, fret: pitch - this.stringPitches[5-i]
		};
	}
	//console.log('return',r.string, r.fret);
	return r;
};
FretChordSheet.prototype.octaveStepAccidental = function (octave, step, accidental) {
	var r = octave * 12 + accidental;
	if (step == 1) return r + 2;
	if (step == 2) return r + 4;
	if (step == 3) return r + 5;
	if (step == 4) return r + 7;
	if (step == 5) return r + 9;
	if (step == 6) return r + 11;
	return r;
};
FretChordSheet.prototype.note7 = function (pitch) {//, noAltModeSharp) {
	var n12 = pitch - Math.floor(pitch / 12) * 12;
	var n7 = 0;
	if (n12 == 0 || n12 == 1) n7 = 0;
	if (n12 == 2 || n12 == 3) n7 = 1;
	if (n12 == 4) n7 = 2;
	if (n12 == 5 || n12 == 6) n7 = 3;
	if (n12 == 7 || n12 == 8) n7 = 4;
	if (n12 == 9 || n12 == 10) n7 = 5;
	if (n12 == 11) n7 = 6;
	return n7;
};
FretChordSheet.prototype.note12 = function (n7) {
	if (n7 == 0)
		return 0;
	if (n7 == 1) return 2;
	if (n7 == 2) return 4;
	if (n7 == 3) return 5;
	if (n7 == 4) return 7;
	if (n7 == 5) return 9;
	return 11;
};
FretChordSheet.prototype.name7 = function (pitch) {
	var n12 = pitch - Math.floor(pitch / 12) * 12;
	var n7 = 'C';
	if (n12 == 1) n7 = 'C#';
	if (n12 == 2) n7 = 'D';
	if (n12 == 3) n7 = 'D#';
	if (n12 == 4) n7 = 'E';
	if (n12 == 5) n7 = 'F';
	if (n12 == 6) n7 = 'F#';
	if (n12 == 7) n7 = 'G';
	if (n12 == 8) n7 = 'G#';
	if (n12 == 9) n7 = 'A';
	if (n12 == 10) n7 = 'A#';
	if (n12 == 11) n7 = 'B';
	return n7;
};
/*FretChordSheet.prototype.stringNumber = function (pitch) {
	var r6 = 1;
	for (var i = 0; i < this.strings.length; i++) {
		r6 = i + 1;
		if (this.strings[i] <= pitch) {
			break;
		}
	}
	return r6;
};*/
FretChordSheet.prototype.findDrums = function (morder, start192, duration192, drum) {
	var noteDrums = [];
	if (morder < this.measures.length) {
		minfo = this.measures[morder];
		for (var i = 0; i < minfo.beats.length; i++) {
			var measureBeat = minfo.beats[i];
			if (measureBeat.start192 >= start192 && measureBeat.start192 < start192 + duration192) {
				if (measureBeat.drums[drum]) {
					noteDrums.push({ morder: morder, beatStart: measureBeat.start192, drum: drum });
				}
			}
		}
	}
	return noteDrums;
};
FretChordSheet.prototype.findAllFrets = function (track, morder, start192, duration192, stringNo) {
	var notes = [];
	if (morder < this.measures.length) {
		minfo = this.measures[morder];
		for (var i = 0; i < minfo.beats.length; i++) {
			var measureBeat = minfo.beats[i];
			if (measureBeat.start192 >= start192 && measureBeat.start192 < start192 + duration192) {
				var measureToneChord = measureBeat.chords[track];
				for (var n = 0; n < measureToneChord.notes.length; n++) {
					var measureToneNote = measureToneChord.notes[n];
					//if (this.octaveStepAccidental(measureToneNote.octave, measureToneNote.step, measureToneNote.accidental) == pitch) {
					if (this.stringFret(measureToneNote).string==stringNo ) {
						notes.push({ track: track, morder: morder, beatStart: measureBeat.start192, note: measureToneNote });
					}
				}
			}
		}
	}
	return notes;
};
FretChordSheet.prototype.findNotes = function (track, morder, start192, duration192, pitch) {
	var notes = [];
	if (morder < this.measures.length) {
		minfo = this.measures[morder];
		for (var i = 0; i < minfo.beats.length; i++) {
			var measureBeat = minfo.beats[i];
			if (measureBeat.start192 >= start192 && measureBeat.start192 < start192 + duration192) {
				var measureToneChord = measureBeat.chords[track];
				for (var n = 0; n < measureToneChord.notes.length; n++) {
					var measureToneNote = measureToneChord.notes[n];
					if (this.octaveStepAccidental(measureToneNote.octave, measureToneNote.step, measureToneNote.accidental) == pitch) {
						notes.push({ track: track, morder: morder, beatStart: measureBeat.start192, note: measureToneNote });
					}
				}
			}
		}
	}
	return notes;
};
FretChordSheet.prototype.findNotes7 = function (track, morder, start192, duration192, octave, step) {
	//console.log('findNotes7', octave, step);
	var notes = [];
	if (morder < this.measures.length) {
		minfo = this.measures[morder];
		for (var i = 0; i < minfo.beats.length; i++) {
			var measureBeat = minfo.beats[i];
			if (measureBeat.start192 >= start192 && measureBeat.start192 < start192 + duration192) {
				var measureToneChord = measureBeat.chords[track];
				for (var n = 0; n < measureToneChord.notes.length; n++) {
					var measureToneNote = measureToneChord.notes[n];
					//console.log(measureToneNote);
					if (measureToneNote.octave == octave && measureToneNote.step == step) {
						//console.log('found');
						notes.push({ track: track, morder: morder, beatStart: measureBeat.start192, note: measureToneNote });
					}
				}
			}
		}
	}
	return notes;
};
FretChordSheet.prototype.pitch2staffY = function (pitch) {//12, pitch7){//, noAltModeSharp) {
	var step = this.note7(pitch);//, noAltModeSharp);
	var octave = Math.floor(pitch / 12);
	var yy = 6 * 7 - 7 * octave - step - 1;
	return yy;
};


FretChordSheet.prototype.keyName = function (note) {
	var name = 'C';
	if (note.step == 1) name = 'D';
	if (note.step == 2) name = 'E';
	if (note.step == 3) name = 'F';
	if (note.step == 4) name = 'G';
	if (note.step == 5) name = 'A';
	if (note.step == 6) name = 'B';
	if (note.accidental > 0) name = name + '#';
	if (note.accidental < 0) name = name + 'b';
	return name;
};

FretChordSheet.prototype.isEmptyMeasureBeat = function (beat) {
	for (var i = 0; i < beat.drums.length; i++) {
		if (beat.drums[i]) {
			return false;
		}
	}
	for (var i = 0; i < beat.chords.length; i++) {
		if (beat.chords[i].notes.length > 0) {
			return false;
		}
	}
	return true;
};
FretChordSheet.prototype.isMeasureEmpty = function (measure) {
	for (var i = 0; i < measure.beats.length; i++) {
		if (!this.isEmptyMeasureBeat(measure.beats[i])) {
			return false;
		}
	}
	return true;
};
