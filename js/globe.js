import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = document.getElementById("globe-container");
const navHeight = 60;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / (container.clientHeight - navHeight), 0.1, 1000);
camera.position.set(0, 0, 6);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight - navHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

// Logo central
const logoTexture = new THREE.TextureLoader().load("img/logo.png");
const logoMaterial = new THREE.SpriteMaterial({ map: logoTexture });
const logoSprite = new THREE.Sprite(logoMaterial);
logoSprite.scale.set(1.5, 1.5, 1);
scene.add(logoSprite);

// Variables globales
let sprites = [];
let spherePoints = [];

// Fonctions utilitaires

function getResponsivePlaneSize() {
  const width = window.innerWidth;
  if (width < 480) return 1.2;    // Smartphone
  if (width < 768) return 1.5;    // Petite tablette / smartphone paysage
  if (width < 1024) return 1.8;   // Tablette
  return 2.2;                     // Desktop
}

function getResponsiveRadius() {
  const width = window.innerWidth;
  if (width < 480) return 2.5;
  if (width < 768) return 3.5;
  if (width < 1024) return 4.5;
  return 5.5;
}

function getAdaptiveRadius(numImages) {
  const base = getResponsiveRadius();
  return base + Math.log(numImages) * 0.5;  // Ajustement doux selon nb images
}

function generatePointsOnSphere(numPoints, radius) {
  const points = [];
  for(let i = 0; i < numPoints; i++) {
    const theta = Math.acos(-1 + (2 * i) / numPoints);
    const phi = Math.sqrt(numPoints * Math.PI) * theta;
    const x = radius * Math.cos(phi) * Math.sin(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(theta);
    points.push(new THREE.Vector3(x, y, z));
  }
  return points;
}

function updatePositions() {
  if (!sprites.length) return;
  const radius = getAdaptiveRadius(sprites.length);
  const planeSize = getResponsivePlaneSize();
  spherePoints = generatePointsOnSphere(sprites.length, radius);
  sprites.forEach((sprite, i) => {
    sprite.scale.set(planeSize, planeSize, 1);
    sprite.position.copy(spherePoints[i]);
    sprite.lookAt(new THREE.Vector3(0, 0, 0));
  });
  // Position caméra selon la taille globale
  camera.position.set(0, 0, radius + planeSize * 2.5);
  controls.update();
}

// Création des sprites images
function createSprites(imagePaths) {
  const textureLoader = new THREE.TextureLoader();
  sprites = [];
  imagePaths.forEach((path, index) => {
    textureLoader.load(path, texture => {
      const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(material);
      scene.add(sprite);
      sprites.push(sprite);
      updatePositions();
    });
  });
}

// Charger les images JSON
fetch("img/images.json")
  .then(response => response.json())
  .then(images => {
    const imagePaths = images.map(name => `img/${name}`);
    createSprites(imagePaths);
  })
  .catch(error => {
    console.error("Erreur de chargement des images :", error);
  });

// Controls avec rotation auto et manuelle
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.5;
controls.minDistance = 5;
controls.maxDistance = 30;

// Animation
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Gestion resize + orientationchange
function onResize() {
  const width = window.innerWidth;
  const height = window.innerHeight - navHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  updatePositions();

  renderer.setSize(width, height);
}
window.addEventListener("resize", onResize);
window.addEventListener("orientationchange", () => setTimeout(onResize, 300));
