class Bottle extends DrawableObject {
  width = 80
  height = 80
  offset = {
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
  }

  IMAGES = ["img/salsa_bottle/1_salsa_bottle_on_ground.png", "img/salsa_bottle/2_salsa_bottle_on_ground.png"]

  /**
   * Erstellt eine neue Bottle-Instanz
   */
  constructor() {
    super()

    // Wähle zufällig eines der Flaschenbilder aus
    const randomIndex = Math.floor(Math.random() * this.IMAGES.length)
    this.loadImage(this.IMAGES[randomIndex])

    // Zufällige Position
    this.x = 200 + Math.random() * 2000
    this.y = 350
  }
}

