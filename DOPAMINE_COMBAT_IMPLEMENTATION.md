# 🎮 DOPAMINE COMBAT SYSTEM - Implémentation

## 🔥 FEATURES IMPLÉMENTÉES

### 1. Floating Damage Numbers
- ✅ Pop-in effect (scale 0.2 → 1.2)
- ✅ Monte et disparaît
- ✅ Couleurs selon type :
  - Normal : Rouge (#ff4444)
  - Critique : Or (#ffd700) + "CRITICAL!"
  - Kill : Rouge sang (#ff0000) + "ELIMINATED!"
- ✅ Shadow épais pour lisibilité
- ✅ Rotation légère pour dynamisme

### 2. Screen Shake
- ✅ Intensité variable selon dégâts
- ✅ Diminue progressivement
- ✅ Extra puissant sur critique (25)
- ✅ MASSIF sur kill (30)
- ✅ S'applique à TOUT le rendu

### 3. Particules
- ✅ **Blood Splatter** : 15-25 particules de sang
  - Gravité réaliste
  - Vitesse aléatoire directionnelle
  - Fade out progressif
  - Collision au sol (persistent blood)
- ✅ **Critical Stars** : 12 étoiles dorées qui tournent
  - Rotation continue
  - Explosent depuis le centre
  - Très visible
- ✅ **Impact Sparks** : Étincelles orange
  - Pour impacts sur armure
  - Rapides et vifs

### 4. Flash Effects
- ✅ Cell flash sur impact (blanc)
- ✅ Screen flash sur critique (doré)
- ✅ Fade out smooth
- ✅ Superposables (multiple flashes)

### 5. Slow Motion
- ✅ Bullet time sur critique (0.3-0.4x)
- ✅ Lerp smooth vers/depuis slow-mo
- ✅ Durée configurable
- ✅ Affecte TOUTES les animations

### 6. Combo System
- ✅ Counter qui monte si hits < 2s d'intervalle
- ✅ Affichage "3x COMBO!" en or
- ✅ Pulse effect
- ✅ Gradient animé
- ✅ Shake augmente avec combo
- ✅ Flash rouge sur combo 3+

## 🎯 FLOW D'UNE ATTAQUE

```
Joueur attaque ennemi
        ↓
1. CALCUL (Instant)
   - Dégâts calculés
   - Critique ?
   - Kill ?
        ↓
2. FEEDBACK START (0ms)
   - Screen shake lance
   - Particules créées (sang + étoiles si crit)
   - Flash sur case cible
   - Son d'impact
        ↓
3. DAMAGE REVEAL (100ms)
   - Number pop-in (scale animation)
   - Combo register
   - Si crit : Slow-mo activé
        ↓
4. AFTERMATH (200-500ms)
   - Particules montent/tombent
   - Number monte et disparaît
   - Shake diminue
   - Slow-mo revient normal
   - Combo displayed
        ↓
5. DONE
   - Feedback continue en background
   - Joueur peut agir
```

## 🎨 PARAMÈTRES TWEAKABLES

### Intensités
```javascript
// CombatFeedbackSystem.js
normal_shake = 12
crit_shake = 25
kill_shake = 30

blood_particles_normal = 15
blood_particles_crit = 25

slowmo_crit = 0.3-0.4 (70% plus lent)
```

### Timings
```javascript
shake_duration = 0.3s (normal), 0.5s (crit)
particle_lifetime = varies (blood: 1-2s, stars: 1s)
number_lifetime = 1.5s
flash_duration = 0.1s
slowmo_duration = 0.5s
combo_window = 2.0s
```

### Visuals
```javascript
fontSize_normal = 28px
fontSize_crit = 36px
fontSize_kill = 40px

color_normal = '#ff4444'
color_crit = '#ffd700'
color_kill = '#ff0000'
blood_color = '#8b0000'
star_color = '#ffd700'
```

## 🔊 SONS NÉCESSAIRES (TODO)

### Priorité 1
- `impact_flesh.mp3` - Coup normal
- `impact_critical.mp3` - Coup critique (plus fort)
- `kill_confirm.mp3` - Mort d'ennemi (satisfaisant)

### Priorité 2
- `crit_hit.mp3` - Son spécial critique (aigu/brillant)
- `combo_milestone.mp3` - Tous les 3 coups de combo

### Priorité 3
- `impact_armor.mp3` - Variation pour ennemis blindés
- `swoosh_heavy.mp3` - Anticipation d'attaque

## 🎮 INTÉGRATION

### Fichiers modifiés
1. `src/systems/CombatFeedbackSystem.js` - NOUVEAU (500+ lignes)
2. `src/systems/CombatRenderer.js` - Ajout feedbackSystem
3. `src/systems/CombatSystem.js` - Appel feedback dans attackEnemy()
4. `test-combat.html` - Import + init + render loop

### Ordre d'initialisation
```javascript
1. canvas + ctx
2. feedbackSystem = new CombatFeedbackSystem(canvas, ctx)
3. combatRenderer = new CombatRenderer(..., feedbackSystem)
4. combatSystem.feedbackSystem = feedbackSystem
5. Render loop : 
   - feedbackSystem.update(deltaTime)
   - combatRenderer.render()
   - feedbackSystem.render(ctx)
```

## 🧪 TESTS À FAIRE

### Test 1 : Attaque Normale
- [ ] Damage number apparaît
- [ ] Screen shake léger
- [ ] Particules de sang (15)
- [ ] Flash blanc sur case

### Test 2 : Attaque Critique
- [ ] "CRITICAL!" affiché
- [ ] Number doré
- [ ] Slow motion activé
- [ ] Étoiles dorées + sang (25)
- [ ] Screen shake FORT
- [ ] Flash doré

### Test 3 : Kill
- [ ] "ELIMINATED!" affiché
- [ ] Shake MASSIF
- [ ] Beaucoup de sang
- [ ] Son spécial (si implémenté)

### Test 4 : Combo
- [ ] Counter monte à 2, 3, 4...
- [ ] "Xx COMBO!" affiché
- [ ] Shake augmente
- [ ] Flash rouge sur combo 3+
- [ ] Reset après 2s

### Test 5 : Performance
- [ ] Pas de lag avec 50+ particules
- [ ] FPS stable (60)
- [ ] Garbage collection OK

## 🚀 PROCHAINES ÉTAPES

### Phase 1 : Polish Actuel
1. Ajouter sons (3-5 fichiers MP3)
2. Tweaker intensités selon feedback
3. Tester sur différents navigateurs
4. Optimiser si lag

### Phase 2 : Étendre
1. Feedback ennemi attaque joueur (différent)
2. Feedback déplacement (trail, dash particles)
3. Feedback compétences (chacune unique)
4. Feedback corruption (distorsion visuelle)

### Phase 3 : Advanced Juice
1. Camera shake directionnel (depuis attaquant)
2. Hit stop (freeze frame 1-2 frames)
3. Attack trails (motion blur)
4. Post-processing (chromatic aberration sur crit)

## 💡 TIPS POUR AJUSTER

### Si trop intense
- Réduire shake_intensity
- Réduire particle_count
- Raccourcir durations

### Si pas assez satisfaisant
- Augmenter shake sur crit
- Ajouter plus de flashes
- Ralentir plus (slowmo 0.2)
- Augmenter taille numbers

### Si lag
- Limiter max particles (pool)
- Réduire particle lifetime
- Simplifier rendering (moins de ctx.save/restore)

## 🎉 RÉSULTAT ATTENDU

Chaque attaque devrait donner une **BOUFFÉE DE DOPAMINE** :

- 👀 **Visuel** : Je VOIS l'impact (numbers, particles, shake)
- 🔊 **Audio** : J'ENTENDS l'impact (sons satisfaisants)
- ⏱️ **Timing** : C'est INSTANTANÉ mais ressenti
- 🔥 **Critiques** : EXPLOSIFS et mémorables
- 📈 **Combos** : Je veux CONTINUER à frapper

**Le joueur doit ressentir** : "WOW, je suis PUISSANT !" 💪

---

**Status** : ✅ IMPLÉMENTÉ, EN ATTENTE DE TEST
