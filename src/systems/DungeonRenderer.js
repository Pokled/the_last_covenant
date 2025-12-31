/**
 * Rendu visuel du donjon généré - ISOMÉTRIQUE V2
 * Affichage correct avec murs élevés et culling fixé
 */

export class DungeonRenderer {
    constructor(canvas, dungeon) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.dungeon = dungeon;
        
        // Paramètres isométriques (Vue 3/4 inclinée - 3:1 ratio)
        this.tileWidth = 48;   // Réduit pour voir plus large
        this.tileHeight = 36;  // Augmenté pour élévation
        this.wallHeight = 48;  // Hauteur murs proportionnelle
        
        this.camera = {
            x: 0,
            y: 0,
            targetX: 0,      // Position cible (joueur)
            targetY: 0,
            smoothness: 0.02, // Vitesse de suivi (0.02 = très lent et smooth)
            scale: 2.8,        // x2 du précédent (1.4 * 2)
            targetScale: 2.8,  // Cible initiale cohérente
            minScale: 2.4,     // x2 du précédent (1.2 * 2)
            maxScale: 3.6      // x2 du précédent (1.8 * 2)
        };
        
        // Couleurs DIABLO (palette lugubre)
        this.colors = {
            floor: '#1a1510',        // Brun très sombre
            floorDark: '#0f0c08',    // Presque noir
            wallFront: '#2d2416',    // Gris-brun
            wallLeft: '#1a1510',     // Ombre profonde
            wallRight: '#0f0c08',    // Noir profond
            wallTop: '#3a2f1f',      // Brun pierre
            start: '#4a9eff',
            exit: '#ff4a4a',
            treasure: '#ffd700',
            enemy: '#8b0000',        // Rouge sang
            player: '#d4883e',       // Orange torche
            fogOfWar: 'rgba(0, 0, 0, 0.95)',  // Brouillard ultra dense
            torchLight: '#ff8c00'    // Lueur torche
        };
        
        this.playerPos = this.findStartPosition();
        this.animationFrame = 0;
        this.needsRedraw = true;
        
        // Position actuelle et cible du joueur (pour smooth movement)
        this.playerTarget = { x: this.playerPos.x, y: this.playerPos.y };
        this.playerSmooth = { x: this.playerPos.x, y: this.playerPos.y };
        this.playerSmoothSpeed = 0.2;  // Vitesse d'interpolation (0.2 = assez rapide)
        
        // Initialise la caméra sur le joueur immédiatement
        const playerIso = this.toIso(this.playerPos.x, this.playerPos.y);
        this.camera.x = playerIso.x;
        this.camera.y = playerIso.y;
        this.camera.targetX = playerIso.x;
        this.camera.targetY = playerIso.y;
        
        // Cache pour frustum culling
        this.visibleTiles = new Set();
        
        // FOG OF WAR - Exploration progressive
        this.exploredTiles = new Set();
        this.visionRadius = 5;  // Rayon de vision du joueur (5 tuiles)
        
        // SYSTÈME DE PARTICULES (poussière)
        this.particles = [];
        this.initParticles(150);  // 150 particules de poussière
        
        // LIGHTING (effet torche)
        this.lightFlicker = 0;
        
        // TEXTURES PROCÉDURALES - Générées au démarrage pour perfs
        this.floorDetails = this.generateFloorDetails();  // Fissures, taches
        this.wallDetails = this.generateWallDetails();    // Cracks, mousse
        this.debris = this.generateDebris();              // Débris éparpillés
    }
    
    /**
     * Génère les détails de sol (fissures, taches) pour chaque tuile
     */
    generateFloorDetails() {
        const details = new Map();
        const seed = this.dungeon.seed || Date.now();
        
        // RNG déterministe basé sur seed
        const seededRandom = (x, y) => {
            const hash = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
            return hash - Math.floor(hash);
        };
        
        for (let y = 0; y < this.dungeon.height; y++) {
            for (let x = 0; x < this.dungeon.width; x++) {
                const tile = this.dungeon.grid[y][x];
                
                // Seulement pour les sols (pas murs)
                if (tile !== 0 && tile !== -1) {
                    const rand = seededRandom(x, y);
                    
                    details.set(`${x},${y}`, {
                        // Fissures (30% de chance)
                        hasCrack: rand < 0.3,
                        crackAngle: seededRandom(x + 100, y) * Math.PI * 2,
                        crackLength: seededRandom(x + 200, y) * 15 + 5,
                        
                        // Taches sombres (40% de chance)
                        hasStain: rand > 0.6,
                        stainSize: seededRandom(x + 300, y) * 8 + 3,
                        stainOffsetX: (seededRandom(x + 400, y) - 0.5) * 10,
                        stainOffsetY: (seededRandom(x + 500, y) - 0.5) * 10,
                        
                        // Variation hauteur (relief subtil)
                        heightOffset: seededRandom(x + 600, y) * 2 - 1  // -1 à +1
                    });
                }
            }
        }
        
        return details;
    }
    
    /**
     * Génère les détails de murs (cracks, mousse)
     */
    generateWallDetails() {
        const details = new Map();
        const seed = this.dungeon.seed || Date.now();
        
        const seededRandom = (x, y) => {
            const hash = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
            return hash - Math.floor(hash);
        };
        
        for (let y = 0; y < this.dungeon.height; y++) {
            for (let x = 0; x < this.dungeon.width; x++) {
                const tile = this.dungeon.grid[y][x];
                
                // Seulement pour les murs
                if (tile === 0) {
                    const rand = seededRandom(x, y);
                    
                    // 60% de chance d'avoir la hauteur standard (pas de variation)
                    // 40% de chance d'avoir une variation
                    const hasVariation = rand > 0.6;
                    
                    details.set(`${x},${y}`, {
                        // Cracks verticaux (25% de chance)
                        hasCrack: rand < 0.25,
                        crackOffset: seededRandom(x + 100, y) * 20 - 10,
                        
                        // Variation de hauteur (60% restent à 0, 40% varient)
                        heightVariation: hasVariation ? (seededRandom(x + 500, y) * 5 - 3) : 0
                    });
                }
            }
        }
        
        return details;
    }
    
    /**
     * Génère les débris/gravats éparpillés
     */
    generateDebris() {
        const debris = [];
        const seed = this.dungeon.seed || Date.now();
        
        const seededRandom = (x, y) => {
            const hash = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
            return hash - Math.floor(hash);
        };
        
        // Place ~50 débris aléatoires dans le donjon
        for (let i = 0; i < 50; i++) {
            const x = Math.floor(seededRandom(i * 10, 0) * this.dungeon.width);
            const y = Math.floor(seededRandom(i * 10, 100) * this.dungeon.height);
            const tile = this.dungeon.grid[y]?.[x];
            
            // Seulement sur les sols
            if (tile && tile !== 0 && tile !== -1) {
                debris.push({
                    gridX: x,
                    gridY: y,
                    offsetX: (seededRandom(i, 200) - 0.5) * 15,
                    offsetY: (seededRandom(i, 300) - 0.5) * 10,
                    size: seededRandom(i, 400) * 3 + 2,
                    type: Math.floor(seededRandom(i, 500) * 3)  // 0=pierre, 1=os, 2=métal
                });
            }
        }
        
        return debris;
    }
    
    /**
     * Initialise les particules de poussière (effet Diablo)
     */
    initParticles(count) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.8,       // 0.8-2.8px (plus visibles)
                speedX: (Math.random() - 0.5) * 1.2, // Drift plus rapide
                speedY: Math.random() * 0.8 - 1.2,   // Monte plus vite
                alpha: Math.random() * 0.4 + 0.2,    // 20-60% opacité (plus visibles)
                lifetime: Math.random() * 300 + 150  // Durée vie plus longue
            });
        }
    }
    
    /**
     * Met à jour les particules
     */
    updateParticles() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.particles.forEach((p, index) => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.lifetime--;
            
            // Recycle si hors écran ou morte
            if (p.lifetime <= 0 || p.x < -50 || p.x > this.canvas.width + 50 || 
                p.y < -50 || p.y > this.canvas.height + 50) {
                // Réapparaît dans un rayon plus large
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 400 + 100;  // Rayon élargi
                p.x = centerX + Math.cos(angle) * distance;
                p.y = centerY + Math.sin(angle) * distance;
                p.speedX = (Math.random() - 0.5) * 1.2;
                p.speedY = Math.random() * 0.8 - 1.2;
                p.lifetime = Math.random() * 300 + 150;
                p.alpha = Math.random() * 0.4 + 0.2;
            }
        });
    }
    
    /**
     * Trouve la position de départ
     */
    findStartPosition() {
        for (let y = 0; y < this.dungeon.height; y++) {
            for (let x = 0; x < this.dungeon.width; x++) {
                if (this.dungeon.grid[y][x] === 3) {
                    return { x, y };
                }
            }
        }
        
        if (this.dungeon.rooms && this.dungeon.rooms.length > 0) {
            const firstRoom = this.dungeon.rooms[0];
            return {
                x: Math.floor(firstRoom.x + firstRoom.width / 2),
                y: Math.floor(firstRoom.y + firstRoom.height / 2)
            };
        }
        
        return { x: 25, y: 25 };
    }
    
    /**
     * Convertit coordonnées grille vers isométrique
     * Vue inclinée (dimetric) : ratio 3:1 pour meilleure visibilité largeur
     */
    toIso(x, y, z = 0) {
        // Projection dimetric modifiée pour plus de hauteur
        return {
            x: (x - y) * (this.tileWidth / 2),
            y: (x + y) * (this.tileHeight / 3) - z  // Division par 3 pour vue plus haute
        };
    }
    
    /**
     * Convertit avec offset pour centrer sur la tuile
     */
    toIsoCentered(x, y, z = 0) {
        const iso = this.toIso(x, y, z);
        // Centre sur la tuile (milieu du losange) - ajusté pour nouveau ratio
        iso.y += this.tileHeight / 3;
        return iso;
    }
    
    /**
     * Vérifie si un point (worldX, worldY) est dans le losange d'une tuile
     */
    isPointInTile(worldX, worldY, gridX, gridY) {
        const iso = this.toIso(gridX, gridY);
        const hw = this.tileWidth / 2;
        const hh = this.tileHeight / 3;
        
        // Le losange va de y (haut) à y + 2*hh (bas)
        // Points: (x, y), (x+hw, y+hh), (x, y+2hh), (x-hw, y+hh)
        
        // Coordonnées relatives
        const dx = worldX - iso.x;
        const dy = worldY - iso.y;
        
        // Test des 4 demi-plans du losange avec marge plus généreuse
        const ratio = hh / hw;
        const absDx = Math.abs(dx);
        const margin = 5; // Marge plus généreuse pour meilleure détection
        
        return dy >= absDx * ratio - margin &&              // Au-dessus de la ligne haut
               dy <= 2 * hh - absDx * ratio + margin;       // En-dessous de la ligne bas
    }
    
    /**
     * Convertit coordonnées écran vers coordonnées grille
     */
    screenToGrid(screenX, screenY) {
        // Ajuster selon la caméra et le zoom
        const worldX = (screenX - this.canvas.width / 2) / this.camera.scale + this.camera.x;
        const worldY = (screenY - this.canvas.height / 2) / this.camera.scale + this.camera.y;
        
        // Conversion isométrique inverse (approximation)
        // Utilise le ratio 3:1 (tileHeight / 3) pour correspondre à toIso()
        const gridX = Math.round((worldX / (this.tileWidth / 2) + worldY / (this.tileHeight / 3)) / 2);
        const gridY = Math.round((worldY / (this.tileHeight / 3) - worldX / (this.tileWidth / 2)) / 2);
        
        // Teste la tuile approximative et ses 4 voisines pour trouver la vraie tuile
        const candidates = [
            { x: gridX, y: gridY },
            { x: gridX - 1, y: gridY },
            { x: gridX + 1, y: gridY },
            { x: gridX, y: gridY - 1 },
            { x: gridX, y: gridY + 1 }
        ];
        
        for (const candidate of candidates) {
            if (candidate.x >= 0 && candidate.x < this.dungeon.width && 
                candidate.y >= 0 && candidate.y < this.dungeon.height &&
                this.isPointInTile(worldX, worldY, candidate.x, candidate.y)) {
                return { x: candidate.x, y: candidate.y };
            }
        }
        
        return null;
    }
    
    /**
     * Met à jour la position smooth du joueur
     */
    updatePlayerSmooth() {
        // Lerp vers la position cible
        this.playerSmooth.x += (this.playerTarget.x - this.playerSmooth.x) * this.playerSmoothSpeed;
        this.playerSmooth.y += (this.playerTarget.y - this.playerSmooth.y) * this.playerSmoothSpeed;
    }
    
    /**
     * Centre la caméra sur le joueur avec smooth lerp (springArm style)
     */
    centerCameraOnPlayer() {
        // Utilise la position SMOOTH du joueur
        const playerIso = this.toIso(this.playerSmooth.x, this.playerSmooth.y);
        
        // Met à jour la cible
        this.camera.targetX = playerIso.x;
        this.camera.targetY = playerIso.y;
        
        // Interpolation linéaire (lerp) vers la cible
        this.camera.x += (this.camera.targetX - this.camera.x) * this.camera.smoothness;
        this.camera.y += (this.camera.targetY - this.camera.y) * this.camera.smoothness;
    }
    
    /**
     * Rendu principal - Optimisé avec culling et fog of war
     */
    render() {
        if (!this.needsRedraw) return;
        
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // CRITIQUE : Met à jour le smooth du joueur AVANT le reste
        this.updatePlayerSmooth();
        
        this.centerCameraOnPlayer();
        this.updateExploredArea();  // Met à jour l'exploration
        this.animationFrame++;
        
        // Smooth zoom
        const wasZooming = Math.abs(this.camera.targetScale - this.camera.scale) > 0.01;
        this.camera.scale += (this.camera.targetScale - this.camera.scale) * 0.2;
        
        this.ctx.save();
        
        // Centre et applique le zoom
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        this.ctx.translate(centerX, centerY);
        this.ctx.scale(this.camera.scale, this.camera.scale);
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        // Calcul des tuiles visibles (frustum culling)
        this.calculateVisibleTiles();
        
        // RENDU ISOMÉTRIQUE CORRECT : Painter's algorithm (arrière vers avant)
        // On trie par profondeur iso (x+y) pour ordre de dessin correct
        
        // 1. Convertit visibleTiles en array trié par profondeur isométrique
        const sortedTiles = Array.from(this.visibleTiles)
            .map(key => {
                const [x, y] = key.split(',').map(Number);
                return { x, y, depth: x + y };  // Profondeur iso
            })
            .filter(tile => this.isExplored(tile.x, tile.y))
            .sort((a, b) => a.depth - b.depth);  // Du fond vers l'avant
        
        // 2. Ajoute le joueur dans la liste triée
        const playerDepth = this.playerPos.x + this.playerPos.y;
        const renderList = [
            ...sortedTiles,
            { x: this.playerPos.x, y: this.playerPos.y, depth: playerDepth, isPlayer: true }
        ].sort((a, b) => a.depth - b.depth);
        
        // 3. Détecte les murs qui occultent le joueur (pour transparence)
        const occludingWalls = this.getOccludingWalls();
        
        // 4. Rendu dans l'ordre de profondeur (du fond vers l'avant)
        renderList.forEach(item => {
            if (item.isPlayer) {
                // Dessine le joueur
                this.drawPlayer();
            } else {
                const tile = this.dungeon.grid[item.y][item.x];
                
                // Ignore les tuiles vides (-1 = murs supprimés par optimisation)
                if (tile === -1) return;
                
                // Dessine le sol
                if (tile !== 0 && tile !== -1) {
                    this.drawFloor(item.x, item.y);
                }
                
                // Dessine le mur OU l'icône
                if (tile === 0) {
                    const isOccluding = occludingWalls.has(`${item.x},${item.y}`);
                    this.drawWall(item.x, item.y, isOccluding);
                } else if (tile > 2) {
                    this.drawTileIcon(item.x, item.y, tile);
                }
            }
        });
        
        // DICE SYSTEM : Affiche les cases accessibles (après les sols, avant débris)
        if (this.diceSystem) {
            this.diceSystem.drawReachableTiles(this.ctx);
        }
        
        // DÉBRIS (après sols, avant fog of war)
        this.drawDebris();
        
        // Dessine le FOG OF WAR sur les zones non explorées
        this.drawFogOfWar();
        
        // LIGHTING : Halo lumineux autour du joueur (torche)
        this.drawTorchLight();
        
        this.ctx.restore();
        
        // PARTICULES de poussière (après restore pour ignorer zoom)
        this.updateParticles();
        this.drawParticles();
        
        // VIGNETTAGE NOIR (angoisse Diablo)
        this.drawVignette();
        
        // UI
        // this.drawMinimap();  // DÉSACTIVÉ pour test-dungeon-progression.html
        this.drawZoomInfo();
        
        // DEBUG (après vignettage pour être visible)
        // this.drawDebugInfo();  // DÉSACTIVÉ pour test-dungeon-progression.html
        
        // ICÔNES D'ÉVÉNEMENTS sur les salles
        this.drawEventIcons();
        
        // TOUJOURS redessiner pour les particules et le flicker de lumière
        this.needsRedraw = true;
    }
    
    /**
     * Détecte les murs qui occultent le joueur (devant lui en vue iso)
     */
    getOccludingWalls() {
        const occludingWalls = new Set();
        const px = this.playerPos.x;
        const py = this.playerPos.y;
        
        // En isométrique, les murs "devant" (plus proche caméra) ont une profondeur iso SUPÉRIEURE
        // Profondeur iso = x + y
        const playerDepth = px + py;
        
        // Cherche les murs avec profondeur supérieure (devant le joueur)
        // ET proches visuellement (dans un rayon de 3 tuiles)
        for (let y = 0; y < this.dungeon.height; y++) {
            for (let x = 0; x < this.dungeon.width; x++) {
                if (this.dungeon.grid[y][x] === 0) {  // C'est un mur
                    const wallDepth = x + y;
                    
                    // Le mur est devant le joueur (profondeur supérieure)
                    if (wallDepth > playerDepth) {
                        // ET proche du joueur (rayon 3)
                        const distance = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
                        if (distance <= 3) {
                            occludingWalls.add(`${x},${y}`);
                        }
                    }
                }
            }
        }
        
        return occludingWalls;
    }
    
    /**
     * Met à jour les zones explorées autour du joueur
     */
    updateExploredArea() {
        const px = this.playerPos.x;
        const py = this.playerPos.y;
        
        // Vision circulaire autour du joueur
        for (let dy = -this.visionRadius; dy <= this.visionRadius; dy++) {
            for (let dx = -this.visionRadius; dx <= this.visionRadius; dx++) {
                const x = px + dx;
                const y = py + dy;
                
                // Distance euclidienne
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist <= this.visionRadius) {
                    this.exploredTiles.add(`${x},${y}`);
                }
            }
        }
    }
    
    /**
     * Vérifie si une tuile a été explorée
     */
    isExplored(x, y) {
        return this.exploredTiles.has(`${x},${y}`);
    }
    
    /**
     * Dessine le brouillard sur les zones non explorées
     */
    drawFogOfWar() {
        this.visibleTiles.forEach(key => {
            const [x, y] = key.split(',').map(Number);
            
            if (!this.isExplored(x, y)) {
                const iso = this.toIso(x, y);
                const hw = this.tileWidth / 2;
                const hh = this.tileHeight / 3;
                
                this.ctx.beginPath();
                this.ctx.moveTo(iso.x, iso.y);
                this.ctx.lineTo(iso.x + hw, iso.y + hh);
                this.ctx.lineTo(iso.x, iso.y + hh * 2);
                this.ctx.lineTo(iso.x - hw, iso.y + hh);
                this.ctx.closePath();
                
                this.ctx.fillStyle = this.colors.fogOfWar;
                this.ctx.fill();
            }
        });
    }
    
    /**
     * Dessine le halo lumineux de torche autour du joueur (Diablo style)
     * Dessiné DANS le contexte world transformé (avant restore)
     */
    drawTorchLight() {
        // Position du joueur SMOOTH en coordonnées isométriques world
        const playerIso = this.toIsoCentered(this.playerSmooth.x, this.playerSmooth.y);
        
        // Ajuste pour l'élévation du joueur (milieu du corps)
        const bob = Math.sin(this.animationFrame * 0.05) * 3;
        const playerHeight = 28;
        const elevation = 5 + bob;
        const worldY = playerIso.y - elevation - (playerHeight / 2);
        
        // Effet de tremblement (flicker)
        this.lightFlicker = Math.sin(this.animationFrame * 0.1) * 8 + Math.random() * 4;
        const radius = 100 + this.lightFlicker;  // En unités world (pas scaled)
        
        // Gradient radial en COORDONNÉES WORLD (le ctx est déjà transformé)
        const gradient = this.ctx.createRadialGradient(
            playerIso.x, worldY, 0,
            playerIso.x, worldY, radius
        );
        
        gradient.addColorStop(0, 'rgba(255, 140, 0, 0.35)');
        gradient.addColorStop(0.2, 'rgba(255, 100, 0, 0.15)');
        gradient.addColorStop(0.5, 'rgba(50, 30, 10, 0.05)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        this.ctx.fillStyle = gradient;
        
        // Rectangle en world space (sera transformé par le contexte)
        const margin = radius * 1.5;
        this.ctx.fillRect(
            playerIso.x - margin, 
            worldY - margin,
            margin * 2,
            margin * 2
        );
    }
    
    /**
     * Dessine les particules de poussière
     */
    drawParticles() {
        this.ctx.save();
        
        this.particles.forEach(p => {
            this.ctx.fillStyle = `rgba(200, 180, 150, ${p.alpha})`;  // Beige poussiéreux
            this.ctx.fillRect(p.x, p.y, p.size, p.size);
        });
        
        this.ctx.restore();
    }
    
    /**
     * Vignettage noir radial (angoisse Diablo) - PLUS SOMBRE
     */
    drawVignette() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const maxRadius = Math.max(this.canvas.width, this.canvas.height) * 0.6;  // Réduit pour obscurité plus proche
        
        const gradient = this.ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, maxRadius
        );
        
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');       // Transparent au centre
        gradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.5)');   // Assombrissement plus rapide
        gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.85)');  // Fort assombrissement
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.98)');    // Presque noir total
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Calcule les tuiles visibles (frustum culling)
     */
    calculateVisibleTiles() {
        this.visibleTiles.clear();
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Marge pour être sûr de tout afficher
        const margin = 5;
        
        for (let y = 0; y < this.dungeon.height; y++) {
            for (let x = 0; x < this.dungeon.width; x++) {
                const tile = this.dungeon.grid[y][x];
                
                // Ignore les tuiles vides (-1 = optimisation)
                if (tile === -1) continue;
                
                const iso = this.toIso(x, y);
                const screenX = (iso.x - this.camera.x) * this.camera.scale + centerX;
                const screenY = (iso.y - this.camera.y) * this.camera.scale + centerY;
                
                // Check si dans l'écran
                if (screenX > -this.tileWidth * margin * this.camera.scale && 
                    screenX < this.canvas.width + this.tileWidth * margin * this.camera.scale &&
                    screenY > -this.wallHeight * margin * this.camera.scale && 
                    screenY < this.canvas.height + this.wallHeight * margin * this.camera.scale) {
                    this.visibleTiles.add(`${x},${y}`);
                }
            }
        }
    }
    
    /**
     * Contrôle du zoom
     */
    zoom(delta) {
        this.camera.targetScale = Math.max(
            this.camera.minScale,
            Math.min(this.camera.maxScale, this.camera.targetScale + delta)
        );
        this.needsRedraw = true;
    }
    
    /**
     * Info zoom
     */
    drawZoomInfo() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.font = '12px monospace';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(
            `Zoom: ${(this.camera.scale * 100).toFixed(0)}%`,
            this.canvas.width - 170,
            25
        );
    }
    
    /**
     * Dessine un sol (losange plat) avec textures procédurales
     */
    drawFloor(gridX, gridY) {
        const iso = this.toIso(gridX, gridY);
        const hw = this.tileWidth / 2;
        const hh = this.tileHeight / 3;  // Ajusté pour nouveau ratio
        
        // Récupère les détails de cette tuile
        const details = this.floorDetails.get(`${gridX},${gridY}`);
        
        this.ctx.save();
        
        // Clip le losange pour que les détails restent à l'intérieur
        this.ctx.beginPath();
        this.ctx.moveTo(iso.x, iso.y);
        this.ctx.lineTo(iso.x + hw, iso.y + hh);
        this.ctx.lineTo(iso.x, iso.y + hh * 2);
        this.ctx.lineTo(iso.x - hw, iso.y + hh);
        this.ctx.closePath();
        this.ctx.clip();
        
        // Sol de base (gradient)
        const gradient = this.ctx.createLinearGradient(
            iso.x - hw, iso.y, 
            iso.x + hw, iso.y
        );
        
        // Variation de hauteur (relief subtil)
        const heightVariation = details?.heightOffset || 0;
        const brightnessFactor = 1 + (heightVariation * 0.1);  // ±10% luminosité
        
        const baseColor = this.adjustBrightness(this.colors.floor, brightnessFactor);
        const darkColor = this.adjustBrightness(this.colors.floorDark, brightnessFactor);
        
        gradient.addColorStop(0, darkColor);
        gradient.addColorStop(0.5, baseColor);
        gradient.addColorStop(1, darkColor);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // FISSURES (lignes sombres)
        if (details?.hasCrack) {
            this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            
            const cx = iso.x;
            const cy = iso.y + hh;
            const angle = details.crackAngle;
            const len = details.crackLength;
            
            this.ctx.moveTo(cx, cy);
            this.ctx.lineTo(
                cx + Math.cos(angle) * len,
                cy + Math.sin(angle) * len * 0.5  // Compression iso
            );
            this.ctx.stroke();
        }
        
        // TACHES SOMBRES
        if (details?.hasStain) {
            this.ctx.fillStyle = 'rgba(10, 8, 5, 0.3)';
            this.ctx.beginPath();
            this.ctx.ellipse(
                iso.x + details.stainOffsetX,
                iso.y + hh + details.stainOffsetY,
                details.stainSize,
                details.stainSize * 0.5,  // Ellipse iso
                0, 0, Math.PI * 2
            );
            this.ctx.fill();
        }
        
        this.ctx.restore();
        
        // Bordure
        this.ctx.strokeStyle = '#0a0806';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(iso.x, iso.y);
        this.ctx.lineTo(iso.x + hw, iso.y + hh);
        this.ctx.lineTo(iso.x, iso.y + hh * 2);
        this.ctx.lineTo(iso.x - hw, iso.y + hh);
        this.ctx.closePath();
        this.ctx.stroke();
    }
    
    /**
     * Ajuste la luminosité d'une couleur hexa
     */
    adjustBrightness(hex, factor) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        
        return `rgb(${Math.min(255, r * factor)}, ${Math.min(255, g * factor)}, ${Math.min(255, b * factor)})`;
    }
    
    /**
     * Dessine un mur (cube élevé avec base au sol) avec textures procédurales
     * @param {boolean} isOccluding - Si le mur cache le joueur (transparence)
     */
    drawWall(gridX, gridY, isOccluding = false) {
        const iso = this.toIso(gridX, gridY);
        const hw = this.tileWidth / 2;
        const hh = this.tileHeight / 3;  // Ajusté pour nouveau ratio
        
        // Récupère les détails de ce mur
        const details = this.wallDetails.get(`${gridX},${gridY}`);
        const wh = this.wallHeight + (details?.heightVariation || 0);  // Hauteur variable
        
        this.ctx.save();
        
        // Applique transparence si le mur cache le joueur
        if (isOccluding) {
            this.ctx.globalAlpha = 0.1;  // 10% opacité (90% transparent)
        }
        
        // Base au sol (sol sous le mur)
        this.ctx.beginPath();
        this.ctx.moveTo(iso.x, iso.y);
        this.ctx.lineTo(iso.x + hw, iso.y + hh);
        this.ctx.lineTo(iso.x, iso.y + hh * 2);
        this.ctx.lineTo(iso.x - hw, iso.y + hh);
        this.ctx.closePath();
        this.ctx.fillStyle = this.colors.floorDark;
        this.ctx.fill();
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // Face DROITE (EST) - Plus claire
        this.ctx.beginPath();
        this.ctx.moveTo(iso.x, iso.y);
        this.ctx.lineTo(iso.x + hw, iso.y + hh);
        this.ctx.lineTo(iso.x + hw, iso.y + hh - wh);
        this.ctx.lineTo(iso.x, iso.y - wh);
        this.ctx.closePath();
        
        const gradRight = this.ctx.createLinearGradient(
            iso.x, iso.y, 
            iso.x, iso.y - wh
        );
        gradRight.addColorStop(0, this.colors.wallFront);
        gradRight.addColorStop(1, this.colors.wallLeft);
        this.ctx.fillStyle = gradRight;
        this.ctx.fill();
        
        // CRACKS sur face droite
        if (details?.hasCrack) {
            this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            const crackX = iso.x + details.crackOffset;
            this.ctx.moveTo(crackX, iso.y - wh * 0.2);
            this.ctx.lineTo(crackX + 2, iso.y - wh * 0.5);
            this.ctx.lineTo(crackX, iso.y - wh * 0.8);
            this.ctx.stroke();
        }
        
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // Face SUD (BAS) - Plus sombre
        this.ctx.beginPath();
        this.ctx.moveTo(iso.x, iso.y + hh * 2);
        this.ctx.lineTo(iso.x + hw, iso.y + hh);
        this.ctx.lineTo(iso.x + hw, iso.y + hh - wh);
        this.ctx.lineTo(iso.x, iso.y + hh * 2 - wh);
        this.ctx.closePath();
        
        const gradSouth = this.ctx.createLinearGradient(
            iso.x, iso.y, 
            iso.x, iso.y - wh
        );
        gradSouth.addColorStop(0, this.colors.wallLeft);
        gradSouth.addColorStop(1, this.colors.wallRight);
        this.ctx.fillStyle = gradSouth;
        this.ctx.fill();
        
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // Face GAUCHE (OUEST) - Cachée normalement, mais visible sur coins
        this.ctx.beginPath();
        this.ctx.moveTo(iso.x, iso.y + hh * 2);
        this.ctx.lineTo(iso.x - hw, iso.y + hh);
        this.ctx.lineTo(iso.x - hw, iso.y + hh - wh);
        this.ctx.lineTo(iso.x, iso.y + hh * 2 - wh);
        this.ctx.closePath();
        
        const gradLeft = this.ctx.createLinearGradient(
            iso.x, iso.y, 
            iso.x, iso.y - wh
        );
        gradLeft.addColorStop(0, this.colors.wallRight);
        gradLeft.addColorStop(1, '#0a0a0a');
        this.ctx.fillStyle = gradLeft;
        this.ctx.fill();
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // DESSUS du mur (losange élevé) - Losange droit classique
        this.ctx.beginPath();
        this.ctx.moveTo(iso.x, iso.y - wh);
        this.ctx.lineTo(iso.x + hw, iso.y + hh - wh);
        this.ctx.lineTo(iso.x, iso.y + hh * 2 - wh);
        this.ctx.lineTo(iso.x - hw, iso.y + hh - wh);
        this.ctx.closePath();
        
        const gradTop = this.ctx.createLinearGradient(
            iso.x - hw, iso.y - wh, 
            iso.x + hw, iso.y - wh
        );
        gradTop.addColorStop(0, this.colors.wallLeft);
        gradTop.addColorStop(0.5, this.colors.wallTop);
        gradTop.addColorStop(1, this.colors.wallRight);
        this.ctx.fillStyle = gradTop;
        this.ctx.fill();
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    /**
     * Dessine les débris éparpillés au sol
     */
    drawDebris() {
        this.debris.forEach(d => {
            // Seulement si la tuile est explorée
            if (!this.isExplored(d.gridX, d.gridY)) return;
            
            const iso = this.toIso(d.gridX, d.gridY);
            const x = iso.x + d.offsetX;
            const y = iso.y + this.tileHeight / 3 + d.offsetY;
            
            this.ctx.fillStyle = d.type === 0 ? '#2a2520' :  // Pierre
                                d.type === 1 ? '#4a4238' :  // Os
                                '#3a3a3a';                  // Métal
            
            // Petit rectangle iso (débris)
            this.ctx.fillRect(x - d.size / 2, y - d.size / 3, d.size, d.size * 0.6);
            
            // Ombre
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this.ctx.fillRect(x - d.size / 2 + 1, y + d.size / 3, d.size, 1);
        });
    }
     
    /**
     * Dessine icône tuile spéciale
     */
    drawTileIcon(gridX, gridY, tile) {
        if (tile <= 2) return;
        
        const iso = this.toIsoCentered(gridX, gridY);
        let color, text;
        
        switch(tile) {
            case 3: color = this.colors.start; text = 'S'; break;
            case 4: color = this.colors.exit; text = 'E'; break;
            case 5: color = this.colors.treasure; text = 'T'; break;
            case 6: color = this.colors.enemy; text = 'M'; break;
            default: return;
        }
        
        // Badge élevé
        const badgeY = iso.y - 10;
        
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(iso.x, badgeY, 10, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        this.ctx.fillStyle = '#000';
        this.ctx.font = 'bold 14px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, iso.x, badgeY);
    }
    
    /**
     * Dessine le joueur (cylindre 3D élevé) - Style torche vivante
     */
    drawPlayer() {
        // Utilise la position SMOOTH
        const iso = this.toIsoCentered(this.playerSmooth.x, this.playerSmooth.y);
        const bob = Math.sin(this.animationFrame * 0.05) * 3;
        const radius = 14;
        const height = 28;
        const elevation = 5 + bob;
        
        // Ombre au sol
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        this.ctx.beginPath();
        this.ctx.ellipse(iso.x, iso.y, radius * 0.8, 6, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Position élevée
        const topY = iso.y - elevation - height;
        const bottomY = iso.y - elevation;
        
        this.ctx.save();
        
        // GLOW ORANGE (torche)
        this.ctx.shadowColor = this.colors.torchLight;
        this.ctx.shadowBlur = 25;
        
        // Corps (faces latérales) - Gradient brun-orange
        const bodyGrad = this.ctx.createLinearGradient(
            iso.x - radius, topY,
            iso.x + radius, topY
        );
        bodyGrad.addColorStop(0, '#4a2800');     // Brun sombre
        bodyGrad.addColorStop(0.5, '#8b4513');   // Brun cuir
        bodyGrad.addColorStop(1, '#4a2800');
        this.ctx.fillStyle = bodyGrad;
        this.ctx.fillRect(iso.x - radius, topY, radius * 2, height);
        
        // Dessus (ellipse) - Lueur orange torche
        this.ctx.shadowBlur = 30;
        this.ctx.fillStyle = this.colors.player;  // Orange torche
        this.ctx.beginPath();
        this.ctx.ellipse(iso.x, topY, radius, 7, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Highlight lumineux
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = 'rgba(255, 200, 100, 0.8)';  // Jaune-orange brillant
        this.ctx.beginPath();
        this.ctx.ellipse(iso.x - 3, topY - 1, radius * 0.5, 3, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Contours
        this.ctx.strokeStyle = '#1a1510';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.ellipse(iso.x, topY, radius, 7, 0, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(iso.x - radius, topY);
        this.ctx.lineTo(iso.x - radius, bottomY);
        this.ctx.moveTo(iso.x + radius, topY);
        this.ctx.lineTo(iso.x + radius, bottomY);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.ellipse(iso.x, bottomY, radius, 7, 0, 0, Math.PI);
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    /**
     * Minimap dans le coin - AVEC FOG OF WAR
     */
    drawMinimap() {
        const minimapSize = 150;
        const minimapX = this.canvas.width - minimapSize - 10;
        const minimapY = 10;
        const scale = minimapSize / Math.max(this.dungeon.width, this.dungeon.height);
        
        // Fond
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(minimapX, minimapY, minimapSize, minimapSize);
        
        // Tuiles (SEULEMENT les zones explorées)
        for (let y = 0; y < this.dungeon.height; y++) {
            for (let x = 0; x < this.dungeon.width; x++) {
                const tile = this.dungeon.grid[y][x];
                
                // Ignore les tuiles vides (-1)
                if (tile === -1) continue;
                
                if (!this.isExplored(x, y)) {
                    // Zone non explorée = brouillard
                    this.ctx.fillStyle = '#111';
                    this.ctx.fillRect(
                        minimapX + x * scale,
                        minimapY + y * scale,
                        Math.max(1, scale),
                        Math.max(1, scale)
                    );
                    continue;
                }
                
                // tile déjà récupéré plus haut
                if (tile === 0) {
                    // Mur exploré
                    this.ctx.fillStyle = '#333';
                } else if (tile === 1 || tile === 2) {
                    // Sol/couloir
                    this.ctx.fillStyle = '#555';
                } else {
                    // Tuiles spéciales (garde couleurs)
                    switch(tile) {
                        case 3: this.ctx.fillStyle = this.colors.start; break;
                        case 4: this.ctx.fillStyle = this.colors.exit; break;
                        case 5: this.ctx.fillStyle = this.colors.treasure; break;
                        case 6: this.ctx.fillStyle = this.colors.enemy; break;
                        default: this.ctx.fillStyle = '#555';
                    }
                }
                
                this.ctx.fillRect(
                    minimapX + x * scale,
                    minimapY + y * scale,
                    Math.max(1, scale),
                    Math.max(1, scale)
                );
            }
        }
        
        // Bordure minimap
        this.ctx.strokeStyle = '#666';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(minimapX, minimapY, minimapSize, minimapSize);
        
        // Position joueur (toujours visible)
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(
            minimapX + this.playerPos.x * scale - 1,
            minimapY + this.playerPos.y * scale - 1,
            3,
            3
        );
        
        // Rayon de vision (cercle)
        this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(
            minimapX + this.playerPos.x * scale,
            minimapY + this.playerPos.y * scale,
            this.visionRadius * scale,
            0, Math.PI * 2
        );
        this.ctx.stroke();
    }
    
    /**
     * Vérifie si le joueur smooth est proche de sa cible (mouvement terminé)
     */
    isPlayerMovementComplete() {
        const dx = Math.abs(this.playerSmooth.x - this.playerTarget.x);
        const dy = Math.abs(this.playerSmooth.y - this.playerTarget.y);
        return dx < 0.05 && dy < 0.05;  // Tolérance de 5%
    }
    
    /**
     * Affiche les infos de debug du mouvement
     */
    drawDebugInfo() {
        const lines = [
            `PlayerPos: (${this.playerPos.x}, ${this.playerPos.y})`,
            `PlayerSmooth: (${this.playerSmooth.x.toFixed(2)}, ${this.playerSmooth.y.toFixed(2)})`,
            `PlayerTarget: (${this.playerTarget.x}, ${this.playerTarget.y})`,
            `Distance: ${Math.hypot(
                this.playerSmooth.x - this.playerTarget.x,
                this.playerSmooth.y - this.playerTarget.y
            ).toFixed(3)}`,
            `Movement Complete: ${this.isPlayerMovementComplete()}`
        ];
        
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, 10, 350, lines.length * 20 + 10);
        
        this.ctx.fillStyle = '#0f0';
        this.ctx.font = '14px monospace';
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        
        lines.forEach((line, i) => {
            this.ctx.fillText(line, 15, 15 + i * 20);
        });
        
        this.ctx.restore();
    }
    
    /**
     * Déplace le joueur (modifie seulement la TARGET, le smooth suit)
     * BLOQUE les inputs si un mouvement est déjà en cours
     */
    movePlayer(dx, dy) {
        // Ne pas accepter de nouveau mouvement si le précédent n'est pas fini
        if (!this.isPlayerMovementComplete()) {
            return false;
        }
        
        const newX = this.playerPos.x + dx;
        const newY = this.playerPos.y + dy;
        
        if (this.isWalkable(newX, newY)) {
            this.playerPos.x = newX;
            this.playerPos.y = newY;
            
            // Met à jour la cible du mouvement smooth
            this.playerTarget.x = newX;
            this.playerTarget.y = newY;
            
            // Vérifie les interactions
            const tile = this.dungeon.grid[newY][newX];
            this.handleTileInteraction(tile);
            
            this.needsRedraw = true;
            return true;
        }
        
        return false;
    }
    
    isWalkable(x, y) {
        if (x < 0 || x >= this.dungeon.width || y < 0 || y >= this.dungeon.height) {
            return false;
        }
        return this.dungeon.grid[y][x] !== 0; // Pas un mur
    }
    
    handleTileInteraction(tile) {
        switch(tile) {
            case 4: // EXIT
                console.log('🚪 Sortie trouvée !');
                break;
            case 5: // TREASURE
                console.log('💰 Trésor trouvé !');
                break;
            case 6: // ENEMY
                console.log('⚔️ Combat !');
                break;
        }
    }
    
    /**
     * Retourne la position actuelle du joueur
     */
    getPlayerPosition() {
        return { x: this.playerPos.x, y: this.playerPos.y };
    }
    
    /**
     * Dessine les icônes d'événements sur les salles découvertes
     */
    drawEventIcons() {
        if (!this.eventSystem) return;
        
        const events = this.eventSystem.events;
        const time = Date.now() / 1000;
        
        this.ctx.save();
        
        events.forEach(event => {
            const { x, y, type, triggered } = event;
            
            // Seulement si la case est explorée
            if (!this.isExplored(x, y)) return;
            
            // Si déjà triggered, on affiche différemment
            const alpha = triggered ? 0.3 : 1.0;
            
            const iso = this.toIso(x, y);
            
            // Position au-dessus de la tuile
            const iconX = iso.x;
            const iconY = iso.y - this.wallHeight - 20;
            
            // Animation de flottement
            const floatOffset = Math.sin(time * 2 + x + y) * 5;
            
            this.ctx.globalAlpha = alpha;
            
            // Halo lumineux pulsant
            if (!triggered) {
                const pulseSize = 30 + Math.sin(time * 3 + x) * 5;
                const gradient = this.ctx.createRadialGradient(
                    iconX, iconY + floatOffset, 0,
                    iconX, iconY + floatOffset, pulseSize
                );
                gradient.addColorStop(0, this.getEventColor(type, 0.3));
                gradient.addColorStop(1, 'transparent');
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(
                    iconX - pulseSize, 
                    iconY + floatOffset - pulseSize,
                    pulseSize * 2,
                    pulseSize * 2
                );
            }
            
            // Icône
            this.ctx.font = 'bold 32px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            // Ombre portée
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            this.ctx.shadowBlur = 10;
            this.ctx.shadowOffsetX = 2;
            this.ctx.shadowOffsetY = 2;
            
            // Couleur de l'icône
            this.ctx.fillStyle = triggered ? '#666' : this.getEventColor(type, 1.0);
            this.ctx.fillText(this.getEventIcon(type), iconX, iconY + floatOffset);
            
            this.ctx.shadowBlur = 0;
        });
        
        this.ctx.restore();
    }
    
    /**
     * Retourne l'icône emoji pour un type d'événement
     */
    getEventIcon(type) {
        const icons = {
            'combat': '⚔️',
            'treasure': '💎',
            'cage': '🔒',
            'merchant': '🏪',
            'rest': '🔥',
            'boss': '👹',
            'trap': '⚠️',
            'puzzle': '🧩',
            'altar': '✨',
            'fountain': '💧',
            'random': '❓'
        };
        return icons[type] || '❓';
    }
    
    /**
     * Retourne la couleur associée à un type d'événement
     */
    getEventColor(type, alpha = 1.0) {
        const colors = {
            'combat': `rgba(255, 68, 68, ${alpha})`,      // Rouge combat
            'treasure': `rgba(255, 215, 0, ${alpha})`,    // Or
            'cage': `rgba(138, 43, 226, ${alpha})`,       // Violet cage
            'merchant': `rgba(50, 205, 50, ${alpha})`,    // Vert marchand
            'rest': `rgba(255, 140, 0, ${alpha})`,        // Orange feu
            'boss': `rgba(139, 0, 0, ${alpha})`,          // Rouge sombre
            'trap': `rgba(255, 69, 0, ${alpha})`,         // Rouge-orange
            'puzzle': `rgba(100, 149, 237, ${alpha})`,    // Bleu
            'altar': `rgba(218, 112, 214, ${alpha})`,     // Rose
            'fountain': `rgba(0, 191, 255, ${alpha})`,    // Cyan
            'random': `rgba(200, 200, 200, ${alpha})`     // Gris
        };
        return colors[type] || `rgba(200, 200, 200, ${alpha})`;
    }
}
