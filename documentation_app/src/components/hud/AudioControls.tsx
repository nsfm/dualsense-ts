import React from "react";
import styled from "styled-components";
import { Select, Tag } from "../ui";
import { Dualsense, AudioOutput, MicSelect, MicMode } from "dualsense-ts";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const Panel = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 140px;
`;

const SliderSection = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 200px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SectionLabel = styled.span`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.35;
`;

const ToggleBtn = styled.button<{ $active: boolean }>`
  background: ${(p) =>
    p.$active ? "rgba(72, 175, 240, 0.2)" : "rgba(72, 175, 240, 0.04)"};
  border: 1px solid
    ${(p) =>
      p.$active ? "rgba(72, 175, 240, 0.5)" : "rgba(72, 175, 240, 0.15)"};
  border-radius: 3px;
  color: ${(p) => (p.$active ? "#48aff0" : "rgba(72, 175, 240, 0.5)")};
  font-size: 11px;
  padding: 3px 10px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: rgba(72, 175, 240, 0.15);
    color: #48aff0;
  }
`;

const MuteBtn = styled.button<{ $muted: boolean }>`
  background: ${(p) =>
    p.$muted ? "rgba(242, 158, 2, 0.2)" : "rgba(72, 175, 240, 0.04)"};
  border: 1px solid
    ${(p) =>
      p.$muted ? "rgba(242, 158, 2, 0.5)" : "rgba(72, 175, 240, 0.15)"};
  border-radius: 3px;
  color: ${(p) => (p.$muted ? "#f29e02" : "rgba(72, 175, 240, 0.5)")};
  font-size: 11px;
  padding: 3px 10px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: ${(p) =>
      p.$muted ? "rgba(242, 158, 2, 0.3)" : "rgba(72, 175, 240, 0.15)"};
  }
`;

const BAR_WIDTH = 180;
const BAR_HEIGHT = 28;
const ACCENT = "#48aff0";

const HBar = ({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.05,
  formatValue,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  formatValue?: (v: number) => string;
}) => {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const dragging = React.useRef(false);

  const valueFromEvent = React.useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, x / rect.width));
      const raw = min + ratio * (max - min);
      const stepped = Math.round(raw / step) * step;
      onChange(Math.max(min, Math.min(max, stepped)));
    },
    [onChange, min, max, step],
  );

  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      dragging.current = true;
      valueFromEvent(e);
      const handleMove = (ev: MouseEvent) => {
        if (dragging.current) valueFromEvent(ev);
      };
      const handleUp = () => {
        dragging.current = false;
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleUp);
      };
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
    },
    [valueFromEvent],
  );

  const ratio = (value - min) / (max - min);
  const fillW = ratio * BAR_WIDTH;
  const display = formatValue
    ? formatValue(value)
    : Math.round(value * 100) + "%";

  return (
    <svg
      ref={svgRef}
      width={BAR_WIDTH}
      height={BAR_HEIGHT}
      style={{
        cursor: "ew-resize",
        borderRadius: 3,
        flex: "1 1 " + BAR_WIDTH + "px",
        maxWidth: 280,
      }}
      onMouseDown={handleMouseDown}
    >
      <rect x={0} y={0} width={BAR_WIDTH} height={BAR_HEIGHT} fill="rgba(72, 175, 240, 0.08)" rx={3} />
      <rect x={0.5} y={0.5} width={BAR_WIDTH - 1} height={BAR_HEIGHT - 1} fill="none" stroke="rgba(72, 175, 240, 0.2)" strokeWidth={1} rx={3} />
      {fillW > 0 && (
        <rect x={1} y={1} width={Math.min(fillW, BAR_WIDTH - 2)} height={BAR_HEIGHT - 2} fill={ACCENT} opacity={0.15 + ratio * 0.25} rx={2} />
      )}
      {ratio > 0 && (
        <line x1={fillW} y1={1} x2={fillW} y2={BAR_HEIGHT - 1} stroke={ACCENT} strokeWidth={1.5} opacity={0.6} />
      )}
      <text x={7} y={BAR_HEIGHT / 2} dominantBaseline="central" fill="currentColor" fontSize={11} fontWeight={600} opacity={0.5}>
        {label}
      </text>
      <text x={BAR_WIDTH - 7} y={BAR_HEIGHT / 2} dominantBaseline="central" textAnchor="end" fill={ACCENT} fontSize={11} fontWeight={600} opacity={0.7}>
        {display}
      </text>
    </svg>
  );
};

const DebugTray = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 4px;
`;

const DebugToggle = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.3);
  font-size: 10px;
  cursor: pointer;
  padding: 0;
  text-align: left;
  &:hover {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const ByteInput = styled.input`
  width: 36px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(72, 175, 240, 0.2);
  border-radius: 3px;
  color: #48aff0;
  font-size: 11px;
  font-family: monospace;
  padding: 3px 4px;
  text-align: center;

  &:focus {
    outline: none;
    border-color: rgba(72, 175, 240, 0.5);
  }
`;

const ByteLabel = styled.span`
  font-size: 9px;
  font-family: monospace;
  opacity: 0.35;
  text-align: center;
`;

const ByteColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const ResponsePre = styled.pre`
  font-size: 11px;
  font-family: monospace;
  color: rgba(72, 175, 240, 0.7);
  background: rgba(0, 0, 0, 0.3);
  padding: 6px 8px;
  border-radius: 3px;
  margin: 0;
  overflow-x: auto;
  white-space: pre;
  max-height: 80px;
`;

export const AudioControls = ({
  controller,
}: {
  controller: Dualsense;
}) => {
  const [speakerVol, setSpeakerVol] = React.useState(controller.audio.speakerVolume);
  const [headphoneVol, setHeadphoneVol] = React.useState(controller.audio.headphoneVolume);
  const [micVol, setMicVol] = React.useState(controller.audio.microphoneVolume);
  const [output, setOutput] = React.useState(controller.audio.output);
  const [preampGain, setPreampGain] = React.useState(controller.audio.preampGain);
  const [beamForming, setBeamForming] = React.useState(controller.audio.beamForming);
  const [spkMuted, setSpkMuted] = React.useState(controller.audio.speakerMuted);
  const [hpMuted, setHpMuted] = React.useState(controller.audio.headphoneMuted);
  const [micMuted, setMicMuted] = React.useState(controller.audio.microphoneMuted);

  const handleSpeakerVol = React.useCallback((v: number) => { setSpeakerVol(v); controller.audio.setSpeakerVolume(v); }, [controller]);
  const handleHeadphoneVol = React.useCallback((v: number) => { setHeadphoneVol(v); controller.audio.setHeadphoneVolume(v); }, [controller]);
  const handleMicVol = React.useCallback((v: number) => { setMicVol(v); controller.audio.setMicrophoneVolume(v); }, [controller]);

  const handleOutput = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = Number(e.target.value) as AudioOutput;
    setOutput(val);
    controller.audio.setOutput(val);
  }, [controller]);

  const handlePreamp = React.useCallback((v: number) => {
    const gain = Math.round(v);
    setPreampGain(gain);
    controller.audio.setPreamp(gain, beamForming);
  }, [controller, beamForming]);

  const toggleBeamForming = React.useCallback(() => {
    const next = !beamForming;
    setBeamForming(next);
    controller.audio.setPreamp(preampGain, next);
  }, [controller, preampGain, beamForming]);

  const handleMicSource = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) controller.audio.setMicSelect(Number(val) as MicSelect);
  }, [controller]);

  const handleMicMode = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    controller.audio.setMicMode(Number(e.target.value) as MicMode);
  }, [controller]);

  const [toneTarget, setToneTarget] = React.useState<"speaker" | "headphone">("speaker");
  const [tonePlaying, setTonePlaying] = React.useState<"1khz" | "100hz" | "both" | false>(false);
  const [toneError, setToneError] = React.useState<string | null>(null);

  const handleTone = React.useCallback(async (tone: "1khz" | "100hz" | "both") => {
    setToneError(null);
    try {
      if (tonePlaying === tone) {
        await controller.stopTestTone();
        setTonePlaying(false);
      } else {
        if (tonePlaying) await controller.stopTestTone();
        await controller.startTestTone(toneTarget, tone);
        setTonePlaying(tone);
      }
    } catch (err) {
      setToneError(err instanceof Error ? err.message : "Failed to control tone");
      setTonePlaying(false);
    }
  }, [controller, tonePlaying, toneTarget]);

  const [debugOpen, setDebugOpen] = React.useState(false);
  const [dspDeviceId, setDspDeviceId] = React.useState(6);
  const [dspActionId, setDspActionId] = React.useState(2);
  const [dspParams, setDspParams] = React.useState<number[]>(Array(20).fill(0));
  const [dspParamCount, setDspParamCount] = React.useState(3);
  const [dspResponse, setDspResponse] = React.useState<string>("");
  const [dspSending, setDspSending] = React.useState(false);

  const setDspParam = (index: number, value: number) => {
    setDspParams((prev) => { const next = [...prev]; next[index] = value & 0xff; return next; });
  };

  const parseByte = (s: string): number => {
    const trimmed = s.trim();
    if (trimmed.startsWith("0x") || trimmed.startsWith("0X")) return parseInt(trimmed, 16) & 0xff;
    return (parseInt(trimmed, 10) || 0) & 0xff;
  };

  const handleDspSend = async () => {
    setDspSending(true);
    setDspResponse("");
    try {
      const params = new Uint8Array(dspParams.slice(0, dspParamCount));
      await controller.hid.sendTestCommand(dspDeviceId, dspActionId, params);
      const resp = await controller.hid.readTestResponse();
      if (resp) {
        const hex = Array.from(resp.slice(0, 64)).map((b) => b.toString(16).padStart(2, "0")).join(" ");
        setDspResponse(hex);
      } else {
        setDspResponse("(no response)");
      }
    } catch (err) {
      setDspResponse(`Error: ${err instanceof Error ? err.message : String(err)}`);
    }
    setDspSending(false);
  };

  const [sweepByteIdx, setSweepByteIdx] = React.useState(1);
  const [sweepRunning, setSweepRunning] = React.useState(false);
  const [sweepValue, setSweepValue] = React.useState(0);
  const sweepRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const stopSweep = React.useCallback(() => {
    if (sweepRef.current) { clearInterval(sweepRef.current); sweepRef.current = null; }
    setSweepRunning(false);
    const stopParams = new Uint8Array(dspParamCount);
    stopParams[1] = 1;
    controller.hid.sendTestCommand(dspDeviceId, dspActionId, stopParams).catch(() => {});
  }, [controller, dspDeviceId, dspActionId, dspParamCount]);

  const startSweep = React.useCallback(() => {
    let current = 0;
    setSweepRunning(true);
    setSweepValue(0);
    setDspResponse("");

    sweepRef.current = setInterval(async () => {
      const stopParams = new Uint8Array(dspParamCount);
      stopParams[1] = 1;
      await controller.hid.sendTestCommand(dspDeviceId, dspActionId, stopParams);

      if (current > 255) {
        stopSweep();
        setDspResponse("Sweep complete (0–255)");
        return;
      }

      const params = new Uint8Array(dspParamCount);
      params[0] = 1;
      for (let i = 1; i < dspParamCount; i++) params[i] = dspParams[i];
      params[sweepByteIdx] = current;

      setSweepValue(current);
      setDspResponse(`Sweeping byte[${sweepByteIdx}] = ${current} (0x${current.toString(16).padStart(2, "0")})`);

      await controller.hid.sendTestCommand(dspDeviceId, dspActionId, params);
      current++;
    }, 250);
  }, [controller, dspDeviceId, dspActionId, dspParams, dspParamCount, sweepByteIdx, stopSweep]);

  React.useEffect(() => {
    return () => { if (sweepRef.current) clearInterval(sweepRef.current); };
  }, []);

  return (
    <Wrapper>
    <Panel>
      <Section>
        <SectionLabel>Output</SectionLabel>
        <Select value={output} onChange={handleOutput} style={{ minWidth: 0 }}>
          <option value={AudioOutput.Headphone}>Headphone</option>
          <option value={AudioOutput.HeadphoneMono}>Headphone (Mono)</option>
          <option value={AudioOutput.Split}>Split (L→HP, R→Spk)</option>
          <option value={AudioOutput.Speaker}>Speaker</option>
        </Select>
        <Row>
          <MuteBtn $muted={spkMuted} onClick={() => { controller.audio.muteSpeaker(!spkMuted); setSpkMuted(!spkMuted); }}>
            {spkMuted ? "Spk Muted" : "Spk"}
          </MuteBtn>
          <MuteBtn $muted={hpMuted} onClick={() => { controller.audio.muteHeadphone(!hpMuted); setHpMuted(!hpMuted); }}>
            {hpMuted ? "HP Muted" : "HP"}
          </MuteBtn>
          <MuteBtn $muted={micMuted} onClick={() => { controller.audio.muteMicrophone(!micMuted); setMicMuted(!micMuted); }}>
            {micMuted ? "Mic Muted" : "Mic"}
          </MuteBtn>
        </Row>
      </Section>

      <Section>
        <SectionLabel>Microphone</SectionLabel>
        <Row>
          <Select onChange={handleMicSource} style={{ minWidth: 0 }}>
            <option value="">Auto</option>
            <option value={String(MicSelect.Internal)}>Internal</option>
            <option value={String(MicSelect.Headset)}>Headset</option>
          </Select>
          <Select onChange={handleMicMode} style={{ minWidth: 0 }}>
            <option value={String(MicMode.Default)}>Default</option>
            <option value={String(MicMode.Chat)}>Chat</option>
            <option value={String(MicMode.ASR)}>ASR</option>
          </Select>
        </Row>
        <Row>
          <ToggleBtn $active={beamForming} onClick={toggleBeamForming}>
            Beam Forming
          </ToggleBtn>
          {beamForming && (
            <Tag $minimal $intent="primary">
              On
            </Tag>
          )}
        </Row>
      </Section>

      <Section>
        <SectionLabel>Test Tone</SectionLabel>
        <Row>
          <ToggleBtn $active={toneTarget === "speaker"} onClick={() => setToneTarget("speaker")}>Speaker</ToggleBtn>
          <ToggleBtn $active={toneTarget === "headphone"} onClick={() => setToneTarget("headphone")}>Headphone</ToggleBtn>
        </Row>
        <Row>
          <ToggleBtn $active={tonePlaying === "1khz"} onClick={() => handleTone("1khz")}>{tonePlaying === "1khz" ? "Stop" : "1kHz"}</ToggleBtn>
          <ToggleBtn $active={tonePlaying === "100hz"} onClick={() => handleTone("100hz")}>{tonePlaying === "100hz" ? "Stop" : "~100Hz"}</ToggleBtn>
          <ToggleBtn $active={tonePlaying === "both"} onClick={() => handleTone("both")}>{tonePlaying === "both" ? "Stop" : "Both"}</ToggleBtn>
          {toneError && <Tag $minimal $intent="danger">{toneError}</Tag>}
        </Row>
      </Section>

      <SliderSection>
        <SectionLabel style={{ width: "100%" }}>Volume</SectionLabel>
        <HBar label="Speaker" value={speakerVol} onChange={handleSpeakerVol} />
        <HBar label="Headphone" value={headphoneVol} onChange={handleHeadphoneVol} />
        <HBar label="Microphone" value={micVol} onChange={handleMicVol} />
        <HBar label="Preamp Gain" value={preampGain} onChange={handlePreamp} min={0} max={7} step={1} formatValue={(v) => String(Math.round(v))} />
      </SliderSection>
    </Panel>

    <DebugToggle onClick={() => setDebugOpen(!debugOpen)}>
      {debugOpen ? "\u25BE" : "\u25B8"} DSP Debug
    </DebugToggle>

    {debugOpen && (
      <DebugTray>
        <Row>
          <Section style={{ minWidth: 0, gap: 4 }}>
            <SectionLabel>Device ID</SectionLabel>
            <ByteInput value={dspDeviceId} onChange={(e) => setDspDeviceId(parseByte(e.target.value))} title="Device ID (decimal or 0x hex)" />
          </Section>
          <Section style={{ minWidth: 0, gap: 4 }}>
            <SectionLabel>Action ID</SectionLabel>
            <ByteInput value={dspActionId} onChange={(e) => setDspActionId(parseByte(e.target.value))} title="Action ID (decimal or 0x hex)" />
          </Section>
          <Section style={{ minWidth: 0, gap: 4 }}>
            <SectionLabel>Param Bytes</SectionLabel>
            <ByteInput value={dspParamCount} onChange={(e) => { const n = Math.max(0, Math.min(20, parseInt(e.target.value) || 0)); setDspParamCount(n); }} title="Number of parameter bytes to send (0–20)" />
          </Section>
        </Row>

        <SectionLabel>
          Params (report 0x80 → [{String(dspDeviceId).padStart(2, "0")}, {String(dspActionId).padStart(2, "0")}, ...])
        </SectionLabel>
        <Row style={{ flexWrap: "wrap", gap: 4 }}>
          {Array.from({ length: dspParamCount }, (_, i) => (
            <ByteColumn key={i}>
              <ByteLabel>[{i}]</ByteLabel>
              <ByteInput value={dspParams[i]} onChange={(e) => setDspParam(i, parseByte(e.target.value))} title={`Param byte ${i} (decimal or 0x hex)`} />
            </ByteColumn>
          ))}
        </Row>

        <Row>
          <ToggleBtn $active={dspSending} onClick={handleDspSend}>{dspSending ? "Sending..." : "Send"}</ToggleBtn>
          <ToggleBtn $active={false} onClick={async () => {
            const resp = await controller.hid.readTestResponse();
            if (resp) {
              const hex = Array.from(resp.slice(0, 64)).map((b) => b.toString(16).padStart(2, "0")).join(" ");
              setDspResponse(hex);
            } else {
              setDspResponse("(no response)");
            }
          }}>Read 0x81</ToggleBtn>
        </Row>

        <SectionLabel>Sweep (byte[0] locked to 1)</SectionLabel>
        <Row>
          <Section style={{ minWidth: 0, gap: 4 }}>
            <SectionLabel>Sweep Byte</SectionLabel>
            <ByteInput value={sweepByteIdx} onChange={(e) => setSweepByteIdx(Math.max(1, Math.min(dspParamCount - 1, parseInt(e.target.value) || 1)))} title="Which param byte to sweep (1–N)" />
          </Section>
          <ToggleBtn $active={sweepRunning} onClick={sweepRunning ? stopSweep : startSweep}>
            {sweepRunning ? `Stop (${sweepValue})` : "Sweep 0–255"}
          </ToggleBtn>
        </Row>

        {dspResponse && (
          <>
            <SectionLabel>Response</SectionLabel>
            <ResponsePre>{dspResponse}</ResponsePre>
          </>
        )}
      </DebugTray>
    )}
    </Wrapper>
  );
};
