/**
 * MAIN MENU SYSTEM
 * THE LAST COVENANT - AAA+ Menu Navigation
 */

class MainMenuSystem {
  constructor() {
    this.titleScreen = null;
    this.mainMenu = null;
    this.optionsModal = null;
    this.creditsModal = null;
    this.saves = [];
    this.settings = this.loadSettings();
    this.particleSystems = {
      title: null,
      menu: null
    };
  }

  /**
   * Initialize the main menu system
   */
  init() {
    console.log('🎮 THE LAST COVENANT - Main Menu Init');

    // Get DOM elements
    this.titleScreen = document.getElementById('titleScreen');
    this.mainMenu = document.getElementById('mainMenu');
    this.optionsModal = document.getElementById('optionsModal');
    this.creditsModal = document.getElementById('creditsModal');

    // Initialize particle systems
    this.initParticles();

    // Set up event listeners
    this.setupTitleScreen();
    this.setupMainMenu();
    this.setupOptionsModal();
    this.setupCreditsModal();

    // Apply saved settings
    this.applySettings();

    // Load save data
    this.loadSaves();

    // Start title screen
    this.showTitleScreen();
  }

  /**
   * Initialize particle systems for backgrounds
   */
  initParticles() {
    // Title screen particles
    const titleParticlesContainer = document.getElementById('titleParticles');
    if (titleParticlesContainer) {
      this.particleSystems.title = this.createParticleSystem(titleParticlesContainer, 50);
    }

    // Main menu particles
    const menuParticlesContainer = document.getElementById('menuParticles');
    if (menuParticlesContainer) {
      this.particleSystems.menu = this.createParticleSystem(menuParticlesContainer, 30);
    }
  }

  /**
   * Create a particle system in a container
   */
  createParticleSystem(container, count) {
    const particles = [];

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 1}px;
        height: ${Math.random() * 4 + 1}px;
        background: rgba(212, 175, 55, ${Math.random() * 0.5 + 0.2});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        pointer-events: none;
        animation: particleFloat ${Math.random() * 20 + 10}s linear infinite;
        animation-delay: ${Math.random() * -20}s;
      `;
      container.appendChild(particle);
      particles.push(particle);
    }

    return particles;
  }

  /**
   * Set up title screen "Press Any Key" functionality
   */
  setupTitleScreen() {
    let activated = false;

    const activate = () => {
      if (activated) return;
      activated = true;

      this.playSound('menu_transition');
      this.transitionToMainMenu();
    };

    // Keyboard listener
    document.addEventListener('keydown', (e) => {
      if (this.titleScreen.classList.contains('active')) {
        activate();
      }
    });

    // Click listener
    this.titleScreen.addEventListener('click', () => {
      if (this.titleScreen.classList.contains('active')) {
        activate();
      }
    });
  }

  /**
   * Transition from title screen to main menu
   */
  transitionToMainMenu() {
    this.titleScreen.classList.add('closing');

    setTimeout(() => {
      this.titleScreen.classList.remove('active', 'closing');
      this.mainMenu.classList.add('active');
      this.playSound('menu_open');
    }, 500);
  }

  /**
   * Set up main menu buttons
   */
  setupMainMenu() {
    // New Game
    const newGameBtn = document.getElementById('menuNewGame');
    newGameBtn.addEventListener('click', () => {
      this.playSound('menu_select');
      this.handleNewGame();
    });

    // Continue
    const continueBtn = document.getElementById('menuContinue');
    continueBtn.addEventListener('click', () => {
      if (!continueBtn.disabled) {
        this.playSound('menu_select');
        this.handleContinue();
      }
    });

    // Bestiary
    const bestiaryBtn = document.getElementById('menuBestiary');
    bestiaryBtn.addEventListener('click', () => {
      this.playSound('menu_select');
      this.handleBestiary();
    });

    // Options
    const optionsBtn = document.getElementById('menuOptions');
    optionsBtn.addEventListener('click', () => {
      this.playSound('menu_select');
      this.showOptionsModal();
    });

    // Credits
    const creditsBtn = document.getElementById('menuCredits');
    creditsBtn.addEventListener('click', () => {
      this.playSound('menu_select');
      this.showCreditsModal();
    });

    // Quit
    const quitBtn = document.getElementById('menuQuit');
    quitBtn.addEventListener('click', () => {
      this.handleQuit();
    });

    // Add hover sounds
    const allMenuItems = document.querySelectorAll('.menu-item');
    allMenuItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        if (!item.disabled) {
          this.playSound('menu_hover');
        }
      });
    });
  }

  /**
   * Handle New Game button
   */
  handleNewGame() {
    // Initialize and show character selection
    if (window.characterSelectSystem) {
      // Ensure system is initialized
      window.characterSelectSystem.init().then(() => {
        window.characterSelectSystem.show((result) => {
          // Save selected character to localStorage (format attendu par camp.html)
          const playerData = {
            name: result.playerName,
            class: result.classId,
            className: result.classData.name,
            classIcon: result.classData.icon,
            classData: result.classData,
            level: 1,
            hp: result.classData.baseStats.hp,
            maxHp: result.classData.baseStats.hp,
            atk: result.classData.baseStats.atk,
            def: result.classData.baseStats.def,
            corruption: 0,
            rubis: 50,
            gold: 10,
            companions: [],
            unlockedDungeons: ['tutorial'],
            completedDungeons: [],
            timestamp: Date.now()
          };

          localStorage.setItem('tlc_player', JSON.stringify(playerData));

          // Navigate to camp (hub principal)
          setTimeout(() => {
            window.location.href = 'camp.html';
          }, 300);
        });
      }).catch(error => {
        console.error('❌ Failed to initialize character selection:', error);
        console.error('Error details:', error.message, error.stack);
        alert('Erreur lors du chargement de la sélection de personnage.\nDétails: ' + error.message);
      });
    } else {
      console.error('❌ CharacterSelectSystem not found on window');
      console.error('Available on window:', Object.keys(window).filter(k => k.toLowerCase().includes('char')));
      alert('Le système de sélection de personnage n\'est pas chargé.\nVérifiez la console pour plus de détails.');
    }
  }

  /**
   * Handle Continue button
   */
  handleContinue() {
    console.log('📖 Loading saved game...');

    if (this.saves.length > 0) {
      const latestSave = this.saves[0];
      localStorage.setItem('currentSave', JSON.stringify(latestSave));

      setTimeout(() => {
        window.location.href = 'game.html';
      }, 300);
    }
  }

  /**
   * Handle Bestiary button
   */
  handleBestiary() {
    console.log('👹 Opening Bestiary...');

    // TODO: Create bestiary page/modal
    alert('🔒 Le Bestiaire sera débloqué au fur et à mesure de vos rencontres...\n\n(Fonctionnalité à venir)');
  }

  /**
   * Handle Quit button
   */
  handleQuit() {
    this.playSound('menu_close');

    if (confirm('Quitter THE LAST COVENANT ?')) {
      // In Electron/Tauri, this would close the app
      // In browser, we can only close if opened by script
      window.close();

      // Fallback: return to a "goodbye" screen
      document.body.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: linear-gradient(135deg, rgba(10, 5, 5, 0.95) 0%, rgba(20, 10, 10, 0.98) 100%);
          font-family: 'Cinzel', serif;
          color: #D4AF37;
          font-size: 2rem;
          text-align: center;
          flex-direction: column;
          gap: 20px;
        ">
          <div>THE LAST COVENANT</div>
          <div style="font-size: 1.2rem; color: #999;">Les Dieux t'attendent...</div>
          <button onclick="location.reload()" style="
            padding: 15px 40px;
            background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
            border: none;
            border-radius: 6px;
            font-family: 'Cinzel', serif;
            font-size: 1rem;
            cursor: pointer;
            color: #1a0f0f;
            font-weight: 600;
          ">Revenir</button>
        </div>
      `;
    }
  }

  /**
   * Set up options modal
   */
  setupOptionsModal() {
    const closeBtn = document.getElementById('closeOptions');
    const saveBtn = document.getElementById('saveOptions');
    const resetBtn = document.getElementById('resetOptions');

    // Close button
    closeBtn.addEventListener('click', () => {
      this.hideOptionsModal();
    });

    // Click backdrop to close
    this.optionsModal.querySelector('.modal-backdrop').addEventListener('click', () => {
      this.hideOptionsModal();
    });

    // Save button
    saveBtn.addEventListener('click', () => {
      this.saveSettings();
      this.playSound('menu_confirm');
      this.hideOptionsModal();
    });

    // Reset button
    resetBtn.addEventListener('click', () => {
      if (confirm('Réinitialiser tous les paramètres aux valeurs par défaut ?')) {
        this.resetSettings();
        this.playSound('menu_select');
      }
    });

    // Volume sliders with live preview
    this.setupVolumeSlider('volumeMusic', 'volumeMusicValue');
    this.setupVolumeSlider('volumeSFX', 'volumeSFXValue');

    // Particle quality selector
    const particlesQuality = document.getElementById('particlesQuality');
    particlesQuality.addEventListener('change', (e) => {
      this.settings.particlesQuality = e.target.value;
    });

    // Checkboxes
    const checkboxes = ['screenShake', 'bloodEffects', 'autoSave'];
    checkboxes.forEach(id => {
      const checkbox = document.getElementById(id);
      checkbox.addEventListener('change', (e) => {
        this.settings[id] = e.target.checked;
      });
    });

    // Combat speed
    const combatSpeed = document.getElementById('combatSpeed');
    combatSpeed.addEventListener('change', (e) => {
      this.settings.combatSpeed = e.target.value;
    });
  }

  /**
   * Set up volume slider with live update
   */
  setupVolumeSlider(sliderId, valueId) {
    const slider = document.getElementById(sliderId);
    const valueDisplay = document.getElementById(valueId);

    slider.addEventListener('input', (e) => {
      const value = e.target.value;
      valueDisplay.textContent = value + '%';

      // Update setting
      this.settings[sliderId] = parseInt(value);

      // Live preview
      if (sliderId === 'volumeMusic') {
        this.updateMusicVolume(value / 100);
      } else if (sliderId === 'volumeSFX') {
        this.updateSFXVolume(value / 100);
      }
    });
  }

  /**
   * Show options modal
   */
  showOptionsModal() {
    this.optionsModal.classList.add('active');
    this.loadSettingsToUI();
  }

  /**
   * Hide options modal
   */
  hideOptionsModal() {
    this.playSound('menu_close');
    this.optionsModal.classList.remove('active');
  }

  /**
   * Set up credits modal
   */
  setupCreditsModal() {
    const closeBtn = document.getElementById('closeCredits');

    closeBtn.addEventListener('click', () => {
      this.hideCreditsModal();
    });

    this.creditsModal.querySelector('.modal-backdrop').addEventListener('click', () => {
      this.hideCreditsModal();
    });
  }

  /**
   * Show credits modal
   */
  showCreditsModal() {
    this.creditsModal.classList.add('active');
  }

  /**
   * Hide credits modal
   */
  hideCreditsModal() {
    this.playSound('menu_close');
    this.creditsModal.classList.remove('active');
  }

  /**
   * Load settings from localStorage
   */
  loadSettings() {
    const defaultSettings = {
      volumeMusic: 70,
      volumeSFX: 80,
      particlesQuality: 'medium',
      screenShake: true,
      bloodEffects: true,
      autoSave: true,
      combatSpeed: 'normal'
    };

    try {
      const saved = localStorage.getItem('tlc_settings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch (e) {
      console.error('Failed to load settings:', e);
      return defaultSettings;
    }
  }

  /**
   * Load settings into UI elements
   */
  loadSettingsToUI() {
    // Volume sliders
    document.getElementById('volumeMusic').value = this.settings.volumeMusic;
    document.getElementById('volumeMusicValue').textContent = this.settings.volumeMusic + '%';
    document.getElementById('volumeSFX').value = this.settings.volumeSFX;
    document.getElementById('volumeSFXValue').textContent = this.settings.volumeSFX + '%';

    // Particle quality
    document.getElementById('particlesQuality').value = this.settings.particlesQuality;

    // Checkboxes
    document.getElementById('screenShake').checked = this.settings.screenShake;
    document.getElementById('bloodEffects').checked = this.settings.bloodEffects;
    document.getElementById('autoSave').checked = this.settings.autoSave;

    // Combat speed
    document.getElementById('combatSpeed').value = this.settings.combatSpeed;
  }

  /**
   * Save settings to localStorage
   */
  saveSettings() {
    try {
      localStorage.setItem('tlc_settings', JSON.stringify(this.settings));
      console.log('✅ Settings saved:', this.settings);
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }

  /**
   * Reset settings to defaults
   */
  resetSettings() {
    this.settings = {
      volumeMusic: 70,
      volumeSFX: 80,
      particlesQuality: 'medium',
      screenShake: true,
      bloodEffects: true,
      autoSave: true,
      combatSpeed: 'normal'
    };

    this.loadSettingsToUI();
    this.saveSettings();
    this.applySettings();
  }

  /**
   * Apply settings to the game
   */
  applySettings() {
    // Apply music volume
    this.updateMusicVolume(this.settings.volumeMusic / 100);

    // Apply SFX volume
    this.updateSFXVolume(this.settings.volumeSFX / 100);

    // Apply particle quality
    this.applyParticleQuality(this.settings.particlesQuality);
  }

  /**
   * Update music volume
   */
  updateMusicVolume(volume) {
    if (window.AudioManager && window.AudioManager.setMusicVolume) {
      window.AudioManager.setMusicVolume(volume);
    }
  }

  /**
   * Update SFX volume
   */
  updateSFXVolume(volume) {
    if (window.AudioManager && window.AudioManager.setSFXVolume) {
      window.AudioManager.setSFXVolume(volume);
    }
  }

  /**
   * Apply particle quality setting
   */
  applyParticleQuality(quality) {
    const counts = {
      low: 10,
      medium: 30,
      high: 50,
      ultra: 80
    };

    // Update particle counts if needed
    console.log(`🌟 Particle Quality: ${quality}`);
  }

  /**
   * Load saved games from localStorage
   */
  loadSaves() {
    try {
      const saved = localStorage.getItem('tlc_saves');
      this.saves = saved ? JSON.parse(saved) : [];

      console.log(`💾 Loaded ${this.saves.length} save(s)`);

      // Enable/disable Continue button
      const continueBtn = document.getElementById('menuContinue');
      if (this.saves.length > 0) {
        continueBtn.disabled = false;
        this.showSavesPreview();
      } else {
        continueBtn.disabled = true;
      }
    } catch (e) {
      console.error('Failed to load saves:', e);
      this.saves = [];
    }
  }

  /**
   * Show saves preview in menu
   */
  showSavesPreview() {
    const previewContainer = document.getElementById('savesPreview');
    const savesList = document.getElementById('savesList');

    if (!previewContainer || !savesList) return;

    previewContainer.style.display = 'block';
    savesList.innerHTML = '';

    // Show latest 3 saves
    const latestSaves = this.saves.slice(0, 3);

    latestSaves.forEach((save, index) => {
      const saveItem = document.createElement('div');
      saveItem.className = 'save-item';
      saveItem.innerHTML = `
        <div class="save-icon">${save.classIcon || '⚔️'}</div>
        <div class="save-info">
          <div class="save-name">${save.className || 'Aventurier'} - Niv. ${save.level || 1}</div>
          <div class="save-date">${this.formatDate(save.timestamp)}</div>
        </div>
        <div class="save-progress">Salle ${save.room || 1}/450</div>
      `;

      saveItem.addEventListener('click', () => {
        this.loadSpecificSave(index);
      });

      savesList.appendChild(saveItem);
    });
  }

  /**
   * Load a specific save
   */
  loadSpecificSave(index) {
    const save = this.saves[index];
    if (save) {
      localStorage.setItem('currentSave', JSON.stringify(save));
      this.playSound('menu_select');

      setTimeout(() => {
        window.location.href = 'game.html';
      }, 300);
    }
  }

  /**
   * Format timestamp to readable date
   */
  formatDate(timestamp) {
    if (!timestamp) return 'Date inconnue';

    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    // Less than 1 hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `Il y a ${minutes} min`;
    }

    // Less than 24 hours
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `Il y a ${hours}h`;
    }

    // Format as date
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Play sound effect
   */
  playSound(soundName) {
    if (window.AudioManager && window.AudioManager.playSFX) {
      window.AudioManager.playSFX(soundName);
    }
  }

  /**
   * Show title screen
   */
  showTitleScreen() {
    this.titleScreen.classList.add('active');
    this.mainMenu.classList.remove('active');
  }
}

// Initialize on DOM load
let mainMenuSystem;

window.addEventListener('DOMContentLoaded', () => {
  console.log('🎮 THE LAST COVENANT - Initializing Main Menu...');

  mainMenuSystem = new MainMenuSystem();
  mainMenuSystem.init();
});

// Add particle animation CSS if not already in CSS file
const style = document.createElement('style');
style.textContent = `
  @keyframes particleFloat {
    0% {
      transform: translateY(0) translateX(0) rotate(0deg);
      opacity: 0;
    }
    10% {
      opacity: 0.8;
    }
    90% {
      opacity: 0.8;
    }
    100% {
      transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px) rotate(360deg);
      opacity: 0;
    }
  }

  .save-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 10px;
  }

  .save-item:hover {
    background: rgba(0, 0, 0, 0.5);
    border-color: var(--color-gold-primary, #D4AF37);
    transform: translateX(5px);
  }

  .save-icon {
    font-size: 2rem;
    filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.3));
  }

  .save-info {
    flex: 1;
  }

  .save-name {
    font-weight: 600;
    color: #FFF;
    margin-bottom: 5px;
  }

  .save-date {
    font-size: 0.85rem;
    color: #999;
  }

  .save-progress {
    font-size: 0.9rem;
    color: var(--color-gold-primary, #D4AF37);
    font-weight: 600;
  }

  .modal.active {
    display: block;
    animation: modalFadeIn 0.3s ease;
  }

  @keyframes modalFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);
