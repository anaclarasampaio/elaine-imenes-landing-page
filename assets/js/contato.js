/* Contato — copiar o e-mail, assinar a carta com o nome digitado
   e enviar o formulário (Netlify Forms) sem sair da página. */
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
  var sign = form.querySelector('[data-ct-sign]');
  var nameInput = form.querySelector('[name=nome]');
  var status = form.querySelector('[data-ct-status]');
  var button = form.querySelector('[data-ct-submit]');
  var sent = document.querySelector('[data-ct-sent]');

  // a carta é assinada com o primeiro nome de quem escreve
  function updateSign() { sign.textContent = (nameInput.value.trim().split(/\s+/)[0]) || '…'; }
  nameInput.addEventListener('input', updateSign);

  // o assunto pode vir no endereço: contato.html?assunto=O%20Céu%20Me%20Contou
  var wanted = new URLSearchParams(location.search).get('assunto');
  if (wanted) {
    var radio = form.querySelector('input[name=assunto][value="' + wanted.replace(/"/g, '') + '"]');
    if (radio) radio.checked = true;
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
        form.classList.add('is-sending');
        setTimeout(function () {
          form.hidden = true; form.classList.remove('is-sending');
          sent.hidden = false; sent.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 850);
      })
      .catch(function () {
        status.innerHTML = 'Não foi possível enviar agora. Tente de novo ou escreva direto para <a href="mailto:elaineimenes.astrologia@gmail.com">elaineimenes.astrologia@gmail.com</a>.';
      })
      .then(function () { button.disabled = false; });
  });

  document.querySelector('[data-ct-again]').addEventListener('click', function () {
    form.reset(); updateSign();
    sent.hidden = true; form.hidden = false; nameInput.focus();
  });
})();
