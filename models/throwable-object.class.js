class ThrowableObject extends MoveableObject {
  IMAGES_ROTATION = [
    "img/salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  IMAGES_SPLASH = [
    "img/salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  animationInterval = null;
  rotationInterval = null;
  splashAnimationInterval = null;
  rotation = 0;
  rotationSpeed = 10;
  isSplashed = false;
  hasHitGround = false;
  splashTimeout = null;
  canBeCollected = false;
  world = null;

  /**
   * Creates a new throwable object.
   * @param {number} x - X-coordinate.
   * @param {number} y - Y-coordinate.
   * @param {boolean} otherDirection - Throwing direction.
   */
  constructor(x, y, otherDirection) {
    super();
    this.loadImage("img/salsa_bottle/bottle_rotation/1_bottle_rotation.png");
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = y;
    this.height = 80;
    this.width = 80;
    this.throw(otherDirection);
  }

  /**
   * Throws the object.
   * @param {boolean} otherDirection - Throwing direction.
   */
  throw(otherDirection) {
    this.speedY = 15;
    this.acceleration = 1;
    this.speedX = otherDirection ? -8 : 8;
    this.groundY = 350;
    this.applyGravity();
    this.animationInterval = setInterval(() => {
      if (!this.isSplashed) {
        this.x += this.speedX;
      }
      this.checkGroundContact();
    }, 25);
    this.rotationInterval = setInterval(() => {
      if (!this.isSplashed) {
        this.rotation += this.rotationSpeed;
        this.playAnimation(this.IMAGES_ROTATION);
      }
    }, 50);
  }

  /**
   * Applies gravity to the object.
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      } else {
        if (!this.isSplashed && !this.hasHitGround) {
          this.splash();
        }
      }
    }, 1000 / 25);
  }

  /**
   * Checks if the object is above ground.
   * @returns {boolean}
   */
  isAboveGround() {
    return this.y < this.groundY;
  }

  /**
   * Checks for ground contact.
   */
  checkGroundContact() {
    if (this.y >= this.groundY && !this.isSplashed && !this.hasHitGround) {
      this.splash();
    }
  }

  /**
   * Executes the splash animation.
   */
  splash() {
    this.hasHitGround = true;
    this.isSplashed = true;
    this.speedY = 0;
    this.speedX = 0;
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
      this.rotationInterval = null;
    }
    this.startSplashAnimation();
    this.canBeCollected = true;
  }

  /**
   * Starts the splash animation.
   */
  startSplashAnimation() {
    this.resetSplashAnimation();
    this.runSplashAnimationSequence();
  }

  /**
   * Resets the splash animation.
   */
  resetSplashAnimation() {
    this.currentSplashImage = 0;
    if (this.splashAnimationInterval) {
      clearInterval(this.splashAnimationInterval);
    }
  }

  /**
   * Runs the splash animation sequence.
   */
  runSplashAnimationSequence() {
    this.splashAnimationInterval = setInterval(() => {
      this.updateSplashFrame();
    }, 100);
  }

  /**
   * Updates the current splash frame.
   */
  updateSplashFrame() {
    if (this.currentSplashImage < this.IMAGES_SPLASH.length) {
      this.img = this.imageCache[this.IMAGES_SPLASH[this.currentSplashImage]];
      this.currentSplashImage++;
    } else {
      this.finishSplashAnimation();
    }
  }

  /**
   * Finishes the splash animation.
   */
  finishSplashAnimation() {
    clearInterval(this.splashAnimationInterval);
    this.splashAnimationInterval = null;
    this.splashTimeout = setTimeout(() => {
      this.destroy();
    }, 500);
  }

  /**
   * Draws the object on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas context.
   */
  draw(ctx) {
    if (this.isSplashed) {
      super.draw(ctx);
    } else {
      ctx.save();
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
      ctx.restore();
    }
  }

  /**
   * Destroys the object and cleans up resources.
   */
  destroy() {
    this.clearAllIntervals();
    if (this.world && this.world.throwableObjects) {
      const index = this.world.throwableObjects.indexOf(this);
      if (index !== -1) {
        this.world.throwableObjects.splice(index, 1);
      }
    }
  }

  /**
   * Clears all intervals and timeouts.
   */
  clearAllIntervals() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
      this.rotationInterval = null;
    }
    if (this.splashAnimationInterval) {
      clearInterval(this.splashAnimationInterval);
      this.splashAnimationInterval = null;
    }
    if (this.splashTimeout) {
      clearTimeout(this.splashTimeout);
      this.splashTimeout = null;
    }
  }
}
