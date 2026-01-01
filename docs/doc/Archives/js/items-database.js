/* ═══════════════════════════════════════════════════════
   📦 ITEMS DATABASE - COIN-COIN DUNGEON
   Base de données centralisée de tous les items du jeu
   ═══════════════════════════════════════════════════════ */

const ITEMS_DATABASE = {

  /* ═══════════════════════════════════════════════════════
     ⚔️ ARMES
     ═══════════════════════════════════════════════════════ */

  WEAPONS: {
    // COMMON (Bois, Fer basique)
    WOODEN_SWORD: {
      id: 'WOODEN_SWORD',
      name: 'Épée en Bois',
      type: 'WEAPON',
      slot: 'MAIN_HAND',
      rarity: 'common',
      icon: '🗡️',
      stats: { atk: 2 },
      price: 15,
      sellPrice: 5,
      description: 'Une simple épée d\'entraînement en bois',
      lore: 'Forgée par les apprentis, elle ne coupera que du pain.'
    },

    WOODEN_BOW: {
      id: 'WOODEN_BOW',
      name: 'Arc en Bois',
      type: 'WEAPON',
      slot: 'MAIN_HAND',
      rarity: 'common',
      icon: '🏹',
      stats: { atk: 2, speed: 1 },
      price: 20,
      sellPrice: 7,
      description: 'Un arc basique pour débutants',
      lore: 'Idéal pour chasser le lapin, moins pour les dragons.'
    },

    WOODEN_STAFF: {
      id: 'WOODEN_STAFF',
      name: 'Bâton de Bois',
      type: 'WEAPON',
      slot: 'MAIN_HAND',
      rarity: 'common',
      icon: '🪄',
      stats: { atk: 1, maxHp: 5 },
      price: 18,
      sellPrice: 6,
      description: 'Un bâton de marche gravé de runes',
      lore: 'Les magiciens débutants s\'en servent comme canne.'
    },

    // UNCOMMON (Fer, Acier)
    IRON_SWORD: {
      id: 'IRON_SWORD',
      name: 'Épée en Fer',
      type: 'WEAPON',
      slot: 'MAIN_HAND',
      rarity: 'uncommon',
      icon: '⚔️',
      stats: { atk: 5, critChance: 5 },
      price: 50,
      sellPrice: 20,
      description: 'Une épée solide en fer forgé',
      lore: 'L\'arme standard des soldats du royaume.'
    },

    STEEL_BOW: {
      id: 'STEEL_BOW',
      name: 'Arc en Acier',
      type: 'WEAPON',
      slot: 'MAIN_HAND',
      rarity: 'uncommon',
      icon: '🏹',
      stats: { atk: 5, speed: 2, critChance: 8 },
      price: 60,
      sellPrice: 25,
      description: 'Arc renforcé avec câble d\'acier',
      lore: 'La portée est impressionnante, l\'entretien aussi.'
    },

    CRYSTAL_STAFF: {
      id: 'CRYSTAL_STAFF',
      name: 'Bâton de Cristal',
      type: 'WEAPON',
      slot: 'MAIN_HAND',
      rarity: 'uncommon',
      icon: '🔮',
      stats: { atk: 4, maxHp: 10, def: 1 },
      price: 55,
      sellPrice: 22,
      description: 'Bâton surmonté d\'un cristal magique',
      lore: 'Le cristal amplifie les sorts élémentaires.'
    },

    // RARE (Mithril, Enchantements)
    MITHRIL_SWORD: {
      id: 'MITHRIL_SWORD',
      name: 'Épée en Mithril',
      type: 'WEAPON',
      slot: 'MAIN_HAND',
      rarity: 'rare',
      icon: '⚔️',
      stats: { atk: 10, speed: 1, critChance: 10 },
      price: 150,
      sellPrice: 60,
      description: 'Lame légère en mithril argenté',
      lore: 'Forgée dans les mines des montagnes éternelles.'
    },

    ENCHANTED_BOW: {
      id: 'ENCHANTED_BOW',
      name: 'Arc Enchanté',
      type: 'WEAPON',
      slot: 'MAIN_HAND',
      rarity: 'rare',
      icon: '🏹',
      stats: { atk: 9, speed: 3, critChance: 15 },
      price: 180,
      sellPrice: 70,
      description: 'Arc magique tirant des flèches d\'énergie',
      lore: 'Les flèches se matérialisent par magie pure.'
    },

    ARCHMAGE_STAFF: {
      id: 'ARCHMAGE_STAFF',
      name: 'Bâton d\'Archimage',
      type: 'WEAPON',
      slot: 'MAIN_HAND',
      rarity: 'rare',
      icon: '🪄',
      stats: { atk: 8, maxHp: 20, def: 2 },
      price: 170,
      sellPrice: 65,
      description: 'Bâton de puissance magique',
      lore: 'Seuls les archimages maîtrisent son pouvoir.'
    },

    // LEGENDARY (Armes légendaires)
    EXCALIBUR: {
      id: 'EXCALIBUR',
      name: 'Excalibur',
      type: 'WEAPON',
      slot: 'MAIN_HAND',
      rarity: 'legendary',
      unique: true,
      icon: '🗡️✨',
      stats: { atk: 20, speed: 2, critChance: 25, def: 3 },
      price: null, // Ne peut pas être acheté
      sellPrice: 500,
      description: 'L\'épée légendaire du roi Arthur',
      lore: 'Seul le véritable roi peut la brandir. Sa lame ne se ternit jamais.',
      passive: 'DIVINE_PROTECTION', // Réduit dégâts subis de 20%
      onEquip: (player) => {
        player.divineProtection = true;
        return '✨ Vous sentez une présence divine vous protéger.';
      },
      onUnequip: (player) => {
        player.divineProtection = false;
      }
    },

    DRAGONSLAYER: {
      id: 'DRAGONSLAYER',
      name: 'Tueuse de Dragons',
      type: 'WEAPON',
      slot: 'MAIN_HAND',
      rarity: 'legendary',
      unique: true,
      icon: '⚔️🐉',
      stats: { atk: 25, critChance: 20 },
      price: null,
      sellPrice: 600,
      description: 'Épée massive forgée pour abattre les dragons',
      lore: 'Forgée dans le feu d\'un dragon ancien. Elle vibre de haine draconique.',
      passive: 'DRAGONSBANE', // x3 dégâts contre dragons
      onEquip: (player) => {
        player.dragonsbane = true;
        return '🐉 La lame rugit, assoiffée de sang de dragon.';
      }
    },

    MOONLIGHT_BOW: {
      id: 'MOONLIGHT_BOW',
      name: 'Arc de Clair de Lune',
      type: 'WEAPON',
      slot: 'MAIN_HAND',
      rarity: 'legendary',
      unique: true,
      icon: '🏹🌙',
      stats: { atk: 18, speed: 5, critChance: 30 },
      price: null,
      sellPrice: 550,
      description: 'Arc tissé de rayons lunaires',
      lore: 'Créé par les elfes de la forêt éternelle. Ses flèches ne manquent jamais.',
      passive: 'MOONLIGHT_PRECISION', // +50% précision la nuit
      onEquip: (player) => {
        player.moonlightPrecision = true;
        return '🌙 L\'arc brille d\'une lueur argentée.';
      }
    },

    STAFF_OF_ETERNITY: {
      id: 'STAFF_OF_ETERNITY',
      name: 'Bâton de l\'Éternité',
      type: 'WEAPON',
      slot: 'MAIN_HAND',
      rarity: 'legendary',
      unique: true,
      icon: '🪄⏳',
      stats: { atk: 15, maxHp: 50, def: 5 },
      price: null,
      sellPrice: 700,
      description: 'Bâton ancien contenant l\'essence du temps',
      lore: 'Forgé à l\'aube du monde. Il a vu naître et mourir des civilisations entières.',
      passive: 'TIME_MASTERY', // 10% chance de jouer 2x par tour
      onEquip: (player) => {
        player.timeMastery = true;
        return '⏳ Le temps semble ralentir autour de vous.';
      }
    }
  },

  /* ═══════════════════════════════════════════════════════
     🛡️ ARMURES
     ═══════════════════════════════════════════════════════ */

  ARMOR: {
    // CASQUES
    LEATHER_HELMET: {
      id: 'LEATHER_HELMET',
      name: 'Casque en Cuir',
      type: 'ARMOR',
      slot: 'HEAD',
      rarity: 'common',
      icon: '🪖',
      stats: { def: 1, maxHp: 5 },
      price: 20,
      sellPrice: 7,
      description: 'Casque simple en cuir tanné'
    },

    IRON_HELMET: {
      id: 'IRON_HELMET',
      name: 'Heaume en Fer',
      type: 'ARMOR',
      slot: 'HEAD',
      rarity: 'uncommon',
      icon: '🪖',
      stats: { def: 3, maxHp: 10 },
      price: 60,
      sellPrice: 25,
      description: 'Heaume solide en fer forgé'
    },

    DRAGON_HELMET: {
      id: 'DRAGON_HELMET',
      name: 'Heaume Draconique',
      type: 'ARMOR',
      slot: 'HEAD',
      rarity: 'legendary',
      unique: true,
      icon: '🐉',
      stats: { def: 10, maxHp: 30, atk: 3 },
      price: null,
      sellPrice: 400,
      description: 'Heaume forgé dans les écailles d\'un dragon ancien',
      lore: 'Les cornes draconiques inspirent la terreur.',
      passive: 'DRAGON_FEAR' // Ennemis -10% ATK
    },

    // ARMURES DE CORPS
    LEATHER_ARMOR: {
      id: 'LEATHER_ARMOR',
      name: 'Armure de Cuir',
      type: 'ARMOR',
      slot: 'BODY',
      rarity: 'common',
      icon: '🦺',
      stats: { def: 2, speed: 1 },
      price: 30,
      sellPrice: 10,
      description: 'Armure légère en cuir renforcé'
    },

    CHAIN_MAIL: {
      id: 'CHAIN_MAIL',
      name: 'Cotte de Mailles',
      type: 'ARMOR',
      slot: 'BODY',
      rarity: 'uncommon',
      icon: '🦺',
      stats: { def: 5, maxHp: 15 },
      price: 80,
      sellPrice: 30,
      description: 'Armure de mailles entrelacées'
    },

    PLATE_ARMOR: {
      id: 'PLATE_ARMOR',
      name: 'Armure de Plates',
      type: 'ARMOR',
      slot: 'BODY',
      rarity: 'rare',
      icon: '🛡️',
      stats: { def: 10, maxHp: 30, speed: -1 },
      price: 200,
      sellPrice: 80,
      description: 'Armure lourde en plaques d\'acier'
    },

    DRAGON_SCALE_ARMOR: {
      id: 'DRAGON_SCALE_ARMOR',
      name: 'Armure d\'Écailles de Dragon',
      type: 'ARMOR',
      slot: 'BODY',
      rarity: 'legendary',
      unique: true,
      icon: '🐲',
      stats: { def: 20, maxHp: 50, atk: 5 },
      price: null,
      sellPrice: 800,
      description: 'Armure forgée dans les écailles d\'un dragon ancien',
      lore: 'Imperméable au feu et aux armes ordinaires.',
      passive: 'DRAGON_SKIN' // Immunité feu, -50% dégâts magiques
    },

    // BOUCLIERS
    WOODEN_SHIELD: {
      id: 'WOODEN_SHIELD',
      name: 'Bouclier en Bois',
      type: 'ARMOR',
      slot: 'OFF_HAND',
      rarity: 'common',
      icon: '🛡️',
      stats: { def: 2 },
      price: 15,
      sellPrice: 5,
      description: 'Bouclier rond en bois renforcé'
    },

    IRON_SHIELD: {
      id: 'IRON_SHIELD',
      name: 'Bouclier en Fer',
      type: 'ARMOR',
      slot: 'OFF_HAND',
      rarity: 'uncommon',
      icon: '🛡️',
      stats: { def: 5, maxHp: 10 },
      price: 50,
      sellPrice: 20,
      description: 'Bouclier métallique solide'
    },

    AEGIS: {
      id: 'AEGIS',
      name: 'Égide Divine',
      type: 'ARMOR',
      slot: 'OFF_HAND',
      rarity: 'legendary',
      unique: true,
      icon: '🛡️✨',
      stats: { def: 15, maxHp: 40 },
      price: null,
      sellPrice: 600,
      description: 'Le bouclier légendaire de la déesse Athéna',
      lore: 'Aucune attaque ne peut briser sa protection divine.',
      passive: 'DIVINE_AEGIS' // 25% chance de bloquer totalement
    },

    // BOTTES
    LEATHER_BOOTS: {
      id: 'LEATHER_BOOTS',
      name: 'Bottes en Cuir',
      type: 'ARMOR',
      slot: 'FEET',
      rarity: 'common',
      icon: '👢',
      stats: { speed: 1 },
      price: 15,
      sellPrice: 5,
      description: 'Bottes confortables en cuir souple'
    },

    SPEED_BOOTS: {
      id: 'SPEED_BOOTS',
      name: 'Bottes de Vitesse',
      type: 'ARMOR',
      slot: 'FEET',
      rarity: 'uncommon',
      icon: '👢⚡',
      stats: { speed: 3, def: 1 },
      price: 70,
      sellPrice: 28,
      description: 'Bottes enchantées augmentant la vitesse'
    },

    HERMES_SANDALS: {
      id: 'HERMES_SANDALS',
      name: 'Sandales d\'Hermès',
      type: 'ARMOR',
      slot: 'FEET',
      rarity: 'legendary',
      unique: true,
      icon: '🩴✨',
      stats: { speed: 8, def: 3 },
      price: null,
      sellPrice: 500,
      description: 'Sandales ailées du messager des dieux',
      lore: 'Permet de voler au-dessus des obstacles.',
      passive: 'FLIGHT' // Ignore terrain difficile
    },

    // GANTS
    LEATHER_GLOVES: {
      id: 'LEATHER_GLOVES',
      name: 'Gants en Cuir',
      type: 'ARMOR',
      slot: 'HANDS',
      rarity: 'common',
      icon: '🧤',
      stats: { atk: 1, def: 1 },
      price: 12,
      sellPrice: 4,
      description: 'Gants souples pour meilleure prise'
    },

    GAUNTLETS: {
      id: 'GAUNTLETS',
      name: 'Gantelets d\'Acier',
      type: 'ARMOR',
      slot: 'HANDS',
      rarity: 'uncommon',
      icon: '🧤',
      stats: { atk: 2, def: 3 },
      price: 45,
      sellPrice: 18,
      description: 'Gantelets métalliques renforcés'
    },

    TITAN_GAUNTLETS: {
      id: 'TITAN_GAUNTLETS',
      name: 'Gantelets de Titan',
      type: 'ARMOR',
      slot: 'HANDS',
      rarity: 'legendary',
      unique: true,
      icon: '🧤⚡',
      stats: { atk: 10, def: 8, critChance: 15 },
      price: null,
      sellPrice: 550,
      description: 'Gantelets forgés par les titans primordiaux',
      lore: 'Chaque coup résonne comme un coup de tonnerre.',
      passive: 'TITAN_STRENGTH' // +50% dégâts de mêlée
    }
  },

  /* ═══════════════════════════════════════════════════════
     🧪 POTIONS & CONSOMMABLES
     ═══════════════════════════════════════════════════════ */

  POTIONS: {
    // SOINS
    HEALTH_POTION: {
      id: 'HEALTH_POTION',
      name: 'Potion de Soin',
      type: 'CONSUMABLE',
      rarity: 'common',
      icon: '🧪',
      stackable: true,
      maxStack: 10,
      price: 15,
      sellPrice: 5,
      description: 'Restaure 20 HP',
      effect: (player) => {
        const healed = Math.min(20, player.maxHp - player.hp);
        player.hp = Math.min(player.maxHp, player.hp + 20);
        return `+${healed} HP`;
      }
    },

    GREATER_HEALTH_POTION: {
      id: 'GREATER_HEALTH_POTION',
      name: 'Grande Potion de Soin',
      type: 'CONSUMABLE',
      rarity: 'uncommon',
      icon: '🧪',
      stackable: true,
      maxStack: 5,
      price: 40,
      sellPrice: 15,
      description: 'Restaure 50 HP',
      effect: (player) => {
        const healed = Math.min(50, player.maxHp - player.hp);
        player.hp = Math.min(player.maxHp, player.hp + 50);
        return `+${healed} HP`;
      }
    },

    FULL_RESTORE: {
      id: 'FULL_RESTORE',
      name: 'Élixir de Restauration Totale',
      type: 'CONSUMABLE',
      rarity: 'rare',
      icon: '🧪✨',
      stackable: true,
      maxStack: 3,
      price: 100,
      sellPrice: 40,
      description: 'Restaure 100% HP',
      effect: (player) => {
        const healed = player.maxHp - player.hp;
        player.hp = player.maxHp;
        return `+${healed} HP (Full restore!)`;
      }
    },

    // BUFFS TEMPORAIRES
    STRENGTH_POTION: {
      id: 'STRENGTH_POTION',
      name: 'Potion de Force',
      type: 'CONSUMABLE',
      rarity: 'common',
      icon: '⚡',
      stackable: true,
      maxStack: 5,
      price: 25,
      sellPrice: 10,
      description: '+3 ATK pendant 3 tours',
      effect: (player) => {
        player.tempAtk = (player.tempAtk || 0) + 3;
        player.tempAtkTurns = 3;
        return '+3 ATK (3 tours)';
      }
    },

    DEFENSE_POTION: {
      id: 'DEFENSE_POTION',
      name: 'Potion de Défense',
      type: 'CONSUMABLE',
      rarity: 'common',
      icon: '🛡️',
      stackable: true,
      maxStack: 5,
      price: 25,
      sellPrice: 10,
      description: '+3 DEF pendant 3 tours',
      effect: (player) => {
        player.tempDef = (player.tempDef || 0) + 3;
        player.tempDefTurns = 3;
        return '+3 DEF (3 tours)';
      }
    },

    SPEED_POTION: {
      id: 'SPEED_POTION',
      name: 'Potion de Vitesse',
      type: 'CONSUMABLE',
      rarity: 'uncommon',
      icon: '💨',
      stackable: true,
      maxStack: 5,
      price: 30,
      sellPrice: 12,
      description: '+5 SPEED pendant 3 tours',
      effect: (player) => {
        player.tempSpeed = (player.tempSpeed || 0) + 5;
        player.tempSpeedTurns = 3;
        return '+5 SPEED (3 tours)';
      }
    },

    // SPÉCIAUX
    INVULNERABILITY_SCROLL: {
      id: 'INVULNERABILITY_SCROLL',
      name: 'Parchemin d\'Invulnérabilité',
      type: 'CONSUMABLE',
      rarity: 'rare',
      icon: '📜',
      stackable: true,
      maxStack: 2,
      price: 150,
      sellPrice: 60,
      description: 'Invulnérable pendant 1 tour',
      effect: (player) => {
        player.invulnerable = true;
        player.invulnerableTurns = 1;
        return '✨ Invulnérabilité activée !';
      }
    },

    RESURRECTION_ELIXIR: {
      id: 'RESURRECTION_ELIXIR',
      name: 'Élixir de Résurrection',
      type: 'CONSUMABLE',
      rarity: 'legendary',
      icon: '🧪💀',
      stackable: true,
      maxStack: 1,
      price: 500,
      sellPrice: 200,
      description: 'Ressuscite automatiquement à 50% HP en cas de mort',
      effect: (player) => {
        player.hasResurrection = true;
        return '💀 Protection contre la mort activée !';
      }
    }
  },

  /* ═══════════════════════════════════════════════════════
     🎒 ITEMS JDR (Objets d'aventure)
     ═══════════════════════════════════════════════════════ */

  JDR_ITEMS: {
    TORCH: {
      id: 'TORCH',
      name: 'Torche',
      type: 'UTILITY',
      rarity: 'common',
      icon: '🔦',
      stackable: true,
      maxStack: 5,
      price: 5,
      sellPrice: 1,
      description: 'Éclaire les zones sombres',
      effect: (player) => {
        player.hasTorch = true;
        return '🔦 Zone éclairée';
      }
    },

    ROPE: {
      id: 'ROPE',
      name: 'Corde (10m)',
      type: 'UTILITY',
      rarity: 'common',
      icon: '🪢',
      stackable: true,
      maxStack: 3,
      price: 10,
      sellPrice: 3,
      description: 'Utile pour escalader ou attacher',
      effect: (_player, _context) => {
        // Logique contextuelle (traverser gouffre, etc.)
        return '🪢 Corde utilisée';
      }
    },

    LOCKPICK: {
      id: 'LOCKPICK',
      name: 'Crochet de Serrure',
      type: 'UTILITY',
      rarity: 'uncommon',
      icon: '🔓',
      stackable: true,
      maxStack: 5,
      price: 20,
      sellPrice: 8,
      description: 'Permet de crocheter les serrures',
      effect: (player, _lock) => {
        const chance = 0.7 + (player.level * 0.05);
        if (Math.random() < chance) {
          return '🔓 Serrure crochetée avec succès !';
        } else {
          return '❌ Échec du crochetage';
        }
      }
    },

    MAP: {
      id: 'MAP',
      name: 'Carte du Donjon',
      type: 'UTILITY',
      rarity: 'uncommon',
      icon: '🗺️',
      stackable: false,
      price: 50,
      sellPrice: 20,
      description: 'Révèle les pièces adjacentes',
      effect: (player) => {
        player.hasMap = true;
        return '🗺️ Carte déployée';
      }
    },

    TELEPORT_SCROLL: {
      id: 'TELEPORT_SCROLL',
      name: 'Parchemin de Téléportation',
      type: 'UTILITY',
      rarity: 'rare',
      icon: '📜✨',
      stackable: true,
      maxStack: 3,
      price: 100,
      sellPrice: 40,
      description: 'Avance de 10 cases aléatoirement',
      effect: (_player, _game) => {
        // Logique de téléportation dans game.js
        return '✨ Téléportation !';
      }
    },

    RATION: {
      id: 'RATION',
      name: 'Ration de Voyage',
      type: 'UTILITY',
      rarity: 'common',
      icon: '🍖',
      stackable: true,
      maxStack: 10,
      price: 8,
      sellPrice: 2,
      description: 'Restaure 10 HP hors combat',
      effect: (player) => {
        const healed = Math.min(10, player.maxHp - player.hp);
        player.hp = Math.min(player.maxHp, player.hp + 10);
        return `+${healed} HP`;
      }
    }
  },

  /* ═══════════════════════════════════════════════════════
     💍 ACCESSOIRES (Anneaux, Amulettes, Capes)
     ═══════════════════════════════════════════════════════ */

  ACCESSORIES: {
    // ANNEAUX
    BRONZE_RING: {
      id: 'BRONZE_RING',
      name: 'Anneau de Bronze',
      type: 'ACCESSORY',
      slot: 'RING',
      rarity: 'common',
      icon: '💍',
      stats: { def: 1, maxHp: 5 },
      price: 25,
      sellPrice: 10,
      description: 'Simple anneau en bronze'
    },

    SILVER_RING: {
      id: 'SILVER_RING',
      name: 'Anneau d\'Argent',
      type: 'ACCESSORY',
      slot: 'RING',
      rarity: 'uncommon',
      icon: '💍',
      stats: { def: 2, maxHp: 10, speed: 1 },
      price: 60,
      sellPrice: 24,
      description: 'Anneau en argent pur'
    },

    RING_OF_POWER: {
      id: 'RING_OF_POWER',
      name: 'Anneau de Pouvoir',
      type: 'ACCESSORY',
      slot: 'RING',
      rarity: 'legendary',
      unique: true,
      icon: '💍✨',
      stats: { atk: 5, def: 5, maxHp: 20, speed: 3 },
      price: null,
      sellPrice: 800,
      description: 'Un anneau de pouvoir absolu',
      lore: 'Un anneau pour les gouverner tous...',
      passive: 'ABSOLUTE_POWER', // +10% tous stats
      onEquip: (player) => {
        player.absolutePower = true;
        player.corruption += 20; // Le pouvoir corrompt
        return '💍 Un pouvoir immense vous envahit... au prix de votre âme.';
      }
    },

    // AMULETTES
    WOODEN_AMULET: {
      id: 'WOODEN_AMULET',
      name: 'Amulette en Bois',
      type: 'ACCESSORY',
      slot: 'NECK',
      rarity: 'common',
      icon: '🔮',
      stats: { maxHp: 10 },
      price: 20,
      sellPrice: 7,
      description: 'Amulette protectrice basique'
    },

    CRYSTAL_AMULET: {
      id: 'CRYSTAL_AMULET',
      name: 'Amulette de Cristal',
      type: 'ACCESSORY',
      slot: 'NECK',
      rarity: 'uncommon',
      icon: '🔮',
      stats: { maxHp: 20, def: 2 },
      price: 70,
      sellPrice: 28,
      description: 'Amulette en cristal magique'
    },

    PHOENIX_AMULET: {
      id: 'PHOENIX_AMULET',
      name: 'Amulette du Phénix',
      type: 'ACCESSORY',
      slot: 'NECK',
      rarity: 'legendary',
      unique: true,
      icon: '🔮🔥',
      stats: { maxHp: 50, def: 5 },
      price: null,
      sellPrice: 700,
      description: 'Contient l\'essence d\'un phénix',
      lore: 'Permet de renaître des cendres une fois.',
      passive: 'PHOENIX_REBIRTH', // Résurrection auto 1 fois
      onEquip: (player) => {
        player.phoenixRebirth = true;
        return '🔥 La flamme éternelle du phénix vous protège.';
      }
    },

    // CAPES
    LEATHER_CLOAK: {
      id: 'LEATHER_CLOAK',
      name: 'Cape en Cuir',
      type: 'ACCESSORY',
      slot: 'BACK',
      rarity: 'common',
      icon: '🧥',
      stats: { def: 1, speed: 1 },
      price: 18,
      sellPrice: 6,
      description: 'Cape légère pour voyageurs'
    },

    SHADOW_CLOAK: {
      id: 'SHADOW_CLOAK',
      name: 'Cape d\'Ombre',
      type: 'ACCESSORY',
      slot: 'BACK',
      rarity: 'rare',
      icon: '🧥',
      stats: { def: 3, speed: 4 },
      price: 120,
      sellPrice: 48,
      description: 'Cape qui se fond dans les ombres',
      passive: 'STEALTH' // +20% éviter combat
    },

    CLOAK_OF_INVISIBILITY: {
      id: 'CLOAK_OF_INVISIBILITY',
      name: 'Cape d\'Invisibilité',
      type: 'ACCESSORY',
      slot: 'BACK',
      rarity: 'legendary',
      unique: true,
      icon: '🧥👻',
      stats: { speed: 8 },
      price: null,
      sellPrice: 900,
      description: 'Rend invisible à volonté',
      lore: 'L\'un des Reliques de la Mort.',
      passive: 'INVISIBILITY', // Peut ignorer combats
      onEquip: (player) => {
        player.invisibility = true;
        return '👻 Vous vous fondez dans l\'air...';
      }
    }
  },

  /* ═══════════════════════════════════════════════════════
     ⭐ RELIQUES (Items uniques narratifs)
     ═══════════════════════════════════════════════════════ */

  RELICS: {
    PHOENIX_FEATHER: {
      id: 'PHOENIX_FEATHER',
      name: 'Plume de Phénix',
      type: 'RELIC',
      rarity: 'legendary',
      unique: true,
      icon: '🪶',
      stackable: false,
      price: null,
      sellPrice: 1000,
      description: 'Résurrection automatique à 50% HP',
      lore: 'Arrachée à un phénix millénaire. Sa magie ne fonctionne qu\'une fois.',
      passive: 'PHOENIX_REVIVE',
      onDeath: (player) => {
        if (player.phoenixFeatherUsed) return false;
        player.phoenixFeatherUsed = true;
        player.hp = Math.floor(player.maxHp * 0.5);
        player.alive = true;
        return '🔥 La plume de phénix brûle ! Vous revenez à la vie !';
      }
    },

    CROWN_OF_THORNS: {
      id: 'CROWN_OF_THORNS',
      name: 'Couronne d\'Épines',
      type: 'RELIC',
      rarity: 'legendary',
      unique: true,
      icon: '👑',
      stackable: false,
      price: null,
      sellPrice: 800,
      description: 'Convertit dégâts subis en Corruption au lieu de HP',
      lore: 'Porter cette couronne est un sacrifice. La douleur devient pouvoir.',
      passive: 'PAIN_TO_POWER',
      onDamage: (damage, player) => {
        player.corruption = Math.min(100, player.corruption + damage);
        return { damage: 0, corruption: damage };
      }
    },

    HOURGLASS_OF_TIME: {
      id: 'HOURGLASS_OF_TIME',
      name: 'Sablier du Temps',
      type: 'RELIC',
      rarity: 'legendary',
      unique: true,
      icon: '⏳',
      stackable: false,
      price: null,
      sellPrice: 1200,
      description: 'Peut revenir 5 tours en arrière (1 fois par combat)',
      lore: 'Manipuler le temps a un prix. Utilisez-le avec sagesse.',
      passive: 'TIME_REWIND',
      onUse: (player, _combat) => {
        if (player.timeRewindUsed) return '⏳ Déjà utilisé ce combat.';
        player.timeRewindUsed = true;
        // Logique de rewind dans combat-system.js
        return '⏳ Le temps recule de 5 tours !';
      }
    },

    BOOK_OF_DESTINY: {
      id: 'BOOK_OF_DESTINY',
      name: 'Livre du Destin',
      type: 'RELIC',
      rarity: 'legendary',
      unique: true,
      icon: '📖',
      stackable: false,
      price: null,
      sellPrice: 1500,
      description: 'Voir tous les lancers de dés à venir',
      lore: 'Connaître son destin est un fardeau. Êtes-vous prêt ?',
      passive: 'OMNISCIENCE',
      onEquip: (player) => {
        player.omniscience = true;
        return '📖 Les secrets du futur se dévoilent...';
      }
    }
  },

  /* ═══════════════════════════════════════════════════════
     💰 MONNAIE
     ═══════════════════════════════════════════════════════ */

  CURRENCY: {
    RUBY: {
      id: 'RUBY',
      name: 'Rubis',
      type: 'CURRENCY',
      rarity: 'common',
      icon: '💎',
      stackable: true,
      maxStack: 9999,
      price: 1,
      sellPrice: 1,
      description: 'Monnaie du donjon'
    },

    GOLD: {
      id: 'GOLD',
      name: 'Pièce d\'Or',
      type: 'CURRENCY',
      rarity: 'uncommon',
      icon: '💰',
      stackable: true,
      maxStack: 9999,
      price: 10, // 1 or = 10 rubis
      sellPrice: 10,
      description: 'Monnaie du campement (permanent)'
    }
  }
};

/* ═══════════════════════════════════════════════════════
   🛠️ HELPER FUNCTIONS
   ═══════════════════════════════════════════════════════ */

const ItemsDB = {
  /**
   * Récupère un item par son ID
   */
  getItem(id) {
    for (const category in ITEMS_DATABASE) {
      if (ITEMS_DATABASE[category][id]) {
        return { ...ITEMS_DATABASE[category][id] };
      }
    }
    console.warn(`⚠️ Item non trouvé: ${id}`);
    return null;
  },

  /**
   * Récupère tous les items d'une rareté donnée
   */
  getItemsByRarity(rarity) {
    const items = [];
    for (const category in ITEMS_DATABASE) {
      for (const id in ITEMS_DATABASE[category]) {
        const item = ITEMS_DATABASE[category][id];
        if (item.rarity === rarity) {
          items.push({ ...item });
        }
      }
    }
    return items;
  },

  /**
   * Récupère tous les items d'un type donné
   */
  getItemsByType(type) {
    const items = [];
    for (const category in ITEMS_DATABASE) {
      for (const id in ITEMS_DATABASE[category]) {
        const item = ITEMS_DATABASE[category][id];
        if (item.type === type) {
          items.push({ ...item });
        }
      }
    }
    return items;
  },

  /**
   * Récupère tous les items uniques
   */
  getUniqueItems() {
    const items = [];
    for (const category in ITEMS_DATABASE) {
      for (const id in ITEMS_DATABASE[category]) {
        const item = ITEMS_DATABASE[category][id];
        if (item.unique) {
          items.push({ ...item });
        }
      }
    }
    return items;
  },

  /**
   * Roll un item aléatoire selon rareté et type
   */
  rollRandomItem(rarity = null, type = null) {
    let pool = [];

    // Construire le pool d'items
    for (const category in ITEMS_DATABASE) {
      for (const id in ITEMS_DATABASE[category]) {
        const item = ITEMS_DATABASE[category][id];

        // Filtrer par rareté si spécifié
        if (rarity && item.rarity !== rarity) continue;

        // Filtrer par type si spécifié
        if (type && item.type !== type) continue;

        // Exclure les items uniques (sauf si explicitement demandé)
        if (item.unique && rarity !== 'legendary') continue;

        pool.push(item);
      }
    }

    if (pool.length === 0) {
      console.warn(`⚠️ Aucun item trouvé pour rarity=${rarity}, type=${type}`);
      return null;
    }

    // Choisir aléatoirement
    const randomItem = pool[Math.floor(Math.random() * pool.length)];
    return { ...randomItem };
  },

  /**
   * Récupère tous les items d'une catégorie
   */
  getCategory(category) {
    if (!ITEMS_DATABASE[category]) {
      console.warn(`⚠️ Catégorie non trouvée: ${category}`);
      return {};
    }
    return { ...ITEMS_DATABASE[category] };
  },

  /**
   * Vérifie si un item existe
   */
  exists(id) {
    return this.getItem(id) !== null;
  },

  /**
   * Compte le nombre total d'items
   */
  count() {
    let total = 0;
    for (const category in ITEMS_DATABASE) {
      total += Object.keys(ITEMS_DATABASE[category]).length;
    }
    return total;
  },

  /**
   * Récupère les stats d'un item
   */
  getStats() {
    const stats = {
      total: 0,
      byRarity: { common: 0, uncommon: 0, rare: 0, legendary: 0 },
      byType: {},
      unique: 0
    };

    for (const category in ITEMS_DATABASE) {
      for (const id in ITEMS_DATABASE[category]) {
        const item = ITEMS_DATABASE[category][id];
        stats.total++;

        if (item.rarity) stats.byRarity[item.rarity]++;
        if (item.type) stats.byType[item.type] = (stats.byType[item.type] || 0) + 1;
        if (item.unique) stats.unique++;
      }
    }

    return stats;
  }
};

/* ═══════════════════════════════════════════════════════
   🌍 EXPORT GLOBAL
   ═══════════════════════════════════════════════════════ */

if (typeof window !== 'undefined') {
  window.ITEMS_DATABASE = ITEMS_DATABASE;
  window.ItemsDB = ItemsDB;

  console.log('📦 Items Database loaded');
  console.log('📊 Stats:', ItemsDB.getStats());
}
