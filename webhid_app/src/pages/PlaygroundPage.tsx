import React from "react";
import styled from "styled-components";
import { ControllerContext } from "../controller";
import { useManagerState } from "../hooks/useManagerState";
import { Button } from "../components/ui";
import {
  Reticle,
  RightStick,
  LeftShoulder,
  RightShoulder,
  FaceButtons,
  DpadVisualization,
  TouchpadVisualization,
  CreateButton,
  OptionsButton,
  PsButton,
  MuteButton,
  LeftRumble,
  RightRumble,
  LightbarStrip,
  PlayerLedBar,
  Gyro,
  BatteryIndicator,
  MuteLedControls,
  AudioIndicator,
  ColorIndicator,
  LightbarFadeButtons,
  Debugger,
} from "../components/hud";

const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const Header = styled.div`
  padding: 0 0 16px;
`;

const Title = styled.h1`
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: rgba(191, 204, 214, 0.6);
  font-size: 15px;
  margin: 0;
`;

const StatusBar = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
`;

const DropdownPanel = styled.div`
  width: 100%;
  padding: 12px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  margin-bottom: 16px;
`;

const ScaleContainer = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const BASE_W = 850;
const BASE_H = 600;

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
  width: ${BASE_W}px;
  transform-origin: 0 0;
`;

const LeftShoulderArea = styled.div` grid-area: l-shoulder; `;
const RightShoulderArea = styled.div` grid-area: r-shoulder; `;
const LeftUpper = styled.div` grid-area: l-upper; `;
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
const RightUpper = styled.div` grid-area: r-upper; `;
const LeftLower = styled.div` grid-area: l-lower; `;
const RightLower = styled.div` grid-area: r-lower; `;
const PsMuteGroup = styled.div`
  grid-area: ps;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;
const GyroArea = styled.div` grid-area: gyro; `;

const PlaygroundPage: React.FC = () => {
  const { controllers } = useManagerState();
  const [panel, setPanel] = React.useState<"triggers" | "audio" | "debug" | null>(null);
  const [scale, setScale] = React.useState(1);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const controller = React.useContext(ControllerContext);
  const connected = controller.connection.state;

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
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

  const togglePanel = (p: "triggers" | "audio" | "debug") =>
    setPanel((cur) => (cur === p ? null : p));

  return (
    <Page>
      <Header>
        <Title>Playground</Title>
        <Subtitle>
          Full controller visualization with all features. Connect a
          controller and explore — if you have multiple controllers
          connected, select the active one from the top bar.
        </Subtitle>
      </Header>

      {connected && (
        <StatusBar>
          <BatteryIndicator />
          <MuteLedControls />
          <AudioIndicator />
          <ColorIndicator />
          <LightbarFadeButtons />
          <Button $small $active={panel === "triggers"} onClick={() => togglePanel("triggers")}>
            Trigger FX
          </Button>
          <Button $small $active={panel === "audio"} onClick={() => togglePanel("audio")}>
            Audio
          </Button>
          <Button $small $active={panel === "debug"} onClick={() => togglePanel("debug")}>
            Debug
          </Button>
        </StatusBar>
      )}

      {panel && (
        <DropdownPanel>
          <Debugger panel={panel} />
        </DropdownPanel>
      )}

      <ScaleContainer ref={containerRef}>
        <div style={{
          width: BASE_W * scale,
          height: BASE_H * scale,
        }}>
          <ControllerLayout
            $dimmed={!connected}
            style={{ transform: `scale(${scale})` }}
          >
            <LeftShoulderArea><LeftShoulder /></LeftShoulderArea>
            <RightShoulderArea><RightShoulder /></RightShoulderArea>

            <LeftUpper><DpadVisualization /></LeftUpper>
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
            <RightUpper><FaceButtons /></RightUpper>

            <LeftLower><Reticle /></LeftLower>
            <PsMuteGroup>
              <PlayerLedBar />
              <PsButton />
              <MuteButton />
            </PsMuteGroup>
            <RightLower><RightStick /></RightLower>

            <GyroArea><Gyro /></GyroArea>
          </ControllerLayout>
        </div>
      </ScaleContainer>
    </Page>
  );
};

export default PlaygroundPage;
