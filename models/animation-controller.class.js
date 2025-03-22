class CharacterAnimationController {
  constructor(character) {
    this.character = character
    this.lastDirection = false
    this.lastAnimationType = "idle"
  }

  /**
   * Initializes the animations.
   */
  initialize() {
    this.animateImages()
  }

  /**
   * Starts the image animation loop.
   */
  animateImages() {
    setInterval(() => this.updateCharacterImage(), 100)
  }

  /**
   * Updates the character image based on its state.
   */
  updateCharacterImage() {
    if (!window.gameRunning) return
    const anim = this.determineAnimation()
    this.playAnimation(anim)
  }

  /**
   * Determines the current animation based on the character's state.
   * @returns {string[]} Array of image paths.
   */
  determineAnimation() {
    if (this.character.isDead()) {
      this.resetAnimationIfNeeded("dead")
      return this.character.IMAGES_DEAD
    }

    if (this.character.isHurt()) {
      this.resetAnimationIfNeeded("hurt")
      return this.character.IMAGES_HURT
    }

    if (this.character.isAboveGround()) {
      this.resetAnimationIfNeeded("jumping")
      return this.character.IMAGES_JUMPING
    }

    if (this.isWalking()) {
      return this.handleWalkingAnimation()
    }

    if (this.character.isIdle()) {
      return this.handleIdleAnimation()
    }

    return this.handleDefaultAnimation()
  }

  /**
   * Checks if character is walking.
   * @returns {boolean} True if walking.
   */
  isWalking() {
    return (
      this.character.world &&
      this.character.world.keyboard &&
      (this.character.world.keyboard.RIGHT || this.character.world.keyboard.LEFT)
    )
  }

  /**
   * Handles walking animation.
   * @returns {string[]} Walking animation frames.
   */
  handleWalkingAnimation() {
    window.stopSnoreSound()

    if (this.lastDirection !== this.character.otherDirection) {
      this.character.currentImage = 0
      this.lastDirection = this.character.otherDirection
    }

    return this.character.IMAGES_WALKING
  }

  /**
   * Handles idle animation.
   * @returns {string[]} Idle animation frames.
   */
  handleIdleAnimation() {
    window.playSnoreSound()
    this.resetAnimationIfNeeded("sleeping")
    return this.character.IMAGES_SLEEPING
  }

  /**
   * Handles default animation.
   * @returns {string[]} Default animation frames.
   */
  handleDefaultAnimation() {
    window.stopSnoreSound()
    this.resetAnimationIfNeeded("idle")
    return this.character.IMAGES_IDLE
  }

  /**
   * Resets the animation if the type has changed.
   * @param {string} type - The new animation type.
   */
  resetAnimationIfNeeded(type) {
    if (this.lastAnimationType !== type) {
      this.character.currentImage = 0
      this.lastAnimationType = type
    }
  }

  /**
   * Plays the animation.
   * @param {string[]} anim - Array of image paths.
   */
  playAnimation(anim) {
    this.character.playAnimation(anim)
  }
}

