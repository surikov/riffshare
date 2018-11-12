console.log('index');

var audioWorkletNode = null;

function probeInit() {
    console.log('probe init');
    var audioContext = new AudioContext();
    audioContext.audioWorklet.addModule('VSTNES.wasm.js')
        .then((v) => {
            audioContext.audioWorklet.addModule('VSTNES.js')
                .then((v) => {
                    audioContext.audioWorklet.addModule('processormodule.js')
                        .then((v) => {
                            audioWorkletNode = new AudioWorkletNode(audioContext, 'VSTNESProcessorClass', {});
                            audioWorkletNode.connect(audioContext.destination);
                            audioWorkletNode.port.onmessage = (event) => {
                                console.log('audioWorkletNode onmessage', event.data);
                            };
                        });
                });
        });
}

function probeStart() {
    console.log('probeStart');
    audioWorkletNode.port.postMessage([144, 62, 80]);
    setTimeout(function() { audioWorkletNode.port.postMessage([128, 62, 80]); }, 1000);
}