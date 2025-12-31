# 🔗 SYNTHÈSE SYSTÉMIQUE - THE LAST COVENANT

**Date:** 30 décembre 2025  
**Objectif:** Lier tous les systèmes (Combat, Stats, Corruption, Économie, Forge) de manière cohérente

---

## 📊 VUE D'ENSEMBLE - LES 5 PILIERS

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   JOUEUR    │────▶│   COMBAT     │────▶│  CORRUPTION  │
│  (Stats)    │     │  (Actions)   │     │  (Inévitable)│
└─────────────┘     └──────────────┘     └──────────────┘
      │                    │                      │
      │                    ▼                      ▼
      │             ┌──────────────┐      ┌──────────────┐
      └────────────▶│   ÉCONOMIE   │◀────▶│    FORGE     │
                    │   (Or/Items) │      │ (Amélioration)│
                    └──────────────┘      └──────────────┘
```

---

## 🎮 1. STATS JOUEUR (PlayerStatsSystem.js)

### Stats de Combat
```javascript
{
    HP: 100,
    maxHP: 100,
    ATK: 15,        // Dégâts de base
    DEF: 10,        // Réduction de dégâts
    CRIT_CHANCE: 0.10,  // 10% chance
    CRIT_DAMAGE: 1.5,   // x1.5 dégâts
    SPEED: 10,      // Initiative
    DODGE: 0.05     // 5% esquive
}
```

### Économie
```javascript
{
    gold: 100,              // Or de départ
    maxSlots: 20,           // Inventaire
    items: []               // Items possédés
}
```

### Équipement (4 slots)
```javascript
{
    weapon: null,   // Arme (+ATK, +CRIT)
    armor: null,    // Armure (+DEF, +HP)
    relic1: null,   // Relique 1 (effets spéciaux)
    relic2: null    // Relique 2 (effets spéciaux)
}
```

### Formules de Calcul
```javascript
// Dégâts finaux
damageDealt = (ATK * weaponMultiplier) - enemyDEF
if (isCrit) damageDealt *= CRIT_DAMAGE

// Dégâts reçus
damageReceived = enemyATK - (DEF * armorMultiplier)

// HP régénération (hors combat)
regenRate = corruption < 5 ? 0.1 : 0.05  // Corruption ralentit regen
```

---

## ⚔️ 2. SYSTÈME DE COMBAT (CombatSystem.js)

### Flow Simplifié
```
1. TOUR JOUEUR
   ↓
2. Choisir 1 ACTION (Move / Attack / Special / Dice)
   ↓
3. Preview visuel
   ↓
4. Confirmer → Résolution
   ↓
5. TOUR ENNEMIS
   ↓
6. Retour étape 1
```

### Actions Disponibles
| Action | Coût | Effet | Range |
|--------|------|-------|-------|
| **Move** | 1 action | Déplacement 1 case | Adjacent |
| **Attack** | 1 action | ATK vs ennemi | Mêlée (1 case) |
| **Special** | 1 action | Capacité classe | Variable |
| **Defend** | 1 action | +50% DEF ce tour | Self |
| **Dice Roll** | Gratuit | Invoque Thalys | 1x/combat |

### Dégâts & Résolution
```javascript
// ATTAQUE BASIQUE
baseDamage = playerStats.ATK
enemyDefense = enemy.DEF
finalDamage = Math.max(1, baseDamage - enemyDefense)

// CRITIQUE
if (Math.random() < playerStats.CRIT_CHANCE) {
    finalDamage *= playerStats.CRIT_DAMAGE
    showCritEffect()
}

// CORRUPTION BONUS (Tentation)
if (corruption >= 5) {
    finalDamage += Math.floor(corruption / 5)  // +1 ATK par palier
}
```

---

## 💀 3. SYSTÈME DE CORRUPTION (CorruptionSystem.js)

### Échelle (0-15+)
```
┌─────────────┬─────────┬─────────────────────────────┐
│ PALIER      │ RANGE   │ EFFETS                      │
├─────────────┼─────────┼─────────────────────────────┤
│ Le Hasard   │ 0-4     │ Neutre, monde juste         │
│ Le Doute    │ 5-8     │ +ATK, options tentantes     │
│ Le Pacte    │ 9-12    │ +Pouvoir, -Sanity, NPCs     │
│ L'Abîme     │ 13-15+  │ Pouvoir max, fin proche     │
└─────────────┴─────────┴─────────────────────────────┘
```

### Sources de Corruption
| Action | Corruption Gagnée |
|--------|-------------------|
| Utiliser le Dé (forcer un 6) | +2 |
| Tuer un innocent | +3 |
| Sacrifier un allié | +5 |
| Choisir option "corrompue" | +1 |
| Équiper item maudit | Variable |
| Mourir et revivre | +1 |

### Effets de la Corruption

#### ✅ AVANTAGES (Tentation)
```javascript
// Bonus ATK
bonusATK = Math.floor(corruption / 5)  // +1 ATK tous les 5 points

// Nouvelles options
if (corruption >= 5) {
    unlockDarkOptions()  // Dialogues + choix interdits
}

// Pouvoir du Dé
if (corruption >= 9) {
    diceRerollAvailable = true
}
```

#### ❌ INCONVÉNIENTS (Prix)
```javascript
// Malus DEF
maluseDEF = corruption > 8 ? -2 : 0

// Régénération HP
regenRate = corruption < 5 ? 0.1 : 0.05

// Prix marchand
priceMultiplier = 1 + (corruption * 0.05)  // +5% par point

// NPCs fuient
if (corruption >= 13) {
    cortegeMembersFlee()
}
```

---

## 💰 4. SYSTÈME ÉCONOMIQUE

### Sources d'Or
| Source | Or gagné |
|--------|----------|
| Tuer un ennemi commun | 10-20 |
| Tuer un boss | 50-100 |
| Coffre trouvé | 20-50 |
| Vendre un item | 50% prix achat |
| Quête complétée | Variable |

### Dépenses d'Or
| Dépense | Coût (base) |
|---------|-------------|
| Amélioration forge | 50-200 |
| Achat marchand | Variable |
| Purification (Jardinier) | 100 x corruption |
| Rituel (Moira) | 50+ |
| Rations (Grimm) | 10-30 |

### Formule Prix avec Corruption
```javascript
finalPrice = basePrice * (1 + corruption * 0.05)

// Exemple :
// Item 100 gold
// Corruption 10
// Prix final = 100 * (1 + 10 * 0.05) = 150 gold
```

---

## ⚒️ 5. SYSTÈME DE FORGE (Drenvar)

### Types d'Amélioration

#### A. Amélioration d'Arme
```javascript
{
    name: "Épée Rouillée → Épée Affûtée",
    cost: 50,
    materials: ["Larme de Krovax x1"],
    effect: {
        ATK: +3,
        CRIT_CHANCE: +0.05  // +5%
    }
}
```

#### B. Amélioration d'Armure
```javascript
{
    name: "Armure Rapiécée → Armure Renforcée",
    cost: 75,
    materials: ["Plaque de Fer x2"],
    effect: {
        DEF: +5,
        maxHP: +20
    }
}
```

#### C. Fusion d'Items
```javascript
{
    name: "Fusion de 2 items cassés",
    cost: 100,
    input: ["Item Cassé x2"],
    output: "Item Random (Rare 20%)",
    corruption: +1  // Prix sombre
}
```

### Matériaux de Forge

#### Larmes de Krovax 🔥
- **Source:** Trouvées dans salles de guerre (15% drop)
- **Usage:** Chauffer le métal pour soudure
- **Effet:** Permet amélioration +Tier

#### Plaques de Fer ⚙️
- **Source:** Ennemis armurés (25% drop)
- **Usage:** Renforcer armures
- **Effet:** +DEF, +HP

#### Fragments d'Âme 💀
- **Source:** Boss uniquement (100% drop)
- **Usage:** Enchantements spéciaux
- **Effet:** Ajoute propriétés magiques
- **WARNING:** +1 corruption par utilisation

### Interface Forge

```
┌────────────────────────────────────────┐
│  ⚒️ DRENVAR - L'ÉCORCHEUR DE FER      │
├────────────────────────────────────────┤
│                                        │
│  [Slot Arme]    →  [Preview]          │
│  Épée Rouillée  →  Épée Affûtée       │
│                     ATK: 15 → 18       │
│                     CRIT: 10% → 15%    │
│                                        │
│  Coût: 50 💰                           │
│  Matériaux: Larme de Krovax (1/1) ✓   │
│                                        │
│  [Améliorer]  [Annuler]                │
└────────────────────────────────────────┘
```

---

## 📦 6. DATABASE ITEMS

### Structure d'un Item
```javascript
{
    id: "rusty_sword",
    name: "Épée Rouillée",
    type: "weapon",
    rarity: "common",  // common, uncommon, rare, legendary, cursed
    tier: 1,           // 1-5
    
    // Stats
    stats: {
        ATK: +5,
        CRIT_CHANCE: 0.05
    },
    
    // Économie
    value: 50,         // Prix de base
    sellValue: 25,     // 50% du prix
    
    // Amélioration
    upgradeTo: "sharpened_sword",
    upgradeCost: 50,
    upgradeMaterials: [
        { id: "krovax_tear", amount: 1 }
    ],
    
    // Lore
    description: "Une lame qui a vu trop de batailles. Elle demande à être recousue.",
    flavorText: "La rouille cache encore une âme tranchante.",
    
    // Corruption
    corruptionCost: 0  // Items maudits ont un coût
}
```

### Catégories d'Items

#### 🗡️ ARMES (Tier 1-5)
```javascript
// Tier 1 : Départ
{ id: "rusty_sword", ATK: +5, value: 50 }
{ id: "cracked_axe", ATK: +7, CRIT: -0.05, value: 40 }

// Tier 2 : Amélioré
{ id: "sharpened_sword", ATK: +8, CRIT: +0.05, value: 100 }

// Tier 3 : Rare
{ id: "corrupted_blade", ATK: +12, corruption: +1/hit, value: 200 }

// Tier 4 : Légendaire
{ id: "void_reaver", ATK: +18, lifesteal: 0.15, corruption: +2, value: 500 }
```

#### 🛡️ ARMURES (Tier 1-5)
```javascript
// Tier 1
{ id: "patched_armor", DEF: +5, HP: +10, value: 60 }

// Tier 2
{ id: "reinforced_armor", DEF: +8, HP: +25, value: 120 }

// Tier 3
{ id: "blood_plate", DEF: +12, HP: +50, regen: -50%, value: 250 }
```

#### 💍 RELIQUES (Effets spéciaux)
```javascript
{
    id: "ring_of_haste",
    type: "relic",
    effect: { SPEED: +3 },
    passive: "First strike in combat",
    value: 150
}

{
    id: "amulet_of_sacrifice",
    type: "relic",
    effect: { ATK: +5 },
    passive: "-1 HP per turn (max 50% HP)",
    corruption: +1,
    value: 200
}
```

#### 🧪 CONSOMMABLES
```javascript
{
    id: "grimm_stew",
    type: "consumable",
    effect: { restoreHP: 50 },
    uses: 1,
    value: 15,
    craftedBy: "Grimm"
}

{
    id: "purifying_lily",
    type: "consumable",
    effect: { corruption: -2 },
    uses: 1,
    value: 100,
    craftedBy: "Jardinier"
}
```

---

## 🔗 7. INTÉGRATION SYSTÉMIQUE

### Flow Complet : Du Combat à la Forge

```
1. COMBAT
   ├─ Tuer ennemi → Drop or (10-20💰) + Items (30%)
   ├─ Utiliser Dé → +2 corruption
   └─ Victoire → XP + Loot

2. RETOUR CAMP
   ├─ Inventaire plein d'items
   ├─ Or accumulé
   └─ Corruption gagnée (ex: 5%)

3. CHOIX AU CAMP
   ├─ ⚒️ DRENVAR (Forge)
   │   ├─ Améliorer arme : -50💰, -Matériaux
   │   └─ ATK: 15 → 18
   │
   ├─ 🌸 JARDINIER (Purification)
   │   ├─ Réduire corruption : -100💰
   │   └─ Corruption: 5% → 3%
   │
   ├─ 💰 CORVUS (Marchand)
   │   ├─ Acheter relique : -150💰 (modifié par corruption)
   │   └─ Effet: +SPEED, First Strike
   │
   └─ 🔪 GRIMM (Rations)
       ├─ Acheter soupe : -15💰
       └─ +50 HP restauré

4. STATS RECALCULÉES
   ├─ Équipement amélioré
   ├─ Corruption ajustée
   └─ Prêt pour prochain combat

5. PROCHAIN DONJON
   └─ Stats modifiées par tous les choix précédents
```

### Exemples de Synergie

#### Exemple 1 : Build "Tank Corrompu"
```
Équipement:
- Armure: Blood Plate (+12 DEF, +50 HP, -50% regen)
- Relique: Amulet of Sacrifice (+5 ATK, -1 HP/turn)

Résultat:
- DEF: 10 + 12 = 22
- HP: 100 + 50 = 150
- ATK: 15 + 5 + 2 (corruption 10) = 22
- Corruption: 10% (+2 de l'amulet, +8 de choix)

Trade-off:
+ Tank puissant
+ Dégâts élevés
- Régénération très lente
- NPCs commencent à fuir
- Prix marchands +50%
```

#### Exemple 2 : Build "Pur Critique"
```
Équipement:
- Arme: Sharpened Sword (+8 ATK, +5% CRIT)
- Relique: Ring of Haste (+3 SPEED, First Strike)

Résultat:
- ATK: 15 + 8 = 23
- CRIT: 10% + 5% = 15%
- SPEED: 10 + 3 = 13 (attaque en premier)
- Corruption: 0% (build propre)

Trade-off:
+ Burst damage
+ Attaque toujours en premier
+ NPCs fidèles
- Pas de bonus corruption
- Items moins puissants disponibles
```

---

## 📈 8. PROGRESSION & BALANCE

### Courbe de Puissance
```
Niveau 1-3 : Survie (Items Tier 1, or rare)
Niveau 4-6 : Choix (Tier 2, assez d'or pour forger)
Niveau 7-9 : Puissance (Tier 3, corruption inévitable)
Niveau 10+ : Abîme (Tier 4-5, corruption critique)
```

### Checkpoints Économiques
```
Camp 1 : 100💰 → Acheter 1 amélioration OU 1 purification
Camp 2 : 250💰 → Améliorer arme + armure
Camp 3 : 500💰 → Acheter relique légendaire
Camp 4 : 1000💰 → Optimiser build complet
```

---

## ✅ PROCHAINES ÉTAPES

### Immédiat (Session actuelle)
1. ✅ Créer `ItemDatabase.js` avec 20-30 items
2. ✅ Implémenter interface Forge (modal interactif)
3. ✅ Lier PlayerStats ↔ Forge ↔ Corruption
4. ✅ Tester flow complet : Combat → Loot → Forge → Combat

### Court terme
- Ajouter system de crafting (Grimm)
- Interface marchand (Corvus)
- Interface purification (Jardinier)

### Moyen terme
- Balance économique complète
- Recettes de forge avancées
- Items légendaires avec quêtes

---

**Status:** 🟢 Système cohérent, prêt pour implémentation  
**Validation:** En attente feedback utilisateur
