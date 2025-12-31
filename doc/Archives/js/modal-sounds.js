// 🎵 MODAL SOUNDS - SYSTÈME DE SONS SYNTHÉTISÉS

class ModalSoundSystem {
  constructor() {
    this.audioContext = null;
    this.masterGain = null;
    this.enabled = true;
    
    // Initialiser le contexte audio (nécessite interaction utilisateur)
    this.initAudioContext();
  }
  
  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.3; // Volume global
      console.log('🎵 Système de sons modals initialisé');
    } catch (e) {
      console.warn('Web Audio API non supportée:', e);
      this.enabled = false;
    }
  }
  
  // Reprendre le contexte audio (pour mobile)
  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }
  
  // === SON COMBAT - Dramatique et percutant ===
  playCombatSound() {
    if (!this.enabled) return;
    this.resume();
    
    const now = this.audioContext.currentTime;
    
    // Son 1 : Coup de gong
    const osc1 = this.audioContext.createOscillator();
    const gain1 = this.audioContext.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(80, now);
    osc1.frequency.exponentialRampToValueAtTime(40, now + 0.5);
    osc1.connect(gain1);
    gain1.connect(this.masterGain);
    gain1.gain.setValueAtTime(0.5, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    osc1.start(now);
    osc1.stop(now + 0.5);
    
    // Son 2 : Clash métallique
    setTimeout(() => {
      const noiseBuffer = this.createNoiseBuffer(0.2);
      const noise = this.audioContext.createBufferSource();
      const noiseGain = this.audioContext.createGain();
      const noiseFilter = this.audioContext.createBiquadFilter();
      
      noise.buffer = noiseBuffer;
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 2000;
      
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      
      const noiseNow = this.audioContext.currentTime;
      noiseGain.gain.setValueAtTime(0.3, noiseNow);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, noiseNow + 0.2);
      
      noise.start(noiseNow);
      noise.stop(noiseNow + 0.2);
    }, 100);
    
    // Son 3 : Grondement
    setTimeout(() => {
      const osc3 = this.audioContext.createOscillator();
      const gain3 = this.audioContext.createGain();
      osc3.type = 'triangle';
      osc3.frequency.value = 60;
      osc3.connect(gain3);
      gain3.connect(this.masterGain);
      
      const now3 = this.audioContext.currentTime;
      gain3.gain.setValueAtTime(0.4, now3);
      gain3.gain.exponentialRampToValueAtTime(0.01, now3 + 0.8);
      
      osc3.start(now3);
      osc3.stop(now3 + 0.8);
    }, 200);
  }
  
  // === SON TRÉSOR - Pièces qui tombent ===
  playTreasureSound() {
    if (!this.enabled) return;
    this.resume();
    
    // Cascade de pièces (7 pièces)
    for (let i = 0; i < 7; i++) {
      setTimeout(() => {
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800 + Math.random() * 600, now);
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        
        osc.start(now);
        osc.stop(now + 0.15);
        
        // Harmonique pour richesse sonore
        const osc2 = this.audioContext.createOscillator();
        const gain2 = this.audioContext.createGain();
        osc2.type = 'sine';
        osc2.frequency.value = osc.frequency.value * 2;
        osc2.connect(gain2);
        gain2.connect(this.masterGain);
        gain2.gain.setValueAtTime(0.08, now);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        osc2.start(now);
        osc2.stop(now + 0.12);
      }, i * 80);
    }
    
    // Son de scintillement final
    setTimeout(() => {
      const now = this.audioContext.currentTime;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(2400, now + 0.3);
      osc.connect(gain);
      gain.connect(this.masterGain);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }, 600);
  }
  
  // === SON ÉNIGME - Mystique et intrigant ===
  playPuzzleSound() {
    if (!this.enabled) return;
    this.resume();
    
    const now = this.audioContext.currentTime;
    
    // Mélodie mystique ascendante
    const notes = [440, 554, 659, 880]; // La, Do#, Mi, La (octave)
    notes.forEach((freq, i) => {
      setTimeout(() => {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        const startTime = this.audioContext.currentTime;
        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
        
        osc.start(startTime);
        osc.stop(startTime + 0.4);
      }, i * 200);
    });
    
    // Réverbération mystique (bruit filtré)
    setTimeout(() => {
      const noiseBuffer = this.createNoiseBuffer(1.5);
      const noise = this.audioContext.createBufferSource();
      const noiseGain = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();
      
      noise.buffer = noiseBuffer;
      filter.type = 'lowpass';
      filter.frequency.value = 500;
      filter.Q.value = 10;
      
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      
      const startTime = this.audioContext.currentTime;
      noiseGain.gain.setValueAtTime(0.08, startTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, startTime + 1.5);
      
      noise.start(startTime);
      noise.stop(startTime + 1.5);
    }, 800);
  }
  
  // === SON REPOS - Apaisant et régénérateur ===
  playRestSound() {
    if (!this.enabled) return;
    this.resume();
    
    const now = this.audioContext.currentTime;
    
    // Accord apaisant (Do majeur)
    const chord = [261.63, 329.63, 392.00]; // Do, Mi, Sol
    chord.forEach((freq, i) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.1);
      gain.gain.setValueAtTime(0.1, now + 1.5);
      gain.gain.linearRampToValueAtTime(0, now + 2.5);
      
      osc.start(now);
      osc.stop(now + 2.5);
    });
    
    // Son de clochette (harmoniques)
    setTimeout(() => {
      const fundamental = 880;
      const harmonics = [1, 2, 3, 4].map(h => fundamental * h);
      harmonics.forEach((freq, i) => {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        const volume = 0.08 / (i + 1);
        const startTime = this.audioContext.currentTime;
        gain.gain.setValueAtTime(volume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1);
        
        osc.start(startTime);
        osc.stop(startTime + 1);
      });
    }, 300);
  }
  
  // === SON MARCHAND - Joyeux et commercial ===
  playMerchantSound() {
    if (!this.enabled) return;
    this.resume();
    
    // Clochette de boutique
    const now = this.audioContext.currentTime;
    const fundamental = 1000;
    
    // Son de cloche (attack rapide)
    const osc1 = this.audioContext.createOscillator();
    const gain1 = this.audioContext.createGain();
    osc1.type = 'sine';
    osc1.frequency.value = fundamental;
    osc1.connect(gain1);
    gain1.connect(this.masterGain);
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    osc1.start(now);
    osc1.stop(now + 0.5);
    
    // Harmoniques
    [2, 3, 4].forEach((harmonic, i) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      osc.type = 'sine';
      osc.frequency.value = fundamental * harmonic;
      osc.connect(gain);
      gain.connect(this.masterGain);
      
      const volume = 0.15 / harmonic;
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    });
    
    // Deuxième ding
    setTimeout(() => {
      const osc2 = this.audioContext.createOscillator();
      const gain2 = this.audioContext.createGain();
      const now2 = this.audioContext.currentTime;
      osc2.type = 'sine';
      osc2.frequency.value = fundamental * 1.2;
      osc2.connect(gain2);
      gain2.connect(this.masterGain);
      gain2.gain.setValueAtTime(0.2, now2);
      gain2.gain.exponentialRampToValueAtTime(0.01, now2 + 0.4);
      osc2.start(now2);
      osc2.stop(now2 + 0.4);
    }, 200);
  }
  
  // === SON MYSTÈRE - Étrange et surnaturel ===
  playMysterySound() {
    if (!this.enabled) return;
    this.resume();
    
    const now = this.audioContext.currentTime;
    
    // Son montant étrange
    const osc1 = this.audioContext.createOscillator();
    const gain1 = this.audioContext.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(200, now);
    osc1.frequency.exponentialRampToValueAtTime(800, now + 1);
    osc1.connect(gain1);
    gain1.connect(this.masterGain);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 1);
    osc1.start(now);
    osc1.stop(now + 1);
    
    // Vibrato mystique
    const vibrato = this.audioContext.createOscillator();
    const vibratoGain = this.audioContext.createGain();
    vibrato.frequency.value = 6;
    vibratoGain.gain.value = 30;
    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc1.frequency);
    vibrato.start(now);
    vibrato.stop(now + 1);
    
    // Son descendant en écho
    setTimeout(() => {
      const osc2 = this.audioContext.createOscillator();
      const gain2 = this.audioContext.createGain();
      const now2 = this.audioContext.currentTime;
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(800, now2);
      osc2.frequency.exponentialRampToValueAtTime(200, now2 + 1.5);
      osc2.connect(gain2);
      gain2.connect(this.masterGain);
      gain2.gain.setValueAtTime(0.15, now2);
      gain2.gain.exponentialRampToValueAtTime(0.01, now2 + 1.5);
      osc2.start(now2);
      osc2.stop(now2 + 1.5);
    }, 500);
  }
  
  // === SON ACHAT - Caisse enregistreuse ===
  playPurchaseSound() {
    if (!this.enabled) return;
    this.resume();
    
    const now = this.audioContext.currentTime;
    
    // "Cha-ching!"
    const osc1 = this.audioContext.createOscillator();
    const gain1 = this.audioContext.createGain();
    osc1.type = 'sine';
    osc1.frequency.value = 800;
    osc1.connect(gain1);
    gain1.connect(this.masterGain);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc1.start(now);
    osc1.stop(now + 0.1);
    
    setTimeout(() => {
      const osc2 = this.audioContext.createOscillator();
      const gain2 = this.audioContext.createGain();
      const now2 = this.audioContext.currentTime;
      osc2.type = 'sine';
      osc2.frequency.value = 1200;
      osc2.connect(gain2);
      gain2.connect(this.masterGain);
      gain2.gain.setValueAtTime(0.25, now2);
      gain2.gain.exponentialRampToValueAtTime(0.01, now2 + 0.15);
      osc2.start(now2);
      osc2.stop(now2 + 0.15);
    }, 100);
  }
  
  // === SON SUCCÈS ===
  playSuccessSound() {
    if (!this.enabled) return;
    this.resume();
    
    // Triade majeure ascendante
    const notes = [523.25, 659.25, 783.99]; // Do, Mi, Sol
    notes.forEach((freq, i) => {
      setTimeout(() => {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        const now = this.audioContext.currentTime;
        osc.type = 'sine';
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(this.masterGain);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      }, i * 100);
    });
  }
  
  // === SON ERREUR ===
  playErrorSound() {
    if (!this.enabled) return;
    this.resume();
    
    const now = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(200, now + 0.3);
    osc.connect(gain);
    gain.connect(this.masterGain);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  }
  
  // === UTILITAIRE : Créer buffer de bruit blanc ===
  createNoiseBuffer(duration) {
    const sampleRate = this.audioContext.sampleRate;
    const bufferSize = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    return buffer;
  }
  
  // === CONTRÔLE VOLUME ===
  setVolume(volume) {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }
  
  // === ACTIVER/DÉSACTIVER ===
  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

// Export global
const ModalSounds = new ModalSoundSystem();

console.log('🎵 Système de sons modals chargé');
