RiffShare2D.prototype.addHugeTiles = function (xx, yy, ww, hh, detailRatio) {
	this.tileHugeSongTitle(this.hugetracknames, xx, yy, ww, hh, detailRatio);
	this.tileHugeSongOptions(this.hugetracknames, xx, yy, ww, hh, detailRatio);
	this.tileHugeSongTracks(this.hugeholders, xx, yy, ww, hh, detailRatio);
	//this.tileTracksSelectors(this.hugetitles, xx, yy, ww, hh, detailRatio);
	this.tileHugeTracksTitles(this.hugetracknames, xx, yy, ww, hh, detailRatio);
	this.tileHugeTracksOptions(this.hugetitles, xx, yy, ww, hh, detailRatio);
	this.tileMarkers(this.hugetitles, xx, yy, ww, hh);
	//this.tileSongRollTitle(this.hugeholders, xx, yy, ww, hh);
	this.tileHugeMeasureLines(this.hugeborders, xx, yy, ww, hh, detailRatio);
	//this.tileHugeTrackControls(this.hugespots, xx, yy, ww, hh, detailRatio);

	//this.tileMainMenu(this.hugespots, xx, yy, ww, hh, detailRatio);
	this.tilePianoRollMenu(this.hugetracknames, xx, yy, ww, hh, detailRatio);
	this.tileNewMeasureButton(this.hugetitles, xx, yy, ww, hh, detailRatio);
};
RiffShare2D.prototype.tileNewMeasureButton = function (layer, left, top, width, height, ratio) {
	var x = this.marginLeft * this.tapSize + this.songWidth32th();
	var y = this.calculateRollGridY();
	var w = this.marginRight * this.tapSize;
	var h = 10 * this.tapSize;
	var id = 'msrNewMenu';
	var lw = this.lineWidth * ratio;
	var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
	if (g) {
		/*this.addButton('btMsre', 'New measure', h/6 , g, x, y, h, false //, 0 //, function(){
		riffShare2d.redoAddNewMeasure();
		},0);*/
		this.addSimpleButton('btMsre', 'New measure', g, x, y, h, function () {
			riffShare2d.redoAddNewMeasure();
		});
	}
};
RiffShare2D.prototype.tilePianoRollMenu = function (layer, left, top, width, height, ratio) {
	var x = this.marginLeft * this.tapSize;
	var y = this.calculateRollGridY();
	var w = this.songWidth32th();
	var h = this.heightTrTitle * this.tapSize;
	var id = 'rollOptMenu';
	var lw = this.lineWidth * ratio;
	var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
	if (g) {
		/*this.addButton('btRlHd', 'Show Pianoroll', h/6 , g, x, y, h, true //,  this.currentSong.hideRoll ? lw : 0 //, function () {
		//riffShare2d.currentSong.hideRoll = !(!(!(riffShare2d.currentSong.hideRoll)));
		riffShare2d.redoTogglePianoroll();
		},0);*/
		if (this.currentSong.hideRoll) {
			this.addHollowStuckButton('btRlHd', 'Show Pianoroll', g, x, y, h,  function () {
				riffShare2d.redoTogglePianoroll();
			});
		} else {
			this.addSimpleStuckButton('btRlHd', 'Hide Pianoroll', g, x, y, h, function () {
				riffShare2d.redoTogglePianoroll();
			});
		}
		/*this.addButton('btNCh', 'New channel', h / 6, g, x + 1.2 * h, y, h, true //
		, 0 //
		, function () {
			riffShare2d.promptAddNewChannel();
		}, 0);
		*/
		this.addSimpleButton('btNCh', 'New channel', g, x + 1.2 * h, y, h,  function () {
			riffShare2d.promptAddNewChannel();
		});
	}
};
RiffShare2D.prototype.tileHugeSongOptions = function (layer, left, top, width, height, ratio) {
	var x = this.marginLeft * this.tapSize;
	var y = this.marginTop * this.tapSize;
	var w = this.songWidth32th();
	var h = this.heightSongTitle * this.tapSize;
	var id = 'songOptMenu';
	var lw = 3 * this.lineWidth * ratio;
	var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
	if (g) {
		/*
		this.addButton('btMenSng', 'Options', h/3 , g, x, y, h, true //, lw //, null,0.9*this.minZoomLarge);
		 */
		this.addZoomAnchor('btMenSng', 'Options', g, x, y, h, 0.9 * this.minZoomLarge);
	}
};
RiffShare2D.prototype.tileHugeSongTitle = function (layer, left, top, width, height, ratio) {
	var x = this.marginLeft * this.tapSize;
	var y = this.marginTop * this.tapSize;
	var w = this.songWidth32th();
	var h = this.heightSongTitle * this.tapSize;
	var id = 'songTitle';
	var lw = 3 * this.lineWidth * ratio;
	var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
	if (g) {

		/*this.addButton(id, 'Play', h / 3, g, 1 * (1.2 * h) + x, y, h, true //
		, lw //
		, function () {
			//var r = prompt('Song title', riffShare2d.currentSong.name);
			//if (r) {
			//	riffShare2d.currentSong.name = r;
			//}
		});*/
		this.addSimpleButton(id, 'Play', g, 1 * (1.2 * h) + x, y, h, function () {
			console.log('play pressed');
		});
		this.tileText(g, x + 2 * (1.2 * h), y + h, h / 1, this.currentSong.name, this.colorBase);
	}
	//this.tileHugeSongTexts(layer, left, top, width, height);
};
RiffShare2D.prototype.tileHugeSongTracks = function (layer, left, top, width, height, ratio) {
	var x = this.marginLeft * this.tapSize;
	var w = this.songWidth32th();
	for (var i = 0; i < this.currentSong.channels.length; i++) {
		if (!(this.currentSong.channels[i].hideTrackSheet)) {
			var y = this.calculateTrackSheetY(i) + (0.5 + this.marginTrSheetLines) * this.tapSize;
			var h = 8 * this.tapSize;
			var id = 'plHuge' + i;
			var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
			if (g) {
				this.tileRectangle(g, x, y, w, h, this.colorAux);
			}
		}
		if (!(this.currentSong.channels[i].hideTrackFret)) {
			var y = this.calculateTrackFretY(i);
			var h = 2 * this.currentSong.channels[i].string.length * this.tapSize;
			var id = 'frpHuge' + i;
			var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
			if (g) {
				this.tileRectangle(g, x, y, w, h, this.colorAux);
			}
		}
	}
	if (!this.currentSong.hideRoll) {

		var x = this.marginLeft * this.tapSize;
		var y = this.calculateRollGridY();
		var w = this.songWidth32th();
		var h = 128 * this.tapSize;
		var id = 'hugprli';
		var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
		//console.log('add',x, y, w, h, id, layer, left, top, width, height);
		if (g) {
			var h = this.lineWidth * ratio;
			for (var i = 12; i < 128; i = i + 12) {
				y = this.calculateRollGridY() + (this.heightPRGrid - i) * this.tapSize;
				var id = 'octali' + i;
				var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
				if (g) {
					this.tileRectangle(g, x, y, w, h, this.colorAux);
					//console.log('add',id);
				}
			}
		}
	}
};
RiffShare2D.prototype.tileOneHugeTrackTitle = function (i, layer, left, top, width, height, ratio) {
	//var x = (this.marginLeft + this.heightPRTitle) * this.tapSize;
	var x = this.marginLeft * this.tapSize;
	var y = this.calculateTrackY(i);
	var w = this.marginLeft * this.tapSize+this.songWidth32th()+this.marginRight * this.tapSize;
	var h = this.heightTrTitle * this.tapSize;
	var lw = 3 * this.lineWidth * ratio;
	if (this.collision(x, y, w, h, left, top, width, height)) {
		var id = 'trackHeader' + i;
		var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
		if (g) {
			//this.tileText(g, x+h/2, y + h -5 * this.tapSize, 11 * this.tapSize, this.currentSong.channels[i].channel + ' / ' + this.currentSong.channels[i].track, this.colorComment);
			//			this.tileText(g, 17*this.tapSize+x+h/2, y + h -5 * this.tapSize, 11 * this.tapSize,  this.currentSong.channels[i].track, this.colorComment);
			/*this.addSpot('trackSelect' + i, x, y, w, h, function () {
			riffShare2d.selectedChannel = i;
			});*/
			//this.addButton('btMenTr' + i, 'Options', h / 3, g, x, y, h, true, lw, null, 0.9 * this.minZoomLarge, true);
			//---------------------------this.addStuckZoomAnchor('btMenTr' + i, 'Options',  g, x, y, h,  0.9 * this.minZoomLarge, true);
			/*
			this.addButton('btSelTr'+i,  this.currentSong.channels[i].track, h*1 , g, x+1.2*h, y, h, true , i == this.currentSong.selectedChannel ? 0 : lw  , function () {
			riffShare2d.currentSong.selectedChannel = i;
			});
			 */
			//this.tileText(g, x + 1.2 * h, y + h * 2 / 3, h * 0.75, this.currentSong.channels[i].track, this.colorBase);
			this.tileText(g, x, y + h , h * 1.01, this.currentSong.channels[i].track, this.colorHot);
			/*this.tileRectangle(g, x, y, w,this.lineWidth * ratio, this.colorHot);
			this.addSpot(id, x, y, w, h, function () {
				riffShare2d.redoSelectChannel(i);
			});*/
		}
	}
	/*var x = this.marginLeft * this.tapSize;
	var y = this.calculateTrackY(i);
	var w = this.songWidth32th();
	var h = this.heightTrTitle * this.tapSize;
	
	if (this.collision(x, y, w, h, left, top, width, height)) {
		var id = 'trackTitle' + i;
		
		var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
		if (g) {
			//console.log(i);
			this.tileRectangle(g, x, y+h, w,this.lineWidth * ratio, this.colorHot);
		}
	}*/
};
RiffShare2D.prototype.tileHugeTracksTitles = function (layer, left, top, width, height, ratio) {
	for (var i = 0; i < this.currentSong.channels.length; i++) {
		this.tileOneHugeTrackTitle(i, layer, left, top, width, height, ratio);
	}
};
RiffShare2D.prototype.tileOneHugeTrackOptions = function (i, layer, left, top, width, height, ratio) {
	var x = 0;
	var y = this.calculateTrackY(i);
	var w = this.marginLeft * this.tapSize+this.songWidth32th()+this.marginRight * this.tapSize;
	var h = this.heightTrTitle * this.tapSize;
	var lw = 3 * this.lineWidth * ratio;
	if (this.collision(x, y, w, h, left, top, width, height)) {
		var id = 'trackOpt' + i;
		var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
		if (g) {
			this.addStuckZoomAnchor('btOptsTr' + i, '',  g, x+this.marginLeft * this.tapSize-2*h, y, h,  0.9 * this.minZoomLarge, true);
			this.tileRectangle(g, x+this.marginLeft * this.tapSize, y, w-this.marginLeft * this.tapSize-this.marginRight * this.tapSize,this.lineWidth * ratio, this.colorHot);
			this.addSpot(id, x+this.marginLeft * this.tapSize, y, w-this.marginLeft * this.tapSize-this.marginRight * this.tapSize, h, function () {
				riffShare2d.redoSelectChannel(i);
			});
		}
	}
};
RiffShare2D.prototype.tileHugeTracksOptions = function (layer, left, top, width, height, ratio) {
	for (var i = 0; i < this.currentSong.channels.length; i++) {
		this.tileOneHugeTrackOptions(i, layer, left, top, width, height, ratio);
	}
};

RiffShare2D.prototype.tileHugeMeasureLines = function (layer, left, top, width, height, ratio) {
	var changes = this.positionOptionsChanges();
	for (var i = 1; i < this.currentSong.positions.length; i++) {
		if (i % 10 == 0) {
			var x = this.calculateMeasureX(i, changes);
			var y = this.calculateTrackY(0);
			var w = this.measureWidth32th(i, changes);
			var h = this.calculateAllTracksHeight() + this.calculateRollHeight();
			var id = 'ln' + i + 'x' + x + 'x' + y;
			var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
			if (g) {
				this.tileText(g, x + this.lineWidth * ratio * 3, y + 15 * this.tapSize, 27 * this.tapSize, '' + (1 + i), this.colorBase);
				this.tileRectangle(g, x, y, this.lineWidth * ratio, h, this.colorAux);
			}
		}
	}
};
RiffShare2D.prototype.tileMarkers = function (layer, left, top, width, height) {
	var changes = this.positionOptionsChanges();
	for (var i = 0; i < this.currentSong.positions.length; i++) { //var changes=this.positionOptionsChanges();
		if (this.currentSong.positions[i].marker) {
			var x = this.calculateMeasureX(i, changes);
			//var y = this.calculateTrackY(0);
			var y = this.calculateRollTitleY();
			var w = this.measureWidth32th(i, changes);
			//var h = this.calculateAllTracksHeight() + this.calculateRollHeight();
			var h = this.heightPRTitle * this.tapSize;
			var id = 'ln' + i + 'x' + x + 'x' + y;
			var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
			if (g) {
				this.tileText(g, x, y + h, 19 * this.tapSize, this.currentSong.positions[i].marker, this.colorBase);
			}
		}
	}
};
/*
RiffShare2D.prototype.tileSongRollTitle = function (layer, left, top, width, height) {
var x = this.marginLeft * this.tapSize;
var y = this.calculateRollTitleY();
var w = this.songWidth32th();
var h = this.heightPRTitle * this.tapSize;
var id = 'roll';
var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
if (g) {
this.tileText(g, x, y + 0.75 * this.heightPRTitle * this.tapSize, 3 * this.tapSize, 'Pianoroll', this.colorComment);
this.addSpot(id, x, y, w, h, function () {
riffShare2d.currentSong.hideRoll = !(riffShare2d.currentSong.hideRoll);
riffShare2d.clearAllTiles();
});
}
}*/
/*
RiffShare2D.prototype.tileOneHugeTrackControl = function (i, layer, left, top, width, height, detailRatio) {
var x = 1 * this.tapSize;
var y = this.calculateTrackY(i);
var w = this.marginLeft * this.tapSize;
var h = this.calculateTrackHeight(i);
var r = 0.45 * Math.min(w, this.heightTrText * this.tapSize);
if (this.collision(x, y, w, h, left, top, width, height)) {
var id = 'trackControls' + i;
var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
if (g) {
//this.tileText(g, x, y+this.heightTrText*this.tapSize, 11 * this.tapSize, this.currentSong.channels[i].channel + ' / ' + this.currentSong.channels[i].track, this.colorAction);
this.tileCircle(g, x + w / 2, y + r, r, 'none', this.colorAction, this.lineWidth * detailRatio);
}
}
};
RiffShare2D.prototype.tileHugeTrackControls = function (layer, left, top, width, height, detailRatio) {
for (var i = 0; i < this.currentSong.channels.length; i++) {
this.tileOneHugeTrackControl(i, layer, left, top, width, height, detailRatio);
}
};
 */
/*
RiffShare2D.prototype.tileOneTrackText = function (i,layer, left, top, width, height, detailRatio) {
var text=this.currentSong.lyrics[i].text;
var start=1*this.currentSong.lyrics[i].start;
var x = this.calculateMeasureX(start-1);
var y = this.calculateTrackTextY(i);
var w = this.songWidth32th() ;
var h = this.heightTrText*this.tapSize;
if (this.collision(x, y, w, h, left, top, width, height)) {
var id = 'trackTitle' + i;
var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
if (g) {
this.tileText(g, x, y+this.heightTrText*this.tapSize, 11 * this.tapSize, this.currentSong.channels[i].channel + ' / ' + this.currentSong.channels[i].track, this.colorComment);
this.addSpot('trackSelect' + i, x,y,w,h, function () {
riffShare2d.selectedChannel = i;
});
}
}
}*/
