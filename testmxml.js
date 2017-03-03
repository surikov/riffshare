console.log('test mxml v1.01');

function probe(valueTree) {
	console.log('valueTree', valueTree);
	valueTree.dump('','	.');
	var parts = valueTree.of('score-partwise').all('part');
	for (var p = 0; p < parts.length; p++) {
		var part = parts[p];
		//console.log(p, part.of('id').value);
		var measures = part.all('measure');
		measures.sort(function (a, b) {
			return a.of('number').numeric(-9999, 0, 9999) - b.of('number').numeric(-9999, 0, 9999);
		});
		for (var m = 0; m < measures.length; m++) {
			var measure = measures[m];
			var timeBeats = measure.of('attributes').of('time').of('beats').numeric(1, 4, 12);
			var timeBeatType = measure.of('attributes').of('time').of('beat-type').numeric(2, 4, 16);
			//console.log('	time', timeBeats, timeBeatType);
			var notes = measure.all('note');
			for (var n = 0; n < notes.length; n++) {
				var note = notes[n];
				//console.log('		', note.of('pitch').of('octave').numeric(0, 1, 999), note.of('pitch').of('step').value, ':', note.of('duration').numeric(0, 0, 999), '=', note.of('duration').numeric(0, 0, 999) / 3);
			}
		}
	}
}
