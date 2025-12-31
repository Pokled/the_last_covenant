/**
 * CHARACTER SELECT SYSTEM
 * THE LAST COVENANT - Character Selection avec lore complète
 *
 * Affiche les 7 classes, leurs stats, lore, god affinity
 * Permet au joueur de choisir avant de commencer le run
 */

class CharacterSelectSystem {
    constructor() {
        this.selectedClass = null;
        this.classes = null;
        this.onClassSelected = null;
        this.playerName = '';
    }

    /**
     * Initialise le système avec les données des classes
     */
    async init() {
        try {
            // Charger les données des classes depuis JSON
            const response = await fetch('MD/classes-detailed.json');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.classes = data.CLASSES;
        } catch (error) {
            console.error('❌ Erreur chargement classes:', error);
            // Fallback vers classes hardcodées si JSON fail
            this.loadFallbackClasses();
        }
    }

    /**
     * Affiche le menu de sélection de personnage
     */
    show(onComplete) {
        this.onClassSelected = onComplete;

        // Créer overlay
        const overlay = document.createElement('div');
        overlay.className = 'character-select-overlay';
        overlay.innerHTML = `
            <div class="character-select-container">
                <div class="character-select-header">
                    <h1>THE LAST COVENANT</h1>
                    <h2>Choisis Ton Destin</h2>
                    <p class="subtitle">7 Classes. 7 Dieux Morts. 1 Choix.</p>

                    <div class="player-name-input-container">
                        <label for="playerNameInput" class="player-name-label">Nom du Pactisé</label>
                        <input
                            type="text"
                            id="playerNameInput"
                            class="player-name-input"
                            placeholder="Entre ton nom..."
                            maxlength="20"
                            autocomplete="off"
                        />
                        <p class="player-name-hint">Ton nom sera gravé dans les annales du Pacte...</p>
                    </div>
                </div>

                <div class="character-grid" id="characterGrid">
                    <!-- Classes seront injectées ici -->
                </div>

                <div class="character-details" id="characterDetails">
                    <div class="details-placeholder">
                        <p>Sélectionne une classe pour voir ses détails</p>
                    </div>
                </div>

                <div class="character-select-footer">
                    <button class="btn-confirm" id="btnConfirm" disabled>
                        Commencer le Voyage
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Populer les classes
        this.populateClassGrid();

        // Event listeners
        const btnConfirm = document.getElementById('btnConfirm');
        const playerNameInput = document.getElementById('playerNameInput');

        // Player name input listener
        playerNameInput.addEventListener('input', (e) => {
            this.playerName = e.target.value.trim();
            this.updateConfirmButton();
        });

        // Confirm button
        btnConfirm.addEventListener('click', () => {
            this.confirmSelection(overlay);
        });

        // Animation d'entrée
        setTimeout(() => overlay.classList.add('active'), 50);
    }

    /**
     * Met à jour l'état du bouton de confirmation
     */
    updateConfirmButton() {
        const btnConfirm = document.getElementById('btnConfirm');
        if (btnConfirm) {
            // Activer seulement si classe ET nom sont sélectionnés
            btnConfirm.disabled = !(this.selectedClass && this.playerName.length > 0);
        }
    }

    /**
     * Remplit la grille avec les 7 classes
     */
    populateClassGrid() {
        const grid = document.getElementById('characterGrid');

        const classOrder = [
            'SHATTERED_KNIGHT',
            'WITCH_OF_ASHES',
            'HOLLOW_ROGUE',
            'PENITENT',
            'BLOODBOUND',
            'SILENT_ARCHER',
            'DEMONIST'
        ];

        classOrder.forEach(classId => {
            const classData = this.classes[classId];
            if (!classData) {
                console.warn(`⚠️ Classe ${classId} manquante dans les données!`);
                return;
            }

            const card = document.createElement('div');
            card.className = 'class-card';
            card.dataset.classId = classId;

            // Déterminer couleur selon god affinity
            const godColor = this.getGodColor(classData.godAffinity);

            card.innerHTML = `
                <div class="class-card-header" style="border-color: ${godColor}">
                    <div class="class-icon">${classData.icon}</div>
                    <div class="class-name">${classData.name}</div>
                    <div class="class-god" style="color: ${godColor}">${classData.godName.split(',')[0]}</div>
                </div>
                <div class="class-card-body">
                    <div class="class-type">${classData.playStyle.archetype}</div>
                    <div class="class-difficulty difficulty-${classData.playStyle.difficulty.toLowerCase().replace(' ', '-')}">
                        ${this.getDifficultyStars(classData.playStyle.difficulty)}
                    </div>
                </div>
                <div class="class-card-footer">
                    <div class="class-quote">"${classData.lore.short}"</div>
                </div>
            `;

            // Click handler
            card.addEventListener('click', () => this.selectClass(classId));

            grid.appendChild(card);
        });
    }

    /**
     * Sélectionne une classe et affiche ses détails
     */
    selectClass(classId) {
        this.selectedClass = classId;
        const classData = this.classes[classId];

        // Visual feedback sur cards
        document.querySelectorAll('.class-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-class-id="${classId}"]`).classList.add('selected');

        // Afficher détails
        this.showClassDetails(classData);

        // Update confirm button state
        this.updateConfirmButton();
    }

    /**
     * Affiche les détails complets d'une classe
     */
    showClassDetails(classData) {
        const detailsPanel = document.getElementById('characterDetails');
        const godColor = this.getGodColor(classData.godAffinity);

        detailsPanel.innerHTML = `
            <div class="details-header">
                <div class="details-icon">${classData.icon}</div>
                <div class="details-title">
                    <h3>${classData.name}</h3>
                    <p class="details-god" style="color: ${godColor}">${classData.godAffinity} - ${classData.godStatus}</p>
                </div>
            </div>

            <div class="details-lore">
                <h4>Histoire</h4>
                <p>${classData.lore.full.split('\n\n')[0]}</p>
            </div>

            <div class="details-stats">
                <h4>Statistiques de Base</h4>
                <div class="stats-grid">
                    ${this.renderStats(classData.baseStats)}
                </div>
            </div>

            <div class="details-playstyle">
                <h4>Style de Jeu</h4>
                <div class="playstyle-info">
                    <div class="strengths">
                        <strong>Forces:</strong>
                        <ul>
                            ${classData.playStyle.strengths.map(s => `<li>${s}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="weaknesses">
                        <strong>Faiblesses:</strong>
                        <ul>
                            ${classData.playStyle.weaknesses.map(w => `<li>${w}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>

            <div class="details-mechanics">
                <h4>Mécaniques Clés</h4>
                ${this.renderKeyMechanics(classData.mechanics)}
            </div>

            <div class="details-dialogue">
                <div class="dialogue-quote">
                    "${classData.uniqueDialogue[0]}"
                </div>
            </div>
        `;

        // Animation
        detailsPanel.classList.add('loaded');
    }

    /**
     * Render stats sous forme de barres
     */
    renderStats(stats) {
        const statNames = {
            hp: 'PV',
            attack: 'Attaque',
            defense: 'Défense',
            speed: 'Vitesse',
            critChance: 'Crit %',
            magicPower: 'Magie',
            healPower: 'Soin',
            luck: 'Chance'
        };

        const maxValues = {
            hp: 200,
            attack: 30,
            defense: 30,
            speed: 20,
            critChance: 50,
            magicPower: 50,
            healPower: 50,
            luck: 20
        };

        let html = '';
        for (const [key, value] of Object.entries(stats)) {
            if (!statNames[key]) continue;

            const percentage = (value / maxValues[key]) * 100;
            const color = this.getStatColor(percentage);

            html += `
                <div class="stat-row">
                    <div class="stat-label">${statNames[key]}</div>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${percentage}%; background: ${color}"></div>
                    </div>
                    <div class="stat-value">${value}</div>
                </div>
            `;
        }
        return html;
    }

    /**
     * Render mécaniques clés (top 2)
     */
    renderKeyMechanics(mechanics) {
        let html = '<div class="mechanics-list">';
        let count = 0;

        for (const [key, mechanic] of Object.entries(mechanics)) {
            if (count >= 2) break;

            html += `
                <div class="mechanic-item">
                    <div class="mechanic-name">${mechanic.name}</div>
                    <div class="mechanic-desc">${mechanic.desc || mechanic.effect}</div>
                </div>
            `;
            count++;
        }

        html += '</div>';
        return html;
    }

    /**
     * Confirme la sélection et lance le jeu
     */
    confirmSelection(overlay) {
        if (!this.selectedClass || !this.playerName) return;

        const classData = this.classes[this.selectedClass];

        // Animation de sortie
        overlay.classList.add('closing');

        setTimeout(() => {
            overlay.remove();

            // Callback avec classe sélectionnée ET nom du joueur
            if (this.onClassSelected) {
                this.onClassSelected({
                    classId: this.selectedClass,
                    classData: classData,
                    playerName: this.playerName
                });
            }
        }, 500);
    }

    /**
     * Helpers - Couleurs selon dieu
     */
    getGodColor(godAffinity) {
        const colors = {
            'MORWYN': '#FFD700',      // Or (Ordre)
            'VYR': '#FF4500',          // Rouge-Orange (Feu)
            'SYLTHARA': '#9370DB',     // Violet (Destin)
            'AEL_MORA': '#F0E68C',     // Blanc-Doré (Fin Douce)
            'NOXAR': '#8B0000',        // Rouge Sombre (Mort)
            'KROVAX': '#DC143C',       // Cramoisi (Guerre)
            'THALYS': '#9400D3'        // Violet Foncé (Hasard)
        };
        return colors[godAffinity] || '#888';
    }

    /**
     * Couleur selon valeur de stat
     */
    getStatColor(percentage) {
        if (percentage >= 80) return '#10B981'; // Vert
        if (percentage >= 50) return '#F59E0B'; // Orange
        return '#EF4444'; // Rouge
    }

    /**
     * Difficulté en étoiles
     */
    getDifficultyStars(difficulty) {
        const stars = {
            'Facile': '⭐',
            'Moyen': '⭐⭐',
            'Difficile': '⭐⭐⭐',
            'Très difficile': '⭐⭐⭐⭐'
        };
        return (stars[difficulty] || '⭐⭐') + ` ${difficulty}`;
    }

    /**
     * Fallback classes si JSON fail
     */
    loadFallbackClasses() {
        this.classes = {
            SHATTERED_KNIGHT: {
                id: 'SHATTERED_KNIGHT',
                name: 'Chevalier Brisé',
                icon: '🛡️',
                godAffinity: 'MORWYN',
                godName: 'Morwyn, Scelleur de l\'Ordre',
                godStatus: 'Dévoré en premier',
                lore: {
                    short: 'Dernier de l\'Ordre Sacré. Protège un roi mort depuis 200 ans.',
                    full: 'Tu es le dernier. L\'Ordre Sacré de Morwyn comptait 10 000 chevaliers. Tous morts. Tu patrouilles encore les ruines.'
                },
                playStyle: {
                    archetype: 'Tank défensif',
                    difficulty: 'Moyen',
                    strengths: ['Haute défense', 'Protège alliés'],
                    weaknesses: ['Faible DPS', 'Lent']
                },
                baseStats: {
                    hp: 150,
                    attack: 12,
                    defense: 25,
                    speed: 8,
                    luck: 10
                },
                mechanics: {
                    SACRED_OATH: {
                        name: 'Serment Sacré',
                        desc: 'Choisir un serment par étage pour obtenir des buffs'
                    }
                },
                uniqueDialogue: ['Mon roi est mort. Mais l\'ordre demeure.']
            }
            // Ajouter autres classes en fallback si besoin
        };
    }
}

// Export global
window.CharacterSelectSystem = CharacterSelectSystem;

// Auto-init si standalone
if (typeof window !== 'undefined') {
    window.characterSelectSystem = new CharacterSelectSystem();
}
