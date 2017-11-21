FretChordSheet.prototype.resetUndoStatus = function () {
	console.log('resetUndoStatus',this.tiler.tapSize);
	document.getElementById('undobutton').style.width = this.tiler.tapSize + 'px';
	document.getElementById('undobutton').style.height = this.tiler.tapSize + 'px';
	document.getElementById('redobutton').style.width = this.tiler.tapSize + 'px';
	document.getElementById('redobutton').style.height = this.tiler.tapSize + 'px';
	document.getElementById('redobutton').style.top = (5 * 2 + this.tiler.tapSize) + 'px';
	this.clearUndo();
	var me=this;
	document.getElementById('undobutton').onclick=function(){me.undoLast();};
	document.getElementById('redobutton').onclick=function(){me.redoNext();};
}
FretChordSheet.prototype.setUndoStatus = function () {
	if (this.undoStep < this.undoQueue.length) {
		document.getElementById('redoimg').src = "redoActive.png";
	} else {
		document.getElementById('redoimg').src = "redo.png";
	}
	if (this.undoStep > 0) {
		document.getElementById('undoimg').src = "undoActive.png";
	} else {
		document.getElementById('undoimg').src = "undo.png";
	}
};
FretChordSheet.prototype.makeUndo = function (level) {
	console.log('makeUndo', level);
	var last = null;
	for (var i = this.undoQueue.length - 1; i >= level; i--) {
		var u = this.undoQueue.pop();
		u.undo();
		last = u;
	}
	if (last) {
		this.resetAllLayersNow();
		this.startSlideTo(last.x, last.y, last.z);
	}
};
FretChordSheet.prototype.clearUndo = function () {
	this.undoQueue = [];
	this.undoStep = 0;
}
FretChordSheet.prototype.setUndoStatus = function () {
	if (this.undoStep < this.undoQueue.length) {
		document.getElementById('redoimg').src = "img/redoActive.png";
	} else {
		document.getElementById('redoimg').src = "img/redo.png";
	}
	if (this.undoStep > 0) {
		document.getElementById('undoimg').src = "img/undoActive.png";
	} else {
		document.getElementById('undoimg').src = "img/undo.png";
	}
};
FretChordSheet.prototype.redoNext = function (v) {
	//console.log('redoNext',v,this,this.undoStep,this.undoQueue);
	if (this.undoStep < this.undoQueue.length) {
		var a = this.undoQueue[this.undoStep];
		console.log('redo', a.caption);
		a.redo();
		this.undoStep++;
		this.tiler.resetAllLayersNow();
		this.tiler.startSlideTo(a.x, a.y, a.z);
		this.setUndoStatus();
	}
};
FretChordSheet.prototype.undoLast = function () {
	//console.log('undoLast');
	if (this.undoStep > 0) {
		this.undoStep--;
		var a = this.undoQueue[this.undoStep];
		console.log('undo', a.caption);
		a.undo();
		this.tiler.resetAllLayersNow();
		this.tiler.startSlideTo(a.x, a.y, a.z);
		this.setUndoStatus();
	}
};
FretChordSheet.prototype.pushAction = function (action) {
	console.log('pushAction', action.caption);
	action.x = this.tiler.translateX;
	action.y = this.tiler.translateY;
	action.z = this.tiler.translateZ;
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
};
FretChordSheet.prototype.userActionChangeFeel = function (nn) {
	var olds = this.options.feel;
	var news = nn;
	var me = this;
	this.pushAction({
		caption: 'Change feel mode ' + nn,
		undo: function () {
			me.options.feel = olds;
		},
		redo: function () {
			me.options.feel = news;
		}
	});
};
