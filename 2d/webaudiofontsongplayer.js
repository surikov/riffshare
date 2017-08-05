function WAFSongPlayer(){
				var me=this;
				var AudioContextFunc = window.AudioContext || window.webkitAudioContext;		
				me.audioContext = new AudioContextFunc();		
				me.player = new WebAudioFontPlayer();
				me.started=false;
				me.bpm = 120;		
				me.N = 4 * 60 / me.bpm;		
				me.pieceLen = 2 * me.N;		
				me.beatLen=1/8 * me.N;
				me.initSong=function(song){
					console.log(song);
					me.song=song;
					me.channels=[];
					me.channelMaster = new WebAudioFontChannel(me.audioContext);	
					me.reverberator = new WebAudioFontReverberator(me.audioContext);
					me.channelMaster.output.connect(me.reverberator.input);
					for(var i=0;i<me.song.channels.length;i++){
						var c=new WebAudioFontChannel(me.audioContext);
						c.output.connect(me.channelMaster.input);
						me.channels.push(c);
						me.startCacheDefaultSamples(me.song.channels[i].program);
					}
					me.player.loader.waitLoad(function () {
							console.log('cacheing done');
							
						});
				};
				me.playAll=function(){
					console.log('play all');
					if (me.started) {		
						console.log('started already');		
					} else {		
						me.started = true;		
						me.startTime = me.audioContext.currentTime + 0.1;		
						me.nextPiece();		
						me.startTime = me.startTime + me.pieceLen;		
						setInterval(function () {		
							if (me.audioContext.currentTime > me.startTime - 1 / 4 * me.N) {		
								me.nextPiece();		
								me.startTime = me.startTime + me.pieceLen;		
							}		
						}, 20);		
					}		
			
				};
				me.startCacheDefaultSamples=function(midi){
					if(midi<128){
						var name=me.findDefaultInstrument(midi);
						var path=webaudiofontfolder+name+'.js';
						//console.log(midi,name,path);
						me.player.loader.startLoad(me.audioContext, path, name);
						//me.player.loader.waitLoad(function () {
							//console.log('done',name);
							
						//});
					}else{
						//console.log('drums',me.findDefaultDrum(44));
						for(var i=35;i<82;i++){
							var name=me.findDefaultDrum(i);
							var path=webaudiofontfolder+name+'.js';
							//console.log(midi,name,path);
							me.player.loader.startLoad(me.audioContext, path, name);
							//me.player.loader.waitLoad(function () {
								//console.log('done',name);
								
							//});
						}
					}
				};
				me.findDefaultDrum=function(midi){
					for(var i=0;i<webaudiofontfiles.length;i++){
						var t=webaudiofontfiles[i];
						var s=1*t.substr(0,3);
						var n=1*t.substr(3,2);
						if(s==128 && n==midi){
							return t;
						}
					}
					return null;
				};
				me.findDefaultInstrument=function(midi){
					for(var i=0;i<webaudiofontfiles.length;i++){
						var t=webaudiofontfiles[i];
						var n=1*t.substr(0,3);
						if(n==midi){
							return t;
						}
					}
					return null;
				};
				me.nextPiece=function() {
					console.log('nextPiece');
				};
				return me;
			};
