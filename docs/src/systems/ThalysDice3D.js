/**
 * 🎲👁️ THALYS - LE DÉ DIVIN ET MAUDIT
 * 
 * "Je suis le Hasard et la Dette. Lance-moi, et scelle ton destin."
 * 
 * === LORE ===
 * Thalys était un dieu du Chaos primordial, bannià l'aube des temps.
 * Les anciens l'ont emprisonné dans un dé d'ivoire maudit, fait d'os de dragon.
 * 
 * Chaque lancer l'invoque brièvement dans notre réalité.
 * Il murmure des promesses, tente les âmes faibles, corrompt les forts.
 * 
 * Face 6 = Son ŒIL se révèle = Il te VOIT directement.
 * À ce moment, il peut parler, offrir des pactes, prendre un peu plus de ton âme.
 * 
 * Plus tu le lances, plus il devient fort.
 * Plus ta corruption grandit, plus il devient...réel.
 * 
 * === COMPORTEMENT ===
 * 0-33% Corruption : "Endormi" - Murmures doux, tentations subtiles
 * 34-66% Corruption : "Affamé" - Voix plus forte, promesses alléchantes
 * 67-100% Corruption : "Éveillé" - Il prend le contrôle, rit, se moque
 * 
 * === DESIGN ===
 * - Texture : Ivoire ancien, veines sombres, inscriptions runiques
 * - Œil : Rouge sang, pupille verticale (reptilien)
 * - Aura : Violette pulsante, particules flottantes
 * - Animation : Respiration oppressante, l'œil te suit toujours
 */

export class ThalysDice3D {
    constructor(options = {}) {
        this.containerId = options.containerId || 'thalys-container';
        this.corruptionSystem = options.corruptionSystem || null;
        this.combatLog = options.combatLog || null;
        
        // État
        this.corruption = 0;
        this.currentFace = null;
        this.isRolling = false;
        this.canRoll = true;
        
        // Personnalité
        this.mood = 'sleeping'; // sleeping, watching, hungry, pleased, furious
        this.awarenessLevel = 0; // 0-100, augmente avec les lancers
        this.lastWhisperTime = 0;
        
        // Animation
        this.rotationX = -20;
        this.rotationY = 30;
        this.idleRotation = { x: 0, y: 0 };
        this.breathPhase = 0;
        
        this.init();
    }
    
    init() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container #${this.containerId} not found`);
            return;
        }
        
        container.innerHTML = `
            <div class="thalys-3d-wrapper">
                <!-- Aura mystique pulsante -->
                <div class="thalys-aura" data-corruption="low">
                    <div class="aura-ring ring-1"></div>
                    <div class="aura-ring ring-2"></div>
                    <div class="aura-ring ring-3"></div>
                </div>
                
                <!-- Particules flottantes -->
                <div class="thalys-particles">
                    ${this.generateParticles(15)}
                </div>
                
                <!-- Le dé 3D CSS -->
                <div class="thalys-perspective">
                    <div class="thalys-cube" id="thalysCube">
                        ${this.generateCubeFaces()}
                    </div>
                </div>
                
                <!-- Œil overlay (quand face 6 visible) -->
                <div class="thalys-eye-overlay" id="thalysEyeOverlay">
                    <div class="eye-container">
                        <div class="eye-white"></div>
                        <div class="eye-iris">
                            <div class="eye-pupil"></div>
                            <div class="eye-veins"></div>
                        </div>
                        <div class="eye-glow"></div>
                    </div>
                </div>
                
                <!-- Whispers (messages de Thalys) -->
                <div class="thalys-whisper" id="thalysWhisper">
                    <div class="whisper-text"></div>
                    <div class="whisper-author">- Thalys</div>
                </div>
                
                <!-- État du dé (info) -->
                <div class="thalys-state-badge" id="thalysState">
                    <span class="state-label">Endormi</span>
                    <span class="state-corruption">0%</span>
                </div>
            </div>
        `;
        
        // Références
        this.cube = document.getElementById('thalysCube');
        this.eyeOverlay = document.getElementById('thalysEyeOverlay');
        this.whisperEl = document.getElementById('thalysWhisper');
        this.stateEl = document.getElementById('thalysState');
        this.aura = container.querySelector('.thalys-aura');
        this.wrapper = container.querySelector('.thalys-3d-wrapper');
        
        this.setupEvents();
        this.startIdleAnimation();
        
        console.log('🎲👁️ Thalys éveillé...');
    }
    
    generateCubeFaces() {
        // Positions 3D CSS pour un cube de 100px
        const faces = [
            { name: 'front', value: 1, transform: 'rotateY(0deg) translateZ(50px)' },
            { name: 'back', value: 6, transform: 'rotateY(180deg) translateZ(50px)', isThalys: true },
            { name: 'right', value: 2, transform: 'rotateY(90deg) translateZ(50px)' },
            { name: 'left', value: 5, transform: 'rotateY(-90deg) translateZ(50px)' },
            { name: 'top', value: 3, transform: 'rotateX(90deg) translateZ(50px)' },
            { name: 'bottom', value: 4, transform: 'rotateX(-90deg) translateZ(50px)' }
        ];
        
        return faces.map(face => {
            if (face.isThalys) {
                // Face 6 = Œil de Thalys
                return `
                    <div class="dice-face face-${face.name} face-thalys" 
                         style="transform: ${face.transform}">
                        <div class="thalys-eye-face">
                            <div class="eye-socket">
                                <div class="eye-iris-face">
                                    <div class="eye-pupil-face"></div>
                                </div>
                                <div class="eye-veins-pattern"></div>
                            </div>
                        </div>
                        <div class="face-runes">ᚦᚨᛚᚣᛋ</div>
                    </div>
                `;
            } else {
                // Faces normales (1-5)
                return `
                    <div class="dice-face face-${face.name}" 
                         style="transform: ${face.transform}">
                        <div class="face-dots">
                            ${this.generateDots(face.value)}
                        </div>
                        <div class="face-texture">
                            <div class="bone-grain"></div>
                            <div class="bone-cracks"></div>
                        </div>
                        <div class="face-runes">${this.getRuneForFace(face.value)}</div>
                    </div>
                `;
            }
        }).join('');
    }
    
    generateDots(value) {
        const positions = {
            1: ['center'],
            2: ['top-left', 'bottom-right'],
            3: ['top-left', 'center', 'bottom-right'],
            4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
            5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right']
        };
        
        return positions[value].map(pos => 
            `<div class="dot dot-${pos}"></div>`
        ).join('');
    }
    
    getRuneForFace(value) {
        const runes = ['ᚹ', 'ᚺ', 'ᛗ', 'ᛁ', 'ᛚ']; // Runes nordiques
        return runes[value - 1] || '';
    }
    
    generateParticles(count) {
        let html = '';
        for (let i = 0; i < count; i++) {
            const delay = Math.random() * 5;
            const duration = 4 + Math.random() * 3;
            const x = (Math.random() - 0.5) * 150;
            const y = (Math.random() - 0.5) * 150;
            const size = 2 + Math.random() * 3;
            
            html += `
                <div class="particle" style="
                    left: 50%;
                    top: 50%;
                    width: ${size}px;
                    height: ${size}px;
                    --orbit-x: ${x}px;
                    --orbit-y: ${y}px;
                    animation-delay: ${delay}s;
                    animation-duration: ${duration}s;
                "></div>
            `;
        }
        return html;
    }
    
    setupEvents() {
        // Hover = Thalys whispers
        this.wrapper.addEventListener('mouseenter', () => this.onHoverStart());
        this.wrapper.addEventListener('mouseleave', () => this.onHoverEnd());
        
        // Click = Roll dice
        this.wrapper.addEventListener('click', () => {
            if (this.canRoll && !this.isRolling) {
                this.roll();
            }
        });
        
        // Mouse move = Eye follows cursor
        this.wrapper.addEventListener('mousemove', (e) => this.updateEyeTracking(e));
    }
    
    onHoverStart() {
        this.wrapper.classList.add('hovered');
        this.whisper(this.getWhisperMessage());
        this.increaseMood('watching');
    }
    
    onHoverEnd() {
        this.wrapper.classList.remove('hovered');
        this.hideWhisper();
        this.decreaseMood();
    }
    
    getWhisperMessage() {
        const messages = {
            sleeping: [
                "Hmmm... qui ose me toucher ?",
                "Encore toi... tu reviens toujours...",
                "Lance-moi... découvre ton destin...",
                "Je sens ta curiosité...",
                "Un simple jet... que peux-tu perdre ?"
            ],
            watching: [
                "Oui... utilise-moi...",
                "Tu commences à comprendre mon pouvoir...",
                "Fais-moi confiance... juste une fois de plus...",
                "Le prix en vaut la chandelle...",
                "Ensemble, nous sommes invincibles..."
            ],
            hungry: [
                "Plus... donne-moi PLUS...",
                "Ton âme a un goût... exquis...",
                "N'aie pas peur... accepte-moi pleinement...",
                "Tu en veux plus, n'est-ce pas ?",
                "Continue... tu es si proche..."
            ],
            pleased: [
                "Excellent choix, mon ami...",
                "Tu apprends vite...",
                "Nous allons accomplir de grandes choses...",
                "Ta sagesse me plaît...",
                "Oui, oui... encore..."
            ],
            furious: [
                "TU M'APPARTIENS DÉJÀ !",
                "Il est TROP TARD pour reculer !",
                "TON ÂME EST MIENNE !",
                "CONTINUE... OFFRE-MOI TOUT !",
                "NOUS NE FAISONS PLUS QU'UN !"
            ]
        };
        
        const pool = messages[this.mood] || messages.sleeping;
        return pool[Math.floor(Math.random() * pool.length)];
    }
    
    whisper(text) {
        const now = Date.now();
        if (now - this.lastWhisperTime < 3000) return; // Cooldown 3s
        
        this.lastWhisperTime = now;
        
        const whisperText = this.whisperEl.querySelector('.whisper-text');
        whisperText.textContent = `"${text}"`;
        
        this.whisperEl.classList.add('visible');
        
        // Auto-hide après 4s
        clearTimeout(this.whisperTimeout);
        this.whisperTimeout = setTimeout(() => {
            this.hideWhisper();
        }, 4000);
    }
    
    hideWhisper() {
        this.whisperEl.classList.remove('visible');
    }
    
    updateEyeTracking(e) {
        const rect = this.wrapper.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        
        const angle = Math.atan2(deltaY, deltaX);
        const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2) / 50, 10);
        
        const pupil = this.eyeOverlay.querySelector('.eye-pupil');
        if (pupil) {
            const moveX = Math.cos(angle) * distance;
            const moveY = Math.sin(angle) * distance;
            pupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
    }
    
    increaseMood(mood) {
        this.mood = mood;
        this.awarenessLevel = Math.min(100, this.awarenessLevel + 5);
        this.wrapper.setAttribute('data-mood', mood);
    }
    
    decreaseMood() {
        if (this.awarenessLevel > 50) {
            this.mood = 'watching';
        } else if (this.awarenessLevel > 10) {
            this.mood = 'sleeping';
        }
    }
    
    async roll() {
        if (this.isRolling) return;
        
        this.isRolling = true;
        this.awarenessLevel += 10;
        
        // Log start
        if (this.combatLog) {
            this.combatLog.add('🎲 Lancement du dé de Thalys...', 'info');
        }
        
        // Animation de roll
        await this.animateRoll();
        
        // Calculer résultat
        const result = this.calculateResult();
        
        // Montrer résultat
        await this.showResult(result);
        
        // Événements spéciaux
        if (result.isThalys) {
            await this.onThalysRevealed();
        } else {
            this.applyCorruption(result.corruption);
        }
        
        this.isRolling = false;
        
        return result;
    }
    
    calculateResult() {
        // Probabilité de Thalys augmente avec corruption
        const baseChance = 0.05; // 5% de base
        const corruptionBonus = (this.corruption / 100) * 0.15; // +15% max
        const thalysChance = Math.min(baseChance + corruptionBonus, 0.20);
        
        let face;
        if (Math.random() < thalysChance) {
            face = 6; // L'ŒIL !
        } else {
            face = Math.floor(Math.random() * 5) + 1; // 1-5
        }
        
        // Corruption selon la face
        const corruptionTable = {
            1: 2,   // Face 1 = peu de corruption
            2: 3,
            3: 5,
            4: 7,
            5: 10,
            6: 15   // Face Thalys = max corruption
        };
        
        return {
            face: face,
            corruption: corruptionTable[face],
            isThalys: face === 6
        };
    }
    
    async animateRoll() {
        const duration = 1800; // 1.8s
        const startTime = Date.now();
        
        return new Promise(resolve => {
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;
                
                if (progress < 1) {
                    // Rotation rapide avec décélération
                    const speed = 1080 * (1 - progress * progress); // Easing quadratic
                    this.rotationX += speed * 0.016;
                    this.rotationY += speed * 0.016 * 1.618; // Golden ratio
                    
                    this.updateCubeTransform();
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            animate();
        });
    }
    
    async showResult(result) {
        // Rotation vers la face résultat
        const targetRotations = {
            1: { x: 0, y: 0 },
            2: { x: 0, y: -90 },
            3: { x: -90, y: 0 },
            4: { x: 90, y: 0 },
            5: { x: 0, y: 90 },
            6: { x: 0, y: 180 }
        };
        
        const target = targetRotations[result.face];
        await this.smoothRotateTo(target.x, target.y, 800);
        
        // Flash de résultat
        this.wrapper.classList.add('result-flash');
        setTimeout(() => this.wrapper.classList.remove('result-flash'), 400);
        
        this.currentFace = result.face;
        
        // Log
        if (this.combatLog) {
            if (result.isThalys) {
                this.combatLog.add('👁️ L\'ŒIL DE THALYS SE RÉVÈLE !', 'attack');
            } else {
                this.combatLog.add(
                    `🎲 Résultat : ${result.face} (+${result.corruption}% corruption)`, 
                    'info'
                );
            }
        }
    }
    
    async smoothRotateTo(targetX, targetY, duration) {
        const startX = this.rotationX;
        const startY = this.rotationY;
        const startTime = Date.now();
        
        return new Promise(resolve => {
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                
                this.rotationX = startX + (targetX - startX) * eased;
                this.rotationY = startY + (targetY - startY) * eased;
                
                this.updateCubeTransform();
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            animate();
        });
    }
    
    updateCubeTransform() {
        this.cube.style.transform = `
            rotateX(${this.rotationX + this.idleRotation.x}deg) 
            rotateY(${this.rotationY + this.idleRotation.y}deg)
        `;
    }
    
    async onThalysRevealed() {
        // Événement MAJEUR : Thalys se révèle
        
        this.increaseMood('pleased');
        this.wrapper.classList.add('thalys-revealed');
        
        // Montrer l'œil overlay
        this.eyeOverlay.classList.add('visible');
        
        // Whisper dramatique
        setTimeout(() => {
            this.whisper("ENFIN... tu m'as invoqué...");
        }, 500);
        
        // Intensifier particules
        this.intensifyAura();
        
        // Appliquer corruption massive
        this.applyCorruption(15);
        
        // Durée de l'événement
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Retour à la normale
        this.eyeOverlay.classList.remove('visible');
        this.wrapper.classList.remove('thalys-revealed');
        
        if (this.corruption < 50) {
            this.decreaseMood();
        } else {
            this.increaseMood('hungry');
        }
    }
    
    applyCorruption(amount) {
        if (this.corruptionSystem) {
            this.corruptionSystem.addCorruption(amount);
            this.corruption = this.corruptionSystem.getCorruption();
        } else {
            this.corruption += amount;
        }
        
        this.updateVisualState();
    }
    
    updateVisualState() {
        const c = this.corruption;
        
        // Mise à jour du badge d'état
        let state, corruptionLevel;
        if (c < 34) {
            state = 'Endormi';
            corruptionLevel = 'low';
            this.mood = 'sleeping';
        } else if (c < 67) {
            state = 'Éveillé';
            corruptionLevel = 'medium';
            this.mood = 'hungry';
        } else {
            state = 'POSSÉDÉ';
            corruptionLevel = 'high';
            this.mood = 'furious';
        }
        
        this.stateEl.querySelector('.state-label').textContent = state;
        this.stateEl.querySelector('.state-corruption').textContent = `${Math.round(c)}%`;
        this.aura.setAttribute('data-corruption', corruptionLevel);
        this.wrapper.setAttribute('data-corruption', corruptionLevel);
    }
    
    intensifyAura() {
        this.aura.classList.add('intensified');
        setTimeout(() => {
            this.aura.classList.remove('intensified');
        }, 2000);
    }
    
    startIdleAnimation() {
        let time = 0;
        
        const animate = () => {
            if (!this.isRolling) {
                time += 0.016;
                
                // Respiration subtile du dé
                this.breathPhase = Math.sin(time * 1.5) * 3;
                this.idleRotation.x = Math.sin(time * 0.5) * 2;
                this.idleRotation.y = Math.cos(time * 0.7) * 2;
                
                this.updateCubeTransform();
                
                // Pulsation de l'aura
                const breathe = (Math.sin(time * 2) + 1) / 2;
                this.aura.style.opacity = 0.4 + breathe * 0.3;
            }
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    enable() {
        this.canRoll = true;
        this.wrapper.classList.remove('disabled');
    }
    
    disable() {
        this.canRoll = false;
        this.wrapper.classList.add('disabled');
    }
    
    reset() {
        this.corruption = 0;
        this.awarenessLevel = 0;
        this.mood = 'sleeping';
        this.currentFace = null;
        this.updateVisualState();
    }
}
