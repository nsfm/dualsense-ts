import{a as r,d as u,j as t,g as a,E as T}from"./index-l8CS40p9.js";const $=typeof navigator<"u"&&"hid"in navigator;function z(){const e=r.useRef(null),l=r.useRef(null),o=r.useRef(null),[p,c]=r.useState(!1),[,x]=r.useState(0);if(!o.current&&$){const s=new u.AccessWebHIDProvider,i=new u.AccessHID(s),b=new u.DualsenseAccess({hid:i});e.current=s,l.current=i,o.current=b}r.useEffect(()=>{const s=o.current;if(!s)return;const i=()=>{c(s.connection.state)},b=()=>x(h=>h+1);return s.connection.on("change",i),s.on("change",b),()=>{s.connection.removeListener("change",i),s.removeListener("change",b)}},[]);const f=r.useCallback(()=>{e.current&&e.current.getRequest()()},[]);return{access:o.current,connected:p,requestConnect:f,supported:$}}const L=a.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px 80px;
`,A=a.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
`,I=a.p`
  color: rgba(191, 204, 214, 0.6);
  margin-bottom: 32px;
`,m=a.section`
  margin-bottom: 32px;
`,P=a.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: rgba(191, 204, 214, 0.85);
`,S=a.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
`,v=a.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  border-radius: 6px;
  background: ${e=>e.$active?"rgba(242, 158, 2, 0.12)":"rgba(0, 0, 0, 0.12)"};
  border: 1px solid
    ${e=>e.$active?"rgba(242, 158, 2, 0.3)":"rgba(255, 255, 255, 0.06)"};
  transition: all 0.06s;
`,y=a.code`
  font-size: 12px;
  color: rgba(191, 204, 214, 0.6);
`,M=a.span`
  font-size: 14px;
  font-weight: 600;
  color: ${e=>e.$active?"#f29e02":"rgba(191, 204, 214, 0.3)"};
`;a.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;const N=T`
  0%, 100% { box-shadow: 0 0 0 0 rgba(242, 158, 2, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(242, 158, 2, 0); }
`,q=a.button`
  animation: ${N} 2s ease-in-out infinite;
  background: transparent;
  border: 1px solid rgba(242, 158, 2, 0.5);
  border-radius: 6px;
  color: #f29e02;
  font-size: 14px;
  font-weight: 500;
  padding: 10px 24px;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: rgba(242, 158, 2, 0.1);
  }
`,B=a.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  font-size: 13px;
  color: rgba(191, 204, 214, 0.6);
  margin-bottom: 24px;
`,H=a.span`
  color: ${e=>e.$color??"rgba(191, 204, 214, 0.85)"};
  font-weight: 500;
`,V=a.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.12);
`,W=a.div`
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${e=>e.$color??"#f29e02"};
  left: ${e=>50+e.$x*45}%;
  top: ${e=>50-e.$y*45}%;
  transform: translate(-50%, -50%);
  transition: all 0.03s;
`,U=a.input`
  width: 40px;
  height: 28px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: transparent;
`,D=a.select`
  background: #1a1a2e;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: rgba(191, 204, 214, 0.85);
  font-size: 13px;
  padding: 4px 8px;

  option {
    background: #1a1a2e;
    color: rgba(191, 204, 214, 0.85);
  }
`,G=a.button`
  background: ${e=>e.$on?"rgba(76, 175, 80, 0.2)":"rgba(0, 0, 0, 0.2)"};
  border: 1px solid ${e=>e.$on?"rgba(76, 175, 80, 0.5)":"rgba(255, 255, 255, 0.1)"};
  border-radius: 4px;
  color: ${e=>e.$on?"#4caf50":"rgba(191, 204, 214, 0.5)"};
  font-size: 13px;
  padding: 4px 12px;
  cursor: pointer;
`,R=({label:e,input:l})=>{const[o,p]=r.useState(0);r.useEffect(()=>{if(!l)return;p(l.state);const x=()=>p(l.state);return l.on("change",x),()=>{l.removeListener("change",x)}},[l]);const c=Math.abs(o)>.05;return t.jsxs(v,{$active:c,children:[t.jsx(M,{$active:c,children:o.toFixed(2)}),t.jsx(y,{children:e})]})};function O(e){const[l,o]=r.useState(!1);return r.useEffect(()=>{if(!e)return;o(e.state);const p=()=>o(e.state);return e.on("change",p),()=>{e.removeListener("change",p)}},[e]),l}const n=({label:e,input:l})=>{const o=O(l);return t.jsxs(v,{$active:o,children:[t.jsx(M,{$active:o,children:o?"ON":"—"}),t.jsx(y,{children:e})]})},J=a.td`
  text-align: center;
  vertical-align: top;
  padding: 0 12px;
`,K=a.div`
  font-size: 12px;
  color: rgba(191, 204, 214, 0.5);
  margin-bottom: 6px;
`,Q=a.div`
  font-size: 13px;
  font-family: "Fira Code", monospace;
  color: rgba(191, 204, 214, 0.6);
  margin-top: 8px;
`,k=({label:e,stickX:l,stickY:o,button:p,color:c})=>{const[x,f]=r.useState(0),[s,i]=r.useState(0),b=O(p);return r.useEffect(()=>{if(!l||!o)return;const h=()=>f(l.state),j=()=>i(o.state);return l.on("change",h),o.on("change",j),()=>{l.removeListener("change",h),o.removeListener("change",j)}},[l,o]),t.jsxs(J,{children:[t.jsx(K,{children:e}),t.jsx(V,{children:t.jsx(W,{$x:x,$y:s,$color:c})}),t.jsxs(Q,{children:[x>=0?" ":"",x.toFixed(2),", ",s>=0?" ":"",s.toFixed(2),t.jsx("br",{}),t.jsx("span",{style:{color:b?c??"#f29e02":"rgba(191,204,214,0.3)"},children:b?"click":"     "})]})]})},X=({access:e})=>{const[l,o]=r.useState("#0000ff"),[p,c]=r.useState(u.AccessProfileLedMode.On),[x,f]=r.useState(u.AccessPlayerIndicator.Off),[s,i]=r.useState(!0),b=r.useCallback(g=>{const d=g.target.value;if(o(d),!e)return;const C=parseInt(d.slice(1,3),16),E=parseInt(d.slice(3,5),16),F=parseInt(d.slice(5,7),16);e.lightbar.set({r:C,g:E,b:F})},[e]),h=r.useCallback(g=>{const d=Number(g.target.value);c(d),e==null||e.profileLeds.set(d)},[e]),j=r.useCallback(g=>{const d=Number(g.target.value);f(d),e==null||e.playerIndicator.set(d)},[e]),w=r.useCallback(()=>{const g=!s;i(g),e==null||e.statusLed.set(g)},[e,s]);return t.jsxs(S,{style:{gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))"},children:[t.jsxs(v,{children:[t.jsx(y,{children:"Lightbar"}),t.jsx(U,{type:"color",value:l,onChange:b})]}),t.jsxs(v,{children:[t.jsx(y,{children:"Profile LEDs"}),t.jsxs(D,{value:p,onChange:h,children:[t.jsx("option",{value:u.AccessProfileLedMode.Off,children:"Off"}),t.jsx("option",{value:u.AccessProfileLedMode.On,children:"On"}),t.jsx("option",{value:u.AccessProfileLedMode.Fade,children:"Fade"}),t.jsx("option",{value:u.AccessProfileLedMode.Sweep,children:"Sweep"})]})]}),t.jsxs(v,{children:[t.jsx(y,{children:"Player Indicator"}),t.jsxs(D,{value:x,onChange:j,children:[t.jsx("option",{value:u.AccessPlayerIndicator.Off,children:"Off"}),t.jsx("option",{value:u.AccessPlayerIndicator.Player1,children:"Player 1"}),t.jsx("option",{value:u.AccessPlayerIndicator.Player2,children:"Player 2"}),t.jsx("option",{value:u.AccessPlayerIndicator.Player3,children:"Player 3"}),t.jsx("option",{value:u.AccessPlayerIndicator.Player4,children:"Player 4"})]})]}),t.jsxs(v,{children:[t.jsx(y,{children:"Status LED"}),t.jsx(G,{$on:s,onClick:w,children:s?"ON":"OFF"})]})]})},Z=()=>{const{access:e,connected:l,requestConnect:o,supported:p}=z(),[c,x]=r.useState(0),[f,s]=r.useState(1),[i,b]=r.useState(null);return r.useEffect(()=>{if(!e)return;const h=()=>x(Math.round(e.battery.level.state*100)),j=()=>s(e.profileId.state);e.battery.on("change",h),e.profileId.on("change",j);const w=e.hid.onReady(()=>{const g=e.firmwareInfo,d=e.factoryInfo,C=g.mainFirmwareVersion;b({firmware:`${C.major}.${C.minor}.${C.patch}`,serial:d.serialNumber!=="unknown"?d.serialNumber:"",buildDate:g.buildDate||"",color:d.colorName!=="unknown"?d.colorName:"",board:d.boardRevision!=="unknown"?d.boardRevision:"",mac:e.hid.macAddress||""})});return()=>{e.battery.removeListener("change",h),e.profileId.removeListener("change",j),w()}},[e]),p?t.jsxs(L,{children:[t.jsx(A,{children:"Access Playground"}),t.jsx(I,{children:"Connect your DualSense Access controller to see all inputs and outputs live."}),l?t.jsxs(t.Fragment,{children:[t.jsxs(B,{children:[t.jsx(H,{$color:"#4caf50",children:"Connected"}),t.jsx("span",{children:e!=null&&e.wireless?"Bluetooth":"USB"}),t.jsxs("span",{children:["Battery: ",c,"%"]}),t.jsxs("span",{children:["Profile: ",f]})]}),i&&t.jsxs(B,{children:[i.firmware&&t.jsxs("span",{children:["FW: ",i.firmware]}),i.buildDate&&t.jsxs("span",{children:["Built: ",i.buildDate]}),i.serial&&t.jsxs("span",{children:["S/N: ",i.serial]}),i.board&&t.jsxs("span",{children:["Board: ",i.board]}),i.color&&t.jsxs("span",{children:["Color: ",i.color]}),i.mac&&t.jsxs("span",{children:["MAC: ",i.mac]})]}),t.jsxs(m,{children:[t.jsx(P,{children:"Hardware Buttons"}),t.jsxs(S,{children:[t.jsx(n,{label:"B1",input:e==null?void 0:e.b1}),t.jsx(n,{label:"B2",input:e==null?void 0:e.b2}),t.jsx(n,{label:"B3",input:e==null?void 0:e.b3}),t.jsx(n,{label:"B4",input:e==null?void 0:e.b4}),t.jsx(n,{label:"B5",input:e==null?void 0:e.b5}),t.jsx(n,{label:"B6",input:e==null?void 0:e.b6}),t.jsx(n,{label:"B7",input:e==null?void 0:e.b7}),t.jsx(n,{label:"B8",input:e==null?void 0:e.b8}),t.jsx(n,{label:"Center",input:e==null?void 0:e.center}),t.jsx(n,{label:"PS",input:e==null?void 0:e.ps}),t.jsx(n,{label:"Profile",input:e==null?void 0:e.profile})]})]}),t.jsxs(m,{children:[t.jsx(P,{children:"Sticks"}),t.jsx("table",{style:{width:"100%"},children:t.jsx("tbody",{children:t.jsxs("tr",{children:[t.jsx(k,{label:"Raw Stick",stickX:e==null?void 0:e.stick.x,stickY:e==null?void 0:e.stick.y,button:e==null?void 0:e.stick.button}),t.jsx(k,{label:"Mapped Left Stick",stickX:e==null?void 0:e.left.analog.x,stickY:e==null?void 0:e.left.analog.y,button:e==null?void 0:e.left.analog.button,color:"#48aff0"}),t.jsx(k,{label:"Mapped Right Stick",stickX:e==null?void 0:e.right.analog.x,stickY:e==null?void 0:e.right.analog.y,button:e==null?void 0:e.right.analog.button,color:"#4caf50"})]})})})]}),t.jsxs(m,{children:[t.jsx(P,{children:"Profile-Mapped Buttons"}),t.jsxs(S,{children:[t.jsx(n,{label:"Cross",input:e==null?void 0:e.cross}),t.jsx(n,{label:"Circle",input:e==null?void 0:e.circle}),t.jsx(n,{label:"Square",input:e==null?void 0:e.square}),t.jsx(n,{label:"Triangle",input:e==null?void 0:e.triangle}),t.jsx(n,{label:"D-Up",input:e==null?void 0:e.dpad.up}),t.jsx(n,{label:"D-Down",input:e==null?void 0:e.dpad.down}),t.jsx(n,{label:"D-Left",input:e==null?void 0:e.dpad.left}),t.jsx(n,{label:"D-Right",input:e==null?void 0:e.dpad.right}),t.jsx(n,{label:"L1",input:e==null?void 0:e.left.bumper}),t.jsx(n,{label:"R1",input:e==null?void 0:e.right.bumper}),t.jsx(n,{label:"Options",input:e==null?void 0:e.options}),t.jsx(n,{label:"Create",input:e==null?void 0:e.create}),t.jsx(n,{label:"Mute",input:e==null?void 0:e.mute}),t.jsx(n,{label:"Touchpad",input:e==null?void 0:e.touchpad.button})]})]}),t.jsxs(m,{children:[t.jsx(P,{children:"Mapped Triggers"}),t.jsxs(S,{style:{gridTemplateColumns:"repeat(auto-fill, minmax(120px, 1fr))"},children:[t.jsx(R,{label:"L2",input:e==null?void 0:e.left.trigger}),t.jsx(R,{label:"R2",input:e==null?void 0:e.right.trigger}),t.jsx(n,{label:"L2 Button",input:e==null?void 0:e.left.trigger.button}),t.jsx(n,{label:"R2 Button",input:e==null?void 0:e.right.trigger.button})]})]}),t.jsxs(m,{children:[t.jsx(P,{children:"LED Controls"}),t.jsx(X,{access:e})]})]}):t.jsx(m,{children:t.jsx(q,{onClick:o,children:"Connect Access Controller"})})]}):t.jsxs(L,{children:[t.jsx(A,{children:"Access Playground"}),t.jsx(I,{children:"WebHID is not supported in this browser."})]})};export{Z as default};
