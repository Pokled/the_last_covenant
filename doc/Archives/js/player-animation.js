// 🎬 SYSTÈME D'ANIMATION JOUEUR - SAUT DE PUCE
// Animation visuelle du déplacement case par case avec sons

// ═══════════════════════════════════════════════════════════
// 🎯 CONFIGURATION ANIMATION
// ═══════════════════════════════════════════════════════════

const ANIMATION_CONFIG = {
  // Timing
  STEP_DURATION: 400,        // Durée totale d'un saut (ms)
  JUMP_DURATION: 200,        // Durée de la montée/descente (ms)
  PAUSE_BETWEEN_STEPS: 100,  // Pause entre chaque case (ms)
  
  // Animation du saut
  JUMP_HEIGHT: 15,           // Hauteur du saut (pixels)
  JUMP_EASING: 'cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Effets visuels
  SHADOW_SCALE_MIN: 0.6,     // Taille minimale de l'ombre
  SHADOW_SCALE_MAX: 1.0,     // Taille maximale de l'ombre
  
  // Sons
  FOOTSTEP_VOLUME: 0.3,      // Volume des pas
  FOOTSTEP_PITCH_VARIATION: 0.1  // Variation de hauteur
};

// ═══════════════════════════════════════════════════════════
// 🏃 FONCTION PRINCIPALE : Déplacer le joueur avec animation
// ═══════════════════════════════════════════════════════════

async function movePlayerWithAnimation(player, steps, game) {
  console.log(`🏃 Animation déplacement : ${steps} cases`);
  
  if (steps <= 0) {
    return { completed: true, stoppedEarly: false, finalPosition: player.position };
  }
  
  let currentStep = 0;
  let stoppedEarly = false;
  let eventTriggered = false;
  
  // Boucle d'animation case par case
  while (currentStep < steps && player.position < GameState.dungeon.path.length - 1) {
    // ─────────────────────────────────────────────────────
    // 1️⃣ DÉPLACEMENT À LA CASE SUIVANTE
    // ─────────────────────────────────────────────────────
    
    player.position++;
    currentStep++;
    
    const currentTile = GameState.dungeon.path[player.position];
    
    console.log(`  ↳ Case ${player.position} : ${currentTile.type}`);
    
    // ─────────────────────────────────────────────────────
    // 2️⃣ ANIMATION VISUELLE DU SAUT
    // ─────────────────────────────────────────────────────
    
    await animatePlayerJump(player, game);
    
    // ─────────────────────────────────────────────────────
    // 3️⃣ VÉRIFIER SI ON ENTRE DANS UNE SALLE (SEUL CAS D'ARRÊT)
    // ─────────────────────────────────────────────────────
    
    if (currentTile.type === 'room_entry' && currentTile.roomId && !currentTile.eventTriggered) {
      console.log('  ⚠️ ENTRÉE DANS UNE SALLE ! Arrêt du mouvement.');
      
      // Marquer la salle comme déclenchée
      currentTile.eventTriggered = true;
      
      // Pause avant l'événement
      await delay(300);
      
      // Déclencher l'événement de la salle
      if (game && game.triggerRoomEvent) {
        game.triggerRoomEvent(currentTile);
      }
      
      stoppedEarly = true;
      eventTriggered = true;
      break;
    }
    
    // ✅ NE PAS S'ARRÊTER sur les événements de couloir (combat, coffre, etc.)
    // On continue jusqu'à la case finale !
    
    // ─────────────────────────────────────────────────────
    // 4️⃣ PAUSE ENTRE LES CASES
    // ─────────────────────────────────────────────────────
    
    if (currentStep < steps) {
      await delay(ANIMATION_CONFIG.PAUSE_BETWEEN_STEPS);
    }
  }
  
  // ═══════════════════════════════════════════════════════
  // 🎯 ARRIVÉE À DESTINATION (si pas d'arrêt en salle)
  // ═══════════════════════════════════════════════════════
  
  if (!eventTriggered && player.position < GameState.dungeon.path.length - 1) {
    const finalTile = GameState.dungeon.path[player.position];
    
    // Vérifier si la case finale a un événement
    if (['combat', 'trap', 'chest', 'merchant', 'event'].includes(finalTile.type) && !finalTile.cleared) {
      console.log('  ✅ Arrivée sur case événement:', finalTile.type);
      
      // Pause avant l'événement
      await delay(300);
      
      // Déclencher l'événement de la case
      if (game && game.handleTileEvent) {
        game.handleTileEvent(player, finalTile);
      } else if (typeof Events !== 'undefined' && Events.handleTile) {
        Events.handleTile(player, finalTile, game);
      }
      
      eventTriggered = true;
    }
  }
  
  return {
    completed: !stoppedEarly,
    stoppedEarly: stoppedEarly,
    eventTriggered: eventTriggered,
    finalPosition: player.position
  };
}

// ═══════════════════════════════════════════════════════════
// 🦗 ANIMATION DU SAUT D'UNE CASE
// ═══════════════════════════════════════════════════════════

async function animatePlayerJump(player, game) {
  // Mettre à jour l'affichage (position changée)
  if (game && game.updateUI) {
    game.updateUI();
  }
  
  // Redessiner le donjon avec la nouvelle position
  if (game && game.renderer && game.renderer.draw) {
    game.renderer.draw(GameState.dungeon, GameState.players);
  }
  
  // ─────────────────────────────────────────────────────
  // 🎨 ANIMATION CSS DU SPRITE (optionnel, si disponible)
  // ─────────────────────────────────────────────────────
  
  // Note : Ceci nécessiterait d'avoir un élément DOM pour le joueur
  // Pour l'instant, l'animation se fait via le canvas qui redessine
  
  // ─────────────────────────────────────────────────────
  // 🔊 SON DE PAS
  // ─────────────────────────────────────────────────────
  
  playFootstepSound();
  
  // ─────────────────────────────────────────────────────
  // ⏱️ ATTENDRE LA FIN DE L'ANIMATION
  // ─────────────────────────────────────────────────────
  
  await delay(ANIMATION_CONFIG.STEP_DURATION);
}

// ═══════════════════════════════════════════════════════════
// 🔊 SON DE PAS VARIÉ
// ═══════════════════════════════════════════════════════════

function playFootstepSound() {
  if (typeof AUDIO !== 'undefined' && AUDIO.playFootstep) {
    // Utiliser le système audio existant
    AUDIO.playFootstep();
  } else {
    // Créer un son de pas simple
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Fréquence variée pour plus de naturel
      const basePitch = 80;
      const variation = (Math.random() - 0.5) * 2 * ANIMATION_CONFIG.FOOTSTEP_PITCH_VARIATION;
      oscillator.frequency.value = basePitch * (1 + variation);
      
      oscillator.type = 'sine';
      
      // Volume
      gainNode.gain.setValueAtTime(ANIMATION_CONFIG.FOOTSTEP_VOLUME, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      // Jouer le son
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      // Son désactivé ou non supporté
      console.log('Audio non disponible');
    }
  }
}

// ═══════════════════════════════════════════════════════════
// 🎨 AMÉLIORATION DU RENDERER (saut visuel sur canvas)
// ═══════════════════════════════════════════════════════════

// Cette fonction peut être appelée dans renderer.js pour animer le sprite
function drawPlayerWithJumpAnimation(ctx, player, x, y, tileSize, currentTime) {
  // Calculer l'offset vertical pour l'effet de saut
  // (utiliser une variable globale ou un timestamp pour synchroniser)
  
  const jumpProgress = ((currentTime % ANIMATION_CONFIG.STEP_DURATION) / ANIMATION_CONFIG.STEP_DURATION);
  
  let yOffset = 0;
  
  if (jumpProgress < 0.5) {
    // Montée (0 → 0.5)
    const t = jumpProgress * 2; // 0 → 1
    yOffset = -ANIMATION_CONFIG.JUMP_HEIGHT * Math.sin(t * Math.PI);
  } else {
    // Descente (0.5 → 1)
    const t = (jumpProgress - 0.5) * 2; // 0 → 1
    yOffset = -ANIMATION_CONFIG.JUMP_HEIGHT * Math.sin(t * Math.PI);
  }
  
  // Dessiner l'ombre (échelle selon la hauteur)
  const shadowScale = ANIMATION_CONFIG.SHADOW_SCALE_MAX - 
    (Math.abs(yOffset) / ANIMATION_CONFIG.JUMP_HEIGHT) * 
    (ANIMATION_CONFIG.SHADOW_SCALE_MAX - ANIMATION_CONFIG.SHADOW_SCALE_MIN);
  
  ctx.save();
  
  // Ombre
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(
    x + tileSize / 2,
    y + tileSize - 5,
    (tileSize / 4) * shadowScale,
    (tileSize / 8) * shadowScale,
    0, 0, Math.PI * 2
  );
  ctx.fill();
  
  ctx.restore();
  
  // Dessiner le joueur avec l'offset
  return { x, y: y + yOffset };
}

// ═══════════════════════════════════════════════════════════
// ⏱️ UTILITAIRE : Délai async
// ═══════════════════════════════════════════════════════════

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ═══════════════════════════════════════════════════════════
// 🔗 INTÉGRATION AVEC game.js
// ═══════════════════════════════════════════════════════════

/*
  DANS game.js, MODIFIER rollDice() :
  
  async rollDice() {
    // ... code existant ...
    
    const finalRoll = actualFinalRoll; // Résultat du dé
    
    // ✅ NOUVEAU : Animation case par case
    const result = await movePlayerWithAnimation(currentPlayer, finalRoll, this);
    
    console.log('Animation terminée:', result);
    // result.completed : true si tout le trajet
    // result.stoppedEarly : true si arrêt en salle
    // result.eventTriggered : true si événement déclenché
    
    // ✅ Vérifier si arrivée à la sortie
    if (currentPlayer.position >= GameState.dungeon.path.length - 1) {
      currentPlayer.position = GameState.dungeon.path.length - 1;
      this.showVictoryScreen(currentPlayer);
      return;
    }
    
    // ✅ Si pas d'événement déclenché pendant l'animation
    if (!result.eventTriggered) {
      // Vérifier progression, buffs, etc.
      currentPlayer.movementsSinceLastSelection++;
      this.checkProgressionRewards(currentPlayer);
      
      if (currentPlayer.movementsSinceLastSelection >= 3) {
        currentPlayer.movementsSinceLastSelection = 0;
        setTimeout(() => {
          this.giveRandomBuff(currentPlayer);
        }, 500);
      }
    }
    
    // Mise à jour finale
    this.updateUI();
    if (this.renderer) {
      this.renderer.draw(GameState.dungeon, GameState.players);
    }
    
    // Réactiver le bouton
    if (rollBtn) rollBtn.disabled = false;
    
    // Tour suivant
    this.nextTurn();
  }
*/

console.log('🎬 Système d\'animation joueur chargé');