class GameStateManager {
    /**
     * Erstellt eine neue Instanz des GameStateManager.
     * @param {World} world - Die Spielwelt.
     */
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
                    
                    // Debugging-Informationen
                    if (this.debugMode && !enemy.isAlerted) {
                        console.log("Endboss wird aktiviert! Charakter ist nahe genug.");
                    }
                }
                
                // Debugging-Informationen für den Endboss-Status
                if (this.debugMode && enemy.isAlerted && this.world._debugCounter % 180 === 0) {
                    console.log("Endboss Status-Check:");
                    console.log("- isAlerted:", enemy.isAlerted);
                    console.log("- Charakter Position:", this.world.character.x);
                    console.log("- Endboss Position:", enemy.x);
                    console.log("- Distanz:", enemy.x - this.world.character.x);
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
     * Aktiviert den Endboss und zeigt seine Statusleiste an.
     * @param {Endboss} enemy - Der zu aktivierende Endboss.
     */
    activateEndboss(enemy) {
        this.world.endbossBarVisible = true;
        enemy.isAlerted = true;
        
        // Sofortige Aktivierung des Angriffsmodus für den ersten Feuerball
        if (this.debugMode && !enemy._attackedOnce) {
            console.log("Erste Attacke des Endbosses wird vorbereitet!");
            enemy._attackMode = true;
            enemy._attackedOnce = true;
            
            // Feuerball direkt abfeuern, wenn wir in der Debug-Phase sind
            setTimeout(() => {
                if (enemy.checkFireballAttack) {
                    enemy.checkFireballAttack();
                }
            }, 1000);
        }
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