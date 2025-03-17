class BackgroundObject extends MoveableObject {
  width = 719
  height = 480

  constructor(imagePath, x) {
    super()
    this.loadImage(imagePath)
    this.x = x
    this.y = 0
  }
}

