class MoveableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  speedX = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;
  offset = { top: 0, left: 0, right: 0, bottom: 0 };
  groundY = 180;

  /**
   * Applies gravity to the object.
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
        this.limitGroundContact();
      }
    }, 1000 / 25);
  }

  /**
   * Prevents the object from falling below ground.
   */
  limitGroundContact() {
    if (this.y > this.groundY) {
      this.y = this.groundY;
      this.speedY = 0;
    }
  }

  /**
   * Checks if the object is above ground.
   * @returns {boolean} True if above ground.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) return true;
    return this.y < this.groundY;
  }

  /**
   * Checks collision with another object.
   * @param {Object} mo - The other object.
   * @returns {boolean} True if colliding.
   */
  isColliding(mo) {
    const thisLeft = this.x + this.offset.left;
    const thisRight = this.x + this.width - this.offset.right;
    const thisTop = this.y + this.offset.top;
    const thisBottom = this.y + this.height - this.offset.bottom;

    const moLeft = mo.x + mo.offset.left;
    const moRight = mo.x + mo.width - mo.offset.right;
    const moTop = mo.y + mo.offset.top;
    const moBottom = mo.y + mo.height - mo.offset.bottom;

    return thisRight > moLeft && thisLeft < moRight && thisBottom > moTop && thisTop < moBottom;
  }

  /**
   * Checks for a head collision.
   * @param {Object} mo - The other object.
   * @returns {boolean} True if head collision detected.
   */
  isCollidingWithHead(mo) {
    const headRange = mo.height * 0.4;
    return (
      this.isColliding(mo) &&
      this.y + this.height - this.offset.bottom < mo.y + mo.offset.top + headRange &&
      this.speedY < 0
    );
  }

  /**
   * Makes the object bounce.
   */
  bounce() {
    this.speedY = 15;
  }

  /**
   * Reduces the object's energy when hit.
   */
  hit() {
    this.energy -= 10;
    this.energy = Math.max(0, this.energy);
    this.lastHit = new Date().getTime();
  }

  /**
   * Checks if the object is hurt.
   * @returns {boolean} True if hurt.
   */
  isHurt() {
    const timePassed = (new Date().getTime() - this.lastHit) / 1000;
    return timePassed < 1;
  }

  /**
   * Checks if the object is dead.
   * @returns {boolean} True if dead.
   */
  isDead() {
    return this.energy === 0;
  }

  /**
   * Plays an animation sequence.
   * @param {string[]} images - Array of image paths.
   */
  playAnimation(images) {
    const i = this.currentImage % images.length;
    this.img = this.imageCache[images[i]];
    this.currentImage++;
  }

  /**
   * Moves the object to the right.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the object to the left.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Makes the object jump.
   */
  jump() {
    this.speedY = 30;
  }
}
