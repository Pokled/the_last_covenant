/**
 * CORRUPTION SYSTEM - THE LAST COVENANT
 * Manages visual and mechanical corruption effects
 */

class CorruptionSystem {
  constructor() {
    this.corruption = 0; // 0-100
    this.previousThreshold = 'pure';
    this.currentThreshold = 'pure';

    // Threshold definitions
    this.thresholds = {
      pure: { min: 0, max: 25, name: 'Pure' },
      tainted: { min: 25, max: 50, name: 'Souillé' },
      corrupted: { min: 50, max: 75, name: 'Corrompu' },
      abyssal: { min: 75, max: 100, name: 'Abyssal' }
    };

    // Threshold messages
    this.thresholdMessages = {
      tainted: {
        title: '⚠️ SOUILLURE DÉTECTÉE',
        text: 'La corruption commence à t\'envahir.',
        flavor: '"Le premier pas est toujours le plus difficile. Les suivants... plus faciles."'
      },
      corrupted: {
        title: '💀 CORRUPTION AVANCÉE',
        text: 'Ton essence se dégrade. Les dieux morts te regardent.',
        flavor: '"Tu sens leur regard. Froid. Affamé. Familier."'
      },
      abyssal: {
        title: '🌑 CORRUPTION ABYSSALE',
        text: 'Tu es devenu l\'un d\'eux. Le vide t\'appelle.',
        flavor: '"Bienvenue, frère. Tu comprends maintenant."'
      }
    };

    // Visual elements
    this.elements = {
      corruptionBar: null,
      corruptionValue: null,
      corruptionIcon: null,
      vignette: null,
      particles: null,
      distortion: null,
      warning: null,
      heroPortrait: null,
      diceContainer: null
    };

    this.particleInstances = [];
    this.initialized = false;
  }

  /**
   * Initialize the corruption system
   */
  init() {
    if (this.initialized) return;

    console.log('💀 Corruption System - Initializing...');

    // Create UI elements
    this.createCorruptionUI();
    this.createVisualEffects();

    // Get existing elements
    this.elements.heroPortrait = document.querySelector('.hero-portrait');
    this.elements.diceContainer = document.querySelector('.dice-container');

    // Set initial state
    this.updateVisuals();

    this.initialized = true;
    console.log('✅ Corruption System - Ready');
  }

  /**
   * Create corruption UI in hero panel
   */
  createCorruptionUI() {
    const heroCard = document.querySelector('.hero-card .hero-stats');
    if (!heroCard) {
      console.warn('⚠️ Hero card not found, cannot add corruption UI');
      return;
    }

    // Create corruption container
    const container = document.createElement('div');
    container.className = 'corruption-container';
    container.innerHTML = `
      <div class="corruption-label">
        <span class="corruption-icon">💀</span>
        <span class="corruption-value pure" id="corruptionValue">0%</span>
      </div>
      <div class="corruption-bar-wrapper">
        <div class="corruption-thresholds">
          <div class="corruption-threshold t25"></div>
          <div class="corruption-threshold t50"></div>
          <div class="corruption-threshold t75"></div>
        </div>
        <div class="corruption-bar pure" id="corruptionBar"></div>
      </div>
    `;

    // Insert after XP bar
    const xpBar = heroCard.querySelector('.xp-bar-container');
    if (xpBar) {
      xpBar.parentNode.insertBefore(container, xpBar.nextSibling);
    } else {
      heroCard.appendChild(container);
    }

    // Store references
    this.elements.corruptionBar = document.getElementById('corruptionBar');
    this.elements.corruptionValue = document.getElementById('corruptionValue');
  }

  /**
   * Create visual effect overlays
   */
  createVisualEffects() {
    // Vignette overlay
    const vignette = document.createElement('div');
    vignette.className = 'corruption-vignette pure';
    vignette.id = 'corruptionVignette';
    document.body.appendChild(vignette);
    this.elements.vignette = vignette;

    // Particles container
    const particles = document.createElement('div');
    particles.className = 'corruption-particles';
    particles.id = 'corruptionParticles';
    document.body.appendChild(particles);
    this.elements.particles = particles;

    // Distortion overlay
    const distortion = document.createElement('div');
    distortion.className = 'corruption-distortion pure';
    distortion.id = 'corruptionDistortion';
    document.body.appendChild(distortion);
    this.elements.distortion = distortion;

    // Warning overlay
    const warning = document.createElement('div');
    warning.className = 'corruption-warning';
    warning.id = 'corruptionWarning';
    warning.innerHTML = `
      <div class="corruption-warning-title"></div>
      <div class="corruption-warning-text"></div>
      <div class="corruption-warning-flavor"></div>
    `;
    document.body.appendChild(warning);
    this.elements.warning = warning;
  }

  /**
   * Set corruption value
   * @param {number} value - Corruption value (0-100)
   * @param {string} reason - Optional reason for logging
   */
  setCorruption(value, reason = '') {
    const oldValue = this.corruption;
    this.corruption = Math.max(0, Math.min(100, value));

    // Log change
    if (reason) {
      console.log(`💀 Corruption: ${oldValue}% → ${this.corruption}% (${reason})`);
    }

    // Update threshold
    this.updateThreshold();

    // Update visuals
    this.updateVisuals();

    // Check for threshold crossing
    if (this.currentThreshold !== this.previousThreshold) {
      this.onThresholdCrossed();
    }

    // Dispatch event
    this.dispatchCorruptionEvent(oldValue, this.corruption);
  }

  /**
   * Add corruption
   * @param {number} amount - Amount to add
   * @param {string} reason - Optional reason
   */
  addCorruption(amount, reason = '') {
    this.setCorruption(this.corruption + amount, reason);
  }

  /**
   * Remove corruption
   * @param {number} amount - Amount to remove
   * @param {string} reason - Optional reason
   */
  removeCorruption(amount, reason = '') {
    this.setCorruption(this.corruption - amount, reason);
  }

  /**
   * Update current threshold based on corruption value
   */
  updateThreshold() {
    this.previousThreshold = this.currentThreshold;

    if (this.corruption < 25) {
      this.currentThreshold = 'pure';
    } else if (this.corruption < 50) {
      this.currentThreshold = 'tainted';
    } else if (this.corruption < 75) {
      this.currentThreshold = 'corrupted';
    } else {
      this.currentThreshold = 'abyssal';
    }
  }

  /**
   * Update all visual elements
   */
  updateVisuals() {
    if (!this.initialized) return;

    const threshold = this.currentThreshold;

    // Update corruption bar
    if (this.elements.corruptionBar) {
      this.elements.corruptionBar.style.width = `${this.corruption}%`;
      this.elements.corruptionBar.className = `corruption-bar ${threshold}`;
    }

    // Update corruption value text
    if (this.elements.corruptionValue) {
      this.elements.corruptionValue.textContent = `${Math.floor(this.corruption)}%`;
      this.elements.corruptionValue.className = `corruption-value ${threshold}`;
    }

    // Update vignette
    if (this.elements.vignette) {
      this.elements.vignette.className = `corruption-vignette ${threshold}`;
    }

    // Update distortion
    if (this.elements.distortion) {
      this.elements.distortion.className = `corruption-distortion ${threshold}`;
    }

    // Update particles
    this.updateParticles(threshold);

    // Update hero portrait
    if (this.elements.heroPortrait) {
      this.elements.heroPortrait.className = `hero-portrait corruption-${threshold}`;
    }

    // Update dice container
    if (this.elements.diceContainer) {
      this.elements.diceContainer.className = `dice-container corruption-${threshold}`;
    }
  }

  /**
   * Update corruption particles
   */
  updateParticles(threshold) {
    if (!this.elements.particles) return;

    // Clear existing particles
    this.elements.particles.innerHTML = '';
    this.particleInstances = [];

    // Don't show particles for pure threshold
    if (threshold === 'pure') return;

    // Particle counts based on threshold
    const particleCounts = {
      tainted: 10,
      corrupted: 20,
      abyssal: 40
    };

    const count = particleCounts[threshold] || 0;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = `corruption-particle ${threshold}`;

      // Random size
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      // Random starting position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;

      // Random animation delay
      particle.style.animationDelay = `${Math.random() * -20}s`;

      // Random animation duration
      particle.style.animationDuration = `${Math.random() * 10 + 15}s`;

      this.elements.particles.appendChild(particle);
      this.particleInstances.push(particle);
    }
  }

  /**
   * Called when corruption crosses a threshold
   */
  onThresholdCrossed() {
    console.log(`⚠️ Corruption Threshold Crossed: ${this.previousThreshold} → ${this.currentThreshold}`);

    // Show warning for tainted and above
    if (this.currentThreshold !== 'pure') {
      this.showThresholdWarning();
    }

    // Play sound
    this.playCorruptionSound(this.currentThreshold);

    // Trigger screen shake
    if (this.currentThreshold === 'corrupted' || this.currentThreshold === 'abyssal') {
      this.triggerScreenShake();
    }
  }

  /**
   * Show threshold crossing warning
   */
  showThresholdWarning() {
    const message = this.thresholdMessages[this.currentThreshold];
    if (!message || !this.elements.warning) return;

    const warning = this.elements.warning;
    warning.querySelector('.corruption-warning-title').textContent = message.title;
    warning.querySelector('.corruption-warning-text').textContent = message.text;
    warning.querySelector('.corruption-warning-flavor').textContent = message.flavor;

    // Apply threshold class
    warning.className = `corruption-warning ${this.currentThreshold}`;

    // Show warning
    warning.classList.add('show');

    // Auto-hide after 4 seconds
    setTimeout(() => {
      warning.classList.remove('show');
    }, 4000);
  }

  /**
   * Play corruption sound effect
   */
  playCorruptionSound(threshold) {
    const sounds = {
      tainted: 'corruption_tainted',
      corrupted: 'corruption_corrupted',
      abyssal: 'corruption_abyssal'
    };

    const soundName = sounds[threshold];
    if (soundName && window.AudioManager) {
      window.AudioManager.playSFX(soundName);
    }
  }

  /**
   * Trigger screen shake effect
   */
  triggerScreenShake() {
    const intensity = this.currentThreshold === 'abyssal' ? 10 : 5;
    const duration = this.currentThreshold === 'abyssal' ? 500 : 300;

    if (window.game && window.game.screenShake) {
      window.game.screenShake(intensity, duration);
    }
  }

  /**
   * Dispatch custom corruption event
   */
  dispatchCorruptionEvent(oldValue, newValue) {
    const event = new CustomEvent('corruptionChanged', {
      detail: {
        oldValue,
        newValue,
        threshold: this.currentThreshold,
        previousThreshold: this.previousThreshold
      }
    });

    window.dispatchEvent(event);
  }

  /**
   * Get current corruption value
   */
  getCorruption() {
    return this.corruption;
  }

  /**
   * Get current threshold
   */
  getThreshold() {
    return this.currentThreshold;
  }

  /**
   * Check if corruption is at or above a threshold
   */
  isAtThreshold(threshold) {
    const thresholdValues = {
      pure: 0,
      tainted: 25,
      corrupted: 50,
      abyssal: 75
    };

    return this.corruption >= (thresholdValues[threshold] || 0);
  }

  /**
   * Reset corruption to 0
   */
  reset() {
    this.setCorruption(0, 'Reset');
  }

  /**
   * Save corruption state
   */
  save() {
    return {
      corruption: this.corruption,
      threshold: this.currentThreshold
    };
  }

  /**
   * Load corruption state
   */
  load(data) {
    if (data && typeof data.corruption === 'number') {
      this.setCorruption(data.corruption, 'Loaded from save');
    }
  }

  /**
   * Get corruption description for current level
   */
  getDescription() {
    const descriptions = {
      pure: {
        title: 'Âme Pure',
        desc: 'La corruption n\'a pas encore pris racine. Les dieux morts ne te voient pas encore.',
        icon: '✨'
      },
      tainted: {
        title: 'Âme Souillée',
        desc: 'Une ombre grandit dans ton cœur. Les murmures commencent.',
        icon: '🌫️'
      },
      corrupted: {
        title: 'Âme Corrompue',
        desc: 'La noirceur t\'envahit. Tu entends leurs voix, claires et affamées.',
        icon: '💀'
      },
      abyssal: {
        title: 'Âme Abyssale',
        desc: 'Tu es devenu ce que tu combattais. Le vide te regarde... et tu lui souris.',
        icon: '🌑'
      }
    };

    return descriptions[this.currentThreshold];
  }
}

// Global instance
window.CorruptionSystem = window.CorruptionSystem || new CorruptionSystem();

// Auto-init on DOM load if game exists
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (window.game) {
      window.CorruptionSystem.init();
    }
  });
} else {
  if (window.game) {
    window.CorruptionSystem.init();
  }
}
