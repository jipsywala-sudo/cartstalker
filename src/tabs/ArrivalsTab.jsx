import SeatDots from "../components/SeatDots.jsx";
import { STOPS, routeById, stopByName } from "../data/network.js";
import { etaSeconds, fmtEta, seatStatus } from "../utils/sim.js";

export default function ArrivalsTab({ fleet, stop, setStop, scale, selectedCart, onCart }) {
  const list = fleet
    .map((c) => ({ c, eta: etaSeconds(c, stop, scale) }))
    .filter((x) => x.eta !== null)
    .sort((a, b) => a.eta - b.eta);
  const best = list.find((x) => x.c.free > 0);
  const serving = stopByName(stop).routes.map((id) => routeById(id));

  return (
    <div className="space-y-3">
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Your stop</span>
        <select value={stop} onChange={(e) => setStop(e.target.value)} className="mt-1 w-full rounded-xl border-2 border-coal bg-white px-3 py-2.5 text-sm font-bold">
          {STOPS.map((s) => <option key={s.name}>{s.name}</option>)}
        </select>
      </label>
      <div className="flex flex-wrap gap-1.5">
        {serving.map((r) => <span key={r.id} className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: r.color }}>{r.name}</span>)}
      </div>

      {best ? (
        <p className="rounded-2xl bg-brand p-3 text-sm font-bold">
          Best pick: {best.c.id} arrives {best.eta < 25 ? "now" : `in ${fmtEta(best.eta)}`} with {best.c.free} seat{best.c.free > 1 ? "s" : ""} free.
        </p>
      ) : (
        <p className="rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">All carts heading here are full right now. Check again shortly.</p>
      )}

      {list.map(({ c, eta }) => {
        const r = routeById(c.route), st = seatStatus(c.free);
        return (
          <button key={c.id} onClick={() => onCart(c)}
            className={`flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left ${selectedCart === c.id ? "border-coal" : "border-slate-100 hover:border-slate-300"}`}>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xs font-extrabold text-white" style={{ background: r.color }}>{c.id}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold">{r.name} · next: {c.next}</span>
              <span className="mt-1.5 flex items-center gap-2"><SeatDots cap={c.cap} taken={c.taken} /><span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${st.cls}`}>{st.text}</span></span>
            </span>
            <span className="text-right"><span className="block text-xl font-extrabold leading-none">{fmtEta(eta).split(" ")[0]}</span><span className="text-[11px] font-semibold text-slate-500">{eta < 25 ? "arriving" : "min"}</span></span>
          </button>
        );
      })}
      {list.length === 0 && <p className="text-sm text-slate-500">No cart is serving this stop right now.</p>}
      {fleet.some((c) => c.charging) && <p className="text-xs text-slate-500">⚡ {fleet.filter((c) => c.charging).map((c) => c.id).join(", ")} charging at the Main Entrance.</p>}
    </div>
  );
}
