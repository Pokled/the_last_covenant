📚 Algorithms for Procedurally Generated Dungeons - Complete Reference

Bachelor Thesis - Filip Michael
Institution: Blekinge Institute of Technology
Date: June 2025
Conversion complète avec implémentations JavaScript


Table of Contents

Introduction
Theory
Implementation
Results
JavaScript Implementations
Recommendations for TLC


1. Introduction
1.1 Background
Procedural Content Generation (PCG) is widely used in video games to automatically generate usable content with minimal user input. This study compares four algorithms for room-based dungeon generation:

DFS (Depth-First Search)
BSP (Binary Space Partitioning)
DT 2D (2D Delaunay Triangulation)
DT 3D (3D Delaunay Triangulation)

1.2 Research Questions
RQ1: What are the quantitative performance differences (execution time, RAM and CPU usage) between the four algorithms?
RQ2: What qualitative differences (dungeon structure, implementation complexity) exist between them?
RQ3: How does performance vary between newer (2022) and older (2013) hardware?

2. Theory
2.1 DFS (Depth-First Search)
Time Complexity: O(v + e)
DFS is a recursive backtracking algorithm that carves maze-like paths through a grid.
How it works:

Start with a grid of unvisited cells
Pick a random starting cell
Mark current cell as visited
Choose a random unvisited neighbor
Carve a path to that neighbor
Recursively repeat from the neighbor
Backtrack when stuck
Continue until all cells visited

Visual Result:
┌───────────────┐
│   ┌───┬───┐   │
│   │ R │ R │   │  R = Room
│   └───┴───┘   │  ─ = Corridor
├───────────────┤
│ ┌─┐     ┌───┐│
│ │R│─────│ R ││
│ └─┘     └───┘│
└───────────────┘

→ Rectangular rooms with straight corridors

Characteristics:

Rooms vary in size
Straight corridors
Hierarchical structure
Guaranteed connectivity


2.3 DT 2D (2D Delaunay Triangulation)
Time Complexity: O(n log n)
Creates a mesh of triangles connecting room centers, then builds corridors.
How it works:

Place rooms randomly (non-overlapping)
Create Delaunay triangulation (Bowyer-Watson)
Generate Minimum Spanning Tree (Prim's)
Randomly add some extra edges (cycles)
Use A* to pathfind corridors
Prefer existing corridors (cost function)

Visual Result:

R───────R
   / \     / \
  /   \   /   \
 R     \ /     R
  \     R     /
   \   / \   /
    \ /   \ /
     R─────R

→ Organic corridors with some loops


Algorithms used:

Bowyer-Watson: Delaunay triangulation
Prim's Algorithm: Minimum Spanning Tree
A Pathfinding*: Corridor routing

Characteristics:

Varied room sizes
Organic, interesting corridors
Multiple paths (cycles)
More complex implementation


2.4 DT 3D (3D Delaunay Triangulation)
Time Complexity: O(n²)
Extends DT 2D to 3D space with tetrahedra instead of triangles.
How it works:

Place rooms on 3D grid (multiple floors)
Create tetrahedralization
Generate MST from tetrahedra edges
Add staircases for vertical movement
Use modified A* for pathfinding
Handle staircase node complexity

Visual Result:

Floor 2:  R═══R
          ║
         [S] ← Staircase
          ║
Floor 1:  R───R───R

→ Multi-floor dungeons with stairs



Characteristics:

Multi-floor dungeons
Vertical exploration
Very complex pathfinding
High computational cost
Staircase placement challenges


3. Implementation
3.1 Test Environment
Hardware Used:
W11 (Newer - 2022):

OS: Windows 11
CPU: AMD Ryzen 5 5500 (3.6/4.2 GHz)
RAM: 16 GB DDR4 3200 MHz
Storage: 1 TB NVMe SSD

W10 (Older - 2013):

OS: Windows 10
CPU: Intel i5-4440 (3.1/3.3 GHz)
RAM: 8 GB DDR3 1600 MHz
Storage: 1 TB SATA SSD

Software:

Unity 2022.3.54f1
Visual Studio
Unity Profiler for metrics

3.2 Test Methodology
Test Parameters:

Room sizes: 25, 50, 100 rooms
10 executions per algorithm per size
Metrics: CPU usage (%), Execution time (s), RAM usage (MB)

Why these sizes?

25 rooms: Minimum playable dungeon
50 rooms: Standard dungeon
100 rooms: Stress test


4. Results
4.1 Performance Summary (100 Rooms)
W11 Hardware (2022)
AlgorithmCPU (%)Time (s)RAM (MB)Performance RatingDFS6.50.0240.105⭐⭐⭐⭐⭐ ExcellentDT 2D20.50.1005.930⭐⭐⭐⭐ GoodBSP48.60.3691.350⭐⭐⭐ AcceptableDT 3D99.5128.0001635.000⭐ Unusable
W10 Hardware (2013)
AlgorithmCPU (%)Time (s)RAM (MB)DFS6.70.0390.105DT 2D19.80.1625.790BSP45.90.5641.390DT 3D99.6222.7721650.000
4.2 Scaling Analysis
When doubling rooms (25 → 50):
AlgorithmCPU ChangeTime ChangeRAM ChangeDFS+45%+85%+98%BSP+56%+277%+125%DT 2D+64%+223%+233%DT 3D+12%+4141% (!)+1695% (!)
Conclusion: DT 3D breaks down catastrophically at scale.
4.3 Hardware Impact
Speed Difference (W11 vs W10):

DFS: 1.6x faster on W11
BSP: 1.5x faster on W11
DT 2D: 1.6x faster on W11
DT 3D: 1.7x faster on W11

CPU/RAM: Nearly identical (< 1% difference)
Conclusion: Better hardware only affects execution time.

5. JavaScript Implementations
5.1 DFS Implementation


/**
 * DFS Dungeon Generator
 * Time Complexity: O(v + e)
 * Space Complexity: O(n)
 */

class DFSDungeonGenerator {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.grid = [];
    this.visited = new Set();
  }

  /**
   * Initialize empty grid
   */
  initGrid() {
    this.grid = Array(this.height)
      .fill(null)
      .map(() => Array(this.width).fill(0)); // 0 = wall, 1 = floor
  }

  /**
   * Get unvisited neighbors
   */
  getUnvisitedNeighbors(x, y) {
    const neighbors = [];
    const directions = [
      { dx: 0, dy: -1, dir: 'N' }, // North
      { dx: 1, dy: 0, dir: 'E' },  // East
      { dx: 0, dy: 1, dir: 'S' },  // South
      { dx: -1, dy: 0, dir: 'W' }  // West
    ];

    for (const { dx, dy, dir } of directions) {
      const nx = x + dx * 2; // Skip intermediate cell
      const ny = y + dy * 2;

      if (
        nx >= 0 && nx < this.width &&
        ny >= 0 && ny < this.height &&
        !this.visited.has(`${nx},${ny}`)
      ) {
        neighbors.push({ x: nx, y: ny, dir, dx, dy });
      }
    }

    return neighbors;
  }

  /**
   * Carve passage between two cells
   */
  carvePassage(x1, y1, x2, y2) {
    // Mark both cells as floor
    this.grid[y1][x1] = 1;
    this.grid[y2][x2] = 1;

    // Mark intermediate cell as floor (corridor)
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    this.grid[my][mx] = 1;
  }

  /**
   * Main DFS algorithm
   */
  dfs(x, y) {
    const key = `${x},${y}`;
    this.visited.add(key);
    this.grid[y][x] = 1; // Mark as floor

    // Get neighbors and shuffle
    const neighbors = this.getUnvisitedNeighbors(x, y);
    this.shuffle(neighbors);

    for (const neighbor of neighbors) {
      const { x: nx, y: ny, dx, dy } = neighbor;
      const nKey = `${nx},${ny}`;

      if (!this.visited.has(nKey)) {
        // Carve passage
        this.carvePassage(x, y, nx, ny);

        // Recurse
        this.dfs(nx, ny);
      }
    }
  }

  /**
   * Shuffle array (Fisher-Yates)
   */
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /**
   * Generate dungeon
   */
  generate() {
    this.initGrid();
    
    // Start from random odd position (to ensure proper spacing)
    const startX = Math.floor(Math.random() * (this.width / 2)) * 2 + 1;
    const startY = Math.floor(Math.random() * (this.height / 2)) * 2 + 1;

    this.dfs(startX, startY);

    return this.grid;
  }

  /**
   * Convert grid to room objects
   */
  gridToRooms() {
    const rooms = [];
    
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.grid[y][x] === 1) {
          rooms.push({
            x: x,
            y: y,
            type: 'ROOM',
            neighbors: this.getNeighborRooms(x, y)
          });
        }
      }
    }

    return rooms;
  }

  /**
   * Get neighbor rooms for connectivity
   */
  getNeighborRooms(x, y) {
    const neighbors = [];
    const directions = [
      { dx: 0, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 }
    ];

    for (const { dx, dy } of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (
        nx >= 0 && nx < this.width &&
        ny >= 0 && ny < this.height &&
        this.grid[ny][nx] === 1
      ) {
        neighbors.push({ x: nx, y: ny });
      }
    }

    return neighbors;
  }

  /**
   * Visualize grid (ASCII)
   */
  visualize() {
    let output = '';
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        output += this.grid[y][x] === 1 ? '  ' : '██';
      }
      output += '\n';
    }
    return output;
  }
}

// ==========================================
// USAGE EXAMPLE
// ==========================================

const generator = new DFSDungeonGenerator(21, 21); // Must be odd for proper spacing
const dungeon = generator.generate();
console.log(generator.visualize());

// Get rooms as objects
const rooms = generator.gridToRooms();
console.log(`Generated ${rooms.length} rooms`);


5.2 BSP Implementation


/**
 * BSP Dungeon Generator
 * Time Complexity: O(n log n)
 * Space Complexity: O(n)
 */

class BSPNode {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.leftChild = null;
    this.rightChild = null;
    this.room = null;
    this.corridors = [];
  }

  /**
   * Check if node is a leaf (no children)
   */
  isLeaf() {
    return this.leftChild === null && this.rightChild === null;
  }
}

class BSPDungeonGenerator {
  constructor(width, height, minRoomSize = 6, maxDepth = 5) {
    this.width = width;
    this.height = height;
    this.minRoomSize = minRoomSize;
    this.maxDepth = maxDepth;
    this.root = null;
    this.rooms = [];
    this.corridors = [];
  }

  /**
   * Main generation function
   */
  generate() {
    // Create root node
    this.root = new BSPNode(0, 0, this.width, this.height);

    // Recursively split
    this.split(this.root, 0);

    // Create rooms in leaf nodes
    this.createRooms(this.root);

    // Create corridors
    this.createCorridors(this.root);

    return {
      rooms: this.rooms,
      corridors: this.corridors
    };
  }

  /**
   * Recursively split node into children
   */
  split(node, depth) {
    if (depth >= this.maxDepth) {
      return;
    }

    // Check if node is too small to split
    if (
      node.width < this.minRoomSize * 2 ||
      node.height < this.minRoomSize * 2
    ) {
      return;
    }

    // Decide split direction
    const splitHorizontally = Math.random() > 0.5;

    if (splitHorizontally) {
      // Can we split horizontally?
      if (node.height < this.minRoomSize * 2) {
        return;
      }

      // Choose split position
      const minSplit = this.minRoomSize;
      const maxSplit = node.height - this.minRoomSize;
      const splitPos = Math.floor(
        Math.random() * (maxSplit - minSplit) + minSplit
      );

      // Create children
      node.leftChild = new BSPNode(
        node.x,
        node.y,
        node.width,
        splitPos
      );

      node.rightChild = new BSPNode(
        node.x,
        node.y + splitPos,
        node.width,
        node.height - splitPos
      );
    } else {
      // Split vertically
      if (node.width < this.minRoomSize * 2) {
        return;
      }

      const minSplit = this.minRoomSize;
      const maxSplit = node.width - this.minRoomSize;
      const splitPos = Math.floor(
        Math.random() * (maxSplit - minSplit) + minSplit
      );

      node.leftChild = new BSPNode(
        node.x,
        node.y,
        splitPos,
        node.height
      );

      node.rightChild = new BSPNode(
        node.x + splitPos,
        node.y,
        node.width - splitPos,
        node.height
      );
    }

    // Recursively split children
    this.split(node.leftChild, depth + 1);
    this.split(node.rightChild, depth + 1);
  }

  /**
   * Create rooms in leaf nodes
   */
  createRooms(node) {
    if (node.isLeaf()) {
      // Create room with margin
      const margin = 2;
      const roomWidth = Math.floor(
        Math.random() * (node.width - margin * 2 - this.minRoomSize) +
        this.minRoomSize
      );
      const roomHeight = Math.floor(
        Math.random() * (node.height - margin * 2 - this.minRoomSize) +
        this.minRoomSize
      );

      const roomX = node.x + Math.floor(Math.random() * (node.width - roomWidth - margin)) + margin;
      const roomY = node.y + Math.floor(Math.random() * (node.height - roomHeight - margin)) + margin;

      node.room = {
        x: roomX,
        y: roomY,
        width: roomWidth,
        height: roomHeight,
        centerX: roomX + Math.floor(roomWidth / 2),
        centerY: roomY + Math.floor(roomHeight / 2)
      };

      this.rooms.push(node.room);
    } else {
      // Recurse into children
      if (node.leftChild) this.createRooms(node.leftChild);
      if (node.rightChild) this.createRooms(node.rightChild);
    }
  }

  /**
   * Create corridors between sibling rooms
   */
  createCorridors(node) {
    if (node.isLeaf()) {
      return;
    }

    // Get rooms from left and right subtrees
    const leftRooms = this.getRooms(node.leftChild);
    const rightRooms = this.getRooms(node.rightChild);

    if (leftRooms.length > 0 && rightRooms.length > 0) {
      // Pick random room from each side
      const leftRoom = leftRooms[Math.floor(Math.random() * leftRooms.length)];
      const rightRoom = rightRooms[Math.floor(Math.random() * rightRooms.length)];

      // Create L-shaped corridor
      const corridor = this.createLCorridor(
        leftRoom.centerX, leftRoom.centerY,
        rightRoom.centerX, rightRoom.centerY
      );

      this.corridors.push(corridor);
    }

    // Recurse into children
    if (node.leftChild) this.createCorridors(node.leftChild);
    if (node.rightChild) this.createCorridors(node.rightChild);
  }

  /**
   * Get all rooms from a subtree
   */
  getRooms(node) {
    if (!node) return [];
    if (node.isLeaf()) return node.room ? [node.room] : [];

    return [
      ...this.getRooms(node.leftChild),
      ...this.getRooms(node.rightChild)
    ];
  }

  /**
   * Create L-shaped corridor between two points
   */
  createLCorridor(x1, y1, x2, y2) {
    const corridor = {
      segments: []
    };

    // Horizontal then vertical
    if (Math.random() > 0.5) {
      // Horizontal segment
      corridor.segments.push({
        x: Math.min(x1, x2),
        y: y1,
        width: Math.abs(x2 - x1),
        height: 1
      });

      // Vertical segment
      corridor.segments.push({
        x: x2,
        y: Math.min(y1, y2),
        width: 1,
        height: Math.abs(y2 - y1)
      });
    } else {
      // Vertical then horizontal
      corridor.segments.push({
        x: x1,
        y: Math.min(y1, y2),
        width: 1,
        height: Math.abs(y2 - y1)
      });

      corridor.segments.push({
        x: Math.min(x1, x2),
        y: y2,
        width: Math.abs(x2 - x1),
        height: 1
      });
    }

    return corridor;
  }

  /**
   * Visualize dungeon (ASCII)
   */
  visualize() {
    // Create grid
    const grid = Array(this.height)
      .fill(null)
      .map(() => Array(this.width).fill('██'));

    // Draw rooms
    for (const room of this.rooms) {
      for (let y = room.y; y < room.y + room.height; y++) {
        for (let x = room.x; x < room.x + room.width; x++) {
          if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
            grid[y][x] = '  ';
          }
        }
      }
    }

    // Draw corridors
    for (const corridor of this.corridors) {
      for (const segment of corridor.segments) {
        for (let y = segment.y; y < segment.y + segment.height; y++) {
          for (let x = segment.x; x < segment.x + segment.width; x++) {
            if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
              grid[y][x] = '░░';
            }
          }
        }
      }
    }

    // Convert to string
    return grid.map(row => row.join('')).join('\n');
  }
}

// ==========================================
// USAGE EXAMPLE
// ==========================================

const bspGen = new BSPDungeonGenerator(60, 40, 6, 4);
const dungeon = bspGen.generate();

console.log(`Generated ${dungeon.rooms.length} rooms`);
console.log(`Generated ${dungeon.corridors.length} corridors`);
console.log('\n' + bspGen.visualize());

5.3 DT 2D Implementation (Simplified)


/**
 * Delaunay Triangulation 2D Dungeon Generator
 * Time Complexity: O(n log n)
 * Space Complexity: O(n)
 * 
 * NOTE: This is a simplified version.
 * Full implementation requires Delaunay library (e.g., d3-delaunay)
 */

class DelaunayDungeonGenerator {
  constructor(width, height, numRooms = 20) {
    this.width = width;
    this.height = height;
    this.numRooms = numRooms;
    this.rooms = [];
    this.triangulation = null;
    this.mst = null;
    this.corridors = [];
  }

  /**
   * Generate random non-overlapping rooms
   */
  generateRooms() {
    const minSize = 4;
    const maxSize = 10;
    const attempts = this.numRooms * 10;

    for (let i = 0; i < attempts && this.rooms.length < this.numRooms; i++) {
      const room = {
        x: Math.floor(Math.random() * (this.width - maxSize)),
        y: Math.floor(Math.random() * (this.height - maxSize)),
        width: Math.floor(Math.random() * (maxSize - minSize) + minSize),
        height: Math.floor(Math.random() * (maxSize - minSize) + minSize)
      };

      room.centerX = room.x + Math.floor(room.width / 2);
      room.centerY = room.y + Math.floor(room.height / 2);

      // Check overlap
      if (!this.overlaps(room)) {
        this.rooms.push(room);
      }
    }
  }

  /**
   * Check if room overlaps with existing rooms
   */
  overlaps(room) {
    for (const existing of this.rooms) {
      if (
        room.x < existing.x + existing.width + 2 &&
        room.x + room.width + 2 > existing.x &&
        room.y < existing.y + existing.height + 2 &&
        room.y + room.height + 2 > existing.y
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Create Delaunay Triangulation
   * 
   * NOTE: In production, use library like d3-delaunay:
   * import { Delaunay } from 'd3-delaunay';
   * 
   * const points = this.rooms.map(r => [r.centerX, r.centerY]);
   * this.triangulation = Delaunay.from(points);
   */
  createTriangulation() {
    // Placeholder for triangulation
    // In real implementation, use Bowyer-Watson algorithm
    console.log('Triangulation would be computed here using Delaunay library');
    
    // For demo purposes, create simple connections
    this.triangulation = {
      edges: []
    };

    // Create edges between nearby rooms (simplified)
    for (let i = 0; i < this.rooms.length; i++) {
      for (let j = i + 1; j < this.rooms.length; j++) {
        const room1 = this.rooms[i];
        const room2 = this.rooms[j];
        
        const dx = room2.centerX - room1.centerX;
        const dy = room2.centerY - room1.centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Only connect close rooms
        if (distance < 30) {
          this.triangulation.edges.push({
            from: i,
            to: j,
            weight: distance
          });
        }
      }
    }
  }

  /**
   * Create Minimum Spanning Tree using Prim's Algorithm
   */
  createMST() {
    if (this.triangulation.edges.length === 0) {
      return;
    }

    this.mst = [];
    const visited = new Set([0]); // Start with first room
    const edges = [...this.triangulation.edges];

    while (visited.size < this.rooms.length && edges.length > 0) {
      // Find cheapest edge connecting visited to unvisited
      let bestEdge = null;
      let bestIdx = -1;

      for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        const fromVisited = visited.has(edge.from);
        const toVisited = visited.has(edge.to);

        // One end visited, one not
        if (fromVisited !== toVisited) {
          if (!bestEdge || edge.weight < bestEdge.weight) {
            bestEdge = edge;
            bestIdx = i;
          }
        }
      }

      if (bestEdge) {
        this.mst.push(bestEdge);
        visited.add(bestEdge.from);
        visited.add(bestEdge.to);
        edges.splice(bestIdx, 1);
      } else {
        break;
      }
    }

    // Add some random edges back for loops (15% chance)
    for (const edge of this.triangulation.edges) {
      if (Math.random() < 0.15 && !this.mst.includes(edge)) {
        this.mst.push(edge);
      }
    }
  }

  /**
   * Simplified A* pathfinding for corridors
   */
  createCorridors() {
    for (const edge of this.mst) {
      const room1 = this.rooms[edge.from];
      const room2 = this.rooms[edge.to];

      // Simple L-shaped corridor
      const corridor = {
        from: edge.from,
        to: edge.to,
        segments: []
      };

      // Horizontal then vertical
      corridor.segments.push({
        x: Math.min(room1.centerX, room2.centerX),
        y: room1.centerY,
        width: Math.abs(room2.centerX - room1.centerX),
        height: 1
      });

      corridor.segments.push({
        x: room2.centerX,
        y: Math.min(room1.centerY, room2.centerY),

        