/**
 * IsometricRenderer - Moteur de rendu isométrique avec grille DEBUG
 * @description Affiche grille, tiles, entités en vue isométrique
 */

export class IsometricRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Configuration isométrique (ZOOM AUGMENTÉ)
        this.tileWidth = 80;   // Augmenté de 64 → 80
        this.tileHeight = 40;  // Augmenté de 32 → 40
        
        // Caméra
        this.camera = {
            x: 0,
            y: 0
        };
        
        // Mode debug
        this.debugMode = true;
        this.showGrid = true;
        this.showCoords = true;
    }

    /**
     * Convertir coordonnées grille → écran isométrique
     */
    gridToScreen(gridX, gridY) {
        const screenX = (gridX - gridY) * (this.tileWidth / 2);
        const screenY = (gridX + gridY) * (this.tileHeight / 2);
        
        return {
            x: screenX - this.camera.x + this.canvas.width / 2,
            y: screenY - this.camera.y + this.canvas.height / 4
        };
    }

    /**
     * Convertir coordonnées écran → grille
     */
    screenToGrid(screenX, screenY) {
        // Ajuster pour caméra
        const x = screenX + this.camera.x - this.canvas.width / 2;
        const y = screenY + this.camera.y - this.canvas.height / 4;
        
        const gridX = (x / (this.tileWidth / 2) + y / (this.tileHeight / 2)) / 2;
        const gridY = (y / (this.tileHeight / 2) - x / (this.tileWidth / 2)) / 2;
        
        return {
            x: Math.floor(gridX),
            y: Math.floor(gridY)
        };
    }

    /**
     * Dessiner une tile isométrique
     */
    drawTile(gridX, gridY, color, borderColor = '#333') {
        const screen = this.gridToScreen(gridX, gridY);
        
        this.ctx.save();
        
        // Dessiner losange (tile iso)
        this.ctx.beginPath();
        this.ctx.moveTo(screen.x, screen.y); // Haut
        this.ctx.lineTo(screen.x + this.tileWidth / 2, screen.y + this.tileHeight / 2); // Droite
        this.ctx.lineTo(screen.x, screen.y + this.tileHeight); // Bas
        this.ctx.lineTo(screen.x - this.tileWidth / 2, screen.y + this.tileHeight / 2); // Gauche
        this.ctx.closePath();
        
        // Remplir
        this.ctx.fillStyle = color;
        this.ctx.fill();
        
        // Bordure (grille visible)
        if (this.showGrid) {
            this.ctx.strokeStyle = borderColor;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }
        
        // Si c'est un mur avec infos voisins, dessiner bordures spéciales
        if (typeof borderColor === 'object' && borderColor.neighbors) {
            const n = borderColor.neighbors;
            this.ctx.strokeStyle = '#ff0000';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            
            // Dessiner SEULEMENT les côtés qui touchent la salle
            // LOGIQUE INVERSÉE : Sol en bas → mur bloque PAR LE HAUT
            if (n.bottom) {
                // Sol en bas → ligne rouge en HAUT du losange (mur bloque par en haut)
                this.ctx.moveTo(screen.x - this.tileWidth / 2, screen.y + this.tileHeight / 2);
                this.ctx.lineTo(screen.x, screen.y);
                this.ctx.lineTo(screen.x + this.tileWidth / 2, screen.y + this.tileHeight / 2);
            }
            if (n.top) {
                // Sol en haut → ligne rouge en BAS du losange (mur bloque par en bas)
                this.ctx.moveTo(screen.x - this.tileWidth / 2, screen.y + this.tileHeight / 2);
                this.ctx.lineTo(screen.x, screen.y + this.tileHeight);
                this.ctx.lineTo(screen.x + this.tileWidth / 2, screen.y + this.tileHeight / 2);
            }
            if (n.right) {
                // Sol à droite → ligne rouge à GAUCHE du losange (mur bloque par la gauche)
                this.ctx.moveTo(screen.x, screen.y);
                this.ctx.lineTo(screen.x - this.tileWidth / 2, screen.y + this.tileHeight / 2);
                this.ctx.lineTo(screen.x, screen.y + this.tileHeight);
            }
            if (n.left) {
                // Sol à gauche → ligne rouge à DROITE du losange (mur bloque par la droite)
                this.ctx.moveTo(screen.x, screen.y);
                this.ctx.lineTo(screen.x + this.tileWidth / 2, screen.y + this.tileHeight / 2);
                this.ctx.lineTo(screen.x, screen.y + this.tileHeight);
            }
            
            this.ctx.stroke();
        }
        
        // Coordonnées (debug)
        if (this.showCoords && this.debugMode) {
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '10px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`${gridX},${gridY}`, screen.x, screen.y + this.tileHeight / 2);
        }
        
        this.ctx.restore();
    }

    /**
     * Dessiner une entité (joueur, ennemi, etc.)
     */
    drawEntity(gridX, gridY, color = '#4CAF50', size = 20) {
        const screen = this.gridToScreen(gridX, gridY);
        
        this.ctx.save();
        
        // Ombre
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.beginPath();
        this.ctx.ellipse(
            screen.x, 
            screen.y + this.tileHeight - 5, 
            size * 0.6, 
            size * 0.3, 
            0, 0, Math.PI * 2
        );
        this.ctx.fill();
        
        // Entité (cercle)
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(
            screen.x, 
            screen.y + this.tileHeight / 2 - size / 2, 
            size, 
            0, Math.PI * 2
        );
        this.ctx.fill();
        
        // Bordure
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        this.ctx.restore();
    }

    /**
     * Dessiner une grille complète
     */
    drawGrid(width, height, getTileColor) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Fond
        this.ctx.fillStyle = '#0a0a0f';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dessiner tiles (de l'arrière vers l'avant pour bon ordre)
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const tileColor = getTileColor(x, y);
                // Passer l'objet complet (peut contenir neighbors)
                this.drawTile(x, y, tileColor.fill, tileColor.neighbors ? tileColor : tileColor.border);
            }
        }
    }

    /**
     * Centrer caméra sur position
     */
    centerCamera(gridX, gridY) {
        const screen = this.gridToScreen(gridX, gridY);
        this.camera.x = screen.x - this.canvas.width / 2 + this.camera.x;
        this.camera.y = screen.y - this.canvas.height / 2 + this.camera.y;
    }

    /**
     * Toggle debug mode
     */
    toggleDebug() {
        this.debugMode = !this.debugMode;
    }

    toggleGrid() {
        this.showGrid = !this.showGrid;
    }

    toggleCoords() {
        this.showCoords = !this.showCoords;
    }
}
