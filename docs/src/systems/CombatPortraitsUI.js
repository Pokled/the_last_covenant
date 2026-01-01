/**
 * ═══════════════════════════════════════════════════════════════
 * COMBAT PORTRAITS UI - Style Baldur's Gate 3
 * ═══════════════════════════════════════════════════════════════
 * Affiche portraits des combattants en haut de l'écran avec :
 * - Joueur + Ennemis
 * - HP bars sous chaque portrait
 * - Zoom sur l'entité active
 * - Grayscale si mort
 * - Icône CaC / Distance
 */

export class CombatPortraitsUI {
    constructor(combat, playerStats) {
        this.combat = combat;
        this.playerStats = playerStats;
        
        this.container = null;
        this.portraits = new Map(); // entity_id -> DOM element
        
        this.init();
    }
    
    /**
     * Initialise l'UI
     */
    init() {
        console.log('🖼️ CombatPortraitsUI initialisé');
        
        // Créer conteneur
        this.container = document.createElement('div');
        this.container.id = 'combat-portraits';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
            display: flex;
            gap: 15px;
            align-items: flex-start;
            pointer-events: none;
        `;
        document.body.appendChild(this.container);
        
        // Styles CSS
        this.injectStyles();
        
        // Events
        this.setupEventListeners();
    }
    
    /**
     * Inject styles globaux
     */
    injectStyles() {
        if (document.getElementById('combat-portraits-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'combat-portraits-styles';
        styles.textContent = `
            .portrait-card {
                position: relative;
                width: 80px;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));
            }
            
            .portrait-card.active {
                transform: scale(1.15) translateY(-5px);
                filter: drop-shadow(0 0 20px rgba(201, 169, 122, 0.8));
            }
            
            .portrait-card.dead {
                filter: grayscale(1) brightness(0.4) drop-shadow(0 2px 4px rgba(0,0,0,0.8));
                opacity: 0.5;
            }
            
            .portrait-frame {
                position: relative;
                width: 80px;
                height: 80px;
                border-radius: 8px;
                border: 3px solid rgba(90, 77, 58, 0.8);
                overflow: hidden;
                background: linear-gradient(135deg, rgba(40,35,30,0.95), rgba(20,18,15,0.98));
            }
            
            .portrait-card.active .portrait-frame {
                border-color: rgba(201, 169, 122, 1);
                box-shadow: 0 0 15px rgba(201, 169, 122, 0.6);
            }
            
            .portrait-card.player .portrait-frame {
                border-color: rgba(74, 158, 255, 0.8);
            }
            
            .portrait-card.player.active .portrait-frame {
                border-color: rgba(74, 158, 255, 1);
                box-shadow: 0 0 15px rgba(74, 158, 255, 0.6);
            }
            
            .portrait-card.enemy .portrait-frame {
                border-color: rgba(209, 67, 67, 0.8);
            }
            
            .portrait-card.enemy.active .portrait-frame {
                border-color: rgba(209, 67, 67, 1);
                box-shadow: 0 0 15px rgba(209, 67, 67, 0.6);
            }
            
            .portrait-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                background: radial-gradient(circle at 30% 30%, rgba(60,50,40,0.3), rgba(20,18,15,0.9));
            }
            
            .portrait-icon {
                position: absolute;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 36px;
                color: rgba(201, 169, 122, 0.3);
                text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            }
            
            .portrait-hp {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 12px;
                background: rgba(20,18,15,0.9);
                border-top: 1px solid rgba(90,77,58,0.5);
            }
            
            .portrait-hp-bar {
                height: 100%;
                background: linear-gradient(90deg, #8b0000, #d14343);
                transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
            }
            
            .portrait-card.player .portrait-hp-bar {
                background: linear-gradient(90deg, #2a5aa0, #4a9eff);
            }
            
            .portrait-hp-bar::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(90deg, 
                    transparent 0%, 
                    rgba(255,255,255,0.2) 50%, 
                    transparent 100%
                );
                animation: shimmer 2s infinite;
            }
            
            @keyframes shimmer {
                0%, 100% { transform: translateX(-100%); }
                50% { transform: translateX(100%); }
            }
            
            .portrait-name {
                position: absolute;
                bottom: -25px;
                left: 50%;
                transform: translateX(-50%);
                font-family: 'Crimson Text', serif;
                font-size: 13px;
                color: rgba(201, 169, 122, 0.9);
                text-shadow: 1px 1px 3px rgba(0,0,0,0.9);
                white-space: nowrap;
                font-weight: 600;
            }
            
            .portrait-combat-type {
                position: absolute;
                top: -8px;
                right: -8px;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                background: rgba(20,18,15,0.95);
                border: 2px solid rgba(201, 169, 122, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.6);
            }
            
            .portrait-death-mark {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 48px;
                opacity: 0.8;
                text-shadow: 2px 2px 6px rgba(0,0,0,0.9);
                animation: pulse-death 2s infinite;
            }
            
            @keyframes pulse-death {
                0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
                50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.9; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        window.addEventListener('combat:combatStart', (e) => this.onCombatStart(e.detail));
        window.addEventListener('combat:playerTurnStart', () => this.setActiveEntity('player'));
        window.addEventListener('combat:enemyTurnStart', (e) => this.setActiveEntity(e.detail?.enemyId));
        window.addEventListener('combat:enemyDamaged', (e) => this.updateEnemyHP(e.detail));
        window.addEventListener('combat:playerDamaged', () => this.updatePlayerHP());
        window.addEventListener('combat:combatEnd', () => this.onCombatEnd());
    }
    
    /**
     * Combat démarre
     */
    onCombatStart(detail) {
        this.container.innerHTML = '';
        this.portraits.clear();
        
        // Créer portrait joueur
        this.createPlayerPortrait();
        
        // Créer portraits ennemis
        detail.enemies.forEach((enemy, index) => {
            this.createEnemyPortrait(enemy, index);
        });
        
        // Activer joueur par défaut
        this.setActiveEntity('player');
    }
    
    /**
     * Créer portrait joueur
     */
    createPlayerPortrait() {
        const stats = this.playerStats.getStats();
        
        const card = document.createElement('div');
        card.className = 'portrait-card player';
        card.dataset.entityId = 'player';
        
        card.innerHTML = `
            <div class="portrait-frame">
                <div class="portrait-icon">⚔️</div>
                <div class="portrait-hp">
                    <div class="portrait-hp-bar" style="width: 100%"></div>
                </div>
            </div>
            <div class="portrait-name">Vous</div>
            <div class="portrait-combat-type" title="Combat au corps-à-corps">⚔️</div>
        `;
        
        this.container.appendChild(card);
        this.portraits.set('player', card);
    }
    
    /**
     * Créer portrait ennemi
     */
    createEnemyPortrait(enemy, index) {
        const card = document.createElement('div');
        card.className = 'portrait-card enemy';
        card.dataset.entityId = `enemy_${index}`;
        
        // Icône selon type
        const icon = this.getEnemyIcon(enemy.name);
        const combatType = enemy.ranged ? '🏹' : '⚔️';
        const combatTypeTitle = enemy.ranged ? 'Combat à distance' : 'Corps-à-corps';
        
        card.innerHTML = `
            <div class="portrait-frame">
                <div class="portrait-icon">${icon}</div>
                <div class="portrait-hp">
                    <div class="portrait-hp-bar" style="width: 100%"></div>
                </div>
            </div>
            <div class="portrait-name">${enemy.name}</div>
            <div class="portrait-combat-type" title="${combatTypeTitle}">${combatType}</div>
        `;
        
        this.container.appendChild(card);
        this.portraits.set(`enemy_${index}`, card);
    }
    
    /**
     * Icône selon nom ennemi
     */
    getEnemyIcon(name) {
        if (name.includes('Garde')) return '🛡️';
        if (name.includes('Loup')) return '🐺';
        if (name.includes('Ombre')) return '👻';
        if (name.includes('Mage')) return '🔮';
        if (name.includes('Archer')) return '🏹';
        return '💀';
    }
    
    /**
     * Marquer entité active
     */
    setActiveEntity(entityId) {
        // Retirer tous les "active"
        this.portraits.forEach(card => card.classList.remove('active'));
        
        // Ajouter "active"
        if (entityId) {
            const card = this.portraits.get(entityId);
            if (card) {
                card.classList.add('active');
            }
        }
    }
    
    /**
     * Update HP joueur
     */
    updatePlayerHP() {
        const card = this.portraits.get('player');
        if (!card) return;
        
        const stats = this.playerStats.getStats();
        const hpPercent = Math.max(0, (stats.HP / stats.maxHP) * 100);
        
        const bar = card.querySelector('.portrait-hp-bar');
        bar.style.width = `${hpPercent}%`;
        
        // Mort ?
        if (stats.HP <= 0) {
            card.classList.add('dead');
            if (!card.querySelector('.portrait-death-mark')) {
                const mark = document.createElement('div');
                mark.className = 'portrait-death-mark';
                mark.textContent = '💀';
                card.querySelector('.portrait-frame').appendChild(mark);
            }
        }
    }
    
    /**
     * Update HP ennemi
     */
    updateEnemyHP(detail) {
        const card = this.portraits.get(`enemy_${detail.enemyIndex}`);
        if (!card) return;
        
        const hpPercent = Math.max(0, (detail.newHP / detail.maxHP) * 100);
        
        const bar = card.querySelector('.portrait-hp-bar');
        bar.style.width = `${hpPercent}%`;
        
        // Mort ?
        if (detail.newHP <= 0) {
            card.classList.add('dead');
            if (!card.querySelector('.portrait-death-mark')) {
                const mark = document.createElement('div');
                mark.className = 'portrait-death-mark';
                mark.textContent = '💀';
                card.querySelector('.portrait-frame').appendChild(mark);
            }
        }
    }
    
    /**
     * Combat terminé
     */
    onCombatEnd() {
        // Retirer tous les actifs
        this.portraits.forEach(card => card.classList.remove('active'));
    }
    
    /**
     * Cleanup
     */
    destroy() {
        if (this.container) {
            this.container.remove();
        }
    }
}
