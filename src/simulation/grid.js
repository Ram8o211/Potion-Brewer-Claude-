// Uniform-grid broad phase. Particles are counting-sorted into cells each
// step and a half neighbour-pair list (i<j) within a radius is produced.
// All solver passes iterate this flat pair list, which keeps the work O(N)
// and cache friendly (no O(N²) all-pairs loops anywhere).

export class NeighborGrid {
  /**
   * @param {number} minX @param {number} minY @param {number} maxX @param {number} maxY
   * @param {number} cell cell size (≥ query radius) @param {number} capacity
   */
  constructor(minX, minY, maxX, maxY, cell, capacity) {
    this.minX = minX;
    this.minY = minY;
    this.cell = cell;
    this.inv = 1 / cell;
    this.cols = Math.ceil((maxX - minX) / cell) + 1;
    this.rows = Math.ceil((maxY - minY) / cell) + 1;
    const nCells = this.cols * this.rows;
    this.cellStart = new Int32Array(nCells + 1);
    this.cellOf = new Int32Array(capacity);
    this.sorted = new Int32Array(capacity);
    this.pairCap = capacity * 16;
    this.pairI = new Int32Array(this.pairCap);
    this.pairJ = new Int32Array(this.pairCap);
    this.pairCount = 0;
  }

  /** @param {Float32Array} xs @param {Float32Array} ys @param {number} n */
  build(xs, ys, n) {
    const { cols, rows, inv, minX, minY, cellStart, cellOf, sorted } = this;
    cellStart.fill(0);
    for (let i = 0; i < n; i++) {
      let cx = ((xs[i] - minX) * inv) | 0;
      let cy = ((ys[i] - minY) * inv) | 0;
      if (cx < 0) cx = 0; else if (cx >= cols) cx = cols - 1;
      if (cy < 0) cy = 0; else if (cy >= rows) cy = rows - 1;
      const c = cy * cols + cx;
      cellOf[i] = c;
      cellStart[c + 1]++;
    }
    const nCells = cols * rows;
    for (let c = 0; c < nCells; c++) cellStart[c + 1] += cellStart[c];
    // fill using a running cursor (reuse cellOf ordering)
    const cursor = this._cursor && this._cursor.length === nCells ? this._cursor : (this._cursor = new Int32Array(nCells));
    cursor.set(cellStart.subarray(0, nCells));
    for (let i = 0; i < n; i++) sorted[cursor[cellOf[i]]++] = i;
  }

  /**
   * Build the half pair list within radius r.
   * @param {Float32Array} xs @param {Float32Array} ys @param {number} n @param {number} r
   */
  buildPairs(xs, ys, n, r) {
    this.build(xs, ys, n);
    const r2 = r * r;
    const { cols, rows, cellStart, sorted } = this;
    let pc = 0;
    let pairI = this.pairI, pairJ = this.pairJ;
    for (let cy = 0; cy < rows; cy++) {
      for (let cx = 0; cx < cols; cx++) {
        const c = cy * cols + cx;
        const s0 = cellStart[c], s1 = cellStart[c + 1];
        if (s0 === s1) continue;
        for (let a = s0; a < s1; a++) {
          const i = sorted[a];
          const xi = xs[i], yi = ys[i];
          // same cell (later entries only)
          for (let b = a + 1; b < s1; b++) {
            const j = sorted[b];
            const dx = xs[j] - xi, dy = ys[j] - yi;
            if (dx * dx + dy * dy < r2) {
              if (pc >= this.pairCap) { this._grow(); pairI = this.pairI; pairJ = this.pairJ; }
              pairI[pc] = i; pairJ[pc] = j; pc++;
            }
          }
          // forward neighbour cells: (x+1,y), (x-1,y+1), (x,y+1), (x+1,y+1)
          for (let k = 0; k < 4; k++) {
            const nx = cx + (k === 0 ? 1 : k === 1 ? -1 : k === 2 ? 0 : 1);
            const ny = cy + (k === 0 ? 0 : 1);
            if (nx < 0 || nx >= cols || ny >= rows) continue;
            const nc = ny * cols + nx;
            const t0 = cellStart[nc], t1 = cellStart[nc + 1];
            for (let b = t0; b < t1; b++) {
              const j = sorted[b];
              const dx = xs[j] - xi, dy = ys[j] - yi;
              if (dx * dx + dy * dy < r2) {
                if (pc >= this.pairCap) { this._grow(); pairI = this.pairI; pairJ = this.pairJ; }
                pairI[pc] = i; pairJ[pc] = j; pc++;
              }
            }
          }
        }
      }
    }
    this.pairCount = pc;
    return pc;
  }

  _grow() {
    const cap = this.pairCap * 2;
    const ni = new Int32Array(cap), nj = new Int32Array(cap);
    ni.set(this.pairI); nj.set(this.pairJ);
    this.pairI = ni; this.pairJ = nj; this.pairCap = cap;
  }

  /**
   * Visit particle indices in cells overlapping a circle (for tool queries).
   * @param {number} x @param {number} y @param {number} r @param {(i:number)=>void} fn
   */
  query(x, y, r, fn) {
    const { cols, rows, inv, minX, minY, cellStart, sorted } = this;
    const x0 = Math.max(0, ((x - r - minX) * inv) | 0), x1 = Math.min(cols - 1, ((x + r - minX) * inv) | 0);
    const y0 = Math.max(0, ((y - r - minY) * inv) | 0), y1 = Math.min(rows - 1, ((y + r - minY) * inv) | 0);
    for (let cy = y0; cy <= y1; cy++) {
      for (let cx = x0; cx <= x1; cx++) {
        const c = cy * cols + cx;
        for (let a = cellStart[c]; a < cellStart[c + 1]; a++) fn(sorted[a]);
      }
    }
  }
}
