// 🎨 RENDU AVANCÉ DU DONJON - DARK FANTASY

// Étendre la classe Renderer avec les nouvelles méthodes
if (typeof Renderer !== 'undefined') {
  
  // 🏗️ Initialiser les systèmes graphiques
  Renderer.prototype.initAdvancedGraphics = function() {
    console.log('🎨 Initialisation graphismes avancés...');
    
    // Générateur de textures
    this.textureGen = new TextureGenerator();
    
    // Système d'éclairage
    this.lighting = new LightingSystem(this.canvas);
    
    // Pré-générer les textures des dalles
    this.stoneTiles = [];
    for (let i = 0; i < 10; i++) {
      this.stoneTiles.push(
        this.textureGen.generateStoneTexture(CONFIG.TILE_SIZE, CONFIG.TILE_SIZE, i)
      );
    }
    
    // Texture de mur (haute résolution)
    this.wallTexture = this.textureGen.generateWallTexture(
      CONFIG.GRID_WIDTH * CONFIG.TILE_SIZE * 2, // ✅ Double résolution
      CONFIG.GRID_HEIGHT * CONFIG.TILE_SIZE * 2
    );
    
    console.log('✅ Graphismes avancés initialisés');
  };
  
  // 🎨 Dessiner une dalle avec effet 3D
  Renderer.prototype.drawAdvancedTile = function(x, y, tileType, screenX, screenY) {
    const ctx = this.ctx;
    const size = CONFIG.TILE_SIZE;
    
    // Choisir une texture de dalle basée sur la position (pour variation)
    const textureIndex = (x * 3 + y * 7) % this.stoneTiles.length;
    const texture = this.stoneTiles[textureIndex];
    
    // Dessiner la texture de base
    ctx.drawImage(texture, screenX, screenY, size, size);
    
    // ✨ Effet de biseau (bevel) pour donner du relief
    const bevelSize = 3;
    
    // Ombre en bas et à droite
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(screenX + size - bevelSize, screenY + bevelSize, bevelSize, size - bevelSize);
    ctx.fillRect(screenX + bevelSize, screenY + size - bevelSize, size - bevelSize, bevelSize);
    
    // Lumière en haut et à gauche
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(screenX, screenY, size, bevelSize);
    ctx.fillRect(screenX, screenY, bevelSize, size);
    
    // Joints épais entre les dalles
    ctx.strokeStyle = 'rgba(20, 20, 20, 0.8)';
    ctx.lineWidth = 2;
    ctx.strokeRect(screenX, screenY, size, size);
  };
  
  // 🌫️ Dessiner l'arrière-plan avec brouillard
  Renderer.prototype.drawDungeonBackground = function() {
    const ctx = this.ctx;
    
    // Activer le lissage pour une meilleure qualité
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Fond de texture de mur (redimensionné pour remplir)
    const canvasW = CONFIG.GRID_WIDTH * CONFIG.TILE_SIZE;
    const canvasH = CONFIG.GRID_HEIGHT * CONFIG.TILE_SIZE;
    ctx.drawImage(this.wallTexture, 0, 0, canvasW, canvasH);
    
    // Brouillard animé
    if (!this.fogOffset) this.fogOffset = 0;
    this.fogOffset += 0.2;
    
    // Créer un motif de brume
    ctx.fillStyle = 'rgba(10, 10, 15, 0.3)';
    for (let i = 0; i < 5; i++) {
      const offsetX = Math.sin(this.fogOffset * 0.01 + i) * 50;
      const offsetY = Math.cos(this.fogOffset * 0.015 + i) * 30;
      
      const gradient = ctx.createRadialGradient(
        this.canvas.width / 2 + offsetX,
        this.canvas.height / 2 + offsetY,
        0,
        this.canvas.width / 2 + offsetX,
        this.canvas.height / 2 + offsetY,
        300 + i * 50
      );
      
      gradient.addColorStop(0, 'rgba(15, 15, 20, 0.2)');
      gradient.addColorStop(1, 'rgba(15, 15, 20, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  };
  
  // 💡 Ajouter des lumières sur les cases spéciales
  Renderer.prototype.setupDungeonLights = function(dungeon) {
    this.lighting.clear();
    
    // Torches tous les X cases
    for (let i = 0; i < dungeon.path.length; i += 15) {
      const pos = dungeon.path[i];
      if (!pos) continue;
      
      this.lighting.addLight(
        pos.x * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2,
        pos.y * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2,
        '#ff9944',
        80,
        true // Scintillement
      );
    }
    
    // Lumière verte sur le départ
    const start = dungeon.path[0];
    this.lighting.addLight(
      start.x * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2,
      start.y * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2,
      '#2ecc71',
      60,
      false
    );
    
    // Lumière rouge sur l'arrivée
    const end = dungeon.path[dungeon.path.length - 1];
    this.lighting.addLight(
      end.x * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2,
      end.y * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2,
      '#e74c3c',
      70,
      true
    );
  };
  
  // 🎭 Dessiner icônes sur cases spéciales
  Renderer.prototype.drawSpecialTileIcons = function(dungeon) {
    const ctx = this.ctx;
    
    // Dessiner l'entrée et la sortie en premier (pour qu'elles soient visibles)
    if (dungeon.path.length > 0) {
      // ENTRÉE
      const entrance = dungeon.path[0];
      if (entrance && entrance.type === 'entrance') {
        const entranceX = entrance.x * CONFIG.TILE_SIZE;
        const entranceY = entrance.y * CONFIG.TILE_SIZE;
        const centerX = entranceX + CONFIG.TILE_SIZE / 2;
        const centerY = entranceY + CONFIG.TILE_SIZE / 2;
        
        // Fond vert
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(entranceX, entranceY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        ctx.strokeStyle = '#27ae60';
        ctx.lineWidth = 3;
        ctx.strokeRect(entranceX, entranceY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        
        // Icône entrée
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🚪', centerX, centerY);
      }
      
      // SORTIE (toujours la dernière case)
      const exit = dungeon.path[dungeon.path.length - 1];
      if (exit && exit.type === 'exit') {
        const exitX = exit.x * CONFIG.TILE_SIZE;
        const exitY = exit.y * CONFIG.TILE_SIZE;
        const centerX = exitX + CONFIG.TILE_SIZE / 2;
        const centerY = exitY + CONFIG.TILE_SIZE / 2;
        
        // Fond rouge
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(exitX, exitY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        ctx.strokeStyle = '#c0392b';
        ctx.lineWidth = 4;
        ctx.strokeRect(exitX, exitY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        
        // Effet brillant pour la sortie
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(exitX + 2, exitY + 2, CONFIG.TILE_SIZE - 4, CONFIG.TILE_SIZE - 4);
        
        // Icône sortie (grande et visible)
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.fillText('🏆', centerX, centerY);
        ctx.shadowBlur = 0;
      }
    }
    
    // Marquer les cases x10 (mais PAS l'entrée ni la sortie)
    for (let i = 0; i < dungeon.path.length; i++) {
      const tile = dungeon.path[i];
      
      // Ne pas dessiner le numéro sur l'entrée ou la sortie
      if (tile.type === 'entrance' || tile.type === 'exit') {
        continue;
      }
      
      if (i % 10 === 0 && i > 0) {
        const pos = tile;
        const centerX = pos.x * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2;
        const centerY = pos.y * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2;
        
        // Badge doré
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#8B6914';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Numéro
        ctx.fillStyle = '#000';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(i.toString(), centerX, centerY);
      }
    }
  };
  
  // 🎨 FONCTION DRAW COMPLÈTE POUR MODE AVANCÉ
  Renderer.prototype.drawAdvanced = function(dungeon, players) {
    const ctx = this.ctx;
    const localPlayer = players.find(p => p.isLocal);
    
    // Effacer le canvas
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Centrer la caméra sur le joueur
    if (localPlayer && dungeon.path[localPlayer.position] && !this.manualControl) {
      const playerTile = dungeon.path[localPlayer.position];
      const centerX = this.canvas.width / 2;
      const centerY = this.canvas.height / 2;
      
      this.cameraX = playerTile.x * CONFIG.TILE_SIZE - centerX / this.zoom;
      this.cameraY = playerTile.y * CONFIG.TILE_SIZE - centerY / this.zoom;
    }
    
    // Sauvegarder état
    ctx.save();
    
    // Appliquer zoom
    ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
    
    // Appliquer caméra
    ctx.translate(-this.cameraX, -this.cameraY);
    
    // 🎨 RENDU AVANCÉ
    this.drawStaticAdvanced(dungeon, players);
    
    // Restaurer état
    ctx.restore();
    
    // Minimap (par-dessus)
    this.drawMinimap(dungeon, players);
    
    // 🔄 Démarrer animation légère (une seule fois)
    if (!this._lightAnimationStarted) {
      this._lightAnimationStarted = true;
      this._dungeon = dungeon;
      this._players = players;
      this.animateLights();
    }
  };
  
  // ✨ Animation LÉGÈRE : redessine uniquement toutes les 100ms au lieu de 60fps
  Renderer.prototype.animateLights = function() {
    let lastUpdate = Date.now();
    const updateInterval = 100; // 10fps au lieu de 60fps
    
    const animate = () => {
      const now = Date.now();
      if (now - lastUpdate > updateInterval) {
        if (this.lighting && this._dungeon && this._players) {
          // Mise à jour des particules sans redessiner tout
          this.lighting.update();
          // Redessiner SEULEMENT si nécessaire (toutes les 100ms)
          this.draw(this._dungeon, this._players);
        }
        lastUpdate = now;
      }
      requestAnimationFrame(animate);
    };
    animate();
  };
  
  // 🔄 Nouvelle fonction drawStatic améliorée
  Renderer.prototype.drawStaticAdvanced = function(dungeon, players) {
    const ctx = this.ctx;
    
    // Debug : Confirmer qu'on utilise bien le rendu avancé
    if (!this._advancedRenderLogged) {
      console.log('🎨 ✅ RENDU AVANCÉ ACTIVÉ !');
      this._advancedRenderLogged = true;
    }
    
    // 1. Dessiner l'arrière-plan atmosphérique
    this.drawDungeonBackground();
    
    // 2. OPTIMISATION : Ne dessiner QUE les cases VISIBLES
    const viewportStartX = Math.floor(this.cameraX / CONFIG.TILE_SIZE) - 2;
    const viewportStartY = Math.floor(this.cameraY / CONFIG.TILE_SIZE) - 2;
    const viewportEndX = viewportStartX + Math.ceil(this.canvas.width / (CONFIG.TILE_SIZE * this.zoom)) + 4;
    const viewportEndY = viewportStartY + Math.ceil(this.canvas.height / (CONFIG.TILE_SIZE * this.zoom)) + 4;
    
    // Limiter aux bornes de la grille
    const startX = Math.max(0, viewportStartX);
    const startY = Math.max(0, viewportStartY);
    const endX = Math.min(CONFIG.GRID_WIDTH, viewportEndX);
    const endY = Math.min(CONFIG.GRID_HEIGHT, viewportEndY);
    
    // 3. Dessiner SEULEMENT les cases visibles
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        if (!dungeon.grid[y]) continue;
        
        const tile = dungeon.grid[y][x];
        const screenX = x * CONFIG.TILE_SIZE;
        const screenY = y * CONFIG.TILE_SIZE;
        
        if (tile === 1) {
          // Dalle de chemin
          this.drawAdvancedTile(x, y, tile, screenX, screenY);
        } else if (tile === 2) {
          // Mur avec texture
          const wallTextureIndex = (x * 7 + y * 11) % this.stoneTiles.length;
          const wallTexture = this.stoneTiles[wallTextureIndex];
          
          ctx.drawImage(wallTexture, screenX, screenY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
          
          // Assombrir
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.fillRect(screenX, screenY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
          
          // Bordure
          ctx.strokeStyle = '#1a1a1a';
          ctx.lineWidth = 2;
          ctx.strokeRect(screenX, screenY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        }
      }
    }
    
    // 4. Dessiner les SALLES (overlay coloré)
    if (dungeon.rooms && dungeon.rooms.length > 0) {
      this.drawRooms(dungeon.rooms, dungeon);
    }
    
    // 5. Dessiner les icônes spéciales
    this.drawSpecialTileIcons(dungeon);
    
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
    
    // 6. Mettre à jour et dessiner l'éclairage
    this.lighting.update();
    
    // Mode de fusion pour les lumières
    ctx.globalCompositeOperation = 'lighter';
    this.lighting.render(ctx);
    ctx.globalCompositeOperation = 'source-over';
    
    // 7. Dessiner les joueurs (APRÈS les indicateurs pour qu'ils soient au-dessus)
    const currentPlayerIndex = window.GameState ? GameState.currentPlayerIndex : 0;
    
    players.forEach((player, idx) => {
      if (!player.alive) return;
      
      if (player.position >= dungeon.path.length) {
        player.position = dungeon.path.length - 1;
      }
      
      const pos = dungeon.path[player.position];
      if (!pos) return;
      
      const centerX = pos.x * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2;
      const centerY = pos.y * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2;
      
      // Statue/Pion du joueur avec ombre
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(centerX - 8, centerY + 10, 16, 4);
      
      // Bordure de la statue
      ctx.fillStyle = player.classData.color;
      ctx.fillRect(centerX - 10, centerY - 12, 20, 20);
      
      ctx.strokeStyle = player.isLocal ? '#FFD700' : '#8B7355';
      ctx.lineWidth = player.isLocal ? 3 : 2;
      ctx.strokeRect(centerX - 10, centerY - 12, 20, 20);
      
      // Effet brillant
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(centerX - 9, centerY - 11, 8, 8);
      
      // 🎨 Icône de classe (IMAGE ou texte)
      const classType = player.classData.type;
      const classImg = this.classImages[classType];
      
      if (classImg && classImg.complete) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY - 2, 10, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(classImg, centerX - 10, centerY - 12, 20, 20);
        ctx.restore();
      } else {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 3;
        ctx.fillText(player.classData.icon, centerX, centerY - 2);
        ctx.shadowBlur = 0;
      }
      
      // Couronne pour joueur actif
      if (idx === currentPlayerIndex) {
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('👑', centerX, centerY - 20);
      }
      
      // Nom du joueur
      if (idx === currentPlayerIndex) {
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 11px Arial';
        ctx.textBaseline = 'top';
        ctx.fillText(player.name, centerX, centerY + 18);
      }
    });
  };
  
  console.log('✅ Fonctions de rendu avancé chargées');
}
// EXTENSION RENDERER - RENDU DES SALLES

// Ajouter apres la fonction drawStaticAdvanced

Renderer.prototype.drawRooms = function(rooms, dungeon) {
  if (!rooms || rooms.length === 0) return;
  
  const ctx = this.ctx;
  
  // Récupérer l'entrée et la sortie depuis le path
  let entranceTile = null;
  let exitTile = null;
  
  if (dungeon && dungeon.path && dungeon.path.length > 0) {
    entranceTile = dungeon.path[0];
    exitTile = dungeon.path[dungeon.path.length - 1];
  }
  
  rooms.forEach(room => {
    // IMPORTANT : Ne jamais dessiner de salle sur l'entrée ou la sortie
    // Vérifier si cette salle contient l'entrée ou la sortie
    if (entranceTile) {
      const entranceInRoom = (
        entranceTile.x >= room.x && entranceTile.x < room.x + room.width &&
        entranceTile.y >= room.y && entranceTile.y < room.y + room.height
      );
      if (entranceInRoom) {
        console.warn('⚠️ Une salle contient l\'entrée, ignorée');
        return; // Ne pas dessiner cette salle
      }
    }
    
    if (exitTile) {
      const exitInRoom = (
        exitTile.x >= room.x && exitTile.x < room.x + room.width &&
        exitTile.y >= room.y && exitTile.y < room.y + room.height
      );
      if (exitInRoom) {
        console.warn('⚠️ Une salle contient la sortie, ignorée');
        return; // Ne pas dessiner cette salle
      }
    }
    
    // Couleur selon type
    let roomColor = 'rgba(50, 50, 200, 0.2)'; // Defaut bleu
    let borderColor = '#4444ff';
    
    switch(room.type) {
      case 'entrance':
        roomColor = 'rgba(50, 200, 50, 0.2)';
        borderColor = '#44ff44';
        break;
      case 'exit':
        roomColor = 'rgba(200, 50, 50, 0.2)';
        borderColor = '#ff4444';
        break;
      case 'combat':
        roomColor = 'rgba(200, 100, 50, 0.3)';
        borderColor = '#ff6644';
        break;
      case 'treasure':
        roomColor = 'rgba(255, 215, 0, 0.3)';
        borderColor = '#FFD700';
        break;
      case 'merchant':
        roomColor = 'rgba(100, 100, 200, 0.3)';
        borderColor = '#6666ff';
        break;
      case 'puzzle':
        roomColor = 'rgba(150, 50, 200, 0.3)';
        borderColor = '#aa44ff';
        break;
      case 'rest':
        roomColor = 'rgba(100, 200, 100, 0.2)';
        borderColor = '#66ff66';
        break;
    }
    
    // Dessiner overlay colore
    const x = room.x * CONFIG.TILE_SIZE;
    const y = room.y * CONFIG.TILE_SIZE;
    const w = room.width * CONFIG.TILE_SIZE;
    const h = room.height * CONFIG.TILE_SIZE;
    
    ctx.fillStyle = roomColor;
    ctx.fillRect(x, y, w, h);
    
    // Bordure de salle
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);
    
    // Icone au centre
    const centerX = x + w / 2;
    const centerY = y + h / 2;
    
    ctx.fillStyle = borderColor;
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    let icon = '?';
    switch(room.type) {
      case 'entrance': icon = '🚪'; break;
      case 'exit': icon = '🏁'; break;
      case 'combat': icon = '⚔️'; break;
      case 'treasure': icon = '💎'; break;
      case 'merchant': icon = '🏪'; break;
      case 'puzzle': icon = '🧩'; break;
      case 'rest': icon = '🛏️'; break;
    }
    
    ctx.fillText(icon, centerX, centerY);
  });
};

console.log('Rendu des salles active');