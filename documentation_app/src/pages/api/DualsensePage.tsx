import React from "react";
import {
  ApiPage,
  PropertiesTable,
  MethodsTable,
  SectionHeading,
  Prose,
  CodeBlock,
} from "../../components/ApiPage";

const DualsensePage: React.FC = () => (
  <ApiPage
    name="Dualsense"
    extends="Input<Dualsense>"
    description="The main controller class. Represents a single connected DualSense controller with all its inputs, outputs, and device information."
    source="src/dualsense.ts"
  >
    <Prose>
      <p>
        Create an instance directly for single-controller use, or let{" "}
        <code>DualsenseManager</code> manage instances for multi-controller
        setups. Every property on <code>Dualsense</code> is an{" "}
        <code>Input</code> subclass with a consistent event API.
      </p>
    </Prose>
    <CodeBlock
      code={`import { Dualsense } from "dualsense-ts";

// Single controller (auto-connects in Node.js)
const controller = new Dualsense();

// Browser: use DualsenseManager for WebHID device picker
import { DualsenseManager } from "dualsense-ts";
const manager = new DualsenseManager();`}
    />

    <SectionHeading>Face Buttons</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "triangle", type: "Momentary", description: "Triangle button", readonly: true },
        { name: "circle", type: "Momentary", description: "Circle button", readonly: true },
        { name: "cross", type: "Momentary", description: "Cross (X) button", readonly: true },
        { name: "square", type: "Momentary", description: "Square button", readonly: true },
      ]}
    />

    <SectionHeading>Utility Buttons</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "ps", type: "Momentary", description: "PlayStation button", readonly: true },
        { name: "create", type: "Momentary", description: "Create button", readonly: true },
        { name: "options", type: "Momentary", description: "Options button", readonly: true },
        { name: "mute", type: "Mute", description: "Mute button with controllable LED", readonly: true },
      ]}
    />

    <SectionHeading>Directional</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "dpad", type: "Dpad", description: "D-pad with up/down/left/right sub-inputs", readonly: true },
        { name: "left", type: "Unisense", description: "Left side: trigger (L2), bumper (L1), analog stick, rumble", readonly: true },
        { name: "right", type: "Unisense", description: "Right side: trigger (R2), bumper (R1), analog stick, rumble", readonly: true },
      ]}
    />

    <SectionHeading>Sensors</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "touchpad", type: "Touchpad", description: "Multi-touch surface with two points and click", readonly: true },
        { name: "gyroscope", type: "Gyroscope", description: "3-axis angular velocity (pitch, roll, yaw)", readonly: true },
        { name: "accelerometer", type: "Accelerometer", description: "3-axis linear acceleration including gravity", readonly: true },
        { name: "sensorTimestamp", type: "number", description: "Monotonic sensor timestamp in microseconds from the controller's hardware clock. Wraps at 2³² (~71.6 min)." },
        { name: "battery", type: "Battery", description: "Battery level and charge status", readonly: true },
      ]}
    />

    <SectionHeading>Sensor Fusion</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "orientation", type: "Orientation", description: "Fused 3D orientation via Madgwick AHRS filter. Provides pitch, yaw, roll, quaternion, and accelerometer-only tilt. Updated automatically on each IMU sample.", readonly: true },
        { name: "shake", type: "ShakeDetector", description: "Shake intensity, frequency (reversal rate), fundamental, and active state via Goertzel frequency analysis. Configurable threshold, window size, and frequency range.", readonly: true },
        { name: "calibration", type: "ResolvedCalibration", description: "Factory-calibrated per-axis bias and scale factors for gyroscope and accelerometer. Applied automatically to all IMU readings.", readonly: true },
      ]}
    />

    <SectionHeading>Outputs</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "lightbar", type: "Lightbar", description: "RGB LED strip on the front edge", readonly: true },
        { name: "playerLeds", type: "PlayerLeds", description: "5 white LEDs for player indication", readonly: true },
        { name: "audio", type: "Audio", description: "Speaker, headphone, and microphone controls", readonly: true },
        { name: "powerSave", type: "PowerSaveControl", description: "Per-subsystem power save flags (disable touch, motion, haptics, audio)", readonly: true },
      ]}
    />

    <SectionHeading>Connection State</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "connection", type: "Momentary", description: "True when connected, false when disconnected", readonly: true },
        { name: "microphone", type: "Momentary", description: "Microphone connection state", readonly: true },
        { name: "headphone", type: "Momentary", description: "Headphone connection state", readonly: true },
      ]}
    />

    <SectionHeading>Device Info (Getters)</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "active", type: "boolean", description: "True if any input is currently active" },
        { name: "wireless", type: "boolean", description: "True if connected via Bluetooth" },
        { name: "color", type: "DualsenseColor", description: "Body color stored in firmware" },
        { name: "serialNumber", type: "string", description: "Factory-stamped serial number" },
        { name: "firmwareInfo", type: "FirmwareInfo", description: "Firmware version and hardware info" },
        { name: "factoryInfo", type: "FactoryInfo", description: "Factory data (serial, color, board revision)" },
      ]}
    />

    <SectionHeading>Methods</SectionHeading>
    <MethodsTable
      methods={[
        { name: "rumble", signature: "rumble(intensity?: Intensity): number", description: "Get or set rumble intensity (0–1) across both motors." },
        { name: "resetTriggerFeedback", signature: "resetTriggerFeedback(): void", description: "Reset both L2 and R2 adaptive trigger effects to default." },
        { name: "startTestTone", signature: 'startTestTone(target?, tone?): Promise<void>', description: "Play a DSP test tone on speaker or headphone." },
        { name: "stopTestTone", signature: "stopTestTone(): Promise<void>", description: "Stop the currently playing test tone." },
        { name: "dispose", signature: "dispose(): void", description: "Stop timers, release HID resources, clean up." },
      ]}
    />

    <SectionHeading>Events</SectionHeading>
    <Prose>
      <p>
        Inherited from <code>Input</code>. The <code>Dualsense</code> instance
        fires <code>"change"</code> whenever any child input changes.
      </p>
    </Prose>
    <CodeBlock
      code={`// Any input changed
controller.on("change", (ds) => { /* ... */ });

// Wait for a single change
await controller.promise("change");

// Async iteration
for await (const state of controller) {
  console.log(state.active);
}`}
    />
  </ApiPage>
);

export default DualsensePage;
