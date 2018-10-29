

class ExportProcessor extends AudioWorkletProcessor {

  process(inputs, outputs, params) {
    this.port.postMessage(inputs);
    return true;
  }

}


registerProcessor("ExportNode", ExportProcessor);
