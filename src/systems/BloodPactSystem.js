/**
 * 🩸 BLOOD PACT SYSTEM - Intégré au combat
 * Système de signature de pactes avec Thalys (le Dé)
 * Design : BG3 + Diablo 4 mature
 */

export class BloodPactSystem {
    constructor(corruption, playerStats) {
        this.corruption = corruption;
        this.playerStats = playerStats;
        this.pactHistory = [];
        
        this.config = {
            signDuration: 3000, // 3 sec pour signer
            minCorruption: 5,
            maxCorruption: 25
        };
        
        console.log('🩸 BloodPactSystem initialisé');
    }
    
    /**
     * Ouvre la modal de pacte en cliquant sur le dé
     */
    async offerPactOnDiceClick() {
        // Choisir un pacte aléatoire
        const pacts = Object.values(this.getPactTypes());
        const randomPact = pacts[Math.floor(Math.random() * pacts.length)];
        
        return this.offerPact(randomPact.id);
    }
    
    async offerPact(pactType) {
        const pactData = this.getPactTypes()[pactType];
        if (!pactData) {
            console.error(`Pacte inconnu: ${pactType}`);
            return null;
        }
        
        this.currentPact = {
            ...pactData,
            timestamp: Date.now()
        };
        
        // Créer la modal de pacte
        this.createPactModal();
        
        return new Promise((resolve) => {
            this.pactResolve = resolve;
        });
    }
    
    getPactTypes() {
        return {
            REROLL: {
                id: 'REROLL',
                name: 'Pacte du Second Souffle',
                icon: '🔄',
                description: 'Relance le dé une fois. Le Destin te donne une seconde chance.',
                flavorText: '"Tu hésites ? Comme c\'est... humain. Je t\'offre un reroll."',
                corruption: 5,
                benefit: 'Relance le dé et garde le meilleur résultat',
                cost: '+5% Corruption',
                rarity: 'common'
            },
            
            GUARANTEED_SIX: {
                id: 'GUARANTEED_SIX',
                name: 'Pacte de la Perfection',
                icon: '⚡',
                description: 'Garantit un résultat de 6 sur le prochain lancer.',
                flavorText: '"Tu veux contrôler le chaos ? Ambitieux. Mais tout a un prix."',
                corruption: 15,
                benefit: 'Prochain lancer = 6 garanti',
                cost: '+15% Corruption',
                rarity: 'rare'
            },
            
            DARK_BLESSING: {
                id: 'DARK_BLESSING',
                name: 'Bénédiction Profanée',
                icon: '🌑',
                description: '+10% dégâts, +10% HP permanent.',
                flavorText: '"Laisse la corruption te renforcer. Les faibles la craignent."',
                corruption: 20,
                benefit: '+10% ATK/HP permanent',
                cost: '+20% Corruption',
                rarity: 'epic'
            }
        };
    }
    
    createPactModal() {
        // Supprimer modal existante
        const existing = document.getElementById('bloodPactModal');
        if (existing) existing.remove();
        
        const modal = document.createElement('div');
        modal.id = 'bloodPactModal';
        modal.className = 'blood-pact-modal';
        
        modal.innerHTML = `
            <div class="pact-backdrop"></div>
            
            <div class="pact-container">
                <div class="parchment">
                    <div class="parchment-overlay"></div>
                    
                    <!-- Taches de sang -->
                    <div class="blood-stain blood-stain-1"></div>
                    <div class="blood-stain blood-stain-2"></div>
                    
                    <!-- Texte du pacte -->
                    <div class="pact-header">
                        <div class="pact-icon">${this.currentPact.icon}</div>
                        <h2 class="pact-title">${this.currentPact.name}</h2>
                        <div class="pact-rarity pact-rarity-${this.currentPact.rarity}">
                            ${this.currentPact.rarity.toUpperCase()}
                        </div>
                    </div>
                    
                    <div class="pact-content">
                        <p class="pact-description">${this.currentPact.description}</p>
                        
                        <div class="pact-flavor">
                            <em>${this.currentPact.flavorText}</em>
                        </div>
                        
                        <div class="pact-terms">
                            <div class="term-benefit">
                                <strong>✨ Bénéfice :</strong> ${this.currentPact.benefit}
                            </div>
                            <div class="term-cost">
                                <strong>💀 Prix :</strong> ${this.currentPact.cost}
                            </div>
                        </div>
                        
                        <!-- Zone de signature -->
                        <div class="signature-zone" id="signatureZone">
                            <div class="signature-instructions">
                                Maintiens pour signer en sang...
                            </div>
                            
                            <div class="signature-progress-container">
                                <div class="signature-progress" id="signatureProgress"></div>
                            </div>
                            
                            <div class="signature-line"></div>
                            
                            <canvas id="signatureCanvas" width="400" height="80"></canvas>
                        </div>
                        
                        <!-- Dialogue du Dé -->
                        <div class="dice-dialogue" id="diceDialogue"></div>
                    </div>
                    
                    <!-- Boutons -->
                    <div class="pact-actions">
                        <button class="btn-refuse" id="btnRefuse">
                            🚪 Refuser
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Injecter les styles
        this.injectPactStyles();
        
        // Setup interactions
        this.setupSignature();
        this.setupButtons();
        
        // Animation d'entrée
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });
        
        // Dialogue du dé
        setTimeout(() => {
            this.diceSpeak(this.currentPact.flavorText, 2000);
        }, 500);
    }
    
    setupSignature() {
        const zone = document.getElementById('signatureZone');
        const progress = document.getElementById('signatureProgress');
        const canvas = document.getElementById('signatureCanvas');
        const ctx = canvas.getContext('2d');
        
        let isHolding = false;
        let startTime = 0;
        let animFrame = null;
        
        const startSigning = (e) => {
            e.preventDefault();
            isHolding = true;
            startTime = Date.now();
            this.signProgress = 0;
            
            zone.classList.add('signing');
            
            const updateProgress = () => {
                if (!isHolding) return;
                
                const elapsed = Date.now() - startTime;
                this.signProgress = Math.min(elapsed / this.config.signDuration, 1);
                
                progress.style.width = `${this.signProgress * 100}%`;
                
                // Signature de sang
                this.drawBloodSignature(ctx, this.signProgress);
                
                // Dialogues progressifs
                if (this.signProgress > 0.5 && this.signProgress < 0.6) {
                    this.diceSpeak('Continue... c\'est bien...', 1500);
                }
                
                if (this.signProgress >= 1) {
                    this.completePact();
                    return;
                }
                
                animFrame = requestAnimationFrame(updateProgress);
            };
            
            updateProgress();
        };
        
        const stopSigning = (e) => {
            e.preventDefault();
            isHolding = false;
            zone.classList.remove('signing');
            
            if (animFrame) {
                cancelAnimationFrame(animFrame);
            }
            
            if (this.signProgress < 1 && this.signProgress > 0) {
                this.diceSpeak('Tu hésites ? Pathétique...', 1500);
            }
        };
        
        // Desktop
        zone.addEventListener('mousedown', startSigning);
        zone.addEventListener('mouseup', stopSigning);
        zone.addEventListener('mouseleave', stopSigning);
        
        // Mobile
        zone.addEventListener('touchstart', startSigning);
        zone.addEventListener('touchend', stopSigning);
    }
    
    drawBloodSignature(ctx, progress) {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        
        if (progress > 0) {
            const x = progress * width;
            const y = height / 2 + Math.sin(progress * 10) * 8;
            
            ctx.strokeStyle = `rgba(139, 0, 0, ${progress * 0.9})`;
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            
            if (progress > 0.01) {
                const prevX = (progress - 0.01) * width;
                const prevY = height / 2 + Math.sin((progress - 0.01) * 10) * 8;
                
                ctx.beginPath();
                ctx.moveTo(prevX, prevY);
                ctx.lineTo(x, y);
                ctx.stroke();
            }
            
            // Gouttes de sang
            if (Math.random() < 0.08) {
                ctx.fillStyle = `rgba(139, 0, 0, ${0.7 + Math.random() * 0.3})`;
                ctx.beginPath();
                ctx.arc(x + (Math.random() - 0.5) * 15, y + 8 + Math.random() * 15, 1.5 + Math.random() * 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
    
    async completePact() {
        const zone = document.getElementById('signatureZone');
        zone.classList.add('complete');
        
        // Dialogue final
        await this.diceSpeak('Excellent. Tu m\'appartiens un peu plus...', 2000);
        
        // Appliquer les effets
        this.applyPactEffects();
        
        // Sauvegarder
        this.pactHistory.push({
            ...this.currentPact,
            signedAt: Date.now()
        });
        
        // Événement global
        window.dispatchEvent(new CustomEvent('pactSigned', {
            detail: {
                pactId: this.currentPact.id,
                corruption: this.corruption.corruption,
                timestamp: Date.now()
            }
        }));
        
        if (this.pactResolve) {
            this.pactResolve({
                accepted: true,
                pact: this.currentPact
            });
        }
        
        // Fermer
        setTimeout(() => {
            this.closePactModal();
        }, 2500);
    }
    
    applyPactEffects() {
        // Augmenter corruption
        this.corruption.addCorruption(this.currentPact.corruption, `Pacte (${this.currentPact.name})`);
        
        // Appliquer bénéfices
        switch (this.currentPact.id) {
            case 'REROLL':
                // À implémenter : permettre 1 relance
                console.log('✅ Reroll disponible');
                break;
                
            case 'GUARANTEED_SIX':
                // À implémenter : forcer prochain dé à 6
                console.log('✅ Prochain dé = 6');
                break;
                
            case 'DARK_BLESSING':
                this.playerStats.bonusATK += 10;
                this.playerStats.bonusHP += 10;
                console.log('✅ +10% ATK/HP');
                break;
        }
        
        console.log(`🩸 Pacte signé: ${this.currentPact.name}`);
    }
    
    setupButtons() {
        const btnRefuse = document.getElementById('btnRefuse');
        
        if (btnRefuse) {
            btnRefuse.onclick = () => {
                this.diceSpeak('Tu refuses ? Mais tu reviendras...', 1500);
                
                if (this.pactResolve) {
                    this.pactResolve({
                        accepted: false,
                        refused: true
                    });
                }
                
                setTimeout(() => {
                    this.closePactModal();
                }, 1500);
            };
        }
    }
    
    async diceSpeak(text, duration = 2000) {
        const dialogueEl = document.getElementById('diceDialogue');
        if (!dialogueEl) return;
        
        dialogueEl.textContent = text;
        dialogueEl.classList.add('active');
        
        return new Promise(resolve => {
            setTimeout(() => {
                dialogueEl.classList.remove('active');
                resolve();
            }, duration);
        });
    }
    
    closePactModal() {
        const modal = document.getElementById('bloodPactModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 500);
        }
        
        this.isModalOpen = false;
        this.currentPact = null;
    }
    
    injectPactStyles() {
        if (document.getElementById('bloodPactStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'bloodPactStyles';
        style.textContent = `
            /* Modal pacte de sang (style BG3/Diablo 4) */
            .blood-pact-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 9998;
                opacity: 0;
                transition: opacity 0.5s ease;
                pointer-events: none;
            }
            
            .blood-pact-modal.active {
                opacity: 1;
                pointer-events: all;
            }
            
            .pact-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle, rgba(0, 0, 0, 0.85) 0%, rgba(10, 0, 0, 0.95) 100%);
                animation: backdropPulse 4s ease-in-out infinite;
            }
            
            @keyframes backdropPulse {
                0%, 100% { opacity: 0.95; }
                50% { opacity: 1; }
            }
            
            .pact-container {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 2;
            }
            
            .parchment {
                position: relative;
                width: 700px;
                max-width: 90vw;
                min-height: 500px;
                background: linear-gradient(180deg, #d4c5a0 0%, #c9b896 20%, #b8a888 60%, #988668 100%);
                border: none;
                padding: 50px 40px;
                box-shadow: 0 30px 80px rgba(0, 0, 0, 0.95);
                font-family: 'Crimson Text', serif;
                color: #2a1810;
                animation: parchmentUnroll 1s ease forwards;
            }
            
            @keyframes parchmentUnroll {
                from { transform: scaleY(0); opacity: 0; }
                to { transform: scaleY(1); opacity: 1; }
            }
            
            .parchment-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-image: repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(139, 69, 19, 0.08) 28px, rgba(139, 69, 19, 0.08) 29px);
                pointer-events: none;
                opacity: 0.6;
            }
            
            .blood-stain {
                position: absolute;
                background: radial-gradient(ellipse, rgba(80, 20, 15, 0.8) 0%, rgba(100, 30, 20, 0.5) 50%, transparent 100%);
                border-radius: 50%;
                pointer-events: none;
                opacity: 0.9;
                mix-blend-mode: multiply;
            }
            
            .blood-stain-1 {
                top: 8%;
                right: 10%;
                width: 80px;
                height: 90px;
                transform: rotate(-15deg);
            }
            
            .blood-stain-2 {
                bottom: 12%;
                left: 8%;
                width: 60px;
                height: 65px;
                transform: rotate(20deg);
            }
            
            .pact-header {
                text-align: center;
                margin-bottom: 25px;
                border-bottom: 2px solid rgba(80, 50, 30, 0.5);
                padding-bottom: 15px;
            }
            
            .pact-icon {
                font-size: 3em;
                margin-bottom: 10px;
                filter: drop-shadow(0 3px 5px rgba(0, 0, 0, 0.4));
            }
            
            .pact-title {
                font-family: 'Cinzel', serif;
                font-size: 1.8em;
                color: #3d2817;
                text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.3);
                margin: 10px 0;
                letter-spacing: 2px;
            }
            
            .pact-rarity {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 5px;
                font-size: 0.75em;
                font-weight: bold;
                letter-spacing: 2px;
            }
            
            .pact-rarity-common { background: rgba(128, 128, 128, 0.3); color: #999; }
            .pact-rarity-rare { background: rgba(0, 112, 221, 0.3); color: #4fc3f7; }
            .pact-rarity-epic { background: rgba(163, 53, 238, 0.3); color: #d896ff; }
            
            .pact-description {
                font-size: 1.1em;
                line-height: 1.6;
                margin-bottom: 15px;
                color: #3d2817;
                text-align: justify;
            }
            
            .pact-flavor {
                font-size: 1em;
                color: #5a3825;
                font-style: italic;
                margin-bottom: 20px;
                padding: 15px;
                background: rgba(80, 50, 30, 0.1);
                border-left: 3px solid rgba(80, 30, 20, 0.6);
                position: relative;
            }
            
            .pact-flavor::before {
                content: '"';
                position: absolute;
                top: -8px;
                left: 8px;
                font-size: 2.5em;
                color: rgba(80, 30, 20, 0.3);
            }
            
            .pact-terms {
                margin-bottom: 20px;
            }
            
            .term-benefit,
            .term-cost {
                padding: 10px 12px;
                margin-bottom: 10px;
                background: rgba(255, 255, 255, 0.05);
                box-shadow: inset 1px 1px 3px rgba(0, 0, 0, 0.2);
            }
            
            .term-benefit {
                border-left: 3px solid rgba(60, 120, 60, 0.7);
                color: #4a7c4a;
            }
            
            .term-cost {
                border-left: 3px solid rgba(100, 30, 25, 0.8);
                color: #7d3530;
            }
            
            .signature-zone {
                position: relative;
                margin: 20px 0;
                padding: 25px;
                background: rgba(220, 200, 170, 0.3);
                border: 2px double rgba(80, 30, 20, 0.4);
                box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.15);
                cursor: pointer;
                transition: all 0.3s ease;
                user-select: none;
            }
            
            .signature-zone:hover {
                background: rgba(220, 200, 170, 0.4);
                border-color: rgba(100, 40, 30, 0.6);
            }
            
            .signature-zone.signing {
                background: rgba(180, 100, 90, 0.25);
                border-color: rgba(100, 30, 25, 0.8);
                box-shadow: inset 0 3px 20px rgba(100, 30, 25, 0.3), 0 0 30px rgba(139, 0, 0, 0.5);
            }
            
            .signature-zone.complete {
                background: rgba(150, 70, 60, 0.4);
                border-color: rgba(139, 0, 0, 0.9);
                animation: signatureComplete 1s ease forwards;
            }
            
            @keyframes signatureComplete {
                0% { transform: scale(1); }
                50% { transform: scale(1.03); box-shadow: 0 0 50px rgba(255, 0, 0, 0.8); }
                100% { transform: scale(1); }
            }
            
            .signature-instructions {
                text-align: center;
                font-size: 1.05em;
                color: #5a3825;
                margin-bottom: 15px;
                transition: opacity 0.3s ease;
                font-family: 'Cinzel', serif;
                letter-spacing: 1px;
            }
            
            .signature-zone.signing .signature-instructions {
                opacity: 0;
            }
            
            .signature-progress-container {
                position: relative;
                width: 100%;
                height: 8px;
                background: rgba(60, 30, 20, 0.3);
                border: 1px solid rgba(80, 30, 20, 0.4);
                box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.3);
                margin-bottom: 15px;
                overflow: hidden;
            }
            
            .signature-progress {
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, rgba(80, 20, 15, 0.9) 0%, rgba(120, 30, 25, 0.95) 50%, rgba(80, 20, 15, 0.9) 100%);
                box-shadow: 0 0 10px rgba(100, 20, 15, 0.8);
                transition: width 0.1s linear;
            }
            
            .signature-line {
                position: absolute;
                bottom: 35px;
                left: 25px;
                right: 25px;
                height: 1px;
                background: rgba(80, 30, 20, 0.5);
            }
            
            #signatureCanvas {
                display: block;
                width: 100%;
                height: 80px;
                margin: 0 auto;
            }
            
            .dice-dialogue {
                position: relative;
                padding: 15px 20px;
                background: rgba(220, 200, 170, 0.25);
                border: 2px solid rgba(80, 30, 20, 0.6);
                box-shadow: inset 0 1px 3px rgba(255, 255, 255, 0.15);
                font-size: 1.1em;
                font-style: italic;
                font-weight: 600;
                color: #2a1810;
                text-align: center;
                margin-top: 20px;
                opacity: 0;
                transform: translateY(10px);
                transition: all 0.5s ease;
            }
            
            .dice-dialogue.active {
                opacity: 1;
                transform: translateY(0);
            }
            
            .dice-dialogue::before {
                content: '"';
                font-size: 3em;
                position: absolute;
                top: -12px;
                left: 12px;
                color: rgba(80, 30, 20, 0.25);
            }
            
            .pact-actions {
                display: flex;
                gap: 12px;
                margin-top: 20px;
            }
            
            .pact-actions button {
                flex: 1;
                padding: 12px 25px;
                border: 2px solid;
                border-radius: 8px;
                font-family: 'Cinzel', serif;
                font-size: 1em;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .btn-refuse {
                background: linear-gradient(135deg, #333 0%, #1a1a1a 100%);
                color: #999;
                border-color: #555;
            }
            
            .btn-refuse:hover {
                background: linear-gradient(135deg, #555 0%, #333 100%);
                color: #ccc;
                transform: translateY(-2px);
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
            }
        `;
        
        document.head.appendChild(style);
    }
}
