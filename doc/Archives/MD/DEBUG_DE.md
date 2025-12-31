# 🐛 DEBUG - Dé du Destin

## Ce que tu DEVRAIS voir maintenant

Quand tu cliques sur "🎲 TEST DÉ DESTIN" :

1. **Écran noir transparent** apparaît (overlay)
2. **Cube coloré au centre** avec un "?" qui tourne (1.5s)
3. **Chiffre géant** apparaît (1-6)
4. **Particules** explosent autour (si système visuel OK)
5. **Message du Dé** en haut de l'écran
6. Tout disparaît après 2-3 secondes

---

## Checklist Debug

Ouvre la console (F12) et vérifie :

### ✅ Étape 1 : Fichiers chargés ?

Dans l'onglet **Console**, tu dois voir :
```
🎨 DiceVisualSystem chargé
🎲 Initialisation du Dé du Destin...
✅ Dé du Destin initialisé - Stade 1
✅ Overlay Dé créé avec stade: 1
🎲 Dé du Destin initialisé avec système visuel
```

❌ **Si tu ne vois PAS ces messages** :
- Vérifie que les fichiers sont bien dans `/css/` et `/js/`
- Recharge la page (Ctrl+F5)

---

### ✅ Étape 2 : Overlay créé ?

Dans la console, tape :
```javascript
document.getElementById('dice-overlay')
```

Tu dois voir : `<div id="dice-overlay" class="dice-overlay-container">...</div>`

❌ **Si tu vois `null`** :
- L'overlay n'a pas été créé
- Vérifie les erreurs dans la console

---

### ✅ Étape 3 : CSS chargé ?

Dans la console, tape :
```javascript
const el = document.getElementById('dice-entity');
console.log(getComputedStyle(el).background);
```

Tu dois voir : Un dégradé (`linear-gradient(135deg, rgb(245, 245, 245) 0%, rgb(211, 211, 211) 100%)`)

❌ **Si tu vois juste `white` ou `transparent`** :
- Le CSS n'est pas appliqué
- Vérifie que `dice-system.css` est bien chargé (Network tab)

---

### ✅ Étape 4 : Animation fonctionne ?

Clique sur "TEST DÉ DESTIN", puis dans console :
```javascript
// Pendant l'animation
document.getElementById('dice-overlay').classList.contains('active')
```

Doit retourner `true` pendant l'animation

---

## 🔧 Fixes Rapides

### Problème 1 : Carré blanc sans style

**Solution** : Force le CSS manuellement
```javascript
const cube = document.getElementById('dice-entity');
cube.style.width = '120px';
cube.style.height = '120px';
cube.style.background = 'linear-gradient(135deg, #f5f5f5, #d3d3d3)';
cube.style.border = '2px solid #aaa';
cube.style.borderRadius = '10px';
```

### Problème 2 : Rien ne s'affiche

**Solution** : Affiche l'overlay manuellement
```javascript
const overlay = document.getElementById('dice-overlay');
overlay.style.opacity = '1';
overlay.classList.add('active');
```

### Problème 3 : Pas de particules

**Solution** : Vérifie le Canvas
```javascript
document.getElementById('dice-particles-canvas')
```

Si `null`, le système visuel n'est pas initialisé. Dans game.js ligne 152 :
```javascript
window.DiceSystem.visualSystem = new DiceVisualSystem(window.DiceSystem);
```

---

## 📊 Test Complet dans la Console

Copie/colle ceci dans la console :

```javascript
// Test complet du Dé
console.log('=== TEST DÉ DU DESTIN ===');

// 1. Vérifier que DiceSystem existe
console.log('1. DiceSystem existe?', typeof window.DiceSystem !== 'undefined');

// 2. Vérifier overlay
const overlay = document.getElementById('dice-overlay');
console.log('2. Overlay existe?', overlay !== null);

// 3. Vérifier cube
const cube = document.getElementById('dice-entity');
console.log('3. Cube existe?', cube !== null);
if (cube) {
  console.log('   Cube classes:', cube.className);
  console.log('   Cube background:', getComputedStyle(cube).background);
}

// 4. Vérifier système visuel
console.log('4. Système visuel?', window.DiceSystem.visualSystem !== null);

// 5. Vérifier Canvas
const canvas = document.getElementById('dice-particles-canvas');
console.log('5. Canvas existe?', canvas !== null);

// 6. Test de lancer
console.log('6. Lancement test...');
await window.DiceSystem.roll();
console.log('✅ Test terminé!');
```

---

## 🎨 Ce qui a changé

**Avant** : Juste un carré blanc vide
**Maintenant** :
- ✅ Cube avec dégradé de couleur (Stade 1 = gris/blanc)
- ✅ "?" visible pendant le spin
- ✅ Résultat géant coloré (Or pour 6, Rouge pour 1)
- ✅ Message du Dé en haut
- ✅ Particules Canvas (si système visuel OK)

---

## 📞 Si ça ne marche TOUJOURS pas

1. Vérifie la console pour les erreurs rouges
2. Onglet **Network** : dice-system.css et dice-*.js doivent être en 200 (pas 404)
3. Fais Ctrl+F5 pour forcer le rechargement
4. Vérifie que tu es bien sur `game.html` (pas `index.html`)

---

_Debug guide créé le 27 Décembre 2025_
