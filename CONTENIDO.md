# Contenido de la landing — origen y pendientes

Este archivo separa lo que es **dato verificado**, lo que es **supuesto** y lo
que es **recomendación**, para que nadie publique como hecho algo que nunca se
definió.

---

## 1. Datos verificados

Tomados de `drotondi/MyGreenBeltProject` (`README.md` y
`docs/especificacion-funcional.md`, versión noviembre 2026):

| Dato | Fuente |
|---|---|
| Las 5 fases DMAIC son secuenciales y cada una cierra con un tollgate | Spec, §2 Glosario |
| Son 24 herramientas, repartidas 6 / 6 / 4 / 4 / 4 por fase | README, §3 |
| El listado exacto de herramientas por fase (la sección que lo mostraba se quitó de la página; la cifra de 24 sigue en el hero) | README, §3 |
| El tollgate lo aprueba o rechaza el coach (MBB); el candidato presenta | Spec, §3.2 |
| El candidato no puede aprobar su propio tollgate ni elegir su coach | Spec, §3.2 |
| No se avanza de fase sin aprobar el tollgate; las obligatorias deben estar completas | README, §3 |
| La app calcula Cp/Cpk, nivel sigma, RPN del FMEA, ahorro anualizado y payback | README, §3 |
| El baseline de las métricas es de 3 meses | README, §1 |
| MyGreenBeltProject está en ES / EN / PT | README, encabezado |
| Las clases tienen tope de 30 proyectos | README, §1 (trigger `projects_cohort_limit`) |
| Hay tablero por clase con avance y ahorro consolidado | Spec, §1 |
| Roles del programa: director (admin), instructor/MBB (coach), candidato (member), sponsor/finanzas (viewer) | Spec, §3 |

Definido por el usuario en esta sesión:

- La formación dura **dos semanas**, e incluye teoría, práctica y la
  presentación del proyecto de cada candidato.
- **Antes del inicio se preseleccionan los proyectos** y se evalúa su
  factibilidad junto con los sponsors.
- Cada candidato tiene **un coach y un sponsor** asignados.
- **Sigma Sim** es una simulación del proceso DMAIC sobre un caso de estudio real.
- Las postulaciones van a `drotondi@gmail.com`, enviadas por el servidor
  (Resend) sin abrir el cliente de correo del candidato.
- La página **no se presenta como programa interno de Amcor**: Amcor figura
  como cliente en la banda "Empresas que ya confiaron".

---

## 2. Supuestos (redactados por Claude, no confirmados)

Son interpretaciones razonables que el usuario debería revisar antes de publicar.
Ninguno inventa cifras.

- **Los 6 perfiles destinatarios** (ingeniería de proceso, producción, calidad,
  supply chain, mejora continua, finanzas de planta). Derivados del contexto
  industrial de Amcor, no de una lista oficial del programa.
- **Los 3 requisitos de ingreso** (problema medible, sponsor, tiempo protegido).
  El sponsor ya es dato confirmado; los otros dos son el estándar de cualquier
  programa Green Belt serio, pero no están escritos en ningún documento.
- **Los criterios de certificación** (5 tollgates + impacto validado + plan de
  control vigente). Se desprenden de cómo funciona la app, pero no hay un
  documento de certificación que los fije.
- Los **ejemplos de problemas** del formulario y del FAQ (scrap de línea 3, etc.)
  son ilustrativos.

---

## 3. Pendientes — `[COMPLETAR]`

Marcados en la página con una etiqueta amarilla visible. Resolver antes de publicar.

| # | Qué falta | Dónde aparece |
|---|---|---|
| 1 | **Marca del programa**: hoy el header dice solo "Green Belt / Lean Six Sigma". Falta el nombre propio, y con él un logo | nav y footer |
| 2 | **Quién emite la certificación** | sección Certificación |
| 3 | **Dedicación semanal** estimada durante la ejecución del proyecto (las dos semanas de formación ya están definidas) | FAQ "¿Cuánto tiempo me demanda por semana?" |
| 4 | **Calendario de clases** y cupos disponibles del próximo ciclo | FAQ "¿Cuándo empieza la próxima clase?" |
| 5 | **Criterio de examen**: si hay evaluación teórica, nota mínima y momento | sección Certificación |
| 6 | **Modalidad** de las dos semanas: presencial, virtual o híbrida | sección Cómo funciona |
| 7 | **Los otros tres logos de clientes**: hoy son cajas punteadas que dicen "Tu empresa". Reemplazar por logos reales o reducir la fila a uno solo | banda `.clients` |
| 8 | **Duración total** del programa de punta a punta, desde la formación hasta el cierre del proyecto | no está en la página; conviene agregarlo al hero cuando se defina |

### Otros pendientes, no de contenido

- **No se pudo revisar la referencia.** `kaizen.com` estaba bloqueado por la
  política de red de la sesión en que se escribió esta página, igual que las dos
  apps de Vercel. El contenido se construyó desde el repo de MyGreenBeltProject.
  Vale una pasada de revisión contra el site de Kaizen.
- **Las descripciones de las dos apps** se escribieron sin poder abrirlas.
  Verificar que lo que dice la página coincide con lo que las apps hacen hoy.
- **Imagen OG**: falta una imagen de preview para cuando el link se comparta por
  Teams o mail. Hoy solo hay título y descripción.
