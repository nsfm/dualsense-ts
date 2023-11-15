import React from "react";
import { Dualsense, HIDProvider, WebHIDProvider } from "dualsense-ts";

const isWebHID = (provider: HIDProvider): provider is WebHIDProvider =>
  "getRequest" in provider;

export const controller = new Dualsense();

export const requestPermission = isWebHID(controller.hid.provider)
  ? controller.hid.provider.getRequest()
  : () => console.log("WebHID is unavailable");

export const ControllerContext = React.createContext(controller);
ControllerContext.displayName = "ControllerContext";

controller.hid.register((data) => {
  console.group("dualsense-ts");
  console.log(JSON.stringify(controller.hid.state, null, 2));
  console.groupEnd();
});

controller.connection.on("change", ({ state }) => {
  console.group("dualsense-ts");
  console.log(`Controller ${state ? "" : "dis"}connected`);
  console.groupEnd();
});

controller.hid.on("error", (err) => {
  console.group("dualsense-ts");
  console.log(err);
  console.groupEnd();
});
