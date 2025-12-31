// Configuration globale du jeu
const CONFIG = {
  TILE_SIZE: 40,
  GRID_WIDTH: 100,
  GRID_HEIGHT: 100,
  PATH_LENGTH: 450, // ~1h de jeu avec dé D10 (augmenté de 200)
  MAX_PLAYERS: 10
};

// État global du jeu
const GameState = {
  players: [],
  currentPlayerIndex: 0,
  gameStarted: false,
  dungeon: { grid: [], path: [] },
  localPlayer: null
};

// ✅ Exposer GameState sur window pour les modales AAA+
if (typeof window !== 'undefined') {
  window.GameState = GameState;
  window.CONFIG = CONFIG;
}

console.log('⚙️ Configuration chargée');