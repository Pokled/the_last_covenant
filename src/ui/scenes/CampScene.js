/**
 * CampScene - Hub central entre les runs
 * @description Style Baldur's Gate 3 camp
 */

import { AnimationUtils } from '../../utils/AnimationUtils.js';

export class CampScene {
    constructor(eventBus, stateManager, soundManager) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;
        this.soundManager = soundManager;
        
        this.element = null;
        this.createDOM();
        this.setupEventListeners();
    }

    createDOM() {
        this.element = document.createElement('div');
        this.element.id = 'camp-scene';
        this.element.className = 'scene';
        
        this.element.innerHTML = `
            <div class="camp-background"></div>
            <canvas id="camp-particles" class="particles-container"></canvas>
            
            <div class="camp-container">
                <!-- Header avec info joueur -->
                <div class="camp-header">
                    <div class="player-info">
                        <h2 id="player-name-display">Pactisé</h2>
                        <p class="player-class" id="player-class-display">Classe</p>
                    </div>
                    
                    <div class="player-stats-mini">
                        <span>❤️ <span id="camp-hp">100</span>/<span id="camp-max-hp">100</span></span>
                        <span>💀 <span id="camp-corruption">0</span>%</span>
                        <span>💰 <span id="camp-gold">0</span> Or</span>
                    </div>
                </div>
                
                <!-- Zone centrale avec NPCs -->
                <div class="camp-main">
                    <h3 class="camp-title">Le Camp des Pactisés</h3>
                    <p class="camp-description">
                        Un refuge temporaire dans les ténèbres.<br>
                        Prépare-toi avant de plonger dans les Abysses.
                    </p>
                    
                    <div class="npc-grid">
                        <div class="npc-card" data-npc="forgeron">
                            <div class="npc-icon">⚒️</div>
                            <h4 class="npc-name">Drenvar le Forgeron</h4>
                            <p class="npc-description">Améliore tes armes et armures</p>
                            <span class="npc-status">Disponible</span>
                        </div>
                        
                        <div class="npc-card" data-npc="jardinier">
                            <div class="npc-icon">🌿</div>
                            <h4 class="npc-name">Le Jardinier des Regrets</h4>
                            <p class="npc-description">Purifie ta corruption... avec douleur</p>
                            <span class="npc-status">Disponible</span>
                        </div>
                        
                        <div class="npc-card" data-npc="enlumineur">
                            <div class="npc-icon">📜</div>
                            <h4 class="npc-name">L'Enlumineur d'Âmes</h4>
                            <p class="npc-description">Révèle les secrets du Lore</p>
                            <span class="npc-status">Disponible</span>
                        </div>
                        
                        <div class="npc-card" data-npc="marchand">
                            <div class="npc-icon">💰</div>
                            <h4 class="npc-name">Marchand Nomade</h4>
                            <p class="npc-description">Achète et vend des objets rares</p>
                            <span class="npc-status">Disponible</span>
                        </div>
                    </div>
                </div>
                
                <!-- Actions principales -->
                <div class="camp-actions">
                    <button class="btn-primary btn-large" id="btn-enter-dungeon">
                        🗺️ Carte du Monde
                    </button>
                    
                    <div class="camp-secondary-actions">
                        <button class="btn-secondary" id="btn-inventory">
                            🎒 Inventaire
                        </button>
                        <button class="btn-secondary" id="btn-character">
                            👤 Personnage
                        </button>
                        <button class="btn-secondary" id="btn-rest">
                            🔥 Se Reposer
                        </button>
                        <button class="btn-secondary" id="btn-quit-to-menu">
                            🚪 Quitter
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="vignette"></div>
        `;
        
        document.getElementById('game-container').appendChild(this.element);
    }

    setupEventListeners() {
        // Sera appelé dans onEnter
    }

    onEnter(data) {
        console.log('Camp Scene: Active');
        
        this.element.classList.add('active');
        
        // Charger infos joueur
        this.loadPlayerInfo();
        
        // Sons
        this.soundManager.playMusic('camp');
        
        // Setup interactions
        this.setupInteractions();
        
        // Animations
        AnimationUtils.fadeIn(this.element.querySelector('.camp-container'), 600);
    }

    loadPlayerInfo() {
        const state = this.stateManager.getState();
        const player = state.player;
        
        if (player) {
            document.getElementById('player-name-display').textContent = player.name || 'Pactisé';
            document.getElementById('player-class-display').textContent = player.classId || 'Classe';
            document.getElementById('camp-hp').textContent = Math.round(player.HP);
            document.getElementById('camp-max-hp').textContent = player.maxHP;
            document.getElementById('camp-corruption').textContent = Math.round(state.corruption);
            document.getElementById('camp-gold').textContent = state.gold || 0;
        }
    }

    setupInteractions() {
        // NPCs
        const npcCards = this.element.querySelectorAll('.npc-card');
        npcCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.soundManager.playHover();
            });
            
            card.addEventListener('click', () => {
                this.soundManager.playClick();
                const npcId = card.dataset.npc;
                this.interactWithNPC(npcId);
            });
        });
        
        // Actions principales
        const btnEnterDungeon = this.element.querySelector('#btn-enter-dungeon');
        btnEnterDungeon.addEventListener('mouseenter', () => this.soundManager.playHover());
        btnEnterDungeon.addEventListener('click', () => {
            this.soundManager.playClick();
            this.enterWorldMap();
        });
        
        // Actions secondaires
        const btnInventory = this.element.querySelector('#btn-inventory');
        const btnCharacter = this.element.querySelector('#btn-character');
        const btnRest = this.element.querySelector('#btn-rest');
        const btnQuit = this.element.querySelector('#btn-quit-to-menu');
        
        [btnInventory, btnCharacter, btnRest, btnQuit].forEach(btn => {
            btn.addEventListener('mouseenter', () => this.soundManager.playHover());
        });
        
        btnInventory.addEventListener('click', () => this.openInventory());
        btnCharacter.addEventListener('click', () => this.openCharacter());
        btnRest.addEventListener('click', () => this.rest());
        btnQuit.addEventListener('click', () => this.quitToMenu());
    }

    interactWithNPC(npcId) {
        console.log(`Interacting with NPC: ${npcId}`);
        
        this.soundManager.playClick();
        
        // Naviguer vers la scène appropriée
        if (npcId === 'forgeron') {
            this.eventBus.emit('scene:change', { to: 'forge' });
        } else {
            // TODO: Autres NPCs
            alert(`Dialogue avec ${npcId} - À implémenter`);
        }
    }

    enterWorldMap() {
        console.log('Opening World Map...');
        this.soundManager.playSuccess();
        
        // Sauvegarder avant de partir
        this.stateManager.saveGame();
        
        // Transition vers World Map
        setTimeout(() => {
            this.eventBus.emit('scene:change', { to: 'worldMap' });
        }, 300);
    }

    openInventory() {
        this.soundManager.playClick();
        console.log('Opening Inventory...');
        alert('Inventaire - À implémenter');
    }

    openCharacter() {
        this.soundManager.playClick();
        console.log('Opening Character Sheet...');
        alert('Feuille de personnage - À implémenter');
    }

    rest() {
        this.soundManager.playClick();
        console.log('Resting...');
        
        const state = this.stateManager.getState();
        const player = state.player;
        
        if (player) {
            // Restaurer HP
            player.HP = player.maxHP;
            
            // Réduire légèrement corruption
            const newCorruption = Math.max(0, state.corruption - 5);
            
            this.stateManager.setState({
                player,
                corruption: newCorruption
            });
            
            this.soundManager.playSuccess();
            this.loadPlayerInfo();
            
            alert('Repos effectué. HP restaurés, -5% corruption.');
        }
    }

    quitToMenu() {
        this.soundManager.playClick();
        
        const confirm = window.confirm('Retourner au menu principal ? (La partie sera sauvegardée)');
        if (confirm) {
            this.stateManager.saveGame();
            this.eventBus.emit('scene:change', { to: 'title' });
        }
    }

    onExit() {
        this.element.classList.remove('active');
        this.soundManager.stopMusic();
    }
}
