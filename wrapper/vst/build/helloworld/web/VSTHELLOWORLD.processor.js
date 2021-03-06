console.log('processor');
class VSTHELLOWORLDProcessor extends AudioWorkletProcessor {
	constructor(options) {
		super(options);
		this.first = 0;
		this.waveCounter = 0;
		this.waveLen = 555;
		this.waveSample = 0.155;
		this.onAir = false;
		this.vst = AudioWorkletGlobalScope.WAM.VSTHELLOWORLD;
		console.log('processor', this.vst);
		//console.log('processor.cwrap',this.vst.cwrap);
		//var testID='6EE65CD1B83A4AF480AA7929AEA6B8A0';//notesynth
		//var testID='BD58B550F9E5634E9D2EFF39EA0927B1';//hello
		var testID = 'BD58B550F9E5634E9D2EFF39EA0927B1';
		var testNum = 0;
		try {

			var offset = this.vst._malloc(24);
			console.log('offset', offset);

			this.VST3Init = this.vst.cwrap("VST3_init", 'number', []);
			console.log('VST3_init', this.VST3Init());

			this.VST3Description = this.vst.cwrap("VST3_description", 'string', []);
			var txt = this.VST3Description();
			//console.log('VST3_description',txt);
			var o = JSON.parse(txt);
			console.log('VST3_description', o);
			var cnt = 1 * o.count;

			this.VST3SetInteger = this.vst.cwrap("VST3_setInteger", 'string', ['string', 'number']);
			console.log('VST3_setInteger', this.VST3SetInteger('some', 123));

			this.VST3_classInfo = this.vst.cwrap("VST3_classInfo", 'string', []);
			for (var i = 0; i < cnt; i++) {
				var txt = this.VST3_classInfo(i);
				//console.log(i,'VST3_classInfo',txt);
				var o = JSON.parse(txt);
				console.log(i, o);
				if (o.cid == testID) {
					testNum = i;
				}
			}

			//console.log('init VST3_stub');
			//this.VST3_stub = this.vst.cwrap("VST3_stub", '', []);
			//console.log('start VST3_stub');
			//this.VST3_stub();
			//console.log('done VST3_stub');
			//2AC0A8889406497FBBA6EABFC78D1372
			this.VST3_selectProcessor = this.vst.cwrap("VST3_selectProcessor", '', ['number']);
			console.log('VST3_selectProcessor -------------------', testNum, testID, this.VST3_selectProcessor(testNum));
			//console.log('VST3_selectProcessor -------------------', testNum, testID, this.VST3_selectProcessor(testNum));

			this.VST3_parametersCount = this.vst.cwrap("VST3_parametersCount", 'number', []);
			var parcnt = this.VST3_parametersCount();
			console.log('VST3_parametersCount', parcnt);

			this.VST3_parameterInfo = this.vst.cwrap("VST3_parameterInfo", 'string', ['number']);
			for (var i = 0; i < parcnt; i++) {
				var txt = this.VST3_parameterInfo(i);
				//console.log(i,txt);
				var o = JSON.parse(txt);
				console.log(i, o);
			}

			this.VST3_process = this.vst.cwrap("VST3_process", 'number', ['number', 'number', 'number']);
			/*
			var buflength = 128;
			var inputArray = new Float32Array(buflength);
			var outputArray = new Float32Array(buflength);
			inputArray[1] = 333222;
			outputArray[2] = 44445555;
			console.log('inputArray', inputArray);
			console.log('outputArray', outputArray);
			var sizeBytes = inputArray.length * inputArray.BYTES_PER_ELEMENT;
			console.log('sizeBytes', sizeBytes,'=',inputArray.length, inputArray.BYTES_PER_ELEMENT);
			var inputPtr = this.vst._malloc(sizeBytes);
			console.log('inputPtr',inputPtr);
			var outputPtr = this.vst._malloc(sizeBytes);
			console.log('outputPtr',outputPtr);
			var inputHeap = new Uint8Array(this.vst.HEAPU8.buffer, inputPtr, sizeBytes);
			console.log('inputHeap',inputHeap);
			var outputHeap = new Uint8Array(this.vst.HEAPU8.buffer, outputPtr, sizeBytes);
			console.log('outputHeap',outputHeap);
			inputHeap.set(new Uint8Array(inputArray.buffer));
			outputHeap.set(new Uint8Array(outputArray.buffer));
			this.VST3_process(inputHeap.byteOffset, outputHeap.byteOffset, buflength);
			var inputResult = new Float32Array(inputHeap.buffer, inputHeap.byteOffset, inputArray.length);
			console.log('inputResult', inputResult);
			var outputResult = new Float32Array(outputHeap.buffer, outputHeap.byteOffset, outputHeap.length);
			console.log('outputResult', outputResult);
			this.vst._free(inputHeap.byteOffset);
			this.vst._free(outputHeap.byteOffset);
			*/
			
			
			

		} catch (exx) {
			console.log('exception', exx);
		}
		/*
		this.dx7 = AudioWorkletGlobalScope.WAM.DX7;
		this.wam_onprocess = this.dx7.cwrap("wam_onprocess", 'number', ['number', 'number', 'number']);
		this.wam_onmidi = this.dx7.cwrap("wam_onmidi", null, ['number','number','number','number']);
		var wam_ctor = this.dx7.cwrap("createModule", 'number', []);
		var wam_init = this.dx7.cwrap("wam_init", null, ['number', 'number', 'number', 'string']);
		this.audiobufs = [
		[],
		[]
		];
		this.bufsize = 128;
		this.numInputs = 0;
		this.numOutputs = 1;
		this.numInChannels = [];
		this.numOutChannels = [1];
		this.inst = wam_ctor();
		this.sr = 44100;
		var desc = wam_init(this.inst, this.bufsize, this.sr, "");
		var ibufs = this.numInputs > 0 ? this.dx7._malloc(this.numInputs) : 0;
		var obufs = this.numOutputs > 0 ? this.dx7._malloc(this.numOutputs) : 0;
		this.audiobus = this.dx7._malloc(2 * 4);
		this.dx7.setValue(this.audiobus, ibufs, 'i32');
		this.dx7.setValue(this.audiobus + 4, obufs, 'i32');
		for (var i = 0; i < this.numInputs; i++) {
		var buf = this.dx7._malloc(this.bufsize * 4);
		this.dx7.setValue(ibufs + i * 4, buf, 'i32');
		this.audiobufs[0].push(buf / 4);
		}
		for (var i = 0; i < this.numOutputs; i++) {
		var numChannels = 2;
		for (var c = 0; c < numChannels; c++) {
		var buf = this.dx7._malloc(this.bufsize * 4);
		this.dx7.setValue(obufs + (i * numChannels + c) * 4, buf, 'i32');
		this.audiobufs[1].push(buf / 4);
		}
		}
		 */
		this.port.onmessage = this.onmessage.bind(this);
		this.port.start();
		this.port.postMessage('processor constructor done');

		console.log('done processor');
	}
	onmessage(e) {
		console.log('processor onmessage', e);
		var status = e.data[0];
		var data1 = e.data[1];
		var data2 = e.data[2];
		//this.wam_onmidi(this.inst, status, data1, data2);
		if (status == 144) {
			this.onAir = true;
		} else {
			if (status == 128) {
				this.onAir = false;
			}
		}
	}
	process(inputs, outputs, parameters) {
		if (this.first<3) {
			this.first++;
			console.log('process start',this.first,inputs, outputs, parameters);
            var buflength = 128;
            var inputArray = new Float32Array(buflength);
        	for(var i=0;i<buflength;i++){
        		inputArray[i]=inputs[0][i];
        	}
            var outputArray = new Float32Array(buflength);
            inputArray[1] = 333222;
            outputArray[2] = 44445555;
            //console.log('inputArray', inputArray);
            //console.log('outputArray', outputArray);
            var sizeBytes = inputArray.length * inputArray.BYTES_PER_ELEMENT;
            //console.log('sizeBytes', sizeBytes,'=',inputArray.length, inputArray.BYTES_PER_ELEMENT);
            var inputPtr = this.vst._malloc(sizeBytes);
            //console.log('inputPtr',inputPtr);
            var outputPtr = this.vst._malloc(sizeBytes);
            //console.log('outputPtr',outputPtr);
            var inputHeap = new Uint8Array(this.vst.HEAPU8.buffer, inputPtr, sizeBytes);
            //console.log('inputHeap',inputHeap);
            var outputHeap = new Uint8Array(this.vst.HEAPU8.buffer, outputPtr, sizeBytes);
            //console.log('outputHeap',outputHeap);
            inputHeap.set(new Uint8Array(inputArray.buffer));
            outputHeap.set(new Uint8Array(outputArray.buffer));
            //console.log('VST3_process start');
            this.VST3_process(inputHeap.byteOffset, outputHeap.byteOffset, buflength);
            //console.log('VST3_process done');
            var inputResult = new Float32Array(inputHeap.buffer, inputHeap.byteOffset, inputArray.length);
            //console.log('inputResult', inputResult);
            var outputResult = new Float32Array(outputHeap.buffer, outputHeap.byteOffset, outputHeap.length);
            for(var i=0;i<buflength;i++){
            	outputs[0][i]=outputResult[i];
            }
            //console.log('outputResult', outputResult);
            console.log('outputs', outputs);
            this.vst._free(inputHeap.byteOffset);
            this.vst._free(outputHeap.byteOffset);
            /*
			for (var i = 0; i < inputs.length; i++) {
				var input = inputs[i];
				console.log('input', input);
				for (var c = 0; c < input.length; c++) {
					var channelBuffer = input[c];
					console.log('input', i, 'channel', c, 'buffer', channelBuffer);
				}
			}
			for (var i = 0; i < outputs.length; i++) {
				var output = outputs[i];
				console.log('output', output);
				for (var c = 0; c < output.length; c++) {
					var channelBuffer = output[c];
					console.log('output', i, 'channel', c, 'buffer', channelBuffer);
				}
			}
            */
			//console.log('done first process');
			
		}
		if (this.onAir) {
			//console.log('on air');
			var float32Array = outputs[0][0];
			for (var i = 0; i < float32Array.length; i++) {
				float32Array[i] = this.waveSample;
				this.waveCounter++;
				if (this.waveCounter >= this.waveLen) {
					this.waveCounter = 0;
					this.waveSample = -this.waveSample;
				}
			}
			//console.log('done air');
		}
		
		
		/*var WAM = this.dx7;
		// -- inputs
		for (var i = 0; i < this.numInputs; i++) {
		var waain = inputs[i][0];
		var wamin = this.audiobufs[0][i];
		WAM.HEAPF32.set(waain, wamin);
		}
		this.wam_onprocess(this.inst, this.audiobus, 0);
		// -- outputs
		for (var i = 0; i < this.numOutputs; i++) {
		var numChannels = this.numOutChannels[i];
		for (var c = 0; c < numChannels; c++) {
		var waaout = outputs[i][c];
		var wamout = this.audiobufs[1][i * numChannels + c];
		waaout.set(WAM.HEAPF32.subarray(wamout, wamout + this.bufsize));
		}
		}*/
		return true;
	}
}
registerProcessor("VSTHELLOWORLDProcessorClass", VSTHELLOWORLDProcessor);
