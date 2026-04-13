import React from "react";
import {
  ApiPage,
  PropertiesTable,
  SectionHeading,
  Prose,
  CodeBlock,
} from "../../components/ApiPage";

const OrientationPage: React.FC = () => (
  <ApiPage
    name="Orientation"
    description="High-level orientation tracker using Madgwick AHRS sensor fusion. Provides fused Euler angles, quaternion, and accelerometer-only tilt."
    source="src/motion/orientation.ts"
  >
    <SectionHeading>Properties</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "pitch", type: "number", description: "Fused rotation around the X axis in radians (-PI to PI). Forward/back tilt." },
        { name: "yaw", type: "number", description: "Fused rotation around the Y axis in radians (-PI to PI). Left/right turn." },
        { name: "roll", type: "number", description: "Fused rotation around the Z axis in radians (-PI to PI). Side tilt." },
        { name: "quaternion", type: "Quaternion", description: "Fused orientation as a unit quaternion [w, x, y, z]." },
        { name: "tiltPitch", type: "number", description: "Accelerometer-only forward/back tilt in radians. No drift, but no yaw. Noisy during motion." },
        { name: "tiltRoll", type: "number", description: "Accelerometer-only side tilt in radians. No drift, but no yaw. Noisy during motion." },
        { name: "beta", type: "number", description: "Madgwick filter gain (read/write). Higher = more accelerometer trust, less drift, more noise. Default 0.1." },
      ]}
    />

    <SectionHeading>Methods</SectionHeading>
    <PropertiesTable
      properties={[
        { name: "reset()", type: "void", description: "Reset to identity orientation. Call when zeroing the view." },
      ]}
    />

    <SectionHeading>Constructor</SectionHeading>
    <Prose>
      <p>
        Accepts an optional <code>OrientationParams</code> object.
        Normally you don't construct this yourself — it's created automatically
        by the <code>Dualsense</code> class and accessible via{" "}
        <code>controller.orientation</code>.
      </p>
    </Prose>
    <PropertiesTable
      properties={[
        { name: "beta", type: "number", description: "Madgwick filter gain. 0.01–0.04: very smooth, drifty. 0.05–0.15: general purpose. 0.2–0.5: aggressive correction, jittery. Default 0.1." },
      ]}
    />

    <SectionHeading>Accelerometer-Only Tilt</SectionHeading>
    <Prose>
      <p>
        <code>tiltPitch</code> and <code>tiltRoll</code> are derived solely
        from the accelerometer gravity vector. They don't drift over time but
        also can't detect yaw (rotation on a flat surface). Best used when the
        controller is relatively still, e.g. for steering wheel or tilt-to-aim
        mechanics.
      </p>
    </Prose>

    <SectionHeading>Beta Tuning</SectionHeading>
    <Prose>
      <p>
        The <code>beta</code> parameter controls how much the filter trusts
        the accelerometer vs. the gyroscope. It can be changed at runtime to
        adapt to different gameplay scenarios.
      </p>
    </Prose>
    <CodeBlock
      code={`// Smooth tracking for aiming (low beta — trust gyro)
controller.orientation.beta = 0.02;

// Quick correction for motion controls (high beta — trust accel)
controller.orientation.beta = 0.3;`}
    />

    <SectionHeading>Examples</SectionHeading>
    <CodeBlock
      code={`// Read fused orientation in your game loop
const { pitch, yaw, roll } = controller.orientation;
camera.rotation.set(pitch, yaw, roll);

// Use quaternion for 3D rendering
const [w, x, y, z] = controller.orientation.quaternion;
mesh.quaternion.set(x, y, z, w);

// Accelerometer-only tilt for steering
const steer = controller.orientation.tiltRoll;
car.steeringAngle = steer * 2;

// Reset orientation (e.g. on button press)
controller.cross.on("press", () => {
  controller.orientation.reset();
});`}
    />
  </ApiPage>
);

export default OrientationPage;
