import * as THREE from 'three';
import html2canvas from 'html2canvas';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('globe-container');
  const canvas = document.getElementById('globeCanvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);

  // Fond gris clair pour voir si rendu actif
  scene.background = new THREE.Color(0xf0f0f0);

  const radius = 3;
  const imageSize = 0.8;

  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  const images = Array.from(document.querySelectorAll('.realisation-image'));
  if (images.length === 0) {
    console.error("Aucune image .realisation-image détectée !");
    return;
  }

  // Génère des positions bien espacées sur une sphère
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
    console.log("Traitement image :", img.src);
    html2canvas(img).then(canvas => {
      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(imageSize, imageSize, 1);
      sprite.position.copy(positions[index]);
      scene.add(sprite);

      // Clic sur sprite ouvre lightbox
      sprite.userData = { description: img.nextElementSibling?.innerHTML || "", src: img.src };
      sprite.onClick = () => openLightbox(sprite.userData.src, sprite.userData.description);
    });
    img.style.display = 'none'; // cacher les images HTML
  });

  camera.position.set(0, 0, 8);
  camera.lookAt(0, 0, 0);

  // Raycaster pour interaction clic
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let clickableSprites = [];

  // Collecte sprites après un délai (car async html2canvas)
  setTimeout(() => {
    clickableSprites = scene.children.filter(obj => obj.type === 'Sprite');
  }, 1500);

  // Gestion clic souris sur canvas
  function onClick(event) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clickableSprites);

    if (intersects.length > 0) {
      const sprite = intersects[0].object;
      if (sprite.onClick) sprite.onClick();
    }
  }
  canvas.addEventListener('click', onClick);

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

  // Fonction lightbox (communique avec lightbox.js)
  function openLightbox(src, description) {
    const event = new CustomEvent('openLightbox', { detail: { src, description } });
    window.dispatchEvent(event);
  }
});
