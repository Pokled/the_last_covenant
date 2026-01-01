/**
 * THE LAST COVENANT - Main Entry Point
 * @version 1.0.0
 * @description Point d'entrée principal du jeu
 */

import { GameStateManager } from './core/GameStateManager.js';
import { EventBus } from './core/EventBus.js';
import { SceneManager } from './core/SceneManager.js';
import { SoundManager } from './utils/SoundManager.js';
import { TitleScene } from './ui/scenes/TitleScene.js';
import { CharacterCreationScene } from './ui/scenes/CharacterCreationScene.js';
import { CampScene } from './ui/scenes/CampScene.js';
import { WorldMapScene } from './ui/scenes/WorldMapScene.js';
import { MainMenuScene } from './ui/scenes/MainMenuScene.js';
import { GameScene } from './ui/scenes/GameScene.js';
import { ForgeScene } from './ui/scenes/ForgeScene.js';

class TheLastCovenant {
    constructor() {
        console.log('%c🎲 THE LAST COVENANT 🎲', 'color: #d4af37; font-size: 24px; font-weight: bold;');
        console.log('Initializing game...');

        // Singletons Core
        this.eventBus = new EventBus();
        this.stateManager = new GameStateManager(this.eventBus);
        this.sceneManager = new SceneManager(this.eventBus);
        this.soundManager = new SoundManager();

        // Exposer globalement pour debug
        window.TLC = {
            state: this.stateManager,
            events: this.eventBus,
            scenes: this.sceneManager,
            sound: this.soundManager
        };

        this.init();
    }

    async init() {
        try {
            // Enregistrer les scènes
            this.sceneManager.registerScene('title', new TitleScene(this.eventBus, this.stateManager, this.soundManager));
            this.sceneManager.registerScene('characterCreation', new CharacterCreationScene(this.eventBus, this.stateManager, this.soundManager));
            this.sceneManager.registerScene('camp', new CampScene(this.eventBus, this.stateManager, this.soundManager));
            this.sceneManager.registerScene('worldMap', new WorldMapScene(this.eventBus, this.stateManager, this.soundManager));
            this.sceneManager.registerScene('mainMenu', new MainMenuScene(this.eventBus, this.stateManager, this.soundManager));
            this.sceneManager.registerScene('game', new GameScene(this.eventBus, this.stateManager));
            this.sceneManager.registerScene('forge', new ForgeScene(this.eventBus, this.stateManager, this.soundManager));

            // Setup global listeners
            this.setupEventListeners();

            // Démarrer sur Title Screen
            this.sceneManager.switchScene('title');

            console.log('✅ Game initialized successfully');
        } catch (error) {
            console.error('❌ Initialization failed:', error);
        }
    }

    setupEventListeners() {
        // Écouter changements de scène
        this.eventBus.on('scene:change', (data) => {
            this.sceneManager.switchScene(data.to, data);
        });

        // Écouter événements globaux
        this.eventBus.on('game:over', (data) => {
            console.log('Game Over:', data);
            this.handleGameOver(data);
        });

        this.eventBus.on('game:victory', (data) => {
            console.log('Victory!', data);
            this.handleVictory(data);
        });
    }

    startNewGame() {
        console.log('Starting new game...');
        this.stateManager.newGame();
        this.sceneManager.switchScene('game');
    }

    continueGame() {
        console.log('Continuing game...');
        this.sceneManager.switchScene('game');
    }

    handleGameOver(data) {
        // TODO: Afficher écran Game Over
        setTimeout(() => {
            this.sceneManager.switchScene('mainMenu');
        }, 3000);
    }

    handleVictory(data) {
        // TODO: Afficher écran Victory
        setTimeout(() => {
            this.sceneManager.switchScene('mainMenu');
        }, 3000);
    }
}

// Démarrage quand DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new TheLastCovenant();
    });
} else {
    new TheLastCovenant();
}
