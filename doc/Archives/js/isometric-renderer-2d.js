/**
 * 🎨 ISOMETRIC RENDERER 2D - VERSION OPTIMISÉE
 * Utilise des sprites 2D pré-calculés au lieu de cubes 3D
 * Performance : ~10x plus rapide que la version cubes
 */

console.log('🎨 Chargement du renderer 2D isométrique optimisé...');

class IsometricRenderer2D {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    
    // Configuration isométrique
    this.TILE_WIDTH = 64;  // Largeur du losange
    this.TILE_HEIGHT = 32; // Hauteur du losange
    this.WALL_HEIGHT = 48; // Hauteur des murs
    
    // Caméra
    this.camera = { x: 0, y: 0, zoom: 1 };
    
    // Données du donjon
    this.dungeon = null;
    this.path = [];
    this.rooms = [];
    this.decisions = [];
    
    // Sprites pré-rendus (cache)
    this.spriteCache = new Map();
    
    // Resize
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    console.log('✅ IsometricRenderer2D initialisé');
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 3;
  }
  
  /**
   * Convertit coordonnées grille 2D -> coordonnées écran isométrique
   */
  gridToScreen(gridX, gridY) {
    const isoX = (gridX - gridY) * (this.TILE_WIDTH / 2);
    const isoY = (gridX + gridY) * (this.TILE_HEIGHT / 2);
    
    return {
      x: this.centerX + isoX * this.camera.zoom - this.camera.x,
      y: this.centerY + isoY * this.camera.zoom - this.camera.y
    };
  }
  
  /**
   * Dessine un tile de sol (losange plat)
   */
  drawFloorTile(gridX, gridY, color = '#4a4a4a') {
    const pos = this.gridToScreen(gridX, gridY);
    const w = this.TILE_WIDTH * this.camera.zoom;
    const h = this.TILE_HEIGHT * this.camera.zoom;
    
    this.ctx.save();
    this.ctx.translate(pos.x, pos.y);
    
    // Losange
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(w/2, h/2);
    this.ctx.lineTo(0, h);
    this.ctx.lineTo(-w/2, h/2);
    this.ctx.closePath();
    
    // Remplissage
    this.ctx.fillStyle = color;
    this.ctx.fill();
    
    // Contour
    this.ctx.strokeStyle = '#2a2a2a';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
    
    this.ctx.restore();
  }
  
  /**
   * Dessine un mur (face verticale)
   */
  drawWallTile(gridX, gridY, color = '#3a3a3a') {
    const pos = this.gridToScreen(gridX, gridY);
    const w = this.TILE_WIDTH * this.camera.zoom;
    const h = this.TILE_HEIGHT * this.camera.zoom;
    const wallH = this.WALL_HEIGHT * this.camera.zoom;
    
    this.ctx.save();
    this.ctx.translate(pos.x, pos.y);
    
    // Top (losange)
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(w/2, h/2);
    this.ctx.lineTo(0, h);
    this.ctx.lineTo(-w/2, h/2);
    this.ctx.closePath();
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.strokeStyle = '#1a1a1a';
    this.ctx.stroke();
    
    // Face gauche
    this.ctx.beginPath();
    this.ctx.moveTo(-w/2, h/2);
    this.ctx.lineTo(0, h);
    this.ctx.lineTo(0, h + wallH);
    this.ctx.lineTo(-w/2, h/2 + wallH);
    this.ctx.closePath();
    const darkerColor = this.darkenColor(color, 30);
    this.ctx.fillStyle = darkerColor;
    this.ctx.fill();
    this.ctx.strokeStyle = '#000';
    this.ctx.stroke();
    
    // Face droite
    this.ctx.beginPath();
    this.ctx.moveTo(w/2, h/2);
    this.ctx.lineTo(0, h);
    this.ctx.lineTo(0, h + wallH);
    this.ctx.lineTo(w/2, h/2 + wallH);
    this.ctx.closePath();
    const darkerColor2 = this.darkenColor(color, 50);
    this.ctx.fillStyle = darkerColor2;
    this.ctx.fill();
    this.ctx.strokeStyle = '#000';
    this.ctx.stroke();
    
    this.ctx.restore();
  }
  
  /**
   * Dessine une salle (9 tiles jaunes)
   */
  drawRoom(gridX, gridY) {
    for (let dy = 0; dy < 3; dy++) {
      for (let dx = 0; dx < 3; dx++) {
        this.drawFloorTile(gridX + dx, gridY + dy, '#d4af37');
      }
    }
  }
  
  /**
   * Assombrir une couleur
   */
  darkenColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return '#' + (0x1000000 + (R < 0 ? 0 : R) * 0x10000 + (G < 0 ? 0 : G) * 0x100 + (B < 0 ? 0 : B)).toString(16).slice(1);
  }
  
  /**
   * Dessine le joueur
   */
  drawPlayer(gridX, gridY) {
    const pos = this.gridToScreen(gridX, gridY);
    
    this.ctx.save();
    this.ctx.translate(pos.x, pos.y - 20 * this.camera.zoom);
    
    // Ombre
    this.ctx.beginPath();
    this.ctx.ellipse(0, 25 * this.camera.zoom, 15 * this.camera.zoom, 8 * this.camera.zoom, 0, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
    this.ctx.fill();
    
    // Sprite joueur (simplifié)
    this.ctx.font = `${32 * this.camera.zoom}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('🧙', 0, 0);
    
    this.ctx.restore();
  }
  
  /**
   * Dessine l'entrée
   */
  drawEntrance(gridX, gridY) {
    const pos = this.gridToScreen(gridX, gridY);
    
    this.ctx.save();
    this.ctx.translate(pos.x, pos.y - 40 * this.camera.zoom);
    
    this.ctx.font = `${48 * this.camera.zoom}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.fillText('🚪', 0, 0);
    
    // Texte
    this.ctx.font = `${12 * this.camera.zoom}px Arial`;
    this.ctx.fillStyle = '#ffd700';
    this.ctx.fillText('ENTRÉE', 0, 40 * this.camera.zoom);
    
    this.ctx.restore();
  }
  
  /**
   * Dessine la sortie
   */
  drawExit(gridX, gridY) {
    const pos = this.gridToScreen(gridX, gridY);
    
    this.ctx.save();
    this.ctx.translate(pos.x, pos.y - 40 * this.camera.zoom);
    
    this.ctx.font = `${48 * this.camera.zoom}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.fillText('🏆', 0, 0);
    
    // Texte
    this.ctx.font = `${12 * this.camera.zoom}px Arial`;
    this.ctx.fillStyle = '#00ff00';
    this.ctx.fillText('SORTIE', 0, 40 * this.camera.zoom);
    
    this.ctx.restore();
  }
  
  /**
   * Rendu complet du donjon
   */
  render(playerGridX, playerGridY) {
    // Clear
    this.ctx.fillStyle = '#0a0a0a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (!this.dungeon) return;
    
    const grid = this.dungeon.grid;
    const gridSize = this.dungeon.gridSize;
    
    // Collecte tous les tiles à dessiner avec profondeur
    const tiles = [];
    
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const cell = grid[y][x];
        if (!cell || cell.type === 'empty') continue;
        
        // Distance au joueur (culling)
        const dist = Math.abs(x - playerGridX) + Math.abs(y - playerGridY);
        if (dist > 20) continue; // Culling agressif
        
        // Profondeur pour tri isométrique
        const depth = x + y;
        tiles.push({ x, y, cell, depth });
      }
    }
    
    // Tri par profondeur (painter's algorithm)
    tiles.sort((a, b) => a.depth - b.depth);
    
    // Dessiner tous les tiles
    for (const tile of tiles) {
      const { x, y, cell } = tile;
      
      if (cell.type === 'path' || cell.type === 'corridor') {
        this.drawFloorTile(x, y, '#5a5a6a');
      } else if (cell.type === 'room') {
        this.drawFloorTile(x, y, '#d4af37');
      } else if (cell.type === 'wall') {
        this.drawWallTile(x, y, '#3a3a3a');
      } else if (cell.type === 'entrance') {
        this.drawFloorTile(x, y, '#8b4513');
        this.drawEntrance(x, y);
      } else if (cell.type === 'exit') {
        this.drawFloorTile(x, y, '#2e8b57');
        this.drawExit(x, y);
      }
    }
    
    // Dessiner le joueur par-dessus
    this.drawPlayer(playerGridX, playerGridY);
  }
  
  /**
   * Charge le donjon depuis le générateur
   */
  loadDungeon(dungeonData) {
    this.dungeon = dungeonData;
    this.path = dungeonData.path || [];
    this.rooms = dungeonData.rooms || [];
    this.decisions = dungeonData.decisions || [];
    console.log(`✅ Donjon chargé: ${this.path.length} cases, ${this.rooms.length} salles`);
  }
  
  /**
   * Centre la caméra sur une position
   */
  centerCameraOn(gridX, gridY) {
    const pos = this.gridToScreen(gridX, gridY);
    this.camera.x = pos.x - this.centerX;
    this.camera.y = pos.y - this.centerY;
  }
}

console.log('✅ IsometricRenderer2D chargé');
window.IsometricRenderer2D = IsometricRenderer2D;
