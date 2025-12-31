import { IsometricRenderer } from '../../systems/IsometricRenderer.js';
import { RoomGenerator } from '../../systems/RoomGenerator.js';

export class GameScene {
    constructor(eventBus, stateManager) {
        this.eventBus = eventBus;
        this.stateManager = stateManager;
        this.element = null;
        this.canvas = null;
        this.ctx = null;
        this.renderer = null;
        this.roomGenerator = null;
        this.player = { x: 0, y: 0 };
        this.keys = {};
        this.isActive = false;
        this.rafId = null;
        this.createDOM();
        this.setupEventListeners();
    }
    createDOM() {
        this.element = document.createElement("div");
        this.element.id = "game-scene";
        this.element.className = "scene";
        this.element.innerHTML = '<div class="game-background"></div><div id="hud"><div id="player-stats"><div class="stat-bar"><span class="stat-label">❤️ HP</span><div class="bar hp-bar"><div class="bar-fill" id="hp-fill" style="width: 100%"></div><span class="bar-text" id="hp-text">100/100</span></div></div><div class="stat-bar"><span class="stat-label">💀 Corruption</span><div class="bar corruption-bar"><div class="bar-fill" id="corruption-fill" style="width: 0%"></div><span class="bar-text" id="corruption-text">0%</span></div></div></div><div id="quick-info"><span id="floor-info">Étage 1</span><span id="room-info">Salle 1/10</span></div></div><canvas id="game-canvas"></canvas><div class="vignette"></div>';
        document.getElementById("game-container").appendChild(this.element);
        this.canvas = this.element.querySelector("#game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.setupCanvas();
    }
    setupCanvas() {
        const resize = () => {
            this.canvas.width = this.canvas.offsetWidth;
            this.canvas.height = this.canvas.offsetHeight;
            if (this.renderer) {
                this.renderer.canvas = this.canvas;
                this.renderer.ctx = this.ctx;
            }
        };
        resize();
        window.addEventListener("resize", resize);
    }
    setupEventListeners() {
        this.stateManager.subscribe((newState) => this.updateHUD(newState));
        this.eventBus.on("corruption:changed", (data) => this.animateCorruptionChange(data.old, data.new));
        window.addEventListener("keydown", (e) => {
            this.keys[e.key.toLowerCase()] = true;
            if (e.key.toLowerCase() === "g" && this.renderer) this.renderer.toggleGrid();
            if (e.key.toLowerCase() === "c" && this.renderer) this.renderer.toggleCoords();
        });
        window.addEventListener("keyup", (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }
    onEnter() {
        this.element.classList.add("active");
        this.updateHUD(this.stateManager.getState());
        this.initDungeon();
        this.startGameLoop();
        console.log("Game Scene: Active - Donjon isométrique");
    }
    initDungeon() {
        this.renderer = new IsometricRenderer(this.canvas);
        this.roomGenerator = new RoomGenerator(20, 20);
        this.roomGenerator.generateSimpleRoom();
        const spawn = this.roomGenerator.getSpawnPosition();
        this.player.x = spawn.x;
        this.player.y = spawn.y;
        this.renderer.centerCamera(this.player.x, this.player.y);
        console.log("🏰 Dungeon initialized");
    }
    onExit() {
        this.element.classList.remove("active");
        this.stopGameLoop();
    }
    updateHUD(state) {
        if (!state.player) return;
        document.getElementById("hp-fill").style.width = (state.player.HP / state.player.maxHP) * 100 + "%";
        document.getElementById("hp-text").textContent = Math.round(state.player.HP) + "/" + state.player.maxHP;
        document.getElementById("corruption-fill").style.width = state.corruption + "%";
        document.getElementById("corruption-text").textContent = Math.round(state.corruption) + "%";
    }
    animateCorruptionChange(old, newVal) { console.log("💀 Corruption: " + old + "% → " + newVal + "%"); }
    startGameLoop() {
        let lastTime = 0;
        const loop = (timestamp) => {
            if (!this.isActive) return;
            this.update(timestamp - lastTime);
            this.render();
            lastTime = timestamp;
            this.rafId = requestAnimationFrame(loop);
        };
        this.isActive = true;
        this.rafId = requestAnimationFrame(loop);
    }
    stopGameLoop() {
        this.isActive = false;
        if (this.rafId) cancelAnimationFrame(this.rafId);
    }
    update() {
        if (!this.renderer || !this.roomGenerator) return;
        const speed = 0.1;
        let dx = 0, dy = 0;
        if (this.keys["z"] || this.keys["w"]) dy -= speed;
        if (this.keys["s"]) dy += speed;
        if (this.keys["q"] || this.keys["a"]) dx -= speed;
        if (this.keys["d"]) dx += speed;
        if (dx !== 0 || dy !== 0) {
            const newX = this.player.x + dx, newY = this.player.y + dy;
            if (this.roomGenerator.isWalkable(Math.floor(newX), Math.floor(newY))) {
                this.player.x = newX;
                this.player.y = newY;
                this.renderer.centerCamera(this.player.x, this.player.y);
            }
        }
    }
    render() {
        if (!this.renderer || !this.roomGenerator) {
            this.ctx.fillStyle = "#0a0a0f";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            return;
        }
        this.renderer.drawGrid(this.roomGenerator.width, this.roomGenerator.height, (x, y) => this.roomGenerator.getTileColor(x, y));
        this.renderer.drawEntity(this.player.x, this.player.y, "#4CAF50", 16);
        if (this.renderer.debugMode) {
            this.ctx.fillStyle = "#fff";
            this.ctx.font = "14px monospace";
            this.ctx.textAlign = "left";
            this.ctx.fillText("Player: " + Math.floor(this.player.x) + ", " + Math.floor(this.player.y), 10, 20);
            this.ctx.fillText("Controls: ZQSD/WASD | G=Grid | C=Coords", 10, 40);
        }
    }
}
