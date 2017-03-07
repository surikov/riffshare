console.log('test mxml v1.01');

var C=0;
var D=2;
var E=4;
var F=5;
var G=7;
var A=9;
var B=11;
var fifthsSharp=[F, C, G, D, A, E, B];
var fifthsFlat=[B, E, A, D, G, C, F];


var circleOfFifths=[{name:'C/Am',order:0,steps:[]}

	,{name:'G/Em',order:1,steps:['F']}
	,{name:'D/Bm',order:2,steps:[]}
	,{name:'A/F#m',order:3,steps:[]}
	,{name:'E/C#m',order:4,steps:[]}
	,{name:'B/G#m',order:5,steps:[]}
	,{name:'F#/D#m',order:6,steps:[]}
	,{name:'C#',order:7,steps:[]}

	,{name:'F/Dm',order:-1,steps:[]}
	,{name:'Bb/Gm',order:-2,steps:[]}
	,{name:'Eb/Cm',order:-3,steps:[]}
	,{name:'Ab/Fm',order:-4,steps:[]}
	,{name:'Db/Bbm',order:-5,steps:[]}
	,{name:'Gb/Ebm',order:-6,steps:[]}
	,{name:'Cb',order:-7,steps:[]}
];

function dumpMXMLwhole(valueTree) {
	console.log('dumpMXMLwhole', valueTree);
	//valueTree.dump('','	.');
	dumpMXMLscorePartwise(valueTree.of('score-partwise'));
	/*var parts = valueTree.of('score-partwise').all('part');
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
	}*/
}
function dumpMXMLscorePartwise(scorePartwise){
	//scorePartwise.dump('','	.');
	var scoreParts = scorePartwise.of('part-list').all('score-part');
	var parts = scorePartwise.all('part');
	for (var i = 0; i < scoreParts.length; i++) {
		dumpMXMLscorePart(scoreParts[i],parts);
	}
}
function dumpMXMLscorePart(scorePart,parts){
	//console.log('part-name', scorePart.of('part-name').value);
	var id=scorePart.of('id').value;
	var part=findMXMLpart(id,parts);
	//console.log('dumpMXMLscorePart', id,part);
	dumpMXMLmeasures(scorePart,part);
}
function findMXMLpart(id,parts){
	for(var i=0;i<parts.length;i++){
		//console.log(parts[i]);
		if(parts[i].of('id').value==id){
			return parts[i];
		}
	}
	return null;
}
function dumpMXMLmeasures(scorePart,part){
	console.log('dumpMXMLmeasures id',part.of('id').value,', midi-program',scorePart.of('midi-instrument').of('midi-program').value,', volume',scorePart.of('midi-instrument').of('volume').value,', pan',scorePart.of('midi-instrument').of('pan').value);
	var measures=part.all('measure');
	for(var i=0;i<measures.length;i++){
		var divisions=measures[i].of('attributes').of('divisions').numeric(0,0,96);
		var fifths=measures[i].of('attributes').of('key').of('fifths').value;
		var mode=measures[i].of('attributes').of('key').of('mode').value;
		var beats=measures[i].of('attributes').of('time').of('beats').value;
		var beatType=measures[i].of('attributes').of('time').of('beat-type').value;
		//var perMinute=measures[i].of('direction').of('direction-type').of('metronome').of('per-minute').value;
		//var beatUnit=measures[i].of('direction').of('direction-type').of('metronome').of('beat-unit').value;
		var tempo=measures[i].of('direction').of('sound').of('tempo').value;
		console.log('	divisions',divisions,', fifths',fifths,', mode',mode,', beats',beats,', beat-type',beatType,', tempo',tempo);
		dumpMXMLnotes(measures[i].all('note'));
	}
}
function dumpMXMLnotes(notes){
	var s='';
	for(var i=0;i<notes.length;i++){
		var octave=notes[i].of('pitch').of('octave').value;
		var step=notes[i].of('pitch').of('step').value;
		var alter=notes[i].of('pitch').of('alter').numeric(-3,0,+3);
		var duration=notes[i].of('duration').value;
		s=s+', '+octave+step+':'+alter+'/'+duration;
		//console.log('		',notes[i].of('pitch').of('octave').value,notes[i].of('pitch').of('step').value,':',notes[i].of('pitch').of('alter').value,'/',notes[i].of('duration').value);
	}
	console.log('			',s);
}

