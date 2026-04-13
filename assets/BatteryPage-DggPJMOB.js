import{j as e,g as r,a as g,C as v,d as s,R as C,L as p}from"./index-DKhcrciQ.js";import{F as w,P as c,S as h,D as S,a as j,H as b}from"./FeaturePage-BkaKAGuw.js";import{B as k}from"./BatteryVisualization-rbbqz3wu.js";import{a as x}from"./CodeBlock-ByGo0dcz.js";const T=r.div`
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;

  & > :first-child {
    border-radius: 8px 8px 0 0;
  }

  & > :last-child {
    border-radius: 0 0 8px 8px;
  }
`,B=r.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  background: ${t=>t.$even?"rgba(0, 0, 0, 0.12)":"rgba(0, 0, 0, 0.06)"};
`,D=r.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.18);
`,m=r.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(191, 204, 214, 0.35);
`,F=r.code`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.85);
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
  text-align: left;
`,u=r.span`
  color: rgba(191, 204, 214, 0.3);
`,$=r.code`
  font-size: 12px;
  flex-shrink: 0;
  width: 12ch;
  text-align: right;
  color: ${t=>t.$highlight?"#f29e02":"rgba(191, 204, 214, 0.5)"};
  transition: color 0.06s;
`,A=r.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
  cursor: help;
  position: relative;

  & > code {
    transition: color 0.1s;
  }

  &:hover > code {
    color: rgba(191, 204, 214, 1);
  }

  &:hover > span:first-child {
    color: rgba(191, 204, 214, 0.6);
    border-color: rgba(191, 204, 214, 0.3);
  }

  &::after {
    content: ${t=>JSON.stringify(t.$tip)};
    position: absolute;
    left: 0;
    top: 100%;
    margin-top: 6px;
    padding: 6px 10px;
    background: rgba(10, 10, 20, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    font-size: 12px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: rgba(191, 204, 214, 0.85);
    line-height: 1.4;
    white-space: normal;
    max-width: 320px;
    width: max-content;
    z-index: 10;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.1s 0.08s;
  }

  &:hover::after {
    opacity: 1;
  }
`,L=r.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 1px solid rgba(191, 204, 214, 0.15);
  font-size: 10px;
  font-style: italic;
  font-family: Georgia, serif;
  color: rgba(191, 204, 214, 0.3);
  flex-shrink: 0;
`,R=({data:t,even:n})=>{const o=t.label.split(".");return e.jsxs(B,{$even:n,children:[e.jsxs(A,{$tip:t.tooltip,children:[e.jsx(L,{children:"i"}),e.jsxs(F,{children:[e.jsx(u,{children:"controller."}),o.map((i,a)=>e.jsxs(C.Fragment,{children:[a>0&&e.jsx(u,{children:"."}),a===o.length-1?i:e.jsx(u,{children:i})]},a))]})]}),e.jsx($,{$highlight:t.highlight,children:t.state})]})};function z(t){switch(t){case s.ChargeStatus.Discharging:return"Discharging";case s.ChargeStatus.Charging:return"Charging";case s.ChargeStatus.Full:return"Full";case s.ChargeStatus.AbnormalVoltage:return"AbnormalVoltage";case s.ChargeStatus.AbnormalTemperature:return"AbnormalTemp";case s.ChargeStatus.ChargingError:return"ChargingError";default:return`Unknown(${t})`}}const E=()=>{const n=g.useContext(v).battery,[,o]=g.useState(0);g.useEffect(()=>{const l=()=>o(d=>d+1);return n.on("change",l),()=>{n.removeListener("change",l)}},[n]);const i=n.level.state,a=n.status.state,f=a===s.ChargeStatus.Charging||a===s.ChargeStatus.Full,y=[{label:"battery.level.state",tooltip:"Battery charge level as a 0–1 value. Reported in 10% increments by the firmware (0.0, 0.1, 0.2, ... 1.0).",state:i.toFixed(1),highlight:i>0},{label:"battery.status.state",tooltip:"Current charging status from the ChargeStatus enum: Discharging, Charging, Full, AbnormalVoltage, AbnormalTemperature, or ChargingError.",state:z(a),highlight:f}];return e.jsx(e.Fragment,{children:y.map((l,d)=>e.jsx(R,{data:l,even:d%2===1},l.label))})},H=()=>e.jsxs(D,{children:[e.jsx("div",{style:{width:15,flexShrink:0}}),e.jsx(m,{style:{flex:1},children:"property"}),e.jsx(m,{style:{flexShrink:0,width:"12ch",textAlign:"right"},children:"value"})]}),V=()=>e.jsxs(T,{children:[e.jsx(H,{}),e.jsx(E,{})]}),N=()=>e.jsxs(w,{title:"Battery",subtitle:"Charge level and charging status monitoring.",children:[e.jsx(c,{children:e.jsxs("p",{children:["The"," ",e.jsx(p,{to:"/api/battery",children:e.jsx("code",{children:"Battery"})})," input groups two sub-inputs: ",e.jsx("code",{children:".level"})," (a 0–1 charge value) and"," ",e.jsx("code",{children:".status"})," (a"," ",e.jsx(p,{to:"/api/enums",children:e.jsx("code",{children:"ChargeStatus"})})," enum indicating charging state). The parent ",e.jsx("code",{children:"battery"})," fires"," ",e.jsx("code",{children:'"change"'})," when either child updates."]})}),e.jsx(h,{children:"Live State"}),e.jsx(S,{children:"Connect your controller to see battery status"}),e.jsx(j,{children:e.jsx(k,{})}),e.jsx(j,{style:{padding:0,border:"none",background:"none",minHeight:0},children:e.jsx(V,{})}),e.jsx(h,{children:"Charge Level"}),e.jsx(c,{children:e.jsxs("p",{children:["The ",e.jsx("code",{children:".level"})," sub-input is a 0–1 value representing the current charge. It fires ",e.jsx("code",{children:'"change"'})," when the level updates."]})}),e.jsx(b,{children:"The firmware reports battery level in 10% increments (0.0, 0.1, 0.2, ... 1.0). You won't see granular per-percent changes — the value steps in blocks of 0.1."}),e.jsx(b,{children:"The raw battery level fluctuates up and down, so dualsense-ts buffers and normalizes the value. Additionally, the level may jump suddenly when the controller is plugged in or unplugged, and can take a few moments to stabilize."}),e.jsx(x,{code:`// Read current level
const pct = Math.round(controller.battery.level.state * 100);
console.log(\`Battery: \${pct}%\`);

// Watch for changes
controller.battery.level.on("change", ({ state }) => {
  console.log(\`Battery now: \${Math.round(state * 100)}%\`);
});`}),e.jsx(h,{children:"Charging Status"}),e.jsxs(c,{children:[e.jsxs("p",{children:["The ",e.jsx("code",{children:".status"})," sub-input reports the current charging state as a ",e.jsx("code",{children:"ChargeStatus"})," enum value. The most common states are ",e.jsx("code",{children:"Discharging"}),", ",e.jsx("code",{children:"Charging"}),", and"," ",e.jsx("code",{children:"Full"}),". Error states indicate hardware issues."]}),e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Status"}),e.jsx("th",{children:"Meaning"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"Discharging"})}),e.jsx("td",{children:"Running on battery power"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"Charging"})}),e.jsx("td",{children:"Connected to power and actively charging"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"Full"})}),e.jsx("td",{children:"Connected to power, fully charged"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"AbnormalVoltage"})}),e.jsx("td",{children:"Voltage outside safe range"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"AbnormalTemperature"})}),e.jsx("td",{children:"Temperature outside safe range"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"ChargingError"})}),e.jsx("td",{children:"General charging failure"})]})]})]})]}),e.jsx(x,{code:`import { ChargeStatus } from "dualsense-ts";

controller.battery.status.on("change", ({ state }) => {
  switch (state) {
    case ChargeStatus.Charging:
      showChargingIcon();
      break;
    case ChargeStatus.Full:
      showFullIcon();
      break;
    case ChargeStatus.Discharging:
      if (controller.battery.level.state < 0.2) {
        showLowBatteryWarning();
      }
      break;
  }
});`}),e.jsx(h,{children:"Listening to All Changes"}),e.jsx(c,{children:e.jsxs("p",{children:["The parent ",e.jsx("code",{children:"battery"})," input fires ",e.jsx("code",{children:'"change"'})," ","when either the level or status updates."]})}),e.jsx(x,{code:`controller.battery.on("change", (battery) => {
  console.log(\`Level: \${Math.round(battery.level.state * 100)}%\`);
  console.log(\`Status: \${battery.status.state}\`);
});

// One-shot low battery check
controller.battery.level.on("change", ({ state }) => {
  if (state < 0.1) {
    alert("Battery critically low!");
  }
});`})]});export{N as default};
