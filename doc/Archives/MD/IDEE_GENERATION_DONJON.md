3.2 Briser la linéarité du plateau
Techniques efficaces

Embranchements asymétriques

rapide mais dangereux

lent mais safe

Boucles de risque

rester volontairement pour farmer

au prix de corruption / malus

Cases conditionnelles

accessibles uniquement si :

certain état

malédiction active

👉 Le plateau devient une carte mentale, pas un chemin.

👉 comment justifier le fait de changer de chemin dans un système fondamentalement linéaire, sans casser l’identité “jeu de l’oie”.

Je vais te répondre en designer plateau + strat + RNG, avec des mécaniques concrètes, pas des concepts flous.

Principe fondamental (à graver dans le marbre)

Le joueur ne “choisit pas un chemin”.
Il choisit quelle contrainte il accepte.

Le plateau reste linéaire en surface, mais non linéaire en conséquences.

1. Le déclencheur de bifurcation (ce qui force ou incite à changer de chemin)

Dans un jeu de l’oie, on ne “tourne pas à gauche”.
👉 On change de trajectoire parce que quelque chose s’est mal (ou trop bien) passé.

1.1 La bifurcation par SEUIL (ma mécanique n°1 recommandée)
Concept

Des portes de plateau qui s’ouvrent / se ferment selon des seuils invisibles mais lisibles.

Exemples concrets

Si Corruption ≥ 5 → le chemin sûr devient inaccessible

Si Chance ≤ 2 → le chemin rapide s’effondre

Si Blessures ≥ 3 → accès à un raccourci “désespéré”

👉 Le joueur ne choisit pas directement le chemin,
👉 il choisit comment gérer ses stats, et le chemin en découle.

💡 Avantage :

Très lisible

Très “RPG”

Zéro UI lourde

2. La bifurcation par ÉTAT TEMPORAIRE (malédictions / bénédictions)
2.1 États qui modifient le plateau lui-même
Exemple

Malédiction : “Marqué par le Destin”

Certaines cases deviennent invisibles ou bloquées

D’autres apparaissent

Le plateau devient subjectif, pas universel.

👉 Deux joueurs au même point n’ont pas le même plateau.

2.2 Exemple ultra fort : les “chemins fantômes”

Un chemin n’existe que si :

une malédiction est active

un artefact est équipé

un pacte a été signé

Ces chemins :

sont plus courts

plus dangereux

plus rentables

💡 C’est exactement ce qui rend le plateau mental.

3. La bifurcation par RÉSULTAT DE DÉ (mais intelligemment)
3.1 Le dé ne décide pas du chemin, il décide du type de problème
Mauvais exemple (à éviter)

“Si tu fais 1–2 tu vas à gauche, sinon à droite”

Bon exemple

“Quel que soit le résultat, tu avances…
mais le dé détermine dans quel état tu arrives sur la bifurcation.”

Cas concret

Résultat bas → état Fragilisé

Résultat haut → état Instable

État actif → chemin imposé

👉 Le joueur savait avant de lancer ce que chaque état impliquait.

4. Les boucles de risque (volontaires, pas subies)
4.1 La boucle n’est jamais “gratuite”

Une boucle doit être :

tentante

dangereuse

psychologiquement engageante

Exemple

Zone du plateau :

+1 loot rare par tour

+1 corruption cumulée

corruption débloque… un chemin encore plus dangereux

👉 Le joueur se piège lui-même.

4.2 Sortir de la boucle = sacrifice

Pour quitter la boucle :

perdre un objet

accepter une malédiction

brûler une ressource de RNG

💡 C’est là que ton RNG modifiable devient une arme de sortie.

5. La bifurcation par INFORMATION PARTIELLE (sous-estimée)
5.1 Le joueur ne voit pas tout

Certains chemins montrent :

leurs récompenses

mais pas leurs risques

D’autres l’inverse

👉 Le joueur choisit ce qu’il préfère ne pas savoir.

6. Ce qu’il NE FAUT PAS faire (important)

❌ Choix de chemin explicite “gauche / droite” trop souvent
❌ Téléportations arbitraires
❌ Plateau trop symétrique
❌ Branches “objectivement meilleures”

7. Résumé ultra clair (design rule)

Le plateau est linéaire.
Les états du joueur sont non linéaires.
Le chemin est la conséquence, pas le choix.


Le système des “Nœuds de Destin”

Certaines cases sont des nœuds

À ces cases :

le jeu évalue 3–4 états clés

ouvre / ferme des segments

Le joueur savait depuis longtemps ce que ces états impliquent

👉 C’est élégant, lisible, profond, et parfaitement compatible avec le “jeu de l’oie”.

Un plateau textuel complet (lisible comme une carte mentale)

UNE règle universelle unique qui explique toutes les bifurcations sans exceptions
→ exactement ce qu’il faut pour un jeu de l’oie modernisé.

1. La Règle Universelle des Bifurcations

(le cœur du système, à ne jamais violer)

Toute bifurcation est déclenchée par un ÉTAT du joueur, jamais par un choix direct.

Formule absolue :

À une case Nœud :
→ le jeu évalue un ou plusieurs États
→ chaque État correspond à un Segment de Plateau
→ un seul Segment est valide

Conséquences design

Le plateau reste linéaire

Le joueur influence ses États, pas le chemin

Le chemin devient une conséquence logique, jamais arbitraire

Les 4 États fondamentaux (exemple robuste)

Tu peux en avoir plus, mais ces 4 couvrent 90 % des cas :

État	Sens
Vitalité	survie / usure
Corruption	risque / pactes
Chance	RNG manipulable
Fardeau	poids du loot / blessures
2. Plateau Type – Carte Mentale Textuelle

Je vais te le décrire comme un plan de jeu, pas comme un schéma graphique.

SEGMENT 1 – LA ROUTE COMMUNE (cases 1–8)
[1] Départ
[2] Route calme
[3] Événement mineur
[4] Jet de Dé (usure)
[5] Route calme
[6] Événement : Tentation
[7] Route calme
[8] NOEUD DE DESTIN I


Le joueur n’a encore aucune bifurcation visible.
Mais il a déjà :

peut-être de la corruption

peut-être perdu de la vitalité

peut-être modifié ses dés

NOEUD DE DESTIN I – “Le Carrefour Brisé”
Règle du nœud
Si Corruption ≥ 3 → Segment C
Sinon si Vitalité ≤ 4 → Segment B
Sinon → Segment A


⚠️ Un seul chemin possible, jamais de menu.

SEGMENT A – La Vieille Route (Safe mais lente)
[9A] Route pavée
[10A] Route pavée
[11A] Événement mineur
[12A] Route pavée
→ rejoint le plateau principal


Peu de récompenses

Peu de risques

Perte de temps réelle

SEGMENT B – Le Défilé des Os (Urgence)
[9B] Embuscade
[10B] Case de soin instable
[11B] Jet de Dé critique
→ rejoint le plateau principal


Plus court

Dangereux

Peut sauver une run… ou la tuer

SEGMENT C – Le Sentier Profané (Corrompu)
[9C] Pacte obligatoire
[10C] Boucle de risque
[11C] Artefact maudit
→ rejoint le plateau principal


Très rentable

Renforce la corruption

Débloque plus tard des chemins cachés

SEGMENT 2 – LE PLATEAU ALTÉRÉ (cases 13–20)

Après les segments, tout le monde se rejoint, mais pas dans le même état.

[13] Route instable
[14] Case événement dépendant de la Corruption
[15] Jet de Dé (modifiable)
[16] Boucle de risque optionnelle
[17] Route
[18] NOEUD DE DESTIN II

NOEUD DE DESTIN II – “Le Jugement du Dé”
Règle
Si Chance ≤ 1 → Segment E
Si Fardeau ≥ 3 → Segment D
Sinon → Segment F


Encore une fois :
👉 aucun choix explicite
👉 le joueur savait que ces États comptaient

SEGMENT D – Le Chemin du Poids

Lent

Allège le fardeau

Moins de combats

SEGMENT E – La Spirale du Hasard

Boucle semi-fermée

Farming possible

Chaque tour empire les dés

SEGMENT F – La Voie Claire

Équilibrée

Rien de spectaculaire

Idéale pour préparer le boss

3. Pourquoi ce système fonctionne (très important)
1. Le joueur se souvient de son parcours

“J’ai pris le sentier profané parce que j’avais trop de corruption.”

2. Le plateau devient une carte mentale

Pas besoin de mini-map complexe :

les noms

les états

les conséquences

3. Rejouabilité massive

Le même plateau donne :

des runs différentes

sans génération procédurale lourde

4. Implémentation logique (JS-friendly)

Un nœud = une fonction pure :

function resolveNode(state) {
  if (state.corruption >= 3) return 'SEGMENT_C';
  if (state.vitality <= 4) return 'SEGMENT_B';
  return 'SEGMENT_A';
}


👉 Multi-ready
👉 Debuggable
👉 Seed-compatible

5. La règle d’or finale

Si un joueur ne peut pas expliquer pourquoi il a pris un chemin, le design a échoué.

je vais te faire un visuel lisible immédiatement, pensé comme un plan de donjon / plateau mental, exactement pour répondre à la question :

“À quoi va ressembler le donjon quand on joue ?”

Je vais utiliser un schéma ASCII volontairement simple, parce que :

c’est proche de la réalité plateau

ça se transpose facilement en UI / Canvas

ça permet de “voir” les bifurcations sans choix explicite

🧭 Vue Globale du Donjon (Carte Mentale)
                         ┌──────────────┐
                         │  SEGMENT C   │
                         │ Sentier      │
                         │ Profané      │
                         │ (Corruption) │
                         └──────▲───────┘
                                │
                                │
[START]─[1]─[2]─[3]─[4]─[5]─[6]─[ NODE I ]─────────┐
                                │                 │
                                │                 │
                         ┌───────┴───────┐   ┌─────▼─────┐
                         │  SEGMENT B    │   │ SEGMENT A │
                         │ Défilé des Os │   │ Vieille   │
                         │ (Urgence)    │   │ Route     │
                         └──────▲───────┘   └─────▲─────┘
                                │                 │
                                └─────────┬───────┘
                                          │
                               ───────────┴───────────
                                          │
                                   [ Plateau Commun ]
                                          │
                                  [13]─[14]─[15]─[16]
                                          │
                                       [ NODE II ]
                             ┌────────────┼────────────┐
                             │            │            │
                       ┌─────▼─────┐ ┌────▼────┐ ┌────▼────┐
                       │ SEGMENT D │ │ SEGMENT E│ │ SEGMENT F│
                       │ Chemin du │ │ Spirale  │ │ Voie     │
                       │ Poids     │ │ du Hasard│ │ Claire   │
                       └─────▲─────┘ └────▲─────┘ └────▲─────┘
                             │            │            │
                             └────────────┴────────────┘
                                          │
                                       [ BOSS ]

🔍 Comment le joueur perçoit ce donjon en jeu
Très important :

👉 Le joueur ne voit PAS tous les chemins ouverts à l’avance.

Ce qu’il voit réellement :

Le plateau principal

Les Nœuds de Destin (cases spéciales)

Des segments “floutés / scellés” autour

Exemple visuel en jeu :

           ????
            │
[ ]─[ ]─[ ]─[NODE]─[ ]─[ ]
            │
           ????


Puis, au moment d’arriver sur le Nœud :

“Ton état attire un chemin particulier…”

👉 Un seul segment se révèle
👉 Les autres restent inconnus / inaccessibles

🧠 Lecture mentale du joueur (c’est ça que tu veux)

Après quelques runs, le joueur pense comme ça :

“Si je monte trop la corruption avant le Node I,
je vais forcément tomber sur le Sentier Profané…”

Le plateau devient :

une mémoire

un réseau de conséquences

pas une carte à optimiser froidement

🎲 Visualisation des Boucles de Risque

Exemple d’un segment en boucle (SEGMENT E) :

        ┌─────[17]─────┐
        │               │
      [16]            [18]
        │               │
        └─────[ LOOP ]──┘
           +Loot
           +Corruption
           -Stabilité


Le joueur reste volontairement

Chaque tour :

récompense

dégradation

Sortir = sacrifice

🎨 Traduction UI concrète (important pour Electron)
Ce que tu peux afficher visuellement

Le plateau principal → clair

Les segments alternatifs → teintés (rouge, violet, gris)

Les Nœuds → icône unique (sceau, rune, statue)

Animation clé

Au Nœud :

léger zoom

les segments inutiles s’effacent

le bon segment s’illumine

👉 Le joueur ressent que le jeu le juge.

⚠️ Erreur à éviter absolument (visuellement)

❌ Montrer un menu “Choisir un chemin”
❌ Montrer toutes les branches ouvertes
❌ Carte trop chargée type rogue-lite moderne

Tu veux :

Lisible → Mémorisable → Inquiétant

🧩 Résumé ultra court

Le donjon ressemble à une épine dorsale

Avec des excroissances conditionnelles

Les États du joueur sculptent le parcours

Le plateau est simple à lire, complexe à maîtriser