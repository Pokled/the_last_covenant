/* ═══════════════════════════════════════════════════════
   🛒 BOUTIQUE AAA+ - THE LAST COVENANT
   Système de boutique marchand avec design AAA+
   ═══════════════════════════════════════════════════════ */

class ShopModalAAA {
  constructor() {
    this.currentModal = null;
    this.isOpen = false;
    this.selectedItem = null;
    
    console.log('🛒 Shop Modal AAA+ initialized');
  }
  
  /* ═══════════════════════════════════════════════════════
     🎨 CATALOGUE BOUTIQUE
     ═══════════════════════════════════════════════════════ */
  
  static SHOP_ITEMS = {
    // Potions
    HEALTH_POTION: {
      id: 'HEALTH_POTION',
      name: 'Potion de Soin',
      icon: '⚗️',
      description: 'Restaure 50 HP immédiatement',
      price: 30,
      stock: 5,
      category: 'potion'
    },
    STRENGTH_POTION: {
      id: 'STRENGTH_POTION',
      name: 'Potion de Force',
      icon: '💪',
      description: '+5 ATK pour 3 tours',
      price: 50,
      stock: 3,
      category: 'potion'
    },
    DEFENSE_POTION: {
      id: 'DEFENSE_POTION',
      name: 'Potion de Défense',
      icon: '🛡️',
      description: '+5 DEF pour 3 tours',
      price: 50,
      stock: 3,
      category: 'potion'
    },
    SPEED_POTION: {
      id: 'SPEED_POTION',
      name: 'Potion de Vitesse',
      icon: '⚡',
      description: 'Double le mouvement pour 2 tours',
      price: 40,
      stock: 2,
      category: 'potion'
    },
    
    // Armes
    IRON_SWORD: {
      id: 'IRON_SWORD',
      name: 'Épée en Fer',
      icon: '⚔️',
      description: '+3 ATK permanent',
      price: 80,
      stock: 1,
      category: 'weapon'
    },
    LEGENDARY_SWORD: {
      id: 'LEGENDARY_SWORD',
      name: 'Épée Runique',
      icon: '⚔️',
      description: '+8 ATK, Bonus critique +10%',
      price: 250,
      stock: 1,
      category: 'weapon'
    },
    
    // Armures
    IRON_SHIELD: {
      id: 'IRON_SHIELD',
      name: 'Bouclier en Fer',
      icon: '🛡️',
      description: '+3 DEF permanent',
      price: 80,
      stock: 1,
      category: 'armor'
    },
    LEGENDARY_ARMOR: {
      id: 'LEGENDARY_ARMOR',
      name: 'Armure Sacrée',
      icon: '🥋',
      description: '+10 DEF, Résistance ténèbres +15%',
      price: 300,
      stock: 1,
      category: 'armor'
    },
    
    // Reliques
    PHOENIX_FEATHER: {
      id: 'PHOENIX_FEATHER',
      name: 'Plume de Phénix',
      icon: '🪶',
      description: 'Ressuscite avec 50% HP (usage unique)',
      price: 200,
      stock: 1,
      category: 'relic'
    },
    ANCIENT_AMULET: {
      id: 'ANCIENT_AMULET',
      name: 'Amulette Ancienne',
      icon: '🔮',
      description: 'Réduit le Stress de 20% en combat',
      price: 180,
      stock: 1,
      category: 'relic'
    },
    
    // Parchemins
    TELEPORT_SCROLL: {
      id: 'TELEPORT_SCROLL',
      name: 'Parchemin de Téléportation',
      icon: '📜',
      description: 'Avance de 10 cases instantanément',
      price: 60,
      stock: 3,
      category: 'scroll'
    },
    INVULNERABILITY_SCROLL: {
      id: 'INVULNERABILITY_SCROLL',
      name: 'Parchemin d\'Invulnérabilité',
      icon: '📜',
      description: 'Immunité totale pour 1 combat',
      price: 150,
      stock: 1,
      category: 'scroll'
    }
  };
  
  /* ═══════════════════════════════════════════════════════
     🎭 AFFICHER MODALE BOUTIQUE
     ═══════════════════════════════════════════════════════ */
  
  show(player, game, onClose) {
    if (this.isOpen) return;
    this.isOpen = true;
    
    // Background immersif
    const background = document.createElement('div');
    background.className = 'shop-modal-background';
    document.body.appendChild(background);
    
    // Overlay
    const overlay = document.createElement('div');
    overlay.className = 'shop-modal-overlay';
    overlay.id = 'shop-modal-overlay';
    
    // Container
    const container = document.createElement('div');
    container.className = 'shop-modal-container';
    
    // Header
    const header = this.createHeader();
    
    // Content
    const content = this.createContent(player);
    
    // Actions
    const actions = this.createActions(player, game, onClose);
    
    container.appendChild(header);
    container.appendChild(content);
    container.appendChild(actions);
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
    header.className = 'shop-modal-header';
    
    header.innerHTML = `
      <h1 class="shop-modal-title">
        <span class="shop-modal-title-icon">🛒</span>
        Boutique du Marchand
      </h1>
      <button class="shop-modal-close-btn">✕</button>
    `;
    
    header.querySelector('.shop-modal-close-btn').onclick = () => this.close();
    
    return header;
  }
  
  /* ═══════════════════════════════════════════════════════
     📄 CRÉER CONTENT
     ═══════════════════════════════════════════════════════ */
  
  createContent(player) {
    const content = document.createElement('div');
    content.className = 'shop-modal-content';
    
    // Message du marchand
    const merchantMessage = document.createElement('div');
    merchantMessage.className = 'shop-merchant-message';
    merchantMessage.innerHTML = `
      <em>"Bienvenue, voyageur ! J'ai exactement ce qu'il vous faut pour survivre dans ces donjons maudits..."</em>
    `;
    content.appendChild(merchantMessage);
    
    // Section Or
    const goldSection = this.createGoldSection(player);
    content.appendChild(goldSection);
    
    // Section Items
    const itemsSection = this.createItemsSection(player);
    content.appendChild(itemsSection);
    
    return content;
  }
  
  /* ═══════════════════════════════════════════════════════
     💰 CRÉER SECTION OR
     ═══════════════════════════════════════════════════════ */
  
  createGoldSection(player) {
    const section = document.createElement('div');
    section.className = 'shop-modal-section';
    
    const playerGold = player.inventory?.getItemCount('RUBY') || 0;
    
    section.innerHTML = `
      <h2 class="shop-section-title">
        <span class="shop-section-icon">💰</span>
        Votre Or
      </h2>
      <div class="shop-gold-display">
        <span class="shop-gold-label">Or disponible</span>
        <span class="shop-gold-value" id="shop-player-gold">${playerGold} 💰</span>
      </div>
    `;
    
    return section;
  }
  
  /* ═══════════════════════════════════════════════════════
     📋 CRÉER SECTION ITEMS
     ═══════════════════════════════════════════════════════ */
  
  createItemsSection(player) {
    const section = document.createElement('div');
    section.className = 'shop-modal-section';
    
    section.innerHTML = `
      <h2 class="shop-section-title">
        <span class="shop-section-icon">🏺</span>
        Articles en vente
      </h2>
      <div class="shop-items-list" id="shop-items-list"></div>
    `;
    
    const itemsList = section.querySelector('#shop-items-list');
    
    // Créer les items
    Object.values(ShopModalAAA.SHOP_ITEMS).forEach(item => {
      const itemElement = this.createItemElement(item, player);
      itemsList.appendChild(itemElement);
    });
    
    return section;
  }
  
  /* ═══════════════════════════════════════════════════════
     🎨 CRÉER ÉLÉMENT ITEM
     ═══════════════════════════════════════════════════════ */
  
  createItemElement(item, player) {
    const playerGold = player.inventory?.getItemCount('RUBY') || 0;
    const canAfford = playerGold >= item.price;
    const outOfStock = item.stock <= 0;
    
    const itemDiv = document.createElement('div');
    itemDiv.className = 'shop-item';
    
    if (!canAfford || outOfStock) {
      itemDiv.classList.add('shop-item-disabled');
    }
    
    itemDiv.innerHTML = `
      <div class="shop-item-icon">${item.icon}</div>
      <div class="shop-item-content">
        <div class="shop-item-title">${item.name}</div>
        <div class="shop-item-description">${item.description}</div>
        ${outOfStock ? '<div class="shop-item-stock" style="color: #DC2626;">Rupture de stock</div>' : `<div class="shop-item-stock">En stock: ${item.stock}</div>`}
      </div>
      <div class="shop-item-price ${!canAfford ? 'shop-item-price-insufficient' : ''}">
        ${item.price} 💰
      </div>
    `;
    
    // Click pour sélectionner
    if (canAfford && !outOfStock) {
      itemDiv.onclick = () => this.selectItem(item, itemDiv);
    }
    
    itemDiv.dataset.itemId = item.id;
    
    return itemDiv;
  }
  
  /* ═══════════════════════════════════════════════════════
     ✨ SÉLECTIONNER ITEM
     ═══════════════════════════════════════════════════════ */
  
  selectItem(item, element) {
    // Désélectionner tous
    document.querySelectorAll('.shop-item').forEach(el => {
      el.style.borderColor = '#6B4423';
      el.style.boxShadow = '';
    });
    
    // Sélectionner
    element.style.borderColor = '#FBBF24';
    element.style.boxShadow = '0 0 20px rgba(251, 191, 36, 0.5)';
    
    this.selectedItem = item;
    
    // Activer bouton acheter
    const buyBtn = document.getElementById('shop-buy-btn');
    if (buyBtn) {
      buyBtn.disabled = false;
    }
  }
  
  /* ═══════════════════════════════════════════════════════
     🔘 CRÉER ACTIONS
     ═══════════════════════════════════════════════════════ */
  
  createActions(player, game, onClose) {
    const section = document.createElement('div');
    section.className = 'shop-modal-section';
    
    section.innerHTML = `
      <div class="shop-modal-actions">
        <button class="shop-btn shop-btn-success" id="shop-buy-btn" disabled>
          💰 Acheter
        </button>
        <button class="shop-btn" id="shop-leave-btn">
          🚪 Quitter
        </button>
      </div>
    `;
    
    // Bouton Acheter
    section.querySelector('#shop-buy-btn').onclick = () => {
      if (this.selectedItem) {
        this.buyItem(this.selectedItem, player, game);
      }
    };
    
    // Bouton Quitter
    section.querySelector('#shop-leave-btn').onclick = () => {
      this.close(onClose);
    };
    
    return section;
  }
  
  /* ═══════════════════════════════════════════════════════
     💳 ACHETER ITEM
     ═══════════════════════════════════════════════════════ */
  
  buyItem(item, player, game) {
    const playerGold = player.inventory?.getItemCount('RUBY') || 0;
    
    // Vérifications
    if (playerGold < item.price) {
      this.showMessage('❌ Or insuffisant !', 'danger');
      return;
    }
    
    if (item.stock <= 0) {
      this.showMessage('❌ Article en rupture de stock !', 'danger');
      return;
    }
    
    // Achat
    player.inventory.removeItem('RUBY', item.price);
    player.inventory.addItem(item.id, 1);
    item.stock--;
    
    // Animation achat
    const itemElement = document.querySelector(`[data-item-id="${item.id}"]`);
    if (itemElement) {
      itemElement.classList.add('shop-item-purchased');
      setTimeout(() => {
        itemElement.remove();
      }, 600);
    }
    
    // Message succès
    this.showMessage(`✅ ${item.name} acheté !`, 'success');
    
    // Mettre à jour l'or affiché
    const goldDisplay = document.getElementById('shop-player-gold');
    if (goldDisplay) {
      const newGold = player.inventory.getItemCount('RUBY');
      goldDisplay.textContent = `${newGold} 💰`;
    }
    
    // Réinitialiser sélection
    this.selectedItem = null;
    const buyBtn = document.getElementById('shop-buy-btn');
    if (buyBtn) {
      buyBtn.disabled = true;
    }
    
    // Mettre à jour UI du jeu
    if (game && typeof game.updateUI === 'function') {
      game.updateUI();
    }
  }
  
  /* ═══════════════════════════════════════════════════════
     💬 AFFICHER MESSAGE
     ═══════════════════════════════════════════════════════ */
  
  showMessage(text, type = 'info') {
    const message = document.createElement('div');
    message.className = 'shop-message';
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
      font-size: 18px;
      font-weight: 700;
      z-index: 10002;
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.8);
      animation: messagePopIn 0.3s ease;
    `;
    message.textContent = text;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.style.animation = 'messagePopOut 0.3s ease forwards';
      setTimeout(() => message.remove(), 300);
    }, 2000);
  }
  
  /* ═══════════════════════════════════════════════════════
     ❌ FERMER MODALE
     ═══════════════════════════════════════════════════════ */
  
  close(onClose) {
    if (!this.currentModal) return;
    
    this.currentModal.style.opacity = '0';
    const container = this.currentModal.querySelector('.shop-modal-container');
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

const shopAnimationsStyle = document.createElement('style');
shopAnimationsStyle.textContent = `
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
document.head.appendChild(shopAnimationsStyle);

/* ═══════════════════════════════════════════════════════
   🌍 EXPORT GLOBAL
   ═══════════════════════════════════════════════════════ */

if (typeof window !== 'undefined') {
  window.ShopModalAAA = ShopModalAAA;
}

console.log('🛒 Shop Modal AAA+ loaded');
