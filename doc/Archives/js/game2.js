/**
 * 🎮 GAME 2 - VERSION OPTIMISÉE 2D ISOMÉTRIQUE
 * Utilise le renderer 2D au lieu des cubes 3D
 */

console.log('🎮 Chargement du jeu 2 (version 2D iso optimisée)...');

class Game2 {
  constructor() {
    console.log('🎮 Game2 initialisé');
    
    this.player = null;
    this.renderer = null;
    this.dungeon = null;
    this.dungeonData = null;
    
    // FPS
    this.lastTime = performance.now();
    this.frameCount = 0;
    this.fps = 60;
  }
  
  async init() {
    console.log('🎮 Initialisation du jeu 2...');
    
    // Créer joueur
    const playerName = localStorage.getItem('playerName') || 'Aventurier';
    const playerClass = localStorage.getItem('playerClass') || 'BLOODBOUND';
    
    this.player = this.createPlayer(playerName, playerClass);
    console.log('✅ Joueur créé:', this.player.name);
    
    // Initialiser renderer
    this.renderer = new IsometricRenderer2D('game-canvas');
    
    // Initialiser générateur de donjon
    this.dungeon = new NodeBasedDungeon();
    
    // Générer donjon
    console.log('🏰 Génération du donjon...');
    this.dungeonData = this.dungeon.generate(this.player);
    console.log('✅ Donjon généré:', this.dungeonData.path.length, 'cases');
    console.log('  Décisions:', this.dungeonData.decisions);
    
    // Générer version 2D avec générateur linéaire
    this.generate2DDungeon();
    
    // Setup UI
    this.setupUI();
    
    // Démarrer game loop
    this.startGameLoop();
    
    // Jouer musique
    if (window.AudioManager) {
      setTimeout(() => window.AudioManager.playMusic('game'), 500);
    }
    
    console.log('✅ Jeu 2 initialisé');
  }
  
  createPlayer(name, playerClass) {
    // Fallback si CLASSES n'est pas chargé
    if (!window.CLASSES) {
      console.warn('⚠️ CLASSES non chargé, utilisation valeurs par défaut');
      return {
        id: 'player_1',
        name: name,
        sprite: '🧙',
        icon: '🧙',
        class: 'BLOODBOUND',
        className: 'Sanguelié',
        hp: 130,
        maxHp: 130,
        atk: undefined,
        def: undefined,
        position: 0,
        corruption: 0,
        momentum: 0,
        gold: 50,
        inventory: { items: [], maxSlots: 12 },
        cartes: [],
        maxCartes: 8,
        pactsSigned: 0,
        diceStage: 1
      };
    }
    
    const classData = window.CLASSES[playerClass] || window.CLASSES.BLOODBOUND;
    
    return {
      id: 'player_1',
      name: name,
      sprite: classData.sprite || '🧙',
      icon: classData.sprite || '🧙',
      class: playerClass,
      className: classData.name || 'Sanguelié',
      hp: classData.baseHP || 130,
      maxHp: classData.baseHP || 130,
      atk: undefined,
      def: undefined,
      position: 0,
      corruption: 0,
      momentum: 0,
      gold: 50,
      inventory: { items: [], maxSlots: 12 },
      equipment: {},
      stats: { ...classData.baseStats },
      buffs: [],
      achievements: []
    };
  }
  
  generate2DDungeon() {
    console.log('🏰 Génération donjon 2D avec générateur linéaire...');
    
    const linearGen = new LinearDungeonGenerator(150, 150);
    const dungeon2D = linearGen.generate(this.dungeonData.path.length);
    
    console.log('✅ Donjon 2D généré:', dungeon2D.rooms.length, 'salles,', dungeon2D.path.length, 'cases');
    
    // Stocker le path
    this.path = dungeon2D.path;
    this.currentPathIndex = 0;
    
    // Charger dans le renderer
    this.renderer.loadDungeon(dungeon2D);
    
    // Centrer caméra sur entrée
    if (dungeon2D.entrance) {
      this.renderer.centerCameraOn(dungeon2D.entrance.x, dungeon2D.entrance.y);
    }
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
      invBtn.addEventListener('click', () => this.showInventory());
    }
    
    // Raccourcis clavier
    document.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        this.handleDiceRoll();
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        this.showInventory();
      }
    });
  }
  
  async handleDiceRoll() {
    console.log('🎲 Lancer du Dé du Destin...');
    
    if (!window.DiceSystem) {
      console.error('❌ DiceSystem non disponible');
      return;
    }
    
    try {
      // Lancer dé
      const result = await window.DiceSystem.rollDice();
      console.log('💀 Dé du Destin:', result.baseRoll, '→ Final:', result.finalRoll);
      
      // Particules
      if (window.DiceVisualSystem?.createDiceParticles) {
        console.log('🎆 Création particules pour dé:', result.finalRoll);
        window.DiceVisualSystem.createDiceParticles(result.finalRoll);
      }
      
      // Déplacer joueur
      this.movePlayer(result.finalRoll);
      
    } catch (error) {
      console.error('❌ Erreur lancer dé:', error);
    }
  }
  
  movePlayer(steps) {
    console.log(`🚶 Déplacement joueur: ${steps} cases`);
    
    const oldPos = this.player.position;
    this.player.position = Math.min(oldPos + steps, this.dungeonData.path.length - 1);
    
    console.log(`  Position: ${oldPos} → ${this.player.position}`);
    
    // Centrer caméra
    const pathData = this.dungeonData.path[this.player.position];
    if (pathData) {
      // TODO: Récupérer coordonnées 2D depuis le path
      // this.renderer.centerCameraOn(x, y);
    }
    
    // Vérifier événements
    this.checkEvents();
  }
  
  checkEvents() {
    const currentTile = this.dungeonData.path[this.player.position];
    
    // Nœud de destin
    const decision = this.dungeonData.decisions.find(d => d.position === this.player.position);
    if (decision) {
      console.log('🔀 Nœud de Destin atteint:', decision.node.icon, decision.node.name);
      // TODO: Afficher modal blood-pact
    }
    
    // Événement random
    if (currentTile?.event) {
      console.log('📜 Événement:', currentTile.event.type);
      this.triggerEvent(currentTile.event);
    }
    
    // Sortie
    if (this.player.position >= this.dungeonData.path.length - 1) {
      console.log('🏆 VICTOIRE ! Sortie atteinte !');
      // TODO: Écran victoire
    }
  }
  
  triggerEvent(event) {
    if (!window.EventModals) return;
    
    switch (event.type) {
      case 'combat':
        if (window.CombatSystem) {
          window.CombatSystem.startCombat(this.player, event.enemy);
        }
        break;
      case 'treasure':
        window.EventModals.showTreasureModal?.(event);
        break;
      case 'merchant':
        window.EventModals.showMerchantModal?.(event);
        break;
      case 'rest':
        window.EventModals.showRestModal?.();
        break;
      default:
        console.log('Événement non géré:', event.type);
    }
  }
  
  showInventory() {
    console.log('🎒 Ouverture inventaire');
    if (window.InventorySystem) {
      window.InventorySystem.show();
    }
  }
  
  startGameLoop() {
    console.log('▶️ Game loop démarré');
    this.gameLoop();
  }
  
  gameLoop() {
    // FPS
    const now = performance.now();
    const delta = now - this.lastTime;
    this.frameCount++;
    
    if (delta >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / delta);
      this.frameCount = 0;
      this.lastTime = now;
      
      const fpsEl = document.getElementById('fps-counter');
      if (fpsEl) {
        fpsEl.textContent = `FPS: ${this.fps}`;
        fpsEl.style.color = this.fps >= 50 ? '#00ff00' : this.fps >= 30 ? '#ffaa00' : '#ff0000';
      }
    }
    
    // Render
    // Render
    const playerPos = this.path[this.player.position];
    if (playerPos) {
      this.renderer.render(playerPos.x, playerPos.y);
    }
    
    requestAnimationFrame(() => this.gameLoop());
  }
}

// Démarrage auto
window.addEventListener('DOMContentLoaded', async () => {
  console.log('🎮 Chargement du jeu 2...');
  
  const game = new Game2();
  await game.init();
  
  console.log('✅ Jeu 2 chargé et prêt !');
});
