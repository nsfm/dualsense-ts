import styled from "styled-components";

export type TagIntent = "none" | "primary" | "success" | "warning" | "danger";

const intentColors: Record<TagIntent, string> = {
  none: "rgba(255, 255, 255, 0.15)",
  primary: "rgba(72, 175, 240, 0.25)",
  success: "rgba(61, 204, 145, 0.25)",
  warning: "rgba(242, 158, 2, 0.25)",
  danger: "rgba(255, 115, 115, 0.25)",
};

const intentBorders: Record<TagIntent, string> = {
  none: "rgba(255, 255, 255, 0.1)",
  primary: "rgba(72, 175, 240, 0.4)",
  success: "rgba(61, 204, 145, 0.4)",
  warning: "rgba(242, 158, 2, 0.4)",
  danger: "rgba(255, 115, 115, 0.4)",
};

export const Tag = styled.span<{ $intent?: TagIntent; $minimal?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  background: ${(p) => (p.$minimal ? "transparent" : intentColors[p.$intent ?? "none"])};
  border: 1px solid ${(p) => (p.$minimal ? "transparent" : intentBorders[p.$intent ?? "none"])};
  color: #bfccd6;
`;
