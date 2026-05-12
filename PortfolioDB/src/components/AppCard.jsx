import { Icon } from '../icons';
import FakeQR from './FakeQR';

export default function AppCard({ a, seed }) {
  return (
    <div className="app-card">
      <div className="phone">
        <div className="notch" />
        <div className="screen">
          <div className="ph-content">
            <div style={{ color: a.color, fontWeight: 600, fontSize: 13, marginBottom: 8 }}>
              {a.name.split('—')[0].trim()}
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 8, fontSize: 9 }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: '#28c840' }} /> live
            </div>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{
                background: 'rgba(127,127,140,0.10)',
                border: '1px solid rgba(127,127,140,0.18)',
                borderRadius: 4, padding: '5px 7px', marginBottom: 5,
                fontSize: 9, display: 'flex', justifyContent: 'space-between',
              }}>
                <span>player {i}</span>
                <span style={{ color: a.color }}>{(i * 97 + seed * 13) % 100}</span>
              </div>
            ))}
            <div style={{ flex: 1 }} />
            <div style={{
              background: a.color, color: '#1a0c00',
              borderRadius: 5, padding: '6px 8px', textAlign: 'center', fontSize: 9, fontWeight: 600,
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
