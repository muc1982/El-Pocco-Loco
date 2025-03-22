class Endboss extends MoveableObject {
  width = 650;
  height = 325;
  y = 120;
  groundY = 30;
  energy = 100;
  isAlerted = false;
  world;
  baseSpeed = 0.25;
  fallStarted = false;
  deathProcessed = false;
  
  /**
   * Offset-Werte für Kollisionserkennung oder Rahmen.
   * @type {{top: number, left: number, right: number, bottom: number}}
   */
  offset = {
    top: 40,
    left: 60,
    right: 60,
    bottom: 30,
  };
  
  /**
   * Array mit Bildpfaden für die Geh-Animation.
   * @type {string[]}
   */
  IMAGES_WALKING = [
    "img/enemie_boss_chicken/walk/G1.png",
    "img/enemie_boss_chicken/walk/G2.png",
    "img/enemie_boss_chicken/walk/G3.png",
    "img/enemie_boss_chicken/walk/G4.png",
  ];
  
  /**
   * Array mit Bildpfaden für die Alarm-Animation.
   * @type {string[]}
   */
  IMAGES_ALERT = [
    "img/enemie_boss_chicken/alert/G5.png",
    "img/enemie_boss_chicken/alert/G6.png",
    "img/enemie_boss_chicken/alert/G7.png",
    "img/enemie_boss_chicken/alert/G8.png",
    "img/enemie_boss_chicken/alert/G9.png",
    "img/enemie_boss_chicken/alert/G10.png",
    "img/enemie_boss_chicken/alert/G11.png",
    "img/enemie_boss_chicken/alert/G12.png",
  ];
  
  /**
   * Array mit Bildpfaden für die Angriffs-Animation.
   * @type {string[]}
   */
  IMAGES_ATTACK = [
    "img/enemie_boss_chicken/attack/G13.png",
    "img/enemie_boss_chicken/attack/G14.png",
    "img/enemie_boss_chicken/attack/G15.png",
    "img/enemie_boss_chicken/attack/G16.png",
    "img/enemie_boss_chicken/attack/G17.png",
    "img/enemie_boss_chicken/attack/G18.png",
    "img/enemie_boss_chicken/attack/G19.png",
    "img/enemie_boss_chicken/attack/G20.png",
  ];
  
  /**
   * Array mit Bildpfaden für die "Verletzt"-Animation.
   * @type {string[]}
   */
  IMAGES_HURT = [
    "img/enemie_boss_chicken/hurt/G21.png",
    "img/enemie_boss_chicken/hurt/G22.png",
    "img/enemie_boss_chicken/hurt/G23.png",
  ];
  
  /**
   * Array mit Bildpfaden für die "Tot"-Animation.
   * @type {string[]}
   */
  IMAGES_DEAD = [
    "img/enemie_boss_chicken/dead/G24.png",
    "img/enemie_boss_chicken/dead/G25.png",
    "img/enemie_boss_chicken/dead/G26.png",
  ];
  
  /**
   * Konstruktor für den Endboss.
   *
   * @param {number} [level=1] - Level des Endboss, welches Geschwindigkeit und Stärke beeinflusst.
   */
  constructor(level = 1) {
    super();
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 2500;
    // Erhöhe die Geschwindigkeit und Stärke des Endbosses
    this.speed = this.baseSpeed * (1 + (level - 1) * 1.5); // Erhöhter Multiplikator
    this.energy = 100; // Standard-Energie
    this.animate();
  }
  
  /**
   * Animiert die Bewegung des Endbosses.
   *
   * Aktualisiert regelmäßig die Position und den Angriffsmodus.
   * Bei Alarmierung bewegt sich der Endboss nach links und initiiert Angriffe.
   * Ist der Endboss tot, wird der Fall simuliert.
   */
  animateMovement() {
    setInterval(() => {
      if (!this.isDead() && this.isAlerted) {
        this._anim_i++;
        if (this._anim_i > 10) this.moveLeft();
        if (this._anim_i % 50 === 0) {
          this._attackMode = true;
          setTimeout(() => (this._attackMode = false), 500);
        }
      } else if (this.isDead()) {
        if (!this.fallStarted) {
          this.fallStarted = true;
          this.speedY = 3;
          this.acceleration = 0.2;
        }
        this.y += this.speedY;
        this.speedY += this.acceleration;
      }
    }, 1000 / 60);
  }
  
  /**
   * Animiert die visuelle Darstellung des Endbosses.
   *
   * Wählt abhängig vom Zustand (tot, verletzt, angreifend, alarmiert oder gehend)
   * die entsprechende Bildsequenz zur Animation aus.
   */
  animateAnimation() {
    setInterval(() => {
      this.playAnimation(
        this.isDead()
          ? this.IMAGES_DEAD
          : this.isHurt()
            ? this.IMAGES_HURT
            : this._attackMode
              ? this.IMAGES_ATTACK
              : this.isAlerted && this._anim_i <= 10
                ? this.IMAGES_ALERT
                : this.IMAGES_WALKING,
      );
    }, 100);
  }
  
  /**
   * Startet alle Animationen des Endbosses.
   *
   * Initialisiert interne Zähler und startet die Bewegungs- und Animations-Intervalle.
   */
  animate() {
    this._anim_i = 0;
    this._attackMode = false;
    this.animateMovement();
    this.animateAnimation();
  }
}

// Korrekte Export der Klasse: Stellt sicher, dass die Klasse global verfügbar ist.
window.Endboss = Endboss;
