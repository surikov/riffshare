console.log('start');
var a1 = new TileLevel("contentSVG", 'cntnt');
a1.resetInnerSize(4000, 3000);
var bg = a1.addLayer();
var songData = new SongData();
a1.addZoomLevel(3, function (left, top, width, height) {
	console.log('render', 3, a1.translateZ);
	tileBackground0(left, top, width, height, songData, a1, bg);
});
a1.addZoomLevel(7, function (left, top, width, height) {
	console.log('render', 7, a1.translateZ);
	tileBackground1(left, top, width, height, songData, a1, bg);
});
a1.addZoomLevel(15, function (left, top, width, height) {
	console.log('render', 15, a1.translateZ);
	tileBackground2(left, top, width, height, songData, a1, bg);
});
a1.addZoomLevel(50, function (left, top, width, height) {
	console.log('render', 50, a1.translateZ);
	tileBackground3(left, top, width, height, songData, a1, bg);
});
a1.addZoomLevel(99, function (left, top, width, height) {
	console.log('render', 99, a1.translateZ);
	tileBackground4(left, top, width, height, songData, a1, bg);
});
function tileBackground0(left, top, width, height, songData, tileLevel, layer) {
	var tg = tileLevel.tileGroup(0, 0, songData.songWidth(), songData.songHeight(), 'bg1', layer, left, top, width, height);
	if (tg) {
		tileLevel.tileRectangle(tg.g, tg.x, tg.y, tg.w, tg.h, '#ff9');
	}
}
function tileBackground1(left, top, width, height, songData, tileLevel, layer) {
	var tg = tileLevel.tileGroup(0, 0, songData.songWidth(), songData.songHeight(), 'bg1', layer, left, top, width, height);
	if (tg) {
		tileLevel.tileRectangle(tg.g, tg.x, tg.y, tg.w, tg.h, '#fcf');
	}
}
function tileBackground2(left, top, width, height, songData, tileLevel, layer) {
	var tg = tileLevel.tileGroup(0, 0, songData.songWidth(), songData.songHeight(), 'bg1', layer, left, top, width, height);
	if (tg) {
		tileLevel.tileRectangle(tg.g, tg.x, tg.y, tg.w, tg.h, '#cf9');
	}
}
function tileBackground3(left, top, width, height, songData, tileLevel, layer) {
	var tg = tileLevel.tileGroup(0, 0, songData.songWidth(), songData.songHeight(), 'bg1', layer, left, top, width, height);
	if (tg) {
		tileLevel.tileRectangle(tg.g, tg.x, tg.y, tg.w, tg.h, '#cc9');
	}
}
function tileBackground4(left, top, width, height, songData, tileLevel, layer) {
	var tg = tileLevel.tileGroup(0, 0, songData.songWidth(), songData.songHeight(), 'bg1', layer, left, top, width, height);
	if (tg) {
		tileLevel.tileRectangle(tg.g, tg.x, tg.y, tg.w, tg.h, '#fcc');
	}
}
function SongData() {
	return this;
}
SongData.prototype.songWidth = function () {
	return 19000;
};
SongData.prototype.songHeight = function () {
	return 4000;
};
SongData.prototype.trackCount = function () {
	return 3;
};
SongData.prototype.trackY = function (nn) {
	if(nn==0){
		return 0;
	}
	return 1000;
};
