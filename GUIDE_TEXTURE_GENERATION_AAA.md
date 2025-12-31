# 🎨 GUIDE COMPLET - GÉNÉRATION DE TEXTURES & ASSETS
## THE LAST COVENANT - Production AAA

---

## 📋 TABLE DES MATIÈRES

1. [Vue d'Ensemble](#vue-densemble)
2. [Outils IA Recommandés](#outils-ia-recommandés)
3. [Arènes de Combat](#arènes-de-combat)
4. [Props & Obstacles](#props--obstacles)
5. [Personnages & Ennemis](#personnages--ennemis)
6. [Items & Équipement](#items--équipement)
7. [Effets Visuels (VFX)](#effets-visuels-vfx)
8. [UI Elements](#ui-elements)
9. [Le Dé de Thalys](#le-dé-de-thalys)
10. [Workflow de Production](#workflow-de-production)
11. [Templates de Prompts](#templates-de-prompts)

---

## 🎯 VUE D'ENSEMBLE

### Structure du Projet

```
assets/images/
├── combat/
│   ├── tiles/          ← Arènes complètes (JPG, 1024x1024)
│   ├── props/          ← Obstacles individuels (PNG transparent)
│   ├── entities/       ← Sprites personnages (PNG transparent)
│   └── effects/        ← VFX (PNG transparent, animations)
├── ui/
│   ├── icons/          ← Icônes items/compétences (PNG 48x48 ou 64x64)
│   ├── dice/           ← Faces du dé Thalys (PNG 128x128)
│   └── buttons/        ← Boutons UI (PNG, slices 9-patch)
└── background/         ← Backgrounds de scènes (PNG/JPG 1920x1080)
```

### Philosophie Artistique

**Style** : Dark Fantasy AAA (Baldur's Gate 3 + Diablo 4 + Darkest Dungeon)

**Palette de Couleurs** :
- 🖤 **Primaire** : Noirs profonds (#0a0a0f), gris ardoise (#2a2520)
- 🟫 **Secondaire** : Bruns terre (#3d2817), pierre (#6b5442)
- 🟡 **Accents** : Or vieilli (#d4af37), bronze (#c9a97a)
- 🔴 **Danger** : Rouge sang (#d14343), pourpre (#8b1c1c)
- 🟣 **Corruption** : Violet mystique (#9b59b6), indigo (#5a0a5a)

**Atmosphère** :
- ✨ Éclairage dramatique (torches, runes lumineuses)
- 🌫️ Brume et ombres profondes
- 🕯️ Contraste élevé (lumière vs obscurité)
- 🏛️ Architecture gothique médiévale
- 💀 Symboles occultes, ruines anciennes

---

## 🤖 OUTILS IA RECOMMANDÉS

### 🥇 **Leonardo.ai** (Meilleur pour assets de jeu)

**URL** : https://leonardo.ai  
**Gratuit** : 15 images/jour  
**Points forts** :
- ✅ Option "Transparent Background" native
- ✅ Modèle "RPG 4.0" parfait pour fantasy
- ✅ Canvas mode pour retouches
- ✅ Cohérence stylistique excellente
- ✅ Batch generation (plusieurs variations)

**Modèles recommandés** :
- `RPG 4.0` → Personnages, props
- `Absolute Reality` → Textures réalistes
- `DreamShaper v7` → Ambiances dark fantasy

**Paramètres optimaux** :
- **Prompt Magic** : On (v2)
- **Alchemy** : On (meilleure qualité)
- **Transparent Background** : On (pour props/sprites)
- **Dimensions** : 1024x1024 (arènes), 512x512 (props)
- **Guidance Scale** : 7-9 (équilibre créativité/précision)

---

### 🥈 **Midjourney** (Meilleure qualité pure)

**URL** : https://midjourney.com (via Discord)  
**Prix** : $10/mois (Basic Plan)  
**Points forts** :
- 🔥 Qualité AAA+++ imbattable
- 🎨 Cohérence artistique supérieure
- ⚡ Variations infinies avec `/imagine --v 6`

**Paramètres essentiels** :
```
--v 6             Version 6 (meilleure qualité)
--ar 1:1          Ratio carré (items, props)
--ar 16:9         Ratio paysage (backgrounds)
--stylize 750     Équilibre créativité (0-1000)
--quality 2       Haute qualité (1-2, coûte plus de crédits)
--chaos 50        Variété modérée (0-100)
```

---

### 🥉 **Bing Image Creator** (Gratuit illimité)

**URL** : https://www.bing.com/images/create  
**Gratuit** : Illimité (DALL-E 3)  
**Points forts** :
- ✅ Totalement gratuit
- ✅ DALL-E 3 de qualité
- ✅ Pas d'inscription obligatoire
- ⚠️ **Pas de transparence** (nécessite removal de fond après)

**Idéal pour** : Prototypage rapide, concepts, arènes de fond

---

### 🛠️ **Outils de Post-Processing**

#### **Remove.bg** (Removal de fond)
**URL** : https://www.remove.bg  
**Gratuit** : 50 images/mois  
**API** : Oui (automatisation possible)

#### **ClipDrop** (IA removal + upscaling)
**URL** : https://clipdrop.co  
**Gratuit** : Illimité (avec watermark)

#### **Photopea** (Photoshop gratuit en ligne)
**URL** : https://www.photopea.com  
**Gratuit** : Oui, 100% gratuit  
**Usage** : Retouches, ajout d'effets, crop, export optimisé

#### **Upscayl** (Upscaling IA local)
**URL** : https://upscayl.org  
**Gratuit** : Oui, open-source  
**Usage** : Agrandir les images 2x/4x sans perte de qualité

---

## 🏛️ ARÈNES DE COMBAT

### Spécifications Techniques

**Format** : JPG (fond opaque)  
**Dimensions** : 1024x1024px minimum (1536x1536px optimal)  
**Vue** : Isométrique (45° diagonale, comme ta texture actuelle)  
**Ratio** : 1:1 (carré)

### Éléments Essentiels

Chaque arène doit contenir :
1. **Zone centrale** : Spawn joueur (cercle runique, autel, portail)
2. **4 Piliers/Coins** : Points stratégiques pour ennemis
3. **Éclairage** : 3-4 sources lumineuses (torches, brasiers, runes)
4. **Bordures** : Murs/limites visuelles claires
5. **Détails de sol** : Variations de dalles, fissures, motifs

### Types d'Arènes

#### 1. **Crypte Ancienne** 🏰
```
Prompt Leonardo.ai :
isometric dungeon room, ancient crypt, stone floor with cracks, 
four torch pillars in corners, glowing runic circle in center, 
dark fantasy style, Baldur's Gate 3 art, dramatic lighting, 
atmospheric fog, gothic architecture, 1024x1024px, top-down view
```

**Variations** :
- Sarcophages contre les murs
- Chaînes pendantes
- Autels sacrificiels
- Fresques murales effacées

#### 2. **Temple Maudit** ⛪
```
Prompt :
isometric temple chamber, cursed sanctuary, cracked marble floor, 
stained glass windows casting colored light, central altar with 
dark ritual circle, four stone pillars with carved runes, 
Diablo 4 style, ominous atmosphere, purple and gold lighting
```

#### 3. **Caverne Profonde** 🕳️
```
Prompt :
isometric underground cave arena, natural stone walls, 
stalactites hanging from ceiling, glowing mushrooms, 
crystal formations, underground lake reflecting torchlight, 
dark fantasy RPG, moody atmosphere
```

#### 4. **Forge Infernale** 🔥
```
Prompt :
isometric demon forge, lava pools, blacksmith anvils, 
burning braziers, metal grates floor, chains and hooks, 
hellish red-orange lighting, dark souls style, 
industrial medieval fantasy
```

#### 5. **Bibliothèque Interdite** 📚
```
Prompt :
isometric forbidden library, towering bookshelves, 
scattered ancient tomes, candelabras, circular reading area, 
mystical floating books, purple arcane light, 
dark academia fantasy aesthetic
```

#### 6. **Jardin Corrompu** 🌿
```
Prompt :
isometric corrupted garden arena, withered trees, 
dead grass with purple corruption veins, poisonous flowers, 
twisted roots, dark green and purple palette, 
eldrich horror atmosphere
```

### Checklist Arène

Avant d'exporter une arène, vérifier :
- ✅ Centre clairement identifiable (spawn joueur)
- ✅ 4 points stratégiques visibles (spawn ennemis)
- ✅ Contraste suffisant (zones sombres vs lumineuses)
- ✅ Pas de détails essentiels trop près des bords
- ✅ Éclairage cohérent et dramatique
- ✅ Résolution ≥ 1024x1024px

---

## 🧱 PROPS & OBSTACLES

### Spécifications Techniques

**Format** : PNG avec transparence alpha  
**Dimensions** : Variables selon objet  
**Vue** : Isométrique (même angle que les arènes)  
**Résolution** : 256x256px (petits), 512x512px (moyens), 1024x1024px (grands)

### Catégories d'Obstacles

#### 1. **Murs & Structures** 🧱

##### Mur de Pierre
```
Prompt Leonardo.ai (avec Transparent Background ON) :
stone wall segment, medieval dungeon, cracked bricks, 
moss and vines, isometric view, game asset, dark fantasy, 
single wall piece, transparent background, 512x512px
```

**Variations** :
- Mur droit (1 tile)
- Mur d'angle (L-shape)
- Mur avec fenêtre/meurtrière
- Mur écroulé/ruines

##### Pilier
```
Prompt :
stone pillar, ancient column, carved runes, damaged top, 
isometric game asset, dark fantasy dungeon, 
transparent background, detailed texture, 512x512px
```

**Variantes** :
- Pilier intact
- Pilier brisé (moitié)
- Pilier avec chaînes
- Pilier lumineux (cristal au sommet)

#### 2. **Props Destructibles** 💥

##### Tonneau
```
Prompt :
wooden barrel, medieval fantasy, metal bands, 
slightly damaged, isometric view, game asset, 
dark worn wood, transparent background, 256x256px
```

##### Caisse
```
Prompt :
wooden crate, reinforced corners, iron nails, 
dusty and weathered, isometric game prop, 
medieval fantasy, transparent PNG, 256x256px
```

##### Vase/Urne
```
Prompt :
ancient ceramic urn, cracked surface, decorative patterns, 
isometric view, fantasy RPG asset, moss covered, 
transparent background, 256x256px
```

#### 3. **Décor Statique** 🗿

##### Statue
```
Prompt :
stone statue of warrior, broken arm, moss covered, 
medieval fantasy sculpture, isometric game asset, 
dramatic shadows, transparent background, 512x512px
```

##### Autel
```
Prompt :
sacrificial altar, stone table with blood stains, 
dark ritual symbols, candles, skulls, isometric view, 
dark fantasy RPG, transparent PNG, 512x512px
```

##### Bibliothèque
```
Prompt :
wooden bookshelf, ancient tomes, cobwebs, 
isometric furniture asset, medieval library, 
dark fantasy, transparent background, 512x512px
```

#### 4. **Éléments Interactifs** ⚙️

##### Coffre (fermé)
```
Prompt :
wooden treasure chest closed, iron lock, reinforced corners, 
aged wood, fantasy RPG asset, isometric view, 
detailed texture, transparent background, 256x256px
```

##### Coffre (ouvert)
```
Prompt :
wooden treasure chest open, glowing golden light inside, 
coins and jewels visible, isometric game asset, 
fantasy RPG, magical sparkles, transparent PNG, 256x256px
```

##### Levier
```
Prompt :
stone lever mechanism, ancient device, rusty metal, 
isometric game prop, medieval dungeon, 
two states (up and down), transparent background, 256x256px
```

##### Piège au Sol
```
Prompt :
spike trap floor tile, hidden mechanism, rusty spikes, 
isometric game hazard, dark fantasy dungeon, 
before and after trigger states, transparent PNG, 256x256px
```

#### 5. **Éléments d'Ambiance** 🕯️

##### Torche Murale
```
Prompt :
wall-mounted torch, burning flame, iron holder, 
flickering light, isometric game asset, medieval fantasy, 
animated fire, transparent background, 256x256px
```

##### Brasier
```
Prompt :
stone brazier, burning coals, orange flames, 
metal grate, isometric view, fantasy game prop, 
warm light emission, transparent PNG, 512x512px
```

##### Chandelier
```
Prompt :
hanging chandelier, iron frame, melting candles, 
dripping wax, isometric game asset, gothic fantasy, 
dim light, transparent background, 512x512px
```

### Collection Recommandée (Set Complet)

Pour une arène fonctionnelle, générer au minimum :
- ✅ 3 types de murs (droit, angle, ruines)
- ✅ 2 types de piliers (intact, brisé)
- ✅ 5 props destructibles (tonneaux, caisses, urnes)
- ✅ 2 coffres (fermé, ouvert)
- ✅ 3 éléments d'ambiance (torches, brasiers)
- ✅ 2 statues/décor
- ✅ 1 autel/table

**Total** : ~20 props pour variété maximale

---

## 👥 PERSONNAGES & ENNEMIS

### Spécifications Techniques

**Format** : PNG transparent  
**Dimensions** : 256x256px (standard), 512x512px (héros/boss)  
**Vue** : 3/4 isométrique (légèrement de face)  
**Style** : Portrait sprite avec ombres projetées

### Le Héros (Joueur)

#### Pactisé (Classe de Base)
```
Prompt Leonardo.ai :
dark fantasy warrior character, hooded figure with glowing eyes, 
tattered cloak, leather armor with mystical runes, 
holding cursed sword, isometric character sprite, 
Baldur's Gate 3 style, detailed armor, 
transparent background, 512x512px, centered
```

**Variations d'équipement** :
```
// Armure légère
leather armor, twin daggers, agile stance

// Armure lourde
plate armor, great sword, defensive posture

// Mage corrompu
torn robes, staff with purple crystal, mystical aura
```

#### États Visuels

##### Normal
```
Prompt :
character standing pose, confident stance, weapon ready
```

##### Blessé (< 30% HP)
```
Prompt :
same character, wounded appearance, blood stains, 
tired posture, breathing heavily
```

##### Corrompu (> 66% Corruption)
```
Prompt :
character with dark veins on skin, eyes glowing red, 
purple corruption aura, demonic influence visible
```

### Ennemis Communs

#### 1. **Gobelin Corrompu** 👺
```
Prompt :
corrupted goblin warrior, small creature, rusty blade, 
torn leather armor, evil grin, glowing red eyes, 
isometric enemy sprite, dark fantasy RPG, 
transparent background, 256x256px
```

**Variations** :
- Gobelin archer (arc, flèches)
- Gobelin shaman (bâton, totems)
- Gobelin berserker (deux haches)

#### 2. **Squelette Maudit** 💀
```
Prompt :
undead skeleton warrior, rusty armor pieces, 
broken sword, glowing eye sockets, bones with runes, 
isometric enemy sprite, dark souls style, 
transparent PNG, 256x256px
```

**Variations** :
- Squelette archer
- Squelette mage (robe en lambeaux)
- Squelette chevalier (armure complète)

#### 3. **Cultiste Obscur** 🧙
```
Prompt :
dark cultist, hooded robe with occult symbols, 
face hidden in shadow, holding ritual dagger, 
purple magical aura, isometric enemy sprite, 
dark fantasy, transparent background, 256x256px
```

#### 4. **Démon Mineur** 😈
```
Prompt :
lesser demon, red skin, small horns, clawed hands, 
muscular build, tail with spikes, evil expression, 
isometric enemy, Diablo style, fiery glow, 
transparent PNG, 256x256px
```

#### 5. **Ombre Vivante** 👤
```
Prompt :
shadow creature, semi-transparent dark silhouette, 
wispy edges, glowing white eyes, ethereal form, 
isometric enemy sprite, horror fantasy, 
partially transparent PNG, 256x256px
```

### Boss & Élites

#### Boss : Gardien Corrompu
```
Prompt Leonardo.ai :
massive corrupted guardian boss, 8 feet tall armored knight, 
dark rusted armor with purple corruption veins, 
giant two-handed cursed sword, glowing red eyes in helmet, 
intimidating pose, isometric boss sprite, epic scale, 
dark fantasy RPG, transparent background, 1024x1024px
```

#### Élite : Chevalier Déchu
```
Prompt :
fallen paladin elite enemy, tarnished gold armor, 
broken holy symbols, corrupted holy sword with dark aura, 
torn cape, conflicted expression, isometric sprite, 
Baldur's Gate 3 style, transparent PNG, 512x512px
```

### Checklist Personnages

- ✅ Pose claire et lisible (pas trop de détails fins)
- ✅ Silhouette reconnaissable même en petit
- ✅ Couleurs contrastées (visible sur fond sombre)
- ✅ Ombre projetée au sol (ou à ajouter en code)
- ✅ Centré dans l'image (padding uniforme)
- ✅ Armes/accessoires identifiables
- ✅ Taille cohérente entre ennemis du même tier

---

## 🗡️ ITEMS & ÉQUIPEMENT

### Spécifications Techniques

**Format** : PNG transparent  
**Dimensions** : 64x64px (icônes UI), 128x128px (détails)  
**Style** : Vue 3/4 légèrement isométrique  
**Fond** : Transparent OU cadre décoratif

### Armes

#### Épées
```
Prompt Leonardo.ai :
rusty iron sword, medieval longsword, worn blade, 
leather-wrapped handle, item icon, game asset, 
dark fantasy RPG, isometric view, detailed texture, 
transparent background, 128x128px, centered
```

**Variantes par rareté** :

##### Commune (Grise)
```
rusty sword, chipped blade, common quality
```

##### Non-Commune (Verte)
```
well-maintained sword, slight magical glow, uncommon quality
```

##### Rare (Bleue)
```
enchanted blade, blue magical runes, gleaming steel, rare quality
```

##### Légendaire (Orange)
```
legendary flaming sword, ornate engravings, 
dramatic orange glow, particles, legendary quality
```

#### Autres Armes

**Hache** :
```
battle axe, double-bladed, wooden handle, 
iron head with nicks, item icon, 128x128px
```

**Dague** :
```
assassin dagger, curved blade, dark metal, 
poison vial attached, rogue weapon icon
```

**Arc** :
```
longbow, carved wood, string taut, quiver attached, 
ranger weapon, elegant design
```

**Bâton** :
```
wizard staff, twisted wood, crystal orb on top, 
magical runes carved, arcane weapon icon
```

### Armures

#### Casques
```
Prompt :
iron helmet, medieval great helm, scratched metal, 
leather straps, armor piece icon, item asset, 
dark fantasy, transparent background, 128x128px
```

**Variantes** :
- Capuche de cuir (light)
- Casque à cornes (medium)
- Heaume de chevalier (heavy)

#### Plastrons
```
Prompt :
leather chest armor, reinforced with metal studs, 
worn surface, buckles and straps, armor icon, 
RPG item, transparent PNG, 128x128px
```

#### Gants/Bottes
```
Prompt :
leather gauntlets, fingerless gloves, metal studs, 
armor accessory icon, medieval fantasy, 128x128px
```

### Consommables

#### Potions

**Potion de Soin** 💚
```
Prompt :
health potion, glass vial with red liquid, 
cork stopper, glowing interior, bubbles, 
item icon, RPG consumable, magical effect, 
transparent background, 64x64px
```

**Potion de Mana** 💙
```
Prompt :
mana potion, blue glowing liquid in vial, 
magical sparkles, swirling energy, item icon, 64x64px
```

**Potion d'Antidote** 💚
```
Prompt :
antidote potion, green bubbling liquid, 
snake symbol on label, glass bottle, 64x64px
```

#### Parchemins
```
Prompt :
magic scroll, rolled parchment, glowing runes visible, 
wax seal, tied with ribbon, spell item icon, 
transparent background, 64x64px
```

### Matériaux de Craft

**Minerai de Fer** :
```
iron ore chunk, raw metal, rocky texture, 
crafting material icon, 64x64px
```

**Essence Mystique** :
```
glowing purple crystal, floating particles, 
magical crafting material, ethereal glow, 64x64px
```

**Plante Rare** :
```
glowing mushroom, bioluminescent cap, fantasy herb, 
alchemy ingredient, 64x64px
```

### Trésors

**Pièces d'Or** 💰
```
Prompt :
pile of gold coins, shiny metal, scattered arrangement, 
some coins standing, treasure icon, RPG loot, 
transparent background, 64x64px
```

**Gemmes** 💎
```
Prompt :
precious ruby gemstone, cut and polished, 
red glow, sparkling facets, treasure item, 64x64px
```

### Collection Recommandée

Set complet pour gameplay :
- ✅ 5 armes (épée, hache, dague, arc, bâton)
- ✅ 3 armures par slot (casque, plastron, gants)
- ✅ 4 potions (soin, mana, antidote, buff)
- ✅ 3 parchemins (attaque, défense, utilitaire)
- ✅ 5 matériaux de craft
- ✅ 3 trésors (or, gemmes, reliques)

**Total** : ~25 items pour économie de jeu complète

---

## 💥 EFFETS VISUELS (VFX)

### Spécifications Techniques

**Format** : PNG transparent (séquence d'animation)  
**Dimensions** : 256x256px (effets standards), 512x512px (explosions)  
**Frames** : 6-12 images pour animation fluide  
**Framerate** : 12-24 FPS selon l'effet

### Effets de Combat

#### 1. **Impact de Coup** 💥

**Frame 1-3** :
```
Prompt :
sword slash impact effect, white flash, motion lines, 
frame 1 of 8, game VFX sprite sheet, transparent background, 
256x256px, centered
```

Générer 8 frames en changeant `frame X of 8`

**Animation** : Flash blanc → Étincelles → Dissipation

#### 2. **Explosion de Feu** 🔥

```
Prompt :
fire explosion effect, orange and yellow flames, 
black smoke, frame 1 of 12, game VFX animation, 
spell effect, transparent PNG, 512x512px
```

**Séquence** : Boule → Expansion → Flammes → Dissipation

#### 3. **Splash de Sang** 🩸

```
Prompt :
blood splatter effect, dark red liquid spray, 
droplets flying, frame 1 of 6, combat VFX, 
realistic blood, transparent background, 256x256px
```

#### 4. **Éclair de Foudre** ⚡

```
Prompt :
lightning bolt strike, electric blue energy, 
crackling electricity, branching arcs, frame 1 of 8, 
spell VFX, glowing effect, transparent PNG, 512x512px
```

### Effets de Sorts

#### Boule de Feu
```
Prompt :
fireball projectile, swirling flames, trailing fire, 
spherical shape, glowing core, spell VFX, 
transparent background, 128x128px
```

#### Bouclier Magique
```
Prompt :
magical shield bubble, semi-transparent blue energy, 
hexagonal pattern, shimmering surface, protective spell VFX, 
256x256px, circular shape
```

#### Soin Divin
```
Prompt :
healing magic effect, golden sparkles rising upward, 
soft glow, gentle particles, holy spell VFX, 
warm light, transparent PNG, 256x256px
```

#### Poison/Toxique
```
Prompt :
poison cloud effect, green toxic gas, swirling smoke, 
skull-shaped wisps, debuff VFX, sickly glow, 
transparent background, 256x256px
```

### Effets de Statut

#### Brûlure (Burning)
```
Prompt :
burning status effect, small flames on character, 
fire particles, orange glow, DoT indicator, 
loop animation frame 1 of 6, 128x128px
```

#### Gel (Frozen)
```
Prompt :
frozen status effect, ice crystals forming, 
blue icy shards, frost particles, freeze indicator, 
transparent PNG, 128x128px
```

#### Empoisonné (Poisoned)
```
Prompt :
poison status effect, green bubbles rising, 
toxic drips, sickly aura, debuff indicator, 
128x128px, loop animation
```

### Effets d'Ambiance

#### Particules de Poussière
```
Prompt :
dust particles, floating slowly, subtle movement, 
atmospheric effect, soft lighting, various sizes, 
transparent background, 512x512px
```

#### Brume au Sol
```
Prompt :
ground fog effect, low hanging mist, wispy edges, 
atmospheric smoke, slow movement, ambient VFX, 
transparent PNG, 512x256px wide
```

#### Lucioles Magiques
```
Prompt :
magical fireflies, glowing particles, gentle floating, 
various colors (blue, green, purple), fantasy ambiance, 
transparent background, 256x256px
```

### Collection Recommandée

Effets essentiels pour combat fluide :
- ✅ 3 impacts physiques (slash, crush, pierce)
- ✅ 4 sorts élémentaires (feu, glace, foudre, poison)
- ✅ 2 effets de soin (léger, majeur)
- ✅ 3 statuts (burn, freeze, poison)
- ✅ 2 effets d'ambiance (poussière, brume)

**Total** : ~15 VFX pour combat dynamique

---

## 🎨 UI ELEMENTS

### Le Cadre d'Item (Item Frame)

#### Cadre Commun (Gris)
```
Prompt :
game UI item frame, simple stone border, 
dark gray background, 64x64px slot, medieval fantasy, 
RPG inventory slot, subtle texture
```

#### Cadre Rare (Bleu)
```
Prompt :
rare item frame, ornate blue border, magical glow, 
decorative corners, 64x64px UI slot, fantasy RPG
```

#### Cadre Légendaire (Orange)
```
Prompt :
legendary item frame, glowing orange border, 
intricate golden patterns, particle effects, 
64x64px premium slot, epic quality
```

### Boutons UI

#### Bouton Standard
```
Prompt :
game UI button, medieval style, stone texture, 
metal frame, 3 states (normal, hover, pressed), 
dark fantasy, 200x60px, rounded corners
```

**States à générer** :
- Normal (état par défaut)
- Hover (légèrement illuminé)
- Pressed (enfoncé, ombre inversée)

### Barres de Statut

#### Barre de Vie
```
Prompt :
HP bar UI, red gradient fill, stone border, 
scratched texture, health indicator, RPG interface, 
300x30px, horizontal bar
```

#### Barre de Mana
```
Prompt :
mana bar UI, blue glowing fill, magical particles, 
energy indicator, 300x30px, transparent background
```

### Portraits

#### Cadre de Portrait
```
Prompt :
character portrait frame, ornate gold border, 
decorative corners, medieval fantasy, 128x128px slot, 
detailed engravings, dark background
```

---

## 🎲 LE DÉ DE THALYS

### Concept Artistique

**Thalys** est un dé D6 **vivant**, à la fois **attirant et inquiétant** :
- 👁️ Œil central rouge brillant (conscient)
- 🦴 Texture ivoire ancien (os/dent)
- 🔮 Aura violette mystique
- ⚡ Gravures runiques qui pulsent

### Faces du Dé (1 à 6)

Chaque face nécessite une image séparée :

#### Face 1 ⚀
```
Prompt Midjourney :
cursed dice face showing number 1, ancient ivory texture, 
single blood-red dot, dark engravings, occult symbols around edge, 
ominous atmosphere, product photography, centered, 
square format, 512x512px --v 6 --ar 1:1
```

#### Face 2 ⚁
```
Prompt :
cursed dice face showing number 2, bone texture, 
two crimson dots arranged diagonally, mystical runes, 
dark fantasy artifact, dramatic lighting --v 6 --ar 1:1
```

#### Face 3 ⚂
```
Prompt :
cursed dice face showing number 3, weathered ivory, 
three red dots in diagonal line, glowing faintly, 
ancient occult dice, sinister details --v 6 --ar 1:1
```

#### Face 4 ⚃
```
Prompt :
cursed dice face showing number 4, cracked bone surface, 
four blood dots in corners, pulsing with dark energy, 
demonic artifact, gothic horror style --v 6 --ar 1:1
```

#### Face 5 ⚄
```
Prompt :
cursed dice face showing number 5, aged ivory texture, 
five glowing red dots (four corners + center), 
arcane symbols, unholy relic, dramatic shadows --v 6 --ar 1:1
```

#### Face 6 (Thalys) 👁️
```
Prompt Midjourney :
cursed dice face showing demonic eye, large glowing red eye, 
intricate iris details, ancient bone texture, 
dark veins spreading from eye, eldritch horror, 
malevolent gaze, occult artifact, cinematic lighting, 
Warhammer 40k style, 512x512px --v 6 --ar 1:1 --stylize 850
```

**Variations de l'Œil** :
```
// Œil normal (0-33% Corruption)
calm demonic eye, subtle red glow

// Œil agité (34-66% Corruption)
intense demonic eye, brighter red, visible veins

// Œil enragé (67-100% Corruption)
furious demonic eye, blazing red, cracks spreading, 
smoke emanating, possessed state
```

### États du Dé Complet

#### Dé au Repos (3D View)
```
Prompt Leonardo.ai :
cursed D6 dice 3D model, ancient ivory bone texture, 
single glowing red eye visible on top face, 
dark engravings on all sides, floating in void, 
purple mystical aura surrounding it, particles, 
dramatic lighting from above, dark fantasy artifact, 
transparent background, 512x512px
```

#### Dé en Rotation (Animation Frames)
Générer 12 frames :
```
Prompt :
cursed dice rotating, frame 1 of 12, tumbling motion, 
motion blur on edges, purple particle trail, 
transparent background, animation sprite
```

#### Aura du Dé (Overlay)

**Aura Pure** (0-33% Corruption) :
```
soft purple glow, gentle particles, subtle aura
```

**Aura Corrompue** (34-66%) :
```
intense violet energy, swirling particles, pulsing rhythm
```

**Aura Profanée** (67-100%) :
```
dark crimson and purple flames, chaotic energy, 
ominous presence, reality distortion effect
```

### Expressions de Thalys (Eye States)

#### Neutre
```
calm demonic eye, observing, waiting
```

#### Tentateur
```
sly demonic eye, seductive gaze, inviting
```

#### Satisfait
```
pleased demonic eye, slight smile in iris, content
```

#### Furieux
```
enraged demonic eye, dilated pupil, bloodshot
```

#### Endormi (Inactif)
```
closed demonic eye, peaceful, dormant state
```

---

## 🔄 WORKFLOW DE PRODUCTION

### Étape 1 : Planification

1. **Lister les assets nécessaires** pour la prochaine session
2. **Prioriser** : Critique → Important → Nice-to-have
3. **Grouper** les assets similaires (batch generation)

### Étape 2 : Génération

#### Setup Leonardo.ai (Recommandé)

1. Créer un **Nouveau Projet** : "The Last Covenant"
2. Sélectionner modèle **RPG 4.0**
3. Activer **Alchemy** + **Transparent Background**
4. Définir dimensions selon type :
   - Arènes : 1024x1024
   - Props : 512x512
   - Items : 128x128
   - Icons : 64x64

#### Batch Generation

Pour générer plusieurs variations d'un coup :
```
Prompt template :
[BASE_PROMPT], 5 variations, different [ASPECT], 
same style and angle, game asset pack
```

Exemple :
```
wooden barrel, medieval fantasy, isometric view, 
5 variations, different damage levels, 
transparent background, game asset pack
```

### Étape 3 : Post-Processing

1. **Download** tous les assets générés
2. **Upscale** si résolution insuffisante (Upscayl)
3. **Remove background** si nécessaire (Remove.bg)
4. **Retouches** mineures (Photopea) :
   - Ajuster contraste
   - Corriger couleurs
   - Crop précis
   - Ajout d'effets (glow, shadow)

### Étape 4 : Organisation

```bash
# Renommer selon convention
[type]_[nom]_[variant].png

Exemples :
prop_barrel_intact.png
prop_barrel_broken.png
enemy_goblin_warrior.png
enemy_goblin_archer.png
item_sword_rusty.png
item_sword_enchanted.png
vfx_fire_explosion_01.png (frame 1)
vfx_fire_explosion_12.png (frame 12)
```

### Étape 5 : Intégration

1. **Placer** dans le bon dossier `assets/images/`
2. **Tester** in-game immédiatement
3. **Ajuster** si besoin (taille, couleurs, contraste)
4. **Commit** dans le repo avec message descriptif

### Étape 6 : Documentation

Mettre à jour `ASSETS_INVENTORY.md` :
```markdown
## Props - Barrels
- `prop_barrel_intact.png` (256x256) ✅
- `prop_barrel_broken.png` (256x256) ✅
- `prop_barrel_exploded.png` (256x256) ❌ TODO

Generated with: Leonardo.ai RPG 4.0
Prompt: "wooden barrel, medieval fantasy..."
```

---

## 📚 TEMPLATES DE PROMPTS

### Template Universel

```
[OBJECT_TYPE] [DESCRIPTION], 
[MATERIAL/TEXTURE], [DETAILS], 
[STYLE_REFERENCE] (Baldur's Gate 3 / Diablo 4 / Dark Souls), 
[VIEW] (isometric / top-down / 3/4 view), 
[TECHNICAL] (game asset / transparent background / 512x512px), 
[MOOD/LIGHTING] (dark fantasy / dramatic lighting)
```

### Exemples Appliqués

#### Arène
```
isometric dungeon room, ancient stone crypt, 
cracked marble floor with blood stains, 
four burning torch pillars, glowing runic circle in center, 
Baldur's Gate 3 art style, top-down isometric view, 
game background asset, 1024x1024px, 
dark atmospheric lighting, purple and orange tones
```

#### Prop
```
wooden treasure chest, reinforced iron corners, 
aged oak wood with scratches, rusty lock, 
medieval fantasy RPG, isometric 3/4 view, 
game asset with transparent background, 512x512px, 
moody lighting, detailed texture
```

#### Ennemi
```
corrupted goblin warrior, small humanoid creature, 
green rotting skin, rusty iron blade, torn leather armor, 
glowing red eyes, evil grin, 
Diablo 4 enemy style, isometric character sprite, 
transparent PNG, 256x256px, centered, 
dark fantasy atmosphere, rim lighting
```

#### Item
```
enchanted longsword, glowing blue blade, 
ornate silver crossguard, leather-wrapped grip, 
magical runes etched on steel, 
RPG legendary weapon, item icon view, 
transparent background, 128x128px, centered, 
dramatic lighting, epic quality glow
```

#### VFX
```
fire explosion effect, orange and yellow flames, 
black smoke billowing, debris particles, 
frame 1 of 12 animation sequence, 
game spell VFX, transparent PNG, 512x512px, 
cinematic impact, motion blur
```

---

## 💡 TIPS & ASTUCES

### Prompting Avancé

#### Mots-Clés de Qualité
Ajouter pour améliorer le rendu :
- `highly detailed`
- `professional game art`
- `AAA quality`
- `4K textures`
- `cinematic lighting`
- `dramatic atmosphere`
- `trending on ArtStation`

#### Mots-Clés de Style
```
// Dark Fantasy
dark souls style, gothic horror, grimdark, ominous

// Epic Fantasy
heroic fantasy, high fantasy, Tolkien inspired

// Diablo-like
demonic, hellish, infernal, dark medieval

// Baldur's Gate
D&D inspired, forgotten realms, classic RPG

// Darkest Dungeon
lovecraftian, eldritch horror, psychological horror
```

#### Contrôle de la Caméra
```
isometric view         → Vue 45° diagonale
top-down view          → Vue de dessus strict
3/4 view              → Vue trois-quarts
bird's eye view        → Vue d'oiseau
eye level             → Hauteur des yeux
low angle             → Contre-plongée (héroïque)
high angle            → Plongée (vulnérable)
```

#### Contrôle de l'Éclairage
```
dramatic lighting      → Contraste fort
rim lighting          → Contour lumineux
ambient occlusion     → Ombres réalistes
volumetric lighting   → Rayons de lumière
god rays              → Rais de lumière divins
chiaroscuro           → Clair-obscur dramatique
```

### Erreurs Courantes à Éviter

❌ **Prompt trop court** : "dark sword"
✅ **Prompt détaillé** : "rusty iron longsword, medieval fantasy..."

❌ **Trop de concepts** : "sword and shield and armor and helmet..."
✅ **Un objet à la fois** : Focus sur l'épée, générer le bouclier séparément

❌ **Angles incohérents** : Mélanger isométrique et face
✅ **Angle uniforme** : Toujours spécifier "isometric view"

❌ **Résolution inadaptée** : 64x64 pour un background
✅ **Résolution correcte** : 1024x1024 pour arènes, 512 pour props

❌ **Oublier la transparence** : Fond blanc/noir sur props
✅ **Spécifier** : "transparent background" ou activer l'option

### Optimisation pour le Jeu

#### Taille de Fichier
- **Arènes** : JPG qualité 85% (fond opaque, OK pour compression)
- **Props/Sprites** : PNG-8 si < 256 couleurs, sinon PNG-24
- **Icons** : PNG-8 optimisé (TinyPNG.com)
- **VFX** : PNG-24 avec alpha (important pour blend modes)

#### Résolution Finale
Même si généré en haute résolution, exporter en :
- **Arènes** : 1024x1024 ou 1536x1536 (selon détails)
- **Props** : 256x256 ou 512x512
- **Items** : 64x64 ou 128x128
- **VFX** : 256x256 (animations) ou 512x512 (explosions)

#### Nomenclature
```
[category]_[name]_[variant]_[state].png

Exemples :
arena_crypt_01.jpg
arena_crypt_02.jpg
prop_barrel_wood_intact.png
prop_barrel_wood_broken.png
enemy_goblin_warrior_idle.png
enemy_goblin_warrior_attack.png
item_sword_iron_common.png
item_sword_steel_rare.png
vfx_explosion_fire_01.png
vfx_explosion_fire_12.png
```

---

## 🎬 PROMPT MASTER LIST

### Arènes Complètes (Copy-Paste Ready)

```
1. CRYPTE ANCIENNE
isometric dungeon room, ancient stone crypt, cracked marble floor, four burning torch pillars in corners, glowing purple runic circle in center, gothic arches, cobwebs, skulls scattered, Baldur's Gate 3 art style, top-down view, dark atmospheric lighting, 1024x1024px

2. TEMPLE MAUDIT
isometric temple chamber, cursed sanctuary, broken stained glass windows, shattered altar with ritual symbols, four ornate pillars with demonic carvings, blood stains on floor, Diablo 4 style, ominous red lighting, 1024x1024px

3. CAVERNE PROFONDE
isometric underground cave arena, natural stone walls, stalactites, glowing mushrooms, crystal formations, underground stream, bioluminescent plants, dark souls atmosphere, moody blue-green lighting, 1024x1024px

4. FORGE INFERNALE
isometric demon forge room, lava pools, blacksmith anvils, burning braziers, metal grate floor, chains hanging, industrial medieval fantasy, hellish red-orange lighting, 1024x1024px

5. BIBLIOTHÈQUE INTERDITE
isometric forbidden library, towering bookshelves, scattered ancient tomes, floating books, circular reading area with summoning circle, candelabras, purple arcane glow, 1024x1024px
```

### Props Essentiels (Copy-Paste Ready)

```
1. MUR DE PIERRE
stone wall segment, medieval dungeon, cracked bricks, moss and vines, isometric view, game asset, transparent background, 512x512px

2. PILIER ANCIEN
ancient stone pillar, carved runes, damaged capital, gothic column, isometric game prop, transparent PNG, 512x512px

3. TONNEAU EN BOIS
wooden barrel, medieval fantasy, iron bands, weathered oak, isometric view, game asset, transparent background, 256x256px

4. CAISSE RENFORCÉE
wooden crate, reinforced corners, iron nails, dusty surface, isometric game prop, transparent PNG, 256x256px

5. COFFRE AU TRÉSOR
treasure chest closed, iron lock, reinforced corners, aged wood, fantasy RPG asset, isometric view, transparent background, 256x256px
```

### Ennemis Standards (Copy-Paste Ready)

```
1. GOBELIN CORROMPU
corrupted goblin warrior, small creature, rusty blade, torn leather armor, evil grin, glowing red eyes, isometric enemy sprite, dark fantasy, transparent background, 256x256px

2. SQUELETTE MAUDIT
undead skeleton warrior, rusty armor pieces, broken sword, glowing eye sockets, bones with dark runes, isometric sprite, transparent PNG, 256x256px

3. CULTISTE OBSCUR
dark cultist enemy, hooded robe with occult symbols, face hidden in shadow, ritual dagger, purple aura, isometric sprite, transparent background, 256x256px

4. DÉMON MINEUR
lesser demon, red skin, small horns, clawed hands, muscular build, tail, evil grin, isometric enemy, Diablo style, transparent PNG, 256x256px

5. OMBRE VIVANTE
shadow creature, semi-transparent dark silhouette, wispy edges, glowing white eyes, ethereal form, isometric enemy sprite, partially transparent PNG, 256x256px
```

---

## 🏆 CHECKLIST DE PRODUCTION

### Avant de Générer
- [ ] Prompt rédigé et détaillé
- [ ] Style de référence spécifié
- [ ] Dimensions définies
- [ ] Transparence activée (si nécessaire)
- [ ] Angle de vue cohérent avec le projet

### Après Génération
- [ ] Image téléchargée en haute qualité
- [ ] Background retiré (si nécessaire)
- [ ] Résolution vérifiée
- [ ] Contraste/couleurs ajustés
- [ ] Fichier renommé selon convention
- [ ] Placé dans le bon dossier

### Intégration
- [ ] Testé in-game
- [ ] Taille à l'écran correcte
- [ ] Couleurs cohérentes avec le reste
- [ ] Performance OK (taille fichier)
- [ ] Documenté dans l'inventaire

---

## 📊 TABLEAU RÉCAPITULATIF

| Asset Type | Format | Dimensions | Transparence | Outil | Priorité |
|------------|--------|------------|--------------|-------|----------|
| Arènes | JPG | 1024-1536px | Non | Leonardo/Bing | 🔥 Haute |
| Props | PNG | 256-512px | Oui | Leonardo | 🔥 Haute |
| Ennemis | PNG | 256px | Oui | Leonardo | 🔥 Haute |
| Items | PNG | 64-128px | Oui | Leonardo | ⚡ Moyenne |
| VFX | PNG | 256-512px | Oui | Leonardo | ⚡ Moyenne |
| UI | PNG | 64px | Oui | Leonardo | 💡 Basse |

---

## 🎓 RESSOURCES SUPPLÉMENTAIRES

### Inspiration Visuelle
- **ArtStation** : https://artstation.com (chercher "isometric game assets")
- **OpenGameArt** : https://opengameart.org (assets gratuits de référence)
- **itch.io** : https://itch.io/game-assets (packs d'assets)

### Outils Complémentaires
- **Sprite Sheet Packer** : TexturePacker (gratuit pour projets perso)
- **Animation** : Aseprite ($19.99, pixel art + animations)
- **Tilemap Editor** : Tiled (gratuit, open-source)

### Apprentissage
- **YouTube Channels** :
  - "Game Endeavor" (game asset creation)
  - "Pixel Pete" (sprite tutorials)
  - "Saultoons" (isometric art)

---

## 🎉 CONCLUSION

Tu as maintenant **TOUT** pour produire des assets AAA pour ton jeu :
- ✅ 10+ outils IA recommandés avec URLs
- ✅ 100+ prompts prêts à l'emploi
- ✅ Workflows de production optimisés
- ✅ Nomenclature et organisation professionnelles
- ✅ Tips avancés pour la qualité maximale

**Va créer des trucs MAGNIFIQUES ! 🔥🎨**

---

*Document créé le 30/12/2024*  
*Pour THE LAST COVENANT - Dark Fantasy RPG*  
*Version 1.0 - Production Guide*
