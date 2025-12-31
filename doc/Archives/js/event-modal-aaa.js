/* ═══════════════════════════════════════════════════════
   📜 ÉVÉNEMENTS AAA+ - THE LAST COVENANT
   Système événementiel unifié avec design AAA+
   ═══════════════════════════════════════════════════════ */

class EventModalAAA {
  constructor() {
    this.currentModal = null;
    this.currentBackground = null;
    this.isOpen = false;
    
    console.log('📜 Event Modal AAA+ initialized');
  }
  
  /* ═══════════════════════════════════════════════════════
     💎 MODALE TRÉSOR
     ═══════════════════════════════════════════════════════ */
  
  async showTreasure(treasure, player, game, onClose) {
    if (this.isOpen) return;
    this.isOpen = true;

    // Background
    const background = this.createBackground('treasure');

    // Overlay
    const overlay = this.createOverlay();
    const container = this.createContainer();

    // Header
    const header = this.createHeader('💎', 'Coffre au Trésor', 'treasure');

    // Content
    const content = document.createElement('div');
    content.className = 'event-modal-content';
    content.innerHTML = `
      <div class="treasure-reveal">
        <div class="treasure-chest-icon">📦</div>
        <p style="font-family: 'Cinzel', serif; font-size: 18px; color: #FFD700; margin-bottom: 20px;">
          Vous ouvrez le coffre et découvrez...
        </p>
        <div class="treasure-items-list" id="treasure-items"></div>
      </div>
    `;

    const itemsList = content.querySelector('#treasure-items');
    const treasureReveal = content.querySelector('.treasure-reveal');

    // 🎰 SI ITEMS: Révélation avec slot machine AVANT affichage de la liste
    if (treasure.items && treasure.items.length > 0 && typeof lootRevealSystem !== 'undefined') {
      // Zone de roll
      const rollZone = document.createElement('div');
      rollZone.className = 'loot-roll-zone';
      rollZone.style.marginBottom = '20px';
      // ✅ CORRIGÉ: Insérer dans treasureReveal, pas dans content
      treasureReveal.insertBefore(rollZone, itemsList);

      // Ajouter au DOM d'abord pour que l'animation soit visible
      container.appendChild(header);
      container.appendChild(content);
      overlay.appendChild(container);
      document.body.appendChild(background);
      document.body.appendChild(overlay);

      // Animation d'entrée
      setTimeout(() => {
        overlay.style.opacity = '1';
        container.style.transform = 'translateY(0) scale(1)';
      }, 10);

      // Révéler chaque item séquentiellement avec la slot machine
      for (let i = 0; i < treasure.items.length; i++) {
        const item = treasure.items[i];

        // Convertir l'item en format compatible avec le système de loot reveal
        const itemData = this.prepareItemForReveal(item);

        // Attendre la révélation avec animation
        await lootRevealSystem.revealItem(itemData, rollZone, () => {
          console.log(`✨ Item ${i + 1}/${treasure.items.length} révélé:`, itemData.name);
        });

        // Petite pause entre chaque item pour ne pas être overwhelmed
        if (i < treasure.items.length - 1) {
          await this.delay(800);
        }
      }

      // Retirer la zone de roll après toutes les révélations
      if (rollZone.parentNode) {
        rollZone.parentNode.removeChild(rollZone);
      }

      // Attendre un peu avant d'afficher la liste finale
      await this.delay(500);
    } else {
      // Pas d'items ou système non chargé, affichage normal
      container.appendChild(header);
      container.appendChild(content);
      overlay.appendChild(container);
      document.body.appendChild(background);
      document.body.appendChild(overlay);

      // Animation d'entrée
      setTimeout(() => {
        overlay.style.opacity = '1';
        container.style.transform = 'translateY(0) scale(1)';
      }, 10);
    }
    
    // Or / Rubis
    if (treasure.gold && treasure.gold > 0) {
      const goldItem = document.createElement('div');
      goldItem.className = 'treasure-item';
      goldItem.style.animationDelay = '0.2s';
      goldItem.innerHTML = `
        <div style="display: flex; align-items: center;">
          <span class="treasure-item-icon">💰</span>
          <span class="treasure-item-name">Pièces d'Or</span>
        </div>
        <span class="treasure-item-value">+${treasure.gold}</span>
      `;
      itemsList.appendChild(goldItem);

      // 💰 EFFET PARTICULES: Pluie de pièces
      if (typeof particleSystem !== 'undefined') {
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 3;
        particleSystem.createCoinRain(centerX, centerY, Math.min(20, treasure.gold));
      }

      // Ajouter l'or au joueur
      if (player.inventory) {
        player.inventory.addItem('RUBY', treasure.gold);
      }
    }
    
    // Items
    if (treasure.items && treasure.items.length > 0) {
      treasure.items.forEach((item, idx) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'treasure-item';
        itemElement.style.animationDelay = `${0.4 + idx * 0.2}s`;

        const itemIcon = this.getItemIcon(item);
        const itemName = item.name || item.type || 'Objet Mystérieux';
        const quantity = item.quantity || 1;

        itemElement.innerHTML = `
          <div style="display: flex; align-items: center;">
            <span class="treasure-item-icon">${itemIcon}</span>
            <span class="treasure-item-name">${itemName}</span>
          </div>
          <span class="treasure-item-value">x${quantity}</span>
        `;
        itemsList.appendChild(itemElement);

        // ✨ EFFET PARTICULES: Étincelles pour chaque item
        if (typeof particleSystem !== 'undefined' && idx === 0) {
          // Seulement pour le premier item pour ne pas spam
          const rect = container.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 3;

          // Sparkles basés sur la rareté
          const itemData = this.prepareItemForReveal(item);
          const sparkleCount = itemData.rarity === 'legendary' ? 30 :
                               itemData.rarity === 'rare' ? 20 : 15;
          particleSystem.createSparkles(centerX, centerY, sparkleCount);
        }

        // Ajouter l'item au joueur
        if (player.inventory) {
          player.inventory.addItem(item.type || item.id, quantity);
        }
      });
    }
    
    // XP
    if (treasure.xp && treasure.xp > 0) {
      const xpItem = document.createElement('div');
      xpItem.className = 'treasure-item';
      xpItem.style.animationDelay = `${0.6 + (treasure.items?.length || 0) * 0.2}s`;
      xpItem.innerHTML = `
        <div style="display: flex; align-items: center;">
          <span class="treasure-item-icon">⭐</span>
          <span class="treasure-item-name">Expérience</span>
        </div>
        <span class="treasure-item-value">+${treasure.xp}</span>
      `;
      itemsList.appendChild(xpItem);
      
      // Ajouter l'XP
      if (player) {
        player.xp = (player.xp || 0) + treasure.xp;
      }
    }
    
    // Boutons
    const buttons = this.createButtons([
      {
        text: '✓ Prendre',
        className: 'event-btn-success',
        onClick: () => {
          if (game && typeof game.updateUI === 'function') {
            game.updateUI();
          }
          this.close(onClose);
        }
      }
    ]);
    
    container.appendChild(header);
    container.appendChild(content);
    container.appendChild(buttons);
    overlay.appendChild(container);
    
    this.appendToBody(background, overlay);
  }
  
  /* ═══════════════════════════════════════════════════════
     🧩 MODALE ÉNIGME
     ═══════════════════════════════════════════════════════ */
  
  showPuzzle(puzzle, player, game, onAnswer) {
    if (this.isOpen) return;
    this.isOpen = true;
    
    // Background
    const background = this.createBackground('puzzle');
    
    // Overlay
    const overlay = this.createOverlay();
    const container = this.createContainer();
    
    // Header
    const header = this.createHeader('🧩', 'Énigme Mystique', 'puzzle');
    
    // Content
    const content = document.createElement('div');
    content.className = 'event-modal-content';
    content.innerHTML = `
      <div class="puzzle-question">
        ${puzzle.question}
      </div>
      
      <div class="puzzle-input-container">
        <input 
          type="text" 
          class="puzzle-input" 
          id="puzzle-answer-input" 
          placeholder="Entrez votre réponse..."
          autocomplete="off"
        />
      </div>
      
      <div class="puzzle-hint" id="puzzle-hint">
        💡 ${puzzle.hint}
      </div>
    `;
    
    // Boutons
    const buttons = this.createButtons([
      {
        text: '💡 Indice',
        className: '',
        onClick: () => {
          const hint = document.getElementById('puzzle-hint');
          if (hint) {
            hint.classList.add('show');
          }
        }
      },
      {
        text: '✓ Valider',
        className: 'event-btn-success',
        onClick: () => {
          const input = document.getElementById('puzzle-answer-input');
          if (!input) return;
          
          const answer = input.value.trim().toLowerCase();
          const correct = puzzle.answers.some(a => a.toLowerCase() === answer);
          
          this.close(() => {
            if (onAnswer) onAnswer(correct, answer);
            
            if (correct) {
              // Appliquer la récompense
              if (puzzle.reward) {
                if (puzzle.reward.type === 'RUBY') {
                  player.inventory?.addItem('RUBY', puzzle.reward.amount);
                  this.showMessage(`✅ Bonne réponse ! +${puzzle.reward.amount} or`, 'success');
                } else if (puzzle.reward.type) {
                  player.inventory?.addItem(puzzle.reward.type, puzzle.reward.amount);
                  this.showMessage(`✅ Bonne réponse ! Item obtenu !`, 'success');
                }
              }
              
              // Statistiques
              if (player.stats) {
                player.stats.riddlesSolved = (player.stats.riddlesSolved || 0) + 1;
              }
            } else {
              // Pénalité
              if (puzzle.wrongPenalty && player) {
                player.hp = Math.max(1, player.hp - puzzle.wrongPenalty);
                this.showMessage(`❌ Mauvaise réponse ! -${puzzle.wrongPenalty} HP`, 'danger');
              }
            }
            
            if (game && typeof game.updateUI === 'function') {
              game.updateUI();
            }
          });
        }
      }
    ]);
    
    container.appendChild(header);
    container.appendChild(content);
    container.appendChild(buttons);
    overlay.appendChild(container);
    
    this.appendToBody(background, overlay);
    
    // Focus automatique
    setTimeout(() => {
      const input = document.getElementById('puzzle-answer-input');
      if (input) input.focus();
    }, 500);
  }
  
  /* ═══════════════════════════════════════════════════════
     🪤 MODALE PIÈGE
     ═══════════════════════════════════════════════════════ */
  
  showTrap(trap, player, game, onClose) {
    if (this.isOpen) return;
    this.isOpen = true;
    
    // Background
    const background = this.createBackground('trap');
    
    // Overlay
    const overlay = this.createOverlay();
    const container = this.createContainer();
    
    // Header
    const header = this.createHeader('⚠️', 'Piège Mortel', 'trap');
    
    // Content
    const damage = trap.damage || Math.floor(Math.random() * 5) + 3;
    
    const content = document.createElement('div');
    content.className = 'event-modal-content';
    content.innerHTML = `
      <div class="trap-warning">
        <div class="trap-icon">💀</div>
        <div class="trap-description">
          ${trap.description || 'Vous déclenchez un piège mortel !'}
        </div>
        <div class="trap-damage">
          -${damage} HP
        </div>
      </div>
    `;
    
    // Appliquer les dégâts
    if (player) {
      player.hp = Math.max(0, player.hp - damage);
      
      if (player.hp <= 0) {
        player.alive = false;
      }
    }
    
    // Boutons
    const buttons = this.createButtons([
      {
        text: '😰 Continuer',
        className: 'event-btn-danger',
        onClick: () => {
          if (game && typeof game.updateUI === 'function') {
            game.updateUI();
          }
          this.close(onClose);
        }
      }
    ]);
    
    container.appendChild(header);
    container.appendChild(content);
    container.appendChild(buttons);
    overlay.appendChild(container);
    
    this.appendToBody(background, overlay);
  }
  
  /* ═══════════════════════════════════════════════════════
     📖 MODALE ÉVÉNEMENT NARRATIF
     ═══════════════════════════════════════════════════════ */
  
  showNarrative(event, player, game, onChoice) {
    if (this.isOpen) return;
    this.isOpen = true;
    
    // Background
    const background = this.createBackground('narrative');
    
    // Overlay
    const overlay = this.createOverlay();
    const container = this.createContainer();
    
    // Header
    const header = this.createHeader(event.icon || '📜', event.title || 'Événement', event.type || 'narrative');
    
    // Content
    const content = document.createElement('div');
    content.className = 'event-modal-content';
    content.innerHTML = `
      <div class="narrative-content">
        ${event.image ? `<div class="narrative-image">${event.image}</div>` : ''}
        <div class="narrative-text">
          ${event.text}
        </div>
      </div>
    `;
    
    // Choix
    if (event.choices && event.choices.length > 0) {
      const choicesDiv = document.createElement('div');
      choicesDiv.className = 'narrative-choices';
      
      event.choices.forEach((choice, idx) => {
        const choiceElement = document.createElement('div');
        choiceElement.className = 'narrative-choice';
        choiceElement.innerHTML = `
          <span class="narrative-choice-icon">${choice.icon || '▶️'}</span>
          <span class="narrative-choice-text">${choice.text}</span>
        `;
        
        choiceElement.onclick = () => {
          this.close(() => {
            if (onChoice) onChoice(idx, choice);
            
            // Appliquer les effets
            if (choice.effect) {
              choice.effect(player, game);
            }
            
            if (game && typeof game.updateUI === 'function') {
              game.updateUI();
            }
          });
        };
        
        choicesDiv.appendChild(choiceElement);
      });
      
      content.appendChild(choicesDiv);
    } else {
      // Pas de choix, juste un bouton continuer
      const buttons = this.createButtons([
        {
          text: '→ Continuer',
          className: 'event-btn-primary',
          onClick: () => this.close(onChoice)
        }
      ]);
      container.appendChild(buttons);
    }
    
    container.appendChild(header);
    container.appendChild(content);
    overlay.appendChild(container);
    
    this.appendToBody(background, overlay);
  }
  
  /* ═══════════════════════════════════════════════════════
     🛠️ UTILITAIRES
     ═══════════════════════════════════════════════════════ */
  
  createBackground(type) {
    const bg = document.createElement('div');
    bg.className = `event-modal-background ${type}`;
    return bg;
  }
  
  createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'event-modal-overlay';
    return overlay;
  }
  
  createContainer() {
    const container = document.createElement('div');
    container.className = 'event-modal-container';
    return container;
  }
  
  createHeader(icon, title, type = '') {
    const header = document.createElement('div');
    header.className = 'event-modal-header';
    
    header.innerHTML = `
      <h1 class="event-modal-title ${type}">
        <span class="event-modal-title-icon">${icon}</span>
        ${title}
      </h1>
      <button class="event-modal-close-btn">✕</button>
    `;
    
    header.querySelector('.event-modal-close-btn').onclick = () => this.close();
    
    return header;
  }
  
  createButtons(buttons) {
    const container = document.createElement('div');
    container.className = 'event-modal-buttons';
    
    buttons.forEach(btn => {
      const button = document.createElement('button');
      button.className = `event-btn ${btn.className || ''}`;
      button.textContent = btn.text;
      button.onclick = btn.onClick;
      container.appendChild(button);
    });
    
    return container;
  }
  
  appendToBody(background, overlay) {
    document.body.appendChild(background);
    document.body.appendChild(overlay);
    
    this.currentBackground = background;
    this.currentModal = overlay;
    
    // Animation d'entrée
    setTimeout(() => {
      overlay.style.opacity = '1';
      const container = overlay.querySelector('.event-modal-container');
      if (container) {
        container.style.transform = 'translateY(0) scale(1)';
      }
    }, 10);
    
    // Click overlay pour fermer
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.close();
      }
    });
  }
  
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
      'AXE': '🪓',
      'LEGENDARY_SWORD': '⚔️',
      'LEGENDARY_ARMOR': '🥋',
      'PHOENIX_FEATHER': '🪶',
      'ANCIENT_AMULET': '🔮',
      'TELEPORT_SCROLL': '📜',
      'INVULNERABILITY_SCROLL': '📜'
    };
    
    return icons[item.type] || icons[item.id] || icons[item.name] || '📦';
  }
  
  showMessage(text, type = 'info') {
    const message = document.createElement('div');
    message.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: ${type === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(220, 38, 38, 0.95)'};
      color: white;
      padding: 20px 40px;
      border-radius: 8px;
      font-family: 'Cinzel', serif;
      font-size: 16px;
      font-weight: 700;
      z-index: 10002;
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.8);
      animation: messagePopIn 0.3s ease;
      max-width: 80%;
      text-align: center;
    `;
    message.textContent = text;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.style.animation = 'messagePopOut 0.3s ease forwards';
      setTimeout(() => message.remove(), 300);
    }, 3000);
  }
  
  close(onClose) {
    if (!this.currentModal) return;

    this.currentModal.style.opacity = '0';
    const container = this.currentModal.querySelector('.event-modal-container');
    if (container) {
      container.style.transform = 'translateY(30px) scale(0.95)';
    }

    setTimeout(() => {
      if (this.currentModal) {
        this.currentModal.remove();
        this.currentModal = null;
      }
      if (this.currentBackground) {
        this.currentBackground.remove();
        this.currentBackground = null;
      }
      this.isOpen = false;

      if (onClose) onClose();
    }, 300);
  }

  /* ═══════════════════════════════════════════════════════
     🎰 HELPERS POUR LOOT REVEAL SYSTEM
     ═══════════════════════════════════════════════════════ */

  /**
   * Convertit un item du jeu au format attendu par LootRevealSystem
   */
  prepareItemForReveal(item) {
    // Si l'item vient de ITEMS_DATABASE, il a déjà le bon format
    if (item.icon && item.name && item.rarity) {
      return item;
    }

    // Sinon, on le construit à partir de l'ID/type
    const itemId = item.id || item.type;

    // Essayer de récupérer depuis ITEMS_DATABASE
    if (typeof ITEMS_DATABASE !== 'undefined') {
      for (const category in ITEMS_DATABASE) {
        if (ITEMS_DATABASE[category][itemId]) {
          return ITEMS_DATABASE[category][itemId];
        }
      }
    }

    // Fallback: créer un item basique
    return {
      id: itemId,
      name: item.name || itemId,
      icon: this.getItemIcon(item),
      rarity: item.rarity || 'common',
      type: item.type || 'MISC'
    };
  }

  /**
   * Helper pour pause async
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/* ═══════════════════════════════════════════════════════
   🎬 ANIMATIONS CSS
   ═══════════════════════════════════════════════════════ */

const eventAnimationsStyle = document.createElement('style');
eventAnimationsStyle.textContent = `
  @keyframes messagePopIn {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.8);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
  
  @keyframes messagePopOut {
    from {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    to {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.8);
    }
  }
`;
document.head.appendChild(eventAnimationsStyle);

/* ═══════════════════════════════════════════════════════
   🌍 EXPORT GLOBAL
   ═══════════════════════════════════════════════════════ */

if (typeof window !== 'undefined') {
  window.EventModalAAA = EventModalAAA;
  // ✅ Créer une instance globale
  window.eventModalAAA = new EventModalAAA();
}

console.log('📜 Event Modal AAA+ loaded');

/* ═══════════════════════════════════════════════════════
   🔧 PATCHES POUR COMPATIBILITÉ AVEC EventModals
   ═══════════════════════════════════════════════════════ */

// Patcher EventModals.showPuzzleModal pour utiliser EventModalAAA
if (typeof EventModals !== 'undefined' && window.eventModalAAA) {
  console.log('🔧 Application du patch showPuzzleModal...');

  const originalShowPuzzle = EventModals.showPuzzleModal.bind(EventModals);

  EventModals.showPuzzleModal = function(puzzle, onAnswer) {
    console.log('🧩 Puzzle room (using EventModalAAA)');

    // Récupérer le joueur et le game depuis window
    const player = window.GameState?.players?.[0];
    const game = window.game;

    if (!player || !game) {
      console.warn('⚠️ Player ou Game non trouvé, fallback vers ancienne modale');
      return originalShowPuzzle(puzzle, onAnswer);
    }

    // Utiliser le nouveau système AAA+
    try {
      window.eventModalAAA.showPuzzle(puzzle, player, game, onAnswer);
    } catch (error) {
      console.error('❌ Erreur EventModalAAA.showPuzzle:', error);
      // Fallback vers l'ancienne modale en cas d'erreur
      originalShowPuzzle(puzzle, onAnswer);
    }
  };

  console.log('✅ EventModals.showPuzzleModal patché vers EventModalAAA');
}

// Patcher EventModals.showRestModal pour utiliser RestModalAAA
if (typeof EventModals !== 'undefined' && typeof RestModalAAA !== 'undefined') {
  console.log('🔧 Application du patch showRestModal...');

  const originalShowRest = EventModals.showRestModal.bind(EventModals);

  EventModals.showRestModal = function(player, healAmount, onClose) {
    console.log('🛏️ Rest room (using RestModalAAA)');

    // Récupérer le game depuis window
    const game = window.game;

    if (!game) {
      console.warn('⚠️ Game non trouvé, fallback vers ancienne modale');
      return originalShowRest(player, healAmount, onClose);
    }

    // Utiliser le nouveau système AAA+
    try {
      const restModal = new RestModalAAA();
      restModal.show(player, game, () => {
        if (onClose) onClose();
      });
    } catch (error) {
      console.error('❌ Erreur RestModalAAA.show:', error);
      // Fallback vers l'ancienne modale en cas d'erreur
      originalShowRest(player, healAmount, onClose);
    }
  };

  console.log('✅ EventModals.showRestModal patché vers RestModalAAA');
}

// Patcher EventModals.showTreasureModal pour utiliser EventModalAAA
if (typeof EventModals !== 'undefined' && window.eventModalAAA) {
  console.log('🔧 Application du patch showTreasureModal...');

  const originalShowTreasure = EventModals.showTreasureModal.bind(EventModals);

  EventModals.showTreasureModal = function(treasure, onClose) {
    console.log('💎 Treasure room (using EventModalAAA)');

    // Récupérer le joueur et le game depuis window
    const player = window.GameState?.players?.[0];
    const game = window.game;

    if (!player || !game) {
      console.warn('⚠️ Player ou Game non trouvé, fallback vers ancienne modale');
      return originalShowTreasure(treasure, onClose);
    }

    // Utiliser le nouveau système AAA+
    try {
      window.eventModalAAA.showTreasure(treasure, player, game, onClose);
    } catch (error) {
      console.error('❌ Erreur EventModalAAA.showTreasure:', error);
      // Fallback vers l'ancienne modale en cas d'erreur
      originalShowTreasure(treasure, onClose);
    }
  };

  console.log('✅ EventModals.showTreasureModal patché vers EventModalAAA');
}

// Patcher EventModals.showMerchantModal pour utiliser ShopModalAAA
if (typeof EventModals !== 'undefined' && typeof ShopModalAAA !== 'undefined') {
  console.log('🔧 Application du patch showMerchantModal...');

  const originalShowMerchant = EventModals.showMerchantModal.bind(EventModals);

  EventModals.showMerchantModal = function(player, items, onPurchase) {
    console.log('🛒 Merchant room (using ShopModalAAA)');

    // Récupérer le game depuis window
    const game = window.game;

    if (!game) {
      console.warn('⚠️ Game non trouvé, fallback vers ancienne modale');
      return originalShowMerchant(player, items, onPurchase);
    }

    // Utiliser le nouveau système AAA+
    try {
      const shopModal = new ShopModalAAA();
      shopModal.show(player, game, () => {
        console.log('✅ Boutique fermée');
      });
    } catch (error) {
      console.error('❌ Erreur ShopModalAAA.show:', error);
      // Fallback vers l'ancienne modale en cas d'erreur
      originalShowMerchant(player, items, onPurchase);
    }
  };

  console.log('✅ EventModals.showMerchantModal patché vers ShopModalAAA');
}
