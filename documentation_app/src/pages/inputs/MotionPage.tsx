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
  SensorTimestampDiagnostic,
} from "../../components/diagnostics/MotionDiagnostic";
import { CalibrationDiagnostic } from "../../components/diagnostics/CalibrationDiagnostic";

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

    <DemoArea style={{ padding: 0, border: "none", background: "none", minHeight: 0 }}>
      <SensorTimestampDiagnostic />
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

    <SectionHeading>Sensor Timestamp</SectionHeading>
    <Prose>
      <p>
        Each input report includes a monotonic sensor timestamp from the
        controller's hardware clock, exposed as{" "}
        <code>controller.sensorTimestamp</code>. The value counts in
        microseconds and wraps at 2<sup>32</sup> (~71.6 minutes). Use it to
        compute precise time deltas between motion samples — essential for
        gyroscope integration and any frame-rate-independent motion processing.
      </p>
    </Prose>
    <CodeBlock
      code={`let prevTimestamp = 0;

controller.gyroscope.on("change", () => {
  const now = controller.sensorTimestamp;

  // Handle wrap-around at 2^32
  const dt = (now >= prevTimestamp
    ? now - prevTimestamp
    : 0xFFFFFFFF - prevTimestamp + now + 1
  ) / 1_000_000; // convert µs to seconds

  prevTimestamp = now;

  // Integrate angular velocity with precise dt
  orientation.x += controller.gyroscope.x.force * dt;
  orientation.y += controller.gyroscope.y.force * dt;
  orientation.z += controller.gyroscope.z.force * dt;
});`}
    />
    <HardwareNote>
      The sensor timestamp comes from the controller's own clock, not the
      host. This means it is unaffected by system load, USB polling jitter,
      or Bluetooth scheduling — it reflects exactly when the IMU sampled.
    </HardwareNote>

    <SectionHeading>Factory Calibration</SectionHeading>
    <Prose>
      <p>
        Each DualSense controller stores per-unit factory calibration data for
        the gyroscope and accelerometer in{" "}
        <strong>Feature Report 0x05</strong>. This data is read automatically
        when the controller connects — no user action is required.
      </p>
      <p>
        The calibration corrects three things:
      </p>
      <ul>
        <li>
          <strong>Gyroscope bias</strong> — every gyro has a small non-zero
          resting value that causes drift in integration-based orientation
          tracking. The factory calibration records each axis's bias so it
          can be subtracted from every sample.
        </li>
        <li>
          <strong>Accelerometer zero-point offset</strong> — manufacturing
          tolerance means the "at rest" reading isn't perfectly centered.
          The calibration data provides plus/minus reference points for
          each axis, from which the true center is derived and subtracted.
        </li>
        <li>
          <strong>Per-axis sensitivity normalization</strong> — the three
          axes of each sensor may have slightly different sensitivities
          (typically 1–4%). The calibration data includes reference-rate
          measurements for each axis, used to scale them so the same
          physical input produces the same numeric value on all axes.
        </li>
      </ul>
    </Prose>
    <DemoLabel>Your controller's factory calibration</DemoLabel>
    <DemoArea style={{ padding: 0, border: "none", background: "none", minHeight: 0 }}>
      <CalibrationDiagnostic />
    </DemoArea>

    <CodeBlock
      code={`// Calibration is applied automatically — just read the values
const pitch = controller.gyroscope.x.force; // bias-corrected

// Inspect the resolved calibration factors
const cal = controller.calibration;
console.log(cal.gyroPitch);
// { bias: 2, scale: 0.000030518... }

// Each axis has a precomputed bias and scale:
//   calibrated = clamp((raw - bias) × scale, -1, 1)
// The bias removes the resting-state offset.
// The scale normalises sensitivity across axes.`}
    />

    <HardwareNote>
      Calibration varies between individual controllers. For example, one
      unit may have a gyro roll bias of −10 while another reads 0. Without
      calibration, that −10 bias causes the roll axis to read a small
      non-zero value at rest, which compounds into visible drift when
      integrated over time. The per-axis sensitivity correction is subtler
      (1–4%) but matters for applications that compare rotation rates
      across axes.
    </HardwareNote>

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
