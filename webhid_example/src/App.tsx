import React from "react";
import styled from "styled-components";
import type { Dualsense } from "dualsense-ts";

import {
  Reticle,
  ControllerConnection,
  Gyro,
  BatteryIndicator,
  MuteLedControls,
} from "./hud";
import { AudioIndicator } from "./hud/AudioIndicator";
import { Debugger } from "./hud/Debugger";
import { RightStick } from "./hud/RightStick";
import { LeftShoulder, RightShoulder } from "./hud/ShoulderVisualization";
import { FaceButtons } from "./hud/FaceButtons";
import { DpadVisualization } from "./hud/DpadVisualization";
import { TouchpadVisualization } from "./hud/TouchpadVisualization";
import {
  CreateButton,
  OptionsButton,
  PsButton,
  MuteButton,
} from "./hud/UtilityButtons";
import { LeftRumble, RightRumble } from "./hud/RumbleControl";
import { LightbarStrip } from "./hud/LightbarStrip";
import { LightbarFadeButtons } from "./hud/LightbarFadeButtons";
import { PlayerLedBar } from "./hud/PlayerLedBar";
import {
  ControllerContext,
  ManagerContext,
  manager,
  hasWebHID,
  requestPermission,
} from "./Controller";

const AppContainer = styled.div.attrs({ className: "bp5-dark" })`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  user-select: none;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const StatusBar = styled.div`
  width: 100%;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  min-height: 48px;
  flex-shrink: 0;
  position: relative;
`;

const BrandBar = styled.div`
  display: none;
  width: 100%;
  justify-content: center;
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.15);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  flex-shrink: 0;

  @media (max-width: 720px) {
    display: flex;
  }
`;

const BrandLinkBase = styled.a`
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(72, 175, 240, 0.08);
  border: 1px solid rgba(72, 175, 240, 0.2);
  border-radius: 10px;
  padding: 3px 10px 3px 6px;
  color: #48aff0;
  font-size: 11px;
  font-weight: 500;
  text-decoration: none;
  transition: background 0.15s;
  white-space: nowrap;

  &:hover {
    background: rgba(72, 175, 240, 0.15);
    text-decoration: none;
    color: #48aff0;
  }
`;

const InlineBrand = styled(BrandLinkBase)`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;

  @media (max-width: 860px) {
    display: none;
  }
`;

const TopBrand = styled(BrandLinkBase)`
  display: none;

  @media (max-width: 860px) {
    display: flex;
  }
`;

const GhIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="currentColor"
    style={{ display: "block" }}
  >
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

const ToolbarBtn = styled.button<{ $active?: boolean }>`
  background: ${(p) =>
    p.$active ? "rgba(72, 175, 240, 0.2)" : "rgba(72, 175, 240, 0.06)"};
  border: 1px solid
    ${(p) =>
      p.$active ? "rgba(72, 175, 240, 0.5)" : "rgba(72, 175, 240, 0.2)"};
  border-radius: 3px;
  color: #48aff0;
  font-size: 10px;
  padding: 3px 8px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: rgba(72, 175, 240, 0.2);
  }
`;

const DropdownPanel = styled.div`
  width: 100%;
  padding: 12px 24px;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
`;

/**
 * Controller-shaped layout grid:
 *   L2/L1              R2/R1
 *   dpad  create tp options  buttons
 *      Lstick PS mute Rstick
 *              gyro
 */
const ScaleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ControllerLayout = styled.div<{ $dimmed?: boolean }>`
  opacity: ${(p) => (p.$dimmed ? 0.15 : 1)};
  pointer-events: ${(p) => (p.$dimmed ? "none" : "auto")};
  transition: opacity 0.4s;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto auto auto auto minmax(0, 1fr);
  grid-template-rows: auto auto auto auto;
  grid-template-areas:
    "l-shoulder  .       gyro   gyro   gyro    .        r-shoulder"
    "l-upper     create  tp     tp     tp      options  r-upper"
    ".           l-lower .      ps     .       r-lower  ."
    ".           .       .      .      .       .        .";
  gap: 0px 2px;
  align-items: center;
  align-content: center;
  justify-items: center;
  padding: 8px 12px;
  width: 850px;
  transform-origin: center center;
`;

const LeftShoulderArea = styled.div`
  grid-area: l-shoulder;
`;

const RightShoulderArea = styled.div`
  grid-area: r-shoulder;
`;

const LeftUpper = styled.div`
  grid-area: l-upper;
`;

const CreateArea = styled.div`
  grid-area: create;
  align-self: start;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const TouchpadArea = styled.div`
  grid-area: tp;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
`;

const OptionsArea = styled.div`
  grid-area: options;
  align-self: start;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const RightUpper = styled.div`
  grid-area: r-upper;
`;

const LeftLower = styled.div`
  grid-area: l-lower;
`;

const RightLower = styled.div`
  grid-area: r-lower;
`;

const PsMuteGroup = styled.div`
  grid-area: ps;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const GyroArea = styled.div`
  grid-area: gyro;
`;

const FallbackContainer = styled.div.attrs({ className: "bp5-dark" })`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  gap: clamp(12px, 3vw, 24px);
  padding: clamp(16px, 4vw, 32px);
  text-align: center;
`;

const FallbackTitle = styled.h1`
  font-size: clamp(20px, 4vw, 28px);
  font-weight: 600;
  opacity: 0.9;
  margin: 0;
`;

const FallbackText = styled.p`
  font-size: clamp(12px, 2vw, 14px);
  opacity: 0.6;
  max-width: min(480px, 100%);
  line-height: 1.6;
  margin: 0;
  word-wrap: break-word;
`;

const FallbackLink = styled.a`
  color: #48aff0;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const BrowserList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px 16px;
  font-size: 13px;
  opacity: 0.5;
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
  font-weight: 400;
  padding: 2px 8px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: rgba(72, 175, 240, 0.1);
    color: #48aff0;
    border-color: rgba(72, 175, 240, 0.3);
  }
`;

const WebHIDFallback = () => (
  <FallbackContainer>
    <FallbackTitle>WebHID Not Available</FallbackTitle>
    <FallbackText>
      This demo requires the WebHID API to communicate with a DualSense
      controller. Your current browser does not support WebHID.
    </FallbackText>
    <FallbackText>Compatible browsers:</FallbackText>
    <BrowserList>
      <li>Chrome 89+</li>
      <li>Edge 89+</li>
      <li>Opera 75+</li>
    </BrowserList>
    <FallbackText>
      <FallbackLink
        href="https://github.com/nsfm/dualsense-ts"
        target="_blank"
        rel="noopener noreferrer"
      >
        github.com/nsfm/dualsense-ts
      </FallbackLink>
    </FallbackText>
  </FallbackContainer>
);

/** Hook that re-renders when the manager's player list changes */
function useManagerState() {
  const [controllers, setControllers] = React.useState<readonly Dualsense[]>(
    manager?.controllers ?? [],
  );
  const [activeCount, setActiveCount] = React.useState(
    manager?.state.active ?? 0,
  );

  React.useEffect(() => {
    const m = manager;
    if (!m) return;
    const update = () => {
      setControllers([...m.controllers]);
      setActiveCount(m.state.active);
    };
    m.on("change", update);
    const interval = setInterval(update, 500);
    return () => clearInterval(interval);
  }, []);

  return { controllers, activeCount };
}

export const App = () => {
  const { controllers } = useManagerState();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [panel, setPanel] = React.useState<"triggers" | "debug" | null>(null);
  const [scale, setScale] = React.useState(1);
  const mainRef = React.useRef<HTMLElement>(null);

  // The currently selected controller (or a disconnected placeholder)
  const selected: Dualsense | undefined = controllers[selectedIndex];
  const connected = selected?.connection.state ?? false;

  // Auto-select newly connected controller if none is selected yet
  React.useEffect(() => {
    if (!selected && controllers.length > 0) {
      setSelectedIndex(0);
    }
  }, [controllers.length, selected]);

  React.useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const BASE_W = 850;
    const BASE_H = 600;
    const update = () => {
      const sw = el.clientWidth / BASE_W;
      const sh = el.clientHeight / BASE_H;
      setScale(Math.min(sw, sh, 1.6));
    };
    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();
    return () => ro.disconnect();
  }, []);

  const togglePanel = (p: "triggers" | "debug") =>
    setPanel((cur) => (cur === p ? null : p));

  if (!hasWebHID || !manager) {
    return <WebHIDFallback />;
  }

  // Status bar context: the selected controller (remounts on tab switch via key)
  const statusBarController =
    selected ??
    (new (require("dualsense-ts").Dualsense)({ hid: null }) as Dualsense);

  return (
    <ManagerContext.Provider value={manager}>
      <AppContainer>
        <BrandBar>
          <TopBrand
            href="https://github.com/nsfm/dualsense-ts"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GhIcon />
            dualsense-ts
          </TopBrand>
        </BrandBar>
        <StatusBar>
          <InlineBrand
            href="https://github.com/nsfm/dualsense-ts"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GhIcon />
            dualsense-ts
          </InlineBrand>

          {controllers.length > 0 && (
            <PlayerTabBar>
              {controllers.map((c, i) => (
                <PlayerTab
                  key={i}
                  $active={i === selectedIndex}
                  $connected={c.connection.state}
                  onClick={() => setSelectedIndex(i)}
                >
                  <ConnectionDot $connected={c.connection.state} />P{i + 1}
                </PlayerTab>
              ))}
              <AddButton onClick={requestPermission} title="Add controllers">
                +
              </AddButton>
            </PlayerTabBar>
          )}

          {/* Status bar components can remount safely (no canvas/SVG) */}
          <ControllerContext.Provider
            key={selectedIndex}
            value={statusBarController}
          >
            <ControllerConnection />
            <BatteryIndicator />
            <MuteLedControls />
            <AudioIndicator />
            <LightbarFadeButtons />
            {connected && (
              <>
                <ToolbarBtn
                  $active={panel === "triggers"}
                  onClick={() => togglePanel("triggers")}
                >
                  Trigger FX
                </ToolbarBtn>
                <ToolbarBtn
                  $active={panel === "debug"}
                  onClick={() => togglePanel("debug")}
                >
                  Debug
                </ToolbarBtn>
              </>
            )}
          </ControllerContext.Provider>
        </StatusBar>
        {panel && (
          <DropdownPanel>
            <ControllerContext.Provider
              key={selectedIndex}
              value={statusBarController}
            >
              <Debugger panel={panel} />
            </ControllerContext.Provider>
          </DropdownPanel>
        )}
        <Main ref={mainRef}>
          {/*
           * Render one HUD per controller, show/hide with CSS.
           * react-zdog Illustration components don't survive remounting,
           * so each HUD stays mounted and subscribed to its own controller.
           */}
          {controllers.map((c, i) => (
            <ControllerContext.Provider key={i} value={c}>
              <ScaleWrapper
                style={{
                  width: 850 * scale,
                  height: 600 * scale,
                  display: i === selectedIndex ? undefined : "none",
                }}
              >
                <ControllerLayout
                  $dimmed={!c.connection.state}
                  style={{ transform: `scale(${scale})` }}
                >
                  <LeftShoulderArea>
                    <LeftShoulder />
                  </LeftShoulderArea>
                  <RightShoulderArea>
                    <RightShoulder />
                  </RightShoulderArea>

                  <LeftUpper>
                    <DpadVisualization />
                  </LeftUpper>
                  <CreateArea>
                    <CreateButton />
                    <LeftRumble />
                  </CreateArea>
                  <TouchpadArea>
                    <LightbarStrip />
                    <TouchpadVisualization />
                  </TouchpadArea>
                  <OptionsArea>
                    <OptionsButton />
                    <RightRumble />
                  </OptionsArea>
                  <RightUpper>
                    <FaceButtons />
                  </RightUpper>

                  <LeftLower>
                    <Reticle />
                  </LeftLower>
                  <PsMuteGroup>
                    <PlayerLedBar />
                    <PsButton />
                    <MuteButton />
                  </PsMuteGroup>
                  <RightLower>
                    <RightStick />
                  </RightLower>

                  <GyroArea>
                    <Gyro />
                  </GyroArea>
                </ControllerLayout>
              </ScaleWrapper>
            </ControllerContext.Provider>
          ))}
          {controllers.length === 0 && (
            <ScaleWrapper style={{ width: 850 * scale, height: 600 * scale }}>
              <ControllerLayout
                $dimmed
                style={{ transform: `scale(${scale})` }}
              >
                <LeftShoulderArea>
                  <LeftShoulder />
                </LeftShoulderArea>
                <RightShoulderArea>
                  <RightShoulder />
                </RightShoulderArea>

                <LeftUpper>
                  <DpadVisualization />
                </LeftUpper>
                <CreateArea>
                  <CreateButton />
                  <LeftRumble />
                </CreateArea>
                <TouchpadArea>
                  <LightbarStrip />
                  <TouchpadVisualization />
                </TouchpadArea>
                <OptionsArea>
                  <OptionsButton />
                  <RightRumble />
                </OptionsArea>
                <RightUpper>
                  <FaceButtons />
                </RightUpper>

                <LeftLower>
                  <Reticle />
                </LeftLower>
                <PsMuteGroup>
                  <PlayerLedBar />
                  <PsButton />
                  <MuteButton />
                </PsMuteGroup>
                <RightLower>
                  <RightStick />
                </RightLower>

                <GyroArea>
                  <Gyro />
                </GyroArea>
              </ControllerLayout>
            </ScaleWrapper>
          )}
        </Main>
      </AppContainer>
    </ManagerContext.Provider>
  );
};
