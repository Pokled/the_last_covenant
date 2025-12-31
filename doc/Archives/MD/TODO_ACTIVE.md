# ✅ TODO ACTIVE - THE LAST COVENANT

> **📌 FICHIER DE TRAVAIL QUOTIDIEN** : Liste collaborative des tâches actives, mise à jour en temps réel durant chaque session.

---

## 📊 MÉTA-INFORMATIONS

**Dernière mise à jour:** 27 Décembre 2025 - Session #001
**Progression globale du projet:** 30%
**Phase actuelle:** Pré-Production / Fondations
**Prochaine milestone:** Village Nomade & Dé du Destin

**Lien vers documents:**
- 📊 [SESSION_PROGRESS.md](SESSION_PROGRESS.md) - Historique de session
- 📋 [MD/TODO-List.md](MD/TODO-List.md) - Plan stratégique global

---

## 🎯 TÂCHES EN ATTENTE DE VALIDATION UTILISATEUR

> **Processus de validation:** Claude propose, utilisateur confirme avant de cocher ✅

### Session #001 - À valider:

| Tâche | Status Proposé | Validation User |
|-------|----------------|-----------------|
| Système sélection personnage complet | ✅ TERMINÉ | ⏳ En attente |
| Ajout 4 ennemis au bestiaire JSON | ✅ TERMINÉ | ⏳ En attente |
| Fix bugs interface menu (clics, grid, modales) | ✅ TERMINÉ | ⏳ En attente |
| Fix bugs game.js (classe undefined, couleurs) | ✅ TERMINÉ | ⏳ En attente |
| Responsive design sélection perso (mobile) | ✅ TERMINÉ | ⏳ En attente |

**👤 ACTION UTILISATEUR REQUISE:** Valide ces tâches pour les marquer définitivement comme complètes.

---

## 🔄 TÂCHES EN COURS (IN PROGRESS)

### 🧹 Nettoyage & Qualité Code
- **Nettoyer logs de debug** (console.log temporaires)
  - `js/character-select.js` - logs populate grid
  - `js/main-menu.js` - logs navigation
  - `index.html` - script debug
  - **Priorité:** Moyenne
  - **Temps estimé:** 15 min

---

## 📋 TÂCHES À FAIRE (BACKLOG IMMÉDIAT)

### 🎮 Gameplay & Tests
- [ ] **Tester les 7 classes individuellement**
  - Vérifier que chaque classe lance le jeu sans erreur
  - Tester stats de départ (HP, ATK, DEF, Speed)
  - Vérifier icônes et couleurs des classes
  - **Priorité:** Haute
  - **Temps estimé:** 30 min

### 📦 Contenu Manquant
- [ ] **Compléter items-lore.json** (actuellement 12/73)
  - Ajouter descriptions lore pour 61 items restants
  - Lier aux dieux du panthéon (Morwyn, Krovax, etc.)
  - Intégrer mécaniques corruption/stress
  - **Priorité:** Moyenne
  - **Temps estimé:** 3-4 heures (peut être fait progressivement)

- [ ] **Finaliser CSS des modales de corridors**
  - Vérifier event-modal-corridor.css en jeu
  - Tester responsive mobile
  - Animations et transitions
  - **Priorité:** Basse
  - **Temps estimé:** 1 heure

### 🆕 Nouvelles Fonctionnalités
- [ ] **Implémenter sélection de race** (optionnel)
  - Actuellement seulement sélection de classe
  - Créer races-detailed.json
  - Modifier character-select.js pour double sélection
  - **Priorité:** Basse (feature non essentielle)
  - **Temps estimé:** 2-3 heures

---

## ✅ TÂCHES TERMINÉES (SESSION #001)

### 🎨 Interface & UX
- ✅ **Système de sélection de personnage** - COMPLET
  - ✅ Affichage des 7 classes en grille (3 colonnes)
  - ✅ Sélection de classe avec highlight doré
  - ✅ Champ saisie pseudo du joueur (obligatoire)
  - ✅ Validation : bouton actif ssi classe + nom
  - ✅ Sauvegarde dans sessionStorage format game.js
  - ✅ Responsive mobile (max-height 95vh, overflow)
  - **Fichiers modifiés:**
    - `index.html` - Imports CSS/JS
    - `js/main-menu.js` - Connexion CharacterSelectSystem
    - `js/character-select.js` - Champ pseudo + validation
    - `css/character-select.css` - Styles + responsive + grid fix

### 🐛 Corrections de Bugs
- ✅ **Fix clics menu non fonctionnels**
  - `css/main-menu.css` - Ajout `pointer-events: none` sur 5 éléments
  - `.title-screen`, `.title-background`, `.title-particles`
  - `.menu-background`, `.menu-particles`

- ✅ **Fix grid CSS (1 seule classe visible)**
  - Changement de `auto-fit` à `repeat(3, 1fr)` explicite

- ✅ **Fix modale réapparaissant dans game.html**
  - `game.html` - Retrait character-select.css et .js

- ✅ **Fix "Aucun joueur trouvé"**
  - `js/main-menu.js` - Correction stockage (localStorage → sessionStorage)
  - Clé correcte: 'player' au lieu de 'selectedCharacter'

- ✅ **Fix Game.js crash "cls undefined"**
  - `js/game.js` - Utilisation de classData sauvegardé
  - Mapping stats: baseStats.hp → hp, baseStats.attack → atk

- ✅ **Fix erreurs couleur Canvas**
  - `js/renderer.js` - Ajout fallback '#D4AF37' (4 occurrences)
  - Lines 488-491, 621, 710, 721

### 📚 Contenu
- ✅ **Bestiaire complet** - 9 ennemis + 3 boss
  - Ajout GOBLIN - Voleur post-divin
  - Ajout ORC_BERSERKER - Rage de Krovax
  - Ajout STONE_GOLEM - Construct de Morwyn
  - Ajout HEADLESS_KNIGHT - Combat au son
  - **Fichier:** `MD/bestiary-game.json`

---

## 🚀 PROCHAINE SESSION - OBJECTIFS SUGGÉRÉS

### Option A: Continuer sur la Base (Recommandé)
1. Nettoyer les logs de debug
2. Tester toutes les classes
3. Commencer à ajouter items dans items-lore.json

### Option B: Passer au Village Nomade
1. Créer le système Village Nomade (camp.js)
2. Implémenter économie de base (rubis/or)
3. Système Dé du Destin amélioré

### Option C: Événements & Corridors
1. Finaliser CSS modales corridors
2. Créer système d'événements aléatoires
3. Intégrer événements "Cages Suspendues" (lore)

---

## 📈 PROGRESSION PAR CATÉGORIE

| Catégorie | Complété | En Cours | À Faire | Total | % |
|-----------|----------|----------|---------|-------|---|
| **Interface/UX** | 8 | 0 | 2 | 10 | 80% |
| **Système de Jeu** | 3 | 0 | 4 | 7 | 43% |
| **Contenu (Lore)** | 1 | 0 | 2 | 3 | 33% |
| **Graphismes/CSS** | 6 | 0 | 1 | 7 | 86% |
| **Audio/SFX** | 0 | 0 | 3 | 3 | 0% |
| **Tests/Debug** | 0 | 1 | 1 | 2 | 0% |

**Progression moyenne:** 57%

---

## 🎯 OBJECTIFS LONG-TERME (Référence TODO-List.md)

### Court Terme (Mois 1-2: Identité & Lore)
- [ ] Écrire bible narrative 50 pages (avec Claude AI)
- [ ] Intégrer lore cages: Événements, choix corruption
- [ ] Réécrire 7 classes avec liens village/recrues
- [ ] Coder lore-system.js + corruption visuals

### Moyen Terme (Mois 3-4: Mécaniques Uniques)
- [ ] Implémenter Dice Manipulation + upgrades (fusions DBZ)
- [ ] Ajouter feedbacks dopamine (particules, shake, sons)
- [ ] Créer arbres compétences + combos
- [ ] Équilibrer combats/corridors

### Long Terme (Mois 5-12: Contenu, Polish, Marketing)
- [ ] Développer village nomade (camp.js)
- [ ] Implémenter économie fluctuante (rubis/or)
- [ ] Créer 50+ buffs/ennemis/events
- [ ] Juice system + SFX
- [ ] Marketing: Devlogs
- [ ] Launch + awards

---

## 💡 SYSTÈME DE VALIDATION COLLABORATIVE

### Comment ça marche:

1. **Claude propose une tâche comme terminée** ✅
   - Ajoute dans section "En attente de validation"
   - Documente ce qui a été fait

2. **Utilisateur valide ou conteste** 👤
   - ✅ "Oui c'est bon" → Tâche déplacée dans "Terminées"
   - ⏸️ "À améliorer" → Tâche reste "En cours" avec notes
   - ❌ "Non" → Retour en backlog avec explication

3. **Mise à jour du fichier** 🔄
   - Claude met à jour TODO_ACTIVE.md après chaque validation
   - SESSION_PROGRESS.md mis à jour à 90% quota ou fin session

### Commandes rapides:

- **"Valide tout"** → Toutes les tâches en attente passent en ✅
- **"Valide [nom tâche]"** → Valide une tâche spécifique
- **"Suspend [nom tâche]"** → Marque comme à améliorer
- **"Rejette [nom tâche]"** → Retour en backlog

---

## 📝 NOTES TECHNIQUES IMPORTANTES

### Format des Sauvegardes
```javascript
// sessionStorage['player'] format:
{
  name: "PseudoJoueur",
  class: "SHATTERED_KNIGHT",
  className: "Chevalier Brisé",
  classIcon: "🛡️",
  classData: { ...toutes les données... },
  level: 1,
  timestamp: 1234567890
}
```

### Mapping Stats JSON → Game
- `baseStats.hp` → `hp`
- `baseStats.attack` → `atk`
- `baseStats.defense` → `def`
- `baseStats.speed` → `speed`

### Serveur Local
```bash
python3 -m http.server 8000
# URL: http://localhost:8000
```

---

## 🔔 RAPPELS AUTOMATIQUES

### À 90% du quota de tokens:
1. ✅ Remplir SESSION_PROGRESS.md avec résumé complet
2. ✅ Mettre à jour TODO_ACTIVE.md (statuts, nouvelles tâches)
3. ✅ Documenter bugs/blocages rencontrés
4. ✅ Noter idées/décisions importantes

### Fin de session:
1. ✅ Valider toutes les tâches en attente avec utilisateur
2. ✅ Committer les changements (si demandé)
3. ✅ Proposer objectifs session suivante

---

**📊 Ce fichier doit être lu au début de chaque nouvelle session Claude pour reprendre rapidement le travail !**

_Dernière mise à jour: 27 Décembre 2025 - Session #001_
