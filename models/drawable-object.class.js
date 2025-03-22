class DrawableObject {
  img
  imageCache = {}
  currentImage = 0
  x = 120
  y = 280
  height = 150
  width = 100

  /**
   * Lädt ein einzelnes Bild.
   *
   * @param {string} path - Der Pfad zum Bild.
   */
  loadImage(path) {
    this.img = new Image()
    this.img.src = path
  }

  /**
   * Lädt mehrere Bilder und speichert diese im Cache.
   *
   * @param {string[]} arr - Array mit den Pfaden der Bilder.
   */
  loadImages(arr) {
    arr.forEach((path) => {
      const img = new Image()
      img.src = path
      this.imageCache[path] = img
    })
  }

  /**
   * Zeichnet das Objekt auf den übergebenen Zeichenkontext.
   *
   * @param {CanvasRenderingContext2D} ctx - Der Zeichenkontext des Canvas.
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
  }

  /**
   * Zeichnet einen Rahmen um das Objekt, wenn es von bestimmten Klassen erbt.
   *
   * @param {CanvasRenderingContext2D} ctx - Der Zeichenkontext des Canvas.
   */
  drawFrame(ctx) {
    if (
      this instanceof Character ||
      this instanceof Chicken ||
      this instanceof Endboss ||
      this instanceof Coin ||
      this instanceof Bottle
    ) {
      ctx.beginPath()
      ctx.lineWidth = "5"
      ctx.strokeStyle = "blue"
      ctx.rect(this.x, this.y, this.width, this.height)
      ctx.stroke()
    }
  }
}
