import { LOOPS, CARTS } from "../data/network.js";

/* Everything here is simulated from a clock. To go live, replace snapshot()
   with a fetch of real GPS positions and keep the same returned shape. */
const hash = (a, b) => { const v = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return v - Math.floor(v); };

function locate(L, s) {
  let i = 0;
  while (i < L.cum.length - 2 && L.cum[i + 1] <= s) i++;
  const [a, b] = [L.pts[i], L.pts[i + 1]];
  const f = (s - L.cum[i]) / (L.cum[i + 1] - L.cum[i] || 1);
  return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
}
const gap = (L, d, s) => (((d - s) % L.L) + L.L) % L.L || L.L;

export function snapshot(t) {
  return CARTS.map((c) => {
    if (!c.route) return { ...c, x: c.at.x, y: c.at.y, taken: 0, free: c.cap, charging: true };
    const L = LOOPS[c.route];
    const total = c.frac * L.L + c.speed * t;
    const s = total % L.L;
    const passed = L.stops.filter((st) => st.d <= s).length;
    const taken = Math.floor(hash(+c.id.slice(1), Math.floor(total / L.L) * 50 + passed) * (c.cap + 1));
    const next = L.stops.reduce((a, b) => (gap(L, b.d, s) < gap(L, a.d, s) ? b : a));
    return { ...c, s, ...locate(L, s), taken, free: c.cap - taken, next: next.name };
  });
}

/* Seconds until a cart reaches a stop (real seconds, accounts for demo speed) */
export function etaSeconds(cart, stopName, scale) {
  if (cart.charging) return null;
  const L = LOOPS[cart.route];
  const ds = L.stops.filter((st) => st.name === stopName).map((st) => gap(L, st.d, cart.s));
  return ds.length ? Math.min(...ds) / cart.speed / scale : null;
}

export const fmtEta = (sec) => (sec < 25 ? "Now" : sec < 90 ? "1 min" : `${Math.round(sec / 60)} min`);

export function seatStatus(free) {
  return free === 0 ? { text: "Full", cls: "text-red-600 bg-red-50" }
    : free <= 2 ? { text: `${free} seat${free > 1 ? "s" : ""} left`, cls: "text-amber-700 bg-amber-50" }
    : { text: `${free} seats free`, cls: "text-emerald-700 bg-emerald-50" };
}
