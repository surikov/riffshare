console.log("d3mJS v2.0.5");

function place(what, from, to) {
	var distance = from.distanceTo(to);
	var orientation = new THREE.Matrix4();
	var offsetRotation = new THREE.Matrix4();
	orientation.lookAt(from, to, new THREE.Vector3(0, 3, 0));
	offsetRotation.makeRotationX(Math.PI * 0.5);
	orientation.multiply(offsetRotation);
	var position = to.clone().add(from).divideScalar(2);

}
function Ticker(d3mJS, count, start, end, fire, done) {
	var me = this;
	me.d3mJS = d3mJS;
	me.count = count;
	me.start = start;
	me.end = end;
	me.fire = fire;
	me.done = done;
	me.counter = 0;
	me.tick = function () {
		if (me.counter >= me.count) {
			me.d3mJS.dropTicker(me);
			me.done();
		} else {
			var len = me.end - me.start;
			var n = me.start + len * (1 - Math.cos((Math.PI / 2) * me.counter / (me.count - 1)));
			fire(n);
			me.counter++;
		}
	};
	me.go = function () {
		me.counter = 0;
		me.d3mJS.addTicker(me);
	};
	return this;
}
/*
function ItemDrumBass(size) {
var me = this;
me.geometry = new THREE.CylinderGeometry(size, size,size*1.7,20);
me.material =  new THREE.MeshPhongMaterial({
color : 0xff0000,
shininess : 30,
specular : 0x555555
});
me.mesh = new THREE.Mesh(me.geometry, me.material);
me.mesh.rotation.x = 0.5 * Math.PI;
me.addTo = function ( d3mJS) {
me.d3mJS = d3mJS;
me.d3mJS.scene.add(me.mesh);
};
me.move = function (x, y, z,rz) {
me.mesh.position.set(x, y, z);
me.mesh.rotation.z = rz*2 * Math.PI;
//console.log(r);
};
me.play=function(len){
var l1=200;
var l2=len-l1;
if(len<l1){
l1=len-1;
l2=1;
}
me.material.color.setHex(0xffff00);
setTimeout(function(){
me.material.color.setHex(0xff9933);
setTimeout(function(){
me.material.color.setHex(0xff0000);
},l2);
},l1);
};
return me;
}*/
function ItemFinger() {
	var me = this;
	me.geometry = new THREE.CylinderGeometry(11, 11, 11, 20);
	me.material = new THREE.MeshPhongMaterial({
			color : 0x00ff66,
			shininess : 30,
			specular : 0x555555
		});
	me.mesh = new THREE.Mesh(me.geometry, me.material);
	me.addTo = function (d3mJS) {
		me.d3mJS = d3mJS;
		me.d3mJS.scene.add(me.mesh);
	};
	me.move = function (x, y, z) {
		me.mesh.position.set(x, y, z);
	};
	return me;
}
function ItemDrumSnare(size, high) {
	var me = this;
	me.geometry = new THREE.CylinderGeometry(size, size, high, 20);
	me.material = new THREE.MeshPhongMaterial({
			color : 0xff0000,
			shininess : 30,
			specular : 0x555555
		});
	me.mesh = new THREE.Mesh(me.geometry, me.material);
	//me.mesh.rotation.x = 0.5 * Math.PI;
	me.addTo = function (d3mJS) {
		me.d3mJS = d3mJS;
		me.d3mJS.scene.add(me.mesh);
	};
	me.move = function (x, y, z, rx, rz) {
		me.mesh.position.set(x, y, z);
		me.mesh.rotation.x = rx * 2 * Math.PI;
		me.mesh.rotation.z = rz * 2 * Math.PI;
		//console.log(r);
	};
	me.play = function (len) {
		var l1 = 200;
		var l2 = len - l1;
		if (len < l1) {
			l1 = len - 1;
			l2 = 1;
		}
		me.material.color.setHex(0xffff00);
		setTimeout(function () {
			me.material.color.setHex(0xff9933);
			setTimeout(function () {
				me.material.color.setHex(0xff0000);
			}, l2);
		}, l1);
	};
	return me;
}
function ItemDrumCone(size, high) {
	var me = this;
	me.geometry = new THREE.CylinderGeometry(size, size * 0.5, high, 20);
	me.material = new THREE.MeshPhongMaterial({
			color : 0xff0000,
			shininess : 30,
			specular : 0x555555
		});
	me.mesh = new THREE.Mesh(me.geometry, me.material);
	//me.mesh.rotation.x = 0.5 * Math.PI;
	me.addTo = function (d3mJS) {
		me.d3mJS = d3mJS;
		me.d3mJS.scene.add(me.mesh);
	};
	me.move = function (x, y, z, rx, rz) {
		me.mesh.position.set(x, y, z);
		me.mesh.rotation.x = rx * 2 * Math.PI;
		me.mesh.rotation.z = rz * 2 * Math.PI;
		//console.log(r);
	};
	me.play = function (len) {
		var l1 = 200;
		var l2 = len - l1;
		if (len < l1) {
			l1 = len - 1;
			l2 = 1;
		}
		me.material.color.setHex(0xffff00);
		setTimeout(function () {
			me.material.color.setHex(0xff9933);
			setTimeout(function () {
				me.material.color.setHex(0xff0000);
			}, l2);
		}, l1);
	};
	return me;
}
function ItemDrumPlate(size, high, leg) {
	var me = this;
	me.leg = leg;
	me.geometry = new THREE.CylinderGeometry(0, size, high, 20);
	me.geometry2 = new THREE.CylinderGeometry(0.05, 0.05, me.leg);
	me.material = new THREE.MeshPhongMaterial({
			color : 0xff0000,
			shininess : 30,
			specular : 0x555555
		});
	me.mesh = new THREE.Mesh(me.geometry, me.material);
	me.mesh2 = new THREE.Mesh(me.geometry2, me.material);
	//me.mesh.rotation.x = 0.5 * Math.PI;
	me.addTo = function (d3mJS) {
		me.d3mJS = d3mJS;
		me.d3mJS.scene.add(me.mesh);
		me.d3mJS.scene.add(me.mesh2);
	};
	me.move = function (x, y, z, rx, rz) {
		me.mesh.position.set(x, y, z);
		me.mesh.rotation.x = rx * 2 * Math.PI;
		me.mesh.rotation.z = rz * 2 * Math.PI;
		me.mesh2.position.set(x, y - me.leg * 0.5, z);
		//console.log(r);
	};
	me.play = function (len) {
		var l1 = 200;
		var l2 = len - l1;
		if (len < l1) {
			l1 = len - 1;
			l2 = 1;
		}
		me.material.color.setHex(0xffff00);
		setTimeout(function () {
			me.material.color.setHex(0xff9933);
			setTimeout(function () {
				me.material.color.setHex(0xff0000);
			}, l2);
		}, l1);
	};
	return me;
}
function ItemXmsBall(color) {
	var me = this;
	me.color = color; //0xff0000;
	me.op2 = 0.6;
	me.op1 = 0.9;
	me.sh2 = 30 * 0.5;
	me.sh1 = 30 * 100;
	me.on = false;
	//me.sparkle = new ItemSparkle(30, 0.5, 0xffffff);
	me.material = new THREE.MeshPhongMaterial({
			color : me.color,
			shininess : me.sh1,
			specular : me.color, //0x444444,
			//shading : THREE.FlatShading,
			//blending : THREE.MultiplyBlending,//THREE.SubtractiveBlending,//THREE.AdditiveBlending,//THREE.NormalBlending,//THREE.NoBlending,

			transparent : true,
			opacity : me.op1,
			side : THREE.DoubleSide
		});
	me.m2 = new THREE.MeshPhongMaterial({
			color : me.color,
			shininess : 30 * 0.5,
			specular : 0xffffff,
			//shading : THREE.FlatShading,
			//blending : THREE.AdditiveBlending,
			transparent : true,
			opacity : 0.99,
			side : THREE.DoubleSide //BackSide
		});
	me.s2 = new THREE.SphereGeometry(2, 20, 20);
	me.sphereGeometry = new THREE.SphereGeometry(5, 30, 30);
	me.sphere = new THREE.Mesh(me.sphereGeometry, me.material);
	me.i2 = new THREE.Mesh(me.s2, me.m2);
	me.sphere.add(me.i2);
	me.sparkle = new ItemSparkle(50, 0.1 //+ Math.random() * 0.0001
		, 0xffffff);
	me.sparkle.sprite.visible = false;
	me.sparkle2 = new ItemSparkle(30, 0.5 //+ Math.random() * 0.0003
		, color);
	me.sparkle2.sprite.visible = false;
	me.attachTo = function (toObject3D, d3mJS) {
		me.d3mJS = d3mJS;
		me.attachedTo = toObject3D;
		toObject3D.add(me.sphere);
		toObject3D.add(me.sparkle.sprite);
		toObject3D.add(me.sparkle2.sprite);
		d3mJS.addTicker(me.sparkle);
		d3mJS.addTicker(me.sparkle2);

	};
	me.detach = function () {
		//console.log("detach");
		me.d3mJS.dropTicker(me.sparkle);
		me.d3mJS.dropTicker(me.sparkle2);
		me.attachedTo.remove(me.sphere);
		me.attachedTo.remove(me.sparkle.sprite);
		me.attachedTo.remove(me.sparkle2.sprite);
	};
	me.light = function () {
		me.on = true;
		me.sparkle.sprite.visible = true;
		me.sparkle2.sprite.visible = true;
		//me.m2.color=new THREE.Color( 0xffffff);
		me.material.opacity = me.op2;
		me.material.shininess = me.sh2;
		me.material.specular = new THREE.Color(0xffffff); ;
	};
	me.unlight = function () {
		me.on = false;
		me.sparkle.sprite.visible = false;
		me.sparkle2.sprite.visible = false;
		//me.m2.color=new THREE.Color( me.color);
		me.material.opacity = me.op1;
		me.material.shininess = me.sh1;
		me.material.specular = new THREE.Color(me.color); ;
	};
	me.move = function (x, y, z) {
		me.sphere.position.set(x, y, z);
		me.sparkle.move(x, y, z);
		me.sparkle2.move(x, y, z);
	};
	return me;
}

function ItemDirectionalLight(sparkleColor) {
	var me = this;
	me.light = new THREE.DirectionalLight(0xffffff, 0.5);
	//new THREE.SpotLight(0xffffff);
	//new THREE.DirectionalLight( 0xffffff, 0.75 );
	//new THREE.PointLight(0xffffff, 1, 100);
	//me.light.position.set(0, 0, 0);
	me.sparkle = new ItemSparkle(10, 0.5, sparkleColor); // 0xffffff);
	//me.spot = new ItemSparkle(10*0.5, 0.5, 0xffffff); // 0xffffff);
	//me.sparkle.sprite.visible = false;
	me.addTo = function (d3mJS) {
		me.d3mJS = d3mJS;
		me.d3mJS.scene.add(me.light);
		me.sparkle.addTo(me.d3mJS);
		//me.spot.addTo(me.d3mJS);
	};
	me.move = function (x, y, z) {
		//me.light.position.set(20, 40, 20);
		me.light.position.setX(x);
		me.light.position.setY(y);
		me.light.position.setZ(z);
		me.sparkle.move(x, y, z);
		//me.spot.move(x, y, z);
	};
	return me;
}
function ItemLine(color) {
	var me = this;
	me.material = new THREE.LineBasicMaterial({
			color : color
		});
	me.lineGeometry = new THREE.Geometry();
	me.lineGeometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1));
	me.line = new THREE.Line(me.lineGeometry, me.material, THREE.LineStrip);
	me.addTo = function (d3mJS) {
		me.d3mJS = d3mJS;
		me.d3mJS.scene.add(me.line);
	};
	me.align = function (from, to) {
		me.lineGeometry.vertices.splice(0, me.lineGeometry.vertices.length)
		me.lineGeometry.vertices.push(from, to);
		//me.line.updateMatrix();
	};
	return me;
}
function Item3dText(text, height, size, font, colorMaterial) {
	var me = this;
	//console.log(text,font);
	me.geometry = new THREE.TextGeometry(text, {
			font : font,
			size : size, //3,
			height : height, //0.2,
			curveSegments : 12,
			bevelEnabled : false
		});
	/*me.material = new THREE.MeshStandardMaterial({
	emissive : 0x222222,
	color : 0x00ff00,//color,//0xff0000
	//, roughness: 0.1

	metalness : 0.5
	});*/
	me.mesh = new THREE.Mesh(me.geometry, colorMaterial); //me.material);
	me.addTo = function (d3mJS, group) {
		var g = d3mJS.mainGroup;
		if (group) {
			g = group;
		}
		me.d3mJS = d3mJS;
		g.add(me.mesh);
		return me;
	};
	/*me.color=function(color){
	me.material.color.setHex(color);
	return me;
	};*/
	me.move = function (x, y, z, rx, ry, rz) {
		me.mesh.position.setX(x);
		me.mesh.position.setY(y);
		me.mesh.position.setZ(z);
		me.mesh.rotation.x = rx;
		me.mesh.rotation.y = ry;
		me.mesh.rotation.z = rz;
		return me;
	};
	return this;
};
function ItemText(foreground, textureWidth, textureHeight, font, scale) {
	var me = this;
	me.bg = 'rgba(0,0,0,0.0)'; //background;
	me.fg = foreground;
	me.canvas = document.createElement('canvas');
	me.canvas.width = textureWidth;
	me.canvas.height = textureHeight;
	me.context = me.canvas.getContext('2d');
	//me.context.font = me.textSize + "px font_ttf";
	me.context.font = font;
	//context.font = "Bold " + fontsize + "px " + fontface;
	//var metrics = context.measureText( message );
	//var textWidth = metrics.width;
	me.context.textBaseline = "middle";
	//me.context.textBaseline = "top";
	me.context.fillStyle = me.bg;
	me.context.fillRect(0, 0, me.canvas.width, me.canvas.height);

	//context.fillStyle = "rgba(0, 0, 0, 1.0)";
	me.context.fillStyle = me.fg; //"rgba(0, 0, 0, 1.0)";

	me.texture = new THREE.Texture(me.canvas);
	me.texture.needsUpdate = true;
	me.material = new THREE.SpriteMaterial({
			map : me.texture
			//,
			//useScreenCoordinates : false
			//, alignment: spriteAlignment
		});
	//me.material.map.offset.set( -0.5,0.5 );
	me.sprite = new THREE.Sprite(me.material);
	me.sprite.scale.set(scale, scale * me.canvas.height / me.canvas.width, scale);

	//console.log(me.canvas.width + " / " + me.canvas.height);
	me.addTo = function (d3mJS, group) {
		var g = d3mJS.mainGroup;
		if (group) {
			g = group;
		}
		me.d3mJS = d3mJS;
		g.add(me.sprite);
		return me;
	};
	me.text = function (txt) {
		me.context.clearRect(0, 0, me.canvas.width, me.canvas.height);
		me.context.fillStyle = me.bg;
		me.context.fillRect(0, 0, me.canvas.width, me.canvas.height);
		me.context.fillStyle = me.fg;
		me.context.fillText(txt, me.canvas.width / 2, me.canvas.height / 2);
		me.texture.needsUpdate = true;
		me.material.map.needsUpdate = true;
		return me;
	};
	me.move = function (x, y, z) {
		me.sprite.position.setX(x);
		me.sprite.position.setY(y);
		me.sprite.position.setZ(z);
		return me;
	};
	//console.log(me);
	return me;
}
function ItemXYZ() {
	var me = this;
	//me.scene = null;
	me.sphereGeometry = new THREE.SphereGeometry(0.1);
	me.material = new THREE.MeshLambertMaterial({
			color : 0xffffff
		});
	me.materialX = new THREE.LineBasicMaterial({
			color : 0xff0000
		});
	me.materialY = new THREE.LineBasicMaterial({
			color : 0x00ff00
		});
	me.materialZ = new THREE.LineBasicMaterial({
			color : 0x0000ff
		});
	me.sphere = new THREE.Mesh(me.sphereGeometry, me.material);
	me.sphere.position.x = 0;
	me.sphere.position.y = 0;
	me.sphere.position.z = 0;
	me.lineGeometryX = new THREE.Geometry();
	me.lineGeometryX.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(100, 0, 0));
	me.lineX = new THREE.Line(me.lineGeometryX, me.materialX, THREE.LineStrip);
	me.lineGeometryY = new THREE.Geometry();
	me.lineGeometryY.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 100, 0));
	me.lineY = new THREE.Line(me.lineGeometryY, me.materialY, THREE.LineStrip);
	me.lineGeometryZ = new THREE.Geometry();
	me.lineGeometryZ.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 100));
	me.lineZ = new THREE.Line(me.lineGeometryZ, me.materialZ, THREE.LineStrip);

	me.addTo = function (d3mJS) { //, group) {
		/*var g = d3mJS.mainGroup;
		if (group) {
		g = group;
		}*/
		me.d3mJS = d3mJS;
		/*
		g.add(me.sphere);
		g.add(me.lineX);
		g.add(me.lineY);
		g.add(me.lineZ);
		 */
		me.d3mJS.scene.add(me.sphere);
		me.d3mJS.scene.add(me.lineX);
		me.d3mJS.scene.add(me.lineY);
		me.d3mJS.scene.add(me.lineZ);
	};
	me.free = function () {
		//
	};
	return me;
}
function ItemSphere(size, color) {
	var me = this;
	me.geometrySphere = new THREE.SphereGeometry(size, 20, 20);
	me.material = new THREE.MeshStandardMaterial({
			emissive : 0x222222,
			color : color
			//, roughness: 0.1
		,
			metalness : 0.5
		});
	me.meshSphere = new THREE.Mesh(me.geometrySphere, me.material);
	me.addTo = function (d3mJS, group) {
		var g = d3mJS.mainGroup;
		if (group) {
			g = group;
		}
		me.d3mJS = d3mJS;
		me.d3mJS.mainGroup.add(me.meshSphere);
		return me;
	};
	me.move = function (x, y, z) {
		me.meshSphere.position.setX(x);
		me.meshSphere.position.setY(y);
		me.meshSphere.position.setZ(z);
		return me;
	};
	return me;
}
function ItemNoteLine(colorMaterial, x, y, z, toX, toY, toZ) {
	var me = this;
	//me.sparkle = new ItemSparkle(5, 0.5, color);
	var from3 = new THREE.Vector3(x, y, z);
	var to3 = new THREE.Vector3(toX, toY, toZ);
	var distance = from3.distanceTo(to3) + 0.01;
	var ratio = 1 - distance / 32;
	if (ratio < 0.3) {
		ratio = 0.3;
	}
	if (ratio > 1) {
		ratio = 1;
	}
	//console.log('ratio',ratio);
	me.geometrySphere = new THREE.SphereGeometry(0.49, 10, 10);
	me.geometryCylinder = new THREE.CylinderGeometry(0.49, 0.49 * ratio, 1, 10);
	/*me.material = new THREE.MeshStandardMaterial({
	emissive : color,
	color : 0x666666
	//, roughness: 0.1,
	metalness : 0.25
	});*/
	me.meshSphere = new THREE.Mesh(me.geometrySphere, colorMaterial);
	me.meshCylinder = new THREE.Mesh(me.geometryCylinder, colorMaterial);
	//me.meshCylinder.position.setY(r);
	me.noteGroup = new THREE.Group();
	me.noteGroup.add(me.meshSphere);
	me.noteGroup.add(me.meshCylinder);
	me.move = function (x, y, z, toX, toY, toZ) {
		//var from3=new THREE.Vector3(100, 0,0);//new THREE.Vector3(x, y,z);
		//var to3=new THREE.Vector3(0, 0,0);//new THREE.Vector3(toX, toY,toZ);
		var from3 = new THREE.Vector3(x, y, z);
		var to3 = new THREE.Vector3(toX, toY, toZ);
		var distance = from3.distanceTo(to3) + 0.01;

		var orientation = new THREE.Matrix4();
		var offsetRotation = new THREE.Matrix4();
		orientation.lookAt(from3, to3, new THREE.Vector3(0, 3, 0));
		offsetRotation.makeRotationX(Math.PI * 0.5);
		orientation.multiply(offsetRotation);
		var position = to3.clone().add(from3).divideScalar(2);
		me.meshCylinder.applyMatrix(orientation);
		/*me.group.position.setX(position.x);
		me.group.position.setY(position.y);
		me.group.position.setZ(position.z);*/
		me.geometryCylinder.scale(1, distance, 1);
		me.meshSphere.position.setX(from3.x);
		me.meshSphere.position.setY(from3.y);
		me.meshSphere.position.setZ(from3.z);
		me.meshCylinder.position.setX(position.x);
		me.meshCylinder.position.setY(position.y);
		me.meshCylinder.position.setZ(position.z);
		//console.log(distance,position,orientation);

		//me.sparkle.move(x,y,z+0.5);

		/*
		me.group.position.setX(x);
		me.group.position.setY(y);
		me.group.position.setZ(z);*/
		return me;
	};
	me.addTo = function (d3mJS, group) {
		me.g = d3mJS.mainGroup;
		if (group) {
			me.g = group;
		}
		me.d3mJS = d3mJS;
		//me.d3mJS.scene.add(me.group);
		//me.g.add(me.meshSphere);
		//me.g.add(me.meshCylinder);
		me.g.add(me.noteGroup);
		//me.sparkle.addTo(d3mJS, group);
		return me;
	};
	me.drop = function () {
		//console.log('drop',this);
		//me.d3mJS.scene.remove(me.meshSphere);
		//me.g.remove(me.meshSphere);
		me.noteGroup.remove(me.meshSphere);
		me.geometrySphere.dispose();

		//me.d3mJS.scene.remove(me.meshCylinder);
		//me.g.remove(me.meshCylinder);
		me.noteGroup.remove(me.meshCylinder);
		me.geometryCylinder.dispose();

		//me.d3mJS.scene.remove(me.group);
		//me.d3mJS.mainGroup.remove(me.group);
		me.g.remove(me.noteGroup);

		//me.meshCylinder.dispose(); // new

		//me.material.dispose();
		//texture.dispose();
		//console.log(me);
	};
	return me;
}
function ItemDisk(radius, height, colorMaterial) {
	var me = this;
	//me.sparkle = new ItemSparkle(5, 0.5, color);
	me.geometryCylinder = new THREE.CylinderGeometry(radius, radius, height, 20);
	/*me.material = new THREE.MeshStandardMaterial({
	emissive : color,
	color : 0xffffff,
	metalness : 0.75
	});*/
	me.meshCylinder = new THREE.Mesh(me.geometryCylinder, colorMaterial);
	me.move = function (x, y, z) {
		me.meshCylinder.position.setX(x);
		me.meshCylinder.position.setY(y);
		me.meshCylinder.position.setZ(z);
		//me.sparkle.move(x,y,z);
		return me;
	};
	me.addTo = function (d3mJS, group) {
		var g = d3mJS.mainGroup;
		if (group) {
			g = group;
		}
		me.d3mJS = d3mJS;
		g.add(me.meshCylinder);
		//me.sparkle.addTo(d3mJS, group);
		return me;
	};
	me.drop = function () {
		me.d3mJS.scene.remove(me.meshCylinder);
		me.d3mJS.mainGroup.remove(me.meshCylinder);
		//me.meshCylinder.dispose(); // new
		me.geometryCylinder.dispose();
		//me.material.dispose();
		//texture.dispose();
	};
	return me;
}
function ItemLinesGrid() {
	var me = this;
	me.mm = new THREE.LineBasicMaterial({
			color : 0x99ccff //
			//,fog:true//
		,
			linewidth : 20 //
		});
	me.lineGeometryX = new THREE.Geometry();
	me.lineGeometryX.vertices.push(new THREE.Vector3(50, 20, 50), new THREE.Vector3(100, 50, 20));

	me.lineX = new THREE.Line(me.lineGeometryX, me.mm, THREE.LineStrip);
	me.addTo = function (d3mJS) {
		me.d3mJS = d3mJS;
		me.d3mJS.scene.add(me.lineX);

		me.materialX = new THREE.LineDashedMaterial({
				color : 0x33ffff,
				gapSize : 3 //
			});
		var le = 10000;
		var cellSize = 9;
		var g = new THREE.Geometry();
		for (var x = 0; x < le; x++) {
			g.vertices.push(new THREE.Vector3(x * cellSize, 0, 10), new THREE.Vector3(x * cellSize, 127 * cellSize, 10));
			/*var g = new THREE.Geometry();
			g.vertices.push(new THREE.Vector3(x, 0, 10), new THREE.Vector3(x, 127, 10));
			var o = new THREE.Line(g, me.materialX, THREE.LineStrip);
			me.d3mJS.scene.add(o);
			 */
		}
		//le=1000;
		for (var y = 0; y < 127; y++) {
			/*
			var g = new THREE.Geometry();
			g.vertices.push(new THREE.Vector3(0, y, 10), new THREE.Vector3(le, y, 10));
			var o = new THREE.Line(g, me.materialX, THREE.LineStrip);
			me.d3mJS.scene.add(o);
			 */
			g.vertices.push(new THREE.Vector3(0, y * cellSize, 10), new THREE.Vector3(le * cellSize, y * cellSize, 10));
		}
		var o = new THREE.Line(g, me.materialX, THREE.LineStrip);
		me.d3mJS.scene.add(o);

		me.material2 = new THREE.LineDashedMaterial({
				color : 0x33ff00,
				gapSize : 3 //
			});
		g = new THREE.Geometry();
		for (var x = 0; x < le; x = x + 100) {
			g.vertices.push(new THREE.Vector3(x * cellSize, 0, 10), new THREE.Vector3(x * cellSize, 127 * cellSize, 10));
		}
		o = new THREE.Line(g, me.material2, THREE.LineStrip);
		me.d3mJS.scene.add(o);

		me.material3 = new THREE.LineDashedMaterial({
				color : 0xff0066,
				gapSize : 3 //
			});
		g = new THREE.Geometry();
		for (var x = 0; x < le; x = x + 1000) {
			g.vertices.push(new THREE.Vector3(x * cellSize, 0, 10), new THREE.Vector3(x * cellSize, 127 * cellSize, 10));
		}
		o = new THREE.Line(g, me.material3, THREE.LineStrip);
		me.d3mJS.scene.add(o);
	};
	return me;
}
function ItemGroup() {
	var me = this;
	me.group = new THREE.Group();
	me.addTo = function (d3mJS) {
		me.d3mJS = d3mJS;
		me.d3mJS.mainGroup.add(me.group);
		return me;
	};
	me.move = function (x, y, z) {
		me.group.position.setX(x);
		me.group.position.setY(y);
		me.group.position.setZ(z);
		return me;
	};
	me.child = function (item) {
		me.group.add(me.mesh);
		return me;
	};
	return me;
}
function ItemNotesGrid() {
	var me = this;
	me.planeGeometry = new THREE.PlaneGeometry(180000, 200);
	me.material = new THREE.MeshLambertMaterial({
			color : 0xffffff,
			side : THREE.DoubleSide,
			transparent : true,
			opacity : 0.75
		});
	me.mesh = new THREE.Mesh(me.planeGeometry, me.material);
	//me.mesh.position.setX(100);
	//me.mesh.position.setY(100);
	//me.mesh.position.setZ(-1);
	var line = new THREE.PlaneGeometry(1, 200);

	me.group = new THREE.Group();
	me.group.add(me.mesh);
	for (var i = 0; i < 50; i++) {
		var mi = new THREE.Mesh(line, me.material);
		mi.rotation.y = Math.PI * 0.5;
		mi.position.setX(i * 4 - 100);
		me.group.add(mi);
	}
	for (var i = 0; i < 50; i++) {
		var mi = new THREE.Mesh(line, me.material);
		mi.rotation.x = Math.PI * 0.5;
		mi.rotation.z = Math.PI * 0.5;
		mi.position.setY(i * 4 - 100);
		me.group.add(mi);
	}

	me.group.position.setX(100);
	me.group.position.setY(100);
	me.group.position.setZ(-1);
	me.addTo = function (d3mJS) {
		me.d3mJS = d3mJS;
		//me.d3mJS.scene.add(me.mesh);
		//me.d3mJS.scene.add(mi);
		me.d3mJS.scene.add(me.group);
	};
	return me;

}
function ItemMirror(w, h, px, py, pz, rx, ry, rz) {
	var me = this;
	me.w = w;
	me.h = h;
	me.rx = rx;
	me.ry = ry;
	me.rz = rz;
	me.px = px;
	me.py = py;
	me.pz = pz;
	me.addTo = function (d3mJS) {
		me.d3mJS = d3mJS;
		me.groundMirror = new THREE.Mirror(me.d3mJS.renderer, me.d3mJS.camera, {
				clipBias : 0.003,
				textureWidth : window.innerWidth,
				textureHeight : window.innerHeight,
				//color : 0x223344,
				//color : 0x113355,
				//color : 0x556677,
				color : 0x222222,
				side : THREE.DoubleSide
			});
		me.groundPlane = new THREE.PlaneGeometry(w, h); //300
		me.mirrorMesh = new THREE.Mesh(me.groundPlane, me.groundMirror.material);
		me.mirrorMesh.add(me.groundMirror);
		me.mirrorMesh.rotation.x = me.rx; //-0.15 * Math.PI;
		me.mirrorMesh.rotation.y = me.ry; //-0.15 * Math.PI;
		me.mirrorMesh.rotation.z = me.rz; //-0.25 * Math.PI;
		me.mirrorMesh.position.x = me.px; //-10;
		me.mirrorMesh.position.y = me.py; //-10;
		me.mirrorMesh.position.z = me.pz; //-10;
		me.d3mJS.mainGroup.add(me.mirrorMesh);
		me.d3mJS.mirrors.push(me);
		/*
		var geometry = new THREE.PlaneGeometry(300, 300);
		var material = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide} );
		var plane = new THREE.Mesh( geometry, material );
		plane.rotation.x = -0.15 * Math.PI;
		plane.rotation.z = -0.25 * Math.PI;
		plane.position.y = -10;
		plane.position.z = -15;
		me.d3mJS.scene.add( plane );
		 */
		//console.log('me.groundMirror',me.groundMirror);
	};

	return me;
}
function ItemBox(w, h, d, c) {
	var me = this;
	me.geometry = new THREE.BoxGeometry(w, h, d);
	me.material = c;
	me.material = new THREE.MeshPhongMaterial({
			color : c
		});
	me.cube = new THREE.Mesh(me.geometry, me.material);
	me.addTo = function (d3mJS, group) {
		var g = d3mJS.mainGroup;
		if (group) {
			g = group;
		}
		me.d3mJS = d3mJS;
		g.add(me.cube);
		return me;
	};
	me.free = function () {
		//
	};
	me.show = function () {
		me.cube.visible = true;
	};
	me.hide = function () {
		me.cube.visible = false;
	};
	me.move = function (x, y, z) {
		me.cube.position.setX(x);
		me.cube.position.setY(y);
		me.cube.position.setZ(z);
		return me;
	};
	return me;
}
function ItemBox2(w, h, d, c) {
	var me = this;
	me.geometry = new THREE.BoxGeometry(w, h, d);
	me.material = c;
	/*me.material = new THREE.MeshPhongMaterial({
	color : c
	});*/
	me.cube = new THREE.Mesh(me.geometry, me.material);
	me.addTo = function (d3mJS, group) {
		var g = d3mJS.mainGroup;
		if (group) {
			g = group;
		}
		me.d3mJS = d3mJS;
		g.add(me.cube);
		return me;
	};
	me.free = function () {
		//
	};
	me.show = function () {
		me.cube.visible = true;
	};
	me.hide = function () {
		me.cube.visible = false;
	};
	me.move = function (x, y, z) {
		me.cube.position.setX(x);
		me.cube.position.setY(y);
		me.cube.position.setZ(z);
		return me;
	};
	return me;
}
function ItemGlass(w, h, d, m) { //c,o) {
	var me = this;
	me.geometry = new THREE.BoxGeometry(w, h, d);
	/*me.material = new THREE.MeshPhongMaterial({
	color : c,
	transparent : true,
	opacity : o
	});*/
	me.cube = new THREE.Mesh(me.geometry, m); //me.material);
	me.addTo = function (d3mJS) {
		me.d3mJS = d3mJS;
		me.d3mJS.mainGroup.add(me.cube);
		return me;
	};
	me.free = function () {
		//
	};
	me.show = function () {
		me.cube.visible = true;
	};
	me.hide = function () {
		me.cube.visible = false;
	};
	me.move = function (x, y, z) {
		me.cube.position.setX(x);
		me.cube.position.setY(y);
		me.cube.position.setZ(z);
		return me;
	};
	return me;
}

function ItemKnob(w, h, d, c, hide) {
	var me = this;

	me.geometry = new THREE.BoxGeometry(w, h, d);
	me.material = new THREE.MeshPhongMaterial({
			color : c,
			transparent : true,
			opacity : 0.99
		});
	if (hide) {
		me.material.visible = false;
	}
	me.cube = new THREE.Mesh(me.geometry, me.material);

	me.addTo = function (d3mJS, group) {
		var g = d3mJS.mainGroup;
		if (group) {
			g = group;
		}
		me.d3mJS = d3mJS;
		g.add(me.cube);
		me.d3mJS.targetList.push(me.cube);
		me.d3mJS.knobs.push(me);
		return me;
	};
	me.attach = function (d3mJS, object3D) {
		me.d3mJS = d3mJS;
		object3D.add(me.cube);
		me.d3mJS.targetList.push(me.cube);
		me.d3mJS.knobs.push(me);
		return me;
	};
	me.free = function () {
		//
	};
	me.show = function () {
		me.cube.visible = true;
	};
	me.hide = function () {
		me.cube.visible = false;
	};
	me.uncheck = function () {
		me.material.opacity = 0.25;
	};
	me.check = function () {
		me.material.opacity = 0.99;
	};
	me.move = function (x, y, z) {
		me.cube.position.setX(x);
		me.cube.position.setY(y);
		me.cube.position.setZ(z);
		return me;
	};
	me.tap = function (intersectPointInWorld) {
		//console.log(me);
	};
	me.drag = function (x, y) {
		//console.log(me);
	};
	me.lock = function () {
		//console.log(me);
	};
	return me;
}
function takeThreeTextureLoader() {
	if (!(window.threeTextureLoader)) {
		//console.log('new THREE.TextureLoader');
		window.threeTextureLoader = new THREE.TextureLoader();
		window.threeTextureLoader.crossOrigin = '';
		window.threeTextureLoader.setCrossOrigin("anonymous");
	}
	return window.threeTextureLoader;
}
function takeSparkleTexture() {

	if (!(window.sparkleTexture1)) {
		window.sparkleTexture1 = takeThreeTextureLoader().load('img/sparkle1.jpg', function (a, b, c) {
				//console.log('takeSparkleTexture onLoad', a, b, c);
			}, function (a, b, c) {
				//console.log('takeSparkleTexture onProgress', a, b, c);
			}, function (a, b, c) {
				//console.log('takeSparkleTexture onError', a, b, c);
			});
		//'resources/img/sparkle1.jpg');
		//console.log('load window.sparkleTexture1',window.sparkleTexture1);
	}
	//console.log('window.sparkleTexture1',window.sparkleTexture1);
	/*

	var url='file:///D:/projects/notesplayer/rsc/ui3/resources/img/sparkle1.jpg';
	var image = document.createElement( 'img' );
	image.src = url;
	var texture = new THREE.Texture( image );
	texture.needsUpdate = true;
	window.sparkleTexture1=texture;
	 */
	return window.sparkleTexture1;
}
function ItemSparkle(size, seed, color, noFlash) {
	var me = this;
	me.size = size;
	me.seed = seed;
	me.color = color;
	me.counter = 0;
	me.scale = 1;
	me.noFlash = noFlash;
	me.material = new THREE.SpriteMaterial({
			map : takeSparkleTexture(), //vSparkleTexture1, // sparkleTexture2(),
			blending : THREE.AdditiveBlending,
			//useScreenCoordinates : false,
			color : me.color
		});
	var spotMaterial = new THREE.SpriteMaterial({
			map : takeSparkleTexture(),
			blending : THREE.AdditiveBlending,
			color : 0xffffff
		});
	me.sprite = new THREE.Sprite(me.material);
	me.spotSprite = new THREE.Sprite(spotMaterial);
	me.sprite.scale.set(1, 1, 1).multiplyScalar(me.size);
	me.spotSprite.scale.set(1, 1, 1).multiplyScalar(me.size * 0.5);
	me.addTo = function (d3mJS, group) {
		var g = d3mJS.mainGroup;
		if (group) {
			g = group;
		}
		me.d3mJS = d3mJS;
		g.add(me.sprite);
		g.add(me.spotSprite);
		if (me.noFlash) {
			//
		} else {
			me.d3mJS.addTicker(me);
		}
		return me;
	};
	me.light = function (color) {
		me.color = color;
		//me.material.color=color;
		me.material.color.setHex(color);
		return me;
	};
	me.rescale = function (scale) {
		//console.log(scale);
		me.scale = scale;
		me.sprite.scale.set(1, 1, 1).multiplyScalar(me.size * scale);
		me.spotSprite.scale.set(1, 1, 1).multiplyScalar(me.size * 0.5 * scale);
		return me;
	};
	me.visible = function (v) {
		//console.log('visible',v);
		me.sprite.visible = v;
		me.spotSprite.visible = v;
	};
	me.move = function (x, y, z) {
		me.sprite.position.setX(x);
		me.sprite.position.setY(y);
		me.sprite.position.setZ(z);
		me.spotSprite.position.setX(x);
		me.spotSprite.position.setY(y);
		me.spotSprite.position.setZ(z);
		return me;
	};
	me.tick = function () {
		me.counter++;
		me.sprite.scale.set(1, 1, 1).multiplyScalar(me.scale * (me.size + 0.2 * me.size * Math.sin(me.seed * me.counter)));
		me.spotSprite.scale.set(1, 1, 1).multiplyScalar(me.scale * (me.size * 0.5 + 0.2 * me.size * 0.5 * Math.sin(me.seed * me.counter)));
		//console.log(material);
		return me;
	};
	return me;
};
function ItemInvertedGlobe(r, texture) {
	var me = this;
	me.geometry = new THREE.SphereGeometry(r, 50, 50);
	var map = takeThreeTextureLoader().load(texture, function (a, b, c) {
			//console.log('onLoad', a, b, c);
		}, function (a, b, c) {
			//console.log('onProgress', a, b, c);
		}, function (a, b, c) {
			//console.log('onError', a, b, c);
		});
	//console.log(map);
	me.material = new THREE.MeshBasicMaterial({
			side : THREE.DoubleSide,
			map : map
		});
	me.sphere = new THREE.Mesh(me.geometry, me.material);
	me.sphere.scale.x = -1;
	me.sphere.rotation.y = -0.5 * Math.PI;
	me.addTo = function (d3mJS) {
		me.d3mJS = d3mJS;
		me.d3mJS.scene.add(me.sphere);
	};
	me.free = function () {
		//
	};
	me.move = function (x, y, z) {
		me.sphere.position.setX(x);
		me.sphere.position.setY(y);
		me.sphere.position.setZ(z);
	};
	return me;
}
function geometry1() {
	var geo = new THREE.Geometry();
	geo.vertices.push(new THREE.Vector3(0.5, 0, 0));
	geo.vertices.push(new THREE.Vector3(-0.5, 0, 0));
	geo.vertices.push(new THREE.Vector3(0, 1, 0));
	geo.vertices.push(new THREE.Vector3(0, -1, 0));
	geo.vertices.push(new THREE.Vector3(0, 0, 0.5));
	geo.vertices.push(new THREE.Vector3(0, 0, -0.5));
	geo.faces.push(new THREE.Face3(0, 2, 4));
	geo.faces.push(new THREE.Face3(1, 2, 4));
	geo.faces.push(new THREE.Face3(1, 2, 5));
	geo.faces.push(new THREE.Face3(0, 2, 5));
	geo.faces.push(new THREE.Face3(0, 4, 3));
	geo.faces.push(new THREE.Face3(1, 4, 3));
	geo.faces.push(new THREE.Face3(1, 5, 3));
	geo.faces.push(new THREE.Face3(5, 0, 3));
	geo.computeFaceNormals();
	geo.computeVertexNormals();
	return geo;
}
function ItemDiamond1(w, h, d, c) {
	var me = this;

	var m = new THREE.MeshPhongMaterial({
			color : 0xff00ff,
			transparent : true,
			opacity : 0.9,
			reflectivity : 1,
			specular : 0x666666,
			// metal : true,
			shininess : 599,
			side : THREE.DoubleSide //BackSide //FrontSide
		});
	me.mesh = new THREE.Mesh(geometry1(), m);
	me.mesh.scale.set(10, 10, 10);
	me.addTo = function (d3mJS) {
		me.d3mJS = d3mJS;
		me.d3mJS.scene.add(me.mesh);
	};
	me.free = function () {
		//
	};
	me.move = function (x, y, z) {
		me.mesh.position.setX(x);
		me.mesh.position.setY(y);
		me.mesh.position.setZ(z);

	};
	return me;
}
function ItemDiamond2(w, h, d, c) {
	var me = this;
	var gm = new THREE.OctahedronGeometry(5, 0);
	//new THREE.BoxGeometry( 5, 5, 5 );
	//new THREE.PlaneGeometry( 4, 4, 1 );
	//var gm2 = new THREE.OctahedronGeometry(5, 0);
	var m = new THREE.MeshPhongMaterial({
			color : 0xff00ff,
			//ambient: 0x444444,
			//emissive : 0x0000ff
			transparent : true,
			opacity : 0.8,
			shininess : 30,
			specular : 0x555555,
			shading : THREE.FlatShading,
			//reflectivity : 10,
			//specular : 0x0000ff,shininess : 300,
			// metal : true,

			side : THREE.DoubleSide //THREE.DoubleSide //BackSide //FrontSide
		});
	/*var m2 = new THREE.MeshPhongMaterial({
	color : 0xff00ff,
	transparent : true,
	opacity : 0.1,
	reflectivity : 1,
	specular : 0x666666,
	// metal : true,
	shininess : 599,
	side : THREE.DoubleSide //THREE.DoubleSide //BackSide //FrontSide
	});*/
	me.mesh = new THREE.Mesh(gm, m);
	//me.mesh2 = new THREE.Mesh(gm2, m2);
	me.mesh.scale.set(1, 2, 1);
	//me.mesh2.scale.set(0.98, 1.8, 0.98);
	me.addTo = function (d3mJS) {
		me.d3mJS = d3mJS;
		me.d3mJS.scene.add(me.mesh);
		//me.d3mJS.scene.add(me.mesh2);

		/*
		var cubeMaterial = new THREE.MeshBasicMaterial({
		color : 0xffffff,
		vertexColors : THREE.VertexColors
		});

		var color,
		face,
		numberOfSides,
		vertexIndex;
		var faceIndices = ['a', 'b', 'c', 'd'];
		var size = 6;
		var point;
		var cubeGeometry = new THREE.CubeGeometry(size, size, size, 1, 1, 1);
		for (var i = 0; i < cubeGeometry.faces.length; i++) {
		face = cubeGeometry.faces[i];
		face.color=new THREE.Color(0x0000ff);;
		// determine if current face is a tri or a quad
		numberOfSides = (face instanceof THREE.Face3) ? 3 : 4;
		// assign color to each vertex of current face
		for (var j = 0; j < numberOfSides; j++) {
		//console.log(i+":"+j);
		vertexIndex = face[faceIndices[j]];
		// store coordinates of vertex
		point = cubeGeometry.vertices[vertexIndex];
		// initialize color variable
		color = new THREE.Color(0xffffff);
		//color.setRGB(0.5 + point.x / size, 0.5 + point.y / size, 0.5 + point.z / size);
		color.setRGB(j/numberOfSides,j/numberOfSides, j/numberOfSides);
		face.vertexColors[j] = color;
		}
		}
		cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
		cube.position.set(19, 5, 0);
		me.d3mJS.scene.add(cube);
		 */
	};
	me.free = function () {
		//
	};
	me.move = function (x, y, z) {
		me.mesh.position.setX(x);
		me.mesh.position.setY(y);
		me.mesh.position.setZ(z);
		/*
		me.mesh2.position.setX(x);
		me.mesh2.position.setY(y);
		me.mesh2.position.setZ(z);
		 */
	};

	return me;
}
function ItemConeField(r, h) {
	var me = this;
	me.h = h;
	me.r = r;
	me.vertices = [];
	me.faces = [];
	me.fillVertices = function (levelCount, r, h) {
		var v = new THREE.Vector3(0, h, 0);
		v.level = 0;
		v.cell = 0;
		me.vertices.push(v);
		for (var i = 0; i < levelCount; i++) {
			//console.log("level "+(i+1));
			var tr = (i + 1) * r / levelCount;
			var ty = h - (i + 1) * h / levelCount;
			var tc = 3 * (i + 1);
			for (var k = 0; k < tc; k++) {
				var ta = k * Math.PI * 2 / tc;
				var v = new THREE.Vector3(tr * Math.sin(ta), ty, tr * Math.cos(ta));
				v.level = i + 1;
				v.cell = k;
				//console.log(v);
				me.vertices.push(v);
				//console.log("	cell "+k);
			}
		}
	};
	me.index = function (level, cell) {
		var d = 0;
		if (level > 0) {
			var r = 1;
			for (var i = 0; i < level - 1; i++) {
				r = r + 3 * (i + 1);
			}
			if (cell < 3 * level) {
				d = cell;
			} else {
				d = cell - 3 * level;
			}
			d = r + d;
		}
		return d;
	};
	me.fillFaces = function (levelCount) {
		for (var s = 0; s < 3; s++) {
			for (var i = 1; i < levelCount + 1; i++) {
				for (var k = 0; k < i; k++) {
					var x = i * s + k;
					var face0 = new THREE.Face3(me.index(i - 1, (i - 1) * s + k) //
						, me.index(i, x) //
						, me.index(i, x + 1));
					me.faces.push(face0);
					if (k < i - 1) {
						var face1 = new THREE.Face3(me.index(i - 1, (i - 1) * s + k) //
							, me.index(i - 1, (i - 1) * s + k + 1) //
							, me.index(i, x + 1));
						me.faces.push(face1);
					}
				}
			}
		}
	};
	//var tx=THREE.ImageUtils.loadTexture('images/xsshop.jpg');
	//console.log(tx);
	me.material = new THREE.MeshPhongMaterial({
			color : 0x006600,
			shininess : 30 * 30,
			specular : 0x333333,
			shading : THREE.FlatShading,
			//metal:true,
			//map : THREE.ImageUtils.loadTexture('images/xsshop.jpg'),
			transparent : true,
			opacity : 0.95,
			side : THREE.DoubleSide
		});
	me.addTo = function (d3mJS) {
		me.d3mJS = d3mJS;
		me.d3mJS.scene.add(me.mesh);

	}
	me.move = function (x, y, z) {
		me.mesh.position.setX(x);
		me.mesh.position.setY(y);
		me.mesh.position.setZ(z);
	};
	me.levels = 5;
	me.fillVertices(me.levels, me.r, me.h);
	me.fillFaces(me.levels);
	var geometry = new THREE.Geometry();
	for (var i = 0; i < me.vertices.length; i++) {
		geometry.vertices.push(me.vertices[i]);
	}
	for (var i = 0; i < me.faces.length; i++) {
		geometry.faces.push(me.faces[i]);
	}
	geometry.computeFaceNormals();
	//geometry.computeTangents();
	//geometry = new THREE.SphereGeometry(r, 20, 20);
	me.mesh = new THREE.Mesh(geometry, me.material);
	return me;
}

function ItemDiamond3(w, h, d, c) {
	var me = this;
	me.material = new THREE.MeshPhongMaterial({
			color : 0xff00ff,
			shininess : 30 * 30.1,
			specular : 0xff00ff,
			//ambient: 0x444444,
			//emissive : 0xff00ff,
			transparent : true,
			opacity : 0.8,
			side : THREE.DoubleSide
		});
	me.face = function (v1, v2, v3) {
		var geometry = new THREE.Geometry();
		geometry.vertices.push(v1);
		geometry.vertices.push(v2);
		geometry.vertices.push(v3);
		geometry.faces.push(new THREE.Face3(0, 1, 2));
		geometry.computeFaceNormals();
		var mesh = new THREE.Mesh(geometry, me.material);
		return mesh;
	};
	me.addTo = function (d3mJS) {
		me.d3mJS = d3mJS;
		me.mesh = new THREE.Object3D();
		me.mesh.add(me.face(new THREE.Vector3(0, 5, 0), new THREE.Vector3(3, 0, 0), new THREE.Vector3(-2, 0, 3)));
		me.mesh.add(me.face(new THREE.Vector3(0, 5, 0), new THREE.Vector3(3, 0, 0), new THREE.Vector3(-2, 0, -3)));
		me.mesh.add(me.face(new THREE.Vector3(0, 5, 0), new THREE.Vector3(-2, 0, 3), new THREE.Vector3(-2, 0, -3)));
		me.mesh.add(me.face(new THREE.Vector3(0, -5, 0), new THREE.Vector3(3, 0, 0), new THREE.Vector3(-2, 0, 3)));
		me.mesh.add(me.face(new THREE.Vector3(0, -5, 0), new THREE.Vector3(3, 0, 0), new THREE.Vector3(-2, 0, -3)));
		me.mesh.add(me.face(new THREE.Vector3(0, -5, 0), new THREE.Vector3(-2, 0, 3), new THREE.Vector3(-2, 0, -3)));
		me.d3mJS.scene.add(me.mesh);
	}
	me.move = function (x, y, z) {
		me.mesh.position.setX(x);
		me.mesh.position.setY(y);
		me.mesh.position.setZ(z);
	};
	return me;
}
var gradientCanvas = null;
function laserBodyCanvas() {
	if (gradientCanvas == null) {
		gradientCanvas = document.createElement('canvas');
		var context = gradientCanvas.getContext('2d');
		gradientCanvas.width = 64;
		gradientCanvas.height = 1;
		var gradient = context.createLinearGradient(0, 0, gradientCanvas.width, gradientCanvas.height);
		gradient.addColorStop(0, 'rgba(  255,255,255,0.0)');
		gradient.addColorStop(0.4, 'rgba(255,255,255,0.5)');
		gradient.addColorStop(0.5, 'rgba(255,255,255,0.99)');
		gradient.addColorStop(0.6, 'rgba(255,255,255,0.5)');
		gradient.addColorStop(1.0, 'rgba( 255,255,255,0.0)');
		context.fillStyle = gradient;
		context.fillRect(0, 0, gradientCanvas.width, gradientCanvas.height);
	}
	return gradientCanvas;
}
var _textureLaser = new THREE.Texture(laserBodyCanvas());
_textureLaser.needsUpdate = true;
var _materialLaser = new THREE.MeshBasicMaterial({
		map : _textureLaser,
		blending : THREE.AdditiveBlending,
		color : 0xff6666,
		//color : 0xff4444,
		//color : 0xaa4444,
		side : THREE.DoubleSide,
		depthWrite : false,
		transparent : true
	});
function ItemLaserRay(r, c) {
	var me = this;
	me.color = c;
	me.object3d = new THREE.Object3D();
	me.texture = new THREE.Texture(laserBodyCanvas());
	me.texture.needsUpdate = true;
	me.radius = r; //0.2;
	//me.material = materialLaser;
	var xColor = 0x666666 | me.color;
	//console.log(xColor.toString(16));
	var textureLaser = new THREE.Texture(laserBodyCanvas());
	textureLaser.needsUpdate = true;
	me.material = new THREE.MeshBasicMaterial({
			map : textureLaser,
			blending : THREE.AdditiveBlending,
			color : xColor,
			//color : 0xff4444,
			//color : 0xaa4444,
			side : THREE.DoubleSide,
			depthWrite : false,
			transparent : true
		});
	me.counter = 0;
	me.addTo = function (d3mJS, group) {
		var g = d3mJS.mainGroup;
		if (group) {
			g = group;
		}
		me.d3mJS = d3mJS;
		me.d3mJS.addTicker(me);
		//me.attachedTo = me.d3mJS.scene;
		me.attachedTo = g; //me.d3mJS.mainGroup;
		//me.d3mJS.scene.add(me.object3d);
		return me;
	};

	me.attachTo = function (object3D, d3mJS) {
		me.d3mJS = d3mJS;
		me.d3mJS.addTicker(me);
		me.attachedTo = object3D;
		//console.log(me.attachedTo);
		return me;
	};
	me.detach = function () {
		me.attachedTo.remove(me.object3d);
		me.d3mJS.dropTicker(me);
		return me;
	};
	me.planeGeometry1 = null;
	me.planeGeometry2 = null;
	//me.planeGeometry3 = null;
	me.planeMesh1 = null;
	me.planeMesh2 = null;
	//me.planeMesh3 = null;
	me.from = new THREE.Vector3(0, 0, 0);
	me.to = new THREE.Vector3(1, 1, 1);
	me.align = function (vFrom, vTo) {
		//console.log("align");
		//console.log(vFrom);
		//console.log(vTo);
		me.from = vFrom;
		me.to = vTo;
		for (var i = 0; i < me.object3d.children.length; i++) {
			me.object3d.children[0].geometry.dispose();
			me.object3d.remove(me.object3d.children[0]);
		}
		//var nPlanes = 3;
		var distance = vFrom.distanceTo(vTo);
		var orientation = new THREE.Matrix4();
		var offsetRotation = new THREE.Matrix4();
		orientation.lookAt(vFrom, vTo, new THREE.Vector3(0, 3, 0));
		offsetRotation.makeRotationX(Math.PI * 0.5);
		orientation.multiply(offsetRotation);
		var position = vTo.clone().add(vFrom).divideScalar(2);
		me.object3d.position.x = position.x;
		me.object3d.position.y = position.y;
		me.object3d.position.z = position.z;
		//1
		var rotationY = new THREE.Matrix4();
		rotationY.makeRotationY(0 / 3 * Math.PI);
		me.planeGeometry1 = new THREE.PlaneGeometry(me.radius, distance);
		me.planeGeometry1.applyMatrix(rotationY);
		me.planeGeometry1.matrixAutoUpdate = false;
		me.planeGeometry1.applyMatrix(orientation);
		me.planeMesh1 = new THREE.Mesh(me.planeGeometry1, me.material);
		me.object3d.add(me.planeMesh1);
		//2
		rotationY = new THREE.Matrix4();
		rotationY.makeRotationY(1 / 3 * Math.PI);
		me.planeGeometry2 = new THREE.PlaneGeometry(me.radius, distance);
		me.planeGeometry2.applyMatrix(rotationY);
		me.planeGeometry2.matrixAutoUpdate = false;
		me.planeGeometry2.applyMatrix(orientation);
		me.planeMesh2 = new THREE.Mesh(me.planeGeometry2, me.material);
		me.object3d.add(me.planeMesh2);
		//3
		/*
		rotationY = new THREE.Matrix4();
		rotationY.makeRotationY(2 / 3 * Math.PI);
		me.planeGeometry3 = new THREE.PlaneGeometry(me.radius, distance);
		me.planeGeometry3.applyMatrix(rotationY);
		me.planeGeometry3.matrixAutoUpdate = false;
		me.planeGeometry3.applyMatrix(orientation);
		me.planeMesh3 = new THREE.Mesh(me.planeGeometry3, me.material);
		me.object3d.add(me.planeMesh3);
		 */
		/*for (var i = 0; i < nPlanes; i++) {
		var rotationY = new THREE.Matrix4();
		rotationY.makeRotationY(i / nPlanes * Math.PI);
		var geometry = new THREE.PlaneGeometry(me.radius, distance);
		geometry.applyMatrix(rotationY);
		geometry.matrixAutoUpdate = false;
		geometry.applyMatrix(orientation);
		var mesh = new THREE.Mesh(geometry, me.material);
		me.object3d.add(mesh);
		}*/
		//me.d3mJS.scene.add(me.object3d);
		//console.log(me.attachedTo);
		me.attachedTo.add(me.object3d);
		return me;
	};
	me.spin = function (r) {
		//var s=0.01;
		var axis = new THREE.Vector3(me.to.x - me.from.x, me.to.y - me.from.y, me.to.z - me.from.z);

		var spinMatrix = new THREE.Matrix4();
		spinMatrix.makeRotationAxis(axis.normalize(), 0.5);
		//1
		me.planeMesh1.matrix.multiply(spinMatrix);
		me.planeMesh1.rotation.setFromRotationMatrix(me.planeMesh1.matrix);
		//2
		//spinMatrix = new THREE.Matrix4();
		//spinMatrix.makeRotationAxis(axis.normalize(), s+0 / 3 * Math.PI);
		me.planeMesh2.matrix.multiply(spinMatrix);
		me.planeMesh2.rotation.setFromRotationMatrix(me.planeMesh2.matrix);
		//3
		//me.planeMesh3.matrix.multiply(spinMatrix);
		//me.planeMesh3.rotation.setFromRotationMatrix(me.planeMesh3.matrix);

		//var rotationY = new THREE.Matrix4();
		//rotationY.makeRotationY(Math.PI * 0.01);
		//me.planeGeometry1.matrixAutoUpdate = true;
		//me.planeGeometry1.applyMatrix(rotationY);
		//me.planeMesh1.updateMatrix();
		//me.planeGeometry1.verticesNeedUpdate = true;
		//console.log(r);
		//me.planeMesh1.rotation.x=r/10;
		return me;
	};
	me.tick = function () {
		me.counter++;
		me.spin(me.counter);
		//console.log(me.counter);
		//me.sprite.scale.set(1, 1, 1).multiplyScalar(me.size + 0.2 * me.size * Math.sin(me.seed * me.counter));
		return me;
	};
	return me;
}
function ItemCane(r, c) {
	var me = this;
	me.baseHeight = r;
	me.geometryTube = new THREE.CylinderGeometry(0.5 * r, 0.5 * r, 1, 16, false);
	me.geometryFrom = new THREE.SphereGeometry(0.5 * r, 16, 16);
	me.material = new THREE.MeshPhongMaterial({
			color : c,
			side : THREE.DoubleSide
		});
	me.meshTube = new THREE.Mesh(me.geometryTube, me.material);
	me.meshFrom = new THREE.Mesh(me.geometryFrom, me.material);
	me.addTo = function (d3mJS) {
		me.d3mJS = d3mJS;
		me.d3mJS.scene.add(me.meshTube);
		me.d3mJS.scene.add(me.meshFrom);
	};
	me.free = function () {
		//
	};
	me.align = function (from, to) {
		var direction = new THREE.Vector3().subVectors(to, from);
		me.meshTube.scale.set(1, 1, 1);
		me.meshTube.rotation.set(0, 0, 0);
		me.meshTube.updateMatrix();
		var orientation = new THREE.Matrix4();
		orientation.lookAt(from, to, new THREE.Object3D().up);
		orientation.multiply(new THREE.Matrix4(//
				+1, +0, +0, +0,
				+0, +0, +1, +0,
				+0, -1, +0, +0,
				+0, +0, +0, +1 //
			));
		me.meshTube.applyMatrix(orientation);
		me.meshTube.scale.y = direction.length() / me.baseHeight;
		me.meshTube.position.x = (to.x + from.x) / 2;
		me.meshTube.position.y = (to.y + from.y) / 2;
		me.meshTube.position.z = (to.z + from.z) / 2;
		me.meshTube.updateMatrix();
		me.meshFrom.position.setX(from.x);
		me.meshFrom.position.setY(from.y);
		me.meshFrom.position.setZ(from.z);
	};
	return me;
}
function D3mJS() {
	var me = this;
	//me.threeTextureLoader = new THREE.TextureLoader();
	me.isBlur = false;
	me.isFreeze = false;
	me.isClick = false;
	me.cameraStartX = 0;
	me.cameraStartY = 0;
	me.cameraStartZ = 0;
	me.moveRatio = 0.05;
	me.zoomRatio = 0.1;
	me.minX = -10;
	me.maxX = +10;
	me.minY = +5;
	me.maxY = +70;
	me.minZ = -11;
	me.maxZ = +17;
	me.minRX = -1.3;
	me.maxRX = -0.9;
	me.delay = 1000.0 / 25.0;
	me.targetList = [];
	me.knobs = [];
	me.mirrors = [];
	me._tickers = [];
	//me.cameraControls = null;
	me.clock = new THREE.Clock();
	me.STATE = {
		COLD : 0,
		WATCH : 1
	};
	me.currentState = me.STATE.COLD;
	//me.canMove=false;
	//me.canZoom=false;
	//me.canRotate=false;
	/*
	me.MODE = {
	LOCK : -1,
	MOVE : 0,
	ROTATE : 1,
	ZOOM : 2,
	COMBO1 : 3,
	COMBO2 : 4
	};
	me.currentMode = me.MODE.COMBO2;
	 */
	me.animationModes = {
		BLUR : 0,
		FREEZE : 1,
		GO : 2
	};
	me.animationMode = me.animationModes.GO;
	me.tapSize = 0;
	me.scene = null;
	me.camera = null;
	me.canvas = null;
	me.pointStartX = 0;
	me.pointStartY = 0;

	me.onresize = function () {
		//console.log("D3mJS onresize");
		me.renderer.setSize(window.innerWidth, window.innerHeight);
		//me.rendererCSS.setSize(window.innerWidth, window.innerHeight);
		me.camera.aspect = window.innerWidth / window.innerHeight;
		me.camera.updateProjectionMatrix();
	};
	me.onfocus = function () {
		//console.log("D3mJS onfocus");
		me.isBlur = false;
	};
	me.onblur = function () {
		//console.log("D3mJS onblur");
	};
	me.onbeforeunload = function () {
		//console.log("D3mJS onbeforeunload");
	};
	me.tick = function () {
		//console.log("D3mJS tick");
		for (var i = 0; i < me._tickers.length; i++) {
			me._tickers[i].tick();
		}
		//me.threeTtrackballControls.update();
	};
	me.dropTicker = function (t) {
		//console.log("dropTicker of "+me._tickers.length);
		for (var i = 0; i < me._tickers.length; i++) {
			//console.log("check "+me._tickers[i]);
			//var t=me._tickers[i];
			if (me._tickers[i] == t) {
				//console.log("dropTicker "+i);
				me._tickers.splice(i, 1);
				//console.log("start "+me._tickers.length);
				//me._tickers.splice(0, me._tickers.length);
				//console.log("end "+me._tickers.length);
				break;
			}
		}
	};
	me.addTicker = function (t) {
		//console.log("addTicker of "+me._tickers.length);
		me._tickers.push(t);
	};
	var first = true;
	me.render = function () {
		var delta = me.clock.getDelta();
		//me.threeTtrackballControls.update();//delta);
		//me.cameraControls.update(delta);
		//me.controls.update( delta );
		if (me.animationMode == me.animationModes.GO) {
			me.tick();
			//me.rendererCSS.render(me.sceneCSS, me.camera);
			for (var i = 0; i < me.mirrors.length; i++) {
				me.mirrors[i].groundMirror.material.uniforms.mirrorSampler.value = null;
				me.mirrors[i].groundMirror.render();
				me.mirrors[i].groundMirror.material.uniforms.mirrorSampler.value = me.mirrors[i].groundMirror.texture;
			}
			me.renderer.render(me.scene, me.camera);
			/*
			renderer.clear();
			renderer.render( scene, camera );
			renderer.clearDepth();
			renderer.render( sceneOrtho, cameraOrtho );
			 */
			if (first) {
				//console.log(me.camera);
				//console.log(me.scene);
			}
			first = false;
			me.onRender();
			setTimeout(function () {
				//requestAnimationFrame(me.render);
				me.render();
			}, me.delay);

		}
	};
	me.onRender = function () {
		//var ms=new Date().getTime();
		//console.log(ms);
	};
	me.addListeners = function () {
		window.addEventListener('resize', me.onresize, false);
		window.onfocus = me.onfocus;
		window.onblur = me.onblur;
		window.onbeforeunload = me.onbeforeunload;

		me.canvas.addEventListener('webglcontextlost', function () {
			console.log("webglcontextlost");
		}, false);

		me.canvas.addEventListener('webglcontextrestored', function () {
			console.log("webglcontextrestored");
		}, false);

		me.canvas.onmousewheel = function (mouseEvent) {
			mouseEvent.preventDefault();
		}
		me.canvas.onclick = function (mouseEvent) {
			mouseEvent.preventDefault();
		}
		me.canvas.onmousedown = function (mouseEvent) {
			me.isClick = true;
			me.currentState = me.STATE.WATCH;
			me.pointStartX = mouseEvent.clientX;
			me.pointStartY = mouseEvent.clientY;
			me.cameraStartX = me.camera.position.x;
			me.cameraStartY = me.camera.position.y;
			me.cameraStartZ = me.camera.position.z;
			mouseEvent.preventDefault();
			me.dab();
			me.lockOrbitForTarget();
		};
		me.canvas.onmousemove = function (mouseEvent) {
			if (me.currentState == me.STATE.WATCH) {
				me.checkTap(mouseEvent.clientX, mouseEvent.clientY);
				me.drag(mouseEvent.clientX, mouseEvent.clientY);
			}
			mouseEvent.preventDefault();
		};
		me.canvas.onmouseup = function (mouseEvent) {
			me.currentState = me.STATE.COLD;
			if (me.isClick) {
				me.tap();
			}
			mouseEvent.preventDefault();
			me.unLockOrbitForTarget();
		};
		me.canvas.ontouchstart = function (touchEvent) {
			//console.log('touches len',touchEvent.touches.length);
			if (touchEvent.touches.length < 2) {
				me.isClick = true;
				me.currentState = me.STATE.WATCH;
				me.pointStartX = touchEvent.touches[0].pageX;
				me.pointStartY = touchEvent.touches[0].pageY;
				me.cameraStartX = me.camera.position.x;
				me.cameraStartY = me.camera.position.y;
				me.cameraStartZ = me.camera.position.z;
				touchEvent.preventDefault();
				me.dab();
				me.lockOrbitForTarget();
			} else {
				me.currentState = me.STATE.COLD;
				me.isClick = false;
				me.unLockOrbitForTarget();
			}
		};
		me.canvas.ontouchmove = function (touchEvent) {
			if (me.currentState == me.STATE.WATCH) {
				me.checkTap(touchEvent.touches[0].pageX, touchEvent.touches[0].pageY);
				me.drag(touchEvent.touches[0].pageX, touchEvent.touches[0].pageY);
			}
			/*if (touchEvent.touches.length >1) {
			me.unLockOrbitForTarget();
			}*/
			touchEvent.preventDefault();
		};
		me.canvas.ontouchend = function (touchEvent) {
			me.currentState = me.STATE.COLD;
			if (touchEvent.touches.length < 2) {
				if (me.isClick) {
					me.tap();
				}
			}
			touchEvent.preventDefault();
			me.unLockOrbitForTarget();
		};
		me.clock.start();
		//me.cameraControls = new THREE.TrackballControls(me.camera, me.canvas);
	};
	me.checkTap = function (x, y) {
		if (me.isClick) {
			var deltaX = Math.abs(me.pointStartX - x);
			var deltaY = Math.abs(me.pointStartY - y);
			//console.log(deltaX+" x "+deltaY);
			if (deltaX > me.tapSize * 0.1 + 1 || deltaY > me.tapSize * 0.1 + 1) {
				me.isClick = false;
				//console.log("me.isClick = false;");
			}
		}
	};
	me.dab = function () {};
	me.drag = function (x, y) {
		/*var target=me.findClickTarget();
		if(target){
		//target.object.drag(x,y);
		//console.log(target,'drag',x,y,'from',me.pointStartX,me.pointStartY);
		var knob=me.findKnobByTarget(target);
		if(knob){
		knob.drag(x,y);
		}
		}*/
		if (me.lockedTarget) {
			var knob = me.findKnobByTarget(me.lockedTarget);
			if (knob) {
				knob.drag(x, y);
			}
		}
	};
	me.unLockOrbitForTarget = function () {
		//console.log('unlock');
		me.uiControls.enabled = true;
		me.lockedTarget = null;
	};
	me.findClickTarget = function () {
		me.vector2.x = (me.pointStartX / window.innerWidth) * 2 - 1;
		me.vector2.y =  - (me.pointStartY / window.innerHeight) * 2 + 1;
		me.raycaster.setFromCamera(me.vector2, me.camera);
		var intersects = me.raycaster.intersectObjects(me.targetList, false);
		if (intersects.length > 0) {
			//console.log(intersects[0]);
			return intersects[0];
		} else {
			return null;
		}
	};
	me.lockOrbitForTarget = function () {
		me.lockedTarget = me.findClickTarget();
		if (me.lockedTarget) {
			me.uiControls.enabled = false;
			var knob = me.findKnobByTarget(me.lockedTarget);
			if (knob) {
				knob.lock();
			}
		}
		/*
		me.vector2.x  = (me.pointStartX / window.innerWidth) * 2 - 1;
		me.vector2.y =  - (me.pointStartY / window.innerHeight) * 2 + 1;
		me.raycaster.setFromCamera( me.vector2, me.camera );
		var intersects = me.raycaster.intersectObjects( me.targetList, false );
		if (intersects.length > 0) {
		//console.log('lock');
		me.uiControls.enabled=false;
		}*/
	};
	me.findKnobByTarget = function (target) {
		var cube = target.object;
		for (var i = 0; i < me.knobs.length; i++) {
			//console.log(me.knobs[i].cube);
			if (me.knobs[i].cube == cube) {
				//me.knobs[i].tap();
				//break;
				return me.knobs[i];
			}
		}
		return null;
	};
	me.tap = function () {
		//console.log("tap " + me.pointStartX + " / " + me.pointStartY);

		var t = me.findClickTarget();
		if (t) {
			/*var cube = t.object;
			for (var i = 0; i < me.knobs.length; i++) {
			//console.log(me.knobs[i].cube);
			if (me.knobs[i].cube == cube) {
			me.knobs[i].tap();
			break;
			}
			}*/
			var knob = me.findKnobByTarget(t);
			if (knob) {
				//console.log(t.point);
				knob.tap(t.point);
			}
		}

		//var raycaster = new THREE.Raycaster(); // create once
		//var mouse = new THREE.Vector2(); // create once
		//mouse.x = ( event.clientX / renderer.domElement.width ) * 2 - 1;
		//mouse.y = - ( event.clientY / renderer.domElement.height ) * 2 + 1;
		/*
		me.vector2.x  = (me.pointStartX / window.innerWidth) * 2 - 1;
		me.vector2.y =  - (me.pointStartY / window.innerHeight) * 2 + 1;
		me.raycaster.setFromCamera( me.vector2, me.camera );
		var intersects = me.raycaster.intersectObjects( me.targetList, false );
		 */
		/*
		var xx = (me.pointStartX / window.innerWidth) * 2 - 1;
		var yy =  - (me.pointStartY / window.innerHeight) * 2 + 1;
		var vector = new THREE.Vector3(xx, yy, 1);
		var projector = new THREE.Projector();
		projector.unprojectVector(vector, me.camera);
		var ray = new THREE.Raycaster(me.camera.position, vector.sub(me.camera.position).normalize());
		 */
		//console.log(new THREE.Raycaster());
		//console.log(ray);
		//var intersects = ray.intersectObjects(me.targetList, false);
		//console.log("intersects.length "+intersects.length);
		//console.log("me.knobs.length "+me.knobs.length);
		/*
		if (intersects.length > 0) {
		var cube = intersects[0].object;
		//console.log(cube);
		for (var i = 0; i < me.knobs.length; i++) {
		//console.log(me.knobs[i].cube);
		if (me.knobs[i].cube == cube) {
		me.knobs[i].tap();
		break;
		}
		}
		//console.log(intersects[0].object);
		//console.log(intersects[0]);
		}
		 */
	};

	me.___move = function (x, y) {

		var deltaX = me.pointStartX - x;
		var deltaY = me.pointStartY - y;
		var newX = me.cameraStartX + me.moveRatio * deltaX;
		var newZ = me.cameraStartZ + me.moveRatio * deltaY;
		me.camera.position.setX(newX);
		me.camera.position.setZ(newZ);
		// console.log(me.camera.position.z);
		// alert(newX+"/"+me.cameraStartX +"/"+ me.moveRatio +"/"+
		// me.pointStartX +"/"+ x)
		me.checkTap(x, y);

	};
	me.___zoom = function (x, y) {
		var deltaX = me.pointStartX - x;
		var zoom = deltaX;
		var newY = me.cameraStartY + me.zoomRatio * zoom;
		me.camera.position.setY(newY);
		me.checkTap(x, y);
	};
	me.___rotate = function (x, y) {
		var deltaY = me.pointStartY - y;
		me.camera.rotation.x = me.camera.rotation.x - deltaY * 0.0001;
		me.checkTap(x, y);
	}
	this.fog = function () {
		me.scene.fog = new THREE.Fog(0xffffff, 0.015, 100);
	};
	me.initLight = function () {
		var spotLight =
			//new THREE.SpotLight(0xffffff);
			//new THREE.DirectionalLight( 0xffffff, 0.75 );
			new THREE.PointLight(0xffffff, 1, 100);
		spotLight.position.set(20, 40, 20);
		spotLight.castShadow = true;
		me.scene.add(spotLight);
		var sparkle = new ItemSparkle(30, 0.5, 0xffffff);
		sparkle.addTo(me);
		sparkle.move(spotLight.position.x, spotLight.position.y, spotLight.position.z);
		/*
		var spotLight2 =new THREE.PointLight(0xffffff, 1, 100);
		spotLight2.position.set(-20, 10, -40);
		spotLight2.castShadow = true;
		me.scene.add(spotLight2);
		sparkle2 = new ItemSparkle(30, 0.5, 0xffffff);
		sparkle2.addTo(me);
		sparkle2.move(spotLight2.position.x, spotLight2.position.y, spotLight2.position.z);

		var spotLight3 = new THREE.PointLight(0xffffff, 1, 100);
		spotLight3.position.set(-20, 10, 40);
		me.scene.add(spotLight3);
		var sparkle3 = new ItemSparkle(30, 0.5, 0xffffff);
		sparkle3.addTo(me);
		sparkle3.move(spotLight3.position.x, spotLight3.position.y, spotLight3.position.z);
		 */
	};
	me.init = function () {
		console.log("D3mJS init");

		//console.log(me.selectedFont);
		me.raycaster = new THREE.Raycaster(); // create once
		me.vector2 = new THREE.Vector2(); // create once
		var pixelRatio = window.devicePixelRatio;
		me.tapSize = 40 * pixelRatio;
		if (isNaN(me.tapSize)) {
			me.tapSize = 51;
			console.log("force tapSize to " + me.tapSize);
		}
		console.log("tapSize is " + me.tapSize);
		me.lockedTarget = null;
		me.scene = new THREE.Scene();
		me.sceneCSS = new THREE.Scene();
		//me.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
		//me.camera.lookAt(new THREE.Vector3(0,0,0));
		//me.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
		me.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
		me.camera.position.x = 20;
		me.camera.position.y = 50;
		me.camera.position.z = 70;

		me.camera.lookAt(new THREE.Vector3(0, 0, 0));

		//var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		//directionalLight.position.set(5, 15, 10);
		//me.scene.add(directionalLight);


		//var light = new THREE.AmbientLight(0x404040); // soft white light
		//me.scene.add(light);
		//me.initLight();
		me.canvas = document.getElementById("d3mJS");
		/*
		me.renderer = new THREE.CSS3DRenderer({
		antialias : true,
		canvas : me.canvas,
		alpha : true
		});
		 */

		me.renderer = new THREE.WebGLRenderer({
				antialias : true //
			,
				canvas : me.canvas //
				//,alpha : true
			});
		me.renderer.setPixelRatio(2);
		console.log(me.renderer);
		/*
		//http://stemkoski.github.io/Three.js/
		me.rendererCSS = new THREE.CSS3DRenderer();

		//me.rendererCSS.setSize( 200, 200 );
		me.rendererCSS.domElement.style.position = 'absolute';
		me.rendererCSS.domElement.style.top = 0;
		me.rendererCSS.domElement.style.margin = 0;
		me.rendererCSS.domElement.style.padding = 0;
		document.body.appendChild(me.rendererCSS.domElement);
		me.renderer.domElement.style.position = 'absolute';
		me.renderer.domElement.style.top = 0;
		// make sure original renderer appears on top of CSS renderer
		me.renderer.domElement.style.zIndex = 1;
		me.rendererCSS.domElement.appendChild(me.canvas);
		 */
		//me.renderer.setSize(window.innerWidth, window.innerHeight);
		me.renderer.setClearColor(0x000022, 1);
		//renderer.gammaInput = true;
		//renderer.gammaOutput = true;
		me.mainGroup = new THREE.Group();
		me.scene.add(me.mainGroup);
		me.uiControls = new THREE.XOrbitControls(me.camera, me.renderer.domElement);

		//me.threeTtrackballControls = new THREE.TrackballControls(me.camera, me.renderer.domElement);
		//var cameraControl=new CameraControl();
		//cameraControl.addTo(this);
		/*
		me.threeTtrackballControls = new THREE.TrackballControls( me.camera );
		me.threeTtrackballControls.rotateSpeed = 1.0;
		me.threeTtrackballControls.zoomSpeed = 1.2;
		me.threeTtrackballControls.panSpeed = 0.8;
		me.threeTtrackballControls.noZoom = false;
		me.threeTtrackballControls.noPan = false;
		me.threeTtrackballControls.staticMoving = true;
		me.threeTtrackballControls.dynamicDampingFactor = 0.3;
		//me.threeTtrackballControls.keys = [ 65, 83, 68 ];
		me.threeTtrackballControls.addEventListener( 'change', me.render );

		me.threeTtrackballControls.handleResize();*/
		/*
		var myTargetObject = new THREE.Object3D();

		// In this example, mousePos never changes, but in reality,
		// you'd set the axes of this vector to your mouse position.
		var mousePos = new THREE.Vector2();

		// Also just for this example, this delta-time value is fixed.
		// In reality you should use a real dt value.
		var dt = 0.016;

		// Create the controls, using `myTargetObject` as the object to control.
		me.controls = new THREE.ObjectControls( {
		mousePos: mousePos,
		targetObject: me.camera,
		positionalAcceleration: new THREE.Vector3( 3, 10, 10 ),
		positionalDeceleration: new THREE.Vector3( 0.8, 0.8, 0.99 ),
		maxPositionalVelocity: new THREE.Vector3( 100, 100, 100 )
		} );
		document.addEventListener( 'mousemove', me.onMouseMove, false );
		//document.addEventListener( 'keydown', onKeyDown, false );
		//document.addEventListener( 'keyup', onKeyUp, false );
		me.onMouseMove=function ( e ) {
		console.log('e',e);
		var x = e.pageX - (window.innerWidth/2),
		y = e.pageY - (window.innerHeight/2),
		threshold = 10;
		if( (x > 0 && x < threshold) || (x < 0 && x > -threshold) ) {
		x = 0;
		}
		if( (y > 0 && y < threshold) || (y < 0 && y > -threshold) ) {
		y = 0;
		}
		mousePos.set( x, y );
		}
		console.log(me.controls);
		 */

		me.addListeners();
		me.onresize();
		me.render();
		//me.animate();
	};
	/*me.animate=function(){
	me.threeTtrackballControls.update();
	setTimeout(function () {
	//requestAnimationFrame(me.render);
	me.animate();
	}, 100);
	//requestAnimationFrame( function(){me.animate();} );
	};*/
	return me;
}
function CameraControl() {
	var me = this;
	me.addTo = function (d3mJS) {
		//console.log('CameraControl',d3mJS);
		me.d3mJS = d3mJS;
	};
	return me;
}
