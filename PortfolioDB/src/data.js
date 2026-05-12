// ── Navigation sections ───────────────────────────────────────────
// These map to the <section id="..."> elements in App.jsx.
export const SECTIONS = [
  { id: 'hero', file: 'index', ext: 'tsx', label: 'index.tsx' },
  { id: 'projects', file: 'projects', ext: 'tsx', label: 'projects.tsx' },
  { id: 'apps', file: 'apps', ext: 'swift', label: 'apps.swift' },
  { id: 'about', file: 'about', ext: 'json', label: 'about.json' },
  { id: 'blog', file: 'blog', ext: 'md', label: 'blog.md' },
  { id: 'contact', file: 'contact', ext: 'sh', label: 'contact.sh' },
];

// ── Projects ──────────────────────────────────────────────────────
// Anim references the export name from src/animations/index.jsx.
export const PROJECTS = [
  {
    slug: 'setback',
    title: 'Setback',
    desc: 'A faithful clone of the Trouble board game, pop-o-matic and all. Built end-to-end with state machines and CSS-only token animations.',
    tags: ['Vanilla JS', 'CSS', 'Game Logic'],
    url: 'https://berniedestin.github.io/setback/',
    repo: 'github.com/berniedestin/setback',
    Anim: 'SetbackAnim',
    stagelabel: 'live • dice + tokens',
  },
  {
    slug: 'etch',
    title: 'Etch-a-Sketch',
    desc: 'Reactive grid drawing surface with rainbow trail mode, smooth color blending, and a generative auto-pilot that paints itself.',
    tags: ['DOM', 'Canvas', 'Color theory'],
    url: 'https://berniedestin.github.io/odin-etch-a-sketch/',
    repo: 'github.com/berniedestin/odin-etch-a-sketch',
    Anim: 'EtchAnim',
    stagelabel: 'live • auto-paint',
  },
  {
    slug: 'sandbox',
    title: 'Canvas Sandbox',
    desc: 'A particle physics playground exploring attractors, swarming, and force fields. 60fps with 1000+ particles in pure 2D canvas.',
    tags: ['Canvas', 'Physics', 'Particles'],
    url: 'https://berniedestin.github.io/canvas-practice/',
    repo: 'github.com/berniedestin/canvas-practice',
    Anim: 'CanvasSandboxAnim',
    stagelabel: 'live • particle field',
  },
  {
    slug: 'dragdrop',
    title: 'Kanban — drag, drop, persist',
    desc: 'Custom drag-and-drop primitives in Vue 3 with optimistic reordering and IndexedDB persistence. No libraries.',
    tags: ['Vue.js', 'IndexedDB', 'a11y'],
    url: '#',
    repo: '',
    Anim: 'DragDemoAnim',
    stagelabel: 'live • drag interaction',
  },
  {
    slug: 'compiler',
    title: 'Tiny Rust → Tree',
    desc: 'A pedagogical Rust subset compiler. Parses functions, lowers to an AST, and renders the tree. Built to teach the parsing pipeline.',
    tags: ['Rust', 'Parsing', 'Education'],
    url: '#',
    repo: '',
    Anim: 'CodeOutputAnim',
    stagelabel: 'live • code → AST',
  },
];

// ── Mobile apps ───────────────────────────────────────────────────
export const APPS = [
  {
    name: 'Tally — pocket scoreboard',
    desc: 'A React Native app for keeping score in card and board games without breaking the flow. Multi-player, undo, and round history. TestFlight + APK.',
    stack: ['React Native', 'Reanimated', 'Zustand'],
    ios: '#',
    android: '#',
    color: '#ff7a3d',
  },
  {
    name: 'Setback Mobile',
    desc: 'Native port of the Setback game. Local + online multiplayer, animated transitions, and haptic feedback on rolls.',
    stack: ['React Native', 'WebSockets', 'Skia'],
    ios: '#',
    android: '#',
    color: '#6cb9ff',
  },
];

// ── Work timeline ─────────────────────────────────────────────────
export const TIMELINE = [
  {
    when: '2025 — present',
    what: 'Software Engineer',
    where: 'Independent / contract',
    detail: 'Building developer tools and full-stack apps in Rust, .NET, and Vue. Currently focused on small, performant tools that respect the user.',
  },
  {
    when: '2024 — 2025',
    what: 'Software Engineer',
    where: 'US Steel',
    detail: 'Drove $100k+ in annual savings through ML and full-stack development, while spearheading infrastructure containerization and engineering governance.',
  },
  {
    when: '2023 — 2024',
    what: 'Coding Bootcamp',
    where: 'Tech Elevator',
    detail: 'Full-stack bootcamp designing software systems and solutions with 800+ hours of education and application.',
  },
  {
    when: '2017 — 2023',
    what: 'EDM Programmer',
    where: 'EDM Services',
    detail: 'Optimized manufacturing workflows to cut programming time by 90% and designed critical tooling in collaboration with cross-functional engineering teams.',
  },
  {
    when: '2013 — 2017',
    what: 'Apprentice Tool & Die Maker',
    where: 'EDM Services',
    detail: 'Completed 8,000+ hours of cross-functional machining experience to become a Journeyman Tool & Die Maker, gaining deep proficiency in blueprint reading, GD&T, and tool design.',
  },
];

// ── Blog posts ────────────────────────────────────────────────────
export const POSTS = [
  { date: '2026·04·02', title: 'Why I keep coming back to Rust for tools', read: '6 min' },
  { date: '2026·02·18', title: 'Vue 3 reactivity demystified, slowly', read: '9 min' },
  { date: '2025·12·10', title: 'Notes on building a card game with vanilla JS', read: '5 min' },
  { date: '2025·09·22', title: 'A quiet case for Blazor in 2025', read: '7 min' },
];
