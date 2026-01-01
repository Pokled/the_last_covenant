/**
 * 🧊 ISOMETRIC RENDERER - Système de Cubes
 * THE LAST COVENANT
 *
 * Renderer isométrique avec système de CUBES sur grille géante
 * - Grille cartésienne 50x50
 * - Couloirs = 1 cube de large
 * - Salles (Nœuds) = 3x3 cubes
 * - Rendu simple : juste couleurs au sol
 */

class IsometricRendererCubes {
  constructor(canvasId, config = {}) {
    // Canvas
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error(`❌ Canvas #${canvasId} non trouvé !`);
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    // Config
    this.config = {
      tileWidth: 192,      // Largeur d'un cube en pixels (x3)
      tileHeight: 110,     // Hauteur augmentée pour vue plus latérale
      tileDepth: 48,      // Profondeur (épaisseur) du cube (x3)
      scale: 1.0,
      darkMode: config.darkMode !== false
    };

    // Grille géante pour génération par chunks
    this.gridSize = 150; // Grille 150×150 pour donjon étendu
    this.grid = new Map(); // Map de (x,y) → {type, color}

    // Système de nœuds de destin
    this.destinyNodes = null; // Sera initialisé avec DestinyNodesSystem

    // Caméra
    this.camera = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      smoothness: 0.1,
      shake: 0
    };

    // Mouse grab system
    this.mouseGrab = {
      isDragging: false,
      lastX: 0,
      lastY: 0,
      startX: 0,
      startY: 0
    };

    // Bind mouse events
    this.setupMouseGrab();

    // Path organique (coordonnées cartésiennes)
    this.organicPath = [];
    this.pathGenerated = false;
    this.dungeonLength = 25;
    
    // Performance: Cache pour cubes
    this.cubeRenderCache = null;
    this.lastPlayerIndex = -1;

    console.log('🧊 IsometricRendererCubes initialisé');
  }

  // ═══════════════════════════════════════════════════════════════
  // CONVERSION COORDONNÉES
  // ═══════════════════════════════════════════════════════════════

  /**
   * Conversion Cartésien (x, y) → Isométrique (isoX, isoY)
   */
  cartesianToIso(cartX, cartY) {
    const scale = this.config.scale || 1.0;
    const isoX = (cartX - cartY) * (this.config.tileWidth / 2) * scale;
    const isoY = (cartX + cartY) * (this.config.tileHeight / 2) * scale;
    return { x: isoX, y: isoY };
  }

  /**
   * Conversion World → Screen (avec caméra)
   */
  worldToScreen(worldX, worldY) {
    // Shake caméra
    const shakeX = (Math.random() - 0.5) * this.camera.shake;
    const shakeY = (Math.random() - 0.5) * this.camera.shake;

    return {
      x: worldX - this.camera.x + this.width / 2 + shakeX,
      y: worldY - this.camera.y + this.height / 2 + shakeY
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // CAMÉRA
  // ═══════════════════════════════════════════════════════════════

  centerCameraOn(tileIndex, dungeon) {
    if (!this.organicPath || tileIndex >= this.organicPath.length) return;

    const cart = this.organicPath[tileIndex];
    const iso = this.cartesianToIso(cart.x, cart.y);

    this.camera.targetX = iso.x;
    this.camera.targetY = iso.y;

    // Interpolation lisse
    this.camera.x += (this.camera.targetX - this.camera.x) * this.camera.smoothness;
    this.camera.y += (this.camera.targetY - this.camera.y) * this.camera.smoothness;
  }

  shake(intensity = 5) {
    this.camera.shake = intensity;
  }

  /**
   * Configure le système de grab avec la souris
   */
  setupMouseGrab() {
    if (!this.canvas) return;

    // Mouse down - commence le drag
    this.canvas.addEventListener('mousedown', (e) => {
      this.mouseGrab.isDragging = true;
      this.mouseGrab.lastX = e.clientX;
      this.mouseGrab.lastY = e.clientY;
      this.mouseGrab.startX = e.clientX;
      this.mouseGrab.startY = e.clientY;
      this.canvas.style.cursor = 'grabbing';
    });

    // Mouse move - déplace la caméra si en drag
    this.canvas.addEventListener('mousemove', (e) => {
      if (!this.mouseGrab.isDragging) return;

      const deltaX = e.clientX - this.mouseGrab.lastX;
      const deltaY = e.clientY - this.mouseGrab.lastY;

      // Déplacer la caméra inversement au mouvement de la souris
      this.camera.x -= deltaX;
      this.camera.y -= deltaY;
      this.camera.targetX -= deltaX;
      this.camera.targetY -= deltaY;

      this.mouseGrab.lastX = e.clientX;
      this.mouseGrab.lastY = e.clientY;
    });

    // Mouse up - termine le drag
    const endDrag = () => {
      if (this.mouseGrab.isDragging) {
        this.mouseGrab.isDragging = false;
        this.canvas.style.cursor = 'grab';
      }
    };

    this.canvas.addEventListener('mouseup', endDrag);
    this.canvas.addEventListener('mouseleave', endDrag);

    // Curseur grab quand hover
    this.canvas.addEventListener('mouseenter', () => {
      if (!this.mouseGrab.isDragging) {
        this.canvas.style.cursor = 'grab';
      }
    });

    console.log('🖱️ Mouse grab system activé');
  }

  // ═══════════════════════════════════════════════════════════════
  // GÉNÉRATION DONJON (inspiré de dungeon.js)
  // ═══════════════════════════════════════════════════════════════

  /**
   * Génère le donjon complet avec grille 2D
   * UTILISE LE NOUVEAU GÉNÉRATEUR LINÉAIRE
   * Retourne { grid, path, rooms }
   */
  generateDungeonGrid2D(targetRooms = 8, player = null) {
    console.log('🏰 Génération donjon 2D avec générateur linéaire...');

    // Vérifier si le générateur linéaire est disponible
    if (typeof LinearDungeonGenerator === 'undefined') {
      console.error('❌ LinearDungeonGenerator non disponible!');
      return this.generateDungeonGrid2D_OLD(30, player);
    }

    // Créer et utiliser le générateur linéaire (avec même taille de grille)
    const generator = new LinearDungeonGenerator(this.gridSize);
    const result = generator.generate(targetRooms);

    if (!result.success) {
      console.warn('⚠️ Génération partielle, qualité réduite');
    }

    console.log(`✅ Donjon généré: ${result.rooms.length} salles, ${result.destinyNodes?.length || 0} nœuds, ${result.path.length} cases`);

    return {
      grid: result.grid,
      path: result.path,
      rooms: result.rooms,
      destinyNodes: result.destinyNodes || []
    };
  }

  /**
   * Convertit un path linéaire en grille 2D avec virages organiques
   */
  convertLinearPathToGrid2D(linearDungeon) {
    console.log('🔄 Conversion path linéaire → grille 2D organique...');

    const grid = Array.from({ length: this.gridSize }, () =>
      Array(this.gridSize).fill(0)
    );

    const path2D = [];
    const rooms2D = [];
    const nodes2D = [];

    // Positions FIXES des nœuds (calculées depuis la structure des segments)
    // NODE_1 : après COMMON_START (8 cases) = position 8
    // NODE_2 : après COMMON_START + SEGMENT + COMMON_MID (8 + 5 + 5) = position 18
    const nodePositionsFixed = new Map();
    nodePositionsFixed.set(8, linearDungeon.decisions[0]); // NODE_1
    nodePositionsFixed.set(18, linearDungeon.decisions[1]); // NODE_2

    console.log(`📍 Nœuds positionnés: position 8 = ${linearDungeon.decisions[0].nodeName}, position 18 = ${linearDungeon.decisions[1].nodeName}`);

    // Position départ (centre)
    let x = Math.floor(this.gridSize / 2);
    let y = Math.floor(this.gridSize / 2);

    // Directions
    const directions = [
      { x: 1, y: 0, name: 'E' },   // Est
      { x: 0, y: 1, name: 'S' },   // Sud
      { x: -1, y: 0, name: 'W' },  // Ouest
      { x: 0, y: -1, name: 'N' }   // Nord
    ];

    let currentDir = 0; // Commence vers l'Est
    let stepsInDir = 0;
    const MIN_STRAIGHT_STEPS = 6; // RÈGLE: Minimum 6 cases droites avant virage
    const MAX_STRAIGHT_STEPS = 12; // Maximum avant virage forcé

    // === CHUNK SYSTEM : Générer seulement les 35 premières tuiles ===
    const CHUNK_SIZE = 35;
    const pathToGenerate = linearDungeon.path.slice(0, CHUNK_SIZE);
    console.log(`📦 Génération chunk: ${pathToGenerate.length} tuiles sur ${linearDungeon.path.length} totales`);

    // Parcourir le path linéaire (chunked)
    pathToGenerate.forEach((linearTile, index) => {
      // Placer la tile actuelle
      if (grid[y] && grid[y][x] !== undefined && grid[y][x] === 0) {
        grid[y][x] = 1;

        // Vérifier si cette position est un nœud
        const isNodePosition = nodePositionsFixed.has(index);
        const nodeDecision = nodePositionsFixed.get(index);

        // === MARQUER L'ENTRÉE ===
        const isEntrance = (index === 0);
        
        const tile2D = {
          x: x,
          y: y,
          index: index,
          type: isEntrance ? 'entrance' : linearTile.type,
          segmentId: linearTile.segmentId,
          segmentName: isEntrance ? '🚪 Entrée du Donjon' : linearTile.segmentName,
          segmentColor: isEntrance ? '#FFD700' : linearTile.segmentColor,
          isNode: isNodePosition,
          isEntrance: isEntrance,
          nodeId: nodeDecision ? nodeDecision.nodeId : null,
          nodeName: nodeDecision ? nodeDecision.nodeName : null
        };

        path2D.push(tile2D);

        // Si c'est un nœud, créer une salle 3x3
        if (isNodePosition && nodeDecision) {
          console.log(`🔮 Création salle 3x3 pour nœud "${nodeDecision.nodeName}" à position ${index}`);
          const nodeRoom = this.createRoom3x3AtPosition(grid, x, y, {
            ...linearTile,
            type: 'node',
            isNode: true,
            nodeId: nodeDecision.nodeId,
            nodeName: nodeDecision.nodeName
          });
          if (nodeRoom) {
            rooms2D.push(nodeRoom);
            nodes2D.push({
              nodeId: nodeDecision.nodeId,
              position: index,
              room: nodeRoom,
              x: x,
              y: y
            });
            console.log(`✅ Salle nœud créée: ${nodeRoom.tiles.length} cubes`);

            // IMPORTANT : Forcer 4 cases EN LIGNE DROITE après la salle
            // Choisir une direction de sortie (aléatoire mais pas vers l'entrée)
            const escapeDir = Math.floor(Math.random() * 4);
            const escapeVec = directions[escapeDir];

            console.log(`🚪 Sortie de salle : 4 cases droites dans direction ${escapeVec.name}`);

            for (let i = 0; i < 4; i++) {
              x += escapeVec.x;
              y += escapeVec.y;

              // Marquer ces cases comme path (distance de sécurité)
              if (x >= 0 && y >= 0 && x < this.gridSize && y < this.gridSize) {
                if (grid[y][x] === 0) {
                  grid[y][x] = 1;
                  path2D.push({
                    x: x,
                    y: y,
                    index: index + 0.1 + i, // Index intermédiaire
                    type: 'corridor',
                    segmentId: linearTile.segmentId,
                    segmentName: 'Sortie salle (ligne droite)',
                    segmentColor: linearTile.segmentColor,
                    isNode: false
                  });
                }
              }
            }

            currentDir = escapeDir;
            stepsInDir = 0; // Reset - pourra tourner après ces 4 cases
          }
        }
      }

      // Avancer pour la prochaine tile
      if (index < linearDungeon.path.length - 1) {
        // RÈGLE: Tourner UNIQUEMENT après minimum 6 cases droites
        if (stepsInDir >= MIN_STRAIGHT_STEPS && (stepsInDir >= MAX_STRAIGHT_STEPS || Math.random() < 0.15)) {
          const possibleDirs = [0, 1, 2, 3].filter(d => d !== (currentDir + 2) % 4); // Pas demi-tour
          currentDir = possibleDirs[Math.floor(Math.random() * possibleDirs.length)];
          stepsInDir = 0;
          console.log(`🔄 Virage autorisé après ${stepsInDir} cases droites`);
        }

        // Avancer dans la direction actuelle
        const dir = directions[currentDir];
        let nextX = x + dir.x;
        let nextY = y + dir.y;

        // Vérifier limites
        const margin = 5;
        if (nextX < margin || nextX >= this.gridSize - margin ||
            nextY < margin || nextY >= this.gridSize - margin) {
          // Changer de direction si on touche un bord
          const validDirs = directions
            .map((d, i) => ({ dir: d, index: i }))
            .filter(({ dir }) => {
              const testX = x + dir.x;
              const testY = y + dir.y;
              return testX >= margin && testX < this.gridSize - margin &&
                     testY >= margin && testY < this.gridSize - margin;
            });

          if (validDirs.length > 0) {
            const chosen = validDirs[Math.floor(Math.random() * validDirs.length)];
            currentDir = chosen.index;
            nextX = x + chosen.dir.x;
            nextY = y + chosen.dir.y;
            stepsInDir = 0;
          }
        }

        x = nextX;
        y = nextY;
        stepsInDir++;
      }
    });

    // === CRÉER LES MURS ===
    this.createWalls2DSimple(grid, path2D, rooms2D);

    console.log(`✅ Conversion terminée: ${path2D.length} cubes path, ${rooms2D.length} salles`);

    return {
      grid: grid,
      path: path2D,
      rooms: rooms2D,
      destinyNodes: nodes2D,
      linearDungeon: linearDungeon // Garder référence
    };
  }

  /**
   * Crée une salle 3x3 à une position donnée (pour les nœuds)
   */
  createRoom3x3AtPosition(grid, centerX, centerY, tileData) {
    const roomTiles = [];

    // Créer 3x3 autour du centre
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const rx = centerX + dx;
        const ry = centerY + dy;

        if (rx >= 0 && ry >= 0 && rx < this.gridSize && ry < this.gridSize) {
          // TOUJOURS marquer comme occupé et ajouter aux tiles
          grid[ry][rx] = 1;
          roomTiles.push({ x: rx, y: ry });
        }
      }
    }

    return {
      id: `room_node_${tileData.nodeId || 'unknown'}`,
      centerX: centerX,
      centerY: centerY,
      tiles: roomTiles,
      nodeData: tileData,
      isDestinyNode: (tileData.type === 'node' || tileData.isNode === true)
    };
  }

  /**
   * Crée les murs autour du path ET des salles
   */
  createWalls2DSimple(grid, path, rooms) {
    const wallsSet = new Set();
    const roomWallsSet = new Set(); // Track des murs de salles

    // 1. ÉTAPE 1 : Murs COLLÉS aux salles 3x3 (en premier)
    // RÈGLE: Murs sur les 4 côtés complets, SAUF aux ouvertures d'entrée/sortie (cube central uniquement)
    if (rooms && rooms.length > 0) {
      rooms.forEach(room => {
        // Position de la salle (coin haut-gauche)
        const roomStartX = room.x;
        const roomStartY = room.y;
        const ROOM_SIZE = 3;

        // Créer murs sur chaque côté de la salle
        // CÔTÉ NORD (y = roomStartY - 1)
        for (let x = roomStartX - 1; x <= roomStartX + ROOM_SIZE; x++) {
          const wx = x;
          const wy = roomStartY - 1;
          
          const isEntryOpening = (wx === room.entryX && wy === room.entryY);
          const isExitOpening = (wx === room.exitX && wy === room.exitY);
          
          if (!isEntryOpening && !isExitOpening) {
            if (wx >= 0 && wy >= 0 && wx < this.gridSize && wy < this.gridSize) {
              if (grid[wy][wx] === 0) {
                const key = `${wx},${wy}`;
                grid[wy][wx] = 2;
                wallsSet.add(key);
                roomWallsSet.add(key);
              }
            }
          }
        }
        
        // CÔTÉ SUD (y = roomStartY + ROOM_SIZE)
        for (let x = roomStartX - 1; x <= roomStartX + ROOM_SIZE; x++) {
          const wx = x;
          const wy = roomStartY + ROOM_SIZE;
          
          const isEntryOpening = (wx === room.entryX && wy === room.entryY);
          const isExitOpening = (wx === room.exitX && wy === room.exitY);
          
          if (!isEntryOpening && !isExitOpening) {
            if (wx >= 0 && wy >= 0 && wx < this.gridSize && wy < this.gridSize) {
              if (grid[wy][wx] === 0) {
                const key = `${wx},${wy}`;
                grid[wy][wx] = 2;
                wallsSet.add(key);
                roomWallsSet.add(key);
              }
            }
          }
        }
        
        // CÔTÉ OUEST (x = roomStartX - 1)
        for (let y = roomStartY; y < roomStartY + ROOM_SIZE; y++) {
          const wx = roomStartX - 1;
          const wy = y;
          
          const isEntryOpening = (wx === room.entryX && wy === room.entryY);
          const isExitOpening = (wx === room.exitX && wy === room.exitY);
          
          if (!isEntryOpening && !isExitOpening) {
            if (wx >= 0 && wy >= 0 && wx < this.gridSize && wy < this.gridSize) {
              if (grid[wy][wx] === 0) {
                const key = `${wx},${wy}`;
                grid[wy][wx] = 2;
                wallsSet.add(key);
                roomWallsSet.add(key);
              }
            }
          }
        }
        
        // CÔTÉ EST (x = roomStartX + ROOM_SIZE)
        for (let y = roomStartY; y < roomStartY + ROOM_SIZE; y++) {
          const wx = roomStartX + ROOM_SIZE;
          const wy = y;
          
          const isEntryOpening = (wx === room.entryX && wy === room.entryY);
          const isExitOpening = (wx === room.exitX && wy === room.exitY);
          
          if (!isEntryOpening && !isExitOpening) {
            if (wx >= 0 && wy >= 0 && wx < this.gridSize && wy < this.gridSize) {
              if (grid[wy][wx] === 0) {
                const key = `${wx},${wy}`;
                grid[wy][wx] = 2;
                wallsSet.add(key);
                roomWallsSet.add(key);
              }
            }
          }
        }
      });
    }

    // 2. ÉTAPE 2 : Murs autour du path (couloirs) - UNIQUEMENT PERPENDICULAIRES
    // RÈGLE CRITIQUE: Jamais de mur devant/derrière le flux, seulement sur les côtés
    path.forEach((tile, tileIndex) => {
      // Déterminer la direction du couloir à cette position
      let corridorDir = null;
      
      if (tileIndex > 0) {
        const prevTile = path[tileIndex - 1];
        const dx = tile.x - prevTile.x;
        const dy = tile.y - prevTile.y;
        
        // Direction basée sur le déplacement
        if (dx !== 0) corridorDir = 'horizontal'; // Est/Ouest
        if (dy !== 0) corridorDir = 'vertical';   // Nord/Sud
      }
      
      // Si pas de direction claire (première tile), regarder la suivante
      if (!corridorDir && tileIndex < path.length - 1) {
        const nextTile = path[tileIndex + 1];
        const dx = nextTile.x - tile.x;
        const dy = nextTile.y - tile.y;
        
        if (dx !== 0) corridorDir = 'horizontal';
        if (dy !== 0) corridorDir = 'vertical';
      }
      
      // Placer murs UNIQUEMENT perpendiculaires à la direction
      if (corridorDir === 'horizontal') {
        // Couloir horizontal (Est/Ouest) → Murs au NORD et SUD uniquement
        const wallPositions = [
          { x: tile.x, y: tile.y - 1 }, // Nord
          { x: tile.x, y: tile.y + 1 }  // Sud
        ];
        
        wallPositions.forEach(pos => {
          if (pos.x >= 0 && pos.y >= 0 && pos.x < this.gridSize && pos.y < this.gridSize) {
            if (grid[pos.y][pos.x] === 0) {
              const key = `${pos.x},${pos.y}`;
              if (!wallsSet.has(key)) {
                grid[pos.y][pos.x] = 2;
                wallsSet.add(key);
              }
            }
          }
        });
        
      } else if (corridorDir === 'vertical') {
        // Couloir vertical (Nord/Sud) → Murs à l'EST et OUEST uniquement
        const wallPositions = [
          { x: tile.x - 1, y: tile.y }, // Ouest
          { x: tile.x + 1, y: tile.y }  // Est
        ];
        
        wallPositions.forEach(pos => {
          if (pos.x >= 0 && pos.y >= 0 && pos.x < this.gridSize && pos.y < this.gridSize) {
            if (grid[pos.y][pos.x] === 0) {
              const key = `${pos.x},${pos.y}`;
              if (!wallsSet.has(key)) {
                grid[pos.y][pos.x] = 2;
                wallsSet.add(key);
              }
            }
          }
        });
      }
    });

    console.log(`🧱 ${wallsSet.size} murs créés (${roomWallsSet.size} salles + ${wallsSet.size - roomWallsSet.size} corridors)`);
  }

  /**
   * ANCIEN SYSTÈME (backup)
   */
  generateDungeonGrid2D_OLD(length, player = null) {
    console.log('🏰 Génération donjon 2D (ancien système de secours)...');

    // Initialiser le système de nœuds si nécessaire
    if (!this.destinyNodes && typeof DestinyNodesSystem !== 'undefined') {
      this.destinyNodes = new DestinyNodesSystem();
    }

    // Créer grille vide (0=vide, 1=path/salle, 2=mur)
    const grid = Array.from({ length: this.gridSize }, () =>
      Array(this.gridSize).fill(0)
    );

    const path = [];
    const rooms = [];
    const destinyNodesData = []; // Stocke les nœuds générés

    // Config
    const TARGET_LENGTH = length;
    const margin = 5;
    const ROOM_INTERVAL_MIN = 6; // Réduit pour placer des salles normales
    const ROOM_INTERVAL_MAX = 12;
    const ROOM_SIZE = 3;

    // Positions des Nœuds de Destin (fixes)
    const NODE_POSITIONS = this.destinyNodes ?
      this.destinyNodes.getAllNodes().map(n => n.position) :
      [8, 18];

    // Position départ (centre)
    let x = Math.floor(this.gridSize / 2);
    let y = Math.floor(this.gridSize / 2);

    // Directions : 0=Est, 1=Sud, 2=Ouest, 3=Nord
    const directions = [
      { x: 1, y: 0, name: 'E' },   // Est
      { x: 0, y: 1, name: 'S' },   // Sud
      { x: -1, y: 0, name: 'W' },  // Ouest
      { x: 0, y: -1, name: 'N' }   // Nord
    ];

    let currentDir = 0; // Est
    let pathIndex = 0;
    let stepsInCurrentDirection = 0;
    let stepsSinceLastRoom = ROOM_INTERVAL_MIN;
    const minStepsBeforeTurn = 2;
    const maxStepsBeforeTurn = 8;

    // Mémoire (zones occupées)
    const occupiedZones = new Set();
    const markZone = (x, y, radius = 1) => {
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          occupiedZones.add(`${x + dx},${y + dy}`);
        }
      }
    };

    // Scoring d'une direction
    const evaluateDirection = (testX, testY, testDir, lookAhead = 5) => {
      let score = 100;
      const dirVec = directions[testDir];

      for (let i = 1; i <= lookAhead; i++) {
        const futureX = testX + dirVec.x * i;
        const futureY = testY + dirVec.y * i;

        // Pénalité si proche des bords
        const distToEdge = Math.min(
          futureX - margin,
          this.gridSize - margin - futureX,
          futureY - margin,
          this.gridSize - margin - futureY
        );

        if (distToEdge < 3) {
          score -= (3 - distToEdge) * 20;
        }

        // Pénalité si hors limites
        if (futureX < margin || futureY < margin ||
            futureX >= this.gridSize - margin ||
            futureY >= this.gridSize - margin) {
          score -= 100;
          break;
        }

        // Pénalité si occupé
        if (grid[futureY] && grid[futureY][futureX] !== 0) {
          score -= 100;
          break;
        }

        // Pénalité si zone occupée
        if (occupiedZones.has(`${futureX},${futureY}`)) {
          score -= 50;
        }

        // Vérifier séparation stricte
        if (!this.canPlaceCorridorTile2D(grid, testX, testY, testDir, margin, directions)) {
          score -= 30;
        }
      }

      return score;
    };

    // === ENTRÉE ===
    grid[y][x] = 1;
    markZone(x, y);
    path.push({ x, y, type: 'entrance', index: pathIndex++ });

    console.log(`📍 Entrée: (${x}, ${y})`);

    // === BOUCLE PRINCIPALE ===
    let attempts = 0;
    const maxAttempts = TARGET_LENGTH * 100;
    let stuckCount = 0;

    while (pathIndex < TARGET_LENGTH && attempts < maxAttempts) {
      attempts++;

      // === CRÉER UN NŒUD DE DESTIN ? ===
      const isNodePosition = NODE_POSITIONS.includes(pathIndex);

      if (isNodePosition && this.destinyNodes) {
        const nodeData = this.destinyNodes.getNodeAtPosition(pathIndex);

        if (nodeData) {
          console.log(`🔮 Nœud de Destin détecté à position ${pathIndex}: ${nodeData.name}`);

          // Créer la salle du nœud (3x3, type spécial)
          const nodeRoom = this.createDestinyNode_2D(
            grid, path, x, y, currentDir, margin, pathIndex, directions, nodeData
          );

          if (nodeRoom.success) {
            pathIndex = nodeRoom.newPathIndex;
            x = nodeRoom.exitX;
            y = nodeRoom.exitY;
            currentDir = nodeRoom.exitDir;
            stepsSinceLastRoom = 999; // Réinitialiser pour éviter salle immédiatement après
            stuckCount = 0;
            markZone(x, y, 3); // Zone plus large pour les nœuds

            rooms.push(nodeRoom.room);
            destinyNodesData.push({
              nodeId: nodeData.id,
              position: pathIndex,
              room: nodeRoom.room
            });

            console.log(`✨ Nœud "${nodeData.name}" créé avec succès`);

            // TODO: Après le nœud, résoudre quel segment prendre et le générer
            // Pour l'instant on continue normalement
            continue;
          }
        }
      }

      // === CRÉER UNE SALLE NORMALE ? ===
      const shouldCreateRoom = (
        pathIndex > 5 &&
        pathIndex < TARGET_LENGTH - 10 &&
        stepsSinceLastRoom >= ROOM_INTERVAL_MIN &&
        (stepsSinceLastRoom >= ROOM_INTERVAL_MAX || Math.random() < 0.3) &&
        !NODE_POSITIONS.includes(pathIndex + 1) && // Pas juste avant un nœud
        !NODE_POSITIONS.includes(pathIndex - 1)    // Pas juste après un nœud
      );

      if (shouldCreateRoom) {
        const roomResult = this.createRoom3x3_2D(
          grid, path, x, y, currentDir, margin, pathIndex, directions, rooms.length
        );

        if (roomResult.success) {
          pathIndex = roomResult.newPathIndex;
          x = roomResult.exitX;
          y = roomResult.exitY;
          currentDir = roomResult.exitDir;
          stepsSinceLastRoom = 0;
          stuckCount = 0;
          markZone(x, y, 2);
          rooms.push(roomResult.room);
          console.log(`🏛️ Salle créée: ${roomResult.room.id}`);
          continue;
        }
      }

      // === CRÉER COULOIR ===
      const shouldTurn = (
        stepsInCurrentDirection >= minStepsBeforeTurn &&
        (stepsInCurrentDirection >= maxStepsBeforeTurn || Math.random() < 0.25)
      );

      if (shouldTurn || stuckCount > 0) {
        const oppositeDir = (currentDir + 2) % 4;
        const possibleDirs = [0, 1, 2, 3].filter(d => d !== oppositeDir);

        const dirScores = possibleDirs.map(dir => ({
          dir,
          score: evaluateDirection(x, y, dir, 6)
        })).sort((a, b) => b.score - a.score);

        let foundValidDir = false;
        for (const dirScore of dirScores) {
          if (dirScore.score > 0 &&
              this.canPlaceCorridorTile2D(grid, x, y, dirScore.dir, margin, directions)) {
            currentDir = dirScore.dir;
            stepsInCurrentDirection = 0;
            foundValidDir = true;
            break;
          }
        }

        if (!foundValidDir) {
          stuckCount++;
          if (stuckCount > 10) {
            console.warn(`⚠️ Bloqué à ${pathIndex} cases`);
            break;
          }
          continue;
        } else {
          stuckCount = 0;
        }
      }

      // Avancer
      const dirVec = directions[currentDir];
      const nx = x + dirVec.x;
      const ny = y + dirVec.y;

      if (!this.canPlaceCorridorTile2D(grid, x, y, currentDir, margin, directions)) {
        stuckCount++;
        if (stuckCount > 10) break;
        continue;
      }

      grid[ny][nx] = 1;
      markZone(nx, ny);

      let tileType = 'corridor';
      if (Math.random() < 0.1) tileType = 'event'; // Événements mineurs

      path.push({ x: nx, y: ny, type: tileType, index: pathIndex++ });

      x = nx;
      y = ny;
      stepsInCurrentDirection++;
      stepsSinceLastRoom++;
      stuckCount = 0;
    }

    // === SORTIE ===
    if (path.length > 0) {
      const lastTile = path[path.length - 1];
      lastTile.type = 'exit';
      console.log(`🏆 Sortie: (${lastTile.x}, ${lastTile.y})`);
    }

    // === CRÉER LES MURS ===
    this.createWalls2D(grid, path, rooms);

    console.log(`✅ Donjon généré: ${path.length} cases, ${rooms.length} salles, ${destinyNodesData.length} nœuds de destin`);

    return { grid, path, rooms, destinyNodes: destinyNodesData };
  }

  /**
   * Crée un Nœud de Destin (salle 3x3 spéciale)
   * Similaire à createRoom3x3_2D mais avec type "destiny_node"
   */
  createDestinyNode_2D(grid, path, startX, startY, entryDir, margin, pathIndex, directions, nodeData) {
    const ROOM_SIZE = 3;

    // RÈGLE STRICTE: Les nœuds ne tournent JAMAIS à 90°
    // Type 1: Axe Nord/Sud (entryDir = 3 Nord OU 1 Sud)
    // Type 2: Axe Est/Ouest (entryDir = 0 Est OU 2 Ouest)
    
    let roomStartX, roomStartY;
    let entryX, entryY;
    let exitX, exitY;
    let exitDir;

    if (entryDir === 1) { // Entrée par le SUD → Sortie par le NORD
      roomStartX = startX - Math.floor(ROOM_SIZE / 2);
      roomStartY = startY;
      entryX = startX;
      entryY = startY;
      exitX = startX;
      exitY = startY + ROOM_SIZE - 1;
      exitDir = 1;
      
    } else if (entryDir === 3) { // Entrée par le NORD → Sortie par le SUD
      roomStartX = startX - Math.floor(ROOM_SIZE / 2);
      roomStartY = startY - ROOM_SIZE + 1;
      entryX = startX;
      entryY = startY;
      exitX = startX;
      exitY = startY - ROOM_SIZE + 1;
      exitDir = 3;
      
    } else if (entryDir === 0) { // Entrée par l'EST → Sortie par l'OUEST
      roomStartX = startX;
      roomStartY = startY - Math.floor(ROOM_SIZE / 2);
      entryX = startX;
      entryY = startY;
      exitX = startX + ROOM_SIZE - 1;
      exitY = startY;
      exitDir = 0;
      
    } else { // entryDir === 2: Entrée par l'OUEST → Sortie par l'EST
      roomStartX = startX - ROOM_SIZE + 1;
      roomStartY = startY - Math.floor(ROOM_SIZE / 2);
      entryX = startX;
      entryY = startY;
      exitX = startX - ROOM_SIZE + 1;
      exitY = startY;
      exitDir = 2;
    }

    // Vérifications identiques
    if (roomStartX < margin || roomStartY < margin ||
        roomStartX + ROOM_SIZE >= this.gridSize - margin ||
        roomStartY + ROOM_SIZE >= this.gridSize - margin) {
      return { success: false };
    }

    const roomTiles = [];
    for (let ry = 0; ry < ROOM_SIZE; ry++) {
      for (let rx = 0; rx < ROOM_SIZE; rx++) {
        const tx = roomStartX + rx;
        const ty = roomStartY + ry;

        if (tx === entryX && ty === entryY) {
          roomTiles.push({ x: tx, y: ty, isPath: true });
          continue;
        }

        if (grid[ty][tx] !== 0) {
          return { success: false };
        }

        roomTiles.push({ x: tx, y: ty, isPath: false });
      }
    }

    if (grid[exitY][exitX] !== 0) {
      return { success: false };
    }

    // Vérification séparation stricte
    for (const tile of roomTiles) {
      if ((tile.x === entryX && tile.y === entryY) ||
          (tile.x === exitX && tile.y === exitY)) {
        continue;
      }

      const sideChecks = [
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 }
      ];

      for (const side of sideChecks) {
        const sideX = tile.x + side.x;
        const sideY = tile.y + side.y;

        const isOutsideRoom = (sideX < roomStartX || sideX >= roomStartX + ROOM_SIZE ||
                               sideY < roomStartY || sideY >= roomStartY + ROOM_SIZE);

        if (isOutsideRoom) {
          if (sideX >= 0 && sideY >= 0 &&
              sideX < this.gridSize && sideY < this.gridSize) {
            if (grid[sideY][sideX] === 1) {
              return { success: false };
            }
          }
        }
      }
    }

    // === CRÉER LE NŒUD ===
    const roomId = `destiny_node_${nodeData.id}`;
    const centerX = Math.floor((entryX + exitX) / 2);
    const centerY = Math.floor((entryY + exitY) / 2);

    // Marquer toutes les cases
    roomTiles.forEach(tile => {
      grid[tile.y][tile.x] = 1;
    });

    // Path du nœud
    const roomPath = [];
    roomPath.push({ x: entryX, y: entryY, type: 'destiny_node_entry' });

    if (centerX !== entryX || centerY !== entryY) {
      roomPath.push({ x: centerX, y: centerY, type: 'destiny_node_center' });
    }

    if (exitX !== centerX || exitY !== centerY) {
      roomPath.push({ x: exitX, y: exitY, type: 'destiny_node_exit' });
    }

    // Ajouter au path global avec métadonnées du nœud
    let roomPathIndex = 0;
    roomPath.forEach(tile => {
      path.push({
        x: tile.x,
        y: tile.y,
        type: tile.type,
        index: pathIndex + roomPathIndex,
        roomId: roomId,
        nodeId: nodeData.id,
        nodeName: nodeData.name,
        isDestinyNode: true
      });
      roomPathIndex++;
    });

    const room = {
      id: roomId,
      x: roomStartX,
      y: roomStartY,
      width: ROOM_SIZE,
      height: ROOM_SIZE,
      entryX: entryX,
      entryY: entryY,
      exitX: exitX,
      exitY: exitY,
      centerX: centerX,
      centerY: centerY,
      tiles: roomTiles.map(t => ({ x: t.x, y: t.y })),
      nodeData: nodeData, // Référence au nœud
      isDestinyNode: true
    };

    return {
      success: true,
      room: room,
      exitX: exitX,
      exitY: exitY,
      exitDir: exitDir,
      newPathIndex: pathIndex + roomPathIndex
    };
  }

  /**
   * Vérifie si on peut placer une case de couloir (séparation stricte)
   * Adapté de dungeon.js canPlaceCorridorTile()
   */
  canPlaceCorridorTile2D(grid, currentX, currentY, dir, margin, directions) {
    const dirVec = directions[dir];
    const nx = currentX + dirVec.x;
    const ny = currentY + dirVec.y;

    // Vérifier limites
    if (nx < margin || ny < margin ||
        nx >= this.gridSize - margin ||
        ny >= this.gridSize - margin) {
      return false;
    }

    // Vérifier si déjà occupé
    if (grid[ny][nx] !== 0) {
      return false;
    }

    // Vérifier séparation stricte (pas de couloirs adjacents)
    const sideChecks = [
      { x: 0, y: -1 },  // Nord
      { x: 1, y: 0 },   // Est
      { x: 0, y: 1 },   // Sud
      { x: -1, y: 0 }   // Ouest
    ];

    for (const side of sideChecks) {
      const sideX = nx + side.x;
      const sideY = ny + side.y;

      // Skip la case actuelle
      if (sideX === currentX && sideY === currentY) continue;

      // Skip la case suivante dans la direction du path
      const nextX = nx + dirVec.x;
      const nextY = ny + dirVec.y;
      if (sideX === nextX && sideY === nextY) continue;

      // Vérifier si occupé
      if (sideX >= 0 && sideY >= 0 &&
          sideX < this.gridSize && sideY < this.gridSize) {
        if (grid[sideY][sideX] === 1) {
          return false; // Adjacent à un autre couloir → INTERDIT
        }
      }
    }

    return true;
  }

  /**
   * Crée une salle 3x3 avec entrée et sortie
   * Adapté de dungeon.js createRoom3x3()
   */
  createRoom3x3_2D(grid, path, startX, startY, entryDir, margin, pathIndex, directions, roomNumber) {
    const ROOM_SIZE = 3;

    // RÈGLE STRICTE: Les salles ne tournent JAMAIS à 90°
    // Type 1: Axe Nord/Sud (entryDir = 3 Nord OU 1 Sud)
    // Type 2: Axe Est/Ouest (entryDir = 0 Est OU 2 Ouest)
    
    let roomStartX, roomStartY;
    let entryX, entryY;
    let exitX, exitY;
    let exitDir;

    // Déterminer le type de salle selon l'axe d'approche
    const isNorthSouthAxis = (entryDir === 1 || entryDir === 3); // Sud (1) ou Nord (3)
    const isEastWestAxis = (entryDir === 0 || entryDir === 2);   // Est (0) ou Ouest (2)

    if (entryDir === 1) { // Entrée par le SUD → Sortie par le NORD
      roomStartX = startX - Math.floor(ROOM_SIZE / 2); // Centrer horizontalement
      roomStartY = startY;
      entryX = startX; // Cube central du côté SUD
      entryY = startY;
      exitX = startX;  // Cube central du côté NORD (même X !)
      exitY = startY + ROOM_SIZE - 1;
      exitDir = 1; // Continuer vers le SUD après sortie
      
    } else if (entryDir === 3) { // Entrée par le NORD → Sortie par le SUD
      roomStartX = startX - Math.floor(ROOM_SIZE / 2); // Centrer horizontalement
      roomStartY = startY - ROOM_SIZE + 1;
      entryX = startX; // Cube central du côté NORD
      entryY = startY;
      exitX = startX;  // Cube central du côté SUD (même X !)
      exitY = startY - ROOM_SIZE + 1;
      exitDir = 3; // Continuer vers le NORD après sortie
      
    } else if (entryDir === 0) { // Entrée par l'EST → Sortie par l'OUEST
      roomStartX = startX;
      roomStartY = startY - Math.floor(ROOM_SIZE / 2); // Centrer verticalement
      entryX = startX; // Cube central du côté EST
      entryY = startY;
      exitX = startX + ROOM_SIZE - 1; // Cube central du côté OUEST (même Y !)
      exitY = startY;
      exitDir = 0; // Continuer vers l'EST après sortie
      
    } else { // entryDir === 2: Entrée par l'OUEST → Sortie par l'EST
      roomStartX = startX - ROOM_SIZE + 1;
      roomStartY = startY - Math.floor(ROOM_SIZE / 2); // Centrer verticalement
      entryX = startX; // Cube central du côté OUEST
      entryY = startY;
      exitX = startX - ROOM_SIZE + 1; // Cube central du côté EST (même Y !)
      exitY = startY;
      exitDir = 2; // Continuer vers l'OUEST après sortie
    }

    // Vérifier que la salle tient dans la grille
    if (roomStartX < margin || roomStartY < margin ||
        roomStartX + ROOM_SIZE >= this.gridSize - margin ||
        roomStartY + ROOM_SIZE >= this.gridSize - margin) {
      return { success: false };
    }

    // Vérifier que toutes les cases sont libres
    const roomTiles = [];
    for (let ry = 0; ry < ROOM_SIZE; ry++) {
      for (let rx = 0; rx < ROOM_SIZE; rx++) {
        const tx = roomStartX + rx;
        const ty = roomStartY + ry;

        if (tx === entryX && ty === entryY) {
          roomTiles.push({ x: tx, y: ty, isPath: true });
          continue;
        }

        if (grid[ty][tx] !== 0) {
          return { success: false };
        }

        roomTiles.push({ x: tx, y: ty, isPath: false });
      }
    }

    // Vérifier que la sortie est libre
    if (grid[exitY][exitX] !== 0) {
      return { success: false };
    }

    // === VÉRIFICATION CRITIQUE : SÉPARATION STRICTE ===
    for (const tile of roomTiles) {
      if ((tile.x === entryX && tile.y === entryY) ||
          (tile.x === exitX && tile.y === exitY)) {
        continue;
      }

      const sideChecks = [
        { x: 0, y: -1 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 }
      ];

      for (const side of sideChecks) {
        const sideX = tile.x + side.x;
        const sideY = tile.y + side.y;

        const isOutsideRoom = (sideX < roomStartX || sideX >= roomStartX + ROOM_SIZE ||
                               sideY < roomStartY || sideY >= roomStartY + ROOM_SIZE);

        if (isOutsideRoom) {
          if (sideX >= 0 && sideY >= 0 &&
              sideX < this.gridSize && sideY < this.gridSize) {
            if (grid[sideY][sideX] === 1) {
              return { success: false }; // Adjacent à un couloir → INTERDIT
            }
          }
        }
      }
    }

    // === CRÉER LA SALLE ===
    const roomId = `room_${roomNumber}`;
    const centerX = Math.floor((entryX + exitX) / 2);
    const centerY = Math.floor((entryY + exitY) / 2);

    // Marquer toutes les cases comme occupées
    roomTiles.forEach(tile => {
      grid[tile.y][tile.x] = 1;
    });

    // Créer le path de la salle (entrée → centre → sortie)
    const roomPath = [];
    roomPath.push({ x: entryX, y: entryY, type: 'room_entry' });

    if (centerX !== entryX || centerY !== entryY) {
      roomPath.push({ x: centerX, y: centerY, type: 'room_center' });
    }

    if (exitX !== centerX || exitY !== centerY) {
      roomPath.push({ x: exitX, y: exitY, type: 'room_exit' });
    }

    // Ajouter au path global
    let roomPathIndex = 0;
    roomPath.forEach(tile => {
      path.push({
        x: tile.x,
        y: tile.y,
        type: tile.type,
        index: pathIndex + roomPathIndex,
        roomId: roomId
      });
      roomPathIndex++;
    });

    const room = {
      id: roomId,
      x: roomStartX,
      y: roomStartY,
      width: ROOM_SIZE,
      height: ROOM_SIZE,
      entryX: entryX,
      entryY: entryY,
      exitX: exitX,
      exitY: exitY,
      centerX: centerX,
      centerY: centerY,
      tiles: roomTiles.map(t => ({ x: t.x, y: t.y }))
    };

    return {
      success: true,
      room: room,
      exitX: exitX,
      exitY: exitY,
      exitDir: exitDir,
      newPathIndex: pathIndex + roomPathIndex
    };
  }

  /**
   * Crée les murs autour du path et des salles
   * Adapté de dungeon.js createWalls()
   */
  createWalls2D(grid, path, rooms) {
    const wallsSet = new Set();

    // Murs autour du path (couloirs)
    path.forEach(tile => {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue; // Skip le centre

          const nx = tile.x + dx;
          const ny = tile.y + dy;

          if (nx < 0 || ny < 0 ||
              nx >= this.gridSize ||
              ny >= this.gridSize) {
            continue;
          }

          // Placer un mur si la case est vide
          if (grid[ny][nx] === 0) {
            const key = `${nx},${ny}`;
            if (!wallsSet.has(key)) {
              grid[ny][nx] = 2; // 2 = mur
              wallsSet.add(key);
            }
          }
        }
      }
    });

    // Murs autour des salles (renforcé)
    if (rooms && rooms.length > 0) {
      rooms.forEach(room => {
        for (let ry = -1; ry <= room.height; ry++) {
          for (let rx = -1; rx <= room.width; rx++) {
            // Skip l'intérieur de la salle
            if (rx >= 0 && rx < room.width && ry >= 0 && ry < room.height) {
              continue;
            }

            const tx = room.x + rx;
            const ty = room.y + ry;

            if (tx < 0 || ty < 0 ||
                tx >= this.gridSize ||
                ty >= this.gridSize) {
              continue;
            }

            // Ne pas placer de mur sur l'entrée/sortie
            const isEntry = (tx === room.entryX && ty === room.entryY);
            const isExit = (tx === room.exitX && ty === room.exitY);

            if (!isEntry && !isExit) {
              if (grid[ty][tx] === 0) {
                const key = `${tx},${ty}`;
                if (!wallsSet.has(key)) {
                  grid[ty][tx] = 2;
                  wallsSet.add(key);
                }
              }
            }
          }
        }
      });
    }

    console.log(`🧱 ${wallsSet.size} murs créés`);
  }

  /**
   * ANCIEN SYSTÈME (à supprimer après migration)
   */
  generateOrganicPath_OLD(length) {
    const path = [];
    const directions = [
      { dx: 1, dy: 0, name: 'E', index: 0 },
      { dx: 0, dy: 1, name: 'S', index: 1 },
      { dx: -1, dy: 0, name: 'W', index: 2 },
      { dx: 0, dy: -1, name: 'N', index: 3 }
    ];

    // Positions des nœuds (index dans le path)
    const nodePositions = [8, 18];

    // Départ au centre de la grille
    let cartX = Math.floor(this.gridSize / 2);
    let cartY = Math.floor(this.gridSize / 2);
    let currentDir = directions[0]; // Départ vers l'Est
    let turnHistory = []; // Historique des virages (pour éviter les boucles)

    path.push({ x: cartX, y: cartY, direction: currentDir.name });

    for (let i = 1; i < length; i++) {
      let nextDir = currentDir;
      let nextX, nextY;
      let validMove = false;
      let attempts = 0;
      const maxAttempts = 100;

      // Vérifier si le prochain cube est un nœud
      const isNextNode = nodePositions.includes(i);

      while (!validMove && attempts < maxAttempts) {
        // Choisir direction
        if (!isNextNode && attempts < 30) {
          // Essayer de continuer tout droit (60% du temps)
          if (Math.random() < 0.6) {
            nextDir = currentDir;
          } else {
            // Tourner à gauche ou droite (pas demi-tour)
            const turn = Math.random() < 0.5 ? -1 : 1;
            const newIndex = (currentDir.index + turn + 4) % 4;
            nextDir = directions[newIndex];

            // Vérifier l'historique : si on a déjà tourné 2 fois dans la même direction, interdire
            if (turnHistory.length >= 2) {
              const lastTwo = turnHistory.slice(-2);
              if (lastTwo[0] === turn && lastTwo[1] === turn) {
                // 2 virages consécutifs dans la même direction → on continue tout droit
                nextDir = currentDir;
              }
            }
          }
        } else if (attempts >= 30) {
          // Si on a du mal à trouver, essayer toutes les directions
          const randomDirIndex = Math.floor(Math.random() * 4);
          nextDir = directions[randomDirIndex];
        }

        // Si c'est un nœud, on doit avancer de distance 2 dans la direction actuelle
        if (isNextNode) {
          nextX = cartX + currentDir.dx * 2;
          nextY = cartY + currentDir.dy * 2;
        } else {
          // Sinon, distance 1 normale
          nextX = cartX + nextDir.dx;
          nextY = cartY + nextDir.dy;
        }

        // Vérifier toutes les contraintes
        if (this.isPositionSafe(nextX, nextY, path, i, nodePositions, isNextNode)) {
          validMove = true;
        }

        attempts++;
      }

      // Si échec après tous les essais, forcer un mouvement simple
      if (!validMove) {
        console.warn(`⚠️ Position forcée à l'index ${i} après ${attempts} tentatives`);
        // Essayer toutes les directions
        for (const dir of directions) {
          if (isNextNode) {
            nextX = cartX + dir.dx * 2;
            nextY = cartY + dir.dy * 2;
          } else {
            nextX = cartX + dir.dx;
            nextY = cartY + dir.dy;
          }

          if (this.isPositionSafe(nextX, nextY, path, i, nodePositions, isNextNode)) {
            nextDir = dir;
            validMove = true;
            break;
          }
        }
      }

      // Dernier recours : avancer même si pas idéal
      if (!validMove) {
        console.error(`❌ Impossible de trouver position sûre à l'index ${i} - ARRÊT`);
        break; // Arrêter la génération plutôt que créer une collision
      }

      // Enregistrer le virage dans l'historique
      if (nextDir.index !== currentDir.index) {
        const turn = (nextDir.index - currentDir.index + 4) % 4;
        const turnDirection = turn === 1 ? 1 : (turn === 3 ? -1 : 0);
        if (turnDirection !== 0) {
          turnHistory.push(turnDirection);
          if (turnHistory.length > 3) turnHistory.shift(); // Garder seulement les 3 derniers
        }
      }

      // Si c'est un nœud et qu'on avance de 2, ajouter le cube intermédiaire (ENTRÉE)
      if (isNextNode && validMove) {
        const entranceX = cartX + currentDir.dx;
        const entranceY = cartY + currentDir.dy;
        path.push({
          x: entranceX,
          y: entranceY,
          direction: currentDir.name,
          isEntrance: true // Marquer comme entrée
        });
        console.log(`🚪 Entrée de salle ajoutée à l'index ${path.length - 1} (${entranceX}, ${entranceY})`);
      }

      path.push({ x: nextX, y: nextY, direction: nextDir.name });

      cartX = nextX;
      cartY = nextY;
      currentDir = nextDir;
    }

    console.log(`🗺️ Path organique généré: ${path.length} tuiles`);

    return path;
  }

  /**
   * Vérifie si une position est sûre (pas de collision, pas trop près des nœuds)
   */
  isPositionSafe(x, y, path, currentIndex, nodePositions, isNextNode = false) {
    // 1. Vérifier limites de la grille (avec marge augmentée)
    const margin = 5; // Augmenté de 3 à 5 pour plus de sécurité
    if (x < margin || x >= this.gridSize - margin || y < margin || y >= this.gridSize - margin) {
      return false;
    }

    // 2. Vérifier qu'on n'est pas sur une position déjà occupée
    if (path.some(p => p.x === x && p.y === y)) {
      return false;
    }

    // 3. Vérifier qu'on n'est pas ADJACENT à un cube du path (sauf le dernier)
    // Distance minimale augmentée pour éviter superpositions aux virages
    for (let i = 0; i < path.length - 1; i++) {
      const p = path[i];
      const distance = Math.abs(p.x - x) + Math.abs(p.y - y);

      // Si adjacent à un cube ancien (pas le dernier), INTERDIT
      // SAUF pour les nœuds qui sont à distance 2
      if (distance === 1 && !isNextNode) {
        return false;
      }
    }

    // 4. Vérifier la position intermédiaire pour les nœuds (l'entrée ne doit pas être occupée)
    if (isNextNode && path.length > 0) {
      const lastPos = path[path.length - 1];
      const entranceX = lastPos.x + Math.sign(x - lastPos.x);
      const entranceY = lastPos.y + Math.sign(y - lastPos.y);

      // Vérifier que la position de l'entrée n'est pas déjà occupée
      if (path.some(p => p.x === entranceX && p.y === entranceY)) {
        return false;
      }

      // Vérifier qu'on ne coupe pas un autre chemin (zone de sécurité étendue)
      for (let dx = -2; dx <= 2; dx++) {
        for (let dy = -2; dy <= 2; dy++) {
          if (path.some(p => p.x === entranceX + dx && p.y === entranceY + dy &&
                             Math.abs(p.x - lastPos.x) > 1 && Math.abs(p.y - lastPos.y) > 1)) {
            return false;
          }
        }
      }
    }

    // 5. Vérifier qu'on n'est pas trop près d'un nœud existant (zone de sécurité augmentée)
    for (const nodeIndex of nodePositions) {
      if (nodeIndex < path.length) {
        // Nœud déjà placé
        const nodePos = path[nodeIndex];
        const dist = Math.max(Math.abs(nodePos.x - x), Math.abs(nodePos.y - y));

        // Garder une marge de 4 cubes autour des nœuds (augmenté de 3 à 4)
        // Sauf si c'est le nœud lui-même ou son entrée
        if (dist <= 4 && currentIndex !== nodeIndex && currentIndex !== nodeIndex - 1) {
          return false;
        }
      }
    }

    // 6. Vérifier qu'on ne crée pas une zone trop rapprochée (critères plus stricts)
    let nearbyCount = 0;
    for (const p of path) {
      const dist = Math.abs(p.x - x) + Math.abs(p.y - y);
      if (dist <= 3 && dist > 1) {
        nearbyCount++;
      }
    }
    // Si trop de cubes proches, refuser (seuil abaissé de 4 à 3)
    if (nearbyCount > 3 && !isNextNode) {
      return false;
    }

    return true;
  }

  /**
   * Convertit la grille 2D en cubes 3D isométriques
   * grid[y][x]: 0=vide, 1=path/salle, 2=mur
   */
  convertGrid2DToCubes(grid, path, rooms) {
    this.grid.clear();

    console.log('🔄 Conversion grille 2D → cubes 3D...');

    // 1. Créer les cubes du PATH (couloirs + salles)
    path.forEach((tile, index) => {
      const key = `${tile.x},${tile.y}`;

      let cubeType, cubeColor;

      // Priorité 1 : Utiliser la couleur du segment si disponible
      if (tile.segmentColor) {
        cubeColor = tile.segmentColor;
        cubeType = tile.type || 'segment';
      }
      // Nœuds de Destin (couleur spéciale lumineuse)
      else if (tile.isNode || (tile.type && tile.type === 'node')) {
        cubeType = 'destiny_node';
        cubeColor = '#f0c050'; // Doré brillant (lumineux)
      }
      // Couloirs
      else if (tile.type === 'corridor' || tile.type === 'entrance' || tile.type === 'exit') {
        cubeType = 'corridor';
        cubeColor = '#4a4852'; // Gris clair
      }
      // Salles normales (entrée, centre, sortie)
      else if (tile.type && tile.type.startsWith('room_')) {
        cubeType = tile.type;
        cubeColor = '#d4af37'; // Doré
      }
      // Événements
      else if (tile.type === 'event' || tile.type === 'combat' || tile.type === 'trap' || tile.type === 'chest') {
        cubeType = tile.type;
        cubeColor = '#6a5a7a'; // Violet pour événements
      }
      // Défaut
      else {
        cubeType = 'corridor';
        cubeColor = '#4a4852';
      }

      this.grid.set(key, {
        type: cubeType,
        color: cubeColor,
        index: index,
        isPlayerPath: true,
        roomId: tile.roomId || null
      });
    });

    // 2. Ajouter les cubes de SOL de SALLE (les 9 cubes de chaque salle 3x3)
    if (rooms && rooms.length > 0) {
      rooms.forEach(room => {
        // Déterminer la couleur selon le type de salle
        const isDestinyNode = room.isDestinyNode || false;
        const roomColor = isDestinyNode ? '#f0c050' : '#d4af37'; // Doré brillant pour nœuds

        room.tiles.forEach(tile => {
          const key = `${tile.x},${tile.y}`;

          // Si déjà dans le path, TOUJOURS mettre à jour la couleur
          if (this.grid.has(key)) {
            const existing = this.grid.get(key);
            existing.color = roomColor; // Forcer couleur de salle
            existing.isDestinyNode = isDestinyNode;
            existing.roomId = room.id;
            return;
          }

          // Ajouter sol de salle
          this.grid.set(key, {
            type: isDestinyNode ? 'destiny_node_floor' : 'room_floor',
            color: roomColor,
            roomId: room.id,
            isPlayerPath: false,
            isDestinyNode: isDestinyNode
          });
        });
      });
    }

    // 3. Ajouter les MURS (grid[y][x] === 2)
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] === 2) {
          const key = `${x},${y}`;

          // Ne pas écraser un cube déjà placé
          if (this.grid.has(key)) {
            continue;
          }

          this.grid.set(key, {
            type: 'wall',
            color: '#1a1820', // Gris très foncé
            isPlayerPath: false,
            heightMultiplier: 2 // TOUS les murs : 2x plus hauts
          });
        }
      }
    }

    console.log(`✅ ${this.grid.size} cubes créés (${path.length} path + ${rooms.length} salles)`);
  }

  /**
   * Place les cubes sur la grille selon le path et les nœuds (ANCIEN SYSTÈME)
   */
  generateDungeonGrid_OLD(dungeon) {
    this.grid.clear();

    // 1. Placer les couloirs (1 cube par position du path)
    this.organicPath.forEach((tile, index) => {
      const key = `${tile.x},${tile.y}`;

      // Vérifier si cette position est un nœud
      const isNode = dungeon.decisions && dungeon.decisions.some((decision, idx) => {
        const nodeIndex = this.findNodePosition(idx);
        return nodeIndex === index;
      });

      // Vérifier si c'est une entrée de salle
      const isEntrance = tile.isEntrance === true;

      let cubeType, cubeColor;

      if (isNode) {
        cubeType = 'node_center';
        cubeColor = this.getNodeCenterColor(index, dungeon);
      } else if (isEntrance) {
        cubeType = 'room_entrance';
        // L'entrée fait partie de la salle → même couleur jaune
        const nextNodeName = this.getNextNodeName(index, dungeon);
        cubeColor = '#d4af37'; // Doré (même couleur que la salle)
      } else {
        cubeType = 'corridor';
        cubeColor = '#4a4852'; // Gris clair pour le couloir
      }

      this.grid.set(key, {
        type: cubeType,
        color: cubeColor,
        index: index,
        isPlayerPath: true, // Le joueur passe sur ce cube
        isEntrance: isEntrance // Transmettre le flag d'entrée pour le rendu
      });
    });

    // 2. Ajouter SOL DE SALLE autour des nœuds (7 cubes autour, PAS le centre ni l'entrée)
    if (dungeon.decisions && dungeon.decisions.length > 0) {
      dungeon.decisions.forEach((decision, idx) => {
        const nodeIndex = this.findNodePosition(idx);
        if (nodeIndex !== -1 && nodeIndex < this.organicPath.length) {
          const center = this.organicPath[nodeIndex];
          this.placeRoomFloor(center.x, center.y, decision.nodeName, nodeIndex);
        }
      });
    }

    // 3. Ajouter MURS autour des salles (couche externe 5x5)
    if (dungeon.decisions && dungeon.decisions.length > 0) {
      dungeon.decisions.forEach((decision, idx) => {
        const nodeIndex = this.findNodePosition(idx);
        if (nodeIndex !== -1 && nodeIndex < this.organicPath.length) {
          const center = this.organicPath[nodeIndex];
          this.placeRoomWalls(center.x, center.y, nodeIndex);
        }
      });
    }

    console.log(`✅ Grille générée: ${this.grid.size} cubes`);
  }

  /**
   * Trouve le nom du nœud suivant après un index donné
   */
  getNextNodeName(index, dungeon) {
    if (!dungeon.decisions) return null;

    for (let idx = 0; idx < dungeon.decisions.length; idx++) {
      const nodeIndex = this.findNodePosition(idx);
      if (nodeIndex > index) {
        return dungeon.decisions[idx].nodeName;
      }
    }
    return null;
  }

  /**
   * Trouve la position du Nième nœud
   */
  findNodePosition(nodeIndex) {
    // Position approximative des nœuds (ex: 8 et 18)
    const nodePositions = [8, 18];
    return nodePositions[nodeIndex] || -1;
  }

  /**
   * Place les 7 cubes du SOL DE SALLE autour du centre (même couleur que centre)
   * (PAS le centre, PAS l'entrée qui est déjà dans le path)
   */
  placeRoomFloor(centerX, centerY, nodeName, nodeIndex) {
    const floorColor = this.getNodeCenterColor(nodeIndex, { decisions: [{ nodeName }] });

    // Trouver la direction d'arrivée (depuis le cube d'ENTRÉE)
    let entranceDirection = null;
    if (nodeIndex > 0 && this.organicPath[nodeIndex - 1]) {
      const entrance = this.organicPath[nodeIndex - 1];
      const dx = centerX - entrance.x;
      const dy = centerY - entrance.y;
      entranceDirection = { dx, dy };
    }

    // Les 8 positions autour du centre (zone 3x3)
    const floorPositions = [
      { dx: -1, dy: -1 }, // NW
      { dx: 0, dy: -1 },  // N
      { dx: 1, dy: -1 },  // NE
      { dx: -1, dy: 0 },  // W
      // PAS (0, 0) = centre (joueur)
      { dx: 1, dy: 0 },   // E
      { dx: -1, dy: 1 },  // SW
      { dx: 0, dy: 1 },   // S
      { dx: 1, dy: 1 }    // SE
    ];

    floorPositions.forEach(({ dx, dy }) => {
      const x = centerX + dx;
      const y = centerY + dy;

      if (x >= 0 && x < this.gridSize && y >= 0 && y < this.gridSize) {
        const key = `${x},${y}`;

        // NE PAS placer si :
        // - Déjà occupé par un cube du path (couloir ou entrée)
        // - C'est la position de l'entrée (déjà dans le path)
        const isEntrancePos = entranceDirection &&
                             dx === -entranceDirection.dx &&
                             dy === -entranceDirection.dy;

        if (!this.grid.has(key) && !isEntrancePos) {
          this.grid.set(key, {
            type: 'room_floor',
            color: floorColor,
            nodeName: nodeName,
            isPlayerPath: false
          });
        }
      }
    });
  }

  /**
   * Place les MURS autour d'une salle (couche 5x5 autour de la zone 3x3)
   * SAUF là où l'entrée arrive
   */
  placeRoomWalls(centerX, centerY, nodeIndex) {
    const wallColor = '#1a1820'; // Gris très foncé (murs)

    // Trouver la direction d'arrivée (depuis le cube d'ENTRÉE)
    let entranceDirection = null;
    let entrancePos = null;
    if (nodeIndex > 0 && this.organicPath[nodeIndex - 1]) {
      const entrance = this.organicPath[nodeIndex - 1];
      entrancePos = { x: entrance.x, y: entrance.y };
      const dx = centerX - entrance.x;
      const dy = centerY - entrance.y;
      entranceDirection = { dx, dy };
    }

    // Contour 5x5 (tous les cubes à distance 2 du centre)
    for (let dx = -2; dx <= 2; dx++) {
      for (let dy = -2; dy <= 2; dy++) {
        // Ne placer que le BORD (distance Manhattan = 2 OU distance Chebyshev = 2)
        const isEdge = Math.abs(dx) === 2 || Math.abs(dy) === 2;

        if (isEdge) {
          const x = centerX + dx;
          const y = centerY + dy;

          if (x >= 0 && x < this.gridSize && y >= 0 && y < this.gridSize) {
            const key = `${x},${y}`;

            // Ne PAS placer un mur si :
            // 1. Déjà occupé (couloir, entrée, sol de salle, etc.)
            // 2. Adjacent à l'entrée (pour laisser passer)
            const isNearEntrance = entrancePos &&
                                  Math.abs(x - entrancePos.x) <= 1 &&
                                  Math.abs(y - entrancePos.y) <= 1;

            if (!this.grid.has(key) && !isNearEntrance) {
              this.grid.set(key, {
                type: 'room_wall',
                color: wallColor,
                isPlayerPath: false,
                heightMultiplier: 2 // Murs 2x plus hauts
              });
            }
          }
        }
      }
    }
  }

  /**
   * Couleur du cube d'ENTRÉE de la salle (gris clair, comme couloir)
   */
  getEntranceColor(nodeName) {
    return '#5a5862'; // Gris moyen clair (entre couloir et salle)
  }

  /**
   * Couleur du cube CENTRAL du nœud (où le joueur passe)
   */
  getNodeCenterColor(index, dungeon) {
    // Trouver le nœud correspondant
    let nodeName = null;
    if (dungeon.decisions) {
      dungeon.decisions.forEach((decision, idx) => {
        if (this.findNodePosition(idx) === index) {
          nodeName = decision.nodeName;
        }
      });
    }

    if (!nodeName) return '#d4af37'; // Doré par défaut

    // Couleur de la salle (jaune/doré)
    if (nodeName.includes('Carrefour')) return '#d4af37'; // Doré
    if (nodeName.includes('Jugement')) return '#c4a537'; // Doré légèrement différent
    return '#d4af37'; // Doré par défaut
  }


  // ═══════════════════════════════════════════════════════════════
  // RENDU PRINCIPAL
  // ═══════════════════════════════════════════════════════════════

  render(dungeon, player, nodes = []) {
    // Générer le donjon 2D si pas encore fait
    if (!this.pathGenerated && dungeon && dungeon.path) {
      this.dungeonLength = dungeon.path.length;

      // NOUVEAU SYSTÈME : Génération 2D puis conversion en cubes
      const result = this.generateDungeonGrid2D(this.dungeonLength);

      // Stocker le path pour le mouvement du joueur
      this.organicPath = result.path;

      // Convertir en cubes 3D
      this.convertGrid2DToCubes(result.grid, result.path, result.rooms);

      this.pathGenerated = true;

      console.log(`🎮 Donjon prêt : ${result.path.length} cases, ${result.rooms.length} salles`);
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

    // Layer 2 : Cubes (avec tri par profondeur)
    this.renderCubes();

    // Layer 2.5 : Porte d'entrée (DEBUG EMOJI)
    this.renderEntrance();

    // Layer 3 : Joueur
    this.renderPlayer(player, dungeon);

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
   * Rend tous les cubes de la grille
   * Tri par profondeur (painter's algorithm)
   */
  renderCubes() {
    // CULLING PAR DISTANCE : Ne dessiner que les cubes proches du joueur
    const RENDER_RADIUS = 15; // Réduit de 25 à 15 pour meilleures perfs
    
    // Position du joueur dans la grille
    let playerGridPos = null;
    const playerIndex = Math.floor(this.currentPlayerIndex || 0);
    
    if (this.organicPath && this.organicPath.length > 0) {
      const safeIndex = Math.min(playerIndex, this.organicPath.length - 1);
      playerGridPos = this.organicPath[safeIndex];
    }
    
    // CACHE: Ne recalculer que si le joueur a bougé
    if (this.cubeRenderCache && this.lastPlayerIndex === playerIndex) {
      // Utiliser le cache
      this.cubeRenderCache.forEach(({ x, y, data }) => {
        this.renderCube(x, y, data);
      });
      return;
    }
    
    // Recalculer la liste des cubes visibles
    const cubes = [];
    this.grid.forEach((data, key) => {
      const [x, y] = key.split(',').map(Number);
      
      // CULLING: Ne garder que si proche du joueur
      if (playerGridPos) {
        const distX = Math.abs(x - playerGridPos.x);
        const distY = Math.abs(y - playerGridPos.y);
        const dist = Math.max(distX, distY); // Distance Chebyshev
        
        if (dist > RENDER_RADIUS) {
          return; // Skip ce cube (trop loin)
        }
      }
      
      cubes.push({ x, y, data });
    });

    // Trier par profondeur ISO (y + x)
    cubes.sort((a, b) => {
      const depthA = a.y + a.x;
      const depthB = b.y + b.x;
      return depthA - depthB;
    });
    
    // Mettre en cache
    this.cubeRenderCache = cubes;
    this.lastPlayerIndex = playerIndex;

    // Rendre chaque cube visible
    cubes.forEach(({ x, y, data }) => {
      this.renderCube(x, y, data);
    });
  }

  /**
   * Rend un cube isométrique (3 faces) avec LOD
   */
  renderCube(cartX, cartY, data) {
    // LOD: Calcul distance au joueur
    const playerPos = this.organicPath[this.currentPlayerIndex];
    if (playerPos) {
      const dist = Math.abs(cartX - playerPos.x) + Math.abs(cartY - playerPos.y);
      
      // LOD Level 2 (très loin): Skip complètement
      if (dist > 8) return;
      
      // LOD Level 1 (loin): Cube plat simplifié
      if (dist > 15) {
        this.renderSimplifiedCube(cartX, cartY, data);
        return;
      }
    }
    
    // LOD Level 0 (proche): Cube complet
    // Calculer les 4 coins du losange au SOL (base du cube)
    const cornerNW = this.cartesianToIso(cartX, cartY);
    const cornerNE = this.cartesianToIso(cartX + 1, cartY);
    const cornerSE = this.cartesianToIso(cartX + 1, cartY + 1);
    const cornerSW = this.cartesianToIso(cartX, cartY + 1);

    // Convertir en screen coords
    const screenNW = this.worldToScreen(cornerNW.x, cornerNW.y);
    const screenNE = this.worldToScreen(cornerNE.x, cornerNE.y);
    const screenSE = this.worldToScreen(cornerSE.x, cornerSE.y);
    const screenSW = this.worldToScreen(cornerSW.x, cornerSW.y);

    // Hauteur du cube (peut être multipliée pour les murs)
    const heightMult = data.heightMultiplier || 1;
    const scale = this.config.scale || 1.0;
    const d = this.config.tileDepth * heightMult * scale;

    // Coins du DESSUS (même position mais élevés par -d)
    const topNW = { x: screenNW.x, y: screenNW.y - d };
    const topNE = { x: screenNE.x, y: screenNE.y - d };
    const topSE = { x: screenSE.x, y: screenSE.y - d };
    const topSW = { x: screenSW.x, y: screenSW.y - d };

    this.ctx.save();

    // FACE SUD (côté bas : de SW à SE) - Plus sombre avec texture
    const colorSouth = this.darkenColor(data.color, 0.75);
    this.ctx.fillStyle = colorSouth;
    this.ctx.beginPath();
    this.ctx.moveTo(topSW.x, topSW.y);      // Coin gauche du dessus
    this.ctx.lineTo(topSE.x, topSE.y);      // Coin droite du dessus
    this.ctx.lineTo(screenSE.x, screenSE.y); // Coin bas-droite du sol
    this.ctx.lineTo(screenSW.x, screenSW.y); // Coin bas-gauche du sol
    this.ctx.closePath();
    this.ctx.fill();

    // Texture de briques sur face sud (DÉSACTIVÉE - ne suit pas l'isométrie)
    // this.ctx.save();
    // this.ctx.clip();
    // this.ctx.globalAlpha = 0.2;
    // const brickSeed = (cartX * 777 + cartY * 333);
    // for (let i = 0; i < 2; i++) {
    //   const r = ((brickSeed + i * 111) % 1000) / 1000;
    //   const y = topSW.y + (screenSW.y - topSW.y) * (i / 2);
    //   this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    //   this.ctx.lineWidth = 1;
    //   this.ctx.beginPath();
    //   this.ctx.moveTo(topSW.x, y);
    //   this.ctx.lineTo(topSE.x, y);
    //   this.ctx.stroke();
    // }
    // this.ctx.globalAlpha = 1;
    // this.ctx.restore();

    // this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
    // this.ctx.lineWidth = 1;
    // this.ctx.stroke();

    // FACE EST (côté droit : de SE à NE) - Moyennement sombre avec texture
    const colorEast = this.darkenColor(data.color, 0.85);
    this.ctx.fillStyle = colorEast;
    this.ctx.beginPath();
    this.ctx.moveTo(topSE.x, topSE.y);      // Coin bas du dessus
    this.ctx.lineTo(topNE.x, topNE.y);      // Coin haut du dessus
    this.ctx.lineTo(screenNE.x, screenNE.y); // Coin haut du sol
    this.ctx.lineTo(screenSE.x, screenSE.y); // Coin bas du sol
    this.ctx.closePath();
    this.ctx.fill();

    // Texture de briques sur face est (DÉSACTIVÉE - ne suit pas l'isométrie)
    // this.ctx.save();
    // this.ctx.clip();
    // this.ctx.globalAlpha = 0.2;
    // for (let i = 0; i < 2; i++) {
    //   const y = topSE.y + (screenSE.y - topSE.y) * (i / 2);
    //   this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    //   this.ctx.lineWidth = 1;
    //   this.ctx.beginPath();
    //   this.ctx.moveTo(topSE.x, y);
    //   this.ctx.lineTo(topNE.x, y + (screenNE.y - topNE.y) * (i / 2));
    //   this.ctx.stroke();
    // }
    // this.ctx.globalAlpha = 1;
    // this.ctx.restore();

    // this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
    // this.ctx.lineWidth = 1;
    // this.ctx.stroke();

    // FACE TOP (dessus) - Couleur normale avec texture
    this.ctx.fillStyle = data.color;
    this.ctx.beginPath();
    this.ctx.moveTo(topNW.x, topNW.y);
    this.ctx.lineTo(topNE.x, topNE.y);
    this.ctx.lineTo(topSE.x, topSE.y);
    this.ctx.lineTo(topSW.x, topSW.y);
    this.ctx.closePath();
    this.ctx.fill();

    // Texture procédurale (pierres/cracks) - DÉSACTIVÉE
    // if (data.type !== 'entrance') {
    //   this.ctx.save();
    //   this.ctx.clip();
    //   this.ctx.globalAlpha = 0.15;
    //   
    //   // Lignes aléatoires (cracks)
    //   const seed = (cartX * 1000 + cartY);
    //   for (let i = 0; i < 3; i++) {
    //     const r1 = ((seed + i * 123) % 1000) / 1000;
    //     const r2 = ((seed + i * 456) % 1000) / 1000;
    //     const r3 = ((seed + i * 789) % 1000) / 1000;
    //     
    //     const x1 = topNW.x + (topNE.x - topNW.x) * r1;
    //     const y1 = topNW.y + (topSW.y - topNW.y) * r2;
    //     const x2 = x1 + (r3 - 0.5) * 20;
    //     const y2 = y1 + (r3 - 0.5) * 10;
    //     
    //     this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    //     this.ctx.lineWidth = 1 + r1;
    //     this.ctx.beginPath();
    //     this.ctx.moveTo(x1, y1);
    //     this.ctx.lineTo(x2, y2);
    //     this.ctx.stroke();
    //   }
    //   
    //   this.ctx.globalAlpha = 1;
    //   this.ctx.restore();
    // }

    // Bordure (DÉSACTIVÉE)
    // this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    // this.ctx.lineWidth = 1;
    // this.ctx.stroke();

    // === EFFET SPÉCIAL POUR L'ENTRÉE (Porte Lugubre) - DÉSACTIVÉ POUR PERFS ===
    // if (data.isEntrance) {
    //   const centerX = (topNW.x + topNE.x + topSE.x + topSW.x) / 4;
    //   const centerY = (topNW.y + topNE.y + topSE.y + topSW.y) / 4;
    //   
    //   // Aura simple sans gradient (plus rapide)
    //   const time = Date.now() / 1000;
    //   const pulse = 0.3 + Math.sin(time * 1.5) * 0.2;
    //   
    //   this.ctx.fillStyle = `rgba(139, 0, 0, ${pulse})`;
    //   this.ctx.beginPath();
    //   this.ctx.arc(centerX, centerY, this.config.tileWidth * 0.8, 0, Math.PI * 2);
    //   this.ctx.fill();
    // }

    // === PORTE D'ENTRÉE DÉSACTIVÉE POUR PERFS ===
    // if (data.isEntrance) {
    //   // Porte en pierre (rectangle vertical)
    //   const doorWidth = 30;
    //   const doorHeight = 50;
    //   
    //   // Cadre de porte en pierre sombre
    //   this.ctx.fillStyle = '#2a2a2a';
    //   this.ctx.fillRect(
    //     centerX - doorWidth/2 - 3,
    //     centerY - doorHeight/2 - 3,
    //     doorWidth + 6,
    //     doorHeight + 6
    //   );
    //   
    //   // Porte elle-même (bois sombre/fer)
    //   const doorGrad = this.ctx.createLinearGradient(
    //     centerX - doorWidth/2, centerY - doorHeight/2,
    //     centerX + doorWidth/2, centerY + doorHeight/2
    //   );
    //   doorGrad.addColorStop(0, '#1a1a1a');
    //   doorGrad.addColorStop(0.5, '#0f0f0f');
    //   doorGrad.addColorStop(1, '#1a1a1a');
    //   
    //   this.ctx.fillStyle = doorGrad;
    //   this.ctx.fillRect(
    //     centerX - doorWidth/2,
    //     centerY - doorHeight/2,
    //     doorWidth,
    //     doorHeight
    //   );
    //   
    //   // Planches horizontales (effet bois)
    //   this.ctx.strokeStyle = 'rgba(80, 50, 30, 0.6)';
    //   this.ctx.lineWidth = 2;
    //   for (let i = 0; i < 3; i++) {
    //     const y = centerY - doorHeight/2 + (doorHeight / 3) * (i + 0.5);
    //     this.ctx.beginPath();
    //     this.ctx.moveTo(centerX - doorWidth/2 + 3, y);
    //     this.ctx.lineTo(centerX + doorWidth/2 - 3, y);
    //     this.ctx.stroke();
    //   }
    //   
    //   // Poignée/Anneau de fer
    //   this.ctx.strokeStyle = '#666';
    //   this.ctx.lineWidth = 3;
    //   this.ctx.beginPath();
    //   this.ctx.arc(centerX, centerY + 5, 5, 0, Math.PI * 2);
    //   this.ctx.stroke();
    //   
    //   // Lueur rouge dans les fissures (effet maléfique)
    //   this.ctx.fillStyle = `rgba(200, 0, 0, ${0.4 + pulse * 0.3})`;
    //   this.ctx.fillRect(centerX - 1, centerY - doorHeight/2, 2, doorHeight);
    //   
    //   // Symbole lugubre au-dessus
    //   this.ctx.fillStyle = `rgba(139, 0, 0, ${0.7 + pulse * 0.3})`;
    //   this.ctx.font = 'bold 20px Arial';
    //   this.ctx.textAlign = 'center';
    //   this.ctx.textBaseline = 'middle';
    //   this.ctx.fillText('☠', centerX, centerY - doorHeight/2 - 15);
    //   
    //   // Brume au sol
    //   const mistGrad = this.ctx.createRadialGradient(
    //     centerX, centerY + doorHeight/2, 0,
    //     centerX, centerY + doorHeight/2, 40
    //   );
    //   mistGrad.addColorStop(0, `rgba(60, 60, 80, ${0.4 * pulse})`);
    //   mistGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    //   
    //   this.ctx.fillStyle = mistGrad;
    //   this.ctx.beginPath();
    //   this.ctx.ellipse(centerX, centerY + doorHeight/2 + 5, 40, 15, 0, 0, Math.PI * 2);
    //   this.ctx.fill();
    // }

    this.ctx.restore();
  }

  /**
   * Rendu LOD simplifié pour cubes lointains (juste le losange du dessus)
   */
  renderSimplifiedCube(cartX, cartY, data) {
    const cornerNW = this.cartesianToIso(cartX, cartY);
    const cornerNE = this.cartesianToIso(cartX + 1, cartY);
    const cornerSE = this.cartesianToIso(cartX + 1, cartY + 1);
    const cornerSW = this.cartesianToIso(cartX, cartY + 1);
    
    const screenNW = this.worldToScreen(cornerNW.x, cornerNW.y);
    const screenNE = this.worldToScreen(cornerNE.x, cornerNE.y);
    const screenSE = this.worldToScreen(cornerSE.x, cornerSE.y);
    const screenSW = this.worldToScreen(cornerSW.x, cornerSW.y);
    
    const heightMult = data.heightMultiplier || 1;
    const d = this.config.tileDepth * heightMult;
    
    const topNW = { x: screenNW.x, y: screenNW.y - d };
    const topNE = { x: screenNE.x, y: screenNE.y - d };
    const topSE = { x: screenSE.x, y: screenSE.y - d };
    const topSW = { x: screenSW.x, y: screenSW.y - d };
    
    // Dessiner uniquement le losange du dessus (pas de faces latérales)
    this.ctx.fillStyle = data.color;
    this.ctx.beginPath();
    this.ctx.moveTo(topNW.x, topNW.y);
    this.ctx.lineTo(topNE.x, topNE.y);
    this.ctx.lineTo(topSE.x, topSE.y);
    this.ctx.lineTo(topSW.x, topSW.y);
    this.ctx.closePath();
    this.ctx.fill();
  }

  /**
   * Assombrit une couleur hex
   */
  darkenColor(hex, factor) {
    // Convertir hex → RGB
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    // Appliquer facteur
    const newR = Math.floor(r * factor);
    const newG = Math.floor(g * factor);
    const newB = Math.floor(b * factor);

    // Reconvertir → hex
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }

  // ═══════════════════════════════════════════════════════════════
  // ENTITÉS
  // ═══════════════════════════════════════════════════════════════

  renderEntrance() {
    // Dessiner la porte d'entrée à la première case du chemin
    if (!this.organicPath || this.organicPath.length === 0) return;
    
    const firstTile = this.organicPath[0];
    const iso = this.cartesianToIso(firstTile.x, firstTile.y);
    const screen = this.worldToScreen(iso.x, iso.y);
    
    // Position au-dessus du cube
    const screenX = screen.x;
    const screenY = screen.y - 80;
    
    this.ctx.save();
    
    // Arc en pierre au-dessus
    this.ctx.fillStyle = '#2a2a2a';
    this.ctx.beginPath();
    this.ctx.arc(screenX, screenY - 40, 50, 0, Math.PI, true);
    this.ctx.fill();
    
    // Porte en bois sombre
    this.ctx.fillStyle = '#3a2a1a';
    this.ctx.fillRect(screenX - 40, screenY - 40, 80, 100);
    
    // Cadre métallique rouillé
    this.ctx.strokeStyle = '#4a3a2a';
    this.ctx.lineWidth = 4;
    this.ctx.strokeRect(screenX - 40, screenY - 40, 80, 100);
    
    // Poignée
    this.ctx.fillStyle = '#6a4a2a';
    this.ctx.beginPath();
    this.ctx.arc(screenX, screenY + 10, 10, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Texte
    const scale = this.config.scale || 1.0;
    const fontSize = Math.round(18 * scale);
    this.ctx.font = `bold ${fontSize}px Cinzel`;
    this.ctx.fillStyle = '#8a6a4a';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('ENTRÉE', screenX, screenY - 70 * scale);
    
    this.ctx.restore();
  }

  renderPlayer(player, dungeon) {
    if (!player || player.position >= this.organicPath.length) return;

    const cart = this.organicPath[player.position];
    // Centrer le joueur sur la face supérieure du cube (au lieu du coin NW)
    const iso = this.cartesianToIso(cart.x + 0.5, cart.y + 0.5);
    const screen = this.worldToScreen(iso.x, iso.y);

    // Élévation au-dessus du cube
    const scale = this.config.scale || 1.0;
    const elevation = (this.config.tileDepth + 20) * scale;

    this.ctx.save();

    // Aura dorée
    const auraRadius = 30 * scale;
    const aura = this.ctx.createRadialGradient(
      screen.x, screen.y - elevation, 0,
      screen.x, screen.y - elevation, auraRadius
    );
    aura.addColorStop(0, 'rgba(212, 175, 55, 0.4)');
    aura.addColorStop(1, 'rgba(212, 175, 55, 0)');

    this.ctx.fillStyle = aura;
    this.ctx.beginPath();
    this.ctx.arc(screen.x, screen.y - elevation, auraRadius, 0, Math.PI * 2);
    this.ctx.fill();

    // Icône joueur
    const fontSize = Math.round(32 * scale);
    this.ctx.font = `bold ${fontSize}px serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = '#d4af37';
    this.ctx.fillText(player.icon || '🧙', screen.x, screen.y - elevation);

    // Ombre sous le joueur
    const shadowRadius = 15 * scale;
    const shadowHeight = 8 * scale;
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    this.ctx.beginPath();
    this.ctx.ellipse(screen.x, screen.y - this.config.tileDepth * scale + 5, shadowRadius, shadowHeight, 0, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  // ═══════════════════════════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════════════════════════

  indexToIso(index) {
    if (this.organicPath && index < this.organicPath.length) {
      const cart = this.organicPath[index];
      return this.cartesianToIso(cart.x, cart.y);
    }
    return { x: 0, y: 0 };
  }
}

// Exposer globalement (pour compatibilité avec game-test.js)
window.IsometricRenderer = IsometricRendererCubes;
