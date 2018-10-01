console.log('init v1.03');

function init() {
	levelEngine = new TileLevel(document.getElementById('contentSVG'));
	levelEngine.innerWidth = 100 * levelEngine.tapSize;
	levelEngine.innerHeight = 128 * levelEngine.tapSize;
	levelEngine.mx = 99;
	levelEngine.translateZ = 7;
	fillModelControls();
	fillSetting();
	levelEngine.setModel([{
				g: document.getElementById('controls'),
				m: controlsModel,
				kind: levelEngine.layerOverlay
			}, {
				g: document.getElementById('tracks'),
				m: tracksModel
			}, {
				g: document.getElementById('subcontrols'),
				m: settingModel
			}, {
				g: document.getElementById('timeline'),
				m: timelineModel,
				kind: levelEngine.layerRow,
				shiftY: levelEngine.viewHeight / levelEngine.tapSize - 1.2
			}, {
				g: document.getElementById('octaves'),
				m: octavesModel,
				kind: levelEngine.layerColumn,
				shiftX: levelEngine.viewWidth / levelEngine.tapSize - 2
			}
		]);
	levelEngine.applyZoomPosition();
	document.getElementById('chooseFileInput').addEventListener('change', prompt, false);
	window.addEventListener("resize", resizeField);
}

