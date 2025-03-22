class Endboss extends MoveableObject {
  width = 650
  height = 325
  y = 120
  groundY = 30
  energy = 100
  isAlerted = false
  world
  baseSpeed = 0.80
  fallStarted = false
  deathProcessed = false
  fireballCooldown = false
  fireballInterval = null

  offset = {
    top: 40,
    left: 60,
    right: 60,
    bottom: 30,
  }

  IMAGES_WALKING = [
    "img/enemie_boss_chicken/walk/G1.png",
    "img/enemie_boss_chicken/walk/G2.png",
    "img/enemie_boss_chicken/walk/G3.png",
    "img/enemie_boss_chicken/walk/G4.png",
  ]

  IMAGES_ALERT = [
    "img/enemie_boss_chicken/alert/G5.png",
    "img/enemie_boss_chicken/alert/G7.png",
    "img/enemie_boss_chicken/alert/G8.png",
    "img/enemie_boss_chicken/alert/G9.png",
    "img/enemie_boss_chicken/alert/G10.png",
    "img/enemie_boss_chicken/alert/G11.png",
    "img/enemie_boss_chicken/alert/G12.png",
  ]

  IMAGES_ATTACK = [
    "img/enemie_boss_chicken/attack/G13.png",
    "img/enemie_boss_chicken/attack/G14.png",
    "img/enemie_boss_chicken/attack/G15.png",
    "img/enemie_boss_chicken/attack/G16.png",
    "img/enemie_boss_chicken/attack/G17.png",
    "img/enemie_boss_chicken/attack/G18.png",
    "img/enemie_boss_chicken/attack/G19.png",
    "img/enemie_boss_chicken/attack/G20.png",
  ]

  IMAGES_HURT = [
    "img/enemie_boss_chicken/hurt/G21.png",
    "img/enemie_boss_chicken/hurt/G22.png",
    "img/enemie_boss_chicken/hurt/G23.png",
  ]

  IMAGES_DEAD = [
    "img/enemie_boss_chicken/dead/G24.png",
    "img/enemie_boss_chicken/dead/G25.png",
    "img/enemie_boss_chicken/dead/G26.png",
  ]

  /**
   * Constructs a new Endboss.
   * @param {number} [level=1] - Level affecting speed and strength.
   */
  constructor(level = 1) {
    super()
    this.loadImage(this.IMAGES_WALKING[0])
    this.loadImages(this.IMAGES_WALKING)
    this.loadImages(this.IMAGES_ALERT)
    this.loadImages(this.IMAGES_ATTACK)
    this.loadImages(this.IMAGES_HURT)
    this.loadImages(this.IMAGES_DEAD)
    this.x = 2500
    this.speed = this.baseSpeed * (1 + (level - 1) * 2.0)
    this.energy = 100
    this.animate()
  }

  /**
   * Animates the movement of the Endboss.
   */
  animateMovement() {
    setInterval(() => {
      if (this.isDead()) {
        this.handleDeadMovement()
      } else if (this.isAlerted) {
        this.handleAlertedMovement()
      }
    }, 1000 / 60)
  }

  /**
   * Handles movement when Endboss is dead.
   */
  handleDeadMovement() {
    if (!this.fallStarted) {
      this.fallStarted = true
      this.speedY = 3
      this.acceleration = 0.2
      this.clearFireballInterval()
    }
    this.y += this.speedY
    this.speedY += this.acceleration
  }

  /**
   * Clears the fireball interval.
   */
  clearFireballInterval() {
    if (this.fireballInterval) {
      clearInterval(this.fireballInterval)
      this.fireballInterval = null
    }
  }

  /**
   * Handles movement when Endboss is alerted.
   */
  handleAlertedMovement() {
    this._anim_i++
    if (this._anim_i > 10) this.moveLeft()
    if (this._anim_i % 50 === 0) {
      this._attackMode = true
      this.tryFireFireball()
      setTimeout(() => (this._attackMode = false), 500)
    }
    if (!this.fireballInterval && this.isAlerted) {
      this.startFireballInterval()
    }
  }

  /**
   * Starts the fireball interval.
   */
  startFireballInterval() {
    this.fireballInterval = setInterval(() => {
      if (!this.isDead() && this.isAlerted) {
        this.tryFireFireball()
      }
    }, 4000)
  }

  /**
   * Attempts to fire a fireball if conditions are met.
   */
  tryFireFireball() {
    if (!this.fireballCooldown && this.world && !this.isDead()) {
      this.fireFireball()
      this.fireballCooldown = true
      setTimeout(() => {
        this.fireballCooldown = false
      }, 2000)
    }
  }

  /**
   * Animates the visual representation.
   */
  animateAnimation() {
    setInterval(() => {
      this.playAnimation(this.determineAnimation())
    }, 100)
  }

  /**
   * Determines which animation to play based on state.
   * @returns {string[]} The animation image array.
   */
  determineAnimation() {
    if (this.isDead()) {
      return this.IMAGES_DEAD
    } else if (this.isHurt()) {
      return this.IMAGES_HURT
    } else if (this._attackMode) {
      return this.IMAGES_ATTACK
    } else if (this.isAlerted && this._anim_i <= 10) {
      return this.IMAGES_ALERT
    } else {
      return this.IMAGES_WALKING
    }
  }

  /**
   * Starts all animations.
   */
  animate() {
    this._anim_i = 0
    this._attackMode = false
    this.animateMovement()
    this.animateAnimation()
  }

  /**
   * Fires a fireball towards the character.
   */
  fireFireball() {
    const fireballX = this.otherDirection ? this.x + this.width - 150 : this.x + 100
    const fireballY = this.y + 150
    const fireball = new Fireball(
      fireballX,
      fireballY,
      true, 
      this.world.character, 
    )

    fireball.world = this.world
    this.world.throwableObjects.push(fireball)
    window.playFireballSound()
  }
}
window.Endboss = Endboss

