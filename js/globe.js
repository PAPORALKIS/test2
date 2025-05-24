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

const sphereGeometry = new THREE.SphereGeometry(1.2, 32, 32);
const sphereMaterial = new THREE.MeshNormalMaterial({ wireframe: true });
const globe = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(globe);

// Liste des images
const textures = [
  'img/meuble-laura-1.jpg',
  'img/Iso2.jpg',
  'img/ext1.jpg',
  'img/CUIEXT5.jpg',
  'img/SDB3.jpg',
  'img/DRESSMARS1.jpg',
  'img/WC1.jpg',
  'img/CHBR1.jpg'
];

const loader = new THREE.TextureLoader();
const orbitRadius = 2.2;
const orbitingImages = [];

textures.forEach((imgSrc, index) => {
  loader.load(imgSrc, texture => {
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true });
    const geometry = new THREE.PlaneGeometry(0.7, 0.5);
    const imageMesh = new THREE.Mesh(geometry, material);

    // Position aléatoire sur la sphère
    const theta = Math.random() * Math.PI * 2; // longitude
    const phi = Math.random() * Math.PI; // latitude

    const x = orbitRadius * Math.sin(phi) * Math.cos(theta);
    const y = orbitRadius * Math.cos(phi);
    const z = orbitRadius * Math.sin(phi) * Math.sin(theta);

    imageMesh.position.set(x, y, z);
    imageMesh.lookAt(0, 0, 0);

    scene.add(imageMesh);
    orbitingImages.push({ mesh: imageMesh, theta, phi, speed: 0.002 + Math.random() * 0.003 });
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

  orbitingImages.forEach(obj => {
    obj.theta += obj.speed;

    const x = orbitRadius * Math.sin(obj.phi) * Math.cos(obj.theta);
    const y = orbitRadius * Math.cos(obj.phi);
    const z = orbitRadius * Math.sin(obj.phi) * Math.sin(obj.theta);

    obj.mesh.position.set(x, y, z);
    obj.mesh.lookAt(0, 0, 0);
  });

  renderer.render(scene, camera);
}

animate();
