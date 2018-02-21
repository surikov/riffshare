FretChordSheet.prototype.resetPinStatus = function () {
	/*
	document.getElementById('pinbutton').style.width = this.tiler.tapSize + 'px';
	document.getElementById('backbutton').style.width = this.tiler.tapSize + 'px';
	document.getElementById('pinbutton').style.height = this.tiler.tapSize + 'px';
	document.getElementById('backbutton').style.height = this.tiler.tapSize + 'px';
	document.getElementById('pinbutton').style.top = (5 * 2 + 2*this.tiler.tapSize) + 'px';
	document.getElementById('backbutton').style.top = (5 * 4 + 3*this.tiler.tapSize) + 'px';
	*/
	this.pinnedXYZ = null;
	var me = this;
	/*document.getElementById('pinbutton').onclick = function () {
		me.pinnedXYZ={
			x:me.tiler.translateX
			,y:me.tiler.translateY
			,z:me.tiler.translateZ
			,done:false
		};
		me.setPinStatus();
	};
	document.getElementById('backbutton').onclick = function () {
		if(me.pinnedXYZ){
			me.pinnedXYZ.done=true;
			console.log(me.pinnedXYZ);
			me.setPinStatus();
			me.tiler.startSlideTo(me.pinnedXYZ.x, me.pinnedXYZ.y, me.pinnedXYZ.z);
		}
	};
	*/
	//this.setPinStatus();

	document.getElementById('menubutton').onclick = function () {
		me.showMainMenu();
	};
	document.getElementById('closeMenuB').onclick = function () {
		me.closeMainMenu();
	};
	document.getElementById('playButton').onclick = function () {
		me.startPlayAll();
	};
	for (var i = 0; i < 8; i++) {
		var o = document.getElementById('channel' + (i + 1));
		o.linkedNum = i;
		o.onclick = function () {
			console.log('click ' + this.linkedNum);
			me.userActionTrackUp(me.findTrackNum(this.linkedNum));
			me.closeMainMenu();
			me.tiler.resetAllLayersNow();
		};
	}
	/*document.getElementById('rangeFeel').onchange=function(){
		me.userActionChangeFeel(1*document.getElementById('rangeFeel').value);
		me.closeMainMenu();
		me.tiler.resetAllLayersNow();		
	};*/
	document.getElementById('setFeel0').onclick = function () {
		me.userActionChangeFeel(0);
		me.closeMainMenu();
		me.tiler.resetAllLayersNow();
	};
	document.getElementById('setFeel1').onclick = function () {
		me.userActionChangeFeel(1);
		me.closeMainMenu();
		me.tiler.resetAllLayersNow();
	};
	document.getElementById('setFeel2').onclick = function () {
		me.userActionChangeFeel(2);
		me.closeMainMenu();
		me.tiler.resetAllLayersNow();
	};
	document.getElementById('setFeel3').onclick = function () {
		me.userActionChangeFeel(3);
		me.closeMainMenu();
		me.tiler.resetAllLayersNow();
	};
	document.getElementById('setFeel4').onclick = function () {
		me.userActionChangeFeel(4);
		me.closeMainMenu();
		me.tiler.resetAllLayersNow();
	};

	document.getElementById('setTPN0').onclick = function () {
		me.userActionChangeMarkMode(1);
		me.closeTPNMenu();

	};
	document.getElementById('setTPN1').onclick = function () {
		me.userActionChangeMarkMode(2);
		me.closeTPNMenu();

	};
	document.getElementById('setTPN2').onclick = function () {
		me.userActionChangeMarkMode(3);
		me.closeTPNMenu();

	};


	document.getElementById('setBreak0').onclick = function () {
		me.userActionBreakMode(1);
		me.tiler.resetAllLayersNow();
	};
	document.getElementById('setBreak1').onclick = function () {
		me.userActionBreakMode(2);
		me.tiler.resetAllLayersNow();
	};
	document.getElementById('setBreak2').onclick = function () {
		me.userActionBreakMode(3);
		me.tiler.resetAllLayersNow();
	};


	/*
		document.getElementById('rangeTPN').onchange=function(){
			me.userActionChangeMarkMode(1*document.getElementById('rangeTPN').value);
			me.closeMainMenu();
			me.tiler.resetAllLayersNow();		
		};*/
	/*
		document.getElementById('rangeBreak').onchange=function(){
			me.userActionBreakMode(1*document.getElementById('rangeBreak').value);
			me.closeMainMenu();
			me.tiler.resetAllLayersNow();		
		};*/

	document.getElementById('clearSongB').onclick = function () {
		me.userActionClearSong();
		me.closeMainMenu();
		me.reCalcContentSize();
		me.tiler.resetAllLayersNow();
	};

	document.getElementById('importSongB').onclick = function () {

		me.closeMainMenu();
		me.promptImport();
	};

	document.getElementById('switchPianoB').onclick = function () {
		me.userActionSetHidePiano(me.options.hidePiano == 1 ? 2 : 1);
		me.setPanelsLabels();
		me.reCalcContentSize();
		me.tiler.resetAllLayersNow();
	};

	document.getElementById('switchStaffB').onclick = function () {
		me.userActionSetHideStaff(me.options.hideStaff == 1 ? 2 : 1);
		me.setPanelsLabels();
		me.reCalcContentSize();
		me.tiler.resetAllLayersNow();
	};

	document.getElementById('switchFretsB').onclick = function () {
		me.userActionSetHideFrets(me.options.hideFrets == 1 ? 2 : 1);
		me.setPanelsLabels();
		me.reCalcContentSize();
		me.tiler.resetAllLayersNow();
	};

	document.getElementById('switchDrumsB').onclick = function () {
		me.userActionSetHideDrums(me.options.hideDrums == 1 ? 2 : 1);
		me.setPanelsLabels();
		me.reCalcContentSize();
		me.tiler.resetAllLayersNow();
	};

	document.getElementById('feelLabel').onclick = function () {
		me.showFeelMenu();
		me.closeMainMenu();
	};
	document.getElementById('closeFeelB').onclick = function () {
		me.closeFeelMenu();
	};

	document.getElementById('tpnLabel').onclick = function () {
		me.showTPNMenu();
		me.closeMainMenu();
	};
	document.getElementById('closeTPNB').onclick = function () {
		me.closeTPNMenu();
	};
	document.getElementById('breaksLabel').onclick = function () {
		me.showBreaksMenu();
		me.closeMainMenu();
	};
	document.getElementById('closeBreaksB').onclick = function () {
		me.closeBreaksMenu();
	};

	document.getElementById('panelsMode').onclick = function () {
		me.showPanelsMenu();
		me.closeMainMenu();
	};
	document.getElementById('closePanelsB').onclick = function () {
		me.closePanelsMenu();
	};

	document.getElementById('allVolumes').onclick = function () {
		me.showVolumesMenu();
		me.closeMainMenu();
	};
	document.getElementById('closeVolumesB').onclick = function () {
		me.closeVolumesMenu();
	};
	document.getElementById('rangeVolume0').onchange = function () { me.volumes[0] = 0.1 * document.getElementById('rangeVolume0').value; console.log(me.volumes) };
	document.getElementById('rangeVolume1').onchange = function () { me.volumes[1] = 0.1 * document.getElementById('rangeVolume1').value; };
	document.getElementById('rangeVolume2').onchange = function () { me.volumes[2] = 0.1 * document.getElementById('rangeVolume2').value; };
	document.getElementById('rangeVolume3').onchange = function () { me.volumes[3] = 0.1 * document.getElementById('rangeVolume3').value; };
	document.getElementById('rangeVolume4').onchange = function () { me.volumes[4] = 0.1 * document.getElementById('rangeVolume4').value; };
	document.getElementById('rangeVolume5').onchange = function () { me.volumes[5] = 0.1 * document.getElementById('rangeVolume5').value; };
	document.getElementById('rangeVolume6').onchange = function () { me.volumes[6] = 0.1 * document.getElementById('rangeVolume6').value; };
	document.getElementById('rangeVolume7').onchange = function () { me.volumes[7] = 0.1 * document.getElementById('rangeVolume7').value; };
	document.getElementById('rangeVolume8').onchange = function () { me.volumes[8] = 0.1 * document.getElementById('rangeVolume8').value; };
	document.getElementById('rangeVolume9').onchange = function () { me.volumes[9] = 0.1 * document.getElementById('rangeVolume9').value; };
	document.getElementById('rangeVolume10').onchange = function () { me.volumes[10] = 0.1 * document.getElementById('rangeVolume10').value; };
	document.getElementById('rangeVolume11').onchange = function () { me.volumes[11] = 0.1 * document.getElementById('rangeVolume11').value; };
	document.getElementById('rangeVolume12').onchange = function () { me.volumes[12] = 0.1 * document.getElementById('rangeVolume12').value; };
	document.getElementById('rangeVolume13').onchange = function () { me.volumes[13] = 0.1 * document.getElementById('rangeVolume13').value; };
	document.getElementById('rangeVolume14').onchange = function () { me.volumes[14] = 0.1 * document.getElementById('rangeVolume14').value; };
	document.getElementById('rangeVolume15').onchange = function () { me.volumes[15] = 0.1 * document.getElementById('rangeVolume15').value; };
}
/*FretChordSheet.prototype.resetPosition = function () {
	this.tiler.translateX = 0;
	this.tiler.translateY = 0;
};*/
FretChordSheet.prototype.menuWidth = function () {
	var wd = 7 * this.tiler.tapSize;
	if (wd > window.innerWidth - this.tiler.tapSize) {
		wd = window.innerWidth - this.tiler.tapSize
	}
	return wd;
};
FretChordSheet.prototype.showVolumesMenu = function () {
	document.getElementById('menuVolumes').style.width = this.menuWidth() + 'px';
};
FretChordSheet.prototype.closeVolumesMenu = function () {
	document.getElementById('menuVolumes').style.width = '0';
};
FretChordSheet.prototype.showTPNMenu = function () {
	document.getElementById('menuTPN').style.width = this.menuWidth() + 'px';
};
FretChordSheet.prototype.closeTPNMenu = function () {
	document.getElementById('menuTPN').style.width = '0';
};
FretChordSheet.prototype.showFeelMenu = function () {
	document.getElementById('menuFeel').style.width = this.menuWidth() + 'px';
};
FretChordSheet.prototype.closeFeelMenu = function () {
	document.getElementById('menuFeel').style.width = '0';
};
FretChordSheet.prototype.showBreaksMenu = function () {
	document.getElementById('menuBreaks').style.width = this.menuWidth() + 'px';
};
FretChordSheet.prototype.closeBreaksMenu = function () {
	document.getElementById('menuBreaks').style.width = '0';
};

FretChordSheet.prototype.showPanelsMenu = function () {
	document.getElementById('menuPanels').style.width = this.menuWidth() + 'px';
};
FretChordSheet.prototype.closePanelsMenu = function () {
	document.getElementById('menuPanels').style.width = '0';
};


FretChordSheet.prototype.showMainMenu = function () {
	//console.log('menu');
	var me = this;
	/*var wd=7*this.tiler.tapSize;
	if(wd>window.innerWidth-this.tiler.tapSize){
		wd=window.innerWidth-this.tiler.tapSize
	}*/

	for (var i = 0; i < 8; i++) {
		var o = document.getElementById('channel' + (i + 1));
		o.innerText = this.trackInfo[this.findTrackNum(i)].title;
		o.style.color = this.trackInfo[this.findTrackNum(i)].color;
		//me.userActionTrackUp(s.toneNum);
	}
	if (this.air) {
		document.getElementById('playButton').innerHTML = 'Stop';
		document.getElementById('playButton').onclick = function () {
			me.stopPlay();
			me.closeMainMenu();
		};
	} else {
		document.getElementById('playButton').innerHTML = 'Play';
		document.getElementById('playButton').onclick = function () {
			me.startPlayAll();
			me.closeMainMenu();
		};
	}
	for (var i = 0; i < 16; i++) {
		document.getElementById('rangeVolume' + i).value = this.volumes[i] * 10;
		//console.log(this.volumes[i],document.getElementById('rangeVolume' + i));
	}
	document.getElementById('feelLabel').innerHTML = 'Feel: ' + this.feelNames[this.options.feel];
	//document.getElementById('rangeFeel').value=this.options.feel;
	//console.log(this.options.feel);
	document.getElementById('tpnLabel').innerHTML = 'Taps per note: ' + this.options.markNotesCount;
	//document.getElementById('rangeTPN').value=this.options.markNotesCount;

	document.getElementById('breaksLabel').innerHTML = 'Gaps: ' + this.breakNames[this.options.breakMode];
	//document.getElementById('rangeBreak').value=this.options.breakMode;


	this.setPanelsLabels();
	document.getElementById('menuDiv').style.width = this.menuWidth() + 'px';
};
FretChordSheet.prototype.setPanelsLabels = function () {
	document.getElementById('switchPianoB').innerHTML = this.options.hidePiano == 1 ? 'Hide pianoroll' : 'Show pianoroll';
	document.getElementById('switchStaffB').innerHTML = this.options.hideStaff == 1 ? 'Hide staff' : 'Show staff';
	document.getElementById('switchFretsB').innerHTML = this.options.hideFrets == 1 ? 'Hide fretboard' : 'Show fretboard';
	document.getElementById('switchDrumsB').innerHTML = this.options.hideDrums == 1 ? 'Hide drums' : 'Show drums';
};
FretChordSheet.prototype.closeMainMenu = function () {
	//console.log('closeMainMenu');
	document.getElementById('menuDiv').style.width = '0';
};

FretChordSheet.prototype.setPinStatus = function () {
	if (this.pinnedXYZ) {
		document.getElementById('pinimg').src = 'img/pinWhite.png';
		if (this.pinnedXYZ.done) {
			document.getElementById('backimg').src = 'img/handGrey.png';
		} else {
			document.getElementById('backimg').src = 'img/handWhite.png';
		}
	} else {
		document.getElementById('pinimg').src = 'img/pinGrey.png';
		document.getElementById('backimg').src = 'img/handGrey.png';
	}
};

FretChordSheet.prototype.menuChannelSelect = function (nn) {
	var kk = this.findTrackNum(nn);
	this.userActionTrackUp(kk);
};
