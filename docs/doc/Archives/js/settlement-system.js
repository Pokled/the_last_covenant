/**
 * SETTLEMENT SYSTEM - Gestion de colonie
 * NPCs, ressources, production, expansion du camp
 */

class SettlementSystem {
  constructor() {
    this.resources = {
      food: 100,        // Nourriture
      wood: 50,         // Bois
      materials: 30,    // Matériaux (fer, pierre)
      souls: 0          // Âmes récupérées (monnaie rare)
    };

    this.npcs = [];      // NPCs recrutés
    this.buildings = {   // Bâtiments construits
      tents: 3,
      fields: 0,
      lumberyard: 0,
      scavenger_post: 0,
      barracks: 0
    };

    this.dailyProduction = {
      food: 0,
      wood: 0,
      materials: 0
    };

    this.dailyConsumption = {
      food: 0  // NPCs consomment de la nourriture
    };
  }

  /**
   * Types de métiers disponibles
   */
  static JOBS = {
    FARMER: {
      id: 'farmer',
      name: 'Cultivateur',
      icon: '🌾',
      description: 'Cultive champignons, racines, moisissures. Produit de la nourriture.',
      produces: { food: 5 },
      consumes: {},
      requiredBuilding: 'fields'
    },
    LUMBERJACK: {
      id: 'lumberjack',
      name: 'Bûcheron',
      icon: '🪓',
      description: 'Coupe du bois dans les ruines. Dangereux mais nécessaire.',
      produces: { wood: 3 },
      consumes: {},
      requiredBuilding: 'lumberyard'
    },
    SCAVENGER: {
      id: 'scavenger',
      name: 'Charognard',
      icon: '🦴',
      description: 'Fouille les cadavres, récupère matériaux et nourriture pourrie.',
      produces: { food: 2, materials: 2 },
      consumes: {},
      requiredBuilding: 'scavenger_post'
    },
    WARRIOR: {
      id: 'warrior',
      name: 'Guerrier',
      icon: '⚔️',
      description: 'Accompagne en donjon. Combat aux côtés du Pactisé.',
      produces: {},
      consumes: {},
      requiredBuilding: 'barracks'
    },
    IDLE: {
      id: 'idle',
      name: 'Sans Tâche',
      icon: '💤',
      description: 'Ne fait rien. Ne produit rien. Consomme quand même.',
      produces: {},
      consumes: {}
    }
  };

  /**
   * Motivations des NPCs
   */
  static MOTIVATIONS = {
    CONVICTION: {
      id: 'conviction',
      name: 'Conviction',
      icon: '✊',
      description: 'Croit en la mission. Loyal. Productif.',
      productivityBonus: 1.2,
      moraleResistance: 0.8
    },
    FAITH: {
      id: 'faith',
      name: 'Foi',
      icon: '🙏',
      description: 'Te vénère comme un prophète. Fanatique. Dangereux si corrompus.',
      productivityBonus: 1.5,
      moraleResistance: 0.5,
      corruptionSensitive: true
    },
    FEAR: {
      id: 'fear',
      name: 'Peur',
      icon: '😰',
      description: 'Te craint. Obéit. Peut fuir si moral trop bas.',
      productivityBonus: 0.9,
      moraleResistance: 1.3,
      deserterRisk: true
    },
    OPPORTUNISM: {
      id: 'opportunism',
      name: 'Opportunisme',
      icon: '💰',
      description: 'Ici pour survivre. Pragmatique. Peut trahir si meilleure offre.',
      productivityBonus: 1.0,
      moraleResistance: 1.0,
      betrayalRisk: true
    },
    DESPAIR: {
      id: 'despair',
      name: 'Désespoir',
      icon: '💀',
      description: 'N\'a plus rien à perdre. Imprévisible. Productivité erratique.',
      productivityBonus: 0.7,
      moraleResistance: 1.5,
      unstable: true
    }
  };

  /**
   * Créer un NPC avec stats aléatoires
   */
  createNPC(options = {}) {
    const motivations = Object.values(SettlementSystem.MOTIVATIONS);
    const motivation = options.motivation || motivations[Math.floor(Math.random() * motivations.length)];

    const npc = {
      id: `npc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: options.name || this.generateNPCName(),
      job: SettlementSystem.JOBS.IDLE,
      motivation: motivation,
      stats: {
        hp: options.hp || (50 + Math.floor(Math.random() * 50)),
        maxHp: options.maxHp || 100,
        atk: options.atk || (5 + Math.floor(Math.random() * 10)),
        def: options.def || (3 + Math.floor(Math.random() * 7))
      },
      morale: options.morale || (50 + Math.floor(Math.random() * 50)),
      corruption: options.corruption || 0,
      productivity: 1.0,
      daysInCamp: 0,
      backstory: options.backstory || this.generateBackstory(motivation)
    };

    return npc;
  }

  /**
   * Générer nom aléatoire
   */
  generateNPCName() {
    const prefixes = ['Kael', 'Dren', 'Syr', 'Mor', 'Val', 'Thal', 'Nyx', 'Ael', 'Vor', 'Ras'];
    const suffixes = ['is', 'or', 'eth', 'an', 'yn', 'ix', 'us', 'ia', 'os', 'ar'];
    return prefixes[Math.floor(Math.random() * prefixes.length)] +
           suffixes[Math.floor(Math.random() * suffixes.length)];
  }

  /**
   * Générer backstory selon motivation
   */
  generateBackstory(motivation) {
    const stories = {
      conviction: [
        "« Les Sept nous ont abandonnés. Toi ? Tu nous donnes un espoir. »",
        "« J'ai vu ma famille mourir. Je refuse de rester immobile. »",
        "« Si tu cherches la Sortie, alors je te suis. Jusqu'au bout. »"
      ],
      faith: [
        "« Le Dé m'a parlé. Il m'a dit de te suivre. Tu es l'Élu. »",
        "« Tes yeux brillent d'une lumière divine. Je crois en toi. »",
        "« Tu es le Huitième. Je le sais. Je le sens. »"
      ],
      fear: [
        "« Ne me tue pas. S'il te plaît. Je... je ferai ce que tu veux. »",
        "« Tu es terrifiant. Mais dehors, c'est pire. Alors je reste. »",
        "« J'obéis. C'est tout. Pose pas de questions. »"
      ],
      opportunism: [
        "« Tu offres nourriture et abri ? Je signe. Affaires sont affaires. »",
        "« Seul, je meurs. Avec toi, peut-être je survis. Calcul simple. »",
        "« Tu me protèges, je bosse. Deal équitable. »"
      ],
      despair: [
        "« Tout est fini. Alors autant mourir utile, non ? »",
        "« J'ai déjà perdu tout ce qui comptait. Qu'est-ce que j'ai à perdre ? »",
        "« La mort me cherche. Autant lui compliquer la tâche. »"
      ]
    };

    const motivationStories = stories[motivation.id] || stories.despair;
    return motivationStories[Math.floor(Math.random() * motivationStories.length)];
  }

  /**
   * Recruter un NPC
   */
  recruitNPC(npc) {
    this.npcs.push(npc);
    this.updateConsumption();
    return true;
  }

  /**
   * Assigner un travail à un NPC
   */
  assignJob(npcId, jobId) {
    const npc = this.npcs.find(n => n.id === npcId);
    if (!npc) return false;

    const job = Object.values(SettlementSystem.JOBS).find(j => j.id === jobId);
    if (!job) return false;

    // Vérifier si bâtiment requis existe
    if (job.requiredBuilding && this.buildings[job.requiredBuilding] === 0) {
      return { success: false, error: 'Bâtiment requis non construit' };
    }

    npc.job = job;
    this.updateProduction();
    return { success: true };
  }

  /**
   * Calculer production quotidienne
   */
  updateProduction() {
    this.dailyProduction = { food: 0, wood: 0, materials: 0 };

    this.npcs.forEach(npc => {
      if (npc.job.produces) {
        const motivationBonus = npc.motivation.productivityBonus || 1.0;
        const productivityMultiplier = npc.productivity * motivationBonus;

        Object.entries(npc.job.produces).forEach(([resource, amount]) => {
          this.dailyProduction[resource] = (this.dailyProduction[resource] || 0) +
                                           (amount * productivityMultiplier);
        });
      }
    });
  }

  /**
   * Calculer consommation quotidienne
   */
  updateConsumption() {
    // Chaque NPC consomme 2 nourriture/jour
    this.dailyConsumption.food = this.npcs.length * 2;
  }

  /**
   * Simuler une journée (tick quotidien)
   */
  simulateDay() {
    // Production
    Object.entries(this.dailyProduction).forEach(([resource, amount]) => {
      this.resources[resource] += Math.floor(amount);
    });

    // Consommation
    Object.entries(this.dailyConsumption).forEach(([resource, amount]) => {
      this.resources[resource] -= amount;
    });

    // Vérifier famine
    if (this.resources.food < 0) {
      this.handleStarvation();
    }

    // Vieillissement des NPCs
    this.npcs.forEach(npc => {
      npc.daysInCamp++;

      // Moral évolue selon motivation
      if (npc.motivation.unstable) {
        npc.morale += Math.floor(Math.random() * 20) - 10; // ±10
      } else {
        npc.morale += Math.floor(Math.random() * 6) - 3; // ±3
      }

      npc.morale = Math.max(0, Math.min(100, npc.morale));
    });

    return {
      produced: this.dailyProduction,
      consumed: this.dailyConsumption,
      resources: this.resources,
      events: this.checkRandomEvents()
    };
  }

  /**
   * Gérer la famine
   */
  handleStarvation() {
    // Moral chute drastiquement
    this.npcs.forEach(npc => {
      npc.morale -= 20;
      npc.productivity *= 0.8; // Faim = moins productif
    });

    // Risque de désertion ou mort
    const casualty = this.npcs.find(npc => npc.morale < 10);
    if (casualty) {
      this.npcs = this.npcs.filter(n => n.id !== casualty.id);
      return { type: 'death', npc: casualty, reason: 'starvation' };
    }

    this.resources.food = 0; // Plancher à 0
  }

  /**
   * Vérifier events aléatoires
   */
  checkRandomEvents() {
    const events = [];

    // Désertion (si peur + moral bas)
    this.npcs.forEach(npc => {
      if (npc.motivation.deserterRisk && npc.morale < 20 && Math.random() < 0.1) {
        events.push({
          type: 'desertion',
          npc: npc,
          message: `${npc.name} a fui dans la nuit. "Je ne peux plus... désolé."`
        });
        this.npcs = this.npcs.filter(n => n.id !== npc.id);
      }
    });

    // Révolte (si foi + corruption haute)
    const faithfulNPC = this.npcs.find(npc =>
      npc.motivation.corruptionSensitive && npc.corruption > 50
    );
    if (faithfulNPC && Math.random() < 0.05) {
      events.push({
        type: 'revolt',
        npc: faithfulNPC,
        message: `${faithfulNPC.name}: "Tu es corrompu ! Le prophète que je suivais est mort !"`
      });
    }

    return events;
  }

  /**
   * Construire un bâtiment
   */
  buildStructure(buildingType, cost) {
    // Vérifier ressources
    if (this.resources.wood < cost.wood || this.resources.materials < cost.materials) {
      return { success: false, error: 'Ressources insuffisantes' };
    }

    // Déduire coût
    this.resources.wood -= cost.wood;
    this.resources.materials -= cost.materials;

    // Construire
    this.buildings[buildingType] = (this.buildings[buildingType] || 0) + 1;

    return { success: true };
  }

  /**
   * Obtenir résumé de la colonie
   */
  getSummary() {
    return {
      population: this.npcs.length,
      resources: this.resources,
      production: this.dailyProduction,
      consumption: this.dailyConsumption,
      buildings: this.buildings,
      morale: Math.floor(this.npcs.reduce((sum, npc) => sum + npc.morale, 0) / (this.npcs.length || 1))
    };
  }
}

/**
 * CYCLE JOUR/NUIT
 * Basé sur l'exploration de donjons
 */
class DayNightSystem {
  constructor() {
    this.timeOfDay = 'morning'; // 'morning', 'afternoon', 'night'
    this.dayCount = 1;
    this.hour = 6; // 6h du matin au départ
    this.lastDungeonReturn = null;
  }

  /**
   * Avancer le temps (appelé quand on part en donjon)
   */
  advanceToAfternoon() {
    this.timeOfDay = 'afternoon';
    this.hour = 14;
  }

  /**
   * Retour de donjon = nuit tombée
   */
  returnFromDungeon() {
    this.timeOfDay = 'night';
    this.hour = 20;
    this.lastDungeonReturn = Date.now();
    return {
      timeOfDay: this.timeOfDay,
      shouldSimulate: true // Trigger simulation quotidienne
    };
  }

  /**
   * Se reposer = passer au jour suivant
   */
  rest() {
    this.dayCount++;
    this.timeOfDay = 'morning';
    this.hour = 6;
    return {
      newDay: this.dayCount,
      timeOfDay: this.timeOfDay
    };
  }

  /**
   * Obtenir infos sur le cycle actuel
   */
  getCurrentCycle() {
    return {
      timeOfDay: this.timeOfDay,
      dayCount: this.dayCount,
      hour: this.hour,
      canRest: this.timeOfDay === 'night'
    };
  }

  /**
   * Obtenir description narrative du moment
   */
  getTimeDescription() {
    const descriptions = {
      morning: {
        title: 'Aube',
        desc: 'Le soleil pâle se lève sur les ruines. Les NPCs sortent de leurs tentes. Une nouvelle journée de survie commence.',
        icon: '🌅'
      },
      afternoon: {
        title: 'Après-midi',
        desc: 'Le soleil décline. Les ombres s\'allongent. Le camp est calme, les travailleurs sont à leurs postes.',
        icon: '☀️'
      },
      night: {
        title: 'Nuit',
        desc: 'La nuit est tombée. Le feu central crépite. Les NPCs se rassemblent autour des flammes. Les ténèbres rôdent.',
        icon: '🌙'
      }
    };
    return descriptions[this.timeOfDay];
  }

  /**
   * Obtenir couleur du ciel selon l'heure
   */
  getSkyColor() {
    const colors = {
      morning: {
        top: 'rgba(135, 180, 210, 0.3)',
        bottom: 'rgba(255, 200, 150, 0.2)',
        ambient: 0.8
      },
      afternoon: {
        top: 'rgba(100, 150, 200, 0.2)',
        bottom: 'rgba(180, 150, 120, 0.15)',
        ambient: 0.9
      },
      night: {
        top: 'rgba(10, 15, 30, 0.7)',
        bottom: 'rgba(30, 20, 40, 0.5)',
        ambient: 0.4,
        stars: true
      }
    };
    return colors[this.timeOfDay];
  }
}

// Export
window.SettlementSystem = SettlementSystem;
window.DayNightSystem = DayNightSystem;
