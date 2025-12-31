# 📋 MASTER BACKLOG

> **Document vivant** - Mise à jour quotidienne recommandée
> **Dernière mise à jour** : 2025-01-XX

---

## 🚨 PRIORITÉ CRITIQUE (À faire MAINTENANT)

| ID | Tâche | Détail | Temps estimé | Dépendances |
|----|-------|--------|--------------|-------------|
| **MB-01** | ⚔️ Implémenter Combat System | Créer `combatSystem.js` complet avec toutes les actions | 8-12h | Aucune |
| **MB-02** | 🎲 Implémenter Dice System | Créer `diceSystem.js` avec 6 faces + face 7 | 4-6h | Blood Pact System |
| **MB-03** | 👤 Définir 5 Classes complètes | Stats, capacités, passifs pour chaque classe | 6-8h | Combat System |
| **MB-04** | 🔄 Core Loop fonctionnel | Lier Camp → Salle → Combat → Retour | 6-8h | Combat + Dice |
| **MB-05** | 📊 Interface HUD de base | HP, Corruption, Actions disponibles | 4-6h | Combat System |

**Total estimé** : 28-40 heures (1 semaine intensive)

---

## 🔴 PRIORITÉ HAUTE (Semaine 1-2)

### Systèmes

| ID | Tâche | Statut | Assigné | Notes |
|----|-------|--------|---------|-------|
| MB-06 | 🪤 Cage Trial System | 🔴 À faire | - | Créer structure + 5 cages exemple |
| MB-07 | 🎒 Item System | 🔴 À faire | - | Créer 20 items (10 neutres, 10 corrompus) |
| MB-08 | 💾 Save System | 🔴 À faire | - | localStorage pour corruption, inventory, progression |
| MB-09 | 🎯 Feedback Manager | 🔴 À faire | - | Particules, screenshake, sons pour actions |
| MB-10 | 👥 Cortège System | 🔴 À faire | - | Recrutement, moral, buffs |

### Contenu

| ID | Tâche | Statut | Assigné | Notes |
|----|-------|--------|---------|-------|
| MB-11 | 👹 Créer 10 ennemis de base | 🔴 À faire | - | Stats, patterns, drops |
| MB-12 | 🗺️ Créer 5 types de salles | 🔴 À faire | - | Combat, Cage, Repos, Événement, Pacte |
| MB-13 | 📜 Écrire dialogues Dé | 🟡 Partiel | - | 40+ phrases pour Blood Pact (✅), besoin combat |
| MB-14 | 🎨 Créer sprites ennemis | 🔴 À faire | - | Placeholder acceptable pour proto |

---

## 🟠 PRIORITÉ MOYENNE (Semaine 3-4)

### Polish & Features

| ID | Tâche | Statut | Notes |
|----|-------|--------|-------|
| MB-15 | 🔊 Sound Design (SFX) | 🔴 À faire | 30+ sons essentiels |
| MB-16 | 🎵 Musique d'ambiance | 🔴 À faire | 3 tracks (Camp, Donjon, Boss) |
| MB-17 | ✨ Animations avancées | 🔴 À faire | Tweens, particules, transitions |
| MB-18 | 📖 Tutoriel intégré | 🔴 À faire | Première descente guidée |
| MB-19 | 🏆 Système d'achievements | 🔴 À faire | 20 achievements de base |
| MB-20 | 📊 Analytics internes | 🔴 À faire | Track métriques de balance |

### Contenu Additionnel

| ID | Tâche | Statut | Notes |
|----|-------|--------|-------|
| MB-21 | 🪤 15 Cage Trials supplémentaires | 🔴 À faire | Total : 20 cages |
| MB-22 | 🎒 30 Items supplémentaires | 🔴 À faire | Total : 50 items |
| MB-23 | 👹 10 Ennemis avancés | 🔴 À faire | Variantes corrompues, élites |
| MB-24 | 📜 Chapitres 4-5 narratifs | 🔴 À faire | Suite des 3 existants |
| MB-25 | 🌍 3 Actes / Zones | 🔴 À faire | Ruines, Abysses, Cœur |

---

## 🟡 PRIORITÉ BASSE (Phase de Polish)

| ID | Tâche | Notes |
|----|-------|-------|
| MB-26 | 🎨 Art final | Remplacer placeholders |
| MB-27 | 🌐 Localisation | EN/FR minimum |
| MB-28 | ⚡ Optimisation | 60 FPS constant |
| MB-29 | 🐛 Bug hunting | QA intensive |
| MB-30 | 📱 Version mobile | Touch controls |

---

## ✅ COMPLÉTÉ

| ID | Tâche | Date | Notes |
|----|-------|------|-------|
| ✓ C-01 | Blood Pact System | 2025-01-XX | Implémenté avec modal + sons |
| ✓ C-02 | GDD Core Structure | 2025-01-XX | Vision, Piliers, Corruption |
| ✓ C-03 | Chapitres 1-3 narratifs | 2025-01-XX | Lore établi |
| ✓ C-04 | Documentation structurée | 2025-01-XX | 16 fichiers MD |

---

## 🐛 BUGS CONNUS

| ID | Sévérité | Description | Statut |
|----|----------|-------------|--------|
| BUG-01 | 🔴 Critique | Pas de bug critique pour le moment | - |

---

## 💡 IDÉES FUTURES (Non prioritaire)

| Idée | Complexité | Notes |
|------|------------|-------|
| Mode New Game+ | Moyenne | Run avec corruption initiale >0 |
| Multiplicateur de difficulté | Faible | Ajuster stats ennemis |
| Éditor de Cages | Élevée | Outil pour créer cages custom |
| Mode Roguelike pur | Moyenne | Pas de cortège, hardcore |
| Co-op asymétrique | Très élevée | 1 joue, 1 est le Dé |

---

## 📊 MÉTRIQUES DE PROGRESSION

```
SPRINT ACTUEL (Semaine 1)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Combat System     [▓▓░░░░░░░░] 20%
Dice System       [░░░░░░░░░░]  0%
Classes           [▓░░░░░░░░░] 10%
Core Loop         [░░░░░░░░░░]  0%
HUD               [▓░░░░░░░░░] 10%
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL PROJET      [▓▓▓░░░░░░░] 30%
```

---

## 🎯 OBJECTIFS PAR SPRINT

### Sprint 1 (Semaine 1) : Fondations
**Objectif** : Avoir un combat jouable de bout en bout
- [ ] Combat System opérationnel
- [ ] Dice System intégré
- [ ] Au moins 3 classes fonctionnelles
- [ ] 5 ennemis de test
- [ ] HUD minimal

**Critère de succès** : Pouvoir faire un combat complet et gagner/perdre

---

### Sprint 2 (Semaine 2) : Contenu
**Objectif** : Enrichir le gameplay
- [ ] 10 Cage Trials fonctionnelles
- [ ] 30 Items utilisables
- [ ] Cortège avec 5 NPCs
- [ ] Save/Load opérationnel

**Critère de succès** : Run complet de 10 salles possible

---

### Sprint 3 (Semaine 3) : Polish
**Objectif** : Rendre le jeu "juicy"
- [ ] Sound Design complet
- [ ] Animations fluides
- [ ] Feedback visuel avancé
- [ ] Tutoriel intégré

**Critère de succès** : Le jeu est satisfaisant à jouer

---

### Sprint 4 (Semaine 4) : Balance & QA
**Objectif** : Rendre le jeu équilibré et stable
- [ ] Tests utilisateurs (5 personnes min)
- [ ] Ajustements de difficulté
- [ ] Correction bugs majeurs
- [ ] Optimisation performance

**Critère de succès** : Taux de victoire entre 60-70%

---

## 📝 TEMPLATE POUR NOUVELLES TÂCHES

```markdown
### [ID] Nom de la Tâche

**Priorité** : 🔴 Critique / 🟠 Haute / 🟡 Moyenne / 🟢 Basse
**Statut** : 🔴 À faire / 🟡 En cours / 🟢 Fait / ⚠️ Bloqué
**Temps estimé** : X heures
**Dépendances** : [Autre tâche]
**Assigné à** : [Nom]

**Description** :
[Détail de ce qui doit être fait]

**Critères d'acceptance** :
- [ ] Critère 1
- [ ] Critère 2

**Notes techniques** :
[Fichiers à créer/modifier, considérations spéciales]
```

---

## 🔄 PROCESS DE MISE À JOUR

1. **Chaque jour** : Mettre à jour les statuts des tâches en cours
2. **Chaque fin de sprint** : Archiver les tâches complétées
3. **Quand nouvelle idée** : Ajouter dans section appropriée avec priorité
4. **Si bug critique** : Ajouter immédiatement en priorité critique

---

## 📞 CONTACT & SUPPORT

**Questions Design** : Consulter [01_VISION_ET_PILIERS.md](01_VISION_ET_PILIERS.md)
**Questions Techniques** : Voir fichiers systèmes correspondants
**Proposer une idée** : Ajouter dans section "Idées Futures"

---

**Dernière révision** : 2025-01-XX
**Prochain Sprint Review** : [Date à définir]
