import { useState, useEffect, useContext } from "react";
import type { Input, Dualsense } from "dualsense-ts";
import { ControllerContext } from "../controller";

/**
 * Subscribe to a controller input and re-render on changes.
 * Usage: const gyro = useControllerInput(c => c.gyroscope);
 */
export function useControllerInput<T extends Input<T>>(
  selector: (controller: Dualsense) => T,
): T {
  const controller = useContext(ControllerContext);
  const input = selector(controller);
  const [, setTick] = useState(0);

  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    input.on("change", handler);
    return () => {
      input.removeListener("change", handler);
    };
  }, [input]);

  return input;
}
