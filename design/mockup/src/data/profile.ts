// The sample route's surveyed elevation points, [mile, ft]. No imports, so node scripts can read it.
// Mile 17.4 (Day 2 camp, 8,050 ft) is included so the rail and the waypoint label agree there.
export const PROFILE: [number, number][] = [
  [0, 9360], [3, 10400], [5.5, 11423], [8, 10200], [12, 9000], [16, 8050], [17.4, 8050], [18, 7700], [22, 8400],
  [26.3, 9200], [32, 10300], [36.5, 11400], [38, 11955], [41, 10000], [44.6, 8700], [48, 9800],
  [53.2, 11300], [55, 11972], [58, 10800], [61.4, 9768],
];

/** The named places the page labels on every elevation drawing. */
export const NAMED_POINTS = [
  { name: "Trailhead", mile: 0, ft: 9360 },
  { name: "Piute Pass", mile: 5.5, ft: 11423 },
  { name: "Muir Trail Ranch", mile: 18.0, ft: 7700 },
  { name: "Muir Pass", mile: 38.0, ft: 11955 },
  { name: "Bishop Pass", mile: 55.0, ft: 11972 },
  { name: "South Lake", mile: 61.4, ft: 9768 },
] as const;

export const PASSES = [5.5, 38.0, 55.0];
