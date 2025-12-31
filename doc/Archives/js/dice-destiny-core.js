/**
 * DICE OF DESTINY - CORE SYSTEM
 * THE LAST COVENANT
 *
 * Système complet du Dé du Destin
 * - 5 Stades d'évolution (Ivoire → Symbiose)
 * - Système de corruption (0-100%)
 * - Modifiers et mécaniques
 * - Intégration audio + visuel + dialogue
 */

class DiceOfDestiny {
  constructor() {
    // ═══════════════════════════════════════════════════════
    // ÉTAT DU DÉ
    // ═══════════════════════════════════════════════════════
    this.stage = 1;                // Stade actuel (1-5)
    this.corruption = 0;           // Corruption du joueur (0-100%)
    this.eyeCount = 0;             // Nombre d'yeux ouverts
    this.isAlive = false;          // true à partir Stade 3
    this.isFused = false;          // true au Stade 5

    // ═══════════════════════════════════════════════════════
    // MÉCANIQUES DÉBLOQUABLES
    // ═══════════════════════════════════════════════════════
    this.modifiers = [];           // Liste des modifiers actifs
    this.rerollsLeft = 0;          // Rerolls gratuits restants
    this.canPredict = false;       // Prédiction (Stade 3+)
    this.canManipulate = false;    // Manipulation directe (Stade 4+)
    this.hasBetrayed = false;      // Le Dé a-t-il déjà trahi ?

    // ═══════════════════════════════════════════════════════
    // COÛTS D'UPGRADE PAR STADE
    // ═══════════════════════════════════════════════════════
    this.upgradeCosts = {
      2: { gold: 500, corruption: 20, runs: 10 },
      3: { gold: 2000, corruption: 40, runs: 30 },
      4: { gold: 10000, corruption: 70, runs: 75 },
      5: { gold: 50000, corruption: 95, runs: 150 }
    };

    // ═══════════════════════════════════════════════════════
    // SYSTÈMES CONNECTÉS
    // ═══════════════════════════════════════════════════════
    this.visualSystem = null;      // Initialisé après
    this.audioSystem = null;       // Initialisé après
    this.dialogueSystem = null;    // Initialisé après

    // ═══════════════════════════════════════════════════════
    // INITIALISATION
    // ═══════════════════════════════════════════════════════
    this.init();
  }

  /**
   * Initialisation du système
   */
  init() {
    console.log('🎲 Initialisation du Dé du Destin...');
    this.createOverlay();
    console.log('✅ Dé du Destin initialisé - Stade', this.stage);
  }

  /**
   * Crée l'overlay HTML pour les animations
   */
  createOverlay() {
    // Vérifier si overlay existe déjà
    if (document.getElementById('dice-overlay')) {
      console.log('🎲 Overlay déjà existant');
      return;
    }

    const overlay = document.createElement('div');
    overlay.id = 'dice-overlay';
    overlay.className = 'dice-overlay-container';
    overlay.innerHTML = `
      <div class="dice-display">
        <!-- 🎲 VRAI CUBE 3D AVEC 6 FACES (comme combat) -->
        <div class="dice-3d-container" id="dice-container">
          <div class="dice-3d" id="dice-entity">
            <div class="dice-face front">?</div>
            <div class="dice-face back">?</div>
            <div class="dice-face right">?</div>
            <div class="dice-face left">?</div>
            <div class="dice-face top">?</div>
            <div class="dice-face bottom">?</div>
          </div>
          <div class="dice-impact-flash"></div>
        </div>
      </div>
      <div id="result-number"></div>
    `;

    document.body.appendChild(overlay);
    console.log('✅ Overlay Dé créé avec VRAI CUBE 3D');
  }

  // ═══════════════════════════════════════════════════════
  // MÉTHODE PRINCIPALE : LANCER LE DÉ
  // ═══════════════════════════════════════════════════════

  /**
   * Lance le Dé du Destin
   * @returns {Promise<number>} Résultat du lancer (1-6 ou 1-100 si Stade 5)
   */
  async roll() {
    console.log('🎲 Lancement du Dé - Stade', this.stage, '- Corruption', this.corruption + '%');

    // 1. Prédiction (si Stade 3+)
    if (this.canPredict && Math.random() < 0.5) {
      const predictions = this.predict();
      this.whisper(`Ce sera un ${predictions[0]}... ou un ${predictions[1]}.`);
      await this.sleep(2000);
    }

    // 2. Lancer de base (1-6 ou 1-100 si Stade 5)
    let baseRoll = this.isFused
      ? Math.floor(Math.random() * 100) + 1
      : Math.floor(Math.random() * 6) + 1;

    console.log('🎲 Roll de base:', baseRoll);

    // 3. Appliquer modifiers
    const modifiedRoll = this.applyModifiers(baseRoll);
    console.log('🎲 Roll après modifiers:', modifiedRoll);

    // 4. Trahison possible (Stade 5, corruption 100%)
    let finalRoll = modifiedRoll;
    if (this.isFused && this.corruption >= 100 && Math.random() < 0.2) {
      finalRoll = this.betrayResult(modifiedRoll);
      this.hasBetrayed = true;
      console.warn('⚠️ LE DÉ A TRAHI!', finalRoll);
    }

    // 5. ANIMATION COMPLÈTE
    // Lancer les deux animations en parallèle
    const animationPromises = [
      this.playRollAnimation(finalRoll)
    ];

    // Ajouter particules si système visuel disponible
    if (this.visualSystem) {
      animationPromises.push(
        this.visualSystem.playFullAnimation(finalRoll)
      );
    }

    await Promise.all(animationPromises);

    // 6. Dialogue réactif
    this.reactToResult(finalRoll);

    console.log('✅ Résultat final du Dé:', finalRoll);
    return finalRoll;
  }

  /**
   * Animation du lancer avec VRAI CUBE 3D
   */
  async playRollAnimation(result) {
    const overlay = document.getElementById('dice-overlay');
    const diceEl = document.getElementById('dice-entity');
    const diceContainer = document.getElementById('dice-container');
    const resultEl = document.getElementById('result-number');

    console.log('🎨 Animation CUBE 3D pour résultat:', result);

    // Afficher overlay avec fond TRANSPARENT (pour voir les particules)
    overlay.classList.add('active');
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)'; // Fond très léger

    // Phase 1 : SPIN du VRAI CUBE (1.5s) - Utilise l'animation CSS
    diceEl.classList.add('rolling');
    await this.sleep(1500);

    // Retirer classe rolling
    diceEl.classList.remove('rolling');

    // Phase 2 : IMPACT (0.3s)
    diceEl.classList.add('impact');
    diceContainer.classList.add('shake');

    // Flash d'impact
    const flash = diceContainer.querySelector('.dice-impact-flash');
    if (flash) {
      flash.classList.add('active');
      setTimeout(() => flash.classList.remove('active'), 500);
    }

    await this.sleep(300);
    diceEl.classList.remove('impact');
    diceContainer.classList.remove('shake');

    // Phase 2 : Résultat SPECTACULAIRE
    resultEl.textContent = result;
    resultEl.style.display = 'block';
    resultEl.style.fontFamily = "'Press Start 2P', monospace";
    resultEl.style.fontSize = '250px';
    resultEl.style.fontWeight = 'bold';

    // Couleur SPECTACULAIRE selon résultat avec GLOW massif
    if (result === 6) {
      resultEl.style.color = '#FFD700'; // Or
      resultEl.style.textShadow = `
        0 0 20px #FFD700,
        0 0 40px #FFD700,
        0 0 60px #FFA500,
        0 0 80px #FF8C00,
        4px 4px 0 #000,
        -4px -4px 0 #000,
        4px -4px 0 #000,
        -4px 4px 0 #000
      `;
      this.playSound('carillon');
      this.whisper("YESSS ! Le destin t'a souri !");
    } else if (result === 1) {
      resultEl.style.color = '#DC143C'; // Rouge
      resultEl.style.textShadow = `
        0 0 20px #DC143C,
        0 0 40px #DC143C,
        0 0 60px #FF0000,
        0 0 80px #8B0000,
        4px 4px 0 #000,
        -4px -4px 0 #000,
        4px -4px 0 #000,
        -4px 4px 0 #000
      `;
      this.playSound('scream');
      this.whisper("Échec... Pathétique.");
    } else {
      resultEl.style.color = '#9370DB'; // Violet
      resultEl.style.textShadow = `
        0 0 20px #9370DB,
        0 0 40px #9370DB,
        0 0 60px #BA55D3,
        4px 4px 0 #000,
        -4px -4px 0 #000,
        4px -4px 0 #000,
        -4px 4px 0 #000
      `;
      this.playSound('bell');
    }

    resultEl.classList.add('visible');

    await this.sleep(1500);

    // Cacher overlay
    resultEl.classList.remove('visible');
    resultEl.style.display = 'none';
    await this.sleep(300);
    overlay.classList.remove('active');
  }

  // ═══════════════════════════════════════════════════════
  // SYSTÈME DE STADES
  // ═══════════════════════════════════════════════════════

  /**
   * Upgrade vers un stade supérieur
   * @param {Object} player - Objet joueur avec gold, corruption, runsCompleted
   * @param {number} targetStage - Stade cible (2-5)
   * @returns {boolean} Succès de l'upgrade
   */
  async upgrade(player, targetStage) {
    if (targetStage <= this.stage || targetStage > 5) {
      console.warn('⚠️ Upgrade impossible - Stade invalide');
      return false;
    }

    const cost = this.upgradeCosts[targetStage];

    // Vérifications
    if (player.gold < cost.gold) {
      this.whisper("Pas assez d'or, Pactisé.");
      return false;
    }
    if (player.corruption < cost.corruption) {
      this.whisper("Tu n'es pas assez corrompu. Pas encore.");
      return false;
    }
    if (player.runsCompleted < cost.runs) {
      this.whisper("Tu n'as pas assez d'expérience.");
      return false;
    }

    // Consommer ressources
    player.gold -= cost.gold;
    player.corruption = Math.max(player.corruption, cost.corruption);

    // Animation de transformation (optionnelle, pour l'instant juste un log)
    console.log(`✨ TRANSFORMATION VERS STADE ${targetStage}...`);
    this.whisper(this.getUpgradeDialogue(targetStage));
    await this.sleep(3000);

    // Upgrade effectif
    this.stage = targetStage;
    this.unlockMechanics(targetStage);

    // Mettre à jour visuel
    this.updateStageVisuals();

    console.log(`✅ Dé upgradé vers Stade ${targetStage}!`);
    return true;
  }

  /**
   * Débloque les mécaniques selon le stade
   */
  unlockMechanics(stage) {
    switch(stage) {
      case 2:
        this.eyeCount = 1;
        this.rerollsLeft = 1;
        console.log('🔓 Débloqué: 1 œil, 1 reroll');
        break;

      case 3:
        this.eyeCount = 3;
        this.isAlive = true;
        this.canPredict = true;
        this.rerollsLeft = 3;
        console.log('🔓 Débloqué: 3 yeux, prédiction, 3 rerolls');
        break;

      case 4:
        this.eyeCount = 6;
        this.canManipulate = true;
        console.log('🔓 Débloqué: 6 yeux, manipulation directe');
        break;

      case 5:
        this.isFused = true;
        console.log('🔓 Débloqué: SYMBIOSE TOTALE');
        break;
    }

    // Ouvrir les yeux visuellement
    this.openEyes();
  }

  /**
   * Met à jour l'apparence visuelle selon le stade
   */
  updateStageVisuals() {
    const diceEl = document.getElementById('dice-entity');
    if (!diceEl) return;

    // Retirer toutes les classes de stade
    for (let i = 1; i <= 5; i++) {
      diceEl.classList.remove(`stage-${i}`);
    }

    // Ajouter la classe du stade actuel
    diceEl.classList.add(`stage-${this.stage}`);
  }

  /**
   * Ouvre les yeux selon eyeCount
   */
  openEyes() {
    for (let i = 0; i < this.eyeCount && i < 6; i++) {
      const eyeEl = document.getElementById(`dice-eye-${i}`);
      if (eyeEl) {
        eyeEl.classList.add('open');
      }
    }
  }

  // ═══════════════════════════════════════════════════════
  // MÉCANIQUES AVANCÉES
  // ═══════════════════════════════════════════════════════

  /**
   * Prédiction : Révèle 2 résultats possibles
   * @returns {Array<number>} Deux résultats possibles
   */
  predict() {
    if (!this.canPredict) return null;

    const roll1 = Math.floor(Math.random() * 6) + 1;
    let roll2 = Math.floor(Math.random() * 6) + 1;

    // S'assurer que roll2 est différent de roll1
    while (roll2 === roll1) {
      roll2 = Math.floor(Math.random() * 6) + 1;
    }

    return [roll1, roll2];
  }

  /**
   * Reroll : Relance le dé (coût en corruption)
   * @param {Object} player - Objet joueur
   * @returns {Promise<number>} Nouveau résultat
   */
  async reroll(player) {
    if (this.rerollsLeft <= 0) {
      this.whisper("Plus de rerolls disponibles.");
      return null;
    }

    // Coût en corruption
    const corruptionCost = this.stage >= 3 ? 10 : 15;
    player.corruption += corruptionCost;

    this.rerollsLeft--;
    this.whisper("Encore un lancer... Juste pour toi.");

    console.log(`🔄 Reroll (${this.rerollsLeft} restants) - Corruption +${corruptionCost}%`);
    return await this.roll();
  }

  /**
   * Manipulation directe : Force le résultat (Stade 4+)
   * @param {number} desiredResult - Résultat voulu (1-6)
   * @param {Object} player - Objet joueur
   * @returns {number} Résultat forcé
   */
  forceResult(desiredResult, player) {
    if (!this.canManipulate) {
      this.whisper("Je ne suis pas assez puissant pour ça.");
      return null;
    }

    // Coût : 25% corruption
    player.corruption += 25;

    this.whisper("Tu oses me commander ? ...Bien. Cette fois.");
    console.log(`⚡ Manipulation directe: ${desiredResult} - Corruption +25%`);

    return desiredResult;
  }

  /**
   * Applique les modifiers au résultat
   * @param {number} baseRoll - Roll de base
   * @returns {number} Roll modifié
   */
  applyModifiers(baseRoll) {
    let finalRoll = baseRoll;

    for (const mod of this.modifiers) {
      finalRoll = mod.apply(finalRoll);
    }

    // Clamp entre 1-6 (ou 1-100 si Stade 5)
    const max = this.isFused ? 100 : 6;
    finalRoll = Math.max(1, Math.min(max, finalRoll));

    return finalRoll;
  }

  /**
   * Trahison : Inverse le résultat (Stade 5, corruption 100%)
   * @param {number} result - Résultat original
   * @returns {number} Résultat inversé
   */
  betrayResult(result) {
    const inverted = this.isFused ? 101 - result : 7 - result;
    this.whisper("Je t'ai trahi. Désolé... Pas désolé.", true);
    return inverted;
  }

  // ═══════════════════════════════════════════════════════
  // DIALOGUES ET RÉACTIONS
  // ═══════════════════════════════════════════════════════

  /**
   * Affiche un murmure du Dé
   * @param {string} message - Message à afficher
   * @param {boolean} isBetrayal - Si c'est une trahison
   */
  whisper(message, isBetrayal = false) {
    const whisperEl = document.createElement('div');
    whisperEl.className = 'dice-whisper';
    if (isBetrayal) whisperEl.classList.add('betrayal');
    whisperEl.textContent = `"${message}"`;
    document.body.appendChild(whisperEl);

    setTimeout(() => whisperEl.classList.add('visible'), 50);

    setTimeout(() => {
      whisperEl.classList.remove('visible');
      setTimeout(() => whisperEl.remove(), 500);
    }, 3000);

    console.log(`💬 Dé murmure: "${message}"`);
  }

  /**
   * Réagit au résultat du lancer
   * @param {number} result - Résultat du lancer
   */
  reactToResult(result) {
    const dialogues = this.getDialoguesForStage();

    if (result === 6) {
      this.whisper(dialogues.on6[Math.floor(Math.random() * dialogues.on6.length)]);
    } else if (result === 1) {
      this.whisper(dialogues.on1[Math.floor(Math.random() * dialogues.on1.length)]);
    } else if (Math.random() < 0.3) {
      this.whisper(dialogues.neutral[Math.floor(Math.random() * dialogues.neutral.length)]);
    }
  }

  /**
   * Retourne les dialogues selon le stade
   */
  getDialoguesForStage() {
    const dialoguesByStage = {
      1: {
        on6: ["Hmm. Chance. Rien de plus."],
        on1: ["Même moi, je ne peux pas t'aider si tu es si faible."],
        neutral: ["Pathétique."]
      },
      2: {
        on6: ["Ah ! Maintenant on parle ! Tu vois ce que je peux faire pour toi ?"],
        on1: ["Décevant. Tu veux relancer ? Ça va te coûter..."],
        neutral: ["Pas mal. Mais tu peux faire MIEUX."]
      },
      3: {
        on6: ["YESSS ! ENCORE ! On est INVINCIBLES ensemble !"],
        on1: ["NON ! Pas maintenant ! Relance ! RELANCE !"],
        neutral: ["Tu COMPRENDS enfin !"]
      },
      4: {
        on6: ["Nous sommes parfaits ensemble. Tu le sais, n'est-ce pas ?"],
        on1: ["Hmm. Pas optimal. Veux-tu que je... corrige ça ?"],
        neutral: ["Je vois le futur. Fais-moi confiance."]
      },
      5: {
        on6: ["Nous sommes le Destin."],
        on1: ["Nous ne pouvons pas perdre. Nous SOMMES le hasard."],
        neutral: ["Ce monde est nôtre."]
      }
    };

    return dialoguesByStage[this.stage] || dialoguesByStage[1];
  }

  /**
   * Dialogue d'upgrade de stade
   */
  getUpgradeDialogue(stage) {
    const dialogues = {
      2: "Je... je SENS quelque chose. Je m'éveille.",
      3: "JE VIS ! Tu me SENS, n'est-ce pas ?",
      4: "Je suis DIEU maintenant. Et toi... mon prophète.",
      5: "C'est l'heure. Fusionne avec moi. Deviens... ÉTERNEL."
    };
    return dialogues[stage] || "...";
  }

  // ═══════════════════════════════════════════════════════
  // AUDIO (Stub - à compléter avec dice-audio-system.js)
  // ═══════════════════════════════════════════════════════

  /**
   * Joue un son (stub)
   * @param {string} soundName - Nom du son
   */
  playSound(soundName) {
    // TODO: Implémenter avec dice-audio-system.js
    console.log(`🔊 Son joué: ${soundName}`);
  }

  // ═══════════════════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════════════════

  /**
   * Sleep / Delay
   * @param {number} ms - Millisecondes
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Getter de corruption
   */
  getCorruption() {
    return this.corruption;
  }

  /**
   * Setter de corruption
   */
  setCorruption(value) {
    this.corruption = Math.max(0, Math.min(100, value));
  }

  /**
   * Info du Dé
   */
  getInfo() {
    return {
      stage: this.stage,
      corruption: this.corruption,
      eyeCount: this.eyeCount,
      isAlive: this.isAlive,
      isFused: this.isFused,
      rerollsLeft: this.rerollsLeft,
      canPredict: this.canPredict,
      canManipulate: this.canManipulate,
      modifiers: this.modifiers.length
    };
  }
}

// ═══════════════════════════════════════════════════════
// CLASSE MODIFIER
// ═══════════════════════════════════════════════════════

class DiceModifier {
  constructor(type, power = 1) {
    this.type = type;       // 'PLUS_ONE', 'TWIN_DICE', 'REROLL_ONES', etc.
    this.power = power;     // Puissance du modifier
    this.name = this.getName();
    this.desc = this.getDescription();
  }

  /**
   * Applique le modifier au résultat
   * @param {number} baseRoll - Roll de base
   * @returns {number} Roll modifié
   */
  apply(baseRoll) {
    switch(this.type) {
      case 'PLUS_ONE':
        return baseRoll + this.power;

      case 'MINUS_ONE':
        return baseRoll - this.power;

      case 'REROLL_ONES':
        if (baseRoll === 1) {
          return Math.floor(Math.random() * 6) + 1;
        }
        return baseRoll;

      case 'TWIN_DICE':
        // Lance 2 dés, prend le meilleur (simulé)
        const roll2 = Math.floor(Math.random() * 6) + 1;
        return Math.max(baseRoll, roll2);

      case 'MULTIPLY':
        return baseRoll * this.power;

      default:
        return baseRoll;
    }
  }

  getName() {
    const names = {
      'PLUS_ONE': 'Face Ensorcelée',
      'MINUS_ONE': 'Malédiction',
      'REROLL_ONES': 'Bénédiction',
      'TWIN_DICE': 'Dé Jumeau',
      'MULTIPLY': 'Multiplicateur'
    };
    return names[this.type] || 'Modifier Inconnu';
  }

  getDescription() {
    const descs = {
      'PLUS_ONE': `+${this.power} au résultat`,
      'MINUS_ONE': `-${this.power} au résultat`,
      'REROLL_ONES': 'Relance automatique si 1',
      'TWIN_DICE': 'Lance 2 dés, garde le meilleur',
      'MULTIPLY': `×${this.power} au résultat`
    };
    return descs[this.type] || 'Effet inconnu';
  }
}

// ═══════════════════════════════════════════════════════
// EXPORT GLOBAL
// ═══════════════════════════════════════════════════════

window.DiceOfDestiny = DiceOfDestiny;
window.DiceModifier = DiceModifier;

// Auto-init global instance
if (typeof window !== 'undefined') {
  window.DiceSystem = new DiceOfDestiny();
  console.log('🎲 DiceSystem global initialisé!');
  
  // Initialiser le système visuel si disponible
  if (typeof DiceVisualSystem !== 'undefined') {
    window.DiceSystem.visualSystem = new DiceVisualSystem(window.DiceSystem);
    console.log('✨ Visual System connecté au DiceSystem');
  }
}
