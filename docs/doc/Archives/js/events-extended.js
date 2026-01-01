// 🎭 ÉVÉNEMENTS ÉTENDUS DU DONJON

// 👑 BOSS
const BOSSES = {
  GOBLIN_KING: {
    name: 'Roi Gobelin',
    icon: '👑',
    hp: 25,
    atk: 7,
    xp: 100,
    lootGold: [50, 100],
    lootItems: ['HEALTH_POTION', 'STRENGTH_POTION', 'LEGENDARY_SWORD'],
    dialogue: "Vous osez défier le Roi Gobelin ? Préparez-vous à mourir !"
  },
  NECROMANCER: {
    name: 'Nécromancien',
    icon: '🧙‍♂️',
    hp: 30,
    atk: 8,
    xp: 150,
    lootGold: [80, 150],
    lootItems: ['MAGIC_STAFF', 'INVULNERABILITY_SCROLL', 'TELEPORT_SCROLL'],
    dialogue: "Les morts se lèveront pour me servir... et vous rejoindrez bientôt leurs rangs !"
  },
  ANCIENT_DRAGON: {
    name: 'Dragon Ancestral',
    icon: '🐲',
    hp: 50,
    atk: 12,
    xp: 300,
    lootGold: [200, 400],
    lootItems: ['DRAGON_SCALE', 'LEGENDARY_ARMOR', 'PHOENIX_FEATHER'],
    dialogue: "Depuis mille ans je garde ce trésor... vous ne l'obtiendrez jamais, mortel !"
  }
};

// 🧩 ÉNIGMES
const RIDDLES = [
  {
    id: 'MIRROR',
    question: "Je vous montre votre reflet mais je ne suis pas un miroir. Je change avec les saisons mais je ne suis pas un arbre. Qu'est-ce que je suis ?",
    answers: ['lac', 'eau', 'étang', 'rivière'],
    hint: "Pensez à quelque chose de naturel qui reflète...",
    reward: { type: 'RUBY', amount: 20 },
    wrongPenalty: 5 // dégâts si mauvaise réponse
  },
  {
    id: 'DARKNESS',
    question: "Plus vous m'enlevez, plus je deviens grand. Qu'est-ce que je suis ?",
    answers: ['trou', 'un trou', 'le trou'],
    hint: "Pensez à quelque chose que l'on creuse...",
    reward: { type: 'STRENGTH_POTION', amount: 1 },
    wrongPenalty: 3
  },
  {
    id: 'TIME',
    question: "J'ai des aiguilles mais je ne couds pas. J'ai des chiffres mais je ne compte pas. Qu'est-ce que je suis ?",
    answers: ['horloge', 'montre', 'pendule', 'une horloge'],
    hint: "Cela vous indique l'heure...",
    reward: { type: 'DEFENSE_POTION', amount: 1 },
    wrongPenalty: 4
  },
  {
    id: 'FIRE',
    question: "Je mange tout ce que je touche, mais l'eau me tue. Qu'est-ce que je suis ?",
    answers: ['feu', 'le feu', 'flamme', 'incendie'],
    hint: "Chaud et dangereux...",
    reward: { type: 'RUBY', amount: 30 },
    wrongPenalty: 8
  },
  {
    id: 'SHADOW',
    question: "Je vous suis partout le jour mais disparais la nuit. Je n'ai pas de poids mais je peux couvrir le monde. Qu'est-ce que je suis ?",
    answers: ['ombre', 'l\'ombre', 'une ombre'],
    hint: "La lumière est nécessaire pour me créer...",
    reward: { type: 'TELEPORT_SCROLL', amount: 1 },
    wrongPenalty: 5
  }
];

// 🏛️ SALLES SPÉCIALES
const SPECIAL_ROOMS = {
  FOUNTAIN: {
    name: 'Fontaine Magique',
    icon: '⛲',
    description: "Une fontaine aux eaux cristallines brille d'une lueur mystique.",
    effects: [
      {
        name: 'Boire',
        icon: '💧',
        description: 'Restaure toute votre santé',
        action: (player) => {
          player.hp = player.maxHp;
          return `Vous buvez l'eau magique. Vos PV sont restaurés ! (${player.maxHp} PV)`;
        }
      },
      {
        name: 'Méditer',
        icon: '🧘',
        description: 'Gagnez de l\'expérience',
        action: (player) => {
          const xpGain = 50;
          player.xp = (player.xp || 0) + xpGain;
          return `Vous méditez près de la fontaine. +${xpGain} XP`;
        }
      }
    ]
  },
  
  SHRINE: {
    name: 'Autel Ancien',
    icon: '🗿',
    description: "Un autel de pierre émane une puissance ancestrale.",
    effects: [
      {
        name: 'Prier',
        icon: '🙏',
        description: 'Augmente vos stats de manière permanente',
        action: (player) => {
          const buff = Math.random();
          if (buff < 0.33) {
            player.maxHp += 2;
            player.hp = Math.min(player.hp + 2, player.maxHp);
            return `L'autel bénit votre corps. +2 PV Max !`;
          } else if (buff < 0.66) {
            player.atk += 1;
            return `L'autel renforce votre force. +1 ATQ !`;
          } else {
            player.def += 1;
            return `L'autel durcit votre peau. +1 DÉF !`;
          }
        }
      },
      {
        name: 'Sacrifier',
        icon: '🩸',
        description: 'Sacrifiez 5 PV pour obtenir un objet légendaire',
        action: (player) => {
          if (player.hp <= 5) {
            return `Vous n'avez pas assez de PV pour faire ce sacrifice...`;
          }
          player.hp -= 5;
          const legendaryItems = ['LEGENDARY_SWORD', 'LEGENDARY_ARMOR', 'PHOENIX_FEATHER'];
          const item = legendaryItems[Math.floor(Math.random() * legendaryItems.length)];
          player.inventory.addItem(item, 1);
          return `Vous sacrifiez 5 PV. L'autel vous accorde : ${ITEMS[item]?.icon || '✨'} ${ITEMS[item]?.name || item} !`;
        }
      }
    ]
  },
  
  LIBRARY: {
    name: 'Bibliothèque Interdite',
    icon: '📚',
    description: "D'anciens grimoires tapissent les étagères poussiéreuses.",
    effects: [
      {
        name: 'Lire',
        icon: '📖',
        description: 'Apprenez une nouvelle compétence',
        action: (player) => {
          const skills = [
            { name: 'Régénération', effect: 'regen', desc: '+1 PV par tour' },
            { name: 'Critique', effect: 'crit', desc: '20% de coup critique' },
            { name: 'Esquive', effect: 'dodge', desc: '15% d\'esquive' }
          ];
          const skill = skills[Math.floor(Math.random() * skills.length)];
          player.skills = player.skills || {};
          player.skills[skill.effect] = true;
          return `Vous apprenez : ${skill.name} (${skill.desc})`;
        }
      },
      {
        name: 'Voler',
        icon: '🥷',
        description: 'Tentez de voler un parchemin rare (risqué)',
        action: (player) => {
          if (Math.random() < 0.5) {
            player.inventory.addItem('INVULNERABILITY_SCROLL', 1);
            return `Vol réussi ! Vous obtenez un Parchemin d'Invulnérabilité !`;
          } else {
            player.hp -= 10;
            return `Piège magique ! Vous perdez 10 PV.`;
          }
        }
      }
    ]
  },
  
  MYSTERIOUS_DOOR: {
    name: 'Porte Mystérieuse',
    icon: '🚪',
    description: "Trois portes identiques se dressent devant vous.",
    effects: [
      {
        name: 'Porte Gauche',
        icon: '◀️',
        description: '???',
        action: (player) => {
          const outcome = Math.random();
          if (outcome < 0.33) {
            const gold = Math.floor(Math.random() * 50) + 20;
            player.inventory.addItem('RUBY', gold);
            return `Trésor ! Vous trouvez ${gold} rubis !`;
          } else if (outcome < 0.66) {
            player.hp -= 15;
            return `Piège ! Vous perdez 15 PV.`;
          } else {
            return `Rien... la salle est vide.`;
          }
        }
      },
      {
        name: 'Porte Centre',
        icon: '⏺️',
        description: '???',
        action: (player) => {
          const outcome = Math.random();
          if (outcome < 0.5) {
            player.inventory.addItem('HEALTH_POTION', 2);
            return `Vous trouvez 2 Potions de Soin !`;
          } else {
            const damage = 10;
            player.hp -= damage;
            return `Une flèche empoisonnée ! -${damage} PV`;
          }
        }
      },
      {
        name: 'Porte Droite',
        icon: '▶️',
        description: '???',
        action: (player) => {
          const outcome = Math.random();
          if (outcome < 0.4) {
            player.position += 10;
            return `Téléportation ! Vous avancez de 10 cases !`;
          } else if (outcome < 0.7) {
            player.hp = Math.min(player.hp + 10, player.maxHp);
            return `Énergie vitale ! +10 PV`;
          } else {
            return `Illusion... rien ne se passe.`;
          }
        }
      }
    ]
  },
  
  BLACKSMITH: {
    name: 'Forge Naine',
    icon: '⚒️',
    description: "Un forgeron nain martèle une enclume rougeoyante.",
    effects: [
      {
        name: 'Améliorer Arme',
        icon: '⚔️',
        description: 'Coûte 50 rubis - +2 ATQ permanent',
        action: (player) => {
          if (player.inventory.getItemCount('RUBY') < 50) {
            return `Pas assez d'or ! (50 rubis requis)`;
          }
          player.inventory.removeItem('RUBY', 50);
          player.atk += 2;
          return `Le forgeron améliore votre arme ! +2 ATQ permanent`;
        }
      },
      {
        name: 'Améliorer Armure',
        icon: '🛡️',
        description: 'Coûte 50 rubis - +2 DÉF permanent',
        action: (player) => {
          if (player.inventory.getItemCount('RUBY') < 50) {
            return `Pas assez d'or ! (50 rubis requis)`;
          }
          player.inventory.removeItem('RUBY', 50);
          player.def += 2;
          return `Le forgeron améliore votre armure ! +2 DÉF permanent`;
        }
      },
      {
        name: 'Réparer',
        icon: '🔧',
        description: 'Coûte 20 rubis - Restaure 20 PV',
        action: (player) => {
          if (player.inventory.getItemCount('RUBY') < 20) {
            return `Pas assez d'or ! (20 rubis requis)`;
          }
          player.inventory.removeItem('RUBY', 20);
          player.hp = Math.min(player.hp + 20, player.maxHp);
          return `Le forgeron répare votre équipement ! +20 PV`;
        }
      }
    ]
  }
};

console.log('🎭 Événements étendus chargés');

// Exposer les BOSSES pour utilisation externe (game.js, combat)
if (typeof window !== 'undefined') window.BOSSES = BOSSES;