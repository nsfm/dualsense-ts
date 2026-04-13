import{j as e}from"./index-CqgUOPB5.js";import{A as t,S as s,a as i,M as n}from"./ApiPage-BIA_uZJh.js";import{a as r}from"./CodeBlock-D0xyfFu-.js";const d=()=>e.jsxs(t,{name:"PlayerLeds",description:"Five white LEDs below the touchpad. Individually toggleable with adjustable brightness.",source:"src/elements/player_leds.ts",children:[e.jsx(s,{children:"Properties"}),e.jsx(i,{properties:[{name:"bitmask",type:"number",description:"Current 5-bit LED pattern (0–31). Each bit = one LED."},{name:"brightness",type:"Brightness",description:'Current brightness level: "High", "Medium", or "Low"'}]}),e.jsx(s,{children:"Methods"}),e.jsx(n,{methods:[{name:"set",signature:"set(bitmask: number): void",description:"Set all 5 LEDs at once using a bitmask (0b00000 to 0b11111)."},{name:"setLed",signature:"setLed(index: number, on: boolean): void",description:"Toggle a single LED by index (0–4)."},{name:"getLed",signature:"getLed(index: number): boolean",description:"Check if a specific LED is on."},{name:"clear",signature:"clear(): void",description:"Turn all LEDs off."},{name:"setBrightness",signature:"setBrightness(brightness: Brightness): void",description:'Set brightness: "High", "Medium", or "Low".'}]}),e.jsx(s,{children:"Brightness Enum"}),e.jsx(r,{code:`enum Brightness {
  High,
  Medium,
  Low,
}`}),e.jsx(s,{children:"Example"}),e.jsx(r,{code:`import { PlayerID, Brightness } from "dualsense-ts";

// Player 1 pattern
controller.playerLeds.set(PlayerID.Player1);

// Player 3 pattern
controller.playerLeds.set(PlayerID.Player3);

// Toggle individual LEDs
controller.playerLeds.setLed(0, true);
controller.playerLeds.setLed(4, true);

// Adjust brightness
controller.playerLeds.setBrightness(Brightness.Medium);`})]});export{d as default};
