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
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const Visualizations = styled.div`
  display: flex;
  gap: 48px;
  align-items: center;
  justify-content: center;
  flex: 1;
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
          <Visualizations>
            <Reticle />
            <Gyro />
            <RightStick />
          </Visualizations>
        </Main>
      </AppContainer>
    </ControllerContext.Provider>
  );
};
