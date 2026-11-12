import { useEffect, useRef } from "react";
import mapImage from "../assets/campus-map.jpeg";
import { ROUTES, LOOPS, STOPS, routeById } from "../data/network.js";

export default function MapCanvas({ fleet, selectedRoute, selectedCart, stop, focus, onCart }) {
  const wrap = useRef(), inner = useRef();

  useEffect(() => {
    if (!focus) return;
    const [w, i] = [wrap.current, inner.current];
    w.scrollTo({ left: (focus.x / 100) * i.offsetWidth - w.clientWidth / 2, top: (focus.y / 100) * i.offsetHeight - w.clientHeight / 2, behavior: "smooth" });
  }, [focus]);

  return (
    <div ref={wrap} className="map-scroll">
      <div ref={inner} className="map-inner">
        <img src={mapImage} alt="Campus map" draggable="false" className="absolute inset-0 h-full w-full select-none object-fill" />
        <div className="absolute inset-0 bg-white/25" />

        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {ROUTES.map((r) => {
            const pts = LOOPS[r.id].pts.map((p) => `${p.x},${p.y}`).join(" ");
            const dim = selectedRoute && selectedRoute !== r.id;
            return (
              <g key={r.id} opacity={dim ? 0.25 : 1}>
                <polyline points={pts} fill="none" stroke="#fff" strokeWidth={selectedRoute === r.id ? 10 : 8} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                <polyline points={pts} fill="none" stroke={r.color} strokeWidth={selectedRoute === r.id ? 6 : 4} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              </g>
            );
          })}
        </svg>

        {STOPS.map((s) => (
          <span key={s.name} title={s.name} style={{ left: `${s.x}%`, top: `${s.y}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] bg-white ${s.name === stop ? "h-5 w-5 border-coal ring-4 ring-brand" : "h-3.5 w-3.5 border-coal/70"}`} />
        ))}
        {(() => { const s = STOPS.find((x) => x.name === stop); return s && (
          <span className="absolute z-10 -translate-x-1/2 -translate-y-[170%] whitespace-nowrap rounded-full bg-brand px-2.5 py-1 text-[11px] font-extrabold shadow" style={{ left: `${s.x}%`, top: `${s.y}%` }}>You: {s.name}</span>
        ); })()}

        {fleet.map((c) => {
          const color = c.route ? routeById(c.route).color : "#94a3b8";
          return (
            <button key={c.id} onClick={() => !c.charging && onCart(c)} disabled={c.charging}
              aria-label={`${c.id}, ${c.charging ? "charging" : `${c.free} seats free`}`}
              style={{ left: `${c.x}%`, top: `${c.y}%`, background: color }}
              className={`cart-marker absolute z-20 flex items-center gap-1 rounded-lg px-1.5 py-1 text-[11px] font-extrabold text-white shadow-lg ring-2 ring-white ${selectedCart === c.id ? "scale-125 ring-4 ring-coal" : ""}`}>
              🛺 {c.charging ? "⚡" : c.free}
            </button>
          );
        })}
      </div>
    </div>
  );
}
