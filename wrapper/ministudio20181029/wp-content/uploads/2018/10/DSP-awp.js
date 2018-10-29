var DSP;
var Amped = AudioWorkletGlobalScope.Amped = {};

// -- API methods
var API = { create: 0, get: 1, set: 2, add: 3, remove: 4, init: 5, reset: 6, connect: 7, disconnect: 8, sub: 9 }

// ----------------------------------------------------------------------------
//
//
class DSPDevice extends AudioWorkletProcessor {

  constructor(options) {
    options = options || {};
    super(options);
    this.port.onmessage = this.onmessage.bind(this);
    this.port.start();
  }

  onmessage(e) {
    var msg = e.data;
    switch (msg.method) {

      case API.create:
        if (!this.createDevice(msg))
          console.log("unknown device type", msg.args.className);
        break;

      case API.get:
        let data = this.wasm.get(msg.prop);
        let resp = { type:"response", msgid:msg.msgid, prop:msg.prop, data:data };
        this.port.postMessage(resp);
        break;

      case API.set:
        switch (typeof msg.args) {
          case "number": this.wasm.setNumber(msg.prop, msg.args); break;
          case "string": this.wasm.setString(msg.prop, msg.args); break;
          case "object":
            if (msg.prop == "params")
              this.wasm.setParams(msg.args);
            else {
              this._handleBinary(msg);
              if (msg.args.binaryData) {
                let stat = this.wasm.setBinary(msg.prop, msg.args) ? 200 : 400;
                let resp = { type:"response", msgid:msg.msgid, prop:msg.prop, status:stat };
                this.port.postMessage(resp);
              }
              else this.wasm.setObject(msg.prop, msg.args);
            }
            break;
        }
        break;

      case API.add:
        if (msg.target == 3) {
          // fix for live midi events
          msg.args.type = "note";

          this.wasm.addEvents([msg.args]);
        }
        break;
      case API.remove:
        break;
    }
  }

  createDevice (msg) {
    // -- choose device bundle
    let MOD;
    let type = msg.args.className;
    if (["SF2","Drumpler","Volt","VoltMini"].indexOf(type) >= 0)
      MOD = Amped.Instruments;
    else if (["Delay","Equalizer","Limiter","Reverb","PanGain"].indexOf(type) >= 0)
      MOD = Amped.Effects;
    else return false;

    // -- create device
    this.id = msg.args.id;
    this.type = type;
    this.module = MOD;
    this.module.DSP = DSP;
    this.wasm = new MOD.Device(this.id, type, sampleRate);

    // -- audioIO
    var self = this;
    this.numChannels = 2;
    this.samplesPerBuffer = 128;
    function createBuffer () {
      let numBytes = self.samplesPerBuffer * 4;
      let ptr = self.module._malloc(numBytes);
      let block = self.module.HEAPU8.subarray(ptr, ptr + numBytes);
      return ({ offset:block.byteOffset, numBytes:block.length });
    }
    this.inbufs  = [];
    this.outbufs = [];
    for (let i=0; i<this.numChannels; i++)
      this.inbufs.push( createBuffer() );
    for (let i=0; i<this.numChannels; i++)
      this.outbufs.push( createBuffer() );

    DSP.devices[this.id] = this;
    return true;
  }

  addEvents (events) {
    this.wasm.addEvents(events);
  }

  process(inputs, outputs, audioParams) {
    if (!this.wasm) return true;

    if (inputs.length > 0)
    for (let i=0; i<inputs[0].length; i++) {
      let desc = this.inbufs[i];
      let offset = desc.offset >> 2;
      let buff = this.module.HEAPF32.subarray(offset, offset + this.samplesPerBuffer);
      buff.set(inputs[0][i]);
    }

    // process
    this.wasm.process(this.inbufs, this.outbufs, DSP.renderingSchedule);

    for (let i=0; i<outputs[0].length; i++) {
      let desc = this.outbufs[i];
      let offset = desc.offset >> 2;
      let buff = this.module.HEAPF32.subarray(offset, offset + this.samplesPerBuffer);
      outputs[0][i].set(buff);
    }

    return true;
  }

  _handleBinary (msg) {
    if (msg.args.binaryData) {
      formatBinaryMessage(msg, this);
      return true;
    }
    return false;
  }

  _heapMalloc(data) {
    var blocks = [];
    var self = this;
    data.forEach((typedArray) => {
      var numBytes = typedArray.buffer.byteLength;
      var ptr = self.module._malloc(numBytes);
      var heapBytes = self.module.HEAPU8.subarray(ptr, ptr + numBytes);
      heapBytes.set(typedArray);
      blocks.push(heapBytes);
    });
    return blocks;
  }
}


// ----------------------------------------------------------------------------
//
//
class DSPProcessor extends AudioWorkletProcessor {

  constructor(options) {
    options = options || {};
    super(options);
    DSP = AudioWorkletGlobalScope.AmpedDSP = this;
    this.buflen = options.buflen || 128;
    this.module = AudioWorkletGlobalScope.DSP;

    this.numOutputs = options.numberOfOutputs;
    this.activeOutputs = [];
    for (let i=0; i < this.numOutputs; i++)
      this.activeOutputs.push(0);
    this.activeOutputs[0] = 1; // metronome

    let outbus = this.buflen * 4 * 2 * this.numOutputs;  // 4 bytes per sample, stereo
    this.module.outbus = this.module._malloc(outbus); // / 4;
    this.module.mod = this.module;  // val::global does not work in AudioWorklet
    this.module.api = new this.module.API();
    this.devices = [];
    this.passEngineState = true;
    let renderingScheduleSize = 1 + 2 * 3;//TODO 1 + this.buflen * 3; // numSlices + one slice per sample, 3 doubles per slice
    DSP.renderingSchedule = new Float64Array(renderingScheduleSize);

    // -- we will be victims of garbage collection sooner or later
    // -- APP should possibly receive playheadPosition using other means
    // -- such as SharedArrayBuffer
    this.module.onmessage = function (msg) {
      this.port.postMessage(msg);
    }.bind(this);

    // -- SEQ pushes MIDI and automation events to Devices and WAMs using this method
    this.module.pushEvent = function (targets, e) {
      var events = [e];
      for (let i=0; i<targets.length; i++) {
        let device = this.devices[targets[i]];
        if (device)
          device.addEvents(events);
      }
    }.bind(this);

    // -- messages from/to main thread propagate through this port
    this.port.onmessage = this.onmessage.bind(this);
    this.port.start();
  }

  // -- messages from main thread appear here
  onmessage(e) {
    let msg = e.data;

    // -- Engine.init()
    if (msg.target == 2 && msg.method == 5)
      this.module.api.init(this.numOutputs, msg.args.sampleRate, msg.args.bufferLength);

    else {
      // -- toggle engineState message generation (for performance testing)
      if (msg.target == 2 && msg.method == 9) {
        this.passEngineState = !this.passEngineState;
        this.module.api.enableEngineStateMessages( this.passEngineState );
        return;
      }

      // -- these messages embed arraybuffers
      if (msg.args.binaryData)
        formatBinaryMessage(msg, this);

      // -- add/remove tracks, update active outputs
      else if (msg.target == 2 && msg.prop == "tracks") {
        if (msg.method == 3) 
          this.activeOutputs[msg.args.outport] = msg.args.id;
        else if (msg.method == 4) { 
          let idx = this.activeOutputs.indexOf(msg.args);
          if (idx > -1)
            this.activeOutputs[idx] = 0;
        }
      }

      // responses are postMessaged directly from C++
      let resp = this.module.api.handleMessage(msg);
    }
  }

  process(inputs, outputs, audioParams) {
    // -- render DSP
    this.module.api.render();

    let numChannels = outputs[0].length;
    let dspout = this.module.outbus >> 2;

    for (let i = 0; i < this.numOutputs; i++) {
      if (this.activeOutputs[i] != 0) { // a track is active on this port
        for (let c = 0; c < numChannels; c++) {
          let dac = outputs[i][c];
          let offset = dspout + (i * 2 + c) * this.buflen;
          dac.set(this.module.HEAPF32.subarray(offset, offset + this.buflen));
        }
      }
    }

    return true;
  }

  _heapMalloc(data) {
    var blocks = [];
    data.forEach((typedArray) => {
      var numBytes = typedArray.buffer.byteLength;
      var ptr = this.module._malloc(numBytes);
      var heapBytes = this.module.HEAPU8.subarray(ptr, ptr + numBytes);
      heapBytes.set(typedArray);
      blocks.push(heapBytes);
    });
    return blocks;
  }

  _heapFree(blocks) {
    blocks.forEach((heapBytes) => {
      this.module._free(heapBytes.byteOffset);
    });
  }
}

function formatBinaryMessage(msg, caller) {
  let heapBlocks = caller._heapMalloc(msg.args.binaryData);
  msg.args.binaryData.length = 0;
  heapBlocks.forEach((block) => {
    msg.args.binaryData.push({ offset:block.byteOffset, length:block.length }); });
}

registerProcessor("DSP", DSPProcessor);
registerProcessor("DSPDevice", DSPDevice);
