// 🔒 FONCTION DE SÉCURITÉ - Échapper HTML
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 🎬 EVENT MODALS SYSTEM - GESTIONNAIRE PRINCIPAL

class EventModalSystem {
  constructor() {
    this.currentModal = null;
    this.autoCloseTimer = null;
    this.isOpen = false;
    
    console.log('🎬 Système de modals événementiels initialisé');
  }
  
  // === FERMER MODAL ===
  closeModal() {
    if (this.currentModal) {
      this.currentModal.style.animation = 'fadeOut 0.3s forwards';
      
      setTimeout(() => {
        if (this.currentModal && this.currentModal.parentNode) {
          this.currentModal.remove();
        }
        this.currentModal = null;
        this.isOpen = false;
      }, 300);
    }
    
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
      this.autoCloseTimer = null;
    }
  }
  
  // === CRÉER BOUTON FERMETURE ===
  createCloseButton() {
    const btn = document.createElement('div');
    btn.className = 'modal-close-btn';
    btn.innerHTML = '×';
    btn.onclick = () => this.closeModal();
    return btn;
  }
  
  // === CRÉER PARTICULES ===
  createParticles(container, count = 20, colors = ['#ffd700']) {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 4}s`;
      particle.style.animationDuration = `${3 + Math.random() * 2}s`;
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      container.appendChild(particle);
    }
  }
  
  // === ICÔNE CLASSE JOUEUR ===
  getClassIcon(className) {
    const icons = {
      'WARRIOR': '⚔️',
      'MAGE': '🔮',
      'ROGUE': '🗡️',
      'CLERIC': '✨',
      'BERSERKER': '🪓',
      'DEMONIST': '😈',
      'ARCHER': '🏹'
    };
    return icons[className?.toUpperCase()] || '🛡️';
  }
  
  // === ICÔNE ITEM ===
  getItemIcon(item) {
    const icons = {
      'HEALTH_POTION': '❤️',
      'STRENGTH_POTION': '💪',
      'DEFENSE_POTION': '🛡️',
      'SPEED_POTION': '⚡',
      'RUBY': '💎',
      'GOLD': '💰',
      'SWORD': '⚔️',
      'SHIELD': '🛡️',
      'ARMOR': '🥋',
      'BOW': '🏹',
      'STAFF': '🔮',
      'DAGGER': '🗡️',
      'AXE': '🪓'
    };
    return icons[item.type] || icons[item.name] || '📦';
  }
  
  // ═══════════════════════════════════════════════════════════════
  // 1. MODAL VS COMBAT - Style Street Fighter
  // ═══════════════════════════════════════════════════════════════
  showCombatModal(player, enemy, maybeGameOrOnStart) {
    if (this.isOpen) return;
    this.isOpen = true;

    // Backwards-compatible params
    let onStart = null;
    let game = null;
    if (typeof maybeGameOrOnStart === 'function') {
      onStart = maybeGameOrOnStart;
      game = window.game;
    } else {
      game = maybeGameOrOnStart || window.game;
    }

    // Son combat
    ModalSounds.playCombatSound();
    
    const overlay = document.createElement('div');
    overlay.className = 'event-modal-overlay';
    overlay.innerHTML = `
      <div class="event-modal modal-vs-combat">
        ${this.createCloseButton().outerHTML}
        <div class="modal-particles" id="combatParticles"></div>
        
        <div class="vs-header">Combat</div>
        
        <div class="vs-countdown" id="vsCountdown"></div>
        
        <div class="vs-combatants">
          <!-- Joueur -->
          <div class="vs-fighter player">
            <div class="vs-fighter-icon">${this.getClassIcon(player.class)}</div>
            <div class="vs-fighter-stats">
              <div style="font-size: 26px; color: #7fff00; margin-bottom: 12px; font-weight: 900; text-shadow: 2px 2px 4px #000;">
                ${escapeHtml(player.name)}
              </div>
              <div class="vs-stat">
                <span class="vs-stat-label">❤️ PV</span>
                <span class="vs-stat-value">${player.hp}/${player.maxHp}</span>
              </div>
              <div class="vs-stat">
                <span class="vs-stat-label">⚔️ ATK</span>
                <span class="vs-stat-value">${player.atk}</span>
              </div>
              <div class="vs-stat">
                <span class="vs-stat-label">🛡️ DEF</span>
                <span class="vs-stat-value">${player.def}</span>
              </div>
            </div>
          </div>
          
          <!-- Logo VS -->
          <div class="vs-logo">VS</div>
          
          <!-- Ennemi -->
          <div class="vs-fighter enemy">
            <div class="vs-fighter-icon">${enemy.icon}</div>
            <div class="vs-fighter-stats">
              <div style="font-size: 26px; color: #ff6b6b; margin-bottom: 12px; font-weight: 900; text-shadow: 2px 2px 4px #000;">
                ${escapeHtml(enemy.name)}
              </div>
              <div class="vs-stat">
                <span class="vs-stat-label">❤️ PV</span>
                <span class="vs-stat-value">${enemy.hp}</span>
              </div>
              <div class="vs-stat">
                <span class="vs-stat-label">⚔️ ATK</span>
                <span class="vs-stat-value">${enemy.atk}</span>
              </div>
              <div class="vs-stat">
                <span class="vs-stat-label">🛡️ DEF</span>
                <span class="vs-stat-value">${enemy.def || 0}</span>
              </div>
            </div>
          </div>
        </div>
        
        <button class="vs-start-btn" id="vsStartBtn">
          <span>Démarrer le combat</span>
        </button>
      </div>
    `;
    
    document.body.appendChild(overlay);
    this.currentModal = overlay;
    
    // Créer particules
    const particlesContainer = overlay.querySelector('#combatParticles');
    this.createParticles(particlesContainer, 25, ['#ff0000', '#ffd700', '#ff6b6b', '#ffed4e']);
    
    // Manual start only: require user to press the Start button. The button will
    // run the combat simulation and replace the modal content with the combat log.
    const countdownEl = overlay.querySelector('#vsCountdown');
    if (countdownEl) countdownEl.textContent = 'Prêt — appuyez pour démarrer.';

    overlay.querySelector('#vsStartBtn').onclick = () => {
      const btn = overlay.querySelector('#vsStartBtn');
      btn.disabled = true;
      btn.textContent = '⏳ Combat en cours...';

      try {
        const combatLog = Combat.simulateFight(player, enemy, game || window.game);

        // Replace modal inner content with the combat log and a close button
        const modal = overlay.querySelector('.event-modal');
        modal.innerHTML = `${this.createCloseButton().outerHTML}<div class="modal-particles" id="combatResultParticles"></div><div class="combat-result-content">${combatLog}</div><div style="text-align:center;margin-top:20px;"><button class="vs-start-btn close-result-btn">Fermer</button></div>`;

        // Create some particles and wire close button
        const particles = modal.querySelector('#combatResultParticles');
        this.createParticles(particles, 25, ['#ff0000', '#ffd700']);

        modal.querySelector('.modal-close-btn').onclick = () => this.closeModal();
        modal.querySelector('.close-result-btn').onclick = () => this.closeModal();

        if (game && typeof game.updateUI === 'function') game.updateUI();
        if (game && game.renderer && typeof game.renderer.draw === 'function') game.renderer.draw(GameState.dungeon, GameState.players);
      } catch (e) {
        console.warn('Erreur lors du combat depuis la modal:', e);
        btn.disabled = false;
        btn.textContent = 'Démarrer le combat';
      }
    };
    
    // Vibration
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }
    
    // Bouton fermeture
    overlay.querySelector('.modal-close-btn').onclick = () => this.closeModal();
  }

  /**
   * Compat wrapper: showCombatVS(player, enemy, game)
   * Delegates to showCombatModal and starts Combat.start when the modal begins
   */
  showCombatVS(player, enemy, game) {
    // Reuse the existing modal; provide an onStart callback that triggers Combat.start
    this.showCombatModal(player, enemy, () => {
      try {
        if (typeof Combat !== 'undefined' && Combat.start) {
          Combat.start(player, game);
        }
      } catch (e) {
        console.warn('Erreur lors du démarrage du combat via showCombatVS', e);
      }
    });
  }
  
  startCombat(onStart) {
    this.closeModal();
    if (onStart) onStart();
  }
  
  // ═══════════════════════════════════════════════════════════════
  // 2. MODAL TRÉSOR - Coffre animé avec révélation
  // ═══════════════════════════════════════════════════════════════
  showTreasureModal(treasure, onClose) {
    if (this.isOpen) return;
    this.isOpen = true;
    
    // Son trésor
    ModalSounds.playTreasureSound();
    
    const overlay = document.createElement('div');
    overlay.className = 'event-modal-overlay';
    
    // Construire items HTML
    let itemsHTML = '';
    
    if (treasure.gold) {
      itemsHTML += `
        <div class="treasure-item">
          <div style="display: flex; align-items: center;">
            <span class="treasure-item-icon">💰</span>
            <span style="color: #fff; font-size: 22px; font-weight: 600;">Pièces d'or</span>
          </div>
          <span class="treasure-item-value">+${treasure.gold}</span>
        </div>
      `;
    }
    
    if (treasure.items && treasure.items.length > 0) {
      treasure.items.forEach((item, idx) => {
        itemsHTML += `
          <div class="treasure-item" style="animation-delay: ${2.2 + idx * 0.2}s;">
            <div style="display: flex; align-items: center;">
              <span class="treasure-item-icon">${this.getItemIcon(item)}</span>
              <span style="color: #fff; font-size: 22px; font-weight: 600;">${item.name}</span>
            </div>
            <span class="treasure-item-value">x${item.quantity || 1}</span>
          </div>
        `;
      });
    }
    
    if (treasure.xp) {
      itemsHTML += `
        <div class="treasure-item">
          <div style="display: flex; align-items: center;">
            <span class="treasure-item-icon">⭐</span>
            <span style="color: #fff; font-size: 22px; font-weight: 600;">Expérience</span>
          </div>
          <span class="treasure-item-value">+${treasure.xp} XP</span>
        </div>
      `;
    }
    
    overlay.innerHTML = `
      <div class="event-modal modal-treasure">
        ${this.createCloseButton().outerHTML}
        <div class="modal-particles" id="treasureParticles"></div>
        
        <div class="treasure-chest">
          <div class="treasure-chest-icon">💎</div>
        </div>
        
        <div class="treasure-title">✨ TRÉSOR DÉCOUVERT ! ✨</div>
        
        <div class="treasure-content">
          ${itemsHTML}
        </div>
        
        <button class="vs-start-btn" style="margin-top: 28px;" onclick="EventModals.closeModal()">
          Collecter le trésor
        </button>
      </div>
    `;
    
    document.body.appendChild(overlay);
    this.currentModal = overlay;
    
    // Particules dorées
    const particlesContainer = overlay.querySelector('#treasureParticles');
    this.createParticles(particlesContainer, 30, ['#ffd700', '#ffed4e', '#ffa500']);
    
    // Vibration
    if (navigator.vibrate) {
      navigator.vibrate([50, 100, 50, 100, 50, 100, 50]);
    }
    
    // Auto-close après 6 secondes
    this.autoCloseTimer = setTimeout(() => {
      this.closeModal();
      if (onClose) onClose();
    }, 6000);
    
    // Bouton fermeture
    overlay.querySelector('.modal-close-btn').onclick = () => {
      this.closeModal();
      if (onClose) onClose();
    };
  }
  
  // ═══════════════════════════════════════════════════════════════
  // 3. MODAL ÉNIGME - Interface interactive
  // ═══════════════════════════════════════════════════════════════
  showPuzzleModal(puzzle, onAnswer) {
    if (this.isOpen) return;
    this.isOpen = true;
    
    // Son énigme
    ModalSounds.playPuzzleSound();
    
    const overlay = document.createElement('div');
    overlay.className = 'event-modal-overlay';
    overlay.innerHTML = `
      <div class="event-modal modal-puzzle">
        ${this.createCloseButton().outerHTML}
        <div class="modal-particles" id="puzzleParticles"></div>
        
        <div class="puzzle-header">
          <div class="puzzle-icon">🧩</div>
          <div class="puzzle-title">ÉNIGME MYSTIQUE</div>
        </div>
        
        <div class="puzzle-question">
          ${puzzle.question}
        </div>
        
        <div class="puzzle-input-container">
          <input type="text" 
                 class="puzzle-input" 
                 id="puzzleAnswer" 
                 placeholder="Entrez votre réponse..."
                 autocomplete="off">
        </div>
        
        <div class="puzzle-hint" id="puzzleHint">
          💡 ${puzzle.hint}
        </div>
        
        <div class="puzzle-buttons">
          <button class="puzzle-btn puzzle-btn-submit" id="puzzleSubmit">
            ✓ VALIDER
          </button>
          <button class="puzzle-btn puzzle-btn-hint" id="puzzleHintBtn">
            💡 INDICE
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    this.currentModal = overlay;
    
    // Particules violettes
    const particlesContainer = overlay.querySelector('#puzzleParticles');
    this.createParticles(particlesContainer, 20, ['#9d4edd', '#c77dff', '#7b2cbf']);
    
    const input = overlay.querySelector('#puzzleAnswer');
    const submitBtn = overlay.querySelector('#puzzleSubmit');
    const hintBtn = overlay.querySelector('#puzzleHintBtn');
    const hint = overlay.querySelector('#puzzleHint');
    
    // Focus auto
    setTimeout(() => input.focus(), 500);
    
    // Afficher indice
    hintBtn.onclick = () => {
      hint.classList.add('show');
      hintBtn.disabled = true;
      hintBtn.style.opacity = '0.5';
      hintBtn.style.cursor = 'not-allowed';
    };
    
    // Soumettre réponse
    const submit = () => {
      const answer = input.value.trim().toLowerCase();
      const correct = puzzle.answers.some(a => a.toLowerCase() === answer);
      
      if (correct) {
        ModalSounds.playSuccessSound();
      } else {
        ModalSounds.playErrorSound();
      }
      
      this.closeModal();
      if (onAnswer) onAnswer(correct, answer);
    };
    
    submitBtn.onclick = submit;
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') submit();
    });
    
    // Bouton fermeture
    overlay.querySelector('.modal-close-btn').onclick = () => this.closeModal();
  }
  
  // ═══════════════════════════════════════════════════════════════
  // 4. MODAL REPOS - Animation de soin
  // ═══════════════════════════════════════════════════════════════
  showRestModal(player, healAmount, onClose) {
    if (this.isOpen) return;
    this.isOpen = true;
    
    // Son repos
    ModalSounds.playRestSound();
    
    const hpBefore = player.hp - healAmount;
    
    const overlay = document.createElement('div');
    overlay.className = 'event-modal-overlay';
    overlay.innerHTML = `
      <div class="event-modal modal-rest">
        ${this.createCloseButton().outerHTML}
        <div class="modal-particles" id="restParticles"></div>
        
        <div class="rest-icon">🛏️</div>
        <div class="rest-title">REPOS BIEN MÉRITÉ</div>
        
        <div class="rest-heal-animation">+${healAmount} PV ❤️</div>
        
        <div class="rest-description">
          Vous vous reposez dans cette salle paisible.<br>
          Vos forces reviennent progressivement...
        </div>
        
        <div class="rest-stats">
          <div class="rest-stat-row">
            <span style="font-weight: 600;">Points de Vie :</span>
            <div>
              <span class="rest-stat-before">${hpBefore}</span>
              <span class="rest-stat-arrow">→</span>
              <span class="rest-stat-after">${player.hp}</span>
            </div>
          </div>
        </div>
        
        <div class="modal-auto-close-indicator">
          ⏱️ Fermeture automatique dans 3s...
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    this.currentModal = overlay;
    
    // Particules vertes
    const particlesContainer = overlay.querySelector('#restParticles');
    this.createParticles(particlesContainer, 15, ['#00ff00', '#7fff00', '#00cc00']);
    
    // Vibration douce
    if (navigator.vibrate) {
      navigator.vibrate([30, 50, 30, 50, 30]);
    }
    
    // Auto-close après 3 secondes
    this.autoCloseTimer = setTimeout(() => {
      this.closeModal();
      if (onClose) onClose();
    }, 3000);
    
    // Bouton fermeture
    overlay.querySelector('.modal-close-btn').onclick = () => {
      clearTimeout(this.autoCloseTimer);
      this.closeModal();
      if (onClose) onClose();
    };
  }
  
  // ═══════════════════════════════════════════════════════════════
  // 5. MODAL MARCHAND - Boutique interactive
  // ═══════════════════════════════════════════════════════════════
  showMerchantModal(player, items, onPurchase) {
    if (this.isOpen) return;
    this.isOpen = true;
    
    // Son marchand
    ModalSounds.playMerchantSound();
    
    const overlay = document.createElement('div');
    overlay.className = 'event-modal-overlay';
    
    // Construire items HTML
    const itemsHTML = items.map((item, idx) => `
      <div class="merchant-item ${item.price > player.gold ? 'sold-out' : ''}" 
           data-item-id="${idx}">
        <div class="merchant-item-icon">${item.icon}</div>
        <div class="merchant-item-name">${item.name}</div>
        <div class="merchant-item-description">
          ${item.description}
        </div>
        <div class="merchant-item-price">
          <span>💰</span>
          <span>${item.price}</span>
        </div>
      </div>
    `).join('');
    
    overlay.innerHTML = `
      <div class="event-modal modal-merchant">
        ${this.createCloseButton().outerHTML}
        <div class="modal-particles" id="merchantParticles"></div>
        
        <div class="merchant-header">
          <div class="merchant-icon">🏪</div>
          <div class="merchant-title">BOUTIQUE DU MARCHAND</div>
        </div>
        
        <div class="merchant-gold" id="merchantGoldDisplay">
          <span class="merchant-gold-icon">💰</span>
          <span class="merchant-gold-amount" id="merchantGoldAmount">${player.gold}</span>
          <span style="color: #fff; font-weight: 600; font-size: 20px;">pièces d'or</span>
        </div>
        
        <div class="merchant-items">
          ${itemsHTML}
        </div>
        
        <button class="vs-start-btn" style="margin-top: 28px;" onclick="EventModals.closeModal()">
          Quitter la boutique
        </button>
      </div>
    `;
    
    document.body.appendChild(overlay);
    this.currentModal = overlay;
    
    // Particules bleues
    const particlesContainer = overlay.querySelector('#merchantParticles');
    this.createParticles(particlesContainer, 20, ['#00bfff', '#00d4ff', '#0080ff']);
    
    // Gérer les achats
    overlay.querySelectorAll('.merchant-item:not(.sold-out)').forEach(itemEl => {
      itemEl.onclick = () => {
        const itemId = parseInt(itemEl.dataset.itemId);
        const item = items[itemId];
        
        if (player.gold >= item.price) {
          player.gold -= item.price;
          
          // Animation d'achat
          itemEl.classList.add('sold-out');
          itemEl.style.transform = 'scale(0.95)';
          
          // Mettre à jour affichage or
          overlay.querySelector('#merchantGoldAmount').textContent = player.gold;
          
          // Mettre à jour autres items (si plus assez d'or)
          overlay.querySelectorAll('.merchant-item').forEach(el => {
            const id = parseInt(el.dataset.itemId);
            if (items[id].price > player.gold && !el.classList.contains('sold-out')) {
              el.classList.add('sold-out');
            }
          });
          
          // Callback
          if (onPurchase) onPurchase(item);
          
          // Son achat
          ModalSounds.playPurchaseSound();
          
          // Vibration
          if (navigator.vibrate) {
            navigator.vibrate(50);
          }
        }
      };
    });
    
    // Bouton fermeture
    overlay.querySelector('.modal-close-btn').onclick = () => this.closeModal();
  }
  
  // ═══════════════════════════════════════════════════════════════
  // 6. MODAL MYSTÈRE - Événements spéciaux
  // ═══════════════════════════════════════════════════════════════
  showMysteryModal(event, player, onComplete) {
    if (this.isOpen) return;
    this.isOpen = true;
    
    // Son mystère
    ModalSounds.playMysterySound();
    
    const overlay = document.createElement('div');
    overlay.className = 'event-modal-overlay';
    overlay.innerHTML = `
      <div class="event-modal modal-puzzle modal-mystery">
        ${this.createCloseButton().outerHTML}
        <div class="modal-particles" id="mysteryParticles"></div>
        
        <div class="puzzle-header">
          <div class="mystery-icon" style="animation: mysterySpin3D 3s ease-in-out infinite;">${event.icon}</div>
          <div class="mystery-title" style="color: #ff00ff; text-shadow: 0 0 30px #ff00ff, 3px 3px 6px #000;">
            🌀 SALLE MYSTÈRE ! 🌀
          </div>
        </div>
        
        <div style="text-align: center; margin: 35px 0;">
          <div style="font-size: 32px; color: #fff; margin: 25px 0; font-weight: 700; line-height: 1.5;">
            ${escapeHtml(event.name)}
          </div>
          <div style="font-size: 20px; color: #ccc; line-height: 1.8; padding: 0 30px;">
            ${escapeHtml(event.description)}
          </div>
        </div>
        
        <button class="vs-start-btn" style="margin-top: 28px;" id="mysteryActivate">
          Activer l'événement
        </button>
      </div>
    `;
    
    document.body.appendChild(overlay);
    this.currentModal = overlay;
    
    // Particules multicolores
    const particlesContainer = overlay.querySelector('#mysteryParticles');
    this.createParticles(particlesContainer, 25, ['#ff00ff', '#aa00ff', '#ff00aa', '#ffaa00']);
    
    // Vibration spéciale
    if (navigator.vibrate) {
      navigator.vibrate([50, 50, 50, 50, 100]);
    }
    
    overlay.querySelector('#mysteryActivate').onclick = () => {
      this.closeModal();
      if (onComplete) onComplete();
    };
    
    // Bouton fermeture
    overlay.querySelector('.modal-close-btn').onclick = () => this.closeModal();
  }

  // ═══════════════════════════════════════════════════════════════
  // Epic variants — wrappers that provide dramatic modals and integrate
  // with existing combat handlers (openChest, visitMerchant, puzzle handling)
  // ═══════════════════════════════════════════════════════════════
  showTreasureEpic(player, game) {
    if (this.isOpen) return;
    this.isOpen = true;

    ModalSounds.playTreasureSound();

    const overlay = document.createElement('div');
    overlay.className = 'event-modal-overlay';
    overlay.innerHTML = `
      <div class="event-modal modal-treasure modal-epic">
        ${this.createCloseButton().outerHTML}
        <div class="modal-particles" id="treasureParticles"></div>
        <div class="treasure-chest"><div class="treasure-chest-icon">💎</div></div>
        <div class="treasure-title">✨ TRÉSOR ÉPIQUE ! ✨</div>
        <div id="treasureContent" class="treasure-content"><div class="treasure-placeholder">Chargement...</div></div>
        <button class="vs-start-btn collect-btn" style="margin-top: 28px;">Collecter le trésor</button>
      </div>
    `;

    document.body.appendChild(overlay);
    this.currentModal = overlay;

    // Particules dorées
    const particlesContainer = overlay.querySelector('#treasureParticles');
    this.createParticles(particlesContainer, 40, ['#ffd700', '#ffed4e', '#ffa500']);

    // Laisser Combat.openChest remplir le contenu en mode épique
    try {
      if (typeof Combat !== 'undefined' && Combat.openChest) {
        Combat.openChest(player, game, true);
      }
    } catch (e) {
      console.warn('Impossible d\'ouvrir le coffre en mode épique', e);
    }

    // Bouton collecter ferme tout
    overlay.querySelector('.collect-btn').onclick = () => this.closeModal();
    overlay.querySelector('.modal-close-btn').onclick = () => this.closeModal();

    // Auto-close un peu plus tard
    this.autoCloseTimer = setTimeout(() => this.closeModal(), 9000);
  }

  showMerchantEpic(player, game) {
    // Générer un catalogue simple basé sur le niveau
    const basePrice = 20 + (player.level * 15);
    const items = [
      { icon: '❤️', name: 'Potion de Vie', description: 'Restaure 50 PV', price: Math.floor(basePrice * 0.6), type: 'HEALTH_POTION', effect: (p) => p.hp = Math.min(p.maxHp, p.hp + 50) },
      { icon: '💪', name: 'Potion de Force', description: '+3 ATK permanent', price: Math.floor(basePrice * 1.5), type: 'STRENGTH_POTION', effect: (p) => p.atk += 3 },
      { icon: '🛡️', name: 'Bouclier de Fer', description: '+2 DEF permanent', price: Math.floor(basePrice * 1.8), type: 'SHIELD', effect: (p) => p.def += 2 },
      { icon: '⚔️', name: 'Épée Enchantée', description: '+5 ATK permanent', price: Math.floor(basePrice * 2.5), type: 'SWORD', effect: (p) => p.atk += 5 }
    ];

    // Utiliser la modal existante
    this.showMerchantModal(player, items, (item) => {
      // Appliquer l'effet si présent, sinon ajouter en inventaire
      if (item.effect) {
        item.effect(player);
      } else if (item.type) {
        player.inventory.addItem(item.type, 1);
      }
      if (game && typeof game.updateUI === 'function') game.updateUI();
    });
  }

  showPuzzleEpic(player, puzzle, game) {
    // Réutilise la modal puzzle — gérer la récompense/pénalité via callback
    this.showPuzzleModal(puzzle, (correct, answer) => {
      if (correct) {
        if (puzzle.reward) {
          if (puzzle.reward.type === 'xp') player.xp = (player.xp || 0) + puzzle.reward.amount;
          if (puzzle.reward.type === 'gold') player.gold = (player.gold || 0) + puzzle.reward.amount;
          if (puzzle.reward.type === 'heal') player.hp = Math.min(player.maxHp, player.hp + puzzle.reward.amount);
        }
        ModalSounds.playSuccessSound();
        if (game) game.addLog('🧩', `${player.name} résout l'énigme et gagne une récompense !`);
      } else {
        if (puzzle.penalty) {
          if (puzzle.penalty.type === 'damage') {
            player.hp = Math.max(0, (player.hp || 0) - puzzle.penalty.amount);
            if (game) game.addLog('❌', `${player.name} échoue et perd ${puzzle.penalty.amount} PV`);
          }
        }
        ModalSounds.playErrorSound();
      }

      if (game && typeof game.updateUI === 'function') game.updateUI();
    });
  }

  showRestEpic(player, healAmount, game) {
    this.showRestModal(player, healAmount, () => {
      if (game) game.addLog('🛌', `${player.name} se repose et récupère ${healAmount} PV`);
      if (game && typeof game.updateUI === 'function') game.updateUI();
    });
  }
}


// Export global
const EventModals = new EventModalSystem();

// ═══════════════════════════════════════════════════════
// 🎨 PATCHS AAA+ - MODALES ÉVÉNEMENTIELLES
// ═══════════════════════════════════════════════════════

// Sauvegarder les méthodes originales
const originalShowMerchant = EventModals.showMerchantModal ? EventModals.showMerchantModal.bind(EventModals) : null;
const originalShowCombat = EventModals.showCombatModal ? EventModals.showCombatModal.bind(EventModals) : null;

// Patch showMerchantModal - onClose optionnel
if (originalShowMerchant) {
  EventModals.showMerchantModal = function(onClose) {
    console.log('🛒 Boutique AAA+ déclenchée');
    
    if (EventModals.isOpen) {
      EventModals.closeModal();
    }
    
    const player = GameState?.players?.[0];
    const game = window.game;
    
    const shopModal = new ShopModalAAA();
    shopModal.show(player, game, () => {
      console.log('🛒 Boutique fermée');
      if (onClose && typeof onClose === 'function') {
        onClose();
      }
      if (game) game.updateUI();
    });
  };
}

// Patch showCombatModal - Bypass (combat direct)
if (originalShowCombat) {
  EventModals.showCombatModal = function(player, enemy, onStart) {
    console.log('⚔️ Combat de salle (bypass - lancement direct)');
    
    // Pas de modale, lancer le combat directement
    if (onStart && typeof onStart === 'function') {
      onStart();
    }
  };
}

console.log('✅ Modales AAA+ patchées sur instance EventModals');
console.log('🎬 Système de modals événementiels chargé');