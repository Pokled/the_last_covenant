# 🎮 GODOT + GDSCRIPT — GUIDE POUR DÉBUTANT

**Pour : THE LAST COVENANT**  
**Objectif** : Passer de JavaScript/HTML5 à Godot 4 + GDScript

---

## 📥 INSTALLATION

### 1. Télécharger Godot 4.x
- Site : https://godotengine.org/download
- **Version recommandée** : Godot 4.3 (stable)
- **Édition** : Standard (pas Mono, on fait GDScript)
- Pas d'installation, juste dézipper et lancer

### 2. Premier Lancement
1. Ouvre `Godot_v4.x_win64.exe`
2. Clique sur **"New Project"**
3. Choisis un dossier (ex: `G:\Jeux_Perso\1_THE_LAST_COVENANT\Godot\TheLastCovenant`)
4. Renderer : **Forward+ (pour 2D/3D moderne)**
5. Create & Edit

---

## 🧠 CONCEPTS CLÉS (JAVASCRIPT → GDSCRIPT)

### Structure de Projet

| JavaScript | Godot |
|------------|-------|
| `index.html` | Scene principale (.tscn) |
| `src/` dossier | Ressources (scripts, assets) |
| `main.js` | Script attaché à Node root |
| ES6 Modules | Autoload (Singletons) |

### Hiérarchie

**JavaScript** : DOM (divs, canvas)  
**Godot** : **Scene Tree** (Nodes)

```
JavaScript:
<div id="game">
  <canvas id="combat"></canvas>
  <div id="ui"></div>
</div>

Godot:
Node2D (Root)
├── CombatManager (Node)
├── Canvas (CanvasLayer)
└── UILayer (Control)
```

### Syntaxe Comparée

| Concept | JavaScript | GDScript |
|---------|-----------|----------|
| **Variables** | `let hp = 100;` | `var hp = 100` |
| **Constantes** | `const MAX_HP = 100;` | `const MAX_HP = 100` |
| **Fonctions** | `function attack() {}` | `func attack():` |
| **Classes** | `class Player {}` | `class_name Player extends Node` |
| **Tableau** | `let items = [];` | `var items = []` |
| **Dictionnaire** | `let data = {};` | `var data = {}` |
| **Boucle** | `for (let i = 0; i < 10; i++)` | `for i in range(10):` |
| **Condition** | `if (hp > 0) {}` | `if hp > 0:` |
| **Print** | `console.log("test")` | `print("test")` |

### Types de Variables

```gdscript
# GDScript est typé dynamiquement (comme JS)
var hp = 100           # int
var name = "Hero"      # String
var position = Vector2(10, 20)  # Vector2
var items = []         # Array
var stats = {}         # Dictionary

# Mais tu peux typer explicitement (recommandé)
var hp: int = 100
var name: String = "Hero"
var position: Vector2 = Vector2(10, 20)
```

---

## 🎯 NODES ESSENTIELS POUR TON JEU

### Pour un RPG Tactique 2D Isométrique

| Besoin | Node Godot |
|--------|------------|
| **Personnage** | `CharacterBody2D` |
| **Ennemi** | `CharacterBody2D` |
| **Sprite** | `Sprite2D` |
| **Animation** | `AnimationPlayer` |
| **UI (HUD)** | `CanvasLayer` + `Control` |
| **Boutons** | `Button` |
| **Barre de vie** | `ProgressBar` |
| **Grid Combat** | `TileMap` ou `GridContainer` |
| **Particules** | `GPUParticles2D` |
| **Sons** | `AudioStreamPlayer` |
| **Caméra** | `Camera2D` |
| **Manager (logique)** | `Node` (script seul) |

---

## 📂 ARCHITECTURE PROJET GODOT

### Dossiers Recommandés

```
res://
├── scenes/
│   ├── main.tscn              # Scene principale
│   ├── combat/
│   │   ├── combat_arena.tscn
│   │   └── enemy.tscn
│   ├── ui/
│   │   ├── main_menu.tscn
│   │   └── hud.tscn
│   └── camp/
│       └── camp.tscn
│
├── scripts/
│   ├── managers/
│   │   ├── game_manager.gd
│   │   ├── combat_manager.gd
│   │   └── corruption_manager.gd
│   ├── player/
│   │   └── player.gd
│   └── enemies/
│       └── enemy_base.gd
│
├── assets/
│   ├── sprites/
│   ├── audio/
│   └── fonts/
│
├── data/
│   ├── items.json
│   └── enemies.json
│
└── autoload/
    ├── EventBus.gd            # Ton EventBus JS
    ├── GameState.gd           # GameStateManager JS
    └── AudioManager.gd
```

---

## 🚀 PREMIER SCRIPT GDSCRIPT

### player.gd (Équivalent de ton PlayerStatsSystem.js)

```gdscript
extends CharacterBody2D
class_name Player

# Variables (comme tes stats JS)
var max_hp: int = 100
var hp: int = 100
var corruption: int = 0
var damage: int = 10

# Signaux (comme EventBus JS)
signal health_changed(new_hp, max_hp)
signal corruption_changed(new_corruption)
signal died

# Appelé au démarrage (comme constructor JS)
func _ready():
    print("Player initialized")
    update_health(hp)

# Appelé chaque frame (comme update() JS)
func _process(delta):
    # delta = temps écoulé depuis dernière frame
    pass

# Prendre des dégâts
func take_damage(amount: int):
    hp -= amount
    hp = max(0, hp)  # Limite min 0
    health_changed.emit(hp, max_hp)
    
    if hp <= 0:
        die()

# Soigner
func heal(amount: int):
    hp += amount
    hp = min(hp, max_hp)  # Limite max
    health_changed.emit(hp, max_hp)

# Ajouter corruption
func add_corruption(amount: int):
    corruption += amount
    corruption_changed.emit(corruption)

# Mort
func die():
    print("Player died")
    died.emit()
```

---

## 🎨 CRÉER UNE SCÈNE (TES FICHIERS HTML)

### 1. Combat Arena (combat.html → combat_arena.tscn)

**Dans l'éditeur Godot** :
1. Clique droit dans FileSystem → New Scene
2. Root Node : `Node2D` (renomme en "CombatArena")
3. Ajoute des enfants :
   - `TileMap` (pour la grid 3x4)
   - `Player` (ton CharacterBody2D)
   - `EnemySpawner` (Node avec script)
   - `CanvasLayer` → `HUD` (UI)

4. Attache un script :
   - Clique sur `CombatArena`
   - Clique sur icône "Attach Script"
   - Crée `combat_manager.gd`

**combat_manager.gd** :
```gdscript
extends Node2D

@onready var player = $Player
@onready var hud = $CanvasLayer/HUD

var enemies = []
var current_turn = 0

func _ready():
    spawn_enemies()
    start_combat()

func spawn_enemies():
    # Logique spawn
    pass

func start_combat():
    print("Combat started!")
```

---

## 🔗 AUTOLOAD (TES SINGLETONS JS)

### EventBus.gd (EventBus.js)

1. Crée `res://autoload/EventBus.gd` :

```gdscript
extends Node

# Signaux globaux (comme tes events JS)
signal combat_started
signal combat_ended
signal player_died
signal corruption_changed(amount)
signal item_collected(item_id)

# Fonction helper pour debug
func emit_debug(event_name: String):
    print("[EventBus] Event emitted: ", event_name)
```

2. **Rendre global** :
   - Menu → Project → Project Settings
   - Onglet **Autoload**
   - Ajoute `res://autoload/EventBus.gd`
   - Nom : `EventBus`

3. **Utiliser partout** :
```gdscript
# Dans n'importe quel script
EventBus.combat_started.emit()
EventBus.corruption_changed.emit(10)

# Écouter
func _ready():
    EventBus.player_died.connect(_on_player_died)

func _on_player_died():
    print("Player died!")
```

---

## 💾 SAUVEGARDES (localStorage → Save/Load)

### GameState.gd (GameStateManager.js)

```gdscript
extends Node

var save_path = "user://savegame.save"

var game_data = {
    "hp": 100,
    "corruption": 0,
    "stage": 1,
    "items": []
}

# Sauvegarder
func save_game():
    var file = FileAccess.open(save_path, FileAccess.WRITE)
    if file:
        file.store_var(game_data)
        file.close()
        print("Game saved!")

# Charger
func load_game():
    if FileAccess.file_exists(save_path):
        var file = FileAccess.open(save_path, FileAccess.READ)
        if file:
            game_data = file.get_var()
            file.close()
            print("Game loaded!")
            return true
    return false
```

**Utilisation** :
```gdscript
# Sauvegarder
GameState.game_data["hp"] = 50
GameState.save_game()

# Charger
if GameState.load_game():
    var hp = GameState.game_data["hp"]
```

---

## 🎬 ANIMATIONS & TWEENS

### AnimationPlayer (pour sprites)

1. Ajoute `AnimationPlayer` à ton Player
2. Clique dessus → Animation panel en bas
3. Crée animation "attack" :
   - Bouge sprite, change alpha, ajoute particules
4. Joue depuis script :
```gdscript
$AnimationPlayer.play("attack")
```

### Tweens (pour UI smooth)

**JavaScript** :
```javascript
element.style.transition = 'opacity 0.5s';
element.style.opacity = 0;
```

**GDScript** :
```gdscript
var tween = create_tween()
tween.tween_property($Label, "modulate:a", 0.0, 0.5)
```

---

## 🎨 UI (TES DIVS CSS)

### Control Nodes

| HTML/CSS | Godot Control |
|----------|---------------|
| `<div>` | `Panel` ou `Control` |
| `<button>` | `Button` |
| `<p>` | `Label` |
| `<img>` | `TextureRect` |
| `<input>` | `LineEdit` |
| `<select>` | `OptionButton` |
| Flexbox | `HBoxContainer` / `VBoxContainer` |
| Grid | `GridContainer` |

### Exemple : HUD de combat

```
CanvasLayer (HUD)
├── MarginContainer
│   ├── VBoxContainer
│   │   ├── HBoxContainer (Top)
│   │   │   ├── Label (HP)
│   │   │   └── ProgressBar (HP bar)
│   │   └── HBoxContainer (Actions)
│   │       ├── Button (Attack)
│   │       └── Button (Defend)
```

**Script hud.gd** :
```gdscript
extends CanvasLayer

@onready var hp_label = $MarginContainer/VBox/Top/HPLabel
@onready var hp_bar = $MarginContainer/VBox/Top/HPBar

func _ready():
    EventBus.health_changed.connect(_on_health_changed)

func _on_health_changed(hp, max_hp):
    hp_label.text = "HP: %d/%d" % [hp, max_hp]
    hp_bar.value = (float(hp) / max_hp) * 100
```

---

## 🔊 AUDIO (Web Audio API → AudioStreamPlayer)

### Jouer un son

1. Importe ton `.ogg` ou `.wav` dans `res://assets/audio/`
2. Ajoute `AudioStreamPlayer` à ta scène
3. Drag & drop le fichier audio dans "Stream"

**Script** :
```gdscript
@onready var sfx_attack = $AudioStreamPlayer

func attack():
    sfx_attack.play()
```

### AudioManager (Autoload)

```gdscript
extends Node

var music_volume: float = 0.8
var sfx_volume: float = 1.0

func play_sfx(sfx_name: String):
    var player = AudioStreamPlayer.new()
    add_child(player)
    player.stream = load("res://assets/audio/sfx/" + sfx_name + ".ogg")
    player.volume_db = linear_to_db(sfx_volume)
    player.finished.connect(player.queue_free)
    player.play()

func play_music(music_name: String):
    # Logique musique en boucle
    pass
```

---

## 🎲 THALYS LE DÉ (Exemple Complet)

### dice.tscn

```
Node2D (Dice)
├── Sprite2D (Face du dé)
├── AnimationPlayer (Rotation)
├── GPUParticles2D (Aura violette)
└── Area2D (Zone cliquable)
    └── CollisionShape2D
```

### dice.gd

```gdscript
extends Node2D
class_name ThalysDice

signal dice_clicked
signal pact_offered(pact_data)

@onready var sprite = $Sprite2D
@onready var anim = $AnimationPlayer
@onready var particles = $GPUParticles2D
@onready var area = $Area2D

var current_face: int = 1
var corruption_cost: int = 15

func _ready():
    area.input_event.connect(_on_area_input_event)
    particles.emitting = true
    anim.play("idle_rotation")

func _on_area_input_event(_viewport, event, _shape_idx):
    if event is InputEventMouseButton and event.pressed:
        dice_clicked.emit()
        offer_pact()

func roll() -> int:
    anim.play("roll")
    await anim.animation_finished
    current_face = randi_range(1, 6)
    update_sprite(current_face)
    return current_face

func update_sprite(face: int):
    # Change texture selon face
    sprite.texture = load("res://assets/dice/face_%d.png" % face)

func offer_pact():
    var pact = {
        "name": "Blood Surge",
        "effect": "Damage x2 next attack",
        "corruption": corruption_cost
    }
    pact_offered.emit(pact)
```

---

## 🗺️ MIGRATION PROGRESSIVE

### Phase 1 : Core Loop (1-2 semaines)
1. ✅ Setup Godot + Structure projet
2. ✅ EventBus + GameState (Autoload)
3. ✅ Player + Stats système
4. ✅ Combat Grid (TileMap 3x4)
5. ✅ 1 ennemi fonctionnel

### Phase 2 : Combat (2 semaines)
6. ✅ Tour par tour
7. ✅ IA ennemie basique
8. ✅ HUD combat (HP, Actions)
9. ✅ Animations attaque/dégâts
10. ✅ Victoire/Défaite

### Phase 3 : Corruption (1 semaine)
11. ✅ Thalys le Dé (cliquable)
12. ✅ Système Blood Pact
13. ✅ UI corruption
14. ✅ Effets visuels corruption

### Phase 4 : Donjon (1-2 semaines)
15. ✅ Génération procédurale rooms
16. ✅ Progression étages
17. ✅ Événements (cages, coffres)

### Phase 5 : Camp (1 semaine)
18. ✅ Scene camp
19. ✅ PNJ (Drenvar, Kael, etc.)
20. ✅ Dialogues selon corruption

---

## 💡 TIPS ESSENTIELS

### 1. Nomenclature
- **Scenes** : `snake_case.tscn` (ex: `combat_arena.tscn`)
- **Scripts** : `snake_case.gd` (ex: `player_stats.gd`)
- **Classes** : `PascalCase` (ex: `class_name Player`)
- **Variables** : `snake_case` (ex: `var max_hp`)
- **Constantes** : `SCREAMING_SNAKE_CASE` (ex: `const MAX_DAMAGE = 100`)

### 2. @onready
```gdscript
# Au lieu de chercher noeud dans _ready()
@onready var sprite = $Sprite2D
@onready var hp_bar = $CanvasLayer/HUD/HPBar

# Plus propre que :
var sprite
func _ready():
    sprite = $Sprite2D
```

### 3. Type Hinting
```gdscript
# Toujours typer pour éviter erreurs
func take_damage(amount: int) -> void:
    hp -= amount

func get_damage() -> int:
    return damage
```

### 4. Signaux vs Fonctions
```gdscript
# ❌ Couplage fort
player.take_damage(10)

# ✅ Découplé
signal damage_taken(amount)
# Ailleurs
EventBus.damage_taken.emit(10)
```

### 5. _process vs _physics_process
```gdscript
# _process(delta) : chaque frame (variable)
func _process(delta):
    update_animations()

# _physics_process(delta) : 60 FPS fixe (physique)
func _physics_process(delta):
    move_and_slide()
```

---

## 📚 RESSOURCES

### Documentation
- **Godot Docs** : https://docs.godotengine.org/en/stable/
- **GDScript Basics** : https://docs.godotengine.org/en/stable/tutorials/scripting/gdscript/gdscript_basics.html

### Tutoriels Recommandés
- **Heartbeast (YouTube)** : Action RPG series
- **Brackeys (Godot)** : Basics & UI
- **GDQuest** : Formations Godot 4

### Discord/Forums
- Godot Discord : https://discord.gg/godotengine
- Reddit : r/godot

---

## 🎯 TON PREMIER OBJECTIF

**Reproduire ton test-combat.html en Godot** :
1. Scene `CombatArena`
2. Grid 3x4 (TileMap ou Sprite2D grid)
3. Player (CharacterBody2D + script)
4. 1 Enemy (même structure)
5. Système tour par tour (script CombatManager)
6. HUD avec HP bars

**Temps estimé** : 1-2 jours si tu suis ce guide.

---

*"GDScript, c'est du Python avec des super-pouvoirs pour jeux."* 🚀


🎮 Commencer avec les bases de Godot (fortement recommandé)
📘 Tutos gratuits et structurés (bases + progression)

**Tutoriels officiels ** – Liste de ressources recommandées par la doc officielle de Godot (dont GDQuest, très apprécié pour les débutants). 
Godot Engine documentation

Chemin d’apprentissage étape-par-étape : Interface → GDScript → ton premier projet 2D/3D (par GameEngineHub). 
GameEngineHub

Tutoriel “Pas à pas” (français) — très bon pour comprendre les nœuds, scènes, scripting, signaux et construire ton premier jeu simple. 
Godot Engine documentation

👉 Ces ressources sont indispensables pour bien comprendre les bases avant d’aller vers un RPG complet.

🎥 Tutoriels vidéo pour débutants
🧰 Tutoriels courts & faciles
https://youtu.be/-4jEXTwTsVI
Très bon point de départ pour comprendre les fondamentaux d’un RPG en perspective haut-dessus.

Couverture : collisions, mouvements, TileMaps, caméra, contrôles. 
YouTube

🧠 Tutoriels longs & approfondis
https://youtu.be/ouqgx1qKSdY

Très complet, idéal si tu veux aller vers un RPG 3D plus complexe.

Montre comment faire : joueur, IA, inventaire, GUI, combats, VFX, etc. 
YouTube

📚 Cours structurés (payants mais bien notés)

Créer un RPG en 2D avec Godot 4 (Udemy, en français) – note 4,5/5, pensé pour les débutants en RPG. 
Udemy

Making a Top Down 2D Pixel Art RPG (Udemy, en anglais) – bon pour apprendre un RPG classique top down. 
Udemy

💡 Si tu veux un apprentissage pas à pas et structuré, ces cours sont souvent mieux notés que les tutos dispersés.

📦 Projets pratiques & exemples

godot-simple-rpg (GitHub) – un projet example basé sur une série de tuto RPG fondée sur Godot 4. Bon pour apprendre en lisant du code réel. 
GitHub

📺 Chaînes YouTube utiles pour continuer

Voici quelques chaînes recommandées par la communauté — excellentes pour progresser progressivement :

📌 Chaînes avec tutoriels très structurés pour débutants

GDQuest – tutos détaillés, souvent mis en avant sur la doc Godot. 
Godot Engine documentation

HeartBeast – très bon pour les RPG, pixel art et systèmes de combat. 
Medium

KidsCanCode – parfait pour apprendre GDScript et les bases. 
Medium

🧠 Conseil de progression (pédagogique)

Bases absolues : Interface + GDScript (tuto officiel / GDQuest interactif). 
Godot Engine Francophone

Projet simple 2D : Top-down RPG rapide (ex. vidéo 20 min). 
YouTube

Approfondir fonctionnalité RPG : inventaire, combat, états, dialogues.

Passer au 3D si tu veux faire un jeu comme BG3 (tuto freeCodeCamp ou GDQuest 3D).