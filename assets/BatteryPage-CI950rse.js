import{j as e}from"./index-Bm_ty-o0.js";import{A as s,S as t,a as r}from"./ApiPage-CauOyyZd.js";import{a}from"./CodeBlock-BDmjJVby.js";const l=()=>e.jsxs(s,{name:"Battery",extends:"Input<Battery>",description:"Battery level and charge status. Fires change events when level or charge state updates.",source:"src/elements/battery.ts",children:[e.jsx(t,{children:"Child Inputs"}),e.jsx(r,{properties:[{name:"level",type:"BatteryLevel (Input<Intensity>)",description:"Charge level from 0 (empty) to 1 (full)",readonly:!0},{name:"status",type:"BatteryStatus (Input<ChargeStatus>)",description:"Charge state: Discharging, Charging, or ChargingError",readonly:!0}]}),e.jsx(t,{children:"Properties"}),e.jsx(r,{properties:[{name:"active",type:"boolean",description:"True if charging or battery is low"}]}),e.jsx(t,{children:"ChargeStatus Enum"}),e.jsx(a,{code:`enum ChargeStatus {
  Discharging = 0x0,
  Charging = 0x1,
  Full = 0x2,
  AbnormalVoltage = 0xa,
  AbnormalTemperature = 0xb,
  ChargingError = 0xf,
}`}),e.jsx(t,{children:"Example"}),e.jsx(a,{code:'controller.battery.on("change", (bat) => {\n  const pct = (bat.level.state * 100).toFixed(0);\n  console.log(`Battery: ${pct}% (${ChargeStatus[bat.status.state]})`);\n});'})]});export{l as default};
