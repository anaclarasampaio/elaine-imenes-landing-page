/* Saiba mais — visualizador das fotos do livro (toque, setas e deslizar). */
(function () {
  'use strict';
  var box = document.querySelector('[data-lightbox]');
  var links = Array.prototype.slice.call(document.querySelectorAll('[data-gallery] a'));
  if (!box || !links.length) return;
  var img = box.querySelector('[data-lb-img]');
  var cap = box.querySelector('[data-lb-cap]');
  var current = 0, lastFocus = null;

  function show(i) {
    current = (i + links.length) % links.length;
    var a = links[current], thumb = a.querySelector('img');
    img.src = a.getAttribute('href');
    img.alt = thumb.alt;
    cap.textContent = a.parentElement.querySelector('figcaption').textContent;
  }
  function open(i) {
    lastFocus = document.activeElement;
    show(i); box.hidden = false; document.body.style.overflow = 'hidden';
    box.querySelector('[data-lb-close]').focus();
  }
  function close() {
    box.hidden = true; document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  links.forEach(function (a, i) {
    a.addEventListener('click', function (e) { e.preventDefault(); open(i); });
  });
  box.querySelector('[data-lb-close]').addEventListener('click', close);
  box.querySelector('[data-lb-prev]').addEventListener('click', function () { show(current - 1); });
  box.querySelector('[data-lb-next]').addEventListener('click', function () { show(current + 1); });
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
  // deslizar o dedo para trocar de foto
  var x0 = null;
  box.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) show(current + (dx < 0 ? 1 : -1));
    x0 = null;
  });
})();
