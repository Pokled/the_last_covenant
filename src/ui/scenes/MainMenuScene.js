/**
 * MainMenuScene - Menu principal avec options
 */

export class MainMenuScene {
    constructor(eventBus, stateManager, soundManager) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;
        this.soundManager = soundManager;
        this.element = null;
        
        this.createDOM();
    }

    createDOM() {
        this.element = document.createElement('div');
        this.element.id = 'main-menu-scene';
        this.element.className = 'scene';
        
        this.element.innerHTML = `
            <style>
                #main-menu-scene {
                    width: 100vw;
                    height: 100vh;
                    overflow: hidden;
                    font-family: 'Crimson Text', serif;
                    color: #f4e8d0;
                    background: #0a0a0f;
                    position: relative;
                }
                
                .menu-background {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: 
                        linear-gradient(180deg, 
                            rgba(10, 10, 15, 0.6) 0%, 
                            rgba(10, 10, 15, 0.3) 30%, 
                            rgba(10, 10, 15, 0.2) 50%, 
                            rgba(10, 10, 15, 0.4) 70%, 
                            rgba(10, 10, 15, 0.7) 100%
                        ),
                        url('assets/images/background/Background_menu.png') center center / cover no-repeat;
                    background-attachment: fixed;
                    animation: backgroundBreathing 25s ease-in-out infinite alternate;
                }
                
                @keyframes backgroundBreathing {
                    0% { 
                        transform: scale(1); 
                        filter: brightness(0.75) contrast(1.1);
                    }
                    100% { 
                        transform: scale(1.03); 
                        filter: brightness(0.85) contrast(1.15);
                    }
                }
                
                .menu-container {
                    position: relative;
                    z-index: 10;
                    width: 100vw;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 60px;
                }
                
                .menu-logo {
                    font-family: 'Cinzel', serif;
                    font-size: 4rem;
                    font-weight: 900;
                    color: #f4d03f;
                    text-align: center;
                    letter-spacing: 0.15em;
                    text-shadow: 
                        0 0 20px rgba(212, 175, 55, 0.7),
                        0 0 40px rgba(212, 175, 55, 0.4),
                        0 2px 4px rgba(0, 0, 0, 0.9);
                    animation: logoGlow 3s ease-in-out infinite alternate;
                    text-transform: uppercase;
                    line-height: 1.3;
                }
                
                @keyframes logoGlow {
                    0% { 
                        text-shadow: 
                            0 0 20px rgba(212, 175, 55, 0.7),
                            0 0 40px rgba(212, 175, 55, 0.4),
                            0 2px 4px rgba(0, 0, 0, 0.9);
                    }
                    100% { 
                        text-shadow: 
                            0 0 30px rgba(212, 175, 55, 0.9),
                            0 0 60px rgba(212, 175, 55, 0.6),
                            0 2px 4px rgba(0, 0, 0, 0.9);
                    }
                }
                
                .menu-buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    align-items: center;
                }
                
                .menu-btn {
                    position: relative;
                    font-family: 'Cinzel', serif;
                    font-size: 1.1rem;
                    font-weight: 600;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    padding: 16px 60px;
                    background: linear-gradient(135deg, 
                        rgba(20, 18, 15, 0.90) 0%, 
                        rgba(30, 25, 20, 0.90) 100%
                    );
                    border: 2px solid rgba(90, 77, 58, 0.5);
                    border-top: 1px solid rgba(138, 125, 106, 0.3);
                    border-left: 1px solid rgba(138, 125, 106, 0.3);
                    color: rgba(244, 232, 208, 0.95);
                    cursor: pointer;
                    transition: all 0.25s ease;
                    box-shadow: 
                        inset 0 1px 0 rgba(138, 125, 106, 0.15),
                        0 4px 16px rgba(0, 0, 0, 0.6);
                    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
                    width: 300px;
                    text-align: center;
                }
                
                .menu-btn:hover {
                    border-color: rgba(212, 175, 55, 0.75);
                    background: linear-gradient(135deg, 
                        rgba(35, 30, 25, 0.95) 0%, 
                        rgba(45, 38, 30, 0.95) 100%
                    );
                    color: #f4d03f;
                    transform: translateY(-2px);
                    box-shadow: 
                        inset 0 1px 0 rgba(212, 175, 55, 0.25),
                        0 6px 24px rgba(0, 0, 0, 0.8),
                        0 0 30px rgba(212, 175, 55, 0.15);
                }
                
                .menu-btn:disabled {
                    opacity: 0.4;
                    cursor: not-allowed;
                    pointer-events: none;
                }
                
                .vignette {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    box-shadow: inset 0 0 200px rgba(0, 0, 0, 0.9);
                    z-index: 5;
                }
            </style>
            
            <div class="menu-background"></div>
            
            <div class="menu-container">
                <h1 class="menu-logo">
                    THE LAST<br>COVENANT
                </h1>
                
                <div class="menu-buttons">
                    <button class="menu-btn" id="btn-new-game">🎮 Nouvelle Partie</button>
                    <button class="menu-btn" id="btn-continue" disabled>💾 Continuer</button>
                    <button class="menu-btn" id="btn-options" disabled>⚙️ Options</button>
                    <button class="menu-btn" id="btn-quit">🚪 Quitter</button>
                </div>
            </div>
            
            <div class="vignette"></div>
        `;
        
        document.getElementById('game-container').appendChild(this.element);
    }

    onEnter(data) {
        console.log('Main Menu: Active');
        
        this.element.classList.add('active');
        
        // Sons
        if (this.soundManager) {
            this.soundManager.playMusic('menu');
        }
        
        // Vérifier si sauvegarde existe
        const hasSave = this.stateManager.getState().gameStarted;
        const btnContinue = this.element.querySelector('#btn-continue');
        if (hasSave) {
            btnContinue.disabled = false;
        }
        
        // Setup interactions
        this.setupInteractions();
    }

    onExit() {
        this.element.classList.remove('active');
    }

    setupInteractions() {
        const btnNewGame = this.element.querySelector('#btn-new-game');
        const btnContinue = this.element.querySelector('#btn-continue');
        const btnOptions = this.element.querySelector('#btn-options');
        const btnQuit = this.element.querySelector('#btn-quit');
        
        btnNewGame.addEventListener('click', () => {
            if (this.soundManager) this.soundManager.playClick();
            this.startNewGame();
        });
        
        btnContinue.addEventListener('click', () => {
            if (this.soundManager) this.soundManager.playClick();
            this.continueGame();
        });
        
        btnOptions.addEventListener('click', () => {
            if (this.soundManager) this.soundManager.playClick();
            alert('Options - À implémenter');
        });
        
        btnQuit.addEventListener('click', () => {
            if (this.soundManager) this.soundManager.playClick();
            this.quitGame();
        });
    }

    startNewGame() {
        console.log('Starting new game...');
        this.eventBus.emit('scene:change', { to: 'characterCreation' });
    }

    continueGame() {
        console.log('Continue game...');
        this.eventBus.emit('scene:change', { to: 'camp' });
    }

    quitGame() {
        console.log('Quit game...');
        this.eventBus.emit('scene:change', { to: 'title' });
    }
}
