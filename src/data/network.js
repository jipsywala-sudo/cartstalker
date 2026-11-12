/* Routes follow the roads on the campus map. Coordinates are % of the map image.
   Stops: points with a `stop` name. Replace with your real routes. */
const M_PER_PCT = 8; // rough scale; tune to your campus
const P = (x, y, stop) => ({ x, y, stop });

export const ROUTES = [
  { id: "red", name: "Red Line", sub: "Academic Loop", color: "#ef4444", loop: true, points: [
    P(87.5, 90.5, "Main Entrance"), P(43, 91.5), P(43, 58.5, "Central Crossing"), P(55, 58.5, "Food Court"),
    P(72, 58.5, "Library"), P(85, 58.5, "Academic Blocks"), P(83, 80)] },
  { id: "blue", name: "Blue Line", sub: "Hostel Line", color: "#3b82f6", points: [
    P(6, 59, "Western Gate"), P(20, 58.5, "Anantam Hall"), P(35, 58.5, "Tejas Hall"), P(43, 58.5, "Central Crossing"),
    P(43, 77, "Hostel PG"), P(28, 77, "Vyom Hall"), P(13, 77, "Neeram Hall")] },
  { id: "green", name: "Green Line", sub: "North to East", color: "#10b981", points: [
    P(48, 8.7, "Polytechnic Gate"), P(43, 9), P(43, 40, "Sports Complex"), P(43, 58.5, "Central Crossing"),
    P(55, 58.5, "Food Court"), P(72, 58.5, "Library"), P(85, 58.5, "Academic Blocks"), P(95, 54, "TSLAS Gate")] },
];

/* Closed loop for each route (loop routes circle, others go out and back) */
const dist = (a, b) => Math.hypot(a.x - b.x, (a.y - b.y) * 0.557) * M_PER_PCT;
function build(r) {
  const seq = r.loop ? [...r.points, r.points[0]] : [...r.points, ...r.points.slice(1, -1).reverse(), r.points[0]];
  const cum = [0];
  seq.forEach((p, i) => { if (i) cum.push(cum[i - 1] + dist(seq[i - 1], p)); });
  const stops = seq.slice(0, -1).map((p, i) => (p.stop ? { name: p.stop, d: cum[i], x: p.x, y: p.y } : null)).filter(Boolean);
  return { pts: seq, cum, L: cum[cum.length - 1], stops };
}
export const LOOPS = Object.fromEntries(ROUTES.map((r) => [r.id, build(r)]));
export const routeById = (id) => ROUTES.find((r) => r.id === id);

/* Every stop once, with the routes that serve it */
export const STOPS = (() => {
  const m = new Map();
  ROUTES.forEach((r) => r.points.filter((p) => p.stop).forEach((p) => {
    const s = m.get(p.stop) || { name: p.stop, x: p.x, y: p.y, routes: [] };
    s.routes.push(r.id); m.set(p.stop, s);
  }));
  return [...m.values()].sort((a, b) => a.name.localeCompare(b.name));
})();
export const stopByName = (n) => STOPS.find((s) => s.name === n);

/* Fleet: `frac` = starting point along the route (0 to 1), speed in metres/second. */
export const CARTS = [
  { id: "C1", route: "red", frac: 0, speed: 5, cap: 6 },
  { id: "C2", route: "red", frac: 0.5, speed: 4.6, cap: 6 },
  { id: "C3", route: "blue", frac: 0.1, speed: 5.2, cap: 6 },
  { id: "C4", route: "blue", frac: 0.6, speed: 4.8, cap: 4 },
  { id: "C5", route: "green", frac: 0.2, speed: 5.4, cap: 6 },
  { id: "C6", route: "green", frac: 0.7, speed: 5, cap: 4 },
  { id: "C7", route: null, at: { x: 89, y: 88 }, cap: 6 }, // charging
];
