// 🎭 SYSTÈME DE BUFFS PASSIFS
// Remplace le système de cartes - Version Dark Medieval

class PassiveBuffsManager {
  constructor() {
    this.buffs = [];
    this.buffDefinitions = this.initializeBuffDefinitions();
    console.log('💫 Système de Buffs Passifs initialisé');
  }
  
  // ═══════════════════════════════════════════════════════════
  // 📚 DÉFINITIONS DES BUFFS (ancien système de cartes)
  // ═══════════════════════════════════════════════════════════
  
  initializeBuffDefinitions() {
    return {
      // Buffs communs (anciennement cartes communes)
      phoenix_feather: {
        id: 'phoenix_feather',
        name: 'Plume de Phénix',
        description: 'Si vous mourriez, revenez à la vie avec 1 HP',
        rarity: 'common',
        icon: '🪶',
        type: 'passive',
        effect: 'revive'
      },
      
      treasure_hunter: {
        id: 'treasure_hunter',
        name: 'Chasseur de Trésors',
        description: '+50% d\'or trouvé dans les coffres',
        rarity: 'common',
        icon: '💰',
        type: 'passive',
        effect: 'gold_bonus'
      },
      
      even_boost: {
        id: 'even_boost',
        name: 'Paire Gagnante',
        description: 'Les nombres pairs donnent +1 au dé',
        rarity: 'common',
        icon: '🎲',
        type: 'passive',
        effect: 'dice_boost'
      },
      
      battle_fury: {
        id: 'battle_fury',
        name: 'Fureur de Combat',
        description: '+2 ATK permanent',
        rarity: 'uncommon',
        icon: '⚔️',
        type: 'passive',
        effect: 'atk_bonus'
      },
      
      iron_skin: {
        id: 'iron_skin',
        name: 'Peau de Fer',
        description: '+2 DEF permanent',
        rarity: 'uncommon',
        icon: '🛡️',
        type: 'passive',
        effect: 'def_bonus'
      },
      
      vampire_touch: {
        id: 'vampire_touch',
        name: 'Toucher Vampirique',
        description: 'Récupère 20% des dégâts infligés en HP',
        rarity: 'rare',
        icon: '🩸',
        type: 'passive',
        effect: 'lifesteal'
      },
      
      critical_strike: {
        id: 'critical_strike',
        name: 'Coup Critique',
        description: '15% de chance de doubler les dégâts',
        rarity: 'rare',
        icon: '💥',
        type: 'passive',
        effect: 'critical'
      },
      
      divine_blessing: {
        id: 'divine_blessing',
        name: 'Bénédiction Divine',
        description: '+5 HP max et régénération lente',
        rarity: 'legendary',
        icon: '✨',
        type: 'passive',
        effect: 'hp_boost'
      }
    };
  }
  
  // ═══════════════════════════════════════════════════════════
  // 🎁 AJOUTER UN BUFF AU JOUEUR
  // ═══════════════════════════════════════════════════════════
  
  addBuff(buffId, player) {
    const buffDef = this.buffDefinitions[buffId];
    if (!buffDef) {
      console.warn(`⚠️ Buff inconnu: ${buffId}`);
      return false;
    }
    
    // Vérifier si le joueur a déjà ce buff
    if (this.hasBuff(buffId, player)) {
      console.log(`⚠️ Le joueur a déjà le buff: ${buffDef.name}`);
      return false;
    }
    
    // Ajouter le buff à la liste
    const buff = {
      ...buffDef,
      addedAt: Date.now()
    };
    
    if (!player.passiveBuffs) {
      player.passiveBuffs = [];
    }
    
    player.passiveBuffs.push(buff);
    
    // Appliquer l'effet immédiat si nécessaire
    this.applyBuffEffect(buff, player);
    
    // Mettre à jour l'UI
    this.updateBuffsDisplay(player);
    
    // Log
    console.log(`✅ Buff ajouté: ${buffDef.name}`);
    
    // Notification
    this.showBuffNotification(buffDef);
    
    return true;
  }
  
  // ═══════════════════════════════════════════════════════════
  // ⚡ APPLIQUER L'EFFET DU BUFF
  // ═══════════════════════════════════════════════════════════
  
  applyBuffEffect(buff, player) {
    switch (buff.effect) {
      case 'atk_bonus':
        player.atk += 2;
        break;
        
      case 'def_bonus':
        player.def += 2;
        break;
        
      case 'hp_boost':
        player.maxHp += 5;
        player.hp = Math.min(player.hp + 5, player.maxHp);
        break;
        
      // Les autres effets sont appliqués dynamiquement
      case 'revive':
      case 'gold_bonus':
      case 'dice_boost':
      case 'lifesteal':
      case 'critical':
        // Pas d'effet immédiat, appliqué lors de l'événement
        break;
    }
  }
  
  // ═══════════════════════════════════════════════════════════
  // ✅ VÉRIFIER SI LE JOUEUR A UN BUFF
  // ═══════════════════════════════════════════════════════════
  
  hasBuff(buffId, player) {
    if (!player.passiveBuffs) return false;
    return player.passiveBuffs.some(b => b.id === buffId);
  }
  
  // ═══════════════════════════════════════════════════════════
  // 🎨 AFFICHER LES BUFFS DANS L'UI
  // ═══════════════════════════════════════════════════════════
  
  updateBuffsDisplay(player) {
    const container = document.getElementById('passiveBuffsList');
    if (!container) {
      console.warn('⚠️ Container passiveBuffsList introuvable');
      return;
    }
    
    // Effacer le contenu actuel
    container.innerHTML = '';
    
    if (!player.passiveBuffs || player.passiveBuffs.length === 0) {
      container.innerHTML = '<div class="no-buffs">Aucun buff actif</div>';
      return;
    }
    
    // Créer les éléments de buff
    player.passiveBuffs.forEach(buff => {
      const buffEl = document.createElement('div');
      buffEl.className = `passive-buff buff-${buff.rarity}`;
      buffEl.innerHTML = `
        <div class="buff-icon">${buff.icon}</div>
        <div class="buff-info">
          <div class="buff-name">${buff.name}</div>
          <div class="buff-desc">${buff.description}</div>
        </div>
      `;
      
      // Tooltip au survol
      buffEl.title = `${buff.name}\n${buff.description}\n\nRareté: ${this.getRarityText(buff.rarity)}`;
      
      container.appendChild(buffEl);
    });
  }
  
  // ═══════════════════════════════════════════════════════════
  // 🔔 NOTIFICATION AJOUT BUFF
  // ═══════════════════════════════════════════════════════════
  
  showBuffNotification(buff) {
    // Créer une notification
    const notification = document.createElement('div');
    notification.className = `buff-notification buff-${buff.rarity}`;
    notification.innerHTML = `
      <div class="buff-notif-icon">${buff.icon}</div>
      <div class="buff-notif-text">
        <div class="buff-notif-title">Nouveau Buff !</div>
        <div class="buff-notif-name">${buff.name}</div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animation d'apparition
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Suppression après 3 secondes
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  }
  
  // ═══════════════════════════════════════════════════════════
  // 📊 UTILITAIRES
  // ═══════════════════════════════════════════════════════════
  
  getRarityText(rarity) {
    const rarities = {
      'common': 'Commun',
      'uncommon': 'Peu commun',
      'rare': 'Rare',
      'legendary': 'Légendaire'
    };
    return rarities[rarity] || 'Inconnu';
  }
  
  // ═══════════════════════════════════════════════════════════
  // 🎲 HOOKS POUR LES ÉVÉNEMENTS
  // ═══════════════════════════════════════════════════════════
  
  // Appelé lors d'un lancer de dé
  modifyDiceRoll(roll, player) {
    if (!player.passiveBuffs) return roll;
    
    let modifiedRoll = roll;
    
    // Paire Gagnante : +1 si pair
    if (this.hasBuff('even_boost', player) && roll % 2 === 0) {
      modifiedRoll += 1;
      console.log(`  ↳ even_boost: ${roll} → ${modifiedRoll}`);
      console.log(`  ↳ Nombre pair +1`);
    }
    
    return modifiedRoll;
  }
  
  // Appelé lors d'un gain d'or
  modifyGoldGain(amount, player) {
    if (!player.passiveBuffs) return amount;
    
    let modifiedAmount = amount;
    
    // Chasseur de Trésors : +50% or
    if (this.hasBuff('treasure_hunter', player)) {
      modifiedAmount = Math.floor(amount * 1.5);
      console.log(`  ↳ treasure_hunter: ${amount} → ${modifiedAmount} gold`);
    }
    
    return modifiedAmount;
  }
  
  // Appelé lors d'un combat (dégâts infligés)
  onDamageDealt(damage, player) {
    if (!player.passiveBuffs) return;
    
    // Toucher Vampirique : récupère 20% des dégâts
    if (this.hasBuff('vampire_touch', player)) {
      const heal = Math.floor(damage * 0.2);
      if (heal > 0) {
        player.hp = Math.min(player.hp + heal, player.maxHp);
        console.log(`  ↳ vampire_touch: +${heal} HP (20% de ${damage})`);
      }
    }
  }
  
  // Appelé lors de la mort du joueur
  onPlayerDeath(player) {
    if (!player.passiveBuffs) return false;
    
    // Plume de Phénix : ressuscite avec 1 HP
    if (this.hasBuff('phoenix_feather', player)) {
      player.hp = 1;
      
      // Retirer le buff (usage unique)
      player.passiveBuffs = player.passiveBuffs.filter(b => b.id !== 'phoenix_feather');
      
      console.log('  ↳ phoenix_feather: Résurrection !');
      
      // Notification
      const notif = document.createElement('div');
      notif.className = 'phoenix-resurrection';
      notif.innerHTML = `
        <div class="phoenix-icon">🪶</div>
        <div class="phoenix-text">RÉSURRECTION !</div>
      `;
      document.body.appendChild(notif);
      
      setTimeout(() => notif.classList.add('show'), 100);
      setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 500);
      }, 2000);
      
      return true; // Le joueur survit
    }
    
    return false; // Le joueur meurt
  }
}

// ✅ Instance globale (CORRIGÉ : nom différent de la classe)
window.PassiveBuffsSystem = new PassiveBuffsManager();

console.log('💫 Système de Buffs Passifs chargé');