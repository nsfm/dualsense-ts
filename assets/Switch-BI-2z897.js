import{g as a,j as o}from"./index-B3Vc337h.js";const s={none:"rgba(255, 255, 255, 0.15)",primary:"rgba(72, 175, 240, 0.25)",success:"rgba(61, 204, 145, 0.25)",warning:"rgba(242, 158, 2, 0.25)",danger:"rgba(255, 115, 115, 0.25)"},c={none:"rgba(255, 255, 255, 0.1)",primary:"rgba(72, 175, 240, 0.4)",success:"rgba(61, 204, 145, 0.4)",warning:"rgba(242, 158, 2, 0.4)",danger:"rgba(255, 115, 115, 0.4)"},x=a.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  background: ${r=>r.$minimal?"transparent":s[r.$intent??"none"]};
  border: 1px solid ${r=>r.$minimal?"transparent":c[r.$intent??"none"]};
  color: #bfccd6;
`,n=a.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: ${r=>r.$small?"3px 8px":"6px 14px"};
  border-radius: 3px;
  font-size: ${r=>r.$small?"11px":"13px"};
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  white-space: nowrap;
  color: ${r=>r.$active?"#48aff0":"#bfccd6"};
  background: ${r=>r.$minimal?"transparent":r.$active?"rgba(72, 175, 240, 0.2)":"rgba(72, 175, 240, 0.06)"};
  border: 1px solid ${r=>r.$minimal?"transparent":r.$active?"rgba(72, 175, 240, 0.5)":"rgba(72, 175, 240, 0.2)"};

  &:hover {
    background: rgba(72, 175, 240, 0.15);
    color: #48aff0;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    &:hover {
      background: ${r=>r.$minimal?"transparent":"rgba(72, 175, 240, 0.06)"};
    }
  }
`;a.div`
  display: inline-flex;
  gap: 0;

  ${n} {
    border-radius: 0;
  }

  ${n}:first-child {
    border-radius: 3px 0 0 3px;
  }

  ${n}:last-child {
    border-radius: 0 3px 3px 0;
  }

  ${n} + ${n} {
    border-left: none;
  }
`;const u=a.select`
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
`,h=a.div`
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  padding: 16px;
  transition: border-color 0.15s, background 0.15s;

  ${r=>r.$interactive&&`
    cursor: pointer;
    &:hover {
      border-color: rgba(72, 175, 240, 0.3);
      background: rgba(0, 0, 0, 0.25);
    }
  `}
`,d=a.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  color: #bfccd6;
  user-select: none;
`,p=a.span`
  position: relative;
  width: 32px;
  height: 18px;
  border-radius: 9px;
  background: ${r=>r.$checked?"rgba(72, 175, 240, 0.5)":"rgba(255, 255, 255, 0.12)"};
  transition: background 0.15s;
  flex-shrink: 0;
`,b=a.span`
  position: absolute;
  top: 2px;
  left: ${r=>r.$checked?"16px":"2px"};
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${r=>r.$checked?"#48aff0":"#8a9ba8"};
  transition: left 0.15s, background 0.15s;
`,g=a.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`,f=({checked:r,onChange:e,label:t})=>o.jsxs(d,{children:[o.jsx(g,{type:"checkbox",checked:r,onChange:i=>e(i.target.checked)}),o.jsx(p,{$checked:r,children:o.jsx(b,{$checked:r})}),t]});export{n as B,h as C,u as S,x as T,f as a};
