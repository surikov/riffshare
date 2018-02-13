FretChordSheet.prototype.promptImport = function () {
	console.log('promptImport');
	document.getElementById('chooseFileInput').click();
}
FretChordSheet.prototype.doImport = function (evt) {
	console.log('doImport', evt);
	var me = this;
	var file = evt.target.files[0];
	console.log('read', file);
	var fileReader = new FileReader();
	fileReader.onload = function (progressEvent) {
		console.log('onload', progressEvent);
		if (progressEvent.target.readyState == FileReader.DONE) {
			var xml = progressEvent.target.result;
			me.resetUndoStatus();
			me.doParse(xml);
			me.shrinkMeasures();
			me.reCalcContentSize();
			me.tiler.resetAllLayersNow();
		} else {
			console.log(progressEvent.target.readyState);
		}
	};
	fileReader.readAsText(file);
}
FretChordSheet.prototype.doParse = function (xml) {
	console.log('doParse');
	var vt = new ValueTree();
	vt.fromXMLstring(xml);
	var parts = vt.of('score-partwise').all('part');
	for (var i = 0; i < parts.length; i++) {
		var p = parts[i];
		var track = this.parsePartTrackNum(vt, p.of('id').value);;
		var mina = 'drums';
		if (track > -1) {
			mina = this.trackInfo[track].title;
		}
		console.log('part', p.of('id').value, mina);
		this.parsePart(vt, track, p);
	}
};
FretChordSheet.prototype.midi2ins = function (prg) {
	var r = 3;
	var midi = prg * 1;
	if (midi >= 38 && midi <= 39) { return 0; }
	if (midi >= 40 && midi <= 51) { return 1; }
	if (midi >= 32 && midi <= 37) { return 2; }
	r = 3;
	if (midi == 26) { return 4; }
	if (midi >= 3 && midi <= 23) { return 5; }
	if (midi >= 24 && midi <= 28) { return 6; }
	if (midi >= 29 && midi <= 30) { return 7; }
	return r;
};
FretChordSheet.prototype.midi2drum = function (midi) {
	var r = 6;
	if (midi == '35' || midi == '36') { return 0; }
	if (midi == '41' || midi == '43') { return 1; }
	if (midi == '38' || midi == '40') { return 2; }
	if (midi == '42' || midi == '44') { return 3; }
	if (midi == '45' || midi == '47' || midi == '48' || midi == '50') { return 4; }
	if (midi == '46') { return 5; }
	//
	if (midi == '49' || midi == '57') { return 7; }
	return r;
};

FretChordSheet.prototype.drumIndex = function (vt, partId, insId) {
	var scoreparts = vt.of('score-partwise').of('part-list').all('score-part');
	for (var i = 0; i < scoreparts.length; i++) {
		if (scoreparts[i].of('id').value == partId) {
			var midiinstruments = scoreparts[i].all('midi-instrument');
			for (var n = 0; n < midiinstruments.length; n++) {
				if (midiinstruments[n].of('id').value == insId) {
					var unp = midiinstruments[n].of('midi-unpitched').value;
					if (unp.length > 0) {
						var nn = this.midi2drum(unp);
						return nn;
					} else {
						console.log('empty midi-unpitched for', insId);
						return 1;
					}
				}
			}
		}
	}
	console.log('not found drum', insId);
	return 4;
};
FretChordSheet.prototype.findTrackByInsName = function (name) {
	if (name.toLowerCase().includes("guitar")) { return 6; }
	if (name.toLowerCase().includes("organ")) { return 5; }
	if (name.toLowerCase().includes("bass")) { return 2; }
	if (name.toLowerCase().includes("choir")) { return 5; }
	if (name.toLowerCase().includes("alto")) { return 1; }
	if (name.toLowerCase().includes("viol")) { return 1; }
	if (name.toLowerCase().includes("string")) { return 1; }
	if (name.toLowerCase().includes("synth")) { return 0; }
	return 3;
};
FretChordSheet.prototype.parsePartTrackNum = function (vt, id) {
	var pls = vt.of('score-partwise').of('part-list').all('score-part');
	var track = 3;//this.midi2ins(midins);
	for (var i = 0; i < pls.length; i++) {
		var sp = pls[i];
		if (sp.of('id').value == id) {
			var prg = sp.of('midi-instrument').of('midi-program').numeric(0, 0, 127);
			var ch = sp.of('midi-instrument').of('midi-channel').numeric(0, 0, 127);
			if (ch == 10 || sp.of('midi-instrument').of('midi-unpitched').value.length > 0) {
				return -1;
			} else {
				if (prg > 0) {
					track = this.midi2ins(prg - 1);
				} else {
					console.log('no midi-program for', sp.of('part-name').value);
					track = this.findTrackByInsName(sp.of('part-name').value);
				}
				return track;
			}
		}
	}
	console.log('no score-partwise for', id);
	return track;
};
FretChordSheet.prototype.parsePart = function (vt, track, part) {
	var measures = part.all('measure');
	var divisions = 1;
	var fifths = 0;
	var cudu = 4;
	var anchor = 0;
	var luco = 0;
	for (var i = 0; i < measures.length; i++) {
		luco++
		var measure = measures[i];
		var _divisions = measure.of('attributes').of('divisions').value;
		if (_divisions) {
			divisions = _divisions;
		}
		var _fifths = measure.of('attributes').of('key').of('fifths').value;
		if (_fifths.length > 0) {
			_fifths = 1 * _fifths;
			if (_fifths != fifths) {
				fifths = _fifths;
			}
		}
		var clefoctavechange = 1 * measure.of('attributes').of('clef').of('clef-octave-change').value;
		var quant = 6 * (32 / 4) / divisions;
		var beats = measure.of('attributes').of('time').of('beats').value;
		var beattype = measure.of('attributes').of('time').of('beat-type').value;
		if ((beats) && (beattype)) {
			cudu = Math.floor(4 * beats / beattype);
			if (cudu < 3) { cudu = 3 }
			if (cudu > 7) { cudu = 7 }
		}
		var minfo = this.measureInfo(i);
		minfo.duration4 = cudu;

		if (fifths >= 0) {
			minfo.keys = fifths;
		} else {
			minfo.keys = 7 + 8 + fifths;
		}
		if (track > -1) {
			this.parseToneMeasure(quant, i, track, measure, this.keys[minfo.keys], clefoctavechange);
		} else {
			this.parseDrumMeasure(vt, part.of('id').value, quant, i, measure);
		}
		var barlines = measure.all('barline');
		for (var b = 0; b < barlines.length; b++) {
			barline = barlines[b];
			if (barline.of('repeat').of('direction').value) {
				var barlinerepeatdirection = barline.of('repeat').of('direction').value;//forward/backward
				var barlinerepeattimes = barline.of('repeat').of('times').value;
				if (barlinerepeatdirection == 'forward') {
					anchor = i;
				} else {
					if (barlinerepeatdirection == 'backward') {
						if (barline.of('repeat').of('found').value) {
							barline.of('repeat').of('count').value = barline.of('repeat').of('count').value - 1;
							if (barline.of('repeat').of('count').value > 0) {
								i = anchor - 1;
							}
						} else {
							barline.of('repeat').of('count').value = 1;
							barline.of('repeat').of('found').value = 1;
							if (barlinerepeattimes) {
								barline.of('repeat').of('count').value = 1 * barlinerepeattimes;
							}
							console.log(barlinerepeatdirection, barlinerepeattimes, barline.of('ending').of('number').value, barline.of('ending').of('type').value);
							i = anchor - 1;
						}
					}
				}
				break;
			}
		}
	}
};
FretChordSheet.prototype.stepNum = function (step) {
	if (step.toUpperCase() == 'E') { return 1; }
	if (step.toUpperCase() == 'F') { return 2; }
	if (step.toUpperCase() == 'G') { return 3; }
	if (step.toUpperCase() == 'A') { return 4; }
	if (step.toUpperCase() == 'B') { return 5; }
	if (step.toUpperCase() == 'H') { return 5; }
	return 0;
}
FretChordSheet.prototype.findTieStart = function (trackNo, mOrder, start192, octave, step, accidental) {
	for (var m = 0; m < this.measures.length; m++) {
		if (m <= mOrder) {
			var minfo = this.measures[m];
			for (var bb = 0; bb < minfo.beats.length; bb++) {
				var binfo = minfo.beats[bb];
				if (m <= mOrder || (m == mOrder && binfo.start192 < start192)) {
					var chord = binfo.chords[trackNo];
					for (var n = 0; n < chord.notes.length; n++) {
						var note = chord.notes[n];
						var dur192 = note.slides[note.slides.length - 1].end192;
						var s192 = binfo.start192;
						if (note.octave == octave && note.step == step && note.accidental == accidental) {
							var dlt = this.findBeatDistance(m, s192 + dur192, mOrder, start192);
							if (dlt == 0) {
								return note;
							}
						}
					}
				}
			}
		}
	}
	return null;
};
FretChordSheet.prototype.parseToneMeasure = function (quant, n, track, measure, keys, clefoctavechange) {
	var notes = measure.all('note');
	var minfo = this.measureInfo(n);
	var voices = this.findVoices(notes);
	for (var v = 0; v < voices.length; v++) {
		var voice = voices[v];
		var idx = 0;
		var lastdur = 0;
		for (var i = 0; i < notes.length; i++) {
			if (voice == notes[i].of('voice').value) {
				var duration = 1 * notes[i].of('duration').value;
				var chord = notes[i].has('chord');
				if (!(chord)) {
					idx = idx + quant * lastdur;
				}
				if (notes[i].has('pitch')) {
					var binfo = this.beatInfo(minfo, idx);
					var step = notes[i].of('pitch').of('step').value;
					var alter = 1*notes[i].of('pitch').of('alter').value;
					alter = alter ? alter : 0;
					var octave = 1*notes[i].of('pitch').of('octave').value;
					var tie = notes[i].of('notations').of('tied').of('type').value;
					var note = { octave: octave, step: this.stepNum(step), accidental: alter, slides: [{ shift: 0, end192: duration * quant }] };
					if (tie != "stop") {
						this.dropNoteAtBeat7(track, n, idx, octave, step, alter);
						binfo.chords[track].notes.push(note);
					} else {
						var tied = this.findTieStart(track, n, idx, octave, step, alter);
						if (tied) {
							tied.slides[tied.slides.length - 1].end192 = tied.slides[tied.slides.length - 1].end192 + duration * quant;
						}
					}
				}
				lastdur = duration;
			}
		}
	}
};
FretChordSheet.prototype.parseDrumMeasure = function (vt, partId, quant, n, measure) {
	var minfo = this.measureInfo(n);
	var notes = measure.all('note');
	var voices = this.findVoices(notes);
	for (var v = 0; v < voices.length; v++) {
		var voice = voices[v];
		var idx = 0;
		var lastdur = 0;
		for (var i = 0; i < notes.length; i++) {
			if (voice == notes[i].of('voice').value) {
				var duration = 1 * notes[i].of('duration').value;
				var insId = notes[i].of('instrument').of('id').value;
				if (insId) {
					var chord = notes[i].has('chord');
					var drnum = this.drumIndex(vt, partId, insId);
					var tie = notes[i].of('notations').of('tied').of('type').value;
					if (tie != "stop") {
						if (!(chord)) {
							idx = idx + quant * lastdur;
						}
						var binfo = this.beatInfo(minfo, idx);
						binfo.drums[drnum] = 1;
					}
				} else {
					idx = idx + quant * lastdur;
				}
				lastdur = duration;
			}
		}
	}
};
FretChordSheet.prototype.existsArr = function (v, at) {
	for (var i = 0; i < at.length; i++) {
		if (v == at[i]) {
			return true;
		}
	}
	return false;
};
FretChordSheet.prototype.findVoices = function (notes) {
	var v = [];
	for (var i = 0; i < notes.length; i++) {
		var voice = notes[i].of('voice').value;
		if (!this.existsArr(voice, v)) {
			v.push(voice);
		}
	}
	return v;
};
