# Layout BG3-Style Action Bar

## Structure actuelle
- ❌ Tout dans un seul canvas (actionBarCanvas)
- ❌ Thalys dépendant de l'action bar (conflit z-index/overflow)
- ❌ Déformation scale pour agrandir

## Nouveau layout (comme BG3)
```
[THALYS 140x140]  [ACTION BAR 600x90]  [END TURN 140x140]
    (gauche)           (centre)              (droite)
```

### Disposition
- **Thalys** : `position: fixed; bottom: 20px; left: calc(50% - 370px);`
- **Action Bar** : `position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);`
- **End Turn** : `position: fixed; bottom: 20px; right: calc(50% - 370px);`

### Avantages
✅ Indépendants (pas de conflit)
✅ Pas de scale/déformation  
✅ Hover/clic propres
✅ Z-index simples

### TODO
1. Modifier `CombatActionBar.render()` pour layout 3 zones
2. Redessiner action bar plus étroite (600px au lieu de fullwidth)
3. Positionner Thalys et EndTurn hors de l'action bar
