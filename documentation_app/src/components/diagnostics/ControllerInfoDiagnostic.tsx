import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { ChargeStatus, DualsenseColor } from "dualsense-ts";
import type { FirmwareInfo, FirmwareVersion, FactoryInfo } from "dualsense-ts";
import { ControllerContext } from "../../controller";

/* ── Shared layout ─────────────────────────────────────────── */

const Table = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  margin: 16px 0;
  overflow: hidden;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.18);
`;

const HeaderCell = styled.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(191, 204, 214, 0.35);
`;

const Row = styled.div<{ $even?: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  background: ${(p) =>
    p.$even ? "rgba(0, 0, 0, 0.12)" : "rgba(0, 0, 0, 0.06)"};
`;

const Label = styled.code`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.85);
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Dim = styled.span`
  color: rgba(191, 204, 214, 0.3);
`;

const Val = styled.code<{ $highlight?: boolean }>`
  font-size: 12px;
  flex-shrink: 0;
  text-align: right;
  color: ${(p) =>
    p.$highlight ? "#f29e02" : "rgba(191, 204, 214, 0.5)"};
  transition: color 0.06s;
`;

/* ── Row renderer ────────────────────────────────────────────── */

interface RowData {
  label: string;
  value: string;
  highlight?: boolean;
}

const InfoRow: React.FC<{ data: RowData; even: boolean }> = ({ data, even }) => {
  const parts = data.label.split(".");
  return (
    <Row $even={even}>
      <Label>
        <Dim>controller.</Dim>
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            {i > 0 && <Dim>.</Dim>}
            {i === parts.length - 1 ? part : <Dim>{part}</Dim>}
          </React.Fragment>
        ))}
      </Label>
      <Val $highlight={data.highlight}>{data.value}</Val>
    </Row>
  );
};

const InfoTable: React.FC<{ rows: RowData[] }> = ({ rows }) => (
  <Table>
    <HeaderRow>
      <HeaderCell style={{ flex: 1 }}>property</HeaderCell>
      <HeaderCell style={{ textAlign: "right" }}>value</HeaderCell>
    </HeaderRow>
    {rows.map((r, i) => (
      <InfoRow key={r.label} data={r} even={i % 2 === 1} />
    ))}
  </Table>
);

/* ── Color swatch ─────────────────────────────────────────── */

const colorCss: Record<string, string> = {
  "00": "#e8e8e8",
  "01": "#1a1a2e",
  "02": "#c8102e",
  "03": "#f2a6c0",
  "04": "#6b3fa0",
  "05": "#5b9bd5",
  "06": "#8a9a7b",
  "07": "#9b2335",
  "08": "#c0c0c0",
  "09": "#1e3a5f",
  "10": "#2db5a0",
  "11": "#3d4f7c",
  "12": "#e8dfd0",
  "30": "#4a4a4a",
};

const SwatchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0;
  padding: 16px;
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
`;

const Swatch = styled.div<{ $color: string }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  border: 2px solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
`;

const SwatchLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SwatchName = styled.span`
  font-size: 15px;
  color: rgba(191, 204, 214, 0.9);
  font-weight: 500;
`;

const SwatchDetail = styled.span`
  font-size: 12px;
  color: rgba(191, 204, 214, 0.4);
  font-family: "Fira Code", monospace;
`;

/* ── Helpers ──────────────────────────────────────────────── */

function fmtVersion(v: FirmwareVersion): string {
  return `${v.major}.${v.minor}.${v.patch}`;
}

function chargeLabel(s: ChargeStatus): string {
  switch (s) {
    case ChargeStatus.Discharging: return "Discharging";
    case ChargeStatus.Charging: return "Charging";
    case ChargeStatus.Full: return "Full";
    case ChargeStatus.AbnormalVoltage: return "AbnormalVoltage";
    case ChargeStatus.AbnormalTemperature: return "AbnormalTemp";
    case ChargeStatus.ChargingError: return "ChargingError";
    default: return `Unknown(${s})`;
  }
}

/* ── Connection demo ─────────────────────────────────────── */

const ConnectionPanel = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 20px 24px;
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  margin: 16px 0;
`;

const StatusIcon = styled.div<{ $connected: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${(p) =>
    p.$connected ? "rgba(61, 204, 145, 0.12)" : "rgba(255, 255, 255, 0.04)"};
  border: 2px solid ${(p) =>
    p.$connected ? "rgba(61, 204, 145, 0.5)" : "rgba(255, 255, 255, 0.1)"};
  transition: all 0.3s;
`;

const TransportIcon = styled.div<{ $connected: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${(p) =>
    p.$connected ? "rgba(72, 175, 240, 0.12)" : "rgba(255, 255, 255, 0.04)"};
  border: 2px solid ${(p) =>
    p.$connected ? "rgba(72, 175, 240, 0.4)" : "rgba(255, 255, 255, 0.1)"};
  transition: all 0.3s;
`;

const IconSvg = styled.svg<{ $active: boolean }>`
  fill: ${(p) =>
    p.$active ? "rgba(191, 204, 214, 0.9)" : "rgba(191, 204, 214, 0.2)"};
  transition: fill 0.3s;
`;

const StatusDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const StatusLabel = styled.span<{ $active: boolean }>`
  font-size: 15px;
  font-weight: 500;
  color: ${(p) =>
    p.$active ? "rgba(191, 204, 214, 0.9)" : "rgba(191, 204, 214, 0.35)"};
  transition: color 0.3s;
`;

const StatusSub = styled.code`
  font-size: 12px;
  color: rgba(191, 204, 214, 0.4);
`;

const Separator = styled.div`
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
`;

const UsbIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <IconSvg $active={active} width="22" height="22" viewBox="0 0 24 24">
    <path d="M15 7v4h1v2h-3V5h2l-3-4-3 4h2v8H8v-2.07A1.993 1.993 0 0 0 8 7a2 2 0 0 0-4 0c0 .74.4 1.38 1 1.73V13a2 2 0 0 0 2 2h3v2.27c-.6.35-1 .99-1 1.73a2 2 0 0 0 4 0c0-.74-.4-1.38-1-1.73V15h3a2 2 0 0 0 2-2v-2h1V7h-3z" />
  </IconSvg>
);

const BluetoothIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <IconSvg $active={active} width="22" height="22" viewBox="0 0 24 24">
    <path d="M17.71 7.71 12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z" />
  </IconSvg>
);

const LinkIcon: React.FC<{ active: boolean }> = ({ active }) => (
  <IconSvg $active={active} width="22" height="22" viewBox="0 0 24 24">
    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7a5 5 0 0 0 0 10h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4a5 5 0 0 0 0-10z" />
  </IconSvg>
);

export const ConnectionDemo: React.FC = () => {
  const controller = useContext(ControllerContext);
  const [, setTick] = useState(0);

  useEffect(() => {
    const onChange = () => setTick((t) => t + 1);
    controller.connection.on("change", onChange);
    return () => {
      controller.connection.removeListener("change", onChange);
    };
  }, [controller]);

  const connected = controller.connection.state;
  const wireless = connected && controller.wireless;
  const usb = connected && !controller.wireless;

  return (
    <>
      <ConnectionPanel>
        <StatusIcon $connected={connected}>
          <LinkIcon active={connected} />
        </StatusIcon>
        <StatusDetail>
          <StatusLabel $active={connected}>
            {connected ? "Connected" : "Disconnected"}
          </StatusLabel>
          <StatusSub>
            <Dim>controller.</Dim>connection<Dim>.</Dim>state ={" "}
            {connected ? "true" : "false"}
          </StatusSub>
        </StatusDetail>

        <Separator />

        <TransportIcon $connected={usb}>
          <UsbIcon active={usb} />
        </TransportIcon>
        <StatusDetail>
          <StatusLabel $active={usb}>USB</StatusLabel>
          <StatusSub>wired</StatusSub>
        </StatusDetail>

        <TransportIcon $connected={wireless}>
          <BluetoothIcon active={wireless} />
        </TransportIcon>
        <StatusDetail>
          <StatusLabel $active={wireless}>Bluetooth</StatusLabel>
          <StatusSub>wireless</StatusSub>
        </StatusDetail>
      </ConnectionPanel>
      <InfoTable
        rows={[
          {
            label: "connection.state",
            value: connected ? "true" : "false",
            highlight: connected,
          },
          {
            label: "wireless",
            value: connected ? (controller.wireless ? "true" : "false") : "—",
            highlight: wireless,
          },
        ]}
      />
    </>
  );
};

/* ── Battery demo ────────────────────────────────────────── */

export const BatteryDemo: React.FC = () => {
  const controller = useContext(ControllerContext);
  const [, setTick] = useState(0);

  useEffect(() => {
    const onChange = () => setTick((t) => t + 1);
    controller.battery.on("change", onChange);
    return () => {
      controller.battery.removeListener("change", onChange);
    };
  }, [controller]);

  const level = controller.battery.level.state;
  const status = controller.battery.status.state;
  const isCharging =
    status === ChargeStatus.Charging || status === ChargeStatus.Full;

  const rows: RowData[] = [
    {
      label: "battery.level.state",
      value: level.toFixed(1),
      highlight: level > 0,
    },
    {
      label: "battery.status.state",
      value: chargeLabel(status),
      highlight: isCharging,
    },
  ];

  return <InfoTable rows={rows} />;
};

/* ── Color demo ──────────────────────────────────────────── */

export const ColorDemo: React.FC = () => {
  const controller = useContext(ControllerContext);
  const [factory, setFactory] = useState<FactoryInfo>(controller.factoryInfo);
  const [connected, setConnected] = useState(controller.connection.state);

  useEffect(() => {
    setConnected(controller.connection.state);
    setFactory(controller.factoryInfo);

    const onChange = () => setFactory(controller.factoryInfo);
    const onConn = ({ state }: { state: boolean }) => setConnected(state);

    controller.on("change", onChange);
    controller.connection.on("change", onConn);
    return () => {
      controller.removeListener("change", onChange);
      controller.connection.removeListener("change", onConn);
    };
  }, [controller]);

  const color = controller.color;
  const css = colorCss[factory.colorCode];
  const known = color !== DualsenseColor.Unknown;

  return (
    <>
      {connected && known && css && (
        <SwatchRow>
          <Swatch $color={css} />
          <SwatchLabel>
            <SwatchName>{factory.colorName}</SwatchName>
            <SwatchDetail>
              code {factory.colorCode} · {factory.boardRevision}
            </SwatchDetail>
          </SwatchLabel>
        </SwatchRow>
      )}
      <InfoTable
        rows={[
          {
            label: "color",
            value: connected ? String(color) : "—",
            highlight: connected && known,
          },
          {
            label: "factoryInfo.colorCode",
            value: connected ? factory.colorCode : "—",
          },
          {
            label: "factoryInfo.colorName",
            value: connected ? factory.colorName : "—",
            highlight: connected && known,
          },
          {
            label: "factoryInfo.boardRevision",
            value: connected ? factory.boardRevision : "—",
          },
        ]}
      />
    </>
  );
};

/* ── Serial demo ─────────────────────────────────────────── */

const SerialValue = styled.code`
  font-size: 16px;
  color: #f29e02;
  letter-spacing: 1px;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  display: block;
  text-align: center;
  margin: 16px 0;
  user-select: all;
`;

export const SerialDemo: React.FC = () => {
  const controller = useContext(ControllerContext);
  const [factory, setFactory] = useState<FactoryInfo>(controller.factoryInfo);
  const [connected, setConnected] = useState(controller.connection.state);

  useEffect(() => {
    setConnected(controller.connection.state);
    setFactory(controller.factoryInfo);

    const onChange = () => setFactory(controller.factoryInfo);
    const onConn = ({ state }: { state: boolean }) => setConnected(state);

    controller.on("change", onChange);
    controller.connection.on("change", onConn);
    return () => {
      controller.removeListener("change", onChange);
      controller.connection.removeListener("change", onConn);
    };
  }, [controller]);

  const serial = factory.serialNumber;
  const known = connected && serial !== "unknown";

  return (
    <>
      <SerialValue>
        {known ? serial : "—"}
      </SerialValue>
      <InfoTable
        rows={[
          {
            label: "serialNumber",
            value: known ? serial : "—",
            highlight: known,
          },
          {
            label: "factoryInfo.serialNumber",
            value: known ? serial : "—",
            highlight: known,
          },
        ]}
      />
    </>
  );
};

/* ── Firmware demo ───────────────────────────────────────── */

export const FirmwareDemo: React.FC = () => {
  const controller = useContext(ControllerContext);
  const [fw, setFw] = useState<FirmwareInfo>(controller.firmwareInfo);
  const [connected, setConnected] = useState(controller.connection.state);

  useEffect(() => {
    setConnected(controller.connection.state);
    setFw(controller.firmwareInfo);

    const onChange = () => setFw(controller.firmwareInfo);
    const onConn = ({ state }: { state: boolean }) => setConnected(state);

    controller.on("change", onChange);
    controller.connection.on("change", onConn);
    return () => {
      controller.removeListener("change", onChange);
      controller.connection.removeListener("change", onConn);
    };
  }, [controller]);

  const v = (ver: FirmwareVersion) => (connected ? fmtVersion(ver) : "—");
  const s = (val: string | number) =>
    connected ? String(val) : "—";

  const rows: RowData[] = [
    { label: "firmwareInfo.buildDate", value: s(fw.buildDate), highlight: connected && fw.buildDate !== "unknown" },
    { label: "firmwareInfo.buildTime", value: s(fw.buildTime) },
    { label: "firmwareInfo.firmwareType", value: s(fw.firmwareType) },
    { label: "firmwareInfo.softwareSeries", value: s(fw.softwareSeries) },
    { label: "firmwareInfo.hardwareInfo", value: connected ? `0x${(fw.hardwareInfo & 0xffff).toString(16).padStart(4, "0")}` : "—" },
    { label: "firmwareInfo.mainFirmwareVersion", value: v(fw.mainFirmwareVersion), highlight: connected },
    { label: "firmwareInfo.sblFirmwareVersion", value: v(fw.sblFirmwareVersion) },
    { label: "firmwareInfo.dspFirmwareVersion", value: s(fw.dspFirmwareVersion) },
    { label: "firmwareInfo.spiderDspFirmwareVersion", value: v(fw.spiderDspFirmwareVersion) },
    { label: "firmwareInfo.deviceInfo", value: s(fw.deviceInfo) },
    { label: "firmwareInfo.updateVersion", value: s(fw.updateVersion) },
    { label: "firmwareInfo.updateImageInfo", value: s(fw.updateImageInfo) },
  ];

  return <InfoTable rows={rows} />;
};

/* ── Factory demo ────────────────────────────────────────── */

export const FactoryDemo: React.FC = () => {
  const controller = useContext(ControllerContext);
  const [factory, setFactory] = useState<FactoryInfo>(controller.factoryInfo);
  const [connected, setConnected] = useState(controller.connection.state);

  useEffect(() => {
    setConnected(controller.connection.state);
    setFactory(controller.factoryInfo);

    const onChange = () => setFactory(controller.factoryInfo);
    const onConn = ({ state }: { state: boolean }) => setConnected(state);

    controller.on("change", onChange);
    controller.connection.on("change", onConn);
    return () => {
      controller.removeListener("change", onChange);
      controller.connection.removeListener("change", onConn);
    };
  }, [controller]);

  const s = (val: string) => (connected ? val : "—");

  const rows: RowData[] = [
    { label: "factoryInfo.serialNumber", value: s(factory.serialNumber), highlight: connected && factory.serialNumber !== "unknown" },
    { label: "factoryInfo.colorName", value: s(factory.colorName), highlight: connected && factory.colorName !== "unknown" },
    { label: "factoryInfo.colorCode", value: s(factory.colorCode) },
    { label: "factoryInfo.boardRevision", value: s(factory.boardRevision) },
  ];

  return <InfoTable rows={rows} />;
};
