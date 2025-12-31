# GAME DESIGN DOCUMENT — VERSION MAÎTRE

> **Ce document fait foi.** Toute règle, mécanique ou donnée de jeu doit pouvoir y être rattachée.

---

## 1. VISION & INTENTION

### Pitch

**The Last Covenant** est un jeu de dungeon-crawling sombre et oppressant, centré sur la prise de risque consciente, la corruption progressive et des choix irréversibles.

### Piliers de Design

* **Tension permanente** : chaque décision peut empirer la situation.
* **Risque volontaire** : le joueur choisit quand pousser sa chance.
* **Corruption systémique** : à la fois ressource et menace.
* **Lisibilité du danger** : le joueur comprend toujours *pourquoi* il a perdu.

---

## 2. CORE LOOP (OFFICIEL)

```
Explorer
  ↓
Choisir un risque (combat / dés / cage / objet)
  ↓
Résoudre (RNG + systèmes)
  ↓
Gagner une récompense
  ↓
Augmenter la corruption
  ↓
S’adapter ou sombrer
```

La corruption est **inévitable**. La maîtrise consiste à la retarder ou l’exploiter.

---

## 3. SYSTÈMES PRINCIPAUX

### 3.1 Corruption — SYSTÈME VERROUILLÉ

**Définition** :
La Corruption représente la **rupture progressive du Pacte** liant le personnage aux forces qui lui permettent d’agir dans ce monde. Ce n’est ni une jauge morale abstraite, ni une simple pénalité : c’est une **trace métaphysique**, visible et ressentie.

---

### Philosophie de Design

* La corruption est :

  * **Inévitable**
  * **Compréhensible**
  * **Exploitée consciemment**

* Elle n’est **jamais aléatoire**.

* Elle n’est **jamais punitive sans contrepartie**.

> La corruption n’est pas une punition. C’est le prix d’un pouvoir qui ne devrait pas exister.

---

### Structure du Système

* Jauge globale : `0 → 100`
* Divisée en **Seuils Narrativo-Mécaniques**

| Seuil  | Nom          | Effet dominant                             |
| ------ | ------------ | ------------------------------------------ |
| 0–19   | Pacte Intact | Monde stable, règles prévisibles           |
| 20–39  | Fissures     | Bonus mineurs / Signes visuels             |
| 40–59  | Profanation  | Altération des règles, événements anormaux |
| 60–79  | Damnation    | Puissance accrue, pertes irréversibles     |
| 80–100 | Rupture      | Fin inévitable, issue narrative unique     |

---

### Sources de Corruption

Toute source de corruption doit appartenir à **une de ces catégories** :

1. **Pouvoir Volontaire**
   (dés, capacités spéciales, pactes temporaires)
2. **Survie Désespérée**
   (éviter la mort, sacrifier quelque chose)
3. **Transgression**
   (briser une règle du monde, profaner un lieu)

---

### Gains Associés (Règle d’Or)

Chaque gain de corruption DOIT fournir :

* Un **bénéfice immédiat clair**
* Une **trace persistante** (visuelle, mécanique ou narrative)

Exemples :

* +10 corruption → combat gagné automatiquement
* +15 corruption → accès à une Cage Trial interdite

---

### Effets Long Terme

* Les seuils modifient :

  * Le comportement des ennemis
  * Les règles de certains combats
  * Les événements narratifs

* Certains effets sont :

  * **irréversibles**
  * **spécifiques à la classe**

---

### Rupture du Pacte (End State)

À 100 corruption :

* Le joueur ne peut pas "perdre" normalement
* Une **fin scénarisée** se déclenche
* Le run devient un **épilogue jouable**

Objectif : transformer l’échec en conclusion signifiante.

---

### 3.2 Dés (Dice System)

* Les dés sont des **amplificateurs de chaos**.
* Le joueur choisit quand lancer.

Effets possibles :

* Bonus de puissance
* Altération des règles
* Corruption accrue

**Principe** : RNG contrôlé, jamais gratuit.

---

### 3.3 Cage Trials

Épreuves spéciales à choix forcé.

Caractéristiques :

* Conditions claires
* Issue toujours négative *ou* ambiguë
* Récompense disproportionnée

Objectif : tester la tolérance au risque du joueur.

---

## 4. COMBAT

* Combat tactique, punitif
* Peu de soins
* L’erreur coûte cher

Le combat n’est **jamais** la solution la plus sûre.

---

## 5. CLASSES & PERSONNAGES

Chaque classe :

* A une relation unique à la corruption
* Dispose d’un levier de risque spécifique

Les données détaillées sont stockées dans `/data/classes.json` et doivent respecter les règles décrites ici.

---

## 6. OBJETS

* Objets neutres
* Objets corrompus
* Objets sacrificiels

**Règle d’or** :

> Aucun objet puissant sans contrepartie.

---

## 7. DÉFAITE & ÉCHEC

* Mort = fin de run
* Mais :

  * Débloque du lore
  * Alimente la méta-compréhension

Le joueur doit apprendre par l’échec, pas le subir aveuglément.

---

## 8. UI / UX

Objectifs :

* Malaise
* Lisibilité
* Feedback constant

Principes :

* Peu de couleurs
* Animations lentes
* Sons oppressants

L’UI ne doit jamais rassurer.

---

## 9. LORE — LE PACTE ORIGINEL (CANON)

### Le Suicide des Sept

Il y a cinq siècles, les **Sept Dieux Primordiaux** ont commis l’impensable : ils se sont **dévorés eux-mêmes**.

Ce n’était ni un sacrifice, ni une guerre.
C’était une **fuite**.

Une menace cosmique — jamais nommée, jamais décrite — rendait l’existence divine insoutenable. Plutôt que d’affronter l’inéluctable, les dieux ont choisi de **se nier**.

De leur suicide est né quelque chose qui **n’aurait jamais dû exister**.

---

### La Naissance du Dé du Destin

Quand les dieux sont morts, leurs lois se sont effondrées.

Mais leur **volonté de contrôle** a survécu.

Elle s’est condensée en une entité chaotique, consciente, incomplète :

**Le Dé du Destin**.

* Il n’est pas un dieu.
* Il n’est pas vivant.
* Il est un **reste**.

Il ne crée pas le hasard.
Il **l’incarne**.

---

### Le Pacte

Face à un monde brisé où :

* les morts ne restent plus morts
* les vivants se transforment
* la causalité elle-même vacille

le Dé a proposé un **Pacte**.

Un marché impossible.

> *"Tu ne mourras plus. Mais chaque retour te coûtera ce que tu es."*

Des Pactisés, il y en eut plusieurs.

Ils ont tous échoué.

---

### Le Dernier Pactisé

Vous êtes le **Dernier Pactisé**.

* Immortel par contrainte
* Ressuscité par un pouvoir qui vous consume
* Observé par une entité qui espère

Le Dé ne vous guide pas.
Il **vous teste**.

Chaque choix nourrit la Corruption.
Chaque Cage révèle votre nature.

---

### Règle Lore Absolue

> Le lore **explique** les mécaniques.
> Il ne les excuse pas.
> Il ne les contredit jamais.

Si une mécanique ne peut pas être racontée comme une conséquence du Pacte,
**elle n’existe pas dans The Last Covenant**.

---

## 10. RÈGLES DE COHÉRENCE

* Toute nouvelle idée doit :

  * Se rattacher à un pilier
  * Affecter la corruption ou le risque
* Sinon : **refusée ou archivée**.

---

## 11. ÉTAT DU DOCUMENT

* Statut : **ACTIF / RÉFÉRENCE**
* Toute modification doit être datée et justifiée.
