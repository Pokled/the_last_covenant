// Définition des items
const ITEMS = {
  HEALTH_POTION: { 
    name: 'Potion de Soin', 
    icon: '🧪', 
    effect: 'heal', 
    value: 5, 
    description: 'Restaure 5 PV' 
  },
  STRENGTH_POTION: { 
    name: 'Potion de Force', 
    icon: '💪', 
    effect: 'buff_atk', 
    value: 2, 
    duration: 3, 
    description: '+2 ATK pendant 3 tours' 
  },
  DEFENSE_POTION: { 
    name: 'Potion de Défense', 
    icon: '🛡️', 
    effect: 'buff_def', 
    value: 2, 
    duration: 3, 
    description: '+2 DEF pendant 3 tours' 
  },
  INVULNERABILITY_SCROLL: { 
    name: 'Parchemin d\'Invulnérabilité', 
    icon: '📜', 
    effect: 'invulnerable', 
    duration: 1, 
    description: 'Invulnérable au prochain tour' 
  },
  TELEPORT_SCROLL: { 
    name: 'Parchemin de Téléportation', 
    icon: '🌀', 
    effect: 'teleport', 
    value: 10, 
    description: 'Avance de 10 cases' 
  },
  RUBY: { 
    name: 'Rubis', 
    icon: '💎', 
    effect: 'currency', 
    value: 1, 
    description: 'Monnaie du marchand' 
  }
};

// Classe Inventory
class Inventory {
  constructor(size) {
    this.size = size;
    this.items = {};
  }

  addItem(itemKey, quantity = 1) {
    // Utiliser ItemsDatabase si disponible, sinon fallback sur ITEMS
    const itemData = (window.ItemsDatabase && window.ItemsDatabase.getItem(itemKey)) || ITEMS[itemKey];
    
    if (!itemData) {
      console.warn(`⚠️ Item inconnu: ${itemKey}`);
      return false;
    }
    
    if (!this.items[itemKey]) {
      this.items[itemKey] = { item: itemData, quantity: 0 };
    }
    this.items[itemKey].quantity += quantity;
    return true;
  }

  removeItem(itemKey, quantity = 1) {
    if (!this.items[itemKey] || this.items[itemKey].quantity < quantity) return false;
    this.items[itemKey].quantity -= quantity;
    if (this.items[itemKey].quantity === 0) delete this.items[itemKey];
    return true;
  }

  useItem(itemKey, player) {
    if (!this.items[itemKey] || this.items[itemKey].quantity === 0) {
      return { success: false, message: 'Item non disponible' };
    }

    const item = this.items[itemKey].item;
    let message = '';

    switch (item.effect) {
      case 'heal':
        const healAmount = Math.min(item.value, player.maxHp - player.hp);
        player.hp += healAmount;
        message = `${player.name} utilise ${item.name} et récupère ${healAmount} PV !`;
        break;
      
      case 'buff_atk':
        player.atkBuff = (player.atkBuff || 0) + item.value;
        player.atkBuffTurns = item.duration;
        player.atk += item.value;
        message = `${player.name} utilise ${item.name} ! ATK +${item.value} pendant ${item.duration} tours`;
        break;
      
      case 'buff_def':
        player.defBuff = (player.defBuff || 0) + item.value;
        player.defBuffTurns = item.duration;
        player.def += item.value;
        message = `${player.name} utilise ${item.name} ! DEF +${item.value} pendant ${item.duration} tours`;
        break;
      
      case 'invulnerable':
        player.invulnerable = true;
        player.invulnerableTurns = item.duration;
        message = `${player.name} utilise ${item.name} ! Invulnérable au prochain tour !`;
        break;
      
      case 'teleport':
        player.position = Math.min(player.position + item.value, CONFIG.PATH_LENGTH - 1);
        message = `${player.name} utilise ${item.name} et avance de ${item.value} cases !`;
        break;
      
      default:
        return { success: false, message: 'Item non utilisable' };
    }

    this.removeItem(itemKey, 1);
    return { success: true, message };
  }

  getItemCount(itemKey) {
    return this.items[itemKey]?.quantity || 0;
  }

  /**
   * Retourne les items de l'inventaire sous forme de tableau ordonné
   * Chaque élément : { type, name, quantity }
   */
  getItems() {
    return Object.keys(this.items).map(key => ({
      type: key,
      name: this.items[key].item.name,
      quantity: this.items[key].quantity
    }));
  }
}

console.log('🎒 Système d\'inventaire chargé');