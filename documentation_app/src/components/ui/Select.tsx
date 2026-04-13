import styled from "styled-components";

export const Select = styled.select`
  appearance: none;
  padding: 4px 28px 4px 8px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  color: #bfccd6;
  background: rgba(72, 175, 240, 0.06)
    url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5'%3E%3Cpath fill='%2348aff0' d='M0 0l4 5 4-5z'/%3E%3C/svg%3E")
    no-repeat right 8px center;
  border: 1px solid rgba(72, 175, 240, 0.2);
  transition: background-color 0.15s, border-color 0.15s;

  &:hover {
    background-color: rgba(72, 175, 240, 0.12);
    border-color: rgba(72, 175, 240, 0.35);
  }

  &:focus {
    outline: none;
    border-color: rgba(72, 175, 240, 0.5);
  }

  option {
    background: #1a1a2e;
    color: #bfccd6;
  }
`;
