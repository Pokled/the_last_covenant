# 💀🔥 AMBIANCE LUGUBRE - Dé du Destin

## 🎨 TRANSFORMATION TERMINÉE !

Le Dé du Destin est maintenant **LUGUBRE**, **SOMBRE** et **DE LA MORT QUI TUE** ! 🩸

---

## 🔥 CE QUI A ÉTÉ CHANGÉ

### 1. Couleurs des Particules - FINI LES PAILLETTES !

**AVANT** (coloré, joyeux) :
- Or #FFD700
- Orange #FF4500
- Violet #9370DB
- Blanc #FFF

**MAINTENANT** (LUGUBRE, DARK) :
- 🩸 **Rouge sang foncé** #8B0000
- 🩸 **Cramoisi** #DC143C
- 🩸 **Sang séché** #6B0000
- 🌑 **Boue brune** #4a3020
- 🌑 **Terre sombre** #2d1410
- 🌫️ **Cendres** #444, #333, #222
- ⚫ **Fumée noire** #111

---

## 🎬 LES 4 PHASES - VERSION LUGUBRE

### Phase 1 : Explosion Initiale (0.5s)
**Avant** : Explosion dorée brillante
**Maintenant** :
```
💀 2000 particules de SANG et BOUE
🔊 Grondement sourd (30-60 Hz)
🔊 Impact violent (100-20 Hz)
⚡ Flash ROUGE SANG (pas blanc !)
📳 Screen shake VIOLENT (20px, 400ms)
```

**Couleurs** :
- Rouge sang foncé
- Cramoisi
- Sang séché
- Boue brune
- Terre sombre
- Cendres
- Fumée noire

### Phase 2 : Vortex Spiral (1.0s)
**Avant** : Spirale dorée/violette
**Maintenant** :
```
🌀 Spirale de SANG COAGULÉ et BOUE
🔊 Sifflement sinistre qui monte (200-800 Hz)
```

**Couleurs** :
- Sang séché #6B0000
- Sang foncé #8B0000
- Boue sombre #3a2010
- Cendres grises #333
- Terre noire #1a0a05

### Phase 3 : MÉGA Explosion Résultat (1.0s)

#### Si résultat = 6 (Critique SUCCESS)
```
💀 SANG FRAIS ÉCARLATE
🩸 3 vagues de 1500 particules de SANG
🔊 Craquement d'os (5 craquements rapides)
🔊 Explosion layered (basse + bruit)
⚡ Flash ROUGE SANG intense
📳 MÉGA Screen shake (30px, 800ms)
```
**Couleurs** :
- Cramoisi sang frais #DC143C
- Sang foncé #8B0000
- Rouge brique #B22222, #A52A2A

#### Si résultat = 1 (Critique FAIL)
```
💀 SANG COAGULÉ NOIR
🩸 3 vagues de 1500 particules de SANG POURRI
🔊 Grondement sinistre intense (0.8s)
🔊 Craquement d'os
⚡ Flash SANG NOIR
📳 MÉGA Screen shake (30px, 800ms)
```
**Couleurs** :
- Sang séché noir #6B0000
- Sang pourri #4A0000
- Boue noire #2d1410, #1a0a05

#### Si résultat = 2-5 (Normal)
```
🌑 CENDRES ET BOUE
💨 3 vagues de 800 particules de TERRE
🔊 Impact sourd (thud)
```
**Couleurs** :
- Boue brune #4a3020
- Terre sombre #3a2010, #2d1410
- Cendres #555

### Phase 4 : Débris qui Tombent (0.5s)
**Avant** : Pluie d'étoiles scintillantes
**Maintenant** :
```
🩸 Pluie de DÉBRIS SANGLANTS
100 particules de SANG et CENDRES qui tombent
```

**Couleurs** :
- Sang #8B0000
- Sang séché #6B0000
- Boue #4a3020
- Cendres #333
- Fumée #222

---

## 🔊 SYSTÈME AUDIO - SONS PROCÉDURAUX

### 6 Sons Lugubres Créés

#### 1. **Grondement Sourd** (`playRumble`)
```javascript
Fréquence : 30-60 Hz (basse sinistre)
Type : Sawtooth oscillator
Durée : 0.5s - 0.8s
Filtre : Lowpass 200 Hz (son très sourd)
Volume : 0.4 max
```
**Effet** : Grondement inquiétant qui monte

#### 2. **Impact Violent** (`playImpact`)
```javascript
Fréquence : 100 → 20 Hz (percussif)
Type : Sine wave
Durée : 0.3s
Filtre : Lowpass 300 Hz
Volume : 0.6 max (puissant !)
```
**Effet** : BOOM sourd et violent

#### 3. **Sifflement Sinistre** (`playWhisper`)
```javascript
Fréquence : 200 → 800 Hz (monte progressivement)
Type : Sine wave
Durée : 1.0s
Filtre : Bandpass 400 Hz (Q=10, très résonant)
Volume : 0.15 max
```
**Effet** : Sifflement qui monte (comme un fantôme)

#### 4. **Craquement d'Os** (`playCrackle`)
```javascript
Type : White noise
5 craquements rapides (espacés de 30ms)
Fréquence : 2000-5000 Hz (aléatoire)
Filtre : Bandpass (Q=20, très étroit)
Durée : 0.05s par craquement
Volume : 0.3 max
```
**Effet** : Craquements d'os TERRIFIANTS

#### 5. **Explosion** (`playExplosion`)
```javascript
Layer 1 : Basse 80 → 20 Hz (0.5s)
Layer 2 : Bruit blanc filtré (0.4s)
Filtre : Lowpass 800 Hz
Volume : 0.5 (bass) + 0.3 (noise)
```
**Effet** : Explosion layered massive

#### 6. **Impact Sourd** (`playThud`)
```javascript
Fréquence : 60 → 30 Hz
Type : Sine wave
Durée : 0.2s
Filtre : Lowpass 150 Hz (très sourd)
Volume : 0.4 max
```
**Effet** : Impact mat et lourd

---

## 🎮 CE QUE TU VAS ENTENDRE ET VOIR

### Quand tu lances le dé :

**0.0s - Explosion Initiale**
```
👀 2000 particules de SANG explosent radialement
🔊 RRRRRRRR... (grondement sourd 30-60 Hz)
🔊 BOOM ! (impact violent)
⚡ Flash ROUGE SANG
📳 Écran TREMBLE violemment
```

**0.5s - Vortex**
```
👀 Spirale de SANG COAGULÉ qui converge
🔊 iiiiIIIIIIII... (sifflement qui monte 200-800 Hz)
🌀 Effet hypnotique sombre
```

**1.5s - MÉGA Explosion**

Si **6** (Critique) :
```
👀 3 vagues de 1500 particules de SANG FRAIS
🔊 CRAC-CRAC-CRAC-CRAC-CRAC (craquements d'os)
🔊 BOOOOM! (explosion massive layered)
⚡ Flash ROUGE SANG intense
📳 Écran TREMBLE comme un séisme (30px !)
```

Si **1** (Échec) :
```
👀 3 vagues de SANG NOIR POURRI
🔊 RRRRRRRRRR... (grondement sinistre long)
🔊 CRAC-CRAC-CRAC (craquements)
⚡ Flash NOIR SANG
📳 Séisme (30px)
```

Si **2-5** (Normal) :
```
👀 Cendres et boue
🔊 THUD (impact sourd)
```

**2.5s - Débris**
```
👀 100 débris de SANG et CENDRES tombent
💧 Pluie sanglante sinistre
```

**3.0s - Résultat**
```
      6
   (250px)

En ROUGE SANG avec multi-glow
```

---

## 📊 COMPARAISON AVANT / APRÈS

| Aspect | AVANT | MAINTENANT 💀 |
|--------|-------|--------------|
| **Ambiance** | Magique, scintillant | LUGUBRE, terrifiant |
| **Couleurs** | Or, Orange, Violet, Blanc | Sang, Boue, Cendres, Noir |
| **Flash** | Blanc brillant | ROUGE SANG |
| **Particules** | Étoiles scintillantes | Débris sanglants |
| **Screen shake** | 20px, 600ms | **30px, 800ms** (PLUS VIOLENT) |
| **Sons** | Aucun | **6 sons lugubres procéduraux** |
| **Grondement** | ❌ | ✅ 30-60 Hz sourd |
| **Impact** | ❌ | ✅ 100-20 Hz violent |
| **Sifflement** | ❌ | ✅ 200-800 Hz sinistre |
| **Craquements** | ❌ | ✅ 5 craquements d'os |
| **Explosion** | ❌ | ✅ Layered massive |
| **Thud** | ❌ | ✅ Impact sourd |

---

## 🧪 TESTER MAINTENANT

### 1. Ctrl+F5 (vider le cache)

### 2. Clique sur "🎲 TEST DÉ DESTIN"

### 3. TU DOIS VOIR ET ENTENDRE :

**Visuel** :
- [x] Particules de **SANG** (rouge foncé)
- [x] Particules de **BOUE** (marron sombre)
- [x] Particules de **CENDRES** (gris)
- [x] Particules de **FUMÉE NOIRE**
- [x] Flash **ROUGE SANG** (pas blanc)
- [x] Vortex de **sang coagulé**
- [x] Débris **sanglants** qui tombent

**Audio** (avec tes enceintes/casque !) :
- [x] 🔊 **RRRR...** Grondement sourd qui monte
- [x] 🔊 **BOOM!** Impact violent
- [x] 🔊 **iiiiIIII...** Sifflement sinistre
- [x] 🔊 **CRAC-CRAC** Craquements d'os (si 6 ou 1)
- [x] 🔊 **BOOOM!** Explosion layered (si 6)
- [x] 🔊 **THUD** Impact sourd (si 2-5)

**Sensations** :
- [x] Écran **TREMBLE** violemment
- [x] Ambiance **SOMBRE et TERRIFIANTE**
- [x] Ça fait **PEUR** ! 💀

---

## 🎯 POINTS TECHNIQUES

### Web Audio API
```javascript
// Créé automatiquement au chargement
this.audioContext = new AudioContext();
this.masterGain.gain.value = 0.3; // Volume global 30%

// Tous les sons sont PROCÉDURAUX (pas de fichiers)
// Génération en temps réel avec oscillateurs + filtres
```

### Types d'oscillateurs utilisés
- **Sawtooth** : Grondement (harmoniques riches)
- **Sine** : Impacts, explosions (pures basses)
- **White Noise** : Craquements (texture aléatoire)

### Filtres utilisés
- **Lowpass** : Sons sourds (coupe les aigus)
- **Bandpass** : Sifflements, craquements (bande étroite)
- **High Q** : Effets résonants (Q=10-20)

### Enveloppes
- **Attack** : 0-0.1s (montée rapide)
- **Decay/Release** : Exponentiel (naturel)
- **Sustain** : Variable selon effet

---

## 💡 CUSTOMISATION

### Changer le volume global
Dans `dice-visual-system.js` (ligne 57) :
```javascript
this.masterGain.gain.value = 0.5; // Actuellement 0.3 (30%)
```

### Désactiver l'audio
```javascript
// Dans la console (F12)
window.DiceSystem.visualSystem.audioContext.close();
```

### Changer les couleurs
Dans `dice-visual-system.js` :
- **Ligne 154-162** : Explosion initiale
- **Ligne 216-222** : Vortex
- **Ligne 252-269** : Méga explosion
- **Ligne 315-321** : Débris

### Modifier un son
Exemple : Grondement plus grave
```javascript
// Ligne 595-596
osc.frequency.setValueAtTime(20, ...); // Au lieu de 30
osc.frequency.exponentialRampToValueAtTime(40, ...); // Au lieu de 60
```

---

## 🐛 DEBUGGING

### Si aucun son
```javascript
// Console (F12)
console.log(window.DiceSystem.visualSystem.audioContext);
// Doit afficher AudioContext, pas null

// Vérifier que le navigateur supporte Web Audio
if (window.AudioContext || window.webkitAudioContext) {
  console.log('✅ Web Audio supporté');
} else {
  console.log('❌ Web Audio NON supporté');
}
```

### Si les particules ne sont pas lugubres
```javascript
// Vérifier les couleurs dans la console
const colors = ['#8B0000', '#DC143C', '#6B0000'];
console.log(colors); // Doit afficher rouge sang
```

### Tester un son isolé
```javascript
// Dans la console
window.DiceSystem.visualSystem.playRumble(1);    // Grondement
window.DiceSystem.visualSystem.playImpact();     // Impact
window.DiceSystem.visualSystem.playWhisper(1000); // Sifflement
window.DiceSystem.visualSystem.playCrackle();    // Craquements
window.DiceSystem.visualSystem.playExplosion();  // Explosion
window.DiceSystem.visualSystem.playThud();       // Thud
```

---

## ✅ RÉSUMÉ

**Fichier modifié** : `js/dice-visual-system.js`

**Changements** :
1. ✅ Toutes les couleurs → LUGUBRES (sang, boue, cendres)
2. ✅ Flash blanc → ROUGE SANG
3. ✅ Étoiles → Débris sanglants
4. ✅ Screen shake plus violent (30px au lieu de 20px)
5. ✅ Système audio complet (Web Audio API)
6. ✅ 6 sons procéduraux lugubres
7. ✅ Master volume à 30%

**Résultat** :
```
💀 AMBIANCE DE LA MORT QUI TUE !
🩸 Particules de sang, boue, cendres
🔊 Sons lugubres terrifiants
📳 Screen shake violent
⚡ Flash rouge sang
```

---

## 🎉 ENJOY L'AMBIANCE LUGUBRE !

**Ctrl+F5 et clique sur "🎲 TEST DÉ DESTIN"**

Monte le son et prépare-toi à FLIPPER ! 💀🔥🩸

---

_Ambiance Lugubre - 27 Décembre 2025_
_Particules de sang + Sons procéduraux lugubres_
_DE LA MORT QUI TUE ! 💀_
