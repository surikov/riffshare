console.log('riffshare2d v1.0.1');
function RiffShare2D() {
	return this;
}
RiffShare2D.prototype.init = function () {
	console.log('start init');
	this.tapSize = 32;
	try {
		console.log('window.devicePixelRatio', window.devicePixelRatio);
		var pixelRatio = window.devicePixelRatio;
		this.tapSize = 30 * pixelRatio;
		if (isNaN(this.tapSize)) {
			this.tapSize = 51;
		}

	} catch (ex) {
		console.log(ex);
	}
	console.log('tapSize', this.tapSize,'devicePixelRatio',window.devicePixelRatio);

	//this.selectedChannel = 0;

	this.currentSong = null;

	this.lineWidth = 0.05 * this.tapSize;
	this.svgns = "http://www.w3.org/2000/svg";
	this.contentDiv = document.getElementById('contentDiv');
	this.contentSVG = document.getElementById('contentSVG');
	this.rakeDiv = document.getElementById('rakeDiv');

	this.menuDiv = document.getElementById('menuDiv');

	this.hugeGroup = document.getElementById('huge');
	this.hugeborders = document.getElementById('hugeborders');
	this.hugetitles = document.getElementById('hugetitles');
	this.hugeholders = document.getElementById('hugeholders');

	this.hugespots = document.getElementById('hugespots');

	this.largeGroup = document.getElementById('large');
	this.largetitles = document.getElementById('largetitles');
	this.largelines = document.getElementById('largelines');
	this.largeborders = document.getElementById('largeborders');
	this.largeshadow = document.getElementById('largeshadow');
	this.largesymbols = document.getElementById('largesymbols');
	this.largespots = document.getElementById('largespots');

	this.mediumGroup = document.getElementById('medium');
	this.mediumtitles = document.getElementById('mediumtitles');
	this.mediumgrid = document.getElementById('mediumgrid');
	this.mediumlines = document.getElementById('mediumlines');
	this.mediumborders = document.getElementById('mediumborders');
	this.mediumshadow = document.getElementById('mediumshadow');
	this.mediumsymbols = document.getElementById('mediumsymbols');
	this.mediumspots = document.getElementById('mediumspots');

	this.smallGroup = document.getElementById('small');
	this.smalltitles = document.getElementById('smalltitles');
	this.smallgrid = document.getElementById('smallgrid');
	this.smalllines = document.getElementById('smalllines');
	this.smallborders = document.getElementById('smallborders');
	this.smallshadow = document.getElementById('smallshadow');
	this.smallsymbols = document.getElementById('smallsymbols');
	this.smallspots = document.getElementById('smallhotspots');

	this.overlayGroup = document.getElementById('overlay');

	this.menuTitleSpan = document.getElementById('menuTitle');
	this.menuTable = document.getElementById('menuTable');

	this.translateX = 0;
	this.translateY = 0;
	this.translateZ = 10;
	this.innerWidth = 3000;
	this.innerHeight = 2000;
	this.lastUsedLevel = 0;

	this.spots = [];

	this.timeOutID = 0;

	this.marginLeft = 50;
	this.marginRight = 20;
	this.marginTop = 10;
	this.marginBottom = 20;
	this.heightSongTitle = 30;
	this.heightSongText = 20;
	this.heightTrTitle = 17;
	this.heightTrChords = 10;
	this.heightTrSheet = 29;
	this.marginTrSheetLines = 14;
	this.marginFret = 10;
	//this.heightTrFret = 10;
	//this.heightTrText = 10;
	this.heightPRTitle = 19;
	this.heightPRGrid = 128;
	this.marginFirstMeasure = 30;
	this.marginChangedMeasure = 10;
	this.cellWidth = 5.75;

	this.lowStair = 28;
	this.highStair = this.lowStair + 12;

	this.colorGrid = '#eee';
	this.colorHugeHolder = '#ddd';
	this.colorSharp = '#bbb';
	this.colorComment = '#333';
	this.colorMain = '#000';
	//this.colorAction = '#f60';
	this.colorAction = '#cdf';
	this.colorButton = '#000';
/*
	this.hideTrackSheet = [];
	this.hideTrackChords = [];
	this.hideTrackFret = [];
	this.hideTrackText = [];
	this.hideRoll = false;
	*/

	this.setupInput();
	var o=readObjectFromlocalStorage('currentSong');
	
	if(o){
		console.log('load saved song');
		this.setSong( o);
	}else{
		this.setSong( this.emptySong());
	}
	window.onresize = function () {
		riffShare2d.resetSize(); //(riffShare2d.innerWidth, riffShare2d.innerHeight);
	};
	window.onunload = function () {
		saveObject2localStorage('currentSong', riffShare2d.currentSong);
	};
	console.log('done init');
};
RiffShare2D.prototype.channelStringKey = function (order, channel) {
	for (var i = 0; i < channel.string.length; i++) {
		if (channel.string[i].order == order) {
			return channel.string[i].pitch;
		}
	}
};
RiffShare2D.prototype.cleffOffset = function (clef) {
	if (clef == 2)
		return -20;
	return 0;
};
RiffShare2D.prototype.fretLineColor = function (n) {
	//var n=1*fret;
	if (n > 6)
		return '#aaa';
	if (n > 4)
		return '#999';
	if (n > 2)
		return '#666';
	if (n > 0)
		return '#333';
	return '#000';
};
RiffShare2D.prototype.findMotifById = function (id) {
	for (var i = 0; i < this.currentSong.motifs.length; i++) {
		if (this.currentSong.motifs[i].id == id) {
			return this.currentSong.motifs[i];
		}
	}
	return null;
};
RiffShare2D.prototype.findPositionMotifByChannel = function (position, channelID) {
	var m = [];
	for (var n = 0; n < position.motifs.length; n++) {
		var motif = position.motifs[n];
		if (motif.channel == channelID) {
			//return motif;
			m.push(motif);
		}
	}
	return m;
};
RiffShare2D.prototype.linesYshift = function () {
	return (0.5 + this.marginTrSheetLines + 2 * 5) * this.tapSize;
};
RiffShare2D.prototype.emptySong = function () {
	console.log('create empty song');
	var emptysong = {
		version : '2.21',
		album : '',
		artist : '',
		author : '',
		comments : '',
		copyright : '',
		date : '',
		name : 'New empty song',
		transcriber : '',
		writer : '',
		lyrics : [
		],
		channels : [{
				id : 70490,
				program : 0,
				color : 'rgb(176,218,136)',
				offset : 0,
				track : 'Piano',
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
				]
			}
		],
		positions : [{
				order : 0,
				tempo : 100,
				meter : 4,
				by : 4,
				motifs : [{
						motif : 43914,
						channel : 70490,
						clef : 1,
						sign : 0
					}
				]
			}
		],
		motifs : [{
				id : 43914,
				chords : [
				]
			}
		]
	};
	return emptysong;
};
RiffShare2D.prototype.resetAllLayersNow = function () {
	console.log('resetAllLayersNow');
	this.clearLayers([riffShare2d.hugeGroup, riffShare2d.largeGroup, riffShare2d.mediumGroup, riffShare2d.smallGroup]);
	this.clearSpots();
	this.resetSize();
	this.resetTiles();
};
RiffShare2D.prototype.queueTiles = function () {
	if (this.timeOutID > 0) {
		//console.log('still wait redraw');
		return;
	}
	this.timeOutID = setTimeout(function () {
			//console.log(this);
			riffShare2d.timeOutID = 0;
			riffShare2d.resetTiles();
		}, 100);
};
RiffShare2D.prototype.setSong = function (song) {
	if(!(song.selectedChannel)){
		song.selectedChannel=0;
	}
	/*for(var i=0;i<song.channels.lengthl;i++){
		if(!(song.hideTrackSheet)){
		song.hideTrackSheet = [];
	}
	}
	
	if(!(song.hideTrackSheet)){
		song.hideTrackSheet = [];
	}
	if(!(song.hideTrackChords)){
		song.hideTrackChords = [];
	}
	if(!(song.hideTrackFret)){
		song.hideTrackFret = [];
	}
	if(!(song.hideTrackSheet)){
		song.hideTrackSheet = [];
	}
	if(!(song.hideRoll)){
		song.hideRoll = false;
	}*/
	this.currentSong = song;
	console.log(this.currentSong);
	/*
	this.hideTrackSheet = [];
	this.hideTrackChords = [];
	this.hideTrackFret = [];
	this.hideTrackText = [];
	this.hideRoll = false;
	*/
	/*
	this.hideTrackSheet[1] = true;
	this.hideTrackChords[1] = true;
	this.hideTrackFret[1] = true;
	this.hideTrackText[1] = true;
	 */
	//this.hideRoll=true;

	this.resetSize();
};
RiffShare2D.prototype.resetSize = function () {
	//console.log('set size', width, height, this.contentDiv.clientWidth);
	//var ml = this.songWidth32th();
	/*var tc = 1;
	if (this.currentSong) {
	tc = this.currentSong.channels.length
	}*/
	this.innerWidth = (this.marginLeft + this.marginRight) * this.tapSize + this.songWidth32th();
	this.innerHeight = (this.marginTop + this.heightSongTitle + this.heightSongText + this.marginBottom //
	) * this.tapSize
	+this.calculateAllTracksHeight()
	+this.calculateRollHeight() //
;
	this.contentSVG.style.width = this.contentDiv.clientWidth;
	this.contentSVG.style.height = this.contentDiv.clientHeight;
	this.adjustContentPosition();
	this.queueTiles();
};
window.onload = function () {
	console.log('create riffShare2d');
	window.riffShare2d = new RiffShare2D();
	window.riffShare2d.init();
};
