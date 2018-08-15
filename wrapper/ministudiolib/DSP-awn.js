var DSP = DSP || {}

// ----------------------------------------------------------------------------
//
//
DSP.Core = class Core extends AudioWorkletNode {

  constructor(actx, options) {
    options = options || {};
    options.buflenAWP = options.buflen;
    options.buflenSPN = options.daclen;
    options.numberOfInputs  = 0;
    options.numberOfOutputs = 16 + 1;   // +1 for metronome
    options.outputChannelCount = [];
    let outPorts = [];
    for (let i=0; i<options.numberOfOutputs; i++) {
      options.outputChannelCount.push(2);
      outPorts[i] = 0;
    }

    super(actx, "DSP", options);
    DSP.core = this;
    this.actx = actx;
    this.deviceChains = {};
    this.devices = {};

    this.outPorts = outPorts;
    this.numOutputs = options.numberOfOutputs;
    this.masterChannel = new DSP.DeviceChain(5, actx);    
    this.masterChannel.connect(actx.destination);    
    this.deviceChains[5] = this.masterChannel;
    
    this.port.onmessage = this.onMessage.bind(this);
  }

  addWAM (wamDevice) {
    let chain = this.deviceChains[wamDevice.track.id];
    if (chain) {
      wamDevice.wam.id = wamDevice.id;
      chain.devices.push(wamDevice.wam);
      this.devices[wamDevice.id] = wamDevice.wam;
      wamDevice.wam.sendMessage ("add", "WAM", wamDevice.id);
    }
  }
  
  removeWAM (wamDevice) {
    let chain = this.deviceChains[wamDevice.track.id];
    if (chain) {
      chain.devices.splice(chain.devices.indexOf(wamDevice.wam));
      delete this.devices[wamDevice.id];
    }
  }
  
  toggleStateUpdates () {
    let msg = { target:2, method:9 };
    this.port.postMessage(msg);
  }
  
  postMessage(msg) {
    let wasHandled = this.messageProxy(msg);
    if (!wasHandled)
      this.port.postMessage(msg);
  }

  onMessage(e) {
    let msg = e.data;
    if (msg.type != "engineState") console.dir(msg);
  }

  messageProxy (msg) {
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
          msg.args = { id:id, outport:outport }
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
      let chain = this.deviceChains[msg.args.id];
      if (chain) chain.handleConnections(msg);
      return true;
    }
    
    // -- set (track gain,pan,mute)
    else if (msg.method == 2 && this.deviceChains[msg.target]) {
      let chain = this.deviceChains[msg.target];
      chain.set(msg.prop, msg.args);
      return true;
    }
    
    // -- device messages
    else if (Object.keys(this.devices).indexOf(msg.target + "") >= 0) {
      let device = this.devices[msg.target];
      if (device)
        device.postMessage(msg);
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
}


// ----------------------------------------------------------------------------
//
//
DSP.DeviceChain = class DeviceChain {
  
  constructor (id, actx) {
    this.id = id;
    this.actx = actx;
    this.input  = actx.createGain();
    this.output = actx.createGain();
    this.mute = new GainNode(actx);
    this.panner = new StereoPannerNode(actx);
    this.input.id = 0;
    this.mute.id = 1;
    
    this.input.connect(this.mute);
    this.mute.connect(this.panner);
    this.panner.connect(this.output);
    this.devices = [];
  }

  addDevice (id, deviceClass, actx) {
    let device = new DSP.Device(actx, { className: deviceClass, id: id });
    this.devices.push(device);
    return device;
  }
  
  removeDevice (id) {
    let i = this._findDevice(id);
    if (i >= 0)
      this.devices.splice(i,1);
  }
  
  set (key, value) {
    switch (key) {
      case "gain": this.output.gain.value = value; break;
      case "pan":  this.panner.pan.value = value; break;
      case "mute": this.mute.gain.value = value == 1 ? 0:1; break;
    }
  }
  
  connect (dst, dstPort) {
    dstPort = dstPort || 0;
    this.output.connect(dst, 0, dstPort);
  }
  
  disconnect () {
    DSP.core.disconnect(this.input);
    this.output.disconnect();
  }
  
  handleConnections (msg) {
    let src = this.input;
    let dst = this.mute;

    let i = this._findDevice(msg.target);
    if (i >= 0) {
      let device = this.devices[i];
      
      // src is either track or device
      let dstID = msg.args.id;      // always track.id
      let srcPort = msg.prop | 0;   // always 0
      let dstPort = msg.args.port;  // 0 or 1
      
      if (dstPort == 0) {
        if (i > 0)
          src = this.devices[i-1];
        this.input.disconnect();
        this.input.connect(device);
        dst = device;
      }
      else {
        if (i > 1 && msg.method == 7) {
          while (i >= 1) {
            let pred = this.devices[i-1];
            if (device.numberOfInputs > 0)
              pred.connect(device);
            i--;
          }
        }
        src = device;
      }
    }
        
    if (msg.method == 7) {
      src.connect(dst);
    }
    else {
      src.disconnect();
    }
  }
  
  onMidi (msg) {
    if (msg.args.data.timestamp == undefined)
      msg.args.data.timestamp = 0;
    Object.keys(this.devices).forEach((d) => {
      this.devices[d].postMessage(msg); });
  }
  
  _findDevice (id) {
    for (let i=0; i<this.devices.length; i++) {
      if (this.devices[i].id == id)
        return i;
    }
    return -1;
  }
}


// ----------------------------------------------------------------------------
//
//
DSP.Device = class DSPDevice extends AudioWorkletNode {

  constructor(actx, options) {
    options = options || {}
    options.outputChannelCount = [2];
    super(actx, "DSPDevice", options);
    this.actx = actx;
    this.port.onmessage = this.onMessage.bind(this);
    this.init( options.className, options.id );
  }

  init (className,id) {
    this.id = id;
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
}
