console.log('songinfo 1.01');
function SongInfo() {
	var sng = this;

	sng.gridColor = '#eee';
	sng.backColor = '#ccc';
	sng.foreColor = '#000';
	sng.spotColor = '#00f';

	sng.leftMargin = 20;
	sng.rightMargin = 50;
	sng.topMargin = 7;
	sng.bottomMargin = 10;

	sng.titleHeight = 30;
	sng.notationHeight = 30;
	sng.notationTop = 10;

	sng.textHeight = 3;
	sng.fretHeight = 18;
	sng.chordsHeight = 5;
	sng.pianorollHeight = 128;
	sng.title = 'Some not so long title';
	sng.selectedChannel=0;
	/*sng.tracks = [{
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
	tempo : 120,margin32:0
	});
	}
	sng.measures[64].meter32 = 12;
	sng.measures[128].meter32 = 12;
	sng.measures[192].meter32 = 12;
	sng.measures[0].margin32 = 8;
	sng.measures[64].margin32 = 8;
	sng.measures[128].margin32 = 8;
	sng.measures[192].margin32 = 8;
	for (var i = 250; i < 270; i++) {
	sng.measures[i].tempo = 200;
	}*/
	/*sng.trackCount=function(){
	return 7;
	};*/
	sng.duration32 = function () {
		var m = 0;
		for (var i = 0; i < song.positions.length; i++) {
			//m = m + sng.measures[i].meter32+ sng.measures[i].margin32;
			m = m + 2 * song.positions[i].meter * song.positions[i].by;
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
		var d32 = sng.duration32();
		var x = me.tapSize * sng.trackMargin;
		var y = 0;
		var w = d32 * me.tapSize; //me.innerWidth - me.tapSize * sng.trackMargin;
		var h = sng.tracks.length * me.tapSize * sng.trackHeight;
		//var d = 16;
		if (!me.outOfRect(x, y, w, h, left, top, width, height)) {
			for (var n = 0; n < sng.tracks.length; n++) {
				var id = 'line' + n + 'x0';
				if (!me.childExists(id, layer)) {
					tileRectangle(me, '#000000', x, n * me.tapSize * sng.trackHeight, w, 2 * me.tapSize, layer, id);
				}
			}
			var i = 0;
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
				i = i + sng.measures[k].meter32;
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
						tileSpot(me, x, n * sng.trackHeight * me.tapSize, w - me.tapSize, (sng.trackHeight - 1) * me.tapSize, layer, id);
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
	sng.addSongTitle = function (me, left, top, width, height, layer) {
		//var w = me.tapSize * (sng.leftMargin + sng.duration32() + sng.rightMargin);
		//var h = me.tapSize * (sng.topMargin + sng.titleHeight + sng.bottomMargin);
		var x = sng.leftMargin * me.tapSize;
		var y = sng.topMargin * me.tapSize;
		var w = me.tapSize * sng.duration32();
		var h = me.tapSize * sng.titleHeight;
		if (!me.outOfRect(0, 0, w, h, left, top, width, height)) {
			if (!me.childExists('title', layer)) {
				tileTextLabel(x, y, 33 * me.tapSize, song.name, layer, 'title', sng.backColor);
			}
		}
		//tilePlaceHolder(me,x, y,w-me.tapSize,h-me.tapSize,layer,'plTitle',left, top, width, height);
	}
	sng.addSmallMediumMeasureLines = function (me, left, top, width, height, layer, detailRatio, step) {
		var m = 0;
		for (var i = 0; i < song.positions.length; i++) {
			if (i % step == 0) {

				var x = (sng.leftMargin + m) * me.tapSize;
				var y = (sng.topMargin + sng.titleHeight) * me.tapSize;
				var w = 5 * me.tapSize;
				var h = (sng.notationHeight * song.channels.length + sng.textHeight + sng.fretHeight + sng.chordsHeight + sng.pianorollHeight) * me.tapSize;

				if (!me.outOfRect(x, y, w, h, left, top, width, height)) {
					var id = 'ms' + i;
					if (!me.childExists(id, layer)) {
						tileRectangle(sng.foreColor, x, y, me.lineWidth * detailRatio, h, layer, id);

					}
				}

				for (var ch = 0; ch < song.channels.length; ch++) {
					if (!me.outOfRect(x, y, w, h, left, top, width, height)) {
						id = 't' + i + 'x' + ch;
						if (!me.childExists(id, layer)) {
							tileTextLabel(x, y + ch * me.tapSize * sng.notationHeight, me.tapSize * 3 * detailRatio, ' ' + i, layer, id, sng.backColor);
						}
					}
				}
			}
			//m = m + sng.measures[i].meter32;
			m = m + 2 * song.positions[i].meter * song.positions[i].by;
		}
	}
	sng.addHugeLargeMeasureLines = function (me, left, top, width, height, layer, detailRatio, step) {
		var m = 0;
		for (var i = 0; i < song.positions.length; i++) {
			if (i % step == 0) {

				var x = (sng.leftMargin + m) * me.tapSize;
				var y = (sng.topMargin + sng.titleHeight) * me.tapSize;
				var w = me.lineWidth * detailRatio;
				var h = (sng.notationHeight * song.channels.length + sng.textHeight + sng.fretHeight + sng.chordsHeight + sng.pianorollHeight) * me.tapSize;

				if (!me.outOfRect(x, y, w, h, left, top, width, height)) {
					var id = 'ms' + i;

					if (!me.childExists(id, layer)) {
						//console.log(id);
						tileRectangle(sng.foreColor, x, y, w, h, layer, id);
						tileTextLabel(x, y, me.tapSize * 3 * detailRatio, ' ' + i, layer, id + 't', sng.backColor);
					}
				}
			}
			//m = m + sng.measures[i].meter32;
			m = m + 2 * song.positions[i].meter * song.positions[i].by;
		}
	}
	sng.addHugeFretLines = function (me, left, top, width, height, layer, detailRatio) {
		var channel = song.channels[sng.selectedChannel];
		var id = 'frt';
		var x = me.tapSize * sng.leftMargin;
		var y = me.tapSize * (sng.topMargin + sng.titleHeight + song.channels.length * sng.notationHeight );
		var w = sng.duration32() * me.tapSize;
		var h = channel.string.length*me.tapSize*3;
		//console.log(x, y, w, h);
		if (!me.outOfRect(x, y, w, h, left, top, width, height)) {
				if (!me.childExists(id, layer)) {
					tileRectangle(sng.gridColor, x, y, w, h, layer, id);
				}
			}

	}
	sng.addHugeNoteLines = function (me, left, top, width, height, layer, detailRatio) {
		for (var i = 0; i < song.channels.length; i++) {
			var channel = song.channels[i];
			var id = 'ntn' + i;
			var x = me.tapSize * sng.leftMargin;
			var y = me.tapSize * (sng.topMargin + sng.titleHeight + i * sng.notationHeight + sng.notationTop);
			var w = sng.duration32() * me.tapSize;
			var h = 5 * 2 * detailRatio * me.lineWidth;
			if (!me.outOfRect(x, y, w, h, left, top, width, height)) {
				if (!me.childExists(id, layer)) {
					tileRectangle(sng.gridColor, x, y, w, h, layer, id);
				}
			}

			id = 'ntnlbl' + i;
			if (!me.childExists(id, layer)) {
				x = me.tapSize * sng.leftMargin;
				y = me.tapSize * (sng.topMargin + sng.titleHeight + i * sng.notationHeight + sng.notationTop);
				w = sng.duration32() * me.tapSize;
				h = 5 * 2 * detailRatio * me.lineWidth;
				tileTextLabel(x, y, 0.5 * me.tapSize * sng.notationHeight, channel.channel + '/' + channel.track, layer, id, sng.backColor);
			}
		}
	};
	sng.addFretLines = function (me, left, top, width, height, layer, detailRatio) {
		var channel = song.channels[sng.selectedChannel];
		var id = 'frt';
		var x = me.tapSize * sng.leftMargin;
		
		var w = sng.duration32() * me.tapSize;
		var h = detailRatio * me.lineWidth;
		for(var i=0;i<channel.string.length;i++){
			var id = 'frt'+i;
			var y = me.tapSize * (sng.topMargin + sng.titleHeight + song.channels.length * sng.notationHeight +i*3);
			if (!me.outOfRect(x, y, w, h, left, top, width, height)) {
				if (!me.childExists(id, layer)) {
					tileRectangle(sng.foreColor, x, y, w, h, layer, id);
				}
			}
		}
	};
	sng.addNoteLines = function (me, left, top, width, height, layer, detailRatio) {
		for (var i = 0; i < song.channels.length; i++) {
			var channel = song.channels[i];

			var x = me.tapSize * sng.leftMargin;
			var y = me.tapSize * (sng.topMargin + sng.titleHeight + i * sng.notationHeight + sng.notationTop);
			var w = sng.duration32() * me.tapSize;
			var h = detailRatio * me.lineWidth;
			for (var s = 0; s < 5; s++) {

				//console.log(i,y);
				var id = 'ntn' + i + 'x' + s;
				if (!me.outOfRect(x, y, w, h, left, top, width, height)) {
					if (!me.childExists(id, layer)) {
						tileRectangle(sng.foreColor, x, y, w, h, layer, id);
						//tilePlaceHolder(me,x,y,w,me.tapSize,layer,id,left, top, width, height);
					}
				}
				y = y + 2 * me.tapSize;
			}

			id = 'ntnlbl' + i;
			if (!me.childExists(id, layer)) {
				x = me.tapSize * sng.leftMargin;
				y = me.tapSize * (sng.topMargin + sng.titleHeight + i * sng.notationHeight + sng.notationTop);
				w = sng.duration32() * me.tapSize;
				h = 5 * 2 * detailRatio * me.lineWidth;
				tileTextLabel(x, y, 0.5 * me.tapSize * sng.notationHeight, channel.channel + '/' + channel.track, layer, id, sng.backColor);
			}
		}
	};
	/*sng.addNoteSymbols = function (me, left, top, width, height, layer) {

	};*/
	sng.findMotif = function (id, song) {
		for (var i = 0; i < song.motifs.length; i++) {
			if (song.motifs[i].id == id) {
				return song.motifs[i];
			}
		}
		return null;
	};
	sng.pitch12to7 = function (pitch) {
		var octave = Math.floor(pitch / 12);
		var n12 = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6];
		var idx = pitch % 12;
		var r = n12[idx];
		var n7 = octave * 7 + r;
		//console.log(pitch,'/',octave,'* 12 +',idx,'=',octave,'* 7 +',r,'/',n7);
		return n7;
	};
	sng.channelStringKey=function(order,channel){
		for(var i=0;i<channel.string.length;i++){
			if(channel.string[i].order==order){
				return channel.string[i].pitch;
			}
		}
	};
	sng.fretLineColor=function(fret){
		var n=1*fret;
		//console.log(n,fret);
		//if(n>11)return '#aaa';
		if(n>6)return '#aaa';
		if(n>4)return '#999';
		if(n>2)return '#666';
		if(n>0)return '#333';
		
		
		
		
		return '#000';
	};
	sng.addFretMotif = function (me, id, x, y, motif, layer,offset,channel) {
		if (motif.chords.length > 0) {
			var svgns = "http://www.w3.org/2000/svg";
			var g = document.createElementNS(svgns, 'g');
			g.id = id;
			layer.appendChild(g);
			for (var c = 0; c < motif.chords.length; c++) {
				var chord = motif.chords[c];
				for (var n = 0; n < chord.notes.length; n++) {
					
					
					var note = chord.notes[n];
					var t=''+(note.key-offset-sng.channelStringKey(note.string,channel));//+':'+note.l6th;
					var colordeep=sng.fretLineColor(t);
					//var ny=y + me.tapSize * (sng.fretHeight - (channel.string.length-note.string-1)*3);
					var ny=y + me.tapSize * 3 * (channel.string.length-1)-me.tapSize * 3 *(channel.string.length-note.string);
					
					var line=document.createElementNS(svgns, 'line');
					line.setAttributeNS(null, 'x1', x + chord.start * 2 * me.tapSize + me.tapSize * 1);
					line.setAttributeNS(null, 'y1', ny);
					line.setAttributeNS(null, 'x2', x + chord.start * 2 * me.tapSize + me.tapSize * 1 + 1+2*me.tapSize*(note.l6th-1));
					line.setAttributeNS(null, 'y2', ny);
					line.setAttributeNS(null, 'stroke', colordeep);
					line.setAttributeNS(null, 'stroke-width', me.tapSize *2);
					line.setAttributeNS(null, 'stroke-linecap', 'round');
					g.appendChild(line);
					/*
					var shape = document.createElementNS(svgns, 'circle');
					shape.setAttributeNS(null, 'cx', x + chord.start * 2 * me.tapSize + me.tapSize * 1);
					shape.setAttributeNS(null, 'cy', ny);
					shape.setAttributeNS(null, 'r', me.tapSize *1);
					shape.setAttributeNS(null, 'fill', sng.foreColor);
					//shape.setAttributeNS(null, 'stroke', sng.foreColor);
					//shape.setAttributeNS(null, 'stroke-width', me.tapSize / 3);
					g.appendChild(shape);
					*/
					
					//console.log(note.string,channel.string);
					var txt = document.createElementNS(me.svgns, 'text');
					txt.setAttributeNS(null, 'x', x + chord.start * 2 * me.tapSize + me.tapSize * 0.3);
					txt.setAttributeNS(null, 'y', ny);
					txt.setAttributeNS(null, 'font-size', me.tapSize*2);
					txt.setAttributeNS(null, 'alignment-baseline', 'middle');//'text-before-edge');
					txt.setAttributeNS(null, 'fill', sng.gridColor);
					txt.setAttributeNS(null, 'stroke', colordeep);
					txt.setAttributeNS(null, 'stroke-width', me.tapSize / 37);
					txt.innerHTML = t;
					g.appendChild(txt);
					
					
					//console.log();
				}
			}
		}
	};
	
	sng.addMotif = function (me, id, x, y, motif, layer,offset,active,detailRatio) {
		if (motif.chords.length > 0) {
			//console.log('addMotif',id);
			var svgns = "http://www.w3.org/2000/svg";
			var g = document.createElementNS(svgns, 'g');
			g.id = id;
			layer.appendChild(g);
			for (var c = 0; c < motif.chords.length; c++) {
				var chord = motif.chords[c];
				for (var n = 0; n < chord.notes.length; n++) {
					var note = chord.notes[n];
					//console.log(note);

					/*
					var rect = document.createElementNS(svgns, 'rect');
					rect.setAttributeNS(null, 'x', x);
					rect.setAttributeNS(null, 'y', y);
					rect.setAttributeNS(null, 'height', me.tapSize);
					rect.setAttributeNS(null, 'width', me.tapSize);
					rect.setAttributeNS(null, 'fill', sng.foreColor);//'#' + Math.round(0xffffff * Math.random()).toString(16));
					//me.contentSVG.appendChild(rect);
					g.appendChild(rect);

					key:57 l6th:1 string:3
					 */
					var ny=y + me.tapSize * (sng.notationHeight - sng.pitch12to7(note.key-offset) + 3 * 7 - 3);
					var nx=x + chord.start * 2 * me.tapSize + me.tapSize * 1;
					/*
					if(ny-y<sng.notationTop*me.tapSize){
						tileRectangle(sng.foreColor,nx-9*me.tapSize/10, ny, me.tapSize+8*me.tapSize/10, detailRatio * me.lineWidth, g, id+'x'+c+'x'+n);
					}*/
					//var sy=ny+(ny+me.tapSize)%(2*me.tapSize);
					for(var by=y;by<y+sng.notationTop*me.tapSize;by=by+2*me.tapSize){
						if(by>=ny){
							var bx=nx-9*me.tapSize/10;
							var id='liup'+chord.start+'x'+by;
							if (!me.childExists(id, g)) {
								tileRectangle(sng.foreColor,bx, by, me.tapSize+8*me.tapSize/10, detailRatio * me.lineWidth, g, id);
							}
						}
					}
					for(var b=y+(sng.notationTop+2*5)*me.tapSize;b<=ny;b=b+2*me.tapSize){
						var bx=nx-9*me.tapSize/10;
						var by=b;//+me.tapSize/5;
						var id='lidown'+chord.start+'x'+by;
						if (!me.childExists(id, g)) {
							tileRectangle(sng.foreColor,bx, by, me.tapSize+8*me.tapSize/10, detailRatio * me.lineWidth, g, id);
						}
					}
					/*var sy=ny+(ny+me.tapSize)%(2*me.tapSize);
					
					for(var by=sy;by<y+sng.notationTop*me.tapSize;by=by+2*me.tapSize){
						var bx=nx-9*me.tapSize/10;
						var id='nost'+bx+'x'+by;
						//if (!me.childExists(id, g)) {
							tileRectangle(sng.foreColor,bx, by, me.tapSize+8*me.tapSize/10, detailRatio * me.lineWidth, g, id);
						//}
					}
					for(var b=y+(sng.notationTop+2*5)*me.tapSize;b<ny;b=b+2*me.tapSize){
						var bx=nx-9*me.tapSize/10;
						var by=b+me.tapSize/5;
						var id='nost'+bx+'x'+by;
						//if (!me.childExists(id, g)) {
							tileRectangle(sng.foreColor,bx, by, me.tapSize+8*me.tapSize/10, detailRatio * me.lineWidth, g, id);
						//}
					}*/
					/*
					var rect = document.createElementNS(svgns, 'rect');
					rect.setAttributeNS(null, 'x', nx);
					rect.setAttributeNS(null, 'y', ny);
					rect.setAttributeNS(null, 'height', me.tapSize);
					rect.setAttributeNS(null, 'width', me.tapSize);
					rect.setAttributeNS(null, 'fill', sng.backColor);
					g.appendChild(rect);
					*/
					
					var shape = document.createElementNS(svgns, 'circle');
					shape.setAttributeNS(null, 'cx', nx);
					shape.setAttributeNS(null, 'cy', ny);
					shape.setAttributeNS(null, 'r', me.tapSize / 2);
					if(active){
						shape.setAttributeNS(null, 'fill', sng.spotColor);
					}else{
						shape.setAttributeNS(null, 'fill', sng.backColor);
					}
					shape.setAttributeNS(null, 'stroke', sng.foreColor);
					shape.setAttributeNS(null, 'stroke-width', me.tapSize / 3);
					g.appendChild(shape);
				}
			}
		}
	};
	sng.cleffOffset=function(clef){
		//console.log(clef);
		if(clef==2)return -20;
		return 0;
	};
	
	sng.addFretDots = function (me, left, top, width, height, layer, detailRatio) {
		var m = 0;
		for (var i = 0; i < song.positions.length; i++) {
			var position = song.positions[i];
			//console.log(position);
			//for (var ch = 0; ch < song.channels.length; ch++) {
				//var channel = song.channels[ch];
				//console.log(channel);
				var channel = song.channels[sng.selectedChannel];
				var x = (sng.leftMargin + m) * me.tapSize;
				var y = (sng.topMargin + sng.titleHeight + song.channels.length * sng.notationHeight) * me.tapSize;
				var w = 2 * position.meter * position.by * me.tapSize;
				var h = sng.fretHeight * me.tapSize;
				//var id='msr'+i+'x'+ch;
				//tilePlaceHolder(me,x, y, w, h, layer, id,left,top,width,height);
				//console.log(song.positions[i]);
				if (!me.outOfRect(x, y, w, h, left, top, width, height)) {
					//tilePlaceHolder(me,x, y, w, h, layer, id,left,top,width,height);
					//console.log(i,':',x, y, w, h,'x',left,top,width,height,position);
					for (var n = 0; n < position.motifs.length; n++) {
						var motif = position.motifs[n];
						if (motif.channel == channel.id) {
							//console.log('motif',sng.findMotif(motif.motif,song));
							var id = 'frenotes' + i + 'c' + sng.selectedChannel + 'm' + motif.motif;
							if (!me.childExists(id, layer)) {
sng.addFretMotif(me, id, x, y, sng.findMotif(motif.motif, song), layer,channel.offset+sng.cleffOffset(motif.clef),channel);
								//sng.addMotif(me, id, x, y, sng.findMotif(motif.motif, song), layer,channel.offset+sng.cleffOffset(motif.clef));
							}
						}
					}
				}
			//}
			m = m + 2 * position.meter * position.by;
		}
	};
	sng.addNoteDots = function (me, left, top, width, height, layer, detailRatio) {
		//console.log(layer);
		var m = 0;
		for (var i = 0; i < song.positions.length; i++) {
			var position = song.positions[i];
			//console.log(position);
			for (var ch = 0; ch < song.channels.length; ch++) {
				var channel = song.channels[ch];
				//console.log(channel);
				var x = (sng.leftMargin + m) * me.tapSize;
				var y = (sng.topMargin + sng.titleHeight + ch * sng.notationHeight) * me.tapSize;
				var w = 2 * position.meter * position.by * me.tapSize;
				var h = sng.notationHeight * me.tapSize;
				//var id='msr'+i+'x'+ch;
				//tilePlaceHolder(me,x, y, w, h, layer, id,left,top,width,height);
				//console.log(song.positions[i]);
				if (!me.outOfRect(x, y, w, h, left, top, width, height)) {
					//tilePlaceHolder(me,x, y, w, h, layer, id,left,top,width,height);
					//console.log(i,':',x, y, w, h,'x',left,top,width,height,position);
					for (var n = 0; n < position.motifs.length; n++) {
						var motif = position.motifs[n];
						if (motif.channel == channel.id) {
							//console.log('motif',sng.findMotif(motif.motif,song));
							var id = 'mtf' + i + 'c' + ch + 'm' + motif.motif;
							if (!me.childExists(id, layer)) {

								sng.addMotif(me, id, x, y, sng.findMotif(motif.motif, song), layer,channel.offset+sng.cleffOffset(motif.clef),ch==sng.selectedChannel,detailRatio);
							}
						}
					}
				}
			}
			m = m + 2 * position.meter * position.by;
		}
	};
	sng.addRollDots = function (me, left, top, width, height, layer, detailRatio) {
		var m = 0;
		for (var i = 0; i < song.positions.length; i++) {
			var position = song.positions[i];
			for (var ch = 0; ch < song.channels.length; ch++) {
				var channel = song.channels[ch];
				var x = (sng.leftMargin + m) * me.tapSize;
				var y = (sng.topMargin + sng.titleHeight + ch * sng.notationHeight) * me.tapSize;
				var w = 2 * position.meter * position.by * me.tapSize;
				var h = sng.notationHeight * me.tapSize;
				if (!me.outOfRect(x, y, w, h, left, top, width, height)) {
					for (var n = 0; n < position.motifs.length; n++) {
						var motif = position.motifs[n];
						if (motif.channel == channel.id) {
							var id = 'rl' + i + 'c' + ch + 'm' + motif.motif;
							if (!me.childExists(id, layer)) {
								//sng.addMotif(me, id, x, y, sng.findMotif(motif.motif, song), layer,channel.offset+sng.cleffOffset(motif.clef),ch==sng.selectedChannel,detailRatio);
								//sng.addRollMotif(me, id, x, y, sng.findMotif(motif.motif, song), layer,channel.offset+sng.cleffOffset(motif.clef),ch==sng.selectedChannel,detailRatio);
							}
						}
					}
				}
			}
			m = m + 2 * position.meter * position.by;
		}
	}
	sng.addRollLines = function (me, left, top, width, height, layer, detailRatio) {
		var x=sng.leftMargin*me.tapSize;
		var y=me.tapSize * (me.songInfo.titleHeight + me.songInfo.notationHeight*song.channels.length + me.songInfo.textHeight + me.songInfo.fretHeight + me.songInfo.chordsHeight + me.songInfo.pianorollHeight + me.songInfo.topMargin );
		var w=sng.duration32()* me.tapSize;
		var h=0.9*me.tapSize;
		for(var i=0;i<10;i++){
		tileRectangle(sng.forColor,x, y-(12*i+0)*me.tapSize, w, detailRatio * me.lineWidth, layer, 'roll'+y);
		tileRectangle(sng.backColor,x, y-(12*i+2)*me.tapSize, w, h, layer, 'roll'+y);
		tileRectangle(sng.backColor,x, y-(12*i+4)*me.tapSize, w, h, layer, 'roll'+y);
		tileRectangle(sng.backColor,x, y-(12*i+7)*me.tapSize, w, h, layer, 'roll'+y);
		tileRectangle(sng.backColor,x, y-(12*i+9)*me.tapSize, w, h, layer, 'roll'+y);
		tileRectangle(sng.backColor,x, y-(12*i+11)*me.tapSize, w, h, layer, 'roll'+y);
		//console.log(x, y, w, h);
		}
	}
	sng.addGridLines=function(me, left, top, width, height, layer, detailRatio){
		var y=(sng.topMargin+me.songInfo.titleHeight)*me.tapSize;
		var w=detailRatio * me.lineWidth;
		//sng.duration32()* me.tapSize;
		var h= me.tapSize * ( me.songInfo.notationHeight*song.channels.length + me.songInfo.textHeight + me.songInfo.fretHeight + me.songInfo.chordsHeight + me.songInfo.pianorollHeight + me.songInfo.topMargin + me.songInfo.bottomMargin) ;
		//if(left<sng.leftMargin*me.tapSize)
		for(var x=left-(left%me.tapSize);x<left+width;x=x+me.tapSize){
			var id='gridV'+x;
			if (!me.outOfRect(x, y, w, h, left, top, width, height)) {
				//console.log(x, y, w, h);
				if (!me.childExists(id, layer)) {
					tileRectangle( sng.gridColor, x, y, w, h, layer, id);
				}
			}
		}
		var x=(sng.leftMargin+0)*me.tapSize;
		w=sng.duration32()* me.tapSize;
		h=detailRatio * me.lineWidth;
		for(var y=top-(top%me.tapSize);y<top+height;y=y+me.tapSize){
			var id='gridH'+y;
			if (!me.outOfRect(x, y, w, h, left, top, width, height)) {
				//console.log(x, y, w, h);
				if (!me.childExists(id, layer)) {
					tileRectangle( sng.gridColor, x, y, w, h, layer, id);
				}
			}
		}
	};
	sng.addBoundingBox = function (me, layer, s) {
		var id = 'boundingBox';
		if (!me.childExists(id, layer)) {
			var w = (sng.leftMargin + sng.duration32() + sng.rightMargin) * me.tapSize;
			var h = (sng.topMargin + sng.titleHeight + sng.notationHeight * song.channels.length + sng.textHeight + sng.fretHeight + sng.chordsHeight + sng.pianorollHeight + sng.bottomMargin) * me.tapSize;
			tileRectangle(sng.spotColor, 0, 0, w, s, layer, id);
			tileRectangle(sng.spotColor, 0, h, w, s, layer, id + 'a');
			tileRectangle(sng.spotColor, 0, 0, s, h, layer, id + 'b');
			tileRectangle(sng.spotColor, w, 0, s, h, layer, id + 'c');
		}
	};
	sng.addHugeTiles = function (me, left, top, width, height) {
		var d32 = sng.duration32();
		var detailRatio = 30;
		sng.addBoundingBox(me, me.layHugeFront, detailRatio * me.lineWidth);
		sng.addSongTitle(me, left, top, width, height, me.layHugeBack);

		sng.addHugeLargeMeasureLines(me, left, top, width, height, me.layHugeBack, detailRatio, 10);
		sng.addHugeNoteLines(me, left, top, width, height, me.layHugeBack, detailRatio);
		sng.addHugeFretLines(me, left, top, width, height, me.layHugeBack, detailRatio);

		/*
		tilePlaceHolder(me,sng.leftMargin*me.tapSize,(sng.topMargin+0)*me.tapSize//,sng.duration32()*me.tapSize,sng.titleHeight*me.tapSize,me.layHugeBack,'plTitle',left, top, width, height);
		tilePlaceHolder(me,sng.leftMargin*me.tapSize,(sng.topMargin+sng.titleHeight)*me.tapSize//,sng.duration32()*me.tapSize,sng.notationHeight*me.tapSize,me.layHugeBack,'plNotation',left, top, width, height);
		tilePlaceHolder(me,sng.leftMargin*me.tapSize,(sng.topMargin+sng.titleHeight+sng.notationHeight)*me.tapSize//,sng.duration32()*me.tapSize,sng.textHeight*me.tapSize,me.layHugeBack,'plText',left, top, width, height);
		tilePlaceHolder(me,sng.leftMargin*me.tapSize,(sng.topMargin+sng.titleHeight+sng.notationHeight+sng.textHeight)*me.tapSize//,sng.duration32()*me.tapSize,sng.chordsHeight*me.tapSize,me.layHugeBack,'plChords',left, top, width, height);
		tilePlaceHolder(me,sng.leftMargin*me.tapSize,(sng.topMargin+sng.titleHeight+sng.notationHeight+sng.textHeight+sng.chordsHeight)*me.tapSize//,sng.duration32()*me.tapSize,sng.fretHeight*me.tapSize,me.layHugeBack,'plFret',left, top, width, height);
		tilePlaceHolder(me,sng.leftMargin*me.tapSize,(sng.topMargin+sng.titleHeight+sng.notationHeight+sng.textHeight+sng.chordsHeight+sng.fretHeight)*me.tapSize//,sng.duration32()*me.tapSize,sng.pianorollHeight*me.tapSize,me.layHugeBack,'plPianoroll',left, top, width, height);
		var s=200;
		for(var i=0;i<d32;i=i+s){
		//console.log(i);
		tilePlaceHolder(me,(sng.leftMargin+i)*me.tapSize,(sng.topMargin+sng.titleHeight)*me.tapSize//,(s-0)*me.tapSize,(sng.notationHeight+sng.textHeight+sng.chordsHeight+sng.fretHeight+sng.pianorollHeight)*me.tapSize,me.layHugeBack,'m0_'+Math.round(i/s),left, top, width, height);
		}*/
	}
	sng.addLargeTiles = function (me, left, top, width, height) {
		var d32 = sng.duration32();
		var detailRatio = 3;
		sng.addBoundingBox(me, me.layLargeAction, detailRatio * me.lineWidth);
		sng.addSongTitle(me, left, top, width, height, me.layLargeBack);

		sng.addHugeLargeMeasureLines(me, left, top, width, height, me.layLargeBack, detailRatio, 1);
		sng.addNoteLines(me, left, top, width, height, me.layLargeBack, detailRatio);
		//console.log(me.layLargeContent);
		sng.addNoteDots(me, left, top, width, height, me.layLargeContent, detailRatio);
		sng.addFretLines(me, left, top, width, height, me.layLargeBack, detailRatio);
		
sng.addFretDots(me, left, top, width, height, me.layLargeContent, detailRatio);

//sng.addRollLines(me, left, top, width, height, me.layLargeBack, detailRatio);
sng.addRollDots(me, left, top, width, height, me.layLargeBack, detailRatio);

		/*
		tilePlaceHolder(me,sng.leftMargin*me.tapSize,(sng.topMargin+0)*me.tapSize//,sng.duration32()*me.tapSize,sng.titleHeight*me.tapSize,me.layLargeBack,'plTitle',left, top, width, height);
		tilePlaceHolder(me,sng.leftMargin*me.tapSize,(sng.topMargin+sng.titleHeight)*me.tapSize//,sng.duration32()*me.tapSize,sng.notationHeight*me.tapSize,me.layLargeBack,'plNotation',left, top, width, height);
		for(var i=0;i<5;i++){
		tilePlaceHolder(me,sng.leftMargin*me.tapSize,(sng.topMargin+sng.titleHeight+10+i*2)*me.tapSize//,sng.duration32()*me.tapSize,0.25*me.tapSize,me.layLargeBack,'li'+i,left, top, width, height);
		}
		tilePlaceHolder(me,sng.leftMargin*me.tapSize,(sng.topMargin+sng.titleHeight+sng.notationHeight)*me.tapSize//,sng.duration32()*me.tapSize,sng.textHeight*me.tapSize,me.layLargeBack,'plText',left, top, width, height);
		tilePlaceHolder(me,sng.leftMargin*me.tapSize,(sng.topMargin+sng.titleHeight+sng.notationHeight+sng.textHeight)*me.tapSize//,sng.duration32()*me.tapSize,sng.chordsHeight*me.tapSize,me.layLargeBack,'plChords',left, top, width, height);
		for(var i=0;i<6;i++){
		tilePlaceHolder(me,sng.leftMargin*me.tapSize,(sng.topMargin+sng.titleHeight+sng.notationHeight+sng.textHeight+sng.chordsHeight+i*3)*me.tapSize//,sng.duration32()*me.tapSize,3*me.tapSize,me.layLargeBack,'plFret'+i,left, top, width, height);
		}
		tilePlaceHolder(me,sng.leftMargin*me.tapSize,(sng.topMargin+sng.titleHeight+sng.notationHeight+sng.textHeight+sng.chordsHeight+sng.fretHeight)*me.tapSize//,sng.duration32()*me.tapSize,sng.pianorollHeight*me.tapSize,me.layLargeBack,'plPianoroll',left, top, width, height);
		for(var i=0;i<10;i++){
		tilePlaceHolder(me,sng.leftMargin*me.tapSize,(sng.topMargin+sng.titleHeight+sng.notationHeight+sng.textHeight+sng.chordsHeight+sng.fretHeight+sng.pianorollHeight-12*(i+1))*me.tapSize//,sng.duration32()*me.tapSize,12*me.tapSize,me.layLargeBack,'plOctave'+i,left, top, width, height);
		}
		var s=20;
		for(var i=0;i<d32;i=i+s){
		//console.log(i);
		tilePlaceHolder(me,(sng.leftMargin+i)*me.tapSize,(sng.topMargin+sng.titleHeight)*me.tapSize//,(s-0)*me.tapSize,(sng.notationHeight+sng.textHeight+sng.chordsHeight+sng.fretHeight+sng.pianorollHeight)*me.tapSize,me.layLargeBack,'m1_'+Math.round(i/s),left, top, width, height);
		}*/
	}
	sng.addMediumTiles = function (me, left, top, width, height) {
		var d32 = sng.duration32();
		var detailRatio = 0.75;
		sng.addBoundingBox(me, me.layMediumAction, detailRatio * me.lineWidth);
		sng.addSongTitle(me, left, top, width, height, me.layMediumBack);

		sng.addSmallMediumMeasureLines(me, left, top, width, height, me.layMediumGrid, detailRatio, 1);
		sng.addNoteLines(me, left, top, width, height, me.layMediumBack, detailRatio);

		sng.addNoteDots(me, left, top, width, height, me.layMediumContent, detailRatio);
sng.addFretLines(me, left, top, width, height, me.layMediumBack, detailRatio);
sng.addFretDots(me, left, top, width, height, me.layMediumContent, detailRatio);
sng.addGridLines(me, left, top, width, height, me.layMediumBack, detailRatio);
sng.addRollLines(me, left, top, width, height, me.layMediumBack, detailRatio);
sng.addRollDots(me, left, top, width, height, me.layMediumBack, detailRatio);
		/*
		tilePlaceHolder(me,sng.leftMargin*me.tapSize,(sng.topMargin+0)*me.tapSize//,sng.duration32()*me.tapSize,sng.titleHeight*me.tapSize,me.layMediumBack,'plTitle',left, top, width, height);
		//tilePlaceHolder(me,sng.leftMargin*me.tapSize,(sng.topMargin+sng.titleHeight)*me.tapSize//
		//	,sng.duration32()*me.tapSize,sng.notationHeight*me.tapSize,me.layMediumBack,'plNotation',left, top, width, height);
		for(var i=0;i<5;i++){
		tilePlaceHolder(me,sng.leftMargin*me.tapSize,(sng.topMargin+sng.titleHeight+10+i*2)*me.tapSize//,sng.duration32()*me.tapSize,0.25*me.tapSize,me.layMediumBack,'li'+i,left, top, width, height);
		}
		tilePlaceHolder(me,sng.leftMargin*me.tapSize,(sng.topMargin+sng.titleHeight+sng.notationHeight)*me.tapSize//,sng.duration32()*me.tapSize,sng.textHeight*me.tapSize,me.layMediumBack,'plText',left, top, width, height);
		tilePlaceHolder(me,sng.leftMargin*me.tapSize,(sng.topMargin+sng.titleHeight+sng.notationHeight+sng.textHeight)*me.tapSize//,sng.duration32()*me.tapSize,sng.chordsHeight*me.tapSize,me.layMediumBack,'plChords',left, top, width, height);
		for(var i=0;i<6;i++){
		tilePlaceHolder(me,sng.leftMargin*me.tapSize,(sng.topMargin+sng.titleHeight+sng.notationHeight+sng.textHeight+sng.chordsHeight+i*3)*me.tapSize//,sng.duration32()*me.tapSize,3*me.tapSize,me.layMediumBack,'plFret'+i,left, top, width, height);
		}
		tilePlaceHolder(me,sng.leftMargin*me.tapSize,(sng.topMargin+sng.titleHeight+sng.notationHeight+sng.textHeight+sng.chordsHeight+sng.fretHeight)*me.tapSize//,sng.duration32()*me.tapSize,sng.pianorollHeight*me.tapSize,me.layMediumBack,'plPianoroll',left, top, width, height);
		for(var i=0;i<10;i++){
		tilePlaceHolder(me,sng.leftMargin*me.tapSize,(sng.topMargin+sng.titleHeight+sng.notationHeight+sng.textHeight+sng.chordsHeight+sng.fretHeight+sng.pianorollHeight-12*(i+1))*me.tapSize//,sng.duration32()*me.tapSize,12*me.tapSize,me.layMediumBack,'plOctave'+i,left, top, width, height);
		}
		var s=20;
		for(var i=0;i<d32;i=i+s){
		//console.log(i);
		tilePlaceHolder(me,(sng.leftMargin+i)*me.tapSize,(sng.topMargin+sng.titleHeight)*me.tapSize//,(s-0)*me.tapSize,(sng.notationHeight+sng.textHeight+sng.chordsHeight+sng.fretHeight+sng.pianorollHeight)*me.tapSize,me.layMediumBack,'m2_'+Math.round(i/s),left, top, width, height);
		}
		var h=sng.notationHeight+sng.textHeight+sng.chordsHeight+sng.fretHeight+sng.pianorollHeight;
		for(var nx=0;nx<d32;nx=nx+4){
		tilePlaceHolder(me,(sng.leftMargin+nx)*me.tapSize//,(sng.topMargin+sng.titleHeight)*me.tapSize//,2*me.tapSize,h*me.tapSize,me.layMediumBack,'v'+nx,left, top, width, height);
		}
		for(var ny=0;ny<h;ny=ny+4){
		tilePlaceHolder(me,sng.leftMargin*me.tapSize//,(sng.topMargin+sng.titleHeight+ny)*me.tapSize//,d32*me.tapSize,2*me.tapSize,me.layMediumBack,'h'+ny,left, top, width, height);
		}*/
	}
	sng.addSmallTiles = function (me, left, top, width, height) {
		var d32 = sng.duration32();
		var detailRatio = 0.5;

		sng.addBoundingBox(me, me.laySmallAction, detailRatio * me.lineWidth);

		sng.addSongTitle(me, left, top, width, height, me.laySmallBack);
		sng.addSmallMediumMeasureLines(me, left, top, width, height, me.laySmallGrid, detailRatio, 1);
		sng.addNoteLines(me, left, top, width, height, me.laySmallBack, detailRatio);

		sng.addNoteDots(me, left, top, width, height, me.laySmallContent, detailRatio);
sng.addFretLines(me, left, top, width, height, me.laySmallBack, detailRatio);
sng.addFretDots(me, left, top, width, height, me.laySmallContent, detailRatio);
sng.addGridLines(me, left, top, width, height, me.laySmallBack, detailRatio);
sng.addRollLines(me, left, top, width, height, me.laySmallBack, detailRatio);
sng.addRollDots(me, left, top, width, height, me.laySmallBack, detailRatio);

		/*
		tilePlaceHolder(me,sng.leftMargin*me.tapSize,(sng.topMargin+0)*me.tapSize//,sng.duration32()*me.tapSize,sng.titleHeight*me.tapSize,me.laySmallGrid,'plTitle',left, top, width, height);
		//tilePlaceHolder(me,sng.leftMargin*me.tapSize,(sng.topMargin+sng.titleHeight)*me.tapSize//
		//	,sng.duration32()*me.tapSize,sng.notationHeight*me.tapSize,me.laySmallGrid,'plNotation',left, top, width, height);
		for(var i=0;i<5;i++){
		tilePlaceHolder(me,sng.leftMargin*me.tapSize,(sng.topMargin+sng.titleHeight+10+i*2)*me.tapSize//,sng.duration32()*me.tapSize,0.25*me.tapSize,me.laySmallGrid,'li'+i,left, top, width, height);
		}
		tilePlaceHolder(me,sng.leftMargin*me.tapSize,(sng.topMargin+sng.titleHeight+sng.notationHeight)*me.tapSize//,sng.duration32()*me.tapSize,sng.textHeight*me.tapSize,me.laySmallGrid,'plText',left, top, width, height);
		tilePlaceHolder(me,sng.leftMargin*me.tapSize,(sng.topMargin+sng.titleHeight+sng.notationHeight+sng.textHeight)*me.tapSize//,sng.duration32()*me.tapSize,sng.chordsHeight*me.tapSize,me.laySmallGrid,'plChords',left, top, width, height);
		for(var i=0;i<6;i++){
		tilePlaceHolder(me,sng.leftMargin*me.tapSize,(sng.topMargin+sng.titleHeight+sng.notationHeight+sng.textHeight+sng.chordsHeight+i*3)*me.tapSize//,sng.duration32()*me.tapSize,3*me.tapSize,me.laySmallGrid,'plFret'+i,left, top, width, height);
		}
		tilePlaceHolder(me,sng.leftMargin*me.tapSize,(sng.topMargin+sng.titleHeight+sng.notationHeight+sng.textHeight+sng.chordsHeight+sng.fretHeight)*me.tapSize//,sng.duration32()*me.tapSize,sng.pianorollHeight*me.tapSize,me.laySmallGrid,'plPianoroll',left, top, width, height);
		for(var i=0;i<10;i++){
		tilePlaceHolder(me,sng.leftMargin*me.tapSize,(sng.topMargin+sng.titleHeight+sng.notationHeight+sng.textHeight+sng.chordsHeight+sng.fretHeight+sng.pianorollHeight-12*(i+1))*me.tapSize//,sng.duration32()*me.tapSize,12*me.tapSize,me.laySmallGrid,'plOctave'+i,left, top, width, height);
		}
		var s=20;
		for(var i=0;i<d32;i=i+s){
		//console.log(i);
		tilePlaceHolder(me,(sng.leftMargin+i)*me.tapSize,(sng.topMargin+sng.titleHeight)*me.tapSize//,(s-0)*me.tapSize,(sng.notationHeight+sng.textHeight+sng.chordsHeight+sng.fretHeight+sng.pianorollHeight)*me.tapSize,me.laySmallGrid,'m3_'+Math.round(i/s),left, top, width, height);
		}
		var h=sng.notationHeight+sng.textHeight+sng.chordsHeight+sng.fretHeight+sng.pianorollHeight;
		for(var nx=0;nx<d32;nx=nx+2){
		tilePlaceHolder(me,(sng.leftMargin+nx)*me.tapSize//,(sng.topMargin+sng.titleHeight)*me.tapSize//,me.tapSize,h*me.tapSize,me.laySmallGrid,'v'+nx,left, top, width, height);
		}
		for(var ny=0;ny<h;ny=ny+2){
		tilePlaceHolder(me,sng.leftMargin*me.tapSize//,(sng.topMargin+sng.titleHeight+ny)*me.tapSize//,d32*me.tapSize,me.tapSize,me.laySmallGrid,'h'+ny,left, top, width, height);
		}*/
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
