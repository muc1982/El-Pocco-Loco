class Character extends MoveableObject {
  height = 280
  width = 120
  y = 160
  speed = 10
  groundY = 150
  offset = { top: 120, left: 20, right: 20, bottom: 10 }
  lastAction = 0
  idleTimeout = 6500 // bevor der Charakter schläft

  IMAGES_IDLE = [
    "img/character_pepe/idle/idle/I-1.png",
    "img/character_pepe/idle/idle/I-2.png",
    "img/character_pepe/idle/idle/I-3.png",
    "img/character_pepe/idle/idle/I-4.png",
    "img/character_pepe/idle/idle/I-5.png",
    "img/character_pepe/idle/idle/I-6.png",
    "img/character_pepe/idle/idle/I-7.png",
    "img/character_pepe/idle/idle/I-8.png",
    "img/character_pepe/idle/idle/I-9.png",
    "img/character_pepe/idle/idle/I-10.png",
  ]
  IMAGES_SLEEPING = [
    "img/character_pepe/idle/long_idle/I-11.png",
    "img/character_pepe/idle/long_idle/I-12.png",
    "img/character_pepe/idle/long_idle/I-13.png",
    "img/character_pepe/idle/long_idle/I-14.png",
    "img/character_pepe/idle/long_idle/I-15.png",
    "img/character_pepe/idle/long_idle/I-16.png",
    "img/character_pepe/idle/long_idle/I-17.png",
    "img/character_pepe/idle/long_idle/I-18.png",
    "img/character_pepe/idle/long_idle/I-19.png",
    "img/character_pepe/idle/long_idle/I-20.png",
  ]
  IMAGES_WALKING = [
    "img/character_pepe/walk/W-21.png",
    "img/character_pepe/walk/W-22.png",
    "img/character_pepe/walk/W-23.png",
    "img/character_pepe/walk/W-24.png",
    "img/character_pepe/walk/W-25.png",
    "img/character_pepe/walk/W-26.png",
  ]
  IMAGES_JUMPING = [
    "img/character_pepe/jump/J-31.png",
    "img/character_pepe/jump/J-32.png",
    "img/character_pepe/jump/J-33.png",
    "img/character_pepe/jump/J-34.png",
    "img/character_pepe/jump/J-35.png",
    "img/character_pepe/jump/J-36.png",
    "img/character_pepe/jump/J-37.png",
    "img/character_pepe/jump/J-38.png",
    "img/character_pepe/jump/J-39.png",
  ]
  IMAGES_HURT = [
    "img/character_pepe/hurt/H-41.png",
    "img/character_pepe/hurt/H-42.png",
    "img/character_pepe/hurt/H-43.png",
  ]
  IMAGES_DEAD = [
    "img/character_pepe/dead/D-51.png",
    "img/character_pepe/dead/D-52.png",
    "img/character_pepe/dead/D-53.png",
    "img/character_pepe/dead/D-54.png",
    "img/character_pepe/dead/D-55.png",
    "img/character_pepe/dead/D-56.png",
    "img/character_pepe/dead/D-57.png",
  ]
  world

  constructor() {
    super()
    this.loadImage("img/character_pepe/idle/idle/I-1.png")
    this.loadAllImages()
    this.applyGravity()
    this.animate()
  }

  loadAllImages() {
    if (this.IMAGES_IDLE) this.loadImages(this.IMAGES_IDLE)
    if (this.IMAGES_SLEEPING) this.loadImages(this.IMAGES_SLEEPING)
    if (this.IMAGES_WALKING) this.loadImages(this.IMAGES_WALKING)
    if (this.IMAGES_JUMPING) this.loadImages(this.IMAGES_JUMPING)
    if (this.IMAGES_HURT) this.loadImages(this.IMAGES_HURT)
    if (this.IMAGES_DEAD) this.loadImages(this.IMAGES_DEAD)
  }

  animate() {
    this.animateMovement()
    this.animateImages()
  }

  animateMovement() {
    setInterval(() => this.handleMovement(), 1000 / 60)
  }

  handleMovement() {
    if (!this.world || !this.world.keyboard || this.isDead()) return
    const moved = this.handleHorizontalMovement()
    const jumped = this.handleJump()
    if (moved || jumped) window.stopSnoreSound()
    if (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT) window.stopWalkingSound()
    this.world.camera_x = -this.x + 100
  }

  handleHorizontalMovement() {
    let moved = false
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight()
      this.otherDirection = false
      this.updateLastAction()
      window.playWalkingSound()
      moved = true
    }
    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft()
      this.otherDirection = true
      this.updateLastAction()
      window.playWalkingSound()
      moved = true
    }
    return moved
  }

  handleJump() {
    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump()
      this.updateLastAction()
      window.playJumpSound()
      return true
    }
    return false
  }

  animateImages() {
    setInterval(() => this.updateCharacterImage(), 100)
  }

  updateCharacterImage() {
    let anim
    if (!window.gameRunning) {
      // Wenn das Spiel nicht läuft, führe keine Idle-Animation durch
      return
    }
    anim = this.isDead()
      ? this.IMAGES_DEAD
      : this.isHurt()
        ? this.IMAGES_HURT
        : this.isAboveGround()
          ? this.IMAGES_JUMPING
          : this.world && this.world.keyboard && (this.world.keyboard.RIGHT || this.world.keyboard.LEFT)
            ? (window.stopSnoreSound(), this.IMAGES_WALKING)
            : this.isIdle()
              ? (window.playSnoreSound(), this.IMAGES_SLEEPING)
              : (window.stopSnoreSound(), this.IMAGES_IDLE)
    this.playAnimation(anim)
  }

  updateLastAction() {
    this.lastAction = new Date().getTime()
  }

  isIdle() {
    return new Date().getTime() - this.lastAction > this.idleTimeout
  }

  // Neue hit()-Methode: Bei jedem Treffer wird 25 Energie abgezogen
  hit() {
    this.energy = Math.max(0, this.energy - 25)
    this.lastHit = new Date().getTime()
  }
}

