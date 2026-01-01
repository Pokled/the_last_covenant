# 🎨 THE LAST COVENANT - Design System

Style inspiré **Diablo 4** et **Baldur's Gate 3** : mature, sombre, texturé.

---

## 💜 COULEURS - DÉCISIONS DE DESIGN

### Corruption = VIOLET/POURPRE (pas rouge !)
```
❌ ROUGE = Vie (standard universel)
✅ VIOLET = Corruption (évite confusion cognitive)

Pourquoi violet ?
- Symbolique démoniaque/poison
- Contraste clair avec HP rouge
- Utilisé dans WoW, Dark Souls
- Fits le lore (magie corrompue)
```

---

## 📦 Utilisation

```html
<link rel="stylesheet" href="assets/css/game-ui.css">
```

---

## 🎨 Components

### 1. PANELS
```html
<div class="panel">
  <h2 class="title-section">Titre Section</h2>
  <p class="text-body">Contenu du panel</p>
</div>
```

### 2. BUTTONS
```html
<button class="btn btn-primary">Bouton Normal</button>
<button class="btn btn-success">Bouton Succès</button>
<button class="btn btn-danger">Bouton Danger</button>
```

### 3. BARS (HP, Corruption)
```html
<div class="bar-container">
  <div class="bar-fill hp" style="width: 75%;">75/100</div>
</div>

<div class="bar-container">
  <div class="bar-fill corruption" style="width: 40%;">40%</div>
</div>
```

### 4. STAT DISPLAY
```html
<div class="stat-row">
  <span class="stat-label">❤️ HP</span>
  <span class="stat-value">85/100</span>
</div>
```

---

## 🎨 Typography

```html
<h1 class="title-main">Titre Principal</h1>
<h2 class="title-section">Titre Section</h2>
<p class="text-body">Texte normal</p>
<p class="text-small">Petit texte</p>
```

---

## ✨ Animations

```html
<!-- Shake l'écran -->
<div class="shake">Contenu</div>

<!-- Fade in -->
<div class="fade-in">Contenu</div>
```

---

## 🎨 Variables CSS

Toutes les couleurs/spacings sont dans `:root` :

```css
/* Couleurs principales */
--color-text-primary: #d4c5b0     /* Beige parchemin */
--color-text-accent: #c9a97a      /* Or terne */

/* Corruption (VIOLET) */
--color-corruption-dark: #2a1a2a  /* Prune sombre */
--color-corruption-mid: #4a2a4a   /* Pourpre */
--color-corruption-light: #6a3a6a /* Violet */

/* Spacing */
--spacing-md: 12px
--spacing-lg: 20px

/* Fonts */
--font-title: 'Cinzel', serif
--font-body: 'Crimson Text', serif
```

---

## 📸 Exemples Visuels

Voir `test-corruption.html` pour un exemple complet !

---

## 🔥 Prochaines Étapes

Ce design sera appliqué à :
- ✅ Test Corruption (fait)
- ⏳ HUD Principal
- ⏳ Inventaire
- ⏳ Combat UI
- ⏳ Hub du Camp
- ⏳ Création Personnage
- ⏳ Cages Trials
