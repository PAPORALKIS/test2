const canvas = document.getElementById("globeCanvas");
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
camera.position.z = 3;

const sphereGeometry = new THREE.SphereGeometry(1.2, 32, 32);
const sphereMaterial = new THREE.MeshNormalMaterial({ wireframe: true });
const globe = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(globe);

function animate() {
  requestAnimationFrame(animate);
  globe.rotation.y += 0.002;
  globe.rotation.x += 0.001;
  renderer.render(scene, camera);
}

animate();

// Responsive
window.addEventListener("resize", () => {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
// ========== GLOBE INTERACTIF ==========

const canvas = document.getElementById('globeCanvas');
const ctx = canvas.getContext('2d');
let width = canvas.width = canvas.offsetWidth;
let height = canvas.height = canvas.offsetHeight;

let angle = 0;
let radius = width / 2.2;
let centerX = width / 2;
let centerY = height / 2;

// Images à afficher en orbite
const images = [
  'img/realisations/illustration1.png',
  'img/realisations/illustration2.png',
  'img/realisations/illustration3.png',
  'img/realisations/illustration4.png',
  'img/realisations/illustration5.png',
  'img/realisations/illustration6.png'
];

const imageElements = images.map(src => {
  const img = new Image();
  img.src = src;
  return img;
});

function drawGlobe() {
  ctx.clearRect(0, 0, width, height);

  const step = (2 * Math.PI) / imageElements.length;

  imageElements.forEach((img, i) => {
    const x = centerX + radius * Math.cos(angle + i * step);
    const y = centerY + radius * Math.sin(angle + i * step);
    const size = 50;

    ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
  });

  angle += 0.01;
  requestAnimationFrame(drawGlobe);
}

drawGlobe();

// ========== IMAGE AGRANDISSANTE (Lightbox) ==========

const lightbox = document.createElement('div');
lightbox.classList.add('lightbox');
lightbox.innerHTML = '<span class="close">&times;</span><img src="">';
document.body.appendChild(lightbox);

const lightboxImg = lightbox.querySelector('img');
const closeBtn = lightbox.querySelector('.close');

document.querySelectorAll('.realisation-image').forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightbox.style.display = 'flex';
  });
});

closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
});
