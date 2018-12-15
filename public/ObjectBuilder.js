function ObjectBuilder(_objectData,_scene){
	var scene = _scene;
	var objectData = _objectData;
	var meshManifest = []; // all meshes are added to this array
	var Types = {
		PLANE: 0,
		BOX: 1,
		SPHERE: 2
	}
	for(var i = 0; i < objectData.parts.length; i++){
		addObjectPart(objectData.parts[i]);
	}
	this.getTypes = function(){
		return Types;
	}
	function addObjectPart(part){
		var addedPart = {};
		switch(part.type){
			case Types.PLANE:{
				addedPart = createPlane(part);
				break;
			}
			case Types.BOX:{
				addedPart = createBox(part);
				break;
			}
			case Types.SPHERE:{
				addedPart = createSphere(part);
				break;
			}
		}
		meshManifest.push(addedPart);
	}
	function isColor(t){
		return t.substr(0,2) == "0x";
	}
	function createPlane(part){
		console.log(part);
		var o = objectData;
		var p = part;
		var geometry = new THREE.PlaneGeometry(p.size.width, p.size.height, 32);
        var material = !isColor(p.texture) ? new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true}) : new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, color: Number(p.texture)});                // materials.push(material)
        var plane = new THREE.Mesh(geometry, material);
        plane.name = 'road';
        var processedPosition = processPosition(part);
        plane.position.set(processedPosition.x, o.position.y + p.position.y, processedPosition.z);
        plane.rotation.x = p.rotation.x * (Math.PI / 180);
        plane.rotation.y = (o.rotation.y + p.rotation.y) * (Math.PI / 180);
        plane.rotation.z = p.rotation.z * (Math.PI / 180);
        // plane.name = name;
        scene.add(plane);
        if(!isColor(p.texture)){
        	material.map = new THREE.TextureLoader().load(p.texture);
        }
        return plane;
	}
	function createBox(part){
		return {};
	}
	function createSphere(part){
		return {};
	}
	function processPosition(part){
		// var dist = v4v.distance(objectData.position.x, objectData.position.z, part.position.x, part.position.z);
		// var angle = v4v.angle(objectData.position.x, objectData.position.z, part.position.x, part.position.z);
		// var _x = v4v.orbit(objectData.position.x, angle + part.rotation.y, dist, 'cos');
		// var _z = v4v.orbit(objectData.position.z, angle + part.rotation.y, dist, 'sin');
		// return {x: _x, z: _z};
		return {x: part.position.x, z: part.position.z};
	}
	function destroy(){
		// itterate through meshManifest and remove everything
		for(var i = meshManifest.length-1;i>=0;i--){
			meshManifest[i].remove();
		}
	}
}