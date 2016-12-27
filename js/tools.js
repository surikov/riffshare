function saveObject2localStorage(name, o) {
	console.log('saveObject2localStorage', name, o);
	localStorage.setItem(name, JSON.stringify(o));
}
function readObjectFromlocalStorage(name) {
	var o = null;
	try {
		o = JSON.parse(localStorage.getItem(name));
	} catch (ex) {
		console.log(ex);
		return {};
	}
	return o;
}
function saveText2localStorage(name, text) {
	console.log('saveText2localStorage', name, text);
	localStorage.setItem(name, text);
}
function readTextFromlocalStorage(name) {
	var o = '';
	try {
		o = localStorage.getItem(name);
	} catch (ex) {
		console.log(ex);
	}
	return o;
}
function sureNumeric(v, minValue, defaultValue, maxValue) {
	var r = defaultValue;
	try {
		r = Number.parseFloat(v);
	} catch (ex) {
		console.log(ex);
	}
	if (isNaN(r)) {
		r = defaultValue;
	}
	if (r < minValue) {
		r = minValue;
	}
	if (r > maxValue) {
		r = maxValue;
	}
	return r;
}
function sureInList(v, defaultValue, items) {
	var r = defaultValue;
	for (var i = 0; i < items.length; i++) {
		if (items[i] == v) {
			return v;
		}
	}
	return r;
}
function crunchRiff(riff) {
	return "";
}
function deCrunchRiff(txt) {
	return {};
}
function getUrlVars() {
var vars = {};
var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
vars[key] = value;
});
return vars;
}
function decodeState(encoded){
				try{
					var strings=encoded.split('-');
					var tempo=parseInt(strings[0],16);
					//console.log('tempo',tempo);
					saveText2localStorage('tempo',''+tempo);
					for(var i=0;i<8;i++){
						var n=10*parseInt(strings[1].substring(i,i+1),16);
						//console.log('track'+i,n);
						saveText2localStorage('track'+i,''+n);
					}
					for(var i=0;i<8;i++){
						var n=10*parseInt(strings[2].substring(i,i+1),16);
						//console.log('drum'+i,n);
						saveText2localStorage('drum'+i,''+n);
					}
					//console.log(strings[3]);
					for(var i=0;i<10;i++){
						var t=strings[3].substring(i*2,i*2+2);
						var n=parseInt(t,16)-10;
						//console.log('equalizer'+i,n,t);
						saveText2localStorage('equalizer'+i,''+n);
					}
					var storeDrums=[];
					var cnt=strings[4].length/4;
					//console.log(cnt,strings[4]);
					for(var i=0;i<cnt;i++){
						var key=parseInt(strings[4].substring(i*4,i*4+2),16);
						var data=parseInt(strings[4].substring(i*4+2,i*4+4),16);
						var drum=key>>5;
						var i32=key & parseInt('11111', 2);
						//console.log(pad0(key.toString(2),8),pad0(data.toString(2),8),drum,i32);
						if((data | parseInt('00000001', 2))==data)storeDrums.push({drum:drum,beat:i32*8+0});//console.log('drum',drum,i32*8+0);
						if((data | parseInt('00000010', 2))==data)storeDrums.push({drum:drum,beat:i32*8+1});//console.log('drum',drum,i32*8+1);
						if((data | parseInt('00000100', 2))==data)storeDrums.push({drum:drum,beat:i32*8+2});//console.log('drum',drum,i32*8+2);
						if((data | parseInt('00001000', 2))==data)storeDrums.push({drum:drum,beat:i32*8+3});//console.log('drum',drum,i32*8+3);
						if((data | parseInt('00010000', 2))==data)storeDrums.push({drum:drum,beat:i32*8+4});//console.log('drum',drum,i32*8+4);
						if((data | parseInt('00100000', 2))==data)storeDrums.push({drum:drum,beat:i32*8+5});//console.log('drum',drum,i32*8+5);
						if((data | parseInt('01000000', 2))==data)storeDrums.push({drum:drum,beat:i32*8+6});//console.log('drum',drum,i32*8+6);
						if((data | parseInt('10000000', 2))==data)storeDrums.push({drum:drum,beat:i32*8+7});//console.log('drum',drum,i32*8+7);
					}
					saveObject2localStorage('storeDrums',storeDrums);
					var storeTracks=[];
					cnt=strings[5].length/9;
					for(var i=0;i<cnt;i++){
						var beat=parseInt(strings[5].substring(i*9,i*9+2),16);
						var track=parseInt(strings[5].substring(i*9+2,i*9+2+1),16);
						var length=parseInt(strings[5].substring(i*9+3,i*9+3+2),16);
						var pitch=parseInt(strings[5].substring(i*9+5,i*9+5+2),16);
						var shift=parseInt(strings[5].substring(i*9+7,i*9+7+2),16)-64;
						//console.log(beat,track,length,pitch,shift);
						storeTracks.push({
							track:track,beat:beat,length:length,shift:shift,pitch:pitch
						});
					}
					saveObject2localStorage('storeTracks',storeTracks);
				}catch(ex){
					console.log(ex);
				}
			}
