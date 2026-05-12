import { useRef, useEffect } from 'react';

// ── Setback (Trouble clone) — animated dice + token race ──────────
export function SetbackAnim() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;

    const tokens = [
      { color: '#ff7a3d', a: 0,   target: 0 },
      { color: '#6cb9ff', a: 1.5, target: 1.5 },
      { color: '#9bd17a', a: 3.0, target: 3.0 },
      { color: '#c79bff', a: 4.5, target: 4.5 },
    ];
    let dice = 1, phaseT = 0, mover = 0;
    let phase = 'roll';

    function size() {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr; canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    const ro = new ResizeObserver(() => requestAnimationFrame(size)); ro.observe(canvas);

    function roundRect(c, x, y, w, h, r) {
      c.beginPath();
      c.moveTo(x + r, y);
      c.arcTo(x + w, y,     x + w, y + h, r);
      c.arcTo(x + w, y + h, x,     y + h, r);
      c.arcTo(x,     y + h, x,     y,     r);
      c.arcTo(x,     y,     x + w, y,     r);
      c.closePath();
    }
    function drawPips(c, x, y, s, n) {
      c.fillStyle = '#1a0c00';
      const p = (px, py) => { c.beginPath(); c.arc(x + px * s, y + py * s, 2.2, 0, Math.PI * 2); c.fill(); };
      const m = {
        1: [[.5, .5]],
        2: [[.28, .28], [.72, .72]],
        3: [[.28, .28], [.5, .5], [.72, .72]],
        4: [[.28, .28], [.72, .28], [.28, .72], [.72, .72]],
        5: [[.28, .28], [.72, .28], [.5, .5], [.28, .72], [.72, .72]],
        6: [[.28, .25], [.72, .25], [.28, .5], [.72, .5], [.28, .75], [.72, .75]],
      };
      m[n].forEach(([a, b]) => p(a, b));
    }

    function draw(now) {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(127,127,140,0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 24) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 24) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

      const cx = w / 2, cy = h / 2 + 6;
      const R = Math.min(w, h) * 0.32;
      ctx.strokeStyle = 'rgba(127,127,140,0.22)';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();

      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.fillStyle = 'rgba(127,127,140,0.25)';
        ctx.arc(cx + Math.cos(a) * R, cy + Math.sin(a) * R, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      tokens.forEach(t => {
        t.a += (t.target - t.a) * 0.12;
        const a = (t.a / 16) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
        ctx.beginPath();
        ctx.fillStyle = t.color;
        ctx.shadowColor = t.color; ctx.shadowBlur = 8;
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      const dx = cx - 16, dy = cy - 16;
      ctx.fillStyle = 'rgba(255,255,255,0.93)';
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      roundRect(ctx, dx, dy, 32, 32, 6);
      ctx.fill(); ctx.stroke();
      const face = phase === 'roll' ? ((Math.floor(now / 80) % 6) + 1) : dice;
      drawPips(ctx, dx, dy, 32, face);

      phaseT += 1;
      if (phase === 'roll' && phaseT > 80) {
        dice = 1 + Math.floor(Math.random() * 6);
        tokens[mover].target = (tokens[mover].target + dice) % 16;
        phase = 'move'; phaseT = 0;
      } else if (phase === 'move' && phaseT > 70) {
        mover = (mover + 1) % tokens.length;
        phase = 'roll'; phaseT = 0;
      }

      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  return <canvas ref={ref} />;
}

// ── Etch-a-sketch — auto-drawing on a grid ─────────────────────
export function EtchAnim() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;

    function size() {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr; canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    const ro = new ResizeObserver(() => requestAnimationFrame(() => { size(); cells.length = 0; init(); }));
    ro.observe(canvas);

    let cols = 0, rows = 0, cell = 0;
    let cells = [];
    let head = { x: 0, y: 0, dx: 1, dy: 0 };
    let stepT = 0;
    let hue = 22;

    function init() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      cell = 12;
      cols = Math.floor(w / cell);
      rows = Math.floor(h / cell);
      head = { x: Math.floor(cols / 2), y: Math.floor(rows / 2), dx: 1, dy: 0 };
      cells = [];
    }
    init();

    function step() {
      if (Math.random() < 0.15) {
        const turn = Math.random() < 0.5 ? -1 : 1;
        const ndx = -head.dy * turn;
        const ndy = head.dx * turn;
        head.dx = ndx; head.dy = ndy;
      }
      head.x += head.dx; head.y += head.dy;
      if (head.x < 0) { head.x = 0; head.dx = 1; }
      if (head.x >= cols) { head.x = cols - 1; head.dx = -1; }
      if (head.y < 0) { head.y = 0; head.dy = 1; }
      if (head.y >= rows) { head.y = rows - 1; head.dy = -1; }
      cells.push({ x: head.x, y: head.y, h: hue });
      hue = (hue + 0.5) % 360;
      if (cells.length > Math.floor(cols * rows * 0.55)) cells.splice(0, 60);
    }

    function draw() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      const dark = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';
      ctx.fillStyle = dark ? 'rgba(10,11,13,0.10)' : 'rgba(250,250,248,0.10)';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = dark ? 'rgba(127,127,140,0.06)' : 'rgba(60,60,70,0.06)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= cols; x++) {
        ctx.beginPath(); ctx.moveTo(x * cell, 0); ctx.lineTo(x * cell, rows * cell); ctx.stroke();
      }
      for (let y = 0; y <= rows; y++) {
        ctx.beginPath(); ctx.moveTo(0, y * cell); ctx.lineTo(cols * cell, y * cell); ctx.stroke();
      }

      stepT += 1;
      if (stepT % 2 === 0) step();

      cells.forEach(c => {
        ctx.fillStyle = `hsl(${c.h}, 80%, ${dark ? 60 : 48}%)`;
        ctx.fillRect(c.x * cell + 1, c.y * cell + 1, cell - 2, cell - 2);
      });

      ctx.fillStyle = '#ff7a3d';
      ctx.shadowColor = '#ff7a3d'; ctx.shadowBlur = 14;
      ctx.fillRect(head.x * cell + 1, head.y * cell + 1, cell - 2, cell - 2);
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  return <canvas ref={ref} />;
}

// ── Canvas Sandbox — particle physics swirl ────────────────────
export function CanvasSandboxAnim() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;

    function size() {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr; canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    const ro = new ResizeObserver(() => requestAnimationFrame(size)); ro.observe(canvas);

    const N = 90;
    const ps = Array.from({ length: N }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - .5) * .002, vy: (Math.random() - .5) * .002,
      r: 1 + Math.random() * 1.6,
      h: 18 + Math.random() * 30,
    }));
    let t = 0;

    function draw() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      const dark = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';
      ctx.fillStyle = dark ? 'rgba(10,11,13,0.18)' : 'rgba(250,250,248,0.22)';
      ctx.fillRect(0, 0, w, h);
      t += 0.006;

      const cx = .5 + Math.cos(t * 0.7) * 0.12, cy = .5 + Math.sin(t * 0.5) * 0.08;

      ps.forEach(p => {
        const dx = cx - p.x, dy = cy - p.y;
        const d2 = dx * dx + dy * dy + 0.0008;
        const f = 0.00006 / d2;
        p.vx += -dy * f - dx * f * .6;
        p.vy +=  dx * f - dy * f * .6;
        p.vx *= 0.985; p.vy *= 0.985;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;

        const px = p.x * w, py = p.y * h;
        const speed = Math.hypot(p.vx, p.vy) * 200;
        const alpha = Math.min(1, .35 + speed * .6);
        ctx.fillStyle = `hsla(${p.h}, 90%, ${dark ? 62 : 50}%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.strokeStyle = dark ? 'rgba(255,122,61,0.06)' : 'rgba(255,122,61,0.10)';
      ctx.lineWidth = 1;
      for (let i = 0; i < N; i += 2) {
        for (let j = i + 1; j < Math.min(i + 6, N); j++) {
          const a = ps[i], b = ps[j];
          const dx = (a.x - b.x) * w, dy = (a.y - b.y) * h;
          if (Math.hypot(dx, dy) < 50) {
            ctx.beginPath();
            ctx.moveTo(a.x * w, a.y * h);
            ctx.lineTo(b.x * w, b.y * h);
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  return <canvas ref={ref} />;
}

// ── Drag/UI loop demo ──────────────────────────────────────────
export function DragDemoAnim() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;

    function size() {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr; canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    const ro = new ResizeObserver(() => requestAnimationFrame(size)); ro.observe(canvas);

    const items = [
      { y: 0, label: 'task: build hero',  done: true,  hue: 130 },
      { y: 1, label: 'task: shader bg',   done: true,  hue: 130 },
      { y: 2, label: 'task: terminal',    done: false, hue: 22 },
      { y: 3, label: 'task: animations',  done: false, hue: 22 },
    ];
    let dragging = -1, t = 0;
    let cursor = { x: 0.6, y: 0.4 };
    let tgtCursor = { x: 0.6, y: 0.4 };

    function roundRect(c, x, y, w, h, r) {
      c.beginPath();
      c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r);
      c.arcTo(x + w, y + h, x, y + h, r);
      c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r);
      c.closePath();
    }

    function draw() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      const dark = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';
      ctx.fillStyle = dark ? '#0f1115' : '#fafaf8';
      ctx.fillRect(0, 0, w, h);

      t += 0.012;
      const cyc = t % 6;
      if (cyc < 0.5) {
        tgtCursor = { x: 0.78, y: 0.55 };
      } else if (cyc < 1.5) {
        dragging = 2;
        tgtCursor = { x: 0.78, y: 0.55 };
      } else if (cyc < 3) {
        tgtCursor = { x: 0.78, y: 0.18 };
        if (dragging >= 0) items[dragging].y += (0.5 - items[dragging].y) * 0.18;
      } else if (cyc < 3.6) {
        if (dragging >= 0) {
          items[dragging].done = true;
          items[dragging].hue = 130;
          const sorted = [...items].sort((a, b) => (a.done ? 0 : 1) - (b.done ? 0 : 1));
          sorted.forEach((it, i) => { it.y = i; });
          dragging = -1;
        }
        tgtCursor = { x: 0.5, y: 0.5 };
      } else {
        tgtCursor = { x: 0.5, y: 0.5 };
        if (cyc > 5.5) items.forEach((it, i) => { it.y = i; it.done = i < 2; it.hue = i < 2 ? 130 : 22; });
      }

      cursor.x += (tgtCursor.x - cursor.x) * 0.12;
      cursor.y += (tgtCursor.y - cursor.y) * 0.12;

      const px = 24, py = 22, rowH = 32, rowW = w - px * 2;
      items.forEach((it, i) => {
        it.y += (i - it.y) * 0.18;
        const y = py + it.y * rowH;
        const isDrag = dragging === i;
        ctx.fillStyle = isDrag ? (dark ? '#1a1e25' : '#ecebe6') : (dark ? '#14171c' : '#f4f3ef');
        roundRect(ctx, px, y, rowW, rowH - 4, 5);
        ctx.fill();
        if (isDrag) { ctx.strokeStyle = '#ff7a3d'; ctx.lineWidth = 1; ctx.stroke(); }

        ctx.strokeStyle = it.done ? `hsl(${it.hue}, 70%, 55%)` : (dark ? '#4a4f59' : '#9ca0a8');
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(px + 14, y + (rowH - 4) / 2, 6, 0, Math.PI * 2); ctx.stroke();
        if (it.done) {
          ctx.fillStyle = `hsl(${it.hue}, 70%, 55%)`;
          ctx.beginPath(); ctx.arc(px + 14, y + (rowH - 4) / 2, 3.5, 0, Math.PI * 2); ctx.fill();
        }

        ctx.fillStyle = dark ? '#b8bcc4' : '#3a3d44';
        ctx.font = '11px ui-monospace, "JetBrains Mono", monospace';
        ctx.textBaseline = 'middle';
        ctx.fillText(it.label, px + 30, y + (rowH - 4) / 2 + 1);
        if (it.done) {
          ctx.strokeStyle = dark ? '#7a808a' : '#8b8f97';
          const tw = ctx.measureText(it.label).width;
          ctx.beginPath();
          ctx.moveTo(px + 30, y + (rowH - 4) / 2 + 1);
          ctx.lineTo(px + 30 + tw, y + (rowH - 4) / 2 + 1);
          ctx.stroke();
        }
      });

      const cxp = cursor.x * w, cyp = cursor.y * h;
      ctx.fillStyle = '#ff7a3d';
      ctx.beginPath();
      ctx.moveTo(cxp, cyp); ctx.lineTo(cxp + 12, cyp + 4);
      ctx.lineTo(cxp + 5, cyp + 5); ctx.lineTo(cxp + 8, cyp + 13);
      ctx.lineTo(cxp + 5, cyp + 14); ctx.lineTo(cxp + 2, cyp + 7);
      ctx.lineTo(cxp, cyp + 10);
      ctx.closePath(); ctx.fill();

      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  return <canvas ref={ref} />;
}

// ── Code-to-output transform ────────────────────────────────────
export function CodeOutputAnim() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;

    function size() {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr; canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    const ro = new ResizeObserver(() => requestAnimationFrame(size)); ro.observe(canvas);

    let t = 0;
    const lines = [
      ['fn ', 'render', '(', 'tree', ': &', 'Node', ')'],
      ['  for ', 'child', ' in ', 'tree.children {'],
      ['    ', 'commit', '(child)'],
      ['  }'],
      ['}'],
    ];

    function draw() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      const dark = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';
      ctx.fillStyle = dark ? '#0f1115' : '#ffffff';
      ctx.fillRect(0, 0, w, h);

      t += 0.01;
      const split = w / 2;
      ctx.strokeStyle = dark ? '#1f2329' : '#e3e0d8';
      ctx.beginPath(); ctx.moveTo(split, 12); ctx.lineTo(split, h - 12); ctx.stroke();

      ctx.font = '11px ui-monospace, "JetBrains Mono", monospace';
      let y = 26;
      lines.forEach(ln => {
        let x = 16;
        ln.forEach(tok => {
          const isKey  = ['fn ', 'for ', ' in '].includes(tok);
          const isFn   = ['render', 'commit'].includes(tok);
          const isType = ['Node'].includes(tok);
          ctx.fillStyle = isKey ? '#c79bff' : isFn ? '#6cb9ff' : isType ? '#79c0d8' : (dark ? '#b8bcc4' : '#3a3d44');
          ctx.fillText(tok, x, y);
          x += ctx.measureText(tok).width;
        });
        y += 16;
      });

      ctx.strokeStyle = '#ff7a3d';
      ctx.lineWidth = 1.5;
      const ay = h / 2;
      ctx.beginPath();
      ctx.moveTo(split - 12, ay); ctx.lineTo(split + 12, ay);
      ctx.moveTo(split + 8, ay - 4); ctx.lineTo(split + 12, ay); ctx.lineTo(split + 8, ay + 4);
      ctx.stroke();

      const cx = split + (w - split) / 2, cy = h / 2;
      const depth = 3, branch = 3;
      const phase = (Math.sin(t * 0.8) * 0.5 + 0.5);
      function node(x, y, d, parent) {
        if (d > depth) return;
        const r = 4 + (depth - d);
        const grown = Math.min(1, Math.max(0, phase * (depth + 1) - d));
        if (grown <= 0) return;
        if (parent) {
          ctx.strokeStyle = `rgba(255,122,61,${0.3 + 0.5 * grown})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(parent.x, parent.y);
          ctx.lineTo(parent.x + (x - parent.x) * grown, parent.y + (y - parent.y) * grown);
          ctx.stroke();
        }
        const tx = parent ? parent.x + (x - parent.x) * grown : x;
        const ty = parent ? parent.y + (y - parent.y) * grown : y;
        ctx.fillStyle = d === 0 ? '#ff7a3d' : (dark ? '#6cb9ff' : '#1f6fdb');
        ctx.beginPath(); ctx.arc(tx, ty, r, 0, Math.PI * 2); ctx.fill();
        const spread = (w - split) * 0.36 / Math.pow(branch, d);
        for (let i = 0; i < branch; i++) {
          node(tx + (i - (branch - 1) / 2) * spread, ty + 32, d + 1, { x: tx, y: ty });
        }
      }
      node(cx, 28, 0, null);

      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  return <canvas ref={ref} />;
}
