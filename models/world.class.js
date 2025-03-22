class World {
  character = new Character()
  level = null
  canvas
  ctx
  keyboard
  camera_x = 0
  statusBar = new StatusBar()
  bottleBar = new BottleBar()
  coinBar = new CoinBar()
  throwableObjects = []
  collectedBottles = 0
  collectedCoins = 0
  endbossBar = new EndbossBar()
  endbossBarVisible = false
  currentLevel = 1
  lastFrameTime = 0
  fps = 60
  runInterval = null
  collisionManager
  renderer
  gameStateManager
  itemManager

  /**
   * Creates a new World instance.
   * @param {HTMLCanvasElement} canvas - The canvas element.
   * @param {Keyboard} keyboard - The keyboard input.
   * @param {Level} level - The game level.
   */
  constructor(canvas, keyboard, level) {
    this.ctx = canvas.getContext("2d")
    this.canvas = canvas
    this.keyboard = keyboard
    this.level = level || { enemies: [], clouds: [], backgroundObjects: [], bottles: [], coins: [] }
    this.character.world = this
    this.initializeManagers()
    this.setWorld()
    this.lastFrameTime = performance.now()
    this.renderer.draw()
    this.run()
  }

  /**
   * Initializes all managers.
   */
  initializeManagers() {
    this.collisionManager = new CollisionManager(this)
    this.renderer = new WorldRenderer(this)
    this.gameStateManager = new GameStateManager(this)
    this.itemManager = new ItemManager(this)
  }

  /**
   * Sets world references.
   */
  setWorld() {
    if (this.level && this.level.enemies) {
      this.level.enemies.forEach((enemy) => {
        if (enemy instanceof Endboss) enemy.world = this
      })
    }
  }

  /**
   * Starts the update loop.
   */
  run() {
    this.runInterval = setInterval(() => {
      this.update()
    }, 50)
  }

  /**
   * Updates the game state.
   */
  update() {
    this.collisionManager.checkCollisions()
    this.itemManager.checkThrowObjects()
    this.gameStateManager.checkEndbossContact()
    this.gameStateManager.checkGameState()
  }

  /**
   * Stops the update loop.
   */
  stop() {
    if (this.runInterval) {
      clearInterval(this.runInterval)
      this.runInterval = null
    }
  }
}

window.World = World

