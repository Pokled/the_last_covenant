/**
 * Système de déplacement tactique basé sur un dé
 * Le joueur lance un dé, puis sélectionne une case dans le radius autorisé
 */
export class DiceMovementSystem {
    constructor(generator, renderer) {
        this.generator = generator;
        this.renderer = renderer;
        
        // État du système
        this.diceValue = 0;
        this.isRolling = false;
        this.isSelectingMove = false;
        this.reachableTiles = [];
        this.selectedTile = null;
        
        // Animation du dé
        this.diceRotation = 0;
        this.diceAnimationTime = 0;
        
        this.setupDiceUI();
        this.setupClickHandler();
    }
    
    setupDiceUI() {
        // Bouton pour lancer le dé
        const rollButton = document.createElement('button');
        rollButton.id = 'rollDiceBtn';
        rollButton.textContent = '🎲 Lancer le Dé';
        rollButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 30px;
            font-size: 18px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            transition: all 0.3s;
            z-index: 1000;
        `;
        
        rollButton.addEventListener('mouseenter', () => {
            rollButton.style.transform = 'translateX(-50%) scale(1.05)';
        });
        
        rollButton.addEventListener('mouseleave', () => {
            rollButton.style.transform = 'translateX(-50%) scale(1)';
        });
        
        rollButton.addEventListener('click', () => this.rollDice());
        
        document.body.appendChild(rollButton);
        this.rollButton = rollButton;
        
        // Affichage du résultat
        const diceDisplay = document.createElement('div');
        diceDisplay.id = 'diceDisplay';
        diceDisplay.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 20px;
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #667eea;
            border-radius: 10px;
            color: white;
            font-size: 24px;
            font-weight: bold;
            display: none;
            z-index: 1000;
        `;
        
        document.body.appendChild(diceDisplay);
        this.diceDisplay = diceDisplay;
    }
    
    setupClickHandler() {
        this.renderer.canvas.addEventListener('click', (e) => {
            if (!this.isSelectingMove) return;
            
            const rect = this.renderer.canvas.getBoundingClientRect();
            // Convertir coordonnées CSS → coordonnées canvas
            const scaleX = this.renderer.canvas.width / rect.width;
            const scaleY = this.renderer.canvas.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;
            
            // Convertir les coordonnées écran en coordonnées grille
            const gridPos = this.renderer.screenToGrid(x, y);
            
            if (gridPos) {
                // Vérifier si la case est accessible
                const tile = this.reachableTiles.find(t => t.x === gridPos.x && t.y === gridPos.y);
                if (tile) {
                    this.selectTile(tile);
                }
            }
        });
        
        // Hover pour preview
        this.renderer.canvas.addEventListener('mousemove', (e) => {
            if (!this.isSelectingMove) return;
            
            const rect = this.renderer.canvas.getBoundingClientRect();
            // Convertir coordonnées CSS → coordonnées canvas
            const scaleX = this.renderer.canvas.width / rect.width;
            const scaleY = this.renderer.canvas.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;
            
            const gridPos = this.renderer.screenToGrid(x, y);
            
            if (gridPos) {
                const tile = this.reachableTiles.find(t => t.x === gridPos.x && t.y === gridPos.y);
                this.selectedTile = tile || null;
            } else {
                this.selectedTile = null;
            }
        });
    }
    
    rollDice() {
        if (this.isRolling || this.isSelectingMove) return;
        
        this.isRolling = true;
        this.rollButton.disabled = true;
        this.rollButton.style.opacity = '0.5';
        this.diceDisplay.style.display = 'block';
        this.diceDisplay.textContent = '🎲 Lancer en cours...';
        
        // Animation du dé (1.5 secondes)
        this.diceAnimationTime = 0;
        const animDuration = 1.5;
        
        const animate = () => {
            this.diceAnimationTime += 0.016; // ~60fps
            
            if (this.diceAnimationTime < animDuration) {
                // Afficher des valeurs aléatoires pendant l'animation
                const randomValue = Math.floor(Math.random() * 6) + 1;
                this.diceDisplay.textContent = `🎲 ${randomValue}`;
                requestAnimationFrame(animate);
            } else {
                // Résultat final
                this.diceValue = Math.floor(Math.random() * 6) + 1;
                this.diceDisplay.textContent = `🎲 Résultat : ${this.diceValue}`;
                
                this.isRolling = false;
                this.startMoveSelection();
            }
        };
        
        animate();
    }
    
    startMoveSelection() {
        this.isSelectingMove = true;
        
        // Calculer les cases accessibles
        this.reachableTiles = this.calculateReachableTiles(
            this.renderer.playerPos.x,
            this.renderer.playerPos.y,
            this.diceValue
        );
        
        console.log(`🎯 ${this.reachableTiles.length} cases accessibles avec le dé ${this.diceValue}`);
        
        // Mettre à jour l'affichage
        this.diceDisplay.textContent = `🎲 ${this.diceValue} - Sélectionnez une case`;
    }
    
    calculateReachableTiles(startX, startY, maxDistance) {
        const reachable = [];
        const visited = new Set();
        const queue = [{ x: startX, y: startY, distance: 0 }];
        
        while (queue.length > 0) {
            const current = queue.shift();
            const key = `${current.x},${current.y}`;
            
            if (visited.has(key)) continue;
            visited.add(key);
            
            // Ne pas ajouter la case de départ
            if (current.distance > 0 && current.distance <= maxDistance) {
                reachable.push({ x: current.x, y: current.y, distance: current.distance });
            }
            
            // Explorer les voisins (4 directions)
            if (current.distance < maxDistance) {
                const neighbors = [
                    { x: current.x + 1, y: current.y },
                    { x: current.x - 1, y: current.y },
                    { x: current.x, y: current.y + 1 },
                    { x: current.x, y: current.y - 1 }
                ];
                
                for (const neighbor of neighbors) {
                    const neighborKey = `${neighbor.x},${neighbor.y}`;
                    
                    if (!visited.has(neighborKey) && this.isTileWalkable(neighbor.x, neighbor.y)) {
                        queue.push({
                            x: neighbor.x,
                            y: neighbor.y,
                            distance: current.distance + 1
                        });
                    }
                }
            }
        }
        
        return reachable;
    }
    
    isTileWalkable(x, y) {
        if (x < 0 || y < 0 || x >= this.generator.width || y >= this.generator.height) {
            return false;
        }
        
        const tile = this.generator.grid[y][x];
        return tile === 1 || tile === 2 || tile === 3 || tile === 4 || tile === 5;
    }
    
    selectTile(tile) {
        console.log(`✅ Case sélectionnée : (${tile.x}, ${tile.y})`);
        
        // Déplacer le joueur
        this.movePlayerTo(tile.x, tile.y);
        
        // Réinitialiser l'état
        this.isSelectingMove = false;
        this.reachableTiles = [];
        this.selectedTile = null;
        
        // Cacher l'affichage du dé
        setTimeout(() => {
            this.diceDisplay.style.display = 'none';
            this.rollButton.disabled = false;
            this.rollButton.style.opacity = '1';
        }, 500);
    }
    
    movePlayerTo(targetX, targetY) {
        // Mettre à jour la position cible
        this.renderer.playerPos.x = targetX;
        this.renderer.playerPos.y = targetY;
        this.renderer.playerTarget.x = targetX;
        this.renderer.playerTarget.y = targetY;
        
        // Marquer le mouvement comme incomplet pour déclencher l'animation smooth
        this.renderer.movementComplete = false;
        
        console.log(`🏃 Déplacement vers (${targetX}, ${targetY})`);
    }
    
    // Dessiner les cases accessibles
    drawReachableTiles(ctx) {
        if (!this.isSelectingMove || this.reachableTiles.length === 0) return;
        
        for (const tile of this.reachableTiles) {
            // Utiliser toIso comme pour drawFloor (le ctx est déjà transformé par render)
            const iso = this.renderer.toIso(tile.x, tile.y);
            const x = iso.x;
            const y = iso.y;
            
            // Highlight différent selon si c'est la case survolée
            const isHovered = this.selectedTile && this.selectedTile.x === tile.x && this.selectedTile.y === tile.y;
            
            // Dessiner un losange isométrique EXACTEMENT comme la face supérieure du sol
            ctx.save();
            
            // Losange EXACTEMENT comme la face supérieure du sol (SANS zoom car ctx.scale déjà appliqué)
            const hw = this.renderer.tileWidth / 2;
            const hh = this.renderer.tileHeight / 3;
            
            // HIGHLIGHT BACKGROUND (opacité augmentée pour le hover vert)
            ctx.globalAlpha = isHovered ? 0.45 : 0.15;
            ctx.fillStyle = isHovered ? 'rgba(0, 255, 0, 0.7)' : 'rgba(255, 255, 0, 0.4)';
            
            ctx.beginPath();
            ctx.moveTo(x, y);              // Haut
            ctx.lineTo(x + hw, y + hh);    // Droite
            ctx.lineTo(x, y + hh * 2);     // Bas
            ctx.lineTo(x - hw, y + hh);    // Gauche
            ctx.closePath();
            ctx.fill();
            
            // Bordure (opacité augmentée pour le hover vert)
            ctx.globalAlpha = isHovered ? 0.8 : 0.4;
            ctx.strokeStyle = isHovered ? '#00ff00' : '#ffcc00';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Afficher la distance (au centre du losange)
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = 'white';
            const fontSize = 6;  // Taille très petite
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            const textY = y + hh;  // Centre vertical du losange
            ctx.strokeText(tile.distance, x, textY);
            ctx.fillText(tile.distance, x, textY);
            
            ctx.restore();
        }
    }
}
