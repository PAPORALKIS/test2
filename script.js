document.addEventListener("DOMContentLoaded", () => {
  const sphere = document.getElementById("sphere");
  const globe = document.getElementById("globe");
  const images = [
    "img/meuble-laura-1.jpg", "img/meuble-laura-2.jpg", "img/meuble-laura-3.jpg",
    "img/iso1.jpg", "img/Iso2.jpg", "img/Iso3.jpg", "img/Iso4.jpg", "img/Iso5.jpg",
    "img/ext1.jpg", "img/ext2.jpg",
    "img/CUIEXT4.jpg", "img/CUIEXT5.jpg", "img/CUIEXT6.jpg",
    "img/SDB1.jpg", "img/SDB2.jpg", "img/SDB3.jpg", "img/SDB4.jpg", "img/SDB5.jpg", "img/WC1.jpg", "img/WC2.jpg",
    "img/DRESSMARS1.jpg", "img/DRESSMARS2.jpg", "img/DRESSMARS3.jpg", "img/DRESSMARS4.jpg",
    "img/CUIMARS1.jpg", "img/CUIMARS2.jpg", "img/CUIMARS3.jpg", "img/CUIMARS4.jpg",
    "img/CHBR0.jpg", "img/CHBR1.jpg"
  ];

  const total = images.length;
  const radius = 250;
  const thetaInc = 360 / total;

  // Place images on a sphere
  images.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.classList.add("image3D");

    const phi = Math.acos(-1 + (2 * i) / total);
    const theta = Math.sqrt(total * Math.PI) * phi;

    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);

    img.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;

    img.addEventListener("click", (e) => {
      e.stopPropagation();
      document.getElementById("lightbox-img").src = img.src;
      document.getElementById("lightbox").style.display = "flex";
    });

    sphere.appendChild(img);
  });

  window.closeLightbox = () => {
    document.getElementById("lightbox").style.display = "none";
    document.getElementById("lightbox-img").src = "";
  };

  // Rotation on drag
  let isDragging = false;
  let previousX, previousY;
  let rotationX = 0;
  let rotationY = 0;

  const rotate = () => {
    sphere.style.transform = `translate(-50%, -50%) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
  };

  globe.addEventListener("mousedown", (e) => {
    isDragging = true;
    previousX = e.clientX;
    previousY = e.clientY;
  });

  globe.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - previousX;
    const deltaY = e.clientY - previousY;
    rotationY += deltaX * 0.3;
    rotationX -= deltaY * 0.3;
    previousX = e.clientX;
    previousY = e.clientY;
    rotate();
  });

  globe.addEventListener("mouseup", () => isDragging = false);
  globe.addEventListener("mouseleave", () => isDragging = false);

  // Touch support
  globe.addEventListener("touchstart", (e) => {
    isDragging = true;
    previousX = e.touches[0].clientX;
    previousY = e.touches[0].clientY;
  });

  globe.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - previousX;
    const deltaY = e.touches[0].clientY - previousY;
    rotationY += deltaX * 0.3;
    rotationX -= deltaY * 0.3;
    previousX = e.touches[0].clientX;
    previousY = e.touches[0].clientY;
    rotate();
  });

  globe.addEventListener("touchend", () => isDragging = false);
});

// Lightbox
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll('.realisation-image');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  images.forEach(img => {
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      lightboxImg.src = img.src;
      lightbox.style.display = 'flex';
    });
  });

  lightbox.addEventListener('click', () => {
    lightbox.style.display = 'none';
    lightboxImg.src = '';
  });
});

// Globe 3D interaction
const canvas = document.getElementById('globeCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const radius = 200;
let angleX = 0;
let angleY = 0;

const dots = [];

const imagesSrc = [
  "img/meuble-laura-1.jpg", "img/meuble-laura-2.jpg", "img/meuble-laura-3.jpg",
  "img/iso1.jpg", "img/Iso2.jpg", "img/Iso3.jpg",
  "img/ext1.jpg", "img/ext2.jpg",
  "img/CUIEXT4.jpg", "img/SDB1.jpg",
  "img/WC1.jpg", "img/DRESSMARS1.jpg", "img/CUIMARS1.jpg",
  "img/CHBR0.jpg"
];

// Create dots with image
for (let i = 0; i < imagesSrc.length; i++) {
  const phi = Math.acos(-1 + (2 * i + 1) / imagesSrc.length);
  const theta = Math.sqrt(imagesSrc.length * Math.PI) * phi;

  const x = radius * Math.cos(theta) * Math.sin(phi);
  const y = radius * Math.sin(theta) * Math.sin(phi);
  const z = radius * Math.cos(phi);

  const img = new Image();
  img.src = imagesSrc[i];
  dots.push({ x, y, z, img });
}

// Animation
function draw() {
  ctx.clearRect(0, 0, width, height);
  const centerX = width / 2;
  const centerY = height / 2;

  dots.forEach(dot => {
    // 3D rotation
    let x = dot.x * Math.cos(angleY) - dot.z * Math.sin(angleY);
    let z = dot.x * Math.sin(angleY) + dot.z * Math.cos(angleY);
    let y = dot.y * Math.cos(angleX) - z * Math.sin(angleX);
    z = dot.y * Math.sin(angleX) + z * Math.cos(angleX);

    const scale = 300 / (300 + z);
    const x2d = x * scale + centerX;
    const y2d = y * scale + centerY;

    const size = 40 * scale;
    try {
      ctx.drawImage(dot.img, x2d - size / 2, y2d - size / 2, size, size);
    } catch (e) {
      // handle loading errors
    }

    dot.x = x;
    dot.y = y;
    dot.z = z;
  });

  angleY += 0.002;
  angleX += 0.001;

  requestAnimationFrame(draw);
}

draw();

// Resize handler
window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});
