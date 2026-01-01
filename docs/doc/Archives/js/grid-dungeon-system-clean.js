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
    this.nodeSystem = nodeSystem;
    this.width = 100;
    this.height = 100;
    this.grid = [];
    
    this.startX = Math.floor(this.width / 2);
    this.startY = Math.floor(this.height / 2);
    
    this.linearPath = [];
    this.revealedTiles = new Set();
    
    // GÉNÉRATION PAR CHUNKS
    this.chunkSize = 10; // 10 tuiles par chunk
    this.currentChunkIndex = 0;
    this.fullPath = []; // Path complet (non généré sur la grille)
    this.generatedUntil = 0; // Index jusqu'où on a généré
    
    console.log(`🏰 NodeBasedIsoDungeon créé (génération par chunks)`);
  }

  generate(playerState) {
    console.log('🎲 Génération du donjon basé sur les Nœuds...');
    
    this.initGrid();
    this.linearPath = [];
    this.revealedTiles.clear();
    this.currentChunkIndex = 0;
    this.generatedUntil = 0;
    
    // Obtenir le path complet mais ne PAS tout générer
    const dungeonResult = this.nodeSystem.generate(playerState);
    this.fullPath = dungeonResult.path;
    
    console.log(`   Path total: ${this.fullPath.length} tuiles`);
    
    // Générer seulement le premier chunk
    this.generateNextChunk();
    this.addWalls();
    this.revealArea(this.startX, this.startY, 5);
    
    console.log('✅ Premier chunk généré');
    console.log(`   Tuiles visibles: ${this.linearPath.length}/${this.fullPath.length}`);
    
    return {
      grid: this.grid,
      path: this.linearPath,
      decisions: dungeonResult.decisions,
      metadata: dungeonResult.metadata,
      start: { x: this.startX, y: this.startY }
    };
  }

  generateNextChunk() {
    const startIndex = this.generatedUntil;
    const endIndex = Math.min(startIndex + this.chunkSize, this.fullPath.length);
    
    if (startIndex >= this.fullPath.length) {
      console.log('⚠️ Fin du donjon atteinte');
      return false;
    }
    
    console.log(`🔨 Génération chunk ${this.currentChunkIndex}: tuiles ${startIndex}-${endIndex}`);
    
    // Position de départ (fin du chunk précédent ou centre si premier)
    let x, y;
    if (this.linearPath.length > 0) {
      const last = this.linearPath[this.linearPath.length - 1];
      x = last.x;
      y = last.y;
    } else {
      x = this.startX;
      y = this.startY;
    }
    
    let currentDir = 1; // Sud
    const directions = [
      { dx: 1, dy: 0 },   // Est
      { dx: 0, dy: 1 },   // Sud
      { dx: -1, dy: 0 },  // Ouest
      { dx: 0, dy: -1 }   // Nord
    ];
    
    let stepsSinceLastTurn = 0;
    
    for (let i = startIndex; i < endIndex; i++) {
      const tile = this.fullPath[i];
      
      let tileType = TileType.FLOOR;
      
      if (tile.type === 'entrance') tileType = TileType.ENTRANCE;
      else if (tile.type === 'exit') tileType = TileType.EXIT;
      else if (tile.type === 'node') tileType = TileType.DESTINY;
      else if (tile.type === 'event' || tile.type === 'combat' || tile.type === 'treasure' || tile.type === 'boss') {
        tileType = TileType.ROOM_FLOOR;
      }
      
      // Creuser
      const size = (tileType === TileType.ROOM_FLOOR || tileType === TileType.DESTINY) ? 5 : 3;
      this.carveArea(x, y, size, tileType);
      
      // Ajouter au path linéaire
      this.linearPath.push({
        x, y, 
        index: i, 
        tileType,
        tileData: tile
      });
      
      // Révéler autour
      this.revealArea(x, y, 3);
      
      // Tourner parfois
      stepsSinceLastTurn++;
      if (stepsSinceLastTurn > 2 && Math.random() < 0.35) {
        const oppositeDir = (currentDir + 2) % 4;
        const possibleDirs = [0, 1, 2, 3].filter(d => d !== oppositeDir);
        currentDir = possibleDirs[Math.floor(Math.random() * possibleDirs.length)];
        stepsSinceLastTurn = 0;
      }
      
      // Avancer
      const dir = directions[currentDir];
      const step = 4;
      x += dir.dx * step;
      y += dir.dy * step;
      
      // Limites
      const margin = 15;
      if (x < margin || x >= this.width - margin) {
        x -= dir.dx * step;
        currentDir = (currentDir + 1) % 4;
      }
      if (y < margin || y >= this.height - margin) {
        y -= dir.dy * step;
        currentDir = (currentDir + 1) % 4;
      }
    }
    
    this.generatedUntil = endIndex;
    this.currentChunkIndex++;
    
    return true;
  }

  updatePlayerPosition(playerIndex) {
    // Si le joueur approche de la fin du chunk généré, générer le suivant
    const distanceToEnd = this.generatedUntil - playerIndex;
    
    if (distanceToEnd < 3 && this.generatedUntil < this.fullPath.length) {
      console.log(`🔨 Joueur proche de la fin (${distanceToEnd} tuiles), génération du prochain chunk...`);
      this.generateNextChunk();
      this.addWalls();
    }
    
    // Révéler autour du joueur
    if (this.linearPath[playerIndex]) {
      const pos = this.linearPath[playerIndex];
      this.revealArea(pos.x, pos.y, 5);
    }
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

  carveArea(centerX, centerY, size, tileType) {
    const halfSize = Math.floor(size / 2);
    for (let dy = -halfSize; dy <= halfSize; dy++) {
      for (let dx = -halfSize; dx <= halfSize; dx++) {
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
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    
    // Dimensions des tuiles
    this.tileWidth = 32;
    this.tileHeight = 16;
    this.wallHeight = 32;
    
    // Caméra
    this.camera = {
      x: 0,
      y: 0,
      zoom: 1.0
    };
    
    // Tuiles visibles (buffer)
    this.visibleTiles = [];
    
    // Resize
    window.addEventListener('resize', () => this.handleResize());
    
    console.log('🎨 GridIsometricRenderer initialisé');
  }

  handleResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  toIso(x, y) {
    return {
      x: (x - y) * this.tileWidth / 2,
      y: (x + y) * this.tileHeight / 2
    };
  }

  toScreen(isoX, isoY) {
    return {
      x: this.width / 2 + (isoX - this.camera.x) * this.camera.zoom,
      y: this.height / 2 + (isoY - this.camera.y) * this.camera.zoom
    };
  }

  render(dungeon, player, followPlayer = true) {
    if (!dungeon) return;
    
    // Suivre le joueur
    if (followPlayer) {
      const iso = this.toIso(player.x, player.y);
      this.camera.x = iso.x;
      this.camera.y = iso.y;
    }
    
    // Clear
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Calculer tuiles visibles
    this.calculateVisibleTiles(dungeon.grid);
    
    // Render
    this.visibleTiles.forEach(tile => {
      this.renderTile(tile, dungeon.grid);
    });
    
    // Joueur
    this.renderPlayer(player);
  }

  calculateVisibleTiles(grid) {
    this.visibleTiles = [];
    
    // Parcourir TOUTE la grille pour le debug
    for (let gy = 0; gy < grid.length; gy++) {
      for (let gx = 0; gx < grid[0].length; gx++) {
        const tileType = grid[gy][gx];
        if (tileType === TileType.VOID) continue;
        
        const iso = this.toIso(gx, gy);
        const screen = this.toScreen(iso.x, iso.y);
        
        // Seulement si visible à l'écran (culling simple)
        if (screen.x < -100 || screen.x > this.width + 100) continue;
        if (screen.y < -100 || screen.y > this.height + 100) continue;
        
        this.visibleTiles.push({
          gx, gy, tileType, iso, screen
        });
      }
    }
    
    // Debug
    if (this.visibleTiles.length > 0 && Math.random() < 0.05) {
      console.log(`📊 Tuiles visibles: ${this.visibleTiles.length}`);
    }
    
    this.visibleTiles.sort((a, b) => {
      const distA = a.gx + a.gy;
      const distB = b.gx + b.gy;
      if (distA !== distB) return distA - distB;
      return a.gx - b.gx;
    });
  }

  renderTile(tile, grid) {
    const { gx, gy, tileType, screen } = tile;
    const tw = this.tileWidth * this.camera.zoom;
    const th = this.tileHeight * this.camera.zoom;
    const wh = this.wallHeight * this.camera.zoom;
    
    this.ctx.save();
    
    switch (tileType) {
      case TileType.ENTRANCE:
        this.drawCube(screen.x, screen.y, tw, th, wh * 0.3, '#338833', '#44aa44', '#225522');
        break;
        
      case TileType.EXIT:
        this.drawCube(screen.x, screen.y, tw, th, wh * 0.3, '#aa5522', '#cc6633', '#883311');
        break;
        
      case TileType.FLOOR:
        this.drawCube(screen.x, screen.y, tw, th, wh * 0.3, '#444444', '#555555', '#333333');
        break;
        
      case TileType.ROOM_FLOOR:
        this.drawCube(screen.x, screen.y, tw, th, wh * 0.3, '#554466', '#665577', '#443355');
        break;
        
      case TileType.DESTINY:
        this.drawCube(screen.x, screen.y, tw, th, wh * 0.3, '#7755aa', '#8866bb', '#664499');
        this.drawDestinyGlow(screen.x, screen.y, tw, th);
        break;
        
      case TileType.CORRUPTED:
        this.drawCube(screen.x, screen.y, tw, th, wh * 0.3, '#663333', '#774444', '#552222');
        break;
        
      case TileType.WALL:
        this.drawCube(screen.x, screen.y, tw, th, wh, '#555555', '#777777', '#444444');
        break;
    }
    
    this.ctx.restore();
  }

  drawCube(x, y, w, h, wallHeight, colorTop, colorRight, colorLeft) {
    const hw = w / 2;
    const hh = h / 2;
    
    // Face dessus
    this.ctx.fillStyle = colorTop;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - wallHeight);
    this.ctx.lineTo(x + hw, y - hh - wallHeight);
    this.ctx.lineTo(x, y - wallHeight * 2);
    this.ctx.lineTo(x - hw, y - hh - wallHeight);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
    
    // Face droite (Sud-Est)
    this.ctx.fillStyle = colorRight;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - wallHeight);
    this.ctx.lineTo(x + hw, y - hh - wallHeight);
    this.ctx.lineTo(x + hw, y - hh);
    this.ctx.lineTo(x, y);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
    
    // Face gauche (Sud-Ouest)
    this.ctx.fillStyle = colorLeft;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - wallHeight);
    this.ctx.lineTo(x - hw, y - hh - wallHeight);
    this.ctx.lineTo(x - hw, y - hh);
    this.ctx.lineTo(x, y);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }

  drawDestinyGlow(x, y, w, h) {
    const grad = this.ctx.createRadialGradient(x, y, 0, x, y, w);
    grad.addColorStop(0, 'rgba(136, 102, 187, 0.3)');
    grad.addColorStop(1, 'rgba(136, 102, 187, 0)');
    
    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.arc(x, y, w, 0, Math.PI * 2);
    this.ctx.fill();
  }

  renderPlayer(player) {
    const iso = this.toIso(player.x, player.y);
    const screen = this.toScreen(iso.x, iso.y);
    
    const size = 20 * this.camera.zoom;
    
    this.ctx.fillStyle = '#ffcc00';
    this.ctx.beginPath();
    this.ctx.arc(screen.x, screen.y - 20 * this.camera.zoom, size, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }
}

console.log('✅ Grid Dungeon System chargé');
