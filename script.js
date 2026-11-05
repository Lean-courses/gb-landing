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

/* --- 1. Videos de las clases ---------------------------------------------------
   Hasta que alguien hace click no se pide nada a YouTube: solo está la
   miniatura. Recién ahí se inserta el reproductor, desde el dominio
   youtube-nocookie, y arranca solo.                                         */

(function videos() {
  document.querySelectorAll('.video').forEach((caja) => {
    caja.addEventListener('click', function reproducir() {
      const id = caja.dataset.video;
      if (!id || caja.classList.contains('is-playing')) return;

      const marco = document.createElement('iframe');
      marco.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) +
                  '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
      marco.title = 'Una clase del programa Green Belt';
      marco.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; ' +
                    'gyroscope; picture-in-picture; web-share';
      marco.allowFullscreen = true;

      caja.innerHTML = '';
      caja.appendChild(marco);
      caja.classList.add('is-playing');
      caja.setAttribute('aria-label', 'Video de una clase del programa, reproduciendo');
      caja.removeEventListener('click', reproducir);
    });
  });
})();

/* --- 2. Menú de pantallas chicas -------------------------------------------
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
  const ancha = window.matchMedia('(min-width: 1280px)');
  const alCambiar = (e) => { if (e.matches) abrir(false); };
  if (ancha.addEventListener) ancha.addEventListener('change', alCambiar);
  else ancha.addListener(alCambiar);          // Safari viejo
})();

/* --- 3. Nav: resaltar la sección visible ----------------------------------- */

(function navHighlight() {
  const links = Array.from(document.querySelectorAll('.nav__links a'));
  if (!links.length || !('IntersectionObserver' in window)) return;

  // Un link puede cubrir más de una sección: "El método" abarca las fases
  // DMAIC y gestión del cambio. Eso se declara con data-sections en el HTML.
  const byId = new Map();
  links.forEach((a) => {
    const ids = (a.dataset.sections || a.getAttribute('href').slice(1)).split(/\s+/);
    ids.forEach((id) => {
      const section = document.getElementById(id);
      if (section) byId.set(section, a);
    });
  });
  if (!byId.size) return;

  // Varias secciones pueden estar intersecando a la vez, sobre todo al saltar
  // con un ancla. Guardamos todas y elegimos la que está más cerca del centro
  // de la pantalla, en vez de confiar en el orden en que llegan los avisos.
  const visibles = new Set();

  function marcar() {
    if (!visibles.size) return;
    const centro = window.innerHeight / 2;
    let mejor = null, menor = Infinity;
    visibles.forEach((sec) => {
      const r = sec.getBoundingClientRect();
      const d = Math.abs((r.top + r.bottom) / 2 - centro);
      if (d < menor) { menor = d; mejor = sec; }
    });
    const activo = byId.get(mejor);
    links.forEach((a) => a.classList.toggle('is-active', a === activo));
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) visibles.add(e.target);
        else visibles.delete(e.target);
      });
      marcar();
    },
    { rootMargin: '-25% 0px -25% 0px', threshold: 0 }
  );

  byId.forEach((_, section) => observer.observe(section));
})();

/* --- 4. Formulario de postulación ------------------------------------------
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
