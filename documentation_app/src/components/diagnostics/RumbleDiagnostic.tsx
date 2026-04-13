import React, { useContext, useState, useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import { ControllerContext } from "../../controller";

/* ── Layout ─────────────────────────────────────────────────── */

const Table = styled.div`
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
`;

/* ── Rumble track ──────────────────────────────────────────── */

const TrackWrap = styled.div`
  position: relative;
  height: 24px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
  cursor: pointer;
`;

const TrackFill = styled.div<{ $pct: number }>`
  position: absolute;
  inset: 0;
  right: ${(p) => 100 - p.$pct}%;
  background: linear-gradient(
    90deg,
    rgba(242, 158, 2, ${(p) => 0.08 + p.$pct * 0.003}),
    rgba(242, 158, 2, ${(p) => 0.15 + p.$pct * 0.005})
  );
  transition: right 0.04s;
`;

const TrackThumb = styled.div<{ $pct: number }>`
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: ${(p) => p.$pct}%;
  width: 4px;
  margin-left: -2px;
  border-radius: 2px;
  background: #f29e02;
  opacity: ${(p) => (p.$pct > 0 ? 0.9 : 0.3)};
  transition: left 0.04s, opacity 0.1s;
`;

const HiddenRange = styled.input`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  margin: 0;
`;

const SliderRow = styled.div<{ $even?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 16px;
  background: ${(p) => (p.$even ? "rgba(0, 0, 0, 0.12)" : "rgba(0, 0, 0, 0.06)")};
`;

const SliderTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const Dim = styled.span`
  color: rgba(191, 204, 214, 0.3);
`;

const SliderLabel = styled.code`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.85);
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
  text-align: left;
`;

const SliderVal = styled.code<{ $highlight?: boolean }>`
  font-size: 12px;
  flex-shrink: 0;
  width: 5ch;
  text-align: right;
  color: ${(p) => (p.$highlight ? "#f29e02" : "rgba(191, 204, 214, 0.5)")};
  transition: color 0.06s;
`;

/* ── Header ────────────────────────────────────────────────── */

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 16px;
  background: rgba(0, 0, 0, 0.18);
`;

const HeaderCell = styled.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(191, 204, 214, 0.35);
`;

/* ── Buttons ─────────────────────────────────────────────────── */

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.06);
`;

const ActionButton = styled.button<{ $variant: "stop" | "full" | "toggle" | "pattern" }>`
  flex: 1;
  padding: 8px 0;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  border: 1px solid
    ${(p) => {
      switch (p.$variant) {
        case "stop": return "rgba(255, 107, 107, 0.4)";
        case "full": return "rgba(242, 158, 2, 0.4)";
        case "toggle": return "rgba(72, 175, 240, 0.4)";
        case "pattern": return "rgba(72, 175, 240, 0.4)";
      }
    }};
  background: ${(p) => {
    switch (p.$variant) {
      case "stop": return "rgba(255, 107, 107, 0.1)";
      case "full": return "rgba(242, 158, 2, 0.1)";
      case "toggle": return "rgba(72, 175, 240, 0.1)";
      case "pattern": return "rgba(72, 175, 240, 0.1)";
    }
  }};
  color: ${(p) => {
    switch (p.$variant) {
      case "stop": return "#ff6b6b";
      case "full": return "#f29e02";
      case "toggle": return "#48aff0";
      case "pattern": return "#48aff0";
    }
  }};

  &:hover {
    background: ${(p) => {
      switch (p.$variant) {
        case "stop": return "rgba(255, 107, 107, 0.2)";
        case "full": return "rgba(242, 158, 2, 0.2)";
        case "toggle": return "rgba(72, 175, 240, 0.2)";
        case "pattern": return "rgba(72, 175, 240, 0.2)";
      }
    }};
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
`;

const ActiveButton = styled(ActionButton)`
  background: rgba(72, 175, 240, 0.25);
  border-color: rgba(72, 175, 240, 0.6);
`;

/* ── Rumble slider row ─────────────────────────────────────── */

const RumbleSlider: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
  even: boolean;
}> = ({ label, value, onChange, even }) => {
  const parts = label.split(".");
  const pct = value * 100;
  return (
    <SliderRow $even={even}>
      <SliderTopRow>
        <SliderLabel>
          <bdi>
            <Dim>controller.</Dim>
            {parts.map((part, i) => (
              <React.Fragment key={i}>
                {i > 0 && <Dim>.</Dim>}
                {i === parts.length - 1 ? part : <Dim>{part}</Dim>}
              </React.Fragment>
            ))}
          </bdi>
        </SliderLabel>
        <SliderVal $highlight={value > 0}>
          {pct.toFixed(0)}%
        </SliderVal>
      </SliderTopRow>
      <TrackWrap>
        <TrackFill $pct={pct} />
        <TrackThumb $pct={pct} />
        <HiddenRange
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
        />
      </TrackWrap>
    </SliderRow>
  );
};

/* ── Readout row ──────────────────────────────────────────── */

const ReadoutRow = styled.div<{ $even?: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px 16px;
  background: ${(p) => (p.$even ? "rgba(0, 0, 0, 0.12)" : "rgba(0, 0, 0, 0.06)")};
`;

const ReadoutLabel = styled.code`
  font-size: 12px;
  color: rgba(191, 204, 214, 0.5);
  white-space: nowrap;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  direction: rtl;
  text-align: left;
`;

const ReadoutVal = styled.code<{ $highlight?: boolean }>`
  font-size: 12px;
  flex-shrink: 0;
  width: 5ch;
  text-align: right;
  color: ${(p) => (p.$highlight ? "#f29e02" : "rgba(191, 204, 214, 0.4)")};
  transition: color 0.06s;
`;

/* ── Connected component ─────────────────────────────────── */

const RumbleDiagnosticConnected: React.FC = () => {
  const controller = useContext(ControllerContext);
  const [leftVal, setLeftVal] = useState(0);
  const [rightVal, setRightVal] = useState(0);
  const [reactive, setReactive] = useState(false);
  const [pulsing, setPulsing] = useState(false);
  const pulseAbort = useRef<AbortController | null>(null);

  // Reset rumble on unmount
  useEffect(() => {
    return () => {
      controller.left.rumble(0);
      controller.right.rumble(0);
    };
  }, [controller]);

  // Reactive rumble: wire triggers to motors
  useEffect(() => {
    if (!reactive) return;

    const onLeft = (trigger: { state: number }) => {
      const v = trigger.state;
      setLeftVal(v);
      controller.left.rumble(v);
    };
    const onRight = (trigger: { state: number }) => {
      const v = trigger.state;
      setRightVal(v);
      controller.right.rumble(v);
    };

    controller.left.trigger.on("change", onLeft);
    controller.right.trigger.on("change", onRight);

    return () => {
      controller.left.trigger.removeListener("change", onLeft);
      controller.right.trigger.removeListener("change", onRight);
    };
  }, [controller, reactive]);

  const onLeftChange = useCallback(
    (v: number) => {
      if (reactive) return;
      setLeftVal(v);
      controller.left.rumble(v);
    },
    [controller, reactive],
  );

  const onRightChange = useCallback(
    (v: number) => {
      if (reactive) return;
      setRightVal(v);
      controller.right.rumble(v);
    },
    [controller, reactive],
  );

  const stopAll = useCallback(() => {
    setReactive(false);
    setLeftVal(0);
    setRightVal(0);
    controller.rumble(0);
  }, [controller]);

  const fullAll = useCallback(() => {
    setLeftVal(1);
    setRightVal(1);
    controller.rumble(1);
  }, [controller]);

  const toggleReactive = useCallback(() => {
    setReactive((prev) => {
      if (prev) {
        // Turning off — stop rumble
        setLeftVal(0);
        setRightVal(0);
        controller.rumble(0);
      }
      return !prev;
    });
  }, [controller]);

  const runPulse = useCallback(async () => {
    if (pulsing) return;
    setReactive(false);
    setPulsing(true);
    const abort = new AbortController();
    pulseAbort.current = abort;

    const wait = (ms: number) =>
      new Promise<void>((resolve, reject) => {
        const id = setTimeout(resolve, ms);
        abort.signal.addEventListener("abort", () => {
          clearTimeout(id);
          reject(new Error("aborted"));
        });
      });

    try {
      for (let i = 0; i < 3; i++) {
        controller.rumble(0.6);
        setLeftVal(0.6);
        setRightVal(0.6);
        await wait(200);
        controller.rumble(0);
        setLeftVal(0);
        setRightVal(0);
        await wait(200);
      }
    } catch {
      // aborted
    } finally {
      controller.rumble(0);
      setLeftVal(0);
      setRightVal(0);
      setPulsing(false);
      pulseAbort.current = null;
    }
  }, [controller, pulsing]);

  // Abort pulse on unmount
  useEffect(() => {
    return () => {
      pulseAbort.current?.abort();
    };
  }, []);

  const avg = (leftVal + rightVal) / 2;
  const ToggleBtn = reactive ? ActiveButton : ActionButton;

  return (
    <>
      <RumbleSlider label="left.rumble" value={leftVal} onChange={onLeftChange} even={false} />
      <RumbleSlider label="right.rumble" value={rightVal} onChange={onRightChange} even={true} />
      <ButtonRow>
        <ActionButton $variant="stop" onClick={stopAll}>Stop</ActionButton>
        <ActionButton $variant="full" onClick={fullAll}>Full</ActionButton>
      </ButtonRow>
      <ButtonRow>
        <ToggleBtn $variant="toggle" onClick={toggleReactive}>
          {reactive ? "Trigger Reactive: On" : "Trigger Reactive: Off"}
        </ToggleBtn>
        <ActionButton $variant="pattern" onClick={runPulse} disabled={pulsing}>
          {pulsing ? "Pulsing..." : "Pulse Pattern"}
        </ActionButton>
      </ButtonRow>
      <ReadoutRow>
        <ReadoutLabel>
          <bdi><Dim>controller.</Dim>left<Dim>.</Dim>rumble()</bdi>
        </ReadoutLabel>
        <ReadoutVal $highlight={leftVal > 0}>{leftVal.toFixed(2)}</ReadoutVal>
      </ReadoutRow>
      <ReadoutRow $even>
        <ReadoutLabel>
          <bdi><Dim>controller.</Dim>right<Dim>.</Dim>rumble()</bdi>
        </ReadoutLabel>
        <ReadoutVal $highlight={rightVal > 0}>{rightVal.toFixed(2)}</ReadoutVal>
      </ReadoutRow>
      <ReadoutRow>
        <ReadoutLabel>
          <bdi><Dim>controller.</Dim>rumble()</bdi>
        </ReadoutLabel>
        <ReadoutVal $highlight={avg > 0}>{avg.toFixed(2)}</ReadoutVal>
      </ReadoutRow>
    </>
  );
};

/* ── Exported component ───────────────────────────────────── */

export const RumbleDiagnostic: React.FC = () => (
  <Table>
    <HeaderRow>
      <HeaderCell style={{ flex: 1 }}>motor</HeaderCell>
      <HeaderCell style={{ flexShrink: 0, width: "5ch", textAlign: "right" }}>value</HeaderCell>
    </HeaderRow>
    <RumbleDiagnosticConnected />
  </Table>
);
