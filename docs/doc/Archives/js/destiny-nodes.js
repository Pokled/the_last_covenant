/**
 * 🔮 DESTINY NODES SYSTEM - THE LAST COVENANT
 * Système de Nœuds de Destin avec bifurcations basées sur les ÉTATS du joueur
 *
 * Inspiré de : IDEE_GENERATION_DONJON.md
 *
 * Principe fondamental :
 * Le joueur ne choisit PAS le chemin.
 * Il choisit quelle contrainte il accepte.
 * Le plateau reste linéaire en surface, mais non linéaire en conséquences.
 *
 * Fonctionnalités :
 * - 2 Nœuds de Destin : "Le Carrefour Brisé" + "Le Jugement du Dé"
 * - Segments alternatifs (A/B/C) basés sur stats
 * - Chemins Fantômes (débloqués par pactes)
 * - Résolution automatique selon états du joueur
 */

class DestinyNodesSystem {
  constructor() {
    this.nodes = this.getNodes();
    this.phantomPaths = this.getPhantomPaths();

    console.log('🔮 DestinyNodesSystem initialisé');
  }

  // ═══════════════════════════════════════════════════════════════
  // DÉFINITION DES NŒUDS
  // ═══════════════════════════════════════════════════════════════

  getNodes() {
    return [
      {
        id: 'node_1',
        name: 'Le Carrefour Brisé',
        icon: '⚔️',
        description: 'Trois chemins s\'ouvrent devant toi. Ton destin choisira pour toi.',
        flavorText: '"Le Carrefour se souvient de tous ceux qui sont passés. Et il se souvient surtout de ceux qui n\'en sont jamais revenus."',
        position: 8, // Position dans le path (après ~8 cases)

        // Fonction de résolution du nœud
        resolve: (player) => {
          // SEGMENT C : Sentier Profané (Corruption ≥ 30%)
          if (player.corruption >= 30) {
            return {
              segment: 'C',
              name: 'Sentier Profané',
              reason: `Ta corruption (${player.corruption}%) t'attire vers les ténèbres...`,
              style: 'corrupted' // Style visuel du segment
            };
          }

          // SEGMENT B : Défilé des Os (HP ≤ 40%)
          if (player.hp / player.maxHp <= 0.4) {
            return {
              segment: 'B',
              name: 'Défilé des Os',
              reason: `Tes blessures (${player.hp}/${player.maxHp} HP) te forcent sur le chemin désespéré...`,
              style: 'desperate'
            };
          }

          // SEGMENT A : Vieille Route (Safe)
          return {
            segment: 'A',
            name: 'Vieille Route',
            reason: 'Le chemin sûr s\'ouvre à toi. Ennuyeux, mais prudent.',
            style: 'safe'
          };
        },

        // Segments disponibles
        segments: {
          A: {
            id: 'carrefour_a',
            name: 'Vieille Route',
            length: 4, // 4 cases
            description: 'Un chemin pavé ancien. Sûr mais lent.',
            tileTypes: ['corridor', 'corridor', 'event', 'corridor'],
            color: '#6a7080', // Gris clair
            features: {
              safe: true,
              slow: true,
              rewards: 'low'
            }
          },

          B: {
            id: 'carrefour_b',
            name: 'Défilé des Os',
            length: 3, // 3 cases (plus court)
            description: 'Un passage jonché d\'ossements. Dangereux mais rapide.',
            tileTypes: ['combat', 'trap', 'chest'],
            color: '#a89060', // Beige/Os
            features: {
              dangerous: true,
              fast: true,
              rewards: 'medium'
            }
          },

          C: {
            id: 'carrefour_c',
            name: 'Sentier Profané',
            length: 4,
            description: 'Un chemin tortueux marqué par la corruption.',
            tileTypes: ['pact_offer', 'corridor', 'corruption_zone', 'chest'],
            color: '#8b1a1a', // Rouge/Corruption
            features: {
              corrupting: true,
              rewarding: true,
              rewards: 'high'
            }
          }
        }
      },

      {
        id: 'node_2',
        name: 'Le Jugement du Dé',
        icon: '🎲',
        description: 'Le Dé du Destin te juge. Ton fardeau et ta chance parlent pour toi.',
        flavorText: '"Nous avons tous lancé les dés. Certains ont gagné. Certains ont perdu. Et certains... certains ont découvert que les dés étaient pipés depuis le début."',
        position: 18, // Position dans le path

        resolve: (player) => {
          // SEGMENT E : Spirale du Hasard (Momentum ≥ 2)
          if (player.momentum >= 2) {
            return {
              segment: 'E',
              name: 'Spirale du Hasard',
              reason: `Ton momentum (${player.momentum}) te pousse vers le chaos...`,
              style: 'chaotic'
            };
          }

          // SEGMENT D : Chemin du Poids (Fardeau ≥ 3 items)
          const burdenCount = player.inventory?.items?.length || 0;
          if (burdenCount >= 3) {
            return {
              segment: 'D',
              name: 'Chemin du Poids',
              reason: `Ton fardeau (${burdenCount} objets) t'alourdit...`,
              style: 'heavy'
            };
          }

          // SEGMENT F : Voie Claire (Défaut)
          return {
            segment: 'F',
            name: 'Voie Claire',
            reason: 'Un chemin équilibré s\'ouvre. Ni trop facile, ni trop dur.',
            style: 'balanced'
          };
        },

        segments: {
          D: {
            id: 'jugement_d',
            name: 'Chemin du Poids',
            length: 5,
            description: 'Lent mais soulageant. Allège ton fardeau.',
            tileTypes: ['corridor', 'merchant', 'rest', 'corridor', 'corridor'],
            color: '#8a7a60',
            features: {
              slow: true,
              relieving: true,
              rewards: 'low'
            }
          },

          E: {
            id: 'jugement_e',
            name: 'Spirale du Hasard',
            length: 4,
            description: 'Une boucle chaotique. Farming possible mais risqué.',
            tileTypes: ['chest', 'combat', 'trap', 'chest'],
            color: '#6a4a8a', // Violet (hasard)
            features: {
              loopable: true,
              chaotic: true,
              rewards: 'high'
            }
          },

          F: {
            id: 'jugement_f',
            name: 'Voie Claire',
            length: 4,
            description: 'Équilibrée. Parfaite pour préparer le boss.',
            tileTypes: ['corridor', 'event', 'corridor', 'corridor'],
            color: '#7a8a9a',
            features: {
              balanced: true,
              safe: true,
              rewards: 'medium'
            }
          }
        }
      }
    ];
  }

  // ═══════════════════════════════════════════════════════════════
  // CHEMINS FANTÔMES (Débloqués par pactes)
  // ═══════════════════════════════════════════════════════════════

  getPhantomPaths() {
    return [
      {
        id: 'phantom_thalys',
        name: 'L\'Étreinte de Thalys',
        icon: '💀',
        description: 'Un raccourci profane vers le boss. Mortel mais direct.',
        flavorText: '"Thalys offre sa miséricorde. Mais sa miséricorde... c\'est la mort rapide."',

        // Conditions de déblocage
        conditions: (player) => {
          return (
            player.pactsSigned >= 3 &&
            player.corruption >= 60
          );
        },

        // Position d'apparition (remplace un segment normal)
        appearsAt: 'node_1', // Apparaît au Nœud 1
        replacesSegment: 'C', // Remplace le Sentier Profané

        segment: {
          id: 'phantom_thalys_path',
          name: 'L\'Étreinte de Thalys',
          length: 2, // Très court (raccourci)
          description: 'Un raccourci sanglant. Direct mais mortel.',
          tileTypes: ['corruption_zone', 'boss_corridor'],
          color: '#3d0d0d', // Rouge très foncé
          features: {
            phantom: true,
            shortcut: true,
            deadly: true,
            rewards: 'none',
            corruptionGain: 20 // +20% corruption en le prenant
          }
        }
      },

      {
        id: 'phantom_pure',
        name: 'La Voie du Pur',
        icon: '✨',
        description: 'Un chemin lumineux accessible seulement aux âmes pures.',
        flavorText: '"Dans les ténèbres totales, les dieux morts laissent une dernière lueur. Suis-la... si tu peux."',

        conditions: (player) => {
          return (
            player.corruption === 0 &&
            player.diceStage >= 3 // Dé amélioré
          );
        },

        appearsAt: 'node_2',
        replacesSegment: 'F',

        segment: {
          id: 'phantom_pure_path',
          name: 'La Voie du Pur',
          length: 5,
          description: 'Bénédictions divines. Récompenses massives.',
          tileTypes: ['blessing', 'corridor', 'treasure', 'blessing', 'corridor'],
          color: '#f0e68c', // Doré clair (divin)
          features: {
            phantom: true,
            blessed: true,
            rewarding: true,
            rewards: 'legendary',
            corruptionBlock: true // Immunise à la corruption dans ce segment
          }
        }
      }
    ];
  }

  // ═══════════════════════════════════════════════════════════════
  // RÉSOLUTION D'UN NŒUD
  // ═══════════════════════════════════════════════════════════════

  /**
   * Résout un nœud et retourne le segment à prendre
   * @param {string} nodeId - ID du nœud (node_1, node_2)
   * @param {object} player - État du joueur
   * @returns {object} Résultat avec segment, raison, style
   */
  resolveNode(nodeId, player) {
    const node = this.nodes.find(n => n.id === nodeId);
    if (!node) {
      console.error(`❌ Nœud inconnu: ${nodeId}`);
      return null;
    }

    // Vérifier d'abord les chemins fantômes
    const phantomPath = this.checkPhantomPaths(nodeId, player);
    if (phantomPath) {
      console.log(`👻 Chemin fantôme débloqué: ${phantomPath.name}`);
      return {
        ...phantomPath,
        isPhantom: true,
        node: node
      };
    }

    // Résolution normale
    const resolution = node.resolve(player);
    const segment = node.segments[resolution.segment];

    console.log(`🔮 Nœud "${node.name}" résolu:`);
    console.log(`   Segment: ${resolution.name} (${resolution.segment})`);
    console.log(`   Raison: ${resolution.reason}`);

    return {
      node: node,
      segment: segment,
      resolution: resolution,
      isPhantom: false
    };
  }

  /**
   * Vérifie si un chemin fantôme est débloqué
   */
  checkPhantomPaths(nodeId, player) {
    for (const phantom of this.phantomPaths) {
      if (phantom.appearsAt === nodeId && phantom.conditions(player)) {
        return {
          name: phantom.name,
          segment: phantom.segment,
          resolution: {
            segment: 'PHANTOM',
            name: phantom.name,
            reason: `🌟 CHEMIN FANTÔME DÉBLOQUÉ ! ${phantom.description}`,
            style: 'phantom'
          }
        };
      }
    }
    return null;
  }

  // ═══════════════════════════════════════════════════════════════
  // GÉNÉRATION DE SEGMENTS DANS LE PATH
  // ═══════════════════════════════════════════════════════════════

  /**
   * Génère les tiles d'un segment
   * @param {object} segment - Définition du segment
   * @param {number} startIndex - Index de départ dans le path
   * @returns {array} Tiles du segment
   */
  generateSegmentTiles(segment, startIndex) {
    const tiles = [];

    segment.tileTypes.forEach((type, offset) => {
      tiles.push({
        type: type,
        index: startIndex + offset,
        segmentId: segment.id,
        segmentName: segment.name,
        color: segment.color,
        features: segment.features
      });
    });

    return tiles;
  }

  /**
   * Obtient tous les nœuds
   */
  getAllNodes() {
    return this.nodes;
  }

  /**
   * Obtient un nœud par ID
   */
  getNode(nodeId) {
    return this.nodes.find(n => n.id === nodeId);
  }

  /**
   * Obtient un nœud par position
   */
  getNodeAtPosition(position) {
    return this.nodes.find(n => n.position === position);
  }
}

// ═══════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════

if (typeof window !== 'undefined') {
  window.DestinyNodesSystem = DestinyNodesSystem;
}

console.log('✅ destiny-nodes.js chargé');
