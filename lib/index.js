console.log('start');
var a1 = new TileLevel("contentSVG", 'cntnt');
a1.resetInnerSize(4000, 3000);
var bg = a1.addLayer();
a1.addZoomLevel(5, function (left, top, width, height) {
	console.log('render', 5, a1.translateZ);
	var x = 0;
	var y = 0;
	var w = 4000;
	var h = 3000;
	var g = a1.rakeGroup(x, y, w, h, 'bg1', bg, left, top, width, height);
	if (g) {
		a1.tileRectangle(g, x, y, w, h, '#f96');
	}
});
a1.addZoomLevel(99, function (left, top, width, height) {
	console.log('render', 99, a1.translateZ);
	var x = 0;
	var y = 0;
	var w = 4000;
	var h = 3000;
	var g = a1.rakeGroup(x, y, w, h, 'bg1', bg, left, top, width, height);
	if (g) {
		a1.tileRectangle(g, x, y, w, h, '#f96');
	}
});
