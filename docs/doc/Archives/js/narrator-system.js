/**
 * NARRATOR SYSTEM - THE LAST COVENANT
 * La voix du Dé - Narrateur omniscient et sarcastique
 * Inspiré de Darkest Dungeon + Hades + Bastion
 */

class NarratorSystem {
  constructor() {
    this.enabled = true;
    this.volume = 1.0;
    this.currentCorruption = 0;
    this.narrationQueue = [];
    this.isNarrating = false;
    this.lastNarrationTime = 0;
    this.minTimeBetweenNarrations = 3000; // 3 secondes minimum

    // Historique pour éviter les répétitions
    this.recentNarrations = [];
    this.maxHistorySize = 20;
  }

  /**
   * Initialiser le narrateur
   */
  init() {
    console.log('🎙️ Narrator System - Initializing...');

    // Créer le conteneur de narration
    this.createNarrationUI();

    // Écouter les événements de corruption
    window.addEventListener('corruptionChanged', (e) => {
      this.currentCorruption = e.detail.newValue;
    });

    console.log('✅ Narrator System ready');
  }

  /**
   * Créer l'UI de narration
   */
  createNarrationUI() {
    const container = document.createElement('div');
    container.id = 'narratorContainer';
    container.className = 'narrator-container';
    container.innerHTML = `
      <div class="narrator-text" id="narratorText"></div>
      <div class="narrator-speaker" id="narratorSpeaker">Le Dé</div>
    `;
    document.body.appendChild(container);
  }

  /**
   * Raconter une narration
   * @param {string} text - Texte à narrer
   * @param {object} options - Options (category, priority, skipHistory)
   */
  narrate(text, options = {}) {
    if (!this.enabled) return;

    const {
      category = 'general',
      priority = 'normal',
      skipHistory = false,
      delay = 0
    } = options;

    // Vérifier si on a déjà narré ce texte récemment
    if (!skipHistory && this.recentNarrations.includes(text)) {
      console.log('🎙️ Skipping recent narration:', text);
      return;
    }

    // Ajouter à la queue
    const narration = {
      text,
      category,
      priority,
      timestamp: Date.now() + delay
    };

    if (priority === 'high') {
      this.narrationQueue.unshift(narration);
    } else {
      this.narrationQueue.push(narration);
    }

    // Ajouter à l'historique
    if (!skipHistory) {
      this.recentNarrations.push(text);
      if (this.recentNarrations.length > this.maxHistorySize) {
        this.recentNarrations.shift();
      }
    }

    // Démarrer la narration si pas déjà en cours
    if (!this.isNarrating) {
      this.processQueue();
    }
  }

  /**
   * Traiter la queue de narrations
   */
  async processQueue() {
    if (this.narrationQueue.length === 0) {
      this.isNarrating = false;
      return;
    }

    this.isNarrating = true;

    const now = Date.now();
    const timeSinceLastNarration = now - this.lastNarrationTime;

    // Attendre si trop tôt
    if (timeSinceLastNarration < this.minTimeBetweenNarrations) {
      const waitTime = this.minTimeBetweenNarrations - timeSinceLastNarration;
      await this.wait(waitTime);
    }

    const narration = this.narrationQueue.shift();

    // Vérifier si le délai est écoulé
    if (narration.timestamp > Date.now()) {
      await this.wait(narration.timestamp - Date.now());
    }

    // Afficher la narration
    await this.displayNarration(narration.text);

    this.lastNarrationTime = Date.now();

    // Continuer avec la suite
    this.processQueue();
  }

  /**
   * Afficher une narration à l'écran
   */
  async displayNarration(text) {
    const container = document.getElementById('narratorContainer');
    const textElement = document.getElementById('narratorText');
    const speakerElement = document.getElementById('narratorSpeaker');

    if (!container || !textElement) return;

    // Adapter le speaker selon la corruption
    const speaker = this.getSpeakerName();
    speakerElement.textContent = speaker;

    // Appliquer le style selon la corruption
    this.applyCorruptionStyle(container);

    // Afficher le texte avec effet de typing
    textElement.textContent = '';
    container.classList.add('active');

    await this.typeText(textElement, text);

    // Jouer le son
    this.playNarrationSound();

    // Garder visible 4 secondes + temps de lecture
    const readingTime = Math.max(4000, text.length * 50);
    await this.wait(readingTime);

    // Masquer
    container.classList.remove('active');
    await this.wait(500);
  }

  /**
   * Effet de typing
   */
  async typeText(element, text, speed = 30) {
    for (let i = 0; i < text.length; i++) {
      element.textContent += text[i];
      await this.wait(speed);
    }
  }

  /**
   * Obtenir le nom du speaker selon la corruption
   */
  getSpeakerName() {
    if (this.currentCorruption < 25) {
      return 'Le Dé';
    } else if (this.currentCorruption < 50) {
      return 'Le Dé... ?';
    } else if (this.currentCorruption < 75) {
      return 'La Voix';
    } else {
      return 'Ton Frère';
    }
  }

  /**
   * Appliquer le style selon la corruption
   */
  applyCorruptionStyle(container) {
    container.classList.remove('pure', 'tainted', 'corrupted', 'abyssal');

    if (this.currentCorruption < 25) {
      container.classList.add('pure');
    } else if (this.currentCorruption < 50) {
      container.classList.add('tainted');
    } else if (this.currentCorruption < 75) {
      container.classList.add('corrupted');
    } else {
      container.classList.add('abyssal');
    }
  }

  /**
   * Jouer le son de narration
   */
  playNarrationSound() {
    if (window.AudioManager && window.AudioManager.playSFX) {
      window.AudioManager.playSFX('narrator_speak', this.volume);
    }
  }

  /**
   * Attendre un délai
   */
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Raconter l'intro du jeu
   */
  narrateGameStart(playerClass) {
    const intros = {
      SHATTERED_KNIGHT: [
        "Ah. Un chevalier. Comme c'est... noble.",
        "Ton roi est mort il y a 200 ans. Tu le sais, n'est-ce pas ?",
        "Pourtant, te voilà. Fidèle jusqu'à la fin."
      ],
      WITCH_OF_ASHES: [
        "Une sorcière. Combien en as-tu brûlés ?",
        "400 âmes, m'a-t-on dit. Pour les 'sauver'.",
        "Voyons si tu pourras te sauver, toi."
      ],
      BLOOD_PACTBOUND: [
        "Un pacte de sang. Classique.",
        "Tu as vendu quelque chose que tu ne pourras jamais récupérer.",
        "Mais au moins, tu es honnête avec toi-même."
      ],
      HOLLOW_SHEPHERD: [
        "Tu guides les Hollows. Ironique.",
        "Car bientôt, qui te guidera quand tu seras vide ?",
        "Avançons. La nuit est jeune."
      ],
      SILKBOUND_FATE: [
        "Tisseuse de destins. Comme Sylthara.",
        "Elle est morte, tu sais. Dévorée.",
        "Ses fils dérivent sans elle. Tout comme les tiens."
      ],
      BROKEN_PROPHET: [
        "Ah, un prophète. Vyr serait fier.",
        "Dommage qu'il soit mort avant de voir son propre futur.",
        "Espérons que tu es plus... chanceux."
      ],
      UNCHAINED_JUDGE: [
        "Justice. Équilibre. Thalys enseignait cela.",
        "Sa balance a explosé. Ses morceaux gisent dans ces couloirs.",
        "Peut-être trouveras-tu ce qu'il a perdu."
      ]
    };

    const lines = intros[playerClass] || [
      "Te voilà donc.",
      "Un autre aventurier. Un autre sacrifice.",
      "Marchons ensemble vers l'inévitable."
    ];

    // Narrer chaque ligne avec un délai
    lines.forEach((line, index) => {
      this.narrate(line, {
        category: 'intro',
        delay: index * 6000,
        skipHistory: true
      });
    });
  }

  /**
   * Narrations sur événements spécifiques
   */

  narrateCombatStart(enemyCount) {
    const lines = [
      `${enemyCount} ennemis. Parfait. J'aime les paris équilibrés.`,
      "Voyons comment tu te débrouilles.",
      `${enemyCount} contre un. Les Dés sont lancés.`,
      "Combat. Enfin, un peu d'action.",
      "Montre-moi ce que tu vaux."
    ];

    this.narrate(this.pickRandom(lines), { category: 'combat' });
  }

  narrateCombatVictory(player) {
    if (player.hp < player.maxHp * 0.2) {
      const lines = [
        "Victoire... à quel prix ?",
        "Tu as survécu. À peine.",
        "Impressionnant. Mais tu saignes."
      ];
      this.narrate(this.pickRandom(lines), { category: 'combat' });
    } else {
      const lines = [
        "Bien joué.",
        "Victoire. Continue comme ça.",
        "Les Dieux morts observaient. Ils approuvent.",
        "Efficace."
      ];
      this.narrate(this.pickRandom(lines), { category: 'combat' });
    }
  }

  narrateCombatDefeat() {
    const lines = [
      "Ah. Dommage.",
      "C'était prévisible.",
      "Les Dés ont parlé. Et ils ont dit 'Non'.",
      "Peut-être la prochaine fois."
    ];

    this.narrate(this.pickRandom(lines), {
      category: 'defeat',
      priority: 'high'
    });
  }

  narrateLevelUp(level) {
    const lines = [
      `Niveau ${level}. Plus fort. Mais es-tu plus sage ?`,
      "Tu grandis. Intéressant.",
      `Niveau ${level}. Les Dieux morts te sentent grandir.`,
      "Plus puissant. Mais à quel prix ?"
    ];

    this.narrate(this.pickRandom(lines), { category: 'levelup' });
  }

  narrateCorruptionThreshold(threshold) {
    const messages = {
      tainted: [
        "Je te sens changer.",
        "La corruption... elle t'appelle, n'est-ce pas ?",
        "Premier pas vers l'abîme. Comment te sens-tu ?"
      ],
      corrupted: [
        "Tu es des nôtres, maintenant.",
        "Regarde-toi. Reconnais-tu encore ton reflet ?",
        "La corruption t'a embrassé. Et tu as accepté."
      ],
      abyssal: [
        "Bienvenue, frère.",
        "Tu es magnifique. Enfin libre.",
        "Le vide te regarde. Et tu lui souris."
      ]
    };

    const lines = messages[threshold];
    if (lines) {
      this.narrate(this.pickRandom(lines), {
        category: 'corruption',
        priority: 'high'
      });
    }
  }

  narrateItemFound(itemRarity) {
    const messages = {
      common: [
        "Quelque chose. Mieux que rien.",
        "Utile. Peut-être."
      ],
      uncommon: [
        "Intéressant.",
        "Pas mal. Les Dés sourient."
      ],
      rare: [
        "Oho. Les Dieux te favorisent.",
        "Précieux. Garde-le bien."
      ],
      epic: [
        "Incroyable. Un trésor.",
        "Les Dieux morts t'offrent un cadeau."
      ],
      legendary: [
        "MAGNIFIQUE. Tu sens le pouvoir ?",
        "Les légendes deviennent réelles.",
        "Ce n'est pas le hasard. C'est le destin."
      ]
    };

    const lines = messages[itemRarity] || messages.common;
    this.narrate(this.pickRandom(lines), { category: 'loot' });
  }

  narrateDeath() {
    const lines = [
      "Et voilà. C'était inévitable.",
      "Les Dés ont roulé pour la dernière fois.",
      "Tu rejoins les Sept. Dors bien.",
      "Fin. Ou... recommencement ?",
      "Noxar t'accueille. Il est mort aussi, au fait."
    ];

    this.narrate(this.pickRandom(lines), {
      category: 'death',
      priority: 'high'
    });
  }

  narrateBossEncounter(bossName) {
    this.narrate(`${bossName}. Enfin, un défi digne de ce nom.`, {
      category: 'boss',
      priority: 'high'
    });
  }

  narrateRest() {
    const lines = [
      "Repos. Sage décision.",
      "Repose-toi. La route est longue.",
      "Un moment de paix. Rare dans ces couloirs.",
      "Ferme les yeux. Je veille."
    ];

    this.narrate(this.pickRandom(lines), { category: 'rest' });
  }

  narrateMerchant() {
    const lines = [
      "Un marchand. Combien donneras-tu pour survivre ?",
      "L'or ou la vie ? Choisis sagement.",
      "Les marchands sentent la mort. Ils vendent l'espoir."
    ];

    this.narrate(this.pickRandom(lines), { category: 'merchant' });
  }

  narrateTreasure() {
    const lines = [
      "Un coffre. Qu'y trouveras-tu ? Espoir ou ruine ?",
      "Ouvre-le. J'adore les surprises.",
      "Les trésors ont toujours un prix."
    ];

    this.narrate(this.pickRandom(lines), { category: 'treasure' });
  }

  narrateTrap() {
    const lines = [
      "Oops.",
      "Je t'avais prévenu. Enfin, non.",
      "Les pièges font partie du jeu.",
      "Dommage. Sois plus prudent."
    ];

    this.narrate(this.pickRandom(lines), { category: 'trap' });
  }

  narrateRiddle() {
    const lines = [
      "Une énigme. Vyr adorait cela.",
      "Réfléchis bien. Ou lance le dé.",
      "Les énigmes révèlent l'âme."
    ];

    this.narrate(this.pickRandom(lines), { category: 'riddle' });
  }

  /**
   * Narrations ambiance aléatoires
   */
  narrateAmbient() {
    const ambient = [
      "Les couloirs murmurent.",
      "Sens-tu leur regard ?",
      "Quelque chose bouge dans l'ombre.",
      "Le silence ici n'est jamais vraiment silencieux.",
      "Avance. Ne regarde pas en arrière.",
      "Les Dieux morts ne dorment pas. Ils observent.",
      "Tu n'es pas seul ici."
    ];

    this.narrate(this.pickRandom(ambient), {
      category: 'ambient',
      priority: 'low'
    });
  }

  /**
   * Utilitaire : choisir aléatoirement
   */
  pickRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Activer/désactiver le narrateur
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    console.log(`🎙️ Narrator ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Régler le volume
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Nettoyer la queue
   */
  clearQueue() {
    this.narrationQueue = [];
    this.isNarrating = false;
  }
}

// ═══════════════════════════════════════════════════════
// GLOBAL INSTANCE
// ═══════════════════════════════════════════════════════

window.Narrator = new NarratorSystem();

// Auto-init on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.Narrator.init();
  });
} else {
  window.Narrator.init();
}
