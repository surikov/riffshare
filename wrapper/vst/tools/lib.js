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
	audioContext.audioWorklet.addModule('VSTMODULENAME.wasm.js')
	.then((v) => {
		audioContext.audioWorklet.addModule('VSTMODULENAME.js')
		.then((v) => {
			audioContext.audioWorklet.addModule('VSTMODULENAME.processor.js')
			.then((v) => {
				audioWorkletNode = new AudioWorkletNode(audioContext, 'VSTMODULENAMEProcessorClass', {
						'audioContext': audioContext
					});
				audioWorkletNode.port.postMessage([1010, audioContext.sampleRate]);
				//audioWorkletNode.connect(audioContext.destination);
				audioWorkletNode.connect(outputAudioNode);
				inputAudioNode.connect(audioWorkletNode);
				audioWorkletNode.port.onmessage = (event) => {
					console.log('message for audioWorkletNode', event.data);
				};
			});
		});
	});
}

function probeStart() {
	console.log('probeStart');
	audioWorkletNode.port.postMessage([144, 62, 80]);
	setTimeout(function () {
		audioWorkletNode.port.postMessage([128, 62, 80]);
	}, 1000);
}
function noteFx() {
	console.log('noteStart');
	player.queueWaveTable(audioContext, inputAudioNode, selectedPreset, 0, 55, 3.5);
}
function notePass() {
	console.log('notePass');
	player.queueWaveTable(audioContext, audioContext.destination, selectedPreset, 0, 55, 3.5);
}
