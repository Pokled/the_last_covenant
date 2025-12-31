# Corruption Particles AAA — Canvas JS (HD)

## Vision
Jeu RPG isométrique lugubre.
La magie de corruption est **organique, vivante** :
- Veines
- Pulsations
- Respiration du sol
- Énergie malveillante contrôlée

Inspirations :
Diablo IV, Path of Exile endgame, dark fantasy organique.

---

## Contraintes techniques
- Canvas 2D
- JavaScript ES6 vanilla
- Compatible navigateur + Electron
- 60 FPS constant
- Object pooling obligatoire
- Aucun framework externe
- **Budget max : 2000 particules actives**
- **Pool initial : 2500 particules pré-allouées**

---

## Direction artistique

### Palette
- Violet profond : `#5b2b82`
- Mauve magique : `#8f5bd8`
- Highlight nerveux : `#d8b4ff`
- Ombre corrompue : `rgba(30, 0, 40, 0.8)`

### Règles visuelles
- Peu de couleurs
- Glow propre (jamais fluo)
- Effets courts et denses
- Flash clair → retour sombre
- Pulsations rythmiques (sensation de vie)

---

## Principes de feedback AAA
Un sort réussi contient toujours :
1. Flash d’impact (≤ 100 ms)
2. Pulsation / onde vivante
3. Projection organique (veines, éclats)
4. After-effect sombre

Toujours utiliser :
`ctx.globalCompositeOperation = 'lighter'`

---

## ⚠️ Anti-patterns (NE PAS FAIRE)

### Performance
- ❌ `new Particle()` pendant le gameplay
- ❌ Allocations dynamiques dans la boucle de rendu
- ❌ Plus de 100 particules par effet simultané
- ❌ `Math.random()` sans seed prévisible pour effets critiques

### Visuel
- ❌ Glow fluo saturé (on n'est pas dans Tron)
- ❌ Particules qui durent > 3 secondes (sauf sol)
- ❌ Trop de couleurs (max 3 teintes par effet)
- ❌ Effets qui masquent le gameplay
- ❌ Particules sans fade (disparition brutale)

### Architecture
- ❌ Coupling fort avec le système de combat
- ❌ Logique métier dans les particules
- ❌ Accès direct au DOM depuis l'emitter
- ❌ State muable partagé entre particules

---

## Presets — Corruption Organique

### Flash nerveux
```js
const CorruptionNerveFlash = {
  count: 1,
  life: 70,
  speed: 0,
  size: 100,
  grow: -3,
  gravity: 0,
  fade: true,
  color: ['#d8b4ff']
};




const CorruptionPulseCore = {
  count: 1,
  life: 600,
  speed: 0,
  size: 28,
  grow: 1.6,
  gravity: 0,
  fade: true,
  color: ['rgba(90, 30, 140, 0.7)']
};



const CorruptionVeinBurst = {
  count: 90,
  life: 900,
  speed: 4.5,
  size: 14,
  grow: -0.06,
  gravity: 0.04,
  fade: true,
  color: ['#8f5bd8', '#5b2b82']
};


const GroundVeinsAAA = {
  count: 16,
  life: 2400,
  speed: 0.15,
  size: 18,
  grow: 0.05,
  gravity: 0,
  fade: true,
  color: [
    'rgba(80, 20, 120, 0.9)',
    'rgba(140, 80, 200, 0.4)'
  ]
};


function corruptionPulse(x, y) {
  emitter.emit(x, y, CorruptionNerveFlash);
  setTimeout(() => emitter.emit(x, y, CorruptionPulseCore), 40);
  setTimeout(() => emitter.emit(x, y, CorruptionVeinBurst), 80);
}


cam.x += Math.sin(time * 0.02) * 2;
cam.y += Math.cos(time * 0.02) * 2;


ctx.fillStyle = 'rgba(30, 0, 40, 0.12)';
ctx.fillRect(0, 0, canvas.width, canvas.height);


---

## Architecture recommandée

### Classes principales

```js
// Particule légère (réutilisable)
class Particle {
  x, y, vx, vy, life, maxLife, size, grow, alpha, color, gravity
  update(dt)
  isAlive()
}

// Pool fixe (pas d'allocations)
class ParticlePool {
  constructor(size = 2500)
  get() // Retourne particule inactive ou null
  release(particle)
  updateAll(dt)
  renderAll(ctx)
}

// Émetteur (interface simple)
class ParticleEmitter {
  constructor(pool)
  emit(x, y, preset)
  emitLayered(x, y, presets) // Effets complexes
}
```

### Budget par effet type
- **Impact rapide** : 80-120 particules (≤ 1s)
- **Zone persistante** : 15-30 particules (2-3s)
- **Aura continue** : 8-16 particules/sec
- **Critique épique** : 200-300 particules (1.5s)

---

## 🤖 2️⃣ PROMPT POUR **GITHUB COPILOT**



```txt
You are generating a high-end AAA particle system for a dark fantasy isometric RPG.

Context:
- Canvas 2D
- Vanilla JavaScript ES6
- Browser + Electron
- 60 FPS target
- No external libraries
- Object pooling required

Art direction:
- Dark, lugubrious corruption magic
- Organic veins and rhythmic pulsations
- Violet / mauve palette
- Clean glow, never neon
- Short, punchy, readable effects

System requirements:
- Particle class with life, velocity, size, grow, fade
- ParticlePool (fixed size, no allocations)
- Emitter supporting layered effects
- Additive blending support
- Designed for isometric camera

Gameplay feedback:
- Flash impact
- Pulsating shockwave
- Vein-like projections
- Lingering corrupted ground effect
- Optional screen shake hooks

Follow the design described in corruption_particles_aaa.md.
Code must be clean, commented, and production-ready.

Respect anti-patterns:
- Never allocate during gameplay
- Keep effects under 2000 active particles
- Ensure all particles fade properly
- Maintain 60 FPS baseline
