# 🎨 GAME TEST ISOMÉTRIQUE - Guide d'Utilisation

## 📦 FICHIERS CRÉÉS (Système en Parallèle)

### Nouveaux fichiers (N'affectent PAS le jeu principal)

```
✅ game-test.html              - Page de test avec rendu isométrique
✅ js/game-test.js             - Logique de jeu avec Nœuds de Destin
✅ js/isometric-renderer.js    - Renderer 2.5D avec profondeur
✅ MD/GAME_TEST_ISOMETRIC.md   - Ce document
```

### Fichiers existants (INTACTS)

```
🔒 game.html                   - Jeu principal (GARDE tel quel)
🔒 js/game.js                  - Logique principale (GARDE tel quel)
🔒 Tous les autres fichiers    - INCHANGÉS
```

**⚠️ IMPORTANT : Aucun fichier existant n'a été modifié. Le jeu principal fonctionne exactement comme avant.**

---

## 🚀 COMMENT TESTER

### Étape 1 : Ouvrir la Page de Test

1. Ouvrir dans un navigateur : **`game-test.html`**
2. Le jeu se charge automatiquement

### Étape 2 : Interface

**HUD (Haut Gauche)** :
- ❤️ HP : Points de vie du joueur
- 💀 Corruption : Niveau de corruption
- ⚡ Momentum : Compteur d'échecs
- 📍 Position : Case actuelle / Total
- 👻 Chemins Fantômes : Liste des chemins secrets débloqués

**Info Tile (Haut Droit)** :
- Nom de la case actuelle
- Type de case
- Description

**Contrôles (Bas Centre)** :
- 🎲 Lancer le Dé : Lance 1d6 et avance
- 🔄 Régénérer Donjon : Crée un nouveau donjon

**Decision Log (Bas Droit)** :
- Historique des décisions prises aux Nœuds

### Étape 3 : Jouer

1. **Cliquer sur "🎲 Lancer le Dé"**
   - Un dé 1-6 est lancé
   - Le résultat s'affiche au centre (1-2 secondes)
   - Le joueur avance du nombre de cases

2. **Quand vous atteignez un Nœud de Destin** :
   - Une modal s'affiche
   - Montre vos stats actuelles
   - Révèle le chemin pris selon vos stats
   - Explication de pourquoi ce chemin

3. **Continuer jusqu'à la fin** :
   - Quand vous atteignez la case finale (boss)
   - Modal de fin apparaît
   - Bouton "Recommencer" pour rejouer

---

## 🎨 CARACTÉRISTIQUES VISUELLES

### Rendu Isométrique 2.5D

**Projection** :
- Vue isométrique (45° angle)
- Profondeur visuelle avec layering
- Conversion automatique coordonnées cartésiennes → iso

**Textures Procédurales** (5 types) :
1. **Pierre Sombre** : Sol normal (#1a1820)
2. **Pierre Corrompue** : Sentier Profané (#4a0e0e)
3. **Pierre Claire** : Vieille Route (#2a2838)
4. **Os** : Défilé des Os (beige + sang)
5. **Brume** : Spirale du Hasard (violet)

**Effets de Profondeur** :
- Layer 1 : Background (brume, montagnes lointaines)
- Layer 2 : Dungeon tiles (sol)
- Layer 3 : Nodes (Nœuds de Destin avec runes)
- Layer 4 : Entities (joueur)
- Layer 5 : Particules (cendres, lumières)
- Layer 6 : Post-FX (vignette, grain)

### Post-Processing

**Vignette Massive** :
- Coins très sombres (opacity: 0.7-0.8)
- Radial gradient du centre vers l'extérieur
- Effet d'oppression visuelle

**Grain Film** :
- Texture analogique animée
- Noise SVG avec turbulence fractale
- Animation subtile (steps(10))

**Lumières Dynamiques** :
- Aura dorée autour du joueur
- Glow sur les Nœuds de Destin
- Torches sur cases spéciales

**Ombres Portées** :
- Ombre sous chaque tile
- Ombre sous le joueur
- Profondeur 3D simulée

---

## 🎮 FONCTIONNALITÉS

### Système de Nœuds de Destin

**2 Nœuds** :
1. **Le Carrefour Brisé** (Position 8)
   - 3 chemins possibles
   - Résolution basée sur Corruption/HP

2. **Le Jugement du Dé** (Position 18)
   - 3 chemins possibles
   - Résolution basée sur Momentum/Fardeau

**Révélation des Chemins** :
- Arrivée sur Nœud → Modal
- Affichage état du joueur
- Message de révélation
- Un seul chemin s'illumine
- Explication claire

### Chemins Fantômes

**2 Chemins Secrets** :
1. **L'Étreinte de Thalys**
   - Condition : 3+ pactes + 60%+ corruption
   - Raccourci vers boss
   - Très risqué

2. **La Voie du Pur**
   - Condition : 0% corruption + Stade Dé ≥ 3
   - Bénédictions divines
   - Très rare

### Caméra Dynamique

**Smooth Follow** :
- Caméra suit le joueur automatiquement
- Interpolation lisse (smoothness: 0.1)
- Centrage progressif

**Camera Shake** :
- Tremblement lors du mouvement
- Tremblement intense aux Nœuds
- Intensité décroissante automatique

### Particules

**Particules Dorées** :
- Autour des Nœuds de Destin
- Durée de vie : 60 frames
- Mouvement ascendant
- Fade-out progressif

---

## 🎯 TESTER LES DIFFÉRENTS CHEMINS

### Scénario 1 : Run Corrompu

**Configuration** :
```javascript
player.corruption = 50;
player.hp = 100;
player.momentum = 0;
```

**Résultat Attendu** :
- Nœud 1 → **Sentier Profané** (corruption ≥ 30%)
- Tiles rouges/noires avec veines
- Ambiance sombre

### Scénario 2 : Run Désespéré

**Configuration** :
```javascript
player.corruption = 10;
player.hp = 30;
player.momentum = 2;
```

**Résultat Attendu** :
- Nœud 1 → **Défilé des Os** (HP ≤ 40%)
- Nœud 2 → **Spirale du Hasard** (Momentum ≥ 2)
- Tiles avec os et brume violette

### Scénario 3 : Run Safe

**Configuration** :
```javascript
player.corruption = 0;
player.hp = 100;
player.momentum = 0;
```

**Résultat Attendu** :
- Nœud 1 → **Vieille Route** (défaut)
- Nœud 2 → **Voie Claire** (défaut)
- Tiles grises claires

---

## 🔧 PERSONNALISATION

### Modifier les Stats du Joueur

Dans `game-test.js`, ligne 17-27 :

```javascript
this.player = {
  name: 'Le Pactisé',
  icon: '🧙',
  position: 0,
  hp: 100,           // ← Modifier ici
  maxHp: 100,
  corruption: 0,     // ← Modifier ici
  momentum: 0,       // ← Modifier ici
  pactsSigned: 0,    // ← Modifier ici
  diceStage: 1,      // ← Modifier ici
  inventory: { items: [] }
};
```

### Modifier le Rendu

Dans `isometric-renderer.js`, ligne 6-14 :

```javascript
this.config = {
  tileWidth: 64,      // ← Largeur des tiles
  tileHeight: 32,     // ← Hauteur des tiles
  tileDepth: 16,      // ← Profondeur (élévation)
  scale: 1.0,
  darkMode: true
};
```

### Modifier les Post-FX

Dans `isometric-renderer.js`, ligne 39-44 :

```javascript
this.postFX = {
  vignette: 0.7,            // ← Intensité vignette (0-1)
  grain: 0.15,              // ← Intensité grain (0-1)
  chromaticAberration: 2,   // ← Aberration chromatique (pixels)
  bloom: 0.3                // ← Bloom (0-1)
};
```

### Ajouter des Textures Personnalisées

**Option 1 : Remplacer Textures Procédurales**

Dans `isometric-renderer.js`, fonction `generateTextures()` :

```javascript
// Charger une image au lieu de générer
this.textures.stone = await this.loadImage('textures/stone-floor.png');
```

**Option 2 : Ajouter un Nouveau Type**

```javascript
this.textures.custom = this.generateStoneTexture(256, {
  baseColor: '#yourColor',
  variation: 20,
  cracks: 10,
  noise: 5000
});
```

---

## 🐛 TROUBLESHOOTING

### Problème : Canvas vide/noir

**Cause** : Dépendances non chargées

**Solution** :
1. Ouvrir la console (F12)
2. Vérifier les erreurs
3. S'assurer que `dungeon-nodes.js` et `isometric-renderer.js` sont chargés

### Problème : Joueur ne bouge pas

**Cause** : Bouton "Lancer Dé" ne répond pas

**Solution** :
1. Vérifier console pour erreurs
2. Vérifier que `game-test.js` est chargé
3. Recharger la page (F5)

### Problème : Textures bizarres

**Cause** : Génération procédurale aléatoire

**Solution** :
1. Recharger la page (nouvelles textures générées)
2. Ou ajuster paramètres dans `generateTextures()`

### Problème : Performance lente

**Cause** : Trop de particules ou post-FX trop lourds

**Solution** :
```javascript
// Réduire particules
if (Math.random() < 0.05) { // Au lieu de 0.1
  this.addParticle(...);
}

// Réduire grain
this.postFX.grain = 0.05; // Au lieu de 0.15
```

---

## 📊 COMPARAISON : Ancien vs Nouveau Rendu

| Aspect | Ancien (game.html) | Nouveau (game-test.html) |
|--------|-------------------|--------------------------|
| **Vue** | Top-down 2D | Isométrique 2.5D |
| **Profondeur** | Aucune | Layering + ombres |
| **Textures** | Couleurs plates | Procédurales détaillées |
| **Post-FX** | Basiques | Vignette + Grain + Bloom |
| **Atmosphère** | Neutre | Très lugubre |
| **Caméra** | Statique | Smooth follow + shake |
| **Particules** | Non | Oui (dorées) |
| **Lumières** | Non | Oui (dynamiques) |

---

## 🚀 PROCHAINES ÉTAPES POSSIBLES

### Si le Rendu te Plaît

1. **Ajouter Textures Réelles**
   - Remplacer textures procédurales par PNG
   - stone-floor.png (512x512)
   - corrupted-ground.png (512x512)

2. **Améliorer Animations**
   - Transition smooth entre tiles
   - Rotation du joueur selon direction
   - Particules spécifiques par type de tile

3. **Intégrer dans Jeu Principal**
   - Remplacer renderer dans `game.html`
   - Adapter tous les events
   - Tester compatibilité

4. **Ajouter Plus d'Effets**
   - Scanlines (CRT)
   - Chromatic aberration (rouge/bleu décalé)
   - Bloom sur lumières
   - Depth of field (flou distant)

---

## 📝 NOTES TECHNIQUES

### Performance

**Canvas Size** : 1920x1080
**Target FPS** : 60 FPS
**Render Loop** : requestAnimationFrame

**Optimisations** :
- Textures générées 1 seule fois au démarrage
- Particules limitées (max ~100)
- Post-FX appliqués en dernier
- Ombres pré-calculées

### Compatibilité

**Navigateurs supportés** :
- ✅ Chrome/Edge (Chromium) : Parfait
- ✅ Firefox : Parfait
- ⚠️ Safari : Bon (grain peut être différent)
- ❌ IE11 : Non supporté (Canvas API moderne)

---

**Créé le** : 2025-12-28
**Auteur** : Claude (Sonnet 4.5)
**Status** : Test en Parallèle - MVP Fonctionnel
