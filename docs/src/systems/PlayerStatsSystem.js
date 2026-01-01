/**
 * ⚔️ PLAYER STATS SYSTEM - THE LAST COVENANT
 * 
 * Gère toutes les statistiques du joueur :
 * - Stats de combat (HP, ATK, DEF, CRIT, SPEED)
 * - Inventaire (grid 20 slots)
 * - Équipement (arme, armure, 2 reliques)
 * - Gold & économie
 * - Cortège (NPCs sauvés)
 * - Intégration avec CorruptionSystem
 * 
 * @version 1.0.0
 */

export class PlayerStatsSystem {
    constructor(gameInstance, corruptionSystem) {
        this.game = gameInstance;
        this.corruption = corruptionSystem;
        
        // ═════════════════════════════════════════════════════════
        // STATS DE BASE
        // ═════════════════════════════════════════════════════════
        this.baseStats = {
            HP: 100,
            maxHP: 100,
            ATK: 15,
            DEF: 10,
            CRIT_CHANCE: 0.10,  // 10%
            CRIT_DAMAGE: 1.5,   // 150% dégâts
            SPEED: 10,
            DODGE: 0.05         // 5% esquive
        };
        
        // Stats actuelles (après équipement + corruption)
        this.currentStats = { ...this.baseStats };
        
        // ═════════════════════════════════════════════════════════
        // INVENTAIRE (Style Diablo/BG3)
        // ═════════════════════════════════════════════════════════
        this.inventory = {
            gold: 100,
            maxSlots: 20,
            items: []  // Array d'items
        };
        
        // ═════════════════════════════════════════════════════════
        // ÉQUIPEMENT
        // ═════════════════════════════════════════════════════════
        this.equipment = {
            weapon: null,      // Arme principale
            armor: null,       // Armure
            relic1: null,      // Relique 1
            relic2: null       // Relique 2
        };
        
        // ═════════════════════════════════════════════════════════
        // CORTÈGE (NPCs sauvés)
        // ═════════════════════════════════════════════════════════
        this.cortege = [];
        
        // ═════════════════════════════════════════════════════════
        // HISTORIQUE & STATS
        // ═════════════════════════════════════════════════════════
        this.stats = {
            deaths: 0,
            enemiesKilled: 0,
            damageDealt: 0,
            damageTaken: 0,
            goldEarned: 0,
            goldSpent: 0,
            itemsFound: 0,
            npcsSaved: 0
        };
        
        // Modificateur de corruption pour items (influence prix)
        this.corruptionModifier = 1.0;
        
        console.log('⚔️ PlayerStatsSystem initialisé');
    }
    
    // ═════════════════════════════════════════════════════════
    // STATS - Calcul avec équipement + corruption
    // ═════════════════════════════════════════════════════════
    
    /**
     * Recalcule toutes les stats (base + équipement + corruption)
     */
    recalculateStats() {
        // Copie des stats de base
        this.currentStats = { ...this.baseStats };
        
        // Ajouter bonus équipement
        Object.values(this.equipment).forEach(item => {
            if (item && item.stats) {
                this.applyItemStats(item);
            }
        });
        
        // Appliquer effets de corruption
        if (this.corruption) {
            this.applyCorruptionEffects();
        }
        
        // Clamper HP entre 0 et maxHP
        this.currentStats.HP = Math.max(0, Math.min(this.currentStats.HP, this.currentStats.maxHP));
        
        // Émettre event
        this.emitStatsChanged();
    }
    
    /**
     * Applique les stats d'un item
     */
    applyItemStats(item) {
        if (!item.stats) return;
        
        const stats = item.stats;
        
        // Stats additives
        if (stats.HP) this.currentStats.maxHP += stats.HP;
        if (stats.ATK) this.currentStats.ATK += stats.ATK;
        if (stats.DEF) this.currentStats.DEF += stats.DEF;
        if (stats.SPEED) this.currentStats.SPEED += stats.SPEED;
        
        // Stats multiplicatives
        if (stats.CRIT_CHANCE) this.currentStats.CRIT_CHANCE += stats.CRIT_CHANCE;
        if (stats.CRIT_DAMAGE) this.currentStats.CRIT_DAMAGE += stats.CRIT_DAMAGE;
        if (stats.DODGE) this.currentStats.DODGE += stats.DODGE;
        
        console.log(`✅ Stats de ${item.name} appliquées`);
    }
    
    /**
     * Applique les effets de corruption sur les stats
     */
    applyCorruptionEffects() {
        const threshold = this.corruption.getCurrentThreshold();
        const effects = threshold.effects;
        
        // Pour l'instant, pas d'effets directs sur stats
        // La corruption affecte surtout la RNG et les events
        // Mais on peut ajouter ici si besoin
        
        console.log(`💜 Effets corruption appliqués (seuil: ${threshold.name})`);
    }
    
    /**
     * Retourne les stats actuelles
     */
    getStats() {
        return { ...this.currentStats };
    }
    
    // ═════════════════════════════════════════════════════════
    // COMBAT - Dégâts & Soins
    // ═════════════════════════════════════════════════════════
    
    /**
     * Inflige des dégâts au joueur
     * @param {number} damage - Dégâts bruts
     * @param {string} source - Source des dégâts
     * @returns {number} Dégâts réels infligés
     */
    takeDamage(damage, source = 'unknown') {
        // Réduction par DEF (formule simple)
        const reduction = this.currentStats.DEF / (this.currentStats.DEF + 100);
        const finalDamage = Math.max(1, Math.floor(damage * (1 - reduction)));
        
        // Esquive ?
        if (Math.random() < this.currentStats.DODGE) {
            console.log(`💨 ESQUIVÉ ! Dégâts de ${source}`);
            return 0;
        }
        
        // Appliquer dégâts
        this.currentStats.HP -= finalDamage;
        this.stats.damageTaken += finalDamage;
        
        console.log(`💔 -${finalDamage} HP (${source}) → ${this.currentStats.HP}/${this.currentStats.maxHP}`);
        
        // Mort ?
        if (this.currentStats.HP <= 0) {
            this.onDeath();
        }
        
        this.emitStatsChanged();
        return finalDamage;
    }
    
    /**
     * Soigne le joueur
     * @param {number} amount - Montant de soin
     * @returns {number} Soin réel appliqué
     */
    heal(amount) {
        const oldHP = this.currentStats.HP;
        this.currentStats.HP = Math.min(this.currentStats.maxHP, this.currentStats.HP + amount);
        const actualHeal = this.currentStats.HP - oldHP;
        
        console.log(`💚 +${actualHeal} HP → ${this.currentStats.HP}/${this.currentStats.maxHP}`);
        
        this.emitStatsChanged();
        return actualHeal;
    }
    
    /**
     * Calcule les dégâts infligés par le joueur
     * @param {number} baseMultiplier - Multiplicateur de base (ex: 1.0 pour attaque normale)
     * @returns {Object} { damage, isCrit }
     */
    calculateDamage(baseMultiplier = 1.0) {
        let damage = this.currentStats.ATK * baseMultiplier;
        let isCrit = false;
        
        // Critique ?
        if (Math.random() < this.currentStats.CRIT_CHANCE) {
            damage *= this.currentStats.CRIT_DAMAGE;
            isCrit = true;
        }
        
        // Variance ±10%
        const variance = 0.9 + Math.random() * 0.2;
        damage = Math.floor(damage * variance);
        
        this.stats.damageDealt += damage;
        
        return { damage, isCrit };
    }
    
    /**
     * Mort du joueur
     */
    onDeath() {
        this.stats.deaths++;
        this.currentStats.HP = 0;
        
        console.log('💀 MORT !');
        
        // NE PAS ressusciter automatiquement ici
        // C'est le CombatSystem qui gère ça pendant le combat
        
        // Event mort
        const event = new CustomEvent('stats:playerDeath', {
            detail: {
                deaths: this.stats.deaths
            }
        });
        window.dispatchEvent(event);
    }
    
    // ═════════════════════════════════════════════════════════
    // INVENTAIRE
    // ═════════════════════════════════════════════════════════
    
    /**
     * Ajoute un item à l'inventaire
     * @param {Object} item - Item à ajouter
     * @returns {boolean} Succès/échec
     */
    addItem(item) {
        // Inventaire plein ?
        if (this.inventory.items.length >= this.inventory.maxSlots) {
            console.log('❌ Inventaire plein !');
            return false;
        }
        
        // Stackable ?
        if (item.stackable) {
            const existing = this.inventory.items.find(i => i.id === item.id);
            if (existing && existing.stack < existing.maxStack) {
                existing.stack++;
                console.log(`📦 ${item.name} x${existing.stack}`);
                this.emitInventoryChanged();
                return true;
            }
        }
        
        // Ajouter nouvel item
        this.inventory.items.push({
            ...item,
            stack: item.stackable ? 1 : undefined
        });
        
        this.stats.itemsFound++;
        
        console.log(`✅ ${item.name} ajouté à l'inventaire`);
        this.emitInventoryChanged();
        return true;
    }
    
    /**
     * Retire un item de l'inventaire
     * @param {number} index - Index dans inventory.items
     * @returns {Object|null} Item retiré
     */
    removeItem(index) {
        if (index < 0 || index >= this.inventory.items.length) return null;
        
        const item = this.inventory.items[index];
        
        // Stackable ?
        if (item.stackable && item.stack > 1) {
            item.stack--;
            console.log(`📦 ${item.name} x${item.stack}`);
        } else {
            this.inventory.items.splice(index, 1);
            console.log(`❌ ${item.name} retiré`);
        }
        
        this.emitInventoryChanged();
        return item;
    }
    
    /**
     * Utilise un item consommable
     * @param {number} index - Index dans inventory.items
     */
    useItem(index) {
        const item = this.inventory.items[index];
        if (!item || item.type !== 'consumable') return;
        
        // Appliquer effets
        if (item.effect) {
            if (item.effect.HP) this.heal(item.effect.HP);
            if (item.effect.corruption) {
                this.corruption.addCorruption(
                    Math.abs(item.effect.corruption),
                    `Utilisation: ${item.name}`
                );
            }
        }
        
        console.log(`🍷 ${item.name} utilisé`);
        
        // Retirer item
        this.removeItem(index);
    }
    
    // ═════════════════════════════════════════════════════════
    // ÉQUIPEMENT
    // ═════════════════════════════════════════════════════════
    
    /**
     * Équipe un item
     * @param {Object} item - Item à équiper
     * @param {number} inventoryIndex - Index dans inventory.items
     * @returns {Object|null} Item déséquipé (si slot occupé)
     */
    equipItem(item, inventoryIndex) {
        if (!item || !item.slot) {
            console.log('❌ Item non équipable');
            return null;
        }
        
        const slot = item.slot; // 'weapon', 'armor', 'relic1', 'relic2'
        
        // Déséquiper l'item actuel
        const oldItem = this.equipment[slot];
        if (oldItem) {
            this.addItem(oldItem);
        }
        
        // Équiper le nouveau
        this.equipment[slot] = item;
        this.removeItem(inventoryIndex);
        
        // Recalculer stats
        this.recalculateStats();
        
        console.log(`⚔️ ${item.name} équipé (${slot})`);
        this.emitEquipmentChanged();
        
        return oldItem;
    }
    
    /**
     * Déséquipe un item
     * @param {string} slot - Slot à vider
     * @returns {Object|null} Item déséquipé
     */
    unequipItem(slot) {
        const item = this.equipment[slot];
        if (!item) return null;
        
        // Remettre dans inventaire
        if (this.addItem(item)) {
            this.equipment[slot] = null;
            this.recalculateStats();
            
            console.log(`❌ ${item.name} déséquipé`);
            this.emitEquipmentChanged();
            return item;
        }
        
        return null;
    }
    
    // ═════════════════════════════════════════════════════════
    // ÉCONOMIE
    // ═════════════════════════════════════════════════════════
    
    /**
     * Ajoute de l'or
     */
    addGold(amount) {
        this.inventory.gold += amount;
        this.stats.goldEarned += amount;
        console.log(`💰 +${amount} gold → ${this.inventory.gold}`);
        this.emitInventoryChanged();
    }
    
    /**
     * Retire de l'or
     * @returns {boolean} Succès/échec
     */
    removeGold(amount) {
        if (this.inventory.gold < amount) {
            console.log('❌ Pas assez d\'or !');
            return false;
        }
        
        this.inventory.gold -= amount;
        this.stats.goldSpent += amount;
        console.log(`💰 -${amount} gold → ${this.inventory.gold}`);
        this.emitInventoryChanged();
        return true;
    }
    
    // ═════════════════════════════════════════════════════════
    // CORTÈGE (NPCs)
    // ═════════════════════════════════════════════════════════
    
    /**
     * Ajoute un NPC au cortège
     */
    addToCortege(npc) {
        this.cortege.push(npc);
        this.stats.npcsSaved++;
        console.log(`✅ ${npc.name} rejoint le cortège (${this.cortege.length})`);
        
        const event = new CustomEvent('cortegeChanged', {
            detail: { npc, cortege: this.cortege }
        });
        window.dispatchEvent(event);
    }
    
    /**
     * Retire un NPC du cortège (mort, départ)
     */
    removeFromCortege(npcId) {
        const index = this.cortege.findIndex(n => n.id === npcId);
        if (index >= 0) {
            const npc = this.cortege.splice(index, 1)[0];
            console.log(`❌ ${npc.name} quitte le cortège`);
            
            const event = new CustomEvent('cortegeChanged', {
                detail: { npc, cortege: this.cortege, removed: true }
            });
            window.dispatchEvent(event);
        }
    }
    
    // ═════════════════════════════════════════════════════════
    // EVENTS
    // ═════════════════════════════════════════════════════════
    
    emitStatsChanged() {
        const event = new CustomEvent('playerStatsChanged', {
            detail: { stats: this.currentStats }
        });
        window.dispatchEvent(event);
    }
    
    emitInventoryChanged() {
        const event = new CustomEvent('inventoryChanged', {
            detail: { inventory: this.inventory }
        });
        window.dispatchEvent(event);
    }
    
    emitEquipmentChanged() {
        const event = new CustomEvent('equipmentChanged', {
            detail: { equipment: this.equipment }
        });
        window.dispatchEvent(event);
    }
    
    // ═════════════════════════════════════════════════════════
    // SAVE / LOAD
    // ═════════════════════════════════════════════════════════
    
    /**
     * Exporte les stats pour sauvegarde
     */
    export() {
        return {
            baseStats: this.baseStats,
            currentStats: this.currentStats,
            inventory: this.inventory,
            equipment: this.equipment,
            cortege: this.cortege,
            stats: this.stats
        };
    }
    
    /**
     * Importe les stats depuis une sauvegarde
     */
    import(data) {
        Object.assign(this.baseStats, data.baseStats);
        Object.assign(this.currentStats, data.currentStats);
        Object.assign(this.inventory, data.inventory);
        Object.assign(this.equipment, data.equipment);
        this.cortege = data.cortege || [];
        Object.assign(this.stats, data.stats);
        
        console.log('✅ Stats joueur importées');
        this.recalculateStats();
    }
}
