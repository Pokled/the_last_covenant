# 📚 GUIDE D'UTILISATION DE LA DOCUMENTATION

> **Comment utiliser efficacement cette documentation structurée**

---

## 🎯 Objectif de cette Structure

Cette documentation est conçue pour :
1. **Servir de référence unique** pour tout le projet
2. **Faciliter la communication** avec Claude.ai (VS Code)
3. **Maintenir la cohérence** de design
4. **Suivre l'avancement** du développement

---

## 📁 Structure des Fichiers

```
/docs
├── 00_INDEX.md                    ← COMMENCE ICI
├── 01_VISION_ET_PILIERS.md       ← Philosophie du jeu
├── 02_CORE_LOOP.md                ← Boucle de gameplay
├── 03_SYSTEME_CORRUPTION.md       ← Système verrouillé
├── 04_SYSTEME_DES.md              ← À implémenter
├── 05_SYSTEME_COMBAT.md           ← PRIORITAIRE
├── 06_CLASSES.md                  ← Personnages
├── 07_CAGE_TRIALS.md              ← Dilemmes moraux
├── 08_SYSTEME_OBJETS.md           ← Items
├── 09_BESTIARY.md                 ← Ennemis
├── 10_CORTEGE.md                  ← NPCs alliés
├── 11_UI_UX.md                    ← Interface
├── 12_LORE.md                     ← Histoire
├── 13_PROGRESSION.md              ← Méta-progression
├── 14_AUDIO.md                    ← Son
├── 15_METRIQUES.md                ← KPIs
└── 99_BACKLOG.md                  ← Tâches ← METS À JOUR SOUVENT
```

---

## 🚀 Comment Démarrer ?

### Pour un Nouveau Dev

1. **Lis dans cet ordre** :
   ```
   00_INDEX.md → 01_VISION_ET_PILIERS.md → 02_CORE_LOOP.md → 99_BACKLOG.md
   ```
   
2. **Identifie la tâche prioritaire** dans `99_BACKLOG.md`

3. **Lis le fichier système correspondant**
   - Si tu dois implémenter le Combat → `05_SYSTEME_COMBAT.md`
   - Si tu dois créer des Classes → `06_CLASSES.md`
   - etc.

4. **Code en te référant aux specs**

5. **Mets à jour le Backlog** quand tu complètes une tâche

---

### Pour Communiquer avec Claude.ai (VS Code)

#### Méthode 1 : Copier/Coller
```
1. Ouvre le fichier système concerné (ex: 05_SYSTEME_COMBAT.md)
2. Copie tout le contenu
3. Dans Claude.ai Code, écris :
   
   "Voici les specs du système de combat.
   Implémente combatSystem.js selon ces spécifications :
   
   [COLLE LE CONTENU ICI]"
```

#### Méthode 2 : Référence (si Claude a accès aux fichiers)
```
"Lis le fichier docs/05_SYSTEME_COMBAT.md et 
implémente le système de combat selon ces specs"
```

#### Méthode 3 : Contexte Partiel (si trop long)
```
"Je travaille sur The Last Covenant, un dungeon-crawler.
Voici les principes de design :
[COPIE juste la section "Philosophie" du fichier]

Implémente la fonction calculateDamage() selon ces principes"
```

---

## 📝 Comment Maintenir la Doc ?

### Règle d'Or : Un Changement = Une Mise à Jour

**Quand tu ajoutes une feature** :
1. Ajoute-la dans le fichier système correspondant
2. Mets à jour `99_BACKLOG.md` (passe en ✅)
3. Si ça change la vision globale, mets à jour `00_INDEX.md`

**Quand tu as une idée** :
1. Ajoute-la dans `99_BACKLOG.md` section "Idées Futures"
2. Ne modifie PAS les fichiers verrouillés (Corruption, Lore)

**Quand tu trouves un bug** :
1. Ajoute-le dans `99_BACKLOG.md` section "Bugs"
2. Priorise selon sévérité

---

## 🔒 Fichiers Verrouillés (NE PAS MODIFIER)

Ces fichiers sont **finalisés** et ne doivent être modifiés qu'après validation :

- ✅ `01_VISION_ET_PILIERS.md`
- ✅ `03_SYSTEME_CORRUPTION.md`
- ✅ `12_LORE.md`

**Pourquoi ?** Parce qu'ils définissent l'ADN du jeu. Les modifier cassera la cohérence.

---

## 🎨 Conventions d'Écriture

### Emojis Standards
```
🔴 Priorité critique
🟠 Priorité haute
🟡 Priorité moyenne
🟢 Priorité basse / Complet

✅ Fait
🔴 À faire
🟡 En cours
⚠️ Bloqué

⚔️ Combat
🎲 Dés
💀 Corruption
🪤 Cages
🎒 Items
👹 Ennemis
👤 Classes
```

### Structure des Sections

Chaque fichier système suit cette structure :
```markdown
# TITRE DU SYSTÈME

> Statut + Dernière MAJ

## Vue d'Ensemble
[Explication simple]

## Spécifications Techniques
[Détails implémentation]

## Exemples
[Code ou scénarios concrets]

## Métriques
[Comment mesurer le succès]

## Lien suivant
```

---

## 🔄 Workflow Quotidien Recommandé

### Matin
1. Ouvre `99_BACKLOG.md`
2. Check les tâches du sprint actuel
3. Lis le fichier système de ta tâche du jour

### Pendant le Dev
4. Garde le fichier système ouvert en référence
5. Respecte les specs à la lettre

### Soir
6. Mets à jour `99_BACKLOG.md` avec ta progression
7. Si bug trouvé, documente-le
8. Si idée nouvelle, note-la dans "Idées Futures"

---

## 🆘 FAQ

### "Je ne comprends pas une spec"
→ Relis `01_VISION_ET_PILIERS.md` pour comprendre le *pourquoi*
→ Demande clarification à Claude en citant la section précise

### "La spec est incomplète"
→ Note-le dans `99_BACKLOG.md` avec tag [SPEC INCOMPLETE]
→ Propose un complément en commentaire

### "J'ai trouvé une contradiction"
→ Note-le dans `99_BACKLOG.md` avec tag [CONTRADICTION]
→ Indique les 2 fichiers en conflit

### "Je veux ajouter une feature non documentée"
→ D'abord, vérifie qu'elle respecte les 4 Piliers (`01_VISION...`)
→ Ajoute-la dans `99_BACKLOG.md` section "Idées"
→ NE code PAS avant validation

---

## 📊 Checklist Avant de Coder

Avant d'implémenter QUOI QUE CE SOIT, vérifie :

- [ ] La feature est dans `99_BACKLOG.md` et priorisée
- [ ] Tu as lu le fichier système complet correspondant
- [ ] Tu comprends les 4 Piliers de design
- [ ] La feature ne contredit pas un système verrouillé
- [ ] Tu sais comment tester que c'est réussi (métriques)

**Si une case est décochée, NE CODE PAS ENCORE.**

---

## 🎯 Exemple d'Usage Concret

### Scénario : Tu dois implémenter le Combat

**Étape 1** : Lis dans cet ordre
```
01_VISION_ET_PILIERS.md (section "Lisibilité du Danger")
     ↓
02_CORE_LOOP.md (section "Salle de Combat")
     ↓
05_SYSTEME_COMBAT.md (TOUT)
     ↓
06_CLASSES.md (pour les capacités spéciales)
```

**Étape 2** : Prépare ton environnement
```
Crée /src/systems/combatSystem.js
Référence-toi aux formules exactes dans 05_SYSTEME_COMBAT.md
```

**Étape 3** : Code en respectant les specs
```javascript
// Exemple : calculateDamage() DOIT respecter la formule
// donnée dans 05_SYSTEME_COMBAT.md section "Formules"

function calculateDamage(attacker, defender, skillMultiplier = 1.0) {
  // Formule EXACTE de la doc :
  const baseDamage = attacker.ATK * skillMultiplier;
  const damageAfterDef = baseDamage - (defender.DEF * 0.5);
  const finalDamage = Math.max(1, damageAfterDef);
  return finalDamage;
}
```

**Étape 4** : Test selon métriques
```
Vérifie dans 05_SYSTEME_COMBAT.md section "Métriques" :
- Durée combat : 1-2 min → OK
- Taux victoire : 70-80% → À ajuster
```

**Étape 5** : Update Backlog
```markdown
Dans 99_BACKLOG.md :

| MB-01 | ⚔️ Combat System | ✅ Fait | 10h | Testé |
```

---

## 🛠️ Outils Recommandés

### Éditeur Markdown
- **VS Code** avec extension "Markdown All in One"
- **Obsidian** (excellent pour navigation entre fichiers)
- **Typora** (WYSIWYG, très lisible)

### Versioning
```bash
git add docs/
git commit -m "docs: update combat system specs"
```

**Convention de commit pour la doc** :
```
docs: [ce qui a changé]
docs(combat): add damage formulas
docs(backlog): mark combat as complete
```

---

## ✅ Checklist de Qualité de la Doc

Une bonne doc doit :
- [ ] Avoir un statut clair (🔴/🟡/🟢)
- [ ] Être datée (Dernière MAJ)
- [ ] Avoir des exemples concrets
- [ ] Avoir des formules EXACTES (pas de "environ")
- [ ] Avoir des métriques mesurables
- [ ] Linker vers d'autres fichiers pertinents
- [ ] Respecter les 4 Piliers du jeu

---

## 🔮 Évolution Future de la Doc

### Phase 1 (Actuelle) : Specs Textuelles
- Fichiers MD avec specs détaillées

### Phase 2 (Futur) : Diagrammes
- Ajouter des flowcharts (Mermaid)
- Ajouter des state machines visuelles

### Phase 3 (Plus tard) : Doc Interactive
- Intégrer exemples jouables
- Calculateurs de dégâts en ligne

---

## 📞 Support

**Questions sur la doc** :
- Vérifie `00_INDEX.md` d'abord
- Cherche dans le fichier système concerné
- Si toujours bloqué, note-le dans `99_BACKLOG.md`

**Suggérer une amélioration de la doc** :
- Ouvre une issue avec tag [DOC]
- Ou ajoute directement dans `99_BACKLOG.md` section "Idées"

---

**Prêt à développer ?**

1. Ouvre `00_INDEX.md`
2. Check `99_BACKLOG.md`
3. Lis le système que tu vas implémenter
4. Code !
5. Mets à jour le Backlog

**Bonne chance ! 🚀**
