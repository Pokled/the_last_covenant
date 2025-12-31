/**
 * EventBus - Système d'événements global
 * @description Pub/Sub pattern pour communication entre modules
 */

export class EventBus {
    constructor() {
        this.listeners = new Map();
    }

    /**
     * Enregistrer un listener pour un événement
     * @param {string} event - Nom de l'événement
     * @param {Function} callback - Fonction à appeler
     * @returns {Function} Fonction pour unsubscribe
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        
        this.listeners.get(event).push(callback);

        // Retourner fonction de cleanup
        return () => this.off(event, callback);
    }

    /**
     * Retirer un listener
     * @param {string} event - Nom de l'événement
     * @param {Function} callback - Fonction à retirer
     */
    off(event, callback) {
        if (!this.listeners.has(event)) return;

        const callbacks = this.listeners.get(event);
        const index = callbacks.indexOf(callback);
        
        if (index > -1) {
            callbacks.splice(index, 1);
        }
    }

    /**
     * Émettre un événement
     * @param {string} event - Nom de l'événement
     * @param {*} data - Données à passer
     */
    emit(event, data) {
        if (!this.listeners.has(event)) return;

        const callbacks = this.listeners.get(event);
        callbacks.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in event listener for "${event}":`, error);
            }
        });
    }

    /**
     * Écouter un événement une seule fois
     * @param {string} event - Nom de l'événement
     * @param {Function} callback - Fonction à appeler
     */
    once(event, callback) {
        const wrappedCallback = (data) => {
            callback(data);
            this.off(event, wrappedCallback);
        };
        this.on(event, wrappedCallback);
    }

    /**
     * Nettoyer tous les listeners d'un événement
     * @param {string} event - Nom de l'événement (optionnel)
     */
    clear(event) {
        if (event) {
            this.listeners.delete(event);
        } else {
            this.listeners.clear();
        }
    }
}
