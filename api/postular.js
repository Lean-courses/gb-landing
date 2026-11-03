/* =============================================================================
   POST /api/postular
   Recibe la postulación de la landing y la manda por mail con Resend.
   Función serverless de Vercel. Sin dependencias npm: usa fetch nativo.

   Variables de entorno (Vercel > Settings > Environment Variables):
     RESEND_API_KEY   obligatoria. Se saca de resend.com/api-keys
     DESTINO_MAIL     opcional. Por defecto drotondi@gmail.com
     REMITENTE_MAIL   opcional. Por defecto el remitente de prueba de Resend
   ========================================================================== */

const DESTINO_POR_DEFECTO = 'drotondi@gmail.com';
const REMITENTE_POR_DEFECTO = 'Postulaciones Green Belt <onboarding@resend.dev>';

const CAMPOS = [
  ['nombre', 'Nombre', true],
  ['email', 'Email', true],
  ['sitio', 'Planta / sitio', true],
  ['funcion', 'Función', true],
  ['problema', 'Problema a atacar', true],
  ['sponsor', 'Sponsor propuesto', false],
];

const LIMITES = { nombre: 120, email: 160, sitio: 120, funcion: 80, sponsor: 120, problema: 4000 };

function limpiar(valor, max) {
  if (typeof valor !== 'string') return '';
  // Sin saltos de línea en los campos cortos: evita inyección de headers.
  const plano = max <= 200 ? valor.replace(/[\r\n]+/g, ' ') : valor;
  return plano.trim().slice(0, max);
}

function esEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Método no permitido.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = null; }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ ok: false, error: 'No pudimos leer el formulario.' });
  }

  // Honeypot: un bot completa todos los campos, una persona no ve este.
  // Respondemos ok para no darle pistas de que lo detectamos.
  if (limpiar(body.website, 200)) {
    return res.status(200).json({ ok: true });
  }

  const datos = {};
  for (const [campo, etiqueta, obligatorio] of CAMPOS) {
    const valor = limpiar(body[campo], LIMITES[campo]);
    if (obligatorio && !valor) {
      return res.status(400).json({ ok: false, error: `Falta completar: ${etiqueta}.` });
    }
    datos[campo] = valor;
  }

  if (!esEmail(datos.email)) {
    return res.status(400).json({ ok: false, error: 'El email no parece válido.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY no está configurada en el entorno.');
    return res.status(503).json({ ok: false, error: 'El envío todavía no está configurado.' });
  }

  const cuerpo = [
    'Nueva postulación al programa Green Belt.',
    '',
    `Nombre:    ${datos.nombre}`,
    `Email:     ${datos.email}`,
    `Planta:    ${datos.sitio}`,
    `Función:   ${datos.funcion}`,
    `Sponsor:   ${datos.sponsor || '(a definir)'}`,
    '',
    'Problema que querría atacar:',
    datos.problema,
    '',
    '—',
    'Enviado desde el formulario de la landing del programa.',
  ].join('\n');

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.REMITENTE_MAIL || REMITENTE_POR_DEFECTO,
        to: [process.env.DESTINO_MAIL || DESTINO_POR_DEFECTO],
        reply_to: datos.email,
        subject: `Postulación Green Belt — ${datos.nombre}`,
        text: cuerpo,
      }),
    });

    if (!r.ok) {
      const detalle = await r.text().catch(() => '');
      console.error('Resend respondió', r.status, detalle);
      return res.status(502).json({ ok: false, error: 'No pudimos enviar el mail.' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error llamando a Resend:', err);
    return res.status(502).json({ ok: false, error: 'No pudimos enviar el mail.' });
  }
};
