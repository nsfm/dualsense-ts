import React from "react";
import { Link } from "react-router";
import {
  FeaturePage,
  SectionHeading,
  DemoArea,
  DemoLabel,
  Prose,
  HardwareNote,
  CodeBlock,
} from "../../components/FeaturePage";
import { Gyro } from "../../components/hud";
import {
  GyroscopeDiagnostic,
  AccelerometerDiagnostic,
} from "../../components/diagnostics/MotionDiagnostic";

const MotionPage: React.FC = () => (
  <FeaturePage
    title="Motion Sensors"
    subtitle="6-axis IMU: 3-axis gyroscope and 3-axis accelerometer."
  >
    <Prose>
      <p>
        The DualSense includes a 6-axis inertial measurement unit (IMU) with
        a{" "}
        <Link to="/api/gyroscope"><code>Gyroscope</code></Link> measuring
        angular velocity and an{" "}
        <Link to="/api/accelerometer"><code>Accelerometer</code></Link>{" "}
        measuring linear acceleration. Both expose three{" "}
        <Link to="/api/axis"><code>Axis</code></Link> sub-inputs
        (<code>.x</code>, <code>.y</code>, <code>.z</code>) with the same{" "}
        <code>.state</code> / <code>.force</code> / <code>.active</code>{" "}
        semantics as analog stick axes.
      </p>
      <p>
        Motion data updates at HID report rate. For game loops and animation
        frames, read the values synchronously rather than subscribing to
        events.
      </p>
    </Prose>

    <SectionHeading>Live State</SectionHeading>
    <DemoLabel>Rotate and move your controller</DemoLabel>
    <DemoArea>
      <Gyro />
    </DemoArea>

    <DemoArea style={{ padding: 0, border: "none", background: "none", minHeight: 0 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, width: "100%" }}>
        <div style={{ flex: "1 1 320px", minWidth: 0 }}>
          <GyroscopeDiagnostic />
        </div>
        <div style={{ flex: "1 1 320px", minWidth: 0 }}>
          <AccelerometerDiagnostic />
        </div>
      </div>
    </DemoArea>

    <SectionHeading>Gyroscope</SectionHeading>
    <Prose>
      <p>
        The gyroscope measures angular velocity — how fast the controller is
        rotating around each axis. Values are normalized to -1 to 1. At rest,
        all axes should read near zero.
      </p>
    </Prose>
    <CodeBlock
      code={`// Synchronous read in a game loop
const pitch = controller.gyroscope.x.force;
const yaw   = controller.gyroscope.y.force;
const roll  = controller.gyroscope.z.force;

// Use for camera rotation, steering, etc.
camera.rotate(pitch * sensitivity, yaw * sensitivity);`}
    />

    <SectionHeading>Accelerometer</SectionHeading>
    <Prose>
      <p>
        The accelerometer measures linear acceleration including gravity.
        The raw scale is not yet normalized to standard units — a value
        of ~0.25 corresponds to 1g, and the scale maxes out at 4g (1.0).
      </p>
    </Prose>
    <HardwareNote>
      The accelerometer always includes gravitational acceleration. At rest
      on a flat surface, you'll see approximately 0.25 on the vertical axis
      (1g). To isolate motion from gravity, you'll need a complementary or
      sensor fusion filter.
    </HardwareNote>
    <CodeBlock
      code={`// Detect a shake gesture
const threshold = 0.8;
const shaking =
  Math.abs(controller.accelerometer.x.force) > threshold ||
  Math.abs(controller.accelerometer.y.force) > threshold ||
  Math.abs(controller.accelerometer.z.force) > threshold;`}
    />

    <SectionHeading>Combined Motion Tracking</SectionHeading>
    <Prose>
      <p>
        For full orientation tracking, combine both sensors. The gyroscope
        gives you rotation rate (integrate for angle) while the
        accelerometer provides a gravity reference to correct drift.
      </p>
    </Prose>
    <HardwareNote>
      Raw gyroscope integration drifts over time. For stable orientation,
      use a complementary filter or a library like{" "}
      <code>ahrs</code> / <code>madgwick</code> that fuses both sensor
      streams.
    </HardwareNote>
    <CodeBlock
      code={`// Combined motion in a game loop
function onFrame() {
  const gyro = controller.gyroscope;
  const accel = controller.accelerometer;

  // Gyro: integrate angular velocity for rotation
  orientation.x += gyro.x.force * dt;
  orientation.y += gyro.y.force * dt;
  orientation.z += gyro.z.force * dt;

  // Accel: use gravity vector to correct drift
  const gravityAngle = Math.atan2(accel.x.force, accel.z.force);
  orientation.x = lerp(orientation.x, gravityAngle, 0.02);
}`}
    />
  </FeaturePage>
);

export default MotionPage;
