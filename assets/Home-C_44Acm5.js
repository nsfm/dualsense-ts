import{j as t,m as n,r as i,L as r,g as e}from"./index-BuZC7I-2.js";import{C as s}from"./CodeBlock-68dk7iDt.js";const a=e.code`
  background: rgba(255, 255, 255, 0.06);
  border-radius: 3px;
  padding: 1px 5px;
  font-size: 14px;
`,d=e.div`
  text-align: center;
  padding: 40px 0 48px;
`,l=e.h1`
  display: inline-block;
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(242, 158, 2, 0.15);
  border-radius: 12px;
  padding: 12px 32px;

  @media (max-width: 600px) {
    font-size: 28px;
    padding: 10px 24px;
  }
`,c=e.span`
  color: #f29e02;
  text-shadow:
    0 0 20px rgba(242, 158, 2, 0.4),
    0 0 60px rgba(242, 158, 2, 0.15);
`,p=e.p`
  font-size: 17px;
  color: rgba(191, 204, 214, 0.8);
  margin: 0 auto 12px;
  line-height: 1.6;
`,u=e.p`
  font-size: 15px;
  color: rgba(191, 204, 214, 0.55);
  max-width: 560px;
  margin: 0 auto 28px;
  line-height: 1.7;
`,g=e(r)`
  color: #48aff0;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`,x=e.button`
  background: rgba(72, 175, 240, 0.2);
  border: 1px solid rgba(72, 175, 240, 0.5);
  border-radius: 6px;
  color: #48aff0;
  font-size: 15px;
  font-weight: 600;
  padding: 10px 28px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: rgba(72, 175, 240, 0.3);
  }
`,h=e.div`
  margin: 0 auto 48px;
  max-width: 320px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  padding: 12px 16px;
  font-family: "Fira Code", monospace;
  font-size: 13px;
  color: #48aff0;
  text-align: center;
  user-select: all;
`,m=e.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  margin-top: 12px;
`,b=e(s)`
  transition:
    border-color 0.15s,
    transform 0.1s;

  &:hover {
    border-color: rgba(72, 175, 240, 0.3);
    transform: translateY(-1px);
  }
`,f=e.h3`
  font-size: 15px;
  margin-bottom: 6px;
`,y=e.p`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.6);
  margin: 0;
  line-height: 1.5;
`,w=e.h2`
  margin-top: 48px;
  margin-bottom: 16px;
  font-size: 20px;
`,v=[{title:"Buttons & D-Pad",desc:"Read every button press with events, promises, or async iterators.",to:"/inputs/buttons"},{title:"Analog Sticks",desc:"Two thumbsticks with X/Y axes, magnitude, direction, and click.",to:"/inputs/analog"},{title:"Triggers",desc:"Pressure-sensitive L2/R2 with full 0–1 range reading.",to:"/inputs/triggers"},{title:"Touchpad",desc:"Multi-touch surface with two independent contact points.",to:"/inputs/touchpad"},{title:"Motion Sensors",desc:"6-axis IMU: 3-axis gyroscope and 3-axis accelerometer.",to:"/inputs/motion"},{title:"Battery",desc:"Battery level and charging status with change events.",to:"/inputs/battery"},{title:"Connection",desc:"Auto-connect, reconnection, and USB/Bluetooth transport detection.",to:"/inputs/connection"},{title:"Adaptive Triggers",desc:"7 feedback effects with configurable parameters per trigger.",to:"/outputs/trigger-effects"},{title:"Haptic Feedback",desc:"Independent left and right rumble motors with intensity control.",to:"/outputs/rumble"},{title:"Lightbar",desc:"Full RGB LED strip with color control and fade effects.",to:"/outputs/lightbar"},{title:"Player LEDs",desc:"5 white LEDs with individual control and brightness levels.",to:"/outputs/player-leds"},{title:"Mute LED",desc:"Software-controlled mute indicator with solid, pulse, and off modes.",to:"/outputs/mute-led"},{title:"Audio Controls",desc:"Speaker, headphone, and microphone volume, routing, and test tones.",to:"/outputs/audio"},{title:"Controller Info",desc:"Body color, serial number, firmware versions, and factory data.",to:"/status"},{title:"Multiplayer",desc:"Up to 31 controllers with identity-based reconnection and player LEDs.",to:"/multiplayer"}],C=()=>t.jsxs(t.Fragment,{children:[t.jsxs(d,{children:[t.jsx(l,{children:t.jsx(c,{children:"dualsense-ts"})}),t.jsx(p,{children:"The natural interface for your DualSense controller."}),t.jsxs(u,{children:["Fully featured with support via WebHID in the browser or"," ",t.jsx(a,{children:"node-hid"})," in Node.js. Connect your controller to explore the"," ",t.jsx(g,{to:"/playground",children:"interactive playground"}),", or see your inputs live on every page of the docs. You can also connect multiple controllers and swap between them at any time from the top bar."]}),n&&t.jsx(x,{onClick:i,children:"Connect a Controller"})]}),t.jsx(h,{children:"npm install dualsense-ts"}),t.jsx(w,{children:"Features"}),t.jsx(m,{children:v.map(o=>t.jsx(r,{to:o.to,style:{textDecoration:"none"},children:t.jsxs(b,{$interactive:!0,children:[t.jsx(f,{children:o.title}),t.jsx(y,{children:o.desc})]})},o.to))})]});export{C as default};
