let backgroundMusic, walkingSound, jumpSound, bottleSound, chickenSound, coinSound
let hurtSound, gameOverSound, gameWinSound, endbossHurtSound, snoreSound
let isMuted = false,
  audioInitialized = false,
  audioPlayRequested = false

function initAudio() {
  if (audioInitialized) return
  loadAudioFiles()
  checkSavedMuteState()
  preloadAudio()
  audioInitialized = true
  document.addEventListener("click", enableAudioOnFirstClick, { once: true })
}
window.initAudio = initAudio

/**
 * Enables audio on first click
 */
function enableAudioOnFirstClick() {
  if (!isMuted) {
    tryPlayBackgroundMusic()
  }
}

/**
 * Loads all audio files.
 */
function loadAudioFiles() {
  backgroundMusic = new Audio("audio/hintergrundmusik.mp3")
  backgroundMusic.loop = true
  backgroundMusic.volume = 0.3
  walkingSound = new Audio("audio/schritte-auf-kies-142718.mp3")
  walkingSound.loop = true
  walkingSound.volume = 0.8
  jumpSound = new Audio("audio/jumping.mp3")
  jumpSound.volume = 0.3
  bottleSound = new Audio("audio/bottle_aufsammeln.mp3")
  bottleSound.volume = 0.3
  chickenSound = new Audio("audio/die_chicken_kopftreffer.mp3")
  chickenSound.volume = 0.3
  coinSound = new Audio("audio/coinaufsammeln.mp3")
  coinSound.volume = 0.3
  hurtSound = new Audio("audio/autsch.mp3")
  hurtSound.volume = 0.3
  gameOverSound = new Audio("audio/gameover_gelache.mp3")
  gameOverSound.volume = 0.5
  gameWinSound = new Audio("audio/winsound.mp3")
  gameWinSound.volume = 0.5
  endbossHurtSound = new Audio("audio/hurt_end_boss.mp3")
  endbossHurtSound.volume = 0.4
  snoreSound = new Audio("audio/male-snoring.mp3")
  snoreSound.volume = 0.2
  snoreSound.loop = true
}

/**
 * Checks saved mute state and applies it.
 */
function checkSavedMuteState() {
  const saved = localStorage.getItem("isMuted")
  if (saved === "true") {
    isMuted = true
    updateMuteIcon()
  }
}

/**
 * Attempts to play background music.
 */
function tryPlayBackgroundMusic() {
  if (isMuted) return
  audioPlayRequested = true
  if (backgroundMusic) {
    backgroundMusic.pause()
    backgroundMusic.currentTime = 0
    setTimeout(() => {
      if (audioPlayRequested && !isMuted) {
        backgroundMusic.play().catch((err) => {
          if (err.name === "NotAllowedError") setupUserInteractionListeners()
        })
      }
    }, 100)
  }
}

/**
 * Sets up event listeners for user interaction.
 */
function setupUserInteractionListeners() {
  document.addEventListener("click", enableAudio, { once: true })
}

/**
 * Enables audio playback after user interaction.
 */
function enableAudio() {
  if (isMuted) return
  setTimeout(() => playBackgroundMusic(), 100)
}
window.enableAudio = enableAudio

/**
 * Preloads all audio files and sets up an event listener.
 */
function preloadAudio() {
  const audioList = [
    backgroundMusic,
    walkingSound,
    jumpSound,
    bottleSound,
    chickenSound,
    coinSound,
    hurtSound,
    gameOverSound,
    gameWinSound,
    endbossHurtSound,
    snoreSound,
  ]
  audioList.forEach((a) => a && a.load())
}

/**
 * Plays the background music.
 */
function playBackgroundMusic() {
  if (isMuted || !backgroundMusic) return
  audioPlayRequested = true
  backgroundMusic.pause()
  backgroundMusic.currentTime = 0
  setTimeout(() => {
    if (audioPlayRequested && !isMuted) {
      backgroundMusic.play().catch((err) => {
        if (err.name === "NotAllowedError") document.addEventListener("click", enableAudio, { once: true })
      })
    }
  }, 200)
}
window.playBackgroundMusic = playBackgroundMusic

/**
 * Stops all sounds and returns a Promise.
 * @returns {Promise} A Promise that resolves after 100ms.
 */
function stopAllSounds() {
  audioPlayRequested = false
  const all = [
    backgroundMusic,
    walkingSound,
    jumpSound,
    bottleSound,
    chickenSound,
    coinSound,
    hurtSound,
    gameOverSound,
    gameWinSound,
    endbossHurtSound,
    snoreSound,
  ]
  all.forEach((s) => {
    if (s) {
      s.pause()
      s.currentTime = 0
    }
  })
  return new Promise((resolve) => setTimeout(resolve, 100))
}
window.stopAllSounds = stopAllSounds

/**
 * Toggles sound on or off.
 */
function toggleMute() {
  isMuted = !isMuted
  localStorage.setItem("isMuted", isMuted)
  updateMuteIcon()
  isMuted ? stopAllSounds() : playBackgroundMusic()
}
window.toggleMute = toggleMute

/**
 * Updates the mute icon based on current status.
 */
function updateMuteIcon() {
  const vol = document.getElementById("volume-icon")
  const startVol = document.getElementById("start-volume-icon")
  const muted = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>`
  const unmuted = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>`
  const icon = isMuted ? muted : unmuted
  if (vol) vol.innerHTML = icon
  if (startVol) startVol.innerHTML = icon
}
window.updateMuteIcon = updateMuteIcon

/**
 * Plays the game over sound.
 */
function playGameOverSound() {
  if (!isMuted && gameOverSound) {
    stopAllSounds().then(() => {
      gameOverSound.currentTime = 0
      gameOverSound.play().catch(() => {
      })
    })
  }
}
window.playGameOverSound = playGameOverSound

/**
 * Plays the game win sound.
 */
function playGameWinSound() {
  if (!isMuted && gameWinSound) {
    stopAllSounds().then(() => {
      gameWinSound.currentTime = 0
      gameWinSound.play().catch(() => {
      })
    })
  }
}
window.playGameWinSound = playGameWinSound

/**
 * Plays the walking sound.
 */
function playWalkingSound() {
  if (!isMuted && walkingSound && walkingSound.paused) walkingSound.play().catch(() => {})
}
window.playWalkingSound = playWalkingSound

/**
 * Stops the walking sound.
 */
function stopWalkingSound() {
  if (walkingSound) {
    walkingSound.pause()
    walkingSound.currentTime = 0
  }
}
window.stopWalkingSound = stopWalkingSound

/**
 * Plays the jump sound.
 */
function playJumpSound() {
  if (!isMuted && jumpSound) {
    jumpSound.currentTime = 0
    jumpSound.play().catch(() => {})
  }
}
window.playJumpSound = playJumpSound

/**
 * Plays the bottle sound.
 */
function playBottleSound() {
  if (!isMuted && bottleSound) {
    bottleSound.currentTime = 0
    bottleSound.play().catch(() => {})
  }
}
window.playBottleSound = playBottleSound

/**
 * Plays the chicken sound.
 */
function playChickenSound() {
  if (!isMuted && chickenSound) {
    chickenSound.currentTime = 0
    chickenSound.play().catch(() => {})
  }
}
window.playChickenSound = playChickenSound

/**
 * Plays the coin sound.
 */
function playCoinSound() {
  if (!isMuted && coinSound) {
    coinSound.currentTime = 0
    coinSound.play().catch(() => {})
  }
}
window.playCoinSound = playCoinSound

/**
 * Plays the hurt sound.
 */
function playHurtSound() {
  if (!isMuted && hurtSound) {
    hurtSound.currentTime = 0
    hurtSound.play().catch(() => {})
  }
}
window.playHurtSound = playHurtSound

/**
 * Stops the snore sound.
 */
function stopSnoreSound() {
  if (snoreSound) {
    snoreSound.pause()
    snoreSound.currentTime = 0
  }
}
window.stopSnoreSound = stopSnoreSound

/**
 * Plays the snore sound.
 */
function playSnoreSound() {
  if (!isMuted && snoreSound && snoreSound.paused) {
    snoreSound.play().catch(() => {})
  }
}
window.playSnoreSound = playSnoreSound

/**
 * Plays the fireball sound.
 */
function playFireballSound() {
  if (!isMuted) {
    const fireballSound = new Audio("audio/fireball.mp3")
    fireballSound.volume = 0.4
    fireballSound.play().catch(() => {
    })
  }
}
window.playFireballSound = playFireballSound

/**
 * Plays the endboss hurt sound.
 */
function playEndbossHurtSound() {
  if (!isMuted && endbossHurtSound) {
    endbossHurtSound.currentTime = 0
    endbossHurtSound.play().catch(() => {
    })
  }
}
window.playEndbossHurtSound = playEndbossHurtSound

