console.log('play v1.01');
var levelEngine = null;
function init() {
	console.log('init');
	levelEngine = new LevelEngine(document.getElementById('contentSVG'));
	levelEngine.innerWidth = 30000 * levelEngine.tapSize;
	levelEngine.innerHeight = 500 * levelEngine.tapSize;

	levelEngine.mx = 99;
	levelEngine.translateZ = 7;
	levelEngine.applyZoomPosition();


	var m3 = [{
		id: 'a99',
		x: 0,
		y: 0,
		w: 30000,
		h: 500,
		z: [1, 1000],
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

	levelEngine.setModel([{
		g: document.getElementById('cntnt'),
		m: m3
	}
	]);
};

