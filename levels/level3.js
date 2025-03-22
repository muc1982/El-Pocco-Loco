/**
 * Initializes Level 3.
 * @returns {Level} The level instance.
 */
function initLevel3() {
  return createLevel(3)
}

/**
 * Creates a level with appropriate difficulty.
 * @param {number} levelNumber - The level number.
 * @returns {Level} The configured level.
 */
function createLevel(levelNumber) {
  return new Level(
    createEnemies(levelNumber),
    createClouds(),
    createBackground(),
    createBottles(levelNumber),
    createCoins(levelNumber),
  )
}

/**
 * Creates enemies for the level.
 * @param {number} level - The level number.
 * @returns {Array} Array of enemies.
 */
function createEnemies(level) {
  return [
    new Chicken(level),
    new Chicken(level),
    new Chicken(level),
    new Chicken(level),
    new Chicken(level),
    new SmallChicken(level),
    new SmallChicken(level),
    new SmallChicken(level),
    new SmallChicken(level),
    new Endboss(level),
  ]
}

/**
 * Creates clouds for the level.
 * @returns {Array} Array of clouds.
 */
function createClouds() {
  return [new Cloud()]
}

/**
 * Creates background objects.
 * @returns {Array} Array of background objects.
 */
function createBackground() {
  return [
    new BackgroundObject("img/background/layers/air.png", -718),
    new BackgroundObject("img/background/layers/3_third_layer/1.png", -718),
    new BackgroundObject("img/background/layers/2_second_layer/1.png", -718),
    new BackgroundObject("img/background/layers/1_first_layer/1.png", -720),
    new BackgroundObject("img/background/layers/air.png", 0),
    new BackgroundObject("img/background/layers/3_third_layer/2.png", 0),
    new BackgroundObject("img/background/layers/2_second_layer/2.png", 0),
    new BackgroundObject("img/background/layers/1_first_layer/2.png", 0),
    new BackgroundObject("img/background/layers/air.png", 718),
    new BackgroundObject("img/background/layers/3_third_layer/1.png", 718),
    new BackgroundObject("img/background/layers/2_second_layer/1.png", 718),
    new BackgroundObject("img/background/layers/1_first_layer/1.png", 718),
    new BackgroundObject("img/background/layers/air.png", 718 * 2),
    new BackgroundObject("img/background/layers/3_third_layer/2.png", 718 * 2),
    new BackgroundObject("img/background/layers/2_second_layer/2.png", 718 * 2),
    new BackgroundObject("img/background/layers/1_first_layer/2.png", 718 * 2),
    new BackgroundObject("img/background/layers/air.png", 718 * 3),
    new BackgroundObject("img/background/layers/3_third_layer/1.png", 718 * 3),
    new BackgroundObject("img/background/layers/2_second_layer/1.png", 718 * 3),
    new BackgroundObject("img/background/layers/1_first_layer/1.png", 718 * 3),
    new BackgroundObject("img/background/layers/air.png", 718 * 4),
    new BackgroundObject("img/background/layers/3_third_layer/2.png", 718 * 4),
    new BackgroundObject("img/background/layers/2_second_layer/2.png", 718 * 4),
    new BackgroundObject("img/background/layers/1_first_layer/2.png", 718 * 4),
  ]
}

/**
 * Creates bottles for the level.
 * @param {number} level - The level number.
 * @returns {Array} Array of bottles.
 */
function createBottles(level) {
  const bottleCount = 7
  return Array(bottleCount)
    .fill()
    .map(() => new Bottle())
}

/**
 * Creates coins for the level.
 * @param {number} level - The level number.
 * @returns {Array} Array of coins.
 */
function createCoins(level) {
  const coinCount = 7
  return Array(coinCount)
    .fill()
    .map(() => new Coin())
}

window.initLevel3 = initLevel3

