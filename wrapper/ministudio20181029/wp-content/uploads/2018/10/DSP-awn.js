var DSP = DSP || {};

// ----------------------------------------------------------------------------
//
//
DSP.Base = class DSPBase extends AudioWorkletNode {
  constructor(actx, options) {
    options = options || {};
    options.buflenAWP = options.buflen;
    options.buflenSPN = options.daclen;
    options.numberOfInputs  = 0;
    options.numberOfOutputs = options.numberOfOutputs || 1;
    options.outputChannelCount = [];
    let outPorts = [];
    for (let i=0; i<options.numberOfOutputs; i++) {
      options.outputChannelCount.push(2);
      outPorts[i] = 0;
    }

    super(actx, "DSP", options);
    this.actx = actx;
    this.outPorts = outPorts;
    this.numOutputs = options.numberOfOutputs;

    this.port.onmessage = this.onMessage.bind(this);
    DSP.core = this;
  }

  onMessage(e) {
    let msg = e.data;
    if (msg.type != "engineState" && msg.type != "levelMetering") console.dir(msg);
  }

  postMessage(msg) {
    this.port.postMessage(msg);
  }

  toggleStateUpdates () {
    let msg = { target:2, method:9 };
    this.port.postMessage(msg);
  }
};

// ----------------------------------------------------------------------------
//
//
DSP.Core = class Core extends DSP.Base {

  constructor(actx, options, exportHelper) {
    options = options || {};
    options.numberOfOutputs = 16 + 1;   // +1 for metronome

    super(actx, options);
    DSP.core = this;
    this.exportHelper = exportHelper;

    this.actx = actx;
    this.deviceChains = {};
    this.devices = {};

    // -- This node ensures that old output is overwritten when all tracks have been removed.
    this.nullNode = actx.createGain();
    this.nullNode.gain.value = 0; 

    // -- This node serves as a sink for nodes that must be pulled but not heard, like level meters
    this.silentNode = actx.createGain();
    this.silentNode.gain.value = 0;
    this.silentNode.connect(actx.destination);
  }

  // deprecated: don't call it directly, use the IPC call
  addWAM(wamDevice) {
    let chain = this.deviceChains[wamDevice.track.id];
    if (chain) {
      wamDevice.wam.id = wamDevice.id;
      wamDevice.wam.isWAM = true;
      chain.devices.push(wamDevice.wam);
      this.devices[wamDevice.id] = wamDevice.wam;
      wamDevice.wam.sendMessage("add", "WAM", wamDevice.id);
    }
  }

  removeWAM(wamDevice) {
    let chain = this.deviceChains[wamDevice.track.id];
    if (chain) {
      chain.devices.splice(chain.devices.indexOf(wamDevice.wam));
      delete this.devices[wamDevice.id];
    }
  }

  postMessage(msg) {
    let wasHandled = this.messageProxy(msg);
    if (!wasHandled)
      this.port.postMessage(msg);
  }

  messageProxy(msg) {
    // console.log(msg)

    // -- add
    if (msg.method == 3) {

      // -- live midi does not need SEQ
      if (msg.target == 3) {
        let chain = this.deviceChains[msg.args.target];
        if (chain)
          chain.onMidi(msg);
        return true;
      }

      // -- add track
      else if (msg.prop == "tracks") {
        let id = msg.args;
        let outport = this._getOutputPort(id);
        if (outport >= 0) {
          msg.args = { id:id, outport:outport };
          this.port.postMessage(msg);
          let deviceChain = new DSP.DeviceChain(id, this.actx);
          this.deviceChains[id] = deviceChain;
          this.connect(deviceChain.input, outport);
          deviceChain.connect(this.masterChannel.input);
        }
        else console.log("no room for a new track");
        return true;
      }

      // -- add device
      else if (msg.prop == "devices") {
        if (msg.args.className != "WAM") {
          let chain = this.deviceChains[msg.target];
          if (chain) {
            let device = chain.addDevice(msg.args.id, msg.args.className, this.actx);
            if (device)
              this.devices[device.id] = device;
          }
        }
        else {
          this.addWAM(msg.args.wam);
          delete msg.args.wam; // so it won't go to the DSP side
        }
      }
    }

    // -- remove
    else if (msg.method == 4) {

      // -- remove device
      if (msg.prop == "devices") {
        let chain = this.deviceChains[msg.target];
        if (chain) {
          chain.removeDevice(msg.args);
          delete this.devices[msg.args];
        }
      }

      // -- remove track
      else if (msg.prop == "tracks") {
        let chain = this.deviceChains[msg.args];
        if (chain) {
          chain.disconnect();
          delete this.deviceChains[msg.args];
          for (let i = 1; i < this.numOutputs; i++) {
            if (this.outPorts[i] == msg.args) {
              this.outPorts[i] = 0;
              break;
            }
          }
        }
      }
    }

    // -- (dis)connect
    else if (msg.method == 7 || msg.method == 8) {
      let srcId = msg.args.srcId;
      let dstId = msg.args.dstId;
      let srcType = "";
      let dstType = "";
      let src = false;
      let dst = false;

      if (srcId in this.devices) {
        src = this.devices[srcId];
        srcType = src.className;
      }
      else if (srcId in this.deviceChains) {
        src = this.deviceChains[srcId];
        srcType = "track";
      }
      if (dstId in this.devices) {
        dst = this.devices[dstId];
        dstType = dst.className;
      }
      else if (dstId in this.deviceChains) {
        dst = this.deviceChains[dstId];
        dstType = "track";
      }

      // // -- DEBUG
      // if (!src)
      //   console.warn("didn't find src!", msg);
      // if (!dst)
      //   console.warn("didn't find dst!", msg);
      // let toInput = msg.args.port == 0;
      // let toOutput = msg.args.port == 1;
      // let inOut;
      // if (toInput)
      //   inOut = " input";
      // else if (toOutput)
      //   inOut = " output";

      // if (src && dst) {
      //   if (msg.method == 7)
      //     console.log("connecting", srcType, "with id", src.id, "to", dstType + inOut, "with id", dst.id);
      //   else
      //     console.log("disconnecting", srcType, "with id", src.id, "from", dstType + inOut, "with id", dst.id);
      // }

      if (srcType == "track") src = src.input;
      if (dstType == "track") dst = dst.mute;

      if (msg.method == 7) src.connect(dst);
      else src.disconnect(dst);
      return true;
    }

    // -- set (track gain, pan, mute, levelMetering)
    else if (msg.method == 2 && this.deviceChains[msg.target]) {
      let chain = this.deviceChains[msg.target];
      chain.set(msg);
      return true;
    }

    // -- set metronome level
    else if (msg.method == 2 && msg.target == 4 && msg.prop == "gain") {
      this.metronomeLevel.gain.value = msg.args;
      return true;
    }

    // -- set transportState (for audio export)
    else if (msg.method == 2 && msg.target == 2 && msg.prop == "transportState") {
      if (msg.args.state == 3) { // export
        let secondsToExport = msg.args.end;
        let samplesToExport = secondsToExport * this.actx.sampleRate;
        let samplesRemaining = samplesToExport;
        let index = 0;

        let exportNode = new ExportNode(this.actx);
        exportNode.port.onmessage = e => {
          if (samplesRemaining <= 0) return;

          let bufsize = e.data[0][0].length;
          samplesRemaining -= bufsize;
          if (samplesRemaining <= 0) index = -1;

          let audio = e.data[0].map(arr => arr.buffer);
          let total = samplesToExport / Math.ceil(bufsize);
          this.port.onmessage({ data: { type: "exportBuffer", data: { audio, index, total } } });

          if (samplesRemaining <= 0) {
            exportNode.disconnect();
            this.exportHelper.endExport();
          }
          else index++;
        };

        this.masterChannel.connect(exportNode);
        exportNode.connect(this.actx.destination);
        this.exportHelper.startExport();

        return true;
      }
    }

    // -- init
    else if (msg.method == 5) {
      this.masterChannel = new DSP.DeviceChain(5, this.actx);
      this.nullNode.connect(this.masterChannel.input);
      setTimeout(() => this.masterChannel.connect(this.actx.destination), 250); // postponing this slightly to avoid noise on startup
      this.deviceChains[5] = this.masterChannel;

      this.metronomeLevel = this.actx.createGain();
      this.connect(this.metronomeLevel, 0);
      this.metronomeLevel.connect(this.masterChannel.input);
    }

    // -- get preset
    else if (msg.method == 1 && msg.prop == "preset") {
      let device = this.devices[msg.target];
      if (device) {
        device.getState().then((state) => {
          let r = { type:"response", prop:"preset", msgid:msg.msgid }
          r.data = state ? JSON.stringify(state) : "";
          DSP.core.port.onmessage({ data:r });
        });
      }
      return true;
    }

    // -- device messages
    else if (Object.keys(this.devices).indexOf(msg.target + "") >= 0) {
      let device = this.devices[msg.target];
      if (device) {
        if (device.isWAM && msg.prop == "bypass")
          device.setParam (msg.prop, msg.args);
        else device.postMessage(msg);
      }
      return true;
    }

    return false;
  }

  _getOutputPort (trackID) {
    for (let i = 1; i < this.numOutputs; i++) {
      if (this.outPorts[i] == 0) {
        this.outPorts[i] = trackID;
        return i;
      }
    }
    return -1;
  }
};


// ----------------------------------------------------------------------------
//
//
DSP.DeviceChain = class DeviceChain {

  constructor(id, actx) {
    this.id = id;
    this.actx = actx;
    this.input  = actx.createGain();
    this.output = new DSP.Device(actx, { className: "PanGain", id: id });
    this.mute = new GainNode(actx);
    this.levels = new LevelMeteringNode(actx, id);
    this.input.id = 0;
    this.mute.id = 1;

    this.input.connect(this.mute);
    this.mute.connect(this.output);
    this.output.connect(this.levels);
    this.devices = [];
  }

  addDevice(id, deviceClass, actx) {
    let device = new DSP.Device(actx, { className: deviceClass, id: id });
    this.devices.push(device);
    return device;
  }

  removeDevice(id) {
    let i = this._findDevice(id);
    if (i >= 0) this.devices.splice(i,1)[0].disconnect();
  }

  set(msg) {
    switch (msg.prop) {
      case "gain":
      case "pan":
        this.output.postMessage(msg);
        break;

      case "mute":
        this.mute.gain.value = (msg.args == 1) ? 0 : 1;
        break;

      case "levelMetering":
        if (msg.args) this.levels.connect(DSP.core.silentNode);
        else this.levels.disconnect();
        break;
    }
  }

  connect(dst, dstPort) {
    dstPort = dstPort || 0;
    this.output.connect(dst, 0, dstPort);
  }

  disconnect() {
    DSP.core.disconnect(this.input);

    this.devices.forEach((deviceId) => { this.removeDevice(deviceId) });
    this.input.disconnect();
    this.mute.disconnect();
    this.output.disconnect();
    this.levels.disconnect();
  }

  onMidi(msg) {
    if (msg.args.data.timestamp == undefined)
      msg.args.data.timestamp = 0;
    Object.keys(this.devices).forEach((d) => {
      this.devices[d].postMessage(msg); });
  }

  _findDevice(id) {
    for (let i=0; i<this.devices.length; i++) {
      if (this.devices[i].id == id)
        return i;
    }
    return -1;
  }
};


// ----------------------------------------------------------------------------
//
//
DSP.Device = class DSPDevice extends AudioWorkletNode {

  constructor(actx, options) {
    options = options || {};
    options.outputChannelCount = [2];
    super(actx, "DSPDevice", options);
    this.actx = actx;
    this.port.onmessage = this.onMessage.bind(this);
    this.init( options.className, options.id );
  }

  init(className, id) {
    this.id = id;
    this.className = className;
    this.postMessage({ method:0, args:{ className:className, id:id } });
  }

  postMessage(msg) {
    this.port.postMessage(msg);
  }

  onMessage(e) {
    if (e.data.type == "response")
      DSP.core.port.onmessage(e);
    else console.dir(e.data);
  }
};

// ----------------------------------------------------------------------------
// DEBUG
//
function displayGraphState() {
  console.log("Device Chains:");
  console.table(DSP.core.deviceChains);
  console.log("Devices:");
  console.table(DSP.core.devices);

  for (var deviceId in DSP.core.devices) {
    let device = DSP.core.devices[deviceId];
    let orphaned = true;
    for (var chainId in DSP.core.deviceChains) {
      let chain = DSP.core.deviceChains[chainId];
      for (var devId in chain.devices) {
        let dev = chain.devices[devId];
        if (dev == device)
          orphaned = false;
      }
    }
    if (orphaned)
      console.warn("orphaned device!", device);
  }
}
