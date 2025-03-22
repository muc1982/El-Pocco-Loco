class Level {
  enemies;
  clouds;
  backgroundObjects;
  bottles;
  coins;
  level_end_x = 2400;

  /**
   * Creates a new level.
   * @param {MoveableObject[]} enemies - Enemies.
   * @param {Cloud[]} clouds - Clouds.
   * @param {BackgroundObject[]} backgroundObjects - Background objects.
   * @param {Bottle[]} bottles - Bottles.
   * @param {Coin[]} coins - Coins.
   */
  constructor(enemies, clouds, backgroundObjects, bottles, coins) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.bottles = bottles;
    this.coins = coins;
  }
}
