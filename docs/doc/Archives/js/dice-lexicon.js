// 🎲 LEXIQUE DES DÉS - Système de règles modulables
// Ce fichier gère l'interprétation des lancers de dé selon les cartes actives

class DiceLexicon {
  constructor() {
    this.rules = new Map(); // ID de règle → Fonction de règle
    this.activeRules = new Set(); // IDs des règles actuellement actives
  }

  /**
   * Enregistrer une nouvelle règle dans le lexique
   * @param {string} ruleId - Identifiant unique de la règle
   * @param {Function} ruleFunction - Fonction (value, context) => { newValue, effects }
   */
  registerRule(ruleId, ruleFunction) {
    this.rules.set(ruleId, ruleFunction);
    console.log(`📚 Règle enregistrée: ${ruleId}`);
  }

  /**
   * Activer une règle (quand une carte est ajoutée au deck)
   * @param {string} ruleId - ID de la règle à activer
   */
  activateRule(ruleId) {
    if (this.rules.has(ruleId)) {
      this.activeRules.add(ruleId);
      console.log(`✅ Règle activée: ${ruleId}`);
      return true;
    }
    console.warn(`⚠️ Règle inconnue: ${ruleId}`);
    return false;
  }

  /**
   * Désactiver une règle (quand une carte est retirée du deck)
   * @param {string} ruleId - ID de la règle à désactiver
   */
  deactivateRule(ruleId) {
    this.activeRules.delete(ruleId);
    console.log(`❌ Règle désactivée: ${ruleId}`);
  }

  /**
   * 🎯 PIPELINE PRINCIPAL : Interpréter un lancer de dé
   * @param {number} rawValue - Valeur brute du dé (1-10)
   * @param {string} context - Contexte du lancer ('movement', 'combat', 'event')
   * @param {Object} extraData - Données supplémentaires (joueur, ennemi, etc.)
   * @returns {Object} { finalValue, effects, logs }
   */
  interpretRoll(rawValue, context = 'movement', extraData = {}) {
    let currentValue = rawValue;
    const effects = [];
    const logs = [];

    // Log initial
    logs.push(`🎲 Jet brut: ${rawValue} (contexte: ${context})`);

    // Appliquer toutes les règles actives dans l'ordre d'activation
    for (let ruleId of this.activeRules) {
      const rule = this.rules.get(ruleId);
      
      if (rule) {
        const before = currentValue;
        const result = rule(currentValue, context, extraData);
        
        currentValue = result.newValue;
        
        // Collecter les effets additionnels
        if (result.effects) {
          effects.push(...result.effects);
        }
        
        // Log si la valeur a changé
        if (before !== currentValue) {
          logs.push(`  ↳ ${ruleId}: ${before} → ${currentValue}`);
        }
        
        // Log des effets spéciaux
        if (result.log) {
          logs.push(`  ↳ ${result.log}`);
        }
      }
    }

    logs.push(`✨ Résultat final: ${currentValue}`);

    return {
      finalValue: currentValue,
      effects: effects,
      logs: logs,
      rawValue: rawValue
    };
  }

  /**
   * Obtenir toutes les règles actives
   * @returns {Array} Liste des IDs de règles actives
   */
  getActiveRules() {
    return Array.from(this.activeRules);
  }

  /**
   * Réinitialiser toutes les règles
   */
  reset() {
    this.activeRules.clear();
    console.log('🔄 Lexique réinitialisé');
  }

  /**
   * Debug: Afficher l'état du lexique
   */
  debugState() {
    console.log('📚 État du Lexique des Dés:');
    console.log(`  Règles totales: ${this.rules.size}`);
    console.log(`  Règles actives: ${this.activeRules.size}`);
    console.log(`  IDs actifs:`, Array.from(this.activeRules));
  }
}

// Instance globale du lexique
const DICE_LEXICON = new DiceLexicon();

console.log('📚 Lexique des Dés chargé');