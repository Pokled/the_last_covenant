/**
 * CharacterCreationScene - Sélection classe + race + nom
 * @description Style Baldur's Gate 3 / Diablo 4
 */

import { AnimationUtils } from '../../utils/AnimationUtils.js';

export class CharacterCreationScene {
    constructor(eventBus, stateManager, soundManager) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;
        this.soundManager = soundManager;
        
        this.element = null;
        this.selectedClass = null;
        this.selectedRace = 'HUMAN';
        this.playerName = '';
        this.currentStep = 1; // 1: Class, 2: Race, 3: Name
        
        this.createDOM();
        this.setupEventListeners();
    }

    createDOM() {
        this.element = document.createElement('div');
        this.element.id = 'character-creation-scene';
        this.element.className = 'scene';
        
        this.element.innerHTML = `
            <div class="creation-background"></div>
            <div class="vignette"></div>
            
            <div class="creation-container">
                <h2 class="creation-title">Création du Pactisé</h2>
                
                <!-- ÉTAPE 1 : Classe -->
                <div class="creation-step" id="step-class">
                    <h3 class="step-title">Choisis ta Classe</h3>
                    
                    <div class="class-grid">
                        ${this.generateClassCards()}
                    </div>
                </div>
                
                <!-- ÉTAPE 2 : Race -->
                <div class="creation-step hidden" id="step-race">
                    <h3 class="step-title">Choisis ta Race</h3>
                    
                    <div class="race-grid">
                        ${this.generateRaceCards()}
                    </div>
                </div>
                
                <!-- ÉTAPE 3 : Nom -->
                <div class="creation-step hidden" id="step-name">
                    <h3 class="step-title">Nomme ton Pactisé</h3>
                    
                    <div class="name-input-container">
                        <input 
                            type="text" 
                            id="player-name-input" 
                            class="name-input"
                            placeholder="Entre ton nom..."
                            maxlength="20"
                        />
                        <p class="name-hint">Le nom restera gravé dans l'histoire d'Aethermoor</p>
                    </div>
                </div>
                
                <!-- Navigation -->
                <div class="creation-nav">
                    <button class="btn-secondary" id="btn-back">⬅ Retour</button>
                    <button class="btn-primary" id="btn-next">Suivant ➡</button>
                    <button class="btn-primary hidden" id="btn-confirm">Confirmer ✓</button>
                </div>
            </div>
        `;
        
        document.getElementById('game-container').appendChild(this.element);
    }

    generateClassCards() {
        const classes = [
            {
                id: 'PALADIN',
                name: 'Paladin Déchu',
                description: 'Ancien défenseur des dieux, maintenant lié au Dé.',
                stats: 'HP: 120 | ATK: 12 | DEF: 15',
                icon: '⚔️'
            },
            {
                id: 'BERSERKER',
                name: 'Berserker Sanglant',
                description: 'La rage comme carburant, la douleur comme force.',
                stats: 'HP: 140 | ATK: 18 | DEF: 5',
                icon: '🪓'
            },
            {
                id: 'NECROMANCER',
                name: 'Nécromancien',
                description: 'Murmure aux morts et sacrifie son essence.',
                stats: 'HP: 80 | ATK: 20 | DEF: 8',
                icon: '💀'
            },
            {
                id: 'ROGUE',
                name: 'Rôdeur Maudit',
                description: 'Vitesse et précision, mais corruption rapide.',
                stats: 'HP: 100 | ATK: 16 | DEF: 10',
                icon: '🗡️'
            },
            {
                id: 'MAGE',
                name: 'Mage du Vide',
                description: 'Maîtrise le chaos au prix de sa santé mentale.',
                stats: 'HP: 70 | ATK: 25 | DEF: 5',
                icon: '🔮'
            }
        ];
        
        return classes.map(cls => `
            <div class="class-card" data-class="${cls.id}">
                <div class="class-icon">${cls.icon}</div>
                <h4 class="class-name">${cls.name}</h4>
                <p class="class-description">${cls.description}</p>
                <p class="class-stats">${cls.stats}</p>
            </div>
        `).join('');
    }

    generateRaceCards() {
        const races = [
            {
                id: 'HUMAN',
                name: 'Humain',
                description: 'Adaptable. Bonus : +10% XP gagné.',
                icon: '👤'
            },
            {
                id: 'ELF',
                name: 'Elfe Corrompu',
                description: 'Agile. Bonus : +2 SPD, -5% corruption gain.',
                icon: '🧝'
            },
            {
                id: 'DWARF',
                name: 'Nain',
                description: 'Robuste. Bonus : +20 HP, +3 DEF.',
                icon: '⚒️'
            },
            {
                id: 'DEMON',
                name: 'Mi-Démon',
                description: 'Puissant. Bonus : +5 ATK, +10% corruption gain.',
                icon: '😈'
            }
        ];
        
        return races.map(race => `
            <div class="race-card" data-race="${race.id}">
                <div class="race-icon">${race.icon}</div>
                <h4 class="race-name">${race.name}</h4>
                <p class="race-description">${race.description}</p>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Sera appelé dans onEnter pour éviter les duplications
    }

    onEnter(data) {
        console.log('Character Creation Scene: Active');
        
        this.element.classList.add('active');
        this.currentStep = 1;
        this.selectedClass = null;
        this.selectedRace = 'HUMAN';
        this.playerName = '';
        
        // Setup listeners
        this.setupInteractiveListeners();
        
        // Musique
        this.soundManager.playMusic('creation');
        
        // Animations
        AnimationUtils.fadeIn(this.element.querySelector('.creation-container'), 600);
    }

    setupInteractiveListeners() {
        // Class selection
        const classCards = this.element.querySelectorAll('.class-card');
        classCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.soundManager.playHover();
            });
            
            card.addEventListener('click', () => {
                this.soundManager.playClick();
                this.selectClass(card.dataset.class);
            });
        });
        
        // Race selection
        const raceCards = this.element.querySelectorAll('.race-card');
        raceCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.soundManager.playHover();
            });
            
            card.addEventListener('click', () => {
                this.soundManager.playClick();
                this.selectRace(card.dataset.race);
            });
        });
        
        // Navigation buttons
        const btnNext = this.element.querySelector('#btn-next');
        const btnBack = this.element.querySelector('#btn-back');
        const btnConfirm = this.element.querySelector('#btn-confirm');
        
        btnNext.addEventListener('click', () => this.nextStep());
        btnBack.addEventListener('click', () => this.previousStep());
        btnConfirm.addEventListener('click', () => this.confirmCharacter());
        
        // Hover sons sur boutons
        [btnNext, btnBack, btnConfirm].forEach(btn => {
            btn.addEventListener('mouseenter', () => this.soundManager.playHover());
        });
    }

    selectClass(classId) {
        // Désélectionner toutes
        this.element.querySelectorAll('.class-card').forEach(c => c.classList.remove('selected'));
        
        // Sélectionner celle-ci
        const card = this.element.querySelector(`[data-class="${classId}"]`);
        card.classList.add('selected');
        
        this.selectedClass = classId;
        
        // Activer bouton Next
        this.element.querySelector('#btn-next').disabled = false;
    }

    selectRace(raceId) {
        // Désélectionner toutes
        this.element.querySelectorAll('.race-card').forEach(c => c.classList.remove('selected'));
        
        // Sélectionner celle-ci
        const card = this.element.querySelector(`[data-race="${raceId}"]`);
        card.classList.add('selected');
        
        this.selectedRace = raceId;
        
        // Activer bouton Next
        this.element.querySelector('#btn-next').disabled = false;
    }

    nextStep() {
        this.soundManager.playClick();
        
        if (this.currentStep === 1 && this.selectedClass) {
            this.showStep(2);
        } else if (this.currentStep === 2) {
            this.showStep(3);
        }
    }

    previousStep() {
        this.soundManager.playClick();
        
        if (this.currentStep > 1) {
            this.showStep(this.currentStep - 1);
        } else {
            // Retour au titre
            this.eventBus.emit('scene:change', { to: 'title' });
        }
    }

    showStep(stepNumber) {
        // Cacher toutes les étapes
        this.element.querySelectorAll('.creation-step').forEach(s => s.classList.add('hidden'));
        
        // Afficher l'étape demandée
        const step = this.element.querySelector(`#step-${
            stepNumber === 1 ? 'class' : stepNumber === 2 ? 'race' : 'name'
        }`);
        step.classList.remove('hidden');
        
        this.currentStep = stepNumber;
        
        // Gérer visibilité boutons
        const btnNext = this.element.querySelector('#btn-next');
        const btnConfirm = this.element.querySelector('#btn-confirm');
        const btnBack = this.element.querySelector('#btn-back');
        
        btnBack.style.display = 'block';
        
        if (stepNumber === 3) {
            btnNext.classList.add('hidden');
            btnConfirm.classList.remove('hidden');
            
            // Focus sur input
            const input = this.element.querySelector('#player-name-input');
            input.focus();
        } else {
            btnNext.classList.remove('hidden');
            btnConfirm.classList.add('hidden');
            btnNext.disabled = (stepNumber === 1 && !this.selectedClass);
        }
    }

    confirmCharacter() {
        const nameInput = this.element.querySelector('#player-name-input');
        this.playerName = nameInput.value.trim();
        
        if (!this.playerName || this.playerName.length < 2) {
            alert('Entre un nom valide (min 2 caractères)');
            return;
        }
        
        this.soundManager.playSuccess();
        
        // Créer le personnage dans le state
        this.stateManager.newGame(this.selectedClass);
        
        const state = this.stateManager.getState();
        state.player.race = this.selectedRace;
        state.player.name = this.playerName;
        this.stateManager.setState(state);
        
        console.log('Character created:', this.selectedClass, this.selectedRace, this.playerName);
        
        // Transition vers Camp
        setTimeout(() => {
            this.eventBus.emit('scene:change', { to: 'camp' });
        }, 500);
    }

    onExit() {
        this.element.classList.remove('active');
        this.soundManager.stopMusic();
    }
}
