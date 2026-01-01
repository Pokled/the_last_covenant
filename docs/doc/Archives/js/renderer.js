// 🎨 MOTEUR DE RENDU AMÉLIORÉ
class Renderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.cameraX = 0;
    this.cameraY = 0;
    this.zoom = 1; // Facteur de zoom (1 = 100%)
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.manualControl = false; // true = l'utilisateur contrôle, false = suit le joueur
    
    // 🎨 Cache des images de classe pour les pions
    this.classImages = {};
    this.loadClassImages();
    
    this.setupControls();
    console.log('🎨 Renderer initialisé');
  }
  
  // 🎨 Charger toutes les images de classe
  loadClassImages() {
    // Vérifier si CLASSES existe (anciennes classes)
    if (typeof CLASSES === 'undefined' || !CLASSES) {
      return; // Pas de classes à charger, on utilise les icônes emoji
    }

    Object.entries(CLASSES).forEach(([key, cls]) => {
      const classType = cls.type || key.toLowerCase();

      // Ignorer si pas de type défini
      if (!classType || classType === 'undefined') {
        return;
      }

      const img = new Image();
      img.onload = () => {
        this.classImages[classType] = img;
        // Redraw immédiatement si le jeu est déjà initialisé pour afficher l'image
        if (window.game && typeof window.game.renderer?.draw === 'function') {
          try { window.game.renderer.draw(GameState.dungeon, GameState.players); } catch (e) { /* ignore */ }
        }
      };
      img.onerror = () => {
        // Image non trouvée, on utilisera l'icône emoji à la place (silencieux)
      };
      img.src = `images/classes/${classType}.jpg`;
    });
  }
  
  // Fonction helper pour assombrir une couleur
  darkenColor(color, factor) {
    // Convertir hex en RGB
    let r, g, b;
    if (color.startsWith('#')) {
      const hex = color.substring(1);
      r = parseInt(hex.substr(0, 2), 16);
      g = parseInt(hex.substr(2, 2), 16);
      b = parseInt(hex.substr(4, 2), 16);
    } else {
      return color; // Retourner la couleur si pas en hex
    }
    
    // Assombrir
    r = Math.floor(r * (1 - factor));
    g = Math.floor(g * (1 - factor));
    b = Math.floor(b * (1 - factor));
    
    // Convertir en hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
  
  setupControls() {
    // Drag & Drop pour déplacer la caméra
    this.canvas.addEventListener('mousedown', (e) => {
      // Vérifier qu'on ne clique pas sur les boutons
      if (e.target !== this.canvas) return;
      
      this.isDragging = true;
      this.manualControl = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
      this.canvas.style.cursor = 'grabbing';
    });
    
    this.canvas.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const dx = e.clientX - this.lastMouseX;
        const dy = e.clientY - this.lastMouseY;
        
        this.cameraX -= dx / this.zoom;
        this.cameraY -= dy / this.zoom;
        
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        
        // Redessiner immédiatement
        if (window.game) {
          window.game.renderer.draw(GameState.dungeon, GameState.players);
        }
      }
    });
    
    this.canvas.addEventListener('mouseup', () => {
      this.isDragging = false;
      this.canvas.style.cursor = 'grab';
    });
    
    this.canvas.addEventListener('mouseleave', () => {
      this.isDragging = false;
      this.canvas.style.cursor = 'grab';
    });
    
    // Curseur par défaut
    this.canvas.style.cursor = 'grab';
  }
  
  recenterOnPlayer() {
    this.manualControl = false;
  }
  
  setZoom(newZoom) {
    // Limiter entre 0.5 et 2.0
    this.zoom = Math.max(0.5, Math.min(2.0, newZoom));
    // Arrondir à 0.1 près pour éviter les décalages
    this.zoom = Math.round(this.zoom * 10) / 10;
  }

  draw(dungeon, players) {
    const ctx = this.ctx;
    const localPlayer = players.find(p => p.isLocal);
    
    if (!localPlayer || !dungeon.path[localPlayer.position]) {
      this.drawStatic(dungeon, players);
      return;
    }
    
    // IMPORTANT : Effacer complètement le canvas avant de redessiner
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // ✅ Si mode avancé : ne pas remplir de beige (drawStatic s'en charge)
    if (!this.drawStaticAdvanced || this.drawStatic !== this.drawStaticAdvanced) {
      // REMPLIR TOUT LE CANVAS avec un fond parchemin clair (mode normal uniquement)
      ctx.fillStyle = '#d4c5a0';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Texture parchemin subtile
      for (let i = 0; i < 200; i++) {
        const px = Math.random() * this.canvas.width;
        const py = Math.random() * this.canvas.height;
        const size = Math.random() * 2;
        ctx.fillStyle = `rgba(200, 180, 140, ${Math.random() * 0.3})`;
        ctx.fillRect(px, py, size, size);
      }
    } // ✅ Fin du if (mode normal)
    
    // Centrer la caméra sur le joueur (seulement si pas en contrôle manuel)
    if (!this.manualControl) {
      const playerTile = dungeon.path[localPlayer.position];
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;
      
      this.cameraX = playerTile.x * CONFIG.TILE_SIZE - centerX / this.zoom;
      this.cameraY = playerTile.y * CONFIG.TILE_SIZE - centerY / this.zoom;
    }
    
    // Sauvegarder l'état du contexte
    ctx.save();
    
    // Appliquer le zoom depuis le centre du canvas
    ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
    
    // Zone visible
    const startX = Math.floor(this.cameraX / CONFIG.TILE_SIZE) - 2;
    const startY = Math.floor(this.cameraY / CONFIG.TILE_SIZE) - 2;
    const endX = startX + Math.ceil(this.canvas.width / CONFIG.TILE_SIZE / this.zoom) + 4;
    const endY = startY + Math.ceil(this.canvas.height / CONFIG.TILE_SIZE / this.zoom) + 4;
    
    // Dessiner grille
    for (let y = Math.max(0, startY); y < Math.min(CONFIG.GRID_HEIGHT, endY); y++) {
      for (let x = Math.max(0, startX); x < Math.min(CONFIG.GRID_WIDTH, endX); x++) {
        const tile = dungeon.grid[y][x];
        const screenX = x * CONFIG.TILE_SIZE - this.cameraX;
        const screenY = y * CONFIG.TILE_SIZE - this.cameraY;
        
        if (tile === 2) {
          // Mur en pierre/brique
          const baseColor = '#3d3532';
          ctx.fillStyle = baseColor;
          ctx.fillRect(screenX, screenY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
          
          // Texture brique
          ctx.strokeStyle = '#2d2522';
          ctx.lineWidth = 2;
          ctx.strokeRect(screenX, screenY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
          
          // Joints entre briques
          ctx.strokeStyle = '#1d1512';
          ctx.lineWidth = 1;
          if (x % 2 === 0) {
            ctx.beginPath();
            ctx.moveTo(screenX, screenY + CONFIG.TILE_SIZE/2);
            ctx.lineTo(screenX + CONFIG.TILE_SIZE, screenY + CONFIG.TILE_SIZE/2);
            ctx.stroke();
          }
          
          // Éclats de pierre aléatoires
          if ((x * 7 + y * 11) % 5 === 0) {
            ctx.fillStyle = '#4d4542';
            ctx.fillRect(screenX + 2, screenY + 2, 4, 4);
          }
          if ((x * 13 + y * 17) % 7 === 0) {
            ctx.fillStyle = '#2d2522';
            ctx.fillRect(screenX + CONFIG.TILE_SIZE - 6, screenY + CONFIG.TILE_SIZE - 6, 3, 3);
          }
        } else if (tile === 1) {
          // Dalles de pierre usées
          const baseFloor = (x * 3 + y * 5) % 3 === 0 ? '#5a524c' : '#4a423c';
          ctx.fillStyle = baseFloor;
          ctx.fillRect(screenX, screenY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
          
          // Bordure de dalle
          ctx.strokeStyle = '#3a322c';
          ctx.lineWidth = 1;
          ctx.strokeRect(screenX, screenY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
          
          // Fissures aléatoires
          if ((x * 11 + y * 7) % 6 === 0) {
            ctx.strokeStyle = '#2a221c';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(screenX + 5, screenY + CONFIG.TILE_SIZE/2);
            ctx.lineTo(screenX + CONFIG.TILE_SIZE - 5, screenY + CONFIG.TILE_SIZE/2 + 3);
            ctx.stroke();
          }
          
          // Gravier/petits cailloux
          if ((x * 17 + y * 13) % 8 === 0) {
            ctx.fillStyle = '#6a625c';
            ctx.fillRect(screenX + 3, screenY + 3, 2, 2);
            ctx.fillRect(screenX + CONFIG.TILE_SIZE - 6, screenY + CONFIG.TILE_SIZE - 5, 2, 2);
          }
        }
      }
    }
    
    // 🔥 TORCHES SUR LES MURS (animation avec le temps)
    const time = Date.now() / 1000;
    for (let y = Math.max(0, startY); y < Math.min(CONFIG.GRID_HEIGHT, endY); y++) {
      for (let x = Math.max(0, startX); x < Math.min(CONFIG.GRID_WIDTH, endX); x++) {
        const tile = dungeon.grid[y][x];
        const screenX = x * CONFIG.TILE_SIZE - this.cameraX;
        const screenY = y * CONFIG.TILE_SIZE - this.cameraY;
        
        // Placer des torches sur certains murs (espacées)
        if (tile === 2 && (x * 19 + y * 23) % 15 === 0) {
          // Vérifier qu'il y a du sol adjacent (torche visible)
          const hasFloorNearby = 
            (dungeon.grid[y-1] && dungeon.grid[y-1][x] === 1) ||
            (dungeon.grid[y+1] && dungeon.grid[y+1][x] === 1) ||
            (dungeon.grid[y][x-1] === 1) ||
            (dungeon.grid[y][x+1] === 1);
          
          if (hasFloorNearby) {
            const flicker = Math.sin(time * 4 + x * 0.5 + y * 0.3) * 0.15 + 0.85;
            
            // Support de torche (métal)
            ctx.fillStyle = '#2a2522';
            ctx.fillRect(screenX + CONFIG.TILE_SIZE/2 - 2, screenY + 8, 4, CONFIG.TILE_SIZE/2);
            
            // Flamme (dégradé orange -> jaune)
            const flameSize = 8 * flicker;
            ctx.fillStyle = '#ff6b1a';
            ctx.beginPath();
            ctx.ellipse(
              screenX + CONFIG.TILE_SIZE/2, 
              screenY + 12, 
              flameSize * 0.6, 
              flameSize, 
              0, 0, Math.PI * 2
            );
            ctx.fill();
            
            // Centre jaune
            ctx.fillStyle = '#ffeb3b';
            ctx.beginPath();
            ctx.ellipse(
              screenX + CONFIG.TILE_SIZE/2, 
              screenY + 12, 
              flameSize * 0.3, 
              flameSize * 0.5, 
              0, 0, Math.PI * 2
            );
            ctx.fill();
            
            // Halo lumineux
            const gradient = ctx.createRadialGradient(
              screenX + CONFIG.TILE_SIZE/2, screenY + 12, 0,
              screenX + CONFIG.TILE_SIZE/2, screenY + 12, CONFIG.TILE_SIZE
            );
            gradient.addColorStop(0, `rgba(255, 200, 100, ${0.3 * flicker})`);
            gradient.addColorStop(1, 'rgba(255, 200, 100, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(
              screenX - CONFIG.TILE_SIZE/2, 
              screenY - CONFIG.TILE_SIZE/2, 
              CONFIG.TILE_SIZE * 2, 
              CONFIG.TILE_SIZE * 2
            );
          }
        }
      }
    }
    
    // Dessiner chemin avec événements
    dungeon.path.forEach((tile, index) => {
      const screenX = tile.x * CONFIG.TILE_SIZE - this.cameraX;
      const screenY = tile.y * CONFIG.TILE_SIZE - this.cameraY;
      
      if (screenX < -CONFIG.TILE_SIZE || screenY < -CONFIG.TILE_SIZE ||
          screenX > this.canvas.width || screenY > this.canvas.height) {
        return;
      }
      
      // ═══ FOND PARCHEMIN CLAIR ═══
      ctx.fillStyle = '#e8dcc0';
      ctx.fillRect(screenX, screenY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
      
      // ═══ BORDURE NOIRE (GRILLE) ═══
      ctx.strokeStyle = '#2a2a2a';
      ctx.lineWidth = 2;
      ctx.strokeRect(screenX, screenY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
      
      // ═══ NUMÉRO DE CASE (coin supérieur droit) ═══
      ctx.fillStyle = 'rgba(80, 80, 80, 0.7)';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';
      ctx.fillText(index, screenX + CONFIG.TILE_SIZE - 3, screenY + 2);
      
      // ═══ TYPES SPÉCIAUX ═══
      if (tile.type === 'entrance') {
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(screenX, screenY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        ctx.strokeStyle = '#27ae60';
        ctx.lineWidth = 3;
        ctx.strokeRect(screenX, screenY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🚪', screenX + CONFIG.TILE_SIZE/2, screenY + CONFIG.TILE_SIZE/2);
      }
      else if (tile.type === 'exit') {
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(screenX, screenY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        ctx.strokeStyle = '#c0392b';
        ctx.lineWidth = 3;
        ctx.strokeRect(screenX, screenY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🏆', screenX + CONFIG.TILE_SIZE/2, screenY + CONFIG.TILE_SIZE/2);
      }
      // Icônes d'événements (si pas encore cleared)
      else if (tile.type === 'combat' && !tile.cleared) {
        ctx.fillStyle = '#8B0000';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚔️', screenX + CONFIG.TILE_SIZE/2, screenY + CONFIG.TILE_SIZE/2);
      }
      else if (tile.type === 'chest' && !tile.cleared) {
        ctx.fillStyle = '#FFD700';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💰', screenX + CONFIG.TILE_SIZE/2, screenY + CONFIG.TILE_SIZE/2);
      }
      else if (tile.type === 'trap' && !tile.cleared) {
        ctx.fillStyle = '#DC143C';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💀', screenX + CONFIG.TILE_SIZE/2, screenY + CONFIG.TILE_SIZE/2);
      }
      else if (tile.type === 'merchant') {
        ctx.fillStyle = '#16a085';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🛒', screenX + CONFIG.TILE_SIZE/2, screenY + CONFIG.TILE_SIZE/2);
      }

      // Indicateurs de difficulté de salle (mini / boss)
      if (tile.roomDifficulty === 'mini') {
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText('👹', screenX + CONFIG.TILE_SIZE - 4, screenY + CONFIG.TILE_SIZE - 4);
      } else if (tile.roomDifficulty === 'boss') {
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText('👑', screenX + CONFIG.TILE_SIZE - 4, screenY + CONFIG.TILE_SIZE - 4);
      }
      
      // ═══ CASES IMPORTANTES (tous les 10) ═══
      if (index % 10 === 0 && index > 0) {
        // Fond doré léger
        ctx.fillStyle = 'rgba(212, 175, 55, 0.25)';
        ctx.fillRect(screenX, screenY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        
        // Bordure dorée épaisse
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 3;
        ctx.strokeRect(screenX, screenY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        
        // Gros numéro doré au centre
        ctx.fillStyle = '#D4AF37';
        ctx.font = 'bold 13px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(index, screenX + CONFIG.TILE_SIZE/2, screenY + CONFIG.TILE_SIZE/2 + 8);
      }
    });
    
    // ═══════════════════════════════════════════════════════════
    // ✅ NOUVEAU : NUMÉROS ET INDICATEURS DE DIRECTION
    // ═══════════════════════════════════════════════════════════
    
    // Créer objet caméra pour les fonctions d'indicateurs
    const camera = {
      x: this.cameraX,
      y: this.cameraY
    };
    
    // Dessiner les numéros sur toutes les cases
    if (typeof drawPathNumbers === 'function') {
      drawPathNumbers(ctx, dungeon, camera);
    }
    
    // Dessiner les indicateurs de direction
    if (typeof drawDirectionIndicators === 'function') {
      drawDirectionIndicators(ctx, dungeon, camera);
    }
    
    // Dessiner les marqueurs entrée/sortie
    if (dungeon.path && dungeon.path.length > 0) {
      if (typeof drawEntranceIndicator === 'function') {
        drawEntranceIndicator(ctx, dungeon.path[0], camera);
      }
      if (typeof drawExitIndicator === 'function') {
        drawExitIndicator(ctx, dungeon.path[dungeon.path.length - 1], camera);
      }
    }
    
    // ═══════════════════════════════════════════════════════════
    
    // Dessiner joueurs
    players.forEach((player, idx) => {
      if (!player.alive) return;
      
      const pos = dungeon.path[player.position];
      if (!pos) return;
      
      const screenX = pos.x * CONFIG.TILE_SIZE - this.cameraX;
      const screenY = pos.y * CONFIG.TILE_SIZE - this.cameraY;
      
      if (screenX < -CONFIG.TILE_SIZE || screenY < -CONFIG.TILE_SIZE ||
          screenX > this.canvas.width || screenY > this.canvas.height) {
        return;
      }
      
      const offsetX = (idx % 2) * 12;
      const offsetY = Math.floor(idx / 2) * 12;
      
      const centerX = screenX + CONFIG.TILE_SIZE/2 + offsetX;
      const centerY = screenY + CONFIG.TILE_SIZE/2 + offsetY;
      
      // Ombre portée
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(centerX - 10, centerY + 12, 20, 4);
      
      // Socle de statue (pierre)
      ctx.fillStyle = '#4a423c';
      ctx.fillRect(centerX - 12, centerY + 8, 24, 8);
      ctx.strokeStyle = '#2a221c';
      ctx.lineWidth = 1;
      ctx.strokeRect(centerX - 12, centerY + 8, 24, 8);
      
      // Corps de la statue (couleur de classe)
      const playerColor = (player.classData && player.classData.color) || '#D4AF37';
      const gradient = ctx.createLinearGradient(centerX - 10, centerY - 12, centerX + 10, centerY + 8);
      gradient.addColorStop(0, playerColor);
      gradient.addColorStop(1, this.darkenColor(playerColor, 0.5));
      
      ctx.fillStyle = gradient;
      ctx.fillRect(centerX - 10, centerY - 12, 20, 20);
      
      // Bordure de la statue
      ctx.strokeStyle = player.isLocal ? '#FFD700' : '#8B7355';
      ctx.lineWidth = player.isLocal ? 3 : 2;
      ctx.strokeRect(centerX - 10, centerY - 12, 20, 20);
      
      // Effet brillant (highlight)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(centerX - 9, centerY - 11, 8, 8);
      
      // 🎨 Icône de classe (IMAGE ou texte)
      const classType = player.classData.type;
      const classImg = this.classImages[classType];
      
      // Debug : log une seule fois
      if (!this.imageLoggedFor) this.imageLoggedFor = {};
      if (!this.imageLoggedFor[player.id]) {
        console.log(`🎨 Dessin pion joueur "${player.name}": type="${classType}", image=${classImg ? 'DISPONIBLE' : 'NON DISPO'}`);
        this.imageLoggedFor[player.id] = true;
      }
      
      if (classImg && classImg.complete) {
        // Dessiner l'image de classe
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY - 2, 10, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(classImg, centerX - 10, centerY - 12, 20, 20);
        ctx.restore();
      } else {
        // Fallback : icône texte
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 3;
        ctx.fillText(
          player.classData.icon,
          centerX,
          centerY - 2
        );
        ctx.shadowBlur = 0;
      }
      
      // Indicateur de tour actif (couronne)
      if (idx === GameState.currentPlayerIndex) {
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('👑', centerX, centerY - 20);
      }
      
      // Nom du joueur (si joueur actif)
      if (idx === GameState.currentPlayerIndex) {
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 11px Arial';
        ctx.textBaseline = 'top';
        ctx.fillText(
          player.name,
          centerX,
          centerY + 18
        );
      }
    });
    
    // Restaurer l'état du contexte (annule le zoom)
    ctx.restore();
    
    this.drawMinimap(dungeon, players);
  }
  
  drawStatic(dungeon, players) {
    const ctx = this.ctx;
    
    // Fond texture terre
    ctx.fillStyle = '#2b2420';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    for (let y = 0; y < CONFIG.GRID_HEIGHT; y++) {
      for (let x = 0; x < CONFIG.GRID_WIDTH; x++) {
        const tile = dungeon.grid[y][x];
        const screenX = x * CONFIG.TILE_SIZE;
        const screenY = y * CONFIG.TILE_SIZE;
        
        if (tile === 2) {
          // Murs en pierre
          ctx.fillStyle = '#3d3532';
          ctx.fillRect(screenX, screenY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
          ctx.strokeStyle = '#2d2522';
          ctx.lineWidth = 2;
          ctx.strokeRect(screenX, screenY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        } else if (tile === 1) {
          // Sol en dalles
          const baseFloor = (x * 3 + y * 5) % 3 === 0 ? '#5a524c' : '#4a423c';
          ctx.fillStyle = baseFloor;
          ctx.fillRect(screenX, screenY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
          ctx.strokeStyle = '#3a322c';
          ctx.lineWidth = 1;
          ctx.strokeRect(screenX, screenY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        }
      }
    }
    
    const entrance = dungeon.path[0];
    const exit = dungeon.path[dungeon.path.length - 1];
    
    ctx.fillStyle = '#2ecc71';
    ctx.fillRect(entrance.x * CONFIG.TILE_SIZE, entrance.y * CONFIG.TILE_SIZE, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
    
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(exit.x * CONFIG.TILE_SIZE, exit.y * CONFIG.TILE_SIZE, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
    
    players.forEach((player, idx) => {
      if (!player.alive) return;
      
      // Protéger contre position hors limites
      if (player.position >= dungeon.path.length) {
        player.position = dungeon.path.length - 1;
      }
      
      const pos = dungeon.path[player.position];
      if (!pos) return; // Sécurité supplémentaire
      
      const offsetX = (idx % 3) * 6;
      const offsetY = Math.floor(idx / 3) * 6;

      ctx.fillStyle = (player.classData && player.classData.color) || '#D4AF37';
      ctx.fillRect(
        pos.x * CONFIG.TILE_SIZE + 4 + offsetX,
        pos.y * CONFIG.TILE_SIZE + 4 + offsetY,
        10, 10
      );
    });
  }
  
  drawMinimap(dungeon, players) {
    const ctx = this.ctx;
    const minimapSize = 180;
    const minimapX = 20;
    const minimapY = this.canvas.height - minimapSize - 20;
    
    // ═══ FOND PARCHEMIN CLAIR ═══
    ctx.fillStyle = 'rgba(232, 220, 192, 0.95)';
    ctx.fillRect(minimapX, minimapY, minimapSize, minimapSize);
    
    // ═══ BORDURE NOIRE ÉPAISSE ═══
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 3;
    ctx.strokeRect(minimapX, minimapY, minimapSize, minimapSize);
    
    // ═══ BORDURE DORÉE INTÉRIEURE ═══
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 1;
    ctx.strokeRect(minimapX + 4, minimapY + 4, minimapSize - 8, minimapSize - 8);
    
    const scale = Math.min(minimapSize / CONFIG.GRID_WIDTH, minimapSize / CONFIG.GRID_HEIGHT) * 0.9;
    const offsetX = (minimapSize - CONFIG.GRID_WIDTH * scale) / 2;
    const offsetY = (minimapSize - CONFIG.GRID_HEIGHT * scale) / 2;
    
    // ═══ GRILLE DU CHEMIN (cases numérotées) ═══
    dungeon.path.forEach((tile, i) => {
      const x = minimapX + offsetX + tile.x * scale;
      const y = minimapY + offsetY + tile.y * scale;
      const size = Math.max(scale, 3);
      
      // Case parchemin clair
      ctx.fillStyle = '#f5ebd0';
      ctx.fillRect(x, y, size, size);
      
      // Bordure noire
      ctx.strokeStyle = '#444';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(x, y, size, size);
      
      // Marquer les cases importantes
      if (i % 10 === 0 && i > 0) {
        ctx.fillStyle = 'rgba(212, 175, 55, 0.4)';
        ctx.fillRect(x, y, size, size);
      }
      
      // Entrée et sortie
      if (tile.type === 'entrance') {
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(x, y, size, size);
      } else if (tile.type === 'exit') {
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(x, y, size, size);
      }
    });
    
    const entrance = dungeon.path[0];
    const exit = dungeon.path[dungeon.path.length - 1];
    
    // Entrée (vert brillant)
    ctx.fillStyle = '#2ecc71';
    ctx.fillRect(minimapX + entrance.x * scale - 2, minimapY + entrance.y * scale - 2, 4, 4);
    
    // Sortie (rouge brillant)
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(minimapX + exit.x * scale - 2, minimapY + exit.y * scale - 2, 4, 4);
    
    // Joueurs avec halo
    players.forEach(player => {
      if (!player.alive) return;
      const pos = dungeon.path[player.position];
      if (!pos) return;
      
      // Halo
      const gradient = ctx.createRadialGradient(
        minimapX + pos.x * scale,
        minimapY + pos.y * scale,
        0,
        minimapX + pos.x * scale,
        minimapY + pos.y * scale,
        6
      );
      gradient.addColorStop(0, (player.classData && player.classData.color) || '#D4AF37');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(
        minimapX + pos.x * scale - 6,
        minimapY + pos.y * scale - 6,
        12, 12
      );

      // Point joueur
      ctx.fillStyle = (player.classData && player.classData.color) || '#D4AF37';
      ctx.fillRect(
        minimapX + pos.x * scale - 2,
        minimapY + pos.y * scale - 2,
        4, 4
      );
    });
  }
}

console.log('🎨 Renderer chargé');