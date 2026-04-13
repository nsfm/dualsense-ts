import{a as d,C as m,j as e,u as C,R as x,g as r}from"./index-DwvD-yqT.js";import{T as y,B as p}from"./CodeBlock-CIY2ZnXU.js";import{B as b,a as w,b as L,c as S,L as $,R,D as B,C as M,d as P,e as W,T as A,O as F,f as H,F as E,g as O,P as T,M as Q,G as z}from"./PlayerLedControls-CQpb8_He.js";import{R as D,a as G}from"./RightStick-9V4eHetk.js";import"./BatteryVisualization-BVJoPKgw.js";const I=()=>{const t=d.useContext(m),[n,i]=d.useState(t.mute.status.state),[o,u]=d.useState(t.connection.state);if(d.useEffect(()=>{i(t.mute.status.state),u(t.connection.state),t.mute.status.on("change",({state:a})=>i(a)),t.connection.on("change",({state:a})=>u(a))},[t]),!o)return null;const h=e.jsxs("svg",{width:"10",height:"14",viewBox:"0 0 10 14",fill:"currentColor",style:{display:"block"},children:[e.jsx("rect",{x:"3",y:"0.5",width:"4",height:"8",rx:"2"}),e.jsx("path",{d:"M1 6.5 Q1 10.5 5 10.5 Q9 10.5 9 6.5",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round"}),e.jsx("line",{x1:"5",y1:"10.5",x2:"5",y2:"13",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round"}),e.jsx("line",{x1:"3",y1:"13",x2:"7",y2:"13",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round"}),n&&e.jsx("line",{x1:"1",y1:"1",x2:"9",y2:"12",stroke:"currentColor",strokeWidth:"1.4",strokeLinecap:"round"})]});return e.jsxs(y,{$minimal:!0,$intent:n?"warning":"none",children:[h," ",n?"Muted":"Mic On"]})},U=()=>{const t=d.useContext(m),[n,i]=d.useState(t.microphone.state),[o,u]=d.useState(t.headphone.state),[h,a]=d.useState(t.connection.state);if(d.useEffect(()=>{i(t.microphone.state),u(t.headphone.state),a(t.connection.state),t.microphone.on("change",({state:s})=>i(s)),t.headphone.on("change",({state:s})=>u(s)),t.connection.on("change",({state:s})=>a(s))},[t]),!h||!n&&!o)return null;let c;n&&o?c="Headset":o?c="Headphones":c="Mic";const l=e.jsx("svg",{width:"14",height:"14",viewBox:"0 0 14 14",fill:"currentColor",style:{display:"block"},children:o?e.jsxs(e.Fragment,{children:[e.jsx("path",{d:"M2 8 Q2 2 7 2 Q12 2 12 8",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round"}),e.jsx("rect",{x:"1",y:"7.5",width:"2.5",height:"4",rx:"1"}),e.jsx("rect",{x:"10.5",y:"7.5",width:"2.5",height:"4",rx:"1"}),n&&e.jsxs(e.Fragment,{children:[e.jsx("line",{x1:"3",y1:"11",x2:"5",y2:"13",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round"}),e.jsx("circle",{cx:"5.5",cy:"13",r:"1"})]})]}):e.jsxs(e.Fragment,{children:[e.jsx("rect",{x:"4.5",y:"1",width:"5",height:"7",rx:"2.5"}),e.jsx("path",{d:"M2.5 6.5 Q2.5 11 7 11 Q11.5 11 11.5 6.5",fill:"none",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round"}),e.jsx("line",{x1:"7",y1:"11",x2:"7",y2:"13",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round"}),e.jsx("line",{x1:"5",y1:"13",x2:"9",y2:"13",stroke:"currentColor",strokeWidth:"1.2",strokeLinecap:"round"})]})});return e.jsxs(y,{$minimal:!0,title:n&&o?"Headset with microphone connected":o?"Headphones connected (no microphone)":"Microphone connected (no headphones)",children:[l," ",c]})},V=r.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`,_=r.div`
  padding: 0 0 16px;
`,X=r.h1`
  margin-bottom: 8px;
`,q=r.p`
  color: rgba(191, 204, 214, 0.6);
  font-size: 15px;
  margin: 0;
`,J=r.div`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
`,K=r.div`
  width: 100%;
  padding: 12px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  margin-bottom: 16px;
`,N=r.div`
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`,g=850,f=600,Y=r.div`
  opacity: ${t=>t.$dimmed?.15:1};
  pointer-events: ${t=>t.$dimmed?"none":"auto"};
  transition: opacity 0.4s;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto auto auto auto minmax(0, 1fr);
  grid-template-rows: auto auto auto auto;
  grid-template-areas:
    "l-shoulder  .       gyro   gyro   gyro    .        r-shoulder"
    "l-upper     create  tp     tp     tp      options  r-upper"
    ".           l-lower .      ps     .       r-lower  ."
    ".           .       .      .      .       .        .";
  gap: 0px 2px;
  align-items: center;
  align-content: center;
  justify-items: center;
  padding: 8px 12px;
  width: ${g}px;
  transform-origin: 0 0;
`,Z=r.div` grid-area: l-shoulder; `,ee=r.div` grid-area: r-shoulder; `,te=r.div` grid-area: l-upper; `,re=r.div`
  grid-area: create;
  align-self: start;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`,ne=r.div`
  grid-area: tp;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
`,oe=r.div`
  grid-area: options;
  align-self: start;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`,se=r.div` grid-area: r-upper; `,ie=r.div` grid-area: l-lower; `,ae=r.div` grid-area: r-lower; `,ce=r.div`
  grid-area: ps;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`,le=r.div` grid-area: gyro; `,ge=()=>{C();const[t,n]=x.useState(null),[i,o]=x.useState(1),u=x.useRef(null),a=x.useContext(m).connection.state;x.useEffect(()=>{const l=u.current;if(!l)return;const s=()=>{const k=l.clientWidth/g,v=l.clientHeight/f;o(Math.min(k,v,1.6))},j=new ResizeObserver(s);return j.observe(l),s(),()=>j.disconnect()},[]);const c=l=>n(s=>s===l?null:l);return e.jsxs(V,{children:[e.jsxs(_,{children:[e.jsx(X,{children:"Playground"}),e.jsx(q,{children:"Full controller visualization with all features. Connect a controller and explore — if you have multiple controllers connected, select the active one from the top bar."})]}),a&&e.jsxs(J,{children:[e.jsx(b,{}),e.jsx(I,{}),e.jsx(U,{}),e.jsx(w,{}),e.jsx(L,{}),e.jsx(p,{$small:!0,$active:t==="triggers",onClick:()=>c("triggers"),children:"Trigger FX"}),e.jsx(p,{$small:!0,$active:t==="audio",onClick:()=>c("audio"),children:"Audio"}),e.jsx(p,{$small:!0,$active:t==="motion",onClick:()=>c("motion"),children:"Sensor Fusion"}),e.jsx(p,{$small:!0,$active:t==="debug",onClick:()=>c("debug"),children:"Debug"})]}),t&&e.jsx(K,{children:e.jsx(S,{panel:t})}),e.jsx(N,{ref:u,children:e.jsx("div",{style:{width:g*i,height:f*i},children:e.jsxs(Y,{$dimmed:!a,style:{transform:`scale(${i})`},children:[e.jsx(Z,{children:e.jsx($,{})}),e.jsx(ee,{children:e.jsx(R,{})}),e.jsx(te,{children:e.jsx(B,{})}),e.jsxs(re,{children:[e.jsx(M,{}),e.jsx(P,{})]}),e.jsxs(ne,{children:[e.jsx(W,{}),e.jsx(A,{})]}),e.jsxs(oe,{children:[e.jsx(F,{}),e.jsx(H,{})]}),e.jsx(se,{children:e.jsx(E,{})}),e.jsx(ie,{children:e.jsx(D,{})}),e.jsxs(ce,{children:[e.jsx(O,{}),e.jsx(T,{}),e.jsx(Q,{})]}),e.jsx(ae,{children:e.jsx(G,{})}),e.jsx(le,{children:e.jsx(z,{})})]})})})]})};export{ge as default};
