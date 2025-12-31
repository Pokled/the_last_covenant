/**
 * SoundManager - Gestion audio AAA
 * @description Sounds hover/click + ambiance
 */

export class SoundManager {
    constructor() {
        this.context = null;
        this.sounds = new Map();
        this.musicVolume = 0.7;
        this.sfxVolume = 0.8;
        this.currentMusic = null;
        
        this.init();
    }

    async init() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            console.log('🔊 SoundManager initialized');
        } catch (error) {
            console.warn('Audio context not available:', error);
        }
    }

    /**
     * Jouer un son de hover (synthétique)
     */
    playHover() {
        if (!this.context) return;
        
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, this.context.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.sfxVolume * 0.05, this.context.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);
        
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.1);
    }

    /**
     * Jouer un son de click (synthétique)
     */
    playClick() {
        if (!this.context) return;
        
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        oscillator.frequency.value = 400;
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0, this.context.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.sfxVolume * 0.1, this.context.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.05);
        
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.05);
    }

    /**
     * Son de succès (validation)
     */
    playSuccess() {
        if (!this.context) return;
        
        const osc1 = this.context.createOscillator();
        const osc2 = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        osc1.frequency.value = 523.25; // C5
        osc2.frequency.value = 659.25; // E5
        osc1.type = 'sine';
        osc2.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, this.context.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.sfxVolume * 0.15, this.context.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.3);
        
        osc1.start(this.context.currentTime);
        osc2.start(this.context.currentTime);
        osc1.stop(this.context.currentTime + 0.3);
        osc2.stop(this.context.currentTime + 0.3);
    }

    /**
     * Son de corruption (sinistre)
     */
    playCorruption() {
        if (!this.context) return;
        
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        oscillator.frequency.setValueAtTime(200, this.context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.context.currentTime + 0.5);
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(0, this.context.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.sfxVolume * 0.2, this.context.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.5);
        
        oscillator.start(this.context.currentTime);
        oscillator.stop(this.context.currentTime + 0.5);
    }

    /**
     * Jouer musique d'ambiance (placeholder)
     */
    playMusic(type = 'menu') {
        // TODO: Charger vraies musiques
        console.log(`🎵 Playing ${type} music`);
    }

    /**
     * Arrêter la musique
     */
    stopMusic() {
        if (this.currentMusic) {
            // TODO: Stop audio
            this.currentMusic = null;
        }
    }

    /**
     * Définir volumes
     */
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
    }

    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }
}
