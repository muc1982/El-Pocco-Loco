class CollisionManager {
  /**
   * Creates a new CollisionManager.
   * @param {World} world - The game world.
   */
  constructor(world) {
    this.world = world
  }

  /**
   * Checks all collisions in the game.
   */
  checkCollisions() {
    this.checkEnemyCollisions()
    this.checkCollectibles()
    this.checkFireballCharacterCollisions()
  }

  /**
   * Checks collisions with enemies.
   */
  checkEnemyCollisions() {
    this.world.level.enemies.forEach((enemy) => {
      this.checkCharacterEnemyCollision(enemy)
      this.checkBottleEnemyCollision(enemy)
    })
  }

  /**
   * Checks collision between character and enemy.
   * @param {MoveableObject} enemy - The enemy.
   */
  checkCharacterEnemyCollision(enemy) {
    if (this.world.character.isCollidingWithHead(enemy)) {
      this.handleHeadCollision(enemy)
      return
    }

    if (this.world.character.isColliding(enemy) && !enemy.isDead()) {
      this.handleCharacterCollision(enemy)
    }
  }

  /**
   * Checks for collisions between fireballs and the character.
   * Diese neue Methode prüft explizit auf Kollisionen zwischen Feuerbällen und dem Charakter
   */
  checkFireballCharacterCollisions() {
    if (!this.world.character || this.world.character.isDead()) return

    this.world.throwableObjects.forEach((obj) => {
      if (obj instanceof Fireball && this.isFireballHittingCharacter(obj, this.world.character)) {
        this.handleCharacterFireballHit(this.world.character, obj)
      }
    })
  }

  /**
   * Checks if a fireball is hitting the character.
   * @param {Fireball} fireball - The fireball.
   * @param {Character} character - The character.
   * @returns {boolean} True if the fireball is hitting the character.
   */
  isFireballHittingCharacter(fireball, character) {
    const fireballLeft = fireball.x
    const fireballRight = fireball.x + fireball.width
    const fireballTop = fireball.y
    const fireballBottom = fireball.y + fireball.height
    const characterLeft = character.x + character.offset.left
    const characterRight = character.x + character.width - character.offset.right
    const characterTop = character.y + character.offset.top
    const characterBottom = character.y + character.height - character.offset.bottom
   
    return (
      fireballRight > characterLeft &&
      fireballLeft < characterRight &&
      fireballBottom > characterTop &&
      fireballTop < characterBottom
    )
  }

  /**
   * Handles collision between character and enemy.
   * @param {MoveableObject} enemy - The enemy.
   */
  handleCharacterCollision(enemy) {
    if (!this.world.character.isHurt() && !this.world.character.isDead()) {
      this.world.character.hit()
      this.world.statusBar.setPercentage(this.world.character.energy)
      window.playHurtSound()
    }
  }

  /**
   * Handles head collision with enemy.
   * @param {MoveableObject} enemy - The enemy.
   */
  handleHeadCollision(enemy) {
    if (this.isChickenEnemy(enemy) && !enemy.isDead()) {
      this.killChickenEnemy(enemy)
    }
  }

  /**
   * Checks if enemy is a chicken type.
   * @param {MoveableObject} enemy - The enemy.
   * @returns {boolean} True if chicken type.
   */
  isChickenEnemy(enemy) {
    return enemy instanceof Chicken || enemy instanceof SmallChicken
  }

  /**
   * Kills a chicken enemy.
   * @param {MoveableObject} enemy - The enemy.
   */
  killChickenEnemy(enemy) {
    enemy.energy = 0
    window.playChickenSound()
    this.world.character.bounce()

    setTimeout(() => {
      this.world.level.enemies = this.world.level.enemies.filter((e) => e !== enemy)
    }, 1000)
  }

  /**
   * Checks collisions between bottles and enemies.
   * @param {MoveableObject} enemy - The enemy.
   */
  checkBottleEnemyCollision(enemy) {
    this.world.throwableObjects.forEach((bottle) => {
      if (this.canBottleHitEnemy(bottle, enemy)) {
        if (enemy instanceof Endboss) {
          this.checkEndbossBottleCollision(enemy, bottle)
        } else {
          this.handleBottleHit(enemy, bottle)
        }
      }
    })
  }

  /**
   * Checks if bottle can hit enemy.
   * @param {ThrowableObject} bottle - The bottle.
   * @param {MoveableObject} enemy - The enemy.
   * @returns {boolean} True if can hit.
   */
  canBottleHitEnemy(bottle, enemy) {
    return bottle instanceof ThrowableObject && bottle.isColliding(enemy) && !enemy.isDead() && !bottle.isSplashed
  }

  /**
   * Checks collision between a bottle and the Endboss.
   * @param {Endboss} enemy - The Endboss.
   * @param {ThrowableObject} bottle - The bottle.
   */
  checkEndbossBottleCollision(enemy, bottle) {
    const bossTop = enemy.y + enemy.offset.top + 50
    const bossBottom = enemy.y + enemy.height - enemy.offset.bottom - 30
    const bossLeft = enemy.x + enemy.offset.left + 100 
    const bossRight = enemy.x + enemy.width - enemy.offset.right - 50

    const bottleTop = bottle.y
    const bottleBottom = bottle.y + bottle.height
    const bottleLeft = bottle.x
    const bottleRight = bottle.x + bottle.width

    if (bottleRight > bossLeft && bottleLeft < bossRight && bottleBottom > bossTop && bottleTop < bossBottom) {
      this.handleBottleHit(enemy, bottle)
    }
  }

  /**
   * Handles bottle hit.
   * @param {MoveableObject} enemy - The enemy.
   * @param {ThrowableObject} bottle - The bottle.
   */
  handleBottleHit(enemy, bottle) {
    if (enemy instanceof Endboss) {
      this.handleEndbossHit(enemy)
    } else {
      this.handleRegularEnemyHit(enemy)
    }

    if (typeof bottle.splash === "function") {
      bottle.splash()
    }
  }

  /**
   * Handles a fireball hit on the character.
   * @param {Character} character - The character.
   * @param {Fireball} fireball - The fireball.
   */
  handleCharacterFireballHit(character, fireball) {
    if (!character.isHurt() && !character.isDead()) {
      character.hit(10)
      this.world.statusBar.setPercentage(character.energy)
      window.playHurtSound()
      this.world.throwableObjects = this.world.throwableObjects.filter((obj) => obj !== fireball)
      if (typeof fireball.splash === "function") {
        fireball.splash()
      } else {
        fireball.destroy()
      }
    }
  }

  /**
   * Handles hit on Endboss.
   * @param {Endboss} enemy - The Endboss.
   */
  handleEndbossHit(enemy) {
    enemy.hitCount = (enemy.hitCount || 0) + 1
    enemy.energy = enemy.hitCount >= 3 ? 0 : 100 - 33.33 * enemy.hitCount
    this.world.endbossBar.setPercentage(enemy.energy)

    if (typeof window.playEndbossHurtSound === "function") {
      window.playEndbossHurtSound()
    }
  }

  /**
   * Handles hit on regular enemy.
   * @param {MoveableObject} enemy - The enemy.
   */
  handleRegularEnemyHit(enemy) {
    enemy.energy = 0
    window.playChickenSound()

    setTimeout(() => {
      this.world.level.enemies = this.world.level.enemies.filter((e) => e !== enemy)
    }, 1000)
  }

  /**
   * Checks collisions with collectibles.
   */
  checkCollectibles() {
    this.checkBottleCollisions()
    this.checkCoinCollisions()
    this.checkSplashedBottles()
  }

  /**
   * Checks for splashed bottle collisions.
   */
  checkSplashedBottles() {
    this.world.throwableObjects.forEach((bottle) => {
      if (bottle.canBeCollected && this.world.character.isColliding(bottle)) {
        this.collectSplashedBottle(bottle)
      }
    })
  }

  /**
   * Collects a splashed bottle.
   * @param {ThrowableObject} bottle - The bottle.
   */
  collectSplashedBottle(bottle) {
    if (this.world.collectedBottles < 5) {
      this.world.collectedBottles++
      this.world.bottleBar.setPercentage(this.world.collectedBottles * 20)
      window.playBottleSound()
    }

    this.world.throwableObjects = this.world.throwableObjects.filter((b) => b !== bottle)
    bottle.destroy()
  }

  /**
   * Checks collisions with bottles.
   */
  checkBottleCollisions() {
    this.world.level.bottles.forEach((bottle) => {
      if (this.world.character.isColliding(bottle) && this.world.collectedBottles < 5) {
        this.collectBottle(bottle)
      }
    })
  }

  /**
   * Collects a bottle.
   * @param {Bottle} bottle - The bottle.
   */
  collectBottle(bottle) {
    this.world.collectedBottles++
    this.world.bottleBar.setPercentage(this.world.collectedBottles * 20)
    this.world.level.bottles = this.world.level.bottles.filter((b) => b !== bottle)
    window.playBottleSound()
  }

  /**
   * Checks collisions with coins.
   */
  checkCoinCollisions() {
    this.world.level.coins.forEach((coin) => {
      if (this.world.character.isColliding(coin)) {
        this.collectCoin(coin)
      }
    })
  }

  /**
   * Collects a coin.
   * @param {Coin} coin - The coin.
   */
  collectCoin(coin) {
    this.world.collectedCoins++
    this.world.coinBar.setPercentage(this.world.collectedCoins * 20)
    this.world.level.coins = this.world.level.coins.filter((c) => c !== coin)
    window.playCoinSound()
  }
}

