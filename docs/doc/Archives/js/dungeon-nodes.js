/**
 * 🏰 SYSTÈME DE DONJON À NŒUDS DE DESTIN
 * THE LAST COVENANT
 *
 * Système non-linéaire basé sur les états du joueur
 * Compatible avec Momentum + Pacte + Corruption
 *
 * FICHIER TEST - N'affecte PAS le système actuel (dungeon.js)
 */

class NodeBasedDungeon {
  constructor() {
    this.segments = this.defineSegments();
    this.nodes = this.defineNodes();
    this.phantomPaths = this.definePhantomPaths();

    console.log('🏰 NodeBasedDungeon initialisé');
    console.log(`  📦 ${Object.keys(this.segments).length} segments définis`);
    console.log(`  🔀 ${this.nodes.length} nœuds de destin`);
    console.log(`  👻 ${Object.keys(this.phantomPaths).length} chemins fantômes`);
  }

  // ═══════════════════════════════════════════════════════════════
  // DÉFINITION DES SEGMENTS
  // ═══════════════════════════════════════════════════════════════

  defineSegments() {
    return {
      // ────────────────────────────────────────────────────────────
      // SEGMENT INITIAL - Route Commune (Cases 1-8)
      // ────────────────────────────────────────────────────────────
      COMMON_START: {
        name: "L'Entrée des Damnés",
        tiles: [
          { type: 'entrance', name: 'Porte du Donjon', description: 'Le seuil entre deux mondes.' },
          { type: 'path', name: 'Corridor Sombre' },
          { type: 'path', name: 'Corridor Sombre' },
          { type: 'event', eventType: 'minor', name: 'Murmure Étrange', description: 'Tu entends des voix...' },
          { type: 'path', name: 'Corridor Sombre' },
          { type: 'event', eventType: 'temptation', name: 'Tentation', description: 'Un artefact scintille dans l\'ombre. L\'accepter augmente ta corruption.' },
          { type: 'path', name: 'Corridor Sombre' },
          { type: 'path', name: 'Approche du Carrefour' }
        ],
        length: 8,
        avgDifficulty: 'easy'
      },

      // ────────────────────────────────────────────────────────────
      // SEGMENT A - La Vieille Route (Safe mais lente)
      // ────────────────────────────────────────────────────────────
      SEGMENT_A: {
        name: "La Vieille Route",
        description: "Un chemin pavé ancien. Sûr, mais long et ennuyeux.",
        color: '#6a7080', // Gris clair
        tiles: [
          { type: 'path', name: 'Pavé Ancien', safe: true },
          { type: 'path', name: 'Pavé Ancien', safe: true },
          { type: 'event', eventType: 'rest', name: 'Fontaine Apaisante', description: 'Récupère 10 HP.' },
          { type: 'path', name: 'Pavé Ancien', safe: true },
          { type: 'path', name: 'Pavé Ancien', safe: true }
        ],
        length: 5,
        avgDifficulty: 'very_easy',
        rewards: 'low',
        thematic: 'safety'
      },

      // ────────────────────────────────────────────────────────────
      // SEGMENT B - Le Défilé des Os (Court mais dangereux)
      // ────────────────────────────────────────────────────────────
      SEGMENT_B: {
        name: "Le Défilé des Os",
        description: "Un passage étroit jonché d'ossements. Dangereux mais rapide.",
        color: '#a89060', // Beige/Os
        tiles: [
          { type: 'combat', name: 'Embuscade de Goules', difficulty: 'hard', enemyCount: 3 },
          { type: 'heal', name: 'Charnier Instable', unstable: true, description: 'Soigne 20 HP... ou inflige 10 dégâts.' },
          { type: 'dice_roll', name: 'Jet Critique', critical: true, description: 'Échec = -15 HP, Réussite = +1 objet rare' }
        ],
        length: 3,
        avgDifficulty: 'hard',
        rewards: 'medium',
        thematic: 'urgency'
      },

      // ────────────────────────────────────────────────────────────
      // SEGMENT C - Le Sentier Profané (Corrompu)
      // ────────────────────────────────────────────────────────────
      SEGMENT_C: {
        name: "Le Sentier Profané",
        description: "Un chemin corrompu où Thalys règne. Rentable... mais à quel prix ?",
        color: '#8b1a1a', // Rouge/Corruption
        tiles: [
          { type: 'pact', name: 'Pacte Obligatoire', mandatory: true, description: 'Thalys exige un Pacte. Refuser = combat impossible.' },
          { type: 'risk_loop', name: 'Boucle de Risque', description: 'Reste ici pour farmer... mais +5% corruption/tour.', maxTurns: 3 },
          { type: 'artifact', name: 'Artefact Maudit', cursed: true, description: 'Objet puissant mais +10% corruption permanente.' },
          { type: 'path', name: 'Chemin Sombre', corruption: 2 }
        ],
        length: 4,
        avgDifficulty: 'medium',
        rewards: 'high',
        thematic: 'corruption'
      },

      // ────────────────────────────────────────────────────────────
      // SEGMENT INTERMÉDIAIRE - Reconvergence (Cases 13-17)
      // ────────────────────────────────────────────────────────────
      COMMON_MID: {
        name: "La Galerie Altérée",
        tiles: [
          { type: 'path', name: 'Galerie' },
          { type: 'event', eventType: 'corruption_check', name: 'Miroir du Destin', description: 'Event varie selon ta corruption.' },
          { type: 'path', name: 'Galerie' },
          { type: 'dice_roll', name: 'Jet Modifiable', description: 'Momentum et Pacte disponibles ici.' },
          { type: 'path', name: 'Galerie' }
        ],
        length: 5,
        avgDifficulty: 'medium'
      },

      // ────────────────────────────────────────────────────────────
      // SEGMENT D - Le Chemin du Poids (Allègement)
      // ────────────────────────────────────────────────────────────
      SEGMENT_D: {
        name: "Le Chemin du Poids",
        description: "Un passage où tu peux abandonner ton fardeau.",
        color: '#8a7a60', // Brun
        tiles: [
          { type: 'event', eventType: 'drop_item', name: 'Autel du Sacrifice', description: 'Sacrifie 1 objet pour -20% fardeau.' },
          { type: 'path', name: 'Chemin Léger', safe: true },
          { type: 'path', name: 'Chemin Léger', safe: true },
          { type: 'event', eventType: 'rest', name: 'Camp Abandonné' }
        ],
        length: 4,
        avgDifficulty: 'easy',
        rewards: 'low',
        thematic: 'relief'
      },

      // ────────────────────────────────────────────────────────────
      // SEGMENT E - La Spirale du Hasard (Boucle farming)
      // ────────────────────────────────────────────────────────────
      SEGMENT_E: {
        name: "La Spirale du Hasard",
        description: "Une boucle semi-fermée. Tu peux farmer... mais tes dés empirent.",
        color: '#6a4a8a', // Violet
        tiles: [
          { type: 'risk_loop', name: 'Spirale Temporelle', canExit: true, description: 'Farm ici, mais -1 aux jets de dé par tour.' },
          { type: 'treasure', name: 'Coffre Piégé', difficulty: 'medium' },
          { type: 'combat', name: 'Gardien de la Spirale', difficulty: 'medium' },
          { type: 'event', eventType: 'escape', name: 'Sortie de Spirale', description: 'Coût : 1 objet ou -10 HP.' }
        ],
        length: 4,
        avgDifficulty: 'medium',
        rewards: 'very_high',
        thematic: 'greed'
      },

      // ────────────────────────────────────────────────────────────
      // SEGMENT F - La Voie Claire (Équilibrée)
      // ────────────────────────────────────────────────────────────
      SEGMENT_F: {
        name: "La Voie Claire",
        description: "Un passage équilibré. Rien de spectaculaire, parfait pour préparer le boss.",
        color: '#7a8a9a', // Gris bleu
        tiles: [
          { type: 'path', name: 'Corridor' },
          { type: 'combat', name: 'Combat Modéré', difficulty: 'medium' },
          { type: 'treasure', name: 'Coffre Standard' },
          { type: 'path', name: 'Corridor' }
        ],
        length: 4,
        avgDifficulty: 'medium',
        rewards: 'medium',
        thematic: 'balance'
      },

      // ────────────────────────────────────────────────────────────
      // SEGMENT FINAL - Approche du Boss (Cases 22-25)
      // ────────────────────────────────────────────────────────────
      BOSS_APPROACH: {
        name: "L'Approche du Tyran",
        tiles: [
          { type: 'path', name: 'Salle Vide', description: 'Un silence oppressant.' },
          { type: 'event', eventType: 'boss_warning', name: 'Rugissement', description: 'Tu entends le boss au loin...' },
          { type: 'shop', name: 'Marchand Désespéré', description: 'Dernier achat avant le boss.' },
          { type: 'boss', name: 'BOSS FINAL', description: 'Le Tyran t\'attend.' }
        ],
        length: 4,
        avgDifficulty: 'boss'
      }
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // DÉFINITION DES NŒUDS DE DESTIN
  // ═══════════════════════════════════════════════════════════════

  defineNodes() {
    return [
      // ────────────────────────────────────────────────────────────
      // NŒUD 1 - Le Carrefour Brisé (Position 8)
      // ────────────────────────────────────────────────────────────
      {
        id: 'NODE_1',
        name: "🔀 Le Carrefour Brisé",
        position: 8,
        description: "Trois chemins s'ouvrent devant toi. Ton état détermine lequel tu empruntes.",

        // Fonction de résolution du nœud
        resolve: (player) => {
          // Priorité : Corruption > Vitalité > Défaut
          if (player.corruption >= 30) {
            return {
              segment: 'SEGMENT_C',
              reason: `Corruption ${player.corruption}% ≥ 30% → Sentier Profané`
            };
          }

          const vitalityPercent = (player.hp / player.maxHp) * 100;
          if (vitalityPercent <= 40) {
            return {
              segment: 'SEGMENT_B',
              reason: `HP ${player.hp}/${player.maxHp} (${Math.floor(vitalityPercent)}%) ≤ 40% → Défilé des Os`
            };
          }

          return {
            segment: 'SEGMENT_A',
            reason: 'État équilibré → Vieille Route'
          };
        },

        // Visualisation des chemins possibles
        paths: [
          {
            segment: 'SEGMENT_A',
            name: 'La Vieille Route',
            condition: 'Par défaut (État équilibré)',
            conditionShort: 'Défaut',
            color: '#4A90E2',
            icon: '🛡️',
            preview: 'Safe mais lent • +10 HP • Faibles récompenses'
          },
          {
            segment: 'SEGMENT_B',
            name: 'Le Défilé des Os',
            condition: 'HP ≤ 40%',
            conditionShort: 'HP ≤ 40%',
            color: '#F5A623',
            icon: '⚡',
            preview: 'Rapide mais dangereux • 3 cases • Risque élevé'
          },
          {
            segment: 'SEGMENT_C',
            name: 'Le Sentier Profané',
            condition: 'Corruption ≥ 30%',
            conditionShort: 'Corruption ≥ 30%',
            color: '#D0021B',
            icon: '💀',
            preview: 'Rentable mais corrupteur • Pacte obligatoire • Artefacts maudits'
          }
        ]
      },

      // ────────────────────────────────────────────────────────────
      // NŒUD 2 - Le Jugement du Dé (Position 18)
      // ────────────────────────────────────────────────────────────
      {
        id: 'NODE_2',
        name: "🎲 Le Jugement du Dé",
        position: 18,
        description: "Thalys évalue ta relation avec le hasard.",

        resolve: (player) => {
          // Momentum = échecs récents
          const momentum = player.momentum || 0;

          if (momentum >= 2) {
            return {
              segment: 'SEGMENT_E',
              reason: `Momentum ${momentum}/3 ≥ 2 → Spirale du Hasard (farming obligatoire)`
            };
          }

          // Fardeau = nombre d'objets (compatible avec tableau ou objet)
          const burden = player.inventory ? 
            (Array.isArray(player.inventory) ? player.inventory.length : (player.inventory.items?.length || 0)) 
            : 0;
          if (burden >= 5) {
            return {
              segment: 'SEGMENT_D',
              reason: `Fardeau ${burden} objets ≥ 5 → Chemin du Poids (allègement)`
            };
          }

          return {
            segment: 'SEGMENT_F',
            reason: 'État équilibré → Voie Claire (préparation boss)'
          };
        },

        paths: [
          {
            segment: 'SEGMENT_D',
            name: 'Le Chemin du Poids',
            condition: 'Fardeau ≥ 5 objets',
            conditionShort: 'Fardeau ≥ 5',
            color: '#8B572A',
            icon: '⚖️',
            preview: 'Allègement • Sacrifice d\'objet • Repos'
          },
          {
            segment: 'SEGMENT_E',
            name: 'La Spirale du Hasard',
            condition: 'Momentum ≥ 2',
            conditionShort: 'Momentum ≥ 2',
            color: '#9013FE',
            icon: '🌀',
            preview: 'Boucle farming • Dés empirent • Sortie coûteuse'
          },
          {
            segment: 'SEGMENT_F',
            name: 'La Voie Claire',
            condition: 'Par défaut',
            conditionShort: 'Défaut',
            color: '#50E3C2',
            icon: '✨',
            preview: 'Équilibrée • Préparation boss • Coffre standard'
          }
        ]
      }
    ];
  }

  // ═══════════════════════════════════════════════════════════════
  // CHEMINS FANTÔMES (Secrets)
  // ═══════════════════════════════════════════════════════════════

  definePhantomPaths() {
    return {
      // Chemin secret 1 : L'Étreinte de Thalys
      PHANTOM_THALYS: {
        name: "L'Étreinte de Thalys",
        description: "Un raccourci vers le boss... si tu oses fusionner avec le Dé.",
        unlockCondition: (player) => {
          return player.pactsSigned >= 3 && player.corruption >= 60;
        },
        tiles: [
          { type: 'event', eventType: 'fusion', name: 'Fusion avec Thalys', description: 'Le Dé fusionne temporairement avec toi.' },
          { type: 'path', name: 'Couloir Distordu', corruption: 5 },
          { type: 'boss', name: 'BOSS (Empowered)', description: 'Tu es puissant... mais si tu perds, game over immédiat.' }
        ],
        rewards: 'extreme',
        risk: 'extreme'
      },

      // Chemin secret 2 : La Voie du Pur
      PHANTOM_PURE: {
        name: "La Voie du Pur",
        description: "Un chemin lumineux n'apparaît que pour les incorrompus.",
        unlockCondition: (player) => {
          return player.corruption === 0 && player.diceStage >= 3;
        },
        tiles: [
          { type: 'event', eventType: 'blessing', name: 'Bénédiction Divine', description: '+20 HP, +2 à tous les jets de dé.' },
          { type: 'treasure', name: 'Coffre Sacré', rarity: 'legendary' },
          { type: 'path', name: 'Sanctuaire' }
        ],
        rewards: 'very_high',
        risk: 'very_low'
      }
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // GÉNÉRATION DU DUNGEON COMPLET
  // ═══════════════════════════════════════════════════════════════

  /**
   * Génère le donjon complet basé sur l'état du joueur
   * @param {Object} player - État du joueur (hp, maxHp, corruption, momentum, etc.)
   * @returns {Object} Donjon complet avec path, decisions, metadata
   */
  generate(player) {
    console.log('🏰 Génération du donjon basé sur état joueur:', player);

    const path = [];
    const decisions = []; // Historique des décisions de nœuds

    // ────────────────────────────────────────────────────────────
    // SEGMENT 1 : Route Commune (Cases 1-8)
    // ────────────────────────────────────────────────────────────
    path.push(...this.segments.COMMON_START.tiles);
    console.log(`  ✅ Segment COMMON_START (${this.segments.COMMON_START.length} cases)`);

    // ────────────────────────────────────────────────────────────
    // NŒUD 1 : Le Carrefour Brisé (Position 8)
    // ────────────────────────────────────────────────────────────
    const node1Decision = this.nodes[0].resolve(player);
    decisions.push({
      nodeId: this.nodes[0].id,
      nodeName: this.nodes[0].name,
      chosenSegment: node1Decision.segment,
      reason: node1Decision.reason,
      playerState: { hp: player.hp, maxHp: player.maxHp, corruption: player.corruption }
    });

    // Ajouter les tiles du segment avec leur couleur
    const segment1 = this.segments[node1Decision.segment];
    const segment1Tiles = segment1.tiles.map(tile => ({
      ...tile,
      segmentColor: segment1.color,
      segmentId: node1Decision.segment,
      segmentName: segment1.name
    }));
    path.push(...segment1Tiles);
    console.log(`  🔀 NŒUD 1: ${node1Decision.reason}`);
    console.log(`  ✅ Segment ${node1Decision.segment} (${segment1.length} cases) - Couleur: ${segment1.color}`);

    // ────────────────────────────────────────────────────────────
    // SEGMENT 2 : Reconvergence (Cases 13-17)
    // ────────────────────────────────────────────────────────────
    path.push(...this.segments.COMMON_MID.tiles);
    console.log(`  ✅ Segment COMMON_MID (${this.segments.COMMON_MID.length} cases)`);

    // ────────────────────────────────────────────────────────────
    // NŒUD 2 : Le Jugement du Dé (Position 18)
    // ────────────────────────────────────────────────────────────
    const node2Decision = this.nodes[1].resolve(player);
    decisions.push({
      nodeId: this.nodes[1].id,
      nodeName: this.nodes[1].name,
      chosenSegment: node2Decision.segment,
      reason: node2Decision.reason,
      playerState: { hp: player.hp, maxHp: player.maxHp, corruption: player.corruption, momentum: player.momentum }
    });

    // Ajouter les tiles du segment avec leur couleur
    const segment2 = this.segments[node2Decision.segment];
    const segment2Tiles = segment2.tiles.map(tile => ({
      ...tile,
      segmentColor: segment2.color,
      segmentId: node2Decision.segment,
      segmentName: segment2.name
    }));
    path.push(...segment2Tiles);
    console.log(`  🔀 NŒUD 2: ${node2Decision.reason}`);
    console.log(`  ✅ Segment ${node2Decision.segment} (${segment2.length} cases) - Couleur: ${segment2.color}`);

    // ────────────────────────────────────────────────────────────
    // SEGMENT FINAL : Approche du Boss (Cases 22-25)
    // ────────────────────────────────────────────────────────────
    path.push(...this.segments.BOSS_APPROACH.tiles);
    console.log(`  ✅ Segment BOSS_APPROACH (${this.segments.BOSS_APPROACH.length} cases)`);

    // ────────────────────────────────────────────────────────────
    // VÉRIFIER LES CHEMINS FANTÔMES
    // ────────────────────────────────────────────────────────────
    const unlockedPhantoms = [];
    for (const [key, phantom] of Object.entries(this.phantomPaths)) {
      if (phantom.unlockCondition(player)) {
        unlockedPhantoms.push({
          key,
          name: phantom.name,
          description: phantom.description
        });
        console.log(`  👻 Chemin Fantôme débloqué: ${phantom.name}`);
      }
    }

    // ────────────────────────────────────────────────────────────
    // RETOUR
    // ────────────────────────────────────────────────────────────
    const totalLength = path.length;
    console.log(`✅ Donjon généré: ${totalLength} cases totales`);

    return {
      path: path,
      decisions: decisions,
      phantomPaths: unlockedPhantoms,
      metadata: {
        totalLength: totalLength,
        nodeCount: this.nodes.length,
        segmentsUsed: [
          'COMMON_START',
          node1Decision.segment,
          'COMMON_MID',
          node2Decision.segment,
          'BOSS_APPROACH'
        ],
        playerState: player
      }
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // UTILS - VISUALISATION DES NŒUDS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Retourne les informations de visualisation pour un nœud
   * @param {string} nodeId - ID du nœud
   * @param {Object} player - État du joueur
   * @returns {Object} Infos pour afficher le nœud
   */
  getNodeVisualization(nodeId, player) {
    const node = this.nodes.find(n => n.id === nodeId);
    if (!node) return null;

    // Résoudre quel chemin sera pris
    const decision = node.resolve(player);

    // Retourner infos pour UI
    return {
      id: node.id,
      name: node.name,
      description: node.description,
      paths: node.paths.map(path => ({
        ...path,
        isActive: path.segment === decision.segment, // Highlight le chemin actif
        segmentData: this.segments[path.segment]
      })),
      activeSegment: decision.segment,
      reason: decision.reason
    };
  }

  /**
   * Simule plusieurs runs pour voir la variété
   * @param {number} count - Nombre de runs à simuler
   * @returns {Array} Résultats de simulation
   */
  simulateRuns(count = 10) {
    const results = [];

    for (let i = 0; i < count; i++) {
      // Créer un joueur avec stats aléatoires
      const player = {
        hp: 50 + Math.floor(Math.random() * 50),
        maxHp: 100,
        corruption: Math.floor(Math.random() * 100),
        momentum: Math.floor(Math.random() * 4),
        pactsSigned: Math.floor(Math.random() * 5),
        diceStage: 1 + Math.floor(Math.random() * 5),
        inventory: { items: Array(Math.floor(Math.random() * 10)).fill('item') }
      };

      const dungeon = this.generate(player);

      results.push({
        runId: i + 1,
        playerState: player,
        route: dungeon.decisions.map(d => d.chosenSegment).join(' → '),
        totalLength: dungeon.metadata.totalLength,
        phantomPaths: dungeon.phantomPaths.map(p => p.name)
      });
    }

    return results;
  }
}

// ═══════════════════════════════════════════════════════════════
// EXPORT GLOBAL
// ═══════════════════════════════════════════════════════════════

window.NodeBasedDungeon = NodeBasedDungeon;
console.log('✅ NodeBasedDungeon chargé (système de test)');
