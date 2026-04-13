import React, { useContext, useState, useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import { AudioOutput, MicSelect, MicMode } from "dualsense-ts";
import { ControllerContext } from "../../controller";

/* ── Layout ──��──────────────────────────────────────────────── */

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

/* ── Slider ─────────────────────────────────────────────────── */

const SliderRow = styled.div<{ $even?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: ${(p) => (p.$even ? "rgba(0, 0, 0, 0.12)" : "rgba(0, 0, 0, 0.06)")};
`;

const SliderLabel = styled.code`
  font-size: 12px;
  color: rgba(191, 204, 214, 0.5);
  width: 86px;
  flex-shrink: 0;
`;

const SliderValue = styled.code`
  font-size: 12px;
  color: rgba(191, 204, 214, 0.5);
  width: 40px;
  text-align: right;
  flex-shrink: 0;
`;

const TrackWrap = styled.div`
  position: relative;
  flex: 1;
  height: 24px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.25);
  overflow: hidden;
`;

const TrackFill = styled.div<{ $color?: string }>`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 4px 0 0 4px;
  background: ${(p) =>
    p.$color
      ? `linear-gradient(90deg, ${p.$color}40, ${p.$color}90)`
      : "linear-gradient(90deg, rgba(72, 175, 240, 0.25), rgba(72, 175, 240, 0.55))"};
  pointer-events: none;
  transition: width 0.04s;
`;

const TrackThumb = styled.div`
  position: absolute;
  top: 50%;
  width: 3px;
  height: 16px;
  margin-left: -1.5px;
  border-radius: 1.5px;
  background: rgba(255, 255, 255, 0.8);
  transform: translateY(-50%);
  pointer-events: none;
  transition: left 0.04s;
`;

const HiddenRange = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  margin: 0;
`;

/* ── Buttons ─────────────────────────────────────────────────── */

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.06);
`;

const ActionButton = styled.button<{ $active?: boolean }>`
  flex: 1;
  padding: 8px 0;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  border: 1px solid
    ${(p) =>
      p.$active ? "rgba(72, 175, 240, 0.6)" : "rgba(72, 175, 240, 0.3)"};
  background: ${(p) =>
    p.$active ? "rgba(72, 175, 240, 0.2)" : "rgba(72, 175, 240, 0.08)"};
  color: ${(p) =>
    p.$active ? "#48aff0" : "rgba(191, 204, 214, 0.5)"};

  &:hover {
    background: rgba(72, 175, 240, 0.15);
    color: #48aff0;
  }
`;

const MuteButton = styled.button<{ $muted: boolean }>`
  flex: 1;
  padding: 8px 0;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid
    ${(p) =>
      p.$muted ? "rgba(242, 158, 2, 0.6)" : "rgba(72, 175, 240, 0.3)"};
  background: ${(p) =>
    p.$muted ? "rgba(242, 158, 2, 0.2)" : "rgba(72, 175, 240, 0.08)"};
  color: ${(p) =>
    p.$muted ? "#f29e02" : "rgba(191, 204, 214, 0.5)"};

  &:hover {
    background: ${(p) =>
      p.$muted ? "rgba(242, 158, 2, 0.25)" : "rgba(72, 175, 240, 0.15)"};
  }
`;

const StopButton = styled(ActionButton)`
  border-color: rgba(255, 107, 107, 0.4);
  background: rgba(255, 107, 107, 0.1);
  color: #ff6b6b;

  &:hover {
    background: rgba(255, 107, 107, 0.2);
  }
`;

/* ── Readout ─────────────────────────────────────────────────── */

const Dim = styled.span`
  color: rgba(191, 204, 214, 0.3);
`;

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
  white-space: nowrap;
  text-align: right;
  color: ${(p) => (p.$highlight ? "#f29e02" : "rgba(191, 204, 214, 0.4)")};
  transition: color 0.06s;
`;

/* ── Section label ───────────────────────────────────────────── */

const SectionLabel = styled.div`
  padding: 6px 16px 2px;
  background: rgba(0, 0, 0, 0.1);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(191, 204, 214, 0.3);
`;

/* ── ParamSlider ─────────────────────────────────────────────── */

interface ParamSliderProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  format?: (v: number) => string;
  even?: boolean;
  color?: string;
}

const ParamSlider: React.FC<ParamSliderProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
  format,
  even,
  color,
}) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <SliderRow $even={even}>
      <SliderLabel>{label}</SliderLabel>
      <TrackWrap>
        <TrackFill style={{ width: `${pct}%` }} $color={color} />
        <TrackThumb style={{ left: `${pct}%` }} />
        <HiddenRange
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </TrackWrap>
      <SliderValue>{format ? format(value) : `${Math.round(value * 100)}%`}</SliderValue>
    </SliderRow>
  );
};

/* ── Volume Demo ─────────────────────────────────────────────── */

export const VolumeDemo: React.FC = () => {
  const controller = useContext(ControllerContext);
  const [speakerVol, setSpeakerVol] = useState(controller.audio.speakerVolume);
  const [headphoneVol, setHeadphoneVol] = useState(controller.audio.headphoneVolume);
  const [micVol, setMicVol] = useState(controller.audio.microphoneVolume);
  const [spkMuted, setSpkMuted] = useState(controller.audio.speakerMuted);
  const [hpMuted, setHpMuted] = useState(controller.audio.headphoneMuted);
  const [micMuted, setMicMuted] = useState(controller.audio.microphoneMuted);
  const [hwMuted, setHwMuted] = useState(controller.mute.status.state);

  useEffect(() => {
    const onChange = () => setHwMuted(controller.mute.status.state);
    controller.mute.status.on("change", onChange);
    return () => {
      controller.mute.status.removeListener("change", onChange);
    };
  }, [controller]);

  const handleSpeaker = useCallback(
    (v: number) => { setSpeakerVol(v); controller.audio.setSpeakerVolume(v); },
    [controller],
  );
  const handleHeadphone = useCallback(
    (v: number) => { setHeadphoneVol(v); controller.audio.setHeadphoneVolume(v); },
    [controller],
  );
  const handleMic = useCallback(
    (v: number) => { setMicVol(v); controller.audio.setMicrophoneVolume(v); },
    [controller],
  );

  const toggleSpk = useCallback(() => {
    controller.audio.muteSpeaker(!spkMuted);
    setSpkMuted(!spkMuted);
  }, [controller, spkMuted]);

  const toggleHp = useCallback(() => {
    controller.audio.muteHeadphone(!hpMuted);
    setHpMuted(!hpMuted);
  }, [controller, hpMuted]);

  const toggleMic = useCallback(() => {
    controller.audio.muteMicrophone(!micMuted);
    setMicMuted(!micMuted);
  }, [controller, micMuted]);

  return (
    <Table>
      <HeaderRow>
        <HeaderCell>volume &amp; mute</HeaderCell>
      </HeaderRow>
      <ParamSlider label="speaker" value={speakerVol} onChange={handleSpeaker} />
      <ParamSlider label="headphone" value={headphoneVol} onChange={handleHeadphone} even />
      <ParamSlider label="microphone" value={micVol} onChange={handleMic} />
      <SectionLabel>mute</SectionLabel>
      <ButtonRow>
        <MuteButton $muted={spkMuted} onClick={toggleSpk}>
          {spkMuted ? "Speaker Muted" : "Speaker"}
        </MuteButton>
        <MuteButton $muted={hpMuted} onClick={toggleHp}>
          {hpMuted ? "Headphone Muted" : "Headphone"}
        </MuteButton>
        <MuteButton $muted={micMuted} onClick={toggleMic}>
          {micMuted ? "Mic Muted" : "Mic"}
        </MuteButton>
      </ButtonRow>
      <ReadoutRow>
        <ReadoutLabel>
          <bdi><Dim>controller.</Dim>mute<Dim>.</Dim>status<Dim>.</Dim>state</bdi>
        </ReadoutLabel>
        <ReadoutVal $highlight={hwMuted}>{hwMuted ? "true (muted)" : "false"}</ReadoutVal>
      </ReadoutRow>
    </Table>
  );
};

/* ── Routing Demo ────────────────────────────────────────────── */

function outputName(output: AudioOutput): string {
  switch (output) {
    case AudioOutput.Headphone: return "AudioOutput.Headphone";
    case AudioOutput.HeadphoneMono: return "AudioOutput.HeadphoneMono";
    case AudioOutput.Split: return "AudioOutput.Split";
    case AudioOutput.Speaker: return "AudioOutput.Speaker";
    default: return `${output}`;
  }
}

export const RoutingDemo: React.FC = () => {
  const controller = useContext(ControllerContext);
  const [output, setOutput] = useState(controller.audio.output);

  const handleOutput = useCallback(
    (o: AudioOutput) => {
      setOutput(o);
      controller.audio.setOutput(o);
    },
    [controller],
  );

  return (
    <Table>
      <HeaderRow>
        <HeaderCell>output routing</HeaderCell>
      </HeaderRow>
      <ButtonRow>
        <ActionButton
          $active={output === AudioOutput.Headphone}
          onClick={() => handleOutput(AudioOutput.Headphone)}
        >
          Headphone
        </ActionButton>
        <ActionButton
          $active={output === AudioOutput.HeadphoneMono}
          onClick={() => handleOutput(AudioOutput.HeadphoneMono)}
        >
          HP Mono
        </ActionButton>
        <ActionButton
          $active={output === AudioOutput.Split}
          onClick={() => handleOutput(AudioOutput.Split)}
        >
          Split
        </ActionButton>
        <ActionButton
          $active={output === AudioOutput.Speaker}
          onClick={() => handleOutput(AudioOutput.Speaker)}
        >
          Speaker
        </ActionButton>
      </ButtonRow>
      <ReadoutRow>
        <ReadoutLabel>
          <bdi><Dim>controller.</Dim>audio<Dim>.</Dim>output</bdi>
        </ReadoutLabel>
        <ReadoutVal $highlight={output !== AudioOutput.Headphone}>
          {outputName(output)}
        </ReadoutVal>
      </ReadoutRow>
    </Table>
  );
};

/* ── Microphone Demo ─────────────────────────────────────────── */

export const MicrophoneDemo: React.FC = () => {
  const controller = useContext(ControllerContext);
  const [micSource, setMicSource] = useState<MicSelect | null>(null);
  const [micMode, setMicMode] = useState(MicMode.Default);
  const [preampGain, setPreampGain] = useState(controller.audio.preampGain);
  const [beamForming, setBeamForming] = useState(controller.audio.beamForming);

  const handleSource = useCallback(
    (s: MicSelect) => {
      setMicSource(s);
      controller.audio.setMicSelect(s);
    },
    [controller],
  );

  const handleMode = useCallback(
    (m: MicMode) => {
      setMicMode(m);
      controller.audio.setMicMode(m);
    },
    [controller],
  );

  const handlePreamp = useCallback(
    (v: number) => {
      const gain = Math.round(v);
      setPreampGain(gain);
      controller.audio.setPreamp(gain, beamForming);
    },
    [controller, beamForming],
  );

  const toggleBeamForming = useCallback(() => {
    const next = !beamForming;
    setBeamForming(next);
    controller.audio.setPreamp(preampGain, next);
  }, [controller, preampGain, beamForming]);

  return (
    <Table>
      <HeaderRow>
        <HeaderCell>microphone</HeaderCell>
      </HeaderRow>
      <SectionLabel>source</SectionLabel>
      <ButtonRow>
        <ActionButton
          $active={micSource === MicSelect.Internal}
          onClick={() => handleSource(MicSelect.Internal)}
        >
          Internal
        </ActionButton>
        <ActionButton
          $active={micSource === MicSelect.Headset}
          onClick={() => handleSource(MicSelect.Headset)}
        >
          Headset
        </ActionButton>
      </ButtonRow>
      <SectionLabel>mode</SectionLabel>
      <ButtonRow>
        <ActionButton
          $active={micMode === MicMode.Default}
          onClick={() => handleMode(MicMode.Default)}
        >
          Default
        </ActionButton>
        <ActionButton
          $active={micMode === MicMode.Chat}
          onClick={() => handleMode(MicMode.Chat)}
        >
          Chat
        </ActionButton>
        <ActionButton
          $active={micMode === MicMode.ASR}
          onClick={() => handleMode(MicMode.ASR)}
        >
          ASR
        </ActionButton>
      </ButtonRow>
      <SectionLabel>preamp</SectionLabel>
      <ParamSlider
        label="gain"
        value={preampGain}
        onChange={handlePreamp}
        min={0}
        max={7}
        step={1}
        format={(v) => `${Math.round(v)}`}
      />
      <ButtonRow>
        <ActionButton $active={beamForming} onClick={toggleBeamForming}>
          Beam Forming {beamForming ? "On" : "Off"}
        </ActionButton>
      </ButtonRow>
      <ReadoutRow>
        <ReadoutLabel>
          <bdi><Dim>controller.</Dim>audio<Dim>.</Dim>preampGain</bdi>
        </ReadoutLabel>
        <ReadoutVal>{preampGain}</ReadoutVal>
      </ReadoutRow>
      <ReadoutRow $even>
        <ReadoutLabel>
          <bdi><Dim>controller.</Dim>audio<Dim>.</Dim>beamForming</bdi>
        </ReadoutLabel>
        <ReadoutVal $highlight={beamForming}>{beamForming ? "true" : "false"}</ReadoutVal>
      </ReadoutRow>
    </Table>
  );
};

/* ── Test Tone Demo ──────────────────────────────────────────── */

export const TestToneDemo: React.FC = () => {
  const controller = useContext(ControllerContext);
  const [target, setTarget] = useState<"speaker" | "headphone">("speaker");
  const [playing, setPlaying] = useState<"1khz" | "100hz" | "both" | false>(false);
  const playingRef = useRef(playing);
  playingRef.current = playing;

  const handleTone = useCallback(
    async (tone: "1khz" | "100hz" | "both") => {
      if (playing === tone) {
        await controller.stopTestTone();
        setPlaying(false);
      } else {
        if (playing) await controller.stopTestTone();
        await controller.startTestTone(target, tone);
        setPlaying(tone);
      }
    },
    [controller, playing, target],
  );

  const handleStop = useCallback(async () => {
    await controller.stopTestTone();
    setPlaying(false);
  }, [controller]);

  useEffect(() => {
    return () => {
      if (playingRef.current) {
        controller.stopTestTone();
      }
    };
  }, [controller]);

  return (
    <Table>
      <HeaderRow>
        <HeaderCell>test tones</HeaderCell>
      </HeaderRow>
      <SectionLabel>target</SectionLabel>
      <ButtonRow>
        <ActionButton $active={target === "speaker"} onClick={() => setTarget("speaker")}>
          Speaker
        </ActionButton>
        <ActionButton $active={target === "headphone"} onClick={() => setTarget("headphone")}>
          Headphone
        </ActionButton>
      </ButtonRow>
      <SectionLabel>tone</SectionLabel>
      <ButtonRow>
        <ActionButton $active={playing === "1khz"} onClick={() => handleTone("1khz")}>
          1 kHz
        </ActionButton>
        <ActionButton $active={playing === "100hz"} onClick={() => handleTone("100hz")}>
          ~100 Hz
        </ActionButton>
        <ActionButton $active={playing === "both"} onClick={() => handleTone("both")}>
          Both
        </ActionButton>
        <StopButton onClick={handleStop}>Stop</StopButton>
      </ButtonRow>
    </Table>
  );
};

/* ── Peripherals Demo ────────────────────────────────────────── */

const StatusDot = styled.div<{ $active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(p) => (p.$active ? "#3dcc91" : "rgba(191, 204, 214, 0.15)")};
  box-shadow: ${(p) => (p.$active ? "0 0 6px rgba(61, 204, 145, 0.5)" : "none")};
  flex-shrink: 0;
  transition: all 0.15s;
`;

const PeripheralRow = styled.div<{ $even?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: ${(p) => (p.$even ? "rgba(0, 0, 0, 0.12)" : "rgba(0, 0, 0, 0.06)")};
`;

const PeripheralName = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: rgba(191, 204, 214, 0.6);
  flex: 1;
`;

const PeripheralState = styled.code<{ $active: boolean }>`
  font-size: 12px;
  color: ${(p) => (p.$active ? "#3dcc91" : "rgba(191, 204, 214, 0.35)")};
  transition: color 0.15s;
`;

export const PeripheralsDemo: React.FC = () => {
  const controller = useContext(ControllerContext);
  const [headphone, setHeadphone] = useState(controller.headphone.state);
  const [microphone, setMicrophone] = useState(controller.microphone.state);
  const [muted, setMuted] = useState(controller.mute.status.state);

  useEffect(() => {
    const onHp = () => setHeadphone(controller.headphone.state);
    const onMic = () => setMicrophone(controller.microphone.state);
    const onMute = () => setMuted(controller.mute.status.state);
    controller.headphone.on("change", onHp);
    controller.microphone.on("change", onMic);
    controller.mute.status.on("change", onMute);
    return () => {
      controller.headphone.removeListener("change", onHp);
      controller.microphone.removeListener("change", onMic);
      controller.mute.status.removeListener("change", onMute);
    };
  }, [controller]);

  return (
    <Table>
      <HeaderRow>
        <HeaderCell>peripherals</HeaderCell>
      </HeaderRow>
      <PeripheralRow>
        <StatusDot $active={headphone} />
        <PeripheralName>Headphone</PeripheralName>
        <PeripheralState $active={headphone}>
          {headphone ? "connected" : "disconnected"}
        </PeripheralState>
      </PeripheralRow>
      <PeripheralRow $even>
        <StatusDot $active={microphone} />
        <PeripheralName>Microphone</PeripheralName>
        <PeripheralState $active={microphone}>
          {microphone ? "connected" : "disconnected"}
        </PeripheralState>
      </PeripheralRow>
      <PeripheralRow>
        <StatusDot $active={muted} />
        <PeripheralName>Mic Mute</PeripheralName>
        <PeripheralState $active={muted}>
          {muted ? "muted" : "unmuted"}
        </PeripheralState>
      </PeripheralRow>
    </Table>
  );
};
