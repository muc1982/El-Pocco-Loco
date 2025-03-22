class WorldRenderer {
    constructor(world) {
        this.world = world
    }

    /**
     * Zeichnet den aktuellen Spielzustand.
     * Wird in jedem Frame aufgerufen, um die Spielwelt zu aktualisieren.
     */
    draw() {
        const currentTime = performance.now()
        this.world.lastFrameTime = currentTime
        this.world.ctx.clearRect(0, 0, this.world.canvas.width, this.world.canvas.height)
        this.drawGameFrame()
        requestAnimationFrame(() => this.draw())
    }

    /**
     * Zeichnet den Spielframe.
     * Koordiniert das Zeichnen aller Spielelemente in der richtigen Reihenfolge.
     */
    drawGameFrame() {
        this.drawBackgroundElements()
        this.drawStatusBars()
        this.drawGameElements()
    }

    /**
     * Zeichnet die Hintergrundelemente.
     * Zeichnet Hintergrund, Wolken, Flaschen und Münzen.
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
     * Zeichnet die Statusleisten.
     * Zeichnet Gesundheit, Flaschen, Münzen und ggf. Endboss-Statusleiste.
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
     * Zeichnet die Spielelemente.
     * Zeichnet Charakter, Gegner und werfbare Objekte.
     */
    drawGameElements() {
        this.world.ctx.translate(this.world.camera_x, 0)
        this.addToMap(this.world.character)
        this.addObjectsToMap(this.world.level.enemies)
        this.addObjectsToMap(this.world.throwableObjects)
        this.world.ctx.translate(-this.world.camera_x, 0)
    }

    /**
     * Fügt mehrere Objekte zur Karte hinzu.
     * Zeichnet eine Array von Objekten auf das Canvas.
     * @param {DrawableObject[]} objects - Die hinzuzufügenden Objekte.
     */
    addObjectsToMap(objects) {
        objects.forEach((o) => this.addToMap(o))
    }

    /**
     * Fügt ein Objekt zur Karte hinzu.
     * Zeichnet ein einzelnes Objekt auf das Canvas, berücksichtigt Richtung.
     * @param {DrawableObject} mo - Das hinzuzufügende Objekt.
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo)
        }
        mo.draw(this.world.ctx)
        if (mo.otherDirection) {
            this.flipImageBack(mo)
        }
    }

    /**
     * Spiegelt ein Bild horizontal.
     * Wird verwendet, um Objekte in die andere Richtung zu drehen.
     * @param {DrawableObject} mo - Das zu spiegelnde Objekt.
     */
    flipImage(mo) {
        this.world.ctx.save()
        this.world.ctx.translate(mo.width, 0)
        this.world.ctx.scale(-1, 1)
        mo.x = mo.x * -1
    }

    /**
     * Stellt die ursprüngliche Ausrichtung eines Bildes wieder her.
     * Wird nach dem Zeichnen eines gespiegelten Objekts aufgerufen.
     * @param {DrawableObject} mo - Das zurückzusetzende Objekt.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1
        this.world.ctx.restore()
    }
}

