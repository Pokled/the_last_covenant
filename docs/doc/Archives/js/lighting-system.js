// 💡 SYSTÈME D'ÉCLAIRAGE DYNAMIQUE ET PARTICULES

class LightingSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.lights = [];
    this.particles = [];
    this.time = 0;
  }
  
  // ➕ Ajouter une source de lumière
  addLight(x, y, color, intensity, flicker = true) {
    this.lights.push({
      x, y, color, intensity,
      baseIntensity: intensity,
      flicker,
      flickerSpeed: 0.05 + Math.random() * 0.05,
      flickerOffset: Math.random() * Math.PI * 2
    });
  }
  
  // 🔄 Mettre à jour (pour animation)
  update() {
    this.time += 0.016; // ~60fps
    
    // Mettre à jour les particules
    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.01;
      p.opacity = p.life;
      return p.life > 0;
    });
    
    // Ajouter des particules aléatoires aux sources de lumière
    this.lights.forEach(light => {
      if (Math.random() < 0.05) {
        this.particles.push({
          x: light.x + (Math.random() - 0.5) * 20,
          y: light.y + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -Math.random() * 0.5 - 0.2,
          size: Math.random() * 3 + 1,
          color: light.color,
          life: 1,
          opacity: 1
        });
      }
    });
  }
  
  // 🎨 Dessiner l'éclairage
  render(ctx) {
    // Dessiner les halos de lumière
    this.lights.forEach(light => {
      // Effet de scintillement
      let intensity = light.baseIntensity;
      if (light.flicker) {
        intensity *= 0.9 + Math.sin(this.time * light.flickerSpeed + light.flickerOffset) * 0.1;
      }
      
      // Gradient radial pour le halo
      const gradient = ctx.createRadialGradient(
        light.x, light.y, 0,
        light.x, light.y, intensity
      );
      
      const rgb = this.hexToRgb(light.color);
      gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6)`);
      gradient.addColorStop(0.3, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`);
      gradient.addColorStop(0.6, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
      gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(
        light.x - intensity,
        light.y - intensity,
        intensity * 2,
        intensity * 2
      );
    });
    
    // Dessiner les particules
    this.particles.forEach(p => {
      const rgb = this.hexToRgb(p.color);
      ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${p.opacity * 0.8})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Petit halo autour de chaque particule
      const pgradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
      pgradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${p.opacity * 0.3})`);
      pgradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
      ctx.fillStyle = pgradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  
  // 🔧 Convertir hex en RGB
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
  }
  
  // 🧹 Nettoyer toutes les lumières
  clear() {
    this.lights = [];
    this.particles = [];
  }
}

// Export global
window.LightingSystem = LightingSystem;

console.log('✅ LightingSystem chargé');