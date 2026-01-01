/**
 * 🏰 GÉNÉRATEUR DE DONJON LINÉAIRE
 * THE LAST COVENANT
 * 
 * Algorithme de croissance linéaire avec système de mémoire anti-blocage
 * ENTRÉE → Couloir → Salle → Couloir → Salle → ... → SORTIE
 * 
 * RÈGLES STRICTES:
 * - Salles 3×3: Entrée/sortie toujours opposées (jamais adjacentes)
 * - Couloirs: Murs perpendiculaires uniquement (jamais devant/derrière)
 * - Mémoire complète: Pas de collision, pas de spirale, pas de blocage
 */

class LinearDungeonGenerator {
  constructor(gridSize = 150) {
    this.gridSize = gridSize;
    this.grid = null;
    this.occupiedCells = new Set(); // Mémoire complète des positions occupées
    this.path = [];
    this.rooms = [];
    this.corridors = [];
    this.destinyNodes = []; // Nœuds du Destin (Blood Pacts)
    
    // Historique des directions (anti-blocage)
    this.directionHistory = [];
    this.maxHistoryLength = 5;
    
    // Directions: 0=Est, 1=Sud, 2=Ouest, 3=Nord
    this.directions = [
      { x: 1, y: 0, name: 'E', opposite: 2 },
      { x: 0, y: 1, name: 'S', opposite: 3 },
      { x: -1, y: 0, name: 'W', opposite: 0 },
      { x: 0, y: -1, name: 'N', opposite: 1 }
    ];
    
    console.log('🏰 LinearDungeonGenerator initialisé (grille 150×150)');
  }
  
  // ═══════════════════════════════════════════════════════════════
  // GÉNÉRATION PRINCIPALE
  // ═══════════════════════════════════════════════════════════════
  
  /**
   * Génère un donjon complet avec système de CHUNKS + NŒUDS DE DESTIN
   * Structure: 4 salles → Nœud → 4 salles → Nœud → 4 salles → Sortie
   */
  generate(targetRooms = 12) {
    console.log(`🎲 Génération donjon par CHUNKS: ${targetRooms} salles cibles`);
    
    // Initialiser la grille
    this.grid = Array.from({ length: this.gridSize }, () =>
      Array(this.gridSize).fill(0)
    );
    
    this.occupiedCells.clear();
    this.path = [];
    this.rooms = [];
    this.corridors = [];
    this.destinyNodes = [];
    this.directionHistory = [];
    
    // Position de départ au centre de la grande grille
    const startX = Math.floor(this.gridSize / 2);
    const startY = Math.floor(this.gridSize / 2);
    
    this.placeEntrance(startX, startY);
    
    let currentX = startX;
    let currentY = startY;
    let currentDir = 0; // Commence vers l'Est
    
    // GÉNÉRATION PAR CHUNKS (réduit à 1 pour performance critique)
    const ROOMS_PER_CHUNK = 3; // Réduit de 4 à 3 salles
    const NUM_CHUNKS = 1; // 1 chunk = 3 salles + sortie (pas de nœud, focus perfs)
    let totalRoomsCreated = 0;
    
    for (let chunkIndex = 0; chunkIndex < NUM_CHUNKS; chunkIndex++) {
      console.log(`\n📦 CHUNK ${chunkIndex + 1}/${NUM_CHUNKS}`);
      
      // Générer les salles de ce chunk
      const result = this.generateChunk(
        currentX, 
        currentY, 
        currentDir, 
        ROOMS_PER_CHUNK, 
        chunkIndex
      );
      
      if (!result.success) {
        console.warn(`⚠️ Échec génération chunk ${chunkIndex + 1}, arrêt anticipé`);
        // Utiliser quand même la dernière position valide
        currentX = result.endX;
        currentY = result.endY;
        currentDir = result.endDir;
        break; // Arrêter la génération
      }
      
      totalRoomsCreated += result.roomsCreated;
      currentX = result.endX;
      currentY = result.endY;
      currentDir = result.endDir;
      
      // Placer un Nœud de Destin SAUF après le dernier chunk
      if (chunkIndex < NUM_CHUNKS - 1) {
        // IMPORTANT: Forcer 3 cubes droits AVANT le nœud pour préparer l'entrée
        console.log(`  🔧 Préparation nœud: forcer 3 cubes droits`);
        const prepareNode = this.forceStraightCorridor(currentX, currentY, currentDir, 3);
        
        if (prepareNode.success) {
          currentX = prepareNode.endX;
          currentY = prepareNode.endY;
          
          const nodeResult = this.placeDestinyNode(currentX, currentY, currentDir, chunkIndex);
          
          if (nodeResult.success) {
            currentX = nodeResult.exitX;
            currentY = nodeResult.exitY;
            currentDir = nodeResult.exitDir;
            console.log(`✅ Nœud de Destin ${chunkIndex + 1} placé`);
            
            // Forcer 3 cubes droits APRÈS le nœud aussi
            const afterNode = this.forceStraightCorridor(currentX, currentY, currentDir, 3);
            if (afterNode.success) {
              currentX = afterNode.endX;
              currentY = afterNode.endY;
            }
          } else {
            console.warn(`⚠️ Échec placement Nœud de Destin ${chunkIndex + 1}`);
          }
        } else {
          console.warn(`⚠️ Impossible de préparer l'espace pour le nœud ${chunkIndex + 1}`);
        }
      }
    }
    
    // Sortie finale
    this.placeExit(currentX, currentY);
    
    // Créer les murs
    this.createWalls();
    
    console.log(`\n✅ Donjon généré: ${this.rooms.length} salles, ${this.destinyNodes.length} nœuds, ${this.corridors.length} couloirs`);
    
    return {
      grid: this.grid,
      path: this.path,
      rooms: this.rooms,
      corridors: this.corridors,
      destinyNodes: this.destinyNodes,
      success: totalRoomsCreated >= targetRooms * 0.5 // 50% minimum
    };
  }
  
  /**
   * Génère un chunk (N salles consécutives)
   */
  generateChunk(startX, startY, startDir, targetRooms, chunkIndex) {
    let currentX = startX;
    let currentY = startY;
    let currentDir = startDir;
    
    let roomsCreated = 0;
    let maxFailures = 5;
    let consecutiveFailures = 0;
    
    while (roomsCreated < targetRooms && consecutiveFailures < maxFailures) {
      console.log(`  🔄 Salle ${roomsCreated + 1}/${targetRooms} du chunk`);
      
      // A. Générer un couloir
      const corridorResult = this.generateCorridor(currentX, currentY, currentDir);
      
      if (!corridorResult.success) {
        console.warn(`  ⚠️ Échec couloir`);
        consecutiveFailures++;
        currentDir = this.findValidDirection(currentX, currentY, currentDir);
        continue;
      }
      
      currentX = corridorResult.endX;
      currentY = corridorResult.endY;
      currentDir = corridorResult.endDir;
      
      // B. Placer une salle
      const roomResult = this.placeRoom(currentX, currentY, currentDir);
      
      if (!roomResult.success) {
        console.warn(`  ⚠️ Échec salle`);
        consecutiveFailures++;
        continue;
      }
      
      roomsCreated++;
      consecutiveFailures = 0;
      currentX = roomResult.exitX;
      currentY = roomResult.exitY;
      currentDir = roomResult.exitDir;
      
      console.log(`  ✅ Salle ${roomsCreated}/${targetRooms} créée`);
      
      // C. Forcer 3 cubes droits après salle
      const straightResult = this.forceStraightCorridor(currentX, currentY, currentDir, 3);
      if (straightResult.success) {
        currentX = straightResult.endX;
        currentY = straightResult.endY;
      }
    }
    
    return {
      success: roomsCreated >= targetRooms * 0.75, // 75% minimum
      roomsCreated: roomsCreated,
      endX: currentX,
      endY: currentY,
      endDir: currentDir
    };
  }
  
  // ═══════════════════════════════════════════════════════════════
  // ENTRÉE / SORTIE
  // ═══════════════════════════════════════════════════════════════
  
  placeEntrance(x, y) {
    this.markCell(x, y, 'entrance');
    this.path.push({ x, y, type: 'entrance' });
    console.log(`🚪 Entrée placée à (${x}, ${y})`);
  }
  
  placeExit(x, y) {
    this.markCell(x, y, 'exit');
    this.path.push({ x, y, type: 'exit' });
    console.log(`🏆 Sortie placée à (${x}, ${y})`);
  }
  
  // ═══════════════════════════════════════════════════════════════
  // GÉNÉRATION COULOIR
  // ═══════════════════════════════════════════════════════════════
  
  /**
   * Génère un couloir depuis (startX, startY) dans la direction dir
   * Longueur aléatoire: 4-10 cases (assoupli)
   */
  generateCorridor(startX, startY, initialDir) {
    const minLength = 4; // Réduit de 6 à 4
    const maxLength = 10; // Réduit de 12 à 10
    const targetLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    
    let x = startX;
    let y = startY;
    let currentDir = initialDir;
    let length = 0;
    let stepsInCurrentDir = 0;
    
    const corridorCells = [];
    
    while (length < targetLength) {
      // Vérifier si on peut avancer
      const dir = this.directions[currentDir];
      const nextX = x + dir.x;
      const nextY = y + dir.y;
      
      // Vérifier zone 5×5 autour ET séparation des couloirs parallèles
      if (!this.isSafeToPlace(nextX, nextY, 5) || !this.isParallelCorridorSafe(nextX, nextY, currentDir)) {
        // Essayer de tourner
        if (stepsInCurrentDir >= minLength) {
          const newDir = this.chooseSafeDirection(x, y, currentDir);
          if (newDir !== -1) {
            currentDir = newDir;
            stepsInCurrentDir = 0;
            continue;
          }
        }
        
        // Pas de solution → terminer le couloir ici
        break;
      }
      
      // Avancer
      this.markCell(nextX, nextY, 'corridor');
      corridorCells.push({ x: nextX, y: nextY, dir: currentDir });
      this.path.push({ x: nextX, y: nextY, type: 'corridor' });
      
      x = nextX;
      y = nextY;
      length++;
      stepsInCurrentDir++;
      
      // Ajouter à l'historique
      this.addToDirectionHistory(currentDir);
      
      // Virage possible après 4 cases minimum (assoupli)
      if (stepsInCurrentDir >= 4 && Math.random() < 0.2) {
        const newDir = this.chooseSafeDirection(x, y, currentDir);
        if (newDir !== -1 && newDir !== currentDir) {
          currentDir = newDir;
          stepsInCurrentDir = 0;
        }
      }
    }
    
    this.corridors.push({
      cells: corridorCells,
      startX: startX,
      startY: startY,
      endX: x,
      endY: y
    });
    
    return {
      success: length >= minLength,
      endX: x,
      endY: y,
      endDir: currentDir,
      length: length
    };
  }
  
  /**
   * Force N cubes en ligne droite (utilisé après sortie de salle)
   */
  forceStraightCorridor(startX, startY, direction, count) {
    const dir = this.directions[direction];
    let x = startX;
    let y = startY;
    let placed = 0;
    
    const corridorCells = [];
    
    for (let i = 0; i < count; i++) {
      const nextX = x + dir.x;
      const nextY = y + dir.y;
      
      // Vérifier si on peut placer
      if (!this.isSafeToPlace(nextX, nextY, 3) || !this.isParallelCorridorSafe(nextX, nextY, direction)) {
        break; // Impossible de continuer
      }
      
      // Placer
      this.markCell(nextX, nextY, 'corridor');
      corridorCells.push({ x: nextX, y: nextY, dir: direction });
      this.path.push({ x: nextX, y: nextY, type: 'corridor' });
      
      x = nextX;
      y = nextY;
      placed++;
    }
    
    if (corridorCells.length > 0) {
      this.corridors.push({
        cells: corridorCells,
        startX: startX,
        startY: startY,
        endX: x,
        endY: y
      });
    }
    
    return {
      success: placed === count,
      endX: x,
      endY: y,
      placed: placed
    };
  }
  
  // ═══════════════════════════════════════════════════════════════
  // GÉNÉRATION SALLE
  // ═══════════════════════════════════════════════════════════════
  
  /**
   * Place une salle 3×3 avec entrée depuis (entryX, entryY) dans direction entryDir
   * RÈGLE: Entrée et sortie TOUJOURS opposées
   * SÉCURITÉ: Vérifie que le couloir arrive bien droit (3 derniers cubes alignés)
   */
  placeRoom(entryX, entryY, entryDir) {
    const ROOM_SIZE = 3;
    const MIN_STRAIGHT_BEFORE_ROOM = 2; // Réduit de 3 à 2
    
    // Vérifier que les 2 derniers cubes du path sont bien alignés (assoupli)
    const dir = this.directions[entryDir];
    let straightCount = 0;
    
    for (let i = 1; i <= MIN_STRAIGHT_BEFORE_ROOM; i++) {
      const checkX = entryX - dir.x * i;
      const checkY = entryY - dir.y * i;
      
      if (this.isOccupied(checkX, checkY)) {
        straightCount++;
      } else {
        break;
      }
    }
    
    if (straightCount < MIN_STRAIGHT_BEFORE_ROOM) {
      console.log(`  ⚠️ Couloir pas assez droit avant salle (${straightCount}/2 cubes)`);
      return { success: false };
    }
    
    // Déterminer position et sorties selon l'axe
    // RÈGLE: Entrée et sortie sont OPPOSÉES (face à face)
    let roomStartX, roomStartY, exitX, exitY, exitDir;
    
    if (entryDir === 1) { // Arrivée par le SUD → Salle s'étend vers le SUD, sortie au SUD aussi
      roomStartX = entryX - Math.floor(ROOM_SIZE / 2);
      roomStartY = entryY;
      exitX = entryX; // Même X (aligné verticalement)
      exitY = entryY + ROOM_SIZE - 1; // 2 cases plus au sud
      exitDir = 1; // Continue vers le sud
      
    } else if (entryDir === 3) { // Arrivée par le NORD → Salle s'étend vers le NORD, sortie au NORD aussi
      roomStartX = entryX - Math.floor(ROOM_SIZE / 2);
      roomStartY = entryY - ROOM_SIZE + 1;
      exitX = entryX; // Même X (aligné verticalement)
      exitY = entryY - ROOM_SIZE + 1; // 2 cases plus au nord
      exitDir = 3; // Continue vers le nord
      
    } else if (entryDir === 0) { // Arrivée par l'EST → Salle s'étend vers l'EST, sortie à l'EST aussi
      roomStartX = entryX;
      roomStartY = entryY - Math.floor(ROOM_SIZE / 2);
      exitX = entryX + ROOM_SIZE - 1; // 2 cases plus à l'est
      exitY = entryY; // Même Y (aligné horizontalement)
      exitDir = 0; // Continue vers l'est
      
    } else { // entryDir === 2: Arrivée par l'OUEST → Salle s'étend vers l'OUEST, sortie à l'OUEST aussi
      roomStartX = entryX - ROOM_SIZE + 1;
      roomStartY = entryY - Math.floor(ROOM_SIZE / 2);
      exitX = entryX - ROOM_SIZE + 1; // 2 cases plus à l'ouest
      exitY = entryY; // Même Y (aligné horizontalement)
      exitDir = 2; // Continue vers l'ouest
    }
    
    // Vérifier que toutes les cases sont libres (SAUF l'entrée qui est déjà le couloir)
    for (let ry = 0; ry < ROOM_SIZE; ry++) {
      for (let rx = 0; rx < ROOM_SIZE; rx++) {
        const cx = roomStartX + rx;
        const cy = roomStartY + ry;
        
        // Skip l'entrée qui est déjà occupée par le couloir
        if (cx === entryX && cy === entryY) {
          continue;
        }
        
        if (!this.isInBounds(cx, cy) || this.isOccupied(cx, cy)) {
          console.log(`  ❌ Case (${cx}, ${cy}) déjà occupée ou hors limites`);
          return { success: false };
        }
      }
    }
    
    // Placer la salle (marquer toutes les cases comme occupées)
    const roomTiles = [];
    for (let ry = 0; ry < ROOM_SIZE; ry++) {
      for (let rx = 0; rx < ROOM_SIZE; rx++) {
        const cx = roomStartX + rx;
        const cy = roomStartY + ry;
        
        this.markCell(cx, cy, 'room');
        roomTiles.push({ x: cx, y: cy });
      }
    }
    
    // Calculer le centre de la salle
    const centerX = roomStartX + Math.floor(ROOM_SIZE / 2);
    const centerY = roomStartY + Math.floor(ROOM_SIZE / 2);
    
    // CHEMIN JOUABLE: Entrée → Centre → Sortie (3 cases uniquement)
    this.path.push({ x: entryX, y: entryY, type: 'room_entry' });
    
    if (centerX !== entryX || centerY !== entryY) {
      this.path.push({ x: centerX, y: centerY, type: 'room_center' });
    }
    
    if (exitX !== centerX || exitY !== centerY) {
      this.path.push({ x: exitX, y: exitY, type: 'room_exit' });
    }
    
    const room = {
      id: `room_${this.rooms.length}`,
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
      tiles: roomTiles
    };
    
    this.rooms.push(room);
    
    return {
      success: true,
      exitX: exitX,
      exitY: exitY,
      exitDir: exitDir
    };
  }
  
  /**
   * Place un Nœud de Destin (Blood Pact) - Structure 3×3 comme une salle
   */
  placeDestinyNode(entryX, entryY, entryDir, nodeIndex) {
    const NODE_SIZE = 3;
    const MIN_STRAIGHT_BEFORE_NODE = 2; // Réduit de 3 à 2
    
    // Vérifier alignement
    const dir = this.directions[entryDir];
    let straightCount = 0;
    
    for (let i = 1; i <= MIN_STRAIGHT_BEFORE_NODE; i++) {
      const checkX = entryX - dir.x * i;
      const checkY = entryY - dir.y * i;
      
      if (this.isOccupied(checkX, checkY)) {
        straightCount++;
      } else {
        break;
      }
    }
    
    if (straightCount < MIN_STRAIGHT_BEFORE_NODE) {
      console.log(`  ⚠️ Couloir pas assez droit avant nœud (${straightCount}/2 cubes)`);
      return { success: false };
    }
    
    // Calculer position selon direction (même logique que salle)
    let nodeStartX, nodeStartY, exitX, exitY, exitDir;
    
    if (entryDir === 1) {
      nodeStartX = entryX - Math.floor(NODE_SIZE / 2);
      nodeStartY = entryY;
      exitX = entryX;
      exitY = entryY + NODE_SIZE - 1;
      exitDir = 1;
    } else if (entryDir === 3) {
      nodeStartX = entryX - Math.floor(NODE_SIZE / 2);
      nodeStartY = entryY - NODE_SIZE + 1;
      exitX = entryX;
      exitY = entryY - NODE_SIZE + 1;
      exitDir = 3;
    } else if (entryDir === 0) {
      nodeStartX = entryX;
      nodeStartY = entryY - Math.floor(NODE_SIZE / 2);
      exitX = entryX + NODE_SIZE - 1;
      exitY = entryY;
      exitDir = 0;
    } else {
      nodeStartX = entryX - NODE_SIZE + 1;
      nodeStartY = entryY - Math.floor(NODE_SIZE / 2);
      exitX = entryX - NODE_SIZE + 1;
      exitY = entryY;
      exitDir = 2;
    }
    
    // Vérifier que toutes les cases sont libres
    for (let ry = 0; ry < NODE_SIZE; ry++) {
      for (let rx = 0; rx < NODE_SIZE; rx++) {
        const cx = nodeStartX + rx;
        const cy = nodeStartY + ry;
        
        if (cx === entryX && cy === entryY) {
          continue;
        }
        
        if (!this.isInBounds(cx, cy) || this.isOccupied(cx, cy)) {
          console.log(`  ❌ Case (${cx}, ${cy}) déjà occupée pour nœud`);
          return { success: false };
        }
      }
    }
    
    // Placer le nœud
    const nodeTiles = [];
    for (let ry = 0; ry < NODE_SIZE; ry++) {
      for (let rx = 0; rx < NODE_SIZE; rx++) {
        const cx = nodeStartX + rx;
        const cy = nodeStartY + ry;
        
        this.markCell(cx, cy, 'destiny_node');
        nodeTiles.push({ x: cx, y: cy });
      }
    }
    
    const centerX = nodeStartX + Math.floor(NODE_SIZE / 2);
    const centerY = nodeStartY + Math.floor(NODE_SIZE / 2);
    
    // CHEMIN JOUABLE: Entrée → Centre → Sortie
    this.path.push({ x: entryX, y: entryY, type: 'node_entry', nodeIndex: nodeIndex });
    
    if (centerX !== entryX || centerY !== entryY) {
      this.path.push({ x: centerX, y: centerY, type: 'node_center', nodeIndex: nodeIndex });
    }
    
    if (exitX !== centerX || exitY !== centerY) {
      this.path.push({ x: exitX, y: exitY, type: 'node_exit', nodeIndex: nodeIndex });
    }
    
    const node = {
      id: `destiny_node_${nodeIndex}`,
      index: nodeIndex,
      x: nodeStartX,
      y: nodeStartY,
      width: NODE_SIZE,
      height: NODE_SIZE,
      entryX: entryX,
      entryY: entryY,
      exitX: exitX,
      exitY: exitY,
      centerX: centerX,
      centerY: centerY,
      tiles: nodeTiles,
      type: 'blood_pact'
    };
    
    this.destinyNodes.push(node);
    
    return {
      success: true,
      exitX: exitX,
      exitY: exitY,
      exitDir: exitDir
    };
  }
  
  // ═══════════════════════════════════════════════════════════════
  // SYSTÈME DE MÉMOIRE ET VALIDATION
  // ═══════════════════════════════════════════════════════════════
  
  markCell(x, y, type) {
    if (this.isInBounds(x, y)) {
      const key = `${x},${y}`;
      this.occupiedCells.add(key);
      
      if (type === 'corridor') {
        this.grid[y][x] = 1;
      } else if (type === 'room') {
        this.grid[y][x] = 1;
      } else if (type === 'entrance' || type === 'exit') {
        this.grid[y][x] = 1;
      }
    }
  }
  
  isOccupied(x, y) {
    const key = `${x},${y}`;
    return this.occupiedCells.has(key);
  }
  
  isInBounds(x, y, margin = 5) {
    return x >= margin && x < this.gridSize - margin &&
           y >= margin && y < this.gridSize - margin;
  }
  
  /**
   * Vérifie si on peut placer quelque chose à (x, y) sans collision
   * Vérifie une zone de sécurité autour (checkRadius)
   */
  isSafeToPlace(x, y, checkRadius = 5) {
    if (!this.isInBounds(x, y)) return false;
    if (this.isOccupied(x, y)) return false;
    
    // Vérifier zone autour (mais permettre d'être adjacent au path existant)
    for (let dy = -checkRadius; dy <= checkRadius; dy++) {
      for (let dx = -checkRadius; dx <= checkRadius; dx++) {
        if (dx === 0 && dy === 0) continue;
        
        const cx = x + dx;
        const cy = y + dy;
        
        const dist = Math.abs(dx) + Math.abs(dy);
        
        // Ne bloquer QUE si on est exactement sur une case occupée
        // Permettre d'être adjacent (dist = 1) pour connecter les structures
        if (dist === 0 && this.isOccupied(cx, cy)) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  /**
   * Vérifie si placer un couloir à (x, y) dans la direction currentDir
   * ne crée pas un couloir parallèle trop proche (< 3 cubes de séparation)
   */
  isParallelCorridorSafe(x, y, currentDir) {
    const MIN_SEPARATION = 3; // Distance minimale mur à mur entre couloirs parallèles
    
    // Déterminer la direction perpendiculaire
    let perpDir1, perpDir2;
    
    if (currentDir === 0 || currentDir === 2) {
      // Couloir horizontal (Est/Ouest) → Vérifier Nord/Sud
      perpDir1 = { x: 0, y: -1 }; // Nord
      perpDir2 = { x: 0, y: 1 };  // Sud
    } else {
      // Couloir vertical (Nord/Sud) → Vérifier Est/Ouest  
      perpDir1 = { x: -1, y: 0 }; // Ouest
      perpDir2 = { x: 1, y: 0 };  // Est
    }
    
    // Vérifier dans les deux directions perpendiculaires
    for (let dist = 1; dist <= MIN_SEPARATION; dist++) {
      // Direction 1
      const check1X = x + perpDir1.x * dist;
      const check1Y = y + perpDir1.y * dist;
      
      if (this.isInBounds(check1X, check1Y) && this.isOccupied(check1X, check1Y)) {
        // Si c'est un couloir dans la même direction → trop proche !
        if (this.grid[check1Y] && this.grid[check1Y][check1X] === 1) {
          return false;
        }
      }
      
      // Direction 2
      const check2X = x + perpDir2.x * dist;
      const check2Y = y + perpDir2.y * dist;
      
      if (this.isInBounds(check2X, check2Y) && this.isOccupied(check2X, check2Y)) {
        if (this.grid[check2Y] && this.grid[check2Y][check2X] === 1) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  // ═══════════════════════════════════════════════════════════════
  // SYSTÈME ANTI-BLOCAGE
  // ═══════════════════════════════════════════════════════════════
  
  addToDirectionHistory(dir) {
    this.directionHistory.push(dir);
    if (this.directionHistory.length > this.maxHistoryLength) {
      this.directionHistory.shift();
    }
  }
  
  /**
   * Détecte si on tourne trop souvent dans le même sens (spirale)
   */
  isSpiralPattern() {
    if (this.directionHistory.length < 3) return false;
    
    const last3 = this.directionHistory.slice(-3);
    
    // Vérifier 3 virages consécutifs dans le même sens
    let turnsRight = 0;
    let turnsLeft = 0;
    
    for (let i = 1; i < last3.length; i++) {
      const diff = (last3[i] - last3[i-1] + 4) % 4;
      if (diff === 1) turnsRight++;
      if (diff === 3) turnsLeft++;
    }
    
    return turnsRight >= 2 || turnsLeft >= 2;
  }
  
  /**
   * Choisit une direction sûre qui évite les spirales, collisions ET couloirs parallèles
   */
  chooseSafeDirection(x, y, currentDir) {
    const possibleDirs = [];
    
    for (let d = 0; d < 4; d++) {
      // Interdire demi-tour
      if (d === this.directions[currentDir].opposite) continue;
      
      // Tester cette direction
      const dir = this.directions[d];
      const testX = x + dir.x;
      const testY = y + dir.y;
      
      // Vérifier sécurité ET séparation parallèle
      if (this.isSafeToPlace(testX, testY, 3) && this.isParallelCorridorSafe(testX, testY, d)) {
        possibleDirs.push(d);
      }
    }
    
    if (possibleDirs.length === 0) return -1;
    
    // Si spirale détectée, privilégier tout droit ou sens opposé
    if (this.isSpiralPattern()) {
      if (possibleDirs.includes(currentDir)) {
        return currentDir; // Tout droit
      }
    }
    
    // Sinon, choix aléatoire parmi les directions sûres
    return possibleDirs[Math.floor(Math.random() * possibleDirs.length)];
  }
  
  findValidDirection(x, y, currentDir) {
    const safe = this.chooseSafeDirection(x, y, currentDir);
    return safe !== -1 ? safe : currentDir;
  }
  
  // ═══════════════════════════════════════════════════════════════
  // CRÉATION DES MURS
  // ═══════════════════════════════════════════════════════════════
  
  createWalls() {
    console.log('🧱 Création des murs...');
    
    const wallsSet = new Set();
    
    // 1. Murs des salles (4 côtés complets sauf ouvertures centrales)
    this.rooms.forEach(room => {
      const ROOM_SIZE = 3;
      
      // Côté NORD
      for (let x = room.x - 1; x <= room.x + ROOM_SIZE; x++) {
        const wx = x;
        const wy = room.y - 1;
        
        if (wx !== room.entryX || wy !== room.entryY) {
          if (wx !== room.exitX || wy !== room.exitY) {
            if (this.isInBounds(wx, wy) && this.grid[wy][wx] === 0) {
              this.grid[wy][wx] = 2;
              wallsSet.add(`${wx},${wy}`);
            }
          }
        }
      }
      
      // Côté SUD
      for (let x = room.x - 1; x <= room.x + ROOM_SIZE; x++) {
        const wx = x;
        const wy = room.y + ROOM_SIZE;
        
        if (wx !== room.entryX || wy !== room.entryY) {
          if (wx !== room.exitX || wy !== room.exitY) {
            if (this.isInBounds(wx, wy) && this.grid[wy][wx] === 0) {
              this.grid[wy][wx] = 2;
              wallsSet.add(`${wx},${wy}`);
            }
          }
        }
      }
      
      // Côté OUEST
      for (let y = room.y; y < room.y + ROOM_SIZE; y++) {
        const wx = room.x - 1;
        const wy = y;
        
        if (wx !== room.entryX || wy !== room.entryY) {
          if (wx !== room.exitX || wy !== room.exitY) {
            if (this.isInBounds(wx, wy) && this.grid[wy][wx] === 0) {
              this.grid[wy][wx] = 2;
              wallsSet.add(`${wx},${wy}`);
            }
          }
        }
      }
      
      // Côté EST
      for (let y = room.y; y < room.y + ROOM_SIZE; y++) {
        const wx = room.x + ROOM_SIZE;
        const wy = y;
        
        if (wx !== room.entryX || wy !== room.entryY) {
          if (wx !== room.exitX || wy !== room.exitY) {
            if (this.isInBounds(wx, wy) && this.grid[wy][wx] === 0) {
              this.grid[wy][wx] = 2;
              wallsSet.add(`${wx},${wy}`);
            }
          }
        }
      }
    });
    
    // 2. Murs des couloirs - Uniquement perpendiculaires à la direction
    const pathCorridors = this.path.filter(tile => tile.type === 'corridor');
    
    pathCorridors.forEach((tile, index) => {
      // Déterminer la direction du couloir
      let direction = null;
      
      if (index > 0) {
        const prev = pathCorridors[index - 1];
        if (prev.x !== tile.x) direction = 'horizontal';
        else if (prev.y !== tile.y) direction = 'vertical';
      }
      
      if (!direction && index < pathCorridors.length - 1) {
        const next = pathCorridors[index + 1];
        if (next.x !== tile.x) direction = 'horizontal';
        else if (next.y !== tile.y) direction = 'vertical';
      }
      
      // Placer murs UNIQUEMENT perpendiculaires
      if (direction === 'horizontal') {
        // Murs au nord et sud uniquement
        const wallPos = [
          { x: tile.x, y: tile.y - 1 },  // Nord
          { x: tile.x, y: tile.y + 1 }   // Sud
        ];
        wallPos.forEach(pos => {
          const key = `${pos.x},${pos.y}`;
          if (this.isInBounds(pos.x, pos.y, 0) && this.grid[pos.y][pos.x] === 0 && !wallsSet.has(key)) {
            this.grid[pos.y][pos.x] = 2;
            wallsSet.add(`${pos.x},${pos.y}`);
          }
        });
      } else if (direction === 'vertical') {
        // Murs à l'est et ouest uniquement
        const wallPos = [
          { x: tile.x - 1, y: tile.y },  // Ouest
          { x: tile.x + 1, y: tile.y }   // Est
        ];
        wallPos.forEach(pos => {
          const key = `${pos.x},${pos.y}`;
          if (this.isInBounds(pos.x, pos.y, 0) && this.grid[pos.y][pos.x] === 0 && !wallsSet.has(key)) {
            this.grid[pos.y][pos.x] = 2;
            wallsSet.add(`${pos.x},${pos.y}`);
          }
        });
      }
    });
    
    // 3. Combler TOUS les coins manquants (approche exhaustive)
    this.fillAllCorners(wallsSet);
    
    console.log(`✅ ${wallsSet.size} murs créés`);
  }
  
  /**
   * Comble TOUS les coins manquants en vérifiant les diagonales
   */
  fillAllCorners(wallsSet) {
    // Parcourir toute la grille et détecter les coins manquants
    for (let y = 1; y < this.gridSize - 1; y++) {
      for (let x = 1; x < this.gridSize - 1; x++) {
        // Si cette case est vide
        if (this.grid[y][x] === 0) {
          // Pattern de détection: vérifier les 4 coins possibles
          const patterns = [
            // Pattern Nord-Est
            { side1: {x: 0, y: -1}, side2: {x: 1, y: 0}, diagonal: {x: 1, y: -1} },
            // Pattern Sud-Est
            { side1: {x: 0, y: 1}, side2: {x: 1, y: 0}, diagonal: {x: 1, y: 1} },
            // Pattern Sud-Ouest
            { side1: {x: 0, y: 1}, side2: {x: -1, y: 0}, diagonal: {x: -1, y: 1} },
            // Pattern Nord-Ouest
            { side1: {x: 0, y: -1}, side2: {x: -1, y: 0}, diagonal: {x: -1, y: -1} }
          ];
          
          for (const pattern of patterns) {
            const s1 = this.grid[y + pattern.side1.y]?.[x + pattern.side1.x];
            const s2 = this.grid[y + pattern.side2.y]?.[x + pattern.side2.x];
            const diag = this.grid[y + pattern.diagonal.y]?.[x + pattern.diagonal.x];
            
            // CAS 1: Coin intérieur (2 couloirs adjacents, diagonale vide)
            if (s1 === 1 && s2 === 1 && diag === 0) {
              this.grid[y][x] = 2;
              wallsSet.add(`${x},${y}`);
              break;
            }
            
            // CAS 2: Coin extérieur (2 murs adjacents, diagonale = couloir ou mur)
            // C'est LE cas des virages à 90° !
            if (s1 === 2 && s2 === 2 && (diag === 1 || diag === 2)) {
              this.grid[y][x] = 2;
              wallsSet.add(`${x},${y}`);
              break;
            }
            
            // CAS 3: Mixte (1 mur + 1 couloir, diagonale = mur)
            if ((s1 === 2 && s2 === 1) || (s1 === 1 && s2 === 2)) {
              if (diag === 2) {
                this.grid[y][x] = 2;
                wallsSet.add(`${x},${y}`);
                break;
              }
            }
          }
        }
      }
    }
  }
}

// Exposer globalement
window.LinearDungeonGenerator = LinearDungeonGenerator;
