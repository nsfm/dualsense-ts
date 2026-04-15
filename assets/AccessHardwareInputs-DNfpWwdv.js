import{j as e,L as t}from"./index-l8CS40p9.js";import{F as i,P as s,S as c,H as o}from"./FeaturePage-DbpfBqym.js";import{a as r}from"./CodeBlock-DSZTVETd.js";const a=()=>e.jsxs(i,{title:"Hardware Inputs",subtitle:"Profile-independent physical inputs: 8 buttons, analog stick, center, PS, and profile.",children:[e.jsxs(s,{children:[e.jsxs("p",{children:["The Access controller's raw hardware inputs report the physical state of every input regardless of the active profile. When you read"," ",e.jsx("code",{children:"access.b1"}),', you always get the state of hardware button 1 — even if the profile has mapped it to "Cross" or "L1".']}),e.jsxs("p",{children:["All hardware inputs are"," ",e.jsx(t,{to:"/api/input",children:e.jsx("code",{children:"Input<T>"})})," instances with the same event API as every other input in the library."]})]}),e.jsx(c,{children:"Buttons (B1–B8)"}),e.jsx(s,{children:e.jsxs("p",{children:["Eight ",e.jsx(t,{to:"/api/momentary",children:e.jsx("code",{children:"Momentary"})})," ","buttons. All eight are located on the main body of the controller. The four expansion ports provide an additional four inputs — see"," ",e.jsx(t,{to:"/access/expansion-slots",children:"Expansion Slots"})," for details."]})}),e.jsx(r,{code:`// Listen to individual buttons
access.b1.on("press", () => console.log("B1 pressed"));
access.b4.on("release", () => console.log("B4 released"));

// Check state synchronously
if (access.b1.active && access.b2.active) {
  console.log("B1 + B2 combo");
}

// Iterate over all button presses
for await (const b1 of access.b1) {
  console.log("B1:", b1.state);
}`}),e.jsx(c,{children:"Center Button"}),e.jsx(s,{children:e.jsxs("p",{children:["The center button sits in the middle of the controller between the customizable buttons. It's a ",e.jsx("code",{children:"Momentary"})," input accessed via ",e.jsx("code",{children:"access.center"}),"."]})}),e.jsx(r,{code:'access.center.on("press", () => console.log("Center pressed"));'}),e.jsx(c,{children:"Analog Stick"}),e.jsxs(s,{children:[e.jsxs("p",{children:["The Access controller has a single analog stick. It's an ",e.jsx(t,{to:"/api/analog",children:e.jsx("code",{children:"Analog"})})," input with X/Y axes (−1 to +1) and a click button."]}),e.jsxs("p",{children:["This is the raw stick position — it reflects the physical hardware regardless of whether the active profile maps the stick to the left or right virtual stick. By default, the axis orientation assumes the stick is on the side of the controller closest to the user. For the profile-mapped stick positions, see"," ",e.jsx(t,{to:"/access/profile-inputs",children:"Profile Inputs"}),"."]})]}),e.jsx(r,{code:`// Read stick position
console.log(access.stick.x.state, access.stick.y.state);

// Subscribe to stick movement
access.stick.on("change", (stick) => {
  console.log(\`X: \${stick.x.state.toFixed(2)}, Y: \${stick.y.state.toFixed(2)}\`);
});

// Stick click
access.stick.button.on("press", () => console.log("Stick clicked"));

// Use magnitude + direction for polar input
access.stick.on("change", (stick) => {
  if (stick.active) {
    console.log(\`Magnitude: \${stick.magnitude.toFixed(2)}\`);
    console.log(\`Direction: \${stick.direction.toFixed(1)} rad\`);
  }
});`}),e.jsx(c,{children:"System Buttons"}),e.jsxs(s,{children:[e.jsx("p",{children:"The PS and Profile buttons are always available and not remappable."}),e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Property"}),e.jsx("th",{children:"Description"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"access.ps"})}),e.jsx("td",{children:"PlayStation button"})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"access.profile"})}),e.jsx("td",{children:"Profile cycle button — switches between profiles 1–3"})]})]})]})]}),e.jsx(r,{code:`access.ps.on("press", () => console.log("PS pressed"));
access.profile.on("press", () => console.log("Profile cycle"));`}),e.jsx(c,{children:"Profile ID"}),e.jsx(s,{children:e.jsx("p",{children:"The controller tracks which of its 3 hardware profiles is currently active. The profile ID (1–3) is available as a numeric input."})}),e.jsx(r,{code:`// Read current profile
console.log("Active profile:", access.profileId.state); // 1, 2, or 3

// React to profile changes
access.profileId.on("change", (p) => {
  console.log("Switched to profile", p.state);
});`}),e.jsxs(o,{children:["Pressing the Profile button physically on the controller cycles through profiles 1 → 2 → 3 → 1. The profile determines how hardware buttons map to DualSense-compatible inputs on the"," ",e.jsx(t,{to:"/access/profile-inputs",children:"profile-mapped"})," layer."]}),e.jsx(c,{children:"Battery"}),e.jsx(s,{children:e.jsxs("p",{children:["Battery level and charging status work the same as on"," ",e.jsx(t,{to:"/inputs/battery",children:"DualSense"}),". The level is peak-filtered over a 1-second window to smooth out noisy readings."]})}),e.jsx(r,{code:'access.battery.on("change", (bat) => {\n  console.log(`Battery: ${Math.round(bat.level.state * 100)}%`);\n  console.log("Status:", bat.status.state); // Charging, Discharging, Full\n});'}),e.jsx(c,{children:"All Hardware Inputs"}),e.jsx(s,{children:e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"Property"}),e.jsx("th",{children:"Type"}),e.jsx("th",{children:"State"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsxs("td",{children:[e.jsx("code",{children:"b1"}),"–",e.jsx("code",{children:"b8"})]}),e.jsx("td",{children:e.jsx("code",{children:"Momentary"})}),e.jsx("td",{children:e.jsx("code",{children:"boolean"})})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"center"})}),e.jsx("td",{children:e.jsx("code",{children:"Momentary"})}),e.jsx("td",{children:e.jsx("code",{children:"boolean"})})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"stick"})}),e.jsx("td",{children:e.jsx("code",{children:"Analog"})}),e.jsx("td",{children:e.jsx("code",{children:"x, y, button"})})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"ps"})}),e.jsx("td",{children:e.jsx("code",{children:"Momentary"})}),e.jsx("td",{children:e.jsx("code",{children:"boolean"})})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"profile"})}),e.jsx("td",{children:e.jsx("code",{children:"Momentary"})}),e.jsx("td",{children:e.jsx("code",{children:"boolean"})})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"profileId"})}),e.jsx("td",{children:e.jsx("code",{children:"ProfileId"})}),e.jsx("td",{children:e.jsx("code",{children:"1 | 2 | 3"})})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"battery"})}),e.jsx("td",{children:e.jsx("code",{children:"Battery"})}),e.jsx("td",{children:e.jsx("code",{children:"level, status"})})]}),e.jsxs("tr",{children:[e.jsx("td",{children:e.jsx("code",{children:"connection"})}),e.jsx("td",{children:e.jsx("code",{children:"Momentary"})}),e.jsx("td",{children:e.jsx("code",{children:"boolean"})})]})]})]})})]});export{a as default};
