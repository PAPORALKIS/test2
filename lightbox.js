document.addEventListener("DOMContentLoaded", function () {
  const zoomables = document.querySelectorAll('.realisation-image');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  zoomables.forEach(img => {
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      lightboxImg.src = img.src;
      lightbox.style.display = 'flex';
    });
  });

  lightbox.addEventListener('click', function () {
    lightbox.style.display = 'none';
    lightboxImg.src = '';
  });
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.style.display === 'flex') {
    lightbox.style.display = 'none';
    lightboxImg.src = '';
  }
});
