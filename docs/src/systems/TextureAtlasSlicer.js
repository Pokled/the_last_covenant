// ═══════════════════════════════════════════════════════════
// TEXTURE ATLAS SLICER
// Découpe une texture isométrique en tiles individuels
// ═══════════════════════════════════════════════════════════

export class TextureAtlasSlicer {
    constructor(imageSource, gridSize = 25) {
        this.imageSource = imageSource;
        this.gridSize = gridSize;
        this.image = null;
        this.loaded = false;
        this.tiles = [];
        this.floorTiles = [];
        this.wallTiles = [];
    }
    
    async load() {
        return new Promise((resolve, reject) => {
            console.log('🎨 Chargement texture atlas...');
            
            const img = new Image();
            
            img.onload = () => {
                this.image = img;
                this.loaded = true;
                console.log(`✅ Texture chargée: ${img.width}x${img.height}`);
                
                // Découper automatiquement
                this.sliceIntoTiles();
                
                resolve(this);
            };
            
            img.onerror = (err) => {
                console.error('❌ Erreur chargement texture:', err);
                reject(err);
            };
            
            img.src = this.imageSource;
        });
    }
    
    sliceIntoTiles() {
        console.log(`✂️ Découpage en ${this.gridSize}x${this.gridSize} tiles...`);
        
        const tileWidth = this.image.width / this.gridSize;
        const tileHeight = this.image.height / this.gridSize;
        
        // Créer un canvas temporaire pour extraire les tiles
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                // Dimensions du tile à extraire
                tempCanvas.width = tileWidth;
                tempCanvas.height = tileHeight;
                
                // Extraire la portion de l'image
                tempCtx.clearRect(0, 0, tileWidth, tileHeight);
                tempCtx.drawImage(
                    this.image,
                    x * tileWidth,
                    y * tileHeight,
                    tileWidth,
                    tileHeight,
                    0,
                    0,
                    tileWidth,
                    tileHeight
                );
                
                // Créer une image pour ce tile
                const tileImg = new Image();
                tileImg.src = tempCanvas.toDataURL();
                
                // Stocker avec métadonnées
                const tile = {
                    x: x,
                    y: y,
                    image: tileImg,
                    width: tileWidth,
                    height: tileHeight,
                    type: this.detectTileType(tempCtx, tileWidth, tileHeight)
                };
                
                this.tiles.push(tile);
                
                // Classifier par type
                if (tile.type === 'floor') {
                    this.floorTiles.push(tile);
                } else if (tile.type === 'wall') {
                    this.wallTiles.push(tile);
                }
            }
        }
        
        console.log(`✅ ${this.tiles.length} tiles créés`);
        console.log(`   📦 ${this.floorTiles.length} floor tiles`);
        console.log(`   🧱 ${this.wallTiles.length} wall tiles`);
    }
    
    // Détecte le type de tile basé sur la luminosité moyenne
    detectTileType(ctx, w, h) {
        const imageData = ctx.getImageData(0, 0, w, h);
        const pixels = imageData.data;
        
        let totalBrightness = 0;
        let opaquePixels = 0;
        
        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const a = pixels[i + 3];
            
            if (a > 10) { // Pixel non-transparent
                const brightness = (r + g + b) / 3;
                totalBrightness += brightness;
                opaquePixels++;
            }
        }
        
        if (opaquePixels === 0) return 'empty';
        
        const avgBrightness = totalBrightness / opaquePixels;
        
        // Classification basique
        if (avgBrightness < 60) return 'wall';
        if (avgBrightness > 120) return 'highlight'; // Torches, lumières
        return 'floor';
    }
    
    // Récupérer un tile spécifique
    getTile(x, y) {
        return this.tiles.find(t => t.x === x && t.y === y);
    }
    
    // Récupérer un tile floor aléatoire
    getRandomFloorTile() {
        if (this.floorTiles.length === 0) return null;
        return this.floorTiles[Math.floor(Math.random() * this.floorTiles.length)];
    }
    
    // Récupérer un tile wall aléatoire
    getRandomWallTile() {
        if (this.wallTiles.length === 0) return null;
        return this.wallTiles[Math.floor(Math.random() * this.wallTiles.length)];
    }
    
    // Exporter tous les tiles comme images téléchargeables (pour debug)
    exportTiles() {
        console.log('💾 Export des tiles...');
        
        this.tiles.forEach((tile, index) => {
            const link = document.createElement('a');
            link.download = `tile_${tile.x}_${tile.y}_${tile.type}.png`;
            link.href = tile.image.src;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
        
        console.log(`✅ ${this.tiles.length} tiles exportés`);
    }
}

// ═══════════════════════════════════════════════════════════
// PROCEDURAL TILEMAP GENERATOR
// Génère une tilemap procédurale en utilisant les tiles découpés
// ═══════════════════════════════════════════════════════════

export class ProceduralTilemap {
    constructor(atlas, gridSize = 25) {
        this.atlas = atlas;
        this.gridSize = gridSize;
        this.tilemap = [];
        this.generate();
    }
    
    generate() {
        console.log('🗺️ Génération tilemap procédurale...');
        
        // Créer une grille vide
        this.tilemap = Array(this.gridSize).fill(null).map(() => 
            Array(this.gridSize).fill(null)
        );
        
        // Remplir avec des tiles aléatoires
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                // Bordures = murs
                if (x < 2 || x >= this.gridSize - 2 || y < 2 || y >= this.gridSize - 2) {
                    this.tilemap[y][x] = {
                        type: 'wall',
                        tile: this.atlas.getRandomWallTile()
                    };
                } else {
                    // Intérieur = floor avec quelques obstacles
                    const isObstacle = Math.random() < 0.15;
                    
                    this.tilemap[y][x] = {
                        type: isObstacle ? 'wall' : 'floor',
                        tile: isObstacle 
                            ? this.atlas.getRandomWallTile() 
                            : this.atlas.getRandomFloorTile()
                    };
                }
            }
        }
        
        console.log('✅ Tilemap générée');
    }
    
    // Récupérer le tile à une position
    getTileAt(x, y) {
        if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) {
            return null;
        }
        return this.tilemap[y][x];
    }
    
    // Vérifier si une case est marchable
    isWalkable(x, y) {
        const tile = this.getTileAt(x, y);
        return tile && tile.type === 'floor';
    }
    
    // Régénérer la map
    regenerate() {
        this.generate();
    }
}

// ═══════════════════════════════════════════════════════════
// TILEMAP RENDERER
// Rendu d'une tilemap isométrique avec tiles découpés
// ═══════════════════════════════════════════════════════════

export class TilemapRenderer {
    constructor(canvas, tilemap) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.tilemap = tilemap;
        
        // Isometric config
        this.tileWidth = 64;
        this.tileHeight = 32;
        
        // Camera
        this.camera = {
            x: 0,
            y: 0,
            targetX: 0,
            targetY: 0,
            smoothing: 0.1
        };
        
        // UI
        this.hoveredTile = null;
        this.showGrid = false;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.render();
    }
    
    // Convertir grille → écran (isométrique)
    gridToScreen(gridX, gridY) {
        const isoX = (gridX - gridY) * (this.tileWidth / 2);
        const isoY = (gridX + gridY) * (this.tileHeight / 2);
        return { x: isoX, y: isoY };
    }
    
    // Convertir écran → grille
    screenToGrid(screenX, screenY) {
        const adjustedX = (screenX - this.canvas.width / 2 + this.camera.x) / window.ZOOM_LEVEL;
        const adjustedY = (screenY - this.canvas.height / 2 + this.camera.y) / window.ZOOM_LEVEL;
        
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
        
        // Transform
        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.scale(window.ZOOM_LEVEL || 1, window.ZOOM_LEVEL || 1);
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        // Render tiles
        this.renderTiles();
        
        // Render overlays
        if (this.showGrid) {
            this.renderGrid();
        }
        
        if (this.hoveredTile) {
            this.renderHover();
        }
        
        this.ctx.restore();
    }
    
    renderTiles() {
        const gridSize = this.tilemap.gridSize;
        
        // Render de bas en haut, gauche à droite (isometric sort)
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const tileData = this.tilemap.getTileAt(x, y);
                if (!tileData || !tileData.tile || !tileData.tile.image) continue;
                
                const pos = this.gridToScreen(x, y);
                const tile = tileData.tile;
                
                // Dessiner le tile (image découpée)
                this.ctx.drawImage(
                    tile.image,
                    pos.x - this.tileWidth / 2,
                    pos.y - this.tileHeight / 2,
                    this.tileWidth,
                    this.tileHeight
                );
            }
        }
    }
    
    renderGrid() {
        const gridSize = this.tilemap.gridSize;
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 1;
        
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                const pos = this.gridToScreen(x, y);
                this.drawIsoDiamond(pos.x, pos.y, this.tileWidth, this.tileHeight);
            }
        }
    }
    
    renderHover() {
        const pos = this.gridToScreen(this.hoveredTile.x, this.hoveredTile.y);
        this.ctx.strokeStyle = '#f4d03f';
        this.ctx.lineWidth = 3;
        this.drawIsoDiamond(pos.x, pos.y, this.tileWidth, this.tileHeight);
    }
    
    drawIsoDiamond(x, y, w, h) {
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
    
    center() {
        this.camera.targetX = 0;
        this.camera.targetY = 0;
    }
}
