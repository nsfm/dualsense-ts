/** Input state change checker that always returns true */
export function VirtualComparator(): boolean {
  return true;
}

/** Input state change checker that considers a numeric threshold */
export function ThresholdComparator(
  threshold: number,
  deadzone: number,
  state: unknown,
  newState: unknown
): boolean {
  if (typeof state !== "number" || typeof newState !== "number")
    throw new Error("Bad threshold comparison");
  return (
    Math.abs(state - newState) > threshold &&
    (Math.abs(newState) > deadzone || Math.abs(state) > deadzone)
  );
}

/** Input state change checker for most values */
export function BasicComparator(state: unknown, newState: unknown): boolean {
  return state !== newState;
}
