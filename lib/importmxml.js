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
	//vt.dump('`','	`');
	var parts = vt.of('score-partwise').all('part');
	//console.log(parts);
	for (var i = 0; i < parts.length; i++) {
		var p = parts[i];
		var midins = this.parsePartTrackNum(vt, p.of('id').value);
		var track = -1;
		if (midins > -1) {
			track = this.midi2ins(midins);
			console.log(this.trackInfo[track].title, 'from', midins, p.of('id').value);
		}
		this.parsePart(vt, track, p);
	}
};
FretChordSheet.prototype.midi2ins = function (prg) {
	var r = 3;
	var midi = prg * 1;
	if (midi >= 38 && midi <= 39) { return 0; }
	if (midi >= 40 && midi <= 51) { return 1; }
	if (midi >= 32 && midi <= 37) { return 2; }
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
					var nn = this.midi2drum(midiinstruments[n].of('midi-unpitched').value);
					/*var names=scoreparts[i].all('score-instrument');
					for(var k=0;k<names.length;k++){
						if(names[k].of('id').value==insId){
							console.log(this.drumInfo[nn].title,'from',names[k].of('instrument-name').value,insId,midiinstruments[n].of('midi-unpitched').value);
						}
					}*/
					return nn;
				}
			}
		}
	}
	return 4;
};
FretChordSheet.prototype.parsePartTrackNum = function (vt, id) {
	var pls = vt.of('score-partwise').of('part-list').all('score-part');
	for (var i = 0; i < pls.length; i++) {
		var sp = pls[i];
		if (sp.of('id').value == id) {
			var prg = sp.of('midi-instrument').of('midi-program').numeric(0, 0, 127);
			var ch = sp.of('midi-instrument').of('midi-channel').numeric(0, 0, 127);
			if (ch == 10) {
				return -1;
			} else {
				return prg - 1;
			}
		}
	}
	return 0;
};
FretChordSheet.prototype.parsePart = function (vt, track, part) {
	console.log('part', part.of('id').value, track);
	var measures = part.all('measure');
	var divisions = 1;
	var fifths=0;
	var cudu=4;
	var anchor=0;
	var luco=0;
	for (var i = 0; i < measures.length; i++) {
		luco++
		var measure=measures[i];
		//console.log('measure',luco,i,measure.of('number').value);
		var _divisions = measure.of('attributes').of('divisions').value;
		if (_divisions) {
			divisions = _divisions;
		}
		var _fifths=measure.of('attributes').of('key').of('fifths').value;
		if (_fifths) {
			fifths = 1*_fifths;
			//console.log('fifths',fifths);
		}
		var quant = 6 * (32 / 4) / divisions;
		var beats = measure.of('attributes').of('time').of('beats').value;
		var beattype = measure.of('attributes').of('time').of('beat-type').value;
		if((beats)&&(beattype)){
			cudu=Math.floor(4*beats/beattype);
			if(cudu<3){cudu=3}
			if(cudu>7){cudu=7}
			//console.log('	meter',i,beats,'/',beattype,':',cudu);
		}
		var minfo = this.measureInfo(i);
		
			var keys=0;
			if(fifths<0){
				keys=15+fifths;
			}else{
				keys=fifths
			}
		
		minfo.keys=keys;
		//console.log('=',fifths,keys);
		minfo.duration4=cudu;
		if (track > -1) {
			this.parseToneMeasure(quant, i, track, measure);
		} else {
			this.parseDrumMeasure(vt, part.of('id').value, quant, i, measure);
		}
		var barlines=measure.all('barline');
		for(var b=0;b<barlines.length;b++){
			barline=barlines[b];
			if(barline.of('repeat').of('direction').value){
				var barlinerepeatdirection = barline.of('repeat').of('direction').value;//forward/backward
				var barlinerepeattimes = barline.of('repeat').of('times').value;
				//console.log('	repeat',barlinerepeatdirection,barlinerepeattimes);
				if(barlinerepeatdirection=='forward'){
					anchor=i;
				}else{
					if(barlinerepeatdirection=='backward'){
						if(barline.of('repeat').of('found').value){
							barline.of('repeat').of('count').value=barline.of('repeat').of('count').value-1;
							if(barline.of('repeat').of('count').value>0){
								i=anchor-1;
							}
						}else{
							barline.of('repeat').of('count').value=1;
							barline.of('repeat').of('found').value=1;
							if(barlinerepeattimes){
								barline.of('repeat').of('count').value=1*barlinerepeattimes;
							}
							console.log(barlinerepeatdirection,barlinerepeattimes,barline.of('ending').of('number').value,barline.of('ending').of('type').value);
							i=anchor-1;
						}
						//console.log(barline);
					}
				}
				break;
			}
		}
	}
};
FretChordSheet.prototype.calcPitch = function (step, octave) {
	var r = 12 * (octave-1);
	if (step.toUpperCase() == 'C') { r = r + 0; }
	if (step.toUpperCase() == 'D') { r = r + 0 + 2; }
	if (step.toUpperCase() == 'E') { r = r + 0 + 2 + 2; }
	if (step.toUpperCase() == 'F') { r = r + 0 + 2 + 2 + 1; }
	if (step.toUpperCase() == 'G') { r = r + 0 + 2 + 2 + 1 + 2; }
	if (step.toUpperCase() == 'A') { r = r + 0 + 2 + 2 + 1 + 2 + 2; }
	if (step.toUpperCase() == 'B') { r = r + 0 + 2 + 2 + 1 + 2 + 2 + 2; }
	return r;
};
FretChordSheet.prototype.findTieStart = function (trackNo, mOrder, start192, pitch) {
	//console.log('findTieStart', trackNo, 'for', mOrder, start192, 'len', pitch);
	for (var m = 0; m < this.measures.length; m++) {
		if (m <= mOrder) {
			var minfo = this.measures[m];
			//console.log(bb);
			for (var bb = 0; bb < minfo.beats.length; bb++) {
				//console.log(bb,minfo.beats.length);
				var binfo = minfo.beats[bb];
				if (m <= mOrder || (m == mOrder && binfo.start192 < start192)) {
					//console.log(bb, minfo.beats.length,minfo.beats,binfo);
					var chord = binfo.chords[trackNo];
					for (var n = 0; n < chord.notes.length; n++) {
						var note = chord.notes[n];
						var p = note.pitch;
						var dur192 = note.slides[note.slides.length - 1].end192;
						var s192 = binfo.start192;
						if (p == pitch) {
							var dlt = this.findBeatDistance(m, s192 + dur192, mOrder, start192);
							if (dlt == 0) {
								return note;
							}
							//console.log(this.findBeatDistance(m,s192+dur192,mOrder,start192) , s192,dur192);
						}
					}
				}
			}
		}
	}
	return null;
};
FretChordSheet.prototype.parseToneMeasure = function (quant, n, track, measure) {
	//console.log('tone measure', track, measure.of('number').value);
	var notes = measure.all('note');
	var minfo = this.measureInfo(n);

	var voices = this.findVoices(notes);
	for (var v = 0; v < voices.length; v++) {
		var voice = voices[v];
		var idx = 0;
		var lastdur = 0;
		for (var i = 0; i < notes.length; i++) {
			if (voice == notes[i].of('voice').value) {
				//var step = notes[i].of('pitch').of('step').value;
				//var octave = notes[i].of('pitch').of('octave').value;
				var duration = 1 * notes[i].of('duration').value;
				var chord = notes[i].has('chord');

				if (!(chord)) {
					idx = idx + quant * lastdur;
				}
				if (notes[i].has('pitch')) {
					var binfo = this.beatInfo(minfo, idx);
					var step = notes[i].of('pitch').of('step').value;
					var octave = notes[i].of('pitch').of('octave').value;
					var tie = notes[i].of('notations').of('tied').of('type').value;
					var accidental=notes[i].of('accidental').value;//sharp, flat, natural, double-sharp, sharp-sharp, flat-flat, natural-sharp, natural-flat, quarter-flat, quarter-sharp, three-quarters-flat, and three-quarters-sharp
					//if(accidental){console.log(notes[i]);}
					
					var pitch = this.calcPitch(step, octave);
					
					var note = { pitch: pitch, slides: [{ shift: 0, end192: duration * quant }] };
					//console.log(note)
					if (tie != "stop") {
						this.dropNoteAtBeat(track, n, idx, pitch);
						binfo.chords[track].notes.push(note);
					} else {
						var tied = this.findTieStart(track, n, idx, pitch);
						if (tied) {
							tied.slides[tied.slides.length - 1].end192 = tied.slides[tied.slides.length - 1].end192 + duration * quant;
							//console.log(tied);
						}
					}
				}
				lastdur = duration;
			}
		}
	}
};
FretChordSheet.prototype.parseDrumMeasure = function (vt, partId, quant, n, measure) {
	//console.log('drum measure',  measure.of('number').value);
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
				//console.log(partId,voice,duration,insId);
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
