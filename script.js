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
