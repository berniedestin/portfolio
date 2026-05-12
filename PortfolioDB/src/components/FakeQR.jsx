import { useMemo } from 'react';

export default function FakeQR({ seed = 1 }) {
  const cells = useMemo(() => {
    const grid = [];
    let s = seed * 9301 + 49297;
    for (let y = 0; y < 21; y++) {
      const row = [];
      for (let x = 0; x < 21; x++) {
        s = (s * 9301 + 49297) % 233280;
        row.push((s / 233280) > 0.55 ? 1 : 0);
      }
      grid.push(row);
    }
    function finder(g, ox, oy) {
      for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) {
        g[oy + y][ox + x] = (x === 0 || x === 6 || y === 0 || y === 6 || (x >= 2 && x <= 4 && y >= 2 && y <= 4)) ? 1 : 0;
      }
    }
    finder(grid, 0, 0); finder(grid, 14, 0); finder(grid, 0, 14);
    return grid;
  }, [seed]);

  return (
    <svg viewBox="0 0 21 21" shapeRendering="crispEdges">
      {cells.flatMap((row, y) => row.map((v, x) =>
        v ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#0a0b0d" /> : null
      ))}
    </svg>
  );
}
