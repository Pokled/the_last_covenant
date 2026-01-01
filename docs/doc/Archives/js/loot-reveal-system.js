/* ═══════════════════════════════════════════════════════
   🎰 LOOT REVEAL SYSTEM - COIN-COIN DUNGEON
   Animation type "Slot Machine" pour révélation d'items
   Style Vampire Survivors / MegaBonk
   ═══════════════════════════════════════════════════════ */

class LootRevealSystem {
  constructor() {
    this.isRevealing = false;
    this.currentRoll = null;

    console.log('🎰 Loot Reveal System initialized');
  }

  /* ═══════════════════════════════════════════════════════
     🎰 RÉVÉLATION PRINCIPALE
     ═══════════════════════════════════════════════════════ */

  /**
   * Révèle un item avec animation de slot machine
   * @param {Object} item - L'item à révéler
   * @param {HTMLElement} container - Conteneur où afficher l'animation
   * @param {Function} onComplete - Callback de fin
   */
  async revealItem(item, container, onComplete) {
    if (this.isRevealing) return;
    this.isRevealing = true;

    // Créer la zone de révélation
    const rollContainer = this.createRollContainer(container);

    // Générer pool d'items factices pour le roll
    const itemPool = this.generateItemPool(item);

    // Lancer l'animation
    await this.animateRoll(rollContainer, itemPool, item);

    // Révélation finale
    await this.revealFinal(rollContainer, item);

    // Cleanup
    setTimeout(() => {
      if (rollContainer.parentNode) {
        rollContainer.parentNode.removeChild(rollContainer);
      }
      this.isRevealing = false;
      if (onComplete) onComplete();
    }, 1000);
  }

  /**
   * Révèle plusieurs items séquentiellement
   */
  async revealMultipleItems(items, container, onComplete) {
    for (let i = 0; i < items.length; i++) {
      await new Promise(resolve => {
        this.revealItem(items[i], container, resolve);
      });
      await this.delay(500); // Pause entre chaque item
    }

    if (onComplete) onComplete();
  }

  /* ═══════════════════════════════════════════════════════
     🎨 CRÉATION UI
     ═══════════════════════════════════════════════════════ */

  createRollContainer(parent) {
    const container = document.createElement('div');
    container.className = 'loot-roll-container';
    container.innerHTML = `
      <div class="loot-roll-window">
        <div class="loot-roll-track"></div>
        <div class="loot-roll-indicator"></div>
      </div>
      <div class="loot-roll-glow"></div>
    `;

    parent.appendChild(container);
    return container;
  }

  generateItemPool(targetItem) {
    // Pool de 20 items factices + l'item réel au milieu
    const pool = [];
    const allItems = this.getAllPossibleItems(targetItem.rarity);

    // 10 items avant
    for (let i = 0; i < 10; i++) {
      pool.push(allItems[Math.floor(Math.random() * allItems.length)]);
    }

    // L'item cible
    pool.push(targetItem);

    // 9 items après
    for (let i = 0; i < 9; i++) {
      pool.push(allItems[Math.floor(Math.random() * allItems.length)]);
    }

    return pool;
  }

  getAllPossibleItems(rarity) {
    // Récupère des items de rareté similaire depuis ITEMS_DATABASE
    const items = [];

    if (typeof ITEMS_DATABASE !== 'undefined') {
      for (const category in ITEMS_DATABASE) {
        for (const id in ITEMS_DATABASE[category]) {
          const item = ITEMS_DATABASE[category][id];
          if (item.rarity === rarity || Math.random() < 0.3) {
            items.push(item);
          }
        }
      }
    }

    // Fallback si pas d'items
    if (items.length === 0) {
      items.push({
        icon: '❓',
        name: 'Item',
        rarity: 'common'
      });
    }

    return items;
  }

  /* ═══════════════════════════════════════════════════════
     🎬 ANIMATION DU ROLL
     ═══════════════════════════════════════════════════════ */

  async animateRoll(container, itemPool, targetItem) {
    const track = container.querySelector('.loot-roll-track');
    const itemSize = 80; // Taille d'un item en px
    const targetIndex = 10; // Index de l'item cible (milieu)

    // Créer les éléments visuels
    itemPool.forEach((item, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'loot-roll-item';
      itemEl.innerHTML = `
        <div class="loot-roll-item-icon" style="font-size: 48px;">${item.icon}</div>
        <div class="loot-roll-item-name">${item.name}</div>
      `;

      // Appliquer couleur selon rareté
      itemEl.style.borderColor = this.getRarityColor(item.rarity);

      track.appendChild(itemEl);
    });

    // Animation de roll
    const totalDistance = targetIndex * itemSize + itemSize / 2;
    const duration = 3000; // 3 secondes
    const startTime = Date.now();

    // Son de tic-tac qui accélère
    this.playAcceleratingTicks(duration);

    return new Promise(resolve => {
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(1, elapsed / duration);

        // Easing: accélère puis ralentit brusquement
        const eased = this.easeOutCubic(progress);

        // Position avec overshoot et retour
        let position = -totalDistance * eased;

        // Overshoot à la fin
        if (progress > 0.9) {
          const overshootProgress = (progress - 0.9) / 0.1;
          const overshoot = Math.sin(overshootProgress * Math.PI) * 10;
          position += overshoot;
        }

        track.style.transform = `translateY(${position}px)`;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Aligner parfaitement sur l'item
          track.style.transform = `translateY(${-totalDistance}px)`;
          resolve();
        }
      };

      animate();
    });
  }

  /* ═══════════════════════════════════════════════════════
     💥 RÉVÉLATION FINALE
     ═══════════════════════════════════════════════════════ */

  async revealFinal(container, item) {
    const window = container.querySelector('.loot-roll-window');

    // Flash selon rareté
    const flashColor = this.getRarityColor(item.rarity);
    const flashIntensity = this.getRarityFlashIntensity(item.rarity);

    particleSystem.screenFlash(flashColor, 400, flashIntensity);

    // Shake screen pour items rares
    if (item.rarity === 'rare' || item.rarity === 'legendary') {
      const shakeIntensity = item.rarity === 'legendary' ? 20 : 10;
      particleSystem.screenShake(500, shakeIntensity);
    }

    // Explosion de particules
    const rect = window.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const particleCount = this.getRarityParticleCount(item.rarity);
    const particleColor = flashColor;

    particleSystem.createExplosion(centerX, centerY, {
      count: particleCount,
      color: particleColor,
      size: item.rarity === 'legendary' ? 10 : 6,
      speed: item.rarity === 'legendary' ? 12 : 8,
      lifetime: 2000
    });

    // Son de révélation
    this.playRevealSound(item.rarity);

    // Freeze frame pour items légendaires
    if (item.rarity === 'legendary') {
      particleSystem.freezeFrame(150);
    }

    // Pulse glow
    const glow = container.querySelector('.loot-roll-glow');
    if (glow) {
      glow.style.opacity = '1';
      glow.style.boxShadow = `0 0 60px ${flashColor}`;
    }

    await this.delay(800);
  }

  /* ═══════════════════════════════════════════════════════
     🔊 SONS
     ═══════════════════════════════════════════════════════ */

  playAcceleratingTicks(duration) {
    if (typeof AUDIO === 'undefined') return;

    let tickInterval = 200; // Début lent
    const minInterval = 30; // Fin rapide
    const startTime = Date.now();

    const playTick = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed > duration) return;

      // Jouer le son
      AUDIO.playNotification();

      // Accélérer
      const progress = elapsed / duration;
      tickInterval = tickInterval * 0.92; // Accélération exponentielle
      tickInterval = Math.max(minInterval, tickInterval);

      setTimeout(playTick, tickInterval);
    };

    playTick();
  }

  playRevealSound(rarity) {
    if (typeof AUDIO === 'undefined') return;

    switch (rarity) {
      case 'legendary':
        // Son spécial pour légendaire
        AUDIO.playVictory();
        break;
      case 'rare':
        AUDIO.playCardGet();
        break;
      case 'uncommon':
        AUDIO.playCoinCollect();
        break;
      default:
        AUDIO.playNotification();
    }
  }

  /* ═══════════════════════════════════════════════════════
     🎨 RARETÉ
     ═══════════════════════════════════════════════════════ */

  getRarityColor(rarity) {
    const colors = {
      common: '#9CA3AF',      // Gris
      uncommon: '#10B981',    // Vert
      rare: '#3B82F6',        // Bleu
      legendary: '#F59E0B'    // Or/Orange
    };
    return colors[rarity] || colors.common;
  }

  getRarityFlashIntensity(rarity) {
    const intensities = {
      common: 0.3,
      uncommon: 0.5,
      rare: 0.7,
      legendary: 0.9
    };
    return intensities[rarity] || 0.3;
  }

  getRarityParticleCount(rarity) {
    const counts = {
      common: 20,
      uncommon: 40,
      rare: 60,
      legendary: 100
    };
    return counts[rarity] || 20;
  }

  /* ═══════════════════════════════════════════════════════
     🛠️ HELPERS
     ═══════════════════════════════════════════════════════ */

  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/* ═══════════════════════════════════════════════════════
   🌍 EXPORT GLOBAL
   ═══════════════════════════════════════════════════════ */

if (typeof window !== 'undefined') {
  window.LootRevealSystem = LootRevealSystem;
  window.lootRevealSystem = new LootRevealSystem();

  console.log('🎰 Loot Reveal System ready');
}
