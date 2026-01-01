# 🏗️ ARCHITECTURE MIGRATION — JS → GODOT

**Projet** : THE LAST COVENANT  
**Objectif** : Mapper ton architecture JavaScript actuelle vers Godot 4 + GDScript

---

## 📊 VUE D'ENSEMBLE

### Systèmes Actuels (JavaScript)
```
src/
├── core/
│   ├── EventBus.js           → Autoload/EventBus.gd
│   ├── GameStateManager.js   → Autoload/GameState.gd
│   └── SceneManager.js       → get_tree().change_scene_to_file()
│
├── systems/
│   ├── CombatSystem.js       → scripts/managers/CombatManager.gd
│   ├── CorruptionSystem.js   → scripts/managers/CorruptionManager.gd
│   ├── PlayerStatsSystem.js  → scripts/player/Player.gd
│   ├── DungeonGenerator.js   → scripts/dungeon/DungeonGenerator.gd
│   ├── CombatRenderer.js     → Intégré dans scenes (pas de Canvas)
│   └── AudioManager.js       → Autoload/AudioManager.gd
│
├── ui/scenes/
│   ├── TitleScene.js         → scenes/ui/title_screen.tscn
│   ├── MainMenuScene.js      → scenes/ui/main_menu.tscn
│   ├── CampScene.js          → scenes/camp/camp.tscn
│   └── GameScene.js          → scenes/game/game_scene.tscn
│
└── data/
    └── ItemDatabase.js       → data/items.json + ItemDatabase.gd
```

---

## 🔄 MAPPING DÉTAILLÉ

### 1. CORE SYSTEMS

#### EventBus.js → EventBus.gd (Autoload)

**JavaScript (Before)** :
```javascript
// EventBus.js
class EventBus {
  constructor() {
    this.listeners = {};
  }
  
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }
  
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }
}
export default new EventBus();
```

**GDScript (After)** :
```gdscript
# autoload/EventBus.gd
extends Node

# Signaux globaux (liste complète de tes events)
signal combat_started(enemies)
signal combat_ended(result)
signal combat_turn_changed(entity)
signal combat_action_used(action_type, target)
signal combat_victory
signal combat_defeat

signal player_died
signal player_damaged(amount)
signal player_healed(amount)
signal player_stats_changed(stats)

signal corruption_changed(new_value, delta)
signal corruption_threshold_reached(threshold)

signal dice_rolled(face, stage)
signal blood_pact_offered(pact_type)
signal blood_pact_accepted(pact_type)

signal item_collected(item_id)
signal item_used(item_id)

signal dungeon_room_entered(room_type)
signal dungeon_stage_cleared(stage)

signal scene_transition_requested(scene_name)

# Fonction helper pour debug
func log_event(event_name: String, data = null):
    if data:
        print("[EventBus] %s | Data: %s" % [event_name, str(data)])
    else:
        print("[EventBus] %s" % event_name)
```

**Utilisation** :
```gdscript
# Émettre
EventBus.combat_started.emit(enemies_array)

# Écouter
func _ready():
    EventBus.combat_started.connect(_on_combat_started)

func _on_combat_started(enemies):
    print("Combat started with %d enemies" % enemies.size())
```

---

#### GameStateManager.js → GameState.gd (Autoload)

**JavaScript (Before)** :
```javascript
class GameStateManager {
  constructor() {
    this.state = {
      player: {
        hp: 100,
        corruption: 0,
        stage: 1
      }
    };
  }
  
  getState() {
    return JSON.parse(JSON.stringify(this.state));
  }
  
  setState(newState) {
    this.state = { ...this.state, ...newState };
  }
}
```

**GDScript (After)** :
```gdscript
# autoload/GameState.gd
extends Node

# État global du jeu (immutable pattern)
var game_data = {
    "player": {
        "hp": 100,
        "max_hp": 100,
        "corruption": 0,
        "damage": 10,
        "defense": 5,
        "stage": 1,
        "inventory": [],
        "equipped": {}
    },
    "run": {
        "rooms_cleared": 0,
        "enemies_killed": 0,
        "pacts_made": 0,
        "deaths": 0
    },
    "meta": {
        "total_runs": 0,
        "highest_stage": 0,
        "endings_unlocked": []
    }
}

# Path de sauvegarde
const SAVE_PATH = "user://savegame.save"

# Getters (lecture seule)
func get_player_data() -> Dictionary:
    return game_data["player"].duplicate(true)

func get_player_stat(stat_name: String):
    return game_data["player"].get(stat_name, null)

# Setters (avec validation)
func set_player_stat(stat_name: String, value):
    if game_data["player"].has(stat_name):
        game_data["player"][stat_name] = value
        EventBus.player_stats_changed.emit(game_data["player"])
    else:
        push_error("Invalid stat: " + stat_name)

func modify_player_stat(stat_name: String, delta):
    if game_data["player"].has(stat_name):
        game_data["player"][stat_name] += delta
        EventBus.player_stats_changed.emit(game_data["player"])

# Sauvegarde
func save_game():
    var file = FileAccess.open(SAVE_PATH, FileAccess.WRITE)
    if file:
        file.store_var(game_data)
        file.close()
        print("[GameState] Game saved")
        return true
    return false

func load_game() -> bool:
    if FileAccess.file_exists(SAVE_PATH):
        var file = FileAccess.open(SAVE_PATH, FileAccess.READ)
        if file:
            game_data = file.get_var()
            file.close()
            print("[GameState] Game loaded")
            return true
    return false

# Reset pour nouvelle run
func reset_run():
    game_data["player"]["hp"] = game_data["player"]["max_hp"]
    game_data["player"]["corruption"] = 0
    game_data["player"]["stage"] = 1
    game_data["run"]["rooms_cleared"] = 0
    game_data["run"]["enemies_killed"] = 0
    print("[GameState] Run reset")
```

---

#### SceneManager.js → Scene Transitions

**JavaScript (Before)** :
```javascript
class SceneManager {
  changeScene(sceneName) {
    // Logique transition
    this.loadScene(sceneName);
  }
}
```

**GDScript (After)** :
```gdscript
# Directement avec Godot
get_tree().change_scene_to_file("res://scenes/combat/combat_arena.tscn")

# Ou avec transition
func change_scene_with_fade(scene_path: String):
    var fade = ColorRect.new()
    fade.color = Color.BLACK
    fade.modulate.a = 0
    get_tree().root.add_child(fade)
    
    var tween = create_tween()
    tween.tween_property(fade, "modulate:a", 1.0, 0.5)
    await tween.finished
    
    get_tree().change_scene_to_file(scene_path)
    
    tween = create_tween()
    tween.tween_property(fade, "modulate:a", 0.0, 0.5)
    await tween.finished
    fade.queue_free()
```

---

### 2. SYSTEMS (GAMEPLAY)

#### CombatSystem.js → CombatManager.gd

**JavaScript Structure** :
```javascript
class CombatSystem {
  constructor() {
    this.grid = Array(3).fill(null).map(() => Array(4).fill(null));
    this.player = { x: 0, y: 1, hp: 100 };
    this.enemies = [];
    this.turn = 'player';
  }
  
  moveEntity(entity, dx, dy) { }
  attackTarget(attacker, target) { }
  endTurn() { }
}
```

**GDScript Structure** :
```gdscript
# scripts/managers/CombatManager.gd
extends Node
class_name CombatManager

# Grid (3 lignes x 4 colonnes)
const GRID_WIDTH = 4
const GRID_HEIGHT = 3
var grid = []  # Array 2D d'entités

# Entités
var player: Player
var enemies: Array[Enemy] = []

# État combat
enum TurnState { PLAYER, ENEMY, TRANSITION, VICTORY, DEFEAT }
var current_turn: TurnState = TurnState.PLAYER
var actions_remaining: int = 2

# Références
@onready var tile_map = $TileMap
@onready var hud = $CanvasLayer/HUD

func _ready():
    initialize_grid()
    spawn_player()
    spawn_enemies()
    start_combat()

func initialize_grid():
    grid.clear()
    for y in GRID_HEIGHT:
        var row = []
        for x in GRID_WIDTH:
            row.append(null)
        grid.append(row)

func spawn_player():
    player = preload("res://scenes/entities/player.tscn").instantiate()
    add_child(player)
    place_entity(player, Vector2i(0, 1))
    player.died.connect(_on_player_died)

func spawn_enemies():
    # Spawn 2-3 ennemis côté droit
    var enemy_count = randi_range(2, 3)
    for i in enemy_count:
        var enemy = preload("res://scenes/entities/enemy.tscn").instantiate()
        add_child(enemy)
        var spawn_pos = Vector2i(GRID_WIDTH - 1, i)
        place_entity(enemy, spawn_pos)
        enemy.died.connect(_on_enemy_died.bind(enemy))
        enemies.append(enemy)

func place_entity(entity, grid_pos: Vector2i):
    entity.grid_position = grid_pos
    grid[grid_pos.y][grid_pos.x] = entity
    # Position world
    entity.global_position = grid_to_world(grid_pos)

func grid_to_world(grid_pos: Vector2i) -> Vector2:
    return Vector2(grid_pos.x * 64, grid_pos.y * 64)

func move_entity(entity, target_pos: Vector2i) -> bool:
    if not is_valid_position(target_pos):
        return false
    if grid[target_pos.y][target_pos.x] != null:
        return false
    
    # Libère ancienne position
    grid[entity.grid_position.y][entity.grid_position.x] = null
    # Occupe nouvelle position
    entity.grid_position = target_pos
    grid[target_pos.y][target_pos.x] = entity
    entity.global_position = grid_to_world(target_pos)
    
    use_action()
    return true

func attack(attacker, target_pos: Vector2i):
    var target = grid[target_pos.y][target_pos.x]
    if target and target != attacker:
        var damage = attacker.get_damage()
        target.take_damage(damage)
        EventBus.combat_action_used.emit("attack", target)
        use_action()

func use_action():
    actions_remaining -= 1
    if actions_remaining <= 0:
        end_turn()

func end_turn():
    if current_turn == TurnState.PLAYER:
        current_turn = TurnState.ENEMY
        actions_remaining = 2
        EventBus.combat_turn_changed.emit("enemy")
        enemy_turn()
    else:
        current_turn = TurnState.PLAYER
        actions_remaining = 2
        EventBus.combat_turn_changed.emit("player")

func enemy_turn():
    for enemy in enemies:
        if not enemy.is_dead:
            enemy_ai(enemy)
    await get_tree().create_timer(1.0).timeout
    end_turn()

func enemy_ai(enemy: Enemy):
    # IA simple : se rapproche ou attaque
    var player_pos = player.grid_position
    var distance = abs(player_pos.x - enemy.grid_position.x) + abs(player_pos.y - enemy.grid_position.y)
    
    if distance <= 1:
        # Adjacent : attaque
        attack(enemy, player_pos)
    else:
        # Trop loin : se déplace vers player
        var move_dir = (player_pos - enemy.grid_position).sign()
        var target_pos = enemy.grid_position + Vector2i(move_dir.x, 0)
        if not move_entity(enemy, target_pos):
            target_pos = enemy.grid_position + Vector2i(0, move_dir.y)
            move_entity(enemy, target_pos)

func is_valid_position(pos: Vector2i) -> bool:
    return pos.x >= 0 and pos.x < GRID_WIDTH and pos.y >= 0 and pos.y < GRID_HEIGHT

func _on_player_died():
    current_turn = TurnState.DEFEAT
    EventBus.combat_defeat.emit()

func _on_enemy_died(enemy: Enemy):
    enemies.erase(enemy)
    if enemies.is_empty():
        current_turn = TurnState.VICTORY
        EventBus.combat_victory.emit()

func start_combat():
    EventBus.combat_started.emit(enemies)
    current_turn = TurnState.PLAYER
```

---

#### CorruptionSystem.js → CorruptionManager.gd

**JavaScript** :
```javascript
class CorruptionSystem {
  constructor() {
    this.corruption = 0;
    this.diceMemory = [];
  }
  
  addCorruption(amount) {
    this.corruption += amount;
    EventBus.emit('corruption:changed', this.corruption);
  }
  
  rollDice() {
    const face = Math.floor(Math.random() * 6) + 1;
    this.diceMemory.push(face);
    return face;
  }
}
```

**GDScript** :
```gdscript
# scripts/managers/CorruptionManager.gd
extends Node
class_name CorruptionManager

var corruption: int = 0
var dice_memory: Array[int] = []
var pacts_available: Array[Dictionary] = []

# Seuils de corruption
const CORRUPTION_THRESHOLDS = {
    30: "corrupted_veins",
    50: "dark_eyes",
    70: "shadow_aura",
    90: "almost_lost",
    100: "fully_corrupted"
}

func _ready():
    load_pacts_data()

func add_corruption(amount: int):
    var old_corruption = corruption
    corruption = clamp(corruption + amount, 0, 100)
    
    EventBus.corruption_changed.emit(corruption, amount)
    check_thresholds(old_corruption, corruption)
    
    # Update GameState
    GameState.set_player_stat("corruption", corruption)

func check_thresholds(old_value: int, new_value: int):
    for threshold in CORRUPTION_THRESHOLDS.keys():
        if old_value < threshold and new_value >= threshold:
            var event_name = CORRUPTION_THRESHOLDS[threshold]
            EventBus.corruption_threshold_reached.emit(threshold)
            print("[Corruption] Threshold reached: %d (%s)" % [threshold, event_name])

func roll_dice() -> int:
    var face = randi_range(1, 6)
    dice_memory.append(face)
    
    # Face 7 spéciale (5% chance)
    if randf() < 0.05:
        face = 7
    
    var stage = GameState.get_player_stat("stage")
    EventBus.dice_rolled.emit(face, stage)
    
    return face

func offer_pact(pact_type: String):
    var pact = get_pact_by_type(pact_type)
    if pact:
        EventBus.blood_pact_offered.emit(pact)

func accept_pact(pact: Dictionary):
    # Applique effets
    apply_pact_effects(pact)
    
    # Ajoute corruption
    add_corruption(pact["corruption_cost"])
    
    EventBus.blood_pact_accepted.emit(pact["type"])
    GameState.game_data["run"]["pacts_made"] += 1

func apply_pact_effects(pact: Dictionary):
    match pact["type"]:
        "blood_surge":
            # Double damage next attack
            GameState.modify_player_stat("damage", GameState.get_player_stat("damage"))
        "dark_heal":
            # Heal HP
            var heal_amount = pact["effect_value"]
            GameState.modify_player_stat("hp", heal_amount)
            EventBus.player_healed.emit(heal_amount)
        "void_shield":
            # Add defense
            GameState.modify_player_stat("defense", pact["effect_value"])

func get_pact_by_type(type: String) -> Dictionary:
    for pact in pacts_available:
        if pact["type"] == type:
            return pact
    return {}

func load_pacts_data():
    # Load from JSON or hardcode
    pacts_available = [
        {
            "type": "blood_surge",
            "name": "Blood Surge",
            "description": "Double your damage for next attack",
            "corruption_cost": 15,
            "effect_value": 0
        },
        {
            "type": "dark_heal",
            "name": "Dark Heal",
            "description": "Heal 30 HP",
            "corruption_cost": 20,
            "effect_value": 30
        },
        {
            "type": "void_shield",
            "name": "Void Shield",
            "description": "Gain +5 Defense",
            "corruption_cost": 10,
            "effect_value": 5
        }
    ]
```

---

### 3. ENTITIES (PLAYER & ENEMIES)

#### PlayerStatsSystem.js → Player.gd

**JavaScript** :
```javascript
class PlayerStatsSystem {
  constructor() {
    this.hp = 100;
    this.damage = 10;
  }
  
  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) this.die();
  }
}
```

**GDScript** :
```gdscript
# scripts/player/Player.gd
extends CharacterBody2D
class_name Player

# Stats
var max_hp: int = 100
var hp: int = 100
var damage: int = 10
var defense: int = 5
var corruption: int = 0

# État
var is_dead: bool = false
var grid_position: Vector2i = Vector2i(0, 0)

# Signaux
signal died
signal health_changed(new_hp, max_hp)
signal moved(new_position)

# Nodes
@onready var sprite = $Sprite2D
@onready var anim = $AnimationPlayer

func _ready():
    load_stats_from_game_state()
    update_visuals()

func load_stats_from_game_state():
    var player_data = GameState.get_player_data()
    hp = player_data["hp"]
    max_hp = player_data["max_hp"]
    damage = player_data["damage"]
    defense = player_data["defense"]
    corruption = player_data["corruption"]

func take_damage(amount: int):
    if is_dead:
        return
    
    var actual_damage = max(1, amount - defense)
    hp -= actual_damage
    hp = max(0, hp)
    
    health_changed.emit(hp, max_hp)
    EventBus.player_damaged.emit(actual_damage)
    GameState.set_player_stat("hp", hp)
    
    play_damage_animation()
    
    if hp <= 0:
        die()

func heal(amount: int):
    hp += amount
    hp = min(hp, max_hp)
    health_changed.emit(hp, max_hp)
    EventBus.player_healed.emit(amount)
    GameState.set_player_stat("hp", hp)

func die():
    if is_dead:
        return
    
    is_dead = true
    died.emit()
    play_death_animation()

func play_damage_animation():
    if anim:
        anim.play("hit")

func play_death_animation():
    if anim:
        anim.play("death")

func update_visuals():
    # Change sprite selon corruption
    if corruption < 30:
        sprite.modulate = Color.WHITE
    elif corruption < 60:
        sprite.modulate = Color(1, 0.8, 1)  # Légèrement violet
    elif corruption < 90:
        sprite.modulate = Color(0.8, 0.5, 0.8)  # Plus violet
    else:
        sprite.modulate = Color(0.5, 0, 0.5)  # Très corrompu

func get_damage() -> int:
    return damage
```

---

### 4. UI SCENES

#### CampScene.js → camp.tscn

**Structure Godot** :
```
Node2D (Camp)
├── TileMap (Background)
├── NPCs (Node2D)
│   ├── Drenvar (NPC)
│   ├── Kael (NPC)
│   └── Corvus (NPC)
├── Player (CharacterBody2D)
├── Camera2D
└── CanvasLayer (UI)
    ├── DialogueBox (Panel)
    └── CampMenu (Control)
```

**Script camp.gd** :
```gdscript
extends Node2D

@onready var player = $Player
@onready var npcs = $NPCs
@onready var dialogue_box = $CanvasLayer/DialogueBox
@onready var camera = $Camera2D

var current_npc: NPC = null

func _ready():
    load_camp_state()
    update_npc_reactions()
    camera.make_current()

func load_camp_state():
    var corruption = GameState.get_player_stat("corruption")
    print("[Camp] Loaded. Player corruption: %d%%" % corruption)

func update_npc_reactions():
    var corruption = GameState.get_player_stat("corruption")
    for npc in npcs.get_children():
        npc.update_reaction(corruption)

func interact_with_npc(npc: NPC):
    current_npc = npc
    var dialogue = npc.get_dialogue()
    show_dialogue(dialogue)

func show_dialogue(text: String):
    dialogue_box.visible = true
    dialogue_box.set_text(text)
```

---

## 🎯 ORDRE DE MIGRATION

### Phase 1 : Setup (Jour 1)
1. ✅ Créer projet Godot
2. ✅ Structure dossiers (scenes/, scripts/, assets/, data/)
3. ✅ EventBus.gd (Autoload)
4. ✅ GameState.gd (Autoload)

### Phase 2 : Core (Jours 2-3)
5. ✅ Player.gd (stats + health)
6. ✅ Enemy.gd (base class)
7. ✅ Test scene simple (1 player, 1 enemy)

### Phase 3 : Combat (Jours 4-7)
8. ✅ CombatManager.gd (grid 3x4)
9. ✅ Combat HUD (HP bars, actions)
10. ✅ Tour par tour
11. ✅ IA ennemie

### Phase 4 : Corruption (Jours 8-9)
12. ✅ CorruptionManager.gd
13. ✅ ThalysDice scene
14. ✅ Blood Pact UI

### Phase 5 : Dungeon (Jours 10-12)
15. ✅ DungeonGenerator.gd
16. ✅ Room transitions
17. ✅ Events (cages, coffres)

### Phase 6 : Camp (Jours 13-14)
18. ✅ Camp scene
19. ✅ NPCs + dialogues

---

*"On migre pas tout d'un coup. On reconstruit block par block."* 🧱
