import { POSTS } from '../data';

export default function Blog() {
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
