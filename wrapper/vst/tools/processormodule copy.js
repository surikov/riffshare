console.log('processor');
class VSTMODULENAMEProcessor extends AudioWorkletProcessor {
    constructor(options) {
        super(options);
        this.vst = AudioWorkletGlobalScope.WAM.VSTMODULENAME;
        console.log('processor',this.vst);
        //console.log('processor.cwrap',this.vst.cwrap);
        try{
            this.VST3Status = this.vst.cwrap("VST3_status", 'number', []);
            console.log('VST3_status',this.VST3Status());
            this.VST3Description = this.vst.cwrap("VST3_description", 'string', []);
            var txt=this.VST3Description();
            console.log('VST3_description',txt);
            var o=JSON.parse(txt);
            console.log(o);
            this.VST3SetInteger = this.vst.cwrap("VST3_setInteger", 'string', ['string','number']);
            console.log('VST3_setInteger',this.VST3SetInteger('some',123));        
            console.log('init VST3_stub');
            this.VST3_stub = this.vst.cwrap("VST3_stub", '', []);
            console.log('start VST3_stub');
            this.VST3_stub();
            console.log('done VST3_stub');
        }catch(exx){
            console.log('exx VST3_stub',exx);
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
        /*
        var status=e.data[0];
        var data1=e.data[1];
        var data2=e.data[2];
        this.wam_onmidi(this.inst, status, data1, data2);
        */
    }
    process(inputs, outputs, parameters) {
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
registerProcessor("VSTMODULENAMEProcessorClass", VSTMODULENAMEProcessor);

