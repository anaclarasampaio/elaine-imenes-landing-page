(function () {
  var script = document.currentScript;

  var html = ''
    + '<footer class="footer">'
    + '  <div class="footer-glow" aria-hidden="true"></div>'
    + '  <div class="footer-stars" aria-hidden="true">'
    + '    <span class="oc-star" style="top:15%; left:8%; --s:3px; --dur:3.4s; --delay:.2s;"></span>'
    + '    <span class="oc-star" style="top:55%; left:4%; --s:3px; --dur:4s; --delay:1.2s;"></span>'
    + '    <span class="oc-star" style="top:30%; left:92%; --s:3px; --dur:3.7s; --delay:.7s;"></span>'
    + '    <span class="oc-star" style="top:70%; left:88%; --s:4px; --dur:4.3s; --delay:1.6s;"></span>'
    + '    <span class="oc-star" style="top:10%; left:55%; --s:3px; --dur:3.9s; --delay:.4s;"></span>'
    + '  </div>'
    + '  <div class="footer-inner">'
    + '    <div class="footer-top">'
    + '      <div class="footer-brand">'
    + '        <a href="inicio.html" class="footer-brand-logo">'
    + '          <img src="assets/img/footer-logo-full.png" alt="Elaine Imenes — Astrologia, Cursos, Consultorias">'
    + '        </a>'
    + '        <p class="footer-tagline">Astróloga, química e educadora. A astrologia como linguagem para entender padrões e orientar escolhas.</p>'
    + '        <div class="social-row footer-social" style="justify-content:flex-start;">'
    + '          <a href="https://www.instagram.com/elaineimenes.astrologia/" class="social-btn" target="_blank" rel="noopener" aria-label="Instagram">'
    + '            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>'
    + '          </a>'
    + '          <a href="https://wa.me/message/LV2XLCURCFYTF1" class="social-btn" target="_blank" rel="noopener" aria-label="WhatsApp">'
    + '            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.122 1.532 5.854L.001 24l6.305-1.652A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.804 9.804 0 01-5.032-1.39l-.36-.213-3.754.908.972-3.658-.235-.375A9.808 9.808 0 012.182 12C2.182 6.575 6.575 2.182 12 2.182S21.818 6.575 21.818 12 17.425 21.818 12 21.818zm5.388-7.335c-.296-.148-1.757-.866-2.03-.966-.272-.099-.47-.148-.668.149-.198.296-.767.966-.94 1.164-.173.198-.346.223-.643.074-.297-.148-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.457.13-.605.134-.133.297-.347.446-.52.149-.174.198-.297.297-.496.1-.198.05-.372-.024-.52-.075-.149-.669-1.612-.916-2.207-.241-.579-.486-.5-.668-.51-.173-.008-.372-.01-.57-.01s-.52.074-.792.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.693.248-1.287.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>'
    + '          </a>'
    + '          <a href="https://www.facebook.com/elaine.imenes" class="social-btn" target="_blank" rel="noopener" aria-label="Facebook">'
    + '            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z"/></svg>'
    + '          </a>'
    + '        </div>'
    + '      </div>'
    + '      <div class="footer-col">'
    + '        <h4>Navegue</h4>'
    + '        <a href="sobre.html">Sobre</a>'
    + '        <a href="consultas.html">Consultas</a>'
    + '        <a href="cursos.html">Cursos</a>'
    + '        <a href="agenda.html">Agenda</a>'
    + '      </div>'
    + '      <div class="footer-col">'
    + '        <h4>Conteúdo</h4>'
    + '        <a href="sala-de-leitura.html">Sala de Leitura</a>'
    + '        <a href="o-ceu-me-contou.html">O Céu Me Contou</a>'
    + '      </div>'
    + '      <div class="footer-col">'
    + '        <h4>Contato</h4>'
    + '        <a href="mailto:elaineimenes.astrologia@gmail.com">elaineimenes.astrologia@<wbr>gmail.com</a>'
    + '        <a href="https://wa.me/message/LV2XLCURCFYTF1" target="_blank" rel="noopener" class="footer-wa-link">'
    + '          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.122 1.532 5.854L.001 24l6.305-1.652A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.804 9.804 0 01-5.032-1.39l-.36-.213-3.754.908.972-3.658-.235-.375A9.808 9.808 0 012.182 12C2.182 6.575 6.575 2.182 12 2.182S21.818 6.575 21.818 12 17.425 21.818 12 21.818zm5.388-7.335c-.296-.148-1.757-.866-2.03-.966-.272-.099-.47-.148-.668.149-.198.296-.767.966-.94 1.164-.173.198-.346.223-.643.074-.297-.148-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.457.13-.605.134-.133.297-.347.446-.52.149-.174.198-.297.297-.496.1-.198.05-.372-.024-.52-.075-.149-.669-1.612-.916-2.207-.241-.579-.486-.5-.668-.51-.173-.008-.372-.01-.57-.01s-.52.074-.792.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.693.248-1.287.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>'
    + '          Fale no WhatsApp'
    + '        </a>'
    + '      </div>'
    + '    </div>'
    + '    <div class="footer-bottom">'
    + '      <span>© 2026 Elaine Imenes. Todos os direitos reservados.</span>'
    + '      <span>Site desenvolvido por <strong>Ana Clara Sampaio</strong></span>'
    + '    </div>'
    + '  </div>'
    + '</footer>'
    + ''
    + '<a href="https://wa.me/message/LV2XLCURCFYTF1" class="wa-btn" target="_blank" rel="noopener" aria-label="WhatsApp">'
    + '  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.122 1.532 5.854L.001 24l6.305-1.652A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.804 9.804 0 01-5.032-1.39l-.36-.213-3.754.908.972-3.658-.235-.375A9.808 9.808 0 012.182 12C2.182 6.575 6.575 2.182 12 2.182S21.818 6.575 21.818 12 17.425 21.818 12 21.818zm5.388-7.335c-.296-.148-1.757-.866-2.03-.966-.272-.099-.47-.148-.668.149-.198.296-.767.966-.94 1.164-.173.198-.346.223-.643.074-.297-.148-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.457.13-.605.134-.133.297-.347.446-.52.149-.174.198-.297.297-.496.1-.198.05-.372-.024-.52-.075-.149-.669-1.612-.916-2.207-.241-.579-.486-.5-.668-.51-.173-.008-.372-.01-.57-.01s-.52.074-.792.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.693.248-1.287.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>'
    + '</a>';

  script.insertAdjacentHTML('beforebegin', html);

  // links relativos funcionam também em subpastas (ex.: /post/texto.html)
  var base = (script.getAttribute('src') || '').replace(/assets\/js\/[a-z]+\.js.*$/, '');
  var footer = script.previousElementSibling;
  while (footer && !(footer.classList && footer.classList.contains('footer'))) footer = footer.previousElementSibling;
  if (base && footer) {
    document.querySelectorAll('.footer [href], .footer [src], .wa-float[href]').forEach(function (el) {
      ['href', 'src'].forEach(function (attr) {
        var v = el.getAttribute(attr);
        if (v && !/^(https?:|mailto:|tel:|#|\/|data:)/.test(v)) el.setAttribute(attr, base + v);
      });
    });
  }
})();
