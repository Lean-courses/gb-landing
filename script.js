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

/* --- 1. Nav: resaltar la sección visible ----------------------------------- */

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

/* --- 2. Formulario de postulación -> mailto -------------------------------- */

(function applyForm() {
  const form = document.getElementById('apply-form');
  const note = document.getElementById('form-note');
  if (!form) return;

  const val = (name) => {
    const el = form.elements[name];
    return el && el.value ? el.value.trim() : '';
  };

  /** Arma el href mailto a partir del formulario. Expuesto para poder
   *  verificarlo sin abrir el cliente de mail. */
  function buildMailto() {
    const nombre = val('nombre');
    const asunto = `Postulación Green Belt — ${nombre || 'candidato'}`;

    const cuerpo = [
      'Hola Damián,',
      '',
      'Quiero postularme al programa Lean Six Sigma Green Belt.',
      '',
      `Nombre:    ${nombre}`,
      `Email:     ${val('email')}`,
      `Planta:    ${val('sitio')}`,
      `Función:   ${val('funcion')}`,
      `Sponsor:   ${val('sponsor') || '(a definir)'}`,
      '',
      'Problema que querría atacar:',
      val('problema'),
      '',
      '—',
      'Enviado desde la landing del programa Green Belt.'
    ].join('\n');

    return `mailto:${DESTINO_POSTULACIONES}` +
           `?subject=${encodeURIComponent(asunto)}` +
           `&body=${encodeURIComponent(cuerpo)}`;
  }

  form.buildMailto = buildMailto;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    window.location.href = buildMailto();

    if (note) {
      note.textContent = 'Abriendo tu cliente de mail… si no se abre, escribinos a ' +
                         DESTINO_POSTULACIONES;
    }
  });
})();
