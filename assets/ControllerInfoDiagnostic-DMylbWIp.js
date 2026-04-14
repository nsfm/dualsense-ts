import{a as l,C as x,j as n,d as y,g as s,R as C}from"./index-Bm_ty-o0.js";const $=s.div`
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  margin: 16px 0;
  overflow: hidden;
`,S=s.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.18);
`,j=s.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(191, 204, 214, 0.35);
`,k=s.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 16px;
  background: ${e=>e.$even?"rgba(0, 0, 0, 0.12)":"rgba(0, 0, 0, 0.06)"};
`,V=s.code`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.85);
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
`,g=s.span`
  color: rgba(191, 204, 214, 0.3);
`,F=s.code`
  font-size: 12px;
  flex-shrink: 0;
  text-align: right;
  color: ${e=>e.$highlight?"#f29e02":"rgba(191, 204, 214, 0.5)"};
  transition: color 0.06s;
`,L=({data:e,even:o})=>{const t=e.label.split(".");return n.jsxs(k,{$even:o,children:[n.jsxs(V,{children:[n.jsx(g,{children:"controller."}),t.map((r,c)=>n.jsxs(C.Fragment,{children:[c>0&&n.jsx(g,{children:"."}),c===t.length-1?r:n.jsx(g,{children:r})]},c))]}),n.jsx(F,{$highlight:e.highlight,children:e.value})]})},b=({rows:e})=>n.jsxs($,{children:[n.jsxs(S,{children:[n.jsx(j,{style:{flex:1},children:"property"}),n.jsx(j,{style:{textAlign:"right"},children:"value"})]}),e.map((o,t)=>n.jsx(L,{data:o,even:t%2===1},o.label))]}),z={"00":"#e8e8e8","01":"#1a1a2e","02":"#c8102e","03":"#f2a6c0","04":"#6b3fa0","05":"#5b9bd5","06":"#8a9a7b","07":"#9b2335","08":"#c0c0c0","09":"#1e3a5f",10:"#2db5a0",11:"#3d4f7c",12:"#e8dfd0",30:"#4a4a4a"},D=s.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0;
  padding: 16px;
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
`,N=s.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${e=>e.$color};
  border: 2px solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
`,R=s.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`,E=s.span`
  font-size: 15px;
  color: rgba(191, 204, 214, 0.9);
  font-weight: 500;
`,T=s.span`
  font-size: 12px;
  color: rgba(191, 204, 214, 0.4);
  font-family: "Fira Code", monospace;
`;function B(e){return`${e.major}.${e.minor}.${e.patch}`}const H=s.div`
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 20px 24px;
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  margin: 16px 0;
`,M=s.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${e=>e.$connected?"rgba(61, 204, 145, 0.12)":"rgba(255, 255, 255, 0.04)"};
  border: 2px solid ${e=>e.$connected?"rgba(61, 204, 145, 0.5)":"rgba(255, 255, 255, 0.1)"};
  transition: all 0.3s;
`,I=s.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${e=>e.$connected?"rgba(72, 175, 240, 0.12)":"rgba(255, 255, 255, 0.04)"};
  border: 2px solid ${e=>e.$connected?"rgba(72, 175, 240, 0.4)":"rgba(255, 255, 255, 0.1)"};
  transition: all 0.3s;
`,w=s.svg`
  fill: ${e=>e.$active?"rgba(191, 204, 214, 0.9)":"rgba(191, 204, 214, 0.2)"};
  transition: fill 0.3s;
`,p=s.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`,m=s.span`
  font-size: 15px;
  font-weight: 500;
  color: ${e=>e.$active?"rgba(191, 204, 214, 0.9)":"rgba(191, 204, 214, 0.35)"};
  transition: color 0.3s;
`,v=s.code`
  font-size: 12px;
  color: rgba(191, 204, 214, 0.4);
`,U=s.div`
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
`,A=({active:e})=>n.jsx(w,{$active:e,width:"22",height:"22",viewBox:"0 0 24 24",children:n.jsx("path",{d:"M15 7v4h1v2h-3V5h2l-3-4-3 4h2v8H8v-2.07A1.993 1.993 0 0 0 8 7a2 2 0 0 0-4 0c0 .74.4 1.38 1 1.73V13a2 2 0 0 0 2 2h3v2.27c-.6.35-1 .99-1 1.73a2 2 0 0 0 4 0c0-.74-.4-1.38-1-1.73V15h3a2 2 0 0 0 2-2v-2h1V7h-3z"})}),P=({active:e})=>n.jsx(w,{$active:e,width:"22",height:"22",viewBox:"0 0 24 24",children:n.jsx("path",{d:"M17.71 7.71 12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z"})}),q=({active:e})=>n.jsx(w,{$active:e,width:"22",height:"22",viewBox:"0 0 24 24",children:n.jsx("path",{d:"M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7a5 5 0 0 0 0 10h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4a5 5 0 0 0 0-10z"})}),K=()=>{const e=l.useContext(x),[,o]=l.useState(0);l.useEffect(()=>{const i=()=>o(a=>a+1);return e.connection.on("change",i),()=>{e.connection.removeListener("change",i)}},[e]);const t=e.connection.state,r=t&&e.wireless,c=t&&!e.wireless;return n.jsxs(n.Fragment,{children:[n.jsxs(H,{children:[n.jsx(M,{$connected:t,children:n.jsx(q,{active:t})}),n.jsxs(p,{children:[n.jsx(m,{$active:t,children:t?"Connected":"Disconnected"}),n.jsxs(v,{children:[n.jsx(g,{children:"controller."}),"connection",n.jsx(g,{children:"."}),"state ="," ",t?"true":"false"]})]}),n.jsx(U,{}),n.jsx(I,{$connected:c,children:n.jsx(A,{active:c})}),n.jsxs(p,{children:[n.jsx(m,{$active:c,children:"USB"}),n.jsx(v,{children:"wired"})]}),n.jsx(I,{$connected:r,children:n.jsx(P,{active:r})}),n.jsxs(p,{children:[n.jsx(m,{$active:r,children:"Bluetooth"}),n.jsx(v,{children:"wireless"})]})]}),n.jsx(b,{rows:[{label:"connection.state",value:t?"true":"false",highlight:t},{label:"wireless",value:t?e.wireless?"true":"false":"—",highlight:r}]})]})},O=()=>{const e=l.useContext(x),[o,t]=l.useState(e.factoryInfo),[r,c]=l.useState(e.connection.state);l.useEffect(()=>{c(e.connection.state),t(e.factoryInfo);const d=()=>t(e.factoryInfo),f=({state:u})=>c(u);return e.on("change",d),e.connection.on("change",f),()=>{e.removeListener("change",d),e.connection.removeListener("change",f)}},[e]);const i=e.color,a=z[o.colorCode],h=i!==y.DualsenseColor.Unknown;return n.jsxs(n.Fragment,{children:[r&&h&&a&&n.jsxs(D,{children:[n.jsx(N,{$color:a}),n.jsxs(R,{children:[n.jsx(E,{children:o.colorName}),n.jsxs(T,{children:["code ",o.colorCode," · ",o.boardRevision]})]})]}),n.jsx(b,{rows:[{label:"color",value:r?String(i):"—",highlight:r&&h},{label:"factoryInfo.colorCode",value:r?o.colorCode:"—"},{label:"factoryInfo.colorName",value:r?o.colorName:"—",highlight:r&&h},{label:"factoryInfo.boardRevision",value:r?o.boardRevision:"—"}]})]})},G=s.code`
  font-size: 16px;
  color: #f29e02;
  letter-spacing: 1px;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  display: block;
  text-align: center;
  margin: 16px 0;
  user-select: all;
`,Q=()=>{const e=l.useContext(x),[o,t]=l.useState(e.factoryInfo),[r,c]=l.useState(e.connection.state);l.useEffect(()=>{c(e.connection.state),t(e.factoryInfo);const h=()=>t(e.factoryInfo),d=({state:f})=>c(f);return e.on("change",h),e.connection.on("change",d),()=>{e.removeListener("change",h),e.connection.removeListener("change",d)}},[e]);const i=o.serialNumber,a=r&&i!=="unknown";return n.jsxs(n.Fragment,{children:[n.jsx(G,{children:a?i:"—"}),n.jsx(b,{rows:[{label:"serialNumber",value:a?i:"—",highlight:a},{label:"factoryInfo.serialNumber",value:a?i:"—",highlight:a}]})]})},W=()=>{const e=l.useContext(x),[o,t]=l.useState(e.firmwareInfo),[r,c]=l.useState(e.connection.state);l.useEffect(()=>{c(e.connection.state),t(e.firmwareInfo);const d=()=>t(e.firmwareInfo),f=({state:u})=>c(u);return e.on("change",d),e.connection.on("change",f),()=>{e.removeListener("change",d),e.connection.removeListener("change",f)}},[e]);const i=d=>r?B(d):"—",a=d=>r?String(d):"—",h=[{label:"firmwareInfo.buildDate",value:a(o.buildDate),highlight:r&&o.buildDate!=="unknown"},{label:"firmwareInfo.buildTime",value:a(o.buildTime)},{label:"firmwareInfo.firmwareType",value:a(o.firmwareType)},{label:"firmwareInfo.softwareSeries",value:a(o.softwareSeries)},{label:"firmwareInfo.hardwareInfo",value:r?`0x${(o.hardwareInfo&65535).toString(16).padStart(4,"0")}`:"—"},{label:"firmwareInfo.mainFirmwareVersion",value:i(o.mainFirmwareVersion),highlight:r},{label:"firmwareInfo.sblFirmwareVersion",value:i(o.sblFirmwareVersion)},{label:"firmwareInfo.dspFirmwareVersion",value:a(o.dspFirmwareVersion)},{label:"firmwareInfo.spiderDspFirmwareVersion",value:i(o.spiderDspFirmwareVersion)},{label:"firmwareInfo.deviceInfo",value:a(o.deviceInfo)},{label:"firmwareInfo.updateVersion",value:a(o.updateVersion)},{label:"firmwareInfo.updateImageInfo",value:a(o.updateImageInfo)}];return n.jsx(b,{rows:h})},X=()=>{const e=l.useContext(x),[o,t]=l.useState(e.factoryInfo),[r,c]=l.useState(e.connection.state);l.useEffect(()=>{c(e.connection.state),t(e.factoryInfo);const h=()=>t(e.factoryInfo),d=({state:f})=>c(f);return e.on("change",h),e.connection.on("change",d),()=>{e.removeListener("change",h),e.connection.removeListener("change",d)}},[e]);const i=h=>r?h:"—",a=[{label:"factoryInfo.serialNumber",value:i(o.serialNumber),highlight:r&&o.serialNumber!=="unknown"},{label:"factoryInfo.colorName",value:i(o.colorName),highlight:r&&o.colorName!=="unknown"},{label:"factoryInfo.colorCode",value:i(o.colorCode)},{label:"factoryInfo.boardRevision",value:i(o.boardRevision)}];return n.jsx(b,{rows:a})};export{K as C,W as F,Q as S,O as a,X as b};
