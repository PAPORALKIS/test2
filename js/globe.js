import * as THREE from 'three';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('globe-container');
  const canvas = document.getElementById('globeCanvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);

  const radius = 3;
  const imageSize = 0.7;

  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  const images = Array.from(document.querySelectorAll('.realisation-image'));

  // Fonction pour générer des coordonnées bien espacées
  function generatePositions(n, radius, minDist) {
    const positions = [];

    while (positions.length < n && positions.length < 1000) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const newPos = new THREE.Vector3(x, y, z);

      if (positions.every(p => p.distanceTo(newPos) > minDist)) {
        positions.push(newPos);
      }
    }

    return positions;
  }

  const positions = generatePositions(images.length, radius, 1.5);

  images.forEach((img, index) => {
    html2canvas(img).then(canvas => {
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(imageSize, imageSize, 1);
      sprite.position.copy(positions[index]);
      scene.add(sprite);
    });
    img.style.display = 'none'; // cacher les images HTML
  });

  camera.position.z = 8;

  function animate() {
    requestAnimationFrame(animate);
    scene.rotation.y += 0.003;
    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
});
