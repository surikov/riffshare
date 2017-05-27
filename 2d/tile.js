console.log('tile v1.01');
RiffShare2D.prototype.tilePlaceHolder = function (x,y,w,h,id,layer, left, top, width, height) {
	if (this.collision(x, y, w, h, left, top, width, height)) {
		if (!this.childExists(id, layer)) {
			var s=w;
			if(h<w){
				s=h;
			}
			var g = document.createElementNS(this.svgns, 'g');
			g.id=id;
			layer.appendChild(g);
			var rect = document.createElementNS(this.svgns, 'rect');
			rect.setAttributeNS(null, 'x', x);
			rect.setAttributeNS(null, 'y', y);
			rect.setAttributeNS(null, 'height', h);
			rect.setAttributeNS(null, 'width', w);
			rect.setAttributeNS(null, 'fill', 'rgba(255,0,0,0.25)');
			rect.setAttributeNS(null, 'stroke', '#f00');
			rect.setAttributeNS(null, 'stroke-width', s/30);
			g.appendChild(rect);
			var txt = document.createElementNS(this.svgns, 'text');
			txt.setAttributeNS(null, 'x', x);
			txt.setAttributeNS(null, 'y', y);
			txt.setAttributeNS(null, 'font-size', s/3);
			txt.setAttributeNS(null, 'alignment-baseline', 'text-before-edge');
			txt.innerHTML = ''+id;
			g.appendChild(txt);
		}
	}
};
