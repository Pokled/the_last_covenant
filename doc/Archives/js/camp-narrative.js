/**
 * CAMP NARRATIVE SYSTEM
 * Gère les dialogues NPCs, ambiance évolutive, et interventions du Dé
 */

class CampNarrativeSystem {
  constructor() {
    this.narratives = null;
    this.currentLanguage = 'fr';
    this.lastDiceComment = null;
  }

  /**
   * Charger les narratives depuis JSON
   */
  async loadNarratives() {
    try {
      const response = await fetch('data/narrative-camp.json');
      if (!response.ok) throw new Error('Failed to load narrative-camp.json');
      this.narratives = await response.json();
      console.log('✅ Narratives chargées:', this.narratives);
      return this.narratives;
    } catch (error) {
      console.error('❌ Erreur chargement narratives:', error);
      // Fallback : narratives minimales
      this.narratives = this.getFallbackNarratives();
      return this.narratives;
    }
  }

  /**
   * Narratives de secours si JSON non chargé
   */
  getFallbackNarratives() {
    return {
      zones: {
        hub: {
          fr: {
            name: "Le Cortège des Ombres",
            description: "Douze chariots. Quinze tentes. Des feux qui puent l'os brûlé."
          }
        }
      },
      dice: {
        greetings: {
          fr: {
            "0-25": ["Bienvenue, Pactisé. Encore vivant ?"]
          }
        }
      }
    };
  }

  /**
   * Obtenir la tranche de corruption du joueur
   */
  getCorruptionRange(corruption) {
    if (corruption < 25) return "0-25";
    if (corruption < 50) return "25-50";
    if (corruption < 75) return "50-75";
    return "75-100";
  }

  /**
   * Obtenir un dialogue aléatoire du Dé
   */
  getDiceGreeting(corruption) {
    if (!this.narratives || !this.narratives.dice) return null;

    const range = this.getCorruptionRange(corruption);
    const greetings = this.narratives.dice.greetings[this.currentLanguage]?.[range];

    if (!greetings || greetings.length === 0) return null;

    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    this.lastDiceComment = greeting;
    return greeting;
  }

  /**
   * Obtenir commentaire du Dé (mockery ou philosophy)
   */
  getDiceComment(type = 'mockery') {
    if (!this.narratives || !this.narratives.dice) return null;

    const comments = this.narratives.dice[type]?.[this.currentLanguage];
    if (!comments || comments.length === 0) return null;

    return comments[Math.floor(Math.random() * comments.length)];
  }

  /**
   * Obtenir description de zone selon corruption
   */
  getZoneDescription(zoneId, corruption) {
    if (!this.narratives || !this.narratives.zones) return null;

    const zone = this.narratives.zones[zoneId]?.[this.currentLanguage];
    if (!zone) return null;

    // Description variant par corruption si disponible
    if (zone.corruptionVariants) {
      const range = this.getCorruptionRange(corruption);
      return zone.corruptionVariants[range] || zone.description;
    }

    return zone.description;
  }

  /**
   * Obtenir dialogue NPC
   */
  getNPCDialogue(npcId, corruption, dialogueType = 'greeting') {
    if (!this.narratives || !this.narratives.npcs) return null;

    const npc = this.narratives.npcs[npcId]?.[this.currentLanguage];
    if (!npc) return null;

    // Si dialogue simple (greeting)
    if (npc[dialogueType] && typeof npc[dialogueType] === 'string') {
      return npc[dialogueType];
    }

    // Si dialogue variant par corruption
    if (npc.corruption) {
      const range = this.getCorruptionRange(corruption);
      let corruptionKey = range.replace('-', '_').toLowerCase();

      // Mapping des ranges vers les clés du JSON
      const keyMap = {
        '0_25': 'low',
        '25_50': 'medium',
        '50_75': 'high',
        '75_100': 'extreme'
      };

      const mappedKey = keyMap[corruptionKey];
      return npc.corruption[mappedKey] || npc[dialogueType];
    }

    return npc[dialogueType];
  }

  /**
   * Afficher modale narrative (dialogue NPC)
   */
  showNarrativeModal(config) {
    const {
      title = "???",
      icon = "💬",
      speaker = null,
      dialogue = "...",
      description = null,
      choices = null,
      onClose = null
    } = config;

    // Créer overlay
    const overlay = document.createElement('div');
    overlay.className = 'narrative-modal-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      backdrop-filter: blur(8px);
      z-index: 10000;
      display: flex;
      justify-content: center;
      align-items: center;
      animation: fadeIn 0.5s ease;
    `;

    // Créer modale
    const modal = document.createElement('div');
    modal.className = 'narrative-modal';
    modal.style.cssText = `
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
      border: 3px solid #d4af37;
      border-radius: 15px;
      padding: 40px;
      max-width: 700px;
      width: 90%;
      box-shadow: 0 0 60px rgba(212, 175, 55, 0.5), inset 0 0 100px rgba(0, 0, 0, 0.6);
      animation: scaleIn 0.5s ease;
      position: relative;
    `;

    // Header
    let headerHTML = `
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid rgba(212, 175, 55, 0.3); padding-bottom: 20px;">
        <div style="font-size: 4rem; margin-bottom: 10px;">${icon}</div>
        <h2 style="font-family: 'Cinzel', serif; color: #d4af37; font-size: 2rem; text-shadow: 0 0 20px rgba(212, 175, 55, 0.8); margin: 0;">
          ${title}
        </h2>
    `;

    if (speaker) {
      headerHTML += `
        <p style="color: #b8860b; font-style: italic; margin-top: 10px; font-size: 1.1rem;">
          ${speaker}
        </p>
      `;
    }

    headerHTML += `</div>`;

    // Dialogue
    let contentHTML = `
      <div style="background: rgba(0, 0, 0, 0.4); padding: 25px; border-radius: 10px; border-left: 4px solid #d4af37; margin-bottom: 20px;">
        <p style="font-family: 'Crimson Text', serif; font-size: 1.3rem; line-height: 1.8; color: #e0e0e0; font-style: italic; margin: 0;">
          "${dialogue}"
        </p>
      </div>
    `;

    // Description additionnelle
    if (description) {
      contentHTML += `
        <div style="background: rgba(139, 0, 0, 0.2); padding: 20px; border-radius: 8px; border-left: 3px solid #8b0000; margin-bottom: 20px;">
          <p style="font-size: 1.1rem; color: #b8b8b8; line-height: 1.6; margin: 0;">
            ${description}
          </p>
        </div>
      `;
    }

    // Choices
    let choicesHTML = '';
    if (choices && choices.length > 0) {
      choicesHTML = `<div style="display: flex; gap: 15px; justify-content: center; margin-top: 30px;">`;
      choices.forEach((choice, index) => {
        choicesHTML += `
          <button
            class="narrative-choice-btn"
            data-choice-index="${index}"
            style="
              font-family: 'Cinzel', serif;
              font-size: 1.1rem;
              padding: 15px 30px;
              background: linear-gradient(135deg, rgba(42, 42, 42, 0.9), rgba(26, 26, 26, 0.9));
              border: 2px solid #d4af37;
              border-radius: 8px;
              color: #d4af37;
              cursor: pointer;
              transition: all 0.3s ease;
              box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
              text-transform: uppercase;
              letter-spacing: 1px;
              flex: 1;
              max-width: 200px;
            "
            onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 5px 30px rgba(212, 175, 55, 0.6)';"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 0 20px rgba(212, 175, 55, 0.3)';"
          >
            ${choice.label}
          </button>
        `;
      });
      choicesHTML += `</div>`;
    } else {
      // Bouton continuer par défaut
      choicesHTML = `
        <div style="text-align: center; margin-top: 30px;">
          <button
            class="narrative-continue-btn"
            style="
              font-family: 'Cinzel', serif;
              font-size: 1.2rem;
              padding: 15px 50px;
              background: linear-gradient(135deg, rgba(42, 42, 42, 0.9), rgba(26, 26, 26, 0.9));
              border: 2px solid #d4af37;
              border-radius: 8px;
              color: #d4af37;
              cursor: pointer;
              transition: all 0.3s ease;
              box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
              text-transform: uppercase;
              letter-spacing: 2px;
            "
            onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 5px 30px rgba(212, 175, 55, 0.6)';"
            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 0 20px rgba(212, 175, 55, 0.3)';"
          >
            Continuer
          </button>
        </div>
      `;
    }

    modal.innerHTML = headerHTML + contentHTML + choicesHTML;

    // Event listeners
    if (choices && choices.length > 0) {
      setTimeout(() => {
        modal.querySelectorAll('.narrative-choice-btn').forEach((btn, index) => {
          btn.onclick = () => {
            overlay.remove();
            if (choices[index].callback) choices[index].callback();
          };
        });
      }, 100);
    } else {
      setTimeout(() => {
        const continueBtn = modal.querySelector('.narrative-continue-btn');
        if (continueBtn) {
          continueBtn.onclick = () => {
            overlay.remove();
            if (onClose) onClose();
          };
        }
      }, 100);
    }

    // Animations CSS
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes scaleIn {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    return overlay;
  }

  /**
   * Afficher dialogue du Dé (greeting au camp)
   */
  showDiceGreeting(corruption, onClose) {
    const greeting = this.getDiceGreeting(corruption);
    if (!greeting) return;

    this.showNarrativeModal({
      title: "Le Dé du Destin",
      icon: "🎲",
      speaker: "Thalys, Huitième Dieu",
      dialogue: greeting,
      onClose
    });
  }

  /**
   * Afficher dialogue NPC zone
   */
  showZoneNarrativeIntro(zoneId, npcId, corruption, onContinue) {
    const zone = this.narratives?.zones?.[zoneId]?.[this.currentLanguage];
    const npc = this.narratives?.npcs?.[npcId]?.[this.currentLanguage];

    if (!zone && !npc) {
      if (onContinue) onContinue();
      return;
    }

    const title = zone?.name || "Zone";
    const icon = this.getZoneIcon(zoneId);
    const description = this.getZoneDescription(zoneId, corruption);
    const dialogue = this.getNPCDialogue(npcId, corruption, 'greeting');
    const speaker = npc?.title || npc?.name || "";

    this.showNarrativeModal({
      title,
      icon,
      speaker,
      dialogue: dialogue || description || "...",
      description: dialogue ? description : null,
      onClose: onContinue
    });
  }

  /**
   * Obtenir icône de zone
   */
  getZoneIcon(zoneId) {
    const icons = {
      hub: '🏕️',
      forge: '⚒️',
      altar: '🕯️',
      market: '🛒',
      recruitment: '👥',
      library: '📖'
    };
    return icons[zoneId] || '❓';
  }
}

// Export global
window.CampNarrativeSystem = CampNarrativeSystem;
