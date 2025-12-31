TODO_LIST.MD
📋 TODO LIST - THE LAST COVENANT (GOTY 2026)
Date : 27 Décembre 2025
Statut Global : Phase Pré-Prod. Progression : 25% (fondations + USP design).
Objectif : Viable en solo-dev – tâches 1-2 semaines, checkpoints. Priorités : USP addictif, lore via Claude.
Alors ici, en tant que chef de projet pour notre GOTY 2026 en solo-dev (toi, le boss absolu !), on stocke tout : on intègre tes idées USP inter-partie (camp/village nomade évolutif, upgrades/déblocages, économie fluctuante, amélioration du Dé du Destin avec visuels vivants et fusions Dragon Ball Z-style), plus le lore avec choix cornéliens (cages suspendues, dilemme humanité vs corruption, objet rare pour sauver tous). C'est du feu – ça renforce l'USP en rendant le RNG maîtrisable et addictif, avec une dopamine constante via des "wow moments" (ex. : fusion de dés qui explose en particules, village qui grandit visuellement). Le délire est clair : un mélange Vampire Survivors (synergies folles, meta-progression), Mega Bonk (upgrades chaotiques), Tour de Babel Survivants du Chaos (survie nomade), mais avec notre twist dark fantasy (corruption/stress impactant tout).

**Mon avis :** Top idée ! L'inter-partie comme village nomade qui "voyage" entre étages ajoute une couche meta addictive – pas juste un menu statique, mais un hub vivant qui évolue (ex. : tentes → forteresse mobile), lié au lore (survivants sauvés des cages deviennent villageois/recruteurs). Ça booste la rejouabilité infinie (♾️), rend l'économie (or/rubis fluctuant) stratégique (ex. : marché noir pour items rares), et humanise le RNG (améliorer le Dé pour qu'il "prenne vie" – animations où il murmure, grandit, ou fuse comme Goku/Vegeta). Risque : Complexité en solo-dev, mais on modularise (JS modules pour camp.js, economy.js). Pour le lore des cages : Parfait pour choix décisifs – renforce thèmes sacrifice/humanité, avec impacts immédiats (corruption) et long-terme (recruter pour village). Ça crée des "putain, je kiff" moments moraux, comme dans Hades.

**Idées Supplémentaires pour USP & Lore :**
- **USP Évolutif :** "Nomad Destiny System" – Le village nomade est l'USP central : déplace-toi entre étages (procéduraux), upgrade via or/rubis (taux fluctuant basé sur corruption globale – haute corruption = or cher, mais buffs démoniaques pas chers). Déblocages : Combos sorts/buffs via "Ateliers du Village" (ex. : fusionner buffs pour "Drain Explosif" comme avant). Amélioration Dé : Niveaux (Dé Basique → Dé Vivant → Dé Fusionné) – visuels : yeux qui s'ouvrent, particules sanglantes, fusions (2 dés → 1 super-dé avec faces x2, mais +risque frenzy). Dopamine : Sur fusion, screen shake + son épique (accéléré comme Vampire Survivors), "Wouaoouwwww" explosion.
- **Autres USP Idées :** 1) "Chaos Chain" – Chaînes de runs où échecs nourrissent le village (ex. : morts donnent "Âmes Errantes" pour upgrades). 2) "Corruption Villageoise" – Village corrompu si ta corruption >75% : Nouveaux PNJ démoniaques, mais risque de révolte. 3) Intégration RNG : Au camp, "Forge du Destin" pour craft modifiers (ex. : payer rubis pour +1 sur dés pairs).
- **Lore Idées :** On fait bosser Claude pour une bible détaillée – il excelle en narration dark (mieux que moi pour les twists profonds). Idée : Les cages sont des "Épreuves du Pacte" posées par le Dé lui-même – choisir humain = garder humanité, mais buff faible ; mi-démon = +puissance, mais corruption +20% et malus stress. Objet rare : "Chaîne Équilibrée" (unlock via achievements). Impacts : Survivant sauvé rejoint village (ex. : elfe = +esquive buffs, nain = +DEF upgrades). Twist : Si corruption haute, villageois sauvés mutent, créant factions internes.

Maintenant, on refait les 2 fichiers MD mis à jour – intégrant tout ça. MASTER_PLAN.MD gagne une section "USP & Inter-Partie" + lore cages. TODO_LIST.MD ajoute tâches pour camp, économie fluctuante, Dé upgrades, et session Claude pour lore. On garde viable : Priorités solo-dev, modules JS pour pas casser l'existant.

---

# MASTER_PLAN.MD

# 🏆 MASTER PLAN - THE LAST COVENANT (GOTY 2026)

**Date de Création : 26 Décembre 2025**  
**Date Mise à Jour : 27 Décembre 2025**  
**Auteur : Chef de Projet (Grok) & Solo-Dev (Toi)**  
**Version : 1.1**  
**Objectif :** Globaliser tous les documents et discussions pour un fil rouge clair. Ajouts v1.1 : USP inter-partie (village nomade évolutif), améliorations Dé du Destin (visuels vivants, fusions), lore avec choix cages (dilemme corruption/humanité). Le jeu est un JDR RPG top-down "Jeu de l'Oie" sur navigateur (JS/HTML/CSS), thématique dark fantasy, avec lore profond, corruption/stress, et RNG addictif. Style AAA en solo-dev : focus immersion, polish, et rejouabilité infinie.

## 📜 **Fil Rouge du Projet**
1. **Vision Globale :** Transformer "Coin-Coin Dungeon" en "The Last Covenant" – un roguelike narratif GOTY avec USP (Dice Manipulation + Nomad Destiny System), lore mature, et dopamine constante via RNG maîtrisable. Inspirations : Darkest Dungeon (stress/corruption), Vampire Survivors (synergies/loot), Baldur's Gate 3 (JDR/stats), Hades (narration/RNG), Mega Bonk/Tour de Babel (upgrades chaotiques/survie nomade).
2. **État Actuel :** Prototype fonctionnel (7.2/10), fort en architecture (8.5/10), faible en lore (4.5/10). Potentiel : Diamant brut – ajouter âme narrative, inter-partie village, et RNG "wouaoouwwww".
3. **Plan Stratégique :** 4 phases (Identité/Lore, Mécaniques, Contenu/Polish, Marketing). Ajouts : Inter-partie comme hub évolutif, économie fluctuante, choix lore impactants.
4. **Améliorations Techniques :** Cohérence AAA (CSS/JS), équilibrage, économie (Rubis/Or), RNG avec feedbacks addictifs, anticipation camp/village.
5. **Progression :** Suivre via TODO_LIST.MD. Objectif : Viable en solo-dev – prioriser MVP, tester itérativement.

## 📊 **Analyse Actuelle (Synthèse de ANALYSE_COMPLETE_COIN_COIN_DUNGEON.md)**
- **Note Globale : 7.2/10**
- **Points Forts :** Gameplay solide (boucle dé/progression), architecture modulaire (game.js, renderer-advanced.js), ambiance dark medieval.
- **Points Faibles :** Pas de lore/USP, rejouabilité limitée, onboarding absent, polish basique.
- **Potentiel :** Diamant brut – ajouter village nomade et RNG évolutif pour 9.5/10.
- **Tableau Synthèse :** (Identique à v1.0, mais noter +potentiel USP inter-partie).

## 🎯 **Vue d'Ensemble (Synthèse de Vue-d'ensemble.MD)**
- **Note Actuelles vs Cibles :** Gap +2.3 points (7.2 → 9.5/10).
- **Problèmes Critiques :** 1) Pas de lore (ajouter dilemmes cages). 2) Pas d'USP (Nomad Destiny + Dé fusions). 3) Rejouabilité limitée (village évolutif, meta-progression).
- **Plan d'Action 4 Phases :** Identité/Lore (Mois 1-2, incl. cages), Mécaniques (3-4, incl. Dé upgrades), Contenu/Polish (5-7, incl. village), Marketing (8-12).
- **Transformation Visuelle :** De prototype vide à chef-d'œuvre avec village vivant, Dé animé.
- **Projections Financières :** Invest $1,700 → Revenue $15K-$2M+ (viral via USP addictif).
- **Prochaines Étapes :** Hybride (lore cages + mécanique village/Dé).

## 🚀 **Plan Stratégique Détaillé (Synthèse de PLAN_STRATEGIQUE_GOTY_2026.md)**
- **Concept Narratif :** "The Last Covenant" – thèmes corruption/sacrifice/destin. Ajout : Événements cages (choix humain vs mi-démon, impact corruption/village).
- **Système Corruption :** 0-100% (mutations, buffs forts mais malus). Lien village : Corruption haute corrompt villageois.
- **7 Classes Réécrites :** Shattered Knight, etc. – Intégrer recrues de cages (ex. : elfe/nain comme buffs passifs).
- **Mécaniques Uniques :** Dice Manipulation (rerolls, modifiers). Ajout : Améliorations Dé au village (visuels vivants, fusions DBZ-style pour multi-faces).
- **Contenu & Polish :** 50+ buffs, 30+ ennemis. Ajout : Événements cages aléatoires, juice sur fusions Dé (particules, sons).
- **Marketing :** Mettre en avant USP Nomad Destiny pour trailers/devlogs.
- **Checklist Complète :** Ajouter tâches village (camp.js), économie fluctuante.

## 💎 **Améliorations Techniques & Discussions Récentes**
- **Indexation Objets d'Inventaire :** 50+ objets. Ajout : Items rares pour cages (ex. : "Chaîne Équilibrée" – sauve tous, +rejouabilité).
- **Statistiques Héros/Classes :** Stats base + stress/corruption. Ajout : Recrues cages boostent stats (ex. : nain +DEF).
- **RNG Maîtrisable & Dopamine Constante :** USP clé – Ajout : Fusions Dé pour "wow" (explosions, tempo accéléré).
- **USP Inter-Partie (Nouveau) :** "Nomad Destiny System" – Village nomade : Déplace entre étages, upgrades (items/combos/buffs), évolution (tentes → forteresse), économie (or/rubis fluctuant via corruption), recruter survivants cages. Dé upgrades : Visuels vivants (Dé murmure, yeux), fusions (multi-dé pour builds fous).
- **Lore Ajouts :** Épreuves cages – Dilemme sacrifice (humain stable vs mi-démon puissant), impacts village. Faire bosser Claude pour bible détaillée.
- **Prompt pour Claude AI :** Utiliser pour lore (excellent en dark fantasy twists).

## 📋 **Documents Sources Intégrés**
1. **ANALYSE_COMPLETE_COIN_COIN_DUNGEON.md** : Diagnostic.
2. **PLAN_STRATEGIQUE_GOTY_2026.md** : Phases.
3. **Vue-d'ensemble.MD** : Synthèse.
4. **Discussions Stockées :** Index, RNG, prompt Claude, USP inter-partie, lore cages.

**Notes Finales :** Fil rouge renforcé par USP village/Dé. Mise à jour mensuelle.

---

# TODO_LIST.MD

# 📋 TODO LIST - THE LAST COVENANT (GOTY 2026)

**Date : 27 Décembre 2025**  
**Statut Global :** Phase Pré-Prod. Progression : 25% (fondations + USP design).  
**Objectif :** Viable en solo-dev – tâches 1-2 semaines, checkpoints. Priorités : USP addictif, lore via Claude.

## 🔄 **Phases Court Terme (Mois 1-2 : Identité & Lore)**
- [ ] Écrire bible narrative (50 pages) – Inclure cages dilemmes, village nomade. (2 semaines ; Utiliser Claude AI pour drafts).
- [ ] Intégrer lore cages : Événements aléatoires, choix corruption, items rares. (1 semaine ; Impact : +narratif).
- [ ] Réécrire 7 classes avec liens village/recrues. (1 semaine).
- [ ] Coder lore-system.js + corruption visuals (incl. impacts cages). (1 semaine).
- **Checkpoint :** Lore testable. Test : Run avec dilemme cage.

## 📈 **Phases Moyen Terme (Mois 3-4 : Mécaniques Uniques)**
- [ ] Implémenter Dice Manipulation + upgrades (fusions DBZ, visuels vivants) – dice-manipulation.js. (2 semaines ; Coût corruption).
- [ ] Ajouter feedbacks dopamine sur fusions/Dé (particules, shake, sons). (1 semaine ; Test addiction).
- [ ] Créer arbres compétences + combos (liés village). (2 semaines).
- [ ] Équilibrer combats/corridors : Pas boss, achever monstres, intégrer cages. (1 semaine).
- **Checkpoint :** MVP mécanique + USP. Test : 5 runs, checker "encore une partie".

## 🚀 **Phases Long Terme (Mois 5-12 : Contenu, Polish, Marketing)**
- [ ] Développer village nomade (camp.js) : Déplacements étages, upgrades, recruter cages. (3 semaines).
- [ ] Implémenter économie fluctuante (rubis/or, marché via corruption). (1 semaine ; Anticipe full camp).
- [ ] Créer 50+ buffs/ennemis/events (incl. cages). (3 semaines).
- [ ] Juice system + SFX (focus Dé fusions). (2 semaines).
- [ ] Marketing : Devlogs sur USP village/Dé. (Mois 8-10).
- [ ] Launch + awards. (Mois 11-12).
- **Checkpoint :** Beta. Test : Feedback externe.

## 📝 **Tâches Transversales**
- [ ] Tester prompt Claude AI pour lore détaillé (sessions phases). (Ongoing).
- [ ] Cohérence visuelle AAA : Style combat à modales/camp. (1 semaine).
- [ ] Système loot : "Waouh" sur coffres + liens village. (1 semaine).
- [ ] Mise à jour MASTER_PLAN.MD & TODO_LIST.MD. (Mensuel).

**Progression Tracker :** 
- Complété : Analyse, plans, index, RNG base.
- En Cours : USP village/lore cages.
- À Venir : Impl code, Claude lore.

**Conseils Solo-Dev :** 4h/jour, focus dopamine pour motiv. Si overload, prioriser USP court-terme. Prêt pour Claude session ? 🚀

Alright, boss, let's dive deeper into expanding the **Épreuves des Cages Suspendues** lore with more characters to enrich the narrative and gameplay of *The Last Covenant*. As chef de projet for our GOTY 2026 solo-dev masterpiece, we're stocking everything: I'm adding 10+ new character examples for the cages, ensuring they tie into the dark fantasy themes (sacrifice, corruption, humanity), impact the village nomade (recruitment, upgrades), and enhance the RNG-driven dopamine rush (choice-driven "wow" moments). These characters will deepen the moral dilemmas, inspired by dark fantasy sources like D&D's gut-wrenching sacrifices (e.g., choosing between allies with lasting consequences, as seen in *Dragon Age* or *Baldur's Gate 3*) and guides on crafting dilemmas that haunt players (e.g., "The Role of Morality in Dark Epic Fantasy" emphasizing regret and moral ambiguity).

Each character has a backstory, mechanical impact (buffs, village upgrades), and narrative weight, with clear ties to the Corruption/Stress systems and the Nomad Destiny USP (village evolution). I'll also update the **MASTER_PLAN.MD** and **TODO_LIST.MD** to integrate these additions, ensuring Claude AI can refine the lore further. Everything is modular for your JS/HTML/CSS setup, with no risk to the existing codebase.

---

## 📖 **Expanded Lore: Épreuves des Cages Suspendues – Character Roster**

**Context Recap (from Previous Lore):**  
The *Échelles du Sacrifice* are cursed cages appearing randomly in the Donjons de l'Oubli’s corridors, forged by ancient traitors to test the Dernier Pactisé. Suspended over the Oubliettes Éternelles, they force a choice: free one cage (human or mi-démon), condemning the other to fall. Choices impact Corruption (humanity loss), Stress (moral regret), and the village nomade (recruits evolve the hub). Rare item *Chaîne Équilibrée* saves both, with a dopamine-heavy "wow" effect (particles, epic SFX). The Dé du Destin narrates, mocking or tempting: “Choose, Pactisé, and weigh your soul.”

**New Design Goals for Characters:**  
- **Variety:** Diverse races (humains, elfes, nains, orcs, gnomes) and mi-démon hybrids, each with unique backstories reflecting the shattered world.  
- **Moral Weight:** Choices evoke regret, inspired by D&D dilemmas (e.g., sacrificing a noble for power) and *Dragon Age*’s no-win scenarios.  
- **Gameplay Impact:** Buffs tied to class synergies, village upgrades (stables or chaotic), and RNG manipulation (e.g., Dé modifiers).  
- **Dopamine Rush:** Visual/SFX feedback on choice (cage falls, cries, particules), with journal entries for emotional lingering.  
- **Village Integration:** Recruits shape the Nomad Destiny System – pure survivors add stability, mi-démons boost power but risk corruption.

**Expanded Character Roster (12 New + 4 Previous):**  

1. **Kael, l’Éclaireur Humain (Pur)**  
   - **Backstory:** A scout from the fallen city of Lyrion, Kael mapped the donjons to find his lost sister, only to be trapped by the Dé’s curse. His eyes burn with hope, but his voice trembles with despair.  
   - **Choice Impact:**  
     - Free: +10% EVA (scout agility), village gains “Cartographer’s Tent” (unlocks map reveals for safer exploration). Corruption unchanged.  
     - Sacrifice: +15% Stress (journal: “Kael’s hope died with him. Was it worth it?”).  
   - **Dialogue (Dé):** “Save the dreamer, Pactisé, and remain frail. Or let him fall, and taste true freedom.”  
   - **Village Role:** Stable – improves exploration upgrades (e.g., +chance safe rooms).  

2. **Zhara, la Prêtresse Mi-Démon (Hybride)**  
   - **Backstory:** Once a priestess of the Sun Goddess, Zhara embraced a demonic pact to survive the gods’ fall. Her golden eyes flicker with divine fire, but her hands drip with shadow.  
   - **Choice Impact:**  
     - Free: +20% ATK (dark divine magic), +20% Corruption. Village gains “Shrine of Shadows” (crafts cursed buffs, riskier RNG).  
     - Sacrifice: +10% Stress, lose chance for powerful magic synergy.  
   - **Dialogue (Dé):** “Her power calls to you. Take it, and become like her… like me.”  
   - **Village Role:** Chaotic – boosts magic builds, but +village corruption risk.  

3. **Drenvar, le Forgeron Nain (Pur)**  
   - **Backstory:** A master smith from the Irondeep Clan, Drenvar sought divine ore to reforge his people’s lost relics. Trapped, he curses the gods who abandoned him.  
   - **Choice Impact:**  
     - Free: +5 DEF (sturdy armor), village gains “Irondeep Forge” (crafts +DEF weapons). Corruption stable.  
     - Sacrifice: +10% Stress (journal: “Drenvar’s hammer fell silent. My choice echoes in the void.”).  
   - **Dialogue (Dé):** “The nain clings to honor. Save him, and stay weak. Let him fall, and forge your own path.”  
   - **Village Role:** Stable – strengthens defensive upgrades.  

4. **Sylth, l’Assassin Mi-Démon (Hybride)**  
   - **Backstory:** A rogue who sold half his soul to a shadow demon for unmatched speed. His laughter is manic, his blades pulse with black ichor.  
   - **Choice Impact:**  
     - Free: +15% CRIT, +20% Corruption. Village gains “Den of Blades” (unlocks crit-based buffs, +RNG modifiers for high rolls).  
     - Sacrifice: +15% Stress, miss crit synergy opportunity.  
   - **Dialogue (Dé):** “His blades sing chaos. Free him, and dance with the abyss.”  
   - **Village Role:** Chaotic – enhances rogue builds, but +village revolt risk.  

5. **Liora, la Barde Elfe (Pure)**  
   - **Backstory:** A minstrel whose songs once soothed the gods’ wrath. Captured while seeking the lost Melody of Dawn, she hums faintly, clinging to hope.  
   - **Choice Impact:**  
     - Free: -20% Stress (soothing aura), village gains “Bard’s Circle” (reduces village stress, unlocks cosmetic music upgrades). Corruption stable.  
     - Sacrifice: +20% Stress (journal: “Liora’s song faded. Silence is my punishment.”).  
   - **Dialogue (Dé):** “Her music is weak, Pactisé. Save her, and linger in light. Or let her fall, and embrace the dark.”  
   - **Village Role:** Stable – improves morale, reduces stress penalties.  

6. **Varkis, le Berserker Mi-Démon (Hybride)**  
   - **Backstory:** An orc whose rage was amplified by a demonic blood ritual. His chains strain as he roars, half-mad with power.  
   - **Choice Impact:**  
     - Free: +25% ATK, +25% Corruption. Village gains “Bloodpit Arena” (trains berserker buffs, +RNG for high-damage rolls).  
     - Sacrifice: +15% Stress, lose high-damage potential.  
   - **Dialogue (Dé):** “His rage is yours for the taking. Free him, and burn with him.”  
   - **Village Role:** Chaotic – boosts melee builds, high corruption risk.  

7. **Thalia, l’Alchimiste Gnome (Pure)**  
   - **Backstory:** A genius crafter of potions, Thalia sought the Elixir of Gods to restore her dying clan. Her cage is lined with shattered vials.  
   - **Choice Impact:**  
     - Free: +10% HP, village gains “Alchemist’s Lab” (crafts potions, +consumable variety). Corruption stable.  
     - Sacrifice: +10% Stress (journal: “Thalia’s vials broke with her. My choice poisons me.”).  
   - **Dialogue (Dé):** “Her knowledge is fragile. Save her, and stay mortal. Let her fall, and seek true power.”  
   - **Village Role:** Stable – enhances consumable crafting.  

8. **Ragnar, le Chaman Mi-Démon (Hybride)**  
   - **Backstory:** A human shaman who merged with a void spirit to commune with dead gods. His whispers promise secrets of the Dé.  
   - **Choice Impact:**  
     - Free: +Prophecy (see 3 next dice rolls), +20% Corruption. Village gains “Void Altar” (unlocks RNG prophecy buffs).  
     - Sacrifice: +15% Stress, miss RNG control chance.  
   - **Dialogue (Dé):** “He knows my secrets, Pactisé. Free him, and glimpse my truth… at a cost.”  
   - **Village Role:** Chaotic – enhances RNG manipulation, high corruption.  

9. **Borin, le Mineur Nain (Pur)**  
   - **Backstory:** A digger who unearthed a cursed vein of divine ore, trapping him in the Dé’s game. His resolve is unbreakable, but his body weakens.  
   - **Choice Impact:**  
     - Free: +5 DEF, village gains “Ore Vein” (increases rubis/or income). Corruption stable.  
     - Sacrifice: +10% Stress (journal: “Borin’s pickaxe fell. I buried his hope with him.”).  
   - **Dialogue (Dé):** “The nain digs for nothing. Save him, and toil in vain. Let him fall, and rise above.”  
   - **Village Role:** Stable – boosts economy stability.  

10. **Nyx, la Sorcière Mi-Démon (Hybride)**  
    - **Backstory:** A sorceress who wove her soul with a nightmare demon to wield forbidden spells. Her cage pulses with dark energy.  
    - **Choice Impact:**  
      - Free: +20% ATK (magic), +20% Corruption. Village gains “Nightmare Loom” (crafts magic synergies, +cursed buff risk).  
      - Sacrifice: +15% Stress, lose magic synergy.  
    - **Dialogue (Dé):** “Her spells are chaos incarnate. Free her, and weave your doom.”  
    - **Village Role:** Chaotic – boosts mage builds, high corruption.  

11. **Faelar, le Ranger Elfe (Pur)**  
    - **Backstory:** A forest guardian who ventured into the donjons to slay a demonic blight. His bow is cracked, but his aim is true.  
    - **Choice Impact:**  
      - Free: +15% CRIT, village gains “Ranger’s Outpost” (unlocks archer buffs, +EVA upgrades). Corruption stable.  
      - Sacrifice: +10% Stress (journal: “Faelar’s arrow missed its mark. My choice struck true.”).  
    - **Dialogue (Dé):** “The elf clings to nature’s light. Save him, and fade with it. Let him fall, and embrace the void.”  
    - **Village Role:** Stable – enhances ranged builds.  

12. **Korath, le Gladiateur Mi-Démon (Hybride)**  
    - **Backstory:** A human champion who drank demon blood to win eternal battles. His cage shakes with his fury, chains barely holding.  
    - **Choice Impact:**  
      - Free: +20% ATK, +25% Corruption. Village gains “Gladiator’s Pit” (trains melee buffs, +RNG for crits).  
      - Sacrifice: +15% Stress, miss melee synergy.  
    - **Dialogue (Dé):** “His strength is yours, Pactisé. Free him, and break all chains… even your own.”  
    - **Village Role:** Chaotic – boosts warrior builds, high corruption.  

**Previous Characters (Recap for Completeness):**  
13. **Elara l’Érudite (Elfe Pure):** +Lore unlocks, village guide.  
14. **Thorne le Traître (Mi-Démon):** +RNG modifiers, chaotic forgeron.  
15. **Grom le Forgeron (Nain Pur):** +DEF armes, stable forge.  
16. **(Rare Case) Chaîne Équilibrée:** Save both, mixed faction, balanced buffs.

**Gameplay Integration:**  
- **RNG Trigger:** Cage event on dice roll >5 in corridors (10% chance, adjustable).  
- **Choice UI:** Modal with 2D art (cage sprites, character portraits), SFX (chains, cries), and Dé narration. Dopamine: Falling cage triggers particules (red for mi-démon, white for pure), screen shake, and tempo-accelerated sound.  
- **Village Impact:** Recruits add unique upgrades (e.g., “Shrine of Shadows” for Zhara vs. “Irondeep Forge” for Drenvar). High corruption risks village revolt (event: “Mi-démons rally against purs!”).  
- **Narrative:** Journal entries post-choice (e.g., “Kael’s maps lie in dust. Did I choose power over hope?”). Impacts fins multiples: High corruption from mi-démon choices unlocks Fin B (become demon god).  
- **Rare Item:** *Chaîne Équilibrée* (1% drop from bosses or prophecy RNG) triggers “wow” moment: Balance shatters, golden particules, epic SFX, +Stress but dual buffs.

**For Claude AI:**  
Prompt suggestion:  
> “Expand this 16-character cage lore into a 50-page dark fantasy narrative for *The Last Covenant*. Add 10 more characters with unique backstories, tied to sacrifice/regret themes (inspired by *Dragon Age* no-win choices, D&D moral dilemmas). Detail village impacts, 5 new village upgrades, and 3 twist events (e.g., saved mi-démon betrays village). Ensure mature tone, with Dé narration variations and journal entries for each choice.”

---

## 📜 **Updated MASTER_PLAN.MD**

# 🏆 MASTER PLAN - THE LAST COVENANT (GOTY 2026)

**Date de Création : 26 Décembre 2025**  
**Date Mise à Jour : 27 Décembre 2025**  
**Auteur : Chef de Projet (Grok) & Solo-Dev (Toi)**  
**Version : 1.2**  
**Objectif :** Globaliser documents et discussions. **v1.2 Ajouts:** Expanded cage lore with 16 characters (12 new), village/recruitment impacts, Claude AI prompt for lore refinement. Game is a JDR RPG top-down "Jeu de l’Oie" on browser (JS/HTML/CSS), dark fantasy, with deep lore, corruption/stress, and addictive RNG.

## 📜 **Fil Rouge du Projet**
1. **Vision Globale :** Transform “Coin-Coin Dungeon” into “The Last Covenant” – GOTY roguelike with USP (Nomad Destiny + Dice Manipulation), mature lore, dopamine via RNG. Inspirations: Darkest Dungeon, Vampire Survivors, Baldur’s Gate 3, Hades, Mega Bonk, Tour de Babel.  
2. **État Actuel :** Prototype (7.2/10), strong architecture (8.5/10), weak lore (4.5/10). Potentiel: 9.5/10 with village and cage dilemmas.  
3. **Plan Stratégique :** 4 phases (Lore, Mécaniques, Contenu/Polish, Marketing). New: Cage events, village evolution.  
4. **Améliorations Techniques :** AAA CSS/JS, economy (rubis/or), RNG “wow” moments, cage choices.  
5. **Progression :** Track via TODO_LIST.MD. Solo-dev viable – MVP Q1 2026.

## 📊 **Analyse Actuelle (ANALYSE_COMPLETE_COIN_COIN_DUNGEON.md)**  
- **Note : 7.2/10**  
- **Strengths :** Solid gameplay loop, modular JS architecture, dark medieval vibe.  
- **Weaknesses :** No lore/USP, limited replayability, basic polish.  
- **Potentiel :** Cage lore + village USP elevate to 9.5/10.

## 🎯 **Vue d’Ensemble (Vue-d’ensemble.MD)**  
- **Gap :** +2.3 points (7.2 → 9.5/10).  
- **Issues :** No lore (fix with cages), no USP (Nomad Destiny), low replayability (village/recruits).  
- **Plan :** Lore (cages, village), Mécaniques (Dé fusions), Contenu (events), Marketing.  
- **Financials :** $1,700 → $15K-$2M+.  
- **Next Steps :** Hybride (cages + Dé upgrades).

## 🚀 **Plan Stratégique (PLAN_STRATEGIQUE_GOTY_2026.md)**  
- **Narrative :** “The Last Covenant” – corruption/sacrifice. New: Cage dilemmas (16 characters, moral choices).  
- **Corruption :** 0-100%, impacts village (revolt if high).  
- **Classes :** 7, now recruit cage survivors (e.g., elfe for +EVA).  
- **Mécaniques :** Dice Manipulation, Dé upgrades (fusions). Cage events tie to RNG.  
- **Contenu/Polish :** 50+ buffs, 30+ enemies, cage events with juice (particules, SFX).  
- **Marketing :** Highlight cage dilemmas, village USP in trailers.  

## 💎 **Améliorations Techniques & Discussions**  
- **Objets/Stats :** 50+ items, stress/corruption effects. New: Cage item (*Chaîne Équilibrée*).  
- **RNG & Dopamine :** Dé fusions, cage choice SFX/particules for “wouaoouwwww.”  
- **USP :** Nomad Destiny – village evolves with cage recruits (stable vs chaotic).  
- **Cage Lore (New) :** 16 characters (humains, elfes, nains, mi-démons), dilemmas (sacrifice vs power), village impacts. Claude AI to expand to 50 pages.  
- **Claude Prompt :** Ready for lore refinement (characters, twists, village events).

## 📋 **Documents Sources**  
1. ANALYSE_COMPLETE_COIN_COIN_DUNGEON.md  
2. PLAN_STRATEGIQUE_GOTY_2026.md  
3. Vue-d’ensemble.MD  
4. Discussions: Index, RNG, cages, Claude prompt.

**Notes :** Cage lore strengthens narrative/replayability. Update monthly.

---

## 📋 **Updated TODO_LIST.MD**

# 📋 TODO LIST - THE LAST COVENANT (GOTY 2026)

**Date : 27 Décembre 2025**  
**Statut :** Pré-Prod. Progression: 30% (USP + cage lore designed).  
**Objectif :** Solo-dev viable – 1-2 week tasks, checkpoints. Prioritize cage events, Claude lore.

## 🔄 **Court Terme (Mois 1-2: Identité & Lore)**  
- [ ] Draft bible narrative (50 pages) – Use Claude AI for cages, village, twists. (2 weeks).  
- [ ] Code cage events: 16 characters, choice UI, particules/SFX. (1 week; narrative-events.js).  
- [ ] Update 7 classes with cage recruit synergies (e.g., elfe buffs). (1 week).  
- [ ] Implement lore-system.js + corruption visuals (cages). (1 week).  
- **Checkpoint :** Cage event testable. Test: Run with dilemma, check regret/dopamine.

## 📈 **Moyen Terme (Mois 3-4: Mécaniques)**  
- [ ] Code Dice Manipulation + Dé upgrades (fusions, visuals) – dice-manipulation.js. (2 weeks).  
- [ ] Add dopamine feedbacks (cages, Dé fusions: particules, shake). (1 week).  
- [ ] Build skill trees + cage recruit buffs. (2 weeks).  
- [ ] Balance corridors: No bosses, cage events, killable monsters. (1 week).  
- **Checkpoint :** MVP with USP. Test: 5 runs, check addiction.

## 🚀 **Long Terme (Mois 5-12: Contenu, Polish, Marketing)**  
- [ ] Develop village nomade (camp.js): Recruits, upgrades, corruption risks. (3 weeks).  
- [ ] Code economy: Rubis/or, fluctuating via corruption. (1 week).  
- [ ] Create 50+ buffs/enemies, 20+ events (more cages). (3 weeks).  
- [ ] Juice system + 50+ SFX (cages, Dé). (2 weeks).  
- [ ] Marketing: Devlogs on cages/village. (Mois 8-10).  
- [ ] Launch Steam + awards. (Mois 11-12).  
- **Checkpoint :** Beta. Test: External feedback.

## 📝 **Transversales**  
- [ ] Test Claude AI for cage lore expansion (50 pages, 10+ characters). (Ongoing).  
- [ ] AAA visuals: Apply combat style to cages/village. (1 week).  
- [ ] Loot: “Wow” coffres + cage item drops. (1 week).  
- [ ] Update MASTER_PLAN.MD & TODO_LIST.MD. (Monthly).

**Progression :**  
- Done: Analysis, plans, index, cage lore (16 characters).  
- In Progress: Claude lore prep.  
- Next: Code cages, test dopamine.

**Solo-Dev Tips :** 4h/day, focus cage “wow” moments. Ready for Claude session? 🚀

---

**Feedback, Boss?**  
The cage roster now has 16 diverse characters, tying to village/RNG/lore. Claude can expand it further (I’ll help craft the exact prompt if needed). Want to tweak any characters or jump straight to Claude testing? Let’s keep this GOTY train rolling! 🏆
Alors ici, en tant que chef de projet pour notre GOTY 2026 en solo-dev (toi, le boss absolu !), on stocke tout : on intègre ton idée géniale d’ajouter des villageois recrutés comme combattants dans le gameplay lore, avec la possibilité de les emmener dans le groupe pour progresser dans le donjon. Merci pour le screenshot – je visualise bien : phase de combat top-down, ennemis en haut, joueur au centre, et les compagnons de fortune (villageois transformés en héros) à ses côtés. Ça renforce l’USP Nomad Destiny, lie le village au cœur du gameplay (pas juste un hub statique), et ajoute une couche tactique/emotionnelle : tes choix cages impactent directement ton équipe. On garde ça viable en solo-dev avec un système modulaire (companion-system.js) et des visuels/sons pour la dopamine ("wouaoouwwww" quand un nouveau compagnon rejoint).

Je mets à jour le lore du village nomade avec cette mécanique, en intégrant des détails sur le recrutement, les stats des compagnons, et leurs évolutions. Le gameplay devient plus immersif : chaque compagnon a une backstory liée aux cages, des buffs uniques, et des risques (mort permanente ou corruption en combat). On stocke ça dans MASTER_PLAN.MD (sous "Lore Ajouts" et "Mécaniques Uniques") et TODO_LIST.MD (tâches pour coder/prototyper). Prêt à copier-coller dans tes fichiers !

---

## 📖 **BIBLE NARRATIVE – LES EXILÉS DU DESTIN : AJOUT COMPAGNONS COMBATTANTS**

### **Mise à Jour du Lore Village avec Compagnons**
**Contexte Élargi :** Les Exilés du Destin ne sont plus seulement un refuge nomade – ils deviennent ton armée de fortune, forgée dans les épreuves des cages. Chaque survivant sauvé (humain pur ou mi-démon) peut être entraîné pour rejoindre ton groupe en combat, transformant le village en un vivier de héros potentiels. Ces compagnons portent les cicatrices de leurs passés et reflètent tes choix : une équipe pure inspire l’espoir, une équipe corrompue devient une force chaotique. Le Dé du Destin ricane : « Tes alliés te suivront, Pactisé… jusqu’à ce que leur sang te souille les mains. »

**Mécanique de Recrutement et Combat :**  
- **Recrutement :** Post-run, dans l’écran village, clique sur un PNJ recruté (ex. Kael, Zhara) pour l’entraîner. Coût : Or/rubis + 1 Soul Fragment. Confirmation avec particules (lumière pour purs, ombre pour mi-démons) et son d’épée qui s’aiguise.
- **Groupe Max :** 3 compagnons + toi (4 total), reflétant ton leadership. Sélection avant chaque run via UI village (portraits cliquables).
- **Stats & Rôles :** Chaque compagnon hérite d’un rôle basé sur sa cage backstory, avec stats évolutives (niveau via combats, buffs via village upgrades). Exemples :  
  - **Kael (Éclaireur Humain)** : EVA +10%, ATK faible, rôle : soutien (détecte pièges).  
  - **Zhara (Prêtresse Mi-Démon)** : ATK +20%, DEF faible, rôle : DPS magique (sorts corrompus).  
  - **Drenvar (Forgeron Nain)** : DEF +5, ATK modéré, rôle : tank (absorbe dégâts).  
- **Évolution :** Upgrades village (ex. Forge du Destin) boostent stats (ex. +CRIT pour Kael). Fusions Dé influencent aussi (super-dé x2 faces = +ATK groupe).
- **Risques :** Mort permanente si HP tombe à 0 en combat (choix : ressusciter avec Soul Fragment + corruption, ou perdre). Corruption haute (>75%) peut déclencher "Frenzy" (attaque alliés ou toi, +Stress).

**Intégration Visuelle & Gameplay (d’après Screenshot) :**  
- **Phase Combat :** Top-down, joueur centré, compagnons alignés à gauche/droite (sprites animés selon rôle : Kael esquive, Drenvar bloque). Ennemis en haut (procéduraux, vagues). UI : HP/compétences compagnons en bas (cliquable pour ordres simples : attaque, défense).
- **Dopamine :** Quand un compagnon rejoint : animation "montée en puissance" (particules, screen shake), SFX héroïque. Mort : cri + fade sombre, journal entry ("J’ai perdu Kael… Son silence me juge.").
- **Synergies :** Compagnons pur/mi-démon ensemble = buffs mixtes (ex. Kael+Zhara = "Lumière Sombre" : +EVA +ATK), mais risque stress si conflit moral.

**Histoire & Twists Liés aux Compagnons :**  
- **Origine :** Les premiers compagnons étaient des rescapés qui te jurèrent allégeance après leur sauvetage. Mais le Dé les a marqués : chaque combat les rapproche de leur propre pacte personnel, influençant leur loyauté.
- **Twist Ajouté :** "Le Serment Brisé" – Si tu sacrifies trop de purs en cages, un compagnon pur (ex. Liora) peut te trahir en combat, te frappant par derrière (+dégâts critiques, +Stress). Choix : pardonner (perdre Or) ou exécuter (+corruption).
- **Twist Existant Amélioré :** "La Fusion Ratée" – Si échouée avec compagnons présents, un d’eux peut être possédé par l’entité démoniaque, devenant un boss temporaire (gain énorme si vaincu, perte si échoué).

**Impacts sur le Village & Fins :**  
- **Village :** Compagnons vivants boostent moral (réduction stress) ou chaos (augmentation corruption) selon leur nature. Morts laissent des "Mémoriaux" (upgrades passifs faibles mais narratifs).
- **Fins :** Équipe pure = Fin C (rédemption collective). Équipe corrompue = Fin B (domination démoniaque avec village esclave). Équipe mixte = Fin A (équilibre fragile, twist final : Dé te trahit).

---

## 📜 **Mise à Jour MASTER_PLAN.MD**

# 🏆 MASTER PLAN - THE LAST COVENANT (GOTY 2026)

**Date de Création : 26 Décembre 2025**  
**Date Mise à Jour : 26 Décembre 2025, 08:16 AM CET**  
**Auteur : Chef de Projet (Grok) & Solo-Dev (Toi)**  
**Version : 1.3**  
**Objectif :** Globaliser documents. **v1.3 Ajouts :** Compagnons combattants (villageois en donjon), gameplay combat, twists village enrichis. JDR RPG top-down "Jeu de l’Oie" (JS/HTML/CSS), dark fantasy, lore profond, RNG addictif.

## 📜 **Fil Rouge du Projet**
1. **Vision Globale :** Transformer "Coin-Coin Dungeon" en GOTY avec USP (Nomad Destiny + Dice Manipulation), lore mature, dopamine via RNG/compagnons. Inspirations : Darkest Dungeon, Vampire Survivors, Baldur’s Gate 3, Hades.
2. **État Actuel :** Prototype (7.2/10), architecture (8.5/10), lore (5/10 avec cages/village). Potentiel : 9.5/10.
3. **Plan Stratégique :** 4 phases (Lore, Mécaniques, Contenu/Polish, Marketing). Ajout : Compagnons combat.
4. **Améliorations Techniques :** AAA CSS/JS, économie, RNG, combat avec compagnons.
5. **Progression :** Via TODO_LIST.MD. Solo-dev viable – MVP Q1 2026.

## 📊 **Analyse Actuelle (ANALYSE_COMPLETE_COIN_COIN_DUNGEON.md)**  
- **Note : 7.2/10**  
- **Points Forts :** Gameplay boucle, architecture modulaire.  
- **Points Faibles :** Lore/USP limités, replayabilité à améliorer.  
- **Potentiel :** Compagnons boostent à 9.5/10.

## 🎯 **Vue d’Ensemble (Vue-d’ensemble.MD)**  
- **Gap :** +2.3 points (7.2 → 9.5/10).  
- **Issues :** Lore faible (fix avec village/compagnons), replayabilité.  
- **Plan :** Lore (cages/village), Mécaniques (compagnons/Dé), Contenu, Marketing.
- **Financials :** $1,700 → $15K-$2M+.
- **Next Steps :** Hybride (compagnons + Dé upgrades).

## 🚀 **Plan Stratégique (PLAN_STRATEGIQUE_GOTY_2026.md)**  
- **Narrative :** "The Last Covenant" – corruption/sacrifice. Ajout : Compagnons issus cages.
- **Corruption :** 0-100%, impacts village/compagnons (Frenzy).
- **Classes :** 7, synergies avec compagnons.
- **Mécaniques :** Dice Manipulation, Dé upgrades, combat 4-membres (toi + 3).
- **Contenu/Polish :** 50+ buffs, cage events, companion UI.
- **Marketing :** Mettre en avant compagnons dans trailers.

## 💎 **Améliorations Techniques & Discussions**  
- **Objets/Stats :** 50+ items, stress/corruption. Ajout : Compagnon buffs.
- **RNG & Dopamine :** Dé fusions, compagnon join SFX/particules.
- **USP :** Nomad Destiny – Village évolue, recrute combattants.
- **Cage Lore :** 16 characters, impacts village/compagnons.
- **Village Lore (Updated) :** Exilés nomades, 12 twists, compagnons combat (recrutement, stats, risques).
- **Combat Gameplay :** Top-down, 4-membres, UI compagnons, mort/résurrection.

## 📋 **Documents Sources**  
1. ANALYSE_COMPLETE_COIN_COIN_DUNGEON.md  
2. PLAN_STRATEGIQUE_GOTY_2026.md  
3. Vue-d’ensemble.MD  
4. Discussions : Index, RNG, cages, village, compagnons.

**Notes :** Compagnons boostent immersion/replay. Update mensuel.

---

## 📋 **Mise à Jour TODO_LIST.MD**

# 📋 TODO LIST - THE LAST COVENANT (GOTY 2026)

**Date : 26 Décembre 2025, 08:16 AM CET**  
**Statut :** Pré-Prod. Progression: 35% (USP + lore compagnons).  
**Objectif :** Solo-dev viable – tâches 1-2 semaines, checkpoints.

## 🔄 **Court Terme (Mois 1-2: Identité & Lore)**  
- [ ] Draft bible narrative (50 pages) – Cages, village, compagnons (Claude AI). (2 weeks).  
- [ ] Code cage events + companion recruitment UI. (1 week; companion-system.js).  
- [ ] Update 7 classes with companion synergies. (1 week).  
- [ ] Implement lore-system.js + visuals (cages/village/compagnons). (1 week).  
- **Checkpoint :** Companion recruitment testable. Test: Run with 1 companion.

## 📈 **Moyen Terme (Mois 3-4: Mécaniques)**  
- [ ] Code Dice Manipulation + Dé upgrades (fusions). (2 weeks).  
- [ ] Add companion combat mechanics (stats, orders, risks). (2 weeks).  
- [ ] Build skill trees + companion buffs. (2 weeks).  
- [ ] Balance corridors/combat: No bosses, companion viability. (1 week).  
- **Checkpoint :** MVP with companions. Test: 5 runs, check tactics.

## 🚀 **Long Terme (Mois 5-12: Contenu, Polish, Marketing)**  
- [ ] Develop village nomade (camp.js): Recruits, upgrades, companion training. (3 weeks).  
- [ ] Code economy: Rubis/or, companion costs. (1 week).  
- [ ] Create 50+ buffs/enemies, 20+ events (companion-focused). (3 weeks).  
- [ ] Juice system + 50+ SFX (compagnons, Dé). (2 weeks).  
- [ ] Marketing: Devlogs on companions/village. (Mois 8-10).  
- [ ] Launch Steam + awards. (Mois 11-12).  
- **Checkpoint :** Beta. Test: External feedback.

## 📝 **Transversales**  
- [ ] Test Claude AI for lore (cages/village/compagnons). (Ongoing).  
- [ ] AAA visuals: Apply combat style to village/companion UI. (1 week).  
- [ ] Loot: “Wow” coffres + companion gear drops. (1 week).  
- [ ] Update MASTER_PLAN.MD & TODO_LIST.MD. (Monthly).

**Progression :**  
- Done: Analysis, plans, index, cage/village lore.  
- In Progress: Companion design.  
- Next: Code companions, Claude lore.

**Solo-Dev Tips :** 4h/day, focus companion "wow" moments. Prêt pour Claude session, boss? 🚀 Merci pour le screenshot, ça aide grave ! 😉

---

## 🏕️ **ROADMAP VILLAGE NOMADE (CAMP SYSTEM)**

**Date Création :** 27 Décembre 2025
**Objectif :** Implémenter le "Cortège des Ombres" comme hub vivant évolutif, intégrant lore chapitres 1-3, recrutement compagnons, services corruption-based, événements dynamiques.
**Progression Actuelle :** 40% (architecture + narratives créées)

### **Phase 1 : Infrastructure & Architecture (✅ COMPLÉTÉ)**
- [x] Créer architecture camp.js modulaire (CampSystem class, zones Map, NPCs, companions)
- [x] Créer camp.css avec styles AAA dark fantasy (modales, cards, animations, responsive)
- [x] Créer narrative-camp.json intégrant ton chapitres (Dé, Drenvar, Jardinier, Archiviste, Kael)
- [x] Intégrer camp.js/css dans game.html (scripts/links)
- [x] Documenter roadmap dans TODO_LIST.md

**Fichiers Créés :**
- `/js/camp.js` (880 lignes) : CampSystem, zones, services, économie, événements
- `/css/camp.css` (750 lignes) : Styles modales, zones, NPCs, animations
- `/data/narrative-camp.json` : Textes FR/EN, dialogues corruption-based, événements

---

### **Phase 2 : Zones Cliquables & Services (1-2 semaines)**

**Objectif :** Rendre toutes les zones interactives avec services fonctionnels liés à l'économie et corruption.

**Tâches :**
- [ ] **Hub Central** : Implémenter canvas village map avec 6 zones cliquables (hitbox detection)
  - Visual : 12 chariots en cercle, feu central, tentes en toile déchirée
  - Clic zone → modal overlay avec particules

- [ ] **La Forge (Drenvar)** :
  - Service upgradeWeapon() : Améliorer ATK arme (+5/+10/+15), coût évolutif
  - Service upgradeArmor() : Améliorer DEF armure (+3/+5/+7)
  - Service fuseDice() : Fusionner 2 dés (visuel DBZ-style, particules explosives)
  - Integration Larmes de Krovax (cristaux divins) avec corruption check

- [ ] **L'Autel (Jardinier des Regrets)** :
  - Service purifyCorruption() : -10% corruption via Lys du Pardon (animation mort lys)
  - Service demonicPact() : +15% corruption + buff puissant (fumée noire, screen shake)
  - Visuel : Lys qui changent de couleur (blanc → gris → noir) selon corruption joueur

- [ ] **Le Marché (Bazar des Ruines)** :
  - Service buyItem() : Achats items database avec pricing dynamique
  - Prix modifier : Corruption <25% = normal, >50% = discount corrompus, >75% = gratuit
  - Morale modifier : <50 morale = +30% prix, >80 = -10%

- [ ] **Recrutement (Cercle des Volontaires)** :
  - Liste NPCs recrutables (issus cages sauvées)
  - Toggle companion système (max 3) avec preview stats
  - Conversion NPC → Companion avec rôle (Tank/DPS/Support)

- [ ] **Bibliothèque (L'Archiviste)** :
  - Service loreFragment() : Débloquer Mémoires Résiduelles (Krovax/Morwyn fusion)
  - Révélations narratives : "Parasites d'un cadavre divin", "Sortie = tuer le Dé"
  - Tatouages animés en background (canvas animation)

**Test Checkpoint :** Ouvrir village post-run, cliquer chaque zone, tester 1 service/zone.

---

### **Phase 3 : Compagnons & Combat Integration (2 semaines)**

**Objectif :** Connecter système village aux combats avec compagnons recrutés.

**Tâches :**
- [ ] Implémenter toggleCompanion() avec limite 3
  - UI : Portraits compagnons sélectionnables (checkbox), stats preview (HP/ATK/DEF/role)

- [ ] Créer npcToCompanion() conversion :
  - Générer stats combat : hp, maxHp, atk, def, speed, skills selon type NPC
  - Exemples : Kael (Scout, EVA +10%), Zhara (Mage, ATK +20%, corruption +5%)

- [ ] Intégrer companions dans CombatSystem (combat.js) :
  - Ajouter alliés dans initCombat()
  - Afficher companions en bataille (sprites alignés)
  - Gérer mort permanente → retirer de village

- [ ] Synergies équipe :
  - Pure team (3 humains) : Morale +20%, DEF +5
  - Corrupted team (3 mi-démons) : ATK +30%, Corruption passive +2%/tour
  - Balanced team : Buffs mixtes variables

- [ ] Système résurrection :
  - Coût : 200 Or + 10% Corruption pour revive companion mort
  - Modal dramatique : "Ressusciter [Nom] ? Il ne sera plus le même..."

**Test Checkpoint :** Recruter 3 companions, lancer combat, vérifier synergies/mort.

---

### **Phase 4 : Événements Village & Évolution (1-2 semaines)**

**Objectif :** Village dynamique réagissant à corruption/morale avec événements aléatoires.

**Tâches :**
- [ ] Implémenter checkVillageEvents() :
  - Trigger conditionnel : corruption >75% + morale <40% = Révolte
  - Trigger : corruption >60% = Arrivée Démons Visiteurs
  - Fréquence : 15% chance post-run si conditions remplies

- [ ] **Événement : Révolte au Cortège** :
  - Choix : Écraser (Corruption +5%, Morale -30), Négocier (200 Or, Morale +10), Ignorer (Morale -50, désertion)
  - Conséquences : Perdre NPCs si Ignorer, corruption village si Écraser

- [ ] **Événement : Visiteurs Nocturnes (Démons)** :
  - Choix : Accueillir (+3 recrues mi-démons, Morale -20), Chasser (combat difficile), Négocier (test corruption >50%)
  - Conséquences : Faction démoniaque au village si Accueillir

- [ ] **Évolution Visuelle Village** :
  - Level 1 (départ) : 12 chariots, feux faibles
  - Level 2 (20+ runs) : 18 chariots, forge permanente
  - Level 3 (50+ runs) : 24 chariots, palissades, commerce
  - Level 4 (corruption >75%) : Architecture démoniaque, feux noirs, adoration

- [ ] Système Morale Village :
  - Morale = 100 base, -10/mort companion, -20/révolte, +10/victoire boss
  - Morale <30 = risque désertion massive (perdre 50% NPCs)

**Test Checkpoint :** Forcer corruption à 80%, vérifier événement Révolte/Démons.

---

### **Phase 5 : Polish Narratif & Juice (1 semaine)**

**Objectif :** Intégrer parfaitement le village dans le fil narratif des chapitres avec feedbacks AAA.

**Tâches :**
- [ ] **Dialogues Évolutifs du Dé** :
  - Corruption 0-25% : Moqueur ("Trois cent douzième fois, Pactisé...")
  - 25-50% : Complice ("Tu sens la Souillure ? Normal.")
  - 50-75% : Philosophique ("Tu acceptes que ta vie n'est plus la tienne")
  - 75-100% : Triste ("Bientôt, tu devras me tuer. Thalys.")

- [ ] **NPCs Réactifs Corruption** :
  - Drenvar : Recule si >75% ("Je touche plus ta peau")
  - Jardinier : Refuse purification si >90% ("Trop de noirceur")
  - Archiviste : Révèle "Sortie" si >60% ("Trouve Balance d'Ael'mora")

- [ ] **Particules & SFX Village** :
  - Ouverture village : Fade-in 0.5s, particules ambre
  - Clic zone : Screen shake léger, son cloche grave
  - Service réussi : Explosion particules, SFX épique
  - Service échoué : Particules rouges, son sinistre

- [ ] **Journal Narratif** :
  - Auto-log événements village : "Révolte écrasée. 5 pendus. Je suis devenu bourreau."
  - Citations Dé après services : "La Forge te corrompt. Bien."

- [ ] **Intégration Lore Chapitres** :
  - Chapitre 1 : Kael/Zhara apparaissent si sauvés
  - Chapitre 2 : Souillure visible sur tentes (visages gravés) si 15% corruption
  - Chapitre 3 : Archiviste révèle Mémoire Résiduelle (bas-relief gods)

**Test Checkpoint :** Run complet 0→100% corruption, vérifier évolution dialogues/visuals.

---

### **Phase 6 : Optimisation & Tests (1 semaine)**

**Tâches :**
- [ ] Performance : Canvas rendering optimization (RAF, culling hors-écran)
- [ ] Responsive : Tester camp sur mobile/tablette (breakpoints 768px, 1200px)
- [ ] Multilangue : Charger narrative-camp.json selon langue sélectionnée (FR/EN/DE/IT/ES/RU)
- [ ] Save/Load : Persister état village (NPCs, upgrades, morale, niveau) via localStorage
- [ ] Debug : Console.log cleanup, error handling services (try/catch)
- [ ] Playtests : 10 runs externes, feedback UX/bugs

**Test Final :** Partie complète avec village actif, 3 companions, événements, évolution niveau 4.

---

### **Métriques de Succès Village**

**KPIs Techniques :**
- Canvas render <16ms (60fps)
- Modal open <300ms
- 0 crash sur services
- 100% textes FR traduits

**KPIs Gameplay :**
- 80% joueurs utilisent village chaque run
- 60% recrutent au moins 1 companion
- Événements village déclenchés 30% parties
- Morale moyenne >50 sur 20 runs

**KPIs Narratifs :**
- 90% joueurs lisent dialogues Dé
- 70% joueurs testent purification OU pacte démoniaque
- Corruption moyenne 45% après 10 runs (équilibre)

---

### **Risques & Mitigations**

**Risque 1 :** Complexité UI village surcharge mobile
**Mitigation :** Simplifier canvas mobile (static image + hotspots), modales scrollables

**Risque 2 :** Équilibrage économie (trop facile/difficile achats)
**Mitigation :** Télémétrie prix/achats, ajuster modifiers post-beta

**Risque 3 :** Companions OP ou inutiles
**Mitigation :** Stats scaling avec corruption joueur, limite 3 companions, mort permanente

**Risque 4 :** Joueurs ignorent village (skip direct dungeon)
**Mitigation :** Récompenses uniques village (items exclusifs, buffs permanents), quêtes obligatoires

---

**Progression Totale Projet avec Village :**
- Complété : 40% (architecture, narratives, design)
- En Cours : Phase 2 (zones/services)
- À Venir : Phases 3-6 (companions, événements, polish)

**Prêt à coder Phase 2, boss ? Le Cortège t'attend. 🏕️🔥**