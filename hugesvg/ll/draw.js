	function addSVGRectangle(me,x, y, w, h) {
		var rect = document.createElementNS(me.svgns, 'rect');
		rect.setAttributeNS(null, 'x', x);
		rect.setAttributeNS(null, 'y', y);
		rect.setAttributeNS(null, 'height', w);
		rect.setAttributeNS(null, 'width', h);
		rect.setAttributeNS(null, 'fill', '#' + Math.round(0xffffff * Math.random()).toString(16));
		me.contentSVG.appendChild(rect);
		return rect;
	};
	function addSVGText  (me,x, y, s,t) {
		var txt = document.createElementNS(me.svgns, 'text');
		txt.setAttributeNS(null, 'x', x);
		txt.setAttributeNS(null, 'y', y);
		txt.setAttributeNS(null,'font-size',s);
		txt.setAttributeNS(null,'alignment-baseline','central');
		txt.innerHTML = t;
		me.contentSVG.appendChild(txt);
	};
	function addSVGCircle (me,cx, cy, r) {
		var shape = document.createElementNS(me.svgns, "circle");
		shape.setAttributeNS(null, "cx", cx);
		shape.setAttributeNS(null, "cy", cy);
		shape.setAttributeNS(null, "r", r);
		shape.setAttributeNS(null, "fill", "none");
		shape.setAttributeNS(null, "stroke", "black");
		shape.setAttributeNS(null, "stroke-width", "1");
		me.contentSVG.appendChild(shape);
		return shape;
	};
	function addSVGFillCircle  (me,cx, cy, r) {
		var shape = document.createElementNS(me.svgns, "circle");
		shape.setAttributeNS(null, "cx", cx);
		shape.setAttributeNS(null, "cy", cy);
		shape.setAttributeNS(null, "r", r);
		shape.setAttributeNS(null, "fill", "black");
		shape.setAttributeNS(null, "stroke", "none");
		shape.setAttributeNS(null, "stroke-width", "0");
		me.contentSVG.appendChild(shape);
		return shape;
	};
