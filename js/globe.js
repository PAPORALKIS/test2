import * as THREE from 'three';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('globe-container');
  const canvas = document.getElementById('globeCanvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight, false);

  const radius = 3;
  const imageSize = 0.7;

  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  const images = Array.from(document.querySelectorAll('.realisation-image'));

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
  const textureLoader = new THREE.TextureLoader();

  images.forEach((img, index) => {
    textureLoader.load(img.src, texture => {
      const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(imageSize, imageSize, 1);
      const pos = positions[index].clone().multiplyScalar(1.05);
      sprite.position.copy(pos);
      sprite.userData = {
        src: img.src,
        description: img.dataset.description
      };
      sprite.onClick = () => {
        const event = new CustomEvent('openLightbox', {
          detail: sprite.userData
        });
        window.dispatchEvent(event);
      };
      scene.add(sprite);
    });
    img.style.display = 'none';
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
    renderer.setSize(container.clientWidth, container.clientHeight, false);
  });

  // Gestion du clic sur les sprites
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    for (let i = 0; i < intersects.length; i++) {
      const object = intersects[i].object;
      if (object.onClick) object.onClick();
    }
  });
});
