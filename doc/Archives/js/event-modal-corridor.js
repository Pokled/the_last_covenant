// ═══════════════════════════════════════════════════════
// 🏃 EVENT MODAL CORRIDOR - AAA+ STYLE
// Modales compactes et rapides pour événements de corridor
// ═══════════════════════════════════════════════════════

class EventModalCorridor {
  constructor() {
    console.log('🏃 EventModalCorridor initialized');
  }

  // ═══════════════════════════════════════════════════════
  // ⚔️ COMBAT SIMPLE CORRIDOR
  // ═══════════════════════════════════════════════════════

  showCombat(enemy, player, game, onClose) {
    console.log('⚔️ Affichage combat corridor:', enemy.name);

    const background = this.createBackground();
    const overlay = this.createOverlay();
    const container = this.createContainer();

    // Header
    const header = document.createElement('div');
    header.className = 'corridor-modal-header';
    header.innerHTML = `
      <span class="corridor-modal-icon">⚔️</span>
      <h2 class="corridor-modal-title">Combat !</h2>
    `;
    container.appendChild(header);

    // Content
    const content = document.createElement('div');
    content.className = 'corridor-modal-content';

    // Combat VS display
    const combatVs = document.createElement('div');
    combatVs.className = 'corridor-combat-vs';
    combatVs.innerHTML = `
      <div class="corridor-combat-fighter">
        <span class="corridor-combat-icon">${player.icon}</span>
        <div class="corridor-combat-name">${player.name}</div>
        <div class="corridor-combat-stats">
          ❤️ ${player.hp}/${player.maxHp || player.hp}<br>
          ⚔️ ${player.atk} | 🛡️ ${player.def}
        </div>
      </div>

      <div class="corridor-combat-vs-text">VS</div>

      <div class="corridor-combat-fighter">
        <span class="corridor-combat-icon">${enemy.icon}</span>
        <div class="corridor-combat-name">${enemy.name}</div>
        <div class="corridor-combat-stats">
          ❤️ ${enemy.hp}<br>
          ⚔️ ${enemy.atk} | 🛡️ ${enemy.def || 0}
        </div>
      </div>
    `;
    content.appendChild(combatVs);

    container.appendChild(content);

    // Buttons
    const buttons = document.createElement('div');
    buttons.className = 'corridor-modal-buttons';

    const attackBtn = document.createElement('button');
    attackBtn.className = 'corridor-btn corridor-btn-primary';
    attackBtn.innerHTML = '⚔️ Combattre';
    attackBtn.onclick = () => {
      this.resolveCombat(enemy, player, game, container, onClose);
    };

    const fleeBtn = document.createElement('button');
    fleeBtn.className = 'corridor-btn corridor-btn-secondary';
    fleeBtn.innerHTML = '🏃 Fuir';
    fleeBtn.onclick = () => {
      game.addLog('🏃', `Vous fuyez le ${enemy.name}...`);
      this.close(background, overlay);
      if (onClose) onClose();
    };

    buttons.appendChild(attackBtn);
    buttons.appendChild(fleeBtn);
    container.appendChild(buttons);

    // Particles
    this.addParticles(container);

    overlay.appendChild(container);
    document.body.appendChild(background);
    document.body.appendChild(overlay);
  }

  resolveCombat(enemy, player, game, container, onClose) {
    // Simple combat resolution (quick calculation)
    const playerRoll = Math.floor(Math.random() * 10) + 1;
    const enemyRoll = Math.floor(Math.random() * 10) + 1;

    const playerPower = player.atk + playerRoll + (player.def / 2);
    const enemyPower = enemy.atk + enemyRoll + ((enemy.def || 0) / 2);

    const victory = playerPower > enemyPower;

    // Remove buttons
    const buttons = container.querySelector('.corridor-modal-buttons');
    if (buttons) buttons.remove();

    // Show result
    const resultDiv = document.createElement('div');
    resultDiv.className = `corridor-combat-result ${victory ? 'victory' : 'defeat'}`;

    if (victory) {
      const xpGain = enemy.xp || 15;
      const rubiesGain = enemy.rubies || enemy.gold || 8; // Support ancien système

      resultDiv.innerHTML = `
        <div style="font-size: 32px; margin-bottom: 10px;">🎉</div>
        <div>VICTOIRE !</div>
        <div style="font-size: 14px; margin-top: 10px;">
          +${xpGain} XP | +${rubiesGain} 💎
        </div>
      `;

      player.xp += xpGain;
      EconomySystem.addRubies(player, rubiesGain);
      game.addLog('🎉', `Victoire contre ${enemy.name} ! +${xpGain} XP, +${rubiesGain} rubis`);

      if (player.stats) player.stats.kills++;
      game.checkLevelUp(player);

    } else {
      const damage = Math.floor(enemy.atk / 2) + Math.floor(Math.random() * 5);
      player.hp = Math.max(0, player.hp - damage);

      resultDiv.innerHTML = `
        <div style="font-size: 32px; margin-bottom: 10px;">💔</div>
        <div>DÉFAITE...</div>
        <div style="font-size: 14px; margin-top: 10px;">
          -${damage} HP
        </div>
      `;

      game.addLog('💔', `Défaite contre ${enemy.name}... -${damage} HP`);

      if (player.hp <= 0) {
        player.alive = false;
        setTimeout(() => {
          this.closeAll();
          game.showModal('💀 GAME OVER', `${player.name} est tombé au combat...<br><br>La partie est terminée.`);
          setTimeout(() => window.location.href = 'index.html', 4000);
        }, 2000);
        return;
      }
    }

    container.appendChild(resultDiv);

    // Continue button
    const continueBtn = document.createElement('button');
    continueBtn.className = 'corridor-btn corridor-btn-success';
    continueBtn.innerHTML = '➡️ Continuer';
    continueBtn.style.marginTop = '20px';
    continueBtn.onclick = () => {
      game.updateUI();
      if (game.renderer) game.renderer.draw(GameState.dungeon, GameState.players);
      this.closeAll();
      if (onClose) onClose();
    };

    const btnContainer = document.createElement('div');
    btnContainer.className = 'corridor-modal-buttons';
    btnContainer.appendChild(continueBtn);
    container.appendChild(btnContainer);
  }

  // ═══════════════════════════════════════════════════════
  // 💎 TRÉSOR / COFFRE
  // ═══════════════════════════════════════════════════════

  async showTreasure(treasure, player, game, onClose) {
    console.log('💎 Affichage trésor corridor');

    const background = this.createBackground();
    const overlay = this.createOverlay();
    const container = this.createContainer();

    // Header
    const header = document.createElement('div');
    header.className = 'corridor-modal-header';
    header.innerHTML = `
      <span class="corridor-modal-icon">💎</span>
      <h2 class="corridor-modal-title">Trésor Trouvé !</h2>
    `;
    container.appendChild(header);

    // Content
    const content = document.createElement('div');
    content.className = 'corridor-modal-content';

    const description = document.createElement('div');
    description.className = 'corridor-modal-description';
    description.textContent = 'Vous découvrez un petit coffre...';
    content.appendChild(description);

    // 🎰 SI ITEM: Révélation avec slot machine AVANT affichage
    if (treasure.item && typeof lootRevealSystem !== 'undefined') {
      const rollZone = document.createElement('div');
      rollZone.className = 'loot-roll-zone';
      content.appendChild(rollZone);

      container.appendChild(content);
      overlay.appendChild(container);
      document.body.appendChild(background);
      document.body.appendChild(overlay);

      // Révéler l'item avec animation
      await lootRevealSystem.revealItem(treasure.item, rollZone, () => {
        console.log('✨ Item révélé:', treasure.item.name);
      });

      // Retirer la zone de roll
      if (rollZone.parentNode) {
        rollZone.parentNode.removeChild(rollZone);
      }
    } else {
      container.appendChild(content);
      overlay.appendChild(container);
      document.body.appendChild(background);
      document.body.appendChild(overlay);
    }

    // Treasure list (affiche APRÈS le reveal)
    const treasureList = document.createElement('ul');
    treasureList.className = 'corridor-treasure-list';

    const rubiesAmount = treasure.rubies || treasure.gold || 0;
    if (rubiesAmount > 0) {
      const rubiesItem = document.createElement('li');
      rubiesItem.className = 'corridor-treasure-item';
      rubiesItem.innerHTML = `
        <div class="corridor-treasure-item-left">
          <span class="corridor-treasure-item-icon">💎</span>
          <span class="corridor-treasure-item-name">Rubis</span>
        </div>
        <span class="corridor-treasure-item-value">+${rubiesAmount}</span>
      `;
      treasureList.appendChild(rubiesItem);

      EconomySystem.addRubies(player, rubiesAmount);
      game.addLog('💎', `+${rubiesAmount} rubis`);

      // Pluie de pièces
      if (typeof particleSystem !== 'undefined') {
        const rect = container.getBoundingClientRect();
        particleSystem.createCoinRain(rect.left + rect.width / 2, rect.top + 200, 15);
      }
    }

    if (treasure.item) {
      const item = treasure.item;
      const itemElement = document.createElement('li');
      itemElement.className = 'corridor-treasure-item';
      itemElement.innerHTML = `
        <div class="corridor-treasure-item-left">
          <span class="corridor-treasure-item-icon">${item.icon}</span>
          <span class="corridor-treasure-item-name">${item.name}</span>
        </div>
        <span class="corridor-treasure-item-value">✨</span>
      `;
      treasureList.appendChild(itemElement);

      player.inventory.addItem(item.type, 1);
      game.addLog(item.icon, `Objet trouvé : ${item.name}`);

      // Étincelles
      if (typeof particleSystem !== 'undefined') {
        const rect = container.getBoundingClientRect();
        particleSystem.createSparkles(rect.left + rect.width / 2, rect.top + 250, 20);
      }
    }

    if (treasure.xp) {
      const xpItem = document.createElement('li');
      xpItem.className = 'corridor-treasure-item';
      xpItem.innerHTML = `
        <div class="corridor-treasure-item-left">
          <span class="corridor-treasure-item-icon">⭐</span>
          <span class="corridor-treasure-item-name">Expérience</span>
        </div>
        <span class="corridor-treasure-item-value">+${treasure.xp}</span>
      `;
      treasureList.appendChild(xpItem);

      player.xp += treasure.xp;
      game.addLog('⭐', `+${treasure.xp} XP`);
    }

    content.appendChild(treasureList);

    // Button
    const buttons = document.createElement('div');
    buttons.className = 'corridor-modal-buttons';

    const continueBtn = document.createElement('button');
    continueBtn.className = 'corridor-btn corridor-btn-success';
    continueBtn.innerHTML = '✅ Prendre';
    continueBtn.onclick = () => {
      game.checkLevelUp(player);
      game.updateUI();
      this.close(background, overlay);
      if (onClose) onClose();
    };

    buttons.appendChild(continueBtn);
    container.appendChild(buttons);

    // Particles
    this.addParticles(container);

    overlay.appendChild(container);
    document.body.appendChild(background);
    document.body.appendChild(overlay);
  }

  // ═══════════════════════════════════════════════════════
  // 🪤 PIÈGE
  // ═══════════════════════════════════════════════════════

  showTrap(trap, player, game, onClose) {
    console.log('🪤 Affichage piège corridor');

    const background = this.createBackground();
    const overlay = this.createOverlay();
    const container = this.createContainer();

    // Header
    const header = document.createElement('div');
    header.className = 'corridor-modal-header';
    header.innerHTML = `
      <span class="corridor-modal-icon">🪤</span>
      <h2 class="corridor-modal-title">Piège !</h2>
    `;
    container.appendChild(header);

    // Content
    const content = document.createElement('div');
    content.className = 'corridor-modal-content';

    // Trap warning
    const trapWarning = document.createElement('div');
    trapWarning.className = 'corridor-trap-warning';
    trapWarning.innerHTML = `
      <span class="corridor-trap-icon">⚠️</span>
      <div class="corridor-trap-text">${trap.name || 'Piège sournois'}</div>
      <div class="corridor-trap-damage">-${trap.damage} HP</div>
    `;
    content.appendChild(trapWarning);

    // Apply damage
    player.hp = Math.max(0, player.hp - trap.damage);
    game.addLog('🪤', `Piège ! -${trap.damage} HP`);

    // Check death
    if (player.hp <= 0) {
      player.alive = false;
      setTimeout(() => {
        this.closeAll();
        game.showModal('💀 GAME OVER', `${player.name} a succombé à un piège mortel...<br><br>La partie est terminée.`);
        setTimeout(() => window.location.href = 'index.html', 4000);
      }, 2000);
      return;
    }

    container.appendChild(content);

    // Button
    const buttons = document.createElement('div');
    buttons.className = 'corridor-modal-buttons';

    const continueBtn = document.createElement('button');
    continueBtn.className = 'corridor-btn corridor-btn-primary';
    continueBtn.innerHTML = '➡️ Continuer';
    continueBtn.onclick = () => {
      game.updateUI();
      this.close(background, overlay);
      if (onClose) onClose();
    };

    buttons.appendChild(continueBtn);
    container.appendChild(buttons);

    overlay.appendChild(container);
    document.body.appendChild(background);
    document.body.appendChild(overlay);
  }

  // ═══════════════════════════════════════════════════════
  // 🛒 MARCHAND RAPIDE
  // ═══════════════════════════════════════════════════════

  showMerchant(items, player, game, onPurchase) {
    console.log('🛒 Affichage marchand corridor');

    const background = this.createBackground();
    const overlay = this.createOverlay();
    const container = this.createContainer();

    // Header
    const header = document.createElement('div');
    header.className = 'corridor-modal-header';
    header.innerHTML = `
      <span class="corridor-modal-icon">🛒</span>
      <h2 class="corridor-modal-title">Marchand Ambulant</h2>
    `;
    container.appendChild(header);

    // Content
    const content = document.createElement('div');
    content.className = 'corridor-modal-content';

    const description = document.createElement('div');
    description.className = 'corridor-modal-description';
    description.textContent = 'Un marchand vous propose quelques objets...';
    content.appendChild(description);

    // Merchant offer
    const merchantOffer = document.createElement('div');
    merchantOffer.className = 'corridor-merchant-offer';

    items.forEach(item => {
      const merchantItem = document.createElement('div');
      merchantItem.className = 'corridor-merchant-item';
      merchantItem.innerHTML = `
        <div class="corridor-merchant-info">
          <span class="corridor-merchant-icon">${item.icon}</span>
          <div class="corridor-merchant-details">
            <div class="corridor-merchant-name">${item.name}</div>
            <div class="corridor-merchant-desc">${item.effect || 'Objet utile'}</div>
          </div>
        </div>
        <div class="corridor-merchant-price">${item.price} 💰</div>
      `;

      merchantItem.onclick = () => {
        if (player.gold >= item.price) {
          player.gold -= item.price;
          // ✅ CORRIGÉ: Utiliser addItem au lieu de push
          player.inventory.addItem(item.type || item.id, 1);
          game.addLog('🛒', `Acheté : ${item.name} (-${item.price} or)`);
          game.updateUI();
          merchantItem.style.opacity = '0.5';
          merchantItem.style.pointerEvents = 'none';
          if (onPurchase) onPurchase(item);
        } else {
          game.addLog('❌', 'Pas assez d\'or !');
        }
      };

      merchantOffer.appendChild(merchantItem);
    });

    content.appendChild(merchantOffer);
    container.appendChild(content);

    // Button
    const buttons = document.createElement('div');
    buttons.className = 'corridor-modal-buttons';

    const continueBtn = document.createElement('button');
    continueBtn.className = 'corridor-btn corridor-btn-secondary';
    continueBtn.innerHTML = '➡️ Partir';
    continueBtn.onclick = () => {
      this.close(background, overlay);
    };

    buttons.appendChild(continueBtn);
    container.appendChild(buttons);

    // Particles
    this.addParticles(container);

    overlay.appendChild(container);
    document.body.appendChild(background);
    document.body.appendChild(overlay);
  }

  // ═══════════════════════════════════════════════════════
  // 🛠️ HELPERS
  // ═══════════════════════════════════════════════════════

  createBackground() {
    const background = document.createElement('div');
    background.className = 'corridor-modal-background';
    return background;
  }

  createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'corridor-modal-overlay';
    return overlay;
  }

  createContainer() {
    const container = document.createElement('div');
    container.className = 'corridor-modal-container';
    return container;
  }

  addParticles(container) {
    const particles = document.createElement('div');
    particles.className = 'corridor-modal-particles';

    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'corridor-particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 4 + 's';
      particles.appendChild(particle);
    }

    container.appendChild(particles);
  }

  close(background, overlay) {
    if (background && background.parentNode) {
      background.style.animation = 'corridorFadeIn 0.3s ease reverse';
      overlay.style.animation = 'corridorFadeIn 0.3s ease reverse';
      setTimeout(() => {
        if (background.parentNode) background.parentNode.removeChild(background);
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 300);
    }
  }

  closeAll() {
    const backgrounds = document.querySelectorAll('.corridor-modal-background');
    const overlays = document.querySelectorAll('.corridor-modal-overlay');

    backgrounds.forEach(bg => {
      if (bg.parentNode) bg.parentNode.removeChild(bg);
    });

    overlays.forEach(ov => {
      if (ov.parentNode) ov.parentNode.removeChild(ov);
    });
  }
}

// ═══════════════════════════════════════════════════════
// 🌍 EXPORT GLOBAL
// ═══════════════════════════════════════════════════════

if (typeof window !== 'undefined') {
  window.EventModalCorridor = EventModalCorridor;
  window.eventModalCorridor = new EventModalCorridor();
  console.log('✅ EventModalCorridor disponible globalement');
}
