console.log('index');

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
	audioContext.audioWorklet.addModule('ADLY.wasm.js')
	.then((v) => {
		audioContext.audioWorklet.addModule('ADLY.js')
		.then((v) => {
			audioContext.audioWorklet.addModule('ADLY.processor.js')
			.then((v) => {
				audioWorkletNode = new AudioWorkletNode(audioContext, 'ADLYProcessorClass', {
						'audioContext': audioContext
					});
				audioWorkletNode.port.postMessage([1010, audioContext.sampleRate]);
				//audioWorkletNode.connect(audioContext.destination);
				audioWorkletNode.connect(outputAudioNode);
				inputAudioNode.connect(audioWorkletNode);
				audioWorkletNode.port.onmessage = (event) => {
					console.log('audioWorkletNode: received:', event);
				};
			});
		});
	});
}

function probeLow() {
	console.log('probeLow');
	/*
	audioWorkletNode.port.postMessage([144, 62, 80]);
	setTimeout(function () {
		audioWorkletNode.port.postMessage([128, 62, 80]);
	}, 1000);
	*/
	audioWorkletNode.port.postMessage([2020, 100, 0.12]);
}
function probeHigh() {
	console.log('probeHigh');
	audioWorkletNode.port.postMessage([2020, 100, 3.21]);
}
function noteFx() {
	console.log('noteStart');
	player.queueWaveTable(audioContext, inputAudioNode, selectedPreset, 0, 55, 3.5);
}
function notePass() {
	console.log('notePass');
	player.queueWaveTable(audioContext, audioContext.destination, selectedPreset, 0, 55, 3.5);
}
