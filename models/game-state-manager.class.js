class GameStateManager {
    constructor(world) {
        this.world = world;
        this.victoryShown = false;
        this.gameEnded = false;
        this.debugMode = true; // Debug-Modus aktivieren
    }

    /**
     * Prüft den Spielstatus.
     * Überprüft Sieges- und Niederlagebedingungen.
     */
    checkGameState() {
        if (this.gameEnded) return;
        
        if (this.characterIsDead()) {
            this.gameEnded = true;
            window.showGameOver();
            return;
        }
        
        this.checkWinCondition();
        this.checkEndbossContact();
    }

    /**
     * Prüft, ob der Charakter gestorben ist.
     * @returns {boolean} True, wenn der Charakter keine Energie mehr hat.
     */
    characterIsDead() {
        return this.world.character.energy <= 0;
    }

    /**
     * Prüft, ob der Charakter in die Nähe des Endbosses kommt.
     * Aktiviert den Endboss und zeigt seine Statusleiste an.
     */
    checkEndbossContact() {
        this.world.level.enemies.forEach((enemy) => {
            if (enemy instanceof Endboss) {
                if (this.isCharacterNearEndboss(enemy)) {
                    this.activateEndboss(enemy);
                }
            }
        });
    }
                
    /**
     * Überprüft, ob der Charakter in der Nähe des Endbosses ist.
     * @param {Endboss} enemy - Der Endboss.
     * @returns {boolean} True, wenn der Charakter in der Nähe ist.
     */
    isCharacterNearEndboss(enemy) {
        // Distanz verringern, damit der Endboss früher aktiviert wird
        return this.world.character.x > enemy.x - 700;
    }

    /**
     * Prüft, ob das Spiel gewonnen wurde.
     * Zeigt den Siegbildschirm an, wenn der Endboss besiegt wurde.
     */
    checkWinCondition() {
        if (this.victoryShown) return;

        const endboss = this.world.level.enemies.find((enemy) => enemy instanceof Endboss);
        if (this.isEndbossDefeated(endboss)) {
            this.handleVictory();
        }
    }

    /**
     * Überprüft, ob der Endboss besiegt wurde.
     * @param {Endboss} endboss - Der Endboss.
     * @returns {boolean} True, wenn der Endboss besiegt und aus dem Bildschirm gefallen ist.
     */
    isEndbossDefeated(endboss) {
        return endboss && 
               endboss.isDead() && 
               endboss.fallStarted && 
               endboss.y > this.world.canvas.height;
    }

    /**
     * Verarbeitet den Sieg.
     * Zeigt den Siegbildschirm an und beendet das Spiel.
     */
    handleVictory() {
        this.victoryShown = true;
        this.gameEnded = true; // Wichtig: Das Spiel als beendet markieren
        this.world.collectedBottles = 0;
        this.world.collectedCoins = 0;
        window.gameRunning = false; // Stoppt das Spiel
        window.showVictoryScreen(this.world.currentLevel);
    }
}