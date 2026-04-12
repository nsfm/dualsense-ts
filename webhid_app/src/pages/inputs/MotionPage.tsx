import React from "react";
import {
  FeaturePage,
  SectionHeading,
  DemoArea,
  DemoLabel,
  Prose,
  CodeBlock,
} from "../../components/FeaturePage";
import { Gyro } from "../../components/hud";

const MotionPage: React.FC = () => (
  <FeaturePage
    title="Motion Sensors"
    subtitle="6-axis IMU: 3-axis gyroscope and 3-axis accelerometer."
  >
    <Prose>
      <p>
        The DualSense includes a full inertial measurement unit (IMU) with a
        3-axis gyroscope measuring angular velocity and a 3-axis accelerometer
        measuring linear acceleration. Both report normalized values on the X,
        Y, and Z axes.
      </p>
    </Prose>

    <DemoLabel>Live Demo — rotate and move your controller</DemoLabel>
    <DemoArea>
      <Gyro />
    </DemoArea>

    <SectionHeading>Gyroscope</SectionHeading>
    <Prose>
      <p>
        The gyroscope measures angular velocity. Each axis has a{" "}
        <code>.force</code> value representing the normalized rotation rate, and
        a <code>.magnitude</code> for the combined rotational intensity.
      </p>
    </Prose>
    <CodeBlock
      code={`controller.gyroscope.on("change", (gyro) => {
  console.log(\`Rotation: x=\${gyro.x.force} y=\${gyro.y.force} z=\${gyro.z.force}\`);
  console.log(\`Total magnitude: \${gyro.magnitude}\`);
});

// Individual axes
controller.gyroscope.x.on("change", (axis) => {
  console.log(\`Pitch rate: \${axis.force}\`);
});`}
    />

    <SectionHeading>Accelerometer</SectionHeading>
    <Prose>
      <p>
        The accelerometer measures linear acceleration including gravity.
        When the controller is at rest, you'll see approximately 1g on the
        vertical axis.
      </p>
    </Prose>
    <CodeBlock
      code={`controller.accelerometer.on("change", (accel) => {
  console.log(\`Accel: x=\${accel.x.force} y=\${accel.y.force} z=\${accel.z.force}\`);
  console.log(\`Total magnitude: \${accel.magnitude}\`);
});`}
    />

    <SectionHeading>Combined Motion Tracking</SectionHeading>
    <CodeBlock
      code={`// Use both sensors together for full motion tracking
function onFrame() {
  const gyro = controller.gyroscope;
  const accel = controller.accelerometer;

  updateOrientation(gyro.x.force, gyro.y.force, gyro.z.force);
  updatePosition(accel.x.force, accel.y.force, accel.z.force);
}

// Or subscribe to changes
controller.gyroscope.on("change", (g) => {
  updateOrientation(g.x.force, g.y.force, g.z.force);
});`}
    />
  </FeaturePage>
);

export default MotionPage;
