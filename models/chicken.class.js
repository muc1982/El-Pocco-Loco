class Chicken extends MoveableObject {
  height = 80
  width = 80
  y = 350
  groundY = 350
  energy = 100
  baseSpeed = 0.4
  isDying = false

  offset = {
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
  }

  IMAGES_WALKING = [
    "img/enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/enemies_chicken/chicken_normal/1_walk/3_w.png",
  ]

  IMAGES_DEAD = [
    "img/enemies_chicken/chicken_normal/2_dead/dead.png",
    "img/enemies_chicken/chicken_normal/2_dead/dead.png",
    "img/enemies_chicken/chicken_normal/2_dead/dead.png",
    "img/enemies_chicken/chicken_normal/2_dead/dead.png",
  ]

  /**
   * Erstellt eine neue Chicken-Instanz.
   * @param {number} level - Das aktuelle Spiellevel.
   */
  constructor(level = 1) {
    super()
    this.loadImage("img/enemies_chicken/chicken_normal/1_walk/1_w.png")
    this.loadImages(this.IMAGES_WALKING)
    this.loadImages(this.IMAGES_DEAD)
    // Gegner starten weiter rechts bei höheren Levels
    this.x = 1500 + (level - 1) * 1000 + Math.random() * 1000
    this.speed = this.baseSpeed * (1 + (level - 1) * 1.0)
    this.animate()
  }

  /**
   * Animiert das Huhn (Bewegung und Animation).
   */
  animate() {
    this.animateMovement();
    this.animateImages();
  }
  
  /**
   * Animiert die Bewegung des Huhns.
   */
  animateMovement() {
    setInterval(() => {
      if (!this.isDead()) {
        this.moveLeft()
      }
    }, 1000 / 60)
  }
  
  /**
   * Animiert die Bilder des Huhns.
   */
  animateImages() {
    setInterval(() => {
      if (this.isDead()) {
        // Wenn das Huhn tot ist und noch nicht stirbt
        if (!this.isDying) {
          this.die();
        }
        this.playAnimation(this.IMAGES_DEAD)
      } else {
        this.playAnimation(this.IMAGES_WALKING)
      }
    }, 100)
  }
  
  /**
   * Führt den Sterbeprozess des Huhns aus.
   * Setzt den Dying-Status und entfernt das Huhn nach kurzer Zeit.
   */
  die() {
    this.isDying = true;
    this.speed = 0; // Bewegung stoppen
    
    // Huhn nach kurzer Animation entfernen
    setTimeout(() => {
      // Falls die Welt und das Level existieren
      if (this.world && this.world.level) {
        const index = this.world.level.enemies.indexOf(this);
        if (index !== -1) {
          this.world.level.enemies.splice(index, 1);
        }
      }
    }, 500); // Kürzere Verzögerung für sofortigeren Tod
  }
}

/**
 * Repräsentiert ein kleines Huhn im Spiel.
 * @extends Chicken
 */
class SmallChicken extends Chicken {
  height = 60
  width = 60
  y = 370
  groundY = 370
  baseSpeed = 0.25

  IMAGES_WALKING = [
    "img/enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/enemies_chicken/chicken_small/1_walk/3_w.png",
  ]

  IMAGES_DEAD = [
    "img/enemies_chicken/chicken_small/2_dead/dead.png",
    "img/enemies_chicken/chicken_small/2_dead/dead.png",
    "img/enemies_chicken/chicken_small/2_dead/dead.png",
    "img/enemies_chicken/chicken_small/2_dead/dead.png",
  ]

  /**
   * Erstellt eine neue SmallChicken-Instanz.
   * @param {number} level - Das aktuelle Spiellevel.
   */
  constructor(level = 1) {
    super()
    this.loadImage("img/enemies_chicken/chicken_small/1_walk/1_w.png")
    this.loadImages(this.IMAGES_WALKING)
    this.loadImages(this.IMAGES_DEAD)
    this.x = 1200 + (level - 1) * 500 + Math.random() * 2000
    this.speed = this.baseSpeed * (1 + (level - 1) * 0.8)
    this.animate()
  }
}