class CharacterMovementController {
    constructor(character) {
      this.character = character
    }
  
    /**
     * Initialisiert die Bewegungssteuerung.
     * Startet den Bewegungs-Loop.
     */
    initialize() {
      this.animateMovement()
    }
  
    /**
     * Startet die Bewegungsanimation.
     * Setzt einen Interval, der regelmäßig die Bewegung aktualisiert.
     */
    animateMovement() {
      setInterval(() => this.handleMovement(), 1000 / 60)
    }
  
    /**
     * Verarbeitet die Bewegung des Charakters.
     * Prüft Tastatureingaben und aktualisiert die Position entsprechend.
     */
    handleMovement() {
      if (!this.character.world || !this.character.world.keyboard || this.character.isDead()) {
        return
      }
  
      const moved = this.handleHorizontalMovement()
      const jumped = this.handleJump()
  
      if (moved || jumped) {
        window.stopSnoreSound()
      }
  
      if (!this.character.world.keyboard.RIGHT && !this.character.world.keyboard.LEFT) {
        window.stopWalkingSound()
      }
  
      this.updateCameraPosition()
    }
  
    /**
     * Verarbeitet die horizontale Bewegung.
     * Prüft Links- und Rechts-Tasten und bewegt den Charakter entsprechend.
     * @returns {boolean} True, wenn eine Bewegung stattgefunden hat.
     */
    handleHorizontalMovement() {
      let moved = false
  
      if (this.character.world.keyboard.RIGHT && this.character.x < this.character.world.level.level_end_x) {
        this.moveRight()
        moved = true
      }
  
      if (this.character.world.keyboard.LEFT && this.character.x > 0) {
        this.moveLeft()
        moved = true
      }
  
      return moved
    }
  
    /**
     * Bewegt den Charakter nach rechts.
     * Aktualisiert Position, Richtung und spielt Laufsound ab.
     */
    moveRight() {
      this.character.moveRight()
      this.character.otherDirection = false
      this.character.updateLastAction()
      window.playWalkingSound()
    }
  
    /**
     * Bewegt den Charakter nach links.
     * Aktualisiert Position, Richtung und spielt Laufsound ab.
     */
    moveLeft() {
      this.character.moveLeft()
      this.character.otherDirection = true
      this.character.updateLastAction()
      window.playWalkingSound()
    }
  
    /**
     * Verarbeitet das Springen.
     * Prüft Sprung-Taste und lässt den Charakter springen, wenn möglich.
     * @returns {boolean} True, wenn gesprungen wurde.
     */
    handleJump() {
      if (this.character.world.keyboard.SPACE && !this.character.isAboveGround()) {
        this.character.jump()
        this.character.updateLastAction()
        window.playJumpSound()
        return true
      }
      return false
    }
  
    /**
     * Aktualisiert die Kameraposition.
     * Zentriert die Kamera auf den Charakter.
     */
    updateCameraPosition() {
      this.character.world.camera_x = -this.character.x + 100
    }
  }
  
  