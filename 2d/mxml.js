console.log("import from mxml v1.1");
function parsemxml(arrayBuffer) {
	console.log('parsemxml', arrayBuffer);
	var xml = String.fromCharCode.apply(null, new Uint8Array(arrayBuffer));
	var tree = new ValueTree();
	tree.fromXMLstring(xml);
	console.log('tree', tree);
	song = emptySong();
	song.name = tree.of('score-partwise').of('credit').of('credit-words').value;
	if (!(song.name)) {
		song.name = tree.of('score-partwise').of('movement-title').value;
	}
	song.channels = [];
	var score_part = tree.of('score-partwise').of('part-list').all('score-part');
	for (var i = 0; i < score_part.length; i++) {
		var title = score_part[i].of('part-name').value;
		var id = score_part[i].of('id').value;
		var channel = emptyChannel(id, title);
		channel.id = score_part[i].of('id').value;
		channel.track = score_part[i].of('part-name').value;
		channel.channel = score_part[i].of('score-instrument').of('instrument-name').value;
		song.channels.push(channel);
		var part = findPart(id, tree);
		console.log(id, part);
		var measure = part.all('measure');
		measure.sort(function(a,b){
			return 1*a.of('number').value-1*b.of('number').value;
		});
		for(var m=0;m<measure.length;m++){
			//console.log(m, measure[m].of('number').value);
			var songMeasure=createMotif(measure[m]);
			console.log('songMeasure',songMeasure);
		}
	}
	console.log(song);
}
function createMotif(measureTree){
	//console.log('createMotif',measureTree.dump('','.'));
	var songMeasure={
		id:rid(measureTree.of('id').value)
	};
	var note = measureTree.all('note');
	for(var i=0;i<note.length;i++){
		var n=note[i];
		console.log('note',n.of('voice').value,n.of('duration').value,n.dump('','.'));
	}
	return songMeasure;
}
function findPart(id, tree) {
	var part = tree.of('score-partwise').all('part');
	for (var i = 0; i < part.length; i++) {
		if (part[i].of('id').value == id) {
			return part[i];
		}
	}
	return null;
}
function emptyPosition() {
	return {
				order : 0,
				tempo : 100,
				meter : 4,
				by : 4,
				motifs : []
			};
};
function emptyChannel() {
	return {
		id : 'id',
		program : 0,
		color : 'rgb(176,218,136)',
		offset : 0,
		track : 'track',
		channel : 'channel',
		volumes : [{
				position : 0,
				value : 127
			}
		],
		string : guitar6strings()
	};
}
function guitar6strings() {
	return [{
			order : 1,
			pitch : 64
		}, {
			order : 2,
			pitch : 59
		}, {
			order : 3,
			pitch : 55
		}, {
			order : 4,
			pitch : 50
		}, {
			order : 5,
			pitch : 45
		}, {
			order : 6,
			pitch : 40
		}
	];
}

function emptySong() {
	console.log('create empty song');
	var emptysong = {
		version : '2.21',
		album : '',
		artist : '',
		author : '',
		comments : '',
		copyright : '',
		date : '',
		name : 'New empty song',
		transcriber : '',
		writer : '',
		lyrics : [
		],
		channels : [{
				id : 70490,
				program : 0,
				color : 'rgb(176,218,136)',
				offset : 0,
				track : 'Piano',
				channel : 'Default',
				volumes : [{
						position : 0,
						value : 127
					}
				],
				string : [{
						order : 1,
						pitch : 64
					}, {
						order : 2,
						pitch : 59
					}, {
						order : 3,
						pitch : 55
					}, {
						order : 4,
						pitch : 50
					}, {
						order : 5,
						pitch : 45
					}, {
						order : 6,
						pitch : 40
					}
				]
			}
		],
		positions : [{
				order : 0,
				tempo : 100,
				meter : 4,
				by : 4,
				motifs : [{
						motif : 43914,
						channel : 70490,
						clef : 1,
						sign : 0
					}
				]
			}
		],
		motifs : [{
				id : 43914,
				chords : [
				]
			}
		]
	};
	return emptysong;
}
function rid(id){
	if(id){
		return id;
	}
	return '_'+Math.round(Math.random()*100000);
}
function importmxml(evt) {
	console.log('importmxml', evt);
	var fileList = evt.target.files;
	if (fileList.length > 0) {
		var file = fileList.item(0);
		var fileReader = new FileReader();
		fileReader.onload = function (progressEvent) {
			console.log(progressEvent);
			if (progressEvent.target.readyState == FileReader.DONE) {
				var arrayBuffer = progressEvent.target.result;
				parsemxml(arrayBuffer);
			} else {
				console.log(progressEvent.target.readyState);
			}
		};
		fileReader.readAsArrayBuffer(file);
	}
}
document.getElementById('filesOpen').addEventListener('change', importmxml, false);
