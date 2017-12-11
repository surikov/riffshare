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
		var midins=this.parsePartTrackNum(vt, p.of('id').value);
		var track=-1;
		if(midins>-1){
			track=this.midi2ins(midins);
			console.log(this.trackInfo[track].title,'from',midins,p.of('id').value);
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
					var nn=this.midi2drum(midiinstruments[n].of('midi-unpitched').value);
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
				return prg-1;
			}
		}
	}
	return 0;
};
FretChordSheet.prototype.parsePart = function (vt, track, part) {
	console.log('part', part.of('id').value, track);
	var measures = part.all('measure');
	var divisions = 1;
	for (var i = 0; i < measures.length; i++) {
		var _divisions = measures[i].of('attributes').of('divisions').value;
		if (_divisions) {
			divisions = _divisions;
		}
		var quant = 6 * (32 / 4) / divisions;
		//var fifths = measures[i].of('attributes').of('key').of('fifths').value;
		//var beats = measures[i].of('attributes').of('time').of('beats').value;
		//var beattype = measures[i].of('attributes').of('time').of('beat-type').value;
		//var duration4=4*beats/beattype;
		//var clefoctavechange=measures[i].of('attributes').of('clef').of('clef-octave-change').value;
		if (track > -1) {
			this.parseToneMeasure(quant, i, track, measures[i]);
		} else {
			this.parseDrumMeasure(vt, part.of('id').value, quant, i, measures[i]);
		}
	}
};
FretChordSheet.prototype.calcPitch = function (step, octave) {
	var r = 12 * octave;
	if (step.toUpperCase() == 'C') { r = r + 0; }
	if (step.toUpperCase() == 'D') { r = r + 0 + 2; }
	if (step.toUpperCase() == 'E') { r = r + 0 + 2 + 2; }
	if (step.toUpperCase() == 'F') { r = r + 0 + 2 + 2 + 1; }
	if (step.toUpperCase() == 'G') { r = r + 0 + 2 + 2 + 1 + 2; }
	if (step.toUpperCase() == 'A') { r = r + 0 + 2 + 2 + 1 + 2 + 2; }
	if (step.toUpperCase() == 'B') { r = r + 0 + 2 + 2 + 1 + 2 + 2 + 2; }
	return r;
};
FretChordSheet.prototype.parseToneMeasure = function (quant, n, track, measure) {
	//console.log('tone measure', track, measure.of('number').value);
	var notes = measure.all('note');
	var minfo = this.measureInfo(n);
	var idx = 0;
	var lastdur = 0;
	for (var i = 0; i < notes.length; i++) {
		//var step = notes[i].of('pitch').of('step').value;
		//var octave = notes[i].of('pitch').of('octave').value;
		var duration = 1*notes[i].of('duration').value;
		var chord = notes[i].has('chord');
		
		if (!(chord)) {
			idx = idx + quant * lastdur;
		}
		if(notes[i].has('pitch')){
			var binfo = this.beatInfo(minfo, idx);
			var step = notes[i].of('pitch').of('step').value;
			var octave = notes[i].of('pitch').of('octave').value;
			var pitch=this.calcPitch(step,octave);
			var note={pitch:pitch,slides:[{ shift: 0, end192: duration*quant }]};
			//console.log(note)
			binfo.chords[track].notes.push(note);
		}
		lastdur = duration;
	}
};
FretChordSheet.prototype.parseDrumMeasure = function (vt, partId, quant, n, measure) {
	//console.log('drum measure',  measure.of('number').value);
	var minfo = this.measureInfo(n);
	var notes = measure.all('note');
	var idx = 0;
	var lastdur = 0;
	for (var i = 0; i < notes.length; i++) {
		var duration = 1 * notes[i].of('duration').value;
		var insId = notes[i].of('instrument').of('id').value;
		var chord = notes[i].has('chord');
		var drnum = this.drumIndex(vt, partId, insId);
		
		if (!(chord)) {
			idx = idx + quant * lastdur;
		}
		var binfo = this.beatInfo(minfo, idx);
		binfo.drums[drnum] = 1;
		lastdur = duration;
	}
};
