# 📚 Ejercicios Prácticos - Aprende Programación

Estos ejercicios están diseñados para tu primer contacto con programación. **Haz cada uno paso a paso** y verás cómo funciona todo.

---

## 🎯 NIVEL 1: ENTENDER HTML (Lo básico)

### Ejercicio 1.1: Tu primer cambio en HTML ⭐

**¿Qué hacer?**
1. Abre `index.html` con un editor de texto (Bloc de notas, VS Code, etc.)
2. Busca esta línea:
   ```html
   <h1 class="logo">AtClass</h1>
   ```
3. Cambia `AtClass` por tu nombre
4. Guarda (Ctrl+S)
5. Abre `index.html` en el navegador

**Resultado:** Verás tu nombre en la parte superior de la app

**¿Qué aprendiste?** El HTML controla lo que ves en la página

---

### Ejercicio 1.2: Agregar un nuevo botón

**¿Qué hacer?**
1. Abre `index.html`
2. Busca esta seción (en `id="home"`):
   ```html
   <h2>Learn Mathematics</h2>
   <p>Master math concepts at your own pace</p>
   <button class="btn btn-primary" id="startBtn">Start Learning</button>
   ```
3. Después del botón `Start Learning`, agrega este nuevo botón:
   ```html
   <button class="btn btn-primary">Ver Tutorial</button>
   ```
4. Guarda y recarga el navegador (F5)

**Resultado:** Verás un nuevo botón debajo del primero

**¿Qué aprendiste?** Cómo agregar elementos HTML

---

### Ejercicio 1.3: Cambiar un título

**¿Qué hacer?**
1. Abre `index.html`
2. Busca:
   ```html
   <h2>Learn Mathematics</h2>
   ```
3. Cambia el texto a algo más divertido, por ejemplo:
   ```html
   <h2>🎓 ¡Aprende Matemáticas Gratis!</h2>
   ```
4. Guarda y recarga

**Resultado:** El título habrá cambiado

**¿Qué aprendiste?** Puedes editar directamente el contenido

---

## 🎨 NIVEL 2: JUGAR CON CSS (Los colores)

### Ejercicio 2.1: Cambiar el color principal

**¿Qué hacer?**
1. Abre `styles.css`
2. Ve al inicio donde está esto (línea ~1):
   ```css
   :root {
       --primary-color: #6366f1;
   ```
3. Cambia el color. Prueba estos:
   - `#FF6B6B` (Rojo)
   - `#4ECDC4` (Turquesa)
   - `#95E1D3` (Menta)
   - `#F7DC6F` (Amarillo)
4. Guarda (Ctrl+S)
5. Recarga el navegador (F5)

**Resultado:** El color de la app cambia completamente

**¿Qué aprendiste?** Las variables CSS controlan los valores que se reutilizan

**Prueba:** Encuentra el máximo de colores que puedas cambiar

---

### Ejercicio 2.2: Hacer el texto más grande

**¿Qué hacer?**
1. Abre `styles.css`
2. Busca la sección sobre títulos (busca `h2 {`):
   ```css
   h2 {
       font-size: 1.75rem;
       margin-bottom: var(--spacing-lg);
       color: var(--text-color);
   }
   ```
3. Cambia `1.75rem` a `2.5rem`
4. Guarda y recarga

**Resultado:** Los títulos serán más grandes

**¿Qué aprendiste?** `font-size` controla qué tan grandes son las letras

---

### Ejercicio 2.3: Cambiar el color del botón

**¿Qué hacer?**
1. Abre `styles.css`
2. Busca:
   ```css
   .btn-primary {
       background-color: var(--primary-color);
       color: white;
   }
   ```
3. Cambia `var(--primary-color)` a cualquier color:
   ```css
   .btn-primary {
       background-color: #FF6B6B;
       color: white;
   }
   ```
4. Guarda y recarga

**Resultado:** Los botones tendrán otro color

**¿Qué aprendiste?** Puedes anular los estilos específicamente

---

## ⚙️ NIVEL 3: JAVASCRIPT (El cerebro)

### Ejercicio 3.1: Ver el progreso guardado

**¿Qué hacer?**
1. Abre `index.html` en el navegador
2. Haz click en los botones de Topics
3. Presiona **F12** (abre las herramientas del desarrollador)
4. En la consola, copia esto y presiona Enter:
   ```javascript
   console.log(AtClass.progressTracker.data)
   ```

**Resultado:** Verás un objeto con tu progreso

**¿Qué aprendiste?** JavaScript accede y manipula datos

---

### Ejercicio 3.2: Completar una lección desde la consola

**¿Qué hacer?**
1. Abre `index.html` en el navegador
2. Presiona F12 (consola)
3. Copia esto:
   ```javascript
   AtClass.progressTracker.completeLesson()
   ```
4. Presiona Enter 5 veces
5. Ahora copia:
   ```javascript
   AtClass.progressTracker.data
   ```

**Resultado:** Los números de lecciones y puntos habrán cambiado

**¿Qué aprendiste?** Las funciones JavaScript hacen cosas. Pueden cambiar datos.

---

### Ejercicio 3.3: Crear un evento simple

**¿Qué hacer?**
1. Abre `script.js`
2. Ve al final del archivo
3. Agrega esto:
   ```javascript
   // Mi primer evento
   console.log('¡Mi script está cargado!');
   ```
4. Guarda y recarga `index.html`
5. Abre la consola (F12)

**Resultado:** Verás el mensaje en la consola

**¿Qué aprendiste?** `console.log()` imprime mensajes para debug

---

## 🔥 NIVEL 4: MODIFICACIONES PRÁCTICAS

### Ejercicio 4.1: Cambiar el nombre de un tema

**¿Qué hacer?**
1. Abre `index.html`
2. Busca todos los `<div class="topic-card">`
3. El primero dice:
   ```html
   <h3>Basic Arithmetic</h3>
   <p>Addition, subtraction, multiplication, division</p>
   ```
4. Cambia a:
   ```html
   <h3>Sumas y Restas</h3>
   <p>Aprende a sumar y restar números fácilmente</p>
   ```
5. Guarda y recarga

**Resultado:** El tema de matemáticas básicas tendrá un nuevo nombre

**¿Qué aprendiste?** Puedes personalizar todo el contenido

---

### Ejercicio 4.2: Agregar 2 temas nuevos

**¿Qué hacer?**
1. Abre `index.html`
2. Ve a la sección Topics (busca `id="topics"`)
3. Después del último tema, agrega esto:
   ```html
   <div class="topic-card">
       <h3>📐 Trigonometría</h3>
       <p>Seno, coseno y tangente</p>
       <button class="btn btn-secondary">Learn</button>
   </div>
   <div class="topic-card">
       <h3>📊 Estadística</h3>
       <p>Gráficas, promedio y probabilidad</p>
       <button class="btn btn-secondary">Learn</button>
   </div>
   ```
4. Guarda y recarga

**Resultado:** Verás 2 temas nuevos en la app

**¿Qué aprendiste?** Puedes duplicar y crear nuevos elementos

---

### Ejercicio 4.3: Cambiar los colores del tema

**¿Qué hacer?**
1. Abre `styles.css`
2. Busca:
   ```css
   :root {
       --primary-color: #6366f1;
       --secondary-color: #ec4899;
   ```
3. Cámbialos por colores que te gusten:
   ```css
   --primary-color: #4ECDC4;
       --secondary-color: #FF6B6B;
   ```
4. Guarda y recarga

**Resultado:** La app tendrá nuevos colores por todas partes

**¿Qué aprendiste?** CSS variables propagarse a todos lados

---

## 💪 NIVEL 5: DESAFÍOS FINALES

### Desafío 5.1: Personalización Completa

**¿Qué hacer?**
Personaliza tu app con:
1. Cambia el nombre de la app (2 sitios: `index.html` y `manifest.json`)
2. Cambia todos los colores principales
3. Agrega 3 nuevos temas
4. Actualiza el mensaje de bienvenido

**Resultado:** Una app totalmente tuya

---

### Desafío 5.2: Agregar datos en lessons.json

**¿Qué hacer?**
1. Abre `assets/data/lessons.json`
2. Busca el último ejercicio:
   ```json
   {
     "id": "ex-05",
     "topicId": "geometry",
     "question": "How many sides does a square have?",
     "type": "multiple-choice",
     "options": ["2", "3", "4", "5"],
     "correctAnswer": "4",
     "difficulty": "easy"
   }
   ```
3. Después de ese `}`, antes de `]`, agrega una coma y un ejercicio nuevo:
   ```json
   ,
   {
     "id": "ex-06",
     "topicId": "arithmetic",
     "question": "What is 10 + 15?",
     "type": "multiple-choice",
     "options": ["20", "25", "30", "35"],
     "correctAnswer": "25",
     "difficulty": "easy"
   }
   ```
4. Guarda

**Resultado:** Un nuevo ejercicio está en tu base de datos

---

## 📖 RESPUESTAS: Soluciones

Aquí encontrarás evidencia de que completaste los ejercicios:

### Comprobación 1.1 ✅
```
Deberías ver tu nombre en la parte superior en lugar de "AtClass"
```

### Comprobación 2.1 ✅
```
Los colores en la app cambiaron (encabezado, botones, etc.)
```

### Comprobación 3.2 ✅
```
Tu progreso aumentó. Si ejecutaste 5 veces completeLesson(), 
verás lessonsDone: 5, score: 50
```

### Comprobación 4.3 ✅
```
Los colores principales de la app son nuevos
```

---

## 🎓 Conceptos que aprendiste:

| Ejercicio | Concepto |
|-----------|----------|
| 1.1 - 1.3 | **HTML**: Estructura, contenido, etiquetas |
| 2.1 - 2.3 | **CSS**: Colores, tamaños, variables |
| 3.1 - 3.3 | **JavaScript**: Funciones, variables, eventos |
| 4.1 - 4.3 | **Personalización**: Modificar todo |
| 5.1 - 5.2 | **Integración**: Todo junto |

---

## 🚀 Próximos pasos:

Cuando termines todos los ejercicios:

1. **Agrega 10 ejercicios más** a `lessons.json`
2. **Crea una página nueva** (por ejemplo, "Configuración")
3. **Agrega un botón** que reinicie el progreso
4. **Cambia los estilos** para que sea completamente diferente

---

## ❓ Ayuda rápida:

**P: Me puse un color y está todo deformado**
R: Undo (Ctrl+Z) y vuelve a intentar con un color diferente

**P: La app no carga**
R: Presiona F5 para recargar completamente. Si aún no funciona, verifica que guardaste bien (Ctrl+S)

**P: No entiendo una parte**
R: Lee ese ejercicio nuevamente, paso por paso, muy lentamente

**P: ¿Puedo hacer los ejercicios en otro orden?**
R: Sí, pero mejor empieza por el nivel 1 para entender lo básico

---

## 💡 Consejos de un programador:

1. **Guarda frecuentemente** (Ctrl+S) - No pierdas tu trabajo
2. **Recarga el navegador** (F5) después de cambios
3. **Lee los errores** en la consola (F12) - Te dicen qué está mal
4. **Experimenta** - Intenta cosas nuevas sin miedo a romper
5. **Toma breaks** - Programa 30 min, descansa 5. Tu cerebro necesita procesar

---

**¡Éxito con tu aprendizaje! 🎉 Recuerda: Todos los programadores empezaron donde estás tú ahora.**
