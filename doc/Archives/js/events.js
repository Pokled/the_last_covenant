// 🎯 GESTIONNAIRE D'ÉVÉNEMENTS DE CASES - VERSION AAA+

const Events = {
  handleTile(player, tile, game) {
    if (!tile || tile.cleared) return;
    
    switch(tile.type) {
      case 'combat':
        this.handleCombat(player, tile, game);
        break;
      case 'chest':
        this.handleChest(player, tile, game);
        break;
      case 'trap':
        this.handleTrap(player, tile, game);
        break;
      case 'merchant':
        this.handleMerchant(player, tile, game);
        break;
      case 'rest':
        this.handleRest(player, tile, game);
        break;
    }
  },
  
  // ✨ COMBAT CORRIDOR AAA+ - MODALE RAPIDE
  handleCombat(player, tile, game) {
    // 🎵 SON : Combat
    AUDIO.playSwordHit();

    tile.cleared = true;

    // Générer un ennemi de corridor (pool spécifique)
    const enemy = EnemiesDB.generateCorridorEnemy(player.level);

    game.addLog('⚔️', `${player.name} affronte un ${enemy.name} !`, true);

    // Afficher modale corridor AAA+
    if (window.eventModalCorridor) {
      window.eventModalCorridor.showCombat(enemy, player, game, () => {
        // Callback après fermeture de la modale
        game.nextTurn();
      });
    } else {
      console.warn('⚠️ EventModalCorridor non disponible, combat simple');
      // Combat simple fallback
      const damage = Math.max(1, player.atk - enemy.def);
      enemy.hp -= damage;

      if (enemy.hp <= 0) {
        game.addLog('✅', `${player.name} a vaincu le ${enemy.name} !`);
        const rubies = Math.floor(Math.random() * 10) + 5;
        EconomySystem.addRubies(player, rubies);
        setTimeout(() => AUDIO.playCoinCollect(), 300);
        game.addLog('💎', `${player.name} trouve ${rubies} rubis !`);
      } else {
        const enemyDamage = Math.max(1, enemy.atk - player.def);
        player.hp -= enemyDamage;
        AUDIO.playHurt();
        game.addLog('💔', `${player.name} perd ${enemyDamage} PV !`);

        if (player.hp <= 0) {
          player.hp = 0;
          player.alive = false;
        }
      }
      game.updateUI();
    }
  },
  
  // ✨ COFFRE CORRIDOR AAA+ - MODALE RAPIDE
  handleChest(player, tile, game) {
    tile.cleared = true;

    // 🎵 SON : Coffre
    if (AUDIO && AUDIO.playCoinCollect) {
      AUDIO.playCoinCollect();
    }

    // Créer le trésor (plus petit que les salles de trésor)
    const treasure = {
      rubies: Math.floor(Math.random() * 30) + 10,
      xp: Math.floor(Math.random() * 20) + 10
    };

    // Chance d'obtenir un item
    if (Math.random() < 0.4) {
      const items = [
        { icon: '🧪', name: 'Potion de Soin', type: 'HEALTH_POTION', effect: '+20 HP' },
        { icon: '⚡', name: 'Potion de Force', type: 'STRENGTH_POTION', effect: '+2 ATK' },
        { icon: '🛡️', name: 'Potion de Défense', type: 'DEFENSE_POTION', effect: '+2 DEF' }
      ];
      treasure.item = items[Math.floor(Math.random() * items.length)];
    }

    game.addLog('💰', `${player.name} trouve un coffre !`, true);

    // Afficher modale corridor AAA+
    if (window.eventModalCorridor) {
      window.eventModalCorridor.showTreasure(treasure, player, game, () => {
        game.nextTurn();
      });
    } else {
      console.warn('⚠️ EventModalCorridor non disponible, fallback');
      EconomySystem.addRubies(player, treasure.rubies);
      player.xp += treasure.xp;
      if (treasure.item) player.inventory.addItem(treasure.item.type, 1);
      game.addLog('💎', 'Coffre pillé !');
      game.updateUI();
    }
  },
  
  // ✨ PIÈGE CORRIDOR AAA+ - MODALE RAPIDE
  handleTrap(player, tile, game) {
    tile.cleared = true;

    // 🎵 SON : Piège
    if (AUDIO && AUDIO.playHurt) {
      AUDIO.playHurt();
    }

    const damage = Math.floor(Math.random() * 8) + 3;

    const trap = {
      name: 'Piège sournois',
      description: 'Un piège mortel se déclenche sous vos pieds !',
      damage: damage
    };

    game.addLog('🪤', `${player.name} déclenche un piège !`, true);

    // Afficher modale corridor AAA+
    if (window.eventModalCorridor) {
      window.eventModalCorridor.showTrap(trap, player, game, () => {
        game.nextTurn();
      });
    } else {
      console.warn('⚠️ EventModalCorridor non disponible, fallback');
      player.hp = Math.max(0, player.hp - damage);
      game.addLog('💀', `Piège déclenché ! -${damage} PV`);
      game.updateUI();

      if (player.hp <= 0) {
        player.alive = false;
        game.updateUI();
      }
    }
  },
  
  // ✨ MARCHAND CORRIDOR AAA+ - MODALE RAPIDE
  handleMerchant(player, tile, game) {
    // Pas de cleared = true, on peut revisiter le marchand

    game.addLog('🛒', `${player.name} rencontre un marchand ambulant...`, true);

    // Créer une petite sélection d'items (2-3 items aléatoires)
    const allItems = [
      { icon: '🧪', name: 'Potion de Soin', price: 20, effect: 'Restaure 20 HP', type: 'HEALTH_POTION' },
      { icon: '⚡', name: 'Potion de Force', price: 30, effect: '+2 ATK temporaire', type: 'STRENGTH_POTION' },
      { icon: '🛡️', name: 'Potion de Défense', price: 30, effect: '+2 DEF temporaire', type: 'DEFENSE_POTION' },
      { icon: '🗡️', name: 'Dague en fer', price: 50, effect: '+3 ATK', type: 'WEAPON' },
      { icon: '🔮', name: 'Amulette', price: 40, effect: '+1 tous stats', type: 'ACCESSORY' }
    ];

    // Sélectionner 2-3 items aléatoires
    const itemCount = Math.floor(Math.random() * 2) + 2; // 2 ou 3 items
    const items = [];
    const usedIndices = [];

    while (items.length < itemCount && usedIndices.length < allItems.length) {
      const index = Math.floor(Math.random() * allItems.length);
      if (!usedIndices.includes(index)) {
        usedIndices.push(index);
        items.push({ ...allItems[index] });
      }
    }

    // Afficher modale corridor AAA+
    if (window.eventModalCorridor) {
      window.eventModalCorridor.showMerchant(items, player, game, (item) => {
        console.log('✅ Item acheté:', item.name);
      });
    } else {
      console.warn('⚠️ EventModalCorridor non disponible, fallback');
      game.addLog('🛒', 'Marchand disponible (modale non chargée)');
    }
  },
  
  // ✨ NOUVEAU - ZONE DE REPOS
  handleRest(player, tile, game) {
    tile.cleared = true;
    
    game.addLog('🛏️', `${player.name} découvre une zone de repos...`, true);
    
    // Afficher repos AAA+
    const restModal = new RestModalAAA();
    restModal.show(player, game, () => {
      game.addLog('🛏️', 'Repos terminé');
      game.updateUI();
    });
  }
};

console.log('🎯 Gestionnaire d\'événements chargé (VERSION AAA+)');