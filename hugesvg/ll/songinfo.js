console.log('songinfo 1.01');
function SongInfo(){
	var sng=this;
	sng.normalColor='#000000';
	sng.backColor='#999999';
	sng.handlerColor='#000099';
	sng.commentColor='#009900';
	sng.warningColor='#990000';
	sng.tracks=[{name:'First'},{name:'Synth'},{name:'Distortion second'},{name:'Overdrive third'},{name:'Solo'},{name:'Rhythm'},{name:'Bass fourth'},{name:'Drums'}];
	/*sng.trackCount=function(){
		return 7;
	};*/
	sng.duration16=function(){
		return 16*300;
	};
	sng.tileTrackLayers=function(me){
		for(var i=0;i<sng.tracks.length;i++){
			var id='track'+i+'label';
			if (!me.childExists(id, me.layerHugeBack)) {
				//tileTextLabel(me.tapSize*1,me.tapSize*(1+i*30),me.tapSize*22,sng.tracks[i].name,me.layerHugeBack,id);
				tileSpot(me,me.tapSize*1,me.tapSize*(1+i*30),me.tapSize*100,me.tapSize*29,me.layerHugeFront,id);
			}
		}
	};
	
	sng.tileTitle=function(me,layer){
		var tileID='songTitle';
		if(!me.childExists(tileID,layer)){
			var g=addSVGGroup(me,layer);
			//me.setTransform(g,0,0);
			//g.tileLevel=tileLevel;
			//g.tileID=tileID;
			g.id=tileID;
			
			g.tileLeft=0;//1999;
			g.tileTop=0;//200;
			//me.setTransform(g,1999,200);
			//g.tileWidth=me.tapSize*100;
			//g.tileHeight=me.tapSize*50;
			//var c=addSVGFillCircle(me, tileSize/2, tileSize/2, tileSize /2,g,color);
			var r=addSVGRectangle(me, 0, 0, me.tapSize*5, me.tapSize*5,g);
			var t=addSVGText(me, 0, 0, me.tapSize, 'String for testing',g);
			//console.log('bb',g.getBBox());
			//return 'Song for testing';
			//var len=t.getComputedTextLength();
			
			for(var i=0;i<sng.tracks.length;i++){
				var t=addSVGText(me, 0,  me.tapSize*(1+i*1),me.tapSize, sng.tracks[i].name,g);
			}
			
			var tbb=g.getBBox();
			//console.log('tbb',tbb);
			r.setAttributeNS(null, 'width', tbb.width);
			r.setAttributeNS(null, 'height', tbb.height);
			r.setAttributeNS(null, 'x', tbb.x);
			r.setAttributeNS(null, 'y', tbb.y);
			/*
			g.tileWidth=tbb.width;
			g.tileHeight=tbb.height;
			g.tileLeft=tbb.x;
			g.tileTop=tbb.y;
			*/
		}
	};
	console.log(sng);
	return sng;
}
