import React from "react";
import { Dualsense, HIDProvider, WebHIDProvider } from "dualsense-ts";

export const hasWebHID =
  typeof navigator !== "undefined" && "hid" in navigator;

const isWebHID = (provider: HIDProvider): provider is WebHIDProvider =>
  "getRequest" in provider;

// Only instantiate when WebHID is available — the constructor throws otherwise
export const controller: Dualsense | null = hasWebHID
  ? new Dualsense()
  : null;

export const requestPermission =
  controller && isWebHID(controller.hid.provider)
    ? controller.hid.provider.getRequest()
    : () => {};

export const ControllerContext = React.createContext<Dualsense>(
  controller as Dualsense
);
ControllerContext.displayName = "ControllerContext";

if (controller) {
  controller.hid.register(() => {
    console.group("dualsense-ts");
    console.log(JSON.stringify(controller.hid.state, null, 2));
    console.groupEnd();
  });

  controller.connection.on("change", ({ state }) => {
    console.group("dualsense-ts");
    console.log(`Controller ${state ? "" : "dis"}connected`);
    console.groupEnd();

    if (state) {
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
        setTimeout(
          () => controller.playerLeds.setLed(led, false),
          (5 + i) * 250
        );
      });
    }
  });

  controller.hid.on("error", (err) => {
    console.group("dualsense-ts");
    console.log(err);
    console.groupEnd();
  });
}
