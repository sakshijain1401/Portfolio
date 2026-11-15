export type ProjectSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};


export type Project = {
  slug: string;
  title: string;
  dek: string;
  /** Optional release / subhead under the title */
  release?: string;
  category: string;
  date: string;
  readMinutes: number;
  /** Index into `whatIDo` — Brand and Narrative, Marketing and Growth, or Leadership */
  pillar: 0 | 1 | 2;
  image: string;
  imageAlt: string;
  /** Real photo shown as a framed figure instead of a full-bleed crop */
  frame?: { width: number; height: number };
  /** Focal point for the list thumbnail crop */
  photoPosition?: string;
  featured?: boolean;
  /** Simple Medium-style paragraphs when no case sections */
  body?: string[];
  /** Structured case study blocks */
  sections?: ProjectSection[];
  coda?: { heading: string; body: string };
  tags?: string[];
  source?: { href: string; label: string };
};

export const projects: Project[] = [
  {
    slug: "turning-satellite-analysis-into-a-national-story",
    title: "Turning satellite analysis into a national environmental story",
    release: "Manipur deforestation — alarming trends and emerging hope",
    dek: "A World Environment Day geospatial story grounded in satellite evidence — then carried by Business Standard, NDTV, a former Chief Minister, and court citations.",
    category: "PR & Earned Media",
    date: "2025-06-05",
    readMinutes: 6,
    pillar: 0,
    featured: true,
    image: "/projects/manipur-ndtv.png",
    imageAlt: "NDTV: satellite data shows Manipur lost 52,000 acres of forest in four years",
    frame: { width: 1024, height: 746 },
    photoPosition: "72% 38%",
    sections: [
      {
        heading: "The challenge",
        paragraphs: [
          "In a technical industry, some of the most valuable stories are hidden inside the data. Our geospatial team had analysed deforestation across Manipur using high-resolution satellite imagery and advanced geospatial techniques, tracking changes from 2021. The opportunity was to turn this technical work into something that journalists, policymakers, environmental organisations, and the wider public could understand.",
          "For World Environment Day 2025, I saw an opportunity to tell a more complete story. Rather than focusing exclusively on deforestation, we could also highlight afforestation — presenting both the environmental challenge and signs of emerging hope. The story needed to remain grounded in scientific analysis while giving the media a compelling reason to pay attention.",
        ],
      },
      {
        heading: "My approach",
        paragraphs: [
          "I developed the central narrative and gave the story its title: Manipur Deforestation: A Closer Look at Alarming Trends and Emerging Hope.",
          "My focus was to bridge the gap between technical evidence and public interest — framing the findings so the significance of the data stayed accessible without losing the scientific foundation behind it.",
          "I led the PR effort to take this story beyond a company announcement. The narrative centred on a regional environmental issue with national relevance, demonstrating how satellite intelligence could help people understand changes on the ground. Afforestation made the story more nuanced than a conventional report on damage alone.",
          "The initiative also showed a principle of B2B technology marketing: a product does not always need to be the headline. Sometimes, showing what the technology helps us discover is a more powerful way to establish credibility.",
        ],
      },
      {
        heading: "The impact",
        bullets: [
          "Digital coverage from Business Standard and NDTV, alongside local newspaper coverage.",
          "Journalists independently approached us for further information and stories.",
          "A former Chief Minister of Manipur commented on X using our findings.",
          "Organisations including NESAC sought the data; it was later cited in multiple reports and presented in court proceedings.",
          "What began as a technical analysis became a public-interest narrative with a life beyond the original campaign.",
        ],
      },
    ],
    coda: {
      heading: "What this project demonstrates",
      body: "I can identify a newsworthy angle in complex technical work, build a compelling narrative around evidence, and connect a specialist company’s capabilities to a broader public conversation. Effective PR is not simply about getting coverage — it is about creating information others find valuable enough to reference, investigate, and use.",
    },
    tags: ["PR", "Earned Media", "Data Storytelling", "Thought Leadership"],
  },
  {
    slug: "building-a-consistent-brand-system",
    title: "Building a consistent brand system across departments",
    dek: "A practical brand infrastructure — assets, guidelines, and adoption — so every department could work from one recognisable system.",
    category: "Brand Strategy",
    date: "2024-11-18",
    readMinutes: 6,
    pillar: 0,
    image: "/projects/02-field.jpg",
    imageAlt: "At an ISRO exhibit, with launch vehicle models",
    frame: { width: 768, height: 1024 },
    sections: [
      {
        heading: "The challenge",
        paragraphs: [
          "As the company’s marketing function developed, one of my priorities was to establish a consistent brand experience across every department and customer touchpoint.",
          "Teams regularly needed presentations, proposals, reports, product information, event materials, and internal documents — but resources were not organised into a single standardised system. Materials were recreated often, guidelines were thin, and secondary brand marks, product imagery, and visual rules needed further development.",
          "The challenge was not simply to look more polished. It was to create practical brand infrastructure that supported everyday work across a technically complex business.",
        ],
      },
      {
        heading: "My approach",
        paragraphs: [
          "I led the brand identity and design-system initiative, coordinating the creation of approximately 20–40 standardised assets across five to six departments, including Sales, Finance, HR, and Operations.",
          "I treated it as internal enablement rather than a standalone design exercise — making the right materials easy to find, understand, and reuse. The central repository included:",
        ],
        bullets: [
          "Corporate and domain-specific presentation decks",
          "Product one-pagers and standardised company profiles",
          "Document, proposal, quotation, and invoice templates",
          "HR templates organised around different processes",
          "Logo variations, product imagery, and visual assets",
          "Event collateral, branded giveaways, and presentation elements",
          "Case-study frameworks and other reusable marketing resources",
        ],
      },
      {
        heading: "Adoption",
        paragraphs: [
          "I also worked with the team to establish guidelines for consistent brand use. The repository was organised into folders and shared with department managers so each team could reach what it needed.",
          "Adoption required ongoing communication. Some teams were used to creating materials independently — sharing the repository was not enough. I followed up by email, communicated updates, and reinforced use of the standardised resources.",
        ],
      },
      {
        heading: "The impact",
        bullets: [
          "Teams gained a common source of approved information and reusable assets.",
          "Less starting from scratch on presentations and documents.",
          "Stronger consistency across customer-facing materials and a more recognisable visual identity.",
          "A foundation that could scale as products, partnerships, and marketing expanded.",
        ],
      },
    ],
    coda: {
      heading: "What this project demonstrates",
      body: "I understand branding as more than aesthetics. A strong brand system should improve recognition externally and make execution easier internally. By combining design direction, operational organisation, and cross-functional adoption, I helped turn scattered resources into a reusable system that supported the company’s growth.",
    },
    tags: ["Brand Strategy", "Visual Identity", "Marketing Enablement", "Cross-functional Leadership"],
  },
  {
    slug: "making-complex-space-tech-understandable",
    title: "Making complex space technology understandable",
    release: "Executive storytelling for an IN-SPACe TV interview",
    dek: "Interview design for a technical CTO — accessible for first-time viewers without sounding staged or oversimplified.",
    category: "Executive Communications",
    date: "2025-03-12",
    readMinutes: 5,
    pillar: 0,
    image: "/projects/03-studio.jpg",
    imageAlt: "Studio recording for the IN-SPACe interview",
    frame: { width: 1024, height: 768 },
    sections: [
      {
        heading: "The challenge",
        paragraphs: [
          "Spatial intelligence combines satellite data, multiple sensors, artificial intelligence, and specialised analysis. Explaining these capabilities to people who already know the industry is one challenge; explaining them to people encountering the technology for the first time is another.",
          "For a growing company, executive communication is a major trust moment. When the subject is highly technical, interviews can become too specialised, too product-focused, or hard for a general audience to follow.",
          "I wanted leadership communication to do more than describe what the technology could do. It needed to explain why it mattered.",
        ],
      },
      {
        heading: "My approach",
        paragraphs: [
          "I led preparation for an interview featuring our CTO through an IN-SPACe initiative showcasing Indian space startups — one person asking, one answering, intended for television broadcast.",
          "Rather than treating it as a routine media appearance, I approached it as a narrative-design exercise.",
          "I developed questions around real-world situations and examples so an unfamiliar audience could understand the problem before meeting the technology — start relatable, establish the challenge, then raise the technical level step by step.",
          "I also drafted suggested answers that reflected the company’s core narrative. They were not meant to replace the CTO’s expertise or voice — they gave a structure he could personalise so the conversation stayed natural and credible.",
          "We reviewed questions and answers together, incorporated his inputs, and walked through the flow once. Because the questions were rooted in real situations, preparation focused on clarity and confidence rather than memorising a script.",
        ],
      },
      {
        heading: "The impact",
        bullets: [
          "The interview was recorded successfully and completed efficiently.",
          "The recording team praised the clarity of the preparation and said it helped them understand the domain.",
          "At the time of these notes it had not yet been broadcast — so the value sits in the communication framework and the preparation of a technical leader for a broader audience.",
        ],
      },
    ],
    coda: {
      heading: "What this project demonstrates",
      body: "I can translate complex technology into accessible messaging without losing its substance. I also know how to support technical executives: preserve their expertise, organise their ideas, and create a conversation that helps the audience understand both the technology and its real-world relevance.",
    },
    tags: ["Executive Communications", "Messaging Strategy", "Interview Preparation", "Technical Storytelling"],
  },
  {
    slug: "launching-spade-at-indian-space-conclave",
    title: "Launching SPADE by turning an industry event into a product stage",
    release: "Indian Space Conclave, 5–7 November 2024",
    dek: "A subscription SaaS for multi-sensor satellite data, launched on the Conclave stage — then carried in Suhora’s own post.",
    category: "Product Marketing",
    date: "2024-11-06",
    readMinutes: 6,
    pillar: 1,
    image: "/projects/spade-launch.jpg",
    imageAlt: "Dr. Jitendra Singh with the Suhora team and a satellite image at the Indian Space Conclave",
    frame: { width: 489, height: 410 },
    source: {
      href: "https://www.linkedin.com/posts/suhora-introduces-spade-at-indian-space-conclave-ugcPost-7260552800315584512-_yU5/",
      label: "Suhora’s launch post",
    },
    sections: [
      {
        heading: "The challenge",
        paragraphs: [
          "SPADE is a subscription SaaS platform that puts multi-sensor satellite data in one place — archives, several sensors and resolutions, and analysis close to real time. The work it supports is operational: national security, disaster management, and environmental protection.",
          "The product was approaching launch, but a conventional launch event would have needed substantial preparation, time, and investment. The Indian Space Conclave was coming — about 1,200 people from government, defence, and the wider space industry.",
          "In a market this specialised, that audience was far more valuable than large but unrelated online reach. The challenge was to introduce software memorably, on a tight timeline, while making the most of an event we were already in.",
        ],
      },
      {
        heading: "My approach",
        paragraphs: [
          "I proposed using the Conclave as the launch platform — product storytelling, a live demonstration, and audience engagement in one coordinated experience.",
          "Because SPADE was software rather than a physical unveil, the launch needed a visual moment that showed what the platform did and invited people to try it at the booth.",
          "I wrote the product-launch video script — challenge, SPADE as the solution, then a clear invite to live demos — worked with design on the video, and coordinated the wider go-to-market messaging.",
          "We built anticipation on LinkedIn before the event. I also coordinated with organisers for a prominent launch moment with the chief guest, Dr. Jitendra Singh, Minister of Science and Technology: product video on the stage screen, then an announcement that demos were at our booth.",
          "To extend engagement, I built a simple activation around SPADE’s tagline: photograph at the booth, post on LinkedIn tagging the company with the tagline, receive a branded mug — physical launch meeting social amplification.",
        ],
      },
      {
        heading: "The impact",
        paragraphs: [
          "SPADE was launched by Dr. Jitendra Singh, in the presence of Dr. S. Somnath, Chairman, ISRO; EU Ambassador Hervé Delphin; Jayant Patil, Chairman, ISpA; and Lt. Gen. A.K. Bhatt (Retd.), DG, ISpA. Suhora’s post from the conclave is the public record of that room.",
        ],
        bullets: [
          "The same event honoured the company with the ISpA Space Industry Award.",
          "Coverage in The Hindu BusinessLine and SpaceWatch Global.",
          "About 20–30 people joined the mug activation.",
          "Product narrative, event strategy, executive-level visibility, live demos, and audience participation — without an expensive standalone launch.",
        ],
      },
    ],
    coda: {
      heading: "What this project demonstrates",
      body: "I can build a go-to-market experience around business realities rather than a standard playbook. By combining timing, audience insight, creative storytelling, stakeholder coordination, and practical execution, I helped turn an existing industry event into a launch opportunity for a distinctive product.",
    },
    tags: ["Product Marketing", "Go-to-Market", "Launch Execution", "Experiential Marketing"],
  },
  {
    slug: "international-partner-webinar-qualified-demand",
    title: "Creating an international partner webinar that generated qualified demand",
    release: "Operationalizing daily high-resolution optical intelligence · 8 July 2026",
    dek: "A Satellogic partner webinar on persistent Earth observation — 200 registrations, 150 attendees, and 40+ sales-qualified leads.",
    category: "Partner Marketing",
    date: "2026-07-08",
    readMinutes: 5,
    pillar: 1,
    image: "/projects/webinar-satellogic.jpg",
    imageAlt: "Suhora and Satellogic webinar on operationalizing daily high-resolution optical intelligence",
    frame: { width: 800, height: 450 },
    source: {
      href: "https://www.linkedin.com/feed/update/urn:li:activity:7480859834246983680/",
      label: "Suhora’s webinar recap",
    },
    sections: [
      {
        heading: "The challenge",
        paragraphs: [
          "In a niche market, customers need to understand not only our technology but the satellite data ecosystem behind it. International partnerships with major satellite-data providers opened a path to audiences beyond our immediate network.",
          "Partner webinars could do more than promote us — they could bring complementary expertise together, give audiences a broader conversation, and introduce our capabilities to people who might not otherwise find us.",
          "We collaborated with Satellogic. Suhora is Satellogic’s exclusive partner in India for its data, so the collaboration served the Indian audience and our wider international ambitions.",
        ],
      },
      {
        heading: "My approach",
        paragraphs: [
          "I shaped the webinar around practical use of high-resolution satellite intelligence rather than a conventional company pitch. The title: Operationalizing Daily High-Resolution Optical Intelligence for Real-World Impact.",
          "I coordinated planning with the partner, kept a shared document for overview, responsibilities, deadlines, and speaking contributions, and held planning discussions roughly every two weeks.",
          "To reduce technical and scheduling risk, I chose a prerecorded main presentation with a live Q&A — interaction preserved, content controlled.",
          "Promotion ran through joint LinkedIn, email, and database outreach, with unique tracking links per channel so we could compare contribution rather than treat all registrations as one source.",
          "India was the primary focus, but registrations also came from the United States, the United Kingdom, South Korea, and Japan.",
        ],
      },
      {
        heading: "The impact",
        paragraphs: [
          "Suhora’s recap framed the session as a move from static snapshots to persistent Earth observation: detect, monitor, alert, and respond. The discussion covered automated tasking through Aleph Observer, AI that filters change so analysts see critical events first, and satellite data as a check on government scheme implementation.",
        ],
        bullets: [
          "More than 40 sales-qualified leads from 200 registrations, with 150 people attending.",
          "Recording shared with attendees and no-shows; polls, LinkedIn follow-up, and thank-you emails extended the conversation.",
        ],
      },
    ],
    coda: {
      heading: "What this project demonstrates",
      body: "I can manage partner marketing across organisational and geographic boundaries, build a measurable promotional campaign, and connect educational content with lead qualification. The focus was not simply filling a webinar — it was bringing the right audience into a conversation that could support business development.",
    },
    tags: ["Partner Marketing", "International Collaboration", "Demand Generation", "Lead Qualification"],
  },
  {
    slug: "organic-first-digital-marketing-engine",
    title: "Building an organic-first digital marketing engine",
    dek: "A planned, measurable digital system for a high-value B2B/B2G market — content, SEO, email, analytics, and lead organisation.",
    category: "Digital Strategy",
    date: "2024-08-14",
    readMinutes: 6,
    pillar: 1,
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Analytics dashboard on a laptop screen",
    sections: [
      {
        heading: "The challenge",
        paragraphs: [
          "Marketing a high-value spatial-intelligence product is different from marketing a low-cost product with a short purchase cycle. The audience includes technical experts, senior decision-makers, government stakeholders, and defence-related organisations — people who need relevant information, confidence in the provider, and time to evaluate.",
          "Raw impressions and inexpensive leads are not reliable commercial indicators. Paid advertising can help visibility, but long sales cycles are hard to attribute to individual campaigns. Meanwhile, the people we needed most were not always the most active on social media.",
          "I needed a digital presence that built credibility with a specialised audience and created multiple ways for prospects to discover and engage.",
        ],
      },
      {
        heading: "My approach",
        paragraphs: [
          "I built a structured, organic-first digital strategy — from ad hoc social publishing to a content calendar planned about 30 days ahead. LinkedIn was primary for professional audiences, with expansion to Instagram and X.",
          "Rather than chasing follower growth alone, I prioritised thought leadership: useful, technically relevant content that showed understanding of spatial intelligence and its applications.",
        ],
        bullets: [
          "Content strategy — planned publishing aligned with milestones and industry relevance",
          "Search visibility — website and blog SEO with Search Console, Analytics, and Bing Webmaster Tools",
          "Website lead generation — inbound enquiries tied into lead management",
          "Email marketing — Zoho automation for webinars, newsletters, and technical updates",
          "Measurement — LinkedIn, email, website, and campaign-specific responses",
          "Lead organisation — records with AI-assisted categorisation by category and originating activity",
          "Preparation for answer-engine and generative-engine optimisation (AEO / GEO)",
        ],
      },
      {
        heading: "The impact",
        paragraphs: [
          "The company moved toward a more planned and measurable digital operation — forward-looking calendar, broader channel presence, structured email engagement, and clearer visibility into website and campaign performance.",
          "The work set the foundation for sustained organic discovery and more organised nurturing. Commercial impact should be judged through qualified opportunities over time — not by claiming that a single post or ad spend caused a sale without attribution.",
        ],
      },
    ],
    coda: {
      heading: "What this project demonstrates",
      body: "I understand how digital marketing changes in high-value B2B/B2G markets. I can connect content, SEO, analytics, email automation, and CRM processes into a coordinated system designed to build trust and support a long buying journey.",
    },
    tags: ["Digital Strategy", "Content Marketing", "SEO", "Marketing Analytics", "Automation"],
  },
  {
    slug: "cross-functional-content-engine",
    title: "Building a cross-functional content engine from technical expertise",
    dek: "SPOCs, quarterly inputs, and a review loop — so marketing could publish from real technical work without asking engineers to become writers.",
    category: "Team Leadership",
    date: "2024-06-10",
    readMinutes: 5,
    pillar: 2,
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Team collaborating around a table",
    sections: [
      {
        heading: "The challenge",
        paragraphs: [
          "In spatial intelligence, the strongest marketing stories often start outside marketing — a product milestone, a model-training insight, a technical discovery, a customer problem solved by engineering. Turning that into publishable work needs access, collaboration, and review that respects accuracy and sensitivity.",
          "When I began building a more consistent content operation, the bottleneck was not ideas. It was a dependable flow of information from teams whose primary jobs were technical or operational.",
          "Teams often resisted because they assumed marketing would ask them to write finished articles from scratch. I needed to change that perception and make contribution fit inside existing workloads.",
        ],
      },
      {
        heading: "My approach",
        paragraphs: [
          "I established departmental single points of contact (SPOCs) to structure the link between marketing and the rest of the organisation.",
          "Instead of finished posts, each team identified one current topic per quarter and shared five relevant inputs from work already in progress — model training material, technical updates, research findings, and similar.",
          "Marketing then analysed inputs, shaped a narrative, drafted content, and sent it for review before publication — critical in a sensitive domain where not every detail can go public.",
          "Commitments sat on the content calendar, with backup content so delayed inputs did not create blank weeks. Each week we spoke with one department to hear what was moving — Sales milestones, technical discoveries, new capabilities.",
          "I led this alongside a four-person marketing team spanning design, internal coordination, PR, and overall oversight.",
        ],
      },
      {
        heading: "The impact",
        bullets: [
          "A structured way to gather technical knowledge, coordinate contributors, and plan content around real company activity.",
          "Less dependence on last-minute requests.",
          "A repeatable mechanism connecting technical work with external communication — not content as an isolated creative task.",
        ],
      },
    ],
    coda: {
      heading: "What this project demonstrates",
      body: "I can lead without relying solely on formal authority. By understanding other teams’ constraints, simplifying contribution requirements, and creating predictable processes, I helped align technical expertise with marketing objectives while respecting the sensitivity of the business.",
    },
    tags: ["Stakeholder Management", "Content Operations", "Internal Communications", "Team Leadership"],
  },
  {
    slug: "marketing-processes-operational-reliability",
    title: "Creating marketing processes that improved operational reliability",
    dek: "Workflows, quarterly event planning, and post-activity records — so execution stayed visible without unnecessary bureaucracy.",
    category: "Marketing Operations",
    date: "2024-04-08",
    readMinutes: 5,
    pillar: 2,
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Notebook and planning documents on a desk",
    sections: [
      {
        heading: "The challenge",
        paragraphs: [
          "As marketing expanded across events, content, PR, digital campaigns, and partnerships, coordination mattered more. Every activity involved people, deadlines, expenses, deliverables, and follow-ups. Without a consistent way to capture that, teams risked missing details, repeating work, or losing knowledge after an activity ended.",
          "Events made it clear: success is more than branded materials on the day. The right people, budgets, responsibilities, lead capture, and after-action review all have to hold.",
          "I wanted processes that improved execution without creating unnecessary bureaucracy.",
        ],
      },
      {
        heading: "My approach",
        paragraphs: [
          "I developed marketing workflows and internal guidelines for everyday communication and larger activities — social media usage, internal PR, content calendars, activity and expense trackers, an event photo library, awards records, post-performance data, and more structured tracking in Plane.",
          "For events, I introduced a quarterly planning loop: managers received an overview of planned activities and potential participants so Finance could anticipate spend and teams could plan involvement.",
          "Each event got a dedicated stakeholder thread — information shared, responsibilities assigned, requirements documented before the day. Afterwards, role-specific feedback forms, consolidated leads, expenditure records, and materials lived in the event repository.",
          "Recurring internal reporting kept departments aware of upcoming marketing activity so they could prepare.",
        ],
      },
      {
        heading: "The impact",
        bullets: [
          "Greater visibility and accountability across marketing execution.",
          "Internal assessment: errors reduced by approximately 70%.",
          "Stronger confidence managing multiple activities — progress, ownership, and history easier to track.",
          "Better basis for future planning: event selection, budgets, and evaluation of past activity.",
        ],
      },
    ],
    coda: {
      heading: "What this project demonstrates",
      body: "I approach marketing operations as an enabler of growth. Clear processes make it easier for teams to execute consistently, reduce preventable mistakes, preserve institutional knowledge, and make better decisions about where to invest time and resources.",
    },
    tags: ["Marketing Operations", "Governance", "Process Design", "Budgeting", "Performance Tracking"],
  },
  {
    slug: "high-trust-government-defence-engagement",
    title: "Designing high-trust engagement with government and defence stakeholders",
    dek: "Closed-door workshops, international partners, and simultaneous PR — engagement built for senior audiences where footfall alone is not the metric.",
    category: "Strategic Engagement",
    date: "2024-12-03",
    readMinutes: 6,
    pillar: 2,
    image: "/projects/09-room.jpg",
    imageAlt: "Stakeholder session with the Suhora team",
    frame: { width: 1024, height: 768 },
    sections: [
      {
        heading: "The challenge",
        paragraphs: [
          "Marketing spatial-intelligence products to government and defence audiences is not a conventional commercial campaign. The technology is specialised, applications can be consequential, and evaluators often have limited time and specific operational requirements.",
          "Event success cannot be measured by footfall alone. Audience quality, relevance of discussion, practical demonstration, and relationships afterwards all matter.",
          "My role was to turn those requirements into carefully planned engagement experiences while coordinating internal teams and external partners.",
        ],
      },
      {
        heading: "My approach",
        paragraphs: [
          "One example: a closed-door workshop with Planet Labs for about 50 senior government officials — present relevant solutions and understand the problems they needed to solve.",
          "I managed client-facing communication and on-ground logistics so the day centred on the audience, not only our product deck. Formal invitations, clear communication, a structured agenda, and respect for time kept the discussion focused and useful.",
          "Beyond that workshop I coordinated international event participation, brand presence, and stakeholder communication with global satellite-data partners — Planet Labs (US), SatVu (UK), ICEYE (Finland), and Satellogic (including Canada and Argentina).",
          "I also worked on partner webinars and joint PR. For a Satellogic, SatVu, and ICEYE announcement, I led India-side PR aligned with US-side partners for simultaneous release.",
          "Alongside commercial engagement, I supported industry–academia work with Thiagarajar College of Engineering in Madurai and BITS Goa — connecting the company to a wider technical and institutional ecosystem.",
        ],
      },
      {
        heading: "The impact",
        bullets: [
          "The Planet Labs workshop generated about 50 leads from the 50 attending officials.",
          "Broader engagement contributed to speaking invitations, roundtables, and strategic meetings.",
          "Included participation when 20 space companies met Prime Minister Narendra Modi, and an invitation to a Bloomberg New Economy Forum roundtable with senior space-sector stakeholders.",
          "Those invitations signal industry visibility and relationships — not attributable to one event alone.",
        ],
      },
    ],
    coda: {
      heading: "What this project demonstrates",
      body: "I understand how to adapt marketing execution to high-trust, high-value environments. I can coordinate international partners, organise engagements for senior stakeholders, maintain appropriate communication protocols, and create experiences centred on the audience’s needs. In a niche industry, that ability to build credibility and sustain relationships is as important as campaign reach.",
    },
    tags: [
      "Strategic Events",
      "Stakeholder Engagement",
      "International Partnerships",
      "Government & Defence Marketing",
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function formatProjectDate(iso: string) {
  const date = new Date(`${iso}T12:00:00`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
