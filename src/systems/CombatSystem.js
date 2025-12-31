/**
 * ⚔️ COMBAT SYSTEM - THE LAST COVENANT
 * 
 * === SIMPLICITÉ COGNITIVE ===
 * "Facile à apprendre, difficile à maîtriser"
 * 
 * RÈGLES :
 * - 3 ACTIONS : Move, Attack, Special
 * - PREVIEW VISUEL : Tout est montré AVANT validation
 * - FEEDBACK IMMÉDIAT : FX + sons + floating numbers
 * - ZERO CONFUSION : Hover = highlight + tooltip
 * 
 * === INSPIRATION VISUELLE ===
 * - Baldur's Gate 3 : Clarté des actions, tooltips, preview
 * - Diablo 4 : VFX, impacts, feeling
 * - Into the Breach : Télégraphage intentions ennemies
 * 
 * === PHILOSOPHIE ===
 * "Le joueur ne doit JAMAIS se sentir perdu"
 * - Toujours savoir quoi faire
 * - Toujours voir les conséquences
 * - Toujours avoir du feedback
 * 
 * @version 3.0.0 - INTUITIVE TACTICAL
 */

export class CombatSystem {
    constructor(gameInstance, playerStatsSystem, corruptionSystem, introSystem = null) {
        this.game = gameInstance;
        this.playerStats = playerStatsSystem;
        this.corruption = corruptionSystem;
        this.introSystem = introSystem; // NOUVEAU
        
        // ═══════════════════════════════════════════════════════
        // GRILLE SIMPLIFIÉE (3x3 pour commencer)
        // ═══════════════════════════════════════════════════════
        this.gridWidth = 3;
        this.gridHeight = 3;
        this.grid = [];
        
        // Entités
        this.playerPosition = { x: 0, y: 1 }; // Gauche centre
        this.enemies = [];
        
        // ═══════════════════════════════════════════════════════
        // ÉTAT SIMPLIFIÉ
        // ═══════════════════════════════════════════════════════
        this.isActive = false;
        this.turn = 0;
        this.actionsRemaining = 1; // 1 ACTION PAR TOUR (simplifié !)
        this.phase = 'player'; // 'player' | 'enemy'
        
        // Action en cours (pour preview)
        this.hoveredAction = null; // { type, target, preview }
        this.selectedAction = null;
        
        // Flags
        this.diceUsedThisCombat = false;
        this.playerDefending = false; // AJOUTÉ
        
        // Buffs/Status
        this.playerBuffs = [];
        
        // Log
        this.combatLog = [];
        
        // ═══════════════════════════════════════════════════════
        // CONFIG SIMPLIFIÉE
        // ═══════════════════════════════════════════════════════
        this.config = {
            // Combat
            moveRange: 1,              // 1 case de mouvement
            attackRange: 1,            // Mêlée uniquement au départ
            baseDamage: 1.0,           // Multiplicateur de base
            minDamage: 1,              // Dégâts minimum
            critMultiplier: 2.0,       // Multiplicateur critique
            
            // Environnement
            hazardDamage: 10,
            
            // Visual feedback
            damageNumberDuration: 1500,
            highlightDuration: 300,
            animationSpeed: 400
        };
        
        console.log('⚔️ CombatSystem initialisé (INTUITIVE)');
    }
    
    // ═══════════════════════════════════════════════════════
    // INITIALISATION GRILLE & COMBAT
    // ═══════════════════════════════════════════════════════
    
    /**
     * Initialise la grille tactique vide
     */
    initGrid() {
        this.grid = [];
        for (let y = 0; y < this.gridHeight; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.gridWidth; x++) {
                this.grid[y][x] = {
                    type: 'floor',      // floor, wall, pit, hazard
                    entity: null,       // player, enemy, null
                    hazard: null,       // fire, poison, void
                    cover: false        // Donne bonus DEF
                };
            }
        }
        
        // Ajouter obstacles/environnement aléatoires
        this.generateEnvironment();
    }
    
    /**
     * Génère environnement tactique (murs, pièges)
     */
    generateEnvironment() {
        const corruptionLevel = this.corruption.corruption;
        
        // Plus de corruption = plus d'environnement hostile
        const hazardCount = Math.floor(corruptionLevel / 20);
        
        for (let i = 0; i < hazardCount; i++) {
            const x = Math.floor(Math.random() * this.gridWidth);
            const y = Math.floor(Math.random() * this.gridHeight);
            
            if (this.grid[y][x].type === 'floor') {
                const hazards = ['fire', 'poison', 'void'];
                this.grid[y][x].hazard = hazards[Math.floor(Math.random() * hazards.length)];
            }
        }
        
        // Ajouter quelques murs/cover
        const coverCount = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < coverCount; i++) {
            const x = Math.floor(Math.random() * this.gridWidth);
            const y = Math.floor(Math.random() * this.gridHeight);
            
            if (this.grid[y][x].type === 'floor' && !this.grid[y][x].hazard) {
                this.grid[y][x].cover = true;
            }
        }
    }
    
    /**
     * Démarre un combat tactique
     * @param {Array} enemies - Liste d'ennemis (1-3)
     */
    startCombat(enemies) {
        if (this.isActive) {
            console.warn('⚠️ Combat déjà en cours');
            return;
        }
        
        this.isActive = true;
        this.turn = 0;
        this.phase = 'player';
        this.actionsRemaining = 1; // Utiliser 1 action par tour (simplifié)
        this.diceUsedThisCombat = false;
        this.combatLog = [];
        this.narratorComments = [];
        this.playerBuffs = [];
        this.playerStatuses = [];
        
        // Init grille
        this.initGrid();
        
        // Placer joueur (côté gauche)
        this.playerPosition = { 
            x: 0, 
            y: Math.floor(this.gridHeight / 2),
            rank: 'front'
        };
        this.grid[this.playerPosition.y][this.playerPosition.x].entity = 'player';
        
        // Placer ennemis (côté droit)
        this.enemies = [];
        enemies.forEach((enemy, index) => {
            const position = {
                x: this.gridWidth - 1,
                y: index + 1,
                rank: index === 0 ? 'front' : 'back'
            };
            
            this.enemies.push({
                ...enemy,
                ...position,
                intent: null, // Intent pour preview (ITB style)
                HP: enemy.HP,
                maxHP: enemy.HP
            });
            
            this.grid[position.y][position.x].entity = `enemy_${index}`;
        });
        
        // Appliquer modificateurs corruption
        this.applyCorruptionModifiers();
        
        // Calculer intents ennemis (preview)
        this.calculateEnemyIntents();
        
        // Logs
        this.addToLog(`🎮 Bienvenue dans le combat !`, 'system');
        this.addToLog(`💀 Combat contre ${enemies.length} ennemi(s)`, 'system');
        this.triggerCombatStartDialogue();
        
        // Event
        this.emitCombatEvent('combatStart', {
            enemies: this.enemies,
            grid: this.grid,
            playerPos: this.playerPosition
        });
        
        console.log(`⚔️ Combat tactique démarré : ${enemies.length} ennemis`);
    }
    
    /**
     * Applique les modificateurs de corruption sur les ennemis
     */
    applyCorruptionModifiers() {
        const threshold = this.corruption.getCurrentThreshold();
        const modifiers = threshold.effects;
        
        if (modifiers.worldFairness < 1.0) {
            const hostility = modifiers.eventHostility || 0;
            
            this.enemies.forEach(enemy => {
                enemy.HP = Math.floor(enemy.HP * (1 + hostility));
                enemy.maxHP = enemy.HP;
                enemy.ATK = Math.floor(enemy.ATK * (1 + hostility * 0.5));
            });
            
            console.log(`💀 Ennemis renforcés par corruption: +${(hostility * 100).toFixed(0)}%`);
        }
    }
    
    /**
     * Calcule les intentions ennemies (preview ITB-style)
     */
    calculateEnemyIntents() {
        this.enemies.forEach(enemy => {
            enemy.intent = this.determineEnemyIntent(enemy);
        });
        
        this.emitCombatEvent('intentsUpdated', { enemies: this.enemies });
    }
    
    /**
     * Détermine l'intent d'un ennemi
     */
    determineEnemyIntent(enemy) {
        const hpPercent = enemy.HP / enemy.maxHP;
        const distanceToPlayer = this.getDistance(enemy, this.playerPosition);
        
        // Pattern basé sur HP et distance
        if (distanceToPlayer <= 1) {
            if (hpPercent < 0.3) {
                return {
                    type: 'heavy_attack',
                    target: this.playerPosition,
                    damage: Math.floor(enemy.ATK * 1.8),
                    description: 'Attaque désespérée'
                };
            } else {
                return {
                    type: 'attack',
                    target: this.playerPosition,
                    damage: enemy.ATK,
                    description: 'Attaque'
                };
            }
        } else {
            return {
                type: 'move_attack',
                target: this.playerPosition,
                damage: enemy.ATK,
                description: 'Approche + Attaque'
            };
        }
    }
    
    /**
     * Dialogue du Dé en début de combat
     */
    triggerCombatStartDialogue() {
        const corruptionLevel = this.corruption.corruption;
        const dialogues = {
            low: [
                "Un petit combat tactique ? Ennuyeux.",
                "Tu pourrais... pimenter les choses."
            ],
            medium: [
                "Regarde bien leurs intentions. Ou... laisse-moi décider.",
                "Chaque case compte. Sauf si tu triches."
            ],
            high: [
                "La grille tremble. Elle sent ta corruption.",
                "Position parfaite pour... un **accident**."
            ],
            extreme: [
                "Tu peux les **effacer**. Dis juste le mot.",
                "L'environnement lui-même te craint."
            ]
        };
        
        let category = 'low';
        if (corruptionLevel > 15) category = 'extreme';
        else if (corruptionLevel > 10) category = 'high';
        else if (corruptionLevel > 5) category = 'medium';
        
        const options = dialogues[category];
        if (Math.random() < 0.3 && options) {
            const dialogue = options[Math.floor(Math.random() * options.length)];
            this.addNarratorComment(dialogue);
        }
    }
    
    // ═══════════════════════════════════════════════════════
    // ACTIONS JOUEUR - TACTIQUES
    // ═══════════════════════════════════════════════════════
    
    /**
     * Déplace le joueur (1 action)
     * @param {number} targetX - Position X cible
     * @param {number} targetY - Position Y cible
     */
    movePlayer(targetX, targetY) {
        if (!this.isActive || this.actionsRemaining <= 0) {
            return { success: false, reason: 'no_actions' };
        }
        
        // Vérifier distance
        const distance = this.getDistance(this.playerPosition, { x: targetX, y: targetY });
        if (distance > this.config.moveRange) {
            this.addToLog('❌ Trop loin !', 'error');
            return { success: false, reason: 'too_far' };
        }
        
        // Vérifier case libre
        const targetCell = this.grid[targetY][targetX];
        if (targetCell.type === 'wall' || targetCell.entity) {
            this.addToLog('❌ Case bloquée !', 'error');
            return { success: false, reason: 'blocked' };
        }
        
        // 👣 SON DE PAS !
        if (window.soundSystem && window.soundSystem.playSound) {
            window.soundSystem.playSound('footsteps');
        }
        
        // Déplacer
        this.grid[this.playerPosition.y][this.playerPosition.x].entity = null;
        this.playerPosition.x = targetX;
        this.playerPosition.y = targetY;
        this.grid[targetY][targetX].entity = 'player';
        
        // Vérifier hazard
        if (targetCell.hazard) {
            this.applyHazardDamage(targetCell.hazard);
        }
        
        this.actionsRemaining--;
        this.addToLog(`🚶 Déplacement vers (${targetX}, ${targetY})`, 'player');
        
        // Si plus d'actions, passer au tour ennemi AUTO
        if (this.actionsRemaining <= 0) {
            this.addToLog('⏭️ Plus d\'actions, tour ennemi...', 'system');
            setTimeout(() => this.endTurn(), 1000);
        }
        
        this.emitCombatEvent('playerMoved', { 
            position: this.playerPosition,
            actionsRemaining: this.actionsRemaining
        });
        
        return { success: true };
    }
    
    /**
     * Attaque un ennemi (1 action)
     * @param {number} enemyIndex - Index de l'ennemi
     */
    attackEnemy(enemyIndex) {
        if (!this.isActive || this.actionsRemaining <= 0) {
            return { success: false, reason: 'no_actions' };
        }
        
        const enemy = this.enemies[enemyIndex];
        if (!enemy || enemy.HP <= 0) {
            return { success: false, reason: 'invalid_target' };
        }
        
        // Vérifier portée
        const distance = this.getDistance(this.playerPosition, enemy);
        if (distance > this.config.attackRange) {
            this.addToLog('❌ Hors de portée !', 'error');
            return { success: false, reason: 'out_of_range' };
        }
        
        // Calcul dégâts
        const playerStats = this.playerStats.getStats();
        let baseDamage = playerStats.ATK;
        
        // Appliquer buffs
        baseDamage *= this.getPlayerStatModifier('ATK');
        
        // Variance
        baseDamage *= (0.9 + Math.random() * 0.2);
        
        // Réduction DEF
        let finalDamage = Math.max(
            this.config.minDamage,
            baseDamage - (enemy.DEF || 0) * 0.5
        );
        
        // Critique ?
        let isCrit = false;
        if (Math.random() < playerStats.CRIT_CHANCE) {
            finalDamage *= this.config.critMultiplier;
            isCrit = true;
        }
        
        finalDamage = Math.floor(finalDamage);
        enemy.HP -= finalDamage;
        
        const critText = isCrit ? ' 💥 CRITIQUE !' : '';
        this.addToLog(`⚔️ ${enemy.name} : ${finalDamage} dégâts${critText}`, 'player');
        
        // 🎬 ANIMATION D'ATTAQUE !
        if (this.animationSystem) {
            // Animation asynchrone (jump → dash → impact → return)
            this.animationSystem.playAttackAnimation(
                this.playerPosition,
                enemy,
                () => {
                    // Callback au moment de l'impact
                    // 🔥 FEEDBACK VISUEL !
                    const isKill = enemy.HP <= 0;
                    if (this.feedbackSystem) {
                        this.feedbackSystem.playAttackFeedback(
                            this.playerPosition, 
                            enemy, 
                            finalDamage, 
                            isCrit, 
                            isKill
                        );
                    }
                    
                    // Knockback de l'ennemi
                    this.animationSystem.playKnockbackAnimation(enemy, 'right', isCrit ? 2.0 : 1.0);
                }
            );
        } else {
            // Fallback si pas d'animation system
            const isKill = enemy.HP <= 0;
            if (this.feedbackSystem) {
                this.feedbackSystem.playAttackFeedback(
                    this.playerPosition, 
                    enemy, 
                    finalDamage, 
                    isCrit, 
                    isKill
                );
            }
        }
        
        // Mort ?
        if (enemy.HP <= 0) {
            this.onEnemyDeath(enemyIndex);
        }
        
        this.actionsRemaining--;
        
        // Si plus d'actions, passer au tour ennemi AUTO
        if (this.actionsRemaining <= 0) {
            this.addToLog('⏭️ Plus d\'actions, tour ennemi...', 'system');
            setTimeout(() => this.endTurn(), 1000);
        }
        
        this.emitCombatEvent('enemyDamaged', { 
            enemyIndex, 
            damage: finalDamage, 
            isCrit,
            actionsRemaining: this.actionsRemaining
        });
        
        return { success: true, damage: finalDamage, isCrit };
    }
    
    /**
     * Attaque avec push (1 action)
     * Repousse l'ennemi d'une case
     */
    pushAttack(enemyIndex) {
        if (!this.isActive || this.actionsRemaining <= 0) {
            return { success: false };
        }
        
        const enemy = this.enemies[enemyIndex];
        if (!enemy) return { success: false };
        
        // Attaquer d'abord
        const attackResult = this.attackEnemy(enemyIndex);
        if (!attackResult.success) return attackResult;
        
        // Push si vivant
        if (enemy.HP > 0) {
            const pushDir = {
                x: enemy.x > this.playerPosition.x ? 1 : -1,
                y: 0
            };
            
            const newX = enemy.x + pushDir.x;
            const newY = enemy.y;
            
            // Vérifier limites
            if (newX >= 0 && newX < this.gridWidth && this.grid[newY][newX].entity === null) {
                // Déplacer ennemi
                this.grid[enemy.y][enemy.x].entity = null;
                enemy.x = newX;
                this.grid[newY][newX].entity = `enemy_${enemyIndex}`;
                
                this.addToLog(`💨 ${enemy.name} repoussé !`, 'player');
                
                // Dégâts si envoyé sur hazard
                if (this.grid[newY][newX].hazard) {
                    const hazardDamage = this.config.environmentDamage;
                    enemy.HP -= hazardDamage;
                    this.addToLog(`🔥 ${enemy.name} : ${hazardDamage} dégâts (environnement)`, 'environment');
                    
                    if (enemy.HP <= 0) {
                        this.onEnemyDeath(enemyIndex);
                    }
                }
            }
        }
        
        return { success: true };
    }
    
    /**
     * Défense tactique (1 action) - Réduit dégâts ET gagne cover
     */
    defend() {
        if (!this.isActive || this.actionsRemaining <= 0) {
            return { success: false };
        }
        
        this.playerDefending = true;
        
        // Chercher cover à proximité
        const nearCover = this.findNearestCover();
        if (nearCover) {
            this.addToLog(`🛡️ Défense (Cover : +${nearCover.bonus}% DEF)`, 'player');
        } else {
            this.addToLog('🛡️ Défense (+50% réduction dégâts)', 'player');
        }
        
        this.actionsRemaining--;
        return { success: true };
    }
    
    /**
     * Utilise un objet (1 action)
     */
    useItem(itemIndex) {
        if (!this.isActive || this.actionsRemaining <= 0) {
            return { success: false };
        }
        
        const item = this.playerStats.inventory.items[itemIndex];
        if (!item || item.type !== 'consumable') {
            this.addToLog('❌ Objet invalide', 'error');
            return { success: false };
        }
        
        // Effets
        if (item.effect) {
            if (item.effect.HP) {
                const healed = this.playerStats.heal(item.effect.HP);
                this.addToLog(`💚 ${item.name} : +${healed} HP`, 'player');
            }
            
            if (item.effect.corruption) {
                this.corruption.addCorruption(
                    Math.abs(item.effect.corruption),
                    `Utilisation: ${item.name}`
                );
            }
            
            if (item.effect.buff) {
                this.addPlayerBuff(item.effect.buff);
                this.addToLog(`✨ ${item.name} : ${item.effect.buff.name}`, 'player');
            }
        }
        
        this.playerStats.useItem(itemIndex);
        this.actionsRemaining--;
        
        return { success: true, item };
    }
    
    /**
     * Utilise le Dé (1 action, 1x par combat)
     */
    useDice() {
        if (!this.isActive || this.actionsRemaining <= 0) {
            return { success: false };
        }
        
        if (this.diceUsedThisCombat) {
            this.addToLog('❌ Dé déjà utilisé ce combat !', 'error');
            return { success: false };
        }
        
        // Lancer le dé
        const roll = Math.floor(Math.random() * 6) + 1;
        this.diceUsedThisCombat = true;
        
        // Appliquer effet
        const result = this.applyDiceEffect(roll);
        
        // Corruption
        const corruptionGain = 1 + roll * 0.5;
        this.corruption.addCorruption(corruptionGain, `Dé (${roll})`);
        this.corruption.rememberAction('force_six');
        
        this.addToLog(`🎲 Dé : ${roll} | ${result.description}`, 'dice');
        
        this.actionsRemaining--;
        return { success: true, roll, result };
    }
    
    /**
     * Termine le tour joueur
     */
    async endTurn() {
        if (!this.isActive) return;
        
        this.actionsRemaining = 0;
        this.turn++;
        
        this.addToLog(`--- Fin tour ${this.turn} ---`, 'system');
        
        // Afficher "TOUR ENNEMI"
        if (this.introSystem) {
            await this.introSystem.showTurnChange('enemy', this.turn);
        }
        
        // Phase ennemie
        this.phase = 'enemy';
        setTimeout(() => this.executeEnemyPhase(), 800);
    }
    
    // ═══════════════════════════════════════════════════════
    // PHASE ENNEMIE (avec Preview)
    // ═══════════════════════════════════════════════════════
    
    /**
     * Exécute la phase ennemie (tous les ennemis)
     */
    async executeEnemyPhase() {
        if (!this.isActive) return;
        
        this.addToLog(`--- Tour ${this.turn} : Ennemis ---`, 'system');
        
        // Exécuter tous les ennemis vivants
        for (let i = 0; i < this.enemies.length; i++) {
            const enemy = this.enemies[i];
            if (enemy.HP > 0) {
                await this.executeEnemyAction(i);
                await this.delay(600);
            }
        }
        
        // Recalculer intents pour prochain tour
        this.calculateEnemyIntents();
        
        // Phase environnement
        this.executeEnvironmentPhase();
        
        // Afficher "VOTRE TOUR"
        if (this.introSystem) {
            await this.introSystem.showTurnChange('player', this.turn + 1);
        }
        
        // Retour au joueur
        this.phase = 'player';
        this.actionsRemaining = 1;
        this.playerDefending = false;
        
        this.emitCombatEvent('playerTurnStart', {
            turn: this.turn,
            actionsRemaining: this.actionsRemaining
        });
    }
    
    /**
     * Exécute l'action d'un ennemi (selon intent)
     */
    async executeEnemyAction(enemyIndex) {
        const enemy = this.enemies[enemyIndex];
        if (!enemy) {
            console.warn(`⚠️ Ennemi ${enemyIndex} introuvable`);
            return;
        }
        
        // Event : Tour de cet ennemi
        this.emitCombatEvent('enemyTurnStart', {
            enemyId: `enemy_${enemyIndex}`,
            enemy: enemy
        });
        
        // RECALCULER l'intent maintenant (distance peut avoir changé)
        const currentDistance = this.getDistance(enemy, this.playerPosition);
        enemy.intent = this.determineEnemyIntent(enemy);
        
        const intent = enemy.intent;
        
        console.log(`🤖 ${enemy.name} à distance ${currentDistance}, intent: ${intent.type}`);
        this.addToLog(`${enemy.name} : ${intent.description || intent.type}`, 'system');
        
        switch(intent.type) {
            case 'attack':
                await this.enemyAttack(enemy, intent);
                break;
            case 'heavy_attack':
                await this.enemyHeavyAttack(enemy, intent);
                break;
            case 'move_attack':
                await this.enemyMoveAndAttack(enemy, intent);
                break;
            default:
                console.warn(`⚠️ Intent type inconnu: ${intent.type}`);
                // Si trop loin, ne rien faire
                if (currentDistance > 1) {
                    this.addToLog(`${enemy.name} hésite...`, 'system');
                } else {
                    await this.enemyAttack(enemy, { damage: enemy.ATK });
                }
        }
    }
    
    /**
     * Attaque ennemie
     */
    async enemyAttack(enemy, intent) {
        // VÉRIFIER PORTÉE (doit être adjacent)
        const distance = this.getDistance(enemy, this.playerPosition);
        if (distance > 1) {
            console.warn(`⚠️ ${enemy.name} trop loin pour attaquer (distance: ${distance})`);
            this.addToLog(`${enemy.name} rate son attaque (trop loin)`, 'system');
            return;
        }
        
        // 🎬 ANIMATION ENNEMIE !
        if (this.animationSystem) {
            await this.animationSystem.playAttackAnimation(
                enemy, // Position ennemi
                this.playerPosition, // Position joueur
                () => {
                    // Callback au moment de l'impact
                    this.applyEnemyDamage(enemy, intent);
                }
            );
        } else {
            // Fallback sans animation
            this.applyEnemyDamage(enemy, intent);
        }
    }
    
    // Fonction helper pour appliquer les dégâts (séparée pour réutilisation)
    applyEnemyDamage(enemy, intent) {
        
        // 🔊 SON D'ATTAQUE ENNEMIE !
        if (window.soundSystem && window.soundSystem.playSound) {
            window.soundSystem.playSound('enemyAttack');
        }
        
        const playerStats = this.playerStats.getStats();
        
        let damage = intent.damage || enemy.ATK;
        damage *= (0.9 + Math.random() * 0.2);
        
        // Défense joueur
        if (this.playerDefending) {
            damage *= this.config.defenseReduction;
        }
        
        // Cover
        const playerCell = this.grid[this.playerPosition.y][this.playerPosition.x];
        if (playerCell && playerCell.cover) {
            damage *= 0.7; // -30%
        }
        
        damage = Math.floor(damage);
        
        // Infliger
        this.playerStats.takeDamage(damage, enemy.name);
        
        // Corruption (stress DD-style)
        const stressGain = Math.floor(damage / 10);
        if (stressGain > 0) {
            this.corruption.addCorruption(stressGain * 0.1, 'Stress Combat');
        }
        
        this.addToLog(`💥 ${enemy.name} attaque : ${damage} dégâts`, 'enemy');
        
        // 🎬 KNOCKBACK DU JOUEUR !
        if (this.animationSystem) {
            // Direction opposée à l'ennemi
            const knockbackDir = enemy.x < this.playerPosition.x ? 'right' : 'left';
            this.animationSystem.playKnockbackAnimation(this.playerPosition, knockbackDir, 1.5);
        }
        
        // FORCER UPDATE UI IMMÉDIAT
        this.emitCombatEvent('playerDamaged', {
            damage,
            source: enemy.name,
            currentHP: this.playerStats.getStats().HP
        });
        
        // Check mort
        const currentHP = this.playerStats.getStats().HP;
        console.log(`🩸 HP joueur après attaque: ${currentHP}`);
        
        if (currentHP <= 0) {
            this.onPlayerDeath();
        }
    }
    
    /**
     * Attaque lourde ennemie
     */
    async enemyHeavyAttack(enemy, intent) {
        const damage = Math.floor(intent.damage * 1.5);
        intent.damage = damage;
        await this.enemyAttack(enemy, intent);
        this.addToLog(`💥💥 ${enemy.name} ATTAQUE LOURDE !`, 'enemy');
    }
    
    /**
     * Ennemi se déplace puis attaque
     */
    async enemyMoveAndAttack(enemy, intent) {
        // Calculer déplacement vers joueur
        const moveDir = {
            x: this.playerPosition.x > enemy.x ? 1 : (this.playerPosition.x < enemy.x ? -1 : 0),
            y: this.playerPosition.y > enemy.y ? 1 : (this.playerPosition.y < enemy.y ? -1 : 0)
        };
        
        const newX = enemy.x + moveDir.x;
        const newY = enemy.y + moveDir.y;
        
        // Vérifier case valide
        if (newX >= 0 && newX < this.gridWidth && 
            newY >= 0 && newY < this.gridHeight &&
            !this.grid[newY][newX].entity) {
            
            // 👣 SON DE PAS ENNEMI !
            if (window.soundSystem && window.soundSystem.playSound) {
                window.soundSystem.playSound('footsteps');
            }
            
            // Déplacer
            this.grid[enemy.y][enemy.x].entity = null;
            enemy.x = newX;
            enemy.y = newY;
            this.grid[newY][newX].entity = `enemy_${this.enemies.indexOf(enemy)}`;
            
            this.addToLog(`🚶 ${enemy.name} avance`, 'enemy');
            await this.delay(400);
        }
        
        // Attaquer si à portée
        if (this.getDistance(enemy, this.playerPosition) <= 1) {
            await this.enemyAttack(enemy, intent);
        }
    }
    
    /**
     * Phase environnement (hazards, etc.)
     */
    executeEnvironmentPhase() {
        // Dégâts hazards sur entités
        const playerCell = this.grid[this.playerPosition.y][this.playerPosition.x];
        if (playerCell.hazard) {
            const damage = this.config.environmentDamage;
            this.playerStats.takeDamage(damage, `Hazard: ${playerCell.hazard}`);
            this.addToLog(`🔥 Hazard : ${damage} dégâts`, 'environment');
        }
        
        // Ennemis sur hazards
        this.enemies.forEach((enemy, index) => {
            if (enemy.HP <= 0) return;
            
            const enemyCell = this.grid[enemy.y][enemy.x];
            if (enemyCell.hazard) {
                const damage = this.config.environmentDamage;
                enemy.HP -= damage;
                this.addToLog(`🔥 ${enemy.name} : ${damage} dégâts (hazard)`, 'environment');
                
                if (enemy.HP <= 0) {
                    this.onEnemyDeath(index);
                }
            }
        });
    }
    
    // ═══════════════════════════════════════════════════════
    // EFFETS & UTILITAIRES
    // ═══════════════════════════════════════════════════════
    
    /**
     * Applique effet hazard sur joueur
     */
    applyHazardDamage(hazardType) {
        const damage = this.config.environmentDamage;
        this.playerStats.takeDamage(damage, `Hazard: ${hazardType}`);
        
        const hazardNames = {
            fire: '🔥 Feu',
            poison: '☠️ Poison',
            void: '🌀 Vide'
        };
        
        this.addToLog(`${hazardNames[hazardType]} : ${damage} dégâts`, 'environment');
    }
    
    /**
     * Applique l'effet d'un lancer de dé
     */
    applyDiceEffect(roll) {
        const effects = {
            1: {
                description: "Échec - Ennemi aléatoire riposte !",
                apply: () => {
                    const aliveEnemies = this.enemies.filter(e => e.HP > 0);
                    if (aliveEnemies.length > 0) {
                        const randomEnemy = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
                        const damage = Math.floor(randomEnemy.ATK * 0.5);
                        this.playerStats.takeDamage(damage, 'Riposte du Dé');
                    }
                }
            },
            2: {
                description: "Rien. Le Dé observe.",
                apply: () => {}
            },
            3: {
                description: "+15% ATK ce tour",
                apply: () => {
                    this.addPlayerBuff({
                        name: 'Boost du Dé',
                        duration: 1,
                        effect: { stat: 'ATK', modifier: 1.15 }
                    });
                }
            },
            4: {
                description: "+25% ATK + déplacement gratuit",
                apply: () => {
                    this.addPlayerBuff({
                        name: 'Boost du Dé',
                        duration: 1,
                        effect: { stat: 'ATK', modifier: 1.25 }
                    });
                    this.actionsRemaining++; // Action bonus
                }
            },
            5: {
                description: "+35% ATK + Push gratuit",
                apply: () => {
                    this.addPlayerBuff({
                        name: 'Grand Boost',
                        duration: 1,
                        effect: { stat: 'ATK', modifier: 1.35, freePush: true }
                    });
                }
            },
            6: {
                description: "OMNIPOTENCE : +50% ATK, Crit garanti, +2 actions",
                apply: () => {
                    this.addPlayerBuff({
                        name: 'Bénédiction du Dé',
                        duration: 1,
                        effect: { 
                            stat: 'ATK', 
                            modifier: 1.50, 
                            guaranteedCrit: true
                        }
                    });
                    this.actionsRemaining += 2;
                }
            }
        };
        
        const effect = effects[roll];
        effect.apply();
        
        return effect;
    }
    
    /**
     * Vérifie si une case est marchable
     */
    isCellWalkable(x, y) {
        if (x < 0 || x >= this.gridWidth || y < 0 || y >= this.gridHeight) {
            return false;
        }
        
        const cell = this.grid[y][x];
        if (cell.type === 'wall') return false;
        if (cell.entity) return false;
        
        return true;
    }

    
    // ═══════════════════════════════════════════════════════
    // BUFFS & DEBUFFS
    // ═══════════════════════════════════════════════════════
    
    /**
     * Ajoute un buff au joueur
     */
    addPlayerBuff(buff) {
        this.playerBuffs.push({
            name: buff.name,
            duration: buff.duration,
            effect: buff.effect
        });
    }
    
    /**
     * Décompte les buffs
     */
    tickBuffs() {
        this.playerBuffs = this.playerBuffs.filter(buff => {
            buff.duration--;
            if (buff.duration <= 0) {
                this.addToLog(`⏱️ ${buff.name} disparaît`, 'info');
                return false;
            }
            return true;
        });
    }
    
    /**
     * Retourne modificateur de stat total
     */
    getPlayerStatModifier(statName) {
        let modifier = 1.0;
        
        this.playerBuffs.forEach(buff => {
            if (buff.effect?.stat === statName) {
                modifier *= buff.effect.modifier;
            }
        });
        
        return modifier;
    }
    
    // ═══════════════════════════════════════════════════════
    // FIN DE COMBAT
    // ═══════════════════════════════════════════════════════
    
    /**
     * Mort d'un ennemi
     */
    onEnemyDeath(enemyIndex) {
        const enemy = this.enemies[enemyIndex];
        this.addToLog(`💀 ${enemy.name} éliminé !`, 'victory');
        
        // Libérer case
        this.grid[enemy.y][enemy.x].entity = null;
        
        // Stats
        this.playerStats.stats.enemiesKilled++;
        
        // Check victoire totale
        const aliveEnemies = this.enemies.filter(e => e.HP > 0);
        if (aliveEnemies.length === 0) {
            this.endCombat(true);
        }
    }
    
    /**
     * Mort du joueur
     */
    onPlayerDeath() {
        this.addToLog('💀 Vous êtes mort...', 'death');
        
        // Résurrection automatique (pacte)
        this.corruption.addCorruption(1, 'Résurrection Automatique');
        this.playerStats.currentStats.HP = this.playerStats.currentStats.maxHP;
        
        this.addToLog('✨ Le Pacte vous ramène...', 'resurrection');
        this.addNarratorComment("Encore ? **Intéressant**...");
        
        // Fin du combat avec défaite
        setTimeout(() => this.endCombat(false), 1000);
    }
    
    /**
     * Termine le combat
     */
    async endCombat(victory) {
        this.isActive = false;
        
        if (victory) {
            const totalEnemies = this.enemies.length;
            this.addToLog(`🎉 Victoire ! (${totalEnemies} ennemis éliminés)`, 'victory');
            
            // Loot (combiné de tous les ennemis)
            const loot = this.generateLoot();
            if (loot.gold > 0) {
                this.playerStats.addGold(loot.gold);
                this.addToLog(`💰 +${loot.gold} gold`, 'loot');
            }
            
            if (loot.items.length > 0) {
                loot.items.forEach(item => {
                    this.playerStats.addItem(item);
                    this.addToLog(`📦 ${item.name} trouvé !`, 'loot');
                });
            }
            
            // Écran de victoire
            if (this.introSystem) {
                await this.introSystem.showVictory(loot);
            }
        } else {
            this.addToLog('💀 Défaite (résurrection)...', 'defeat');
            
            // Écran de défaite
            if (this.introSystem) {
                await this.introSystem.showDefeat();
            }
        }
        
        // Event
        this.emitCombatEvent('combatEnd', {
            victory,
            enemies: this.enemies,
            loot: victory ? this.generateLoot() : null
        });
        
        console.log(`⚔️ Combat terminé : ${victory ? 'Victoire' : 'Défaite'}`);
    }
    
    /**
     * Génère le loot de tous les ennemis
     */
    generateLoot() {
        let totalGold = 0;
        const items = [];
        
        this.enemies.forEach(enemy => {
            const baseGold = enemy.goldDrop || [5, 15];
            totalGold += Math.floor(
                baseGold[0] + Math.random() * (baseGold[1] - baseGold[0])
            );
            
            // Items
            if (enemy.itemDrop && Math.random() < (enemy.itemDrop.chance || 0.3)) {
                items.push(enemy.itemDrop.item);
            }
        });
        
        return { gold: totalGold, items };
    }
    
    // ═══════════════════════════════════════════════════════
    // UTILITAIRES TACTIQUES
    // ═══════════════════════════════════════════════════════
    
    /**
     * Calcule distance (Chebyshev = diagonales autorisées)
     */
    getDistance(pos1, pos2) {
        // Distance de Chebyshev : max(deltaX, deltaY)
        // Permet mouvement en diagonale
        return Math.max(Math.abs(pos1.x - pos2.x), Math.abs(pos1.y - pos2.y));
    }
    
    /**
     * Cherche le cover le plus proche
     */
    findNearestCover() {
        let nearestCover = null;
        let minDistance = Infinity;
        
        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                if (this.grid[y][x].cover) {
                    const distance = this.getDistance(this.playerPosition, { x, y });
                    if (distance < minDistance) {
                        minDistance = distance;
                        nearestCover = { x, y, distance, bonus: 30 };
                    }
                }
            }
        }
        
        return nearestCover;
    }
    
    /**
     * Vérifie si une case est valide et libre
     */
    isCellWalkable(x, y) {
        if (x < 0 || x >= this.gridWidth || y < 0 || y >= this.gridHeight) {
            return false;
        }
        
        const cell = this.grid[y][x];
        return cell.type !== 'wall' && cell.entity === null;
    }
    
    /**
     * Ajoute un commentaire du narrateur
     */
    addNarratorComment(comment) {
        this.narratorComments.push({
            text: comment,
            timestamp: Date.now()
        });
        
        this.addToLog(`🎲 Dé : "${comment}"`, 'dice');
    }
    
    /**
     * Utilitaire delay pour async
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Ajoute une entrée au log
     */
    addToLog(message, type = 'info') {
        this.combatLog.push({
            message,
            type,
            timestamp: Date.now()
        });
        
        if (this.combatLog.length > 50) {
            this.combatLog.shift();
        }
        
        // Dispatch event pour l'UI
        window.dispatchEvent(new CustomEvent('combatLog', {
            detail: { message, type }
        }));
    }
    
    /**
     * Émet un event de combat
     */
    emitCombatEvent(eventName, data) {
        const event = new CustomEvent(`combat:${eventName}`, {
            detail: {
                ...data,
                turn: this.turn,
                phase: this.phase,
                actionsRemaining: this.actionsRemaining,
                grid: this.grid,
                playerPos: this.playerPosition,
                enemies: this.enemies
            }
        });
        window.dispatchEvent(event);
    }
    
    /**
     * Retourne l'état actuel du combat
     */
    getState() {
        return {
            isActive: this.isActive,
            turn: this.turn,
            phase: this.phase,
            actionsRemaining: this.actionsRemaining,
            grid: this.grid,
            playerPosition: this.playerPosition,
            enemies: this.enemies,
            playerBuffs: this.playerBuffs,
            diceUsed: this.diceUsedThisCombat,
            log: this.combatLog.slice(-10)
        };
    }
}
