/**
 * 🎨 ISOMETRIC 3D RENDERER - DIABLO/HADES/DARKEST DUNGEON STYLE
 * THE LAST COVENANT
 * 
 * Rendu isométrique 2.5D lugubre avec:
 * - Murs HAUTS avec volume réel
 * - Sol en dalles avec relief
 * - Éclairage dynamique (torches)
 * - Ombres portées
 * - Particules (brume, poussière)
 * - Ambiance oppressante
 */

class IsometricDungeonRenderer {
  constructor(canvasId, config = {}) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');

    // Configuration
    this.config = {
      tileWidth: config.tileWidth || 64,
      tileHeight: config.tileHeight || 32,
      wallHeight: config.wallHeight || 96,  // Murs HAUTS (3x tileHeight)
      tileDepth: config.tileDepth || 16,    // Profondeur du sol
      ...config
    };

    // Dimensions canvas
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    // Caméra
    this.camera = {
      x: 0,
      y: 0,
      zoom: 1.5,
      target: null,
      smoothing: 0.1
    };

    // Lighting
    this.lights = [];
    this.ambientLight = 0.2; // Très sombre (20% seulement)

    // Particules
    this.particles = [];

    // Layers de rendu (ordre d'affichage)
    this.renderLayers = {
      floor: [],
      walls: [],
      entities: [],
      effects: []
    };

    console.log('🎨 IsometricDungeonRenderer initialisé (Style Diablo/Hades)');
  }

  // ═══════════════════════════════════════════════════════════════
  // CONVERSION COORDONNÉES ISO
  // ═══════════════════════════════════════════════════════════════

  /**
   * Convertit coordonnées cartésiennes en isométriques
   */
  toIso(x, y) {
    const isoX = (x - y) * (this.config.tileWidth / 2);
    const isoY = (x + y) * (this.config.tileHeight / 2);
    return { x: isoX, y: isoY };
  }

  /**
   * Convertit coordonnées isométriques en cartésiennes
   */
  fromIso(isoX, isoY) {
    const x = (isoX / (this.config.tileWidth / 2) + isoY / (this.config.tileHeight / 2)) / 2;
    const y = (isoY / (this.config.tileHeight / 2) - isoX / (this.config.tileWidth / 2)) / 2;
    return { x, y };
  }

  /**
   * Applique la caméra aux coordonnées
   */
  applyCamera(x, y) {
    return {
      x: (x - this.camera.x) * this.camera.zoom + this.width / 2,
      y: (y - this.camera.y) * this.camera.zoom + this.height / 2
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDU PRINCIPAL
  // ═══════════════════════════════════════════════════════════════

  render(dungeon, player) {
    // Clear
    this.ctx.fillStyle = '#0a0a0f'; // Noir profond
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Mise à jour caméra (suit le joueur)
    if (player) {
      this.updateCamera(player);
    }

    // Préparer les layers
    this.prepareRenderLayers(dungeon, player);

    // Render dans l'ordre (back to front)
    this.renderFloorLayer();
    this.renderWallsLayer();
    this.renderEntitiesLayer();
    this.renderParticles();
    this.renderEffectsLayer();

    // Post-processing
    this.applyVignette();
    // this.applyGrain(); // DÉSACTIVÉ : Trop lourd (freeze)
  }

  prepareRenderLayers(dungeon, player) {
    this.renderLayers.floor = [];
    this.renderLayers.walls = [];
    this.renderLayers.entities = [];
    this.renderLayers.effects = [];

    // Trier les nodes par profondeur (Y puis X)
    const sortedNodes = dungeon.nodes.slice().sort((a, b) => {
      if (a.y !== b.y) return a.y - b.y;
      return a.x - b.x;
    });

    sortedNodes.forEach(node => {
      const iso = this.toIso(node.x, node.y);
      const screen = this.applyCamera(iso.x, iso.y);

      this.renderLayers.floor.push({ node, iso, screen });
      this.renderLayers.walls.push({ node, iso, screen });
    });

    // Ajouter le joueur
    if (player) {
      const playerIso = this.toIso(player.x, player.y);
      const playerScreen = this.applyCamera(playerIso.x, playerIso.y);
      this.renderLayers.entities.push({ type: 'player', player, iso: playerIso, screen: playerScreen });
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDU DU SOL (AVEC VOLUME)
  // ═══════════════════════════════════════════════════════════════

  renderFloorLayer() {
    this.renderLayers.floor.forEach(({ node, iso, screen }) => {
      this.drawFloorTile(screen.x, screen.y, node);
    });
  }

  drawFloorTile(x, y, node) {
    const tw = this.config.tileWidth * this.camera.zoom;
    const th = this.config.tileHeight * this.camera.zoom;
    const td = this.config.tileDepth * this.camera.zoom;

    this.ctx.save();

    // ═══════════════════════════════════════════════════════════
    // DESSINER LE DESSUS (SURFACE DE LA DALLE)
    // ═══════════════════════════════════════════════════════════

    this.ctx.beginPath();
    this.ctx.moveTo(x, y);                    // Haut
    this.ctx.lineTo(x + tw / 2, y + th / 2);  // Droite
    this.ctx.lineTo(x, y + th);               // Bas
    this.ctx.lineTo(x - tw / 2, y + th / 2);  // Gauche
    this.ctx.closePath();

    // Couleur selon le type
    const baseColor = this.getFloorColor(node);
    this.ctx.fillStyle = baseColor;
    this.ctx.fill();

    // Bordure sombre
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();

    // ═══════════════════════════════════════════════════════════
    // DESSINER LA PROFONDEUR (CÔTÉ VISIBLE)
    // ═══════════════════════════════════════════════════════════

    // Côté droit (plus clair)
    this.ctx.beginPath();
    this.ctx.moveTo(x + tw / 2, y + th / 2);
    this.ctx.lineTo(x + tw / 2, y + th / 2 + td);
    this.ctx.lineTo(x, y + th + td);
    this.ctx.lineTo(x, y + th);
    this.ctx.closePath();

    const rgb = this.hexToRgb(baseColor);
    this.ctx.fillStyle = `rgb(${rgb.r * 0.7}, ${rgb.g * 0.7}, ${rgb.b * 0.7})`;
    this.ctx.fill();
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.stroke();

    // Côté gauche (plus sombre)
    this.ctx.beginPath();
    this.ctx.moveTo(x - tw / 2, y + th / 2);
    this.ctx.lineTo(x - tw / 2, y + th / 2 + td);
    this.ctx.lineTo(x, y + th + td);
    this.ctx.lineTo(x, y + th);
    this.ctx.closePath();

    this.ctx.fillStyle = `rgb(${rgb.r * 0.5}, ${rgb.g * 0.5}, ${rgb.b * 0.5})`;
    this.ctx.fill();
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    this.ctx.stroke();

    // ═══════════════════════════════════════════════════════════
    // DÉTAILS PROCÉDURAUX (FISSURES, TEXTURE)
    // ═══════════════════════════════════════════════════════════

    if (Math.random() < 0.3) {
      this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
      this.ctx.lineWidth = 1;
      this.ctx.beginPath();
      this.ctx.moveTo(x - tw / 4 + Math.random() * 10, y + th / 2);
      this.ctx.lineTo(x + tw / 4 + Math.random() * 10, y + th / 2 + th / 4);
      this.ctx.stroke();
    }

    this.ctx.restore();
  }

  getFloorColor(node) {
    switch (node.type) {
      case 'destiny':
        return '#3a2a5a'; // Violet sombre (Nœud de Destin)
      case 'corrupted':
        return '#3d1010'; // Rouge sang sombre
      case 'combat':
        return '#2a1f1f'; // Brun sale
      case 'treasure':
        return '#2a2a1a'; // Or pâle
      case 'rest':
        return '#1f2a2a'; // Bleu-vert sombre
      case 'shop':
        return '#2a2218'; // Cuivre
      default:
        return '#1a1a22'; // Pierre noire (défaut)
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDU DES MURS (HAUTS, AVEC VOLUME)
  // ═══════════════════════════════════════════════════════════════

  renderWallsLayer() {
    this.renderLayers.walls.forEach(({ node, iso, screen }) => {
      // Vérifier si des voisins manquent → dessiner un mur
      const neighbors = this.getNeighbors(node);
      
      if (!neighbors.north) this.drawWall(screen.x, screen.y, 'north');
      if (!neighbors.east) this.drawWall(screen.x, screen.y, 'east');
      if (!neighbors.south) this.drawWall(screen.x, screen.y, 'south');
      if (!neighbors.west) this.drawWall(screen.x, screen.y, 'west');
    });
  }

  drawWall(x, y, direction) {
    const tw = this.config.tileWidth * this.camera.zoom;
    const th = this.config.tileHeight * this.camera.zoom;
    const wh = this.config.wallHeight * this.camera.zoom;

    this.ctx.save();

    // Couleur mur (pierre gothique)
    const wallColor = '#18181f';
    const wallHighlight = '#25252f';
    const wallShadow = '#0d0d12';

    switch (direction) {
      case 'north':
        // Face avant gauche
        this.ctx.beginPath();
        this.ctx.moveTo(x - tw / 2, y + th / 2);
        this.ctx.lineTo(x, y);
        this.ctx.lineTo(x, y - wh);
        this.ctx.lineTo(x - tw / 2, y + th / 2 - wh);
        this.ctx.closePath();
        
        this.ctx.fillStyle = wallShadow;
        this.ctx.fill();
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        // Détails gothiques
        this.drawWallDetails(x - tw / 4, y + th / 4 - wh / 2, wh);
        break;

      case 'east':
        // Face avant droite
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + tw / 2, y + th / 2);
        this.ctx.lineTo(x + tw / 2, y + th / 2 - wh);
        this.ctx.lineTo(x, y - wh);
        this.ctx.closePath();
        
        this.ctx.fillStyle = wallColor;
        this.ctx.fill();
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        // Détails gothiques
        this.drawWallDetails(x + tw / 4, y + th / 4 - wh / 2, wh);
        break;

      case 'south':
        // Arrière (rarement visible)
        break;

      case 'west':
        // Gauche (rarement visible)
        break;
    }

    this.ctx.restore();
  }

  drawWallDetails(x, y, height) {
    // Briques verticales
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.lineWidth = 1;

    for (let i = 0; i < 3; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x + i * 8, y - height / 4);
      this.ctx.lineTo(x + i * 8, y + height / 4);
      this.ctx.stroke();
    }

    // Fissures
    if (Math.random() < 0.2) {
      this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.beginPath();
      this.ctx.moveTo(x, y - height / 3);
      this.ctx.lineTo(x + 5, y);
      this.ctx.stroke();
    }
  }

  getNeighbors(node) {
    // Placeholder : À connecter avec dungeon.getConnectedNodes()
    return {
      north: false,
      east: false,
      south: false,
      west: false
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDU DES ENTITÉS (JOUEUR, ENNEMIS)
  // ═══════════════════════════════════════════════════════════════

  renderEntitiesLayer() {
    this.renderLayers.entities.forEach(({ type, player, iso, screen }) => {
      if (type === 'player') {
        this.drawPlayer(screen.x, screen.y, player);
      }
    });
  }

  drawPlayer(x, y, player) {
    const size = 20 * this.camera.zoom;

    // Ombre
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.beginPath();
    this.ctx.ellipse(x, y + size, size * 0.6, size * 0.3, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Corps (cube simple pour l'instant)
    this.ctx.fillStyle = '#d4af37'; // Or
    this.ctx.fillRect(x - size / 2, y - size * 1.5, size, size * 1.5);

    // Contour
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x - size / 2, y - size * 1.5, size, size * 1.5);

    // Indicateur Nœud de Destin au-dessus
    if (player.isOnDestinyNode) {
      this.ctx.fillStyle = '#9d4edd';
      this.ctx.font = '24px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('🎲', x, y - size * 2);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // PARTICULES (BRUME, POUSSIÈRE)
  // ═══════════════════════════════════════════════════════════════

  renderParticles() {
    this.particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.01;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        return;
      }

      this.ctx.fillStyle = `rgba(200, 200, 200, ${p.life * 0.2})`;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  spawnParticles(x, y, count = 10) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2 - 1,
        size: Math.random() * 3 + 1,
        life: 1
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // POST-PROCESSING
  // ═══════════════════════════════════════════════════════════════

  applyVignette() {
    const gradient = this.ctx.createRadialGradient(
      this.width / 2, this.height / 2, this.height * 0.3,
      this.width / 2, this.height / 2, this.height * 0.8
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  applyGrain() {
    const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 20;
      data[i] += noise;
      data[i + 1] += noise;
      data[i + 2] += noise;
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  renderEffectsLayer() {
    // Effets spéciaux (sorts, explosions, etc.)
  }

  // ═══════════════════════════════════════════════════════════════
  // CAMÉRA
  // ═══════════════════════════════════════════════════════════════

  updateCamera(player) {
    const playerIso = this.toIso(player.x, player.y);
    
    // Smooth suivide caméra
    this.camera.x += (playerIso.x - this.camera.x) * this.camera.smoothing;
    this.camera.y += (playerIso.y - this.camera.y) * this.camera.smoothing;
  }

  // ═══════════════════════════════════════════════════════════════
  // UTILITAIRES
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

// ═══════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════

if (typeof window !== 'undefined') {
  window.IsometricDungeonRenderer = IsometricDungeonRenderer;
}
