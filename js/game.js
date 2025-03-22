let canvas,
world,
fullscreenMode = false,
currentLevel = 1
const keyboard = new Keyboard(),
levels = []
window.gameRunning = false
let isRestarting = false
let gameOverShown = false 


function init() {
  initLevels()
  window.initAudio()
  addTouchListeners()
  addKeyboardListeners()
  window.addEventListener("resize", checkOrientation)
  window.addEventListener("orientationchange", checkOrientation)
  checkOrientation()
  window.scrollTo(0, 0, checkOrientation)
  checkOrientation()
  window.scrollTo(0, 0)
  toggleStartScreen(true)
  window.playBackgroundMusic()
  window.updateMuteIcon()
  window.gameRunning = false
  isRestarting = false
  gameOverShown = false

  // Canvas-Element sichtbar machen und Größe setzen
  const canvasElement = document.getElementById("canvas")
  if (canvasElement) {
    canvasElement.style.display = "block"
    canvasElement.style.visibility = "visible"
    canvasElement.width = 720
    canvasElement.height = 480
  }

  requestAnimationFrame(gameLoop)
}
window.init = init

/**
 * Hauptspiel-Loop, der regelmäßig die Welt aktualisiert.
 * Wird pro Frame aufgerufen.
 */
function gameLoop() {
  if (window.gameRunning && world && typeof world.update === "function") {
    world.update()
  }
  requestAnimationFrame(gameLoop)
}

/**
 * Fügt Touch-Event-Listener für die mobilen Steuerknöpfe hinzu.
 * Ermöglicht die Steuerung auf Touchscreens.
 */
function addTouchListeners() {
  setupTouchButton("btn-left", "LEFT")
  setupTouchButton("btn-right", "RIGHT")
  setupTouchButton("btn-jump", "SPACE")
  setupTouchButton("btn-throw", "D")
}

/**
 * Registriert Touch-Event-Listener für einen Button.
 * @param {string} id - Die HTML-ID des Buttons.
 * @param {string} key - Der zu setzende Tastencode.
 */
function setupTouchButton(id, key) {
  const btn = document.getElementById(id)
  if (!btn) return
  btn.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault()
      keyboard[key] = true
    },
    { passive: false },
  )
  btn.addEventListener(
    "touchend",
    (e) => {
      e.preventDefault()
      keyboard[key] = false
    },
    { passive: false },
  )
}

/**
 * Lädt alle Level in das levels-Array.
 * Initialisiert die Level-Daten aus den externen Level-Dateien.
 */
function initLevels() {
  if (typeof window.initLevel1 === "function") levels[1] = window.initLevel1()
  if (typeof window.initLevel2 === "function") levels[2] = window.initLevel2()
  if (typeof window.initLevel3 === "function") levels[3] = window.initLevel3()
}

/**
 * Startet das Spiel und initialisiert die Spielwelt.
 * Zeigt den Ladescreen und bereitet das Spielfeld vor.
 */
function startGame() {
  toggleLoader(true)
  setTimeout(() => {
    toggleLoader(false)
    if (window.gameRunning) return

    // Startscreen komplett ausblenden
    const startScreen = document.getElementById("start-screen")
    if (startScreen) {
      startScreen.style.display = "none"
      startScreen.style.visibility = "hidden"
    }

    // Game Container an der gleichen Position anzeigen
    const gameContainer = document.getElementById("game-container")
    if (gameContainer) {
      gameContainer.style.display = "block"
      gameContainer.style.visibility = "visible"
      gameContainer.classList.remove("d-none")
    }

    // Canvas sichtbar machen
    canvas = document.getElementById("canvas")
    if (canvas) {
      canvas.style.display = "block"
      canvas.style.visibility = "visible"
      canvas.width = 720
      canvas.height = 480
    }

    // Mobile Buttons anzeigen wenn nötig
    const mobileButtons = document.getElementById("mobile-buttons")
    if (mobileButtons && window.innerWidth < 1024) {
      mobileButtons.style.display = "flex"
      mobileButtons.classList.remove("d-none")
    }

    initGameWorld()
    window.gameRunning = true

    if (window.innerWidth < 1024) {
      document.body.classList.add("game-running-mobile")
    }

    window.scrollTo(0, 0)
    if (canvas) canvas.focus()
    window.playSnoreSound()
  }, 1000)
}
window.startGame = startGame

/**
 * Zeigt oder versteckt den Loader.
 * @param {boolean} show - true, um den Loader anzuzeigen.
 */
function toggleLoader(show) {
  const loader = document.getElementById("loader-overlay")
  if (loader) loader.classList.toggle("d-none", !show)
}

/**
 * Blendet den Startbildschirm ein oder aus.
 * @param {boolean} show - true, um den Startbildschirm anzuzeigen.
 */
function toggleStartScreen(show) {
  const startScreen = document.getElementById("start-screen")
  const gameContainer = document.getElementById("game-container")
  const mobileButtons = document.getElementById("mobile-buttons")

  if (startScreen) {
    startScreen.style.display = show ? "flex" : "none"
    if (show) {
      startScreen.classList.remove("d-none")
    } else {
      startScreen.classList.add("d-none")
    }
  }

  if (gameContainer) {
    gameContainer.style.display = show ? "none" : "block"
    if (show) {
      gameContainer.classList.add("d-none")
    } else {
      gameContainer.classList.remove("d-none")
    }
  }

  if (mobileButtons) {
    mobileButtons.style.display = show || window.innerWidth >= 1024 ? "none" : "flex"
    if (show || window.innerWidth >= 1024) {
      mobileButtons.classList.add("d-none")
    } else {
      mobileButtons.classList.remove("d-none")
    }
  }

  // Impressum während des Spiels ausblenden
  const impressumBtn = document.getElementById("impressum-btn")
  if (impressumBtn) {
    impressumBtn.style.display = show ? "block" : "none"
  }
}

/**
 * Initialisiert die Spielwelt mit dem aktuellen Level.
 * Erstellt eine neue World-Instanz.
 */
function initGameWorld() {
  if (!levels[currentLevel]) initLevels()
  world = new World(canvas, keyboard, levels[currentLevel])
  world.currentLevel = currentLevel
}

/**
 * Zeigt den Game-Over-Bildschirm an.
 * Stoppt die Spiellogik und spielt den Game-Over-Sound ab.
 */
function showGameOver() {
  if (gameOverShown) return
  gameOverShown = true
  
  // Alle Sounds stoppen
  if (typeof window.stopAllSounds === "function") window.stopAllSounds()
  
  toggleGameScreens(true)
  window.gameRunning = false
  
  // Welt stoppen und aufräumen
  if (world && typeof world.stop === "function") {
    world.stop()
    world.isGameOver = true
  }
  
  if (typeof window.playGameOverSound === "function") window.playGameOverSound()
}
window.showGameOver = showGameOver

/**
 * Schaltet zwischen den Spielbildschirmen um.
 * @param {boolean} isGameOver - true, wenn Game Over angezeigt werden soll.
 */
function toggleGameScreens(isGameOver) {
  document.getElementById("game-container").classList.toggle("d-none", isGameOver)
  document.getElementById("mobile-buttons").classList.toggle("d-none", isGameOver)
  document.getElementById("game-over").classList.toggle("d-none", !isGameOver)
}

/**
 * Setzt das Spiel zurück und startet es neu.
 * Bereinigt den alten Spielzustand und initialisiert einen neuen.
 */
function restartGame() {
  if (isRestarting) return
  isRestarting = true

  window.stopAllSounds()

  // Bereinigen des alten Zustands
  if (world && typeof world.stop === "function") {
    world.stop()
  }

  // Entfernen aller Overlays
  document.getElementById("victory-overlay")?.remove()
  const gameOverOverlay = document.getElementById("game-over")
  if (gameOverOverlay) gameOverOverlay.classList.add("d-none")
  const gameWonOverlay = document.getElementById("game-won")
  if (gameWonOverlay) gameWonOverlay.classList.add("d-none")

  // Game-Container anzeigen und Mobile-Buttons aktualisieren
  toggleStartScreen(false)

  // Spiel auf Level 1 zurücksetzen
  currentLevel = 1
  gameOverShown = false

  // Neu initialisieren
  initLevels()
  canvas = document.getElementById("canvas")
  if (canvas && levels[1]) {
    world = new World(canvas, keyboard, levels[1])
    world.currentLevel = 1
    world.character.energy = 100
    
    // Den Charakter auf die Startposition zurücksetzen
    if (world.character) {
      world.character.x = 120 // Startposition X
      world.character.y = 180 // Startposition Y
      world.camera_x = 0      // Kamera zurücksetzen
    }
    
    window.gameRunning = true
    if (canvas) canvas.focus()
  }

  setTimeout(() => {
    window.playBackgroundMusic()
    isRestarting = false
  }, 200)
}
window.restartGame = restartGame

/**
 * Erstellt das Victory-Overlay-Element.
 * @param {number} level - Das aktuelle Level.
 * @returns {HTMLElement} Das erstellte Overlay-Element.
 */
function createVictoryOverlay(level) {
  const ov = document.createElement("div")
  ov.id = "victory-overlay"
  ov.style =
    "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:9999; display:flex; align-items:center; justify-content:center; flex-direction:column;"

  const img = document.createElement("img")
  img.src = "img/intro_outro_screens/win/won_2.png"
  img.style = "width:720px; height:480px; object-fit:contain; position:relative; z-index:1;"
  ov.appendChild(img)

  const textContainer = document.createElement("div")
  textContainer.style =
    "position:relative; bottom:0; width:720px; text-align:center; color:#fff; font-family:'Luckiest Guy', cursive; font-size:32px; z-index:2; margin-top:10px;"
  textContainer.innerText = level < 3 ? `Du hast Level ${level} abgeschlossen!` : "Du hast das Spiel gewonnen!"
  ov.appendChild(textContainer)

  return ov
}

/**
 * Zeigt den Victory-Screen an.
 * @param {number} level - Das aktuelle Level.
 */
function showVictoryScreen(level) {
  const ov = createVictoryOverlay(level)
  document.body.appendChild(ov)

  window.stopAllSounds()
  window.stopSnoreSound()

  if (typeof window.playGameWinSound === "function") {
    window.playGameWinSound()
  }

  // Spiel stoppen
  window.gameRunning = false
  
  if (world && typeof world.stop === "function") {
    world.stop()
    world.isGameOver = true
  }
  
  if (level < 3) {
    handleLevelCompletion(ov, level)
  } else {
    handleGameCompletion(ov)
  }
}
window.showVictoryScreen = showVictoryScreen

/**
 * Behandelt den Abschluss eines Levels.
 * @param {HTMLElement} ov - Das Victory-Overlay-Element.
 * @param {number} level - Das aktuelle Level.
 */
function handleLevelCompletion(ov, level) {
  setTimeout(() => {
    if (document.body.contains(ov)) document.body.removeChild(ov)
    currentLevel = level + 1
    initGameWorld()
    window.gameRunning = true
    window.playBackgroundMusic()
  }, 4000)
}

/**
 * Behandelt den Abschluss des Spiels.
 * @param {HTMLElement} ov - Das Victory-Overlay-Element.
 */
function handleGameCompletion(ov) {
  const textContainer = ov.querySelector("div")
  const btn = document.createElement("button")
  btn.innerText = "Neues Spiel starten"
  btn.style =
    "margin-top:20px;padding:15px 30px;font-family:'Luckiest Guy', cursive;font-size:24px;cursor:pointer;border:none;border-radius:10px;background:#ff9900;color:#fff;"
  btn.addEventListener("click", () => {
    document.body.removeChild(ov)
    restartGame()
  })
  textContainer.appendChild(btn)
}

/**
 * Wechselt automatisch in den nächsten Level.
 * @param {number} level - Das nächste Level.
 */
function nextLevel(level) {
  if (level > 3) return showVictoryScreen(3)
  
  currentLevel = level
  window.stopAllSounds()
  
  setTimeout(() => {
    canvas = document.getElementById("canvas")
    if (!levels[currentLevel]) initLevels()
    world = new World(canvas, keyboard, levels[currentLevel])
    world.currentLevel = currentLevel
    window.scrollTo(0, 0)
    setTimeout(() => window.playBackgroundMusic(), 100)
    window.gameRunning = true
  }, 200)
}
window.nextLevel = nextLevel

/**
 * Schaltet in den Vollbildmodus um oder verlässt diesen.
 */
function toggleFullscreen() {
  if (window.innerWidth < 1024) {
    return
  }

  const el = document.getElementById("game-container")
  fullscreenMode ? exitFullscreen() : requestFullscreen(el)
  fullscreenMode = !fullscreenMode
}
window.toggleFullscreen = toggleFullscreen

/**
 * Fordert den Vollbildmodus für ein Element an.
 * @param {HTMLElement} el - Das Element, das im Vollbildmodus angezeigt werden soll.
 */
function requestFullscreen(el) {
  if (el.requestFullscreen) el.requestFullscreen()
  else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
  else if (el.msRequestFullscreen) el.msRequestFullscreen()
}

/**
 * Beendet den Vollbildmodus.
 */
function exitFullscreen() {
  if (document.exitFullscreen) document.exitFullscreen()
  else if (document.webkitExitFullscreen) document.webkitExitFullscreen()
  else if (document.msExitFullscreen) document.msExitFullscreen()
}

/**
 * Fügt Keyboard-Event-Listener hinzu.
 */
function addKeyboardListeners() {
  window.addEventListener("keydown", handleKeyDown)
  window.addEventListener("keyup", handleKeyUp)
}

/**
 * Verarbeitet Tastendrücke.
 * @param {KeyboardEvent} e - Das Keyboard-Event.
 */
function handleKeyDown(e) {
  if (e.keyCode == 39) keyboard.RIGHT = true
  if (e.keyCode == 37) keyboard.LEFT = true
  if (e.keyCode == 38) keyboard.UP = true
  if (e.keyCode == 40) keyboard.DOWN = true
  if (e.keyCode == 32) {
    keyboard.SPACE = true
    e.preventDefault()
  }
  if (e.keyCode == 68) keyboard.D = true
}

/**
 * Verarbeitet das Loslassen von Tasten.
 * @param {KeyboardEvent} e - Das Keyboard-Event.
 */
function handleKeyUp(e) {
  if (e.keyCode == 39) keyboard.RIGHT = false
  if (e.keyCode == 37) keyboard.LEFT = false
  if (e.keyCode == 38) keyboard.UP = false
  if (e.keyCode == 40) keyboard.DOWN = false
  if (e.keyCode == 32) keyboard.SPACE = false
  if (e.keyCode == 68) keyboard.D = false
}

/**
 * Überprüft die aktuelle Geräteaussrichtung und passt die Anzeige an.
 */
function checkOrientation() {
  const isMobile = window.innerWidth < 1024
  const isPortrait = window.innerHeight > window.innerWidth
  updateDeviceDisplay(isMobile, isPortrait)
}

/**
 * Passt die Anzeige der Elemente je nach Gerätetyp und Ausrichtung an.
 * @param {boolean} isMobile - true, wenn es sich um ein mobiles Gerät handelt.
 * @param {boolean} isPortrait - true, wenn das Gerät im Hochformat ist.
 */
function updateDeviceDisplay(isMobile, isPortrait) {
  const mobileButtons = document.getElementById("mobile-buttons")
  const rotateDevice = document.getElementById("rotate-device")
  const content = document.getElementById("content")

  if (isMobile) {
    updateMobileDisplay(mobileButtons, rotateDevice, content, isPortrait)
  } else {
    updateDesktopDisplay(mobileButtons, rotateDevice, content)
  }
}

/**
 * Aktualisiert die Anzeige für mobile Geräte.
 * @param {HTMLElement} mobileButtons - Die mobilen Steuerungsbuttons.
 * @param {HTMLElement} rotateDevice - Die Rotationsaufforderung.
 * @param {HTMLElement} content - Der Hauptinhalt.
 * @param {boolean} isPortrait - true, wenn das Gerät im Hochformat ist.
 */
function updateMobileDisplay(mobileButtons, rotateDevice, content, isPortrait) {
  if (window.gameRunning && mobileButtons) mobileButtons.classList.remove("d-none")
  if (isPortrait) {
    if (rotateDevice) rotateDevice.style.display = "flex"
    if (content) content.style.display = "none"
  } else {
    if (rotateDevice) rotateDevice.style.display = "none"
    if (content) content.style.display = "flex"
  }

  const heading = document.querySelector("h1")
  if (heading) heading.style.display = "none"

  if (window.gameRunning) {
    document.body.classList.add("game-running-mobile")
  }
}

/**
 * Aktualisiert die Anzeige für Desktop-Geräte.
 * @param {HTMLElement} mobileButtons - Die mobilen Steuerungsbuttons.
 * @param {HTMLElement} rotateDevice - Die Rotationsaufforderung.
 * @param {HTMLElement} content - Der Hauptinhalt.
 */
function updateDesktopDisplay(mobileButtons, rotateDevice, content) {
  if (mobileButtons) mobileButtons.classList.add("d-none")
  if (rotateDevice) rotateDevice.style.display = "none"
  if (content) content.style.display = "flex"

  const heading = document.querySelector("h1")
  if (heading) heading.style.display = "block"

  document.body.classList.remove("game-running-mobile")
}

/**
 * Zeigt das Instruktions-Overlay an.
 */
function showInstructions() {
  document.getElementById("instructions-overlay").classList.remove("d-none")
}
window.showInstructions = showInstructions

/**
 * Schließt das Instruktions-Overlay.
 */
function closeInstructions() {
  document.getElementById("instructions-overlay").classList.add("d-none")
}
window.closeInstructions = closeInstructions

/**
 * Erkennt, ob die aktuelle Seite die Impressum-Seite ist und fügt die entsprechende Klasse hinzu.
 */
function checkIfImpressumPage() {
  if (window.location.href.includes("impressum.html")) {
    document.body.classList.add("impressum-page")
  }
}

window.addEventListener("DOMContentLoaded", checkIfImpressumPage)