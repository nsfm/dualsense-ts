import React from "react";
import { Dualsense, DualsenseManager } from "dualsense-ts";

export const hasWebHID =
  typeof navigator !== "undefined" && "hid" in navigator;

// The manager replaces the old singleton Dualsense.
// It discovers controllers automatically and assigns player LEDs.
export const manager: DualsenseManager | null = hasWebHID
  ? new DualsenseManager()
  : null;

// Permission request — opens the multi-select device picker
export const requestPermission: () => void = manager
  ? manager.getRequest()
  : () => {};

// ControllerContext still provides a single Dualsense to all HUD components.
// App.tsx determines which player is "selected" and provides it here.
export const ControllerContext = React.createContext<Dualsense>(
  // Fallback: create a disconnected dummy so components never see null
  (manager?.get(0) ?? new Dualsense({ hid: null })) as Dualsense
);
ControllerContext.displayName = "ControllerContext";

// ManagerContext gives components access to the manager for player list, counts, etc.
export const ManagerContext = React.createContext<DualsenseManager | null>(
  manager
);
ManagerContext.displayName = "ManagerContext";

if (manager) {
  manager.on("change", ({ active }) => {
    console.group("dualsense-ts");
    console.log(`${active} controller(s) connected`);
    console.groupEnd();
  });
}
