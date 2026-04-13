import React from "react";
import styled from "styled-components";
import { Card } from "../ui";
import { Switch } from "../ui";
import { DualsenseHIDState, FirmwareInfo, FactoryInfo, formatFirmwareVersion } from "dualsense-ts";

import { ControllerContext } from "../../controller";
import { TriggerEffectControls } from "./TriggerEffectControls";
import { AudioControls } from "./AudioControls";

const ScrollablePre = styled.pre`
  overflow: auto;
  word-break: normal !important;
  word-wrap: normal !important;
  white-space: pre !important;
  max-height: 200px;
  font-size: 11px;
`;

interface DebuggerProps {
  panel: "triggers" | "audio" | "debug";
}

export const Debugger = ({ panel }: DebuggerProps) => {
  const controller = React.useContext(ControllerContext);
  const [controllerState, setDebugState] = React.useState<DualsenseHIDState>(
    controller.hid.state
  );

  const [showReport, setShowReport] = React.useState<boolean>(false);
  const [showState, setShowState] = React.useState<boolean>(false);
  const [firmware, setFirmware] = React.useState<FirmwareInfo | undefined>(
    controller.firmwareInfo
  );
  const [factory, setFactory] = React.useState<FactoryInfo | undefined>(
    controller.factoryInfo
  );

  React.useEffect(() => {
    controller.on("change", (controller) => {
      setDebugState(controller.hid.state);
      if (!firmware && controller.firmwareInfo) {
        setFirmware(controller.firmwareInfo);
      }
      if (!factory && controller.factoryInfo) {
        setFactory(controller.factoryInfo);
      }
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

  if (panel === "audio") {
    return <AudioControls controller={controller} />;
  }

  return (
    <>
      {firmware && (
        <Card>
          <p style={{ fontSize: 12, opacity: 0.7, margin: 0 }}>
            Firmware: v{formatFirmwareVersion(firmware.mainFirmwareVersion)}
            {" · "}HW: {firmware.hardwareInfo}
            {" · "}DSP: {firmware.dspFirmwareVersion}
            {" · "}SBL: v{formatFirmwareVersion(firmware.sblFirmwareVersion)}
            {" · "}Built: {firmware.buildDate} {firmware.buildTime}
          </p>
          {factory && (
            <p style={{ fontSize: 12, opacity: 0.7, margin: "4px 0 0" }}>
              Color: {factory.colorName ?? factory.colorCode}
              {" · "}{factory.boardRevision ?? "Unknown board"}
              {" · "}Serial: {factory.serialNumber}
            </p>
          )}
        </Card>
      )}
      <Card>
        <Switch
          label="Input State"
          checked={showState}
          onChange={(checked) => setShowState(checked)}
        />
        <Switch
          label="Report Buffer"
          checked={showReport}
          onChange={(checked) => setShowReport(checked)}
        />
      </Card>
      {showReport && (
        <Card>
          <p style={{ fontSize: 12, opacity: 0.7 }}>
            Buffer: {reportLength}
          </p>
          <ScrollablePre>{reportBuffer}</ScrollablePre>
        </Card>
      )}
      {showState && (
        <Card>
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
