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
	sng.addMotif = function (me, id, x, y, motif, layer,offset) {
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

					var shape = document.createElementNS(svgns, 'circle');
					shape.setAttributeNS(null, 'cx', x + chord.start * 2 * me.tapSize + me.tapSize * 1);
					shape.setAttributeNS(null, 'cy', y + me.tapSize * (sng.notationHeight - sng.pitch12to7(note.key-offset) + 3 * 7 - 3));
					shape.setAttributeNS(null, 'r', me.tapSize / 2);
					shape.setAttributeNS(null, 'fill', sng.backColor);
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

								sng.addMotif(me, id, x, y, sng.findMotif(motif.motif, song), layer,channel.offset+sng.cleffOffset(motif.clef));
							}
						}
					}
				}
			}
			m = m + 2 * position.meter * position.by;
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
