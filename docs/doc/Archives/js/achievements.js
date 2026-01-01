// @ts-nocheck
// 🎯 SYSTÈME D'ACHIEVEMENTS ET QUÊTES

class AchievementSystem {
  static ACHIEVEMENTS = {
    // 🏆 Progression
    first_steps: {
      id: 'first_steps',
      name: 'Premiers Pas',
      icon: '👣',
      desc: 'Parcourir 10 cases',
      category: 'progression',
      condition: (p) => p.position >= 10,
      reward: { xp: 50, gold: 10 }
    },
    veteran: {
      id: 'veteran',
      name: 'Vétéran',
      icon: '🎖️',
      desc: 'Parcourir 100 cases',
      category: 'progression',
      condition: (p) => p.position >= 100,
      reward: { xp: 200, gold: 50 }
    },
    explorer: {
      id: 'explorer',
      name: 'Explorateur',
      icon: '🗺️',
      desc: 'Parcourir 200 cases',
      category: 'progression',
      condition: (p) => p.position >= 200,
      reward: { xp: 500, item: 'TELEPORT_SCROLL' }
    },
    
    // ⚔️ Combat
    first_blood: {
      id: 'first_blood',
      name: 'Premier Sang',
      icon: '🩸',
      desc: 'Vaincre votre premier ennemi',
      category: 'combat',
      condition: (p) => (p.stats?.kills || 0) >= 1,
      reward: { xp: 30 }
    },
    slayer: {
      id: 'slayer',
      name: 'Tueur',
      icon: '⚔️',
      desc: 'Vaincre 10 ennemis',
      category: 'combat',
      condition: (p) => (p.stats?.kills || 0) >= 10,
      reward: { xp: 150, gold: 30 }
    },
    boss_hunter: {
      id: 'boss_hunter',
      name: 'Chasseur de Boss',
      icon: '👑',
      desc: 'Vaincre un boss',
      category: 'combat',
      condition: (p) => (p.stats?.bossKills || 0) >= 1,
      reward: { xp: 300, item: 'LEGENDARY_SWORD' }
    },
    
    // 💰 Richesse
    rich: {
      id: 'rich',
      name: 'Fortuné',
      icon: '💎',
      desc: 'Posséder 100 rubis',
      category: 'wealth',
      condition: (p) => p.inventory.getItemCount('RUBY') >= 100,
      reward: { xp: 100 }
    },
    treasure_master: {
      id: 'treasure_master',
      name: 'Maître des Trésors',
      icon: '💰',
      desc: 'Ouvrir 10 coffres',
      category: 'wealth',
      condition: (p) => (p.stats?.chestsOpened || 0) >= 10,
      reward: { xp: 200, gold: 100 }
    },
    
    // 🧠 Intelligence
    riddle_solver: {
      id: 'riddle_solver',
      name: 'Résolveur d\'Énigmes',
      icon: '🧩',
      desc: 'Résoudre 3 énigmes',
      category: 'intelligence',
      condition: (p) => (p.stats?.riddlesSolved || 0) >= 3,
      reward: { xp: 250, item: 'MAGIC_STAFF' }
    },
    scholar: {
      id: 'scholar',
      name: 'Érudit',
      icon: '📚',
      desc: 'Visiter la bibliothèque',
      category: 'intelligence',
      condition: (p) => (p.stats?.libraryVisited || false),
      reward: { xp: 150 }
    },
    
    // 💪 Survie
    survivor: {
      id: 'survivor',
      name: 'Survivant',
      icon: '❤️',
      desc: 'Survivre avec 1 PV',
      category: 'survival',
      condition: (p) => p.hp === 1 && (p.stats?.turnsSurvived || 0) > 0,
      reward: { xp: 200, item: 'PHOENIX_FEATHER' }
    },
    unstoppable: {
      id: 'unstoppable',
      name: 'Inarrêtable',
      icon: '🔥',
      desc: 'Atteindre niveau 5',
      category: 'survival',
      condition: (p) => (p.level || 1) >= 5,
      reward: { xp: 500, item: 'INVULNERABILITY_SCROLL' }
    },
    
    // 🎴 Cartes
    card_collector: {
      id: 'card_collector',
      name: 'Collectionneur',
      icon: '🃏',
      desc: 'Avoir 6 cartes dans le deck',
      category: 'cards',
     condition: (p) => p.deck && p.deck.cards && p.deck.cards.length >= 10,
      reward: { xp: 100 }
    },
    legendary_luck: {
      id: 'legendary_luck',
      name: 'Chance Légendaire',
      icon: '✨',
      desc: 'Obtenir une carte légendaire',
      category: 'cards',
      condition: (p) => p.deck && p.deck.cards && p.deck.cards.length >= X,
      reward: { xp: 300 }
    }
  };
  
  static QUESTS = {
    dungeon_master: {
      id: 'dungeon_master',
      name: 'Maître du Donjon',
      icon: '🏰',
      desc: 'Terminer le donjon',
      objectives: [
        { desc: 'Atteindre la sortie', condition: (p, d) => p.position >= d.path.length - 1 }
      ],
      reward: { xp: 1000, gold: 500 },
      type: 'main'
    },
    
    purge: {
      id: 'purge',
      name: 'Purge',
      icon: '💀',
      desc: 'Éliminer toutes les menaces',
      objectives: [
        { desc: 'Vaincre 20 ennemis', condition: (p) => (p.stats?.kills || 0) >= 20 }
      ],
      reward: { xp: 400, item: 'LEGENDARY_ARMOR' },
      type: 'side'
    },
    
    knowledge_seeker: {
      id: 'knowledge_seeker',
      name: 'Chercheur de Savoir',
      icon: '📖',
      desc: 'Acquérir des connaissances anciennes',
      objectives: [
        { desc: 'Résoudre 5 énigmes', condition: (p) => (p.stats?.riddlesSolved || 0) >= 5 },
        { desc: 'Visiter la bibliothèque', condition: (p) => p.stats?.libraryVisited }
      ],
      reward: { xp: 600, item: 'ANCIENT_TOME' },
      type: 'side'
    },
    
    treasure_hunt: {
      id: 'treasure_hunt',
      name: 'Chasse au Trésor',
      icon: '🗝️',
      desc: 'Amasser une fortune',
      objectives: [
        { desc: 'Ouvrir 15 coffres', condition: (p) => (p.stats?.chestsOpened || 0) >= 15 },
        { desc: 'Posséder 200 rubis', condition: (p) => p.inventory.getItemCount('RUBY') >= 200 }
      ],
      reward: { xp: 500, gold: 300 },
      type: 'side'
    }
  };
  
  static checkAchievements(player, dungeon) {
    const newAchievements = [];
    player.achievements = player.achievements || [];
    
    Object.values(this.ACHIEVEMENTS).forEach(achievement => {
      if (!player.achievements.includes(achievement.id)) {
        if (achievement.condition(player, dungeon)) {
          player.achievements.push(achievement.id);
          newAchievements.push(achievement);
          
          // Appliquer les récompenses
          if (achievement.reward.xp) {
            ProgressionSystem.addXP(player, achievement.reward.xp);
          }
          if (achievement.reward.gold) {
            player.inventory.addItem('RUBY', achievement.reward.gold);
          }
          if (achievement.reward.item) {
            player.inventory.addItem(achievement.reward.item, 1);
          }
        }
      }
    });
    
    return newAchievements;
  }
  
  static checkQuests(player, dungeon) {
    const completedQuests = [];
    player.completedQuests = player.completedQuests || [];
    player.activeQuests = player.activeQuests || Object.keys(this.QUESTS);
    
    player.activeQuests.forEach(questId => {
      const quest = this.QUESTS[questId];
      if (!quest || player.completedQuests.includes(questId)) return;
      
      const allComplete = quest.objectives.every(obj => obj.condition(player, dungeon));
      
      if (allComplete) {
        player.completedQuests.push(questId);
        player.activeQuests = player.activeQuests.filter(id => id !== questId);
        completedQuests.push(quest);
        
        // Appliquer les récompenses
        if (quest.reward.xp) {
          ProgressionSystem.addXP(player, quest.reward.xp);
        }
        if (quest.reward.gold) {
          player.inventory.addItem('RUBY', quest.reward.gold);
        }
        if (quest.reward.item) {
          player.inventory.addItem(quest.reward.item, 1);
        }
      }
    });
    
    return completedQuests;
  }
  
  static getQuestProgress(player, questId, dungeon) {
    const quest = this.QUESTS[questId];
    if (!quest) return null;
    
    return quest.objectives.map(obj => ({
      desc: obj.desc,
      completed: obj.condition(player, dungeon)
    }));
  }
  
  static getStats(player) {
    return {
      achievements: player.achievements?.length || 0,
      totalAchievements: Object.keys(this.ACHIEVEMENTS).length,
      completedQuests: player.completedQuests?.length || 0,
      activeQuests: player.activeQuests?.length || 0
    };
  }

  /**
   * Vérifie achievements & quêtes et renvoie les résultats
   * Retour: { newAchievements: [], completedQuests: [] }
   */
  static checkAll(player, dungeon) {
    const newAchievements = this.checkAchievements(player, dungeon);
    const completedQuests = this.checkQuests(player, dungeon);
    return { newAchievements, completedQuests };
  }
}

console.log('🎯 Système d\'achievements chargé');