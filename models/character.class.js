class Character extends MoveableObject {
  height = 280
  width = 120
  y = 160
  speed = 10
  groundY = 150
  offset = { top: 120, left: 20, right: 20, bottom: 10 }
  lastAction = 0
  idleTimeout = 6500
  animationController
  movementController

  IMAGES_IDLE = [
    "img/character_pepe/idle/idle/I-1.png",
    "img/character_pepe/idle/idle/I-2.png",
    "img/character_pepe/idle/idle/I-3.png",
    "img/character_pepe/idle/idle/I-4.png",
    "img/character_pepe/idle/idle/I-5.png",
    "img/character_pepe/idle/idle/I-6.png",
    "img/character_pepe/idle/idle/I-7.png",
    "img/character_pepe/idle/idle/I-8.png",
    "img/character_pepe/idle/idle/I-9.png",
    "img/character_pepe/idle/idle/I-10.png",
  ]

  IMAGES_SLEEPING = [
    "img/character_pepe/idle/long_idle/I-11.png",
    "img/character_pepe/idle/long_idle/I-12.png",
    "img/character_pepe/idle/long_idle/I-13.png",
    "img/character_pepe/idle/long_idle/I-14.png",
    "img/character_pepe/idle/long_idle/I-15.png",
    "img/character_pepe/idle/long_idle/I-16.png",
    "img/character_pepe/idle/long_idle/I-17.png",
    "img/character_pepe/idle/long_idle/I-18.png",
    "img/character_pepe/idle/long_idle/I-19.png",
    "img/character_pepe/idle/long_idle/I-20.png",
  ]

  IMAGES_WALKING = [
    "img/character_pepe/walk/W-21.png",
    "img/character_pepe/walk/W-22.png",
    "img/character_pepe/walk/W-23.png",
    "img/character_pepe/walk/W-24.png",
    "img/character_pepe/walk/W-25.png",
    "img/character_pepe/walk/W-26.png",
  ]

  IMAGES_JUMPING = [
    "img/character_pepe/jump/J-31.png",
    "img/character_pepe/jump/J-32.png",
    "img/character_pepe/jump/J-33.png",
    "img/character_pepe/jump/J-34.png",
    "img/character_pepe/jump/J-35.png",
    "img/character_pepe/jump/J-36.png",
    "img/character_pepe/jump/J-37.png",
    "img/character_pepe/jump/J-38.png",
    "img/character_pepe/jump/J-39.png",
  ]

  IMAGES_HURT = [
    "img/character_pepe/hurt/H-41.png",
    "img/character_pepe/hurt/H-42.png",
    "img/character_pepe/hurt/H-43.png",
  ]

  IMAGES_DEAD = [
    "img/character_pepe/dead/D-51.png",
    "img/character_pepe/dead/D-52.png",
    "img/character_pepe/dead/D-53.png",
    "img/character_pepe/dead/D-54.png",
    "img/character_pepe/dead/D-55.png",
    "img/character_pepe/dead/D-56.png",
    "img/character_pepe/dead/D-57.png",
  ]

  world
  constructor() {
    super()
    this.loadImage("img/character_pepe/idle/idle/I-1.png")
    this.loadAllImages()
    this.applyGravity()
    this.animationController = new CharacterAnimationController(this)
    this.movementController = new CharacterMovementController(this)

    this.animate()
  }

  /**
   * Loads all animation images.
   */
  loadAllImages() {
    if (this.IMAGES_IDLE) this.loadImages(this.IMAGES_IDLE)
    if (this.IMAGES_SLEEPING) this.loadImages(this.IMAGES_SLEEPING)
    if (this.IMAGES_WALKING) this.loadImages(this.IMAGES_WALKING)
    if (this.IMAGES_JUMPING) this.loadImages(this.IMAGES_JUMPING)
    if (this.IMAGES_HURT) this.loadImages(this.IMAGES_HURT)
    if (this.IMAGES_DEAD) this.loadImages(this.IMAGES_DEAD)
  }

  /**
   * Starts animations.
   */
  animate() {
    this.animationController.initialize()
    this.movementController.initialize()
  }

  /**
   * Updates the last action timestamp.
   */
  updateLastAction() {
    this.lastAction = new Date().getTime()
  }

  /**
   * Checks if the character is idle.
   * @returns {boolean} True if idle.
   */
  isIdle() {
    return new Date().getTime() - this.lastAction > this.idleTimeout
  }

  /**
   * Reduces energy when hit.
   * @param {number} damage - Damage (default: 25).
   */
  hit(damage = 25) {
    if (!this.isHurt() && !this.isDead() && window.gameRunning) {
      this.energy = Math.max(0, this.energy - damage)
      this.lastHit = new Date().getTime()

      if (this.world && this.world.statusBar) {
        this.world.statusBar.setPercentage(this.energy)
      }

      if (this.energy <= 0 && typeof window.showGameOver === "function" && window.gameRunning) {
        setTimeout(() => {
          window.showGameOver()
        }, 500)
      } else {
        window.playHurtSound()
      }
    }
  }
}

