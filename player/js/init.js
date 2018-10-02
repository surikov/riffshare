console.log('init v1.03');

function init() {
	levelEngine = new TileLevel(document.getElementById('contentSVG'));
	levelEngine.innerWidth = 100 * levelEngine.tapSize;
	levelEngine.innerHeight = 128 * levelEngine.tapSize;
	levelEngine.mx = 99;
	levelEngine.translateZ = 7;
	fillModelControls();
	fillSetting();
	fillBG();
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
				shiftY: 1.0
			}, {
				g: document.getElementById('octaves'),
				m: octavesModel,
				kind: levelEngine.layerColumn,
				shiftX: levelEngine.viewWidth / levelEngine.tapSize - 2
			}, {
				g: document.getElementById('background'),
				m:bgModel
			}
		]);
	levelEngine.applyZoomPosition();
	document.getElementById('chooseFileInput').addEventListener('change', promptFile, false);
	document.getElementById('contentSVG').addEventListener('drop', dropFile, false);
	document.getElementById('contentSVG').addEventListener('dragenter', preventDefaults, false)
	document.getElementById('contentSVG').addEventListener('dragover', preventDefaults, false)
	document.getElementById('contentSVG').addEventListener('dragleave', preventDefaults, false)
	window.addEventListener("resize", resizeField);
}

