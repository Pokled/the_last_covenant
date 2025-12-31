/**
 * ParticleSystem - Système de particules AAA
 * @description Fumée, lueur, sang, etc.
 */

export class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 100;
    }

    /**
     * Créer une particule
     */
    createParticle(x, y, options = {}) {
        if (this.particles.length >= this.maxParticles) {
            this.particles.shift(); // Retirer la plus ancienne
        }

        const particle = {
            x,
            y,
            vx: options.vx || (Math.random() - 0.5) * 2,
            vy: options.vy || -Math.random() * 2 - 1,
            life: options.life || 1.0,
            decay: options.decay || 0.01,
            size: options.size || 2,
            color: options.color || '#d4af37',
            alpha: options.alpha || 1.0,
            gravity: options.gravity || 0.05,
            type: options.type || 'default'
        };

        this.particles.push(particle);
    }

    /**
     * Créer burst de particules
     */
    createBurst(x, y, count = 10, options = {}) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = options.speed || 2;
            
            this.createParticle(x, y, {
                ...options,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed
            });
        }
    }

    /**
     * Particules de fumée ambiante
     */
    createSmoke(x, y, count = 1) {
        for (let i = 0; i < count; i++) {
            this.createParticle(x + Math.random() * 50 - 25, y, {
                vx: (Math.random() - 0.5) * 0.5,
                vy: -Math.random() * 0.5 - 0.3,
                life: 1.0,
                decay: 0.005,
                size: 10 + Math.random() * 10,
                color: '#666',
                alpha: 0.3,
                gravity: -0.02,
                type: 'smoke'
            });
        }
    }

    /**
     * Particules de sang (corruption)
     */
    createBlood(x, y, count = 5) {
        for (let i = 0; i < count; i++) {
            this.createParticle(x, y, {
                vx: (Math.random() - 0.5) * 3,
                vy: -Math.random() * 3 - 1,
                life: 1.0,
                decay: 0.02,
                size: 3 + Math.random() * 3,
                color: '#8b0000',
                alpha: 0.8,
                gravity: 0.15,
                type: 'blood'
            });
        }
    }

    /**
     * Particules dorées (récompense, hover)
     */
    createGold(x, y, count = 3) {
        for (let i = 0; i < count; i++) {
            this.createParticle(x, y, {
                vx: (Math.random() - 0.5) * 1.5,
                vy: -Math.random() * 2 - 0.5,
                life: 1.0,
                decay: 0.015,
                size: 2 + Math.random() * 2,
                color: '#d4af37',
                alpha: 0.9,
                gravity: 0.03,
                type: 'gold'
            });
        }
    }

    /**
     * Update particules
     */
    update(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            // Déplacement
            p.x += p.vx;
            p.y += p.vy;
            p.vy += p.gravity;
            
            // Déclin
            p.life -= p.decay;
            p.alpha = p.life;
            
            // Suppression si morte
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    /**
     * Render particules
     */
    render() {
        for (const p of this.particles) {
            this.ctx.save();
            
            this.ctx.globalAlpha = p.alpha;
            
            if (p.type === 'smoke') {
                // Fumée floue
                this.ctx.filter = 'blur(4px)';
            }
            
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        }
    }

    /**
     * Clear toutes les particules
     */
    clear() {
        this.particles = [];
    }
}
