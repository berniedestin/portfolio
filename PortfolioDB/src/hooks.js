import { useState, useEffect } from 'react';

export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (els.length === 0) return;
    const io = new IntersectionObserver(entries => {
      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join('|')]);
  return active;
}

export function useTyped(strings, speed = 60, pause = 1400) {
  const [out, setOut] = useState('');
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    let cancelled = false;
    const word = strings[idx % strings.length];
    let i = 0;
    setOut('');
    function type() {
      if (cancelled) return;
      if (i <= word.length) {
        setOut(word.slice(0, i));
        i++;
        setTimeout(type, speed);
      } else {
        setTimeout(() => {
          if (cancelled) return;
          let j = word.length;
          function erase() {
            if (cancelled) return;
            if (j >= 0) {
              setOut(word.slice(0, j));
              j--;
              setTimeout(erase, speed / 2);
            } else {
              setIdx(v => v + 1);
            }
          }
          erase();
        }, pause);
      }
    }
    type();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, strings.join('|')]);
  return out;
}
