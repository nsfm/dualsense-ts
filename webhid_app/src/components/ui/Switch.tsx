import React from "react";
import styled from "styled-components";

const Label = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  color: #bfccd6;
  user-select: none;
`;

const Track = styled.span<{ $checked: boolean }>`
  position: relative;
  width: 32px;
  height: 18px;
  border-radius: 9px;
  background: ${(p) =>
    p.$checked ? "rgba(72, 175, 240, 0.5)" : "rgba(255, 255, 255, 0.12)"};
  transition: background 0.15s;
  flex-shrink: 0;
`;

const Thumb = styled.span<{ $checked: boolean }>`
  position: absolute;
  top: 2px;
  left: ${(p) => (p.$checked ? "16px" : "2px")};
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${(p) => (p.$checked ? "#48aff0" : "#8a9ba8")};
  transition: left 0.15s, background 0.15s;
`;

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, label }) => (
  <Label>
    <HiddenInput
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    <Track $checked={checked}>
      <Thumb $checked={checked} />
    </Track>
    {label}
  </Label>
);
