class MoveableObject extends DrawableObject {
  speed = 0.15
  otherDirection = false
  speedY = 0
  speedX = 0
  acceleration = 2.5
  energy = 100
  lastHit = 0
  /**
 * Offsets für die Kollisionsgrenzen.
 * @type {{top: number, left: number, right: number, bottom: number}}
 */
  offset = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }

  /**
   * Y-Koordinate, an der der Boden liegt.
   * @type {number}
   */
  groundY = 180

  /**
   * Wendet die Schwerkraft auf das Objekt an.
   * Aktualisiert in regelmäßigen Abständen die vertikale Position (y) und Geschwindigkeit (speedY)
   * und sorgt dafür, dass das Objekt den Boden nicht unterschreitet.
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY
        this.speedY -= this.acceleration
        this.limitGroundContact()
      }
    }, 1000 / 25)
  }

  /**
   * Stellt sicher, dass das Objekt nicht unter den Boden fällt.
   * Falls die y-Koordinate größer als groundY ist, wird sie korrigiert und speedY auf 0 gesetzt.
   */
  limitGroundContact() {
    if (this.y > this.groundY) {
      this.y = this.groundY
      this.speedY = 0
    }
  }

  /**
   * Überprüft, ob das Objekt sich über dem Boden befindet.
   * Falls das Objekt eine Instanz von ThrowableObject ist, wird immer true zurückgegeben.
   *
   * @returns {boolean} true, wenn das Objekt über dem Boden ist, sonst false.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      // Bei ThrowableObject immer true zurückgeben
      return true
    } else {
      return this.y < this.groundY
    }
  }

  /**
   * Prüft, ob dieses Objekt mit einem anderen Objekt kollidiert.
   * Dabei werden die tatsächlichen Kollisionsgrenzen unter Berücksichtigung der Offsets berechnet.
   *
   * @param {Object} mo - Das zu prüfende Objekt mit Eigenschaften x, y, width, height und offset.
   * @returns {boolean} true, wenn eine Kollision vorliegt, sonst false.
   */
  isColliding(mo) {
    // Berechne die tatsächlichen Kollisionsgrenzen für dieses Objekt
    const thisLeft = this.x + this.offset.left
    const thisRight = this.x + this.width - this.offset.right
    const thisTop = this.y + this.offset.top
    const thisBottom = this.y + this.height - this.offset.bottom

    // Berechne die tatsächlichen Kollisionsgrenzen für das andere Objekt
    const moLeft = mo.x + mo.offset.left
    const moRight = mo.x + mo.width - mo.offset.right
    const moTop = mo.y + mo.offset.top
    const moBottom = mo.y + mo.height - mo.offset.bottom

    // Überprüfe, ob sich die Rechtecke überschneiden
    return thisRight > moLeft && thisLeft < moRight && thisBottom > moTop && thisTop < moBottom
  }

  /**
   * Überprüft, ob eine Kopfkollision mit einem anderen Objekt vorliegt.
   * Eine Kopfkollision wird erkannt, wenn der untere Bereich des Objekts den Kopfbereich
   * (etwa 40% der Höhe) des anderen Objekts berührt und das Objekt dabei nach oben fällt.
   *
   * @param {Object} mo - Das zu prüfende Objekt.
   * @returns {boolean} true, wenn eine Kopfkollision erkannt wird, sonst false.
   */
  isCollidingWithHead(mo) {
    const headRange = mo.height * 0.4
    return (
      this.isColliding(mo) &&
      this.y + this.height - this.offset.bottom < mo.y + mo.offset.top + headRange &&
      this.speedY < 0
    )
  }

  /**
   * Lässt das Objekt "springen" bzw. prallt es ab, indem die vertikale Geschwindigkeit (speedY) erhöht wird.
   */
  bounce() {
    this.speedY = 15
  }

  /**
   * Verringert die Energie des Objekts bei einem Treffer.
   * Aktualisiert auch den Zeitpunkt des letzten Treffers.
   */
  hit() {
    this.energy -= 10
    this.energy = Math.max(0, this.energy)
    this.lastHit = new Date().getTime()
  }

  /**
   * Prüft, ob das Objekt kürzlich getroffen wurde (verletzt ist).
   *
   * @returns {boolean} true, wenn seit dem letzten Treffer weniger als 1 Sekunde vergangen ist.
   */
  isHurt() {
    const timePassed = (new Date().getTime() - this.lastHit) / 1000
    return timePassed < 1
  }

  /**
   * Überprüft, ob das Objekt tot ist.
   *
   * @returns {boolean} true, wenn die Energie des Objekts 0 beträgt, sonst false.
   */
  isDead() {
    return this.energy === 0
  }

  /**
   * Spielt eine Animationssequenz ab.
   * Wählt anhand des aktuellen Bildindex das entsprechende Bild aus dem Image-Cache aus.
   *
   * @param {string[]} images - Array mit Bildpfaden für die Animation.
   */
  playAnimation(images) {
    const i = this.currentImage % images.length
    this.img = this.imageCache[images[i]]
    this.currentImage++
  }

  /**
   * Bewegt das Objekt nach rechts entsprechend der aktuellen Geschwindigkeit.
   */
  moveRight() {
    this.x += this.speed
  }

  /**
   * Bewegt das Objekt nach links entsprechend der aktuellen Geschwindigkeit.
   */
  moveLeft() {
    this.x -= this.speed
  }

  /**
   * Lässt das Objekt springen, indem die vertikale Geschwindigkeit (speedY) auf einen festen Wert gesetzt wird.
   */
  jump() {
    this.speedY = 30
  }
}