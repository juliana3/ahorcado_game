// Variables globales del juego
let estadoJuego = {
  palabraActual: "",
  palabraAdivinada: [],
  letrasIncorrectas: [],
  intentosRestantes: 6,
  dificultadActual: "",
  juegoTerminado: false,
}



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
  "A","B","C","D","E","F","G","H","I",
  "J","K","L","M","N","Ñ","O","P","Q",
  "R","S","T","U","V","W","X","Y","Z",
]

// Partes del ahorcado en orden de aparición
const PARTES_AHORCADO = ["cabeza", "cuerpo", "brazo-izq", "brazo-der", "pierna-izq", "pierna-der"]


// Inicialización cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
  inicializarElementos()
  configurarEventListeners()
  mostrarPantalla("menu-principal")
  console.log("El Ahorcado - Aplicación iniciada correctamente")
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

  // Botones de navegación
  elementos.botonMenu = document.getElementById("boton-menu")
  elementos.botonJugarOtra = document.getElementById("boton-jugar-otra")
  elementos.botonMenuFin = document.getElementById("boton-menu-fin")

  // Elementos de fin de juego
  elementos.iconoResultado = document.getElementById("icono-resultado")
  elementos.mensajeResultado = document.getElementById("mensaje-resultado")
  elementos.palabraCorrecta = document.getElementById("palabra-correcta")
}

// Configurar todos los event listeners, lo que pasa cuando se hacce click en las cosas
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
    pantalla.classList.remove("activa") //recorre cada pantalle y le saca la clase activa
  })

  // Mostrar la pantalla solicitada
  const pantallaObjetivo = document.getElementById(nombrePantalla)
  if (pantallaObjetivo) {
    pantallaObjetivo.classList.add("activa") //agrega la clase activa a la pantalla que quiero mostrar
    console.log(`Cambiando a pantalla: ${nombrePantalla}`)
  }
}

// Función principal para iniciar un nuevo juego
function iniciarJuego(dificultad) {
  console.log(`Iniciando juego en dificultad: ${dificultad}`)

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
  actualizarDisplay()
  reiniciarDibujoAhorcado()

  // Mostrar pantalla de juego
  mostrarPantalla("pantalla-juego")

  console.log(`Palabra seleccionada: ${estadoJuego.palabraActual}`)
}

//actualiza la interfaz del juego con la información del nivel de dificultad pARA que se vea claramente el nivel en el que se esta jugando
function configurarInterfazJuego() {
  const infoDificultad = obtenerInfoDificultad(estadoJuego.dificultadActual)

  // Actualizar etiqueta de dificultad
  elementos.dificultadDisplay.textContent = infoDificultad.nombre
  elementos.dificultadDisplay.className = `etiqueta-dificultad ${infoDificultad.color}`
}



// Manejar la selección de una letra
function seleccionarLetra(letra) {
  //si el juego ya termino, corta la funcion , asegura que no s epueda seguir jugando despues de ganar o perder
  if (estadoJuego.juegoTerminado) return

  // Comprobar si la letra ya fue intentada (correcta o incorrecta)
  if (estadoJuego.letrasIncorrectas.includes(letra) || estadoJuego.palabraAdivinada.includes(letra)) {
    console.log(`Letra ya intentada: ${letra}`);
    return; // Salir si la letra ya se usó
  }

  // Verificar si la letra está en la palabra
  if (estadoJuego.palabraActual.includes(letra)) {
    // Letra correcta
    console.log(`Letra correcta: ${letra}`)

    // Actualizar palabra adivinada
    for (let i = 0; i < estadoJuego.palabraActual.length; i++) {
      if (estadoJuego.palabraActual[i] === letra) {
        estadoJuego.palabraAdivinada[i] = letra
      }
    }

    // Verificar si se completó la palabra
    if (!estadoJuego.palabraAdivinada.includes("_")) { //si no incluye _ entonces esta adivinada
      terminarJuego(true) // Victoria
    }
  } else {
    // Letra incorrecta
    console.log(`Letra incorrecta: ${letra}`)

    estadoJuego.letrasIncorrectas.push(letra)
    estadoJuego.intentosRestantes-- //resta 1

    // Dibujar siguiente parte del ahorcado
    dibujarSiguienteParteAhorcado()

    // Verificar si se terminaron los intentos
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
  const parteIndex = 6 - estadoJuego.intentosRestantes - 1 //esto determina que parte mostrar segun los errores
  if (parteIndex >= 0 && parteIndex < PARTES_AHORCADO.length) {
    const parteId = PARTES_AHORCADO[parteIndex] //obtiene el id de la parte a mostrar
    const elemento = document.getElementById(parteId) //busca el elemento en el DOM por su id
    if (elemento) {
      elemento.style.display = "block" // se hace visible la parte del ahorcado
      console.log(`Dibujando parte del ahorcado: ${parteId}`)
    }
  }
}

// Reiniciar el dibujo del ahorcado
function reiniciarDibujoAhorcado() {
  PARTES_AHORCADO.forEach((parteId) => {
    const elemento = document.getElementById(parteId)
    if (elemento) {
      elemento.style.display = "none" //oculta las partes del ahorcado antes de empezar un nuevo juego
    }
  })
}

// Terminar el juego con victoria o derrota
function terminarJuego(victoria) {
  estadoJuego.juegoTerminado = true

  console.log(`Juego terminado - ${victoria ? "Victoria" : "Derrota"}`)

  // Configurar pantalla de fin de juego
  setTimeout(() => {
    configurarPantallaFin(victoria)
    mostrarPantalla("pantalla-fin")
  }, 1500) // pausa para que el usuario vea el resultado. Espera 1.5 segunods antes de mostrar la pantalla de fin
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



// Función para manejar teclas del teclado 
document.addEventListener("keydown", (e) => {
  if (estadoJuego.juegoTerminado) return

  const tecla = e.key.toUpperCase() //convierte a mayus

  //se fuja que este en el abeceddario y que no haya sido usada antes
  if (ABECEDARIO.includes(tecla) && !estadoJuego.letrasIncorrectas.includes(tecla) && !estadoJuego.palabraAdivinada.includes(tecla)) {
    seleccionarLetra(tecla);
  }
})

