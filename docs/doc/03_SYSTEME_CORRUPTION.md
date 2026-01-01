# 💀 SYSTÈME DE CORRUPTION

> **Statut** : ✅ VERROUILLÉ (Ne pas modifier sans validation Lead)
> **Priorité** : CRITIQUE
> **Dernière MAJ** : 2025-01-XX

## 1. Philosophie
La Corruption n'est pas une simple barre de vie secondaire. C'est une **ressource tentatrice**.
- Elle offre du pouvoir à court terme.
- Elle détruit le joueur à long terme.
- Elle modifie la narration et le gameplay dynamiquement.

---

## 2. Formule de Calcul

Le gain de corruption n'est pas linéaire. Plus on est corrompu, plus la chute s'accélère.

```javascript
/**
 * Calcule le gain final de corruption
 * @param {number} baseValue - Le coût de base de l'action
 * @param {number} currentCorruption - La corruption actuelle du joueur (0-100)
 * @param {number} classModifier - Le modificateur lié à la classe (ex: 0.8)
 */
function calculateCorruptionGain(baseValue, currentCorruption, classModifier) {
    // Effet boule de neige : +0.5% par point de corruption actuel
    const multiplier = 1 + (currentCorruption / 100) * 0.5;
    
    // Calcul final
    let gain = baseValue * multiplier * classModifier;
    
    // Arrondi à 1 décimale
    return Math.round(gain * 10) / 10;
}


Action,Coût Base,Type
Lancer le Dé (Faces 1-3),+5,Échec / Risque
Lancer le Dé (Faces 4-6),+3,Succès
Pacte de Sang (Mineur),+10,Pouvoir Immédiat
Pacte de Sang (Majeur),+20,Pouvoir Permanent
Objet Corrompu (Utilisation),+5,Consommable
Sacrifice (Cage Trial),+15,Survie
Résurrection Automatique,+10,Seconde Chance


3. Les Seuils de Corruption

La corruption débloque des "Stades" qui altèrent les stats et le visuel.
Stade 0 : L'Initié (0-19%)

    Gameplay : Aucun effet.

    Visuel : Apparence normale.

    Narration : Le Dé murmure de temps en temps.

Stade 1 : La Fissure (20-39%)

    Gameplay :

        ATK +5%

        Healing Reçu -5%

    Visuel : Veines noires sur les mains et le cou.

    Narration : Le Dé commente vos échecs avec sarcasme.

Stade 2 : La Profanation (40-59%)

    Gameplay :

        ATK +10%

        Aggro Ennemis +10%

        Déblocage de passages secrets "Corrompus".

    Visuel : Yeux rouges, aura sombre légère.

    Narration : Certains PNJs du Cortège refusent de vous parler.

Stade 3 : La Damnation (60-79%)

    Gameplay :

        ATK +20%

        Healing Reçu -20%

        Apparition de Boss alternatifs (plus durs, meilleur loot).

    Visuel : Peau pâle, fumée noire émanant du corps.

    Narration : Le Dé commence à parler à votre place dans les dialogues.

Stade 4 : La Rupture (80-99%)

    Gameplay :

        ATK +50%

        DEF -20%

        Soins impossibles (sauf via Pacte Majeur).

    Visuel : Transformation monstrueuse selon la classe.

    Narration : La fin du jeu changera radicalement.

Stade 5 : L'Oubli (100%)

    Effet : GAME OVER NARRATIF.

    Le personnage devient un NPC ennemi pour le prochain run (si système "Ghost" implémenté) ou meurt définitivement.

4. Mécaniques de Réduction

La corruption est difficile à perdre. C'est un choix coûteux.

    Le Jardinier des Regrets (NPC)

        Service : "Purification par la douleur"

        Coût : 50% des PV actuels.

        Effet : -20 Corruption.

    Salles de Repos (Sanctuaires)

        Action : Prier.

        Effet : -5 Corruption (une seule fois par run).

    Objets Sacrificiels (Rares)

        Exemple : Larmes de Morwyn.

        Effet : -10 Corruption, détruit l'objet.


=========================================================================
Prochaine étape : Intégrer la formule dans src/systems/corruptionSystem.js.
==========================================================================


        ---

### 2. Fichier : `docs/04_SYSTEME_DES.md`
*Ce fichier définit la mécanique RNG "contrôlée" du jeu.*

```markdown
# 🎲 SYSTÈME DE DÉS

> **Statut** : 🔴 CRITIQUE - À coder semaine 1
> **Dépendance** : 03_SYSTEME_CORRUPTION.md
> **Source** : `blood-pact-system.js`

## 1. Philosophie du Dé
Dans *The Last Covenant*, le hasard n'est jamais subi, il est **invoqué**.
- Le joueur décide QUAND lancer le dé.
- Chaque lancer a un coût en Corruption (voir 03_SYSTEME_CORRUPTION).
- Le dé est une "arme de la dernière chance" ou un "accélérateur de puissance".

---

## 2. Règles Techniques

### Conditions d'Invocation
1. **En Combat** : 1 fois par combat maximum. Coûte 1 Action.
2. **En Cage Trial** : Pour forcer une issue ou débloquer un dialogue.
3. **Sur la Carte** : Pour tenter d'éviter un piège ou ouvrir un coffre scellé.

### La Face Cachée (7)
Le dé est un D6 physique, mais possède une 7ème face conceptuelle.
- **Condition** : Uniquement accessible via un *Pacte de Sang* ou un objet légendaire (*Dé de Thalys*).
- **Effet** : Permet de CHOISIR manuellement le résultat (1-6) après le lancer.

---

## 3. Table des Effets (Combat)

| Face | Nom | Effet Mécanique | Corruption |
|:----:|-----|-----------------|------------|
| **1** | **Échec Critique** | Vous perdez 20% PV actuels. L'ennemi gagne 1 Action bonus. | +5 |
| **2** | **Raté** | Rien ne se passe. Action perdue. | +3 |
| **3** | **Équilibre** | Relance gratuite immédiate OU Gain +5% ATK ce tour. | +3 |
| **4** | **Succès** | +15% ATK pour ce tour. | +3 |
| **5** | **Succès Critique**| +30% ATK, l'attaque ignore l'armure (DEF). | +5 |
| **6** | **Perfection** | Si cible < 30% PV : **Exécution immédiate**. Sinon : +50% ATK. | +8 |

---

## 4. Architecture Code (JS)

Structure recommandée pour `diceSystem.js`.

```javascript
class DiceSystem {
    constructor() {
        this.sides = 6;
        this.isPactActive = false; // Pour la face 7
    }

    /**
     * Lance le dé et applique les conséquences
     * @param {Object} context - { type: 'combat'|'event', actor: Player }
     */
    roll(context) {
        // 1. Calcul du résultat
        let result = Math.floor(Math.random() * this.sides) + 1;
        
        // 2. Vérification Pacte (Face 7)
        if (this.isPactActive) {
            return this.triggerFaceSeven(context);
        }

        // 3. Application Corruption
        const corruptionCost = (result <= 3) ? 5 : (result === 6 ? 8 : 3);
        context.actor.addCorruption(corruptionCost);

        // 4. Retourne l'effet
        return this.getEffect(result);
    }

    getEffect(face) {
        const effects = {
            1: { type: 'DAMAGE_SELF', value: 0.20, label: "CRITICAL FAILURE" },
            2: { type: 'NONE', label: "MISS" },
            3: { type: 'REROLL_OR_BUFF', value: 0.05, label: "BALANCE" },
            4: { type: 'BUFF_ATK', value: 0.15, label: "SUCCESS" },
            5: { type: 'BUFF_ATK_PIERCE', value: 0.30, label: "CRITICAL SUCCESS" },
            6: { type: 'EXECUTE_OR_MEGA', value: 0.50, label: "PERFECTION" }
        };
        return effects[face];
    }
}


C'est reçu. J'ai analysé l'ensemble des fichiers que tu viens de fournir (doc_files_list.md, doc_05_combat.md, doc_99_backlog.md, doc_readme.md, doc_00_index.md et le rapport IMPORTANT.md).

Analyse rapide de la situation : Tu as fait un travail de restructuration remarquable. L'architecture est maintenant saine.

    ✅ L'Index est clair.

    ✅ Le Backlog est priorisé.

    ✅ Le fichier 05_SYSTEME_COMBAT.md est écrit et solide.

    🔴 Le problème bloquant : Il manque les fichiers de spécifications pour les systèmes CRITIQUES liés au Combat (Corruption, Dés, Classes). Sans eux, tu ne peux pas coder le cœur du jeu.

En tant que Lead Game Designer et Architecte, je vais générer maintenant le contenu des 3 fichiers manquants prioritaires définis dans ta liste, en respectant scrupuleusement les contraintes de l'audit IMPORTANT.md.

Copie-colle le contenu ci-dessous dans les fichiers correspondants.
1. Fichier : docs/03_SYSTEME_CORRUPTION.md

Ce système est la colonne vertébrale du jeu. Il doit être implémenté tel quel.
Markdown

# 💀 SYSTÈME DE CORRUPTION

> **Statut** : ✅ VERROUILLÉ (Ne pas modifier sans validation Lead)
> **Priorité** : CRITIQUE
> **Dernière MAJ** : 2025-01-XX

## 1. Philosophie
La Corruption n'est pas une simple barre de vie secondaire. C'est une **ressource tentatrice**.
- Elle offre du pouvoir à court terme.
- Elle détruit le joueur à long terme.
- Elle modifie la narration et le gameplay dynamiquement.

---

## 2. Formule de Calcul

Le gain de corruption n'est pas linéaire. Plus on est corrompu, plus la chute s'accélère.

```javascript
/**
 * Calcule le gain final de corruption
 * @param {number} baseValue - Le coût de base de l'action
 * @param {number} currentCorruption - La corruption actuelle du joueur (0-100)
 * @param {number} classModifier - Le modificateur lié à la classe (ex: 0.8)
 */
function calculateCorruptionGain(baseValue, currentCorruption, classModifier) {
    // Effet boule de neige : +0.5% par point de corruption actuel
    const multiplier = 1 + (currentCorruption / 100) * 0.5;
    
    // Calcul final
    let gain = baseValue * multiplier * classModifier;
    
    // Arrondi à 1 décimale
    return Math.round(gain * 10) / 10;
}

Valeurs de Base (Tableau de Référence)
Action	Coût Base	Type
Lancer le Dé (Faces 1-3)	+5	Échec / Risque
Lancer le Dé (Faces 4-6)	+3	Succès
Pacte de Sang (Mineur)	+10	Pouvoir Immédiat
Pacte de Sang (Majeur)	+20	Pouvoir Permanent
Objet Corrompu (Utilisation)	+5	Consommable
Sacrifice (Cage Trial)	+15	Survie
Résurrection Automatique	+10	Seconde Chance
3. Les Seuils de Corruption

La corruption débloque des "Stades" qui altèrent les stats et le visuel.
Stade 0 : L'Initié (0-19%)

    Gameplay : Aucun effet.

    Visuel : Apparence normale.

    Narration : Le Dé murmure de temps en temps.

Stade 1 : La Fissure (20-39%)

    Gameplay :

        ATK +5%

        Healing Reçu -5%

    Visuel : Veines noires sur les mains et le cou.

    Narration : Le Dé commente vos échecs avec sarcasme.

Stade 2 : La Profanation (40-59%)

    Gameplay :

        ATK +10%

        Aggro Ennemis +10%

        Déblocage de passages secrets "Corrompus".

    Visuel : Yeux rouges, aura sombre légère.

    Narration : Certains PNJs du Cortège refusent de vous parler.

Stade 3 : La Damnation (60-79%)

    Gameplay :

        ATK +20%

        Healing Reçu -20%

        Apparition de Boss alternatifs (plus durs, meilleur loot).

    Visuel : Peau pâle, fumée noire émanant du corps.

    Narration : Le Dé commence à parler à votre place dans les dialogues.

Stade 4 : La Rupture (80-99%)

    Gameplay :

        ATK +50%

        DEF -20%

        Soins impossibles (sauf via Pacte Majeur).

    Visuel : Transformation monstrueuse selon la classe.

    Narration : La fin du jeu changera radicalement.

Stade 5 : L'Oubli (100%)

    Effet : GAME OVER NARRATIF.

    Le personnage devient un NPC ennemi pour le prochain run (si système "Ghost" implémenté) ou meurt définitivement.

4. Mécaniques de Réduction

La corruption est difficile à perdre. C'est un choix coûteux.

    Le Jardinier des Regrets (NPC)

        Service : "Purification par la douleur"

        Coût : 50% des PV actuels.

        Effet : -20 Corruption.

    Salles de Repos (Sanctuaires)

        Action : Prier.

        Effet : -5 Corruption (une seule fois par run).

    Objets Sacrificiels (Rares)

        Exemple : Larmes de Morwyn.

        Effet : -10 Corruption, détruit l'objet.

Prochaine étape : Intégrer la formule dans src/systems/corruptionSystem.js.


---

### 2. Fichier : `docs/04_SYSTEME_DES.md`
*Ce fichier définit la mécanique RNG "contrôlée" du jeu.*

```markdown
# 🎲 SYSTÈME DE DÉS

> **Statut** : 🔴 CRITIQUE - À coder semaine 1
> **Dépendance** : 03_SYSTEME_CORRUPTION.md
> **Source** : `blood-pact-system.js`

## 1. Philosophie du Dé
Dans *The Last Covenant*, le hasard n'est jamais subi, il est **invoqué**.
- Le joueur décide QUAND lancer le dé.
- Chaque lancer a un coût en Corruption (voir 03_SYSTEME_CORRUPTION).
- Le dé est une "arme de la dernière chance" ou un "accélérateur de puissance".

---

## 2. Règles Techniques

### Conditions d'Invocation
1. **En Combat** : 1 fois par combat maximum. Coûte 1 Action.
2. **En Cage Trial** : Pour forcer une issue ou débloquer un dialogue.
3. **Sur la Carte** : Pour tenter d'éviter un piège ou ouvrir un coffre scellé.

### La Face Cachée (7)
Le dé est un D6 physique, mais possède une 7ème face conceptuelle.
- **Condition** : Uniquement accessible via un *Pacte de Sang* ou un objet légendaire (*Dé de Thalys*).
- **Effet** : Permet de CHOISIR manuellement le résultat (1-6) après le lancer.

---

## 3. Table des Effets (Combat)

| Face | Nom | Effet Mécanique | Corruption |
|:----:|-----|-----------------|------------|
| **1** | **Échec Critique** | Vous perdez 20% PV actuels. L'ennemi gagne 1 Action bonus. | +5 |
| **2** | **Raté** | Rien ne se passe. Action perdue. | +3 |
| **3** | **Équilibre** | Relance gratuite immédiate OU Gain +5% ATK ce tour. | +3 |
| **4** | **Succès** | +15% ATK pour ce tour. | +3 |
| **5** | **Succès Critique**| +30% ATK, l'attaque ignore l'armure (DEF). | +5 |
| **6** | **Perfection** | Si cible < 30% PV : **Exécution immédiate**. Sinon : +50% ATK. | +8 |

---

## 4. Architecture Code (JS)

Structure recommandée pour `diceSystem.js`.

```javascript
class DiceSystem {
    constructor() {
        this.sides = 6;
        this.isPactActive = false; // Pour la face 7
    }

    /**
     * Lance le dé et applique les conséquences
     * @param {Object} context - { type: 'combat'|'event', actor: Player }
     */
    roll(context) {
        // 1. Calcul du résultat
        let result = Math.floor(Math.random() * this.sides) + 1;
        
        // 2. Vérification Pacte (Face 7)
        if (this.isPactActive) {
            return this.triggerFaceSeven(context);
        }

        // 3. Application Corruption
        const corruptionCost = (result <= 3) ? 5 : (result === 6 ? 8 : 3);
        context.actor.addCorruption(corruptionCost);

        // 4. Retourne l'effet
        return this.getEffect(result);
    }

    getEffect(face) {
        const effects = {
            1: { type: 'DAMAGE_SELF', value: 0.20, label: "CRITICAL FAILURE" },
            2: { type: 'NONE', label: "MISS" },
            3: { type: 'REROLL_OR_BUFF', value: 0.05, label: "BALANCE" },
            4: { type: 'BUFF_ATK', value: 0.15, label: "SUCCESS" },
            5: { type: 'BUFF_ATK_PIERCE', value: 0.30, label: "CRITICAL SUCCESS" },
            6: { type: 'EXECUTE_OR_MEGA', value: 0.50, label: "PERFECTION" }
        };
        return effects[face];
    }
}



5. Intégration Visuelle (Feedback)

    Lancer : Animation 3D ou Sprites 2D du dé qui tourne (2 secondes).

    Son : Bruit d'os qui roulent sur du bois.

    Résultat :

        1-2 : Flash Rouge sombre, son discordant.

        3-4 : Flash Blanc neutre.

        5-6 : Flash Or corrompu, son cristallin mais grave.

Prochaine étape : Lier diceSystem.js au bouton "Lancer le Dé" du HUD de combat.

---

### 3. Fichier : `docs/06_CLASSES.md`
*Définit les données JSON pour le développement des 5 classes.*

```markdown
# 👤 CLASSES DE PERSONNAGES

> **Statut** : 🟡 PARTIEL (Data prête, visuels à faire)
> **Format** : JSON Ready
> **Usage** : Copier les objets dans `data/classes.json`

## 1. Vue d'Ensemble
Il y a **5 classes** au lancement. Chaque classe a une relation différente avec la Corruption.

| Classe | Archétype | Relation Corruption | Difficulté |
|--------|-----------|---------------------|------------|
| **Paladin Déchu** | Tank / Sustain | Résistant (0.8x) | Facile |
| **Berserker** | DPS / Risque | Accélérée (1.2x) | Moyenne |
| **Nécromancien** | Summon / Dot | Ressource (Transforme PV en Mana) | Difficile |
| **Rôdeur Maudit** | Vitesse / Crit | Standard (1.0x) | Moyenne |
| **Mage du Vide** | Burst / AoE | Volatile (Gain aléatoire) | Très Difficile |

---

## 2. Données Techniques (JSON Schema)

### Classe 1 : Paladin Déchu
*Le survivant classique. Il encaisse bien mais frappe lentement.*

```json
{
  "id": "PALADIN",
  "name": "Paladin Déchu",
  "description": "Un chevalier dont la foi a été brisée, mais dont le bouclier tient encore.",
  "baseStats": {
    "HP": 120,
    "ATK": 12,
    "DEF": 15,
    "SPD": 8,
    "CRIT": 0.05
  },
  "corruptionModifier": 0.8,
  "skills": {
    "passive": {
      "id": "HOLY_ARMOR",
      "name": "Armure Sacrée",
      "effect": "Réduit tous les dégâts subis de 10% tant que la Corruption < 50%."
    },
    "active": {
      "id": "BROKEN_JUDGMENT",
      "name": "Jugement Brisé",
      "cost": 2,
      "cooldown": 4,
      "damageMult": 2.5,
      "corruptionCost": 8,
      "effect": "Frappe lourde qui soigne le lanceur de 20% des dégâts infligés."
    }
  }
}

Classe 2 : Berserker Corrompu

Plus il est blessé et corrompu, plus il est fort.

{
  "id": "BERSERKER",
  "name": "Berserker Sanglant",
  "description": "Il a embrassé la rage. La douleur est son carburant.",
  "baseStats": {
    "HP": 140,
    "ATK": 18,
    "DEF": 5,
    "SPD": 10,
    "CRIT": 0.15
  },
  "corruptionModifier": 1.2,
  "skills": {
    "passive": {
      "id": "BLOOD_RAGE",
      "name": "Rage du Sang",
      "effect": "Gagne +1% ATK pour chaque 1% de HP manquant."
    },
    "active": {
      "id": "RECKLESS_SWING",
      "name": "Frappe Imprudente",
      "cost": 1,
      "cooldown": 0,
      "damageMult": 1.5,
      "selfDamage": 10,
      "corruptionCost": 2,
      "effect": "Attaque puissante mais inflige 10 dégâts au lanceur."
    }
  }
}

Classe 3 : Nécromancien des Abysses

Manipule la vie et la mort. Fragile mais technique.


{
  "id": "NECROMANCER",
  "name": "Nécromancien",
  "description": "Il murmure aux morts et sacrifie sa propre essence.",
  "baseStats": {
    "HP": 80,
    "ATK": 20,
    "DEF": 8,
    "SPD": 9,
    "CRIT": 0.10
  },
  "corruptionModifier": 1.0,
  "skills": {
    "passive": {
      "id": "SOUL_HARVEST",
      "name": "Moisson d'Âmes",
      "effect": "Chaque ennemi tué rend 5 HP et réduit la Corruption de 1."
    },
    "active": {
      "id": "CORPSE_EXPLOSION",
      "name": "Explosion Cadavérique",
      "cost": 2,
      "cooldown": 3,
      "damageMult": 3.0,
      "corruptionCost": 15,
      "effect": "Dégâts massifs ignorants 50% de la DEF adverse."
    }
  }
}

(Note : Les classes Rôdeur et Mage sont à définir dans une prochaine passe pour ne pas surcharger le démarrage)

=========================

//
//

3. Balance

Pour équilibrer les classes lors du développement :

    Calculer le "Dégât par Tour Effectif" (DPT) sur 5 tours.

    Ajuster le corruptionModifier si une classe devient trop puissante avec les buffs de corruption.

    La classe Paladin doit être la référence "Baseline" (Niveau de puissance 1.0).

Prochaine étape : Créer le fichier data/classes.json et y copier ces objets.


---

### Mes recommandations pour la suite immédiate :

Maintenant que nous avons généré ces trois piliers, voici ce que tu dois faire :

1.  **Crée les fichiers physiques** : Copie le contenu ci-dessus dans `docs/03_SYSTEME_CORRUPTION.md`, `docs/04_SYSTEME_DES.md` et `docs/06_CLASSES.md`.
2.  **Mise à jour de l'Index** : Dans `docs/00_INDEX.md`, passe le statut de ces fichiers de 🔴 à 🟡 (ou ✅ pour Corruption).
3.  **Prochaine étape logique** : Tu as maintenant toutes les specs pour coder la **Game Loop** et le **Combat**. Je suggère de s'attaquer au code JS du combat (`MB-01` dans ton backlog).

Veux-tu que je génère un fichier de démarrage pour le code `combatSystem.js` basé sur ces nouvelles specs, ou préfères-tu continuer la documentation avec le système de `Cage Trials` ?