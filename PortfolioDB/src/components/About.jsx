import { TIMELINE } from '../data';

const STACK = ['Rust', 'Vue.js', 'React Native', 'C#', '.NET Core', 'Blazor', 'TypeScript', 'PostgreSQL', 'GraphQL', 'WebGL'];

export default function About() {
  return (
    <div className="about">
      <div className="about-col">
        <h2>Background</h2>
        <p>I&apos;m a software engineer with a soft spot for tools that disappear and games that don&apos;t. I work fluently across the stack — services in C#/.NET, frontends in Vue, mobile in React Native — and reach for Rust when correctness matters most.</p>
        <p>Lately I&apos;ve been writing more about my craft, building games as toys to test ideas, and trying to keep my designs honest.</p>
        <div className="stack">
          {STACK.map(t => <span key={t} className="tag">{t}</span>)}
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
