import { useMemo, useState } from "react";
import TopBar from "./components/TopBar.jsx";
import MapCanvas from "./components/MapCanvas.jsx";
import Sheet from "./components/Sheet.jsx";
import ArrivalsTab from "./tabs/ArrivalsTab.jsx";
import RoutesTab from "./tabs/RoutesTab.jsx";
import useClock from "./hooks/useClock.js";
import { snapshot } from "./utils/sim.js";
import { stopByName } from "./data/network.js";

export default function App() {
  const [scale, setScale] = useState(1);
  const [tab, setTab] = useState("arrivals");
  const [stop, setStop] = useState("Library");
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedCart, setSelectedCart] = useState(null);
  const [focus, setFocus] = useState(() => ({ ...stopByName("Library") }));

  const t = useClock(scale);
  const fleet = useMemo(() => snapshot(t), [t]);

  const pickStop = (name) => { setStop(name); setSelectedCart(null); setFocus({ ...stopByName(name) }); };
  const pickCart = (c) => { setSelectedCart(c.id); setSelectedRoute(c.route); setFocus({ x: c.x, y: c.y }); };

  return (
    <div className="flex h-full flex-col sm:flex-row-reverse">
      <div className="relative min-h-0 min-w-0 flex-1">
        <MapCanvas fleet={fleet} selectedRoute={selectedRoute} selectedCart={selectedCart} stop={stop} focus={focus} onCart={pickCart} />
        <TopBar scale={scale} setScale={setScale} />
      </div>
      <Sheet tab={tab} setTab={setTab}>
        {tab === "arrivals"
          ? <ArrivalsTab fleet={fleet} stop={stop} setStop={pickStop} scale={scale} selectedCart={selectedCart} onCart={pickCart} />
          : <RoutesTab fleet={fleet} selectedRoute={selectedRoute} setSelectedRoute={setSelectedRoute} />}
      </Sheet>
    </div>
  );
}
