/**
 * CombatActionBar - Barre d'actions style BG3
 * - Gauche: Dé 3D tournant
 * - Centre: Sorts & Items
 * - Droite: Fin de tour
 * - Au-dessus: Points d'action (Hearthstone style)
 */

export class CombatActionBar {
    constructor(combat, corruption, canvas, renderer = null, pactSystem = null) {
        this.combat = combat;
        this.corruption = corruption;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.renderer = renderer; // Pour addLog
        this.pactSystem = pactSystem; // Système de pacte
        
        // Configuration
        this.barHeight = 100;
        this.iconSize = 60;
        this.diceSize = 140; // 🎲 DÉ MASSIF (2x plus grand)
        this.diceRotation = 0;
        this.diceRotationSpeed = 0.02;
        this.dicePulse = 0; // Animation de pulsation
        this.eyeBlink = 0; // Clignement des yeux
        
        // État de hover
        this.isHoveringDice = false;
        this.isHoveringEndTurn = false;
        
        // Position des éléments cliquables
        this.clickableAreas = [];
        
        // Actions disponibles
        this.abilities = [
            { id: 'attack', name: 'Attaque', icon: '⚔️', cost: 1, type: 'melee' },
            { id: 'dash', name: 'Sprint', icon: '🏃', cost: 1, type: 'movement' }
        ];
        
        this.items = [
            { id: 'potion', name: 'Potion', icon: '🧪', cost: 1, quantity: 2 },
            { id: 'scroll', name: 'Parchemin', icon: '📜', cost: 1, quantity: 1 }
        ];
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('🎮 CombatActionBar initialisé');
    }
    
    setupEventListeners() {
        // Mouse move pour hover effects
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;
            
            this.updateHoverStates(mx, my);
        });
        
        // Click handler
        this.canvas.addEventListener('click', async (e) => {
            console.log('🎯 EVENT CLICK REÇU sur actionBarCanvas!', e);
            const rect = this.canvas.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;
            console.log('📍 Position calculée:', mx, my);
            
            try {
                await this.handleClick(mx, my);
            } catch (error) {
                console.error('❌ ERREUR dans handleClick:', error);
            }
        });
        
        console.log('✅ Event listeners configurés sur canvas:', this.canvas.id);
    }
    
    updateHoverStates(mx, my) {
        this.isHoveringDice = false;
        this.isHoveringEndTurn = false;
        
        // Check dé
        for (const area of this.clickableAreas) {
            if (area.type === 'dice') {
                const dx = mx - area.x;
                const dy = my - area.y;
                if (dx * dx + dy * dy < area.radius * area.radius) {
                    this.isHoveringDice = true;
                    this.canvas.style.cursor = 'pointer';
                    return;
                }
            }
            
            if (area.type === 'endturn') {
                const dx = mx - area.x;
                const dy = my - area.y;
                if (dx * dx + dy * dy < area.radius * area.radius) {
                    this.isHoveringEndTurn = true;
                    this.canvas.style.cursor = 'pointer';
                    return;
                }
            }
        }
        
        this.canvas.style.cursor = 'default';
    }
    
    async handleClick(mx, my) {
        console.log('🖱️ Clic reçu:', mx, my, 'Areas:', this.clickableAreas.length);
        console.log('📍 Zones cliquables:', this.clickableAreas);
        
        for (const area of this.clickableAreas) {
            if (area.type === 'dice') {
                const dx = mx - area.x;
                const dy = my - area.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                console.log('  🎲 Check dé: mx=' + mx + ', my=' + my);
                console.log('  🎲 Area: x=' + area.x + ', y=' + area.y + ', radius=' + area.radius);
                console.log('  🎲 Distance: dist=' + dist + ', radius=' + area.radius);
                console.log('  🎲 Test: dx²+dy²=' + (dx * dx + dy * dy) + ' < radius²=' + (area.radius * area.radius) + ' ?');
                
                if (dx * dx + dy * dy < area.radius * area.radius) {
                    console.log('🎲 Lance le dé !');
                    
                    // Ouvrir le système de pacte !
                    if (this.pactSystem) {
                        console.log('🩸 PactSystem trouvé, ouverture...');
                        const result = await this.pactSystem.offerPactOnDiceClick();
                        console.log('🩸 Résultat pacte:', result);
                    } else {
                        console.log('⚠️ Pas de pactSystem, fallback sur dé simple');
                        // Fallback : simple lancer de dé
                        const roll = await this.corruption.forceDiceRoll();
                        console.log('🎲 Résultat du dé:', roll);
                        
                        if (this.renderer) {
                            const stage = this.corruption.stages.find(s => 
                                this.corruption.corruption >= s.threshold && 
                                this.corruption.corruption < (s.threshold + 10)
                            );
                            const stageName = stage ? stage.name : 'Le Hasard';
                            
                            this.renderer.addLog('dice', `Dé lancé : ${roll} ! (Corruption: ${this.corruption.corruption.toFixed(1)}%, Stage: ${stageName})`);
                        }
                    }
                    return;
                }
            }
            
            if (area.type === 'endturn') {
                const dx = mx - area.x;
                const dy = my - area.y;
                if (dx * dx + dy * dy < area.radius * area.radius) {
                    console.log('⏭️ Fin du tour');
                    if (this.renderer) {
                        this.renderer.addLog('system', 'Fin du tour');
                    }
                    this.combat.endTurn();
                    return;
                }
            }
        }
    }
    
    render() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, w, h);
        
        // Reset clickable areas
        this.clickableAreas = [];
        
        // ═══════════════════════════════════════════════════════
        // LAYOUT BG3: [THALYS] [ACTION BAR] [END TURN]
        // ═══════════════════════════════════════════════════════
        
        // Constantes layout
        const actionBarWidth = 600;  // Plus étroit comme BG3
        const actionBarHeight = 90;
        const actionBarX = (w - actionBarWidth) / 2;  // Centré
        const actionBarY = h - actionBarHeight - 40; // Plus d'espace pour l'aura
        
        const circleSize = 140; // Taille des cercles (Thalys + EndTurn)
        const circleY = h - circleSize / 2 - 40; // Aligné avec action bar
        
        // Thalys à gauche (indépendant)
        const thalysX = actionBarX - circleSize - 30; // Plus d'espace
        this.renderDice(thalysX + circleSize / 2, circleY);
        this.clickableAreas.push({ 
            type: 'dice', 
            x: thalysX + circleSize / 2, 
            y: circleY, 
            radius: 90 // Inclut l'aura
        });
        
        // Action Bar au centre
        this.renderActionBar(actionBarX, actionBarY, actionBarWidth, actionBarHeight);
        
        // End Turn à droite (indépendant)
        const endTurnX = actionBarX + actionBarWidth + circleSize + 30; // Plus d'espace
        this.renderEndTurnSphere(endTurnX - circleSize / 2, circleY);
        this.clickableAreas.push({ 
            type: 'endturn', 
            x: endTurnX - circleSize / 2, 
            y: circleY, 
            radius: 80 // Augmenté pour faciliter le clic
        });
        
        // Animation dé
        this.diceRotation += this.diceRotationSpeed;
    }
    
    renderActionBar(x, y, w, h) {
        // Fond de la barre
        this.ctx.fillStyle = 'rgba(15, 10, 5, 0.9)';
        this.ctx.strokeStyle = '#4a3d2a';
        this.ctx.lineWidth = 2;
        this.ctx.fillRect(x, y, w, h);
        this.ctx.strokeRect(x, y, w, h);
        
        // Points d'action au-dessus de la barre (plus haut pour éviter la coupure)
        this.renderActionPoints(x + w / 2, y - 50);
        
        // Sorts & Items au centre
        this.renderAbilities(x + 100, y + h / 2);
        this.renderItems(x + w - 200, y + h / 2);
    }
    
    renderEndTurnSphere(x, y) {
        const radius = 70; // Même taille que Thalys
        
        // Demi-sphère 3D avec gradient radial
        const gradient = this.ctx.createRadialGradient(x - 20, y - 20, 10, x, y, radius);
        gradient.addColorStop(0, '#5a4a3a');
        gradient.addColorStop(0.5, '#3a2a1a');
        gradient.addColorStop(1, '#1a0a0a');
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // Bordure dorée
        this.ctx.strokeStyle = '#c9a97a';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // Reflet 3D (highlight)
        const highlight = this.ctx.createRadialGradient(x - 24, y - 24, 0, x - 24, y - 24, 40);
        highlight.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        this.ctx.beginPath();
        this.ctx.arc(x - 24, y - 24, 36, 0, Math.PI * 2);
        this.ctx.fillStyle = highlight;
        this.ctx.fill();
        
        // Texte "FIN DU TOUR"
        this.ctx.save();
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = '#e0d0b0';
        this.ctx.font = 'bold 16px "Cinzel", serif'; // Plus grand
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        this.ctx.shadowBlur = 6;
        this.ctx.fillText('FIN DU', x, y - 10);
        this.ctx.fillText('TOUR', x, y + 10);
        this.ctx.restore();
    }
    
    renderActionPoints(x, y) {
        const maxAP = this.combat.maxActionsPerTurn || 2;
        const currentAP = this.combat.actionsRemaining || 0;
        const size = 35;
        const spacing = 45;
        
        const startX = x - ((maxAP - 1) * spacing) / 2;
        
        for (let i = 0; i < maxAP; i++) {
            const px = startX + i * spacing;
            const isUsed = i >= currentAP;
            
            // Cercle extérieur
            this.ctx.beginPath();
            this.ctx.arc(px, y, size / 2, 0, Math.PI * 2);
            
            if (isUsed) {
                this.ctx.fillStyle = 'rgba(50, 40, 30, 0.5)';
                this.ctx.strokeStyle = 'rgba(100, 80, 60, 0.3)';
            } else {
                this.ctx.fillStyle = 'rgba(201, 169, 122, 0.15)';
                this.ctx.strokeStyle = '#c9a97a';
            }
            
            this.ctx.lineWidth = 2;
            this.ctx.fill();
            this.ctx.stroke();
            
            // Cristal au centre (style Hearthstone)
            this.ctx.beginPath();
            const points = 6;
            for (let j = 0; j < points; j++) {
                const angle = (j / points) * Math.PI * 2 - Math.PI / 2;
                const r = size / 3;
                const vx = px + Math.cos(angle) * r;
                const vy = y + Math.sin(angle) * r;
                
                if (j === 0) this.ctx.moveTo(vx, vy);
                else this.ctx.lineTo(vx, vy);
            }
            this.ctx.closePath();
            
            if (isUsed) {
                this.ctx.fillStyle = 'rgba(80, 70, 60, 0.3)';
            } else {
                this.ctx.fillStyle = '#c9a97a';
            }
            this.ctx.fill();
        }
    }
    
    renderDice(x, y) {
        const size = this.diceSize; // 🔥 DOUBLE TAILLE
        const time = Date.now() / 1000;
        
        // Animation de pulsation hypnotique
        this.dicePulse = Math.sin(time * 3) * 0.1 + 1;
        this.eyeBlink = Math.sin(time * 0.5) > 0.95 ? 0.2 : 1; // Clignement rare
        
        // AURA TRIPLE COUCHE (divine + démoniaque + mystique)
        for (let i = 3; i >= 1; i--) {
            const auraSize = (size / 2 + 30 * i) * this.dicePulse;
            const auraGradient = this.ctx.createRadialGradient(x, y, 0, x, y, auraSize);
            
            if (this.isHoveringDice) {
                // Hover: Rouge sang + Or
                auraGradient.addColorStop(0, `rgba(255, 50, 50, ${0.4 / i})`);
                auraGradient.addColorStop(0.3, `rgba(212, 175, 55, ${0.3 / i})`);
                auraGradient.addColorStop(0.7, `rgba(139, 0, 0, ${0.2 / i})`);
            } else {
                // Normal: Or mystique + Pourpre
                auraGradient.addColorStop(0, `rgba(212, 175, 55, ${0.3 / i})`);
                auraGradient.addColorStop(0.5, `rgba(138, 43, 226, ${0.15 / i})`);
                auraGradient.addColorStop(0.8, `rgba(75, 0, 130, ${0.1 / i})`);
            }
            auraGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, auraSize, 0, Math.PI * 2);
            this.ctx.fillStyle = auraGradient;
            this.ctx.fill();
        }
        
        // PARTICULES FLOTTANTES autour du dé
        for (let i = 0; i < 8; i++) {
            const angle = (time + i) * 0.5;
            const radius = 50 + Math.sin(time * 2 + i) * 10;
            const px = x + Math.cos(angle) * radius;
            const py = y + Math.sin(angle) * radius;
            const particleSize = 2 + Math.sin(time * 3 + i) * 1;
            
            this.ctx.beginPath();
            this.ctx.arc(px, py, particleSize, 0, Math.PI * 2);
            this.ctx.fillStyle = this.isHoveringDice ? 
                'rgba(255, 100, 100, 0.6)' : 
                'rgba(212, 175, 55, 0.5)';
            this.ctx.shadowColor = this.isHoveringDice ? '#ff0000' : '#d4af37';
            this.ctx.shadowBlur = 10;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        }
        
        // CERCLE PRINCIPAL (effet 3D profond)
        this.ctx.beginPath();
        this.ctx.arc(x, y, size / 2 + 8, 0, Math.PI * 2);
        const bgGradient = this.ctx.createRadialGradient(
            x - 20, y - 20, 0, 
            x, y, size / 2 + 8
        );
        bgGradient.addColorStop(0, 'rgba(100, 80, 60, 0.95)');
        bgGradient.addColorStop(0.6, 'rgba(40, 30, 20, 0.98)');
        bgGradient.addColorStop(1, 'rgba(10, 5, 0, 1)');
        this.ctx.fillStyle = bgGradient;
        this.ctx.fill();
        
        // Bordure dorée épaisse
        this.ctx.strokeStyle = this.isHoveringDice ? '#ff6b6b' : '#c9a97a';
        this.ctx.lineWidth = 4;
        this.ctx.shadowColor = this.isHoveringDice ? '#ff0000' : '#d4af37';
        this.ctx.shadowBlur = 15;
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
        
        // 🎲 DÉ 3D MASSIF (plus gros)
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(this.diceRotation);
        
        const dSize = 50; // Plus gros dé
        
        // Face principale du dé (ivoire ancien)
        const faceGradient = this.ctx.createLinearGradient(-dSize/2, -dSize/2, dSize/2, dSize/2);
        faceGradient.addColorStop(0, '#f5f0e8');
        faceGradient.addColorStop(0.5, '#e8dcc8');
        faceGradient.addColorStop(1, '#d4c4a8');
        
        this.ctx.fillStyle = faceGradient;
        this.ctx.fillRect(-dSize/2, -dSize/2, dSize, dSize);
        
        // Bordure du dé
        this.ctx.strokeStyle = '#3d2817';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(-dSize/2, -dSize/2, dSize, dSize);
        
        // Face latérale (effet 3D)
        this.ctx.fillStyle = 'rgba(140, 120, 100, 0.8)';
        this.ctx.beginPath();
        this.ctx.moveTo(dSize/2, -dSize/2);
        this.ctx.lineTo(dSize/2 + 8, -dSize/2 + 8);
        this.ctx.lineTo(dSize/2 + 8, dSize/2 + 8);
        this.ctx.lineTo(dSize/2, dSize/2);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // Face dessus (effet 3D)
        this.ctx.fillStyle = 'rgba(160, 140, 120, 0.9)';
        this.ctx.beginPath();
        this.ctx.moveTo(-dSize/2, -dSize/2);
        this.ctx.lineTo(-dSize/2 + 8, -dSize/2 - 8);
        this.ctx.lineTo(dSize/2 + 8, -dSize/2 - 8);
        this.ctx.lineTo(dSize/2, -dSize/2);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // 👁️ YEUX DE THALYS (VIVANTS - qui clignent)
        const eyeOffsetX = 12;
        const eyeOffsetY = -6;
        const eyeSize = 8; // 👁️ YEUX PLUS GROS
        const pupilSize = 4;
        
        // Oeil gauche
        this.renderDiceEye(-eyeOffsetX, eyeOffsetY, eyeSize, pupilSize, time);
        
        // Oeil droit
        this.renderDiceEye(eyeOffsetX, eyeOffsetY, eyeSize, pupilSize, time + 0.5);
        
        // Numéro du dé (sous les yeux)
        this.ctx.fillStyle = '#3d2817';
        this.ctx.font = 'bold 22px "Cinzel"';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('6', 0, 12);
        
        this.ctx.restore();
        
        // ✨ GLOW LUMINEUX HYPNOTIQUE (toujours visible)
        const glowIntensity = 0.5 + Math.sin(time * 3) * 0.4;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size / 2 + 15, 0, Math.PI * 2);
        this.ctx.strokeStyle = this.isHoveringDice ?
            `rgba(255, 50, 50, ${glowIntensity})` :
            `rgba(212, 175, 55, ${glowIntensity})`;
        this.ctx.lineWidth = 4;
        this.ctx.shadowColor = this.isHoveringDice ? '#ff0000' : '#d4af37';
        this.ctx.shadowBlur = 20;
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
        
        // Texte tentateur sous le dé
        if (this.isHoveringDice) {
            this.ctx.save();
            this.ctx.font = 'italic 11px "Crimson Text"';
            this.ctx.fillStyle = `rgba(255, 100, 100, ${Math.sin(time * 5) * 0.3 + 0.7})`;
            this.ctx.textAlign = 'center';
            this.ctx.shadowColor = '#ff0000';
            this.ctx.shadowBlur = 8;
            this.ctx.fillText('Clique-moi...', x, y + size / 2 + 25);
            this.ctx.restore();
        }
    }
    
    renderDiceEye(x, y, eyeSize, pupilSize, time) {
        // Clignement
        const blinkAmount = this.eyeBlink;
        const eyeHeight = eyeSize * blinkAmount;
        
        // Blanc de l'œil avec glow
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, eyeSize, eyeHeight, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fill();
        this.ctx.strokeStyle = '#3d2817';
        this.ctx.lineWidth = 1.2;
        this.ctx.stroke();
        
        if (blinkAmount > 0.3) { // Seulement si pas fermé
            // Pupille vivante qui bouge (regarde autour)
            const pupilX = x + Math.sin(time * 1.5) * 2;
            const pupilY = y + Math.cos(time * 2) * 1.5;
            
            // Iris avec gradient
            const irisGradient = this.ctx.createRadialGradient(
                pupilX, pupilY, 0, 
                pupilX, pupilY, pupilSize + 1
            );
            irisGradient.addColorStop(0, '#ff4500'); // Rouge-orangé
            irisGradient.addColorStop(0.6, '#8b0000'); // Rouge sang
            irisGradient.addColorStop(1, '#4b0000'); // Rouge très foncé
            
            this.ctx.beginPath();
            this.ctx.arc(pupilX, pupilY, pupilSize + 1, 0, Math.PI * 2);
            this.ctx.fillStyle = irisGradient;
            this.ctx.fill();
            
            // Pupille noire centrale
            this.ctx.beginPath();
            this.ctx.arc(pupilX, pupilY, pupilSize * 0.4, 0, Math.PI * 2);
            this.ctx.fillStyle = '#000000';
            this.ctx.fill();
            
            // ✨ GLOW ÉMISSIF sur la pupille
            this.ctx.shadowColor = this.isHoveringDice ? '#ff0000' : '#d4af37';
            this.ctx.shadowBlur = this.isHoveringDice ? 12 : 6;
            this.ctx.beginPath();
            this.ctx.arc(pupilX, pupilY, pupilSize * 0.3, 0, Math.PI * 2);
            this.ctx.fillStyle = this.isHoveringDice ? '#ff6666' : '#ffcc66';
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        
        // Reflet lumineux dans la pupille
        this.ctx.beginPath();
        this.ctx.arc(pupilX - 0.8, pupilY - 0.8, 0.8, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(255, 100, 100, 0.8)';
        this.ctx.fill();
        
        // Glow émissif autour de l'œil
        this.ctx.save();
        this.ctx.shadowColor = '#d4af37';
        this.ctx.shadowBlur = 8;
        this.ctx.beginPath();
        this.ctx.arc(x, y, eyeSize + 1, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.restore();
        }
    }
    
    renderAbilities(startX, y) {
        this.abilities.forEach((ability, i) => {
            const x = startX + i * (this.iconSize + 10);
            this.renderActionSlot(x, y, ability, ability.cost);
        });
    }
    
    renderItems(startX, y) {
        this.items.forEach((item, i) => {
            const x = startX + i * (this.iconSize + 10);
            this.renderActionSlot(x, y, item, item.cost, item.quantity);
        });
    }
    
    renderActionSlot(x, y, data, cost, quantity = null) {
        const size = this.iconSize;
        const canUse = this.combat.actionsRemaining >= cost;
        
        // Fond slot
        this.ctx.fillStyle = canUse ? 'rgba(40, 35, 28, 0.9)' : 'rgba(30, 25, 20, 0.5)';
        this.ctx.strokeStyle = canUse ? '#4a3d2a' : 'rgba(60, 50, 40, 0.4)';
        this.ctx.lineWidth = 2;
        
        this.ctx.fillRect(x - size/2, y - size/2, size, size);
        this.ctx.strokeRect(x - size/2, y - size/2, size, size);
        
        // Grayscale si pas assez d'AP
        if (!canUse) {
            this.ctx.save();
            this.ctx.globalAlpha = 0.4;
        }
        
        // Icône
        this.ctx.font = '28px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = '#d4c5b0';
        this.ctx.fillText(data.icon, x, y);
        
        // Quantité
        if (quantity !== null) {
            this.ctx.font = 'bold 12px Crimson Text';
            this.ctx.fillStyle = '#c9a97a';
            this.ctx.fillText(`x${quantity}`, x + size/2 - 8, y + size/2 - 8);
        }
        
        // Coût AP
        this.ctx.font = 'bold 10px Crimson Text';
        this.ctx.fillStyle = '#8a7755';
        this.ctx.fillText(`${cost} AP`, x, y + size/2 + 12);
        
        if (!canUse) {
            this.ctx.restore();
        }
    }
    
    renderEndTurn(x, y) {
        const size = this.iconSize;
        
        // Cercle fond
        this.ctx.beginPath();
        this.ctx.arc(x, y, size / 2 + 5, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(60, 45, 30, 0.8)';
        this.ctx.strokeStyle = '#8a7755';
        this.ctx.lineWidth = 2;
        this.ctx.fill();
        this.ctx.stroke();
        
        // Icône horloge
        this.ctx.font = '32px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = '#d4c5b0';
        this.ctx.fillText('⏭️', x, y);
        
        // Hover
        if (this.isHoveringEndTurn) {
            this.ctx.beginPath();
            this.ctx.arc(x, y, size / 2 + 8, 0, Math.PI * 2);
            this.ctx.strokeStyle = '#c9a97a';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
        
        // Label
        this.ctx.font = 'bold 11px Cinzel';
        this.ctx.fillStyle = '#8a7755';
        this.ctx.fillText('FIN DU TOUR', x, y + size/2 + 18);
    }
    
    renderTooltip(x, y, text) {
        this.ctx.font = '12px Crimson Text';
        const metrics = this.ctx.measureText(text);
        const padding = 8;
        const width = metrics.width + padding * 2;
        const height = 20;
        
        // Fond
        this.ctx.fillStyle = 'rgba(10, 8, 5, 0.95)';
        this.ctx.fillRect(x - width/2, y - height, width, height);
        
        // Bordure
        this.ctx.strokeStyle = '#4a3d2a';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x - width/2, y - height, width, height);
        
        // Texte
        this.ctx.fillStyle = '#d4c5b0';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, x, y - height/2);
    }
}
