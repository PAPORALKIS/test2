import * as THREE from 'https://cdn.skypack.dev/three';

const container = document.getElementById('globe-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Lumière
const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

// Chargement du logo central
const loader = new THREE.TextureLoader();
loader.load('img/logo.png', (texture) => {
  const logoMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const logo = new THREE.Sprite(logoMaterial);
  logo.scale.set(1.5, 1.5, 1);
  logo.position.set(0, 0, 0);
  scene.add(logo);
});

// Fonction pour créer les sprites en sphère
function createSprites(imagePaths) {
  const textureLoader = new THREE.TextureLoader();
  const radius = 3;
  const imageSize = 1;
  const total = imagePaths.length;

  imagePaths.forEach((path, index) => {
    textureLoader.load(path, (texture) => {
      const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(material);

      const theta = Math.acos(-1 + (2 * index) / total);
      const phi = Math.sqrt(total * Math.PI) * theta;

      const x = radius * Math.cos(phi) * Math.sin(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(theta);

      sprite.position.set(x, y, z);
      sprite.scale.set(imageSize, imageSize, 1);
      scene.add(sprite);
    });
  });
}

// Chargement dynamique des images depuis le fichier JSON
fetch('img/images.json')
  .then(response => response.json())
  .then(images => {
    const imagePaths = images
      .filter(name => name !== 'logo.png') // On évite de remettre le logo
      .map(name => `img/${name}`);
    createSprites(imagePaths);
  })
  .catch(error => {
    console.error('Erreur de chargement des images :', error);
  });

// Animation
function animate() {
  requestAnimationFrame(animate);
  scene.rotation.y += 0.0015;
  renderer.render(scene, camera);
}
animate();

// Redimensionnement responsive
window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});
