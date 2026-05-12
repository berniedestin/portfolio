// portfolio-app.jsx — main shell, sections, theme/tweaks orchestration.

const { useState, useEffect, useRef, useMemo, useCallback } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "accent": "#ff7a3d",
  "font": "mono"
}/*EDITMODE-END*/;

const SECTIONS = [
  { id: 'hero',     file: 'index',     ext: 'tsx', label: 'index.tsx' },
  { id: 'projects', file: 'projects',  ext: 'tsx', label: 'projects.tsx' },
  { id: 'apps',     file: 'apps',      ext: 'swift', label: 'apps.swift' },
  { id: 'about',    file: 'about',     ext: 'json', label: 'about.json' },
  { id: 'blog',     file: 'blog',      ext: 'md',  label: 'blog.md' },
  { id: 'contact',  file: 'contact',   ext: 'sh',  label: 'contact.sh' },
];

const PROJECTS = [
  {
    slug: 'setback', n: 1,
    title: 'Setback',
    desc: 'A faithful clone of the Trouble board game, pop-o-matic and all. Built end-to-end with state machines and CSS-only token animations.',
    tags: ['Vanilla JS', 'CSS', 'Game Logic'],
    url: 'https://berniedestin.github.io/setback/',
    repo: 'github.com/berniedestin/setback',
    Anim: 'SetbackAnim',
    stagelabel: 'live • dice + tokens',
  },
  {
    slug: 'etch', n: 2,
    title: 'Etch-a-Sketch',
    desc: 'Reactive grid drawing surface with rainbow trail mode, smooth color blending, and a generative auto-pilot that paints itself.',
    tags: ['DOM', 'Canvas', 'Color theory'],
    url: 'https://berniedestin.github.io/odin-etch-a-sketch/',
    repo: 'github.com/berniedestin/odin-etch-a-sketch',
    Anim: 'EtchAnim',
    stagelabel: 'live • auto-paint',
  },
  {
    slug: 'sandbox', n: 3,
    title: 'Canvas Sandbox',
    desc: 'A particle physics playground exploring attractors, swarming, and force fields. 60fps with 1000+ particles in pure 2D canvas.',
    tags: ['Canvas', 'Physics', 'Particles'],
    url: 'https://berniedestin.github.io/canvas-practice/',
    repo: 'github.com/berniedestin/canvas-practice',
    Anim: 'CanvasSandboxAnim',
    stagelabel: 'live • particle field',
  },
  {
    slug: 'dragdrop', n: 4,
    title: 'Kanban — drag, drop, persist',
    desc: 'Custom drag-and-drop primitives in Vue 3 with optimistic reordering and IndexedDB persistence. No libraries.',
    tags: ['Vue.js', 'IndexedDB', 'a11y'],
    url: '#',
    repo: '',
    Anim: 'DragDemoAnim',
    stagelabel: 'live • drag interaction',
  },
  {
    slug: 'compiler', n: 5,
    title: 'Tiny Rust → Tree',
    desc: 'A pedagogical Rust subset compiler. Parses functions, lowers to an AST, and renders the tree. Built to teach the parsing pipeline.',
    tags: ['Rust', 'Parsing', 'Education'],
    url: '#',
    repo: '',
    Anim: 'CodeOutputAnim',
    stagelabel: 'live • code → AST',
  },
];

const APPS = [
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

const TIMELINE = [
  { when: '2024 — present', what: 'Software Engineer', where: 'Independent / contract', detail: 'Building developer tools and full-stack apps in Rust, .NET, and Vue. Currently focused on small, performant tools that respect the user.' },
  { when: '2022 — 2024',    what: 'Full-Stack Engineer', where: 'Mid-size SaaS', detail: 'Led modernization from legacy Blazor Server to a Vue + .NET Core split. Cut p95 page time by 62%. Mentored two juniors.' },
  { when: '2020 — 2022',    what: 'Software Engineer',   where: 'Startup', detail: 'C# / .NET Core services and a React Native companion app. Shipped the first version of a payments integration that processed >$2M monthly.' },
  { when: '2019',           what: 'B.S. Computer Science', where: 'University', detail: 'Capstone: a tiny ML-typed language compiler in Rust. Graduated with honors.' },
];

const POSTS = [
  { date: '2026·04·02', title: 'Why I keep coming back to Rust for tools', read: '6 min' },
  { date: '2026·02·18', title: 'Vue 3 reactivity demystified, slowly',     read: '9 min' },
  { date: '2025·12·10', title: 'Notes on building a card game with vanilla JS', read: '5 min' },
  { date: '2025·09·22', title: 'A quiet case for Blazor in 2025',           read: '7 min' },
];

// ── icons ────────────────────────────────────────────────────────
const Icon = {
  ext: () => (<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M10 3h3v3M13 3l-6 6M6 5H3v8h8v-3"/></svg>),
  arr: () => (<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 8h10M9 4l4 4-4 4"/></svg>),
  github: () => (<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 0a8 8 0 0 0-2.5 15.6c.4.07.55-.17.55-.38v-1.4c-2.2.5-2.7-1-2.7-1-.36-.93-.9-1.18-.9-1.18-.74-.5.06-.5.06-.5.82.06 1.25.85 1.25.85.72 1.25 1.9.9 2.36.68.07-.53.28-.9.5-1.1-1.75-.2-3.6-.88-3.6-3.9 0-.86.3-1.56.82-2.1-.08-.2-.36-1 .08-2.1 0 0 .67-.22 2.2.8a7.6 7.6 0 0 1 4 0c1.53-1.02 2.2-.8 2.2-.8.44 1.1.16 1.9.08 2.1.5.54.82 1.24.82 2.1 0 3-1.85 3.7-3.6 3.9.28.25.54.74.54 1.5v2.2c0 .22.15.46.55.38A8 8 0 0 0 8 0Z"/></svg>),
  apple: () => (<svg viewBox="0 0 16 16" fill="currentColor"><path d="M11.18 8.5c0-1.85 1.52-2.74 1.59-2.78-.87-1.27-2.22-1.44-2.7-1.46-1.15-.12-2.24.67-2.83.67-.6 0-1.5-.66-2.46-.64-1.27.02-2.43.74-3.08 1.87-1.31 2.27-.34 5.62.95 7.46.63.9 1.38 1.9 2.36 1.87.95-.04 1.31-.61 2.46-.61 1.15 0 1.47.61 2.47.59 1.02-.02 1.66-.91 2.28-1.81.72-1.04 1.02-2.05 1.04-2.1-.02-.01-2-.78-2.02-3.06zM9.45 2.86c.51-.62.86-1.49.76-2.36-.74.03-1.64.5-2.17 1.11-.47.55-.89 1.43-.78 2.28.83.06 1.68-.42 2.19-1.03z"/></svg>),
  android: () => (<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 7v4.5a.5.5 0 0 0 1 0V7a.5.5 0 0 0-1 0Zm11 0v4.5a.5.5 0 0 0 1 0V7a.5.5 0 0 0-1 0ZM3.5 7v5a.7.7 0 0 0 .7.7H5v2.3a.5.5 0 0 0 1 0V12.7h1V15a.5.5 0 0 0 1 0v-2.3h1V15a.5.5 0 0 0 1 0V12.7h.8a.7.7 0 0 0 .7-.7V7H3.5ZM5.7 4.4 4.85 3.1a.25.25 0 0 1 .43-.25l.9 1.4A4.7 4.7 0 0 1 8 4c.66 0 1.3.1 1.82.25l.9-1.4a.25.25 0 0 1 .43.25l-.85 1.3A3.5 3.5 0 0 1 12.5 7h-9a3.5 3.5 0 0 1 2.2-2.6ZM5.5 6a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Zm5 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z"/></svg>),
  send: () => (<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2 7 9M14 2l-4 12-3-5-5-3 12-4Z"/></svg>),
  term: () => (<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1.5" y="3" width="13" height="10" rx="1.5"/><path d="M4 7l2 1.5L4 10M8 10h4"/></svg>),
  sun: () => (<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="3"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5 13 13M3 13l1.5-1.5M11.5 4.5 13 3"/></svg>),
  moon: () => (<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 9.5A5 5 0 0 1 6.5 3a5 5 0 1 0 6.5 6.5Z"/></svg>),
};

// ── synthetic QR (decorative) ──────────────────────────────────
function FakeQR({ seed = 1 }) {
  const cells = useMemo(() => {
    const grid = [];
    let s = seed * 9301 + 49297;
    for (let y = 0; y < 21; y++) {
      const row = [];
      for (let x = 0; x < 21; x++) {
        s = (s * 9301 + 49297) % 233280;
        row.push((s / 233280) > 0.55 ? 1 : 0);
      }
      grid.push(row);
    }
    // corner finders
    function finder(grid, ox, oy) {
      for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) {
        const v = (x === 0 || x === 6 || y === 0 || y === 6 || (x>=2&&x<=4&&y>=2&&y<=4)) ? 1 : 0;
        grid[oy+y][ox+x] = v;
      }
    }
    finder(grid, 0, 0); finder(grid, 14, 0); finder(grid, 0, 14);
    return grid;
  }, [seed]);
  return (
    <svg viewBox="0 0 21 21" shapeRendering="crispEdges">
      {cells.flatMap((row, y) => row.map((v, x) => v
        ? <rect key={x+'-'+y} x={x} y={y} width={1} height={1} fill="#0a0b0d"/>
        : null))}
    </svg>
  );
}

// ── intersection observer for active section ───────────────────
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (els.length === 0) return;
    const io = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [ids.join('|')]);
  return active;
}

// ── theme swipe ─────────────────────────────────────────────────
function performThemeSwipe(nextTheme, sx, sy) {
  const swipe = document.createElement('div');
  swipe.className = 'theme-swipe';
  swipe.style.setProperty('--sx', sx + 'px');
  swipe.style.setProperty('--sy', sy + 'px');
  document.body.appendChild(swipe);
  // force reflow then grow
  // eslint-disable-next-line no-unused-expressions
  swipe.offsetWidth;
  swipe.classList.add('go');
  setTimeout(() => {
    document.documentElement.setAttribute('data-theme', nextTheme);
    swipe.style.transition = 'opacity .35s ease';
    swipe.style.opacity = '0';
    setTimeout(() => swipe.remove(), 400);
  }, 280);
}

// ── hero typing ────────────────────────────────────────────────
function useTyped(strings, speed = 60, pause = 1400) {
  const [out, setOut] = useState('');
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    let cancelled = false;
    const word = strings[idx % strings.length];
    let i = 0;
    setOut('');
    function type() {
      if (cancelled) return;
      if (i <= word.length) {
        setOut(word.slice(0, i));
        i++;
        setTimeout(type, speed);
      } else {
        setTimeout(() => {
          if (cancelled) return;
          // erase
          let j = word.length;
          function erase() {
            if (cancelled) return;
            if (j >= 0) {
              setOut(word.slice(0, j));
              j--;
              setTimeout(erase, speed/2);
            } else {
              setIdx(v => v + 1);
            }
          }
          erase();
        }, pause);
      }
    }
    type();
    return () => { cancelled = true; };
  }, [idx, strings.join('|')]);
  return out;
}

// ── Tab bar ────────────────────────────────────────────────────
function TabBar({ active, onPick }) {
  return (
    <div className="tabbar" role="tablist">
      {SECTIONS.map(s => (
        <button key={s.id} className={'tab' + (active === s.id ? ' active' : '')}
          onClick={() => onPick(s.id)} role="tab" aria-selected={active === s.id}>
          <span className="dot" />
          <span>{s.file}<span className="ext">.{s.ext}</span></span>
        </button>
      ))}
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────
function Hero({ onTerminal }) {
  const typed = useTyped(['Software Engineer', 'systems guy', 'tool builder', 'dancer'], 55, 1200);
  return (
    <section id="hero" className="hero" data-screen-label="01 Hero">
      <div>
        <div className="greet">
          <span className="pulse" />
          <span>~/destinbernie · available for select projects</span>
        </div>
        <h1>
          Hey, I’m <span className="accent">Destin</span>.
          <br />
          I build. <span style={{whiteSpace:'nowrap'}}>{typed}<span className="caret" /></span>
        </h1>
        <p className="sub">
          <span className="cmt">{'// '}</span>
          Full-stack engineer working across Rust, Vue.js, React Native, C# and Blazor. I like games, generative graphics, developer tools, and code that you can read on a Tuesday.
        </p>
        <div className="hero-cta">
          <a href="#projects" className="btn primary">
            see my work <span className="arr"><Icon.arr /></span>
          </a>
          <button className="btn" onClick={onTerminal}>
            <Icon.term /> enter terminal mode
          </button>
        </div>
      </div>
      <HeroCodePanel />
    </section>
  );
}

function HeroCodePanel() {
  return (
    <div className="code-panel">
      <div className="code-head">
        <div className="lights"><div className="light r"/><div className="light y"/><div className="light g"/></div>
        <span style={{flex:1, textAlign:'center'}}>destin.rs</span>
      </div>
      <div className="code-body">
        <div className="code-lines">
          {Array.from({length: 14}).map((_, i) => <div key={i}>{i+1}</div>)}
        </div>
        <div className="code-text">
{[
  [['cmt','// always be shipping']],
  [['key','struct '],['prop','Engineer'],['pun',' {']],
  [['pun','  '],['prop','name'],['pun',': &'],['key','str'],['pun',',']],
  [['pun','  '],['prop','stack'],['pun',': '],['key','Vec'],['pun','<&'],['key','str'],['pun','>,']],
  [['pun','  '],['prop','curiosity'],['pun',': '],['num','f64'],['pun',',']],
  [['pun','}']],
  [['']],
  [['key','impl '],['prop','Engineer'],['pun',' {']],
  [['pun','  '],['key','fn '],['fn','new'],['pun','() -> '],['key','Self'],['pun',' {']],
  [['pun','    '],['prop','Self'],['pun',' {']],
  [['pun','      name: '],['str','"Destin Bernie"'],['pun',',']],
  [['pun','      stack: '],['key','vec!'],['pun','['],['str','"rust"'],['pun',', '],['str','"vue"'],['pun',', '],['str','"react-native"'],['pun',', '],['str','"c#"'],['pun',', '],['str','"blazor"'],['pun','],']],
  [['pun','      curiosity: '],['num','f64'],['pun','::'],['prop','INFINITY'],['pun',',']],
  [['pun','    } } }']],
].map((line, li) => (
  <div key={li}>
    {line.map(([cls, txt], ti) => (
      <span key={ti} className={'tok-' + cls}>{txt}</span>
    ))}
  </div>
))}
        </div>
      </div>
    </div>
  );
}

// ── Projects ──────────────────────────────────────────────────
function ProjectCard({ p, idx }) {
  const Anim = window[p.Anim];
  return (
    <article className="proj-card">
      <div className="proj-stage">
        {Anim ? <Anim /> : null}
        <div className="stage-overlay">
          <span className="live" /> {p.stagelabel}
        </div>
      </div>
      <div className="proj-meta">
        <div className="proj-title-row">
          <div className="proj-title">{p.title}</div>
          <div className="proj-num">/* {String(idx+1).padStart(2,'0')} */</div>
        </div>
        <p className="proj-desc">{p.desc}</p>
        <div className="proj-tags">
          {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
        <div className="proj-links">
          {p.url && p.url !== '#' && (
            <a className="lnk" href={p.url} target="_blank" rel="noreferrer">
              <Icon.ext /> live
            </a>
          )}
          {p.repo && (
            <a className="lnk" href={'https://' + p.repo} target="_blank" rel="noreferrer">
              <Icon.github /> source
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

// ── Apps ─────────────────────────────────────────────────────
function AppCard({ a, seed }) {
  return (
    <div className="app-card">
      <div className="phone">
        <div className="notch" />
        <div className="screen">
          <div className="ph-content">
            <div style={{color: a.color, fontWeight:600, fontSize:13, marginBottom:8}}>{a.name.split('—')[0].trim()}</div>
            <div style={{display:'flex', gap:6, alignItems:'center', marginBottom:8, fontSize:9}}>
              <div style={{width:6, height:6, borderRadius:3, background:'#28c840'}}/> live
            </div>
            {[1,2,3,4].map(i => (
              <div key={i} style={{
                background: 'rgba(127,127,140,0.10)',
                border: '1px solid rgba(127,127,140,0.18)',
                borderRadius: 4,
                padding: '5px 7px',
                marginBottom: 5,
                fontSize: 9,
                display: 'flex',
                justifyContent: 'space-between',
              }}>
                <span>player {i}</span>
                <span style={{color: a.color}}>{(i*97 + seed*13) % 100}</span>
              </div>
            ))}
            <div style={{flex:1}} />
            <div style={{
              background: a.color, color:'#1a0c00',
              borderRadius: 5, padding: '6px 8px', textAlign:'center', fontSize:9, fontWeight:600
            }}>+ new round</div>
          </div>
        </div>
      </div>
      <div className="app-meta">
        <div className="app-name">{a.name}</div>
        <div className="app-desc">{a.desc}</div>
        <div className="proj-tags">
          {a.stack.map(t => <span key={t} className="tag">{t}</span>)}
        </div>
        <div className="app-dl">
          <div className="qr"><FakeQR seed={seed} /></div>
          <div className="app-dl-info">
            <div className="lbl">scan to install</div>
            <a href={a.ios} target="_blank" rel="noreferrer"><Icon.apple /> &nbsp;TestFlight →</a>
            <a href={a.android} target="_blank" rel="noreferrer"><Icon.android /> &nbsp;APK download →</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── About / Timeline ─────────────────────────────────────────
function About() {
  return (
    <div className="about">
      <div className="about-col">
        <h2>Background</h2>
        <p>I'm a software engineer with a soft spot for tools that disappear and games that don't. I work fluently across the stack — services in C#/.NET, frontends in Vue, mobile in React Native — and reach for Rust when correctness matters most.</p>
        <p>Lately I've been writing more about my craft, building games as toys to test ideas, and trying to keep my designs honest.</p>
        <div className="stack">
          {['Rust','Vue.js','React Native','C#','.NET Core','Blazor','TypeScript','PostgreSQL','GraphQL','WebGL'].map(t => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      </div>
      <div className="about-col">
        <div className="timeline">
          {TIMELINE.map((it, i) => (
            <div key={i} className="tl-item">
              <div className="tl-when">{it.when}</div>
              <div className="tl-what">{it.what}</div>
              <div className="tl-where">{it.where}</div>
              <p className="tl-detail">{it.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Blog ────────────────────────────────────────────────────
function Blog() {
  return (
    <div className="blog-list">
      {POSTS.map((p, i) => (
        <a key={i} className="blog-row" href="#">
          <div className="blog-date">{p.date}</div>
          <div className="blog-title">{p.title}</div>
          <div className="blog-read">{p.read} · read →</div>
        </a>
      ))}
    </div>
  );
}

// ── Contact ─────────────────────────────────────────────────
function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);
  function submit(e) {
    e.preventDefault();
    setSent(true);
    setTimeout(() => { setName(''); setEmail(''); setMsg(''); setSent(false); }, 3500);
  }
  return (
    <div className="contact-wrap">
      <form className="term-box" onSubmit={submit}>
        <div className="code-head">
          <div className="lights"><div className="light r"/><div className="light y"/><div className="light g"/></div>
          <span style={{flex:1, textAlign:'center'}}>$ ./contact.sh</span>
        </div>
        <div className="term-body">
          <div><span className="cmd">$</span> hello <span style={{color:'var(--c-cmt)'}}># tell me about your project</span></div>
          <label htmlFor="c-name">--name</label>
          <input id="c-name" value={name} onChange={e=>setName(e.target.value)} placeholder="Ada Lovelace" required />
          <label htmlFor="c-email">--email</label>
          <input id="c-email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="ada@example.com" required />
          <label htmlFor="c-msg">--message</label>
          <textarea id="c-msg" value={msg} rows={4} onChange={e=>setMsg(e.target.value)} placeholder="hi destin, i'd love to chat about…" required />
          <div style={{marginTop:14, display:'flex', gap:10, alignItems:'center'}}>
            <button type="submit" className="btn primary"><Icon.send /> send</button>
            {sent && <span style={{color:'#9bd17a', fontFamily:'var(--font-mono)', fontSize:12}}>→ exit code 0. message queued.</span>}
          </div>
        </div>
      </form>
      <aside className="contact-side">
        <div className="row"><span className="k">email</span><span className="v"><a href="mailto:hello@destinbernie.dev">hello@destinbernie.dev</a></span></div>
        <div className="row"><span className="k">github</span><span className="v"><a href="https://github.com/berniedestin" target="_blank" rel="noreferrer">berniedestin</a></span></div>
        <div className="row"><span className="k">site</span><span className="v">destinbernie.dev</span></div>
        <div className="row"><span className="k">tz</span><span className="v">UTC−5 · usually online 09:00–18:00</span></div>
        <div className="row"><span className="k">status</span><span className="v" style={{color:'#9bd17a'}}>● open to projects</span></div>
        <div style={{marginTop:8, fontFamily:'var(--font-mono)', fontSize:11, color:'var(--fg-3)', lineHeight:1.6}}>
          Prefer terminal? Try <span style={{color:'var(--accent)'}}>contact</span> in terminal mode.
        </div>
      </aside>
    </div>
  );
}

// ── Status bar ──────────────────────────────────────────────
function StatusBar({ active, onTheme, theme, onTerminal }) {
  return (
    <div className="statusbar">
      <span className="sb-item">⌘ destin@portfolio</span>
      <span className="sb-item">UTF-8</span>
      <span className="sb-item">main</span>
      <span className="sb-item">/{active}</span>
      <div className="sb-spacer" />
      <button className="sb-btn" onClick={(e) => onTheme(e)}>
        {theme === 'dark' ? <><Icon.sun /> light</> : <><Icon.moon /> dark</>}
      </button>
      <button className="sb-btn" onClick={onTerminal}>
        <Icon.term /> terminal · <span style={{opacity:.7}}>`</span>
      </button>
    </div>
  );
}

// ── App root ───────────────────────────────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [termOpen, setTermOpen] = useState(false);
  const active = useActiveSection(SECTIONS.map(s => s.id));

  // apply theme + accent + font to root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', t.theme);
  }, [t.theme]);
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', t.accent);
  }, [t.accent]);
  useEffect(() => {
    const map = {
      mono: { sans: "'JetBrains Mono', ui-monospace, monospace", display: "'JetBrains Mono', ui-monospace, monospace" },
      sans: { sans: "'Inter', ui-sans-serif, system-ui, sans-serif", display: "'Space Grotesk', 'Inter', system-ui, sans-serif" },
      mixed:{ sans: "'Inter', ui-sans-serif, system-ui, sans-serif", display: "'JetBrains Mono', ui-monospace, monospace" },
    };
    const f = map[t.font] || map.mono;
    document.documentElement.style.setProperty('--font-sans', f.sans);
    document.documentElement.style.setProperty('--font-display', f.display);
  }, [t.font]);

  // global key listeners for terminal
  useEffect(() => {
    function onKey(e) {
      const tag = (e.target && e.target.tagName) || '';
      const inField = ['INPUT','TEXTAREA'].includes(tag) || (e.target && e.target.isContentEditable);
      if (e.key === '`' && !inField && !termOpen) {
        e.preventDefault(); setTermOpen(true);
      } else if (e.key === 'Escape' && termOpen) {
        setTermOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [termOpen]);

  function jumpTo(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  function toggleTheme(e) {
    const next = t.theme === 'dark' ? 'light' : 'dark';
    const x = e ? e.clientX : window.innerWidth - 80;
    const y = e ? e.clientY : window.innerHeight - 20;
    performThemeSwipe(next, x, y);
    setTimeout(() => setTweak('theme', next), 180);
  }

  return (
    <div className="shell">
      <ShaderBg />

      <div className="titlebar">
        <div className="lights"><div className="light r"/><div className="light y"/><div className="light g"/></div>
        <div className="tb-title">~/destinbernie/<b>portfolio</b> — {SECTIONS.find(s => s.id === active)?.label}</div>
        <div className="tb-actions">
          <button className="tb-btn term" onClick={() => setTermOpen(true)}>
            <Icon.term /> <span className="label-long">terminal mode</span>
            <span className="tb-kbd">`</span>
          </button>
          <button className="tb-btn" onClick={(e) => toggleTheme(e)}>
            {t.theme === 'dark' ? <Icon.sun /> : <Icon.moon />}
            <span className="label-long">{t.theme === 'dark' ? 'light' : 'dark'}</span>
          </button>
        </div>
      </div>

      <TabBar active={active} onPick={jumpTo} />

      <div className="main">
        <div className="gutter" aria-hidden="true">
          {Array.from({length: 60}).map((_, i) => (
            <div key={i} className={'ln' + (i % 9 === 0 ? ' mark' : '')}>{String(i+1).padStart(2,'0')}</div>
          ))}
        </div>
        <div className="content">

          <Hero onTerminal={() => setTermOpen(true)} />

          <section id="projects" className="section" data-screen-label="02 Projects">
            <div className="sec-head">
              <span className="hash">##</span>
              <span className="num">02</span>
              <span>selected.projects</span>
              <span className="line" />
              <span style={{color:'var(--fg-4)'}}>{PROJECTS.length} files</span>
            </div>
            <div className="projects">
              {PROJECTS.map((p, i) => <ProjectCard key={p.slug} p={p} idx={i} />)}
            </div>
          </section>

          <section id="apps" className="section" data-screen-label="03 Apps">
            <div className="sec-head">
              <span className="hash">##</span>
              <span className="num">03</span>
              <span>mobile.apps</span>
              <span className="line" />
              <span style={{color:'var(--fg-4)'}}>scan / tap to install</span>
            </div>
            <div className="apps-grid">
              {APPS.map((a, i) => <AppCard key={a.name} a={a} seed={i+1} />)}
            </div>
          </section>

          <section id="about" className="section" data-screen-label="04 About">
            <div className="sec-head">
              <span className="hash">##</span>
              <span className="num">04</span>
              <span>about.json</span>
              <span className="line" />
            </div>
            <About />
          </section>

          <section id="blog" className="section" data-screen-label="05 Blog">
            <div className="sec-head">
              <span className="hash">##</span>
              <span className="num">05</span>
              <span>writing.md</span>
              <span className="line" />
              <span style={{color:'var(--fg-4)'}}>{POSTS.length} posts</span>
            </div>
            <Blog />
          </section>

          <section id="contact" className="section" data-screen-label="06 Contact">
            <div className="sec-head">
              <span className="hash">##</span>
              <span className="num">06</span>
              <span>contact.sh</span>
              <span className="line" />
            </div>
            <Contact />
          </section>

        </div>
      </div>

      <StatusBar
        active={active}
        theme={t.theme}
        onTheme={(e) => toggleTheme(e)}
        onTerminal={() => setTermOpen(true)}
      />

      <PortfolioTerminal
        open={termOpen}
        onClose={() => setTermOpen(false)}
        theme={t.theme}
        setTheme={(v) => setTweak('theme', v)}
        accent={t.accent}
        setAccent={(v) => setTweak('accent', v)}
        font={t.font}
        setFont={(v) => setTweak('font', v)}
        projects={PROJECTS}
        scrollTo={jumpTo}
      />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme" />
        <TweakRadio label="Mode" value={t.theme}
          options={['dark','light']}
          onChange={(v) => {
            // animate transition
            const r = document.body.getBoundingClientRect();
            performThemeSwipe(v, r.width - 80, r.height - 20);
            setTimeout(() => setTweak('theme', v), 180);
          }} />
        <TweakColor label="Accent" value={t.accent}
          options={['#ff7a3d','#7c5cff','#34d399','#60a5fa','#ff7a93']}
          onChange={(v) => setTweak('accent', v)} />
        <TweakSection label="Type" />
        <TweakRadio label="Pairing" value={t.font}
          options={['mono','sans','mixed']}
          onChange={(v) => setTweak('font', v)} />
        <TweakSection label="Shortcuts" />
        <div style={{fontFamily:'var(--font-mono)', fontSize:11, color:'var(--fg-3)', lineHeight:1.7}}>
          <div><span style={{color:'var(--accent)'}}>`</span> &nbsp; open terminal mode</div>
          <div><span style={{color:'var(--accent)'}}>esc</span> &nbsp; exit terminal mode</div>
          <div><span style={{color:'var(--accent)'}}>↑/↓</span> &nbsp; command history</div>
        </div>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
