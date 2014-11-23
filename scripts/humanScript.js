$(document).ready(function() {
  if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

  var container, stats;

  var blendMesh, camera, scene, renderer, controls;

  var clock = new THREE.Clock();
  var gui = null;

  var isFrameStepping = false;
  var timeToStep = 0;

  var xmove = 0, ymove = 0, zmove = 0;
  var roty = 0;
  var isWalking = false;

  var mapW = map.length;
  var mapH = map[0].length

  function degToRad(degrees) {
    return degrees * Math.PI / 180;
  }

  $("*").keydown(function(event) {
    if(event.which == 87) {
      if(!isWalking) {
        isWalking = true;
        blendMesh.rotation.y = Math.PI / 180;
        startWalking();
      }
      zmove = -5;
    }

    if(event.which == 65) {
      if(!isWalking) {
        isWalking = true;
        blendMesh.rotation.y = Math.PI* 90 / 180;
        startWalking();
      }
      xmove = -5;
    }

    if(event.which == 68) {
      if(!isWalking) {
        isWalking = true;
        blendMesh.rotation.y = Math.PI* (-90) / 180;
        startWalking();
      }
      xmove = 5;
    }

    if(event.which == 83) {
      if(!isWalking) {
        isWalking = true;
        blendMesh.rotation.y = Math.PI;
        startWalking();
      }
      zmove = 5;
    }
  });

  $("*").keyup(function(event) {
    roty=0;
    zmove=0;
    xmove=0;
    isWalking = false;
    stopWalking();
  });

  init();

  function init() {

    container = document.getElementById( 'container' );

    scene = new THREE.Scene();
    scene.add ( new THREE.AmbientLight( 0x404040 ) );

    var light1 = new THREE.DirectionalLight( 0xffffff, 1.5 );
    light1.position.set( 0, 0, 100 );
    scene.add( light1 );

    var light2 = new THREE.PointLight( 0xff0000, 1, 0 ); // Affects objects using MeshLambertMaterial or MeshPhongMaterial
    light2.position.set( 50, 50, 50 );
    scene.add( light2 );

    // ground
    /*
    var groundTexture = THREE.ImageUtils.loadTexture( "./assets/gray_floor.png" );
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set( 25, 25 );
    groundTexture.anisotropy = 16;

    var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: groundTexture } );

    var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 8000 ), groundMaterial );
    mesh.position.y = -250;
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add( mesh );
*/

    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: false } );
    renderer.setClearColor( '#7ec0ee', 1 );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.autoClear = true;

    container.appendChild( renderer.domElement );

    /*
    var onProgress = function ( xhr ) {
      if ( xhr.lengthComputable ) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round(percentComplete, 2) + '% downloaded' );
      }
    };

    var onError = function ( xhr ) {
    };

    // load scene model
    var sceneLoader = new THREE.AssimpJSONLoader();
    sceneLoader.load( './assets/scena.json', function ( assimpjson ) {

      assimpjson.scale.x = assimpjson.scale.y = assimpjson.scale.z = 1;
      assimpjson.updateMatrix();

      scene.add( assimpjson );

    }, onProgress, onError );
    */
    //

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );

    //

    window.addEventListener( 'resize', onWindowResize, false );

    blendMesh = new THREE.BlendCharacter();
    blendMesh.load( "./assets/models/skinned/marine/marine_anims.js", start );

    setupScene();
  }

  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

  }

  function startWalking() {

    blendMesh.stopAll();

    blendMesh.play("idle", 0.25);
    blendMesh.play("walk", 0.25);
    blendMesh.play("run", 0.50);

    isFrameStepping = false;

  }

  function stopWalking() {

    blendMesh.stopAll();

    blendMesh.play("idle", 1.0);
    blendMesh.play("walk", 0.0);
    blendMesh.play("run", 0.0);

    isFrameStepping = false;

  }

  function start() {

    blendMesh.rotation.y = Math.PI * -135 / 180;
    scene.add( blendMesh );

    var aspect = window.innerWidth / window.innerHeight;
    var radius = blendMesh.geometry.boundingSphere.radius;

    camera = new THREE.PerspectiveCamera( 45, aspect, 1, 10000 );
    camera.position.set( 0.0, radius, radius * 3.5 );
    camera.rotation.x = degToRad(-20);

    //controls = new THREE.OrbitControls( camera );
    //controls.target = new THREE.Vector3( 0, radius, 0 );
    //controls.update();

    // Set default weights

    blendMesh.animations[ 'idle' ].weight = 1 / 3;
    blendMesh.animations[ 'walk' ].weight = 1 / 3;
    blendMesh.animations[ 'run' ].weight = 1 / 3;

    //gui = new BlendCharacterGui(blendMesh.animations);

    animate();
  }

  function animate() {

    requestAnimationFrame( animate, renderer.domElement );

    // step forward in time based on whether we're stepping and scale

    var scale = 1;
    var delta = clock.getDelta();
    var stepSize = (!isFrameStepping) ? delta * scale: timeToStep;

    blendMesh.position.x += xmove;
    blendMesh.position.z += zmove;

    camera.position.x = blendMesh.position.x;
    camera.position.y = blendMesh.position.y + 250;
    camera.position.z = blendMesh.position.z + 350;

    // modify blend weights

    blendMesh.update( stepSize );

    THREE.AnimationHandler.update( stepSize );

    renderer.render( scene, camera );
    stats.update();

    // if we are stepping, consume time
    // ( will equal step size next time a single step is desired )

    timeToStep = 0;

  }

  function setupScene() {
    var units = mapW;
    var UNITSIZE = 250;
    var WALLHEIGHT = UNITSIZE / 3;

    // Geometry: floor
    var floor = new THREE.Mesh(
      new THREE.BoxGeometry(units * UNITSIZE, 10, units * UNITSIZE),
      new THREE.MeshLambertMaterial({color: 0xEDCBA0})
    );
    scene.add(floor);

    // Geometry: walls
    var cube = new THREE.BoxGeometry(UNITSIZE, WALLHEIGHT, UNITSIZE);
    var materials = [
      new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('./assets/concrete_wall.png')}),
      new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('./assets/red_wall.png')}),
    ];
    for (var i = 0; i < mapW; i++) {
      for (var j = 0, m = map[i].length; j < m; j++) {
        console.log(map[i][j]);
        if (map[i][j]) {
          var wall = new THREE.Mesh(cube, materials[map[i][j]-1]);
          wall.position.x = (i - units/2) * UNITSIZE;
          wall.position.y = WALLHEIGHT/2;
          wall.position.z = (j - units/2) * UNITSIZE;
          scene.add(wall);
        }
      }
    }

    // Lighting
    var directionalLight1 = new THREE.DirectionalLight( 0xF7EFBE, 0.7 );
    directionalLight1.position.set( 0.5, 1, 0.5 );
    scene.add( directionalLight1 );
    var directionalLight2 = new THREE.DirectionalLight( 0xF7EFBE, 0.5 );
    directionalLight2.position.set( -0.5, -1, -0.5 );
    scene.add( directionalLight2 );
  }
});
