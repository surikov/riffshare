console.log('draw v1.07');
var svgns = "http://www.w3.org/2000/svg";
function addSVGRectangle(me, x, y, w, h, to) {
	var target = to || me.contentSVG;
	var rect = document.createElementNS(me.svgns, 'rect');
	rect.setAttributeNS(null, 'x', x);
	rect.setAttributeNS(null, 'y', y);
	rect.setAttributeNS(null, 'height', h);
	rect.setAttributeNS(null, 'width', w);
	rect.setAttributeNS(null, 'fill', '#' + Math.round(0xffffff * Math.random()).toString(16));
	//me.contentSVG.appendChild(rect);
	target.appendChild(rect);
	return rect;
};

function tileSpot( me,x, y, w, h, layer, id) {
	if (!me.childExists(id, layer)) {
		var g = document.createElementNS(svgns, 'g');
		g.id=id;
		layer.appendChild(g);
		var rect = document.createElementNS(svgns, 'rect');
		rect.setAttributeNS(null, 'x', x);
		rect.setAttributeNS(null, 'y', y);
		rect.setAttributeNS(null, 'height', h);
		rect.setAttributeNS(null, 'width', w);
		rect.setAttributeNS(null, 'fill', 'rgba(255,0,0,0.25)');
		//me.contentSVG.appendChild(rect);
		var s=w;
		if(h<w)s=h;
		g.appendChild(rect);
		var txt = document.createElementNS(svgns, 'text');
		txt.setAttributeNS(null, 'x', x);
		txt.setAttributeNS(null, 'y', y);
		txt.setAttributeNS(null, 'font-size', s/5);
		txt.setAttributeNS(null, 'alignment-baseline', 'text-before-edge');
		txt.innerHTML = ''+id;
		g.appendChild(txt);
	}
}
function tileTextLabel( x, y, s, t, layer, id) {
		var txt = document.createElementNS(svgns, 'text');
		txt.setAttributeNS(null, 'x', x);
		txt.setAttributeNS(null, 'y', y);
		txt.setAttributeNS(null, 'font-size', s);
		txt.setAttributeNS(null, 'alignment-baseline', 'text-before-edge');
		txt.innerHTML = t;
		txt.id=id;
		layer.appendChild(txt);
}
function addSVGText(me, x, y, s, t, to) {
	var target = to || me.contentSVG;
	var txt = document.createElementNS(me.svgns, 'text');
	txt.setAttributeNS(null, 'x', x);
	txt.setAttributeNS(null, 'y', y);
	txt.setAttributeNS(null, 'font-size', s);
	//txt.setAttributeNS(null,'alignment-baseline','central');
	txt.setAttributeNS(null, 'alignment-baseline', 'text-before-edge');
	txt.innerHTML = t;
	//me.contentSVG.appendChild(txt);
	target.appendChild(txt);
	return txt;
};
function addSVGCircle(me, cx, cy, r, to) {
	var target = to || me.contentSVG;
	var shape = document.createElementNS(me.svgns, 'circle');
	shape.setAttributeNS(null, 'cx', cx);
	shape.setAttributeNS(null, 'cy', cy);
	shape.setAttributeNS(null, 'r', r);
	shape.setAttributeNS(null, 'fill', 'none');
	shape.setAttributeNS(null, 'stroke', 'black');
	shape.setAttributeNS(null, 'stroke-width', '1');
	//me.contentSVG.appendChild(shape);
	target.appendChild(shape);
	return shape;
};
function addSVGFillCircle(me, cx, cy, r, to, color) {
	var target = to || me.contentSVG;
	var shape = document.createElementNS(me.svgns, 'circle');
	shape.setAttributeNS(null, 'cx', cx);
	shape.setAttributeNS(null, 'cy', cy);
	shape.setAttributeNS(null, 'r', r);
	color = color || '#000000';
	//shape.setAttributeNS(null, 'fill', color);
	shape.setAttributeNS(null, 'fill', 'none');
	shape.setAttributeNS(null, 'stroke', color); //'#' + Math.round(0xffffff * Math.random()).toString(16));//color);
	shape.setAttributeNS(null, 'stroke-width', r / 19);
	//me.contentSVG.appendChild(shape);
	target.appendChild(shape);
	return shape;
};
function addSVGPath(me, points, to, color) {
	var target = to || me.contentSVG;
	var shape = document.createElementNS(me.svgns, 'path');
	color = color || '#000000';
	shape.setAttributeNS(null, 'fill', color);
	shape.setAttributeNS(null, 'stroke', 'none');
	shape.setAttributeNS(null, 'stroke-width', '0');
	shape.setAttributeNS(null, 'd', points);
	target.appendChild(shape);
}
function addSVGGroup(me, to) {
	var target = to || me.contentSVG;
	var g = document.createElementNS(me.svgns, 'g');
	//me.contentSVG.appendChild(g);
	target.appendChild(g);
	return g;
};
