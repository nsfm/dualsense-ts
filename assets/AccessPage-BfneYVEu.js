import{a as n,d as l,j as t,g as o,E as O}from"./index-Bm_ty-o0.js";const k=typeof navigator<"u"&&"hid"in navigator;function z(){const e=n.useRef(null),d=n.useRef(null),i=n.useRef(null),[c,f]=n.useState(!1),[,x]=n.useState(0);if(!i.current&&k){const a=new l.AccessWebHIDProvider,r=new l.AccessHID(a),h=new l.DualsenseAccess({hid:r});e.current=a,d.current=r,i.current=h}n.useEffect(()=>{const a=i.current;if(!a)return;const r=()=>{f(a.connection.state)},h=()=>x(g=>g+1);return a.connection.on("change",r),a.on("change",h),()=>{a.connection.removeListener("change",r),a.removeListener("change",h)}},[]);const b=n.useCallback(()=>{e.current&&e.current.getRequest()()},[]);return{access:i.current,connected:c,requestConnect:b,supported:k}}const S=o.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px 80px;
`,$=o.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
`,I=o.p`
  color: rgba(191, 204, 214, 0.6);
  margin-bottom: 32px;
`,P=o.section`
  margin-bottom: 32px;
`,C=o.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: rgba(191, 204, 214, 0.85);
`,L=o.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
`,m=o.div`
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
`,v=o.code`
  font-size: 12px;
  color: rgba(191, 204, 214, 0.6);
`,M=o.span`
  font-size: 14px;
  font-weight: 600;
  color: ${e=>e.$active?"#f29e02":"rgba(191, 204, 214, 0.3)"};
`,F=o.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`,N=O`
  0%, 100% { box-shadow: 0 0 0 0 rgba(242, 158, 2, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(242, 158, 2, 0); }
`,T=o.button`
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
`,A=o.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  font-size: 13px;
  color: rgba(191, 204, 214, 0.6);
  margin-bottom: 24px;
`,H=o.span`
  color: ${e=>e.$color??"rgba(191, 204, 214, 0.85)"};
  font-weight: 500;
`,W=o.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.12);
`,q=o.div`
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #f29e02;
  left: ${e=>50+e.$x*45}%;
  top: ${e=>50-e.$y*45}%;
  transform: translate(-50%, -50%);
  transition: all 0.03s;
`,V=o.input`
  width: 40px;
  height: 28px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: transparent;
`,B=o.select`
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
`,X=o.button`
  background: ${e=>e.$on?"rgba(76, 175, 80, 0.2)":"rgba(0, 0, 0, 0.2)"};
  border: 1px solid ${e=>e.$on?"rgba(76, 175, 80, 0.5)":"rgba(255, 255, 255, 0.1)"};
  border-radius: 4px;
  color: ${e=>e.$on?"#4caf50":"rgba(191, 204, 214, 0.5)"};
  font-size: 13px;
  padding: 4px 12px;
  cursor: pointer;
`;function D(e){const[d,i]=n.useState(!1);return n.useEffect(()=>{if(!e)return;i(e.state);const c=()=>i(e.state);return e.on("change",c),()=>{e.removeListener("change",c)}},[e]),d}const p=({label:e,input:d})=>{const i=D(d);return t.jsxs(m,{$active:i,children:[t.jsx(M,{$active:i,children:i?"ON":"—"}),t.jsx(v,{children:e})]})},Y=({access:e})=>{const[d,i]=n.useState(0),[c,f]=n.useState(0),x=D(e==null?void 0:e.stick.button);return n.useEffect(()=>{if(!e)return;const b=()=>{i(e.stick.x.state),f(e.stick.y.state)};return e.stick.on("change",b),()=>{e.stick.removeListener("change",b)}},[e]),t.jsxs(F,{children:[t.jsx(W,{children:t.jsx(q,{$x:d,$y:c})}),t.jsxs("div",{children:[t.jsxs("div",{style:{fontSize:13,color:"rgba(191,204,214,0.6)"},children:["X: ",d.toFixed(2)," · Y: ",c.toFixed(2)]}),t.jsxs("div",{style:{fontSize:13,color:x?"#f29e02":"rgba(191,204,214,0.3)"},children:["Click: ",x?"pressed":"—"]})]})]})},G=({access:e})=>{const[d,i]=n.useState("#0000ff"),[c,f]=n.useState(l.AccessProfileLedMode.On),[x,b]=n.useState(l.AccessPlayerIndicator.Off),[a,r]=n.useState(!0),h=n.useCallback(u=>{const s=u.target.value;if(i(s),!e)return;const j=parseInt(s.slice(1,3),16),R=parseInt(s.slice(3,5),16),E=parseInt(s.slice(5,7),16);e.lightbar.set({r:j,g:R,b:E})},[e]),g=n.useCallback(u=>{const s=Number(u.target.value);f(s),e==null||e.profileLeds.set(s)},[e]),y=n.useCallback(u=>{const s=Number(u.target.value);b(s),e==null||e.playerIndicator.set(s)},[e]),w=n.useCallback(()=>{const u=!a;r(u),e==null||e.statusLed.set(u)},[e,a]);return t.jsxs(L,{style:{gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))"},children:[t.jsxs(m,{children:[t.jsx(v,{children:"Lightbar"}),t.jsx(V,{type:"color",value:d,onChange:h})]}),t.jsxs(m,{children:[t.jsx(v,{children:"Profile LEDs"}),t.jsxs(B,{value:c,onChange:g,children:[t.jsx("option",{value:l.AccessProfileLedMode.Off,children:"Off"}),t.jsx("option",{value:l.AccessProfileLedMode.On,children:"On"}),t.jsx("option",{value:l.AccessProfileLedMode.Fade,children:"Fade"}),t.jsx("option",{value:l.AccessProfileLedMode.Sweep,children:"Sweep"})]})]}),t.jsxs(m,{children:[t.jsx(v,{children:"Player Indicator"}),t.jsxs(B,{value:x,onChange:y,children:[t.jsx("option",{value:l.AccessPlayerIndicator.Off,children:"Off"}),t.jsx("option",{value:l.AccessPlayerIndicator.Player1,children:"Player 1"}),t.jsx("option",{value:l.AccessPlayerIndicator.Player2,children:"Player 2"}),t.jsx("option",{value:l.AccessPlayerIndicator.Player3,children:"Player 3"}),t.jsx("option",{value:l.AccessPlayerIndicator.Player4,children:"Player 4"})]})]}),t.jsxs(m,{children:[t.jsx(v,{children:"Status LED"}),t.jsx(X,{$on:a,onClick:w,children:a?"ON":"OFF"})]})]})},J=()=>{const{access:e,connected:d,requestConnect:i,supported:c}=z(),[f,x]=n.useState(0),[b,a]=n.useState(1),[r,h]=n.useState(null);return n.useEffect(()=>{if(!e)return;const g=()=>x(Math.round(e.battery.level.state*100)),y=()=>a(e.profileId.state);e.battery.on("change",g),e.profileId.on("change",y);const w=e.hid.onReady(()=>{const u=e.firmwareInfo,s=e.factoryInfo,j=u.mainFirmwareVersion;h({firmware:`${j.major}.${j.minor}.${j.patch}`,serial:s.serialNumber!=="unknown"?s.serialNumber:"",buildDate:u.buildDate||"",color:s.colorName!=="unknown"?s.colorName:"",board:s.boardRevision!=="unknown"?s.boardRevision:"",mac:e.hid.macAddress||""})});return()=>{e.battery.removeListener("change",g),e.profileId.removeListener("change",y),w()}},[e]),c?t.jsxs(S,{children:[t.jsx($,{children:"DualSense Access"}),t.jsx(I,{children:"Raw hardware inputs, battery, profile, and 4 LED systems."}),d?t.jsxs(t.Fragment,{children:[t.jsxs(A,{children:[t.jsx(H,{$color:"#4caf50",children:"Connected"}),t.jsx("span",{children:e!=null&&e.wireless?"Bluetooth":"USB"}),t.jsxs("span",{children:["Battery: ",f,"%"]}),t.jsxs("span",{children:["Profile: ",b]})]}),r&&t.jsxs(A,{children:[r.firmware&&t.jsxs("span",{children:["FW: ",r.firmware]}),r.buildDate&&t.jsxs("span",{children:["Built: ",r.buildDate]}),r.serial&&t.jsxs("span",{children:["S/N: ",r.serial]}),r.board&&t.jsxs("span",{children:["Board: ",r.board]}),r.color&&t.jsxs("span",{children:["Color: ",r.color]}),r.mac&&t.jsxs("span",{children:["MAC: ",r.mac]})]}),t.jsxs(P,{children:[t.jsx(C,{children:"Buttons"}),t.jsxs(L,{children:[t.jsx(p,{label:"B1",input:e==null?void 0:e.b1}),t.jsx(p,{label:"B2",input:e==null?void 0:e.b2}),t.jsx(p,{label:"B3",input:e==null?void 0:e.b3}),t.jsx(p,{label:"B4",input:e==null?void 0:e.b4}),t.jsx(p,{label:"B5",input:e==null?void 0:e.b5}),t.jsx(p,{label:"B6",input:e==null?void 0:e.b6}),t.jsx(p,{label:"B7",input:e==null?void 0:e.b7}),t.jsx(p,{label:"B8",input:e==null?void 0:e.b8}),t.jsx(p,{label:"Center",input:e==null?void 0:e.center}),t.jsx(p,{label:"PS",input:e==null?void 0:e.ps}),t.jsx(p,{label:"Profile",input:e==null?void 0:e.profile})]})]}),t.jsxs(P,{children:[t.jsx(C,{children:"Analog Stick"}),t.jsx(Y,{access:e})]}),t.jsxs(P,{children:[t.jsx(C,{children:"LED Controls"}),t.jsx(G,{access:e})]})]}):t.jsx(P,{children:t.jsx(T,{onClick:i,children:"Connect Access Controller"})})]}):t.jsxs(S,{children:[t.jsx($,{children:"DualSense Access"}),t.jsx(I,{children:"WebHID is not supported in this browser."})]})};export{J as default};
