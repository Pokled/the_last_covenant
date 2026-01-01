/**
 * 🔊 AUDIO MANAGER - Gestion des sons et musiques
 * Ambiance immersive avec sons adaptatifs
 */

export class AudioManager {
    constructor() {
        this.context = null;
        this.masterVolume = 0.7;
        this.musicVolume = 0.5;
        this.sfxVolume = 0.8;
        
        this.currentMusic = null;
        this.sounds = {};
        this.audioElements = {}; // Pour les sons HTML5
        this.initialized = false;
        
        // Synthèse vocale pour Thalys
        this.speechSynth = window.speechSynthesis;
        
        // Init audio après interaction utilisateur
        this.initOnUserGesture();
    }
    
    initOnUserGesture() {
        const initAudio = () => {
            if (this.initialized) return;
            
            try {
                this.context = new (window.AudioContext || window.webkitAudioContext)();
                this.initialized = true;
                console.log('✅ AudioContext initialisé');
            } catch (e) {
                console.warn('Web Audio API not supported');
            }
            
            // Remove listeners après init
            document.removeEventListener('click', initAudio);
            document.removeEventListener('keydown', initAudio);
        };
        
        document.addEventListener('click', initAudio, { once: true });
        document.addEventListener('keydown', initAudio, { once: true });
    }
    
    /**
     * Ajoute un son depuis une URL (Freesound, etc.)
     */
    addSound(name, url, loop = false) {
        const audio = new Audio(url);
        audio.loop = loop;
        audio.volume = this.sfxVolume * this.masterVolume;
        audio.preload = 'auto';
        audio.crossOrigin = 'anonymous'; // Fix CORS
        this.audioElements[name] = audio;
    }
    
    /**
     * Joue un son chargé
     */
    playSound(name, loop = false) {
        if (!this.initialized) return; // Attend init
        
        const audio = this.audioElements[name];
        if (!audio) return;
        
        audio.loop = loop;
        audio.currentTime = 0;
        audio.play().catch(e => {}); // Silent fail
    }
    
    /**
     * Arrête un son
     */
    stopSound(name) {
        const audio = this.audioElements[name];
        if (!audio) return;
        
        audio.pause();
        audio.currentTime = 0;
    }
    
    /**
     * Joue un son synthétisé (pas besoin de fichiers audio)
     */
    playSFX(type) {
        if (!this.context || !this.initialized) return;
        
        const now = this.context.currentTime;
        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);
        
        gainNode.gain.setValueAtTime(this.sfxVolume * this.masterVolume, now);
        
        switch(type) {
            case 'step':
                // Son de pas (bruit court)
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(80, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                oscillator.start(now);
                oscillator.stop(now + 0.1);
                break;
                
            case 'treasure':
                // Trésor trouvé (ding brillant)
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(880, now);
                oscillator.frequency.exponentialRampToValueAtTime(1760, now + 0.2);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                oscillator.start(now);
                oscillator.stop(now + 0.3);
                break;
                
            case 'combat':
                // Alerte combat (swoosh menaçant)
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(200, now);
                oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.5);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
                oscillator.start(now);
                oscillator.stop(now + 0.5);
                break;
                
            case 'cage':
                // Cage mystérieuse (note grave inquiétante)
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(110, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1.0);
                oscillator.start(now);
                oscillator.stop(now + 1.0);
                break;
                
            case 'merchant':
                // Marchand (petit bip joyeux)
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(523, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                oscillator.start(now);
                oscillator.stop(now + 0.15);
                break;
                
            case 'rest':
                // Feu de camp (crépitement)
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(150 + Math.random() * 100, now);
                gainNode.gain.setValueAtTime(0.3 * this.sfxVolume, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                oscillator.start(now);
                oscillator.stop(now + 0.2);
                break;
                
            case 'boss':
                // Boss apparition (grondement)
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(40, now);
                oscillator.frequency.exponentialRampToValueAtTime(30, now + 1.5);
                gainNode.gain.setValueAtTime(this.sfxVolume * 0.8, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
                oscillator.start(now);
                oscillator.stop(now + 1.5);
                break;
                
            case 'ui_hover':
                // Hover UI
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(600, now);
                gainNode.gain.setValueAtTime(0.1 * this.sfxVolume, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                oscillator.start(now);
                oscillator.stop(now + 0.05);
                break;
                
            case 'ui_click':
                // Clic UI
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(300, now);
                gainNode.gain.setValueAtTime(0.2 * this.sfxVolume, now);
                gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
                oscillator.start(now);
                oscillator.stop(now + 0.08);
                break;
        }
    }
    
    /**
     * Fait parler Thalys (voix synthétique)
     */
    thalysWhisper(text) {
        if (!this.speechSynth) return;
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 0.7;  // Voix grave
        utterance.rate = 0.8;   // Lent
        utterance.volume = this.masterVolume * 0.6;
        utterance.lang = 'fr-FR';
        
        this.speechSynth.speak(utterance);
    }
    
    /**
     * Joue une musique d'ambiance (générative)
     */
    playAmbientMusic(zone = 'dungeon') {
        if (!this.context) return;
        
        // TODO: Implémenter musique générative basique
        // Pour l'instant, on laisse le silence oppressant du donjon
        console.log(`🎵 Ambiance: ${zone}`);
    }
    
    /**
     * Arrête tous les sons
     */
    stopAll() {
        if (this.speechSynth) {
            this.speechSynth.cancel();
        }
    }
}
