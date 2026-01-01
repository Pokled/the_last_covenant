ANALYSE ET AUDIT DU PROJET
Statistiques Générales du Projet

📊 ÉTAT DES LIEUX
─────────────────────────────────────────────────
Fichiers analysés              : 7
Documents de conception        : 5
Fichiers techniques (JS/HTML)  : 2
Documents lore/narratifs       : 3

📈 MATURITÉ DU PROJET
─────────────────────────────────────────────────
Conception verrouillée         : 40%
En cours de définition         : 35%
À définir                      : 25%

🔄 REDONDANCES DÉTECTÉES
─────────────────────────────────────────────────
Concepts répétés               : Modéré (20%)
Contradictions majeures        : 0
Contradictions mineures        : 2
Documents obsolètes            : 1 (RAPPORT D'ORGANISATION.md)

Points Forts Identifiés

✅ Vision cohérente : Le lore est solide et unifié ✅ Piliers de design clairs : Tension, risque, corruption ✅ Système de corruption verrouillé : Philosophie bien définie ✅ Prototype fonctionnel : Blood Pact System déjà implémenté
Points Faibles Critiques

❌ Manque de spécifications techniques précises dans le GDD ❌ Pas de Game Loop détaillé (boucle joueur précise) ❌ Combat sous-spécifié : "tactique, punitif" n'est pas suffisant ❌ Objets peu définis : Catégories mentionnées mais pas détaillées ❌ Pas de métriques de balance : Combien de HP ? Dégâts moyens ? etc.
MASTER BACKLOG UNIFIÉ
🔴 PRIORITÉ 1 : FONDATIONS (Bloquant)
ID	Tâche	Détail	Statut
MB-01	Définir le Core Loop précis	Action → Résultat → Conséquence (avec timing)	⚠️ URGENT
MB-02	Spécifier le système de Combat	Actions disponibles, timing, damage formula	⚠️ URGENT
MB-03	Créer la formule de Corruption	Comment chaque action augmente la corruption (calculs précis)	⚠️ URGENT
MB-04	Définir les Classes (data complète)	Stats de base, capacités uniques, relation à la corruption	⚠️ URGENT
MB-05	Système de Dés : règles exactes	Quand lance-t-on ? Effets de chaque face ? Probabilités ?	⚠️ URGENT
🟠 PRIORITÉ 2 : SYSTÈMES CORE
ID	Tâche	Détail	Statut
MB-06	Cage Trials : structure complète	10 exemples de cages avec conditions/outcomes	📋 À faire
MB-07	Système d'Objets	3 catégories (neutres, corrompus, sacrificiels) avec 20 exemples	📋 À faire
MB-08	Bestiaire technique	Stats, patterns, drops pour 15 ennemis minimum	📋 À faire
MB-09	Système de Mort/Résurrection	Mécaniques précises, pénalités, progression	📋 À faire
MB-10	Cortège : mécaniques de gestion	Comment recruter ? Perdre ? Avantages précis ?	📋 À faire
🟡 PRIORITÉ 3 : CONTENU & POLISH
ID	Tâche	Détail	Statut
MB-11	Écrire 5 chapitres narratifs	Comme les 3 existants	🟢 3/5 fait
MB-12	UI/UX : wireframes	Mock-ups pour HUD, menus, feedback	📋 À faire
MB-13	Sound Design : liste SFX	50 sons requis minimum	📋 À faire
MB-14	Métriques de balance	Run length moyen, taux de mort, progression corruption	📋 À faire
MB-15	Tutoriel/Onboarding	Première descente guidée	📋 À faire
🟢 PRIORITÉ 4 : TECHNIQUE
ID	Tâche	Détail	Statut
MB-16	Refactor architecture JS	Structure modulaire (voir recommandations ci-dessous)	✅ Partiellement fait
MB-17	Système de Save	LocalStorage ou autre (corruption, progression, unlocks)	📋 À faire
MB-18	Optimisation performance	60 FPS stable, loading times	📋 À faire
MB-19	Tests unitaires	Pour systèmes critiques (corruption, dés)	📋 À faire
DOCUMENT DE CONCEPTION UNIFIÉ (ENRICHI)
1. VISION & INTENTION
Pitch Final

The Last Covenant est un dungeon-crawler narratif où chaque décision a un coût en corruption. Le joueur est immortel mais se dégrade progressivement, transformant chaque run en lutte contre soi-même.
Piliers de Design (Inchangés mais réaffirmés)

    Tension permanente : Le joueur doit toujours choisir entre sécurité et progression
    Risque volontaire : Aucune RNG subie, tout est un choix éclairé
    Corruption systémique : Ressource ET menace, jamais punitive sans contrepartie
    Lisibilité : Le joueur comprend TOUJOURS pourquoi il a perdu

2. CORE LOOP DÉTAILLÉ (NOUVEAU)

┌──────────────────────────────────────────────────┐
│ 1. EXPLORER (Choix de salle)                    │
│    ├─ Salle de Combat (risque moyen)            │
│    ├─ Salle de Cage (risque élevé, reward++)    │
│    ├─ Salle de Repos (corruption--)             │
│    └─ Salle d'Événement (aléatoire narratif)    │
└─────────────┬────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────────┐
│ 2. RÉSOUDRE L'ÉPREUVE                           │
│    ├─ Combat : tour par tour tactique           │
│    ├─ Cage : choix binaire moral                │
│    ├─ Dé : lancer volontaire (boost/malus)      │
│    └─ Pacte : corruption contre pouvoir         │
└─────────────┬────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────────┐
│ 3. RÉCOMPENSE + CORRUPTION                      │
│    ├─ Objet (arme, consommable, relique)        │
│    ├─ +Corruption (5-20% selon action)          │
│    ├─ +XP / Rubis                                │
│    └─ Déblocage narratif                        │
└─────────────┬────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────────┐
│ 4. ADAPTATION                                    │
│    ├─ Gestion corruption (Jardinier, repos)     │
│    ├─ Amélioration équipement (Forgeron)        │
│    ├─ Recrutement NPCs (Cortège)                │
│    └─ Choix : continuer ou retour au camp       │
└─────────────┬────────────────────────────────────┘
              │
              ▼
           RECOMMENCER (ou mourir)

Timing d'un cycle complet : 3-5 minutes Profondeur moyenne d'un run : 10-15 salles avant retour forcé
3. SYSTÈME DE CORRUPTION (ENRICHI)
Formule de Base
javascript

corruption_gain = base_value * corruption_multiplier * class_modifier

Où :
- base_value = action spécifique (ex: 10 pour un pacte mineur)
- corruption_multiplier = 1 + (current_corruption / 100) * 0.5
  → Plus on est corrompu, plus on gagne vite (effet boule de neige)
- class_modifier = selon la classe (Paladin: 0.8x, Nécromancien: 1.2x)

Seuils Enrichis
Seuil	Nom	Effets Mécaniques	Effets Visuels
0-19	Pacte Intact	Aucun malus	Personnage normal
20-39	Fissures	+5% ATK, -5% healing reçu	Veines noires sur les mains
40-59	Profanation	+10% ATK, Ennemis +10% aggro, Déblocage chemins secrets	Yeux légèrement rouges, aura sombre
60-79	Damnation	+20% ATK, -20% healing, NPCs ont peur, Boss alternatifs	Peau pâle, cheveux grisonnants, fumée noire
80-100	Rupture	+50% ATK, healing impossible, fin narrative déclenchée	Transformation visible (selon classe)
Sources de Corruption (Tableau Complet)
Action	Corruption	Bénéfice	Catégorie
Lancer le Dé (résultat 1-3)	+5%	Relance possible	Pouvoir Volontaire
Lancer le Dé (résultat 4-6)	+3%	Boost selon face	Pouvoir Volontaire
Pacte de Sang (mineur)	+10%	Effet immédiat (ATK, HP)	Pouvoir Volontaire
Pacte de Sang (majeur)	+20%	Effet puissant + permanent	Pouvoir Volontaire
Sacrifier un NPC (cage)	+15%	Sauver soi-même + loot	Survie Désespérée
Utiliser Objet Corrompu	+8%	Effet puissant temporaire	Pouvoir Volontaire
Briser un Lieu Sacré	+12%	Accès à zone cachée	Transgression
Tuer un Innocent	+18%	Loot rare	Transgression
Éviter la mort via résurrection automatique	+10%	Continuer le run	Survie Désespérée
4. SYSTÈME DE DÉS (NOUVEAU - VERROUILLÉ)
Règles Exactes

Quand peut-on lancer le Dé ?

    En combat (1 fois par combat maximum)
    Lors d'un événement offrant un choix "risqué"
    Via un Pacte de Sang spécifique

Effets des Faces (1d6)
Face	Nom	Effet	Corruption
1	Échec Critique	-20% HP, ennemi joue 2 fois	+5%
2	Raté	Aucun effet	+3%
3	Neutre	Relance gratuite OU +5% ATK ce tour	+3%
4	Succès	+15% ATK ce tour	+3%
5	Succès Critique	+30% ATK ce tour, ignore armure	+5%
6	Perfection	Tue l'ennemi si <30% HP OU +50% ATK	+8%

Face Cachée (7) : Apparaît uniquement via Pactes

    Effet : Choisir n'importe quel résultat (1-6)
    Corruption : +15%

Dialogue du Dé (Intégré au code)

✅ Déjà implémenté dans blood-pact-system.js avec 40+ phrases variées
5. SYSTÈME DE COMBAT (NOUVEAU - CRITIQUE)
Structure de Base

Type : Tour par tour tactique avec initiative Actions par tour : 2 (Move + Action OU 2 Actions)
Actions Disponibles
Action	Coût	Effet
Attaque de Base	1 action	Dégâts = ATK * (0.8-1.2) random
Attaque Lourde	2 actions	Dégâts = ATK * 1.8, -20% précision
Défense	1 action	Réduit dégâts subis de 50% jusqu'au prochain tour
Esquive	1 action	60% chance d'éviter complètement la prochaine attaque
Compétence de Classe	1-2 actions	Dépend de la classe (voir section Classes)
Utiliser Objet	1 action	Consommable (potion, parchemin)
Lancer le Dé	1 action	Voir système de Dés (1 fois par combat max)
Formule de Dégâts
javascript

damage = (attacker.ATK * skill_multiplier) - (defender.DEF * 0.5)
damage = Math.max(1, damage) // Minimum 1 dégât
critical_hit = random(0-1) < attacker.CRIT_CHANCE ? damage * 2 : damage

Stats de Base (Personnage)
javascript

{
  HP: 100,
  ATK: 15,
  DEF: 10,
  CRIT_CHANCE: 0.1, // 10%
  SPEED: 10 // Détermine l'ordre des tours
}

Exemple d'Ennemi (Garde Corrompu)
javascript

{
  name: "Garde Corrompu",
  HP: 80,
  ATK: 12,
  DEF: 15,
  CRIT_CHANCE: 0.05,
  SPEED: 8,
  patterns: [
    { action: "Attaque de Base", weight: 60 },
    { action: "Attaque Lourde", weight: 30, condition: "HP < 50%" },
    { action: "Défense", weight: 10, condition: "HP < 30%" }
  ],
  drops: [
    { item: "Armure Rouillée", chance: 0.4 },
    { item: "Rubis (5-10)", chance: 1.0 }
  ]
}

6. CLASSES (NOUVEAU - SPECS COMPLÈTES)
Template de Classe
javascript

{
  id: "CLASS_ID",
  name: "Nom Affiché",
  description: "Description courte",
  startingStats: {
    HP: 100,
    ATK: 15,
    DEF: 10,
    CRIT_CHANCE: 0.1,
    SPEED: 10
  },
  corruptionModifier: 1.0, // Multiplicateur sur gain de corruption
  uniqueAbility: {
    name: "Nom de la Compétence",
    cost: 1, // Actions
    cooldown: 3, // Tours
    effect: "Description mécanique précise",
    corruptionCost: 5 // % de corruption par utilisation
  },
  passiveAbility: {
    name: "Passif",
    effect: "Description"
  },
  startingItems: ["Épée Rouillée", "Potion de Soin (x2)"]
}

Exemple : Le Paladin Déchu
javascript

{
  id: "PALADIN",
  name: "Paladin Déchu",
  description: "Ancien défenseur des dieux, maintenant lié au Dé",
  startingStats: {
    HP: 120,
    ATK: 12,
    DEF: 15,
    CRIT_CHANCE: 0.08,
    SPEED: 8
  },
  corruptionModifier: 0.8, // Gagne 20% de corruption en moins
  uniqueAbility: {
    name: "Jugement Brisé",
    cost: 2,
    cooldown: 4,
    effect: "Inflige ATK * 2.5 et soigne de 20% des dégâts infligés",
    corruptionCost: 8
  },
  passiveAbility: {
    name: "Armure Sacrée",
    effect: "Réduit les dégâts de 10% tant que corruption < 50%"
  },
  startingItems: ["Épée Bénie Fissurée", "Bouclier Lourd", "Potion de Soin (x3)"]
}

TODO : Créer 4 autres classes (Nécromancien, Rôdeur, Mage du Vide, Berserker)
7. CAGE TRIALS (NOUVEAU - STRUCTURE)
Template de Cage
javascript

{
  id: "CAGE_ID",
  name: "Nom de la Cage",
  description: "Situation narrative",
  leftCage: {
    npc: "Nom NPC",
    description: "Qui il est, pourquoi il est là",
    argument: "Ce qu'il dit pour te convaincre",
    outcome: {
      corruption: 10,
      reward: "Objet ou Buff",
      narrative: "Conséquence long-terme"
    }
  },
  rightCage: {
    // Même structure
  },
  specialChoice: { // Optionnel
    name: "Troisième Voie",
    requirement: "Objet spécifique OU corruption < 20%",
    outcome: {
      corruption: 0,
      reward: "Meilleure récompense",
      narrative: "Issue unique"
    }
  }
}

Exemple : La Cage du Chapitre 1 (Kael vs Zhara)
javascript

{
  id: "CAGE_HUMANITY",
  name: "Le Choix de l'Humanité",
  description: "Deux prisonniers. Un seul levier. Qui mérite de vivre ?",
  leftCage: {
    npc: "Kael",
    description: "Humain pur, cherche sa sœur Lisa",
    argument: "Je t'en supplie... J'ai une photo d'elle. Elle sourit...",
    outcome: {
      corruption: 5,
      reward: "+1 Humain Pur au Cortège (bonus moral)",
      narrative: "Zhara mourante accepte ton choix. Ses derniers mots : 'Prévisible.'"
    }
  },
  rightCage: {
    npc: "Zhara",
    description: "Mi-démone, puissante mais corrompue",
    argument: "L'humain mourra de toute façon. Moi, je peux t'aider à survivre.",
    outcome: {
      corruption: 10,
      reward: "+15% ATK permanent, Déblocage chemin des Flammes",
      narrative: "Kael hurle puis se tait. Zhara te rejoint, sarcastique : 'Choix intelligent.'"
    }
  },
  specialChoice: {
    name: "Chaîne Équilibrée",
    requirement: "Posséder l'objet 'Chaîne Équilibrée' (rare drop)",
    outcome: {
      corruption: 15,
      reward: "+2 PNJs au Cortège, Stress Mental (malus temporaire)",
      narrative: "Tu les sauves tous deux. Mais porter deux mondes... c'est lourd."
    }
  }
}

TODO : Créer 20 Cage Trials variées
8. SYSTÈME D'OBJETS (NOUVEAU)
Catégories
8.1 Objets Neutres

Caractéristiques : Pas de corruption, effets simples
javascript

{
  id: "POTION_HEAL",
  name: "Potion de Soin",
  type: "consumable",
  rarity: "common",
  effect: "Restore 30 HP",
  corruption: 0,
  stackable: true,
  maxStack: 5
}

8.2 Objets Corrompus

Caractéristiques : Puissants mais coûteux en corruption
javascript

{
  id: "BLOOD_BLADE",
  name: "Lame de Sang",
  type: "weapon",
  rarity: "rare",
  stats: { ATK: +25, CRIT: +15% },
  passiveEffect: "Chaque attaque : +2% corruption, soigne 10% des dégâts",
  corruption: 0, // Pas de corruption à l'équipement
  corruptionPerUse: 2 // Mais à chaque attaque
}

8.3 Objets Sacrificiels

Caractéristiques : Utilisés pour réduire corruption OU éviter la mort
javascript

{
  id: "PHYLACTERY",
  name: "Phylactère Brisé",
  type: "relic",
  rarity: "legendary",
  effect: "Évite la mort 1 fois (se détruit)",
  corruption: -10, // Réduit la corruption de 10% quand acquis
  oneTimeUse: true
}
```

**TODO** : Créer 50 objets (20 neutres, 20 corrompus, 10 sacrificiels)

---

## 9. UI/UX (ENRICHI)

### Principes de Design Visuel

**Palette de Couleurs**
```
Background: #0a0a0f (noir bleuté)
Texte Principal: #e0e0e0 (gris clair)
Accents: #d4af37 (or terne)
Danger: #8b0000 (rouge sang)
Corruption: #4a0e4e (violet sombre)
```

**Typographie**
- Titres : `Cinzel` (serif, médiévale)
- Corps : `Crimson Text` (lisible, atmosphère)
- UI : `Inter` (moderne, claire)

### HUD Essentiel
```
┌─────────────────────────────────────────────────┐
│ ❤️ HP: 85/100    💀 Corruption: 23%            │
│ ⚡ Momentum: 2/3  🎲 Dé: Disponible             │
└─────────────────────────────────────────────────┘

[Zone de jeu centrale]

┌─────────────────────────────────────────────────┐
│ 🎒 Inventaire: [Épée] [Potion x2] [Relique]    │
│ 👥 Cortège: 5 survivants (moral: Moyen)        │
└─────────────────────────────────────────────────┘
```

### Feedback Visuel (Critique)

| Action | Feedback | Durée |
|--------|----------|-------|
| Gain de corruption | Particules rouges montantes + vignette rouge | 1s |
| Lancer de dé | Slow-motion + zoom sur le dé | 2s |
| Coup critique | Screen shake + flash blanc | 0.3s |
| Mort | Fade to black + son de battement de cœur | 3s |
| Pacte signé | Écran qui brûle (effet parchemin) | 2s |

---

## 10. LORE (CONSOLIDÉ)

### Chronologie Officielle
```
Il y a 5000 ans : Création d'Aethermoor par les 7 Dieux
Il y a 3000 ans : Conflit Morwyn vs Krovax (Ordre vs Chaos)
Il y a 500 ans : Suicide des Dieux (événement déclencheur)
Il y a 500 ans : Naissance du Dé du Destin (Thalys)
Il y a 312 tentatives : Premiers Pactisés (tous morts)
Aujourd'hui : Le Dernier Pactisé (le joueur)
```

### Les 7 Dieux (Résumé)

| Dieu | Domaine | Symbole | Destin |
|------|---------|---------|--------|
| **Morwyn** | Ordre, Architecture | Équerre | Fusionnée avec Krovax (Tempête de Lames) |
| **Krovax** | Guerre, Sacrifice | Épée sanglante | Fusionné avec Morwyn |
| **Vyr** | Connaissance | Œil crevé | Murmure dans les murs |
| **Noxar** | Mort | Faux | Silence éternel |
| **Sylthara** | Nature | Racine | Pourriture vivante |
| **Thalys** | Hasard, Destin | Dé d'ivoire | Devenu le Dé du Destin |
| **Ael'mora** | Amour, Liens | Chaîne brisée | Oubliée |

### Le Pacte (Règle Absolue)
> "Tu ne mourras plus. Mais chaque retour te coûtera ce que tu es."

- Immortalité conditionnelle
- Corruption inévitable
- Observation constante par le Dé
- Fin narrative à 100% corruption

---

# RECOMMANDATIONS TECHNIQUES (JS)

## Architecture de Dossiers Proposée
```
/the-last-covenant
│
├── /src
│   ├── /core
│   │   ├── gameLoop.js           // Boucle principale
│   │   ├── stateManager.js       // Gestion de l'état global
│   │   ├── eventBus.js           // Système d'événements
│   │   └── saveSystem.js         // Sauvegarde/Chargement
│   │
│   ├── /systems
│   │   ├── corruptionSystem.js   // ✅ Verrouillé
│   │   ├── diceSystem.js         // Nouveau (à créer)
│   │   ├── combatSystem.js       // Nouveau (prioritaire)
│   │   ├── cageTrialSystem.js    // Nouveau
│   │   ├── bloodPactSystem.js    // ✅ Déjà implémenté
│   │   └── itemSystem.js         // Nouveau
│   │
│   ├── /entities
│   │   ├── Player.js
│   │   ├── Enemy.js
│   │   ├── NPC.js
│   │   └── Cortege.js
│   │
│   ├── /data
│   │   ├── classes.json
│   │   ├── enemies.json
│   │   ├── items.json
│   │   ├── cageTrials.json
│   │   └── dialogues.json
│   │
│   ├── /ui
│   │   ├── HUD.js
│   │   ├── InventoryUI.js
│   │   ├── DialogueBox.js
│   │   └── FeedbackManager.js
│   │
│   ├── /scenes
│   │   ├── MainMenu.js
│   │   ├── DungeonScene.js
│   │   ├── CampScene.js
│   │   └── GameOverScene.js
│   │
│   └── /utils
│       ├── random.js             // RNG centralisé
│       ├── animations.js
│       └── constants.js
│
├── /assets
│   ├── /audio
│   ├── /sprites
│   └── /fonts
│
├── /tests
│   └── (tests unitaires)
│
├── index.html
└── main.js                       // Point d'entrée

Bonnes Pratiques Critiques
1. Centralisation des Constantes
javascript

// constants.js
export const GAME_CONFIG = {
  CORRUPTION: {
    MIN: 0,
    MAX: 100,
    THRESHOLDS: [20, 40, 60, 80]
  },
  COMBAT: {
    BASE_DAMAGE_MULTIPLIER: 0.8,
    CRIT_DAMAGE_MULTIPLIER: 2.0
  }
};

2. Système d'Événements
javascript

// eventBus.js
class EventBus {
  constructor() {
    this.listeners = {};
  }
  
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }
  
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }
}

export const eventBus = new EventBus();

// Usage
eventBus.on('corruptionChanged', (data) => {
  console.log(`Corruption: ${data.newValue}%`);
  updateUI(data);
});

3. État Global Immutable (Pattern Flux/Redux light)
javascript

// stateManager.js
class StateManager {
  constructor() {
    this.state = {
      player: { /* ... */ },
      corruption: 0,
      currentScene: 'camp',
      inventory: []
    };
    this.listeners = [];
  }
  
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }
  
  subscribe(listener) {
    this.listeners.push(listener);
  }
  
  notify() {
    this.listeners.forEach(l => l(this.state));
  }
}

export const gameState = new StateManager();

PLAN D'ACTION IMMÉDIAT
Semaine 1 : Fondations Critiques

JOUR 1-2 : Combat System
├─ Créer combatSystem.js
├─ Définir 5 ennemis de base

Continuer
03:23

├─ Tester formules de dégâts
└─ Intégrer au gameLoop

JOUR 3-4 : Dice System
├─ Créer diceSystem.js
├─ Implémenter les 6 faces + face 7
├─ Lier au Blood Pact System
└─ Tester probabilités

JOUR 5-7 : Classes & Balance
├─ Compléter 5 classes (stats + capacités)
├─ Créer classes.json
├─ Tester chaque classe en combat
└─ Ajuster balance initiale


## Semaine 2 : Contenu & Systèmes

JOUR 8-10 : Cage Trials
├─ Créer cageTrialSystem.js
├─ Écrire 10 cages (narratives + mécaniques)
├─ Intégrer au gameLoop
└─ Tester outcomes

JOUR 11-12 : Items
├─ Créer itemSystem.js
├─ Définir 30 objets (10 par catégorie)
├─ Créer items.json
└─ Tester drop rates

JOUR 13-14 : UI Polish
├─ Créer wireframes HUD
├─ Implémenter FeedbackManager
├─ Tester feedback visuel/sonore
└─ Ajuster timing animations


## Semaine 3-4 : Polish & Testing

SEMAINE 3 : Contenu Narratif
├─ Écrire Chapitres 4-5
├─ Compléter dialogues NPCs
├─ Écrire tutoriel in-game
└─ Tester cohérence lore

SEMAINE 4 : QA & Balance
├─ Tests utilisateurs (5 personnes min)
├─ Ajuster difficulté selon feedback
├─ Corriger bugs critiques
└─ Optimisation performance


---

# MÉTRIQUES DE SUCCÈS (KPIs)

## Métriques de Gameplay

| Métrique | Objectif | Comment Mesurer |
|----------|----------|-----------------|
| **Durée moyenne d'un run** | 15-20 min | Timer intégré |
| **Taux de mort avant étage 5** | < 60% | Analytics |
| **Corruption moyenne à la mort** | 60-70% | Log à chaque mort |
| **Taux d'utilisation du Dé** | > 40% des combats | Compteur |
| **Taux de refus de Pacte** | 30-40% | Analytics |
| **Objets corrompus équipés** | > 50% de l'inventaire | Scan à chaque run |

## Métriques Narratives

| Métrique | Objectif | Comment Mesurer |
|----------|----------|-----------------|
| **Chapitres lus (complet)** | > 70% des joueurs | Analytics texte |
| **NPCs recrutés (moyenne)** | 3-5 par run | Compteur Cortège |
| **Cages "Troisième Voie"** | < 10% (doit rester rare) | Analytics choix |

---

# CONCLUSION : ÉTAT FINAL

## Ce qui est Prêt ✅
- Lore cohérent et verrouillé
- Blood Pact System (implémenté et testé)
- 3 chapitres narratifs de qualité
- Vision de design claire

## Ce qui est Urgent ⚠️
- **Combat System** (bloquant)
- **Dice System complet** (bloquant)
- **Classes avec stats** (bloquant)
- **Cage Trials structure** (bloquant)
- **Item System** (haute priorité)

## Ce qui peut Attendre 🕒
- Chapitres 4-5
- 20+ Cage Trials
- 50+ Items
- Sound Design complet
- Optimisation avancée

---

# FICHIERS À ARCHIVER

❌ RAPPORT D'ORGANISATION.md
└─ Raison : Obsolète, remplacé par ce document

✅ CONSERVER TOUS LES AUTRES FICHIERS
└─ GDD, Chapitres, Blood Pact System


---

**Note Finale** : Ce GDD enrichi doit devenir le **document de référence unique**. Toute nouvelle idée doit être ajoutée ici, pas dans un fichier séparé. La discipline documentaire est critique pour éviter l'entropie future.

