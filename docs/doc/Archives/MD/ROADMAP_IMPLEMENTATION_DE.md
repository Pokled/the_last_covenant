# 🎲 ROADMAP D'IMPLÉMENTATION - DÉ DU DESTIN
# THE LAST COVENANT - Plan d'Action Concret

> **Objectif** : Implémenter le système Dé du Destin en 7 phases progressives
> **Durée estimée** : Phase par phase, testable à chaque étape
> **Priorité** : Fonctionnel d'abord, spectaculaire ensuite

---

## 📋 STRUCTURE DE FICHIERS À CRÉER

```
/css/
├── dice-system.css              ← Styles visuels du Dé (overlay, animations)
└── dice-particles.css           ← Animations particules CSS (fallback)

/js/
├── dice-destiny-core.js         ← Classe principale DiceOfDestiny
├── dice-visual-system.js        ← Système d'animations Canvas
├── dice-audio-system.js         ← Gestion audio multi-layered
├── dice-dialogue-system.js      ← Murmures et dialogues réactifs
└── dice-modifiers.js            ← Système de modifiers (+1, +2, reroll, etc.)

/sounds/dice/
├── buildup_orchestral.mp3       ← Build-up 2s
├── whoosh_spin.mp3              ← Son de rotation
├── impact_massive.mp3           ← Impact résultat
├── laugh_demonic.mp3            ← Rire du Dé
├── scream_primal.mp3            ← Hurlement (résultat 1)
├── carillon_celestial.mp3       ← Carillon (résultat 6)
└── heartbeat.mp3                ← Battements cardiaques (Stade 3+)

/MD/
├── De_Du_Destin.md              ✅ Déjà créé (design document)
└── ROADMAP_IMPLEMENTATION_DE.md ✅ Ce fichier
```

---

## 🎯 PHASE 1 : MVP - LANCER BASIQUE (2-3h)

**Objectif** : Avoir un dé qui lance 1-6 avec animation simple

### Fichiers à créer

1. **dice-destiny-core.js** (version minimale)
2. **dice-system.css** (overlay basique)
3. Intégration dans `game.js`

### Fonctionnalités MVP

- ✅ Classe `DiceOfDestiny` avec méthode `roll()`
- ✅ Overlay transparent full-screen
- ✅ Animation simple : apparition → spin → résultat
- ✅ Durée totale : 2 secondes (pas 6 pour le MVP)
- ✅ Retourne un nombre 1-6

### Code MVP

```javascript
// dice-destiny-core.js (MVP)
class DiceOfDestiny {
  constructor() {
    this.stage = 1;
    this.corruption = 0;
    this.createOverlay();
  }

  createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'dice-overlay';
    overlay.className = 'dice-overlay-container';
    overlay.innerHTML = `
      <div class="dice-display">
        <div class="dice-cube" id="diceEntity">
          <div class="dice-result" id="diceResult"></div>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  async roll() {
    const result = Math.floor(Math.random() * 6) + 1;

    // Afficher overlay
    const overlay = document.getElementById('dice-overlay');
    overlay.classList.add('active');

    // Afficher résultat après 2s
    await this.sleep(1500);
    document.getElementById('diceResult').textContent = result;

    await this.sleep(500);
    overlay.classList.remove('active');

    return result;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

window.DiceSystem = new DiceOfDestiny();
```

### CSS MVP

```css
/* dice-system.css (MVP) */
.dice-overlay-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}

.dice-overlay-container.active {
  opacity: 1;
  pointer-events: all;
}

.dice-display {
  perspective: 1000px;
}

.dice-cube {
  width: 100px;
  height: 100px;
  background: #fff;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: spin 1.5s ease-out;
}

.dice-result {
  font-size: 48px;
  font-weight: bold;
  color: #333;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(720deg); }
}
```

### Test MVP

Dans `game.js`, appeler :

```javascript
// Test dans game.js
async function testDice() {
  const result = await window.DiceSystem.roll();
  console.log('Résultat du dé:', result);
}

testDice();
```

---

## 🎯 PHASE 2 : SYSTÈME DE STADES (3-4h)

**Objectif** : Implémenter les 5 stades d'évolution du Dé

### Ajouts

1. **Système de corruption** (0-100%)
2. **Upgrade de stade** (1 → 2 → 3 → 4 → 5)
3. **Apparence visuelle change** selon stade
4. **Yeux qui s'ouvrent** (Stade 2+)

### Modifications dice-destiny-core.js

```javascript
// Ajouter dans constructor
this.eyeCount = 0;
this.isAlive = false;

// Nouvelle méthode
async upgrade(player, targetStage) {
  const cost = this.upgradeCosts[targetStage];

  // Vérifier ressources
  if (player.gold < cost.gold) return false;
  if (player.corruption < cost.corruption) return false;

  // Consommer ressources
  player.gold -= cost.gold;
  player.corruption = cost.corruption;

  // Upgrade
  this.stage = targetStage;
  this.unlockMechanics(targetStage);

  console.log(`✨ Dé upgradé vers Stade ${targetStage}!`);
  return true;
}

unlockMechanics(stage) {
  switch(stage) {
    case 2:
      this.eyeCount = 1;
      break;
    case 3:
      this.eyeCount = 3;
      this.isAlive = true;
      break;
    case 4:
      this.eyeCount = 6;
      break;
    case 5:
      this.isFused = true;
      break;
  }
}
```

### CSS Stades

```css
/* Stade 1 : Ivoire */
.dice-cube.stage-1 {
  background: linear-gradient(135deg, #f0f0f0, #d3d3d3);
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

/* Stade 2 : Os */
.dice-cube.stage-2 {
  background: linear-gradient(135deg, #fffacd, #f5deb3);
  box-shadow: 0 5px 20px rgba(255, 215, 0, 0.4);
}

/* Stade 3 : Chair */
.dice-cube.stage-3 {
  background: linear-gradient(135deg, #dc143c, #8b0000);
  box-shadow: 0 5px 25px rgba(220, 20, 60, 0.6);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

---

## 🎯 PHASE 3 : SYSTÈME DE PARTICULES (4-5h)

**Objectif** : Ajouter particules Canvas pour explosions visuelles

### Créer dice-visual-system.js

Implémenter :
- Canvas full-screen
- Pool de 10 000 particules max
- Spawn radial (explosion)
- Update/Render à 60 FPS

### Intégration

```javascript
// Dans DiceOfDestiny constructor
this.visualSystem = new DiceVisualSystem(this);

// Dans roll()
await this.visualSystem.playFullAnimation(result);
```

---

## 🎯 PHASE 4 : AUDIO SYSTÈME (3-4h)

**Objectif** : Sons réactifs selon résultats

### Créer dice-audio-system.js

Fonctionnalités :
- Préchargement de tous les sons
- Play() avec volume
- Layering (build-up + impact)
- Sons différents pour résultats 1 vs 6

### Sons gratuits à télécharger

- **Freesound.org** : "epic impact", "demonic laugh"
- **Zapsplat.com** : Section "Cinematic"
- **YouTube Audio Library** : "Dark Orchestral"

---

## 🎯 PHASE 5 : DIALOGUES RÉACTIFS (2-3h)

**Objectif** : Le Dé parle selon contexte

### Créer dice-dialogue-system.js

Système de murmures :
- Base de 50+ phrases par stade
- Sélection aléatoire
- Affichage en overlay (3 secondes)

```javascript
class DiceDialogueSystem {
  whisper(message, isBetrayal = false) {
    const whisperEl = document.createElement('div');
    whisperEl.className = 'dice-whisper';
    whisperEl.textContent = `"${message}"`;
    document.body.appendChild(whisperEl);

    setTimeout(() => whisperEl.classList.add('visible'), 50);
    setTimeout(() => {
      whisperEl.classList.remove('visible');
      setTimeout(() => whisperEl.remove(), 500);
    }, 3000);
  }
}
```

---

## 🎯 PHASE 6 : MÉCANIQUES GAMEPLAY (5-6h)

**Objectif** : Modifiers, rerolls, manipulation

### Fonctionnalités

1. **Modifiers** (dice-modifiers.js)
   - Face ensorcelée (+1 fixe)
   - Dé jumeau (lance 2, prends meilleur)
   - Bénédiction (ignore résultats 1)

2. **Rerolls**
   - Reroll du Désespoir (Stade 2+, 15% corruption)
   - Relance corrompue (Stade 3+, 10% corruption)

3. **Manipulation directe**
   - Choisis le résultat exact (Stade 4+, 25% corruption)

### Classe Modifier

```javascript
class DiceModifier {
  constructor(type, power) {
    this.type = type; // 'PLUS_ONE', 'TWIN_DICE', etc.
    this.power = power;
  }

  apply(baseRoll) {
    switch(this.type) {
      case 'PLUS_ONE':
        return Math.min(6, baseRoll + this.power);
      case 'REROLL_ONES':
        return baseRoll === 1 ? Math.floor(Math.random() * 6) + 1 : baseRoll;
      default:
        return baseRoll;
    }
  }
}
```

---

## 🎯 PHASE 7 : INTÉGRATION VILLAGE (4-5h)

**Objectif** : Forge du Destin + PNJ Kael

### Ajouts au Village

1. **Structure "Forge du Destin"**
   - Débloquée dès Run 1
   - PNJ : Kael le Forgeur Maudit
   - Fonctions :
     - Upgrade de stade
     - Craft modifiers
     - Fusion de modifiers (Stade 3+)

2. **Dialogues Kael**
   - Première rencontre (lore)
   - Post-upgrade (réactions)
   - Haute corruption (warnings)

### Intégration village.js

```javascript
// Dans generateVillage()
if (player.runsCompleted >= 0) { // Dès le début
  buildings.push({
    type: 'FORGE_DESTINY',
    x: 200,
    y: 150,
    npc: 'KAEL',
    services: ['DICE_UPGRADE', 'MODIFIER_CRAFT', 'MODIFIER_FUSION']
  });
}
```

---

## 🎯 PHASE BONUS : POLISH AAA+ (optionnel)

### Si tu veux aller ALL-IN

1. **Animation 6 secondes complète**
   - Build-up (2s)
   - Révélation (1s)
   - Spin furieux (2.5s)
   - Résultat explosif (0.5s)

2. **Faces cachées ∞ et Ø**
   - Débloquent à Stade 5, Corruption 95%+
   - Résultats ultra-aléatoires

3. **Cinématique Fusion Stade 5**
   - 10 secondes de pure folie visuelle
   - Le Dé fusionne avec le portrait du joueur

4. **Trahison du Dé**
   - Corruption 100%, 20% chance par lancer
   - Inverse le résultat
   - Dialogue : *"Désolé... Pas désolé."*

---

## 📝 CHECKLIST FINALE

Avant de dire "Le Dé est terminé" :

- [ ] Le Dé lance 1-6 de manière fiable
- [ ] Les 5 stades existent et sont visuellement distincts
- [ ] Les particules explosent sur résultats critiques (1, 6)
- [ ] Les sons jouent correctement (build-up, impact, murmures)
- [ ] Le Dé murmure au joueur (au moins 10 phrases différentes)
- [ ] Les modifiers fonctionnent (au moins 3 types)
- [ ] Les rerolls coûtent de la corruption
- [ ] Kael est présent au village avec dialogues
- [ ] Les upgrades de stade fonctionnent
- [ ] Le joueur ressent que LE DÉ EST VIVANT

---

## 🚀 ORDRE D'IMPLÉMENTATION RECOMMANDÉ

**Semaine 1 :** Phases 1-2 (MVP + Stades)
- Tu as un dé fonctionnel, testable en jeu
- Les stades marchent, le joueur voit la progression

**Semaine 2 :** Phases 3-4 (Particules + Audio)
- Le Dé devient spectaculaire
- Les joueurs commencent à ressentir l'âme

**Semaine 3 :** Phases 5-6 (Dialogues + Gameplay)
- Le Dé PARLE
- Les mécaniques rendent le jeu stratégique

**Semaine 4 :** Phase 7 + Polish
- Village intégré
- Expérience complète

---

## 💡 CONSEILS D'IMPLÉMENTATION

### Test Early, Test Often

Après CHAQUE phase, teste en jeu :
- Lance le dé 50 fois
- Vérifie que ça ne crash pas
- Vérifie les perfs (60 FPS maintenu)

### Commence Simple

Ne fais PAS tout le système de particules du premier coup.
Commence avec 10 particules. Puis 100. Puis 1000.

### Logs Partout

```javascript
console.log('🎲 Lancement Dé - Stade:', this.stage);
console.log('🎲 Résultat:', result);
console.log('🎲 Corruption:', player.corruption);
```

### Performance

Si les FPS chutent :
- Limite particules à 2000 max (au lieu de 10 000)
- Utilise `requestAnimationFrame` au lieu de `setInterval`
- Disable particules sur mobile

---

## 🎯 OBJECTIF FINAL

Quand un joueur lance le Dé, il doit :

1. **Anticiper** (build-up crée la tension)
2. **Vibrer** (animation spectaculaire)
3. **Réagir** (résultat = explosion d'émotions)
4. **Écouter** (murmure du Dé = connexion)
5. **Vouloir relancer** (addiction au RNG + personnalité)

**Si ces 5 points sont validés... Le Dé du Destin est RÉUSSI.** 🎲

---

_Document créé le 27 Décembre 2025_
_THE LAST COVENANT - Roadmap Implémentation_
_Solo-Dev Project - Claude AI Assistant_
