# 🎙️ NARRATOR SYSTEM - Guide d'utilisation

## Vue d'ensemble

Le **Narrator System** est la voix du Dé - un narrateur omniscient et sarcastique qui commente l'aventure du joueur. Inspiré de :
- **Darkest Dungeon** - Ton sombre et philosophique
- **Hades** - Sarcasme et humour noir
- **Bastion** - Narration contextuelle

## 🎯 Caractéristiques

### Évolution selon la corruption

Le narrateur change de personnalité selon le niveau de corruption :

| Corruption | Speaker | Ton |
|------------|---------|-----|
| 0-24% | "Le Dé" | Neutre, observateur, légèrement cynique |
| 25-49% | "Le Dé... ?" | Incertain, questionnement |
| 50-74% | "La Voix" | Sombre, corrompu, tentateur |
| 75-100% | "Ton Frère" | Intimité dérangeante, complicité |

### Styles visuels adaptatifs

- **Pure** : Or brillant, texte clair
- **Tainted** : Orange brûlant, lueur chaude
- **Corrupted** : Rouge sang, pulsation
- **Abyssal** : Violet abyssal, glitch effects

## 🎮 Utilisation en jeu

### Appel de base

```javascript
// Narration simple
window.Narrator.narrate("Texte à narrer");

// Avec options
window.Narrator.narrate("Texte", {
  category: 'combat',
  priority: 'high',
  delay: 2000
});
```

### Narrations pré-définies

#### Intro du jeu
```javascript
// Automatique selon la classe
window.Narrator.narrateGameStart('SHATTERED_KNIGHT');
```

#### Combat
```javascript
// Début de combat
window.Narrator.narrateCombatStart(3); // 3 ennemis

// Victoire
window.Narrator.narrateCombatVictory(player);

// Défaite
window.Narrator.narrateCombatDefeat();
```

#### Progression
```javascript
// Level up
window.Narrator.narrateLevelUp(5);
```

#### Corruption
```javascript
// Franchissement de seuil
window.Narrator.narrateCorruptionThreshold('corrupted');
```

#### Événements
```javascript
// Repos
window.Narrator.narrateRest();

// Marchand
window.Narrator.narrateMerchant();

// Coffre
window.Narrator.narrateTreasure();

// Piège
window.Narrator.narrateTrap();

// Énigme
window.Narrator.narrateRiddle();

// Boss
window.Narrator.narrateBossEncounter('Le Gardien des Os');

// Mort
window.Narrator.narrateDeath();
```

#### Items
```javascript
// Selon la rareté
window.Narrator.narrateItemFound('legendary');
```

#### Ambiance
```javascript
// Narration atmosphérique aléatoire
window.Narrator.narrateAmbient();
```

## ⚙️ Configuration

### Activer/Désactiver

```javascript
// Désactiver
window.Narrator.setEnabled(false);

// Réactiver
window.Narrator.setEnabled(true);
```

### Volume

```javascript
// Régler le volume (0.0 - 1.0)
window.Narrator.setVolume(0.7);
```

### Nettoyer la queue

```javascript
// Vider toutes les narrations en attente
window.Narrator.clearQueue();
```

## 🎨 Personnalisation

### Ajouter des narrations personnalisées

```javascript
// Dans narrator-system.js, ajouter une méthode
narrateCustomEvent() {
  const lines = [
    "Phrase 1",
    "Phrase 2",
    "Phrase 3"
  ];

  this.narrate(this.pickRandom(lines), {
    category: 'custom',
    priority: 'normal'
  });
}
```

### Modifier les délais

```javascript
// Délai minimum entre narrations (ms)
window.Narrator.minTimeBetweenNarrations = 5000; // 5 secondes
```

## 📝 Exemples d'intégration

### Combat System

```javascript
// Début de combat
function startCombat(enemies) {
  window.Narrator.narrateCombatStart(enemies.length);

  // Combat logic...
}

// Victoire
function onCombatWin(player) {
  window.Narrator.narrateCombatVictory(player);

  if (player.hp < player.maxHp * 0.3) {
    // Narration spéciale si proche de la mort
    setTimeout(() => {
      window.Narrator.narrate("Une victoire à la Pyrrhus...");
    }, 3000);
  }
}
```

### Event System

```javascript
// Événement personnalisé
function handleLibraryEvent(player) {
  window.Narrator.narrate(
    "La Bibliothèque Infinie. Vyr adorait cet endroit.",
    { category: 'library', priority: 'high' }
  );

  setTimeout(() => {
    window.Narrator.narrate(
      "Les livres chuchotent. Écoute bien. Ou pas.",
      { delay: 3000 }
    );
  }, 5000);
}
```

### Corruption Events

```javascript
// Écouter les changements de corruption
window.addEventListener('corruptionChanged', (e) => {
  const { newValue, threshold, previousThreshold } = e.detail;

  // Si on franchit un seuil
  if (threshold !== previousThreshold) {
    window.Narrator.narrateCorruptionThreshold(threshold);
  }
});
```

### Boss Encounter

```javascript
function encounterBoss(bossName, bossData) {
  window.Narrator.narrateBossEncounter(bossName);

  // Narration supplémentaire selon le boss
  setTimeout(() => {
    if (bossName === 'Le Gardien des Os') {
      window.Narrator.narrate(
        "Il gardait Morwyn. Maintenant il garde... quoi exactement ?",
        { delay: 4000 }
      );
    }
  }, 6000);
}
```

## 🎭 Citations par défaut

### Intro par classe

- **Shattered Knight** : "Ton roi est mort il y a 200 ans. Pourtant, te voilà."
- **Witch of Ashes** : "400 âmes. Combien en as-tu brûlés ?"
- **Blood Pactbound** : "Tu as vendu quelque chose que tu ne pourras jamais récupérer."
- **Hollow Shepherd** : "Tu guides les Hollows. Qui te guidera quand tu seras vide ?"
- **Silkbound Fate** : "Tisseuse de destins. Sylthara est morte, dévorée."
- **Broken Prophet** : "Vyr serait fier. Dommage qu'il soit mort avant de voir son futur."
- **Unchained Judge** : "La balance de Thalys a explosé. Cherche ses morceaux."

### Combat

- Début : "Les Dés sont lancés."
- Victoire : "Bien joué."
- Victoire pyrrhique : "Victoire... à quel prix ?"
- Défaite : "Les Dés ont dit 'Non'."

### Ambiance

- "Les couloirs murmurent."
- "Sens-tu leur regard ?"
- "Les Dieux morts ne dorment pas. Ils observent."

## 🐛 Dépannage

### Le narrateur ne parle pas

```javascript
// Vérifier si actif
console.log('Narrator enabled:', window.Narrator.enabled);

// Vérifier la queue
console.log('Queue length:', window.Narrator.narrationQueue.length);

// Forcer une narration
window.Narrator.narrate("Test", { skipHistory: true });
```

### Les narrations se répètent

```javascript
// Nettoyer l'historique
window.Narrator.recentNarrations = [];

// Augmenter la taille de l'historique
window.Narrator.maxHistorySize = 50;
```

### Délais trop longs

```javascript
// Réduire le délai minimum
window.Narrator.minTimeBetweenNarrations = 1000; // 1 seconde
```

## 🔊 Sons (À implémenter)

Pour activer les sons de narration :

1. Ajouter le fichier audio : `sounds/narrator/narrator_speak.mp3`
2. Enregistrer dans `audio.js` :
```javascript
const NARRATOR_SOUNDS = {
  narrator_speak: 'sounds/narrator/narrator_speak.mp3'
};
```

3. Le narrateur appellera automatiquement `AudioManager.playSFX('narrator_speak')`

## 📊 Statistics

Le narrateur garde un historique des 20 dernières narrations pour éviter les répétitions.

```javascript
// Voir l'historique
console.log(window.Narrator.recentNarrations);

// Nettoyer
window.Narrator.recentNarrations = [];
```

---

**Dernière mise à jour**: v0.2 Alpha
**Auteur**: THE LAST COVENANT - Narrative Team
