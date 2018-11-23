console.log('load library script');

var audioWorkletNode = null;
var player = null;
var selectedPreset = null;
var audioContext = null;
var outputAudioNode = null;
var inputAudioNode = null;
function probeInit() {
	console.log('probe init');
	audioContext = new AudioContext();
	outputAudioNode = audioContext.createGain();
	inputAudioNode = audioContext.createGain();
	outputAudioNode.connect(audioContext.destination);
	selectedPreset = _tone_0000_JCLive_sf2_file;
	player = new WebAudioFontPlayer();
	player.loader.decodeAfterLoading(audioContext, '_tone_0000_JCLive_sf2_file');
	audioContext.audioWorklet.addModule('MDA.wasm.js')
	.then((v) => {
		audioContext.audioWorklet.addModule('MDA.js')
		.then((v) => {
			audioContext.audioWorklet.addModule('MDA.ELP.processor.js')
			.then((v) => {
				audioWorkletNode = new AudioWorkletNode(audioContext, 'MDAProcessorClass', {
						'audioContext': audioContext
					});
				//audioWorkletNode.port.postMessage([1010, audioContext.sampleRate]);
				audioWorkletNode.port.postMessage({
					kind: 'setup',
					bufferLength: 128,
					sampleRate: audioContext.sampleRate,
					currentTime: audioContext.currentTime
				});
				//audioWorkletNode.connect(audioContext.destination);
				audioWorkletNode.connect(outputAudioNode);
				inputAudioNode.connect(audioWorkletNode);
				audioWorkletNode.port.onmessage = (event) => {
					//console.log('audioWorkletNode: received:', event.data);
					onmessage(event);
				};
			});
		});
	});
}
function onmessage(e) {
	if (event.data.kind == 'ready') {
		resetParameters(e.data.description);
		this.description = e.data.description;
		return;
	}
	if (event.data.kind == 'set') {
		setParameterLabel(event.data.id,event.data.value.representation,event.data.value.normalized);
		return;
	}
	/*if (event.data.kind == 'description') {
	document.getElementById('uititle').innerHTML = '' + e.data.value.subcategory + ': ' + e.data.value.name;
	return;
	}*/
	console.log('audioWorkletNode: received: unknown', e.data);
}
function setParameterLabel(id,representation,norm){
	for (var i = 0; i < this.description.parameters.length; i++) {
		if(this.description.parameters[i].id==id){
			document.getElementById('label'+i).innerHTML = this.description.parameters[i].title 
			+ ' '+representation+this.description.parameters[i].units;
			document.getElementById('parameter'+i).value =1.0*norm;
			break;
		}
	}
	
	//console.log(id,representation);
}
function sync() {
	audioWorkletNode.port.postMessage({
			kind: 'sync',
			time: audioContext.currentTime
		});
}
function resetParameters(value) {
	document.getElementById('uidiv').innerHTML = '<p>ready</p>';
	document.getElementById('uititle').innerHTML = '' + value.subcategory + ': ' + value.name;
	var txt = '<p>';
	for (var i = 0; i < value.parameters.length; i++) {
		/*var u = value.parameters[i].units;
		if (u.trim().length) {
			u = ' (' + u + ')';
		}*/
		var minVal = 0.0;
		var maxVal = 1.0;
		var step = 0.01;
		txt = txt + '<input type="range" min="' + minVal + '" max="' + maxVal + '" step="' + step + '" id="parameter'
			 + i + '" value="'
			 + (1 * value.parameters[i].defaultNormalizedValue) + '" onchange="changeParameter('
			 +i + ',this.value)" > <label id="label'+i+'">' 
			 //+ value.parameters[i].title + u 
			 +i+ '</label><br/>';
		
		audioWorkletNode.port.postMessage({
			kind: 'set',
			id: value.parameters[i].id,
			value: 1 * value.parameters[i].defaultNormalizedValue,
			nocallback:i<value.parameters.length-1
		});
	}
	txt = txt + '</p>';
	document.getElementById('uidiv').innerHTML = txt;
	/*for (var i = 0; i < value.parameters.length; i++) {
		document.getElementById('parameter'+i).value = 0.5;
	}*/
}
function changeParameter(i, value) {
	console.log('changeParameter',i,'id',this.description.parameters[i].id,'to',value);
	audioWorkletNode.port.postMessage({
		kind: 'set',
		id:  this.description.parameters[i].id,
		value: value
	});
}
function __probeLow() {
	console.log('probeLow');
	/*
	audioWorkletNode.port.postMessage([144, 62, 80]);
	setTimeout(function () {
	audioWorkletNode.port.postMessage([128, 62, 80]);
	}, 1000);
	 */
	//audioWorkletNode.port.postMessage([2020, 100, 0.12]);
	audioWorkletNode.port.postMessage({
		kind: 'set',
		value: 100,
		subvalue: 0.12
	});
}
function __probeHigh() {
	console.log('probeHigh');
	//audioWorkletNode.port.postMessage([2020, 100, 3.21]);
	audioWorkletNode.port.postMessage({
		kind: 'set',
		value: 100,
		subvalue: 3.21
	});
}
function enqueue(when,pitch,duration,velocity) {
	audioWorkletNode.port.postMessage({
		kind: 'enqueue',
		when:when,
		pitch: pitch,
		duration: duration,
		velocity:velocity
	});
	sync();
}
function noteSend1() {
	var id=Math.floor(Math.random()*100000);
	audioWorkletNode.port.postMessage({
		kind: 'on',
		key: 60,
		duration: 0.5,
		velocity: 0.75,
		id:id
	});
	setTimeout(function () {
		audioWorkletNode.port.postMessage({
			kind: 'off',
			key: 60,
			velocity: 0.75,
			id:id
		});
	}, 500);
	sync();
}
function noteSend2() {
	var id=Math.floor(Math.random()*100000);
	audioWorkletNode.port.postMessage({
		kind: 'on',
		key: 80,
		duration: 2,
		velocity: 0.75,id:id
	});
	setTimeout(function () {
		audioWorkletNode.port.postMessage({
			kind: 'off',
			key: 80,
			velocity: 0.75,id:id
		});
	}, 2000);
	sync();
}
function chordSend(){
	var id=Math.floor(Math.random()*100000);
	
	setTimeout(function () {audioWorkletNode.port.postMessage({kind: 'on',	key: 60+0,velocity: 0.75,duration: 1,id:id+0});}, 1);
	setTimeout(function () {audioWorkletNode.port.postMessage({kind: 'on',	key: 60+3,velocity: 0.75,duration: 1,id:id+1});}, 500);
	setTimeout(function () {audioWorkletNode.port.postMessage({kind: 'on',	key: 60+7,velocity: 0.75,duration: 1,id:id+2});}, 1000);
	setTimeout(function () {audioWorkletNode.port.postMessage({kind: 'on',	key: 60+12,velocity: 0.75,duration: 1,id:id+3});}, 1500);
	
	setTimeout(function () {audioWorkletNode.port.postMessage({kind: 'off',	key: 60+0,velocity: 0.75 ,id:id+0});}, 1000);
	setTimeout(function () {audioWorkletNode.port.postMessage({kind: 'off',	key: 60+3,velocity: 0.75 ,id:id+1});}, 1500);
	setTimeout(function () {audioWorkletNode.port.postMessage({kind: 'off',	key: 60+7,velocity: 0.75 ,id:id+2});}, 2000);
	setTimeout(function () {audioWorkletNode.port.postMessage({kind: 'off',	key: 60+12,velocity: 0.75 ,id:id+2});}, 2500);
	
	setTimeout(function () {audioWorkletNode.port.postMessage({kind: 'on',	key: 60+0,velocity: 0.75,duration: 1,id:id+4});}, 2000);
	setTimeout(function () {audioWorkletNode.port.postMessage({kind: 'on',	key: 60+3,velocity: 0.75,duration: 1,id:id+5});}, 2000);
	setTimeout(function () {audioWorkletNode.port.postMessage({kind: 'on',	key: 60+7,velocity: 0.75,duration: 1,id:id+6});}, 2000);
	setTimeout(function () {audioWorkletNode.port.postMessage({kind: 'on',	key: 60+12,velocity: 0.75,duration: 1,id:id+7});}, 2000);
	
	setTimeout(function () {audioWorkletNode.port.postMessage({kind: 'off',	key: 60+0,velocity: 0.75 ,id:id+4});}, 3000);
	setTimeout(function () {audioWorkletNode.port.postMessage({kind: 'off',	key: 60+3,velocity: 0.75 ,id:id+5});}, 3000);
	setTimeout(function () {audioWorkletNode.port.postMessage({kind: 'off',	key: 60+7,velocity: 0.75 ,id:id+6});}, 3000);
	setTimeout(function () {audioWorkletNode.port.postMessage({kind: 'off',	key: 60+12,velocity: 0.75 ,id:id+7});}, 300);
	
	sync();
}
function noteFx() {
	console.log('noteStart');
	player.queueWaveTable(audioContext, inputAudioNode, selectedPreset, 0, 55, 3.5);
}
function notePass() {
	console.log('notePass');
	player.queueWaveTable(audioContext, audioContext.destination, selectedPreset, 0, 55, 3.5);
}
