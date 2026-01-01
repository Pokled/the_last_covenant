// ═══════════════════════════════════════════════════════════
// THALYS PACT SYSTEM - REWARDS & CORRUPTION
// "Donne-moi ton âme... et deviens INVINCIBLE."
// ═══════════════════════════════════════════════════════════

export class ThalysPactSystem {
    constructor(combatLog) {
        this.combatLog = combatLog;
        
        // Récompenses actives
        this.activeBuffs = [];
        this.permanentBonuses = {
            attack: 0,
            defense: 0,
            critChance: 0,
            lifesteal: 0,
            damageMultiplier: 1.0
        };
        
        // Seuils de corruption pour débloquer des rewards
        this.corruptionTiers = [
            { threshold: 10, unlocked: false },
            { threshold: 25, unlocked: false },
            { threshold: 40, unlocked: false },
            { threshold: 60, unlocked: false },
            { threshold: 80, unlocked: false },
            { threshold: 100, unlocked: false }
        ];
    }
    
    // ═══════════════════════════════════════════════════════════
    // RÉCOMPENSES IMMÉDIATES (à chaque lancer)
    // ═══════════════════════════════════════════════════════════
    
    getImmediateReward(diceValue, corruption) {
        const rewards = {
            1: this.getRewardTier1(corruption),
            2: this.getRewardTier2(corruption),
            3: this.getRewardTier3(corruption),
            4: this.getRewardTier4(corruption),
            5: this.getRewardTier5(corruption),
            6: this.getRewardThalys(corruption) // Face Thalys = reward ÉNORME
        };
        
        return rewards[diceValue];
    }
    
    getRewardTier1(corruption) {
        const baseReward = {
            name: "Bénédiction Mineure",
            description: "+2 dégâts ce tour",
            effect: { attack: 2 },
            duration: 1,
            icon: "⚔️"
        };
        
        // Bonus si corruption élevée
        if (corruption > 50) {
            baseReward.effect.attack = 5;
            baseReward.description = "+5 dégâts ce tour (corrompu)";
        }
        
        return baseReward;
    }
    
    getRewardTier2(corruption) {
        return {
            name: "Bouclier Sombre",
            description: "+3 défense ce tour",
            effect: { defense: 3 },
            duration: 1,
            icon: "🛡️",
            corruptionBonus: corruption > 50 ? { defense: 2 } : null
        };
    }
    
    getRewardTier3(corruption) {
        return {
            name: "Rage du Chaos",
            description: "Coup critique garanti",
            effect: { guaranteedCrit: true },
            duration: 1,
            icon: "💥",
            corruptionBonus: corruption > 50 ? { critDamage: 1.5 } : null
        };
    }
    
    getRewardTier4(corruption) {
        return {
            name: "Drain de Vie",
            description: "Vole 25% des dégâts infligés",
            effect: { lifesteal: 0.25 },
            duration: 2,
            icon: "🩸",
            corruptionBonus: corruption > 50 ? { lifesteal: 0.15 } : null
        };
    }
    
    getRewardTier5(corruption) {
        return {
            name: "Frappe Dévastatrice",
            description: "+10 dégâts et ignore l'armure",
            effect: { 
                attack: 10,
                armorPierce: true 
            },
            duration: 1,
            icon: "⚡",
            corruptionBonus: corruption > 50 ? { attack: 5 } : null
        };
    }
    
    getRewardThalys(corruption) {
        // Face 6 = REWARD MASSIF mais +15% corruption
        const thalysRewards = [
            {
                name: "PACTE : Main de Thalys",
                description: "x2 dégâts pendant 3 tours",
                effect: { damageMultiplier: 2.0 },
                duration: 3,
                icon: "👁️"
            },
            {
                name: "PACTE : Régénération Profane",
                description: "Regen 15 HP/tour pendant 3 tours",
                effect: { regen: 15 },
                duration: 3,
                icon: "👁️"
            },
            {
                name: "PACTE : Omniscience",
                description: "Vois les prochains coups ennemis (100% dodge)",
                effect: { dodge: 1.0 },
                duration: 2,
                icon: "👁️"
            },
            {
                name: "PACTE : Armure Vivante",
                description: "+20 défense et réfléchit 50% dégâts",
                effect: { 
                    defense: 20,
                    thorns: 0.5 
                },
                duration: 3,
                icon: "👁️"
            }
        ];
        
        // Choisir aléatoirement
        const reward = thalysRewards[Math.floor(Math.random() * thalysRewards.length)];
        
        // Bonus si très corrompu
        if (corruption > 66) {
            reward.duration += 2;
            reward.description += " (AMPLIFIÉ)";
        }
        
        return reward;
    }
    
    // ═══════════════════════════════════════════════════════════
    // BONUS PERMANENTS (paliers de corruption)
    // ═══════════════════════════════════════════════════════════
    
    checkCorruptionTiers(corruption) {
        const unlockedRewards = [];
        
        this.corruptionTiers.forEach(tier => {
            if (corruption >= tier.threshold && !tier.unlocked) {
                tier.unlocked = true;
                const reward = this.unlockPermanentBonus(tier.threshold);
                unlockedRewards.push(reward);
            }
        });
        
        return unlockedRewards;
    }
    
    unlockPermanentBonus(threshold) {
        const bonuses = {
            10: {
                name: "🔮 Éveil de Thalys",
                description: "+2 dégâts PERMANENTS",
                bonus: { attack: 2 },
                lore: "Thalys commence à s'intéresser à toi..."
            },
            25: {
                name: "👁️ Regard du Chaos",
                description: "+10% chances de critique PERMANENTS",
                bonus: { critChance: 0.10 },
                lore: "Ton troisième œil s'ouvre..."
            },
            40: {
                name: "🩸 Soif de Sang",
                description: "+5% vol de vie PERMANENT",
                bonus: { lifesteal: 0.05 },
                lore: "La vie de tes ennemis te nourrit..."
            },
            60: {
                name: "⚡ Puissance Corrompue",
                description: "x1.25 dégâts PERMANENTS",
                bonus: { damageMultiplier: 0.25 },
                lore: "Le pouvoir de Thalys coule dans tes veines..."
            },
            80: {
                name: "🛡️ Résilience Profane",
                description: "+5 défense PERMANENTS",
                bonus: { defense: 5 },
                lore: "Ton corps devient résistant, presque inhumain..."
            },
            100: {
                name: "👁️👁️ FUSION AVEC THALYS",
                description: "TOUS LES BONUS x2 !!!",
                bonus: { 
                    attack: 10,
                    defense: 10,
                    critChance: 0.20,
                    damageMultiplier: 0.5,
                    lifesteal: 0.10
                },
                lore: "TU ES THALYS. THALYS EST TOI."
            }
        };
        
        const reward = bonuses[threshold];
        if (reward) {
            this.applyPermanentBonus(reward.bonus);
            
            if (this.combatLog) {
                this.combatLog.add(`🎁 DÉBLOCAGE : ${reward.name}`, 'success');
                this.combatLog.add(`   ${reward.description}`, 'info');
                this.combatLog.add(`   "${reward.lore}"`, 'info');
            }
        }
        
        return reward;
    }
    
    applyPermanentBonus(bonus) {
        if (bonus.attack) this.permanentBonuses.attack += bonus.attack;
        if (bonus.defense) this.permanentBonuses.defense += bonus.defense;
        if (bonus.critChance) this.permanentBonuses.critChance += bonus.critChance;
        if (bonus.lifesteal) this.permanentBonuses.lifesteal += bonus.lifesteal;
        if (bonus.damageMultiplier) this.permanentBonuses.damageMultiplier += bonus.damageMultiplier;
    }
    
    // ═══════════════════════════════════════════════════════════
    // BUFFS TEMPORAIRES
    // ═══════════════════════════════════════════════════════════
    
    applyReward(reward) {
        // Ajouter aux buffs actifs
        this.activeBuffs.push({
            ...reward,
            turnsRemaining: reward.duration
        });
        
        if (this.combatLog) {
            this.combatLog.add(`🎁 ${reward.icon} ${reward.name}`, 'success');
            this.combatLog.add(`   ${reward.description}`, 'info');
        }
    }
    
    tickBuffs() {
        // Appelé à chaque tour
        this.activeBuffs = this.activeBuffs.filter(buff => {
            buff.turnsRemaining--;
            
            if (buff.turnsRemaining === 0) {
                if (this.combatLog) {
                    this.combatLog.add(`⏰ ${buff.name} expire`, 'info');
                }
                return false;
            }
            return true;
        });
    }
    
    getActiveBuffsStats() {
        // Calculer tous les buffs actifs
        const stats = {
            attack: this.permanentBonuses.attack,
            defense: this.permanentBonuses.defense,
            critChance: this.permanentBonuses.critChance,
            lifesteal: this.permanentBonuses.lifesteal,
            damageMultiplier: this.permanentBonuses.damageMultiplier,
            armorPierce: false,
            guaranteedCrit: false,
            dodge: 0,
            regen: 0,
            thorns: 0
        };
        
        this.activeBuffs.forEach(buff => {
            if (buff.effect.attack) stats.attack += buff.effect.attack;
            if (buff.effect.defense) stats.defense += buff.effect.defense;
            if (buff.effect.lifesteal) stats.lifesteal += buff.effect.lifesteal;
            if (buff.effect.damageMultiplier) stats.damageMultiplier += buff.effect.damageMultiplier;
            if (buff.effect.armorPierce) stats.armorPierce = true;
            if (buff.effect.guaranteedCrit) stats.guaranteedCrit = true;
            if (buff.effect.dodge) stats.dodge += buff.effect.dodge;
            if (buff.effect.regen) stats.regen += buff.effect.regen;
            if (buff.effect.thorns) stats.thorns += buff.effect.thorns;
            
            // Bonus de corruption
            if (buff.corruptionBonus) {
                if (buff.corruptionBonus.attack) stats.attack += buff.corruptionBonus.attack;
                if (buff.corruptionBonus.defense) stats.defense += buff.corruptionBonus.defense;
                if (buff.corruptionBonus.critDamage) stats.critDamage = buff.corruptionBonus.critDamage;
                if (buff.corruptionBonus.lifesteal) stats.lifesteal += buff.corruptionBonus.lifesteal;
            }
        });
        
        return stats;
    }
    
    // ═══════════════════════════════════════════════════════════
    // UI
    // ═══════════════════════════════════════════════════════════
    
    getBuffsDisplay() {
        if (this.activeBuffs.length === 0) {
            return '<div class="no-buffs">Aucun buff actif</div>';
        }
        
        return this.activeBuffs.map(buff => `
            <div class="buff-item">
                <div class="buff-icon">${buff.icon}</div>
                <div class="buff-info">
                    <div class="buff-name">${buff.name}</div>
                    <div class="buff-desc">${buff.description}</div>
                    <div class="buff-duration">${buff.turnsRemaining} tour(s)</div>
                </div>
            </div>
        `).join('');
    }
    
    getPermanentBonusesDisplay() {
        const bonuses = this.permanentBonuses;
        const items = [];
        
        if (bonuses.attack > 0) {
            items.push(`⚔️ +${bonuses.attack} ATK`);
        }
        if (bonuses.defense > 0) {
            items.push(`🛡️ +${bonuses.defense} DEF`);
        }
        if (bonuses.critChance > 0) {
            items.push(`💥 +${(bonuses.critChance * 100).toFixed(0)}% CRIT`);
        }
        if (bonuses.lifesteal > 0) {
            items.push(`🩸 +${(bonuses.lifesteal * 100).toFixed(0)}% LIFESTEAL`);
        }
        if (bonuses.damageMultiplier > 1.0) {
            items.push(`⚡ x${bonuses.damageMultiplier.toFixed(2)} DMG`);
        }
        
        if (items.length === 0) {
            return '<div class="no-bonuses">Aucun bonus permanent</div>';
        }
        
        return items.map(item => 
            `<div class="perm-bonus-item">${item}</div>`
        ).join('');
    }
    
    reset() {
        this.activeBuffs = [];
        this.permanentBonuses = {
            attack: 0,
            defense: 0,
            critChance: 0,
            lifesteal: 0,
            damageMultiplier: 1.0
        };
        this.corruptionTiers.forEach(tier => tier.unlocked = false);
    }
}

// ═══════════════════════════════════════════════════════════
// VISUAL FEEDBACK (particules reward)
// ═══════════════════════════════════════════════════════════

export function showRewardParticles(container, reward) {
    const colors = {
        '⚔️': '#ff4444',
        '🛡️': '#4444ff',
        '💥': '#ffaa00',
        '🩸': '#cc0000',
        '⚡': '#ffff00',
        '👁️': '#9b59b6'
    };
    
    const color = colors[reward.icon] || '#ffffff';
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'reward-particle';
        particle.textContent = reward.icon;
        
        const angle = (Math.PI * 2 * i) / 20;
        const distance = 50 + Math.random() * 50;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        particle.style.cssText = `
            position: absolute;
            left: 50%;
            top: 50%;
            font-size: 20px;
            pointer-events: none;
            animation: rewardParticle 1s ease-out forwards;
            --x: ${x}px;
            --y: ${y}px;
        `;
        
        container.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
}

// Ajouter au CSS :
/*
@keyframes rewardParticle {
    0% {
        transform: translate(-50%, -50%) scale(0);
        opacity: 1;
    }
    100% {
        transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(1);
        opacity: 0;
    }
}
*/
