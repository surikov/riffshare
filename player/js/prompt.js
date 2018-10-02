function promptFile(event) {
	var file = event.target.files[0];
	loadMIDIFile(file);
}
function loadMIDIFile(file) {
	var fileReader = new FileReader();
	fileReader.onload = function (progressEvent ) {
		//console.log('onload',progressEvent );
		var arrayBuffer = progressEvent.target.result;
		var midiFile = new MIDIFile(arrayBuffer);
		var parsedSong = midiFile.parseSong();
		replaceSong(parsedSong);
		//levelEngine.innerWidth = (parsedSong.duration * noteRatio+settingWidth) * levelEngine.tapSize;
		//levelEngine.resetModel();
	};
	fileReader.readAsArrayBuffer(file);
}
function dropFile(e) {
	console.log('dropFile', e);
	preventDefaults(e);
	var dt = e.dataTransfer;
	var files = dt.files;
	console.log('dropFile', e, files);
	loadMIDIFile(files[0]);
}
function preventDefaults(e) {
	e.preventDefault()
	e.stopPropagation()
}
