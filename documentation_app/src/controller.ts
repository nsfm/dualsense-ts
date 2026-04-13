import React from "react";
import { Dualsense, DualsenseManager } from "dualsense-ts";

export const hasWebHID =
  typeof navigator !== "undefined" && "hid" in navigator;

export const manager: DualsenseManager | null = hasWebHID
  ? new DualsenseManager()
  : null;

export const requestPermission: () => void = manager
  ? manager.getRequest()
  : () => {};

export const ControllerContext = React.createContext<Dualsense>(
  (manager?.get(0) ?? new Dualsense({ hid: null })) as Dualsense,
);
ControllerContext.displayName = "ControllerContext";

export const ManagerContext = React.createContext<DualsenseManager | null>(
  manager,
);
ManagerContext.displayName = "ManagerContext";

if (manager) {
  manager.on("change", ({ active }) => {
    console.group("dualsense-ts");
    console.log(`${active} controller(s) connected`);
    console.groupEnd();
  });
}
