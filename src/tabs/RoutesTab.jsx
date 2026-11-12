import { ROUTES, LOOPS } from "../data/network.js";

export default function RoutesTab({ fleet, selectedRoute, setSelectedRoute }) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">Tap a line to highlight it on the map.</p>
      {ROUTES.map((r) => {
        const carts = fleet.filter((c) => c.route === r.id);
        const L = LOOPS[r.id];
        const avg = carts.reduce((s, c) => s + c.speed, 0) / (carts.length || 1);
        const headway = carts.length ? Math.max(1, Math.round(L.L / avg / carts.length / 60)) : null;
        const free = carts.reduce((s, c) => s + c.free, 0);
        const on = selectedRoute === r.id;
        return (
          <button key={r.id} onClick={() => setSelectedRoute(on ? null : r.id)} aria-pressed={on}
            className={`w-full rounded-2xl border-2 p-3 text-left ${on ? "border-coal" : "border-slate-100 hover:border-slate-300"}`}>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-extrabold"><span className="h-3 w-3 rounded-full" style={{ background: r.color }} />{r.name} <span className="font-medium text-slate-500">{r.sub}</span></span>
              <span className="text-xs font-bold text-slate-600">{carts.length} carts</span>
            </div>
            <p className="mt-1 text-xs text-slate-600">A cart every ~{headway} min · {free} seats free now</p>
            <ol className="mt-2 flex flex-wrap items-center gap-x-1 gap-y-1 text-[11px] font-semibold text-slate-700">
              {r.points.filter((p) => p.stop).map((p, i, a) => <li key={p.stop} className="flex items-center gap-1">{p.stop}{i < a.length - 1 && <span className="text-slate-300">›</span>}</li>)}
            </ol>
          </button>
        );
      })}
    </div>
  );
}
