class CharacterMovementController {
  constructor(character) {
    this.character = character
  }

  /**
   * Initializes movement control.
   */
  initialize() {
    this.animateMovement()
  }

  /**
   * Starts the movement animation loop.
   */
  animateMovement() {
    setInterval(() => this.handleMovement(), 1000 / 60)
  }

  /**
   * Handles character movement.
   */
  handleMovement() {
    if (this.cannotMove()) return

    const moved = this.handleHorizontalMovement()
    const jumped = this.handleJump()

    this.handleSoundEffects(moved, jumped)
    this.updateCameraPosition()
  }

  /**
   * Checks if character cannot move.
   * @returns {boolean} True if cannot move.
   */
  cannotMove() {
    return !this.character.world || !this.character.world.keyboard || this.character.isDead()
  }

  /**
   * Handles sound effects based on movement.
   * @param {boolean} moved - True if moved horizontally.
   * @param {boolean} jumped - True if jumped.
   */
  handleSoundEffects(moved, jumped) {
    if (moved || jumped) window.stopSnoreSound()

    if (!this.character.world.keyboard.RIGHT && !this.character.world.keyboard.LEFT) {
      window.stopWalkingSound()
    }
  }

  /**
   * Processes horizontal movement.
   * @returns {boolean} True if moved.
   */
  handleHorizontalMovement() {
    let moved = false

    if (this.canMoveRight()) {
      this.moveRight()
      moved = true
    }

    if (this.canMoveLeft()) {
      this.moveLeft()
      moved = true
    }

    return moved
  }

  /**
   * Checks if character can move right.
   * @returns {boolean} True if can move right.
   */
  canMoveRight() {
    return this.character.world.keyboard.RIGHT && this.character.x < this.character.world.level.level_end_x
  }

  /**
   * Checks if character can move left.
   * @returns {boolean} True if can move left.
   */
  canMoveLeft() {
    return this.character.world.keyboard.LEFT && this.character.x > 0
  }

  /**
   * Moves the character to the right.
   */
  moveRight() {
    this.character.moveRight()
    this.character.otherDirection = false
    this.character.updateLastAction()
    window.playWalkingSound()
  }

  /**
   * Moves the character to the left.
   */
  moveLeft() {
    this.character.moveLeft()
    this.character.otherDirection = true
    this.character.updateLastAction()
    window.playWalkingSound()
  }

  /**
   * Processes jump action.
   * @returns {boolean} True if jumped.
   */
  handleJump() {
    if (this.canJump()) {
      this.character.jump()
      this.character.updateLastAction()
      window.playJumpSound()
      return true
    }
    return false
  }

  /**
   * Checks if character can jump.
   * @returns {boolean} True if can jump.
   */
  canJump() {
    return this.character.world.keyboard.SPACE && !this.character.isAboveGround()
  }

  /**
   * Updates the camera position to center on the character.
   */
  updateCameraPosition() {
    this.character.world.camera_x = -this.character.x + 100
  }
}

