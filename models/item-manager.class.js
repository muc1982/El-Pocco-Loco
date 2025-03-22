class ItemManager {
    constructor(world) {
      this.world = world;
      this.bottleThrowCooldown = false;
      this.bottleCooldownTime = 1500; 
      this.lastBottleThrow = 0;
    }
  
    /**
     * Checks if a bottle should be thrown.
     */
    checkThrowObjects() {
      this.checkBottleThrowAction();
    }
  
    /**
     * Checks and processes bottle throw actions.
     */
    checkBottleThrowAction() {
      const currentTime = new Date().getTime();
      if (this.canThrowBottle(currentTime)) {
        this.throwBottle();
        this.lastBottleThrow = currentTime;
      }
    }
  
    /**
     * Determines if a bottle can be thrown.
     * @param {number} currentTime - Current time in ms.
     * @returns {boolean} True if throw is possible.
     */
    canThrowBottle(currentTime) {
      const cooldownElapsed = currentTime - this.lastBottleThrow > this.bottleCooldownTime;
      return this.world.keyboard.D &&
        this.world.collectedBottles > 0 &&
        !this.bottleThrowCooldown &&
        cooldownElapsed;
    }
  
    /**
     * Throws a bottle.
     */
    throwBottle() {
      this.createAndAddBottle();
      this.updateBottleCount();
      this.startBottleCooldown();
    }
  
    /**
     * Creates and adds a new bottle to the world.
     */
    createAndAddBottle() {
      let bottleX = this.world.character.x + 30;
      const bottleY = this.world.character.y + 50;
      if (this.world.character.otherDirection) {
        bottleX = this.world.character.x - 30;
      }
      const bottle = new ThrowableObject(bottleX, bottleY, this.world.character.otherDirection);
      bottle.world = this.world;
      this.world.throwableObjects.push(bottle);
    }
  
    /**
     * Updates the bottle count and UI.
     */
    updateBottleCount() {
      this.world.collectedBottles--;
      this.world.bottleBar.setPercentage(this.world.collectedBottles * 20);
      window.playBottleSound();
    }
  
    /**
     * Starts the bottle throw cooldown.
     */
    startBottleCooldown() {
      this.bottleThrowCooldown = true;
      setTimeout(() => {
        this.bottleThrowCooldown = false;
      }, 500);
    }
  }
  