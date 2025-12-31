# ⚔️ SYSTÈME DE COMBAT

> **Statut** : 🔴 CRITIQUE - À implémenter en priorité
> **Dernière mise à jour** : 2025-01-XX

---

## 🎯 Philosophie du Combat

Le combat dans TLC est :
- **Tactique** : Chaque décision compte
- **Punitif** : Les erreurs coûtent cher
- **Lisible** : Le joueur sait toujours ses chances
- **Intégré** : Le Dé et la Corruption sont des options tactiques

**Citation de design** :
> *"Le combat n'est jamais la solution la plus sûre. C'est un risque calculé."*

---

## 🏗️ Structure de Base

### Type
**Tour par tour avec initiative**

### Actions par Tour
**2 actions** (Move + Action OU 2 Actions OU 2 Moves)

### Ordre des Tours
Déterminé par **SPEED** (le plus rapide joue en premier)

---

## 📊 Stats de Combat

### Stats Principales

| Stat | Symbole | Description | Valeur Typique (Joueur) |
|------|---------|-------------|-------------------------|
| **Hit Points** | HP | Points de vie | 100 (début), 120-150 (équipé) |
| **Attack** | ATK | Puissance d'attaque | 15 (début), 20-40 (équipé) |
| **Defense** | DEF | Réduction de dégâts | 10 (début), 15-30 (équipé) |
| **Critical Chance** | CRIT | Probabilité de coup critique | 10% (début), 15-25% (équipé) |
| **Speed** | SPD | Ordre d'initiative | 10 (début), 8-15 selon classe |

### Stats Dérivées

| Stat | Formule | Description |
|------|---------|-------------|
| **Évasion** | `SPD / 10` (%) | Chance d'esquiver complètement |
| **Précision** | `100 - (target.SPD / 4)` (%) | Chance de toucher |
| **Armure Effective** | `DEF * (1 + corruption/100)` | DEF augmente avec corruption |

---

## ⚔️ Actions de Combat

### 1. Attaque de Base
**Coût** : 1 action
**Effet** : `Dégâts = ATK * random(0.8, 1.2)`
**Précision** : `100 - (target.SPD / 4)`%

```javascript
function basicAttack(attacker, defender) {
  const hitChance = 100 - (defender.SPD / 4);
  if (Math.random() * 100 < hitChance) {
    const baseDamage = attacker.ATK * randomRange(0.8, 1.2);
    const damage = Math.max(1, baseDamage - (defender.DEF * 0.5));
    
    // Coup critique ?
    const isCrit = Math.random() < attacker.CRIT_CHANCE;
    const finalDamage = isCrit ? damage * 2 : damage;
    
    defender.HP -= finalDamage;
    return { hit: true, damage: finalDamage, crit: isCrit };
  }
  return { hit: false };
}
```

---

### 2. Attaque Lourde
**Coût** : 2 actions
**Effet** : `Dégâts = ATK * 1.8`
**Précision** : `(100 - (target.SPD / 4)) * 0.8` (pénalité -20%)
**Trade-off** : Plus de dégâts, moins de précision, consomme le tour

```javascript
function heavyAttack(attacker, defender) {
  const hitChance = (100 - (defender.SPD / 4)) * 0.8;
  if (Math.random() * 100 < hitChance) {
    const baseDamage = attacker.ATK * 1.8;
    const damage = Math.max(1, baseDamage - (defender.DEF * 0.5));
    
    const isCrit = Math.random() < attacker.CRIT_CHANCE;
    const finalDamage = isCrit ? damage * 2 : damage;
    
    defender.HP -= finalDamage;
    return { hit: true, damage: finalDamage, crit: isCrit };
  }
  return { hit: false };
}
```

---

### 3. Défense
**Coût** : 1 action
**Effet** : Réduit dégâts subis de **50%** jusqu'au prochain tour
**Durée** : Jusqu'au début du prochain tour du joueur

```javascript
player.isDefending = true;
// Lors de la réception de dégâts :
if (player.isDefending) {
  damage *= 0.5;
}
```

---

### 4. Esquive
**Coût** : 1 action
**Effet** : `60% + (SPD / 10)` de chance d'éviter complètement la prochaine attaque
**Durée** : Jusqu'à la prochaine attaque reçue

```javascript
player.isDodging = true;
player.dodgeChance = 0.6 + (player.SPD / 10);

// Lors d'une attaque :
if (player.isDodging && Math.random() < player.dodgeChance) {
  return { dodged: true };
}
player.isDodging = false; // Consommée
```

---

### 5. Compétence de Classe
**Coût** : Variable (1-2 actions)
**Effet** : Dépend de la classe
**Cooldown** : Variable (2-5 tours)
**Corruption** : +5 à +10% selon puissance

Voir [06_CLASSES.md](06_CLASSES.md) pour détails.

---

### 6. Utiliser Objet
**Coût** : 1 action
**Effet** : Dépend de l'objet
**Limitation** : 1 objet par tour maximum

**Exemples** :
```javascript
// Potion de Soin
player.HP = Math.min(player.maxHP, player.HP + 30);

// Parchemin d'Attaque
enemy.HP -= 25; // Dégâts fixes, ignore DEF

// Objet Corrompu (ex: Fiole de Sang)
player.HP += 50;
player.corruption += 5;
```

---

### 7. Lancer le Dé 🎲
**Coût** : 1 action
**Limitation** : **1 fois par combat maximum**
**Effet** : Voir [04_SYSTEME_DES.md](04_SYSTEME_DES.md)
**Corruption** : +3 à +8% selon résultat

---

## 🔄 Déroulement d'un Tour

### Phase 1 : Détermination de l'Initiative
```javascript
combatants.sort((a, b) => b.SPD - a.SPD);
// Le plus rapide commence
```

### Phase 2 : Tour du Joueur
```
1. Affichage des options disponibles
2. Sélection de 2 actions (ou moins)
3. Exécution des actions dans l'ordre choisi
4. Calcul des effets (dégâts, buffs, etc.)
5. Vérification mort de l'ennemi
   └─ Si mort : Combat terminé, loot distribué
   └─ Si vivant : Passer au tour ennemi
```

### Phase 3 : Tour de l'Ennemi
```
1. IA choisit une action selon son pattern
2. Exécution de l'action
3. Calcul des effets
4. Vérification mort du joueur
   └─ Si mort : Résurrection (si possible) ou Game Over
   └─ Si vivant : Retour Phase 2
```

### Phase 4 : Fin de Tour
```
1. Décompte des cooldowns
2. Décompte des buffs/debuffs temporaires
3. Effets de début de tour (poison, régén, etc.)
4. Retour à Phase 2
```

---

## 🧮 Formules de Calcul

### Dégâts Standards
```javascript
function calculateDamage(attacker, defender, skillMultiplier = 1.0) {
  const baseDamage = attacker.ATK * skillMultiplier;
  const damageAfterDef = baseDamage - (defender.DEF * 0.5);
  const finalDamage = Math.max(1, damageAfterDef); // Minimum 1 dégât
  
  return finalDamage;
}
```

### Coup Critique
```javascript
function applyCritical(damage, critChance) {
  if (Math.random() < critChance) {
    return {
      damage: damage * 2,
      isCrit: true
    };
  }
  return {
    damage: damage,
    isCrit: false
  };
}
```

### Précision (Chance de Toucher)
```javascript
function checkHit(attacker, defender, skillAccuracy = 1.0) {
  const baseAccuracy = 100 - (defender.SPD / 4);
  const finalAccuracy = baseAccuracy * skillAccuracy;
  
  return Math.random() * 100 < finalAccuracy;
}
```

---

## 🤖 IA Ennemie

### Patterns de Comportement

Les ennemis ont des **patterns** (listes d'actions pondérées selon conditions).

**Exemple : Garde Corrompu**
```javascript
{
  patterns: [
    {
      action: "basicAttack",
      weight: 60,
      condition: null // Toujours disponible
    },
    {
      action: "heavyAttack",
      weight: 30,
      condition: (self, target) => self.HP < self.maxHP * 0.5
      // Active si HP < 50%
    },
    {
      action: "defend",
      weight: 10,
      condition: (self, target) => self.HP < self.maxHP * 0.3
      // Active si HP < 30%
    }
  ]
}
```

### Sélection d'Action
```javascript
function selectEnemyAction(enemy, player) {
  // Filtrer actions disponibles selon conditions
  const availableActions = enemy.patterns.filter(p => 
    !p.condition || p.condition(enemy, player)
  );
  
  // Calcul poids total
  const totalWeight = availableActions.reduce((sum, p) => sum + p.weight, 0);
  
  // Sélection pondérée
  let random = Math.random() * totalWeight;
  for (const pattern of availableActions) {
    random -= pattern.weight;
    if (random <= 0) {
      return pattern.action;
    }
  }
  
  return availableActions[0].action; // Fallback
}
```

---

## 🎭 Variations selon Corruption

### Corruption < 20% : Combat Standard
- Ennemis normaux
- Stats de base
- Pas de bonus/malus

### Corruption 20-39% : Légère Altération
- Ennemis : **+10% HP**
- Joueur : **+5% ATK**
- Nouveaux dialogues du Dé pendant combat

### Corruption 40-59% : Profanation
- Ennemis : **+20% HP, +10% ATK**
- Joueur : **+10% ATK, -5% DEF**
- Ennemis changent de patterns (plus agressifs)

### Corruption 60-79% : Damnation
- Ennemis : **+30% HP, +15% ATK**
- Joueur : **+20% ATK, -10% DEF, Heal -50%**
- Variantes corrompues d'ennemis apparaissent

### Corruption 80-100% : Rupture
- Ennemis : **+50% HP, +25% ATK**
- Joueur : **+50% ATK, -20% DEF, Heal impossible**
- Boss alternatifs débloqués

---

## 🛡️ Buffs et Debuffs

### Système de Status

```javascript
{
  type: "buff" | "debuff",
  name: "Nom du status",
  duration: 3, // Tours restants
  effect: {
    stat: "ATK" | "DEF" | "SPD",
    modifier: 1.2 // Multiplicateur (1.2 = +20%)
  }
}
```

### Exemples

| Status | Type | Effet | Durée | Source |
|--------|------|-------|-------|--------|
| Rage | Buff | +30% ATK, -10% DEF | 3 tours | Compétence Berserker |
| Bouclier Divin | Buff | +50% DEF | 2 tours | Compétence Paladin |
| Poison | Debuff | -10 HP/tour | 5 tours | Attaque Serpent Corrompu |
| Ralentissement | Debuff | -30% SPD | 2 tours | Cage de Glace |
| Bénédiction du Dé | Buff | +15% tous stats | 1 tour | Dé (face 6) |

---

## 📊 Exemple de Combat Complet

### Setup
```javascript
const player = {
  HP: 100, maxHP: 100,
  ATK: 15, DEF: 10,
  CRIT: 0.1, SPD: 10
};

const enemy = {
  name: "Garde Corrompu",
  HP: 80, maxHP: 80,
  ATK: 12, DEF: 15,
  CRIT: 0.05, SPD: 8
};
```

### Tour 1 : Joueur (SPD 10 > SPD 8)
```
Action 1 : Attaque de Base
├─ Hit check : 100 - (8/4) = 98% → Succès
├─ Dégâts : 15 * 1.1 (random) = 16.5
├─ Après DEF : 16.5 - (15 * 0.5) = 9 dégâts
├─ Crit check : 10% → Échec
└─ Ennemi HP : 80 → 71

Action 2 : Défense
└─ Joueur défend (+50% réduction jusqu'au prochain tour)
```

### Tour 2 : Ennemi
```
IA sélectionne : Attaque Lourde (HP < 90%, weight 30)
├─ Hit check : (100 - 10/4) * 0.8 = 78.4% → Succès
├─ Dégâts : 12 * 1.8 = 21.6
├─ Après DEF : 21.6 - (10 * 0.5) = 16.6 dégâts
├─ Réduction défense : 16.6 * 0.5 = 8.3 dégâts
└─ Joueur HP : 100 → 92
```

### Tour 3 : Joueur
```
Action 1 : Lancer le Dé 🎲
├─ Résultat : 5 (Succès Critique)
├─ Effet : +30% ATK ce tour
└─ Corruption : +5%

Action 2 : Attaque Lourde (boosté par Dé)
├─ ATK temporaire : 15 * 1.3 = 19.5
├─ Dégâts : 19.5 * 1.8 = 35.1
├─ Après DEF : 35.1 - 7.5 = 27.6
├─ Crit check : 10% → Succès !
├─ Dégâts finaux : 27.6 * 2 = 55.2
└─ Ennemi HP : 71 → 16
```

### Tour 4 : Ennemi (Désespéré)
```
IA sélectionne : Défense (HP < 30%, weight 10)
└─ Ennemi défend
```

### Tour 5 : Joueur (Finisher)
```
Action 1 : Attaque de Base
├─ Dégâts : 15 * 0.9 = 13.5
├─ Après DEF (réduite par défense) : 13.5 - 3.75 = 9.75
└─ Ennemi HP : 16 → 6

Action 2 : Attaque de Base
├─ Dégâts : 15 * 1.1 = 16.5
├─ Après DEF : 16.5 - 3.75 = 12.75
└─ Ennemi HP : 6 → -7 → MORT
```

**Résultat** :
- Victoire en 5 tours
- HP restants : 92/100
- Corruption gagnée : +5%
- Loot : Armure Rouillée (40% drop) + 7 Rubis

---

## 🎯 Objectifs de Design

### Le combat DOIT :
- ✅ Être résolu en 5-10 tours maximum
- ✅ Offrir plusieurs stratégies viables
- ✅ Permettre d'utiliser le Dé comme joker
- ✅ Être lisible (le joueur sait ses chances)
- ✅ Punir les mauvais choix mais pas la malchance

### Le combat NE DOIT PAS :
- ❌ Durer plus de 2 minutes
- ❌ Être résolu par spam d'une action
- ❌ Tuer le joueur en 1 coup sans warning
- ❌ Être basé sur de la RNG pure

---

## 📏 Métriques de Balance

| Métrique | Cible | Comment ajuster |
|----------|-------|-----------------|
| Taux de victoire (combat normal) | 70-80% | Ajuster HP/ATK ennemis |
| Durée moyenne combat | 1-2 min | Réduire HP si trop long |
| Utilisation Dé en combat | 30-50% | Ajuster rewards/corruption |
| Morts par coup critique ennemi | < 5% | Cap les dégâts critiques |
| Combats sans prendre de dégâts | 10-20% | Ajuster précision ennemis |

---

## 🔧 Architecture Technique

```javascript
// combatSystem.js
class CombatSystem {
  constructor(player, enemy) {
    this.player = player;
    this.enemy = enemy;
    this.turn = 0;
    this.log = [];
  }
  
  startCombat() {
    // Déterminer ordre
    this.combatants = [this.player, this.enemy]
      .sort((a, b) => b.SPD - a.SPD);
  }
  
  executeTurn(actor, action, target) {
    // Exécuter action
    const result = this.executeAction(actor, action, target);
    
    // Log
    this.log.push({
      turn: this.turn,
      actor: actor.name,
      action: action,
      result: result
    });
    
    // Check fin combat
    if (target.HP <= 0) {
      return this.endCombat();
    }
  }
  
  endCombat() {
    // Distribuer loot, XP, etc.
  }
}
```

---

**Prochaine étape** : [06_CLASSES.md](06_CLASSES.md)
