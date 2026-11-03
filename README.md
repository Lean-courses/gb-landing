# Landing — Programa Lean Six Sigma Green Belt

Página única, estática, en español. Presenta el programa Green Belt y recoge
postulaciones. Es la puerta de entrada a las dos apps del programa:
[MyGreenBeltProject](https://mygreenbeltclass.vercel.app/) y
[Sigma Sim](https://sigma-sim-one.vercel.app/).

## Cómo se ve

Estilo minimalista cálido (referencia: Claude / Notion): fondo crema, mucho
espacio en blanco, títulos en Times New Roman, un único acento verde oscuro
(`#1a5b43`) y bordes de 1px. El cuerpo va en sans por legibilidad: Times en
párrafos largos y en mobile se lee mal.

La página **no es de ninguna empresa en particular**: es la oferta del programa.
Amcor aparece una sola vez, como cliente, en la banda "Empresas que ya
confiaron" debajo del hero. Su logo se usa a color y sin filtros — aplicarle
`grayscale` alteraría la marca, cosa que su manual no permite.

## Stack

Ninguno. Tres archivos, cero dependencias, cero build.

```
index.html          la página completa
styles.css          tokens de diseño + layout + responsive
script.js           nav activo al scrollear + formulario -> mailto
assets/logo-amcor.png  logo de cliente (único binario del proyecto)
vercel.json         headers y cleanUrls para el deploy
CONTENIDO.md        qué dato es real, qué es supuesto y qué falta completar
```

Se abre con doble click en `index.html`. No necesita servidor ni internet para
renderizar (no carga fuentes ni librerías externas).

## Correr en local

```bash
python3 -m http.server 8000
```

Después abrir `http://localhost:8000`.

## Deploy en Vercel

1. Importar el repo en Vercel.
2. Framework Preset: **Other**. Build Command: vacío. Output Directory: `.`
3. Deploy. No hay variables de entorno.

Cualquier hosting estático sirve igual (GitHub Pages, S3, SharePoint).

## Dónde se editan las cosas

| Qué querés cambiar | Dónde |
|---|---|
| Textos, secciones, preguntas del FAQ | `index.html` |
| Colores, tipografías, espaciados | bloque `:root` al tope de `styles.css` |
| Mail que recibe las postulaciones | constante `DESTINO_POSTULACIONES` en `script.js` |
| Links a las apps | buscar `vercel.app` en `index.html` |
| Logos de clientes | sección `.clients` de `index.html` + archivos en `assets/` |
| Las 24 herramientas por fase | sección `#fases` de `index.html` |

### Pasar la postulación a un Microsoft Form

Hoy el formulario arma un mail prellenado a la casilla configurada. Para
cambiarlo a un Form, en `script.js` reemplazar el cuerpo del listener de
`submit` por:

```js
window.open('https://forms.office.com/...', '_blank', 'noopener');
```

o directamente convertir el botón en un enlace y borrar el `<form>`.

## Pendientes de contenido

El programa tiene datos que todavía no están definidos (duración, calendario,
criterio de examen). Están marcados en la página con una etiqueta amarilla
`COMPLETAR` y listados en [`CONTENIDO.md`](CONTENIDO.md). **Resolverlos antes
de publicar**: las etiquetas son visibles para el visitante, a propósito.
