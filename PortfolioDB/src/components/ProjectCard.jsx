import * as Animations from '../animations';
import { Icon } from '../icons';

export default function ProjectCard({ p, idx }) {
  const Anim = Animations[p.Anim];
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
          <div className="proj-num">/* {String(idx + 1).padStart(2, '0')} */</div>
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
            <a className="lnk" href={`https://${p.repo}`} target="_blank" rel="noreferrer">
              <Icon.github /> source
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
