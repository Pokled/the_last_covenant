/**
 * 🔊 BASIC SOUND SYSTEM
 * 
 * Joue des sons via Web Audio API
 * Sons générés procéduralement
 */

export class BasicSoundSystem {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        
        // Lazy init
        this.init();
    }
    
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('🔊 AudioContext créé');
        } catch (e) {
            console.warn('🔇 Audio non disponible');
            this.enabled = false;
        }
    }
    
    /**
     * Joue un son simple
     */
    playSound(type) {
        if (!this.enabled || !this.audioContext) return;
        
        // Resume context si nécessaire (Chrome autoplay policy)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        const sounds = {
            warDrum: () => this.warDrum(),
            swordDraw: () => this.swordDraw(),
            enemyRoar: () => this.enemyRoar(),
            turnStart: () => this.turnStart(),
            hit: () => this.hit(),
            miss: () => this.miss(),
            // 🔥 COMBAT SONS
            impact: () => this.impact(),
            criticalHit: () => this.criticalHit(),
            swoosh: () => this.swoosh(),
            killBlow: () => this.killBlow(),
            // 🔥 NOUVEAUX
            enemyAttack: () => this.enemyAttack(),
            footsteps: () => this.footsteps()
        };
        
        if (sounds[type]) {
            sounds[type]();
        }
    }
    
    /**
     * Tambour de guerre (basse fréquence)
     */
    warDrum() {
        const now = this.audioContext.currentTime;
        
        // Oscillateur basse fréquence
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(60, now); // Basse
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
        
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.start(now);
        osc.stop(now + 0.8);
    }
    
    /**
     * Dégainer épée (métallique)
     */
    swordDraw() {
        const now = this.audioContext.currentTime;
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.2);
        
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.start(now);
        osc.stop(now + 0.2);
    }
    
    /**
     * Cri ennemi (grave + distorsion)
     */
    enemyRoar() {
        const now = this.audioContext.currentTime;
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.linearRampToValueAtTime(150, now + 0.3);
        
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.start(now);
        osc.stop(now + 0.5);
    }
    
    /**
     * Début de tour (cloche)
     */
    turnStart() {
        const now = this.audioContext.currentTime;
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now); // A5
        
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.start(now);
        osc.stop(now + 0.5);
    }
    
    /**
     * Coup réussi (impact)
     */
    hit() {
        const now = this.audioContext.currentTime;
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
        
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.start(now);
        osc.stop(now + 0.15);
    }
    
    /**
     * Raté (swoosh)
     */
    miss() {
        const now = this.audioContext.currentTime;
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.linearRampToValueAtTime(200, now + 0.15);
        
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        
        osc.start(now);
        osc.stop(now + 0.15);
    }
    
    // ═══════════════════════════════════════════════════════
    // 🔥 NOUVEAUX SONS DE COMBAT
    // ═══════════════════════════════════════════════════════
    
    /**
     * Impact fracassant ("BRAAAAmmmm" - résonne dans les os !)
     */
    impact() {
        const now = this.audioContext.currentTime;
        
        // 1. EXPLOSION INITIALE ("BRAAAA")
        const explosion = this.audioContext.createOscillator();
        const explosionGain = this.audioContext.createGain();
        
        explosion.type = 'sawtooth'; // Son riche en harmoniques
        explosion.frequency.setValueAtTime(250, now);
        explosion.frequency.exponentialRampToValueAtTime(80, now + 0.08); // Chute rapide
        
        explosionGain.gain.setValueAtTime(0.7, now); // FORT !
        explosionGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        explosion.connect(explosionGain);
        explosionGain.connect(this.audioContext.destination);
        explosion.start(now);
        explosion.stop(now + 0.1);
        
        // 2. RÉSONANCE GRAVE ("mmmm" qui vibre)
        const rumble = this.audioContext.createOscillator();
        const rumbleGain = this.audioContext.createGain();
        
        rumble.type = 'sine';
        rumble.frequency.setValueAtTime(60, now);
        rumble.frequency.exponentialRampToValueAtTime(30, now + 0.3); // Très grave
        
        rumbleGain.gain.setValueAtTime(0.5, now + 0.02);
        rumbleGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35); // Longue résonance
        
        rumble.connect(rumbleGain);
        rumbleGain.connect(this.audioContext.destination);
        rumble.start(now + 0.02);
        rumble.stop(now + 0.35);
        
        // 3. HARMONIQUE MÉTALLIQUE (résonance d'armure)
        const metal = this.audioContext.createOscillator();
        const metalGain = this.audioContext.createGain();
        
        metal.type = 'sine';
        metal.frequency.setValueAtTime(1800, now);
        metal.frequency.exponentialRampToValueAtTime(1200, now + 0.2);
        
        metalGain.gain.setValueAtTime(0.3, now);
        metalGain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        
        metal.connect(metalGain);
        metalGain.connect(this.audioContext.destination);
        metal.start(now);
        metal.stop(now + 0.25);
        
        // 4. CRAQUEMENT/FRACAS (noise burst)
        const bufferSize = this.audioContext.sampleRate * 0.08;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            const decay = Math.exp(-i / (bufferSize * 0.2));
            data[i] = (Math.random() * 2 - 1) * decay;
        }
        
        const crack = this.audioContext.createBufferSource();
        crack.buffer = buffer;
        
        const crackFilter = this.audioContext.createBiquadFilter();
        crackFilter.type = 'lowpass';
        crackFilter.frequency.setValueAtTime(800, now);
        
        const crackGain = this.audioContext.createGain();
        crackGain.gain.setValueAtTime(0.5, now);
        crackGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        
        crack.connect(crackFilter);
        crackFilter.connect(crackGain);
        crackGain.connect(this.audioContext.destination);
        crack.start(now);
        
        console.log('💥 "BRAAAAmmmm" son joué !');
    }
    
    /**
     * Coup critique (plus aigu + réverbération)
     */
    criticalHit() {
        const now = this.audioContext.currentTime;
        
        // Double oscillateur pour son "cristallin"
        for (let i = 0; i < 2; i++) {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800 + i * 200, now);
            osc.frequency.exponentialRampToValueAtTime(200 + i * 50, now + 0.3);
            
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            
            osc.start(now + i * 0.02);
            osc.stop(now + 0.3);
        }
        
        // Impact noise
        this.impact();
    }
    
    /**
     * Swoosh d'arme (AIR DÉCHIRÉ - "SHHHHHHH" réaliste !)
     */
    swoosh() {
        const now = this.audioContext.currentTime;
        
        // 1. GROGNEMENT D'EFFORT ("OHaaaahh!")
        const grunt = this.audioContext.createOscillator();
        const gruntGain = this.audioContext.createGain();
        
        grunt.type = 'sawtooth'; // Voix gutturale
        grunt.frequency.setValueAtTime(180, now); // Voix grave
        grunt.frequency.linearRampToValueAtTime(140, now + 0.08); // Descend (effort)
        
        gruntGain.gain.setValueAtTime(0, now);
        gruntGain.gain.linearRampToValueAtTime(0.15, now + 0.02); // Monte vite
        gruntGain.gain.linearRampToValueAtTime(0.25, now + 0.04); // Peak
        gruntGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        grunt.connect(gruntGain);
        gruntGain.connect(this.audioContext.destination);
        grunt.start(now);
        grunt.stop(now + 0.1);
        
        // 2. AIR DÉCHIRÉ ("SHHHHHHH" - bruit blanc filtré)
        const bufferSize = this.audioContext.sampleRate * 0.12;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Noise avec crescendo rapide puis décroissance
        for (let i = 0; i < bufferSize; i++) {
            const progress = i / bufferSize;
            let envelope;
            if (progress < 0.2) {
                envelope = progress / 0.2; // Monte rapide
            } else {
                envelope = Math.pow(1 - ((progress - 0.2) / 0.8), 2); // Descend smooth
            }
            data[i] = (Math.random() * 2 - 1) * envelope * 0.8;
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        
        // Filtre pour effet "SHHH"
        const bandpass = this.audioContext.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.setValueAtTime(2500, now);
        bandpass.frequency.linearRampToValueAtTime(4000, now + 0.08); // Monte
        bandpass.Q.value = 2; // Assez étroit
        
        const airGain = this.audioContext.createGain();
        airGain.gain.setValueAtTime(0.4, now + 0.02); // Démarre après le grognement
        airGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
        
        noise.connect(bandpass);
        bandpass.connect(airGain);
        airGain.connect(this.audioContext.destination);
        
        noise.start(now + 0.02);
        
        console.log('💨 "OHaaaahh-SHHHHH" son joué !');
    }
    
    /**
     * Coup mortel (dramatique)
     */
    killBlow() {
        const now = this.audioContext.currentTime;
        
        // Impact lourd
        const osc1 = this.audioContext.createOscillator();
        const gain1 = this.audioContext.createGain();
        
        osc1.type = 'square';
        osc1.frequency.setValueAtTime(150, now);
        osc1.frequency.exponentialRampToValueAtTime(30, now + 0.4);
        
        gain1.gain.setValueAtTime(0.6, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        
        osc1.connect(gain1);
        gain1.connect(this.audioContext.destination);
        
        osc1.start(now);
        osc1.stop(now + 0.4);
        
        // Noise burst
        setTimeout(() => this.impact(), 50);
    }
    
    /**
     * 😈 Attaque ennemie (grognement + impact)
     */
    enemyAttack() {
        const now = this.audioContext.currentTime;
        
        // Grognement bestial (plus grave que joueur)
        const growl = this.audioContext.createOscillator();
        const growlGain = this.audioContext.createGain();
        
        growl.type = 'sawtooth';
        growl.frequency.setValueAtTime(120, now); // Plus grave
        growl.frequency.linearRampToValueAtTime(90, now + 0.12);
        
        growlGain.gain.setValueAtTime(0.25, now);
        growlGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        
        growl.connect(growlGain);
        growlGain.connect(this.audioContext.destination);
        growl.start(now);
        growl.stop(now + 0.15);
        
        // Impact après 100ms
        setTimeout(() => this.impact(), 100);
        
        console.log('😈 Attaque ennemie !');
    }
    
    /**
     * 👣 Pas rapides (déplacement)
     */
    footsteps() {
        const now = this.audioContext.currentTime;
        
        // 4 pas rapides
        for (let i = 0; i < 4; i++) {
            const stepTime = now + (i * 0.08);
            
            // Thump grave (pied qui frappe)
            const step = this.audioContext.createOscillator();
            const stepGain = this.audioContext.createGain();
            
            step.type = 'sine';
            step.frequency.setValueAtTime(100, stepTime);
            step.frequency.exponentialRampToValueAtTime(50, stepTime + 0.04);
            
            stepGain.gain.setValueAtTime(0.2, stepTime);
            stepGain.gain.exponentialRampToValueAtTime(0.01, stepTime + 0.05);
            
            step.connect(stepGain);
            stepGain.connect(this.audioContext.destination);
            step.start(stepTime);
            step.stop(stepTime + 0.05);
            
            // Noise du frottement
            const bufferSize = this.audioContext.sampleRate * 0.03;
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let j = 0; j < bufferSize; j++) {
                data[j] = (Math.random() * 2 - 1) * Math.exp(-j / (bufferSize * 0.5));
            }
            
            const noise = this.audioContext.createBufferSource();
            noise.buffer = buffer;
            
            const noiseFilter = this.audioContext.createBiquadFilter();
            noiseFilter.type = 'lowpass';
            noiseFilter.frequency.value = 400;
            
            const noiseGain = this.audioContext.createGain();
            noiseGain.gain.value = 0.15;
            
            noise.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(this.audioContext.destination);
            noise.start(stepTime);
        }
        
        console.log('👣 Pas rapides !');
    }
}
