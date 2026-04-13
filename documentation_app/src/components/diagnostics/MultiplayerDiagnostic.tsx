import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import type { Dualsense } from "dualsense-ts";
import { ChargeStatus } from "dualsense-ts";
import { useManagerState } from "../../hooks/useManagerState";
import { requestPermission, manager } from "../../controller";
import { Button } from "../ui";

/* ── Layout ──────────────────────────────────────────────── */

const Panel = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  overflow: hidden;
  margin: 16px 0;
`;

const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: 36px 1fr 80px 80px 1fr 28px;
  gap: 12px;
  align-items: center;
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.18);
`;

const HeaderCell = styled.span`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(191, 204, 214, 0.3);
`;

const SlotRow = styled.div<{ $even?: boolean; $connected: boolean }>`
  display: grid;
  grid-template-columns: 36px 1fr 80px 80px 1fr 28px;
  gap: 12px;
  align-items: center;
  padding: 10px 16px;
  background: ${(p) =>
    p.$even ? "rgba(0, 0, 0, 0.12)" : "rgba(0, 0, 0, 0.06)"};
  opacity: ${(p) => (p.$connected ? 1 : 0.35)};
  transition: opacity 0.3s;
`;

const EmptyState = styled.div`
  padding: 32px 16px;
  text-align: center;
  color: rgba(191, 204, 214, 0.35);
  font-size: 13px;
  background: rgba(0, 0, 0, 0.06);
`;

/* ── Slot index badge ────────────────────────────────────── */

const SlotBadge = styled.div<{ $connected: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  background: ${(p) =>
    p.$connected ? "rgba(72, 175, 240, 0.15)" : "rgba(255, 255, 255, 0.04)"};
  border: 1px solid ${(p) =>
    p.$connected ? "rgba(72, 175, 240, 0.3)" : "rgba(255, 255, 255, 0.08)"};
  color: ${(p) =>
    p.$connected ? "#48aff0" : "rgba(191, 204, 214, 0.3)"};
`;

/* ── Color swatch + name ─────────────────────────────────── */

const colorCss: Record<string, string> = {
  "00": "#e8e8e8", "01": "#1a1a2e", "02": "#c8102e", "03": "#f2a6c0",
  "04": "#6b3fa0", "05": "#5b9bd5", "06": "#8a9a7b", "07": "#9b2335",
  "08": "#c0c0c0", "09": "#1e3a5f", "10": "#2db5a0", "11": "#3d4f7c",
  "12": "#e8dfd0", "30": "#4a4a4a",
};

const IdentityCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

const ColorDot = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  border: 1px solid rgba(255, 255, 255, 0.25);
  flex-shrink: 0;
`;

const IdentityName = styled.span`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.85);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/* ── Transport icon ──────────────────────────────────────── */

const TransportCell = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const TransportSvg = styled.svg`
  fill: rgba(191, 204, 214, 0.6);
  flex-shrink: 0;
`;

const TransportLabel = styled.span`
  font-size: 12px;
  color: rgba(191, 204, 214, 0.6);
`;

/* ── Battery ─────────────────────────────────────────────── */

const BatteryCell = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const BatteryBar = styled.div`
  width: 32px;
  height: 12px;
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
`;

const BatteryFill = styled.div<{ $pct: number; $charging: boolean }>`
  height: 100%;
  width: ${(p) => p.$pct}%;
  background: ${(p) => {
    if (p.$charging) return "#48aff0";
    if (p.$pct <= 20) return "#db3737";
    if (p.$pct <= 40) return "#f29e02";
    return "#3dcc91";
  }};
  transition: width 0.3s, background 0.3s;
`;

const BatteryLabel = styled.span`
  font-size: 12px;
  color: rgba(191, 204, 214, 0.6);
  min-width: 3ch;
`;

/* ── Serial ──────────────────────────────────────────────── */

const SerialCell = styled.code`
  font-size: 11px;
  color: rgba(191, 204, 214, 0.45);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
`;

/* ── Release button ─────────────────────────────────────── */

const ReleaseButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  color: rgba(191, 204, 214, 0.3);
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s, background 0.15s, border-color 0.15s;
  padding: 0;

  &:hover {
    color: #db3737;
    background: rgba(219, 55, 55, 0.1);
    border-color: rgba(219, 55, 55, 0.3);
  }
`;

/* ── Connect footer ─────────────────────────────────────── */

const ConnectFooter = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(72, 175, 240, 0.04);
  color: rgba(72, 175, 240, 0.7);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: rgba(72, 175, 240, 0.1);
    color: #48aff0;
  }
`;

/* ── Snapshot of a slot for retention ────────────────────── */

interface SlotSnapshot {
  index: number;
  connected: boolean;
  wireless: boolean;
  colorCode: string;
  colorName: string;
  batteryPct: number;
  charging: boolean;
  serial: string;
}

function snapshotController(controller: Dualsense, index: number): SlotSnapshot {
  const connected = controller.connection.state;
  const factory = controller.factoryInfo;
  const level = controller.battery.level.state;
  const status = controller.battery.status.state;
  return {
    index,
    connected,
    wireless: connected ? controller.wireless : false,
    colorCode: factory.colorCode,
    colorName: factory.colorName !== "unknown" ? factory.colorName : "Unknown",
    batteryPct: Math.round(level * 100),
    charging: status === ChargeStatus.Charging || status === ChargeStatus.Full,
    serial: factory.serialNumber !== "unknown" ? factory.serialNumber : "—",
  };
}

/* ── Main component ──────────────────────────────────────── */

export const MultiplayerDemo: React.FC = () => {
  const { controllers } = useManagerState();
  const [slots, setSlots] = useState<SlotSnapshot[]>([]);
  const controllersRef = useRef(controllers);
  controllersRef.current = controllers;

  // Update snapshots on change events and periodically
  useEffect(() => {
    const update = () => {
      const current = controllersRef.current;
      // The manager already retains disconnected controllers in their
      // slots — just snapshot what it reports. Released slots disappear.
      setSlots(current.map((c, i) => snapshotController(c, i)));
    };

    update();
    const interval = setInterval(update, 500);
    return () => clearInterval(interval);
  }, [controllers.length]);

  // Also re-snapshot when individual controllers fire changes
  useEffect(() => {
    const handlers: Array<() => void> = [];
    controllers.forEach((c) => {
      const onChange = () => {
        setSlots((prev) =>
          prev.map((s, i) =>
            controllers[i] === c ? snapshotController(c, i) : s,
          ),
        );
      };
      c.on("change", onChange);
      c.connection.on("change", onChange);
      handlers.push(() => {
        c.removeListener("change", onChange);
        c.connection.removeListener("change", onChange);
      });
    });
    return () => handlers.forEach((h) => h());
  }, [controllers]);

  return (
    <Panel>
      <HeaderRow>
        <HeaderCell>#</HeaderCell>
        <HeaderCell>controller</HeaderCell>
        <HeaderCell>transport</HeaderCell>
        <HeaderCell>battery</HeaderCell>
        <HeaderCell>serial</HeaderCell>
        <HeaderCell />
      </HeaderRow>
      {slots.length === 0 ? (
        <EmptyState>
          {manager ? (
            <>
              No controllers connected.{" "}
              <Button $small onClick={requestPermission} style={{ marginLeft: 8 }}>
                Connect
              </Button>
            </>
          ) : (
            "WebHID not available in this browser."
          )}
        </EmptyState>
      ) : (
        slots.map((slot, i) => {
          const css = colorCss[slot.colorCode];
          return (
            <SlotRow key={i} $even={i % 2 === 1} $connected={slot.connected}>
              <SlotBadge $connected={slot.connected}>{slot.index + 1}</SlotBadge>

              <IdentityCell>
                {css && <ColorDot $color={css} />}
                <IdentityName>
                  {slot.colorName}
                </IdentityName>
              </IdentityCell>

              <TransportCell>
                {slot.wireless ? (
                  <TransportSvg width="14" height="14" viewBox="0 0 24 24">
                    <path d="M17.71 7.71 12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z" />
                  </TransportSvg>
                ) : (
                  <TransportSvg width="14" height="14" viewBox="0 0 24 24">
                    <path d="M15 7v4h1v2h-3V5h2l-3-4-3 4h2v8H8v-2.07A1.993 1.993 0 0 0 8 7a2 2 0 0 0-4 0c0 .74.4 1.38 1 1.73V13a2 2 0 0 0 2 2h3v2.27c-.6.35-1 .99-1 1.73a2 2 0 0 0 4 0c0-.74-.4-1.38-1-1.73V15h3a2 2 0 0 0 2-2v-2h1V7h-3z" />
                  </TransportSvg>
                )}
                <TransportLabel>
                  {slot.connected
                    ? slot.wireless ? "BT" : "USB"
                    : "—"}
                </TransportLabel>
              </TransportCell>

              <BatteryCell>
                <BatteryBar>
                  <BatteryFill
                    $pct={slot.connected ? slot.batteryPct : 0}
                    $charging={slot.charging}
                  />
                </BatteryBar>
                <BatteryLabel>
                  {slot.connected ? `${slot.batteryPct}%` : "—"}
                </BatteryLabel>
              </BatteryCell>

              <SerialCell>{slot.connected ? slot.serial : slot.serial}</SerialCell>

              <ReleaseButton
                title="Release slot"
                onClick={() => manager?.release(slot.index)}
              >
                ✕
              </ReleaseButton>
            </SlotRow>
          );
        })
      )}
      {manager && (
        <ConnectFooter onClick={requestPermission}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          Connect Controller
        </ConnectFooter>
      )}
    </Panel>
  );
};
