import { useEffect, useState } from "react";

/* Simulation clock in seconds. `scale` speeds the demo up (1 = real time). */
export default function useClock(scale) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((x) => x + 0.4 * scale), 400);
    return () => clearInterval(id);
  }, [scale]);
  return t;
}
