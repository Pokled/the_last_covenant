// 🏰 GÉNÉRATEUR DE DONJON - VERSION EXPERTE AVEC PLANIFICATION
// Système intelligent qui évite les blocages en planifiant à l'avance

class DungeonGenerator {
  static generate() {
    console.log('🏰 Génération du donjon (version experte avec planification)...');
    
    const grid = Array.from({ length: CONFIG.GRID_HEIGHT }, () => 
      Array(CONFIG.GRID_WIDTH).fill(0)
    );
    
    const path = [];
    const rooms = [];
    
    // Configuration
    const TARGET_LENGTH = CONFIG.PATH_LENGTH;
    const margin = 10;
    const ROOM_INTERVAL_MIN = 20;
    const ROOM_INTERVAL_MAX = 35;
    const ROOM_SIZE = 3;
    
    // Position de départ (centre)
    let x = Math.floor(CONFIG.GRID_WIDTH / 2);
    let y = Math.floor(CONFIG.GRID_HEIGHT / 2);
    
    // Directions : 0=Est, 1=Sud, 2=Ouest, 3=Nord
    const directions = [
      { x: 1, y: 0 },   // Est
      { x: 0, y: 1 },   // Sud
      { x: -1, y: 0 },  // Ouest
      { x: 0, y: -1 }   // Nord
    ];
    
    // Direction initiale aléatoire
    let currentDir = Math.floor(Math.random() * 4);
    
    // Compteurs
    let pathIndex = 0;
    let stepsInCurrentDirection = 0;
    let stepsSinceLastRoom = ROOM_INTERVAL_MIN;
    const minStepsBeforeTurn = 3;
    const maxStepsBeforeTurn = 12;
    
    // === SYSTÈME DE MÉMOIRE ET PLANIFICATION ===
    const memory = {
      // Zones occupées (pour éviter les collisions)
      occupiedZones: new Set(),
      
      // Directions bloquées depuis chaque position
      blockedDirections: new Map(),
      
      // Historique des directions récentes (pour éviter les allers-retours)
      recentDirections: [],
      
      // Zones à éviter (trop proches des limites ou déjà occupées)
      forbiddenZones: new Set()
    };
    
    // Fonction pour marquer une zone comme occupée
    const markZone = (x, y, radius = 1) => {
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const key = `${x + dx},${y + dy}`;
          memory.occupiedZones.add(key);
        }
      }
    };
    
    // Fonction pour vérifier si une zone est occupée
    const isZoneOccupied = (x, y, radius = 1) => {
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const key = `${x + dx},${y + dy}`;
          if (memory.occupiedZones.has(key)) {
            return true;
          }
        }
      }
      return false;
    };
    
    // Fonction pour évaluer une direction (retourne un score)
    const evaluateDirection = (testX, testY, testDir, lookAhead = 5) => {
      let score = 100; // Score de base
      let minDistToEdge = Infinity; // Suivi de la distance mini aux bords
      const dirVec = directions[testDir];
      
      // Vérifier les cases à l'avance
      for (let i = 1; i <= lookAhead; i++) {
        const futureX = testX + dirVec.x * i;
        const futureY = testY + dirVec.y * i;
        
        // Pénalité si trop proche des limites
        const distToEdge = Math.min(
          futureX - margin,
          CONFIG.GRID_WIDTH - margin - futureX,
          futureY - margin,
          CONFIG.GRID_HEIGHT - margin - futureY
        );
        minDistToEdge = Math.min(minDistToEdge, distToEdge);
        
        if (distToEdge < 5) {
          score -= (5 - distToEdge) * 10; // Pénalité forte si trop proche
        }
        
        // Pénalité si zone déjà occupée
        if (isZoneOccupied(futureX, futureY)) {
          score -= 50;
        }
        
        // Vérifier si on peut placer une case ici
        if (futureX < margin || futureY < margin ||
            futureX >= CONFIG.GRID_WIDTH - margin ||
            futureY >= CONFIG.GRID_HEIGHT - margin) {
          score -= 100; // Bloqué par les limites
          break;
        }
        
        // Vérifier collision
        if (grid[futureY] && grid[futureY][futureX] !== 0) {
          score -= 100; // Collision
          break;
        }
        
        // Vérifier séparation stricte
        if (!this.canPlaceCorridorTile(grid, 
            i > 1 ? testX + dirVec.x * (i - 1) : testX,
            i > 1 ? testY + dirVec.y * (i - 1) : testY,
            testDir, margin, directions)) {
          score -= 30;
        }
      }
      
      // Bonus si direction permet de continuer longtemps
      if (minDistToEdge > 10 && minDistToEdge < Infinity) {
        score += 20;
      }
      
      // Pénalité si direction récente (éviter les allers-retours)
      if (memory.recentDirections.length > 0) {
        const oppositeDir = (testDir + 2) % 4;
        if (memory.recentDirections.includes(oppositeDir)) {
          score -= 30; // Éviter de revenir en arrière
        }
      }
      
      return score;
    };
    
    // === ÉTAPE 1 : ENTRÉE ===
    grid[y][x] = 1;
    markZone(x, y);
    path.push({ 
      x, 
      y, 
      type: 'entrance',
      index: pathIndex++,
      roomId: null
    });
    
    console.log(`📍 Entrée créée à (${x}, ${y})`);
    
    // === BOUCLE PRINCIPALE : CRÉER LE CHEMIN SINUEUX ===
    let attempts = 0;
    const maxAttempts = TARGET_LENGTH * 100; // Encore plus de tentatives
    let stuckCount = 0;
    let lastSuccessfulDir = currentDir;
    
    while (pathIndex < TARGET_LENGTH && attempts < maxAttempts) {
      attempts++;
      
      // === DÉCISION : CRÉER UNE SALLE ? ===
      // IMPORTANT : Ne jamais créer de salle trop près du début ou de la fin
      // (pour éviter que l'entrée ou la sortie soient dans une salle)
      const shouldCreateRoom = (
        pathIndex > 10 && // Au moins 10 cases après l'entrée
        pathIndex < TARGET_LENGTH - 15 && // Au moins 15 cases avant la fin
        stepsSinceLastRoom >= ROOM_INTERVAL_MIN &&
        (stepsSinceLastRoom >= ROOM_INTERVAL_MAX || Math.random() < 0.3)
      );
      
      if (shouldCreateRoom) {
        // Vérifier si on peut créer une salle dans cette direction
        const roomResult = this.createRoom3x3(
          grid, path, x, y, currentDir, margin, pathIndex, directions, rooms.length
        );
        
        if (roomResult.success) {
          // Vérifier que la sortie de la salle permet de continuer
          const exitScore = evaluateDirection(
            roomResult.exitX, 
            roomResult.exitY, 
            roomResult.exitDir,
            8 // Regarder plus loin pour une salle
          );
          
          if (exitScore > 0) {
            // Salle créée avec succès
            pathIndex = roomResult.newPathIndex;
            x = roomResult.exitX;
            y = roomResult.exitY;
            currentDir = roomResult.exitDir;
            stepsSinceLastRoom = 0;
            stuckCount = 0;
            
            // Marquer la zone de la salle comme occupée
            markZone(x, y, 2);
            
            rooms.push(roomResult.room);
            console.log(`🏛️ Salle créée à (${roomResult.room.x}, ${roomResult.room.y})`);
            
            // Mettre à jour la mémoire
            memory.recentDirections.push(currentDir);
            if (memory.recentDirections.length > 5) {
              memory.recentDirections.shift();
            }
            
            continue;
          } else {
            console.log(`⚠️ Sortie de salle bloquée, passage en couloir`);
          }
        }
      }
      
      // === CRÉER UN COULOIR ===
      // Décider si on doit tourner
      const shouldTurn = (
        stepsInCurrentDirection >= minStepsBeforeTurn &&
        (stepsInCurrentDirection >= maxStepsBeforeTurn || Math.random() < 0.25)
      );
      
      if (shouldTurn || stuckCount > 0) {
        // Évaluer toutes les directions possibles
        const oppositeDir = (currentDir + 2) % 4;
        const possibleDirs = [0, 1, 2, 3].filter(d => d !== oppositeDir);
        
        // Évaluer chaque direction
        const dirScores = possibleDirs.map(dir => ({
          dir,
          score: evaluateDirection(x, y, dir, 8)
        }));
        
        // Trier par score (meilleur en premier)
        dirScores.sort((a, b) => b.score - a.score);
        
        // Essayer la meilleure direction
        let foundValidDir = false;
        for (const dirScore of dirScores) {
          if (dirScore.score > 0 && 
              this.canPlaceCorridorTile(grid, x, y, dirScore.dir, margin, directions)) {
            currentDir = dirScore.dir;
            stepsInCurrentDirection = 0;
            foundValidDir = true;
            lastSuccessfulDir = currentDir;
            break;
          }
        }
        
        // Si aucune direction valide avec score positif
        if (!foundValidDir) {
          // Essayer quand même les directions avec score > -50
          for (const dirScore of dirScores) {
            if (dirScore.score > -50 && 
                this.canPlaceCorridorTile(grid, x, y, dirScore.dir, margin, directions)) {
              currentDir = dirScore.dir;
              stepsInCurrentDirection = 0;
              foundValidDir = true;
              lastSuccessfulDir = currentDir;
              break;
            }
          }
        }
        
        if (!foundValidDir) {
          // Dernière tentative : continuer dans la même direction si possible
          if (this.canPlaceCorridorTile(grid, x, y, currentDir, margin, directions)) {
            stepsInCurrentDirection = 0;
          } else {
            // Chercher n'importe quelle direction valide
            console.log(`⚠️ Bloqué à (${x}, ${y}), recherche urgente d'une sortie...`);
            
            let foundExit = false;
            for (const testDir of [0, 1, 2, 3]) {
              if (this.canPlaceCorridorTile(grid, x, y, testDir, margin, directions)) {
                currentDir = testDir;
                stepsInCurrentDirection = 0;
                foundExit = true;
                lastSuccessfulDir = currentDir;
                break;
              }
            }
            
            if (!foundExit) {
              stuckCount++;
              if (stuckCount > 15) {
                console.log(`⚠️ Bloqué ${stuckCount} fois, arrêt à ${pathIndex} cases`);
                break;
              }
              
              // Réduire temporairement la marge
              const tempMargin = Math.max(5, margin - 3);
              for (const testDir of [0, 1, 2, 3]) {
                if (this.canPlaceCorridorTile(grid, x, y, testDir, tempMargin, directions)) {
                  currentDir = testDir;
                  stepsInCurrentDirection = 0;
                  foundExit = true;
                  stuckCount = Math.max(0, stuckCount - 2);
                  lastSuccessfulDir = currentDir;
                  break;
                }
              }
              
              if (!foundExit) {
                console.log(`⚠️ Aucune direction valide trouvée, arrêt à ${pathIndex} cases`);
                break;
              }
            } else {
              stuckCount = Math.max(0, stuckCount - 1);
            }
          }
        } else {
          stuckCount = 0;
        }
      }
      
      // Avancer d'une case dans la direction actuelle
      const dirVec = directions[currentDir];
      const nx = x + dirVec.x;
      const ny = y + dirVec.y;
      
      // Vérifier si on peut placer cette case
      if (!this.canPlaceCorridorTile(grid, x, y, currentDir, margin, directions)) {
        // Changement de direction forcé
        stuckCount++;
        const oppositeDir = (currentDir + 2) % 4;
        const possibleDirs = [0, 1, 2, 3].filter(d => d !== oppositeDir);
        
        // Évaluer les directions
        const dirScores = possibleDirs.map(dir => ({
          dir,
          score: evaluateDirection(x, y, dir, 8)
        }));
        dirScores.sort((a, b) => b.score - a.score);
        
        let foundNewDir = false;
        for (const dirScore of dirScores) {
          if (dirScore.score > 0 && 
              this.canPlaceCorridorTile(grid, x, y, dirScore.dir, margin, directions)) {
            currentDir = dirScore.dir;
            stepsInCurrentDirection = 0;
            foundNewDir = true;
            lastSuccessfulDir = currentDir;
            break;
          }
        }
        
        if (!foundNewDir && stuckCount < 10) {
          // Essayer avec score > -50
          for (const dirScore of dirScores) {
            if (dirScore.score > -50 && 
                this.canPlaceCorridorTile(grid, x, y, dirScore.dir, margin, directions)) {
              currentDir = dirScore.dir;
              stepsInCurrentDirection = 0;
              foundNewDir = true;
              lastSuccessfulDir = currentDir;
              break;
            }
          }
        }
        
        if (!foundNewDir) {
          stuckCount++;
          if (stuckCount > 15) {
            console.log(`⚠️ Bloqué ${stuckCount} fois, arrêt à ${pathIndex} cases`);
            break;
          }
          
          const tempMargin = Math.max(5, margin - 3);
          for (const testDir of [0, 1, 2, 3]) {
            if (this.canPlaceCorridorTile(grid, x, y, testDir, tempMargin, directions)) {
              currentDir = testDir;
              stepsInCurrentDirection = 0;
              foundNewDir = true;
              stuckCount = Math.max(0, stuckCount - 2);
              lastSuccessfulDir = currentDir;
              break;
            }
          }
          
          if (!foundNewDir) {
            console.log(`⚠️ Impossible de continuer, arrêt à ${pathIndex} cases`);
            break;
          }
        } else {
          stuckCount = Math.max(0, stuckCount - 1);
        }
        continue;
      }
      
      // Ajouter la case au chemin
      grid[ny][nx] = 1;
      markZone(nx, ny);

      // 🎲 Affecter aléatoirement un petit événement sur la case (couloir)
      // Priorité aux petits combats pour rendre les couloirs plus dangereux
      const r = Math.random();
      let tileType = 'corridor';
      if (r < 0.18) tileType = 'combat';          // 18% petites rencontres
      else if (r < 0.24) tileType = 'trap';       // 6% pièges
      else if (r < 0.29) tileType = 'chest';      // 5% coffres
      else if (r < 0.32) tileType = 'move_back';  // 3% recule de 2 cases
      else if (r < 0.34) tileType = 'merchant';   // 2% marchand

      path.push({
        x: nx,
        y: ny,
        type: tileType,
        index: pathIndex++,
        roomId: null
      });
      
      x = nx;
      y = ny;
      stepsInCurrentDirection++;
      stepsSinceLastRoom++;
      stuckCount = 0;
      
      // Mettre à jour la mémoire
      memory.recentDirections.push(currentDir);
      if (memory.recentDirections.length > 5) {
        memory.recentDirections.shift();
      }
    }
    
    // === ÉTAPE FINALE : SORTIE ===
    // IMPORTANT : La sortie doit être dans un couloir, pas dans une salle
    // Ajouter quelques cases supplémentaires pour garantir que la sortie soit dans un couloir
    if (path.length > 0) {
      const lastTile = path[path.length - 1];
      
      // S'assurer que la dernière case n'est pas dans une salle
      if (lastTile.roomId) {
        // Si la dernière case est dans une salle, ajouter un couloir après
        console.log(`⚠️ Dernière case dans une salle, ajout d'un couloir après...`);
      }
      
      // Essayer d'ajouter quelques cases supplémentaires
      const dirVec = directions[currentDir];
      let extraTiles = 0;
      const maxExtra = 5; // Plus de cases pour garantir un couloir
      
      for (let i = 0; i < maxExtra && pathIndex < TARGET_LENGTH + maxExtra; i++) {
        const nx = x + dirVec.x;
        const ny = y + dirVec.y;
        
        if (nx >= margin && ny >= margin &&
            nx < CONFIG.GRID_WIDTH - margin &&
            ny < CONFIG.GRID_HEIGHT - margin &&
            grid[ny][nx] === 0 &&
            this.canPlaceCorridorTile(grid, x, y, currentDir, margin, directions)) {
          
          grid[ny][nx] = 1;
          markZone(nx, ny);
          path.push({
            x: nx,
            y: ny,
            type: 'corridor', // Toujours un couloir
            index: pathIndex++,
            roomId: null // Pas de salle
          });
          
          x = nx;
          y = ny;
          extraTiles++;
        } else {
          break;
        }
      }
      
      // La dernière case devient la sortie (garantie d'être dans un couloir)
      const exitTile = path[path.length - 1];
      exitTile.type = 'exit';
      exitTile.roomId = null; // Forcer à null pour être sûr
      console.log(`🏆 Sortie créée à (${exitTile.x}, ${exitTile.y}) avec ${extraTiles} cases supplémentaires (couloir)`);
    }
    
    // === CRÉER LES MURS ===
    this.createWalls(grid, path, rooms);
    
    console.log(`✅ Donjon généré : ${path.length} cases, ${rooms.length} salles`);
    console.log(`📊 Efficacité : ${Math.round((path.length / TARGET_LENGTH) * 100)}% de l'objectif`);

    // ✅ FIX: Nettoyer les roomId orphelins (tiles avec roomId mais pas de room correspondante)
    const validRoomIds = new Set(rooms.map(r => r.id));
    let orphansFixed = 0;

    path.forEach(tile => {
      if (tile.roomId && !validRoomIds.has(tile.roomId)) {
        console.warn(`⚠️ Room orpheline détectée: ${tile.roomId} à la position ${tile.index}`);

        // Convertir en corridor normal
        tile.type = 'corridor';
        delete tile.roomId;
        delete tile.roomType;
        delete tile.roomDifficulty;

        orphansFixed++;
      }
    });

    if (orphansFixed > 0) {
      console.log(`🔧 ${orphansFixed} tile(s) orpheline(s) corrigée(s)`);
    }

    return {
      grid,
      path,
      rooms,
      totalLength: path.length
    };
  }
  
  // === CRÉER UNE SALLE 3x3 ===
  static createRoom3x3(grid, path, startX, startY, entryDir, margin, pathIndex, directions, roomNumber) {
    const ROOM_SIZE = 3;
    const entryVec = directions[entryDir];
    
    // Calculer la position de la salle selon la direction d'entrée
    let roomStartX, roomStartY;
    let entryX, entryY;
    let exitX, exitY;
    let exitDir;
    
    if (entryDir === 0) { // Est
      roomStartX = startX;
      roomStartY = startY - Math.floor(ROOM_SIZE / 2);
      entryX = startX;
      entryY = startY;
      exitX = startX + ROOM_SIZE - 1;
      exitY = startY;
      exitDir = 0;
    } else if (entryDir === 1) { // Sud
      roomStartX = startX - Math.floor(ROOM_SIZE / 2);
      roomStartY = startY;
      entryX = startX;
      entryY = startY;
      exitX = startX;
      exitY = startY + ROOM_SIZE - 1;
      exitDir = 1;
    } else if (entryDir === 2) { // Ouest
      roomStartX = startX - ROOM_SIZE + 1;
      roomStartY = startY - Math.floor(ROOM_SIZE / 2);
      entryX = startX;
      entryY = startY;
      exitX = startX - ROOM_SIZE + 1;
      exitY = startY;
      exitDir = 2;
    } else { // Nord
      roomStartX = startX - Math.floor(ROOM_SIZE / 2);
      roomStartY = startY - ROOM_SIZE + 1;
      entryX = startX;
      entryY = startY;
      exitX = startX;
      exitY = startY - ROOM_SIZE + 1;
      exitDir = 3;
    }
    
    // Vérifier que la salle peut être placée
    if (roomStartX < margin || roomStartY < margin ||
        roomStartX + ROOM_SIZE >= CONFIG.GRID_WIDTH - margin ||
        roomStartY + ROOM_SIZE >= CONFIG.GRID_HEIGHT - margin) {
      return { success: false };
    }
    
    // Vérifier que toutes les cases de la salle sont libres
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
              sideX < CONFIG.GRID_WIDTH && sideY < CONFIG.GRID_HEIGHT) {
            if (grid[sideY][sideX] === 1) {
              return { success: false };
            }
          }
        }
      }
    }
    
    // === CRÉER LA SALLE ===
    const roomId = `room_${roomNumber}`;
    const centerX = Math.floor((entryX + exitX) / 2);
    const centerY = Math.floor((entryY + exitY) / 2);
    
    const rand = Math.random();
    let roomType;
    if (rand < 0.3) roomType = 'combat';
    else if (rand < 0.5) roomType = 'treasure';
    else if (rand < 0.65) roomType = 'merchant';
    else if (rand < 0.8) roomType = 'puzzle';
    else roomType = 'rest';

    // Déterminer une difficulté pour les salles de combat (rare : mini-boss / boss)
    let roomDifficulty = 'normal';
    if (roomType === 'combat') {
      const d = Math.random();
      if (d < 0.06) roomDifficulty = 'boss';      // ~6% des salles de combat
      else if (d < 0.22) roomDifficulty = 'mini'; // ~16% des salles de combat
    }
    
    roomTiles.forEach(tile => {
      grid[tile.y][tile.x] = 1;
    });
    
    const roomPath = [];
    roomPath.push({ x: entryX, y: entryY });
    
    if (centerX !== entryX || centerY !== entryY) {
      roomPath.push({ x: centerX, y: centerY });
    }
    
    if (exitX !== centerX || exitY !== centerY) {
      roomPath.push({ x: exitX, y: exitY });
    }
    
    let roomPathIndex = 0;
    roomPath.forEach((tile, idx) => {
      if (idx === 0 && path.length > 0) {
        const lastTile = path[path.length - 1];
        if (lastTile.x === tile.x && lastTile.y === tile.y) {
          lastTile.type = 'room_entry';
          lastTile.roomId = roomId;
          lastTile.roomType = roomType;
          return;
        }
      }
      
      path.push({
        x: tile.x,
        y: tile.y,
        type: idx === 0 ? 'room_entry' : (idx === roomPath.length - 1 ? 'room_exit' : 'room'),
        index: pathIndex + roomPathIndex,
        roomId: roomId,
        roomType: roomType,
        roomDifficulty: roomDifficulty
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
      path: roomPath,
      type: roomType,
      difficulty: roomDifficulty
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
  
  // === VÉRIFIER SI ON PEUT PLACER UNE CASE DE COULOIR ===
  static canPlaceCorridorTile(grid, currentX, currentY, dir, margin, directions) {
    const dirVec = directions[dir];
    const nx = currentX + dirVec.x;
    const ny = currentY + dirVec.y;
    
    if (nx < margin || ny < margin ||
        nx >= CONFIG.GRID_WIDTH - margin ||
        ny >= CONFIG.GRID_HEIGHT - margin) {
      return false;
    }
    
    if (grid[ny][nx] !== 0) {
      return false;
    }
    
    const sideChecks = [
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 }
    ];
    
    for (const side of sideChecks) {
      const sideX = nx + side.x;
      const sideY = ny + side.y;
      
      if (sideX === currentX && sideY === currentY) continue;
      const nextX = nx + dirVec.x;
      const nextY = ny + dirVec.y;
      if (sideX === nextX && sideY === nextY) continue;
      
      if (sideX >= 0 && sideY >= 0 &&
          sideX < CONFIG.GRID_WIDTH && sideY < CONFIG.GRID_HEIGHT) {
        if (grid[sideY][sideX] === 1) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  // === CRÉER LES MURS ===
  static createWalls(grid, path, rooms) {
    const wallsSet = new Set();
    
    path.forEach(tile => {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          
          const nx = tile.x + dx;
          const ny = tile.y + dy;
          
          if (nx < 0 || ny < 0 || 
              nx >= CONFIG.GRID_WIDTH || 
              ny >= CONFIG.GRID_HEIGHT) {
            continue;
          }
          
          if (grid[ny][nx] === 0) {
            const key = `${nx},${ny}`;
            if (!wallsSet.has(key)) {
              grid[ny][nx] = 2;
              wallsSet.add(key);
            }
          }
        }
      }
    });
    
    if (rooms && rooms.length > 0) {
      rooms.forEach(room => {
        for (let ry = -1; ry <= room.height; ry++) {
          for (let rx = -1; rx <= room.width; rx++) {
            if (rx >= 0 && rx < room.width && ry >= 0 && ry < room.height) {
              continue;
            }
            
            const tx = room.x + rx;
            const ty = room.y + ry;
            
            if (tx < 0 || ty < 0 || 
                tx >= CONFIG.GRID_WIDTH || 
                ty >= CONFIG.GRID_HEIGHT) {
              continue;
            }
            
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
}

console.log('✅ Générateur de donjon chargé');
