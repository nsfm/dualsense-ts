import styled from "styled-components";

export const Button = styled.button<{ $active?: boolean; $small?: boolean; $minimal?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: ${(p) => (p.$small ? "3px 8px" : "6px 14px")};
  border-radius: 3px;
  font-size: ${(p) => (p.$small ? "11px" : "13px")};
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  white-space: nowrap;
  color: ${(p) => (p.$active ? "#48aff0" : "#bfccd6")};
  background: ${(p) => {
    if (p.$minimal) return "transparent";
    return p.$active ? "rgba(72, 175, 240, 0.2)" : "rgba(72, 175, 240, 0.06)";
  }};
  border: 1px solid ${(p) => {
    if (p.$minimal) return "transparent";
    return p.$active ? "rgba(72, 175, 240, 0.5)" : "rgba(72, 175, 240, 0.2)";
  }};

  &:hover {
    background: rgba(72, 175, 240, 0.15);
    color: #48aff0;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    &:hover {
      background: ${(p) => (p.$minimal ? "transparent" : "rgba(72, 175, 240, 0.06)")};
    }
  }
`;

export const ButtonGroup = styled.div`
  display: inline-flex;
  gap: 0;

  ${Button} {
    border-radius: 0;
  }

  ${Button}:first-child {
    border-radius: 3px 0 0 3px;
  }

  ${Button}:last-child {
    border-radius: 0 3px 3px 0;
  }

  ${Button} + ${Button} {
    border-left: none;
  }
`;
