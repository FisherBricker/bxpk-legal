# bxpk terrain: portable spec

The contour texture used across bxpk: the site hero, section sheets, the close band, the news cover, and next, the iOS app. It is designed to read like a USGS quadrangle of the Sierra Nevada, with ridgelines, spurs, saddles, drainages that V upslope, distinct peaks, and steep faces beside gentler benches. It is drawn as isolines of **one continuous height field**, so lines nest and never cross.

The reference implementation is `src/lib/topo/isolines.ts`. `scripts/check-isolines.ts` runs the crossing check and prints the golden vectors below. A port is correct when it reproduces those vectors.

## Arithmetic rules
- **Integers:** 32-bit, with explicit wrapping.
  - `imul(a, b)` is the low 32 bits of the product of the two bit patterns (`&*` on `UInt32` in Swift; JS `Math.imul`).
  - `a >>> n` is a logical right shift on `UInt32`.
  - `^` is bitwise XOR.
  - `u32(v)` reinterprets or wraps to `UInt32`.
- **Everything else:** IEEE 754 double. Only `floor`, `abs`, `sqrt`, `exp`, `+ - * /` and comparisons are used. There is no library noise, `pow`, `sin` or `atan2` in the field.
- **Lattice coordinates:** `ix = Int32(floor(x))`, `iy = Int32(floor(y))`. Inputs stay far inside the Int32 range.

## Constants

| Name | Value | Role |
|---|---|---|
| featurePx | 560 | px (pt) per noise unit. Feature size is absolute, so a bigger panel shows more terrain. |
| warp | 0.45 | Domain warp strength, in noise units |
| warpOctaves | 3 | fBm octaves for each warp axis |
| warp offsets | x axis (+5.2, +1.3), y axis (-3.7, +8.1) | Decorrelate the two warp fields |
| ridgeOctaves | 4 | Ridged multifractal octaves |
| ridgeOffset | 1.0 | |
| ridgeScale | 1.0 | |
| ridgeGain | 1.6 | Weight feedback between ridge octaves |
| ridgeLacunarity | 2.0 | |
| ridgePersistence | 0.5 | |
| baseOctaves | 3 | Broad elevation fBm |
| baseFrequency | 0.35 | |
| fbmLacunarity | 2.03 | |
| fbmPersistence | 0.5 | |
| ruggedLow | 0.35 | Ridge weight at the lowest broad elevation |
| ridgeWeight | 1.0 | |
| valleyFrequency | 1.7 | Drainage network frequency |
| valley offsets | (+17.3, -9.1) | |
| valleyWeight | 0.35 | |
| baseWeight | 0.9 | |
| summitWeight | 0.9 | |
| summit A | fx 0.22, fy 1.45, sigmaDiag 0.62, amp 1.0 | ContourPanel centre 1 |
| summit B | fx 0.95, fy -0.55, sigmaDiag 0.5, amp 0.9 | ContourPanel centre 2 |
| summitAspect | 1.9 | |
| minLoopPx | 70 | Drop closed loops shorter than this |
| minOpenPx | 24 | Drop open lines shorter than this |
| Gradient table | (1,0) (-1,0) (0,1) (0,-1) (s,s) (-s,s) (s,-s) (-s,-s), with s = 0.7071067811865476 | |

## Algorithm

### 1. Hash: `hash2(ix: Int32, iy: Int32, seed: UInt32) -> UInt32`
```
h = seed ^ imul(u32(ix), 0x27d4eb2d)
h = h ^ imul(u32(iy), 0x165667b1)
h = h ^ (h >>> 15)
h = imul(h, 0x2c1b3c6d)
h = h ^ (h >>> 12)
h = imul(h, 0x297a2d39)
h = h ^ (h >>> 15)
return h
```

### 2. Gradient noise: `noise(x, y, seed) -> Double`
- `ix = floor(x)`, `iy = floor(y)`, `tx = x - ix`, `ty = y - iy`.
- For each corner `(cx, cy)` in `(ix, iy)`, `(ix+1, iy)`, `(ix, iy+1)`, `(ix+1, iy+1)`:
  - `g = GRADIENTS[hash2(cx, cy, seed) & 7]`
  - `n = g.x * (tx - (cx - ix)) + g.y * (ty - (cy - iy))`
  - This gives `n00`, `n10`, `n01`, `n11`.
- Fade: `u = tx³(tx(6tx - 15) + 10)`, and the same with `ty` for `v`.
- Return `lerp(lerp(n00, n10, u), lerp(n01, n11, u), v)`, where `lerp(a, b, t) = a + (b - a) * t`.

### 3. Octave seed: `octaveSeed(seed, stream, octave) = u32(seed + imul(stream, 0x9e3779b1) + imul(octave, 0x85ebca6b))`
The additions wrap mod 2³².

### 4. fBm: `fbm(x, y, octaves, seed, stream)`
```
sum = 0, norm = 0, amp = 1, freq = 1
for o in 0..<octaves:
  sum += amp * noise(x*freq, y*freq, octaveSeed(seed, stream, o))
  norm += amp; amp *= 0.5; freq *= 2.03
return sum / norm
```

### 5. Ridged multifractal: `ridged(x, y, seed, stream)`
```
sum = 0, norm = 0, amp = 1, freq = 1, weight = 1
for o in 0..<4:
  n = noise(x*freq, y*freq, octaveSeed(seed, stream, o))
  signal = 1.0 - abs(n) * 1.0;  if signal < 0 { signal = 0 }
  signal = signal * signal * weight
  weight = clamp(signal * 1.6, 0, 1)
  sum += signal * amp; norm += amp; amp *= 0.5; freq *= 2.0
return sum / norm
```

### 6. Height at pixel (x, y) of a W × H panel
```
diag = sqrt(W*W + H*H)
px = x / 560, py = y / 560
wx = fbm(px + 5.2, py + 1.3, 3, seed, stream 1)
wy = fbm(px - 3.7, py + 8.1, 3, seed, stream 2)
qx = px + 0.45 * wx, qy = py + 0.45 * wy
r      = ridged(qx, qy, seed, stream 3)
valley = ridged(qx * 1.7 + 17.3, qy * 1.7 - 9.1, seed, stream 5)
base   = fbm(qx * 0.35, qy * 0.35, 3, seed, stream 4)
summit = Σ over A, B:
  sigma = diag * sigmaDiag
  dx = (x - W*fx) / 1.9;  dy = y - H*fy
  amp * exp(-(dx*dx + dy*dy) * (1 / (2 * sigma * sigma)))
rugged = clamp((base + 0.3) / 0.6, 0, 1);  rugged = 0.35 + 0.65 * rugged
height = 1.0*r*rugged - 0.35*valley*rugged + 0.9*base + 0.9*summit
```
- `1 / (2 σ²)` is computed once per summit as `1 / (2 * (diag*sigmaDiag) * (diag*sigmaDiag))`.
- Ridged crests carry the ridgelines and spurs.
- The subtracted second ridged network carves drainages that V upslope.
- The broad fBm makes valleys and benches, and `rugged` makes high ground craggier than low benches.
- The two summits keep the ContourPanel composition.

### 7. Sampling grid
Inputs: `cell` (px), `margin` (px).
- `x0 = y0 = -margin`
- `nx = ceil((W + 2m) / cell)`, `ny = ceil((H + 2m) / cell)`
- Sample `v[j][i] = height(x0 + i*cell, y0 + j*cell)` for `i in 0...nx`, `j in 0...ny`. That is row-major, `cols = nx + 1`, index `j*cols + i`.
- Track `min` and `max` over all samples.
- `meanSlope`: the average over cells `i in 0..<nx`, `j in 0..<ny` of `sqrt(gx² + gy²)`, where `gx = (v[j][i+1] - v[j][i]) / cell` and `gy = (v[j+1][i] - v[j][i]) / cell`.

### 8. Level interval from a target line spacing `spacing` (px)
- `interval = meanSlope * spacing`, so lines sit about `spacing` px apart on average; steep faces bunch and benches open up.
- `count = floor((max - min) / interval)`
- Levels are `min + interval * (k + 0.5)` for `k in 0..<count`.

### 9. Marching squares, per level
- For each cell, the corners are `tl = v[j][i]`, `tr = v[j][i+1]`, `br = v[j+1][i+1]`, `bl = v[j+1][i]`.
- `idx = (tl > L ? 8 : 0) | (tr > L ? 4 : 0) | (br > L ? 2 : 0) | (bl > L ? 1 : 0)`, using a strict greater-than. Skip cells with `idx` 0 or 15.
- **Edge points** use linear interpolation `t = (L - a) / (b - a)` along the edge.
- **Edge keys**, which must be shared between neighbouring cells:
  - horizontal edges: top of cell (i, j) is key `j*cols + i`, and bottom is `(j+1)*cols + i`
  - vertical edges: `HB = cols*(ny+1)`; left is `HB + j*cols + i`, and right is `HB + j*cols + i + 1`
- **Case table** (segment endpoints):

| idx | segment(s) |
|---|---|
| 1, 14 | left to bottom |
| 2, 13 | bottom to right |
| 3, 12 | left to right |
| 4, 11 | top to right |
| 6, 9 | top to bottom |
| 7, 8 | top to left |
| 5 | if centreHigh: (left to top) and (bottom to right); else (top to right) and (left to bottom) |
| 10 | if centreHigh: (top to right) and (left to bottom); else (left to top) and (bottom to right) |

  `centreHigh = (tl + tr + br + bl) / 4 > L`. Within a case, the first endpoint listed is created first.
- **Cell order:** rows `j` ascending, then columns `i` ascending.
- **Segments** are numbered in creation order.
- **Adjacency:** each key maps to its segment ids in creation order.

### 10. Joining segments into polylines
- **Walk** from a start key: repeatedly take the first unused segment in that key's adjacency list, mark it used, move to its other key, and append the point. Stop when there is no unused segment, or when the walk returns to the start key (a closed loop, which repeats the start point at the end).
- **Order:** first, for every key in ascending key order whose adjacency has exactly one segment and that segment is unused, walk from it (open lines touching the grid border). Then, for every segment id in ascending order that is still unused, walk from its first key (closed loops).
- **Prune:** keep a polyline only if it has more than 2 points and its length is at least 70 px (closed) or 24 px (open).
- **Output order:** levels ascending, then walk order.

### 11. Smoothing: exactly one Chaikin pass per kept polyline
- **Open line** `p0 … pn-1`: output is `p0`, then for each segment `a, b`: `0.75a + 0.25b` and `0.25a + 0.75b`, then `pn-1`.
- **Closed loop:** drop the repeated end point to get `n` points, then for each `i in 0..<n` use `a = p[i]` and `b = p[(i+1) % n]` and emit the same two points. Finally repeat the first output point at the end.

The crossing check runs after smoothing and reports 0 at 1440 × 900, 390 × 844 and 1440 × 1100.

### 12. Particles (the hero field only)
- For each polyline, walk its arc length and drop a particle every `spacing` px, starting at the first point.
- A particle is `linked` to the previous one unless it is the first particle of its polyline.
- If the particle count exceeds `maxParticles`, multiply the line spacing (`ringStep`) by `count / maxParticles * 1.03` and rebuild from step 8, up to 6 retries.

## Settings used on the site

| Surface | Seed | ringStep (px) | cell (px) | margin (px) | Notes |
|---|---|---|---|---|---|
| Hero particle field, desktop | 20260915 | 15 | 6 | 24 | Particle spacing 7.5, max 9,000 particles |
| Hero particle field, phones (width < 600) | 20260915 | 15 | 6 | 24 | Particle spacing 6.5 |
| Close band night field | 61420 | 15 | 6 | 24 | Same particle settings as the hero |
| Section sheets (paper and map) | section-specific | 30 | 16 | 32 | Drawn at 0.14 alpha (0.10 at night) |
| Footer ridge band | 15 | 16 | 16 | 32 | |
| News cover | 61 | 18 | 12 | 24 | 600 × 260 |
| Phone screen texture | per screen | 22 | 12 | 24 | 402 × 874 |

Behind text in the hero and close band, particles are quiet (no rest dots), and line segments touching those particles draw at 0.10 alpha instead of 0.22 (0.07 instead of 0.16 at night).

## Golden vectors
Seed 20260915. Heights are printed to 9 significant digits.

The sample points are fixed literals. They were generated by `x = round(((k*37 + 11) mod 97) / 96 * W * 100) / 100` and `y = round(((k*53 + 29) mod 89) / 88 * H * 100) / 100`, but use the literals below.

**390 × 240**

| x | y | height |
|---|---|---|
| 44.69 | 79.09 | 1.23287025 |
| 195 | 223.64 | 1.19643924 |
| 345.31 | 125.45 | 1.76544477 |
| 101.56 | 27.27 | 1.35513496 |
| 251.88 | 171.82 | 1.56375338 |
| 8.13 | 73.64 | 1.19080581 |
| 158.44 | 218.18 | 1.10043208 |
| 308.75 | 120 | 1.63285986 |
| 65 | 21.82 | 1.3290592 |
| 215.31 | 166.36 | 1.55623628 |
| 365.63 | 68.18 | 1.71462582 |
| 121.88 | 212.73 | 1.04077109 |

Isolines at ringStep 18, cell 6, margin 24, after pruning and one Chaikin pass: **25 lines, total length 6778.16941 px**.

**1440 × 900**

| x | y | height |
|---|---|---|
| 165 | 296.59 | 0.878955497 |
| 720 | 838.64 | 1.10758089 |
| 1275 | 470.45 | 1.04271979 |
| 375 | 102.27 | 1.7224709 |
| 930 | 644.32 | 0.963229087 |
| 30 | 276.14 | 1.03445574 |
| 585 | 818.18 | 1.17967036 |
| 1140 | 450 | 1.18799233 |
| 240 | 81.82 | 1.41398914 |
| 795 | 623.86 | 1.18701089 |
| 1350 | 255.68 | 1.12341536 |
| 450 | 797.73 | 1.22512887 |

Isolines at ringStep 18, cell 6, margin 24: **110 lines, total length 76188.9066 px**.

Heights should match to about 1e-9 relative. Line count should match exactly. Total length should match to about 1e-6 relative, since it sums many doubles.
