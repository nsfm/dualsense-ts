import React from "react";
import styled from "styled-components";
import { Link } from "react-router";

/* ── Data model ─────────────────────────────────────────────── */

interface TreeNode {
  /** Property name(s) on the parent, e.g. "triangle, circle, cross, square" */
  label: string;
  /** Class / type name, e.g. "Momentary" */
  type: string;
  /** Route path for the type's API page, e.g. "/api/momentary" */
  href?: string;
  /** Extra info shown after the type badge */
  note?: string;
  /** Category tag for color-coding */
  kind?: "input" | "output" | "sensor" | "state" | "hid";
  /** Nested children */
  children?: TreeNode[];
  /** Start collapsed? (default: false) */
  collapsed?: boolean;
}

const TREE: TreeNode[] = [
  {
    label: "triangle, circle, cross, square",
    type: "Momentary",
    href: "/api/momentary",
    kind: "input",
  },
  {
    label: "ps, create, options",
    type: "Momentary",
    href: "/api/momentary",
    kind: "input",
  },
  {
    label: "mute",
    type: "Mute",
    href: "/api/mute",
    kind: "input",
    note: "extends Momentary",
    children: [
      { label: "status", type: "Momentary", href: "/api/momentary", kind: "state" },
    ],
  },
  {
    label: "dpad",
    type: "Dpad",
    href: "/api/dpad",
    kind: "input",
    children: [
      { label: "up, down, left, right", type: "Momentary", href: "/api/momentary", kind: "input" },
    ],
  },
  {
    label: "left, right",
    type: "Unisense",
    href: "/api/unisense",
    kind: "input",
    children: [
      {
        label: "trigger",
        type: "Trigger",
        href: "/api/trigger",
        kind: "input",
        children: [
          { label: "button", type: "Momentary", href: "/api/momentary", kind: "input" },
          { label: "feedback", type: "TriggerFeedback", href: "/api/trigger-feedback", kind: "output" },
        ],
      },
      { label: "bumper", type: "Momentary", href: "/api/momentary", kind: "input" },
      {
        label: "analog",
        type: "Analog",
        href: "/api/analog",
        kind: "input",
        children: [
          { label: "x, y", type: "Axis", href: "/api/axis", kind: "input" },
          { label: "button", type: "Momentary", href: "/api/momentary", kind: "input", note: "L3 / R3" },
        ],
      },
    ],
  },
  {
    label: "touchpad",
    type: "Touchpad",
    href: "/api/touchpad",
    kind: "input",
    children: [
      { label: "button", type: "Momentary", href: "/api/momentary", kind: "input" },
      {
        label: "left, right",
        type: "Touch",
        href: "/api/touchpad",
        kind: "input",
        note: "extends Analog",
        children: [
          { label: "contact", type: "Momentary", href: "/api/momentary", kind: "input" },
          { label: "tracker", type: "Increment", kind: "state" },
        ],
      },
    ],
  },
  {
    label: "gyroscope",
    type: "Gyroscope",
    href: "/api/gyroscope",
    kind: "sensor",
    children: [
      { label: "x, y, z", type: "Axis", href: "/api/axis", kind: "input" },
    ],
  },
  {
    label: "accelerometer",
    type: "Accelerometer",
    href: "/api/accelerometer",
    kind: "sensor",
    children: [
      { label: "x, y, z", type: "Axis", href: "/api/axis", kind: "input" },
    ],
  },
  {
    label: "battery",
    type: "Battery",
    href: "/api/battery",
    kind: "state",
    children: [
      { label: "level", type: "BatteryLevel", kind: "state" },
      { label: "status", type: "BatteryStatus", kind: "state" },
    ],
  },
  { label: "lightbar", type: "Lightbar", href: "/api/lightbar", kind: "output" },
  { label: "playerLeds", type: "PlayerLeds", href: "/api/player-leds", kind: "output" },
  { label: "audio", type: "Audio", href: "/api/audio", kind: "output" },
  {
    label: "microphone, headphone, connection",
    type: "Momentary",
    href: "/api/momentary",
    kind: "state",
  },
  { label: "hid", type: "DualsenseHID", kind: "hid" },
];

/* ── Styled components ──────────────────────────────────────── */

const TreeContainer = styled.div`
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 20px 8px 20px 16px;
  margin: 16px 0;
  overflow-x: auto;
`;

const RootLabel = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: monospace;
  font-size: 15px;
  font-weight: 700;
  color: #f5f5f5;
  text-decoration: none;
  padding: 4px 10px;
  border-radius: 4px;
  margin-bottom: 4px;
  transition: background 0.15s;

  &:hover {
    background: rgba(72, 175, 240, 0.1);
    text-decoration: none;
  }
`;

const NodeList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0 0 0 20px;
`;

const NodeItem = styled.li`
  position: relative;
  padding: 0 0 0 20px;

  /* Vertical line from parent */
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 1px;
    background: rgba(255, 255, 255, 0.08);
  }

  /* Horizontal branch line */
  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 16px;
    width: 16px;
    height: 1px;
    background: rgba(255, 255, 255, 0.08);
  }

  /* Last child: cut the vertical line at the branch point */
  &:last-child::before {
    bottom: calc(100% - 16px);
  }
`;

const NodeRow = styled.div<{ $clickable?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px;
  border-radius: 4px;
  cursor: ${(p) => (p.$clickable ? "pointer" : "default")};
  transition: background 0.12s;
  min-height: 28px;

  &:hover {
    background: ${(p) =>
      p.$clickable ? "rgba(72, 175, 240, 0.08)" : "transparent"};
  }
`;

const PropLabel = styled.span`
  font-family: monospace;
  font-size: 13px;
  color: rgba(191, 204, 214, 0.9);
`;

const kindColors: Record<string, string> = {
  input: "#48aff0",
  output: "#f29e02",
  sensor: "#3dcc91",
  state: "#c792ea",
  hid: "rgba(191, 204, 214, 0.4)",
};

const TypeBadge = styled.span<{ $kind?: string }>`
  font-family: monospace;
  font-size: 11px;
  font-weight: 600;
  color: ${(p) => kindColors[p.$kind ?? ""] ?? "rgba(191, 204, 214, 0.6)"};
  background: ${(p) => {
    const c = kindColors[p.$kind ?? ""] ?? "rgba(191, 204, 214, 0.6)";
    return c + "15";
  }};
  border: 1px solid ${(p) => {
    const c = kindColors[p.$kind ?? ""] ?? "rgba(191, 204, 214, 0.6)";
    return c + "30";
  }};
  padding: 1px 6px;
  border-radius: 3px;
  white-space: nowrap;
`;

const Note = styled.span`
  font-size: 11px;
  color: rgba(191, 204, 214, 0.35);
  font-style: italic;
`;

const Toggle = styled.span<{ $expanded: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  font-size: 10px;
  color: rgba(191, 204, 214, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  user-select: none;
  flex-shrink: 0;
  transition: color 0.12s, border-color 0.12s, transform 0.15s;
  transform: rotate(${(p) => (p.$expanded ? "90deg" : "0deg")});

  &:hover {
    color: rgba(191, 204, 214, 0.7);
    border-color: rgba(255, 255, 255, 0.15);
  }
`;

const Legend = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 12px;
  padding: 0 8px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: rgba(191, 204, 214, 0.5);
`;

const LegendDot = styled.span<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: ${(p) => p.$color};
`;

/* ── Tree node component ────────────────────────────────────── */

const TreeNodeView: React.FC<{ node: TreeNode }> = ({ node }) => {
  const [expanded, setExpanded] = React.useState(!node.collapsed);
  const hasChildren = node.children && node.children.length > 0;

  const row = (
    <NodeRow
      $clickable={hasChildren}
      onClick={hasChildren ? () => setExpanded((e) => !e) : undefined}
    >
      {hasChildren && <Toggle $expanded={expanded}>&#9654;</Toggle>}
      <PropLabel>.{node.label}</PropLabel>
      {node.href ? (
        <Link to={node.href} onClick={(e) => e.stopPropagation()}>
          <TypeBadge $kind={node.kind}>{node.type}</TypeBadge>
        </Link>
      ) : (
        <TypeBadge $kind={node.kind}>{node.type}</TypeBadge>
      )}
      {node.note && <Note>{node.note}</Note>}
    </NodeRow>
  );

  return (
    <NodeItem>
      {row}
      {hasChildren && expanded && (
        <NodeList>
          {node.children!.map((child, i) => (
            <TreeNodeView key={i} node={child} />
          ))}
        </NodeList>
      )}
    </NodeItem>
  );
};

/* ── Main export ────────────────────────────────────────────── */

export const InputTree: React.FC = () => (
  <TreeContainer>
    <RootLabel to="/api/dualsense">
      <TypeBadge $kind="input" style={{ fontSize: 13, padding: "2px 8px" }}>
        Dualsense
      </TypeBadge>
    </RootLabel>
    <NodeList>
      {TREE.map((node, i) => (
        <TreeNodeView key={i} node={node} />
      ))}
    </NodeList>
    <Legend>
      <LegendItem>
        <LegendDot $color={kindColors.input} /> Input
      </LegendItem>
      <LegendItem>
        <LegendDot $color={kindColors.output} /> Output
      </LegendItem>
      <LegendItem>
        <LegendDot $color={kindColors.sensor} /> Sensor
      </LegendItem>
      <LegendItem>
        <LegendDot $color={kindColors.state} /> State
      </LegendItem>
      <LegendItem>
        <LegendDot $color={kindColors.hid} /> HID
      </LegendItem>
    </Legend>
  </TreeContainer>
);
