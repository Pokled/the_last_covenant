/**
 * 🏰 ISOMETRIC DUNGEON SYSTEMS
 * THE LAST COVENANT
 * 
 * Contient:
 * - NodeBasedIsoDungeon: Système basé sur les Nœuds de Destin
 * - GridIsometricRenderer: Renderer isométrique partagé
 */

// ═══════════════════════════════════════════════════════════════
// TYPES DE TUILES
// ═══════════════════════════════════════════════════════════════

const TileType = {
  VOID: 0,        // Vide (noir total)
  FLOOR: 1,       // Sol de couloir
  WALL: 2,        // Mur
  ROOM_FLOOR: 3,  // Sol de salle (event)
  DESTINY: 4,     // Nœud de Destin
  CORRUPTED: 5,   // Sol corrompu
  ENTRANCE: 6,    // Entrée du donjon
  EXIT: 7,        // Sortie du donjon
  HIDDEN: 8       // Case cachée (fog of war)
};

// ═══════════════════════════════════════════════════════════════
// GÉNÉRATEUR DE DONJON BASÉ SUR NŒUDS
// ═══════════════════════════════════════════════════════════════

class NodeBasedIsoDungeon {
  constructor(nodeSystem) {
    this.nodeSystem = nodeSystem; // Instance de NodeBasedDungeon
    this.width = 100;
    this.height = 100;
    this.grid = [];
    
    // Position de départ centrale
    this.startX = Math.floor(this.width / 2);
    this.startY = Math.floor(this.height / 2);
    
    // Chemin linéaire
    this.linearPath = [];
    
    // Fog of War
    this.revealedTiles = new Set();
    
    console.log(`🏰 NodeBasedIsoDungeon créé`);
  }

  // ═══════════════════════════════════════════════════════════════
  // GÉNÉRATION DU DONJON SELON L'ÉTAT DU JOUEUR
  // ═══════════════════════════════════════════════════════════════

  generate(playerState) {
    console.log('🎲 Génération du donjon basé sur les Nœuds...');
    
    // Réinitialiser
    this.initGrid();
    this.linearPath = [];
    this.revealedTiles.clear();
    
    // Générer le chemin complet via NodeBasedDungeon
    const dungeonResult = this.nodeSystem.generate(playerState);
    
    // Convertir le chemin en grille isométrique
    this.buildLinearPath(dungeonResult.path);
    
    // Ajouter les murs
    this.addWalls();
    
    // Révéler les premières tuiles
    this.revealArea(this.startX, this.startY, 3);
    
    console.log('✅ Donjon généré:');
    console.log(`   Cases totales: ${this.linearPath.length}`);
    console.log(`   Décisions: ${dungeonResult.decisions.length}`);
    
    return {
      grid: this.grid,
      path: this.linearPath,
      decisions: dungeonResult.decisions,
      metadata: dungeonResult.metadata,
      start: { x: this.startX, y: this.startY }
    };
  }

  initGrid() {
    this.grid = [];
    for (let y = 0; y < this.height; y++) {
      const row = [];
      for (let x = 0; x < this.width; x++) {
        row.push(TileType.VOID);
      }
      this.grid.push(row);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // CONSTRUIRE LE CHEMIN LINÉAIRE EN ISOMÉTRIQUE
  // ═══════════════════════════════════════════════════════════════

  buildLinearPath(pathTiles) {
    let x = this.startX;
    let y = this.startY;
    
    // Direction initiale (vers le bas-droite en iso)
    let currentDir = 1; // 0=Est, 1=Sud, 2=Ouest, 3=Nord
    const directions = [
      { dx: 1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: -1 }
    ];
    
    let stepsSinceLastTurn = 0;
    
    // Pour chaque tuile du path
    pathTiles.forEach((tile, index) => {
      // Déterminer le type de tuile
      let tileType = TileType.FLOOR;
      
      if (tile.type === 'entrance') tileType = TileType.ENTRANCE;
      else if (tile.type === 'exit') tileType = TileType.EXIT;
      else if (tile.type === 'node') tileType = TileType.DESTINY;
      else if (tile.type === 'event' || tile.type === 'combat' || tile.type === 'treasure') {
        tileType = TileType.ROOM_FLOOR;
      }
      
      // Creuser un couloir large (3 tuiles)
      this.carveWide(x, y, tileType);
      
      // Ajouter au path linéaire
      this.linearPath.push({
        x, y, 
        index, 
        tileType,
        tileData: tile
      });
      
      // Avancer
      stepsSinceLastTurn++;
      
      // Tourner aléatoirement pour créer un chemin sinueux
      if (stepsSinceLastTurn > 5 && Math.random() < 0.3) {
        const oppositeDir = (currentDir + 2) % 4;
        const possibleDirs = [0, 1, 2, 3].filter(d => d !== oppositeDir);
        currentDir = possibleDirs[Math.floor(Math.random() * possibleDirs.length)];
        stepsSinceLastTurn = 0;
      }
      
      const dir = directions[currentDir];
      x += dir.dx;
      y += dir.dy;
      
      // Vérifier les limites
      const margin = 10;
      if (x < margin || x >= this.width - margin || y < margin || y >= this.height - margin) {
        x -= dir.dx;
        y -= dir.dy;
        currentDir = (currentDir + 1) % 4;
      }
    });
    
    console.log(`   Chemin linéaire construit: ${this.linearPath.length} tuiles`);
  }

  carveWide(centerX, centerY, tileType) {
    // Creuser 3x3 pour les couloirs
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const x = centerX + dx;
        const y = centerY + dy;
        if (this.isInBounds(x, y)) {
          this.grid[y][x] = tileType;
        }
      }
    }
  }

  addWalls() {
    const isWalkable = (tile) => {
      return tile === TileType.FLOOR || 
             tile === TileType.ROOM_FLOOR || 
             tile === TileType.DESTINY || 
             tile === TileType.ENTRANCE ||
             tile === TileType.EXIT;
    };

    const wallPositions = new Set();

    // Première passe : entourer toutes les tuiles marchables
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (isWalkable(this.grid[y][x])) {
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;
              const nx = x + dx;
              const ny = y + dy;
              if (this.isInBounds(nx, ny) && this.grid[ny][nx] === TileType.VOID) {
                wallPositions.add(`${nx},${ny}`);
              }
            }
          }
        }
      }
    }

    wallPositions.forEach(pos => {
      const [x, y] = pos.split(',').map(Number);
      this.grid[y][x] = TileType.WALL;
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // FOG OF WAR
  // ═══════════════════════════════════════════════════════════════

  revealArea(centerX, centerY, radius) {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= radius) {
          const x = centerX + dx;
          const y = centerY + dy;
          if (this.isInBounds(x, y)) {
            this.revealedTiles.add(`${x},${y}`);
          }
        }
      }
    }
  }

  isRevealed(x, y) {
    return this.revealedTiles.has(`${x},${y}`);
  }

  // ═══════════════════════════════════════════════════════════════
  // UTILITAIRES
  // ═══════════════════════════════════════════════════════════════

  isInBounds(x, y, margin = 0) {
    return x >= margin && x < this.width - margin &&
           y >= margin && y < this.height - margin;
  }

  getTile(x, y) {
    if (!this.isInBounds(x, y)) return TileType.VOID;
    return this.grid[y][x];
  }
}

// ═══════════════════════════════════════════════════════════════
// RENDERER ISOMÉTRIQUE
// ═══════════════════════════════════════════════════════════════

class GridIsometricRenderer {
  constructor(canvasId) {
    console.log('🎲 Génération du donjon sur grille...');
    
    // RÉINITIALISER complètement
    this.initGrid();
    this.path = [];
    this.rooms = [];
    this.destinyNodes = [];
    
    // 1. Créer le couloir central (1 tuile de large pour commencer)
    this.carvePathThin();
    
    // 2. Placer les salles sur le chemin
    this.placeRooms();
    
    // 3. Élargir le couloir à 3 tuiles SANS toucher aux salles
    this.widenCorridor();
    
    // 4. Placer les Nœuds de Destin (AVANT les murs)
    this.placeDestinyNodes();
    
    // 5. Marquer l'entrée et la sortie
    this.markEntranceAndExit();
    
    // 6. Ajouter les murs APRÈS avoir tout creusé
    this.addWalls();
    
    console.log('✅ Donjon généré:');
    console.log(`   Chemin: ${this.path.length} tuiles`);
    console.log(`   Salles: ${this.rooms.length}`);
    console.log(`   Nœuds de Destin: ${this.destinyNodes.length}`);
    console.log(`   Entrée: (${this.path[0].x}, ${this.path[0].y})`);
    console.log(`   Sortie: (${this.path[this.path.length - 1].x}, ${this.path[this.path.length - 1].y})`);
    
    return {
      grid: this.grid,
      path: this.path,
      rooms: this.rooms,
      destinyNodes: this.destinyNodes,
      start: { x: this.startX, y: this.startY },
      entrance: this.path[0],
      exit: this.path[this.path.length - 1]
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // CREUSER LE CHEMIN PRINCIPAL (1 TUILE CENTRALE D'ABORD)
  // ═══════════════════════════════════════════════════════════════

  carvePathThin() {
    let x = this.startX;
    let y = this.startY;
    
    const directions = [
      { dx: 1, dy: 0 },   // Est
      { dx: 0, dy: 1 },   // Sud
      { dx: -1, dy: 0 },  // Ouest
      { dx: 0, dy: -1 }   // Nord
    ];
    
    let currentDir = Math.floor(Math.random() * 4);
    const TARGET_LENGTH = 150;
    let stepsSinceLastTurn = 0;
    
    // Placer l'entrée (1 tuile pour commencer)
    this.grid[y][x] = TileType.FLOOR;
    this.path.push({ x, y, index: 0, type: 'entrance' });
    
    for (let i = 1; i < TARGET_LENGTH; i++) {
      stepsSinceLastTurn++;
      
      if (stepsSinceLastTurn > 7 && (stepsSinceLastTurn > 15 || Math.random() < 0.25)) {
        const oppositeDir = (currentDir + 2) % 4;
        const possibleDirs = [0, 1, 2, 3].filter(d => d !== oppositeDir);
        currentDir = possibleDirs[Math.floor(Math.random() * possibleDirs.length)];
        stepsSinceLastTurn = 0;
      }
      
      const dir = directions[currentDir];
      x += dir.dx;
      y += dir.dy;
      
      const margin = 10;
      if (x < margin || x >= this.width - margin || y < margin || y >= this.height - margin) {
        x -= dir.dx;
        y -= dir.dy;
        currentDir = (currentDir + 1) % 4;
        const newDir = directions[currentDir];
        x += newDir.dx;
        y += newDir.dy;
      }
      
      if (this.isInBounds(x, y)) {
        this.grid[y][x] = TileType.FLOOR;
        this.path.push({ x, y, index: i, type: 'corridor' });
      }
    }
    
    console.log(`   Chemin central creusé: ${this.path.length} tuiles`);
  }

  // Élargir le couloir à 3 tuiles SANS toucher aux salles
  widenCorridor() {
    const pathCopy = [...this.path];
    
    pathCopy.forEach(tile => {
      // Élargir autour de chaque tuile du path
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const x = tile.x + dx;
          const y = tile.y + dy;
          
          if (this.isInBounds(x, y)) {
            // Ne pas écraser les salles !
            if (this.grid[y][x] !== TileType.ROOM_FLOOR && 
                this.grid[y][x] !== TileType.DESTINY) {
              this.grid[y][x] = TileType.FLOOR;
            }
          }
        }
      }
    });
    
    console.log(`   Couloir élargi à 3 tuiles`);
  }

  // ═══════════════════════════════════════════════════════════════
  // PLACER LES SALLES
  // ═══════════════════════════════════════════════════════════════

  placeRooms() {
    const ROOM_SIZE = 5; // Salles 5x5 (plus grandes)
    let stepsSinceLastRoom = 0;
    
    for (let i = 15; i < this.path.length - 15; i++) {
      stepsSinceLastRoom++;
      
      // Placer une salle tous les 18-28 tuiles
      if (stepsSinceLastRoom >= 18 && (stepsSinceLastRoom >= 28 || Math.random() < 0.35)) {
        const pathTile = this.path[i];
        if (!pathTile) continue;
        
        const room = this.createRoomNxN(pathTile.x, pathTile.y, ROOM_SIZE);
        if (room) {
          this.rooms.push(room);
          stepsSinceLastRoom = 0;
        }
      }
    }
    
    console.log(`   Salles placées: ${this.rooms.length}`);
  }

  createRoomNxN(centerX, centerY, size) {
    const halfSize = Math.floor(size / 2);
    
    // Vérifier espace disponible
    for (let dy = -halfSize; dy <= halfSize; dy++) {
      for (let dx = -halfSize; dx <= halfSize; dx++) {
        const x = centerX + dx;
        const y = centerY + dy;
        if (!this.isInBounds(x, y, 3)) return null;
      }
    }
    
    // Creuser la salle (carré)
    const tiles = [];
    for (let dy = -halfSize; dy <= halfSize; dy++) {
      for (let dx = -halfSize; dx <= halfSize; dx++) {
        const x = centerX + dx;
        const y = centerY + dy;
        this.grid[y][x] = TileType.ROOM_FLOOR;
        tiles.push({ x, y });
      }
    }
    
    return {
      x: centerX,
      y: centerY,
      width: size,
      height: size,
      tiles,
      type: this.getRandomRoomType()
    };
  }

  getRandomRoomType() {
    const types = ['combat', 'treasure', 'rest', 'event', 'shop'];
    return types[Math.floor(Math.random() * types.length)];
  }

  // ═══════════════════════════════════════════════════════════════
  // AJOUTER LES MURS (ÉTANCHÉITÉ VISUELLE COMPLÈTE)
  // ═══════════════════════════════════════════════════════════════

  addWalls() {
    // On définit ce qui est considéré comme du "sol" pour le calcul des murs
    const isWalkable = (tile) => {
      return tile === TileType.FLOOR || 
             tile === TileType.ROOM_FLOOR || 
             tile === TileType.DESTINY || 
             tile === TileType.CORRUPTED;
    };

    const wallPositions = new Set();

    // PASSE 1 : Parcourir la grille pour entourer chaque tuile marchable
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (isWalkable(this.grid[y][x])) {
          
          // On vérifie les 8 voisins autour de chaque tuile de sol
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (dx === 0 && dy === 0) continue;

              const nx = x + dx;
              const ny = y + dy;

              // Si le voisin est dans les limites et est du VIDE, il devient un MUR
              if (this.isInBounds(nx, ny) && this.grid[ny][nx] === TileType.VOID) {
                wallPositions.add(`${nx},${ny}`);
              }
            }
          }
        }
      }
    }

    // Appliquer la première couche de murs
    wallPositions.forEach(pos => {
      const [x, y] = pos.split(',').map(Number);
      this.grid[y][x] = TileType.WALL;
    });

    // PASSE 2 : L'épaisseur de sécurité (essentiel pour l'isométrique)
    // On rajoute une couche de murs sur les extérieurs pour cacher le noir du fond
    const secondLayer = [];
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.grid[y][x] === TileType.WALL) {
          // On vérifie uniquement les voisins du haut (pour la perspective)
          const checkDirs = [
            {dx: 0, dy: -1},   // Nord
            {dx: -1, dy: 0},   // Ouest
            {dx: -1, dy: -1}   // Nord-Ouest
          ];
          
          checkDirs.forEach(d => {
            const nx = x + d.dx;
            const ny = y + d.dy;
            if (this.isInBounds(nx, ny) && this.grid[ny][nx] === TileType.VOID) {
              secondLayer.push({x: nx, y: ny});
            }
          });
        }
      }
    }

    secondLayer.forEach(p => {
      this.grid[p.y][p.x] = TileType.WALL;
    });
    
    console.log(`   Murs générés : ${wallPositions.size + secondLayer.length} tuiles (étanchéité complète)`);
  }

  // ═══════════════════════════════════════════════════════════════
  // PLACER LES NŒUDS DE DESTIN
  // ═══════════════════════════════════════════════════════════════

  placeDestinyNodes() {
    // Placer un nœud tous les ~30 tuiles (environ 5 nœuds sur 150)
    const interval = 30;
    
    for (let i = interval; i < this.path.length - interval; i += interval) {
      const tile = this.path[i];
      if (!tile) continue;
      
      // Placer le nœud sur le chemin central
      this.grid[tile.y][tile.x] = TileType.DESTINY;
      this.destinyNodes.push({ ...tile, destinyIndex: this.destinyNodes.length });
    }
    
    console.log(`   Nœuds de Destin: ${this.destinyNodes.length}`);
  }

  // ═══════════════════════════════════════════════════════════════
  // MARQUER L'ENTRÉE ET LA SORTIE
  // ═══════════════════════════════════════════════════════════════

  markEntranceAndExit() {
    // Entrée = première tuile du path
    const entrance = this.path[0];
    this.grid[entrance.y][entrance.x] = TileType.ENTRANCE;
    
    // Sortie = dernière tuile du path
    const exit = this.path[this.path.length - 1];
    this.grid[exit.y][exit.x] = TileType.EXIT;
    
    console.log(`   Entrée et sortie marquées`);
  }

  // ═══════════════════════════════════════════════════════════════
  // UTILITAIRES
  // ═══════════════════════════════════════════════════════════════

  isInBounds(x, y, margin = 0) {
    return x >= margin && x < this.width - margin &&
           y >= margin && y < this.height - margin;
  }

  getTile(x, y) {
    if (!this.isInBounds(x, y)) return TileType.VOID;
    return this.grid[y][x];
  }

  setTile(x, y, type) {
    if (this.isInBounds(x, y)) {
      this.grid[y][x] = type;
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// RENDERER ISOMÉTRIQUE (GRID BASED)
// ═══════════════════════════════════════════════════════════════

class GridIsometricRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    
    // Taille des tuiles (isométrique)
    this.tileWidth = 64;
    this.tileHeight = 32;
    this.wallHeight = 48; // Hauteur des murs
    
    // Caméra
    this.camera = {
      x: 0,
      y: 0,
      zoom: 1.0,
      smoothing: 0.08
    };
    
    // Cache des tuiles visibles
    this.visibleTiles = [];
    
    console.log('🎨 GridIsometricRenderer initialisé');
  }

  // ═══════════════════════════════════════════════════════════════
  // CONVERSION COORDONNÉES
  // ═══════════════════════════════════════════════════════════════

  /**
   * Cartésien (grille) → Isométrique (écran)
   */
  toIso(gridX, gridY) {
    const isoX = (gridX - gridY) * (this.tileWidth / 2);
    const isoY = (gridX + gridY) * (this.tileHeight / 2);
    return { x: isoX, y: isoY };
  }

  /**
   * Isométrique → Cartésien
   */
  fromIso(isoX, isoY) {
    const gridX = (isoX / (this.tileWidth / 2) + isoY / (this.tileHeight / 2)) / 2;
    const gridY = (isoY / (this.tileHeight / 2) - isoX / (this.tileWidth / 2)) / 2;
    return { x: gridX, y: gridY };
  }

  /**
   * Appliquer caméra
   */
  toScreen(isoX, isoY) {
    return {
      x: (isoX - this.camera.x) * this.camera.zoom + this.width / 2,
      y: (isoY - this.camera.y) * this.camera.zoom + this.height / 2
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDU PRINCIPAL
  // ═══════════════════════════════════════════════════════════════

  render(dungeon, player, followPlayer = true) {
    // Clear
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Suivre le joueur (si activé)
    if (player) {
      this.updateCamera(player, followPlayer);
    }
    
    // Calculer les tuiles visibles
    this.calculateVisibleTiles(dungeon);
    
    // Render les tuiles (back to front)
    this.visibleTiles.forEach(tile => {
      this.renderTile(tile, dungeon.grid);
    });
    
    // Render le joueur
    if (player) {
      this.renderPlayer(player);
    }
  }

  calculateVisibleTiles(dungeon) {
    this.visibleTiles = [];
    
    const margin = 15;
    
    // Position caméra en grille
    const camGrid = this.fromIso(this.camera.x, this.camera.y);
    
    for (let gy = Math.floor(camGrid.y - margin); gy <= Math.ceil(camGrid.y + margin); gy++) {
      for (let gx = Math.floor(camGrid.x - margin); gx <= Math.ceil(camGrid.x + margin); gx++) {
        if (gx < 0 || gx >= dungeon.grid[0].length || gy < 0 || gy >= dungeon.grid.length) {
          continue;
        }
        
        const tileType = dungeon.grid[gy][gx];
        
        // Ne PAS afficher le VOID - seulement FLOOR, ROOM_FLOOR, WALL, DESTINY, CORRUPTED
        if (tileType === TileType.VOID) continue;
        
        const iso = this.toIso(gx, gy);
        const screen = this.toScreen(iso.x, iso.y);
        
        this.visibleTiles.push({
          gx, gy, tileType, iso, screen
        });
      }
    }
    
    // Trier par profondeur isométrique : les tuiles avec le plus petit (x+y) sont derrière
    this.visibleTiles.sort((a, b) => {
      const distA = a.gx + a.gy;
      const distB = b.gx + b.gy;
      if (distA !== distB) return distA - distB;
      return a.gx - b.gx;
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDU D'UNE TUILE (TOUT EN CUBES AVEC PROFONDEUR)
  // ═══════════════════════════════════════════════════════════════

  renderTile(tile, grid) {
    const { gx, gy, tileType, screen } = tile;
    const tw = this.tileWidth * this.camera.zoom;
    const th = this.tileHeight * this.camera.zoom;
    const wh = this.wallHeight * this.camera.zoom;
    
    this.ctx.save();
    
    switch (tileType) {
      case TileType.ENTRANCE:
        // Cube d'entrée (vert)
        this.drawCube(screen.x, screen.y, tw, th, wh * 0.3, '#338833', '#44aa44', '#225522');
        break;
        
      case TileType.EXIT:
        // Cube de sortie (rouge/orange)
        this.drawCube(screen.x, screen.y, tw, th, wh * 0.3, '#aa5522', '#cc6633', '#883311');
        break;
        
      case TileType.FLOOR:
        // Cube de sol (gris)
        this.drawCube(screen.x, screen.y, tw, th, wh * 0.3, '#444444', '#555555', '#333333');
        break;
        
      case TileType.ROOM_FLOOR:
        // Cube de salle (violet)
        this.drawCube(screen.x, screen.y, tw, th, wh * 0.3, '#554466', '#665577', '#443355');
        break;
        
      case TileType.DESTINY:
        // Cube de destin (violet brillant)
        this.drawCube(screen.x, screen.y, tw, th, wh * 0.3, '#7755aa', '#8866bb', '#664499');
        this.drawDestinyGlow(screen.x, screen.y, tw, th);
        break;
        
      case TileType.CORRUPTED:
        // Cube corrompu (rouge)
        this.drawCube(screen.x, screen.y, tw, th, wh * 0.3, '#663333', '#774444', '#552222');
        break;
        
      case TileType.WALL:
        // Cube de mur (grand et gris clair)
        this.drawCube(screen.x, screen.y, tw, th, wh, '#555555', '#777777', '#444444');
        break;
    }
    
    this.ctx.restore();
  }

  // ═══════════════════════════════════════════════════════════════
  // DESSINER UN CUBE ISOMÉTRIQUE (UNIVERSEL - TOUTES FACES FORCÉES)
  // ═══════════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════════
  // DESSINER UN CUBE ISOMÉTRIQUE (FACES AVANT VISIBLES)
  // ═══════════════════════════════════════════════════════════════

  drawCube(x, y, tw, th, height, colorTop, colorRight, colorLeft) {
    // Calculer les 8 coins du cube
    const topNorth = { x: x, y: y - height };
    const topEast = { x: x + tw / 2, y: y + th / 2 - height };
    const topSouth = { x: x, y: y + th - height };
    const topWest = { x: x - tw / 2, y: y + th / 2 - height };
    
    const bottomNorth = { x: x, y: y };
    const bottomEast = { x: x + tw / 2, y: y + th / 2 };
    const bottomSouth = { x: x, y: y + th };
    const bottomWest = { x: x - tw / 2, y: y + th / 2 };
    
    // Face SUD-OUEST (avant-gauche - sombre)
    this.ctx.beginPath();
    this.ctx.moveTo(bottomSouth.x, bottomSouth.y);
    this.ctx.lineTo(bottomWest.x, bottomWest.y);
    this.ctx.lineTo(topWest.x, topWest.y);
    this.ctx.lineTo(topSouth.x, topSouth.y);
    this.ctx.closePath();
    this.ctx.fillStyle = colorLeft;
    this.ctx.fill();
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
    
    // Face SUD-EST (avant-droite - claire)
    this.ctx.beginPath();
    this.ctx.moveTo(bottomEast.x, bottomEast.y);
    this.ctx.lineTo(bottomSouth.x, bottomSouth.y);
    this.ctx.lineTo(topSouth.x, topSouth.y);
    this.ctx.lineTo(topEast.x, topEast.y);
    this.ctx.closePath();
    this.ctx.fillStyle = colorRight;
    this.ctx.fill();
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
    
    // Face DESSUS (horizontal)
    this.ctx.beginPath();
    this.ctx.moveTo(topNorth.x, topNorth.y);
    this.ctx.lineTo(topEast.x, topEast.y);
    this.ctx.lineTo(topSouth.x, topSouth.y);
    this.ctx.lineTo(topWest.x, topWest.y);
    this.ctx.closePath();
    this.ctx.fillStyle = colorTop;
    this.ctx.fill();
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  // ═══════════════════════════════════════════════════════════════
  // DESSINER LE SOL (LOSANGE ISO)
  // ═══════════════════════════════════════════════════════════════

  drawFloor(x, y, tw, th, color) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);                  // Haut
    this.ctx.lineTo(x + tw / 2, y + th / 2); // Droite
    this.ctx.lineTo(x, y + th);             // Bas
    this.ctx.lineTo(x - tw / 2, y + th / 2); // Gauche
    this.ctx.closePath();
    
    this.ctx.fillStyle = color;
    this.ctx.fill();
    
    // Bordure
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  drawDestinyGlow(x, y, tw, th) {
    // Lueur violette pulsante
    const pulse = Math.sin(Date.now() / 500) * 0.3 + 0.7;
    
    this.ctx.save();
    this.ctx.globalAlpha = pulse * 0.5;
    
    const gradient = this.ctx.createRadialGradient(x, y + th / 2, 0, x, y + th / 2, tw / 2);
    gradient.addColorStop(0, '#9d4edd');
    gradient.addColorStop(1, 'transparent');
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(x, y + th / 2, tw / 2, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.restore();
  }

  // ═══════════════════════════════════════════════════════════════
  // DESSINER UN MUR (CUBE 3D)
  // ═══════════════════════════════════════════════════════════════

  drawWallBlock(x, y, tw, th, wh, gx, gy, grid) {
    const wallColor = '#18181f';
    const wallLight = '#25252f';
    const wallDark = '#0d0d12';
    
    // Vérifier quels voisins sont aussi des murs ou du sol
    const hasWallLeft = this.isWallOrFloor(gx - 1, gy, grid);
    const hasWallRight = this.isWallOrFloor(gx + 1, gy, grid);
    const hasWallTop = this.isWallOrFloor(gx, gy - 1, grid);
    const hasWallBottom = this.isWallOrFloor(gx, gy + 1, grid);
    
    // Face GAUCHE (seulement si pas de mur à gauche)
    if (!hasWallLeft) {
      this.ctx.beginPath();
      this.ctx.moveTo(x - tw / 2, y + th / 2);
      this.ctx.lineTo(x, y);
      this.ctx.lineTo(x, y - wh);
      this.ctx.lineTo(x - tw / 2, y + th / 2 - wh);
      this.ctx.closePath();
      this.ctx.fillStyle = wallDark;
      this.ctx.fill();
      this.ctx.strokeStyle = '#000';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }
    
    // Face DROITE (seulement si pas de mur à droite)
    if (!hasWallRight) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x + tw / 2, y + th / 2);
      this.ctx.lineTo(x + tw / 2, y + th / 2 - wh);
      this.ctx.lineTo(x, y - wh);
      this.ctx.closePath();
      this.ctx.fillStyle = wallLight;
      this.ctx.fill();
      this.ctx.strokeStyle = '#000';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }
    
    // Face ARRIÈRE (si pas de mur derrière - haut)
    if (!hasWallTop) {
      this.ctx.beginPath();
      this.ctx.moveTo(x - tw / 2, y + th / 2 - wh);
      this.ctx.lineTo(x, y - wh);
      this.ctx.lineTo(x, y);
      this.ctx.lineTo(x - tw / 2, y + th / 2);
      this.ctx.closePath();
      this.ctx.fillStyle = wallDark;
      this.ctx.fill();
      this.ctx.strokeStyle = '#000';
      this.ctx.lineWidth = 0.5;
      this.ctx.stroke();
    }
    
    // Face AVANT (si pas de mur devant - bas)
    if (!hasWallBottom) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x + tw / 2, y + th / 2);
      this.ctx.lineTo(x + tw / 2, y + th / 2 - wh);
      this.ctx.lineTo(x, y - wh);
      this.ctx.closePath();
      this.ctx.fillStyle = wallLight;
      this.ctx.fill();
      this.ctx.strokeStyle = '#000';
      this.ctx.lineWidth = 0.5;
      this.ctx.stroke();
    }
    
    // Face DESSUS (toujours visible)
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - wh);
    this.ctx.lineTo(x + tw / 2, y + th / 2 - wh);
    this.ctx.lineTo(x, y + th - wh);
    this.ctx.lineTo(x - tw / 2, y + th / 2 - wh);
    this.ctx.closePath();
    this.ctx.fillStyle = wallColor;
    this.ctx.fill();
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  isWallOrFloor(gx, gy, grid) {
    if (gy < 0 || gy >= grid.length || gx < 0 || gx >= grid[0].length) {
      return false;
    }
    const tile = grid[gy][gx];
    return tile === TileType.WALL || 
           tile === TileType.FLOOR || 
           tile === TileType.ROOM_FLOOR || 
           tile === TileType.DESTINY || 
           tile === TileType.CORRUPTED;
  }

  drawRockBlock(x, y, tw, th, wh) {
    // Bloc de roche/terre (sol non-creusé)
    const rockColor = '#3a2f2f';
    const rockLight = '#4a3a3a';
    const rockDark = '#2a1f1f';
    
    // Face GAUCHE
    this.ctx.beginPath();
    this.ctx.moveTo(x - tw / 2, y + th / 2);
    this.ctx.lineTo(x, y);
    this.ctx.lineTo(x, y - wh);
    this.ctx.lineTo(x - tw / 2, y + th / 2 - wh);
    this.ctx.closePath();
    this.ctx.fillStyle = rockDark;
    this.ctx.fill();
    this.ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
    
    // Face DROITE
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + tw / 2, y + th / 2);
    this.ctx.lineTo(x + tw / 2, y + th / 2 - wh);
    this.ctx.lineTo(x, y - wh);
    this.ctx.closePath();
    this.ctx.fillStyle = rockLight;
    this.ctx.fill();
    this.ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
    
    // Face DESSUS
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - wh);
    this.ctx.lineTo(x + tw / 2, y + th / 2 - wh);
    this.ctx.lineTo(x, y + th - wh);
    this.ctx.lineTo(x - tw / 2, y + th / 2 - wh);
    this.ctx.closePath();
    this.ctx.fillStyle = rockColor;
    this.ctx.fill();
    this.ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  hasFloorAt(gx, gy, grid) {
    if (gy < 0 || gy >= grid.length || gx < 0 || gx >= grid[0].length) {
      return false;
    }
    
    const tile = grid[gy][gx];
    return tile === TileType.FLOOR || 
           tile === TileType.ROOM_FLOOR || 
           tile === TileType.DESTINY || 
           tile === TileType.CORRUPTED;
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDU DU JOUEUR
  // ═══════════════════════════════════════════════════════════════

  renderPlayer(player) {
    const iso = this.toIso(player.x, player.y);
    const screen = this.toScreen(iso.x, iso.y);
    
    const size = 16 * this.camera.zoom;
    
    // Ombre
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    this.ctx.beginPath();
    this.ctx.ellipse(screen.x, screen.y + size, size * 0.8, size * 0.4, 0, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Corps (cube doré)
    this.ctx.fillStyle = '#d4af37';
    this.ctx.fillRect(screen.x - size / 2, screen.y - size * 2, size, size * 1.5);
    
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(screen.x - size / 2, screen.y - size * 2, size, size * 1.5);
    
    // Indicateur Nœud de Destin
    if (player.isOnDestinyNode) {
      this.ctx.font = `${24 * this.camera.zoom}px Arial`;
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = '#9d4edd';
      this.ctx.fillText('🎲', screen.x, screen.y - size * 3);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // CAMÉRA
  // ═══════════════════════════════════════════════════════════════

  updateCamera(player, followPlayer = true) {
    if (!followPlayer) return; // Si on ne suit pas le joueur, ne rien faire
    
    const targetIso = this.toIso(player.x, player.y);
    
    // Smooth lerp
    this.camera.x += (targetIso.x - this.camera.x) * this.camera.smoothing;
    this.camera.y += (targetIso.y - this.camera.y) * this.camera.smoothing;
  }
}

// ═══════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════

if (typeof window !== 'undefined') {
  window.GridDungeonGenerator = GridDungeonGenerator;
  window.GridIsometricRenderer = GridIsometricRenderer;
  window.TileType = TileType;
}
