console.log('midi compiler v1.01');
function MidiCompiler() {
	var me = this;
	me.S16 = 10;
	me.S_8 = me.S16 * 2;
	me.S_4 = me.S16 * 4;
	me.S32 = me.S16 / 2;
	me.bendCount = 36;
	me.bendStep = 0x1fff / me.bendCount;
	me.writeMIDIHeader = function (midi) {
		midi.push(0x4d);
		midi.push(0x54);
		midi.push(0x68);
		midi.push(0x64);
	}
	me.write4BigEndian = function (midi, nn) {
		var byte0 = nn >> 24;
		var byte1 = (nn >> 16) & 0xff;
		var byte2 = (nn >> 8) & 0xff;
		var byte3 = nn & 0xff;
		midi.push(byte0);
		midi.push(byte1);
		midi.push(byte2);
		midi.push(byte3);
	}
	me.write3BigEndian = function (midi, nn) {
		var byte0 = nn >> 16;
		var byte1 = (nn >> 8) & 0xff;
		var byte2 = nn & 0xff;
		midi.push(byte0);
		midi.push(byte1);
		midi.push(byte2);
	}
	me.write2BigEndian = function (midi, nn) {
		var byte0 = nn >> 8;
		var byte1 = nn & 0xff;
		midi.push(byte0);
		midi.push(byte1);
	}
	me.bpmTo0x51 = function (bpm) {
		return Math.floor(60000000.0 / bpm);
	}
	me.midiTime = function (time) {
		var tt = time;
		if (tt < 0) {
			tt = 0;
		}
		var end = 0; // 0   1    2    3
		var b = [0, -128, -128, -128]; // -128 == 0x80
		for (var i = 0; i < 4; i++) {
			b[i] = Math.floor(b[i] | (tt & 0x7f));
			tt = tt >> 7;
			if (tt == 0) {
				end = i + 1;
				break;
			}
		}
		var r = new Array(end);
		for (var i = 0; i < end; i++) {
			r[end - i - 1] = b[i];
		}
		return r;
	}
	me.writeSongHeader = function (midi) {
		//System.out.println("writeSongHeader");
		midi.push(0x4d); //0 start header
		midi.push(0x54); //1
		midi.push(0x68); //2
		midi.push(0x64); //3
		midi.push(0x00); //4
		midi.push(0x00); //5
		midi.push(0x00); //6
		midi.push(0x06); //7 end of const
		midi.push(0x00); //8
		midi.push(0x01); //9 format 1
	}
	me.writeTrackHeader = function (midi) {
		//System.out.println("writeTrackHeader " + new Date());
		midi.push(0x4d); //14 start track header
		midi.push(0x54); //15
		midi.push(0x72); //16
		midi.push(0x6b); //17 end of track header
	}
	me.writeTrackFooter = function (midi) {
		//System.out.println("writeTrackFooter");
		midi.push(0x00); //57 end of track
		midi.push(0xff); //58
		midi.push(0x2f); //59
		midi.push(0x00); //60
	}
	me.writeProgramEvent = function (midi, timeShift, channel, program) {
		var r = me.midiTime(timeShift);
		me.append(midi, r);
		//midi.write(0x00);//22 start instrument
		midi.push(0xc0 | channel); //23
		midi.push(program); //24
		//System.out.println("program " + program);
	}
	me.writeTempoEvent = function (midi, timeShift, bpm) {
		//midi.write(0x00);//25 start tempo
		var r = me.midiTime(timeShift);
		//midi=midi.concat(r);
		//for(var ax=0;ax<r.length;ax++){midi.push(r[ax]);}
		me.append(midi, r);
		midi.push(0xff); //26
		midi.push(0x51); //27
		midi.push(0x03); //28
		var tempo = me.bpmTo0x51(bpm);
		me.write3BigEndian(midi, tempo);
		//midi.write(0x0b);//29
		//midi.write(0x71);//30
		//midi.write(0xb0);//31
		//console.log("writeTempoEvent",midi);
	}
	me.lsb = function (pitchValue) {
		var _lsb = pitchValue & 0x7F;
		return _lsb;
	}
	me.msb = function (pitchValue) {
		var _msb = pitchValue >> 7 & 0x7F;
		return _msb;
	}
	me.writeWheelEvent = function (midi, timeShift, channel, bend) {
		//System.out.println(bend);
		pitchValue = 0x2000 + bend;
		var r = me.midiTime(timeShift);
		me.append(midi, r);
		//midi.write(r, 0, r.length);
		midi.push(0xe0 | channel);
		midi.push(me.lsb(pitchValue));
		midi.push(me.msb(pitchValue));
	}
	me.writeMainVolume = function (midi, timeShift, channel) {
		//System.out.println("writeNoteOffEvent: " + pitch + ", " + timeShift);
		var r = me.midiTime(timeShift);
		//midi.write(r, 0, r.length);
		me.append(midi, r);
		midi.push(0xb0 | channel);
		midi.push(0x07);
		midi.push(0x7f);
	}
	me.writeNoteOffEvent = function (midi, timeShift, channel, pitch) {
		//System.out.println("writeNoteOffEvent: " + pitch + ", " + timeShift);
		//byte[] r = midiTime(timeShift);
		me.append(midi, me.midiTime(timeShift));
		//midi.write(r, 0, r.length);
		midi.push(0x80 | channel);
		midi.push(pitch);
		midi.push(0x00);
	}
	me.writeNoteOnEvent4 = function (midi, timeShift, channel, pitch) {
		me.writeNoteOnEvent5(midi, timeShift, channel, pitch, 0x7f);
	}
	me.writeNoteOnEvent5 = function (midi, timeShift, channel, pitch, volume) {
		//System.out.println("writeNoteOnEvent: " + pitch + ", " + timeShift);
		//byte[] r = midiTime(timeShift);
		//midi.write(r, 0, r.length);
		me.append(midi, me.midiTime(timeShift));
		midi.push(0x90 | channel);
		midi.push(pitch);
		midi.push(volume);
	}
	me.writeSetPitchWheelStepEvent = function (midi, timeShift, channel) {
		//byte b1 = 0x08;//4a->5e
		var b1 = (me.bendCount + 1);
		var b2 = 0x0;
		//byte[] r = midiTime(timeShift);
		//midi.write(r, 0, r.length);
		me.append(midi, me.midiTime(timeShift));
		midi.push(0xb0 | channel);
		midi.push(0x64);
		midi.push(0x00);
		//r = midiTime(0);
		//midi.write(r, 0, r.length);
		me.append(midi, me.midiTime(0));
		midi.push(0xb0 | channel);
		midi.push(0x65);
		midi.push(0x00);
		//
		//r = midiTime(0);
		//midi.write(r, 0, r.length);
		me.append(midi, me.midiTime(0));
		midi.push(0xb0 | channel);
		midi.push(0x06);
		midi.push(b1);
		//r = midiTime(0);
		//midi.write(r, 0, r.length);
		me.append(midi, me.midiTime(0));
		midi.push(0xb0 | channel);
		midi.push(0x26);
		midi.push(b2);
		//
		//r = midiTime(0);
		//midi.write(r, 0, r.length);
		me.append(midi, me.midiTime(0));
		midi.push(0xb0 | channel);
		//midi.write(0x61);? may be wrong
		midi.push(0x64);
		midi.push(0x70);
		//r = midiTime(0);
		//midi.write(r, 0, r.length);
		me.append(midi, me.midiTime(timeShift));
		midi.push(0xb0 | channel);
		midi.push(0x65);
		midi.push(0x70);
	}
	me.writeTrackCount = function (midi, count) {
		//System.out.println("writeTrackCount: " + count);
		me.write2BigEndian(midi, count);
	}
	me.writeTicksPerQuarter = function (midi, count) {
		me.write2BigEndian(midi, count);
	}
	me.writeTrackLength = function (midi, count) {
		me.write4BigEndian(midi, count);
	}
	me.beatChord = function (arr, n) {
		var r=[];
		for(var i=0;i<arr.length;i++){
			if(arr[i].beat==n){
				r.push(arr[i]);
			}
		}
		return r;
	};
	me.midiChannelN=function(trackN){
		if(trackN==0)return 30;
		if(trackN==1)return 24;
		if(trackN==2)return 16;
		if(trackN==3)return 29;
		if(trackN==4)return 1;
		if(trackN==5)return 32;
		if(trackN==6)return 40;
		return 38;
	};
	me.midiDrumN=function(drumN){
		if(drumN==0)return 35;
		if(drumN==1)return 41;
		if(drumN==2)return 38;
		if(drumN==3)return 45;
		if(drumN==4)return 42;
		if(drumN==5)return 46;
		if(drumN==6)return 51;
		return 49;
	};
	me.writeStateDrumTrack = function (storeDrums, midi) {
		me.writeTrackHeader(midi);
		var trackData = new Array();
		me.writeTempoEvent(trackData, 0, 120);
		me.writeSetPitchWheelStepEvent(trackData, 0, 0);
		me.writeSetPitchWheelStepEvent(trackData, 0, 1);
		me.writeSetPitchWheelStepEvent(trackData, 0, 2);
		me.writeSetPitchWheelStepEvent(trackData, 0, 3);
		me.writeSetPitchWheelStepEvent(trackData, 0, 4);
		me.writeSetPitchWheelStepEvent(trackData, 0, 5);
		me.writeSetPitchWheelStepEvent(trackData, 0, 6);
		me.writeSetPitchWheelStepEvent(trackData, 0, 7);
		me.writeSetPitchWheelStepEvent(trackData, 0, 8);
		me.writeSetPitchWheelStepEvent(trackData, 0, 10);
		me.writeSetPitchWheelStepEvent(trackData, 0, 11);
		me.writeSetPitchWheelStepEvent(trackData, 0, 12);
		me.writeSetPitchWheelStepEvent(trackData, 0, 13);
		me.writeSetPitchWheelStepEvent(trackData, 0, 14);
		me.writeSetPitchWheelStepEvent(trackData, 0, 15);
		var timeShift = 0;
		for (var step = 0; step < 256; step++) {
			//var one = beat[step];
			var one = me.beatChord(storeDrums,step);
			for (var i = 0; i < one.length; i++) {
				var midiNum = me.midiDrumN(one[i].drum);
				me.writeNoteOffEvent(trackData, timeShift, 9, midiNum);
				me.writeNoteOnEvent4(trackData, 0, 9, midiNum);
				timeShift = 0;
			}
			timeShift = timeShift + me.S16;
		}
		me.writeTrackFooter(trackData);
		me.writeTrackLength(midi, trackData.length);
		me.append(midi, trackData);
	};
	me.writeDrumTrack = function (song, beat, midi) {
		me.writeTrackHeader(midi);
		//ByteArrayOutputStream trackData = new ByteArrayOutputStream();
		var trackData = new Array();
		me.writeTempoEvent(trackData, 0, song.tempo);
		//console.log("after writeTempoEvent",trackData);
		me.writeSetPitchWheelStepEvent(trackData, 0, 0);
		me.writeSetPitchWheelStepEvent(trackData, 0, 1);
		me.writeSetPitchWheelStepEvent(trackData, 0, 2);
		me.writeSetPitchWheelStepEvent(trackData, 0, 3);
		me.writeSetPitchWheelStepEvent(trackData, 0, 4);
		me.writeSetPitchWheelStepEvent(trackData, 0, 5);
		me.writeSetPitchWheelStepEvent(trackData, 0, 6);
		me.writeSetPitchWheelStepEvent(trackData, 0, 7);
		me.writeSetPitchWheelStepEvent(trackData, 0, 8);
		me.writeSetPitchWheelStepEvent(trackData, 0, 10);
		me.writeSetPitchWheelStepEvent(trackData, 0, 11);
		me.writeSetPitchWheelStepEvent(trackData, 0, 12);
		me.writeSetPitchWheelStepEvent(trackData, 0, 13);
		me.writeSetPitchWheelStepEvent(trackData, 0, 14);
		me.writeSetPitchWheelStepEvent(trackData, 0, 15);

		var timeShift = 0;
		for (var step = 0; step < beat.length; step++) {
			var one = beat[step];

			for (var i = 0; i < one.length; i++) {
				//OneBeat oneBeat = songData.beat(step, i);
				var midiNum = one[i];
				//console.log(step,midiNum,trackData);
				me.writeNoteOffEvent(trackData, timeShift, 9, midiNum);
				me.writeNoteOnEvent4(trackData, 0, 9, midiNum);
				timeShift = 0;
			}
			timeShift = timeShift + me.S16;
		}

		//writeNoteOnEvent(trackData, timeShift, 9, 75, 0);
		//writeNoteOffEvent(trackData, 0, 9, 75);
		me.writeTrackFooter(trackData);
		//byte[] trackBytes = trackData.toByteArray();
		//writeTrackLength(midi, trackBytes.length);
		me.writeTrackLength(midi, trackData.length);
		//midi.write(trackBytes, 0, trackBytes.length);
		//console.log("trackData",trackData);
		me.append(midi, trackData);
	};
	me.writeInstrumentsTrack = function (instrument, channel, flated, midi) {
		me.writeTrackHeader(midi);
		var trackByteArrayOutputStream = new Array();
		me.writeProgramEvent(trackByteArrayOutputStream, 0, channel, instrument);
		var oneTuneCache = new Array();
		var timeDeltaWithPrevious = 0;
		for (var step = 0; step < flated.beat.length; step++) {
			for (var i = 0; i < oneTuneCache.length; i++) { //delete
				var oneTuneOff = oneTuneCache[i];
				if (oneTuneOff.length == 0) {
					me.writeNoteOffEvent(trackByteArrayOutputStream, timeDeltaWithPrevious, channel, oneTuneOff.pitch);
					if (oneTuneOff.glissando != 0) { //stop bend
						me.writeWheelEvent(trackByteArrayOutputStream, 0, channel, 0x0000);
					}
					timeDeltaWithPrevious = 0;
				}
				oneTuneOff.length = oneTuneOff.length - 1;
			}
			var t = new Array();
			for (var i = 0; i < oneTuneCache.length; i++) { //cleanup
				var oneTuneOff = oneTuneCache[i];
				if (oneTuneOff.length > -1) {
					t.push(oneTuneOff);
				}
			}
			oneTuneCache = t;
			var tuneCountAtCurrentStep = flated.tune[step].length; //songData.getTuneCount(step);
			for (var i = 0; i < tuneCountAtCurrentStep; i++) { //add
				var iOneTune = flated.tune[step][i]; //songData.tune(step, i);
				//console.log(flated.tune[step]);
				if (iOneTune.midi == instrument) {
					//console.log(iOneTune);
					me.writeNoteOnEvent5(trackByteArrayOutputStream, timeDeltaWithPrevious, channel, iOneTune.pitch, 127);
					timeDeltaWithPrevious = 0;
					var forCache = {};
					forCache.pitch = iOneTune.pitch;
					forCache.length = iOneTune.length;
					forCache.glissando = iOneTune.shift;
					if (forCache.glissando != 0) { //add bend
						forCache.tStep = (0.0 - (forCache.glissando * me.bendStep) / (forCache.length + 1.0));
					}
					oneTuneCache.push(forCache);
				}
			}
			var noBend = true;
			for (var i = 0; i < oneTuneCache.length; i++) { //bend
				var oneTuneOff = oneTuneCache[i];
				if (oneTuneOff.glissando != 0) {
					noBend = false;
					oneTuneOff.tCurrent = oneTuneOff.tCurrent + oneTuneOff.tStep / 2;
					if (oneTuneOff.tCurrent > 0x1fff) {
						oneTuneOff.tCurrent = 0x1fff;
					}
					if (oneTuneOff.tCurrent < -0x1fff) {
						oneTuneOff.tCurrent = -0x1fff;
					}
					me.writeWheelEvent(trackByteArrayOutputStream, timeDeltaWithPrevious, channel, oneTuneOff.tCurrent);
					timeDeltaWithPrevious = 0;
				}
			}
			if (noBend) {
				//
			} else {
				timeDeltaWithPrevious = timeDeltaWithPrevious + me.S32;
				for (var i = 0; i < oneTuneCache.length; i++) { //bend
					var oneTuneOff = oneTuneCache[i];
					if (oneTuneOff.glissando != 0) {
						noBend = false;
						oneTuneOff.tCurrent = oneTuneOff.tCurrent + oneTuneOff.tStep / 2;
						if (oneTuneOff.tCurrent > 0x1fff) {
							oneTuneOff.tCurrent = 0x1fff;
						}
						if (oneTuneOff.tCurrent < -0x1fff) {
							oneTuneOff.tCurrent = -0x1fff;
						}
						me.writeWheelEvent(trackByteArrayOutputStream, timeDeltaWithPrevious, channel, oneTuneOff.tCurrent);
						timeDeltaWithPrevious = 0;
					}
				}
			}
			if (noBend) {
				timeDeltaWithPrevious = timeDeltaWithPrevious + me.S16;
			} else {
				timeDeltaWithPrevious = timeDeltaWithPrevious + me.S32;
			}
		}
		for (var i = 0; i < oneTuneCache.length; i++) { //delete last
			var oneTuneOff = oneTuneCache[i];
			if (oneTuneOff.length == 0) {
				me.writeNoteOffEvent(trackByteArrayOutputStream, timeDeltaWithPrevious, channel, oneTuneOff.pitch);
				if (oneTuneOff.tStep != 0) { //stop bend
					me.writeWheelEvent(trackByteArrayOutputStream, 0, channel, 0x0000);
				}
				timeDeltaWithPrevious = 0;
			} else {
				oneTuneOff.length = oneTuneOff.length - 1;
			}
		}
		me.writeTrackFooter(trackByteArrayOutputStream);
		//byte[] trackBytes = trackByteArrayOutputStream.toByteArray();
		me.writeTrackLength(midi, trackByteArrayOutputStream.length);
		//midi.write(trackBytes, 0, trackBytes.length);
		me.append(midi, trackByteArrayOutputStream);
		//console.log(midi,trackByteArrayOutputStream);
		return 0;
	}
	me.noteChord = function (arr, beat, track) {
		var r=[];
		for(var i=0;i<arr.length;i++){
			if(arr[i].beat==beat && arr[i].track==track){
				r.push(arr[i]);
			}
		}
		return r;
	};
	me.writeStateInstrumentsTrack=function(storeTracks, channel, midi){
	//me.writeInstrumentsTrack = function (instrument, channel, flated, midi) {
	//var one = me.beatChord(storeDrums,step);
		me.writeTrackHeader(midi);
		var trackByteArrayOutputStream = new Array();
		me.writeProgramEvent(trackByteArrayOutputStream, 0, channel, me.midiChannelN(channel));
		var oneTuneCache = new Array();
		var timeDeltaWithPrevious = 0;
		for (var step = 0; step < 256; step++) {
			for (var i = 0; i < oneTuneCache.length; i++) { //delete
				var oneTuneOff = oneTuneCache[i];
				if (oneTuneOff.length == 0) {
					me.writeNoteOffEvent(trackByteArrayOutputStream, timeDeltaWithPrevious, channel, oneTuneOff.pitch);
					if (oneTuneOff.glissando != 0) { //stop bend
						me.writeWheelEvent(trackByteArrayOutputStream, 0, channel, 0x0000);
					}
					timeDeltaWithPrevious = 0;
				}
				oneTuneOff.length = oneTuneOff.length - 1;
			}
			var t = new Array();
			for (var i = 0; i < oneTuneCache.length; i++) { //cleanup
				var oneTuneOff = oneTuneCache[i];
				if (oneTuneOff.length > -1) {
					t.push(oneTuneOff);
				}
			}
			oneTuneCache = t;
			var one = me.noteChord(storeTracks,step,channel);
			var tuneCountAtCurrentStep = one.length;
			//var tuneCountAtCurrentStep = flated.tune[step].length; //songData.getTuneCount(step);
			
			for (var i = 0; i < tuneCountAtCurrentStep; i++) { //add
				//var iOneTune = flated.tune[step][i]; //songData.tune(step, i);
				var iOneTune = one[i]; //songData.tune(step, i);
				//console.log(flated.tune[step]);
				//if (iOneTune.midi == instrument) {
					//console.log(iOneTune);
					me.writeNoteOnEvent5(trackByteArrayOutputStream, timeDeltaWithPrevious, channel, iOneTune.pitch+36, 127);
					timeDeltaWithPrevious = 0;
					var forCache = {};
					forCache.pitch = iOneTune.pitch;
					forCache.length = iOneTune.length;
					forCache.glissando = iOneTune.shift;
					if (forCache.glissando != 0) { //add bend
						forCache.tStep = (0.0 - (forCache.glissando * me.bendStep) / (forCache.length + 1.0));
					}
					oneTuneCache.push(forCache);
				//}
			}
			var noBend = true;
			for (var i = 0; i < oneTuneCache.length; i++) { //bend
				var oneTuneOff = oneTuneCache[i];
				if (oneTuneOff.glissando != 0) {
					noBend = false;
					oneTuneOff.tCurrent = oneTuneOff.tCurrent + oneTuneOff.tStep / 2;
					if (oneTuneOff.tCurrent > 0x1fff) {
						oneTuneOff.tCurrent = 0x1fff;
					}
					if (oneTuneOff.tCurrent < -0x1fff) {
						oneTuneOff.tCurrent = -0x1fff;
					}
					me.writeWheelEvent(trackByteArrayOutputStream, timeDeltaWithPrevious, channel, oneTuneOff.tCurrent);
					timeDeltaWithPrevious = 0;
				}
			}
			if (noBend) {
				//
			} else {
				timeDeltaWithPrevious = timeDeltaWithPrevious + me.S32;
				for (var i = 0; i < oneTuneCache.length; i++) { //bend
					var oneTuneOff = oneTuneCache[i];
					if (oneTuneOff.glissando != 0) {
						noBend = false;
						oneTuneOff.tCurrent = oneTuneOff.tCurrent + oneTuneOff.tStep / 2;
						if (oneTuneOff.tCurrent > 0x1fff) {
							oneTuneOff.tCurrent = 0x1fff;
						}
						if (oneTuneOff.tCurrent < -0x1fff) {
							oneTuneOff.tCurrent = -0x1fff;
						}
						me.writeWheelEvent(trackByteArrayOutputStream, timeDeltaWithPrevious, channel, oneTuneOff.tCurrent);
						timeDeltaWithPrevious = 0;
					}
				}
			}
			if (noBend) {
				timeDeltaWithPrevious = timeDeltaWithPrevious + me.S16;
			} else {
				timeDeltaWithPrevious = timeDeltaWithPrevious + me.S32;
			}
		}
		for (var i = 0; i < oneTuneCache.length; i++) { //delete last
			var oneTuneOff = oneTuneCache[i];
			if (oneTuneOff.length == 0) {
				me.writeNoteOffEvent(trackByteArrayOutputStream, timeDeltaWithPrevious, channel, oneTuneOff.pitch);
				if (oneTuneOff.tStep != 0) { //stop bend
					me.writeWheelEvent(trackByteArrayOutputStream, 0, channel, 0x0000);
				}
				timeDeltaWithPrevious = 0;
			} else {
				oneTuneOff.length = oneTuneOff.length - 1;
			}
		}
		me.writeTrackFooter(trackByteArrayOutputStream);
		//byte[] trackBytes = trackByteArrayOutputStream.toByteArray();
		me.writeTrackLength(midi, trackByteArrayOutputStream.length);
		//midi.write(trackBytes, 0, trackBytes.length);
		me.append(midi, trackByteArrayOutputStream);
		//console.log(midi,trackByteArrayOutputStream);
		//return 0;
	};
	me.append = function (to, from) {
		for (var ax = 0; ax < from.length; ax++) {
			to.push(from[ax]);
		}
	};
	me.addMidi = function (arr, midi) {
		//console.log(midi);
		for (var i = 0; i < arr.length; i++) {
			var t = arr[i];
			if (t.midi == midi) {
				return;
			}
		}
		var o = {};
		o.midi = midi;
		var c = arr.length;
		if (c == 9) {
			c = 10;
		}
		o.channel = c;
		arr.push(o);
		//console.log(arr);
	};
	me.flate = function (song) {
		var beatChords = new Array();
		var tuneChords = new Array();
		var channelArray = new Array();
		var p = toolbox.findOrCreatePositionXY(song, 0, 0);
		var c16 = 0;
		var cust = 0;
		do {
			//console.log(c16,song.meter,p);
			for (var m = 0; m < song.meter; m++) {
				//console.log(c16,p);
				beatChords[c16] = new Array();
				tuneChords[c16] = new Array();
				for (var r = 0; r < p.riffIds.length; r++) {
					var songRiff = toolbox.findRiffById(p.riffIds[r], song);
					var chord = songRiff.beat[cust];
					if (chord != null) {
						for (var i = 0; i < chord.length; i++) {
							var songRiffBeatPoint = chord[i];
							var songSample = toolbox.findSampleById(songRiffBeatPoint.sampleId, song);
							beatChords[c16].push(songSample.midi);
							//console.log("set",c16,beatChords.length,songSample.midi);
							//me.addMixDrum(toolbox.findSampleById(songRiffBeatPoint.sampleId, me.mixSong));
						}
					}
					for (var t = 0; t < songRiff.tunes.length; t++) {
						var songRiffTune = songRiff.tunes[t];
						var chord = songRiffTune.steps[cust];
						if (chord != null) {
							for (var i = 0; i < chord.length; i++) {
								var songRiffTunePoint = chord[i];
								var songSample = toolbox.findSampleById(songRiffTune.sampleId, song);
								//this.addMixInstrument(songSample, songRiffTunePoint);
								var o = {};
								o.midi = songSample.midi;
								o.pitch = songRiffTunePoint.pitch;
								o.length = songRiffTunePoint.length;
								o.shift = songRiffTunePoint.shift;
								tuneChords[c16].push(o);
								me.addMidi(channelArray, o.midi);
							}
						}
					}
				}
				c16++;
				cust++;
			}
			cust = 0;
			p = toolbox.nextPosition(song, p.left, p.top);
		} while (p.left != 0 || p.top != 0);
		//console.log("return",c16,beatChords.length);
		var flated = {};
		flated.beat = beatChords;
		flated.tune = tuneChords;
		flated.channels = channelArray;
		return flated;
	};
	/*
	me.songUsedIntstruments = function (song) {
	return new Array();
	};*/
	me.compile = function (song) {
		console.log("compile start");
		var flated = me.flate(song);
		/*for(var i=0;i<flated.length;i++){
		console.log(i,flated[i]);
		}*/
		//console.log("flated", flated);
		var midi = new Array();
		//var uses = me.songUsedIntstruments(song);
		me.writeSongHeader(midi);
		//console.log("header",midi);
		me.writeTrackCount(midi, flated.channels.length + 1);
		//console.log("count",midi);
		me.writeTicksPerQuarter(midi, me.S_4);
		//console.log(midi);
		me.writeDrumTrack(song, flated.beat, midi);

		for (var i = 0; i < flated.channels.length; i++) {
			me.writeInstrumentsTrack(flated.channels[i].midi, flated.channels[i].channel, flated, midi);
		}

		//console.log("midi", midi);
		console.log("compile done");
		//me.writeTempoEvent(midi, 0, song.tempo);
		//console.log("after writeTempoEvent",midi);
		return midi;
	};
	
	me.compileSong=function(storeDrums,storeTracks){
		var midi = new Array();
		me.writeSongHeader(midi);
		me.writeTrackCount(midi, 9);
		me.writeTicksPerQuarter(midi, me.S_4);
		me.writeStateDrumTrack(storeDrums, midi);
		for (var i = 0; i < 8; i++) {
			me.writeStateInstrumentsTrack(storeTracks, i, midi);
		}
		return midi;
	}
	me.exportMidi = function (storeDrums,storeTracks){//song) {
		var midi = me.compileSong(storeDrums,storeTracks);//me.compile(song);
		var arrayBuffer = new ArrayBuffer(midi.length);
		var dataView = new DataView(arrayBuffer);
		for (var i = 0; i < midi.length; i++) {
			dataView.setUint8(i, midi[i]);
		}
		saveAs(new Blob([arrayBuffer], {
				type : "application/x-midi"
			}), "export.mid");
		//window.open("data:application/x-midi;charset=utf-8," + "test", "export.mid");
	};
	me.saveFileAs=function(blob,name){
		saveAs(blob,name);
	};
	return me;
}

/*
function ArrStream(){
var me=this;
me.array=new Array();
me.write=function(b){
me.array.push(b);
};
return me;
}
 */
/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 2015-03-04
 *
 * By Eli Grey, http://eligrey.com
 * License: X11/MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js
saveAs(new Blob([arrayBuffer], {
type : "application/x-midi"
}), "export.mid");
 */

var saveAs = saveAs
	// IE 10+ (native saveAs)
	 || (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob && navigator.msSaveOrOpenBlob.bind(navigator))
	// Everyone else
	 || (function (view) {
		"use strict";
		// IE <10 is explicitly unsupported
		if (typeof navigator !== "undefined" &&
			/MSIE [1-9]\./.test(navigator.userAgent)) {
			return;
		}
		var doc = view.document // only get URL when necessary in case Blob.js hasn't overridden it yet
	,
		get_URL = function () {
			return view.URL || view.webkitURL || view;
		} //
	,
		save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a") //
	,
		can_use_save_link = "download" in save_link //
	,
		click = function (node) {
			var event = doc.createEvent("MouseEvents");
			event.initMouseEvent(
				"click", true, false, view, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			node.dispatchEvent(event);
		} //
	,
		webkit_req_fs = view.webkitRequestFileSystem //
	,
		req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem //
	,
		throw_outside = function (ex) {
			(view.setImmediate || view.setTimeout)(function () {
				throw ex;
			}, 0);
		} //
	,
		force_saveable_type = "application/octet-stream" //
	,
		fs_min_size = 0
			// See https://code.google.com/p/chromium/issues/detail?id=375297#c7 and
			// https://github.com/eligrey/FileSaver.js/commit/485930a#commitcomment-8768047
			// for the reasoning behind the timeout and revocation flow
	,
		arbitrary_revoke_timeout = 500 // in ms
	,
		revoke = function (file) {
			var revoker = function () {
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			};
			if (view.chrome) {
				revoker();
			} else {
				setTimeout(revoker, arbitrary_revoke_timeout);
			}
		} //
	,
		dispatch = function (filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		} //
	,
		FileSaver = function (blob, name) {
			// First try a.download, then web filesystem, then object URLs
			var
			filesaver = this,
			type = blob.type,
			blob_changed = false,
			object_url,
			target_view,
			dispatch_all = function () {
				dispatch(filesaver, "writestart progress write writeend".split(" "));
			}
			// on any filesys errors revert to saving with object URLs
		,
			fs_error = function () {
				// don't create more object URLs than needed
				if (blob_changed || !object_url) {
					object_url = get_URL().createObjectURL(blob);
				}
				if (target_view) {
					target_view.location.href = object_url;
				} else {
					var new_tab = view.open(object_url, "_blank");
					if (new_tab == undefined && typeof safari !== "undefined") {
						//Apple do not allow window.open, see http://bit.ly/1kZffRI
						view.location.href = object_url
					}
				}
				filesaver.readyState = filesaver.DONE;
				dispatch_all();
				revoke(object_url);
			} //
		,
			abortable = function (func) {
				return function () {
					if (filesaver.readyState !== filesaver.DONE) {
						return func.apply(this, arguments);
					}
				};
			} //
		,
			create_if_not_found = {
				create : true,
				exclusive : false
			} //
		,
			slice;
			filesaver.readyState = filesaver.INIT;
			if (!name) {
				name = "download";
			}
			if (can_use_save_link) {
				object_url = get_URL().createObjectURL(blob);
				save_link.href = object_url;
				save_link.download = name;
				click(save_link);
				filesaver.readyState = filesaver.DONE;
				dispatch_all();
				revoke(object_url);
				return;
			}
			// prepend BOM for UTF-8 XML and text/plain types
			if (/^\s*(?:text\/(?:plain|xml)|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
				blob = new Blob(["\ufeff", blob], {
						type : blob.type
					});
			}
			// Object and web filesystem URLs have a problem saving in Google Chrome when
			// viewed in a tab, so I force save with application/octet-stream
			// http://code.google.com/p/chromium/issues/detail?id=91158
			// Update: Google errantly closed 91158, I submitted it again:
			// https://code.google.com/p/chromium/issues/detail?id=389642
			if (view.chrome && type && type !== force_saveable_type) {
				slice = blob.slice || blob.webkitSlice;
				blob = slice.call(blob, 0, blob.size, force_saveable_type);
				blob_changed = true;
			}
			// Since I can't be sure that the guessed media type will trigger a download
			// in WebKit, I append .download to the filename.
			// https://bugs.webkit.org/show_bug.cgi?id=65440
			if (webkit_req_fs && name !== "download") {
				name = name + ".download";
			}
			if (type === force_saveable_type || webkit_req_fs) {
				target_view = view;
			}
			if (!req_fs) {
				fs_error();
				return;
			}
			fs_min_size += blob.size;
			req_fs(view.TEMPORARY, fs_min_size, abortable(function (fs) {
					fs.root.getDirectory("saved", create_if_not_found, abortable(function (dir) {
							var save = function () {
								dir.getFile(name, create_if_not_found, abortable(function (file) {
										file.createWriter(abortable(function (writer) {
												writer.onwriteend = function (event) {
													target_view.location.href = file.toURL();
													filesaver.readyState = filesaver.DONE;
													dispatch(filesaver, "writeend", event);
													revoke(file);
												};
												writer.onerror = function () {
													var error = writer.error;
													if (error.code !== error.ABORT_ERR) {
														fs_error();
													}
												};
												"writestart progress write abort".split(" ").forEach(function (event) {
													writer["on" + event] = filesaver["on" + event];
												});
												writer.write(blob);
												filesaver.abort = function () {
													writer.abort();
													filesaver.readyState = filesaver.DONE;
												};
												filesaver.readyState = filesaver.WRITING;
											}), fs_error);
									}), fs_error);
							};
							dir.getFile(name, {
								create : false
							}, abortable(function (file) {
									// delete file if it already exists
									file.remove();
									save();
								}), abortable(function (ex) {
									if (ex.code === ex.NOT_FOUND_ERR) {
										save();
									} else {
										fs_error();
									}
								}));
						}), fs_error);
				}), fs_error);
		} //
	,
		FS_proto = FileSaver.prototype //
	,
		saveAs = function (blob, name) {
			return new FileSaver(blob, name);
		};
		FS_proto.abort = function () {
			var filesaver = this;
			filesaver.readyState = filesaver.DONE;
			dispatch(filesaver, "abort");
		};
		FS_proto.readyState = FS_proto.INIT = 0;
		FS_proto.WRITING = 1;
		FS_proto.DONE = 2;

		FS_proto.error =
			FS_proto.onwritestart =
			FS_proto.onprogress =
			FS_proto.onwrite =
			FS_proto.onabort =
			FS_proto.onerror =
			FS_proto.onwriteend =
			null;

		return saveAs;
	}
		(
			typeof self !== "undefined" && self
			 || typeof window !== "undefined" && window
			 || this.content) //
	);
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module.exports) {
	module.exports.saveAs = saveAs;
} else {
	if ((typeof define !== "undefined" && define !== null) && (define.amd != null)) {
		define([], function () {
			return saveAs;
		});
	}
}
