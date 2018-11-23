console.log('load processor script');
class MDAProcessor extends AudioWorkletProcessor {
	constructor(options) {
		super(options);
		//this.setup(44100);
		this.port.onmessage = this.onmessage.bind(this);
		this.port.start();
		//this.port.postMessage('processor constructor done');
	}
	setup(sampleRate) {
		console.log('setup', sampleRate);
		this.first = 0;
		//this.waveCounter = 0;
		//this.waveLen = 555;
		//this.waveSample = 0.155;
		//this.onAir = false;
		this.buflength = sampleRate; //128;
		this.vst = AudioWorkletGlobalScope.WAM.MDA;
		this.testID = 'FED93DB85E81448FA3B14028879FA824';
		this.testNum = 0;
		this.testDescription = null;
		try {
			this.VST3Init = this.vst.cwrap("VST3_init", 'number', ['number', 'number']);
			this.VST3Init(128, sampleRate);
			this.VST3Description = this.vst.cwrap("VST3_description", 'string', []);
			var txt = this.VST3Description();
			var o = JSON.parse(txt);
			console.log('Description', o);
			var cnt = 1 * o.count;
			this.VST3_classInfo = this.vst.cwrap("VST3_classInfo", 'string', []);
			for (var i = 0; i < cnt; i++) {
				var txt = this.VST3_classInfo(i);
				var o = JSON.parse(txt);
				console.log('class', i, o);
				if (o.cid == this.testID) {
					this.testNum = i;
					this.testDescription = o;
				}
			}
			this.VST3_selectProcessor = this.vst.cwrap("VST3_selectProcessor", '', ['number']);
			this.VST3_selectProcessor(this.testNum);
			this.VST3_parametersCount = this.vst.cwrap("VST3_parametersCount", 'number', []);
			var parcnt = this.VST3_parametersCount();
			this.testDescription.parameters = [];
			this.VST3_parameterInfo = this.vst.cwrap("VST3_parameterInfo", 'string', ['number']);
			for (var i = 0; i < parcnt; i++) {
				var txt = this.VST3_parameterInfo(i);
				var o = JSON.parse(txt);
				console.log('parameter', i, o);
				this.testDescription.parameters.push(o);
			}
			this.inArrayLeft = this.allocateArray32(this.buflength);
			this.inArrayRight = this.allocateArray32(this.buflength);
			this.outArrayLeft = this.allocateArray32(this.buflength);
			this.outArrayRight = this.allocateArray32(this.buflength);
			this.VST3_process = this.vst.cwrap("VST3_process", 'number', ['number', 'number', 'number']);
			this.VST3_setParameter = this.vst.cwrap("VST3_setParameter", '', ['number', 'number']);
			//this.VST3_getParameter = this.vst.cwrap("VST3_getParameter", 'number', ['number']);
			this.VST3_getParameter = this.vst.cwrap("VST3_getParameter", 'string', ['number']);
			this.VST3_sendNoteOn = this.vst.cwrap("VST3_sendNoteOn", '', ['number', 'number', 'number', 'number']);
			this.VST3_sendNoteOff = this.vst.cwrap("VST3_sendNoteOff", '', ['number', 'number', 'number']);
		} catch (exx) {
			console.log('exception', exx);
		}
		//this.port.postMessage('processor setup done');
		this.port.postMessage({
			kind: 'ready',
			description: this.testDescription
		});
		console.log('done processor');
	}
	allocateArray32(size) {
		var bytelen = 4;
		var offset = this.vst._malloc(size * bytelen);
		this.vst.HEAPF32.set(new Float32Array(size), offset / bytelen);
		var array = {
			"data": this.vst.HEAPF32.subarray(offset / bytelen, offset / bytelen + size) //
		,
			"offset": offset
		};
		return array;
	}
	onmessage(e) {
		//console.log('processor: received:', e.data);
		if (e.data.kind == 'setup') {
			this.setup(e.data.sampleRate);
			return;
		}
		if (e.data.kind == 'set') {
			//this.sendParameter(e.data.value,e.data.subvalue);
			//console.log(e.data.id,e.data.value);
			this.VST3_setParameter(e.data.id, e.data.value);
			if(e.data.nocallback){
				//
			}else{
				for (var i = 0; i < this.testDescription.parameters.length; i++) {
					var id=this.testDescription.parameters[i].id;
					var value = this.VST3_getParameter(id);
					var o = JSON.parse(value);
					//console.log(id,value);
					this.port.postMessage({
						kind: 'set',
						id: id,
						value: o
					});
				}
			}
			return;
		}
		if (e.data.kind == 'on') {
			this.VST3_sendNoteOn(e.data.key, e.data.duration, e.data.velocity, e.data.id);
			return;
		}
		if (e.data.kind == 'off') {
			this.VST3_sendNoteOff(e.data.key, e.data.velocity, e.data.id);
			return;
		}
		/*if(e.data.kind=='description'){
		this.port.postMessage({kind:'description',value:this.testDescription});
		return;
		}*/
		console.log('unknown', e.data);
		/*var status = e.data[0];
		var data1 = e.data[1];
		var data2 = e.data[2];
		if (status == 144) {
		this.onAir = true;
		} else {
		if (status == 128) {
		this.onAir = false;
		} else {
		if (status == 1010) {
		this.setup(data1);
		}else{
		if (status == 2020) {
		this.sendParameter(data1,data2);
		}
		}
		}
		}*/
	}
	/*sendParameter(id,value){
	console.log('sendParameter',id,value);
	this.VST3_setParameter(id,value);
	}*/
	process(inputs, outputs, parameters) {
		if (inputs.length > 0) {
			var firstInput = inputs[0];
			if (firstInput.length > 0) {
				var leftChannel = firstInput[0];
				var rightChannel = null;
				if (firstInput.length > 1) {
					rightChannel = firstInput[1];
				}
				for (var i = 0; i < this.buflength; i++) {
					var n = leftChannel[i];
					this.inArrayLeft.data[i] = (n) ? n : 0;
					if (rightChannel) {
						n = rightChannel[i];
					}
					this.inArrayRight.data[i] = (n) ? n : 0;
				}
			}
		}
		this.VST3_process(this.inArrayLeft.offset, this.inArrayRight.offset, this.outArrayLeft.offset, this.outArrayRight.offset);
		for (var k = 0; k < outputs.length; k++) {
			var output = outputs[k];
			if (output.length > 0) {
				var leftChannel = output[0];
				var rightChannel = null;
				if (output.length > 1) {
					rightChannel = output[1];
				}
				for (var i = 0; i < this.buflength; i++) {
					var n = this.outArrayLeft.data[i];
					leftChannel[i] = (n) ? n : 0;
					if (rightChannel) {
						n = this.outArrayRight.data[i];
						rightChannel[i] = (n) ? n : 0;
					}
				}
			}
		}
		return true;
	}
}
registerProcessor("MDAProcessorClass", MDAProcessor);
