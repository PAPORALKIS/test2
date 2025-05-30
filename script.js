// document.addEventListener("DOMContentLoaded", function () {
//   const zoomables = document.querySelectorAll('.realisation-image');
//   const lightbox = document.getElementById('lightbox');
//   const lightboxImg = document.getElementById('lightbox-img');

//   zoomables.forEach(img => {
//     img.addEventListener('click', (e) => {
//       e.stopPropagation();
//       lightboxImg.src = img.src;
//       lightbox.style.display = 'flex';
//     });
//   });

//   lightbox.addEventListener('click', function () {
//     lightbox.style.display = 'none';
//     lightboxImg.src = '';
//   });
// });


import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Rayon responsive basé sur la taille de l'écran
function getResponsiveRadius() {
  const width = window.innerWidth;
  if (width < 480) return 3;
  if (width < 768) return 4;
  if (width < 1024) return 5;
  return 6;
}

// Repositionne toutes les images avec le bon rayon
function updatePositions() {
  const radius = getResponsiveRadius();
  planes.forEach(({ mesh }) => {
    const phi = Math.acos(2 * Math.random() - 1);
    const theta = 2 * Math.PI * Math.random();
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    mesh.position.set(x, y, z);
    mesh.lookAt(0, 0, 0);
  });
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x0a0f2c); // 👈 fond bleu foncé

document.getElementById('container').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 3; // 👈 vitesse de rotation

const loader = new THREE.TextureLoader();

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Données images avec groupes et textes associés
const imagesData = [
  { url: '../img/CHBR0.jpg', text: 'Image 0 - Description', group: 'A' },
  { url: '../img/CHBR1.jpg', text: 'Image 2 - Description', group: 'A' },
  { url: '../img/CUIEXT.jpg', text: 'Image 3 - Description', group: 'B' },
  { url: '../img/CUIEXT1.jpg', text: 'Image 4 - Description', group: 'B' },
  { url: '../img/CUIEXT2.jpg', text: 'Image 5 - Description', group: 'C' },
  { url: '../img/CUIEXT3.jpg', text: 'Image 6 - Description', group: 'C' },
  { url: '../img/CUIEXT4.jpg', text: 'Image 7 - Description', group: null },
  { url: '../img/CUIEXT5.jpg', text: 'Image 8 - Description', group: null },
  { url: '../img/CUIEXT6.jpg', text: 'Image 8 - Description', group: null },
  { url: '../img/CUIMARS1.jpg', text: 'Image 8 - Description', group: null },
  { url: '../img/CUIMARS2.jpg', text: 'Image 8 - Description', group: null },
  { url: '../img/CUIMARS3.jpg', text: 'Image 8 - Description', group: null },
  { url: '../img/CUIMARS4.jpg', text: 'Image 8 - Description', group: null },
  { url: '../img/Iso2.jpg', text: 'Image 8 - Description', group: null },
  { url: '../img/Iso3.jpg', text: 'Image 8 - Description', group: null },
  { url: '../img/Iso4.jpg', text: 'Image 8 - Description', group: null },
  { url: '../img/Iso5.jpg', text: 'Image 8 - Description', group: null },
  { url: '../img/Iso6.jpg', text: 'Image 8 - Description', group: null },
  { url: '../img/SDB1.jpg', text: 'Image 8 - Description', group: null },
  { url: '../img/SDB2.jpg', text: 'Image 8 - Description', group: null },
  { url: '../img/SDB3.jpg', text: 'Image 8 - Description', group: null },
  { url: '../img/SDB4.jpg', text: 'Image 8 - Description', group: null },
  { url: '../img/SDB5.jpg', text: 'Image 8 - Description', group: null },
  { url: '../img/WC1.jpg', text: 'Image 8 - Description', group: null },
  { url: '../img/WC2.jpg', text: 'Image 8 - Description', group: null },
  { url: '../cuisine_exterieure_cyporex.jpg', text: 'Image 8 - Description', group: null },
  { url: '../img/ext1.jpg', text: 'Image 8 - Description', group: null },
  { url: '../img/ext2.jpg', text: 'Image 8 - Description', group: null },
  { url: '../img/exterieur.jpg', text: 'Image 8 - Description', group: null },
  { url: '../img/Iso1.jpg', text: 'Image 8 - Description', group: null },
  { url: '../meuble-laura-1.jpg', text: 'Image 8 - Description', group: null },
  { url: '../meuble-laura-2.jpg', text: 'Image 8 - Description', group: null },
];

const planes = [];

// Création des meshes et positionnement initial
imagesData.forEach((imgData) => {
  loader.load(imgData.url, (texture) => {
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true });
    const geometry = new THREE.PlaneGeometry(3, 3); // taille image
    const plane = new THREE.Mesh(geometry, material);

    const phi = Math.acos(2 * Math.random() - 1);
    const theta = 2 * Math.PI * Math.random();
    const radius = getResponsiveRadius();
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    plane.position.set(x, y, z);
    plane.lookAt(0, 0, 0);

    scene.add(plane);
    planes.push({ mesh: plane, data: imgData });
  });
});

// Clic pour ouvrir preview
function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planes.map(p => p.mesh));

  if (intersects.length > 0) {
    const clickedMesh = intersects[0].object;
    const clickedData = planes.find(p => p.mesh === clickedMesh).data;
    const groupKey = clickedData.group;
    let groupImages = groupKey ? imagesData.filter(img => img.group === groupKey) : [clickedData];
    openPreview(groupImages);
  }
}

window.addEventListener('click', onMouseClick);

// Gestion du carrousel preview
const preview = document.getElementById('preview');
const carouselImage = document.getElementById('carousel-image');
const carouselText = document.getElementById('carousel-text');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const closePreviewBtn = document.getElementById('close-preview');

let currentGroup = [];
let currentIndex = 0;

function openPreview(groupImages) {
  currentGroup = groupImages;
  currentIndex = 0;
  showImage(currentIndex);
  preview.style.display = 'flex';
  document.getElementById('container').style.filter = 'blur(5px)';
}

function showImage(index) {
  if (index < 0) index = currentGroup.length - 1;
  if (index >= currentGroup.length) index = 0;
  currentIndex = index;
  carouselImage.src = currentGroup[index].url;
  carouselText.textContent = currentGroup[index].text;
}

prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
closePreviewBtn.addEventListener('click', () => {
  preview.style.display = 'none';
  document.getElementById('container').style.filter = 'none';
});

// Animation & mise à jour
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  updatePositions(); // 👈 repositionnement responsive
});

animate();
