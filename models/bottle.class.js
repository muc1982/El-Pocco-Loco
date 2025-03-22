class Bottle extends DrawableObject {
  width = 72
  height = 72
  offset = {
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
  }
n
  IMAGES = ["img/salsa_bottle/1_salsa_bottle_on_ground.png", "img/salsa_bottle/2_salsa_bottle_on_ground.png"]

  /**
   * Creates a new Bottle instance with a random position.
   * @param {number} levelWidth - Width of the level.
   * @param {number} posY - Specific Y-position (default: 350).
   */
  constructor(levelWidth = 2500, posY = 350) {
    super()
    const randomIndex = Math.floor(Math.random() * this.IMAGES.length)
    this.loadImage(this.IMAGES[randomIndex])
    this.positionBottle(levelWidth, posY)
  }

  /**
   * Positions the bottle in the level.
   * @param {number} levelWidth - The level's width.
   * @param {number} posY - The Y-position.
   */
  positionBottle(levelWidth, posY) {
    const segmentWidth = levelWidth / 10
    const segment = Math.floor(Math.random() * 10)
    this.x = segment * segmentWidth + Math.random() * segmentWidth
    this.y = posY + (Math.random() > 0.8 ? -20 : 0)
  }

  /**
   * Creates multiple bottles.
   * @param {number} count - Number of bottles.
   * @param {number} levelWidth - Level width.
   * @returns {Bottle[]} Array of bottles.
   */
  static createMultiple(count, levelWidth = 2500) {
    const bottles = []
    for (let i = 0; i < count; i++) {
      bottles.push(new Bottle(levelWidth))
    }
    return bottles
  }
}

