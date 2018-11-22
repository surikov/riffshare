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
	audioContext.audioWorklet.addModule('VSTMODULENAME.wasm.js')
	.then((v) => {
		audioContext.audioWorklet.addModule('VSTMODULENAME.js')
		.then((v) => {
			audioContext.audioWorklet.addModule('VSTMODULENAME.processor.js')
			.then((v) => {
				audioWorkletNode = new AudioWorkletNode(audioContext, 'VSTMODULENAMEProcessorClass', {
						'audioContext': audioContext
					});
				//audioWorkletNode.port.postMessage([1010, audioContext.sampleRate]);
				audioWorkletNode.port.postMessage({
					kind: 'setup',
					sampleRate: audioContext.sampleRate
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
		showParameters(e.data.description);
		this.description = e.data.description;
		return;
	}
	/*if (event.data.kind == 'description') {
	document.getElementById('uititle').innerHTML = '' + e.data.value.subcategory + ': ' + e.data.value.name;
	return;
	}*/
	console.log('audioWorkletNode: received: unknown', e.data);
}
function showParameters(value) {
	document.getElementById('uidiv').innerHTML = '<p>ready</p>';
	document.getElementById('uititle').innerHTML = '' + value.subcategory + ': ' + value.name;
	var txt = '<p>';
	for (var i = 0; i < value.parameters.length; i++) {
		var u = value.parameters[i].units;
		if (u.trim().length) {
			u = ' (' + u + ')';
		}
		var minVal = 0.0;
		var maxVal = 1.0;
		var step = 0.01;
		txt = txt + '<input type="range" min="' + minVal + '" max="' + maxVal + '" step="' + step + '" id="parameter'
			 + i + '" value="'
			 + (1 * value.parameters[i].defaultNormalizedValue) + '" onchange="changeParameter('
			 +i + ',this.value)" > <label>' + value.parameters[i].title + u + '</label><br/>';
		audioWorkletNode.port.postMessage({
			kind: 'set',
			id: i,
			value: 1 * value.parameters[i].defaultNormalizedValue
		});
	}
	txt = txt + '</p>';
	document.getElementById('uidiv').innerHTML = txt;
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
function noteSend1() {
	audioWorkletNode.port.postMessage({
		kind: 'on',
		key: 60,
		duration: 0.5,
		velocity: 0.75
	});
	setTimeout(function () {
		audioWorkletNode.port.postMessage({
			kind: 'off',
			key: 60,
			velocity: 0.75
		});
	}, 500);
}
function noteSend2() {
	audioWorkletNode.port.postMessage({
		kind: 'on',
		key: 80,
		duration: 2,
		velocity: 0.75
	});
	setTimeout(function () {
		audioWorkletNode.port.postMessage({
			kind: 'off',
			key: 80,
			velocity: 0.75
		});
	}, 2000);
}
function noteFx() {
	console.log('noteStart');
	player.queueWaveTable(audioContext, inputAudioNode, selectedPreset, 0, 55, 3.5);
}
function notePass() {
	console.log('notePass');
	player.queueWaveTable(audioContext, audioContext.destination, selectedPreset, 0, 55, 3.5);
}
