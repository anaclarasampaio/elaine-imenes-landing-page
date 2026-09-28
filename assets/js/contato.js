/* Contato — copiar o e-mail e enviar o formulário (Netlify Forms) sem sair da página. */
(function () {
  'use strict';

  // copiar e-mail
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var done = function () {
        btn.textContent = 'Copiado!'; btn.classList.add('is-done');
        setTimeout(function () { btn.textContent = 'Copiar'; btn.classList.remove('is-done'); }, 2000);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(btn.dataset.copy).then(done, function () { location.href = 'mailto:' + btn.dataset.copy; });
      else location.href = 'mailto:' + btn.dataset.copy;
    });
  });

  var form = document.querySelector('[data-ct-form]');
  if (!form) return;
  var nameInput = form.querySelector('[name=nome]');
  var status = form.querySelector('[data-ct-status]');
  var button = form.querySelector('[data-ct-submit]');
  var sent = document.querySelector('[data-ct-sent]');


  // o assunto pode vir no endereço: contato.html?assunto=O%20Céu%20Me%20Contou
  var wanted = new URLSearchParams(location.search).get('assunto');
  if (wanted) {
    var select = form.querySelector('[name=assunto]');
    Array.prototype.forEach.call(select.options, function (o) { if (o.value === wanted) select.value = wanted; });
  }

  form.addEventListener('submit', function (e) {
    if (!window.fetch) return; // navegador antigo: envio normal, cai em obrigado.html
    e.preventDefault();
    status.textContent = '';
    button.disabled = true;
    var body = new URLSearchParams(new FormData(form)).toString();
    fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body })
      .then(function (r) {
        if (!r.ok) throw new Error(r.status);
        form.hidden = true;
        sent.hidden = false; sent.scrollIntoView({ behavior: 'smooth', block: 'center' });
      })
      .catch(function () {
        status.innerHTML = 'Não foi possível enviar agora. Tente de novo ou escreva direto para <a href="mailto:elaineimenes.astrologia@gmail.com">elaineimenes.astrologia@gmail.com</a>.';
      })
      .then(function () { button.disabled = false; });
  });

  document.querySelector('[data-ct-again]').addEventListener('click', function () {
    form.reset();
    sent.hidden = true; form.hidden = false; nameInput.focus();
  });
})();
