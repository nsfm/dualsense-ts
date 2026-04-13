import{a as c,C as S,d as e,j as n,g as h}from"./index-BSVR9c3C.js";const $=h.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`,y=h.span`
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.5px;
  color: ${t=>t.$color};
`,L=h.span`
  font-size: 32px;
  font-weight: 300;
  color: rgba(191, 204, 214, 0.9);
  font-variant-numeric: tabular-nums;
`;function A(t,s){return s===e.ChargeStatus.Charging||s===e.ChargeStatus.Full?"#3dcc91":s===e.ChargeStatus.AbnormalVoltage||s===e.ChargeStatus.AbnormalTemperature||s===e.ChargeStatus.ChargingError||t<.2?"#ff6b6b":t<.4?"#f29e02":"#48aff0"}function j(t){switch(t){case e.ChargeStatus.Charging:return"Charging";case e.ChargeStatus.Full:return"Fully Charged";case e.ChargeStatus.Discharging:return"Discharging";case e.ChargeStatus.AbnormalVoltage:return"Abnormal Voltage";case e.ChargeStatus.AbnormalTemperature:return"Abnormal Temperature";case e.ChargeStatus.ChargingError:return"Charging Error";default:return"Unknown"}}const r=120,a=56,u=8,p=24,l=4,w=a-l*2,E=r-l*2,b=6,T=()=>{const t=c.useContext(S),[s,f]=c.useState(t.battery.level.state),[i,x]=c.useState(t.battery.status.state);c.useEffect(()=>{f(t.battery.level.state),x(t.battery.status.state),t.battery.level.on("change",({state:g})=>f(g)),t.battery.status.on("change",({state:g})=>x(g))},[t]);const o=A(s,i),d=Math.round(s*100),C=Math.max(0,s*E),m=i===e.ChargeStatus.Charging||i===e.ChargeStatus.Full;return n.jsxs($,{children:[n.jsxs("svg",{width:r+u+2,height:a+2,viewBox:`-1 -1 ${r+u+2} ${a+2}`,children:[n.jsx("rect",{x:0,y:0,width:r,height:a,rx:b,fill:"none",stroke:o,strokeWidth:1.5,opacity:.6}),n.jsx("rect",{x:r,y:(a-p)/2,width:u,height:p,rx:2,fill:o,opacity:.4}),C>0&&n.jsx("rect",{x:l,y:l,width:C,height:w,rx:b-2,fill:o,opacity:.35}),m&&n.jsx("path",{d:`M${r/2+2} ${a*.15}
                L${r/2-5} ${a*.52}
                L${r/2+1} ${a*.52}
                L${r/2-2} ${a*.85}
                L${r/2+5} ${a*.48}
                L${r/2-1} ${a*.48}
                Z`,fill:o,opacity:.8})]}),n.jsxs(L,{children:[d,"%"]}),n.jsx(y,{$color:o,children:j(i)})]})};export{T as B};
