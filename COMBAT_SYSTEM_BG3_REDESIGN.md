# 🎮 Combat System - Redesign BG3 Style
**Date** : 29 Décembre 2025  
**Session** : Refonte complète du layout de combat

## 🎯 Objectif
Créer un système de combat **AAA+ mature** inspiré de **Baldur's Gate 3** et **Diablo 4**, avec :
- Interface intuitive et cognitivement simple
- Feedback visuel constant
- Thalys le Dé comme personnage central charismatique

---

## ✅ Accomplissements

### 1. **Combat System Intuitif** ✅
- ✅ Grid 3x4 tactique (Into the Breach + Darkest Dungeon)
- ✅ 2 actions par tour
- ✅ Déplacement + Attaque adjacente/diagonale
- ✅ Tours automatiques ennemis
- ✅ Détection victoire/défaite

### 2. **UI BG3-Style** ✅
- ✅ **Portraits Top** : Joueur + Ennemis avec HP bars
- ✅ **Zoom sur entité active** (scale 1.1x + glow)
- ✅ **Grayscale si mort**
- ✅ **Icônes CaC/Distance**

### 3. **Combat Log** ✅
- ✅ Déplacé à **gauche centré verticalement**
- ✅ Couleurs par type : Player (bleu), Enemy (rouge), Dice (or), System (beige)
- ✅ Narration Thalys
- ✅ Scrollbar personnalisée

### 4. **Thalys le Dé** 🎲 ✅
- ✅ **Design imposant** : Cercle 2x plus grand
- ✅ **Yeux lumineux** avec glow émissif
- ✅ **Aura violette** pulsante multi-couches
- ✅ **Animation rotation 3D**
- ✅ **Hover effect** : scale + brightness + glow
- ✅ **Indépendant** : pas dans l'action bar (à côté)

### 5. **Action Bar BG3** ✅
- ✅ Barre centrale **réduite en largeur**
- ✅ **Thalys à gauche** (cercle indépendant)
- ✅ **Fin de Tour à droite** (cercle 3D avec gradient)
- ✅ **Slots d'action au centre** (sorts, items)
- ✅ **Points d'action** au-dessus (style Hearthstone, grayscale si utilisés)

### 6. **Fenêtre d'Aide (Tips)** ✅
- ✅ Repositionnée plus haut
- ✅ Bouton toggle avec flèche (← →)
- ✅ Se réduit en onglet sur le bord gauche
- ✅ Design mature (pas de couleurs flashy)

---

## 🔧 Architecture Technique

### Systèmes
```
src/systems/
├── CorruptionSystem.js      # Dé + Corruption + Mémoire
├── PlayerStatsSystem.js      # HP + Stats + Items
├── CombatSystem.js           # Grid 3x4 + Tours + IA
├── CombatRenderer.js         # Canvas + Animations
├── CombatPortraitsUI.js      # Portraits Top (BG3)
├── CombatActionBar.js        # Barre action + Thalys + End Turn
├── CombatIntroSystem.js      # Intro épique (sons + animations)
└── BasicSoundSystem.js       # Audio (Web Audio API)
```

### Événements
- `combat:actionUsed` → Met à jour les points d'action
- `combat:turnEnd` → Passe au tour ennemi
- `combat:victory` → Écran de victoire
- `combat:defeat` → Écran de défaite
- `corruption:changed` → Update UI corruption
- `player:statsChanged` → Update stats display

---

## 🎨 Design Choices

### Couleurs (Mature & Lugubre)
```css
Background: #0d0d0d (noir profond)
Texte principal: #d4c5b0 (beige parchement)
Accents: #c9a97a (or vieilli)
Bordures: #3d3426 (brun foncé)
Player: #4a9eff (bleu)
Enemy: #d14343 (rouge sang)
Corruption: #9b59b6 → #8e44ad (violet)
Dice: #ffd700 (or lumineux)
```

### Fonts
```css
Titres: 'Cinzel' (serif, médiéval)
Corps: 'Crimson Text' (lisible, élégant)
```

### Z-Index Hierarchy
```
100 = Tips Help (top)
50 = Combat Portraits
20 = Thalys + End Turn (indépendants)
10 = Action Bar
5 = Combat Log
1 = Player Stats
0 = Canvas
```

---

## 🐛 Problèmes Résolus

### Layout & Positioning
- ❌ **Thalys coupé** par action bar → ✅ Rendu indépendant avec z-index 20
- ❌ **Aura déformée** (scaleY) → ✅ Utilise translateY + scale uniforme
- ❌ **Combat log chevauche** stats → ✅ Repositionné à gauche centré
- ❌ **Hover zone trop petite** → ✅ Cercle complet cliquable avec pointer-events

### Gameplay
- ❌ **Ennemis attaquent à distance** → ✅ Vérification distance <= 1
- ❌ **Résurrection infinie** → ✅ Désactivée en combat
- ❌ **Pas de détection mort** → ✅ Event combat:defeat
- ❌ **Actions infinies** → ✅ Limite 2 actions/tour

### Logs
- ❌ **Doublons d'emojis** → ✅ Emoji ajouté automatiquement par type
- ❌ **Pas de stats dé** → ✅ Face + Corruption + Stage affichés
- ❌ **Narration absente** → ✅ Thalys commente chaque lancé

---

## 🚀 Prochaines Étapes

### Immédiat
1. ⏳ **Finaliser layout BG3**
   - Combat log à gauche (done ✅)
   - Action bar réduite
   - Thalys + End Turn flanquent la barre
   
2. ⏳ **Blood Pact System**
   - Intégrer système signature (blood-pact-system.js)
   - Modal épique quand le joueur clique sur Thalys
   - Choix de pactes avec conséquences
   
3. ⏳ **Animations VFX**
   - Particules attaque/dégâts
   - Screen shake
   - Flash dégâts
   - Fumée mort ennemi

### Moyen Terme
4. ⏳ **Sorts & Compétences**
   - 4 slots action centrale
   - Cooldowns visuels
   - Tooltips descriptifs
   
5. ⏳ **Items & Potions**
   - Consommables
   - Équipement
   - Effets visuels

### Long Terme
6. ⏳ **IA Ennemie avancée**
   - Patterns d'attaque
   - Positionnement tactique
   - Synergie entre ennemis
   
7. ⏳ **Boss Fights**
   - Phases multiples
   - Mécaniques spéciales
   - Cinématiques

---

## 📝 Notes Design

### Thalys - Personnalité
> **"Attachant et repoussant à la fois"**

**Voix** : Narquoise, tentante, manipulatrice  
**Apparence** : Dé géant avec yeux lumineux + aura violette  
**Rôle** : Tente le joueur avec des pactes corrompus

**Phrases types** :
- *"Un petit combat tactique ? Ennuyeux..."*
- *"Tu pourrais... pimenter les choses."*
- *"Ah... Du sang frais. Intéressant."*
- *"Je me souviens de ce 6... Tu m'en dois un."*

### Combat Philosophy
- **Simple à apprendre** : 2 actions claires
- **Profond à maîtriser** : Positionnement tactique
- **Feedback constant** : Toujours savoir quoi faire
- **Visuellement mature** : Pas de couleurs criantes
- **Thalys omniprésent** : Rappel constant de la corruption

---

## 🎯 Vision Finale

Un combat qui ressemble à **BG3** en termes de clarté et polish, avec :
- La tension narrative de **Darkest Dungeon**
- Le positionnement tactique d'**Into the Breach**
- L'ambiance sombre de **Diablo 4**
- Un système de corruption unique avec **Thalys le Dé** comme antagoniste charismatique

**Objectif** : Faire sentir au joueur que **chaque décision compte**, et que Thalys observe... et se souvient.

---

*"Le Dé se souvient de tout. Et vous ?"* - Thalys
