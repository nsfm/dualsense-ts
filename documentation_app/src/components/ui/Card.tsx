import styled from "styled-components";

export const Card = styled.div<{ $interactive?: boolean }>`
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  padding: 16px;
  transition: border-color 0.15s, background 0.15s;

  ${(p) =>
    p.$interactive &&
    `
    cursor: pointer;
    &:hover {
      border-color: rgba(72, 175, 240, 0.3);
      background: rgba(0, 0, 0, 0.25);
    }
  `}
`;
