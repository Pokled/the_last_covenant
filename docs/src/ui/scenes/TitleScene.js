/**
 * TitleScene - Écran titre AAA style Diablo 4
 * @description "Press Any Key" avec particules et ambiance
 */

import { AnimationUtils } from '../../utils/AnimationUtils.js';
import { ParticleSystem } from '../../utils/ParticleSystem.js';

export class TitleScene {
    constructor(eventBus, stateManager, soundManager) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;
        this.soundManager = soundManager;
        
        this.element = null;
        this.canvas = null;
        this.ctx = null;
        this.particleSystem = null;
        this.isActive = false;
        this.rafId = null;
        
        this.createDOM();
        this.setupEventListeners();
    }

    createDOM() {
        // Scene container
        this.element = document.createElement('div');
        this.element.id = 'title-scene';
        this.element.className = 'scene';
        
        this.element.innerHTML = `
            <div class="title-background"></div>
            
            <!-- ÉCLAIR DU PORTAIL -->
            <div class="portal-lightning"></div>
            
            <canvas id="title-particles" class="particles-container"></canvas>
            
            <div class="title-content">
                <h1 class="title-logo">
                    <span class="logo-line">THE</span>
                    <span class="logo-line">LAST</span>
                    <span class="logo-line">COVENANT</span>
                </h1>
                
                <p class="title-tagline">
                    Sept Dieux sont morts.<br>
                    Un pacte éternel.<br>
                    Ton destin t'attend.
                </p>
                
                <div class="press-any-key">
                    <span class="press-text">Appuie sur n'importe quelle touche</span>
                    <span class="press-blink">_</span>
                </div>
            </div>
            
            <div class="vignette"></div>
        `;
        
        document.getElementById('game-container').appendChild(this.element);
        
        // Setup canvas
        this.canvas = document.getElementById('title-particles');
        this.ctx = this.canvas.getContext('2d');
        this.particleSystem = new ParticleSystem(this.canvas);
        
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        // Any key to start
        this.keyHandler = (e) => {
            if (this.isActive) {
                this.startGame();
            }
        };
        
        this.clickHandler = () => {
            if (this.isActive) {
                this.startGame();
            }
        };
    }

    onEnter(data) {
        console.log('Title Scene: Active');
        
        this.element.classList.add('active');
        this.isActive = true;
        
        // Sons et musique
        this.soundManager.playMusic('menu');
        
        // Écouter inputs
        document.addEventListener('keydown', this.keyHandler);
        document.addEventListener('click', this.clickHandler);
        
        // Démarrer animations
        this.startAnimations();
        this.startParticleLoop();
    }

    onExit() {
        this.element.classList.remove('active');
        this.isActive = false;
        
        // Cleanup
        document.removeEventListener('keydown', this.keyHandler);
        document.removeEventListener('click', this.clickHandler);
        
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
        
        this.soundManager.stopMusic();
    }

    startAnimations() {
        // Fade in logo
        const logoLines = this.element.querySelectorAll('.logo-line');
        logoLines.forEach((line, index) => {
            line.style.opacity = '0';
            line.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                line.style.transition = 'all 0.8s ease';
                line.style.opacity = '1';
                line.style.transform = 'translateY(0)';
            }, index * 200);
        });
        
        // Fade in tagline
        const tagline = this.element.querySelector('.title-tagline');
        tagline.style.opacity = '0';
        setTimeout(() => {
            tagline.style.transition = 'opacity 1s ease';
            tagline.style.opacity = '1';
        }, 800);
        
        // Fade in press key
        const pressKey = this.element.querySelector('.press-any-key');
        pressKey.style.opacity = '0';
        setTimeout(() => {
            pressKey.style.transition = 'opacity 1s ease';
            pressKey.style.opacity = '1';
        }, 1500);
    }

    startParticleLoop() {
        let lastTime = 0;
        let particleTimer = 0;
        
        const loop = (timestamp) => {
            if (!this.isActive) return;
            
            const deltaTime = timestamp - lastTime;
            lastTime = timestamp;
            particleTimer += deltaTime;
            
            // Créer particules ambiantes (plus fréquent pour un effet dense)
            if (particleTimer > 50) {
                this.createAmbientParticles();
                // Créer 2-3 particules à la fois pour plus de densité
                if (Math.random() > 0.5) {
                    this.createAmbientParticles();
                }
                particleTimer = 0;
            }
            
            // Update et render
            this.particleSystem.update(deltaTime);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.particleSystem.render();
            
            this.rafId = requestAnimationFrame(loop);
        };
        
        this.rafId = requestAnimationFrame(loop);
    }

    createAmbientParticles() {
        // Mélange de particules de poussière mystique et fragments de pierre
        const particleType = Math.random();
        
        if (particleType < 0.6) {
            // Poussière dorée flottante (vitesse réduite x2)
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height; // Spawn partout
            
            this.particleSystem.createParticle(x, y, {
                vx: (Math.random() - 0.5) * 0.15,
                vy: -Math.random() * 0.25 - 0.1,
                life: 1.0,
                decay: 0.002,
                size: 1 + Math.random() * 2,
                color: '#d4af37',
                alpha: 0.4 + Math.random() * 0.3,
                gravity: -0.0025
            });
        } else if (particleType < 0.85) {
            // Fragments de pierre (vitesse réduite x1.5)
            const x = Math.random() * this.canvas.width;
            const y = -20;
            
            this.particleSystem.createParticle(x, y, {
                vx: (Math.random() - 0.5) * 0.13,
                vy: Math.random() * 0.2 + 0.07,
                life: 1.0,
                decay: 0.0015,
                size: 2 + Math.random() * 3,
                color: Math.random() > 0.5 ? '#8a7d6a' : '#5a4d3a',
                alpha: 0.5,
                gravity: 0.0067
            });
        } else {
            // Particules d'énergie violette (corruption mystique)
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            
            this.particleSystem.createParticle(x, y, {
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                life: 1.0,
                decay: 0.004,
                size: 2 + Math.random() * 2.5,
                color: Math.random() > 0.5 ? '#6a3a6a' : '#4a2a4a',
                alpha: 0.3 + Math.random() * 0.2,
                gravity: 0
            });
        }
    }

    startGame() {
        console.log('Starting game from title...');
        
        // Son de validation
        this.soundManager.playSuccess();
        
        // Screen shake
        AnimationUtils.screenShake(this.element, 300, 3);
        
        // Transition vers Main Menu
        setTimeout(() => {
            this.eventBus.emit('scene:change', { to: 'mainMenu' });
        }, 500);
    }
}
