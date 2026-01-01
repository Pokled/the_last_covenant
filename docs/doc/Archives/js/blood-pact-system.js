/**
 * 🩸 BLOOD PACT SYSTEM - THE LAST COVENANT
 * Système de signature de pactes avec le Dé du Destin (Thalys)
 * 
 * Inspirations : Diablo, Phasmophobia (signature), Inscryption
 * Ton : Mature, oppressant, manipulateur, sarcastique
 * 
 * Fonctionnalités :
 * - Modal de pacte immersive (parchemin ancien)
 * - Zone de signature interactive (hold pour signer en sang)
 * - SFX : Grattage plume, papier froissé, murmures
 * - VFX : Sang qui coule, particules, flammes
 * - Dialogue du Dé (manipulateur, séduisant, ironique)
 * - Conséquences visuelles (corruption, chemins fantômes)
 */

class BloodPactSystem {
  constructor(gameInstance) {
    this.game = gameInstance;
    this.audio = this.initAudio();
    this.pactHistory = []; // Historique des pactes signés
    
    // Configuration
    this.config = {
      signDuration: 5000, // 5 secondes pour signer (plus de temps pour lire)
      minCorruption: 5,   // Minimum de corruption par pacte
      maxCorruption: 20,  // Maximum de corruption par pacte
    };

    // État
    this.isModalOpen = false;
    this.currentPact = null;
    this.signProgress = 0;
    this.isSigning = false;

    console.log('🩸 BloodPactSystem initialisé');
  }

  // ═══════════════════════════════════════════════════════════════
  // AUDIO (SFX)
  // ═══════════════════════════════════════════════════════════════

  initAudio() {
    return {
      // Sons de signature
      quillScratch: this.createQuillSound(),      // Grattage plume
      paperRustle: this.createPaperSound(),       // Papier froissé
      bloodDrip: this.createBloodSound(),         // Gouttes de sang
      
      // Sons atmosphériques
      whisper: this.createWhisperSound(),         // Murmures démoniques
      heartbeat: this.createHeartbeatSound(),     // Battements de cœur
      
      // Sons du Dé
      diceChuckle: this.createChuckleSound(),     // Rire sarcastique
      diceSigh: this.createSighSound(),           // Soupir moqueur
      
      // Sons de conséquence
      corruption: this.createCorruptionSound(),   // Corruption montante
      soulBind: this.createSoulBindSound()        // Âme liée
    };
  }

  // Génération procédurale des sons (Web Audio API)
  createQuillSound() {
    // Son de plume grattant le parchemin (bruit blanc filtré + pitch)
    return {
      play: () => {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Bruit blanc
        const bufferSize = audioCtx.sampleRate * 0.15; // 150ms
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.2; // Bruit doux
        }
        
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        
        // Filtre passe-haut (enlever les basses fréquences)
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 800;
        filter.Q.value = 2;
        
        // Gain avec fade
        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.15);
        
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        noise.start();
        noise.stop(audioCtx.currentTime + 0.15);
      }
    };
  }

  createPaperSound() {
    return {
      play: () => {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const bufferSize = audioCtx.sampleRate * 0.3;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Bruit crépitant
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.15 * Math.exp(-i / (bufferSize / 3));
        }
        
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 600;
        filter.Q.value = 5;
        
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 0.4;
        
        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        source.start();
      }
    };
  }

  createBloodSound() {
    return {
      play: () => {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 120; // Grave
        
        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      }
    };
  }

  createWhisperSound() {
    return {
      play: () => {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const bufferSize = audioCtx.sampleRate * 2;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Murmure = bruit blanc + LFO lent
        for (let i = 0; i < bufferSize; i++) {
          const lfo = Math.sin(i / (audioCtx.sampleRate / 3)) * 0.5 + 0.5;
          data[i] = (Math.random() * 2 - 1) * 0.1 * lfo;
        }
        
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;
        filter.Q.value = 10;
        
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 0.15;
        
        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        source.start();
        source.loop = true;
        
        // Retourner pour pouvoir arrêter plus tard
        return source;
      }
    };
  }

  createHeartbeatSound() {
    return {
      play: () => {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        const beat = () => {
          const osc = audioCtx.createOscillator();
          osc.type = 'sine';
          osc.frequency.value = 80;
          
          const gainNode = audioCtx.createGain();
          gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
          
          osc.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          
          osc.start();
          osc.stop(audioCtx.currentTime + 0.3);
        };
        
        beat(); // Premier battement
        setTimeout(beat, 200); // Second battement (ba-boum)
      }
    };
  }

  createChuckleSound() {
    return {
      play: () => {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Série de notes descendantes (rire sarcastique)
        const notes = [400, 380, 360, 340, 320];
        notes.forEach((freq, i) => {
          setTimeout(() => {
            const osc = audioCtx.createOscillator();
            osc.type = 'triangle';
            osc.frequency.value = freq;
            
            const gainNode = audioCtx.createGain();
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
            
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc.start();
            osc.stop(audioCtx.currentTime + 0.2);
          }, i * 100);
        });
      }
    };
  }

  createSighSound() {
    return {
      play: () => {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const bufferSize = audioCtx.sampleRate * 0.8;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Souffle décroissant
        for (let i = 0; i < bufferSize; i++) {
          const envelope = Math.exp(-i / (bufferSize / 2));
          data[i] = (Math.random() * 2 - 1) * 0.2 * envelope;
        }
        
        const source = audioCtx.createBufferSource();
        source.buffer = buffer;
        
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 300;
        
        const gainNode = audioCtx.createGain();
        gainNode.gain.value = 0.25;
        
        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        source.start();
      }
    };
  }

  createCorruptionSound() {
    return {
      play: () => {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        osc.type = 'sawtooth';
        
        // Montée de fréquence (sensation d'oppression)
        osc.frequency.setValueAtTime(60, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 1.5);
        
        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.5);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 1.5);
      }
    };
  }

  createSoulBindSound() {
    return {
      play: () => {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Accord dissonant (malaise)
        const freqs = [220, 233, 247]; // Notes dissonantes
        freqs.forEach(freq => {
          const osc = audioCtx.createOscillator();
          osc.type = 'triangle';
          osc.frequency.value = freq;
          
          const gainNode = audioCtx.createGain();
          gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.3);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 2);
          
          osc.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          
          osc.start();
          osc.stop(audioCtx.currentTime + 2);
        });
      }
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // TYPES DE PACTES
  // ═══════════════════════════════════════════════════════════════

  // ═══════════════════════════════════════════════════════════════
  // DIALOGUES PROGRESSIFS (40+ phrases variées)
  // ═══════════════════════════════════════════════════════════════

  getProgressiveDialogues() {
    return {
      // Phase 1 : Début de signature (0-25%)
      start: [
        "Continue... c'est bien...",
        "Ah, tu commences enfin.",
        "Doucement... ne te précipite pas.",
        "Ta main tremble ? Charmant.",
        "Oui... OUI... comme ça.",
        "Je sens ton hésitation. Délicieux.",
        "Prends ton temps. L'éternité m'attend.",
        "Première goutte de sang. Parfait.",
        "Tu as le choix, tu sais. Mais tu signes quand même.",
        "Tellement prévisible, les mortels.",
        "Je parie que tu penses encore pouvoir arrêter.",
        "Chaque seconde te rapproche de moi.",
        "Sens-tu le poids du destin ?",
        "Ta signature n'est qu'un début.",
        "Les dieux observaient aussi... avant de mourir."
      ],

      // Phase 2 : Mi-parcours (25-50%)
      middle: [
        "À mi-chemin. Trop tard pour reculer maintenant.",
        "Continue ! Ne faiblis pas !",
        "Tu y es presque... presque...",
        "Sens-tu la corruption monter ?",
        "Encore un peu... juste un peu...",
        "Ta volonté s'effrite. Magnifique.",
        "Pourquoi hésiter ? Tu as déjà perdu.",
        "Les faibles s'arrêtent ici. Mais toi ?",
        "Je sens ton cœur battre plus vite.",
        "Chaque seconde te transforme.",
        "Le sang coule bien, n'est-ce pas ?",
        "Tu crois contrôler ce pacte ? Adorable.",
        "Mi-chemin vers l'inévitable.",
        "Encore... ENCORE !",
        "Ne me déçois pas maintenant."
      ],

      // Phase 3 : Presque fini (50-75%)
      almostDone: [
        "PRESQUE ! Ne t'arrête pas !",
        "Tu y es ! Continue !",
        "Oui... OUI... PRESQUE !",
        "Quelques secondes encore !",
        "Je le sens... tu vas signer !",
        "Ton âme est si proche...",
        "La fin approche. Ou le début ?",
        "Tu ne peux plus t'arrêter.",
        "Sens-tu le pouvoir ?",
        "C'est PRESQUE toi maintenant !",
        "Derniers instants d'humanité...",
        "Bientôt, tu seras mien.",
        "Ta signature brûle le parchemin !",
        "CONTINUE ! NE LÂCHE PAS !",
        "Je t'attendais depuis si longtemps..."
      ],

      // Phase 4 : Derniers instants (75-99%)
      finalMoments: [
        "OUI ! OUI ! ENCORE !",
        "SIGNE ! SIGNE ! SIGNE !",
        "C'EST PRESQUE FINI !",
        "UN PEU PLUS !",
        "DERNIER EFFORT !",
        "TU Y ES ! TU Y ES !",
        "JE LE SENS ! JE TE SENS !",
        "PARFAIT ! PARFAIIIT !",
        "NE T'ARRÊTE PAS MAINTENANT !",
        "TA SIGNATURE EST MAGNIFIQUE !",
        "DERNIÈRE GOUTTE DE SANG !",
        "OUI OUI OUI OUI OUI !"
      ]
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // TYPES DE PACTES
  // ═══════════════════════════════════════════════════════════════

  getPactTypes() {
    return {
      REROLL: {
        id: 'REROLL',
        name: 'Pacte du Second Souffle',
        icon: '🔄',
        description: 'Relance le dé une fois. Le Destin te donne une seconde chance.',
        flavorText: '"Tu hésites ? Comme c\'est... humain. Je t\'offre un reroll. Gratuitement ? Non, bien sûr que non."',
        corruption: 5,
        benefit: 'Relance le dé et garde le meilleur résultat',
        cost: '+5% Corruption',
        rarity: 'common',
        diceDialogue: {
          offer: [
            'Un reroll ? Pourquoi pas. Après tout, le hasard est mon domaine...',
            'Tu veux une seconde chance ? Tout a un prix, Pactisé.',
            'Rejouer le coup ? Tellement humain. Tellement pathétique. Signons.',
            'Le Destin te déplaît ? On peut arranger ça... contre un petit service.',
            'Ah, tu crois au "essai gratuit" ? Quelle naïveté adorable.'
          ],
          complete: [
            'Voilà. Tu vois ? Facile. Presque trop facile.',
            'Excellent. Ton premier pas vers moi. Il y en aura d\'autres.',
            'Parfait. Le reroll est tien. Et moi... un peu plus de toi.',
            'Tu sens la différence ? Moi oui. Tu m\'appartiens un peu plus.',
            'Facile, n\'est-ce pas ? La prochaine fois sera encore plus simple.'
          ]
        }
      },

      GUARANTEED_SIX: {
        id: 'GUARANTEED_SIX',
        name: 'Pacte de la Perfection Assurée',
        icon: '⚡',
        description: 'Garantit un résultat de 6 sur le prochain lancer.',
        flavorText: '"Tu veux contrôler le chaos ? Ambitieux. Mais tout contrôle a un prix. Ton âme, par exemple."',
        corruption: 15,
        benefit: 'Prochain lancer = 6 garanti',
        cost: '+15% Corruption',
        rarity: 'rare',
        diceDialogue: {
          offer: [
            'Un six parfait. J\'admire l\'audace. Mais es-tu prêt à payer ?',
            'Forcer le Destin ? Oh, j\'adore les ambitieux. Ils tombent de plus haut.',
            'Tu veux CONTRÔLER le chaos ? Thalys rirait. Enfin... je ris déjà.',
            'La perfection garantie. Le rêve mortel. Ton cauchemar éternel.',
            'Un six... ou ton sixième pas vers la damnation ? Les deux !'
          ],
          complete: [
            'Excellent. Tu deviens... prévisible. J\'adore ça.',
            'Ton six t\'attend. Et moi... je t\'attends aussi.',
            'Voilà. Le contrôle. L\'illusion parfaite. Profite bien.',
            'Tu sens le pouvoir ? Moi je sens ta corruption monter. Délicieux.',
            'Parfait. Littéralement. Maintenant tu m\'appartiens un peu plus.'
          ]
        }
      },

      MOMENTUM_BOOST: {
        id: 'MOMENTUM_BOOST',
        name: 'Pacte du Momentum Éternel',
        icon: '⚡',
        description: '+2 Momentum immédiatement. Prolonge ton élan.',
        flavorText: '"Le momentum est une illusion. Mais si tu veux croire en cette illusion... signons."',
        corruption: 8,
        benefit: '+2 Momentum instantané',
        cost: '+8% Corruption',
        rarity: 'uncommon',
        diceDialogue: {
          offer: [
            'Deux momentum. Pas mal. Tu apprends.',
            'L\'élan éternel ? Rien n\'est éternel. Sauf moi.',
            'Tu veux de la vitesse ? Je peux t\'en donner. Contre... oh, tu sais.',
            'Momentum gratuit ! Enfin... si on ignore le prix de ton âme.',
            'Plus vite ! Plus fort ! Plus corrompu ! Ah, le progrès.'
          ],
          complete: [
            'Et voilà. Sensation de puissance ? Profite, ça ne dure pas.',
            'Deux momentum. Facile. Trop facile. Suspects ? Tu devrais.',
            'Rapide et corrompu. Mon type de Pactisé préféré.',
            'Voilà ton élan. Utilise-le bien... avant que je le reprenne.',
            'Momentum acquis. Humanité perdue. Échange équitable !'
          ]
        }
      },

      DARK_BLESSING: {
        id: 'DARK_BLESSING',
        name: 'Bénédiction Profanée',
        icon: '🌑',
        description: '+10% dégâts, +10% HP, mais chemins corrompus débloqués.',
        flavorText: '"Laisse la corruption te renforcer. Les faibles la craignent. Les forts l\'embrassent."',
        corruption: 20,
        benefit: '+10% ATK/HP permanent, débloque chemins fantômes',
        cost: '+20% Corruption, chemins dangereux accessibles',
        rarity: 'epic',
        diceDialogue: {
          offer: [
            'Tu veux de la puissance ? Vraie puissance ? Alors signe. Ne réfléchis pas.',
            'Les faibles prient les dieux. Les forts signent avec moi.',
            'Bénédiction profanée. Oxymore charmant. Tout comme "liberté contrainte".',
            'Embrasse l\'obscurité. Elle te rendra fort. Et mien.',
            'Les chemins cachés s\'ouvriront. Avec leurs horreurs. Amusant, non ?'
          ],
          complete: [
            'Bienvenue dans l\'obscurité, Pactisé. Tu es des nôtres maintenant.',
            'Tu es FORT maintenant. Corrompu, mais fort. Ironie cosmique.',
            'Sens-tu la puissance ? Sens-tu les murmures ? Parfait.',
            'Les chemins fantômes t\'appellent. Va. Découvre ce qui t\'attend.',
            'Bénédiction accordée. Humanité révoquée. Affaire conclue !'
          ]
        }
      },

      INEVITABLE_FATE: {
        id: 'INEVITABLE_FATE',
        name: 'Le Pacte du Destin Inévitable',
        icon: '💀',
        description: 'Vois l\'avenir. Choisis ton prochain résultat de dé. Mais le Dé se souviendra.',
        flavorText: '"Tu veux VOIR l\'avenir ? Soit. Mais attention : regarder le Destin... c\'est le laisser te regarder."',
        corruption: 25,
        benefit: 'Choisis n\'importe quel résultat (1-6) pour le prochain lancer',
        cost: '+25% Corruption, ???',
        rarity: 'legendary',
        diceDialogue: {
          offer: [
            'Choisir ton destin. L\'hubris ultime. Je vais adorer te voir tomber.',
            'Vyr s\'est crevé les yeux pour ne plus voir. Toi, tu VEUX voir ? Fou.',
            'Le Destin Inévitable. Redondance savoureuse. Comme "mort vivant".',
            'Tu veux contrôler l\'incontrôlable ? Thalys approuverait. Ou rirait.',
            'Voir l\'avenir, c\'est renoncer au présent. Mais signe quand même.'
          ],
          complete: [
            'Parfait. Tu as scellé ton destin. Ironique, n\'est-ce pas ?',
            'L\'avenir t\'appartient. Ton âme m\'appartient. Qui a gagné ?',
            'Félicitations. Tu peux choisir comment mourir. Progrès !',
            'Le Destin est tien. Pour l\'instant. Je reprends tout, toujours.',
            'Tu as vu l\'avenir. Maintenant il t\'a vu. Dors bien ce soir.'
          ]
        }
      }
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // OUVERTURE DE MODAL DE PACTE
  // ═══════════════════════════════════════════════════════════════

  async offerPact(pactType, context = {}) {
    const pactData = this.getPactTypes()[pactType];
    if (!pactData) {
      console.error(`Pacte inconnu: ${pactType}`);
      return null;
    }

    this.currentPact = {
      ...pactData,
      context,
      timestamp: Date.now()
    };

    // Créer la modal
    this.createPactModal();

    // Jouer sons d'ambiance
    this.audio.whisper.play();
    setTimeout(() => this.audio.heartbeat.play(), 500);

    // Dialogue du Dé (voix off) - Choisir aléatoirement parmi les phrases
    const offerDialogues = Array.isArray(pactData.diceDialogue.offer) 
      ? pactData.diceDialogue.offer 
      : [pactData.diceDialogue.offer];
    const randomOffer = offerDialogues[Math.floor(Math.random() * offerDialogues.length)];
    await this.diceSpeak(randomOffer, 2000);

    return new Promise((resolve) => {
      this.pactResolve = resolve;
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // CRÉATION DE LA MODAL (HTML/CSS)
  // ═══════════════════════════════════════════════════════════════

  createPactModal() {
    // Supprimer modal existante
    const existing = document.getElementById('bloodPactModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'bloodPactModal';
    modal.className = 'blood-pact-modal';
    
    modal.innerHTML = `
      <div class="pact-backdrop"></div>
      
      <div class="pact-container">
        <!-- Parchemin ancien -->
        <div class="parchment">
          <!-- Overlay de texture -->
          <div class="parchment-overlay"></div>
          
          <!-- Sceau de cire cassé -->
          <div class="wax-seal"></div>
          
          <!-- Taches de sang -->
          <div class="blood-stain blood-stain-1"></div>
          <div class="blood-stain blood-stain-2"></div>
          <div class="blood-stain blood-stain-3"></div>
          
          <!-- Texte du pacte -->
          <div class="pact-header">
            <div class="pact-icon">${this.currentPact.icon}</div>
            <h2 class="pact-title">${this.currentPact.name}</h2>
            <div class="pact-rarity pact-rarity-${this.currentPact.rarity}">
              ${this.currentPact.rarity.toUpperCase()}
            </div>
          </div>

          <div class="pact-content">
            <p class="pact-description">${this.currentPact.description}</p>
            
            <div class="pact-flavor">
              <em>${this.currentPact.flavorText}</em>
            </div>

            <div class="pact-terms">
              <div class="term-benefit">
                <strong>✨ Bénéfice :</strong> ${this.currentPact.benefit}
              </div>
              <div class="term-cost">
                <strong>💀 Prix :</strong> ${this.currentPact.cost}
              </div>
            </div>

            <!-- Zone de signature -->
            <div class="signature-zone" id="signatureZone">
              <div class="signature-instructions">
                Maintiens pour signer en sang...
              </div>
              
              <div class="signature-progress-container">
                <div class="signature-progress" id="signatureProgress"></div>
              </div>

              <div class="signature-line"></div>
              
              <canvas id="signatureCanvas" width="400" height="100"></canvas>
            </div>

            <!-- Dialogue du Dé -->
            <div class="dice-dialogue" id="diceDialogue"></div>
          </div>

          <!-- Boutons -->
          <div class="pact-actions">
            <button class="btn-refuse" id="btnRefuse">
              🚪 Refuser (Aucun coût)
            </button>
            <button class="btn-negotiate" id="btnNegotiate" style="display: none;">
              🤝 Négocier (-5% Corruption)
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // ✅ INJECTION DU DÉ APRÈS UN DÉLAI (failsafe)
    setTimeout(() => {
      this.injectDice3D();
    }, 100);

    // Ajouter les styles
    this.injectPactStyles();

    // Setup interactions
    this.setupSignature();
    this.setupButtons();

    // Animation d'entrée
    requestAnimationFrame(() => {
      modal.classList.add('active');
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // INJECTION DU DÉ 3D (SÉPARÉE POUR ÉVITER LES CONFLITS)
  // ═══════════════════════════════════════════════════════════════

  injectDice3D() {
    // Supprimer dé existant
    const existingDice = document.getElementById('bloodPactDice');
    if (existingDice) existingDice.remove();

    // Créer conteneur dé
    const diceContainer = document.createElement('div');
    diceContainer.id = 'bloodPactDice';
    diceContainer.style.cssText = `
      position: fixed !important;
      bottom: 200px !important;
      right: 280px !important;
      width: 160px !important;
      height: 160px !important;
      perspective: 800px !important;
      z-index: 99999 !important;
      pointer-events: none !important;
    `;

    // Créer cube 3D
    const diceCube = document.createElement('div');
    diceCube.style.cssText = `
      position: relative !important;
      width: 160px !important;
      height: 160px !important;
      transform-style: preserve-3d !important;
      animation: diceRotate3D 8s linear infinite !important;
    `;

    // Créer les 6 faces
    const faces = [
      { name: 'front', value: '6', transform: 'rotateY(0deg) translateZ(80px)' },
      { name: 'back', value: '1', transform: 'rotateY(180deg) translateZ(80px)' },
      { name: 'right', value: '3', transform: 'rotateY(90deg) translateZ(80px)' },
      { name: 'left', value: '4', transform: 'rotateY(-90deg) translateZ(80px)' },
      { name: 'top', value: '5', transform: 'rotateX(90deg) translateZ(80px)' },
      { name: 'bottom', value: '2', transform: 'rotateX(-90deg) translateZ(80px)' }
    ];

    faces.forEach(face => {
      const faceEl = document.createElement('div');
      faceEl.className = `dice-face ${face.name}`;
      faceEl.textContent = face.value;
      faceEl.style.cssText = `
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 160px !important;
        height: 160px !important;
        background: linear-gradient(135deg, #e8dcc8 0%, #d4c4a8 50%, #baa88a 100%) !important;
        border: 3px solid rgba(100, 80, 60, 0.8) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 4em !important;
        font-weight: bold !important;
        color: #3d2817 !important;
        text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5) !important;
        box-shadow: 
          inset 0 4px 10px rgba(0, 0, 0, 0.4),
          inset 0 -3px 6px rgba(255, 255, 255, 0.15),
          0 10px 25px rgba(0, 0, 0, 0.6) !important;
        backface-visibility: hidden !important;
        -webkit-backface-visibility: hidden !important;
        transform: ${face.transform} !important;
      `;
      diceCube.appendChild(faceEl);
    });

    // Ajouter lueur
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: absolute !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      width: 200px !important;
      height: 200px !important;
      background: radial-gradient(circle, rgba(212, 175, 55, 0.4) 0%, transparent 70%) !important;
      animation: glowPulseOppressive 2.5s ease-in-out infinite !important;
      pointer-events: none !important;
      z-index: -1 !important;
    `;
    diceCube.appendChild(glow);

    diceContainer.appendChild(diceCube);
    
    // ✅ INJECTER EN DERNIER DANS LE BODY (au-dessus de tout)
    document.body.appendChild(diceContainer);

    console.log('✅ Dé 3D injecté avec z-index 99999');
    console.log('   Position:', diceContainer.style.position);
    console.log('   Z-index:', diceContainer.style.zIndex);
  }

  // ═══════════════════════════════════════════════════════════════
  // SYSTÈME DE SIGNATURE INTERACTIF
  // ═══════════════════════════════════════════════════════════════

  setupSignature() {
    const zone = document.getElementById('signatureZone');
    const progress = document.getElementById('signatureProgress');
    const canvas = document.getElementById('signatureCanvas');
    const ctx = canvas.getContext('2d');

    let isHolding = false;
    let startTime = 0;
    let animFrame = null;
    let whisperSource = null;
    let lastDialoguePhase = null;

    // Dialogues progressifs
    const progressDialogues = this.getProgressiveDialogues();

    // Événements tactiles + souris
    const startSigning = (e) => {
      e.preventDefault();
      isHolding = true;
      startTime = Date.now();
      this.signProgress = 0;
      lastDialoguePhase = null;

      zone.classList.add('signing');

      // Sons
      whisperSource = this.audio.whisper.play();
      this.audio.heartbeat.play();

      // Animation de progression
      const updateProgress = () => {
        if (!isHolding) return;

        const elapsed = Date.now() - startTime;
        this.signProgress = Math.min(elapsed / this.config.signDuration, 1);

        // Mise à jour visuelle
        progress.style.width = `${this.signProgress * 100}%`;

        // Effets sonores progressifs
        if (this.signProgress > 0.3 && Math.random() < 0.1) {
          this.audio.quillScratch.play();
        }

        if (this.signProgress > 0.6 && Math.random() < 0.05) {
          this.audio.bloodDrip.play();
        }

        // Signature de sang sur canvas
        this.drawBloodSignature(ctx, this.signProgress);

        // ═══════════════════════════════════════════════════════════
        // DIALOGUES PROGRESSIFS RANDOMISÉS (2 phrases uniquement)
        // ═══════════════════════════════════════════════════════════

        // Phase 1 : Mi-signature (30-40%)
        if (this.signProgress > 0.30 && this.signProgress < 0.40 && lastDialoguePhase !== 'middle') {
          lastDialoguePhase = 'middle';
          const randomDialogue = progressDialogues.middle[Math.floor(Math.random() * progressDialogues.middle.length)];
          this.diceSpeak(randomDialogue, 3000); // 3 secondes pour lire
        }

        // Phase 2 : Fin proche (70-80%)
        if (this.signProgress > 0.70 && this.signProgress < 0.80 && lastDialoguePhase !== 'almostDone') {
          lastDialoguePhase = 'almostDone';
          const randomDialogue = progressDialogues.almostDone[Math.floor(Math.random() * progressDialogues.almostDone.length)];
          this.diceSpeak(randomDialogue, 2500); // 2.5 secondes pour lire
        }

        // Signature complète
        if (this.signProgress >= 1) {
          this.completePact();
          return;
        }

        animFrame = requestAnimationFrame(updateProgress);
      };

      updateProgress();
    };

    const stopSigning = (e) => {
      e.preventDefault();
      isHolding = false;
      zone.classList.remove('signing');

      if (whisperSource) {
        whisperSource.stop();
      }

      if (animFrame) {
        cancelAnimationFrame(animFrame);
      }

      // Si lâché trop tôt
      if (this.signProgress < 1 && this.signProgress > 0) {
        this.diceSpeak('Tu hésites ? Pathétique...', 1500);
        this.audio.diceSigh.play();
      }
    };

    // Desktop
    zone.addEventListener('mousedown', startSigning);
    zone.addEventListener('mouseup', stopSigning);
    zone.addEventListener('mouseleave', stopSigning);

    // Mobile
    zone.addEventListener('touchstart', startSigning);
    zone.addEventListener('touchend', stopSigning);
    zone.addEventListener('touchcancel', stopSigning);
  }

  drawBloodSignature(ctx, progress) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    // Ligne de signature en sang (sinueuse)
    if (progress > 0) {
      const x = progress * width;
      const y = height / 2 + Math.sin(progress * 10) * 10;

      ctx.strokeStyle = `rgba(139, 0, 0, ${progress})`;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';

      if (progress > 0.01) {
        const prevX = (progress - 0.01) * width;
        const prevY = height / 2 + Math.sin((progress - 0.01) * 10) * 10;
        
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      // Gouttes de sang aléatoires
      if (Math.random() < 0.1) {
        ctx.fillStyle = `rgba(139, 0, 0, ${0.6 + Math.random() * 0.4})`;
        ctx.beginPath();
        ctx.arc(x + (Math.random() - 0.5) * 20, y + 10 + Math.random() * 20, 2 + Math.random() * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // COMPLÉTION DU PACTE
  // ═══════════════════════════════════════════════════════════════

  async completePact() {
    const zone = document.getElementById('signatureZone');
    zone.classList.add('complete');

    // Sons de finalisation
    this.audio.soulBind.play();
    setTimeout(() => this.audio.corruption.play(), 300);

    // VFX : Parchemin qui brûle
    this.burnParchment();

    // Dialogue final du Dé (randomisé)
    const completeDialogues = Array.isArray(this.currentPact.diceDialogue.complete)
      ? this.currentPact.diceDialogue.complete
      : [this.currentPact.diceDialogue.complete];
    const randomComplete = completeDialogues[Math.floor(Math.random() * completeDialogues.length)];
    await this.diceSpeak(randomComplete, 2000);
    this.audio.diceChuckle.play();

    // Appliquer les effets
    this.applyPactEffects();

    // Sauvegarder dans l'historique
    this.pactHistory.push({
      ...this.currentPact,
      signedAt: Date.now()
    });

    // Résoudre la promesse
    if (this.pactResolve) {
      this.pactResolve({
        accepted: true,
        pact: this.currentPact
      });
    }

    // Fermer après 3 secondes
    setTimeout(() => {
      this.closePactModal();
    }, 3000);
  }

  applyPactEffects() {
    const player = this.game.player;

    // Augmenter corruption
    player.corruption = Math.min(100, player.corruption + this.currentPact.corruption);

    // Appliquer les bénéfices selon le type
    switch (this.currentPact.id) {
      case 'REROLL':
        player.rerollsAvailable = (player.rerollsAvailable || 0) + 1;
        break;

      case 'GUARANTEED_SIX':
        player.nextRollForced = 6;
        break;

      case 'MOMENTUM_BOOST':
        player.momentum = Math.min(3, player.momentum + 2);
        break;

      case 'DARK_BLESSING':
        player.atkBonus = (player.atkBonus || 0) + 10;
        player.hpBonus = (player.hpBonus || 0) + 10;
        player.phantomPathsUnlocked = true;
        break;

      case 'INEVITABLE_FATE':
        // Modal de choix de résultat (sera implémentée)
        player.canChooseFate = true;
        break;
    }

    // Événement global pour notifier le système
    window.dispatchEvent(new CustomEvent('pactSigned', {
      detail: {
        pactId: this.currentPact.id,
        corruption: player.corruption,
        timestamp: Date.now()
      }
    }));

    console.log(`🩸 Pacte signé: ${this.currentPact.name}`);
    console.log(`  Corruption: ${player.corruption}%`);
  }

  // ═══════════════════════════════════════════════════════════════
  // VFX : PARCHEMIN QUI BRÛLE
  // ═══════════════════════════════════════════════════════════════

  burnParchment() {
    const parchment = document.querySelector('.parchment');
    if (!parchment) return;

    // Ajouter classe de combustion
    parchment.classList.add('burning');

    // Particules de feu
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = 'fire-particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 0.5}s`;
        parchment.appendChild(particle);

        setTimeout(() => particle.remove(), 2000);
      }, i * 50);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // DIALOGUE DU DÉ (Speech bubble)
  // ═══════════════════════════════════════════════════════════════

  async diceSpeak(text, duration = 3000) {
    const dialogueEl = document.getElementById('diceDialogue');
    if (!dialogueEl) return;

    dialogueEl.textContent = text;
    dialogueEl.classList.add('active');

    // Effet typewriter optionnel désactivé pour meilleure lisibilité

    return new Promise(resolve => {
      setTimeout(() => {
        dialogueEl.classList.remove('active');
        resolve();
      }, duration);
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // BOUTONS (Refuser, Négocier)
  // ═══════════════════════════════════════════════════════════════

  setupButtons() {
    const btnRefuse = document.getElementById('btnRefuse');
    const btnNegotiate = document.getElementById('btnNegotiate');

    if (btnRefuse) {
      btnRefuse.onclick = () => {
        this.refusePact();
      };
    }

    if (btnNegotiate) {
      btnNegotiate.onclick = () => {
        this.negotiatePact();
      };
    }
  }

  refusePact() {
    this.audio.diceSigh.play();
    this.diceSpeak('Tu refuses ? Dommage. Mais tu reviendras. Ils reviennent toujours...', 2000);

    if (this.pactResolve) {
      this.pactResolve({
        accepted: false,
        refused: true
      });
    }

    setTimeout(() => {
      this.closePactModal();
    }, 2000);
  }

  negotiatePact() {
    // Négociation : réduit corruption mais augmente autre coût
    this.currentPact.corruption = Math.max(0, this.currentPact.corruption - 5);
    
    this.diceSpeak('Négocier ? Très bien. Mais je prendrai autre chose...', 2000);
    this.audio.diceChuckle.play();

    // Mise à jour UI
    document.querySelector('.term-cost').innerHTML = `<strong>💀 Prix :</strong> ${this.currentPact.cost} <em>(Négocié)</em>`;
    
    // Désactiver bouton
    document.getElementById('btnNegotiate').disabled = true;
  }

  closePactModal() {
    const modal = document.getElementById('bloodPactModal');
    if (modal) {
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 500);
    }
    
    // Supprimer le dé
    const dice = document.getElementById('bloodPactDice');
    if (dice) dice.remove();
    
    this.isModalOpen = false;
    this.currentPact = null;
  }

  // ═══════════════════════════════════════════════════════════════
  // STYLES CSS INJECTÉS
  // ═══════════════════════════════════════════════════════════════

  injectPactStyles() {
    // ✅ ON GARDE L'INJECTION pour que ça fonctionne immédiatement
    // TODO: Migrer vers css/blood-pact.css plus tard
    if (document.getElementById('bloodPactStyles')) return;

    const style = document.createElement('style');
    style.id = 'bloodPactStyles';
    style.textContent = `
      /* ════════════════════════════════════════════ */
      /* BLOOD PACT MODAL */
      /* ════════════════════════════════════════════ */

      .blood-pact-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9998;
        opacity: 0;
        transition: opacity 0.5s ease;
        pointer-events: none;
      }

      .blood-pact-modal.active {
        opacity: 1;
        pointer-events: all;
      }

      .blood-pact-modal.active .pact-backdrop,
      .blood-pact-modal.active .pact-container {
        pointer-events: all;
      }

      .pact-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at center, rgba(0, 0, 0, 0.8) 0%, rgba(10, 0, 0, 0.95) 100%);
        animation: backdropPulse 4s ease-in-out infinite;
        z-index: 1;
        pointer-events: none;
      }

      @keyframes backdropPulse {
        0%, 100% { opacity: 0.95; }
        50% { opacity: 1; }
      }

      .pact-container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.9);
        transition: transform 0.5s ease;
        z-index: 2;
      }

      .blood-pact-modal.active .pact-container {
        transform: translate(-50%, -50%) scale(1);
      }

      /* ════════════════════════════════════════════ */
      /* PARCHEMIN ANCIEN */
      /* ════════════════════════════════════════════ */

      .parchment {
        position: relative;
        width: 800px;
        max-width: 90vw;
        min-height: 600px;
        background: 
          /* Texture papier ancien */
          radial-gradient(ellipse at 20% 30%, rgba(205, 180, 145, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 70%, rgba(160, 130, 90, 0.1) 0%, transparent 50%),
          /* Taches d'âge */
          radial-gradient(circle at 15% 15%, rgba(139, 69, 19, 0.2) 0%, transparent 3%),
          radial-gradient(circle at 85% 85%, rgba(139, 69, 19, 0.15) 0%, transparent 4%),
          radial-gradient(circle at 50% 50%, rgba(120, 80, 40, 0.1) 0%, transparent 8%),
          /* Trous/déchirures (petites taches sombres) */
          radial-gradient(circle at 92% 12%, rgba(0, 0, 0, 0.4) 0%, transparent 0.5%),
          radial-gradient(circle at 8% 88%, rgba(0, 0, 0, 0.3) 0%, transparent 0.7%),
          radial-gradient(circle at 95% 75%, rgba(0, 0, 0, 0.2) 0%, transparent 0.4%),
          /* Base parchemin */
          linear-gradient(
            180deg,
            #d4c5a0 0%,
            #c9b896 20%,
            #b8a888 40%,
            #a89777 60%,
            #988668 80%,
            #887559 100%
          );
        border: none;
        border-radius: 0;
        padding: 60px 50px;
        box-shadow: 
          /* Ombres externes profondes */
          0 30px 80px rgba(0, 0, 0, 0.95),
          0 10px 30px rgba(0, 0, 0, 0.8),
          /* Bords déchirés */
          inset 0 2px 0 rgba(255, 255, 255, 0.1),
          inset 0 -2px 0 rgba(0, 0, 0, 0.3),
          /* Ombres des pliures sur les côtés */
          inset 15px 0 20px -10px rgba(0, 0, 0, 0.15),
          inset -15px 0 20px -10px rgba(0, 0, 0, 0.15);
        font-family: 'Crimson Text', serif;
        color: #2a1810;
        overflow: visible;
        transform-origin: top center;
        animation: parchmentUnroll 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        transform: scaleY(0) rotateX(90deg);
      }

      /* Pliures latérales (effet roulé sur les côtés) */
      .parchment::before {
        content: '';
        position: absolute;
        top: 0;
        left: -20px;
        width: 25px;
        height: 100%;
        background: linear-gradient(90deg, 
          rgba(120, 100, 70, 0.8) 0%,
          rgba(140, 115, 85, 0.9) 30%,
          rgba(180, 150, 120, 0.6) 100%
        );
        box-shadow: 
          inset -5px 0 10px rgba(0, 0, 0, 0.4),
          3px 0 8px rgba(0, 0, 0, 0.3);
        border-radius: 8px 0 0 8px;
        transform: perspective(400px) rotateY(-45deg);
        transform-origin: right center;
        z-index: -1;
      }

      .parchment::after {
        content: '';
        position: absolute;
        top: 0;
        right: -20px;
        width: 25px;
        height: 100%;
        background: linear-gradient(90deg, 
          rgba(180, 150, 120, 0.6) 0%,
          rgba(140, 115, 85, 0.9) 70%,
          rgba(120, 100, 70, 0.8) 100%
        );
        box-shadow: 
          inset 5px 0 10px rgba(0, 0, 0, 0.4),
          -3px 0 8px rgba(0, 0, 0, 0.3);
        border-radius: 0 8px 8px 0;
        transform: perspective(400px) rotateY(45deg);
        transform-origin: left center;
        z-index: -1;
      }

      @keyframes parchmentUnroll {
        0% {
          transform: scaleY(0) rotateX(90deg);
          opacity: 0;
        }
        40% {
          transform: scaleY(0.4) rotateX(45deg);
          opacity: 0.5;
        }
        70% {
          transform: scaleY(0.9) rotateX(5deg);
          opacity: 0.9;
        }
        85% {
          transform: scaleY(1.02) rotateX(-2deg);
          opacity: 1;
        }
        100% {
          transform: scaleY(1) rotateX(0deg);
          opacity: 1;
        }
      }

      /* Sceau de cire rouge (cassé) */
      .parchment .wax-seal {
        position: absolute;
        bottom: 30px;
        right: 50px;
        width: 70px;
        height: 70px;
        background: radial-gradient(circle, #8b1a1a 0%, #6d0d0d 60%, #4a0808 100%);
        border-radius: 50%;
        box-shadow: 
          inset 0 3px 8px rgba(0, 0, 0, 0.6),
          inset 0 -2px 5px rgba(255, 100, 100, 0.2),
          0 5px 15px rgba(139, 26, 26, 0.6);
        opacity: 0;
        animation: sealAppear 0.6s ease-out 2.2s forwards;
        z-index: 10;
      }

      @keyframes sealAppear {
        0% { opacity: 0; transform: scale(0.3) rotate(-45deg); }
        60% { opacity: 1; transform: scale(1.1) rotate(5deg); }
        100% { opacity: 1; transform: scale(1) rotate(0deg); }
      }

      /* Texture du sceau */
      .parchment .wax-seal::before {
        content: '☠';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2em;
        color: rgba(0, 0, 0, 0.6);
        text-shadow: 0 1px 2px rgba(255, 100, 100, 0.3);
      }

      /* Fissure dans le sceau */
      .parchment .wax-seal::after {
        content: '';
        position: absolute;
        top: 15%;
        left: 30%;
        width: 2px;
        height: 70%;
        background: linear-gradient(180deg, 
          transparent 0%,
          rgba(0, 0, 0, 0.8) 20%,
          rgba(0, 0, 0, 0.8) 80%,
          transparent 100%
        );
        transform: rotate(-25deg);
        box-shadow: 1px 0 2px rgba(0, 0, 0, 0.5);
      }

      /* Lignes d'écriture + bords déchirés */
      .parchment-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: 
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 28px,
            rgba(139, 69, 19, 0.08) 28px,
            rgba(139, 69, 19, 0.08) 29px
          );
        pointer-events: none;
        opacity: 0.6;
      }

      /* Taches de sang (sang séché sur parchemin ancien) */
      .blood-stain {
        position: absolute;
        background: radial-gradient(
          ellipse at center, 
          rgba(80, 20, 15, 0.8) 0%, 
          rgba(100, 30, 20, 0.6) 30%,
          rgba(60, 15, 10, 0.4) 60%,
          transparent 100%
        );
        border-radius: 50%;
        pointer-events: none;
        opacity: 0.9;
        mix-blend-mode: multiply;
        animation: bloodStainAppear 0.8s ease-out forwards;
        animation-delay: 1.2s;
        opacity: 0;
      }

      @keyframes bloodStainAppear {
        0% {
          opacity: 0;
          transform: scale(0.5);
        }
        50% {
          opacity: 1;
          transform: scale(1.1);
        }
        100% {
          opacity: 0.9;
          transform: scale(1);
        }
      }

      .blood-stain-1 {
        top: 8%;
        right: 12%;
        width: 90px;
        height: 100px;
        transform: rotate(-15deg);
        animation-delay: 1.3s;
      }

      .blood-stain-2 {
        bottom: 15%;
        left: 8%;
        width: 70px;
        height: 75px;
        transform: rotate(25deg);
        animation-delay: 1.5s;
      }

      .blood-stain-3 {
        top: 45%;
        left: 5%;
        width: 50px;
        height: 55px;
        transform: rotate(-8deg);
        animation-delay: 1.7s;
      }

      /* Empreinte digitale de sang (détail réaliste) */
      .blood-stain::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60%;
        height: 60%;
        background: 
          radial-gradient(circle at 30% 30%, transparent 40%, rgba(60, 15, 10, 0.3) 41%, transparent 42%),
          radial-gradient(circle at 70% 60%, transparent 35%, rgba(60, 15, 10, 0.3) 36%, transparent 37%);
        border-radius: 50%;
      }

      /* ════════════════════════════════════════════ */
      /* CONTENU DU PACTE */
      /* ════════════════════════════════════════════ */

      .pact-header {
        text-align: center;
        margin-bottom: 30px;
        border-bottom: 2px solid rgba(80, 50, 30, 0.5);
        padding-bottom: 20px;
        position: relative;
      }

      /* Ornements décoratifs gothiques */
      .pact-header::before,
      .pact-header::after {
        content: '⚜';
        position: absolute;
        bottom: -15px;
        font-size: 1.5em;
        color: rgba(80, 50, 30, 0.4);
      }

      .pact-header::before {
        left: 30%;
      }

      .pact-header::after {
        right: 30%;
      }

      .pact-icon {
        font-size: 4em;
        margin-bottom: 10px;
        filter: drop-shadow(0 3px 5px rgba(0, 0, 0, 0.4));
        animation: iconFloat 3s ease-in-out infinite;
        opacity: 0;
        animation: iconFloat 3s ease-in-out infinite, iconFadeIn 0.8s ease-out 1.4s forwards;
      }

      @keyframes iconFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }

      @keyframes iconFadeIn {
        from { opacity: 0; transform: scale(0.5) translateY(20px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
      }

      .pact-title {
        font-family: 'Cinzel', serif;
        font-size: 2.2em;
        color: #3d2817;
        text-shadow: 
          1px 1px 0 rgba(255, 255, 255, 0.3),
          0 2px 5px rgba(0, 0, 0, 0.3);
        margin: 10px 0;
        letter-spacing: 2px;
        opacity: 0;
        animation: titleFadeIn 0.8s ease-out 1.5s forwards;
      }

      @keyframes titleFadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .pact-rarity {
        display: inline-block;
        padding: 5px 15px;
        border-radius: 5px;
        font-size: 0.8em;
        font-weight: bold;
        letter-spacing: 2px;
      }

      .pact-rarity-common { background: rgba(128, 128, 128, 0.3); color: #999; }
      .pact-rarity-uncommon { background: rgba(0, 255, 0, 0.2); color: #0f0; }
      .pact-rarity-rare { background: rgba(0, 112, 221, 0.3); color: #4fc3f7; }
      .pact-rarity-epic { background: rgba(163, 53, 238, 0.3); color: #d896ff; }
      .pact-rarity-legendary { background: rgba(255, 128, 0, 0.3); color: #ff9800; }

      .pact-description {
        font-size: 1.2em;
        line-height: 1.8;
        margin-bottom: 20px;
        color: #3d2817;
        text-align: justify;
        opacity: 0;
        animation: textFadeIn 0.8s ease-out 1.6s forwards;
      }

      @keyframes textFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      .pact-flavor {
        font-size: 1.1em;
        color: #5a3825;
        font-style: italic;
        margin-bottom: 30px;
        padding: 20px;
        background: 
          linear-gradient(135deg, rgba(80, 50, 30, 0.15) 0%, rgba(60, 40, 25, 0.1) 100%);
        border-left: 4px solid rgba(80, 30, 20, 0.6);
        border-right: 1px solid rgba(80, 30, 20, 0.2);
        box-shadow: 
          inset 2px 2px 5px rgba(0, 0, 0, 0.1),
          inset -1px -1px 3px rgba(255, 255, 255, 0.05);
        position: relative;
        opacity: 0;
        animation: flavorFadeIn 0.8s ease-out 1.7s forwards;
      }

      @keyframes flavorFadeIn {
        from { opacity: 0; transform: translateX(-10px); }
        to { opacity: 1; transform: translateX(0); }
      }

      /* Citation visuelle */
      .pact-flavor::before {
        content: '"';
        position: absolute;
        top: -10px;
        left: 10px;
        font-size: 3em;
        color: rgba(80, 30, 20, 0.3);
        font-family: Georgia, serif;
      }

      .pact-flavor::after {
        content: '"';
        position: absolute;
        bottom: -25px;
        right: 10px;
        font-size: 3em;
        color: rgba(80, 30, 20, 0.3);
        font-family: Georgia, serif;
      }

      .pact-terms {
        margin-bottom: 30px;
      }

      .term-benefit,
      .term-cost {
        padding: 12px 15px;
        margin-bottom: 12px;
        background: rgba(255, 255, 255, 0.05);
        box-shadow: 
          inset 1px 1px 3px rgba(0, 0, 0, 0.2),
          1px 1px 0 rgba(255, 255, 255, 0.1);
        opacity: 0;
        animation: termsFadeIn 0.6s ease-out forwards;
      }

      .term-benefit {
        border-left: 4px solid rgba(60, 120, 60, 0.7);
        color: #4a7c4a;
        animation-delay: 1.8s;
      }

      .term-benefit strong {
        color: #3d6d3d;
      }

      .term-cost {
        border-left: 4px solid rgba(100, 30, 25, 0.8);
        color: #7d3530;
        animation-delay: 1.9s;
      }

      .term-cost strong {
        color: #5a2420;
      }

      @keyframes termsFadeIn {
        from { opacity: 0; transform: translateY(5px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* ════════════════════════════════════════════ */
      /* ZONE DE SIGNATURE */
      /* ════════════════════════════════════════════ */

      .signature-zone {
        position: relative;
        margin: 30px 0;
        padding: 35px;
        background: 
          /* Fond parchemin plus clair pour contraste */
          linear-gradient(135deg, rgba(220, 200, 170, 0.3) 0%, rgba(200, 180, 150, 0.2) 100%);
        border: 3px double rgba(80, 30, 20, 0.4);
        box-shadow: 
          inset 0 2px 10px rgba(0, 0, 0, 0.15),
          0 3px 8px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        transition: all 0.3s ease;
        user-select: none;
        opacity: 0;
        animation: signatureZoneFadeIn 0.8s ease-out 2s forwards;
      }

      @keyframes signatureZoneFadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }

      .signature-zone:hover {
        background: linear-gradient(135deg, rgba(220, 200, 170, 0.4) 0%, rgba(200, 180, 150, 0.3) 100%);
        border-color: rgba(100, 40, 30, 0.6);
        box-shadow: 
          inset 0 2px 15px rgba(0, 0, 0, 0.2),
          0 5px 15px rgba(0, 0, 0, 0.3);
      }

      .signature-zone.signing {
        background: 
          linear-gradient(135deg, rgba(180, 100, 90, 0.25) 0%, rgba(160, 80, 70, 0.2) 100%);
        border-color: rgba(100, 30, 25, 0.8);
        box-shadow: 
          inset 0 3px 20px rgba(100, 30, 25, 0.3),
          0 0 30px rgba(139, 0, 0, 0.5);
      }

      .signature-zone.complete {
        background: 
          linear-gradient(135deg, rgba(150, 70, 60, 0.4) 0%, rgba(120, 50, 45, 0.35) 100%);
        border-color: rgba(139, 0, 0, 0.9);
        animation: signatureComplete 1s ease forwards;
      }

      @keyframes signatureComplete {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); box-shadow: 0 0 50px rgba(255, 0, 0, 0.8); }
        100% { transform: scale(1); }
      }

      .signature-instructions {
        text-align: center;
        font-size: 1.15em;
        color: #5a3825;
        margin-bottom: 20px;
        transition: opacity 0.3s ease;
        font-family: 'Cinzel', serif;
        letter-spacing: 1px;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
      }

      .signature-zone.signing .signature-instructions {
        opacity: 0;
      }

      .signature-progress-container {
        position: relative;
        width: 100%;
        height: 10px;
        background: 
          linear-gradient(90deg, rgba(60, 30, 20, 0.3) 0%, rgba(80, 40, 30, 0.3) 100%);
        border: 1px solid rgba(80, 30, 20, 0.4);
        box-shadow: 
          inset 0 2px 5px rgba(0, 0, 0, 0.3),
          0 1px 0 rgba(255, 255, 255, 0.1);
        margin-bottom: 20px;
        overflow: hidden;
      }

      .signature-progress {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 0%;
        background: 
          linear-gradient(90deg, 
            rgba(80, 20, 15, 0.9) 0%, 
            rgba(120, 30, 25, 0.95) 50%, 
            rgba(80, 20, 15, 0.9) 100%
          );
        box-shadow: 
          0 0 10px rgba(100, 20, 15, 0.8),
          inset 0 1px 0 rgba(150, 50, 40, 0.5);
        transition: width 0.1s linear;
      }

      .signature-line {
        position: absolute;
        bottom: 50px;
        left: 30px;
        right: 30px;
        height: 1px;
        background: 
          linear-gradient(90deg, 
            transparent 0%, 
            rgba(80, 30, 20, 0.5) 10%, 
            rgba(80, 30, 20, 0.5) 90%, 
            transparent 100%
          );
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      }

      /* Petites marques de plume sur la ligne */
      .signature-line::before,
      .signature-line::after {
        content: '';
        position: absolute;
        width: 40px;
        height: 1px;
        background: rgba(80, 30, 20, 0.4);
        top: 0;
      }

      .signature-line::before {
        left: 20%;
        transform: rotate(-5deg);
      }

      .signature-line::after {
        right: 25%;
        transform: rotate(3deg);
      }

      #signatureCanvas {
        display: block;
        width: 100%;
        height: 100px;
        margin: 0 auto;
      }

      /* ════════════════════════════════════════════ */
      /* DIALOGUE DU DÉ */
      /* ════════════════════════════════════════════ */

      .dice-dialogue {
        position: relative;
        padding: 18px 25px;
        background: 
          linear-gradient(135deg, rgba(220, 200, 170, 0.25) 0%, rgba(200, 180, 150, 0.2) 100%);
        border: 2px solid rgba(80, 30, 20, 0.6);
        box-shadow: 
          inset 0 1px 3px rgba(255, 255, 255, 0.15),
          0 3px 8px rgba(0, 0, 0, 0.3);
        font-size: 1.2em;
        font-style: italic;
        font-weight: 600;
        color: #2a1810;
        text-align: center;
        margin-top: 25px;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.5s ease;
        text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.3);
      }

      .dice-dialogue.active {
        opacity: 1;
        transform: translateY(0);
      }

      .dice-dialogue::before {
        content: '"';
        font-size: 3.5em;
        position: absolute;
        top: -15px;
        left: 15px;
        color: rgba(80, 30, 20, 0.25);
        font-family: Georgia, serif;
      }

      .dice-dialogue::after {
        content: '"';
        font-size: 3.5em;
        position: absolute;
        bottom: -30px;
        right: 15px;
        color: rgba(80, 30, 20, 0.25);
        font-family: Georgia, serif;
      }

      /* ════════════════════════════════════════════ */
      /* BOUTONS */
      /* ════════════════════════════════════════════ */

      .pact-actions {
        display: flex;
        gap: 15px;
        margin-top: 30px;
      }

      .pact-actions button {
        flex: 1;
        padding: 15px 30px;
        border: 2px solid;
        border-radius: 8px;
        font-family: 'Cinzel', serif;
        font-size: 1.1em;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .btn-refuse {
        background: linear-gradient(135deg, #333 0%, #1a1a1a 100%);
        color: #999;
        border-color: #555;
      }

      .btn-refuse:hover {
        background: linear-gradient(135deg, #555 0%, #333 100%);
        color: #ccc;
        transform: translateY(-2px);
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
      }

      .btn-negotiate {
        background: linear-gradient(135deg, #8B4513 0%, #654321 100%);
        color: #d4af37;
        border-color: #8B4513;
      }

      .btn-negotiate:hover {
        background: linear-gradient(135deg, #A0522D 0%, #8B4513 100%);
        transform: translateY(-2px);
        box-shadow: 0 5px 20px rgba(139, 69, 19, 0.5);
      }

      .btn-negotiate:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* ════════════════════════════════════════════ */
      /* DÉ OBSERVATEUR (3D) - Version Oppressante */
      /* ════════════════════════════════════════════ */

      .dice-observer {
        position: fixed !important;
        bottom: 120px !important;
        right: 50px !important;
        width: 160px !important;
        height: 160px !important;
        perspective: 800px !important;
        perspective-origin: 50% 50% !important;
        z-index: 10001 !important;
        pointer-events: none !important;
      }

      .dice-3d {
        position: relative !important;
        width: 160px !important;
        height: 160px !important;
        transform-style: preserve-3d !important;
        animation: diceRotate3D 8s linear infinite !important;
        filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.8)) !important;
      }

      /* Rotation 3D simple et visible */
      @keyframes diceRotate3D {
        0% { 
          transform: rotateX(0deg) rotateY(0deg);
        }
        25% { 
          transform: rotateX(90deg) rotateY(90deg);
        }
        50% { 
          transform: rotateX(180deg) rotateY(180deg);
        }
        75% { 
          transform: rotateX(270deg) rotateY(270deg);
        }
        100% { 
          transform: rotateX(360deg) rotateY(360deg);
        }
      }

      /* Faces du dé (aspect osseux/usé) */
      .dice-face {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 160px !important;
        height: 160px !important;
        background: linear-gradient(135deg, #e8dcc8 0%, #d4c4a8 50%, #baa88a 100%) !important;
        border: 3px solid rgba(100, 80, 60, 0.8) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 4em !important;
        font-weight: bold !important;
        color: #3d2817 !important;
        text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.5) !important;
        box-shadow: 
          inset 0 4px 10px rgba(0, 0, 0, 0.4),
          inset 0 -3px 6px rgba(255, 255, 255, 0.15),
          0 10px 25px rgba(0, 0, 0, 0.6) !important;
        backface-visibility: hidden !important;
        -webkit-backface-visibility: hidden !important;
      }

      /* Fissures et usures sur les faces */
      .dice-face::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: 
          /* Fissures aléatoires */
          linear-gradient(45deg, transparent 48%, rgba(80, 60, 40, 0.3) 49%, transparent 50%),
          linear-gradient(135deg, transparent 65%, rgba(80, 60, 40, 0.2) 66%, transparent 67%),
          linear-gradient(225deg, transparent 30%, rgba(80, 60, 40, 0.15) 31%, transparent 32%);
        pointer-events: none;
      }

      /* Position des faces dans l'espace 3D */
      .dice-face.front  { 
        transform: rotateY(0deg) translateZ(80px) !important; 
      }
      .dice-face.back   { 
        transform: rotateY(180deg) translateZ(80px) !important; 
      }
      .dice-face.right  { 
        transform: rotateY(90deg) translateZ(80px) !important; 
      }
      .dice-face.left   { 
        transform: rotateY(-90deg) translateZ(80px) !important; 
      }
      .dice-face.top    { 
        transform: rotateX(90deg) translateZ(80px) !important; 
      }
      .dice-face.bottom { 
        transform: rotateX(-90deg) translateZ(80px) !important; 
      }

      /* Lueur sinistre (change selon corruption) */
      .dice-glow {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 200px;
        height: 200px;
        background: radial-gradient(circle, rgba(212, 175, 55, 0.4) 0%, transparent 70%);
        animation: glowPulseOppressive 2.5s ease-in-out infinite;
        pointer-events: none;
        z-index: -1;
      }

      @keyframes glowPulseOppressive {
        0%, 100% { 
          opacity: 0.5; 
          transform: translate(-50%, -50%) scale(0.9); 
        }
        50% { 
          opacity: 0.9; 
          transform: translate(-50%, -50%) scale(1.4); 
        }
      }

      /* Variation selon corruption du joueur */
      .dice-observer[data-corruption="low"] .dice-glow {
        background: radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%);
      }

      .dice-observer[data-corruption="medium"] .dice-glow {
        background: radial-gradient(circle, rgba(212, 100, 55, 0.4) 0%, transparent 70%);
      }

      .dice-observer[data-corruption="high"] .dice-glow {
        background: radial-gradient(circle, rgba(139, 0, 0, 0.5) 0%, transparent 70%);
        animation: glowPulseCorrupted 2s ease-in-out infinite;
      }

      @keyframes glowPulseCorrupted {
        0%, 100% { 
          opacity: 0.6; 
          transform: translate(-50%, -50%) scale(0.9); 
        }
        50% { 
          opacity: 1; 
          transform: translate(-50%, -50%) scale(1.4); 
          filter: blur(10px);
        }
      }

      /* Dé corrompu (texture changée) */
      .dice-observer[data-corruption="high"] .dice-face {
        background: 
          radial-gradient(ellipse at 30% 30%, rgba(180, 150, 140, 0.9) 0%, transparent 40%),
          linear-gradient(135deg, #9a7d6d 0%, #7a5d4d 50%, #5a3d2d 100%);
        border-color: rgba(80, 20, 20, 0.8);
        color: #6d1010;
        box-shadow: 
          inset 0 3px 8px rgba(139, 0, 0, 0.4),
          0 8px 25px rgba(139, 0, 0, 0.6);
      }

      /* ════════════════════════════════════════════ */
      /* VFX : PARCHEMIN QUI BRÛLE */
      /* ════════════════════════════════════════════ */

      .parchment.burning {
        animation: parchmentBurn 2.5s ease forwards;
      }

      @keyframes parchmentBurn {
        0% { 
          filter: brightness(1) sepia(0) contrast(1);
        }
        30% {
          filter: brightness(1.2) sepia(0.3) contrast(1.1);
        }
        60% {
          filter: brightness(0.8) sepia(0.7) contrast(1.2);
        }
        100% {
          filter: brightness(0.4) sepia(0.9) contrast(1.3);
          box-shadow: 
            0 30px 80px rgba(0, 0, 0, 0.95),
            inset 0 0 80px rgba(80, 20, 10, 0.6);
        }
      }

      .fire-particle {
        position: absolute;
        width: 8px;
        height: 8px;
        background: radial-gradient(circle, #ff6600 0%, #ff0000 50%, transparent 100%);
        border-radius: 50%;
        animation: fireRise 2s ease-out forwards;
        pointer-events: none;
      }

      @keyframes fireRise {
        0% {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
        100% {
          transform: translateY(-200px) scale(0.3);
          opacity: 0;
        }
      }

      /* ════════════════════════════════════════════ */
      /* RESPONSIVE */
      /* ════════════════════════════════════════════ */

      @media (max-width: 768px) {
        .parchment {
          width: 95vw;
          padding: 20px;
        }

        .pact-title {
          font-size: 1.5em;
        }

        .pact-actions {
          flex-direction: column;
        }

        .dice-observer {
          top: -50px;
          right: -50px;
          width: 100px;
          height: 100px;
        }

        .dice-face {
          width: 50px;
          height: 50px;
          font-size: 1.5em;
        }
      }
    `;

    document.head.appendChild(style);
  }

  // ═══════════════════════════════════════════════════════════════
  // UTILITAIRES
  // ═══════════════════════════════════════════════════════════════

  getCorruptionLevel() {
    const corruption = this.game.player.corruption || 0;
    if (corruption >= 75) return 'high';
    if (corruption >= 40) return 'medium';
    return 'low';
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }
}

// ═══════════════════════════════════════════════════════════════
// EXPORT
// ═══════════════════════════════════════════════════════════════

if (typeof window !== 'undefined') {
  window.BloodPactSystem = BloodPactSystem;
}
