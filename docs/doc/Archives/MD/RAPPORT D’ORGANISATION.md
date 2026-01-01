1. RÉSUMÉ EXÉCUTIF — ÉTAT DES LIEUX
Diagnostic global

Le projet est riche, créatif et déjà très avancé conceptuellement, mais il souffre de :

Fragmentation documentaire élevée

Multiples redondances conceptuelles

Absence de hiérarchie claire entre idées, règles et implémentation

Mélange des niveaux (lore ↔ mécanique ↔ UI ↔ debug)

👉 Le problème n’est pas un manque d’idées, mais un excès non structuré.

Statistiques d’audit (Data Analyst Mode)
📁 Fichiers analysés                : 40
📄 Documents de design / lore       : 23
📊 Fichiers JSON (données jeu)      : 9
🧪 Fichiers debug / test / notes    : 8

Tâches & intentions
✔ Implémenté / figé        : ~30 %
⚠ Décrit mais non tranché : ~45 %
❌ À faire / TODO implicite: ~25 %

Redondance
🔁 Concepts répétés (formes différentes) : ~35 %
🧨 Contradictions légères détectées      : 7
📄 Documents partiellement obsolètes     : 6

Principaux symptômes d’entropie

Plusieurs documents décrivent le même système avec :

un vocabulaire différent

un niveau de détail incohérent

Les fichiers CORRECTIONS, ANALYSE_COMPLETE, DEBUG_* contiennent :

des décisions de design importantes non propagées ailleurs

Les JSON sont riches mais orphelins (pas reliés à un GDD maître)

2. MASTER BACKLOG — LISTE UNIQUE, DÉDOUBLONNÉE ET PRIORISÉE
🟥 PRIORITÉ 1 — STRUCTURATION FONDAMENTALE
ID	Tâche	Description
MB-01	Créer un GDD Central	1 document maître qui fait foi
MB-02	Définir le Core Loop officiel	Action → Risque → Récompense → Corruption
MB-03	Normaliser le vocabulaire	Corruption, Dés, Trials, Cages, etc.
MB-04	Lier JSON ↔ règles	Chaque champ JSON doit avoir une règle écrite
MB-05	Séparer Lore / Mécanique	Aucun mélange dans un même fichier
🟧 PRIORITÉ 2 — GAMEPLAY & MÉCANIQUES
ID	Tâche
MB-06	Verrouiller le système de Corruption
MB-07	Clarifier l’usage exact des dés (DEBUG_DE.md)
MB-08	Finaliser les Cage Trials (conditions + outcomes)
MB-09	Harmoniser classes (JSON vs design textuel)
MB-10	Définir les états de défaite / punition
🟨 PRIORITÉ 3 — UX / UI / FEEL
ID	Tâche
MB-11	Règles UI pour ambiance lugubre
MB-12	Clarifier feedback joueur (risque, corruption)
MB-13	Nettoyer les idées UI expérimentales
🟩 PRIORITÉ 4 — POLISH & CONTENU
ID	Tâche
MB-14	Consolider le Bestiaire
MB-15	Vérifier cohérence Lore ↔ Gameplay
MB-16	Ajouter métriques internes (run length, morts)
3. DOCUMENT DE CONCEPTION UNIFIÉ (VERSION SYNTHÉTIQUE)
🎮 GAMEPLAY CORE

Jeu à fort risque / forte tension

Décisions irréversibles

Corruption = ressource + menace

Le joueur choisit quand il se damne

🧠 MÉCANIQUES PRINCIPALES

Systèmes validés (mais dispersés) :

🎲 Dés comme amplificateurs de chaos

🧪 Corruption progressive, multi-seuils

🪤 Cage Trials = épreuves méta

🦴 Objets osseux / maudits

⚠ Incohérences :

Corruption parfois punitive, parfois stratégique

Dés tantôt RNG pur, tantôt contrôlables

📜 LORE & AMBIANCE

Univers lugubre cohérent

Très bon ton (AMBIANCE_LUGUBRE.md)

Bestiaire riche mais trop descriptif, pas assez mécanique

👉 Recommandation :
Lore = justification, jamais règle.

🖥 UI / UX

Intention claire : malaise, oppression

Mais :

trop d’idées concurrentes

pas de règles UI écrites (contraste, rythme, feedback)

4. RECOMMANDATIONS TECHNIQUES (JS / ARCHITECTURE)
📁 STRUCTURE DE DOSSIERS RECOMMANDÉE
/src
 ├─ core/
 │   ├─ gameLoop.js
 │   ├─ corruptionSystem.js
 │   ├─ diceSystem.js
 │   └─ trialsSystem.js
 │
 ├─ data/
 │   ├─ classes.json
 │   ├─ bestiary.json
 │   └─ items.json
 │
 ├─ ui/
 │   ├─ hud.js
 │   ├─ feedback.js
 │   └─ screens/
 │
 ├─ lore/
 │   └─ textAssets.js
 │
 ├─ utils/
 │   └─ rng.js
 │
 └─ index.js

Bonnes pratiques clés (JS Senior)

❌ Aucun JSON sans commentaire de règle associé

✅ 1 système = 1 fichier

❌ Pas de logique métier dans l’UI

✅ Systèmes testables indépendamment

✅ Constantes de game balance centralisées

5. PLAN D’ACTION IMMÉDIAT (TRÈS CONCRET)
Étape 1 — Nettoyage (1–2 jours)

Marquer 6 fichiers comme ARCHIVE

Extraire décisions finales dans un GDD central

Étape 2 — Verrouillage Design (2–3 jours)

Corruption

Dés

Core Loop

Étape 3 — Refactor Mental & Technique

JSON alignés

Systèmes isolés

UI en dernier