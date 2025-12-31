# 📁 LISTE COMPLÈTE DES FICHIERS DE DOCUMENTATION

> **Guide de création** - Tous les fichiers à créer pour une doc complète

---

## ✅ FICHIERS DÉJÀ CRÉÉS (À copier dans ton projet)

Ces fichiers sont **prêts à l'emploi** et peuvent être copiés directement :

1. **00_INDEX.md** ✅
   - Point d'entrée principal
   - Navigation vers tous les autres fichiers
   - État des systèmes
   
2. **01_VISION_ET_PILIERS.md** ✅
   - Les 4 piliers de design
   - Philosophie du jeu
   - Verrouillé (ne pas modifier)

3. **02_CORE_LOOP.md** ✅
   - Boucle de gameplay macro et micro
   - Types de salles
   - Timing et rythme

4. **05_SYSTEME_COMBAT.md** ✅
   - Système de combat complet
   - Formules de calcul
   - Exemple de combat

5. **99_BACKLOG.md** ✅
   - Master Backlog avec toutes les tâches
   - Priorisation claire
   - Templates pour nouvelles tâches

6. **README_DOCUMENTATION.md** ✅
   - Guide d'utilisation de la doc
   - Workflow recommandé
   - FAQ

---

## 🔴 FICHIERS À CRÉER (Prioritaire)

Ces fichiers sont **critiques** et doivent être créés rapidement :

### 7. **03_SYSTEME_CORRUPTION.md** 🔴 URGENT

**Contenu à inclure** :
```markdown
# 💀 SYSTÈME DE CORRUPTION

> Statut : ✅ VERROUILLÉ

## Vue d'Ensemble
- Définition de la corruption
- Philosophie : "Ressource ET menace"

## Formule de Calcul
```javascript
corruption_gain = base_value * multiplier * class_modifier
```

## Seuils (0-19, 20-39, 40-59, 60-79, 80-100)
[Tableau complet avec effets]

## Sources de Corruption
[Tableau : Action | Corruption | Bénéfice]

## Réduction de Corruption
[Jardinier des Regrets, Repos, Objets]

## Effets Visuels selon Corruption
[Progressive transformation]

## Rupture du Pacte (100%)
[Fin narrative]
```

**Source** : Extraire du GDD maître (section 3)

---

### 8. **04_SYSTEME_DES.md** 🔴 URGENT

**Contenu à inclure** :
```markdown
# 🎲 SYSTÈME DE DÉS

> Statut : 🔴 CRITIQUE

## Philosophie
- RNG contrôlé, jamais gratuit
- Le joueur choisit QUAND lancer

## Règles Exactes
- Quand peut-on lancer ?
- Limitation : 1 fois par combat

## Effets des Faces (1-6)
[Tableau : Face | Effet | Corruption]

## Face Cachée (7)
- Apparition via Pactes uniquement
- Effet : Choisir n'importe quel résultat

## Intégration Combat
[Comment le Dé modifie un combat]

## Intégration Blood Pact
[Référence au système déjà implémenté]

## Code de Base
```javascript
class DiceSystem {
  roll() { /* ... */ }
  applyEffect(face, context) { /* ... */ }
}
```
```

**Source** : Extraire du GDD maître (section 3.2) + `blood-pact-system.js`

---

### 9. **06_CLASSES.md** 🔴 URGENT

**Contenu à inclure** :
```markdown
# 👤 CLASSES DE PERSONNAGES

> Statut : 🟡 PARTIEL (20%)

## Template de Classe
[Structure JSON complète]

## Classe 1 : Paladin Déchu
- Stats de base
- Capacité unique : Jugement Brisé
- Passif : Armure Sacrée
- Relation à la corruption : 0.8x

## Classe 2 : Nécromancien des Abysses
[À définir]

## Classe 3 : Rôdeur Maudit
[À définir]

## Classe 4 : Mage du Vide
[À définir]

## Classe 5 : Berserker Corrompu
[À définir]

## Balance entre Classes
[Métriques de comparaison]
```

**Source** : Extraire du GDD maître (section 5)

---

## 🟠 FICHIERS À CRÉER (Haute Priorité)

### 10. **07_CAGE_TRIALS.md**

**Structure** :
```markdown
# 🪤 SYSTÈME DE CAGE TRIALS

## Template de Cage
[Structure JSON]

## 10 Exemples de Cages
1. Cage de l'Humanité (Kael vs Zhara) ✅ [déjà écrite]
2. Cage du Savoir (Enfant vs Vieillard) ✅ [déjà écrite]
3-10. [À créer]

## Répartition par Acte
[Fréquence selon progression]

## Métriques
[Taux de choix A vs B vs C]
```

---

### 11. **08_SYSTEME_OBJETS.md**

**Structure** :
```markdown
# 🎒 SYSTÈME D'OBJETS

## 3 Catégories
1. Neutres (pas de corruption)
2. Corrompus (puissants, coût corruption)
3. Sacrificiels (réduisent corruption)

## 50 Objets
[20 neutres, 20 corrompus, 10 sacrificiels]

## Drop Rates
[Tableau : Type salle | Probabilité]

## Système d'Équipement
[Slots : Arme, Armure, 2x Accessoires]
```

---

### 12. **09_BESTIARY.md**

**Structure** :
```markdown
# 👹 BESTIAIRE

## Template d'Ennemi
[Stats, Patterns, Drops]

## 20 Ennemis
1. Garde Corrompu ✅ [déjà défini]
2-20. [À créer]

## Répartition par Acte
[Ennemis Acte 1, 2, 3]

## Variantes Corrompues
[Versions +corruption des ennemis de base]
```

---

### 13. **10_CORTEGE.md**

**Structure** :
```markdown
# 👥 SYSTÈME DE CORTÈGE

## Philosophie
[Parasites d'un cadavre divin]

## NPCs Principaux
1. Drenvar (Forgeron) ✅ [déjà écrit]
2. Le Jardinier des Regrets ✅ [déjà écrit]
3. L'Enlumineur d'Âmes ✅ [déjà écrit]
4-10. [À créer]

## Mécaniques
- Recrutement
- Moral
- Buffs/Services
- Perte (mort, corruption élevée)
```

---

## 🟡 FICHIERS À CRÉER (Moyenne Priorité)

### 14. **11_UI_UX.md**

**Contenu** :
```markdown
# 🎨 INTERFACE ET EXPÉRIENCE

## Principes de Design Visuel
- Palette de couleurs
- Typographie
- Spacing

## HUD
[Wireframe ASCII du HUD]

## Menus
[Camp, Inventaire, Carte]

## Feedback Visuel
[Particules, Screenshake, Flashes]

## Animations
[Timing, Easing, Transitions]
```

---

### 15. **12_LORE.md**

**Contenu** :
```markdown
# 📜 LORE ET NARRATION

> Statut : ✅ VERROUILLÉ

## Le Suicide des Sept
[Histoire complète]

## Les 7 Dieux
[Tableau : Nom | Domaine | Symbole | Destin]

## Le Dé du Destin (Thalys)
[Origine, Nature, Motivation]

## Le Pacte Originel
[Termes exacts du contrat]

## Aethermoor (Le Monde)
[Avant et Après]

## Chronologie
[Timeline complète]
```

**Source** : Extraire des Chapitres 1-3 + GDD maître (section 9)

---

### 16. **13_PROGRESSION.md**

**Contenu** :
```markdown
# 🏆 SYSTÈME DE PROGRESSION

## Progression par Run
- XP et niveaux
- Déblocages temporaires

## Méta-Progression
- Déblocages permanents
- Chapitres narratifs
- Classes débloquées

## Système de Rubis
[Monnaie, shop au camp]

## Fragments de Dieux
[Collectibles, effets]
```

---

### 17. **14_AUDIO.md**

**Contenu** :
```markdown
# 🔊 DESIGN SONORE

## SFX Essentiels (50)
[Liste : Combat, UI, Ambiance]

## Musique
- Camp (calme oppressant)
- Donjon (tension croissante)
- Boss (épique sombre)

## Sons Procéduraux
[Web Audio API pour génération]

## Mixage
[Volumes relatifs, ducking]
```

---

### 18. **15_METRIQUES.md**

**Contenu** :
```markdown
# 📊 MÉTRIQUES ET KPIs

## Métriques de Gameplay
[Tableau : Métrique | Cible | Comment mesurer]

## Métriques de Balance
[Taux de victoire, durée, etc.]

## Analytics Internes
[Events à tracker]

## Dashboard
[Visualisation des métriques]
```

---

## 📋 CHECKLIST DE CRÉATION

Pour créer un nouveau fichier de doc :

1. **Copie le template** depuis un fichier existant
2. **Respecte la structure** :
   ```markdown
   # TITRE
   > Statut + MAJ
   
   ## Section 1
   ## Section 2
   ## ...
   
   ---
   **Prochaine étape** : [Lien]
   ```
3. **Ajoute des exemples concrets** (pas que de la théorie)
4. **Inclus des formules exactes** (pas de "environ")
5. **Lie vers d'autres fichiers** pertinents
6. **Mets à jour `00_INDEX.md`** avec le nouveau fichier
7. **Commit** avec message `docs: add [nom système]`

---

## 🎯 ORDRE DE CRÉATION RECOMMANDÉ

**Cette semaine (Critique)** :
1. 03_SYSTEME_CORRUPTION.md
2. 04_SYSTEME_DES.md
3. 06_CLASSES.md

**Semaine prochaine (Haute priorité)** :
4. 07_CAGE_TRIALS.md
5. 08_SYSTEME_OBJETS.md
6. 09_BESTIARY.md
7. 10_CORTEGE.md

**Plus tard (Quand systèmes principaux OK)** :
8. 11_UI_UX.md
9. 12_LORE.md
10. 13_PROGRESSION.md
11. 14_AUDIO.md
12. 15_METRIQUES.md

---

## 🔄 MISE À JOUR CONTINUE

**Chaque nouveau fichier créé** :
1. Ajouter dans `00_INDEX.md` section Navigation
2. Mettre à jour le statut dans le tableau
3. Lier depuis/vers les fichiers pertinents

**Rappel** : La doc est un **document vivant**.
Elle doit évoluer avec le code !

---

## 📦 FICHIERS SOURCES À CONSERVER

Ces fichiers originaux restent dans le projet mais ne sont plus la référence :

- `gdd_the_last_covenant_version_maitre.md` → Archive
- `RAPPORT D'ORGANISATION.md` → Archive (remplacé par cette structure)
- `CHAPITRE 1-3.md` → Source pour `12_LORE.md`
- `blood-pact-system.js` → Source pour `04_SYSTEME_DES.md`

**Nouveau workflow** :
```
Anciens fichiers → Extraction → Nouveaux fichiers MD structurés
```

---

## ✅ VALIDATION FINALE

Avant de considérer la doc "complète", vérifie :

- [ ] Tous les 18 fichiers sont créés
- [ ] Chaque fichier a un statut clair
- [ ] `00_INDEX.md` liste tout
- [ ] `99_BACKLOG.md` est à jour
- [ ] Pas de contradictions entre fichiers
- [ ] Les 3 fichiers verrouillés sont identifiés
- [ ] Chaque système a des exemples de code
- [ ] Les métriques sont définies partout

---

**Ready to document ! 📚**
