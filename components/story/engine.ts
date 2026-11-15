import { buyers, numberAnchors } from "@/lib/site";

export type Marker = { id: string; x: number; y: number; a: number; shift?: string };

type Galaxy = {
  id: string;
  title: string;
  x: number;
  y: number;
  r: number;
  tint: [number, number, number];
  arms: number;
  seed: number;
  spin: number;
};

const galaxies: Galaxy[] = [
  { id: "b2c", title: "B2C", x: -0.36, y: -0.22, r: 0.2, tint: [236, 208, 170], arms: 2, seed: 3, spin: 0.035 },
  { id: "b2b", title: "B2B", x: 0.12, y: 0.0, r: 0.155, tint: [186, 208, 232], arms: 2, seed: 11, spin: -0.04 },
  { id: "mkt", title: "Marketplaces", x: 0.4, y: -0.18, r: 0.086, tint: [196, 202, 190], arms: 3, seed: 19, spin: 0.05 },
  { id: "dtc", title: "Direct", x: -0.4, y: 0.14, r: 0.078, tint: [214, 176, 166], arms: 2, seed: 27, spin: 0.028 },
];

const dust = [
  { x: 0.66, y: -0.36, s: 0.05, a: 0.34, rot: 0.4 },
  { x: -0.66, y: -0.1, s: 0.046, a: 0.26, rot: 1.1 },
  { x: 0.58, y: 0.32, s: 0.04, a: 0.22, rot: 2.2 },
  { x: -0.08, y: -0.44, s: 0.034, a: 0.3, rot: 0.7 },
  { x: 0.02, y: 0.42, s: 0.03, a: 0.18, rot: 2.5 },
  { x: -0.58, y: 0.38, s: 0.055, a: 0.24, rot: 1.6 },
  { x: 0.28, y: -0.42, s: 0.028, a: 0.32, rot: 0.3 },
  { x: 0.48, y: 0.08, s: 0.026, a: 0.2, rot: 2.9 },
];

const systems = [
  { id: "fintech", label: "Fintech", x: -0.28, y: -0.16, s: 0.82 },
  { id: "logistics", label: "Logistics", x: 0.27, y: -0.18, s: 0.74 },
  { id: "healthcare", label: "Healthcare", x: -0.24, y: 0.2, s: 0.78 },
  { id: "industrial", label: "Industrial", x: 0.26, y: 0.18, s: 0.7 },
  { id: "space", label: "Space technology", x: 0, y: 0, s: 1.05 },
];

type Star = { x: number; y: number; z: number; s: number; a: number; hue: number; ph: number };

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

function smooth(t: number) {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function band(p: number, a: number, b: number, fade = 0.05) {
  const inn = a <= 0 ? 1 : clamp((p - a) / fade, 0, 1);
  const out = b >= 1 ? 1 : clamp((b - p) / fade, 0, 1);
  return Math.min(inn, out);
}

export function interfaceState(p: number) {
  // Plate owns the end of the descent — beats and readout clear before it lands.
  const plate = smooth(clamp((p - 0.88) / 0.08, 0, 1));
  const clearForPlate = 1 - plate;

  const beats = [
    band(p, 0.0, 0.145),
    band(p, 0.145, 0.305),
    band(p, 0.305, 0.455),
    band(p, 0.455, 0.625),
    band(p, 0.625, 0.78),
    band(p, 0.78, 0.9, 0.05),
  ].map((b) => b * clearForPlate);

  // Fixed display string per level — never interpolate.
  let captionIndex = 0;
  for (let i = numberAnchors.length - 1; i >= 0; i--) {
    if (p >= numberAnchors[i].p) {
      captionIndex = i;
      break;
    }
  }
  const anchor = numberAnchors[captionIndex];

  const readout =
    smooth(clamp((p - 0.12) / 0.06, 0, 1)) *
    (1 - smooth(clamp((p - 0.8) / 0.06, 0, 1))) *
    clearForPlate;

  let scale = "01   The field";
  if (p >= 0.62) scale = "04   Downstream";
  else if (p >= 0.45) scale = "03   Space technology";
  else if (p >= 0.3) scale = "02   B2B / B2G";

  return {
    beats,
    number: anchor.display,
    caption: anchor.caption,
    captionIndex,
    readout,
    plate,
    scale,
    rail: clamp(p, 0, 1),
    copper: captionIndex >= 3,
  };
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(src));
    img.src = src;
  });
}

function toImageData(img: HTMLImageElement) {
  const c = document.createElement("canvas");
  c.width = img.width;
  c.height = img.height;
  const g = c.getContext("2d", { willReadFrequently: true });
  if (!g) return null;
  g.drawImage(img, 0, 0);
  return g.getImageData(0, 0, img.width, img.height);
}

function bakeGalaxy(tint: [number, number, number], arms: number, seed: number) {
  const S = 680;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d");
  if (!g) return c;
  const rand = mulberry32(seed);
  const cx = S / 2;
  const cy = S / 2;

  const disk = g.createRadialGradient(cx, cy, 0, cx, cy, S * 0.48);
  disk.addColorStop(0, `rgba(${tint[0]}, ${tint[1]}, ${tint[2]}, 0.2)`);
  disk.addColorStop(0.35, `rgba(${tint[0]}, ${tint[1]}, ${tint[2]}, 0.05)`);
  disk.addColorStop(1, `rgba(${tint[0]}, ${tint[1]}, ${tint[2]}, 0)`);
  g.fillStyle = disk;
  g.beginPath();
  g.ellipse(cx, cy, S * 0.46, S * 0.3, 0, 0, Math.PI * 2);
  g.fill();

  const count = 5200;
  for (let i = 0; i < count; i++) {
    const arm = i % arms;
    const u = Math.pow(rand(), 0.62);
    const twist = u * Math.PI * 5.1;
    const theta = twist + (arm * Math.PI * 2) / arms + (rand() - 0.5) * (0.22 + u * 0.45);
    const rad = (0.04 + u * 0.9) * S * 0.46;
    const jitter = (6 + u * 34) * (rand() - 0.5);
    const x = cx + Math.cos(theta) * rad + jitter * 0.25;
    const y = cy + Math.sin(theta) * rad * 0.64 + jitter * 0.55;
    const core = 1 - u;
    const rr = Math.min(255, tint[0] * (0.55 + core * 0.55) + u * 40);
    const gg = Math.min(255, tint[1] * (0.6 + core * 0.4) + u * 30);
    const bb = Math.min(255, tint[2] * (0.65 + u * 0.45) + core * 20);
    const alpha = 0.08 + core * 0.55 + rand() * 0.12;
    const size = core * 1.8 + 0.35 + (rand() < 0.02 ? 1.3 : 0);
    g.fillStyle = `rgba(${rr | 0}, ${gg | 0}, ${bb | 0}, ${alpha})`;
    g.fillRect(x, y, size, size);
  }

  for (let i = 0; i < 700; i++) {
    const a = rand() * Math.PI * 2;
    const rad = Math.pow(rand(), 0.45) * S * 0.42;
    const x = cx + Math.cos(a) * rad;
    const y = cy + Math.sin(a) * rad * 0.66;
    g.fillStyle = `rgba(255, 250, 242, ${0.05 + rand() * 0.2})`;
    g.fillRect(x, y, rand() < 0.1 ? 1.6 : 0.8, rand() < 0.1 ? 1.6 : 0.8);
  }

  const coreG = g.createRadialGradient(cx, cy, 0, cx, cy, S * 0.14);
  coreG.addColorStop(0, "rgba(255, 252, 246, 0.95)");
  coreG.addColorStop(0.18, `rgba(${tint[0]}, ${tint[1]}, ${tint[2]}, 0.55)`);
  coreG.addColorStop(1, "rgba(255, 255, 255, 0)");
  g.fillStyle = coreG;
  g.beginPath();
  g.arc(cx, cy, S * 0.16, 0, Math.PI * 2);
  g.fill();

  return c;
}

export class SceneEngine {
  private ctx: CanvasRenderingContext2D;
  private stars: Star[] = [];
  private sprites = new Map<string, HTMLCanvasElement>();
  private day: ImageData | null = null;
  private night: ImageData | null = null;
  private globe = document.createElement("canvas");
  private gctx: CanvasRenderingContext2D | null;
  private globeKey = "";
  private last = 0;
  private stable = 0;
  private lastRadius = 0;
  w = 1;
  h = 1;
  private dpr = 1;

  constructor(private canvas: HTMLCanvasElement) {
    const ctx =
      canvas.getContext("2d", { alpha: false, desynchronized: true } as CanvasRenderingContext2DSettings) ||
      canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("canvas");
    this.ctx = ctx;
    this.gctx = this.globe.getContext("2d", { willReadFrequently: true });
    this.seedStars();
    for (const g of galaxies) {
      this.sprites.set(g.id, bakeGalaxy(g.tint, g.arms, g.seed));
    }
    this.resize();
    void this.loadTextures();
  }

  private seedStars() {
    const rand = mulberry32(42);
    const count = typeof window !== "undefined" && window.innerWidth < 720 ? 280 : 420;
    for (let i = 0; i < count; i++) {
      const bright = rand() < 0.018;
      this.stars.push({
        x: rand(),
        y: rand(),
        z: rand(),
        s: bright ? 1.8 + rand() * 1.1 : 0.35 + rand() * 1.05,
        a: bright ? 0.85 + rand() * 0.15 : 0.25 + rand() * 0.6,
        hue: rand(),
        ph: rand() * Math.PI * 2,
      });
    }
  }

  private async loadTextures() {
    try {
      const [dayImg, nightImg] = await Promise.all([
        loadImage("/earth-day.jpg"),
        loadImage("/earth-night.png"),
      ]);
      this.day = toImageData(dayImg);
      this.night = toImageData(nightImg);
      this.globeKey = "";
    } catch {
      this.day = null;
    }
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    if (w < 2 || h < 2) return;
    if (w === this.w && h === this.h && dpr === this.dpr && this.canvas.width === Math.round(w * dpr)) return;
    this.w = w;
    this.h = h;
    this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.globeKey = "";
  }

  render(p: number, time: number) {
    const ctx = this.ctx;
    const w = this.w;
    const h = this.h;
    const dt = this.last ? Math.min(0.05, time - this.last) : 0.016;
    this.last = time;

    ctx.fillStyle = "#07080c";
    ctx.fillRect(0, 0, w, h);

    const approach = smooth(clamp((p - 0.05) / 0.24, 0, 1));
    const enter = smooth(clamp((p - 0.24) / 0.14, 0, 1));
    const galaxyAlpha = 1 - smooth(clamp((p - 0.3) / 0.12, 0, 1));
    const systemsIn = smooth(clamp((p - 0.3) / 0.08, 0, 1));
    const systemsOut = smooth(clamp((p - 0.42) / 0.08, 0, 1));
    const systemsAlpha = systemsIn * (1 - systemsOut);
    const solarIn = smooth(clamp((p - 0.4) / 0.1, 0, 1));
    const solarOut = smooth(clamp((p - 0.6) / 0.1, 0, 1));
    const solarAlpha = solarIn * (1 - solarOut);
    const zoomT = smooth(clamp((p - 0.46) / 0.18, 0, 1));
    const solarScale = 0.34 * Math.pow(14, zoomT);
    const globeIn = smooth(clamp((p - 0.58) / 0.1, 0, 1));
    const grow = smooth(clamp((p - 0.6) / 0.16, 0, 1));
    const poster = smooth(clamp((p - 0.84) / 0.12, 0, 1));
    const nightMix = smooth(clamp((p - 0.7) / 0.12, 0, 1)) * (1 - poster * 0.35);
    const lights = smooth(clamp((p - 0.72) / 0.1, 0, 1));
    const mobile = w < 720;

    const b2b = galaxies[1];
    const spread = mobile ? 0.78 : 1;
    const unit = Math.min(w, h);
    const zoom = 1 + approach * 4.4 + enter * 8;
    const camX = b2b.x * spread * (approach * 0.94 + enter * 0.06);
    const camY = b2b.y * spread * (approach * 0.94 + enter * 0.06);

    this.drawMilky(galaxyAlpha * (1 - approach * 0.7));
    this.drawStars(time, approach + enter);

    const galaxyMarkers: Marker[] = [];
    const sprite = this.sprites.get("b2b");

    if (galaxyAlpha > 0.01 && sprite) {
      for (const d of dust) {
        const sx = w / 2 + (d.x * spread - camX) * unit * zoom;
        const sy = h / 2 + (d.y * spread - camY) * unit * zoom;
        const sr = d.s * unit * zoom;
        ctx.save();
        ctx.globalAlpha = d.a * galaxyAlpha * (1 - approach * 0.85);
        ctx.translate(sx, sy);
        ctx.rotate(d.rot + time * 0.01);
        ctx.drawImage(sprite, -sr, -sr, sr * 2, sr * 2);
        ctx.restore();
      }

      for (const g of galaxies) {
        const img = this.sprites.get(g.id);
        if (!img) continue;
        const gx = g.x * spread;
        const gy = g.y * spread;
        const sx = w / 2 + (gx - camX) * unit * zoom;
        const sy = h / 2 + (gy - camY) * unit * zoom;
        const sr = g.r * unit * zoom;
        let alpha = galaxyAlpha;
        if (g.id !== "b2b") alpha *= 1 - smooth(clamp((p - 0.08) / 0.2, 0, 1)) * 0.94;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(sx, sy);
        ctx.rotate(time * g.spin);
        ctx.drawImage(img, -sr, -sr, sr * 2, sr * 2);
        ctx.restore();

        let labelA = alpha;
        if (g.id === "b2b") labelA *= 1 - smooth(clamp((p - 0.16) / 0.1, 0, 1));
        if (mobile && g.id !== "b2c" && g.id !== "b2b") labelA = 0;
        if (sx < -80 || sy < -80 || sx > w + 80 || sy > h + 80) labelA = 0;
        galaxyMarkers.push({ id: g.id, x: sx, y: sy - sr * 0.72, a: labelA });
      }
    }

    const systemMarkers: Marker[] = [];
    if (systemsAlpha > 0.01) {
      const reach = unit * (mobile ? 0.34 : 0.42);
      for (const s of systems) {
        const x = w / 2 + s.x * reach;
        const y = h / 2 + s.y * reach * 0.86;
        const local = s.id === "space" ? systemsAlpha : systemsAlpha * (1 - systemsOut * 0.65);
        this.drawMiniSystem(x, y, s.s * (mobile ? 0.78 : 1), local, time, s.id === "space");
        systemMarkers.push({
          id: s.id,
          x,
          y: y + (s.id === "space" ? 86 : 52) * s.s,
          a: local * (s.id === "space" ? 1 : 0.85),
        });
      }
    }

    const earthNow = this.earthPlacement(time, solarScale, p, w, h);
    if (solarAlpha > 0.01) {
      this.drawSolar(earthNow, solarAlpha, time, solarScale);
    }

    const globeAlpha = globeIn;
    const narrow = w < 1180;
    const immerseR = unit * (mobile ? 0.52 : 0.62);
    const posterR = unit * (mobile ? 0.27 : narrow ? 0.29 : 0.34);
    const posterX = mobile ? w * 0.5 : narrow ? w * 0.76 : w * 0.69;
    const posterY = mobile ? h * 0.28 : h * 0.46;
    const x1 = earthNow.x + (w / 2 - earthNow.x) * grow;
    const y1 = earthNow.y + (h * 0.48 - earthNow.y) * grow;
    const r1 = Math.max(earthNow.r, 4) + (immerseR - Math.max(earthNow.r, 4)) * grow;
    const gx = x1 + (posterX - x1) * poster;
    const gy = y1 + (posterY - y1) * poster;
    const gr = r1 + (posterR - r1) * poster;

    const hero = -0.45;
    const rot = hero + time * 0.04 * (1 - poster);

    if (globeAlpha > 0.01 && gr > 3) {
      this.drawGlobe(gx, gy, gr, rot, nightMix, globeAlpha);
    }

    this.vignette(0.42 + poster * 0.12);

    if (globeAlpha > 0.01 && gr > 3 && lights > 0.02) {
      this.drawBuyers(gx, gy, gr, rot, lights, time);
    }

    const showBuyerText = lights * smooth(clamp((p - 0.86) / 0.08, 0, 1)) * (mobile ? 0 : 1);
    const buyerMarkers: Marker[] = buyers.map((b, i) => {
      const pt = project(b.lat, b.lon, rot, gx, gy, gr);
      if (!pt) return { id: String(i), x: 0, y: 0, a: 0 };
      const flip = pt.x > w - 168;
      return {
        id: String(i),
        x: flip ? pt.x - 10 : pt.x + 12,
        y: pt.y,
        a: b.named ? showBuyerText * pt.z : 0,
        shift: flip ? "translate(-100%, -50%)" : "translate(0, -50%)",
      };
    });

    const spaceLabelA = solarAlpha * (1 - zoomT * 0.85);
    const earthLabelA = solarAlpha * smooth(clamp((zoomT - 0.25) / 0.3, 0, 1)) * (1 - globeIn);

    return {
      galaxies: galaxyMarkers,
      systems: systemMarkers,
      buyers: buyerMarkers,
      space: { id: "sun", x: earthNow.originX, y: earthNow.originY + Math.max(36, earthNow.R * 0.14), a: spaceLabelA },
      earth: { id: "earth", x: earthNow.x + earthNow.r + 8, y: earthNow.y, a: earthLabelA },
    };
  }

  private earthPlacement(time: number, solarScale: number, p: number, w: number, h: number) {
    const R = Math.min(w, h) * 0.42 * solarScale;
    const ang = 2.15 + time * 0.045;
    const orbit = R * 0.4;
    const ex = Math.cos(ang) * orbit;
    const ey = Math.sin(ang) * orbit * 0.78;
    const pan = smooth(clamp((p - 0.5) / 0.14, 0, 1));
    const originX = w / 2 - ex * pan;
    const originY = h / 2 - ey * pan;
    return {
      originX,
      originY,
      R,
      ang,
      x: originX + ex,
      y: originY + ey,
      r: Math.max(1.2, R * 0.02),
    };
  }

  private drawMilky(alpha: number) {
    if (alpha < 0.01) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(this.w / 2, this.h / 2);
    ctx.rotate(-0.55);
    const mw = ctx.createLinearGradient(0, -this.h, 0, this.h);
    mw.addColorStop(0, "rgba(0,0,0,0)");
    mw.addColorStop(0.42, "rgba(150, 166, 190, 0.025)");
    mw.addColorStop(0.5, "rgba(214, 204, 186, 0.07)");
    mw.addColorStop(0.58, "rgba(150, 166, 190, 0.025)");
    mw.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = mw;
    ctx.fillRect(-this.w, -this.h, this.w * 2, this.h * 2);
    ctx.restore();
  }

  private drawStars(time: number, kick: number) {
    const ctx = this.ctx;
    const w = this.w;
    const h = this.h;
    ctx.fillStyle = "rgba(232, 234, 238, 0.55)";
    for (const st of this.stars) {
      const k = kick * (0.35 + st.z) * 0.22;
      const x = (st.x - 0.5) * w * (1 + k) + w / 2;
      const y = (st.y - 0.5) * h * (1 + k) + h / 2;
      if (x < -4 || y < -4 || x > w + 4 || y > h + 4) continue;
      const tw = 0.72 + 0.28 * Math.sin(time * (0.8 + st.z) + st.ph);
      ctx.globalAlpha = st.a * tw;
      if (st.hue > 0.86) ctx.fillStyle = "rgba(255, 228, 196, 1)";
      else if (st.hue < 0.08) ctx.fillStyle = "rgba(186, 206, 255, 1)";
      else ctx.fillStyle = "rgba(232, 234, 238, 1)";
      ctx.fillRect(x, y, st.s, st.s);
    }
    ctx.globalAlpha = 1;
  }

  private drawMiniSystem(x: number, y: number, scale: number, alpha: number, time: number, home: boolean) {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    const sunR = (home ? 11 : 7) * scale;
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, sunR * 4);
    g.addColorStop(0, home ? "rgba(255, 246, 226, 0.95)" : "rgba(255, 240, 214, 0.75)");
    g.addColorStop(0.35, home ? "rgba(224, 138, 79, 0.35)" : "rgba(200, 196, 180, 0.18)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, sunR * 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = home ? "#fff6e4" : "#f0e6d2";
    ctx.beginPath();
    ctx.arc(0, 0, sunR * 0.45, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 4; i++) {
      const orbit = (16 + i * 13) * scale;
      const ang = time * (0.25 + i * 0.05) + i * 1.3;
      ctx.strokeStyle = `rgba(235, 230, 220, ${home ? 0.18 : 0.1})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, 0, orbit, orbit * 0.7, -0.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = i === 2 && home ? "#8ec4d4" : "rgba(236, 232, 224, 0.85)";
      ctx.beginPath();
      ctx.arc(Math.cos(ang) * orbit, Math.sin(ang) * orbit * 0.7, (1.5 + (i === 3 ? 1.4 : 0)) * scale, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  private drawSolar(
    earth: { originX: number; originY: number; R: number; ang: number; x: number; y: number; r: number },
    alpha: number,
    time: number,
    _scale: number,
  ) {
    const ctx = this.ctx;
    const { originX, originY, R } = earth;
    ctx.save();
    ctx.globalAlpha = alpha;

    const sunR = R * 0.062;
    const bloom = ctx.createRadialGradient(originX, originY, 0, originX, originY, Math.min(420, sunR * 7));
    bloom.addColorStop(0, "rgba(255, 244, 220, 0.95)");
    bloom.addColorStop(0.18, "rgba(255, 196, 130, 0.35)");
    bloom.addColorStop(0.45, "rgba(224, 138, 79, 0.08)");
    bloom.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = bloom;
    ctx.beginPath();
    ctx.arc(originX, originY, Math.min(420, sunR * 7), 0, Math.PI * 2);
    ctx.fill();

    const planets = [
      { orbit: 0.18, r: 0.012, hi: "#d9d0c4", mid: "#8d8276", lo: "#3a342e", speed: 0.22, phase: 0.4 },
      { orbit: 0.28, r: 0.017, hi: "#f4e6cc", mid: "#c6a56e", lo: "#6a5430", speed: 0.17, phase: 1.5 },
      { orbit: 0.4, r: 0.02, hi: "#e7f6ff", mid: "#3c8fba", lo: "#0d3d56", speed: 0.045, phase: 2.15, earth: true },
      { orbit: 0.52, r: 0.015, hi: "#f2c6a6", mid: "#b85c3a", lo: "#4a2418", speed: 0.12, phase: 4.1 },
      { orbit: 0.7, r: 0.048, hi: "#f7ecd4", mid: "#c9aa78", lo: "#6d5434", speed: 0.07, phase: 0.9, bands: true },
      { orbit: 0.9, r: 0.04, hi: "#f4e7cc", mid: "#d2be9a", lo: "#7c6c4c", speed: 0.05, phase: 2.4, ring: true },
    ];

    if (R > 80) {
      ctx.save();
      ctx.translate(originX, originY);
      ctx.fillStyle = "rgba(210, 204, 190, 0.22)";
      for (let i = 0; i < 64; i++) {
        const a = (i / 64) * Math.PI * 2 + time * 0.01;
        const rad = R * (0.58 + ((i * 17) % 10) * 0.004);
        ctx.globalAlpha = 0.15 + (i % 5) * 0.04;
        ctx.fillRect(Math.cos(a) * rad, Math.sin(a) * rad * 0.78, 1.2, 1.2);
      }
      ctx.restore();
    }

    for (const pl of planets) {
      const ang = pl.earth ? earth.ang : pl.phase + time * pl.speed;
      const ox = Math.cos(ang) * R * pl.orbit;
      const oy = Math.sin(ang) * R * pl.orbit * 0.78;
      ctx.beginPath();
      ctx.ellipse(originX, originY, R * pl.orbit, R * pl.orbit * 0.78, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(235, 230, 220, 0.13)";
      ctx.lineWidth = 1;
      ctx.stroke();
      const px = originX + ox;
      const py = originY + oy;
      const pr = Math.max(pl.earth ? 1.4 : 0.8, R * pl.r);
      if (pl.ring) this.drawRing(px, py, pr, false);
      this.drawPlanet(px, py, pr, pl.hi, pl.mid, pl.lo, ox, oy, Boolean(pl.bands));
      if (pl.ring) this.drawRing(px, py, pr, true);
    }

    ctx.restore();
  }

  private drawPlanet(
    x: number,
    y: number,
    r: number,
    hi: string,
    mid: string,
    lo: string,
    ox: number,
    oy: number,
    bands: boolean,
  ) {
    const ctx = this.ctx;
    const len = Math.hypot(ox, oy) || 1;
    const lx = -ox / len;
    const ly = -oy / len;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.clip();
    const g = ctx.createRadialGradient(x + lx * r * 0.45, y + ly * r * 0.45, r * 0.1, x, y, r * 1.05);
    g.addColorStop(0, hi);
    g.addColorStop(0.55, mid);
    g.addColorStop(1, lo);
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
    if (bands && r > 4) {
      ctx.globalAlpha = 0.35;
      for (let i = -3; i <= 3; i++) {
        ctx.fillStyle = i % 2 === 0 ? "rgba(120, 72, 36, 0.45)" : "rgba(255, 236, 200, 0.25)";
        ctx.fillRect(x - r, y + i * r * 0.18, r * 2, r * 0.07);
      }
      ctx.globalAlpha = 1;
    }
    const sh = ctx.createRadialGradient(x + lx * r * 0.2, y + ly * r * 0.2, r * 0.2, x - lx * r * 0.2, y - ly * r * 0.2, r * 1.2);
    sh.addColorStop(0, "rgba(0,0,0,0)");
    sh.addColorStop(0.55, "rgba(0,0,0,0.05)");
    sh.addColorStop(1, "rgba(0,0,0,0.72)");
    ctx.fillStyle = sh;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
    ctx.restore();
  }

  private drawRing(x: number, y: number, r: number, front: boolean) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.45);
    ctx.scale(1, 0.32);
    ctx.beginPath();
    ctx.arc(0, 0, r * 2.15, front ? 0 : Math.PI, front ? Math.PI : Math.PI * 2);
    ctx.strokeStyle = "rgba(226, 210, 176, 0.72)";
    ctx.lineWidth = Math.max(1, r * 0.42);
    ctx.stroke();
    ctx.restore();
  }

  private drawGlobe(x: number, y: number, radius: number, rot: number, nightMix: number, alpha: number) {
    const ctx = this.ctx;
    const painted = this.paintGlobe(radius, rot, nightMix);
    ctx.save();
    ctx.globalAlpha = alpha;
    if (painted) {
      ctx.drawImage(painted, x - radius, y - radius, radius * 2, radius * 2);
    } else {
      const g = ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.35, radius * 0.1, x, y, radius);
      g.addColorStop(0, "#d5f1fb");
      g.addColorStop(0.45, "#2f86a8");
      g.addColorStop(1, "#071820");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(x, y, radius + Math.max(1.5, radius * 0.012), 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(150, 198, 214, ${0.45 * alpha})`;
    ctx.lineWidth = Math.max(2, radius * 0.025);
    ctx.stroke();
    ctx.restore();
  }

  private paintGlobe(radius: number, rot: number, nightMix: number) {
    if (!this.day || !this.gctx) return null;
    const wanted = Math.round(radius * 2);
    if (Math.abs(wanted - this.lastRadius) > 16) {
      this.stable = 0;
      this.lastRadius = wanted;
    } else {
      this.stable += 1;
    }
    // Keep texture resolution modest — full-frame pixel loops are the main cost.
    const cap = this.stable > 8 ? 480 : 220;
    const size = Math.max(64, Math.min(cap, wanted));
    const rotQ = Math.round(rot * 14) / 14;
    const nightQ = Math.round(nightMix * 8) / 8;
    const key = `${size}|${rotQ}|${nightQ}`;
    if (key === this.globeKey && this.globe.width === size) return this.globe;
    this.globe.width = size;
    this.globe.height = size;
    const gctx = this.gctx;
    gctx.clearRect(0, 0, size, size);
    const img = gctx.getImageData(0, 0, size, size);
    const out = img.data;
    const day = this.day;
    const night = this.night;
    const dw = day.width;
    const dh = day.height;
    const dd = day.data;
    const nw = night?.width ?? 1;
    const nh = night?.height ?? 1;
    const nd = night?.data;
    const lx = -0.38;
    const ly = 0.26;
    const lz = 0.89;

    for (let y = 0; y < size; y++) {
      const py = 1 - ((y + 0.5) / size) * 2;
      const py2 = py * py;
      if (py2 >= 1) continue;
      const half = Math.sqrt(1 - py2);
      const x0 = Math.max(0, Math.floor(((1 - half) * 0.5) * size));
      const x1 = Math.min(size - 1, Math.ceil(((1 + half) * 0.5) * size));
      for (let x = x0; x <= x1; x++) {
        const px = ((x + 0.5) / size) * 2 - 1;
        const r2 = px * px + py2;
        if (r2 > 1) continue;
        const pz = Math.sqrt(1 - r2);
        const lat = Math.asin(clamp(py, -1, 1));
        let u = (Math.atan2(px, pz) + rot) / (Math.PI * 2);
        u -= Math.floor(u);
        const v = (Math.PI / 2 - lat) / Math.PI;
        const tx = Math.min(dw - 1, (u * (dw - 1)) | 0);
        const ty = Math.min(dh - 1, (v * (dh - 1)) | 0);
        const di = (ty * dw + tx) * 4;
        const ndotl = px * lx + py * ly + pz * lz;
        const dayW = clamp(ndotl, 0, 1);
        const shade = 0.1 + 0.95 * Math.pow(dayW, 0.78);
        let r = dd[di] * shade;
        let gch = dd[di + 1] * shade;
        let b = dd[di + 2] * shade;
        const nightW = clamp(-ndotl, 0, 1) * nightMix;
        if (nd && nightW > 0.02) {
          const ntx = Math.min(nw - 1, (u * (nw - 1)) | 0);
          const nty = Math.min(nh - 1, (v * (nh - 1)) | 0);
          const ni = (nty * nw + ntx) * 4;
          const luma = (nd[ni] + nd[ni + 1] + nd[ni + 2]) / 3;
          const city = clamp((luma - 18) / 70, 0, 1);
          r = r * (1 - nightW) + (10 + nd[ni] * city) * nightW;
          gch = gch * (1 - nightW) + (16 + nd[ni + 1] * city * 0.8) * nightW;
          b = b * (1 - nightW) + (28 + nd[ni + 2] * city * 0.4) * nightW;
        }
        const fres = Math.pow(1 - pz, 2);
        r += 70 * fres;
        gch += 130 * fres;
        b += 160 * fres;
        const i = (y * size + x) * 4;
        out[i] = r > 255 ? 255 : r;
        out[i + 1] = gch > 255 ? 255 : gch;
        out[i + 2] = b > 255 ? 255 : b;
        out[i + 3] = 255;
      }
    }
    gctx.putImageData(img, 0, 0);
    this.globeKey = key;
    return this.globe;
  }

  private drawBuyers(gx: number, gy: number, gr: number, rot: number, amount: number, time: number) {
    const ctx = this.ctx;
    buyers.forEach((b, i) => {
      const pt = project(b.lat, b.lon, rot, gx, gy, gr);
      if (!pt) return;
      const pulse = 0.75 + 0.25 * Math.sin(time * 1.7 + i);
      const a = amount * (0.45 + pt.z * 0.55) * pulse;
      const rad = 7 + pt.z * 16;
      const glow = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, rad);
      glow.addColorStop(0, `rgba(255, 228, 200, ${0.95 * a})`);
      glow.addColorStop(0.25, `rgba(224, 138, 79, ${0.55 * a})`);
      glow.addColorStop(1, "rgba(224, 138, 79, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, rad, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  private vignette(strength: number) {
    const ctx = this.ctx;
    const w = this.w;
    const h = this.h;
    const v = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.2, w / 2, h * 0.55, Math.max(w, h) * 0.72);
    v.addColorStop(0, "rgba(0,0,0,0)");
    v.addColorStop(1, `rgba(0,0,0,${strength})`);
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, w, h);
  }
}

function project(lat: number, lon: number, rot: number, gx: number, gy: number, gr: number) {
  const phi = (lat * Math.PI) / 180;
  const lambda = (lon * Math.PI) / 180 + rot;
  const x3 = Math.cos(phi) * Math.sin(lambda);
  const y3 = Math.sin(phi);
  const z3 = Math.cos(phi) * Math.cos(lambda);
  if (z3 < 0.08) return null;
  return { x: gx + x3 * gr, y: gy - y3 * gr, z: z3 };
}
