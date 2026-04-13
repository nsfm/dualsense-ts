import React from "react";
import { Link } from "react-router";
import {
  FeaturePage,
  SectionHeading,
  Prose,
  CodeBlock,
  HardwareNote,
} from "../components/FeaturePage";

const ReactPage: React.FC = () => (
  <FeaturePage
    title="React Apps"
    subtitle="Patterns for integrating dualsense-ts into React applications."
  >
    <Prose>
      <p>
        The library's event-driven <Link to="/api/input"><code>Input</code></Link>{" "}
        API maps naturally to React. A singleton controller or manager instance
        lives outside the component tree, React contexts make it available to
        any component, and lightweight hooks bridge the event system to React's
        render cycle.
      </p>
    </Prose>

    {/* ── Single controller ──────────────────────────────── */}

    <SectionHeading>Single Controller Setup</SectionHeading>
    <Prose>
      <p>
        For single-player apps, create one <code>Dualsense</code> instance at
        module scope and expose it through a context. Components never construct
        their own — they consume the shared instance.
      </p>
    </Prose>
    <CodeBlock
      code={`// controller.ts
import { createContext } from "react";
import { Dualsense } from "dualsense-ts";

// Module-scoped singleton — created once, shared everywhere
export const controller = new Dualsense();

export const ControllerContext = createContext<Dualsense>(controller);`}
    />
    <Prose>
      <p>
        Provide the context at the top of your tree. Since the instance is
        stable, this provider never triggers re-renders on its own.
      </p>
    </Prose>
    <CodeBlock
      code={`// App.tsx
import { ControllerContext, controller } from "./controller";

export const App = () => (
  <ControllerContext.Provider value={controller}>
    <YourApp />
  </ControllerContext.Provider>
);`}
    />

    {/* ── useControllerInput ─────────────────────────────── */}

    <SectionHeading>useControllerInput Hook</SectionHeading>
    <Prose>
      <p>
        This hook subscribes a component to a specific input and re-renders
        when it changes. The selector function picks which input to watch —
        the hook handles event subscription and cleanup.
      </p>
    </Prose>
    <CodeBlock
      code={`// useControllerInput.ts
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
}`}
    />
    <Prose>
      <p>
        The returned <code>Input</code> object always reflects the latest
        state. Read its properties directly in your JSX — no need for
        separate state variables.
      </p>
    </Prose>
    <CodeBlock
      code={`function TriggerPressure() {
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
}`}
    />
    <HardwareNote>
      The selector runs once per mount and is compared by reference. If you
      pass an inline arrow function, the hook will re-subscribe on every
      render. For best performance, define selectors outside the component or
      memoize them with <code>useCallback</code>.
    </HardwareNote>

    {/* ── Multi-controller ───────────────────────────────── */}

    <SectionHeading>Multi-Controller Setup</SectionHeading>
    <Prose>
      <p>
        For <Link to="/multiplayer">multiplayer</Link> apps, use a{" "}
        <code>DualsenseManager</code> instead. The manager discovers controllers
        automatically and exposes them through a stable slot system with
        identity-based reconnection.
      </p>
    </Prose>
    <CodeBlock
      code={`// controller.ts
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
);`}
    />

    {/* ── useManagerState ────────────────────────────────── */}

    <SectionHeading>useManagerState Hook</SectionHeading>
    <Prose>
      <p>
        This hook tracks the manager's controller list and re-renders when
        controllers connect, disconnect, or change. It drives the top-level
        layout — player tabs, connection prompts, and the provider that
        switches which controller the rest of the tree sees.
      </p>
    </Prose>
    <CodeBlock
      code={`// useManagerState.ts
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
}`}
    />

    {/* ── Switching active controller ────────────────────── */}

    <SectionHeading>Switching the Active Controller</SectionHeading>
    <Prose>
      <p>
        In a multiplayer layout, one controller is "active" at a time for
        pages that show single-controller details. A parent component
        tracks the selected index and re-provides the{" "}
        <code>ControllerContext</code>. Every child that uses{" "}
        <code>useControllerInput</code> automatically subscribes to the
        new controller when the selection changes.
      </p>
    </Prose>
    <CodeBlock
      code={`function Layout() {
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
}`}
    />
    <HardwareNote>
      The <code>key={"{selectedIndex}"}</code> on the provider forces all
      children to remount when the selection changes. This guarantees that
      every <code>useControllerInput</code> hook re-subscribes to the correct
      controller. Without it, hooks would hold stale references to the
      previous controller's inputs.
    </HardwareNote>

    {/* ── WebHID permission ──────────────────────────────── */}

    <SectionHeading>WebHID Permission Flow</SectionHeading>
    <Prose>
      <p>
        In the browser, WebHID requires a{" "}
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/API/User_activation"
          target="_blank"
          rel="noopener noreferrer"
        >
          user gesture
        </a>{" "}
        to open the device picker. Attach the manager's{" "}
        <code>requestPermission</code> handler to a button click. Once
        permission is granted for a device, it persists for the origin —
        the controller will auto-connect on future visits.
      </p>
    </Prose>
    <CodeBlock
      code={`import { requestPermission } from "./controller";

function ConnectButton() {
  const { pending } = useManagerState();

  return (
    <button onClick={requestPermission} disabled={pending}>
      {pending ? "Connecting..." : "Connect Controller"}
    </button>
  );
}`}
    />

    {/* ── Disconnected state ─────────────────────────────── */}

    <SectionHeading>Handling Disconnected State</SectionHeading>
    <Prose>
      <p>
        When no controller is connected, the context provides a placeholder{" "}
        <code>Dualsense</code> instance created with{" "}
        <code>{"{ hid: null }"}</code>. All inputs return their neutral
        defaults — buttons are <code>false</code>, axes are <code>0</code>,
        battery is <code>0</code>. Components render without errors and
        update live the moment a controller connects.
      </p>
      <p>
        Check <code>controller.connection.active</code> if you need to show
        an explicit empty state:
      </p>
    </Prose>
    <CodeBlock
      code={`function ControllerStatus() {
  const connection = useControllerInput((c) => c.connection);

  if (!connection.active) {
    return <div>No controller connected</div>;
  }

  return <div>Connected{controller.wireless ? " via Bluetooth" : " via USB"}</div>;
}`}
    />

    {/* ── Browser compatibility ────────────────────────────── */}

    <SectionHeading>Browser Compatibility</SectionHeading>
    <Prose>
      <p>
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/API/WebHID_API#browser_compatibility"
          target="_blank"
          rel="noopener noreferrer"
        >
          WebHID
        </a>{" "}
        is supported in Chromium-based browsers (Chrome, Edge, Opera) but
        not in Firefox or Safari. Your app should still render in
        unsupported browsers — guard the manager and use a headless
        placeholder so the component tree mounts without errors.
      </p>
    </Prose>
    <CodeBlock
      code={`// controller.ts
import { createContext } from "react";
import { Dualsense, DualsenseManager } from "dualsense-ts";

export const hasWebHID =
  typeof navigator !== "undefined" && "hid" in navigator;

// Only create a manager in supported browsers
export const manager: DualsenseManager | null = hasWebHID
  ? new DualsenseManager()
  : null;

export const requestPermission: () => void = manager
  ? manager.getRequest()
  : () => {};

// Placeholder with { hid: null } — a headless instance that never
// connects. All inputs return neutral defaults (false, 0, etc.)
// so components render normally without a real controller.
export const ControllerContext = createContext<Dualsense>(
  manager?.get(0) ?? new Dualsense({ hid: null }),
);`}
    />
    <Prose>
      <p>
        With this pattern, every <code>useControllerInput</code> hook works
        in any browser — it just always reads the default state when WebHID
        is unavailable. Show a compatibility message where appropriate:
      </p>
    </Prose>
    <CodeBlock
      code={`import { hasWebHID, requestPermission } from "./controller";

function ConnectPrompt() {
  if (!hasWebHID) {
    return (
      <div>
        WebHID is not supported in this browser.
        Try Chrome, Edge, or Opera for interactive controller features.
      </div>
    );
  }

  return <button onClick={requestPermission}>Connect Controller</button>;
}`}
    />

    {/* ── High-frequency inputs ──────────────────────────── */}

    <SectionHeading>High-Frequency Inputs</SectionHeading>
    <Prose>
      <p>
        Inputs like analog sticks, triggers, and motion sensors fire{" "}
        <code>change</code> events at up to 250Hz. The{" "}
        <code>useControllerInput</code> hook triggers a React render on every
        change — this is fine for most UI elements, but can be expensive if
        the component tree below is large.
      </p>
      <p>For performance-sensitive cases:</p>
      <ul>
        <li>
          <strong>Subscribe directly</strong> for canvas or WebGL rendering
          — use <code>useEffect</code> to subscribe to the input's events
          and update a ref or animation frame, bypassing React's render cycle
          entirely.
        </li>
        <li>
          <strong>Throttle at the component level</strong> if you need React
          rendering but don't need every frame — debounce the tick counter or
          use <code>requestAnimationFrame</code> gating.
        </li>
      </ul>
    </Prose>
    <CodeBlock
      code={`// Direct subscription for canvas rendering
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
}`}
    />
  </FeaturePage>
);

export default ReactPage;
