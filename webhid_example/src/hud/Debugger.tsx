import React from "react";
import styled from "styled-components";
import { Card, Section, Switch, Slider } from "@blueprintjs/core";
import { DualsenseHIDState } from "dualsense-ts";

import { ControllerContext } from "../Controller";
import { TriggerEffectControls } from "./TriggerEffectControls";
import { LightbarControls } from "./LightbarControls";
import { PlayerLedControls } from "./PlayerLedControls";

const ScrollablePre = styled.pre`
  overflow: auto;
  word-break: normal !important;
  word-wrap: normal !important;
  white-space: pre !important;
  max-height: 200px;
  font-size: 11px;
`;

const SliderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  & .bp5-slider {
    min-width: 80px;
    flex: 1;
  }
`;

const Label = styled.span`
  min-width: 50px;
  font-size: 12px;
  opacity: 0.7;
`;

export const Debugger = () => {
  const controller = React.useContext(ControllerContext);
  const [controllerState, setDebugState] = React.useState<DualsenseHIDState>(
    controller.hid.state
  );

  const [showReport, setShowReport] = React.useState<boolean>(false);
  const [showState, setShowState] = React.useState<boolean>(false);

  React.useEffect(() => {
    controller.on("change", (controller) => {
      setDebugState(controller.hid.state);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let reportBuffer: string = "";
  let reportLength: string = "";
  if (controller.hid.provider.buffer) {
    const report = controller.hid.provider.buffer as DataView;
    reportBuffer = `const report = Buffer.from([${new Uint8Array(
      report.buffer
    ).join(", ")}])`;
    reportLength = `${report.byteLength} bytes`;
  } else {
    reportBuffer = "Waiting for report...";
    reportLength = "unknown";
  }

  return (
    <>
      <Section title="Rumble" collapsible={true} compact={true}>
        <Card compact={true}>
          <SliderRow>
            <Label>Left</Label>
            <Slider
              min={0}
              max={1}
              stepSize={0.05}
              labelStepSize={1}
              value={controller.left.rumble()}
              onChange={(val) => controller.left.rumble(val)}
            />
          </SliderRow>
          <SliderRow>
            <Label>Right</Label>
            <Slider
              min={0}
              max={1}
              stepSize={0.05}
              labelStepSize={1}
              value={controller.right.rumble()}
              onChange={(val) => controller.right.rumble(val)}
            />
          </SliderRow>
        </Card>
      </Section>

      <Section title="Trigger Effects" collapsible={true} compact={true}>
        <TriggerEffectControls controller={controller} />
      </Section>

      <Section title="Light Bar" collapsible={true} compact={true}>
        <LightbarControls />
      </Section>

      <Section title="Player LEDs" collapsible={true} compact={true}>
        <PlayerLedControls />
      </Section>

      <Section title="Debug" collapsible={true} compact={true} collapseProps={{ defaultIsOpen: false }}>
        <Card compact={true}>
          <Switch
            label="Input State"
            checked={showState}
            onChange={() => setShowState(!showState)}
          />
          <Switch
            label="Report Buffer"
            checked={showReport}
            onChange={() => setShowReport(!showReport)}
          />
        </Card>
        {showReport && (
          <Card compact={true}>
            <p style={{ fontSize: 12, opacity: 0.7 }}>
              Buffer: {reportLength}
            </p>
            <ScrollablePre>{reportBuffer}</ScrollablePre>
          </Card>
        )}
        {showState && (
          <Card compact={true}>
            <ScrollablePre>
              {Object.entries(controllerState)
                .map(([key, val]) => `${key}: ${JSON.stringify(val)}`)
                .join("\n")}
            </ScrollablePre>
          </Card>
        )}
      </Section>
    </>
  );
};
