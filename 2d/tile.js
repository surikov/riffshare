console.log('tile v1.01');
RiffShare2D.prototype.tilePlaceHolder = function (x, y, w, h, id, layer, left, top, width, height,ratio) {
	var g = this.rakeGroup(x, y, w, h, id, layer, left, top, width, height);
	if (g) {
		var s = w;
		if (h < w) {
			s = h;
		}
		this.tileRectangle(g, x, y, w, h, 'rgba(255,0,0,0.25)', '#f00', this.lineWidth*ratio);//s / 30);
		this.tileText(g, x, y, ratio*100, id);
		/*this.tileLine(g, x, y + h, x + w, y, '#0f0', s / 30);
		this.tileCircle(g, x + w, y + h, s / 30, '#00f');
		this.addSpot(id, x + w - s / 30, y + h - s / 30, 2 * s / 30, 2 * s / 30, function () {
			console.log(id, 'clicked');
		});*/
	}
};
RiffShare2D.prototype.rakeGroup = function (x, y, w, h, id, layer, left, top, width, height) {
	if (this.collision(x, y, w, h, left, top, width, height)) {
		if (!this.childExists(id, layer)) {
			var g = document.createElementNS(this.svgns, 'g');
			g.id = id;
			layer.appendChild(g);
			return g;
		}
	}
	return null;
};


RiffShare2D.prototype.tileText = function (g, x, y, n, m, f, s, t) {
	var txt = document.createElementNS(this.svgns, 'text');
	txt.setAttributeNS(null, 'x', x);
	txt.setAttributeNS(null, 'y', y);
	txt.setAttributeNS(null, 'font-size', n);
	txt.setAttributeNS(null, 'alignment-baseline', 'text-before-edge');
	txt.setAttributeNS(null, 'text-anchor', 'start');
	if (f) {
		txt.setAttributeNS(null, 'fill', f);
	}
	if (s) {
		txt.setAttributeNS(null, 'stroke', s);
	}
	if (t) {
		txt.setAttributeNS(null, 'stroke-width', t);
	}
	txt.innerHTML = m;
	g.appendChild(txt);
};
RiffShare2D.prototype.tileRectangle = function (g, x, y, w, h, f, s, t) {
	var rect = document.createElementNS(this.svgns, 'rect');
	rect.setAttributeNS(null, 'x', x);
	rect.setAttributeNS(null, 'y', y);
	rect.setAttributeNS(null, 'height', h);
	rect.setAttributeNS(null, 'width', w);
	if (f) {
		rect.setAttributeNS(null, 'fill', f);
	}
	if (s) {
		rect.setAttributeNS(null, 'stroke', s);
	}
	if (t) {
		rect.setAttributeNS(null, 'stroke-width', t);
	}
	g.appendChild(rect);
};
RiffShare2D.prototype.tileCircle = function (g, x, y, r, f, s, t) {
	var circle = document.createElementNS(this.svgns, 'circle');
	circle.setAttributeNS(null, 'cx', x);
	circle.setAttributeNS(null, 'cy', y);
	circle.setAttributeNS(null, 'r', r);
	if (f) {
		circle.setAttributeNS(null, 'fill', f);
	}
	if (s) {
		circle.setAttributeNS(null, 'stroke', s);
	}
	if (t) {
		circle.setAttributeNS(null, 'stroke-width', t);
	}
	g.appendChild(circle);
};
RiffShare2D.prototype.tileLine = function (g, x1, y1, x2, y2, s, t) {
	var line = document.createElementNS(this.svgns, 'line');
	line.setAttributeNS(null, 'x1', x1);
	line.setAttributeNS(null, 'y1', y1);
	line.setAttributeNS(null, 'x2', x2);
	line.setAttributeNS(null, 'y2', y2);
	if (s) {
		line.setAttributeNS(null, 'stroke', s);
	}
	if (t) {
		line.setAttributeNS(null, 'stroke-width', t);
	}
	line.setAttributeNS(null, 'stroke-linecap', 'round');
	g.appendChild(line);
};
RiffShare2D.prototype.tileSymbol = function (g, x, y, w, h, href) {
	console.log(g, x, y, w, h, href);
	var use = document.createElementNS(this.svgns, 'use');
	use.setAttributeNS(null, 'x', x);
	use.setAttributeNS(null, 'y', y);
	use.setAttributeNS(null, 'width', w);
	use.setAttributeNS(null, 'height', h);
	use.setAttributeNS(null, 'href', href);
	use.setAttributeNS('xlink', 'href', href);
	g.appendChild(use);
};
