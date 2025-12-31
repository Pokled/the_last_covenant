You are implementing a turn-based tactical combat system inspired by Solasta,
using a SINGLE D6 dice.

Core rules:
- Only one D6 exists in the entire system.
- Faces 1–6 are the normal visible faces.
- A hidden face exists: "Thalys", the god of corrupted fate.
- The hidden face cannot appear unless the player signs a Pact.
- Signing a Pact always increases Corruption.

Combat loop requirements:

PLAYER TURN
1. Start of turn
   - Apply status effects
   - Read current Corruption level
   - Determine Dice State (Pure / Altered / Profaned)

2. Player chooses an action
   - Attack / Skill / Spell / Defense
   - Target selection
   - Action defines a single D6 roll and a success threshold

3. Pact Window (optional, before rolling)
   - Player may sign ONE Pact per action
   - Examples of Pacts:
     - Minor Alteration: allow reroll → +1 corruption
     - Targeted Bias: if roll is 1–2, replace by Thalys → +2 corruption
     - Divine Mark: Thalys replaces any face → +3 corruption

4. Dice Roll
   - Roll the single D6
   - Possible outcomes:
     - 1–6 normal faces
     - Thalys (only if a Pact is active)
   - Higher corruption increases the chance of Thalys appearing

5. Thalys Resolution (if revealed)
   - Player chooses ONE effect:
     - Amplify attack power
     - Absolute defense
     - Manipulate enemy roll
   - Each choice adds additional corruption

6. Action Resolution
   - Compare roll vs threshold
   - Apply damage, defense, effects
   - Apply corruption changes

7. End of player turn
   - Update HP, corruption
   - Check corruption thresholds and mutations
   - Remove defeated units

ENEMY TURN
1. Start of enemy turn
   - Apply effects
   - Enemy reacts to player corruption level

2. Enemy action selection (AI)
   - No pacts, but affected by corruption

3. Dice Roll
   - Enemy rolls the same D6
   - At high corruption, Thalys may appear against the player

4. Thalys Hostile Effect (if triggered)
   - Forced effect (critical hit, inversion, corruption gain)

5. Resolution
   - Apply damage and effects

6. End of enemy turn
   - Update states
   - Return to player turn

END OF COMBAT
- Victory: all enemies defeated
- Defeat: player HP = 0 OR corruption reaches maximum (possession by Thalys)

Generate clean, modular, readable code or systems that follow this exact loop.
Prefer explicit state machines and deterministic steps.
