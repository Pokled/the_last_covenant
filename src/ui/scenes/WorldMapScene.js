/**
 * WorldMapScene - Carte du monde avec donjons sélectionnables
 * @description Carte d'Aethermoor avec nodes de donjons
 */

import { AnimationUtils } from '../../utils/AnimationUtils.js';

export class WorldMapScene {
    constructor(eventBus, stateManager, soundManager) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;
        this.soundManager = soundManager;
        
        this.element = null;
        this.selectedDungeon = null;
        
        this.dungeons = [
            {
                id: 'ruins_of_morwyn',
                name: 'Ruines de Morwyn',
                description: 'Les vestiges de la cathédrale de l\'Architecte. Corruption faible.',
                difficulty: 1,
                minCorruption: 0,
                floors: 3,
                icon: '🏛️',
                position: { x: 20, y: 70 },
                unlocked: true,
                completed: false
            },
            {
                id: 'krovax_battlefields',
                name: 'Champs de Krovax',
                description: 'Champs de bataille éternels. Les morts se battent encore.',
                difficulty: 2,
                minCorruption: 10,
                floors: 5,
                icon: '⚔️',
                position: { x: 35, y: 45 },
                unlocked: false,
                completed: false
            },
            {
                id: 'sylthara_forest',
                name: 'Forêt de Sylthara',
                description: 'Forêt carnivore. Les arbres murmurent des mensonges.',
                difficulty: 3,
                minCorruption: 20,
                floors: 5,
                icon: '🌲',
                position: { x: 55, y: 60 },
                unlocked: false,
                completed: false
            },
            {
                id: 'noxar_crypts',
                name: 'Cryptes de Noxar',
                description: 'Les morts refusent de rester morts.',
                difficulty: 4,
                minCorruption: 40,
                floors: 7,
                icon: '⚰️',
                position: { x: 30, y: 25 },
                unlocked: false,
                completed: false
            },
            {
                id: 'vyr_library',
                name: 'Bibliothèque de Vyr',
                description: 'Connaissance interdite. La vérité rend fou.',
                difficulty: 5,
                minCorruption: 60,
                floors: 7,
                icon: '📚',
                position: { x: 65, y: 35 },
                unlocked: false,
                completed: false
            },
            {
                id: 'thalys_heart',
                name: 'Cœur de Thalys',
                description: 'Le Dé lui-même t\'attend. Fin du Pacte.',
                difficulty: 6,
                minCorruption: 80,
                floors: 10,
                icon: '🎲',
                position: { x: 80, y: 15 },
                unlocked: false,
                completed: false,
                isFinal: true
            }
        ];
        
        this.createDOM();
        this.setupEventListeners();
    }

    createDOM() {
        this.element = document.createElement('div');
        this.element.id = 'world-map-scene';
        this.element.className = 'scene';
        
        this.element.innerHTML = `
            <div class="map-background"></div>
            
            <div class="map-container">
                <!-- Header -->
                <div class="map-header">
                    <h2 class="map-title">🗺️ Aethermoor</h2>
                    <p class="map-subtitle">Les Terres Brisées des Dieux Morts</p>
                </div>
                
                <!-- Zone de la carte -->
                <div class="map-canvas-wrapper">
                    <div class="map-canvas" id="map-canvas">
                        ${this.generateDungeonNodes()}
                    </div>
                </div>
                
                <!-- Panneau d'info dungeon -->
                <div class="dungeon-info-panel hidden" id="dungeon-info-panel">
                    <h3 id="dungeon-info-name">Nom du Donjon</h3>
                    <p id="dungeon-info-description">Description</p>
                    <div class="dungeon-stats">
                        <span>⚔️ Difficulté: <strong id="dungeon-difficulty">1</strong></span>
                        <span>🏰 Étages: <strong id="dungeon-floors">3</strong></span>
                        <span>💀 Corruption min: <strong id="dungeon-corruption">0%</strong></span>
                    </div>
                    <div class="dungeon-actions">
                        <button class="btn-primary" id="btn-enter-dungeon">Entrer dans le Donjon</button>
                        <button class="btn-secondary" id="btn-cancel-dungeon">Annuler</button>
                    </div>
                </div>
                
                <!-- Actions -->
                <div class="map-footer">
                    <button class="btn-secondary" id="btn-back-to-camp">⬅ Retour au Camp</button>
                </div>
            </div>
            
            <div class="vignette"></div>
        `;
        
        document.getElementById('game-container').appendChild(this.element);
    }

    generateDungeonNodes() {
        return this.dungeons.map(dungeon => `
                <div 
                class="dungeon-node ${dungeon.unlocked ? 'unlocked' : 'locked'} ${dungeon.completed ? 'completed' : ''} ${dungeon.isFinal ? 'final' : ''}"
                data-dungeon-id="${dungeon.id}"
                style="left: ${dungeon.position.x}%; top: ${dungeon.position.y}%;"
            >
                <div class="node-icon-wrapper">
                    <div class="node-icon">${dungeon.icon}</div>
                    ${!dungeon.unlocked ? '<div class="node-lock">🔒</div>' : ''}
                    ${dungeon.completed ? '<div class="node-badge">✓</div>' : ''}
                </div>
                <div class="node-name">${dungeon.name}</div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Sera appelé dans onEnter
    }

    onEnter(data) {
        console.log('World Map Scene: Active');
        
        this.element.classList.add('active');
        
        // Musique
        this.soundManager.playMusic('map');
        
        // Charger progression
        this.updateDungeonStates();
        
        // Setup interactions
        this.setupInteractions();
        
        // Animations
        AnimationUtils.fadeIn(this.element.querySelector('.map-container'), 600);
    }

    updateDungeonStates() {
        const state = this.stateManager.getState();
        const corruption = state.corruption;
        
        // Débloquer donjons selon corruption
        this.dungeons.forEach(dungeon => {
            if (corruption >= dungeon.minCorruption) {
                dungeon.unlocked = true;
            }
        });
        
        // Re-render nodes
        const mapCanvas = this.element.querySelector('#map-canvas');
        mapCanvas.innerHTML = this.generateDungeonNodes();
        
        // Re-setup listeners sur nouveaux nodes
        this.setupDungeonNodes();
    }

    setupInteractions() {
        // Nodes de donjons
        this.setupDungeonNodes();
        
        // Bouton retour
        const btnBack = this.element.querySelector('#btn-back-to-camp');
        btnBack.addEventListener('mouseenter', () => this.soundManager.playHover());
        btnBack.addEventListener('click', () => {
            this.soundManager.playClick();
            this.backToCamp();
        });
        
        // Boutons panneau info
        const btnEnter = this.element.querySelector('#btn-enter-dungeon');
        const btnCancel = this.element.querySelector('#btn-cancel-dungeon');
        
        btnEnter.addEventListener('mouseenter', () => this.soundManager.playHover());
        btnEnter.addEventListener('click', () => this.enterDungeon());
        
        btnCancel.addEventListener('mouseenter', () => this.soundManager.playHover());
        btnCancel.addEventListener('click', () => this.closeInfoPanel());
    }

    setupDungeonNodes() {
        const nodes = this.element.querySelectorAll('.dungeon-node');
        
        nodes.forEach(node => {
            const dungeonId = node.dataset.dungeonId;
            const dungeon = this.dungeons.find(d => d.id === dungeonId);
            
            if (!dungeon) return;
            
            node.addEventListener('mouseenter', () => {
                if (dungeon.unlocked) {
                    this.soundManager.playHover();
                }
            });
            
            node.addEventListener('click', () => {
                if (dungeon.unlocked) {
                    this.soundManager.playClick();
                    this.showDungeonInfo(dungeon);
                } else {
                    this.soundManager.playCorruption();
                    this.showLockedMessage(dungeon);
                }
            });
        });
    }

    showDungeonInfo(dungeon) {
        this.selectedDungeon = dungeon;
        
        const panel = this.element.querySelector('#dungeon-info-panel');
        
        document.getElementById('dungeon-info-name').textContent = dungeon.name;
        document.getElementById('dungeon-info-description').textContent = dungeon.description;
        document.getElementById('dungeon-difficulty').textContent = dungeon.difficulty;
        document.getElementById('dungeon-floors').textContent = dungeon.floors;
        document.getElementById('dungeon-corruption').textContent = `${dungeon.minCorruption}%`;
        
        panel.classList.remove('hidden');
        AnimationUtils.fadeIn(panel, 300);
    }

    closeInfoPanel() {
        this.soundManager.playClick();
        const panel = this.element.querySelector('#dungeon-info-panel');
        AnimationUtils.fadeOut(panel, 300, () => {
            panel.classList.add('hidden');
        });
        this.selectedDungeon = null;
    }

    showLockedMessage(dungeon) {
        alert(`🔒 Donjon verrouillé\n\nRequis : ${dungeon.minCorruption}% corruption minimum\n\nAugmente ta corruption pour débloquer ce donjon.`);
    }

    enterDungeon() {
        if (!this.selectedDungeon) return;
        
        console.log(`Entering dungeon: ${this.selectedDungeon.id}`);
        this.soundManager.playSuccess();
        
        // Screen shake
        AnimationUtils.screenShake(this.element, 300, 5);
        
        // Sauvegarder + entrer dans le donjon
        this.stateManager.saveGame();
        
        setTimeout(() => {
            // TODO: Passer au dungeon avec l'ID
            this.eventBus.emit('scene:change', { 
                to: 'game',
                dungeonId: this.selectedDungeon.id 
            });
        }, 500);
    }

    backToCamp() {
        this.eventBus.emit('scene:change', { to: 'camp' });
    }

    onExit() {
        this.element.classList.remove('active');
        this.soundManager.stopMusic();
    }
}
