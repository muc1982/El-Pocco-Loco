
let canvas,
world,
fullscreenMode = false,
currentLevel = 1
const keyboard = new Keyboard()
const levels = []
window.gameRunning = false
let isRestarting = false
let gameOverShown = false

/**
 * Initializes the game.
 */
function init() {
  initLevels()
  window.initAudio()
  addTouchListeners()
  addKeyboardListeners()
  setupWindowListeners()
  prepareGameEnvironment()
}
window.init = init

/**
 * Sets up window event listeners.
 */
function setupWindowListeners() {
  window.addEventListener("resize", checkOrientation)
  window.addEventListener("orientationchange", checkOrientation)
  checkOrientation()
}

/**
 * Prepares the game environment.
 */
function prepareGameEnvironment() {
  window.scrollTo(0, 0)
  toggleStartScreen(true)
  window.playBackgroundMusic()
  window.updateMuteIcon()
  window.gameRunning = false
  isRestarting = false
  gameOverShown = false
  setupCanvas()
  requestAnimationFrame(gameLoop)
}

/**
 * Sets up the canvas.
 */
function setupCanvas() {
  const canvasElement = document.getElementById("canvas")
  if (canvasElement) {
    canvasElement.style.display = "block"
    canvasElement.style.visibility = "visible"
    canvasElement.width = 720
    canvasElement.height = 480
  }
}

/**
 * Main game loop that updates the world on each frame.
 */
function gameLoop() {
  if (window.gameRunning && world && typeof world.update === "function") {
    world.update()
  }
  requestAnimationFrame(gameLoop)
}

/**
 * Adds touch event listeners for mobile controls.
 */
function addTouchListeners() {
  setupTouchButton("btn-left", "LEFT")
  setupTouchButton("btn-right", "RIGHT")
  setupTouchButton("btn-jump", "SPACE")
  setupTouchButton("btn-throw", "D")
}

/**
 * Registers touch event listeners for a button.
 * @param {string} id - The HTML ID of the button.
 * @param {string} key - The key code to set.
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
 * Loads all levels into the levels array.
 */
function initLevels() {
  if (typeof window.initLevel1 === "function") levels[1] = window.initLevel1()
  if (typeof window.initLevel2 === "function") levels[2] = window.initLevel2()
  if (typeof window.initLevel3 === "function") levels[3] = window.initLevel3()
}

/**
 * Starts the game and initializes the game world.
 */
function startGame() {
  toggleLoader(true)
  setTimeout(() => {
    toggleLoader(false)
    if (window.gameRunning) return
    hideStartScreen()
    showGameElements()
    initGameWorld()
    finalizeGameStart()
  }, 1000)
}
window.startGame = startGame

/**
 * Hides the start screen.
 */
function hideStartScreen() {
  const startScreen = document.getElementById("start-screen")
  if (startScreen) {
    startScreen.style.display = "none"
    startScreen.style.visibility = "hidden"
  }
}

/**
 * Shows game elements.
 */
function showGameElements() {
  showGameContainer()
  showCanvas()
  showMobileButtons()
}

/**
 * Shows the game container.
 */
function showGameContainer() {
  const gameContainer = document.getElementById("game-container")
  if (gameContainer) {
    gameContainer.style.display = "block"
    gameContainer.style.visibility = "visible"
    gameContainer.classList.remove("d-none")
  }
}

/**
 * Shows the canvas.
 */
function showCanvas() {
  canvas = document.getElementById("canvas")
  if (canvas) {
    canvas.style.display = "block"
    canvas.style.visibility = "visible"
    canvas.width = 720
    canvas.height = 480
  }
}

/**
 * Shows mobile buttons if necessary.
 */
function showMobileButtons() {
  const mobileButtons = document.getElementById("mobile-buttons")
  if (mobileButtons && window.innerWidth < 1024) {
    mobileButtons.style.display = "flex"
    mobileButtons.classList.remove("d-none")
  }
}

/**
 * Finalizes game start.
 */
function finalizeGameStart() {
  window.gameRunning = true
  if (window.innerWidth < 1024) {
    document.body.classList.add("game-running-mobile")
  }
  window.scrollTo(0, 0)
  if (canvas) canvas.focus()
  window.playSnoreSound()
}

/**
 * Toggles the loader overlay.
 * @param {boolean} show - True to show the loader.
 */
function toggleLoader(show) {
  const loader = document.getElementById("loader-overlay")
  if (loader) loader.classList.toggle("d-none", !show)
}

/**
 * Toggles the start screen visibility.
 * @param {boolean} show - True to show the start screen.
 */
function toggleStartScreen(show) {
  toggleStartScreenVisibility(show)
  toggleGameContainerVisibility(show)
  toggleMobileButtonsVisibility(show)
  toggleImpressumVisibility(show)
}

/**
 * Toggles start screen visibility.
 * @param {boolean} show - True to show.
 */
function toggleStartScreenVisibility(show) {
  const startScreen = document.getElementById("start-screen")
  if (startScreen) {
    startScreen.style.display = show ? "flex" : "none"
    startScreen.classList.toggle("d-none", !show)
  }
}

/**
 * Toggles game container visibility.
 * @param {boolean} show - True to show start screen (hide container).
 */
function toggleGameContainerVisibility(show) {
  const gameContainer = document.getElementById("game-container")
  if (gameContainer) {
    gameContainer.style.display = show ? "none" : "block"
    gameContainer.classList.toggle("d-none", show)
  }
}

/**
 * Toggles mobile buttons visibility.
 * @param {boolean} show - True to show start screen (hide buttons).
 */
function toggleMobileButtonsVisibility(show) {
  const mobileButtons = document.getElementById("mobile-buttons")
  if (mobileButtons) {
    const shouldHide = show || window.innerWidth >= 1024
    mobileButtons.style.display = shouldHide ? "none" : "flex"
    mobileButtons.classList.toggle("d-none", shouldHide)
  }
}

/**
 * Toggles impressum button visibility.
 * @param {boolean} show - True to show.
 */
function toggleImpressumVisibility(show) {
  const impressumBtn = document.getElementById("impressum-btn")
  if (impressumBtn) {
    impressumBtn.style.display = show ? "block" : "none"
  }
}

/**
 * Initializes the game world with the current level.
 */
function initGameWorld() {
  if (!levels[currentLevel]) {
    console.warn("Level not found, initializing levels...")
    initLevels()
  }

  if (!levels[currentLevel]) {
    console.error("Failed to initialize level " + currentLevel)
    levels[currentLevel] = {
      enemies: [],
      clouds: [],
      backgroundObjects: [],
      bottles: [],
      coins: [],
      level_end_x: 2400,
    }
  }

  world = new World(canvas, keyboard, levels[currentLevel])
  world.currentLevel = currentLevel
}

/**
 * Shows the game over screen.
 */
function showGameOver() {
  if (gameOverShown) return
  gameOverShown = true

  if (typeof window.stopAllSounds === "function") {
    window.stopAllSounds().then(() => {
      toggleGameScreens(true)
      window.gameRunning = false
      stopAndCleanupWorld()
      if (typeof window.playGameOverSound === "function") {
        setTimeout(() => window.playGameOverSound(), 300)
      }
    })
  } else {
    toggleGameScreens(true)
    window.gameRunning = false
    stopAndCleanupWorld()
  }
}
window.showGameOver = showGameOver

/**
 * Stops and cleans up the world.
 */
function stopAndCleanupWorld() {
  if (world && typeof world.stop === "function") {
    world.stop()
    world.isGameOver = true
  }
}

/**
 * Toggles game screens (game container, mobile buttons, game over screen).
 * @param {boolean} isGameOver - True to show game over screen.
 */
function toggleGameScreens(isGameOver) {
  document.getElementById("game-container").classList.toggle("d-none", isGameOver)
  document.getElementById("mobile-buttons").classList.toggle("d-none", isGameOver)
  document.getElementById("game-over").classList.toggle("d-none", !isGameOver)
}

/**
 * Adds keyboard event listeners.
 */
function addKeyboardListeners() {
  window.addEventListener("keydown", handleKeyDown)
  window.addEventListener("keyup", handleKeyUp)
}

/**
 * Handles key down events.
 * @param {KeyboardEvent} e - The keyboard event.
 */
function handleKeyDown(e) {
  e.preventDefault() 
  if (e.keyCode == 39) keyboard.RIGHT = true
  if (e.keyCode == 37) keyboard.LEFT = true
  if (e.keyCode == 38) keyboard.UP = true
  if (e.keyCode == 40) keyboard.DOWN = true
  if (e.keyCode == 32) keyboard.SPACE = true
  if (e.keyCode == 68) keyboard.D = true
}

/**
 * Handles key up events.
 * @param {KeyboardEvent} e - The keyboard event.
 */
function handleKeyUp(e) {
  e.preventDefault() 

  if (e.keyCode == 39) keyboard.RIGHT = false
  if (e.keyCode == 37) keyboard.LEFT = false
  if (e.keyCode == 38) keyboard.UP = false
  if (e.keyCode == 40) keyboard.DOWN = false
  if (e.keyCode == 32) keyboard.SPACE = false
  if (e.keyCode == 68) keyboard.D = false
}

/**
 * Restarts the game.
 */
function restartGame() {
  if (isRestarting) return
  isRestarting = true

  window.stopAllSounds()
  cleanupOldState()
  resetGameState()
  initializeNewGame()
}
window.restartGame = restartGame

/**
 * Cleans up the old game state.
 */
function cleanupOldState() {
  if (world && typeof world.stop === "function") {
    world.stop()
  }

  document.getElementById("victory-overlay")?.remove()
  const gameOverOverlay = document.getElementById("game-over")
  if (gameOverOverlay) gameOverOverlay.classList.add("d-none")
  const gameWonOverlay = document.getElementById("game-won")
  if (gameWonOverlay) gameWonOverlay.classList.add("d-none")
}

/**
 * Resets the game state.
 */
function resetGameState() {
  toggleStartScreen(false)
  currentLevel = 1
  gameOverShown = false
  initLevels()
}

/**
 * Initializes a new game.
 */
function initializeNewGame() {
  canvas = document.getElementById("canvas")
  if (canvas && levels[1]) {
    createNewWorld()
    window.gameRunning = true
    if (canvas) canvas.focus()
  }

  setTimeout(() => {
    window.playBackgroundMusic()
    isRestarting = false
  }, 200)
}

/**
 * Creates a new world instance.
 */
function createNewWorld() {
  world = new World(canvas, keyboard, levels[1])
  world.currentLevel = 1
  world.character.energy = 100

  if (world.character) {
    world.character.x = 120
    world.character.y = 180
    world.camera_x = 0
  }
}

/**
 * Creates the victory overlay element.
 * @param {number} level - The current level.
 * @returns {HTMLElement} The overlay element.
 */
function createVictoryOverlay(level) {
  const ov = document.createElement("div")
  ov.id = "victory-overlay"
  ov.style =
    "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:9999; display:flex; align-items:center; justify-content:center; flex-direction:column;"

  addOverlayContent(ov, level)
  return ov
}

/**
 * Adds content to the victory overlay.
 * @param {HTMLElement} ov - The overlay element.
 * @param {number} level - The current level.
 */
function addOverlayContent(ov, level) {
  const img = document.createElement("img")
  img.src = "img/intro_outro_screens/win/won_2.png"
  img.style = "width:720px; height:480px; object-fit:contain; position:relative; z-index:1;"
  ov.appendChild(img)

  const textContainer = document.createElement("div")
  textContainer.style =
    "position:relative; bottom:0; width:720px; text-align:center; color:#fff; font-family:'Luckiest Guy', cursive; font-size:32px; z-index:2; margin-top:10px;"
  textContainer.innerText = level < 3 ? `You have completed Level ${level}!` : "You have won the game!"
  ov.appendChild(textContainer)
}

/**
 * Shows the victory screen.
 * @param {number} level - The current level.
 */
function showVictoryScreen(level) {
  const ov = createVictoryOverlay(level)
  document.body.appendChild(ov)

  window.stopAllSounds()
  window.stopSnoreSound()

  if (typeof window.playGameWinSound === "function") {
    window.playGameWinSound()
  }

  stopGame()

  if (level < 3) {
    handleLevelCompletion(ov, level)
  } else {
    handleGameCompletion(ov)
  }
}
window.showVictoryScreen = showVictoryScreen

/**
 * Stops the game.
 */
function stopGame() {
  window.gameRunning = false

  if (world && typeof world.stop === "function") {
    world.stop()
    world.isGameOver = true
  }
}

/**
 * Handles level completion.
 * @param {HTMLElement} ov - The victory overlay element.
 * @param {number} level - The current level.
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
 * Handles game completion.
 * @param {HTMLElement} ov - The victory overlay element.
 * @param {number} level - The current level.
 */
function handleGameCompletion(ov) {
  const textContainer = ov.querySelector("div")
  const btn = document.createElement("button")
  btn.innerText = "Start New Game"
  btn.style =
    "margin-top:20px;padding:15px 30px;font-family:'Luckiest Guy', cursive;font-size:24px;cursor:pointer;border:none;border-radius:10px;background:#ff9900;color:#fff;"
  btn.addEventListener("click", () => {
    document.body.removeChild(ov)
    restartGame()
  })
  textContainer.appendChild(btn)
}

/**
 * Advances to the next level.
 * @param {number} level - The next level.
 */
function nextLevel(level) {
  if (level > 3) return showVictoryScreen(3)

  currentLevel = level
  window.stopAllSounds()

  setTimeout(() => {
    initializeNextLevel()
  }, 200)
}
window.nextLevel = nextLevel

/**
 * Initializes the next level.
 */
function initializeNextLevel() {
  canvas = document.getElementById("canvas")
  if (!levels[currentLevel]) initLevels()
  world = new World(canvas, keyboard, levels[currentLevel])
  world.currentLevel = currentLevel
  window.scrollTo(0, 0)
  setTimeout(() => window.playBackgroundMusic(), 100)
  window.gameRunning = true
}

/**
 * Toggles fullscreen mode.
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
 * Requests fullscreen for an element.
 * @param {HTMLElement} el - The element to display in fullscreen.
 */
function requestFullscreen(el) {
  if (el.requestFullscreen) el.requestFullscreen()
  else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
  else if (el.msRequestFullscreen) el.msRequestFullscreen()
}

/**
 * Exits fullscreen mode.
 */
function exitFullscreen() {
  if (document.exitFullscreen) document.exitFullscreen()
  else if (document.webkitExitFullscreen) document.webkitExitFullscreen()
  else if (document.msExitFullscreen) document.msExitFullscreen()
}

/**
 * Checks the device orientation and adjusts display.
 */
function checkOrientation() {
  const isMobile = window.innerWidth < 1024
  const isPortrait = window.innerHeight > window.innerWidth
  updateDeviceDisplay(isMobile, isPortrait)
}

/**
 * Updates device display based on mobile/desktop and orientation.
 * @param {boolean} isMobile - True if on mobile.
 * @param {boolean} isPortrait - True if in portrait orientation.
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
 * Updates mobile display.
 * @param {HTMLElement} mobileButtons
 * @param {HTMLElement} rotateDevice
 * @param {HTMLElement} content
 * @param {boolean} isPortrait
 */
function updateMobileDisplay(mobileButtons, rotateDevice, content, isPortrait) {
  if (isPortrait) {
    mobileButtons.style.display = "none"
    rotateDevice.style.display = "flex"
    content.style.display = "none"
  } else {
    mobileButtons.style.display = "flex"
    rotateDevice.style.display = "none"
    content.style.display = "block"
  }
}

/**
 * Updates desktop display.
 * @param {HTMLElement} mobileButtons
 * @param {HTMLElement} rotateDevice
 * @param {HTMLElement} content
 */
function updateDesktopDisplay(mobileButtons, rotateDevice, content) {
  mobileButtons.style.display = "none"
  rotateDevice.style.display = "none"
  content.style.display = "block"
}

/**
 * Shows instructions overlay.
 */
function showInstructions() {
  const instructionsOverlay = document.getElementById("instructions-overlay")
  if (instructionsOverlay) {
    instructionsOverlay.classList.remove("d-none")
  }
}
window.showInstructions = showInstructions

/**
 * Closes instructions overlay.
 */
function closeInstructions() {
  const instructionsOverlay = document.getElementById("instructions-overlay")
  if (instructionsOverlay) {
    instructionsOverlay.classList.add("d-none")
  }
}
window.closeInstructions = closeInstructions

/**
 * Navigates to impressum page.
 */
function navigateToImpressum() {
  window.location.href = "impressum.html"
}
window.navigateToImpressum = navigateToImpressum

/**
 * Navigates back to home/game page.
 */
function navigateToHome() {
  window.location.href = "index.html"
}
window.navigateToHome = navigateToHome

