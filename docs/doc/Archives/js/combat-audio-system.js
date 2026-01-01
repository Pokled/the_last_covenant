// ⚔️ COMBAT AUDIO SYSTEM - AAA QUALITY
// Darkest Dungeon + Gwent inspired
// Machine d'états synchronisée avec audio

class CombatAudioSystem {
  constructor() {
    // Audio Context
    this.audioContext = null;
    this.masterVolume = 0.7;
    this.sfxVolume = 0.8;
    this.musicVolume = 0.5;
    
    // Audio Elements
    this.sounds = {};
    this.music = null;
    this.currentMusic = null;
    
    // Audio State
    this.initialized = false;
    this.muted = false;
    
    console.log('🎵 Combat Audio System created');
  }
  
  // ═══════════════════════════════════════════════════════
  // 🎬 INITIALIZATION
  // ═══════════════════════════════════════════════════════
  
  async initialize() {
    if (this.initialized) return;
    
    console.log('🎵 Initializing Combat Audio System...');
    
    // Create Audio Context (for advanced features if needed)
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      console.log('✅ Audio Context created');
    } catch (e) {
      console.warn('⚠️ Audio Context not available:', e);
    }
    
    // Load all sound effects
    await this.loadSounds();
    
    this.initialized = true;
    console.log('✅ Combat Audio System initialized');
  }
  
  async loadSounds() {
    console.log('📦 Loading combat sounds...');
    
    // Sound library paths
    const soundPaths = {
      // === GAMEPLAY SOUNDS ===
      
      // Your Turn (War Drum - Darkest Dungeon style)
      'turn_start': 'audio/combat/turn_start.mp3',
      
      // Action Selection (Light click)
      'action_select': 'audio/combat/action_select.mp3',
      
      // Action Validation (Commit)
      'action_validate': 'audio/combat/action_validate.mp3',
      
      // Dice Roll (3-part sequence)
      'dice_anticipation': 'audio/combat/dice_anticipation.mp3',
      'dice_roll': 'audio/combat/dice_roll.mp3',
      'dice_result_low': 'audio/combat/dice_result_low.mp3',
      'dice_result_mid': 'audio/combat/dice_result_mid.mp3',
      'dice_result_high': 'audio/combat/dice_result_high.mp3',
      'dice_result_critical': 'audio/combat/dice_result_critical.mp3',
      
      // Damage Sounds
      'damage_light': 'audio/combat/damage_light.mp3',
      'damage_medium': 'audio/combat/damage_medium.mp3',
      'damage_heavy': 'audio/combat/damage_heavy.mp3',
      'damage_critical': 'audio/combat/damage_critical.mp3',
      
      // Spell/Magic
      'spell_cast': 'audio/combat/spell_cast.mp3',
      'spell_impact': 'audio/combat/spell_impact.mp3',
      
      // Defense
      'defend': 'audio/combat/defend.mp3',
      'block': 'audio/combat/block.mp3',
      
      // Item
      'item_use': 'audio/combat/item_use.mp3',
      'heal': 'audio/combat/heal.mp3',
      
      // Stress & Corruption (Darkest Dungeon style)
      'stress_increase': 'audio/combat/stress_increase.mp3',
      'stress_decrease': 'audio/combat/stress_decrease.mp3',
      'corruption_increase': 'audio/combat/corruption_increase.mp3',
      
      // Death
      'enemy_death': 'audio/combat/enemy_death.mp3',
      'ally_death': 'audio/combat/ally_death.mp3',
      
      // Combat End
      'victory': 'audio/combat/victory.mp3',
      'defeat': 'audio/combat/defeat.mp3',
      
      // UI Sounds
      'hover': 'audio/combat/hover.mp3',
      'cancel': 'audio/combat/cancel.mp3',
      
      // Ambiance (Darkest Dungeon style)
      'heartbeat_low': 'audio/combat/heartbeat_low.mp3', // Joue en boucle quand stress élevé
      'wind_dark': 'audio/combat/wind_dark.mp3', // Ambiance lugubre
    };
    
    // Create Audio elements
    for (const [key, path] of Object.entries(soundPaths)) {
      try {
        const audio = new Audio();
        audio.preload = 'auto';
        audio.volume = this.sfxVolume;
        
        // Try to load, but don't fail if file doesn't exist
        audio.addEventListener('canplaythrough', () => {
          console.log(`✅ Loaded: ${key}`);
        }, { once: true });
        
        audio.addEventListener('error', () => {
          console.warn(`⚠️ Could not load: ${key} (${path})`);
        }, { once: true });
        
        audio.src = path;
        this.sounds[key] = audio;
      } catch (e) {
        console.warn(`⚠️ Error loading ${key}:`, e);
      }
    }
    
    console.log(`📦 Loaded ${Object.keys(this.sounds).length} sound definitions`);
  }
  
  // ═══════════════════════════════════════════════════════
  // 🎵 MUSIC MANAGEMENT
  // ═══════════════════════════════════════════════════════
  
  playMusic(track = 'combat') {
    console.log('🎵 Playing music:', track);
    
    // Stop current music
    if (this.music) {
      this.music.pause();
      this.music.currentTime = 0;
    }
    
    // Music paths
    const musicPaths = {
      'combat': 'audio/music/combat_theme.mp3',
      'combat_boss': 'audio/music/combat_boss.mp3',
      'combat_intense': 'audio/music/combat_intense.mp3',
    };
    
    try {
      this.music = new Audio(musicPaths[track] || musicPaths.combat);
      this.music.loop = true;
      this.music.volume = this.musicVolume;
      
      const playPromise = this.music.play();
      if (playPromise) {
        playPromise.catch(e => {
          console.warn('⚠️ Music autoplay prevented:', e);
        });
      }
      
      this.currentMusic = track;
    } catch (e) {
      console.warn('⚠️ Could not play music:', e);
    }
  }
  
  stopMusic() {
    if (this.music) {
      this.music.pause();
      this.music.currentTime = 0;
      this.currentMusic = null;
    }
  }
  
  fadeMusicOut(duration = 1000) {
    if (!this.music) return;
    
    const startVolume = this.music.volume;
    const step = startVolume / (duration / 50);
    
    const fadeInterval = setInterval(() => {
      if (this.music.volume > step) {
        this.music.volume -= step;
      } else {
        this.music.volume = 0;
        this.stopMusic();
        clearInterval(fadeInterval);
      }
    }, 50);
  }
  
  // ═══════════════════════════════════════════════════════
  // 🔊 SOUND PLAYBACK
  // ═══════════════════════════════════════════════════════
  
  play(soundKey, options = {}) {
    if (this.muted) return;
    if (!this.sounds[soundKey]) {
      console.warn(`⚠️ Sound not found: ${soundKey}`);
      return;
    }
    
    try {
      const sound = this.sounds[soundKey];
      
      // Clone for overlapping sounds
      const clone = sound.cloneNode();
      clone.volume = (options.volume !== undefined ? options.volume : this.sfxVolume) * this.masterVolume;
      
      const playPromise = clone.play();
      if (playPromise) {
        playPromise.catch(e => {
          // Autoplay prevented, but don't spam console
        });
      }
      
      // Clean up after play
      clone.addEventListener('ended', () => {
        clone.remove();
      });
      
      return clone;
    } catch (e) {
      console.warn(`⚠️ Error playing ${soundKey}:`, e);
    }
  }
  
  // ═══════════════════════════════════════════════════════
  // 🎯 HIGH-LEVEL GAMEPLAY SOUNDS
  // ═══════════════════════════════════════════════════════
  
  // === TURN START - WAR DRUM (Signal majeur) ===
  playTurnStart() {
    console.log('🥁 Playing turn start (war drum)');
    this.play('turn_start', { volume: 0.9 });
  }
  
  // === ACTION SELECTION ===
  playActionSelect() {
    this.play('action_select', { volume: 0.4 });
  }
  
  // === ACTION VALIDATION ===
  playActionValidate() {
    this.play('action_validate', { volume: 0.6 });
  }
  
  // === DICE ROLL - 3 PARTS ===
  async playDiceRoll(result) {
    console.log('🎲 Playing dice roll sequence');
    
    // 1. Anticipation
    this.play('dice_anticipation');
    await this.delay(300);
    
    // 2. Roll
    this.play('dice_roll');
    await this.delay(800);
    
    // 3. Result (based on value)
    if (result >= 10) {
      this.play('dice_result_critical', { volume: 0.9 });
    } else if (result >= 7) {
      this.play('dice_result_high');
    } else if (result >= 4) {
      this.play('dice_result_mid');
    } else {
      this.play('dice_result_low');
    }
  }
  
  // === DAMAGE ===
  playDamage(amount, isCritical = false) {
    if (isCritical) {
      this.play('damage_critical', { volume: 0.9 });
    } else if (amount >= 30) {
      this.play('damage_heavy', { volume: 0.8 });
    } else if (amount >= 15) {
      this.play('damage_medium', { volume: 0.7 });
    } else {
      this.play('damage_light', { volume: 0.6 });
    }
  }
  
  // === SPELL ===
  playSpellCast() {
    this.play('spell_cast');
  }
  
  playSpellImpact() {
    this.play('spell_impact', { volume: 0.8 });
  }
  
  // === DEFENSE ===
  playDefend() {
    this.play('defend', { volume: 0.7 });
  }
  
  playBlock() {
    this.play('block', { volume: 0.8 });
  }
  
  // === ITEM ===
  playItemUse() {
    this.play('item_use', { volume: 0.6 });
  }
  
  playHeal() {
    this.play('heal', { volume: 0.7 });
  }
  
  // === STRESS & CORRUPTION (Darkest Dungeon) ===
  playStressIncrease() {
    this.play('stress_increase', { volume: 0.5 });
  }
  
  playStressDecrease() {
    this.play('stress_decrease', { volume: 0.5 });
  }
  
  playCorruptionIncrease() {
    this.play('corruption_increase', { volume: 0.6 });
  }
  
  // === DEATH ===
  playEnemyDeath() {
    this.play('enemy_death', { volume: 0.8 });
  }
  
  playAllyDeath() {
    this.play('ally_death', { volume: 0.9 });
  }
  
  // === COMBAT END ===
  playVictory() {
    console.log('🎉 Playing victory sound');
    this.play('victory', { volume: 0.8 });
  }
  
  playDefeat() {
    console.log('💀 Playing defeat sound');
    this.play('defeat', { volume: 0.9 });
  }
  
  // === UI ===
  playHover() {
    this.play('hover', { volume: 0.3 });
  }
  
  playCancel() {
    this.play('cancel', { volume: 0.5 });
  }
  
  // === AMBIANCE (Darkest Dungeon style) ===
  playHeartbeat() {
    if (!this.sounds.heartbeat_low) return;
    
    const heartbeat = this.sounds.heartbeat_low.cloneNode();
    heartbeat.loop = true;
    heartbeat.volume = 0.3;
    heartbeat.play().catch(() => {});
    
    return heartbeat; // Return so it can be stopped later
  }
  
  playWindAmbiance() {
    if (!this.sounds.wind_dark) return;
    
    const wind = this.sounds.wind_dark.cloneNode();
    wind.loop = true;
    wind.volume = 0.2;
    wind.play().catch(() => {});
    
    return wind;
  }
  
  // ═══════════════════════════════════════════════════════
  // 🎛️ VOLUME CONTROL
  // ═══════════════════════════════════════════════════════
  
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    console.log('🔊 Master volume:', this.masterVolume);
  }
  
  setSFXVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    console.log('🔊 SFX volume:', this.sfxVolume);
  }
  
  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.music) {
      this.music.volume = this.musicVolume;
    }
    console.log('🔊 Music volume:', this.musicVolume);
  }
  
  toggleMute() {
    this.muted = !this.muted;
    
    if (this.muted) {
      if (this.music) this.music.volume = 0;
      console.log('🔇 Audio muted');
    } else {
      if (this.music) this.music.volume = this.musicVolume;
      console.log('🔊 Audio unmuted');
    }
    
    return this.muted;
  }
  
  // ═══════════════════════════════════════════════════════
  // 🛠️ UTILITIES
  // ═══════════════════════════════════════════════════════
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  cleanup() {
    console.log('🧹 Cleaning up Combat Audio System');
    
    // Stop all sounds
    for (const sound of Object.values(this.sounds)) {
      sound.pause();
      sound.currentTime = 0;
    }
    
    // Stop music
    this.stopMusic();
    
    // Close audio context
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }
}

// ═══════════════════════════════════════════════════════
// 📤 EXPORT
// ═══════════════════════════════════════════════════════

console.log('🎵 Combat Audio System loaded');