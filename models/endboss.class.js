class Endboss extends MoveableObject {
  width = 350
  height = 250
  y = 185
  groundY = 30
  energy = 100
  isAlerted = false
  world
  baseSpeed = 0.25
  fallStarted = false // Neuer Zustand, um den Fall zu starten
  deathProcessed = false // Damit der Sieg nur einmal ausgelöst wird

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
    "img/enemie_boss_chicken/alert/G6.png",
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

  constructor(level = 1) {
    super()
    this.loadImage(this.IMAGES_WALKING[0])
    this.loadImages(this.IMAGES_WALKING)
    this.loadImages(this.IMAGES_ALERT)
    this.loadImages(this.IMAGES_ATTACK)
    this.loadImages(this.IMAGES_HURT)
    this.loadImages(this.IMAGES_DEAD)
    this.x = 2500
    // Für den Endboss: Erhöhe den Multiplikator, z. B. 1 + (level-1)*1.2
    this.speed = this.baseSpeed * (1 + (level - 1) * 1.2)
    this.animate()
  }

  // In endboss.class.js:
  animateMovement() {
    setInterval(() => {
      if (!this.isDead() && this.isAlerted) {
        this._anim_i++
        if (this._anim_i > 10) this.moveLeft()
        if (this._anim_i % 50 === 0) {
          this._attackMode = true
          setTimeout(() => (this._attackMode = false), 500)
        }
      } else if (this.isDead()) {
        if (!this.fallStarted) {
          this.fallStarted = true
          this.speedY = 3
          this.acceleration = 0.2
        }
        this.y += this.speedY
        this.speedY += this.acceleration
      }
    }, 1000 / 60)
  }

  animateAnimation() {
    setInterval(() => {
      this.playAnimation(
        this.isDead()
          ? this.IMAGES_DEAD
          : this.isHurt()
            ? this.IMAGES_HURT
            : this._attackMode
              ? this.IMAGES_ATTACK
              : this.isAlerted && this._anim_i <= 10
                ? this.IMAGES_ALERT
                : this.IMAGES_WALKING,
      )
    }, 100)
  }

  animate() {
    this._anim_i = 0
    this._attackMode = false
    this.animateMovement()
    this.animateAnimation()
  }
}

