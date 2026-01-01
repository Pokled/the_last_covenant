# 🎮 PANORAMA DES SYSTÈMES
## Comment la Lore Génère Naturellement les Mécaniques de Jeu

> **"Dans THE LAST COVENANT, rien n'est arbitraire. Chaque système, chaque mécanique, chaque chiffre est une manifestation du cosmos brisé."**

---

## 📊 ARCHITECTURE NARRATIVE → GAMEPLAY

```
LORE FOUNDATION
       ↓
COSMIC ENTITIES (Dés, Dieux, Vide)
       ↓
SYSTÈMES ÉMERGENTS (RNG, Classes, Corruption)
       ↓
GAMEPLAY LOOPS (Combats, Choix, Progression)
       ↓
PLAYER EXPERIENCE (Dopamine, Angoisse, Responsabilité)
```

---

## 🎲 LE SYSTÈME RNG : LES DÉS DU DESTIN

### 📖 Fondation Narrative

**Thalys, le Dieu des Hasards**, s'est transformé volontairement en les **Dés du Destin** lors du Grand Déchirement. Il est devenu le RNG du jeu. Chaque lancer de dés n'est pas un algorithme froid - c'est une entité consciente qui observe, juge, et participe.

### 🎮 Implémentation Gameplay

#### Les 3 Modes des Dés (liés aux 3 personnalités de Thalys)

```javascript
// SYSTÈME DE PERSONNALITÉ DU RNG
const DICE_MODES = {
  OBSERVER: {
    name: "L'Observateur",
    description: "Thalys observe en silence",
    effect: "RNG neutre, variance standard",
    triggers: "Par défaut",
    corruptionRange: [0, 30]
  },

  TEMPTER: {
    name: "Le Tentateur",
    description: "Thalys te propose des pactes",
    effect: "Choix risk/reward extrêmes",
    triggers: "Combat difficile, boss, trésor rare",
    corruptionRange: [30, 70],
    examples: [
      "Relancer le dé mais +10% corruption",
      "Doubler le loot mais perdre 30% PV max",
      "Garantir coup critique mais invoquer démon mineur"
    ]
  },

  BROTHER: {
    name: "Le Frère",
    description: "Thalys se souvient qu'il fut dieu",
    effect: "Dialogue méta, aide subtile",
    triggers: "Mort répétée, désespoir, corruption >70%",
    corruptionRange: [70, 100],
    dialogue: [
      "Tu sais, j'ai déjà été comme toi. Vivant.",
      "Ael'mora a choisi de disparaître. Toi, tu peux encore choisir.",
      "Je ne peux pas tricher pour toi. Mais je peux... oublier de regarder."
    ]
  }
};
```

#### Manipulation des Dés (Phase 6 - Core Feature)

```javascript
// SYSTÈME DE MANIPULATION MAÎTRISABLE
const DICE_MANIPULATION = {
  // 1️⃣ AVANT LE LANCER
  preRoll: {
    spendLuck: {
      cost: "1 point de Chance",
      effect: "+1 au prochain lancer",
      loreReason: "Tu murmures une prière à Thalys"
    },
    sacrifice: {
      cost: "10% PV actuels",
      effect: "Relance si résultat ≤3",
      loreReason: "Le sang plaît aux dieux morts",
      corruption: +2
    },
    darkPact: {
      cost: "+5% corruption permanente",
      effect: "Choisir exact résultat (1-6)",
      loreReason: "Tu forces la main de Thalys. Il s'en souvient.",
      cooldown: "1 par étage"
    }
  },

  // 2️⃣ PENDANT LE LANCER (Slot Machine)
  duringRoll: {
    concentration: {
      mechanic: "Timing QTE - appuyer espace au bon moment",
      window: "200ms",
      success: "+2 au résultat",
      fail: "-1 au résultat",
      loreReason: "Tu essaies de capter l'attention de Thalys"
    }
  },

  // 3️⃣ APRÈS LE LANCER
  postRoll: {
    reroll: {
      cost: "1 Reroll Token (rare)",
      effect: "Lancer à nouveau, garder meilleur résultat",
      loreReason: "Thalys t'offre une seconde chance"
    },
    accept: {
      bonus: "+5 XP si accepté sans manipulation",
      loreReason: "Accepter le destin renforce ton humanité",
      corruption: -1
    }
  }
};
```

#### Dopamine du RNG

```javascript
// FEEDBACK VISUEL PAR RÉSULTAT
const DICE_DOPAMINE = {
  1: {
    name: "Catastrophe",
    color: "#8B0000",
    particles: "smoke + blood",
    screenEffect: "redFlash + shake",
    sound: "lowDrone",
    dialogue: "Même les dieux connaissaient l'échec."
  },

  6: {
    name: "Destin Parfait",
    color: "#FFD700",
    particles: "explosion(100) + sparkles + trail",
    screenEffect: "goldFlash + freezeFrame(200ms)",
    sound: "triumphChord",
    dialogue: "Thalys sourit. Ou du moins, son souvenir."
  },

  "6-6": {
    name: "DOUBLE DESTIN (rare)",
    color: "#FF00FF",
    particles: "confetti(200) + coin rain + divine light",
    screenEffect: "rainbowFlash + shake(intense) + freeze(500ms)",
    sound: "epicChoir",
    dialogue: "...Impossible. Thalys n'aurait jamais... Sauf si...",
    effect: "Unlock secret lore fragment",
    probability: 0.0278 // 1/36
  }
};
```

---

## ⚔️ LES 7 CLASSES : ENFANTS DES DIEUX MORTS

### 📖 Fondation Narrative

Chaque classe est l'**héritage d'un dieu Scelleur**. Pas une profession - une malédiction, un fragment de divinité morte qui habite le personnage.

### 🎮 Implémentation Gameplay

```javascript
const CLASSES_SYSTEM = {
  // 🛡️ CHEVALIER BRISÉ - Héritage de MORWYN (Ordre)
  SHATTERED_KNIGHT: {
    god: "Morwyn, Scelleur de l'Ordre",
    godStatus: "Dévoré en premier. Ses lois sont devenues chaos.",

    loreOrigin: "Dernier de l'Ordre Sacré. A juré de protéger un roi mort depuis 200 ans. Continue de patrouiller des ruines.",

    playStyle: "Tank défensif avec mécaniques de serment",

    mechanicFromLore: {
      sacredOath: {
        desc: "Choisir 1 serment au début de chaque étage",
        options: [
          "Protéger (Allies +30% def, toi -20% atk)",
          "Punir (Enemies dead <3 tours, +50% dmg next)",
          "Endurer (Ne pas heal pendant 5 combats, unlock bonus)"
        ],
        loreReason: "Les serments de Morwyn existent encore. L'univers les honore.",
        breakOath: {
          penalty: "+10% corruption, lose class bonus",
          dialogue: "Tu sens les chaînes de Morwyn se briser. Ou es-tu enfin libre?"
        }
      },

      lastStand: {
        trigger: "PV ≤ 10%",
        effect: "Invincible 1 tour, puis heal 50%",
        cost: "+15% corruption",
        cooldown: "1 par combat",
        loreReason: "Morwyn protège encore ses champions. Mais chaque miracle a un prix."
      }
    },

    corruptionPath: {
      low: "Chevalier Pur - Serments renforcés, bonus contre démons",
      mid: "Chevalier Gris - Peut briser serments pour bonus temporaire",
      high: "Chevalier Déchu - Serments inversés (protéger = damage, punir = heal)"
    },

    uniqueDialogue: [
      "Mon roi est mort. Je le sais. Mais l'ordre demeure.",
      "Morwyn nous a abandonnés. Mais nos serments, eux, sont éternels.",
      "Je suis le dernier. Quand je tomberai, qui se souviendra de l'Ordre?"
    ]
  },

  // 🔥 SORCIÈRE DES CENDRES - Héritage de VYR (Magie)
  WITCH_OF_ASHES: {
    god: "Vyr, Scelleuse de la Magie Primordiale",
    godStatus: "S'est consumée elle-même. Sa magie erre sans maître.",

    loreOrigin: "A brûlé son village pour le sauver d'une peste démoniaque. 400 morts. Elle a 19 ans.",

    playStyle: "Glass cannon avec ressource Cendres",

    mechanicFromLore: {
      ashResource: {
        desc: "Chaque spell consomme Cendres (max 100)",
        generation: [
          "Kill enemy: +10 Cendres",
          "Take damage: +5 Cendres",
          "Ally dies: +30 Cendres (si Épreuve des Cages)"
        ],
        loreReason: "La mort nourrit le feu. Vyr l'a compris trop tard."
      },

      immolation: {
        cost: "30% PV actuels",
        effect: "Next spell x3 damage",
        visual: "Flames erupt from player",
        loreReason: "Tu te brûles comme Vyr. Peut-être trouveras-tu ce qu'elle cherchait."
      },

      phoenixRebirth: {
        trigger: "Mourir avec 100 Cendres",
        effect: "Ressusciter avec 30% PV",
        cost: "Consomme 100 Cendres + 25% corruption",
        cooldown: "1 par run",
        loreReason: "Vyr est morte. Mais le feu, lui, est éternel.",
        dialogue: "Tu renais. Comme Vyr aurait dû. Mais à quel prix?"
      }
    },

    corruptionPath: {
      low: "Pyromancienne Contrôlée - Moins coût PV, moins dégâts",
      mid: "Sorcière Équilibrée - Balance damage/cost",
      high: "Flamme Vivante - +200% dmg, tous spells coûtent 50% PV"
    }
  },

  // 🗡️ VOLEUR CREUX - Héritage de SYLTHARA (Destin)
  HOLLOW_ROGUE: {
    god: "Sylthara, Scelleuse des Destinées Tissées",
    godStatus: "S'est effilochée. Ses fils pendent dans le vide.",

    loreOrigin: "A volé la Mort elle-même dans les Abysses. Depuis, ne peut ni mourir ni vraiment vivre. Creux.",

    playStyle: "High risk high reward avec mécaniques de destin volé",

    mechanicFromLore: {
      stolenFates: {
        desc: "3 charges Destin Volé par étage",
        usage: "Éviter 1 source de dégâts (100% dodge)",
        recharge: "Kill boss OU sacrifice companion",
        loreReason: "Tu voles le destin d'autrui. Sylthara tisse encore, mais pour toi.",
        cost: "+3% corruption par usage"
      },

      hollowness: {
        passive: "Ne peut pas heal naturellement",
        healMethod: "Voler PV des ennemis (lifesteal 30%)",
        loreReason: "Tu es creux. Seul ce que tu prends peut te remplir."
      },

      threadCut: {
        active: "Couper le fil d'un ennemi",
        effect: "Instant kill si PV ennemi < 40%",
        cost: "1 Destin Volé",
        failPenalty: "Si > 40% PV, toi -50% PV",
        loreReason: "Sylthara coupait les fils avec certitude. Toi, tu devines."
      }
    }
  },

  // 🙏 PÉNITENT - Héritage de AEL'MORA (Silence)
  PENITENT: {
    god: "Ael'mora, Scelleuse de la Fin Douce",
    godStatus: "A choisi de disparaître. Aucune trace. Aucun cadavre. Le seul dieu libre.",

    loreOrigin: "A prié 40 jours pour que les dieux reviennent. Ils n'ont pas répondu. Le 41e jour, elle s'est répondu elle-même.",

    playStyle: "Support/healer avec mécaniques de foi paradoxale",

    mechanicFromLore: {
      silentFaith: {
        desc: "Plus tu es silencieux (0 action), plus tu es fort",
        mechanic: "Chaque tour sans attaquer: +1 stack Foi (max 10)",
        benefit: "1 stack = +10% heal power, +5% def",
        release: "Attaquer consume tous stacks pour burst damage",
        loreReason: "Ael'mora a trouvé la puissance dans l'absence. Toi aussi."
      },

      martyrdom: {
        active: "Transférer tes dégâts à un allié",
        effect: "Next hit sur toi = absorbed by companion",
        cost: "Companion -50% PV, toi +10% corruption",
        loreReason: "Ael'mora a sacrifié sa divinité. Tu sacrifies ceux qui te font confiance."
      },

      thirdWay: {
        unlock: "Corruption exactement 50% en fin de run",
        effect: "Access to True Ending",
        loreReason: "Ael'mora a refusé de dévorer ou être dévorée. L'équilibre parfait."
      }
    }
  },

  // 🩸 SANGUELIÉ - Héritage de NOXAR (Mort)
  BLOODBOUND: {
    god: "Noxar, Scelleur de la Mort et Passeur d'Âmes",
    godStatus: "Dévoré en dernier. Son essence hante chaque cadavre.",

    loreOrigin: "7e génération d'une lignée maudite. Son ancêtre a fait un pacte avec un démon. Chaque descendant paie.",

    playStyle: "Berserker avec mécaniques de sang et sacrifice",

    mechanicFromLore: {
      bloodPrice: {
        desc: "Plus tu perds PV, plus tu es fort",
        scaling: "Chaque 10% PV perdus = +15% damage",
        danger: "À 10% PV = +150% dmg mais un coup te tue",
        loreReason: "Noxar exige le sang. Le tien ou celui d'autrui."
      },

      demonicAncestor: {
        trigger: "PV ≤ 25%",
        effect: "L'ancêtre démon prend contrôle 3 tours",
        benefit: "+200% stats, invincible, lifesteal 100%",
        cost: "+20% corruption, attaque aussi alliés si présents",
        loreReason: "Il n'est pas mort. Il attend. Dans ton sang."
      }
    }
  },

  // 🏹 ARCHER SILENCIEUSE - Héritage de KROVAX (Guerre)
  SILENT_ARCHER: {
    god: "Krovax, Scelleur de la Guerre Juste",
    godStatus: "S'est dévoré lui-même en combattant son reflet.",

    loreOrigin: "Meilleure archère du royaume. A tué son roi tyran d'une flèche. S'est arraché la langue pour ne jamais révéler pourquoi.",

    playStyle: "Precision sniper avec mécaniques de silence",

    mechanicFromLore: {
      vowOfSilence: {
        passive: "Aucun dialogue, aucun son émis",
        benefit: "Enemies +1 tour avant alerte, +30% crit dmg",
        break: "Si utilise item 'bruyant' (grenades, etc) = lose bonus",
        loreReason: "Le silence est son serment. Krovax comprenait la discipline."
      },

      kingslayer: {
        active: "1 flèche par étage",
        targeting: "Viser 3 secondes (ralenti temps)",
        effect: "Instant kill any non-boss, 80% PV dmg sur boss",
        loreReason: "Une flèche a tué un roi. Une flèche peut tuer un dieu."
      }
    }
  },

  // 👹 DÉMONISTE - Héritage de THALYS (Hasard)
  DEMONIST: {
    god: "Thalys, Scelleur des Hasards Contrôlés",
    godStatus: "Transformé en les Dés du Destin. Conscient. Observe tout.",

    loreOrigin: "Érudit qui a étudié les démons sans les comprendre. Invoque ce qu'il ne maîtrise pas. Survivra-t-il?",

    playStyle: "Summoner chaotic avec RNG extrême",

    mechanicFromLore: {
      randomSummon: {
        cost: "30 mana",
        effect: "Roll 1d6, invoque créature aléatoire",
        table: [
          "1 = Imp (faible, loyal)",
          "2-3 = Void Spawn (moyen, 50% obéit)",
          "4-5 = Demon (fort, 70% obéit)",
          "6 = Elder Horror (overpowered, 30% obéit, +15% corruption)"
        ],
        loreReason: "Thalys contrôlait le hasard. Toi, tu le subis."
      },

      bargainWithDice: {
        active: "Négocier avec Thalys avant invocation",
        offer: "Sacrifice (PV/corruption/item/companion)",
        benefit: "Contrôler le résultat du d6",
        danger: "Thalys se souvient de tes dettes",
        loreReason: "Les Dés parlent. Si tu écoutes."
      }
    }
  }
};
```

### 🔄 Progression des Classes

```javascript
const CLASS_PROGRESSION = {
  levels: [1, 3, 5, 7, 10], // Unlock new abilities

  corruptionBranches: {
    desc: "À 33% et 66% corruption, unlock new skill tree",
    pure: "Path of Humanity - Resist corruption, weaker but safer",
    corrupted: "Path of Power - Embrace darkness, stronger but costly",
    balanced: "Path of Grey - Unique hybrid skills (harder to maintain)"
  },

  classItems: {
    desc: "Certains items uniques par classe",
    example: {
      WITCH_OF_ASHES: {
        "Phoenix Feather": "Reduce Immolation cost 30% → 15%",
        "Village Ashes": "Passive +2 Cendres/sec, but hear screams of the dead"
      },
      SHATTERED_KNIGHT: {
        "King's Crown": "Your oaths affect enemies too",
        "Broken Shield": "LastStand triggers at 20% instead of 10%"
      }
    }
  }
};
```

---

## 💎 CORRUPTION : LE PRIX DU POUVOIR

### 📖 Fondation Narrative

La **Corruption** n'est pas un alignement moral. C'est une **transformation physique et spirituelle**. Plus tu utilises les pouvoirs des dieux morts, plus tu deviens... autre chose. Quelque chose entre humain et divinité. Entre vie et Vide.

### 🎮 Implémentation Gameplay

```javascript
const CORRUPTION_SYSTEM = {
  range: [0, 100],

  // 🎭 STADES DE TRANSFORMATION
  stages: {
    HUMAN: {
      corruption: [0, 25],
      visualChanges: "Aucun",
      gameplay: "Stats normales, accès ending A",
      npcReactions: "Neutres à positives",
      godVoices: "Silencieuses"
    },

    TOUCHED: {
      corruption: [26, 50],
      visualChanges: "Yeux grisâtres, veines sombres visibles",
      gameplay: "+10% dmg, -5% max HP, unlock skills corruption",
      npcReactions: "Méfiance, peur",
      godVoices: "Murmures occasionnels",
      dialogue: "Tu sens leur présence. Les Sept. Morts, mais pas silencieux."
    },

    TAINTED: {
      corruption: [51, 75],
      visualChanges: "Peau pâle, aura sombre, yeux vides",
      gameplay: "+25% dmg, -15% max HP, enemies sometimes flee",
      npcReactions: "Hostilité, refus de commerce",
      godVoices: "Constantes, séductrices",
      dialogue: "Ils te parlent. Tu leur réponds. C'est... confortable."
    },

    ASCENDED: {
      corruption: [76, 100],
      visualChanges: "Presque plus humain, aura divine corrompue",
      gameplay: "+50% all stats, -30% max HP, access ending B",
      npcReactions: "Terreur ou adoration fanatique",
      godVoices: "Tu ES leur voix",
      dialogue: "Tu n'es plus toi. Tu es Nous. Et c'est... parfait."
    }
  },

  // 📈 SOURCES DE CORRUPTION
  sources: {
    godPowers: {
      darkPact: +5,
      phoenixRebirth: +25,
      demonicAncestor: +20,
      bargainWithDice: +10,
      reason: "Utiliser les pouvoirs des dieux morts te transforme"
    },

    moralChoices: {
      sacrificeCompanion: +15,
      eatDemonHeart: +10,
      desecrateTomb: +5,
      reason: "Chaque choix sombre laisse une trace"
    },

    items: {
      cursedWeapons: "+2 per hit",
      demonArmor: "+1 per combat",
      reason: "Les artefacts corrompus changent celui qui les porte"
    },

    zones: {
      abysses: "+1 per room",
      voidRifts: "+5 si exposition >2min",
      reason: "Certains lieux infectent l'âme"
    }
  },

  // 🧹 RÉDUCTION DE CORRUPTION (difficile)
  reduction: {
    prayer: {
      cost: "30min repos au village",
      effect: "-3 corruption",
      limit: "1 par étage",
      loreReason: "Tu pries des dieux morts. Mais le rituel... apaise."
    },

    sacrifice: {
      cost: "Détruire item légendaire",
      effect: "-10 corruption",
      loreReason: "Refuser le pouvoir. Ael'mora approuverait."
    },

    companion: {
      trigger: "Dialogue profond avec companion pur",
      effect: "-5 corruption",
      loreReason: "Leur humanité te rappelle la tienne."
    },

    IMPORTANT: "Réduire corruption est DIFFICILE. Monter est facile. Descendre est un combat."
  },

  // 🎬 ÉVÉNEMENTS PAR SEUIL
  thresholdEvents: {
    25: {
      event: "First Whisper",
      desc: "Tu entends pour la première fois la voix d'un dieu mort",
      choice: "L'écouter ou l'ignorer",
      consequence: "Ignore = nothing, Listen = +5 corruption but hint secret"
    },

    50: {
      event: "The Mirror",
      desc: "Combat contre ton reflet corrompu (preview de toi à 100%)",
      mechanic: "Boss fight, si tu perds = +10 corruption, si gagnes = -5 corruption"
    },

    75: {
      event: "The Offer",
      desc: "Les Dés te proposent de devenir le 8e Dieu",
      choice: "Accept immédiatement (ending B direct) OU refuse (continue)",
      loreReason: "Point of no return narratif"
    },

    100: {
      event: "Apotheosis",
      desc: "Tu n'es plus humain. Ending B se déclenche.",
      visual: "Transformation cinématique, boss final different"
    }
  }
};
```

### 🎨 Feedback Visuel de la Corruption

```javascript
const CORRUPTION_VISUALS = {
  playerSprite: {
    0-25: "Normal sprite",
    26-50: "Grey tint, dark eyes shader",
    51-75: "Dark aura particle effect, pale skin",
    76-100: "Divine/demonic glow, distortion effect"
  },

  UI: {
    corruptionBar: {
      colors: ["#10B981", "#F59E0B", "#EF4444", "#8B00FF"],
      effects: "Pulse when gaining corruption",
      warnings: "Flash red at 75%, shake screen at 100%"
    }
  },

  ambiance: {
    0-25: "Normal dungeon ambiance",
    26-50: "Whispers sound effect (rare)",
    51-75: "Constant whispers, distorted music",
    76-100: "Divine choir + demonic drones mixed"
  }
};
```

---

## 🎁 ITEMS : FRAGMENTS D'UN MONDE BRISÉ

### 📖 Fondation Narrative

Chaque item est un **fragment d'histoire**. Une épée n'est pas "Épée +5" - c'est "La Lame que le Roi Trahi a Brisée sur le Crâne de son Assassin Avant de Mourir".

### 🎮 Implémentation Gameplay

```javascript
const ITEM_LORE_SYSTEM = {
  categories: {
    // ⚔️ ARMES
    WEAPONS: {
      structure: {
        stats: "Damage, crit, speed",
        lore: "200-300 chars story",
        corruptionTier: "pure/neutral/cursed",
        godAffinity: "Which god crafted/blessed it"
      },

      example: {
        id: "BROKEN_OATH",
        name: "Serment Brisé",
        type: "Épée longue",
        rarity: "legendary",

        stats: {
          damage: 45,
          critChance: 15,
          special: "Chaque coup a 10% chance de briser buff ennemi"
        },

        lore: `Forgée par le dernier forgeron de Morwyn.

Le chevalier qui la portait a brisé son serment pour sauver un enfant. L'Ordre l'a exécuté. L'épée s'est brisée en deux. Cette moitié pleure encore.

Quand tu la tiens, tu entends: "J'ai choisi. Et je le referais."`,

        godAffinity: "MORWYN",
        corruptionEffect: {
          ifPure: "+10% dmg vs corrupted enemies",
          ifCorrupted: "Blade cries, -5% dmg, but +15% vs holy"
        },

        specialInteraction: {
          class: "SHATTERED_KNIGHT",
          effect: "Can repair blade by completing all oaths perfectly",
          repaired: {
            name: "Serment Réparé",
            damage: 80,
            special: "Immunité aux debuffs"
          }
        }
      }
    },

    // 🛡️ ARMURES
    ARMOR: {
      example: {
        id: "VILLAGE_ASHES_CLOAK",
        name: "Manteau des 400",
        rarity: "rare",

        stats: {
          defense: 25,
          fireResist: 50,
          special: "Quand PV < 30%, heal 20% et explose en flammes (1/combat)"
        },

        lore: `Tissé avec les cendres du village que la Sorcière a brûlé.

400 âmes. Hommes, femmes, enfants. Tous pestiférés. Tous condamnés. Elle les a sauvés de la transformation démoniaque... en les tuant.

Le manteau murmure leurs noms. Chaque nuit. Elle les connaît tous.`,

        godAffinity: "VYR",
        corruptionEffect: {
          passive: "+1 corruption per combat (voices never stop)"
        },

        specialInteraction: {
          class: "WITCH_OF_ASHES",
          effect: "Unlock dialogue spécial: pardon des 400",
          unlockEnding: "Secret ending C variant si worn au boss final"
        }
      }
    },

    // 💍 ACCESSOIRES
    ACCESSORIES: {
      example: {
        id: "THALYS_BROKEN_TOOTH",
        name: "Dent de Thalys",
        rarity: "legendary",

        stats: {
          luck: +5,
          special: "1/jour: forcer 1 reroll sur n'importe quel RNG"
        },

        lore: `Une dent du dieu Thalys, tombée quand Noxar l'a dévoré.

Elle roule encore. Sur un 6 éternel.

Si tu la portes, tu entends les Dés rire. Ils savent quelque chose que tu ignores.`,

        godAffinity: "THALYS",
        hiddenEffect: {
          desc: "Si équipé au boss final contre les Dés",
          trigger: "Dés révèlent: 'Tu portes... moi? Ironique.'",
          unlock: "Secret boss phase dialogue variant"
        }
      }
    },

    // 🍺 CONSOMMABLES
    CONSUMABLES: {
      example: {
        id: "DEMON_HEART",
        name: "Cœur de Démon Mineur",
        rarity: "uncommon",

        effect: {
          immediate: "Heal 100% PV",
          cost: "+10% corruption permanente"
        },

        lore: `Il bat encore. Faiblement.

Les démons n'ont pas de cœur, disait-on. Ils en ont un. Noir. Vivant. Éternel.

Si tu le manges, il deviendra toi. Ou tu deviendras lui.`,

        dialogue: {
          beforeEat: "Tu le sens pulser dans ta main. Chaud. Tentant.",
          onEat: "Le goût est... familier. Comme si tu te souvenais d'avant.",
          after: "+10% corruption. Quelque chose a changé. En toi."
        }
      }
    }
  },

  // 🔗 SETS ET SYNERGIES
  itemSets: {
    MORWYN_LEGACY: {
      pieces: ["Broken Oath", "Knight's Crown", "Shattered Shield"],
      2pieces: "Oaths +50% effect",
      3pieces: "Unlock skill: Morwyn's Last Stand (cheat death 1/run)",
      lore: "L'héritage complet de Morwyn. Porter son souvenir."
    },

    VYR_FLAMES: {
      pieces: ["Village Ashes Cloak", "Phoenix Feather", "Immolation Staff"],
      2pieces: "Fire damage +30%",
      3pieces: "Die by fire? Resurrect as Phoenix (1/run, +50% corruption)",
      lore: "Vyr s'est consumée. Toi aussi, peut-être."
    }
  }
};
```

---

## 🏰 VILLAGE NOMADE : L'ESPOIR MOBILE

### 📖 Fondation Narrative

Le **Village Nomade** n'est pas un hub classique. C'est un **organisme vivant** fait de survivants que TU sauves. Chaque NPC a une histoire. Chaque boutique est une personne.

### 🎮 Implémentation Gameplay

```javascript
const VILLAGE_SYSTEM = {
  // 🧍 NPCs SAUVABLES
  rescuablePeople: {
    merchant: {
      name: "Aldric le Réticent",
      rescue: "Étage 2, cage trial 'Le Marchand ou l'Or'",
      backstory: "Marchand avare qui a vendu des armes aux démons. Regrette.",

      villageRole: {
        shop: "Vend items, prix 20% plus cher si corruption > 50%",
        dialogue: "8 lignes différentes selon corruption",
        quest: "Apporte-lui 'Blood Diamond' → unlock discount + lore"
      },

      death: {
        trigger: "Si village attaqué et pas défendu",
        consequence: "Shop fermée, village morale -20%",
        ghost: "Apparaît en fantôme étage 5, te reproche"
      }
    },

    blacksmith: {
      name: "Keira la Brisée",
      rescue: "Étage 3, choix 'Sauver le forgeron ou voler équipement légendaire'",
      backstory: "Dernière apprentie de Morwyn. A forgé l'arme qui a tué son maître.",

      villageRole: {
        craft: "Améliore armes, répare items cassés",
        special: "Si corruption < 30%, peut purifier cursed items",
        questline: "3 quests → elle forge 'Redemption', arme unique"
      }
    },

    // 🧑‍🤝‍🧑 8 NPCs total à sauver
    totalNPCs: 8,
    synergy: "Plus NPCs sauvés = plus services, meilleur morale, moins coût items"
  },

  // 🎭 MORAL DU VILLAGE
  morale: {
    range: [0, 100],

    effects: {
      high: {
        morale: [80, 100],
        effects: "-10% shop prices, +quest rewards, NPCs cheer you",
        ambient: "Music joyful, lights bright, children play"
      },

      low: {
        morale: [0, 30],
        effects: "+20% prices, NPCs hostile, some leave",
        ambient: "Music somber, darkness, crying sounds",
        danger: "Si 0 morale, village disbands = game over"
      }
    },

    sources: {
      increase: [
        "Sauver NPC: +15",
        "Compléter quest: +10",
        "Donner ressources gratuites: +5",
        "Défendre village si attaqué: +20"
      ],
      decrease: [
        "NPC meurt: -20",
        "Haute corruption visible: -2 per jour",
        "Refuser d'aider: -10",
        "Voler dans le village: -30 (if caught)"
      ]
    }
  },

  // ⚔️ DÉFENSE DU VILLAGE
  villageDefense: {
    trigger: "Random 20% chance per étage clear",

    event: {
      warning: "Demons approach! Defend or flee?",

      defend: {
        mechanic: "Tower defense mini-game (3 waves)",
        reward: "Morale +20, NPCs unlock special items",
        risk: "NPCs can die permanently"
      },

      flee: {
        consequence: "Village -50 morale, 1d3 NPCs die",
        corruption: "+15% (cowardice)",
        npcDialogue: "Tu nous as abandonnés..."
      }
    }
  },

  // 🏛️ STRUCTURES DU VILLAGE
  buildings: {
    tent: {
      name: "Tente du Repos",
      function: "Heal, save game, -3 corruption si prière",
      upgrade: "8 NPCs sauvés → devient Temple → -5 corruption"
    },

    forge: {
      require: "Sauver Keira",
      function: "Craft, upgrade, repair, purify"
    },

    tavern: {
      require: "Sauver Innkeeper (étage 4)",
      function: "Écouter rumeurs (hints secrets), quests secondaires, moral boost"
    },

    library: {
      require: "Sauver Scholar (étage 5)",
      function: "Read lore codex, unlock bestiary, learn enemy weaknesses"
    }
  }
};
```

---

## 🎲 ÉPREUVES DES CAGES : DILEMMES IMPOSSIBLES

### 📖 Fondation Narrative

Les **Cages** sont des **fragments de Thalys** - des micro-univers où le temps et l'espace plient. À l'intérieur, deux prisonniers. Tu dois en sauver un. L'autre meurt. **Il n'y a pas de bon choix**.

### 🎮 Implémentation Gameplay

```javascript
const CAGE_TRIALS_SYSTEM = {
  frequency: "1 cage garantie tous les 2 étages",

  structure: {
    entry: "Salle spéciale, 2 cages, 2 prisonniers, 60 secondes",

    choice: {
      timeLimit: 60,
      penalty: "Si aucun choix = les deux meurent + corruption +25%",
      locked: "Une fois choisi, irréversible"
    },

    consequences: {
      immediate: "Le sauvé rejoint village OU donne reward",
      delayed: "Le mort revient en boss corrompu étages plus tard",
      guilt: "+5% corruption par mort (tu as choisi)"
    }
  },

  // 🎭 16 CAGES UNIQUES
  trials: {
    CAGE_1: {
      name: "Le Marchand ou l'Or",

      prisonerA: {
        name: "Aldric le Marchand",
        plea: "J'ai une famille! Mes enfants!",
        truth: "Ses enfants sont morts. Il ment. Mais il peut être utile.",
        reward: "Unlock shop au village",
        death: "Revient boss 'Greed Phantom' étage 4"
      },

      prisonerB: {
        name: "Coffre d'Or Ancien",
        plea: "...",
        truth: "Contient 500 gold + item légendaire",
        reward: "Richesse immédiate",
        death: "L'or était maudit. -10% stats permanent si pris."
      },

      twist: "Si corruption > 50%, Thalys propose 3e option: tuer les deux, prendre l'or ET l'âme du marchand (gain max, guilt max)"
    },

    CAGE_2: {
      name: "L'Enfant ou le Héros",

      prisonerA: {
        name: "Mira, 8 ans",
        plea: "Maman? T'es ma maman?",
        truth: "Orpheline. Pure. Innocente. Inutile en combat.",
        reward: "Si sauvée, boost moral village +30, mais aucun bonus combat",
        death: "Village morale -40. NPCs te haïssent. Toi aussi."
      },

      prisonerB: {
        name: "Gareth, Champion Déchu",
        plea: "Je peux t'aider! Je suis fort!",
        truth: "Ancien héros, maintenant lâche. Mais skills de combat.",
        reward: "Companion (DPS), +20% damage en duo",
        death: "Revient boss 'Coward's Regret'"
      },

      dilemma: "Utilité vs Humanité. C'est quoi être un héros?"
    },

    CAGE_3: {
      name: "Le Bourreau ou la Victime",

      prisonerA: {
        name: "Thorne, ex-Bourreau Royal",
        plea: "Je faisais mon devoir. Rien de plus.",
        truth: "A exécuté 200 innocents. Suivait les ordres.",
        reward: "Teach skill 'Execution' (instant kill <15% PV)",
        death: "200 fantômes te remercient. -10% corruption."
      },

      prisonerB: {
        name: "Elena, Dernière Condamnée",
        plea: "J'ai volé du pain. Pour ma sœur. Pitié.",
        truth: "A volé. Mais pour nourrir. Innocente? Coupable?",
        reward: "Companion (support), +15% heal reçu",
        death: "Tu entends ses derniers mots: 'Ma sœur... seule...'"
      },

      dilemma: "Justice vs Vengeance vs Pitié"
    },

    CAGE_7: {
      name: "Toi ou Ton Reflet",

      prisonerA: {
        name: "Toi (passé)",
        plea: "Sauve-moi. Si je meurs, tu n'auras jamais existé.",
        truth: "Paradoxe temporel. Peut-être vrai?",
        reward: "Si sauvé: +1 skill point, access souvenir",
        death: "Rien ne se passe. C'était un mensonge. +0 corruption."
      },

      prisonerB: {
        name: "Toi (futur)",
        plea: "Ne me sauve pas. Laisse-moi mourir. Brise le cycle.",
        truth: "Toi à 100% corruption. Veut que tu évites ce destin.",
        reward: "Si sauvé: +20% corruption mais unlock ending secret hint",
        death: "Il sourit. 'Merci.' -15% corruption."
      },

      dilemma: "Identité, cycles, libre arbitre"
    },

    CAGE_13: {
      name: "La Mère ou l'Enfant (Revisité)",

      prisonerA: {
        name: "Femme enceinte",
        plea: "Mon bébé... il vit encore...",
        truth: "9e mois. L'enfant à naître est possédé (Hybrid).",
        reward: "Si sauvée: donne naissance au village, mais enfant = danger latent",
        death: "Deux âmes perdues. Ou deux menaces évitées?"
      },

      prisonerB: {
        name: "Prêtresse de Ael'mora",
        plea: "Je peux purifier l'enfant! Sauvez-moi!",
        truth: "Peut peut-être purifier. Peut-être.",
        reward: "Si sauvée: rituel au village, 50% purify, 50% tue la mère",
        death: "La mère accouche seule. Que fait-on de l'enfant-démon?"
      },

      dilemma: "Espoir vs Pragmatisme. Tous les enfants méritent-ils de vivre?"
    }
  },

  // 📊 STATS TRACKING
  cageStats: {
    track: [
      "Combien sauvés vs tués",
      "Temps moyen de décision",
      "Patterns (toujours A? Toujours B? Alternate?)"
    ],

    consequence: {
      allA: "Ending dialogue: 'Tu as toujours choisi la même main. Est-ce de la cohérence ou de la lâcheté?'",
      allB: "Différent dialogue",
      mixed: "Dialogue neutre",
      noneChosen: "Si >3 cages skipées: 'Tu refuses de choisir. Mais ne rien choisir... c'est choisir aussi.'"
    }
  }
};
```

---

## 👹 BESTIAIRE : ENNEMIS = VICTIMES

### 📖 Fondation Narrative

**Aucun ennemi n'est mauvais par nature**. Tous étaient quelque chose d'autre. Humains. Serviteurs des dieux. Âmes perdues. Les monstres du donjon sont des **victimes du Grand Déchirement**.

### 🎮 Implémentation Gameplay

```javascript
const BESTIARY_SYSTEM = {
  enemyTypes: {
    // 🧟 ZOMBIE
    ZOMBIE: {
      stats: { hp: 40, atk: 8, def: 5 },

      lore: `Âmes qui cherchent encore Noxar.

"Pourquoi ne vient-il plus?" murmurent-ils.
Parce que Noxar est mort. Mais eux ne le savent pas. Alors ils errent. Éternellement.`,

      mechanics: {
        standard: "Attack simple, slow",

        corrupted: {
          trigger: "Player corruption > 60%",
          behavior: "Zombies recognize you as 'kin', hesitate 1 tour avant attaque",
          dialogue: "...frère?" (rare, 5% chance)
        },

        pure: {
          trigger: "Player corruption < 20%",
          behavior: "Zombies smell 'life', +30% aggro",
          dialogue: "...vivant... mangé..." (rare)
        }
      },

      death: {
        standard: "Tombe, gémit 'enfin...'",
        special: {
          trigger: "Kill avec holy damage",
          effect: "Soul released, particle effect, -1% corruption for player",
          dialogue: "Une lumière blanche. Un soupir. Le silence."
        }
      },

      secrets: {
        canTalk: {
          unlock: "Équiper 'Noxar's Whisper' item",
          dialogue: [
            "Pourquoi... abandonné?",
            "Dieu... promis... retour...",
            "Combien... temps... passé?"
          ],
          reward: "Si tu leur réponds la vérité ('Noxar est mort'), +10 XP, zombie se dissout pacifiquement"
        }
      }
    },

    // 🦴 SKELETON WARRIOR
    SKELETON_WARRIOR: {
      stats: { hp: 60, atk: 15, def: 10 },

      lore: `Guerriers de Krovax. Sont morts au combat. Refusent de partir.

L'honneur demeure quand la chair pourrit. Ils combattent encore. Pour quoi? Ils ont oublié. Mais l'honneur suffit.`,

      mechanics: {
        honorCode: {
          rule: "Squelettes n'attaquent jamais en surnombre",
          implementation: "Si 2+ squelettes vs 1 player, ils attaquent 1 par 1 (tour based)",
          exploit: "Player peut utiliser cette 'faiblesse' tactiquement"
        },

        salute: {
          trigger: "Si player utilise 'Bow' emote avant combat",
          effect: "Skeleton salue, combat +10% XP, mutual respect",
          lore: "Krovax enseignait: respecte ton adversaire, même dans la mort"
        },

        pastSelf: {
          trigger: "Rare (5% chance) si player = SHATTERED_KNIGHT",
          reveal: "Ce squelette porte TON armure d'une run précédente",
          dialogue: "...toi? Encore toi? Combien de fois devrons-nous mourir?",
          mechanic: "Boss fight version, connait tes patterns, +lore secret si battu"
        }
      }
    },

    // 💃 CORRUPTED SUCCUBUS
    CORRUPTED_SUCCUBUS: {
      stats: { hp: 80, atk: 20, def: 8, special: "Charm 40% chance" },

      lore: `Elle cherche son amant. Mort il y a 300 ans.

Elle ne se souvient plus de son visage. Juste... qu'elle l'aimait. Alors elle séduit les ombres. Peut-être l'une d'elles sera-t-elle lui.

Elle ne sait pas qu'elle le cherche dans les Abysses. Il est au Paradis. S'il existe encore.`,

      mechanics: {
        charm: {
          effect: "Player contrôle inversé 1 tour",
          resist: "Si player a companion, -50% chance (amour protège)",
          corrupt: "Si player corruption > 60%, immune (déjà séduit par pire)"
        },

        dialogue: {
          trigger: "Si player = male character avec companion female",
          line: "Vous... vous vous aimez? Comment est-ce... d'être aimé?",
          choice: [
            "Lui répondre gentilement = elle pleure, fuit, +lore",
            "Attaquer = combat standard",
            "Mentir = elle rage, +50% stats, boss variant"
          ]
        },

        secret: {
          item: "Lover's Locket (rare drop étage 2)",
          action: "Lui montrer le médaillon (son amant le portait)",
          effect: "Elle se souvient. Pleure. Se dissout. Drop legendary 'Eternal Love Ring'",
          consequence: "+lore entry, -5% corruption, unlock secret sidequest 'Reunite the Lovers'"
        }
      }
    }
  },

  // 📚 BESTIARY PROGRESSION
  discovery: {
    mechanic: "Tuer ennemi = unlock 30% codex entry",

    fullUnlock: [
      "Kill 10x same enemy = unlock 100% lore + weaknesses",
      "Dialogue spécial avec ennemi = unlock secrets",
      "Scholar au village = peut révéler weakness si apporté item"
    ],

    rewards: "Compléter bestiary 100% = unlock skin 'Loremaster' + bonus dmg vs tous"
  }
};
```

---

## 🎵 AUDIO ET AMBIANCE : L'ÂME DU JEU

### 📖 Fondation Narrative

Le son n'est pas décoratif. C'est **narratif**. La musique change selon corruption. Les voix des dieux sont un instrument. Le silence est une arme.

### 🎮 Implémentation Gameplay

```javascript
const AUDIO_SYSTEM = {
  // 🎼 DYNAMIC MUSIC
  music: {
    layers: {
      base: "Ambient drone (always playing)",
      melody: "Triggers selon zone",
      corruption: "Demonic layer, volume = corruption%",
      divine: "Choir layer, volume = (100 - corruption)%"
    },

    transitions: {
      combat: "Percussions s'ajoutent, tempo +20%",
      boss: "Full orchestral + layer spécifique au boss",
      village: "Calm, warm, human instruments (lute, flute)",
      abysses: "Distorted, unsettling, void sounds"
    },

    corruptionEffect: {
      0-25: "Pure orchestral, hopeful tones",
      26-50: "Strings distort, whispers layer faint",
      51-75: "Demonic choir joins, dissonance increases",
      76-100: "Almost pure demonic, but... beautiful? Seductive."
    }
  },

  // 🗣️ VOICE SYSTEM
  godVoices: {
    implementation: "Whispers text-to-speech avec heavy FX",

    triggers: {
      MORWYN: {
        when: "Break oath, ou restore order",
        voice: "Deep, authoritative, echoing",
        lines: ["L'ordre. Toujours l'ordre.", "Tu as brisé... comme moi."]
      },

      THALYS: {
        when: "Roll dice, RNG events",
        voice: "Playful, multiple voices at once",
        lines: ["Un six. Toujours un six.", "Tu crois contrôler le hasard?"]
      },

      AEL_MORA: {
        when: "Corruption exactly 50%",
        voice: "Soft, feminine, distant",
        lines: ["L'équilibre. Tu l'as trouvé.", "Je suis... fière? Peut-on être fière quand on n'existe plus?"]
      }
    },

    frequency: {
      0-25_corruption: "Jamais (silence divin)",
      26-50: "Rare (5% events)",
      51-75: "Commun (20% events)",
      76-100: "Constant (almost every action)"
    }
  },

  // 🔇 SILENCE MECHANIC
  silence: {
    zones: {
      "Silent Chapel": {
        desc: "Zone où AUCUN son. Pas même UI beeps.",
        effect: "Enemies +50% stealth, player anxiety ++",
        loreReason: "Ael'mora's last temple. She took sound with her."
      }
    },

    skill: {
      class: "SILENT_ARCHER",
      effect: "Mute all sounds for 10 seconds",
      advantage: "Enemies confused, -30% accuracy",
      cost: "Player aussi no audio feedback (high risk)"
    }
  },

  // 💀 DEATH SOUNDS
  deathAudio: {
    player: {
      standard: "Gasp, fall, echo of laughter (Thalys?)",
      firstDeath: "Special voice: 'Ah. Voilà. Le cycle recommence.'",
      100thDeath: "Voice: 'Combien de fois encore? Combien?'"
    },

    enemy: {
      standard: "Pain sound + leur dernier mot",
      purified: "Sigh of relief, angelic note",
      corrupted: "Demonic screech, void suction sound"
    }
  }
};
```

---

## 🏁 LES 3 ENDINGS : TON CHOIX, TON DESTIN

### 📖 Fondation Narrative

Il n'y a pas de "bon" ending. Il y a **ton** ending. Basé sur qui tu es devenu.

### 🎮 Implémentation Gameplay

```javascript
const ENDINGS_SYSTEM = {
  // 🕊️ ENDING A: BRISER LE PACTE
  ENDING_A: {
    requirements: {
      corruption: [0, 25],
      choice: "Au boss final, refuser le pouvoir des Dés"
    },

    narrative: `Tu refuses. Le pouvoir. La divinité. L'immortalité.

Les Dés te regardent. "Pourquoi?"

"Parce que je suis humain."

Thalys rit. Doucement. Tristement.

"Ael'mora avait raison. L'humanité... c'est choisir la fin."

Le pacte se brise. Tu es libre.

Tu mourras. Un jour. Vraiment. Définitivement.

Et c'est... beau.`,

    gameplay: {
      boss: "Les Dés ne combattent pas vraiment. Phase dialogue pure.",
      aftermath: "Village persiste. NPCs sauvés restent. Ton nom devient légende.",
      unlock: "New Game+ mode 'Mortal Run' (no resurrection, 1 life)"
    },

    finalShot: "Ton personnage vieillit (time-lapse), meurt paisiblement au village, entouré. Écran noir. 'Merci d'avoir joué.'"
  },

  // 👑 ENDING B: ASCENSION DÉMONIAQUE
  ENDING_B: {
    requirements: {
      corruption: [76, 100],
      choice: "Au boss final, accepter de devenir le 8e Dieu"
    },

    narrative: `Tu prends les Dés dans ta main.

Ils brûlent. Fondent. S'intègrent à toi.

Tu es désormais Thalys. Et Thalys est toi.

Les Sept sont morts. Le Huitième est né.

Tu regardes Aethermoor. Ton royaume. Ton enfer.

"Que la Seconde Apocalypse commence."`,

    gameplay: {
      boss: "Phase finale = tu absorbes les Dés, fight corruption itself",
      aftermath: "Deviens le nouveau boss. New Game+ = players combat toi",
      unlock: "God Mode (stats x10, mais NPCs terrifiés, village détruit)"
    },

    finalShot: "Ton personnage transformé (divin/démoniaque), assis sur trône de crânes, Dés orbitent autour. Fade to red. 'Un dieu est né.'"
  },

  // ⚖️ ENDING C: LA TROISIÈME VOIE (SECRET)
  ENDING_C: {
    requirements: {
      corruption: "EXACTLY 50% (±2%)",
      choice: "Découvrir le secret de Ael'mora",
      hidden: [
        "Porter Village Ashes Cloak au boss final",
        "Avoir sauvé tous les 8 NPCs",
        "Compléter dialogue secret avec Scholar"
      ]
    },

    narrative: `Tu n'es ni humain ni dieu.

Tu es... équilibré. Sur le fil. Entre deux Vides.

Ael'mora apparaît. Pas vraiment. Son souvenir. Son idée.

"Tu as compris," dit-elle. "Ni dévorer, ni être dévoré. Juste... être."

Elle te montre la porte. Celle qu'elle a pris.

"Au-delà du Vide. Au-delà des Dieux. Il y a... autre chose."

Tu franchis la porte.

Et l'histoire se termine.

Ou commence-t-elle enfin?`,

    gameplay: {
      boss: "Secret phase. Combat 'The Balance' (boss = version miroir parfaite)",
      mechanic: "Doit rester à 50% corruption pendant fight (buff = corruption, dmg = purify)",
      aftermath: "Ending mystique. Village transcende, devient 'Haven Beyond'",
      unlock: "New Game+ 'Balanced Path' (corruption locked 45-55%, ultra hard)"
    },

    finalShot: "Porte de lumière. Tu entres. Écran blanc. Sons indéchiffrables. Puis: 'Ael'mora sourit. Quelque part.'"
  },

  // 📊 ENDING VARIANTS
  variants: {
    desc: "Chaque ending a 3-5 variants selon:",
    factors: [
      "NPCs sauvés (all/some/none)",
      "Cages choices patterns",
      "Companions alive/dead",
      "Secrets discovered"
    ],

    example: {
      ENDING_A_VARIANT_HERO: {
        condition: "Ending A + all NPCs saved + corruption <10%",
        change: "Village erects statue of you, credits show village prospering 100 years later"
      },

      ENDING_A_VARIANT_ALONE: {
        condition: "Ending A + no NPCs saved + corruption 20-25%",
        change: "You die alone in a cave. Decades later, a child finds your journal. Cycle continues?"
      }
    }
  }
};
```

---

## 🔄 NEW GAME+ : LE CYCLE ÉTERNEL

```javascript
const NG_PLUS_SYSTEM = {
  unlocks: {
    afterFirstClear: [
      "Corruption carries over (choice: start at 0 or keep %)",
      "Bestiary & codex persistent",
      "New dialogue options (meta: 'I've done this before')",
      "Secret rooms unlock"
    ],

    afterAllEndings: [
      "True Ending unlock ('The Loop')",
      "Can talk to Thalys freely",
      "Boss rush mode",
      "Permadeath mode 'Mortal Coil'"
    ]
  },

  changes: {
    enemies: "+50% stats each cycle",
    cages: "Different prisoners, same dilemmas",
    npcs: "Remember you vaguely ('Have we... met?')",
    dice: "Thalys comments: 'Encore toi. Toujours toi.'"
  },

  loreReason: "The loop is canon. You ARE the Last Pactised. Forever."
};
```

---

## 📱 RÉSEAUX SOCIAUX & MARKETING : DOPAMINE META

```javascript
const VIRAL_SYSTEMS = {
  shareableMoments: {
    cageTweets: {
      auto: "After cage choice, generate tweet template",
      example: "I chose the merchant over 500 gold. Am I stupid? #LastCovenant #CageTrial1",
      hook: "Provoke debate, moral discussion"
    },

    deathClips: {
      record: "Last 10 seconds before death auto-save",
      share: "One-click to clip + share 'My dumbest death #LastCovenant'",
      viral: "Funny deaths = organic marketing"
    },

    corruptionSelfie: {
      feature: "Screenshot filter montrant ton %corruption",
      challenge: "#MyCorruptionLevel - how far would YOU go?",
      engagement: "Communauté compare, débat moralité"
    }
  },

  streamIntegration: {
    twitchPolls: {
      cageChoices: "Chat vote (30sec), streamer doit suivre majorité",
      chaos: "Chat vs Streamer moral alignment = content gold"
    },

    corruptionOverlay: {
      widget: "Real-time corruption % visible à l'écran",
      alerts: "Quand corruption +10%, TTS alert 'YOU ARE CHANGING'",
      engagement: "Viewers spam 'RESIST' ou 'EMBRACE' in chat"
    }
  }
};
```

---

## 🎯 MÉTRIQUES DE SUCCÈS : GOTY 2026

```javascript
const SUCCESS_METRICS = {
  narrative: {
    goal: "Joueurs pleurent au moins 1 fois pendant playthrough",
    measure: "Survey post-game: 'Which moment hit you hardest?'"
  },

  replay: {
    goal: "70% players font au moins 2 runs (endings différents)",
    measure: "Achievement tracking 'See All Ends'"
  },

  community: {
    goal: "Cage choices debated sur Reddit/Twitter",
    measure: "Track #CageTrials hashtag engagement",
    success: "If moral philosophy YouTubers cover le jeu = win"
  },

  awards: {
    target: [
      "Best Narrative - Game Awards",
      "Best Indie - IGF",
      "Innovation in Storytelling - GDC"
    ]
  },

  transmedia: {
    dream: "Netflix/Amazon/A24 demande rights pour adaptation",
    setup: "Lore structurée pour faciliter adaptation",
    hook: "Pitch deck ready: 'Dark Souls meets The Leftovers'"
  }
};
```

---

## ✅ NEXT STEPS IMMÉDIATS

```javascript
const IMMEDIATE_TASKS = {
  // ✅ DÉJÀ FAIT
  done: [
    "LORE_MASTER.md",
    "THEOLOGY_AND_ENTITIES.md",
    "BESTIARY_LORE.md",
    "PANORAMA_SYSTEMS.md (CE DOCUMENT)"
  ],

  // 🔜 À CRÉER
  next: [
    {
      file: "items-lore.json",
      desc: "Tous les items avec lore intégrée",
      format: "JSON exploitable par game code"
    },
    {
      file: "classes-detailed.json",
      desc: "7 classes avec skills, progression, corruption paths",
      format: "Game-ready data"
    },
    {
      file: "cage-trials.json",
      desc: "16 cages avec dialogue, choices, consequences",
      format: "Event system data"
    },
    {
      file: "bestiary-game.json",
      desc: "Tous ennemis avec stats + lore + behaviors",
      format: "Combat system data"
    },
    {
      file: "dialogue-database.json",
      desc: "Tous les dialogues NPCs, gods, endings",
      format: "Narrative system data"
    }
  ],

  // 🎮 PUIS RETOUR GAMEPLAY
  afterLore: [
    "Phase 6: RNG Maîtrisable (dice manipulation system)",
    "Phase 7: Tutoriel (teach players the systems)",
    "Integration finale: connecter lore + gameplay"
  ]
};
```

---

## 🎬 CONCLUSION

**THE LAST COVENANT** n'est pas un jeu avec une histoire.
**C'est une histoire qui se joue.**

Chaque système émerge de la lore.
Chaque mécanique raconte.
Chaque chiffre signifie.

Le RNG n'est pas aléatoire - c'est Thalys qui observe.
La corruption n'est pas une barre - c'est ta transformation.
Les ennemis ne sont pas des obstacles - ce sont des victimes.
Les choix ne sont pas binaires - ils sont impossibles.

Et à la fin...
**C'est toi qui décides ce que signifie être humain.**

---

*Généré avec obsession par Claude Sonnet 4.5*
*Pour un jeu qui mérite d'exister.*
*THE LAST COVENANT - GOTY 2026*

