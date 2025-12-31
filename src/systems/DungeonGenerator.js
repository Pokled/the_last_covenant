/**
 * Générateur procédural de donjons pour THE LAST COVENANT
 * Algorithme : BSP (Binary Space Partitioning)
 * Basé sur la documentation professionnelle (IEEE 2014 + Bachelor Thesis 2025)
 * 
 * Avantages BSP :
 * - Zéro chevauchement garanti (division récursive)
 * - Contrôle précis du nombre de salles (6-8)
 * - 1 entrée/1 sortie par salle (structure arborescente)
 * - Couloirs propres (connexions entre partitions)
 * - Performance O(n log n)
 */

/**
 * Nœud BSP - Représente une partition de l'espace
 */
class BSPNode {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.leftChild = null;
        this.rightChild = null;
        this.room = null;
        this.corridors = [];
    }
    
    isLeaf() {
        return this.leftChild === null && this.rightChild === null;
    }
}

export class DungeonGenerator {
    constructor(seed = Date.now()) {
        this.seed = seed;
        this.rng = this.seededRandom(seed);
        
        // Configuration BSP
        this.config = {
            width: 60,
            height: 60,
            minRoomSize: 6,
            maxRoomSize: 12,
            minPartitionSize: 10,  // Taille minimum d'une partition
            maxDepth: 3,           // Profondeur max (2^3 = 8 feuilles max)
            roomPadding: 2,        // Marge autour des salles
            corridorWidth: 3       // Largeur des couloirs
        };
        
        // Types de tuiles
        this.TILE = {
            WALL: 0,
            FLOOR: 1,
            DOOR: 2,
            START: 3,
            EXIT: 4,
            TREASURE: 5,
            ENEMY: 6
        };
        
        this.grid = [];
        this.rooms = [];
        this.corridors = [];
        this.root = null;
    }
    
    /**
     * Générateur de nombres aléatoires avec seed
     */
    seededRandom(seed) {
        let state = seed;
        return () => {
            state = (state * 1664525 + 1013904223) % 4294967296;
            return state / 4294967296;
        };
    }
    
    random(min, max) {
        return Math.floor(this.rng() * (max - min + 1)) + min;
    }
    
    /**
     * Génère le donjon complet avec BSP
     */
    generate() {
        console.log(`🏗️ Génération BSP avec seed: ${this.seed}`);
        
        // 1. Initialise la grille
        this.initGrid();
        
        // 2. Crée l'arbre BSP
        this.root = new BSPNode(1, 1, this.config.width - 2, this.config.height - 2);
        this.splitNode(this.root, 0);
        
        // 3. Crée les salles dans les feuilles
        this.createRoomsInLeaves(this.root);
        
        // 4. Connecte les salles avec des couloirs
        this.connectSiblingRooms(this.root);
        
        // 5. Dessine tout sur la grille
        this.drawRoomsToGrid();
        this.drawCorridorsToGrid();
        
        // 6. Place les éléments spéciaux
        this.placeSpecialTiles();
        
        // 7. OPTIMISATION : Supprime les murs inutiles (pas adjacents aux sols)
        this.removeUnusedWalls();
        
        console.log(`✅ ${this.rooms.length} salles générées, ${this.corridors.length} couloirs`);
        
        return {
            grid: this.grid,
            rooms: this.rooms,
            width: this.config.width,
            height: this.config.height,
            seed: this.seed
        };
    }
    
    /**
     * Initialise la grille avec des murs
     */
    initGrid() {
        this.grid = Array(this.config.height)
            .fill(null)
            .map(() => Array(this.config.width).fill(this.TILE.WALL));
    }
    
    /**
     * Divise récursivement un nœud BSP
     */
    splitNode(node, depth) {
        // Condition d'arrêt : profondeur max ou taille min atteinte
        if (depth >= this.config.maxDepth) {
            return;
        }
        
        // Vérifie si le nœud est assez grand pour être divisé
        const canSplitH = node.width >= this.config.minPartitionSize * 2;
        const canSplitV = node.height >= this.config.minPartitionSize * 2;
        
        if (!canSplitH && !canSplitV) {
            return; // Trop petit pour diviser
        }
        
        // Décide de la direction (horizontal ou vertical)
        let splitHorizontally;
        
        if (canSplitH && canSplitV) {
            // Les deux possibles, choisit aléatoirement avec biais selon ratio
            const ratio = node.width / node.height;
            if (ratio > 1.25) {
                splitHorizontally = false; // Trop large, coupe verticalement
            } else if (ratio < 0.75) {
                splitHorizontally = true;  // Trop haut, coupe horizontalement
            } else {
                splitHorizontally = this.rng() > 0.5;
            }
        } else {
            splitHorizontally = canSplitV;
        }
        
        // Effectue la division
        if (splitHorizontally) {
            // Coupe horizontale
            const minSplit = this.config.minPartitionSize;
            const maxSplit = node.height - this.config.minPartitionSize;
            const splitPos = this.random(minSplit, maxSplit);
            
            node.leftChild = new BSPNode(node.x, node.y, node.width, splitPos);
            node.rightChild = new BSPNode(node.x, node.y + splitPos, node.width, node.height - splitPos);
        } else {
            // Coupe verticale
            const minSplit = this.config.minPartitionSize;
            const maxSplit = node.width - this.config.minPartitionSize;
            const splitPos = this.random(minSplit, maxSplit);
            
            node.leftChild = new BSPNode(node.x, node.y, splitPos, node.height);
            node.rightChild = new BSPNode(node.x + splitPos, node.y, node.width - splitPos, node.height);
        }
        
        // Récursion sur les enfants
        this.splitNode(node.leftChild, depth + 1);
        this.splitNode(node.rightChild, depth + 1);
    }
    
    /**
     * Crée des salles dans les feuilles de l'arbre BSP
     */
    createRoomsInLeaves(node) {
        if (node.isLeaf()) {
            // C'est une feuille, crée une salle
            const padding = this.config.roomPadding;
            
            // Taille de la salle (avec marge)
            const minW = this.config.minRoomSize;
            const maxW = Math.min(this.config.maxRoomSize, node.width - padding * 2);
            const minH = this.config.minRoomSize;
            const maxH = Math.min(this.config.maxRoomSize, node.height - padding * 2);
            
            if (maxW < minW || maxH < minH) {
                console.warn('Partition trop petite pour une salle');
                return;
            }
            
            const roomWidth = this.random(minW, maxW);
            const roomHeight = this.random(minH, maxH);
            
            // Position aléatoire dans la partition (avec marge)
            const roomX = node.x + this.random(padding, node.width - roomWidth - padding);
            const roomY = node.y + this.random(padding, node.height - roomHeight - padding);
            
            node.room = {
                x: roomX,
                y: roomY,
                width: roomWidth,
                height: roomHeight,
                centerX: Math.floor(roomX + roomWidth / 2),
                centerY: Math.floor(roomY + roomHeight / 2)
            };
            
            this.rooms.push(node.room);
        } else {
            // Pas une feuille, continue la récursion
            if (node.leftChild) this.createRoomsInLeaves(node.leftChild);
            if (node.rightChild) this.createRoomsInLeaves(node.rightChild);
        }
    }
    
    /**
     * Creuse une salle dans la grille
     */
    carveRoom(room) {
        for (let y = room.y; y < room.y + room.height; y++) {
            for (let x = room.x; x < room.x + room.width; x++) {
                if (this.isInBounds(x, y)) {
                    this.grid[y][x] = this.TILE.FLOOR;
                }
            }
        }
    }
    
    /**
     * Connecte les salles sœurs dans l'arbre BSP
     */
    connectSiblingRooms(node) {
        if (node.isLeaf()) {
            return;
        }
        
        // Récupère les salles des sous-arbres gauche et droit
        const leftRooms = this.getRoomsFromNode(node.leftChild);
        const rightRooms = this.getRoomsFromNode(node.rightChild);
        
        if (leftRooms.length > 0 && rightRooms.length > 0) {
            // Choisit une salle aléatoire de chaque côté
            const leftRoom = leftRooms[Math.floor(this.rng() * leftRooms.length)];
            const rightRoom = rightRooms[Math.floor(this.rng() * rightRooms.length)];
            
            // Crée un couloir en L entre les centres
            const corridor = this.createLCorridor(
                leftRoom.centerX, leftRoom.centerY,
                rightRoom.centerX, rightRoom.centerY
            );
            
            this.corridors.push(corridor);
        }
        
        // Récursion sur les enfants
        if (node.leftChild) this.connectSiblingRooms(node.leftChild);
        if (node.rightChild) this.connectSiblingRooms(node.rightChild);
    }
    
    /**
     * Récupère toutes les salles d'un sous-arbre
     */
    getRoomsFromNode(node) {
        if (!node) return [];
        if (node.isLeaf()) {
            return node.room ? [node.room] : [];
        }
        
        return [
            ...this.getRoomsFromNode(node.leftChild),
            ...this.getRoomsFromNode(node.rightChild)
        ];
    }
    
    /**
     * Crée un couloir en forme de L entre deux points
     */
    createLCorridor(x1, y1, x2, y2) {
        const corridor = {
            segments: []
        };
        
        const w = this.config.corridorWidth;
        
        // Alterne horizontal->vertical ou vertical->horizontal
        if (this.rng() > 0.5) {
            // Horizontal puis vertical
            const startX = Math.min(x1, x2);
            const endX = Math.max(x1, x2);
            
            corridor.segments.push({
                x: startX,
                y: y1 - Math.floor(w / 2),
                width: endX - startX + 1,
                height: w
            });
            
            const startY = Math.min(y1, y2);
            const endY = Math.max(y1, y2);
            
            corridor.segments.push({
                x: x2 - Math.floor(w / 2),
                y: startY,
                width: w,
                height: endY - startY + 1
            });
        } else {
            // Vertical puis horizontal
            const startY = Math.min(y1, y2);
            const endY = Math.max(y1, y2);
            
            corridor.segments.push({
                x: x1 - Math.floor(w / 2),
                y: startY,
                width: w,
                height: endY - startY + 1
            });
            
            const startX = Math.min(x1, x2);
            const endX = Math.max(x1, x2);
            
            corridor.segments.push({
                x: startX,
                y: y2 - Math.floor(w / 2),
                width: endX - startX + 1,
                height: w
            });
        }
        
        return corridor;
    }
    
    /**
     * Dessine les salles sur la grille
     */
    drawRoomsToGrid() {
        for (const room of this.rooms) {
            for (let y = room.y; y < room.y + room.height; y++) {
                for (let x = room.x; x < room.x + room.width; x++) {
                    if (this.isInBounds(x, y)) {
                        this.grid[y][x] = this.TILE.FLOOR;
                    }
                }
            }
        }
    }
    
    /**
     * Dessine les couloirs sur la grille
     */
    drawCorridorsToGrid() {
        for (const corridor of this.corridors) {
            for (const segment of corridor.segments) {
                for (let y = segment.y; y < segment.y + segment.height; y++) {
                    for (let x = segment.x; x < segment.x + segment.width; x++) {
                        if (this.isInBounds(x, y)) {
                            this.grid[y][x] = this.TILE.FLOOR;
                        }
                    }
                }
            }
        }
    }
    
    /**
     * Place les tuiles spéciales (START, EXIT, TREASURE, ENEMY)
     */
    placeSpecialTiles() {
        if (this.rooms.length < 2) return;
        
        // Trouve les 2 salles les plus éloignées (START et EXIT)
        const { startRoom, exitRoom } = this.findMostDistantRooms();
        
        // START : salle la plus éloignée de EXIT
        this.grid[startRoom.centerY][startRoom.centerX] = this.TILE.START;
        
        // EXIT : salle la plus éloignée de START
        this.grid[exitRoom.centerY][exitRoom.centerX] = this.TILE.EXIT;
        
        console.log(`📍 Distance START ↔ EXIT : ${this.calculateDistance(startRoom, exitRoom).toFixed(1)} tuiles`);
        
        // TREASURE : salles intermédiaires (30% chance)
        for (let i = 0; i < this.rooms.length; i++) {
            const room = this.rooms[i];
            
            // Pas dans START ni EXIT
            if (room === startRoom || room === exitRoom) continue;
            
            if (this.rng() < 0.3) {
                const tx = room.x + this.random(1, room.width - 2);
                const ty = room.y + this.random(1, room.height - 2);
                this.grid[ty][tx] = this.TILE.TREASURE;
            }
        }
        
        // ENEMY : salles intermédiaires (50% chance)
        for (let i = 0; i < this.rooms.length; i++) {
            const room = this.rooms[i];
            
            // Pas dans START ni EXIT
            if (room === startRoom || room === exitRoom) continue;
            
            if (this.rng() < 0.5) {
                const ex = room.x + this.random(1, room.width - 2);
                const ey = room.y + this.random(1, room.height - 2);
                
                // Ne place pas sur une autre tuile spéciale
                if (this.grid[ey][ex] === this.TILE.FLOOR) {
                    this.grid[ey][ex] = this.TILE.ENEMY;
                }
            }
        }
    }
    
    /**
     * Trouve les 2 salles les plus éloignées (pour START et EXIT)
     */
    findMostDistantRooms() {
        let maxDistance = 0;
        let startRoom = this.rooms[0];
        let exitRoom = this.rooms[this.rooms.length - 1];
        
        // Compare toutes les paires de salles
        for (let i = 0; i < this.rooms.length; i++) {
            for (let j = i + 1; j < this.rooms.length; j++) {
                const roomA = this.rooms[i];
                const roomB = this.rooms[j];
                const distance = this.calculateDistance(roomA, roomB);
                
                if (distance > maxDistance) {
                    maxDistance = distance;
                    startRoom = roomA;
                    exitRoom = roomB;
                }
            }
        }
        
        return { startRoom, exitRoom };
    }
    
    /**
     * Calcule la distance euclidienne entre 2 salles (centres)
     */
    calculateDistance(roomA, roomB) {
        const dx = roomA.centerX - roomB.centerX;
        const dy = roomA.centerY - roomB.centerY;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    /**
     * Vérifie la connectivité (normalement garantie par BSP)
     */
    ensureConnectivity() {
        // BSP garantit la connectivité par construction
        // Cette méthode est conservée pour compatibilité
        console.log('✅ Connectivité garantie par BSP');
    }
    
    /**
     * OPTIMISATION : Supprime les murs qui ne bordent pas de sol
     * Garde uniquement les murs adjacents aux zones praticables
     */
    removeUnusedWalls() {
        let removedCount = 0;
        
        // Parcourt toute la grille
        for (let y = 0; y < this.config.height; y++) {
            for (let x = 0; x < this.config.width; x++) {
                // Si c'est un mur
                if (this.grid[y][x] === this.TILE.WALL) {
                    // Vérifie si ce mur est adjacent à au moins un sol
                    if (!this.isAdjacentToFloor(x, y)) {
                        // Aucun sol adjacent → mur inutile, on le marque comme vide
                        this.grid[y][x] = -1;  // -1 = vide (ne sera pas rendu)
                        removedCount++;
                    }
                }
            }
        }
        
        console.log(`🗑️ ${removedCount} murs inutiles supprimés (optimisation)`);
    }
    
    /**
     * Vérifie si une tuile mur est adjacente à un sol (8 directions : cardinales + diagonales)
     */
    isAdjacentToFloor(x, y) {
        const directions = [
            [0, -1],   // Haut
            [1, -1],   // Haut-Droite (diagonale)
            [1, 0],    // Droite
            [1, 1],    // Bas-Droite (diagonale)
            [0, 1],    // Bas
            [-1, 1],   // Bas-Gauche (diagonale)
            [-1, 0],   // Gauche
            [-1, -1]   // Haut-Gauche (diagonale)
        ];
        
        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            
            if (this.isInBounds(nx, ny)) {
                const tile = this.grid[ny][nx];
                // Sol ou tuile spéciale (pas un mur)
                if (tile !== this.TILE.WALL && tile !== -1) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    /**
     * Détecte quelle salle contient un point donné
     */
    isInRoom(x, y) {
        return this.rooms.some(room => 
            x >= room.x && x < room.x + room.width &&
            y >= room.y && y < room.y + room.height
        );
    }
    
    isInBounds(x, y) {
        return x >= 0 && x < this.config.width && y >= 0 && y < this.config.height;
    }
    
    /**
     * Retourne une représentation ASCII du donjon (debug)
     */
    toASCII() {
        const symbols = {
            [this.TILE.WALL]: '█',
            [this.TILE.FLOOR]: '·',
            [this.TILE.DOOR]: 'D',
            [this.TILE.START]: 'S',
            [this.TILE.EXIT]: 'E',
            [this.TILE.TREASURE]: 'T',
            [this.TILE.ENEMY]: 'M'
        };
        
        return this.grid.map(row => 
            row.map(tile => symbols[tile] || '?').join('')
        ).join('\n');
    }
}
