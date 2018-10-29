

class LevelMeteringNode extends AudioWorkletNode {

  constructor(actx, trackId, options) {
    options = options || {};
    options.outputChannelCount = [2];
    super(actx, "LevelMeteringNode", options);

    this.port.onmessage = e => {
      DSP.core.port.onmessage({ data: { type: "levelMetering", data: { trackId, data: e.data } } });
    };
  }

}

