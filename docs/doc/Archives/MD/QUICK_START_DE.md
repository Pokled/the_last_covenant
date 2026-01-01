# 🚀 QUICK START - Dé du Destin
# THE LAST COVENANT - Intégration Rapide

> **Objectif** : Intégrer le Dé du Destin en 5 minutes chrono

---

## 📦 FICHIERS CRÉÉS

Voici ce qui a été créé :

```
/css/
└── dice-system.css              ✅ 750+ lignes - Styles complets

/js/
├── dice-destiny-core.js         ✅ 600+ lignes - Système principal
└── dice-visual-system.js        ✅ 450+ lignes - Particules Canvas

/MD/
├── De_Du_Destin.md              ✅ 1661 lignes - Design document complet
├── ROADMAP_IMPLEMENTATION_DE.md ✅ Plan d'implémentation en 7 phases
└── QUICK_START_DE.md            ✅ Ce fichier
```

---

## 🔧 INTÉGRATION EN 3 ÉTAPES

### ÉTAPE 1 : Charger les fichiers dans `game.html`

Ouvre `/game.html` et ajoute **AVANT** `</body>` :

```html
<!-- Dé du Destin - CSS -->
<link rel="stylesheet" href="css/dice-system.css">

<!-- Dé du Destin - JavaScript -->
<script src="js/dice-visual-system.js"></script>
<script src="js/dice-destiny-core.js"></script>
```

**Ordre important** :
1. CSS d'abord
2. `dice-visual-system.js` avant `dice-destiny-core.js`

---

### ÉTAPE 2 : Connecter le système visuel au Dé

Dans `/js/game.js`, ajoute après l'initialisation du jeu :

```javascript
// Initialiser le système Dé (déjà fait automatiquement)
// window.DiceSystem est disponible globalement

// Connecter le système visuel
window.DiceSystem.visualSystem = new DiceVisualSystem(window.DiceSystem);

console.log('✅ Dé du Destin connecté au jeu');
```

---

### ÉTAPE 3 : Utiliser le Dé dans le jeu

#### Exemple 1 : Lancer le Dé en combat

```javascript
// Dans ta fonction de combat
async function performDiceRoll() {
  const result = await window.DiceSystem.roll();
  console.log('Résultat du Dé:', result);

  // Utilise le résultat comme tu veux
  if (result === 6) {
    console.log('CRITIQUE ! Double dégâts !');
  } else if (result === 1) {
    console.log('ÉCHEC ! Le joueur perd son tour !');
  }

  return result;
}
```

#### Exemple 2 : Upgrade du Dé au village

```javascript
// Dans village.js ou ton système d'upgrade
function tryUpgradeDice(player, targetStage) {
  const success = window.DiceSystem.upgrade(player, targetStage);

  if (success) {
    console.log(`✨ Dé upgradé vers Stade ${targetStage}!`);
  } else {
    console.log('❌ Impossible d\'upgrader le Dé (ressources insuffisantes)');
  }
}

// Exemple d'utilisation
tryUpgradeDice(player, 2); // Tente d'upgrade vers Stade 2
```

#### Exemple 3 : Ajouter un modifier

```javascript
// Créer un modifier +1
const modifierPlusOne = new DiceModifier('PLUS_ONE', 1);

// Ajouter au Dé
window.DiceSystem.modifiers.push(modifierPlusOne);

console.log('✅ Modifier +1 ajouté au Dé');

// Maintenant tous les lancers auront +1
```

#### Exemple 4 : Reroll

```javascript
// Dans une interface de combat
async function rerollDice(player) {
  if (window.DiceSystem.rerollsLeft > 0) {
    const newResult = await window.DiceSystem.reroll(player);
    console.log('🔄 Nouveau résultat:', newResult);
    return newResult;
  } else {
    console.log('❌ Plus de rerolls disponibles');
    return null;
  }
}
```

---

## 🎮 TEST RAPIDE

Ouvre la console dans `game.html` et tape :

```javascript
// Test 1 : Lancer le Dé
await window.DiceSystem.roll();

// Test 2 : Voir l'info du Dé
console.log(window.DiceSystem.getInfo());

// Test 3 : Simuler upgrade (ATTENTION : besoin d'un objet player)
const fakePlayer = { gold: 10000, corruption: 50, runsCompleted: 100 };
await window.DiceSystem.upgrade(fakePlayer, 2);
await window.DiceSystem.roll(); // Maintenant avec 1 œil ouvert !

// Test 4 : Ajouter un modifier
window.DiceSystem.modifiers.push(new DiceModifier('PLUS_ONE', 2));
await window.DiceSystem.roll(); // Résultat aura +2
```

---

## 📊 STRUCTURE DE L'OBJET PLAYER

Le Dé a besoin d'un objet `player` avec :

```javascript
const player = {
  gold: 1000,              // Or du joueur
  corruption: 25,          // Corruption 0-100%
  runsCompleted: 15        // Nombre de runs terminés
};
```

---

## 🎨 PERSONNALISATION RAPIDE

### Changer les couleurs des stades

Édite `/css/dice-system.css`, lignes 77-242 (sections `.dice-cube.stage-X`)

### Modifier les dialogues

Édite `/js/dice-destiny-core.js`, méthode `getDialoguesForStage()` (ligne ~450)

### Ajuster la vitesse des animations

Édite `/js/dice-destiny-core.js`, méthode `playRollAnimation()` (ligne ~135)

Remplace les `sleep()` :
- `sleep(1500)` → `sleep(500)` pour accélérer
- `sleep(1500)` → `sleep(3000)` pour ralentir

---

## 🐛 TROUBLESHOOTING

### Le Dé ne s'affiche pas

**Vérifie :**
1. Les fichiers sont bien chargés (F12 → Onglet Network)
2. Pas d'erreurs dans la console (F12 → Console)
3. L'overlay a bien `z-index: 9999` (inspecter l'élément)

**Fix rapide :**
```javascript
// Dans la console
document.getElementById('dice-overlay').style.opacity = '1';
document.getElementById('dice-overlay').classList.add('active');
```

### Les particules ne s'affichent pas

**Vérifie :**
1. `dice-visual-system.js` est chargé AVANT `dice-destiny-core.js`
2. Le Canvas est bien créé :
```javascript
document.getElementById('dice-particles-canvas'); // Doit retourner un canvas
```

**Fix rapide :**
```javascript
window.DiceSystem.visualSystem = new DiceVisualSystem(window.DiceSystem);
```

### Les sons ne jouent pas

**Normal !** Le système audio n'est pas encore implémenté.

Pour l'ajouter :
1. Télécharge des sons gratuits (voir `ROADMAP_IMPLEMENTATION_DE.md` Phase 4)
2. Crée `/js/dice-audio-system.js`
3. Remplace la méthode `playSound()` dans `dice-destiny-core.js`

---

## 📈 PROCHAINES ÉTAPES

Maintenant que le Dé fonctionne, tu peux :

1. **Implémenter les modifiers** (voir Phase 6 de la roadmap)
2. **Ajouter la Forge du Destin au village** (voir Phase 7)
3. **Créer le système audio** (voir Phase 4)
4. **Améliorer les animations** (passer de 2s à 6s, voir design doc)

**Lis le fichier `ROADMAP_IMPLEMENTATION_DE.md` pour le plan complet !**

---

## 💡 EXEMPLES D'INTÉGRATION AVANCÉE

### Lancer le Dé depuis une modale de combat

```javascript
// Dans combat-system.js
class CombatSystem {
  async rollForAction() {
    // Désactiver les boutons pendant le lancer
    this.disableButtons();

    // Lancer le Dé
    const result = await window.DiceSystem.roll();

    // Appliquer le résultat
    this.applyRollResult(result);

    // Réactiver les boutons
    this.enableButtons();
  }
}
```

### Intégrer au système de cages (sacrifices)

```javascript
// Dans cages.js
function onCageChoice(choice) {
  if (choice === 'sacrifice') {
    // Gagner de la corruption
    player.corruption += 15;

    // Le Dé réagit
    window.DiceSystem.corruption = player.corruption;
    window.DiceSystem.whisper("Oui... YESSS ! Nourris-moi davantage.");

    // Récompense
    player.gold += 500;
  }
}
```

### Sauvegarder l'état du Dé

```javascript
// Dans save-system.js
function saveDiceState() {
  const diceData = {
    stage: window.DiceSystem.stage,
    corruption: window.DiceSystem.corruption,
    modifiers: window.DiceSystem.modifiers.map(m => ({
      type: m.type,
      power: m.power
    })),
    rerollsLeft: window.DiceSystem.rerollsLeft
  };

  localStorage.setItem('diceState', JSON.stringify(diceData));
}

function loadDiceState() {
  const saved = localStorage.getItem('diceState');
  if (!saved) return;

  const data = JSON.parse(saved);
  window.DiceSystem.stage = data.stage;
  window.DiceSystem.corruption = data.corruption;
  window.DiceSystem.rerollsLeft = data.rerollsLeft;

  // Recréer modifiers
  window.DiceSystem.modifiers = data.modifiers.map(m =>
    new DiceModifier(m.type, m.power)
  );

  // Mettre à jour visuels
  window.DiceSystem.updateStageVisuals();
  window.DiceSystem.openEyes();
}
```

---

## 🎯 CHECKLIST FINALE

Avant de dire "Le Dé fonctionne" :

- [ ] Les fichiers CSS/JS sont chargés dans `game.html`
- [ ] Le Dé lance un résultat 1-6 sans crash
- [ ] L'animation se joue (overlay + particules)
- [ ] Les murmures s'affichent
- [ ] L'upgrade Stade 1 → 2 fonctionne
- [ ] Un modifier +1 fonctionne
- [ ] Le résultat est utilisable dans le gameplay

**Si tout est ✅, le Dé du Destin est OPÉRATIONNEL !** 🎲

---

## 📞 SUPPORT

En cas de problème :

1. Lis **ROADMAP_IMPLEMENTATION_DE.md** (plan détaillé)
2. Lis **De_Du_Destin.md** (design complet)
3. Vérifie la console (F12) pour les erreurs
4. Teste les exemples de ce fichier un par un

---

_Quick Start créé le 27 Décembre 2025_
_THE LAST COVENANT - Solo Dev Project_
_Le Dé ne lance pas ton destin. TU DEVIENS LE DÉ._ 🎲
