console.log('🎮 Chargement du jeu...');

// Fonction utilitaire pour créer des délais
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Charger données joueur depuis localStorage (nouveau système)
let playerData = JSON.parse(localStorage.getItem('tlc_player') || '{}');

// Fallback : vérifier ancien système sessionStorage (compatibilité)
if (!playerData.name) {
  playerData = JSON.parse(sessionStorage.getItem('player') || '{}');
}

if (!playerData.name) {
  alert('Aucun joueur trouvé ! Retourne au Camp pour commencer une partie.');
  window.location.href = 'camp.html';
}

class Game {
  constructor() {
    this.renderer = null;
  }

  init() {
    console.log('Initialisation du jeu...');

    // Exposer l'instance globalement pour le renderer
    window.game = this;

    // ✅ Récupérer la classe depuis les données sauvegardées
    // Priorité : classData stocké, puis reconstruction depuis CLASSES, puis classe par défaut
    let cls = playerData.classData;

    // Si classData incomplet/manquant, reconstruire depuis CLASSES
    if (!cls || !cls.baseStats) {
      if (window.CLASSES && playerData.class) {
        cls = CLASSES[playerData.class];
        console.log('📦 Classe reconstruite depuis CLASSES:', playerData.class);
      } else if (window.CLASSES && playerData.className) {
        // Fallback: rechercher par nom de classe
        cls = Object.values(CLASSES).find(c => c.name === playerData.className);
        console.log('📦 Classe reconstruite par nom:', playerData.className);
      }
    }

    if (!cls) {
      console.error('❌ Impossible de charger les données de classe:', playerData);
      alert('Erreur: Données de classe manquantes ! Retour au camp...');
      window.location.href = 'camp.html';
      return;
    }

    console.log('🎨 Classe du joueur:', playerData.class, '→', cls.name);
    
    // Adapter les stats du JSON au format attendu par le jeu
    const stats = cls.baseStats || cls;
    const hp = stats.hp || 100;
    const atk = stats.attack || stats.atk || 10;
    const def = stats.defense || stats.def || 10;
    const speed = stats.speed || 5;

    const player = {
      id: Date.now(),
      name: playerData.name,
      class: playerData.class,  // ✅ AJOUTÉ pour EventModals
      classData: cls,
      sprite: cls.icon || '🧙',  // ✅ AJOUTÉ pour TacticalCombatSystem
      icon: cls.icon || '🧙',  // ✅ AJOUTÉ pour EventModalCorridor
      hp: hp,
      maxHp: hp,
      atk: atk,
      def: def,
      speed: speed,  // ✅ AJOUTÉ pour l'ordre des tours en combat
      gold: 50,  // ✅ AJOUTÉ pour système marchand
      position: 0,
      alive: true,
      isLocal: true,
      isAlly: true,  // ✅ AJOUTÉ pour TacticalCombatSystem
      isPlayer: true,  // ✅ AJOUTÉ pour différencier le joueur principal
      inventory: new Inventory(cls.inventorySize || 20),
      atkBuff: 0,
      atkBuffTurns: 0,
      defBuff: 0,
      defBuffTurns: 0,
      invulnerable: false,
      invulnerableTurns: 0,
      // deck: new CardDeck(12),
      // cardSelection: new CardSelection(),
      movementsSinceLastSelection: 0,
      companions: [],  // ✅ AJOUTÉ pour stocker les compagnons actifs
      // 📊 Progression
      level: 1,
      xp: 0,
      skillPoints: 0,
      unlockedSkills: [],
      // 🎯 Statistiques
      stats: {
        kills: 0,
        bossKills: 0,
        chestsOpened: 0,
        riddlesSolved: 0,
        turnsSurvived: 0,
        libraryVisited: false
      },
      // 🏆 Achievements
      achievements: [],
      completedQuests: [],
      activeQuests: (typeof AchievementSystem !== 'undefined' && AchievementSystem.QUESTS) 
        ? Object.keys(AchievementSystem.QUESTS) 
        : []
    };
    
    player.inventory.addItem('HEALTH_POTION', 2);
    player.inventory.addItem('RUBY', 10);
    
    GameState.players.push(player);

    // Lier l'instance de CardSelection à son joueur pour un accès simple depuis l'UI
    if (player.cardSelection) player.cardSelection.owner = player;

    // ✅ NOUVEAU : Charger et créer les compagnons
    if (playerData.companions && playerData.companions.length > 0) {
      console.log(`⚔️ Chargement de ${playerData.companions.length} compagnon(s)`);

      playerData.companions.forEach((companionData, index) => {
        const companion = {
          id: Date.now() + index + 1,
          name: companionData.name,
          class: 'Guerrier',
          sprite: '⚔️',
          icon: '⚔️',
          hp: companionData.hp || companionData.maxHp,
          maxHp: companionData.maxHp,
          atk: companionData.atk,
          def: companionData.def,
          speed: 5,
          position: 0,
          alive: true,
          isLocal: true,
          isAlly: true,
          isCompanion: true,  // ✅ Flag pour identifier les compagnons
          isPlayer: false,
          inventory: null,
          atkBuff: 0,
          atkBuffTurns: 0,
          defBuff: 0,
          defBuffTurns: 0,
          invulnerable: false,
          invulnerableTurns: 0,
          morale: companionData.morale || 100,
          motivation: companionData.motivation,
          backstory: companionData.backstory
        };

        player.companions.push(companion);
        GameState.players.push(companion);  // ✅ Ajouter le compagnon comme joueur allié
        console.log(`  ✅ ${companion.name} (HP: ${companion.hp}/${companion.maxHp}, ATK: ${companion.atk}, DEF: ${companion.def})`);
      });
    }

    GameState.dungeon = DungeonGenerator.generate();
    GameState.gameStarted = true;
    
    this.renderer = new Renderer('gameCanvas');
    
    // 🎨 Activer les graphismes avancés
    if (this.renderer.initAdvancedGraphics) {
      this.renderer.initAdvancedGraphics();
      this.renderer.setupDungeonLights(GameState.dungeon);
      this.renderer.draw = this.renderer.drawAdvanced;
      console.log('🎨 Mode de rendu avancé activé');
    }
    
    this.renderer.draw(GameState.dungeon, GameState.players);
    this.updateUI();
    
    document.getElementById('rollBtn').onclick = () => this.rollDice();
    document.getElementById('infoCloseBtn').onclick = () => this.closeModal('infoModal');
    
    // Contrôles de caméra
    document.getElementById('zoomInBtn').onclick = () => this.zoomIn();
    document.getElementById('zoomOutBtn').onclick = () => this.zoomOut();
    document.getElementById('recenterBtn').onclick = () => this.recenterCamera();
    
    // Contrôle du son
    document.getElementById('soundToggleBtn').onclick = () => this.toggleSound();
    
    // Contrôle de la musique
    document.getElementById('musicToggleBtn').onclick = () => this.toggleMusic();
    
    this.addLog('⚡', 'La partie commence ! Que l\'aventure débute...', true);
    this.addLog('🎲', player.name + ' le ' + cls.name + ' entre dans le donjon...');

    this.musicStarted = false;

    // ✅ NOUVEAU : Initialiser le système de corruption
    if (window.CorruptionSystem && !window.CorruptionSystem.initialized) {
      window.CorruptionSystem.init();
      console.log('💀 Corruption System initialisé');
    }

    // ✅ NOUVEAU : Narrateur d'introduction
    if (window.Narrator && this.selectedClass) {
      setTimeout(() => {
        window.Narrator.narrateGameStart(this.selectedClass.id);
      }, 2000);
    }

    // ✅ NOUVEAU : Initialiser le système visuel du Dé du Destin
    if (window.DiceSystem && window.DiceVisualSystem) {
      window.DiceSystem.visualSystem = new DiceVisualSystem(window.DiceSystem);
      console.log('🎲 Dé du Destin initialisé avec système visuel');

      // Synchroniser la corruption du joueur avec le Dé
      window.DiceSystem.corruption = player.corruption || 0;
    }

    console.log('✅ Jeu démarré !');
  }

  /**
   * 🎭 NOUVEAU : Applique les stats de la classe choisie au player
   * Appelé après character select
   */
  applyClassStats(classData) {
    const player = this.getCurrentPlayer();
    if (!player || !classData) {
      console.warn('⚠️ Cannot apply class stats: missing player or classData');
      return;
    }

    console.log('🎭 Application stats de classe:', classData.name);

    // Appliquer stats de base
    const baseStats = classData.baseStats;
    player.maxHp = baseStats.hp || 100;
    player.hp = player.maxHp;
    player.atk = baseStats.attack || 10;
    player.def = baseStats.defense || 10;
    player.speed = baseStats.speed || 10;

    // Stats optionnelles selon classe
    if (baseStats.magicPower) {
      player.magicPower = baseStats.magicPower;
    }
    if (baseStats.healPower) {
      player.healPower = baseStats.healPower;
    }
    if (baseStats.critChance) {
      player.critChance = baseStats.critChance;
    }
    if (baseStats.critDamage) {
      player.critDamage = baseStats.critDamage;
    }
    if (baseStats.luck) {
      player.luck = baseStats.luck;
    }
    if (baseStats.lifesteal) {
      player.lifesteal = baseStats.lifesteal;
    }

    // Stocker référence classe complète
    player.selectedClass = classData;
    player.classId = classData.id;
    player.className = classData.name;
    player.godAffinity = classData.godAffinity;

    // Initialiser corruption à 0
    player.corruption = 0;

    // Mettre à jour sprite/icon
    player.sprite = classData.icon;

    // Mettre à jour UI
    this.updateUI();

    // Log starting gear
    if (classData.startingGear) {
      console.log('🎒 Équipement de départ:', classData.startingGear);
      // TODO: Ajouter les items de départ à l'inventaire
    }

    console.log('✅ Stats classe appliquées:', {
      HP: `${player.hp}/${player.maxHp}`,
      ATK: player.atk,
      DEF: player.def,
      SPEED: player.speed,
      CORRUPTION: player.corruption
    });
  }

  zoomIn() {
    this.renderer.setZoom(this.renderer.zoom + 0.1);
    this.updateZoomIndicator();
    this.renderer.draw(GameState.dungeon, GameState.players);
  }
  
  zoomOut() {
    this.renderer.setZoom(this.renderer.zoom - 0.1);
    this.updateZoomIndicator();
    this.renderer.draw(GameState.dungeon, GameState.players);
  }
  
  recenterCamera() {
    this.renderer.recenterOnPlayer();
    this.renderer.draw(GameState.dungeon, GameState.players);
    this.addLog('🎯', 'Caméra recentrée sur ' + GameState.players.find(p => p.isLocal).name);
  }
  
  toggleSound() {
    const enabled = AUDIO.toggle();
    const btn = document.getElementById('soundToggleBtn');
    const icon = document.getElementById('soundIcon');
    
    if (enabled) {
      icon.textContent = '🔊';
      btn.title = 'Son activé';
      AUDIO.playNotification();
    } else {
      icon.textContent = '🔇';
      btn.title = 'Son désactivé';
    }
  }
  
  toggleMusic() {
    const enabled = AUDIO.toggleMusic();
    const btn = document.getElementById('musicToggleBtn');
    const icon = document.getElementById('musicIcon');
    
    if (enabled) {
      icon.textContent = '🎵';
      btn.title = 'Musique activée';
      AUDIO.playMusic('game');
    } else {
      icon.textContent = '🔇';
      btn.title = 'Musique désactivée';
    }
  }
  
  // 🌟 Afficher l'arbre de compétences
  showSkillTree() {
    if (typeof ProgressionSystem === 'undefined') {
      this.showModal('❌ Erreur', 'Système de progression non disponible');
      return;
    }
    
    const player = GameState.players[0];
    const availableSkills = ProgressionSystem.getAvailableSkills(player);
    const progInfo = ProgressionSystem.getProgressInfo(player);
    
    if (progInfo.skillPoints === 0) {
      this.showModal('🌟 Compétences', 'Vous n\'avez pas de points de compétence disponibles.<br>Gagnez de l\'expérience pour monter de niveau !');
      return;
    }
    
    let html = `
      <h2 style="text-align:center;color:var(--gold);margin-bottom:15px;">🌟 Arbre de Compétences</h2>
      <p style="text-align:center;margin-bottom:20px;">Points disponibles : <b style="color:#4CAF50;">${progInfo.skillPoints}</b></p>
      <div style="max-height:400px;overflow-y:auto;">
    `;
    
    if (availableSkills.length === 0) {
      html += '<p style="text-align:center;opacity:0.7;">Toutes les compétences sont débloquées !</p>';
    } else {
      availableSkills.forEach((skill, index) => {
        html += `
          <div style="
            background:rgba(42,42,42,0.8);
            border:2px solid ${progInfo.skillPoints >= skill.cost ? 'var(--gold)' : '#666'};
            border-radius:8px;
            padding:12px;
            margin-bottom:10px;
            ${progInfo.skillPoints >= skill.cost ? 'cursor:pointer;' : 'opacity:0.5;'}
          " onclick="${progInfo.skillPoints >= skill.cost ? `game.unlockSkill('${skill.id}')` : ''}">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
              <span style="font-size:2em;">${skill.icon}</span>
              <div style="flex:1;">
                <h3 style="margin:0;color:var(--gold);font-size:1.1em;">${skill.name}</h3>
                <p style="margin:4px 0 0 0;font-size:0.9em;opacity:0.8;">Coût: ${skill.cost} point${skill.cost > 1 ? 's' : ''}</p>
              </div>
            </div>
            <p style="margin:0;font-size:0.95em;">${skill.desc}</p>
          </div>
        `;
      });
    }
    
    html += '</div>';
    
    this.showModal('🌟 Compétences', html);
  }
  
  // 🌟 Débloquer une compétence
  unlockSkill(skillId) {
    if (typeof ProgressionSystem === 'undefined') return;
    
    const player = GameState.players[0];
    const result = ProgressionSystem.unlockSkill(player, skillId);
    
    if (result.success) {
      AUDIO.playCardGet();
      this.showNotification(
        `🌟 Compétence Débloquée !`,
        `${result.skill.icon} ${result.skill.name}`,
        '#4CAF50'
      );
      this.addLog('🌟', `Compétence débloquée : ${result.skill.name}`, true);
      this.updateUI();
      
      setTimeout(() => this.showSkillTree(), 500);
    } else {
      this.showNotification('❌ Erreur', result.message, '#e74c3c');
    }
  }
  
  // 🎯 Vérifier les récompenses de progression
  checkProgressionRewards(player) {
    if (typeof AchievementSystem === 'undefined') return;
    
    const results = AchievementSystem.checkAll(player, GameState.dungeon);
    
    if (results.newAchievements.length > 0) {
      results.newAchievements.forEach(achievement => {
        this.showNotification(
          '🏆 Achievement Débloqué !',
          `${achievement.icon} ${achievement.name}`,
          '#FFD700'
        );
        this.addLog('🏆', `Achievement débloqué : ${achievement.name}`, true);
        
        if (achievement.reward) {
          this.addLog('🎁', `Récompense : ${achievement.reward}`, true);
        }
      });
    }
    
    if (results.completedQuests.length > 0) {
      results.completedQuests.forEach(quest => {
        this.showNotification(
          '📜 Quête Terminée !',
          `${quest.name}`,
          '#4CAF50'
        );
        this.addLog('📜', `Quête terminée : ${quest.name}`, true);
        
        if (quest.reward) {
          this.addLog('💎', `Récompense : ${quest.reward.gold} pièces, ${quest.reward.xp} XP`, true);
          player.gold += quest.reward.gold;
          player.xp += quest.reward.xp;
          this.checkLevelUp(player);
        }
      });
    }
  }
  
  // 📊 Vérifier le level up
  checkLevelUp(player) {
    if (typeof ProgressionSystem === 'undefined') return;
    
    const result = ProgressionSystem.checkLevelUp(player);
    
    if (result.leveledUp) {
      AUDIO.playLevelUp();
      this.showNotification(
        '⭐ LEVEL UP !',
        `Niveau ${result.newLevel} atteint !`,
        '#FFD700'
      );
      this.addLog('⭐', `${player.name} passe niveau ${result.newLevel} !`, true);
      this.addLog('💪', `Stats améliorées : HP +${result.hpGain}, ATK +${result.atkGain}, DEF +${result.defGain}`, true);

      if (result.skillPointsGained > 0) {
        this.addLog('🌟', `+${result.skillPointsGained} point${result.skillPointsGained > 1 ? 's' : ''} de compétence !`, true);
      }

      // ✅ NOUVEAU : Narrateur level up
      if (window.Narrator) {
        window.Narrator.narrateLevelUp(result.newLevel);
      }

      this.updateUI();
    }
  }
  
  // 📢 Afficher une notification temporaire
  showNotification(title, message, color = '#4CAF50') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      background: ${color};
      color: white;
      padding: 15px 25px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      font-weight: bold;
      animation: slideInRight 0.3s ease-out;
    `;
    
    const tDiv = document.createElement('div');
    tDiv.style.fontSize = '1.2em';
    tDiv.style.marginBottom = '5px';
    tDiv.textContent = title;

    const mDiv = document.createElement('div');
    mDiv.style.fontSize = '0.9em';
    mDiv.style.opacity = '0.9';
    mDiv.textContent = message;

    notification.appendChild(tDiv);
    notification.appendChild(mDiv);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
  
  // 🃏 Déclencher sélection de cartes
  triggerCardSelection(player) {
    console.log('🃏 Déclenchement sélection de buffs pour', player.name);
    // ✅ MODIFIÉ : Donner un buff aléatoire au lieu de cartes
    this.giveRandomBuff(player);
  }

  
  getCurrentPlayer() {
    return GameState.players[GameState.currentPlayerIndex];
  }

  updateUI() {
    const cp = this.getCurrentPlayer();
    if (!cp) return;
    
    const heroIcon = document.getElementById('heroIcon');
    const levelBadge = document.getElementById('levelBadgeCenter');
    
    // Afficher l'image de classe si disponible, sinon l'icône texte
    if (heroIcon) {
      const classType = cp.classData.type;

      // Si pas de type défini, utiliser directement l'icône
      if (!classType) {
        heroIcon.textContent = cp.sprite || cp.classData.icon || '🧙';
      } else {
        const img = document.createElement('img');
        img.src = `images/classes/${classType}.jpg`;
        img.alt = cp.classData.name;
        // Let CSS control sizing and fit (.hero-portrait img { width:100%; height:100%; object-fit:cover })
        img.onload = () => {
          heroIcon.innerHTML = '';
          heroIcon.appendChild(img);
        };
        img.onerror = () => {
          // Fallback textuel si l'image introuvable
          heroIcon.textContent = cp.classData.icon || cp.classData.name.charAt(0);
        };
        // If already cached and loaded, append immediately
        if (img.complete && img.naturalWidth !== 0) {
          heroIcon.innerHTML = '';
          heroIcon.appendChild(img);
        }
      }
    }

    if (levelBadge) levelBadge.textContent = `Niv. ${cp.level}`;
    
    // Stats principales
    const heroName = document.getElementById('heroName');
    const heroClass = document.getElementById('heroClass');
    const heroHP = document.getElementById('heroHP');
    const heroATK = document.getElementById('heroATK');
    const heroDEF = document.getElementById('heroDEF');
    
    if (heroName) heroName.textContent = cp.name;
    if (heroClass) heroClass.textContent = cp.classData.name;
    if (heroHP) heroHP.textContent = cp.hp + '/' + cp.maxHp;
    if (heroATK) heroATK.textContent = cp.atk;
    if (heroDEF) heroDEF.textContent = cp.def;
    
    // Barre de PV
    const hpBar = document.getElementById('heroHPBar');
    if (hpBar) {
      const hpPercent = (cp.hp / cp.maxHp) * 100;
      hpBar.style.width = hpPercent + '%';
      
      if (hpPercent > 60) {
        hpBar.style.backgroundColor = '#4CAF50';
      } else if (hpPercent > 30) {
        hpBar.style.backgroundColor = '#FF9800';
      } else {
        hpBar.style.backgroundColor = '#f44336';
      }
    }
    
    // Stats secondaires
    const goldElement = document.getElementById('heroGold');
    if (goldElement) goldElement.textContent = cp.gold || 0;
    
    const xpElement = document.getElementById('heroXP');
    if (xpElement && typeof ProgressionSystem !== 'undefined') {
      const xpNeeded = ProgressionSystem.getXPForLevel(cp.level + 1);
      xpElement.textContent = `${cp.xp}/${xpNeeded}`;
    }
    
    // Barre XP
    const xpBar = document.getElementById('heroXPBar');
    if (xpBar && typeof ProgressionSystem !== 'undefined') {
      const xpNeeded = ProgressionSystem.getXPForLevel(cp.level + 1);
      const xpPercent = (cp.xp / xpNeeded) * 100;
      xpBar.style.width = xpPercent + '%';
    }
    
    // Points de compétence
    const skillPointsElement = document.getElementById('heroSkillPoints');
    if (skillPointsElement) skillPointsElement.textContent = cp.skillPoints || 0;
    
    // Position
    const posElement = document.getElementById('heroPosition');
    if (posElement) {
      const dungeonLength = GameState.dungeon.path.length;
      posElement.textContent = `${cp.position}/${dungeonLength}`;
    }
    
    // Inventaire
    if (cp.inventory) {
      const invSlots = document.querySelectorAll('.inv-slot');
      const items = cp.inventory.getItems();
      
      invSlots.forEach((slot, index) => {
        slot.innerHTML = '';
        if (items[index]) {
          const item = items[index];

          const itemDiv = document.createElement('div');
          itemDiv.className = 'inv-item';
          itemDiv.title = `${item.name} x${item.quantity}`;

          const iconSpan = document.createElement('span');
          iconSpan.className = 'inv-icon';
          iconSpan.textContent = this.getItemIcon(item.type);

          const qtySpan = document.createElement('span');
          qtySpan.className = 'inv-qty';
          qtySpan.textContent = item.quantity;

          itemDiv.appendChild(iconSpan);
          itemDiv.appendChild(qtySpan);

          // 👆 Ajout gestion clic : utiliser l'item
          itemDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            // Empêcher l'utilisation si vide
            const result = cp.inventory.useItem(item.type, cp);
            if (!result || !result.success) {
              const msg = result?.message || 'Article non utilisable';
              this.addLog('⚠️', msg);
              this.showNotification('Impossible', msg, '#e74c3c');
              return;
            }

            // Succès
            this.addLog('✨', result.message, true);
            if (typeof AUDIO !== 'undefined' && typeof AUDIO.playItemUse === 'function') {
              AUDIO.playItemUse();
            }

            // Effets spéciaux : teleportation peut déclencher événements ou salles
            const tile = GameState.dungeon.path[cp.position];
            if (item.type === 'TELEPORT_SCROLL' || (tile && ['room_entry','combat','trap','chest','merchant'].includes(tile.type))) {
              // Si on a atterri dans une salle
              if (tile && tile.type === 'room_entry' && tile.roomId && !tile.eventTriggered) {
                tile.eventTriggered = true;
                setTimeout(() => this.triggerRoomEvent(tile), 300);
              } else if (tile && ['combat','trap','chest','merchant'].includes(tile.type) && !tile.cleared) {
                // Déclencher l'événement de la case
                setTimeout(() => Events.handleTile(cp, tile, this), 300);
              }
            }

            // Mise à jour de l'UI
            this.updateUI();
            if (this.renderer) this.renderer.draw(GameState.dungeon, GameState.players);
          });

          // ✅ NOUVEAU : Clic droit pour inspecter l'item
          itemDiv.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();

            // Obtenir l'item enrichi avec sa lore
            if (window.ItemInspectionModal && window.ItemsLoreSystem && window.ItemsLoreSystem.loaded) {
              const enrichedItem = window.ItemsLoreSystem.enrichItem({ id: item.type, ...item });
              window.ItemInspectionModal.show(enrichedItem, cp);
            } else {
              console.warn('⚠️ Item Inspection Modal non disponible');
            }
          });

          slot.appendChild(itemDiv);
        } else {
          const empty = document.createElement('div');
          empty.className = 'inv-empty';
          empty.textContent = '⬜';
          slot.appendChild(empty);
        }
      });
    }
    
    // Deck de cartes
    if (cp.deck) {
      const deckCount = document.getElementById('deckCardCount');
      if (deckCount) {
        deckCount.textContent = cp.deck.cards.length;
      }
      
      cp.deck.updateDeckDisplay();
    }

    // Double-clic sur la grille d'inventaire pour voir tout l'inventaire
    const invGrid = document.getElementById('inventoryGrid');
    if (invGrid && !invGrid.dataset.hasFullModal) {
      invGrid.addEventListener('dblclick', () => this.showInventoryModal(cp));
      invGrid.dataset.hasFullModal = '1';
    }
    
    // Tour actuel
    const turnPlayer = document.getElementById('turnPlayer');
    if (turnPlayer) {
      turnPlayer.textContent = cp.name;
    }

    // ✅ NOUVEAU : Synchroniser le système de corruption
    if (window.CorruptionSystem && window.CorruptionSystem.initialized) {
      const corruption = cp.corruption || 0;
      if (window.CorruptionSystem.getCorruption() !== corruption) {
        window.CorruptionSystem.setCorruption(corruption);
      }
    }

    this.updateZoomIndicator();
  }

  // ═══════════════════════════════════════════════════════════
  // ✅ ANIMATION DÉPLACEMENT CASE PAR CASE
  // ═══════════════════════════════════════════════════════════
  
  movePlayerAnimated(player, steps) {
    return new Promise((resolve) => {
      if (steps <= 0) {
        resolve();
        return;
      }
      
      let currentStep = 0;
      const stepDelay = 250; // 250ms entre chaque case
      
      const animateNextStep = () => {
        if (currentStep >= steps) {
          resolve();
          return;
        }
        
        // Avancer d'une case
        player.position++;
        currentStep++;
        
        // Vérifier les limites
        if (player.position >= GameState.dungeon.path.length) {
          player.position = GameState.dungeon.path.length - 1;
          resolve();
          return;
        }
        
        // Mise à jour affichage
        this.updateUI();
        if (this.renderer) {
          this.renderer.draw(GameState.dungeon, GameState.players);
        }
        
        // Son de pas
        if (typeof AUDIO !== 'undefined' && AUDIO.playFootstep) {
          AUDIO.playFootstep();
        }
        
        // Prochaine étape
        setTimeout(animateNextStep, stepDelay);
      };
      
      animateNextStep();
    });
  }

  // ═══════════════════════════════════════════════════════════
  // ✅ DONNER UN BUFF ALÉATOIRE
  // ═══════════════════════════════════════════════════════════
  
  giveRandomBuff(player) {
    if (typeof PassiveBuffsSystem === 'undefined') {
      console.warn('⚠️ PassiveBuffsSystem non chargé');
      return;
    }
    
    const commonBuffs = ['phoenix_feather', 'treasure_hunter', 'even_boost'];
    const uncommonBuffs = ['battle_fury', 'iron_skin'];
    const rareBuffs = ['vampire_touch', 'critical_strike'];
    const legendaryBuffs = ['divine_blessing'];
    
    const rand = Math.random();
    let selectedBuff;
    
    if (rand < 0.5) {
      // 50% : Common
      selectedBuff = commonBuffs[Math.floor(Math.random() * commonBuffs.length)];
    } else if (rand < 0.8) {
      // 30% : Uncommon
      selectedBuff = uncommonBuffs[Math.floor(Math.random() * uncommonBuffs.length)];
    } else if (rand < 0.95) {
      // 15% : Rare
      selectedBuff = rareBuffs[Math.floor(Math.random() * rareBuffs.length)];
    } else {
      // 5% : Legendary
      selectedBuff = legendaryBuffs[Math.floor(Math.random() * legendaryBuffs.length)];
    }
    
    PassiveBuffsSystem.addBuff(selectedBuff, player);
    
    const buffDef = PassiveBuffsSystem.buffDefinitions[selectedBuff];
    if (buffDef) {
      this.addLog('💫', `${player.name} obtient : ${buffDef.name}`, true);
    }
  }

  
  updateZoomIndicator() {
    const indicator = document.getElementById('zoomIndicator');
    if (indicator && this.renderer) {
      const zoomPercent = Math.round(this.renderer.zoom * 100);
      indicator.textContent = zoomPercent + '%';
    }
  }
  
  getItemIcon(type) {
    const icons = {
      'HEALTH_POTION': '❤️',
      'STRENGTH_POTION': '💪',
      'DEFENSE_POTION': '🛡️',
      'RUBY': '💎',
      'GOLD': '💰',
      'KEY': '🔑'
    };
    return icons[type] || '📦';
  }

  // Échapper du texte pour inclusion sûre dans du HTML
  escapeHTML(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  // Afficher une modal avec l'inventaire complet (double-clic sur la grille)
  showInventoryModal(player) {
    const items = player.inventory.getItems();
    let html = '<div class="inv-modal-list" style="display:flex;flex-direction:column;gap:10px;">';
    if (!items || items.length === 0) {
      html += '<p>🎒 Inventaire vide</p>';
    } else {
      items.forEach(it => {
        html += `<div class="inv-row" style="display:flex;justify-content:space-between;align-items:center;gap:10px;">
          <div>${this.getItemIcon(it.type)} <strong>${it.name}</strong> x${it.quantity}</div>
          <div><button class="btn-small use-inv" data-type="${it.type}">Utiliser</button></div>
        </div>`;
      });
    }
    html += '</div>';

    this.showModal('🎒 Inventaire complet', html);

    // Attacher les handlers après insertion
    setTimeout(() => {
      const modal = document.getElementById('infoModal');
      if (!modal) return;
      modal.querySelectorAll('.use-inv').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const type = btn.dataset.type;
          const res = player.inventory.useItem(type, player);
          if (!res || !res.success) {
            this.showNotification('Impossible', res?.message || 'Article non utilisable', '#e74c3c');
            this.addLog('⚠️', res?.message || 'Article non utilisable');
            return;
          }
          this.addLog('✨', res.message, true);
          if (typeof AUDIO !== 'undefined' && typeof AUDIO.playItemUse === 'function') AUDIO.playItemUse();
          this.updateUI();
          if (this.renderer) this.renderer.draw(GameState.dungeon, GameState.players);
          // Fermer la modal
          document.getElementById('infoModal')?.classList.remove('active');
        });
      });
    }, 50);
  }
  
  updatePlayerList() {
    const list = document.getElementById('playerList');
    list.innerHTML = '';
    
    GameState.players.forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'player-card' + (i === GameState.currentPlayerIndex ? ' active' : '');
      
      card.innerHTML = `
        <div class="player-icon">${p.classData.icon}</div>
        <div class="player-info">
          <div class="player-name">${p.name}</div>
          <div class="player-class">${p.classData.name}</div>
        </div>
        <div class="player-stats">
          <span>❤️ ${p.hp}/${p.maxHp}</span>
          <span>⚔️ ${p.atk}</span>
          <span>🛡 ${p.def}</span>
          <span>📍 ${p.position}</span>
        </div>
      `;
      
      list.appendChild(card);
    });
  }

  async rollDice() {
    console.log('🎲 Lancer du Dé du Destin...');

    if (!this.musicStarted) {
      AUDIO.playMusic('game');
      this.musicStarted = true;
    }

    const cp = GameState.players[GameState.currentPlayerIndex];

    if (!cp.alive) {
      this.nextTurn();
      return;
    }

    // ═══════════════════════════════════════════════════════════
    // 💀 LANCER LE DÉ DU DESTIN (avec animation complète)
    // ═══════════════════════════════════════════════════════════

    const rawRoll = await this.rollDiceOfDestiny(cp);

    // ✅ Appliquer buffs passifs
    let modifiedRoll = rawRoll;
    if (typeof PassiveBuffsSystem !== 'undefined') {
      modifiedRoll = PassiveBuffsSystem.modifyDiceRoll(rawRoll, cp);
    }
    const actualFinalRoll = modifiedRoll;

    console.log('💀 Dé du Destin:', rawRoll, '→ Final:', actualFinalRoll);
    
    const oldPos = cp.position;
    this.addLog('🎲', `${cp.name} lance : ${rawRoll}${rawRoll !== actualFinalRoll ? ` → ${actualFinalRoll}` : ''}`);

    // Désactiver le bouton pendant l'animation
    const rollBtn = document.getElementById('rollBtn');
    if (rollBtn) rollBtn.disabled = true;

    // ═══════════════════════════════════════════════════════════
    // ✅ ANIMATION CASE PAR CASE AVEC GESTION ÉVÉNEMENTS
    // ═══════════════════════════════════════════════════════════
    
    const result = await movePlayerWithAnimation(cp, actualFinalRoll, this);
    
    console.log('🏁 Animation terminée:', result);

    // ═══════════════════════════════════════════════════════════
    // 🏆 VÉRIFIER VICTOIRE
    // ═══════════════════════════════════════════════════════════
    
    const dungeonLength = GameState.dungeon.path.length;
    
    if (cp.position >= dungeonLength - 1) {
      cp.position = dungeonLength - 1;
      
      await delay(300);
      AUDIO.stopMusic();
      AUDIO.playMusic('victory');
      
      await delay(200);
      AUDIO.playVictory();
      
      await delay(300);
      
      const safeName = this.escapeHTML(cp.name);
      this.showModal(
        '🏆 VICTOIRE !', 
        `<h2 style="color: #FFD700; text-align: center; margin-bottom: 20px;">
          🎉 ${safeName} a triomphé ! 🎉
        </h2>
        <p style="text-align: center; font-size: 1.2em;">
          ${safeName} a atteint la sortie du donjon et remporte la partie !
        </p>
        <p style="text-align: center; margin-top: 20px;">
          Cases parcourues : ${cp.position + 1}/${dungeonLength}
        </p>`
      );
      this.addLog('🏆', `${cp.name} remporte la partie !`, true);
      
      if (rollBtn) rollBtn.disabled = false;
      this.updateUI();
      if (this.renderer) this.renderer.draw(GameState.dungeon, GameState.players);
      return;
    }

    // ═══════════════════════════════════════════════════════════
    // 💫 BUFFS ET PROGRESSION (si pas d'événement)
    // ═══════════════════════════════════════════════════════════
    
    if (!result.eventTriggered) {
      cp.movementsSinceLastSelection++;
      this.checkProgressionRewards(cp);
      
      if (cp.movementsSinceLastSelection >= 3) {
        cp.movementsSinceLastSelection = 0;
        await delay(500);
        this.giveRandomBuff(cp);
      }
    }

    // ═══════════════════════════════════════════════════════════
    // 🎨 MISE À JOUR FINALE
    // ═══════════════════════════════════════════════════════════
    
    this.updateUI();
    if (this.renderer) {
      this.renderer.draw(GameState.dungeon, GameState.players);
    }
    
    // Réactiver le bouton
    if (rollBtn) rollBtn.disabled = false;
    
    // Tour suivant (si pas en événement bloquant)
    if (!result.eventTriggered) {
      await delay(500);
      this.nextTurn();
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 🎲 DÉ DU DESTIN - Nouveau système
  // ═══════════════════════════════════════════════════════════════

  /**
   * Lance le Dé du Destin (nouveau système visuel spectaculaire)
   * @param {Object} player - Joueur qui lance le dé (optionnel)
   * @returns {Promise<number>} Résultat du dé (1-6 ou 1-100 si fusionné)
   */
  async rollDiceOfDestiny(player = null) {
    if (!window.DiceSystem) {
      console.warn('⚠️ DiceSystem non disponible, fallback sur dé normal');
      return Math.floor(Math.random() * 6) + 1;
    }

    const currentPlayer = player || this.getCurrentPlayer();

    // Synchroniser la corruption si le joueur a cette stat
    if (currentPlayer && currentPlayer.corruption !== undefined) {
      window.DiceSystem.corruption = currentPlayer.corruption;
    }

    // Lancer le Dé du Destin avec animation complète
    const result = await window.DiceSystem.roll();

    console.log('🎲 Dé du Destin:', result);
    return result;
  }

  /**
   * Upgrade le Dé du Destin vers un stade supérieur
   * @param {number} targetStage - Stade cible (2-5)
   * @returns {Promise<boolean>} Succès de l'upgrade
   */
  async upgradeDiceOfDestiny(targetStage) {
    if (!window.DiceSystem) {
      console.warn('⚠️ DiceSystem non disponible');
      return false;
    }

    const player = this.getCurrentPlayer();
    if (!player) return false;

    // Préparer l'objet player avec les props nécessaires
    const playerForDice = {
      gold: player.gold || 0,
      corruption: player.corruption || 0,
      runsCompleted: player.stats?.runsCompleted || 0
    };

    const success = await window.DiceSystem.upgrade(playerForDice, targetStage);

    if (success) {
      // Appliquer les changements au joueur réel
      player.gold = playerForDice.gold;
      player.corruption = playerForDice.corruption;

      this.addLog('✨', `Le Dé du Destin évolue vers le Stade ${targetStage}!`, true);
      this.updateUI();
    }

    return success;
  }

  // ═══════════════════════════════════════════════════════════════
  // 🎯 GESTION ÉVÉNEMENTS (pour animation)
  // ═══════════════════════════════════════════════════════════════
  
  handleTileEvent(player, tile) {
    if (!tile || tile.cleared) return;
    
    console.log('🎯 Gestion événement tile:', tile.type);
    
    // Déléguer au système Events
    if (typeof Events !== 'undefined' && Events.handleTile) {
      Events.handleTile(player, tile, this);
    }
    
    this.updateUI();
    
    // ⚠️ NE PAS appeler nextTurn() ici, c'est géré dans rollDice()
  }
  
  // ═══════════════════════════════════════════════════════════════
  // 🎬 NOUVELLES FONCTIONS SYSTÈME DE MODALS
  // ═══════════════════════════════════════════════════════════════
  
  triggerRoomEvent(tile) {
    const room = GameState.dungeon.rooms.find(r => r.id === tile.roomId);
    if (!room) {
      console.error('❌ Room non trouvée:', tile.roomId);
      console.error('   Rooms disponibles:', GameState.dungeon.rooms.map(r => r.id));
      console.error('   Tile:', tile);

      // ✅ FIX: Créer un événement de couloir à la place
      this.addLog('🚪', 'Vous arrivez dans un couloir vide...');

      // Marquer la tile comme cleared pour éviter de retriggerer
      tile.eventTriggered = true;
      tile.cleared = true;

      // Convertir en corridor normal
      tile.type = 'corridor';
      delete tile.roomId;
      delete tile.roomType;

      setTimeout(() => this.nextTurn(), 500);
      return;
    }
    
    const player = GameState.players.find(p => p.isLocal);
    if (!player) {
      setTimeout(() => this.nextTurn(), 500);
      return;
    }
    
    console.log(`🎬 Déclenchement événement salle: ${room.type}`);
    this.addLog('🚪', `Vous entrez dans une salle ${this.getRoomTypeName(room.type)}...`);
    
    switch(room.type) {
      case 'combat':
        this.triggerCombatRoom(room, player);
        break;
      case 'treasure':
        this.triggerTreasureRoom(room, player);
        break;
      case 'merchant':
        this.triggerMerchantRoom(room, player);
        break;
      case 'puzzle':
        this.triggerPuzzleRoom(room, player);
        break;
      case 'rest':
        this.triggerRestRoom(room, player);
        break;
      case 'mystery':
        this.triggerMysteryRoom(room, player);
        break;
      default:
        console.warn('⚠️ Type de salle non géré:', room.type);
        setTimeout(() => this.nextTurn(), 500);
    }
  }
  
  triggerCombatRoom(room, player) {
    // Tenir compte de la difficulté éventuelle définie à la génération (mini / boss)
    let enemy = null;
    if (room && room.difficulty === 'boss' && typeof window !== 'undefined' && window.BOSSES) {
      const keys = Object.keys(window.BOSSES);
      const bossKey = keys[Math.floor(Math.random() * keys.length)];
      const bossTpl = window.BOSSES[bossKey];
      enemy = {
        id: 'boss_' + Date.now(),
        name: bossTpl.name,
        icon: bossTpl.icon,
        sprite: bossTpl.icon,  // ✅ AJOUTÉ pour TacticalCombatSystem
        hp: bossTpl.hp,
        maxHp: bossTpl.hp,  // ✅ AJOUTÉ
        atk: bossTpl.atk,
        def: Math.max(0, Math.floor(player.level * 0.5)),
        speed: bossTpl.speed || 5,  // ✅ AJOUTÉ
        isAlly: false,  // ✅ AJOUTÉ
        xp: bossTpl.xp,
        lootGold: bossTpl.lootGold || [50, 100],
        lootItems: bossTpl.lootItems || []
      };
    } else if (room && room.difficulty === 'mini') {
      enemy = this.generateEnemy(Math.max(1, player.level + 2));
    } else {
      enemy = this.generateEnemy(player.level);
    }

    EventModals.showCombatModal(player, enemy, () => {
      // Démarrer le combat classique (Combat.start utilise game pour contexte)
      this.startCombat(player, enemy);
    });
  }

  async startCombat(player, enemy) {
    console.log('⚔️ Démarrage du combat tactique');

    // Vérifier que TacticalCombatSystem existe
    if (typeof TacticalCombatSystem === 'undefined') {
      console.error('❌ TacticalCombatSystem non trouvé !');
      alert('Erreur : Système de combat non chargé');
      return;
    }

    // Préparer les alliés (joueur uniquement pour l'instant)
    const allies = [player];

    // Préparer les ennemis
    const enemies = [enemy];

    // ✅ Callback de fin de combat
    const onCombatEnd = (result) => {
      console.log('⚔️ Fin de combat:', result.victory ? 'VICTOIRE' : 'DÉFAITE');

      // Mettre à jour les stats du joueur
      player.hp = allies[0].hp;

      if (result.victory) {
        // Victoire : donner les récompenses
        const xpGain = enemy.xp || 20;
        const goldGain = enemy.gold || 10;

        player.xp += xpGain;
        player.gold += goldGain;

        this.addLog('🎉', `Victoire ! +${xpGain} XP, +${goldGain} pièces d'or`);
        this.checkLevelUp(player);

        // Stats
        if (player.stats) {
          player.stats.kills++;
        }
      } else {
        // Défaite : pénalité
        const goldLost = Math.floor(player.gold * 0.2);
        player.gold = Math.max(0, player.gold - goldLost);

        this.addLog('💀', `Défaite... Vous perdez ${goldLost} pièces d'or.`);

        // Game over si le joueur est mort
        if (player.hp <= 0) {
          player.alive = false;
          this.showModal('💀 GAME OVER', `${player.name} est tombé au combat...<br><br>La partie est terminée.`);
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 4000);
          return;
        }
      }

      // Mettre à jour l'UI et continuer le jeu
      this.updateUI();
      if (this.renderer) {
        this.renderer.draw(GameState.dungeon, GameState.players);
      }

      // Continuer le jeu
      setTimeout(() => this.nextTurn(), 1000);
    };

    // Créer le système de combat tactique avec callback
    const combat = new TacticalCombatSystem(allies, enemies, 'dungeon', onCombatEnd);

    // Initialiser et lancer le combat
    try {
      await combat.initialize();
    } catch (error) {
      console.error('❌ Erreur lors du combat:', error);
      alert('Erreur lors du lancement du combat: ' + error.message);
    }
  }

  triggerTreasureRoom(room, player) {
    const baseGold = 20 + (player.level * 10);
    const treasure = {
      gold: baseGold + Math.floor(Math.random() * baseGold),
      items: [],
      xp: 15 + (player.level * 5)
    };
    
    const possibleItems = [
      { type: 'HEALTH_POTION', name: 'Potion de Vie', quantity: 1 },
      { type: 'STRENGTH_POTION', name: 'Potion de Force', quantity: 1 },
      { type: 'RUBY', name: 'Rubis', quantity: Math.floor(Math.random() * 3) + 1 }
    ];
    
    if (Math.random() < 0.7) {
      const itemCount = Math.random() < 0.5 ? 1 : 2;
      for (let i = 0; i < itemCount; i++) {
        const item = possibleItems[Math.floor(Math.random() * possibleItems.length)];
        treasure.items.push({ ...item });
      }
    }
    
    EventModals.showTreasureModal(treasure, () => {
      player.gold += treasure.gold;
      player.xp += treasure.xp;
      
      treasure.items.forEach(item => {
        player.inventory.addItem(item.type, item.quantity);
      });
      
      this.checkLevelUp(player);
      this.addLog('💎', `Vous trouvez ${treasure.gold} pièces d'or et gagnez ${treasure.xp} XP !`);

      // 🎴 Petite chance d'offrir une carte lors d'une salle trésor
      if (Math.random() < 0.3 && player.cardSelection) {
        const cs = player.cardSelection;
        const cand = cs.drawCards(2, player);
        if (cand && cand.length > 0) {
          cs.show(cand, player, (sel) => {
            if (sel && sel.length > 0) {
              const added = player.deck.addCard(sel[0]);
              if (added) {
                this.addLog('🃏', `${player.name} obtient : ${sel[0].name}`, true);
                if (typeof AUDIO !== 'undefined' && typeof AUDIO.playCardGet === 'function') AUDIO.playCardGet();
                this.updateUI();
              }
            }
          });
        }
      }

      this.updateUI();
      setTimeout(() => this.nextTurn(), 500);
    });
  }
  
  triggerPuzzleRoom(room, player) {
    const puzzles = [
      {
        question: "Je vous montre votre reflet mais je ne suis pas un miroir. Je change avec les saisons mais je ne suis pas un arbre. Qu'est-ce que je suis ?",
        answers: ['lac', 'eau', 'étang', 'rivière', 'l\'eau', 'un lac'],
        hint: "Pensez à quelque chose de naturel qui reflète..."
      },
      {
        question: "Plus vous m'enlevez, plus je deviens grand. Qu'est-ce que je suis ?",
        answers: ['trou', 'un trou', 'le trou'],
        hint: "Pensez à quelque chose que l'on creuse..."
      },
      {
        question: "J'ai des aiguilles mais je ne couds pas. J'ai des chiffres mais je ne compte pas. Qu'est-ce que je suis ?",
        answers: ['horloge', 'montre', 'pendule', 'une horloge', 'l\'horloge'],
        hint: "Cela vous indique l'heure..."
      },
      {
        question: "Je mange tout ce que je touche, mais l'eau me tue. Qu'est-ce que je suis ?",
        answers: ['feu', 'le feu', 'flamme', 'incendie', 'les flammes'],
        hint: "Chaud et dangereux..."
      },
      {
        question: "Je vous suis partout le jour mais disparais la nuit. Je n'ai pas de poids mais je peux couvrir le monde. Qu'est-ce que je suis ?",
        answers: ['ombre', 'l\'ombre', 'une ombre', 'mon ombre'],
        hint: "La lumière est nécessaire pour me créer..."
      }
    ];
    
    const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
    
    EventModals.showPuzzleModal(puzzle, (correct, answer) => {
      if (correct) {
        const goldReward = 40 + (player.level * 10);
        const xpReward = 30 + (player.level * 5);
        player.gold += goldReward;
        player.xp += xpReward;
        this.addLog('✅', `Bonne réponse ! Vous gagnez ${goldReward} pièces d'or et ${xpReward} XP.`);
        this.checkLevelUp(player);
      } else {
        const damage = Math.ceil(player.maxHp * 0.1);
        player.hp = Math.max(1, player.hp - damage);
        this.addLog('❌', `Mauvaise réponse... Vous perdez ${damage} PV.`);
        
        if (player.hp <= 0) {
          player.alive = false;
          this.showModal('💀 Mort', `${player.name} est mort...`);
          setTimeout(() => this.nextTurn(), 2000);
          return;
        }
      }
      this.updateUI();
      setTimeout(() => this.nextTurn(), 500);
    });
  }
  
  triggerRestRoom(room, player) {
    const healAmount = Math.floor(player.maxHp * 0.5);
    const hpBefore = player.hp;
    player.hp = Math.min(player.maxHp, player.hp + healAmount);
    const actualHeal = player.hp - hpBefore;
    
    EventModals.showRestModal(player, actualHeal, () => {
      this.addLog('🛏️', `Vous vous reposez. +${actualHeal} PV.`);
      this.updateUI();
      setTimeout(() => this.nextTurn(), 500);
    });
  }
  
  triggerMerchantRoom(room, player) {
    const basePrice = 20 + (player.level * 15);
    
    const items = [
      { 
        icon: '❤️', 
        name: 'Potion de Vie', 
        description: 'Restaure 50 PV', 
        price: Math.floor(basePrice * 0.6), 
        type: 'HEALTH_POTION',
        effect: (p) => { p.hp = Math.min(p.maxHp, p.hp + 50); }
      },
      { 
        icon: '💪', 
        name: 'Potion de Force', 
        description: '+3 ATK permanent', 
        price: Math.floor(basePrice * 1.5), 
        type: 'STRENGTH_POTION',
        effect: (p) => { p.atk += 3; }
      },
      { 
        icon: '🛡️', 
        name: 'Bouclier de Fer', 
        description: '+2 DEF permanent', 
        price: Math.floor(basePrice * 1.8), 
        type: 'SHIELD',
        effect: (p) => { p.def += 2; }
      },
      { 
        icon: '⚔️', 
        name: 'Épée Enchantée', 
        description: '+5 ATK permanent', 
        price: Math.floor(basePrice * 2.5), 
        type: 'SWORD',
        effect: (p) => { p.atk += 5; }
      },
      { 
        icon: '💎', 
        name: 'Amulette Magique', 
        description: '+10 HP max permanent', 
        price: Math.floor(basePrice * 2), 
        type: 'AMULET',
        effect: (p) => { p.maxHp += 10; p.hp += 10; }
      },
      { 
        icon: '⚡', 
        name: 'Bottes de Vitesse', 
        description: '+1 case de mouvement', 
        price: Math.floor(basePrice * 3), 
        type: 'BOOTS',
        effect: (p) => { p.movementBonus = (p.movementBonus || 0) + 1; }
      }
    ];
    
    EventModals.showMerchantModal(player, items, (item) => {
      if (item.effect) {
        item.effect(player);
      }
      
      this.addLog('🏪', `Vous achetez ${item.name} pour ${item.price} pièces.`);
      
      if (item.type.includes('POTION')) {
        player.inventory.addItem(item.type, 1);
      }
      
      this.updateUI();
    });
  }
  
  triggerMysteryRoom(room, player) {
    const mysteryEvents = [
      {
        name: 'Portail Temporel',
        icon: '🌀',
        description: "Un portail scintillant vous propulse en avant dans le donjon !",
        effect: (p) => {
          const jump = 10 + Math.floor(Math.random() * 6);
          p.position = Math.min(p.position + jump, GameState.dungeon.path.length - 1);
          return { type: 'teleport', amount: jump };
        }
      },
      {
        name: 'Pluie de Pièces',
        icon: '💰',
        description: "Des pièces d'or tombent mystérieusement du plafond !",
        effect: (p) => {
          const gold = 50 + Math.floor(Math.random() * 100);
          p.gold += gold;
          return { type: 'gold', amount: gold };
        }
      },
      {
        name: 'Fontaine de Jouvence',
        icon: '⛲',
        description: "Vous buvez de l'eau magique qui restaure toute votre vitalité !",
        effect: (p) => {
          const bonusHP = Math.random() < 0.7 ? 10 : -5;
          p.maxHp = Math.max(20, p.maxHp + bonusHP);
          p.hp = p.maxHp;
          return { type: 'fountain', bonus: bonusHP };
        }
      },
      {
        name: 'Double ou Rien',
        icon: '🎲',
        description: "Lancez un dé : pair = doublez votre or, impair = perdez la moitié !",
        effect: (p) => {
          const roll = Math.floor(Math.random() * 6) + 1;
          if (roll % 2 === 0) {
            p.gold *= 2;
            return { type: 'gamble', won: true, roll, amount: p.gold };
          } else {
            p.gold = Math.floor(p.gold / 2);
            return { type: 'gamble', won: false, roll, amount: p.gold };
          }
        }
      },
      {
        name: 'Bénédiction Divine',
        icon: '✨',
        description: "Une lumière divine vous enveloppe et renforce toutes vos capacités !",
        effect: (p) => {
          p.atk += 2;
          p.def += 2;
          p.maxHp += 5;
          p.hp += 5;
          return { type: 'blessing' };
        }
      }
    ];
    
    const event = mysteryEvents[Math.floor(Math.random() * mysteryEvents.length)];
    
    EventModals.showMysteryModal(event, player, () => {
      const result = event.effect(player);
      
      switch(result.type) {
        case 'teleport':
          this.addLog('🌀', `Le portail vous propulse ${result.amount} cases en avant !`);
          break;
        case 'gold':
          this.addLog('💰', `${result.amount} pièces d'or tombent du plafond !`);
          break;
        case 'fountain':
          if (result.bonus > 0) {
            this.addLog('⛲', `Votre HP maximum augmente de ${result.bonus} !`);
          } else {
            this.addLog('⛲', `L'eau a un goût étrange... HP max -${Math.abs(result.bonus)}`);
          }
          break;
        case 'gamble':
          if (result.won) {
            this.addLog('🎲', `Vous lancez ${result.roll} ! Votre or est doublé !`);
          } else {
            this.addLog('🎲', `Vous lancez ${result.roll}... Vous perdez la moitié de votre or !`);
          }
          break;
        case 'blessing':
          this.addLog('✨', `Une bénédiction divine renforce toutes vos capacités !`);
          break;
      }
      
      this.updateUI();
      this.renderer.draw(GameState.dungeon, GameState.players);
      setTimeout(() => this.nextTurn(), 500);
    });
  }
  
  generateEnemy(playerLevel = 1) {
    const baseHP = 15;
    const baseATK = 5;

    const enemies = [
      { name: 'Gobelin', icon: '👺', hpMult: 1, atkMult: 1, speed: 4 },
      { name: 'Squelette', icon: '💀', hpMult: 0.8, atkMult: 1.2, speed: 3 },
      { name: 'Orc', icon: '👹', hpMult: 1.3, atkMult: 0.9, speed: 3 },
      { name: 'Loup Géant', icon: '🐺', hpMult: 1, atkMult: 1.1, speed: 6 },
      { name: 'Araignée Venimeuse', icon: '🕷️', hpMult: 0.7, atkMult: 1.3, speed: 5 },
      { name: 'Zombie', icon: '🧟', hpMult: 1.5, atkMult: 0.7, speed: 2 }
    ];

    const template = enemies[Math.floor(Math.random() * enemies.length)];
    const hp = Math.floor((baseHP + (playerLevel * 5)) * template.hpMult);

    return {
      id: 'enemy_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      name: template.name,
      icon: template.icon,
      sprite: template.icon, // ✅ Ajout de 'sprite' pour TacticalCombatSystem
      hp: hp,
      maxHp: hp, // ✅ Ajout de maxHp
      atk: Math.floor((baseATK + (playerLevel * 2)) * template.atkMult),
      def: Math.floor(playerLevel * 0.5),
      speed: template.speed || 4, // ✅ Ajout de speed pour l'ordre des tours
      isAlly: false, // ✅ Marquer comme ennemi
      xp: 10 + (playerLevel * 5),
      gold: 5 + Math.floor(Math.random() * (10 + playerLevel * 5))
    };
  }
  
  getRoomTypeName(type) {
    const names = {
      combat: 'de combat',
      treasure: 'au trésor',
      merchant: 'marchande',
      puzzle: 'd\'énigme',
      rest: 'de repos',
      mystery: 'mystère'
    };
    return names[type] || type;
  }
  
  // ═══════════════════════════════════════════════════════════════
  // FIN NOUVELLES FONCTIONS
  // ═══════════════════════════════════════════════════════════════

  showDiceAnimation(playerName, rawRoll, finalRoll) {
    const modal = document.getElementById('diceModal');
    const diceElement = document.getElementById('pixelDice');
    const resultElement = document.getElementById('diceResult');
    const textElement = document.getElementById('diceText');
    
    resultElement.style.display = 'none';
    resultElement.querySelector('.result-number').textContent = rawRoll;
    textElement.textContent = playerName + ' lance le dé...';
    
    modal.classList.add('active');
    
    diceElement.style.animation = 'none';
    setTimeout(() => {
      diceElement.style.animation = 'diceRoll 1s ease-out';
    }, 10);
    
    setTimeout(() => {
      resultElement.style.display = 'block';
      
      if (rawRoll !== finalRoll) {
        textElement.innerHTML = `
          Résultat : <span style="color: #888; text-decoration: line-through;">${rawRoll}</span> 
          → <span style="color: #FFD700; font-size: 1.2em;">${finalRoll}</span> !
        `;
        resultElement.querySelector('.result-number').textContent = finalRoll;
      } else {
        textElement.textContent = 'Résultat : ' + rawRoll + ' !';
      }
      
      setTimeout(() => {
        modal.classList.remove('active');
      }, 1500);
    }, 1000);
  }

  nextTurn() {
    const cp = GameState.players[GameState.currentPlayerIndex];
    
    if (cp.atkBuffTurns > 0) {
      cp.atkBuffTurns--;
      if (cp.atkBuffTurns === 0) {
        cp.atk -= cp.atkBuff;
        cp.atkBuff = 0;
        this.addLog('⚔️', cp.name + ' : Effet de force terminé');
      }
    }
    
    if (cp.defBuffTurns > 0) {
      cp.defBuffTurns--;
      if (cp.defBuffTurns === 0) {
        cp.def -= cp.defBuff;
        cp.defBuff = 0;
        this.addLog('🛡️', cp.name + ' : Effet de défense terminé');
      }
    }
    
    if (cp.invulnerableTurns > 0) {
      cp.invulnerableTurns--;
      if (cp.invulnerableTurns === 0) {
        cp.invulnerable = false;
        this.addLog('✨', cp.name + ' : Invulnérabilité terminée');
      }
    }
    
    let nextIndex = GameState.currentPlayerIndex;
    let attempts = 0;
    do {
      nextIndex = (nextIndex + 1) % GameState.players.length;
      attempts++;
      if (attempts > GameState.players.length) break;
    } while (!GameState.players[nextIndex].alive);
    
    GameState.currentPlayerIndex = nextIndex;
    this.updateUI();
  }

  addLog(icon, text, important = false) {
    const log = document.getElementById('eventLog');
    const entry = document.createElement('div');
    entry.className = 'log-entry' + (important ? ' important' : '');

    // Construire le DOM de manière sûre pour éviter l'injection HTML
    const iconSpan = document.createElement('span');
    iconSpan.className = 'log-icon';
    iconSpan.textContent = icon;

    const textSpan = document.createElement('span');
    textSpan.className = 'log-text';
    textSpan.textContent = text;

    entry.appendChild(iconSpan);
    entry.appendChild(textSpan);

    log.insertBefore(entry, log.firstChild);

    while (log.children.length > 50) {
      log.removeChild(log.lastChild);
    }
  }

  showModal(title, content) {
    const titleEl = document.getElementById('infoTitle');
    const contentEl = document.getElementById('infoContent');
    if (titleEl) titleEl.textContent = title;

    // Si le contenu contient des balises HTML, on l'interprète comme HTML contrôlé,
    // sinon on l'affiche de manière sûre en tant que texte.
    if (typeof content === 'string' && /<[a-z][\s\S]*>/i.test(content)) {
      // Le contenu est du HTML (généré par le code) — on l'insère en HTML
      contentEl.innerHTML = content;
    } else {
      // Affichage sécurisé en texte (évite XSS si contenu provient d'utilisateur)
      contentEl.textContent = content;
    }

    document.getElementById('infoModal').classList.add('active');
  }

  closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
  }
}

const game = new Game();
window.addEventListener('DOMContentLoaded', async () => {
  console.log('🎮 THE LAST COVENANT - Initialisation...');

  // 🎭 NOUVEAU : Character Select System
  if (typeof CharacterSelectSystem !== 'undefined') {
    const characterSelect = new CharacterSelectSystem();
    await characterSelect.init();

    // Afficher character select et attendre choix
    characterSelect.show((selection) => {
      console.log('✅ Classe choisie:', selection.classId);

      // Stocker classe dans le jeu
      game.selectedClass = selection.classData;

      // Initialiser le jeu avec la classe
      game.init();

      // Appliquer stats de la classe au player
      game.applyClassStats(selection.classData);

      console.log('✅ Jeu prêt avec', selection.classData.name, '!');
    });
  } else {
    // Fallback si character select pas disponible
    console.warn('⚠️ Character Select non disponible, démarrage standard');
    game.init();
  }
});