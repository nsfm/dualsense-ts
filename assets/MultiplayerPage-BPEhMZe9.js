import{u as w,a as x,j as e,m,r as b,g as t,d as v,L as k}from"./index-DwvD-yqT.js";import{F as C,P as i,D as $,S as c,H as D}from"./FeaturePage-o7D6sE4P.js";import{B as P,a as l}from"./CodeBlock-CIY2ZnXU.js";const I=t.div`
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  overflow: hidden;
  margin: 16px 0;
`,B=t.div`
  display: grid;
  grid-template-columns: 36px 1fr 80px 80px 1fr 28px;
  gap: 12px;
  align-items: center;
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.18);
`,h=t.span`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(191, 204, 214, 0.3);
`,L=t.div`
  display: grid;
  grid-template-columns: 36px 1fr 80px 80px 1fr 28px;
  gap: 12px;
  align-items: center;
  padding: 10px 16px;
  background: ${n=>n.$even?"rgba(0, 0, 0, 0.12)":"rgba(0, 0, 0, 0.06)"};
  opacity: ${n=>n.$connected?1:.35};
  transition: opacity 0.3s;
`,S=t.div`
  padding: 32px 16px;
  text-align: center;
  color: rgba(191, 204, 214, 0.35);
  font-size: 13px;
  background: rgba(0, 0, 0, 0.06);
`,E=t.div`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  background: ${n=>n.$connected?"rgba(72, 175, 240, 0.15)":"rgba(255, 255, 255, 0.04)"};
  border: 1px solid ${n=>n.$connected?"rgba(72, 175, 240, 0.3)":"rgba(255, 255, 255, 0.08)"};
  color: ${n=>n.$connected?"#48aff0":"rgba(191, 204, 214, 0.3)"};
`,M={"00":"#e8e8e8","01":"#1a1a2e","02":"#c8102e","03":"#f2a6c0","04":"#6b3fa0","05":"#5b9bd5","06":"#8a9a7b","07":"#9b2335","08":"#c0c0c0","09":"#1e3a5f",10:"#2db5a0",11:"#3d4f7c",12:"#e8dfd0",30:"#4a4a4a"},R=t.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`,N=t.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${n=>n.$color};
  border: 1px solid rgba(255, 255, 255, 0.25);
  flex-shrink: 0;
`,z=t.span`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.85);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`,T=t.div`
  display: flex;
  align-items: center;
  gap: 6px;
`,y=t.svg`
  fill: rgba(191, 204, 214, 0.6);
  flex-shrink: 0;
`,A=t.span`
  font-size: 12px;
  color: rgba(191, 204, 214, 0.6);
`,H=t.div`
  display: flex;
  align-items: center;
  gap: 6px;
`,q=t.div`
  width: 32px;
  height: 12px;
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
`,F=t.div`
  height: 100%;
  width: ${n=>n.$pct}%;
  background: ${n=>n.$charging?"#48aff0":n.$pct<=20?"#db3737":n.$pct<=40?"#f29e02":"#3dcc91"};
  transition: width 0.3s, background 0.3s;
`,U=t.span`
  font-size: 12px;
  color: rgba(191, 204, 214, 0.6);
  min-width: 3ch;
`,V=t.code`
  font-size: 11px;
  color: rgba(191, 204, 214, 0.45);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
`,W=t.button`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  color: rgba(191, 204, 214, 0.3);
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s, background 0.15s, border-color 0.15s;
  padding: 0;

  &:hover {
    color: #db3737;
    background: rgba(219, 55, 55, 0.1);
    border-color: rgba(219, 55, 55, 0.3);
  }
`,O=t.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(72, 175, 240, 0.04);
  color: rgba(72, 175, 240, 0.7);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: rgba(72, 175, 240, 0.1);
    color: #48aff0;
  }
`;function j(n,p){const g=n.connection.state,a=n.factoryInfo,r=n.battery.level.state,s=n.battery.status.state;return{index:p,connected:g,wireless:g?n.wireless:!1,colorCode:a.colorCode,colorName:a.colorName!=="unknown"?a.colorName:"Unknown",batteryPct:Math.round(r*100),charging:s===v.ChargeStatus.Charging||s===v.ChargeStatus.Full,serial:a.serialNumber!=="unknown"?a.serialNumber:"—"}}const _=()=>{const{controllers:n}=w(),[p,g]=x.useState([]),a=x.useRef(n);return a.current=n,x.useEffect(()=>{const r=()=>{const o=a.current;g(o.map((d,u)=>j(d,u)))};r();const s=setInterval(r,500);return()=>clearInterval(s)},[n.length]),x.useEffect(()=>{const r=[];return n.forEach(s=>{const o=()=>{g(d=>d.map((u,f)=>n[f]===s?j(s,f):u))};s.on("change",o),s.connection.on("change",o),r.push(()=>{s.removeListener("change",o),s.connection.removeListener("change",o)})}),()=>r.forEach(s=>s())},[n]),e.jsxs(I,{children:[e.jsxs(B,{children:[e.jsx(h,{children:"#"}),e.jsx(h,{children:"controller"}),e.jsx(h,{children:"transport"}),e.jsx(h,{children:"battery"}),e.jsx(h,{children:"serial"}),e.jsx(h,{})]}),p.length===0?e.jsx(S,{children:m?e.jsxs(e.Fragment,{children:["No controllers connected."," ",e.jsx(P,{$small:!0,onClick:b,style:{marginLeft:8},children:"Connect"})]}):"WebHID not available in this browser."}):p.map((r,s)=>{const o=M[r.colorCode];return e.jsxs(L,{$even:s%2===1,$connected:r.connected,children:[e.jsx(E,{$connected:r.connected,children:r.index+1}),e.jsxs(R,{children:[o&&e.jsx(N,{$color:o}),e.jsx(z,{children:r.colorName})]}),e.jsxs(T,{children:[r.wireless?e.jsx(y,{width:"14",height:"14",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M17.71 7.71 12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z"})}):e.jsx(y,{width:"14",height:"14",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M15 7v4h1v2h-3V5h2l-3-4-3 4h2v8H8v-2.07A1.993 1.993 0 0 0 8 7a2 2 0 0 0-4 0c0 .74.4 1.38 1 1.73V13a2 2 0 0 0 2 2h3v2.27c-.6.35-1 .99-1 1.73a2 2 0 0 0 4 0c0-.74-.4-1.38-1-1.73V15h3a2 2 0 0 0 2-2v-2h1V7h-3z"})}),e.jsx(A,{children:r.connected?r.wireless?"BT":"USB":"—"})]}),e.jsxs(H,{children:[e.jsx(q,{children:e.jsx(F,{$pct:r.connected?r.batteryPct:0,$charging:r.charging})}),e.jsx(U,{children:r.connected?`${r.batteryPct}%`:"—"})]}),e.jsx(V,{children:(r.connected,r.serial)}),e.jsx(W,{title:"Release slot",onClick:()=>{var d;return(d=m)==null?void 0:d.release(r.index)},children:"✕"})]},s)}),m&&e.jsxs(O,{onClick:b,children:[e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"currentColor",children:e.jsx("path",{d:"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"})}),"Connect Controller"]})]})},Q=()=>e.jsxs(C,{title:"Multiplayer",subtitle:"Manage multiple controllers with automatic discovery, identity-based reconnection, and player LED assignment.",children:[e.jsx(i,{children:e.jsxs("p",{children:["The ",e.jsx("strong",{children:"DualsenseManager"})," class handles multi-controller scenarios. It discovers controllers automatically, assigns player LED patterns, tracks hardware identity for seamless reconnection, and exposes the full set of managed controllers through a stable slot system."]})}),e.jsx($,{children:"Connect or disconnect controllers to see live slot updates"}),e.jsx(_,{}),e.jsx(c,{children:"Setting Up the Manager"}),e.jsx(i,{children:e.jsxs("p",{children:["Create a manager instance to start discovering controllers. In the browser, WebHID requires a"," ",e.jsx("a",{href:"https://developer.mozilla.org/en-US/docs/Web/API/User_activation",target:"_blank",rel:"noopener noreferrer",children:"user gesture"})," ","to open the device picker — the manager provides a"," ",e.jsx("code",{children:"getRequest()"})," helper for this. In Node.js, controllers are discovered automatically via USB enumeration."]})}),e.jsx(l,{code:`import { DualsenseManager } from "dualsense-ts";

const manager = new DualsenseManager();

// Browser — attach to a button click
const requestPermission = manager.getRequest();
connectButton.addEventListener("click", requestPermission);

// Node.js — controllers are discovered automatically
// Optional: configure polling interval (default 2000ms)
const manager = new DualsenseManager({ discoveryInterval: 1000 });`}),e.jsx(c,{children:"Reacting to Changes"}),e.jsx(i,{children:e.jsxs("p",{children:["The manager is an ",e.jsx(k,{to:"/api/input",children:e.jsx("code",{children:"Input"})})," — it emits ",e.jsx("code",{children:"change"})," events whenever controllers connect, disconnect, or any controller input changes. The state payload includes the active count and a map of all managed controllers keyed by slot index."]})}),e.jsx(l,{code:'manager.on("change", ({ active, players }) => {\n  console.log(`${active} controller(s) connected`);\n  for (const [index, controller] of players) {\n    console.log(`Slot ${index}: ${controller.connection.state}`);\n  }\n});\n\n// Async iteration\nfor await (const { active } of manager) {\n  console.log(`Active controllers: ${active}`);\n}'}),e.jsx(c,{children:"Accessing Controllers"}),e.jsx(i,{children:e.jsx("p",{children:"Managed controllers are accessible by slot index or as an array. Disconnected controllers remain in their slots so that output state (rumble, lightbar, trigger effects) can be restored automatically when they reconnect."})}),e.jsx(l,{code:`// By index
const p1 = manager.get(0);
const p2 = manager.get(1);

// As an array
manager.controllers.forEach((controller, i) => {
  console.log(\`Player \${i + 1}: \${controller.connection.state}\`);
});

// Iterable
for (const controller of manager) {
  console.log(controller.factoryInfo.colorName);
}

// Counts
manager.count;  // total managed (including disconnected)
manager.active; // true if any controller is connected`}),e.jsx(c,{children:"Identity & Reconnection"}),e.jsxs(i,{children:[e.jsxs("p",{children:["When a controller connects, the manager reads its firmware and factory info to derive a stable hardware identity. If a disconnected slot matches the same identity, the device is transparently"," ",e.jsx("em",{children:"transplanted"})," into the existing slot — the consumer's"," ",e.jsx("code",{children:"Dualsense"})," reference never changes, and all output state is restored automatically."]}),e.jsxs("p",{children:["Identity is resolved from the most specific source available: factory serial number (via a test command protocol), or the"," ",e.jsx("code",{children:"deviceInfo"})," blob from Feature Report 0x20. This is far more reliable than the serial number reported by the OS HID layer, which can be missing or wrong."]})]}),e.jsxs(D,{children:["Newly connected controllers appear in a ",e.jsx("em",{children:"provisional"})," state while identity is being resolved. The ",e.jsx("code",{children:"pending"})," property is"," ",e.jsx("code",{children:"true"})," during this window. Provisional controllers are hidden from ",e.jsx("code",{children:"controllers"}),", ",e.jsx("code",{children:"count"}),", and"," ",e.jsx("code",{children:"state.players"})," to prevent consumers from seeing a slot that may be merged moments later."]}),e.jsx(l,{code:`// Check if any controllers are still being identified
if (manager.pending) {
  console.log("Resolving controller identity...");
}

// Identity-based reconnection is automatic
// Disconnect player 1, reconnect it — same slot, same state
controller.lightbar.set({ r: 255, g: 0, b: 0 });
// ... disconnect ... reconnect ...
// Lightbar is still red — no re-send needed`}),e.jsx(c,{children:"Player LED Assignment"}),e.jsxs(i,{children:[e.jsxs("p",{children:["By default, the manager assigns player LED patterns matching the PS5 console convention: Player 1 gets one center LED, Player 2 gets two inner LEDs, and so on. The first four patterns match"," ",e.jsx("code",{children:"PlayerID.Player1"})," through ",e.jsx("code",{children:"PlayerID.Player4"}),". Players 5–31 use the remaining 5-bit patterns, ordered for visual distinctiveness."]}),e.jsx("p",{children:"Automatic assignment can be disabled, and individual patterns can be overridden at any time."})]}),e.jsx(l,{code:`// Disable auto-assignment
const manager = new DualsenseManager({ autoAssignPlayerLeds: false });
// ...or toggle at runtime
manager.autoAssignPlayerLeds = false;

// Override a specific slot's pattern (5-bit bitmask, 0x00–0x1f)
manager.setPlayerPattern(0, 0x1f); // All 5 LEDs on for Player 1
manager.getPlayerPattern(0);       // 0x1f`}),e.jsx(c,{children:"Slot Management"}),e.jsx(i,{children:e.jsx("p",{children:"Release slots to free them for reuse. Releasing a slot disconnects the controller (if still connected), removes identity mappings, and re-indexes the remaining slots — including updating their player LED assignments."})}),e.jsx(l,{code:`// Release a specific slot
manager.release(0);

// Release only disconnected controllers
manager.releaseDisconnected();

// Shut down entirely — stops discovery and disconnects all
manager.dispose();`}),e.jsx(c,{children:"WebHID vs Node.js"}),e.jsxs(i,{children:[e.jsx("p",{children:"The manager adapts its discovery mechanism to the runtime environment."}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Browser (WebHID):"})," Controllers are added through the device picker (user gesture required). Already-permitted devices are re-discovered on page load via periodic enumeration. The"," ",e.jsx("code",{children:"connect"})," event on ",e.jsx("code",{children:"navigator.hid"})," catches newly-permitted devices."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Node.js (node-hid):"})," Controllers are discovered automatically via USB vendor/product ID polling. No user interaction needed. The polling interval is configurable via"," ",e.jsx("code",{children:"discoveryInterval"})," (default: 2000ms)."]})]})]}),e.jsx(l,{code:`// Browser — user must click to grant access
const request = manager.getRequest();
document.getElementById("connect")!.onclick = request;

// Node.js — auto-discovery with custom interval
const manager = new DualsenseManager({ discoveryInterval: 500 });`})]});export{Q as default};
