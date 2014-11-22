$(document).ready(function() {
  var container, stats;

  var camera, scene, renderer;

  var mouseX = 0, mouseY = 0, i = 0;

  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;

  var xmove = 0, ymove = 0, zmove = 0;
  var roty = 0;

  $("*").keydown(function(event) {
    //if(event.which == 37) xmove = -10;
    //if(event.which == 39) xmove = 10;

    if(event.which == 37) roty = 3; //leva tipka
    if(event.which == 39) roty = -3; //desna tipka
    if(event.which == 38) zmove = -1; //gor tipka
    if(event.which == 40) zmove = 1; //dol tipka
    //if(event.which == 90) zmove = -10; // z tipka
    //if(event.which == 88) zmove = 10; // x tipka
    console.log(roty);
    console.log(zmove);
  });

  $("*").keyup(function(event) {
    //xmove=0;
    //ymove=0;
    roty=0;
    zmove=0;
    console.log(xmove);
  });

  function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    // scene

    scene = new THREE.Scene();

    scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );

    // camera

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 0;
    scene.add( camera );

    // lights

    var light, materials;

    scene.add( new THREE.AmbientLight( 0x00ff00 ) );

    //light = new THREE.DirectionalLight( 0xdfebff, 1.75 );
    light = new THREE.DirectionalLight( 0xff0000, 1.75 );
    light.position.set( 50, 200, 100 );
    light.position.multiplyScalar( 1.3 );

    light.castShadow = true;
    //light.shadowCameraVisible = true;

    light.shadowMapWidth = 1024;
    light.shadowMapHeight = 1024;

    var d = 300;

    light.shadowCameraLeft = -d;
    light.shadowCameraRight = d;
    light.shadowCameraTop = d;
    light.shadowCameraBottom = -d;

    light.shadowCameraFar = 1000;
    light.shadowDarkness = 0.5;

    scene.add( light );

    var onProgress = function ( xhr ) {
      if ( xhr.lengthComputable ) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round(percentComplete, 2) + '% downloaded' );
      }
    };

    var onError = function ( xhr ) {
    };

    // ground

    var groundTexture = THREE.ImageUtils.loadTexture( "./assets/textures/terrain/grasslight-big.jpg" );
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set( 25, 25 );
    groundTexture.anisotropy = 16;

    var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: groundTexture } );

    var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
    mesh.position.y = -250;
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add( mesh );

    // load interior model
    var loader2 = new THREE.AssimpJSONLoader();
    loader2.load( './assets/models/assimp/interior/interior.assimp.json', function ( assimpjson ) {

      assimpjson.scale.x = assimpjson.scale.y = assimpjson.scale.z = 1;
      assimpjson.updateMatrix();

      assimpjson.position.x = assimpjson.position.z = 0;
      assimpjson.position.y = -3;
      assimpjson.updateMatrix();

      scene.add( assimpjson );

    }, onProgress, onError );

    //

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( scene.fog.color );

    container.appendChild( renderer.domElement );

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    renderer.shadowMapEnabled = true;

    //

    stats = new Stats();
    container.appendChild( stats.domElement );

    //

    window.addEventListener( 'resize', onWindowResize, false );

  }

/*
  function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    //container = $("#glcanvas");

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = 500;
    camera.position.y = 100;

    // scene

    scene = new THREE.Scene();

    var ambient = new THREE.AmbientLight( 0xffffff ); //barva ambientne svetlobe
    scene.add( ambient );

    var directionalLight = new THREE.DirectionalLight( 0xffffff); //barva luči
    directionalLight.position.set( 1, 0, 0 ).normalize(); // smer svetlobe
    scene.add( directionalLight );

    //scene.fog = new THREE.Fog( 0x72645b, 2, 15 );


    // Ground

    var plane = new THREE.Mesh(
      new THREE.PlaneBufferGeometry( 4000, 4000),
      new THREE.MeshPhongMaterial( { ambient: 0x999999, color: 0x999999, specular: 0x101010 } )
    );
    plane.rotation.x = -Math.PI/2;
    plane.position.y = -0.5;
    scene.add( plane );

    plane.receiveShadow = true;

    // model

    var onProgress = function ( xhr ) {
      if ( xhr.lengthComputable ) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round(percentComplete, 2) + '% downloaded' );
      }
    };

    var onError = function ( xhr ) {
    };


    THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

    var loader = new THREE.OBJMTLLoader();
    loader.load( './assets/obj/female02/female02.obj', './assets/obj/female02/female02.mtl', function ( object ) {

      object.position.y = 0;
      scene.add( object );

    }, onProgress, onError );

    //

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    //

    window.addEventListener( 'resize', onWindowResize, false );

  }
*/
  function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

  }

  function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX ) / 2;
    mouseY = ( event.clientY - windowHalfY ) / 2;

  }

  //

  function animate() {

    requestAnimationFrame( animate );
    render();

  }


  function degToRad(degrees) {
    return degrees * Math.PI / 180;
  }

  function render() {

    //camera.position.x += xmove;
    //camera.position.y += ymove;
    camera.rotation.y += degToRad(roty);
    camera.position.z += zmove;

    console.log("rot y = "+camera.rotation.y);

    if(camera.position.y<0) camera.position.y=0;

    //camera.lookAt( scene.position );

    renderer.render( scene, camera );

  }

  init();
  animate();
});
