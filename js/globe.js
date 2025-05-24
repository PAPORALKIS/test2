console.log("globe.js chargé");

const canvas = document.getElementById("globeCanvas");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  1000
);
camera.position.z = 4;

// Sphère centrale
const sphereGeometry = new THREE.SphereGeometry(1.2, 32, 32);
const sphereMaterial = new THREE.MeshNormalMaterial({ wireframe: true });
const globe = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(globe);

// Images à orbiter autour du globe
const textures = [
  'img/meuble-laura-1.jpg',
  'img/Iso2.jpg',
  'img/ext1.jpg',
  'img/CUIEXT5.jpg',
  'img/SDB3.jpg',
  'img/DRESSMARS1.jpg'
];

const loader = new THREE.TextureLoader();
const orbitRadius = 2.2;
const orbitingImages = [];

textures.forEach((imgSrc, index) => {
  loader.load(imgSrc, texture => {
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
    const geometry = new THREE.PlaneGeometry(0.8, 0.6);
    const imageMesh = new THREE.Mesh(geometry, material);

    scene.add(imageMesh);
    orbitingImages.push({ mesh: imageMesh, angle: (index / textures.length) * Math.PI * 2 });
  });
});

function resizeRendererToDisplaySize() {
  const width = canvas.clientWidth * window.devicePixelRatio;
  const height = canvas.clientHeight * window.devicePixelRatio;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

function animate() {
  requestAnimationFrame(animate);

  if (resizeRendererToDisplaySize()) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  globe.rotation.y += 0.002;
  globe.rotation.x += 0.001;

  // Rotation des images
  orbitingImages.forEach((obj, i) => {
    obj.angle += 0.002;
    const x = orbitRadius * Math.cos(obj.angle);
    const y = orbitRadius * Math.sin(obj.angle);
    obj.mesh.position.set(x, y, 0);
    obj.mesh.lookAt(0, 0, 0);
  });

  renderer.render(scene, camera);
}

animate();
