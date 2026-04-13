import React from "react";
import styled from "styled-components";
import type { Dualsense } from "dualsense-ts";
import { ChargeStatus } from "dualsense-ts";
import { ManagerContext, requestPermission, hasWebHID } from "../../controller";

const Bar = styled.header`
  width: 100%;
  height: 48px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.25);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
  z-index: 10;
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #bfccd6;
  font-size: 20px;
  cursor: pointer;
  padding: 4px;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Brand = styled.a`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #48aff0;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    text-decoration: none;
    opacity: 0.85;
  }
`;

const GhIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="currentColor"
    style={{ display: "block" }}
  >
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

const Spacer = styled.div`
  flex: 1;
`;

const PlayerTabBar = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const PlayerTab = styled.button<{ $active?: boolean; $connected?: boolean }>`
  background: ${(p) =>
    p.$active ? "rgba(72, 175, 240, 0.25)" : "rgba(255, 255, 255, 0.04)"};
  border: 1px solid
    ${(p) =>
      p.$active ? "rgba(72, 175, 240, 0.5)" : "rgba(255, 255, 255, 0.1)"};
  border-radius: 3px;
  color: ${(p) => (p.$connected ? "#bfccd6" : "rgba(255, 255, 255, 0.3)")};
  font-size: 11px;
  font-weight: 500;
  padding: 3px 10px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    background: rgba(72, 175, 240, 0.15);
  }
`;

const ConnectionDot = styled.span<{ $connected?: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${(p) =>
    p.$connected ? "#3dcc91" : "rgba(255, 255, 255, 0.15)"};
  display: inline-block;
  flex-shrink: 0;
`;

const AddButton = styled.button`
  background: rgba(255, 255, 255, 0.04);
  border: 1px dashed rgba(255, 255, 255, 0.15);
  border-radius: 3px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 13px;
  padding: 2px 8px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: rgba(72, 175, 240, 0.1);
    color: #48aff0;
    border-color: rgba(72, 175, 240, 0.3);
  }
`;

const ConnectButton = styled.button`
  background: rgba(72, 175, 240, 0.15);
  border: 1px solid rgba(72, 175, 240, 0.4);
  border-radius: 3px;
  color: #48aff0;
  font-size: 12px;
  font-weight: 500;
  padding: 5px 14px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: rgba(72, 175, 240, 0.25);
  }
`;

const DocsOnlyBadge = styled.span`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  padding: 3px 8px;
`;

const SmallBattery: React.FC<{ controller: Dualsense }> = ({ controller }) => {
  const [level, setLevel] = React.useState(controller.battery.level.state);
  const [status, setStatus] = React.useState(controller.battery.status.state);

  React.useEffect(() => {
    setLevel(controller.battery.level.state);
    setStatus(controller.battery.status.state);
    const onLevel = ({ state }: { state: number }) => setLevel(state);
    const onStatus = ({ state }: { state: ChargeStatus }) => setStatus(state);
    controller.battery.level.on("change", onLevel);
    controller.battery.status.on("change", onStatus);
    return () => {
      controller.battery.level.removeListener("change", onLevel);
      controller.battery.status.removeListener("change", onStatus);
    };
  }, [controller]);

  if (!controller.connection.state) return null;

  const isCharging =
    status === ChargeStatus.Charging || status === ChargeStatus.Full;
  const color =
    isCharging
      ? "#3dcc91"
      : level < 0.2
        ? "#ff6b6b"
        : "currentColor";

  return (
    <svg
      width="14"
      height="8"
      viewBox="0 0 14 8"
      style={{ display: "block", opacity: 0.7 }}
    >
      <rect
        x="0.5"
        y="0.5"
        width="10.5"
        height="7"
        rx="1"
        fill="none"
        stroke={color}
        strokeWidth="0.8"
      />
      <rect x="11.5" y="2" width="1.5" height="4" rx="0.5" fill={color} />
      <rect
        x="1.5"
        y="1.5"
        width={Math.max(0, level * 8.5)}
        height="5"
        rx="0.5"
        fill={color}
        opacity={0.5}
      />
      {isCharging && (
        <path
          d="M6.5 1 L4.5 4.2 L6 4.2 L5.2 7 L7.5 3.5 L6 3.5 L7 1Z"
          fill={color}
          opacity={0.9}
        />
      )}
    </svg>
  );
};

interface TopBarProps {
  controllers: readonly Dualsense[];
  selectedIndex: number;
  onSelectController: (index: number) => void;
  onToggleSidebar: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  controllers,
  selectedIndex,
  onSelectController,
  onToggleSidebar,
}) => {
  const manager = React.useContext(ManagerContext);

  return (
    <Bar>
      <MenuButton onClick={onToggleSidebar} aria-label="Toggle navigation">
        &#9776;
      </MenuButton>
      <Brand
        href="https://github.com/nsfm/dualsense-ts"
        target="_blank"
        rel="noopener noreferrer"
      >
        <GhIcon />
        dualsense-ts
      </Brand>

      <Spacer />

      {!hasWebHID ? (
        <DocsOnlyBadge title="WebHID is not available in this browser. Live demos require Chrome 89+, Edge 89+, or Opera 75+.">
          Docs only — no WebHID
        </DocsOnlyBadge>
      ) : controllers.length > 0 ? (
        <PlayerTabBar>
          {controllers.map((c, i) => (
            <PlayerTab
              key={i}
              $active={i === selectedIndex}
              $connected={c.connection.state}
              onClick={() => onSelectController(i)}
            >
              <ConnectionDot $connected={c.connection.state} />P{i + 1}
              <SmallBattery controller={c} />
            </PlayerTab>
          ))}
          <AddButton onClick={requestPermission} title="Add controller">
            +
          </AddButton>
        </PlayerTabBar>
      ) : (
        <ConnectButton onClick={requestPermission}>
          Connect Controller
        </ConnectButton>
      )}
    </Bar>
  );
};
