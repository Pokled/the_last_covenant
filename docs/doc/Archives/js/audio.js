// 🎵 SYSTÈME AUDIO DU JEU
class AudioManager {
  constructor() {
    this.audioContext = null;
    this.sounds = {};
    this.volume = 0.3; // Volume global (0.0 à 1.0)
    this.enabled = true;
    
    // 🎼 Musiques d'ambiance
    this.musicVolume = 0.4;
    this.currentMusic = null;
    this.musicEnabled = true;
    
    this.musics = {
      lobby: null,
      game: null,
      victory: null
    };
    
    // Initialiser le contexte audio (nécessite une interaction utilisateur)
    this.initAudioContext();
    
    // Charger les musiques
    this.loadMusics();
    
    console.log('🎵 Audio Manager initialisé');
  }
  
  // 🎼 Charger les musiques MP3
  loadMusics() {
    try {
      this.musics.lobby = new Audio('music/Lobby_Ambiance.mp3');
      this.musics.lobby.loop = true;
      this.musics.lobby.volume = this.musicVolume;
      
      this.musics.game = new Audio('music/Game_Ambiance.mp3');
      this.musics.game.loop = true;
      this.musics.game.volume = this.musicVolume;
      
      this.musics.victory = new Audio('music/Congratulations_Ambiance.mp3');
      this.musics.victory.loop = false; // Joue une seule fois
      this.musics.victory.volume = this.musicVolume;
      
      console.log('🎼 Musiques chargées');
    } catch (e) {
      console.warn('⚠️ Impossible de charger les musiques:', e);
    }
  }
  
  // 🎼 Jouer une musique
  playMusic(type) {
    if (!this.musicEnabled || !this.musics[type]) return;
    
    // Arrêter la musique actuelle
    this.stopMusic();
    
    // Jouer la nouvelle musique
    this.currentMusic = this.musics[type];
    this.currentMusic.currentTime = 0;
    
    const playPromise = this.currentMusic.play();
    
    if (playPromise !== undefined) {
      playPromise.then(() => {
        console.log(`🎼 Musique "${type}" lancée`);
      }).catch(error => {
        // Ne pas afficher d'erreur si c'est juste l'autoplay bloqué
        if (error.name === 'NotAllowedError') {
          console.log('ℹ️ Musique en attente d\'interaction utilisateur');
        } else {
          console.warn('⚠️ Erreur lecture musique:', error.message);
        }
      });
    }
  }
  
  // 🎼 Arrêter la musique
  stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic.currentTime = 0;
      this.currentMusic = null;
    }
  }
  
  // 🎼 Toggle musique
  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    
    if (!this.musicEnabled && this.currentMusic) {
      this.stopMusic();
    }
    
    return this.musicEnabled;
  }
  
  // 🎼 Changer le volume de la musique
  setMusicVolume(vol) {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    Object.values(this.musics).forEach(music => {
      if (music) music.volume = this.musicVolume;
    });
  }
  
  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      console.log('✅ Contexte audio créé');
    } catch (e) {
      console.warn('⚠️ Audio non disponible:', e);
      this.enabled = false;
    }
  }
  
  // Assurer que le contexte audio est actif (nécessite un clic utilisateur)
  async resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }
  
  // 🎲 SON : Dé qui roule
  playDiceRoll() {
    if (!this.enabled) return;
    this.resume();
    
    const ctx = this.audioContext;
    const now = ctx.currentTime;
    
    // Bruit blanc filtré pour simuler le dé qui roule
    const noise = ctx.createBufferSource();
    const bufferSize = ctx.sampleRate * 0.6; // 600ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      // Bruit qui diminue progressivement
      const decay = 1 - (i / bufferSize);
      data[i] = (Math.random() * 2 - 1) * decay * 0.3;
    }
    
    noise.buffer = buffer;
    
    // Filtre passe-bas pour donner un son plus "boisé"
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    filter.Q.value = 2;
    
    // Gain pour contrôler le volume
    const gainNode = ctx.createGain();
    gainNode.gain.value = this.volume * 0.5;
    
    // Connexions
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Jouer
    noise.start(now);
    noise.stop(now + 0.6);
  }
  
  // 🎯 SON : Impact du dé
  playDiceImpact() {
    if (!this.enabled) return;
    this.resume();
    
    const ctx = this.audioContext;
    const now = ctx.currentTime;
    
    // Oscillateur pour le "clac" du dé
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.05);
    
    // Enveloppe d'amplitude
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(this.volume * 0.4, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    // Connexions
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Jouer
    osc.start(now);
    osc.stop(now + 0.1);
  }
  
  // 👣 SON : Déplacement du pion (pas de pierre)
  playFootstep() {
    if (!this.enabled) return;
    this.resume();
    
    const ctx = this.audioContext;
    const now = ctx.currentTime;
    
    // Bruit bref pour simuler un pas
    const noise = ctx.createBufferSource();
    const bufferSize = ctx.sampleRate * 0.08; // 80ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      const decay = 1 - (i / bufferSize);
      data[i] = (Math.random() * 2 - 1) * decay * 0.2;
    }
    
    noise.buffer = buffer;
    
    // Filtre pour son de pierre
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    
    const gainNode = ctx.createGain();
    gainNode.gain.value = this.volume * 0.3;
    
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    noise.start(now);
    noise.stop(now + 0.08);
  }
  
  // 💰 SON : Pièces d'or (coffre)
  playCoinCollect() {
    if (!this.enabled) return;
    this.resume();
    
    const ctx = this.audioContext;
    const now = ctx.currentTime;
    
    // Plusieurs oscillateurs pour simuler des pièces
    for (let i = 0; i < 5; i++) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      
      // Fréquences aléatoires pour effet métallique
      const freq = 800 + Math.random() * 400;
      osc.frequency.setValueAtTime(freq, now + i * 0.04);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.8, now + i * 0.04 + 0.15);
      
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(this.volume * 0.15, now + i * 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.04 + 0.15);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(now + i * 0.04);
      osc.stop(now + i * 0.04 + 0.15);
    }
  }
  
  // ⚔️ SON : Impact d'épée (combat)
  playSwordHit() {
    if (!this.enabled) return;
    this.resume();
    
    const ctx = this.audioContext;
    const now = ctx.currentTime;
    
    // Bruit blanc court + oscillateur grave
    const noise = ctx.createBufferSource();
    const bufferSize = ctx.sampleRate * 0.1;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      const decay = 1 - (i / bufferSize);
      data[i] = (Math.random() * 2 - 1) * decay * 0.4;
    }
    
    noise.buffer = buffer;
    
    // Oscillateur pour le "clang" métallique
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 3;
    
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(this.volume * 0.5, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    noise.connect(filter);
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    noise.start(now);
    noise.stop(now + 0.1);
    osc.start(now);
    osc.stop(now + 0.15);
  }
  
  // 💀 SON : Piège activé
  playTrapTrigger() {
    if (!this.enabled) return;
    this.resume();
    
    const ctx = this.audioContext;
    const now = ctx.currentTime;
    
    // Son menaçant descendant
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.4);
    
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(this.volume * 0.4, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.4);
  }
  
  // ✨ SON : Carte obtenue (magie)
  playCardGet() {
    if (!this.enabled) return;
    this.resume();
    
    const ctx = this.audioContext;
    const now = ctx.currentTime;
    
    // Arpège magique montant
    const notes = [523.25, 659.25, 783.99, 1046.50]; // Do, Mi, Sol, Do (octave)
    
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, now + i * 0.08);
      gainNode.gain.linearRampToValueAtTime(this.volume * 0.2, now + i * 0.08 + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.3);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.3);
    });
  }
  
  // 🎊 SON : Victoire
  playVictory() {
    if (!this.enabled) return;
    this.resume();
    
    const ctx = this.audioContext;
    const now = ctx.currentTime;
    
    // Fanfare simple
    const melody = [
      { freq: 523.25, time: 0 },     // Do
      { freq: 659.25, time: 0.15 },  // Mi
      { freq: 783.99, time: 0.3 },   // Sol
      { freq: 1046.50, time: 0.45 }, // Do haut
    ];
    
    melody.forEach(note => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = note.freq;
      
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(this.volume * 0.3, now + note.time);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + note.time + 0.4);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(now + note.time);
      osc.stop(now + note.time + 0.4);
    });
  }
  
  // 💔 SON : Dégâts reçus
  playHurt() {
    if (!this.enabled) return;
    this.resume();
    
    const ctx = this.audioContext;
    const now = ctx.currentTime;
    
    // Son de douleur (fréquence descendante rapide)
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.15);
    
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(this.volume * 0.4, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.15);
  }
  
  // 🔔 SON : Notification / UI
  playNotification() {
    if (!this.enabled) return;
    this.resume();
    
    const ctx = this.audioContext;
    const now = ctx.currentTime;
    
    // Double bip agréable
    [0, 0.1].forEach((delay, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = i === 0 ? 800 : 1000;
      
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(this.volume * 0.2, now + delay);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.08);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(now + delay);
      osc.stop(now + delay + 0.08);
    });
  }
  
  // 🎚️ Changer le volume
  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }
  
  // 🔇 Toggle son
  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

// Instance globale
const AUDIO = new AudioManager();

console.log('🎵 Système audio chargé');