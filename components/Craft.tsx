"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Reveal } from "@/components/Reveal";
import { prefersCoarsePointer, takePillar } from "@/lib/nav-memory";
import { whatIDo } from "@/lib/site";

type Flight = {
  index: number;
  landed: boolean;
  style: CSSProperties;
};

const FLIGHT_MS = 680;

function relativeBox(el: DOMRect, stage: DOMRect) {
  return {
    left: el.left - stage.left,
    top: el.top - stage.top,
    width: el.width,
    height: el.height,
  };
}

function skipFlight() {
  if (typeof window === "undefined") return true;
  return (
    prefersCoarsePointer() ||
    document.documentElement.classList.contains("reduce") ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function Craft() {
  const [active, setActive] = useState<number | null>(null);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [flying, setFlying] = useState(false);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const dockRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<number | null>(null);
  const landTimer = useRef<number | null>(null);
  const touchMode = useRef(false);

  const clearFlight = useCallback(() => {
    if (landTimer.current) {
      window.clearTimeout(landTimer.current);
      landTimer.current = null;
    }
    activeRef.current = null;
    setActive(null);
    setFlight(null);
    setFlying(false);
  }, []);

  const openInstant = useCallback((index: number) => {
    if (landTimer.current) {
      window.clearTimeout(landTimer.current);
      landTimer.current = null;
    }
    activeRef.current = index;
    setActive(index);
    setFlying(false);
    setFlight({ index, landed: true, style: {} });

    requestAnimationFrame(() => {
      const dock = dockRef.current;
      if (dock && prefersCoarsePointer()) {
        dock.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }, []);

  const launch = useCallback(
    (index: number, instant = false) => {
      if (activeRef.current === index) return;

      if (instant || skipFlight()) {
        openInstant(index);
        return;
      }

      const item = itemRefs.current[index];
      const dock = dockRef.current;
      const stage = stageRef.current;
      if (!item || !dock || !stage) {
        openInstant(index);
        return;
      }

      if (landTimer.current) {
        window.clearTimeout(landTimer.current);
        landTimer.current = null;
      }

      const stageBox = stage.getBoundingClientRect();
      const fromEl = item.querySelector(".craft-hit")?.getBoundingClientRect() ?? item.getBoundingClientRect();
      const from = relativeBox(fromEl, stageBox);
      const to = relativeBox(dock.getBoundingClientRect(), stageBox);

      const sx = to.width > 0 ? from.width / to.width : 1;
      const sy = to.height > 0 ? from.height / to.height : 1;
      const dx = from.left - to.left;
      const dy = from.top - to.top;

      activeRef.current = index;
      setActive(index);
      setFlying(false);
      setFlight({
        index,
        landed: false,
        style: {
          left: `${to.left}px`,
          top: `${to.top}px`,
          width: `${to.width}px`,
          height: `${to.height}px`,
          ["--craft-dx" as string]: `${dx}px`,
          ["--craft-dy" as string]: `${dy}px`,
          ["--craft-sx" as string]: String(sx),
          ["--craft-sy" as string]: String(sy),
        },
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (activeRef.current !== index) return;
          setFlying(true);
          landTimer.current = window.setTimeout(() => {
            setFlight((cur) => (cur && cur.index === index ? { ...cur, landed: true } : cur));
            setFlying(false);
            landTimer.current = null;
          }, FLIGHT_MS);
        });
      });
    },
    [openInstant],
  );

  useEffect(() => {
    const resolvePillar = () => {
      const remembered = takePillar();
      if (remembered != null) return remembered;
      const params = new URLSearchParams(window.location.search);
      const raw = params.get("pillar");
      if (raw == null) return null;
      const index = Number(raw);
      return Number.isFinite(index) ? index : null;
    };

    const openFromMemory = () => {
      // Hard refresh should stay at the desk — never auto-open from leftover memory.
      const nav = performance.getEntriesByType?.("navigation")?.[0] as
        | PerformanceNavigationTiming
        | undefined;
      const isReload =
        nav?.type === "reload" ||
        (performance as Performance & { navigation?: { type: number } }).navigation?.type === 1;
      if (isReload || document.documentElement.dataset.sakshiBoot === "top") return;

      const index = resolvePillar();
      if (index == null || index < 0 || index >= whatIDo.length) return;
      openInstant(index);
      // Drop ?pillar= after opening so a refresh does not stick on this section.
      if (window.location.search.includes("pillar=")) {
        window.history.replaceState({}, "", window.location.pathname);
      }
    };

    const onArrive = (event: Event) => {
      const hash = (event as CustomEvent<{ hash?: string }>).detail?.hash;
      if (hash === "#work-do") openFromMemory();
    };

    const t = window.setTimeout(openFromMemory, 100);
    window.addEventListener("sakshi:arrive", onArrive);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("sakshi:arrive", onArrive);
      if (landTimer.current) window.clearTimeout(landTimer.current);
    };
  }, [openInstant]);

  const pillar = active !== null ? whatIDo[active] : null;
  const showFlyer = Boolean(flight && !flight.landed && pillar);
  const landed = Boolean(flight?.landed && pillar);

  return (
    <section
      className={`craft${active !== null ? " is-open" : ""}`}
      id="work-do"
      onMouseLeave={() => {
        if (!touchMode.current && !prefersCoarsePointer()) clearFlight();
      }}
    >
      <div className="craft-sky" aria-hidden="true">
        <div className="craft-sky-wash" />
        <div className="craft-sky-dots" />
        <div className="craft-sky-orbit">
          <i />
          <i />
          <i />
          <span className="craft-sky-core" />
          <span className="craft-sky-tick t1" />
          <span className="craft-sky-tick t2" />
          <span className="craft-sky-tick t3" />
        </div>
      </div>

      <Reveal as="header" className="craft-head">
        <p className="kicker">What I do</p>
        <h2>Three lines of work. One market size.</h2>
        <p>
          Downstream marketing for space technology — where the list is short, the language has to travel, and a
          lead is remembered.
        </p>
      </Reveal>

      <div className="craft-stage" ref={stageRef}>
        <ul className="craft-list">
          {whatIDo.map((pillarItem, i) => {
            const lifted = active === i;
            return (
              <li
                key={pillarItem.n}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className={lifted ? "is-lifted" : undefined}
              >
                <button
                  type="button"
                  className="craft-hit"
                  aria-expanded={lifted}
                  onMouseEnter={() => {
                    if (!prefersCoarsePointer()) launch(i);
                  }}
                  onFocus={() => {
                    if (!prefersCoarsePointer()) launch(i);
                  }}
                  onPointerDown={(event) => {
                    touchMode.current = event.pointerType === "touch" || event.pointerType === "pen";
                  }}
                  onClick={() => {
                    if (active === i) clearFlight();
                    else launch(i, touchMode.current || prefersCoarsePointer());
                  }}
                >
                  <span className="craft-hit-fill">
                    <span className="craft-index" aria-hidden="true">
                      {pillarItem.n}
                    </span>
                    <span className="craft-body">
                      <span className="craft-title">{pillarItem.title}</span>
                      <span className="craft-tags">
                        {pillarItem.items.map((item, j) => (
                          <span key={item}>
                            {j > 0 ? <i aria-hidden="true"> · </i> : null}
                            {item}
                          </span>
                        ))}
                      </span>
                    </span>
                  </span>
                  <span className="craft-slot" aria-hidden="true">
                    <span />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <aside className="craft-visual" aria-live="polite">
          <div className={`craft-dock${landed ? " is-filled" : ""}`} ref={dockRef}>
            {landed && pillar ? (
              <article key={pillar.n} className="craft-panel">
                <p className="kicker">{pillar.n}</p>
                <h3>{pillar.title}</h3>
                <hr className="craft-tall-rule is-solid" />
                <p>{pillar.blurb}</p>
                <ul>
                  {pillar.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ) : null}
          </div>
        </aside>

        {showFlyer && pillar && flight ? (
          <div
            className={`craft-flyer${flying ? " is-flying" : ""}`}
            style={flight.style}
            aria-hidden="true"
          >
            <div className="craft-flyer-spin">
              <div className="craft-flyer-face craft-flyer-face--front">
                <span className="craft-index">{pillar.n}</span>
                <div className="craft-body">
                  <span className="craft-title">{pillar.title}</span>
                  <span className="craft-tags">
                    {pillar.items.slice(0, 4).map((item, j) => (
                      <span key={item}>
                        {j > 0 ? <i aria-hidden="true"> · </i> : null}
                        {item}
                      </span>
                    ))}
                  </span>
                </div>
              </div>
              <div className="craft-flyer-face craft-flyer-face--back">
                <p className="kicker">{pillar.n}</p>
                <h3>{pillar.title}</h3>
                <hr className="craft-tall-rule" />
                <p>{pillar.blurb}</p>
                <ul>
                  {pillar.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
