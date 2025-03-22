class GameStateManager {
  constructor(world) {
    this.world = world
    this.victoryShown = false
    this.gameEnded = false
    this.debugMode = true 
  }

  /**
   * Checks the game state.
   */
  checkGameState() {
    if (this.gameEnded) return

    if (this.characterIsDead()) {
      this.handleGameOver()
      return
    }

    this.checkWinCondition()
    this.checkEndbossContact()
  }

  /**
   * Checks if the character is dead.
   * @returns {boolean} True if energy is 0.
   */
  characterIsDead() {
    return this.world.character.energy <= 0
  }

  /**
   * Handles game over state.
   */
  handleGameOver() {
    this.gameEnded = true
    window.showGameOver()
  }

  /**
   * Checks if the character is near the Endboss.
   */
  checkEndbossContact() {
    this.world.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        if (this.isCharacterNearEndboss(enemy)) {
          this.activateEndboss(enemy)
        }
      }
    })
  }

  /**
   * Determines if the character is near the Endboss.
   * @param {Endboss} enemy - The Endboss.
   * @returns {boolean} True if near.
   */
  isCharacterNearEndboss(enemy) {
    return this.world.character.x > enemy.x - 700
  }

  /**
   * Checks if the game is won.
   */
  checkWinCondition() {
    if (this.victoryShown) return

    const endboss = this.world.level.enemies.find((enemy) => enemy instanceof Endboss)
    if (this.isEndbossDefeated(endboss)) {
      this.handleVictory()
    }
  }

  /**
   * Checks if the Endboss is defeated.
   * @param {Endboss} endboss - The Endboss.
   * @returns {boolean} True if defeated.
   */
  isEndbossDefeated(endboss) {
    return endboss && endboss.isDead() && endboss.fallStarted && endboss.y > this.world.canvas.height
  }

  /**
   * Handles victory.
   */
  handleVictory() {
    this.victoryShown = true
    this.gameEnded = true
    this.world.collectedBottles = 0
    this.world.collectedCoins = 0
    window.gameRunning = false
    window.showVictoryScreen(this.world.currentLevel)
  }

  /**
   * Activates the Endboss.
   * @param {Endboss} enemy - The Endboss.
   */
  activateEndboss(enemy) {
    enemy.isAlerted = true
    this.world.endbossBarVisible = true
  }
}

