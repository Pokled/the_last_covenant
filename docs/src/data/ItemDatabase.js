/**
 * 📦 BASE DE DONNÉES DES OBJETS - THE LAST COVENANT
 * 
 * Tous les items du jeu : armes, armures, reliques, consommables, matériaux
 * 
 * STRUCTURE D'UN ITEM :
 * - Identité (id, nom, type, rareté, tier)
 * - Description (description, texte narratif)
 * - Stats de combat (ATK, DEF, HP, etc.)
 * - Caractéristiques (portée, dégâts, type)
 * - Enchantement (optionnel)
 * - Corruption (effets sur la corruption)
 * - Économie (valeur, revente)
 * - Amélioration (forge)
 * 
 * @version 1.0.0
 * @date 30 décembre 2025
 */

// ═════════════════════════════════════════════════════════════
// TYPES & RARETÉS
// ═════════════════════════════════════════════════════════════

export const ITEM_TYPES = {
    WEAPON: 'arme',
    ARMOR: 'armure',
    RELIC: 'relique',
    CONSUMABLE: 'consommable',
    MATERIAL: 'matériau'
};

export const RARITIES = {
    COMMON: 'commun',
    UNCOMMON: 'inhabituel',
    RARE: 'rare',
    LEGENDARY: 'légendaire',
    CURSED: 'maudit'
};

export const DAMAGE_TYPES = {
    PHYSICAL: 'physique',
    FIRE: 'feu',
    POISON: 'poison',
    VOID: 'vide',
    HOLY: 'sacré'
};

// ═════════════════════════════════════════════════════════════
// 🗡️ ARMES (8 items)
// ═════════════════════════════════════════════════════════════

export const WEAPONS = [
    // ─────────────────────────────────────────────────────────
    // TIER 1 - Armes de départ
    // ─────────────────────────────────────────────────────────
    {
        id: 'epee_rouillee',
        nom: 'Épée Rouillée',
        type: ITEM_TYPES.WEAPON,
        rareté: RARITIES.COMMON,
        tier: 1,
        
        description: 'Une lame cabossée qui a vu trop de batailles. La rouille mange le métal, mais l\'âme reste tranchante.',
        texteNarratif: '"Drenvar pourrait lui redonner vie. Peut-être."',
        
        stats: {
            ATK: 5,
            CRIT_CHANCE: 0.05
        },
        
        portée: 1,
        dégâts: '3-7',
        typeDégâts: DAMAGE_TYPES.PHYSICAL,
        
        effetCorruption: {
            àLÉquipement: 0,
            auCoup: 0,
            passif: 0
        },
        
        valeur: 50,
        valeurRevente: 25,
        
        peutÊtreAmélioré: true,
        améliorationVers: 'epee_affutee',
        coûtAmélioration: {
            or: 50,
            matériaux: [
                { id: 'larme_krovax', quantité: 1 }
            ]
        }
    },
    
    {
        id: 'hache_fendue',
        nom: 'Hache Fendue',
        type: ITEM_TYPES.WEAPON,
        rareté: RARITIES.COMMON,
        tier: 1,
        
        description: 'Le manche est fissuré, la lame ébréchée. Mais elle frappe lourd.',
        texteNarratif: '"Force brute. Rien de subtil. Exactement ce qu\'il faut pour survivre."',
        
        stats: {
            ATK: 7,
            CRIT_CHANCE: -0.05,
            SPEED: -1
        },
        
        portée: 1,
        dégâts: '5-9',
        typeDégâts: DAMAGE_TYPES.PHYSICAL,
        
        effetCorruption: {
            àLÉquipement: 0,
            auCoup: 0,
            passif: 0
        },
        
        valeur: 60,
        valeurRevente: 30,
        
        peutÊtreAmélioré: true,
        améliorationVers: 'hache_equilibree',
        coûtAmélioration: {
            or: 60,
            matériaux: [
                { id: 'plaque_fer', quantité: 2 }
            ]
        }
    },
    
    // ─────────────────────────────────────────────────────────
    // TIER 2 - Armes améliorées
    // ─────────────────────────────────────────────────────────
    {
        id: 'epee_affutee',
        nom: 'Épée Affûtée',
        type: ITEM_TYPES.WEAPON,
        rareté: RARITIES.UNCOMMON,
        tier: 2,
        
        description: 'Drenvar a recousu la lame. Le fil est tranchant, l\'équilibre parfait.',
        texteNarratif: '"La rouille est partie. Reste la cicatrice du métal. Mais elle coupe."',
        
        stats: {
            ATK: 8,
            CRIT_CHANCE: 0.10
        },
        
        portée: 1,
        dégâts: '6-10',
        typeDégâts: DAMAGE_TYPES.PHYSICAL,
        
        effetCorruption: {
            àLÉquipement: 0,
            auCoup: 0,
            passif: 0
        },
        
        valeur: 120,
        valeurRevente: 60,
        
        peutÊtreAmélioré: true,
        améliorationVers: 'epee_corrompue',
        coûtAmélioration: {
            or: 150,
            matériaux: [
                { id: 'fragment_ame', quantité: 1 }
            ]
        }
    },
    
    {
        id: 'hache_equilibree',
        nom: 'Hache Équilibrée',
        type: ITEM_TYPES.WEAPON,
        rareté: RARITIES.UNCOMMON,
        tier: 2,
        
        description: 'Manche renforcé, lame réparée. Elle chante en fendant l\'air.',
        texteNarratif: '"Drenvar a fait des miracles. Cette hache est redevenue ce qu\'elle devait être : mortelle."',
        
        stats: {
            ATK: 10,
            CRIT_CHANCE: 0.05,
            SPEED: 0
        },
        
        portée: 1,
        dégâts: '7-12',
        typeDégâts: DAMAGE_TYPES.PHYSICAL,
        
        effetCorruption: {
            àLÉquipement: 0,
            auCoup: 0,
            passif: 0
        },
        
        valeur: 140,
        valeurRevente: 70,
        
        peutÊtreAmélioré: false
    },
    
    // ─────────────────────────────────────────────────────────
    // TIER 3 - Armes rares / corrompues
    // ─────────────────────────────────────────────────────────
    {
        id: 'epee_corrompue',
        nom: 'Lame Corrompue',
        type: ITEM_TYPES.WEAPON,
        rareté: RARITIES.RARE,
        tier: 3,
        
        description: 'La lame pulse d\'une lueur noire. Chaque coup aspire un peu plus de ta lumière.',
        texteNarratif: '"Elle murmure. Des promesses de pouvoir. De victoires faciles. À quel prix ?"',
        
        stats: {
            ATK: 12,
            CRIT_CHANCE: 0.15,
            CRIT_DAMAGE: 0.2
        },
        
        portée: 1,
        dégâts: '10-16',
        typeDégâts: DAMAGE_TYPES.VOID,
        
        enchantement: {
            nom: 'Soif de Noirceur',
            effet: '+1 Corruption par coup critique',
            puissance: 2
        },
        
        effetCorruption: {
            àLÉquipement: 1,
            auCoup: 0,
            passif: 0,
            surCritique: 1
        },
        
        valeur: 250,
        valeurRevente: 125,
        
        peutÊtreAmélioré: false
    },
    
    {
        id: 'dague_empoisonnee',
        nom: 'Dague Empoisonnée',
        type: ITEM_TYPES.WEAPON,
        rareté: RARITIES.RARE,
        tier: 3,
        
        description: 'Une lame courte, enduite d\'un venin qui ne sèche jamais. Chaque coupure est une condamnation lente.',
        texteNarratif: '"Le poison fait le travail. Tu n\'as qu\'à attendre. Patient. Comme la mort."',
        
        stats: {
            ATK: 6,
            CRIT_CHANCE: 0.20,
            SPEED: 2
        },
        
        portée: 1,
        dégâts: '4-8 + 3 poison/tour',
        typeDégâts: DAMAGE_TYPES.POISON,
        
        enchantement: {
            nom: 'Venin Persistant',
            effet: '3 dégâts de poison par tour pendant 3 tours',
            puissance: 2
        },
        
        effetCorruption: {
            àLÉquipement: 0,
            auCoup: 0,
            passif: 0
        },
        
        valeur: 200,
        valeurRevente: 100,
        
        peutÊtreAmélioré: false
    },
    
    // ─────────────────────────────────────────────────────────
    // TIER 4 - Armes légendaires
    // ─────────────────────────────────────────────────────────
    {
        id: 'faucheur_du_vide',
        nom: 'Faucheur du Vide',
        type: ITEM_TYPES.WEAPON,
        rareté: RARITIES.LEGENDARY,
        tier: 4,
        
        description: 'Une lame forgée dans les Abysses. Elle ne coupe pas la chair. Elle coupe l\'existence elle-même.',
        texteNarratif: '"Les ennemis ne meurent pas. Ils cessent d\'avoir été. C\'est... différent."',
        
        stats: {
            ATK: 18,
            CRIT_CHANCE: 0.20,
            CRIT_DAMAGE: 0.5,
            SPEED: 1
        },
        
        portée: 1,
        dégâts: '15-25',
        typeDégâts: DAMAGE_TYPES.VOID,
        
        enchantement: {
            nom: 'Faille Dimensionnelle',
            effet: 'Vol de vie 15% + ignore 50% de la défense',
            puissance: 4
        },
        
        effetCorruption: {
            àLÉquipement: 2,
            auCoup: 0,
            passif: 1
        },
        
        valeur: 600,
        valeurRevente: 300,
        
        peutÊtreAmélioré: false
    },
    
    {
        id: 'derniere_esperance',
        nom: 'Dernière Espérance',
        type: ITEM_TYPES.WEAPON,
        rareté: RARITIES.LEGENDARY,
        tier: 4,
        
        description: 'Une épée bénie par les Sept Dieux... avant leur mort. Elle brûle encore d\'une lumière mourante.',
        texteNarratif: '"Elle refuse de s\'éteindre. Comme toi. Pathétique. Admirable."',
        
        stats: {
            ATK: 15,
            CRIT_CHANCE: 0.15,
            DEF: 3,
            HP: 20
        },
        
        portée: 1,
        dégâts: '12-20',
        typeDégâts: DAMAGE_TYPES.HOLY,
        
        enchantement: {
            nom: 'Lumière Mourante',
            effet: '+5 ATK si corruption < 5%, sinon -5 ATK',
            puissance: 3
        },
        
        effetCorruption: {
            àLÉquipement: -1,
            auCoup: 0,
            passif: -0.5
        },
        
        valeur: 500,
        valeurRevente: 250,
        
        peutÊtreAmélioré: false
    }
];

// ═════════════════════════════════════════════════════════════
// 🛡️ ARMURES (6 items)
// ═════════════════════════════════════════════════════════════

export const ARMORS = [
    // ─────────────────────────────────────────────────────────
    // TIER 1 - Armures de base
    // ─────────────────────────────────────────────────────────
    {
        id: 'armure_rapiécée',
        nom: 'Armure Rapiécée',
        type: ITEM_TYPES.ARMOR,
        rareté: RARITIES.COMMON,
        tier: 1,
        
        description: 'Cuir tanné et métal récupéré. Cousue à la va-vite. Mais mieux que rien.',
        texteNarratif: '"Chaque cicatrice de cette armure raconte une histoire. Aucune n\'est glorieuse."',
        
        stats: {
            DEF: 5,
            HP: 10
        },
        
        effetCorruption: {
            àLÉquipement: 0,
            auCoup: 0,
            passif: 0
        },
        
        valeur: 60,
        valeurRevente: 30,
        
        peutÊtreAmélioré: true,
        améliorationVers: 'armure_renforcee',
        coûtAmélioration: {
            or: 75,
            matériaux: [
                { id: 'plaque_fer', quantité: 3 }
            ]
        }
    },
    
    {
        id: 'tunique_usee',
        nom: 'Tunique Usée',
        type: ITEM_TYPES.ARMOR,
        rareté: RARITIES.COMMON,
        tier: 1,
        
        description: 'Tissu épais et renforcé. Légère mais fragile. Pour ceux qui préfèrent esquiver que bloquer.',
        texteNarratif: '"La mobilité sauve plus de vies que l\'acier. Ou du moins, c\'est ce qu\'on se dit."',
        
        stats: {
            DEF: 3,
            DODGE: 0.05,
            SPEED: 2
        },
        
        effetCorruption: {
            àLÉquipement: 0,
            auCoup: 0,
            passif: 0
        },
        
        valeur: 50,
        valeurRevente: 25,
        
        peutÊtreAmélioré: true,
        améliorationVers: 'manteau_ombre',
        coûtAmélioration: {
            or: 60,
            matériaux: [
                { id: 'tissu_renforce', quantité: 2 }
            ]
        }
    },
    
    // ─────────────────────────────────────────────────────────
    // TIER 2 - Armures améliorées
    // ─────────────────────────────────────────────────────────
    {
        id: 'armure_renforcee',
        nom: 'Armure Renforcée',
        type: ITEM_TYPES.ARMOR,
        rareté: RARITIES.UNCOMMON,
        tier: 2,
        
        description: 'Drenvar a soudé les plaques. L\'armure tient bon maintenant.',
        texteNarratif: '"C\'est du solide. Ça prendra les coups. Tu survivras. Un peu plus longtemps."',
        
        stats: {
            DEF: 8,
            HP: 25
        },
        
        effetCorruption: {
            àLÉquipement: 0,
            auCoup: 0,
            passif: 0
        },
        
        valeur: 140,
        valeurRevente: 70,
        
        peutÊtreAmélioré: true,
        améliorationVers: 'plastron_sang',
        coûtAmélioration: {
            or: 200,
            matériaux: [
                { id: 'fragment_ame', quantité: 1 }
            ]
        }
    },
    
    {
        id: 'manteau_ombre',
        nom: 'Manteau d\'Ombre',
        type: ITEM_TYPES.ARMOR,
        rareté: RARITIES.UNCOMMON,
        tier: 2,
        
        description: 'Un tissu sombre qui semble absorber la lumière. Tu te fonds dans les ténèbres.',
        texteNarratif: '"Les ombres sont tes alliées. Elles cachent. Elles protègent. Elles mentent."',
        
        stats: {
            DEF: 5,
            DODGE: 0.10,
            SPEED: 3
        },
        
        effetCorruption: {
            àLÉquipement: 0,
            auCoup: 0,
            passif: 0
        },
        
        valeur: 130,
        valeurRevente: 65,
        
        peutÊtreAmélioré: false
    },
    
    // ─────────────────────────────────────────────────────────
    // TIER 3 - Armures rares
    // ─────────────────────────────────────────────────────────
    {
        id: 'plastron_sang',
        nom: 'Plastron de Sang',
        type: ITEM_TYPES.ARMOR,
        rareté: RARITIES.RARE,
        tier: 3,
        
        description: 'Métal trempé dans le sang de mille batailles. Il pulse. Il a faim.',
        texteNarratif: '"L\'armure te protège en s\'abreuvant de toi. Un pacte dans le pacte."',
        
        stats: {
            DEF: 12,
            HP: 50,
            REGEN: -0.5
        },
        
        enchantement: {
            nom: 'Soif Écarlate',
            effet: 'Régénération -50% mais +2 DEF par ennemi tué (max 3 stacks)',
            puissance: 2
        },
        
        effetCorruption: {
            àLÉquipement: 1,
            auCoup: 0,
            passif: 0
        },
        
        valeur: 280,
        valeurRevente: 140,
        
        peutÊtreAmélioré: false
    },
    
    {
        id: 'armure_expiatoire',
        nom: 'Armure Expiatoire',
        type: ITEM_TYPES.ARMOR,
        rareté: RARITIES.LEGENDARY,
        tier: 4,
        
        description: 'Portée par les pénitents qui cherchaient le pardon dans la douleur. Elle ne l\'ont jamais trouvé.',
        texteNarratif: '"Chaque coup reçu est une prière. Chaque douleur, un rachat. Mais pour qui ?"',
        
        stats: {
            DEF: 10,
            HP: 40
        },
        
        enchantement: {
            nom: 'Pénitence Éternelle',
            effet: '-1 Corruption par 50 dégâts reçus',
            puissance: 3
        },
        
        effetCorruption: {
            àLÉquipement: -1,
            auCoup: 0,
            passif: 0,
            auDégâtsReçus: -0.02
        },
        
        valeur: 450,
        valeurRevente: 225,
        
        peutÊtreAmélioré: false
    }
];

// ═════════════════════════════════════════════════════════════
// 💍 RELIQUES (8 items - Effets spéciaux)
// ═════════════════════════════════════════════════════════════

export const RELICS = [
    {
        id: 'anneau_vitesse',
        nom: 'Anneau de Célérité',
        type: ITEM_TYPES.RELIC,
        rareté: RARITIES.UNCOMMON,
        tier: 2,
        
        description: 'Un anneau d\'argent gravé de symboles de vent. Tes mouvements deviennent plus rapides.',
        texteNarratif: '"Le premier coup décide souvent de tout. Sois rapide. Ou sois mort."',
        
        stats: {
            SPEED: 3
        },
        
        enchantement: {
            nom: 'Frappe Initiale',
            effet: 'Attaque toujours en premier au début du combat',
            puissance: 1
        },
        
        effetCorruption: {
            àLÉquipement: 0,
            auCoup: 0,
            passif: 0
        },
        
        valeur: 150,
        valeurRevente: 75,
        
        peutÊtreAmélioré: false
    },
    
    {
        id: 'amulette_sacrifice',
        nom: 'Amulette du Sacrifice',
        type: ITEM_TYPES.RELIC,
        rareté: RARITIES.RARE,
        tier: 3,
        
        description: 'Elle brûle contre ta peau. Chaque seconde, elle prend un peu de ta vie. En échange, tu frappes plus fort.',
        texteNarratif: '"Le pouvoir a toujours un prix. Cette fois, c\'est ton sang qui paie."',
        
        stats: {
            ATK: 5
        },
        
        enchantement: {
            nom: 'Puissance Sacrificielle',
            effet: '-1 HP par tour (max 50% HP) mais +5 ATK',
            puissance: 2
        },
        
        effetCorruption: {
            àLÉquipement: 1,
            auCoup: 0,
            passif: 0
        },
        
        valeur: 220,
        valeurRevente: 110,
        
        peutÊtreAmélioré: false
    },
    
    {
        id: 'medaillon_garde',
        nom: 'Médaillon du Garde',
        type: ITEM_TYPES.RELIC,
        rareté: RARITIES.UNCOMMON,
        tier: 2,
        
        description: 'Un vieux médaillon trouvé sur un garde mort. Il porte encore l\'empreinte de sa loyauté.',
        texteNarratif: '"Il a protégé quelqu\'un, jadis. Maintenant, c\'est ton tour d\'être protégé."',
        
        stats: {
            DEF: 3,
            HP: 15
        },
        
        enchantement: {
            nom: 'Dernier Rempart',
            effet: 'Si HP < 20%, +5 DEF jusqu\'à la fin du combat',
            puissance: 2
        },
        
        effetCorruption: {
            àLÉquipement: 0,
            auCoup: 0,
            passif: 0
        },
        
        valeur: 160,
        valeurRevente: 80,
        
        peutÊtreAmélioré: false
    },
    
    {
        id: 'cristal_corruption',
        nom: 'Cristal de Corruption',
        type: ITEM_TYPES.RELIC,
        rareté: RARITIES.CURSED,
        tier: 3,
        
        description: 'Un fragment d\'Abysses cristallisé. Il pulse de noirceur. Il veut entrer en toi.',
        texteNarratif: '"Plus tu es corrompu, plus tu es puissant. Simple. Efficace. Damné."',
        
        stats: {
            ATK: 0,
            CRIT_DAMAGE: 0.3
        },
        
        enchantement: {
            nom: 'Pacte Obscur',
            effet: '+1 ATK par point de corruption (max +15)',
            puissance: 4
        },
        
        effetCorruption: {
            àLÉquipement: 2,
            auCoup: 0,
            passif: 0.5
        },
        
        valeur: 300,
        valeurRevente: 150,
        
        peutÊtreAmélioré: false
    },
    
    {
        id: 'talisman_des',
        nom: 'Talisman du Dé',
        type: ITEM_TYPES.RELIC,
        rareté: RARITIES.LEGENDARY,
        tier: 4,
        
        description: 'Un petit dé d\'ivoire suspendu à une chaîne. Thalys ricane quand tu le regardes.',
        texteNarratif: '"Il te suit. Il t\'observe. Il t\'attend. Et maintenant, tu le portes."',
        
        stats: {
            CRIT_CHANCE: 0.10
        },
        
        enchantement: {
            nom: 'Faveur du Hasard',
            effet: 'Le Dé peut être invoqué 2 fois par combat',
            puissance: 5
        },
        
        effetCorruption: {
            àLÉquipement: 1,
            auCoup: 0,
            passif: 0
        },
        
        valeur: 500,
        valeurRevente: 250,
        
        peutÊtreAmélioré: false
    },
    
    {
        id: 'lys_seche',
        nom: 'Lys Séché',
        type: ITEM_TYPES.RELIC,
        rareté: RARITIES.RARE,
        tier: 2,
        
        description: 'Un Lys du Pardon séché et préservé. Il absorbe encore un peu de corruption, même mort.',
        texteNarratif: '"Même dans la mort, il sert. Comme toi. Comme nous tous."',
        
        stats: {
            HP: 10
        },
        
        enchantement: {
            nom: 'Purification Passive',
            effet: '-0.5 Corruption par combat gagné',
            puissance: 2
        },
        
        effetCorruption: {
            àLÉquipement: -1,
            auCoup: 0,
            passif: -0.5
        },
        
        valeur: 180,
        valeurRevente: 90,
        
        peutÊtreAmélioré: false
    },
    
    {
        id: 'sceau_pacte',
        nom: 'Sceau du Pacte Brisé',
        type: ITEM_TYPES.RELIC,
        rareté: RARITIES.LEGENDARY,
        tier: 4,
        
        description: 'Le sceau que tu as signé avec Thalys. Il est gravé dans ta chair maintenant.',
        texteNarratif: '"Tu ne peux pas l\'enlever. Il fait partie de toi. Comme la corruption."',
        
        stats: {
            ATK: 3,
            DEF: 3,
            HP: 20
        },
        
        enchantement: {
            nom: 'Résurrection du Damné',
            effet: 'Reviens à 1 HP si tué (1x par donjon, +1 corruption)',
            puissance: 5
        },
        
        effetCorruption: {
            àLÉquipement: 0,
            auCoup: 0,
            passif: 0,
            àLaMort: 1
        },
        
        valeur: 600,
        valeurRevente: 300,
        
        peutÊtreAmélioré: false
    },
    
    {
        id: 'os_ancien',
        nom: 'Os d\'Ancien',
        type: ITEM_TYPES.RELIC,
        rareté: RARITIES.RARE,
        tier: 3,
        
        description: 'L\'os d\'une créature oubliée. Il vibre quand tu touches la mort.',
        texteNarratif: '"Il te murmure des secrets. Des chemins entre la vie et le néant."',
        
        stats: {
            DODGE: 0.08
        },
        
        enchantement: {
            nom: 'Pas Fantomatique',
            effet: 'Quand HP < 30%, +15% esquive',
            puissance: 3
        },
        
        effetCorruption: {
            àLÉquipement: 0,
            auCoup: 0,
            passif: 0
        },
        
        valeur: 240,
        valeurRevente: 120,
        
        peutÊtreAmélioré: false
    }
];

// ═════════════════════════════════════════════════════════════
// 🧪 CONSOMMABLES (5 items)
// ═════════════════════════════════════════════════════════════

export const CONSUMABLES = [
    {
        id: 'soupe_grimm',
        nom: 'Soupe de Grimm',
        type: ITEM_TYPES.CONSUMABLE,
        rareté: RARITIES.COMMON,
        tier: 1,
        
        description: 'Une soupe épaisse et fumante. Tu ne veux pas savoir ce qu\'il y a dedans.',
        texteNarratif: '"Grimm ne parle pas. Il cuisine. Et ça fonctionne."',
        
        effet: {
            type: 'restauration',
            HP: 50
        },
        
        utilisations: 1,
        
        effetCorruption: {
            àLUtilisation: 0
        },
        
        valeur: 15,
        valeurRevente: 5,
        
        fabriquéPar: 'Grimm',
        peutÊtreAmélioré: false
    },
    
    {
        id: 'ration_survie',
        nom: 'Ration de Survie',
        type: ITEM_TYPES.CONSUMABLE,
        rareté: RARITIES.COMMON,
        tier: 1,
        
        description: 'Pain sec et viande séchée. Le strict minimum pour ne pas mourir de faim.',
        texteNarratif: '"Ce n\'est pas bon. Mais c\'est de la nourriture. Dans les Profondeurs, c\'est un luxe."',
        
        effet: {
            type: 'restauration',
            HP: 30
        },
        
        utilisations: 1,
        
        effetCorruption: {
            àLUtilisation: 0
        },
        
        valeur: 10,
        valeurRevente: 3,
        
        fabriquéPar: 'Grimm',
        peutÊtreAmélioré: false
    },
    
    {
        id: 'petale_lys',
        nom: 'Pétale de Lys Purifié',
        type: ITEM_TYPES.CONSUMABLE,
        rareté: RARITIES.RARE,
        tier: 2,
        
        description: 'Un pétale blanc immaculé. Il fond sur ta langue et emporte un peu de ta noirceur.',
        texteNarratif: '"Le Jardinier te le donne avec tristesse. Ses enfants meurent pour toi."',
        
        effet: {
            type: 'purification',
            corruption: -2
        },
        
        utilisations: 1,
        
        effetCorruption: {
            àLUtilisation: -2
        },
        
        valeur: 100,
        valeurRevente: 50,
        
        fabriquéPar: 'Jardinier',
        peutÊtreAmélioré: false
    },
    
    {
        id: 'fiole_sang',
        nom: 'Fiole de Sang Maudit',
        type: ITEM_TYPES.CONSUMABLE,
        rareté: RARITIES.CURSED,
        tier: 3,
        
        description: 'Du sang noir et épais. Boire ça te donnera de la force. Pour un temps.',
        texteNarratif: '"Corvus sourit quand tu achètes ça. Il sait. Tu sais. Tu bois quand même."',
        
        effet: {
            type: 'buff_temporaire',
            ATK: 5,
            durée: '1 combat'
        },
        
        utilisations: 1,
        
        effetCorruption: {
            àLUtilisation: 1
        },
        
        valeur: 80,
        valeurRevente: 40,
        
        fabriquéPar: 'Corvus',
        peutÊtreAmélioré: false
    },
    
    {
        id: 'baume_regen',
        nom: 'Baume de Régénération',
        type: ITEM_TYPES.CONSUMABLE,
        rareté: RARITIES.UNCOMMON,
        tier: 2,
        
        description: 'Un onguent verdâtre qui sent les herbes. Il referme lentement les plaies.',
        texteNarratif: '"Trois tours de régénération. Assez pour survivre. Peut-être."',
        
        effet: {
            type: 'régénération',
            HP: 10,
            tours: 3
        },
        
        utilisations: 1,
        
        effetCorruption: {
            àLUtilisation: 0
        },
        
        valeur: 50,
        valeurRevente: 25,
        
        fabriquéPar: 'Grimm',
        peutÊtreAmélioré: false
    }
];

// ═════════════════════════════════════════════════════════════
// 🔨 MATÉRIAUX (3 items)
// ═════════════════════════════════════════════════════════════

export const MATERIALS = [
    {
        id: 'larme_krovax',
        nom: 'Larme de Krovax',
        type: ITEM_TYPES.MATERIAL,
        rareté: RARITIES.UNCOMMON,
        tier: 2,
        
        description: 'Un cristal rouge qui pleure une chaleur divine. Utilisé par Drenvar pour souder le métal.',
        texteNarratif: '"Krovax était un dieu de la guerre. Ses larmes forgent encore des armes."',
        
        utilisation: 'Forge - Amélioration d\'armes',
        dropRate: 0.15,
        dropSource: 'Salles de guerre',
        
        effetCorruption: {
            àLÉquipement: 0
        },
        
        valeur: 30,
        valeurRevente: 15,
        
        peutÊtreAmélioré: false
    },
    
    {
        id: 'plaque_fer',
        nom: 'Plaque de Fer',
        type: ITEM_TYPES.MATERIAL,
        rareté: RARITIES.COMMON,
        tier: 1,
        
        description: 'Une plaque de métal récupérée sur un ennemi. Lourde, solide, utile.',
        texteNarratif: '"Drenvar ne gâche rien. Même la ferraille devient armure."',
        
        utilisation: 'Forge - Amélioration d\'armures',
        dropRate: 0.25,
        dropSource: 'Ennemis armurés',
        
        effetCorruption: {
            àLÉquipement: 0
        },
        
        valeur: 20,
        valeurRevente: 10,
        
        peutÊtreAmélioré: false
    },
    
    {
        id: 'fragment_ame',
        nom: 'Fragment d\'Âme',
        type: ITEM_TYPES.MATERIAL,
        rareté: RARITIES.RARE,
        tier: 3,
        
        description: 'Un éclat d\'âme cristallisé. Il vibre encore d\'une conscience mourante.',
        texteNarratif: '"Les boss laissent toujours quelque chose derrière. Une trace. Un regret. Une arme."',
        
        utilisation: 'Forge - Enchantements spéciaux',
        dropRate: 1.0,
        dropSource: 'Boss uniquement',
        
        effetCorruption: {
            àLUtilisation: 1
        },
        
        valeur: 100,
        valeurRevente: 50,
        
        peutÊtreAmélioré: false
    }
];

// ═════════════════════════════════════════════════════════════
// 📚 BASE DE DONNÉES COMPLÈTE
// ═════════════════════════════════════════════════════════════

export const ALL_ITEMS = [
    ...WEAPONS,
    ...ARMORS,
    ...RELICS,
    ...CONSUMABLES,
    ...MATERIALS
];

// Fonction utilitaire pour récupérer un item par ID
export function getItemById(id) {
    return ALL_ITEMS.find(item => item.id === id);
}

// Fonction utilitaire pour filtrer par type
export function getItemsByType(type) {
    return ALL_ITEMS.filter(item => item.type === type);
}

// Fonction utilitaire pour filtrer par rareté
export function getItemsByRarity(rarity) {
    return ALL_ITEMS.filter(item => item.rareté === rarity);
}

// Stats de la base de données
console.log(`📦 Base de données chargée:`);
console.log(`   - ${WEAPONS.length} armes`);
console.log(`   - ${ARMORS.length} armures`);
console.log(`   - ${RELICS.length} reliques`);
console.log(`   - ${CONSUMABLES.length} consommables`);
console.log(`   - ${MATERIALS.length} matériaux`);
console.log(`   - TOTAL: ${ALL_ITEMS.length} items`);
