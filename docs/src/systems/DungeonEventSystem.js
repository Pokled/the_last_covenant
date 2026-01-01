// 🗺️ DUNGEON EVENT SYSTEM
// Gère tous les événements dans le donjon

export class DungeonEventSystem {
    constructor(dungeon) {
        this.dungeon = dungeon;
        this.events = new Map();
        this.visited = new Set();
        this.generateEvents();
    }

    generateEvents() {
        const rooms = this.dungeon.rooms;
        
        // Placer événements dans les salles
        rooms.forEach((room, index) => {
            // Skip première salle (départ)
            if (index === 0) return;
            
            const centerX = Math.floor(room.x + room.width / 2);
            const centerY = Math.floor(room.y + room.height / 2);
            const key = `${centerX},${centerY}`;
            
            // Dernière salle = Boss
            if (index === rooms.length - 1) {
                this.events.set(key, {
                    type: 'boss',
                    boss: this.getBossForFloor(),
                    required: true,
                    icon: '👑',
                    color: '#ff0000'
                });
                return;
            }
            
            // Distribution événements
            const rand = Math.random();
            let event;
            
            if (rand < 0.4) {
                // 40% Combat
                event = this.createCombatEvent();
            } else if (rand < 0.6) {
                // 20% Trésor
                event = this.createTreasureEvent();
            } else if (rand < 0.7) {
                // 10% Cage/Dilemme
                event = this.createCageEvent();
            } else if (rand < 0.75) {
                // 5% Marchand
                event = this.createMerchantEvent();
            } else if (rand < 0.8) {
                // 5% Repos
                event = this.createRestEvent();
            } else {
                // 20% Événement spécial
                event = this.createRandomEvent();
            }
            
            this.events.set(key, event);
        });
    }

    createCombatEvent() {
        const enemies = ['Gobelin', 'Squelette', 'Cultiste', 'Zombie', 'Garde Corrompu'];
        const enemy = enemies[Math.floor(Math.random() * enemies.length)];
        
        return {
            type: 'combat',
            enemy: enemy,
            difficulty: Math.random() > 0.7 ? 'hard' : 'normal',
            rewards: {
                gold: Math.floor(Math.random() * 100) + 50,
                xp: Math.floor(Math.random() * 50) + 25
            },
            icon: '⚔️',
            color: '#ff6b6b'
        };
    }

    createTreasureEvent() {
        const rarities = ['common', 'uncommon', 'rare'];
        const rarity = rarities[Math.floor(Math.random() * rarities.length)];
        
        return {
            type: 'treasure',
            rarity: rarity,
            loot: {
                gold: Math.floor(Math.random() * 200) + 100,
                items: this.generateLoot(rarity)
            },
            icon: '💎',
            color: '#ffd700'
        };
    }

    createCageEvent() {
        const scenarios = [
            { id: 1, prisoners: ['Le Vieux', 'Le Démon'] },
            { id: 2, prisoners: ['Le Guerrier', 'Le Blessé'] },
            { id: 3, prisoners: ['L\'Enfant', 'La Serrure'] }
        ];
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        
        return {
            type: 'cage',
            scenarioId: scenario.id,
            prisoners: scenario.prisoners,
            icon: '⚖️',
            color: '#9C27B0'
        };
    }

    createMerchantEvent() {
        return {
            type: 'merchant',
            npc: 'Corvus',
            inventory: this.generateShopInventory(),
            dialogue: "Ah, un survivant... Tu veux acheter quelque chose ?",
            icon: '🛒',
            color: '#4CAF50'
        };
    }

    createRestEvent() {
        return {
            type: 'rest',
            heals: true,
            healAmount: 50,
            corruptionReduction: -5,
            services: ['heal', 'save'],
            icon: '🔥',
            color: '#FF9800'
        };
    }

    createRandomEvent() {
        const events = [
            {
                type: 'random',
                eventName: 'Le Miroir qui Ment',
                description: 'Un miroir intact au milieu du couloir...',
                icon: '🪞',
                color: '#2196F3'
            },
            {
                type: 'random',
                eventName: 'L\'Enfant Perdu',
                description: 'Un enfant, seul, qui te regarde...',
                icon: '👶',
                color: '#9E9E9E'
            },
            {
                type: 'random',
                eventName: 'Murmures de Thalys',
                description: 'Tu entends le dé qui roule...',
                icon: '🎲',
                color: '#8f5bd8'
            }
        ];
        
        return events[Math.floor(Math.random() * events.length)];
    }

    getBossForFloor() {
        const bosses = [
            'Keeper of Bones',
            'Le Gardien Oublié',
            'Betrayer King'
        ];
        return bosses[Math.floor(Math.random() * bosses.length)];
    }

    generateLoot(rarity) {
        const items = {
            common: ['Potion de Soin', 'Pain Rassis', 'Clé Rouillée'],
            uncommon: ['Potion de Force', 'Parchemin Ancien', 'Amulette'],
            rare: ['Épée Enchantée', 'Armure Maudite', 'Grimoire']
        };
        
        const pool = items[rarity];
        const count = rarity === 'rare' ? 1 : Math.floor(Math.random() * 2) + 1;
        const result = [];
        
        for (let i = 0; i < count; i++) {
            result.push(pool[Math.floor(Math.random() * pool.length)]);
        }
        
        return result;
    }

    generateShopInventory() {
        return [
            { name: 'Potion de Soin', price: 50, effect: '+50 HP' },
            { name: 'Antidote', price: 30, effect: 'Enlève poison' },
            { name: 'Pierre de Téléportation', price: 200, effect: 'Retour au camp' },
            { name: 'Amulette de Protection', price: 150, effect: '+10 DEF' }
        ];
    }

    getEvent(x, y) {
        const key = `${x},${y}`;
        return this.events.get(key);
    }

    hasEvent(x, y) {
        const key = `${x},${y}`;
        return this.events.has(key);
    }

    markVisited(x, y) {
        const key = `${x},${y}`;
        this.visited.add(key);
    }

    isVisited(x, y) {
        const key = `${x},${y}`;
        return this.visited.has(key);
    }

    getEventIcon(x, y) {
        const event = this.getEvent(x, y);
        return event ? event.icon : null;
    }

    getEventColor(x, y) {
        const event = this.getEvent(x, y);
        return event ? event.color : null;
    }
}
