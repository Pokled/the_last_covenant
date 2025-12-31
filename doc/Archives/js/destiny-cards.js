// 🃏 CARTES DE DESTIN - Catalogue complet (style Balatro)
// Ces cartes modifient les règles du Lexique des Dés

const DESTINY_CARDS = {
  
  // ═══════════════════════════════════════════════════════════
  // 📊 CATÉGORIE : LECTURE DU DÉ (Modifier la valeur)
  // ═══════════════════════════════════════════════════════════
  
  LOW_IS_HIGH: {
    id: 'LOW_IS_HIGH',
    name: "Renversement",
    rarity: 'common',
    icon: '🔄',
    description: "Les résultats 1-3 comptent comme 4",
    lexiconRule: {
      id: 'low_is_high',
      apply: (value) => {
        if (value >= 1 && value <= 3) {
          return { newValue: 4, log: "Renversement ! 1-3 → 4" };
        }
        return { newValue: value };
      }
    }
  },

  EVEN_BOOST: {
    id: 'EVEN_BOOST',
    name: "Paire Gagnante",
    rarity: 'common',
    icon: '➕',
    description: "Les nombres pairs gagnent +1",
    lexiconRule: {
      id: 'even_boost',
      apply: (value) => {
        if (value % 2 === 0) {
          return { newValue: value + 1, log: "Nombre pair +1" };
        }
        return { newValue: value };
      }
    }
  },

  ODD_BOOST: {
    id: 'ODD_BOOST',
    name: "Impaire Sagesse",
    rarity: 'common',
    icon: '✨',
    description: "Les nombres impairs gagnent +1",
    lexiconRule: {
      id: 'odd_boost',
      apply: (value) => {
        if (value % 2 === 1) {
          return { newValue: value + 1, log: "Nombre impair +1" };
        }
        return { newValue: value };
      }
    }
  },

  LUCKY_SEVEN: {
    id: 'LUCKY_SEVEN',
    name: "Sept Chanceux",
    rarity: 'rare',
    icon: '🎰',
    description: "Le 7 compte double (14)",
    lexiconRule: {
      id: 'lucky_seven',
      apply: (value) => {
        if (value === 7) {
          return { newValue: 14, log: "🎰 SEPT CHANCEUX ! 7 → 14" };
        }
        return { newValue: value };
      }
    }
  },

  PERFECT_TEN: {
    id: 'PERFECT_TEN',
    name: "Perfection",
    rarity: 'rare',
    icon: '💯',
    description: "Le 10 devient 15",
    lexiconRule: {
      id: 'perfect_ten',
      apply: (value) => {
        if (value === 10) {
          return { newValue: 15, log: "💯 PERFECTION ! 10 → 15" };
        }
        return { newValue: value };
      }
    }
  },

  MINIMUM_FLOOR: {
    id: 'MINIMUM_FLOOR',
    name: "Plancher Sûr",
    rarity: 'common',
    icon: '🛡️',
    description: "Tous les résultats valent au minimum 3",
    lexiconRule: {
      id: 'minimum_floor',
      apply: (value) => {
        if (value < 3) {
          return { newValue: 3, log: "Plancher Sûr: min = 3" };
        }
        return { newValue: value };
      }
    }
  },

  DOUBLE_OR_NOTHING: {
    id: 'DOUBLE_OR_NOTHING',
    name: "Tout ou Rien",
    rarity: 'rare',
    icon: '⚡',
    description: "8-10 = double | 1-3 = 0",
    lexiconRule: {
      id: 'double_or_nothing',
      apply: (value) => {
        if (value >= 8) {
          return { newValue: value * 2, log: "⚡ DOUBLE !" };
        }
        if (value <= 3) {
          return { newValue: 0, log: "💀 RIEN..." };
        }
        return { newValue: value };
      }
    }
  },

  REVERSAL: {
    id: 'REVERSAL',
    name: "Inversion Totale",
    rarity: 'legendary',
    icon: '🔀',
    description: "Le dé est inversé (1→10, 2→9, etc.)",
    lexiconRule: {
      id: 'reversal',
      apply: (value) => {
        const inverted = 11 - value;
        return { newValue: inverted, log: `🔀 Inversion: ${value} → ${inverted}` };
      }
    }
  },

  // ═══════════════════════════════════════════════════════════
  // 🎯 CATÉGORIE : CONTEXTE (Combat, Déplacement, Événement)
  // ═══════════════════════════════════════════════════════════

  COMBAT_FURY: {
    id: 'COMBAT_FURY',
    name: "Fureur de Combat",
    rarity: 'uncommon',
    icon: '⚔️',
    description: "En combat : tous les dés gagnent +2",
    lexiconRule: {
      id: 'combat_fury',
      apply: (value, context) => {
        if (context === 'combat') {
          return { newValue: value + 2, log: "⚔️ Fureur de Combat +2" };
        }
        return { newValue: value };
      }
    }
  },

  EXPLORER_SPIRIT: {
    id: 'EXPLORER_SPIRIT',
    name: "Esprit Explorateur",
    rarity: 'uncommon',
    icon: '🗺️',
    description: "En déplacement : +1 au dé",
    lexiconRule: {
      id: 'explorer_spirit',
      apply: (value, context) => {
        if (context === 'movement') {
          return { newValue: value + 1, log: "🗺️ Esprit Explorateur +1" };
        }
        return { newValue: value };
      }
    }
  },

  TREASURE_HUNTER: {
    id: 'TREASURE_HUNTER',
    name: "Chasseur de Trésors",
    rarity: 'rare',
    icon: '💰',
    description: "Sur un coffre : double le butin",
    lexiconRule: {
      id: 'treasure_hunter',
      apply: (value, context) => {
        if (context === 'chest') {
          return { 
            newValue: value, 
            effects: [{ type: 'double_loot' }],
            log: "💰 Butin doublé !"
          };
        }
        return { newValue: value };
      }
    }
  },

  TRAP_MASTER: {
    id: 'TRAP_MASTER',
    name: "Maître des Pièges",
    rarity: 'uncommon',
    icon: '🪤',
    description: "Les pièges ne font que 50% de dégâts",
    lexiconRule: {
      id: 'trap_master',
      apply: (value, context) => {
        if (context === 'trap') {
          return { 
            newValue: value,
            effects: [{ type: 'reduce_trap_damage', ratio: 0.5 }],
            log: "🪤 Piège réduit de 50%"
          };
        }
        return { newValue: value };
      }
    }
  },

  // ═══════════════════════════════════════════════════════════
  // 🎲 CATÉGORIE : COMBO & SÉQUENCES
  // ═══════════════════════════════════════════════════════════

  MOMENTUM: {
    id: 'MOMENTUM',
    name: "Momentum",
    rarity: 'rare',
    icon: '🏃',
    description: "Chaque dé consécutif 5+ donne +1 bonus cumulatif",
    stateful: true,
    state: { consecutiveHighRolls: 0 },
    lexiconRule: {
      id: 'momentum',
      apply: (value, context, extraData, cardState) => {
        if (value >= 5) {
          cardState.consecutiveHighRolls = (cardState.consecutiveHighRolls || 0) + 1;
          const bonus = cardState.consecutiveHighRolls - 1;
          if (bonus > 0) {
            return { 
              newValue: value + bonus, 
              log: `🏃 Momentum x${cardState.consecutiveHighRolls} (+${bonus})`
            };
          }
        } else {
          cardState.consecutiveHighRolls = 0;
        }
        return { newValue: value };
      }
    }
  },

  LAST_STAND: {
    id: 'LAST_STAND',
    name: "Dernier Rempart",
    rarity: 'legendary',
    icon: '🛡️',
    description: "Si HP ≤ 30% : tous les dés +3",
    lexiconRule: {
      id: 'last_stand',
      apply: (value, context, extraData) => {
        const player = extraData.player;
        if (player && player.hp <= player.maxHp * 0.3) {
          return { newValue: value + 3, log: "🛡️ DERNIER REMPART +3" };
        }
        return { newValue: value };
      }
    }
  },

  // ═══════════════════════════════════════════════════════════
  // 🎭 CATÉGORIE : RISQUE / RÉCOMPENSE
  // ═══════════════════════════════════════════════════════════

  GAMBLER: {
    id: 'GAMBLER',
    name: "Parieur Fou",
    rarity: 'rare',
    icon: '🎲',
    description: "1-2 = 0 | 3-7 = normal | 8-10 = triple",
    lexiconRule: {
      id: 'gambler',
      apply: (value) => {
        if (value <= 2) {
          return { newValue: 0, log: "🎲 Échec critique..." };
        }
        if (value >= 8) {
          return { newValue: value * 3, log: "🎲 JACKPOT !!!" };
        }
        return { newValue: value };
      }
    }
  },

  CURSED_LUCK: {
    id: 'CURSED_LUCK',
    name: "Chance Maudite",
    rarity: 'rare',
    icon: '😈',
    description: "Les 1 deviennent 10, mais les 10 deviennent 1",
    lexiconRule: {
      id: 'cursed_luck',
      apply: (value) => {
        if (value === 1) {
          return { newValue: 10, log: "😈 Malédiction bénéfique ! 1 → 10" };
        }
        if (value === 10) {
          return { newValue: 1, log: "😈 Malédiction cruelle... 10 → 1" };
        }
        return { newValue: value };
      }
    }
  },

  PHOENIX_FEATHER: {
    id: 'PHOENIX_FEATHER',
    name: "Plume de Phénix",
    rarity: 'legendary',
    icon: '🔥',
    description: "Si un dé tuerait le joueur : survie à 1 HP (1x par partie)",
    unique: true,
    oneTimeUse: true,
    lexiconRule: {
      id: 'phoenix_feather',
      apply: (value, context, extraData) => {
        if (context === 'death_save' && !extraData.phoenixUsed) {
          return {
            newValue: value,
            effects: [{ type: 'resurrect', hp: 1 }],
            log: "🔥 PLUME DE PHÉNIX ! Résurrection !"
          };
        }
        return { newValue: value };
      }
    }
  },

  // ═══════════════════════════════════════════════════════════
  // 🔮 CATÉGORIE : MÉTA (Manipulation du système)
  // ═══════════════════════════════════════════════════════════

  REFRESH_MASTER: {
    id: 'REFRESH_MASTER',
    name: "Maître du Refresh",
    rarity: 'uncommon',
    icon: '🔄',
    description: "Gagne +1 token Refresh",
    passive: true,
    onAcquire: (player) => {
      player.cardSelection.refreshTokens += 1;
    }
  },

  BAN_MASTER: {
    id: 'BAN_MASTER',
    name: "Maître du Ban",
    rarity: 'uncommon',
    icon: '🚫',
    description: "Gagne +1 token Ban",
    passive: true,
    onAcquire: (player) => {
      player.cardSelection.banTokens += 1;
    }
  },

  FOURTH_OPTION: {
    id: 'FOURTH_OPTION',
    name: "Quatrième Voie",
    rarity: 'rare',
    icon: '➕',
    description: "Les sélections proposent 4 cartes au lieu de 3",
    passive: true,
    onAcquire: (player) => {
      player.cardSelection.extraCardSlots = 1;
    }
  },

  DOUBLE_PICK: {
    id: 'DOUBLE_PICK',
    name: "Double Choix",
    rarity: 'legendary',
    icon: '✌️',
    description: "À la prochaine sélection : choisis 2 cartes",
    unique: true,
    oneTimeUse: true,
    passive: true,
    onAcquire: (player) => {
      player.cardSelection.nextPickCount = 2;
    }
  },

  // ═══════════════════════════════════════════════════════════
  // 🎪 CATÉGORIE : BIZARRE & FUN
  // ═══════════════════════════════════════════════════════════

  CHAOS_REROLL: {
    id: 'CHAOS_REROLL',
    name: "Chaos Primordial",
    rarity: 'rare',
    icon: '🌀',
    description: "Relance le dé si c'est un 5",
    lexiconRule: {
      id: 'chaos_reroll',
      apply: (value) => {
        if (value === 5) {
          const newRoll = Math.floor(Math.random() * 10) + 1;
          return { 
            newValue: newRoll, 
            log: `🌀 Chaos ! 5 relancé → ${newRoll}` 
          };
        }
        return { newValue: value };
      }
    }
  },

  MIRROR_DICE: {
    id: 'MIRROR_DICE',
    name: "Dé Miroir",
    rarity: 'rare',
    icon: '🪞',
    description: "Le dé copie le résultat précédent",
    stateful: true,
    state: { lastRoll: null },
    lexiconRule: {
      id: 'mirror_dice',
      apply: (value, context, extraData, cardState) => {
        if (cardState.lastRoll !== null) {
          const mirrored = cardState.lastRoll;
          cardState.lastRoll = value;
          return { newValue: mirrored, log: `🪞 Miroir : copie ${mirrored}` };
        }
        cardState.lastRoll = value;
        return { newValue: value };
      }
    }
  },

  ASCENDING: {
    id: 'ASCENDING',
    name: "Ascension",
    rarity: 'uncommon',
    icon: '📈',
    description: "Chaque case avancée donne +0.5 bonus permanent (arrondi)",
    stateful: true,
    state: { tilesMoved: 0 },
    lexiconRule: {
      id: 'ascending',
      apply: (value, context, extraData, cardState) => {
        if (context === 'movement') {
          cardState.tilesMoved = (cardState.tilesMoved || 0) + value;
        }
        const bonus = Math.floor((cardState.tilesMoved || 0) * 0.5);
        if (bonus > 0) {
          return { newValue: value + bonus, log: `📈 Ascension +${bonus}` };
        }
        return { newValue: value };
      }
    }
  },

  PRIME_POWER: {
    id: 'PRIME_POWER',
    name: "Force Prime",
    rarity: 'rare',
    icon: '🔢',
    description: "Les nombres premiers (2,3,5,7) gagnent +3",
    lexiconRule: {
      id: 'prime_power',
      apply: (value) => {
        const primes = [2, 3, 5, 7];
        if (primes.includes(value)) {
          return { newValue: value + 3, log: "🔢 Nombre premier +3" };
        }
        return { newValue: value };
      }
    }
  },

  VAMPIRE_DICE: {
    id: 'VAMPIRE_DICE',
    name: "Dé Vampire",
    rarity: 'rare',
    icon: '🧛',
    description: "En combat : soigne de 10% des dégâts infligés",
    lexiconRule: {
      id: 'vampire_dice',
      apply: (value, context) => {
        if (context === 'combat') {
          return {
            newValue: value,
            effects: [{ type: 'lifesteal', ratio: 0.1 }],
            log: "🧛 Vol de vie 10%"
          };
        }
        return { newValue: value };
      }
    }
  }
};

// Helper : Obtenir les cartes par rareté
const CARDS_BY_RARITY = {
  common: [],
  uncommon: [],
  rare: [],
  legendary: []
};

// Remplir automatiquement
Object.values(DESTINY_CARDS).forEach(card => {
  if (card.rarity && CARDS_BY_RARITY[card.rarity]) {
    CARDS_BY_RARITY[card.rarity].push(card);
  }
});

console.log('🃏 Cartes de Destin chargées:', Object.keys(DESTINY_CARDS).length, 'cartes');
console.log('  Common:', CARDS_BY_RARITY.common.length);
console.log('  Uncommon:', CARDS_BY_RARITY.uncommon.length);
console.log('  Rare:', CARDS_BY_RARITY.rare.length);
console.log('  Legendary:', CARDS_BY_RARITY.legendary.length);

// Taux de drop par rareté (utilisé pour la sélection aléatoire de cartes)
// Valeurs par défaut — augmentées pour une meilleure sensation de progression.
// Ajuste ces valeurs si tu veux plus/moins de cartes en jeu.
const CARD_RARITY_DROP_RATES = {
  common: 0.8,
  uncommon: 0.5,
  rare: 0.15,
  legendary: 0.05
};