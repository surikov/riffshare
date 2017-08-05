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

RiffShare2D.prototype.promptChangeSongTitle = function () {
	var r = prompt('Song title', riffShare2d.currentSong.name);
	if (r) {
		//riffShare2d.currentSong.name = r;
		riffShare2d.redoSongTitleChange(r);
	}
};
RiffShare2D.prototype.promptImportSong = function () {
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
			}
			,{
				title : 'Import from MXML',
				action : function () {
					window.location.href = 'mxml.html';
				}
			}
		]);
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
	console.log('setUndoStatus',this.undoStep , this.undoQueue.length);
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
RiffShare2D.prototype.pushAction = function (action) {
	console.log('pushAction', action.caption);
	action.x = this.translateX;
	action.y = this.translateY;
	action.z = this.translateZ;
	action.redo();
	var rm=this.undoQueue.length-this.undoStep;
	for (var i = 0; i < rm; i++) {
		this.undoQueue.pop();
	}
	this.undoQueue.push(action);
	this.undoStep++;
	rm=this.undoQueue.length - this.undoSize;
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
		caption : 'Select track ' + n+'/'+riffShare2d.currentSong.channels[n].track,
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
RiffShare2D.prototype.redoChannelTitleChange = function (channel,fromTitle,toTitle) {
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
RiffShare2D.prototype.redoChangeChannelVolume = function (channel,from,to) {
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
RiffShare2D.prototype.redoChangeChannelEqualizer = function (channel,band,from,to) {
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
