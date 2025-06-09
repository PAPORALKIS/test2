// script.js

// Liste des réalisations avec image et texte
const realisations = [
  { src: '/img/CHBR0.jpg', texte: "Chambre 0" },
  { src: '/img/CHBR1.jpg', texte: "Chambre 1" },
  { src: '/img/CUIEXT.jpg', texte: "Cuisine Extérieure" },
  { src: '/img/CUIEXT1.jpg', texte: "Cuisine Extérieure 1" },
  { src: '/img/CUIEXT2.jpg', texte: "Cuisine Extérieure 2" },
  { src: '/img/CUIEXT3.jpg', texte: "Cuisine Extérieure 3" },
  { src: '/img/CUIEXT4.jpg', texte: "Cuisine Extérieure 4" },
  { src: '/img/CUIEXT5.jpg', texte: "Cuisine Extérieure 5" },
  { src: '/img/CUIEXT6.jpg', texte: "Cuisine Extérieure 6" },
  { src: '/img/CUIMARS1.jpg', texte: "Cuisine Mars 1" },
  { src: '/img/CUIMARS2.jpg', texte: "Cuisine Mars 2" },
  { src: '/img/CUIMARS3.jpg', texte: "Cuisine Mars 3" },
  { src: '/img/CUIMARS4.jpg', texte: "Cuisine Mars 4" },
  { src: '/img/DRESSMARS1.jpg', texte: "Dressing Mars 1" },
  { src: '/img/DRESSMARS2.jpg', texte: "Dressing Mars 2" },
  { src: '/img/DRESSMARS3.jpg', texte: "Dressing Mars 3" },
  { src: '/img/DRESSMARS4.jpg', texte: "Dressing Mars 4" },
  { src: '/img/Iso2.jpg', texte: "Isolation 2" },
  { src: '/img/Iso3.jpg', texte: "Isolation 3" },
  { src: '/img/Iso4.jpg', texte: "Isolation 4" },
  { src: '/img/Iso5.jpg', texte: "Isolation 5" },
  { src: '/img/Iso6.jpg', texte: "Isolation 6" },
  { src: '/img/SDB1.jpg', texte: "Salle de bain 1" },
  { src: '/img/SDB2.jpg', texte: "Salle de bain 2" },
  { src: '/img/SDB3.jpg', texte: "Salle de bain 3" },
  { src: '/img/SDB4.jpg', texte: "Salle de bain 4" },
  { src: '/img/SDB5.jpg', texte: "Salle de bain 5" },
  { src: '/img/WC1.jpg', texte: "WC 1" },
  { src: '/img/WC2.jpg', texte: "WC 2" },
  { src: '/img/cuisine_exterieure_cyporex.jpg', texte: "Cuisine Extérieure Cyporex" },
  { src: '/img/ext1.jpg', texte: "Extérieur 1" },
  { src: '/img/ext2.jpg', texte: "Extérieur 2" },
  { src: '/img/exterieur.jpg', texte: "Extérieur" },
  { src: '/img/exterieur.png', texte: "Extérieur PNG" },
  { src: '/img/illustration.png', texte: "Illustration" },
  { src: '/img/iso1.jpg', texte: "Isolation 1" },
  { src: '/img/meuble-laura-1.jpg', texte: "Meuble Laura 1" },
  { src: '/img/meuble-laura-2.jpg', texte: "Meuble Laura 2" },
  { src: '/img/meuble-laura-3.jpg', texte: "Meuble Laura 3" },
  { src: '/img/pack.png', texte: "Pack" },
  { src: '/img/packs.jpg', texte: "Packs" },
  { src: '/img/reno_express.jpg', texte: "Reno Express" },
  { src: '/img/reno_express.png', texte: "Reno Express PNG" },
  { src: '/img/reno_exterieure.jpg', texte: "Reno Extérieure" },
  { src: '/img/renovation_interieure.jpg', texte: "Rénovation Intérieure" },
  { src: '/img/renovation_interieure.png', texte: "Rénovation Intérieure PNG" },
  { src: '/img/travaux_quotidien.jpg', texte: "Travaux Quotidien" },
  { src: '/img/logo.png', texte: "Logo Central" },
];

// Variables globales
let scene, camera, renderer, controls;
const container = document.getElementById('container');
const radius = 12; // rayon sphère
const images = [];
const sprites = [];
let selectedIndex = -1;

// Modal & controls
const preview = document.getElementById('preview');
const carouselImage = document.getElementById('carousel-image');
const carouselText = document.getElementById('carousel-text');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const closeBtn = document.getElementById('close-preview');

// Init Three.js
function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0f2c);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.minDistance = 15;
  controls.maxDistance = 50;

  // Logo central en sprite
  const logoTexture = new THREE.TextureLoader().load('/img/logo.png');
  const logoMaterial = new THREE.SpriteMaterial({ map: logoTexture });
  const logoSprite = new THREE.Sprite(logoMaterial);
  logoSprite.scale.set(8, 8, 1);
  scene.add(logoSprite);

  // Créer les sprites images positionnés sur la sphère
  const count = realisations.length - 1; // on ignore le logo (dernier)
  for(let i=0; i<count; i++) {
    const angle = Math.acos(-1 + (2 * i) / (count - 1));
    const phi = Math.sqrt(count * Math.PI) * angle;

    const x = radius * Math.cos(phi) * Math.sin(angle);
    const y = radius * Math.sin(phi) * Math.sin(angle);
    const z = radius * Math.cos(angle);

    const tex = new THREE.TextureLoader().load(realisations[i].src);
    const mat = new THREE.SpriteMaterial({ map: tex });
    const sprite = new THREE.Sprite(mat);
    sprite.position.set(x, y, z);
    sprite.scale.set(4, 4, 1);
    sprite.userData = { index: i };
    scene.add(sprite);
    sprites.push(sprite);
  }

  window.addEventListener('resize', onWindowResize, false);

  // Raycaster pour détection clic
  renderer.domElement.addEventListener('pointerdown', onPointerDown, false);

  animate();
}

// Redimensionnement
function onWindowResize() {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation boucle
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// Gestion clic sur sprite
function onPointerDown(event) {
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(sprites);
  if(intersects.length > 0) {
    const clickedSprite = intersects[0].object;
    openPreview(clickedSprite.userData.index);
  }
}

// Ouvre le modal avec la bonne image et texte
function openPreview(index) {
  selectedIndex = index;
  carouselImage.src = realisations[selectedIndex].src;
  carouselText.textContent = realisations[selectedIndex].texte;
  preview.classList.remove('hidden');
}

// Ferme le modal
function closePreview() {
  preview.classList.add('hidden');
  selectedIndex = -1;
}

// Naviguer dans le carousel
function showPrev() {
  if(selectedIndex > 0) {
    openPreview(selectedIndex - 1);
  }
}
function showNext() {
  if(selectedIndex < realisations.length - 2) { // -1 logo, -1 car index
    openPreview(selectedIndex + 1);
  }
}

// Boutons écouteurs
prevBtn.addEventListener('click', showPrev);
nextBtn.addEventListener('click', showNext);
closeBtn.addEventListener('click', closePreview);

// Escape ferme la preview
window.addEventListener('keydown', (e) => {
  if(e.key === "Escape" && !preview.classList.contains('hidden')) {
    closePreview();
  }
});

// Init page
init();
