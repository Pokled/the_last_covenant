# 💡 TIPS AVANCÉS GODOT + GDSCRIPT

**Pour** : THE LAST COVENANT  
**Public** : Développeur JS qui débute en GDScript

---

## 🎨 DESIGN PATTERNS GODOT

### 1. Singleton Pattern (Autoload)

**Ton besoin** : EventBus, GameState, AudioManager accessibles partout

```gdscript
# autoload/EventBus.gd
extends Node

signal player_died

# Accessible partout avec :
# EventBus.player_died.emit()
```

**Setup** :
- Project → Project Settings → Autoload
- Ajoute `res://autoload/EventBus.gd`
- Nom : `EventBus`

---

### 2. Component Pattern

**Au lieu de** : Grosses classes monolithiques  
**Faire** : Petits nodes spécialisés

**Exemple : Health Component**
```gdscript
# components/HealthComponent.gd
extends Node
class_name HealthComponent

signal died
signal health_changed(new_hp, max_hp)

@export var max_hp: int = 100
var hp: int = max_hp

func _ready():
    hp = max_hp

func take_damage(amount: int):
    hp -= amount
    hp = max(0, hp)
    health_changed.emit(hp, max_hp)
    
    if hp <= 0:
        died.emit()

func heal(amount: int):
    hp = min(hp + amount, max_hp)
    health_changed.emit(hp, max_hp)
```

**Utilisation** :
```
Player (CharacterBody2D)
├── HealthComponent
├── DamageComponent
└── MovementComponent
```

```gdscript
# Player.gd
@onready var health = $HealthComponent

func _ready():
    health.died.connect(_on_died)

func _on_died():
    print("Player died")
```

---

### 3. State Machine Pattern

**Pour** : Gérer états complexes (idle, walk, attack, dead)

```gdscript
# components/StateMachine.gd
extends Node
class_name StateMachine

var states: Dictionary = {}
var current_state: String = ""

func _ready():
    for child in get_children():
        if child is State:
            states[child.name] = child
            child.state_machine = self

func change_state(new_state: String):
    if current_state != "":
        states[current_state].exit()
    
    current_state = new_state
    states[current_state].enter()

func _process(delta):
    if current_state != "":
        states[current_state].update(delta)
```

**State base class** :
```gdscript
# components/State.gd
extends Node
class_name State

var state_machine: StateMachine

func enter():
    pass

func exit():
    pass

func update(delta):
    pass
```

**Exemple Player States** :
```
Player
└── StateMachine
    ├── IdleState (State)
    ├── WalkState (State)
    ├── AttackState (State)
    └── DeadState (State)
```

```gdscript
# IdleState.gd
extends State

func enter():
    print("Entered Idle")

func update(delta):
    if Input.is_action_pressed("move_right"):
        state_machine.change_state("WalkState")
```

---

## 🎮 INPUT SYSTEM

### Input Map (Clavier/Manette)

**Setup** :
- Project → Project Settings → Input Map
- Crée actions : `move_left`, `move_right`, `attack`, `use_dice`

**Dans script** :
```gdscript
func _process(delta):
    # Détection pression
    if Input.is_action_just_pressed("attack"):
        attack()
    
    # Détection maintien
    if Input.is_action_pressed("move_right"):
        move_right()
    
    # Détection relâchement
    if Input.is_action_just_released("attack"):
        end_attack()

# Direction (axes)
func get_input_direction() -> Vector2:
    var direction = Vector2.ZERO
    direction.x = Input.get_axis("move_left", "move_right")
    direction.y = Input.get_axis("move_up", "move_down")
    return direction.normalized()
```

---

## 🎬 ANIMATIONS AVANCÉES

### 1. AnimationPlayer (Sprites)

**Setup** :
```
Player
├── Sprite2D
└── AnimationPlayer
```

**Créer animation "attack"** :
1. Clique AnimationPlayer → New Animation
2. Nom : "attack"
3. Durée : 0.5s
4. Ajoute track : Sprite2D → frame (si spritesheet)
5. Ou : Sprite2D → position (déplacement)

**Code** :
```gdscript
@onready var anim = $AnimationPlayer

func attack():
    anim.play("attack")
    await anim.animation_finished
    print("Attack finished")
```

---

### 2. Tweens (UI, VFX)

**Fade in/out** :
```gdscript
func fade_in(node: Node, duration: float = 0.5):
    node.modulate.a = 0
    var tween = create_tween()
    tween.tween_property(node, "modulate:a", 1.0, duration)

func fade_out(node: Node, duration: float = 0.5):
    var tween = create_tween()
    tween.tween_property(node, "modulate:a", 0.0, duration)
```

**Smooth movement** :
```gdscript
func move_to(target_position: Vector2, duration: float = 1.0):
    var tween = create_tween()
    tween.set_trans(Tween.TRANS_CUBIC)  # Courbe d'animation
    tween.set_ease(Tween.EASE_OUT)
    tween.tween_property(self, "position", target_position, duration)
```

**Scale bounce** :
```gdscript
func bounce_scale(node: Node):
    var tween = create_tween()
    tween.tween_property(node, "scale", Vector2(1.2, 1.2), 0.1)
    tween.tween_property(node, "scale", Vector2(1.0, 1.0), 0.1)
```

**Chain multiple tweens** :
```gdscript
func epic_entrance(node: Node):
    node.modulate.a = 0
    node.scale = Vector2(0.5, 0.5)
    
    var tween = create_tween()
    tween.set_parallel(true)  # Simultané
    tween.tween_property(node, "modulate:a", 1.0, 0.5)
    tween.tween_property(node, "scale", Vector2(1.2, 1.2), 0.5)
    
    tween.set_parallel(false)  # Séquentiel après
    tween.tween_property(node, "scale", Vector2(1.0, 1.0), 0.2)
```

---

### 3. Particles (GPUParticles2D)

**Pour** : Blood splatter, aura Thalys, death smoke

**Setup** :
```
Enemy
└── GPUParticles2D
    ├── Amount: 50
    ├── Lifetime: 1.0
    ├── Explosiveness: 1.0
    └── Process Material: ParticleProcessMaterial
```

**ParticleProcessMaterial Settings** :
- **Emission Shape** : Sphere (pour explosion)
- **Gravity** : (0, 98) pour tomber
- **Initial Velocity** : 100-200 (vitesse)
- **Color Ramp** : Rouge → Transparent (sang)

**Code** :
```gdscript
@onready var blood_particles = $GPUParticles2D

func die():
    blood_particles.emitting = true
    await get_tree().create_timer(blood_particles.lifetime).timeout
    queue_free()
```

---

## 🔊 AUDIO AVANCÉ

### AudioManager (Autoload)

```gdscript
# autoload/AudioManager.gd
extends Node

# Audio buses
const MUSIC_BUS = "Music"
const SFX_BUS = "SFX"

var music_player: AudioStreamPlayer
var sfx_players: Array[AudioStreamPlayer] = []
const MAX_SFX_PLAYERS = 10

func _ready():
    # Music player
    music_player = AudioStreamPlayer.new()
    add_child(music_player)
    music_player.bus = MUSIC_BUS
    
    # SFX pool
    for i in MAX_SFX_PLAYERS:
        var player = AudioStreamPlayer.new()
        player.bus = SFX_BUS
        add_child(player)
        sfx_players.append(player)

# Jouer musique (loop)
func play_music(music_path: String):
    var stream = load(music_path)
    music_player.stream = stream
    music_player.play()

# Jouer SFX (one-shot)
func play_sfx(sfx_path: String, volume_db: float = 0.0):
    var player = get_available_sfx_player()
    if player:
        var stream = load(sfx_path)
        player.stream = stream
        player.volume_db = volume_db
        player.play()

func get_available_sfx_player() -> AudioStreamPlayer:
    for player in sfx_players:
        if not player.playing:
            return player
    return null

# Volume
func set_music_volume(volume: float):
    AudioServer.set_bus_volume_db(
        AudioServer.get_bus_index(MUSIC_BUS),
        linear_to_db(volume)
    )

func set_sfx_volume(volume: float):
    AudioServer.set_bus_volume_db(
        AudioServer.get_bus_index(SFX_BUS),
        linear_to_db(volume)
    )
```

**Utilisation** :
```gdscript
# Musique
AudioManager.play_music("res://assets/audio/music/combat_theme.ogg")

# SFX
AudioManager.play_sfx("res://assets/audio/sfx/sword_hit.ogg")
AudioManager.play_sfx("res://assets/audio/sfx/explosion.ogg", -10.0)  # Plus faible
```

---

## 💾 SAVE/LOAD AVANCÉ

### Save System avec Validation

```gdscript
# autoload/SaveManager.gd
extends Node

const SAVE_PATH = "user://savegame.save"
const SAVE_VERSION = 1

func save_game(data: Dictionary) -> bool:
    # Ajoute version
    data["save_version"] = SAVE_VERSION
    data["timestamp"] = Time.get_unix_time_from_system()
    
    var file = FileAccess.open(SAVE_PATH, FileAccess.WRITE)
    if not file:
        push_error("Failed to open save file")
        return false
    
    # JSON (lisible) ou binaire (compact)
    var json_string = JSON.stringify(data)
    file.store_line(json_string)
    file.close()
    
    print("[SaveManager] Game saved")
    return true

func load_game() -> Dictionary:
    if not FileAccess.file_exists(SAVE_PATH):
        print("[SaveManager] No save file found")
        return {}
    
    var file = FileAccess.open(SAVE_PATH, FileAccess.READ)
    if not file:
        push_error("Failed to open save file")
        return {}
    
    var json_string = file.get_line()
    file.close()
    
    var json = JSON.new()
    var parse_result = json.parse(json_string)
    
    if parse_result != OK:
        push_error("Failed to parse save file")
        return {}
    
    var data = json.data
    
    # Valide version
    if data.get("save_version", 0) != SAVE_VERSION:
        print("[SaveManager] Old save version, migrating...")
        data = migrate_save(data)
    
    print("[SaveManager] Game loaded")
    return data

func migrate_save(old_data: Dictionary) -> Dictionary:
    # Migre vieilles sauvegardes
    var new_data = old_data.duplicate(true)
    new_data["save_version"] = SAVE_VERSION
    # Ajoute nouveaux champs manquants
    if not new_data.has("corruption"):
        new_data["corruption"] = 0
    return new_data

func delete_save():
    if FileAccess.file_exists(SAVE_PATH):
        DirAccess.remove_absolute(SAVE_PATH)
        print("[SaveManager] Save deleted")
```

---

## 🎯 DEBUGGING TIPS

### 1. Print Debug

```gdscript
# Print simple
print("HP: ", hp)

# Print avec format
print("Player: HP=%d/%d, Corruption=%d%%" % [hp, max_hp, corruption])

# Print coloré (dans console)
print_rich("[color=red]ERROR: Player died[/color]")
print_rich("[color=yellow]WARNING: Low HP[/color]")
print_rich("[color=green]SUCCESS: Level up[/color]")
```

### 2. Breakpoints

- Clique dans marge gauche de l'éditeur script (point rouge)
- Lance jeu en mode Debug (F5)
- Le jeu s'arrête au breakpoint
- Inspecte variables dans panneau debugger

### 3. Remote Inspector

- Lance jeu (F5)
- Onglet **Remote** en haut de l'inspecteur
- Vois tous les nodes en temps réel
- Modifie propriétés à chaud

### 4. Performance Monitor

```gdscript
# Affiche FPS et stats
func _ready():
    Engine.max_fps = 60
    OS.set_window_title("FPS: %d" % Engine.get_frames_per_second())

func _process(delta):
    # Update titre avec FPS
    if Engine.get_frames_drawn() % 60 == 0:
        OS.set_window_title("FPS: %d" % Engine.get_frames_per_second())
```

**Ou utilise** :
- Menu Debug → Toggle System Monitor

---

## 🚀 OPTIMISATION

### 1. Object Pooling (Réutiliser objets)

**Problème** : Instancier/détruire ennemis/projectiles = lag

**Solution** : Pool d'objets réutilisés

```gdscript
# managers/ObjectPool.gd
extends Node
class_name ObjectPool

var pool: Array = []
var scene: PackedScene

func _init(scene_path: String, initial_size: int = 10):
    scene = load(scene_path)
    for i in initial_size:
        var instance = scene.instantiate()
        instance.visible = false
        add_child(instance)
        pool.append(instance)

func get_object():
    for obj in pool:
        if not obj.visible:
            obj.visible = true
            return obj
    
    # Pool vide, crée nouveau
    var new_obj = scene.instantiate()
    add_child(new_obj)
    pool.append(new_obj)
    return new_obj

func return_object(obj):
    obj.visible = false
    obj.position = Vector2.ZERO
```

**Utilisation** :
```gdscript
var enemy_pool: ObjectPool

func _ready():
    enemy_pool = ObjectPool.new("res://scenes/enemy.tscn", 20)
    add_child(enemy_pool)

func spawn_enemy():
    var enemy = enemy_pool.get_object()
    enemy.position = Vector2(100, 100)

func kill_enemy(enemy):
    enemy_pool.return_object(enemy)
```

---

### 2. Lazy Loading (Charger à la demande)

```gdscript
# Au lieu de charger tout au démarrage
var heavy_resource = preload("res://huge_texture.png")

# Charge uniquement quand nécessaire
var heavy_resource = null

func get_resource():
    if heavy_resource == null:
        heavy_resource = load("res://huge_texture.png")
    return heavy_resource
```

---

### 3. Update uniquement quand visible

```gdscript
func _process(delta):
    if not visible:
        return  # Skip si invisible
    
    # Update logique
```

---

## 🎨 SHADERS (FX Visuels Avancés)

### Shader simple : Glow Effect (Thalys)

**Crée `res://shaders/glow.gdshader`** :
```glsl
shader_type canvas_item;

uniform vec4 glow_color : source_color = vec4(0.5, 0.0, 0.5, 1.0);
uniform float glow_strength : hint_range(0.0, 2.0) = 1.0;

void fragment() {
    vec4 color = texture(TEXTURE, UV);
    COLOR = color + glow_color * glow_strength;
}
```

**Applique sur Sprite2D** :
1. Clique Sprite2D
2. Material → New ShaderMaterial
3. Shader → Load → glow.gdshader

**Anime depuis script** :
```gdscript
@onready var sprite = $Sprite2D

func pulse_glow():
    var tween = create_tween().set_loops()
    tween.tween_property(sprite.material, "shader_parameter/glow_strength", 2.0, 1.0)
    tween.tween_property(sprite.material, "shader_parameter/glow_strength", 0.5, 1.0)
```

---

## 📱 MULTI-PLATFORM EXPORT

### Windows
- Project → Export
- Add → Windows Desktop
- Exécutable : `TheLastCovenant.exe`
- Export

### Linux
- Add → Linux/X11
- Export

### Web (HTML5)
- Add → Web
- Threads : désactivé (pour compatibilité)
- Export

---

## 🔥 TIPS ULTIME

### 1. Organise avec @onready

```gdscript
# ❌ Pas optimisé
func _ready():
    sprite = $Sprite2D
    anim = $AnimationPlayer
    health = $HealthComponent

# ✅ Optimisé
@onready var sprite = $Sprite2D
@onready var anim = $AnimationPlayer
@onready var health = $HealthComponent
```

### 2. Utilise @export pour éditeur

```gdscript
extends CharacterBody2D

@export var max_hp: int = 100
@export var speed: float = 200.0
@export_range(0, 100) var corruption: int = 0
@export_file("*.json") var data_file: String
```

→ Modifiable dans Inspector sans toucher code

### 3. Group Management

**Pour** : Gérer tous les ennemis facilement

**Ajoute à groupe** :
```gdscript
func _ready():
    add_to_group("enemies")
```

**Call sur tous** :
```gdscript
# Tue tous les ennemis
get_tree().call_group("enemies", "die")

# Get tous les ennemis
var all_enemies = get_tree().get_nodes_in_group("enemies")
print("Enemies alive: %d" % all_enemies.size())
```

### 4. Await (Async/Await)

```gdscript
# Attendre signal
await EventBus.combat_ended

# Attendre timer
await get_tree().create_timer(2.0).timeout

# Attendre animation
await $AnimationPlayer.animation_finished

# Exemple complet
func attack_sequence():
    print("Start attack")
    $AnimationPlayer.play("attack")
    await $AnimationPlayer.animation_finished
    deal_damage()
    await get_tree().create_timer(0.5).timeout
    print("Attack finished")
```

---

*"GDScript, c'est Python + Unity + Love."* ❤️
