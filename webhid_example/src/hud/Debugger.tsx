import React from "react";
import styled from "styled-components";
import { Card, Section, Elevation, Switch, Slider } from "@blueprintjs/core";
import { DualsenseHIDState } from "dualsense-ts";

import { ControllerContext } from "../Controller";

const StyledDebugger = styled.div`
  grid-column: 1;
  grid-row: 1/-1;
  justify-content: right;
  align-items: top;
  display: flex;
  opacity: 0.7;
  padding: 1vw;
`;

export const Debugger = () => {
  const controller = React.useContext(ControllerContext);
  const [controllerState, setDebugState] = React.useState<DualsenseHIDState>(
    controller.hid.state
  );

  const [showReport, setShowReport] = React.useState<boolean>(false);
  const [showState, setShowState] = React.useState<boolean>(false);
  const [byteOffset, setByteOffset] = React.useState<number>(0);
  controller.hid.provider.reportOffset = byteOffset;

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
    <StyledDebugger className="Debugger">
      <Card interactive={false} elevation={Elevation.TWO}>
        <h3>Controller Debugger</h3>
        <h5>Outputs</h5>
        <Switch
          label={"Show Controller State"}
          checked={showState}
          onChange={() => setShowState(!showState)}
        />
        <Switch
          label={"Show Report Buffer"}
          checked={showReport}
          onChange={() => setShowReport(!showReport)}
        />
        {showReport
          ? [
              <Section
                title={"HID Report Buffer"}
                subtitle={`Buffer Length: ${reportLength}`}
              >
                <Card>
                  <h5>Report Offset</h5>
                  <Slider
                    value={byteOffset}
                    min={-2}
                    max={20}
                    stepSize={1}
                    onChange={setByteOffset}
                    labelValues={[byteOffset]}
                  />
                  <h5>Report Sample</h5>
                  <pre>{reportBuffer}</pre>
                </Card>
              </Section>,
            ]
          : []}
        {showState
          ? [
              <Section title={"Controller State"} compact={true}>
                {Object.entries(controllerState).map(([key, val], index) => (
                  <pre>
                    {key}: {JSON.stringify(val)}
                  </pre>
                ))}
              </Section>,
            ]
          : []}
      </Card>
    </StyledDebugger>
  );
};
