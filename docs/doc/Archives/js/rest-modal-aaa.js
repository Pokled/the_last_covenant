/* ═══════════════════════════════════════════════════════
   🛏️ ZONE DE REPOS AAA+ - THE LAST COVENANT
   Système de repos avec actions de récupération
   ═══════════════════════════════════════════════════════ */

class RestModalAAA {
  constructor() {
    this.currentModal = null;
    this.isOpen = false;
    this.rested = false;
    
    console.log('🛏️ Rest Modal AAA+ initialized');
  }
  
  /* ═══════════════════════════════════════════════════════
     🎨 ACTIONS DE REPOS
     ═══════════════════════════════════════════════════════ */
  
  static REST_ACTIONS = {
    SLEEP: {
      id: 'SLEEP',
      name: 'Dormir',
      icon: '🛏️',
      description: 'Restaure 100% de vos PV',
      effect: (player) => {
        const healed = player.maxHp - player.hp;
        player.hp = player.maxHp;
        return {
          success: true,
          message: `Vous dormez profondément. +${healed} PV restaurés !`,
          benefit: `+${healed} HP`
        };
      }
    },
    
    MEDITATE: {
      id: 'MEDITATE',
      name: 'Méditer',
      icon: '🧘',
      description: 'Réduit le Stress et la Corruption de 50%',
      effect: (player) => {
        const stressReduced = Math.floor((player.stress || 0) * 0.5);
        const corruptionReduced = Math.floor((player.corruption || 0) * 0.5);
        
        player.stress = Math.max(0, (player.stress || 0) - stressReduced);
        player.corruption = Math.max(0, (player.corruption || 0) - corruptionReduced);
        
        return {
          success: true,
          message: `Vous méditez en silence. L'esprit s'apaise...`,
          benefit: `-${stressReduced} Stress, -${corruptionReduced} Corruption`
        };
      }
    },
    
    EAT: {
      id: 'EAT',
      name: 'Manger',
      icon: '🍖',
      description: 'Consomme 1 ration. +30 HP et bonus temporaire',
      cost: { type: 'RATION', amount: 1 },
      effect: (player) => {
        const heal = Math.min(30, player.maxHp - player.hp);
        player.hp = Math.min(player.hp + 30, player.maxHp);
        
        // Bonus temporaire
        player.tempBuffs = player.tempBuffs || {};
        player.tempBuffs.wellFed = {
          duration: 3,
          atk: 2,
          def: 2
        };
        
        return {
          success: true,
          message: `Vous mangez un repas copieux. +${heal} PV, +2 ATK/DEF pour 3 tours !`,
          benefit: `+${heal} HP, +2 ATK/DEF (3 tours)`
        };
      },
      check: (player) => {
        const rations = player.inventory?.getItemCount('RATION') || 0;
        return rations >= 1;
      },
      errorMessage: 'Vous n\'avez pas de rations !'
    },
    
    REPAIR: {
      id: 'REPAIR',
      name: 'Réparer Équipement',
      icon: '🔧',
      description: 'Coûte 20 or. +5 DEF permanent',
      cost: { type: 'RUBY', amount: 20 },
      effect: (player) => {
        player.inventory.removeItem('RUBY', 20);
        player.def = (player.def || 0) + 5;
        
        return {
          success: true,
          message: `Vous réparez votre équipement. +5 DEF permanent !`,
          benefit: `+5 DEF permanent`
        };
      },
      check: (player) => {
        const gold = player.inventory?.getItemCount('RUBY') || 0;
        return gold >= 20;
      },
      errorMessage: 'Or insuffisant ! (20 requis)'
    },
    
    SHARPEN: {
      id: 'SHARPEN',
      name: 'Aiguiser Armes',
      icon: '⚔️',
      description: 'Coûte 20 or. +3 ATK permanent',
      cost: { type: 'RUBY', amount: 20 },
      effect: (player) => {
        player.inventory.removeItem('RUBY', 20);
        player.atk = (player.atk || 0) + 3;
        
        return {
          success: true,
          message: `Vous aiguisez vos armes. +3 ATK permanent !`,
          benefit: `+3 ATK permanent`
        };
      },
      check: (player) => {
        const gold = player.inventory?.getItemCount('RUBY') || 0;
        return gold >= 20;
      },
      errorMessage: 'Or insuffisant ! (20 requis)'
    },
    
    PRAY: {
      id: 'PRAY',
      name: 'Prier',
      icon: '🙏',
      description: 'Chance d\'obtenir une bénédiction divine',
      effect: (player) => {
        const blessing = Math.random();
        
        if (blessing < 0.33) {
          player.maxHp = (player.maxHp || 50) + 5;
          player.hp = Math.min(player.hp + 5, player.maxHp);
          return {
            success: true,
            message: `Les dieux vous bénissent ! +5 PV Max !`,
            benefit: `+5 HP Max`
          };
        } else if (blessing < 0.66) {
          const xpGain = 100;
          player.xp = (player.xp || 0) + xpGain;
          return {
            success: true,
            message: `Une lumière divine vous illumine. +${xpGain} XP !`,
            benefit: `+${xpGain} XP`
          };
        } else {
          player.inventory?.addItem('HEALTH_POTION', 1);
          return {
            success: true,
            message: `Une potion de soin apparaît devant vous !`,
            benefit: `+1 Potion de Soin`
          };
        }
      }
    }
  };
  
  /* ═══════════════════════════════════════════════════════
     🎭 AFFICHER MODALE REPOS
     ═══════════════════════════════════════════════════════ */
  
  show(player, game, onClose) {
    if (this.isOpen) return;
    this.isOpen = true;
    this.rested = false;
    
    // Background immersif
    const background = document.createElement('div');
    background.className = 'rest-modal-background';
    document.body.appendChild(background);
    
    // Overlay
    const overlay = document.createElement('div');
    overlay.className = 'rest-modal-overlay';
    overlay.id = 'rest-modal-overlay';
    
    // Container
    const container = document.createElement('div');
    container.className = 'rest-modal-container';
    
    // Header
    const header = this.createHeader();
    
    // Content
    const content = this.createContent(player, game);
    
    // Buttons
    const buttons = this.createButtons(onClose);
    
    container.appendChild(header);
    container.appendChild(content);
    container.appendChild(buttons);
    overlay.appendChild(container);
    document.body.appendChild(overlay);
    
    this.currentModal = overlay;
    this.currentBackground = background;
    
    // Événement fermeture
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.close(onClose);
      }
    });
    
    // Animation d'entrée
    setTimeout(() => {
      overlay.style.opacity = '1';
      container.style.transform = 'translateY(0) scale(1)';
    }, 10);
  }
  
  /* ═══════════════════════════════════════════════════════
     📜 CRÉER HEADER
     ═══════════════════════════════════════════════════════ */
  
  createHeader() {
    const header = document.createElement('div');
    header.className = 'rest-modal-header';
    
    header.innerHTML = `
      <h1 class="rest-modal-title">
        <span class="rest-modal-title-icon">🔥</span>
        Zone de Repos
      </h1>
      <button class="rest-modal-close-btn">✕</button>
    `;
    
    header.querySelector('.rest-modal-close-btn').onclick = () => this.close();
    
    return header;
  }
  
  /* ═══════════════════════════════════════════════════════
     📄 CRÉER CONTENT
     ═══════════════════════════════════════════════════════ */
  
  createContent(player, game) {
    const content = document.createElement('div');
    content.className = 'rest-modal-content';
    
    // Description
    const description = document.createElement('div');
    description.className = 'rest-description';
    description.innerHTML = `
      <em>"Vous découvrez un sanctuaire paisible. Les flammes d'un feu de camp dansent doucement, invitant au repos..."</em>
    `;
    content.appendChild(description);
    
    // État du joueur
    const status = this.createPlayerStatus(player);
    content.appendChild(status);
    
    // Actions de repos
    const actions = this.createRestActions(player, game);
    content.appendChild(actions);
    
    return content;
  }
  
  /* ═══════════════════════════════════════════════════════
     📊 CRÉER ÉTAT JOUEUR
     ═══════════════════════════════════════════════════════ */
  
  createPlayerStatus(player) {
    const section = document.createElement('div');
    section.className = 'rest-modal-section';
    
    const hpPercent = (player.hp / player.maxHp) * 100;
    const hpClass = hpPercent <= 30 ? 'danger' : hpPercent <= 60 ? 'warning' : 'safe';
    
    const stress = player.stress || 0;
    const corruption = player.corruption || 0;
    const gold = player.inventory?.getItemCount('RUBY') || 0;
    
    section.innerHTML = `
      <h2 class="rest-section-title">
        <span class="rest-section-icon">📊</span>
        État du Voyageur
      </h2>
      <div class="rest-player-status">
        <div class="rest-status-item">
          <span class="rest-status-label">❤️ Santé</span>
          <span class="rest-status-value ${hpClass}">${player.hp}/${player.maxHp}</span>
        </div>
        <div class="rest-status-item">
          <span class="rest-status-label">😰 Stress</span>
          <span class="rest-status-value ${stress > 70 ? 'danger' : stress > 40 ? 'warning' : 'safe'}">${stress}/100</span>
        </div>
        <div class="rest-status-item">
          <span class="rest-status-label">💀 Corruption</span>
          <span class="rest-status-value ${corruption > 70 ? 'danger' : corruption > 40 ? 'warning' : 'safe'}">${corruption}/100</span>
        </div>
        <div class="rest-status-item">
          <span class="rest-status-label">💰 Or</span>
          <span class="rest-status-value">${gold}</span>
        </div>
      </div>
    `;
    
    return section;
  }
  
  /* ═══════════════════════════════════════════════════════
     📋 CRÉER ACTIONS REPOS
     ═══════════════════════════════════════════════════════ */
  
  createRestActions(player, game) {
    const section = document.createElement('div');
    section.className = 'rest-modal-section';
    
    section.innerHTML = `
      <h2 class="rest-section-title">
        <span class="rest-section-icon">✨</span>
        Actions Disponibles
      </h2>
      <div class="rest-actions-list" id="rest-actions-list"></div>
    `;
    
    const actionsList = section.querySelector('#rest-actions-list');
    
    // Créer les actions
    Object.values(RestModalAAA.REST_ACTIONS).forEach(action => {
      const actionElement = this.createActionElement(action, player, game);
      actionsList.appendChild(actionElement);
    });
    
    return section;
  }
  
  /* ═══════════════════════════════════════════════════════
     🎨 CRÉER ÉLÉMENT ACTION
     ═══════════════════════════════════════════════════════ */
  
  createActionElement(action, player, game) {
    const canPerform = action.check ? action.check(player) : true;
    
    const actionDiv = document.createElement('div');
    actionDiv.className = 'rest-action';
    
    if (!canPerform) {
      actionDiv.classList.add('rest-action-disabled');
    }
    
    let costHTML = '';
    if (action.cost) {
      const icon = action.cost.type === 'RUBY' ? '💰' : '🍖';
      costHTML = `<div class="rest-action-cost">${icon} Coût: ${action.cost.amount}</div>`;
    }
    
    actionDiv.innerHTML = `
      <div class="rest-action-icon">${action.icon}</div>
      <div class="rest-action-content">
        <div class="rest-action-title">${action.name}</div>
        <div class="rest-action-description">${action.description}</div>
        ${costHTML}
      </div>
    `;
    
    // Click pour effectuer action
    if (canPerform) {
      actionDiv.onclick = () => this.performAction(action, player, game, actionDiv);
    } else if (action.errorMessage) {
      actionDiv.onclick = () => this.showMessage(action.errorMessage, 'danger');
    }
    
    return actionDiv;
  }
  
  /* ═══════════════════════════════════════════════════════
     ✨ EFFECTUER ACTION
     ═══════════════════════════════════════════════════════ */
  
  performAction(action, player, game, element) {
    const result = action.effect(player);
    
    if (result.success) {
      // Animation
      element.classList.add('rest-action-completed');
      
      // Message succès
      this.showMessage(result.message, 'success');
      
      // Marquer comme reposé
      this.rested = true;
      
      // Mettre à jour l'affichage
      setTimeout(() => {
        this.refresh(player, game);
      }, 600);
      
      // Mettre à jour UI du jeu
      if (game && typeof game.updateUI === 'function') {
        game.updateUI();
      }
    }
  }
  
  /* ═══════════════════════════════════════════════════════
     🔄 RAFRAÎCHIR MODALE
     ═══════════════════════════════════════════════════════ */
  
  refresh(player, game) {
    const overlay = document.getElementById('rest-modal-overlay');
    if (!overlay) return;
    
    const container = overlay.querySelector('.rest-modal-container');
    if (!container) return;
    
    // Recréer le contenu
    const oldContent = container.querySelector('.rest-modal-content');
    if (oldContent) {
      const newContent = this.createContent(player, game);
      oldContent.replaceWith(newContent);
    }
  }
  
  /* ═══════════════════════════════════════════════════════
     🔘 CRÉER BOUTONS
     ═══════════════════════════════════════════════════════ */
  
  createButtons(onClose) {
    const section = document.createElement('div');
    section.className = 'rest-modal-section';
    
    section.innerHTML = `
      <div class="rest-modal-buttons">
        <button class="rest-btn rest-btn-primary" id="rest-continue-btn">
          🚶 Continuer l'Aventure
        </button>
      </div>
    `;
    
    section.querySelector('#rest-continue-btn').onclick = () => {
      this.close(onClose);
    };
    
    return section;
  }
  
  /* ═══════════════════════════════════════════════════════
     💬 AFFICHER MESSAGE
     ═══════════════════════════════════════════════════════ */
  
  showMessage(text, type = 'info') {
    const message = document.createElement('div');
    message.className = 'rest-message';
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
  
  /* ═══════════════════════════════════════════════════════
     ❌ FERMER MODALE
     ═══════════════════════════════════════════════════════ */
  
  close(onClose) {
    if (!this.currentModal) return;
    
    this.currentModal.style.opacity = '0';
    const container = this.currentModal.querySelector('.rest-modal-container');
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
}

/* ═══════════════════════════════════════════════════════
   🎬 ANIMATIONS CSS
   ═══════════════════════════════════════════════════════ */

const restAnimationsStyle = document.createElement('style');
restAnimationsStyle.textContent = `
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
document.head.appendChild(restAnimationsStyle);

/* ═══════════════════════════════════════════════════════
   🌍 EXPORT GLOBAL
   ═══════════════════════════════════════════════════════ */

if (typeof window !== 'undefined') {
  window.RestModalAAA = RestModalAAA;
}

console.log('🛏️ Rest Modal AAA+ loaded');
