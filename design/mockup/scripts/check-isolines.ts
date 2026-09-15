// Self-check for the isoline field: contour particles link only along their own line,
// and no two lines' chords cross. Run: node scripts/check-isolines.ts
import { buildIsolineLayout } from "../src/lib/topo/isolines.ts";

function segmentsCross(a: number[], b: number[]): boolean {
  const [x1, y1, x2, y2] = a;
  const [x3, y3, x4, y4] = b;
  const d = (x2 - x1) * (y4 - y3) - (y2 - y1) * (x4 - x3);
  if (Math.abs(d) < 1e-9) return false;
  const t = ((x3 - x1) * (y4 - y3) - (y3 - y1) * (x4 - x3)) / d;
  const u = ((x3 - x1) * (y2 - y1) - (y3 - y1) * (x2 - x1)) / d;
  return t > 1e-6 && t < 1 - 1e-6 && u > 1e-6 && u < 1 - 1e-6;
}

for (const [w, h] of [[1440, 900], [390, 844], [1440, 1100]]) {
  const layout = buildIsolineLayout({ width: w, height: h, seed: 20260915, spacing: 7.5, ringStep: 18 });
  const segs: Array<{ line: number; s: number[] }> = [];
  let line = -1;
  for (let i = 0; i < layout.count; i++) {
    if (!layout.linked[i]) {
      line++;
      continue;
    }
    segs.push({ line, s: [layout.homeX[i - 1], layout.homeY[i - 1], layout.homeX[i], layout.homeY[i]] });
  }
  const bucket = new Map<string, number[]>();
  const size = 24;
  segs.forEach((seg, idx) => {
    const minX = Math.floor(Math.min(seg.s[0], seg.s[2]) / size);
    const maxX = Math.floor(Math.max(seg.s[0], seg.s[2]) / size);
    const minY = Math.floor(Math.min(seg.s[1], seg.s[3]) / size);
    const maxY = Math.floor(Math.max(seg.s[1], seg.s[3]) / size);
    for (let bx = minX; bx <= maxX; bx++) for (let by = minY; by <= maxY; by++) {
      const key = `${bx},${by}`;
      (bucket.get(key) ?? bucket.set(key, []).get(key)!).push(idx);
    }
  });
  let crossings = 0;
  for (const ids of bucket.values()) {
    for (let a = 0; a < ids.length; a++) for (let b = a + 1; b < ids.length; b++) {
      const A = segs[ids[a]];
      const B = segs[ids[b]];
      if (A.line !== B.line && segmentsCross(A.s, B.s)) crossings++;
    }
  }
  console.log(`${w}x${h}: ${layout.count} particles on ${line + 1} lines, ${crossings} crossings between lines`);
  if (crossings > 0) process.exitCode = 1;
}
