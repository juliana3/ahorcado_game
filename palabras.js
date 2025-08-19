// Base de datos de palabras organizadas por dificultad
const baseDatosPalabras = {
  facil: [
    "CASA",
    "GATO",
    "PERRO",
    "MESA",
    "SILLA",
    "AGUA",
    "FUEGO",
    "AIRE",
    "SOL",
    "LUNA",
    "MAR",
    "RIO",
    "PAN",
    "LECHE",
    "AMOR",
    "PAZ",
    "FLOR",
    "ARBOL",
    "PISO",
    "TECHO",
    "MANO",
    "PIE",
    "OJO",
    "BOCA",
  ],

  medio: [
    "CABALLO",
    "ESCUELA",
    "VENTANA",
    "COCINA",
    "JARDIN",
    "MUSICA",
    "PELOTA",
    "CAMINO",
    "BOSQUE",
    "CIUDAD",
    "PLAYA",
    "MONTAÑA",
    "FAMILIA",
    "AMIGOS",
    "TRABAJO",
    "ESTUDIO",
    "COMIDA",
    "BEBIDA",
    "VIAJE",
    "FIESTA",
    "REGALO",
    "SONRISA",
    "ABRAZO",
    "BESO",
  ],

  dificil: [
    "ELEFANTE",
    "MARIPOSA",
    "COMPUTADORA",
    "TELEFONO",
    "TELEVISION",
    "REFRIGERADOR",
    "AUTOMOVIL",
    "BICICLETA",
    "HELICOPTERO",
    "UNIVERSIDAD",
    "BIBLIOTECA",
    "RESTAURANTE",
    "SUPERMERCADO",
    "FARMACIA",
    "HOSPITAL",
    "AEROPUERTO",
    "ESTACION",
    "EDIFICIO",
    "APARTAMENTO",
    "CONSTRUCCION",
    "ARQUITECTURA",
    "INGENIERIA",
    "MATEMATICAS",
    "GEOGRAFIA",
    "HISTORIA",
    "LITERATURA",
  ],
}

// Función para obtener una palabra aleatoria según la dificultad
function obtenerPalabraAleatoria(dificultad) {
  const palabras = baseDatosPalabras[dificultad]
  const indiceAleatorio = Math.floor(Math.random() * palabras.length)
  return palabras[indiceAleatorio]
}

// Función para obtener información sobre la dificultad
function obtenerInfoDificultad(dificultad) {
  const info = {
    facil: { nombre: "FÁCIL", color: "facil", descripcion: "Hasta 4 letras" },
    medio: { nombre: "MEDIO", color: "medio", descripcion: "5 a 6 letras" },
    dificil: { nombre: "DIFÍCIL", color: "dificil", descripcion: "7 o más letras" },
  }

  return info[dificultad]
}
