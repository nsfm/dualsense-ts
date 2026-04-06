import { useContext, useEffect, useState } from "react";
import { Tag } from "@blueprintjs/core";
import styled from "styled-components";
import type { FactoryInfo } from "dualsense-ts";

import { ControllerContext } from "../Controller";

/** Approximate CSS colors for known DualSense body colors */
const colorCss: Record<string, string> = {
  "00": "#e8e8e8",
  "01": "#1a1a2e",
  "02": "#c8102e",
  "03": "#f2a6c0",
  "04": "#6b3fa0",
  "05": "#5b9bd5",
  "06": "#8a9a7b",
  "07": "#9b2335",
  "08": "#c0c0c0",
  "09": "#1e3a5f",
  "10": "#2db5a0",
  "11": "#3d4f7c",
  "12": "#e8dfd0",
  "30": "#4a4a4a",
};

const ColorDot = styled.span<{ $color: string }>`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  border: 1px solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
`;

export const ColorIndicator = () => {
  const controller = useContext(ControllerContext);
  const [factory, setFactory] = useState<FactoryInfo | undefined>(
    controller.factoryInfo
  );
  const [connected, setConnected] = useState(controller.connection.state);

  useEffect(() => {
    controller.on("change", (c) => {
      if (!factory && c.factoryInfo) {
        setFactory(c.factoryInfo);
      }
    });
    controller.connection.on("change", ({ state }) => {
      setConnected(state);
      if (!state) setFactory(undefined);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!connected || !factory) return null;

  const css = colorCss[factory.colorCode];
  const label = factory.colorName ?? factory.colorCode;

  return (
    <Tag
      minimal={true}
      intent="none"
      icon={css ? <ColorDot $color={css} /> : undefined}
      title={`Controller color: ${label}${factory.boardRevision ? ` (${factory.boardRevision})` : ""}`}
    >
      {label}
    </Tag>
  );
};
