# 🏰 INTÉGRATION DU SYSTÈME DE NŒUDS DE DESTIN

## 📋 STATUT : SYSTÈME DE TEST EN PARALLÈLE

Ce document explique comment intégrer le nouveau système de génération de donjon basé sur les Nœuds de Destin dans le jeu principal **SI LES TESTS SONT CONCLUANTS**.

---

## 🎯 FICHIERS CRÉÉS (Test en Parallèle)

### Nouveaux Fichiers (N'affectent PAS le jeu actuel)

```
✅ js/dungeon-nodes.js          - Système complet de Nœuds de Destin
✅ dungeon-test.html             - Page de démo interactive
✅ MD/DUNGEON_NODES_INTEGRATION.md - Ce document
```

### Fichiers Existants (INTACTS)

```
🔒 js/dungeon.js        - Ancien système (GARDE tel quel)
🔒 js/game.js           - Jeu principal (GARDE tel quel)
🔒 game.html            - Page de jeu (GARDE tel quel)
```

**⚠️ IMPORTANT : Aucun fichier existant n'a été modifié. Le jeu fonctionne exactement comme avant.**

---

## 🧪 COMMENT TESTER LE NOUVEAU SYSTÈME

### Étape 1 : Ouvrir la Page de Test

1. Ouvrir dans un navigateur : `dungeon-test.html`
2. La page charge automatiquement le système de Nœuds

### Étape 2 : Expérimenter avec les Stats

La page permet d'ajuster :
- **HP** : 1-100 (affecte Nœud 1)
- **Corruption** : 0-100% (affecte Nœud 1)
- **Momentum** : 0-3 (affecte Nœud 2)
- **Fardeau** : 0-10 objets (affecte Nœud 2)
- **Pactes Signés** : 0-5 (débloque chemins fantômes)
- **Stade du Dé** : 1-5 (débloque chemins fantômes)

### Étape 3 : Observer les Résultats

**Bouton "Générer Donjon"** :
- Affiche les 2 Nœuds de Destin avec leurs 3 chemins possibles
- Highlight le chemin pris selon les stats
- Montre l'historique des décisions
- Affiche le chemin complet (25 cases)

**Bouton "Stats Aléatoires"** :
- Randomize toutes les stats
- Génère automatiquement un nouveau donjon
- Permet de voir rapidement différentes combinaisons

**Bouton "Simuler 10 Runs"** :
- Simule 10 runs avec des stats aléatoires
- Montre la variété des chemins générés
- Prouve la rejouabilité du système

### Étape 4 : Scénarios de Test Recommandés

#### Test 1 : Run "Pur"
```
HP: 100
Corruption: 0%
Momentum: 0
Fardeau: 0
Pactes: 0
Stade: 3

Résultat attendu:
  Nœud 1 → Vieille Route (safe)
  Nœud 2 → Voie Claire (équilibrée)
  Chemin Fantôme: La Voie du Pur (si Stade ≥ 3)
```

#### Test 2 : Run "Corrompu"
```
HP: 50
Corruption: 80%
Momentum: 1
Fardeau: 2
Pactes: 4
Stade: 4

Résultat attendu:
  Nœud 1 → Sentier Profané (corruption)
  Nœud 2 → Voie Claire (défaut)
  Pas de chemin fantôme Thalys (seulement à 3+ pactes ET 60%+ corruption)
```

#### Test 3 : Run "Désespéré"
```
HP: 20
Corruption: 10%
Momentum: 3
Fardeau: 7
Pactes: 0
Stade: 1

Résultat attendu:
  Nœud 1 → Défilé des Os (HP ≤ 40%)
  Nœud 2 → Spirale du Hasard (Momentum ≥ 2)
```

#### Test 4 : Run "Surcharge"
```
HP: 70
Corruption: 25%
Momentum: 0
Fardeau: 9
Pactes: 1
Stade: 2

Résultat attendu:
  Nœud 1 → Vieille Route (défaut)
  Nœud 2 → Chemin du Poids (Fardeau ≥ 5)
```

---

## ✅ SI LES TESTS SONT CONCLUANTS : PLAN D'INTÉGRATION

### Option A : Remplacement Total (Recommandé)

#### Avantages
- Code plus simple et court
- Rejouabilité stratégique
- Carte mémorable
- Aucun bug de génération procédurale

#### Inconvénients
- Change complètement le système actuel
- Nécessite rééquilibrage des events

#### Étapes d'Intégration

**1. Sauvegarder l'ancien système**
```bash
# Créer dossier archive si besoin
mkdir -p archive/js

# Sauvegarder l'ancien dungeon.js
cp js/dungeon.js archive/js/dungeon-old.js
```

**2. Modifier `game.js`**

Remplacer :
```javascript
// ANCIEN
GameState.dungeon = DungeonGenerator.generate();
```

Par :
```javascript
// NOUVEAU
if (!window.dungeonSystem) {
  window.dungeonSystem = new NodeBasedDungeon();
}

const playerState = {
  hp: player.hp,
  maxHp: player.maxHp,
  corruption: player.corruption || 0,
  momentum: player.momentum || 0,
  pactsSigned: player.pactsSigned || 0,
  diceStage: window.DiceSystem ? window.DiceSystem.stage : 1,
  inventory: player.inventory
};

const dungeonResult = window.dungeonSystem.generate(playerState);
GameState.dungeon = dungeonResult.path;
GameState.dungeonDecisions = dungeonResult.decisions;
GameState.dungeonMetadata = dungeonResult.metadata;
```

**3. Ajouter le script dans `game.html`**

Ajouter avant `js/game.js` :
```html
<!-- ✅ NOUVEAU : Système de Nœuds de Destin -->
<script src="js/dungeon-nodes.js"></script>
```

**4. (Optionnel) Afficher les Nœuds visuellement pendant le jeu**

Créer une UI qui montre les chemins possibles quand le joueur arrive à un Nœud :
```javascript
// Dans game.js, quand joueur atteint une case Nœud
if (currentTile.isNode) {
  const viz = window.dungeonSystem.getNodeVisualization(currentTile.nodeId, player);
  showNodeModal(viz); // Affiche les 3 chemins avec conditions
}
```

---

### Option B : Système Hybride (Compromis)

Garder la génération procédurale **MAIS** injecter des Nœuds de Destin à des positions fixes.

#### Étapes

**1. Modifier `dungeon.js`** (ancien système)

Ajouter après génération :
```javascript
// Injecter des Nœuds de Destin
static injectNodes(path, player) {
  const nodeSystem = new NodeBasedDungeon();

  // Injecter Nœud 1 à la position 8
  if (path.length >= 8) {
    const node1 = nodeSystem.nodes[0];
    const decision = node1.resolve(player);
    const segmentTiles = nodeSystem.segments[decision.segment].tiles;

    // Remplacer cases 8-12 par le segment choisi
    path.splice(8, 5, ...segmentTiles);
  }

  // Injecter Nœud 2 à la position 18
  if (path.length >= 18) {
    const node2 = nodeSystem.nodes[1];
    const decision = node2.resolve(player);
    const segmentTiles = nodeSystem.segments[decision.segment].tiles;

    path.splice(18, 5, ...segmentTiles);
  }

  return path;
}
```

#### Avantages
- Garde la génération procédurale pour certaines zones
- Ajoute la non-linéarité sans tout refaire

#### Inconvénients
- Code plus complexe (2 systèmes en parallèle)
- Moins élégant que l'Option A

---

### Option C : Toggle (Pour Tester en Production)

Créer un toggle pour basculer entre ancien et nouveau système.

#### Étapes

**1. Ajouter une variable de configuration**

Dans `game.js` :
```javascript
const USE_NODE_SYSTEM = true; // false = ancien système

if (USE_NODE_SYSTEM) {
  // Nouveau système
  const dungeonResult = window.dungeonSystem.generate(playerState);
  GameState.dungeon = dungeonResult.path;
} else {
  // Ancien système
  GameState.dungeon = DungeonGenerator.generate();
}
```

**2. Ajouter un bouton dans le menu**

Permet aux joueurs de choisir leur système préféré.

---

## 🎨 AMÉLIORATION : VISUALISATION DES NŒUDS EN JEU

Si tu veux montrer les Nœuds **pendant** le jeu (pas juste en génération) :

### Créer une Modal de Nœud

Quand le joueur arrive à un Nœud, afficher :
```
┌────────────────────────────────────────────────┐
│  🔀 LE CARREFOUR BRISÉ                         │
│                                                │
│  Trois chemins s'ouvrent devant toi.           │
│  Ton état détermine lequel tu empruntes.       │
│                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  │ 🛡️ Vieille   │  │ ⚡ Défilé    │  │ 💀 Sentier   │
│  │    Route     │  │    des Os    │  │    Profané   │
│  │              │  │              │  │              │
│  │ Défaut       │  │ HP ≤ 40%     │  │ Corrupt ≥30% │ ← Conditions
│  │              │  │              │  │              │
│  │ Safe • Lent  │  │ Rapide • Dur │  │ Rentable •   │
│  │              │  │              │  │ Corrupteur   │
│  └──────────────┘  └──────────────┘  └──────────────┘
│                         ↑
│                     CHEMIN PRIS
│
│  Raison: HP 35/100 (35%) ≤ 40% → Défilé des Os
│
│  [Continuer]
└────────────────────────────────────────────────┘
```

Code pour créer cette modal :
```javascript
function showNodeModal(nodeViz) {
  const modal = document.createElement('div');
  modal.className = 'node-modal';
  modal.innerHTML = `
    <div class="node-modal-content">
      <h2>${nodeViz.name}</h2>
      <p>${nodeViz.description}</p>

      <div class="node-paths">
        ${nodeViz.paths.map(path => `
          <div class="node-path ${path.isActive ? 'active' : ''}">
            <div class="path-icon">${path.icon}</div>
            <div class="path-name">${path.name}</div>
            <div class="path-condition">${path.conditionShort}</div>
            <div class="path-preview">${path.preview}</div>
          </div>
        `).join('')}
      </div>

      <div class="node-reason">
        <strong>Chemin pris:</strong> ${nodeViz.reason}
      </div>

      <button class="btn" onclick="closeNodeModal()">Continuer</button>
    </div>
  `;

  document.body.appendChild(modal);
}
```

---

## 🐛 DEBUGGING : SI QUELQUE CHOSE NE MARCHE PAS

### Problème 1 : "NodeBasedDungeon is not defined"

**Cause** : Script non chargé ou chargé dans le mauvais ordre

**Solution** :
```html
<!-- Vérifier que dungeon-nodes.js est chargé AVANT game.js -->
<script src="js/dungeon-nodes.js"></script>
<script src="js/game.js"></script>
```

### Problème 2 : Le donjon a toujours le même chemin

**Cause** : Les stats du joueur ne changent pas entre les runs

**Solution** : Vérifier que `player.corruption`, `player.momentum`, etc. sont bien mis à jour pendant le jeu

### Problème 3 : Un chemin fantôme n'apparaît jamais

**Cause** : Conditions trop strictes

**Solution** : Ajuster les conditions dans `definePhantomPaths()` :
```javascript
// AVANT (trop strict)
unlockCondition: (player) => player.pactsSigned >= 3 && player.corruption >= 60

// APRÈS (plus accessible)
unlockCondition: (player) => player.pactsSigned >= 2 || player.corruption >= 50
```

---

## 📊 COMPARAISON : ANCIEN vs NOUVEAU SYSTÈME

| Aspect | Ancien Système (dungeon.js) | Nouveau Système (dungeon-nodes.js) |
|--------|----------------------------|-----------------------------------|
| **Génération** | Procédurale (aléatoire) | Conçue (basée sur états) |
| **Rejouabilité** | Différent mais aléatoire | Même plateau, choix différents |
| **Carte** | Nouvelle à chaque run | Mémorable, apprise |
| **Choix stratégiques** | Aucun | 2 Nœuds avec 3 chemins chacun |
| **Conséquences** | Aucune | États du joueur déterminent le chemin |
| **Longueur du code** | 692 lignes | ~450 lignes |
| **Bugs de collision** | Possibles | Impossibles (pas de génération) |
| **Chemins secrets** | Non | Oui (chemins fantômes) |
| **Profondeur** | Faible | Élevée |
| **Intégration Momentum/Pacte** | Difficile | Native |

---

## 🚀 PROCHAINES ÉTAPES POSSIBLES

Si le système de Nœuds est adopté, on peut ajouter :

### 1. Plus de Nœuds (3-4 au lieu de 2)
Augmente la complexité stratégique.

### 2. Nœuds Conditionnels
Certains Nœuds n'apparaissent que si conditions spécifiques :
```javascript
{
  id: 'NODE_SECRET',
  name: "Le Sanctuaire Oublié",
  appearsIf: (player) => player.corruption === 0,
  // ...
}
```

### 3. Segments Dynamiques
Les segments eux-mêmes peuvent varier selon les stats :
```javascript
SEGMENT_A: {
  tiles: (player) => {
    // Si corruption > 50, ajouter des events corrompus
    const baseTiles = [...];
    if (player.corruption > 50) {
      baseTiles.push({ type: 'corruption_event' });
    }
    return baseTiles;
  }
}
```

### 4. Boucles de Risque Interactives
Permettre au joueur de **choisir** de rester dans une boucle :
```javascript
{
  type: 'risk_loop',
  onEnter: (player) => {
    showModal({
      title: "Boucle de Risque",
      message: "Rester ici pour farmer ? +1 loot, +5% corruption/tour.",
      choices: [
        { label: "Rester", action: 'stay' },
        { label: "Continuer", action: 'leave' }
      ]
    });
  }
}
```

### 5. Système de Seeds
Permettre de reproduire une run spécifique :
```javascript
const seed = 'CORRUPTED_RUN_42';
const dungeon = dungeonSystem.generate(player, seed);
```

---

## 📝 NOTES FINALES

### Ce Qui Fonctionne MAINTENANT
✅ Système complet de Nœuds de Destin
✅ Page de test interactive
✅ Simulation de rejouabilité
✅ Chemins fantômes (secrets)
✅ Aucun impact sur le jeu actuel

### Ce Qui Reste à Faire (SI INTÉGRATION)
⏳ Modifier `game.js` pour utiliser le nouveau système
⏳ Ajouter l'UI de visualisation des Nœuds en jeu
⏳ Équilibrer les segments (difficulté, récompenses)
⏳ Ajouter plus de segments (optionnel)
⏳ Tester avec de vrais joueurs

---

## 🎯 DÉCISION À PRENDRE

**Question pour toi** :

Après avoir testé `dungeon-test.html`, tu préfères :

1. **Option A** : Adopter complètement le nouveau système (remplacement total)
2. **Option B** : Système hybride (mélange ancien + nouveau)
3. **Option C** : Toggle (laisser le choix aux joueurs)
4. **Garder l'ancien** : Le nouveau système ne te convainc pas

**Dis-moi et je procède à l'intégration !** 🚀

---

**Créé le** : 2025-12-28
**Auteur** : Claude (Sonnet 4.5)
**Status** : Test en Parallèle - Aucun Impact sur le Jeu Actuel
