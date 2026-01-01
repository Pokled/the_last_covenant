/* ═══════════════════════════════════════════════════════
   💰 ECONOMY SYSTEM - COIN-COIN DUNGEON
   Système économique avec double monnaie (Rubis/Or)
   ═══════════════════════════════════════════════════════ */

class EconomySystem {

  /* ═══════════════════════════════════════════════════════
     💎 MONNAIES
     ═══════════════════════════════════════════════════════ */

  static CURRENCY = {
    RUBY: 'RUBY',    // Monnaie en partie (temporaire)
    GOLD: 'GOLD'     // Monnaie au campement (permanent)
  };

  static CURRENCY_ICONS = {
    RUBY: '💎',
    GOLD: '💰'
  };

  /* ═══════════════════════════════════════════════════════
     🔄 CONVERSION RUBIS → OR
     ═══════════════════════════════════════════════════════ */

  /**
   * Taux de conversion de base (10 rubis = 1 or)
   */
  static BASE_RATE = 10;

  /**
   * Fluctuation du taux (±20%)
   */
  static FLUCTUATION_RANGE = 0.2;

  /**
   * Récupère le taux de conversion actuel
   * Le taux s'améliore avec le niveau du joueur
   */
  static getCurrentRate(player = null) {
    let baseRate = this.BASE_RATE;

    // Bonus de niveau : -0.1 par niveau (max -3)
    if (player && player.level) {
      const levelBonus = Math.min(3, player.level * 0.1);
      baseRate = Math.max(7, baseRate - levelBonus);
    }

    // Fluctuation aléatoire (peut être remplacée par une fluctuation basée sur le temps)
    const fluctuation = (Math.random() * 2 - 1) * this.FLUCTUATION_RANGE;
    const rate = baseRate * (1 + fluctuation);

    // Arrondir et clamp entre 7 et 12
    return Math.max(7, Math.min(12, Math.round(rate * 10) / 10));
  }

  /**
   * Convertit des rubis en or
   */
  static convertRubyToGold(rubies, player = null) {
    const rate = this.getCurrentRate(player);
    const gold = Math.floor(rubies / rate);

    console.log(`💱 Conversion: ${rubies} rubis → ${gold} or (taux: ${rate}:1)`);

    return {
      gold: gold,
      rate: rate,
      remaining: rubies % rate // Rubis restants non convertis
    };
  }

  /**
   * Convertit de l'or en rubis (pour acheter en partie avec or permanent)
   */
  static convertGoldToRuby(gold, player = null) {
    const rate = this.getCurrentRate(player);
    const rubies = gold * rate;

    console.log(`💱 Conversion: ${gold} or → ${rubies} rubis (taux: 1:${rate})`);

    return {
      rubies: rubies,
      rate: rate
    };
  }

  /* ═══════════════════════════════════════════════════════
     💎 GESTION RUBIS (Monnaie en partie)
     ═══════════════════════════════════════════════════════ */

  /**
   * Ajoute des rubis au joueur
   */
  static addRubies(player, amount) {
    if (!player.inventory) {
      console.error('❌ Player n\'a pas d\'inventaire');
      return false;
    }

    player.inventory.addItem('RUBY', amount);
    console.log(`💎 +${amount} rubis`);

    return true;
  }

  /**
   * Retire des rubis au joueur
   */
  static removeRubies(player, amount) {
    if (!player.inventory) {
      console.error('❌ Player n\'a pas d\'inventaire');
      return false;
    }

    const current = player.inventory.getItemCount('RUBY');
    if (current < amount) {
      console.warn(`⚠️ Pas assez de rubis (${current}/${amount})`);
      return false;
    }

    player.inventory.removeItem('RUBY', amount);
    console.log(`💎 -${amount} rubis`);

    return true;
  }

  /**
   * Récupère le nombre de rubis du joueur
   */
  static getRubies(player) {
    if (!player.inventory) return 0;
    return player.inventory.getItemCount('RUBY');
  }

  /**
   * Vérifie si le joueur a assez de rubis
   */
  static hasEnoughRubies(player, amount) {
    return this.getRubies(player) >= amount;
  }

  /* ═══════════════════════════════════════════════════════
     💰 GESTION OR (Monnaie permanente campement)
     ═══════════════════════════════════════════════════════ */

  /**
   * Initialise les données du campement si nécessaire
   */
  static initCampData(player) {
    if (!player.campData) {
      player.campData = {
        gold: 0,              // Or permanent
        totalGoldEarned: 0,   // Total gagné (stats)
        upgrades: [],         // Améliorations achetées
        talents: {},          // Arbre de talents
        unlocks: [],          // Contenu débloqué
        runsCompleted: 0,     // Nombre de parties terminées
        runsCount: 0          // Nombre de parties jouées
      };
      console.log('🏕️ Données campement initialisées');
    }
    return player.campData;
  }

  /**
   * Ajoute de l'or permanent au joueur
   */
  static addGold(player, amount) {
    this.initCampData(player);

    player.campData.gold += amount;
    player.campData.totalGoldEarned += amount;

    console.log(`💰 +${amount} or permanent (total: ${player.campData.gold})`);

    return true;
  }

  /**
   * Retire de l'or permanent au joueur
   */
  static removeGold(player, amount) {
    this.initCampData(player);

    if (player.campData.gold < amount) {
      console.warn(`⚠️ Pas assez d'or permanent (${player.campData.gold}/${amount})`);
      return false;
    }

    player.campData.gold -= amount;
    console.log(`💰 -${amount} or permanent (restant: ${player.campData.gold})`);

    return true;
  }

  /**
   * Récupère l'or permanent du joueur
   */
  static getGold(player) {
    this.initCampData(player);
    return player.campData.gold;
  }

  /**
   * Vérifie si le joueur a assez d'or permanent
   */
  static hasEnoughGold(player, amount) {
    return this.getGold(player) >= amount;
  }

  /* ═══════════════════════════════════════════════════════
     🔄 MIGRATION & COMPATIBILITÉ
     ═══════════════════════════════════════════════════════ */

  /**
   * Migre l'ancien système player.gold vers le nouveau
   * À appeler une seule fois lors du chargement du jeu
   */
  static migrateOldGoldSystem(player) {
    // Si player.gold existe et > 0, convertir en rubis
    if (player.gold && player.gold > 0) {
      console.log(`🔄 Migration: ${player.gold} ancien gold → rubis`);

      if (player.inventory) {
        player.inventory.addItem('RUBY', player.gold);
      }

      // Marquer comme migré
      player.goldMigrated = true;
      player.gold = 0; // Reset
    }
  }

  /**
   * Crée un getter/setter pour player.gold (compatibilité backwards)
   * Redirige vers player.inventory.getItemCount('RUBY')
   */
  static setupBackwardCompatibility(player) {
    // Définir gold comme propriété calculée
    Object.defineProperty(player, 'gold', {
      get() {
        return player.inventory ? player.inventory.getItemCount('RUBY') : 0;
      },
      set(value) {
        console.warn('⚠️ player.gold est deprecated, utilisez EconomySystem.addRubies()');
        if (player.inventory) {
          const current = player.inventory.getItemCount('RUBY');
          const diff = value - current;
          if (diff > 0) {
            player.inventory.addItem('RUBY', diff);
          } else if (diff < 0) {
            player.inventory.removeItem('RUBY', Math.abs(diff));
          }
        }
      }
    });

    console.log('✅ Compatibilité backwards player.gold configurée');
  }

  /* ═══════════════════════════════════════════════════════
     📊 STATISTIQUES & AFFICHAGE
     ═══════════════════════════════════════════════════════ */

  /**
   * Formatte un montant en monnaie avec icône
   */
  static formatCurrency(amount, currency = 'RUBY') {
    const icon = this.CURRENCY_ICONS[currency] || '💎';
    return `${icon} ${amount}`;
  }

  /**
   * Récupère le résumé économique du joueur
   */
  static getPlayerEconomy(player) {
    return {
      rubies: this.getRubies(player),
      gold: this.getGold(player),
      conversionRate: this.getCurrentRate(player),
      rubyToGoldValue: Math.floor(this.getRubies(player) / this.getCurrentRate(player)),
      totalGoldEarned: player.campData?.totalGoldEarned || 0
    };
  }

  /**
   * Affiche le résumé économique dans la console
   */
  static logPlayerEconomy(player) {
    const economy = this.getPlayerEconomy(player);

    console.log('╔════════════════════════════════════╗');
    console.log('║      💰 ÉCONOMIE DU JOUEUR         ║');
    console.log('╠════════════════════════════════════╣');
    console.log(`║ Rubis (partie)    : 💎 ${economy.rubies.toString().padStart(6)} ║`);
    console.log(`║ Or (permanent)    : 💰 ${economy.gold.toString().padStart(6)} ║`);
    console.log(`║ Taux conversion   : ${economy.conversionRate.toString().padStart(4)}:1   ║`);
    console.log(`║ Valeur en or      : 💰 ${economy.rubyToGoldValue.toString().padStart(6)} ║`);
    console.log('╚════════════════════════════════════╝');
  }

  /* ═══════════════════════════════════════════════════════
     🎯 FIN DE PARTIE
     ═══════════════════════════════════════════════════════ */

  /**
   * Appelé en fin de partie (victoire ou défaite)
   * Convertit les rubis restants en or permanent
   */
  static endRunConversion(player, victory = false) {
    this.initCampData(player);

    const rubies = this.getRubies(player);

    // Bonus de victoire : +20% de conversion
    let bonusMultiplier = victory ? 1.2 : 1.0;

    const conversion = this.convertRubyToGold(rubies, player);
    const goldEarned = Math.floor(conversion.gold * bonusMultiplier);

    // Ajouter l'or permanent
    this.addGold(player, goldEarned);

    // Stats
    player.campData.runsCount++;
    if (victory) player.campData.runsCompleted++;

    console.log('═══════════════════════════════════');
    console.log('🏁 FIN DE PARTIE - CONVERSION');
    console.log('═══════════════════════════════════');
    console.log(`💎 Rubis gagnés : ${rubies}`);
    console.log(`💱 Taux : ${conversion.rate}:1`);
    console.log(`${victory ? '🎉 Bonus victoire : +20%' : ''}`);
    console.log(`💰 Or gagné : ${goldEarned}`);
    console.log(`💰 Or total : ${player.campData.gold}`);
    console.log('═══════════════════════════════════');

    return {
      rubies: rubies,
      gold: goldEarned,
      totalGold: player.campData.gold,
      rate: conversion.rate,
      victory: victory
    };
  }

  /* ═══════════════════════════════════════════════════════
     🏕️ PRÉPARATION CAMPEMENT (FUTUR)
     ═══════════════════════════════════════════════════════ */

  /**
   * Structure pour les talents (à implémenter)
   */
  static initTalents(player) {
    this.initCampData(player);

    if (!player.campData.talents.dice_mastery) {
      player.campData.talents = {
        dice_mastery: {
          reroll_cost_reduction: 0,    // -X% corruption (max 50%)
          extra_fragments: 0,           // +X fragments max (max 5)
          modifier_bonus: 0,            // Modifier +3/+4 au lieu de +2 (max 2)
          prophecy_range: 3,            // Voir X jets (max 5)
          unlock_sacrifice: false       // Débloquer sacrifice de dés
        },
        economy: {
          better_conversion_rate: 0,    // -X au taux (max 3)
          shop_discount: 0,             // -X% prix boutique (max 30%)
          loot_bonus: 0,                // +X% rubis trouvés (max 50%)
          merchant_luck: 0              // +X% items rares marchand (max 25%)
        },
        combat: {
          starting_hp_bonus: 0,         // +X HP de base (max 50)
          starting_atk_bonus: 0,        // +X ATK de base (max 10)
          starting_def_bonus: 0,        // +X DEF de base (max 10)
          crit_chance_bonus: 0          // +X% crit (max 15%)
        },
        exploration: {
          starting_items: [],           // Items de départ
          map_reveal_range: 0,          // Révèle +X cases (max 3)
          trap_detection: 0,            // +X% détecter pièges (max 50%)
          secret_room_chance: 0         // +X% salles secrètes (max 25%)
        }
      };

      console.log('🌳 Talents initialisés');
    }

    return player.campData.talents;
  }

  /**
   * Achète un niveau de talent
   */
  static buyTalent(player, tree, talent, cost) {
    if (!this.hasEnoughGold(player, cost)) {
      return { success: false, reason: 'Pas assez d\'or' };
    }

    this.initTalents(player);

    // Vérifier que le talent existe
    if (!player.campData.talents[tree] || !player.campData.talents[tree].hasOwnProperty(talent)) {
      return { success: false, reason: 'Talent inconnu' };
    }

    // Retirer l'or
    if (!this.removeGold(player, cost)) {
      return { success: false, reason: 'Erreur de paiement' };
    }

    // Augmenter le talent
    if (typeof player.campData.talents[tree][talent] === 'number') {
      player.campData.talents[tree][talent]++;
    } else if (typeof player.campData.talents[tree][talent] === 'boolean') {
      player.campData.talents[tree][talent] = true;
    } else if (Array.isArray(player.campData.talents[tree][talent])) {
      // Pour starting_items, ajouter à la liste
    }

    console.log(`🌳 Talent acheté: ${tree}.${talent} (coût: ${cost} or)`);

    return { success: true, talent: player.campData.talents[tree][talent] };
  }
}

/* ═══════════════════════════════════════════════════════
   🌍 EXPORT GLOBAL
   ═══════════════════════════════════════════════════════ */

if (typeof window !== 'undefined') {
  window.EconomySystem = EconomySystem;
  console.log('💰 Economy System loaded');
}
