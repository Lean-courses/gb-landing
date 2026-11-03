/* =============================================================================
   Green Belt LatAm — comportamiento de la landing
   Sin dependencias. Dos cosas: resaltar la sección activa en el nav y armar
   el mail de postulación.
   ========================================================================== */

/* --- Destino de las postulaciones -------------------------------------------
   Para cambiarlo, editá esta constante y nada más.
   Si en el futuro la postulación pasa a un Microsoft Form, reemplazá el
   listener del submit por un redirect a esa URL.                             */
const DESTINO_POSTULACIONES = 'drotondi@gmail.com';

/* --- 1. Menú de pantallas chicas -------------------------------------------
   El botón abre y cierra el panel de secciones. Se cierra al tocar un link,
   con Escape, tocando fuera, o al volver a una pantalla ancha.              */

(function navMenu() {
  const boton = document.getElementById('nav-toggle');
  const panel = document.getElementById('nav-links');
  if (!boton || !panel) return;

  const estaAbierto = () => panel.classList.contains('is-open');

  function abrir(si) {
    panel.classList.toggle('is-open', si);
    boton.setAttribute('aria-expanded', String(si));
    boton.setAttribute('aria-label', si ? 'Cerrar el menú' : 'Abrir el menú');
  }

  boton.addEventListener('click', () => abrir(!estaAbierto()));

  // Tocar una sección cierra el panel y deja ver la página.
  panel.addEventListener('click', (e) => {
    if (e.target.closest('a')) abrir(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && estaAbierto()) {
      abrir(false);
      boton.focus();
    }
  });

  // Tocar fuera del menú lo cierra.
  document.addEventListener('click', (e) => {
    if (!estaAbierto()) return;
    if (!panel.contains(e.target) && !boton.contains(e.target)) abrir(false);
  });

  // Al rotar el teléfono o pasar a desktop, el panel no debe quedar colgado.
  const ancha = window.matchMedia('(min-width: 981px)');
  const alCambiar = (e) => { if (e.matches) abrir(false); };
  if (ancha.addEventListener) ancha.addEventListener('change', alCambiar);
  else ancha.addListener(alCambiar);          // Safari viejo
})();

/* --- 2. Nav: resaltar la sección visible ----------------------------------- */

(function navHighlight() {
  const links = Array.from(document.querySelectorAll('.nav__links a'));
  if (!links.length || !('IntersectionObserver' in window)) return;

  const byId = new Map();
  links.forEach((a) => {
    const id = a.getAttribute('href').slice(1);
    const section = document.getElementById(id);
    if (section) byId.set(section, a);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.classList.remove('is-active'));
        const active = byId.get(entry.target);
        if (active) active.classList.add('is-active');
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  byId.forEach((_, section) => observer.observe(section));
})();

/* --- 3. Formulario de postulación ------------------------------------------
   Envía por fetch a /api/postular, que manda el mail del lado del servidor.
   El candidato nunca sale de la página ni abre su cliente de correo.
   Si el envío falla, se le ofrece el mail prellenado como respaldo.         */

(function applyForm() {
  const form = document.getElementById('apply-form');
  const note = document.getElementById('form-note');
  if (!form) return;

  const boton = form.querySelector('button[type="submit"]');
  const textoBoton = boton.textContent;

  const val = (name) => {
    const el = form.elements[name];
    return el && el.value ? el.value.trim() : '';
  };

  const datos = () => ({
    nombre: val('nombre'),
    email: val('email'),
    sitio: val('sitio'),
    funcion: val('funcion'),
    problema: val('problema'),
    sponsor: val('sponsor'),
    website: val('website'),
  });

  /** Mail prellenado. Es el respaldo si el envío falla, y permite verificar
   *  el contenido sin abrir el cliente de correo. */
  function buildMailto() {
    const d = datos();
    const cuerpo = [
      'Hola,',
      '',
      'Quiero postularme al programa Lean Six Sigma Green Belt.',
      '',
      `Nombre:    ${d.nombre}`,
      `Email:     ${d.email}`,
      `Planta:    ${d.sitio}`,
      `Función:   ${d.funcion}`,
      `Sponsor:   ${d.sponsor || '(a definir)'}`,
      '',
      'Problema que querría atacar:',
      d.problema,
      '',
      '—',
      'Enviado desde la landing del programa Green Belt.',
    ].join('\n');

    return `mailto:${DESTINO_POSTULACIONES}` +
           `?subject=${encodeURIComponent('Postulación Green Belt — ' + (d.nombre || 'candidato'))}` +
           `&body=${encodeURIComponent(cuerpo)}`;
  }

  form.buildMailto = buildMailto;

  function mostrarError(mensaje) {
    note.className = 'form__note form__note--error';
    note.innerHTML = '';
    note.append(mensaje + ' ');
    const a = document.createElement('a');
    a.href = buildMailto();
    a.textContent = 'Enviála por mail';
    note.append(a);
    note.append('.');
    boton.disabled = false;
    boton.textContent = textoBoton;
  }

  function mostrarExito() {
    const d = datos();
    const panel = document.createElement('div');
    panel.className = 'sent';
    panel.setAttribute('role', 'status');
    panel.innerHTML =
      '<div class="sent__icon" aria-hidden="true">' +
      '<svg viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="12.4" stroke="currentColor" stroke-width="1.8"/>' +
      '<path d="M8.8 14.3l3.5 3.5 7-7.2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</div><h3>Postulación enviada</h3>';

    const p = document.createElement('p');
    p.append('Ya la recibimos. Te vamos a responder a ');
    const b = document.createElement('strong');
    b.textContent = d.email;
    p.append(b, ' para avanzar con la evaluación de factibilidad de tu proyecto.');
    panel.append(p);

    form.replaceWith(panel);
    panel.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    boton.disabled = true;
    boton.textContent = 'Enviando…';
    note.className = 'form__note';
    note.textContent = 'Enviando tu postulación…';

    try {
      const r = await fetch('/api/postular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos()),
      });
      const data = await r.json().catch(() => ({}));

      if (r.ok && data.ok) {
        mostrarExito();
      } else {
        mostrarError(data.error || 'No pudimos enviar tu postulación.');
      }
    } catch {
      mostrarError('No pudimos enviar tu postulación.');
    }
  });
})();
