# 📋 TODO - THE LAST COVENANT
## Mise à jour : 30 Décembre 2024

---

## 🎯 ÉTAT ACTUEL DU PROJET

**Progression globale** : **35% MVP**

### ✅ FAIT (Phase 1 - Core Systems)
- [x] Combat tour par tour fonctionnel
- [x] Arène isométrique avec texture AAA
- [x] Thalys - Dé 3D complet avec personnalité
- [x] Système de corruption (0-100%)
- [x] Rewards & buffs temporaires
- [x] Bonus permanents (6 paliers)
- [x] Combat log
- [x] HP/AP bars visuelles
- [x] Guide de génération d'assets AAA (40KB)

---

## 🔥 PRIORITÉ 1 - GAMEPLAY CORE (Urgent)

### 🎲 Intégration Thalys dans Combat
**Durée estimée** : 2-3 jours  
**Impact** : 🔥🔥🔥 CRITIQUE

- [ ] Ajouter bouton "Lancer Thalys" dans l'arène de combat
- [ ] Appliquer les buffs en temps réel au joueur
- [ ] Afficher les buffs actifs dans le HUD combat
- [ ] Visualiser les effets (x2 dmg = nombres rouges plus gros)
- [ ] Animer l'apparition du dé au centre de l'arène
- [ ] Corruption UI visible pendant le combat
- [ ] Tester balance (ajuster coûts de corruption si besoin)

**Fichiers à modifier** :
- `test-combat-arena.html`
- Intégrer `ThalysDice3D.js` + `ThalysPactSystem.js`

---

### ⚔️ Compétences & Sorts
**Durée estimée** : 3-4 jours  
**Impact** : 🔥🔥🔥 CRITIQUE

#### Sorts de base à implémenter :
- [ ] **Fireball** 🔥
  - Coût: 4 PA
  - Dégâts: 20-30 (AoE 1 tile)
  - Animation: Boule de feu + explosion
  - Effet: Burn 5 dmg/tour (2 tours)

- [ ] **Heal** 💚
  - Coût: 3 PA
  - Effet: Restaure 30 HP
  - Animation: Particules vertes montantes
  - Cooldown: 2 tours

- [ ] **Shield** 🛡️
  - Coût: 2 PA
  - Effet: +10 DEF pendant 2 tours
  - Animation: Bulle bleue
  - Absorbe jusqu'à 20 dmg

- [ ] **Poison Dart** 🧪
  - Coût: 3 PA
  - Dégâts: 10 immédiat
  - Effet: Poison 8 dmg/tour (3 tours)
  - Animation: Projectile vert

- [ ] **Stun Strike** ⚡
  - Coût: 5 PA
  - Dégâts: 15
  - Effet: Ennemi perd son prochain tour
  - Animation: Éclair jaune

#### UI Compétences :
- [ ] Barre de compétences en bas de l'écran
- [ ] Icônes cliquables
- [ ] Afficher coût PA sur chaque icône
- [ ] Griser si PA insuffisants
- [ ] Cooldown timer visible

**Fichiers à créer** :
- `src/systems/SkillSystem.js`
- `assets/images/ui/icons/skill_*.png` (à générer avec guide)

---

### 🧱 Props & Obstacles
**Durée estimée** : 2 jours  
**Impact** : 🔥🔥 IMPORTANT

- [ ] Générer 10-15 props avec guide (murs, tonneaux, caisses, piliers)
- [ ] Système de placement manuel dans l'arène
- [ ] Collision detection (bloquer mouvement)
- [ ] Props destructibles (tonneaux = 10 HP)
- [ ] Loot des props destructibles (potions, or)
- [ ] Ligne de vue (Line of Sight) pour sorts

**Assets à générer** :
- `prop_wall_stone.png`
- `prop_barrel_wood.png`
- `prop_crate_reinforced.png`
- `prop_pillar_broken.png`
- `prop_debris.png`

---

## 🎨 PRIORITÉ 2 - CONTENU (Important)

### 🏛️ Arènes Multiples
**Durée estimée** : 2-3 jours  
**Impact** : 🔥🔥 IMPORTANT

- [ ] Générer 5 arènes avec prompts du guide :
  1. ✅ Temple maudit (fait)
  2. [ ] Crypte ancienne
  3. [ ] Forge infernale
  4. [ ] Bibliothèque interdite
  5. [ ] Caverne profonde

- [ ] Système de sélection aléatoire
- [ ] Transition entre arènes (fondu)
- [ ] Stats des arènes (difficulté, nombre ennemis)

---

### 👹 Types d'Ennemis
**Durée estimée** : 3-4 jours  
**Impact** : 🔥🔥 IMPORTANT

#### Ennemis à créer :
- [ ] **Gobelin Corrompu** (facile)
  - HP: 40, ATK: 8
  - Comportement: Agressif
  - Loot: 10-20 gold

- [ ] **Squelette Maudit** (facile)
  - HP: 50, ATK: 10, DEF: 5
  - Comportement: Défensif
  - Résistance: -50% poison

- [ ] **Cultiste Obscur** (moyen)
  - HP: 60, ATK: 12
  - Compétence: Heal 15 HP (CD 3 tours)
  - Loot: Parchemin

- [ ] **Démon Mineur** (difficile)
  - HP: 80, ATK: 15
  - Immunité: Burn
  - Compétence: Fireball 20 dmg

- [ ] **Ombre Vivante** (difficile)
  - HP: 70, ATK: 18
  - Esquive: 30%
  - Compétence: Drain 10 HP

#### IA Ennemis :
- [ ] Comportement agressif (focus joueur)
- [ ] Comportement défensif (garde position)
- [ ] Comportement support (heal alliés)
- [ ] Priorité cible (low HP first)

**Assets à générer** :
- `enemy_goblin_warrior.png`
- `enemy_skeleton_undead.png`
- `enemy_cultist_dark.png`
- `enemy_demon_lesser.png`
- `enemy_shadow_living.png`

---

### 👑 Boss Fight
**Durée estimée** : 3-4 jours  
**Impact** : 🔥🔥 IMPORTANT

- [ ] **Boss : Gardien Corrompu**
  - HP: 200
  - 3 phases (100%, 50%, 25%)
  - Compétences multiples
  - Patterns d'attaque
  - Loot légendaire

- [ ] Arène spéciale boss
- [ ] Cinématique intro
- [ ] Musique unique
- [ ] Achievements déblocage

---

## ⚡ PRIORITÉ 3 - POLISH (Moyen terme)

### 🔊 Sons & Musique
**Durée estimée** : 2-3 jours  
**Impact** : 🔥 MOYEN

- [ ] SFX Combat :
  - [ ] Impact épée (3 variations)
  - [ ] Fireball lancement + explosion
  - [ ] Heal (son cristallin)
  - [ ] Shield activation
  - [ ] Mort ennemi

- [ ] SFX Thalys :
  - [ ] Roll du dé
  - [ ] Impact au sol
  - [ ] Whispers (voix synthétique écho)
  - [ ] Face Thalys révélée (drama)

- [ ] Musique d'ambiance :
  - [ ] Combat (dark fantasy orchestral)
  - [ ] Boss fight (intense)
  - [ ] Victoire (épique courte)
  - [ ] Défaite (tragique)

**Ressources** :
- Freesound.org
- Epidemic Sound
- LMMS (création custom)

---

### 💥 Animations Avancées
**Durée estimée** : 2-3 jours  
**Impact** : 🔥 MOYEN

- [ ] Dash joueur vers ennemi (attaque)
- [ ] Screen shake sur coup critique
- [ ] Slow motion à 1 HP
- [ ] Particules de sang (splatter)
- [ ] Particules de feu (trails)
- [ ] Hit freeze (0.1s pause sur hit)
- [ ] Mort ennemis (fade out + particles)
- [ ] Levelup effect (si système XP)

---

### 📖 Tutoriel Intégré
**Durée estimée** : 1-2 jours  
**Impact** : 🔥 MOYEN

- [ ] Premier combat guidé (1 gobelin)
- [ ] Tooltips contextuels
- [ ] Explication PA/HP
- [ ] Introduction Thalys (dialogue)
- [ ] Warning corruption
- [ ] Tips combat (cover, AoE...)
- [ ] Skippable après première run

---

## 🎮 PRIORITÉ 4 - MÉTA-JEU (Long terme)

### 💾 Système de Sauvegarde
**Durée estimée** : 2 jours  
**Impact** : 🔥 MOYEN

- [ ] LocalStorage browser
- [ ] Sauvegarder :
  - Stats joueur (HP, niveau, corruption)
  - Équipement
  - Progression (arènes complétées)
  - Achievements
  - Bonus permanents Thalys

- [ ] Bouton "Charger partie"
- [ ] Slots de sauvegarde (3 slots)
- [ ] Auto-save entre combats

---

### 🎒 Équipement & Items
**Durée estimée** : 4-5 jours  
**Impact** : 🔥 IMPORTANT

#### Items à créer :
**Armes** (5-7) :
- [ ] Épée rouillée (commune)
- [ ] Hache de fer (non-commune)
- [ ] Dague empoisonnée (rare)
- [ ] Arc long (rare)
- [ ] Bâton maudit (légendaire)

**Armures** (5-7 sets) :
- [ ] Cuir (3 pièces : casque, plastron, gants)
- [ ] Maille (3 pièces)
- [ ] Plate (3 pièces)

**Consommables** :
- [ ] Potion de soin (S/M/L)
- [ ] Potion de mana
- [ ] Antidote
- [ ] Scroll d'attaque
- [ ] Scroll de défense

#### Systèmes :
- [ ] Inventory UI (grid 20 slots)
- [ ] Équipement slots (arme, 3x armure)
- [ ] Drag & drop
- [ ] Stats display (compare)
- [ ] Rareté colors (gris/vert/bleu/violet/orange)
- [ ] Loot après combat
- [ ] Vendor (vendre/acheter)

**Assets à générer** : 25+ items

---

### 🌳 Arbre de Talents
**Durée estimée** : 3-4 jours  
**Impact** : 🔥 IMPORTANT

- [ ] UI arbre (3 branches)
  - Branche Combat (ATK, CRIT)
  - Branche Défense (HP, DEF)
  - Branche Magie (sorts, mana)

- [ ] 20-30 talents au total
- [ ] Points de talent (1 par niveau)
- [ ] Synergies entre talents
- [ ] Reset talents (coût gold)

---

### 🏕️ Camp entre Combats
**Durée estimée** : 2-3 jours  
**Impact** : 🔥 MOYEN

- [ ] Écran camp (repos)
- [ ] Vendor (acheter items)
- [ ] Forge (améliorer équipement)
- [ ] Autel Thalys (pactes spéciaux)
- [ ] Coffre (stockage items)
- [ ] Soigner (gratuit, 1 fois)

---

## 🏆 PRIORITÉ 5 - FEATURES AVANCÉES (Optionnel)

### 🎲 Modes de Jeu
**Durée estimée** : variable

- [ ] **Mode Histoire** (campagne 10-15 combats)
- [ ] **Mode Arène** (survival, vagues infinies)
- [ ] **Mode Boss Rush** (tous les boss d'affilée)
- [ ] **Mode Ironman** (1 vie, permadeath)
- [ ] **Daily Challenge** (seed quotidien)

---

### 📊 Progression & Stats
**Durée estimée** : 2-3 jours

- [ ] Système XP & niveaux (1-20)
- [ ] Stats écran (total kills, temps joué, etc.)
- [ ] Leaderboards (locaux)
- [ ] Achievements (20-30 au total)
- [ ] Collections (bestiaire, items trouvés)

---

### 🎨 Customisation
**Durée estimée** : 1-2 jours

- [ ] Skins pour le joueur (3-5 skins)
- [ ] Skins pour Thalys (3 variants)
- [ ] Thèmes UI (dark, light, red)
- [ ] Paramètres (volume, résolution, langue)

---

## 🐛 BUGS CONNUS & FIXES

### 🔴 Critiques
- [ ] (Aucun bug critique connu actuellement)

### 🟡 Mineurs
- [ ] Tester compatibilité Safari (CSS 3D)
- [ ] Optimiser particules si lag mobile
- [ ] Ajuster hitboxes ennemis
- [ ] Z-index overlay Thalys

---

## 📅 ROADMAP ESTIMÉE

### Sprint 1 (2-3 semaines) - **MVP JOUABLE**
- ✅ Core systems (FAIT)
- [ ] Intégration Thalys combat
- [ ] 5 compétences
- [ ] Props & obstacles
- [ ] 3 types d'ennemis

**Objectif** : Jeu complet mais basique

---

### Sprint 2 (1-2 semaines) - **CONTENU**
- [ ] 5 arènes
- [ ] 5 types ennemis
- [ ] 1 boss fight
- [ ] 15+ items

**Objectif** : Variété et rejouabilité

---

### Sprint 3 (1 semaine) - **POLISH**
- [ ] Sons & musique
- [ ] Animations avancées
- [ ] Tutoriel
- [ ] Balance testing

**Objectif** : Qualité AAA finale

---

### Sprint 4 (1-2 semaines) - **MÉTA**
- [ ] Sauvegarde
- [ ] Équipement complet
- [ ] Arbre talents
- [ ] Camp

**Objectif** : Profondeur et progression long terme

---

## 🎯 OBJECTIFS PAR ÉTAPE

### ✅ ÉTAPE 1 : Proof of Concept (FAIT)
- Systèmes core fonctionnels
- Thalys implémenté
- Une arène jouable

### 🔄 ÉTAPE 2 : MVP (EN COURS)
**Objectif** : Boucle de gameplay complète
**ETA** : 2-3 semaines

### 📦 ÉTAPE 3 : Alpha
**Objectif** : Contenu suffisant (5h de jeu)
**ETA** : 1 mois après MVP

### 🎨 ÉTAPE 4 : Beta
**Objectif** : Polish AAA + balance
**ETA** : 1.5 mois après Alpha

### 🚀 ÉTAPE 5 : Release 1.0
**Objectif** : Jeu complet et testé
**ETA** : 2 mois après Beta

**TOTAL MVP → Release : 4-5 mois**

---

## 💡 IDEAS & WISHLIST (Brainstorm)

### Mécaniques Possibles
- [ ] Multiclassing (2 classes mix)
- [ ] Pets / Familiers
- [ ] Éléments (fire, ice, lightning, poison, dark)
- [ ] Combo system (chain attacks)
- [ ] Parry / Riposte (timing)
- [ ] Environnement destructible
- [ ] Weather effects (pluie = -fire dmg)

### Thalys Extensions
- [ ] Évolution Thalys (3 formes)
- [ ] Dialogue avec Thalys (choix narratifs)
- [ ] Multiple endings (selon corruption finale)
- [ ] Thalys boss final (si 100% corruption)

### Multijoueur (Long terme)
- [ ] Co-op local (2 joueurs)
- [ ] PvP arène (1v1)
- [ ] Leaderboards online

---

## 📌 NOTES IMPORTANTES

### Dépendances
- **Aucune librairie externe** (vanilla JS)
- Google Fonts (optionnel, peut être local)
- Assets générés avec IA (Leonardo.ai, Midjourney)

### Performance Targets
- 60 FPS constant
- < 100ms input lag
- < 3s chargement initial
- < 50MB poids total

### Compatibilité
- Chrome/Edge ✅
- Firefox ✅
- Safari ⚠️ (à tester)
- Mobile ⚠️ (à optimiser)

---

## 🎉 CONCLUSION TODO

**FAIT : 35%**  
**EN COURS : 15%**  
**À FAIRE : 50%**

**PROCHAINE SESSION** :
1. Intégrer Thalys dans combat
2. Créer 5 compétences
3. Ajouter props/obstacles

**Après ça, le jeu sera VRAIMENT jouable ! 🎮🔥**

---

*TODO mis à jour le 30 décembre 2024*  
*THE LAST COVENANT - Development Roadmap*  
*"Un dé, une âme, un destin..."*
