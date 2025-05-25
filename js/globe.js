console.log("globe.js chargé (sans globe)");

const canvas = document.getElementById("globeCanvas");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
camera.position.z = 6;

const orbitRadius = 3;
const orbitingImages = [];

function createImagePlanes() {
  const images = document.querySelectorAll(".realisation-image");

  images.forEach((img, index) => {
    html2canvas(img).then(canvasImg => {
      const texture = new THREE.CanvasTexture(canvasImg);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
      });

      const geometry = new THREE.PlaneGeometry(1.2, 0.9);
      const mesh = new THREE.Mesh(geometry, material);

      const theta = (index / images.length) * Math.PI * 2;
      const phi = Math.acos(1 - 2 * (index + 0.5) / images.length);

      const x = orbitRadius * Math.sin(phi) * Math.cos(theta);
      const y = orbitRadius * Math.cos(phi);
      const z = orbitRadius * Math.sin(phi) * Math.sin(theta);

      mesh.position.set(x, y, z);
      mesh.lookAt(0, 0, 0);
      mesh.userData.imgSrc = img.src;

      mesh.cursor = "pointer";
      scene.add(mesh);

      orbitingImages.push({
        mesh,
        theta,
        phi,
        speed: 0.0015 + Math.random() * 0.001
      });
    });
  });
}

window.addEventListener("load", () => {
  createImagePlanes();
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

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onClick(event) {
  const rect = canvas.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(orbitingImages.map(i => i.mesh));

  if (intersects.length > 0) {
    const clicked = intersects[0].object;
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    lightboxImg.src = clicked.userData.imgSrc;
    lightbox.style.display = "flex";
  }
}
canvas.addEventListener("click", onClick);

function animate() {
  requestAnimationFrame(animate);

  if (resizeRendererToDisplaySize()) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  orbitingImages.forEach((obj) => {
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
