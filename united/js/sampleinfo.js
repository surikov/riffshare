FretChordSheet.prototype.sampleCategories = function () {
	if (this.toneCatNames) {
		//
	} else {
		if (!(this.player)) {
			console.log('create player');
			this.player = new WebAudioFontPlayer();
		}
		var r = [];
		var curCat = this.player.loader.instrumentTitles()[0].split(':')[1];
		var from = 0;
		var to = 0;
		r.push({ name: curCat, from: 0, to: 0 });
		for (var i = 1; i < this.player.loader.instrumentTitles().length; i++) {
			var cat = this.player.loader.instrumentTitles()[i].split(':')[1];
			if (curCat != cat) {
				curCat = cat
				r[r.length - 1].to = i - 1;
				r.push({ name: cat, from: i, to: i });
			}
			//console.log("<div id='toneItem"+i+"' class='menubutton'>"+cat+"</div>");
		}
		r[r.length - 1].to = this.player.loader.instrumentTitles().length - 1;
		this.toneCatNames=r;
	}
	return this.toneCatNames;
};
