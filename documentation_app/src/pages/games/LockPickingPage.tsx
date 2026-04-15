import React, { useContext, useReducer, useEffect, useRef, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { TriggerEffect, MuteLedMode } from "dualsense-ts";
import type { TriggerFeedbackConfig } from "dualsense-ts";
import { ControllerContext, hasWebHID } from "../../controller";

/* ── Types ──────────────────────────────────────────────────────── */

type GamePhase = "TITLE" | "PICKING" | "RESULT" | "GAME_OVER";

type LockType =
  | "pin-tumbler"
  | "disc-detainer"
  | "wafer"
  | "dimple"
  | "tubular";

interface Lock {
  type: LockType;
  name: string;
  description: string;
  target: number;
  config: TriggerFeedbackConfig;
}

type PickResult = "perfect" | "great" | "good" | "close" | "miss";

interface ResultInfo {
  result: PickResult;
  points: number;
  distance: number;
  guessPos: number;
}

interface GameState {
  phase: GamePhase;
  round: number;
  score: number;
  picks: number;
  currentLock: Lock | null;
  triggerPos: number;
  lastResult: ResultInfo | null;
  blindMode: boolean;
  successStreak: number;
}

type GameAction =
  | { type: "START" }
  | { type: "UPDATE_TRIGGER"; pos: number }
  | { type: "ATTEMPT_PICK" }
  | { type: "ADVANCE_ROUND" }
  | { type: "RESTART" }
  | { type: "TOGGLE_BLIND" };

/* ── Pure game logic ────────────────────────────────────────────── */

const LOCK_DEFS: Record<
  LockType,
  { name: string; description: string }
> = {
  "pin-tumbler": {
    name: "Pin Tumbler",
    description: "A clear snap — find the detent",
  },
  "disc-detainer": {
    name: "Disc Detainer",
    description: "Subtle resistance — feel for the click",
  },
  wafer: {
    name: "Wafer Lock",
    description: "No snap, just a wall of resistance",
  },
  dimple: {
    name: "Dimple Lock",
    description: "The mechanism fights back",
  },
  tubular: {
    name: "Tubular Lock",
    description: "A faint vibration — barely there",
  },
};

const ALL_LOCK_TYPES: LockType[] = [
  "pin-tumbler",
  "disc-detainer",
  "wafer",
  "dimple",
  "tubular",
];

function getLockTypeForRound(round: number): LockType {
  if (round <= 2) return "pin-tumbler";
  if (round <= 4) return "disc-detainer";
  if (round <= 6) return "wafer";
  if (round <= 8) return "dimple";
  if (round <= 10) return "tubular";
  // After the intro progression, randomize
  return ALL_LOCK_TYPES[Math.floor(Math.random() * ALL_LOCK_TYPES.length)];
}

function clamp(v: number, lo = 0, hi = 1): number {
  return Math.max(lo, Math.min(hi, v));
}

function generateLock(round: number): Lock {
  const type = getLockTypeForRound(round);
  const { name, description } = LOCK_DEFS[type];
  const target = 0.15 + Math.random() * 0.7;

  let config: TriggerFeedbackConfig;
  switch (type) {
    case "pin-tumbler":
      config = {
        effect: TriggerEffect.Weapon,
        start: clamp(target - 0.15),
        end: clamp(target + 0.15),
        strength: 0.9,
      };
      break;
    case "disc-detainer":
      config = {
        effect: TriggerEffect.Weapon,
        start: clamp(target - 0.08),
        end: clamp(target + 0.08),
        strength: 0.6,
      };
      break;
    case "wafer":
      config = {
        effect: TriggerEffect.Feedback,
        position: target,
        strength: 0.8,
      };
      break;
    case "dimple":
      config = {
        effect: TriggerEffect.Bow,
        start: clamp(target - 0.1),
        end: clamp(target + 0.1),
        strength: 0.8,
        snapForce: 0.6,
      };
      break;
    case "tubular":
      config = {
        effect: TriggerEffect.Vibration,
        position: target,
        amplitude: 0.3,
        frequency: 20,
      };
      break;
  }

  return { type, name, description, target, config };
}

function scoreAttempt(distance: number): { result: PickResult; points: number } {
  if (distance < 0.03) return { result: "perfect", points: 100 };
  if (distance < 0.07) return { result: "great", points: 75 };
  if (distance < 0.12) return { result: "good", points: 50 };
  if (distance < 0.20) return { result: "close", points: 25 };
  return { result: "miss", points: 0 };
}

function getLightbarColor(distance: number): { r: number; g: number; b: number } {
  if (distance > 0.30) return { r: 0, g: 30, b: 80 };
  if (distance > 0.15) return { r: 180, g: 100, b: 10 };
  if (distance > 0.05) return { r: 0, g: 150, b: 30 };
  return { r: 0, g: 255, b: 50 };
}

const RESULT_COLORS: Record<PickResult, string> = {
  perfect: "#00ff64",
  great: "#00e050",
  good: "#e0c020",
  close: "#d0a020",
  miss: "#ff3030",
};

const RESULT_LABELS: Record<PickResult, string> = {
  perfect: "Perfect!",
  great: "Great!",
  good: "Good",
  close: "Close...",
  miss: "Miss",
};

/* ── Audio (controller speaker via DSP test tones) ──────────────── */

import type { Dualsense } from "dualsense-ts";

function playBrokenPickSound(controller: Dualsense) {
  // 1kHz snap → stop → 100Hz thud
  controller.startTestTone("speaker", "1khz").catch(() => {});
  setTimeout(() => {
    controller.stopTestTone().catch(() => {});
    setTimeout(() => {
      controller.startTestTone("speaker", "100hz").catch(() => {});
      setTimeout(() => controller.stopTestTone().catch(() => {}), 20);
    }, 10);
  }, 60);
}

function playPickRumble(controller: Dualsense) {
  controller.right?.rumble(0.4);
  setTimeout(() => {
    controller.right?.rumble(0);
    setTimeout(() => {
      controller.right?.rumble(0.4);
      setTimeout(() => controller.right?.rumble(0), 50);
    }, 30);
  }, 50);
}

/* ── Reducer ────────────────────────────────────────────────────── */

const initialState: GameState = {
  phase: "TITLE",
  round: 0,
  score: 0,
  picks: 5,
  currentLock: null,
  triggerPos: 0,
  lastResult: null,
  blindMode: false,
  successStreak: 0,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START": {
      const lock = generateLock(1);
      return {
        ...initialState,
        phase: "PICKING",
        round: 1,
        picks: 5,
        currentLock: lock,
        blindMode: state.blindMode,
      };
    }
    case "UPDATE_TRIGGER":
      if (state.phase !== "PICKING") return state;
      return { ...state, triggerPos: action.pos };
    case "ATTEMPT_PICK": {
      if (state.phase !== "PICKING" || !state.currentLock) return state;
      const distance = Math.abs(state.triggerPos - state.currentLock.target);
      const { result, points } = scoreAttempt(distance);
      const isMiss = result === "miss";
      const newPicks = isMiss ? state.picks - 1 : state.picks;
      const newStreak = isMiss ? 0 : state.successStreak + 1;
      const bonusPick = !isMiss && newStreak > 0 && newStreak % 3 === 0 && newPicks < 5;
      const finalPicks = bonusPick ? newPicks + 1 : newPicks;
      return {
        ...state,
        phase: finalPicks <= 0 ? "GAME_OVER" : "RESULT",
        score: state.score + points,
        picks: finalPicks,
        successStreak: newStreak,
        lastResult: { result, points, distance, guessPos: state.triggerPos },
      };
    }
    case "ADVANCE_ROUND": {
      if (state.phase !== "RESULT") return state;
      const nextRound = state.round + 1;
      const lock = generateLock(nextRound);
      return { ...state, phase: "PICKING", round: nextRound, currentLock: lock, triggerPos: 0 };
    }
    case "RESTART":
      return { ...initialState, blindMode: state.blindMode };
    case "TOGGLE_BLIND":
      return { ...state, blindMode: !state.blindMode };
    default:
      return state;
  }
}

/* ── Animations ─────────────────────────────────────────────────── */

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  15% { transform: translateX(-6px); }
  30% { transform: translateX(5px); }
  45% { transform: translateX(-4px); }
  60% { transform: translateX(3px); }
  75% { transform: translateX(-2px); }
`;

const lockOpen = keyframes`
  0% { transform: rotate(0deg); opacity: 1; }
  100% { transform: rotate(15deg); opacity: 0.4; }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`;

/* ── Styled Components ──────────────────────────────────────────── */

const PageContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 24px 80px;
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  margin-bottom: 4px;
`;

const Subtitle = styled.p`
  color: rgba(191, 204, 214, 0.5);
  font-size: 15px;
  margin: 0;
`;

const ScoreBar = styled.div<{ $visible?: boolean }>`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 0 0 12px;
  margin-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 13px;
  font-family: "Fira Code", monospace;
  color: rgba(191, 204, 214, 0.7);
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transition: opacity 0.2s;
`;

const ScoreItem = styled.span`
  white-space: nowrap;
`;

const Spacer = styled.span`
  flex: 1;
`;

const PickDotsContainer = styled.span`
  display: inline-flex;
  gap: 4px;
  align-items: center;
`;

const PickDot = styled.span<{ $filled: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(p) => (p.$filled ? "#f29e02" : "rgba(255, 255, 255, 0.1)")};
  transition: background 0.2s;
`;

const GameArea = styled.div`
  padding: 32px 24px;
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 340px;
  position: relative;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  z-index: 2;
`;

const OverlayContent = styled.div<{ $inactive: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: ${(p) => (p.$inactive ? 0.3 : 1)};
  filter: ${(p) => (p.$inactive ? "grayscale(0.8)" : "none")};
  pointer-events: ${(p) => (p.$inactive ? "none" : "auto")};
  transition: opacity 0.2s, filter 0.2s;
`;

const OverlayBadge = styled.div`
  padding: 6px 14px;
  background: rgba(10, 10, 20, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: rgba(191, 204, 214, 0.7);
  font-size: 12px;
  white-space: nowrap;
  z-index: 3;
`;

const LockContainer = styled.div<{ $anim?: "open" | "jam" }>`
  margin-bottom: 20px;
  ${(p) =>
    p.$anim === "jam" &&
    css`
      animation: ${shake} 0.5s ease;
    `}
  ${(p) =>
    p.$anim === "open" &&
    css`
      animation: ${lockOpen} 0.6s ease forwards;
    `}
`;

const LockLabel = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: rgba(191, 204, 214, 0.4);
  text-align: center;
  margin-top: 10px;
`;

const LockDescription = styled.div`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.5);
  text-align: center;
  margin-top: 4px;
  font-style: italic;
`;

const MiddleZone = styled.div`
  height: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const GaugeContainer = styled.div<{ $visible?: boolean }>`
  width: 100%;
  max-width: 400px;
  margin: 16px 0 8px;
  opacity: ${(p) => (p.$visible === false ? 0 : 1)};
  transition: opacity 0.2s;
`;

const GaugeLabel = styled.div`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(191, 204, 214, 0.3);
  margin-bottom: 4px;
`;

const GaugeTrack = styled.div`
  position: relative;
  width: 100%;
  height: 20px;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  overflow: hidden;
`;

const GaugeFill = styled.div<{ $width: number }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${(p) => p.$width * 100}%;
  background: linear-gradient(
    90deg,
    rgba(242, 158, 2, 0.25),
    rgba(242, 158, 2, 0.55)
  );
  border-radius: 4px 0 0 4px;
  transition: width 0.03s linear;
`;

const GaugeMarker = styled.div<{ $pos: number; $color: string }>`
  position: absolute;
  top: 0;
  left: ${(p) => p.$pos * 100}%;
  width: 3px;
  height: 100%;
  background: ${(p) => p.$color};
  transform: translateX(-1px);
  opacity: 0.9;
`;

const GaugeValue = styled.div`
  font-size: 13px;
  font-family: "Fira Code", monospace;
  color: rgba(191, 204, 214, 0.5);
  text-align: right;
  margin-top: 4px;
`;

const PromptText = styled.div`
  font-size: 14px;
  color: rgba(191, 204, 214, 0.45);
  text-align: center;
  margin-top: 20px;
  animation: ${pulse} 2.5s ease-in-out infinite;
`;

const ResultBanner = styled.div<{ $color: string }>`
  text-align: center;
  animation: ${fadeInUp} 0.3s ease;
  margin: 12px 0;
`;

const ResultWord = styled.div<{ $color: string }>`
  font-size: 28px;
  font-weight: 700;
  color: ${(p) => p.$color};
`;

const ResultPoints = styled.div<{ $color: string }>`
  font-size: 16px;
  font-family: "Fira Code", monospace;
  color: ${(p) => p.$color};
  opacity: 0.8;
  margin-top: 2px;
`;

const ResultDistance = styled.div`
  font-size: 12px;
  font-family: "Fira Code", monospace;
  color: rgba(191, 204, 214, 0.35);
  margin-top: 4px;
`;

const BlindModeButton = styled.button`
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 6px;
  color: rgba(191, 204, 214, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s, border-color 0.15s;
  z-index: 1;

  &:hover {
    color: rgba(191, 204, 214, 0.7);
    border-color: rgba(255, 255, 255, 0.15);
  }
`;

const TitleLogo = styled.div`
  font-size: 14px;
  color: rgba(191, 204, 214, 0.6);
  text-align: center;
  max-width: 320px;
  line-height: 1.6;
  margin-bottom: 8px;
`;

const GameOverScore = styled.div`
  font-size: 36px;
  font-weight: 700;
  font-family: "Fira Code", monospace;
  color: #f29e02;
  margin: 8px 0;
`;

const GameOverDetail = styled.div`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.5);
  margin-bottom: 4px;
`;

/* ── Lock SVG ───────────────────────────────────────────────────── */

const LockSvg: React.FC<{ success?: boolean }> = ({ success }) => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
    {/* Shackle */}
    <path
      d="M40 52 V36 C40 22 80 22 80 36 V52"
      stroke={success ? "rgba(0, 220, 80, 0.5)" : "rgba(242, 158, 2, 0.25)"}
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    {/* Body */}
    <rect
      x="30"
      y="52"
      width="60"
      height="48"
      rx="6"
      fill={success ? "rgba(0, 220, 80, 0.12)" : "rgba(242, 158, 2, 0.08)"}
      stroke={success ? "rgba(0, 220, 80, 0.4)" : "rgba(242, 158, 2, 0.3)"}
      strokeWidth="2"
    />
    {/* Keyhole */}
    <circle
      cx="60"
      cy="72"
      r="7"
      fill={success ? "rgba(0, 220, 80, 0.5)" : "rgba(242, 158, 2, 0.4)"}
    />
    <path
      d="M57 78 L60 92 L63 78"
      fill={success ? "rgba(0, 220, 80, 0.5)" : "rgba(242, 158, 2, 0.4)"}
    />
  </svg>
);

/* ── Component ──────────────────────────────────────────────────── */

const LockPickingPage: React.FC = () => {
  const controller = useContext(ControllerContext);
  const [connected, setConnected] = useState(!!controller?.connection?.state);
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const stateRef = useRef(state);
  const resultTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Keep ref in sync
  stateRef.current = state;

  // Track connection state
  useEffect(() => {
    if (!controller?.connection) return;
    const handler = () => setConnected(!!controller.connection.state);
    handler();
    controller.connection.on("change", handler);
    return () => {
      controller.connection.removeListener("change", handler);
    };
  }, [controller]);

  // R2 trigger position listener
  useEffect(() => {
    if (!controller?.right?.trigger) return;
    const handler = () => {
      dispatch({ type: "UPDATE_TRIGGER", pos: controller.right.trigger.state });
    };
    controller.right.trigger.on("change", handler);
    return () => {
      controller.right.trigger.removeListener("change", handler);
    };
  }, [controller]);

  // Cross button handler
  useEffect(() => {
    if (!controller?.cross) return;
    const handler = () => {
      const { phase } = stateRef.current;
      if (phase === "TITLE") dispatch({ type: "START" });
      else if (phase === "PICKING") dispatch({ type: "ATTEMPT_PICK" });
      else if (phase === "GAME_OVER") dispatch({ type: "RESTART" });
    };
    controller.cross.on("press", handler);
    return () => {
      controller.cross.off("press", handler);
    };
  }, [controller]);

  // Apply trigger effect
  useEffect(() => {
    if (!controller?.right?.trigger?.feedback) return;
    if (state.phase === "PICKING" && state.currentLock) {
      controller.right.trigger.feedback.set(state.currentLock.config);
    } else {
      controller.right.trigger.feedback.reset();
    }
  }, [controller, state.phase, state.currentLock]);

  // Lightbar hint system
  useEffect(() => {
    if (!controller?.lightbar) return;
    if (state.phase === "PICKING" && state.currentLock && !state.blindMode) {
      const distance = Math.abs(state.triggerPos - state.currentLock.target);
      controller.lightbar.set(getLightbarColor(distance));
    } else if (state.phase === "PICKING" && state.blindMode) {
      controller.lightbar.set({ r: 5, g: 5, b: 10 });
    }
  }, [controller, state.phase, state.triggerPos, state.currentLock, state.blindMode]);

  // Player LEDs sync
  useEffect(() => {
    if (!controller?.playerLeds) return;
    for (let i = 0; i < 5; i++) {
      controller.playerLeds.setLed(i, i < state.picks);
    }
  }, [controller, state.picks]);

  // Result feedback (rumble, lightbar flash, mute LED)
  useEffect(() => {
    if (!controller) return;
    if (state.phase !== "RESULT" && state.phase !== "GAME_OVER") return;
    if (!state.lastResult) return;

    const { result } = state.lastResult;

    if (result === "miss") {
      controller.lightbar?.set({ r: 255, g: 20, b: 20 });
      controller.left?.rumble(0.8);
      controller.right?.rumble(0.4);
      controller.mute?.setLed(MuteLedMode.Pulse);
      playBrokenPickSound(controller);
      const t1 = setTimeout(() => {
        controller.left?.rumble(0);
        controller.right?.rumble(0);
      }, 400);
      const t2 = setTimeout(() => {
        controller.mute?.resetLed();
      }, 800);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else if (result === "close") {
      controller.lightbar?.set({ r: 200, g: 160, b: 20 });
      playPickRumble(controller);
    } else {
      controller.lightbar?.set({ r: 0, g: 255, b: 80 });
      playPickRumble(controller);
    }
  }, [controller, state.phase, state.lastResult]);

  // Auto-advance from RESULT to next round
  useEffect(() => {
    if (state.phase !== "RESULT") return;
    resultTimerRef.current = setTimeout(() => {
      dispatch({ type: "ADVANCE_ROUND" });
    }, 1500);
    return () => {
      if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
    };
  }, [state.phase, state.round]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      controller?.right?.trigger?.feedback?.reset();
      controller?.left?.trigger?.feedback?.reset();
      controller?.left?.rumble(0);
      controller?.right?.rumble(0);
      controller?.lightbar?.set({ r: 0, g: 0, b: 255 });
      controller?.playerLeds?.clear();
      controller?.mute?.resetLed();
      controller?.stopTestTone()?.catch(() => {});
      if (resultTimerRef.current) clearTimeout(resultTimerRef.current);
    };
  }, [controller]);

  const inactive = !hasWebHID || !connected;
  const overlayMsg = !hasWebHID
    ? "Requires WebHID (Chrome, Edge, Opera)"
    : !connected
      ? "Connect a controller to play"
      : null;

  const lockAnim =
    state.phase === "RESULT" && state.lastResult
      ? state.lastResult.result === "miss"
        ? "jam"
        : "open"
      : undefined;

  const showGauge = state.phase === "PICKING" || state.phase === "RESULT";

  return (
    <PageContainer>
      <Header>
        <Title>Lock Picking</Title>
        <Subtitle>Feel for the sweet spot using only your trigger finger.</Subtitle>
      </Header>

      <GameArea>
        {overlayMsg && (
          <Overlay>
            <OverlayBadge>{overlayMsg}</OverlayBadge>
          </Overlay>
        )}
        <OverlayContent $inactive={inactive}>
          <ScoreBar $visible={state.phase !== "TITLE"}>
            <ScoreItem>Round {state.round}</ScoreItem>
            <ScoreItem>Score {state.score}</ScoreItem>
            <Spacer />
            <PickDotsContainer>
              {Array.from({ length: 5 }, (_, i) => (
                <PickDot key={i} $filled={i < state.picks} />
              ))}
            </PickDotsContainer>
          </ScoreBar>

          {/* Lock icon — always rendered, animated on result */}
          <LockContainer $anim={state.phase === "RESULT" || state.phase === "GAME_OVER" ? lockAnim : undefined}>
            <LockSvg success={state.phase === "RESULT" && state.lastResult?.result !== "miss"} />
          </LockContainer>

          {/* Middle zone — fixed height to prevent reflow */}
          <MiddleZone>
            {state.phase === "TITLE" && (
              <TitleLogo>
                Each lock hides a resistance point in your R2 trigger.
                Squeeze slowly, feel for it, and press <strong>Cross</strong> to pick.
              </TitleLogo>
            )}

            {state.phase === "PICKING" && state.currentLock && (
              <>
                <LockLabel>{state.currentLock.name}</LockLabel>
                <LockDescription>{state.currentLock.description}</LockDescription>
              </>
            )}

            {state.phase === "RESULT" && state.lastResult && (
              <ResultBanner $color={RESULT_COLORS[state.lastResult.result]}>
                <ResultWord $color={RESULT_COLORS[state.lastResult.result]}>
                  {RESULT_LABELS[state.lastResult.result]}
                </ResultWord>
                {state.lastResult.points > 0 && (
                  <ResultPoints $color={RESULT_COLORS[state.lastResult.result]}>
                    +{state.lastResult.points}
                  </ResultPoints>
                )}
                <ResultDistance>
                  off by {state.lastResult.distance.toFixed(3)}
                </ResultDistance>
              </ResultBanner>
            )}

            {state.phase === "GAME_OVER" && (
              <>
                <GameOverDetail>Game Over</GameOverDetail>
                <GameOverScore>{state.score}</GameOverScore>
                <GameOverDetail>Round {state.round} reached</GameOverDetail>
              </>
            )}
          </MiddleZone>

          {/* Gauge — always rendered, hidden on title/game-over */}
          <GaugeContainer $visible={state.phase === "PICKING" || state.phase === "RESULT"}>
            <GaugeLabel>R2</GaugeLabel>
            <GaugeTrack>
              <GaugeFill $width={state.phase === "RESULT" && state.lastResult ? state.lastResult.guessPos : state.triggerPos} />
              {state.phase === "RESULT" && state.lastResult && state.currentLock && (
                <GaugeMarker
                  $pos={state.currentLock.target}
                  $color={RESULT_COLORS[state.lastResult.result]}
                />
              )}
            </GaugeTrack>
            <GaugeValue>
              {state.phase === "RESULT" && state.lastResult
                ? state.lastResult.guessPos.toFixed(2)
                : state.triggerPos.toFixed(2)}
            </GaugeValue>
          </GaugeContainer>

          {/* Prompt — always rendered */}
          <PromptText>
            {state.phase === "TITLE" && "Press \u2715 to begin"}
            {state.phase === "PICKING" && "Press \u2715 to pick"}
            {state.phase === "GAME_OVER" && "Press \u2715 to restart"}
            {state.phase === "RESULT" && "\u00a0"}
          </PromptText>
        </OverlayContent>
        <BlindModeButton
          onClick={() => dispatch({ type: "TOGGLE_BLIND" })}
          title={state.blindMode ? "Blind mode: on — lightbar hints disabled" : "Blind mode: off — lightbar hints enabled"}
        >
          {state.blindMode ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </BlindModeButton>
      </GameArea>
    </PageContainer>
  );
};

export default LockPickingPage;
