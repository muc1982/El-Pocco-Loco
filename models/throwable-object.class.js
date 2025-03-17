class ThrowableObject extends MoveableObject {
  IMAGES_ROTATION = [
    "img/salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ]

  IMAGES_SPLASH = [
    "img/salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ]

  animationInterval = null
  rotationInterval = null
  splashAnimationInterval = null
  rotation = 0
  rotationSpeed = 10
  isSplashed = false
  hasHitGround = false
  splashTimeout = null
  canBeCollected = false
  currentSplashImage = 0

  constructor(x, y, otherDirection) {
    super()
    this.loadImage("img/salsa_bottle/bottle_rotation/1_bottle_rotation.png")
    this.loadImages(this.IMAGES_ROTATION)
    this.loadImages(this.IMAGES_SPLASH)

    // Etwas tiefer + offset
    this.x = x
    this.y = y

    this.height = 80
    this.width = 80

    this.throw(otherDirection)
  }

  throw(otherDirection) {
    this.speedY = 15 // Etwas weniger Höhe
    this.acceleration = 1 // Schnelleres Fallen
    this.speedX = otherDirection ? -8 : 8 // Schnellere horizontale Bewegung
    this.groundY = 350
    this.applyGravity()
    this.animationInterval = setInterval(() => {
      if (!this.isSplashed) {
        this.x += this.speedX
      }
      this.checkGroundContact()
    }, 25)
    this.rotationInterval = setInterval(() => {
      if (!this.isSplashed) {
        this.rotation += this.rotationSpeed
        this.playAnimation(this.IMAGES_ROTATION)
      }
    }, 50)
  }

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY
        this.speedY -= this.acceleration
      } else {
        if (!this.isSplashed && !this.hasHitGround) {
          this.splash()
        }
      }
    }, 1000 / 25)
  }

  isAboveGround() {
    return this.y < this.groundY
  }

  checkGroundContact() {
    if (this.y >= this.groundY && !this.isSplashed && !this.hasHitGround) {
      this.splash()
    }
  }

  splash() {
    this.hasHitGround = true
    this.isSplashed = true
    this.speedY = 0
    this.speedX = 0
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval)
      this.rotationInterval = null
    }
    this.startSplashAnimation()
    this.canBeCollected = true
  }

  startSplashAnimation() {
    this.currentSplashImage = 0
    this.splashAnimationInterval = setInterval(() => {
      if (this.currentSplashImage < this.IMAGES_SPLASH.length) {
        this.img = this.imageCache[this.IMAGES_SPLASH[this.currentSplashImage]]
        this.currentSplashImage++
      } else {
        clearInterval(this.splashAnimationInterval)
        this.splashAnimationInterval = null
      }
    }, 100)
  }

  draw(ctx) {
    if (this.isSplashed) {
      super.draw(ctx)
    } else {
      ctx.save()
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2)
      ctx.rotate((this.rotation * Math.PI) / 180)
      ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height)
      ctx.restore()
    }
  }

  destroy() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval)
      this.animationInterval = null
    }
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval)
      this.rotationInterval = null
    }
    if (this.splashAnimationInterval) {
      clearInterval(this.splashAnimationInterval)
      this.splashAnimationInterval = null
    }
    if (this.splashTimeout) {
      clearTimeout(this.splashTimeout)
      this.splashTimeout = null
    }
  }
}

