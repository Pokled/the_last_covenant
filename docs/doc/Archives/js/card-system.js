// ⚔️ COMBAT SYSTEM - THE LAST COVENANT
// Tactical Combat Modal System
// Darkest Dungeon inspired with Dice Manipulation

class CombatSystem {
  constructor(allies, enemies, environment = 'dungeon') {
    // Units
    this.allies = allies;    // [player, companion1, companion2, ...]
    this.enemies = enemies;  // [enemy1, enemy2, ...]
    this.environment = environment;
    
    // Combat state
    this.turnOrder = [];
    this.currentTurnIndex = 0;
    this.round = 1;
    this.combatActive = false;
    
    // Player input
    this.isPlayerTurn = false;
    this.selectedAction = null;
    this.selectedTarget = null;
    
    // UI elements
    this.modalElement = null;
    this.combatLog = [];
    
    // Dice manipulation
    this.currentRoll = null;
    this.manipulationCallback = null;
    
    // ✨ Audio System (AAA)
    this.audioSystem = null;
    this.heartbeatLoop = null;
    this.windLoop = null;
  }
  
  // ═══════════════════════════════════════════════════════
  // 🎬 INITIALIZATION
  // ═══════════════════════════════════════════════════════
  
  async initialize() {
    console.log('⚔️ Initializing combat...');
    
    // ✨ Initialize Audio System
    if (typeof CombatAudioSystem !== 'undefined') {
      this.audioSystem = new CombatAudioSystem();
      await this.audioSystem.initialize();
      
      // Start combat music
      this.audioSystem.playMusic('combat');
      console.log('🎵 Combat music started');
    } else {
      console.warn('⚠️ CombatAudioSystem not found - audio disabled');
    }
    
    // Create modal
    this.createCombatModal();
    
    // Calculate turn order
    this.calculateTurnOrder();
    
    // Place units on grid
    this.placeUnitsOnGrid();
    
    // Show modal with animation
    await this.showModal();
    
    // Start combat
    this.combatActive = true;
    this.addLog('⚔️ Combat begins!', 'system');
    
    // Start first turn
    await delay(1000);
    this.startNextTurn();
  }
  
  createCombatModal() {
    // Create modal HTML
    const modalHTML = `
      <div id="combat-modal" class="combat-modal">
        <div class="combat-overlay"></div>
        <div class="combat-container">
          <!-- Header -->
          <div class="combat-header">
            <h2>⚔️ Combat Encounter</h2>
            <span class="location">🏰 ${this.environment} - Round <span id="combat-round">1</span></span>
          </div>
          
          <!-- Combat Grid -->
          <div class="combat-grid">
            <!-- Enemy Row -->
            <div class="combat-row enemy-row" id="enemy-row">
              ${this.createGridSlots(4, 'enemy')}
            </div>
            
            <!-- Ally Row -->
            <div class="combat-row ally-row" id="ally-row">
              ${this.createGridSlots(4, 'ally')}
            </div>
          </div>
          
          <!-- Dice Manipulation Panel -->
          <div class="dice-manipulation-panel hidden" id="dice-panel">
            <div class="current-roll">
              <span class="roll-label">Lancer de dé:</span>
              
              <!-- Dé 3D -->
              <div class="dice-3d-container" id="dice-3d-container">
                <div class="dice-3d" id="dice-3d">
                  <div class="dice-face front"><span id="dice-result">?</span></div>
                  <div class="dice-face back">?</div>
                  <div class="dice-face right">?</div>
                  <div class="dice-face left">?</div>
                  <div class="dice-face top">?</div>
                  <div class="dice-face bottom">?</div>
                </div>
                <div class="dice-impact-flash" id="dice-impact-flash"></div>
              </div>
            </div>
            <div class="manipulation-actions">
              <button class="manip-btn" id="btn-reroll" data-action="reroll">
                🔄 Reroll<br><small>Cost: 10% Corruption</small>
              </button>
              <button class="manip-btn" id="btn-modifier" data-action="modifier">
                ➕ +2 Modifier<br><small>Cost: 10% Corruption</small>
              </button>
              <button class="manip-btn" id="btn-prophecy" data-action="prophecy">
                🔮 See Next 3<br><small>Cost: 15% Corruption</small>
              </button>
            </div>
            <button class="btn-accept-roll" id="btn-accept">Accept Roll</button>
          </div>
          
          <!-- Actions Panel -->
          <div class="actions-panel" id="actions-panel">
            <h3>⚡ Actions (<span id="active-unit-name">-</span>)</h3>
            <div class="action-buttons">
              <button class="action-btn" data-action="attack">⚔️ Attack</button>
              <button class="action-btn" data-action="spell">✨ Spell</button>
              <button class="action-btn" data-action="defend">🛡️ Defend</button>
              <button class="action-btn" data-action="item">🎒 Item</button>
            </div>
            <div class="target-selector">
              Target: <span id="selected-target">None</span>
            </div>
          </div>
          
          <!-- Combat Log -->
          <div class="combat-log">
            <h4>📊 Combat Log</h4>
            <div class="log-entries" id="combat-log-content"></div>
          </div>
          
          <!-- Stress Bar - Narration visuelle -->
          <div class="stress-bar-container">
            <div class="stress-bar-header">
              <span class="stress-label">😰 Stress</span>
              <span class="stress-value" id="stress-value">0/100</span>
            </div>
            <div class="stress-bar-visual">
              <div class="stress-icon-start">🧘</div>
              <div class="stress-fill" id="stress-fill" style="width: 0%"></div>
              <div class="stress-icon-end">😱</div>
            </div>
          </div>

          <!-- Corruption Bar - Narration visuelle -->
          <div class="corruption-bar-container">
            <div class="corruption-bar-header">
              <span class="corruption-label">💀 Corruption</span>
              <span class="corruption-value" id="corruption-value">0/100</span>
            </div>
            <div class="corruption-bar-visual">
              <div class="corruption-icon-start">👤</div>
              <div class="corruption-fill" id="corruption-fill" style="width: 0%"></div>
              <div class="corruption-icon-end">😈</div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Append to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Store reference
    this.modalElement = document.getElementById('combat-modal');
    
    // Setup event listeners
    this.setupEventListeners();
  }
  
  createGridSlots(count, type) {
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `<div class="combat-slot" data-position="${type}-${i}" data-type="${type}"></div>`;
    }
    return html;
  }
  
  setupEventListeners() {
    // Action buttons
    document.querySelectorAll('.action-btn').forEach(btn => {
      // ✨ Son hover (AAA)
      btn.addEventListener('mouseenter', () => {
        if (this.audioSystem && this.isPlayerTurn) {
          this.audioSystem.playHover();
        }
      });
      
      btn.addEventListener('click', () => {
        console.log('🎮 Action button clicked:', btn.dataset.action, 'isPlayerTurn:', this.isPlayerTurn);
        if (this.isPlayerTurn) {
          this.selectAction(btn.dataset.action);
        } else {
          console.log('⚠️ Not player turn, ignoring click');
        }
      });
    });
    
    // Dice manipulation buttons
    document.getElementById('btn-reroll').addEventListener('click', () => this.handleReroll());
    document.getElementById('btn-modifier').addEventListener('click', () => this.handleModifier());
    document.getElementById('btn-prophecy').addEventListener('click', () => this.handleProphecy());
    document.getElementById('btn-accept').addEventListener('click', () => this.acceptRoll());
  }
  
  calculateTurnOrder() {
    // Combine all units
    const allUnits = [...this.allies, ...this.enemies];
    
    // Sort by Speed (descending)
    allUnits.sort((a, b) => {
      if (a.speed === b.speed) {
        // Tie-breaker: random
        return Math.random() - 0.5;
      }
      return b.speed - a.speed;
    });
    
    this.turnOrder = allUnits;
    
    console.log('🎯 Turn Order:', this.turnOrder.map(u => `${u.name} (${u.speed})`));
  }
  
  placeUnitsOnGrid() {
    // Place enemies
    this.enemies.forEach((enemy, index) => {
      const slot = document.querySelector(`[data-position="enemy-${index}"]`);
      if (slot) {
        this.renderUnit(slot, enemy);
      }
    });
    
    // Place allies
    this.allies.forEach((ally, index) => {
      const slot = document.querySelector(`[data-position="ally-${index}"]`);
      if (slot) {
        this.renderUnit(slot, ally);
      }
    });
  }
  
  renderUnit(slot, unit) {
    const unitHTML = `
      <div class="combat-unit" data-unit-id="${unit.id}">
        <div class="unit-sprite">${unit.sprite || '🧙'}</div>
        <div class="unit-name">${unit.name}</div>
        <div class="unit-hp">
          <div class="unit-hp-fill" style="width: ${(unit.hp / unit.maxHp) * 100}%"></div>
        </div>
        <div class="unit-hp-text">${unit.hp}/${unit.maxHp}</div>
      </div>
    `;
    
    slot.innerHTML = unitHTML;
    
    // Add click listener for targeting
    slot.addEventListener('click', () => {
      console.log('🎯 Unit clicked:', unit.name, 'selectedAction:', this.selectedAction, 'isPlayerTurn:', this.isPlayerTurn);
      if (this.isPlayerTurn && this.selectedAction) {
        this.selectTarget(unit);
      }
    });
  }
  
  async showModal() {
    // Fade in
    this.modalElement.classList.add('active');
    await delay(500);
  }
  
  // ═══════════════════════════════════════════════════════
  // 🔄 COMBAT LOOP
  // ═══════════════════════════════════════════════════════
  
  async startNextTurn() {
    if (!this.combatActive) return;
    
    // Check combat end
    if (this.checkCombatEnd()) {
      return;
    }
    
    // Next round?
    if (this.currentTurnIndex >= this.turnOrder.length) {
      this.currentTurnIndex = 0;
      this.round++;
      document.getElementById('combat-round').textContent = this.round;
      this.addLog(`📍 Round ${this.round} begins!`, 'system');
      
      // Apply round effects (cooldowns, DOTs, etc.)
      this.applyRoundEffects();
    }
    
    // Get current unit
    const currentUnit = this.turnOrder[this.currentTurnIndex];
    
    // Skip if dead
    if (currentUnit.hp <= 0) {
      this.currentTurnIndex++;
      this.startNextTurn();
      return;
    }
    
    // Highlight active unit
    this.highlightActiveUnit(currentUnit);
    
    // Update UI
    document.getElementById('active-unit-name').textContent = currentUnit.name;
    
    // Determine turn type
    if (currentUnit.isAlly) {
      if (currentUnit.isPlayer) {
        await this.handlePlayerTurn(currentUnit);
      } else {
        await this.handleCompanionTurn(currentUnit);
      }
    } else {
      await this.handleEnemyTurn(currentUnit);
    }
  }
  
  async handlePlayerTurn(player) {
    console.log('⚡ handlePlayerTurn called for:', player.name);
    
    // ✨ SIGNAL MULTIMODAL DÉBUT TOUR (AAA)
    if (this.audioSystem) {
      this.audioSystem.playTurnStart(); // 🥁 War drum!
    }
    this.showTurnIndicator('À VOUS DE JOUER'); // Visuel
    
    this.isPlayerTurn = true;
    
    this.addLog(`⚡ Your turn!`, 'player');
    
    // Enable action buttons
    this.enableActionButtons();
    console.log('✅ Action buttons enabled');
    
    // Wait for player action
    // (handled by event listeners)
  }
  
  async handleCompanionTurn(companion) {
    this.addLog(`🤖 ${companion.name}'s turn`, 'ally');
    
    await delay(500);
    
    // Simple AI
    const target = this.selectRandomEnemy();
    if (target) {
      await this.performAttack(companion, target);
    }
    
    // Next turn
    await delay(1000);
    this.currentTurnIndex++;
    this.startNextTurn();
  }
  
  async handleEnemyTurn(enemy) {
    this.addLog(`💀 ${enemy.name}'s turn`, 'enemy');
    
    await delay(500);
    
    // Simple AI
    const target = this.selectRandomAlly();
    if (target) {
      await this.performAttack(enemy, target);
    }
    
    // Next turn
    await delay(1000);
    this.currentTurnIndex++;
    this.startNextTurn();
  }
  
  // ═══════════════════════════════════════════════════════
  // 🎮 PLAYER ACTIONS
  // ═══════════════════════════════════════════════════════
  
  selectAction(actionType) {
    console.log('📌 selectAction called:', actionType);
    
    // ✨ Son de sélection
    if (this.audioSystem) {
      this.audioSystem.playActionSelect();
    }
    
    this.selectedAction = actionType;
    this.addLog(`📌 Selected: ${actionType}`, 'player');
    
    // Highlight action button
    document.querySelectorAll('.action-btn').forEach(btn => {
      btn.classList.remove('selected');
    });
    document.querySelector(`[data-action="${actionType}"]`).classList.add('selected');
    
    // Show valid targets
    this.highlightValidTargets(actionType);
    
    // Update target selector
    document.getElementById('selected-target').textContent = 'Click enemy';
  }
  
  selectTarget(target) {
    console.log('🎯 selectTarget called:', target.name, 'for action:', this.selectedAction);
    
    // ✨ Son de validation
    if (this.audioSystem) {
      this.audioSystem.playActionValidate();
    }
    
    this.selectedTarget = target;
    this.addLog(`🎯 Target: ${target.name}`, 'player');
    
    document.getElementById('selected-target').textContent = target.name;
    
    // Execute action
    this.executePlayerAction();
  }
  
  async executePlayerAction() {
    console.log('🎬 executePlayerAction called:', this.selectedAction, 'on', this.selectedTarget?.name);
    this.disableActionButtons();
    
    const player = this.turnOrder[this.currentTurnIndex];
    
    switch(this.selectedAction) {
      case 'attack':
        await this.performAttack(player, this.selectedTarget);
        break;
      case 'spell':
        await this.performSpell(player, this.selectedTarget);
        break;
      case 'defend':
        await this.performDefend(player);
        break;
      case 'item':
        await this.performItem(player, this.selectedTarget);
        break;
    }
    
    // Reset selections
    this.selectedAction = null;
    this.selectedTarget = null;
    this.isPlayerTurn = false;
    
    // Next turn
    await delay(1000);
    this.currentTurnIndex++;
    this.startNextTurn();
  }
  
  // ═══════════════════════════════════════════════════════
  // ⚔️ COMBAT ACTIONS
  // ═══════════════════════════════════════════════════════
  
  async performAttack(attacker, target) {
    this.addLog(`⚔️ ${attacker.name} attacks ${target.name}!`, 'action');
    
    // Roll dice
    const roll = await this.rollDice();
    
    // Offer manipulation (if player)
    let finalRoll = roll;
    if (attacker.isPlayer) {
      finalRoll = await this.offerDiceManipulation(roll);
    }
    
    // Calculate damage
    let damage = (attacker.atk + finalRoll) - target.def;
    
    // Defending bonus
    if (target.defending) {
      damage -= Math.floor(target.def * 0.5);
    }
    
    // Critical?
    const isCritical = finalRoll >= 9;
    if (isCritical) {
      damage *= 2;
      this.addLog(`💥 CRITICAL HIT!`, 'critical');
    }
    
    // Minimum damage
    damage = Math.max(1, Math.floor(damage));
    
    // ✨ Son de dégâts
    if (this.audioSystem) {
      this.audioSystem.playDamage(damage, isCritical);
    }
    
    // Apply damage
    this.applyDamage(target, damage);
    
    // Animate
    if (isCritical) {
      await this.animateCritical(attacker, target, damage);
    } else {
      await this.animateAttack(attacker, target, damage);
    }
    
    // Check death
    if (target.hp <= 0) {
      await this.handleDeath(target);
    }
  }
  
  async performDefend(unit) {
    console.log('🛡️ performDefend called for:', unit.name);
    
    // ✨ Son de défense
    if (this.audioSystem) {
      this.audioSystem.playDefend();
    }
    
    this.addLog(`🛡️ ${unit.name} defends!`, 'action');
    
    unit.defending = true;
    
    // Reduce stress
    if (unit.stress) {
      unit.stress = Math.max(0, unit.stress - 10);
      this.updateStressBar();
    }
    
    await this.animateDefend(unit);
  }
  
  async performSpell(caster, target) {
    console.log('✨ performSpell called:', caster.name, '→', target?.name);
    
    // ✨ Son de cast
    if (this.audioSystem) {
      this.audioSystem.playSpellCast();
    }
    
    this.addLog(`✨ ${caster.name} casts a spell on ${target.name}!`, 'action');
    
    // Roll dice
    const roll = await this.rollDice();
    
    // Offer manipulation (if player)
    let finalRoll = roll;
    if (caster.isPlayer) {
      finalRoll = await this.offerDiceManipulation(roll);
    }
    
    // Calculate spell damage (magic based)
    const magicPower = caster.atk || 20; // Use atk as magic for now
    let damage = Math.floor((magicPower + finalRoll) * 1.5);
    
    // Critical?
    const isCritical = finalRoll >= 9;
    if (isCritical) {
      damage *= 2;
      this.addLog(`💥 CRITICAL SPELL!`, 'critical');
    }
    
    // Minimum damage
    damage = Math.max(1, Math.floor(damage));
    
    this.addLog(`✨ Magic damage: ${damage}!`, 'action');
    
    // ✨ Son d'impact magique
    if (this.audioSystem) {
      this.audioSystem.playSpellImpact();
    }
    
    // Apply damage
    this.applyDamage(target, damage);
    
    // Animate (reuse attack animation for now)
    if (isCritical) {
      await this.animateCritical(caster, target, damage);
    } else {
      await this.animateAttack(caster, target, damage);
    }
    
    // Check death
    if (target.hp <= 0) {
      await this.handleDeath(target);
    }
  }
  
  async performItem(user, target) {
    console.log('🎒 performItem called:', user.name);
    
    // ✨ Son d'utilisation d'item
    if (this.audioSystem) {
      this.audioSystem.playItemUse();
    }
    
    this.addLog(`🎒 ${user.name} uses an item!`, 'action');
    
    // For now, simple heal potion effect
    const healAmount = 30;
    
    if (target.hp < target.maxHp) {
      // ✨ Son de soin
      if (this.audioSystem) {
        this.audioSystem.playHeal();
      }
      
      target.hp = Math.min(target.maxHp, target.hp + healAmount);
      this.addLog(`❤️ ${target.name} heals ${healAmount} HP!`, 'action');
      this.updateUnitHP(target);
    } else {
      this.addLog(`ℹ️ ${target.name} is already at full HP!`, 'system');
    }
    
    await delay(500);
  }
  
  // ═══════════════════════════════════════════════════════
  // 🎲 DICE SYSTEM
  // ═══════════════════════════════════════════════════════
  
  // ═══════════════════════════════════════════════════════
  // 🎲 DÉ ANIMÉ 3D - AAA
  // ═══════════════════════════════════════════════════════
  
  async animateDice3D(result) {
    console.log('🎲 Animating 3D dice:', result);
    
    const dice3D = document.getElementById('dice-3d');
    const container = document.getElementById('dice-3d-container');
    const flash = document.getElementById('dice-impact-flash');
    const resultDisplay = document.getElementById('dice-result');
    
    if (!dice3D || !container || !flash) {
      console.warn('⚠️ Dice 3D elements not found');
      return;
    }
    
    // Reset
    resultDisplay.textContent = '?';
    dice3D.classList.remove('rolling', 'impact');
    flash.classList.remove('active');
    
    // Phase 1: ROLL - 1.5s
    await new Promise(resolve => {
      dice3D.classList.add('rolling');
      setTimeout(resolve, 1500);
    });
    
    dice3D.classList.remove('rolling');
    
    // Phase 2: IMPACT - 0.4s
    await new Promise(resolve => {
      // Show result
      resultDisplay.textContent = result;
      
      // Impact animation
      dice3D.classList.add('impact');
      container.classList.add('shake');
      flash.classList.add('active');
      
      setTimeout(() => {
        dice3D.classList.remove('impact');
        container.classList.remove('shake');
      }, 400);
      
      setTimeout(resolve, 600);
    });
    
    // Flash terminé
    setTimeout(() => {
      flash.classList.remove('active');
    }, 500);
  }
  
  async rollDice() {
    return new Promise(async (resolve) => {
      // Generate result
      const result = Math.floor(Math.random() * 10) + 1;
      
      // ✨ Animate 3D dice
      await this.animateDice3D(result);
      
      // ✨ Séquence audio 3 temps (en parallèle)
      if (this.audioSystem) {
        this.audioSystem.playDiceRoll(result);
      }
      
      resolve(result);
    });
  }
  
  async offerDiceManipulation(roll) {
    return new Promise((resolve) => {
      this.currentRoll = roll;
      this.manipulationCallback = resolve;
      
      // Show dice panel
      const panel = document.getElementById('dice-panel');
      panel.classList.remove('hidden');
      
      // Show current roll
      document.getElementById('dice-result').textContent = roll;
      
      // Enable buttons
      const player = this.allies.find(a => a.isPlayer);
      
      // Check corruption limits
      if (player.corruption >= 90) {
        document.getElementById('btn-reroll').disabled = true;
        document.getElementById('btn-modifier').disabled = true;
      }
      if (player.corruption >= 85) {
        document.getElementById('btn-prophecy').disabled = true;
      }
      
      // Auto-accept after 5 seconds
      this.manipulationTimeout = setTimeout(() => {
        this.acceptRoll();
      }, 5000);
    });
  }
  
  handleReroll() {
    clearTimeout(this.manipulationTimeout);
    
    const player = this.allies.find(a => a.isPlayer);
    
    // Increase corruption
    player.corruption += 10;
    this.updateCorruptionBar();
    
    // New roll
    const newRoll = Math.floor(Math.random() * 10) + 1;
    
    this.addLog(`🔄 Rerolled! ${this.currentRoll} → ${newRoll}`, 'manipulation');
    
    // Update display
    document.getElementById('dice-result').textContent = newRoll;
    this.currentRoll = newRoll;
    
    // Hide panel after short delay
    setTimeout(() => this.acceptRoll(), 1000);
  }
  
  handleModifier() {
    clearTimeout(this.manipulationTimeout);
    
    const player = this.allies.find(a => a.isPlayer);
    
    // Increase corruption
    player.corruption += 10;
    this.updateCorruptionBar();
    
    // Add modifier
    const newRoll = Math.min(10, this.currentRoll + 2);
    
    this.addLog(`➕ Modified! ${this.currentRoll} → ${newRoll}`, 'manipulation');
    
    // Update display
    document.getElementById('dice-result').textContent = newRoll;
    this.currentRoll = newRoll;
    
    // Hide panel
    setTimeout(() => this.acceptRoll(), 1000);
  }
  
  handleProphecy() {
    clearTimeout(this.manipulationTimeout);
    
    const player = this.allies.find(a => a.isPlayer);
    
    // Increase corruption
    player.corruption += 15;
    this.updateCorruptionBar();
    
    // Generate next 3 rolls
    const next1 = Math.floor(Math.random() * 10) + 1;
    const next2 = Math.floor(Math.random() * 10) + 1;
    const next3 = Math.floor(Math.random() * 10) + 1;
    
    this.addLog(`🔮 Future: ${next1}, ${next2}, ${next3}`, 'manipulation');
    
    // Accept current roll
    setTimeout(() => this.acceptRoll(), 2000);
  }
  
  acceptRoll() {
    clearTimeout(this.manipulationTimeout);
    
    // Hide dice panel
    document.getElementById('dice-panel').classList.add('hidden');
    
    // Resolve promise
    if (this.manipulationCallback) {
      this.manipulationCallback(this.currentRoll);
      this.manipulationCallback = null;
    }
  }
  
  // ═══════════════════════════════════════════════════════
  // 💔 DAMAGE & DEATH
  // ═══════════════════════════════════════════════════════
  
  applyDamage(target, damage) {
    target.hp = Math.max(0, target.hp - damage);
    
    this.addLog(`💔 ${target.name} takes ${damage} damage! (${target.hp}/${target.maxHp})`, 'damage');
    
    // Update UI
    this.updateUnitHP(target);
    
    // Increase stress for allies if ally hit
    if (target.isAlly) {
      this.allies.forEach(ally => {
        if (ally.stress !== undefined) {
          ally.stress = Math.min(100, ally.stress + 5);
        }
      });
      this.updateStressBar();
    }
  }
  
  async handleDeath(unit) {
    this.addLog(`💀 ${unit.name} has died!`, 'death');
    
    // ✨ Son de mort
    if (this.audioSystem) {
      if (unit.isAlly) {
        this.audioSystem.playAllyDeath();
      } else {
        this.audioSystem.playEnemyDeath();
      }
    }
    
    // Remove from turn order
    const index = this.turnOrder.indexOf(unit);
    if (index > -1) {
      this.turnOrder.splice(index, 1);
      if (this.currentTurnIndex > index) {
        this.currentTurnIndex--;
      }
    }
    
    // Animate death
    await this.animateDeath(unit);
    
    // Increase stress if ally
    if (unit.isAlly) {
      this.allies.forEach(ally => {
        if (ally.stress !== undefined && ally.hp > 0) {
          ally.stress = Math.min(100, ally.stress + 30);
        }
      });
      this.updateStressBar();
    }
  }
  
  // ═══════════════════════════════════════════════════════
  // 🎬 ANIMATIONS
  // ═══════════════════════════════════════════════════════
  
  async animateAttack(attacker, target, damage) {
    // TODO: Implement visual attack animation
    await delay(500);
  }
  
  async animateCritical(attacker, target, damage) {
    // TODO: Implement critical hit animation
    await delay(800);
  }
  
  async animateDefend(unit) {
    // TODO: Implement defend animation
    await delay(300);
  }
  
  async animateDeath(unit) {
    const unitElement = document.querySelector(`[data-unit-id="${unit.id}"]`);
    if (unitElement) {
      unitElement.style.opacity = '0';
      unitElement.style.transform = 'scale(0.5)';
    }
    await delay(500);
  }
  
  async animateDiceRoll() {
    // TODO: Implement dice rolling animation
    await delay(1000);
  }
  
  // ═══════════════════════════════════════════════════════
  // 🖼️ UI UPDATES
  // ═══════════════════════════════════════════════════════
  
  updateUnitHP(unit) {
    const unitElement = document.querySelector(`[data-unit-id="${unit.id}"]`);
    if (unitElement) {
      const fill = unitElement.querySelector('.unit-hp-fill');
      const text = unitElement.querySelector('.unit-hp-text');
      
      const percentage = (unit.hp / unit.maxHp) * 100;
      fill.style.width = `${percentage}%`;
      text.textContent = `${unit.hp}/${unit.maxHp}`;
    }
  }
  
  updateStressBar() {
    const player = this.allies.find(a => a.isPlayer);
    if (!player || player.stress === undefined) return;
    
    const stressPercent = (player.stress / 100) * 100;
    
    const fillElement = document.getElementById('stress-fill');
    const valueElement = document.getElementById('stress-value');
    
    if (fillElement) {
      fillElement.style.width = `${stressPercent}%`;
      
      // ✨ Changer couleur selon niveau
      if (stressPercent >= 70) {
        fillElement.style.background = 'linear-gradient(90deg, #DC2626 0%, #991B1B 100%)';
      } else if (stressPercent >= 40) {
        fillElement.style.background = 'linear-gradient(90deg, #D97706 0%, #DC2626 100%)';
      } else {
        fillElement.style.background = 'linear-gradient(90deg, #FBBF24 0%, #D97706 100%)';
      }
    }
    
    if (valueElement) valueElement.textContent = `${Math.floor(player.stress)}/100`;
  }
  
  updateCorruptionBar() {
    const player = this.allies.find(a => a.isPlayer);
    if (!player || player.corruption === undefined) return;
    
    const corruptionPercent = (player.corruption / 100) * 100;
    
    const fillElement = document.getElementById('corruption-fill');
    const valueElement = document.getElementById('corruption-value');
    
    if (fillElement) {
      fillElement.style.width = `${corruptionPercent}%`;
      
      // ✨ Effet pulsation si corruption élevée
      if (corruptionPercent >= 70) {
        fillElement.style.animation = 'corruptionPulse 2s ease-in-out infinite';
      } else {
        fillElement.style.animation = 'none';
      }
    }
    
    if (valueElement) valueElement.textContent = `${Math.floor(player.corruption)}/100`;
  }
  
  highlightActiveUnit(unit) {
    // Remove all highlights
    document.querySelectorAll('.combat-slot').forEach(slot => {
      slot.classList.remove('active');
    });
    
    // Highlight current unit's slot
    const unitElement = document.querySelector(`[data-unit-id="${unit.id}"]`);
    if (unitElement) {
      unitElement.closest('.combat-slot').classList.add('active');
    }
  }
  
  highlightValidTargets(actionType) {
    // For now, highlight all enemies for attack/spell
    if (actionType === 'attack' || actionType === 'spell') {
      document.querySelectorAll('[data-type="enemy"]').forEach(slot => {
        slot.classList.add('targetable');
      });
    }
  }
  
  enableActionButtons() {
    document.querySelectorAll('.action-btn').forEach(btn => {
      btn.disabled = false;
    });
  }
  
  disableActionButtons() {
    document.querySelectorAll('.action-btn').forEach(btn => {
      btn.disabled = true;
      btn.classList.remove('selected');
    });
  }
  
  addLog(message, type = 'normal') {
    const log = document.getElementById('combat-log-content');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = message;
    
    // ✅ Normal - Ajoute à la fin (comme game.js)
    log.appendChild(entry);
    
    // ✅ Auto-scroll vers le bas (dernier message visible)
    log.scrollTop = log.scrollHeight;
    
    // Limit to 50 entries
    while (log.children.length > 50) {
      log.removeChild(log.firstChild);
    }
  }
  
  // ═══════════════════════════════════════════════════════
  // 🏁 COMBAT END
  // ═══════════════════════════════════════════════════════
  
  checkCombatEnd() {
    const alliesAlive = this.allies.filter(a => a.hp > 0);
    const enemiesAlive = this.enemies.filter(e => e.hp > 0);
    
    if (alliesAlive.length === 0) {
      this.handleDefeat();
      return true;
    }
    
    if (enemiesAlive.length === 0) {
      this.handleVictory();
      return true;
    }
    
    return false;
  }
  
  async handleVictory() {
    this.combatActive = false;
    this.addLog('🎉 VICTORY!', 'victory');
    
    // ✨ Son de victoire + fade out musique
    if (this.audioSystem) {
      this.audioSystem.playVictory();
      this.audioSystem.fadeMusicOut(2000);
    }
    
    // Reduce stress
    this.allies.forEach(ally => {
      if (ally.stress !== undefined) {
        ally.stress = Math.max(0, ally.stress - 30);
      }
    });
    this.updateStressBar();
    
    // Show rewards
    await delay(2000);
    this.showVictoryRewards();
  }
  
  async handleDefeat() {
    this.combatActive = false;
    this.addLog('💀 DEFEAT...', 'defeat');
    
    // ✨ Son de défaite + fade out musique
    if (this.audioSystem) {
      this.audioSystem.playDefeat();
      this.audioSystem.fadeMusicOut(2000);
    }
    
    await delay(2000);
    this.closeCombatModal();
    
    // Return to camp
    if (typeof returnToCamp === 'function') {
      returnToCamp();
    }
  }
  
  showVictoryRewards() {
    console.log('🎁 Showing rewards...');
    
    // Calculate rewards
    const goldReward = Math.floor(Math.random() * 50) + 30; // 30-80 gold
    const xpReward = Math.floor(Math.random() * 100) + 50; // 50-150 XP
    
    // Create rewards modal
    const rewardsHTML = `
      <div class="combat-rewards-modal active">
        <div class="rewards-overlay"></div>
        <div class="rewards-container">
          <div class="rewards-header">
            <h2>🎉 VICTOIRE !</h2>
            <p class="rewards-subtitle">Vous avez triomphé du combat</p>
          </div>
          
          <div class="rewards-content">
            <div class="rewards-summary">
              <div class="combat-stats">
                <div class="stat-item">
                  <span class="stat-label">Tours écoulés :</span>
                  <span class="stat-value">${this.round}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Ennemis vaincus :</span>
                  <span class="stat-value">${this.enemies.length}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Alliés survivants :</span>
                  <span class="stat-value">${this.allies.filter(a => a.hp > 0).length}/${this.allies.length}</span>
                </div>
              </div>
              
              <div class="rewards-list">
                <h3>🎁 Récompenses</h3>
                <div class="reward-item gold">
                  <span class="reward-icon">💰</span>
                  <span class="reward-text">+${goldReward} Or</span>
                </div>
                <div class="reward-item xp">
                  <span class="reward-icon">⭐</span>
                  <span class="reward-text">+${xpReward} XP</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="rewards-actions">
            <button class="btn-continue" id="btn-continue-combat">
              Continuer l'aventure
            </button>
          </div>
        </div>
      </div>
    `;
    
    // Add to body
    document.body.insertAdjacentHTML('beforeend', rewardsHTML);
    
    // Setup button
    document.getElementById('btn-continue-combat').addEventListener('click', () => {
      // Remove rewards modal
      document.querySelector('.combat-rewards-modal').remove();
      
      // Close combat modal
      this.closeCombatModal();
      
      // TODO: Apply rewards to player
      console.log(`💰 Gained ${goldReward} gold, ${xpReward} XP`);
    });
  }
  
  closeCombatModal() {
    // ✨ Cleanup audio
    if (this.audioSystem) {
      this.audioSystem.cleanup();
    }
    
    this.modalElement.classList.remove('active');
    setTimeout(() => {
      this.modalElement.remove();
    }, 500);
  }
  
  // ═══════════════════════════════════════════════════════
  // 🤖 AI HELPERS
  // ═══════════════════════════════════════════════════════
  
  selectRandomEnemy() {
    const alive = this.enemies.filter(e => e.hp > 0);
    if (alive.length === 0) return null;
    return alive[Math.floor(Math.random() * alive.length)];
  }
  
  selectRandomAlly() {
    const alive = this.allies.filter(a => a.hp > 0);
    if (alive.length === 0) return null;
    return alive[Math.floor(Math.random() * alive.length)];
  }
  
  applyRoundEffects() {
    // Cooldowns, DOTs, buffs, etc.
    this.turnOrder.forEach(unit => {
      if (unit.defending) {
        unit.defending = false;
      }
    });
  }
  
  // ═══════════════════════════════════════════════════════
  // 🎯 TURN INDICATOR - Signal visuel AAA
  // ═══════════════════════════════════════════════════════
  
  showTurnIndicator(text) {
    // Créer l'indicateur de tour
    const indicator = document.createElement('div');
    indicator.className = 'turn-indicator show';
    indicator.innerHTML = `<div class="turn-indicator-text">${text}</div>`;
    
    // Ajouter au container
    const container = this.modalElement.querySelector('.combat-container');
    if (container) {
      container.appendChild(indicator);
      
      // Retirer après l'animation (2s)
      setTimeout(() => {
        indicator.remove();
      }, 2000);
    }
  }
}

// ═══════════════════════════════════════════════════════
// 🛠️ UTILITY
// ═══════════════════════════════════════════════════════

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ═══════════════════════════════════════════════════════
// 📤 EXPORT
// ═══════════════════════════════════════════════════════

console.log('⚔️ Combat System loaded');