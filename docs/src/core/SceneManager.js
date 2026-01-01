/**
 * SceneManager - Gestion des scènes du jeu
 * @description Système de transitions entre Main Menu, Game, Camp, etc.
 */

export class SceneManager {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.scenes = new Map();
        this.currentScene = null;
    }

    /**
     * Enregistrer une nouvelle scène
     * @param {string} name - Nom de la scène
     * @param {Object} sceneInstance - Instance de la scène
     */
    registerScene(name, sceneInstance) {
        this.scenes.set(name, sceneInstance);
        console.log(`✅ Scene registered: ${name}`);
    }

    /**
     * Changer de scène
     * @param {string} sceneName - Nom de la scène cible
     * @param {Object} data - Données à passer à la scène
     */
    switchScene(sceneName, data = {}) {
        const targetScene = this.scenes.get(sceneName);
        
        if (!targetScene) {
            console.error(`❌ Scene not found: ${sceneName}`);
            return;
        }

        // Exit de la scène actuelle
        if (this.currentScene) {
            this.currentScene.onExit();
        }

        // Enter dans la nouvelle scène
        this.currentScene = targetScene;
        this.currentScene.onEnter(data);

        this.eventBus.emit('scene:changed', { sceneName, data });
        console.log(`🔄 Scene switched to: ${sceneName}`);
    }

    /**
     * Obtenir la scène actuelle
     */
    getCurrentScene() {
        return this.currentScene;
    }
}
