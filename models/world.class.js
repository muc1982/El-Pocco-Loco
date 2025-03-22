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

  constructor(canvas, keyboard, level) {
    this.ctx = canvas.getContext("2d")
    this.canvas = canvas
    this.keyboard = keyboard
    this.level = level
    this.character.world = this
    this.collisionManager = new CollisionManager(this)
    this.renderer = new WorldRenderer(this)
    this.gameStateManager = new GameStateManager(this)
    this.itemManager = new ItemManager(this)
    this.setWorld()
    this.lastFrameTime = performance.now()
    this.renderer.draw()
    this.run()
  }

  /**
   * Weist der Welt relevante Objekte zu.
   * Setzt Referenzen zwischen Objekten, die sich kennen müssen.
   */
  setWorld() {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) enemy.world = this
    })
  }

  /**
   * Startet den wiederkehrenden Update-Loop.
   * Aktualisiert regelmäßig den Spielzustand.
   */
  run() {
    this.runInterval = setInterval(() => {
      this.update()
    }, 50)
  }

  /**
   * Aktualisiert den Spielzustand.
   * Prüft Kollisionen, Gegenstände und Spielzustand.
   */
  update() {
    this.collisionManager.checkCollisions()
    this.itemManager.checkThrowObjects()
    this.gameStateManager.checkEndbossContact()
    this.gameStateManager.checkGameState()
  }

  /**
   * Stoppt den Update-Loop.
   * Wichtig beim Neustart oder Beenden des Spiels.
   */
  stop() {
    if (this.runInterval) {
      clearInterval(this.runInterval)
      this.runInterval = null
    }
  }
}