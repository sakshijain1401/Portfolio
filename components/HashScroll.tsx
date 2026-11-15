"use client";

import { useEffect } from "react";
import {
  clearReturningHome,
  peekHomeScroll,
  rememberPillar,
  takeHomeScroll,
} from "@/lib/nav-memory";

const SECTION_HASH = /^#(desk|top|work|work-do|projects|contact)$/;

/** PerformanceNavigationTiming.type stays "reload" for the whole document — gate only once. */
let reloadGateDone = false;

function isReloadNav() {
  const nav = performance.getEntriesByType?.("navigation")?.[0] as
    | PerformanceNavigationTiming
    | undefined;
  if (nav) return nav.type === "reload";
  return (performance as Performance & { navigation?: { type: number } }).navigation?.type === 1;
}

function scrollToTarget(hash: string, behavior: ScrollBehavior = "auto") {
  const id = hash.replace(/^#/, "");
  if (!id) return false;
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior, block: "start" });
  return true;
}

function restoreScroll(y: number) {
  window.scrollTo({ top: y, behavior: "auto" });
}

function clearBootFlag() {
  delete document.documentElement.dataset.sakshiBoot;
}

export function HashScroll() {
  useEffect(() => {
    let cancelled = false;

    const applyHash = (hash: string) => {
      const go = () => {
        if (cancelled) return;
        scrollToTarget(hash, "auto");
        window.dispatchEvent(new CustomEvent("sakshi:arrive", { detail: { hash } }));
        takeHomeScroll();
        clearReturningHome();
      };
      go();
      window.setTimeout(go, 120);
      window.setTimeout(go, 320);
    };

    const run = () => {
      if (cancelled) return;

      const params = new URLSearchParams(window.location.search);
      const pillarParam = params.get("pillar");
      if (pillarParam != null) {
        const index = Number(pillarParam);
        if (Number.isFinite(index)) rememberPillar(index);
      }

      const hash = window.location.hash;
      const saved = peekHomeScroll();
      const hasSection =
        Boolean(hash) && hash !== "#" && hash !== "#desk" && SECTION_HASH.test(hash);

      // Soft returns and deep links always win — including after an earlier F5 in this tab.
      if (hasSection) {
        reloadGateDone = true;
        clearBootFlag();
        applyHash(hash);
        return;
      }

      if (saved != null) {
        reloadGateDone = true;
        clearBootFlag();
        const y = takeHomeScroll() ?? saved;
        clearReturningHome();
        const go = () => {
          if (cancelled) return;
          restoreScroll(y);
        };
        go();
        window.setTimeout(go, 120);
        window.setTimeout(go, 320);
        return;
      }

      // Hard refresh of `/` with no section intent — land at the desk once.
      if (!reloadGateDone && isReloadNav()) {
        reloadGateDone = true;
        try {
          sessionStorage.removeItem("sakshi:home-scroll");
          sessionStorage.removeItem("sakshi:return-home");
          sessionStorage.removeItem("sakshi:open-pillar");
        } catch {
          /* ignore */
        }
        if (SECTION_HASH.test(hash || "")) {
          history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
        }
        clearBootFlag();
        window.scrollTo(0, 0);
        return;
      }

      reloadGateDone = true;

      if (document.documentElement.dataset.sakshiBoot === "top") {
        clearBootFlag();
        window.scrollTo(0, 0);
      }
    };

    const t = window.setTimeout(run, 0);
    window.addEventListener("hashchange", run);
    window.addEventListener("pageshow", run);

    return () => {
      cancelled = true;
      window.clearTimeout(t);
      window.removeEventListener("hashchange", run);
      window.removeEventListener("pageshow", run);
    };
  }, []);

  return null;
}
