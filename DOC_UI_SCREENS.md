# 🎮 THE LAST COVENANT - Documentation UI

## 📋 Table des matières
1. [Écran Titre (Title Screen)](#écran-titre)
2. [Menu Principal](#menu-principal)
3. [Architecture des fichiers](#architecture)
4. [Effets visuels](#effets-visuels)

---

## 🌟 Écran Titre (Title Screen)

### Fichiers
- **Test**: `test-title-screen.html`
- **Production**: `index.html` + `src/ui/scenes/TitleScene.js`
- **Styles**: `src/ui/styles/main.css`

### Design
- Background: `assets/images/background/Background_index.png`
- Logo centré en 3 lignes: "THE / LAST / COVENANT"
- Tagline: "Sept Dieux sont morts. Un pacte éternel. Ton destin t'attend."
- Prompt: "Appuie sur n'importe quelle touche _"
- Version affichée en bas à droite: "v1.0.0 Alpha"

### Effets visuels

**Background**
- Zoom subtil (scale 1 → 1.05 en 30s)
- Variation brightness & contrast
- Overlay gradient sombre

**Particules (3 types)**
- **Poussière dorée** (60%) : Monte lentement, mystique
  - Vitesse réduite x2 pour effet contemplatif
  - Couleur: Or (#d4af37)
  - Alpha: 0.4-0.7
  
- **Fragments de pierre** (25%) : Tombent majestueusement
  - Vitesse réduite x1.5
  - Couleur: Gris-beige (#8a7d6a, #5a4d3a)
  - Alpha: 0.5
  
- **Énergie mystique** (15%) : Flotte librement
  - Couleur: Violet (#6a3a6a, #4a2a4a)
  - Alpha: 0.3-0.5

**Effets atmosphériques**
- Lueur centrale dorée (pulse 6s)
- Brume flottante (3 couches, 40s)
- Vignette respirante (8s)
- Éclair du portail (pulse subtil 10s, opacity 0.4-0.5)

**Animations texte**
- Logo: Glow pulsant (3s)
- Tagline: Fade-in (0.5s delay)
- Prompt: Fade-in (1s delay) + clignotement curseur (1.5s)

### Code clé
```javascript
// Vitesses particules (réduites pour effet contemplatif)
poussièreDorée: {
  vx: ±0.15,
  vy: -0.25 à -0.1,
  gravity: -0.0025
}

fragmentsPierre: {
  vx: ±0.13,
  vy: 0.2 + 0.07,
  gravity: 0.0067
}
```

---

## 🎮 Menu Principal

### Fichiers
- **Test**: `test-main-menu.html`
- **Production**: `src/ui/scenes/MainMenuScene.js` (à créer)
- **Styles**: Intégrés dans le test, à extraire vers `main.css`

### Design (Inspiré Divinity Original Sin 2)

**Layout**
- Menu positionné **en bas à droite**
- Logo au-dessus du menu (non en haut de page)
- Padding: `0 80px 0 0` + `translateY(70px)`
- Background: `assets/images/background/Background_menu.png`

**Boutons**
- Largeur fixe: **300px** (tous identiques)
- Gap entre boutons: **12px**
- Font: Cinzel, 1.1rem, uppercase
- Padding: 16px 60px
- 4 boutons:
  1. **Nouvelle Partie**
  2. **Charger Partie** (désactivé si aucune save)
  3. **Options**
  4. **Crédits**

**Style boutons**
- Background: Gradient sombre avec texture parchemin
- Border: 2px solid beige, avec reflets en haut/gauche
- Hover: Bordure dorée + déplacement gauche (-5px)
- Active: Micro-shake

**Tooltips & Badges**
- Sous-texte au hover (italique, en dessous)
  - "Commencer une nouvelle aventure"
  - "Reprendre une partie sauvegardée"
  - "Configurer l'expérience de jeu"
  - "Découvrir les créateurs"
- Badge "Aucune sauvegarde" sur bouton désactivé (rouge)

### Effets visuels

**Particules (3 types)**
- **Braises dorées** (50%) : Montent du bas
  - Couleur: Or (#d4af37)
  - Glow activé
  
- **Cendres grises** (25%) : Tombent du haut
  - Couleur: Gris (#786e64)
  
- **Poussière** (25%) : Flotte aléatoirement
  - Couleur: Beige (#b4a08c)

**Poussière du curseur** 🌫️
- Spawn: Seulement si souris en mouvement (8% chance)
- Couleur: Gris poussière (#8c827a)
- Alpha: 0.15-0.25 (très transparente)
- Taille: 0.8-2px (très petite)
- Direction: Inverse du mouvement (effet balayage)
- Decay rapide: 0.015

**Effets atmosphériques**
- Lueur centrale dorée (pulse 7s)
- Brume flottante (3 couches, 45s)
- Vignette respirante (10s)
- Background breathing (scale 1 → 1.03 en 25s)

**Animations**
- Boutons: Fade-in depuis la droite (séquentiel)
  - Délais: 0.2s, 0.35s, 0.5s, 0.65s
- Content: Fade-in depuis droite (1.5s)

### Footer
- Version en bas à gauche: "v1.0.0 Alpha"
- Copyright en bas à droite: "© 2024 - The Last Covenant" (cliquable → crédits)

---

## 📁 Architecture des fichiers

```
G:\Jeux_Perso\1_THE_LAST_COVENANT\
│
├── index.html                          # Point d'entrée
├── test-title-screen.html              # ✅ Test écran titre (COMPLET)
├── test-main-menu.html                 # ✅ Test menu principal (COMPLET)
├── test-player.html                    # Test système joueur
├── test-corruption.html                # Test système corruption
│
├── assets\
│   └── images\
│       └── background\
│           ├── Background_index.png    # ✅ Écran titre (ruines + portail)
│           └── Background_menu.png     # ✅ Menu principal
│
└── src\
    ├── main.js                         # Entry point
    ├── ui\
    │   ├── styles\
    │   │   └── main.css                # ✅ Styles CSS (Title + effets)
    │   └── scenes\
    │       ├── TitleScene.js           # ✅ Écran titre (particules améliorées)
    │       ├── MainMenuScene.js        # ⏳ À créer (basé sur test)
    │       ├── CharacterCreationScene.js
    │       ├── CampScene.js
    │       ├── WorldMapScene.js
    │       └── GameScene.js
    │
    ├── systems\
    │   ├── CorruptionSystem.js         # ✅ Système corruption
    │   └── PlayerStatsSystem.js        # ✅ Système stats joueur
    │
    └── utils\
        ├── ParticleSystem.js           # Système particules
        ├── AnimationUtils.js           # Utilitaires animations
        └── SoundManager.js             # Gestionnaire sons
```

---

## ✨ Effets visuels - Référence technique

### Particules communes

**Types de particules**
```javascript
ember:  Braises (or, monte, glow)
ash:    Cendres (gris, descend)
dust:   Poussière (beige, flotte)
stone:  Fragments pierre (gris-beige, descend lentement)
energy: Énergie mystique (violet, flotte)
```

**Propriétés**
- Position: `x, y`
- Vélocité: `vx, vy`
- Taille: `size` (0.8-4px)
- Couleur: `color` [R, G, B]
- Transparence: `alpha` (0-1)
- Vie: `life` (1.0 → 0)
- Déclin: `decay` (0.001-0.015)
- Gravité: `gravity` (-0.005 à 0.01)

### Couleurs de l'univers

```css
--gold-bright: #f4d03f      /* Or vif (logos, accents) */
--gold-dim: #d4af37         /* Or doux (particules, hover) */
--parchment: #f4e8d0        /* Parchemin (textes) */
--blood-red: #8b0000        /* Rouge sang (danger) */
--purple-dark: #4a0e4e      /* Violet (corruption) */

/* Tons sombres */
rgba(10, 10, 15, 0.X)       /* Noir abysse */
rgba(20, 18, 15, 0.X)       /* Brun très sombre */
rgba(90, 77, 58, 0.X)       /* Beige sombre (bordures) */
rgba(138, 125, 106, 0.X)    /* Beige clair (reflets) */
```

### Animations CSS

**Durées recommandées**
- Hover button: 0.25s
- Fade-in content: 1.5s
- Background breathing: 25-30s
- Particules fade: 2-3s
- Glow pulse: 3-7s
- Brume float: 40-45s
- Vignette: 8-10s

**Timing functions**
- UI hover: `ease` ou `ease-out`
- Background: `ease-in-out`
- Fade-in: `ease-out`
- Shake: `cubic-bezier(.36,.07,.19,.97)`

---

## 🎯 Prochaines étapes suggérées

### À intégrer dans le jeu
1. Créer `MainMenuScene.js` depuis `test-main-menu.html`
2. Extraire les styles menu vers `main.css`
3. Ajouter système de sauvegarde (activer "Charger Partie")
4. Implémenter sons (hover, clic, ambiance)

### Améliorations possibles
1. 🎵 Sons de parchemin au hover
2. ⚡ Éclairs lointains dans le background
3. 🔥 Augmenter braises au hover "Nouvelle Partie"
4. 💀 Crânes transparents occasionnels
5. 🌫️ Effet dissipation de brume lors transition
6. 🌟 Halo lumineux subtil qui suit le curseur
7. 📜 Animation float du logo (léger up/down)

---

## 📝 Notes de développement

### Performance
- Limiter particules actives (≈80-120 max)
- Cleanup des particules mortes chaque frame
- Utiliser `requestAnimationFrame` pour animations
- Canvas séparé pour particules (z-index: 5)

### Responsive
- Menu: Adapter padding pour mobile
- Boutons: Stack vertical OK, largeur auto si <768px
- Logo: Réduire taille sur petit écran
- Particules: Réduire densité sur mobile

### Accessibilité
- Alt text sur images
- Contraste WCAG AA minimum
- Navigation clavier (Tab, Enter, Esc)
- ARIA labels sur boutons désactivés
- Skip links si nécessaire

---

**Dernière mise à jour**: 30 décembre 2024
**Version**: 1.0.0 Alpha
**Auteur**: [Ton nom]
