(function () {
  function initGallery() {
    var mainImg = document.getElementById('gallery-active');
    if (!mainImg) return;

    var thumbBtns = Array.from(document.querySelectorAll('[data-gallery-thumb]'));
    if (!thumbBtns.length) return;

    var imgs = thumbBtns.map(function (b) { return b.dataset.galleryThumb; });
    var current = 0;

    function setActive(idx) {
      current = (idx + imgs.length) % imgs.length;

      mainImg.classList.add('gallery--fade');
      setTimeout(function () {
        mainImg.src = imgs[current];
        mainImg.classList.remove('gallery--fade');
      }, 180);

      thumbBtns.forEach(function (btn, i) {
        btn.classList.toggle('gallery__thumb--active', i === current);
      });

      thumbBtns[current].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    thumbBtns.forEach(function (btn, i) {
      btn.addEventListener('click', function () { setActive(i); });
    });

    var prevBtn = document.querySelector('.gallery__nav--prev');
    var nextBtn = document.querySelector('.gallery__nav--next');
    if (prevBtn) prevBtn.addEventListener('click', function () { setActive(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { setActive(current + 1); });

    // teclado: ← →
    document.addEventListener('keydown', function (e) {
      if (!document.querySelector('.product__gallery')) return;
      if (e.key === 'ArrowLeft') setActive(current - 1);
      if (e.key === 'ArrowRight') setActive(current + 1);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGallery);
  } else {
    initGallery();
  }
})();
