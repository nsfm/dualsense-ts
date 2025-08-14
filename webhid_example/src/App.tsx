import styled from "styled-components";

import {
  Reticle,
  ControllerConnection,
  Gyro,
  Debugger,
  HUDLayout,
  Shader,
  Editor,
} from "./hud";
import { ControllerContext, controller } from "./Controller";

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #000000;
`;

export const App = () => {
  return (
    <ControllerContext.Provider value={controller}>
      <AppContainer className="AppContainer">
        <HUDLayout>
          <Shader />
          <Reticle />
          <Gyro />
          <ControllerConnection />
          <Debugger />
          <Editor />
        </HUDLayout>
      </AppContainer>
    </ControllerContext.Provider>
  );
};
