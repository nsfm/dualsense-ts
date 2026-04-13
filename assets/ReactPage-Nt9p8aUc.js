import{j as e,L as o}from"./index-DKhcrciQ.js";import{F as c,P as t,S as r,H as s}from"./FeaturePage-BkaKAGuw.js";import{a as n}from"./CodeBlock-ByGo0dcz.js";const d=()=>e.jsxs(c,{title:"React Apps",subtitle:"Patterns for integrating dualsense-ts into React applications.",children:[e.jsx(t,{children:e.jsxs("p",{children:["The library's event-driven ",e.jsx(o,{to:"/api/input",children:e.jsx("code",{children:"Input"})})," ","API maps naturally to React. A singleton controller or manager instance lives outside the component tree, React contexts make it available to any component, and lightweight hooks bridge the event system to React's render cycle."]})}),e.jsx(r,{children:"Single Controller Setup"}),e.jsx(t,{children:e.jsxs("p",{children:["For single-player apps, create one ",e.jsx("code",{children:"Dualsense"})," instance at module scope and expose it through a context. Components never construct their own — they consume the shared instance."]})}),e.jsx(n,{code:`// controller.ts
import { createContext } from "react";
import { Dualsense } from "dualsense-ts";

// Module-scoped singleton — created once, shared everywhere
export const controller = new Dualsense();

export const ControllerContext = createContext<Dualsense>(controller);`}),e.jsx(t,{children:e.jsx("p",{children:"Provide the context at the top of your tree. Since the instance is stable, this provider never triggers re-renders on its own."})}),e.jsx(n,{code:`// App.tsx
import { ControllerContext, controller } from "./controller";

export const App = () => (
  <ControllerContext.Provider value={controller}>
    <YourApp />
  </ControllerContext.Provider>
);`}),e.jsx(r,{children:"useControllerInput Hook"}),e.jsx(t,{children:e.jsx("p",{children:"This hook subscribes a component to a specific input and re-renders when it changes. The selector function picks which input to watch — the hook handles event subscription and cleanup."})}),e.jsx(n,{code:`// useControllerInput.ts
import { useState, useEffect, useContext } from "react";
import type { Input, Dualsense } from "dualsense-ts";
import { ControllerContext } from "./controller";

export function useControllerInput<T extends Input<T>>(
  selector: (controller: Dualsense) => T,
): T {
  const controller = useContext(ControllerContext);
  const input = selector(controller);
  const [, setTick] = useState(0);

  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    input.on("change", handler);
    return () => { input.removeListener("change", handler) };
  }, [input]);

  return input;
}`}),e.jsx(t,{children:e.jsxs("p",{children:["The returned ",e.jsx("code",{children:"Input"})," object always reflects the latest state. Read its properties directly in your JSX — no need for separate state variables."]})}),e.jsx(n,{code:`function TriggerPressure() {
  const trigger = useControllerInput((c) => c.right.trigger);
  return <span>{Math.round(trigger.pressure * 100)}%</span>;
}

function BatteryLevel() {
  const battery = useControllerInput((c) => c.battery);
  return (
    <span>
      {Math.round(battery.level.state * 100)}%
      {battery.charging && " ⚡"}
    </span>
  );
}

function DpadState() {
  const dpad = useControllerInput((c) => c.dpad);
  return (
    <div>
      {dpad.up.active && "↑"}
      {dpad.down.active && "↓"}
      {dpad.left.active && "←"}
      {dpad.right.active && "→"}
    </div>
  );
}`}),e.jsxs(s,{children:["The selector runs once per mount and is compared by reference. If you pass an inline arrow function, the hook will re-subscribe on every render. For best performance, define selectors outside the component or memoize them with ",e.jsx("code",{children:"useCallback"}),"."]}),e.jsx(r,{children:"Multi-Controller Setup"}),e.jsx(t,{children:e.jsxs("p",{children:["For ",e.jsx(o,{to:"/multiplayer",children:"multiplayer"})," apps, use a"," ",e.jsx("code",{children:"DualsenseManager"})," instead. The manager discovers controllers automatically and exposes them through a stable slot system with identity-based reconnection."]})}),e.jsx(n,{code:`// controller.ts
import { createContext } from "react";
import { Dualsense, DualsenseManager } from "dualsense-ts";

export const manager = new DualsenseManager();

// Permission request handler for WebHID (attach to a button click)
export const requestPermission = manager.getRequest();

// Manager context — provides the manager to the tree
export const ManagerContext = createContext<DualsenseManager | null>(manager);

// Controller context — provides the "active" controller to a subtree
export const ControllerContext = createContext<Dualsense>(
  new Dualsense({ hid: null }),
);`}),e.jsx(r,{children:"useManagerState Hook"}),e.jsx(t,{children:e.jsx("p",{children:"This hook tracks the manager's controller list and re-renders when controllers connect, disconnect, or change. It drives the top-level layout — player tabs, connection prompts, and the provider that switches which controller the rest of the tree sees."})}),e.jsx(n,{code:`// useManagerState.ts
import { useState, useEffect } from "react";
import type { Dualsense } from "dualsense-ts";
import { manager } from "./controller";

export function useManagerState() {
  const [controllers, setControllers] = useState<readonly Dualsense[]>(
    manager?.controllers ?? [],
  );
  const [activeCount, setActiveCount] = useState(
    manager?.state.active ?? 0,
  );
  const [pending, setPending] = useState(manager?.pending ?? false);

  useEffect(() => {
    if (!manager) return;
    const update = () => {
      setControllers([...manager.controllers]);
      setActiveCount(manager.state.active);
      setPending(manager.pending);
    };
    manager.on("change", update);
    return () => { manager.removeListener("change", update) };
  }, []);

  return { controllers, activeCount, pending };
}`}),e.jsx(r,{children:"Switching the Active Controller"}),e.jsx(t,{children:e.jsxs("p",{children:['In a multiplayer layout, one controller is "active" at a time for pages that show single-controller details. A parent component tracks the selected index and re-provides the'," ",e.jsx("code",{children:"ControllerContext"}),". Every child that uses"," ",e.jsx("code",{children:"useControllerInput"})," automatically subscribes to the new controller when the selection changes."]})}),e.jsx(n,{code:`function Layout() {
  const { controllers } = useManagerState();
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Fall back to index 0 if the selected controller is released
  useEffect(() => {
    if (!controllers[selectedIndex] && controllers.length > 0) {
      setSelectedIndex(0);
    }
  }, [controllers.length, selectedIndex]);

  // Placeholder when nothing is connected
  const controller = controllers[selectedIndex]
    ?? new Dualsense({ hid: null });

  return (
    // key={selectedIndex} forces re-mount so hooks re-subscribe
    <ControllerContext.Provider key={selectedIndex} value={controller}>
      <PlayerTabs
        controllers={controllers}
        selected={selectedIndex}
        onSelect={setSelectedIndex}
      />
      <Outlet />
    </ControllerContext.Provider>
  );
}`}),e.jsxs(s,{children:["The ",e.jsxs("code",{children:["key=","{selectedIndex}"]})," on the provider forces all children to remount when the selection changes. This guarantees that every ",e.jsx("code",{children:"useControllerInput"})," hook re-subscribes to the correct controller. Without it, hooks would hold stale references to the previous controller's inputs."]}),e.jsx(r,{children:"WebHID Permission Flow"}),e.jsx(t,{children:e.jsxs("p",{children:["In the browser, WebHID requires a"," ",e.jsx("a",{href:"https://developer.mozilla.org/en-US/docs/Web/API/User_activation",target:"_blank",rel:"noopener noreferrer",children:"user gesture"})," ","to open the device picker. Attach the manager's"," ",e.jsx("code",{children:"requestPermission"})," handler to a button click. Once permission is granted for a device, it persists for the origin — the controller will auto-connect on future visits."]})}),e.jsx(n,{code:`import { requestPermission } from "./controller";

function ConnectButton() {
  const { pending } = useManagerState();

  return (
    <button onClick={requestPermission} disabled={pending}>
      {pending ? "Connecting..." : "Connect Controller"}
    </button>
  );
}`}),e.jsx(r,{children:"Handling Disconnected State"}),e.jsxs(t,{children:[e.jsxs("p",{children:["When no controller is connected, the context provides a placeholder"," ",e.jsx("code",{children:"Dualsense"})," instance created with"," ",e.jsx("code",{children:"{ hid: null }"}),". All inputs return their neutral defaults — buttons are ",e.jsx("code",{children:"false"}),", axes are ",e.jsx("code",{children:"0"}),", battery is ",e.jsx("code",{children:"0"}),". Components render without errors and update live the moment a controller connects."]}),e.jsxs("p",{children:["Check ",e.jsx("code",{children:"controller.connection.active"})," if you need to show an explicit empty state:"]})]}),e.jsx(n,{code:`function ControllerStatus() {
  const connection = useControllerInput((c) => c.connection);

  if (!connection.active) {
    return <div>No controller connected</div>;
  }

  return <div>Connected{controller.wireless ? " via Bluetooth" : " via USB"}</div>;
}`}),e.jsx(r,{children:"High-Frequency Inputs"}),e.jsxs(t,{children:[e.jsxs("p",{children:["Inputs like analog sticks, triggers, and motion sensors fire"," ",e.jsx("code",{children:"change"})," events at up to 250Hz. The"," ",e.jsx("code",{children:"useControllerInput"})," hook triggers a React render on every change — this is fine for most UI elements, but can be expensive if the component tree below is large."]}),e.jsx("p",{children:"For performance-sensitive cases:"}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Subscribe directly"})," for canvas or WebGL rendering — use ",e.jsx("code",{children:"useEffect"})," to subscribe to the input's events and update a ref or animation frame, bypassing React's render cycle entirely."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Throttle at the component level"})," if you need React rendering but don't need every frame — debounce the tick counter or use ",e.jsx("code",{children:"requestAnimationFrame"})," gating."]})]})]}),e.jsx(n,{code:`// Direct subscription for canvas rendering
function MotionCanvas() {
  const controller = useContext(ControllerContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const onInput = () => {
      const { x, y, z } = controller.gyroscope;
      // Draw directly — no React render needed
      ctx.clearRect(0, 0, 300, 300);
      ctx.fillText(\`\${x.state.toFixed(2)}, \${y.state.toFixed(2)}, \${z.state.toFixed(2)}\`, 10, 20);
    };

    controller.gyroscope.on("change", onInput);
    return () => { controller.gyroscope.removeListener("change", onInput) };
  }, [controller]);

  return <canvas ref={canvasRef} width={300} height={300} />;
}

// RAF-gated rendering
function ThrottledStick() {
  const controller = useContext(ControllerContext);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const rafRef = useRef(0);

  useEffect(() => {
    const stick = controller.left.analog;
    const onInput = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setPos({ x: stick.x.state, y: stick.y.state });
      });
    };

    stick.on("change", onInput);
    return () => {
      stick.removeListener("change", onInput);
      cancelAnimationFrame(rafRef.current);
    };
  }, [controller]);

  return <div style={{ transform: \`translate(\${pos.x * 50}px, \${pos.y * 50}px)\` }} />;
}`})]});export{d as default};
