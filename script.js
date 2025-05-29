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

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
// change la couleur du fond
renderer.setClearColor(0x0a0f2c); // 👈 bleu foncé
document.getElementById('container').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
// rotation vitesse
controls.autoRotateSpeed = 10;

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
];

// Pour garder les planes et données associés
const planes = [];

imagesData.forEach((imgData) => {
loader.load(imgData.url, (texture) => {
const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true });
// diametre globe
const geometry = new THREE.PlaneGeometry(3, 3);
const plane = new THREE.Mesh(geometry, material);

// Position sur sphère radius 3.5 (plus petit)  
const phi = Math.acos(2 * Math.random() - 1);  
const theta = 2 * Math.PI * Math.random();  
// taille du globe  
const radius = 1;  
const x = radius * Math.sin(phi) * Math.cos(theta);  
const y = radius * Math.sin(phi) * Math.sin(theta);  
const z = radius * Math.cos(phi);  

plane.position.set(x, y, z);  
plane.lookAt(0, 0, 0);  

// Ajoute dans la scène  
scene.add(plane);  

// Stocke plane et ses infos  
planes.push({ mesh: plane, data: imgData });

});
});

function onMouseClick(event) {
// Calcul mouse coords normalisées (-1,+1)
mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

raycaster.setFromCamera(mouse, camera);
const intersects = raycaster.intersectObjects(planes.map(p => p.mesh));

if (intersects.length > 0) {
const clickedMesh = intersects[0].object;
const clickedData = planes.find(p => p.mesh === clickedMesh).data;

// Trouve toutes les images du même groupe  
const groupKey = clickedData.group;  
let groupImages;  
if (groupKey) {  
  groupImages = imagesData.filter(img => img.group === groupKey);  
} else {  
  groupImages = [clickedData];  
}  

openPreview(groupImages);

}
}

window.addEventListener('click', onMouseClick);

// Gestion du carrousel dans l’aperçu
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
//document.getElementById('container').style.transform = 'translateX(-35vw)';
//document.getElementById('container').style.transform = 'blur(5px)';
const container = document.getElementById('container');
container.style.filter = 'blur(5px)';
//container.style.transform = 'translateX(-35vw)';

}

function showImage(index) {
if (index < 0) index = currentGroup.length - 1;
if (index >= currentGroup.length) index = 0;
currentIndex = index;

carouselImage.src = currentGroup[index].url;
carouselText.textContent = currentGroup[index].text;
}

prevBtn.addEventListener('click', () => {
showImage(currentIndex - 1);
});

nextBtn.addEventListener('click', () => {
showImage(currentIndex + 1);
});

closePreviewBtn.addEventListener('click', () => {
preview.style.display = 'none';
// document.getElementById('container').style.transform = 'translateX(0)';
const container = document.getElementById('container');
container.style.filter = 'none';
//container.style.transform = 'none';

});

// Rendu et animation
function animate() {
requestAnimationFrame(animate);
controls.update();
renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();

renderer.setSize(window.innerWidth * 0.65, window.innerHeight);
});

animate();

\

