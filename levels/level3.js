function initLevel3() {
  return new Level(
    [
      new Chicken(3),
      new Chicken(3),
      new Chicken(3),
      new Chicken(3),
      new Chicken(3),
      new SmallChicken(3),
      new SmallChicken(3),
      new SmallChicken(3),
      new SmallChicken(3),
      new Endboss(3),
    ],

    [new Cloud()],

    [
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
    ],
    [new Bottle(), new Bottle(), new Bottle(), new Bottle(), new Bottle(), new Bottle(), new Bottle()],
    [new Coin(), new Coin(), new Coin(), new Coin(), new Coin(), new Coin(), new Coin()],
  )
}
window.initLevel3 = initLevel3

