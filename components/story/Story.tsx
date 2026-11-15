"use client";

import { useEffect, useRef } from "react";
import { beats, buyers, scaleRows, site } from "@/lib/site";
import { interfaceState, SceneEngine } from "./engine";

const galaxyTags = [
  { id: "b2c", title: "B2C", sub: "Consumer" },
  { id: "b2b", title: "B2B", sub: "Business — enter" },
  { id: "mkt", title: "Marketplaces", sub: "Platforms" },
  { id: "dtc", title: "Direct", sub: "To consumer" },
];

const systemTags = [
  { id: "fintech", title: "Fintech" },
  { id: "logistics", title: "Logistics" },
  { id: "healthcare", title: "Healthcare" },
  { id: "industrial", title: "Industrial" },
  { id: "space", title: "Space technology" },
];

const STAGES = ["Field", "B2B", "Systems", "Space", "Earth", "Niche"] as const;

export function Story() {
  const trackRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const canvas = root?.querySelector("canvas");
    if (!root || !track || !canvas) return;

    const engine = new SceneEngine(canvas);
    const reduce = document.documentElement.classList.contains("reduce");
    let raf = 0;
    let current = 0;
    let alive = true;
    let lastShown = -1;
    let lastStage = -1;
    let lastNum = "";
    let lastCap = "";
    let lastScale = "";
    let lastRead = -1;
    let lastPlate = -1;
    let lastChrome = -1;
    let scrolling = true;
    let scrollIdle = 0;
    let onScreen = true;

    const beatEls = Array.from(root.querySelectorAll<HTMLElement>("[data-beat]"));
    const tagEls = new Map<string, HTMLElement>();
    const tagCache = new Map<string, { o: number; t: string }>();
    root.querySelectorAll<HTMLElement>("[data-tag]").forEach((el) => {
      tagEls.set(el.dataset.tag || "", el);
    });
    const numEl = root.querySelector<HTMLElement>("[data-num]");
    const capEl = root.querySelector<HTMLElement>("[data-cap]");
    const readEl = root.querySelector<HTMLElement>("[data-readout]");
    const plateEl = root.querySelector<HTMLElement>("[data-plate]");
    const scaleEl = document.querySelector<HTMLElement>("[data-scale]");
    const railEl = root.querySelector<HTMLElement>("[data-rail]");
    const stageEl = root.querySelector<HTMLElement>("[data-stage]");
    const chromeEl = document.querySelector<HTMLElement>("[data-chrome]");
    const progEl = root.querySelector<HTMLElement>("[data-progress-label]");
    const railMarks = Array.from(root.querySelectorAll<HTMLElement>(".rail-marks li"));
    const brandMark = chromeEl?.querySelector(".brand-mark");

    const place = (id: string, x: number, y: number, a: number, shift = "translate(-50%, -130%)") => {
      const el = tagEls.get(id);
      if (!el) return;
      const opacity = a < 0.02 ? 0 : a;
      const transform = `translate3d(${x}px, ${y}px, 0) ${shift}`;
      const prev = tagCache.get(id);
      if (!prev || prev.o !== opacity) {
        el.style.opacity = String(opacity);
      }
      if (!prev || prev.t !== transform) {
        el.style.transform = transform;
      }
      tagCache.set(id, { o: opacity, t: transform });
    };

    const apply = (p: number, time: number) => {
      const ui = interfaceState(p);
      const frame = engine.render(p, time);

      beatEls.forEach((el, i) => {
        const next = ui.beats[i] ?? 0;
        if (el.style.opacity !== String(next)) el.style.opacity = String(next);
      });

      if (numEl && ui.number !== lastNum) {
        lastNum = ui.number;
        numEl.textContent = ui.number;
        numEl.style.color = ui.copper ? "#f2c2a0" : "#ebe6dc";
      }
      if (capEl && ui.caption !== lastCap) {
        lastCap = ui.caption;
        capEl.textContent = ui.caption;
      }
      if (readEl && Math.abs(ui.readout - lastRead) > 0.008) {
        lastRead = ui.readout;
        readEl.style.opacity = String(ui.readout);
      }
      if (plateEl && Math.abs(ui.plate - lastPlate) > 0.008) {
        lastPlate = ui.plate;
        plateEl.style.opacity = String(ui.plate);
      }
      if (scaleEl && ui.scale !== lastScale) {
        lastScale = ui.scale;
        scaleEl.textContent = ui.scale;
      }
      if (railEl) railEl.style.height = `${ui.rail * 100}%`;

      const active = new Set<string>();
      for (const m of frame.galaxies) {
        active.add(m.id);
        place(m.id, m.x, m.y, m.a);
      }
      for (const m of frame.systems) {
        active.add(m.id);
        place(m.id, m.x, m.y, m.a, "translate(-50%, 0)");
      }
      for (const m of frame.buyers) {
        const id = `buyer-${m.id}`;
        active.add(id);
        place(id, m.x, m.y, m.a, m.shift || "translate(0, -50%)");
      }
      active.add("sun");
      place("sun", frame.space.x, frame.space.y, frame.space.a, "translate(-50%, 0)");
      active.add("earth-tag");
      place("earth-tag", frame.earth.x, frame.earth.y, frame.earth.a, "translate(10px, -50%)");

      tagEls.forEach((_, id) => {
        if (active.has(id)) return;
        const prev = tagCache.get(id);
        if (prev && prev.o === 0) return;
        place(id, 0, 0, 0);
      });
    };

    const fadeStage = () => {
      const rect = track.getBoundingClientRect();
      const total = track.offsetHeight - window.innerHeight;
      const enter = Math.max(0, Math.min(1, 1 - rect.top / (window.innerHeight * 0.72)));
      const over = Math.max(0, -rect.top - total);
      const leave = Math.max(0, Math.min(1, over / (window.innerHeight * 0.45)));
      const opacity = enter * (1 - leave);
      const hidden = opacity < 0.02;
      onScreen = !hidden;
      if (stageEl) {
        stageEl.style.opacity = String(opacity);
        stageEl.style.visibility = hidden ? "hidden" : "visible";
      }
      if (chromeEl && Math.abs(opacity - lastChrome) > 0.01) {
        lastChrome = opacity;
        chromeEl.style.opacity = String(opacity);
        chromeEl.style.visibility = hidden ? "hidden" : "visible";
        const links = chromeEl.querySelectorAll<HTMLElement>("a, button");
        links.forEach((el) => {
          el.style.pointerEvents = opacity > 0.65 ? "auto" : "none";
        });
      }
      return { total, target: total > 0 ? Math.max(0, Math.min(1, -rect.top / total)) : 0 };
    };

    const syncStage = (p: number) => {
      const stage = Math.min(STAGES.length - 1, Math.floor(p * STAGES.length));
      if (stage === lastStage) return;
      lastStage = stage;
      railMarks.forEach((el, i) => {
        el.classList.toggle("is-on", i <= stage);
      });
      brandMark?.classList.toggle("is-lit", stage >= 4);
    };

    if (reduce) {
      apply(0.96, 1.2);
      if (stageEl) stageEl.style.opacity = "1";
      syncStage(0.96);
      if (progEl) progEl.textContent = "100%";
      return () => {
        alive = false;
      };
    }

    const onResize = () => engine.resize();
    const onScroll = () => {
      scrolling = true;
      scrollIdle = 0;
    };
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    const loop = (ts: number) => {
      if (!alive) return;
      const { target } = fadeStage();

      if (!document.hidden && onScreen) {
        const delta = target - current;
        // Snappier catch-up while scrolling; settle quickly when near target.
        const ease = scrolling ? 0.22 : 0.14;
        current += delta * ease;
        if (Math.abs(delta) < 0.00025) {
          current = target;
          scrollIdle += 1;
          if (scrollIdle > 8) scrolling = false;
        } else {
          scrolling = true;
          scrollIdle = 0;
        }

        apply(current, ts / 1000);

        const shown = Math.round(current * 100);
        if (shown !== lastShown) {
          lastShown = shown;
          if (progEl) progEl.textContent = `${String(shown).padStart(2, "0")}%`;
        }
        syncStage(current);
        raf = requestAnimationFrame(loop);
        return;
      }

      // Off-screen or tab hidden — idle until scroll brings the field back.
      scrolling = false;
      scrollIdle = 0;
      raf = 0;
    };

    const wake = () => {
      if (!alive || raf) return;
      scrolling = true;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("scroll", wake, { passive: true });
    document.addEventListener("visibilitychange", wake);
    raf = requestAnimationFrame(loop);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", wake);
      document.removeEventListener("visibilitychange", wake);
    };
  }, []);

  const skipToArrival = () => {
    const track = trackRef.current;
    if (!track) return;
    const top = track.offsetTop + (track.offsetHeight - window.innerHeight) * 0.97;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const skipToWork = () => {
    const work = document.getElementById("work");
    if (work) {
      work.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    skipToArrival();
  };

  return (
    <div className="story-root" ref={rootRef}>
      <header className="chrome" data-chrome>
        <a className="wordmark brand-mark" href="#desk">
          <span className="brand-mark-name">{site.name}</span>
          <span className="brand-mark-hair" aria-hidden="true" />
          <span className="sr-only">
            , {site.role}, {site.place}
          </span>
        </a>
        <p className="scale-read" data-scale>
          01   The field
        </p>
        <div className="chrome-actions">
          <button className="skip skip--ghost" type="button" onClick={skipToArrival}>
            The arrival
          </button>
          <button className="skip" type="button" onClick={skipToWork}>
            Skip to work
          </button>
        </div>
      </header>

      <div className="track" id="top" ref={trackRef}>
        <div className="stage" data-stage aria-hidden="true">
          <canvas />
          <div className="scrim" />
          <div className="rail" aria-hidden="true">
            <span data-rail />
            <ol className="rail-marks">
              {STAGES.map((label) => (
                <li key={label}>
                  <i />
                  <em>{label}</em>
                </li>
              ))}
            </ol>
            <p className="rail-pct" data-progress-label>
              00%
            </p>
          </div>

          {galaxyTags.map((g) => (
            <div className="tag" data-tag={g.id} key={g.id}>
              <b>{g.title}</b>
              <span>{g.sub}</span>
            </div>
          ))}
          {systemTags.map((s) => (
            <div
              className={s.id === "space" ? "tag system home" : "tag system"}
              data-tag={s.id}
              key={s.id}
            >
              <b>{s.title}</b>
            </div>
          ))}
          <div className="tag system home" data-tag="sun">
            <b>Space technology</b>
          </div>
          <div className="tag" data-tag="earth-tag">
            <b>Downstream</b>
            <span>Earth</span>
          </div>
          {buyers.map((b, i) => (
            <div className="tag buyer" data-tag={`buyer-${i}`} key={b.label}>
              <b>{b.label}</b>
            </div>
          ))}

          <div className="readout" data-readout>
            <p className="kicker">Market size</p>
            <p className="num" data-num>
              ~1.85M
            </p>
            <p className="cap" data-cap>
              active companies in India
            </p>
          </div>

          <aside className="plate" data-plate>
            <p className="kicker">India · four levels</p>
            <ol>
              {scaleRows.map((row) => {
                const here = "here" in row && row.here;
                const logMax = Math.log10(scaleRows[0].n);
                const barPct = Math.max(6, (Math.log10(row.n) / logMax) * 100);
                return (
                  <li key={row.label} className={here ? "here" : undefined}>
                    <div className="top">
                      <strong>{row.display}</strong>
                      <em>{row.label}</em>
                    </div>
                    <div className="bar">
                      <i style={{ width: `${barPct.toFixed(2)}%` }} />
                    </div>
                    <small>
                      {row.detail}
                      {here ? " · You are here" : ""}
                    </small>
                  </li>
                );
              })}
            </ol>
          </aside>

          <div className="copy">
            {beats.map((beat, i) => (
              <article className="beat" data-beat={i} key={beat.title}>
                <p className="kicker">{beat.kicker}</p>
                <h2>{beat.title}</h2>
                <p>{beat.deck}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
      <p className="sr-only">
        Approximate India market scale for B2B space marketing. About 1.85 million active companies. About 1.3 million
        operate mainly as B2B or B2G. About 400 space startups. About 260 of those work in downstream applications —
        Earth observation, navigation, analytics, and SATCOM. Sakshi Jain is a B2B space marketer in Noida, India,
        working at that downstream scale. Figures are rounded from MCA, IN-SPACe / ISpA, and related reports.
      </p>
    </div>
  );
}
