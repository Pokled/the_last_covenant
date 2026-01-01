/**
 * GameStateManager - Gestion centralisée de l'état du jeu
 * @description État immutable avec événements sur changements
 */

export class GameStateManager {
    constructor(eventBus) {
        this.eventBus = eventBus;
        
        // État initial
        this.state = {
            player: null,
            corruption: 0,
            floor: 1,
            room: 1,
            maxRooms: 10,
            gold: 0,
            rubies: 0,
            inventory: [],
            materials: {},
            cortege: [],
            unlockedClasses: ['PALADIN'], // Paladin débloqué par défaut
            achievements: [],
            runs: 0,
            totalDeaths: 0,
            gameStarted: false
        };

        this.listeners = [];
    }

    /**
     * Obtenir l'état complet (immutable)
     */
    getState() {
        return { ...this.state };
    }

    /**
     * Mettre à jour l'état (immutable)
     * @param {Object} updates - Modifications à apporter
     */
    setState(updates) {
        const oldState = this.getState();
        this.state = { ...this.state, ...updates };
        
        // Notifier tous les listeners
        this.notify(oldState, this.state);
        
        // Émettre événement spécifique si besoin
        if (updates.corruption !== undefined) {
            this.eventBus.emit('corruption:changed', {
                old: oldState.corruption,
                new: this.state.corruption
            });
        }
        
        if (updates.player?.HP !== undefined) {
            this.eventBus.emit('player:hp-changed', {
                current: this.state.player.HP,
                max: this.state.player.maxHP
            });
        }
    }

    /**
     * S'abonner aux changements d'état
     * @param {Function} callback - Fonction appelée à chaque changement
     */
    subscribe(callback) {
        this.listeners.push(callback);
        
        // Retourner fonction de cleanup
        return () => {
            const index = this.listeners.indexOf(callback);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    /**
     * Notifier tous les listeners
     */
    notify(oldState, newState) {
        this.listeners.forEach(callback => {
            try {
                callback(newState, oldState);
            } catch (error) {
                console.error('Error in state listener:', error);
            }
        });
    }

    /**
     * Démarrer une nouvelle partie
     */
    newGame(classId = 'PALADIN') {
        console.log(`Starting new game with class: ${classId}`);
        
        // Créer nouveau joueur
        const player = this.createPlayer(classId);
        
        this.setState({
            player,
            corruption: 0,
            floor: 1,
            room: 1,
            gold: 250,
            rubies: 0,
            inventory: ['epee_rouillee', 'hache_fendue', 'armure_rapiécée', 'tunique_usee'],
            materials: {
                'larme_krovax': 2,
                'plaque_fer': 4,
                'fragment_ame': 0
            },
            cortege: [],
            runs: this.state.runs + 1,
            gameStarted: true
        });

        this.eventBus.emit('game:started', { classId });
    }

    /**
     * Créer un personnage joueur
     * @param {string} classId - ID de la classe
     */
    createPlayer(classId) {
        // TODO: Charger depuis data/classes.json
        const baseStats = {
            PALADIN: {
                name: 'Paladin Déchu',
                maxHP: 120,
                HP: 120,
                ATK: 12,
                DEF: 15,
                SPD: 8,
                CRIT: 0.05,
                corruptionModifier: 0.8
            }
        };

        const stats = baseStats[classId] || baseStats.PALADIN;
        
        return {
            classId,
            ...stats,
            startingItems: ['POTION_HEAL', 'SWORD_BASIC'],
            skills: {
                passive: 'HOLY_ARMOR',
                active: 'BROKEN_JUDGMENT'
            },
            activeSkillCooldown: 0
        };
    }

    /**
     * Sauvegarder la partie
     */
    saveGame() {
        try {
            const saveData = {
                state: this.getState(),
                timestamp: Date.now(),
                version: '1.0.0'
            };
            
            localStorage.setItem('tlc_save', JSON.stringify(saveData));
            console.log('✅ Game saved');
            
            this.eventBus.emit('game:saved');
            return true;
        } catch (error) {
            console.error('❌ Save failed:', error);
            return false;
        }
    }

    /**
     * Charger la partie
     */
    loadGame() {
        try {
            const saveDataStr = localStorage.getItem('tlc_save');
            if (!saveDataStr) return false;

            const saveData = JSON.parse(saveDataStr);
            this.state = saveData.state;
            
            console.log('✅ Game loaded');
            this.eventBus.emit('game:loaded', saveData);
            
            return true;
        } catch (error) {
            console.error('❌ Load failed:', error);
            return false;
        }
    }

    /**
     * Incrémenter corruption
     * @param {number} amount - Quantité à ajouter
     */
    addCorruption(amount) {
        const currentCorruption = this.state.corruption;
        const player = this.state.player;
        
        if (!player) return;

        // Appliquer multiplicateur de classe
        const modifier = player.corruptionModifier || 1.0;
        
        // Effet boule de neige (formule du système)
        const multiplier = 1 + (currentCorruption / 100) * 0.5;
        
        const finalAmount = amount * multiplier * modifier;
        const newCorruption = Math.min(100, currentCorruption + finalAmount);
        
        this.setState({ corruption: Math.round(newCorruption * 10) / 10 });

        // Vérifier seuils
        this.checkCorruptionThresholds(currentCorruption, newCorruption);
    }

    /**
     * Vérifier franchissement de seuils de corruption
     */
    checkCorruptionThresholds(oldValue, newValue) {
        const thresholds = [20, 40, 60, 80, 100];
        
        for (const threshold of thresholds) {
            if (oldValue < threshold && newValue >= threshold) {
                this.eventBus.emit('corruption:threshold', {
                    threshold,
                    stage: this.getCorruptionStage(newValue)
                });
            }
        }
    }

    /**
     * Obtenir le stade de corruption
     */
    getCorruptionStage(corruption) {
        if (corruption < 20) return 0; // L'Initié
        if (corruption < 40) return 1; // La Fissure
        if (corruption < 60) return 2; // La Profanation
        if (corruption < 80) return 3; // La Damnation
        if (corruption < 100) return 4; // La Rupture
        return 5; // L'Oubli
    }
}
