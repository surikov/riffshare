console.log('songinfo 1');
function SongInfo(){
	var sng=this;
	sng.normalColor='#000000';
	sng.backColor='#999999';
	sng.handlerColor='#000099';
	sng.commentColor='#009900';
	sng.warningColor='#990000';
	sng.tracks=[{name:'Synth'},{name:'Synth'},{name:'Distortion guitar'},{name:'Overdrive guitar'},{name:'Solo'},{name:'Rhythm'},{name:'Bass guitar'},{name:'Drums'}];
	sng.trackCount=function(){
		return 7;
	};
	sng.songDuration16=function(){
		return 16*300;
	};
	sng.tileTitle=function(me,layer){
		var tileID='songTitle';
		if(!me.childExists(tileID,layer)){
			var g=addSVGGroup(me,layer);
			me.setTransform(g,0,0);
			//g.tileLevel=tileLevel;
			g.tileID=tileID;
			g.tileLeft=0;
			g.tileTop=0;
			g.tileWidth=me.tapSize*100;
			g.tileHeight=me.tapSize*50;
			//var c=addSVGFillCircle(me, tileSize/2, tileSize/2, tileSize /2,g,color);
			var r=addSVGRectangle(me, 0, 0, me.tapSize*50, me.tapSize*50,g);
			var t=addSVGText(me, 0, 0, me.tapSize*50, 'Song for testing',g);
			//console.log('bb',t.getBBox());
			//return 'Song for testing';
			//var len=t.getComputedTextLength();
			var tbb=t.getBBox();
			r.setAttributeNS(null, 'width', tbb.width);
			r.setAttributeNS(null, 'height', tbb.height);
			r.setAttributeNS(null, 'x', tbb.x);
			r.setAttributeNS(null, 'y', tbb.y);
			g.tileWidth=tbb.width;
			g.tileHeight=tbb.height;
			g.tileLeft=tbb.x;
			g.tileTop=tbb.y;
		}
	};
	console.log(sng);
	return sng;
}
