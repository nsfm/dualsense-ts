import { AccessNodeHIDProvider } from "./access_node_hid_provider";
import { AccessWebHIDProvider } from "./access_web_hid_provider";

export const AccessPlatformHIDProvider =
  typeof window === "undefined"
    ? AccessNodeHIDProvider
    : AccessWebHIDProvider;
