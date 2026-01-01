// 🎨 GÉNÉRATEUR DE TEXTURES PROCÉDURALES POUR DONJON

class TextureGenerator {
  constructor() {
    this.cache = new Map();
    this.noiseCache = [];
    this.initNoise();
  }
  
  // 🎲 Initialiser le bruit de Perlin simplifié
  initNoise() {
    for (let i = 0; i < 256; i++) {
      this.noiseCache[i] = Math.random();
    }
  }
  
  // 🌫️ Fonction de bruit simple (pseudo-Perlin)
  noise(x, y) {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    return this.noiseCache[(xi + yi * 57) & 255];
  }
  
  // 📦 Générer une texture de dalle de pierre
  generateStoneTexture(width, height, seed = 0) {
    const key = `stone_${width}_${height}_${seed}`;
    if (this.cache.has(key)) return this.cache.get(key);
    
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Couleur de base (pierre grise)
    const baseColors = [
      { r: 80, g: 80, b: 85 },
      { r: 70, g: 72, b: 75 },
      { r: 85, g: 87, b: 90 }
    ];
    const baseColor = baseColors[seed % baseColors.length];
    
    // Remplir avec couleur de base
    ctx.fillStyle = `rgb(${baseColor.r}, ${baseColor.g}, ${baseColor.b})`;
    ctx.fillRect(0, 0, width, height);
    
    // Ajouter du bruit pour texture
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        
        // Bruit multicouche
        const noise1 = this.noise(x * 0.1 + seed, y * 0.1 + seed) * 30;
        const noise2 = this.noise(x * 0.05 + seed, y * 0.05 + seed) * 20;
        const noise3 = this.noise(x * 0.02 + seed, y * 0.02 + seed) * 15;
        
        const variation = noise1 + noise2 + noise3 - 32;
        
        data[i] = Math.max(0, Math.min(255, data[i] + variation));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + variation));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + variation));
        
        // Fissures aléatoires
        if (Math.random() < 0.02) {
          data[i] *= 0.5;
          data[i + 1] *= 0.5;
          data[i + 2] *= 0.5;
        }
        
        // Mousse verte occasionnelle
        if (Math.random() < 0.01) {
          data[i] = Math.min(255, data[i] + 10);
          data[i + 1] = Math.min(255, data[i + 1] + 30);
          data[i + 2] = Math.min(255, data[i + 2] + 10);
        }
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    this.cache.set(key, canvas);
    return canvas;
  }
  
  // 🧱 Générer texture de mur sombre
  generateWallTexture(width, height) {
    const key = `wall_${width}_${height}`;
    if (this.cache.has(key)) return this.cache.get(key);
    
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Gradient sombre
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#1a1a1a');
    gradient.addColorStop(0.5, '#0f0f0f');
    gradient.addColorStop(1, '#050505');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Ajouter texture de roche
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        
        const noise1 = this.noise(x * 0.05, y * 0.05) * 20;
        const noise2 = this.noise(x * 0.02, y * 0.02) * 10;
        
        const variation = noise1 + noise2 - 15;
        
        data[i] = Math.max(0, Math.min(255, data[i] + variation));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + variation));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + variation));
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    this.cache.set(key, canvas);
    return canvas;
  }
}

// Export global
window.TextureGenerator = TextureGenerator;

console.log('✅ TextureGenerator chargé');