import { useState, useEffect } from "react";
import type { Dualsense } from "dualsense-ts";
import { manager } from "../controller";

export function useManagerState() {
  const [controllers, setControllers] = useState<readonly Dualsense[]>(
    manager?.controllers ?? [],
  );
  const [activeCount, setActiveCount] = useState(manager?.state.active ?? 0);
  const [pending, setPending] = useState(manager?.pending ?? false);

  useEffect(() => {
    const m = manager;
    if (!m) return;
    const update = () => {
      setControllers([...m.controllers]);
      setActiveCount(m.state.active);
      setPending(m.pending);
    };
    m.on("change", update);
    const interval = setInterval(update, 500);
    return () => clearInterval(interval);
  }, []);

  return { controllers, activeCount, pending };
}
