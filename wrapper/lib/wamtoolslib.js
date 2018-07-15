console.log('WAM tools library v1.05');
var pitchQueue = [];
function initBankPatch(moduleName, m, afterDone) {
	try {
		var bank = m.banks[0];
		console.log('start load bank', moduleName, bank);
		m.loadBank(bank).then(function () {
			if (m.selectPatch) {
				console.log('plug.selectPatch', moduleName, 0);
				m.selectPatch(0);
			} else {
				var patch = m.getPatch ? m.getPatch(0) : m.bank[0];
				m.setPatch(patch);
				console.log('plug.setPatch', moduleName, patch);
			}
			console.log('done bank & patch', moduleName);
			afterDone(m);
		}, function (e) {
			console.log(e);
			afterDone(m);
		});
	} catch (ex) {
		console.log(ex);
		afterDone(m);
	}
}
function loadWAMsynthModule(documentScripts, moduleScripts, audioContext,output, moduleName, onSuccess) {
	loadScriptsIntoDocument(documentScripts, function () {
		addAllModuleIntoAudioWorklet(moduleScripts, function () {
			var f = window.WAM[moduleName];
			var m = new f(audioContext);
			console.log(moduleName, m);
			m.connect(output);
			initBankPatch(moduleName, m, onSuccess);
		});
	});
}
function loadScriptsIntoDocument(scriptPathArray, onSuccess) {
	if (scriptPathArray.length > 0) {
		var path = scriptPathArray.shift();
		var script = document.createElement('script');
		script.setAttribute('src', path);
		document.head.appendChild(script);
		console.log('wait script', path);
		script.onload = function () {
			loadScriptsIntoDocument(scriptPathArray, onSuccess)
		}
	} else {
		onSuccess();
	}
}
function addAllModuleIntoAudioWorklet(modulePathArray, onSuccess) {
	if (modulePathArray.length > 0) {
		var path = modulePathArray.shift();
		console.log('loadModule', path);
		audioContext.audioWorklet.addModule(path).then(function () {
			addAllModuleIntoAudioWorklet(modulePathArray, onSuccess);
		}, function (e) {
			console.log('error', e);
		});
	} else {
		onSuccess();
	}
}
function queueNote(plug, audioContext, when, pitch, volume, duration) {
	if (plug.dispatchQueuePitch) {
		plug.dispatchQueuePitch(when, pitch, volume, duration);
	} else {
		pitchQueue.push({
			plug: plug,
			audioContext: audioContext,
			when: when,
			pitch: pitch,
			volume: volume,
			duration: duration,
			waiting: true
		});
	}
}
function checkQueue() {
	for (var i = 0; i < pitchQueue.length; i++) {
		if (pitchQueue[i].when + pitchQueue[i].duration <= pitchQueue[i].audioContext.currentTime) {
			pitchQueue[i].plug.dispatchCancelPitch(pitchQueue[i].pitch, pitchQueue[i].volume);
		} else {
			if (pitchQueue[i].when <= pitchQueue[i].audioContext.currentTime && pitchQueue[i].waiting) {
				pitchQueue[i].plug.dispatchStartPitch(pitchQueue[i].pitch, pitchQueue[i].volume);
				pitchQueue[i].waiting = false;
			}
		}
	}
	var n = 0;
	while (n < pitchQueue.length) {
		if (pitchQueue[n].when + pitchQueue[n].duration <= pitchQueue[n].audioContext.currentTime) {
			pitchQueue.splice(n, 1);
		} else {
			n++;
		}
	}
}
function saveFullState(name, state) {
	console.log('saveState', name, state);
	state.saved = new Date();
	localStorage.setItem(name, JSON.stringify(state));
}
function readObjectFromlocalStorage(name) {
	var o = null;
	try {
		o = JSON.parse(localStorage.getItem(name));
	} catch (ex) {
		console.log(ex);
		return {};
	}
	return o;
}
function redefineNoteSend(plug) {
	plug.dispatchStartPitch = function (pitch, volume) {
		plug.onMidi([0x90, pitch, volume]);
	};
	plug.dispatchCancelPitch = function (pitch, volume) {
		plug.onMidi([0x80, pitch, volume]);
	};
	plug.dispatchQueuePitch = null;
}
function redefineInitGUI(wamgui, stateName) {
	wamgui.needSetupPatch = false;
	wamgui.needClearParams = false;
	wamgui.alreadyDoneRedefine = false;
	wamgui.persistentState = wamgui.persistentState || {};
	wamgui._original_initPresets = wamgui._initPresets;
	wamgui._initPresets = function (plug) {
		redefineNoteSend(plug);
		wamgui._original_initPresets(plug);
		var patches = wamgui._root.getElementById("patches");
		patches.original_onchange = patches.onchange;
		patches.onchange = function (e) {
			if (wamgui.needSetupPatch) {
				wamgui.needSetupPatch = false;
				wamgui._root.getElementById("patches").selectedIndex = 1 * wamgui.persistentState.patchNN;
				console.log('set patch', wamgui.persistentState.patchNN);
				patches.original_onchange({
					target: {
						selectedIndex: 1 * wamgui.persistentState.patchNN
					}
				});
				uploadParams(plug, wamgui.persistentState.params)
				wamgui.needClearParams = true;
				return;
			} else {
				patches.original_onchange(e);
			}
			if (wamgui.alreadyDoneRedefine) {
				wamgui.persistentState.patchNN = e.target.selectedIndex;
				if (wamgui.needClearParams) {
					wamgui.persistentState.params = [];
				}
			} else {
				redefineModuleFunctions(wamgui, plug, stateName);
			}
		};
	}
}
function uploadParams(plug, params) {
	console.log('upload params');
	for (var i = 0; i < params.length; i++) {
		if (params[i] != null) {
			console.log('set', i, 1 * params[i]);
			plug.original_setParam(i, 1 * params[i]);
		}
	}
}
function redefineModuleFunctions(wamgui, module, stateName) {
	wamgui.alreadyDoneRedefine = true;
	module.originalLoadBank = module.loadBank;
	module.loadBank = function (filename) {
		wamgui.persistentState.bankFileName = filename;
		return module.originalLoadBank(filename);
	};
	module.original_setParam = module.setParam;
	module.setParam = function (key, value) {
		module.original_setParam(key, value);
		wamgui.persistentState.params = wamgui.persistentState.params || [];
		wamgui.persistentState.params[key] = value;
	};
	wamgui.persistentState = loadGUIState(wamgui, stateName);
	wamgui.persistentState.params = wamgui.persistentState.params || [];
	window.addEventListener("blur", function () {
		saveFullState(stateName, wamgui.persistentState);
	});
	window.addEventListener("beforeunload", function () {
		saveFullState(stateName, wamgui.persistentState);
	});
	window.addEventListener("unload", function () {
		saveFullState(stateName, wamgui.persistentState);
	});
}
function loadGUIState(wamgui, stateName) {
	var o = readObjectFromlocalStorage(stateName);
	wamgui.needClearParams = true;
	try {
		if (o) {
			if (typeof o === "object") {
				if (o.bankFileName) {
					console.log('load bankFileName', o.bankFileName);
					wamgui.needSetupPatch = true;
					wamgui.needClearParams = false;
					wamgui._root.getElementById("banks").value = '' + o.bankFileName;
					wamgui._root.getElementById("banks").onchange({
						target: {
							value: '' + o.bankFileName
						}
					});
				} else {
					if (typeof o.patchNN != 'undefined') {
						console.log('patch only');
						wamgui._root.getElementById("patches").original_onchange({
							target: {
								selectedIndex: 1 * o.patchNN
							}
						});
						wamgui._root.getElementById("patches").selectedIndex = 1 * o.patchNN;
						uploadParams(wamgui._plug, o.params)
					}
				}
				return o;
			}
		}
	} catch (e) {
		console.log(e);
	}
	return {};
}
function rawUploadParams(plug, params) {
	for (var i = 0; i < params.length; i++) {
		if (params[i] != null) {
			console.log('set', i, 1 * params[i]);
			plug.setParam(i, 1 * params[i]);
		}
	}
}
function rawSetPatchParams(plug, o) {
	if (typeof o.patchNN != 'undefined') {
		console.log('patch', o.patchNN);
		var num = 1 * o.patchNN;
		if (plug.selectPatch) {
			plug.selectPatch(num);
		} else {
			var patch = plug.getPatch ? plug.getPatch(num) : plug.bank[num];
			plug.setPatch(patch);
		}
	}
	rawUploadParams(plug, o.params)
}
function loadRawWAM(stateName, plug) {
	console.log('loadRawWAM', stateName, plug);
	var o = readObjectFromlocalStorage(stateName);
	try {
		if (o) {
			if (typeof o === "object") {
				if (o.bankFileName) {
					plug.loadBank(o.bankFileName).then(
						function (bank) {
						console.log('bank', bank);
						rawSetPatchParams(plug, o);
					}, function (error) {
						console.log('error', error);
					});
				} else {
					rawSetPatchParams(plug, o);
				}
			}
		}
	} catch (e) {
		console.log(e);
	}
}
function WAFWrapper(audioContext,name,output) {
	var me = this;
	this.audioContext = audioContext;
	this.player = new WebAudioFontPlayer();
	var selectedPreset = null;
	this.dispatchStartPitch = function (pitch, volume) {
		me.player.queueWaveTable(me.audioContext, output, selectedPreset, me.audioContext.currentTime, pitch, 987654321, volume / 300);
	};
	this.dispatchCancelPitch = function (pitch, volume) {
		for (var i = 0; i < me.player.envelopes.length; i++) {
			if (me.player.envelopes[i].pitch == pitch) {
				me.player.envelopes[i].cancel();
			}
		}
	};
	this.dispatchQueuePitch = function (when, pitch, volume, duration) {
		me.player.queueWaveTable(me.audioContext, output, selectedPreset, when, pitch, duration, volume / 300);
	};
	this.loadInstr = function (n, onSuccess) {
		var info = me.player.loader.instrumentInfo(n)
			me.player.loader.startLoad(me.audioContext, info.url, info.variable);
		me.player.loader.waitLoad(function () {
			console.log('done', info.variable);
			selectedPreset = window[info.variable];
			if (onSuccess) {
				onSuccess();
			}
		});
	};
	this.saveState = function() {
		saveFullState(name, this.state);
	};
	var state = readObjectFromlocalStorage(name);
	state = state || {};
	if (!(typeof state === 'object')) {
		state = {};
	}
	state.preset = state.preset || 0;
	console.log(state);
	this.state = state;
	this.loadInstr(state.preset);
	return this;
}
function midiNoteOn(pitch, velocity) {
	console.log('midNoteOn', pitch, velocity);
}
function midiNoteOff(pitch) {
	console.log('midiNoteOff', pitch);
}
function midiOnMIDImessage(event) {
	var data = event.data;
	var cmd = data[0] >> 4;
	var channel = data[0] & 0xf;
	var type = data[0] & 0xf0;
	var pitch = data[1];
	var velocity = data[2];
	switch (type) {
	case 144:
		midiNoteOn(pitch, velocity);
		break;
	case 128:
		midiNoteOff(pitch);
		break;
	}
}
function startListenMIDI(onMidiNoteOn, onMidiNoteOff) {
	if (navigator.requestMIDIAccess) {
		console.log('navigator.requestMIDIAccess ok');
		navigator.requestMIDIAccess().then(function (midi) {
			var inputs = midi.inputs.values();
			for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
				console.log('midi input', input);
				midiNoteOn = onMidiNoteOn;
				midiNoteOff = onMidiNoteOff;
				input.value.onmidimessage = midiOnMIDImessage;
			}
			midi.onstatechange = function midiOnStateChange(event) {
				console.log('midiOnStateChange', event);
			};
		}, function (e) {
			console.log('fail', e);
		});
	} else {
		console.log('navigator.requestMIDIAccess undefined');
	}
}
setInterval(checkQueue, 3);
