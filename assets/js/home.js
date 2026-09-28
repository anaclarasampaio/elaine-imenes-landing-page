/* Página inicial — animações.
   A mandala só gira sozinha; o livro segue o mouse em 3D, cartões inclinam, e as seções entram
   com GSAP + ScrollTrigger. Sem as bibliotecas (ou com movimento reduzido),
   tudo aparece normalmente. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  function splitWords(node) {
    var out = [];
    Array.prototype.slice.call(node.childNodes).forEach(function (child) {
      if (child.nodeType === 3) {
        var frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          var span = document.createElement('span');
          span.className = 'w'; span.textContent = part;
          frag.appendChild(span); out.push(span);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1) {
        out = out.concat(splitWords(child));
      }
    });
    return out;
  }

  // inclinação 3D e brilho que segue o cursor nos cartões
  function initTilt() {
    if (reduceMotion || !finePointer) return;
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.style.transition = 'box-shadow .3s, border-color .3s';
        card.style.transform = 'rotateY(' + ((x - .5) * 14) + 'deg) rotateX(' + ((.5 - y) * 12) + 'deg) translateY(-6px)';
        card.style.setProperty('--mx', (x * 100) + '%');
        card.style.setProperty('--my', (y * 100) + '%');
      });
      card.addEventListener('mouseleave', function () {
        card.style.transition = 'transform .6s ease, box-shadow .3s, border-color .3s';
        card.style.transform = '';
      });
    });
  }

  // um elemento que inclina seguindo o mouse dentro de uma área
  function follow(area, target, base, maxY, maxX) {
    if (!area || !target || reduceMotion || !finePointer) return;
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
    function loop() {
      cx += (tx - cx) * .07; cy += (ty - cy) * .07;
      target.style.transform = base + ' rotateY(' + (cx * maxY) + 'deg) rotateX(' + (-cy * maxX) + 'deg)';
      raf = (Math.abs(tx - cx) > .001 || Math.abs(ty - cy) > .001) ? requestAnimationFrame(loop) : null;
    }
    area.addEventListener('mousemove', function (e) {
      var r = area.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - .5; ty = (e.clientY - r.top) / r.height - .5;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    area.addEventListener('mouseleave', function () { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
  }

  function initGsap() {
    var words = splitWords(document.querySelector('.hm-title'));
    if (!window.gsap || reduceMotion) return;
    var gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .from('.hm-hero .eyebrow', { y: 20, opacity: 0, duration: .6 })
      .from(words, { y: 60, opacity: 0, rotate: 5, duration: 1, stagger: .07 }, '-=.3')
      .from('.hm-hero-lead, .hm-hero-btns', { y: 24, opacity: 0, duration: .7, stagger: .12 }, '-=.6')
      .from('.hm-mandala-wrap', { opacity: 0, duration: 1.6, ease: 'power2.out' }, 0)
      .from('.hm-cue', { opacity: 0, duration: .6 }, 1.4);

    if (!window.ScrollTrigger) return;
    var st = function (trigger, start) { return { trigger: trigger, start: start || 'top 78%' }; };

    gsap.from('.hm-feature-copy > *', { y: 30, opacity: 0, duration: .7, stagger: .1, scrollTrigger: st('.hm-feature') });
    gsap.from('.hm-stat', { y: 60, opacity: 0, rotate: function (i) { return i % 2 ? 6 : -6; }, duration: .9, stagger: .1, ease: 'back.out(1.5)', scrollTrigger: st('.hm-stats') });

    gsap.from('.hm-portrait-frame', { clipPath: 'inset(100% 0 0 0 round 220px 220px 24px 24px)', duration: 1.4, ease: 'power4.out', scrollTrigger: st('.hm-about') });
    gsap.from('.hm-seal', { scale: 0, duration: 1, ease: 'back.out(2)', scrollTrigger: st('.hm-about', 'top 60%') });
    gsap.from('.hm-about-text > *', { y: 30, opacity: 0, duration: .7, stagger: .1, scrollTrigger: st('.hm-about') });

    gsap.from('.hm-path', { y: 80, opacity: 0, rotateX: -25, duration: 1, stagger: .12, ease: 'power3.out', scrollTrigger: st('.hm-paths-grid') });

    gsap.from('.hm-book-copy > *', { y: 30, opacity: 0, duration: .8, stagger: .12, scrollTrigger: st('.hm-book') });
    gsap.from('.hm-book-visual', { y: 100, rotateY: -30, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: st('.hm-book') });
    gsap.from('.hm-bubble', { scale: 0, duration: .8, stagger: .15, ease: 'back.out(2)', scrollTrigger: st('.hm-book', 'top 60%') });

    gsap.from('.hm-voice', { y: 70, opacity: 0, duration: .9, stagger: .15, ease: 'power3.out', scrollTrigger: st('.hm-voices-grid') });
    gsap.from('.hm-article', { y: 50, opacity: 0, duration: .8, stagger: .12, scrollTrigger: st('.hm-reading-grid') });
    gsap.from('.hm-cta-inner > *', { y: 30, opacity: 0, duration: .8, stagger: .12, scrollTrigger: st('.hm-cta', 'top 70%') });
  }

  function start() {
    initGsap();
    initTilt();
    follow(document.querySelector('.hm-book'), document.querySelector('.hm-book-tilt'), '', 24, 16);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
