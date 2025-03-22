class Fireball extends MoveableObject {
  width = 60
  height = 60
  speedY = 0
  speedX = 0
  damage = 15

  /**
   * Creates a new Fireball instance.
   * @param {number} x - The x-coordinate.
   * @param {number} y - The y-coordinate.
   * @param {boolean} towardsCharacter - Whether to move towards the character.
   * @param {Character} character - The character to target.
   */
  constructor(x, y, towardsCharacter = false, character = null) {
    super()
    this.loadImage("img/own_pictures/feuerball.png")
    this.x = x
    this.y = y

    if (towardsCharacter && character) {
      this.setDirectionTowardsCharacter(character)
    } else {
      this.speedY = 15
    }
    this.setMovement()
  }

  /**
   * Sets the direction of the fireball towards the character.
   * @param {Character} character - The character to target.
   */
  setDirectionTowardsCharacter(character) {
    const dx = character.x - this.x
    const dy = character.y + 150 - this.y 
    const length = Math.sqrt(dx * dx + dy * dy)
    const normalizedDx = dx / length
    const normalizedDy = dy / length
    const speed = 10
    this.speedX = normalizedDx * speed
    this.speedY = normalizedDy * speed
    this.rotation = Math.atan2(dy, dx) * (180 / Math.PI)
  }

  /**
   * Sets the movement for the fireball.
   */
  setMovement() {
    setInterval(() => {
      this.x += this.speedX
      this.y += this.speedY
      if (this.isOutOfScreen()) {
        this.destroy()
      }
    }, 1000 / 60)
  }

  /**
   * Checks if the fireball is out of screen.
   * @returns {boolean} True if out of screen.
   */
  isOutOfScreen() {
    return (
      this.y > 480 || 
      this.y < -this.height ||
      this.x > 3000 || 
      this.x < -this.width 
    )
  }

  /**
   * Draws the fireball on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas context.
   */
  draw(ctx) {
    if (this.rotation !== undefined) {
      ctx.save()
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2)
      ctx.rotate((this.rotation * Math.PI) / 180)
      ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height)
      ctx.restore()
    } else {
      super.draw(ctx)
    }
  }

  /**
   * Destroys the fireball and removes it from the world.
   */
  destroy() {
    if (this.world && this.world.throwableObjects) {
      const index = this.world.throwableObjects.indexOf(this)
      if (index !== -1) {
        this.world.throwableObjects.splice(index, 1)
      }
    }
  }

  /**
   * Simulates a splash effect for the fireball.
   * This is used to handle collision behavior similar to bottles.
   */
  splash() {
    this.destroy()
  }
}
window.Fireball = Fireball

