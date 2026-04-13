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
import { OrientationDiagnostic } from "../../components/diagnostics/OrientationDiagnostic";
import { TiltDiagnostic } from "../../components/diagnostics/TiltDiagnostic";
import { ShakeDiagnostic } from "../../components/diagnostics/ShakeDiagnostic";

const MotionPage: React.FC = () => (
  <FeaturePage
    title="Motion Sensors"
    subtitle="6-axis IMU: 3-axis gyroscope and 3-axis accelerometer."
  >
    <Prose>
      <p>
        The DualSense includes a 6-axis inertial measurement unit (IMU) with a{" "}
        <Link to="/api/gyroscope">
          <code>Gyroscope</code>
        </Link>{" "}
        measuring angular velocity and an{" "}
        <Link to="/api/accelerometer">
          <code>Accelerometer</code>
        </Link>{" "}
        measuring linear acceleration. Both expose three{" "}
        <Link to="/api/axis">
          <code>Axis</code>
        </Link>{" "}
        sub-inputs (<code>.x</code>, <code>.y</code>, <code>.z</code>) with the
        same <code>.state</code> / <code>.force</code> / <code>.active</code>{" "}
        semantics as analog stick axes.
      </p>
      <p>
        Motion data updates at HID report rate. For game loops and animation
        frames, read the values synchronously rather than subscribing to events.
      </p>
    </Prose>

    <SectionHeading>Live State</SectionHeading>
    <DemoLabel>Rotate and move your controller</DemoLabel>
    <DemoArea>
      <Gyro />
    </DemoArea>

    <DemoArea
      style={{ padding: 0, border: "none", background: "none", minHeight: 0 }}
    >
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 16, width: "100%" }}
      >
        <div style={{ flex: "1 1 320px", minWidth: 0 }}>
          <GyroscopeDiagnostic />
        </div>
        <div style={{ flex: "1 1 320px", minWidth: 0 }}>
          <AccelerometerDiagnostic />
        </div>
      </div>
    </DemoArea>

    <DemoArea
      style={{ padding: 0, border: "none", background: "none", minHeight: 0 }}
    >
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
        The accelerometer measures linear acceleration including gravity. The
        raw scale is not yet normalized to standard units — a value of ~0.25
        corresponds to 1g, and the scale maxes out at 4g (1.0).
      </p>
    </Prose>
    <HardwareNote>
      The accelerometer always includes gravitational acceleration. At rest on a
      flat surface, you'll see approximately 0.25 on the vertical axis (1g). To
      isolate motion from gravity, you'll need a complementary or sensor fusion
      filter.
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
      The sensor timestamp comes from the controller's own clock, not the host.
      This means it is unaffected by system load, USB polling jitter, or
      Bluetooth scheduling — it reflects exactly when the IMU sampled.
    </HardwareNote>

    {/* ── Orientation ─────────────────────────────────────────── */}

    <SectionHeading>Orientation Tracking</SectionHeading>
    <Prose>
      <p>
        The library includes a built-in <strong>Madgwick AHRS</strong> (Attitude
        and Heading Reference System) filter that fuses gyroscope and
        accelerometer data into a stable orientation estimate. This runs
        automatically on every HID report using the controller's hardware
        timestamp for precise integration — no setup required.
      </p>
      <p>
        The filter outputs Euler angles (pitch, yaw, roll in radians) and the
        underlying unit quaternion. It uses gradient descent to correct
        gyroscope drift against the accelerometer's gravity reference,
        controlled by a configurable <code>beta</code> gain parameter.
      </p>
    </Prose>
    <DemoLabel>Rotate your controller to see orientation change</DemoLabel>
    <DemoArea
      style={{ padding: 0, border: "none", background: "none", minHeight: 0 }}
    >
      <OrientationDiagnostic />
    </DemoArea>
    <CodeBlock
      code={`// Read fused orientation in a game loop
const { pitch, yaw, roll } = controller.orientation;
camera.setRotation(pitch, yaw, roll);

// Or use the quaternion directly
const [w, x, y, z] = controller.orientation.quaternion;
mesh.quaternion.set(x, y, z, w);

// Reset orientation (zero the view)
controller.orientation.reset();

// Tune the filter gain at runtime
controller.orientation.beta = 0.05; // smoother, more drift
controller.orientation.beta = 0.3;  // snappier, more noise`}
    />
    <HardwareNote>
      The Madgwick filter cannot determine absolute yaw (compass heading) from
      accelerometer data alone — the accelerometer only provides a gravity
      reference for pitch and roll correction. Yaw is integrated from the
      gyroscope and will drift slowly over time. Call{" "}
      <code>controller.orientation.reset()</code> to re-zero when needed.
    </HardwareNote>

    {/* ── Tilt ────────────────────────────────────────────────── */}

    <SectionHeading>Accelerometer Tilt</SectionHeading>
    <Prose>
      <p>
        For applications that only need pitch and roll relative to gravity —
        steering wheels, balance games, level tools — the orientation tracker
        also exposes <strong>accelerometer-only tilt</strong> angles. These
        derive directly from the gravity vector without gyroscope integration,
        so they never drift. The tradeoff is they're noisy during fast motion
        and cannot measure yaw.
      </p>
    </Prose>
    <DemoLabel>Tilt your controller to see the bubble move</DemoLabel>
    <DemoArea
      style={{ padding: 0, border: "none", background: "none", minHeight: 0 }}
    >
      <TiltDiagnostic />
    </DemoArea>
    <CodeBlock
      code={`// Tilt-based steering (no drift, no yaw)
const steerAngle = controller.orientation.tiltRoll;
car.setSteeringAngle(steerAngle);

// Balance game: how far from level?
const tiltMag = Math.sqrt(
  controller.orientation.tiltPitch ** 2 +
  controller.orientation.tiltRoll ** 2,
);
if (tiltMag > MAX_TILT) gameOver();`}
    />
    <HardwareNote>
      Tilt angles are instantaneous — they reflect the current gravity vector
      with no filtering or history. During rapid acceleration (shaking,
      throwing), the tilt readings will be unreliable because the accelerometer
      can't distinguish linear acceleration from gravity. For those scenarios,
      use the fused orientation instead.
    </HardwareNote>

    {/* ── Shake Detection ─────────────────────────────────────── */}

    <SectionHeading>Shake Detection</SectionHeading>
    <Prose>
      <p>
        The shake detector analyzes accelerometer data in a sliding window to
        determine whether the controller is being shaken, how hard, and at what
        frequency. It uses the <strong>Goertzel algorithm</strong> — a
        single-bin DFT — to efficiently probe 15 frequency bands (1–15 Hz) and
        identify the dominant shake frequency.
      </p>
      <p>
        This enables mechanics like Death Stranding's BB soothing: gentle
        rocking (1–3 Hz, low intensity) can be distinguished from aggressive
        shaking (5–8 Hz, high intensity) using the combination of{" "}
        <code>frequency</code> and <code>intensity</code>.
      </p>
    </Prose>
    <DemoLabel>Shake your controller</DemoLabel>
    <DemoArea
      style={{ padding: 0, border: "none", background: "none", minHeight: 0 }}
    >
      <ShakeDiagnostic />
    </DemoArea>
    <CodeBlock
      code={`// Simple shake detection
if (controller.shake.active) {
  console.log("Shaking!", controller.shake.intensity);
}

// Distinguish gentle rocking from aggressive shaking
const { intensity, frequency } = controller.shake;

if (intensity > 0.6 && frequency >= 2) {
  // Aggressive shake — BB is crying!
  distressBaby();
} else if (intensity > 0.08 && frequency < 2) {
  // Gentle rocking — soothe the baby
  calmBaby(intensity);
}

// Adjust the activation threshold
controller.shake.threshold = 0.2; // less sensitive`}
    />

    {/* ── Factory Calibration ─────────────────────────────────── */}

    <SectionHeading>Factory Calibration</SectionHeading>
    <Prose>
      <p>
        Each DualSense controller stores per-unit factory calibration data for
        the gyroscope and accelerometer in <strong>Feature Report 0x05</strong>.
        This data is read automatically when the controller connects — no user
        action is required.
      </p>
      <p>The calibration corrects three things:</p>
      <ul>
        <li>
          <strong>Gyroscope bias</strong> — every gyro has a small non-zero
          resting value that causes drift in integration-based orientation
          tracking. The factory calibration records each axis's bias so it can
          be subtracted from every sample.
        </li>
        <li>
          <strong>Accelerometer zero-point offset</strong> — manufacturing
          tolerance means the "at rest" reading isn't perfectly centered. The
          calibration data provides plus/minus reference points for each axis,
          from which the true center is derived and subtracted.
        </li>
        <li>
          <strong>Per-axis sensitivity normalization</strong> — the three axes
          of each sensor may have slightly different sensitivities (typically
          1–4%). The calibration data includes reference-rate measurements for
          each axis, used to scale them so the same physical input produces the
          same numeric value on all axes.
        </li>
      </ul>
    </Prose>
    <DemoLabel>Your controller's factory calibration</DemoLabel>
    <DemoArea
      style={{ padding: 0, border: "none", background: "none", minHeight: 0 }}
    >
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
      Calibration varies between individual controllers. For example, one unit
      may have a gyro roll bias of −10 while another reads 0. Without
      calibration, that −10 bias causes the roll axis to read a small non-zero
      value at rest, which compounds into visible drift when integrated over
      time. The per-axis sensitivity correction is subtler (1–4%) but matters
      for applications that compare rotation rates across axes.
    </HardwareNote>

    {/* ── Combined Motion Tracking ────────────────────────────── */}

    <SectionHeading>Combined Motion Tracking</SectionHeading>
    <Prose>
      <p>
        For full orientation tracking, the library's built-in Madgwick filter
        handles everything automatically. The gyroscope provides rotation rate
        while the accelerometer provides a gravity reference to correct drift.
        You can also access the raw values for custom processing.
      </p>
    </Prose>
    <HardwareNote>
      Raw gyroscope integration drifts over time. The built-in{" "}
      <code>controller.orientation</code> handles this with Madgwick sensor
      fusion. For custom pipelines, use a complementary filter or a library like{" "}
      <code>ahrs</code> / <code>madgwick</code> that fuses both sensor streams.
    </HardwareNote>
    <CodeBlock
      code={`// Using the built-in orientation tracker
function onFrame() {
  const { pitch, yaw, roll } = controller.orientation;
  camera.setRotation(pitch, yaw, roll);
}

// Or manual integration with raw values
function onFrameManual() {
  const gyro = controller.gyroscope;
  const accel = controller.accelerometer;

  // Gyro: integrate angular velocity for rotation
  orientation.x += gyro.x.state * dt;
  orientation.y += gyro.y.state * dt;
  orientation.z += gyro.z.state * dt;

  // Accel: use gravity vector to correct drift
  const gravityAngle = Math.atan2(accel.x.state, accel.z.state);
  orientation.x = lerp(orientation.x, gravityAngle, 0.02);
}`}
    />
  </FeaturePage>
);

export default MotionPage;
