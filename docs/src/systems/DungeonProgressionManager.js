// 🎮 DUNGEON PROGRESSION MANAGER
// Gère le flow principal du jeu (progression, transitions, état)

export class DungeonProgressionManager {
    constructor(eventSystem, onEventTrigger) {
        this.eventSystem = eventSystem;
        this.onEventTrigger = onEventTrigger; // Callback vers UI
        this.playerPosition = { x: 0, y: 0 };
        this.gameState = {
            health: 100,
            maxHealth: 100,
            corruption: 0,
            gold: 0,
            xp: 0,
            level: 1,
            inventory: [],
            completedEvents: new Set()
        };
    }

    // Déplacer le joueur vers une position
    movePlayer(newX, newY) {
        this.playerPosition = { x: newX, y: newY };
        
        // Vérifier si case a un événement
        if (this.eventSystem.hasEvent(newX, newY)) {
            const event = this.eventSystem.getEvent(newX, newY);
            
            // Si pas encore visité
            if (!this.eventSystem.isVisited(newX, newY)) {
                this.triggerEvent(event, newX, newY);
            }
        }
    }

    // Déclencher un événement
    triggerEvent(event, x, y) {
        console.log('Event triggered:', event);
        
        // Marquer comme visité
        this.eventSystem.markVisited(x, y);
        
        // Notifier l'UI
        if (this.onEventTrigger) {
            this.onEventTrigger(event, x, y);
        }
    }

    // Résoudre événement combat
    resolveCombat(won, rewards = null) {
        if (won && rewards) {
            this.gameState.gold += rewards.gold || 0;
            this.gameState.xp += rewards.xp || 0;
            this.checkLevelUp();
        }
    }

    // Résoudre événement trésor
    resolveTreasure(loot) {
        if (loot.gold) {
            this.gameState.gold += loot.gold;
        }
        if (loot.items && loot.items.length > 0) {
            loot.items.forEach(item => {
                this.gameState.inventory.push(item);
            });
        }
    }

    // Résoudre dilemme cage
    resolveCage(choice, corruptionChange) {
        this.gameState.corruption += corruptionChange;
        this.gameState.corruption = Math.max(0, Math.min(100, this.gameState.corruption));
    }

    // Résoudre repos
    resolveRest(healAmount, corruptionReduction) {
        this.gameState.health = Math.min(
            this.gameState.maxHealth, 
            this.gameState.health + healAmount
        );
        
        if (corruptionReduction) {
            this.gameState.corruption += corruptionReduction;
            this.gameState.corruption = Math.max(0, this.gameState.corruption);
        }
    }

    // Vérifier level up
    checkLevelUp() {
        const xpNeeded = this.gameState.level * 100;
        if (this.gameState.xp >= xpNeeded) {
            this.gameState.level++;
            this.gameState.xp -= xpNeeded;
            this.gameState.maxHealth += 10;
            this.gameState.health = this.gameState.maxHealth;
            console.log('LEVEL UP! Nouveau niveau:', this.gameState.level);
        }
    }

    // Acheter un item
    buyItem(item) {
        if (this.gameState.gold >= item.price) {
            this.gameState.gold -= item.price;
            this.gameState.inventory.push(item.name);
            return true;
        }
        return false;
    }

    // Utiliser un item
    useItem(itemName) {
        const index = this.gameState.inventory.indexOf(itemName);
        if (index !== -1) {
            this.gameState.inventory.splice(index, 1);
            
            // Appliquer effets (simplifié)
            if (itemName.includes('Potion de Soin')) {
                this.gameState.health = Math.min(
                    this.gameState.maxHealth,
                    this.gameState.health + 50
                );
            }
            
            return true;
        }
        return false;
    }

    // Prendre des dégâts
    takeDamage(amount) {
        this.gameState.health -= amount;
        if (this.gameState.health <= 0) {
            this.gameState.health = 0;
            this.onDeath();
        }
    }

    // Mort du joueur
    onDeath() {
        console.log('GAME OVER');
        // TODO: Écran game over
    }

    // Sauvegarder l'état
    saveState() {
        const saveData = {
            position: this.playerPosition,
            state: this.gameState,
            visited: Array.from(this.eventSystem.visited)
        };
        localStorage.setItem('dungeon_save', JSON.stringify(saveData));
        console.log('Game saved!');
    }

    // Charger l'état
    loadState() {
        const saveData = localStorage.getItem('dungeon_save');
        if (saveData) {
            const data = JSON.parse(saveData);
            this.playerPosition = data.position;
            this.gameState = data.state;
            data.visited.forEach(key => this.eventSystem.visited.add(key));
            console.log('Game loaded!');
            return true;
        }
        return false;
    }

    // Obtenir état pour UI
    getStateForUI() {
        return {
            ...this.gameState,
            position: this.playerPosition,
            healthPercent: (this.gameState.health / this.gameState.maxHealth) * 100,
            corruptionPercent: this.gameState.corruption
        };
    }
}
