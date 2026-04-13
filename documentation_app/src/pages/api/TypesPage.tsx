import React from "react";
import {
  ApiPage,
  PropertiesTable,
  SectionHeading,
  Prose,
  CodeBlock,
} from "../../components/ApiPage";

const TypesPage: React.FC = () => (
  <ApiPage
    name="Types"
    description="Type aliases, interfaces, and callback signatures used throughout dualsense-ts."
  >
    <SectionHeading>Numeric Types</SectionHeading>
    <Prose>
      <p>
        These type aliases convey the semantic meaning of numeric values. They
        are all <code>number</code> at runtime.
      </p>
    </Prose>
    <PropertiesTable
      properties={[
        { name: "Force", type: "number", description: "Signed intensity from -1 to 1. Used for axis values." },
        { name: "Magnitude", type: "number", description: "Unsigned intensity from 0 to 1. Used for triggers, deadzone, battery level." },
        { name: "Intensity", type: "number", description: "Unsigned intensity from 0 to 1. Alias for Magnitude, used for rumble." },
        { name: "Radians", type: "number", description: "Angle in radians (typically -PI to PI)." },
        { name: "Degrees", type: "number", description: "Angle in degrees (0 to 360)." },
      ]}
    />

    <SectionHeading>RGB</SectionHeading>
    <CodeBlock
      code={`interface RGB {
  r: number;  // 0–255
  g: number;  // 0–255
  b: number;  // 0–255
}`}
    />

    <SectionHeading>Event Types</SectionHeading>
    <CodeBlock
      code={`type InputChangeType = "change" | "press" | "release";
type InputEventType = InputChangeType | "input";

type InputCallback<Instance> = (
  input: Instance,
  changed: Instance | Input<unknown>
) => unknown | Promise<unknown>;`}
    />

    <SectionHeading>Manager State</SectionHeading>
    <CodeBlock
      code={`interface DualsenseManagerState {
  active: number;
  players: ReadonlyMap<number, Dualsense>;
}`}
    />

    <SectionHeading>Device Info</SectionHeading>
    <CodeBlock
      code={`interface FirmwareInfo {
  // Firmware version and hardware revision details
}

interface FactoryInfo {
  // Serial number, body color, board revision
}

interface DualsenseDeviceInfo {
  path: string;
  serialNumber?: string;
  wireless: boolean;
}`}
    />

    <SectionHeading>HID State</SectionHeading>
    <Prose>
      <p>
        The <code>DualsenseHIDState</code> interface maps every <code>InputId</code>{" "}
        to its raw value. This is the low-level state object you'd use if working
        directly with the HID provider rather than the <code>Input</code> tree.
      </p>
    </Prose>
  </ApiPage>
);

export default TypesPage;
