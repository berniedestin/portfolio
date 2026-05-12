import { useState, useRef, useEffect } from 'react';

const TERM_BANNER = String.raw`
  ___  ____  ____  ____  ____  __ _    ____  ____  ____  __ _  __  ____
 (   \(  __)/ ___)(_  _)(_  _)(  ( \  (  _ \(  __)(  _ \(  ( \(  )(  __)
  ) D ( ) _) \___ \  )(    )(  /    /  ) _ ( ) _)  )   //    / )(  ) _)
 (____/(____)(____/ (__)  (__) \_)__)  (____/(____)(__\_)\_)__)(__)(____)
                                                                v 2.4.0
`;

export default function Terminal({ open, onClose, theme, setTheme, accent, setAccent, font, setFont, projects, scrollTo }) {
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [hIdx, setHIdx] = useState(-1);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    if (!open) return;
    function escAnywhere(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onCloseRef.current && onCloseRef.current();
      }
    }
    window.addEventListener('keydown', escAnywhere, true);
    return () => window.removeEventListener('keydown', escAnywhere, true);
  }, [open]);

  useEffect(() => {
    if (open && lines.length === 0) {
      setLines([
        { kind: 'banner' },
        { kind: 'out', text: "Welcome. This is destin's shell. You are running portfolio-os 2.4.0." },
        { kind: 'out', text: 'Type ' + tag('help', 'key') + ' for available commands. ' + tag('home', 'key') + ' to return.' },
        { kind: 'spacer' },
      ]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const s = scrollRef.current;
    if (s) s.scrollTop = s.scrollHeight;
  }, [lines]);

  function tag(s, cls) { return `<<${cls}|${s}>>`; }
  function emit(...newLines) { setLines(prev => [...prev, ...newLines]); }
  function mkPrompt(cmdText) { return { kind: 'prompt', cmd: cmdText }; }

  function help() {
    const cmds = [
      ['help', 'show this list'],
      ['home / exit', 'return to the website'],
      ['ls', 'list sections of the site'],
      ['cd <section>', 'jump to a section (hero, projects, apps, about, blog, contact)'],
      ['projects', 'list projects with links'],
      ['open <slug>', 'open a project URL in a new tab'],
      ['cat <slug>', 'show project details'],
      ['blog', 'list recent writing'],
      ['about', 'show bio'],
      ['contact', 'show contact info'],
      ['whoami', 'tell me about you'],
      ['theme [dark|light]', 'switch theme (toggles if no arg)'],
      ['accent <hex|name>', 'set accent color (e.g. #34d399, orange, blue)'],
      ['font <mono|sans|mixed>', 'switch font pairing'],
      ['neofetch', 'show system info card'],
      ['echo <text>', 'print text'],
      ['date', 'current date & time'],
      ['clear', 'clear the screen'],
      ['sudo', 'try it'],
    ];
    return [
      { kind: 'out', text: 'AVAILABLE COMMANDS' },
      { kind: 'spacer' },
      ...cmds.map(([c, d]) => ({ kind: 'gridrow', cmd: c, desc: d })),
      { kind: 'spacer' },
    ];
  }

  function neofetch() {
    const upMs = performance.now();
    const up = `${Math.floor(upMs / 60000)}m ${Math.floor((upMs % 60000) / 1000)}s`;
    const rows = [
      ['user',   'destin@portfolio'],
      ['os',     'portfolio-os 2.4.0 (web)'],
      ['shell',  '/bin/destinsh'],
      ['kernel', 'react 18.3.1 / vite'],
      ['theme',  theme],
      ['accent', accent],
      ['font',   font],
      ['uptime', up],
      ['stack',  'rust • vue • react-native • c# • .net core • blazor'],
      ['repo',   'github.com/berniedestin'],
    ];
    return [...rows.map(([k, v]) => ({ kind: 'gridrow', cmd: k, desc: v })), { kind: 'spacer' }];
  }

  function ls() {
    return [
      { kind: 'out', text: 'total 6' },
      { kind: 'out', text: tag('drwxr-xr-x', 'mute') + '  hero/        # the front door' },
      { kind: 'out', text: tag('drwxr-xr-x', 'mute') + '  projects/    # selected work' },
      { kind: 'out', text: tag('drwxr-xr-x', 'mute') + '  apps/        # mobile prototypes' },
      { kind: 'out', text: tag('drwxr-xr-x', 'mute') + '  about/       # bio & timeline' },
      { kind: 'out', text: tag('drwxr-xr-x', 'mute') + '  blog/        # essays' },
      { kind: 'out', text: tag('drwxr-xr-x', 'mute') + '  contact/     # say hi' },
      { kind: 'spacer' },
    ];
  }

  function listProjects() {
    const out = [{ kind: 'out', text: 'PROJECTS' }, { kind: 'spacer' }];
    projects.forEach((p, i) => {
      out.push({ kind: 'gridrow', cmd: `${String(i + 1).padStart(2, '0')}  ${p.slug}`, desc: p.title });
    });
    out.push({ kind: 'spacer' });
    out.push({ kind: 'out', text: 'use ' + tag('open <slug>', 'key') + ' or ' + tag('cat <slug>', 'key') + ' for details.' });
    out.push({ kind: 'spacer' });
    return out;
  }

  function cat(slug) {
    const p = projects.find(x => x.slug === slug);
    if (!p) return [{ kind: 'err', text: `cat: ${slug}: no such project. try \`projects\`.` }, { kind: 'spacer' }];
    return [
      { kind: 'gridrow', cmd: 'name',  desc: p.title },
      { kind: 'gridrow', cmd: 'desc',  desc: p.desc },
      { kind: 'gridrow', cmd: 'stack', desc: p.tags.join(' · ') },
      { kind: 'gridrow', cmd: 'live',  desc: p.url ? `<<a|${p.url}>>` : '—' },
      { kind: 'gridrow', cmd: 'src',   desc: p.repo || '—' },
      { kind: 'spacer' },
    ];
  }

  function openProject(slug) {
    const p = projects.find(x => x.slug === slug);
    if (!p) return [{ kind: 'err', text: `open: ${slug}: no such project.` }, { kind: 'spacer' }];
    if (!p.url || p.url === '#') return [{ kind: 'err', text: `open: ${slug}: no live URL.` }, { kind: 'spacer' }];
    window.open(p.url, '_blank', 'noopener');
    return [{ kind: 'ok', text: `→ opening ${p.url} in a new tab…` }, { kind: 'spacer' }];
  }

  function aboutOut() {
    return [
      { kind: 'out', text: tag('Destin Bernie', 'ok') + ' — Software Engineer.' },
      { kind: 'out', text: 'Building thoughtfully across the stack: Rust, Vue.js, React Native, C#, .NET Core, Blazor.' },
      { kind: 'out', text: 'I like things that are correct, performant, and a little bit playful.' },
      { kind: 'spacer' },
    ];
  }

  function blogOut() {
    const posts = [
      ['2026-04-02', 'Why I keep coming back to Rust for tools'],
      ['2026-02-18', 'Vue 3 reactivity demystified, slowly'],
      ['2025-12-10', 'Notes on building a card game with vanilla JS'],
      ['2025-09-22', 'A quiet case for Blazor in 2025'],
    ];
    return [
      { kind: 'out', text: 'RECENT WRITING' },
      { kind: 'spacer' },
      ...posts.map(([d, t]) => ({ kind: 'gridrow', cmd: d, desc: t })),
      { kind: 'spacer' },
    ];
  }

  function contactOut() {
    return [
      { kind: 'gridrow', cmd: 'email',  desc: '<<a|mailto:hello@destinbernie.dev>>' },
      { kind: 'gridrow', cmd: 'github', desc: '<<a|https://github.com/berniedestin>>' },
      { kind: 'gridrow', cmd: 'site',   desc: 'destinbernie.dev' },
      { kind: 'spacer' },
    ];
  }

  function run(raw) {
    const trimmed = raw.trim();
    if (!trimmed) { emit(mkPrompt('')); return; }
    const out = [mkPrompt(trimmed)];
    const [cmd, ...rest] = trimmed.split(/\s+/);
    const arg = rest.join(' ').trim();
    setHistory(h => [...h, trimmed]);
    setHIdx(-1);

    switch (cmd.toLowerCase()) {
      case 'help': case '?':
        out.push(...help()); break;
      case 'home': case 'exit': case 'quit':
        out.push({ kind: 'ok', text: '→ returning to UI…' });
        emit(...out);
        setTimeout(() => onClose(), 280);
        return;
      case 'clear': case 'cls':
        setLines([]); return;
      case 'ls':
        out.push(...ls()); break;
      case 'cd': {
        const dest = (arg || '').replace(/\/$/, '').toLowerCase();
        const valid = ['hero', 'projects', 'apps', 'about', 'blog', 'contact'];
        if (!dest) out.push({ kind: 'err', text: 'cd: missing argument. try `cd projects`.' }, { kind: 'spacer' });
        else if (!valid.includes(dest)) out.push({ kind: 'err', text: `cd: ${dest}: no such directory.` }, { kind: 'spacer' });
        else {
          out.push({ kind: 'ok', text: `→ jumping to /${dest}…` });
          emit(...out);
          setTimeout(() => { onClose(); setTimeout(() => scrollTo(dest), 320); }, 260);
          return;
        }
        break;
      }
      case 'projects': case 'proj':
        out.push(...listProjects()); break;
      case 'open':
        if (!arg) out.push({ kind: 'err', text: 'open: missing slug.' }, { kind: 'spacer' });
        else out.push(...openProject(arg));
        break;
      case 'cat':
        if (!arg) out.push({ kind: 'err', text: 'cat: missing slug.' }, { kind: 'spacer' });
        else out.push(...cat(arg));
        break;
      case 'about':   out.push(...aboutOut()); break;
      case 'blog':    out.push(...blogOut()); break;
      case 'contact': out.push(...contactOut()); break;
      case 'whoami':
        out.push({ kind: 'out', text: "you're a curious visitor with good taste." }, { kind: 'spacer' }); break;
      case 'theme': {
        const next = arg ? arg.toLowerCase() : (theme === 'dark' ? 'light' : 'dark');
        if (!['dark', 'light'].includes(next)) {
          out.push({ kind: 'err', text: `theme: '${arg}' is not dark or light.` }, { kind: 'spacer' });
        } else {
          setTheme(next);
          out.push({ kind: 'ok', text: `→ theme set to ${next}.` }, { kind: 'spacer' });
        }
        break;
      }
      case 'accent': {
        const named = { orange: '#ff7a3d', purple: '#7c5cff', green: '#34d399', blue: '#60a5fa', pink: '#ff7a93', red: '#ff5f57' };
        const v = (arg || '').toLowerCase();
        const hex = named[v] || (/^#([0-9a-f]{3}){1,2}$/i.test(v) ? v : null);
        if (!hex) out.push({ kind: 'err', text: 'accent: pass a hex (#RRGGBB) or one of: ' + Object.keys(named).join(', ') }, { kind: 'spacer' });
        else { setAccent(hex); out.push({ kind: 'ok', text: `→ accent set to ${hex}.` }, { kind: 'spacer' }); }
        break;
      }
      case 'font': {
        const v = (arg || '').toLowerCase();
        if (!['mono', 'sans', 'mixed'].includes(v))
          out.push({ kind: 'err', text: 'font: pick one of mono | sans | mixed' }, { kind: 'spacer' });
        else { setFont(v); out.push({ kind: 'ok', text: `→ font pairing → ${v}.` }, { kind: 'spacer' }); }
        break;
      }
      case 'neofetch': case 'fetch':
        out.push(...neofetch()); break;
      case 'echo':
        out.push({ kind: 'out', text: arg }, { kind: 'spacer' }); break;
      case 'date':
        out.push({ kind: 'out', text: new Date().toString() }, { kind: 'spacer' }); break;
      case 'sudo':
        out.push({ kind: 'err', text: 'destin is not in the sudoers file. This incident will be reported.' }, { kind: 'spacer' }); break;
      case 'rm': case 'rm-rf':
        out.push({ kind: 'err', text: "i'm not gonna let you do that." }, { kind: 'spacer' }); break;
      case 'vim': case 'emacs':
        out.push({ kind: 'out', text: "we don't talk about editor wars here." }, { kind: 'spacer' }); break;
      case 'pwd':
        out.push({ kind: 'out', text: '/home/destin/portfolio' }, { kind: 'spacer' }); break;
      case 'banner':
        out.push({ kind: 'banner' }); break;
      default:
        out.push(
          { kind: 'err', text: `command not found: ${cmd}` },
          { kind: 'out', text: 'type ' + tag('help', 'key') + ' for available commands.' },
          { kind: 'spacer' },
        );
    }
    emit(...out);
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      run(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const next = hIdx < 0 ? history.length - 1 : Math.max(0, hIdx - 1);
      setHIdx(next);
      setInput(history[next] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (hIdx < 0) return;
      const next = hIdx + 1;
      if (next >= history.length) { setHIdx(-1); setInput(''); }
      else { setHIdx(next); setInput(history[next]); }
    } else if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault(); setLines([]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  }

  function renderRich(text) {
    if (!text) return null;
    const parts = [];
    const re = /<<([a-z]+)\|([^>]+)>>/g;
    let last = 0, m, i = 0;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) parts.push(text.slice(last, m.index));
      const cls = m[1], txt = m[2];
      if (cls === 'a') {
        parts.push(<a key={i++} href={txt} target="_blank" rel="noopener noreferrer">{txt}</a>);
      } else {
        parts.push(<span key={i++} className={cls}>{txt}</span>);
      }
      last = m.index + m[0].length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts;
  }

  return (
    <div
      className={`term-mode${open ? ' on' : ''}`}
      aria-hidden={!open}
      onMouseDown={() => inputRef.current && inputRef.current.focus()}
    >
      <div className="term-scan" />
      <div className="term-head">
        <button
          type="button"
          className="lights"
          onClick={e => { e.stopPropagation(); onClose(); }}
          style={{ padding: 0, background: 'transparent', border: 0, cursor: 'pointer' }}
          aria-label="Close terminal"
          title="close (esc)"
        >
          <span className="light r" /><span className="light y" /><span className="light g" />
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>destin@portfolio:~ — terminal</div>
        <button
          type="button"
          onClick={e => { e.stopPropagation(); onClose(); }}
          style={{ color: '#5b6270', background: 'transparent', border: '1px solid #1a1d22', padding: '3px 9px', borderRadius: 4, cursor: 'pointer', fontFamily: 'inherit', fontSize: 11 }}
          title="close (esc)"
        >
          esc &nbsp;·&nbsp; close
        </button>
      </div>
      <div className="term-scroll" ref={scrollRef}>
        {lines.map((ln, i) => {
          if (ln.kind === 'banner') return <pre key={i} className="term-banner">{TERM_BANNER}</pre>;
          if (ln.kind === 'spacer') return <div key={i} className="term-line">&nbsp;</div>;
          if (ln.kind === 'prompt') return (
            <div key={i} className="term-line">
              <span className="pmt">$</span> <span className="who">destin</span><span className="at">@</span><span className="path">portfolio</span>{' '}
              <span className="out">{ln.cmd}</span>
            </div>
          );
          if (ln.kind === 'gridrow') return (
            <div key={i} className="term-grid-out">
              <b>{ln.cmd}</b>
              <span className="out">{renderRich(ln.desc)}</span>
            </div>
          );
          const cls = ln.kind === 'err' ? 'err' : ln.kind === 'ok' ? 'ok' : 'out';
          return <div key={i} className="term-line"><span className={cls}>{renderRich(ln.text)}</span></div>;
        })}
      </div>
      <div className="term-input-line">
        <span><span className="pmt">$</span> <span className="who">destin</span><span className="at">@</span><span className="path">portfolio</span></span>
        <input
          ref={inputRef}
          className="term-input"
          value={input}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="terminal input"
        />
      </div>
    </div>
  );
}
