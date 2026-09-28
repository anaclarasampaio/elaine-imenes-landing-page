/* Quem sou eu — animações.
   A constelação de Câncer se desenha, a citação se acende palavra por palavra
   e a assinatura é traçada no fim. Sem GSAP, tudo aparece pronto. */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  function start() {
    var titleWords = splitWords(document.querySelector('.sb-title'));
    var quoteWords = splitWords(document.querySelector('.sb-quote'));

    if (!window.gsap || reduceMotion) {
      quoteWords.forEach(function (w) { w.style.opacity = 1; });
      return;
    }
    var gsap = window.gsap;
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    // entrada: título, foto que cresce e a constelação se desenhando estrela por estrela
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.sb-hero .eyebrow', { y: 20, opacity: 0, duration: .6 })
      .from(titleWords, { y: 60, opacity: 0, rotate: 4, duration: 1, stagger: .1 }, '-=.3')
      .from('.sb-hero-lead', { y: 24, opacity: 0, duration: .7 }, '-=.6')
      .from('.sb-hero-roles li', { y: 16, opacity: 0, scale: .9, duration: .5, stagger: .08 }, '-=.4')
      .from('.sb-blob', { scale: .6, opacity: 0, duration: 1.4, ease: 'expo.out' }, .1)
      .from('.sb-const-stars circle', { scale: 0, opacity: 0, duration: .5, stagger: .18, ease: 'back.out(3)' }, .8)
      .from('.sb-const-lines path', { strokeDashoffset: 140, duration: .9, stagger: .22, ease: 'power2.inOut' }, 1)
      .from('.sb-const-label', { opacity: 0, x: -10, duration: .6 }, 2)
      .from('.sb-note', { scale: 0, rotate: -30, duration: .8, ease: 'back.out(2)' }, 1.6);

    if (!window.ScrollTrigger) return;
    var st = function (t, s) { return { trigger: t, start: s || 'top 78%' }; };

    gsap.from('.sb-story-text > *', { y: 30, opacity: 0, duration: .7, stagger: .1, scrollTrigger: st('.sb-story') });
    gsap.from('.sb-story-photo', { y: 60, rotate: 6, opacity: 0, duration: 1.2, ease: 'elastic.out(1, .7)', scrollTrigger: st('.sb-story') });

    gsap.from('.sb-side--science', { x: -80, opacity: 0, duration: 1, scrollTrigger: st('.sb-bridge-grid') });
    gsap.from('.sb-side--sky', { x: 80, opacity: 0, duration: 1, scrollTrigger: st('.sb-bridge-grid') });
    gsap.from('.sb-bridge-mid', { scale: 0, rotate: -180, duration: 1.2, ease: 'back.out(1.6)', scrollTrigger: st('.sb-bridge-grid') });
    gsap.from('.sb-side li', { x: 20, opacity: 0, duration: .5, stagger: .06, scrollTrigger: st('.sb-bridge-grid', 'top 65%') });

    gsap.from('.sb-approach-inner > :not(.sb-quote)', { y: 30, opacity: 0, duration: .8, stagger: .12, scrollTrigger: st('.sb-approach') });
    gsap.to(quoteWords, { opacity: 1, stagger: .06, ease: 'none', scrollTrigger: { trigger: '.sb-quote', start: 'top 80%', end: 'bottom 50%', scrub: true } });

    gsap.from('.sb-teach-num', { scale: .6, opacity: 0, duration: 1.1, ease: 'back.out(1.6)', scrollTrigger: st('.sb-teach') });
    gsap.from('.sb-teach-grid > div:last-child > *', { y: 30, opacity: 0, duration: .7, stagger: .1, scrollTrigger: st('.sb-teach') });

    gsap.from('.sb-chips li', { y: 40, opacity: 0, scale: .8, duration: .7, stagger: .07, ease: 'back.out(2)', scrollTrigger: st('.sb-chips') });

    gsap.from('.sb-cta-inner > :not(.sb-signature)', { y: 30, opacity: 0, duration: .8, stagger: .12, scrollTrigger: st('.sb-cta') });
    gsap.from('.sb-signature span', { opacity: 0, y: 14, duration: .8, scrollTrigger: st('.sb-signature', 'top 90%') });
    gsap.from('.sb-signature path', { strokeDashoffset: 300, duration: 1.4, delay: .3, ease: 'power2.inOut', scrollTrigger: st('.sb-signature', 'top 90%') });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
