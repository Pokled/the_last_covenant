// @ts-nocheck
// 📊 SYSTÈME DE PROGRESSION

class ProgressionSystem {
  static XP_CURVE = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 4000]; // XP requis par niveau
  
  static SKILLS_TREE = {
    warrior: [
      { id: 'power_strike', name: 'Frappe Puissante', icon: '💥', desc: '+3 ATQ', cost: 1, effect: (p) => p.atk += 3 },
      { id: 'iron_skin', name: 'Peau de Fer', icon: '🛡️', desc: '+3 DÉF', cost: 1, effect: (p) => p.def += 3 },
      { id: 'berserker', name: 'Berserker', icon: '😡', desc: '+5 ATQ, -2 DÉF', cost: 2, effect: (p) => { p.atk += 5; p.def -= 2; } },
      { id: 'toughness', name: 'Endurance', icon: '💪', desc: '+10 PV Max', cost: 1, effect: (p) => { p.maxHp += 10; p.hp += 10; } }
    ],
    mage: [
      { id: 'mana_boost', name: 'Amplification Magique', icon: '✨', desc: '+4 ATQ', cost: 1, effect: (p) => p.atk += 4 },
      { id: 'magic_shield', name: 'Bouclier Magique', icon: '🔮', desc: '+2 DÉF', cost: 1, effect: (p) => p.def += 2 },
      { id: 'arcane_power', name: 'Puissance Arcanique', icon: '🌟', desc: '+6 ATQ', cost: 2, effect: (p) => p.atk += 6 },
      { id: 'life_tap', name: 'Siphon de Vie', icon: '🩸', desc: '+8 PV Max', cost: 1, effect: (p) => { p.maxHp += 8; p.hp += 8; } }
    ],
    rogue: [
      { id: 'precision', name: 'Précision', icon: '🎯', desc: '+2 ATQ', cost: 1, effect: (p) => p.atk += 2 },
      { id: 'evasion', name: 'Évasion', icon: '💨', desc: '+4 DÉF', cost: 1, effect: (p) => p.def += 4 },
      { id: 'critical', name: 'Coup Critique', icon: '💢', desc: '25% de critique', cost: 2, effect: (p) => p.critChance = 0.25 },
      { id: 'agility', name: 'Agilité', icon: '🏃', desc: '+5 PV Max, +1 ATQ', cost: 1, effect: (p) => { p.maxHp += 5; p.hp += 5; p.atk += 1; } }
    ],
    cleric: [
      { id: 'holy_power', name: 'Puissance Sacrée', icon: '🙏', desc: '+2 ATQ', cost: 1, effect: (p) => p.atk += 2 },
      { id: 'divine_armor', name: 'Armure Divine', icon: '✝️', desc: '+4 DÉF', cost: 1, effect: (p) => p.def += 4 },
      { id: 'regeneration', name: 'Régénération', icon: '💚', desc: '+2 PV par tour', cost: 2, effect: (p) => p.regen = 2 },
      { id: 'vitality', name: 'Vitalité', icon: '❤️', desc: '+15 PV Max', cost: 1, effect: (p) => { p.maxHp += 15; p.hp += 15; } }
    ],
    // Compétences communes
    universal: [
      { id: 'treasure_hunter', name: 'Chasseur de Trésor', icon: '💰', desc: '+50% d\'or trouvé', cost: 1, effect: (p) => p.goldBonus = 1.5 },
      { id: 'survivalist', name: 'Survivaliste', icon: '🏕️', desc: 'Potions +50% efficaces', cost: 1, effect: (p) => p.potionBonus = 1.5 },
      { id: 'lucky', name: 'Chanceux', icon: '🍀', desc: '+20% objet rare', cost: 2, effect: (p) => p.luckBonus = 1.2 }
    ]
  };
  
  static checkLevelUp(player) {
    const currentLevel = player.level || 1;
    const currentXP = player.xp || 0;
    const requiredXP = this.XP_CURVE[currentLevel] || 999999;
    
    if (currentXP >= requiredXP && currentLevel < this.XP_CURVE.length) {
      player.level = currentLevel + 1;
      player.skillPoints = (player.skillPoints || 0) + 1;
      
      // Bonus de niveau
      player.maxHp += 5;
      player.hp = Math.min(player.hp + 5, player.maxHp);
      player.atk += 1;
      
      return {
        leveled: true,
        newLevel: player.level,
        skillPoints: player.skillPoints
      };
    }
    
    return { leveled: false };
  }
  
  static addXP(player, amount) {
    player.xp = (player.xp || 0) + amount;
    return this.checkLevelUp(player);
  }
  
  static getAvailableSkills(player) {
    const classType = player.classData.type; // warrior, mage, rogue, cleric
    const classSkills = this.SKILLS_TREE[classType] || [];
    const universalSkills = this.SKILLS_TREE.universal;
    
    player.unlockedSkills = player.unlockedSkills || [];
    
    return [...classSkills, ...universalSkills].filter(skill => 
      !player.unlockedSkills.includes(skill.id)
    );
  }
  
  static unlockSkill(player, skillId) {
    const allSkills = [
      ...this.SKILLS_TREE[player.classData.type] || [],
      ...this.SKILLS_TREE.universal
    ];
    
    const skill = allSkills.find(s => s.id === skillId);
    
    if (!skill) return { success: false, message: 'Compétence introuvable' };
    if (player.skillPoints < skill.cost) return { success: false, message: 'Pas assez de points' };
    
    player.skillPoints -= skill.cost;
    player.unlockedSkills = player.unlockedSkills || [];
    player.unlockedSkills.push(skill.id);
    
    // Appliquer l'effet
    skill.effect(player);
    
    return { 
      success: true, 
      message: `Compétence débloquée : ${skill.icon} ${skill.name}`,
      skill: skill
    };
  }
  
  static getProgressInfo(player) {
    const level = player.level || 1;
    const currentXP = player.xp || 0;
    const requiredXP = this.XP_CURVE[level] || 999999;
    const progress = Math.min((currentXP / requiredXP) * 100, 100);
    
    return {
      level,
      currentXP,
      requiredXP,
      progress: Math.floor(progress),
      skillPoints: player.skillPoints || 0,
      unlockedSkills: player.unlockedSkills || []
    };
  }

  /**
   * Retourne l'XP requise pour atteindre le niveau `level`.
   * Si le niveau demandé dépasse la courbe prédéfinie, on extrapole linéairement
   * à partir du dernier intervalle connu.
   */
  static getXPForLevel(level) {
    const idx = Math.max(1, Math.floor(level));
    if (this.XP_CURVE[idx] !== undefined) return this.XP_CURVE[idx];

    // Si on dépasse la courbe connue, extrapoler en utilisant le dernier écart
    const lastIndex = this.XP_CURVE.length - 1;
    const lastVal = this.XP_CURVE[lastIndex];
    const prevVal = this.XP_CURVE[lastIndex - 1] || (lastVal - 1000);
    const gap = lastVal - prevVal || 1000;

    return lastVal + (idx - lastIndex) * gap;
  }
}

console.log('📊 Système de progression chargé');