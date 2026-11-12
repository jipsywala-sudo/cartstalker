export default function TopBar({ scale, setScale }) {
  return (
    <header className="pointer-events-none absolute inset-x-3 top-3 z-20 flex items-center justify-between gap-2">
      <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-coal py-2 pl-3 pr-4 text-white shadow-lg">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-brand text-sm" aria-hidden>🛺</span>
        <span className="text-sm font-extrabold tracking-tight">Ride<span className="text-brand">Loop</span></span>
      </div>
      <div className="pointer-events-auto flex items-center gap-2">
        <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-bold shadow-lg">
          <span className="relative h-2 w-2 rounded-full bg-emerald-500 text-emerald-500 pulse" />LIVE
        </span>
        <div className="flex rounded-full bg-white p-1 shadow-lg" role="group" aria-label="Demo speed">
          {[1, 5].map((s) => (
            <button key={s} onClick={() => setScale(s)} aria-pressed={scale === s}
              className={`rounded-full px-3 py-1 text-xs font-bold ${scale === s ? "bg-coal text-white" : "text-slate-600"}`}>{s}×</button>
          ))}
        </div>
      </div>
    </header>
  );
}
