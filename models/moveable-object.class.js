class MoveableObject extends DrawableObject {
  speed = 0.15
  otherDirection = false
  speedY = 0
  speedX = 0
  acceleration = 2.5
  energy = 100
  lastHit = 0
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
  groundY = 180

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY
        this.speedY -= this.acceleration
        this.limitGroundContact()
      }
    }, 1000 / 25)
  }

  limitGroundContact() {
    if (this.y > this.groundY) {
      this.y = this.groundY
      this.speedY = 0
    }
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      // Declared ThrowableObject
      return true
    } else {
      return this.y < this.groundY
    }
  }

  // Verbesserte Kollisionserkennung mit präziseren Offsets
  isColliding(mo) {
    // Berechne die tatsächlichen Kollisionsgrenzen unter Berücksichtigung der Offsets
    const thisLeft = this.x + this.offset.left
    const thisRight = this.x + this.width - this.offset.right
    const thisTop = this.y + this.offset.top
    const thisBottom = this.y + this.height - this.offset.bottom

    const moLeft = mo.x + mo.offset.left
    const moRight = mo.x + mo.width - mo.offset.right
    const moTop = mo.y + mo.offset.top
    const moBottom = mo.y + mo.height - mo.offset.bottom

    // Überprüfe, ob sich die Rechtecke überschneiden
    return thisRight > moLeft && thisLeft < moRight && thisBottom > moTop && thisTop < moBottom
  }

  // Verbesserte Kopfkollisionserkennung
  isCollidingWithHead(mo) {
    const headRange = mo.height * 0.4
    return (
      this.isColliding(mo) &&
      this.y + this.height - this.offset.bottom < mo.y + mo.offset.top + headRange &&
      this.speedY < 0
    )
  }

  bounce() {
    this.speedY = 15
  }

  hit() {
    this.energy -= 10
    this.energy = Math.max(0, this.energy)
    this.lastHit = new Date().getTime()
  }

  isHurt() {
    const timePassed = (new Date().getTime() - this.lastHit) / 1000
    return timePassed < 1
  }

  isDead() {
    return this.energy === 0
  }

  playAnimation(images) {
    const i = this.currentImage % images.length
    this.img = this.imageCache[images[i]]
    this.currentImage++
  }

  moveRight() {
    this.x += this.speed
  }

  moveLeft() {
    this.x -= this.speed
  }

  jump() {
    this.speedY = 30
  }
}

