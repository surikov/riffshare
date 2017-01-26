console.log('riffShare v1.15');
var maxLen = 16 * 16;
var currentLen = 4*16;
var maxPitch = 12 * 5;
//var tracks.length=6;
//var drumCount = 8;
var titlesLen = 13;
var startTime=0;
var start16=0;
var markers=[];
var sparkleCache=[];
//var markTime=0;
//var markBeat=0;
//var drumBeats = [];
//var hLaser=null;
var vLaser=null;
var laserGroup=null;
var d3mJS=null;
var selectedFont = new THREE.Font(optimer_regular_typeface);
var iconPlayMesh=null;
			var pause1=null;
			var pause2=null;
var markNote = null;
var markSphere = null;
var light1 = null;
var light2 = null;
var light3 = null;
//var labelPlay = null;
var onAir = false;
var startID=-1;
var flat=sureInList(readTextFromlocalStorage('flat'),0,[0,1]);
var bpm=sureInList(readTextFromlocalStorage('tempo'),120,[80,100,120,140,160,180,200,220]);//120;
			var N = 4 * 60 / bpm;
			//var pieceLen = 4 * N;
			var pieceLen = (currentLen/16) * N;
			//var piece16Len =  N/2;
			var beatLen=1/16 * N;
console.log('currentLen/pieceLen',currentLen,pieceLen);
var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
			var audioContext = new AudioContextFunc();
			var player = new WebAudioFontPlayer();
player.adjustPreset(audioContext,_tone_Les_32TrippleOpenTones_461_4690_45127_file);
//player.adjustPreset(audioContext,_tone_Acoustic_32GuitarAcoustic_32Guitar_32_32_32_32_461_460_45127_file);
//player.adjustPreset(audioContext,_tone_Good_Acoustic_GuitaGood_Acoustic_Guita_461_46101_45120_file);
//player.adjustPreset(audioContext,_tone_Les_32MuteMuted_32Tones_461_460_45127_file);
function bandEqualizer(audioContext,frequency, gain) {
	var q=1.0;
	var filter = audioContext.createBiquadFilter();
	filter.frequency.value = frequency;
	filter.type = "peaking";
	filter.gain.value = gain;
	filter.Q.value = q;
	return filter;
};
var convolver=null;
//var analyser = audioContext.createAnalyser();
//analyser.fftSize = 4096;//2048;
//var analyserBufferLength = analyser.frequencyBinCount;
//var analyserUint8Array = new Uint8Array(analyser.frequencyBinCount);
//analyser.getByteTimeDomainData(analyserUint8Array);






var inGain = audioContext.createGain();
var outGain = audioContext.createGain();
var dryGain = audioContext.createGain();
var wetGain = audioContext.createGain();
var compressor = audioContext.createDynamicsCompressor();
compressor.threshold.value = -3;
compressor.knee.value = 30;
compressor.ratio.value = 12;
compressor.attack.value = 0.05;
compressor.release.value = 0.08;
var equalizers=[]
equalizers.push( this.bandEqualizer(audioContext,65, sureNumeric(readTextFromlocalStorage('equalizer0'),-10		,8,+10)));
equalizers.push( this.bandEqualizer(audioContext,125, sureNumeric(readTextFromlocalStorage('equalizer1'),-10		,5,+10)));
equalizers.push( this.bandEqualizer(audioContext,250, sureNumeric(readTextFromlocalStorage('equalizer2'),-10		,0,+10)));
equalizers.push( this.bandEqualizer(audioContext,500, sureNumeric(readTextFromlocalStorage('equalizer3'),-10		,-2,+10)));
equalizers.push( this.bandEqualizer(audioContext,1000, sureNumeric(readTextFromlocalStorage('equalizer4'),-10	,-5,+10)));
equalizers.push( this.bandEqualizer(audioContext,2000, sureNumeric(readTextFromlocalStorage('equalizer5'),-10	,-3,+10)));
equalizers.push( this.bandEqualizer(audioContext,4000, sureNumeric(readTextFromlocalStorage('equalizer6'),-10	,-1,+10)));
equalizers.push( this.bandEqualizer(audioContext,6000, sureNumeric(readTextFromlocalStorage('equalizer7'),-10	,1,+10)));
equalizers.push( this.bandEqualizer(audioContext,8000, sureNumeric(readTextFromlocalStorage('equalizer8'),-10	,3,+10)));
equalizers.push( this.bandEqualizer(audioContext,12000, sureNumeric(readTextFromlocalStorage('equalizer9'),-10	,5,+10)));
var noiseFilter = audioContext.createBiquadFilter();
noiseFilter.type = "lowpass";
noiseFilter.frequency.value = 24000;
inGain.connect(compressor);
compressor.connect(equalizers[0]);
//inGain.connect(equalizers[0]);
equalizers[0].connect(equalizers[1]);
equalizers[1].connect(equalizers[2]);
equalizers[2].connect(equalizers[3]);
equalizers[3].connect(equalizers[4]);
equalizers[4].connect(equalizers[5]);
equalizers[5].connect(equalizers[6]);
equalizers[6].connect(equalizers[7]);
equalizers[7].connect(dryGain);
equalizers[7].connect(wetGain);
//inGain.connect(dryGain);
//inGain.connect(wetGain);
dryGain.connect(outGain);
outGain.connect(noiseFilter);
//noiseFilter.connect(analyser);
//analyser.connect(audioContext.destination);
noiseFilter.connect(audioContext.destination);
//outGain.connect(audioContext.destination);
dryGain.gain.value = 0.99;
wetGain.gain.value = 0.2;
//outGain.gain.value = 0.0000001;
outGain.gain.value = 0.99;
var datalen = irr.length / 2;
					var arraybuffer = new ArrayBuffer(datalen);
					var view = new Uint8Array(arraybuffer);
					var s = irr.substr(0, 2);
					var n = parseInt(s, 16);
					view[0] = n;
					for (var i = 1; i < datalen; i++) {
						s = irr.substr(i * 2, 2);
						n = parseInt(s, 16);
						view[i] = n;
					}
if(flat<1){
					console.log('start decode irr');
					audioContext.decodeAudioData(arraybuffer, function (audioBuffer) {
						
						convolver = audioContext.createConvolver();
						convolver.buffer = audioBuffer;
						//convolver.connect(audioContext.destination);
						wetGain.connect(convolver);
						convolver.connect(outGain);
						console.log('done decode irr',audioBuffer);
					});
}
var materialWhite = new THREE.MeshLambertMaterial({
			color : 0xffffff,
			side : THREE.DoubleSide,
			transparent : true,
			opacity : 0.9
		});
var materialChess = new THREE.MeshPhongMaterial({
			color : 0x99ccff,
			transparent : true,
			opacity : 0.25
		});
		
var materialDisk = new THREE.MeshStandardMaterial({
		emissive : 0x666666,
		color : 0xffffff,
		metalness : 0.75
	});
	
var materialLabel = new THREE.MeshStandardMaterial({
			emissive : 0x222222,
			color : 0x99ccff,//color,//0xff0000
			//, roughness: 0.1
		
			metalness : 0.5
		});
		
var drums = [{
	sound:_drum_Standard_32_32_460_35,
	pitch:35,//36
	title:'Bass drum',volume:sureNumeric(readTextFromlocalStorage('drum0'),0,60,100)/100,id:0,
	notes:[],volumeRatio:1.0
	,gain:audioContext.createGain()
	},{
	sound:_drum_Standard_32_32_460_41,
	pitch:41,//43
	title:'Low Tom',volume:sureNumeric(readTextFromlocalStorage('drum1'),0,60,100)/100,id:1,
	notes:[],volumeRatio:1.0
	,gain:audioContext.createGain()
	},{
	//sound:_drum_Standard_32_32_460_38,
	sound:_drum_CM_4564_4732_32Set_46127_38,
	pitch:38,//40
	title:'Snare drum',volume:sureNumeric(readTextFromlocalStorage('drum2'),0,60,100)/100,id:2,
	notes:[],volumeRatio:1.0
	,gain:audioContext.createGain()
	},{
	sound:_drum_Standard_32_32_460_45,
	pitch:45,//47,48,50
	title:'Mid Tom',volume:sureNumeric(readTextFromlocalStorage('drum3'),0,60,100)/100,id:3,
	notes:[],volumeRatio:1.0
	,gain:audioContext.createGain()
	},{
	sound:_drum_Jazz_4632_42,
	pitch:42,//44
	title:'Closed Hi-hat',volume:sureNumeric(readTextFromlocalStorage('drum4'),0,60,100)/100,id:4,
	notes:[],volumeRatio:1.0
	,gain:audioContext.createGain()
	},{
	//sound:_drum_Standard_32_32_460_46,
	sound:_drum_CM_4564_4732_32Set_46127_46,
	pitch:46,//
	title:'Open Hi-hat',volume:sureNumeric(readTextFromlocalStorage('drum5'),0,60,100)/100,id:5,
	notes:[],volumeRatio:1.0
	,gain:audioContext.createGain()
	},{
	sound:_drum_Standard_32_32_460_51,
	pitch:51,//rest
	title:'Ride Cymbal',volume:sureNumeric(readTextFromlocalStorage('drum6'),0,60,100)/100,id:6,
	notes:[],volumeRatio:1.0
	,gain:audioContext.createGain()
	},{
	sound:_drum_Standard_32_32_460_49,
	pitch:49,//
	title:'Splash Cymbal',volume:sureNumeric(readTextFromlocalStorage('drum7'),0,60,100)/100,id:7,
	notes:[],volumeRatio:1.0
	,gain:audioContext.createGain()
	}
	/*drums[z].notes.push({
		beat : x,
		disk : disk
	});*/
];
for(var i=0;i<drums.length;i++){
	drums[i].gain.connect(inGain);
}


var tracks = [{
		sound:_tone_Les_32TrippleOpenTones_461_4690_45127_file,
		title : 'Distortion guitar',volume:sureNumeric(readTextFromlocalStorage('track0'),0,60,100)/100,octave:3,id:0,
		color : new THREE.MeshStandardMaterial({emissive : 0x991100,color : 0x666666,metalness : 0.25}),
		light:0xFF3300,
		notes : [],volumeRatio:1.0
		//31
		,gain:audioContext.createGain()
	}, {
		//sound:_tone_Good_Acoustic_GuitaGood_Acoustic_Guita_461_46101_45120_file,
		sound:_tone_Steel_45str_46Gt000053_461_460_45127,
		//sound:_tone_12_45str_46Gt000054_461_460_45127,
		//sound:_tone_Steel_32GuitarSteel_32Guitar_461_460_45127_file,
		//sound:_tone_Mandolin000055_461_460_45127,
		//sound:_tone_Acoustic_32GuitarAcoustic_32Guitar_32_32_32_32_461_460_45127_file,
		//sound:_tone_Clean_32GuitarClean_32Guitar_461_460_45127,
		title : 'Acoustic guitar',volume:sureNumeric(readTextFromlocalStorage('track1'),0,60,100)/100,octave:3,id:1,
		color :  new THREE.MeshStandardMaterial({emissive : 0x006600,color : 0x666666,metalness : 0.25}),
		light:0x00CC00,
		notes : [],volumeRatio:1.0
		//25-28
		,gain:audioContext.createGain()
	}, {
		sound:_tone_Organ_322000037_461_460_45127,
		title : 'Percussive Organ',volume:sureNumeric(readTextFromlocalStorage('track2'),0,60,100)/100,octave:4,id:2,
		color :  new THREE.MeshStandardMaterial({emissive : 0x3333ff,color : 0x666666,metalness : 0.25}),
		light:0x3333ff,
		notes : [],volumeRatio:1.0
		//17-24
		,gain:audioContext.createGain()
	}, {
		sound:_tone_Les_32MuteMuted_32Tones_461_460_45127_file,
		title : 'Palm mute guitar',volume:sureNumeric(readTextFromlocalStorage('track3'),0,60,100)/100,octave:3,id:3,
		color :  new THREE.MeshStandardMaterial({emissive : 0x330000,color : 0x666666,metalness : 0.25}),
		light:0x663333,
		notes : [],volumeRatio:1.0
		//30
		,gain:audioContext.createGain()
	}, {
		sound:_tone_Piano_321000000_461_460_45127,
		title : 'Acoustic Piano',volume:sureNumeric(readTextFromlocalStorage('track4'),0,60,100)/100,octave:3,id:4,
		color :  new THREE.MeshStandardMaterial({emissive : 0x0099FF,color : 0x666666,metalness : 0.25}),
		light:0x0099FF,
		notes : [],volumeRatio:1.0
		//rest
		,gain:audioContext.createGain()
	}, {
		//sound:_tone_Picked_32Bs_46000070_461_460_45127,
		sound:_tone_Fingered_32Bs_46fingeredbs_461_460_45127,
		title : 'Bass guitar',volume:sureNumeric(readTextFromlocalStorage('track5'),0,80,100)/100,octave:2,id:5,
		color :  new THREE.MeshStandardMaterial({emissive : 0x660066,color : 0x666666,metalness : 0.25}),
		light:0xCC00CC,
		notes : [],volumeRatio:1.0
		//33-38
		,gain:audioContext.createGain()
	}, {
		sound:_tone_Slow_32Stringsslowstrings_461_460_45127,
		title : 'String Ensemble',volume:sureNumeric(readTextFromlocalStorage('track6'),0,40,100)/100,octave:3,id:6,
		color :  new THREE.MeshStandardMaterial({emissive : 0xcc9900,color : 0x666666,metalness : 0.25}),
		light:0xcc9900,
		notes : [],volumeRatio:1.0
		//41-88
		,gain:audioContext.createGain()
	}, {
		sound:_tone_Synth_32Bass_323000076_461_460_45127,
		title : 'Synth Bass',volume:sureNumeric(readTextFromlocalStorage('track7'),0,80,100)/100,octave:3,id:7,
		color :  new THREE.MeshStandardMaterial({emissive : 0x666666,color : 0x666666,metalness : 0.25}),
		light:0x999999,
		notes : [],volumeRatio:1.0
		//39,40
		,gain:audioContext.createGain()
	}
	/*
	tracks[order].notes.push({
		pitch : pitch,
		beat : beat,
		length,
		shift,
		line : noteLine
	});
	*/
];
for(var i=0;i<tracks.length;i++){
	tracks[i].gain.connect(inGain);
}
function adjustLen(){
	var mx=0;
	for(var i=0;i<drums.length;i++){
		var drum=drums[i];
		for(var n=0;n<drum.notes.length;n++){
			var note=drum.notes[n];
			if(note.beat>mx){
				mx=note.beat;
			}
		}
	}
	for(var i=0;i<tracks.length;i++){
		var track=tracks[i];
		for(var n=0;n<track.notes.length;n++){
			var note=track.notes[n];
			if(note.beat>mx){
				mx=note.beat;
			}
		}
	}
	mx=mx+1;
	//console.log(mx);
	if(mx<1){
		mx=1;
	}
	mx=16*Math.ceil(mx/16);
	if(mx!=currentLen){
		currentLen=mx;
		var N = 4 * 60 / bpm;
		pieceLen = (currentLen/16) * N;
		//piece16Len =  N/2;
		beatLen=1/16 * N;
		//console.log('currentLen/pieceLen',currentLen,pieceLen);
	}
}
function spectrum(){
	//analyser.getByteTimeDomainData(analyserUint8Array);
	/*analyser.getByteFrequencyData(analyserUint8Array);
	var bandSize=audioContext.sampleRate/analyser.fftSize;
	console.log(audioContext.sampleRate,analyserUint8Array);
	var bufferLength = analyser.frequencyBinCount;
	for (var i = 0; i < bufferLength; i++) {
		console.log(i,'.',analyserUint8Array[i],'	',bandSize*(i+1),'Hz');
	}*/
}
function nextPiece() {
	//console.log('nextPiece',startTime,'start16',start16,'now',audioContext.currentTime,'beatLen',beatLen);
	spectrum();
	adjustLen();
	//for(var m=0;m<currentLen;m++){
	for (var m16 = 0; m16 < 16; m16++) {
		var m = start16 + m16;
		//markers.push({time:startTime + m * beatLen+0*0.25*beatLen-0.27,beat:m+0*0.25});
		//markers.push({time:startTime + m * beatLen+1*0.25*beatLen-0.27,beat:m+1*0.25});
		//markers.push({time:startTime + m * beatLen+2*0.25*beatLen-0.27,beat:m+2*0.25});
		//markers.push({time:startTime + m * beatLen+3*0.25*beatLen-0.27,beat:m+3*0.25});
		//console.log(m+0*0.25,startTime + m * beatLen+0*0.25*beatLen-0.27);
		markers.push({
			time : startTime + m16 * beatLen - 0.27,
			beat : m
		});
		markers.push({
			time : startTime + m16 * beatLen - 0.27 + 0.5 * beatLen,
			beat : m + 0.5
		});
		//console.log(m,startTime+m16 * beatLen);
	}
	//console.log('markers',currentLen,markers);
	var inChordDelay=0.01;
	//for (var n = 0; n < currentLen; n++) {
	for (var n16 = 0; n16 < 16; n16++) {
		var n=start16+n16;
		//if(n>23)break;
		for(var i=0;i<drums.length;i++){
			var drum=drums[i];
			var v=1.0;//drum.volume;
			v=v*drum.volumeRatio;
			v=v*0.75;
			//if(v>0){}else{v=0.000001}
			for(var d=0;d<drum.notes.length;d++){
				if(drum.notes[d].beat==n){
					//console.log(n,startTime + n * beatLen,drum.pitch);
					player.queueWaveTable(audioContext
					//, audioContext.destination
					//,inGain
					,drum.gain
					, drum.sound, startTime + n16 * beatLen , drum.pitch, 1.0,v);
				}
			}
		}
		for(var i=0;i<tracks.length;i++){
			var track=tracks[i];
			var v=0.75;//track.volume;
			v=v*track.volumeRatio;
			v=v*0.75;
			//if(v>0){}else{v=0.000001}
			//var chordCounter=0;
			var chord=[];
			for(var d=0;d<track.notes.length;d++){
				var note=track.notes[d];
				if(note.beat==n){
					chord.push(note);
					
					//console.log(track.volume);
					//chordCounter++;
				}
			}
			chord.sort(function(note1, note2) {
			  return note1.pitch - note2.pitch;
			});
			//if(chord.length>1)console.log(chord);
			for(var s=0;s<chord.length;s++){
				var note=chord[s];
				var shift=[{when:note.length * beatLen,pitch:note.shift+track.octave*12+note.pitch}];
				player.queueWaveTable(audioContext
					//, audioContext.destination
					//,inGain
					,track.gain
					, track.sound, startTime + n16 * beatLen +s*inChordDelay, track.octave*12+note.pitch, note.length * beatLen,v,shift);
			}
		}
	}
	
}
/*
function moveMark(){
	//console.log(markBeat,beatLen,markTime,audioContext.currentTime);
	markBeat=markBeat+1/4;
	if(markBeat>=currentLen){
		markBeat=0;
	}
	checkSparkles();
	laserGroup.position.setX(markBeat+0.5);
}
function checkSparkles(){
	if(markBeat==Math.floor(markBeat)){
		for(var d=0;d<drums.length;d++){
			var drum=drums[d];
			for(var n=0;n<drum.notes.length;n++){
				var note=drum.notes[n];
				if(note.beat==markBeat){
					lightSparkle(7,markBeat,1,d+3,0xffffff,8);
				}
			}
		}
		for(var t=0;t<tracks.length;t++){
			var track=tracks[t];
			for(var n=0;n<track.notes.length;n++){
				var note=track.notes[n];
				if(note.beat==markBeat){
					//console.log(note);
					lightSparkle(20
					,markBeat+0.5
					,1.5+note.pitch
					//,-1*t+1.0
					,1
					,track.light,note.length);
				}
			}
		}
	}
	for(var i=0;i<sparkleCache.length;i++){
		if(sparkleCache[i].count>0){
			sparkleCache[i].count--;
			if(sparkleCache[i].count<1){
				sparkleCache[i].sparkle.visible(false);
			}else{
				sparkleCache[i].sparkle.rescale((sparkleCache[i].count+1)/sparkleCache[i].length);
			}
		}
	}
};
*/
function checkSparkles(markBeat){
	for(var d=0;d<drums.length;d++){
			var drum=drums[d];
			for(var n=0;n<drum.notes.length;n++){
				var note=drum.notes[n];
				if(note.beat==markBeat){
					lightSparkle(9,markBeat,1,d+3,0xffffff,8);
				}
			}
		}
	for(var t=0;t<tracks.length;t++){
			var track=tracks[t];
			for(var n=0;n<track.notes.length;n++){
				var note=track.notes[n];
				if(note.beat==markBeat){
					//console.log(note);
					lightSparkle(20
					,markBeat+0.5
					,1.5+note.pitch
					//,-1*t+1.0
					,1
					,track.light,note.length);
				}
			}
		}
}
function lightSparkle(s,x,y,z,color,len){
	//new ItemSparkle(9, 0.5, 0xFF6600).addTo(d3mJS).move(8.5,28.5, 0.5);
	var sparkle=null;
	for(var i=0;i<sparkleCache.length;i++){
		if(sparkleCache[i].count<1 && sparkleCache[i].size==s){
			sparkle=sparkleCache[i];
			break;
		}
	}
	if(!(sparkle)){
		//console.log('new sparkle');
		sparkle={
			sparkle:new ItemSparkle(s, 0.5, 0x00ff00,true).addTo(d3mJS)
		};
		sparkleCache.push(sparkle);
	}
	sparkle.size=s;
	sparkle.sparkle.visible(true);
	sparkle.sparkle.move(x,y,z);
	sparkle.length=4*len;
	//sparkle.decay=decay;
	sparkle.count=sparkle.length;
	//sparkleCache[i].sparkle.scale=1;
	sparkleCache[i].sparkle.rescale(1);
	sparkle.sparkle.light(color);
}
function tickSparkles(){
	for(var i=0;i<sparkleCache.length;i++){
		if(sparkleCache[i].count>0){
			sparkleCache[i].count--;
			if(sparkleCache[i].count<1){
				sparkleCache[i].sparkle.visible(false);
			}else{
				sparkleCache[i].sparkle.rescale((sparkleCache[i].count+1)/sparkleCache[i].length);
			}
		}
	}
}
function checkMarker(){
	for(var m=0;m<markers.length;m++){
		if(markers[m].time<audioContext.currentTime){
			laserGroup.position.setX(markers[m].beat);
			//console.log(markers[m].beat);
			if(markers[m].beat==Math.floor(markers[m].beat)){
				checkSparkles(markers[m].beat);
			}
		}else{
			markers.splice(0, m);
			break;
		}
	}
	
}
function startPlay(){
	console.log('startPlay');
	//outGain.gain.value = 0.75;
	startTime = audioContext.currentTime + 0.1;
	start16=0;
	markers=[];
	nextPiece();
	//startTime = startTime + pieceLen;
	startTime = startTime + beatLen*16;
	start16=start16+16;
	if(start16>=currentLen){
		start16=0;
	}
	//markTime=startTime - pieceLen;
	//markBeat=0;
	//checkSparkles();
	//markBeat=3/4;
	//onAir
	//laserGroup.position.setX(markBeat+0.5);
	
	checkMarker();
	vLaser.object3d.visible = true;
	startID=setInterval(function () {
		if(onAir){
			tickSparkles();
			checkMarker();
			/*if(audioContext.currentTime>markTime){
				moveMark();
				markTime=markTime+beatLen/4;
			}*/
			if (audioContext.currentTime > startTime - 1 / 4 * N) {
				nextPiece();
				//startTime = startTime + pieceLen;
				startTime = startTime + beatLen*16;
				//markTime=startTime - pieceLen;
				//markBeat=0;
				start16=start16+16;
				if(start16>=currentLen){
					start16=0;
				}
			}
		}else{
			console.log('onAir',onAir);
	}}, 20);
	iconPlayMesh.visible=false;
			pause1.show();
			pause2.show();
}
function pausePlay(){
	console.log('pausePlay');
	//outGain.gain.value = 0.0000001;
	clearInterval(startID);
	vLaser.object3d.visible = false;
	for(var i=0;i<sparkleCache.length;i++){
		sparkleCache[i].count=0;
		sparkleCache[i].sparkle.visible(false);
		}
	player.cancelQueue(audioContext);
	/*for (var i = 0; i < player.envelopes.length; i++) {
			var e = player.envelopes[i];
			e.gain.cancelScheduledValues(0);
			e.gain.setValueAtTime(player.nearZero, audioContext.currentTime+player.nearZero);
			e.when = -1;
			try{
				e.audioBufferSourceNode.disconnect();
			}catch(ex){
				console.log(ex);
			}
			console.log(e);
		}*/
	//console.log('pausePlay',player.envelopes);
	pause1.hide();
			pause2.hide();
			iconPlayMesh.visible=true;
}
function loadState(){
	try{
		var storeDrums=readObjectFromlocalStorage('storeDrums');
		for(var i=0;i<storeDrums.length;i++){
			var note=storeDrums[i];
			addDrumDisk(d3mJS, note.beat, note.drum);
		};
		var storeTracks=readObjectFromlocalStorage('storeTracks');
		for(var i=0;i<storeTracks.length;i++){
			var note=storeTracks[i];
			//addDrumDisk(d3mJS, note.beat, note.drum);
			addNoteLine(d3mJS, note.track,   note.beat,  note.pitch,  note.length,  note.shift) ;
		};
	}catch(ex){
		console.log(ex);
	}
}
function showEqualizer(){
	/*for (var i = 0; i < equalizers.length; i++) {
		var gain=equalizers[i].gain.value;
		//console.log(i,gain);
		for(var v=-10;v<=10;v++){
			if((v==0)||(gain<0 && v<=0 && v>=gain)||(gain>0 && v>0 && v<=gain)){
					equalizers[i].knobs[v+10].check();
				}else{
					equalizers[i].knobs[v+10].uncheck();
				}
		}
	}*/
	for (var i = 0; i < equalizers.length; i++) {
		var gain=equalizers[i].gain.value;
		if(gain<0){
			bandBoxes[i].cube.scale.y=1-gain;
			bandBoxes[i].cube.position.y=21/2+2.5-(0-gain)/2;
		}else{
			bandBoxes[i].cube.scale.y=1+gain;
			bandBoxes[i].cube.position.y=21/2+2.5+(0+gain)/2;
		}
	}
}
function showVolumes(){
		//console.log('showVolumes',tracks);
		/*for (var i = 0; i < tracks.length; i++) {
			//var nn=Math.round(tracks[i].volume);
			tracks[i].gain.gain.value=tracks[i].volume;
			
			//console.log(i,tracks[i].volume,Math.round(10*tracks[i].volume),tracks[i].gain);
			for(var v=1;v<tracks[i].knobs.length;v++){
				if(v<1+Math.round(10*tracks[i].volume)){
					tracks[i].knobs[v].check();
				}else{
					tracks[i].knobs[v].uncheck();
				}
			}
		}*/
		for (var i = 0; i < tracks.length; i++) {
			tracks[i].gain.gain.value=tracks[i].volume;
			trackBoxes[tracks[i].id].cube.scale.y=2*(1+10*tracks[i].volume);
			trackBoxes[tracks[i].id].cube.position.y=0.49+trackBoxes[tracks[i].id].cube.scale.y/2;
		}
		/*for (var i = 0; i < drums.length; i++) {
			drums[i].gain.gain.value=drums[i].volume;
			for(var v=1;v<drums[i].knobs.length;v++){
				if(v<1+Math.round(10*drums[i].volume)){
					drums[i].knobs[v].check();
				}else{
					drums[i].knobs[v].uncheck();
				}
			}
		}*/
		for (var i = 0; i < drums.length; i++) {
			drums[i].gain.gain.value=drums[i].volume;
			drumBoxes[i].cube.scale.x=2*(1+10*drums[i].volume);
			drumBoxes[i].cube.position.x=12-titlesLen-drumBoxes[i].cube.scale.x/2;
			//console.log(i,drums[i].volume);
		}
	}
var bandBoxes=[];
function createEqualizerBands(){
	console.log('createEqualizerBands',equalizers.length);
	for (var x = 0; x < 10; x++) {
		var box=new ItemBox2(1.9,1,0.1,materialLabel).addTo(d3mJS).move(x*2-38,21/2+2.5,0)
		bandBoxes.push(box);
	}
	var box=new ItemBox2(equalizers.length*2, 21, 0.01,materialChess).addTo(d3mJS).move(equalizers.length-titlesLen-26,21/2+2.5,0);
	var knobBands = new ItemKnob(equalizers.length*2, 21, 0.1, 0xff0000, true).addTo(d3mJS).move(equalizers.length-titlesLen-26,21/2+2.5,0);
	knobBands.tap=function (intersectPointInWorld) {
		var x = Math.ceil((intersectPointInWorld.x - d3mJS.mainGroup.position.x - knobBands.cube.position.x +equalizers.length)/2)-1;
		var y = Math.ceil(intersectPointInWorld.y - d3mJS.mainGroup.position.y - knobBands.cube.position.y -0.5);
		//if(y<0){y=Math.ceil(y);}
		//console.log(x,y);
		equalizers[x].gain.value=y;
		saveText2localStorage('equalizer'+x,''+y);
		showEqualizer();
	};
	/*for (var x = 0; x < 10; x++) {
		var equalizer=equalizers[x];
		equalizer.knobs=[];
		for (var y = 0; y < 21; y++) {
			var n=0;
			if(y<10)n=-0.2;
			if(y>10)n=+0.2;
			var k=new ItemKnob(1.9, 0.9, 0.1, 0x99ccff, false).addTo(d3mJS).move( n-titlesLen+2*x-26, y+1, 0);
			k.band=x;
			k.gain=y-10;
			k.tap=function (intersectPointInWorld) {
				//console.log(this.band,this.ratio);
				equalizers[this.band].gain.value=this.gain;
				saveText2localStorage('equalizer'+this.band,''+this.gain);
				showEqualizer();
			}
			equalizer.knobs.push(k);
		}
	}*/
}
var drumBoxes=[];
function createDrumVolumes(){
	/*for (var i = 0; i < drums.length; i++) {
		var drum=drums[i];
		drum.knobs=[];
		for(var v=0;v<11;v++){
			var k=new ItemKnob(0.015, 1.9, 0.9, 0x99ccff, false).addTo(d3mJS).move(  -titlesLen-2, 2*v+1.3, i-0.3+4);
			k.drum = drum;
			k.volume=v/10;
			k.tap=function (intersectPointInWorld) {
				this.drum.volume=this.volume;
				saveText2localStorage('drum'+this.drum.id,''+Math.round(100*this.volume));
				showVolumes();
			};
			//if(v>5)k.uncheck(); else k.check();
			drums[i].knobs.push(k);
		}
	}*/
	var knobBars = new ItemKnob(22,0.3, drums.length, 0xff0000, true).addTo(d3mJS).move(-titlesLen+1, 0.1, drums.length/2+3);
	for (var i = 0; i < drums.length; i++) {
		var box=new ItemBox2(22,0.01, 0.9,materialChess).addTo(d3mJS).move(-titlesLen+1, 0.1, i-0.3+4);
		var bar=new ItemBox2(1,0.1, 0.9,materialLabel).addTo(d3mJS).move(-titlesLen+1, 0.1, i-0.3+4);
		drumBoxes.push(bar);
	}
	knobBars.tap=function (intersectPointInWorld) {
		var x = 11-Math.ceil((intersectPointInWorld.x - d3mJS.mainGroup.position.x - knobBars.cube.position.x +11)/2);
		var z = Math.ceil(intersectPointInWorld.z - d3mJS.mainGroup.position.z - knobBars.cube.position.z +drums.length/2 -1-0.2);
		//if(y<0){y=Math.ceil(y);}
		//console.log(x,z);
		drums[z].volume=x/10;
		saveText2localStorage('drum'+z,''+Math.round(100*x/10));
		showVolumes();
	};
}

var trackBoxes=[];
function createTrackVolumes(){
	var knobBars = new ItemKnob(0.1,22, tracks.length, 0xff0000, true).addTo(d3mJS).move(-titlesLen, 22/2+0.45, -tracks.length/2+0.1);
	for (var i = 0; i < tracks.length; i++) {
		var box=new ItemBox2(0.01,22, 0.9,materialChess).addTo(d3mJS, tracks[i].group.group).move(-titlesLen, 22/2+0.45, -0.3);
		//var box=new ItemBox2(0.01,22, 0.9,materialChess).addTo(d3mJS).move(-titlesLen+1, 0.1, i-0.3+4);
		var bar=new ItemBox(0.1,1, 0.9,tracks[i].light).addTo(d3mJS, tracks[i].group.group).move(-titlesLen, 22/2+0.45, -0.3);
		trackBoxes.push(bar);
	}
	knobBars.tap=function (intersectPointInWorld) {
		var y = Math.floor((intersectPointInWorld.y - d3mJS.mainGroup.position.y -0.45)/2);
		var z = tracks.length-Math.ceil(intersectPointInWorld.z - d3mJS.mainGroup.position.z - knobBars.cube.position.z)-4;
		//console.log(y,z,tracks);
		tracks[z].volume=y/10;
		saveText2localStorage('track'+tracks[z].id,''+Math.round(100*y/10));
		showVolumes();
	};
/*tracks[i].knobs=[];
		for(var v=0;v<11;v++){
			var k=new ItemKnob(0.015, 1.9, 0.9, tracks[i].light, false).addTo(d3mJS, tracks[i].group.group).move(  -titlesLen, 2*v+1.45, -0.3);
			k.track = tracks[i];
			k.volume=v/10;
			k.tap=function (intersectPointInWorld) {
				this.track.volume=this.volume;
				saveText2localStorage('track'+this.track.id,''+Math.round(100*this.volume));
				//onAir = false;
				//pausePlay();
				showVolumes();
			};
			//if(v>5)k.uncheck(); else k.check();
			tracks[i].knobs.push(k);*/
}
		
		
/*
//console.log(note);
					lightSparkle(20
					,markBeat+0.5
					,1.5+note.pitch
					//,-1*t+1.0
					,1
					,track.light,note.length);
*/

		
var midiNotes = [];
function midiFindNote(midiNote) {
	for (var i = 0; i < midiNotes.length; i++) {
		if (midiNotes[i].midiNote == midiNote) {
			return midiNotes[i];
		}
	}
	var note = {
		midiNote : midiNote
	};
	midiNotes.push(note);
	return note;
}
function midNoteOn(midiNote) {
	//midiFindNote(midiNote).envelope = player.queueWaveTable(audioContext, audioContext.destination, voice, 0, midiNote, 999, true);
	var track=tracks[0];
	midiFindNote(midiNote).envelope = player.queueWaveTable(audioContext
					,track.gain
					, track.sound, 0, track.octave*12+midiNote-2*12, 99999,0.75*track.volumeRatio,0);
	//console.log(midiNote);
}
function midiNoteOff(midiNote) {
	var note = midiFindNote(midiNote);
	if (note.envelope) {
		note.envelope.cancel();
	} else {
		console.log('empty envelope', note);
	}
}
function midiOnStateChange(event){
	console.log('midiOnStateChange', event);
}
function midiOnMIDImessage(){
	var data = event.data;
	var cmd = data[0] >> 4;
	var channel = data[0] & 0xf;
	var type = data[0] & 0xf0; // channel agnostic message type. Thanks, Phil Burk.
	var pitch = data[1];
	var velocity = data[2];
	// with pressure and tilt off
	// note off: 128, cmd: 8
	// note on: 144, cmd: 9
	// pressure / tilt on
	// pressure: 176, cmd 11:
	// bend: 224, cmd: 14
	switch (type) {
	case 144: // noteOn message
		midNoteOn(pitch);
		break;
	case 128: // noteOff message
		midiNoteOff(pitch);
		break;
	}
}
function requestMIDIAccessSuccess(midi){
	console.log('requestMIDIAccessSuccess', midi);
	//midi = midiAccess;
	var inputs = midi.inputs.values();
	for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
		console.log('midi input',input);
		input.value.onmidimessage = midiOnMIDImessage;
	}
	midi.onstatechange = midiOnStateChange;
}
function requestMIDIAccessFailure(e){
	console.log('requestMIDIAccessFailure', e);
}
function startListenMIDI(e){
	if (navigator.requestMIDIAccess) {
		console.log('navigator.requestMIDIAccess ok');
		navigator.requestMIDIAccess().then(requestMIDIAccessSuccess, requestMIDIAccessFailure);
	} else {
		console.log('navigator.requestMIDIAccess failed',e);
	}
}
		
function riffShareStart() {
	console.log('riffShare start');
	//console.log('------------------hook');
	window.onunload = function(){
		//console.log('------------------------------------');
		var storeDrums=[];
		for(var i=0;i<drums.length;i++){
			for(var n=0;n<drums[i].notes.length;n++){
				var note=drums[i].notes[n];
				storeDrums.push({
					drum:i,beat:note.beat
				});
			}
		}
		saveObject2localStorage('storeDrums',storeDrums);
		var storeTracks=[];
		for(var i=0;i<tracks.length;i++){
			for(var n=0;n<tracks[i].notes.length;n++){
				var note=tracks[i].notes[n];
				storeTracks.push({
					track:tracks[i].id,beat:note.beat,length:note.length,shift:note.shift,pitch:note.pitch
				});
			}
		}
		saveObject2localStorage('storeTracks',storeTracks);
		window.onunload = null;
		
	};

	d3mJS = new D3mJS();
	d3mJS.init();
	d3mJS.mainGroup.position.setX(-40);
	d3mJS.mainGroup.position.setY(-30);
	createLight(d3mJS);
	createDrumPanes(d3mJS);
	createNotesPanes(d3mJS);
	//new ItemXYZ().addTo(d3mJS);
	addSkyBox(d3mJS);
	adjustUIControls(d3mJS);
	//var txt = new ItemText('#ffffff', 'rgba(255,0,0,0.5)', 128, 128, "72px Verdana",2).addTo(d3mJS).text("test").move(0,0,0);
	//var txt2 = new ItemText('#ffffff',  256, 256, "96px Verdana",15).addTo(d3mJS).text("Start/Stop").move(1,1,1);
	//var txt2 = new ItemText('#ffffff',  512, 512, "96px Verdana",15).addTo(d3mJS).text("test").move(-10,0,0);
	//function ItemText(foreground, background, textureWidth, textureHeight, font, scale) {
	markSphere = new ItemSphere(0.5, 0x999999).addTo(d3mJS).move(0.5, -0.5, 0);

	var knobDrums = new ItemKnob(maxLen + titlesLen + 1+28, 1.2, tracks.length + drums.length*2 + 3 + 7, 0xff0000, true).addTo(d3mJS).move((maxLen - titlesLen - 1) / 2-14, -0.51, (drums.length*2 + tracks.length + 3 + 7) / 2 - tracks.length*2);
	var knobNotes = new ItemKnob(maxLen + 16, maxPitch, 0.1, 0x000ff0, true).addTo(d3mJS).move((maxLen + 16) / 2, maxPitch / 2 + 1, 0);
	var startX = knobDrums.cube.position.x;
	var startY = knobDrums.cube.position.y;
	var fLock = function () {
		startX = d3mJS.mainGroup.position.x;
		startY = d3mJS.mainGroup.position.y;
	};
	var fDrag = function (x, y) {
		var dx = x - d3mJS.pointStartX;
		var dy = d3mJS.pointStartY - y;
		var distance = new THREE.Vector3(d3mJS.camera.position.x, d3mJS.camera.position.y, d3mJS.camera.position.z).length();
		d3mJS.mainGroup.position.setX(startX + dx * d3mJS.camera.position.z / 1000);
		d3mJS.mainGroup.position.setY(startY + dy * new THREE.Vector3(d3mJS.camera.position.x, d3mJS.camera.position.y, d3mJS.camera.position.z).length() / 1000);
	};
	knobDrums.tap = function (intersectPointInWorld) {
		var x = Math.floor(intersectPointInWorld.x - d3mJS.mainGroup.position.x - knobDrums.cube.position.x + maxLen / 2) - 7-14;
		var z = Math.floor(intersectPointInWorld.z - d3mJS.mainGroup.position.z - knobDrums.cube.position.z + (drums.length + tracks.length + 3 + 7) / 2 - tracks.length) - 7;
		//console.log(x,z);
		if (x > -1 && x < maxLen && z > -1 && z < drums.length) {
			if (dropDrumBeat(z, x)) {
				//
			} else {
				addDrumDisk(d3mJS, x, z)
			}
		}
	};
	knobNotes.tap = function (intersectPointInWorld) {
		var x = Math.floor(intersectPointInWorld.x - d3mJS.mainGroup.position.x - knobNotes.cube.position.x + (maxLen + 16) / 2);
		var y = Math.floor(intersectPointInWorld.y - d3mJS.mainGroup.position.y - knobNotes.cube.position.y + maxPitch / 2);
		//console.log('markNote',markNote);
		//if (x > -1 && x < maxLen && y > -1 && y < maxPitch) {
		if (markNote) {
			//console.log('finish',x,y);
			if (x >= markNote.beat) {
				addNoteLine(d3mJS, 0,  markNote.beat, markNote.pitch, x - markNote.beat + 1, y - markNote.pitch);
			} else {
				addNoteLine(d3mJS, 0,  x, y, markNote.beat + 1 - x, markNote.pitch - y);
			}
		} else {
			if (dropNoteLine(0, x, y)) {
				//console.log('drop',x,y);
			} else {
				//console.log('mark',x,y);
				if (x > -1 && x < maxLen && y > -1 && y < maxPitch) {
					markNoteLine(0, x, y);
				}
			}
		}
		//}
	};
	//labelPlay = new Item3dText('Play/Pause', 0.1, 3, selectedFont,materialLabel).addTo(d3mJS).move(-titlesLen, 0, drums.length + 3 + 4 + 1, -Math.PI / 2, 0, 0);//.color(0x99ccff);
	var knobStart = new ItemKnob(6, 0.05, 6, 0x99ccff, true).addTo(d3mJS).move(20 / 2 - titlesLen-1, 0.5, drums.length + 7);
	var iconPlayGeometry = new THREE.CylinderGeometry( 1, 1, 1, 3 );
	iconPlayMesh = new THREE.Mesh( iconPlayGeometry, materialWhite );
	iconPlayMesh.rotation.y=0.5*Math.PI;
	iconPlayMesh.position.x=10 - titlesLen-1;
	iconPlayMesh.position.y=0.2;
	iconPlayMesh.position.z=drums.length + 7;
	d3mJS.mainGroup.add( iconPlayMesh );
	var iconCiGeometry = new THREE.CylinderGeometry( 2, 2, 1, 20 );
	var iconCiMesh = new THREE.Mesh( iconCiGeometry, materialLabel );
	iconCiMesh.rotation.y=0.5*Math.PI;
	iconCiMesh.position.x=10 - titlesLen-1;
	iconCiMesh.position.y=0.1;
	iconCiMesh.position.z=drums.length + 7;
	d3mJS.mainGroup.add( iconCiMesh );
	pause1=new ItemBox(0.5,1,2,0x99ccff).addTo(d3mJS).move(20 / 2 - titlesLen-0.5-1, 0.3, drums.length + 7);
	pause2=new ItemBox(0.5,1,2,0x99ccff).addTo(d3mJS).move(20 / 2 - titlesLen+0.5-1, 0.3, drums.length + 7);
	//pause1.material.visible
	pause1.hide();
	pause2.hide();
	knobStart.tap = function (intersectPointInWorld) {
		//console.log('start/stop');
		onAir = !onAir;
		if (!onAir) {
			//labelPlay.color(0xff9900);
			pausePlay();
			
		} else {
			//labelPlay.color(0x99ccff);
			startPlay();
			
		}
	};
	
	

	//new ItemText('#99ccff',  256, 256, "Bold 18px Verdana",20).addTo(d3mJS).text("  Start/Stop").move(0.5,0.5,drumCount+3+2);
/*
	labelTempo = new Item3dText('Tempo: 120', 0.1, 3, selectedFont,materialLabel).addTo(d3mJS).move((30 - titlesLen), 0, drums.length + 3 + 4 + 1, -Math.PI / 2, 0, 0);//.color(0x99ccff);
	var knobTempo = new ItemKnob(20, 0.5, 4, 0xffff00, true).addTo(d3mJS).move(20 / 2 - titlesLen + 30, 0.5, drums.length + 3 + 4);
	knobTempo.tap = function (intersectPointInWorld) {
		console.log('tempo');
		//
	};*/
	
	//labelTools = new Item3dText('Tools', 0.1, 2, selectedFont,materialLabel).addTo(d3mJS).move(- titlesLen, 0, drums.length + 3 + 4 + 1-5, -Math.PI / 2, 0, 0);//.color(0x99ccff);
	var knobTools = new ItemKnob(6, 0.05, 6, 0x99ccff, true).addTo(d3mJS).move(3 - titlesLen , 0.5, drums.length + 7);
	var iconToolsGeometry = new THREE.CylinderGeometry( 2, 2, 1, 6 );
	var iconToolsMesh = new THREE.Mesh( iconToolsGeometry, materialLabel );
	iconToolsMesh.position.x=10 - titlesLen-7;
	iconToolsMesh.position.y=0.1;
	iconToolsMesh.position.z=drums.length + 7;
	d3mJS.mainGroup.add( iconToolsMesh );
	knobTools.tap = function (intersectPointInWorld) {
		console.log('tools');
		window.location = "tools.html";
	};
	
	
	
	
	//var volH=10;
	for (var i = 0; i < tracks.length; i++) {
		tracks[i].id = i;
		tracks[i].group = new ItemGroup().addTo(d3mJS).move(0, 0, -1 * i);
		//var knob = new ItemKnob(titlesLen, 0.01, 0.9, tracks[i].light, false).addTo(d3mJS, tracks[i].group.group).move( - titlesLen / 2, 0.5, -0.3);
		var knob = new ItemKnob(titlesLen+maxLen, 0.01, 0.9, tracks[i].light, false).addTo(d3mJS, tracks[i].group.group).move(  maxLen / 2-titlesLen/2, 0.5, -0.3);
		knob.track = tracks[i];
		knob.tap = function (intersectPointInWorld) {
			//console.log('select',this.track.group.move(2,2,2));
			reorderTracks(this.track.id);
		};
		/*
		tracks[i].knobs=[];
		for(var v=0;v<11;v++){
			var k=new ItemKnob(0.015, 1.9, 0.9, tracks[i].light, false).addTo(d3mJS, tracks[i].group.group).move(  -titlesLen, 2*v+1.45, -0.3);
			k.track = tracks[i];
			k.volume=v/10;
			k.tap=function (intersectPointInWorld) {
				this.track.volume=this.volume;
				saveText2localStorage('track'+this.track.id,''+Math.round(100*this.volume));
				//onAir = false;
				//pausePlay();
				showVolumes();
			};
			//if(v>5)k.uncheck(); else k.check();
			tracks[i].knobs.push(k);
		}
		*/
		//new Item3dText(tracks[i].title, 0.01, 0.5, selectedFont,tracks[i].color).addTo(d3mJS, tracks[i].group.group).move(-titlesLen, 0.5, 0, -Math.PI / 2, 0, 0);//.color(tracks[i].color);
		//console.log('set',tracks[i]);
	}
	
	createTrackVolumes();
	
	/*
	for (var i = 0; i < drums.length; i++) {
		var drum=drums[i];
		drum.knobs=[];
		for(var v=0;v<11;v++){
			var k=new ItemKnob(0.015, 1.9, 0.9, 0x99ccff, false).addTo(d3mJS).move(  -titlesLen-2, 2*v+1.3, i-0.3+4);
			k.drum = drum;
			k.volume=v/10;
			k.tap=function (intersectPointInWorld) {
				this.drum.volume=this.volume;
				saveText2localStorage('drum'+this.drum.id,''+Math.round(100*this.volume));
				showVolumes();
			};
			//if(v>5)k.uncheck(); else k.check();
			drums[i].knobs.push(k);
		}
	}
	*/
	createDrumVolumes();
	createEqualizerBands();
	/*
	for (var x = 0; x < 10; x++) {
		var equalizer=equalizers[x];
		equalizer.knobs=[];
		for (var y = 0; y < 21; y++) {
			var n=0;
			if(y<10)n=-0.2;
			if(y>10)n=+0.2;
			var k=new ItemKnob(1.9, 0.9, 0.1, 0x99ccff, false).addTo(d3mJS).move( n-titlesLen+2*x-26, y+1, 0);
			k.band=x;
			k.gain=y-10;
			k.tap=function (intersectPointInWorld) {
				//console.log(this.band,this.ratio);
				equalizers[this.band].gain.value=this.gain;
				saveText2localStorage('equalizer'+this.band,''+this.gain);
				showEqualizer();
			}
			equalizer.knobs.push(k);
		}
	}
	*/
	
	
	/*
	new ItemLaserRay(1,0x99ccff).addTo(d3mJS).align(new THREE.Vector3(8.5, -0.2, 0.2),new THREE.Vector3(8.5, 4+maxPitch, 0.2));
	new ItemSparkle(9, 0.5, 0xFF6600).addTo(d3mJS).move(8.5,28.5, 0.5);
	var lw=drumCount + 2 * tracks.length + 3 + 7;
	new ItemLaserRay(1,0x99ccff).addTo(d3mJS).align(new THREE.Vector3(8.5, 0.2, - 2 * tracks.length),new THREE.Vector3(8.5, 0.2, 3+drumCount+7));
	new ItemSparkle(9, 0.5, 0xffffff).addTo(d3mJS).move(8.5,0.5, 3.5);
	new ItemSparkle(9, 0.5, 0xffffff).addTo(d3mJS).move(8.5,0.5, 4.5);
	*/
	/*
	new Item3dText('Distortion guitar',0.1,1,selectedFont).addTo(d3mJS).move(-12,0.2,-2*0,-Math.PI/2,0,0).color(0x99ccff);
	new Item3dText('Palm mute guitar',0.1,1,selectedFont).addTo(d3mJS).move(-12,0.2,-2*1,-Math.PI/2,0,0).color(0x99ccff);
	new Item3dText('Acoustic Piano',0.1,1,selectedFont).addTo(d3mJS).move(-12,0.2,-2*2,-Math.PI/2,0,0).color(0x99ccff);
	new Item3dText('Bass guitar',0.1,1,selectedFont).addTo(d3mJS).move(-12,0.2,-2*3,-Math.PI/2,0,0).color(0x99ccff);
	new Item3dText('Acoustic guitar',0.1,1,selectedFont).addTo(d3mJS).move(-12,0.2,-2*4,-Math.PI/2,0,0).color(0x99ccff);
	new Item3dText('Percussive Organ',0.1,1,selectedFont).addTo(d3mJS).move(-12,0.2,-2*5,-Math.PI/2,0,0).color(0x99ccff);
	new Item3dText('String Ensemble',0.1,1,selectedFont).addTo(d3mJS).move(-12,0.2,-2*6,-Math.PI/2,0,0).color(0x99ccff);
	new Item3dText('Synth Bass',0.1,1,selectedFont).addTo(d3mJS).move(-12,0.2,-2*7,-Math.PI/2,0,0).color(0x99ccff);
	 */
	//new ItemSphere(1,0x99ccff).addTo(d3mJS).move(0.5,0.5,drumCount+3+2);
	knobDrums.lock = fLock;
	knobDrums.drag = fDrag;
	knobNotes.lock = fLock;
	knobNotes.drag = fDrag;
	
	createMark(d3mJS);

	d3mJS.onRender = function () {
		var ms = new Date().getTime();
		//console.log('onRender',ms);
		light1.move(150 * Math.sin(ms / 3000), 100 * Math.cos(ms / 1800) + 50, 130 * Math.sin(ms / 1500) + 100);
		light2.move(90 * Math.sin(ms / 2200), 50 * Math.cos(ms / 3800) + 50, 70 * Math.cos(ms / 1600) + 100);
		light3.move(100 * Math.cos(ms / 1200), 60 * Math.cos(ms / 2100) + 50, 130 * Math.sin(ms / 1900) + 100);
	};

	//addTestData(d3mJS);
	loadState();
	showVolumes();
	showEqualizer();
	startListenMIDI();
}
function createMark(d3mJS){
	/*
	new ItemLaserRay(1,0x99ccff).addTo(d3mJS).align(new THREE.Vector3(8.5, -0.2, 0.2),new THREE.Vector3(8.5, 4+maxPitch, 0.2));
	new ItemSparkle(9, 0.5, 0xFF6600).addTo(d3mJS).move(8.5,28.5, 0.5);
	var lw=drumCount + 2 * tracks.length + 3 + 7;
	new ItemLaserRay(1,0x99ccff).addTo(d3mJS).align(new THREE.Vector3(8.5, 0.2, - 2 * tracks.length),new THREE.Vector3(8.5, 0.2, 3+drumCount+7));
	new ItemSparkle(9, 0.5, 0xffffff).addTo(d3mJS).move(8.5,0.5, 3.5);
	new ItemSparkle(9, 0.5, 0xffffff).addTo(d3mJS).move(8.5,0.5, 4.5);
	*/
	var b=0;
	//8.5;
	laserGroup = new THREE.Group();
	vLaser=new ItemLaserRay(1,0x99ccff).addTo(d3mJS,laserGroup).align(new THREE.Vector3(b, -0.2, 0.2),new THREE.Vector3(b, 1+maxPitch, 0.2));
	//hLaser=new ItemLaserRay(1,0x99ccff).addTo(d3mJS,laserGroup).align(new THREE.Vector3(b, 0.2, - 2 * tracks.length),new THREE.Vector3(b, 0.2, 3+drums.length+7));
	laserGroup.position.setX(9);
	vLaser.object3d.visible = false;
	d3mJS.mainGroup.add(laserGroup);
}
function reorderTracks(id) {
	var order = 0;
	for (var i = 0; i < tracks.length; i++) {
		var t=tracks[i];
		if (t.id == id) {
			tracks.splice( i, 1 );
			tracks.splice(0, 0, t);
			break;
		}
	}
	for (var i = 0; i < tracks.length; i++) {
		tracks[i].group.move(0, 0, -1 * i);
	}
};
function adjustUIControls(d3mJS) {
	d3mJS.uiControls.minDistance = 3;
	d3mJS.uiControls.maxDistance = 500;
	d3mJS.uiControls.enablePan = false;
	//d3mJS.uiControls.enableZoom=false;

}
function addSkyBox(d3mJS) {
	new ItemInvertedGlobe(501, 'img/skybox11.jpg').addTo(d3mJS);
}
function _addNoteLine(d3mJS, layer, startX, startY, endX, endY, color) {
	//new ItemNoteLine(color).addTo(d3mJS).move(startX + 0.5, startY + 1.5, layer, endX + 0.9, endY + 1.5, layer);
}
function addNoteLine(d3mJS, order,  beat, pitch, length, shift) {
//console.log(order,  beat, pitch, length, shift);
	var noteLine = new ItemNoteLine(tracks[order].color,beat + 0.5, pitch + 1.5, 0, beat + length, pitch + shift + 1.5, 0)//
	.addTo(d3mJS,tracks[order].group.group)//
	.move(beat + 0.5, pitch + 1.5, 0, beat + length, pitch + shift + 1.5, 0//
	);
	//console.log('addNoteLine',noteLine);
	tracks[order].notes.push({
		pitch : pitch,
		beat : beat,
		length:length,
		shift:shift,
		line : noteLine
	});
	unMarkNotes();
}
function markNoteLine(order, beat, pitch) {
	markNote = {
		beat : beat,
		pitch : pitch
	};
	markSphere.move(beat + 0.5, pitch + 1.5, 0);
}
function unMarkNotes() {
	markNote = null;
	markSphere.move(0.5, -0.5, 0);
}
function dropNoteLine(order, beat, pitch) {
	var la = tracks[order].notes;
	//console.log(order,beat,pitch,la);
	for (var i = 0; i < la.length; i++) {
		var noteLine = la[i];
		//console.log(i,noteLine);
		if (noteLine.pitch == pitch && noteLine.beat == beat) {
			noteLine.line.drop();
			la.splice(i, 1);
			return true;
		}
	}
	return false;
}
function addDrumDisk(d3mJS, x, z) {
	//var disk = new ItemDisk(0.4, 0.1, 0x666666).addTo(d3mJS).move(x + 0.5, 0.2, z + 3.5);
	var disk = new ItemDisk(0.4, 0.1, materialDisk).addTo(d3mJS).move(x + 0.5, 0.2, z + 3.5);
	
	/*drumBeats.push({
		drum : z,
		beat : x,
		disk : disk
	});*/
	drums[z].notes.push({
		beat : x,
		disk : disk
	});
}
function dropDrumBeat(drum, beat) {
	/*for (var i = 0; i < drumBeats.length; i++) {
		if (drumBeats[i].drum == drum && drumBeats[i].beat == beat) {
			drumBeats[i].disk.drop();
			drumBeats.splice(i, 1);
			return true;
		}
	}*/
	
	for (var i = 0; i < drums[drum].notes.length; i++) {
		if (drums[drum].notes[i].beat == beat) {
			drums[drum].notes[i].disk.drop();
			drums[drum].notes.splice(i, 1);
			return true;
		}
	}
	return false;
}
			//var bpm = 120;
			//var N = 4 * 60 / bpm;
			//console.log('N',N);
function orchestra(pitch, duration){return {drum:false,nn:2,pitch:pitch-24,duration:duration*16};}
function synth(pitch, duration){return {drum:false,nn:6,pitch:pitch-24,duration:duration*16};}
function bass(pitch, duration){return {drum:false,nn:5,pitch:pitch-24,duration:duration*16};}
function drum(){return {drum:true,nn:0};}
function snare(){return {drum:true,nn:2};}
function hihat(){return {drum:true,nn:4};}
function open(){return {drum:true,nn:5};}

function addTestData(d3mJS) {


			var C2 = 0+12*2, c2 = 1+12*2, D2 = 2+12*2, d2 = 3+12*2, E2 = 4+12*2, F2 = 5+12*2, f2 = 6+12*2, G2 = 7+12*2, g2 = 8+12*2, A2 = 9+12*2, a2 = 10+12*2, B2 = 11+12*2;
			var C3 = 0+12*3, c3 = 1+12*3, D3 = 2+12*3, d3 = 3+12*3, E3 = 4+12*3, F3 = 5+12*3, f3 = 6+12*3, G3 = 7+12*3, g3 = 8+12*3, A3 = 9+12*3, a3 = 10+12*3, B3 = 11+12*3;
			var C4 = 0+12*4, c4 = 1+12*4, D4 = 2+12*4, d4 = 3+12*4, E4 = 4+12*4, F4 = 5+12*4, f4 = 6+12*4, G4 = 7+12*4, g4 = 8+12*4, A4 = 9+12*4, a4 = 10+12*4, B4 = 11+12*4;
			var C5 = 0+12*5, c5 = 1+12*5, D5 = 2+12*5, d5 = 3+12*5, E5 = 4+12*5, F5 = 5+12*5, f5 = 6+12*5, G5 = 7+12*5, g5 = 8+12*5, A5 = 9+12*5, a5 = 10+12*5, B5 = 11+12*5;
			var C6 = 0+12*6, c6 = 1+12*6, D6 = 2+12*6, d6 = 3+12*6, E6 = 4+12*6, F6 = 5+12*6, f6 = 6+12*6, G6 = 7+12*6, g6 = 8+12*6, A6 = 9+12*6, a6 = 10+12*6, B6 = 11+12*6;

	var notes=[
 [hihat(),drum(),        bass(C3,1/16),orchestra(C5,1/4),synth(C3,1/1),synth(C4,1/1),synth(G3,1/1),synth(C5,1/2),synth(d5,3/8)]//1/16
,[hihat()                                                                                                                     ]//
,[open(),                bass(C3,1/16)                                                                                        ]//
,[                       bass(C3,1/16)                                                                                        ]//
,[hihat(),drum(),snare(),bass(C3,1/16)                                                                                        ]//
,[hihat(),               bass(C3,1/16)                                                                                        ]//
,[open(),                bass(C3,1/16),                  synth(D5,1/8)                                                        ]//
,[                       bass(C3,1/16)                                                                                        ]//
,[hihat(),drum(),        bass(C3,1/16),                  synth(C5,1/8)                                                        ]//
,[hihat(),               bass(C3,1/16),                  synth(C3,1/1)                                                        ]//
,[open(),                                                synth(D5,1/8)                                                        ]//
,[                       bass(C3,1/16)                                                                                        ]//
,[hihat(),drum(),snare(),bass(C3,1/16),                  synth(d5,1/8)                                                        ]//
,[hihat(),               bass(C3,1/16)                                                                                        ]//
,[open(),                bass(C3,1/16),orchestra(G4,1/8),synth(G5,1/8)                                                        ]//
,[                       bass(C3,1/16)                                                                                        ]//
,[hihat(),drum(),        bass(G2,1/16),orchestra(a5,1/4),synth(G3,1/1),synth(G4,1/1),synth(D5,3/1),synth(a5,3/8)              ]//16/16
,[hihat()                                                                                                                     ]//
,[open(),                bass(G2,1/16)                                                                                        ]//
,[                       bass(G2,1/16)                                                                                        ]//
,[hihat(),drum(),snare(),bass(G2,1/16)                                                                                        ]//
,[hihat(),               bass(G2,1/16)                                                                                        ]//
,[open(),                bass(G2,1/16),                  synth(A5,1/8)                                                        ]//
,[                       bass(G2,1/16)                                                                                        ]//
,[hihat(),drum(),        bass(G2,1/16),                  synth(G5,1/8)                                                        ]//
,[hihat(),               bass(G2,1/16)                                                                                        ]//
,[open(),                bass(G2,1/16),                  synth(A5,1/8)                                                        ]//
,[                       bass(G2,1/16)                                                                                        ]//
,[hihat(),drum(),snare(),bass(G2,1/16),                  synth(a5,1/8)                                                        ]//
,[hihat(),               bass(G2,1/16)                                                                                        ]//
,[open(),                bass(G2,1/16),orchestra(d5,1/8),synth(D6,1/8)                                                        ]//
,[                       bass(G2,1/16)                                                                                        ]//
,[hihat(),drum(),        bass(a2,1/16),orchestra(F5,1/1),synth(a3,2/1),synth(a4,2/1),synth(F5,2/1),synth(F6,2/1)              ]//32/16
,[hihat()                                                                                                                     ]//
,[open(),                bass(a2,1/16)                                                                                        ]//
,[                       bass(a2,1/16)                                                                                        ]//
,[hihat(),drum(),snare(),bass(a2,1/16)                                                                                        ]//
,[hihat(),               bass(a2,1/16)                                                                                        ]//
,[open(),                bass(a2,1/16)                                                                                        ]//
,[                       bass(a2,1/16)                                                                                        ]//
,[hihat(),drum(),        bass(a2,1/16)                                                                                        ]//
,[hihat(),               bass(a2,1/16)                                                                                        ]//
,[open(),                bass(a2,1/16)                                                                                        ]//
,[                       bass(a2,1/16)                                                                                        ]//
,[hihat(),drum(),snare(),bass(a2,1/16)                                                                                        ]//
,[hihat(),               bass(a2,1/16)                                                                                        ]//
,[open(),                bass(a2,1/16)                                                                                        ]//
,[                       bass(a2,1/16)                                                                                        ]//
,[hihat(),drum(),        bass(a2,1/16)                                                                                        ]//48/16
,[hihat()                                                                                                                     ]//
,[open(),                bass(a2,1/16)                                                                                        ]//
,[                       bass(a2,1/16)                                                                                        ]//
,[hihat(),drum(),snare(),bass(a2,1/16)                                                                                        ]//
,[hihat(),               bass(a2,1/16)                                                                                        ]//
,[open(),                bass(a2,1/16)                                                                                        ]//
,[                       bass(a2,1/16)                                                                                        ]//
,[hihat(),drum(),        bass(a2,1/16)                                                                                        ]//
,[hihat(),               bass(a2,1/16)                                                                                        ]//
,[open(),                bass(a2,1/16)                                                                                        ]//
,[                       bass(a2,1/16)                                                                                        ]//
,[hihat(),drum(),snare(),bass(a2,1/16)                                                                                        ]//
,[hihat(),               bass(a2,1/16)                                                                                        ]//
,[open(),                bass(a2,1/16)                                                                                        ]//
,[                       bass(a2,1/16)                                                                                        ]//
];
for (var n = 0; n < notes.length; n++) {
	var beat = notes[n];
	for (var i = 0; i < beat.length; i++) {
		if (beat[i]) {
			if(beat[i].drum){
				//console.log(n,i,beat[i].nn);
				addDrumDisk(d3mJS, n, beat[i].nn);
			}else{
				//addNoteLine(d3mJS, order,  beat, pitch, length, shift) {
				addNoteLine(d3mJS, beat[i].nn,n,  beat[i].pitch, beat[i].duration, 0);
			}
			//player.queueWaveTable(audioContext, beat[i].gain, beat[i].preset, startTime + n * beatLen , beat[i].pitch, beat[i].duration);
		}
	}
}

}
function createNotesPanes(d3mJS) {
	var n = 1;
	/*
	for (var x = 1; x < currentLen; x = x + 16) {
		//new ItemText('#99ccff', 256, 256, "Bold 18px Verdana", 20).addTo(d3mJS).text('' + n).move(x, maxPitch + 1 + 1, 0);
		new Item3dText('' + n, 0.01, 1, selectedFont,materialLabel).addTo(d3mJS).move(x + 12, maxPitch + 2, 0, 0, 0, 0);//.color(0x99ccff);
		n++;
	}
	*/
	/*
	new ItemGlass(currentLen, 0.1, 0.1, new THREE.MeshPhongMaterial({
			color : 0x99ccff,
			transparent : true,
			opacity : 0.5
		})).addTo(d3mJS).move(currentLen / 2, maxPitch + 4, 0);
		*/
	var lightGlass = new THREE.MeshPhongMaterial({
			color : 0xffffff,
			transparent : true,
			opacity : 0.25
		});
	var darkGlass = new THREE.MeshPhongMaterial({
			color : 0x000000,
			transparent : true,
			opacity : 0.5
		});
	for (var i = 0; i < maxPitch; i = i + 12) {
		//console.log(i, i * 12 + 1.5 + 0);
		/*
		new ItemGlass(maxLen, 0.9, 0.1, 0x99ccff, 0.2).addTo(d3mJS).move(maxLen / 2, i + 1.5 + 0, -0.1);
		new ItemGlass(maxLen, 0.9, 0.1, 0x99ccff, 0.1).addTo(d3mJS).move(maxLen / 2, i + 1.5 + 1, -0.1);
		new ItemGlass(maxLen, 0.9, 0.1, 0x99ccff, 0.2).addTo(d3mJS).move(maxLen / 2, i + 1.5 + 2, -0.1);
		new ItemGlass(maxLen, 0.9, 0.1, 0x99ccff, 0.1).addTo(d3mJS).move(maxLen / 2, i + 1.5 + 3, -0.1);
		new ItemGlass(maxLen, 0.9, 0.1, 0x99ccff, 0.2).addTo(d3mJS).move(maxLen / 2, i + 1.5 + 4, -0.1);
		new ItemGlass(maxLen, 0.9, 0.1, 0x99ccff, 0.2).addTo(d3mJS).move(maxLen / 2, i + 1.5 + 5, -0.1);
		new ItemGlass(maxLen, 0.9, 0.1, 0x99ccff, 0.1).addTo(d3mJS).move(maxLen / 2, i + 1.5 + 6, -0.1);
		new ItemGlass(maxLen, 0.9, 0.1, 0x99ccff, 0.2).addTo(d3mJS).move(maxLen / 2, i + 1.5 + 7, -0.1);
		new ItemGlass(maxLen, 0.9, 0.1, 0x99ccff, 0.1).addTo(d3mJS).move(maxLen / 2, i + 1.5 + 8, -0.1);
		new ItemGlass(maxLen, 0.9, 0.1, 0x99ccff, 0.2).addTo(d3mJS).move(maxLen / 2, i + 1.5 + 9, -0.1);
		new ItemGlass(maxLen, 0.9, 0.1, 0x99ccff, 0.1).addTo(d3mJS).move(maxLen / 2, i + 1.5 + 10, -0.1);
		new ItemGlass(maxLen, 0.9, 0.1, 0x99ccff, 0.2).addTo(d3mJS).move(maxLen / 2, i + 1.5 + 11, -0.1);
		*/
		new ItemGlass(maxLen+16, 0.9, 0.1, lightGlass).addTo(d3mJS).move(maxLen / 2+8, i + 1.5 + 0, -0.71);
		//new ItemGlass(maxLen, 0.9, 0.1, darkGlass).addTo(d3mJS).move(maxLen / 2, i + 1.5 + 1, -0.1);
		new ItemGlass(maxLen+16, 0.9, 0.1, lightGlass).addTo(d3mJS).move(maxLen / 2+8, i + 1.5 + 2, -0.71);
		//new ItemGlass(maxLen, 0.9, 0.1, darkGlass).addTo(d3mJS).move(maxLen / 2, i + 1.5 + 3, -0.1);
		new ItemGlass(maxLen+16, 0.9, 0.1, lightGlass).addTo(d3mJS).move(maxLen / 2+8, i + 1.5 + 4, -0.71);
		new ItemGlass(maxLen+16, 0.9, 0.1, lightGlass).addTo(d3mJS).move(maxLen / 2+8, i + 1.5 + 5, -0.71);
		//new ItemGlass(maxLen, 0.9, 0.1, darkGlass).addTo(d3mJS).move(maxLen / 2, i + 1.5 + 6, -0.1);
		new ItemGlass(maxLen+16, 0.9, 0.1, lightGlass).addTo(d3mJS).move(maxLen / 2+8, i + 1.5 + 7, -0.71);
		//new ItemGlass(maxLen, 0.9, 0.1, darkGlass).addTo(d3mJS).move(maxLen / 2, i + 1.5 + 8, -0.1);
		new ItemGlass(maxLen+16, 0.9, 0.1, lightGlass).addTo(d3mJS).move(maxLen / 2+8, i + 1.5 + 9, -0.71);
		//new ItemGlass(maxLen, 0.9, 0.1, darkGlass).addTo(d3mJS).move(maxLen / 2, i + 1.5 + 10, -0.1);
		new ItemGlass(maxLen+16, 0.9, 0.1, lightGlass).addTo(d3mJS).move(maxLen / 2+8, i + 1.5 + 11, -0.71);
	}
	/*var materialBlack = new THREE.MeshLambertMaterial({
			color : 0x000000 //0x113355
		,
			side : THREE.DoubleSide,
			transparent : true,
			opacity : 0.5
		});*/
	/*var materialWhite = new THREE.MeshLambertMaterial({
			color : 0xffffff,
			side : THREE.DoubleSide,
			transparent : true,
			opacity : 0.9
		});*/
	/*var materialWhite = new THREE.MeshStandardMaterial({
			emissive : 0xffffff,
			side : THREE.DoubleSide,
			color : 0xffffff,
			metalness : 0.75,
			transparent : true,
			opacity : 0.75
		});*/
	var mi = null;
	var group = new THREE.Group();
	var vline = new THREE.PlaneGeometry(0.03, maxPitch);
	var vlimit = new THREE.PlaneGeometry(0.5, maxPitch);
	for (var x = 1; x < maxLen; x++) {
		if (Math.floor(x / 16) == x / 16) {
			mi = new THREE.Mesh(vlimit, materialWhite);
			mi.position.setZ(0.25);
		} else {
			mi = new THREE.Mesh(vline, materialWhite);
		}
		mi.rotation.y = Math.PI * 0.5;
		mi.position.setX(x);
		mi.position.setY(maxPitch / 2);
		group.add(mi);
	}
	var vlineB=new THREE.PlaneGeometry(0.5, maxLen);
	for(var y=12;y<maxPitch;y=y+12){
		var mi=new THREE.Mesh(vlineB, materialWhite);
		mi.rotation.x=Math.PI * 0.5;
		mi.rotation.z=Math.PI * 0.5;
		mi.position.setX(maxLen/2);
		mi.position.setY(y);
		group.add( mi );
	}
	/*var vlineB=new THREE.PlaneGeometry(1, 36);
	for(var x=16;x<64;x=x+16){
	var mi=new THREE.Mesh(vlineB, material);
	mi.rotation.y=Math.PI * 0.5;
	mi.position.setX(x);
	mi.position.setY(18);
	group.add( mi );
	}*/
	/*var hline=new THREE.PlaneGeometry(0.2, maxLen);
	for(var y=1;y<maxPitch;y++){
	if(Math.floor(y/12)==y/12){
	mi=new THREE.Mesh(hline, materialWhite);
	}else{
	mi=new THREE.Mesh(hline, materialBlack);
	}
	mi.rotation.x=Math.PI * 0.5;
	mi.rotation.z=Math.PI * 0.5;
	mi.position.setX(maxLen/2);
	mi.position.setY(y);
	group.add( mi );
	}*/

	//group.position.setX(100);
	group.position.setY(1);
	//group.position.setZ(-1);

	d3mJS.mainGroup.add(group);

}
function createDrumPanes(d3mJS) {
	try{
		new ItemMirror(28+maxLen + titlesLen + 1, drums.length + 2 * tracks.length + 3 + 7 //
		, (maxLen - titlesLen - 1+28) / 2-28, 0, (drums.length + 2 * tracks.length + 3 + 7) / 2 - 2 * tracks.length //
		, -0.5 * Math.PI, 0, 0 //
		).addTo(d3mJS);
	}catch(ex){
		console.log(ex);
	}
	new ItemBox(maxLen + titlesLen + 1+28, 1, 2 * tracks.length + drums.length + 3 + 7, 0x113355)
	.addTo(d3mJS)
	.move((maxLen - titlesLen - 1+28) / 2-28, -0.51, (drums.length + 2 * tracks.length + 3 + 7) / 2 - 2 * tracks.length);
	/*for (var i = 0; i < tracks.length; i++) {
	new Item3dText(tracks[i].title, 0.01, 1, selectedFont).addTo(d3mJS).move(-titlesLen, 0.5, -2 * i, -Math.PI / 2, 0, 0).color(tracks[i].color);
	}*/
	/*
	for(var i=0;i<drums.length;i++){
		new Item3dText(drums[i].title, 0.01, 0.5, selectedFont,materialLabel).addTo(d3mJS).move((13 - titlesLen-5), 0.1, 3.75 + i, -Math.PI / 2, 0, 0);//.color(0x99ccff);
	}*/
	/*
	new Item3dText('Bass drum', 0.01, 0.5, selectedFont).addTo(d3mJS).move((13 - titlesLen), 0.1, 3.75 + 0, -Math.PI / 2, 0, 0).color(0x99ccff);
	new Item3dText('Low Tom', 0.01, 0.5, selectedFont).addTo(d3mJS).move((13 - titlesLen), 0.1, 3.75 + 1, -Math.PI / 2, 0, 0).color(0x99ccff);
	new Item3dText('Snare drum', 0.01, 0.5, selectedFont).addTo(d3mJS).move((13 - titlesLen), 0.1, 3.75 + 2, -Math.PI / 2, 0, 0).color(0x99ccff);
	new Item3dText('Mid Tom', 0.01, 0.5, selectedFont).addTo(d3mJS).move((13 - titlesLen), 0.1, 3.75 + 3, -Math.PI / 2, 0, 0).color(0x99ccff);
	new Item3dText('Closed Hi-hat', 0.01, 0.5, selectedFont).addTo(d3mJS).move((13 - titlesLen), 0.1, 3.75 + 4, -Math.PI / 2, 0, 0).color(0x99ccff);
	new Item3dText('Open Hi-hat', 0.01, 0.5, selectedFont).addTo(d3mJS).move((13 - titlesLen), 0.1, 3.75 + 5, -Math.PI / 2, 0, 0).color(0x99ccff);
	new Item3dText('Ride Cymbal', 0.01, 0.5, selectedFont).addTo(d3mJS).move((13 - titlesLen), 0.1, 3.75 + 6, -Math.PI / 2, 0, 0).color(0x99ccff);
	new Item3dText('Splash Cymbal', 0.01, 0.5, selectedFont).addTo(d3mJS).move((13 - titlesLen), 0.1, 3.75 + 7, -Math.PI / 2, 0, 0).color(0x99ccff);
	*/
	//new Item3dText('Low Tom', 0.01, 0.5, selectedFont).addTo(d3mJS).move((7 - titlesLen), 0.1, 3+8, -Math.PI / 2, 0, 0).color(0x99ccff);
	//new Item3dText('Mid Tom', 0.01, 0.5, selectedFont).addTo(d3mJS).move((7 - titlesLen), 0.1, 3+9, -Math.PI / 2, 0, 0).color(0x99ccff);
	//var knobDrums=new ItemKnob(maxLen, 1.2, tracks.length+drumCount, 0xff0000,false).addTo(d3mJS).move(maxLen/2,-0.51,(drumCount+tracks.length)/2-tracks.length);
	/*var materialBlack = new THREE.MeshStandardMaterial({
			emissive : 0xffffff,
			side : THREE.DoubleSide,
			color : 0xffffff,
			metalness : 0.75,
			transparent : true,
			opacity : 0.25
		});
*/
	/*
	new THREE.MeshLambertMaterial({
	color : 0x000000//0x113355, side: THREE.DoubleSide
	//, transparent: true
	//,opacity:0.9
	});*/
	/*var materialWhite = new THREE.MeshStandardMaterial({
			emissive : 0xffffff,
			side : THREE.DoubleSide,
			color : 0xffffff,
			metalness : 0.75,
			transparent : true,
			opacity : 0.75
		});*/
	var mi = null;
	//var group = new THREE.Group();
	var g = new THREE.Geometry();
	var vlimit = new THREE.PlaneGeometry(0.5, drums.length);
	for (var x = 16; x < maxLen; x=x+16) {
		mi = new THREE.Mesh(vlimit, materialWhite);
		mi.rotation.x = Math.PI * 0.5;
		mi.rotation.y = Math.PI * 0.5;
		mi.position.setX(x);
		mi.position.setY(0.2);
		mi.position.setZ(3 + drums.length / 2);
		mi.updateMatrix();
		g.merge(mi.geometry, mi.matrix);
	}
	d3mJS.mainGroup.add(new THREE.Mesh(g, materialWhite));
	
	var geometry2 = new THREE.Geometry();
	var cell = new THREE.PlaneGeometry(1, 1);
	for (var x = 0; x < maxLen; x=x+2) {
		for (var z = 0; z < drums.length; z=z+2) {
			mi = new THREE.Mesh(cell, materialChess);
			mi.rotation.x = -Math.PI * 0.5;
			mi.position.setX(0.5+x);
			mi.position.setY(0.1);
			mi.position.setZ(3+0.5+z);
			mi.updateMatrix();
			geometry2.merge(mi.geometry, mi.matrix);
			
			mi = new THREE.Mesh(cell, materialChess);
			mi.rotation.x = -Math.PI * 0.5;
			mi.position.setX(0.5+x+1);
			mi.position.setY(0.1);
			mi.position.setZ(3+0.5+z+1);
			mi.updateMatrix();
			geometry2.merge(mi.geometry, mi.matrix);
		}
	}
	d3mJS.mainGroup.add(new THREE.Mesh(geometry2, materialChess));
	
	
	/*var vline = new THREE.PlaneGeometry(0.1, drums.length);
	
	for (var x = 1; x < maxLen; x++) {
		if (Math.floor(x / 16) == x / 16) {
			mi = new THREE.Mesh(vlimit, materialWhite);
			mi.position.setY(0.2);
		} else {
			mi = new THREE.Mesh(vline, materialWhite);
			mi.position.setY(0.1);
		}
		mi.rotation.x = Math.PI * 0.5;
		mi.rotation.y = Math.PI * 0.5;
		mi.position.setX(x);

		mi.position.setZ(3 + drums.length / 2);
		//group.add(mi);
		mi.updateMatrix();
		geometry.merge(mi.geometry, mi.matrix);
		
	}
	d3mJS.mainGroup.add(new THREE.Mesh(geometry, materialWhite));
	var hline = new THREE.PlaneGeometry(0.1, maxLen);
	for (var z = 1; z < drums.length; z++) {
		mi = new THREE.Mesh(hline, materialWhite);
		//mi.rotation.x=Math.PI * 0.5;
		mi.rotation.z = Math.PI * 0.5;
		mi.position.setX(maxLen / 2);
		mi.position.setY(0.1);
		mi.position.setZ(z + 3);
		//group.add(mi);
		mi.updateMatrix();
		geometry.merge(mi.geometry, mi.matrix);
	}*/
	//d3mJS.mainGroup.add(group);
	//d3mJS.mainGroup.add(new THREE.Mesh(geometry, materialWhite));
}
function createLight(d3mJS) {
	light1 = new ItemDirectionalLight(0xff9900);
	light1.move(100, -11, -11);
	light1.addTo(d3mJS);

	light2 = new ItemDirectionalLight(0x00ff00);
	light2.move(-22, 100, -22);
	light2.addTo(d3mJS);

	light3 = new ItemDirectionalLight(0x0000ff);
	light3.move(-33, -33, 100);
	light3.addTo(d3mJS);
}
