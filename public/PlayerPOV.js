function PlayerPOV(_propIDMatrix){
    var propIDMatrix = _propIDMatrix;
    var containerElement = document.getElementById('dcontent');
    var _width = containerElement.getBoundingClientRect().width;
    var _height = containerElement.getBoundingClientRect().height;
    var renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.shadowMap.enabled = true;
    // self.$data.renderer = new self.$data.THREE.WebGLRenderer()
    renderer.setSize(_width, _height);
    containerElement.appendChild(renderer.domElement);
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, _width / _height, 1, 1000);
    // var target = new THREE.Vector3(0, 0, 0);
    // var blankMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });




    var loadedObject;
    // var loader = new THREE.ObjectLoader();
    // var light = new THREE.DirectionalLight(0xffffff, 1);
    // var activeQuestion = -1;
    // light.position.set(4, 0, 4);
    // scene.add(light);

    
    var activeQuestion = -1;
    // light.position.set(4, 0, 4);
    // var light = new THREE.AmbientLight(0xffffff);
    // scene.add(light);

    var testParams = {
        position:{x:0,y:0,z:0},
        rotation:{x:0,y:0,z:0},
        parts:[
            // {type:0,position:{x:0,y:0,z:0},rotation:{x:0,y:0,z:0},size:{width:300,height:300},texture:'0xcc0000'},
            // {type:0,position:{x:150,y:0,z:0},rotation:{x:0,y:90,z:0},size:{width:300,height:300},texture:'0x0000cc'}
        ]
    };
    var testOjbect = new ObjectBuilder(testParams,scene);

    addLights();


    //loader.crossOrigin = '';

    // var propIDMatrix = {ROAD:'road',BUS_STATION:'bus_station',GALLERY:'gallery',TOWN_HALL:'town_hall'};

    // buildRoads();

    // var road = loadPlaneWithTexture('images/road.jpg', propIDMatrix.ROAD, 200, 200);

    // loadModel('models/town2.json',scene,propIDMatrix.BUS_STATION,function(o){
    //     console.log('object loaded');
    // });
    function addLights(){
        var light0 = new THREE.AmbientLight(0x202020);
        light0.name = 'road';
        scene.add(light0);
        var light1 = new THREE.PointLight(0xffffff, 0.5);
        light1.name = 'road';
        light1.position.set(-12, 15, 10);
        scene.add(light1);
        var light2 = new THREE.DirectionalLight(0xffffff, 0.3);
        light2.name = 'road';
        light2.position.set(0, 100, 10);
        scene.add(light2);
        var light1helper = new THREE.PointLightHelper(light1, 0.2);
        light1helper.name = 'road';
        scene.add(light1helper);
        var light2helper = new THREE.DirectionalLightHelper(light2, 1);
        light2helper.name = 'road';
        scene.add(light2helper);
    }

    function objectIsProp(o){
        var _isProp = false;
        for(var p in propIDMatrix){
            if(o.name == propIDMatrix[p]){
                _isProp = true;
            }
        }
        return _isProp;
    }

    function getObjectByName(n){
        var o;
        for(var i = 0;i<scene.children.length;i++){
            if(scene.children[i].name == n){
                o = scene.children[i];
            }
        }
        return o;
    }


    function renderPlayers(){
        var playerElementList = document.getElementsByClassName('player-marker-element');
        for(var i = 0;i<playerElementList.length;i++){
            var playerID = playerElementList[i].getAttribute('id');
            // console.log(playerID);
            var targetObj = getObjectByName(playerID);
            if(targetObj != undefined){
                console.log('moved it');
                targetObj.position.z = Number(playerElementList[i].getAttribute('cy'));
                targetObj.position.x = Number(playerElementList[i].getAttribute('cx'));
                targetObj.rotation.y = Number(playerElementList[i].getAttribute('rot')) * (Math.PI / 180);
                if(targetObj.name == playerIdentifier){
                    camera.position.z = v4v.orbit(targetObj.position.z, -4, Number(playerElementList[i].getAttribute('rot')) * 1, 'sin');
                    camera.position.x = v4v.orbit(targetObj.position.x, 4, Number(playerElementList[i].getAttribute('rot')) * -1, 'cos');
                    camera.position.y = targetObj.position.y + 1.5;
                    camera.lookAt(targetObj.position);
                    // camera.rotation.y = targetObj.rotation.y * -1;
                    // camera.rotation.x = 10 * (Math.PI / 180);


                }
                targetObj.rotation.y = targetObj.rotation.y * -1;
            }
            else{
                console.log('added it');
                var geometry = new THREE.BoxGeometry(1.5, 1, 3);
                var material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
                // var material = new THREE.MeshLambertMaterial({
                //     color: 0xff0000
                // });
                var obj = new THREE.Mesh(geometry, material);
                obj.position.x = -34.202299258964096;
                obj.position.z = 35.5929460574394;
                obj.position.y = .6;
                obj.rotation.y = 1.684286204951821;
                obj.name = playerID
                scene.add(obj);
                camera.position.y = 2;
            }
        }
        for(var i = scene.children.length-1;i>=0;i--){
            if(document.getElementById(scene.children[i].name) == undefined && !objectIsProp(scene.children[i])){
                scene.remove(scene.children[i]);
            }
        }
    }

    this.loadModel = function(modelFile,name,handler){
        var loader = new THREE.GLTFLoader();
        loader.load(modelFile, function (g) {
            // scene.add(obj);
            var loadedObjects = [];
            for (var i = g.scene.children.length - 1; i >= 0; i--) {
                var obj = g.scene.children[i];
                // obj.position.x = -34.202299258964096;
                // obj.position.z = 35.5929460574394;
                // obj.position.y = .6;
                // obj.rotation.y = 1.684286204951821;
                obj.name = name;
                scene.add(obj);
                loadedObjects.push(obj);
            }



            if(handler != undefined){
                handler(loadedObjects);
            }
            // light = new THREE.AmbientLight(0xffffff);
            // scene.add(light);
            // camera.position.y = 2;
            // obj.name = playerID;

        });
    }

    this.loadPlaneWithTexture = function(texturePath, name, width, height) {
        var geometry = new THREE.PlaneGeometry(width, height, 32);
        var material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: false});                // materials.push(material)
        var plane = new THREE.Mesh(geometry, material);
        // plane.position.set(0, -1, 0)
        // plane.rotation.x = 90 * (Math.PI / 180)
        plane.name = name;
        scene.add(plane);
        material.map = new THREE.TextureLoader().load(texturePath);

        return plane;

        // for (var i = 0; i < 20; i++) {
        //     scene.add(addRoadChunk(scene, 0, i * -4))
        // }
    }

    

    function updateRender(){
        renderPlayers();
        renderer.render(scene, camera);
    }

    this.update = function (_id, _pp){
        updatePlayer(_id, _pp);
        renderer.render(scene, camera);
        updateRender();
    }

}
