console.log('hugesvg v1.01');
//test.gp3
//test.svg - 15mb
//statistics: texts 0 / paths 15108 / lines 15029
//size: 19048.8x841.89, version: 1.2
//tiles: 75x4/256

function startInit() {
	console.log('start init');
	/*var map = L.map('drawDiv').setView(new L.LatLng(0,0), 0);
        L.tileLayer.zoomify('http://thematicmapping.org/playground/zoomify/books/', { 
            width: 500*3, 
            height: 500*3,
            tolerance: 0.8
        }).addTo(map);*/
		/*
		 
		 _getSubdomain: function (tilePoint) {
		var index = (tilePoint.x + tilePoint.y) % this.options.subdomains.length;
		return this.options.subdomains[index];
	},

	_createTileProto: function () {
		var img = this._tileImg = L.DomUtil.create('img', 'leaflet-tile');
		img.style.width = img.style.height = this.options.tileSize + 'px';
		img.galleryimg = 'no';
	},

	_getTile: function () {
		if (this.options.reuseTiles && this._unusedTiles.length > 0) {
			var tile = this._unusedTiles.pop();
			this._resetTile(tile);
			return tile;
		}
		return this._createTile();
	},

	// Override if data stored on a tile needs to be cleaned up before reuse
	_resetTile: function (/*tile/) {},

	_createTile: function () {
		var tile = this._tileImg.cloneNode(false);
		tile.onselectstart = tile.onmousemove = L.Util.falseFn;
		return tile;
	},
		 
		 
		 
		 
		 
		 
		 
		 
		 */
	//var bounds = L.latLngBounds(L.latLng(85.03, 180), L.latLng(85.05, 180));
	//var southWest = L.latLng(85.0475,180.0001);
    //var northEast = L.latLng(85.321,180.23);
	var llcenter  = L.latLng(85.051,180.01);
	var southWest = L.latLng(llcenter.lat-0.0015,llcenter.lng-0.0190);
	var northEast = L.latLng(llcenter.lat+0.004,llcenter.lng+0.41);
    var bounds = L.latLngBounds(southWest, northEast);
	//var crs = {};
	var baseZoom =13;
	var baseSize=32;
	var map = L.map('drawDiv', {
			//zoomControl : false //
		//,
			attributionControl : false //
		,
			maxZoom : baseZoom+5 //
		,
			minZoom : baseZoom //
		//,maxNativeZoom:13
			//,
			//crs : crs//
		//,
			,maxBounds : bounds //
			
		});
	L.marker([northEast.lat,southWest.lng],{title:'left top'}).addTo(map);
	L.marker([southWest.lat,southWest.lng],{title:'left bottom'}).addTo(map);	
	L.marker([northEast.lat,northEast.lng],{title:'right top'}).addTo(map);
	L.marker([southWest.lat,northEast.lng],{title:'right bottom'}).addTo(map);
	//var markercntr = L.marker(llcenter,{title:'center'}).addTo(map);
	//var markersw = L.marker(southWest,{title:'SW'}).addTo(map);
	//var markerne = L.marker(northEast,{title:'NE'}).addTo(map);
	//L.CRS.Simple
	//map.setView([85.0402769846338, -179.8736572265625], 13);
	map.setView(llcenter, baseZoom+3);
	//var access_token = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
	/*var props = {
		//maxZoom : 13 //
	//,
		//id : 'mapbox.streets' //
		//,errorTileUrl:'slice/64px_plus.png'
		tileSize:baseSize//
	};*/
	//var newClass = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + access_token, props);
	//var path='map/{x}x{y}.jpg';
	var path='ll/slice/tile{x}x{y}.svg';
	var tileLayer = L.tileLayer(path, {tileSize:baseSize,mxx:74,mxy:3,maxNativeZoom:baseZoom});
	/*var tileLayer11 = L.tileLayer(path, {tileSize:baseSize/4,mxx:74,mxy:3,maxNativeZoom:baseZoom-2});
	var tileLayer12 = L.tileLayer(path, {tileSize:baseSize/2,mxx:74,mxy:3,maxNativeZoom:baseZoom-2});
	var tileLayer13 = L.tileLayer(path, {tileSize:baseSize,mxx:74,mxy:3,maxNativeZoom:baseZoom-2});
	var tileLayer14 = L.tileLayer(path, {tileSize:baseSize*2,mxx:74,mxy:3,maxNativeZoom:baseZoom-2});*/
	/*tileLayer13.baseGetTileUrl=tileLayer13.getTileUrl;
	tileLayer13.getTileUrl=function(lPoint){
		p = new L.point();
		p.x=lPoint.x-4096;
		p.y=lPoint.y-4096;
		p.z=lPoint.z;
		var r=tileLayer13.baseGetTileUrl(lPoint);
		return r;
	};*/
	//var tileLayer = L.tileLayer('slice/tile{x}x{y}.svg', props);
	tileLayer.addTo(map);
	//map.addLayer(tileLayer13);
	//map.addLayer(tileLayer14);
	//console.log('map',map);
	//console.log('tileLayer',tileLayer13);
	map.on('click', function (ev) {
		console.log('click',ev);
		console.log('center',map.getCenter());
	});
	map.on('zoom', function (ev) {
		/*console.log('zoom',ev);
		console.log('ev.target._zoom',ev.target._zoom);
		console.log('tileLayer13.options.tileSize',tileLayer.options.tileSize);
		console.log('center',map.getCenter());*/
		//tileLayer.options.tileSize=300;
		/*
		if(ev.target._zoom==11){
			//tileLayer.options.tileSize=500;
			map.removeLayer(tileLayer14);
			map.removeLayer(tileLayer13);
			map.removeLayer(tileLayer12);
			map.addLayer(tileLayer11);
		}
		if(ev.target._zoom==12){
			//tileLayer.options.tileSize=500;
			map.removeLayer(tileLayer14);
			map.removeLayer(tileLayer13);
			map.addLayer(tileLayer12);
			map.removeLayer(tileLayer11);
		}
		if(ev.target._zoom==13){
			//tileLayer.options.tileSize=500;
			map.removeLayer(tileLayer14);
			map.addLayer(tileLayer13);
			map.removeLayer(tileLayer12);
			map.removeLayer(tileLayer11);
		}
		if(ev.target._zoom==14){
			//tileLayer.options.tileSize=250;
			map.addLayer(tileLayer14);
			map.removeLayer(tileLayer13);
			map.removeLayer(tileLayer12);
			map.removeLayer(tileLayer11);
		}
		*/
		//tileLayer13.redraw();
	});
	//map.setMaxBounds(bounds);
	//L.control.scale().addTo(map);
	var lControl=L.Control.extend({
		position: 'bottomleft'
		 ,onAdd: function(map) {
        var img = L.DomUtil.create('img');

        img.src = '../../docs/images/logo.png';
        img.style.width = '200px';

        return img;
    },

    onRemove: function(map) {
        // Nothing to do here
    }
		
	});
	//console.log(minimap);
	
	//var t=new lControl();
	//console.log(t);
	//new lControl().addTo(map);
	console.log('done init');
}
