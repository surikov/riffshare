console.log('processor');
class VSTMDAProcessor extends AudioWorkletProcessor {
    constructor(options) {
        super(options);
        this.vst = AudioWorkletGlobalScope.WAM.VSTMDA;
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
        this.port.onmessage = this.onmessage.bind(this);
        this.port.start();
        this.port.postMessage('processor constructor done');
        
        console.log('done processor');
    }
    onmessage(e) {
        console.log('processor onmessage', e);
    }
    process(inputs, outputs, parameters) {
        return true;
    }
}
registerProcessor("VSTMDAProcessor", VSTMDAProcessor);

