/* ═══════════════════════════════════════════════════════
   👹 ENEMIES DATABASE - COIN-COIN DUNGEON
   Base de données des ennemis (corridor, salle, boss)
   ═══════════════════════════════════════════════════════ */

const ENEMIES_DATABASE = {

  /* ═══════════════════════════════════════════════════════
     🏃 ENNEMIS DE CORRIDOR (Faibles et rapides)
     ═══════════════════════════════════════════════════════ */

  CORRIDOR: {
    GOBLIN: {
      id: 'GOBLIN',
      name: 'Gobelin',
      icon: '👺',
      type: 'CORRIDOR',
      difficulty: 'easy',
      // Stats de base (scalent avec niveau)
      baseHp: 15,
      hpPerLevel: 3,
      baseAtk: 4,
      atkPerLevel: 1,
      baseDef: 0,
      defPerLevel: 0,
      speed: 4,
      // Récompenses
      baseXp: 10,
      xpPerLevel: 5,
      baseRubies: 5,
      rubiesPerLevel: 2,
      // Lore
      description: 'Petite créature malicieuse qui hante les corridors',
      lore: 'Les gobelins voyagent en groupes et pillent les imprudents.'
    },

    SKELETON: {
      id: 'SKELETON',
      name: 'Squelette',
      icon: '💀',
      type: 'CORRIDOR',
      difficulty: 'easy',
      baseHp: 12,
      hpPerLevel: 2,
      baseAtk: 6,
      atkPerLevel: 1,
      baseDef: 0,
      defPerLevel: 0,
      speed: 3,
      baseXp: 12,
      xpPerLevel: 5,
      baseRubies: 6,
      rubiesPerLevel: 2,
      description: 'Guerrier mort-vivant animé par la magie noire',
      lore: 'Ces os se redressent pour attaquer les intrus.'
    },

    RAT_GÉANT: {
      id: 'RAT_GEANT',
      name: 'Rat Géant',
      icon: '🐀',
      type: 'CORRIDOR',
      difficulty: 'easy',
      baseHp: 10,
      hpPerLevel: 2,
      baseAtk: 3,
      atkPerLevel: 1,
      baseDef: 0,
      defPerLevel: 0,
      speed: 6, // Très rapide
      baseXp: 8,
      xpPerLevel: 4,
      baseRubies: 3,
      rubiesPerLevel: 1,
      description: 'Rongeur mutant de la taille d\'un chien',
      lore: 'Ils se reproduisent vite et infestent les souterrains.'
    },

    ZOMBIE: {
      id: 'ZOMBIE',
      name: 'Zombie',
      icon: '🧟',
      type: 'CORRIDOR',
      difficulty: 'medium',
      baseHp: 20,
      hpPerLevel: 4,
      baseAtk: 5,
      atkPerLevel: 1,
      baseDef: 1,
      defPerLevel: 0,
      speed: 2, // Très lent
      baseXp: 15,
      xpPerLevel: 6,
      baseRubies: 7,
      rubiesPerLevel: 2,
      description: 'Cadavre ambulant assoiffé de chair',
      lore: 'Lents mais résistants, ils ne s\'arrêtent jamais.'
    },

    ARAIGNÉE: {
      id: 'ARAIGNEE',
      name: 'Araignée Géante',
      icon: '🕷️',
      type: 'CORRIDOR',
      difficulty: 'medium',
      baseHp: 14,
      hpPerLevel: 3,
      baseAtk: 7,
      atkPerLevel: 2,
      baseDef: 0,
      defPerLevel: 0,
      speed: 5,
      baseXp: 18,
      xpPerLevel: 7,
      baseRubies: 8,
      rubiesPerLevel: 3,
      description: 'Arachnide venimeux qui tisse ses toiles',
      lore: 'Son venin paralyse les plus braves aventuriers.',
      special: 'poison' // Peut infliger poison (future feature)
    }
  },

  /* ═══════════════════════════════════════════════════════
     🏰 ENNEMIS DE SALLE (Moyens et élites)
     ═══════════════════════════════════════════════════════ */

  ROOM: {
    ORC: {
      id: 'ORC',
      name: 'Orc Guerrier',
      icon: '👹',
      type: 'ROOM',
      difficulty: 'medium',
      baseHp: 30,
      hpPerLevel: 6,
      baseAtk: 8,
      atkPerLevel: 2,
      baseDef: 2,
      defPerLevel: 1,
      speed: 4,
      baseXp: 30,
      xpPerLevel: 10,
      baseRubies: 15,
      rubiesPerLevel: 5,
      description: 'Guerrier brutal d\'une tribu sauvage',
      lore: 'Les orcs sont réputés pour leur force brute.'
    },

    LOUP_ALPHA: {
      id: 'LOUP_ALPHA',
      name: 'Loup Alpha',
      icon: '🐺',
      type: 'ROOM',
      difficulty: 'medium',
      baseHp: 28,
      hpPerLevel: 5,
      baseAtk: 10,
      atkPerLevel: 2,
      baseDef: 1,
      defPerLevel: 0,
      speed: 7, // Très rapide
      baseXp: 35,
      xpPerLevel: 12,
      baseRubies: 18,
      rubiesPerLevel: 6,
      description: 'Chef de meute aux crocs acérés',
      lore: 'L\'alpha ne chasse jamais seul dans la nature.',
      special: 'pack_leader' // Bonus si plusieurs loups (future)
    },

    GOLEM: {
      id: 'GOLEM',
      name: 'Golem de Pierre',
      icon: '🗿',
      type: 'ROOM',
      difficulty: 'hard',
      baseHp: 50,
      hpPerLevel: 8,
      baseAtk: 12,
      atkPerLevel: 3,
      baseDef: 5,
      defPerLevel: 2,
      speed: 2, // Très lent
      baseXp: 50,
      xpPerLevel: 15,
      baseRubies: 25,
      rubiesPerLevel: 8,
      description: 'Colosse de pierre animé par la magie',
      lore: 'Sa peau de roche le rend presque invulnérable.',
      special: 'high_defense' // Dégâts réduits
    },

    SORCIER: {
      id: 'SORCIER',
      name: 'Sorcier Noir',
      icon: '🧙‍♂️',
      type: 'ROOM',
      difficulty: 'hard',
      baseHp: 25,
      hpPerLevel: 4,
      baseAtk: 15,
      atkPerLevel: 4,
      baseDef: 1,
      defPerLevel: 0,
      speed: 5,
      baseXp: 60,
      xpPerLevel: 20,
      baseRubies: 30,
      rubiesPerLevel: 10,
      description: 'Mage maléfique qui invoque les ténèbres',
      lore: 'Ses sorts peuvent détruire en un instant.',
      special: 'magic_attack' // Ignore défense
    },

    CHEVALIER_NOIR: {
      id: 'CHEVALIER_NOIR',
      name: 'Chevalier Noir',
      icon: '⚔️',
      type: 'ROOM',
      difficulty: 'hard',
      baseHp: 40,
      hpPerLevel: 7,
      baseAtk: 14,
      atkPerLevel: 3,
      baseDef: 4,
      defPerLevel: 1,
      speed: 5,
      baseXp: 70,
      xpPerLevel: 25,
      baseRubies: 35,
      rubiesPerLevel: 12,
      description: 'Guerrier d\'élite en armure complète',
      lore: 'Anciens héros corrompus par les ténèbres.',
      special: 'counter_attack' // Riposte aux attaques
    }
  },

  /* ═══════════════════════════════════════════════════════
     👑 BOSS (Uniques et légendaires)
     ═══════════════════════════════════════════════════════ */

  BOSS: {
    GOBLIN_KING: {
      id: 'GOBLIN_KING',
      name: 'Roi des Gobelins',
      icon: '👑',
      type: 'BOSS',
      difficulty: 'boss',
      // Stats fixes (ne scalent PAS)
      hp: 80,
      atk: 12,
      def: 3,
      speed: 5,
      // Récompenses importantes
      xp: 150,
      rubies: 50,
      lootItems: [
        { id: 'IRON_SWORD', rarity: 'uncommon', chance: 0.8 },
        { id: 'CROWN_OF_THORNS', rarity: 'legendary', chance: 0.1 }
      ],
      description: 'Tyran des profondeurs qui règne sur les gobelins',
      lore: 'Sa couronne d\'épines symbolise son règne sanglant.',
      phases: [
        { hpThreshold: 0.5, behavior: 'SUMMON_MINIONS' },
        { hpThreshold: 0.25, behavior: 'ENRAGE' }
      ]
    },

    NECROMANCER: {
      id: 'NECROMANCER',
      name: 'Nécromancien',
      icon: '☠️',
      type: 'BOSS',
      difficulty: 'boss',
      hp: 100,
      atk: 15,
      def: 2,
      speed: 4,
      xp: 200,
      rubies: 75,
      lootItems: [
        { id: 'STAFF_OF_ETERNITY', rarity: 'legendary', chance: 0.2 },
        { id: 'CRYSTAL_STAFF', rarity: 'rare', chance: 0.6 },
        { id: 'RESURRECTION_ELIXIR', rarity: 'legendary', chance: 0.3 }
      ],
      description: 'Maître des arts interdits de la nécromancie',
      lore: 'Il commande une armée de morts-vivants sans fin.',
      phases: [
        { hpThreshold: 0.7, behavior: 'SUMMON_SKELETONS' },
        { hpThreshold: 0.3, behavior: 'DEATH_CURSE' }
      ],
      special: 'summon_undead'
    },

    ANCIENT_DRAGON: {
      id: 'ANCIENT_DRAGON',
      name: 'Dragon Ancien',
      icon: '🐉',
      type: 'BOSS',
      difficulty: 'boss',
      hp: 200,
      atk: 25,
      def: 8,
      speed: 6,
      xp: 500,
      rubies: 150,
      lootItems: [
        { id: 'DRAGONSLAYER', rarity: 'legendary', chance: 0.15 },
        { id: 'DRAGON_SCALE_ARMOR', rarity: 'legendary', chance: 0.2 },
        { id: 'DRAGON_HELMET', rarity: 'legendary', chance: 0.25 },
        { id: 'HOURGLASS_OF_TIME', rarity: 'legendary', chance: 0.1 }
      ],
      description: 'Créature millénaire qui garde un trésor légendaire',
      lore: 'Son souffle de feu peut réduire des armées en cendres.',
      phases: [
        { hpThreshold: 0.75, behavior: 'FLIGHT' },
        { hpThreshold: 0.5, behavior: 'FIRE_BREATH' },
        { hpThreshold: 0.25, behavior: 'DESPERATE_RAGE' }
      ],
      special: 'fire_immunity',
      weaknesses: ['ice', 'dragonsbane']
    },

    LICH: {
      id: 'LICH',
      name: 'Liche Éternelle',
      icon: '🦴',
      type: 'BOSS',
      difficulty: 'boss',
      hp: 150,
      atk: 20,
      def: 5,
      speed: 4,
      xp: 400,
      rubies: 120,
      lootItems: [
        { id: 'PHOENIX_FEATHER', rarity: 'legendary', chance: 0.3 },
        { id: 'BOOK_OF_DESTINY', rarity: 'legendary', chance: 0.15 },
        { id: 'RING_OF_POWER', rarity: 'legendary', chance: 0.1 }
      ],
      description: 'Sorcier mort-vivant au pouvoir terrifiant',
      lore: 'Immortel grâce à son phylactère, il revient toujours.',
      phases: [
        { hpThreshold: 0.6, behavior: 'PHASE_SHIFT' },
        { hpThreshold: 0.3, behavior: 'LIFE_DRAIN' }
      ],
      special: 'phylactery', // Nécessite de détruire le phylactère
      immunities: ['poison', 'death']
    },

    DEMON_LORD: {
      id: 'DEMON_LORD',
      name: 'Seigneur Démon',
      icon: '😈',
      type: 'BOSS',
      difficulty: 'boss',
      hp: 250,
      atk: 30,
      def: 6,
      speed: 7,
      xp: 1000,
      rubies: 200,
      lootItems: [
        { id: 'EXCALIBUR', rarity: 'legendary', chance: 0.1 },
        { id: 'AEGIS', rarity: 'legendary', chance: 0.15 },
        { id: 'CLOAK_OF_INVISIBILITY', rarity: 'legendary', chance: 0.12 }
      ],
      description: 'Incarnation ultime du mal absolu',
      lore: 'Sa défaite libérera le royaume des ténèbres éternelles.',
      phases: [
        { hpThreshold: 0.75, behavior: 'DEMON_FORM' },
        { hpThreshold: 0.5, behavior: 'HELLFIRE' },
        { hpThreshold: 0.25, behavior: 'APOCALYPSE' }
      ],
      special: 'corruption_aura', // Augmente corruption du joueur
      finalBoss: true
    }
  }
};

/* ═══════════════════════════════════════════════════════
   🛠️ HELPER FUNCTIONS
   ═══════════════════════════════════════════════════════ */

const EnemiesDB = {
  /**
   * Génère un ennemi de corridor adapté au niveau
   */
  generateCorridorEnemy(playerLevel = 1) {
    const pool = Object.values(ENEMIES_DATABASE.CORRIDOR);
    const template = pool[Math.floor(Math.random() * pool.length)];

    return this.scaleEnemy(template, playerLevel);
  },

  /**
   * Génère un ennemi de salle adapté au niveau
   */
  generateRoomEnemy(playerLevel = 1, difficulty = 'medium') {
    const pool = Object.values(ENEMIES_DATABASE.ROOM).filter(e => {
      if (difficulty === 'easy') return e.difficulty === 'medium';
      if (difficulty === 'hard') return e.difficulty === 'hard';
      return true; // Tous pour 'medium'
    });

    const template = pool[Math.floor(Math.random() * pool.length)];
    return this.scaleEnemy(template, playerLevel);
  },

  /**
   * Récupère un boss spécifique
   */
  getBoss(bossId) {
    const boss = ENEMIES_DATABASE.BOSS[bossId];
    if (!boss) {
      console.warn(`⚠️ Boss non trouvé: ${bossId}`);
      return null;
    }

    // Boss ne scale pas, retourne tel quel avec ID unique
    return {
      ...boss,
      id: boss.id + '_' + Date.now(),
      maxHp: boss.hp,
      sprite: boss.icon,
      isAlly: false
    };
  },

  /**
   * Récupère un boss aléatoire
   */
  getRandomBoss() {
    const bosses = Object.keys(ENEMIES_DATABASE.BOSS);
    const bossId = bosses[Math.floor(Math.random() * bosses.length)];
    return this.getBoss(bossId);
  },

  /**
   * Scale un ennemi selon le niveau du joueur
   */
  scaleEnemy(template, playerLevel) {
    const hp = template.baseHp + (template.hpPerLevel * playerLevel);
    const atk = template.baseAtk + (template.atkPerLevel * playerLevel);
    const def = template.baseDef + (template.defPerLevel * playerLevel);
    const xp = template.baseXp + (template.xpPerLevel * playerLevel);
    const rubies = template.baseRubies + (template.rubiesPerLevel * playerLevel);

    return {
      id: template.id + '_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      name: template.name,
      icon: template.icon,
      sprite: template.icon,
      type: template.type,
      difficulty: template.difficulty,
      hp: hp,
      maxHp: hp,
      atk: atk,
      def: def,
      speed: template.speed,
      xp: xp,
      rubies: rubies,
      gold: rubies, // Compatibility
      description: template.description,
      lore: template.lore,
      special: template.special,
      isAlly: false
    };
  },

  /**
   * Récupère tous les ennemis par type
   */
  getEnemiesByType(type) {
    if (type === 'CORRIDOR') return Object.values(ENEMIES_DATABASE.CORRIDOR);
    if (type === 'ROOM') return Object.values(ENEMIES_DATABASE.ROOM);
    if (type === 'BOSS') return Object.values(ENEMIES_DATABASE.BOSS);
    return [];
  },

  /**
   * Stats de la database
   */
  getStats() {
    return {
      corridor: Object.keys(ENEMIES_DATABASE.CORRIDOR).length,
      room: Object.keys(ENEMIES_DATABASE.ROOM).length,
      boss: Object.keys(ENEMIES_DATABASE.BOSS).length,
      total: Object.keys(ENEMIES_DATABASE.CORRIDOR).length +
             Object.keys(ENEMIES_DATABASE.ROOM).length +
             Object.keys(ENEMIES_DATABASE.BOSS).length
    };
  }
};

/* ═══════════════════════════════════════════════════════
   🌍 EXPORT GLOBAL
   ═══════════════════════════════════════════════════════ */

if (typeof window !== 'undefined') {
  window.ENEMIES_DATABASE = ENEMIES_DATABASE;
  window.EnemiesDB = EnemiesDB;

  console.log('👹 Enemies Database loaded');
  console.log('📊 Stats:', EnemiesDB.getStats());
}
