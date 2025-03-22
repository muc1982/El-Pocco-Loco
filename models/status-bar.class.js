class StatusBar extends DrawableObject {
  
  IMAGES = []
  HEALTH_IMAGES = [
    "img/statusbars/statusbar/2_statusbar_health/green/0.png",
    "img/statusbars/statusbar/2_statusbar_health/green/20.png",
    "img/statusbars/statusbar/2_statusbar_health/green/40.png",
    "img/statusbars/statusbar/2_statusbar_health/green/60.png",
    "img/statusbars/statusbar/2_statusbar_health/green/80.png",
    "img/statusbars/statusbar/2_statusbar_health/green/100.png",
  ]
  BOTTLE_IMAGES = [
    "img/statusbars/statusbar/3_statusbar_bottle/green/0.png",
    "img/statusbars/statusbar/3_statusbar_bottle/green/20.png",
    "img/statusbars/statusbar/3_statusbar_bottle/green/40.png",
    "img/statusbars/statusbar/3_statusbar_bottle/green/60.png",
    "img/statusbars/statusbar/3_statusbar_bottle/green/80.png",
    "img/statusbars/statusbar/3_statusbar_bottle/green/100.png",
  ]
  COINS_IMAGES = [
    "img/statusbars/statusbar/1_statusbar_coin/green/0.png",
    "img/statusbars/statusbar/1_statusbar_coin/green/20.png",
    "img/statusbars/statusbar/1_statusbar_coin/green/40.png",
    "img/statusbars/statusbar/1_statusbar_coin/green/60.png",
    "img/statusbars/statusbar/1_statusbar_coin/green/80.png",
    "img/statusbars/statusbar/1_statusbar_coin/green/100.png",
  ]
  HEALTH_ENDBOSS_IMAGES = [
    "img/statusbars/statusbar_endboss/blue/blue0.png",
    "img/statusbars/statusbar_endboss/blue/blue20.png",
    "img/statusbars/statusbar_endboss/blue/blue40.png",
    "img/statusbars/statusbar_endboss/blue/blue60.png",
    "img/statusbars/statusbar_endboss/blue/blue80.png",
    "img/statusbars/statusbar_endboss/blue/blue100.png",
  ]
  percentage = 100
  zeroTriggered = false
  gameStarted = false // Neuer Flag: Prüft, ob das Spiel gestartet wurde

  /**
   * Erstellt eine neue StatusBar-Instanz.
   */
  constructor() {
    super()
    this.IMAGES = this.HEALTH_IMAGES
    this.loadImages(this.IMAGES)
    this.x = 20
    this.y = 0
    this.width = 200
    this.height = 60
    this.setPercentage(100, false) // false = keine Triggerung beim Start
    
    // Nach kurzer Verzögerung das Spiel als "gestartet" markieren
    setTimeout(() => {
      this.gameStarted = true;
    }, 1000);
  }

  /**
   * Setzt den Prozentsatz der Statusleiste.
   * @param {number} percentage - Der neue Prozentsatz (0-100).
   * @param {boolean} canTrigger - Ob beim Wert 0 ein Trigger ausgelöst werden soll (Standard: true).
   */
  setPercentage(percentage, canTrigger = true) {
    // Stellen Sie sicher, dass der Prozentsatz im gültigen Bereich liegt
    this.percentage = Math.max(0, Math.min(100, percentage))
    
    // Wenn die Prozentanzeige 0 ist und das Spiel gestartet wurde, löse ein Ereignis aus
    if (canTrigger && this.gameStarted && this.percentage === 0 && 
        this instanceof StatusBar && !this.zeroTriggered) {
      this.zeroTriggered = true;
      this.triggerZeroEffect();
    }
    
    const path = this.IMAGES[this.resolveImageIndex()]
    this.img = this.imageCache[path]
  }

  /**
   * Löst einen Effekt aus, wenn die Statusleiste auf 0 fällt.
   * Bei Charakteren: Game Over
   * Bei Gegnern: Sofortiger Tod
   */
  triggerZeroEffect() {
    if (window.showGameOver && this instanceof StatusBar && this.gameStarted) {
      console.log("Health reached zero! Game Over!");
      window.showGameOver();
    }
  }

  /**
   * Ermittelt den Index des zu verwendenden Bildes basierend auf dem Prozentsatz.
   * @returns {number} Der Index des Bildes im IMAGES-Array.
   */
  resolveImageIndex() {
    if (this.percentage >= 100) {
      return 5
    } else if (this.percentage > 80) {
      return 4
    } else if (this.percentage > 60) {
      return 3
    } else if (this.percentage > 40) {
      return 2
    } else if (this.percentage > 20) {
      return 1
    } else {
      return 0
    }
  }
}

/**
 * Statusleiste für Flaschen.
 * @extends StatusBar
 */
class BottleBar extends StatusBar {
  /**
   * Erstellt eine neue BottleBar-Instanz.
   */
  constructor() {
    super()
    this.IMAGES = this.BOTTLE_IMAGES
    this.loadImages(this.IMAGES)
    this.y = 50
    this.setPercentage(0, false) // false = keine Triggerung beim Start
  }
}

/**
 * Statusleiste für Münzen.
 * @extends StatusBar
 */
class CoinBar extends StatusBar {
  /**
   * Erstellt eine neue CoinBar-Instanz.
   */
  constructor() {
    super()
    this.IMAGES = this.COINS_IMAGES
    this.loadImages(this.IMAGES)
    this.y = 100
    this.setPercentage(0, false) // false = keine Triggerung beim Start
  }
}

/**
 * Statusleiste für den Endboss.
 * @extends StatusBar
 */
class EndbossBar extends StatusBar {
  /**
   * Erstellt eine neue EndbossBar-Instanz.
   */
  constructor() {
    super()
    this.IMAGES = this.HEALTH_ENDBOSS_IMAGES
    this.loadImages(this.IMAGES)
    this.x = 500
    this.y = 0
    this.width = 200
    this.height = 60
    this.setPercentage(100, false) // false = keine Triggerung beim Start
  }
  
  /**
   * Überschreibt die triggerZeroEffect-Methode, um bei Endboss-Tod keinen Game Over zu triggern.
   */
  triggerZeroEffect() {
    // Endboss-spezifischer Effekt bei 0% Leben
    if (this.percentage === 0) {
      console.log("Endboss defeated!");
    }
  }
}