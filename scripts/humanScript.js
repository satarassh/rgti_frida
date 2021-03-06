$(document).ready(function() {
  if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
  var currentLevel = 1;

  setTimeout(function() {
    $('#bigObjective').fadeOut('slow');
    $('#objectivesBar').text(objectives[currentLevel-1]);
  }, 3000);

  var container, stats;

  var blendMesh, camera, scene, renderer, controls, raycaster, prof;

  var clock = new THREE.Clock();
  var gui = null;

  var isFrameStepping = false;
  var timeToStep = 0;

  var xmove = 0, ymove = 0, zmove = 0;
  var camx = 0, camy = 0, camz = 0;
  var roty = 0;
  var isWalking = false;
  var currentNumStanding = 0;

  var mapW = map.length;
  var mapH = map[0].length

  var camera_number = 1;
  var camera_position = "north";
  var person_position = "north";
  var camoffsetZ = 350;
  var camoffsetX = 0;

  var aspect;
  var radius;

  var rotateAround = 0;

  var mouse = {x: 0, y: 0};

  var UNITSIZE = 100;

  /* Temporary object in scene */
  var cylinderLevel1, lightLevel1;

  function degToRad(degrees) {
    return degrees * Math.PI / 180;
  }

  function cameraToDefault() {
    camera_position = "north";
    aspect = window.innerWidth / window.innerHeight;
    radius = blendMesh.geometry.boundingSphere.radius;

    camera = new THREE.PerspectiveCamera( 60, aspect, 1, 10000 );
    camera.position.set( 0.0, radius, radius * 3.5 );
    camera.position.x = blendMesh.position.x;
    camera.position.y = blendMesh.position.y + 250;
    camoffsetX = 0;
    camoffsetZ = 350;

    camera.rotation.x = degToRad(-20);
    camera.rotation.y = degToRad(0);
    camera.rotation.z = degToRad(0);
  }

  $("#Nbutton").click(function() {
    camera_position = "north";
    aspect = window.innerWidth / window.innerHeight;
    radius = blendMesh.geometry.boundingSphere.radius;

    camera = new THREE.PerspectiveCamera( 60, aspect, 1, 10000 );
    camera.position.set( 0.0, radius, radius * 3.5 );
    camera.position.x = blendMesh.position.x;
    camera.position.y = blendMesh.position.y + 250;
    camoffsetX = 0;
    camoffsetZ = 350;

    camera.rotation.x = degToRad(-20);
    camera.rotation.y = degToRad(0);
    camera.rotation.z = degToRad(0);
  });

  $("#Sbutton").click(function() {
    camera_position = "south";
    aspect = window.innerWidth / window.innerHeight;
    radius = blendMesh.geometry.boundingSphere.radius;

    camera = new THREE.PerspectiveCamera( 60, aspect, 1, 10000 );
    camera.position.set( 0.0, radius, radius * 3.5 );
    camera.position.x = blendMesh.position.x;
    camera.position.y = blendMesh.position.y + 250;
    camoffsetX = 0;
    camoffsetZ = -350;

    camera.rotation.x = degToRad(20);
    camera.rotation.y = degToRad(180);
    camera.rotation.z = degToRad(0);
  });

  $("#Wbutton").click(function() {
    camera_position = "west";
    aspect = window.innerWidth / window.innerHeight;
    radius = blendMesh.geometry.boundingSphere.radius;

    camera = new THREE.PerspectiveCamera( 60, aspect, 1, 10000 );
    camera.position.set( 0.0, radius, radius * 3.5 );
    camera.position.z = blendMesh.position.z;
    camera.position.y = blendMesh.position.y + 220;
    camoffsetX = 400;
    camoffsetZ = 0;

    camera.rotation.x = degToRad(0);
    camera.rotation.y = degToRad(90);
    camera.rotation.z = degToRad(0);
  });

  $("#Ebutton").click(function() {
    camera_position = "east";
    aspect = window.innerWidth / window.innerHeight;
    radius = blendMesh.geometry.boundingSphere.radius;

    camera = new THREE.PerspectiveCamera( 60, aspect, 1, 10000 );
    camera.position.set( 0.0, radius, radius * 3.5 );
    camera.position.z = blendMesh.position.x;
    camera.position.y = blendMesh.position.y + 220;
    camoffsetX = -400;
    camoffsetZ = 0;

    camera.rotation.x = degToRad(0);
    camera.rotation.y = degToRad(-90);
    camera.rotation.z = degToRad(0);
  });

  $("#switchToCamera1").click(function() {
    camera_number = 1;

    $("#camera1Controls").show();

    cameraToDefault();
  });

  $("#switchToCamera2").click(function() {
    camera_number = 2;

    $("#camera1Controls").hide();

    camera = new THREE.PerspectiveCamera( 60, aspect, 1, 10000 );
    camera.position.set( 0.0, 1000, 0.0 );

    controls = new THREE.OrbitControls( camera );
    controls.target = new THREE.Vector3( 0, radius, 0 );
    //controls.maxPolarAngle = Math.PI/2;
    controls.update();
  });

  $("#switchToCameraBird").click(function() {
    camera_number = 3;

    $("#camera1Controls").hide();

    aspect = window.innerWidth / window.innerHeight;
    radius = blendMesh.geometry.boundingSphere.radius;

    camera = new THREE.PerspectiveCamera( 60, aspect, 1, 10000 );
    camera.position.set( 0.0, radius, radius * 3.5 );
    camera.rotation.x = degToRad(-90);

    camera.position.x = 0;
    camera.position.y = 2000;
    camera.position.z = 0;
  });

  $("#container").mousemove(function( event ) {
    //$("#statusBar").text(camera.position.x+" "+camera.position.y+" : "+camera.rotation.x+" "+camera.rotation.y);
    mouse.x = event.pageX;
    mouse.y = event.pageY;
  });

  $("#switchGraphicsButton").click(function() {

  });

  $("*").keydown(function(event) {
    // gor
    if(event.which == 87) {
      if(camera_number == 1) {
        if(camera_position == "north") {
          if(!isWalking) {
            isWalking = true;
            blendMesh.rotation.y = 0;
            startWalking();
          }
          zmove = -15;
          xmove = 0;
          person_position = "north";
        } else if(camera_position == "south") {
          if(!isWalking) {
            isWalking = true;
            blendMesh.rotation.y = Math.PI;
            startWalking();
          }
          zmove = 15;
          xmove = 0;
          person_position = "south";
        } else if(camera_position == "west") {
          if(!isWalking) {
            isWalking = true;
            blendMesh.rotation.y = Math.PI* 90 / 180;
            startWalking();
          }
          xmove = -15;
          zmove=0;
          person_position = "west";
        } else if(camera_position == "east") {
          if(!isWalking) {
            isWalking = true;
            blendMesh.rotation.y = Math.PI* (-90) / 180;
            startWalking();
          }
          xmove = 15;
          zmove=0;
          person_position = "east";
        }
      } else if(camera_number == 2) {
        camz = -15;
      } else if(camera_number == 3) {
        if(!isWalking) {
          isWalking = true;
          blendMesh.rotation.y = Math.PI / 180;
          startWalking();
        }
        zmove = -15;
        person_position = "north";
      }
    }

    // dol
    if(event.which == 83) {
      if(camera_number == 1) {
        if(camera_position == "north") {
          if(!isWalking) {
            isWalking = true;
            blendMesh.rotation.y = Math.PI;
            startWalking();
          }
          zmove = 15;
          xmove = 0;
          person_position = "north";
        } else if(camera_position == "south") {
          if(!isWalking) {
            isWalking = true;
            blendMesh.rotation.y = 0;
            startWalking();
          }
          zmove = -15;
          xmove = 0;
          person_position = "south";
        } else if(camera_position == "west") {
          if(!isWalking) {
            isWalking = true;
            blendMesh.rotation.y = Math.PI* (-90) / 180;
            startWalking();
          }
          xmove = 15;
          zmove=0;
          person_position = "west";
        } else if(camera_position == "east") {
          if(!isWalking) {
            isWalking = true;
            blendMesh.rotation.y = Math.PI* (90) / 180;
            startWalking();
          }
          xmove = -15;
          zmove=0;
          person_position = "east";
        }
      } else if(camera_number == 2) {
        camz = 15;
      } else if(camera_number == 3) {
        if(!isWalking) {
          isWalking = true;
          blendMesh.rotation.y = Math.PI;
          startWalking();
        }
        zmove = 15;
        person_position = "south";
      }
    }

    // levo
    if(event.which == 65) {
      if(camera_number == 1) {
        if(camera_position == "north") {
          if(!isWalking) {
            isWalking = true;
            blendMesh.rotation.y = Math.PI* 90 / 180;
            startWalking();
          }
          xmove = -15;
          zmove=0;
          person_position = "north";
        } else if(camera_position == "south") {
          if(!isWalking) {
            isWalking = true;
            blendMesh.rotation.y = Math.PI* (-90) / 180;
            startWalking();
          }
          xmove = 15;
          zmove=0;
          person_position = "south";
        } else if(camera_position == "west") {
          if(!isWalking) {
            isWalking = true;
            blendMesh.rotation.y = Math.PI;
            startWalking();
          }
          zmove = 15;
          xmove = 0;
          person_position = "west";
        } else if(camera_position == "east") {
          if(!isWalking) {
            isWalking = true;
            blendMesh.rotation.y = 0;
            startWalking();
          }
          zmove = -15;
          xmove = 0;
          person_position = "east";
        }
      } if(camera_number == 2) {
        camx = -15;
      } else if(camera_number == 3) {
        if(!isWalking) {
          isWalking = true;
          blendMesh.rotation.y = Math.PI* 90 / 180;
          startWalking();
        }
        xmove = -15;
        person_position = "west";
      }
    }

    // desno
    if(event.which == 68) {
      if(camera_number == 1) {
        if(camera_position == "north") {
          if(!isWalking) {
            isWalking = true;
            blendMesh.rotation.y = Math.PI* (-90) / 180;
            startWalking();
          }
          xmove = 15;
          zmove=0;
          person_position = "north";
        } else if(camera_position == "south") {
          if(!isWalking) {
            isWalking = true;
            blendMesh.rotation.y = Math.PI* 90 / 180;
            startWalking();
          }
          xmove = -15;
          zmove=0;
          person_position = "south";
        } else if(camera_position == "west") {
          if(!isWalking) {
            isWalking = true;
            blendMesh.rotation.y = 0;
            startWalking();
          }
          zmove = -15;
          xmove = 0;
          person_position = "west";
        } else if(camera_position == "east") {
          if(!isWalking) {
            isWalking = true;
            blendMesh.rotation.y = Math.PI;
            startWalking();
          }
          zmove = 15;
          xmove = 0;
          person_position = "east";
        }
      } if(camera_number == 2) {
        camx = 15;
      } else if(camera_number == 3) {
        if(!isWalking) {
          isWalking = true;
          blendMesh.rotation.y = Math.PI* (-90) / 180;
          startWalking();
        }
        xmove = 15;
        person_position = "east";
      }
    }
  });

  $("*").keyup(function(event) {
    roty=0;
    zmove=0;
    xmove=0;
    camx=0;
    camz=0;
    isWalking = false;
    stopWalking();
  });

  init();

  function init() {

    container = document.getElementById( 'container' );

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0xcce0ff, 500, 20000 );
    scene.add ( new THREE.AmbientLight( 0x444444 ) );

    var sun = new THREE.PointLight( 0xFFFF7F, 5, 10000 ); sun.position.set( -3000, 2000, 8000 ); scene.add( sun );
    // Add Sun Helper
    //sunSphere = new THREE.Mesh( new THREE.SphereGeometry( 20000, 30, 30 ),
    //new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: false }));
    //sunSphere.position.y = -700000;
    //sunSphere.visible = true;
    //scene.add( sunSphere );

    var light1 = new THREE.DirectionalLight( 0x666666, 1.5 );
    light1.position.set( 0, 0, 100 );
    scene.add( light1 );


    var light2 = new THREE.PointLight( 0x220000, 1, 0 ); // Affects objects using MeshLambertMaterial or MeshPhongMaterial
    light2.position.set( 50, 50, 50 );
    scene.add( light2 );


    renderer = new THREE.WebGLRenderer( { antialias: false, alpha: false } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.autoClear = true;
    renderer.setClearColor( scene.fog.color );

    container.appendChild( renderer.domElement );

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

    blendMesh = new THREE.BlendCharacter();
    blendMesh.load( "./assets/models/skinned/marine/marine_anims.js", start );

    setupScene();
  }

  function start() {
    blendMesh.rotation.y = Math.PI  / 180;
    blendMesh.position.y = 10;
    scene.add( blendMesh );

    aspect = window.innerWidth / window.innerHeight;
    radius = blendMesh.geometry.boundingSphere.radius;

    camera = new THREE.PerspectiveCamera( 60, aspect, 1, 10000 );
    camera.position.set( 0.0, radius, radius * 3.5 );
    camera.rotation.x = degToRad(-20);

    camera.position.y = blendMesh.position.y + 250;
    camera.position.z = blendMesh.position.z + 350;

    // Set default weights
    blendMesh.animations[ 'idle' ].weight = 1 / 3;
    blendMesh.animations[ 'walk' ].weight = 1 / 3;
    blendMesh.animations[ 'run' ].weight = 1 / 3;

    animate();
  }

  function getMapSector(v) {
    var x = Math.floor((v.x + UNITSIZE / 2) / UNITSIZE + mapW/2);
    var z = Math.floor((v.z + UNITSIZE / 2) / UNITSIZE + mapH/2);
    return {x: x, z: z};
  }

  function checkWallCollision(v) {
    var c = getMapSector(v);
    currentNumStanding = map[c.x][c.z];
    return map[c.x][c.z] > 0 && map[c.x][c.z] <= 100;
  }

  function animate() {
    var scale = 1;
    var delta = clock.getDelta();
    var stepSize = (!isFrameStepping) ? delta * scale: timeToStep;

    // prej znotraj if stavka
    var plusx = 0;
    var plusz = 0;

    if(person_position == "north") {
      plusz = -40;
    } else if(person_position == "south") {
      plusz = 40;
    } else if(person_position == "west") {
      plusx = -40;
    } else if(person_position == "east") {
      plusx = 40;
    }

    var check = new THREE.Vector3( blendMesh.position.x+plusx, blendMesh.position.y, blendMesh.position.z+plusz );
    check.x += xmove;
    check.z += zmove;

    var posnum = checkWallCollision(check);

    $("#statusBar").text("posnum="+posnum+" currNumStanding="+currentNumStanding+" currentLevel"+currentLevel);

    if (!posnum) {
      blendMesh.position.x += xmove;
      blendMesh.position.z += zmove;

      if(currentNumStanding == 131 && currentLevel == 1) {
        $('#bigObjective').show();

        currentLevel=2;

        $('#bigObjectiveHeader').text("New objective");
        $('#bigObjectiveText').text(objectives[currentLevel-1]);
        setTimeout(function() {
          $('#bigObjective').fadeOut('slow');
        }, 3000);

        $('#objectivesBar').text(objectives[currentLevel-1]);
        scene.remove(cylinderLevel1);
        scene.remove(lightLevel1);
      }
    }

    if(camera_number == 1) {
      camera.position.x = blendMesh.position.x+xmove+camoffsetX;
      camera.position.z = blendMesh.position.z+zmove+camoffsetZ;
      //$("#statusBar").text("xmove="+xmove+" zmove="+zmove+" camoffsetX="+camoffsetX+" camoffsetZ="+camoffsetZ);
    } else if(camera_number == 2) {
      // do something
      camera.position.x += camx;
      camera.position.z += camz;
      controls.update();
    } else if(camera_number == 3) {
      camera.position.x = blendMesh.position.x;
      camera.position.z = blendMesh.position.z;
    }

    blendMesh.update( stepSize );

    THREE.AnimationHandler.update( stepSize );

    renderer.render( scene, camera );
    stats.update();

    timeToStep = 0;
    //$("#statusBar").text(camera.position.x+" "+camera.position.y+" "+camera.position.z+" : "+camera.rotation.x+" "+camera.rotation.y+" "+camera.rotation.z);

    requestAnimationFrame( animate, renderer.domElement );
  }

  function setupScene() {
    var UNITSIZE = 100;
    var WALLHEIGHT = UNITSIZE*2;
    var WINDOWHEIGHT = 2*WALLHEIGHT/3;

    // Geometry: floor
    var floor = new THREE.Mesh(
      new THREE.BoxGeometry(mapW * UNITSIZE, 10, mapH * UNITSIZE),
      new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('./assets/gray_floor.png')})
    );
    scene.add(floor);

    // ground
    var groundTexture = THREE.ImageUtils.loadTexture( "./assets/textures/terrain/grasslight-big.jpg" );
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set( 25, 25 );
    groundTexture.anisotropy = 16;

    var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: groundTexture } );

    var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 100000, 100000 ), groundMaterial );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add( mesh );

    var onProgress = function ( xhr ) {
      if ( xhr.lengthComputable ) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round(percentComplete, 2) + '% downloaded' );
      }
    };

    var onError = function ( xhr ) {
    };
    function loadObject(obj,mtl,i,j){
      var loader = new THREE.OBJMTLLoader();
      loader.load( obj, mtl, function ( object ) {
        object.position.x = (i - mapW/2) * UNITSIZE;
        object.position.y = 5;
        object.position.z = (j - mapH/2) * UNITSIZE;
        object.rotation.y = degToRad(90);
        object.scale.set(45,45,45);
        scene.add( object );
      }, onProgress, onError);
    }


    // Geometry: walls

    var materials = [
    new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('./assets/concrete_wall.png')}),
    new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('./assets/red_wall_2.png')}),
    new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('./assets/yellow_wall.png')}),
    new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('./assets/fri.png')}),
    new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('./assets/yellow_wall.png')}),
    new THREE.MeshBasicMaterial( { color: 0x181818, transparent: true, blending: THREE.AdditiveBlending }),
    new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('./assets/les.png')})
    ];
    for (var i = 0; i < mapW; i++) {
      for (var j = 0, m = map[i].length; j < m; j++) {
        //console.log(map[i][j]);
        if (map[i][j]) {
          if(map[i][j]==6) {

            var geometry = new THREE.CylinderGeometry( UNITSIZE*2, UNITSIZE*2, WALLHEIGHT, 32 );
            var mat = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('./assets/red_wall_2.png')});
            var cylinder = new THREE.Mesh( geometry, mat );
            cylinder.position.x = (i - mapW/2) * UNITSIZE;
            cylinder.position.y = WALLHEIGHT/2;
            cylinder.position.z = (j - mapH/2) * UNITSIZE;
            scene.add(cylinder);

          } else if(map[i][j] == 7) {

            var cube = new THREE.BoxGeometry(UNITSIZE, WALLHEIGHT/3, UNITSIZE);
            var wall = new THREE.Mesh(cube, materials[0]);
            wall.position.x = (i - mapW/2) * UNITSIZE;
            wall.position.y = WALLHEIGHT/6;
            wall.position.z = (j - mapH/2) * UNITSIZE;
            scene.add(wall);

            cube = new THREE.BoxGeometry(UNITSIZE, WINDOWHEIGHT, 10);
            win = new THREE.Mesh(cube, materials[5]);
            win.position.x = (i - mapW/2) * UNITSIZE;
            win.position.y = WALLHEIGHT/6 + UNITSIZE;
            win.position.z = (j - mapH/2) * UNITSIZE;
            scene.add(win);

          } else if(map[i][j] == 5) {

            cube = new THREE.BoxGeometry(UNITSIZE, WALLHEIGHT, 10);
            win = new THREE.Mesh(cube, materials[5]);
            win.position.x = (i - mapW/2) * UNITSIZE;
            win.position.y = WALLHEIGHT/2;
            win.position.z = (j - mapH/2) * UNITSIZE;
            scene.add(win);

          }else if(map[i][j] == 8) {

            cube = new THREE.BoxGeometry(10, WALLHEIGHT, UNITSIZE);
            win = new THREE.Mesh(cube, materials[5]);
            win.position.x = (i - mapW/2) * UNITSIZE;
            win.position.y = WALLHEIGHT/2;
            win.position.z = (j - mapH/2) * UNITSIZE;
            scene.add(win);

          } else if(map[i][j]==9){

            var geometry = new THREE.CylinderGeometry( UNITSIZE*2, UNITSIZE*2, WALLHEIGHT, 32 );
            var mat = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('./assets/yellow_wall.png')});
            var cylinder = new THREE.Mesh( geometry, mat );
            cylinder.position.x = (i - mapW/2) * UNITSIZE;
            cylinder.position.y = WALLHEIGHT/2;
            cylinder.position.z = (j - mapH/2) * UNITSIZE;
            scene.add(cylinder);

          }else if(map[i][j]==10){

            var klop = new THREE.BoxGeometry(UNITSIZE*3, WALLHEIGHT/4, UNITSIZE/2);
            var mat = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('./assets/les.png')});
            var klopca = new THREE.Mesh( klop, mat );
            klopca.position.x = (i - mapW/2) * UNITSIZE;
            klopca.position.y = WALLHEIGHT/8;
            klopca.position.z = (j - mapH/2) * UNITSIZE;
            scene.add(klopca);

          }else if(map[i][j]==11){
            //var stol = loadObject('./assets/Chair/Chair.obj', './assets/Chair/Chair.mtl', i, j);
          }else if(map[i][j]==30){
            var coladaProfessor = new THREE.ColladaLoader();
            var ic = i, jc = j;
            coladaProfessor.load( "./assets/models/collada/avatar.dae", function ( collada ) {

              prof = collada.scene;
              prof.traverse( function ( child ) {

                if ( child instanceof THREE.SkinnedMesh ) {

                  var animation = new THREE.Animation( child, child.geometry.animation );
                  animation.play();

                }

              } );
              prof.rotation.x = degToRad(-90);
              prof.rotation.z = degToRad(90);

              prof.position.x = (ic - mapW/2) * UNITSIZE;
              prof.position.y = 10;
              prof.position.z = (jc - mapH/2) * UNITSIZE;

              //alert(prof.position.x+" "+prof.position.y+" "+prof.position.z+" ");

              prof.scale.x = prof.scale.y = prof.scale.z = 120.0;
              prof.updateMatrix();

              scene.add( collada.scene );
              animate();
            } );

            var message = makeTextSprite( " Prof. Bohak ",
            { fontsize: 32, fontface: "Arial", borderColor: {r:0, g:0, b:255, a:1.0} } );
            message.position.x = (ic - mapW/2) * UNITSIZE;
            message.position.y = 230;
            message.position.z = (jc - mapH/2) * UNITSIZE-20;
            scene.add( message );
          } else if(map[i][j]==131) {
            var geometry = new THREE.CylinderGeometry( UNITSIZE, UNITSIZE, WALLHEIGHT, 32 );
            var mat = new THREE.MeshBasicMaterial( { color: 0xCD00CD, transparent: true, blending: THREE.AdditiveBlending });
            cylinderLevel1 = new THREE.Mesh( geometry, mat );
            cylinderLevel1.position.x = (i - mapW/2) * UNITSIZE;
            cylinderLevel1.position.y = WALLHEIGHT/2;
            cylinderLevel1.position.z = (j - mapH/2) * UNITSIZE;
            scene.add(cylinderLevel1);
            lightLevel1 = new THREE.PointLight( 0xD15FEE, 1, 1000 );
            lightLevel1.position.x = (i - mapW/2) * UNITSIZE;
            lightLevel1.position.y = 50;
            lightLevel1.position.z = (j - mapH/2) * UNITSIZE;

            scene.add(lightLevel1);

          }else if(map[i][j]>100) {

            $("#statusBar").text(map[i][j]);
            var message = makeTextSprite( " R 1."+(map[i][j]-100)+" ",
            { fontsize: 32, fontface: "Arial", borderColor: {r:0, g:0, b:255, a:1.0} } );
            message.position.x = (i - mapW/2) * UNITSIZE;
            message.position.y = 230;
            message.position.z = (j - mapH/2) * UNITSIZE;
            scene.add( message );
          } else {

            var cube = new THREE.BoxGeometry(UNITSIZE, WALLHEIGHT, UNITSIZE);
            var wall = new THREE.Mesh(cube, materials[map[i][j]-1]);
            wall.position.x = (i - mapW/2) * UNITSIZE;
            wall.position.y = WALLHEIGHT/2;
            wall.position.z = (j - mapH/2) * UNITSIZE;
            scene.add(wall);

          }
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

  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    //controls.handleResize();
  }

  function startWalking() {

    blendMesh.stopAll();

    blendMesh.play("idle", 0);
    blendMesh.play("walk", 0);
    blendMesh.play("run", 1.0);

    isFrameStepping = false;

  }

  function stopWalking() {

    blendMesh.stopAll();

    blendMesh.play("idle", 1.0);
    blendMesh.play("walk", 0.0);
    blendMesh.play("run", 0.0);

    isFrameStepping = false;

  }
});
