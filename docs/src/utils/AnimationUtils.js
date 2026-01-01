/**
 * AnimationUtils - Utilitaires d'animations AAA
 */

export class AnimationUtils {
    /**
     * Fade in un élément
     */
    static fadeIn(element, duration = 300, callback = null) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = (timestamp - start) / duration;
            
            element.style.opacity = Math.min(progress, 1);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else if (callback) {
                callback();
            }
        };
        
        requestAnimationFrame(animate);
    }

    /**
     * Fade out un élément
     */
    static fadeOut(element, duration = 300, callback = null) {
        element.style.opacity = '1';
        
        let start = null;
        
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = (timestamp - start) / duration;
            
            element.style.opacity = 1 - Math.min(progress, 1);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
                if (callback) callback();
            }
        };
        
        requestAnimationFrame(animate);
    }

    /**
     * Screen shake effect
     */
    static screenShake(element, duration = 500, intensity = 5) {
        const originalTransform = element.style.transform;
        const startTime = Date.now();
        
        const shake = () => {
            const elapsed = Date.now() - startTime;
            
            if (elapsed < duration) {
                const progress = elapsed / duration;
                const currentIntensity = intensity * (1 - progress);
                
                const x = (Math.random() - 0.5) * currentIntensity * 2;
                const y = (Math.random() - 0.5) * currentIntensity * 2;
                
                element.style.transform = `translate(${x}px, ${y}px)`;
                
                requestAnimationFrame(shake);
            } else {
                element.style.transform = originalTransform;
            }
        };
        
        shake();
    }

    /**
     * Pulse/glow effect
     */
    static pulse(element, duration = 1000) {
        element.style.animation = `none`;
        
        setTimeout(() => {
            element.style.animation = `pulse ${duration}ms ease-in-out`;
        }, 10);
        
        setTimeout(() => {
            element.style.animation = 'none';
        }, duration);
    }

    /**
     * Scale on hover (via CSS mais initialisé ici)
     */
    static initHoverScale(element, scale = 1.05) {
        element.addEventListener('mouseenter', () => {
            element.style.transform = `scale(${scale})`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1)';
        });
    }

    /**
     * Transition entre scènes
     */
    static transitionScenes(fromScene, toScene, duration = 600) {
        return new Promise((resolve) => {
            // Fade out from
            this.fadeOut(fromScene, duration / 2, () => {
                fromScene.classList.remove('active');
                
                // Fade in to
                toScene.classList.add('active');
                this.fadeIn(toScene, duration / 2, resolve);
            });
        });
    }

    /**
     * Typing effect pour texte
     */
    static typeText(element, text, speed = 50, callback = null) {
        element.textContent = '';
        let index = 0;
        
        const type = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            } else if (callback) {
                callback();
            }
        };
        
        type();
    }
}
