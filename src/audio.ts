/**
 * Audio device matching utilities for the DualSense controller.
 *
 * The DualSense registers as a USB Audio Class device (speaker + microphone)
 * when connected over USB. These utilities help locate the corresponding
 * audio devices in the Web Audio API or native audio libraries.
 *
 * Note: Audio devices are only available over USB, not Bluetooth.
 */

/** USB Vendor ID for Sony Interactive Entertainment */
export const DUALSENSE_AUDIO_VENDOR_ID = 0x054c;

/** USB Product ID for the DualSense controller */
export const DUALSENSE_AUDIO_PRODUCT_ID = 0x0ce6;

/**
 * Known device label patterns for DualSense audio devices across platforms.
 * Browser `enumerateDevices()` labels vary by OS:
 * - Windows: "Wireless Controller"
 * - macOS: "Wireless Controller"
 * - Linux: "Wireless Controller" or "Sony Interactive Entertainment Wireless Controller"
 */
export const DUALSENSE_AUDIO_LABELS = [
  "Wireless Controller",
  "DualSense",
] as const;

/** Matches a MediaDeviceInfo label against known DualSense patterns */
function matchesDualsenseLabel(label: string): boolean {
  const lower = label.toLowerCase();
  return DUALSENSE_AUDIO_LABELS.some((pattern) =>
    lower.includes(pattern.toLowerCase()),
  );
}

/** Filtered result from audio device enumeration */
export interface DualsenseAudioDevices {
  /** Audio output devices (speaker/headphone) */
  outputs: MediaDeviceInfo[];
  /** Audio input devices (microphone) */
  inputs: MediaDeviceInfo[];
}

/**
 * Find DualSense audio devices using the Web Audio API.
 *
 * Requires `navigator.mediaDevices` (browser only). Returns matching
 * audio input and output devices based on known label patterns.
 *
 * Note: Device labels may be empty until the user grants microphone
 * or camera permission via `getUserMedia()`.
 *
 * @example
 * ```typescript
 * import { findDualsenseAudioDevices } from "dualsense-ts";
 *
 * const { outputs, inputs } = await findDualsenseAudioDevices();
 * if (outputs.length > 0) {
 *   const ctx = new AudioContext({ sinkId: outputs[0].deviceId });
 *   // Route audio to the controller's speaker
 * }
 * if (inputs.length > 0) {
 *   const stream = await navigator.mediaDevices.getUserMedia({
 *     audio: { deviceId: { exact: inputs[0].deviceId } },
 *   });
 *   // Capture from the controller's microphone
 * }
 * ```
 */
export async function findDualsenseAudioDevices(): Promise<DualsenseAudioDevices> {
  if (
    typeof navigator === "undefined" ||
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    !navigator.mediaDevices?.enumerateDevices
  ) {
    return { outputs: [], inputs: [] };
  }

  const devices = await navigator.mediaDevices.enumerateDevices();
  const outputs: MediaDeviceInfo[] = [];
  const inputs: MediaDeviceInfo[] = [];

  for (const device of devices) {
    if (!matchesDualsenseLabel(device.label)) continue;
    if (device.kind === "audiooutput") outputs.push(device);
    else if (device.kind === "audioinput") inputs.push(device);
  }

  return { outputs, inputs };
}
