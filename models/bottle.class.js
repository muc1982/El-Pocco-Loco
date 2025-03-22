class Bottle extends DrawableObject {
  width = 80
  height = 80
  offset = {
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
  }

  // Mehr Flaschenbilder für mehr Variation
  IMAGES = [
    "img/salsa_bottle/1_salsa_bottle_on_ground.png", 
    "img/salsa_bottle/2_salsa_bottle_on_ground.png"
  ]

  /**
   * Erstellt eine neue Bottle-Instanz mit zufälliger Position.
   * @param {number} levelWidth - Die Breite des Levels für bessere Verteilung.
   * @param {number} posY - Optional: Spezifische Y-Position (Standard: 350).
   */
  constructor(levelWidth = 2500, posY = 350) {
    super();

    // Wähle zufällig eines der Flaschenbilder aus
    const randomIndex = Math.floor(Math.random() * this.IMAGES.length);
    this.loadImage(this.IMAGES[randomIndex]);

    // Verbesserte Positionierung mit besserer Verteilung
    this.positionBottle(levelWidth, posY);
  }

  /**
   * Positioniert die Flasche im Level.
   * @param {number} levelWidth - Die Breite des Levels.
   * @param {number} posY - Die Y-Position.
   */
  positionBottle(levelWidth, posY) {
    // Bessere horizontale Verteilung
    // Level in Segmente unterteilen für gleichmäßigere Verteilung
    const segmentWidth = levelWidth / 10;
    const segment = Math.floor(Math.random() * 10);
    
    // Position innerhalb des Segments mit etwas Zufälligkeit
    this.x = segment * segmentWidth + Math.random() * segmentWidth;
    
    // Y-Position mit leichter Variation (einige Flaschen leicht höher/tiefer)
    this.y = posY + (Math.random() > 0.8 ? -20 : 0);
  }
  
  /**
   * Erzeugt mehrere Flaschen für ein Level.
   * @param {number} count - Anzahl der zu erzeugenden Flaschen.
   * @param {number} levelWidth - Breite des Levels.
   * @returns {Bottle[]} Ein Array mit den erzeugten Flaschen.
   */
  static createMultiple(count, levelWidth = 2500) {
    const bottles = [];
    for (let i = 0; i < count; i++) {
      bottles.push(new Bottle(levelWidth));
    }
    return bottles;
  }
}