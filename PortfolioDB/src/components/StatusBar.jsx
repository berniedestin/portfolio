import { Icon } from '../icons';

export default function StatusBar({ active, onTheme, theme, onTerminal }) {
  return (
    <div className="statusbar">
      <span className="sb-item">⌘ destin@portfolio</span>
      <span className="sb-item">UTF-8</span>
      <span className="sb-item">main</span>
      <span className="sb-item">/{active}</span>
      <div className="sb-spacer" />
      <button className="sb-btn" onClick={onTheme}>
        {theme === 'dark' ? <><Icon.sun /> light</> : <><Icon.moon /> dark</>}
      </button>
      <button className="sb-btn" onClick={onTerminal}>
        <Icon.term /> terminal · <span style={{ opacity: .7 }}>`</span>
      </button>
    </div>
  );
}
