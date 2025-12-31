/**
 * 🎮 BG3-STYLE ACTION BAR LAYOUT
 * Système d'interface inspiré de Baldur's Gate 3
 * Structure : [THALYS] [ACTION SLOTS] [END TURN]
 */

class BG3ActionBarLayout {
    constructor(combatSystem, corruptionSystem, playerStats) {
        this.combat = combatSystem;
        this.corruption = corruptionSystem;
        this.playerStats = playerStats;
        
        this.container = null;
        this.thalysCircle = null;
        this.actionSlots = null;
        this.endTurnCircle = null;
        
        this.init();
        console.log('🎮 BG3ActionBarLayout initialisé');
    }

    init() {
        this.createContainer();
        this.createThalys();
        this.createActionSlots();
        this.createEndTurn();
        this.setupEventListeners();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'bg3-action-bar';
        this.container.innerHTML = '';
        document.body.appendChild(this.container);
    }

    /**
     * 🎲 THALYS - Le Dé Vivant
     */
    createThalys() {
        const thalysWrapper = document.createElement('div');
        thalysWrapper.className = 'thalys-wrapper';
        
        thalysWrapper.innerHTML = `
            <div class="thalys-circle">
                <!-- Aura animée -->
                <div class="thalys-aura"></div>
                
                <!-- Corps du dé -->
                <div class="thalys-body">
                    <div class="thalys-face">
                        <span class="dice-value">?</span>
                    </div>
                    
                    <!-- Yeux brillants -->
                    <div class="thalys-eyes">
                        <div class="eye left"></div>
                        <div class="eye right"></div>
                    </div>
                </div>
                
                <!-- Texte incitation -->
                <div class="thalys-whisper">Clique-moi...</div>
            </div>
        `;
        
        this.thalysCircle = thalysWrapper.querySelector('.thalys-circle');
        this.container.appendChild(thalysWrapper);
    }

    /**
     * ⚔️ ACTION SLOTS - Sorts & Items
     */
    createActionSlots() {
        const slotsContainer = document.createElement('div');
        slotsContainer.className = 'action-slots-container';
        
        // Actions de base
        const actions = [
            { id: 'attack', icon: '⚔️', label: 'Attaque', cost: 1 },
            { id: 'dash', icon: '🏃', label: 'Sprint', cost: 1 },
            { id: 'potion', icon: '🧪', label: 'Potion', cost: 1, charges: 2 },
            { id: 'scroll', icon: '📜', label: 'Parchemin', cost: 1, charges: 1 }
        ];
        
        actions.forEach(action => {
            const slot = document.createElement('div');
            slot.className = 'action-slot';
            slot.dataset.actionId = action.id;
            
            slot.innerHTML = `
                <div class="slot-icon">${action.icon}</div>
                <div class="slot-cost">${action.cost} AP</div>
                ${action.charges ? `<div class="slot-charges">x${action.charges}</div>` : ''}
                <div class="slot-tooltip">${action.label}</div>
            `;
            
            slotsContainer.appendChild(slot);
        });
        
        this.actionSlots = slotsContainer;
        this.container.appendChild(slotsContainer);
    }

    /**
     * ⏭️ END TURN - Bouton Fin de Tour
     */
    createEndTurn() {
        const endTurnWrapper = document.createElement('div');
        endTurnWrapper.className = 'end-turn-wrapper';
        
        endTurnWrapper.innerHTML = `
            <div class="end-turn-circle">
                <div class="turn-orb"></div>
                <div class="turn-text">FIN DU<br>TOUR</div>
            </div>
        `;
        
        this.endTurnCircle = endTurnWrapper.querySelector('.end-turn-circle');
        this.container.appendChild(endTurnWrapper);
    }

    /**
     * 🎯 Event Listeners
     */
    setupEventListeners() {
        // THALYS - Lancer le dé
        this.thalysCircle.addEventListener('click', () => this.handleThalysClick());
        
        // ACTION SLOTS
        this.actionSlots.querySelectorAll('.action-slot').forEach(slot => {
            slot.addEventListener('click', () => this.handleActionClick(slot.dataset.actionId));
        });
        
        // END TURN
        this.endTurnCircle.addEventListener('click', () => this.handleEndTurn());
        
        // Hover effects
        this.setupHoverEffects();
    }

    setupHoverEffects() {
        // Thalys pulse au hover
        this.thalysCircle.addEventListener('mouseenter', () => {
            this.thalysCircle.classList.add('hover');
            const whisper = this.thalysCircle.querySelector('.thalys-whisper');
            whisper.textContent = this.getThalysWhisper();
        });
        
        this.thalysCircle.addEventListener('mouseleave', () => {
            this.thalysCircle.classList.remove('hover');
        });
    }

    /**
     * 🎲 Thalys Click Handler
     */
    async handleThalysClick() {
        if (this.combat.currentTurn !== 'player') {
            console.warn('⚠️ Pas votre tour !');
            return;
        }
        
        if (this.combat.actionPoints <= 0) {
            console.warn('⚠️ Plus d\'actions !');
            return;
        }
        
        console.log('🎲 Lance le dé !');
        
        // Animation de lancer
        this.animateDiceRoll();
        
        // Lancer corruption
        const result = await this.corruption.forceDiceRoll();
        
        // Afficher résultat
        this.showDiceResult(result);
        
        // Consommer action
        this.combat.consumeAction();
        
        // Log
        const stage = this.getCurrentCorruptionStage();
        this.combat.renderer.addLog(
            `Dé lancé : ${result.face} ! (Corruption: ${result.corruption.toFixed(1)}% - ${stage})`,
            'dice'
        );
    }

    /**
     * ⚔️ Action Click Handler
     */
    handleActionClick(actionId) {
        if (this.combat.currentTurn !== 'player') return;
        if (this.combat.actionPoints <= 0) return;
        
        console.log(`⚔️ Utilise: ${actionId}`);
        
        switch(actionId) {
            case 'attack':
                // Géré par le clic sur ennemi
                break;
            case 'dash':
                this.combat.addBonusMovement(1);
                this.combat.consumeAction();
                break;
            case 'potion':
                this.usePotion();
                break;
            case 'scroll':
                this.useScroll();
                break;
        }
    }

    /**
     * ⏭️ End Turn Handler
     */
    handleEndTurn() {
        if (this.combat.currentTurn !== 'player') return;
        
        console.log('⏭️ Fin du tour');
        this.combat.endTurn();
    }

    /**
     * 🎨 Animations
     */
    animateDiceRoll() {
        this.thalysCircle.classList.add('rolling');
        
        // Faire tourner le dé
        let rotations = 0;
        const rollInterval = setInterval(() => {
            const face = Math.floor(Math.random() * 6) + 1;
            this.thalysCircle.querySelector('.dice-value').textContent = face;
            rotations++;
            
            if (rotations > 10) {
                clearInterval(rollInterval);
                this.thalysCircle.classList.remove('rolling');
            }
        }, 100);
    }

    showDiceResult(result) {
        this.thalysCircle.querySelector('.dice-value').textContent = result.face;
        this.thalysCircle.classList.add('result-glow');
        
        setTimeout(() => {
            this.thalysCircle.classList.remove('result-glow');
        }, 1000);
    }

    /**
     * 💬 Dialogues Thalys
     */
    getThalysWhisper() {
        const whispers = [
            "Allez... un petit 6 ?",
            "Je peux tout changer...",
            "Tu me fais confiance ?",
            "Ose. Clique.",
            "Le destin t'attend..."
        ];
        return whispers[Math.floor(Math.random() * whispers.length)];
    }

    getCurrentCorruptionStage() {
        const c = this.corruption.corruption;
        if (c < 5) return "Le Hasard";
        if (c < 10) return "Le Murmure";
        if (c < 20) return "La Dette";
        return "La Profanation";
    }

    /**
     * 🧪 Actions
     */
    usePotion() {
        const charges = parseInt(this.actionSlots.querySelector('[data-action-id="potion"] .slot-charges').textContent.slice(1));
        if (charges <= 0) return;
        
        this.playerStats.heal(30);
        this.combat.consumeAction();
        
        // Décrémenter charges
        const chargesEl = this.actionSlots.querySelector('[data-action-id="potion"] .slot-charges');
        chargesEl.textContent = `x${charges - 1}`;
    }

    useScroll() {
        const charges = parseInt(this.actionSlots.querySelector('[data-action-id="scroll"] .slot-charges').textContent.slice(1));
        if (charges <= 0) return;
        
        // Effet magique
        console.log('📜 Utilise parchemin');
        this.combat.consumeAction();
        
        // Décrémenter
        const chargesEl = this.actionSlots.querySelector('[data-action-id="scroll"] .slot-charges');
        chargesEl.textContent = `x${charges - 1}`;
    }

    /**
     * 🔄 Update Display
     */
    update() {
        // Mettre à jour les states visuels
        const isPlayerTurn = this.combat.currentTurn === 'player';
        const hasActions = this.combat.actionPoints > 0;
        
        // Thalys glow si jouable
        this.thalysCircle.classList.toggle('playable', isPlayerTurn && hasActions);
        
        // End Turn pulsing si actions restantes
        this.endTurnCircle.classList.toggle('active', isPlayerTurn);
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BG3ActionBarLayout;
}
