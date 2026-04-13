import React from "react";
import styled from "styled-components";

import { ControllerContext } from "../../controller";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin-top: 6px;
`;

const VisLabel = styled.span`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.35;
`;

const HintLabel = styled.span`
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.25;
`;

const BAR_WIDTH = 22;
const BAR_HEIGHT = 48;
const INACTIVE = "#48aff0";
const ACTIVE = "#f29e02";

interface RumbleBarProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
}

const RumbleBar = ({ value, onChange, label }: RumbleBarProps) => {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const dragging = React.useRef(false);

  const valueFromEvent = React.useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const clamped = Math.max(0, Math.min(1, 1 - y / rect.height));
      const stepped = Math.round(clamped * 20) / 20;
      onChange(stepped);
    },
    [onChange]
  );

  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      dragging.current = true;
      valueFromEvent(e);
      const handleMove = (ev: MouseEvent) => {
        if (dragging.current) valueFromEvent(ev);
      };
      const handleUp = () => {
        dragging.current = false;
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
      };
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
    },
    [valueFromEvent]
  );

  const fillHeight = value * BAR_HEIGHT;
  const color = value > 0 ? ACTIVE : INACTIVE;
  const pct = Math.round(value * 100);

  return (
    <Container title={`${label}: ${pct}% — drag to adjust`}>
      <svg
        ref={svgRef}
        width={BAR_WIDTH}
        height={BAR_HEIGHT}
        style={{ cursor: "ns-resize", borderRadius: 3 }}
        onMouseDown={handleMouseDown}
      >
        {/* Background track */}
        <rect
          x={0}
          y={0}
          width={BAR_WIDTH}
          height={BAR_HEIGHT}
          fill="rgba(72, 175, 240, 0.1)"
          rx={2}
        />
        {/* Border */}
        <rect
          x={0.5}
          y={0.5}
          width={BAR_WIDTH - 1}
          height={BAR_HEIGHT - 1}
          fill="none"
          stroke="rgba(72, 175, 240, 0.3)"
          strokeWidth={1}
          rx={2}
        />
        {/* Fill bar — grows from bottom */}
        {fillHeight > 0 && (
          <rect
            x={2}
            y={BAR_HEIGHT - fillHeight}
            width={BAR_WIDTH - 4}
            height={fillHeight}
            fill={color}
            opacity={0.3 + value * 0.7}
            rx={1}
          />
        )}
        {/* Level indicator line */}
        {value > 0 && (
          <line
            x1={1}
            y1={BAR_HEIGHT - fillHeight}
            x2={BAR_WIDTH - 1}
            y2={BAR_HEIGHT - fillHeight}
            stroke={color}
            strokeWidth={1}
            opacity={0.8}
          />
        )}
        {/* Tick marks */}
        {[0.25, 0.5, 0.75].map((tick) => (
          <line
            key={tick}
            x1={0}
            y1={BAR_HEIGHT * (1 - tick)}
            x2={2}
            y2={BAR_HEIGHT * (1 - tick)}
            stroke="rgba(72, 175, 240, 0.2)"
            strokeWidth={0.5}
          />
        ))}
      </svg>
      <VisLabel>{label}</VisLabel>
      <HintLabel>drag me</HintLabel>
    </Container>
  );
};

export const LeftRumble = () => {
  const controller = React.useContext(ControllerContext);
  const [value, setValue] = React.useState(controller.left.rumble());

  const handleChange = React.useCallback(
    (v: number) => {
      setValue(v);
      controller.left.rumble(v);
    },
    [controller]
  );

  return <RumbleBar value={value} onChange={handleChange} label="Rumble" />;
};

export const RightRumble = () => {
  const controller = React.useContext(ControllerContext);
  const [value, setValue] = React.useState(controller.right.rumble());

  const handleChange = React.useCallback(
    (v: number) => {
      setValue(v);
      controller.right.rumble(v);
    },
    [controller]
  );

  return <RumbleBar value={value} onChange={handleChange} label="Rumble" />;
};
