import * as THREE from 'three';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('globe-container');
  const canvas = document.getElementById('globeCanvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  
  const radius = 3;
  const imageSize = 0.7;

  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  // Liste des images à afficher sur la sphère, remplace avec tes vraies images
  const imagePaths = [
    'img/17482128810553663420141290975132.jpg',
    'img/logo.png',
    'img/CHBR1.jpg// exemple, tu peux mettre plusieurs images',
    // Ajoute ici d'autres images si tu veux
  ];

  // Générer des positions bien espacées sur une sphère
  function generatePositions(n, radius, minDist) {
    const positions = [];
    let attempts = 0;
    while (positions.length < n && attempts < 10000) {
      attempts++;
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

  const positions = generatePositions(imagePaths.length, radius, 1.5);

  const textureLoader = new THREE.TextureLoader();

  // Création des sprites pour chaque image
  imagePaths.forEach((path, index) => {
    textureLoader.load(path, texture => {
      const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(imageSize, imageSize, 1);
      sprite.position.copy(positions[index]);
      sprite.userData = { src: path }; // utile pour la lightbox
      scene.add(sprite);

      // Interaction click
      sprite.onClick = () => {
        const event = new CustomEvent('openLightbox', {
          detail: { src: path, description: `Image : ${path}` }
        });
        window.dispatchEvent(event);
      };
    });
  });

  camera.position.z = 8;

  // Raycaster pour interaction clics
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onClick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
      const obj = intersects[0].object;
      if (obj.onClick) obj.onClick();
    }
  }

  renderer.domElement.addEventListener('click', onClick);

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
