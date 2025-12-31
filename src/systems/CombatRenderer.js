/**
 * 🎨 COMBAT RENDERER - THE LAST COVENANT
 * 
 * Gère TOUS les feedbacks visuels du combat :
 * - Grille interactive (hover, click, preview)
 * - Animations (attaques, déplacements, morts)
 * - VFX (particules, trails, impacts)
 * - Floating numbers (dégâts, soins)
 * - Tooltips (actions, ennemis, compétences)
 * - Intent indicators (ennemis)
 * 
 * === STYLE VISUEL ===
 * Inspiré de Baldur's Gate 3 + Diablo 4
 * - Couleurs mature/sombre
 * - Particules subtiles
 * - Animations fluides mais rapides
 * - Feedback immédiat et clair
 * 
 * @version 1.0.0
 */

export class CombatRenderer {
    constructor(canvas, combatSystem, corruption, feedbackSystem = null) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.combat = combatSystem;
        this.corruption = corruption;
        this.feedback = feedbackSystem; // 🔥 NOUVEAU
        
        // Dimensions
        this.cellSize = 120;
        this.padding = 60;
        this.offsetX = 0;
        this.offsetY = 0;
        
        // État UI
        this.hoveredCell = null;
        this.selectedCell = null;
        this.animating = false;
        
        // Particules & VFX (legacy - maintenant géré par feedbackSystem)
        this.particles = [];
        this.floatingNumbers = [];
        this.trails = [];
        
        // Assets (à charger)
        this.sprites = {};
        
        // Couleurs (style BG3/Diablo)
        this.colors = {
            // Grille
            gridLine: 'rgba(120, 100, 75, 0.6)', // Plus visible
            cellEmpty: 'rgba(20, 18, 15, 0.6)',
            cellHover: 'rgba(201, 169, 122, 0.2)',
            cellSelected: 'rgba(201, 169, 122, 0.4)',
            cellWalkable: 'rgba(100, 180, 100, 0.3)',
            cellAttackable: 'rgba(220, 80, 80, 0.3)',
            
            // Entités
            player: '#4a9eff',
            enemy: '#d14343',
            enemyIntent: '#ff6b6b',
            
            // Hazards
            fire: '#ff6b35',
            poison: '#7fb069',
            void: '#9d4edd',
            
            // Feedback
            damage: '#ff4444',
            heal: '#44ff88',
            crit: '#ffcc00',
            miss: '#888888'
        };
        
        // Config animations
        this.config = {
            animationSpeed: 400,
            damageNumberDuration: 1500,
            particleLifetime: 30
        };
        
        // Bind events
        this.setupEventListeners();
        
        console.log('🎨 CombatRenderer initialisé');
    }
    
    // ═══════════════════════════════════════════════════════
    // INITIALISATION
    // ═══════════════════════════════════════════════════════
    
    /**
     * Configure les event listeners
     */
    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('click', (e) => this.onClick(e));
        this.canvas.addEventListener('mouseleave', () => this.onMouseLeave());
    }
    
    /**
     * Calcule position grille depuis coordonnées écran
     */
    screenToGrid(screenX, screenY, debug = false) {
        const rect = this.canvas.getBoundingClientRect();
        const x = screenX - rect.left;
        const y = screenY - rect.top;
        
        const gridX = Math.floor((x - this.offsetX) / this.cellSize);
        const gridY = Math.floor((y - this.offsetY) / this.cellSize);
        
        // DEBUG - only on click
        if (debug) {
            console.log(`🖱️ Click: screen(${screenX}, ${screenY}) canvas(${x.toFixed(0)}, ${y.toFixed(0)}) → grid(${gridX}, ${gridY})`);
        }
        
        if (gridX >= 0 && gridX < this.combat.gridWidth &&
            gridY >= 0 && gridY < this.combat.gridHeight) {
            return { x: gridX, y: gridY };
        }
        
        return null;
    }
    
    /**
     * Calcule position écran depuis coordonnées grille
     */
    gridToScreen(gridX, gridY) {
        return {
            x: this.offsetX + gridX * this.cellSize + this.cellSize / 2,
            y: this.offsetY + gridY * this.cellSize + this.cellSize / 2
        };
    }
    
    // ═══════════════════════════════════════════════════════
    // EVENT HANDLERS
    // ═══════════════════════════════════════════════════════
    
    /**
     * Survol souris
     */
    onMouseMove(e) {
        const gridPos = this.screenToGrid(e.clientX, e.clientY);
        
        if (gridPos && (!this.hoveredCell || this.hoveredCell.x !== gridPos.x || this.hoveredCell.y !== gridPos.y)) {
            this.hoveredCell = gridPos;
            this.updateHoverPreview(gridPos);
            this.render();
        } else if (!gridPos && this.hoveredCell) {
            this.hoveredCell = null;
            this.render();
        }
    }
    
    /**
     * Click souris
     */
    onClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const y = e.clientY - rect.top;
        
        // Ignorer les clics dans la zone de l'action bar (250px en bas)
        if (y > this.canvas.height - 50) {
            console.log('🚫 Clic ignoré par CombatRenderer (zone action bar)');
            return;
        }
        
        const gridPos = this.screenToGrid(e.clientX, e.clientY, true); // debug=true
        if (!gridPos) return;
        
        // Vérifier action possible
        const action = this.getActionForCell(gridPos);
        if (action) {
            this.executeAction(action);
        }
    }
    
    /**
     * Souris sort du canvas
     */
    onMouseLeave() {
        this.hoveredCell = null;
        this.render();
    }
    
    /**
     * Met à jour le preview selon la case survolée
     */
    updateHoverPreview(gridPos) {
        const action = this.getActionForCell(gridPos);
        
        if (action) {
            // Calculer preview (dégâts, déplacement, etc.)
            action.preview = this.calculateActionPreview(action);
        }
        
        this.combat.hoveredAction = action;
    }
    
    /**
     * Détermine l'action possible pour une case
     */
    getActionForCell(gridPos) {
        if (!this.combat.isActive || this.combat.phase !== 'player') {
            return null;
        }
        
        const playerPos = this.combat.playerPosition;
        // UTILISER la méthode du CombatSystem qui gère Chebyshev
        const distance = this.combat.getDistance(playerPos, gridPos);
        
        // Check si ennemi sur case
        const enemy = this.combat.enemies.find(e => 
            e.x === gridPos.x && e.y === gridPos.y && e.HP > 0
        );
        
        if (enemy && distance <= this.combat.config.attackRange) {
            return {
                type: 'attack',
                target: enemy,
                targetPos: gridPos
            };
        }
        
        // Check si déplacement possible
        if (distance <= this.combat.config.moveRange && 
            this.combat.isCellWalkable(gridPos.x, gridPos.y)) {
            return {
                type: 'move',
                targetPos: gridPos
            };
        }
        
        return null;
    }
    
    /**
     * Calcule le preview d'une action
     */
    calculateActionPreview(action) {
        if (action.type === 'attack') {
            const playerStats = this.combat.playerStats.getStats();
            const enemy = action.target;
            
            // Dégâts estimés
            let damage = playerStats.ATK - (enemy.DEF || 0) * 0.5;
            damage = Math.max(1, Math.floor(damage));
            
            return {
                damage: damage,
                canKill: damage >= enemy.HP,
                critChance: playerStats.CRIT_CHANCE
            };
        }
        
        if (action.type === 'move') {
            // Check hazard sur destination
            const cell = this.combat.grid[action.targetPos.y][action.targetPos.x];
            return {
                hazard: cell.hazard,
                hazardDamage: cell.hazard ? this.combat.config.hazardDamage : 0
            };
        }
        
        return {};
    }
    
    /**
     * Exécute une action avec animation
     */
    async executeAction(action) {
        if (this.animating) return;
        
        this.animating = true;
        
        if (action.type === 'attack') {
            await this.animateAttack(this.combat.playerPosition, action.targetPos);
            const result = this.combat.attackEnemy(
                this.combat.enemies.indexOf(action.target)
            );
            
            if (result.success) {
                this.showFloatingNumber(
                    action.targetPos, 
                    result.damage, 
                    result.isCrit ? 'crit' : 'damage'
                );
                
                await this.animateHit(action.targetPos, result.isCrit);
            }
        }
        
        if (action.type === 'move') {
            await this.animateMove(this.combat.playerPosition, action.targetPos);
            this.combat.movePlayer(action.targetPos.x, action.targetPos.y);
            
            // Log le déplacement
            this.addLog(`Déplacement vers (${action.targetPos.x}, ${action.targetPos.y})`, 'move');
        }
        
        this.animating = false;
        this.render();
    }
    
    // ═══════════════════════════════════════════════════════
    // RENDU PRINCIPAL
    // ═══════════════════════════════════════════════════════
    
    /**
     * Rendu complet
     */
    render() {
        // Clear
        this.ctx.fillStyle = '#0d0d0d';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Si combat pas actif, ne rien dessiner d'autre
        if (!this.combat.isActive) {
            return;
        }
        
        // Calculer offset pour centrer
        this.offsetX = (this.canvas.width - this.combat.gridWidth * this.cellSize) / 2;
        this.offsetY = (this.canvas.height - this.combat.gridHeight * this.cellSize) / 2;
        
        // Layers
        this.renderGrid();
        this.renderHighlights();
        this.renderHazards();
        this.renderIntents();
        this.renderEntities();
        this.renderParticles();
        this.renderFloatingNumbers();
        this.renderTooltip();
    }
    
    /**
     * Grille de base
     */
    renderGrid() {
        // Background des cellules
        for (let y = 0; y < this.combat.gridHeight; y++) {
            for (let x = 0; x < this.combat.gridWidth; x++) {
                const cellX = this.offsetX + x * this.cellSize;
                const cellY = this.offsetY + y * this.cellSize;
                
                // Couleur alternée (damier subtil)
                const isEven = (x + y) % 2 === 0;
                this.ctx.fillStyle = isEven ? 'rgba(30,25,20,0.3)' : 'rgba(25,20,15,0.3)';
                this.ctx.fillRect(cellX, cellY, this.cellSize, this.cellSize);
            }
        }
        
        // Lignes de grille
        this.ctx.strokeStyle = this.colors.gridLine;
        this.ctx.lineWidth = 2; // Plus épais
        
        // Lignes horizontales
        for (let y = 0; y <= this.combat.gridHeight; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.offsetX, this.offsetY + y * this.cellSize);
            this.ctx.lineTo(
                this.offsetX + this.combat.gridWidth * this.cellSize,
                this.offsetY + y * this.cellSize
            );
            this.ctx.stroke();
        }
        
        // Lignes verticales
        for (let x = 0; x <= this.combat.gridWidth; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.offsetX + x * this.cellSize, this.offsetY);
            this.ctx.lineTo(
                this.offsetX + x * this.cellSize,
                this.offsetY + this.combat.gridHeight * this.cellSize
            );
            this.ctx.stroke();
        }
    }
    
    /**
     * Highlights (hover, range, targets)
     */
    renderHighlights() {
        if (!this.hoveredCell) return;
        
        const action = this.combat.hoveredAction;
        
        // Hover
        this.drawCell(
            this.hoveredCell.x, 
            this.hoveredCell.y, 
            action ? 
                (action.type === 'attack' ? this.colors.cellAttackable : this.colors.cellWalkable) :
                this.colors.cellHover
        );
        
        // Preview dégâts (si attaque)
        if (action?.type === 'attack' && action.preview) {
            this.ctx.save();
            const pos = this.gridToScreen(this.hoveredCell.x, this.hoveredCell.y);
            
            this.ctx.font = 'bold 24px Cinzel';
            this.ctx.fillStyle = action.preview.canKill ? '#ff4444' : '#ffffff';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'bottom';
            
            this.ctx.fillText(
                `-${action.preview.damage}`,
                pos.x,
                pos.y - 40
            );
            
            this.ctx.restore();
        }
    }
    
    /**
     * Hazards (feu, poison, vide)
     */
    renderHazards() {
        if (!this.combat.grid || this.combat.grid.length === 0) return; // CHECK AJOUTÉ
        
        for (let y = 0; y < this.combat.gridHeight; y++) {
            for (let x = 0; x < this.combat.gridWidth; x++) {
                const cell = this.combat.grid[y][x];
                if (cell && cell.hazard) {
                    this.drawHazard(x, y, cell.hazard);
                }
            }
        }
    }
    
    /**
     * Intentions ennemies (preview ITB-style)
     */
    renderIntents() {
        if (!this.combat.enemies || this.combat.enemies.length === 0) return; // CHECK AJOUTÉ
        
        this.combat.enemies.forEach(enemy => {
            if (enemy.HP <= 0 || !enemy.intent) return;
            
            const pos = this.gridToScreen(enemy.x, enemy.y);
            
            // Flèche vers cible
            if (enemy.intent.target) {
                const targetPos = this.gridToScreen(
                    enemy.intent.target.x,
                    enemy.intent.target.y
                );
                
                this.ctx.save();
                this.ctx.strokeStyle = this.colors.enemyIntent;
                this.ctx.lineWidth = 2;
                this.ctx.setLineDash([5, 5]);
                
                this.ctx.beginPath();
                this.ctx.moveTo(pos.x, pos.y);
                this.ctx.lineTo(targetPos.x, targetPos.y);
                this.ctx.stroke();
                
                this.ctx.restore();
            }
            
            // Icône intention
            this.ctx.save();
            this.ctx.font = 'bold 16px Crimson Text';
            this.ctx.fillStyle = this.colors.enemyIntent;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                this.getIntentIcon(enemy.intent.type),
                pos.x,
                pos.y - 50
            );
            this.ctx.restore();
        });
    }
    
    /**
     * Entités (joueur + ennemis)
     */
    renderEntities() {
        if (!this.combat.playerPosition) return; // CHECK AJOUTÉ
        
        // Joueur
        const playerPos = this.gridToScreen(
            this.combat.playerPosition.x,
            this.combat.playerPosition.y
        );
        
        // 🎬 Appliquer animation offset
        let playerOffset = { offsetX: 0, offsetY: 0 };
        if (this.animationSystem) {
            playerOffset = this.animationSystem.getEntityOffset(
                this.combat.playerPosition.x,
                this.combat.playerPosition.y
            );
        }
        
        this.drawEntity(
            playerPos.x + playerOffset.offsetX, 
            playerPos.y + playerOffset.offsetY, 
            this.colors.player, 
            '🗡️', 
            'Vous',
            null,
            null,
            playerOffset.hasAnimation // Afficher ombre si animé
        );
        
        // Ennemis
        if (this.combat.enemies && this.combat.enemies.length > 0) {
            this.combat.enemies.forEach((enemy, index) => {
                if (enemy.HP <= 0) return;
                
                const pos = this.gridToScreen(enemy.x, enemy.y);
                
                // 🎬 Appliquer animation offset
                let enemyOffset = { offsetX: 0, offsetY: 0 };
                if (this.animationSystem) {
                    enemyOffset = this.animationSystem.getEntityOffset(enemy.x, enemy.y);
                }
                
                this.drawEntity(
                    pos.x + enemyOffset.offsetX, 
                    pos.y + enemyOffset.offsetY, 
                    this.colors.enemy, 
                    enemy.icon || '👹',
                    enemy.name,
                    enemy.HP,
                    enemy.maxHP,
                    enemyOffset.hasAnimation // Afficher ombre si animé
                );
            });
        }
    }
    
    /**
     * Particules (sang, feu, etc.)
     */
    renderParticles() {
        this.particles = this.particles.filter(p => {
            p.life--;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2; // Gravité
            p.alpha = p.life / p.maxLife;
            
            if (p.life <= 0) return false;
            
            this.ctx.save();
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
            
            return true;
        });
    }
    
    /**
     * Floating numbers (dégâts, soins)
     */
    renderFloatingNumbers() {
        this.floatingNumbers = this.floatingNumbers.filter(fn => {
            fn.life--;
            fn.y -= 1.5;
            fn.alpha = fn.life / fn.maxLife;
            
            if (fn.life <= 0) return false;
            
            this.ctx.save();
            this.ctx.globalAlpha = fn.alpha;
            this.ctx.font = `bold ${fn.size}px Cinzel`;
            this.ctx.fillStyle = fn.color;
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = 3;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            this.ctx.strokeText(fn.text, fn.x, fn.y);
            this.ctx.fillText(fn.text, fn.x, fn.y);
            
            this.ctx.restore();
            
            return true;
        });
    }
    
    /**
     * Tooltip (info au survol)
     */
    renderTooltip() {
        if (!this.hoveredCell || !this.combat.hoveredAction) return;
        
        const action = this.combat.hoveredAction;
        const mousePos = this.gridToScreen(this.hoveredCell.x, this.hoveredCell.y);
        
        // Background
        const tooltipWidth = 200;
        const tooltipHeight = action.type === 'attack' ? 100 : 60;
        const tooltipX = mousePos.x + 20;
        const tooltipY = mousePos.y - tooltipHeight / 2;
        
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(20, 18, 15, 0.95)';
        this.ctx.strokeStyle = '#5a4d3a';
        this.ctx.lineWidth = 2;
        
        this.ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
        this.ctx.strokeRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
        
        // Texte
        this.ctx.fillStyle = '#d4c5b0';
        this.ctx.font = 'bold 16px Cinzel';
        this.ctx.textAlign = 'left';
        
        if (action.type === 'attack') {
            this.ctx.fillText('⚔️ ATTAQUER', tooltipX + 10, tooltipY + 25);
            this.ctx.font = '14px Crimson Text';
            this.ctx.fillText(`Dégâts: ${action.preview.damage}`, tooltipX + 10, tooltipY + 50);
            this.ctx.fillText(
                action.preview.canKill ? '💀 LÉTAL' : `HP restants: ${action.target.HP - action.preview.damage}`,
                tooltipX + 10,
                tooltipY + 75
            );
        } else if (action.type === 'move') {
            this.ctx.fillText('🚶 DÉPLACER', tooltipX + 10, tooltipY + 25);
            if (action.preview.hazard) {
                this.ctx.fillStyle = this.colors.fire;
                this.ctx.fillText(
                    `⚠️ ${action.preview.hazardDamage} dégâts`,
                    tooltipX + 10,
                    tooltipY + 45
                );
            }
        }
        
        this.ctx.restore();
    }
    
    // ═══════════════════════════════════════════════════════
    // HELPERS DESSIN
    // ═══════════════════════════════════════════════════════
    
    drawCell(gridX, gridY, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
            this.offsetX + gridX * this.cellSize + 2,
            this.offsetY + gridY * this.cellSize + 2,
            this.cellSize - 4,
            this.cellSize - 4
        );
    }
    
    drawHazard(gridX, gridY, hazardType) {
        const pos = this.gridToScreen(gridX, gridY);
        const color = this.colors[hazardType];
        
        this.ctx.save();
        this.ctx.fillStyle = color + '40';
        this.ctx.fillRect(
            this.offsetX + gridX * this.cellSize + 5,
            this.offsetY + gridY * this.cellSize + 5,
            this.cellSize - 10,
            this.cellSize - 10
        );
        
        this.ctx.font = '32px serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = color;
        
        const icons = { fire: '🔥', poison: '☠️', void: '🌀' };
        this.ctx.fillText(icons[hazardType] || '⚠️', pos.x, pos.y);
        
        this.ctx.restore();
    }
    
    drawEntity(x, y, color, icon, name, hp = null, maxHP = null, isAnimating = false) {
        // 🎬 Ombre au sol si entité animée (en l'air)
        if (isAnimating) {
            this.ctx.save();
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this.ctx.beginPath();
            this.ctx.ellipse(x, y + 50, 30, 10, 0, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
        
        // Cercle
        this.ctx.save();
        this.ctx.fillStyle = color + '40';
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 35, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        
        // Icône
        this.ctx.font = '40px serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(icon, x, y);
        
        // Nom
        this.ctx.font = 'bold 14px Cinzel';
        this.ctx.fillStyle = color;
        this.ctx.fillText(name, x, y + 55);
        
        // HP bar
        if (hp !== null && maxHP !== null) {
            const barWidth = 60;
            const barHeight = 6;
            const barX = x - barWidth / 2;
            const barY = y + 65;
            
            // Background
            this.ctx.fillStyle = '#000000';
            this.ctx.fillRect(barX, barY, barWidth, barHeight);
            
            // HP
            const hpPercent = hp / maxHP;
            this.ctx.fillStyle = hpPercent > 0.5 ? '#44ff88' : (hpPercent > 0.25 ? '#ffcc00' : '#ff4444');
            this.ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);
            
            // Border
            this.ctx.strokeStyle = color;
            this.ctx.strokeRect(barX, barY, barWidth, barHeight);
        }
        
        this.ctx.restore();
    }
    
    getIntentIcon(intentType) {
        const icons = {
            attack: '⚔️',
            heavy_attack: '⚔️⚔️',
            move_attack: '🏃⚔️',
            defend: '🛡️',
            special: '✨'
        };
        return icons[intentType] || '❓';
    }
    
    // ═══════════════════════════════════════════════════════
    // ANIMATIONS
    // ═══════════════════════════════════════════════════════
    
    async animateAttack(from, to) {
        // Flash + trail
        const fromPos = this.gridToScreen(from.x, from.y);
        const toPos = this.gridToScreen(to.x, to.y);
        
        // Trail de l'attaque
        for (let i = 0; i < 10; i++) {
            const t = i / 10;
            const x = fromPos.x + (toPos.x - fromPos.x) * t;
            const y = fromPos.y + (toPos.y - fromPos.y) * t;
            
            this.trails.push({
                x, y,
                size: 10 - i,
                color: this.colors.player,
                life: 20 - i * 2,
                maxLife: 20
            });
        }
        
        return this.delay(this.config.animationSpeed);
    }
    
    async animateHit(pos, isCrit = false) {
        const screenPos = this.gridToScreen(pos.x, pos.y);
        
        // Particules d'impact
        const count = isCrit ? 20 : 10;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 3;
            
            this.particles.push({
                x: screenPos.x,
                y: screenPos.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2,
                size: isCrit ? 4 : 2,
                color: isCrit ? this.colors.crit : this.colors.damage,
                life: 30,
                maxLife: 30,
                alpha: 1
            });
        }
        
        return this.delay(200);
    }
    
    async animateMove(from, to) {
        // Déplacement fluide (interpolation)
        const steps = 10;
        const fromPos = this.gridToScreen(from.x, from.y);
        const toPos = this.gridToScreen(to.x, to.y);
        
        for (let i = 0; i <= steps; i++) {
            await this.delay(30);
            // Animation gérée côté CombatSystem
        }
    }
    
    /**
     * Affiche un nombre flottant
     */
    showFloatingNumber(gridPos, value, type = 'damage') {
        const pos = this.gridToScreen(gridPos.x, gridPos.y);
        
        const colors = {
            damage: this.colors.damage,
            heal: this.colors.heal,
            crit: this.colors.crit,
            miss: this.colors.miss
        };
        
        this.floatingNumbers.push({
            x: pos.x + (Math.random() - 0.5) * 20,
            y: pos.y - 20,
            text: type === 'crit' ? `CRIT! ${value}` : (type === 'miss' ? 'MISS' : String(value)),
            color: colors[type],
            size: type === 'crit' ? 32 : 24,
            life: 60,
            maxLife: 60,
            alpha: 1
        });
    }
    
    /**
     * Boucle de rendu principale
     */
    startRenderLoop() {
        const loop = () => {
            this.render();
            requestAnimationFrame(loop);
        };
        loop();
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Ajoute un message au combat log
     */
    addLog(message, type = 'system') {
        const logContainer = document.getElementById('logContainer');
        if (!logContainer) return;
        
        const entry = document.createElement('div');
        entry.className = `log-entry log-${type}`;
        
        // Coloration selon le type
        const colors = {
            player: '#4a90e2',
            enemy: '#e74c3c',
            dice: '#9b59b6',
            corruption: '#8b008b',
            system: '#95a5a6',
            success: '#2ecc71',
            death: '#c0392b'
        };
        
        entry.style.color = colors[type] || colors.system;
        entry.textContent = message;
        
        logContainer.appendChild(entry);
        
        // Auto-scroll
        logContainer.scrollTop = logContainer.scrollHeight;
        
        // Limite à 50 entrées
        while (logContainer.children.length > 50) {
            logContainer.removeChild(logContainer.firstChild);
        }
    }
    
    /**
     * Resize canvas
     */
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.render();
    }
}
