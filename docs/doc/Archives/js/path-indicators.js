// 🧭 SYSTÈME DE NUMÉROTATION ET INDICATEURS DE DIRECTION
// Version corrigée : les indicateurs suivent la caméra

// ═══════════════════════════════════════════════════════════════
// 🔢 DESSINER LES NUMÉROS SUR TOUTES LES CASES
// ═══════════════════════════════════════════════════════════════

function drawPathNumbers(ctx, dungeon, camera) {
  if (!dungeon.path || dungeon.path.length === 0) return;
  
  ctx.save();
  
  // Police gothique
  ctx.font = 'bold 14px Cinzel, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  dungeon.path.forEach((tile, index) => {
    if (!tile) return;
    
    // ✅ IMPORTANT : Utiliser coordonnées DIRECTES (contexte déjà translaté)
    const centerX = tile.x * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2;
    const centerY = tile.y * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2;
    
    // Ne pas dessiner sur entrée/sortie
    if (tile.type === 'entrance' || tile.type === 'exit') {
      return;
    }
    
    // Couleur selon position
    let color;
    if (index === 0) {
      color = '#4CAF50'; // Vert pour case 0
    } else if (index === dungeon.path.length - 1) {
      color = '#FFD700'; // Or pour dernière case
    } else if (index % 10 === 0) {
      color = '#e8dcc4'; // Blanc os pour dizaines
    } else {
      color = '#8b7355'; // Beige pour autres
    }
    
    // Ombre portée pour contraste
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Bordure noire pour meilleure visibilité
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.strokeText(index.toString(), centerX, centerY);
    
    // Texte coloré
    ctx.fillStyle = color;
    ctx.fillText(index.toString(), centerX, centerY);
  });
  
  ctx.restore();
}

// ═══════════════════════════════════════════════════════════════
// ➡️ DESSINER LES INDICATEURS DE DIRECTION
// ═══════════════════════════════════════════════════════════════

function drawDirectionIndicators(ctx, dungeon, camera) {
  if (!dungeon.path || dungeon.path.length < 2) return;
  
  const indicatorInterval = 15; // Tous les 15 cases
  
  ctx.save();
  
  for (let i = indicatorInterval; i < dungeon.path.length - 1; i += indicatorInterval) {
    const currentTile = dungeon.path[i];
    const nextTile = dungeon.path[i + 1];
    
    if (!currentTile || !nextTile) continue;
    
    // ✅ Coordonnées DIRECTES (contexte déjà translaté)
    const centerX = currentTile.x * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2;
    const centerY = currentTile.y * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2;
    
    // Calculer l'angle vers la prochaine case
    const dx = nextTile.x - currentTile.x;
    const dy = nextTile.y - currentTile.y;
    const angle = Math.atan2(dy, dx);
    
    // Dessiner l'indicateur
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    
    // ═══════════════════════════════════════════════════════════
    // CHOISIS TON STYLE D'INDICATEUR ICI :
    // ═══════════════════════════════════════════════════════════
    
    // OPTION 1 : Flèche stylisée (décommenter pour activer)
    drawArrowIndicator(ctx, angle);
    
    // OPTION 2 : Squelette pointant (décommenter pour activer)
    // drawSkeletonPointer(ctx, angle);
    
    // OPTION 3 : Panneau en bois (décommenter pour activer)
    // drawWoodenSign(ctx, angle);
    
    ctx.restore();
  }
  
  ctx.restore();
}

// ═══════════════════════════════════════════════════════════════
// 🎨 STYLES D'INDICATEURS
// ═══════════════════════════════════════════════════════════════

// Style 1 : Flèche médiévale rouillée
function drawArrowIndicator(ctx) {
  // Flèche en fer rouillé
  ctx.fillStyle = '#8b4513'; // Orange rouillé
  ctx.strokeStyle = '#654321';
  ctx.lineWidth = 2;
  
  ctx.beginPath();
  ctx.moveTo(12, 0);
  ctx.lineTo(-6, -8);
  ctx.lineTo(-6, 8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Lueur dorée pour indiquer la direction
  ctx.shadowColor = '#FFD700';
  ctx.shadowBlur = 8;
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.moveTo(10, 0);
  ctx.lineTo(-4, -6);
  ctx.lineTo(-4, 6);
  ctx.closePath();
  ctx.fill();
}

// Style 2 : Squelette pointant
function drawSkeletonPointer(ctx) {
  // Crâne simple
  ctx.fillStyle = '#e8dcc4';
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  
  // Tête
  ctx.beginPath();
  ctx.arc(-8, 0, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  // Bras pointant
  ctx.strokeStyle = '#d4c5a0';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-2, 0);
  ctx.lineTo(12, 0);
  ctx.stroke();
  
  // Flèche rouge sang au bout du doigt
  ctx.fillStyle = '#8B0000';
  ctx.beginPath();
  ctx.moveTo(12, 0);
  ctx.lineTo(8, -3);
  ctx.lineTo(8, 3);
  ctx.closePath();
  ctx.fill();
}

// Style 3 : Panneau en bois médiéval
function drawWoodenSign(ctx) {
  // Poteau
  ctx.fillStyle = '#654321';
  ctx.fillRect(-10, -2, 8, 4);
  
  // Panneau en bois
  ctx.fillStyle = '#8b7355';
  ctx.strokeStyle = '#5d4e37';
  ctx.lineWidth = 2;
  
  ctx.beginPath();
  ctx.moveTo(-2, -8);
  ctx.lineTo(12, -8);
  ctx.lineTo(16, 0);
  ctx.lineTo(12, 8);
  ctx.lineTo(-2, 8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Texture bois
  ctx.strokeStyle = '#5d4e37';
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(0, -6 + i * 5);
    ctx.lineTo(10, -6 + i * 5);
    ctx.stroke();
  }
}

// ═══════════════════════════════════════════════════════════════
// 🚪 MARQUEURS SPÉCIAUX ENTRÉE/SORTIE
// ═══════════════════════════════════════════════════════════════

function drawEntranceIndicator(ctx, entranceTile, camera) {
  if (!entranceTile) return;
  
  ctx.save();
  
  // ✅ Coordonnées DIRECTES
  const centerX = entranceTile.x * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2;
  const centerY = entranceTile.y * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2;
  
  // Texte "ENTRÉE" avec animation pulsante
  const time = Date.now() / 1000;
  const pulse = Math.sin(time * 2) * 0.1 + 1;
  
  ctx.font = `bold ${16 * pulse}px Cinzel, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  
  // Ombre
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 6;
  
  // Bordure noire
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 3;
  ctx.strokeText('ENTRÉE', centerX, centerY - 25);
  
  // Texte vert
  ctx.fillStyle = '#4CAF50';
  ctx.fillText('ENTRÉE', centerX, centerY - 25);
  
  // Flèche vers le bas
  ctx.fillStyle = '#4CAF50';
  ctx.font = '20px Arial';
  ctx.fillText('⬇️', centerX, centerY - 5);
  
  ctx.restore();
}

function drawExitIndicator(ctx, exitTile, camera) {
  if (!exitTile) return;
  
  ctx.save();
  
  // ✅ Coordonnées DIRECTES
  const centerX = exitTile.x * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2;
  const centerY = exitTile.y * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2;
  
  // Texte "SORTIE" avec animation pulsante
  const time = Date.now() / 1000;
  const pulse = Math.sin(time * 3) * 0.15 + 1;
  
  ctx.font = `bold ${18 * pulse}px Cinzel, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  
  // Ombre portée
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 8;
  
  // Bordure noire épaisse
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 4;
  ctx.strokeText('SORTIE', centerX, centerY - 30);
  
  // Texte doré brillant
  const gradient = ctx.createLinearGradient(centerX - 50, 0, centerX + 50, 0);
  gradient.addColorStop(0, '#FFD700');
  gradient.addColorStop(0.5, '#FFA500');
  gradient.addColorStop(1, '#FFD700');
  ctx.fillStyle = gradient;
  ctx.fillText('SORTIE', centerX, centerY - 30);
  
  // Icône porte dorée
  ctx.font = '24px Arial';
  ctx.fillStyle = '#FFD700';
  ctx.shadowBlur = 10;
  ctx.fillText('🚪', centerX, centerY - 5);
  
  ctx.restore();
}

console.log('✅ Système d\'indicateurs chargé (version caméra corrigée)');