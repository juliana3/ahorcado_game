const { app, BrowserWindow, ipcMain } = require("electron")
const path = require("path")

// Mantener referencia global de la ventana
let ventanaPrincipal

function crearVentana() {
  // Crear la ventana del navegador
  ventanaPrincipal = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    title: "El Ahorcado",
    show: false, // No mostrar hasta que esté listo
  })

  // Cargar el archivo HTML de la aplicación
  ventanaPrincipal.loadFile("index.html")

  // Mostrar ventana cuando esté lista
  ventanaPrincipal.once("ready-to-show", () => {
    ventanaPrincipal.show()
  })

  // Abrir DevTools en modo desarrollo
  if (process.argv.includes("--dev")) {
    ventanaPrincipal.webContents.openDevTools()
  }

  // Emitido cuando la ventana se cierra
  ventanaPrincipal.on("closed", () => {
    ventanaPrincipal = null
  })
}

// Este método se llamará cuando Electron haya terminado la inicialización
app.whenReady().then(crearVentana)

// Salir cuando todas las ventanas estén cerradas
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    crearVentana()
  }
})

// Comunicación IPC para cambiar entre pantallas
ipcMain.on("cambiar-pantalla", (event, pantalla) => {
  event.reply("pantalla-cambiada", pantalla)
})

ipcMain.on("reiniciar-juego", (event) => {
  event.reply("juego-reiniciado")
})
