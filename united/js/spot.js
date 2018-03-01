FretChordSheet.prototype.tileStaffNoteSpot = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	for (var x = 0; x < this.measures.length; x++) {
		var minfo = this.measureInfo(x);
		var octaveShift = minfo.shifts[me.upperTrackNum()] || 0;
		this.layerOctaves.renderGroup(mx + this.margins.sheetLeft
			, this.margins.sheetTop
			, (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize
			, 6 * 7 * 3 * this.tiler.tapSize
			, 'staffNoteOpts' + x, left, top, width, height, function (tg) {
				var alts = [
					me.keys[minfo.keys][0]
					, me.keys[minfo.keys][1]
					, me.keys[minfo.keys][2]
					, me.keys[minfo.keys][3]
					, me.keys[minfo.keys][4]
					, me.keys[minfo.keys][5]
					, me.keys[minfo.keys][6]
				];
				var altModeSharp = true;
				for (var i = 0; i < alts.length; i++) {
					if (alts[i] < 0) {
						altModeSharp = false;
						break;
					}
				}
				minfo.beats.sort(function (a, b) { return a.start192 - b.start192; });
				for (var b = 0; b < minfo.beats.length; b++) {
					var beat = minfo.beats[b];
					if (beat) {
						for (var c = 0; c < beat.chords.length; c++) {
							var o = me.trackOrder[c];
							if (o == 0) {
								var chord = beat.chords[c];
								if (chord) {
									for (var n = 0; n < chord.notes.length; n++) {
										var note = chord.notes[n];
										if (note) {
											//var yy = me.pitch2staffY(note.pitch, 0, 0, !altModeSharp);
											var yy = 6 * 7 - 7 * (note.octave - octaveShift) - note.step - 1;
											var xx = me.options.measureHeader + beat.start192 / 6;
											me.tileNoteTools(x, note, xx, yy, tg);
											//console.log(note, xx, yy, tg);
										}
									}
								}
							}
						}
					}
				}
			});
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
};

FretChordSheet.prototype.tileStaffSpot = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	var minfo = this.measureInfo(0);
	for (var x = 0; x <= this.measures.length; x++) {
		var d32 = 0;
		if (x < this.measures.length) {
			d32 = this.measures[x].duration4 * 8;
		} else {
			d32 = this.measures[x - 1].duration4 * 8;
		}
		this.layerOctaves.renderGroup(mx + this.margins.sheetLeft + this.options.measureHeader * 3 * this.tiler.tapSize
			, this.margins.sheetTop //+ y * 3 * 12 * this.tiler.tapSize
			, (this.options.measureHeader + d32) * 3 * this.tiler.tapSize - this.options.measureHeader * 3 * this.tiler.tapSize
			, 7 * 6 * 3 * this.tiler.tapSize
			, 'staffMsrSpt' + x, left, top, width, height, function (tg) {
				var s = tg.layer.addSpot(tg.id, tg.x, tg.y, tg.w, tg.h, function () {
					var measure = me.measureInfo(this.morder);
					var _x = me.findMeasureBeat192(me.tiler.clickContentX, this.mx, measure);//this.minfo);
					var start192 = _x.quarter * 8 * 6 + _x.left6;
					var duration192 = _x.duration6;
					var yy = Math.floor((me.tiler.clickContentY - me.margins.sheetTop) / (3 * me.tiler.tapSize));
					var y7 = (7 * 6 - 1) - yy;
					//var pitch = 12 * Math.floor(y7 / 7) + me.note12(y7 % 7);
					var octaveShift = minfo.shifts[me.upperTrackNum()] || 0;
					//console.log(octaveShift,minfo.shifts);
					var octave = Math.floor(y7 / 7) + octaveShift;
					var step = y7 % 7;
					var accidental = me.keys[minfo.keys][step];
					var track = me.upperTrackNum();
					/*for (var k = 0; k < me.trackOrder.length; k++) {
						if (me.trackOrder[k] == 0) {
							track = k;
							break;
						}
					}*/
					if (me.markNotes.length >= me.options.markNotesCount) {
						me.markNotes.splice(0, 0, {
							minfo: measure
							, morder: this.morder
							, start192: start192
							, duration192: duration192
							//, pitch: pitch
							//, hintStep: y7
							, octave: octave
							, step: step
							, accidental: accidental
						});
						me.markNotes.sort(function (a, b) {
							return a.morder * 1000 + a.start192 - (b.morder * 1000 + b.start192);
						});
						var note = new MeasureToneNote();
						//note.pitch = me.markNotes[0].pitch;
						//note.hintStep = me.markNotes[0].hintStep;
						note.octave = me.markNotes[0].octave;
						note.step = me.markNotes[0].step;
						note.accidental = me.markNotes[0].accidental;
						for (var mm = 1; mm < me.markNotes.length; mm++) {
							var from = me.markNotes[mm - 1];
							var to = me.markNotes[mm];
							var fullTo192 = me.findBeatDistance(me.markNotes[0].morder, me.markNotes[0].start192, to.morder, to.start192);
							var shift = me.octaveStepAccidental(from.octave, from.step, from.accidental) - me.octaveStepAccidental(to.octave, to.step, to.accidental);
							note.slides.push({ shift: shift, end192: fullTo192 + to.duration192 });
						}
						me.userActionAddNote(track, me.markNotes[0].morder, me.markNotes[0].start192, note);
						me.markNotes = [];
						me.shrinkMeasures();
						me.reCalcContentSize();
					} else {
						if (me.markNotes.length > 0) {
							me.markNotes.push({
								minfo: me.measureInfo(this.morder)
								, morder: this.morder
								, start192: start192
								, duration192: duration192
								//, pitch: pitch
								//, hintStep: y7
								, octave: octave
								, step: step
								, accidental: accidental
							});
						} else {
							//console.log('check exists');
							var noteBeats = me.findNotes7(track, this.morder, start192, duration192, octave, step);
							if (noteBeats.length > 0) {
								//console.log('exists',noteBeats);
								me.userActionDropNotes7(track, this.morder, start192, duration192, octave, step)
							} else {
								me.markNotes.push({
									minfo: me.measureInfo(this.morder)
									, morder: this.morder
									, start192: start192
									, duration192: duration192
									//, pitch: pitch
									//, hintStep: y7
									, octave: octave
									, step: step
									, accidental: accidental
								});
							}
						}
					}
				});
				s.mx = tg.x;
				s.morder = x;
			});
		mx = mx + (this.options.measureHeader + d32) * 3 * this.tiler.tapSize;
	}
}
FretChordSheet.prototype.tilePianoNoteSpot = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	for (var x = 0; x < this.measures.length; x++) {
		var minfo = this.measureInfo(x);
		if (minfo) {
			for (var i = 0; i < 8; i++) {
				for (var trackNum = 0; trackNum < 8; trackNum++) {
					if (me.trackOrder[trackNum] == 7 - i) {
						me.tilePianMeasureNoteTools(x, minfo, mx, trackNum, left, top, width, height, lineWidth);
					}
				}
			}
		}
		mx = mx + (this.options.measureHeader + minfo.duration4 * 8) * 3 * this.tiler.tapSize;
	}
};
FretChordSheet.prototype.tilePianNoteToolButton = function (tg, x, y, measureNum, note) {
	var me = this;
	var vibratoLabel = '+';
	if (note.vibrato) {
		vibratoLabel = 'x ~~~';
	}
	var tk = me.tileKnob(tg, 'pianoVibrato_' + measureNum + '_' + x + 'x' + y
		, x - 0.5 * tg.layer.tapSize
		, y - 0.5 * tg.layer.tapSize
		, this.tiler.tapSize
		, vibratoLabel, function () {
			console.log(measureNum, note);
			me.userActionVibratoNote(measureNum, note);
		});
};
FretChordSheet.prototype.tilePianMeasureNoteTools = function (x, minfo, mx, trackNum, left, top, width, height, lineWidth) {
	var me = this;
	for (var y = 0; y < 6; y++) {
		this.layerNotes.renderGroup(mx + this.margins.sheetLeft + this.options.measureHeader * 3 * this.tiler.tapSize
			, this.margins.pianorollTop + y * 3 * 12 * this.tiler.tapSize
			, (this.options.measureHeader + minfo.duration4 * 8 - this.options.measureHeader) * 3 * this.tiler.tapSize
			, 12 * 3 * this.tiler.tapSize
			, 'pianoMeasureNoteTools' + trackNum + 'x' + x + 'x' + y, left, top, width, height, function (tg) {
				for (var b = 0; b < minfo.beats.length; b++) {
					var beat = minfo.beats[b];
					if (beat) {
						var chord = beat.chords[me.upperTrackNum()];
						//for (var c = 0; c < beat.chords.length; c++) {
						//	if (c == trackNum) {
						//		var chord = beat.chords[c];
						if (chord) {
							for (var n = 0; n < chord.notes.length; n++) {
								var note = chord.notes[n];
								if (note) {
									if (note.octave >= (5 - y) && note.octave < (6 - y)) {
										var tx1 = beat.start192 / 6 * 3 * tg.layer.tapSize - 0.0 * tg.layer.tapSize;
										var p = note.octave * 12 + me.note12(note.step) + note.accidental;
										var ty1 = (6 * 12 - p - 1) * 3 * tg.layer.tapSize + me.margins.pianorollTop + 3 * tg.layer.tapSize - tg.y;
										me.tilePianNoteToolButton(tg, tx1, ty1, x, note);
									}
								}
							}
						}
						//}
						//}
					}
				}
			});
	}
};
FretChordSheet.prototype.tileFretSpot = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	var minfo = this.measureInfo(0);
	for (var x = 0; x <= this.measures.length; x++) {
		var d32 = 0;
		if (x < this.measures.length) {
			d32 = this.measures[x].duration4 * 8;
		} else {
			d32 = this.measures[x - 1].duration4 * 8;
		}
		this.layerOctaves.renderGroup(mx + this.margins.sheetLeft + this.options.measureHeader * 3 * this.tiler.tapSize
			, this.margins.fretTop //+ y * 3 * 12 * this.tiler.tapSize
			, (this.options.measureHeader + d32) * 3 * this.tiler.tapSize - this.options.measureHeader * 3 * this.tiler.tapSize
			, (5 * 2 + 1) * 3 * this.tiler.tapSize
			, 'fretSpot_' + x, left, top, width, height, function (tg) {
				//console.log('fretSpot_' , x,tg.x,mx,me.options.measureHeader , d32);
				var s = tg.layer.addSpot(tg.id, tg.x, tg.y, tg.w, tg.h, function () {
					//console.log('clicked measure', this.morder, 'len', me.measures.length);
					var measure = me.measureInfo(this.morder);
					//console.log('now len', me.measures.length);
					var _x = me.findMeasureBeat192(me.tiler.clickContentX, this.mx, measure);//this.minfo);
					var start192 = _x.quarter * 8 * 6 + _x.left6;
					var duration192 = _x.duration6;
					var stringNo = Math.floor((me.tiler.clickContentY - me.margins.fretTop + 1 * me.tiler.tapSize) / (2 * 3 * me.tiler.tapSize));
					var fretNo = 0;
					//console.log('clickied',start192,yy);

					var track = me.upperTrackNum();
					if (me.fretMark) {
						var note = new MeasureToneNote();
						note.string = stringNo;
						note.fret = fretNo;
						var pitch = me.stringPitches[note.string] + note.fret;
						note.octave = 1 + Math.floor(pitch / 12);
						note.step = me.note7(pitch % 12);
						note.accidental = (pitch % 12) - me.note12(note.step);
						var cur192 = me.fretMark.start192;
						var end192 = start192 - me.fretMark.start192 + duration192;
						var curMeasureNo=me.fretMark.measureNo;
						var fullTo192 = me.findBeatDistance(me.fretMark.measureNo, me.fretMark.start192, this.morder, start192);
						console.log('fullTo192',fullTo192);
						if(fullTo192<0){
							fullTo192 = me.findBeatDistance( this.morder, start192,me.fretMark.measureNo, me.fretMark.start192);
							cur192 = start192;
							curMeasureNo=this.morder;
							console.log('flip');
						}
						/*if (start192 < me.fretMark.start192 + duration192) {
							cur192 = start192;
							end192 = me.fretMark.start192 - start192 + me.fretMark.duration192;
							curMeasureNo=this.morder;
						}*/
						note.slides.push({ shift: 0, end192: fullTo192+duration192 });
						//console.log(track,curMeasureNo,note);
						//me.userActionAddNote(track, curMeasureNo, cur192, note);
						me.showFretsMenu(track, curMeasureNo, cur192, note);
						
					} else {

						var noteBeats = me.findAllFrets(track, this.morder, start192, duration192, stringNo);
						//console.log('noteBeats',noteBeats);
						if (noteBeats.length > 0) {
							me.userActionDropStringNotes(track, this.morder, start192, duration192, stringNo);
						} else {
							me.fretMark = {
								start192: start192
								, duration192: duration192
								, stringNo: stringNo
								, fretNo: 0
								, measureNo: this.morder
							};
						}
					}

				});
				s.mx = tg.x;
				s.morder = x;
			});
		mx = mx + (this.options.measureHeader + d32) * 3 * this.tiler.tapSize;
	}



};
FretChordSheet.prototype.tilePianoSpot = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	var minfo = this.measureInfo(0);
	for (var x = 0; x <= this.measures.length; x++) {
		var d32 = 0;
		if (x < this.measures.length) {
			d32 = this.measures[x].duration4 * 8;
		} else {
			d32 = this.measures[x - 1].duration4 * 8;
		}
		for (var y = 0; y < 6; y++) {
			this.layerOctaves.renderGroup(mx + this.margins.sheetLeft + this.options.measureHeader * 3 * this.tiler.tapSize
				, this.margins.pianorollTop + y * 3 * 12 * this.tiler.tapSize
				, (this.options.measureHeader + d32) * 3 * this.tiler.tapSize - this.options.measureHeader * 3 * this.tiler.tapSize
				, 12 * 3 * this.tiler.tapSize
				, 'pianoOctave' + x + 'x' + y, left, top, width, height, function (tg) {
					var s = tg.layer.addSpot(tg.id, tg.x, tg.y, tg.w, tg.h, function () {
						var measure = me.measureInfo(this.morder);
						var _x = me.findMeasureBeat192(me.tiler.clickContentX, this.mx, measure);//this.minfo);
						var start192 = _x.quarter * 8 * 6 + _x.left6;
						var duration192 = _x.duration6;
						//var pitch = 59 - Math.floor((me.tiler.clickContentY - me.margins.pianorollTop) / (3 * me.tiler.tapSize));
						var yy = Math.floor((me.tiler.clickContentY - me.margins.pianorollTop) / (3 * me.tiler.tapSize));
						var y12 = (12 * 6 - 1) - yy;
						var octave = Math.floor(y12 / 12);
						var step = me.note7(y12 % 12);
						var accidental = (y12 % 12) - me.note12(step);
						//console.log(step,accidental,me.keys[minfo.keys],minfo.keys);
						if (accidental > 0) {
							//console.log(accidental);
							//me.keys[minfo.keys][0]
							if ((step == 0 || step == 1 || step == 3 || step == 4 || step == 5) && me.keys[minfo.keys][step + 1] < 0) {
								step = step + 1;
								accidental = -1;
							}
						}


						//console.log('pianoroll',octave,step,accidental);
						var track = me.upperTrackNum();
						/*for (var k = 0; k < me.trackOrder.length; k++) {
							if (me.trackOrder[k] == 0) {
								track = k;
								break;
							}
						}*/
						if (me.markNotes.length >= me.options.markNotesCount) {
							me.markNotes.splice(0, 0, {
								minfo: measure
								, morder: this.morder
								, start192: start192
								, duration192: duration192
								//, pitch: pitch 
								, octave: octave
								, step: step
								, accidental: accidental
							});
							me.markNotes.sort(function (a, b) {
								return a.morder * 1000 + a.start192 - (b.morder * 1000 + b.start192);
							});
							var note = new MeasureToneNote();
							//note.pitch = me.markNotes[0].pitch;
							note.octave = me.markNotes[0].octave;
							note.step = me.markNotes[0].step;
							note.accidental = me.markNotes[0].accidental;
							for (var mm = 1; mm < me.markNotes.length; mm++) {
								var from = me.markNotes[mm - 1];
								var to = me.markNotes[mm];
								var fullTo192 = me.findBeatDistance(me.markNotes[0].morder, me.markNotes[0].start192, to.morder, to.start192);
								//note.slides.push({ shift: from.pitch - to.pitch, end192: fullTo192 + to.duration192 });
								var shift = me.octaveStepAccidental(from.octave, from.step, from.accidental) - me.octaveStepAccidental(to.octave, to.step, to.accidental);
								note.slides.push({ shift: shift, end192: fullTo192 + to.duration192 });
							}
							me.userActionAddNote(track, me.markNotes[0].morder, me.markNotes[0].start192, note);
							me.markNotes = [];
							me.shrinkMeasures();
							me.reCalcContentSize();
						} else {
							if (me.markNotes.length > 0) {
								me.markNotes.push({
									minfo: me.measureInfo(this.morder)
									, morder: this.morder
									, start192: start192
									, duration192: duration192
									//, pitch: pitch 
									, octave: octave
									, step: step
									, accidental: accidental
								});
							} else {
								var p = me.octaveStepAccidental(octave, step, accidental);
								var noteBeats = me.findNotes(track, this.morder, start192, duration192, p);
								if (noteBeats.length > 0) {
									//me.userActionDropNotes(track, this.morder, start192, duration192, pitch)
									me.userActionDropNotes(track, this.morder, start192, duration192, p);
									//console.log(p);
								} else {
									me.markNotes.push({
										minfo: me.measureInfo(this.morder)
										, morder: this.morder
										, start192: start192
										, duration192: duration192
										//, pitch: pitch 
										, octave: octave
										, step: step
										, accidental: accidental
									});
								}
							}
						}

					});
					s.mx = tg.x;
					s.morder = x;
				});
		}
		mx = mx + (this.options.measureHeader + d32) * 3 * this.tiler.tapSize;
	}
};



FretChordSheet.prototype.tileDrumSpot = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	var minfo = this.measureInfo(0);
	for (var x = 0; x <= this.measures.length; x++) {
		var d32 = 0;
		if (x < this.measures.length) {
			d32 = this.measures[x].duration4 * 8;
		} else {
			d32 = this.measures[x - 1].duration4 * 8;
		}
		this.layerOctaves.renderGroup(mx + this.margins.sheetLeft + this.options.measureHeader * 3 * this.tiler.tapSize
			, this.margins.drumsTop //+ y * 3 * 12 * this.tiler.tapSize
			, (this.options.measureHeader + d32) * 3 * this.tiler.tapSize - this.options.measureHeader * 3 * this.tiler.tapSize
			, 8 * 3 * this.tiler.tapSize
			, 'sptDrms' + x, left, top, width, height, function (tg) {
				var s = tg.layer.addSpot(tg.id, tg.x, tg.y, tg.w, tg.h, function () {
					var measure = me.measureInfo(this.morder);
					var _x = me.findMeasureBeat192(me.tiler.clickContentX, this.mx, measure);//this.minfo);
					console.log('moreder', this.morder, 'measureX', this.mx, 'contentX', me.tiler.clickContentX, _x);
					var start192 = _x.quarter * 8 * 6 + _x.left6;
					var duration192 = _x.duration6;
					var drum = Math.floor((me.tiler.clickContentY - me.margins.drumsTop) / (3 * me.tiler.tapSize));
					var noteDrums = me.findDrums(this.morder, start192, duration192, drum);
					if (noteDrums.length > 0) {
						me.userActionDropDrums(this.morder, start192, duration192, drum);
					} else {
						me.userActionAddDrum(this.morder, start192, drum);
					}
				});
				s.mx = tg.x;
				s.morder = x;
			});
		mx = mx + (this.options.measureHeader + d32) * 3 * this.tiler.tapSize;
	}
};
