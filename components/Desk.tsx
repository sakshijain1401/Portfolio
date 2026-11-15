"use client";

import { useEffect, useRef } from "react";
import { site } from "@/lib/site";

/** Chosen from Sakshi’s skill set — short enough to pack, then shatter into the name. */
const SKILLS = [
  "Full-Funnel",
  "Go-to-Market",
  "SaaS",
  "B2B",
  "Personas",
  "CRO",
  "Lead Gen",
  "Pipeline",
  "Founder-Led",
  "Brand Identity",
  "Design Systems",
  "Collateral",
  "Brochures",
  "One-Pagers",
  "Standees",
  "Giveaways",
  "Corporate Deck",
  "Case Studies",
  "Nurture",
  "LinkedIn",
  "Webinars",
  "Social",
  "Earned Media",
  "PR",
  "SEO",
  "Storytelling",
  "Backlinks",
  "Pillars",
  "Analytics",
  "Search Console",
  "Power BI",
  "Dashboards",
  "A/B Testing",
  "Reporting",
  "Funnels",
  "Bing",
  "Zoho CRM",
  "Martech",
  "Segmentation",
  "Automation",
  "Agentic AI",
  "Prompting",
  "Canva",
  "Excel",
  "PowerPoint",
  "Plane",
  "Slack",
  "ChatGPT",
  "Claude",
  "Systems",
  "Collaboration",
  "Stakeholder",
  "Leadership",
  "Thought Leadership",
];

/**
 * Continuous timeline — no blank gap between words / spray / name.
 * HOLD → CROSS (words dissolve into their own dots) → SPRAY → BUILD.
 */
const HOLD = 2100;
const CROSS = 450;
const SPRAY = 650;
const BUILD = 3000;
const TOTAL = HOLD + CROSS + SPRAY + BUILD;
const PARTICLE_CAP = 3000;

type Word = {
  text: string;
  x: number;
  y: number;
  size: number;
  copper: boolean;
  rot: number;
  phase: number;
};

type Particle = {
  bx: number;
  by: number;
  /** precomputed shatter rest */
  sx: number;
  sy: number;
  hx: number;
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  s: number;
  delay: number;
  copper: boolean;
  dy: number;
};

function enterField() {
  const track = document.getElementById("top");
  if (!track) return;
  const top = track.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: "smooth" });
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function rasterName(family: string, width: number, height: number) {
  const off = document.createElement("canvas");
  off.width = width;
  off.height = height;
  const g = off.getContext("2d", { willReadFrequently: true });
  if (!g) return null;
  const size = Math.max(84, Math.min(width * 0.22, height * 0.3, 220));
  g.fillStyle = "#fff";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = `520 ${size}px ${family}`;
  if ("letterSpacing" in g) g.letterSpacing = "-0.045em";
  g.fillText("Sakshi", width / 2, height / 2 - size * 0.46);
  g.font = `italic 460 ${size}px ${family}`;
  if ("letterSpacing" in g) g.letterSpacing = "-0.04em";
  g.fillText("Jain", width / 2, height / 2 + size * 0.5);
  return { pixels: g.getImageData(0, 0, width, height).data, size };
}

function packWords(width: number, height: number, sans: string): Word[] {
  const words: Word[] = [];
  const boxes: { x: number; y: number; w: number; h: number }[] = [];
  const measure = document.createElement("canvas").getContext("2d");
  if (!measure) return words;

  const sizes =
    width < 720
      ? [42, 34, 28, 22, 18, 15]
      : [72, 58, 48, 38, 30, 24, 18];

  const texts = [...SKILLS];
  for (let i = texts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [texts[i], texts[j]] = [texts[j], texts[i]];
  }

  const pad = width < 720 ? 6 : 10;
  const marginX = width * 0.04;
  const marginY = height * 0.08;

  for (let i = 0; i < texts.length; i++) {
    const len = texts[i].length;
    const base =
      len > 16 ? sizes[sizes.length - 1] : len > 11 ? sizes[Math.min(4, sizes.length - 1)] : sizes[i % sizes.length];
    const size = base * (0.92 + Math.random() * 0.16);
    measure.font = `700 ${size}px ${sans}`;
    const tw = measure.measureText(texts[i]).width;
    const th = size * 1.05;
    let placed = false;
    for (let attempt = 0; attempt < 140 && !placed; attempt++) {
      const x = marginX + Math.random() * (width - marginX * 2);
      const y = marginY + Math.random() * (height - marginY * 2);
      const box = { x: x - tw / 2, y: y - th / 2, w: tw, h: th };
      const hit = boxes.some(
        (b) =>
          box.x < b.x + b.w + pad &&
          box.x + box.w + pad > b.x &&
          box.y < b.y + b.h + pad &&
          box.y + box.h + pad > b.y,
      );
      if (hit) continue;
      if (box.x < 4 || box.y < 4 || box.x + box.w > width - 4 || box.y + box.h > height - 4) continue;
      boxes.push(box);
      words.push({
        text: texts[i],
        x,
        y,
        size,
        copper: i % 5 === 0 || i % 7 === 0,
        rot: (Math.random() - 0.5) * 0.12,
        phase: Math.random() * Math.PI * 2,
      });
      placed = true;
    }
  }
  return words;
}

function sampleNameDots(pixels: Uint8ClampedArray, width: number, height: number, size: number) {
  let gap = Math.max(3, Math.round(size / 38));
  const homes: { hx: number; hy: number; s: number }[] = [];
  const collect = (step: number) => {
    homes.length = 0;
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        if (pixels[(y * width + x) * 4 + 3] < 40) continue;
        homes.push({ hx: x, hy: y, s: 1.4 + Math.random() * 0.9 });
      }
    }
  };
  collect(gap);
  if (homes.length > PARTICLE_CAP) collect(gap + 1);
  if (homes.length > PARTICLE_CAP) collect(gap + 2);
  return homes;
}

function shatterWords(
  words: Word[],
  homes: { hx: number; hy: number; s: number }[],
  sans: string,
  width: number,
  height: number,
): Particle[] {
  const stamp = document.createElement("canvas");
  const g = stamp.getContext("2d", { willReadFrequently: true });
  if (!g) return [];

  type Seed = { x: number; y: number; copper: boolean };
  const seeds: Seed[] = [];
  const cx = width * 0.5;
  const cy = height * 0.45;

  for (const word of words) {
    const step = Math.max(3, Math.round(word.size / 12));
    stamp.width = Math.ceil(word.size * word.text.length * 0.72) + 24;
    stamp.height = Math.ceil(word.size * 1.5);
    g.clearRect(0, 0, stamp.width, stamp.height);
    g.font = `700 ${word.size}px ${sans}`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillStyle = "#fff";
    g.fillText(word.text, stamp.width / 2, stamp.height / 2);
    const data = g.getImageData(0, 0, stamp.width, stamp.height).data;
    const cos = Math.cos(word.rot);
    const sin = Math.sin(word.rot);
    for (let y = 0; y < stamp.height; y += step) {
      for (let x = 0; x < stamp.width; x += step) {
        if (data[(y * stamp.width + x) * 4 + 3] < 90) continue;
        const lx = x - stamp.width / 2;
        const ly = y - stamp.height / 2;
        seeds.push({
          x: word.x + lx * cos - ly * sin,
          y: word.y + lx * sin + ly * cos,
          copper: word.copper,
        });
      }
    }
  }

  if (!seeds.length) return [];

  let maxHx = 1;
  for (const home of homes) maxHx = Math.max(maxHx, home.hx);

  seeds.sort((a, b) => a.x - b.x || a.y - b.y);
  const homesSorted = [...homes].sort((a, b) => a.hx - b.hx || a.hy - b.hy);
  const particles: Particle[] = [];
  const budget = width < 720 ? Math.min(PARTICLE_CAP, 1600) : PARTICLE_CAP;
  const n = Math.min(seeds.length, homesSorted.length, budget);

  for (let i = 0; i < n; i++) {
    const seed = seeds[Math.floor((i / n) * seeds.length)];
    const home = homesSorted[Math.floor((i / n) * homesSorted.length)];
    const ang = Math.atan2(seed.y - cy, seed.x - cx) + Math.sin(home.hx * 0.04) * 0.55;
    const burst = 6 + (home.s % 1) * 16;
    const sx = seed.x + Math.cos(ang) * burst + Math.sin(home.hy * 0.05) * 6;
    const sy = seed.y + Math.sin(ang) * burst + Math.cos(home.hx * 0.05) * 6;
    const tdy = home.hy - sy;
    const tlen = Math.hypot(home.hx - sx, tdy) || 1;
    particles.push({
      bx: seed.x,
      by: seed.y,
      sx,
      sy,
      hx: home.hx,
      hy: home.hy,
      x: seed.x,
      y: seed.y,
      vx: 0,
      vy: 0,
      s: home.s,
      delay: (home.hx / maxHx) * 0.22 + (home.hy / height) * 0.05,
      copper: seed.copper,
      dy: tdy / tlen,
    });
  }
  return particles;
}

export function Desk() {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fontRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const fontEl = fontRef.current;
    if (!root || !canvas || !fontEl) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduce = document.documentElement.classList.contains("reduce");
    const mouse = { x: -9999, y: -9999, inside: false };
    let words: Word[] = [];
    let particles: Particle[] = [];
    let sans = "sans-serif";
    let raf = 0;
    let alive = true;
    let start = 0;
    let opened = false;
    let wash: CanvasGradient | null = null;
    let mouseGlow: CanvasGradient | null = null;
    let mouseGlowX = -1;
    let mouseGlowY = -1;
    const seek = Number(new URLSearchParams(location.search).get("at"));
    const freeze = new URLSearchParams(location.search).has("freeze");
    const dprCap = Math.min(window.devicePixelRatio || 1, 1.5);
    const html = document.documentElement;

    let unlockTimer = 0;
    let pinTop = false;

    const finish = () => {
      if (opened) return;
      opened = true;
      pinTop = false;
      window.clearTimeout(unlockTimer);
      root.classList.add("is-open");
      root.setAttribute("aria-busy", "false");
      html.classList.remove("entering");
    };

    /** Deep link / return from a project — don't lock scroll or replay the intro pin. */
    const hash = location.hash;
    let returning = false;
    try {
      returning =
        sessionStorage.getItem("sakshi:return-home") === "1" ||
        sessionStorage.getItem("sakshi:home-scroll") != null;
    } catch {
      returning = false;
    }
    const deepLink = Boolean((hash && hash !== "#" && hash !== "#desk") || returning);
    const settleParticles = () => {
      for (const p of particles) {
        p.x = p.hx;
        p.y = p.hy;
        p.vx = 0;
        p.vy = 0;
      }
    };

    const resize = () => {
      const w = root.clientWidth;
      const h = root.clientHeight;
      if (w < 2 || h < 2) return;
      canvas.width = Math.round(w * dprCap);
      canvas.height = Math.round(h * dprCap);
      ctx.setTransform(dprCap, 0, 0, dprCap, 0, 0);
      const family = getComputedStyle(fontEl).fontFamily || "Georgia, serif";
      sans = getComputedStyle(document.body).fontFamily || "sans-serif";
      const raster = rasterName(family, w, h);
      if (!raster) return;
      words = packWords(w, h, sans);
      const homes = sampleNameDots(raster.pixels, w, h, raster.size);
      particles = shatterWords(words, homes, sans, w, h);
      for (const p of particles) {
        p.x = p.bx;
        p.y = p.by;
        p.vx = 0;
        p.vy = 0;
      }
      wash = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, Math.min(w, h) * 0.7);
      wash.addColorStop(0, "rgba(224, 138, 79, 0.07)");
      wash.addColorStop(0.4, "rgba(142, 196, 212, 0.035)");
      wash.addColorStop(1, "rgba(7, 8, 12, 0)");
      mouseGlow = null;
    };

    const drawWords = (now: number, holdT: number, crossT: number) => {
      // Fade only while dots are already sitting on the glyphs
      if (crossT >= 1) return;
      const wordAlpha = crossT > 0 ? 1 - easeInOut(crossT) : 1;
      if (wordAlpha < 0.02) return;
      const drift = holdT < 1 && crossT <= 0 ? Math.sin(now * 0.0008) : 0;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const appear = easeOutCubic(clamp((holdT * 1.45 - (i / words.length) * 0.32) / 0.38, 0, 1));
        const alpha = appear * wordAlpha;
        if (alpha < 0.02) continue;
        ctx.globalAlpha = alpha;
        ctx.font = `700 ${word.size}px ${sans}`;
        ctx.fillStyle = word.copper ? "#e08a4f" : "#ebe6dc";
        // Skip save/rotate during crossfade — cheaper, no jitter
        if (crossT > 0 || Math.abs(word.rot) < 0.02) {
          ctx.fillText(
            word.text,
            word.x + drift * (word.copper ? 2 : 1),
            word.y + Math.cos(now * 0.001 + word.phase) * (crossT > 0 ? 0 : 1.1),
          );
        } else {
          ctx.save();
          ctx.translate(word.x + drift * (word.copper ? 2 : 1), word.y + Math.cos(now * 0.001 + word.phase) * 1.1);
          ctx.rotate(word.rot);
          ctx.fillText(word.text, 0, 0);
          ctx.restore();
        }
      }
      ctx.globalAlpha = 1;
    };

    // Reused draw buffers — avoid per-frame array alloc / GC spikes
    const bufIvory = new Float32Array(PARTICLE_CAP * 4);
    const bufCopper = new Float32Array(PARTICLE_CAP * 4);
    const bufSpark = new Float32Array(PARTICLE_CAP * 4);

    const paintBuf = (buf: Float32Array, count: number, color: string, alpha: number) => {
      if (count <= 0) return;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      for (let i = 0; i < count; i++) {
        const o = i * 4;
        ctx.fillRect(buf[o], buf[o + 1], buf[o + 2], buf[o + 2]);
      }
    };

    const drawParticles = (
      now: number,
      w: number,
      h: number,
      crossT: number,
      sprayT: number,
      buildT: number,
      live: boolean,
      prewarm: number,
    ) => {
      let nIvory = 0;
      let nCopper = 0;
      let nSpark = 0;
      const radius = Math.min(w, h) * 0.12;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        let size = p.s;
        let warm = 0;

        if (!live) {
          if (buildT > 0) {
            // Always visible: spray rest → name. Tiny stagger, never dim out.
            const fly = easeInOut(clamp((buildT - p.delay * 0.12) / 0.88, 0, 1));
            const lift = Math.sin(fly * Math.PI) * 12;
            p.x = p.sx + (p.hx - p.sx) * fly - p.dy * lift * 0.15;
            p.y = p.sy + (p.hy - p.sy) * fly - lift;
            size = p.s * (1 + (1 - fly) * 0.55);
            const frontier = Math.sin(clamp((fly - 0.4) / 0.45, 0, 1) * Math.PI);
            warm = Math.max(p.copper && fly < 0.75 ? 0.55 * (1 - fly) : 0, frontier * 0.9);
          } else if (sprayT > 0) {
            const local = easeOutCubic(sprayT);
            p.x = p.bx + (p.sx - p.bx) * local;
            p.y = p.by + (p.sy - p.by) * local;
            size = p.s * (1.15 - local * 0.2);
            warm = p.copper ? 0.85 - local * 0.4 : 0;
          } else {
            // Cross / prewarm: dots sit exactly on the glyphs under the words
            p.x = p.bx;
            p.y = p.by;
            size = p.s * (0.95 + crossT * 0.25);
            warm = p.copper ? 0.9 : 0;
            // During pure hold prewarm, still draw (soft underlay)
            if (crossT <= 0 && prewarm < 0.02) continue;
          }
        } else {
          let tx = p.hx;
          let ty = p.hy;
          if (mouse.inside) {
            const mdx = p.hx - mouse.x;
            const mdy = p.hy - mouse.y;
            const dist = Math.hypot(mdx, mdy);
            if (dist < radius && dist > 0.5) {
              const push = (1 - dist / radius) ** 2 * 56;
              tx += (mdx / dist) * push;
              ty += (mdy / dist) * push;
            }
          }
          if (freeze || reduce) {
            p.x = tx;
            p.y = ty;
          } else {
            p.vx += (tx - p.x) * 0.16;
            p.vy += (ty - p.y) * 0.16;
            p.vx += Math.sin(now * 0.0011 + p.hx * 0.03) * 0.02;
            p.vy += Math.cos(now * 0.0009 + p.hy * 0.03) * 0.02;
            p.vx *= 0.7;
            p.vy *= 0.7;
            p.x += p.vx;
            p.y += p.vy;
          }
          if (mouse.inside) {
            warm = Math.max(0, 1 - Math.hypot(p.x - mouse.x, p.y - mouse.y) / radius);
          }
          size = p.s * (1 + warm * 0.35);
        }

        if (warm > 0.55 && nSpark < PARTICLE_CAP) {
          const o = nSpark * 4;
          bufSpark[o] = p.x;
          bufSpark[o + 1] = p.y;
          bufSpark[o + 2] = size + warm * 0.8;
          nSpark += 1;
        } else if ((p.copper || warm > 0.25) && nCopper < PARTICLE_CAP) {
          const o = nCopper * 4;
          bufCopper[o] = p.x;
          bufCopper[o + 1] = p.y;
          bufCopper[o + 2] = size;
          nCopper += 1;
        } else if (nIvory < PARTICLE_CAP) {
          const o = nIvory * 4;
          bufIvory[o] = p.x;
          bufIvory[o + 1] = p.y;
          bufIvory[o + 2] = size;
          nIvory += 1;
        }
      }

      // Soft underlay while words still show; full strength once words are gone
      const under = crossT <= 0 ? 0.35 * prewarm : 0.55 + crossT * 0.35;
      const body = live ? 0.88 : buildT > 0 || sprayT > 0 ? 0.9 : under;
      paintBuf(bufIvory, nIvory, "#ebe6dc", body);
      paintBuf(bufCopper, nCopper, "#e08a4f", live ? 0.9 : 0.92);
      paintBuf(bufSpark, nSpark, "#f2c2a0", 0.95);
      ctx.globalAlpha = 1;
    };

    const draw = (now: number) => {
      if (!alive) return;
      const w = root.clientWidth;
      const h = root.clientHeight;
      const elapsed = freeze && Number.isFinite(seek) ? seek : reduce ? TOTAL : now - start;
      const live = elapsed >= TOTAL;
      if (live) finish();

      ctx.fillStyle = "#07080c";
      ctx.fillRect(0, 0, w, h);

      const holdT = clamp(elapsed / HOLD, 0, 1);
      const crossT = clamp((elapsed - HOLD) / CROSS, 0, 1);
      const sprayT = clamp((elapsed - HOLD - CROSS) / SPRAY, 0, 1);
      const buildT = clamp((elapsed - HOLD - CROSS - SPRAY) / BUILD, 0, 1);
      // Warm the particle pass under the words before the dissolve so the first shatter frame isn't a hitch
      const prewarm = clamp((elapsed - (HOLD - 280)) / 280, 0, 1);

      if (!live && wash) {
        ctx.fillStyle = wash;
        ctx.fillRect(0, 0, w, h);
      }

      // Dots first (under), then words on top during cross — continuous dissolve
      if (live || crossT > 0 || sprayT > 0 || buildT > 0 || prewarm > 0) {
        drawParticles(now, w, h, crossT, sprayT, buildT, live, prewarm);
      }

      if (!live) drawWords(now, holdT, crossT);

      if (live && mouse.inside) {
        if (!mouseGlow || mouseGlowX !== mouse.x || mouseGlowY !== mouse.y) {
          const radius = Math.min(w, h) * 0.12;
          mouseGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, radius);
          mouseGlow.addColorStop(0, "rgba(224, 138, 79, 0.08)");
          mouseGlow.addColorStop(1, "rgba(224, 138, 79, 0)");
          mouseGlowX = mouse.x;
          mouseGlowY = mouse.y;
        }
        ctx.fillStyle = mouseGlow;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, Math.min(w, h) * 0.12, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!live && buildT > 0.78) {
        const bloom = easeOutCubic(clamp((buildT - 0.78) / 0.22, 0, 1));
        ctx.fillStyle = `rgba(224, 138, 79, ${0.035 * bloom})`;
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.48, Math.min(w, h) * 0.2, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduce && !freeze) raf = requestAnimationFrame(draw);
    };

    const skip = () => {
      if (opened) return;
      start = performance.now() - TOTAL;
    };
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
      mouse.inside = true;
      mouseGlow = null;
    };
    const onLeave = () => {
      mouse.inside = false;
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") skip();
    };

    let cancelled = false;
    const onScrollPin = () => {
      if (pinTop && window.scrollY > 1) window.scrollTo(0, 0);
    };
    const boot = async () => {
      try {
        await document.fonts.ready;
      } catch {
        /* fallback face */
      }
      if (cancelled) return;
      resize();
      canvas.style.opacity = "1";

      // Refresh / deep-link: browser restores scroll mid-page while intro
      // sets overflow:hidden — that freezes the viewport. Skip the lock.
      if (reduce || deepLink || freeze) {
        settleParticles();
        start = performance.now() - TOTAL;
        finish();
        if (freeze) draw(performance.now());
        else raf = requestAnimationFrame(draw);
        return;
      }

      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      pinTop = true;
      window.scrollTo(0, 0);
      html.classList.add("entering");
      start = performance.now() - (Number.isFinite(seek) ? seek : 0);
      // Hard unlock if rAF stalls (tab backgrounded, etc.)
      unlockTimer = window.setTimeout(finish, TOTAL + 800);
      raf = requestAnimationFrame(draw);
    };
    void boot();

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScrollPin, { passive: true });
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    window.addEventListener("keydown", onKey);

    return () => {
      cancelled = true;
      alive = false;
      pinTop = false;
      cancelAnimationFrame(raf);
      window.clearTimeout(unlockTimer);
      html.classList.remove("entering");
      root.classList.remove("is-open");
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScrollPin);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <section className="namefield" id="desk" ref={rootRef} aria-label="Sakshi Jain" aria-busy="true">
      <h1 ref={fontRef}>Sakshi Jain</h1>
      <canvas ref={canvasRef} aria-hidden="true" />
      <div className="namefield-bar">
        <p>
          {site.role}
          <span> · </span>
          {site.place}
        </p>
        <button type="button" onClick={enterField}>
          The field
        </button>
      </div>
    </section>
  );
}
