class StatusBar extends DrawableObject {
  IMAGES = [];

  HEALTH_IMAGES = [
    "img/statusbars/statusbar/2_statusbar_health/green/0.png",
    "img/statusbars/statusbar/2_statusbar_health/green/20.png",
    "img/statusbars/statusbar/2_statusbar_health/green/40.png",
    "img/statusbars/statusbar/2_statusbar_health/green/60.png",
    "img/statusbars/statusbar/2_statusbar_health/green/80.png",
    "img/statusbars/statusbar/2_statusbar_health/green/100.png",
  ];
  BOTTLE_IMAGES = [
    "img/statusbars/statusbar/3_statusbar_bottle/green/0.png",
    "img/statusbars/statusbar/3_statusbar_bottle/green/20.png",
    "img/statusbars/statusbar/3_statusbar_bottle/green/40.png",
    "img/statusbars/statusbar/3_statusbar_bottle/green/60.png",
    "img/statusbars/statusbar/3_statusbar_bottle/green/80.png",
    "img/statusbars/statusbar/3_statusbar_bottle/green/100.png",
  ];
  COINS_IMAGES = [
    "img/statusbars/statusbar/1_statusbar_coin/green/0.png",
    "img/statusbars/statusbar/1_statusbar_coin/green/20.png",
    "img/statusbars/statusbar/1_statusbar_coin/green/40.png",
    "img/statusbars/statusbar/1_statusbar_coin/green/60.png",
    "img/statusbars/statusbar/1_statusbar_coin/green/80.png",
    "img/statusbars/statusbar/1_statusbar_coin/green/100.png",
  ];
  HEALTH_ENDBOSS_IMAGES = [
    "img/statusbars/statusbar_endboss/blue/blue0.png",
    "img/statusbars/statusbar_endboss/blue/blue20.png",
    "img/statusbars/statusbar_endboss/blue/blue40.png",
    "img/statusbars/statusbar_endboss/blue/blue60.png",
    "img/statusbars/statusbar_endboss/blue/blue80.png",
    "img/statusbars/statusbar_endboss/blue/blue100.png",
  ];
  percentage = 100;
  zeroTriggered = false;
  gameStarted = false;

  /**
   * Constructs a new StatusBar.
   */
  constructor() {
    super();
    this.IMAGES = this.HEALTH_IMAGES;
    this.loadImages(this.IMAGES);
    this.x = 20;
    this.y = 0;
    this.width = 200;
    this.height = 60;
    this.setPercentage(100, false);
    setTimeout(() => {
      this.gameStarted = true;
    }, 1000);
  }

  /**
   * Sets the percentage of the status bar.
   * @param {number} percentage - New percentage (0-100).
   * @param {boolean} canTrigger - Whether to trigger an event at 0.
   */
  setPercentage(percentage, canTrigger = true) {
    this.percentage = Math.max(0, Math.min(100, percentage));
    if (canTrigger && this.gameStarted && this.percentage === 0 && !this.zeroTriggered) {
      this.zeroTriggered = true;
      this.triggerZeroEffect();
    }
    const path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Triggers an effect when the bar reaches 0.
   */
  triggerZeroEffect() {
    if (window.showGameOver && this.gameStarted) {
      window.showGameOver();
    }
  }

  /**
   * Resolves the image index based on the percentage.
   * @returns {number} The image index.
   */
  resolveImageIndex() {
    if (this.percentage >= 100) return 5;
    else if (this.percentage > 80) return 4;
    else if (this.percentage > 60) return 3;
    else if (this.percentage > 40) return 2;
    else if (this.percentage > 20) return 1;
    else return 0;
  }
}

class BottleBar extends StatusBar {
  constructor() {
    super();
    this.IMAGES = this.BOTTLE_IMAGES;
    this.loadImages(this.IMAGES);
    this.y = 50;
    this.setPercentage(0, false);
  }
}

class CoinBar extends StatusBar {
  constructor() {
    super();
    this.IMAGES = this.COINS_IMAGES;
    this.loadImages(this.IMAGES);
    this.y = 100;
    this.setPercentage(0, false);
  }
}

class EndbossBar extends StatusBar {
  constructor() {
    super();
    this.IMAGES = this.HEALTH_ENDBOSS_IMAGES;
    this.loadImages(this.IMAGES);
    this.x = 500;
    this.y = 0;
    this.width = 200;
    this.height = 60;
    this.setPercentage(100, false);
  }
  
  /**
   * Overrides the zero effect (no game over on Endboss 0%).
   */
  triggerZeroEffect() {
  }
}
