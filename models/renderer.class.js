class WorldRenderer {
    constructor(world) {
      this.world = world
    }
  
    /**
     * Draws the current game state.
     */
    draw() {
      const currentTime = performance.now()
      this.world.lastFrameTime = currentTime
      this.world.ctx.clearRect(0, 0, this.world.canvas.width, this.world.canvas.height)
      this.drawGameFrame()
      requestAnimationFrame(() => this.draw())
    }
  
    /**
     * Draws a game frame.
     */
    drawGameFrame() {
      this.drawBackgroundElements()
      this.drawStatusBars()
      this.drawGameElements()
    }
  
    /**
     * Draws background elements.
     */
    drawBackgroundElements() {
      this.world.ctx.translate(this.world.camera_x, 0)
      this.addObjectsToMap(this.world.level.backgroundObjects)
      this.addObjectsToMap(this.world.level.clouds)
      this.addObjectsToMap(this.world.level.bottles)
      this.addObjectsToMap(this.world.level.coins)
      this.world.ctx.translate(-this.world.camera_x, 0)
    }
  
    /**
     * Draws status bars.
     */
    drawStatusBars() {
      this.addToMap(this.world.statusBar)
      this.addToMap(this.world.bottleBar)
      this.addToMap(this.world.coinBar)
  
      if (this.world.endbossBarVisible) {
        this.addToMap(this.world.endbossBar)
      }
    }
  
    /**
     * Draws game elements.
     */
    drawGameElements() {
      this.world.ctx.translate(this.world.camera_x, 0)
      this.addToMap(this.world.character)
      this.addObjectsToMap(this.world.level.enemies)
      this.addObjectsToMap(this.world.throwableObjects)
      this.world.ctx.translate(-this.world.camera_x, 0)
    }
  
    /**
     * Adds multiple objects to the map.
     * @param {DrawableObject[]} objects - Array of objects.
     */
    addObjectsToMap(objects) {
      objects.forEach((o) => this.addToMap(o))
    }
  
    /**
     * Adds a single object to the map.
     * @param {DrawableObject} mo - The object.
     */
    addToMap(mo) {
      if (mo.otherDirection) this.flipImage(mo)
      mo.draw(this.world.ctx)
      if (mo.otherDirection) this.flipImageBack(mo)
    }
  
    /**
     * Flips an image horizontally.
     * @param {DrawableObject} mo - The object.
     */
    flipImage(mo) {
      this.world.ctx.save()
      this.world.ctx.translate(mo.width, 0)
      this.world.ctx.scale(-1, 1)
      mo.x = mo.x * -1
    }
  
    /**
     * Restores the image orientation.
     * @param {DrawableObject} mo - The object.
     */
    flipImageBack(mo) {
      mo.x = mo.x * -1
      this.world.ctx.restore()
    }
  }
  
  