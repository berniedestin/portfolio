import { useState } from 'react';
import { Icon } from '../icons';

export default function Contact() {
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
          <div className="lights">
            <div className="light r" /><div className="light y" /><div className="light g" />
          </div>
          <span style={{ flex: 1, textAlign: 'center' }}>$ ./contact.sh</span>
        </div>
        <div className="term-body">
          <div><span className="cmd">$</span> hello <span style={{ color: 'var(--c-cmt)' }}># tell me about your project</span></div>
          <label htmlFor="c-name">--name</label>
          <input id="c-name" value={name} onChange={e => setName(e.target.value)} placeholder="Ada Lovelace" required />
          <label htmlFor="c-email">--email</label>
          <input id="c-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ada@example.com" required />
          <label htmlFor="c-msg">--message</label>
          <textarea id="c-msg" value={msg} rows={4} onChange={e => setMsg(e.target.value)} placeholder="hi destin, i'd love to chat about…" required />
          <div style={{ marginTop: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
            <button type="submit" className="btn primary"><Icon.send /> send</button>
            {sent && <span style={{ color: '#9bd17a', fontFamily: 'var(--font-mono)', fontSize: 12 }}>→ exit code 0. message queued.</span>}
          </div>
        </div>
      </form>
      <aside className="contact-side">
        <div className="row"><span className="k">email</span><span className="v"><a href="mailto:hello@destinbernie.dev">hello@destinbernie.dev</a></span></div>
        <div className="row"><span className="k">github</span><span className="v"><a href="https://github.com/berniedestin" target="_blank" rel="noreferrer">berniedestin</a></span></div>
        <div className="row"><span className="k">site</span><span className="v">destinbernie.dev</span></div>
        <div className="row"><span className="k">tz</span><span className="v">UTC−5 · usually online 09:00–18:00</span></div>
        <div className="row"><span className="k">status</span><span className="v" style={{ color: '#9bd17a' }}>● open to projects</span></div>
        <div style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', lineHeight: 1.6 }}>
          Prefer terminal? Try <span style={{ color: 'var(--accent)' }}>contact</span> in terminal mode.
        </div>
      </aside>
    </div>
  );
}
