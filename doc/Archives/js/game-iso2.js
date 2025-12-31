console.log('🎮 Chargement du jeu isométrique 2D optimisé...');

// Charger données joueur
let playerData = JSON.parse(localStorage.getItem('tlc_player') || '{}');
if (!playerData.name) {
  playerData = JSON.parse(sessionStorage.getItem('player') || '{}');
}
if (!playerData.name) {
  alert('Aucun joueur trouvé ! Retourne au Camp pour commencer une partie.');
  window.location.href = 'camp.html';
}

class GameIsometric2D {
  constructor() {
    this.renderer = null;
    this.dungeonSystem = null;
    this.dungeonGenerator = null;
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
    
    // Position grille joueur
    this.playerGridX = 0;
    this.playerGridY = 0;
  }

  async init() {
    console.log('🎮 Initialisation du jeu 2D iso...');

    window.game = this;

    // Créer joueur
    let cls = playerData.classData;
    if (!cls && window.CLASSES && playerData.class) {
      cls = CLASSES[playerData.class];
    }
    if (!cls) {
      console.error('❌ Données de classe manquantes');
      alert('Erreur: Données de classe manquantes ! Retour au camp...');
      window.location.href = 'camp.html';
      return;
    }

    this.currentPlayer = {
      id: playerData.id || 'player_1',
      name: playerData.name,
      sprite: playerData.sprite || '🧙',
      icon: playerData.sprite || '🧙',
      class: playerData.class || cls.id,
      className: cls.name,
      hp: playerData.hp || cls.baseStats.hp,
      maxHp: playerData.maxHp || cls.baseStats.hp,
      atk: playerData.atk || cls.baseStats.atk,
      def: playerData.def || cls.baseStats.def,
      level: playerData.level || 1,
      xp: playerData.xp || 0,
      xpToNextLevel: 100,
      gold: playerData.gold || 0,
      position: 0,
      corruption: playerData.corruption || 0,
      momentum: 0,
      pactsSigned: 0,
      diceStage: 1,
      inventory: playerData.inventory || {
        items: [],
        maxSlots: 10,
        equipped: { weapon: null, armor: null, accessory: null }
      },
      companions: playerData.companions || [],
      skills: playerData.skills || [],
      passiveBuffs: playerData.passiveBuffs || []
    };

    console.log('✅ Joueur créé:', this.currentPlayer.name);

    // 1. Renderer 2D iso
    this.renderer = new IsometricRenderer2D('game-canvas');

    // 2. Système de donjon
    this.dungeonSystem = new NodeBasedDungeon();

    // 3. Générer donjon
    this.generateDungeon();

    // 4. Setup UI
    this.setupUI();

    // 5. Game loop
    this.startGameLoop();

    // Particules
    if (window.particleSystem) {
      window.particleSystem.createCanvas();
      console.log('✨ Canvas particules créé');
    }

    console.log('✅ Jeu 2D iso initialisé');
  }

  generateDungeon() {
    console.log('🏰 Génération du donjon 2D...');

    // Générer path logique
    const dungeonResult = this.dungeonSystem.generate(this.currentPlayer);
    this.dungeon = dungeonResult;
    this.decisions = dungeonResult.decisions;
    this.currentTileIndex = 0;
    this.currentPlayer.position = 0;

    console.log(`✅ Donjon généré: ${this.dungeon.path.length} cases`);
    console.log('  Décisions:', this.decisions);

    // Générer grille 2D avec le générateur linéaire
    setTimeout(() => {
      this.dungeonGenerator = new LinearDungeonGenerator();
      const dungeonData = this.dungeonGenerator.generate(this.dungeon.path.length);
      
      // Charger dans le renderer
      this.renderer.loadDungeon(dungeonData);
      
      // Position initiale joueur = entrée
      const entrance = dungeonData.entrance;
      if (entrance) {
        this.playerGridX = entrance.x;
        this.playerGridY = entrance.y;
        this.renderer.centerCameraOn(this.playerGridX, this.playerGridY);
      }
      
      console.log(`🎮 Donjon 2D prêt : ${dungeonData.path.length} cases`);
    }, 100);
  }

  setupUI() {
    // Bouton dé
    const diceBtn = document.getElementById('dice-btn-main');
    if (diceBtn) {
      diceBtn.addEventListener('click', () => this.handleDiceRoll());
    }

    // Bouton inventaire
    const invBtn = document.getElementById('inventory-btn-main');
    if (invBtn) {
      invBtn.addEventListener('click', () => this.toggleInventory());
    }

    // Raccourcis clavier
    document.addEventListener('keydown', (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        this.handleDiceRoll();
      } else if (e.key === 'i' || e.key === 'I') {
        this.toggleInventory();
      }
    });

    console.log('✅ UI initialisée');
  }

  async handleDiceRoll() {
    if (this.isRolling) return;
    
    // Musique
    if (!this.musicStarted && window.audioManager) {
      window.audioManager.playMusic('game');
      this.musicStarted = true;
    }

    this.isRolling = true;
    console.log('🎲 Lancer du Dé du Destin...');

    try {
      // Lancer le dé système
      const result = await window.DiceSystem.roll(this.currentPlayer);
      
      console.log(`💀 Dé du Destin: ${result.baseRoll} → Final: ${result.finalRoll}`);

      // Particules
      if (window.DiceVisualSystem) {
        window.DiceVisualSystem.createDiceParticles(result.finalRoll);
        console.log(`✨ Particules créées pour dé: ${result.finalRoll}`);
      }

      // Avancer
      await this.movePlayer(result.finalRoll);

    } catch (error) {
      console.error('❌ Erreur lancer dé:', error);
    } finally {
      this.isRolling = false;
    }
  }

  async movePlayer(steps) {
    console.log(`🚶 Déplacement de ${steps} cases...`);

    for (let i = 0; i < steps && this.currentTileIndex < this.dungeon.path.length - 1; i++) {
      this.currentTileIndex++;
      this.currentPlayer.position = this.currentTileIndex;

      // Mettre à jour position grille
      // Simplification: avancer dans le path du générateur
      if (this.dungeonGenerator && this.dungeonGenerator.path[this.currentTileIndex]) {
        const pathCell = this.dungeonGenerator.path[this.currentTileIndex];
        this.playerGridX = pathCell.x;
        this.playerGridY = pathCell.y;
        
        // Centrer caméra
        this.renderer.centerCameraOn(this.playerGridX, this.playerGridY);
      }

      await this.delay(300);

      // Vérifier événements
      this.checkEvents();
    }

    // Arrivée ?
    if (this.currentTileIndex >= this.dungeon.path.length - 1) {
      console.log('🏆 Arrivée à la sortie !');
      this.handleVictory();
    }
  }

  checkEvents() {
    const tile = this.dungeon.path[this.currentTileIndex];
    if (!tile) return;

    // Nœud de destin
    const decision = this.decisions.find(d => d.position === this.currentTileIndex);
    if (decision && !decision.chosen) {
      console.log(`🔀 Nœud de Destin atteint: ${decision.icon} ${decision.title}`);
      this.handleDecisionNode(decision);
      return;
    }

    // Événement aléatoire
    if (tile.event && !tile.eventTriggered) {
      console.log(`⚡ Événement: ${tile.event.type}`);
      this.triggerEvent(tile);
    }
  }

  handleDecisionNode(decision) {
    // Afficher modal choix
    if (window.eventModals) {
      window.eventModals.showDestinyNode(decision, this.currentPlayer, (choice) => {
        decision.chosen = choice;
        console.log(`✅ Choix fait: ${choice.title}`);
      });
    }
  }

  triggerEvent(tile) {
    tile.eventTriggered = true;
    
    if (tile.event.type === 'combat') {
      this.startCombat(tile.event.enemy);
    } else if (tile.event.type === 'treasure') {
      this.showTreasure();
    } else if (tile.event.type === 'rest') {
      this.showRest();
    } else if (tile.event.type === 'merchant') {
      this.showMerchant();
    }
  }

  startCombat(enemy) {
    if (window.tacticalCombat) {
      window.tacticalCombat.startCombat(this.currentPlayer, enemy);
    }
  }

  showTreasure() {
    if (window.eventModals) {
      window.eventModals.showTreasureModal(this.currentPlayer);
    }
  }

  showRest() {
    if (window.eventModals) {
      window.eventModals.showRestModal(this.currentPlayer);
    }
  }

  showMerchant() {
    if (window.eventModals) {
      window.eventModals.showMerchantModal(this.currentPlayer);
    }
  }

  handleVictory() {
    alert('🏆 Victoire ! Tu as terminé le donjon !');
    // TODO: Écran de victoire
  }

  toggleInventory() {
    console.log('🎒 Toggle inventaire');
    if (window.inventorySystem) {
      window.inventorySystem.toggle();
    }
  }

  startGameLoop() {
    const gameLoop = () => {
      // Calcul FPS
      const now = performance.now();
      const deltaTime = now - this.lastFrameTime;
      this.frameCount++;

      if (deltaTime >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / deltaTime);
        this.frameCount = 0;
        this.lastFrameTime = now;

        // Afficher FPS
        const fpsCounter = document.getElementById('fps-counter');
        if (fpsCounter) {
          fpsCounter.textContent = `FPS: ${this.fps}`;
          fpsCounter.style.color = this.fps >= 50 ? '#00ff00' : (this.fps >= 30 ? '#ffff00' : '#ff0000');
        }
      }

      // Rendu
      this.renderer.render(this.playerGridX, this.playerGridY);

      requestAnimationFrame(gameLoop);
    };

    requestAnimationFrame(gameLoop);
    console.log('▶️ Game loop démarré');
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Démarrer le jeu
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎮 Chargement du jeu 2D iso...');
  
  const game = new GameIsometric2D();
  game.init().catch(err => {
    console.error('❌ Erreur initialisation:', err);
    alert('Erreur lors du chargement du jeu. Retour au camp...');
    window.location.href = 'camp.html';
  });
  
  console.log('✅ Jeu 2D iso chargé et prêt !');
});
