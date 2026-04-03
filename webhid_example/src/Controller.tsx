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

  if (state) {
    // Turn on each LED in a random order, then off in a different random order
    const shuffle = (arr: number[]) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };
    const onOrder = shuffle([0, 1, 2, 3, 4]);
    const offOrder = shuffle([0, 1, 2, 3, 4]);
    onOrder.forEach((led, i) => {
      setTimeout(() => controller.playerLeds.setLed(led, true), i * 250);
    });
    offOrder.forEach((led, i) => {
      setTimeout(() => controller.playerLeds.setLed(led, false), (5 + i) * 250);
    });
  }
});

controller.hid.on("error", (err) => {
  console.group("dualsense-ts");
  console.log(err);
  console.groupEnd();
});
