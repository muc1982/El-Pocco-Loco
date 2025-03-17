class Level {
  enemies;
  clouds;
  backgroundObjects;
  bottles;
  coins;
  level_end_x = 2400;

  /**
   * Erzeugt ein neues Level.
   * @param {MoveableObject[]} enemies - Gegner.
   * @param {Cloud[]} clouds - Wolken.
   * @param {BackgroundObject[]} backgroundObjects - Hintergrund.
   * @param {Bottle[]} bottles - Flaschen.
   * @param {Coin[]} coins - Münzen.
   */
  constructor(enemies, clouds, backgroundObjects, bottles, coins) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.bottles = bottles;
    this.coins = coins;
  }
}
