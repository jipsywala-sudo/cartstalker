import { useState } from "react";

/* Sits below the map on phones and beside it on desktop, so it never covers the map. */
export default function Sheet({ tab, setTab, children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="flex max-h-[42vh] shrink-0 flex-col rounded-t-3xl bg-white shadow-[0_-8px_30px_#0002] sm:h-full sm:max-h-none sm:w-[400px] sm:rounded-none sm:shadow-[8px_0_30px_#0002]">
      <div className="flex items-center gap-2 p-3">
        <div className="flex flex-1 rounded-full bg-slate-100 p-1" role="tablist">
          {[["arrivals", "Arrivals"], ["routes", "Routes"]].map(([id, label]) => (
            <button key={id} role="tab" aria-selected={tab === id} onClick={() => { setTab(id); setOpen(true); }}
              className={`flex-1 rounded-full py-2 text-sm font-bold ${tab === id ? "bg-coal text-white" : "text-slate-500"}`}>{label}</button>
          ))}
        </div>
        <button onClick={() => setOpen(!open)} aria-label={open ? "Collapse panel" : "Expand panel"} aria-expanded={open}
          className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-sm sm:hidden">{open ? "▾" : "▴"}</button>
      </div>
      {open && <div className="flex-1 overflow-y-auto px-3 pb-4">{children}</div>}
    </section>
  );
}
