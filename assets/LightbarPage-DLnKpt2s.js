import{j as e,g as o,a as t,C as R,L as z}from"./index-CqgUOPB5.js";import{F as E,P as g,S as b,D as T,H as G}from"./FeaturePage-CYJYceNC.js";import{a as k}from"./CodeBlock-D0xyfFu-.js";function P(r,n,a){return"#"+[r,n,a].map(l=>l.toString(16).padStart(2,"0")).join("")}function D(r){const n=parseInt(r.slice(1),16);return{r:n>>16&255,g:n>>8&255,b:n&255}}const S=o.div`
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
`,B=o.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.18);
`,v=o.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(191, 204, 214, 0.35);
`,O=o.div`
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.06);
`,I=o.div`
  position: relative;
  flex: 1;
  cursor: pointer;
`,V=o.div`
  height: 24px;
  border-radius: 12px;
  background: ${r=>r.$color};
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 10px ${r=>r.$color}66, 0 0 24px ${r=>r.$color}33;
  transition: box-shadow 0.2s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    box-shadow: 0 0 14px ${r=>r.$color}99, 0 0 32px ${r=>r.$color}55;
    transform: scaleY(1.1);
  }
`,Y=o.span`
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.9), 0 0 8px rgba(0, 0, 0, 0.6);
  pointer-events: none;
`,A=o.input`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`,u=o.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 16px;
  background: ${r=>r.$even?"rgba(0, 0, 0, 0.12)":"rgba(0, 0, 0, 0.06)"};
`,f=o.div`
  display: flex;
  align-items: center;
  gap: 14px;
`,j=o.code`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.85);
  flex: 1;
`,m=o.code`
  font-size: 12px;
  flex-shrink: 0;
  width: 4ch;
  text-align: right;
  color: ${r=>r.$color};
`,$=o.input`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.08);
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: ${r=>r.$color};
    cursor: pointer;
    border: none;
  }

  &::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: ${r=>r.$color};
    cursor: pointer;
    border: none;
  }
`,C=o.span`
  color: rgba(191, 204, 214, 0.3);
`,N=o.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px 16px;
  background: ${r=>r.$even?"rgba(0, 0, 0, 0.12)":"rgba(0, 0, 0, 0.06)"};
`,W=o.code`
  font-size: 12px;
  color: rgba(191, 204, 214, 0.5);
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
  text-align: left;
`,q=o.code`
  font-size: 12px;
  flex-shrink: 0;
  white-space: nowrap;
  text-align: right;
  color: ${r=>r.$highlight?"#f29e02":"rgba(191, 204, 214, 0.4)"};
  transition: color 0.06s;
`,J=()=>{const r=t.useContext(R),n=r.lightbar.color,[a,l]=t.useState(n.r),[i,p]=t.useState(n.g),[c,F]=t.useState(n.b),w=P(a,i,c),d=t.useCallback((s,h,x)=>{l(s),p(h),F(x),r.lightbar.set({r:s,g:h,b:x})},[r]),L=t.useCallback(s=>{const{r:h,g:x,b:H}=D(s.target.value);d(h,x,H)},[d]);return e.jsxs(e.Fragment,{children:[e.jsx(O,{children:e.jsxs(I,{children:[e.jsx(V,{$color:w,children:e.jsx(Y,{children:"click to pick"})}),e.jsx(A,{type:"color",value:w,onChange:L})]})}),e.jsxs(u,{children:[e.jsxs(f,{children:[e.jsx(j,{children:"Red"}),e.jsx(m,{$color:"#ff6b6b",children:a})]}),e.jsx($,{$color:"#ff6b6b",type:"range",min:0,max:255,step:1,value:a,onChange:s=>d(parseInt(s.target.value),i,c)})]}),e.jsxs(u,{$even:!0,children:[e.jsxs(f,{children:[e.jsx(j,{children:"Green"}),e.jsx(m,{$color:"#3dcc91",children:i})]}),e.jsx($,{$color:"#3dcc91",type:"range",min:0,max:255,step:1,value:i,onChange:s=>d(a,parseInt(s.target.value),c)})]}),e.jsxs(u,{children:[e.jsxs(f,{children:[e.jsx(j,{children:"Blue"}),e.jsx(m,{$color:"#48aff0",children:c})]}),e.jsx($,{$color:"#48aff0",type:"range",min:0,max:255,step:1,value:c,onChange:s=>d(a,i,parseInt(s.target.value))})]}),e.jsxs(N,{$even:!0,children:[e.jsx(W,{children:e.jsxs("bdi",{children:[e.jsx(C,{children:"controller."}),"lightbar",e.jsx(C,{children:"."}),"color"]})}),e.jsx(q,{$highlight:!0,children:`{ r: ${a}, g: ${i}, b: ${c} }`})]})]})},K=o.div`
  display: flex;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.06);
`,y=o.button`
  flex: 1;
  padding: 8px 0;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  border: 1px solid
    ${r=>r.$active?"rgba(72, 175, 240, 0.6)":"rgba(72, 175, 240, 0.4)"};
  background: ${r=>r.$active?"rgba(72, 175, 240, 0.25)":"rgba(72, 175, 240, 0.1)"};
  color: #48aff0;

  &:hover {
    background: rgba(72, 175, 240, 0.2);
  }
`,M=()=>{const r=t.useContext(R),[n,a]=t.useState(!1),l=t.useRef(!1);t.useEffect(()=>()=>{l.current&&r.lightbar.fadeOut()},[r]);const i=t.useCallback(()=>{r.lightbar.fadeBlue(),a(!0),l.current=!0},[r]),p=t.useCallback(()=>{r.lightbar.fadeOut(),a(!1),l.current=!1},[r]);return e.jsxs(K,{children:[e.jsx(y,{$active:n,onClick:i,children:"Fade Blue"}),e.jsx(y,{onClick:p,children:"Fade Out"})]})},Q=()=>e.jsxs(S,{children:[e.jsxs(B,{children:[e.jsx(v,{style:{flex:1},children:"lightbar color"}),e.jsx(v,{style:{flexShrink:0,textAlign:"right"},children:"value"})]}),e.jsx(J,{})]}),U=()=>e.jsxs(S,{children:[e.jsx(B,{children:e.jsx(v,{style:{flex:1},children:"fade effects"})}),e.jsx(M,{})]}),ee=()=>e.jsxs(E,{title:"Lightbar",subtitle:"Full RGB LED strip with color control and fade effects.",children:[e.jsx(g,{children:e.jsxs("p",{children:["The lightbar is an RGB LED strip that runs along both sides of the touchpad. Set it to any color using"," ",e.jsx(z,{to:"/api/lightbar",children:e.jsx("code",{children:"lightbar.set()"})})," ","with RGB values (0–255 per channel), or trigger firmware-driven fade animations."]})}),e.jsx(b,{children:"Color"}),e.jsx(T,{children:"Pick a color or drag the channel sliders"}),e.jsx(Q,{}),e.jsx(b,{children:"Setting Color"}),e.jsx(g,{children:e.jsxs("p",{children:["The ",e.jsx("code",{children:"{r, g, b}"})," format is compatible with popular color libraries — pass the output of ",e.jsx("code",{children:"colord().toRgb()"}),","," ",e.jsx("code",{children:"tinycolor().toRgb()"}),", or ",e.jsx("code",{children:"Color().object()"})," ","straight to ",e.jsx("code",{children:"lightbar.set()"}),"."]})}),e.jsx(k,{code:"// Set to a specific RGB color\ncontroller.lightbar.set({ r: 0, g: 128, b: 255 });\n\n// Read the current color\nconst { r, g, b } = controller.lightbar.color;\nconsole.log(`R=${r} G=${g} B=${b}`);"}),e.jsx(b,{children:"Fade Effects"}),e.jsx(g,{children:e.jsx("p",{children:"The lightbar supports firmware-driven fade animations corresponding to the official Sony behavior. These are one-shot commands; the controller handles the animation internally."})}),e.jsx(U,{}),e.jsxs(G,{children:[e.jsx("code",{children:"fadeBlue()"})," overrides your custom lightbar color to Sony blue and holds it. You must send ",e.jsx("code",{children:"fadeOut()"})," to return to your set color."]}),e.jsx(k,{code:`// Fade to Sony blue and hold
controller.lightbar.fadeBlue();

// Fade to black, then return to your set color
controller.lightbar.fadeOut();`})]});export{ee as default};
