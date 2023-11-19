import React from "react";
import styled from "styled-components";
import { Card, CardList, Section, Elevation, Switch } from "@blueprintjs/core";
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
  width: 20vw;
`;

const ScrollablePre = styled.pre`
  overflow: scroll;
  word-break: normal !important;
  word-wrap: normal !important;
  white-space: pre !important;
  width: 15vw;
  max-height: 30vw;
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
    <StyledDebugger className="Debugger">
      <Card interactive={false} elevation={Elevation.TWO}>
        <Section title={"HID Debug"}>
          <CardList compact={true}>
            <Card compact={true}>
              Connected: {controller.hid.provider.connected ? "yes" : "no"}
            </Card>
            <Card compact={true}>
              Method:{" "}
              {controller.hid.provider.wireless === undefined
                ? "none"
                : controller.hid.provider.wireless
                ? "bluetooth"
                : "usb"}
            </Card>
            <Card compact={true}>
              Limited:{" "}
              {controller.hid.provider.limited === undefined
                ? "unknown"
                : controller.hid.provider.limited
                ? "yes"
                : "no"}
            </Card>
          </CardList>
        </Section>
        <Section title={"Outputs"}>
          <Card compact={true}>
            <Switch
              label={"Show Input State"}
              checked={showState}
              onChange={() => setShowState(!showState)}
            />
            <Switch
              label={"Show Report Buffer"}
              checked={showReport}
              onChange={() => setShowReport(!showReport)}
            />
          </Card>
        </Section>
        {showReport
          ? [
              <Section
                title={"HID Report"}
                subtitle={`Buffer Length: ${reportLength}`}
              >
                <Card compact={true}>
                  <h5>Buffer Sample</h5>
                  <ScrollablePre>{reportBuffer}</ScrollablePre>
                </Card>
              </Section>,
            ]
          : []}
        {showState
          ? [
              <Section title={"Input State"} compact={true}>
                <ScrollablePre>
                  {Object.entries(controllerState)
                    .map(
                      ([key, val], index) => `${key}: ${JSON.stringify(val)}`
                    )
                    .join("\n")}
                </ScrollablePre>
              </Section>,
            ]
          : []}
      </Card>
    </StyledDebugger>
  );
};
