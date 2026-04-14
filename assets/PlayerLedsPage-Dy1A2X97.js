import{j as e,g as t,a as n,C as B,d as a,L as l}from"./index-Bm_ty-o0.js";import{F as $,P as i,D as E,S as d,H as C}from"./FeaturePage-CJ3zLxR7.js";import{a as c}from"./CodeBlock-BDmjJVby.js";const S=t.div`
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
`,I=t.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.18);
`,R=t.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(191, 204, 214, 0.35);
`,A=t.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 16px 16px 12px;
  background: rgba(0, 0, 0, 0.06);
`,H=t.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  border: 2px solid
    ${r=>r.$on?"#48aff0":"rgba(72, 175, 240, 0.25)"};
  background: ${r=>r.$on?"rgba(72, 175, 240, 0.2)":"rgba(0, 0, 0, 0.15)"};
  color: ${r=>r.$on?"#48aff0":"rgba(191, 204, 214, 0.3)"};
  box-shadow: ${r=>r.$on?"0 0 10px rgba(72, 175, 240, 0.4)":"none"};

  &:hover {
    border-color: #48aff0;
    background: ${r=>r.$on?"rgba(72, 175, 240, 0.3)":"rgba(72, 175, 240, 0.1)"};
    color: ${r=>r.$on?"#48aff0":"rgba(191, 204, 214, 0.6)"};
  }
`,u=t.div`
  display: flex;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.06);
`,p=t.button`
  flex: 1;
  padding: 7px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  border: 1px solid
    ${r=>r.$active?"rgba(72, 175, 240, 0.6)":"rgba(72, 175, 240, 0.3)"};
  background: ${r=>r.$active?"rgba(72, 175, 240, 0.2)":"rgba(72, 175, 240, 0.08)"};
  color: ${r=>r.$active?"#48aff0":"rgba(191, 204, 214, 0.5)"};

  &:hover {
    background: rgba(72, 175, 240, 0.15);
    color: #48aff0;
  }
`,T=t(p)`
  border-color: rgba(255, 107, 107, 0.4);
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;

  &:hover {
    background: rgba(255, 107, 107, 0.2);
  }
`,g=t.span`
  color: rgba(191, 204, 214, 0.3);
`,f=t.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px 16px;
  background: ${r=>r.$even?"rgba(0, 0, 0, 0.12)":"rgba(0, 0, 0, 0.06)"};
`,y=t.code`
  font-size: 12px;
  color: rgba(191, 204, 214, 0.5);
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
  text-align: left;
`,m=t.code`
  font-size: 12px;
  flex-shrink: 0;
  white-space: nowrap;
  text-align: right;
  color: ${r=>r.$highlight?"#f29e02":"rgba(191, 204, 214, 0.4)"};
  transition: color 0.06s;
`,L=t.div`
  padding: 6px 16px 2px;
  background: rgba(0, 0, 0, 0.1);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(191, 204, 214, 0.3);
`;function j(r){switch(r){case a.Brightness.High:return"High";case a.Brightness.Medium:return"Medium";case a.Brightness.Low:return"Low";default:return`${r}`}}const M=[{label:"P1",value:a.PlayerID.Player1},{label:"P2",value:a.PlayerID.Player2},{label:"P3",value:a.PlayerID.Player3},{label:"P4",value:a.PlayerID.Player4},{label:"All",value:a.PlayerID.All}],z=()=>{const r=n.useContext(B),[,P]=n.useState(0),[x,v]=n.useState(r.playerLeds.brightness),o=n.useCallback(()=>P(s=>s+1),[]),D=n.useCallback(s=>{r.playerLeds.setLed(s,!r.playerLeds.getLed(s)),o()},[r,o]),b=n.useCallback(s=>{r.playerLeds.set(s),o()},[r,o]),w=n.useCallback(s=>{v(s),r.playerLeds.setBrightness(s)},[r]),h=r.playerLeds.bitmask,k="0b"+h.toString(2).padStart(5,"0");return e.jsxs(e.Fragment,{children:[e.jsx(A,{children:[0,1,2,3,4].map(s=>e.jsx(H,{$on:r.playerLeds.getLed(s),onClick:()=>D(s),children:s+1},s))}),e.jsx(L,{children:"presets"}),e.jsxs(u,{children:[e.jsx(T,{onClick:()=>b(0),children:"Off"}),M.map(s=>e.jsx(p,{$active:h===s.value,onClick:()=>b(s.value),children:s.label},s.label))]}),e.jsx(L,{children:"brightness"}),e.jsx(u,{children:[a.Brightness.Low,a.Brightness.Medium,a.Brightness.High].map(s=>e.jsx(p,{$active:x===s,onClick:()=>w(s),children:j(s)},s))}),e.jsxs(f,{children:[e.jsx(y,{children:e.jsxs("bdi",{children:[e.jsx(g,{children:"controller."}),"playerLeds",e.jsx(g,{children:"."}),"bitmask"]})}),e.jsx(m,{$highlight:h>0,children:k})]}),e.jsxs(f,{$even:!0,children:[e.jsx(y,{children:e.jsxs("bdi",{children:[e.jsx(g,{children:"controller."}),"playerLeds",e.jsx(g,{children:"."}),"brightness"]})}),e.jsxs(m,{$highlight:!0,children:["Brightness.",j(x)]})]})]})},F=()=>e.jsxs(S,{children:[e.jsx(I,{children:e.jsx(R,{children:"player LEDs"})}),e.jsx(z,{})]}),V=()=>e.jsxs($,{title:"Player LEDs",subtitle:"5 white LEDs with individual control and adjustable brightness.",children:[e.jsx(i,{children:e.jsxs("p",{children:["Below the touchpad are 5 small white LEDs used to indicate player number. Each can be individually toggled via"," ",e.jsx(l,{to:"/api/player-leds",children:e.jsx("code",{children:"playerLeds"})}),", and the overall brightness can be set to one of three levels."]})}),e.jsx(E,{children:"Toggle LEDs, pick a preset, or adjust brightness"}),e.jsx(F,{}),e.jsx(d,{children:"Preset Patterns"}),e.jsx(i,{children:e.jsxs("p",{children:["Use the"," ",e.jsx(l,{to:"/api/enums",children:e.jsx("code",{children:"PlayerID"})})," enum for standard PS5 player patterns, or pass any 5-bit bitmask directly. Each bit corresponds to one LED from left to right."]})}),e.jsx(c,{code:`import { PlayerID } from "dualsense-ts";

// Use a preset pattern
controller.playerLeds.set(PlayerID.Player1); // center LED
controller.playerLeds.set(PlayerID.All);     // all five on

// Or use a raw bitmask (5 bits, one per LED)
controller.playerLeds.set(0b10101); // LEDs 1, 3, 5 on

// Toggle individual LEDs (index 0–4)
controller.playerLeds.setLed(0, true);
controller.playerLeds.setLed(4, true);

// Clear all
controller.playerLeds.clear();`}),e.jsx(d,{children:"Brightness"}),e.jsx(i,{children:e.jsxs("p",{children:["The"," ",e.jsx(l,{to:"/api/enums",children:e.jsx("code",{children:"Brightness"})})," enum provides three levels. This affects all five LEDs uniformly."]})}),e.jsx(c,{code:`import { Brightness } from "dualsense-ts";

controller.playerLeds.setBrightness(Brightness.High);   // default
controller.playerLeds.setBrightness(Brightness.Medium);
controller.playerLeds.setBrightness(Brightness.Low);

// Read the current level
controller.playerLeds.brightness; // Brightness.Low`}),e.jsx(d,{children:"Reading State"}),e.jsx(c,{code:`// Current 5-bit bitmask
controller.playerLeds.bitmask; // e.g. 4 (0b00100 = Player1)

// Individual LED state
controller.playerLeds.getLed(2); // true

// Current brightness
controller.playerLeds.brightness; // Brightness.High`}),e.jsx(d,{children:"Automatic Player Assignment"}),e.jsx(i,{children:e.jsxs("p",{children:["When using"," ",e.jsx(l,{to:"/api/manager",children:e.jsx("code",{children:"DualsenseManager"})})," for"," ",e.jsx(l,{to:"/multiplayer",children:"multiplayer"}),", player LEDs are automatically assigned as controllers connect. The first four follow the PS5 console convention; slots 5–31 use the remaining 5-bit combinations."]})}),e.jsxs(C,{children:["Auto-assignment can be disabled with"," ",e.jsx("code",{children:"manager.autoAssignPlayerLeds = false"})," if you want full manual control."]}),e.jsx(c,{code:`import { DualsenseManager, PlayerID, Brightness } from "dualsense-ts";

const manager = new DualsenseManager();

// Override a specific slot's LED pattern
manager.setPlayerPattern(4, 0b10001); // outer two LEDs

// Disable auto-assignment
manager.autoAssignPlayerLeds = false;
manager.get(0)?.playerLeds.set(PlayerID.All);
manager.get(0)?.playerLeds.setBrightness(Brightness.Low);`})]});export{V as default};
