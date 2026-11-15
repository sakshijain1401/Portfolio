export const site = {
  name: "Sakshi Jain",
  role: "Marketing Strategist and Planner",
  place: "Noida, India",
  email: "hello@sakshi.mail",
} as const;

export const beats = [
  {
    kicker: "Sakshi Jain  ·  Marketing Strategist and Planner",
    title: "Start with the whole field.",
    deck: "India has roughly 1.85 million active companies. That is the sky. Scroll inward — the market gets specific.",
  },
  {
    kicker: "B2B and B2G",
    title: "Most firms sell to other firms.",
    deck: "Around 1.3 million of those companies work mainly through B2B or government channels — not shopfront retail.",
  },
  {
    kicker: "Inside that market",
    title: "Every industry is a system.",
    deck: "Fintech, logistics, healthcare, industrial, space. Each is its own solar system. Space technology is only one of them.",
  },
  {
    kicker: "Space technology",
    title: "Still a whole system.",
    deck: "India has 400+ space startups, plus traditional aerospace suppliers. Downstream is not the whole system — it is one layer in it.",
  },
  {
    kicker: "Downstream",
    title: "Where the buyers live.",
    deck: "About 260 Indian space startups work on Earth applications — Earth observation, navigation, analytics, SATCOM. That is the ground.",
  },
  {
    kicker: "You are here",
    title: "I work at that last scale.",
    deck: "Downstream space in India is a short list you can finish reading. Positioning, narrative, and pipeline for that size of market.",
  },
] as const;

/** Four fixed levels — India market hierarchy for the Field story. */
export const scaleRows = [
  {
    n: 1_850_000,
    display: "~1.85M",
    label: "Active companies",
    detail: "Operating in India · MCA, rounded",
  },
  {
    n: 1_300_000,
    display: "~1.3M",
    label: "B2B / B2G focus",
    detail: "About 72% of active companies · rounded",
  },
  {
    n: 400,
    display: "~400",
    label: "Space startups",
    detail: "Private space entities · IN-SPACe / ISpA",
  },
  {
    n: 260,
    display: "~260",
    label: "Downstream space",
    detail: "EO, navigation, analytics, SATCOM · rounded",
    here: true,
  },
] as const;

/** Scroll stages: fixed display strings only — no live counting. */
export const numberAnchors = [
  { p: 0.14, display: "~1.85M", caption: "active companies in India" },
  { p: 0.3, display: "~1.3M", caption: "B2B and B2G companies" },
  { p: 0.45, display: "~400", caption: "space startups in India" },
  { p: 0.62, display: "~260", caption: "downstream space startups" },
] as const;

export const whatIDo = [
  {
    n: "01",
    title: "Brand and Narrative",
    items: [
      "Positioning",
      "Storytelling",
      "Brand voice",
      "Content strategy",
      "Copywriting",
      "Translation — orbit to outcome",
      "Narrative systems",
    ],
    blurb:
      "Signal clarity before volume — the story has to hold when the list is short enough to memorize.",
  },
  {
    n: "02",
    title: "Marketing and Growth",
    items: [
      "Product marketing",
      "Go-to-market",
      "List building",
      "Sequence design",
      "Email & trigger campaigns",
      "Marketing operations",
      "Partnerships",
      "Enablement",
    ],
    blurb:
      "Sequences, lists, and triggers tuned for a niche where a short list of accounts is the whole year.",
  },
  {
    n: "03",
    title: "Leadership",
    items: [
      "Marketing leadership",
      "Workshops & briefings",
      "Cross-functional alignment",
      "Executive communications",
      "Public speaking",
      "Team development",
    ],
    blurb:
      "Briefings and alignment that keep orbit language and ground language in the same room.",
  },
] as const;

export const buyers = [
  { lat: 50, lon: 6, label: "A grid operator", named: true },
  { lat: 22, lon: 74, label: "A commodity desk", named: true },
  { lat: 26, lon: 50, label: "An energy desk", named: true },
  { lat: 60, lon: 18, label: "A mapping office", named: true },
  { lat: 1, lon: 104, label: "A coastal city", named: false },
  { lat: -14, lon: -48, label: "A forestry office", named: false },
  { lat: 40, lon: -78, label: "An insurer", named: false },
  { lat: 35, lon: 140, label: "A port authority", named: false },
] as const;
