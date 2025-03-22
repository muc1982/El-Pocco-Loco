class ItemManager {
    constructor(world) {
        this.world = world;
        this.bottleThrowCooldown = false;
        this.bottleCooldownTime = 1500; // Erhöhte Cooldown-Zeit (1.5 Sekunden)
        this.lastBottleThrow = 0;
    }

    /**
     * Prüft, ob eine Flasche geworfen werden soll.
     * Wird regelmäßig aufgerufen, um Flaschenaktionen zu überprüfen.
     */
    checkThrowObjects() {
        this.checkBottleThrowAction();
    }

    /**
     * Prüft und verarbeitet Flaschen-Wurf-Aktionen.
     */
    checkBottleThrowAction() {
        const currentTime = new Date().getTime();
        if (this.canThrowBottle(currentTime)) {
            this.throwBottle();
            this.lastBottleThrow = currentTime;
        }
    }

    /**
     * Prüft, ob eine Flasche geworfen werden kann.
     * Überprüft Tastendruck, Flaschenvorrat und Cooldown.
     * @param {number} currentTime - Aktuelle Zeit in Millisekunden.
     * @returns {boolean} True, wenn eine Flasche geworfen werden kann.
     */
    canThrowBottle(currentTime) {
        const cooldownElapsed = currentTime - this.lastBottleThrow > this.bottleCooldownTime;
        return this.world.keyboard.D &&
            this.world.collectedBottles > 0 &&
            !this.bottleThrowCooldown &&
            cooldownElapsed;
    }

    /**
     * Wirft eine Flasche.
     * Erstellt ein neues ThrowableObject und fügt es zur Welt hinzu.
     */
    throwBottle() {
        this.createAndAddBottle();
        this.updateBottleCount();
        this.startBottleCooldown();
    }

    /**
     * Erstellt und fügt eine neue Flasche zur Welt hinzu.
     */
    createAndAddBottle() {
        let bottleX = this.world.character.x + 30;
        const bottleY = this.world.character.y + 50;

        if (this.world.character.otherDirection) {
            bottleX = this.world.character.x - 30;
        }

        const bottle = new ThrowableObject(bottleX, bottleY, this.world.character.otherDirection);
        bottle.world = this.world; // Wichtig für die Entfernung der Splash-Animation
        this.world.throwableObjects.push(bottle);
    }

    /**
     * Aktualisiert den Flaschenvorrat und die UI nach dem Werfen.
     */
    updateBottleCount() {
        this.world.collectedBottles--;
        this.world.bottleBar.setPercentage(this.world.collectedBottles * 20);
        window.playBottleSound();
    }

    /**
     * Startet die Cooldown-Periode nach dem Werfen einer Flasche.
     */
    startBottleCooldown() {
        this.bottleThrowCooldown = true;
        setTimeout(() => {
            this.bottleThrowCooldown = false;
        }, 500); // Kurzer Input-Block
    }
}