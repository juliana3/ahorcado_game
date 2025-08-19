// Variables globales del juego
let estadoJuego = {
  palabraActual: "",
  palabraAdivinada: [],
  letrasIncorrectas: [],
  intentosRestantes: 6,
  dificultadActual: "",
  juegoTerminado: false,
}

// Importo las funciones del archivo palabras.js
const { ipcRenderer } = require('electron');


// Elementos del DOM
const elementos = {
  // Pantallas
  menuPrincipal: null,
  pantallaJuego: null,
  pantallaFin: null,

  // Botones del menú
  botonesDificultad: null,

  // Elementos del juego
  dibujoAhorcado: null,
  palabraDisplay: null,
  letrasIncorrectasDisplay: null,
  intentosDisplay: null,
  dificultadDisplay: null,
  abecedario: null,

  // Botones de navegación
  botonMenu: null,
  botonJugarOtra: null,
  botonMenuFin: null,

  // Elementos de fin de juego
  iconoResultado: null,
  mensajeResultado: null,
  palabraCorrecta: null,
}

// Abecedario español
const ABECEDARIO = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "Ñ",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
]

// Partes del ahorcado en orden de aparición
const PARTES_AHORCADO = ["cabeza", "cuerpo", "brazo-izq", "brazo-der", "pierna-izq", "pierna-der"]


// Inicialización cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
  inicializarElementos()
  configurarEventListeners()
  mostrarPantalla("menu-principal")
  console.log("🎯 El Ahorcado - Aplicación iniciada correctamente")
})

// Función para inicializar referencias a elementos del DOM
function inicializarElementos() {
  // Pantallas
  elementos.menuPrincipal = document.getElementById("menu-principal")
  elementos.pantallaJuego = document.getElementById("pantalla-juego")
  elementos.pantallaFin = document.getElementById("pantalla-fin")

  // Botones del menú
  elementos.botonesDificultad = document.querySelectorAll(".boton-dificultad")

  // Elementos del juego
  elementos.dibujoAhorcado = document.getElementById("dibujo-ahorcado")
  elementos.palabraDisplay = document.getElementById("palabra-adivinada")
  elementos.letrasIncorrectasDisplay = document.getElementById("lista-incorrectas")
  elementos.intentosDisplay = document.getElementById("intentos-restantes")
  elementos.dificultadDisplay = document.getElementById("dificultad-actual")
  elementos.abecedario = document.getElementById("letras-abecedario")

  // Botones de navegación
  elementos.botonMenu = document.getElementById("boton-menu")
  elementos.botonJugarOtra = document.getElementById("boton-jugar-otra")
  elementos.botonMenuFin = document.getElementById("boton-menu-fin")

  // Elementos de fin de juego
  elementos.iconoResultado = document.getElementById("icono-resultado")
  elementos.mensajeResultado = document.getElementById("mensaje-resultado")
  elementos.palabraCorrecta = document.getElementById("palabra-correcta")
}

// Configurar todos los event listeners
function configurarEventListeners() {
  // Botones de dificultad
  elementos.botonesDificultad.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      const dificultad = e.currentTarget.dataset.dificultad
      iniciarJuego(dificultad)
    })
  })

  // Botones de navegación
  elementos.botonMenu.addEventListener("click", () => {
    mostrarPantalla("menu-principal")
  })

  elementos.botonJugarOtra.addEventListener("click", () => {
    iniciarJuego(estadoJuego.dificultadActual)
  })

  elementos.botonMenuFin.addEventListener("click", () => {
    mostrarPantalla("menu-principal")
  })
}

// Función para mostrar una pantalla específica
function mostrarPantalla(nombrePantalla) {
  // Ocultar todas las pantallas
  document.querySelectorAll(".pantalla").forEach((pantalla) => {
    pantalla.classList.remove("activa")
  })

  // Mostrar la pantalla solicitada
  const pantallaObjetivo = document.getElementById(nombrePantalla)
  if (pantallaObjetivo) {
    pantallaObjetivo.classList.add("activa")
    console.log(`📱 Cambiando a pantalla: ${nombrePantalla}`)
  }
}

// Función principal para iniciar un nuevo juego
function iniciarJuego(dificultad) {
  console.log(`🎮 Iniciando juego en dificultad: ${dificultad}`)

  // Reiniciar estado del juego
  estadoJuego = {
    palabraActual: obtenerPalabraAleatoria(dificultad),
    palabraAdivinada: [],
    letrasIncorrectas: [],
    intentosRestantes: 6,
    dificultadActual: dificultad,
    juegoTerminado: false,
  }

  // Inicializar palabra adivinada con guiones bajos
  estadoJuego.palabraAdivinada = new Array(estadoJuego.palabraActual.length).fill("_")

  // Configurar interfaz del juego
  configurarInterfazJuego()
  crearAbecedario()
  actualizarDisplay()
  reiniciarDibujoAhorcado()

  // Mostrar pantalla de juego
  mostrarPantalla("pantalla-juego")

  console.log(`🔤 Palabra seleccionada: ${estadoJuego.palabraActual}`)
}

// Configurar la interfaz del juego con la información actual
function configurarInterfazJuego() {
  const infoDificultad = obtenerInfoDificultad(estadoJuego.dificultadActual)

  // Actualizar etiqueta de dificultad
  elementos.dificultadDisplay.textContent = infoDificultad.nombre
  elementos.dificultadDisplay.className = `etiqueta-dificultad ${infoDificultad.color}`
}

// Crear los botones del abecedario. Lo borre a ver que onda
function crearAbecedario() {}

// Manejar la selección de una letra
function seleccionarLetra(letra) {
  if (estadoJuego.juegoTerminado) return

  // Comprobar si la letra ya fue intentada (correcta o incorrecta)
  if (estadoJuego.letrasIncorrectas.includes(letra) || estadoJuego.palabraAdivinada.includes(letra)) {
    console.log(`❕ Letra ya intentada: ${letra}`);
    return; // Salir si la letra ya se usó
  }

  // Verificar si la letra está en la palabra
  if (estadoJuego.palabraActual.includes(letra)) {
    // Letra correcta
    console.log(`✅ Letra correcta: ${letra}`)

    // Actualizar palabra adivinada
    for (let i = 0; i < estadoJuego.palabraActual.length; i++) {
      if (estadoJuego.palabraActual[i] === letra) {
        estadoJuego.palabraAdivinada[i] = letra
      }
    }

    // Verificar si se completó la palabra
    if (!estadoJuego.palabraAdivinada.includes("_")) {
      terminarJuego(true) // Victoria
    }
  } else {
    // Letra incorrecta
    console.log(`❌ Letra incorrecta: ${letra}`)

    estadoJuego.letrasIncorrectas.push(letra)
    estadoJuego.intentosRestantes--

    // Dibujar siguiente parte del ahorcado
    dibujarSiguienteParteAhorcado()

    // Verificar si se acabaron los intentos
    if (estadoJuego.intentosRestantes <= 0) {
      terminarJuego(false) // Derrota
    }
  }

  // Actualizar la interfaz
  actualizarDisplay()
}

// Actualizar todos los elementos de la interfaz
function actualizarDisplay() {
  // Actualizar palabra adivinada
  elementos.palabraDisplay.textContent = estadoJuego.palabraAdivinada.join(" ")

  // Actualizar letras incorrectas
  elementos.letrasIncorrectasDisplay.textContent = estadoJuego.letrasIncorrectas.join(" ")

  // Actualizar intentos restantes
  elementos.intentosDisplay.textContent = `Intentos: ${estadoJuego.intentosRestantes}`

  // Cambiar color de intentos según la cantidad restante
  if (estadoJuego.intentosRestantes <= 2) {
    elementos.intentosDisplay.style.color = "var(--color-peligro)"
  } else if (estadoJuego.intentosRestantes <= 4) {
    elementos.intentosDisplay.style.color = "var(--color-advertencia)"
  } else {
    elementos.intentosDisplay.style.color = "var(--color-texto)"
  }
}

// Dibujar la siguiente parte del ahorcado
function dibujarSiguienteParteAhorcado() {
  const parteIndex = 6 - estadoJuego.intentosRestantes - 1
  if (parteIndex >= 0 && parteIndex < PARTES_AHORCADO.length) {
    const parteId = PARTES_AHORCADO[parteIndex]
    const elemento = document.getElementById(parteId)
    if (elemento) {
      elemento.style.display = "block"
      console.log(`🎨 Dibujando parte del ahorcado: ${parteId}`)
    }
  }
}

// Reiniciar el dibujo del ahorcado
function reiniciarDibujoAhorcado() {
  PARTES_AHORCADO.forEach((parteId) => {
    const elemento = document.getElementById(parteId)
    if (elemento) {
      elemento.style.display = "none"
    }
  })
}

// Terminar el juego con victoria o derrota
function terminarJuego(victoria) {
  estadoJuego.juegoTerminado = true

  console.log(`🏁 Juego terminado - ${victoria ? "Victoria" : "Derrota"}`)

  // Deshabilitar todos los botones de letras
  document.querySelectorAll(".letra-boton").forEach((boton) => {
    boton.disabled = true
  })

  // Configurar pantalla de fin de juego
  setTimeout(() => {
    configurarPantallaFin(victoria)
    mostrarPantalla("pantalla-fin")
  }, 1500) // Pequeña pausa para que el usuario vea el resultado
}

// Configurar la pantalla de fin de juego
function configurarPantallaFin(victoria) {
  if (victoria) {
    // Victoria
    elementos.iconoResultado.textContent = "🎉"
    elementos.mensajeResultado.textContent = "¡FELICIDADES!"
    elementos.mensajeResultado.className = "mensaje-resultado victoria"
    elementos.palabraCorrecta.innerHTML = `Has adivinado la palabra: <strong>${estadoJuego.palabraActual}</strong>`
  } else {
    // Derrota
    elementos.iconoResultado.textContent = "😔"
    elementos.mensajeResultado.textContent = "¡GAME OVER!"
    elementos.mensajeResultado.className = "mensaje-resultado derrota"
    elementos.palabraCorrecta.innerHTML = `La palabra era: <strong>${estadoJuego.palabraActual}</strong>`
  }
}

// Función de utilidad para logging del estado del juego
function mostrarEstadoJuego() {
  console.log("🎯 Estado actual del juego:", {
    palabra: estadoJuego.palabraActual,
    adivinada: estadoJuego.palabraAdivinada.join(""),
    incorrectas: estadoJuego.letrasIncorrectas,
    intentos: estadoJuego.intentosRestantes,
    dificultad: estadoJuego.dificultadActual,
    terminado: estadoJuego.juegoTerminado,
  })
}

// Función para manejar teclas del teclado 
document.addEventListener("keydown", (e) => {
  if (estadoJuego.juegoTerminado) return

  const tecla = e.key.toUpperCase()

  // Solo procesar letras del abecedario
  if (ABECEDARIO.includes(tecla) && !estadoJuego.letrasIncorrectas.includes(tecla) && !estadoJuego.palabraAdivinada.includes(tecla)) {
    seleccionarLetra(tecla);
  }
})

// Manejo de errores globales
window.addEventListener("error", (e) => {
  console.error("❌ Error en la aplicación:", e.error)
})

// Función para debugging (solo en desarrollo)
if (process && process.argv && process.argv.includes("--dev")) {
  window.mostrarEstadoJuego = mostrarEstadoJuego
  window.estadoJuego = estadoJuego
  console.log("🔧 Modo desarrollo activado - Funciones de debug disponibles")
}
