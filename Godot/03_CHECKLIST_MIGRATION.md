# 📦 CHECKLIST MIGRATION COMPLÈTE

**Projet** : THE LAST COVENANT  
**De** : JavaScript/HTML5 → **Vers** : Godot 4 + GDScript

---

## ✅ PHASE 1 : SETUP (Jour 1)

### Installation
- [ ] Télécharger Godot 4.3 (https://godotengine.org/download)
- [ ] Créer nouveau projet `TheLastCovenant`
- [ ] Renderer : Forward+ (2D/3D moderne)
- [ ] Créer structure de dossiers :
  ```
  res://
  ├── scenes/
  ├── scripts/
  ├── assets/
  ├── data/
  └── autoload/
  ```

### Autoloads (Singletons)
- [ ] Créer `autoload/EventBus.gd`
- [ ] Créer `autoload/GameState.gd`
- [ ] Créer `autoload/AudioManager.gd`
- [ ] Configurer Project Settings → Autoload

### Assets Import
- [ ] Importer sprites existants dans `assets/sprites/`
- [ ] Importer audio dans `assets/audio/`
- [ ] Importer fonts dans `assets/fonts/`

---

## ✅ PHASE 2 : CORE ENTITIES (Jours 2-3)

### Player
- [ ] Créer scene `scenes/entities/player.tscn`
  - [ ] Root : `CharacterBody2D`
  - [ ] Child : `Sprite2D`
  - [ ] Child : `AnimationPlayer`
  - [ ] Child : `CollisionShape2D`
- [ ] Script `scripts/player/Player.gd`
  - [ ] Stats (hp, damage, defense)
  - [ ] Signaux (died, health_changed)
  - [ ] Fonctions (take_damage, heal, die)
- [ ] Tester dans scene test

### Enemy
- [ ] Créer scene `scenes/entities/enemy.tscn`
  - [ ] Root : `CharacterBody2D`
  - [ ] Child : `Sprite2D`
  - [ ] Child : `AnimationPlayer`
- [ ] Script `scripts/enemies/Enemy.gd`
  - [ ] Stats (hp, damage, type)
  - [ ] IA basique (se déplacer vers player)
  - [ ] Signaux (died, attacked)
- [ ] Tester 1 player vs 1 enemy

---

## ✅ PHASE 3 : COMBAT SYSTEM (Jours 4-7)

### Combat Manager
- [ ] Créer scene `scenes/combat/combat_arena.tscn`
  - [ ] Root : `Node2D` (CombatArena)
  - [ ] Child : `TileMap` (grid visuelle)
  - [ ] Child : `Player`
  - [ ] Child : `Node2D` (EnemySpawner)
  - [ ] Child : `CanvasLayer` (HUD)
- [ ] Script `scripts/managers/CombatManager.gd`
  - [ ] Grid 3x4 (Array 2D)
  - [ ] Fonctions placement (place_entity, move_entity)
  - [ ] Système de tours (player turn, enemy turn)
  - [ ] Détection victoire/défaite

### Combat Grid
- [ ] TileMap 3 lignes x 4 colonnes
- [ ] Tileset avec cases tactiques
- [ ] Highlight cases cliquables
- [ ] Visual feedback déplacement

### Turn System
- [ ] Enum TurnState (PLAYER, ENEMY, TRANSITION, VICTORY, DEFEAT)
- [ ] 2 actions par tour
- [ ] Compteur d'actions UI
- [ ] Bouton "End Turn"

### Enemy AI
- [ ] Déplacement intelligent vers player
- [ ] Attaque si adjacent
- [ ] Utilise compétences si disponibles
- [ ] Randomize behavior (variété)

### Combat Events
- [ ] EventBus.combat_started
- [ ] EventBus.combat_ended
- [ ] EventBus.combat_turn_changed
- [ ] EventBus.combat_action_used
- [ ] EventBus.combat_victory
- [ ] EventBus.combat_defeat

---

## ✅ PHASE 4 : HUD COMBAT (Jours 5-6)

### Portraits Top (BG3 Style)
- [ ] Scene `scenes/ui/combat_portraits.tscn`
  - [ ] HBoxContainer (player + enemies)
  - [ ] Portrait template (Panel + TextureRect + ProgressBar)
- [ ] Script affichage HP bars
- [ ] Zoom sur entité active (scale 1.1x)
- [ ] Grayscale si mort

### Action Bar
- [ ] Scene `scenes/ui/action_bar.tscn`
  - [ ] HBoxContainer (actions)
  - [ ] Slots : Attack, Skill1, Skill2, Item
- [ ] Thalys le Dé (cercle indépendant)
- [ ] Bouton "End Turn" (cercle 3D)
- [ ] Points d'action (dots au-dessus)

### Combat Log
- [ ] Panel à gauche, centré verticalement
- [ ] RichTextLabel avec couleurs
- [ ] Scrollbar personnalisée
- [ ] Types : Player (bleu), Enemy (rouge), Dice (or), System (beige)

### Stats Panel (Player)
- [ ] Panel coin supérieur gauche
- [ ] HP / Max HP
- [ ] Corruption %
- [ ] Damage / Defense

---

## ✅ PHASE 5 : CORRUPTION SYSTEM (Jours 8-9)

### Corruption Manager
- [ ] Script `scripts/managers/CorruptionManager.gd`
  - [ ] var corruption: int = 0
  - [ ] add_corruption(amount)
  - [ ] check_thresholds()
  - [ ] dice_memory: Array[int]
- [ ] Seuils (30%, 50%, 70%, 90%, 100%)
- [ ] Events à chaque seuil

### Thalys le Dé
- [ ] Scene `scenes/entities/thalys_dice.tscn`
  - [ ] Root : `Node2D`
  - [ ] Child : `Sprite2D` (face dé)
  - [ ] Child : `AnimationPlayer` (rotation 3D)
  - [ ] Child : `GPUParticles2D` (aura violette)
  - [ ] Child : `Area2D` (zone cliquable)
- [ ] Script `scripts/dice/ThalysDice.gd`
  - [ ] roll() → int (1-6, 5% chance face 7)
  - [ ] offer_pact()
  - [ ] Animations hover

### Blood Pact System
- [ ] Scene `scenes/ui/blood_pact_modal.tscn`
  - [ ] Panel modal épique
  - [ ] Liste pactes disponibles
  - [ ] Description + Coût corruption
  - [ ] Boutons Accept / Refuse
- [ ] Script `scripts/systems/BloodPactSystem.gd`
  - [ ] Pactes : Blood Surge, Dark Heal, Void Shield, etc.
  - [ ] Apply effects
  - [ ] Track pacts made

### Visual Corruption
- [ ] Shader corruption (veines violettes)
- [ ] Modulate player sprite selon corruption
- [ ] Aura sombre si > 70%

---

## ✅ PHASE 6 : DUNGEON SYSTEM (Jours 10-12)

### Dungeon Generator
- [ ] Script `scripts/dungeon/DungeonGenerator.gd`
  - [ ] Génération procédurale rooms (BSP ou Grid)
  - [ ] Types rooms : Combat, Event, Treasure, Boss
  - [ ] Connexions entre rooms
- [ ] Scene room template

### Progression
- [ ] Scene `scenes/dungeon/dungeon_map.tscn`
  - [ ] Affiche rooms disponibles
  - [ ] Cliquables pour avancer
- [ ] Stage system (1-10)
- [ ] Difficulté croissante

### Events
- [ ] Cages (dilemmes moraux)
  - [ ] Scene `scenes/events/cage_dilemma.tscn`
  - [ ] 2 prisonniers, 1 choix
  - [ ] Conséquences corruption + alliés
- [ ] Coffres (loot)
- [ ] Sanctuaires (heal + corruption réduite)

---

## ✅ PHASE 7 : CAMP SYSTEM (Jours 13-14)

### Camp Scene
- [ ] Scene `scenes/camp/camp.tscn`
  - [ ] TileMap (background camp)
  - [ ] NPCs (Node2D container)
  - [ ] Player (CharacterBody2D)
  - [ ] Camera2D
  - [ ] CanvasLayer (UI)

### NPCs
- [ ] **Drenvar** (Forgeron)
  - [ ] Scene + script
  - [ ] Shop équipements
  - [ ] Dialogues selon corruption
- [ ] **Kael** (Coureur)
  - [ ] Shop potions
  - [ ] Quête sœur disparue
- [ ] **Corvus** (Marchand Ombres)
  - [ ] Shop objets rares
  - [ ] Prix cachés
- [ ] **Moira** (Prêtresse)
  - [ ] Bénédictions (buffs)
  - [ ] Dialogues foi morte
- [ ] **Le Jardinier**
  - [ ] Réduit corruption (-10%)
  - [ ] Muet, inquiétant

### Dialogue System
- [ ] Scene `scenes/ui/dialogue_box.tscn`
- [ ] Script `scripts/systems/DialogueSystem.gd`
- [ ] Format JSON pour dialogues
- [ ] Réactions selon corruption

---

## ✅ PHASE 8 : ANIMATIONS & VFX (Jours 15-16)

### Animations Combat
- [ ] Attack animation (swing, slash)
- [ ] Damage flash (red tint)
- [ ] Death animation (fade + particles)
- [ ] Hit stun (freeze frame)

### Particles
- [ ] Blood splatter (mort ennemi)
- [ ] Aura corruption (player)
- [ ] Thalys aura (violet pulsant)
- [ ] Explosion dégâts

### Screen Effects
- [ ] Screen shake (coups puissants)
- [ ] Slow motion (moments critiques)
- [ ] Vignette (low HP)

---

## ✅ PHASE 9 : AUDIO (Jours 17-18)

### Musiques
- [ ] Menu principal
- [ ] Camp (ambiance calme)
- [ ] Combat (tension)
- [ ] Boss fight (épique)

### SFX
- [ ] Sword hit
- [ ] Spell cast
- [ ] Dice roll
- [ ] Blood pact accept
- [ ] Player death
- [ ] Victory fanfare

### AudioManager
- [ ] Music player (loop)
- [ ] SFX pool (multi-shot)
- [ ] Volume controls (music / sfx)
- [ ] Crossfade transitions

---

## ✅ PHASE 10 : UI SCREENS (Jours 19-20)

### Title Screen
- [ ] Scene `scenes/ui/title_screen.tscn`
- [ ] Logo + background
- [ ] Boutons : New Game, Continue, Settings, Quit

### Main Menu
- [ ] Scene `scenes/ui/main_menu.tscn`
- [ ] New Game → Character Creation
- [ ] Continue → Load save
- [ ] Settings → Options

### Character Creation
- [ ] Scene `scenes/ui/character_creation.tscn`
- [ ] Choix classe (5 classes)
- [ ] Stats preview
- [ ] Start button

### Game Over / Victory
- [ ] Scene game over (stats run)
- [ ] Scene victory (ending selon corruption)

---

## ✅ PHASE 11 : DATA & BALANCE (Jour 21)

### Items Database
- [ ] Fichier `data/items.json`
- [ ] Script `scripts/data/ItemDatabase.gd`
- [ ] Types : Weapons, Armor, Consumables, Artifacts

### Enemies Database
- [ ] Fichier `data/enemies.json`
- [ ] 10 ennemis standards + 3 boss
- [ ] Stats équilibrées

### Classes Database
- [ ] Fichier `data/classes.json`
- [ ] 5 classes (Guerrier, Mage, Voleur, Prêtre, Berserker)
- [ ] Stats de base + compétences uniques

---

## ✅ PHASE 12 : POLISH (Jours 22-25)

### Transitions
- [ ] Fade in/out entre scènes
- [ ] Loading screen

### Feedback
- [ ] Hover effects (UI)
- [ ] Click feedback (sound + visual)
- [ ] Tutorial tooltips

### Settings
- [ ] Volume sliders (music, sfx)
- [ ] Résolution
- [ ] Fullscreen toggle
- [ ] Language (si multi-langue)

### Optimisation
- [ ] Object pooling (ennemis, projectiles)
- [ ] Lazy loading (assets lourds)
- [ ] FPS monitoring

---

## ✅ PHASE 13 : TESTING (Jours 26-28)

### Gameplay Testing
- [ ] 3 runs complètes
- [ ] Tester toutes classes
- [ ] Tester tous pactes
- [ ] Tester toutes fins

### Bug Fixing
- [ ] Combat bugs (tours infinis, stuck)
- [ ] UI bugs (overlaps, z-index)
- [ ] Save/Load bugs
- [ ] Audio bugs (clicks, pops)

### Balance
- [ ] Ajuster difficultés ennemis
- [ ] Ajuster coûts corruption
- [ ] Ajuster drop rates

---

## ✅ PHASE 14 : RELEASE (Jour 29-30)

### Build
- [ ] Export Windows (64-bit)
- [ ] Export Linux (optionnel)
- [ ] Export Web (itch.io)
- [ ] Tester builds

### Documentation
- [ ] README.md
- [ ] CHANGELOG.md
- [ ] Controls guide

### Publication
- [ ] Upload itch.io
- [ ] Page store (screenshots, description)
- [ ] Trailer (optionnel)

---

## 📊 RÉSUMÉ TIMING

| Phase | Durée | Tâches Clés |
|-------|-------|-------------|
| 1. Setup | 1 jour | Godot + Structure |
| 2. Entities | 2 jours | Player + Enemy |
| 3. Combat | 4 jours | Grid + Tours + IA |
| 4. HUD | 2 jours | Portraits + ActionBar |
| 5. Corruption | 2 jours | Thalys + Pactes |
| 6. Dungeon | 3 jours | Génération + Events |
| 7. Camp | 2 jours | NPCs + Dialogues |
| 8. Animations | 2 jours | VFX + Particles |
| 9. Audio | 2 jours | Musique + SFX |
| 10. UI | 2 jours | Screens + Menus |
| 11. Data | 1 jour | JSON databases |
| 12. Polish | 4 jours | Transitions + Settings |
| 13. Testing | 3 jours | Bugs + Balance |
| 14. Release | 2 jours | Build + Publication |
| **TOTAL** | **30 jours** | **1 mois intensif** |

---

## 🎯 PRIORITÉS

### Must-Have (MVP)
1. ✅ Combat tactique 3x4
2. ✅ Thalys + Blood Pacts
3. ✅ Système corruption
4. ✅ 5 ennemis + 1 boss
5. ✅ Camp avec 3 NPCs
6. ✅ Save/Load

### Nice-to-Have
- Animations poussées
- Particules avancées
- Dialogues riches
- Multi-endings

### Future Updates
- Classes additionnelles
- Plus d'ennemis
- Système craft
- Meta-progression (village nomade)

---

*"Un jeu se fait par petits blocs. Pas tout d'un coup."* 🧱
