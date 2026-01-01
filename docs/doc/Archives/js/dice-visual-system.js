/**
 * DICE VISUAL SYSTEM - Canvas Particles
 * THE LAST COVENANT
 *
 * Système de particules optimisé pour explosions visuelles
 * - 10 000 particules max
 * - Rendering à 60 FPS
 * - Effets selon stade du Dé
 */

class DiceVisualSystem {
  constructor(diceCore) {
    this.dice = diceCore;

    // ═══════════════════════════════════════════════════════
    // CANVAS SETUP
    // ═══════════════════════════════════════════════════════
    this.canvas = null;
    this.ctx = null;
    this.width = 0;
    this.height = 0;

    // ═══════════════════════════════════════════════════════
    // PARTICULES
    // ═══════════════════════════════════════════════════════
    this.particles = [];
    this.maxParticles = 10000;
    this.particlePool = []; // Pool pour réutilisation

    // ═══════════════════════════════════════════════════════
    // ANIMATION STATE
    // ═══════════════════════════════════════════════════════
    this.isAnimating = false;
    this.animationId = null;
    this.lastFrameTime = 0;

    // ═══════════════════════════════════════════════════════
    // AUDIO SYSTEM 🔊 - Sons lugubres procéduraux
    // ═══════════════════════════════════════════════════════
    this.audioContext = null;
    this.masterGain = null;
    this.initAudio();

    // ═══════════════════════════════════════════════════════
    // INITIALISATION
    // ═══════════════════════════════════════════════════════
    this.init();
  }

  /**
   * Initialise le système audio
   */
  initAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 0.3; // Volume global
      this.masterGain.connect(this.audioContext.destination);
      console.log('🔊 Système audio initialisé');
    } catch (e) {
      console.warn('⚠️ Audio non supporté:', e);
    }
  }

  /**
   * Initialise le Canvas
   */
  init() {
    // Créer canvas
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'dice-particles-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.zIndex = '9998'; // Sous l'overlay (9999)
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.opacity = '0';
    this.canvas.style.transition = 'opacity 0.3s';

    document.body.appendChild(this.canvas);

    // Setup context
    this.ctx = this.canvas.getContext('2d');
    this.resize();

    // Resize listener
    window.addEventListener('resize', () => this.resize());

    // Démarrer loop de rendu
    this.startRenderLoop();

    console.log('✅ DiceVisualSystem initialisé');
  }

  /**
   * Resize canvas pour fit l'écran
   */
  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  // ═══════════════════════════════════════════════════════
  // ANIMATION PRINCIPALE
  // ═══════════════════════════════════════════════════════

  /**
   * Animation complète SPECTACULAIRE (3s)
   * @param {number} result - Résultat du lancer
   */
  async playFullAnimation(result) {
    console.log('🎨 Animation visuelle SPECTACULAIRE - Résultat:', result);

    // Afficher canvas
    this.canvas.style.opacity = '1';
    this.isAnimating = true;

    // Phase 1 : Explosion initiale + Build-up (0.5s)
    await this.explosiveStart();

    // Phase 2 : Vortex de particules (1s)
    await this.particleVortex();

    // Phase 3 : MEGA Explosion résultat (1s)
    await this.megaExplosion(result);

    // Phase 4 : Étoiles qui tombent (0.5s)
    await this.fallingStars();

    this.isAnimating = false;
    this.canvas.style.opacity = '0';

    console.log('✅ Animation visuelle terminée');
  }

  /**
   * Phase 1 : Explosion initiale MASSIVE (LUGUBRE 💀)
   */
  async explosiveStart() {
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    // 🔊 SON : Grondement sourd + Impact violent
    this.playRumble(0.5);
    this.playImpact();

    // MEGA explosion radiale LUGUBRE (2000 particules de SANG et BOUE !)
    for (let i = 0; i < 2000; i++) {
      const angle = (Math.PI * 2 * i) / 2000;
      const speed = 300 + Math.random() * 500;
      // Couleurs LUGUBRES : Sang, Boue, Cendres, Noir
      const colors = [
        '#8B0000', // Rouge sang foncé
        '#DC143C', // Cramoisi
        '#6B0000', // Sang séché
        '#4a3020', // Boue brune
        '#2d1410', // Terre sombre
        '#444',    // Cendres
        '#222'     // Fumée noire
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];

      this.spawnParticle({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: color,
        lifetime: 800,
        size: 3 + Math.random() * 4
      });
    }

    // Flash ROUGE SANG (pas blanc !)
    this.flash('#8B0000', 0.15);
    // Screen shake VIOLENT
    this.screenShake(20, 400);

    await this.sleep(500);
  }

  /**
   * Phase 2 : VORTEX de particules (spirale LUGUBRE)
   */
  async particleVortex() {
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const duration = 1000;
    const startTime = Date.now();

    // 🔊 SON : Sifflement sinistre qui monte
    this.playWhisper(duration);

    // Vortex spiral continu LUGUBRE
    const vortexInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      // Spirale qui se resserre vers le centre
      for (let i = 0; i < 10; i++) {
        const angle = progress * Math.PI * 8 + (i / 10) * Math.PI * 2;
        const distance = 300 * (1 - progress) + Math.random() * 50;

        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;

        // Vélocité vers le centre
        const toCenter = {
          x: (centerX - x) * 2,
          y: (centerY - y) * 2
        };

        // Couleurs LUGUBRES : Sang coagulé, Boue, Cendres
        const colors = [
          '#6B0000', // Sang séché
          '#8B0000', // Sang foncé
          '#3a2010', // Boue sombre
          '#333',    // Cendres grises
          '#1a0a05'  // Terre noire
        ];
        this.spawnParticle({
          x: x,
          y: y,
          vx: toCenter.x + (Math.random() - 0.5) * 100,
          vy: toCenter.y + (Math.random() - 0.5) * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          lifetime: 1000,
          size: 2 + Math.random() * 3
        });
      }
    }, 30);

    await this.sleep(duration);
    clearInterval(vortexInterval);
  }

  /**
   * Phase 3 : MEGA EXPLOSION résultat (LUGUBRE 💀🔥)
   */
  async megaExplosion(result) {
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    // Couleur LUGUBRE selon résultat
    const isCritical = result === 6 || result === 1;
    let mainColor, secondaryColors;

    if (result === 6) {
      // Critique SUCCESS : Sang frais écarlate
      mainColor = '#DC143C'; // Cramoisi sang frais
      secondaryColors = ['#8B0000', '#B22222', '#A52A2A']; // Sang foncé, brique
      this.flash('#DC143C', 0.25); // Flash ROUGE SANG
      // 🔊 SON : Craquement d'os + Explosion
      this.playCrackle();
      this.playExplosion();
    } else if (result === 1) {
      // Critique FAIL : Sang coagulé + boue
      mainColor = '#6B0000'; // Sang séché noir
      secondaryColors = ['#4A0000', '#2d1410', '#1a0a05']; // Sang pourri, boue
      this.flash('#4A0000', 0.25); // Flash SANG NOIR
      // 🔊 SON : Grondement + Craquement sinistre
      this.playRumble(0.8);
      this.playCrackle();
    } else {
      // Normal : Cendres et boue
      mainColor = '#4a3020'; // Boue brune
      secondaryColors = ['#3a2010', '#2d1410', '#555']; // Terre, cendres
      // 🔊 SON : Impact sourd
      this.playThud();
    }

    // MÉGA Screen shake si critique (PLUS VIOLENT)
    if (isCritical) {
      this.screenShake(30, 800); // Encore plus violent !
    }

    // Vagues d'explosion successives LUGUBRES
    for (let wave = 0; wave < 3; wave++) {
      const particleCount = isCritical ? 1500 : 800;
      const waveDelay = wave * 150;

      setTimeout(() => {
        // Explosion radiale de SANG et BOUE
        for (let i = 0; i < particleCount; i++) {
          const angle = (Math.PI * 2 * i) / particleCount;
          const speed = 400 + Math.random() * 600 + (wave * 100);
          const color = Math.random() < 0.7 ? mainColor : secondaryColors[Math.floor(Math.random() * secondaryColors.length)];

          this.spawnParticle({
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: color,
            lifetime: 1200 - (wave * 200),
            size: (isCritical ? 5 : 3) + Math.random() * 4
          });
        }

        // Ripple LUGUBRE à chaque vague
        this.spawnRipple(centerX, centerY, mainColor);
      }, waveDelay);
    }

    await this.sleep(1000);
  }

  /**
   * Phase 4 : Débris sanglants qui tombent (finale LUGUBRE 💀)
   */
  async fallingStars() {
    // Couleurs LUGUBRES : Sang, Boue, Cendres
    const colors = [
      '#8B0000', // Sang
      '#6B0000', // Sang séché
      '#4a3020', // Boue
      '#333',    // Cendres
      '#222'     // Fumée
    ];

    // Pluie de DÉBRIS SANGLANTS du haut vers le bas
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * this.width;
      const y = -50;
      const color = colors[Math.floor(Math.random() * colors.length)];

      setTimeout(() => {
        this.spawnParticle({
          x: x,
          y: y,
          vx: (Math.random() - 0.5) * 50,
          vy: 200 + Math.random() * 300,
          color: color,
          lifetime: 1500,
          size: 3 + Math.random() * 3
        });
      }, i * 5); // Décalage pour effet pluie
    }

    await this.sleep(500);
  }

  // ═══════════════════════════════════════════════════════
  // SYSTÈME DE PARTICULES
  // ═══════════════════════════════════════════════════════

  /**
   * Spawn une particule
   * @param {Object} config - Configuration {x, y, vx, vy, color, lifetime, size}
   */
  spawnParticle({x, y, vx, vy, color, lifetime, size}) {
    // Limiter le nombre de particules
    if (this.particles.length >= this.maxParticles) {
      this.particles.shift(); // Retirer la plus ancienne
    }

    const particle = {
      x: x,
      y: y,
      vx: vx,
      vy: vy,
      color: color,
      lifetime: lifetime,
      age: 0,
      size: size || 2,
      alpha: 1
    };

    this.particles.push(particle);
  }

  /**
   * Update toutes les particules
   * @param {number} deltaTime - Temps écoulé (en secondes)
   */
  updateParticles(deltaTime) {
    const gravity = 300; // pixels/s²

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      // Update position
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;

      // Appliquer gravité
      p.vy += gravity * deltaTime;

      // Update age
      p.age += deltaTime * 1000;

      // Calculer alpha (fade out progressif)
      p.alpha = Math.max(0, 1 - (p.age / p.lifetime));

      // Retirer si morte
      if (p.age >= p.lifetime) {
        this.particles.splice(i, 1);
      }
    }
  }

  /**
   * Render toutes les particules
   */
  renderParticles() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (const p of this.particles) {
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1;
  }

  // ═══════════════════════════════════════════════════════
  // RENDER LOOP
  // ═══════════════════════════════════════════════════════

  /**
   * Démarre la boucle de rendu (60 FPS)
   */
  startRenderLoop() {
    const render = (timestamp) => {
      // Calculer deltaTime
      const deltaTime = this.lastFrameTime
        ? (timestamp - this.lastFrameTime) / 1000
        : 1 / 60;
      this.lastFrameTime = timestamp;

      // Update + Render si particules actives
      if (this.particles.length > 0) {
        this.updateParticles(deltaTime);
        this.renderParticles();
      } else if (!this.isAnimating) {
        // Clear canvas si plus de particules
        this.ctx.clearRect(0, 0, this.width, this.height);
      }

      // Continue loop
      this.animationId = requestAnimationFrame(render);
    };

    render(0);
  }

  /**
   * Stop la boucle de rendu
   */
  stopRenderLoop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  // ═══════════════════════════════════════════════════════
  // EFFETS SPÉCIAUX
  // ═══════════════════════════════════════════════════════

  /**
   * Effet ripple (onde de choc)
   * @param {number} x - Position X
   * @param {number} y - Position Y
   * @param {string} color - Couleur
   */
  spawnRipple(x = this.width / 2, y = this.height / 2, color = '#FFD700') {
    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';
    ripple.style.top = y + 'px';
    ripple.style.left = x + 'px';
    ripple.style.borderColor = color;
    document.body.appendChild(ripple);

    setTimeout(() => {
      ripple.style.transform = 'translate(-50%, -50%) scale(20)';
      ripple.style.opacity = '0';
    }, 50);

    setTimeout(() => {
      document.body.removeChild(ripple);
    }, 1050);
  }

  /**
   * Screen shake
   * @param {number} intensity - Intensité (pixels)
   * @param {number} duration - Durée (ms)
   */
  screenShake(intensity = 10, duration = 500) {
    const el = document.body;
    const startTime = Date.now();

    const shake = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) {
        el.style.transform = 'translate(0, 0)';
        return;
      }

      const progress = elapsed / duration;
      const currentIntensity = intensity * (1 - progress);

      const x = (Math.random() - 0.5) * currentIntensity;
      const y = (Math.random() - 0.5) * currentIntensity;
      el.style.transform = `translate(${x}px, ${y}px)`;

      requestAnimationFrame(shake);
    };

    shake();
  }

  /**
   * Flash lumineux
   * @param {string} color - Couleur du flash
   * @param {number} duration - Durée (secondes)
   */
  flash(color = '#FFFFFF', duration = 0.3) {
    const flashEl = document.createElement('div');
    flashEl.className = 'dice-flash';
    flashEl.style.backgroundColor = color;
    document.body.appendChild(flashEl);

    setTimeout(() => {
      flashEl.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(flashEl);
      }, duration * 1000);
    }, 50);
  }

  // ═══════════════════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════════════════

  /**
   * Couleur selon stade du Dé
   */
  getStageColor() {
    if (!this.dice) {
      console.warn('⚠️ getStageColor: dice is null, returning white');
      return '#FFFFFF';
    }

    const stage = this.dice.stage || 1;
    const colors = {
      1: '#D3D3D3', // Gris
      2: '#FFD700', // Or
      3: '#DC143C', // Rouge sang
      4: '#9370DB', // Violet cosmique
      5: '#000000'  // Noir (chaos)
    };

    return colors[stage] || '#FFFFFF';
  }

  /**
   * Clear toutes les particules
   */
  clearParticles() {
    this.particles = [];
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  /**
   * Sleep helper
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ═══════════════════════════════════════════════════════
  // 🔊 SYSTÈME AUDIO - SONS PROCÉDURAUX LUGUBRES
  // ═══════════════════════════════════════════════════════

  /**
   * Grondement sourd (basse fréquence sinistre)
   * @param {number} duration - Durée en secondes
   */
  playRumble(duration = 0.5) {
    if (!this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    // Oscillateur basse fréquence (30-60 Hz)
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(30, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, this.audioContext.currentTime + duration);

    // Filtre passe-bas pour son sourd
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    filter.Q.value = 5;

    // Enveloppe de volume
    gain.gain.setValueAtTime(0, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, this.audioContext.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + duration);
  }

  /**
   * Impact violent (BOOM sourd)
   */
  playImpact() {
    if (!this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    // Basse fréquence percussive
    osc.type = 'sine';
    osc.frequency.setValueAtTime(100, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(20, this.audioContext.currentTime + 0.3);

    filter.type = 'lowpass';
    filter.frequency.value = 300;

    // Impact court et puissant
    gain.gain.setValueAtTime(0.6, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + 0.3);
  }

  /**
   * Sifflement sinistre qui monte (whispering)
   * @param {number} duration - Durée en ms
   */
  playWhisper(duration = 1000) {
    if (!this.audioContext) return;

    const durationSec = duration / 1000;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    // Fréquence qui monte progressivement (sinistre)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + durationSec);

    // Filtre résonant pour effet sifflant
    filter.type = 'bandpass';
    filter.frequency.value = 400;
    filter.Q.value = 10;

    // Volume qui monte doucement
    gain.gain.setValueAtTime(0, this.audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + durationSec * 0.3);
    gain.gain.linearRampToValueAtTime(0.15, this.audioContext.currentTime + durationSec * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + durationSec);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + durationSec);
  }

  /**
   * Craquement d'os (crackling)
   */
  playCrackle() {
    if (!this.audioContext) return;

    // Plusieurs craquements rapides
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const noise = this.audioContext.createBufferSource();
        const gain = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        // Créer du bruit blanc
        const bufferSize = this.audioContext.sampleRate * 0.05;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        for (let j = 0; j < bufferSize; j++) {
          data[j] = Math.random() * 2 - 1;
        }
        noise.buffer = buffer;

        // Filtre pour effet "craquant"
        filter.type = 'bandpass';
        filter.frequency.value = 2000 + Math.random() * 3000;
        filter.Q.value = 20;

        // Enveloppe percussive
        gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.05);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start(this.audioContext.currentTime);
        noise.stop(this.audioContext.currentTime + 0.05);
      }, i * 30); // Décalage entre craquements
    }
  }

  /**
   * Explosion (layered impact + noise)
   */
  playExplosion() {
    if (!this.audioContext) return;

    // Layer 1 : Impact basse fréquence
    const bass = this.audioContext.createOscillator();
    const bassGain = this.audioContext.createGain();
    bass.type = 'sine';
    bass.frequency.setValueAtTime(80, this.audioContext.currentTime);
    bass.frequency.exponentialRampToValueAtTime(20, this.audioContext.currentTime + 0.5);
    bassGain.gain.setValueAtTime(0.5, this.audioContext.currentTime);
    bassGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
    bass.connect(bassGain);
    bassGain.connect(this.masterGain);
    bass.start(this.audioContext.currentTime);
    bass.stop(this.audioContext.currentTime + 0.5);

    // Layer 2 : Bruit d'explosion
    const noise = this.audioContext.createBufferSource();
    const noiseGain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    const bufferSize = this.audioContext.sampleRate * 0.4;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    noise.buffer = buffer;

    filter.type = 'lowpass';
    filter.frequency.value = 800;

    noiseGain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    noise.start(this.audioContext.currentTime);
    noise.stop(this.audioContext.currentTime + 0.4);
  }

  /**
   * Impact sourd (thud)
   */
  playThud() {
    if (!this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(60, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.audioContext.currentTime + 0.2);

    filter.type = 'lowpass';
    filter.frequency.value = 150;

    gain.gain.setValueAtTime(0.4, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + 0.2);
  }

  /**
   * Destroy le système
   */
  destroy() {
    this.stopRenderLoop();
    this.clearParticles();
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    if (this.audioContext) {
      this.audioContext.close();
    }
    console.log('❌ DiceVisualSystem détruit');
  }
}

// ═══════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════

window.DiceVisualSystem = DiceVisualSystem;

console.log('🎨 DiceVisualSystem chargé');
