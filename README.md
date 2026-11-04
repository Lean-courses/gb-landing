# Landing — Programa Lean Six Sigma Green Belt

Página única, estática, en español. Presenta el programa Green Belt y recoge
postulaciones. Es la puerta de entrada a las dos apps del programa:
[MyGreenBeltProject](https://mygreenbeltclass.vercel.app/) y
[Sigma Sim](https://sigma-sim-one.vercel.app/).

## Cómo se ve

Estilo minimalista cálido (referencia: Claude / Notion): fondo crema, mucho
espacio en blanco, títulos en serif (Georgia), un único acento bordó
(`#7a1f2b`) y bordes de 1px. El cuerpo va en sans. Sin webfonts: la página
renderiza sin pedir nada a la red.

La página **no es de ninguna empresa en particular**: es la oferta del programa.
Amcor aparece una sola vez, como cliente, en la banda "Empresas que ya
confiaron" debajo del hero. Su logo se usa a color y sin filtros — aplicarle
`grayscale` alteraría la marca, cosa que su manual no permite.

## Stack

Página estática sin build ni dependencias npm, más **una** función serverless
para el envío del formulario.

```
index.html             la página completa
styles.css             tokens de diseño + layout + responsive
script.js              nav activo al scrollear + envío del formulario
api/postular.js        función serverless: recibe la postulación y manda el mail
assets/logo-amcor.png  logo de cliente (único binario del proyecto)
vercel.json            headers y cleanUrls
CONTENIDO.md           qué dato es real, qué es supuesto y qué falta completar
```

## El formulario de postulación

El candidato completa y envía **sin salir de la página y sin abrir su cliente
de correo**: ve una confirmación en pantalla. El navegador hace `POST` a
`/api/postular`, y esa función manda el mail con [Resend](https://resend.com).

Si el envío falla por cualquier motivo, se le muestra el error y un link con el
mail prellenado como respaldo, para que la postulación no se pierda.

### Puesta en marcha (5 minutos, una sola vez)

1. Crear una cuenta gratis en [resend.com](https://resend.com) con la misma
   casilla que va a recibir las postulaciones.
2. En **API Keys**, generar una key (empieza con `re_`) y copiarla.
3. En Vercel: **Settings → Environment Variables**, agregar:

   | Variable | Valor | ¿Obligatoria? |
   |---|---|---|
   | `RESEND_API_KEY` | la key del paso 2 | **sí** |
   | `DESTINO_MAIL` | a dónde llegan las postulaciones | no, por defecto `drotondi@gmail.com` |
   | `REMITENTE_MAIL` | remitente del mail | no, por defecto `onboarding@resend.dev` |

4. Redeployar para que la función tome la variable.

Sin dominio verificado, Resend solo permite enviar **a la casilla con la que te
registraste** — que es exactamente este caso. Si más adelante querés que las
postulaciones vayan a otra dirección, hay que verificar un dominio en Resend y
cambiar `REMITENTE_MAIL`.

El plan gratuito cubre 3.000 mails por mes. El formulario trae un campo trampa
(*honeypot*) invisible: si un bot lo completa, la postulación se descarta en
silencio.

## Correr en local

```bash
python3 -m http.server 8000
```

Sirve para ver la página, pero **el formulario no va a enviar**: `/api/` no
existe en un servidor estático, así que se ve el mensaje de error con el link
de respaldo. Para probar el envío de verdad:

```bash
npx vercel dev
```

## Deploy en Vercel

1. Importar el repo en Vercel.
2. Framework Preset: **Other**. Build Command: vacío. Output Directory: `.`
3. Cargar `RESEND_API_KEY` (ver arriba) y deployar.

Ojo: por la función serverless, esto **ya no es un sitio puramente estático**.
En GitHub Pages o SharePoint la página se vería bien pero el formulario no
enviaría; habría que volver al mail prellenado.

## Dónde se editan las cosas

| Qué querés cambiar | Dónde |
|---|---|
| Textos, secciones, preguntas del FAQ | `index.html` |
| Colores, tipografías, espaciados | bloque `:root` al tope de `styles.css` |
| Mail que recibe las postulaciones | variable `DESTINO_MAIL` en Vercel (o la constante `DESTINO_POR_DEFECTO` en `api/postular.js`) |
| Texto del mail que te llega | función `handler` en `api/postular.js` |
| Texto de la confirmación en pantalla | función `mostrarExito` en `script.js` |
| Links a las apps | buscar `vercel.app` en `index.html` |
| Logos de clientes | sección `.clients` de `index.html` + archivos en `assets/` |
| Los videos de las clases | sección `#clase` de `index.html` |
| Las 24 herramientas por fase | sección `#fases` de `index.html` |

### Pasar la postulación a un Microsoft Form

Si en algún momento preferís procesarlas en Forms, reemplazar el cuerpo del
listener de `submit` en `script.js` por:

```js
window.open('https://forms.office.com/...', '_blank', 'noopener');
```

y borrar `api/postular.js`.

## Los videos de las clases

No se usa el `<iframe>` de YouTube directamente: cargaría más de 1 MB de
JavaScript de Google y dejaría cookies de rastreo en cada visita, aunque nadie
le dé play. En su lugar hay una **fachada**: se muestra la miniatura del video
y recién al hacer click se inserta el reproductor, desde `youtube-nocookie.com`.

La sección `#clase` muestra los videos en una grilla de dos columnas, que pasa
a una sola columna en pantallas chicas.

### Agregar, quitar o cambiar un video

El JavaScript recorre **todos** los `.video` de la página, así que no hay nada
que tocar fuera del HTML. Para sumar uno, copiar un bloque `<button class="video">`
entero dentro de `<div class="videos">` y reemplazar el **ID de YouTube** en los
tres lugares donde aparece: el `data-video` y las dos URLs de la miniatura.

El ID son los 11 caracteres que siguen a `youtu.be/` en el link para compartir.
En `https://youtu.be/hx4YluwhCkI?si=...` el ID es `hx4YluwhCkI`; lo que va
después del `?` se descarta.

Con tres o más videos conviene pasar la grilla a tres columnas, en la regla
`.videos` de `styles.css`.

El video tiene que ser **público o no listado** — uno privado muestra "Video no
disponible" a cualquiera que no sea su dueño.

## Pendientes de contenido

El programa tiene datos que todavía no están definidos (duración, calendario,
criterio de examen). Están marcados en la página con una etiqueta amarilla
`COMPLETAR` y listados en [`CONTENIDO.md`](CONTENIDO.md). **Resolverlos antes
de publicar**: las etiquetas son visibles para el visitante, a propósito.
