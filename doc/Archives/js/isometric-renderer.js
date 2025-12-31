/**
 * 🎨 ISOMETRIC 2.5D RENDERER - STYLE HADES
 * THE LAST COVENANT - Version Lugubre
 *
 * Rendu isométrique type Hades avec :
 * - Murs hauts verticaux
 * - Tuiles qui se touchent
 * - Grille de dalles
 * - Zoom rapproché
 * - Minimap
 */

class IsometricRenderer {
  constructor(canvasId, config = {}) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');

    // Configuration
    this.config = {
      tileWidth: config.tileWidth || 80,      // Plus large pour mieux voir
      tileHeight: config.tileHeight || 40,    // Plus haut
      tileDepth: config.tileDepth || 20,
      wallHeight: config.wallHeight || 120,   // Murs hauts (style Hades)
      scale: config.scale || 1.0,
      darkMode: config.darkMode !== false,
      ...config
    };

    // Dimensions
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    // Caméra
    this.camera = {
      x: 0,
      y: 0,
      zoom: 2.5,  // Zoom rapproché (style Hades)
      shake: 0,
      target: null
    };

    // Système de path organique (style Howling Gate)
    this.organicPath = [];  // Sera généré : [{x, y, direction}, ...]
    this.pathGenerated = false;

    // Textures procédurales (générées)
    this.textures = {};
    this.generateTextures();

    // Particules
    this.particles = [];

    // Minimap
    this.minimap = {
      x: this.width - 220,
      y: 20,
      width: 200,
      height: 200,
      tileSize: 4
    };

    // Post-processing
    this.postFX = {
      vignette: 0.7,
      grain: 0.15,
      chromaticAberration: 2,
      bloom: 0.3
    };

    console.log('🎨 IsometricRenderer (Style Hades) initialisé');
  }

  // ═══════════════════════════════════════════════════════════════
  // GÉNÉRATION DE TEXTURES PROCÉDURALES
  // ═══════════════════════════════════════════════════════════════

  generateTextures() {
    console.log('🖼️ Génération des textures procédurales...');

    // Texture 1 : Pierre sombre (sol normal) - Style médiéval
    this.textures.stone = this.generateStoneTexture(256, {
      baseColor: '#2a2832',
      variation: 20,
      cracks: 12,
      noise: 4000
    });

    // Texture 2 : Pierre corrompue (sentier profané) - Rouge sang
    this.textures.corrupted = this.generateCorruptedTexture(256, {
      baseColor: '#3d1010',
      veins: 18,
      pulse: true
    });

    // Texture 3 : Pierre claire (vieille route)
    this.textures.light = this.generateStoneTexture(256, {
      baseColor: '#3a3844',
      variation: 15,
      cracks: 8,
      noise: 3000
    });

    // Texture 4 : Sol d'os (défilé des os)
    this.textures.bones = this.generateBonesTexture(256);

    // Texture 5 : Sol de brume (spirale du hasard)
    this.textures.mist = this.generateMistTexture(256);

    // Texture 6 : Mur gothique
    this.textures.wall = this.generateWallTexture(256, 512);

    console.log('✅ Textures générées:', Object.keys(this.textures).length);
  }

  generateStoneTexture(size, options = {}) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');

    const baseColor = options.baseColor || '#2a2832';
    const variation = options.variation || 20;
    const cracks = options.cracks || 12;
    const noise = options.noise || 4000;

    // Base sombre
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, size, size);

    // Variations de couleur (noise)
    for (let i = 0; i < noise; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const bright = Math.random() * variation - variation / 2;

      const rgb = this.hexToRgb(baseColor);
      const r = Math.max(0, Math.min(255, rgb.r + bright));
      const g = Math.max(0, Math.min(255, rgb.g + bright));
      const b = Math.max(0, Math.min(255, rgb.b + bright));

      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.4)`;
      ctx.fillRect(x, y, 2, 2);
    }

    // Fissures (style dalles anciennes)
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < cracks; i++) {
      ctx.beginPath();
      const startX = Math.random() * size;
      const startY = Math.random() * size;
      ctx.moveTo(startX, startY);

      // Fissure sinueuse
      let x = startX, y = startY;
      const segments = 5 + Math.floor(Math.random() * 10);
      for (let j = 0; j < segments; j++) {
        x += (Math.random() - 0.5) * 30;
        y += (Math.random() - 0.5) * 30;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Ombres dans les fissures
    ctx.shadowBlur = 4;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.stroke();
    ctx.shadowBlur = 0;

    return canvas;
  }

  generateCorruptedTexture(size, options = {}) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');

    const baseColor = options.baseColor || '#3d1010';
    const veins = options.veins || 18;

    // Base rouge sombre
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, size, size);

    // Veines de corruption (rouge/noir organiques)
    for (let i = 0; i < veins; i++) {
      ctx.strokeStyle = `rgba(${120 + Math.random() * 60}, ${10 + Math.random() * 20}, ${10 + Math.random() * 20}, ${0.4 + Math.random() * 0.4})`;
      ctx.lineWidth = 2 + Math.random() * 5;

      ctx.beginPath();
      const startX = Math.random() * size;
      const startY = Math.random() * size;
      ctx.moveTo(startX, startY);

      // Veine organique
      let x = startX, y = startY;
      const segments = 10 + Math.floor(Math.random() * 15);
      for (let j = 0; j < segments; j++) {
        x += (Math.random() - 0.5) * 40;
        y += (Math.random() - 0.5) * 40;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Zones de moisissure noire
    for (let i = 0; i < 25; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const radius = 8 + Math.random() * 20;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Noise sombre
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.4})`;
      ctx.fillRect(x, y, 1, 1);
    }

    return canvas;
  }

  generateBonesTexture(size) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Base sombre
    ctx.fillStyle = '#1a1414';
    ctx.fillRect(0, 0, size, size);

    // Os éparpillés
    for (let i = 0; i < 18; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const length = 12 + Math.random() * 35;
      const angle = Math.random() * Math.PI * 2;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      // Os (rectangle arrondi beige)
      ctx.fillStyle = `rgba(200, 190, 170, ${0.35 + Math.random() * 0.35})`;
      ctx.beginPath();
      ctx.roundRect(-length/2, -4, length, 8, 4);
      ctx.fill();

      ctx.restore();
    }

    // Taches de sang séché
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const radius = 8 + Math.random() * 20;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, 'rgba(60, 0, 0, 0.6)');
      gradient.addColorStop(1, 'rgba(60, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    return canvas;
  }

  generateMistTexture(size) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Base violette sombre
    ctx.fillStyle = '#1a1428';
    ctx.fillRect(0, 0, size, size);

    // Brumes violettes
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const radius = 25 + Math.random() * 60;

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(100, 80, 120, ${0.25 + Math.random() * 0.35})`);
      gradient.addColorStop(1, 'rgba(100, 80, 120, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    return canvas;
  }

  generateWallTexture(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Base très sombre (mur gothique)
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0a0a0f');
    gradient.addColorStop(0.3, '#1a1820');
    gradient.addColorStop(1, '#0a0a0f');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Briques horizontales
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.lineWidth = 2;
    for (let y = 20; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Lignes verticales (briques)
    for (let y = 20; y < height; y += 30) {
      const offset = (y / 30) % 2 === 0 ? 0 : width / 2;
      for (let x = offset; x < width; x += width) {
        ctx.beginPath();
        ctx.moveTo(x, y - 15);
        ctx.lineTo(x, y + 15);
        ctx.stroke();
      }
    }

    // Mousse/moisissure verte sombre
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = 10 + Math.random() * 30;

      const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
      grad.addColorStop(0, 'rgba(20, 40, 20, 0.3)');
      grad.addColorStop(1, 'rgba(20, 40, 20, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    return canvas;
  }

  // ═══════════════════════════════════════════════════════════════
  // CONVERSIONS ISOMÉTRIQUES
  // ═══════════════════════════════════════════════════════════════

  cartesianToIso(x, y) {
    const isoX = (x - y) * (this.config.tileWidth / 2);
    const isoY = (x + y) * (this.config.tileHeight / 2);
    return { x: isoX, y: isoY };
  }

  isoToCartesian(isoX, isoY) {
    const x = (isoX / (this.config.tileWidth / 2) + isoY / (this.config.tileHeight / 2)) / 2;
    const y = (isoY / (this.config.tileHeight / 2) - isoX / (this.config.tileWidth / 2)) / 2;
    return { x, y };
  }

  worldToScreen(worldX, worldY) {
    const shake = this.camera.shake > 0 ? (Math.random() - 0.5) * this.camera.shake : 0;

    return {
      x: (worldX - this.camera.x) * this.camera.zoom + this.width / 2 + shake,
      y: (worldY - this.camera.y) * this.camera.zoom + this.height / 2 + shake
    };
  }

  /**
   * Génère un chemin organique en GRILLE CARTÉSIENNE (comme WADE)
   * Puis conversion ISO automatique garantit l'adjacence
   */
  generateOrganicPath(length) {
    const path = [];
    const directions = {
      NORTH: { dx: 0, dy: -1, name: 'NORTH' },
      EAST: { dx: 1, dy: 0, name: 'EAST' },
      SOUTH: { dx: 0, dy: 1, name: 'SOUTH' },
      WEST: { dx: -1, dy: 0, name: 'WEST' }
    };

    const dirArray = Object.values(directions);

    // GRILLE CARTÉSIENNE (x, y) - comme dans le tutoriel WADE
    let cartX = 0;
    let cartY = 0;
    let currentDir = directions.EAST;

    // Garder trace des positions CARTÉSIENNES occupées
    const occupiedPositions = new Set();
    occupiedPositions.add(`${cartX},${cartY}`);

    path.push({ x: cartX, y: cartY, direction: currentDir.name });

    for (let i = 1; i < length; i++) {
      let nextX, nextY, nextDir;
      let attempts = 0;
      let validMove = false;

      while (!validMove && attempts < 20) {
        // Probabilités de changement de direction
        const rand = Math.random();

        if (rand < 0.6) {
          // 60% : Continuer tout droit
          nextDir = currentDir;
        } else if (rand < 0.85) {
          // 25% : Tourner à gauche ou droite
          const currentDirIndex = dirArray.findIndex(d => d.name === currentDir.name);
          const turn = Math.random() < 0.5 ? 1 : -1; // Gauche ou droite
          nextDir = dirArray[(currentDirIndex + turn + 4) % 4];
        } else {
          // 15% : Changer complètement de direction (pas de demi-tour)
          const currentDirIndex = dirArray.findIndex(d => d.name === currentDir.name);
          const possibleDirs = dirArray.filter((d, idx) => {
            // Éviter demi-tour (direction opposée)
            return Math.abs(idx - currentDirIndex) !== 2;
          });
          nextDir = possibleDirs[Math.floor(Math.random() * possibleDirs.length)];
        }

        // Position CARTÉSIENNE suivante (grille simple)
        nextX = cartX + nextDir.dx;
        nextY = cartY + nextDir.dy;

        // Vérifier si la position est libre
        const posKey = `${nextX},${nextY}`;
        if (!occupiedPositions.has(posKey)) {
          validMove = true;
          occupiedPositions.add(posKey);
        }

        attempts++;
      }

      // Si on n'a pas trouvé de mouvement valide après 20 essais, forcer un mouvement
      if (!validMove) {
        nextX = cartX + currentDir.dx;
        nextY = cartY + currentDir.dy;
        nextDir = currentDir;
      }

      path.push({ x: nextX, y: nextY, direction: nextDir.name });

      cartX = nextX;
      cartY = nextY;
      currentDir = nextDir;
    }

    console.log(`🗺️ Path organique généré: ${path.length} tuiles (GRILLE CARTÉSIENNE → ISO)`);

    // DEBUG : Afficher les premières tuiles
    console.log('📍 Premières tuiles (coordonnées CARTÉSIENNES):');
    path.slice(0, 10).forEach((tile, i) => {
      console.log(`  Tuile ${i}: cart(${tile.x}, ${tile.y}) direction: ${tile.direction}`);
    });

    return path;
  }

  /**
   * Retourne position ISO depuis coordonnées CARTÉSIENNES du path
   * Utilise la formule iso standard pour garantir adjacence
   */
  indexToIso(index) {
    // Récupérer coordonnées cartésiennes
    if (this.organicPath && index < this.organicPath.length) {
      const cartX = this.organicPath[index].x;
      const cartY = this.organicPath[index].y;

      // Conversion CART → ISO (formule standard)
      return this.cartesianToIso(cartX, cartY);
    }

    // Fallback si path pas encore généré ou index hors limites
    return { x: 0, y: 0 };
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDU PRINCIPAL
  // ═══════════════════════════════════════════════════════════════

  render(dungeon, player, nodes = []) {
    // Générer le path organique si pas encore fait
    if (!this.pathGenerated && dungeon && dungeon.path) {
      this.dungeonLength = dungeon.path.length;
      this.organicPath = this.generateOrganicPath(this.dungeonLength);
      this.pathGenerated = true;
    }

    // Clear
    this.ctx.fillStyle = '#0a0a0f';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Centrer caméra sur joueur
    if (player) {
      this.centerCameraOn(player.position || 0, dungeon);
    }

    // Layer 1 : Background
    this.renderBackground();

    // Layer 2 : Murs verticaux (DÉSACTIVÉ pour debug)
    // this.renderWalls(dungeon);

    // Layer 3 : Dungeon tiles
    this.renderDungeonPath(dungeon);

    // Layer 4 : Nodes (DÉSACTIVÉ pour debug)
    // this.renderNodes(nodes, dungeon);

    // Layer 5 : Entities
    this.renderPlayer(player, dungeon);

    // Layer 6 : Particules (DÉSACTIVÉ pour debug)
    // this.updateAndRenderParticles();

    // Layer 7 : Minimap (DÉSACTIVÉ pour debug)
    // this.renderMinimap(dungeon, player);

    // Layer 8 : Post-FX (DÉSACTIVÉ pour debug)
    // this.applyPostProcessing();

    // Décrémenter shake
    if (this.camera.shake > 0) {
      this.camera.shake *= 0.9;
      if (this.camera.shake < 0.1) this.camera.shake = 0;
    }
  }

  renderBackground() {
    // Gradient sombre
    const gradient = this.ctx.createRadialGradient(
      this.width / 2, this.height / 2, 0,
      this.width / 2, this.height / 2, this.width / 1.2
    );
    gradient.addColorStop(0, 'rgba(15, 12, 18, 0.3)');
    gradient.addColorStop(1, 'rgba(5, 5, 8, 0.9)');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  /**
   * NOUVEAU : Render murs hauts verticaux (style Hades)
   */
  renderWalls(dungeon) {
    if (!dungeon || !dungeon.path) return;

    dungeon.path.forEach((tile, index) => {
      const iso = this.indexToIso(index);
      const screen = this.worldToScreen(iso.x, iso.y);

      // Mur arrière (face nord-ouest)
      this.ctx.save();
      this.ctx.translate(screen.x, screen.y);

      // Gradient vertical (haut sombre → bas clair)
      const wallGradient = this.ctx.createLinearGradient(
        0, -this.config.wallHeight,
        0, 0
      );
      wallGradient.addColorStop(0, '#0a0a0f');
      wallGradient.addColorStop(0.5, '#1a1820');
      wallGradient.addColorStop(1, '#2a2832');

      // Face gauche du mur (isométrique)
      this.ctx.fillStyle = 'rgba(10, 10, 15, 0.9)';
      this.ctx.beginPath();
      this.ctx.moveTo(-this.config.tileWidth / 2, -this.config.wallHeight);
      this.ctx.lineTo(-this.config.tileWidth / 2, this.config.tileHeight / 4);
      this.ctx.lineTo(0, 0);
      this.ctx.lineTo(0, -this.config.wallHeight + this.config.tileHeight / 4);
      this.ctx.closePath();
      this.ctx.fill();

      // Face droite du mur
      this.ctx.fillStyle = 'rgba(15, 15, 20, 0.9)';
      this.ctx.beginPath();
      this.ctx.moveTo(this.config.tileWidth / 2, -this.config.wallHeight);
      this.ctx.lineTo(this.config.tileWidth / 2, this.config.tileHeight / 4);
      this.ctx.lineTo(0, 0);
      this.ctx.lineTo(0, -this.config.wallHeight + this.config.tileHeight / 4);
      this.ctx.closePath();
      this.ctx.fill();

      // Bordure sombre
      this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();

      this.ctx.restore();
    });
  }

  renderDungeonPath(dungeon) {
    if (!dungeon || !dungeon.path) return;

    dungeon.path.forEach((tile, index) => {
      this.renderTile(tile, index, dungeon.path.length);
    });
  }

  renderTile(tile, index, totalTiles) {
    // Récupérer coordonnées cartésiennes du path
    const cart = this.organicPath[index];

    // Calculer les 4 COINS du carré cartésien en coordonnées ISO
    const corner1 = this.cartesianToIso(cart.x, cart.y);           // Nord-Ouest
    const corner2 = this.cartesianToIso(cart.x + 1, cart.y);       // Nord-Est
    const corner3 = this.cartesianToIso(cart.x + 1, cart.y + 1);   // Sud-Est
    const corner4 = this.cartesianToIso(cart.x, cart.y + 1);       // Sud-Ouest

    this.ctx.save();

    // Dessiner les 4 coins en coordonnées MONDE (pas relatives!)
    const screenNW = this.worldToScreen(corner1.x, corner1.y);
    const screenNE = this.worldToScreen(corner2.x, corner2.y);
    const screenSE = this.worldToScreen(corner3.x, corner3.y);
    const screenSW = this.worldToScreen(corner4.x, corner4.y);

    // Dessiner le losange avec coordonnées écran ABSOLUES
    this.ctx.fillStyle = '#3a3844';
    this.ctx.beginPath();
    this.ctx.moveTo(screenNW.x, screenNW.y);
    this.ctx.lineTo(screenNE.x, screenNE.y);
    this.ctx.lineTo(screenSE.x, screenSE.y);
    this.ctx.lineTo(screenSW.x, screenSW.y);
    this.ctx.closePath();
    this.ctx.fill();

    // Bordures ÉPAISSES pour voir les connexions
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(screenNW.x, screenNW.y);
    this.ctx.lineTo(screenNE.x, screenNE.y);
    this.ctx.lineTo(screenSE.x, screenSE.y);
    this.ctx.lineTo(screenSW.x, screenSW.y);
    this.ctx.closePath();
    this.ctx.stroke();

    // Dessiner des POINTS ROUGES aux coins pour debug
    this.ctx.fillStyle = '#f00';
    this.ctx.fillRect(screenNW.x - 3, screenNW.y - 3, 6, 6);
    this.ctx.fillStyle = '#0f0';
    this.ctx.fillRect(screenNE.x - 3, screenNE.y - 3, 6, 6);
    this.ctx.fillStyle = '#00f';
    this.ctx.fillRect(screenSE.x - 3, screenSE.y - 3, 6, 6);
    this.ctx.fillStyle = '#ff0';
    this.ctx.fillRect(screenSW.x - 3, screenSW.y - 3, 6, 6);

    // Centre pour les labels
    const centerX = (screenNW.x + screenNE.x + screenSE.x + screenSW.x) / 4;
    const centerY = (screenNW.y + screenNE.y + screenSE.y + screenSW.y) / 4;

    // Numéro de la tuile au centre
    this.ctx.fillStyle = '#fff';
    this.ctx.font = 'bold 18px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(index, centerX, centerY - 10);

    // Position CARTÉSIENNE
    this.ctx.fillStyle = '#0f0';
    this.ctx.font = 'bold 12px monospace';
    this.ctx.fillText(`cart(${cart.x},${cart.y})`, centerX, centerY + 5);

    // Coins ISO absolus
    this.ctx.fillStyle = '#f0f';
    this.ctx.font = '9px monospace';
    this.ctx.fillText(`NW:(${Math.round(corner1.x)},${Math.round(corner1.y)})`, centerX, centerY + 20);
    this.ctx.fillText(`NE:(${Math.round(corner2.x)},${Math.round(corner2.y)})`, centerX, centerY + 30);

    this.ctx.restore();
  }

  renderNodes(nodes, dungeon) {
    if (!nodes || nodes.length === 0) return;

    nodes.forEach(node => {
      const nodePosition = node.position || 8;
      const iso = this.indexToIso(nodePosition);
      const screen = this.worldToScreen(iso.x, iso.y);

      // Rune de Nœud (pulsante)
      const pulse = Math.sin(Date.now() / 500) * 0.2 + 0.8;

      this.ctx.save();
      this.ctx.translate(screen.x, screen.y - 30);
      this.ctx.globalAlpha = pulse;

      // Glow doré
      const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, 50);
      gradient.addColorStop(0, 'rgba(212, 175, 55, 0.9)');
      gradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(-50, -50, 100, 100);

      // Rune (cercle + croix)
      this.ctx.strokeStyle = '#d4af37';
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, 18, 0, Math.PI * 2);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(-12, 0);
      this.ctx.lineTo(12, 0);
      this.ctx.moveTo(0, -12);
      this.ctx.lineTo(0, 12);
      this.ctx.stroke();

      this.ctx.restore();

      // Particules dorées
      if (Math.random() < 0.15) {
        this.addParticle({
          x: screen.x + (Math.random() - 0.5) * 40,
          y: screen.y - 30 + (Math.random() - 0.5) * 40,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -Math.random() * 0.5,
          life: 60,
          color: '#d4af37',
          size: 2
        });
      }
    });
  }

  renderPlayer(player, dungeon) {
    if (!player) return;

    const position = player.position || 0;
    const iso = this.indexToIso(position);
    const screen = this.worldToScreen(iso.x, iso.y);

    // Joueur SIMPLIFIÉ pour debug (petit cercle translucide)
    this.ctx.save();
    this.ctx.translate(screen.x, screen.y - 5);

    // Cercle doré translucide
    this.ctx.fillStyle = 'rgba(212, 175, 55, 0.5)';
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 8, 0, Math.PI * 2);
    this.ctx.fill();

    // Contour blanc
    this.ctx.strokeStyle = '#fff';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    this.ctx.restore();
  }

  // ═══════════════════════════════════════════════════════════════
  // MINIMAP (NOUVEAU - Style Hades)
  // ═══════════════════════════════════════════════════════════════

  renderMinimap(dungeon, player) {
    if (!dungeon || !dungeon.path) return;

    const mm = this.minimap;

    // Fond de minimap
    this.ctx.fillStyle = 'rgba(10, 10, 15, 0.9)';
    this.ctx.fillRect(mm.x, mm.y, mm.width, mm.height);

    // Bordure
    this.ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(mm.x, mm.y, mm.width, mm.height);

    // Dessiner le chemin
    dungeon.path.forEach((tile, index) => {
      const iso = this.indexToIso(index);

      // Calculer position dans minimap (échelle réduite)
      const scale = 0.15; // Réduire pour la minimap
      const minimapX = mm.x + mm.width / 2 + (iso.x * scale);
      const minimapY = mm.y + mm.height / 2 + (iso.y * scale);

      // Couleur selon type
      let color = '#555';
      if (tile.type === 'entrance') color = '#4A90E2';
      else if (tile.type === 'boss') color = '#D0021B';
      else if (tile.corruption > 0) color = '#8B0000';
      else if (tile.safe) color = '#7A7A7A';

      // Dessiner tile minimap
      this.ctx.fillStyle = color;
      this.ctx.fillRect(minimapX, minimapY, mm.tileSize, mm.tileSize);

      // Bordure
      this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.lineWidth = 0.5;
      this.ctx.strokeRect(minimapX, minimapY, mm.tileSize, mm.tileSize);
    });

    // Position du joueur
    if (player) {
      const iso = this.indexToIso(player.position || 0);
      const scale = 0.15;
      const playerX = mm.x + mm.width / 2 + (iso.x * scale);
      const playerY = mm.y + mm.height / 2 + (iso.y * scale);

      this.ctx.fillStyle = '#d4af37';
      this.ctx.beginPath();
      this.ctx.arc(playerX + mm.tileSize / 2, playerY + mm.tileSize / 2, mm.tileSize, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.strokeStyle = '#fff';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    }

    // Label
    this.ctx.fillStyle = '#d4af37';
    this.ctx.font = '12px Cinzel';
    this.ctx.fillText('Carte', mm.x + mm.width / 2, mm.y + mm.height + 15);
  }

  // ═══════════════════════════════════════════════════════════════
  // PARTICULES
  // ═══════════════════════════════════════════════════════════════

  addParticle(particle) {
    this.particles.push(particle);
  }

  updateAndRenderParticles() {
    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      if (p.life <= 0) return false;

      const alpha = p.life / 60;
      this.ctx.fillStyle = p.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
      this.ctx.fillRect(p.x, p.y, p.size, p.size);

      return true;
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // LUMIÈRES
  // ═══════════════════════════════════════════════════════════════

  addLight(x, y, radius, color) {
    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }

  // ═══════════════════════════════════════════════════════════════
  // POST-PROCESSING
  // ═══════════════════════════════════════════════════════════════

  applyPostProcessing() {
    // Vignette massive
    const vignetteGradient = this.ctx.createRadialGradient(
      this.width / 2, this.height / 2, this.width * 0.3,
      this.width / 2, this.height / 2, this.width * 0.75
    );
    vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignetteGradient.addColorStop(1, `rgba(0, 0, 0, ${this.postFX.vignette})`);

    this.ctx.fillStyle = vignetteGradient;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Grain film
    this.ctx.globalAlpha = this.postFX.grain;
    for (let i = 0; i < this.width * this.height * 0.015; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const brightness = Math.random() * 255;
      this.ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
      this.ctx.fillRect(x, y, 1, 1);
    }
    this.ctx.globalAlpha = 1;
  }

  // ═══════════════════════════════════════════════════════════════
  // CAMÉRA
  // ═══════════════════════════════════════════════════════════════

  centerCameraOn(position, dungeon) {
    const iso = this.indexToIso(position);

    // Smooth follow
    const smoothness = 0.1;
    this.camera.x += (iso.x - this.camera.x) * smoothness;
    this.camera.y += (iso.y - this.camera.y) * smoothness;
  }

  shake(intensity = 5) {
    this.camera.shake = intensity;
  }

  zoomTo(zoom) {
    this.camera.zoom = zoom;
  }

  // ═══════════════════════════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════════════════════════

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }
}

// Export
window.IsometricRenderer = IsometricRenderer;
console.log('✅ IsometricRenderer (Style Hades) chargé');
