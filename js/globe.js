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
camera.position.z = 5;

const sphereGeometry = new THREE.SphereGeometry(1.2, 32, 32);
const sphereMaterial = new THREE.MeshNormalMaterial({ wireframe: true });
const globe = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(globe);

const orbitRadius = 3;
const orbitingCards = [];

function createCardPlanes() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card, index) => {
    html2canvas(card).then(canvasImg => {
      const texture = new THREE.CanvasTexture(canvasImg);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true
      });
      const geometry = new THREE.PlaneGeometry(2, 1.5);
      const mesh = new THREE.Mesh(geometry, material);

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      const x = orbitRadius * Math.sin(phi) * Math.cos(theta);
      const y = orbitRadius * Math.cos(phi);
      const z = orbitRadius * Math.sin(phi) * Math.sin(theta);

      mesh.position.set(x, y, z);
      mesh.lookAt(0, 0, 0);
      scene.add(mesh);

      orbitingCards.push({
        mesh,
        theta,
        phi,
        speed: 0.002 + Math.random() * 0.003
      });
    });
  });
}

window.addEventListener("load", () => {
  createCardPlanes(); // Lancer seulement après que tout soit chargé
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

  globe.rotation.y += 0.0015;
  globe.rotation.x += 0.001;

  orbitingCards.forEach(obj => {
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
