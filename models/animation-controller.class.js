class CharacterAnimationController {
    constructor(character) {
      this.character = character
      this.lastDirection = false
      this.lastAnimationType = "idle"
    }
  
    /**
     * Initialisiert die Animationen.
     * Startet die Animation-Loops.
     */
    initialize() {
      this.animateImages()
    }
  
    /**
     * Startet die Bild-Animation.
     * Setzt einen Interval, der regelmäßig das Charakterbild aktualisiert.
     */
    animateImages() {
      setInterval(() => this.updateCharacterImage(), 100)
    }
  
    /**
     * Aktualisiert das Bild des Charakters basierend auf seinem Zustand.
     * Wählt die passende Animation basierend auf dem aktuellen Zustand.
     */
    updateCharacterImage() {
      if (!window.gameRunning) {
        // Wenn das Spiel nicht läuft, führe keine Animation durch
        return
      }
  
      // Bestimme die zu verwendende Animation
      const anim = this.determineAnimation()
      this.playAnimation(anim)
    }
  
    /**
     * Bestimmt die aktuelle Animation basierend auf dem Zustand.
     * Prüft verschiedene Zustände in einer Prioritätsreihenfolge.
     * @returns {Array} Das Array mit den Bildern für die aktuelle Animation.
     */
    determineAnimation() {
      if (this.character.isDead()) {
        this.resetAnimationIfNeeded("dead")
        return this.character.IMAGES_DEAD
      }
  
      if (this.character.isHurt()) {
        this.resetAnimationIfNeeded("hurt")
        return this.character.IMAGES_HURT
      }
  
      if (this.character.isAboveGround()) {
        this.resetAnimationIfNeeded("jumping")
        return this.character.IMAGES_JUMPING
      }
  
      if (
        this.character.world &&
        this.character.world.keyboard &&
        (this.character.world.keyboard.RIGHT || this.character.world.keyboard.LEFT)
      ) {
        window.stopSnoreSound()
  
        // Beim Richtungswechsel Animation zurücksetzen
        if (this.lastDirection !== this.character.otherDirection) {
          this.character.currentImage = 0
          this.lastDirection = this.character.otherDirection
        }
  
        return this.character.IMAGES_WALKING
      }
  
      if (this.character.isIdle()) {
        window.playSnoreSound()
        this.resetAnimationIfNeeded("sleeping")
        return this.character.IMAGES_SLEEPING
      }
  
      window.stopSnoreSound()
      this.resetAnimationIfNeeded("idle")
      return this.character.IMAGES_IDLE
    }
  
    /**
     * Setzt die Animation zurück, wenn der Typ sich geändert hat.
     * Stellt sicher, dass Animationen von Anfang an abgespielt werden.
     * @param {string} type - Der neue Animationstyp.
     */
    resetAnimationIfNeeded(type) {
      if (this.lastAnimationType !== type) {
        this.character.currentImage = 0
        this.lastAnimationType = type
      }
    }
  
    /**
     * Spielt die Animation ab.
     * Delegiert an die playAnimation-Methode des Charakters.
     * @param {Array} anim - Das Array mit den Bildern für die Animation.
     */
    playAnimation(anim) {
      this.character.playAnimation(anim)
    }
  }
  
  