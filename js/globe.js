import * as THREE from 'three';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('globe-container');
  const canvas = document.getElementById('globeCanvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);

  const radius = 3;
  const imageSize = 0.7;

  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  const textureLoader = new THREE.TextureLoader();
  textureLoader.load('img/17482128810553663420141290975132.jpg', texture => {
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(imageSize, imageSize, 1);
    sprite.position.set(0, 0, 0); // position au centre
    scene.add(sprite);
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
