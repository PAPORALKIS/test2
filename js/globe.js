import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('globe-container');
  const canvas = document.getElementById('globeCanvas');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight, false);

  // Lumière ambiante
  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  // Essai de charger une texture depuis ton dossier img
  const textureLoader = new THREE.TextureLoader();
  textureLoader.setCrossOrigin('anonymous');

  const imagePath = 'img/17482128810553663420141290975132.jpg';

  textureLoader.load(
    imagePath,
    (texture) => {
      console.log('Texture chargée avec succès');

      // Sprite avec texture
      const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(2, 2, 1);  // Ajuste la taille
      sprite.position.set(0, 0, 0);
      scene.add(sprite);
    },
    undefined,
    (error) => {
      console.error('Erreur de chargement de la texture:', error);

      // Fallback : sphère verte si texture ne charge pas
      const geometry = new THREE.SphereGeometry(1.5, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
    }
  );

  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);
    scene.rotation.y += 0.005;
    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight, false);
  });
});
