class CollisionManager {
  /**
   * Erstellt eine neue Instanz des CollisionManager.
   * @param {World} world - Die Spielwelt, in der Kollisionen geprüft werden.
   */
  constructor(world) {
    this.world = world
  }

  /**
   * Prüft alle Kollisionen im Spiel.
   * Führt Prüfungen für Gegner und Sammelobjekte durch.
   */
  checkCollisions() {
    this.checkEnemyCollisions()
    this.checkCollectibles()
  }

  /**
   * Prüft Kollisionen mit Gegnern.
   * Überprüft sowohl Charakter-Gegner als auch Flasche-Gegner Kollisionen.
   */
  checkEnemyCollisions() {
    this.world.level.enemies.forEach((enemy) => {
      this.checkCharacterEnemyCollision(enemy)
      this.checkBottleEnemyCollision(enemy)
    })
  }

  /**
   * Prüft Kollisionen zwischen Charakter und Gegner.
   * Unterscheidet zwischen Kopfkollisionen und normalen Kollisionen.
   * @param {MoveableObject} enemy - Der zu prüfende Gegner.
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
   * Behandelt Kollisionen zwischen Charakter und Gegner.
   * Reduziert die Energie des Charakters und spielt den Verletzungssound ab.
   * @param {MoveableObject} enemy - Der kollidierte Gegner.
   */
  handleCharacterCollision(enemy) {
    if (!this.world.character.isHurt() && !this.world.character.isDead()) {
      this.world.character.hit()
      this.world.statusBar.setPercentage(this.world.character.energy)
      window.playHurtSound()
    }
  }

  /**
   * Behandelt Kopfkollisionen mit Gegnern.
   * Tötet den Gegner, wenn es sich um ein Huhn handelt.
   * @param {MoveableObject} enemy - Der getroffene Gegner.
   */
  handleHeadCollision(enemy) {
    if ((enemy instanceof Chicken || enemy instanceof SmallChicken) && !enemy.isDead()) {
      enemy.energy = 0
      window.playChickenSound()
      this.world.character.bounce()
      setTimeout(() => {
        this.world.level.enemies = this.world.level.enemies.filter((e) => e !== enemy)
      }, 1000)
    }
  }

  /**
   * Prüft Kollisionen zwischen Flaschen und Gegnern.
   * @param {MoveableObject} enemy - Der zu prüfende Gegner.
   */
  checkBottleEnemyCollision(enemy) {
    this.world.throwableObjects.forEach((bottle) => {
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
   * Berücksichtigt die spezielle Hitbox des Endbosses.
   * @param {Endboss} enemy - Der Endboss.
   * @param {ThrowableObject} bottle - Die geworfene Flasche.
   */
  checkEndbossBottleCollision(enemy, bottle) {
    const bossTop = enemy.y + enemy.offset.top
    const bossBottom = enemy.y + enemy.height - enemy.offset.bottom
    if (bottle.y >= bossTop && bottle.y <= bossBottom) {
      this.handleBottleHit(enemy, bottle)
    }
  }

  /**
   * Behandelt Treffer mit Flaschen.
   * Unterscheidet zwischen Endboss und normalen Gegnern.
   * @param {MoveableObject} enemy - Der getroffene Gegner.
   * @param {ThrowableObject} bottle - Die Flasche, die getroffen hat.
   */
  handleBottleHit(enemy, bottle) {
    if (enemy instanceof Endboss) {
      enemy.hitCount = (enemy.hitCount || 0) + 1
      // Erhöhter Schaden pro Treffer (33% statt 20%)
      enemy.energy = enemy.hitCount >= 3 ? 0 : 100 - 33.33 * enemy.hitCount // Weniger Treffer nötig (3 statt 5)
      this.world.endbossBar.setPercentage(enemy.energy)
      if (typeof window.playEndbossHurtSound === "function") {
        window.playEndbossHurtSound()
      }
    } else {
      enemy.energy = 0
      window.playChickenSound()
      setTimeout(() => {
        this.world.level.enemies = this.world.level.enemies.filter((e) => e !== enemy)
      }, 1000)
    }
    bottle.splash()
  }

  /**
   * Prüft Kollisionen mit einsammelbaren Objekten.
   * Überprüft Flaschen, Münzen und auf dem Boden liegende Flaschen.
   */
  checkCollectibles() {
    this.checkBottleCollisions()
    this.checkCoinCollisions()
    this.checkSplashedBottles()
  }

  /**
   * Prüft auf Kollisionen mit auf dem Boden liegenden Flaschen.
   * Ermöglicht das Einsammeln von Flaschen nach dem Aufprall.
   */
  checkSplashedBottles() {
    this.world.throwableObjects.forEach((bottle) => {
      if (bottle.canBeCollected && this.world.character.isColliding(bottle)) {
        this.collectSplashedBottle(bottle)
      }
    })
  }

  /**
   * Sammelt eine auf dem Boden liegende Flasche ein.
   * Aktualisiert den Flaschenvorrat und entfernt die Flasche aus der Welt.
   * @param {ThrowableObject} bottle - Die einzusammelnde Flasche.
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
   * Prüft Kollisionen mit Flaschen.
   * Ermöglicht das Einsammeln von Flaschen in der Spielwelt.
   */
  checkBottleCollisions() {
    this.world.level.bottles.forEach((bottle) => {
      if (this.world.character.isColliding(bottle) && this.world.collectedBottles < 5) {
        this.collectBottle(bottle)
      }
    })
  }

  /**
   * Sammelt eine Flasche ein.
   * Aktualisiert den Flaschenvorrat und entfernt die Flasche aus der Welt.
   * @param {Bottle} bottle - Die einzusammelnde Flasche.
   */
  collectBottle(bottle) {
    this.world.collectedBottles++
    this.world.bottleBar.setPercentage(this.world.collectedBottles * 20)
    this.world.level.bottles = this.world.level.bottles.filter((b) => b !== bottle)
    window.playBottleSound()
  }

  /**
   * Prüft Kollisionen mit Münzen.
   * Ermöglicht das Einsammeln von Münzen in der Spielwelt.
   */
  checkCoinCollisions() {
    this.world.level.coins.forEach((coin) => {
      if (this.world.character.isColliding(coin)) {
        this.collectCoin(coin)
      }
    })
  }

  /**
   * Sammelt eine Münze ein.
   * Aktualisiert den Münzvorrat und entfernt die Münze aus der Welt.
   * @param {Coin} coin - Die einzusammelnde Münze.
   */
  collectCoin(coin) {
    this.world.collectedCoins++
    this.world.coinBar.setPercentage(this.world.collectedCoins * 20)
    this.world.level.coins = this.world.level.coins.filter((c) => c !== coin)
    window.playCoinSound()
  }
}