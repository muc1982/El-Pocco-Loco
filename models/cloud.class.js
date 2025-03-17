class Cloud extends MoveableObject {
  constructor() {
    super()
    this.loadImage("img/background/layers/4_clouds/2.png")
    this.x = Math.random() * 2000
    this.y = 20
    this.width = 500
    this.height = 250
    this.speed = 0.15
    this.animate()
  }

  animate() {
    setInterval(() => {
      this.moveLeft()
      const screenWidth = window.innerWidth
      if (this.x < -this.width) this.x = screenWidth + Math.random() * 100
    }, 1000 / 60)
  }
}

