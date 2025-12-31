# 🩸 Plan d'Intégration : Blood Pact + Combat

## 1. Bouton "Fin du Tour" → Sphère 3D Style BG3

### Avant (actuel)
```
[🎲 LANCER LE DÉ]  [🛑 FIN DU TOUR]
```

### Après (BG3-style)
```
[🎲 3D Dé Tournant]    [Actions/Items Center]    [⏭️ Sphère "Fin du Tour"]
                              ↓
                    Cercle 3D avec gradient
                    Texte "FIN DU TOUR" centré
                    Effet hover: glow + scale
```

**Code à créer** : `CombatEndTurnButton.js`
- Demi-sphère CSS 3D avec `radial-gradient`
- Animation hover: `box-shadow` glow
- Texte avec `text-shadow` pour profondeur

---

## 2. Dé → Entité Vivante et Interactive

### Actuellement
- Dé cliquable dans l'action bar
- Pas d'âme, pas de présence

### Objectif : Rendre le Dé INOUBLIABLE

#### A. Présence Visuelle Permanente
1. **Dé 3D flottant** (coin supérieur droit)
   - Comme dans `blood-pact-system.js` ligne 720-814
   - Rotation continue + glow pulsant
   - Change de couleur selon corruption :
     - 0-25% : Or (neutre)
     - 25-50% : Orange (murmure)
     - 50-75% : Rouge (dette)
     - 75-100% : Noir/Violet (profanation)

2. **Animations réactives**
   - Quand survolé : **s'agrandit + regarde le joueur**
   - Quand cliqué : **secoue + lance des particules**
   - Quand corruption monte : **craquelures apparaissent**

#### B. Interactions Narratives

**1. Bulles de dialogue aléatoires** (toutes les 30s en combat)
```javascript
const diceIdleDialogues = [
  "Tu hésites ? Comme c'est... humain.",
  "Utilise-moi. Tu sais que tu veux.",
  "Je pourrais t'aider... si tu oses.",
  "Ce combat est ennuyeux. Pimente-le.",
  "Les faibles prient. Les forts signent.",
];
```

**2. Commentaires contextuels**
- Si joueur < 30% HP : *"Bientôt mort ? Dommage. On s'amusait bien."*
- Si joueur tue un boss : *"Impressionnant ! Mais c'était VRAIMENT toi ?"*
- Si joueur refuse de lancer : *"Tu refuses mon aide ? Intéressant..."*

**3. Proposition de pacte dynamique**
- Quand joueur < 20% HP : **Offre automatique "Pacte de Survie"**
  ```
  "Tu meurs. Je peux t'aider. Signe... ou crève."
  → Clic sur dé = Modal Blood Pact
  ```

#### C. Système de Mémoire du Dé

**Le Dé SE SOUVIENT** (comme dans `blood-pact-system.js`)
```javascript
diceMemory: {
  pactsCount: 0,
  forcedSixes: 0,
  playerRefusals: 0,
  lastInteraction: Date.now()
}
```

**Dialogues adaptatifs** :
- 0 pactes : *"Premier contact ? Charmant."*
- 3+ pactes : *"Tu reviens toujours. Adorable."*
- Refusé 2 fois : *"Tu me résistes ? Ça ne durera pas."*

---

## 3. Intégration du Blood Pact dans le Combat

### Déclencheurs de Pacte

#### Auto (proposé par le jeu)
1. **HP < 20%** → "Pacte de Survie" (+50% HP, +10% corruption)
2. **Combat difficile (>3 tours)** → "Pacte du Momentum"
3. **Boss détecté** → "Bénédiction Profanée"

#### Manuel (clic sur dé)
- **Menu radial de pactes** apparaît autour du dé
- Player choisit le type
- Modal Blood Pact s'ouvre

### Workflow
```
1. Player clique sur Dé 3D
   ↓
2. Menu radial des pactes (5 options)
   ↓
3. Player sélectionne un pacte
   ↓
4. Modal Blood Pact (signature)
   ↓
5. Effets appliqués immédiatement en combat
   ↓
6. Dé change d'apparence (corruption++)
```

---

## 4. Amélioration UI "Fin du Tour"

### Design BG3-Style

```html
<div class="end-turn-sphere">
  <div class="sphere-inner">
    <div class="sphere-glow"></div>
    <span class="turn-text">FIN DU TOUR</span>
  </div>
</div>
```

```css
.end-turn-sphere {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(212, 175, 55, 0.9),
    rgba(180, 140, 40, 0.7),
    rgba(120, 90, 30, 0.5)
  );
  box-shadow: 
    inset -5px -5px 15px rgba(0,0,0,0.5),
    inset 5px 5px 10px rgba(255,255,255,0.3),
    0 10px 30px rgba(0,0,0,0.6);
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.end-turn-sphere:hover {
  transform: scale(1.1);
  box-shadow: 
    inset -5px -5px 15px rgba(0,0,0,0.5),
    inset 5px 5px 10px rgba(255,255,255,0.3),
    0 15px 40px rgba(212, 175, 55, 0.8);
}

.turn-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Cinzel', serif;
  font-size: 0.9em;
  font-weight: bold;
  color: #2a1810;
  text-shadow: 1px 1px 2px rgba(255,255,255,0.5);
  text-align: center;
  line-height: 1.2;
  pointer-events: none;
}
```

---

## 5. Fichiers à Créer/Modifier

### Créer
1. **`src/systems/BloodPactSystem.js`**
   - Copier de `doc/Archives/js/blood-pact-system.js`
   - Adapter pour le combat

2. **`src/systems/DicePersonality.js`**
   - Dialogues aléatoires
   - Mémoire du joueur
   - Animations réactives

3. **`src/systems/CombatPactTriggers.js`**
   - Détection HP bas
   - Proposition auto de pactes
   - Menu radial

### Modifier
1. **`src/systems/CombatActionBar.js`**
   - Remplacer bouton texte "FIN DU TOUR" par sphère 3D
   - Intégrer Dé 3D permanent (coin droit)
   - Menu radial pactes au clic

2. **`src/systems/CombatRenderer.js`**
   - Ajouter zone pour Dé 3D flottant
   - Bulle dialogue au-dessus du dé

---

## 6. Checklist d'Implémentation

### Phase 1 : Fin du Tour (Sphère 3D)
- [ ] Créer `CombatEndTurnButton.js`
- [ ] Ajouter gradients + shadow 3D
- [ ] Animation hover (scale + glow)
- [ ] Remplacer dans `CombatActionBar.js`

### Phase 2 : Dé Vivant
- [ ] Créer `DicePersonality.js`
- [ ] Dé 3D flottant permanent (copier de blood-pact)
- [ ] Dialogues aléatoires (idle)
- [ ] Animations réactives (hover, click)
- [ ] Système de mémoire

### Phase 3 : Blood Pact Integration
- [ ] Copier `BloodPactSystem.js`
- [ ] Adapter pour combat (pas modal test)
- [ ] Créer déclencheurs auto (HP bas, boss)
- [ ] Menu radial des pactes
- [ ] Test signature en combat

### Phase 4 : Polish
- [ ] Sons pour chaque interaction dé
- [ ] Particules quand pacte signé
- [ ] Changement visuel dé selon corruption
- [ ] Dialogues contextuels (mort, victoire)

---

## 7. Exemple de Code : Dé Vivant

```javascript
class DicePersonality {
  constructor(corruptionSystem, combatSystem) {
    this.corruption = corruptionSystem;
    this.combat = combatSystem;
    
    this.memory = {
      pactsCount: 0,
      forcedSixes: 0,
      refusals: 0,
      lastDialogue: Date.now()
    };
    
    this.dialogues = {
      idle: [
        "Tu hésites ? Comme c'est... humain.",
        "Utilise-moi. Tu sais que tu veux.",
        "Je pourrais t'aider... si tu oses."
      ],
      lowHP: [
        "Bientôt mort ? Dommage. On s'amusait bien.",
        "Signe. Maintenant. Ou crève."
      ],
      victory: [
        "Victoire ? VRAIMENT toi ? Ou... moi ?",
        "Facile avec mon aide, non ?"
      ]
    };
    
    this.startIdleDialogues();
    this.createFloatingDice();
  }
  
  startIdleDialogues() {
    setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance toutes les 30s
        this.speak(this.getRandomDialogue('idle'));
      }
    }, 30000);
  }
  
  speak(text, duration = 3000) {
    // Créer bulle dialogue au-dessus du dé
    const bubble = document.createElement('div');
    bubble.className = 'dice-speech-bubble';
    bubble.textContent = text;
    document.body.appendChild(bubble);
    
    setTimeout(() => bubble.remove(), duration);
  }
  
  createFloatingDice() {
    // Code du dé 3D (copié de blood-pact ligne 720-814)
    // ...
  }
  
  onPactSigned(pactType) {
    this.memory.pactsCount++;
    this.speak(this.getPostPactDialogue(), 2500);
  }
  
  getRandomDialogue(category) {
    const list = this.dialogues[category];
    return list[Math.floor(Math.random() * list.length)];
  }
}
```

---

## Prochaines Étapes

1. Veux-tu que je commence par la **Sphère "Fin du Tour"** ?
2. Ou préfères-tu directement le **Dé Vivant 3D** ?
3. Ou les deux en parallèle ?

Dis-moi et je code ! 🎲🩸
