/**
 * 🎬 COMBAT INTRO SYSTEM - THE LAST COVENANT
 * 
 * Gère les séquences d'intro de combat :
 * - Annonce "COMBAT !" avec effet dramatique
 * - Présentation des ennemis (zoom + nom)
 * - Indicateur de tour ("VOTRE TOUR" / "TOUR ENNEMI")
 * - Tutoriel premier combat
 * - Sons de guerre (tambours, cris)
 * 
 * Style : Darkest Dungeon + Baldur's Gate 3
 * 
 * @version 1.0.0
 */

export class CombatIntroSystem {
    constructor(canvas, renderer = null) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.renderer = renderer; // Pour ajouter logs
        
        this.isPlaying = false;
        this.currentSequence = null;
        
        // Sons (à précharger)
        this.sounds = {
            warDrum: null,      // Tambour de guerre
            swordDraw: null,    // Dégainer épée
            enemyRoar: null,    // Cri ennemi
            turnStart: null     // Début de tour
        };
        
        console.log('🎬 CombatIntroSystem initialisé');
    }
    
    /**
     * Joue la séquence complète d'intro de combat
     */
    async playCombatIntro(enemies, isFirstCombat = false) {
        this.isPlaying = true;
        
        // Log de bienvenue
        if (this.renderer && this.renderer.addLog) {
            this.renderer.addLog('🎮 Bienvenue dans le combat !', 'system');
            this.renderer.addLog(`💀 Combat contre ${enemies.length} ennemi(s)`, 'enemy');
            
            // Narration Thalys
            const openings = [
                '"Un petit combat tactique ? Ennuyeux."',
                '"Ah... Du sang frais. Intéressant."',
                '"Tu pourrais... pimenter les choses."',
                '"Montre-moi ce que tu vaux, humain."'
            ];
            const thalysOpening = openings[Math.floor(Math.random() * openings.length)];
            this.renderer.addLog(`🎲 Thalys : ${thalysOpening}`, 'dice');
        }
        
        // 1. FLASH BLANC
        await this.flashTransition();
        
        // 2. ANNONCE "COMBAT !"
        await this.showCombatAnnounce();
        
        // 3. PRÉSENTATION ENNEMIS
        await this.showEnemyIntro(enemies);
        
        // 4. TUTORIEL (premier combat seulement)
        if (isFirstCombat) {
            await this.showTutorial();
        }
        
        // 5. "VOTRE TOUR"
        await this.showTurnIndicator('VOTRE TOUR', 'player');
        
        this.isPlaying = false;
    }
    
    /**
     * Annonce changement de tour
     */
    async showTurnChange(turnType, turnNumber) {
        this.isPlaying = true;
        
        const text = turnType === 'player' ? 'VOTRE TOUR' : 'TOUR ENNEMI';
        await this.showTurnIndicator(text, turnType, turnNumber);
        
        this.isPlaying = false;
    }
    
    /**
     * Affiche écran de victoire
     */
    async showVictory(loot) {
        this.isPlaying = true;
        
        const duration = 4000;
        const startTime = Date.now();
        
        return new Promise(resolve => {
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const alpha = progress < 0.2 ? progress / 0.2 : (progress > 0.8 ? 1 - ((progress - 0.8) / 0.2) : 1);
                const scale = 0.8 + (progress * 0.2);
                
                this.ctx.save();
                
                // Vignette sombre
                const gradient = this.ctx.createRadialGradient(
                    this.canvas.width / 2,
                    this.canvas.height / 2,
                    0,
                    this.canvas.width / 2,
                    this.canvas.height / 2,
                    this.canvas.width / 2
                );
                gradient.addColorStop(0, 'rgba(0,0,0,0)');
                gradient.addColorStop(1, 'rgba(0,0,0,0.9)');
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                this.ctx.globalAlpha = alpha;
                this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2 - 100);
                this.ctx.scale(scale, scale);
                
                // "VICTOIRE"
                this.ctx.font = 'bold 80px Cinzel, serif';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                
                this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
                this.ctx.shadowBlur = 20;
                
                // Outline
                this.ctx.strokeStyle = '#000000';
                this.ctx.lineWidth = 6;
                this.ctx.strokeText('VICTOIRE', 0, 0);
                
                // Fill doré
                const textGradient = this.ctx.createLinearGradient(0, -40, 0, 40);
                textGradient.addColorStop(0, '#ffd700');
                textGradient.addColorStop(1, '#c9a97a');
                this.ctx.fillStyle = textGradient;
                this.ctx.fillText('VICTOIRE', 0, 0);
                
                this.ctx.restore();
                
                // Loot
                if (progress > 0.3 && loot) {
                    this.ctx.save();
                    this.ctx.globalAlpha = alpha;
                    this.ctx.font = '24px Crimson Text, serif';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillStyle = '#c9a97a';
                    
                    const y = this.canvas.height / 2 + 50;
                    if (loot.gold > 0) {
                        this.ctx.fillText(`💰 +${loot.gold} Gold`, this.canvas.width / 2, y);
                    }
                    
                    if (loot.items && loot.items.length > 0) {
                        this.ctx.fillText(`📦 ${loot.items.length} objet(s) trouvé(s)`, this.canvas.width / 2, y + 35);
                    }
                    
                    this.ctx.restore();
                }
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.isPlaying = false;
                    resolve();
                }
            };
            
            this.playSound('turnStart'); // Son de victoire
            animate();
        });
    }
    
    /**
     * Affiche écran de défaite
     */
    async showDefeat() {
        this.isPlaying = true;
        
        const duration = 3000;
        const startTime = Date.now();
        
        return new Promise(resolve => {
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const alpha = progress < 0.2 ? progress / 0.2 : (progress > 0.8 ? 1 - ((progress - 0.8) / 0.2) : 1);
                
                this.ctx.save();
                
                // Vignette rouge
                const gradient = this.ctx.createRadialGradient(
                    this.canvas.width / 2,
                    this.canvas.height / 2,
                    0,
                    this.canvas.width / 2,
                    this.canvas.height / 2,
                    this.canvas.width / 2
                );
                gradient.addColorStop(0, 'rgba(40,0,0,0)');
                gradient.addColorStop(1, 'rgba(20,0,0,0.9)');
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                this.ctx.globalAlpha = alpha;
                
                // "DÉFAITE"
                this.ctx.font = 'bold 80px Cinzel, serif';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                
                this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
                this.ctx.shadowBlur = 20;
                
                // Outline
                this.ctx.strokeStyle = '#000000';
                this.ctx.lineWidth = 6;
                this.ctx.strokeText('DÉFAITE', this.canvas.width / 2, this.canvas.height / 2 - 50);
                
                // Fill rouge
                const textGradient = this.ctx.createLinearGradient(
                    this.canvas.width / 2, 
                    this.canvas.height / 2 - 90,
                    this.canvas.width / 2,
                    this.canvas.height / 2 - 10
                );
                textGradient.addColorStop(0, '#ff4444');
                textGradient.addColorStop(1, '#8b0000');
                this.ctx.fillStyle = textGradient;
                this.ctx.fillText('DÉFAITE', this.canvas.width / 2, this.canvas.height / 2 - 50);
                
                // Message résurrection
                if (progress > 0.3) {
                    this.ctx.font = '20px Crimson Text, serif';
                    this.ctx.fillStyle = '#c9a97a';
                    this.ctx.fillText('Le Pacte vous ramène...', this.canvas.width / 2, this.canvas.height / 2 + 30);
                    this.ctx.fillText('+1 Corruption', this.canvas.width / 2, this.canvas.height / 2 + 60);
                }
                
                this.ctx.restore();
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.isPlaying = false;
                    resolve();
                }
            };
            
            this.playSound('enemyRoar'); // Son de défaite
            animate();
        });
    }
    
    // ═══════════════════════════════════════════════════════
    // SÉQUENCES D'ANIMATION
    // ═══════════════════════════════════════════════════════
    
    /**
     * Flash blanc de transition
     */
    async flashTransition() {
        const duration = 300;
        const startTime = Date.now();
        
        return new Promise(resolve => {
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Flash qui fade
                const alpha = progress < 0.3 ? progress / 0.3 : 1 - ((progress - 0.3) / 0.7);
                
                this.ctx.save();
                this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.restore();
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            this.playSound('swordDraw');
            animate();
        });
    }
    
    /**
     * Affiche "COMBAT !" dramatique
     */
    async showCombatAnnounce() {
        const duration = 1500;
        const startTime = Date.now();
        
        return new Promise(resolve => {
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Fade in + zoom
                const scale = 0.5 + (progress * 0.5); // 0.5 → 1.0
                const alpha = progress < 0.3 ? progress / 0.3 : (progress > 0.7 ? 1 - ((progress - 0.7) / 0.3) : 1);
                
                this.ctx.save();
                
                // Vignette sombre
                const gradient = this.ctx.createRadialGradient(
                    this.canvas.width / 2,
                    this.canvas.height / 2,
                    0,
                    this.canvas.width / 2,
                    this.canvas.height / 2,
                    this.canvas.width / 2
                );
                gradient.addColorStop(0, 'rgba(0,0,0,0)');
                gradient.addColorStop(1, 'rgba(0,0,0,0.8)');
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                // Texte "COMBAT !"
                this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
                this.ctx.scale(scale, scale);
                
                this.ctx.globalAlpha = alpha;
                
                // Ombre portée
                this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
                this.ctx.shadowBlur = 20;
                this.ctx.shadowOffsetX = 5;
                this.ctx.shadowOffsetY = 5;
                
                // Texte principal
                this.ctx.font = 'bold 120px Cinzel, serif';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                
                // Outline
                this.ctx.strokeStyle = '#000000';
                this.ctx.lineWidth = 8;
                this.ctx.strokeText('COMBAT !', 0, 0);
                
                // Fill gradient
                const textGradient = this.ctx.createLinearGradient(0, -60, 0, 60);
                textGradient.addColorStop(0, '#ff6b6b');
                textGradient.addColorStop(1, '#c92a2a');
                this.ctx.fillStyle = textGradient;
                this.ctx.fillText('COMBAT !', 0, 0);
                
                // Pas d'emojis autour de COMBAT !
                
                this.ctx.restore();
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            this.playSound('warDrum');
            animate();
        });
    }
    
    /**
     * Présente les ennemis un par un
     */
    async showEnemyIntro(enemies) {
        for (const enemy of enemies) {
            await this.showSingleEnemy(enemy);
            await this.delay(400);
        }
    }
    
    /**
     * Affiche un ennemi avec zoom dramatique
     */
    async showSingleEnemy(enemy) {
        const duration = 1200;
        const startTime = Date.now();
        
        return new Promise(resolve => {
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease in-out
                const easeProgress = progress < 0.5 
                    ? 2 * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                
                const scale = 0.3 + (easeProgress * 0.7);
                const alpha = progress < 0.2 ? progress / 0.2 : (progress > 0.8 ? 1 - ((progress - 0.8) / 0.2) : 1);
                
                this.ctx.save();
                
                // Background sombre
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                // Icône ennemi
                this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2 - 50);
                this.ctx.scale(scale, scale);
                this.ctx.globalAlpha = alpha;
                
                // Cercle rouge
                this.ctx.fillStyle = 'rgba(209, 67, 67, 0.3)';
                this.ctx.strokeStyle = '#d14343';
                this.ctx.lineWidth = 4;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, 80, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();
                
                // Icône
                this.ctx.font = '100px serif';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillStyle = '#ffffff';
                this.ctx.fillText(enemy.icon || '👹', 0, 0);
                
                this.ctx.restore();
                
                // Nom en dessous
                if (progress > 0.3) {
                    this.ctx.save();
                    this.ctx.globalAlpha = alpha;
                    
                    this.ctx.font = 'bold 40px Cinzel, serif';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillStyle = '#d14343';
                    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
                    this.ctx.shadowBlur = 10;
                    this.ctx.fillText(enemy.name, this.canvas.width / 2, this.canvas.height / 2 + 100);
                    
                    // HP
                    this.ctx.font = '24px Crimson Text, serif';
                    this.ctx.fillStyle = '#c9a97a';
                    this.ctx.fillText(`${enemy.HP} HP`, this.canvas.width / 2, this.canvas.height / 2 + 140);
                    
                    this.ctx.restore();
                }
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            this.playSound('enemyRoar');
            animate();
        });
    }
    
    /**
     * Affiche le tutoriel (premier combat) - RÉTRACTABLE
     */
    async showTutorial() {
        // Créer panel HTML persistant au lieu d'animation canvas
        const tutorialPanel = document.createElement('div');
        tutorialPanel.id = 'tutorialPanel';
        tutorialPanel.className = 'tutorial-panel collapsed';
        
        tutorialPanel.innerHTML = `
            <div class="tutorial-content">
                <div class="tutorial-header">
                    <h3>🎓 AIDE</h3>
                </div>
                <div class="tutorial-tips">
                    <div class="tip">💡 <strong>Survolez</strong> les cases pour voir les actions possibles</div>
                    <div class="tip">⚔️ <strong>Cliquez</strong> sur un ennemi adjacent pour l'attaquer</div>
                    <div class="tip">🚶 <strong>Cliquez</strong> sur une case vide pour vous déplacer</div>
                    <div class="tip">🎲 Le <strong>Dé</strong> peut tout changer... mais coûte de la Corruption</div>
                </div>
            </div>
            <button class="tutorial-toggle" onclick="toggleTutorial()">
                <span class="arrow">◀</span>
            </button>
        `;
        
        document.body.appendChild(tutorialPanel);
        
        // Attendre un peu puis slide in
        await this.delay(500);
        tutorialPanel.classList.remove('collapsed');
        
        // Fonction globale pour toggle
        window.toggleTutorial = () => {
            tutorialPanel.classList.toggle('collapsed');
            const arrow = tutorialPanel.querySelector('.arrow');
            arrow.textContent = tutorialPanel.classList.contains('collapsed') ? '▶' : '◀';
        };
        
        return Promise.resolve();
    }
    
    /**
     * Indicateur de tour
     */
    async showTurnIndicator(text, turnType, turnNumber = null) {
        const duration = 1500;
        const startTime = Date.now();
        
        const isPlayer = turnType === 'player';
        const color = isPlayer ? '#4a9eff' : '#d14343';
        const icon = isPlayer ? '⚔️' : '🛡️';
        
        return new Promise(resolve => {
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Slide in from side
                const slideProgress = progress < 0.4 ? progress / 0.4 : 1;
                const easeSlide = 1 - Math.pow(1 - slideProgress, 3);
                
                const startX = isPlayer ? -400 : this.canvas.width + 400;
                const endX = this.canvas.width / 2;
                const x = startX + (endX - startX) * easeSlide;
                
                const alpha = progress < 0.4 ? 1 : (progress > 0.7 ? 1 - ((progress - 0.7) / 0.3) : 1);
                
                this.ctx.save();
                this.ctx.globalAlpha = alpha;
                
                // Bannière
                const bannerWidth = 500;
                const bannerHeight = 120;
                const y = this.canvas.height / 2 - 60;
                
                // Ombre
                this.ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
                this.ctx.shadowBlur = 30;
                
                // Background
                this.ctx.fillStyle = 'rgba(20, 18, 15, 0.95)';
                this.ctx.fillRect(x - bannerWidth/2, y, bannerWidth, bannerHeight);
                
                // Border colorée
                this.ctx.strokeStyle = color;
                this.ctx.lineWidth = 4;
                this.ctx.strokeRect(x - bannerWidth/2, y, bannerWidth, bannerHeight);
                
                // Texte principal
                this.ctx.shadowBlur = 0;
                this.ctx.font = 'bold 48px Cinzel, serif';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillStyle = color;
                this.ctx.fillText(text, x, y + 60);
                
                // Icônes - AVEC ESPACE AJOUTÉ
                this.ctx.font = '60px serif';
                this.ctx.fillText(icon, x - 200, y + 60);  // Décalé plus à gauche
                this.ctx.fillText(icon, x + 200, y + 60);  // Décalé plus à droite
                
                // Numéro de tour
                if (turnNumber) {
                    this.ctx.font = '20px Crimson Text, serif';
                    this.ctx.fillStyle = '#c9a97a';
                    this.ctx.fillText(`Tour ${turnNumber}`, x, y + 100);
                }
                
                this.ctx.restore();
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            this.playSound('turnStart');
            animate();
        });
    }
    
    // ═══════════════════════════════════════════════════════
    // HELPERS
    // ═══════════════════════════════════════════════════════
    
    /**
     * Joue un son
     */
    playSound(soundName) {
        // Utiliser le vrai système de son si disponible
        if (window.soundSystem) {
            window.soundSystem.playSound(soundName);
        } else {
            console.log(`🔊 Son: ${soundName}`);
        }
    }
    
    /**
     * Délai
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Resize canvas
     */
    resize() {
        // Le canvas principal gère déjà le resize
    }
}
