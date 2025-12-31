/**
 * ITEMS LORE INTEGRATION SYSTEM
 * THE LAST COVENANT - Enrichit les items du jeu avec leur lore narrative
 */

class ItemsLoreSystem {
  constructor() {
    this.itemsLore = null;
    this.loaded = false;
  }

  /**
   * Charger le fichier items-lore.json
   */
  async loadLore() {
    if (this.loaded) return this.itemsLore;

    try {
      const response = await fetch('/MD/items-lore.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.itemsLore = await response.json();
      this.loaded = true;
      console.log('✅ Items Lore chargé:', Object.keys(this.itemsLore).length, 'catégories');
      return this.itemsLore;
    } catch (error) {
      console.error('❌ Erreur chargement items-lore.json:', error);
      this.itemsLore = {};
      return this.itemsLore;
    }
  }

  /**
   * Obtenir la lore complète d'un item
   * @param {string} itemId - ID de l'item (ex: 'BROKEN_OATH')
   * @param {string} category - Catégorie (WEAPONS, ARMOR, CONSUMABLES, etc.)
   */
  getItemLore(itemId, category = null) {
    if (!this.loaded || !this.itemsLore) {
      console.warn('⚠️ Items lore non chargé');
      return null;
    }

    // Si catégorie fournie, chercher dedans
    if (category && this.itemsLore[category]) {
      return this.itemsLore[category][itemId] || null;
    }

    // Sinon, chercher dans toutes les catégories
    for (const cat in this.itemsLore) {
      if (this.itemsLore[cat][itemId]) {
        return this.itemsLore[cat][itemId];
      }
    }

    return null;
  }

  /**
   * Enrichir un item de la database avec sa lore
   * @param {object} item - Item de ITEMS_DATABASE
   * @returns {object} Item enrichi
   */
  enrichItem(item) {
    if (!item || !item.id) return item;

    const lore = this.getItemLore(item.id);
    if (!lore) return item;

    // Fusionner les données
    return {
      ...item,
      lore: lore.lore || item.lore,
      godAffinity: lore.godAffinity || null,
      corruptionEffects: lore.corruptionEffects || null,
      specialInteraction: lore.specialInteraction || null,
      drop: lore.drop || null,
      secretLore: lore.lore?.secretLore || null,
      fullLore: lore.lore?.full || item.lore || item.description
    };
  }

  /**
   * Vérifier si un item a des interactions spéciales avec la classe du joueur
   * @param {string} itemId - ID de l'item
   * @param {string} classId - ID de la classe (ex: 'SHATTERED_KNIGHT')
   */
  hasClassInteraction(itemId, classId) {
    const lore = this.getItemLore(itemId);
    if (!lore || !lore.specialInteraction) return false;

    return lore.specialInteraction.class === classId;
  }

  /**
   * Obtenir les effets de corruption d'un item selon le niveau actuel
   * @param {string} itemId - ID de l'item
   * @param {number} corruptionLevel - Niveau de corruption (0-100)
   */
  getCorruptionEffect(itemId, corruptionLevel) {
    const lore = this.getItemLore(itemId);
    if (!lore || !lore.corruptionEffects) return null;

    const effects = lore.corruptionEffects;

    // Vérifier les effets conditionnels
    if (effects.pure && corruptionLevel < 30) {
      return effects.pure;
    }

    if (effects.tainted && corruptionLevel >= 25 && corruptionLevel < 50) {
      return effects.tainted;
    }

    if (effects.corrupted && corruptionLevel >= 50 && corruptionLevel < 75) {
      return effects.corrupted;
    }

    if (effects.abyssal && corruptionLevel >= 75) {
      return effects.abyssal;
    }

    if (effects.high && corruptionLevel > 60) {
      return effects.high;
    }

    // Effets passifs (toujours actifs)
    if (effects.passive) {
      return effects.passive;
    }

    return null;
  }

  /**
   * Obtenir tous les items d'une affinité divine spécifique
   * @param {string} godName - Nom du dieu (ex: 'MORWYN', 'VYR')
   */
  getItemsByGodAffinity(godName) {
    if (!this.loaded) return [];

    const items = [];

    for (const category in this.itemsLore) {
      for (const itemId in this.itemsLore[category]) {
        const item = this.itemsLore[category][itemId];
        if (item.godAffinity === godName) {
          items.push({ ...item, category });
        }
      }
    }

    return items;
  }

  /**
   * Obtenir le dialogue spécial d'un item pour une classe
   * @param {string} itemId - ID de l'item
   * @param {string} classId - ID de la classe
   */
  getClassDialogue(itemId, classId) {
    const lore = this.getItemLore(itemId);
    if (!lore || !lore.specialInteraction) return null;

    if (lore.specialInteraction.class === classId) {
      return lore.specialInteraction.dialogue || null;
    }

    return null;
  }

  /**
   * Vérifier si un item peut déclencher une fin alternative
   * @param {string} itemId - ID de l'item
   * @param {object} player - Objet joueur
   */
  canUnlockEnding(itemId, player) {
    const lore = this.getItemLore(itemId);
    if (!lore || !lore.specialInteraction || !lore.specialInteraction.unlockEnding) {
      return null;
    }

    const unlock = lore.specialInteraction.unlockEnding;

    // Vérifier les conditions
    if (unlock.condition) {
      // Exemples de conditions
      if (unlock.condition.includes('corruption <')) {
        const maxCorruption = parseInt(unlock.condition.match(/\d+/)[0]);
        if (player.corruption >= maxCorruption) {
          return null;
        }
      }
    }

    return unlock.variant;
  }

  /**
   * Obtenir une quête liée à un item
   * @param {string} itemId - ID de l'item
   * @param {string} classId - ID de la classe (optionnel)
   */
  getItemQuest(itemId, classId = null) {
    const lore = this.getItemLore(itemId);
    if (!lore || !lore.specialInteraction || !lore.specialInteraction.quest) {
      return null;
    }

    // Vérifier si la quête est spécifique à une classe
    if (classId && lore.specialInteraction.class !== classId) {
      return null;
    }

    return lore.specialInteraction.quest;
  }

  /**
   * Obtenir le lore secret d'un item si les conditions sont remplies
   * @param {string} itemId - ID de l'item
   * @param {object} player - Objet joueur
   */
  getSecretLore(itemId, player) {
    const lore = this.getItemLore(itemId);
    if (!lore || !lore.lore || !lore.lore.secretLore) {
      return null;
    }

    // Conditions pour révéler le lore secret
    // Par exemple: avoir complété certaines quêtes, avoir un niveau de corruption spécifique, etc.

    // Pour l'instant, retourne toujours (à customiser selon le design)
    return lore.lore.secretLore;
  }
}

// ═══════════════════════════════════════════════════════
// ITEM INSPECTION MODAL
// ═══════════════════════════════════════════════════════

class ItemInspectionModal {
  constructor() {
    this.modal = null;
    this.currentItem = null;
    this.initialized = false;
  }

  /**
   * Initialiser le modal
   */
  init() {
    if (this.initialized) return;

    // Créer le modal HTML
    this.createModal();
    this.initialized = true;
  }

  /**
   * Créer la structure HTML du modal
   */
  createModal() {
    const modal = document.createElement('div');
    modal.id = 'itemInspectionModal';
    modal.className = 'item-inspection-modal';
    modal.innerHTML = `
      <div class="item-modal-backdrop"></div>
      <div class="item-modal-container">
        <button class="item-modal-close" id="closeItemInspection">✕</button>

        <div class="item-modal-header">
          <div class="item-modal-icon" id="itemInspectIcon">⚔️</div>
          <div class="item-modal-title-section">
            <h2 class="item-modal-name" id="itemInspectName">Nom de l'item</h2>
            <div class="item-modal-type" id="itemInspectType">Type</div>
            <div class="item-modal-rarity" id="itemInspectRarity">Rareté</div>
          </div>
        </div>

        <div class="item-modal-body">
          <!-- Stats -->
          <div class="item-modal-section" id="itemStatsSection">
            <h3>📊 Statistiques</h3>
            <div class="item-stats-grid" id="itemStatsGrid"></div>
          </div>

          <!-- Lore -->
          <div class="item-modal-section" id="itemLoreSection">
            <h3>📜 Histoire</h3>
            <div class="item-lore-short" id="itemLoreShort"></div>
            <div class="item-lore-full" id="itemLoreFull"></div>
          </div>

          <!-- God Affinity -->
          <div class="item-modal-section" id="itemGodSection" style="display:none;">
            <h3>✨ Affinité Divine</h3>
            <div class="item-god-info" id="itemGodInfo"></div>
          </div>

          <!-- Corruption Effects -->
          <div class="item-modal-section" id="itemCorruptionSection" style="display:none;">
            <h3>💀 Effets de Corruption</h3>
            <div class="item-corruption-effects" id="itemCorruptionEffects"></div>
          </div>

          <!-- Class Interaction -->
          <div class="item-modal-section" id="itemClassSection" style="display:none;">
            <h3>🎭 Interaction Spéciale</h3>
            <div class="item-class-dialogue" id="itemClassDialogue"></div>
          </div>

          <!-- Quest -->
          <div class="item-modal-section" id="itemQuestSection" style="display:none;">
            <h3>🎯 Quête</h3>
            <div class="item-quest-info" id="itemQuestInfo"></div>
          </div>

          <!-- Secret Lore -->
          <div class="item-modal-section item-secret-lore" id="itemSecretSection" style="display:none;">
            <h3>🔮 Connaissance Secrète</h3>
            <div class="item-secret-content" id="itemSecretContent"></div>
          </div>
        </div>

        <div class="item-modal-footer">
          <button class="btn-primary" id="closeItemInspectionBtn">Fermer</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modal = modal;

    // Event listeners
    const closeBtn = document.getElementById('closeItemInspection');
    const closeBtnFooter = document.getElementById('closeItemInspectionBtn');
    const backdrop = modal.querySelector('.item-modal-backdrop');

    closeBtn.addEventListener('click', () => this.hide());
    closeBtnFooter.addEventListener('click', () => this.hide());
    backdrop.addEventListener('click', () => this.hide());
  }

  /**
   * Afficher le modal avec un item
   * @param {object} item - Item enrichi
   * @param {object} player - Objet joueur (pour contexte)
   */
  async show(item, player = null) {
    if (!this.initialized) this.init();

    // Enrichir l'item avec sa lore
    const enrichedItem = await window.ItemsLoreSystem.enrichItem(item);
    this.currentItem = enrichedItem;

    // Remplir le modal
    this.populateModal(enrichedItem, player);

    // Afficher
    this.modal.classList.add('active');
  }

  /**
   * Remplir le modal avec les données de l'item
   */
  populateModal(item, player) {
    // Header
    document.getElementById('itemInspectIcon').textContent = item.icon || '📦';
    document.getElementById('itemInspectName').textContent = item.name;
    document.getElementById('itemInspectType').textContent = item.type || 'Item';

    const rarityEl = document.getElementById('itemInspectRarity');
    rarityEl.textContent = item.rarity || 'common';
    rarityEl.className = `item-modal-rarity rarity-${item.rarity || 'common'}`;

    // Stats
    if (item.stats) {
      const statsGrid = document.getElementById('itemStatsGrid');
      statsGrid.innerHTML = '';

      for (const [stat, value] of Object.entries(item.stats)) {
        const statDiv = document.createElement('div');
        statDiv.className = 'item-stat';
        statDiv.innerHTML = `
          <span class="stat-name">${this.formatStatName(stat)}</span>
          <span class="stat-value ${value > 0 ? 'positive' : 'negative'}">${value > 0 ? '+' : ''}${value}</span>
        `;
        statsGrid.appendChild(statDiv);
      }
    }

    // Lore
    const loreShort = document.getElementById('itemLoreShort');
    const loreFull = document.getElementById('itemLoreFull');

    if (item.lore && typeof item.lore === 'object') {
      loreShort.textContent = item.lore.short || '';
      loreFull.textContent = item.lore.full || item.description || '';
    } else {
      loreShort.textContent = item.description || '';
      loreFull.textContent = item.lore || '';
    }

    // God Affinity
    if (item.godAffinity) {
      const godSection = document.getElementById('itemGodSection');
      const godInfo = document.getElementById('itemGodInfo');
      godSection.style.display = 'block';

      const godData = this.getGodData(item.godAffinity);
      godInfo.innerHTML = `
        <div class="god-affinity-badge" data-god="${item.godAffinity}">
          <span class="god-icon">${godData.icon}</span>
          <span class="god-name">${godData.name}</span>
        </div>
        <p class="god-desc">${godData.description}</p>
      `;
    }

    // Corruption Effects
    if (item.corruptionEffects && player) {
      const corruptionSection = document.getElementById('itemCorruptionSection');
      const corruptionEffects = document.getElementById('itemCorruptionEffects');
      corruptionSection.style.display = 'block';

      const currentCorruption = player.corruption || 0;
      const activeEffect = window.ItemsLoreSystem.getCorruptionEffect(item.id, currentCorruption);

      corruptionEffects.innerHTML = '';

      // Afficher tous les seuils
      for (const [threshold, effect] of Object.entries(item.corruptionEffects)) {
        const effectDiv = document.createElement('div');
        effectDiv.className = `corruption-effect-item ${activeEffect === effect ? 'active' : ''}`;
        effectDiv.innerHTML = `
          <div class="effect-threshold">${this.formatThreshold(threshold)}</div>
          <div class="effect-desc">${effect.effect}</div>
          ${effect.visual ? `<div class="effect-visual">Visuel: ${effect.visual}</div>` : ''}
        `;
        corruptionEffects.appendChild(effectDiv);
      }
    }

    // Class Interaction
    if (item.specialInteraction && player && player.classId) {
      if (item.specialInteraction.class === player.classId) {
        const classSection = document.getElementById('itemClassSection');
        const classDialogue = document.getElementById('itemClassDialogue');
        classSection.style.display = 'block';

        if (item.specialInteraction.dialogue) {
          const dialogues = Array.isArray(item.specialInteraction.dialogue)
            ? item.specialInteraction.dialogue
            : [item.specialInteraction.dialogue];

          classDialogue.innerHTML = dialogues.map(line =>
            `<p class="dialogue-line">"${line}"</p>`
          ).join('');
        }
      }
    }

    // Quest
    if (item.specialInteraction && item.specialInteraction.quest) {
      const questSection = document.getElementById('itemQuestSection');
      const questInfo = document.getElementById('itemQuestInfo');
      questSection.style.display = 'block';

      const quest = item.specialInteraction.quest;
      questInfo.innerHTML = `
        <h4>${quest.name}</h4>
        <p class="quest-condition">Condition: ${quest.condition}</p>
        ${quest.reward ? `
          <div class="quest-reward">
            <strong>Récompense:</strong>
            <p>${quest.reward.item || 'Unknown'}</p>
            ${quest.reward.lore ? `<p class="quest-reward-lore">${quest.reward.lore}</p>` : ''}
          </div>
        ` : ''}
      `;
    }

    // Secret Lore
    if (item.secretLore || (item.lore && item.lore.secretLore)) {
      const secretSection = document.getElementById('itemSecretSection');
      const secretContent = document.getElementById('itemSecretContent');
      secretSection.style.display = 'block';

      secretContent.textContent = item.secretLore || item.lore.secretLore;
    }
  }

  /**
   * Formater le nom d'une stat
   */
  formatStatName(statName) {
    const names = {
      atk: 'Attaque',
      def: 'Défense',
      hp: 'Points de Vie',
      maxHp: 'HP Max',
      speed: 'Vitesse',
      critChance: 'Chance Critique',
      damage: 'Dégâts',
      magicDamage: 'Dégâts Magiques',
      manaCost: 'Coût Mana',
      attackSpeed: 'Vitesse d\'Attaque'
    };

    return names[statName] || statName;
  }

  /**
   * Formater un seuil de corruption
   */
  formatThreshold(threshold) {
    const names = {
      pure: '✨ Pure (< 30%)',
      tainted: '🌫️ Souillé (25-50%)',
      corrupted: '💀 Corrompu (50-75%)',
      abyssal: '🌑 Abyssal (75-100%)',
      passive: '🔄 Passif (Toujours)',
      high: '⚠️ Haute Corruption (> 60%)'
    };

    return names[threshold] || threshold;
  }

  /**
   * Obtenir les données d'un dieu
   */
  getGodData(godId) {
    const gods = {
      MORWYN: {
        icon: '⚖️',
        name: 'Morwyn, Scelleur de l\'Ordre',
        description: 'Premier dévoré. Ses lois persistent, autonomes.'
      },
      VYR: {
        icon: '👁️',
        name: 'Vyr le Visionnaire',
        description: 'Voyait l\'avenir. Ses prophéties parlent encore.'
      },
      SYLTHARA: {
        icon: '🕸️',
        name: 'Sylthara la Tisseuse',
        description: 'Tissait les destins. Ses fils dérivent sans elle.'
      },
      AELMORA: {
        icon: '🌙',
        name: 'Ael\'mora la Nuit',
        description: 'Gardienne des ombres. Maintenant, tout est ténèbres.'
      },
      NOXAR: {
        icon: '☠️',
        name: 'Noxar le Terminus',
        description: 'Dieu de la mort. Ironiquement, il est mort aussi.'
      },
      KROVAX: {
        icon: '⚔️',
        name: 'Krovax le Forgeur',
        description: 'Forgeur de destinées. Ses armes cherchent des maîtres.'
      },
      THALYS: {
        icon: '⚖️',
        name: 'Thalys le Vagabond',
        description: 'Sa balance explosa. Cherche l\'équilibre perdu.'
      }
    };

    return gods[godId] || { icon: '?', name: godId, description: '' };
  }

  /**
   * Masquer le modal
   */
  hide() {
    if (this.modal) {
      this.modal.classList.remove('active');
    }
  }
}

// ═══════════════════════════════════════════════════════
// GLOBAL INSTANCES
// ═══════════════════════════════════════════════════════

window.ItemsLoreSystem = new ItemsLoreSystem();
window.ItemInspectionModal = new ItemInspectionModal();

// Auto-load lore on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    await window.ItemsLoreSystem.loadLore();
    console.log('✅ Items Lore System ready');
  });
} else {
  window.ItemsLoreSystem.loadLore().then(() => {
    console.log('✅ Items Lore System ready');
  });
}
