

class ExportNode extends AudioWorkletNode { //DSP.Device {

  constructor(actx, options) {
    options = options || {};
    options.outputChannelCount = [2];
    super(actx, "ExportNode", options);
  }

}

