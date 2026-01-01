/**
 * 🎬 COMBAT ANIMATION SYSTEM
 * Gère les animations physiques des attaques (jump, dash, knockback)
 * Style : Darkest Dungeon + Slay the Spire
 */

export class CombatAnimationSystem {
    constructor(combatRenderer) {
        this.renderer = combatRenderer;
        this.activeAnimations = [];
        
        console.log('🎬 CombatAnimationSystem initialisé');
    }
    
    // ═══════════════════════════════════════════════════════
    // ATTACK ANIMATION (Jump → Dash → Impact → Return)
    // ═══════════════════════════════════════════════════════
    
    async playAttackAnimation(attackerPos, targetPos, onImpact) {
        console.log('⚔️ Attack animation START:', attackerPos, '→', targetPos);
        
        const duration = {
            windup: 0.15,    // Anticipation (soulève)
            dash: 0.25,      // Dash vers cible (plus long pour voir)
            impact: 0.15,    // Moment d'impact
            return: 0.2      // Retour position
        };
        
        // 1. WINDUP - Se soulève
        await this.animateWindup(attackerPos, duration.windup);
        
        // 2. DASH - Fonce vers la cible (70% de la distance)
        await this.animateDash(attackerPos, targetPos, duration.dash);
        
        // 3. IMPACT - Collision !
        if (onImpact) onImpact(); // Callback pour feedback/dégâts
        await this.wait(duration.impact);
        
        // 4. RETURN - Retour position initiale
        await this.animateReturn(attackerPos, duration.return);
        
        console.log('✅ Attack animation DONE');
    }
    
    async animateWindup(pos, duration) {
        const anim = {
            type: 'windup',
            pos: pos,
            offsetY: 0,
            targetY: -30, // Plus haut !
            progress: 0,
            duration: duration
        };
        
        this.activeAnimations.push(anim);
        
        return new Promise(resolve => {
            const startTime = performance.now();
            const checkInterval = setInterval(() => {
                const elapsed = (performance.now() - startTime) / 1000;
                if (elapsed >= duration) {
                    clearInterval(checkInterval);
                    this.removeAnimation(anim);
                    resolve();
                }
            }, 16);
        });
    }
    
    async animateDash(fromPos, toPos, duration) {
        const anim = {
            type: 'dash',
            fromPos: fromPos,
            toPos: toPos,
            currentX: 0,
            currentY: 0,
            progress: 0,
            duration: duration
        };
        
        this.activeAnimations.push(anim);
        
        return new Promise(resolve => {
            const startTime = performance.now();
            const checkInterval = setInterval(() => {
                const elapsed = (performance.now() - startTime) / 1000;
                if (elapsed >= duration) {
                    clearInterval(checkInterval);
                    this.removeAnimation(anim);
                    resolve();
                }
            }, 16);
        });
    }
    
    async animateReturn(pos, duration) {
        const anim = {
            type: 'return',
            pos: pos,
            offsetX: 0,
            offsetY: 0,
            progress: 0,
            duration: duration
        };
        
        this.activeAnimations.push(anim);
        
        return new Promise(resolve => {
            const startTime = performance.now();
            const checkInterval = setInterval(() => {
                const elapsed = (performance.now() - startTime) / 1000;
                if (elapsed >= duration) {
                    clearInterval(checkInterval);
                    this.removeAnimation(anim);
                    resolve();
                }
            }, 16);
        });
    }
    
    // ═══════════════════════════════════════════════════════
    // KNOCKBACK ANIMATION (Ennemi frappé)
    // ═══════════════════════════════════════════════════════
    
    playKnockbackAnimation(pos, direction = 'left', intensity = 1.0) {
        const anim = {
            type: 'knockback',
            pos: pos,
            offsetX: 0,
            direction: direction,
            intensity: intensity * 15, // Pixels de recul
            progress: 0,
            duration: 0.3
        };
        
        this.activeAnimations.push(anim);
        
        setTimeout(() => {
            this.removeAnimation(anim);
        }, 300);
    }
    
    // ═══════════════════════════════════════════════════════
    // UPDATE & RENDER
    // ═══════════════════════════════════════════════════════
    
    update(deltaTime) {
        for (const anim of this.activeAnimations) {
            anim.progress += deltaTime / anim.duration;
            
            switch(anim.type) {
                case 'windup':
                    // Easing out quad
                    const t1 = Math.min(anim.progress, 1);
                    anim.offsetY = this.easeOutQuad(t1) * anim.targetY;
                    break;
                    
                case 'dash':
                    // Easing in-out cubic
                    const t2 = Math.min(anim.progress, 1);
                    const dx = anim.toPos.x - anim.fromPos.x;
                    const dy = anim.toPos.y - anim.fromPos.y;
                    // Va à 70% de la distance x3 pour BIEN le voir !
                    anim.currentX = this.easeInOutCubic(t2) * dx * this.renderer.cellSize * 0.7 * 3;
                    anim.currentY = this.easeInOutCubic(t2) * dy * this.renderer.cellSize * 0.7 * 3;
                    break;
                    
                case 'return':
                    // Easing out back (bounce)
                    const t3 = Math.min(anim.progress, 1);
                    anim.offsetX = (1 - this.easeOutBack(t3)) * 30;
                    break;
                    
                case 'knockback':
                    // Shake back and forth
                    const t4 = Math.min(anim.progress, 1);
                    const shake = Math.sin(t4 * Math.PI * 6) * (1 - t4); // Oscille puis s'arrête
                    anim.offsetX = shake * anim.intensity * (anim.direction === 'right' ? 1 : -1);
                    break;
            }
        }
    }
    
    getEntityOffset(gridX, gridY) {
        // Retourne l'offset total à appliquer à une entité en position (gridX, gridY)
        let offsetX = 0;
        let offsetY = 0;
        let hasAnimation = false;
        
        for (const anim of this.activeAnimations) {
            if (this.animationAffectsPosition(anim, gridX, gridY)) {
                hasAnimation = true;
                
                switch(anim.type) {
                    case 'windup':
                        offsetY += anim.offsetY;
                        break;
                    case 'dash':
                        offsetX += anim.currentX;
                        offsetY += anim.currentY;
                        break;
                    case 'return':
                        offsetX += anim.offsetX;
                        break;
                    case 'knockback':
                        offsetX += anim.offsetX;
                        break;
                }
            }
        }
        
        return { offsetX, offsetY, hasAnimation };
    }
    
    animationAffectsPosition(anim, gridX, gridY) {
        if (!anim.pos) return false;
        
        if (anim.type === 'dash') {
            return (anim.fromPos.x === gridX && anim.fromPos.y === gridY);
        }
        
        return (anim.pos.x === gridX && anim.pos.y === gridY);
    }
    
    // ═══════════════════════════════════════════════════════
    // EASING FUNCTIONS
    // ═══════════════════════════════════════════════════════
    
    easeOutQuad(t) {
        return t * (2 - t);
    }
    
    easeInOutCubic(t) {
        return t < 0.5 
            ? 4 * t * t * t 
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    easeOutBack(t) {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }
    
    // ═══════════════════════════════════════════════════════
    // UTILS
    // ═══════════════════════════════════════════════════════
    
    removeAnimation(anim) {
        const index = this.activeAnimations.indexOf(anim);
        if (index > -1) {
            this.activeAnimations.splice(index, 1);
        }
    }
    
    wait(seconds) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }
    
    hasActiveAnimations() {
        return this.activeAnimations.length > 0;
    }
    
    clearAll() {
        this.activeAnimations = [];
    }
}
