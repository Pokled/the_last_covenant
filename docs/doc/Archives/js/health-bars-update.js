// 🏥 SYSTÈME DE MISE À JOUR DES BARRES HP/XP
// Version animée avec effets visuels

function updateHealthBars(player) {
  if (!player) return;
  
  // ═══════════════════════════════════════════════════════════
  // 🩸 BARRE HP
  // ═══════════════════════════════════════════════════════════
  
  const hpBar = document.getElementById('heroHPBar');
  const hpText = document.getElementById('heroHP');
  
  if (hpBar && hpText) {
    const hpPercent = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
    
    // Animer la largeur de la barre
    hpBar.style.width = hpPercent + '%';
    
    // Mettre à jour le texte
    hpText.textContent = `${player.hp}/${player.maxHp}`;
    
    // Effet pulsation si HP critique (< 30%)
    if (hpPercent < 30) {
      hpBar.classList.add('critical');
    } else {
      hpBar.classList.remove('critical');
    }
    
    // Effet de dégâts (flash rouge)
    const currentHp = parseInt(hpBar.dataset.currentHp || player.hp);
    if (player.hp < currentHp) {
      // Dégâts reçus
      hpBar.classList.add('damage-flash');
      setTimeout(() => hpBar.classList.remove('damage-flash'), 500);
    } else if (player.hp > currentHp) {
      // Soins reçus
      hpBar.classList.add('heal-flash');
      setTimeout(() => hpBar.classList.remove('heal-flash'), 500);
    }
    
    hpBar.dataset.currentHp = player.hp;
  }
  
  // ═══════════════════════════════════════════════════════════
  // ⭐ BARRE XP
  // ═══════════════════════════════════════════════════════════
  
  const xpBar = document.getElementById('heroXPBar');
  const xpText = document.getElementById('heroXP');
  
  if (xpBar && xpText) {
    // Calculer l'XP nécessaire pour le prochain niveau
    const xpForNextLevel = typeof ProgressionSystem !== 'undefined' && ProgressionSystem.getXPForLevel
      ? ProgressionSystem.getXPForLevel(player.level + 1)
      : 100 * player.level;
    
    const xpForCurrentLevel = typeof ProgressionSystem !== 'undefined' && ProgressionSystem.getXPForLevel
      ? ProgressionSystem.getXPForLevel(player.level)
      : 100 * (player.level - 1);
    
    const xpInCurrentLevel = player.xp - xpForCurrentLevel;
    const xpNeededInLevel = xpForNextLevel - xpForCurrentLevel;
    
    const xpPercent = Math.max(0, Math.min(100, (xpInCurrentLevel / xpNeededInLevel) * 100));
    
    // Animer la largeur de la barre
    xpBar.style.width = xpPercent + '%';
    
    // Mettre à jour le texte
    xpText.textContent = `${xpInCurrentLevel}/${xpNeededInLevel}`;
    
    // Effet de gain d'XP (flash doré)
    const currentXp = parseInt(xpBar.dataset.currentXp || player.xp);
    if (player.xp > currentXp) {
      xpBar.classList.add('xp-gain-flash');
      setTimeout(() => xpBar.classList.remove('xp-gain-flash'), 500);
    }
    
    xpBar.dataset.currentXp = player.xp;
    
    // Effet spécial si proche du level-up (> 90%)
    if (xpPercent > 90) {
      xpBar.classList.add('near-levelup');
    } else {
      xpBar.classList.remove('near-levelup');
    }
  }
  
  // ═══════════════════════════════════════════════════════════
  // 🎊 EFFET LEVEL-UP
  // ═══════════════════════════════════════════════════════════
  
  const currentLevel = parseInt(hpBar?.dataset?.currentLevel || player.level);
  if (player.level > currentLevel) {
    // Level-up !
    showLevelUpEffect();
    
    if (hpBar) hpBar.dataset.currentLevel = player.level;
    
    // Son de level-up (si disponible)
    if (typeof AUDIO !== 'undefined' && AUDIO.playLevelUp) {
      AUDIO.playLevelUp();
    }
  }
}

// ═══════════════════════════════════════════════════════════
// 🎊 EFFET VISUEL LEVEL-UP
// ═══════════════════════════════════════════════════════════

function showLevelUpEffect() {
  // Créer une notification de level-up
  const levelUpNotif = document.createElement('div');
  levelUpNotif.className = 'levelup-notification';
  levelUpNotif.innerHTML = `
    <div class="levelup-icon">🌟</div>
    <div class="levelup-text">
      <div class="levelup-title">LEVEL UP !</div>
      <div class="levelup-subtitle">Nouveau niveau atteint</div>
    </div>
  `;
  
  document.body.appendChild(levelUpNotif);
  
  // Animation d'apparition
  setTimeout(() => levelUpNotif.classList.add('show'), 100);
  
  // Suppression après 3 secondes
  setTimeout(() => {
    levelUpNotif.classList.remove('show');
    setTimeout(() => levelUpNotif.remove(), 500);
  }, 3000);
  
  // Effet de particules dorées (optionnel)
  createLevelUpParticles();
}

// ═══════════════════════════════════════════════════════════
// ✨ PARTICULES DORÉES LEVEL-UP
// ═══════════════════════════════════════════════════════════

function createLevelUpParticles() {
  const heroPanel = document.getElementById('currentPlayerInfo');
  if (!heroPanel) return;
  
  // Créer 20 particules
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'levelup-particle';
    particle.style.left = (Math.random() * 100) + '%';
    particle.style.animationDelay = (Math.random() * 0.5) + 's';
    
    heroPanel.appendChild(particle);
    
    // Suppression après l'animation
    setTimeout(() => particle.remove(), 2000);
  }
}

console.log('🏥 Système de barres HP/XP chargé');