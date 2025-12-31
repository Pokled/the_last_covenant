/* ═══════════════════════════════════════════════════════
   ✨ PARTICLE SYSTEM - COIN-COIN DUNGEON
   Système de particules pour effets visuels AAA+
   ═══════════════════════════════════════════════════════ */

class ParticleSystem {
  constructor() {
    this.particles = [];
    this.canvas = null;
    this.ctx = null;
    this.animationFrame = null;
    this.isRunning = false;

    console.log('✨ Particle System initialized');
  }

  /* ═══════════════════════════════════════════════════════
     🎨 CANVAS SETUP
     ═══════════════════════════════════════════════════════ */

  createCanvas() {
    if (this.canvas) return this.canvas;

    this.canvas = document.createElement('canvas');
    this.canvas.id = 'particle-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '99999'; // Au-dessus de tout
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    // Resize handler
    window.addEventListener('resize', () => {
      if (this.canvas) {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      }
    });

    return this.canvas;
  }

  removeCanvas() {
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
      this.canvas = null;
      this.ctx = null;
    }
  }

  /* ═══════════════════════════════════════════════════════
     💥 CRÉATION DE PARTICULES
     ═══════════════════════════════════════════════════════ */

  createParticle(options) {
    const defaults = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      vx: 0,
      vy: 0,
      size: 4,
      color: '#FFD700',
      opacity: 1,
      lifetime: 1000,
      gravity: 0.5,
      friction: 0.98,
      shape: 'circle', // circle, square, star
      rotation: 0,
      rotationSpeed: 0
    };

    const particle = { ...defaults, ...options };
    particle.createdAt = Date.now();
    particle.initialOpacity = particle.opacity;

    this.particles.push(particle);
    return particle;
  }

  /* ═══════════════════════════════════════════════════════
     🎆 EFFETS PRÉFABRIQUÉS
     ═══════════════════════════════════════════════════════ */

  /**
   * Explosion de particules (pour item obtenu)
   */
  createExplosion(x, y, options = {}) {
    const {
      count = 50,
      color = '#FFD700',
      size = 6,
      speed = 8,
      lifetime = 1500
    } = options;

    this.createCanvas();

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const velocity = speed * (0.5 + Math.random() * 0.5);

      this.createParticle({
        x: x,
        y: y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        size: size * (0.5 + Math.random() * 0.5),
        color: color,
        lifetime: lifetime * (0.7 + Math.random() * 0.3),
        gravity: 0.3,
        friction: 0.95,
        shape: Math.random() > 0.5 ? 'circle' : 'star',
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2
      });
    }

    this.start();
  }

  /**
   * Pluie de pièces (pour loot gold)
   */
  createCoinRain(x, y, count = 20) {
    this.createCanvas();

    for (let i = 0; i < count; i++) {
      const offsetX = (Math.random() - 0.5) * 200;

      this.createParticle({
        x: x + offsetX,
        y: y - 100,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 2,
        size: 8 + Math.random() * 4,
        color: Math.random() > 0.3 ? '#FFD700' : '#FFA500',
        lifetime: 2000 + Math.random() * 1000,
        gravity: 0.6,
        friction: 0.98,
        shape: 'circle',
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3
      });
    }

    this.start();
  }

  /**
   * Étincelles (pour critical hit)
   */
  createSparkles(x, y, count = 15) {
    this.createCanvas();

    for (let i = 0; i < count; i++) {
      this.createParticle({
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3 - 2,
        size: 3 + Math.random() * 3,
        color: ['#FFD700', '#FFF', '#FFEB3B'][Math.floor(Math.random() * 3)],
        lifetime: 800 + Math.random() * 400,
        gravity: 0.1,
        friction: 0.95,
        shape: 'star'
      });
    }

    this.start();
  }

  /**
   * Fumée (pour mort d'ennemi)
   */
  createSmoke(x, y, count = 10, color = '#666') {
    this.createCanvas();

    for (let i = 0; i < count; i++) {
      this.createParticle({
        x: x + (Math.random() - 0.5) * 30,
        y: y,
        vx: (Math.random() - 0.5) * 2,
        vy: -(Math.random() * 3 + 2),
        size: 10 + Math.random() * 15,
        color: color,
        opacity: 0.6,
        lifetime: 1500 + Math.random() * 500,
        gravity: -0.05, // Monte
        friction: 0.97,
        shape: 'circle'
      });
    }

    this.start();
  }

  /**
   * Trail de mouvement (pour dash)
   */
  createTrail(x, y, color = '#FFD700') {
    this.createCanvas();

    for (let i = 0; i < 5; i++) {
      this.createParticle({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: 0,
        vy: 0,
        size: 8 - i,
        color: color,
        opacity: 0.8 - (i * 0.15),
        lifetime: 300,
        gravity: 0,
        friction: 1,
        shape: 'circle'
      });
    }

    this.start();
  }

  /**
   * Confetti (pour level up)
   */
  createConfetti(x, y, count = 30) {
    this.createCanvas();

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 5 + Math.random() * 5;

      this.createParticle({
        x: x,
        y: y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 3,
        size: 6 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        lifetime: 2000 + Math.random() * 1000,
        gravity: 0.4,
        friction: 0.98,
        shape: 'square',
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.4
      });
    }

    this.start();
  }

  /* ═══════════════════════════════════════════════════════
     🎬 ANIMATION LOOP
     ═══════════════════════════════════════════════════════ */

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  animate() {
    if (!this.isRunning) return;

    // Clear canvas
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    const now = Date.now();

    // Update and draw particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      const age = now - particle.createdAt;

      // Remove dead particles
      if (age > particle.lifetime) {
        this.particles.splice(i, 1);
        continue;
      }

      // Update physics
      particle.vx *= particle.friction;
      particle.vy *= particle.friction;
      particle.vy += particle.gravity;
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.rotationSpeed) {
        particle.rotation += particle.rotationSpeed;
      }

      // Fade out
      const lifePercent = age / particle.lifetime;
      particle.opacity = particle.initialOpacity * (1 - lifePercent);

      // Draw particle
      this.drawParticle(particle);
    }

    // Stop if no particles left
    if (this.particles.length === 0) {
      this.stop();
      this.removeCanvas();
      return;
    }

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  drawParticle(particle) {
    if (!this.ctx) return;

    this.ctx.save();
    this.ctx.globalAlpha = particle.opacity;
    this.ctx.fillStyle = particle.color;

    this.ctx.translate(particle.x, particle.y);
    if (particle.rotation) {
      this.ctx.rotate(particle.rotation);
    }

    switch (particle.shape) {
      case 'circle':
        this.ctx.beginPath();
        this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        break;

      case 'square':
        this.ctx.fillRect(
          -particle.size / 2,
          -particle.size / 2,
          particle.size,
          particle.size
        );
        break;

      case 'star':
        this.drawStar(0, 0, 5, particle.size, particle.size / 2);
        break;
    }

    this.ctx.restore();
  }

  drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      this.ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      this.ctx.lineTo(x, y);
      rot += step;
    }

    this.ctx.lineTo(cx, cy - outerRadius);
    this.ctx.closePath();
    this.ctx.fill();
  }

  /* ═══════════════════════════════════════════════════════
     📺 EFFETS D'ÉCRAN
     ═══════════════════════════════════════════════════════ */

  /**
   * Screen shake
   */
  screenShake(duration = 500, intensity = 10) {
    const body = document.body;
    const startTime = Date.now();

    const shake = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > duration) {
        body.style.transform = '';
        return;
      }

      const progress = 1 - (elapsed / duration);
      const x = (Math.random() - 0.5) * intensity * progress;
      const y = (Math.random() - 0.5) * intensity * progress;

      body.style.transform = `translate(${x}px, ${y}px)`;

      requestAnimationFrame(shake);
    };

    shake();
  }

  /**
   * Screen flash
   */
  screenFlash(color = '#FFFFFF', duration = 300, maxOpacity = 0.8) {
    const flash = document.createElement('div');
    flash.style.position = 'fixed';
    flash.style.top = '0';
    flash.style.left = '0';
    flash.style.width = '100%';
    flash.style.height = '100%';
    flash.style.backgroundColor = color;
    flash.style.opacity = '0';
    flash.style.pointerEvents = 'none';
    flash.style.zIndex = '99998';
    flash.style.transition = `opacity ${duration / 2}ms ease-out`;

    document.body.appendChild(flash);

    // Fade in
    requestAnimationFrame(() => {
      flash.style.opacity = maxOpacity.toString();
    });

    // Fade out
    setTimeout(() => {
      flash.style.opacity = '0';
      setTimeout(() => {
        if (flash.parentNode) {
          flash.parentNode.removeChild(flash);
        }
      }, duration / 2);
    }, duration / 2);
  }

  /**
   * Freeze frame (pause courte)
   */
  freezeFrame(duration = 100) {
    document.body.style.animationPlayState = 'paused';

    setTimeout(() => {
      document.body.style.animationPlayState = 'running';
    }, duration);
  }

  /* ═══════════════════════════════════════════════════════
     🧹 CLEANUP
     ═══════════════════════════════════════════════════════ */

  clear() {
    this.particles = [];
    this.stop();
    this.removeCanvas();
  }

  /* ═══════════════════════════════════════════════════════
     🎲 DICE PARTICLES
     ═══════════════════════════════════════════════════════ */

  createDiceParticles(diceValue) {
    console.log('🎆 createDiceParticles appelé avec valeur:', diceValue);
    
    // Trouve le dé 3D dans le DOM
    const diceOverlay = document.querySelector('.dice-destiny-overlay');
    if (!diceOverlay) {
      console.warn('⚠️ .dice-destiny-overlay non trouvé dans le DOM');
      return;
    }

    const rect = diceOverlay.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    console.log(`🎯 Position particules: (${centerX}, ${centerY})`);

    // Couleur selon la valeur
    const colors = {
      1: '#ff4444', // Rouge (mauvais)
      2: '#ff8844', // Orange
      3: '#ffcc44', // Jaune
      4: '#88ff44', // Vert clair
      5: '#44ff88', // Vert
      6: '#44ffff'  // Cyan (excellent)
    };

    const color = colors[diceValue] || '#ffffff';

    // Créer le canvas si nécessaire
    this.createCanvas();

    // Explosion de particules avec la structure correcte
    for (let i = 0; i < 40; i++) {
      const angle = (Math.PI * 2 * i) / 40;
      const speed = 3 + Math.random() * 5;
      
      this.createParticle({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 4 + Math.random() * 4,
        color: color,
        lifetime: 1200 + Math.random() * 400,
        gravity: 0.2,
        friction: 0.97,
        shape: Math.random() > 0.7 ? 'star' : 'circle',
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3
      });
    }

    this.start();
    console.log('✅ Particules du dé créées:', this.particles.length);
  }
}

/* ═══════════════════════════════════════════════════════
   🌍 EXPORT GLOBAL
   ═══════════════════════════════════════════════════════ */

if (typeof window !== 'undefined') {
  window.ParticleSystem = ParticleSystem;
  window.particleSystem = new ParticleSystem();

  console.log('✨ Particle System ready');
}
