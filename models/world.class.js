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
  bottleThrowCooldown = false
  currentLevel = 1
  lastFrameTime = 0
  fps = 60
  runInterval = null // Interval-Handle für run()

  /**
   * Erstellt eine neue Spielwelt.
   * @param {HTMLCanvasElement} canvas - Das Canvas-Element.
   * @param {Keyboard} keyboard - Die Tastatur-Steuerung.
   * @param {Level} level - Das aktuelle Level.
   */
  constructor(canvas, keyboard, level) {
    this.ctx = canvas.getContext("2d")
    this.canvas = canvas
    this.keyboard = keyboard
    this.level = level
    this.character.world = this
    this.setWorld()
    this.lastFrameTime = performance.now()
    this.draw()
    this.run()
  }

  /**
   * Weist der Welt relevante Objekte zu.
   */
  setWorld() {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) enemy.world = this
    })
  }

  /**
   * Startet den wiederkehrenden Update-Loop.
   */
  run() {
    this.runInterval = setInterval(() => {
      this.checkCollisions()
      this.checkThrowObjects()
      this.checkEndbossContact()
      this.checkSplashedBottles()
    }, 50)
  }

  /**
   * Stoppt den Update-Loop (wichtig beim Neustart).
   */
  stop() {
    if (this.runInterval) {
      clearInterval(this.runInterval)
      this.runInterval = null
    }
  }

  /**
   * Prüft auf Kollisionen mit auf dem Boden liegenden Flaschen.
   */
  checkSplashedBottles() {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.canBeCollected && this.character.isColliding(bottle)) this.collectSplashedBottle(bottle)
    })
  }

  /**
   * Sammelt eine auf dem Boden liegende Flasche ein.
   * @param {ThrowableObject} bottle - Die einzusammelnde Flasche.
   */
  collectSplashedBottle(bottle) {
    if (this.collectedBottles < 5) {
      this.collectedBottles++
      this.bottleBar.setPercentage(this.collectedBottles * 20)
      window.playBottleSound()
    }
    this.throwableObjects = this.throwableObjects.filter((b) => b !== bottle)
    bottle.destroy()
  }

  /**
   * Prüft, ob der Charakter in die Nähe des Endbosses kommt.
   */
  checkEndbossContact() {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss && this.character.x > enemy.x - 500) {
        this.endbossBarVisible = true
        enemy.isAlerted = true
      }
    })
  }

  /**
   * Prüft, ob eine Flasche geworfen werden soll.
   */
  checkThrowObjects() {
    if (this.canThrowBottle()) this.throwBottle()
  }

  /**
   * Prüft, ob eine Flasche geworfen werden kann.
   * @returns {boolean} true, wenn eine Flasche geworfen werden kann.
   */
  canThrowBottle() {
    return this.keyboard.D && this.collectedBottles > 0 && !this.bottleThrowCooldown
  }

  /**
   * Wirft eine Flasche.
   */
  throwBottle() {
    let bottleX = this.character.x + 30
    const bottleY = this.character.y + 50
    if (this.character.otherDirection) bottleX = this.character.x - 30
    const bottle = new ThrowableObject(bottleX, bottleY, this.character.otherDirection)
    this.throwableObjects.push(bottle)
    this.collectedBottles--
    this.bottleBar.setPercentage(this.collectedBottles * 20)
    this.bottleThrowCooldown = true
    window.playBottleSound()
    setTimeout(() => {
      this.bottleThrowCooldown = false
    }, 500)
  }

  /**
   * Prüft alle Kollisionen im Spiel.
   */
  checkCollisions() {
    this.checkEnemyCollisions()
    this.checkCollectibles()
    this.checkGameState()
  }

  /**
   * Prüft den aktuellen Spielzustand.
   */
  checkGameState() {
    if (this.character.energy <= 0) {
      window.showGameOver()
      return
    }
    this.checkWinCondition()
  }

  /**
   * Prüft Kollisionen mit Gegnern.
   */
  checkEnemyCollisions() {
    this.level.enemies.forEach((enemy) => {
      this.checkCharacterEnemyCollision(enemy)
      this.checkBottleEnemyCollision(enemy)
    })
  }

  /**
   * Prüft Kollisionen zwischen Charakter und Gegner.
   * @param {MoveableObject} enemy - Der zu prüfende Gegner.
   */
  checkCharacterEnemyCollision(enemy) {
    if (this.character.isCollidingWithHead(enemy)) {
      this.handleHeadCollision(enemy)
      return
    }
    if (this.character.isColliding(enemy) && !enemy.isDead()) this.handleCharacterCollision(enemy)
  }

  /**
   * Behandelt Kollisionen zwischen Charakter und Gegner.
   * @param {MoveableObject} enemy - Der kollidierte Gegner.
   */
  handleCharacterCollision(enemy) {
    if (!this.character.isHurt() && !this.character.isDead()) {
      this.character.hit()
      this.statusBar.setPercentage(this.character.energy)
      window.playHurtSound()
    }
  }

  /**
   * Behandelt Kopfkollisionen mit Gegnern.
   * @param {MoveableObject} enemy - Der getroffene Gegner.
   */
  handleHeadCollision(enemy) {
    if ((enemy instanceof Chicken || enemy instanceof SmallChicken) && !enemy.isDead()) {
      enemy.energy = 0
      window.playChickenSound()
      this.character.bounce()
      setTimeout(() => {
        this.level.enemies = this.level.enemies.filter((e) => e !== enemy)
      }, 1000)
    }
  }

  /**
   * Prüft Kollisionen zwischen Flaschen und Gegnern.
   * @param {MoveableObject} enemy - Der zu prüfende Gegner.
   */
  checkBottleEnemyCollision(enemy) {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.isColliding(enemy) && !enemy.isDead() && !bottle.isSplashed) {
        if (enemy instanceof Endboss) {
          this.checkEndbossBottleCollision(enemy, bottle)
        } else {
          this.handleBottleHit(enemy, bottle)
        }
      }
    })
  }

  /**
   * Prüft Kollisionen zwischen Flaschen und dem Endboss.
   * @param {Endboss} enemy - Der Endboss.
   * @param {ThrowableObject} bottle - Die geworfene Flasche.
   */
  checkEndbossBottleCollision(enemy, bottle) {
    const bossTop = enemy.y + enemy.offset.top
    const bossBottom = enemy.y + enemy.height - enemy.offset.bottom
    if (bottle.y >= bossTop && bottle.y <= bossBottom) this.handleBottleHit(enemy, bottle)
  }

  /**
   * Behandelt Treffer mit Flaschen.
   * @param {MoveableObject} enemy - Der getroffene Gegner.
   * @param {ThrowableObject} bottle - Die Flasche, die getroffen hat.
   */
  handleBottleHit(enemy, bottle) {
    if (enemy instanceof Endboss) {
      enemy.hitCount = (enemy.hitCount || 0) + 1
      enemy.energy = enemy.hitCount >= 3 ? 0 : 100 - 33.33 * enemy.hitCount
      this.endbossBar.setPercentage(enemy.energy)
      if (typeof window.playEndbossHurtSound === "function") {
        window.playEndbossHurtSound()
      }
    } else {
      enemy.energy = 0
      window.playChickenSound()
      setTimeout(() => {
        this.level.enemies = this.level.enemies.filter((e) => e !== enemy)
      }, 1000)
    }
    bottle.splash()
  }

  /**
   * Prüft Kollisionen mit einsammelbaren Objekten.
   */
  checkCollectibles() {
    this.checkBottleCollisions()
    this.checkCoinCollisions()
  }

  /**
   * Prüft Kollisionen mit Flaschen.
   */
  checkBottleCollisions() {
    this.level.bottles.forEach((bottle) => {
      if (this.character.isColliding(bottle) && this.collectedBottles < 5) this.collectBottle(bottle)
    })
  }

  /**
   * Sammelt eine Flasche ein.
   * @param {Bottle} bottle - Die einzusammelnde Flasche.
   */
  collectBottle(bottle) {
    this.collectedBottles++
    this.bottleBar.setPercentage(this.collectedBottles * 20)
    this.level.bottles = this.level.bottles.filter((b) => b !== bottle)
    window.playBottleSound()
  }

  /**
   * Prüft Kollisionen mit Münzen.
   */
  checkCoinCollisions() {
    this.level.coins.forEach((coin) => {
      if (this.character.isColliding(coin)) this.collectCoin(coin)
    })
  }

  /**
   * Sammelt eine Münze ein.
   * @param {Coin} coin - Die einzusammelnde Münze.
   */
  collectCoin(coin) {
    this.collectedCoins++
    this.coinBar.setPercentage(this.collectedCoins * 20)
    this.level.coins = this.level.coins.filter((c) => c !== coin)
    window.playCoinSound()
  }

  /**
   * Prüft, ob das Spiel gewonnen wurde.
   */
  checkWinCondition() {
    if (this.victoryShown) return
    const endboss = this.level.enemies.find((enemy) => enemy instanceof Endboss)
    if (endboss && endboss.isDead() && endboss.fallStarted && endboss.y > this.canvas.height) {
      this.victoryShown = true
      this.collectedBottles = 0
      this.collectedCoins = 0
      window.showVictoryScreen(this.currentLevel)
    }
  }

  /**
   * Zeichnet den aktuellen Spielzustand.
   */
  draw() {
    const currentTime = performance.now()
    this.lastFrameTime = currentTime
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.drawGameFrame()
    requestAnimationFrame(() => this.draw())
  }

  /**
   * Zeichnet den Spielframe.
   */
  drawGameFrame() {
    this.drawBackgroundElements()
    this.drawStatusBars()
    this.drawGameElements()
  }

  /**
   * Zeichnet die Hintergrundelemente.
   */
  drawBackgroundElements() {
    this.ctx.translate(this.camera_x, 0)
    this.addObjectsToMap(this.level.backgroundObjects)
    this.addObjectsToMap(this.level.clouds)
    this.addObjectsToMap(this.level.bottles)
    this.addObjectsToMap(this.level.coins)
    this.ctx.translate(-this.camera_x, 0)
  }

  /**
   * Zeichnet die Statusleisten.
   */
  drawStatusBars() {
    this.addToMap(this.statusBar)
    this.addToMap(this.bottleBar)
    this.addToMap(this.coinBar)
    if (this.endbossBarVisible) this.addToMap(this.endbossBar)
  }

  /**
   * Zeichnet die Spielelemente.
   */
  drawGameElements() {
    this.ctx.translate(this.camera_x, 0)
    this.addToMap(this.character)
    this.addObjectsToMap(this.level.enemies)
    this.addObjectsToMap(this.throwableObjects)
    this.ctx.translate(-this.camera_x, 0)
  }

  /**
   * Fügt mehrere Objekte zur Karte hinzu.
   * @param {DrawableObject[]} objects - Die hinzuzufügenden Objekte.
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => this.addToMap(o))
  }

  /**
   * Fügt ein Objekt zur Karte hinzu.
   * @param {DrawableObject} mo - Das hinzuzufügende Objekt.
   */
  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo)
    mo.draw(this.ctx)
    if (mo.otherDirection) this.flipImageBack(mo)
  }

  /**
   * Spiegelt ein Bild horizontal.
   * @param {DrawableObject} mo - Das zu spiegelnde Objekt.
   */
  flipImage(mo) {
    this.ctx.save()
    this.ctx.translate(mo.width, 0)
    this.ctx.scale(-1, 1)
    mo.x = mo.x * -1
  }

  /**
   * Stellt die ursprüngliche Ausrichtung eines Bildes wieder her.
   * @param {DrawableObject} mo - Das zurückzusetzende Objekt.
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1
    this.ctx.restore()
  }
}

