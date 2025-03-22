// Überprüfen, ob die Variablen bereits existieren
if (typeof backgroundMusic === 'undefined') {
  var backgroundMusic, walkingSound, jumpSound, bottleSound, chickenSound, coinSound;
  var hurtSound, gameOverSound, gameWinSound, endbossHurtSound, snoreSound;
  var isMuted = false,
  audioInitialized = false,
  audioPlayRequested = false;
}

function initAudio() {
  if (audioInitialized) return;
  loadAudioFiles();
  checkSavedMuteState();
  preloadAudio();
  audioInitialized = true;
  tryPlayBackgroundMusic();
}
window.initAudio = initAudio;

function loadAudioFiles() {
  backgroundMusic = new Audio("audio/hintergrundmusik.mp3");
  backgroundMusic.loop = true;
  backgroundMusic.volume = 0.3;
  walkingSound = new Audio("audio/schritte-auf-kies-142718.mp3");
  walkingSound.loop = true;
  walkingSound.volume = 0.8;
  jumpSound = new Audio("audio/jumping.mp3");
  jumpSound.volume = 0.3;
  bottleSound = new Audio("audio/bottle_aufsammeln.mp3");
  bottleSound.volume = 0.3;
  chickenSound = new Audio("audio/die_chicken_kopftreffer.mp3");
  chickenSound.volume = 0.3;
  coinSound = new Audio("audio/coinaufsammeln.mp3");
  coinSound.volume = 0.3;
  hurtSound = new Audio("audio/autsch.mp3");
  hurtSound.volume = 0.3;
  gameOverSound = new Audio("audio/gameover_gelache.mp3");
  gameOverSound.volume = 0.5;
  gameWinSound = new Audio("audio/winsound.mp3");
  gameWinSound.volume = 0.5;
  endbossHurtSound = new Audio("audio/hurt_end_boss.mp3");
  endbossHurtSound.volume = 0.4;
  snoreSound = new Audio("audio/male-snoring.mp3");
  snoreSound.volume = 0.2;
  snoreSound.loop = true;
}

/**
 * Prüft den gespeicherten Mute-Status und wendet ihn an.
 */
function checkSavedMuteState() {
  const saved = localStorage.getItem("isMuted");
  if (saved === "true") {
    isMuted = true;
    updateMuteIcon();
  }
}

/**
 * Versucht, die Hintergrundmusik abzuspielen.
 */
function tryPlayBackgroundMusic() {
  if (isMuted) return;
  audioPlayRequested = true;
  if (backgroundMusic) {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    setTimeout(() => {
      if (audioPlayRequested && !isMuted) {
        backgroundMusic.play().catch((err) => {
          if (err.name === "NotAllowedError") setupUserInteractionListeners();
        });
      }
    }, 100);
  }
}

/**
 * Richtet Event-Listener für Benutzerinteraktionen ein.
 */
function setupUserInteractionListeners() {
  ["click", "touchstart", "keydown"].forEach((e) => document.addEventListener(e, enableAudio, { once: true }));
}

/**
 * Aktiviert die Audio-Wiedergabe nach Benutzerinteraktion.
 */
function enableAudio() {
  if (isMuted) return;
  ["click", "touchstart", "keydown"].forEach((e) => document.removeEventListener(e, enableAudio));
  setTimeout(() => playBackgroundMusic(), 100);
}
window.enableAudio = enableAudio;

/**
 * Lädt alle Audio-Dateien vor und richtet einen Event-Listener ein.
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
    snoreSound
  ];
  audioList.forEach((a) => a && a.load());
  document.addEventListener("click", enableAudio, { once: true });
}

/**
 * Spielt die Hintergrundmusik ab.
 */
function playBackgroundMusic() {
  if (isMuted || !backgroundMusic) return;
  audioPlayRequested = true;
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
  setTimeout(() => {
    if (audioPlayRequested && !isMuted) {
      backgroundMusic.play().catch((err) => {
        if (err.name === "NotAllowedError") document.addEventListener("click", enableAudio, { once: true });
      });
    }
  }, 200);
}
window.playBackgroundMusic = playBackgroundMusic;

/**
 * Stoppt alle Sounds und gibt ein Promise zurück.
 * @returns {Promise} Ein Promise, das nach 100ms aufgelöst wird.
 */
function stopAllSounds() {
  audioPlayRequested = false;
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
    snoreSound
  ];
  all.forEach((s) => {
    if (s) {
      s.pause();
      s.currentTime = 0;
    }
  });
  return new Promise((resolve) => setTimeout(resolve, 100));
}
window.stopAllSounds = stopAllSounds;

/**
 * Schaltet den Ton ein oder aus.
 */
function toggleMute() {
  isMuted = !isMuted;
  localStorage.setItem("isMuted", isMuted);
  updateMuteIcon();
  isMuted ? stopAllSounds() : playBackgroundMusic();
}
window.toggleMute = toggleMute;

/**
 * Aktualisiert das Mute-Icon basierend auf dem aktuellen Status.
 */
function updateMuteIcon() {
  const vol = document.getElementById("volume-icon");
  const startVol = document.getElementById("start-volume-icon");
  const muted = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>`;
  const unmuted = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>`;
  const icon = isMuted ? muted : unmuted;
  if (vol) vol.innerHTML = icon;
  if (startVol) startVol.innerHTML = icon;
}
window.updateMuteIcon = updateMuteIcon;

/**
 * Spielt den Game-Over-Sound ab.
 */
function playGameOverSound() {
  if (!isMuted && gameOverSound) {
    stopAllSounds();
    gameOverSound.currentTime = 0;
    gameOverSound.play().catch(() => { });
    if (!window.gameOverSound) window.gameOverSound = new Audio("audio/gameover_gelache.mp3");
  }
}
window.playGameOverSound = playGameOverSound;

/**
 * Spielt den Game-Win-Sound ab.
 */
function playGameWinSound() {
  if (!isMuted && gameWinSound) {
    stopAllSounds();
    gameWinSound.play().catch(() => { });
  }
}
window.playGameWinSound = playGameWinSound;

/**
 * Spielt den Walking-Sound ab.
 */
function playWalkingSound() {
  if (!isMuted && walkingSound && walkingSound.paused) walkingSound.play().catch(() => { });
}
window.playWalkingSound = playWalkingSound;

/**
 * Stoppt den Walking-Sound.
 */
function stopWalkingSound() {
  if (walkingSound) {
    walkingSound.pause();
    walkingSound.currentTime = 0;
  }
}
window.stopWalkingSound = stopWalkingSound;

/**
 * Spielt den Jump-Sound ab.
 */
function playJumpSound() {
  if (!isMuted && jumpSound) {
    jumpSound.currentTime = 0;
    jumpSound.play().catch(() => { });
  }
}
window.playJumpSound = playJumpSound;

/**
 * Spielt den Bottle-Sound ab.
 */
function playBottleSound() {
  if (!isMuted && bottleSound) {
    bottleSound.currentTime = 0;
    bottleSound.play().catch(() => { });
  }
}
window.playBottleSound = playBottleSound;

/**
 * Spielt den Chicken-Sound ab.
 */
function playChickenSound() {
  if (!isMuted && chickenSound) {
    chickenSound.currentTime = 0;
    chickenSound.play().catch(() => { });
  }
}
window.playChickenSound = playChickenSound;

/**
 * Spielt den Coin-Sound ab.
 */
function playCoinSound() {
  if (!isMuted && coinSound) {
    coinSound.currentTime = 0;
    coinSound.play().catch(() => { });
  }
}
window.playCoinSound = playCoinSound;

/**
 * Spielt den Hurt-Sound ab.
 */
function playHurtSound() {
  if (!isMuted && hurtSound) {
    hurtSound.currentTime = 0;
    hurtSound.play().catch(() => { });
  }
}
window.playHurtSound = playHurtSound;

/**
 * Stoppt den Snore-Sound.
 */
function stopSnoreSound() {
  if (snoreSound) {
    snoreSound.pause();
    snoreSound.currentTime = 0;
  }
}
window.stopSnoreSound = stopSnoreSound;

/**
 * Spielt den Snore-Sound ab.
 */
function playSnoreSound() {
  if (!isMuted && snoreSound && snoreSound.paused) {
    snoreSound.play().catch(() => { });
  }
}
window.playSnoreSound = playSnoreSound;