console.log('play v1.01');
var levelEngine = null;
function init() {
	console.log('init');
	levelEngine = new LevelEngine(document.getElementById('contentSVG'));
	levelEngine.innerWidth = 30000 * levelEngine.tapSize;
	levelEngine.innerHeight = 500 * levelEngine.tapSize;

	levelEngine.mx = 99;
	levelEngine.translateZ = 7;



	var m3 = [{
		id: 'a99',
		x: 0,
		y: 0,
		w: 30000,
		h: 500,
		z: [1, 100],
		l: [{
			kind: 'r',
			x: 0,
			y: 0,
			w: 30000,
			h: 500,
			rx: 88,
			ry: 88,
			css: 'bgField'
			, a: function (xx, yy) {
				console.log('1', xx, yy);
				//alert('Anchor');
			}
		}, {
			kind: 'r',
			x: 0,
			y: 0,
			w: 300,
			h: 50,
			rx: 11,
			ry: 11,
			css: 'bgField'
			, a: function (xx, yy) {
				console.log('2', xx, yy);
				//alert('Anchor');
			}
		}, {
			kind: 'r',
			x: 0,
			y: 0,
			w: 30,
			h: 20,
			rx: 5,
			ry: 5,
			css: 'bgField'
			, a: function (xx, yy) {
				console.log('3', xx, yy);
				//alert('Anchor');
			}
		}, {
			kind: 'r',
			x: 0,
			y: 0,
			w: 3,
			h: 2,
			rx: 0.2,
			ry: 0.2,
			css: 'bgField'
			, a: function (xx, yy) {
				console.log('4', xx, yy, levelEngine.translateX, levelEngine.translateY, levelEngine.translateZ);
				//alert('Anchor');
			}
		}
		]
	}
	];
	var controlsModel = [{
		id: 'controlsLayer',
		x: 0.25,
		y: 0.25,
		w: 3,
		h: 1,
		z: [1, 100],
		l: [{
			kind: 'r',
			x: 0.25,
			y: 0.25,
			w: 1,
			h: 1,
			css: 'bgField'
			, a: function (xx, yy) {
				console.log('button1', xx, yy);
				//alert('Anchor');
			}
		}, {
			kind: 'p',
			x: 0.25,
			y: 0.25,
			z: levelEngine.tapSize / 300,
			l: 'M150,0C67.157,0,0,67.162,0,150c0,82.841,67.157,150,150,150s150-67.159,150-150C300,67.162,232.843,0,150,0z'
				+ 'M205.846,158.266l-86.557,49.971c-1.32,0.765-2.799,1.144-4.272,1.144c-1.473,0-2.949-0.379-4.274-1.144'
				+ 'c-2.64-1.525-4.269-4.347-4.269-7.402V100.89c0-3.053,1.631-5.88,4.269-7.402c2.648-1.528,5.906-1.528,8.551,0l86.557,49.974'
				+ 'c2.645,1.53,4.274,4.352,4.269,7.402C210.12,153.916,208.494,156.741,205.846,158.266z',
			css2: 'bgField'
		}, {
			kind: 'p',
			x: 1.5,
			y: 0.25,
			z: levelEngine.tapSize / 300,
			l: 'M207.597,115.365h-71.22l-18.759-17.029H85.649c-2.446,0-4.435,1.989-4.435,4.432v108.899'
				+ 'c0,2.443,1.989,4.432,4.435,4.432h3.369l17.688-91.03h105.32v-5.27C212.027,117.357,210.038,115.365,207.597,115.365z',
			css2: 'bgField'
		}, {
			kind: 'p',
			x: 1.5,
			y: 0.25,
			z: levelEngine.tapSize / 300,
			l: 'M149.996,0C67.157,0,0.001,67.161,0.001,149.997S67.157,300,149.996,300s150.003-67.163,150.003-150.003'
				+ 'S232.835,0,149.996,0z M227.241,212.721c-0.542,10.333-8.948,18.601-19.343,18.912c-0.101,0.005-0.197,0.031-0.301,0.031'
				+ 'l-9.231,0.005l-112.72-0.005c-11.023,0-19.991-8.969-19.991-19.994V102.768c0-11.025,8.969-19.994,19.997-19.994h37.975'
				+ 'l18.759,17.029h65.211c11.023,0,19.991,8.969,19.991,19.997v5.27l17.904,0.003L227.241,212.721z',
			css2: 'bgField'
		}, {
			kind: 'r',
			x: 1.5,
			y: 0.25,
			w: 1,
			h: 1,
			css: 'bgField'
			, a: function (xx, yy) {
				console.log('button2', xx, yy);
				//alert('Anchor');
				document.getElementById('chooseFileInput').click();
			}
		}]
	}
	];
	levelEngine.setModel([{
		g: document.getElementById('cntnt'),
		m: m3
	}, {
		g: document.getElementById('controls'),
		m: controlsModel,
		lockX: true,
		lockY: true,
		lockZ: true
	}
	]);
	levelEngine.applyZoomPosition();
	document.getElementById('chooseFileInput').addEventListener('change', function (evt) {
		console.log(evt);
	}, false);

};

