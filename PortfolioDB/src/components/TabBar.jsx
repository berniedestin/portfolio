import { SECTIONS } from '../data';

export default function TabBar({ active, onPick }) {
  return (
    <div className="tabbar" role="tablist">
      {SECTIONS.map(s => (
        <button
          key={s.id}
          className={`tab${active === s.id ? ' active' : ''}`}
          onClick={() => onPick(s.id)}
          role="tab"
          aria-selected={active === s.id}
        >
          <span className="dot" />
          <span>{s.file}<span className="ext">.{s.ext}</span></span>
        </button>
      ))}
    </div>
  );
}
