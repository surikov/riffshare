function prompt(event) {
		var file = event.target.files[0];
		var fileReader = new FileReader();
		fileReader.onload = function(progressEvent ) {
			var arrayBuffer = progressEvent.target.result;
			var midiFile = new MIDIFile(arrayBuffer);
			var parsedSong = midiFile.parseSong();
			replaceSong(parsedSong);
			//levelEngine.innerWidth = (parsedSong.duration * noteRatio+settingWidth) * levelEngine.tapSize;
			//levelEngine.resetModel();
		};
		fileReader.readAsArrayBuffer(file);
	}
	