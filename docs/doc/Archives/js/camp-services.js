/**
 * CAMP SERVICES SYSTEM - AAA+ Edition
 * Services fonctionnels avec animations, particules, et narratif intégré
 */

class CampServicesSystem {
  constructor() {
    this.playerData = null;
    this.narrativeSystem = null;
  }

  /**
   * Initialiser avec données joueur et narrative
   */
  init(playerData, narrativeSystem) {
    this.playerData = playerData;
    this.narrativeSystem = narrativeSystem;
  }

  /**
   * Sauvegarder données joueur
   */
  savePlayerData() {
    localStorage.setItem('tlc_player', JSON.stringify(this.playerData));
  }

  /**
   * Mettre à jour UI principale
   */
  updateMainUI() {
    // Trigger update sur camp.html
    if (window.updatePlayerUI) window.updatePlayerUI();
  }

  /**
   * Créer particules (helper)
   */
  createParticles(container, count, color, duration = 2000) {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 6 + 2}px;
        height: ${Math.random() * 6 + 2}px;
        background: ${color};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        pointer-events: none;
        opacity: ${Math.random() * 0.7 + 0.3};
        animation: particleFloat ${duration}ms ease-out forwards;
      `;
      container.appendChild(particle);

      setTimeout(() => particle.remove(), duration);
    }
  }

  /**
   * Screen shake effect
   */
  screenShake(intensity = 10, duration = 500) {
    const body = document.body;
    const originalTransform = body.style.transform;

    let startTime = Date.now();
    const shake = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) {
        body.style.transform = originalTransform;
        return;
      }

      const x = (Math.random() - 0.5) * intensity;
      const y = (Math.random() - 0.5) * intensity;
      body.style.transform = `translate(${x}px, ${y}px)`;
      requestAnimationFrame(shake);
    };

    shake();
  }

  /**
   * PURIFICATION - Réduire corruption avec animation lys
   */
  async purifyCorruption() {
    const corruption = this.playerData.corruption || 0;
    const gold = this.playerData.gold || 0;
    const cost = 100;

    // Vérifications
    if (corruption < 10) {
      if (window.AudioSystem) window.AudioSystem.playError();
      this.showErrorModal('❌ Purification Impossible', 'Ta corruption est déjà trop faible (minimum 10% requis).');
      return;
    }

    if (gold < cost) {
      if (window.AudioSystem) window.AudioSystem.playError();
      this.showErrorModal('❌ Or Insuffisant', `Il te faut ${cost} Or. Tu n'en as que ${gold}.`);
      return;
    }

    // Confirmation dramatique
    const confirmed = await this.showConfirmationModal({
      title: '✨ Purification des Lys du Pardon',
      icon: '🌸',
      message: `Un lys va mourir pour absorber ta noirceur.\n\nCorruption: ${corruption}% → ${Math.max(0, corruption - 10)}%\nCoût: ${cost} Or`,
      confirmText: '🕊️ Accepter le Sacrifice',
      cancelText: '❌ Refuser'
    });

    if (!confirmed) return;

    // Déduire or
    this.playerData.gold -= cost;
    const oldCorruption = corruption;
    const newCorruption = Math.max(0, corruption - 10);
    this.playerData.corruption = newCorruption;

    // Sauvegarder
    this.savePlayerData();
    this.updateMainUI();

    // Animation purification
    await this.playPurificationAnimation(oldCorruption, newCorruption);

    // Son de succès
    if (window.AudioSystem) window.AudioSystem.playSuccess();

    // Dialogue Jardinier post-purification
    if (this.narrativeSystem) {
      const dialogue = newCorruption < 25
        ? "Le lys est devenu gris... noir... Il est tombé. Mais toi, tu respires mieux."
        : newCorruption < 50
        ? "Elles prennent. Elles souffrent. Mais elles prennent quand même."
        : "Sacrifice accepté. Mais combien de lys reste-t-il ?";

      this.narrativeSystem.showNarrativeModal({
        title: 'Le Jardinier des Regrets',
        icon: '🕯️',
        speaker: 'Aveugle - Gardien des Lys',
        dialogue,
        description: `Corruption réduite de ${oldCorruption}% à ${newCorruption}%`
      });
    }

    // Commentaire du Dé
    setTimeout(() => {
      if (this.narrativeSystem && Math.random() < 0.5) {
        const diceComment = newCorruption < 25
          ? "Tu t'accroches à ta pureté. Touchant. Mais pour combien de temps ?"
          : "La purification... Un pansement sur une plaie béante. Mais continue, Pactisé.";

        this.narrativeSystem.showNarrativeModal({
          title: 'Le Dé du Destin',
          icon: '🎲',
          speaker: 'Thalys ricane',
          dialogue: diceComment
        });
      }
    }, 3000);
  }

  /**
   * Animation purification (particules lumineuses)
   */
  playPurificationAnimation(oldCorr, newCorr) {
    return new Promise(resolve => {
      // Créer overlay particules
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        pointer-events: none;
      `;

      document.body.appendChild(overlay);

      // Particules dorées montantes
      for (let i = 0; i < 100; i++) {
        setTimeout(() => {
          const particle = document.createElement('div');
          particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 8 + 4}px;
            height: ${Math.random() * 8 + 4}px;
            background: radial-gradient(circle, #ffd700, #ffed4e);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            bottom: -20px;
            box-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
            animation: purifyRise ${Math.random() * 2 + 2}s ease-out forwards;
          `;
          overlay.appendChild(particle);
        }, i * 20);
      }

      // Flash blanc
      const flash = document.createElement('div');
      flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.8);
        z-index: 10000;
        animation: flashFade 1s ease-out forwards;
      `;
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 1000);

      // Cleanup
      setTimeout(() => {
        overlay.remove();
        resolve();
      }, 3000);

      // Ajouter CSS animations
      if (!document.getElementById('purificationAnimations')) {
        const style = document.createElement('style');
        style.id = 'purificationAnimations';
        style.textContent = `
          @keyframes purifyRise {
            0% {
              transform: translateY(0) scale(1);
              opacity: 0;
            }
            20% {
              opacity: 1;
            }
            100% {
              transform: translateY(-100vh) scale(0.3);
              opacity: 0;
            }
          }
          @keyframes flashFade {
            0% { opacity: 0; }
            50% { opacity: 0.8; }
            100% { opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }
    });
  }

  /**
   * PACTE DÉMONIAQUE - Augmenter corruption + buff ATK
   */
  async demonicPact() {
    const corruption = this.playerData.corruption || 0;
    const gold = this.playerData.gold || 0;
    const cost = 50;

    // Vérification or
    if (gold < cost) {
      if (window.AudioSystem) window.AudioSystem.playError();
      this.showErrorModal('❌ Or Insuffisant', `Il te faut ${cost} Or pour sceller le pacte. Tu n'en as que ${gold}.`);
      return;
    }

    // Confirmation dramatique
    const confirmed = await this.showConfirmationModal({
      title: '👿 Pacte Démoniaque',
      icon: '🔥',
      message: `Tu vas brûler un lys noir pour invoquer une entité.\n\nGains:\n+5 ATK permanent\n\nCoût:\n${cost} Or\n+15% Corruption (${corruption}% → ${Math.min(100, corruption + 15)}%)`,
      confirmText: '🔥 Sceller le Pacte',
      cancelText: '❌ Refuser',
      dangerous: true
    });

    if (!confirmed) return;

    // Appliquer effets
    this.playerData.gold -= cost;
    this.playerData.atk = (this.playerData.atk || 10) + 5;
    const oldCorruption = corruption;
    const newCorruption = Math.min(100, corruption + 15);
    this.playerData.corruption = newCorruption;

    // Sauvegarder
    this.savePlayerData();
    this.updateMainUI();

    // Animation pacte
    await this.playPactAnimation(oldCorruption, newCorruption);

    // Son (utiliser playSuccess même si c'est un pacte corrompu)
    if (window.AudioSystem) window.AudioSystem.playSuccess();

    // Dialogue Jardinier post-pacte
    if (this.narrativeSystem) {
      const dialogue = newCorruption >= 75
        ? "La fumée noire entre en toi. Ça brûle. Puis... puissance. Pure. Horrible. Tienne."
        : "Le lys brûle. Tu sens la chaleur. Le pouvoir. Et la noirceur qui s'installe.";

      this.narrativeSystem.showNarrativeModal({
        title: 'Le Jardinier des Regrets',
        icon: '🔥',
        speaker: 'Aveugle - Témoin du Pacte',
        dialogue,
        description: `+5 ATK | Corruption ${oldCorruption}% → ${newCorruption}%`
      });
    }

    // Commentaire du Dé
    setTimeout(() => {
      if (this.narrativeSystem) {
        const diceComment = newCorruption >= 75
          ? "Bien. Tu comprends. Le pouvoir n'est jamais gratuit. Ni propre. Bienvenue dans le club."
          : "Un pacte de plus. Chaque choix te rapproche de moi. De ce que je suis. Continue.";

        this.narrativeSystem.showNarrativeModal({
          title: 'Le Dé du Destin',
          icon: '🎲',
          speaker: 'Thalys sourit',
          dialogue: diceComment
        });
      }
    }, 3000);
  }

  /**
   * Animation pacte démoniaque (particules sombres + shake)
   */
  playPactAnimation(oldCorr, newCorr) {
    return new Promise(resolve => {
      // Screen shake intense
      this.screenShake(15, 1000);

      // Overlay particules
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        pointer-events: none;
      `;
      document.body.appendChild(overlay);

      // Particules noires/rouges tourbillonnantes
      for (let i = 0; i < 150; i++) {
        setTimeout(() => {
          const particle = document.createElement('div');
          const colors = ['#8b0000', '#dc143c', '#000000', '#4b0000'];
          const color = colors[Math.floor(Math.random() * colors.length)];

          particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 10 + 3}px;
            height: ${Math.random() * 10 + 3}px;
            background: ${color};
            border-radius: 50%;
            left: 50%;
            top: 50%;
            box-shadow: 0 0 15px ${color};
            animation: pactSpiral ${Math.random() * 2 + 1}s ease-out forwards;
            --angle: ${Math.random() * 360}deg;
          `;
          overlay.appendChild(particle);
        }, i * 10);
      }

      // Flash rouge
      const flash = document.createElement('div');
      flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(220, 20, 60, 0.6), rgba(139, 0, 0, 0.8));
        z-index: 10000;
        animation: redPulse 2s ease-in-out forwards;
      `;
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 2000);

      // Cleanup
      setTimeout(() => {
        overlay.remove();
        resolve();
      }, 3000);

      // Ajouter CSS animations
      if (!document.getElementById('pactAnimations')) {
        const style = document.createElement('style');
        style.id = 'pactAnimations';
        style.textContent = `
          @keyframes pactSpiral {
            0% {
              transform: translate(-50%, -50%) rotate(0deg) translateX(0) scale(1);
              opacity: 0;
            }
            20% {
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) rotate(var(--angle)) translateX(${Math.random() * 300 + 200}px) scale(0);
              opacity: 0;
            }
          }
          @keyframes redPulse {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
          }
        `;
        document.head.appendChild(style);
      }
    });
  }

  /**
   * Modal de confirmation
   */
  showConfirmationModal({ title, icon, message, confirmText, cancelText, dangerous = false }) {
    return new Promise(resolve => {
      const overlay = document.createElement('div');
      overlay.className = 'service-modal-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        backdrop-filter: blur(10px);
        z-index: 10001;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.3s ease;
      `;

      const borderColor = dangerous ? '#dc143c' : '#d4af37';
      const iconSize = '5rem';

      overlay.innerHTML = `
        <div class="service-modal" style="
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
          border: 3px solid ${borderColor};
          border-radius: 15px;
          padding: 40px;
          max-width: 600px;
          width: 90%;
          box-shadow: 0 0 60px rgba(212, 175, 55, 0.5);
          animation: scaleIn 0.4s ease;
          text-align: center;
        ">
          <div style="font-size: ${iconSize}; margin-bottom: 20px;">
            ${icon}
          </div>

          <h2 style="font-family: 'Cinzel', serif; color: ${borderColor}; font-size: 2rem; margin-bottom: 20px; text-shadow: 0 0 20px ${borderColor};">
            ${title}
          </h2>

          <p style="font-family: 'Crimson Text', serif; font-size: 1.2rem; line-height: 1.8; color: #e0e0e0; white-space: pre-line; margin-bottom: 30px;">
            ${message}
          </p>

          <div style="display: flex; gap: 20px; justify-content: center;">
            <button class="btn-cancel" style="
              font-family: 'Cinzel', serif;
              padding: 15px 30px;
              background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
              border: 2px solid #666;
              border-radius: 8px;
              color: #999;
              cursor: pointer;
              font-size: 1.1rem;
              transition: all 0.3s ease;
            ">
              ${cancelText}
            </button>

            <button class="btn-confirm" style="
              font-family: 'Cinzel', serif;
              padding: 15px 30px;
              background: linear-gradient(135deg, ${dangerous ? '#8b0000, #dc143c' : '#d4af37, #ffed4e'});
              border: none;
              border-radius: 8px;
              color: ${dangerous ? '#fff' : '#000'};
              cursor: pointer;
              font-size: 1.1rem;
              font-weight: 700;
              transition: all 0.3s ease;
              box-shadow: 0 0 20px ${dangerous ? 'rgba(220, 20, 60, 0.5)' : 'rgba(212, 175, 55, 0.5)'};
            ">
              ${confirmText}
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      // Event listeners
      overlay.querySelector('.btn-cancel').onclick = () => {
        overlay.remove();
        resolve(false);
      };

      overlay.querySelector('.btn-confirm').onclick = () => {
        overlay.remove();
        resolve(true);
      };

      // Hover effects
      const confirmBtn = overlay.querySelector('.btn-confirm');
      confirmBtn.onmouseenter = () => {
        confirmBtn.style.transform = 'translateY(-3px) scale(1.05)';
        confirmBtn.style.boxShadow = dangerous
          ? '0 10px 40px rgba(220, 20, 60, 0.8)'
          : '0 10px 40px rgba(212, 175, 55, 0.8)';
      };
      confirmBtn.onmouseleave = () => {
        confirmBtn.style.transform = 'translateY(0) scale(1)';
      };
    });
  }

  /**
   * ========================================
   * FORGE SERVICES - Drenvar l'Écorcheur de Fer
   * ========================================
   */

  /**
   * AMÉLIORER ARME - Larmes de Krovax
   */
  async upgradeWeapon(tier = 1) {
    const corruption = this.playerData.corruption || 0;
    const gold = this.playerData.gold || 0;
    const baseCost = tier === 1 ? 100 : tier === 2 ? 200 : 300;
    const atkBonus = tier === 1 ? 5 : tier === 2 ? 10 : 15;

    // Vérification or
    if (gold < baseCost) {
      if (window.AudioSystem) window.AudioSystem.playError();
      this.showErrorModal('❌ Or Insuffisant', `Drenvar crache: "Reviens avec du vrai argent. ${baseCost} Or minimum."`);
      return;
    }

    // Risque d'échec si corruption trop haute
    const failureRisk = corruption >= 75 ? 0.3 : corruption >= 50 ? 0.15 : 0;
    const willFail = Math.random() < failureRisk;

    if (willFail) {
      if (window.AudioSystem) window.AudioSystem.playError();
      this.showErrorModal(
        '💥 Explosion Cristalline !',
        `Le Cristal de Krovax explose au contact de ta corruption !\n\n"Merde ! Ta noirceur a foutu le bordel. Reviens quand t'es plus stable."\n\n-${baseCost} Or (perdu)`
      );
      this.playerData.gold -= baseCost;
      this.savePlayerData();
      this.updateMainUI();
      await this.playForgeFailureAnimation();
      return;
    }

    // Confirmation
    const tierName = tier === 1 ? 'Basique' : tier === 2 ? 'Avancée' : 'Maîtresse';
    const crystalType = corruption >= 50 ? 'Larmes Noires (Corrompues)' : 'Larmes de Krovax (Pures)';

    const confirmed = await this.showConfirmationModal({
      title: '⚒️ Amélioration d\'Arme',
      icon: '🔨',
      message: `Drenvar va retremper ta lame dans les ${crystalType}.\n\nAmélioration ${tierName}:\n+${atkBonus} ATK permanent\n\nCoût: ${baseCost} Or${failureRisk > 0 ? `\n\n⚠️ Risque d'échec: ${Math.floor(failureRisk * 100)}%` : ''}`,
      confirmText: '⚒️ Forger',
      cancelText: '❌ Annuler',
      dangerous: corruption >= 50
    });

    if (!confirmed) return;

    // Appliquer effets
    this.playerData.gold -= baseCost;
    this.playerData.atk = (this.playerData.atk || 10) + atkBonus;

    // Sauvegarder
    this.savePlayerData();
    this.updateMainUI();

    // Animation forge
    await this.playWeaponForgeAnimation(corruption >= 50);

    // Son de succès
    if (window.AudioSystem) window.AudioSystem.playSuccess();

    // Dialogue Drenvar post-forge
    if (this.narrativeSystem) {
      const dialogue = corruption < 25
        ? "La lame chante. Rouge sang. Voilà du travail propre."
        : corruption < 50
        ? "Ça tient. Pour l'instant. Mais cette tache sur ton acier... surveille-la."
        : corruption < 75
        ? "J'ai forgé pour des démons avant. Toi ? T'es entre les deux. J'sais pas si c'est mieux."
        : "Il trempe la lame dans l'eau noire. « Pour toi, je forge dans les Larmes Corrompues. Krovax me pardonnera. Peut-être. »";

      this.narrativeSystem.showNarrativeModal({
        title: 'Drenvar l\'Écorcheur de Fer',
        icon: '⚒️',
        speaker: 'Forgeron Nain - 156 ans',
        dialogue,
        description: `+${atkBonus} ATK | Nouvelle ATK: ${this.playerData.atk}`
      });
    }
  }

  /**
   * AMÉLIORER ARMURE - Plaques renforcées
   */
  async upgradeArmor(tier = 1) {
    const corruption = this.playerData.corruption || 0;
    const gold = this.playerData.gold || 0;
    const baseCost = tier === 1 ? 80 : tier === 2 ? 160 : 240;
    const defBonus = tier === 1 ? 3 : tier === 2 ? 5 : 7;

    // Vérification or
    if (gold < baseCost) {
      if (window.AudioSystem) window.AudioSystem.playError();
      this.showErrorModal('❌ Or Insuffisant', `"${baseCost} Or. Pas de crédit. Pas de pitié."`);
      return;
    }

    // Confirmation
    const tierName = tier === 1 ? 'Légère' : tier === 2 ? 'Lourde' : 'Forteresse';

    const confirmed = await this.showConfirmationModal({
      title: '🛡️ Amélioration d\'Armure',
      icon: '🛡️',
      message: `Drenvar va renforcer tes plaques d'armure.\n\nAmélioration ${tierName}:\n+${defBonus} DEF permanent\n\nCoût: ${baseCost} Or`,
      confirmText: '🛡️ Renforcer',
      cancelText: '❌ Annuler'
    });

    if (!confirmed) return;

    // Appliquer effets
    this.playerData.gold -= baseCost;
    this.playerData.def = (this.playerData.def || 5) + defBonus;

    // Sauvegarder
    this.savePlayerData();
    this.updateMainUI();

    // Animation armure
    await this.playArmorForgeAnimation();

    // Son de succès
    if (window.AudioSystem) window.AudioSystem.playSuccess();

    // Dialogue Drenvar
    if (this.narrativeSystem) {
      const dialogue = corruption < 50
        ? "Plaques rivées. Cuir tanné. Tu survivras deux coups de plus. Peut-être trois."
        : "L'acier noir adhère à ta peau. « Armure corrompue pour porteur corrompu. Logique. »";

      this.narrativeSystem.showNarrativeModal({
        title: 'Drenvar l\'Écorcheur de Fer',
        icon: '🛡️',
        speaker: 'Forgeron Nain',
        dialogue,
        description: `+${defBonus} DEF | Nouvelle DEF: ${this.playerData.def}`
      });
    }
  }

  /**
   * Animation forge arme (étincelles + glow cristallin)
   */
  playWeaponForgeAnimation(isCorrupted = false) {
    return new Promise(resolve => {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        pointer-events: none;
      `;
      document.body.appendChild(overlay);

      // Étincelles de forge (100 particules)
      for (let i = 0; i < 100; i++) {
        setTimeout(() => {
          const spark = document.createElement('div');
          const color = isCorrupted ? '#8b0000' : '#ff6347';
          const glowColor = isCorrupted ? '#dc143c' : '#ffa500';

          spark.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 10 + 5}px;
            background: linear-gradient(to bottom, ${color}, ${glowColor});
            left: 50%;
            top: 50%;
            box-shadow: 0 0 8px ${glowColor};
            animation: sparkFly ${Math.random() * 1 + 0.5}s ease-out forwards;
            --angle: ${Math.random() * 360}deg;
            --distance: ${Math.random() * 200 + 100}px;
          `;
          overlay.appendChild(spark);
        }, i * 15);
      }

      // Flash de trempe (rouge sang ou noir)
      setTimeout(() => {
        const flash = document.createElement('div');
        flash.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: ${isCorrupted ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 99, 71, 0.7)'};
          z-index: 10000;
          animation: flashFade 1.5s ease-out forwards;
        `;
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 1500);
      }, 1000);

      // Cleanup
      setTimeout(() => {
        overlay.remove();
        resolve();
      }, 3000);

      // CSS animations
      if (!document.getElementById('forgeAnimations')) {
        const style = document.createElement('style');
        style.id = 'forgeAnimations';
        style.textContent = `
          @keyframes sparkFly {
            0% {
              transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) rotate(var(--angle)) translateY(calc(var(--distance) * -1));
              opacity: 0;
            }
          }
          @keyframes hammerStrike {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-30px); }
          }
        `;
        document.head.appendChild(style);
      }
    });
  }

  /**
   * Animation forge armure (martelage + glow métallique)
   */
  playArmorForgeAnimation() {
    return new Promise(resolve => {
      // Shake enclume
      this.screenShake(8, 800);

      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        pointer-events: none;
      `;
      document.body.appendChild(overlay);

      // Particules métalliques
      for (let i = 0; i < 60; i++) {
        setTimeout(() => {
          const particle = document.createElement('div');
          particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 6 + 3}px;
            height: ${Math.random() * 6 + 3}px;
            background: radial-gradient(circle, #c0c0c0, #808080);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: 50%;
            box-shadow: 0 0 10px rgba(192, 192, 192, 0.8);
            animation: metalFall ${Math.random() * 1.5 + 1}s ease-out forwards;
          `;
          overlay.appendChild(particle);
        }, i * 25);
      }

      // Flash argenté
      const flash = document.createElement('div');
      flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.6), rgba(192, 192, 192, 0.4));
        z-index: 10000;
        animation: flashFade 1.2s ease-out forwards;
      `;
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 1200);

      // Cleanup
      setTimeout(() => {
        overlay.remove();
        resolve();
      }, 2500);

      // CSS
      if (!document.getElementById('armorAnimations')) {
        const style = document.createElement('style');
        style.id = 'armorAnimations';
        style.textContent = `
          @keyframes metalFall {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(300px) rotate(360deg);
              opacity: 0;
            }
          }
        `;
        document.head.appendChild(style);
      }
    });
  }

  /**
   * Animation échec forge (explosion cristal)
   */
  playForgeFailureAnimation() {
    return new Promise(resolve => {
      this.screenShake(20, 1200);

      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        pointer-events: none;
      `;
      document.body.appendChild(overlay);

      // Explosion cristalline
      for (let i = 0; i < 200; i++) {
        const shard = document.createElement('div');
        const colors = ['#ff0000', '#ff4500', '#dc143c', '#8b0000'];
        shard.style.cssText = `
          position: absolute;
          width: ${Math.random() * 8 + 2}px;
          height: ${Math.random() * 8 + 2}px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          left: 50%;
          top: 50%;
          box-shadow: 0 0 10px rgba(255, 0, 0, 0.8);
          animation: explode ${Math.random() * 1 + 0.8}s ease-out forwards;
          --explode-x: ${(Math.random() - 0.5) * 600}px;
          --explode-y: ${(Math.random() - 0.5) * 600}px;
        `;
        overlay.appendChild(shard);
      }

      // Flash explosion
      const flash = document.createElement('div');
      flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(255, 0, 0, 0.9), rgba(0, 0, 0, 0.8));
        z-index: 10000;
        animation: redPulse 1.5s ease-out forwards;
      `;
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 1500);

      setTimeout(() => {
        overlay.remove();
        resolve();
      }, 2000);

      // CSS
      if (!document.getElementById('explosionAnimations')) {
        const style = document.createElement('style');
        style.id = 'explosionAnimations';
        style.textContent = `
          @keyframes explode {
            0% {
              transform: translate(-50%, -50%) translate(0, 0) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) translate(var(--explode-x), var(--explode-y)) scale(0);
              opacity: 0;
            }
          }
        `;
        document.head.appendChild(style);
      }
    });
  }

  /**
   * ========================================
   * MARCHÉ SERVICES - Commerce d'Items
   * ========================================
   */

  /**
   * Catalogue d'items du marché
   */
  getMarketCatalog() {
    return [
      {
        id: 'health_potion',
        name: 'Potion de Soin',
        icon: '🧪',
        description: 'Restaure 50 HP. Goût de fer rouillé.',
        basePrice: 30,
        effect: { type: 'heal', value: 50 },
        stock: 99
      },
      {
        id: 'greater_health_potion',
        name: 'Grande Potion',
        icon: '⚗️',
        description: 'Restaure 100 HP. Liquide épais et chaud.',
        basePrice: 60,
        effect: { type: 'heal', value: 100 },
        stock: 50
      },
      {
        id: 'strength_elixir',
        name: 'Élixir de Force',
        icon: '💪',
        description: '+5 ATK pour le prochain combat. Brûle la gorge.',
        basePrice: 40,
        effect: { type: 'buff_atk', value: 5, duration: 1 },
        stock: 30
      },
      {
        id: 'protection_stone',
        name: 'Pierre de Protection',
        icon: '🛡️',
        description: '+3 DEF pour le prochain combat. Vibre doucement.',
        basePrice: 40,
        effect: { type: 'buff_def', value: 3, duration: 1 },
        stock: 30
      },
      {
        id: 'krovax_tear',
        name: 'Larme de Krovax',
        icon: '💎',
        description: 'Cristal divin. Restaure 75 HP + 10 ATK temporaire. Rare.',
        basePrice: 100,
        effect: { type: 'multi', heal: 75, buff_atk: 10, duration: 1 },
        stock: 10
      },
      {
        id: 'corruption_vial',
        name: 'Fiole Corrompue',
        icon: '🧬',
        description: '+15 ATK temporaire mais +5% corruption. Dangereuse.',
        basePrice: 50,
        effect: { type: 'buff_atk', value: 15, duration: 1, corruption: 5 },
        stock: 20,
        dangerous: true
      }
    ];
  }

  /**
   * Calculer prix avec modificateurs (corruption + morale + RNG)
   */
  calculateMarketPrice(basePrice, corruption, morale = 100) {
    let modifier = 1.0;

    // Corruption modifie les prix
    if (corruption >= 75) {
      modifier *= 0.7; // Remise pour les corrompus
    } else if (corruption >= 50) {
      modifier *= 0.85;
    } else if (corruption < 25) {
      modifier *= 1.1; // Plus cher pour les purs
    }

    // Morale du marchand (random)
    const moraleModifier = 0.9 + (Math.random() * 0.2); // ±10%
    modifier *= moraleModifier;

    return Math.floor(basePrice * modifier);
  }

  /**
   * ACHETER ITEM
   */
  async buyItem(item) {
    const gold = this.playerData.gold || 0;
    const corruption = this.playerData.corruption || 0;

    const finalPrice = this.calculateMarketPrice(item.basePrice, corruption);

    // Vérification or
    if (gold < finalPrice) {
      if (window.AudioSystem) window.AudioSystem.playError();
      this.showErrorModal('❌ Or Insuffisant', `Il te faut ${finalPrice} Or. Tu n'en as que ${gold}.`);
      return;
    }

    // Confirmation
    let effectDesc = '';
    if (item.effect.type === 'heal') {
      effectDesc = `Restaure ${item.effect.value} HP`;
    } else if (item.effect.type === 'buff_atk') {
      effectDesc = `+${item.effect.value} ATK (${item.effect.duration} combat)`;
    } else if (item.effect.type === 'buff_def') {
      effectDesc = `+${item.effect.value} DEF (${item.effect.duration} combat)`;
    } else if (item.effect.type === 'multi') {
      effectDesc = `+${item.effect.heal} HP, +${item.effect.buff_atk} ATK temporaire`;
    }

    if (item.effect.corruption) {
      effectDesc += `\n⚠️ +${item.effect.corruption}% Corruption`;
    }

    const confirmed = await this.showConfirmationModal({
      title: `${item.icon} ${item.name}`,
      icon: item.icon,
      message: `${item.description}\n\nEffet:\n${effectDesc}\n\nPrix: ${finalPrice} Or`,
      confirmText: '💰 Acheter',
      cancelText: '❌ Annuler',
      dangerous: item.dangerous || false
    });

    if (!confirmed) return;

    // Acheter
    this.playerData.gold -= finalPrice;

    // Ajouter à l'inventaire
    if (!this.playerData.inventory) this.playerData.inventory = [];

    const existingItem = this.playerData.inventory.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.playerData.inventory.push({ ...item, quantity: 1 });
    }

    // Appliquer corruption si item corrompu
    if (item.effect.corruption) {
      this.playerData.corruption = Math.min(100, (this.playerData.corruption || 0) + item.effect.corruption);
    }

    this.savePlayerData();
    this.updateMainUI();

    // Son succès
    if (window.AudioSystem) window.AudioSystem.playSuccess();

    // Dialogue marchand
    if (this.narrativeSystem) {
      const dialogue = corruption >= 50
        ? `Le marchand sourit trop largement. "Pour toi ? Cadeau. Enfin... presque."`
        : `"Transaction complète. Argent standard. Produit standard. Merci."`

      this.narrativeSystem.showNarrativeModal({
        title: 'Le Bazar des Ruines',
        icon: '🛒',
        speaker: 'Marchand',
        dialogue,
        description: `${item.icon} ${item.name} ajouté à l'inventaire`
      });
    }
  }

  /**
   * Modal d'erreur
   */
  showErrorModal(title, message) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      z-index: 10001;
      display: flex;
      justify-content: center;
      align-items: center;
      animation: fadeIn 0.3s ease;
    `;

    overlay.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #1a0d0d, #2d0a0a);
        border: 3px solid #dc143c;
        border-radius: 15px;
        padding: 40px;
        max-width: 500px;
        text-align: center;
        box-shadow: 0 0 40px rgba(220, 20, 60, 0.5);
      ">
        <div style="font-size: 4rem; margin-bottom: 20px;">⚠️</div>
        <h2 style="font-family: 'Cinzel', serif; color: #dc143c; font-size: 1.8rem; margin-bottom: 15px;">
          ${title}
        </h2>
        <p style="color: #e0e0e0; font-size: 1.1rem; line-height: 1.6; margin-bottom: 30px;">
          ${message}
        </p>
        <button class="btn-close" style="
          font-family: 'Cinzel', serif;
          padding: 12px 40px;
          background: linear-gradient(135deg, #8b0000, #dc143c);
          border: none;
          border-radius: 8px;
          color: #fff;
          cursor: pointer;
          font-size: 1.1rem;
          font-weight: 600;
        ">
          Fermer
        </button>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('.btn-close').onclick = () => overlay.remove();
    overlay.onclick = (e) => {
      if (e.target === overlay) overlay.remove();
    };
  }
}

// Export global
window.CampServicesSystem = CampServicesSystem;
