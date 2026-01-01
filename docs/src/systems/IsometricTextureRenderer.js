// ═══════════════════════════════════════════════════════════
// ISOMETRIC RENDERER WITH TEXTURE SUPPORT
// Système de rendu isométrique avec support de textures réelles
// ═══════════════════════════════════════════════════════════

export class IsometricTextureRenderer {
    constructor(canvas, grid) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.grid = grid;
        
        // Configuration isométrique
        this.tileWidth = 160;
        this.tileHeight = 80;
        
        // Caméra
        this.camera = {
            x: 0,
            y: 0,
            targetX: 0,
            targetY: 0,
            smoothing: 0.1
        };
        
        // UI State
        this.hoveredTile = null;
        this.path = null;
        this.moveRange = [];
        this.showGrid = true;
        this.showCoords = true;
        
        // Textures
        this.textures = {
            roomBase: null,
            loaded: false
        };
        
        // Charger les textures
        this.loadTextures();
        
        // Resize handler
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }
    
    loadTextures() {
        console.log('🎨 Chargement des textures...');
        
        // Charger l'image de la salle complète
        const roomImage = new Image();
        roomImage.onload = () => {
            this.textures.roomBase = roomImage;
            this.textures.loaded = true;
            console.log('✅ Texture chargée:', roomImage.width, 'x', roomImage.height);
            this.render();
        };
        roomImage.onerror = () => {
            console.error('❌ Erreur de chargement de la texture');
        };
        roomImage.src = 'assets/images/combat/tiles/_c27c40ed-52af-4b39-83ca-e385d55d40bd.jpg';
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.render();
    }
    
    // Convertir coordonnées grille → écran (isométrique)
    gridToScreen(gridX, gridY) {
        const isoX = (gridX - gridY) * (this.tileWidth / 2);
        const isoY = (gridX + gridY) * (this.tileHeight / 2);
        return { x: isoX, y: isoY };
    }
    
    // Convertir coordonnées écran → grille
    screenToGrid(screenX, screenY) {
        // Ajuster pour caméra et zoom
        const adjustedX = (screenX - this.canvas.width / 2 + this.camera.x) / window.ZOOM_LEVEL;
        const adjustedY = (screenY - this.canvas.height / 2 + this.camera.y) / window.ZOOM_LEVEL;
        
        // Formules inverses isométriques
        const gridX = Math.floor((adjustedX / (this.tileWidth / 2) + adjustedY / (this.tileHeight / 2)) / 2);
        const gridY = Math.floor((adjustedY / (this.tileHeight / 2) - adjustedX / (this.tileWidth / 2)) / 2);
        
        return { x: gridX, y: gridY };
    }
    
    render() {
        // Clear
        this.ctx.fillStyle = '#0a0a0f';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Smooth camera
        this.camera.x += (this.camera.targetX - this.camera.x) * this.camera.smoothing;
        this.camera.y += (this.camera.targetY - this.camera.y) * this.camera.smoothing;
        
        // Setup transform
        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.scale(window.ZOOM_LEVEL || 1, window.ZOOM_LEVEL || 1);
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        // Rendu selon si textures chargées ou non
        if (this.textures.loaded && this.textures.roomBase) {
            this.renderWithTexture();
        } else {
            this.renderFallback();
        }
        
        // Render UI overlays (grille, path, entities)
        this.renderOverlays();
        
        this.ctx.restore();
    }
    
    renderWithTexture() {
        const img = this.textures.roomBase;
        
        // Calculer la position centrale pour dessiner l'image
        const gridSize = window.GRID_SIZE || 25;
        const centerX = 0;
        const centerY = 0;
        
        // L'image contient déjà la projection isométrique
        // On la dessine centrée
        const scale = 3; // Ajuster selon besoin
        const imgW = img.width * scale;
        const imgH = img.height * scale;
        
        this.ctx.drawImage(
            img,
            centerX - imgW / 2,
            centerY - imgH / 2,
            imgW,
            imgH
        );
    }
    
    renderFallback() {
        // Rendu par défaut (couleurs simples) si pas de texture
        const gridSize = this.grid.length;
        
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const pos = this.gridToScreen(x, y);
                const tileType = this.grid[y][x];
                
                // Skip empty tiles
                if (tileType === 0) continue;
                
                // Couleur selon type
                let color = '#6b5442'; // FLOOR
                if (tileType === 2) color = '#3d3429'; // OBSTACLE
                
                this.drawIsometricTile(pos.x, pos.y, this.tileWidth, this.tileHeight, color);
            }
        }
    }
    
    renderOverlays() {
        const gridSize = this.grid.length;
        
        // 1. Highlight move range
        if (this.moveRange && this.moveRange.length > 0) {
            this.ctx.fillStyle = 'rgba(74, 144, 226, 0.2)';
            this.moveRange.forEach(tile => {
                const pos = this.gridToScreen(tile.x, tile.y);
                this.drawIsometricTile(pos.x, pos.y, this.tileWidth, this.tileHeight);
            });
        }
        
        // 2. Hover tile
        if (this.hoveredTile) {
            const pos = this.gridToScreen(this.hoveredTile.x, this.hoveredTile.y);
            this.ctx.strokeStyle = '#f4d03f';
            this.ctx.lineWidth = 3;
            this.drawIsometricTileOutline(pos.x, pos.y, this.tileWidth, this.tileHeight);
        }
        
        // 3. Path
        if (this.path && this.path.length > 1) {
            this.ctx.strokeStyle = '#4a90e2';
            this.ctx.lineWidth = 4;
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
            
            this.ctx.beginPath();
            for (let i = 0; i < this.path.length; i++) {
                const pos = this.gridToScreen(this.path[i].x, this.path[i].y);
                if (i === 0) {
                    this.ctx.moveTo(pos.x, pos.y);
                } else {
                    this.ctx.lineTo(pos.x, pos.y);
                }
            }
            this.ctx.stroke();
        }
        
        // 4. Entities (player, enemies, chests)
        this.renderEntities();
        
        // 5. Grid (optionnel)
        if (this.showGrid) {
            this.renderGrid();
        }
    }
    
    renderEntities() {
        const gridSize = this.grid.length;
        
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const tileType = this.grid[y][x];
                const pos = this.gridToScreen(x, y);
                
                // Player
                if (tileType === 3) {
                    this.drawEntity(pos.x, pos.y, '🛡️', '#4a90e2', 60);
                }
                
                // Enemy
                if (tileType === 4) {
                    this.drawEntity(pos.x, pos.y, '👹', '#d14343', 50);
                }
            }
        }
        
        // Chests
        if (window.game && window.game.chests) {
            window.game.chests.forEach(chest => {
                const pos = this.gridToScreen(chest.x, chest.y);
                const icon = chest.opened ? '📭' : '📦';
                this.drawEntity(pos.x, pos.y, icon, '#f4d03f', 50);
            });
        }
    }
    
    drawEntity(x, y, emoji, bgColor, size) {
        // Ombre
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        this.ctx.beginPath();
        this.ctx.ellipse(x, y + size / 2 + 5, size / 2, size / 6, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Background circle
        this.ctx.fillStyle = bgColor;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Border
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // Emoji
        this.ctx.font = `${size * 0.6}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(emoji, x, y);
    }
    
    renderGrid() {
        const gridSize = this.grid.length;
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const pos = this.gridToScreen(x, y);
                this.drawIsometricTileOutline(pos.x, pos.y, this.tileWidth, this.tileHeight);
                
                // Coords
                if (this.showCoords) {
                    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    this.ctx.font = '12px monospace';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(`${x},${y}`, pos.x, pos.y);
                }
            }
        }
    }
    
    drawIsometricTile(x, y, w, h, fillColor = null) {
        const halfW = w / 2;
        const halfH = h / 2;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - halfH);      // Top
        this.ctx.lineTo(x + halfW, y);      // Right
        this.ctx.lineTo(x, y + halfH);      // Bottom
        this.ctx.lineTo(x - halfW, y);      // Left
        this.ctx.closePath();
        
        if (fillColor) {
            this.ctx.fillStyle = fillColor;
            this.ctx.fill();
        }
    }
    
    drawIsometricTileOutline(x, y, w, h) {
        const halfW = w / 2;
        const halfH = h / 2;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - halfH);
        this.ctx.lineTo(x + halfW, y);
        this.ctx.lineTo(x, y + halfH);
        this.ctx.lineTo(x - halfW, y);
        this.ctx.closePath();
        this.ctx.stroke();
    }
    
    centerOnPlayer() {
        const gridSize = this.grid.length;
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                if (this.grid[y][x] === 3) { // PLAYER
                    const screen = this.gridToScreen(x, y);
                    this.camera.targetX = screen.x;
                    this.camera.targetY = screen.y;
                    return;
                }
            }
        }
    }
}
