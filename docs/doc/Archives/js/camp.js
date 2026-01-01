/**
 * ═══════════════════════════════════════════════════════
 * CAMP SYSTEM - THE LAST COVENANT
 * Hub inter-partie évolutif avec zones cliquables
 * Village Nomade qui suit le Pactisé à travers les Abysses
 * ═══════════════════════════════════════════════════════
 */

class CampSystem {
  constructor() {
    this.initialized = false;
    this.zones = new Map(); // Zones cliquables du village
    this.npcs = new Map(); // PNJ recrutés depuis cages
    this.companions = []; // Compagnons combattants actifs (max 3)
    this.upgrades = new Set(); // Upgrades achetés
    this.currentView = 'overview'; // Vue actuelle

    // Données village
    this.villageLevel = 1; // 1-10, évolue avec runs
    this.corruptionInfluence = 0; // Corruption accumulée village (0-100)
    this.morale = 100; // Moral villageois (0-100)

    // Références DOM
    this.overlay = null;
    this.canvas = null;
    this.ctx = null;

    console.log('🏕️ Camp System créé');
  }

  /**
   * Initialise le village avec données joueur
   */
  init(player) {
    if (this.initialized) {
      console.log('⚠️ Camp déjà initialisé');
      return;
    }

    if (!player) {
      console.error('❌ Camp.init() : player manquant');
      return;
    }

    // Récupérer campData existant (créé par EconomySystem)
    if (window.EconomySystem) {
      EconomySystem.initCampData(player);
    }

    // Sync corruption village avec joueur
    this.corruptionInfluence = player.corruption || 0;

    // Charger PNJ sauvés précédemment
    if (player.campData && player.campData.savedNPCs) {
      this.loadNPCs(player.campData.savedNPCs);
    }

    // Charger compagnons
    if (player.campData && player.campData.companions) {
      this.loadCompanions(player.campData.companions);
    }

    // Charger upgrades
    if (player.campData && player.campData.upgrades) {
      this.upgrades = new Set(player.campData.upgrades);
    }

    // Charger niveau village & morale
    if (player.campData) {
      this.villageLevel = player.campData.villageLevel || 1;
      this.morale = player.campData.morale || 100;
    }

    // Créer zones cliquables
    this.initZones();

    this.initialized = true;
    console.log('✅ Camp System initialisé');
  }

  /**
   * Initialise les zones cliquables du village
   */
  initZones() {
    // Zone 1: Hub Central (Overview)
    this.zones.set('hub', {
      id: 'hub',
      name: 'Place Centrale',
      icon: '🏕️',
      description: 'Le cœur du cortège nomade',
      unlocked: true,
      onClick: () => this.showOverview()
    });

    // Zone 2: Forge/Boutique
    this.zones.set('forge', {
      id: 'forge',
      name: 'Forge du Destin',
      icon: '⚒️',
      description: 'Améliore armes, forge items, fusionne dés',
      unlocked: true,
      npc: this.npcs.get('drenvar') || this.npcs.get('thorne') || null,
      onClick: () => this.showForge()
    });

    // Zone 3: Autel Corruption/Purification
    this.zones.set('altar', {
      id: 'altar',
      name: 'Autel des Dieux Morts',
      icon: '⚱️',
      description: 'Purifie ou embrasse la corruption',
      unlocked: true,
      onClick: () => this.showAltar()
    });

    // Zone 4: Marché (économie fluctuante)
    this.zones.set('market', {
      id: 'market',
      name: 'Marché Nomade',
      icon: '🛒',
      description: 'Achète/vends items, taux fluctuants',
      unlocked: true,
      npc: null,
      onClick: () => this.showMarket()
    });

    // Zone 5: Camp Repos/Recrutement
    this.zones.set('recruitment', {
      id: 'recruitment',
      name: 'Campement des Exilés',
      icon: '🔥',
      description: 'Recrute compagnons, gère équipe',
      unlocked: true,
      onClick: () => this.showRecruitment()
    });

    // Zone 6: Bibliothèque Lore (déblocable)
    this.zones.set('library', {
      id: 'library',
      name: 'Archives du Vide',
      icon: '📜',
      description: 'Consulte lore, prophéties, codex',
      unlocked: this.upgrades.has('library_unlock'),
      onClick: () => this.showLibrary()
    });

    console.log(`🗺️ ${this.zones.size} zones initialisées`);
  }

  /**
   * Affiche le camp (point d'entrée principal)
   */
  show(player) {
    if (!this.initialized) {
      this.init(player);
    }

    // Update corruption village
    this.corruptionInfluence = player.corruption || 0;

    // Trigger événements aléatoires village
    this.checkVillageEvents(player);

    // Afficher overview
    this.showOverview();

    // Son ambiance
    this.playAmbientSound();
  }

  /**
   * Affiche la vue d'ensemble du village
   */
  showOverview() {
    this.currentView = 'overview';

    // Créer modal overlay si n'existe pas
    if (!this.overlay || !document.body.contains(this.overlay)) {
      this.overlay = this.createCampOverlay();
      document.body.appendChild(this.overlay);
    }

    // Render village map cliquable
    this.renderVillageMap();

    // Stats village en header
    this.renderVillageStats();

    // Footer navigation
    this.renderFooterNavigation();

    console.log('🏕️ Overview affiché');
  }

  /**
   * Crée l'overlay de base du camp
   */
  createCampOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'camp-modal-overlay';
    overlay.id = 'campModal';

    // Appliquer classe corruption si >50%
    const corruptedClass = this.corruptionInfluence > 50 ? ' corrupted' : '';

    overlay.innerHTML = `
      <div class="camp-modal${corruptedClass}">
        <!-- Bouton fermer -->
        <div class="camp-close-btn" id="campCloseBtn">×</div>

        <!-- Particules ambiance -->
        <div class="camp-particles" id="campParticles"></div>

        <!-- Header : Stats village -->
        <div class="camp-header" id="campHeader"></div>

        <!-- Content : Vue actuelle -->
        <div class="camp-content" id="campContent"></div>

        <!-- Footer : Navigation zones -->
        <div class="camp-footer" id="campFooter"></div>
      </div>
    `;

    // Event bouton fermer
    setTimeout(() => {
      const closeBtn = document.getElementById('campCloseBtn');
      if (closeBtn) {
        closeBtn.onclick = () => this.close();
      }
    }, 100);

    // Ajouter particules
    setTimeout(() => {
      const particlesContainer = document.getElementById('campParticles');
      if (particlesContainer) {
        this.createCampParticles(particlesContainer);
      }
    }, 100);

    return overlay;
  }

  /**
   * Crée particules ambiance selon corruption
   */
  createCampParticles(container) {
    const particleCount = 30;
    const colors = this.corruptionInfluence > 50
      ? ['#4b0082', '#8b0000', '#2f0047'] // Violet/rouge si corrompu
      : ['rgba(255,255,255,0.6)', '#d4af37', '#ff6b35']; // Blanc/or si pur

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      particle.style.animationDuration = `${4 + Math.random() * 3}s`;
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.width = `${2 + Math.random() * 4}px`;
      particle.style.height = particle.style.width;
      container.appendChild(particle);
    }
  }

  /**
   * Render stats village dans header
   */
  renderVillageStats() {
    const header = document.getElementById('campHeader');
    if (!header) return;

    const player = window.GameState?.players?.[0] || { corruption: 0 };
    const gold = window.EconomySystem ? EconomySystem.getGold(player) : 0;
    const rubies = window.EconomySystem ? EconomySystem.getRubies(player) : 0;

    const titleText = this.corruptionInfluence < 25 ? 'Village Nomade - Oasis de l\'Avant' :
                      this.corruptionInfluence < 50 ? 'Village Nomade - Terre Hybride' :
                      this.corruptionInfluence < 75 ? 'Village Corrompu - Chaos Rampant' :
                      'Forteresse Vivante - Domaine Abyssal';

    header.innerHTML = `
      <div>
        <h2>${titleText}</h2>
        <p style="margin: 5px 0 0 0; font-size: 14px; color: #aaa;">
          Niveau ${this.villageLevel} • ${this.npcs.size} Exilés • ${this.companions.length}/3 Compagnons
        </p>
      </div>
      <div class="camp-stats">
        <div class="camp-stat">
          <span class="camp-stat-icon">💰</span>
          <span>${gold} Or</span>
        </div>
        <div class="camp-stat">
          <span class="camp-stat-icon">💎</span>
          <span>${rubies} Rubis</span>
        </div>
        <div class="camp-stat">
          <span class="camp-stat-icon">💀</span>
          <span>${Math.floor(this.corruptionInfluence)}% Corruption</span>
        </div>
        <div class="camp-stat">
          <span class="camp-stat-icon">${this.morale > 70 ? '😊' : this.morale > 40 ? '😐' : '😨'}</span>
          <span>${Math.floor(this.morale)}% Moral</span>
        </div>
      </div>
    `;
  }

  /**
   * Render carte village cliquable (Canvas)
   */
  renderVillageMap() {
    const content = document.getElementById('campContent');
    if (!content) return;

    // Clear content
    content.innerHTML = '';

    // Canvas pour render village
    const canvas = document.createElement('canvas');
    canvas.id = 'campCanvas';
    canvas.className = 'camp-canvas';
    content.appendChild(canvas);

    // Resize canvas
    canvas.width = content.clientWidth || 1200;
    canvas.height = content.clientHeight || 600;

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Dessiner zones
    this.renderVillageTents();

    // Rendre cliquable
    canvas.onclick = (e) => this.handleCanvasClick(e);

    // Hover effect
    canvas.onmousemove = (e) => this.handleCanvasHover(e);
  }

  /**
   * Dessine les tentes/zones sur canvas
   */
  renderVillageTents() {
    if (!this.ctx) return;

    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Background : Brouillard + cendres
    const bgColor = this.corruptionInfluence > 50 ? '#1a0d0d' : '#2a2a2a';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Gradient vignette
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.7)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Positions tentes (layout circulaire autour feu central)
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.3;

    const zoneArray = Array.from(this.zones.values()).filter(z => z.unlocked);
    const angleStep = (2 * Math.PI) / zoneArray.length;

    zoneArray.forEach((zone, i) => {
      const angle = i * angleStep - Math.PI / 2; // Commence en haut
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      // Dessiner tente
      this.drawTent(ctx, x, y, zone);

      // Stocker hitbox pour clics
      zone.hitbox = { x: x - 60, y: y - 60, width: 120, height: 120 };
    });

    // Feu central (hub)
    this.drawCampfire(ctx, centerX, centerY);
  }

  /**
   * Dessine une tente (style corruption-dependent)
   */
  drawTent(ctx, x, y, zone) {
    const isPure = this.corruptionInfluence < 50;
    const tentColor = isPure ? '#8B7355' : '#4a1a1a';
    const glowColor = isPure ? '#ffd700' : '#8b0000';

    ctx.save();
    ctx.translate(x, y);

    // Shadow/glow
    ctx.shadowBlur = 20;
    ctx.shadowColor = glowColor;

    // Triangle tente
    ctx.fillStyle = tentColor;
    ctx.beginPath();
    ctx.moveTo(0, -50);
    ctx.lineTo(-40, 30);
    ctx.lineTo(40, 30);
    ctx.closePath();
    ctx.fill();

    // Contour
    ctx.strokeStyle = glowColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Icône zone
    ctx.shadowBlur = 0;
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(zone.icon, 0, 0);

    // Nom zone
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.strokeText(zone.name, 0, 50);
    ctx.fillText(zone.name, 0, 50);

    ctx.restore();
  }

  /**
   * Dessine feu de camp central
   */
  drawCampfire(ctx, x, y) {
    const flameColor = this.corruptionInfluence > 50 ? '#4b0082' : '#ff6b35';

    ctx.save();
    ctx.translate(x, y);

    // Glow animé (simulation)
    const glowSize = 40 + Math.sin(Date.now() / 200) * 5;
    ctx.shadowBlur = glowSize;
    ctx.shadowColor = flameColor;

    // Cercle feu
    ctx.fillStyle = flameColor;
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, 2 * Math.PI);
    ctx.fill();

    // Icône feu
    ctx.shadowBlur = 0;
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🔥', 0, 0);

    ctx.restore();
  }

  /**
   * Gère clics sur canvas
   */
  handleCanvasClick(e) {
    if (!this.canvas) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Vérifier hitboxes zones
    for (const zone of this.zones.values()) {
      if (!zone.unlocked || !zone.hitbox) continue;

      const hit = zone.hitbox;
      if (x >= hit.x && x <= hit.x + hit.width &&
          y >= hit.y && y <= hit.y + hit.height) {

        // Son clic
        if (window.ModalSounds) {
          ModalSounds.playButtonSound();
        }

        console.log(`🖱️ Clic sur zone: ${zone.name}`);

        // Appeler handler zone
        zone.onClick();
        break;
      }
    }
  }

  /**
   * Gère hover sur canvas (changement curseur)
   */
  handleCanvasHover(e) {
    if (!this.canvas) return;

    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let hovering = false;

    for (const zone of this.zones.values()) {
      if (!zone.unlocked || !zone.hitbox) continue;

      const hit = zone.hitbox;
      if (x >= hit.x && x <= hit.x + hit.width &&
          y >= hit.y && y <= hit.y + hit.height) {
        hovering = true;
        break;
      }
    }

    this.canvas.style.cursor = hovering ? 'pointer' : 'default';
  }

  /**
   * Render footer navigation
   */
  renderFooterNavigation() {
    const footer = document.getElementById('campFooter');
    if (!footer) return;

    footer.innerHTML = `
      <button class="zone-btn" onclick="CampSystem.showOverview()">
        🏕️ Vue d'ensemble
      </button>
      <button class="zone-btn" onclick="CampSystem.showForge()">
        ⚒️ Forge
      </button>
      <button class="zone-btn" onclick="CampSystem.showAltar()">
        ⚱️ Autel
      </button>
      <button class="zone-btn" onclick="CampSystem.showMarket()">
        🛒 Marché
      </button>
      <button class="zone-btn" onclick="CampSystem.showRecruitment()">
        🔥 Recrutement
      </button>
    `;
  }

  /**
   * Ferme le camp modal
   */
  close() {
    if (this.overlay) {
      this.overlay.style.animation = 'fadeOut 0.3s forwards';
      setTimeout(() => {
        if (this.overlay && this.overlay.parentNode) {
          this.overlay.remove();
        }
        this.overlay = null;
        this.canvas = null;
        this.ctx = null;
      }, 300);
    }

    console.log('🏕️ Camp fermé');
  }

  // ═══════════════════════════════════════════════════════
  // ZONES SPÉCIFIQUES
  // ═══════════════════════════════════════════════════════

  /**
   * Affiche la Forge du Destin
   */
  showForge() {
    this.currentView = 'forge';

    const content = document.getElementById('campContent');
    if (!content) return;

    const player = window.GameState?.players?.[0];
    if (!player) return;

    const hasForgeNPC = this.npcs.has('drenvar') || this.npcs.has('thorne');
    const npcName = this.npcs.has('drenvar') ? 'Drenvar le Forgeron' :
                    this.npcs.has('thorne') ? 'Thorne le Traître' :
                    'Forgeron Anonyme';

    content.innerHTML = `
      <div class="zone-view forge-view">
        <div class="zone-header">
          <h2>⚒️ Forge du Destin</h2>
          <p>Améliore tes armes ou fusionne les dés du destin</p>
          ${hasForgeNPC ? `<p class="zone-npc">🛠️ ${npcName}</p>` : ''}
        </div>

        <div class="zone-services">
          <div class="service-card">
            <div class="service-icon">🗡️</div>
            <h3>Améliorer Arme</h3>
            <p>+5 ATK permanent</p>
            <p class="service-cost">💰 50 Or</p>
            <button class="service-btn" onclick="CampSystem.upgradeWeapon()">Améliorer</button>
          </div>

          <div class="service-card">
            <div class="service-icon">🛡️</div>
            <h3>Améliorer Armure</h3>
            <p>+5 DEF permanent</p>
            <p class="service-cost">💰 50 Or</p>
            <button class="service-btn" onclick="CampSystem.upgradeArmor()">Améliorer</button>
          </div>

          <div class="service-card ${this.corruptionInfluence > 50 ? '' : 'locked'}">
            <div class="service-icon">🎲</div>
            <h3>Fusion de Dés</h3>
            <p>Dé évolué : faces x2</p>
            <p class="service-cost">💰 100 Or • 💀 +20% Corruption</p>
            <button class="service-btn" onclick="CampSystem.fuseDice()" ${this.corruptionInfluence > 50 ? '' : 'disabled'}>
              ${this.corruptionInfluence > 50 ? 'Fusionner' : '🔒 Corruption 50%+ requise'}
            </button>
          </div>
        </div>
      </div>
    `;

    console.log('⚒️ Forge affichée');
  }

  /**
   * Affiche l'Autel des Dieux Morts
   */
  showAltar() {
    this.currentView = 'altar';

    const content = document.getElementById('campContent');
    if (!content) return;

    const player = window.GameState?.players?.[0];
    if (!player) return;

    const isPure = this.corruptionInfluence < 50;
    const altarName = isPure ? 'Autel de Morwyn (Ordre)' : 'Autel de Noxar (Mort)';

    content.innerHTML = `
      <div class="zone-view altar-view ${isPure ? '' : 'corrupted'}">
        <div class="zone-header">
          <h2>⚱️ ${altarName}</h2>
          <p>Les échos des dieux morts résonnent ici...</p>
        </div>

        <div class="zone-services">
          <div class="service-card pure">
            <div class="service-icon">✨</div>
            <h3>Purification</h3>
            <p>Réduit la corruption de 20%</p>
            <p class="service-warning">⚠️ +10% Stress</p>
            <p class="service-cost">💰 50 Or</p>
            <button class="service-btn" onclick="CampSystem.purifyCorruption()">Purifier</button>
          </div>

          <div class="service-card corrupted">
            <div class="service-icon">🌑</div>
            <h3>Pacte Démoniaque</h3>
            <p>+20% Corruption, gain +15% ATK permanent</p>
            <p class="service-warning">⚠️ Irréversible</p>
            <p class="service-cost">💀 Sacrifice d'âme</p>
            <button class="service-btn danger" onclick="CampSystem.demonicPact()">Accepter</button>
          </div>

          <div class="service-card">
            <div class="service-icon">🕯️</div>
            <h3>Offrande</h3>
            <p>Sacrifier un item pour faveur divine</p>
            <p class="service-cost">📦 Item aléatoire</p>
            <button class="service-btn" onclick="CampSystem.makeOffering()">Offrir</button>
          </div>
        </div>
      </div>
    `;

    console.log('⚱️ Autel affiché');
  }

  /**
   * Affiche le Marché avec prix fluctuants
   */
  showMarket() {
    this.currentView = 'market';

    const content = document.getElementById('campContent');
    if (!content) return;

    const player = window.GameState?.players?.[0];
    if (!player) return;

    // Prix fluctuants basés corruption
    const healthPotionPrice = this.calculatePrice(30, 'pure');
    const strengthPotionPrice = this.calculatePrice(50, 'neutral');
    const cursedDaggerPrice = this.calculatePrice(80, 'corrupted');

    content.innerHTML = `
      <div class="zone-view market-view">
        <div class="zone-header">
          <h2>🛒 Marché Nomade</h2>
          <p>Prix fluctuants selon corruption et moral</p>
          ${this.corruptionInfluence > 50 ? '<p class="market-warning">⚠️ Corruption haute : Prix +30%</p>' : ''}
          ${this.morale < 50 ? '<p class="market-warning">⚠️ Moral bas : Pénurie +20%</p>' : ''}
        </div>

        <div class="zone-services">
          <div class="service-card">
            <div class="service-icon">❤️</div>
            <h3>Potion de Santé</h3>
            <p>Restaure 30 HP</p>
            <p class="service-cost">💰 ${healthPotionPrice} Or</p>
            <button class="service-btn" onclick="CampSystem.buyItem('HEALTH_POTION', ${healthPotionPrice})">Acheter</button>
          </div>

          <div class="service-card">
            <div class="service-icon">💪</div>
            <h3>Potion de Force</h3>
            <p>+10 ATK pour 5 tours</p>
            <p class="service-cost">💰 ${strengthPotionPrice} Or</p>
            <button class="service-btn" onclick="CampSystem.buyItem('STRENGTH_POTION', ${strengthPotionPrice})">Acheter</button>
          </div>

          <div class="service-card ${this.corruptionInfluence > 50 ? 'corrupted' : 'locked'}">
            <div class="service-icon">🗡️</div>
            <h3>Dague Maudite</h3>
            <p>+20 ATK, +10% Corruption/combat</p>
            <p class="service-cost">💰 ${cursedDaggerPrice} Or</p>
            <button class="service-btn" onclick="CampSystem.buyItem('CURSED_DAGGER', ${cursedDaggerPrice})" ${this.corruptionInfluence > 50 ? '' : 'disabled'}>
              ${this.corruptionInfluence > 50 ? 'Acheter' : '🔒 Marché Noir (Corruption 50%+)'}
            </button>
          </div>
        </div>
      </div>
    `;

    console.log('🛒 Marché affiché');
  }

  /**
   * Affiche zone recrutement compagnons
   */
  showRecruitment() {
    this.currentView = 'recruitment';

    const content = document.getElementById('campContent');
    if (!content) return;

    const player = window.GameState?.players?.[0];
    if (!player) return;

    // Générer grille PNJ
    let npcCardsHTML = '';

    if (this.npcs.size === 0) {
      npcCardsHTML = `
        <div class="empty-recruitment">
          <p style="font-size: 60px; margin-bottom: 20px;">🏕️</p>
          <h3>Aucun Exilé recruté</h3>
          <p>Sauve des âmes dans les cages suspendues pour bâtir ton équipe.</p>
          <p style="font-size: 14px; color: #888; margin-top: 10px;">
            Les PNJ sauvés apparaîtront ici et pourront rejoindre ton groupe.
          </p>
        </div>
      `;
    } else {
      this.npcs.forEach(npc => {
        const isSelected = this.companions.some(c => c.id === npc.id);
        const selectedClass = isSelected ? 'selected' : '';
        const corruptedClass = npc.type === 'demon' ? 'corrupted' : '';

        npcCardsHTML += `
          <div class="npc-card ${selectedClass} ${corruptedClass}" onclick="CampSystem.toggleCompanion('${npc.id}')">
            <div class="npc-portrait">${npc.icon}</div>
            <div class="npc-name">${npc.name}</div>
            <div class="npc-stats">
              <span>❤️ ${npc.baseStats.hp}</span>
              <span>⚔️ ${npc.baseStats.atk}</span>
              <span>🛡️ ${npc.baseStats.def}</span>
            </div>
            <div class="npc-role">${npc.roleLabel || npc.role}</div>
            ${isSelected ? '<div class="npc-selected-badge">✓ Sélectionné</div>' : ''}
          </div>
        `;
      });
    }

    // Team slots
    let teamSlotsHTML = '';
    for (let i = 0; i < 3; i++) {
      const companion = this.companions[i];
      if (companion) {
        teamSlotsHTML += `
          <div class="team-slot filled">
            <div class="slot-icon">${companion.sprite}</div>
            <div class="slot-name">${companion.name}</div>
          </div>
        `;
      } else {
        teamSlotsHTML += `
          <div class="team-slot">
            <div class="slot-icon">❓</div>
            <div class="slot-name">Vide</div>
          </div>
        `;
      }
    }

    content.innerHTML = `
      <div class="zone-view recruitment-view">
        <div class="zone-header">
          <h2>🔥 Campement des Exilés</h2>
          <p>Recrute jusqu'à 3 compagnons pour combattre à tes côtés</p>
        </div>

        <div class="recruitment-grid">
          ${npcCardsHTML}
        </div>

        <div class="selected-team">
          <h3>Équipe Actuelle (${this.companions.length}/3)</h3>
          <div class="team-slots">
            ${teamSlotsHTML}
          </div>
        </div>
      </div>
    `;

    console.log('🔥 Recrutement affiché');
  }

  /**
   * Affiche la bibliothèque lore
   */
  showLibrary() {
    this.currentView = 'library';

    const content = document.getElementById('campContent');
    if (!content) return;

    content.innerHTML = `
      <div class="zone-view library-view">
        <div class="zone-header">
          <h2>📜 Archives du Vide</h2>
          <p>Consulte le savoir interdit des Dieux Morts</p>
        </div>

        <div class="zone-services">
          <div class="service-card">
            <div class="service-icon">📖</div>
            <h3>Codex</h3>
            <p>Bestiaire, items découverts, lore</p>
            <button class="service-btn" onclick="alert('Codex à implémenter')">Consulter</button>
          </div>

          <div class="service-card">
            <div class="service-icon">🔮</div>
            <h3>Prophéties</h3>
            <p>Voir les prochains événements</p>
            <p class="service-cost">💎 20 Rubis</p>
            <button class="service-btn" onclick="alert('Prophéties à implémenter')">Consulter</button>
          </div>
        </div>
      </div>
    `;

    console.log('📜 Bibliothèque affichée');
  }

  // ═══════════════════════════════════════════════════════
  // ACTIONS SERVICES
  // ═══════════════════════════════════════════════════════

  /**
   * Améliore arme joueur
   */
  upgradeWeapon() {
    const player = window.GameState?.players?.[0];
    if (!player) return;

    const cost = this.calculatePrice(50, 'pure');

    if (window.EconomySystem && EconomySystem.removeGold(player, cost)) {
      player.atk += 5;
      alert('⚔️ Arme améliorée ! +5 ATK permanent');
      this.showForge(); // Refresh

      if (window.game && window.game.updateUI) {
        window.game.updateUI();
      }
    } else {
      alert('💰 Or insuffisant !');
    }
  }

  /**
   * Améliore armure joueur
   */
  upgradeArmor() {
    const player = window.GameState?.players?.[0];
    if (!player) return;

    const cost = this.calculatePrice(50, 'pure');

    if (window.EconomySystem && EconomySystem.removeGold(player, cost)) {
      player.def += 5;
      alert('🛡️ Armure améliorée ! +5 DEF permanent');
      this.showForge();

      if (window.game && window.game.updateUI) {
        window.game.updateUI();
      }
    } else {
      alert('💰 Or insuffisant !');
    }
  }

  /**
   * Fusion de dés (upgrade système Dé)
   */
  fuseDice() {
    const player = window.GameState?.players?.[0];
    if (!player) return;

    if (this.corruptionInfluence < 50) {
      alert('🔒 Corruption 50%+ requise pour cette sombre alchimie...');
      return;
    }

    const cost = 100;

    if (window.EconomySystem && EconomySystem.removeGold(player, cost)) {
      player.corruption = Math.min(100, (player.corruption || 0) + 20);

      if (window.CorruptionSystem) {
        CorruptionSystem.setCorruption(player.corruption, 'Fusion de Dés');
      }

      alert('🎲 Dés fusionnés ! Le Dé du Destin évolue... (+20% Corruption)');
      // TODO: Implémenter effet fusion dés (faces x2)

      this.showForge();
    } else {
      alert('💰 Or insuffisant !');
    }
  }

  /**
   * Purification corruption
   */
  purifyCorruption() {
    const player = window.GameState?.players?.[0];
    if (!player) return;

    const cost = 50;

    if (window.EconomySystem && EconomySystem.removeGold(player, cost)) {
      player.corruption = Math.max(0, (player.corruption || 0) - 20);

      if (window.CorruptionSystem) {
        CorruptionSystem.setCorruption(player.corruption, 'Purification à l\'Autel');
      }

      // TODO: +10% Stress

      alert('✨ Ton âme est purifiée... mais la douleur persiste. (-20% Corruption, +10% Stress)');

      this.corruptionInfluence = player.corruption;
      this.showAltar();
    } else {
      alert('💰 Or insuffisant !');
    }
  }

  /**
   * Pacte démoniaque
   */
  demonicPact() {
    const player = window.GameState?.players?.[0];
    if (!player) return;

    if (!confirm('⚠️ ATTENTION : Ce pacte est irréversible. Accepter +20% Corruption et +15% ATK permanent ?')) {
      return;
    }

    player.corruption = Math.min(100, (player.corruption || 0) + 20);
    player.atk = Math.floor(player.atk * 1.15);

    if (window.CorruptionSystem) {
      CorruptionSystem.setCorruption(player.corruption, 'Pacte Démoniaque');
    }

    alert('🌑 Le Vide t\'accueille, Pactisé. Ta puissance grandit... (+20% Corruption, +15% ATK)');

    this.corruptionInfluence = player.corruption;
    this.showAltar();

    if (window.game && window.game.updateUI) {
      window.game.updateUI();
    }
  }

  /**
   * Offrande
   */
  makeOffering() {
    alert('🕯️ Offrande à implémenter : Sacrifice item pour buff aléatoire');
  }

  /**
   * Achète item au marché
   */
  buyItem(itemType, price) {
    const player = window.GameState?.players?.[0];
    if (!player) return;

    if (window.EconomySystem && EconomySystem.removeGold(player, price)) {
      if (player.inventory) {
        player.inventory.addItem(itemType, 1);
        alert(`✅ ${itemType} acheté !`);
        this.showMarket();
      }
    } else {
      alert('💰 Or insuffisant !');
    }
  }

  /**
   * Toggle compagnon dans équipe
   */
  toggleCompanion(npcId) {
    const npc = this.npcs.get(npcId);
    if (!npc) return;

    const index = this.companions.findIndex(c => c.id === npcId);

    if (index >= 0) {
      // Retirer
      this.companions.splice(index, 1);
      console.log(`➖ ${npc.name} retiré de l'équipe`);
    } else {
      // Ajouter si place
      if (this.companions.length >= 3) {
        alert('⚠️ Équipe complète (3/3). Retire un compagnon d\'abord.');
        return;
      }

      const companion = this.npcToCompanion(npc);
      this.companions.push(companion);
      console.log(`➕ ${npc.name} rejoint l'équipe !`);
    }

    // Refresh UI
    this.showRecruitment();

    // Sauvegarder dans player.campData
    const player = window.GameState?.players?.[0];
    if (player && player.campData) {
      player.campData.companions = this.companions;
    }
  }

  // ═══════════════════════════════════════════════════════
  // GESTION PNJ & COMPAGNONS
  // ═══════════════════════════════════════════════════════

  /**
   * Recrute un PNJ sauvé des cages
   */
  recruitNPC(npcData) {
    if (!npcData || !npcData.id) {
      console.error('❌ recruitNPC : npcData invalide');
      return false;
    }

    this.npcs.set(npcData.id, npcData);
    console.log(`✅ ${npcData.name} recruté !`);

    // Sauvegarder dans player.campData
    const player = window.GameState?.players?.[0];
    if (player && player.campData) {
      if (!player.campData.savedNPCs) {
        player.campData.savedNPCs = [];
      }
      player.campData.savedNPCs.push(npcData);
    }

    return true;
  }

  /**
   * Charge PNJ depuis sauvegarde
   */
  loadNPCs(npcsArray) {
    if (!Array.isArray(npcsArray)) return;

    npcsArray.forEach(npc => {
      if (npc && npc.id) {
        this.npcs.set(npc.id, npc);
      }
    });

    console.log(`👥 ${npcsArray.length} PNJ chargés`);
  }

  /**
   * Convertit PNJ en compagnon combattant
   */
  npcToCompanion(npc) {
    return {
      id: npc.id,
      name: npc.name,
      sprite: npc.icon,
      type: npc.type,
      role: npc.role,
      hp: npc.baseStats.hp,
      maxHp: npc.baseStats.hp,
      atk: npc.baseStats.atk,
      def: npc.baseStats.def,
      speed: npc.baseStats.speed || 10,
      skills: npc.skills || [],
      isAlly: true,
      alive: true
    };
  }

  /**
   * Charge compagnons depuis sauvegarde
   */
  loadCompanions(companionsArray) {
    if (!Array.isArray(companionsArray)) return;

    this.companions = companionsArray;
    console.log(`⚔️ ${companionsArray.length} compagnons chargés`);
  }

  // ═══════════════════════════════════════════════════════
  // ÉCONOMIE & CORRUPTION
  // ═══════════════════════════════════════════════════════

  /**
   * Calcule prix selon corruption/morale
   */
  calculatePrice(basePrice, serviceType) {
    let finalPrice = basePrice;

    // 1. Modifier corruption joueur
    const corruption = this.corruptionInfluence;

    if (serviceType === 'pure') {
      // Services purs plus chers si corrompu
      finalPrice *= (1 + corruption / 100); // +0% à +100%
    } else if (serviceType === 'corrupted') {
      // Services corrompus moins chers si corrompu
      finalPrice *= (1 - corruption / 200); // -0% à -50%
    }

    // 2. Modifier morale village
    if (this.morale < 50) {
      finalPrice *= 1.3; // +30% si moral bas
    } else if (this.morale > 80) {
      finalPrice *= 0.9; // -10% si moral haut
    }

    // 3. Fluctuation aléatoire (±10%)
    const randomMod = 0.9 + Math.random() * 0.2;
    finalPrice *= randomMod;

    return Math.max(1, Math.floor(finalPrice));
  }

  /**
   * Vérifie événements village aléatoires
   */
  checkVillageEvents(player) {
    // Événement : Révolte PNJ purs
    if (this.corruptionInfluence > 75 && this.morale < 40 && Math.random() < 0.3) {
      this.triggerRevoltEvent(player);
      return;
    }

    // Événement : Mi-démons rejoignent
    if (this.corruptionInfluence > 60 && Math.random() < 0.2) {
      this.triggerDemonsArrivalEvent(player);
      return;
    }
  }

  /**
   * Événement : Révolte PNJ purs
   */
  triggerRevoltEvent(player) {
    const choice = confirm(
      '💥 RÉVOLTE AU CAMP\n\n' +
      'Les humains purs ne supportent plus ta corruption. Ils se soulèvent.\n\n' +
      'Écraser la révolte ? (OK)\n' +
      '- +30% corruption\n' +
      '- PNJ purs exécutés\n\n' +
      'Te purifier pour apaiser ? (Annuler)\n' +
      '- -20% corruption\n' +
      '- -50 or'
    );

    if (choice) {
      // Écraser
      player.corruption = Math.min(100, (player.corruption || 0) + 30);

      // Retirer PNJ purs
      const toRemove = [];
      this.npcs.forEach((npc, id) => {
        if (npc.type === 'pure') {
          toRemove.push(id);
        }
      });
      toRemove.forEach(id => this.npcs.delete(id));

      this.morale = Math.max(0, this.morale - 30);

      alert(`💀 La révolte est écrasée. ${toRemove.length} exilés purs ont été exécutés.`);
    } else {
      // Purifier
      if (window.EconomySystem && EconomySystem.removeGold(player, 50)) {
        player.corruption = Math.max(0, (player.corruption || 0) - 20);
        this.morale = Math.min(100, this.morale + 20);

        alert('✨ Tu te purifies. Le calme revient au camp.');
      } else {
        alert('💰 Or insuffisant pour apaiser ! La révolte continue...');
      }
    }

    if (window.CorruptionSystem) {
      CorruptionSystem.setCorruption(player.corruption, 'Révolte Village');
    }

    this.corruptionInfluence = player.corruption;
  }

  /**
   * Événement : Mi-démons arrivent
   */
  triggerDemonsArrivalEvent(player) {
    const choice = confirm(
      '🌑 NOUVEAUX ARRIVANTS\n\n' +
      'Des mi-démons sentent ta corruption. Ils demandent refuge.\n\n' +
      'Accepter ? (OK)\n' +
      '- +2 PNJ mi-démons\n' +
      '- +10% corruption\n\n' +
      'Refuser ? (Annuler)\n' +
      '- -10% morale'
    );

    if (choice) {
      player.corruption = Math.min(100, (player.corruption || 0) + 10);

      // Ajouter 2 mi-démons génériques
      this.recruitNPC({
        id: 'demon_' + Date.now(),
        name: 'Mi-Démon Errant',
        icon: '😈',
        type: 'demon',
        role: 'dps',
        roleLabel: 'DPS • Corrompu',
        baseStats: { hp: 70, atk: 20, def: 6, speed: 12 }
      });

      alert('🌑 Deux mi-démons rejoignent le camp. Leur corruption est palpable.');
    } else {
      this.morale = Math.max(0, this.morale - 10);
      alert('😐 Tu refuses. Le moral baisse légèrement.');
    }

    if (window.CorruptionSystem) {
      CorruptionSystem.setCorruption(player.corruption, 'Arrivée Mi-Démons');
    }

    this.corruptionInfluence = player.corruption;
  }

  /**
   * Joue son ambiance camp
   */
  playAmbientSound() {
    if (!window.AudioManager) return;

    // TODO: Implémenter sons ambiance
    // const soundKey = this.corruptionInfluence > 50 ? 'camp_corrupted' : 'camp_pure';
    // AudioManager.playAmbient(soundKey);
  }
}

// ═══════════════════════════════════════════════════════
// EXPORT GLOBAL
// ═══════════════════════════════════════════════════════

if (typeof window !== 'undefined') {
  window.CampSystem = new CampSystem();
  console.log('🏕️ Camp System loaded');
}
