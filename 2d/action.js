RiffShare2D.prototype.addButton = function (id, label, fontSize, g, x, y, s, isStickX, lineWidth, action, toZoom) {
	if (lineWidth) {
		this.tileCircle(g, x + s / 2, y + s / 2, s / 2, 'none', this.colorAction, lineWidth);
	} else {
		this.tileCircle(g, x + s / 2, y + s / 2, s / 2, this.colorAction);
	}
	this.tileText(g, x + s / 4, y + s * 0.9, fontSize, label, this.colorComment);
	var s = this.addSpot(id, x, y, s, s, action, isStickX, toZoom);
	//console.log(s);
	return s;
};

RiffShare2D.prototype.addSpot = function (id, x, y, w, h, a, stickX, toZoom) {
	this.dropSpot(id);
	var spot = {
		id : id,
		x : x,
		y : y,
		w : w,
		h : h,
		a : a,
		sx : stickX,
		tz : toZoom
	};
	//if (stickX) {}
	this.spots.push(spot);
	return spot;
};
RiffShare2D.prototype.findSpot = function (id) {
	for (var i = 0; i < this.spots.length; i++) {
		if (this.spots[i].id == id) {
			return this.spots[i];
		}
	}
	return null;
};
RiffShare2D.prototype.dropSpot = function (id) {
	for (var i = 0; i < this.spots.length; i++) {
		if (this.spots[i].id == id) {
			this.spots.splice(i, 1);
			break;
		}
	}
};
RiffShare2D.prototype.clearSpots = function () {
	this.spots = [];
};
RiffShare2D.prototype.runSpots = function (x, y) {
	//console.log('runSpots', this.spots);
	var needRedraw = false;
	for (var i = 0; i < this.spots.length; i++) {
		var spot = this.spots[i];
		var checkX = spot.x;
		var checkY = spot.y;
		if (spot.sx) {
			checkX = spot.x + this.stickedX;
		}
		//console.log(x, y, 1, 1, checkX, checkY, spot.w, spot.h);
		if (this.collision(x, y, 1, 1, checkX, checkY, spot.w, spot.h)) {
			//console.log('spot', spot);
			if (spot.a) {
				spot.a();
			}
			if (spot.tz < this.translateZ && spot.tz > 0) {
				//console.log('slide spot', spot);

				var tox = -checkX;
				if (spot.sx) {
					//console.log(tox, spot.x);
					if (-tox > spot.x) {

						tox = this.translateX; //-spot.x;//
						//console.log('rest');
					} else {
						tox = -spot.x;
						//console.log('left');
					}
				}
				this.startSlideTo(tox, -checkY, spot.tz);
			} else {
				//this.startSlideTo(0,0,5);
				needRedraw = true;
			}
		}
	}
	/*if (this.menuFog) {
	this.hideMenu();
	} else {
	this.showMenu();
	}*/
	if (needRedraw) {
		this.resetAllLayersNow();
	}
};
RiffShare2D.prototype.showMenu = function (title, items) {
	//this.removeMenu();
	//this.menuInfo={x:x,y:y,r:this.translateZ};
	//console.log(this.translateZ);
	this.menuTitleSpan.innerText = title;

	var tbody = this.menuTable.tBodies[0];
	while (tbody.rows.length > 0) {
		tbody.deleteRow(0);
	}
	this.currentMenuActions = [];
	for (var i = 0; i < items.length; i++) {
		var row = tbody.insertRow(0);
		var cell = row.insertCell(0);
		this.currentMenuActions.push(items[i]);
		cell.innerHTML = '<a href="javascript:riffShare2d.popAction(' + i + ');"><div><nobr>' + items[i].title + '</nobr></div></a>';
	}
	/*
	var row = tbody.insertRow(0);
	var cell = row.insertCell(0);
	cell.innerHTML = '<a href="javascript:riffShare2d.hideMenu();"><div><nobr>'+'test 333'+'</nobr></div></a>';
	row = tbody.insertRow(0);
	cell = row.insertCell(0);
	cell.innerHTML = '<a href="javascript:riffShare2d.hideMenu();"><div><nobr>'+'test 222'+'</nobr></div></a>';
	row = tbody.insertRow(0);
	cell = row.insertCell(0);
	cell.innerHTML = '<a href="javascript:riffShare2d.hideMenu();"><div><nobr>'+'test 111'+'</nobr></div></a>';
	 */

	this.menuDiv.style.visibility = "visible";
	this.menuDiv.scrollTop = 0;
	this.menuFog = true;
};
RiffShare2D.prototype.popAction = function (nn) {

	this.hideMenu();
	var a = this.currentMenuActions[nn];
	console.log('popAction', nn, a);
	a.action();

};
/*
RiffShare2D.prototype.tileMainMenu = function (layer, left, top, width, height, detailRatio) {
var x = 30 * this.tapSize;
var y = 30 * this.tapSize;
var w = 13 * this.tapSize;
var h = 13 * this.tapSize;
var id = 'buttonMainMenu';
var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
if (g) {
this.tileCircle(g, x + w / 2, y + w / 2, w / 2, this.colorAction, this.colorAction, this.lineWidth * detailRatio);
this.addSpot('optControlsSpot', x, y, w, h, function () {
riffShare2d.showMenu('Song', [{
title : 'open example 1',
action : function () {
//alert('qwerty');
window.location.href = 'song.html';
}
}, {
title : 'open example 2',
action : function () {
window.location.href = 'song2.html';
}
}, {
title : 'open example 3',
action : function () {
window.location.href = 'song3.html';
}
}, {
title : 'open example 4',
action : function () {
window.location.href = 'song4.html';
}
}, {
title : 'open example 5',
action : function () {
window.location.href = 'song5.html';
}
}, {
title : 'open example 6',
action : function () {
window.location.href = 'song6.html';
}
}, {
title : 'open example 7',
action : function () {
window.location.href = 'song7.html';
}
}, {
title : 'open example 8',
action : function () {
window.location.href = 'song8.html';
}
}, {
title : 'open example 9',
action : function () {
window.location.href = 'song9.html';
}
}, {
title : 'open example 10',
action : function () {
window.location.href = 'song10.html';
}
}, {
title : 'open example 11',
action : function () {
window.location.href = 'song11.html';
}
}, {
title : 'open example test',
action : function () {
window.location.href = 'testsong.html';
}
}, {
title : 'change title',
action : function () {
var r = prompt('Song title', riffShare2d.currentSong.name);
if (r) {
riffShare2d.currentSong.name = r;
}
riffShare2d.resetAllLayersNow();
}
}, {
title : 'new song',
action : function () {
var r = confirm('Create new song');
if (r) {
riffShare2d.currentSong = riffShare2d.emptySong();
}
riffShare2d.resetAllLayersNow();
}
}, {
title : 'save current song',
action : function () {
saveObject2localStorage('currentSong', riffShare2d.currentSong);
}
}
]);
});

}

x = 30 * this.tapSize;
y = this.calculateRollGridY();
w = 13 * this.tapSize;
h = 13 * this.tapSize;
id = 'buttonHideRoll';
var lw = 4 * this.lineWidth * detailRatio;
g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
if (g) {
this.addButton('hideRoll', 'Pianoroll', h / 4, g, 0 * (1.2 * h) + x, y, h, true //, riffShare2d.currentSong.hideRoll ? lw : 0 //, function () {
riffShare2d.currentSong.hideRoll = !(!(!(riffShare2d.currentSong.hideRoll)));
});
}
};*/
RiffShare2D.prototype.hideMenu = function () {
	/*if(this.overlayGroup.children.length>0){
	this.overlayGroup.removeChild(this.overlayGroup.children[0]);
	}
	this.menuInfo=null;*/
	this.menuDiv.style.visibility = "hidden";
	this.menuFog = false;
};

RiffShare2D.prototype.promptNewSong = function () {
var r = confirm('Create new song');
if (r) {
	this.setSong(this.emptySong());
//riffShare2d.currentSong = riffShare2d.emptySong();
}
//riffShare2d.resetAllLayersNow();
};
RiffShare2D.prototype.promptChangeSongTitle = function () {
	var r = prompt('Song title', riffShare2d.currentSong.name);
	if (r) {
		//riffShare2d.currentSong.name = r;
		riffShare2d.redoSongTitleChange(r);
	}
};
RiffShare2D.prototype.promptDropChannel = function (channel) {
	var ok = confirm('Drop channel ' + channel.track);
	if (ok) {
		riffShare2d.redoDropChannel(channel);
	}
};
RiffShare2D.prototype.promptDropMeasure = function (nn) {
	var ok = confirm('Drop measure ' + (nn + 1));
	if (ok) {
		riffShare2d.redoDeleteMeasure(nn);
	}
};
RiffShare2D.prototype.promptAddNewChannel = function () {
	var r = prompt('Channel title', '');
	if (r) {
		var c = {
			id : Math.floor(Math.random() * 100000),
			program : 0,
			offset : 0,
			track : r,
			channel : 'Default',
			volumes : [{
					position : 0,
					value : 127
				}
			],
			string : [{
					order : 1,
					pitch : 64
				}, {
					order : 2,
					pitch : 59
				}, {
					order : 3,
					pitch : 55
				}, {
					order : 4,
					pitch : 50
				}, {
					order : 5,
					pitch : 45
				}, {
					order : 6,
					pitch : 40
				}
			],
			equalizer : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		};
		riffShare2d.redoAddNewChannel(c);
	}
};

RiffShare2D.prototype.promptImportSong = function () {
	window.location.href = 'file.html';
	/*
	riffShare2d.showMenu('Import song', [{
				title : 'open example 1',
				action : function () {
					//alert('qwerty');
					window.location.href = 'song.html';
				}
			}, {
				title : 'open example 2',
				action : function () {
					window.location.href = 'song2.html';
				}
			}, {
				title : 'open example 3',
				action : function () {
					window.location.href = 'song3.html';
				}
			}, {
				title : 'open example 4',
				action : function () {
					window.location.href = 'song4.html';
				}
			}, {
				title : 'open example 5',
				action : function () {
					window.location.href = 'song5.html';
				}
			}, {
				title : 'open example 6',
				action : function () {
					window.location.href = 'song6.html';
				}
			}, {
				title : 'open example 7',
				action : function () {
					window.location.href = 'song7.html';
				}
			}, {
				title : 'open example 8',
				action : function () {
					window.location.href = 'song8.html';
				}
			}, {
				title : 'open example 9',
				action : function () {
					window.location.href = 'song9.html';
				}
			}, {
				title : 'open example 10',
				action : function () {
					window.location.href = 'song10.html';
				}
			}, {
				title : 'open example 11',
				action : function () {
					window.location.href = 'song11.html';
				}
			}, {
				title : 'open example test',
				action : function () {
					window.location.href = 'testsong.html';
				}
			}, {
				title : 'Import from MXML',
				action : function () {
					window.location.href = 'mxml.html';
				}
			}
		]);
		*/
};

RiffShare2D.prototype.showUndoMenu = function () {
	var items = [];
	for (var i = 0; i < this.undoQueue.length; i++) {
		var a = {};
		//console.log('for',i, this.undoQueue[i].caption);

		a.title = this.undoQueue[i].caption;
		a.nn = i;
		a.action = function () {
			//console.log('select',this);
			riffShare2d.makeUndo(this.nn);
		};
		//console.log('add',a);
		items.push(a);
	}
	riffShare2d.showMenu('Undo', items);
};
RiffShare2D.prototype.makeUndo = function (level) {
	console.log('makeUndo', level);
	var last = null;
	for (var i = this.undoQueue.length - 1; i >= level; i--) {
		var u = this.undoQueue.pop();
		//console.log(u);
		u.undo();
		last = u;
	}
	if (last) {
		this.resetAllLayersNow();
		this.startSlideTo(last.x, last.y, last.z);
	}
};
RiffShare2D.prototype.setUndoStatus = function () {
	if (this.undoStep < this.undoQueue.length) {
		document.getElementById('redoimg').src = "redo2.png";
	} else {
		document.getElementById('redoimg').src = "redo.png";
	}
	if (this.undoStep > 0) {
		document.getElementById('undoimg').src = "undo2.png";
	} else {
		document.getElementById('undoimg').src = "undo.png";
	}
	console.log('setUndoStatus', this.undoStep, this.undoQueue.length);
};
RiffShare2D.prototype.redoNext = function () {
	if (this.undoStep < this.undoQueue.length) {
		var a = this.undoQueue[this.undoStep];
		console.log('redo', a.caption);
		a.redo();
		this.undoStep++;
		this.resetAllLayersNow();
		this.startSlideTo(a.x, a.y, a.z);
		/*if (!(this.undoStep < this.undoQueue.length)) {
		document.getElementById('redoimg').src = "redo.png";
		}
		if (this.undoStep > 0) {
		document.getElementById('undoimg').src = "undo2.png";
		}*/
		this.setUndoStatus();
	}
};
RiffShare2D.prototype.undoLast = function () {
	if (this.undoStep > 0) {
		//var a=this.undoQueue.pop();
		this.undoStep--;
		var a = this.undoQueue[this.undoStep];
		console.log('undo', a.caption);
		a.undo();
		this.resetAllLayersNow();
		this.startSlideTo(a.x, a.y, a.z);
		this.setUndoStatus();
	}
	/*if (this.undoStep < 1) {
	document.getElementById('undoimg').src = "undo.png";
	}
	if (this.undoStep < this.undoQueue.length) {
	document.getElementById('redoimg').src = "redo2.png";
	}*/
};
RiffShare2D.prototype.pushConfirmedAction = function (action) {};
RiffShare2D.prototype.pushAction = function (action) {
	console.log('pushAction', action.caption);
	action.x = this.translateX;
	action.y = this.translateY;
	action.z = this.translateZ;
	action.redo();
	var rm = this.undoQueue.length - this.undoStep;
	for (var i = 0; i < rm; i++) {
		this.undoQueue.pop();
	}
	this.undoQueue.push(action);
	this.undoStep++;
	rm = this.undoQueue.length - this.undoSize;
	for (var i = 0; i < rm; i++) {
		this.undoQueue.shift();
		this.undoStep--;
	}
	this.setUndoStatus();
	/*if (this.undoStep > 0) {
	document.getElementById('undoimg').src = "undo2.png";
	}
	if (this.undoStep == this.undoQueue.length) {
	document.getElementById('redoimg').src = "redo.png";
	}*/
	//console.log(this.undoStep, this.undoQueue);
};
RiffShare2D.prototype.redoSongTitleChange = function (toTitle) {
	var fromTitle = this.currentSong.name;
	riffShare2d.pushAction({
		caption : 'Set song title to ' + toTitle,
		undo : function () {
			riffShare2d.currentSong.name = fromTitle;
		},
		redo : function () {
			riffShare2d.currentSong.name = toTitle;
		}
	});
};
RiffShare2D.prototype.redoSelectChannel = function (n) {
	riffShare2d.pushAction({
		caption : 'Select track ' + n + '/' + riffShare2d.currentSong.channels[n].track,
		undo : function () {
			var c = riffShare2d.currentSong.channels.pop();
			riffShare2d.currentSong.channels.splice(n, 0, c);
		},
		redo : function () {
			var c = riffShare2d.currentSong.channels.splice(n, 1)[0];
			riffShare2d.currentSong.channels.push(c);
			riffShare2d.startSlideTo(riffShare2d.translateX, -riffShare2d.calculateTrackY(riffShare2d.currentSong.channels.length - 1), riffShare2d.minZoomHuge * 0.9);
		}
	});
};
RiffShare2D.prototype.redoTogglePianoroll = function (n) {
	riffShare2d.pushAction({
		caption : 'Toggle pianoroll',
		undo : function () {
			riffShare2d.currentSong.hideRoll = !(!(!(riffShare2d.currentSong.hideRoll)));
		},
		redo : function () {
			riffShare2d.currentSong.hideRoll = !(!(!(riffShare2d.currentSong.hideRoll)));
		}
	});
};
RiffShare2D.prototype.redoChannelTitleChange = function (channel, fromTitle, toTitle) {
	riffShare2d.pushAction({
		caption : 'Set channel title to ' + toTitle,
		undo : function () {
			channel.track = fromTitle;
		},
		redo : function () {
			channel.track = toTitle;
		}
	});
};
RiffShare2D.prototype.redoToggleChannelSheet = function (channel) {
	riffShare2d.pushAction({
		caption : 'Toggle sheet',
		undo : function () {
			channel.hideTrackSheet = !(!(!(channel.hideTrackSheet)));
		},
		redo : function () {
			channel.hideTrackSheet = !(!(!(channel.hideTrackSheet)));
		}
	});
};
RiffShare2D.prototype.redoToggleChannelFrets = function (channel) {
	riffShare2d.pushAction({
		caption : 'Toggle frets',
		undo : function () {
			channel.hideTrackFret = !(!(!(channel.hideTrackFret)));
		},
		redo : function () {
			channel.hideTrackFret = !(!(!(channel.hideTrackFret)));
		}
	});
};
RiffShare2D.prototype.redoToggleChannelChords = function (channel) {
	riffShare2d.pushAction({
		caption : 'Toggle chords',
		undo : function () {
			channel.hideTrackChords = !(!(!(channel.hideTrackChords)));
		},
		redo : function () {
			channel.hideTrackChords = !(!(!(channel.hideTrackChords)));
		}
	});
};
RiffShare2D.prototype.redoChangeChannelVolume = function (channel, from, to) {
	riffShare2d.pushAction({
		caption : 'Change channel volume',
		undo : function () {
			channel.volumes = [{
					position : 0,
					value : from
				}
			];
		},
		redo : function () {
			channel.volumes = [{
					position : 0,
					value : to
				}
			];
		}
	});
};
RiffShare2D.prototype.redoChangeChannelEqualizer = function (channel, band, from, to) {
	riffShare2d.pushAction({
		caption : 'Change channel equalizer',
		undo : function () {
			channel.equalizer[band] = from;
		},
		redo : function () {
			channel.equalizer[band] = to;
		}
	});
};
RiffShare2D.prototype.redoAddNewChannel = function (channel) {
	riffShare2d.pushAction({
		caption : 'Add new channel',
		undo : function () {
			for (var i = 0; i < riffShare2d.currentSong.channels.length; i++) {
				if (riffShare2d.currentSong.channels[i].id == channel.id) {
					riffShare2d.currentSong.channels.splice(i, 1);
					break;
				}
			}
		},
		redo : function () {
			riffShare2d.currentSong.channels.push(channel);
		}
	});
};
RiffShare2D.prototype.redoDropChannel = function (channel) {
	var oldPositions = [];
	var newPositions = [];
	var oldChannels = [];
	var newChannels = [];
	var id = channel.id;
	for (var i = 0; i < this.currentSong.channels.length; i++) {
		oldChannels.push(this.currentSong.channels[i]);
		if (this.currentSong.channels[i].id != id) {
			newChannels.push(this.currentSong.channels[i]);
		}
	}
	for (var i = 0; i < this.currentSong.positions.length; i++) {
		var p = this.currentSong.positions[i];
		var newP = {
			order : p.order,
			tempo : p.tempo,
			meter : p.meter,
			by : p.by,
			marker : p.marker,
			motifs : []
		};
		var oldP = {
			order : p.order,
			tempo : p.tempo,
			meter : p.meter,
			by : p.by,
			marker : p.marker,
			motifs : []
		};
		for (var n = 0; n < p.motifs.length; n++) {
			var m = p.motifs[n];
			var copy = {
				motif : m.motif,
				channel : m.channel,
				clef : m.clef,
				sign : m.sign
			};
			oldP.motifs.push(copy);
			if (this.currentSong.channels[n].id != id) {
				newP.motifs.push(copy);
			}
		}
		oldPositions.push(oldP);
		newPositions.push(newP);
	}
	riffShare2d.pushAction({
		caption : 'Drop channel ' + channel.track,
		undo : function () {
			riffShare2d.currentSong.channels = oldChannels;
			riffShare2d.currentSong.positions = oldPositions;
		},
		redo : function () {
			riffShare2d.currentSong.channels = newChannels;
			riffShare2d.currentSong.positions = newPositions;
		}
	});
};
RiffShare2D.prototype.redoAddNewMeasure = function () {
	//var motif={id:Math.floor(Math.random()*1000000),chords:[]};
	var position = {
		order : riffShare2d.currentSong.positions.length,
		tempo : 100,
		meter : 4,
		by : 4,
		motifs : []
	};
	riffShare2d.pushAction({
		caption : 'Add new position',
		undo : function () {
			riffShare2d.currentSong.positions.pop();
		},
		redo : function () {
			riffShare2d.currentSong.positions.push(position);
		}
	});
};
RiffShare2D.prototype.redoDeleteMeasure = function (nn) {
	var p = this.currentSong.positions[nn];
	riffShare2d.pushAction({
		caption : 'Add new position',
		undo : function () {
			riffShare2d.currentSong.positions.splice(nn, 0, p);
		},
		redo : function () {
			riffShare2d.currentSong.positions.splice(nn, 1);
		}
	});
};
RiffShare2D.prototype.startNote = function (to) {
	console.log('startNote',to);
	if (this.startedNoteInfo) {
		var start = this.startedNoteInfo.start;
		var len = (to.start + to.startAt) - (this.startedNoteInfo.start + this.startedNoteInfo.startAt);
		var shift = to.key - this.startedNoteInfo.key;
		var key = this.startedNoteInfo.key;
		var p = this.startedNoteInfo.position;
		if ((to.start + to.startAt) < (this.startedNoteInfo.start + this.startedNoteInfo.startAt)) {
			start = to.start;
			len = (this.startedNoteInfo.start + this.startedNoteInfo.startAt) - (to.start + to.startAt);
			shift = this.startedNoteInfo.key - to.key;
			key = to.key;
			p = to.position;
		}
		//console.log('at' + start + ':' + len, 'pitch' + key + '/' + shift);
		//console.log(this.startedNoteInfo,'>',to);
		this.startedNoteInfo = null;
		this.redoAddNoteToCurChannel(start/this.cellDurationRatio(), key + 1, (len + 1)/this.cellDurationRatio(), shift, p);
	} else {
		var note=this.existsNoteAtCurrentChannel(to.start/this.cellDurationRatio(), to.key + 1, to.position);
		if (note) {
			this.redoDeleteNote(note.n,note.chord);
		}else{
			this.startedNoteInfo = to;
		}
	}
};
RiffShare2D.prototype.existsNoteAtCurrentChannel = function (start, key, position) {
	//console.log('dropNoteAtCurrentChannel', start, key, position);
	var channelId = this.currentSong.channels[this.currentSong.channels.length - 1].id;
	var mm = this.findPositionMotifByChannel(position, channelId);
	var m = null;
	if (mm[0]) {
		m = this.findMotifById(mm[0].motif);
	}
	if (m) {
		var chord = this.findCreateStepChord(m, start);
		//console.log('chord',key,chord);
		for(var i=0;i<chord.notes.length;i++){
			if(chord.notes[i].key==key){
				//chord.splice(i,1);
				//console.log('found',chord.notes[i]);
				return {chord:chord,n:i};
			}
		}
	}
	return false;
}
RiffShare2D.prototype.redoAddNoteToCurChannel = function (start, key, len, shift, position) {
	console.log('redoAddNoteToCurChannel',start, key,len,shift,position);
	var channelId = this.currentSong.channels[this.currentSong.channels.length - 1].id;
	var mm = this.findPositionMotifByChannel(position, channelId);
	var m = null;
	if (mm[0]) {
		m = this.findMotifById(mm[0].motif);
	}
	if (!(m)) {
		m = {
			id : Math.floor(Math.round() * 1000000),
			chords : []
		};
		this.currentSong.motifs.push(m);
		position.motifs.push({
			motif : m.id,
			channel : channelId,
			clef : 1,
			sign : 0
		});
		//console.log('new',m);
	}
	//console.log('note',{key:key,l6th:len,string:1});
	var chord = this.findCreateStepChord(m, start);
	riffShare2d.pushAction({
		caption : 'Add note to current channel',
		undo : function () {
			chord.notes.pop();
		},
		redo : function () {
			chord.notes.push({
				key : key,
				l6th : len,
				string : 1
			});
			console.log('notes', chord.notes);
		}
	});
};
RiffShare2D.prototype.redoDeleteNote = function (n,chord) {
	var note = chord.notes[n];
	riffShare2d.pushAction({
		caption : 'Delete note',
		undo : function () {
			chord.notes.splice(n,0,note);
		},
		redo : function () {
			chord.notes.splice(n,1);
		}
	});
};
