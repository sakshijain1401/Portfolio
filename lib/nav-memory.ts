const SCROLL_KEY = "sakshi:home-scroll";
const PILLAR_KEY = "sakshi:open-pillar";
const RETURN_KEY = "sakshi:return-home";

export function rememberHomeScroll(y = typeof window !== "undefined" ? window.scrollY : 0) {
  try {
    sessionStorage.setItem(SCROLL_KEY, String(Math.round(y)));
    sessionStorage.setItem(RETURN_KEY, "1");
  } catch {
    /* ignore */
  }
}

/** Stamp the current history entry so browser-back lands on projects, not bare `/`. */
export function stampProjectsHash() {
  try {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (url.pathname !== "/") return;
    if (url.hash === "#projects") return;
    url.hash = "projects";
    history.replaceState(history.state, "", url);
  } catch {
    /* ignore */
  }
}

export function peekHomeScroll() {
  try {
    const raw = sessionStorage.getItem(SCROLL_KEY);
    if (raw == null) return null;
    const y = Number(raw);
    return Number.isFinite(y) ? y : null;
  } catch {
    return null;
  }
}

export function takeHomeScroll() {
  try {
    const raw = sessionStorage.getItem(SCROLL_KEY);
    sessionStorage.removeItem(SCROLL_KEY);
    if (raw == null) return null;
    const y = Number(raw);
    return Number.isFinite(y) ? y : null;
  } catch {
    return null;
  }
}

export function isReturningHome() {
  try {
    return sessionStorage.getItem(RETURN_KEY) === "1" || peekHomeScroll() != null;
  } catch {
    return false;
  }
}

export function clearReturningHome() {
  try {
    sessionStorage.removeItem(RETURN_KEY);
  } catch {
    /* ignore */
  }
}

export function rememberPillar(index: number) {
  try {
    sessionStorage.setItem(PILLAR_KEY, String(index));
  } catch {
    /* ignore */
  }
}

export function takePillar() {
  try {
    const raw = sessionStorage.getItem(PILLAR_KEY);
    sessionStorage.removeItem(PILLAR_KEY);
    if (raw == null) return null;
    const index = Number(raw);
    return Number.isFinite(index) ? index : null;
  } catch {
    return null;
  }
}

export function prefersCoarsePointer() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}
