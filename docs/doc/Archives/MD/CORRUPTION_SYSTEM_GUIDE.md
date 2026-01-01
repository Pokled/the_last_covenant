# 💀 CORRUPTION SYSTEM - Guide d'utilisation

## Vue d'ensemble

Le **Corruption System** de THE LAST COVENANT est un système visuel et mécanique qui représente la contamination progressive du joueur par l'essence des Dieux morts.

## 🎯 Seuils de Corruption

### 1. **Pure** (0-24%)
- **État**: Âme pure, non corrompue
- **Visuel**: Aucun effet visuel
- **Dé**: Ivoire propre, chiffres dorés
- **Gameplay**: Accès complet aux capacités divines
- **Exemple**: Peut tenir 2 serments simultanément (Chevalier Brisé)

### 2. **Souillé / Tainted** (25-49%)
- **État**: Première contamination
- **Visuel**:
  - Particules orangées (10)
  - Légère vignette rouge
  - Dé en os avec taches de sang
- **Message**: ⚠️ SOUILLURE DÉTECTÉE
- **Gameplay**: Certaines capacités commencent à avoir un coût accru

### 3. **Corrompu / Corrupted** (50-74%)
- **État**: Corruption avancée
- **Visuel**:
  - Particules cramoisies (20)
  - Vignette rouge prononcée
  - Distorsion d'écran
  - Dé de chair pulsant avec des yeux
  - Portrait du héros assombri
- **Message**: 💀 CORRUPTION AVANCÉE
- **Gameplay**: Malus significatifs, certains NPCs refusent d'interagir

### 4. **Abyssal** (75-100%)
- **État**: Fusion avec le vide
- **Visuel**:
  - Particules violettes (40)
  - Vignette sombre intense
  - Distorsion maximale
  - Dé = vide en forme de dé
  - Screen shake
  - Portrait fortement dégradé
- **Message**: 🌑 CORRUPTION ABYSSALE
- **Gameplay**: Certains ennemis deviennent alliés, d'autres vous fuient

## 🔧 API - Utilisation dans le code

### Modifier la corruption

```javascript
// Ajouter de la corruption
window.CorruptionSystem.addCorruption(15, 'Utilisation de Last Stand');

// Retirer de la corruption (rare)
window.CorruptionSystem.removeCorruption(10, 'Bénédiction de Morwyn');

// Définir directement
window.CorruptionSystem.setCorruption(50, 'Pacte avec le Dé');

// Réinitialiser
window.CorruptionSystem.reset();
```

### Lire la corruption

```javascript
// Obtenir le niveau actuel (0-100)
const level = window.CorruptionSystem.getCorruption();

// Obtenir le seuil actuel
const threshold = window.CorruptionSystem.getThreshold();
// Retourne: 'pure', 'tainted', 'corrupted', ou 'abyssal'

// Vérifier si au-dessus d'un seuil
if (window.CorruptionSystem.isAtThreshold('corrupted')) {
  console.log('Le joueur est corrompu !');
}

// Obtenir la description actuelle
const desc = window.CorruptionSystem.getDescription();
// Retourne: { title, desc, icon }
```

### Écouter les changements

```javascript
window.addEventListener('corruptionChanged', (event) => {
  const { oldValue, newValue, threshold, previousThreshold } = event.detail;

  console.log(`Corruption: ${oldValue}% → ${newValue}%`);

  if (threshold !== previousThreshold) {
    console.log(`Seuil franchi: ${previousThreshold} → ${threshold}`);
  }
});
```

## 🎮 Exemples de gameplay

### Chevalier Brisé - Serment Sacré

```javascript
// Briser un serment augmente la corruption
function breakOath(oathType) {
  if (oathType === 'OATH_PROTECT') {
    window.CorruptionSystem.addCorruption(10, 'Serment de Protection brisé');
    player.def -= 5; // Pénalité permanente
  }
}
```

### Utiliser Last Stand (coûte +15% corruption)

```javascript
function useLastStand(player) {
  if (player.hp <= player.maxHp * 0.1) {
    player.invulnerable = true;
    player.invulnerableTurns = 1;

    // Coût en corruption
    window.CorruptionSystem.addCorruption(15, 'Last Stand activé');

    setTimeout(() => {
      player.hp = Math.floor(player.maxHp * 0.5);
      player.invulnerable = false;
    }, 1000);
  }
}
```

### Relique : Œil de Vyr

```javascript
function useEyeOfVyr(player) {
  // Voir les 5 prochains lancers de dé
  showNext5Rolls();

  // Mais +50% corruption
  window.CorruptionSystem.addCorruption(50, 'Œil de Vyr utilisé');
}
```

### NPC réagit à la corruption

```javascript
function merchantReaction(player) {
  const corruption = window.CorruptionSystem.getCorruption();

  if (corruption < 25) {
    return "Bienvenue, noble aventurier !";
  } else if (corruption < 50) {
    return "Vous... vous avez une étrange aura.";
  } else if (corruption < 75) {
    return "Les dieux morts vous ont touché. Partez !";
  } else {
    return "Tu n'es plus humain... qu'on te brûle !";
    // Le marchand refuse de commercer
  }
}
```

## 🎨 Visuels associés

### CSS Classes appliquées

```css
/* Vignette d'écran */
.corruption-vignette.pure { opacity: 0; }
.corruption-vignette.tainted { opacity: 0.2; }
.corruption-vignette.corrupted { opacity: 0.4; }
.corruption-vignette.abyssal { opacity: 0.6; }

/* Portrait du héros */
.hero-portrait.corruption-pure { filter: brightness(1.1); }
.hero-portrait.corruption-abyssal {
  filter: brightness(0.6) saturate(0.5) hue-rotate(30deg);
}

/* Dé */
.dice-container.corruption-abyssal .pixel-dice {
  filter: brightness(0.7) contrast(1.3);
  animation: diceAbyssalShake 0.2s infinite;
}
```

## 💾 Sauvegarde / Chargement

Le système de corruption se sauvegarde automatiquement avec le joueur:

```javascript
// Sauvegarder
const saveData = {
  player: {
    corruption: player.corruption,
    // ... autres stats
  }
};

// Charger
player.corruption = saveData.player.corruption;
window.CorruptionSystem.setCorruption(player.corruption, 'Chargement sauvegarde');
```

## 🎯 Design Guidelines

### Coûts typiques de corruption

- **Action mineure tabou**: +5%
- **Capacité divine modérée**: +10-15%
- **Sacrifice/pacte majeur**: +20-30%
- **Relique maudite**: +40-50%
- **Pacte avec le Dé**: +75-100%

### Moyens de réduire la corruption (rares !)

- **Bénédiction divine**: -10 à -20%
- **Sanctuaire purifié**: -15%
- **Sacrifice héroïque**: -25%
- **Reconstruction de la Balance de Thalys** (fin secrète): Reset à 0%

### Effets sur le gameplay

- **< 25%**: Gameplay "standard"
- **25-50%**: Premiers effets visuels, dialogues changent
- **50-75%**: Gameplay altéré, certains NPCs hostiles
- **75-100%**: Gameplay "dark mode", fin alternative possible

## 🔊 Sons associés

```javascript
// Définir dans audio.js ou config audio
const CORRUPTION_SOUNDS = {
  corruption_tainted: 'sounds/corruption/tainted.mp3',
  corruption_corrupted: 'sounds/corruption/corrupted.mp3',
  corruption_abyssal: 'sounds/corruption/abyssal.mp3'
};
```

## ⚠️ Notes importantes

1. **Ne pas abuser**: La corruption doit être significative et rare
2. **Toujours donner une raison**: Chaque gain de corruption doit être expliqué au joueur
3. **Conséquences claires**: Le joueur doit comprendre les risques
4. **Réversibilité limitée**: La corruption est difficile à réduire (design intentionnel)

## 📊 Monitoring

En mode debug, afficher la corruption dans la console:

```javascript
// Activer le monitoring
window.CorruptionSystem.debug = true;

// Chaque changement de corruption affichera:
// 💀 Corruption: 25% → 40% (Serment brisé)
// ⚠️ Corruption Threshold Crossed: pure → tainted
```

---

**Dernière mise à jour**: v0.2 Alpha
**Auteur**: THE LAST COVENANT - Corruption Design Team
