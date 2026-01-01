const CLASSES = {
  "WARRIOR": {
    "type": "warrior",
    "name": "Guerrier",
    "icon": "G",
    "hp": 15,
    "atk": 4,
    "def": 3,
    "color": "#e74c3c",
    "inventorySize": 8,
    "description": "Dans l'Ère des Ombres, les Guerriers sont les survivants des batailles oubliées, forgés dans le sang et l'acier. Ils chargent au front, leur rage un bouclier contre la mort elle-même.",
    "strengths": [
      "Haute résistance (HP élevé, DEF solide)",
      "Attaques puissantes en mêlée (ATK 4)",
      "Idéal pour tanker les dés de combat"
    ],
    "weaknesses": [
      "Faible mobilité dans les pièges (inventaire limité à 8)",
      "Dépendant des jets de dé pour la défense"
    ]
  },
  "MAGE": {
    "type": "mage",
    "name": "Mage",
    "icon": "M",
    "hp": 10,
    "atk": 6,
    "def": 1,
    "color": "#3498db",
    "inventorySize": 12,
    "description": "Les Mages, maudits par les anciens arcanes, canalisent des forces qui corrompent l'âme. Leur magie dévore la vie, mais pulvérise les ténèbres du donjon.",
    "strengths": [
      "Dégâts magiques élevés (ATK 6)",
      "Grand inventaire pour sorts (12 slots)",
      "Avantage sur jets de dé arcaniques"
    ],
    "weaknesses": [
      "Fragile (HP 10, DEF 1)",
      "Risque de backlash sur jets ratés"
    ]
  },
  "ROGUE": {
    "type": "rogue",
    "name": "Voleur",
    "icon": "V",
    "hp": 12,
    "atk": 5,
    "def": 2,
    "color": "#9b59b6",
    "inventorySize": 16,
    "description": "Les Voleurs errent dans les ombres des ruines, survivants par la ruse et le poignard. Leur passé est taché de trahisons, leur avenir de trésors volés.",
    "strengths": [
      "Haute agilité (ATK 5, inventaire 16)",
      "Bonus sur jets de dé pour pièges et furtivité",
      "Exploration optimisée"
    ],
    "weaknesses": [
      "Défense moyenne (DEF 2)",
      "Vulnérable en combat direct"
    ]
  },
  "CLERIC": {
    "type": "cleric",
    "name": "Clerc",
    "icon": "C",
    "hp": 13,
    "atk": 3,
    "def": 3,
    "color": "#f39c12",
    "inventorySize": 10,
    "description": "Les Clercs, hantés par des dieux silencieux, portent la lumière dans l'abîme. Leur foi guérit, mais attire les horreurs qui dévorent les âmes pieuses.",
    "strengths": [
      "Soutien healing (HP 13, DEF 3)",
      "Bonus sur jets de dé divins",
      "Équilibre combat/support"
    ],
    "weaknesses": [
      "Dégâts faibles (ATK 3)",
      "Dépendant de la mana divine"
    ]
  },
  "BERSERKER": {
    "type": "berserker",
    "name": "Berserker",
    "icon": "B",
    "hp": 14,
    "atk": 5,
    "def": 2,
    "color": "#c0392b",
    "inventorySize": 6,
    "description": "Les Berserkers, nés de massacres ancestraux, embrassent la folie pour survivre. Leur fureur est une lame à double tranchant, consumant ennemi et soi.",
    "strengths": [
      "Attaques furieuses (ATK 5, HP 14)",
      "Bonus rage sur jets de dé critiques",
      "Tank agressif"
    ],
    "weaknesses": [
      "Inventaire minimal (6 slots)",
      "Risque de berserk incontrôlé"
    ]
  },
  "DEMONIST": {
    "type": "demonist",
    "name": "Demoniste",
    "icon": "D",
    "hp": 11,
    "atk": 6,
    "def": 1,
    "color": "#8e44ad",
    "inventorySize": 10,
    "description": "Les Démonistes pactisent avec l'Enfer, invoquant des abominations pour leur gloire. Chaque sort scelle leur damnation éternelle dans ce monde brisé.",
    "strengths": [
      "Invocations puissantes (ATK 6)",
      "Contrôle démoniaque sur jets de dé",
      "Inventaire pour artefacts (10)"
    ],
    "weaknesses": [
      "Faible vitalité (HP 11, DEF 1)",
      "Backlash démoniaque possible"
    ]
  },
  "ARCHER": {
    "type": "archer",
    "name": "Archer",
    "icon": "A",
    "hp": 11,
    "atk": 5,
    "def": 2,
    "color": "#16a085",
    "inventorySize": 12,
    "description": "Les Archers, chasseurs des terres désolées, tirent des flèches empoisonnées par la haine. Leur vue perçante révèle les horreurs cachées du donjon.",
    "strengths": [
      "Attaques à distance (ATK 5)",
      "Précision sur jets de dé ranged",
      "Inventaire équilibré (12)"
    ],
    "weaknesses": [
      "Vulnérable au corps-à-corps (DEF 2)",
      "Munitions limitées"
    ]
  }
};

console.log('Classes chargees:', Object.keys(CLASSES).length);