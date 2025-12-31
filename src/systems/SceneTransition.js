/**
 * 🎬 SCENE TRANSITION MANAGER
 * Transitions cinématiques entre scènes (fade, zoom, shake...)
 */

export class SceneTransition {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.isTransitioning = false;
        this.callbacks = [];
    }
    
    /**
     * Fade to black puis callback
     */
    fadeToBlack(duration = 1000, callback) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Overlay noir progressif
            this.ctx.fillStyle = `rgba(0, 0, 0, ${progress})`;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isTransitioning = false;
                if (callback) callback();
            }
        };
        
        animate();
    }
    
    /**
     * Fade from black
     */
    fadeFromBlack(duration = 1000) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Overlay noir décroissant
            this.ctx.fillStyle = `rgba(0, 0, 0, ${1 - progress})`;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isTransitioning = false;
            }
        };
        
        animate();
    }
    
    /**
     * Camera shake (tremblement)
     */
    shake(intensity = 10, duration = 500) {
        const startTime = Date.now();
        const originalTransform = this.ctx.getTransform();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                const decay = 1 - progress;
                const shakeX = (Math.random() - 0.5) * intensity * decay;
                const shakeY = (Math.random() - 0.5) * intensity * decay;
                
                this.ctx.setTransform(
                    originalTransform.a,
                    originalTransform.b,
                    originalTransform.c,
                    originalTransform.d,
                    originalTransform.e + shakeX,
                    originalTransform.f + shakeY
                );
                
                requestAnimationFrame(animate);
            } else {
                this.ctx.setTransform(originalTransform);
            }
        };
        
        animate();
    }
    
    /**
     * Flash blanc (impact)
     */
    flash(color = 'white', duration = 200) {
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress < 1) {
                this.ctx.fillStyle = color;
                this.ctx.globalAlpha = 1 - progress;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.globalAlpha = 1;
                
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    /**
     * Vignette dramatique
     */
    drawVignette(intensity = 0.7) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.max(this.canvas.width, this.canvas.height) * 0.7;
        
        const gradient = this.ctx.createRadialGradient(
            centerX, centerY, radius * 0.3,
            centerX, centerY, radius
        );
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(1, `rgba(0, 0, 0, ${intensity})`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Particle burst (explosion de particules)
     */
    particleBurst(x, y, color = '#ffd700', count = 30) {
        const particles = [];
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 2 + Math.random() * 4;
            
            particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                decay: 0.02 + Math.random() * 0.02,
                size: 2 + Math.random() * 4,
                color
            });
        }
        
        const animate = () => {
            let alive = false;
            
            particles.forEach(p => {
                if (p.life <= 0) return;
                
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.2; // Gravité
                p.life -= p.decay;
                
                this.ctx.fillStyle = color;
                this.ctx.globalAlpha = p.life;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
                
                if (p.life > 0) alive = true;
            });
            
            this.ctx.globalAlpha = 1;
            
            if (alive) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }
    
    /**
     * Zoom dramatique sur une position
     */
    dramaticZoom(targetX, targetY, zoomLevel = 2, duration = 1000, callback) {
        const startTime = Date.now();
        const startScale = 1;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing: ease-in-out
            const eased = progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            
            const currentScale = startScale + (zoomLevel - startScale) * eased;
            
            this.ctx.save();
            this.ctx.translate(targetX, targetY);
            this.ctx.scale(currentScale, currentScale);
            this.ctx.translate(-targetX, -targetY);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.ctx.restore();
                if (callback) callback();
            }
        };
        
        animate();
    }
}
