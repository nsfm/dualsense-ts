import styled from "styled-components";

import {
  Reticle,
  ControllerConnection,
  Gyro,
  Debugger,
  BatteryIndicator,
  MuteLedControls,
} from "./hud";
import { RightStick } from "./hud/RightStick";
import { LeftShoulder, RightShoulder } from "./hud/ShoulderVisualization";
import { FaceButtons } from "./hud/FaceButtons";
import { DpadVisualization } from "./hud/DpadVisualization";
import { TouchpadVisualization } from "./hud/TouchpadVisualization";
import { CreateButton, OptionsButton, PsButton, MuteButton } from "./hud/UtilityButtons";
import { ControllerContext, controller } from "./Controller";

const AppContainer = styled.div.attrs({ className: "bp5-dark" })`
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const Sidebar = styled.aside`
  width: 280px;
  min-width: 280px;
  height: 100vh;
  overflow-y: auto;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(12px);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const StatusBar = styled.div`
  width: 100%;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  min-height: 48px;
`;

/**
 * Controller-shaped layout grid:
 *   L2/L1              R2/R1
 *   dpad  create tp options  buttons
 *      Lstick PS mute Rstick
 *              gyro
 */
const ControllerLayout = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr auto auto auto auto auto 1fr;
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
  max-width: 850px;
  width: 100%;
  margin: 0 auto;
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
`;

const TouchpadArea = styled.div`
  grid-area: tp;
`;

const OptionsArea = styled.div`
  grid-area: options;
  align-self: start;
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
  gap: 2px;
`;

const GyroArea = styled.div`
  grid-area: gyro;
`;

export const App = () => {
  return (
    <ControllerContext.Provider value={controller}>
      <AppContainer>
        <Sidebar>
          <Debugger />
        </Sidebar>
        <Main>
          <StatusBar>
            <ControllerConnection />
            <BatteryIndicator />
            <MuteLedControls />
          </StatusBar>
          <ControllerLayout>
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
            </CreateArea>
            <TouchpadArea>
              <TouchpadVisualization />
            </TouchpadArea>
            <OptionsArea>
              <OptionsButton />
            </OptionsArea>
            <RightUpper>
              <FaceButtons />
            </RightUpper>

            <LeftLower>
              <Reticle />
            </LeftLower>
            <PsMuteGroup>
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
        </Main>
      </AppContainer>
    </ControllerContext.Provider>
  );
};
