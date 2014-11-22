$(document).ready(function() {
  var container, stats;

  var camera, scene, renderer;

  var mouseX = 0, mouseY = 0, i = 0;

  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;

  var xmove = 0, ymove = 0, zmove = 0;;

  $("*").keydown(function(event) {
    if(event.which == 37) xmove = -10;
    if(event.which == 39) xmove = 10;
    if(event.which == 38) ymove = 10;
    if(event.which == 40) ymove = -10;
    if(event.which == 90) zmove = -10;
    if(event.which == 88) zmove = 10;
    console.log(xmove);
  });

  $("*").keyup(function(event) {
    xmove=0;
    ymove=0;
    zmove=0;
    console.log(xmove);
  });

  function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    //container = $("#glcanvas");

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.z = 500;

    // scene

    scene = new THREE.Scene();

    var ambient = new THREE.AmbientLight( 0xffffff ); //barva ambientne svetlobe
    scene.add( ambient );

    var directionalLight = new THREE.DirectionalLight( 0xffffff); //barva luči
    directionalLight.position.set( 1, 0, 0 ).normalize(); // smer svetlobe
    scene.add( directionalLight );

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

      object.position.y = -100;
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

  function render() {

    camera.position.x += xmove;
    camera.position.y += ymove;
    camera.position.z += zmove;

    camera.lookAt( scene.position );

    renderer.render( scene, camera );

  }

  init();
  animate();
});
