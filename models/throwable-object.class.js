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
  world = null

  /**
   * Erstellt ein neues werfbares Objekt.
   * @param {number} x - X-Koordinate
   * @param {number} y - Y-Koordinate
   * @param {boolean} otherDirection - Wurfrichtung
   */
  constructor(x, y, otherDirection) {
    super()
    this.loadImage("img/salsa_bottle/bottle_rotation/1_bottle_rotation.png")
    this.loadImages(this.IMAGES_ROTATION)
    this.loadImages(this.IMAGES_SPLASH)

    this.x = x
    this.y = y
    this.height = 80
    this.width = 80
    this.throw(otherDirection)
  }

  /**
   * Wirft das Objekt.
   * @param {boolean} otherDirection - Wurfrichtung
   */
  throw(otherDirection) {
    this.speedY = 15
    this.acceleration = 1
    this.speedX = otherDirection ? -8 : 8
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

  /**
   * Wendet die Schwerkraft auf das Objekt an.
   */
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

  /**
   * Prüft, ob sich das Objekt über dem Boden befindet.
   * @returns {boolean} - Wenn über dem Boden
   */
  isAboveGround() {
    return this.y < this.groundY
  }

  /**
   * Prüft, ob die Flasche den Boden berührt hat.
   */
  checkGroundContact() {
    if (this.y >= this.groundY && !this.isSplashed && !this.hasHitGround) {
      this.splash()
    }
  }

  /**
   * Führt die Splash-Animation aus, wenn die Flasche zerbricht.
   */
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

  /**
   * Startet die Splash-Animation.
   * Animiert das Zerbrechen der Flasche und entfernt sie nach Abschluss.
   */
  startSplashAnimation() {
    this.resetSplashAnimation()
    this.runSplashAnimationSequence()
  }

  /**
   * Setzt den Zustand der Splash-Animation zurück.
   */
  resetSplashAnimation() {
    this.currentSplashImage = 0
    if (this.splashAnimationInterval) {
      clearInterval(this.splashAnimationInterval)
    }
  }

  /**
   * Führt die Splash-Animationssequenz aus und kümmert sich um die Bereinigung.
   */
  runSplashAnimationSequence() {
    this.splashAnimationInterval = setInterval(() => {
      this.updateSplashFrame()
    }, 100)
  }

  /**
   * Aktualisiert das aktuelle Splash-Animationsframe.
   */
  updateSplashFrame() {
    if (this.currentSplashImage < this.IMAGES_SPLASH.length) {
      this.img = this.imageCache[this.IMAGES_SPLASH[this.currentSplashImage]]
      this.currentSplashImage++
    } else {
      this.finishSplashAnimation()
    }
  }

  /**
   * Beendet die Splash-Animation und plant die Entfernung.
   */
  finishSplashAnimation() {
    clearInterval(this.splashAnimationInterval)
    this.splashAnimationInterval = null
    
    // Splash-Animation nach Abschluss entfernen
    this.splashTimeout = setTimeout(() => {
      this.destroy()
    }, 500)
  }

  /**
   * Zeichnet das Objekt auf dem Canvas.
   * @param {CanvasRenderingContext2D} ctx - Canvas-Kontext
   */
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

  /**
   * Zerstört dieses werfbare Objekt und bereinigt Ressourcen.
   */
  destroy() {
    this.clearAllIntervals()
    // Aus der Welt entfernen, wenn möglich
    if (this.world && this.world.throwableObjects) {
      const index = this.world.throwableObjects.indexOf(this)
      if (index !== -1) {
        this.world.throwableObjects.splice(index, 1)
      }
    }
  }

  /**
   * Löscht alle Intervalle und Timeouts.
   */
  clearAllIntervals() {
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