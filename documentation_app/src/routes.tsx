import React from "react";
import type { RouteObject } from "react-router";
import { DocLayout, RouteErrorBoundary } from "./components/layout";

const Home = React.lazy(() => import("./pages/Home"));
const GettingStarted = React.lazy(() => import("./pages/GettingStarted"));

const InputsOverview = React.lazy(() => import("./pages/inputs/InputsOverview"));
const ButtonsPage = React.lazy(() => import("./pages/inputs/ButtonsPage"));
const AnalogPage = React.lazy(() => import("./pages/inputs/AnalogPage"));
const TriggersPage = React.lazy(() => import("./pages/inputs/TriggersPage"));
const TouchpadPage = React.lazy(() => import("./pages/inputs/TouchpadPage"));
const MotionPage = React.lazy(() => import("./pages/inputs/MotionPage"));
const BatteryPage = React.lazy(() => import("./pages/inputs/BatteryPage"));
const ConnectionPage = React.lazy(() => import("./pages/inputs/ConnectionPage"));

const OutputsOverview = React.lazy(() => import("./pages/outputs/OutputsOverview"));
const RumblePage = React.lazy(() => import("./pages/outputs/RumblePage"));
const LightbarPage = React.lazy(() => import("./pages/outputs/LightbarPage"));
const PlayerLedsPage = React.lazy(() => import("./pages/outputs/PlayerLedsPage"));
const MuteLedPage = React.lazy(() => import("./pages/outputs/MuteLedPage"));
const TriggerEffectsPage = React.lazy(() => import("./pages/outputs/TriggerEffectsPage"));
const AudioPage = React.lazy(() => import("./pages/outputs/AudioPage"));
const PowerSavePage = React.lazy(() => import("./pages/outputs/PowerSavePage"));

const AccessOverview = React.lazy(() => import("./pages/access/AccessOverview"));
const AccessPlayground = React.lazy(() => import("./pages/access/AccessPlayground"));
const AccessHardwareInputs = React.lazy(() => import("./pages/access/AccessHardwareInputs"));
const AccessProfileInputs = React.lazy(() => import("./pages/access/AccessProfileInputs"));
const AccessLedControl = React.lazy(() => import("./pages/access/AccessLedControl"));
const AccessProfileManagement = React.lazy(() => import("./pages/access/AccessProfileManagement"));
const AccessExpansionSlots = React.lazy(() => import("./pages/access/AccessExpansionSlots"));
const StatusPage = React.lazy(() => import("./pages/StatusPage"));
const MultiplayerPage = React.lazy(() => import("./pages/MultiplayerPage"));
const ReactPage = React.lazy(() => import("./pages/ReactPage"));
const HidReportsPage = React.lazy(() => import("./pages/HidReportsPage"));
const PlaygroundPage = React.lazy(() => import("./pages/PlaygroundPage"));

const ApiIndex = React.lazy(() => import("./pages/api/ApiIndex"));
const ApiDualsense = React.lazy(() => import("./pages/api/DualsensePage"));
const ApiManager = React.lazy(() => import("./pages/api/ManagerPage"));
const ApiInput = React.lazy(() => import("./pages/api/InputPage"));
const ApiMomentary = React.lazy(() => import("./pages/api/MomentaryPage"));
const ApiAxis = React.lazy(() => import("./pages/api/AxisPage"));
const ApiAnalog = React.lazy(() => import("./pages/api/AnalogPage"));
const ApiTrigger = React.lazy(() => import("./pages/api/TriggerPage"));
const ApiUnisense = React.lazy(() => import("./pages/api/UnisensePage"));
const ApiDpad = React.lazy(() => import("./pages/api/DpadPage"));
const ApiTouchpad = React.lazy(() => import("./pages/api/TouchpadPage"));
const ApiGyroscope = React.lazy(() => import("./pages/api/GyroscopePage"));
const ApiAccelerometer = React.lazy(() => import("./pages/api/AccelerometerPage"));
const ApiBattery = React.lazy(() => import("./pages/api/BatteryPage"));
const ApiLightbar = React.lazy(() => import("./pages/api/LightbarRefPage"));
const ApiPlayerLeds = React.lazy(() => import("./pages/api/PlayerLedsRefPage"));
const ApiMute = React.lazy(() => import("./pages/api/MuteRefPage"));
const ApiAudio = React.lazy(() => import("./pages/api/AudioRefPage"));
const ApiPowerSave = React.lazy(() => import("./pages/api/PowerSaveRefPage"));
const ApiTriggerFeedback = React.lazy(() => import("./pages/api/TriggerFeedbackPage"));
const ApiOrientation = React.lazy(() => import("./pages/api/OrientationPage"));
const ApiShakeDetector = React.lazy(() => import("./pages/api/ShakeDetectorPage"));
const ApiEnums = React.lazy(() => import("./pages/api/EnumsPage"));
const ApiTypes = React.lazy(() => import("./pages/api/TypesPage"));

export const routes: RouteObject[] = [
  {
    element: <DocLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <Home /> },
      { path: "getting-started", element: <GettingStarted /> },

      { path: "inputs", element: <InputsOverview /> },
      { path: "inputs/buttons", element: <ButtonsPage /> },
      { path: "inputs/analog", element: <AnalogPage /> },
      { path: "inputs/triggers", element: <TriggersPage /> },
      { path: "inputs/touchpad", element: <TouchpadPage /> },
      { path: "inputs/motion", element: <MotionPage /> },
      { path: "inputs/battery", element: <BatteryPage /> },
      { path: "inputs/connection", element: <ConnectionPage /> },

      { path: "outputs", element: <OutputsOverview /> },
      { path: "outputs/rumble", element: <RumblePage /> },
      { path: "outputs/lightbar", element: <LightbarPage /> },
      { path: "outputs/player-leds", element: <PlayerLedsPage /> },
      { path: "outputs/mute-led", element: <MuteLedPage /> },
      { path: "outputs/trigger-effects", element: <TriggerEffectsPage /> },
      { path: "outputs/audio", element: <AudioPage /> },
      { path: "outputs/power-save", element: <PowerSavePage /> },

      { path: "access", element: <AccessOverview /> },
      { path: "access/playground", element: <AccessPlayground /> },
      { path: "access/hardware-inputs", element: <AccessHardwareInputs /> },
      { path: "access/profile-inputs", element: <AccessProfileInputs /> },
      { path: "access/led-control", element: <AccessLedControl /> },
      { path: "access/profile-management", element: <AccessProfileManagement /> },
      { path: "access/expansion-slots", element: <AccessExpansionSlots /> },
      { path: "status", element: <StatusPage /> },
      { path: "multiplayer", element: <MultiplayerPage /> },
      { path: "react", element: <ReactPage /> },
      { path: "hid-reports", element: <HidReportsPage /> },
      { path: "playground", element: <PlaygroundPage /> },

      { path: "api", element: <ApiIndex /> },
      { path: "api/dualsense", element: <ApiDualsense /> },
      { path: "api/manager", element: <ApiManager /> },
      { path: "api/input", element: <ApiInput /> },
      { path: "api/momentary", element: <ApiMomentary /> },
      { path: "api/axis", element: <ApiAxis /> },
      { path: "api/analog", element: <ApiAnalog /> },
      { path: "api/trigger", element: <ApiTrigger /> },
      { path: "api/unisense", element: <ApiUnisense /> },
      { path: "api/dpad", element: <ApiDpad /> },
      { path: "api/touchpad", element: <ApiTouchpad /> },
      { path: "api/gyroscope", element: <ApiGyroscope /> },
      { path: "api/accelerometer", element: <ApiAccelerometer /> },
      { path: "api/battery", element: <ApiBattery /> },
      { path: "api/lightbar", element: <ApiLightbar /> },
      { path: "api/player-leds", element: <ApiPlayerLeds /> },
      { path: "api/mute", element: <ApiMute /> },
      { path: "api/audio", element: <ApiAudio /> },
      { path: "api/power-save", element: <ApiPowerSave /> },
      { path: "api/trigger-feedback", element: <ApiTriggerFeedback /> },
      { path: "api/orientation", element: <ApiOrientation /> },
      { path: "api/shake-detector", element: <ApiShakeDetector /> },
      { path: "api/enums", element: <ApiEnums /> },
      { path: "api/types", element: <ApiTypes /> },
    ],
  },
];
