# 💀 CUBE OSSEUX 3D - Bouton Dé du Destin

## ✅ TERMINÉ !

Le bouton "LANCER LE DÉ" est maintenant un **vrai cube 3D osseux** qui flotte et tourne en permanence ! 💀

---

## 🔥 CE QUI A ÉTÉ FAIT

### 1. Emoji moche → VRAI CUBE 3D
**AVANT** :
```html
<span class="dice-icon">🎲</span>  <!-- Emoji moche -->
```

**MAINTENANT** :
```html
<div class="dice-3d-button-container">
  <div class="dice-3d-button">
    <div class="dice-face-btn front">1</div>
    <div class="dice-face-btn back">6</div>
    <div class="dice-face-btn right">2</div>
    <div class="dice-face-btn left">5</div>
    <div class="dice-face-btn top">3</div>
    <div class="dice-face-btn bottom">4</div>
  </div>
</div>
```
**→ Vrai cube 3D avec 6 faces !**

---

## 🎨 STYLE OSSEUX / CRAQUELÉ

### Couleurs
```css
/* Dégradé OS ABIMÉ */
background: linear-gradient(135deg,
  #d4c5a9 0%,   /* Beige clair (os blanchi) */
  #a89968 50%,  /* Marron doré (os vieilli) */
  #8b7355 100%  /* Marron foncé (os tacheté) */
);

border: 2px solid #6b5638;  /* Bordure marron sombre */
```

### Texture CRAQUELÉE
```css
/* Craquelures verticales */
repeating-linear-gradient(90deg,
  transparent 0px,
  transparent 8px,
  rgba(61, 40, 23, 0.15) 8px,  /* Lignes foncées */
  rgba(61, 40, 23, 0.15) 9px
)

/* Craquelures diagonales */
repeating-linear-gradient(45deg,
  transparent 0px,
  transparent 12px,
  rgba(61, 40, 23, 0.1) 12px,  /* Cracks en diagonale */
  rgba(61, 40, 23, 0.1) 13px
)
```

### Taches SOMBRES
```css
/* 3 taches aléatoires sur chaque face */
radial-gradient(ellipse at 20% 30%, rgba(61, 40, 23, 0.3) 0%, transparent 40%),
radial-gradient(ellipse at 70% 60%, rgba(61, 40, 23, 0.2) 0%, transparent 30%),
radial-gradient(ellipse at 40% 80%, rgba(61, 40, 23, 0.25) 0%, transparent 35%)
```

### Vieillissement BORDS
```css
/* Vignette sombre sur les bords */
radial-gradient(ellipse at center,
  transparent 40%,
  rgba(61, 40, 23, 0.4) 100%
)
```

**Résultat** : Texture d'os craquelé et abîmé avec taches ! 💀

---

## 🎬 ANIMATIONS CONSTANTES

### 1. FLOATING (Montée/Descente)
**Plus voyant qu'avant !**

```css
@keyframes floatBone {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-12px) rotate(2deg);    /* Monte de 12px ! */
  }
  50% {
    transform: translateY(0) rotate(0deg);
  }
  75% {
    transform: translateY(-8px) rotate(-2deg);    /* Monte de 8px */
  }
}

animation: floatBone 2.5s ease-in-out infinite;
```

**Amplitude** : -12px (au lieu de ~3px avant) → **4× plus voyant !**

### 2. ROTATION CONSTANTE
**Le cube tourne lentement en permanence**

```css
@keyframes slowSpin {
  0% {
    transform: rotateX(20deg) rotateY(0deg) rotateZ(10deg);
  }
  100% {
    transform: rotateX(20deg) rotateY(360deg) rotateZ(10deg);  /* 1 tour complet */
  }
}

animation: slowSpin 8s linear infinite;  /* 8 secondes par tour */
```

**Résultat** : Le cube tourne tranquillement sur lui-même ! 💀

### 3. HOVER = RAPIDE + PULSE
**Quand tu survoles le bouton**

```css
/* Rotation 3× plus rapide */
animation: fastSpin 3s linear infinite, dicePulse 0.8s ease-in-out infinite;

@keyframes fastSpin {
  /* 1 tour en 3s au lieu de 8s */
  100% { transform: rotateX(20deg) rotateY(360deg) rotateZ(10deg); }
}

@keyframes dicePulse {
  /* Pulse entre scale(1) et scale(1.1) */
  0%, 100% { transform: ... scale(1); }
  50% { transform: ... scale(1.1); }
}
```

**Résultat** : Le cube tourne vite et pulse quand tu survoles ! ⚡

---

## 📐 DÉTAILS TECHNIQUES

### Taille du cube
```css
width: 70px;
height: 70px;
```

### Perspective 3D
```css
perspective: 600px;
perspective-origin: center;
transform-style: preserve-3d;
```

### Positionnement des 6 faces
```css
.dice-face-btn.front  { transform: rotateY(0deg) translateZ(35px); }
.dice-face-btn.back   { transform: rotateY(180deg) translateZ(35px); }
.dice-face-btn.right  { transform: rotateY(90deg) translateZ(35px); }
.dice-face-btn.left   { transform: rotateY(-90deg) translateZ(35px); }
.dice-face-btn.top    { transform: rotateX(90deg) translateZ(35px); }
.dice-face-btn.bottom { transform: rotateX(-90deg) translateZ(35px); }
```

### Nombre sur chaque face
```html
front: 1
right: 2
top: 3
bottom: 4
left: 5
back: 6
```

---

## 🎮 CE QUE TU VOIS MAINTENANT

### Au repos
```
┌─────────────────────┐
│                     │
│   LANCER LE DÉ      │
│                     │
│      💀 CUBE       │  ← Cube osseux qui :
│      FLOTTE        │     - FLOTTE (monte/descend)
│      TOURNE        │     - TOURNE lentement
│                     │     - Texture craquelée
│    [LANCER LE DÉ]   │     - Taches visibles
│                     │
└─────────────────────┘
```

### Au hover
```
┌─────────────────────┐
│                     │
│   LANCER LE DÉ      │
│                     │
│      💀 CUBE       │  ← Cube qui :
│   TOURNE VITE      │     - TOURNE 3× plus vite
│    ET PULSE        │     - PULSE (grossit/rétrécit)
│                     │     - Toujours craquelé
│    [LANCER LE DÉ]   │
│                     │
└─────────────────────┘
```

---

## 📊 COMPARAISON AVANT / APRÈS

| Aspect | AVANT | MAINTENANT 💀 |
|--------|-------|---------------|
| **Visuel** | Emoji 🎲 (plat) | Vrai cube 3D osseux |
| **Couleur** | Emoji par défaut | Beige/Marron (os) |
| **Texture** | Aucune | Craquelures + Taches |
| **Floating** | ~3px | **12px** (4× plus voyant) |
| **Rotation** | Aucune | **Constante** (8s/tour) |
| **Hover** | Aucun effet | Rotation rapide + Pulse |
| **Effet vieilli** | Non | **Vignette sombre sur bords** |
| **6 faces** | Non (juste emoji) | **Oui** (vraies faces 3D) |

---

## 🧪 TESTER MAINTENANT

### 1. Ctrl+F5 (vider le cache)

### 2. Regarde le bouton "LANCER LE DÉ" dans la sidebar gauche

### 3. TU DOIS VOIR :

**Au repos** :
- [x] Un **VRAI CUBE 3D** osseux (pas un emoji)
- [x] Couleur **BEIGE/MARRON** (os abîmé)
- [x] **Texture craquelée** visible
- [x] **Taches sombres** sur les faces
- [x] Le cube **FLOTTE** (monte/descend de 12px)
- [x] Le cube **TOURNE** lentement (8s par tour)
- [x] Les **6 faces** sont visibles pendant la rotation
- [x] **Chiffres** (1-6) sur les faces

**Au hover** :
- [x] Le cube **TOURNE PLUS VITE** (3s au lieu de 8s)
- [x] Le cube **PULSE** (grossit/rétrécit)
- [x] Les textures restent visibles

---

## 💡 CUSTOMISATION

### Changer les couleurs de l'os
Dans `game-ui-new.css` (ligne 397) :
```css
.dice-face-btn {
  background: linear-gradient(135deg,
    #fff 0%,          /* Os très blanchi */
    #e8dcc4 50%,      /* Ivoire */
    #d4c5a9 100%      /* Beige clair */
  );
}
```

### Changer la vitesse de floating
Dans `game-ui-new.css` (ligne 354) :
```css
animation: floatBone 4s ease-in-out infinite;  /* Au lieu de 2.5s */
```

### Changer la vitesse de rotation
Dans `game-ui-new.css` (ligne 378) :
```css
animation: slowSpin 12s linear infinite;  /* Au lieu de 8s */
```

### Augmenter l'amplitude de floating
Dans `game-ui-new.css` (ligne 363) :
```css
transform: translateY(-20px) rotate(2deg);  /* Au lieu de -12px */
```

### Plus de craquelures
Dans `game-ui-new.css` (ligne 430-436) :
```css
/* Réduire l'espacement entre les cracks */
transparent 0px,
transparent 4px,      /* Au lieu de 8px */
rgba(...) 4px,
rgba(...) 5px
```

---

## 🐛 DEBUGGING

### Si le cube ne s'affiche pas
```javascript
// Console (F12)
const container = document.querySelector('.dice-3d-button-container');
console.log(container);  // Doit afficher <div>

const faces = document.querySelectorAll('.dice-face-btn');
console.log(faces.length);  // Doit afficher 6
```

### Si le cube ne flotte pas
```javascript
// Vérifier l'animation dans la console
const container = document.querySelector('.dice-3d-button-container');
const style = window.getComputedStyle(container);
console.log(style.animation);  // Doit contenir "floatBone"
```

### Si le cube ne tourne pas
```javascript
// Vérifier la rotation
const cube = document.querySelector('.dice-3d-button');
const style = window.getComputedStyle(cube);
console.log(style.animation);  // Doit contenir "slowSpin"
console.log(style.transformStyle);  // Doit afficher "preserve-3d"
```

### Si les textures ne sont pas visibles
```javascript
// Vérifier les pseudo-éléments
const face = document.querySelector('.dice-face-btn');
const beforeStyle = window.getComputedStyle(face, '::before');
console.log(beforeStyle.background);  // Doit contenir les gradients
```

---

## ✅ RÉSUMÉ

**Fichiers modifiés** :
1. ✅ `game.html` (lignes 129-142) - HTML du cube 3D
2. ✅ `game-ui-new.css` (lignes 345-497) - CSS du cube osseux

**Changements** :
1. ✅ Emoji 🎲 → Vrai cube 3D (6 faces)
2. ✅ Style osseux (beige/marron)
3. ✅ Texture craquelée (repeating gradients)
4. ✅ Taches sombres (3 par face)
5. ✅ Vignette de vieillissement
6. ✅ Floating **12px** (4× plus voyant)
7. ✅ Rotation constante (8s/tour)
8. ✅ Hover = Rotation rapide + Pulse

**Résultat** :
```
💀 VRAI CUBE 3D OSSEUX CRAQUELÉ
🎬 Animation floating voyante (12px)
🔄 Rotation constante (8s/tour)
⚡ Hover = Rotation rapide + Pulse
🎨 Texture réaliste d'os abîmé
```

---

## 🎉 ENJOY LE CUBE OSSEUX !

**Ctrl+F5 et regarde le bouton "LANCER LE DÉ"**

Tu vas voir un VRAI cube osseux qui flotte et tourne ! 💀✨

---

_Cube Osseux 3D - 27 Décembre 2025_
_Vrai cube 3D avec texture os craquelé_
_Floating voyant + Rotation constante_
_FINI L'EMOJI MOCHE ! 💀_
