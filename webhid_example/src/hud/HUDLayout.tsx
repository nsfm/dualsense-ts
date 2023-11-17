import styled from "styled-components";

export const HUDLayout = styled.div`
  z-index: 10;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr 30% 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr;
`;
