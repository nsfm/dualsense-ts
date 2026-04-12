import React from "react";
import styled from "styled-components";
import { Link } from "react-router";
import { InputTree } from "../../components/InputTree";

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: rgba(191, 204, 214, 0.6);
  font-size: 15px;
  margin: 0;
`;

const Prose = styled.div`
  color: rgba(191, 204, 214, 0.85);
  line-height: 1.7;
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  margin-top: 40px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const ClassGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
  margin-top: 16px;
`;

const ClassCard = styled(Link)`
  display: block;
  padding: 16px;
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  text-decoration: none;
  transition: border-color 0.15s, background 0.15s;

  &:hover {
    border-color: rgba(72, 175, 240, 0.3);
    background: rgba(72, 175, 240, 0.04);
    text-decoration: none;
  }
`;

const ClassName = styled.div`
  color: #48aff0;
  font-size: 15px;
  font-weight: 600;
  font-family: monospace;
  margin-bottom: 4px;
`;

const ClassDesc = styled.div`
  color: rgba(191, 204, 214, 0.6);
  font-size: 13px;
  line-height: 1.5;
`;


const ApiIndex: React.FC = () => (
  <>
    <Header>
      <Title>API Reference</Title>
      <Subtitle>
        Classes, types, and interfaces exported by dualsense-ts.
      </Subtitle>
    </Header>

    <Prose>
      <p>
        The library is organized around the <code>Input</code> base class.
        Every readable value on the controller — buttons, axes, battery, touch
        points — is an <code>Input</code> subclass with a consistent event API.
        Output features (lightbar, LEDs, rumble, audio, trigger effects) are
        accessed as properties on the controller or its child inputs.
      </p>
    </Prose>

    <SectionTitle>Controller Tree</SectionTitle>
    <Prose>
      <p>
        The full hierarchy of inputs accessible from a{" "}
        <code>Dualsense</code> instance. Click a type badge to see its API
        docs, or use the arrows to expand compound inputs.
      </p>
    </Prose>
    <InputTree />

    <SectionTitle>Core Classes</SectionTitle>
    <ClassGrid>
      <ClassCard to="/api/dualsense">
        <ClassName>Dualsense</ClassName>
        <ClassDesc>
          The main controller class. Contains all inputs, outputs, and device
          info.
        </ClassDesc>
      </ClassCard>
      <ClassCard to="/api/manager">
        <ClassName>DualsenseManager</ClassName>
        <ClassDesc>
          Multi-controller management with auto-discovery and player LED
          assignment.
        </ClassDesc>
      </ClassCard>
      <ClassCard to="/api/input">
        <ClassName>Input&lt;T&gt;</ClassName>
        <ClassDesc>
          Abstract base class for all inputs. Provides events, promises, and
          async iteration.
        </ClassDesc>
      </ClassCard>
    </ClassGrid>

    <SectionTitle>Input Elements</SectionTitle>
    <ClassGrid>
      <ClassCard to="/api/momentary">
        <ClassName>Momentary</ClassName>
        <ClassDesc>
          Boolean button input. Used for face buttons, bumpers, D-pad
          directions, and more.
        </ClassDesc>
      </ClassCard>
      <ClassCard to="/api/axis">
        <ClassName>Axis</ClassName>
        <ClassDesc>
          Single-axis value from -1 to 1 with deadzone support. Used in sticks,
          gyro, and accelerometer.
        </ClassDesc>
      </ClassCard>
      <ClassCard to="/api/analog">
        <ClassName>Analog</ClassName>
        <ClassDesc>
          Two-axis stick with magnitude, direction, and click button. Left and
          right sticks.
        </ClassDesc>
      </ClassCard>
      <ClassCard to="/api/trigger">
        <ClassName>Trigger</ClassName>
        <ClassDesc>
          Pressure-sensitive trigger (0–1) with a full-press button and adaptive
          feedback.
        </ClassDesc>
      </ClassCard>
      <ClassCard to="/api/unisense">
        <ClassName>Unisense</ClassName>
        <ClassDesc>
          Groups one side of the controller: trigger, bumper, analog stick, and
          rumble.
        </ClassDesc>
      </ClassCard>
      <ClassCard to="/api/dpad">
        <ClassName>Dpad</ClassName>
        <ClassDesc>
          D-pad with four directional sub-inputs (up, down, left, right).
        </ClassDesc>
      </ClassCard>
      <ClassCard to="/api/touchpad">
        <ClassName>Touchpad</ClassName>
        <ClassDesc>
          Multi-touch surface with two touch points and a click button.
        </ClassDesc>
      </ClassCard>
      <ClassCard to="/api/gyroscope">
        <ClassName>Gyroscope</ClassName>
        <ClassDesc>
          3-axis angular velocity sensor (pitch, roll, yaw).
        </ClassDesc>
      </ClassCard>
      <ClassCard to="/api/accelerometer">
        <ClassName>Accelerometer</ClassName>
        <ClassDesc>
          3-axis linear acceleration sensor including gravity.
        </ClassDesc>
      </ClassCard>
      <ClassCard to="/api/battery">
        <ClassName>Battery</ClassName>
        <ClassDesc>
          Battery level (0–1) and charge status (charging, discharging, error).
        </ClassDesc>
      </ClassCard>
    </ClassGrid>

    <SectionTitle>Output Classes</SectionTitle>
    <ClassGrid>
      <ClassCard to="/api/lightbar">
        <ClassName>Lightbar</ClassName>
        <ClassDesc>RGB LED strip with color control and fade effects.</ClassDesc>
      </ClassCard>
      <ClassCard to="/api/player-leds">
        <ClassName>PlayerLeds</ClassName>
        <ClassDesc>
          5 white LEDs with individual toggle and brightness control.
        </ClassDesc>
      </ClassCard>
      <ClassCard to="/api/mute">
        <ClassName>Mute</ClassName>
        <ClassDesc>
          Mute button with controllable orange LED (on/pulse/off/auto).
        </ClassDesc>
      </ClassCard>
      <ClassCard to="/api/audio">
        <ClassName>Audio</ClassName>
        <ClassDesc>
          Speaker, headphone, and microphone volume, routing, and DSP control.
        </ClassDesc>
      </ClassCard>
      <ClassCard to="/api/trigger-feedback">
        <ClassName>TriggerFeedback</ClassName>
        <ClassDesc>
          Adaptive trigger effects: feedback, weapon, bow, galloping, vibration,
          and machine.
        </ClassDesc>
      </ClassCard>
    </ClassGrid>

    <SectionTitle>Enums & Types</SectionTitle>
    <ClassGrid>
      <ClassCard to="/api/enums">
        <ClassName>Enums</ClassName>
        <ClassDesc>
          TriggerEffect, ChargeStatus, Brightness, AudioOutput, MuteLedMode,
          InputId, and more.
        </ClassDesc>
      </ClassCard>
      <ClassCard to="/api/types">
        <ClassName>Types</ClassName>
        <ClassDesc>
          Magnitude, Force, Intensity, Radians, Degrees, RGB, and event callback
          types.
        </ClassDesc>
      </ClassCard>
    </ClassGrid>
  </>
);

export default ApiIndex;
