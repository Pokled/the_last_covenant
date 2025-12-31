/**
 * 🎮 COMBAT FEEDBACK SYSTEM - DOPAMINE ENGINE
 * Système de feedback viscéral pour rendre chaque action SATISFAISANTE
 * Inspiré de : Hades, Slay the Spire, Darkest Dungeon
 */

export class CombatFeedbackSystem {
    constructor(canvas, ctx, soundSystem = null) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.soundSystem = soundSystem; // 🔊 AJOUT
        
        // Particules actives
        this.particles = [];
        this.floatingTexts = [];
        
        // Screen shake
        this.shakeOffset = { x: 0, y: 0 };
        this.shakeIntensity = 0;
        this.shakeDuration = 0;
        
        // Flash effects
        this.flashes = [];
        
        // Slow motion
        this.timeScale = 1.0;
        this.slowMoTarget = 1.0;
        
        // Combo system
        this.comboCounter = 0;
        this.comboTimer = 0;
        this.lastHitTime = 0;
        
        console.log('💥 CombatFeedbackSystem initialisé - DOPAMINE MODE ON');
    }
    
    // ═══════════════════════════════════════════════════════
    // FLOATING DAMAGE NUMBERS (Satisfying Pop!)
    // ═══════════════════════════════════════════════════════
    
    createFloatingDamage(x, y, damage, type = 'normal') {
        const text = new FloatingDamage(x, y, damage, type);
        this.floatingTexts.push(text);
        
        // Son selon type
        if (type === 'critical') {
            this.playSound('crit_hit');
        } else if (type === 'kill') {
            this.playSound('kill_confirm');
        }
    }
    
    // ═══════════════════════════════════════════════════════
    // SCREEN SHAKE (Impact Viscéral)
    // ═══════════════════════════════════════════════════════
    
    screenShake(intensity = 10, duration = 0.3) {
        this.shakeIntensity = intensity;
        this.shakeDuration = duration;
    }
    
    updateScreenShake(deltaTime) {
        if (this.shakeDuration > 0) {
            this.shakeDuration -= deltaTime;
            
            // Shake diminue progressivement
            const progress = this.shakeDuration / 0.3;
            const currentIntensity = this.shakeIntensity * progress;
            
            this.shakeOffset.x = (Math.random() - 0.5) * currentIntensity;
            this.shakeOffset.y = (Math.random() - 0.5) * currentIntensity;
        } else {
            this.shakeOffset.x = 0;
            this.shakeOffset.y = 0;
        }
    }
    
    applyShake(ctx) {
        if (this.shakeOffset.x !== 0 || this.shakeOffset.y !== 0) {
            ctx.translate(this.shakeOffset.x, this.shakeOffset.y);
        }
    }
    
    // ═══════════════════════════════════════════════════════
    // PARTICLES (Blood, Sparks, etc.)
    // ═══════════════════════════════════════════════════════
    
    createBloodSplatter(x, y, count = 15, color = '#8b0000') {
        for (let i = 0; i < count; i++) {
            const angle = (Math.random() * Math.PI * 2);
            const speed = Math.random() * 6 + 2;
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 2, // Légèrement vers le haut
                size: Math.random() * 4 + 2,
                life: 1.0,
                color: color,
                gravity: 0.3,
                type: 'blood'
            });
        }
    }
    
    createImpactSparks(x, y, count = 8) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.random() * Math.PI * 2);
            const speed = Math.random() * 8 + 3;
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 3 + 1,
                life: 1.0,
                color: '#ffa500',
                gravity: 0,
                type: 'spark'
            });
        }
    }
    
    createCriticalEffect(x, y) {
        // Étoiles dorées qui tournent
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const distance = 40;
            
            this.particles.push({
                x: x + Math.cos(angle) * distance,
                y: y + Math.sin(angle) * distance,
                vx: Math.cos(angle) * 2,
                vy: Math.sin(angle) * 2,
                size: 4,
                life: 1.0,
                color: '#ffd700',
                gravity: 0,
                type: 'star',
                rotation: 0,
                rotationSpeed: 0.2
            });
        }
    }
    
    updateParticles(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            // Physique
            p.vy += p.gravity;
            p.x += p.vx * deltaTime * 60;
            p.y += p.vy * deltaTime * 60;
            p.vx *= 0.98; // Friction
            p.life -= deltaTime * 2;
            
            if (p.rotationSpeed) {
                p.rotation += p.rotationSpeed;
            }
            
            // Supprimer si mort
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    renderParticles(ctx) {
        this.particles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = p.life;
            
            if (p.type === 'star') {
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                this.drawStar(ctx, 0, 0, 5, p.size, p.size * 0.5, p.color);
            } else {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
        });
    }
    
    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }
    
    // ═══════════════════════════════════════════════════════
    // FLASH EFFECTS
    // ═══════════════════════════════════════════════════════
    
    createFlash(x, y, width, height, color = '#ffffff', duration = 0.1) {
        this.flashes.push({
            x, y, width, height, color,
            life: 1.0,
            duration: duration
        });
    }
    
    createScreenFlash(color = 'rgba(255, 255, 255, 0.5)', duration = 0.15) {
        this.flashes.push({
            x: 0, y: 0, 
            width: this.canvas.width, 
            height: this.canvas.height, 
            color,
            life: 1.0,
            duration: duration,
            fullscreen: true
        });
    }
    
    updateFlashes(deltaTime) {
        for (let i = this.flashes.length - 1; i >= 0; i--) {
            const flash = this.flashes[i];
            flash.life -= deltaTime / flash.duration;
            
            if (flash.life <= 0) {
                this.flashes.splice(i, 1);
            }
        }
    }
    
    renderFlashes(ctx) {
        this.flashes.forEach(flash => {
            ctx.save();
            ctx.globalAlpha = flash.life;
            ctx.fillStyle = flash.color;
            ctx.fillRect(flash.x, flash.y, flash.width, flash.height);
            ctx.restore();
        });
    }
    
    // ═══════════════════════════════════════════════════════
    // SLOW MOTION (Bullet Time!)
    // ═══════════════════════════════════════════════════════
    
    setTimeScale(scale, duration = 0.5) {
        this.slowMoTarget = scale;
        this.slowMoDuration = duration;
    }
    
    updateTimeScale(deltaTime) {
        // Lerp smooth vers la cible
        this.timeScale += (this.slowMoTarget - this.timeScale) * 0.1;
        
        // Retour à la normale après duration
        if (this.slowMoDuration > 0) {
            this.slowMoDuration -= deltaTime;
            if (this.slowMoDuration <= 0) {
                this.slowMoTarget = 1.0;
            }
        }
    }
    
    // ═══════════════════════════════════════════════════════
    // COMBO SYSTEM (Dopamine Escalation!)
    // ═══════════════════════════════════════════════════════
    
    registerHit(damage, isCrit = false) {
        const now = Date.now();
        const timeSinceLastHit = now - this.lastHitTime;
        
        // Si < 2 secondes, combo continue
        if (timeSinceLastHit < 2000) {
            this.comboCounter++;
            this.comboTimer = 2.0; // Reset timer
        } else {
            this.comboCounter = 1; // Nouveau combo
            this.comboTimer = 2.0;
        }
        
        this.lastHitTime = now;
        
        // Feedback selon combo
        if (this.comboCounter >= 3) {
            this.screenShake(15 + this.comboCounter * 2, 0.4);
            this.createScreenFlash('rgba(255, 100, 100, 0.3)', 0.1);
        }
        
        // Critique : Slow mo!
        if (isCrit) {
            this.setTimeScale(0.3, 0.4);
            this.createScreenFlash('rgba(255, 215, 0, 0.4)', 0.2);
        }
    }
    
    updateCombo(deltaTime) {
        if (this.comboTimer > 0) {
            this.comboTimer -= deltaTime;
            if (this.comboTimer <= 0) {
                this.comboCounter = 0;
            }
        }
    }
    
    renderCombo(ctx) {
        if (this.comboCounter > 1) {
            const x = this.canvas.width / 2;
            const y = 100;
            
            // Pulse effect
            const pulse = 1 + Math.sin(Date.now() / 100) * 0.1;
            
            ctx.save();
            ctx.translate(x, y);
            ctx.scale(pulse, pulse);
            
            // Shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.font = 'bold 48px Cinzel';
            ctx.textAlign = 'center';
            ctx.fillText(`${this.comboCounter}x COMBO!`, 3, 3);
            
            // Texte principal
            const gradient = ctx.createLinearGradient(0, -20, 0, 20);
            gradient.addColorStop(0, '#ffd700');
            gradient.addColorStop(1, '#ff8c00');
            ctx.fillStyle = gradient;
            ctx.fillText(`${this.comboCounter}x COMBO!`, 0, 0);
            
            ctx.restore();
        }
    }
    
    // ═══════════════════════════════════════════════════════
    // ATTACK SEQUENCE (Full Experience!)
    // ═══════════════════════════════════════════════════════
    
    async playAttackFeedback(attackerPos, targetPos, damage, isCrit = false, isKill = false) {
        console.log('🎯 playAttackFeedback appelé:', { damage, isCrit, isKill, targetPos });
        
        // CALCUL POSITION (au centre du canvas pour l'instant - améliorer plus tard)
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // 0. SONS ! 🔊
        if (isKill) {
            this.playSound('killBlow');
        } else if (isCrit) {
            this.playSound('criticalHit');
        } else {
            this.playSound('swoosh');
            setTimeout(() => this.playSound('impact'), 100); // Impact après swoosh
        }
        
        // 1. SCREEN SHAKE - PUISSANT !
        const shakeIntensity = isCrit ? 35 : isKill ? 40 : 18; // ← Augmenté !
        this.screenShake(shakeIntensity, isCrit ? 0.6 : 0.4);
        console.log('💥 SHAKE:', shakeIntensity);
        
        // 2. PARTICULES - SANG PARTOUT !
        if (isCrit) {
            this.createCriticalEffect(centerX, centerY);
            this.createBloodSplatter(centerX, centerY, 35, '#8b0000'); // ← Plus !
            console.log('⭐ Particules critiques créées');
        } else if (isKill) {
            this.createBloodSplatter(centerX, centerY, 45, '#8b0000'); // ← ÉNORME !
            this.createImpactSparks(centerX, centerY, 20);
            console.log('💀 Particules KILL créées');
        } else {
            this.createBloodSplatter(centerX, centerY, 25, '#8b0000'); // ← Plus que 15
            console.log('🩸 Particules normales créées');
        }
        
        // 3. DAMAGE NUMBER - GROS ET VISIBLE !
        const type = isKill ? 'kill' : isCrit ? 'critical' : 'normal';
        this.createFloatingDamage(centerX, centerY, damage, type);
        console.log('💯 Damage number créé:', damage, type);
        
        // 4. FLASH FULLSCREEN - IMPACT !
        if (isCrit) {
            this.createScreenFlash('rgba(255, 215, 0, 0.5)', 0.2); // ← Plus opaque !
            console.log('✨ Flash CRITIQUE');
        } else if (isKill) {
            this.createScreenFlash('rgba(255, 0, 0, 0.4)', 0.25);
            console.log('💀 Flash KILL');
        } else {
            this.createScreenFlash('rgba(255, 255, 255, 0.3)', 0.15); // ← Plus visible !
            console.log('⚡ Flash normal');
        }
        
        // 5. COMBO
        this.registerHit(damage, isCrit);
        
        // 6. SLOW MO sur critique - PLUS LENT !
        if (isCrit) {
            this.setTimeScale(0.25, 0.7); // ← 75% plus lent, plus long !
            console.log('⏱️ SLOW MOTION activé');
        }
        
        console.log('✅ Feedback COMPLET lancé !');
    }
    
    // Version avec positions pour le renderer (appelée depuis le renderer)
    createDamageAtPosition(x, y, damage, isCrit = false, isKill = false) {
        // Particules
        if (isCrit) {
            this.createCriticalEffect(x, y);
            this.createBloodSplatter(x, y, 35, '#8b0000');
        } else if (isKill) {
            this.createBloodSplatter(x, y, 45, '#8b0000');
            this.createImpactSparks(x, y, 20);
        } else {
            this.createBloodSplatter(x, y, 25, '#8b0000');
        }
        
        // Damage number
        const type = isKill ? 'kill' : isCrit ? 'critical' : 'normal';
        this.createFloatingDamage(x, y, damage, type);
    }
    
    // ═══════════════════════════════════════════════════════
    // UPDATE & RENDER
    // ═══════════════════════════════════════════════════════
    
    update(deltaTime) {
        // Applique time scale
        const scaledDelta = deltaTime * this.timeScale;
        
        this.updateScreenShake(scaledDelta);
        this.updateParticles(scaledDelta);
        this.updateFlashes(scaledDelta);
        this.updateTimeScale(deltaTime);
        this.updateCombo(deltaTime);
        
        // Update floating texts
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const text = this.floatingTexts[i];
            text.update(scaledDelta);
            
            if (text.isDead()) {
                this.floatingTexts.splice(i, 1);
            }
        }
    }
    
    render(ctx) {
        ctx.save();
        
        // Apply shake to everything
        this.applyShake(ctx);
        
        // Render order (back to front)
        this.renderFlashes(ctx);
        this.renderParticles(ctx);
        
        // Floating texts render separately (no shake)
        ctx.restore();
        this.floatingTexts.forEach(text => text.render(ctx));
        
        // Combo render on top
        this.renderCombo(ctx);
    }
    
    // ═══════════════════════════════════════════════════════
    // UTILS
    // ═══════════════════════════════════════════════════════
    
    wait(seconds) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }
    
    playSound(soundId) {
        // Utilise le soundSystem passé au constructeur
        if (this.soundSystem && this.soundSystem.playSound) {
            console.log('🔊 Playing sound:', soundId);
            this.soundSystem.playSound(soundId);
        } else if (window.soundSystem && window.soundSystem.playSound) {
            console.log('🔊 Playing sound (fallback):', soundId);
            window.soundSystem.playSound(soundId);
        } else {
            console.warn('🔇 No sound system available for:', soundId);
        }
    }
}

// ═══════════════════════════════════════════════════════
// FLOATING DAMAGE CLASS
// ═══════════════════════════════════════════════════════

class FloatingDamage {
    constructor(x, y, damage, type = 'normal') {
        this.x = x;
        this.y = y;
        this.startY = y;
        this.damage = damage;
        this.type = type;
        this.life = 1.0;
        this.scale = 0.2; // Start small for pop effect
        this.offsetY = 0;
        this.rotation = (Math.random() - 0.5) * 0.3;
    }
    
    update(deltaTime) {
        // Pop in puis monte
        if (this.scale < 1.2) {
            this.scale += deltaTime * 8; // Fast pop
        } else {
            this.offsetY -= deltaTime * 100; // Monte
            this.life -= deltaTime * 1.5;
        }
    }
    
    render(ctx) {
        if (this.life <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.translate(this.x, this.y + this.offsetY);
        ctx.scale(this.scale, this.scale);
        ctx.rotate(this.rotation);
        
        // Style selon type
        let fontSize, color, shadowColor;
        switch(this.type) {
            case 'critical':
                fontSize = 56; // ← ÉNORME !
                color = '#ffd700';
                shadowColor = '#ff4500';
                break;
            case 'kill':
                fontSize = 64; // ← MASSIF !
                color = '#ff0000';
                shadowColor = '#8b0000';
                break;
            default:
                fontSize = 42; // ← Plus gros !
                color = '#ff4444';
                shadowColor = '#000000';
        }
        
        ctx.font = `bold ${fontSize}px Cinzel`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Shadow ÉPAIS pour lisibilité
        ctx.strokeStyle = shadowColor;
        ctx.lineWidth = 10; // ← Plus épais !
        ctx.strokeText(this.damage, 0, 0);
        
        // Texte principal
        ctx.fillStyle = color;
        ctx.fillText(this.damage, 0, 0);
        
        // Label pour critiques - PLUS GROS !
        if (this.type === 'critical' && this.scale >= 1.0) {
            ctx.font = 'bold 24px Cinzel'; // ← Plus gros !
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 5;
            ctx.strokeText('CRITICAL!', 0, -50);
            ctx.fillText('CRITICAL!', 0, -50);
        }
        
        if (this.type === 'kill' && this.scale >= 1.0) {
            ctx.font = 'bold 28px Cinzel'; // ← Plus gros !
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#8b0000';
            ctx.lineWidth = 6;
            ctx.strokeText('ELIMINATED!', 0, -60);
            ctx.fillText('ELIMINATED!', 0, -60);
        }
        
        ctx.restore();
    }
    
    isDead() {
        return this.life <= 0;
    }
}
