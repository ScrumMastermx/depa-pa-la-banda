# Guía de inicio (sin experiencia técnica)

[English](GETTING-STARTED.md)

Toma unos 10 minutos, incluyendo tu primera conversación de configuración.

## 1. Consigue Claude con Claude Code
1. Regístrate en [claude.ai](https://claude.ai) y elige un plan de pago que incluya
   Claude Code (Pro basta para empezar).
2. Descarga la **app de escritorio de Claude** para Mac o Windows desde
   [claude.com/download](https://claude.com/download) e inicia sesión.
3. En la app, abre la pestaña **Code**. Eso es Claude Code.
4. En Windows, instala también [Git for Windows](https://git-scm.com/download/win)
   (dale Siguiente a todo). Claude Code lo usa para ejecutar comandos pequeños.

> ¿Ya usas la terminal? Instala Claude Code desde
> [claude.com/claude-code](https://claude.com/claude-code) y ejecuta `claude`
> dentro de tu carpeta. Los pasos son los mismos.

## 2. Crea tu carpeta de búsqueda
1. Crea una carpeta nueva y vacía, por ejemplo **Documentos → Depa**.
2. En la pestaña Code, elige **esa carpeta** como carpeta de trabajo.

Por qué una carpeta aparte: todo lo que Depa escribe (tus criterios, los anuncios,
tus contactos, tu agenda) va ahí, y solo ahí.

## 3. Instala Depa
Escribe esta línea en el chat y presiona Enter:

```
/plugin marketplace add ScrumMastermx/depa-pa-la-banda
```

Luego esta:

```
/plugin install depa@depa-pa-la-banda
```

Reinicia la sesión si Claude te lo pide.

## 4. Tu primera conversación
Escribe:

```
/depa:setup
```

Claude te hace preguntas cortas: ciudad, el lugar al que quieres quedar cerca, tu
**presupuesto máximo total con mantenimiento incluido**, recámaras, mascotas, hijos,
amueblado o no, colonias, fechas y cómo puedes garantizar la renta. Contesta lo que
sepas; "no sé" también vale.

## 5. Encuentra depas y lleva el control
1. `/depa:buscar` encuentra anuncios nuevos y te dice cuáles parecen fraude.
2. `/depa:tablero` publica tu tablero como una página privada de claude.ai (o crea un `board.html` local si tu Claude Code no puede publicar páginas) y te da el enlace.
3. `/depa:mensajes` redacta los mensajes a los agentes. **Tú los copias y los envías.**
4. `/depa:agenda` planea tus visitas; `/depa:requisitos` explica lo que te van a pedir
   y qué revisar en persona; `/depa:seguimiento` te recuerda quién no ha contestado.

## Mover tarjetas en el tablero
**Tablero compartido (por defecto).** Arrastra una tarjeta a otra columna, usa su menú "Mover a..." o ábrela para
editar las notas. Todo se guarda en una base de datos compartida; Claude ve lo mismo. Para sumar a tu pareja, abre el
tablero en claude.ai, da clic en Compartir e invítala por correo como **Editor** (o Colaborador). Quien solo ve o
comenta no puede editar. También puedes decirle a Claude ("mueve Blue Door a finalistas").

**`board.html` local (alternativa).** En Chrome o Edge da clic en **Conectar carpeta**, elige tu carpeta de búsqueda
y los cambios se escriben directo en `listings.json`. En otros navegadores los cambios se quedan en ese navegador; da
clic en **Exportar JSON**, guarda el archivo en tu carpeta y di "importa el tablero".

## Opcional: conecta Chrome
Instala la extensión [Claude in Chrome](https://claude.com/chrome) e inicia sesión.
Depa podrá leer portales de anuncios en tu propio navegador, página por página,
como lo harías tú. Se detiene si un sitio te pide iniciar sesión o demostrar que
eres humano; eso lo haces tú. Nunca da clic en Enviar por ti.

## Seguridad en un minuto
- Nunca pagues un "apartado" antes de ver el depa y el contrato.
- Nunca mandes tu identificación ni datos bancarios a quien no te ha enseñado el lugar.
- Si te presionan con urgencia, frena. Pregúntale a `/depa:requisitos`.
