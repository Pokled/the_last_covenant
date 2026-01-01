/**
 * ForgeScene - Amélioration d'équipement chez Drenvar
 * @description Forge pour améliorer armes et armures
 */

import { getItemById } from '../../data/ItemDatabase.js';

export class ForgeScene {
    constructor(eventBus, stateManager, soundManager) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;
        this.soundManager = soundManager;
        
        this.element = null;
        this.selectedItem = null;
        
        this.STAT_NAMES = {
            'ATK': 'Attaque',
            'DEF': 'Défense',
            'HP': 'Vie',
            'CRIT_CHANCE': 'Critique',
            'CRIT_DAMAGE': 'Dégâts Crit',
            'SPEED': 'Vitesse',
            'DODGE': 'Esquive',
            'REGEN': 'Régénération'
        };
        
        this.createDOM();
    }

    createDOM() {
        this.element = document.createElement('div');
        this.element.id = 'forge-scene';
        this.element.className = 'scene';
        
        this.element.innerHTML = `
            <style>
                #forge-scene {
                    width: 100vw;
                    height: 100vh;
                    overflow: hidden;
                    font-family: 'Crimson Text', serif;
                    color: #f4e8d0;
                    background: #0a0a0f;
                }
                .forge-container {
                    width: 100vw;
                    height: 100vh;
                    display: grid;
                    grid-template-columns: 55% 45%;
                }
                
                /* GAUCHE - Workspace */
                .forge-workspace {
                    background: url('assets/images/background/BackGround_Forge.png');
                    background-size: cover;
                    background-position: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 40px;
                    position: relative;
                }
                .anvil-zone {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 30px;
                }
                .item-slot {
                    width: 200px;
                    height: 200px;
                    background: linear-gradient(135deg, rgba(20, 18, 15, 0.95), rgba(30, 25, 20, 0.95));
                    border: 3px dashed rgba(212, 175, 55, 0.5);
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.9), inset 0 0 30px rgba(212, 175, 55, 0.1);
                }
                .item-slot.forging {
                    opacity: 0;
                    pointer-events: none;
                }
                .item-slot:hover {
                    border-color: #f4d03f;
                    border-style: solid;
                    transform: scale(1.05);
                }
                .item-slot.has-item {
                    border-style: solid;
                    border-color: #f4d03f;
                    background: linear-gradient(135deg, rgba(35, 30, 25, 0.95), rgba(45, 38, 30, 0.95));
                }
                .slot-icon {
                    font-size: 3rem;
                    opacity: 0.4;
                }
                .slot-text {
                    font-family: 'Inter', sans-serif;
                    font-size: 0.9rem;
                    color: rgba(244, 232, 208, 0.5);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }
                .slotted-item-name {
                    font-family: 'Cinzel', serif;
                    font-size: 1.3rem;
                    font-weight: 600;
                    color: #f4d03f;
                    margin-bottom: 10px;
                    text-align: center;
                }
                .slotted-item-stats {
                    font-family: 'Inter', sans-serif;
                    font-size: 0.9rem;
                    color: rgba(244, 232, 208, 0.8);
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    text-align: center;
                }
                .upgrade-preview {
                    width: 450px;
                    background: linear-gradient(135deg, rgba(10, 10, 15, 0.95), rgba(20, 18, 15, 0.95));
                    border: 2px solid rgba(212, 175, 55, 0.5);
                    border-left: 4px solid rgba(212, 175, 55, 0.8);
                    padding: 25px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.9);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                .upgrade-preview.visible {
                    opacity: 1;
                }
                .upgrade-preview.forging {
                    opacity: 0;
                    pointer-events: none;
                }
                .preview-arrow {
                    font-size: 2.5rem;
                    color: #f4d03f;
                    text-align: center;
                    margin: 15px 0;
                }
                .preview-item-after {
                    text-align: center;
                    padding: 20px;
                    background: rgba(20, 18, 15, 0.9);
                    border: 2px solid #f4d03f;
                    border-radius: 4px;
                }
                .preview-item-after .item-name {
                    font-family: 'Cinzel', serif;
                    font-size: 1.3rem;
                    font-weight: 600;
                    color: #f4d03f;
                    margin-bottom: 15px;
                }
                .preview-stats {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .stat-line {
                    display: flex;
                    justify-content: space-between;
                    font-family: 'Inter', sans-serif;
                    font-size: 1rem;
                    color: rgba(244, 232, 208, 0.8);
                }
                .stat-improved {
                    color: #5f5;
                    font-weight: 600;
                }
                .forge-button {
                    margin-top: 25px;
                    font-family: 'Cinzel', serif;
                    font-size: 1.2rem;
                    font-weight: 600;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    padding: 18px 50px;
                    background: linear-gradient(135deg, rgba(20, 18, 15, 0.90), rgba(30, 25, 20, 0.90));
                    border: 2px solid rgba(212, 175, 55, 0.6);
                    border-left: 4px solid rgba(212, 175, 55, 0.8);
                    color: #f4d03f;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.8);
                    width: 100%;
                }
                .forge-button:hover:not(:disabled) {
                    border-color: #f4d03f;
                    background: linear-gradient(135deg, rgba(35, 30, 25, 0.95), rgba(45, 38, 30, 0.95));
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.9), 0 0 30px rgba(212, 175, 55, 0.4);
                }
                .forge-button:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }
                
                /* DROITE - Panel */
                .forge-panel {
                    background: linear-gradient(135deg, rgba(20, 18, 15, 0.98), rgba(30, 25, 20, 0.98));
                    border-left: 3px solid rgba(212, 175, 55, 0.5);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }
                .panel-header {
                    padding: 30px;
                    border-bottom: 2px solid rgba(90, 77, 58, 0.3);
                }
                .panel-title {
                    font-family: 'Cinzel', serif;
                    font-size: 2rem;
                    font-weight: 700;
                    color: #f4d03f;
                    margin-bottom: 10px;
                    letter-spacing: 0.12em;
                    text-shadow: 0 0 20px rgba(212, 175, 55, 0.6);
                }
                .panel-subtitle {
                    font-size: 1rem;
                    font-style: italic;
                    color: rgba(244, 232, 208, 0.6);
                    line-height: 1.6;
                }
                .panel-gold {
                    margin-top: 15px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-family: 'Cinzel', serif;
                    font-size: 1.3rem;
                    color: #f4d03f;
                }
                .panel-content {
                    flex: 1;
                    padding: 30px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 25px;
                }
                .section {
                    background: linear-gradient(135deg, rgba(10, 10, 15, 0.8), rgba(20, 18, 15, 0.8));
                    border: 2px solid rgba(90, 77, 58, 0.4);
                    border-left: 3px solid rgba(90, 77, 58, 0.6);
                    padding: 20px;
                }
                .section-title {
                    font-family: 'Cinzel', serif;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #f4d03f;
                    margin-bottom: 15px;
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                }
                .inventory-grid {
                    display: grid;
                    grid-template-columns: repeat(8, 1fr);
                    gap: 6px;
                    grid-auto-rows: 1fr;
                }
                .inventory-item {
                    aspect-ratio: 1 / 1;
                    min-height: 0;
                    background: linear-gradient(135deg, rgba(20, 18, 15, 0.9), rgba(30, 25, 20, 0.9));
                    border: 2px solid rgba(90, 77, 58, 0.3);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    padding: 4px;
                    position: relative;
                    z-index: 1;
                    background-image: 
                        repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(90, 77, 58, 0.05) 2px, rgba(90, 77, 58, 0.05) 4px),
                        linear-gradient(135deg, rgba(20, 18, 15, 0.9), rgba(30, 25, 20, 0.9));
                }
                .inventory-item.empty {
                    cursor: default;
                    opacity: 0.6;
                }
                .inventory-item.empty:hover {
                    border-color: rgba(90, 77, 58, 0.3);
                    transform: none;
                    box-shadow: none;
                }
                .item-tooltip {
                    position: absolute;
                    bottom: -128%;
                    left: 206%;
                    transform: translateX(-50%);
                    background: linear-gradient(135deg, rgba(10, 10, 15, 0.98), rgba(20, 15, 10, 0.98));
                    border: 2px solid rgba(212, 175, 55, 0.6);
                    padding: 12px;
                    border-radius: 4px;
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.2s ease;
                    z-index: 100000;
                    white-space: nowrap;
                    min-width: 220px;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.9);
                }
                .inventory-item:hover .item-tooltip {
                    opacity: 1;
                }
                .item-tooltip .tooltip-name {
                    font-size: 1rem;
                    font-weight: bold;
                    margin-bottom: 6px;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
                }
                .item-tooltip .tooltip-desc {
                    font-size: 0.8rem;
                    color: #aaa;
                    margin-bottom: 8px;
                    font-style: italic;
                    white-space: normal;
                }
                .item-tooltip .tooltip-stats {
                    font-size: 0.85rem;
                    display: flex;
                    flex-direction: column;
                    gap: 3px;
                }
                .item-tooltip .stat-line {
                    display: flex;
                    justify-content: space-between;
                    gap: 12px;
                }
                .item-tooltip .stat-positive { color: #4ade80; }
                .item-tooltip .stat-negative { color: #f87171; }
                .inventory-item:hover {
                    border-color: rgba(212, 175, 55, 0.7);
                    transform: scale(1.05);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.8);
                    z-index: 10000;
                }
                .inventory-item.selected {
                    border-color: #f4d03f;
                    border-width: 3px;
                    box-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
                }
                .inventory-item.just-forged {
                    animation: forgedGlow 2s ease-in-out;
                }
                .item-icon {
                    font-size: 1.8rem;
                    margin-bottom: 3px;
                }
                .item-name-short {
                    font-family: 'Inter', sans-serif;
                    font-size: 0.55rem;
                    color: #f4e8d0;
                    text-align: center;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
                .item-rarity-badge {
                    position: absolute;
                    top: 3px;
                    right: 3px;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    box-shadow: 0 0 6px currentColor;
                }
                .item-rarity-badge.rarity-commun { background: #aaa; }
                .item-rarity-badge.rarity-inhabituel { background: #5f5; }
                .item-rarity-badge.rarity-rare { background: #5af; }
                .item-rarity-badge.rarity-légendaire { background: #fa5; }
                .item-rarity-badge.rarity-maudit { background: #f55; }
                
                .tooltip-name.rarity-commun { color: #aaa; }
                .tooltip-name.rarity-inhabituel { color: #5f5; }
                .tooltip-name.rarity-rare { color: #5af; }
                .tooltip-name.rarity-légendaire { color: #fa5; }
                .tooltip-name.rarity-maudit { color: #f55; }
                
                .materials-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .material-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px;
                    background: rgba(20, 18, 15, 0.8);
                    border: 1px solid rgba(90, 77, 58, 0.3);
                }
                .material-name {
                    font-family: 'Inter', sans-serif;
                    font-size: 0.95rem;
                    color: #f4e8d0;
                }
                .material-count {
                    font-family: 'Cinzel', serif;
                    font-size: 1.1rem;
                    color: #d4af37;
                }
                .panel-content::-webkit-scrollbar { width: 8px; }
                .panel-content::-webkit-scrollbar-track { background: rgba(10, 10, 15, 0.8); }
                .panel-content::-webkit-scrollbar-thumb {
                    background: rgba(212, 175, 55, 0.5);
                    border-radius: 4px;
                }
                .narration {
                    position: absolute;
                    bottom: 30px;
                    left: 50%;
                    transform: translateX(-50%);
                    max-width: 700px;
                    background: linear-gradient(135deg, rgba(10, 10, 15, 0.98), rgba(20, 18, 15, 0.98));
                    border: 2px solid rgba(212, 175, 55, 0.5);
                    padding: 25px 35px;
                    font-size: 1.15rem;
                    font-style: italic;
                    color: rgba(244, 232, 208, 0.9);
                    text-align: center;
                    line-height: 1.6;
                    opacity: 0;
                    transition: opacity 0.5s ease;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.95);
                }
                .narration.visible {
                    opacity: 1;
                }
                
                /* ANIMATIONS */
                @keyframes forgedGlow {
                    0% { transform: scale(1) rotate(0deg); box-shadow: 0 0 0 rgba(212, 175, 55, 0); }
                    25% { transform: scale(1.2) rotate(180deg); box-shadow: 0 0 40px rgba(212, 175, 55, 0.9); border-color: #f4d03f; }
                    50% { transform: scale(1.1) rotate(360deg); box-shadow: 0 0 60px rgba(212, 175, 55, 1); }
                    75% { transform: scale(1.2) rotate(540deg); box-shadow: 0 0 40px rgba(212, 175, 55, 0.9); }
                    100% { transform: scale(1) rotate(720deg); box-shadow: 0 0 20px rgba(212, 175, 55, 0.4); }
                }
                
                /* MARTEAU */
                .hammer {
                    position: absolute;
                    top: calc(25% + 205px);
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 5rem;
                    opacity: 0;
                    z-index: 100;
                    pointer-events: none;
                }
                .hammer.forging {
                    animation: hammerStrike 0.4s ease-in-out 5;
                    opacity: 1;
                }
                @keyframes hammerStrike {
                    0% { transform: translateX(-50%) translateY(-80px) rotate(210deg); opacity: 1; }
                    50% { transform: translateX(-50%) translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateX(-50%) translateY(-80px) rotate(210deg); opacity: 1; }
                }
                
                /* ÉTINCELLES */
                .sparks {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 300px;
                    height: 300px;
                    transform: translate(-50%, -50%);
                    pointer-events: none;
                    opacity: 0;
                    z-index: 99;
                }
                .sparks.active {
                    animation: sparksBurst 0.4s ease-out 5;
                    opacity: 1;
                }
                @keyframes sparksBurst {
                    0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                    50% { transform: translate(-50%, -50%) scale(1.5); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
                }
                .spark {
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: #f4d03f;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #f4d03f;
                }
                
                /* Bouton retour */
                .btn-back {
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    padding: 12px 24px;
                    background: linear-gradient(135deg, rgba(20, 18, 15, 0.90), rgba(30, 25, 20, 0.90));
                    border: 2px solid rgba(212, 175, 55, 0.6);
                    color: #f4d03f;
                    font-family: 'Cinzel', serif;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    z-index: 1000;
                }
                .btn-back:hover {
                    border-color: #f4d03f;
                    background: linear-gradient(135deg, rgba(35, 30, 25, 0.95), rgba(45, 38, 30, 0.95));
                    transform: translateY(-2px);
                }
            </style>
            
            <div class="forge-container">
                <div class="forge-workspace">
                    <button class="btn-back" id="btn-back-to-camp">← Retour au Camp</button>
                    
                    <div class="hammer" id="hammer">🔨</div>
                    <div class="sparks" id="sparks"></div>
                    
                    <div class="anvil-zone">
                        <div class="item-slot" id="itemSlot">
                            <div class="slot-icon">⚒️</div>
                            <div class="slot-text">Place un objet ici</div>
                        </div>
                        
                        <div class="upgrade-preview" id="upgradePreview">
                            <div class="preview-arrow">↓</div>
                            <div class="preview-item-after">
                                <div class="item-name" id="previewName"></div>
                                <div class="preview-stats" id="previewStats"></div>
                            </div>
                            <button class="forge-button" id="forgeBtn" disabled>🔥 FORGER</button>
                        </div>
                    </div>
                    
                    <div class="narration" id="narration"></div>
                </div>
                
                <div class="forge-panel">
                    <div class="panel-header">
                        <h1 class="panel-title">⚒️ FORGE DE DRENVAR</h1>
                        <p class="panel-subtitle">"Alors, Pactisé. Qu'est-ce qui est cassé cette fois ?"</p>
                        <div class="panel-gold"><span>💰</span><span id="playerGold">0</span></div>
                    </div>
                    
                    <div class="panel-content">
                        <div class="section">
                            <h3 class="section-title">🎒 Inventaire</h3>
                            <div class="inventory-grid" id="inventoryGrid"></div>
                        </div>
                        
                        <div class="section">
                            <h3 class="section-title">🔨 Matériaux</h3>
                            <div class="materials-list" id="materialsList"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('game-container').appendChild(this.element);
    }

    onEnter(data) {
        console.log('Forge Scene: Active');
        
        this.element.classList.add('active');
        this.selectedItem = null;
        
        // Charger l'état du joueur
        this.loadPlayerData();
        
        // Render inventaire et matériaux
        this.renderInventory();
        this.renderMaterials();
        
        // Setup interactions
        this.setupInteractions();
        
        // Narration d'entrée
        this.showNarration('"Mon feu brûle jour et nuit. Donne-moi tes armures cabossées. Je recoudrai le métal."');
        
        // Sons
        if (this.soundManager) {
            this.soundManager.playMusic('forge');
        }
    }

    onExit() {
        this.element.classList.remove('active');
        this.selectedItem = null;
    }

    loadPlayerData() {
        const state = this.stateManager.getState();
        
        // Récupérer l'or du joueur
        const gold = state.gold || 0;
        document.getElementById('playerGold').textContent = gold;
    }

    renderInventory() {
        const grid = document.getElementById('inventoryGrid');
        grid.innerHTML = '';
        
        const state = this.stateManager.getState();
        const inventory = state.inventory || [];
        
        const totalSlots = 40;
        
        // Remplir avec items existants
        inventory.forEach(itemId => {
            const item = getItemById(itemId);
            if (!item) return;
            
            const card = document.createElement('div');
            card.className = 'inventory-item';
            card.dataset.itemId = item.id;
            
            const icon = item.type === 'arme' ? '🗡️' : '🛡️';
            
            // Générer stats pour tooltip
            let statsHTML = '';
            if (item.stats) {
                for (const [stat, value] of Object.entries(item.stats)) {
                    const displayStat = this.STAT_NAMES[stat] || stat;
                    const isPositive = value > 0;
                    const sign = value > 0 ? '+' : '';
                    const statClass = isPositive ? 'stat-positive' : 'stat-negative';
                    statsHTML += `<div class="stat-line"><span>${displayStat}</span><span class="${statClass}">${sign}${value}</span></div>`;
                }
            }
            
            card.innerHTML = `
                <div class="item-rarity-badge rarity-${item.rareté}"></div>
                <div class="item-icon">${icon}</div>
                <div class="item-name-short">${item.nom}</div>
                <div class="item-tooltip">
                    <div class="tooltip-name rarity-${item.rareté}">${item.nom}</div>
                    <div class="tooltip-desc">${item.description}</div>
                    <div class="tooltip-stats">${statsHTML}</div>
                    ${item.valeur ? `<div style="margin-top: 8px; color: #d4af37; font-size: 0.85rem;">💰 ${item.valeur} or</div>` : ''}
                </div>
            `;
            
            if (item.peutÊtreAmélioré) {
                card.addEventListener('click', () => this.selectItem(item));
            } else {
                card.style.opacity = '0.5';
                card.style.cursor = 'not-allowed';
            }
            
            grid.appendChild(card);
        });
        
        // Remplir cases vides
        const emptySlots = totalSlots - inventory.length;
        for (let i = 0; i < emptySlots; i++) {
            const emptyCard = document.createElement('div');
            emptyCard.className = 'inventory-item empty';
            grid.appendChild(emptyCard);
        }
    }

    renderMaterials() {
        const list = document.getElementById('materialsList');
        list.innerHTML = '';
        
        const state = this.stateManager.getState();
        const materials = state.materials || {};
        
        Object.entries(materials).forEach(([matId, count]) => {
            const mat = getItemById(matId);
            if (!mat) return;
            
            const div = document.createElement('div');
            div.className = 'material-item';
            div.innerHTML = `
                <span class="material-name">${mat.nom}</span>
                <span class="material-count">${count}</span>
            `;
            list.appendChild(div);
        });
    }

    selectItem(item) {
        this.selectedItem = item;
        
        // Highlight item sélectionné
        this.element.querySelectorAll('.inventory-item').forEach(c => c.classList.remove('selected'));
        this.element.querySelector(`[data-item-id="${item.id}"]`).classList.add('selected');
        
        // Afficher dans le slot
        const slot = document.getElementById('itemSlot');
        slot.classList.add('has-item');
        
        const statsText = Object.entries(item.stats)
            .filter(([k, v]) => v !== 0)
            .map(([k, v]) => `${this.STAT_NAMES[k] || k}: ${v > 0 ? '+' : ''}${v}`)
            .join(' • ');
        
        slot.innerHTML = `
            <div class="slotted-item-name">${item.nom}</div>
            <div class="slotted-item-stats">${statsText}</div>
        `;
        
        this.showUpgradePreview(item);
        this.showNarration('"Pose-la sur l\'enclume. Voyons ce qu\'on peut en faire."');
        
        if (this.soundManager) {
            this.soundManager.playClick();
        }
    }

    showUpgradePreview(item) {
        const preview = document.getElementById('upgradePreview');
        const upgraded = getItemById(item.améliorationVers);
        const cost = item.coûtAmélioration;
        
        document.getElementById('previewName').textContent = upgraded.nom;
        
        const statsHTML = Object.entries(upgraded.stats)
            .filter(([k, v]) => v !== 0)
            .map(([k, v]) => {
                const oldValue = item.stats[k] || 0;
                const isImproved = v > oldValue;
                return `<div class="stat-line ${isImproved ? 'stat-improved' : ''}">
                    <span>${this.STAT_NAMES[k] || k}</span>
                    <span>${v > 0 ? '+' : ''}${v}</span>
                </div>`;
            }).join('');
        
        document.getElementById('previewStats').innerHTML = statsHTML;
        
        const state = this.stateManager.getState();
        const playerGold = state.gold || 0;
        const materials = state.materials || {};
        
        const canAfford = playerGold >= cost.or;
        const hasMaterials = cost.matériaux.every(mat => (materials[mat.id] || 0) >= mat.quantité);
        
        document.getElementById('forgeBtn').disabled = !canAfford || !hasMaterials;
        
        preview.classList.add('visible');
    }

    showNarration(text) {
        const narration = document.getElementById('narration');
        narration.textContent = text;
        narration.classList.add('visible');
        setTimeout(() => narration.classList.remove('visible'), 4000);
    }

    setupInteractions() {
        // Bouton retour
        const btnBack = this.element.querySelector('#btn-back-to-camp');
        btnBack.addEventListener('click', () => this.backToCamp());
        
        // Bouton forge
        const forgeBtn = this.element.querySelector('#forgeBtn');
        forgeBtn.addEventListener('click', () => this.forgeItem());
    }

    forgeItem() {
        if (!this.selectedItem) return;
        
        const hammer = document.getElementById('hammer');
        const sparks = document.getElementById('sparks');
        const forgeBtn = document.getElementById('forgeBtn');
        const itemSlot = document.getElementById('itemSlot');
        const upgradePreview = document.getElementById('upgradePreview');
        
        forgeBtn.disabled = true;
        itemSlot.classList.add('forging');
        upgradePreview.classList.add('forging');
        
        // Créer étincelles
        sparks.innerHTML = '';
        for (let i = 0; i < 30; i++) {
            const spark = document.createElement('div');
            spark.className = 'spark';
            const angle = (Math.PI * 2 * i) / 30;
            const distance = 50 + Math.random() * 100;
            spark.style.left = `${50 + Math.cos(angle) * distance}%`;
            spark.style.top = `${50 + Math.sin(angle) * distance}%`;
            sparks.appendChild(spark);
        }
        
        // Animation marteau + étincelles
        hammer.classList.add('forging');
        sparks.classList.add('active');
        
        if (this.soundManager) {
            this.soundManager.playSuccess();
        }
        
        const cost = this.selectedItem.coûtAmélioration;
        const upgraded = getItemById(this.selectedItem.améliorationVers);
        
        setTimeout(() => {
            hammer.classList.remove('forging');
            sparks.classList.remove('active');
            
            // Déduire coûts du state
            const state = this.stateManager.getState();
            state.gold -= cost.or;
            cost.matériaux.forEach(mat => {
                state.materials[mat.id] -= mat.quantité;
            });
            
            // Remplacer item dans l'inventaire
            const inventory = state.inventory;
            const index = inventory.indexOf(this.selectedItem.id);
            if (index !== -1) {
                inventory[index] = upgraded.id;
            }
            
            // Sauvegarder
            this.stateManager.saveGame();
            
            // Update UI
            document.getElementById('playerGold').textContent = state.gold;
            
            this.showNarration(`"Le feu crépite. Le marteau frappe. C'est fait."\n\n✨ ${upgraded.nom} forgé avec succès !`);
            
            setTimeout(() => {
                this.selectedItem = null;
                itemSlot.classList.remove('has-item');
                itemSlot.classList.remove('forging');
                itemSlot.innerHTML = '<div class="slot-icon">⚒️</div><div class="slot-text">Place un objet ici</div>';
                upgradePreview.classList.remove('visible');
                upgradePreview.classList.remove('forging');
                
                this.renderInventory();
                this.renderMaterials();
                
                // Highlight item forgé
                setTimeout(() => {
                    const forgedCard = this.element.querySelector(`[data-item-id="${upgraded.id}"]`);
                    if (forgedCard) {
                        forgedCard.classList.add('just-forged');
                        forgedCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                }, 100);
            }, 1500);
        }, 2000);
    }

    backToCamp() {
        if (this.soundManager) {
            this.soundManager.playClick();
        }
        
        this.eventBus.emit('scene:change', { to: 'camp' });
    }
}
