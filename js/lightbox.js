document.addEventListener("DOMContentLoaded", function () {
  const zoomables = document.querySelectorAll('.realisation-image');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxDesc = document.getElementById('lightbox-description');

  zoomables.forEach(img => {
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      lightboxImg.src = img.src;

      const card = img.closest('.card');
      const description = card ? card.querySelector('.description')?.innerHTML : '';
      lightboxDesc.innerHTML = description;

      lightbox.style.display = 'flex';
    });
  });

  lightbox.addEventListener('click', function () {
    closeLightbox();
  });
});

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxDesc = document.getElementById('lightbox-description');
  lightbox.style.display = 'none';
  lightboxImg.src = '';
  lightboxDesc.innerHTML = '';
}
