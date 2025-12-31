/**
 * RoomGenerator - Génération procédurale de donjons
 * @description Crée grille avec salles et couloirs
 */

export class RoomGenerator {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.grid = [];
        
        // Types de tiles
        this.TILE_TYPES = {
            EMPTY: 0,
            FLOOR: 1,
            WALL: 2,
            DOOR: 3,
            SPAWN: 4, // Point d'apparition joueur
            EXIT: 5   // Sortie de la salle
        };
        
        this.initGrid();
    }

    /**
     * Initialiser grille vide
     */
    initGrid() {
        this.grid = [];
        for (let y = 0; y < this.height; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.grid[y][x] = this.TILE_TYPES.EMPTY;
            }
        }
    }

    /**
     * Générer une salle simple (rectangulaire)
     */
    generateSimpleRoom() {
        this.initGrid();
        
        // Créer salle au centre (80% de la grille)
        const roomWidth = Math.floor(this.width * 0.8);
        const roomHeight = Math.floor(this.height * 0.8);
        const startX = Math.floor((this.width - roomWidth) / 2);
        const startY = Math.floor((this.height - roomHeight) / 2);
        const endX = startX + roomWidth - 1;
        const endY = startY + roomHeight - 1;
        
        console.log('🏗️ Generating room:', {
            size: `${roomWidth}x${roomHeight}`,
            start: `(${startX},${startY})`,
            end: `(${endX},${endY})`
        });
        
        // Remplir TOUT (murs + sol)
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                // Calculer si on est dans la zone de la salle
                const inRoomX = x >= startX && x <= endX;
                const inRoomY = y >= startY && y <= endY;
                
                if (inRoomX && inRoomY) {
                    // À l'intérieur de la salle
                    // Vérifier si c'est un mur (bordure) ou sol
                    const isTopWall = y === startY;
                    const isBottomWall = y === endY;
                    const isLeftWall = x === startX;
                    const isRightWall = x === endX;
                    
                    if (isTopWall || isBottomWall || isLeftWall || isRightWall) {
                        this.grid[y][x] = this.TILE_TYPES.WALL;
                    } else {
                        this.grid[y][x] = this.TILE_TYPES.FLOOR;
                    }
                } else {
                    // En dehors de la salle = vide
                    this.grid[y][x] = this.TILE_TYPES.EMPTY;
                }
            }
        }
        
        // Point de spawn (centre)
        const spawnX = Math.floor(this.width / 2);
        const spawnY = Math.floor(this.height / 2);
        this.grid[spawnY][spawnX] = this.TILE_TYPES.SPAWN;
        
        // Sortie (en haut au centre, remplace le mur)
        const exitX = Math.floor(this.width / 2);
        const exitY = startY;
        this.grid[exitY][exitX] = this.TILE_TYPES.DOOR;
        
        console.log('✅ Room generated with spawn at', `(${spawnX},${spawnY})`);
        
        // DEBUG : Afficher grille console pour vérifier
        console.log('🗺️ Grid map (W=Wall, F=Floor, E=Empty, S=Spawn, D=Door):');
        let debugMap = '';
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const tile = this.grid[y][x];
                switch(tile) {
                    case this.TILE_TYPES.EMPTY: debugMap += '.'; break;
                    case this.TILE_TYPES.FLOOR: debugMap += ' '; break;
                    case this.TILE_TYPES.WALL: debugMap += '#'; break;
                    case this.TILE_TYPES.DOOR: debugMap += 'D'; break;
                    case this.TILE_TYPES.SPAWN: debugMap += 'S'; break;
                    default: debugMap += '?'; break;
                }
            }
            debugMap += '\n';
        }
        console.log(debugMap);
    }

    /**
     * Obtenir type de tile à une position
     */
    getTile(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return this.TILE_TYPES.EMPTY;
        }
        return this.grid[y][x];
    }

    /**
     * Définir type de tile
     */
    setTile(x, y, type) {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.grid[y][x] = type;
        }
    }

    /**
     * Vérifier si tile est walkable
     */
    isWalkable(x, y) {
        const tile = this.getTile(x, y);
        const walkable = tile === this.TILE_TYPES.FLOOR || 
                        tile === this.TILE_TYPES.SPAWN || 
                        tile === this.TILE_TYPES.DOOR;
        
        // Debug log
        if (!walkable && tile !== this.TILE_TYPES.EMPTY) {
            console.log(`🚫 Blocked at (${x},${y}) - tile type: ${tile} (WALL=${this.TILE_TYPES.WALL})`);
        }
        
        return walkable;
    }

    /**
     * Trouver position de spawn
     */
    getSpawnPosition() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.grid[y][x] === this.TILE_TYPES.SPAWN) {
                    return { x, y };
                }
            }
        }
        // Si pas de spawn défini, retourner centre
        return { 
            x: Math.floor(this.width / 2), 
            y: Math.floor(this.height / 2) 
        };
    }

    /**
     * Obtenir couleur selon type de tile (pour rendu)
     */
    getTileColor(x, y) {
        const tile = this.getTile(x, y);
        
        switch(tile) {
            case this.TILE_TYPES.EMPTY:
                return { fill: '#000', border: '#111' };
            case this.TILE_TYPES.FLOOR:
                return { fill: '#2a2a3e', border: '#3a3a4e' };
            case this.TILE_TYPES.WALL:
                // Murs ont rendu spécial selon voisins
                return this.getWallColor(x, y);
            case this.TILE_TYPES.DOOR:
                return { fill: '#4CAF50', border: '#2E7D32' };
            case this.TILE_TYPES.SPAWN:
                return { fill: '#4a0e4e', border: '#8b1a8b' };
            case this.TILE_TYPES.EXIT:
                return { fill: '#d4af37', border: '#f4d03f' };
            default:
                return { fill: '#000', border: '#111' };
        }
    }
    
    /**
     * Obtenir couleur spéciale pour un mur selon ses voisins
     */
    getWallColor(x, y) {
        // Vérifier s'il y a du sol walkable à côté
        const topIsWalkable = this.isWalkable(x, y - 1);
        const bottomIsWalkable = this.isWalkable(x, y + 1);
        const leftIsWalkable = this.isWalkable(x - 1, y);
        const rightIsWalkable = this.isWalkable(x + 1, y);
        
        return {
            fill: '#1a1a2e',
            border: '#8b0000',
            // Info pour rendering intelligent des bordures
            neighbors: {
                top: topIsWalkable,
                bottom: bottomIsWalkable,
                left: leftIsWalkable,
                right: rightIsWalkable
            }
        };
    }
}
