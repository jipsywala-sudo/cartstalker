export default function SeatDots({ cap, taken }) {
  return (
    <div className="flex gap-1" aria-hidden>
      {Array.from({ length: cap }, (_, i) => <span key={i} className={`h-3 w-3 rounded ${i < taken ? "bg-slate-300" : "bg-emerald-500"}`} />)}
    </div>
  );
}
