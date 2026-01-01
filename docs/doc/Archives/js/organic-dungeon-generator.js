/**
 * 🏰 ORGANIC DUNGEON GENERATOR - DIABLO/HADES/DARKEST DUNGEON STYLE
 * THE LAST COVENANT
 * 
 * Système de génération procédurale de donjon lugubre avec:
 * - Chemins organiques (non-grille)
 * - Nœuds de Destin stratégiques
 * - Salles vs Corridors
 * - Bifurcations conditionnelles (corruption)
 * - Ambiance oppressante
 */

class OrganicDungeonGenerator {
  constructor(config = {}) {
    this.config = {
      seed: config.seed || Date.now(),
      length: config.length || 26,          // 26 positions comme un jeu de l'oie
      roomFrequency: config.roomFrequency || 0.3,  // 30% de salles
      branchChance: config.branchChance || 0.15,   // 15% de bifurcations
      destinyNodeFrequency: config.destinyNodeFrequency || 5, // Tous les 5 nodes
      ...config
    };

    this.nodes = [];           // Liste de tous les nodes générés
    this.mainPath = [];        // Chemin principal
    this.branches = [];        // Chemins secondaires
    this.destinyNodes = [];    // Nœuds de Destin (choix importants)
    this.corruptedPaths = [];  // Chemins fantômes (corruption ≥ seuil)

    console.log('🏰 OrganicDungeonGenerator initialisé');
  }

  // ═══════════════════════════════════════════════════════════════
  // GÉNÉRATION PRINCIPALE
  // ═══════════════════════════════════════════════════════════════

  generate() {
    console.log('🎲 Génération du donjon organique...');

    // 1. Générer le chemin principal
    this.generateMainPath();

    // 2. Placer les Nœuds de Destin
    this.placeDestinyNodes();

    // 3. Générer les bifurcations
    this.generateBranches();

    // 4. Générer les chemins corrompus (fantômes)
    this.generateCorruptedPaths();

    // 5. Connecter les nodes (graphe)
    this.connectNodes();

    // 6. Assigner types de rooms
    this.assignRoomTypes();

    console.log('✅ Donjon généré:');
    console.log(`   Nodes totaux: ${this.nodes.length}`);
    console.log(`   Chemin principal: ${this.mainPath.length}`);
    console.log(`   Nœuds de Destin: ${this.destinyNodes.length}`);
    console.log(`   Bifurcations: ${this.branches.length}`);
    console.log(`   Chemins corrompus: ${this.corruptedPaths.length}`);

    return {
      nodes: this.nodes,
      mainPath: this.mainPath,
      destinyNodes: this.destinyNodes,
      branches: this.branches,
      corruptedPaths: this.corruptedPaths
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // GÉNÉRATION DU CHEMIN PRINCIPAL (ORGANIQUE)
  // ═══════════════════════════════════════════════════════════════

  generateMainPath() {
    let currentX = 0;
    let currentY = 0;
    let direction = 0; // 0 = droite, 1 = bas-droite, 2 = bas, etc.

    for (let i = 0; i < this.config.length; i++) {
      const node = {
        id: `node_${i}`,
        index: i,
        x: currentX,
        y: currentY,
        type: 'corridor',  // Par défaut corridor
        connections: [],
        isMainPath: true,
        isDestinyNode: false,
        requiredCorruption: 0,
        events: []
      };

      this.nodes.push(node);
      this.mainPath.push(node);

      // Avancer de manière organique (pas en ligne droite)
      const step = this.getOrganicStep(direction, i);
      currentX += step.dx;
      currentY += step.dy;
      direction = step.newDirection;
    }
  }

  getOrganicStep(currentDirection, nodeIndex) {
    // Variation organique : change de direction parfois
    const changeChance = 0.2;
    let newDirection = currentDirection;

    if (Math.random() < changeChance) {
      // Tourner légèrement (±45°)
      const turn = Math.random() < 0.5 ? -1 : 1;
      newDirection = (currentDirection + turn + 8) % 8;
    }

    // Convertir direction en delta X/Y (grille isométrique)
    const directionMap = [
      { dx: 2, dy: 0 },   // 0: droite
      { dx: 2, dy: 1 },   // 1: bas-droite
      { dx: 0, dy: 2 },   // 2: bas
      { dx: -2, dy: 1 },  // 3: bas-gauche
      { dx: -2, dy: 0 },  // 4: gauche
      { dx: -2, dy: -1 }, // 5: haut-gauche
      { dx: 0, dy: -2 },  // 6: haut
      { dx: 2, dy: -1 }   // 7: haut-droite
    ];

    return {
      ...directionMap[newDirection],
      newDirection
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // PLACEMENT DES NŒUDS DE DESTIN
  // ═══════════════════════════════════════════════════════════════

  placeDestinyNodes() {
    const frequency = this.config.destinyNodeFrequency;

    for (let i = frequency; i < this.mainPath.length; i += frequency) {
      if (i >= this.mainPath.length) break;

      const node = this.mainPath[i];
      node.isDestinyNode = true;
      node.type = 'destiny';
      this.destinyNodes.push(node);

      console.log(`   🎲 Nœud de Destin placé à l'index ${i}`);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // GÉNÉRATION DES BIFURCATIONS
  // ═══════════════════════════════════════════════════════════════

  generateBranches() {
    const branchChance = this.config.branchChance;

    for (let i = 5; i < this.mainPath.length - 5; i++) {
      if (Math.random() > branchChance) continue;

      const sourceNode = this.mainPath[i];
      const branchLength = Math.floor(Math.random() * 3) + 2; // 2-4 nodes

      const branch = this.createBranch(sourceNode, branchLength);
      if (branch.length > 0) {
        this.branches.push(branch);
        console.log(`   🌿 Bifurcation créée depuis node ${i} (${branch.length} nodes)`);
      }
    }
  }

  createBranch(sourceNode, length) {
    const branch = [];
    let currentX = sourceNode.x;
    let currentY = sourceNode.y;

    // Direction perpendiculaire au chemin principal
    const branchDirection = Math.random() < 0.5 ? 2 : 6; // Haut ou Bas

    for (let i = 0; i < length; i++) {
      currentX += (branchDirection === 2 ? 0 : 0);
      currentY += (branchDirection === 2 ? 2 : -2);

      const node = {
        id: `branch_${this.nodes.length}`,
        index: this.nodes.length,
        x: currentX,
        y: currentY,
        type: 'corridor',
        connections: [],
        isMainPath: false,
        isBranch: true,
        isDestinyNode: false,
        requiredCorruption: 0,
        events: []
      };

      this.nodes.push(node);
      branch.push(node);

      // Dernier node de la branche : potentiellement une récompense
      if (i === length - 1) {
        node.type = 'reward';
        node.events.push({
          type: 'treasure',
          rarity: Math.random() < 0.3 ? 'rare' : 'common'
        });
      }
    }

    // Connecter au node source
    if (branch.length > 0) {
      sourceNode.connections.push(branch[0].id);
      branch[0].connections.push(sourceNode.id);
    }

    return branch;
  }

  // ═══════════════════════════════════════════════════════════════
  // GÉNÉRATION DES CHEMINS CORROMPUS (FANTÔMES)
  // ═══════════════════════════════════════════════════════════════

  generateCorruptedPaths() {
    // Chemins fantômes : raccourcis dangereux accessibles si corruption ≥ seuil
    const corruptionThresholds = [15, 30, 50, 75];

    corruptionThresholds.forEach((threshold, index) => {
      // Trouver deux points éloignés du chemin principal
      const startIndex = Math.floor(this.mainPath.length * 0.3);
      const endIndex = Math.floor(this.mainPath.length * 0.7);

      const startNode = this.mainPath[startIndex + index * 2];
      const endNode = this.mainPath[endIndex + index * 2];

      if (!startNode || !endNode) return;

      // Créer un chemin direct (raccourci)
      const shortcut = this.createShortcut(startNode, endNode, threshold);
      if (shortcut.length > 0) {
        this.corruptedPaths.push({
          nodes: shortcut,
          requiredCorruption: threshold,
          danger: threshold / 10, // Plus corrompu = plus dangereux
          reward: threshold * 2   // Mais plus rentable
        });

        console.log(`   👻 Chemin corrompu créé (corruption ≥ ${threshold}%)`);
      }
    });
  }

  createShortcut(startNode, endNode, corruptionThreshold) {
    const shortcut = [];
    const dx = endNode.x - startNode.x;
    const dy = endNode.y - startNode.y;
    const steps = Math.max(Math.abs(dx), Math.abs(dy)) / 2;

    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const x = Math.round(startNode.x + dx * t);
      const y = Math.round(startNode.y + dy * t);

      const node = {
        id: `corrupted_${this.nodes.length}`,
        index: this.nodes.length,
        x,
        y,
        type: 'corrupted',
        connections: [],
        isMainPath: false,
        isCorrupted: true,
        isDestinyNode: false,
        requiredCorruption: corruptionThreshold,
        events: [
          {
            type: 'corruption_gain',
            amount: Math.floor(corruptionThreshold / 10)
          }
        ]
      };

      this.nodes.push(node);
      shortcut.push(node);
    }

    // Connecter au début et à la fin
    if (shortcut.length > 0) {
      startNode.connections.push(shortcut[0].id);
      shortcut[0].connections.push(startNode.id);

      endNode.connections.push(shortcut[shortcut.length - 1].id);
      shortcut[shortcut.length - 1].connections.push(endNode.id);
    }

    return shortcut;
  }

  // ═══════════════════════════════════════════════════════════════
  // CONNEXION DES NODES (GRAPHE)
  // ═══════════════════════════════════════════════════════════════

  connectNodes() {
    // Connecter le chemin principal
    for (let i = 0; i < this.mainPath.length - 1; i++) {
      const current = this.mainPath[i];
      const next = this.mainPath[i + 1];

      current.connections.push(next.id);
      next.connections.push(current.id);
    }

    // Les branches sont déjà connectées dans createBranch()
    // Les chemins corrompus aussi dans createShortcut()
  }

  // ═══════════════════════════════════════════════════════════════
  // ASSIGNATION DES TYPES DE SALLES
  // ═══════════════════════════════════════════════════════════════

  assignRoomTypes() {
    const roomFrequency = this.config.roomFrequency;

    this.nodes.forEach(node => {
      if (node.type !== 'corridor') return; // Skip déjà assignés

      if (Math.random() < roomFrequency) {
        node.type = this.getRandomRoomType();
      }
    });
  }

  getRandomRoomType() {
    const types = [
      { type: 'combat', weight: 0.4 },
      { type: 'treasure', weight: 0.2 },
      { type: 'event', weight: 0.2 },
      { type: 'rest', weight: 0.1 },
      { type: 'shop', weight: 0.1 }
    ];

    const rand = Math.random();
    let cumulative = 0;

    for (const t of types) {
      cumulative += t.weight;
      if (rand <= cumulative) return t.type;
    }

    return 'corridor';
  }

  // ═══════════════════════════════════════════════════════════════
  // UTILITAIRES
  // ═══════════════════════════════════════════════════════════════

  getNodeById(id) {
    return this.nodes.find(n => n.id === id);
  }

  getNodeAtPosition(x, y) {
    return this.nodes.find(n => n.x === x && n.y === y);
  }

  getConnectedNodes(nodeId) {
    const node = this.getNodeById(nodeId);
    if (!node) return [];

    return node.connections.map(id => this.getNodeById(id)).filter(n => n);
  }

  isPathAccessible(nodeId, playerCorruption) {
    const node = this.getNodeById(nodeId);
    if (!node) return false;

    return playerCorruption >= node.requiredCorruption;
  }
}

// ═══════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════

if (typeof window !== 'undefined') {
  window.OrganicDungeonGenerator = OrganicDungeonGenerator;
}
