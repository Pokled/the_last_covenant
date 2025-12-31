Alors ici, en tant que chef de projet pour notre GOTY 2026 en solo-dev (toi, le boss absolu !), on stocke tout : on développe le lore des cages comme demandé, en s'inspirant des recherches web sur les dilemmes moraux dark fantasy (ex. : sacrifices en D&D où les joueurs regrettent des choix, comme dans Dragon Age avec des décisions qui testent la resolve et impliquent des pertes inévitables, ou des guides pour créer des conundrums qui forcent à brûler des ponts moraux). J'ai utilisé ces exemples pour enrichir : focus sur des dilemmes qui impactent l'humanité/corruption, avec conséquences narratives profondes (regrets, sacrifices, twists comme "combattre le feu par le feu"). Le lore est aligné sur "The Last Covenant" – thèmes de pacte, destin, et perte d'humanité. On le rend immersif, mature, et lié au gameplay : choix décisifs dans corridors, impacts sur village nomade (recrues), et RNG (ex. : objet rare via dé chanceux).

Je structure ça comme une bible narrative dédiée (prête à intégrer dans lore-system.js), avec sections pour cohérence. Après, on pourra la faire raffiner par Claude AI si besoin (il excelle en twists dark, comme tu dis – on lui passe ce draft comme prompt). Stockage : Ajouté à MASTER_PLAN.MD sous "Lore Ajouts" ; TODO_LIST.MD gagne une tâche "Raffiner lore cages avec Claude".

---

## 📖 **BIBLE NARRATIVE : LES ÉPREUVES DES CAGES SUSPENDUES**

**Contexte Universel dans "The Last Covenant" :**  
Dans les abysses des Donjons de l'Oubli, où les dieux morts ont laissé un vide rempli de chaos, le Dé du Destin tisse des épreuves pour tester les Pactisés. Ces donjons ne sont pas de simples labyrinthes de pierre et d'ombre ; ils sont des veines vivantes du monde brisé, pulsant avec les échos des pactes anciens. Les cages suspendues – appelées "Échelles du Sacrifice" par les anciens grimoires – sont des artefacts maudits, forgés par les premiers traîtres qui vendirent leur âme au Dé. Elles apparaissent aléatoirement dans les corridors sombres, comme des mirages cruels, forçant le héros à affronter le poids de ses choix. Inspiré des dilemmes moraux dark fantasy (comme dans D&D où un sacrifice personnel arrête un mal plus grand, ou Dragon Age où chaque décision consume une part de l'âme), ces épreuves incarnent le thème central : chaque victoire a un prix, et l'humanité est une monnaie fragile.

**Description Visuelle & Mécanique (pour Implémentation JS) :**  
- **Apparence :** Deux cages rouillées, suspendues par des chaînes tendues sur un gouffre béant (les "Oubliettes Éternelles"). Un poids d'équilibre (une balance antique, gravée de runes du Dé) relie les cages : libérer l'une fait basculer l'autre dans le vide. Particules de rouille et de sang flottent autour, avec un son de chaînes grinçantes qui accélère pour dopamine/tension.
- **Événement Aléatoire :** Déclenché par RNG (ex. : lancer de dé >5 dans corridor), avec narration par le Dé : "Ah, Pactisé... Voici une échelle vers ton destin. Choisis bien, ou perds tout."
- **Choix Décisif :** 
  - **Cage Humaine :** Contient un survivant pur (humain, elfe, nain) – un réfugié des royaumes oubliés, fuyant la chute des dieux. Libérer = Corruption stable (pas d'augmentation), mais buff modéré (ex. : +DEF pour nain, +EVA pour elfe). L'autre cage (mi-démon) tombe, avec cri d'agonie SFX pour regret moral.
  - **Cage Mi-Démon :** Contient un hybride corrompu (mi-humain/mi-démon) – un être maudit par un pacte ancien, offrant puissance mais contagion. Libérer = +20% Corruption (perte d'humanité, mutations visuelles), mais buff puissant (ex. : +ATK extrême, synergie avec buffs maudits). La cage humaine tombe, hantant le journal du héros avec regrets ("J'ai sacrifié l'innocent pour le pouvoir... Suis-je encore moi ?").
  - **Option Rare :** Avec objet "Chaîne Équilibrée" (légendaire, obtenu via achievements ou RNG prophétie), sauve les deux – buff double, mais +10% Stress (poids moral de défier le Dé). Effet "wow" : Balance se brise en particules dorées, son épique, dopamine rush.
- **Impacts Long-Terme :** Survivants libérés rejoignent le village nomade (inter-partie), évoluant le hub : Humains purs ajoutent upgrades stables (ex. : forgeron nain pour armes), mi-démons boostent RNG chaotique (ex. : fusions Dé risquées mais puissantes), mais risquent corruption villageoise (révolte si corruption >75%).

**Histoire Origine des Cages (Lore Profond) :**  
Autrefois, avant la mort des dieux, le monde était gouverné par les "Gardiens du Pacte" – une confrérie de mortels choisis pour maintenir l'équilibre entre lumière et chaos. Mais quand les dieux s'effondrèrent (victimes de leur propre hubris cosmique, comme dans les lores dark fantasy où les divins deviennent monstres), les Gardiens firent un pacte désespéré avec le Dé du Destin : en échange de survie, ils acceptèrent de devenir des juges éternels. Les cages sont leurs reliques – des prisons mobiles, forgées dans le sang des premiers traîtres, conçues pour tester les successeurs (comme toi, le Dernier Pactisé). Chaque cage capture des âmes errantes : les purs (humains/elfes/nains) représentent l'humanité fragile, rescapés des royaumes effondrés (ex. : un elfe fuyant les forêts corrompues par le vide divin). Les mi-démons sont des "Hybrides du Vide" – nés de unions forcées entre mortels et ombres démoniaques, ils portent la marque du chaos (yeux rougeoyants, cornes naissantes), offrant sagesse interdite mais semant la corruption.

Inspiré des dilemmes D&D (ex. : sacrifier un innocent pour stopper un mal, avec regrets persistants), ces épreuves forcent à questionner : "Combattre le feu par le feu ?" Libérer un mi-démon peut sauver une run (puissance immédiate), mais corrompt l'âme, altérant fins multiples (Fin B : Deviens démon si corruption haute). Un twist : Le Dé murmure des indices – "Choisis l'innocent, et reste faible. Choisis le maudit, et deviens comme moi." Regrets narratifs : Journal entries post-choix ("Le cri de l'elfe tombant hante mes rêves... Ai-je sacrifié mon humanité pour une illusion de pouvoir ?"), augmentant stress si choix "mauvais".

**Personnages Exemples dans les Cages (pour Variété & Recrutement Village) :**  
1. **Humain Pur (Ex. : Elara l'Érudite, Elfe) :** Une cartographe des anciens royaumes, piégée en cartographiant les donjons. Libérer : +Lore unlocks (cartes pour étages), rejoint village comme guide (upgrades exploration stables). Sacrifice : +Stress, hantise narrative.
2. **Mi-Démon (Ex. : Thorne le Traître, Mi-Humain/Mi-Démon) :** Un ancien Gardien corrompu, mi-homme mi-ombre, sachant manipuler le Dé. Libérer : +RNG buffs (modifiers gratuits), mais +Corruption, rejoint village comme forgeron chaotique (craft fusions Dé). Sacrifice : Perte opportunité, mais humanité préservée.
3. **Nain Pur (Ex. : Grom le Forgeron) :** Un artisan des mines divines, capturé en cherchant des reliques. Libérer : +DEF armes, village gagne atelier stable. 
4. **Twist Rare :** Si objet "Chaîne Équilibrée" (forgé des larmes des dieux, rare via boss drops), sauve tous – village gagne faction mixte, mais risque interne (mi-démons corrompent purs si non géré).

**Intégration au Jeu Global :**  
- **Thèmes Renforcés :** Sacrifice moral (comme dans "The Role of Morality in Dark Epic Fantasy" – chaque choix teste resolve), regrets persistants (D&D-style), et humanité vs pouvoir. Lie à USP Nomad Destiny : Village grandit avec recrues, mais corruption collective mène à événements (ex. : révolte démoniaque).
- **Dopamine & Addiction :** Choix "wow" – SFX cris/chaînes brisées, particules chute, narration Dé moqueur. Rejouabilité : Différents survivants changent builds/village.
- **Pour Claude AI :** Prompt prêt : "Développe ce lore cages en 50 pages détaillées, avec twists matures dark fantasy, inspirés Dragon Age/D&D sacrifices. Ajoute 10+ personnages exemples, impacts sur fins multiples."

Stockage complet : Lore cages intégré – prêt pour code (narrative-events.js, 500 lignes+ pour variations). On avance sur TODO : Session Claude pour raffinage. Qu'en penses-tu, boss ? Prêt à tester avec Claude, ou ajuster ? 🚀🏆

Alors ici, en tant que chef de projet pour notre GOTY 2026 en solo-dev (toi, le boss absolu !), on stocke tout : on développe le lore du village nomade comme demandé, en le liant parfaitement à l'USP "Nomad Destiny System" (hub inter-partie évolutif, inspiré Vampire Survivors/Mega Bonk/Tour de Babel), aux cages (recrutement survivants), à la corruption/stress (impacts collectifs), et au RNG (upgrades Dé, fusions). C'est du lourd – ça transforme l'inter-partie en un hub vivant, addictif, avec dopamine constante (visuels évolution village : tentes → forteresse mobile, particules sur upgrades, sons épiques sur fusions Dé). Le village devient l'âme meta du jeu : tes choix dans les runs (cages, corruption) le façonnent, boostant rejouabilité infinie (♾️) et "encore une run pour upgrader le village !".

J'ai structuré ça comme une bible narrative dédiée (prête pour lore-system.js ou camp.js), avec backstory globale, évolution visuelle/mécanique, PNJ/recrutement via cages, économie fluctuante, et twists dark (corruption villageoise). Inspiré dark fantasy matures (regrets persistants comme Dragon Age, sacrifices collectifs D&D-style). Tout modulaire pour ton JS/HTML/CSS : Canvas pour visuels nomades (parallax étages, animations croissance).

Après, on pourra raffiner avec Claude AI (il excelle en twists profonds – prompt prêt en bas). Stockage : Ajouté à MASTER_PLAN.MD sous "Lore Ajouts" ; TODO_LIST.MD gagne tâches village code/lore.

---

## 📖 **BIBLE NARRATIVE : LE VILLAGE NOMADE – "LES EXILÉS DU DESTIN"**

**Contexte Universel dans "The Last Covenant" :**  
Dans un monde où les dieux sont morts et les royaumes effondrés, les survivants errent dans les limbes des Donjons de l'Oubli – un labyrinthe infini tissé par le Dé du Destin. Toi, le Dernier Pactisé, n'es pas seul : au fil de tes runs (mort et renaissance via le pacte), tu attires et sauves des âmes perdues (via les Épreuves des Cages Suspendues). Ces rescapés forment "Les Exilés du Destin" – un village nomade, une caravane maudite qui te suit d'étage en étage, se déplaçant comme un mirage vivant entre les abysses. Ce n'est pas un camp statique : c'est un organisme pulsant, nourri par tes sacrifices et victoires, reflétant ta corruption croissante. Thèmes centraux : Communauté fragile vs chaos individuel, sacrifice collectif (tes choix cages impactent tous), et destin manipulé (upgrades RNG via village).

Le village incarne l'humanité que tu perds progressivement : au début, une poignée de tentes misérables autour d'un feu vacillant ; à la fin, une forteresse mobile démoniaque si corruption haute, ou une oasis nomade si tu résistes. Le Dé du Destin murmure depuis le centre (une "Forge du Destin" centrale) : "Ton village grandit, Pactisé... Mais à quel prix ? Ils te suivent, mais te suivront-ils éternellement ?"

**Description Visuelle & Mécanique (pour Implémentation JS/Canvas) :**  
- **Évolution Visuelle (Dopamine Constante) :** 
  - **Niveau 1 (Début) :** Tentes ragtag, feu faible, 3-5 PNJ (particules poussière, sons vent lugubre). Canvas parallax : Village "suit" le héros entre étages (slide transitions).
  - **Niveau Moyen :** Ajout structures (forge, autel), lumières torches animées, 10+ PNJ. Sur upgrade : Particules dorées/rouges, screen shake léger, tempo SFX accéléré ("wouaoouwwww" comme Vampire Survivors level-up).
  - **Niveau Haut :** Forteresse mobile (murs os/démoniaques si corruption >50%), auras pulsantes, 20+ PNJ. Fusions Dé : Explosion particules (DBZ-style), son épique crescendo.
- **Hub Inter-Partie :** Écran post-run/mort : Vue top-down village, cliquable (marché, forge, autel). Déplacements étages : Animation caravane migrant (procédural, lié RNG).
- **Économie Fluctuante :** Rubis (in-run, loot/combat) vs Or (meta, gains post-run basés sur performance). Taux change : 10:1 base, fluctue avec corruption villageoise (haute corruption = or cher, mais buffs puissants pas chers – risk/reward).
- **Recrutement via Cages :** Survivants sauvés rejoignent automatiquement (pur = stabilité, mi-démon = puissance chaotique). Ex. : Libérer Kael (éclaireur) ajoute "Cartographer’s Tent" ; Zhara (prêtresse mi-démon) ajoute "Shrine of Shadows".

**Histoire Origine du Village (Lore Profond) :**  
Les Exilés du Destin naquirent des premières victimes du Pacte Originel : quand les dieux tombèrent (trahis par leur hubris cosmique, dévorés par le Vide), des mortels fuirent dans les donjons, cherchant refuge. Mais le Dé les captura, les transformant en épreuves (cages) pour tester les Pactisés comme toi. Les premiers sauvés – une poignée d'humains et elfes purs – formèrent une caravane nomade, jurant fidélité au Pactisé qui les libéra. Au fil des cycles (tes runs), le village grandit : un symbole d'espoir fragile dans le chaos, mais corrompu par tes choix (mi-démons intégrés sèment discorde).

Twists Dark : 
- Si corruption basse (<25%) : Village pur, upgrades stables (ex. : morale haute = -stress permanent).
- Si moyenne (25-75%) : Mixte, factions internes (purs vs mi-démons débattent via dialogues).
- Si haute (>75%) : Village corrompu – PNJ mutent (yeux rouges, auras noires), upgrades démoniaques puissants, mais événements révolte ("Les mi-démons rallient contre les purs ! Choix : réprimer (+corruption) ou négocier (-or)").
Regrets Narratifs : Journal post-run ("Le village prospère grâce à mes sacrifices... Mais les cris des tombés hantent leurs regards."). Impacts Fins : Village pur débloque Fin C (troisième voie secrète) ; corrompu débloque Fin B (deviens dieu démon avec village esclave).

**Structures & Upgrades du Village (pour Gameplay Addictif) :**  
1. **Forge du Destin (Centrale, Dé Upgrades) :** Améliore le Dé (visuels vivants : yeux/murmures), fusions (2 dés → super-dé x2 faces, explosion particules DBZ). Coût : Or/rubis, risque +corruption.
2. **Marché Nomade :** Change rubis/or (fluctuant), achat buffs starters/combos sorts.
3. **Autel des Âmes :** Méta-progression (Soul Fragments → unlocks permanents), lié cages (sauvés ajoutent slots).
4. **Tentes Factionnelles :** Basées sur recrues cages (ex. : Irondeep Forge pour nains = +DEF armes ; Shrine of Shadows pour mi-démons = cursed buffs).
5. **Arène du Chaos :** Test builds (mini-runs simulés pour dopamine), évolue avec berserkers.
6. **Jardin des Regrets :** Réduit stress (via bardes/elfes purs), mais corrompu devient "Pit of Frenzy" (+ATK risqué).

**PNJ & Événements Village (Twists & Immersion) :**  
- **Dialogues Dynamiques :** PNJ réagissent à ta corruption (purs : peur si haute ; mi-démons : admiration).
- **Événements Aléatoires :** Révolte démoniaque, fête nomade (+morale), visitation Dé (tentation upgrades gratuits +corruption).
- **Exemples PNJ Génériques (Liés Cages) :** Recrues comme Kael/Zhara deviennent PNJ cliquables, avec quêtes meta (ex. : "Trouve relique pour ma tente" → reward RNG).

**Intégration au Jeu Global :**  
- **USP Renforcé :** Village = raison de rejouer (upgrades visibles, évolution "wow"). Lie cages/RNG : Choix runs impactent hub permanent.
- **Dopamine :** Sur recrutement/upgrade : Particules, sons crescendo, narration Dé ("Ton village respire... Grâce à moi.").
- **Pour Claude AI :** Prompt prêt : "Développe ce lore village nomade en 50 pages détaillées, dark fantasy mature. Ajoute 10+ événements/twists (révoltes, trahisons), 5 upgrades uniques, dialogues PNJ variés selon corruption. Inspire Dragon Age factions internes, Vampire Survivors meta-hub."

Stockage complet : Lore village prêt – booste lore à 9/10. On avance sur TODO : Code camp.js basique + Claude raffinage. Qu'en penses-tu, boss ? Ajuster twists, ou direct Claude session ? 🚀🏆