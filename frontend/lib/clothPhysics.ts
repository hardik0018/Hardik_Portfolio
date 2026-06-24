// clothPhysics.ts
// Reusable cloth simulation engine for MainLoader and Page Transitions

export const COLS    = 30;    // horizontal grid points
export const ROWS    = 24;    // vertical grid points
export const ITERS   = 14;    // constraint solver iterations per frame
export const DAMPING = 0.963; // velocity friction (< 1)
export const GRAVITY = 0.12;  // downward acceleration per frame

// ─── Particle ────────────────────────────────────────────────────────────────
export class Pt {
  x: number; y: number; px: number; py: number;
  ax: number; ay: number; pinned: boolean;

  constructor(x: number, y: number, pinned = false) {
    this.x = x; this.y = y; this.px = x; this.py = y;
    this.ax = 0; this.ay = 0; this.pinned = pinned;
  }

  impulse(fx: number, fy: number) {
    if (!this.pinned) { this.px -= fx; this.py -= fy; }
  }

  step() {
    if (this.pinned) return;
    const vx = (this.x - this.px) * DAMPING + this.ax;
    const vy = (this.y - this.py) * DAMPING + GRAVITY + this.ay;
    this.px = this.x; this.py = this.y;
    this.x += vx; this.y += vy;
    this.ax = 0; this.ay = 0;
  }
}

// ─── Spring constraint ───────────────────────────────────────────────────────
export class Link {
  a: Pt; b: Pt; rest: number;

  constructor(a: Pt, b: Pt) {
    this.a = a; this.b = b;
    this.rest = Math.hypot(b.x - a.x, b.y - a.y);
  }

  solve() {
    const dx = this.b.x - this.a.x, dy = this.b.y - this.a.y;
    const d  = Math.hypot(dx, dy) || 1e-9;
    const f  = (d - this.rest) / d * 0.5;
    const cx = dx * f, cy = dy * f;
    if (!this.a.pinned) { this.a.x += cx; this.a.y += cy; }
    if (!this.b.pinned) { this.b.x -= cx; this.b.y -= cy; }
  }
}

// ─── Cloth state ──────────────────────────────────────────────────────────────
export interface ClothState {
  pts: Pt[][];
  links: Link[];
  rafId: number;
}

export function buildCloth(W: number, H: number): ClothState {
  const pts: Pt[][] = [];
  const links: Link[] = [];
  const sx = W / (COLS - 1);
  const sy = H / (ROWS - 1);

  for (let r = 0; r < ROWS; r++) {
    pts[r] = [];
    for (let c = 0; c < COLS; c++) {
      pts[r][c] = new Pt(c * sx, r * sy, r === 0);
    }
  }

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (c < COLS - 1) links.push(new Link(pts[r][c], pts[r][c + 1]));
      if (r < ROWS - 1) links.push(new Link(pts[r][c], pts[r + 1][c]));
      if (c < COLS - 1 && r < ROWS - 1) links.push(new Link(pts[r][c], pts[r + 1][c + 1]));
      if (c > 0        && r < ROWS - 1) links.push(new Link(pts[r][c], pts[r + 1][c - 1]));
      if (c < COLS - 2) links.push(new Link(pts[r][c], pts[r][c + 2]));
      if (r < ROWS - 2) links.push(new Link(pts[r][c], pts[r + 2][c]));
    }
  }

  return { pts, links, rafId: 0 };
}

export function stepCloth(state: ClothState) {
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      state.pts[r][c].step();
  for (let i = 0; i < ITERS; i++)
    for (const l of state.links) l.solve();
}

// ─── Draw cloth ───────────────────────────────────────────────────────────────
export function drawCloth(
  ctx: CanvasRenderingContext2D,
  state: ClothState,
  W: number,
  H: number,
  isDynamic = false,
) {
  ctx.clearRect(0, 0, W, H);

  for (let r = 0; r < ROWS - 1; r++) {
    for (let c = 0; c < COLS - 1; c++) {
      const p00 = state.pts[r][c],     p01 = state.pts[r][c + 1];
      const p10 = state.pts[r + 1][c], p11 = state.pts[r + 1][c + 1];

      const minY = Math.min(p00.y, p01.y, p10.y, p11.y);
      const maxY = Math.max(p00.y, p01.y, p10.y, p11.y);
      if (maxY < -80 || minY > H + 80) continue;

      ctx.beginPath();
      ctx.moveTo(p00.x, p00.y);
      ctx.lineTo(p01.x, p01.y);
      ctx.lineTo(p11.x, p11.y);
      ctx.lineTo(p10.x, p10.y);
      ctx.closePath();

      // Calculate u, v coordinates of this quad on the cloth mesh (0 to 1)
      const u = (c + 0.5) / (COLS - 1);
      const v = (r + 0.5) / (ROWS - 1);

      let light = 1;
      if (isDynamic) {
        // Surface normal
        const ux = p11.x - p00.x, uy = p11.y - p00.y;
        const vx = p01.x - p10.x, vy = p01.y - p10.y;
        const nz   = uy * vx - ux * vy;
        const area = Math.abs(nz) || 1;
        
        // Increased contrast for a more premium, silky cloth feel
        light = Math.max(0.65, Math.min(1.35, nz / area * 0.4 + 0.85));
      }

      // Base background color (matches --background: #fdfdfd)
      let cr = 253, cg = 253, cb = 253;

      // Add a subtle diagonal specular sheen
      const sheen = Math.max(0, 1 - Math.abs(u - v) * 2.5) * 0.05;
      cr += sheen * 255; cg += sheen * 255; cb += sheen * 255;

      // Apply lighting (cloth folds effect)
      cr = Math.min(255, Math.floor(cr * light));
      cg = Math.min(255, Math.floor(cg * light));
      cb = Math.min(255, Math.floor(cb * light));

      const finalColor = `rgb(${cr}, ${cg}, ${cb})`;

      ctx.fillStyle = finalColor;
      ctx.fill();

      // Seal the subpixel anti-aliasing gaps
      ctx.strokeStyle = finalColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }
}

export function clothGone(state: ClothState, H: number): boolean {
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const p = state.pts[r][c];
      if (p.y > -80 && p.y < H + 80) return false;
    }
  return true;
}

// ─── Cloth Animations ─────────────────────────────────────────────────────────

/**
 * The Majestic Silk Pull: Cloth is unpinned from top-center, slowly ripples with deep flag-like folds,
 * and flies smoothly upwards, clearing the screen to reveal the content underneath.
 */
export function animateClothWhisk(
  canvas: HTMLCanvasElement,
  state: ClothState,
  contentEl: HTMLElement | null,
  onComplete: () => void
) {
  cancelAnimationFrame(state.rafId);
  const W   = canvas.width;
  const H   = canvas.height;
  const ctx = canvas.getContext("2d")!;

  let frame     = 0;
  let windPhase = 0;

  const tick = () => {
    frame++;

    const center = Math.floor(COLS / 2);
    // Unpin gradually over ~45 frames (0.75 seconds) for a majestic curtain peel
    if (frame <= 45) {
      const spread = Math.ceil((frame / 45) * center);
      const leftCol = Math.max(0, center - spread);
      const rightCol = Math.min(COLS - 1, center + spread);
      
      for(let c = leftCol; c <= rightCol; c++) {
        if (state.pts[0][c].pinned) {
          state.pts[0][c].pinned = false;
          // Gentle initial pull so gravity and wind take effect, forming heavy folds
          const distFromCenter = Math.abs(c - center) / center;
          const pullY = -6 + (distFromCenter * 3); 
          state.pts[0][c].impulse(0, pullY);
          if (state.pts[1]?.[c]) state.pts[1][c].impulse(0, pullY * 0.4);
        }
      }
    }

    // Sinusoidal wind creates deep, flag-like wrinkles
    windPhase += 0.055;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const p = state.pts[r][c];
        if (p.pinned) continue;
        
        // Deep organic waves mimicking a heavy flag or silk curtain
        const waveX = Math.sin(windPhase * 1.2 + r * 0.2) * 1.5;
        const waveZ = Math.cos(windPhase * 1.5 + c * 0.3) * 2.2;
        
        // Outward draft so it flares beautifully and creates tension
        const distFromCenter = (c - center) / center; // -1 to 1
        const outward = distFromCenter * 1.6;
        
        p.ax += waveX + outward;
        
        // Gradual upward lift that accelerates smoothly
        const liftForce = Math.min(1.8, 0.3 + (frame * 0.012)); 
        p.ay += -liftForce + waveZ; 
      }
    }

    stepCloth(state);
    drawCloth(ctx, state, W, H, true);

    if (contentEl) {
      // Sync DOM content to cloth movement using the center point
      const rCenter = Math.floor(ROWS / 2);
      const cCenter = Math.floor(COLS / 2);
      const pt = state.pts[rCenter][cCenter];
      
      const initialX = cCenter * (W / (COLS - 1));
      const initialY = rCenter * (H / (ROWS - 1));
      
      const dx = pt.x - initialX;
      const dy = pt.y - initialY;

      const ptLeft = state.pts[rCenter][Math.floor(COLS * 0.2)];
      const ptRight = state.pts[rCenter][Math.floor(COLS * 0.8)];
      const angle = Math.atan2(ptRight.y - ptLeft.y, ptRight.x - ptLeft.x) * (180 / Math.PI);

      const ptTop = state.pts[Math.floor(ROWS * 0.2)][cCenter];
      const ptBottom = state.pts[Math.floor(ROWS * 0.8)][cCenter];
      const currentHeight = ptBottom.y - ptTop.y;
      const initialHeight = (H / (ROWS - 1)) * (ROWS * 0.6);
      
      let scale = currentHeight / initialHeight;
      scale = Math.max(0.85, Math.min(1.05, scale));

      contentEl.style.transform = `translate(${dx}px, ${dy}px) rotate(${angle}deg) scale(${scale})`;
    }

    if (clothGone(state, H)) {
      cancelAnimationFrame(state.rafId);
      onComplete();
    } else {
      state.rafId = requestAnimationFrame(tick);
    }
  };

  state.rafId = requestAnimationFrame(tick);
}

/**
 * The Majestic Silk Drop: Drops the cloth from the top of the screen downwards
 * to cover the screen gracefully (used before navigating to a new route).
 */
export function animateClothDrop(
  canvas: HTMLCanvasElement,
  state: ClothState,
  onComplete: () => void
) {
  cancelAnimationFrame(state.rafId);
  const W   = canvas.width;
  const H   = canvas.height;
  const ctx = canvas.getContext("2d")!;

  let frame     = 0;
  let windPhase = 0;

  // For a drop, we need to temporarily "teleport" the cloth above the screen,
  // pin the top row, and let gravity and wind drop it down until it fills the screen.
  // We rebuild the cloth with points above screen:
  const sx = W / (COLS - 1);
  const sy = H / (ROWS - 1);

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const p = state.pts[r][c];
      p.x = c * sx;
      // Start cloth above the screen, retaining its natural shape
      p.y = -H * 1.2 + (r * sy); 
      p.px = p.x;
      p.py = p.y;
      p.ax = 0;
      p.ay = 0;
      // Top row is pinned
      p.pinned = (r === 0);
    }
  }

  // To drop it smoothly, we will pull the top row downwards.
  const tick = () => {
    frame++;

    // Calculate the drop amount for this frame
    let deltaY = 0;
    if (frame <= 50) {
      const prevProgress = Math.min(1, (frame - 1) / 40);
      const prevEased = 1 - Math.pow(1 - prevProgress, 3);
      const prevY = -H * 1.2 + (prevEased * H * 1.2);
      
      const progress = Math.min(1, frame / 40);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentY = -H * 1.2 + (eased * H * 1.2);
      
      deltaY = currentY - prevY;
    }

    // Apply the translation to all points evenly to prevent physics explosions
    if (deltaY > 0) {
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const p = state.pts[r][c];
          p.y += deltaY;
          p.py += deltaY; // keep velocity stable
        }
      }
    }

    windPhase += 0.055;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const p = state.pts[r][c];
        if (p.pinned) continue;
        
        // Gentle flutter while falling
        const waveX = Math.sin(windPhase * 1.2 + r * 0.2) * 0.8;
        const waveZ = Math.cos(windPhase * 1.5 + c * 0.3) * 1.2;
        
        p.ax += waveX;
        p.ay += waveZ; 
        // Gravity does the rest (GRAVITY is 0.12)
      }
    }

    stepCloth(state);
    drawCloth(ctx, state, W, H, true);

    // Check if cloth has fully covered the screen (bottom row reaches bottom)
    let isCovered = true;
    for (let c = 0; c < COLS; c++) {
      if (state.pts[ROWS-1][c].y < H - 50) {
        isCovered = false;
        break;
      }
    }

    if ((isCovered && frame > 40) || frame > 80) {
      // Hold it for a tiny fraction so transition looks stable
      cancelAnimationFrame(state.rafId);
      onComplete();
    } else {
      state.rafId = requestAnimationFrame(tick);
    }
  };

  state.rafId = requestAnimationFrame(tick);
}
