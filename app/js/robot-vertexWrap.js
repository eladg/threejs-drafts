var container;
var mouseX = 0, mouseY = 0;
var camera, scene, controls, renderer;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

// objects
var robot;

init();
animate();


function init() {

  container = document.createElement( 'div' );
  document.body.appendChild( container );

  // scene
  scene = new THREE.Scene();

  // camera
  camera = new THREE.PerspectiveCamera(33, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 100);
  camera.focalLength = camera.position.distanceTo(scene.position);
  camera.lookAt(scene.position);

  // controls
  controls = new THREE.OrbitControls(camera);
  controls.autoRotate = false;
  controls.enablePan = true;

  var ambient = new THREE.AmbientLight( 0xffffff );
  scene.add(ambient);

  // robot object
  robot = robot();
  scene.add(robot);

  // the rest
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );
}

function robot() {
  var obj = new THREE.Object3D();
  var material = new THREE.MeshPhongMaterial( {
    color: 0x00ffff,
    wireframe: true,
  });

  var geometry;

  geometry = new THREE.BoxGeometry( 10, 10, 10 );
  var head = new THREE.Mesh( geometry, material );
  head.name = 'head';
  head.position.set(0, 16, 0);

  geometry = new THREE.BoxGeometry( 10, 20, 10 );
  var body = new THREE.Mesh( geometry, material );
  body.name = 'body';
  body.position.set(0, 0, 0);

  geometry = new THREE.BoxGeometry( 2, 10, 2 );
  var handL = new THREE.Mesh( geometry, material );
  handL.name = 'hand-left';
  handL.position.set(7, 3, 0);

  geometry = new THREE.BoxGeometry( 2, 10, 2 );
  var handR = new THREE.Mesh( geometry, material );
  handR.name = 'hand-right';
  handR.position.set(-7, 3, 0);

  geometry = new THREE.BoxGeometry( 2, 2, 8 );
  var legL = new THREE.Mesh( geometry, material );
  legL.name = 'leg-left';
  legL.position.set(-3, -11, 0);

  geometry = new THREE.BoxGeometry( 2, 2, 8 );
  var legR = new THREE.Mesh( geometry, material );
  legR.name = 'leg-right';
  legR.position.set(3, -11, 0);

  obj.add(head);
  obj.add(body);
  obj.add(handL);
  obj.add(handR);
  obj.add(legL);
  obj.add(legR);

  return obj;
}

function onDocumentMouseMove( event ) {
  mouseX = ( event.clientX - windowHalfX ) / 2;
  mouseY = ( event.clientY - windowHalfY ) / 2;
}

function floatInRange(float, original, range) {
  if (float + range > original) {
    return float*-1;
  }
  return float;
}

function robotShake(mod, range) {
  for (var i = 0; i < robot.children.length; i++) {
    var mesh = robot.children[i];
    var originalMesh = robot.children[i];
    for (var j = 0; j < mesh.geometry.vertices.length; j++) {

      var v  = mesh.geometry.vertices[j];
      var _v = originalMesh.geometry.vertices[j];
      var rand = (Math.random()*0.1) + v.x;
      
      if (rand + range > _v.x) {mod *= -1;}

      v.x = floatInRange(rand*mod, _v.x, range);
      mesh.geometry.verticesNeedUpdate = true;
    }
  }
}

function animate() {
  requestAnimationFrame( animate );
  render();
}

function render() {
  robotShake(1,5);
  controls.update();
  renderer.render( scene, camera );
}
