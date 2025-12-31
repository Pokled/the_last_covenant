console.log('🎮 Chargement du jeu isométrique...');

// Fonction utilitaire pour créer des délais
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Charger données joueur depuis localStorage
let playerData = JSON.parse(localStorage.getItem('tlc_player') || '{}');

// Fallback : vérifier ancien système sessionStorage (compatibilité)
if (!playerData.name) {
  playerData = JSON.parse(sessionStorage.getItem('player') || '{}');
}

if (!playerData.name) {
  alert('Aucun joueur trouvé ! Retourne au Camp pour commencer une partie.');
  window.location.href = 'camp.html';
}

// ═══════════════════════════════════════════════════════════════
// GAME ISOMETRIC - Version migrée de game.js + game-test.js
// ═══════════════════════════════════════════════════════════════
class GameIsometric {
  constructor() {
    this.renderer = null;
    this.dungeonSystem = null;
    this.dungeon = null;
    this.decisions = [];
    this.currentPlayer = null;
    this.currentTileIndex = 0;
    this.isRolling = false;
    this.musicStarted = false;
    
    // FPS Counter
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.fps = 60;
  }

  async init() {
    console.log('🎮 Initialisation du jeu...');

    // Exposer l'instance globalement
    window.game = this;

    // Récupérer la classe
    let cls = playerData.classData;
    if (!cls || !cls.baseStats) {
      if (window.CLASSES && playerData.class) {
        cls = CLASSES[playerData.class];
      }
    }

    if (!cls) {
      console.error('❌ Impossible de charger les données de classe');
      alert('Erreur: Données de classe manquantes ! Retour au camp...');
      window.location.href = 'camp.html';
      return;
    }

    // Créer joueur
    this.currentPlayer = {
      id: playerData.id || 'player_1',
      name: playerData.name,
      sprite: playerData.sprite || '🧙',
      icon: playerData.sprite || '🧙',
      class: playerData.class || cls.id,
      className: cls.name,
      
      // Stats
      hp: playerData.hp || cls.baseStats.hp,
      maxHp: playerData.maxHp || cls.baseStats.hp,
      atk: playerData.atk || cls.baseStats.atk,
      def: playerData.def || cls.baseStats.def,
      
      // Progression
      level: playerData.level || 1,
      xp: playerData.xp || 0,
      xpToNextLevel: 100,
      gold: playerData.gold || 0,
      
      // État
      position: 0,
      corruption: playerData.corruption || 0,
      momentum: 0,
      pactsSigned: 0,
      diceStage: 1,
      
      // Inventaire
      inventory: playerData.inventory || {
        items: [],
        maxSlots: 10,
        equipped: {
          weapon: null,
          armor: null,
          accessory: null
        }
      },
      companions: playerData.companions || [],
      skills: playerData.skills || [],
      passiveBuffs: playerData.passiveBuffs || []
    };

    console.log('✅ Joueur créé:', this.currentPlayer.name);

    // 1. Initialiser le renderer isométrique
    this.renderer = new IsometricRenderer('gameCanvas', {
      tileWidth: 64,
      tileHeight: 32,
      tileDepth: 16,
      darkMode: true
    });

    // 2. Initialiser le système de donjon
    this.dungeonSystem = new NodeBasedDungeon();

    // 3. Générer le donjon
    this.generateDungeon();

    // 4. Setup UI
    this.setupUI();

    // 5. Lancer la boucle de rendu
    this.startGameLoop();

    // Créer le canvas des particules
    if (window.particleSystem) {
      window.particleSystem.createCanvas();
      console.log('✨ Canvas particules créé');
    }

    console.log('✅ Jeu initialisé');
  }

  generateDungeon() {
    console.log('🏰 Génération du donjon...');

    // Générer avec l'état actuel du joueur
    const dungeonResult = this.dungeonSystem.generate(this.currentPlayer);

    // Stocker le résultat
    this.dungeon = dungeonResult;
    this.decisions = dungeonResult.decisions;

    // Reset position
    this.currentTileIndex = 0;
    this.currentPlayer.position = 0;

    console.log(`✅ Donjon généré: ${this.dungeon.path.length} cases`);
    console.log(`  Décisions:`, this.decisions);
  }

  // ═══════════════════════════════════════════════════════════════
  // UI SETUP
  // ═══════════════════════════════════════════════════════════════
  
  setupUI() {
    // Bouton dé
    const rollBtn = document.getElementById('rollBtn');
    if (rollBtn) {
      rollBtn.addEventListener('click', () => this.handleDiceRoll());
    }

    // Contrôles de caméra
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const recenterBtn = document.getElementById('recenterBtn');
    
    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', () => this.zoomIn());
    }
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', () => this.zoomOut());
    }
    if (recenterBtn) {
      recenterBtn.addEventListener('click', () => this.recenterCamera());
    }

    // Contrôles audio
    const soundToggleBtn = document.getElementById('soundToggleBtn');
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    
    if (soundToggleBtn) {
      soundToggleBtn.addEventListener('click', () => this.toggleSound());
    }
    if (musicToggleBtn) {
      musicToggleBtn.addEventListener('click', () => this.toggleMusic());
    }

    // Mettre à jour l'UI
    this.updateUI();
  }

  updateUI() {
    // Héro
    const heroName = document.getElementById('heroName');
    const heroClass = document.getElementById('heroClass');
    const heroIcon = document.getElementById('heroIcon');
    const heroHP = document.getElementById('heroHP');
    const heroHPBar = document.getElementById('heroHPBar');
    const heroXP = document.getElementById('heroXP');
    const heroXPBar = document.getElementById('heroXPBar');
    const heroATK = document.getElementById('heroATK');
    const heroDEF = document.getElementById('heroDEF');
    const heroGold = document.getElementById('heroGold');
    const heroPosition = document.getElementById('heroPosition');
    const levelBadge = document.getElementById('levelBadgeCenter');

    if (heroName) heroName.textContent = this.currentPlayer.name;
    if (heroClass) heroClass.textContent = this.currentPlayer.className;
    if (heroIcon) heroIcon.textContent = this.currentPlayer.icon;
    if (heroHP) heroHP.textContent = `${this.currentPlayer.hp}/${this.currentPlayer.maxHp}`;
    if (heroHPBar) {
      const hpPercent = (this.currentPlayer.hp / this.currentPlayer.maxHp) * 100;
      heroHPBar.style.width = `${hpPercent}%`;
    }
    if (heroXP) heroXP.textContent = `${this.currentPlayer.xp}/${this.currentPlayer.xpToNextLevel}`;
    if (heroXPBar) {
      const xpPercent = (this.currentPlayer.xp / this.currentPlayer.xpToNextLevel) * 100;
      heroXPBar.style.width = `${xpPercent}%`;
    }
    if (heroATK) heroATK.textContent = this.currentPlayer.atk;
    if (heroDEF) heroDEF.textContent = this.currentPlayer.def;
    if (heroGold) heroGold.textContent = this.currentPlayer.gold;
    if (levelBadge) levelBadge.textContent = `Niv. ${this.currentPlayer.level}`;

    // Position
    const actualPath = this.renderer.organicPath || this.dungeon.path;
    if (heroPosition) {
      heroPosition.textContent = `${this.currentTileIndex + 1} / ${actualPath.length}`;
    }

    // Inventaire
    this.updateInventoryUI();
  }

  updateInventoryUI() {
    const invGrid = document.getElementById('inventoryGrid');
    if (!invGrid) return;

    invGrid.innerHTML = '';
    
    // Récupérer les items depuis l'inventaire
    const items = this.currentPlayer.inventory?.items || [];
    const maxSlots = this.currentPlayer.inventory?.maxSlots || 6;
    
    // Afficher items
    for (let i = 0; i < maxSlots; i++) {
      const slot = document.createElement('div');
      slot.className = 'inv-slot';
      
      if (i < items.length) {
        const item = items[i];
        slot.innerHTML = `
          <div class="item-icon">${item.icon || '📦'}</div>
          <div class="item-name">${item.name}</div>
        `;
        slot.onclick = () => this.inspectItem(item);
      } else {
        slot.classList.add('empty');
      }
      
      invGrid.appendChild(slot);
    }
  }

  inspectItem(item) {
    // TODO: Implémenter modal d'inspection
    console.log('📦 Inspecter:', item);
  }

  // ═══════════════════════════════════════════════════════════════
  // GAME LOOP
  // ═══════════════════════════════════════════════════════════════
  
  startGameLoop() {
    const gameLoop = () => {
      this.update();
      this.render();
      requestAnimationFrame(gameLoop);
    };
    
    requestAnimationFrame(gameLoop);
    console.log('▶️ Game loop démarré');
  }

  update() {
    // Calcul FPS
    const now = performance.now();
    const deltaTime = now - this.lastFrameTime;
    this.frameCount++;
    
    if (deltaTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / deltaTime);
      this.frameCount = 0;
      this.lastFrameTime = now;
      
      // Afficher FPS
      const fpsDisplay = document.getElementById('fpsDisplay');
      const frameTimeDisplay = document.getElementById('frameTimeDisplay');
      if (fpsDisplay) {
        fpsDisplay.textContent = `FPS: ${this.fps}`;
        fpsDisplay.style.color = this.fps >= 50 ? '#0f0' : (this.fps >= 30 ? '#ff0' : '#f00');
      }
      if (frameTimeDisplay) {
        frameTimeDisplay.textContent = `Frame: ${deltaTime.toFixed(2)} ms`;
      }
    }
  }

  render() {
    // Transmettre l'index actuel du joueur pour le culling
    this.renderer.currentPlayerIndex = this.currentTileIndex;
    this.renderer.render(
      this.dungeon,
      this.currentPlayer,
      this.dungeonSystem.nodes
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // DICE & MOVEMENT
  // ═══════════════════════════════════════════════════════════════
  
  async handleDiceRoll() {
    if (this.isRolling) return;
    
    this.isRolling = true;
    console.log('🎲 Lancer du Dé du Destin...');
    
    // Lancer musique au premier lancer
    if (!this.musicStarted && typeof AUDIO !== 'undefined') {
      AUDIO.playMusic('game');
      this.musicStarted = true;
    }
    
    // Lancer le Dé du Destin avec animation
    let roll;
    if (window.DiceSystem) {
      // Synchroniser corruption
      if (this.currentPlayer.corruption !== undefined) {
        window.DiceSystem.corruption = this.currentPlayer.corruption;
      }
      roll = await window.DiceSystem.roll();
    } else {
      // Fallback si DiceSystem indisponible
      roll = Math.floor(Math.random() * 6) + 1;
    }
    
    // Appliquer buffs passifs
    let modifiedRoll = roll;
    if (typeof PassiveBuffsSystem !== 'undefined') {
      modifiedRoll = PassiveBuffsSystem.modifyDiceRoll(roll, this.currentPlayer);
    }
    
    console.log(`💀 Dé du Destin: ${roll} → Final: ${modifiedRoll}`);
    
    // Les particules sont déjà gérées automatiquement par DiceSystem.roll()
    // via visualSystem.playFullAnimation() dans dice-destiny-core.js
    
    // Déplacer le joueur
    await this.movePlayer(modifiedRoll);
    
    // Vérifier événements
    await this.checkForEvents();
    
    this.isRolling = false;
  }

  async movePlayer(steps) {
    // Utiliser le path réel du générateur linéaire
    const actualPath = this.renderer.organicPath || this.dungeon.path;
    
    for (let i = 0; i < steps; i++) {
      if (this.currentTileIndex >= actualPath.length - 1) {
        console.log('🏁 Fin du donjon atteinte!');
        this.showEndScreen();
        break;
      }

      this.currentTileIndex++;
      this.currentPlayer.position = this.currentTileIndex;

      // Animation de mouvement
      this.renderer.shake(2);

      // Mettre à jour UI
      this.updateUI();

      await delay(300);
    }
  }

  async checkForEvents() {
    // Récupérer la tuile actuelle
    const actualPath = this.renderer.organicPath || this.dungeon.path;
    const currentTile = actualPath[this.currentTileIndex];
    
    if (!currentTile) return;
    
    // Vérifier si on est sur un Nœud de Destin
    const node = this.dungeonSystem.nodes.find(n => n.position === this.currentTileIndex);
    if (node) {
      console.log(`🔀 Nœud de Destin atteint: ${node.name}`);
      this.addToLog(`🔀 ${node.name}`, '🔀');
      await this.showNodeReveal(node);
      return;
    }
    
    // Déléguer au système Events global si dispo
    if (typeof Events !== 'undefined' && Events.handleTile && currentTile.type) {
      console.log('🎯 Événement tile:', currentTile.type);
      Events.handleTile(this.currentPlayer, currentTile, this);
    }
  }

  async showNodeReveal(node) {
    // TODO: Implémenter modal de révélation de nœud
    console.log('📜 Révélation du nœud:', node);
    
    // Utiliser les modales existantes du système
    if (typeof showInfoModal === 'function') {
      showInfoModal(node.name, node.description || 'Un choix s\'offre à vous...');
    }
  }

  showEndScreen() {
    // TODO: Implémenter écran de fin
    alert('🏁 Vous avez atteint la sortie du donjon!');
  }

  // ═══════════════════════════════════════════════════════════════
  // MÉTHODES COMPATIBILITÉ (appelées par autres scripts)
  // ═══════════════════════════════════════════════════════════════
  
  addToLog(text, icon = '⚡') {
    const eventLog = document.getElementById('eventLog');
    if (!eventLog) return;
    
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `
      <span class="log-icon">${icon}</span>
      <span class="log-text">${text}</span>
    `;
    eventLog.insertBefore(entry, eventLog.firstChild);
    
    // Limiter à 50 entrées
    while (eventLog.children.length > 50) {
      eventLog.removeChild(eventLog.lastChild);
    }
  }

  addGold(amount) {
    this.currentPlayer.gold += amount;
    this.updateUI();
    this.addToLog(`+${amount} 💰 Or`, '💰');
  }

  addXP(amount) {
    this.currentPlayer.xp += amount;
    
    // Level up check
    while (this.currentPlayer.xp >= this.currentPlayer.xpToNextLevel) {
      this.levelUp();
    }
    
    this.updateUI();
    this.addToLog(`+${amount} ⭐ XP`, '⭐');
  }

  levelUp() {
    this.currentPlayer.level++;
    this.currentPlayer.xp -= this.currentPlayer.xpToNextLevel;
    this.currentPlayer.xpToNextLevel = Math.floor(this.currentPlayer.xpToNextLevel * 1.5);
    
    // Augmenter stats
    this.currentPlayer.maxHp += 10;
    this.currentPlayer.hp = this.currentPlayer.maxHp;
    this.currentPlayer.atk += 2;
    this.currentPlayer.def += 1;
    
    this.addToLog(`🎉 Niveau ${this.currentPlayer.level} atteint !`, '🎉');
  }

  takeDamage(amount) {
    this.currentPlayer.hp = Math.max(0, this.currentPlayer.hp - amount);
    this.updateUI();
    
    if (this.currentPlayer.hp <= 0) {
      this.gameOver();
    }
  }

  heal(amount) {
    this.currentPlayer.hp = Math.min(this.currentPlayer.maxHp, this.currentPlayer.hp + amount);
    this.updateUI();
    this.addToLog(`+${amount} ❤️ HP`, '❤️');
  }

  gameOver() {
    alert('💀 Vous êtes mort... Retour au camp.');
    window.location.href = 'camp.html';
  }

  showSkillTree() {
    // TODO: Implémenter arbre de compétences
    console.log('🌟 Arbre de compétences');
  }

  // ═══════════════════════════════════════════════════════════════
  // CONTRÔLES CAMERA & AUDIO
  // ═══════════════════════════════════════════════════════════════

  zoomIn() {
    if (!this.renderer) return;
    
    const currentScale = this.renderer.config.scale || 1.0;
    const newScale = Math.min(currentScale + 0.1, 2.0); // Max 200%
    this.renderer.config.scale = newScale;
    
    this.updateZoomIndicator();
    this.addToLog('🔍 Zoom +', '🔍');
  }

  zoomOut() {
    if (!this.renderer) return;
    
    const currentScale = this.renderer.config.scale || 1.0;
    const newScale = Math.max(currentScale - 0.1, 0.5); // Min 50%
    this.renderer.config.scale = newScale;
    
    this.updateZoomIndicator();
    this.addToLog('🔍 Zoom -', '🔍');
  }

  updateZoomIndicator() {
    const indicator = document.getElementById('zoomIndicator');
    if (!indicator || !this.renderer) return;
    
    const scale = this.renderer.config.scale || 1.0;
    const percentage = Math.round(scale * 100);
    indicator.textContent = `${percentage}%`;
  }

  recenterCamera() {
    if (!this.renderer || !this.dungeon) return;
    
    // Recentrer sur la position actuelle du joueur
    this.renderer.centerCameraOn(this.currentTileIndex, this.dungeon);
    
    // Force une mise à jour immédiate
    this.renderer.camera.x = this.renderer.camera.targetX;
    this.renderer.camera.y = this.renderer.camera.targetY;
    
    this.addToLog(`🎯 Caméra recentrée sur ${this.currentPlayer.name}`, '🎯');
  }

  toggleSound() {
    if (typeof AUDIO === 'undefined') return;
    
    const enabled = AUDIO.toggle();
    const btn = document.getElementById('soundToggleBtn');
    const icon = document.getElementById('soundIcon');
    
    if (!btn || !icon) return;
    
    if (enabled) {
      icon.textContent = '🔊';
      btn.title = 'Son activé';
      AUDIO.playNotification && AUDIO.playNotification();
      this.addToLog('🔊 Son activé', '🔊');
    } else {
      icon.textContent = '🔇';
      btn.title = 'Son désactivé';
      this.addToLog('🔇 Son désactivé', '🔇');
    }
  }

  toggleMusic() {
    if (typeof AUDIO === 'undefined') return;
    
    const enabled = AUDIO.toggleMusic();
    const btn = document.getElementById('musicToggleBtn');
    const icon = document.getElementById('musicIcon');
    
    if (!btn || !icon) return;
    
    if (enabled) {
      icon.textContent = '🎵';
      btn.title = 'Musique activée';
      if (!this.musicStarted) {
        AUDIO.playMusic && AUDIO.playMusic('game');
        this.musicStarted = true;
      }
      this.addToLog('🎵 Musique activée', '🎵');
    } else {
      icon.textContent = '🔇';
      btn.title = 'Musique désactivée';
      this.addToLog('🔇 Musique désactivée', '🔇');
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// INITIALISATION
// ═══════════════════════════════════════════════════════════════

window.addEventListener('DOMContentLoaded', async () => {
  console.log('🎮 Chargement du jeu...');
  
  const game = new GameIsometric();
  await game.init();
  
  console.log('✅ Jeu chargé et prêt !');
});
