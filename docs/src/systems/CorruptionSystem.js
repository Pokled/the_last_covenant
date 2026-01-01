/**
 * 💀 CORRUPTION SYSTEM - THE LAST COVENANT
 * 
 * Le système central du jeu. La corruption est :
 * - Inévitable
 * - Tentante (donne du pouvoir)
 * - Progressive (effet boule de neige)
 * - Traçable (historique complet)
 * 
 * @status VERROUILLÉ - Ne pas modifier sans validation
 * @version 1.0.0
 */

export class CorruptionSystem {
    constructor(gameInstance) {
        this.game = gameInstance;
        
        // État actuel
        this.corruption = 0;  // 0-15+ (pas de limite technique, mais paliers narratifs)
        this.currentThreshold = 0;  // 0-3 (paliers)
        
        // NOUVEAU : Mémoire du dé (influence la RNG future)
        this.diceMemory = {
            forcedSixes: 0,      // Nombre de fois où on a forcé un 6
            avoidedFailures: 0,  // Nombre de fois où on a évité un échec
            extremeBias: 0,      // Tendance vers extrêmes (1 ou 6)
            hostilityLevel: 0    // Niveau d'hostilité des events
        };
        
        // Dette narrative (effets à déclencher)
        this.narrativeDebts = [];
        
        // Historique (pour analytics et dialogues de Thalys)
        this.history = [];
        
        // Configuration des paliers (échelle 0-15+)
        this.thresholds = [
            {
                id: 0,
                name: "Le Hasard",
                range: [0, 4],
                effects: {
                    rngNeutral: true,
                    worldFairness: 1.0,    // Monde juste
                    eventHostility: 0,
                    forbiddenOptions: false
                },
                visual: "normal",
                narrative: "Le monde est juste. La RNG est pure.",
                diceComment: "Un lancer propre. Ennuyeux, mais propre."
            },
            {
                id: 1,
                name: "Le Murmure",
                range: [5, 9],
                effects: {
                    rngNeutral: false,
                    worldFairness: 0.85,   // Le monde devient moins juste
                    eventHostility: 0.15,   // +15% hostilité
                    forbiddenOptions: true  // Options interdites apparaissent
                },
                visual: "whispers",  // Yeux qui brillent parfois
                narrative: "Le Dé suggère des choix. Les events deviennent agressifs.",
                diceComment: "Tu sens ça ? Ce petit... picotement ? C'est moi qui m'installe.",
                unlockedFeatures: ["forbidden_options", "aggressive_events"]
            },
            {
                id: 2,
                name: "La Dette",
                range: [10, 14],
                effects: {
                    rngNeutral: false,
                    worldFairness: 0.60,   // Monde biaisé
                    eventHostility: 0.30,   // +30% hostilité
                    rulesModified: true     // Les règles changent
                },
                visual: "dark_aura",  // Aura sombre visible
                narrative: "Certains combats deviennent inévitables. Le Dé modifie les règles.",
                diceComment: "Tu m'as tellement nourri... Maintenant c'est MOI qui décide.",
                unlockedFeatures: ["inevitable_encounters", "rule_changes", "exclusive_events"]
            },
            {
                id: 3,
                name: "La Profanation",
                range: [15, 999],  // Pas de limite haute
                effects: {
                    rngNeutral: false,
                    worldFairness: 0.30,   // Monde hostile
                    eventHostility: 0.60,   // +60% hostilité
                    anomaly: true          // Le joueur EST une anomalie
                },
                visual: "anomaly",  // Transformation visible
                narrative: "Tu es devenu une anomalie. Le Dé peut refuser... ou exiger un sacrifice.",
                diceComment: "Magnifique. Tu n'es plus humain. Tu es... **intéressant**.",
                unlockedFeatures: ["special_bosses", "alternate_endings", "dice_rebellion"]
            }
        ];
        
        console.log('💀 CorruptionSystem initialisé');
    }
    
    /**
     * Getter pour accéder aux stages (thresholds)
     */
    getStages() {
        return this.thresholds;
    }

    /**
     * Calcule le gain de corruption (simplifié pour échelle 0-15+)
     * @param {number} baseValue - Coût de base de l'action (1-4)
     * @param {number} classModifier - Modificateur de classe
     * @returns {number} Gain final
     */
    calculateGain(baseValue, classModifier = 1.0) {
        // Plus simple : pas de boule de neige mathématique
        // La complexité vient des EFFETS, pas du calcul
        let gain = baseValue * classModifier;
        
        // Arrondi
        return Math.round(gain * 10) / 10;
    }
    
    /**
     * NOUVEAU : Enregistre une action dans la mémoire du dé
     * @param {string} actionType - Type d'action ('force_six', 'avoid_failure', etc.)
     */
    rememberAction(actionType) {
        switch(actionType) {
            case 'force_six':
                this.diceMemory.forcedSixes++;
                this.diceMemory.extremeBias += 0.1;  // Augmente tendance vers extrêmes
                console.log(`🎲 Dé se souvient : Tu as forcé un 6 (${this.diceMemory.forcedSixes} fois)`);
                break;
                
            case 'avoid_failure':
                this.diceMemory.avoidedFailures++;
                this.diceMemory.hostilityLevel += 0.15;  // Augmente hostilité
                console.log(`🎲 Dé se souvient : Tu as évité un échec (${this.diceMemory.avoidedFailures} fois)`);
                break;
                
            case 'reroll':
                this.diceMemory.extremeBias += 0.05;
                break;
        }
    }
    
    /**
     * Obtient le stage actuel de corruption
     * @returns {Object} Le threshold actuel
     */
    getCurrentStage() {
        return this.thresholds.find(t => 
            this.corruption >= t.range[0] && this.corruption <= t.range[1]
        ) || this.thresholds[0];
    }
    
    /**
     * NOUVEAU : Ajoute une dette narrative (effet futur à déclencher)
     * @param {Object} debt - Description de la dette
     */
    addNarrativeDebt(debt) {
        this.narrativeDebts.push({
            id: Date.now(),
            type: debt.type,
            description: debt.description,
            triggerCondition: debt.triggerCondition,
            effect: debt.effect,
            addedAt: Date.now()
        });
        
        console.log(`📜 Dette narrative ajoutée : ${debt.description}`);
    }
    
    /**
     * NOUVEAU : Vérifie et déclenche les dettes narratives
     * @param {string} eventType - Type d'event en cours ('rest', 'merchant', etc.)
     * @returns {Object|null} Dette déclenchée ou null
     */
    checkNarrativeDebts(eventType) {
        for (let i = 0; i < this.narrativeDebts.length; i++) {
            const debt = this.narrativeDebts[i];
            
            if (debt.triggerCondition === eventType) {
                // Dette trouvée ! La retirer et la retourner
                const triggered = this.narrativeDebts.splice(i, 1)[0];
                console.log(`⚠️ Dette narrative déclenchée : ${triggered.description}`);
                return triggered;
            }
        }
        
        return null;
    }
    
    /**
     * NOUVEAU : Calcule le biais RNG basé sur la mémoire du dé
     * @returns {Object} Biais à appliquer aux jets
     */
    getRNGBias() {
        return {
            extremeTendency: this.diceMemory.extremeBias,      // 0-1, influence vers 1 ou 6
            hostilityBonus: this.diceMemory.hostilityLevel,    // 0-1, augmente difficulté events
            chaosLevel: this.corruption / 15                   // 0-1+, chaos général
        };
    }
    
    /**
     * Ajoute de la corruption
     * @param {number} baseValue - Valeur de base
     * @param {string} source - Source de corruption (pour historique)
     * @param {Object} metadata - Métadonnées additionnelles
     */
    addCorruption(baseValue, source, metadata = {}) {
        const classModifier = this.game?.player?.corruptionModifier || 1.0;
        const gain = this.calculateGain(baseValue, classModifier);
        
        // Appliquer le gain
        const oldCorruption = this.corruption;
        this.corruption = Math.min(100, this.corruption + gain);
        
        // Enregistrer dans l'historique
        this.history.push({
            timestamp: Date.now(),
            source: source,
            baseValue: baseValue,
            finalGain: gain,
            oldValue: oldCorruption,
            newValue: this.corruption,
            metadata: metadata
        });
        
        // Vérifier changement de seuil
        this.checkThresholdChange(oldCorruption, this.corruption);
        
        // Event pour les autres systèmes
        this.emitCorruptionChanged(oldCorruption, this.corruption, gain, source);
        
        console.log(`💀 Corruption: ${oldCorruption.toFixed(1)}% → ${this.corruption.toFixed(1)}% (+${gain.toFixed(1)}) [${source}]`);
        
        return gain;
    }
    
    /**
     * Réduit la corruption (rare !)
     * @param {number} amount - Montant à réduire
     * @param {string} source - Source de réduction
     */
    reduceCorruption(amount, source) {
        const oldCorruption = this.corruption;
        this.corruption = Math.max(0, this.corruption - amount);
        
        // Historique
        this.history.push({
            timestamp: Date.now(),
            source: source,
            baseValue: -amount,
            finalGain: -(oldCorruption - this.corruption),
            oldValue: oldCorruption,
            newValue: this.corruption,
            metadata: { type: 'reduction' }
        });
        
        // Vérifier changement de seuil
        this.checkThresholdChange(oldCorruption, this.corruption);
        
        // Event
        this.emitCorruptionChanged(oldCorruption, this.corruption, -(oldCorruption - this.corruption), source);
        
        console.log(`💚 Corruption réduite: ${oldCorruption.toFixed(1)}% → ${this.corruption.toFixed(1)}% (-${amount.toFixed(1)}) [${source}]`);
    }
    
    /**
     * Vérifie si on a changé de seuil
     */
    checkThresholdChange(oldValue, newValue) {
        const oldThreshold = this.getThresholdForValue(oldValue);
        const newThreshold = this.getThresholdForValue(newValue);
        
        if (oldThreshold.id !== newThreshold.id) {
            this.onThresholdChanged(oldThreshold, newThreshold);
        }
    }
    
    /**
     * Trouve le seuil correspondant à une valeur
     */
    getThresholdForValue(value) {
        return this.thresholds.find(t => 
            value >= t.range[0] && value <= t.range[1]
        ) || this.thresholds[0];
    }
    
    /**
     * Récupère le stage actuel de corruption
     */
    getCurrentStage() {
        return this.getThresholdForValue(this.corruption);
    }
    
    /**
     * Appelé quand on change de seuil
     */
    onThresholdChanged(oldThreshold, newThreshold) {
        this.currentThreshold = newThreshold.id;
        
        console.log(`🔥 SEUIL FRANCHI: ${oldThreshold.name} → ${newThreshold.name}`);
        console.log(`   Effets: Fairness ${(newThreshold.effects.worldFairness * 100).toFixed(0)}%, Hostilité +${(newThreshold.effects.eventHostility * 100).toFixed(0)}%`);
        
        // Event majeur
        this.emitThresholdChanged(oldThreshold, newThreshold);
        
        // Dialogues de Thalys
        this.triggerThresholdDialogue(newThreshold);
    }
    
    /**
     * Lance le dé manuellement (action en combat)
     */
    async forceDiceRoll() {
        const result = Math.floor(Math.random() * 6) + 1;
        console.log(`🎲 Lancer de dé volontaire : ${result}`);
        
        // Applique les effets selon le résultat
        this.addCorruption(result, `Dé (${result})`);
        
        // Mémoriser l'utilisation
        if (result === 6) {
            this.rememberAction('force_six');
        }
        
        return result;
    }
    
    /**
     * Déclenche un dialogue de Thalys selon le seuil
     */
    triggerThresholdDialogue(threshold) {
        const dialogues = {
            1: [
                "Oh ? Je sens... une petite **fissure**. Rien de grave. Juste ton humanité qui commence à fuir. Drip. Drip.",
                "Félicitations ! Tu viens de franchir le point de non-retour. Enfin... le PREMIER point de non-retour. Il y en a plusieurs."
            ],
            2: [
                "40% ! **Profanation** ! J'adore ce seuil. C'est là que les choses deviennent... intéressantes.",
                "Tu sens cette chaleur dans ta poitrine ? Ce n'est pas de l'amour. C'est ton âme qui brûle. Continue."
            ],
            3: [
                "60%... Tu es officiellement **damné**. Techniquement. Légalement. Cosmiquement.",
                "À ce stade, même les prêtres ne prieraient plus pour toi. Mais bon, les prêtres sont morts depuis 500 ans, donc..."
            ],
            4: [
                "80%... **Rupture imminente**. Tu n'es plus vraiment humain. Regarde tes mains. Elles tremblent, n'est-ce pas ?",
                "Encore 20% et tu seras... autre chose. Quelque chose de magnifique. Quelque chose de **libre**."
            ]
        };
        
        const options = dialogues[threshold.id];
        if (options && this.game?.dialogueSystem) {
            const randomDialogue = options[Math.floor(Math.random() * options.length)];
            this.game.dialogueSystem.queueDialogue('thalys', randomDialogue, 'threshold');
        }
    }
    
    /**
     * Émet un event de changement de corruption
     */
    emitCorruptionChanged(oldValue, newValue, gain, source) {
        const event = new CustomEvent('corruptionChanged', {
            detail: {
                oldValue: oldValue,
                newValue: newValue,
                gain: gain,
                source: source,
                threshold: this.getCurrentThreshold()
            }
        });
        window.dispatchEvent(event);
    }
    
    /**
     * Émet un event de changement de seuil
     */
    emitThresholdChanged(oldThreshold, newThreshold) {
        const event = new CustomEvent('thresholdChanged', {
            detail: {
                oldThreshold: oldThreshold,
                newThreshold: newThreshold,
                corruption: this.corruption
            }
        });
        window.dispatchEvent(event);
    }
    
    /**
     * Retourne le seuil actuel
     */
    getCurrentThreshold() {
        return this.thresholds[this.currentThreshold];
    }
    
    /**
     * Applique les effets du seuil actuel aux stats du joueur
     */
    applyThresholdEffects(playerStats) {
        const threshold = this.getCurrentThreshold();
        
        return {
            atk: playerStats.atk * (1 + threshold.effects.atk),
            def: playerStats.def * (1 + threshold.effects.def),
            healingMultiplier: 1 + threshold.effects.healingReceived,
            aggroMultiplier: 1 + threshold.effects.enemyAggro
        };
    }
    
    /**
     * Vérifie si une feature est débloquée
     */
    isFeatureUnlocked(featureName) {
        const threshold = this.getCurrentThreshold();
        return threshold.unlockedFeatures?.includes(featureName) || false;
    }
    
    /**
     * Retourne l'historique complet
     */
    getHistory() {
        return this.history;
    }
    
    /**
     * Statistiques de corruption
     */
    getStats() {
        const totalGains = this.history
            .filter(h => h.finalGain > 0)
            .reduce((sum, h) => sum + h.finalGain, 0);
        
        const totalReductions = this.history
            .filter(h => h.finalGain < 0)
            .reduce((sum, h) => sum + Math.abs(h.finalGain), 0);
        
        const sources = {};
        this.history.forEach(h => {
            sources[h.source] = (sources[h.source] || 0) + 1;
        });
        
        return {
            current: this.corruption,
            threshold: this.getCurrentThreshold(),
            totalGains: totalGains.toFixed(1),
            totalReductions: totalReductions.toFixed(1),
            sources: sources,
            historyLength: this.history.length
        };
    }
    
    /**
     * Reset (pour debug/tests)
     */
    reset() {
        this.corruption = 0;
        this.currentThreshold = 0;
        this.history = [];
        console.log('💀 Corruption réinitialisée');
    }
}
