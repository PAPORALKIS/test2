const canvas = document.getElementById("globeCanvas");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
camera.position.z = 3;

const sphereGeometry = new THREE.SphereGeometry(1.2, 32, 32);
const sphereMaterial = new THREE.MeshNormalMaterial({ wireframe: true });
const globe = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(globe);

function animate() {
  requestAnimationFrame(animate);
  globe.rotation.y += 0.002;
  globe.rotation.x += 0.001;
  renderer.render(scene, camera);
}

animate();

// Responsive
window.addEventListener("resize", () => {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
