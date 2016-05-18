var camera, scene, renderer, controls;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var sphere;

init();
animate();

function setOrientationControls(e) {
  if (!e.alpha) {
      return;
  }
  controls = new THREE.DeviceOrientationControls(camera, true);
  controls.connect();
  controls.update();

  window.removeEventListener('deviceorientation', setOrientationControls, true);

  renderer.domElement.addEventListener('click', function () {

      if (this.requestFullscreen) {
          this.requestFullscreen();
      } else if (this.msRequestFullscreen) {
          this.msRequestFullscreen();
      } else if (this.mozRequestFullScreen) {
          this.mozRequestFullScreen();
      } else if (this.webkitRequestFullscreen) {
          this.webkitRequestFullscreen();
      }

  });

  renderer = new THREE.StereoEffect(renderer);
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove( event ) {
  mouseX = ( event.clientX - windowHalfX ) / 2;
  mouseY = ( event.clientY - windowHalfY ) / 2;
}

function init() {

  // setup
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000);

  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(1, 1, 1);
  camera.focalLength = camera.position.distanceTo(scene.position);
  camera.lookAt(scene.position);

  controls = new THREE.OrbitControls(camera);
  controls.autoRotate = false;
  controls.enablePan = false;

  // central sphere
  var material = new THREE.MeshNormalMaterial({
    side: THREE.DoubleSide, 
    wireframe: true
  });

  var geometry = new THREE.SphereGeometry(30, 30, 30);
  sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  // events
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );

  window.addEventListener('deviceorientation', setOrientationControls, true);
  window.addEventListener('resize', onWindowResize, false);

}

function render() {
  controls.update();
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  render();  
}
