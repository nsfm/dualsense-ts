import styled from "styled-components";

/**
 * Zdog HUD elements can calculate their own size and
 * use this create an appropriately sized container.
 */
export const RenderedElement = styled.div<{
  width: number;
  height: number;
}>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;
