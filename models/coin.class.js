class Coin extends DrawableObject {
  width = 100;
  height = 100;
  offset = {
    top: 30,
    left: 30,
    right: 30,
    bottom: 30,
  };

  IMAGES = ["img/coin/coin_1.png", "img/coin/coin_2.png"];

  /**
   * Creates a new Coin instance.
   */
  constructor() {
    super();
    const randomIndex = Math.floor(Math.random() * this.IMAGES.length);
    this.loadImage(this.IMAGES[randomIndex]);
    this.x = 200 + Math.random() * 2000;
    this.y = 150 + Math.random() * 150;
  }
}
