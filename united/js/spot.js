FretChordSheet.prototype.tileStaffNoteSpot = function (left, top, width, height, lineWidth) {
	var me = this;
	var mx = 0;
	for (var x = 0; x < this.measures.length; x++) {
		var minfo = this.measureInfo(x);
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
											var yy = me.pitch2staffY(note.pitch, 0, 0, !altModeSharp);
											var xx = me.options.measureHeader + beat.start192 / 6;
											me.tileNoteTools(note, xx, yy, tg);
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
					var octave = Math.floor(y7 / 7);
					var step = y7 % 7;
					var accidental = 0;
					var track = -1;
					for (var k = 0; k < me.trackOrder.length; k++) {
						if (me.trackOrder[k] == 0) {
							track = k;
							break;
						}
					}
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
							var noteBeats = me.findNotes7(track, this.morder, start192, duration192, octave, step);
							if (noteBeats.length > 0) {
								me.userActionDropNotes(track, this.morder, start192, duration192, pitch)
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
		for (var y = 0; y < 5; y++) {
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
						var y12 = (12 * 5 - 1) - yy;
						var octave = Math.floor(y12 / 12);
						var step = me.note7(y12 % 12);
						var accidental = (y12 % 12)-me.note12(step);
						//console.log('pianoroll',octave,step,accidental);
						var track = -1;
						for (var k = 0; k < me.trackOrder.length; k++) {
							if (me.trackOrder[k] == 0) {
								track = k;
								break;
							}
						}
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
								var p=me.octaveStepAccidental(octave,step,accidental);
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
