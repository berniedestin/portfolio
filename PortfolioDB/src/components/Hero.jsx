import { Icon } from '../icons';
import { useTyped } from '../hooks';

const CODE_LINES = [
  [['cmt', '// always be shipping']],
  [['key', 'struct '], ['prop', 'Engineer'], ['pun', ' {']],
  [['pun', '  '], ['prop', 'name'], ['pun', ': &'], ['key', 'str'], ['pun', ',']],
  [['pun', '  '], ['prop', 'stack'], ['pun', ': '], ['key', 'Vec'], ['pun', '<&'], ['key', 'str'], ['pun', '>,']],
  [['pun', '  '], ['prop', 'curiosity'], ['pun', ': '], ['num', 'f64'], ['pun', ',']],
  [['pun', '}']],
  [['']],
  [['key', 'impl '], ['prop', 'Engineer'], ['pun', ' {']],
  [['pun', '  '], ['key', 'fn '], ['fn', 'new'], ['pun', '() -> '], ['key', 'Self'], ['pun', ' {']],
  [['pun', '    '], ['prop', 'Self'], ['pun', ' {']],
  [['pun', '      name: '], ['str', '"Destin Bernie"'], ['pun', ',']],
  [['pun', '      stack: '], ['key', 'vec!'], ['pun', '['], ['str', '"rust"'], ['pun', ', '], ['str', '"vue"'], ['pun', ', '], ['str', '"react-native"'], ['pun', ', '], ['str', '"c#"'], ['pun', ', '], ['str', '"blazor"'], ['pun', '],']],
  [['pun', '      curiosity: '], ['num', 'f64'], ['pun', '::'], ['prop', 'INFINITY'], ['pun', ',']],
  [['pun', '    } } }']],
];

function HeroCodePanel() {
  return (
    <div className="code-panel">
      <div className="code-head">
        <div className="lights">
          <div className="light r" /><div className="light y" /><div className="light g" />
        </div>
        <span style={{ flex: 1, textAlign: 'center' }}>destin.rs</span>
      </div>
      <div className="code-body">
        <div className="code-lines">
          {Array.from({ length: CODE_LINES.length }).map((_, i) => <div key={i}>{i + 1}</div>)}
        </div>
        <div className="code-text">
          {CODE_LINES.map((line, li) => (
            <div key={li}>
              {line.map(([cls, txt], ti) => (
                <span key={ti} className={`tok-${cls}`}>{txt}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Hero({ onTerminal }) {
  const typed = useTyped(['Software Engineer', 'Process Control', 'Tool & Die', 'Dancer'], 55, 1200);
  return (
    <section id="hero" className="hero" data-screen-label="01 Hero">
      <div>
        <div className="greet">
          <span className="pulse" />
          <span>~/destinbernie · available for select projects</span>
        </div>
        <h1>
          Hey, I&apos;m <span className="accent">Destin</span>.
          <br />
          <span style={{ whiteSpace: 'nowrap' }}>{typed}<span className="caret" /></span>
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
