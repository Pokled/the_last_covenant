# 📦 ITEMS LORE INTEGRATION SYSTEM - Guide d'utilisation

## Vue d'ensemble

Le **Items Lore Integration System** fusionne la base de données fonctionnelle des items (`items-database.js`) avec leur lore narrative profonde (`items-lore.json`) pour créer une expérience immersive AAA+ digne de THE LAST COVENANT.

## 🎯 Fonctionnalités

### 1. **Chargement automatique de la lore**
- Charge `MD/items-lore.json` au démarrage
- Enrichit automatiquement les items avec leur histoire

### 2. **Modal d'inspection AAA+**
- **Clic droit** sur un item dans l'inventaire pour l'inspecter
- Affiche :
  - Stats complètes
  - Lore courte + complète
  - Affinité divine
  - Effets de corruption
  - Interactions spéciales avec la classe
  - Quêtes associées
  - Lore secrète

### 3. **Système de corruption intelligent**
- Les items réagissent au niveau de corruption du joueur
- Effets dynamiques selon les seuils
- Visuels et mécaniques changent

### 4. **Interactions de classe**
- Dialogues uniques pour certaines classes
- Quêtes exclusives
- Fins alternatives débloquables

## 🔧 API - Utilisation dans le code

### Charger et enrichir un item

```javascript
// Enrichir un item avec sa lore
const item = ITEMS_DATABASE.WEAPONS.BROKEN_OATH;
const enrichedItem = await window.ItemsLoreSystem.enrichItem(item);

console.log(enrichedItem.lore.full); // Lore complète
console.log(enrichedItem.godAffinity); // 'MORWYN'
console.log(enrichedItem.corruptionEffects); // Effets selon corruption
```

### Obtenir la lore d'un item spécifique

```javascript
// Par ID et catégorie
const lore = window.ItemsLoreSystem.getItemLore('BROKEN_OATH', 'WEAPONS');

// Recherche automatique dans toutes les catégories
const lore2 = window.ItemsLoreSystem.getItemLore('VILLAGE_FLAME');
```

### Vérifier les interactions de classe

```javascript
const player = game.getCurrentPlayer();

// Vérifier si l'item a une interaction spéciale avec la classe
if (window.ItemsLoreSystem.hasClassInteraction('BROKEN_OATH', player.classId)) {
  console.log('Cet item a une histoire spéciale avec votre classe !');
}

// Obtenir le dialogue
const dialogue = window.ItemsLoreSystem.getClassDialogue('VILLAGE_FLAME', 'WITCH_OF_ASHES');
if (dialogue) {
  dialogue.forEach(line => console.log(line));
}
```

### Obtenir les effets de corruption

```javascript
const player = game.getCurrentPlayer();

// Obtenir l'effet actif selon le niveau de corruption
const effect = window.ItemsLoreSystem.getCorruptionEffect('BROKEN_OATH', player.corruption);

if (effect) {
  console.log('Effet actuel:', effect.effect);
  console.log('Visuel:', effect.visual);
}
```

### Rechercher par affinité divine

```javascript
// Obtenir tous les items liés à un dieu
const morwynItems = window.ItemsLoreSystem.getItemsByGodAffinity('MORWYN');

morwynItems.forEach(item => {
  console.log(`${item.name} - ${item.godAffinity}`);
});
```

### Vérifier les fins alternatives

```javascript
const player = game.getCurrentPlayer();

// Vérifier si un item peut débloquer une fin alternative
const ending = window.ItemsLoreSystem.canUnlockEnding('VILLAGE_FLAME', player);

if (ending) {
  console.log('Fin alternative débloquable:', ending);
  // Ex: 'ENDING_A_REDEMPTION'
}
```

### Obtenir une quête liée à un item

```javascript
const player = game.getCurrentPlayer();

// Obtenir la quête
const quest = window.ItemsLoreSystem.getItemQuest('BROKEN_OATH', player.classId);

if (quest) {
  console.log('Nom:', quest.name);
  console.log('Condition:', quest.condition);
  console.log('Récompense:', quest.reward);
}
```

## 🎮 Utilisation en jeu

### Inspecter un item dans l'inventaire

```javascript
// Automatique : clic droit sur un item dans l'inventaire
// Ou manuellement :
const player = game.getCurrentPlayer();
const item = { id: 'BROKEN_OATH', name: 'Serment Brisé', icon: '⚔️' };

window.ItemInspectionModal.show(item, player);
```

### Exemple de drop d'item avec lore

```javascript
function dropItemWithLore(player, itemId) {
  // Ajouter l'item à l'inventaire
  player.inventory.addItem(itemId);

  // Enrichir avec lore
  const enrichedItem = window.ItemsLoreSystem.enrichItem({ id: itemId });

  // Afficher un message avec la lore courte
  if (enrichedItem.lore && enrichedItem.lore.short) {
    game.showNotification(
      enrichedItem.name,
      enrichedItem.lore.short,
      '#D4AF37'
    );
  }

  // Si c'est une interaction de classe
  if (window.ItemsLoreSystem.hasClassInteraction(itemId, player.classId)) {
    const dialogue = window.ItemsLoreSystem.getClassDialogue(itemId, player.classId);

    if (dialogue && dialogue[0]) {
      setTimeout(() => {
        game.showNotification(
          '💭 Réminiscence',
          dialogue[0],
          '#8B008B'
        );
      }, 2000);
    }
  }
}
```

### Effet de corruption au ramassage

```javascript
function pickupCorruptedItem(player, itemId) {
  // Enrichir l'item
  const enrichedItem = window.ItemsLoreSystem.enrichItem({ id: itemId });

  // Ajouter à l'inventaire
  player.inventory.addItem(itemId);

  // Si l'item a des effets passifs de corruption
  if (enrichedItem.corruptionEffects && enrichedItem.corruptionEffects.passive) {
    const passiveEffect = enrichedItem.corruptionEffects.passive;

    if (passiveEffect.reason) {
      game.addLog('💀', `${enrichedItem.name}: ${passiveEffect.reason}`);
    }
  }
}
```

### Équiper un item avec vérification de corruption

```javascript
function equipItem(player, itemId) {
  const enrichedItem = window.ItemsLoreSystem.enrichItem({ id: itemId });

  // Vérifier l'effet de corruption actuel
  const corruptionEffect = window.ItemsLoreSystem.getCorruptionEffect(
    itemId,
    player.corruption
  );

  if (corruptionEffect) {
    // Afficher l'effet actuel
    game.showNotification(
      '💀 Corruption Active',
      corruptionEffect.effect,
      '#8B0000'
    );

    // Jouer dialogue si présent
    if (corruptionEffect.dialogue) {
      setTimeout(() => {
        game.addLog('👁️', corruptionEffect.dialogue);
      }, 1500);
    }
  }

  // Équiper l'item
  player.equippedWeapon = enrichedItem;
}
```

## 📊 Structure des données

### Exemple d'item enrichi

```javascript
{
  // Données fonctionnelles (ITEMS_DATABASE)
  id: 'BROKEN_OATH',
  name: 'Serment Brisé',
  type: 'WEAPON',
  slot: 'MAIN_HAND',
  rarity: 'legendary',
  icon: '⚔️',
  stats: { atk: 45, critChance: 15 },
  price: 5000,

  // Données narratives (items-lore.json)
  godAffinity: 'MORWYN',
  lore: {
    short: "L'épée qui pleure les serments brisés.",
    full: "Forgée par le dernier forgeron de Morwyn...",
    secretLore: "La seconde moitié existe quelque part..."
  },

  // Effets de corruption
  corruptionEffects: {
    pure: {
      trigger: "corruption < 30%",
      effect: "+10% damage vs corrupted enemies",
      visual: "Lame brille d'une lueur blanche"
    },
    corrupted: {
      trigger: "corruption > 70%",
      effect: "Lame pleure du sang noir...",
      audio: "Gémissements faibles audibles"
    }
  },

  // Interaction de classe
  specialInteraction: {
    class: 'SHATTERED_KNIGHT',
    dialogue: ["..."],
    quest: {
      name: 'Réparer le Serment',
      condition: '7 serments parfaits consécutifs',
      reward: { item: 'REPAIRED_OATH', stats: {...} }
    }
  },

  // Informations de drop
  drop: {
    source: "Boss 'The Keeper of Bones' (Étage 3)",
    chance: 15
  }
}
```

## 🎨 Personnalisation du Modal

Le modal d'inspection utilise `css/item-inspection-modal.css`. Vous pouvez :

### Modifier les couleurs par rareté

```css
.rarity-mythic {
  background: rgba(255, 0, 255, 0.3);
  color: #FF00FF;
  border: 1px solid #FF00FF;
  box-shadow: 0 0 20px rgba(255, 0, 255, 0.6);
}
```

### Ajouter des animations personnalisées

```css
.item-modal-icon.weapon {
  animation: weaponSpin 4s linear infinite;
}

@keyframes weaponSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

## 🔊 Sons associés

Intégrer dans `audio.js` :

```javascript
const ITEM_SOUNDS = {
  item_inspect: 'sounds/ui/item_inspect.mp3',
  item_legendary_drop: 'sounds/items/legendary_drop.mp3',
  item_corruption_warning: 'sounds/corruption/warning.mp3'
};
```

Jouer le son :

```javascript
window.ItemInspectionModal.show = function(item, player) {
  // Code existant...

  // Jouer son selon rareté
  if (item.rarity === 'legendary') {
    AudioManager.playSFX('item_inspect_legendary');
  } else {
    AudioManager.playSFX('item_inspect');
  }
};
```

## 💡 Bonnes pratiques

### 1. **Toujours enrichir avant d'afficher**
```javascript
// ❌ Mauvais
const item = ITEMS_DATABASE.WEAPONS.BROKEN_OATH;
showItemTooltip(item);

// ✅ Bon
const item = ITEMS_DATABASE.WEAPONS.BROKEN_OATH;
const enriched = window.ItemsLoreSystem.enrichItem(item);
showItemTooltip(enriched);
```

### 2. **Vérifier le chargement avant utilisation**
```javascript
if (window.ItemsLoreSystem.loaded) {
  const enriched = window.ItemsLoreSystem.enrichItem(item);
} else {
  console.warn('Lore pas encore chargée');
}
```

### 3. **Utiliser les events de corruption**
```javascript
window.addEventListener('corruptionChanged', (event) => {
  const { newValue } = event.detail;

  // Mettre à jour les effets des items équipés
  updateEquippedItemEffects(player, newValue);
});
```

## 🎯 Cas d'usage avancés

### Système de crafting avec lore

```javascript
function craftItem(ingredients, recipe) {
  const craftedItem = recipe.result;
  const enriched = window.ItemsLoreSystem.enrichItem(craftedItem);

  // Générer une lore dynamique basée sur les ingrédients
  if (enriched.lore) {
    const customLore = `Forgé avec ${ingredients.map(i => i.name).join(', ')}. ${enriched.lore.full}`;
    enriched.lore.full = customLore;
  }

  return enriched;
}
```

### Évolution d'item selon corruption

```javascript
function evolveItemWithCorruption(item, player) {
  const corruption = player.corruption;

  if (corruption >= 75 && item.id === 'BROKEN_OATH') {
    // Transformer en version corrompue
    return {
      ...item,
      id: 'BROKEN_OATH_CORRUPTED',
      name: 'Serment Maudit',
      stats: { atk: 60, corruptionDamage: 15 },
      icon: '⚔️💀'
    };
  }

  return item;
}
```

## 📋 Checklist d'intégration

- [x] `items-lore.json` créé dans `/MD/`
- [x] `items-lore-integration.js` ajouté
- [x] `item-inspection-modal.css` ajouté
- [x] Scripts intégrés dans `game.html`
- [x] Clic droit sur items pour inspection
- [x] Système de corruption synchronisé
- [x] Modal AAA+ dark fantasy
- [ ] Sons d'inspection d'items
- [ ] Particules sur items légendaires
- [ ] Animations de drop spéciales
- [ ] Système de quêtes d'items
- [ ] Achievements liés aux items

## 🐛 Dépannage

### Le modal ne s'affiche pas
```javascript
// Vérifier dans la console
console.log('ItemsLoreSystem loaded:', window.ItemsLoreSystem.loaded);
console.log('ItemInspectionModal initialized:', window.ItemInspectionModal.initialized);
```

### Les effets de corruption ne fonctionnent pas
```javascript
// Vérifier la corruption du joueur
const player = game.getCurrentPlayer();
console.log('Player corruption:', player.corruption);

// Vérifier l'effet
const effect = window.ItemsLoreSystem.getCorruptionEffect('ITEM_ID', player.corruption);
console.log('Active effect:', effect);
```

### La lore ne se charge pas
```javascript
// Forcer le rechargement
await window.ItemsLoreSystem.loadLore();

// Vérifier le fichier
fetch('/MD/items-lore.json')
  .then(r => r.json())
  .then(data => console.log('Lore data:', data))
  .catch(e => console.error('Erreur:', e));
```

---

**Dernière mise à jour**: v0.2 Alpha
**Auteur**: THE LAST COVENANT - Items Narrative Team
