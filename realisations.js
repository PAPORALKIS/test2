const container = document.getElementById('container');

const scene    = new THREE.Scene();
const camera   = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x0a0f2c);
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.5;
controls.enableZoom = true;
controls.enablePan = false;

camera.position.set(0, 0, 20);
scene.add(new THREE.AmbientLight(0xffffff, 1));

// Charger logo central
const loader = new THREE.TextureLoader();
let logoMesh;

loader.load('img/logo.jpg', texture => {
  const size = 3;
  const geo = new THREE.PlaneGeometry(size, size);
  const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
  logoMesh = new THREE.Mesh(geo, mat);
  logoMesh.position.set(0, 0, 0);
  scene.add(logoMesh);
});

// Liste des images dans /img/
const imagesData = [
  'CHBR0.jpg','CHBR1.jpg','CUIEXT.jpg','CUIEXT1.jpg','CUIEXT2.jpg','CUIEXT3.jpg','CUIEXT4.jpg','CUIEXT5.jpg','CUIEXT6.jpg',
  'CUIMARS1.jpg','CUIMARS2.jpg','CUIMARS3.jpg','CUIMARS4.jpg','Iso2.jpg','Iso3.jpg','Iso4.jpg','Iso5.jpg','Iso6.jpg',
  'SDB1.jpg','SDB2.jpg','SDB3.jpg','SDB4.jpg','SDB5.jpg','WC1.jpg','WC2.jpg','cuisine_exterieure_cyporex.jpg',
  'ext1.jpg','ext2.jpg','exterieur.jpg','Iso1.jpg',
  'meuble-laura-1.jpg','meuble-laura-2.jpg','meuble-laura-3.jpg',
  'martegauxavant1.jpg','martegauxavant2.jpg','martegauxavant3.jpg','martegauxB.jpg','martegauxC.jpg','martegauxD.jpg','martegauxE.jpg',
  'velaux0.jpg','velaux1.jpg','velaux2.jpg','velaux3.jpg'
];

const planes = [];

function generateSpherePoints(num, radius) {
  const points = [];
  const offset = 2 / num;
  const increment = Math.PI * (3 - Math.sqrt(5));
  for(let i = 0; i < num; i++) {
    const y = ((i * offset) - 1) + (offset/2);
    const r = Math.sqrt(1 - y*y);
    const phi = i * increment;
    const x = Math.cos(phi) * r;
    const z = Math.sin(phi) * r;
    points.push(new THREE.Vector3(x*radius, y*radius, z*radius));
  }
  return points;
}

function getPlaneSize() {
  const minDim = Math.min(window.innerWidth, window.innerHeight);
  return THREE.MathUtils.clamp(minDim/120, 1.5, 5);
}

function getRadius(numImages, planeSize) {
  return planeSize * Math.sqrt(numImages / (4 * Math.PI * 0.3)) * 1.2;
}

function updatePositions() {
  const planeSize = getPlaneSize();
  const radius = getRadius(planes.length, planeSize);
  const points = generateSpherePoints(planes.length, radius);
  planes.forEach((p, i) => {
    p.mesh.geometry.dispose();
    p.mesh.geometry = new THREE.PlaneGeometry(planeSize, planeSize);
    p.mesh.position.copy(points[i]);
    p.mesh.lookAt(0, 0, 0);
  });
  camera.position.z = radius * 3;
  controls.minDistance = radius * 1.5;
  controls.maxDistance = radius * 5;
}

function loadImages() {
  const loader = new THREE.TextureLoader();
  imagesData.forEach((fileName, i) => {
    loader.load(`img/${fileName}`, texture => {
      const planeSize = getPlaneSize();
      const geometry = new THREE.PlaneGeometry(planeSize, planeSize);
      const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
      planes.push({ mesh, fileName });
      updatePositions();
    });
  });
}

loadImages();

// Raycaster pour clic sur images
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planes.map(p => p.mesh));
  if(intersects.length > 0) {
    const mesh = intersects[0].object;
    const index = planes.findIndex(p => p.mesh === mesh);
    if(index !== -1) openPreview(index);
  }
}

window.addEventListener('click', onClick, false);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  updatePositions();
});

// ---------- Modal / Carrousel ---------- //

const preview = document.getElementById('preview');
const carouselImage = document.getElementById('carousel-image');
const carouselText = document.getElementById('carousel-text');
const closeBtn = document.getElementById('close-preview');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let currentIndex = -1;

function openPreview(index) {
  currentIndex = index;
  const { fileName } = planes[currentIndex];
  carouselImage.src = `img/${fileName}`;
  carouselText.textContent = fileName;
  preview.classList.remove('hidden');
}

function closePreview() {
  preview.classList.add('hidden');
  currentIndex = -1;
}

function showPrev() {
  if(currentIndex === -1) return;
  currentIndex = (currentIndex - 1 + planes.length) % planes.length;
  openPreview(currentIndex);
}

function showNext() {
  if(currentIndex === -1) return;
  currentIndex = (currentIndex + 1) % planes.length;
  openPreview(currentIndex);
}

closeBtn.addEventListener('click', closePreview);
prevBtn.addEventListener('click', showPrev);
nextBtn.addEventListener('click', showNext);
