import React from "react";
import styled from "styled-components";
import { HTMLSelect, Tag } from "@blueprintjs/core";
import {
  Dualsense,
  AudioOutput,
  MicSelect,
  MicMode,
  findDualsenseAudioDevices,
} from "dualsense-ts";

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
      <rect
        x={0}
        y={0}
        width={BAR_WIDTH}
        height={BAR_HEIGHT}
        fill="rgba(72, 175, 240, 0.08)"
        rx={3}
      />
      <rect
        x={0.5}
        y={0.5}
        width={BAR_WIDTH - 1}
        height={BAR_HEIGHT - 1}
        fill="none"
        stroke="rgba(72, 175, 240, 0.2)"
        strokeWidth={1}
        rx={3}
      />
      {fillW > 0 && (
        <rect
          x={1}
          y={1}
          width={Math.min(fillW, BAR_WIDTH - 2)}
          height={BAR_HEIGHT - 2}
          fill={ACCENT}
          opacity={0.15 + ratio * 0.25}
          rx={2}
        />
      )}
      {ratio > 0 && (
        <line
          x1={fillW}
          y1={1}
          x2={fillW}
          y2={BAR_HEIGHT - 1}
          stroke={ACCENT}
          strokeWidth={1.5}
          opacity={0.6}
        />
      )}
      <text
        x={7}
        y={BAR_HEIGHT / 2}
        dominantBaseline="central"
        fill="currentColor"
        fontSize={11}
        fontWeight={600}
        opacity={0.5}
      >
        {label}
      </text>
      <text
        x={BAR_WIDTH - 7}
        y={BAR_HEIGHT / 2}
        dominantBaseline="central"
        textAnchor="end"
        fill={ACCENT}
        fontSize={11}
        fontWeight={600}
        opacity={0.7}
      >
        {display}
      </text>
    </svg>
  );
};

const OUTPUT_OPTIONS = [
  { label: "Headphone", value: AudioOutput.Headphone },
  { label: "Headphone (Mono)", value: AudioOutput.HeadphoneMono },
  { label: "Split (L→HP, R→Spk)", value: AudioOutput.Split },
  { label: "Speaker", value: AudioOutput.Speaker },
];

const MIC_SOURCE_OPTIONS = [
  { label: "Auto", value: "" },
  { label: "Internal", value: String(MicSelect.Internal) },
  { label: "Headset", value: String(MicSelect.Headset) },
];

const MIC_MODE_OPTIONS = [
  { label: "Default", value: String(MicMode.Default) },
  { label: "Chat", value: String(MicMode.Chat) },
  { label: "ASR", value: String(MicMode.ASR) },
];

export const AudioControls = ({
  controller,
}: {
  controller: Dualsense;
}) => {
  const [speakerVol, setSpeakerVol] = React.useState(
    controller.audio.speakerVolume,
  );
  const [headphoneVol, setHeadphoneVol] = React.useState(
    controller.audio.headphoneVolume,
  );
  const [micVol, setMicVol] = React.useState(
    controller.audio.microphoneVolume,
  );
  const [output, setOutput] = React.useState(controller.audio.output);
  const [preampGain, setPreampGain] = React.useState(
    controller.audio.preampGain,
  );
  const [beamForming, setBeamForming] = React.useState(
    controller.audio.beamForming,
  );
  const [spkMuted, setSpkMuted] = React.useState(
    controller.audio.speakerMuted,
  );
  const [hpMuted, setHpMuted] = React.useState(
    controller.audio.headphoneMuted,
  );
  const [micMuted, setMicMuted] = React.useState(
    controller.audio.microphoneMuted,
  );

  const handleSpeakerVol = React.useCallback(
    (v: number) => {
      setSpeakerVol(v);
      controller.audio.setSpeakerVolume(v);
    },
    [controller],
  );

  const handleHeadphoneVol = React.useCallback(
    (v: number) => {
      setHeadphoneVol(v);
      controller.audio.setHeadphoneVolume(v);
    },
    [controller],
  );

  const handleMicVol = React.useCallback(
    (v: number) => {
      setMicVol(v);
      controller.audio.setMicrophoneVolume(v);
    },
    [controller],
  );

  const handleOutput = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = Number(e.target.value) as AudioOutput;
      setOutput(val);
      controller.audio.setOutput(val);
    },
    [controller],
  );

  const handlePreamp = React.useCallback(
    (v: number) => {
      const gain = Math.round(v);
      setPreampGain(gain);
      controller.audio.setPreamp(gain, beamForming);
    },
    [controller, beamForming],
  );

  const toggleBeamForming = React.useCallback(() => {
    const next = !beamForming;
    setBeamForming(next);
    controller.audio.setPreamp(preampGain, next);
  }, [controller, preampGain, beamForming]);

  const handleMicSource = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      if (val) controller.audio.setMicSelect(Number(val) as MicSelect);
    },
    [controller],
  );

  const handleMicMode = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      controller.audio.setMicMode(Number(e.target.value) as MicMode);
    },
    [controller],
  );

  const [pinging, setPinging] = React.useState(false);
  const [pingError, setPingError] = React.useState<string | null>(null);

  const handlePing = React.useCallback(async () => {
    setPinging(true);
    setPingError(null);
    try {
      const { outputs } = await findDualsenseAudioDevices();
      if (outputs.length === 0) {
        setPingError("No audio device found");
        setPinging(false);
        return;
      }

      // Create an AudioContext routed to the controller's speaker
      const ctx = new AudioContext({
        sinkId: outputs[0].deviceId,
      } as AudioContextOptions);

      // Two-tone ping: short high note then a slightly lower note
      const now = ctx.currentTime;
      const gain = ctx.createGain();
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      const osc1 = ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(1200, now);
      osc1.connect(gain);
      osc1.start(now);
      osc1.stop(now + 0.12);

      const osc2 = ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(900, now + 0.12);
      osc2.connect(gain);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.3);

      // Clean up after the tone finishes
      osc2.onended = () => {
        ctx.close().catch(() => {});
        setPinging(false);
      };
    } catch (err) {
      setPingError(
        err instanceof Error ? err.message : "Failed to play ping",
      );
      setPinging(false);
    }
  }, []);

  return (
    <Panel>
      <Section>
        <SectionLabel>Output</SectionLabel>
        <HTMLSelect
          value={output}
          onChange={handleOutput}
          options={OUTPUT_OPTIONS}
          style={{ minWidth: 0 }}
        />
        <Row>
          <MuteBtn
            $muted={spkMuted}
            onClick={() => {
              controller.audio.muteSpeaker(!spkMuted);
              setSpkMuted(!spkMuted);
            }}
          >
            {spkMuted ? "Spk Muted" : "Spk"}
          </MuteBtn>
          <MuteBtn
            $muted={hpMuted}
            onClick={() => {
              controller.audio.muteHeadphone(!hpMuted);
              setHpMuted(!hpMuted);
            }}
          >
            {hpMuted ? "HP Muted" : "HP"}
          </MuteBtn>
          <MuteBtn
            $muted={micMuted}
            onClick={() => {
              controller.audio.muteMicrophone(!micMuted);
              setMicMuted(!micMuted);
            }}
          >
            {micMuted ? "Mic Muted" : "Mic"}
          </MuteBtn>
        </Row>
      </Section>

      <Section>
        <SectionLabel>Microphone</SectionLabel>
        <Row>
          <HTMLSelect
            onChange={handleMicSource}
            options={MIC_SOURCE_OPTIONS}
            style={{ minWidth: 0 }}
          />
          <HTMLSelect
            onChange={handleMicMode}
            options={MIC_MODE_OPTIONS}
            style={{ minWidth: 0 }}
          />
        </Row>
        <Row>
          <ToggleBtn $active={beamForming} onClick={toggleBeamForming}>
            Beam Forming
          </ToggleBtn>
          {beamForming && (
            <Tag minimal={true} intent="primary">
              On
            </Tag>
          )}
        </Row>
      </Section>

      <Section>
        <SectionLabel>Test</SectionLabel>
        <Row>
          <ToggleBtn $active={pinging} onClick={handlePing} disabled={pinging}>
            {pinging ? "Playing..." : "Ping"}
          </ToggleBtn>
          {pingError && (
            <Tag minimal={true} intent="danger">
              {pingError}
            </Tag>
          )}
        </Row>
      </Section>

      <SliderSection>
        <SectionLabel style={{ width: "100%" }}>Volume</SectionLabel>
        <HBar label="Speaker" value={speakerVol} onChange={handleSpeakerVol} />
        <HBar
          label="Headphone"
          value={headphoneVol}
          onChange={handleHeadphoneVol}
        />
        <HBar label="Microphone" value={micVol} onChange={handleMicVol} />
        <HBar
          label="Preamp Gain"
          value={preampGain}
          onChange={handlePreamp}
          min={0}
          max={7}
          step={1}
          formatValue={(v) => String(Math.round(v))}
        />
      </SliderSection>
    </Panel>
  );
};
