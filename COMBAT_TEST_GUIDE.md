# ⚔️ COMBAT SYSTEM - GUIDE DE TEST

## 🎯 Objectif

Système de combat **tactique simplifié** avec feedback visuel complet style BG3/Diablo 4.

## 🚀 Lancer le test

1. **Ouvrir** : `test-combat.html` dans un navigateur
2. **Serveur local requis** (CORS) :
   ```bash
   # Avec Python
   python -m http.server 5500
   
   # Avec Node
   npx serve
   ```
3. **Accéder** : `http://localhost:5500/test-combat.html`

## 🎬 SÉQUENCE D'INTRO (NOUVEAU !)

Au lancement, vous verrez :

1. **Flash blanc** (transition)
2. **"COMBAT !"** dramatique avec zoom + tambour de guerre
3. **Présentation ennemis** un par un (zoom + nom + HP)
4. **Tutoriel** (premier combat seulement) avec tips :
   - 💡 Survolez pour voir actions
   - ⚔️ Cliquez ennemi pour attaquer
   - 🚶 Cliquez case vide pour bouger
   - 🎲 Le Dé change tout mais coûte de la Corruption
5. **"VOTRE TOUR"** slide in depuis la gauche

### À chaque changement de tour
- **"TOUR ENNEMI"** slide depuis la droite (rouge)
- **"VOTRE TOUR"** slide depuis la gauche (bleu)
- Sons + animations

## 🎮 Comment jouer

### Contrôles
- **Hover sur grille** : Preview de l'action (highlight + tooltip)
  - Vert = Déplacement possible
  - Rouge = Attaque possible
  - Tooltip affiche dégâts/conséquences

- **Click sur case** :
  - Case vide adjacente → **Se déplace**
  - Ennemi adjacent → **Attaque**

- **Bouton "Lancer le Dé"** :
  - 1 fois par combat
  - Effets selon résultat (1-6)
  - Coûte de la corruption

- **Bouton "Fin du Tour"** :
  - Passe au tour ennemi
  - Ennemis jouent automatiquement

### Interface

#### Top-Left : Stats Joueur
- HP bar (rouge)
- Corruption bar (violet)
- ATK / DEF / SPD

#### Top-Right : Tour
- Numéro du tour
- Phase (Votre tour / Tour ennemi)

#### Bottom-Left : Combat Log
- Historique actions
- Couleurs par type :
  - Bleu = Joueur
  - Rouge = Ennemi
  - Or = Dé
  - Gris = Système

#### Center : Grille 3x3
- **Vous** : Cercle bleu 🗡️ (gauche)
- **Ennemis** : Cercles rouges 🛡️🐺 (droite)
- **Hazards** : 🔥☠️🌀 (cases dangereuses)
- **Intentions** : Flèches pointillées rouges

## 🎨 Feedback Visuels

### ✅ Implémentés
- [x] Highlight au survol (vert/rouge)
- [x] Tooltips avec preview dégâts
- [x] HP bars au-dessus entités
- [x] Intentions ennemies (flèches)
- [x] Floating numbers (dégâts)
- [x] Particules d'impact
- [x] Animations fluides

### 🔧 À faire
- [ ] Sons (impacts, mouvements)
- [ ] Shake screen (coups critiques)
- [ ] Trail de mouvement
- [ ] Death animations
- [ ] Victory screen

## 🐛 Bugs Connus

### ✅ CORRIGÉS
- [x] `gridPos is null` → Ajout check null dans `onMouseMove`
- [x] `font` invalide → Ajout `serif` comme fallback
- [x] Grille invisible → Ajout `render()` après init

### ⚠️ À tester
- [ ] Collision ennemis/joueur
- [ ] Hazards sur spawn
- [ ] Multiple ennemis attack ordre
- [ ] Fin de combat avec loot

## 📊 Métriques de Test

### Performance
- FPS target : 60
- Render time : < 16ms
- Animation smoothness : OK

### UX
- Time to understand : < 30s
- Actions per minute : 10-15
- Error rate : < 5%

## 🎯 Prochaines Étapes

1. **Tester hover/click** → Vérifier preview
2. **Attaquer ennemi** → Voir floating numbers
3. **Lancer Dé** → Tester effets 1-6
4. **Finir combat** → Vérifier victoire/loot
5. **Ajuster balance** → Dégâts/HP si besoin

## 💡 Design Intentions

### Simplicité Cognitive
- **1 action/tour** (pas de confusion)
- **Preview visuel** (WYSIWYG)
- **Feedback immédiat** (jamais de "qu'est-ce qui s'est passé?")

### Profondeur Tactique
- Positionnement (hazards, cover)
- Gestion ressource (Dé = 1x)
- Timing (quand attaquer/bouger)
- Risk/reward (Dé risqué mais puissant)

### Feel
- **Impacts lourds** (particules, shake)
- **Lecture claire** (intentions, tooltips)
- **Rythme fluide** (animations rapides)
- **Récompense visuelle** (crits, kills)

---

**Version** : 3.0.0 - Intuitive Tactical
**Dernière MAJ** : 29 Décembre 2025
