/* Agenda — organiza os eventos pela data de hoje (de quem está visitando),
   mostra quanto falta para o próximo e gira a roda do ano até o mês atual. */
(function () {
  'use strict';
  var MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  var now = new Date();
  var DAY = 86400000;

  function startOfDay(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); }
  function daysUntil(d) { return Math.round((startOfDay(d) - startOfDay(now)) / DAY); }

  /* ── eventos ── */
  var all = Array.prototype.slice.call(document.querySelectorAll('.ag-all .ag-event'));
  var upcomingBox = document.querySelector('[data-upcoming]');
  var pastBox = document.querySelector('[data-past]');
  var upcoming = [], past = [];

  all.forEach(function (el) {
    var start = new Date(el.dataset.start), end = new Date(el.dataset.end);
    var status = el.querySelector('[data-status]');
    if (end < now) {
      past.push(el);
      el.classList.add('is-past');
      el.querySelectorAll('[data-upcoming-only]').forEach(function (a) { a.remove(); });
      status.textContent = 'Encerrado';
    } else {
      upcoming.push(el);
      var n = daysUntil(start);
      if (start <= now) { status.textContent = 'Acontecendo agora'; status.classList.add('is-live'); }
      else if (n === 0) { status.textContent = 'Hoje'; status.classList.add('is-soon'); }
      else if (n === 1) { status.textContent = 'Amanhã'; status.classList.add('is-soon'); }
      else if (n <= 30) { status.textContent = 'Em ' + n + ' dias'; status.classList.add('is-soon'); }
      else status.remove();
    }
  });

  upcoming.forEach(function (el) { upcomingBox.appendChild(el); });
  past.reverse().forEach(function (el) { pastBox.appendChild(el); }); // o mais recente primeiro
  document.querySelector('[data-empty]').hidden = upcoming.length > 0;
  document.querySelector('[data-group="past"]').hidden = past.length === 0;

  /* ── contagem regressiva para o próximo ── */
  var next = upcoming[0];
  if (next) {
    var box = document.querySelector('[data-next]');
    var title = next.querySelector('h3').textContent;
    var start = new Date(next.dataset.start);
    box.querySelector('[data-next-title]').textContent = title;
    var out = box.querySelector('[data-countdown]');
    var tick = function () {
      var ms = start - new Date();
      if (ms <= 0) { out.innerHTML = '<b>Acontecendo agora</b>'; return; }
      var d = Math.floor(ms / DAY), h = Math.floor(ms / 3600000) % 24, m = Math.floor(ms / 60000) % 60;
      out.innerHTML = (d ? '<b>' + d + '</b> dia' + (d > 1 ? 's' : '') + ' ' : '') + '<b>' + h + '</b>h <b>' + m + '</b>min';
    };
    tick(); setInterval(tick, 30000);
    box.hidden = false;
  }

  /* ── roda do ano ── */
  var wheel = document.querySelector('.ag-wheel svg');
  var ticks = document.querySelector('.ag-wheel-ticks');
  if (ticks) {
    var ns = 'http://www.w3.org/2000/svg';
    for (var i = 0; i < 72; i++) {
      var a = i * 5 * Math.PI / 180, major = i % 6 === 0;
      var r1 = 132, r2 = major ? 146 : 139;
      var line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', 200 + r1 * Math.cos(a)); line.setAttribute('y1', 200 + r1 * Math.sin(a));
      line.setAttribute('x2', 200 + r2 * Math.cos(a)); line.setAttribute('y2', 200 + r2 * Math.sin(a));
      if (major) line.setAttribute('class', 'is-major');
      ticks.appendChild(line);
    }
  }
  document.querySelector('[data-today-day]').textContent = now.getDate();
  document.querySelector('[data-today-month]').textContent = MONTHS[now.getMonth()];
  // os meses começam às 9 horas e seguem no sentido horário, 30° cada;
  // giramos até o mês atual ficar embaixo do marcador, no alto
  var angle = 90 - (now.getMonth() * 30 + 9 + (now.getDate() / 31) * 18);
  requestAnimationFrame(function () { wheel.style.transform = 'rotate(' + angle + 'deg)'; });
})();
