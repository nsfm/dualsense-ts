import React, { useContext, useState } from "react";
import styled from "styled-components";
import { Card, Button, ButtonGroup, Select } from "../ui";
import { PlayerID, Brightness } from "dualsense-ts";

import { ControllerContext } from "../../controller";

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
`;

const Label = styled.span`
  min-width: 50px;
  font-size: 12px;
  opacity: 0.7;
`;

export const PlayerLedControls = () => {
  const controller = useContext(ControllerContext);
  const [, setTick] = useState(0);
  const [brightness, setBrightness] = useState(controller.playerLeds.brightness);
  const forceUpdate = () => setTick((t) => t + 1);

  const toggleLed = (index: number) => {
    controller.playerLeds.setLed(index, !controller.playerLeds.getLed(index));
    forceUpdate();
  };

  const setPreset = (pattern: number) => {
    controller.playerLeds.set(pattern);
    forceUpdate();
  };

  const handleBrightness = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value) as Brightness;
    setBrightness(value);
    controller.playerLeds.setBrightness(value);
  };

  return (
    <Card>
      <Row>
        <Label>LEDs</Label>
        <ButtonGroup>
          {[0, 1, 2, 3, 4].map((i) => (
            <Button
              key={i}
              $active={controller.playerLeds.getLed(i)}
              onClick={() => toggleLed(i)}
              $small
              style={{ minWidth: 32 }}
            >
              {i + 1}
            </Button>
          ))}
        </ButtonGroup>
      </Row>
      <Row>
        <Label>Preset</Label>
        <ButtonGroup>
          <Button $small onClick={() => setPreset(0)}>Off</Button>
          <Button $small onClick={() => setPreset(PlayerID.Player1)}>P1</Button>
          <Button $small onClick={() => setPreset(PlayerID.Player2)}>P2</Button>
          <Button $small onClick={() => setPreset(PlayerID.Player3)}>P3</Button>
          <Button $small onClick={() => setPreset(PlayerID.Player4)}>P4</Button>
          <Button $small onClick={() => setPreset(PlayerID.All)}>All</Button>
        </ButtonGroup>
      </Row>
      <Row>
        <Label>Bright</Label>
        <Select value={brightness} onChange={handleBrightness}>
          <option value={Brightness.High}>High</option>
          <option value={Brightness.Medium}>Medium</option>
          <option value={Brightness.Low}>Low</option>
        </Select>
      </Row>
    </Card>
  );
};
