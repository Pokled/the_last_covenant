/**
 * 🎮 GAME TEST - Version Isométrique avec Nœuds de Destin
 * THE LAST COVENANT
 *
 * Système de jeu complet utilisant :
 * - IsometricRenderer (rendu 2.5D lugubre)
 * - NodeBasedDungeon (génération avec Nœuds de Destin)
 */

class GameTest {
  constructor() {
    // Systèmes
    this.renderer = null;
    this.dungeonSystem = null;
    this.dungeon = null;

    // État du joueur
    this.player = {
      name: 'Le Pactisé',
      icon: '🧙',
      position: 0,
      hp: 100,
      maxHp: 100,
      corruption: 0,
      momentum: 0,
      pactsSigned: 0,
      diceStage: 1,
      inventory: { items: [] }
    };

    // État du jeu
    this.currentTileIndex = 0;
    this.isMoving = false;
    this.isPaused = false;
    this.decisions = [];

    // Animation
    this.animationFrame = null;
    
    // FPS Tracking
    this.lastFrameTime = performance.now();
    this.fps = 0;
    this.frameCount = 0;
    this.fpsUpdateTime = performance.now();

    console.log('🎮 GameTest initialisé');
  }

  // ═══════════════════════════════════════════════════════════════
  // INITIALISATION
  // ═══════════════════════════════════════════════════════════════

  init() {
    console.log('🎮 Initialisation du jeu...');

    // 1. Initialiser le renderer
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

    console.log('✅ Jeu initialisé');
  }

  generateDungeon() {
    console.log('🏰 Génération du donjon...');

    // Générer avec l'état actuel du joueur
    const dungeonResult = this.dungeonSystem.generate(this.player);

    // Stocker le résultat
    this.dungeon = dungeonResult;
    this.decisions = dungeonResult.decisions;

    // Reset position
    this.currentTileIndex = 0;
    this.player.position = 0;

    console.log(`✅ Donjon généré: ${this.dungeon.path.length} cases`);
    console.log(`  Décisions:`, this.decisions);
    console.log(`  Chemins fantômes:`, this.dungeon.phantomPaths);
  }

  // ═══════════════════════════════════════════════════════════════
  // UI
  // ═══════════════════════════════════════════════════════════════

  setupUI() {
    // Bouton lancer dé
    const rollBtn = document.getElementById('rollBtn');
    if (rollBtn) {
      rollBtn.onclick = () => this.rollDice();
    }

    // Bouton régénérer donjon
    const regenBtn = document.getElementById('regenBtn');
    if (regenBtn) {
      regenBtn.onclick = () => {
        this.generateDungeon();
        this.updateUI();
      };
    }

    // Sliders de stats (pour tester)
    const corruptionSlider = document.getElementById('corruptionSlider');
    if (corruptionSlider) {
      corruptionSlider.value = this.player.corruption;
      corruptionSlider.oninput = (e) => {
        this.player.corruption = parseInt(e.target.value);
        this.updateUI();
      };
    }

    const hpSlider = document.getElementById('hpSlider');
    if (hpSlider) {
      hpSlider.value = this.player.hp;
      hpSlider.oninput = (e) => {
        this.player.hp = parseInt(e.target.value);
        this.updateUI();
      };
    }

    // Update UI initial
    this.updateUI();
  }

  updateUI() {
    // Joueur stats
    const hpDisplay = document.getElementById('hpDisplay');
    if (hpDisplay) {
      hpDisplay.textContent = `${this.player.hp} / ${this.player.maxHp}`;
    }

    const corruptionDisplay = document.getElementById('corruptionDisplay');
    if (corruptionDisplay) {
      corruptionDisplay.textContent = `${this.player.corruption}%`;
    }

    const momentumDisplay = document.getElementById('momentumDisplay');
    if (momentumDisplay) {
      momentumDisplay.textContent = `${this.player.momentum} / 3`;
    }

    const positionDisplay = document.getElementById('positionDisplay');
    if (positionDisplay) {
      const actualPath = this.renderer.organicPath || this.dungeon.path;
      positionDisplay.textContent = `${this.currentTileIndex + 1} / ${actualPath.length}`;
    }

    // Tile actuelle
    const currentTile = this.dungeon.path[this.currentTileIndex];
    const tileInfo = document.getElementById('tileInfo');
    if (tileInfo && currentTile) {
      tileInfo.innerHTML = `
        <div class="tile-name">${currentTile.name || 'Case ' + (this.currentTileIndex + 1)}</div>
        <div class="tile-type">${currentTile.type}</div>
        ${currentTile.description ? `<div class="tile-desc">${currentTile.description}</div>` : ''}
      `;
    }

    // Chemins fantômes
    const phantomList = document.getElementById('phantomList');
    if (phantomList) {
      if (this.dungeon.phantomPaths && this.dungeon.phantomPaths.length > 0) {
        phantomList.innerHTML = this.dungeon.phantomPaths.map(p => `
          <div class="phantom-item">👻 ${p.name}</div>
        `).join('');
      } else {
        phantomList.innerHTML = '<div class="phantom-none">Aucun chemin fantôme débloqué</div>';
      }
    }

    // Log des décisions
    const decisionLog = document.getElementById('decisionLog');
    if (decisionLog) {
      decisionLog.innerHTML = this.decisions.map((d, i) => `
        <div class="decision-item">
          <strong>${d.nodeName}</strong><br>
          ${d.reason}
        </div>
      `).join('');
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // GAME LOOP
  // ═══════════════════════════════════════════════════════════════

  startGameLoop() {
    const loop = () => {
      if (!this.isPaused) {
        this.render();
      }
      this.animationFrame = requestAnimationFrame(loop);
    };

    loop();
    console.log('▶️ Game loop démarré');
  }

  render() {
    // Calcul FPS
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;
    
    this.frameCount++;
    
    // Mettre à jour FPS chaque seconde
    if (currentTime - this.fpsUpdateTime >= 1000) {
      this.fps = Math.round(this.frameCount / ((currentTime - this.fpsUpdateTime) / 1000));
      this.frameCount = 0;
      this.fpsUpdateTime = currentTime;
      
      // Afficher FPS
      const fpsDisplay = document.getElementById('fpsDisplay');
      const frameTimeDisplay = document.getElementById('frameTime');
      if (fpsDisplay) {
        fpsDisplay.textContent = `FPS: ${this.fps}`;
        fpsDisplay.style.color = this.fps >= 50 ? '#0f0' : (this.fps >= 30 ? '#ff0' : '#f00');
      }
      if (frameTimeDisplay) {
        frameTimeDisplay.textContent = `Frame: ${deltaTime.toFixed(2)} ms`;
      }
    }
    
    // Render le donjon avec le renderer isométrique
    // Transmettre l'index actuel du joueur pour le culling
    this.renderer.currentPlayerIndex = this.currentTileIndex;
    this.renderer.render(
      this.dungeon,
      this.player,
      this.dungeonSystem.nodes // Passer les Nœuds pour les afficher
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // ACTIONS
  // ═══════════════════════════════════════════════════════════════

  async rollDice() {
    if (this.isMoving) return;

    console.log('🎲 Lancer du dé...');

    this.isMoving = true;

    // Lancer un dé simple (1-6)
    const roll = 1 + Math.floor(Math.random() * 6);
    console.log(`  Résultat: ${roll}`);

    // Afficher le résultat
    this.showDiceResult(roll);

    // Attendre 1s
    await this.delay(1000);

    // Déplacer le joueur
    await this.movePlayer(roll);

    // Vérifier si on est sur un Nœud
    await this.checkForNode();

    // Update UI
    this.updateUI();

    this.isMoving = false;
  }

  async movePlayer(steps) {
    // Utiliser le path réel du générateur linéaire (pas celui de NodeBasedDungeon)
    const actualPath = this.renderer.organicPath || this.dungeon.path;
    
    for (let i = 0; i < steps; i++) {
      if (this.currentTileIndex >= actualPath.length - 1) {
        console.log('🏁 Fin du donjon atteinte!');
        this.showEndScreen();
        break;
      }

      this.currentTileIndex++;
      this.player.position = this.currentTileIndex;

      // Animation de mouvement
      this.renderer.shake(2);

      // Son de pas (placeholder)
      // TODO: Ajouter son

      await this.delay(300);
    }
  }

  async checkForNode() {
    const currentTile = this.dungeon.path[this.currentTileIndex];

    // Vérifier si on est sur un Nœud de Destin
    const node = this.dungeonSystem.nodes.find(n => n.position === this.currentTileIndex);

    if (node) {
      console.log(`🔀 Nœud de Destin atteint: ${node.name}`);
      await this.showNodeRevealModal(node);
    }
  }

  async showNodeRevealModal(node) {
    const viz = this.dungeonSystem.getNodeVisualization(node.id, this.player);

    // Créer modal
    const modal = document.createElement('div');
    modal.className = 'node-reveal-modal';
    modal.innerHTML = `
      <div class="node-reveal-content">
        <h2 class="node-name fade-in">${viz.name}</h2>
        <p class="node-desc fade-in delay-1">${viz.description}</p>

        <div class="player-state fade-in delay-2">
          <div>❤️ HP: ${this.player.hp}/${this.player.maxHp}</div>
          <div>💀 Corruption: ${this.player.corruption}%</div>
          <div>⚡ Momentum: ${this.player.momentum}/3</div>
        </div>

        <div class="revelation">
          <p class="revelation-text fade-in delay-3">"Le chemin se révèle..."</p>

          <div class="active-path fade-in delay-4" style="border-color: ${viz.paths.find(p => p.isActive).color}">
            <div class="path-icon">${viz.paths.find(p => p.isActive).icon}</div>
            <div class="path-name">${viz.paths.find(p => p.isActive).name}</div>
            <div class="path-reason">${viz.reason}</div>
          </div>
        </div>

        <button class="btn-continue fade-in delay-5" id="closeNodeModal">
          Continuer
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    // Shake caméra
    this.renderer.shake(10);

    // Attendre clic
    await new Promise(resolve => {
      document.getElementById('closeNodeModal').onclick = () => {
        modal.remove();
        resolve();
      };
    });
  }

  showDiceResult(result) {
    const resultEl = document.getElementById('diceResult');
    if (resultEl) {
      resultEl.textContent = result;
      resultEl.classList.add('show');

      setTimeout(() => {
        resultEl.classList.remove('show');
      }, 1500);
    }
  }

  showEndScreen() {
    const endModal = document.createElement('div');
    endModal.className = 'end-modal';
    endModal.innerHTML = `
      <div class="end-content">
        <h1>🏁 Donjon Terminé !</h1>
        <p>Tu as survécu au donjon des damnés.</p>
        <div class="end-stats">
          <div>HP Final: ${this.player.hp}/${this.player.maxHp}</div>
          <div>Corruption: ${this.player.corruption}%</div>
          <div>Cases Parcourues: ${this.currentTileIndex + 1}</div>
        </div>
        <button class="btn" onclick="location.reload()">Recommencer</button>
      </div>
    `;
    document.body.appendChild(endModal);
  }

  // ═══════════════════════════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════════════════════════

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }

  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}

// Auto-init au chargement
window.addEventListener('load', () => {
  console.log('🎮 Chargement du jeu...');

  // Vérifier que les dépendances sont chargées
  if (!window.IsometricRenderer) {
    console.error('❌ IsometricRenderer non trouvé !');
    return;
  }

  if (!window.NodeBasedDungeon) {
    console.error('❌ NodeBasedDungeon non trouvé !');
    return;
  }

  // Créer et initialiser le jeu
  window.game = new GameTest();
  window.game.init();

  console.log('✅ Jeu chargé et prêt !');
});
