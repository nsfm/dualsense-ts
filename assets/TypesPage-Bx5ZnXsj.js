import{j as e}from"./index-BuZC7I-2.js";import{A as t,S as n,P as s,a}from"./ApiPage-s5d_KP1M.js";import{a as r}from"./CodeBlock-68dk7iDt.js";const d=()=>e.jsxs(t,{name:"Types",description:"Type aliases, interfaces, and callback signatures used throughout dualsense-ts.",children:[e.jsx(n,{children:"Numeric Types"}),e.jsx(s,{children:e.jsxs("p",{children:["These type aliases convey the semantic meaning of numeric values. They are all ",e.jsx("code",{children:"number"})," at runtime."]})}),e.jsx(a,{properties:[{name:"Force",type:"number",description:"Signed intensity from -1 to 1. Used for axis values."},{name:"Magnitude",type:"number",description:"Unsigned intensity from 0 to 1. Used for triggers, deadzone, battery level."},{name:"Intensity",type:"number",description:"Unsigned intensity from 0 to 1. Alias for Magnitude, used for rumble."},{name:"Radians",type:"number",description:"Angle in radians (typically -PI to PI)."},{name:"Degrees",type:"number",description:"Angle in degrees (0 to 360)."}]}),e.jsx(n,{children:"RGB"}),e.jsx(r,{code:`interface RGB {
  r: number;  // 0–255
  g: number;  // 0–255
  b: number;  // 0–255
}`}),e.jsx(n,{children:"Event Types"}),e.jsx(r,{code:`type InputChangeType = "change" | "press" | "release";
type InputEventType = InputChangeType | "input";

type InputCallback<Instance> = (
  input: Instance,
  changed: Instance | Input<unknown>
) => unknown | Promise<unknown>;`}),e.jsx(n,{children:"Manager State"}),e.jsx(r,{code:`interface DualsenseManagerState {
  active: number;
  players: ReadonlyMap<number, Dualsense>;
}`}),e.jsx(n,{children:"Device Info"}),e.jsx(r,{code:`interface FirmwareInfo {
  // Firmware version and hardware revision details
}

interface FactoryInfo {
  // Serial number, body color, board revision
}

interface DualsenseDeviceInfo {
  path: string;
  serialNumber?: string;
  wireless: boolean;
}`}),e.jsx(n,{children:"HID State"}),e.jsx(s,{children:e.jsxs("p",{children:["The ",e.jsx("code",{children:"DualsenseHIDState"})," interface maps every ",e.jsx("code",{children:"InputId"})," ","to its raw value. This is the low-level state object you'd use if working directly with the HID provider rather than the ",e.jsx("code",{children:"Input"})," tree."]})})]});export{d as default};
