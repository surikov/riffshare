console.log('songinfo 1.01');
function SongInfo() {
	var sng = this;
	sng.normalColor = '#000000';
	sng.backColor = '#999999';
	sng.handlerColor = '#000099';
	sng.commentColor = '#009900';
	sng.warningColor = '#990000';
	sng.trackHeight = 17;
	sng.trackMargin = 100;
	sng.tracks = [{
			name : 'First'
		}, {
			name : 'Synth'
		}, {
			name : 'Distortion second'
		}, {
			name : 'Overdrive third'
		}, {
			name : 'Solo'
		}, {
			name : 'Rhythm'
		}, {
			name : 'Bass fourth'
		}, {
			name : 'Drums'
		}
	];
	sng.measures = [];
	for (var i = 0; i < 300; i++) {
		sng.measures.push({
			meter32 : 32,
			tempo : 120
		});
	}
	sng.measures[64].meter32 = 12;
	sng.measures[128].meter32 = 12;
	sng.measures[192].meter32 = 12;
	for (var i = 250; i < 270; i++) {
		sng.measures[i].tempo = 200;
	}
	/*sng.trackCount=function(){
	return 7;
	};*/
	sng.duration32 = function () {
		var m = 0;
		for (var i = 0; i<sng.measures.length; i++) {
			m = m + sng.measures[i].meter32;
		}
		//console.log('duration32',m);
		return m;
		
	};
	sng.tileTrackNames = function (me, left, top, width, height, layer) {
		var x = 0;
		var y = 0;
		var w = me.tapSize * sng.trackMargin;
		var h = me.innerHeight;
		if (!me.outOfRect(x, y, w, h, left, top, width, height)) {
			for (var i = 0; i < sng.tracks.length; i++) {
				var id = 'trackName' + i;
				x = 0;
				y = me.tapSize * i * sng.trackHeight;
				w = me.tapSize * sng.trackMargin;
				h = me.tapSize * sng.trackHeight;
				if (!me.outOfRect(x, y, w, h, left, top, width, height)) {
					if (!me.childExists(id, layer)) {
						tileSpot(me, x, y, w - me.tapSize, h - me.tapSize, layer, id);
					}
				}
			}
		}
	};
	sng.tileNoteLines = function (me, left, top, width, height, layer) {
		var d32=sng.duration32();
		var x = me.tapSize * sng.trackMargin;
		var y = 0;
		var w = d32*me.tapSize;//me.innerWidth - me.tapSize * sng.trackMargin;
		var h = sng.tracks.length * me.tapSize * sng.trackHeight;
		//var d = 16;
		if (!me.outOfRect(x, y, w, h, left, top, width, height)) {
			for (var n = 0; n < sng.tracks.length; n++) {
				var id='line'+n+'x0';
				if (!me.childExists(id, layer)) {
					tileRectangle(me, '#000000',x,n* me.tapSize * sng.trackHeight,w,2*me.tapSize,layer,id);
				}
			}
			var i=0;
			for (var k = 0; k < sng.measures.length; k++) {
				x = me.tapSize * sng.trackMargin + i * me.tapSize;
				y = 0;
				w = sng.measures[k].meter32 * me.tapSize;
				h = sng.tracks.length * me.tapSize * sng.trackHeight;
				if (!me.outOfRect(x, y, w, h, left, top, width, height)) {
					for (var n = 0; n < sng.tracks.length; n++) {
						var id = 'm' + k + 'x' + n;
						//tileSpot(me, x, n * sng.trackHeight * me.tapSize, w - me.tapSize, (sng.trackHeight-1) * me.tapSize, layer, id);
						//console.log(id,w);
					}
				}
				i=i+sng.measures[k].meter32;
			}
		}
	};
	sng.tileNoteParts = function (me, left, top, width, height, layer) {
		var x = me.tapSize * sng.trackMargin;
		var y = 0;
		var w = me.innerWidth - me.tapSize * sng.trackMargin;
		var h = sng.tracks.length * me.tapSize * sng.trackHeight;
		var d = 16;
		var c = 50;
		if (!me.outOfRect(x, y, w, h, left, top, width, height)) {
			for (var i = 0; i < 300; i = i + c) {
				x = me.tapSize * sng.trackMargin + i * d * me.tapSize;
				y = 0;
				w = c * d * me.tapSize;
				h = sng.tracks.length * me.tapSize * sng.trackHeight;
				if (!me.outOfRect(x, y, w, h, left, top, width, height)) {
					for (var n = 0; n < sng.tracks.length; n++) {
						var id = 'p' + i + 'x' + n;
						tileSpot(me, x, n * sng.trackHeight * me.tapSize, w - me.tapSize, (sng.trackHeight-1) * me.tapSize, layer, id);
						//console.log(id,w);
					}
				}
			}
		}
	};
	sng.tileRollCells = function (me, left, top, width, height, layer) {
		var x = me.tapSize * sng.trackMargin;
		var y = sng.tracks.length * me.tapSize * sng.trackHeight;
		var w = me.innerWidth - me.tapSize * sng.trackMargin;
		var h = me.innerHeight - sng.tracks.length * me.tapSize * sng.trackHeight;
		var d = 16;
		var c = 1;
		if (!me.outOfRect(x, y, w, h, left, top, width, height)) {
			//console.log('add tileRollCells',x, y, w, h, left, top, width, height);
			for (var i = 0; i < 300; i = i + c) {
				x = me.tapSize * sng.trackMargin + i * d * me.tapSize;
				y = sng.tracks.length * sng.trackHeight * me.tapSize;
				w = c * d * me.tapSize;
				h = 128 * me.tapSize;
				if (!me.outOfRect(x, y, w, h, left, top, width, height)) {
					for (var n = 0; n < 10; n++) {
						var id = 'o' + i + 'x' + n;
						tileSpot(me, x, y + n * 12 * me.tapSize, w - me.tapSize, 11 * me.tapSize, layer, id);
						//console.log(id,x, y+n * 12 * me.tapSize, 600+w - me.tapSize, 101 * me.tapSize);
					}
				}
			}
		} else {
			//console.log('no tileRollCells',x, y, w, h, left, top, width, height);
		}
	};
	sng.addHugeTiles = function (me, left, top, width, height) {
		sng.tileTrackNames(me, left, top, width, height, me.layerHugeFront);
		sng.tileNoteParts(me, left, top, width, height, me.layerHugeFront);
		//sng.tileRollCells(me, left, top, width, height, me.layerHugeFront)
	}
	sng.addLargeTiles = function (me, left, top, width, height) {
		sng.tileTrackNames(me, left, top, width, height, me.layerLargeFront);
		sng.tileNoteLines(me, left, top, width, height, me.layerLargeFront);
		//sng.tileRollCells(me, left, top, width, height, me.layerLargeFront)
	}
	sng.addMediumTiles = function (me, left, top, width, height) {
		sng.tileTrackNames(me, left, top, width, height, me.layerMediumFront);
		sng.tileNoteLines(me, left, top, width, height, me.layerMediumFront);
		//sng.tileRollCells(me, left, top, width, height, me.layerMediumFront)
	}
	sng.addSmallTiles = function (me, left, top, width, height) {
		sng.tileTrackNames(me, left, top, width, height, me.layerSmallFront);
		sng.tileNoteLines(me, left, top, width, height, me.layerSmallFront);
		//sng.tileRollCells(me, left, top, width, height, me.layerSmallFront)
	}

	sng.tileTrackLayers = function (me) {
		/*for(var i=0;i<sng.tracks.length;i++){
		var id='track'+i+'label';
		if (!me.childExists(id, me.layerHugeBack)) {
		//tileTextLabel(me.tapSize*1,me.tapSize*(1+i*30),me.tapSize*22,sng.tracks[i].name,me.layerHugeBack,id);
		tileSpot(me,me.tapSize*1,me.tapSize*(1+i*30),me.tapSize*100,me.tapSize*29,me.layerHugeFront,id);
		}
		id='line'+i+'label';
		if (!me.childExists(id, me.layerHugeBack)) {
		tileSpot(me,me.tapSize*102,me.tapSize*(1+i*30),me.tapSize*(16*300-102),me.tapSize*10,me.layerHugeFront,id);
		}
		}
		var cnt=0;
		for(var i=102;i<sng.duration16();i=i+16){
		var id='m'+cnt;
		if (!me.childExists(id, me.layerHugeBack)) {
		tileSpot(me,me.tapSize*i,me.tapSize*(2+sng.tracks.length*30),me.tapSize*15,me.tapSize*128,me.layerHugeFront,id);
		}
		cnt++;
		}
		cnt=0;
		for(var i=0;i<128;i=i+12){
		var id='octave'+cnt;
		if (!me.childExists(id, me.layerHugeBack)) {
		tileSpot(me,me.tapSize*102,me.tapSize*(12+i+2+sng.tracks.length*30),me.tapSize*(16*300-102),me.tapSize*11,me.layerHugeFront,id);
		}
		cnt++;
		}
		tileSpot(me,me.tapSize*(102+16+0),   me.tapSize*(12+2+2+sng.tracks.length*30),    me.tapSize*3.8,   me.tapSize*1,    me.layerHugeFront,'n1');
		tileSpot(me,me.tapSize*(102+16+4),   me.tapSize*(12+2+2+sng.tracks.length*30-4),    me.tapSize*1.8,   me.tapSize*1,    me.layerHugeFront,'n2');
		tileSpot(me,me.tapSize*(102+16+6),   me.tapSize*(12+2+2+sng.tracks.length*30-4),    me.tapSize*1.8,   me.tapSize*1,    me.layerHugeFront,'n3');
		tileSpot(me,me.tapSize*(102+16+8),   me.tapSize*(12+2+2+sng.tracks.length*30+7),    me.tapSize*3.8,   me.tapSize*1,    me.layerHugeFront,'n4');
		tileSpot(me,me.tapSize*(102+16+12),   me.tapSize*(12+2+2+sng.tracks.length*30+2),    me.tapSize*1.8,   me.tapSize*1,    me.layerHugeFront,'n5');
		tileSpot(me,me.tapSize*(102+16+14),   me.tapSize*(12+2+2+sng.tracks.length*30+2),    me.tapSize*1.8,   me.tapSize*1,    me.layerHugeFront,'n6');

		tileSpot(me,me.tapSize*(102+16+0),   me.tapSize*(12+2+2+sng.tracks.length*30+0.5),    me.tapSize*0.5,   me.tapSize*0.5,    me.layerHugeFront,'s1');
		tileSpot(me,me.tapSize*(102+16+4),   me.tapSize*(12+2+2+sng.tracks.length*30-4+0.5),    me.tapSize*0.5,   me.tapSize*0.5,    me.layerHugeFront,'s2');
		tileSpot(me,me.tapSize*(102+16+6),   me.tapSize*(12+2+2+sng.tracks.length*30-4+0.5),    me.tapSize*0.5,   me.tapSize*0.5,    me.layerHugeFront,'s3');
		tileSpot(me,me.tapSize*(102+16+8),   me.tapSize*(12+2+2+sng.tracks.length*30+7+0.5),    me.tapSize*0.5,   me.tapSize*0.5,    me.layerHugeFront,'s4');
		tileSpot(me,me.tapSize*(102+16+12),   me.tapSize*(12+2+2+sng.tracks.length*30+2+0.5),    me.tapSize*0.5,   me.tapSize*0.5,    me.layerHugeFront,'s5');
		tileSpot(me,me.tapSize*(102+16+14),   me.tapSize*(12+2+2+sng.tracks.length*30+2+0.5),    me.tapSize*0.5,   me.tapSize*0.5,    me.layerHugeFront,'s6');
		 */
	};

	sng.tileTitle = function (me, layer) {
		var tileID = 'songTitle';
		if (!me.childExists(tileID, layer)) {
			var g = addSVGGroup(me, layer);
			//me.setTransform(g,0,0);
			//g.tileLevel=tileLevel;
			//g.tileID=tileID;
			g.id = tileID;

			g.tileLeft = 0; //1999;
			g.tileTop = 0; //200;
			//me.setTransform(g,1999,200);
			//g.tileWidth=me.tapSize*100;
			//g.tileHeight=me.tapSize*50;
			//var c=addSVGFillCircle(me, tileSize/2, tileSize/2, tileSize /2,g,color);
			var r = addSVGRectangle(me, 0, 0, me.tapSize * 5, me.tapSize * 5, g);
			var t = addSVGText(me, 0, 0, me.tapSize, 'String for testing', g);
			//console.log('bb',g.getBBox());
			//return 'Song for testing';
			//var len=t.getComputedTextLength();

			for (var i = 0; i < sng.tracks.length; i++) {
				var t = addSVGText(me, 0, me.tapSize * (1 + i * 1), me.tapSize, sng.tracks[i].name, g);
			}

			var tbb = g.getBBox();
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
