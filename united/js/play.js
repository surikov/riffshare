console.log('play v1.01');
var levelEngine = null;
function init(){
	console.log('init');
	levelEngine = new LevelEngine(document.getElementById('contentSVG'));
	levelEngine.innerWidth = 30000 * levelEngine.tapSize;
	levelEngine.innerHeight = 500 * levelEngine.tapSize;
	levelEngine.mx = 999;
	levelEngine.applyZoomPosition();
	
	var m3 = [{
			id: 'a99',
			x: 3.5,
			y: 4,
			w: 3,
			h: 2,
			z: [1, 1000],
			l: [{
					kind: 'r',
					x: 3.5,
					y: 4,
					w: 3,
					h: 2,
					rx: 0.2,
					ry: 0.2,
					css: 'redtra'
					,a: function (xx,yy) {
						console.log('clicked',xx,yy);
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
