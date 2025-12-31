/**
 * 📜 QUEST SYSTEM - Système de quêtes dynamiques
 * Génère des quêtes procédurales basées sur le donjon
 */

export class QuestSystem {
    constructor() {
        this.quests = [];
        this.activeQuests = [];
        this.completedQuests = [];
        this.questIdCounter = 0;
    }
    
    /**
     * Génère des quêtes pour un donjon
     */
    generateQuestsForDungeon(dungeon, eventSystem) {
        this.quests = [];
        
        // Quête principale: Atteindre la sortie
        this.addQuest({
            id: this.questIdCounter++,
            title: 'Sortir Vivant',
            description: 'Trouve la sortie du donjon maudit.',
            type: 'main',
            objectives: [
                { type: 'reach', target: 'exit', current: 0, required: 1, description: 'Atteindre la sortie' }
            ],
            rewards: { xp: 100, gold: 50 },
            icon: '🚪'
        });
        
        // Quête: Éliminer des ennemis
        const combatEvents = Array.from(eventSystem.events.values()).filter(e => e.type === 'combat');
        if (combatEvents.length >= 3) {
            this.addQuest({
                id: this.questIdCounter++,
                title: 'Chasseur de Monstres',
                description: 'Élimine 3 créatures dans le donjon.',
                type: 'side',
                objectives: [
                    { type: 'kill', target: 'any', current: 0, required: 3, description: 'Éliminer des ennemis (0/3)' }
                ],
                rewards: { xp: 75, gold: 30, items: ['Potion de Soin'] },
                icon: '⚔️'
            });
        }
        
        // Quête: Trouver des trésors
        const treasureEvents = Array.from(eventSystem.events.values()).filter(e => e.type === 'treasure');
        if (treasureEvents.length >= 2) {
            this.addQuest({
                id: this.questIdCounter++,
                title: 'Chasseur de Trésors',
                description: 'Ouvre 2 coffres au trésor.',
                type: 'side',
                objectives: [
                    { type: 'loot', target: 'treasure', current: 0, required: 2, description: 'Ouvrir des coffres (0/2)' }
                ],
                rewards: { xp: 50, gold: 100 },
                icon: '💎'
            });
        }
        
        // Quête: Libérer des prisonniers
        const cageEvents = Array.from(eventSystem.events.values()).filter(e => e.type === 'cage');
        if (cageEvents.length >= 1) {
            this.addQuest({
                id: this.questIdCounter++,
                title: 'Le Dilemme Moral',
                description: 'Résous les dilemmes des cages.',
                type: 'side',
                objectives: [
                    { type: 'interact', target: 'cage', current: 0, required: cageEvents.length, description: `Résoudre les dilemmes (0/${cageEvents.length})` }
                ],
                rewards: { xp: 100, corruption: -5 },
                icon: '🔒'
            });
        }
        
        // Quête: Explorer tout le donjon
        this.addQuest({
            id: this.questIdCounter++,
            title: 'Explorateur Intrépide',
            description: 'Explore 80% des salles du donjon.',
            type: 'side',
            objectives: [
                { 
                    type: 'explore', 
                    target: 'rooms', 
                    current: 0, 
                    required: Math.floor(dungeon.width * dungeon.height * 0.8), 
                    description: 'Explorer les salles (0/?)' 
                }
            ],
            rewards: { xp: 150 },
            icon: '🗺️'
        });
        
        // Quête: Se reposer
        const restEvents = Array.from(eventSystem.events.values()).filter(e => e.type === 'rest');
        if (restEvents.length >= 1) {
            this.addQuest({
                id: this.questIdCounter++,
                title: 'Repos du Guerrier',
                description: 'Trouve et utilise un feu de camp.',
                type: 'side',
                objectives: [
                    { type: 'rest', target: 'campfire', current: 0, required: 1, description: 'Se reposer (0/1)' }
                ],
                rewards: { xp: 25, health: 20 },
                icon: '🔥'
            });
        }
        
        // Active toutes les quêtes générées
        this.activeQuests = [...this.quests];
        
        return this.quests;
    }
    
    /**
     * Ajoute une quête
     */
    addQuest(quest) {
        this.quests.push(quest);
    }
    
    /**
     * Met à jour une quête
     */
    updateQuest(type, target = 'any', amount = 1) {
        this.activeQuests.forEach(quest => {
            quest.objectives.forEach(obj => {
                if (obj.type === type && (obj.target === target || obj.target === 'any')) {
                    obj.current = Math.min(obj.current + amount, obj.required);
                    obj.description = this.getObjectiveDescription(obj);
                    
                    // Vérifie si la quête est complète
                    if (this.isQuestComplete(quest)) {
                        this.completeQuest(quest);
                    }
                }
            });
        });
    }
    
    /**
     * Vérifie si une quête est complète
     */
    isQuestComplete(quest) {
        return quest.objectives.every(obj => obj.current >= obj.required);
    }
    
    /**
     * Complète une quête
     */
    completeQuest(quest) {
        const index = this.activeQuests.indexOf(quest);
        if (index > -1) {
            this.activeQuests.splice(index, 1);
            this.completedQuests.push(quest);
            
            console.log(`✅ Quête terminée: ${quest.title}`);
            return quest.rewards;
        }
        return null;
    }
    
    /**
     * Génère la description d'un objectif
     */
    getObjectiveDescription(obj) {
        const progress = `(${obj.current}/${obj.required})`;
        
        switch(obj.type) {
            case 'kill':
                return `Éliminer des ennemis ${progress}`;
            case 'loot':
                return `Ouvrir des coffres ${progress}`;
            case 'interact':
                return `Résoudre les dilemmes ${progress}`;
            case 'explore':
                return `Explorer les salles ${progress}`;
            case 'rest':
                return `Se reposer ${progress}`;
            case 'reach':
                return `Atteindre la sortie ${progress}`;
            default:
                return `Objectif ${progress}`;
        }
    }
    
    /**
     * Retourne les quêtes actives pour l'UI
     */
    getActiveQuests() {
        return this.activeQuests.map(quest => ({
            ...quest,
            progress: this.getQuestProgress(quest)
        }));
    }
    
    /**
     * Calcule le progrès d'une quête (0-100%)
     */
    getQuestProgress(quest) {
        const total = quest.objectives.reduce((sum, obj) => sum + obj.required, 0);
        const current = quest.objectives.reduce((sum, obj) => sum + obj.current, 0);
        return Math.floor((current / total) * 100);
    }
    
    /**
     * Sauvegarde
     */
    toJSON() {
        return {
            quests: this.quests,
            activeQuests: this.activeQuests,
            completedQuests: this.completedQuests,
            questIdCounter: this.questIdCounter
        };
    }
    
    /**
     * Restauration
     */
    fromJSON(data) {
        this.quests = data.quests || [];
        this.activeQuests = data.activeQuests || [];
        this.completedQuests = data.completedQuests || [];
        this.questIdCounter = data.questIdCounter || 0;
    }
}
