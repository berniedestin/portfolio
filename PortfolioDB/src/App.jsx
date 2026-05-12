import { useState, useEffect } from 'react';
import { SECTIONS, PROJECTS, APPS, POSTS } from './data';
import { useActiveSection } from './hooks';
import { performThemeSwipe } from './theme';
import { Icon } from './icons';
import ShaderBg from './components/ShaderBg';
import Hero from './components/Hero';
import ProjectCard from './components/ProjectCard';
import AppCard from './components/AppCard';
import About from './components/About';
import Blog from './components/Blog';
import Contact from './components/Contact';
import TabBar from './components/TabBar';
import StatusBar from './components/StatusBar';
import Terminal from './components/Terminal';
import { useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor } from './components/TweaksPanel';

const TWEAK_DEFAULTS = {
  theme: 'dark',
  accent: '#ff7a3d',
  font: 'mono',
};

export default function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [termOpen, setTermOpen] = useState(false);
  const active = useActiveSection(SECTIONS.map(s => s.id));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', t.theme);
  }, [t.theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', t.accent);
  }, [t.accent]);

  useEffect(() => {
    const map = {
      mono:  { sans: "'JetBrains Mono', ui-monospace, monospace",      display: "'JetBrains Mono', ui-monospace, monospace" },
      sans:  { sans: "'Inter', ui-sans-serif, system-ui, sans-serif",  display: "'Space Grotesk', 'Inter', system-ui, sans-serif" },
      mixed: { sans: "'Inter', ui-sans-serif, system-ui, sans-serif",  display: "'JetBrains Mono', ui-monospace, monospace" },
    };
    const f = map[t.font] || map.mono;
    document.documentElement.style.setProperty('--font-sans', f.sans);
    document.documentElement.style.setProperty('--font-display', f.display);
  }, [t.font]);

  useEffect(() => {
    function onKey(e) {
      const tag = (e.target && e.target.tagName) || '';
      const inField = ['INPUT', 'TEXTAREA'].includes(tag) || (e.target && e.target.isContentEditable);
      if (e.key === '`' && !inField && !termOpen) {
        e.preventDefault();
        setTermOpen(true);
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
        <div className="lights">
          <div className="light r" /><div className="light y" /><div className="light g" />
        </div>
        <div className="tb-title">
          ~/destinbernie/<b>portfolio</b> — {SECTIONS.find(s => s.id === active)?.label}
        </div>
        <div className="tb-actions">
          <button className="tb-btn term" onClick={() => setTermOpen(true)}>
            <Icon.term /> <span className="label-long">terminal mode</span>
            <span className="tb-kbd">`</span>
          </button>
          <button className="tb-btn" onClick={e => toggleTheme(e)}>
            {t.theme === 'dark' ? <Icon.sun /> : <Icon.moon />}
            <span className="label-long">{t.theme === 'dark' ? 'light' : 'dark'}</span>
          </button>
        </div>
      </div>

      <TabBar active={active} onPick={jumpTo} />

      <div className="main">
        <div className="gutter" aria-hidden="true">
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} className={`ln${i % 9 === 0 ? ' mark' : ''}`}>
              {String(i + 1).padStart(2, '0')}
            </div>
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
              <span style={{ color: 'var(--fg-4)' }}>{PROJECTS.length} files</span>
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
              <span style={{ color: 'var(--fg-4)' }}>scan / tap to install</span>
            </div>
            <div className="apps-grid">
              {APPS.map((a, i) => <AppCard key={a.name} a={a} seed={i + 1} />)}
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
              <span style={{ color: 'var(--fg-4)' }}>{POSTS.length} posts</span>
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
        onTheme={e => toggleTheme(e)}
        onTerminal={() => setTermOpen(true)}
      />

      <Terminal
        open={termOpen}
        onClose={() => setTermOpen(false)}
        theme={t.theme}
        setTheme={v => setTweak('theme', v)}
        accent={t.accent}
        setAccent={v => setTweak('accent', v)}
        font={t.font}
        setFont={v => setTweak('font', v)}
        projects={PROJECTS}
        scrollTo={jumpTo}
      />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme" />
        <TweakRadio
          label="Mode"
          value={t.theme}
          options={['dark', 'light']}
          onChange={v => {
            const r = document.body.getBoundingClientRect();
            performThemeSwipe(v, r.width - 80, r.height - 20);
            setTimeout(() => setTweak('theme', v), 180);
          }}
        />
        <TweakColor
          label="Accent"
          value={t.accent}
          options={['#ff7a3d', '#7c5cff', '#34d399', '#60a5fa', '#ff7a93']}
          onChange={v => setTweak('accent', v)}
        />
        <TweakSection label="Type" />
        <TweakRadio
          label="Pairing"
          value={t.font}
          options={['mono', 'sans', 'mixed']}
          onChange={v => setTweak('font', v)}
        />
        <TweakSection label="Shortcuts" />
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', lineHeight: 1.7 }}>
          <div><span style={{ color: 'var(--accent)' }}>`</span> &nbsp; open terminal mode</div>
          <div><span style={{ color: 'var(--accent)' }}>esc</span> &nbsp; exit terminal mode</div>
          <div><span style={{ color: 'var(--accent)' }}>↑/↓</span> &nbsp; command history</div>
        </div>
      </TweaksPanel>
    </div>
  );
}
