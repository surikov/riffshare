console.log('riffShare2d v1.89');
function r2dStart() {
	console.log('riffShare2d start');
	window.r2d = this;
	r2d.tapSize = 32;
	try {
		console.log('window.devicePixelRatio', window.devicePixelRatio);
		var pixelRatio = window.devicePixelRatio;
		r2d.tapSize = 30 * pixelRatio;
		if (isNaN(r2d.tapSize)) {
			r2d.tapSize = 51;
		}

	} catch (ex) {
		console.log(ex);
	}
	r2d.svgns = "http://www.w3.org/2000/svg";
	r2d.contentSVG = document.getElementById('contentSVG');
	r2d.bgGroup = document.getElementById('bg');
	window.onresize = function () {
		r2dResize();
	};
	window.onunload = function () {
		r2dUnload();
	};
	var g = rakeGroup(0, 0, 300, 400, 'id', r2d.bgGroup, 0, 0, 300, 400);
	if (g) {
		tileLine(g, r2d.tapSize/2, r2d.tapSize/2, 300-r2d.tapSize/2, 400-r2d.tapSize/2, 'red', r2d.tapSize/2);
	}
	console.log('riffShare2d done');
}
function r2dUnload() {
	//
}
function r2dResize() {
	//
}
function tileLine  (g, x1, y1, x2, y2, strokeColor, strokeWidth) {
	//console.log('tileLine',g, x1, y1, x2, y2, strokeColor, strokeWidth);
	var line = document.createElementNS(r2d.svgns, 'line');
	line.setAttributeNS(null, 'x1', x1);
	line.setAttributeNS(null, 'y1', y1);
	line.setAttributeNS(null, 'x2', x2);
	line.setAttributeNS(null, 'y2', y2);
	if (strokeColor) {
		line.setAttributeNS(null, 'stroke', strokeColor);
	}
	if (strokeWidth) {
		line.setAttributeNS(null, 'stroke-width', strokeWidth);
	}
	line.setAttributeNS(null, 'stroke-linecap', 'round');
	g.appendChild(line);
};
function rakeGroup(x, y, w, h, id, layer, left, top, width, height) {
	//console.log('rakeGroup',x, y, w, h, id, layer, left, top, width, height);
	if (collision(x, y, w, h, left, top, width, height)) {
		if (!childExists(id, layer)) {
			var g = document.createElementNS(r2d.svgns, 'g');
			g.id = id;
			layer.appendChild(g);
			return g;
		} else {
			//
		}
	}
	return null;
};
function collision(x1, y1, w1, h1, x2, y2, w2, h2) {
	if (x1 + w1 < x2 //
		 || x1 > x2 + w2 //
		 || y1 + h1 < y2 //
		 || y1 > y2 + h2 //
	)
	{
		return false;
	} else {
		return true;

	}
};
function childExists(id, layer) {
	for (var i = 0; i < layer.children.length; i++) {
		var t = layer.children[i];
		if (t.id == id) {
			return true;
		}
	}
	return false;
};
r2dStart();
