window.initLevel1 = () =>
  new Level(
    [new Chicken(1), new Chicken(1), new Chicken(1), new SmallChicken(1), new SmallChicken(1), new Endboss(1)],
    [new Cloud()],

    [
      new BackgroundObject("img/background/layers/air.png", -718),
      new BackgroundObject("img/background/layers/3_third_layer/1.png", -718),
      new BackgroundObject("img/background/layers/2_second_layer/1.png", -718),
      new BackgroundObject("img/background/layers/1_first_layer/1.png", -718),

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
    [new Bottle(), new Bottle(), new Bottle(), new Bottle(), new Bottle()],
    [new Coin(), new Coin(), new Coin(), new Coin(), new Coin()],
  )

