import React from "react";
import styled from "styled-components";
import { Card, Switch } from "@blueprintjs/core";
import { DualsenseHIDState } from "dualsense-ts";

import { ControllerContext } from "../Controller";
import { TriggerEffectControls } from "./TriggerEffectControls";

const ScrollablePre = styled.pre`
  overflow: auto;
  word-break: normal !important;
  word-wrap: normal !important;
  white-space: pre !important;
  max-height: 200px;
  font-size: 11px;
`;

interface DebuggerProps {
  panel: "triggers" | "debug";
}

export const Debugger = ({ panel }: DebuggerProps) => {
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

  if (panel === "triggers") {
    return <TriggerEffectControls controller={controller} />;
  }

  return (
    <>
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
    </>
  );
};
