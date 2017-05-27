console.log('riffshare2d v1.0.1');
function RiffShare2D(){
	return this;
}
RiffShare2D.prototype.init=function(){
	console.log('start init');
	this.tapSize = 32;
	try {
		console.log('window.devicePixelRatio',window.devicePixelRatio);
		var pixelRatio = window.devicePixelRatio;
		this.tapSize = 30 * pixelRatio;
		if (isNaN(this.tapSize)) {
			this.tapSize = 51;
		}

	} catch (ex) {
		console.log(ex);
	}
	console.log('tapSize',this.tapSize);
	this.lineWidth = 0.05 * this.tapSize;
	this.svgns = "http://www.w3.org/2000/svg";
	this.contentDiv = document.getElementById('contentDiv');
	this.contentSVG = document.getElementById('contentSVG');
	this.rakeDiv = document.getElementById('rakeDiv');
	
	this.hugeGroup = document.getElementById('huge');
	this.hugetitles = document.getElementById('hugetitles');
	this.hugeholders = document.getElementById('hugeholders');
	this.hugeborders = document.getElementById('hugeborders');
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
	this.smallspots = document.getElementById('smallspots');
	
	this.translateX=0;
	this.translateY=0;
	this.translateZ=1;
	this.innerWidth = 3000;
	this.innerHeight = 2000;
	this.lastUsedLevel=0;
	
	this.timeOutID=0;
	
	this.setupInput();
	this.setSize(50000,10000);
	window.onresize =function (){
					riffShare2d.setSize(riffShare2d.innerWidth,riffShare2d.innerHeight);
			};
	console.log('done init');
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
RiffShare2D.prototype.setSize = function (width, height) {
		console.log('set size', width, height, this.contentDiv.clientWidth);
		this.innerWidth = width;
		this.innerHeight = height;
		this.contentSVG.style.width = this.contentDiv.clientWidth;
		this.contentSVG.style.height = this.contentDiv.clientHeight;
		this.adjustContentPosition();
		this.queueTiles();
	};
window.onload=function(){
	console.log('create riffShare2d');
	window.riffShare2d=new RiffShare2D();	
	window.riffShare2d.init();
};
