import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router";

const Nav = styled.nav`
  width: 240px;
  height: 100%;
  overflow-y: auto;
  padding: 16px 0;
  background: rgba(0, 0, 0, 0.15);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    height: 100vh;
    transform: translateX(-100%);
    transition: transform 0.2s ease;
    background: #1a1a2e;

    &[data-open="true"] {
      transform: translateX(0);
    }
  }
`;

const Section = styled.div`
  margin-bottom: 8px;
`;

const SectionTitle = styled.div`
  padding: 8px 20px 4px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: rgba(191, 204, 214, 0.4);
`;

const StyledNavLink = styled(NavLink)`
  display: block;
  padding: 6px 20px 6px 28px;
  font-size: 13px;
  color: rgba(191, 204, 214, 0.7);
  text-decoration: none;
  transition: color 0.1s, background 0.1s;
  border-left: 2px solid transparent;

  &:hover {
    color: #bfccd6;
    background: rgba(72, 175, 240, 0.04);
    text-decoration: none;
  }

  &.active {
    color: #48aff0;
    border-left-color: #48aff0;
    background: rgba(72, 175, 240, 0.08);
  }
`;

const WipLink = styled(NavLink)`
  display: block;
  padding: 6px 20px 6px 28px;
  font-size: 13px;
  color: rgba(191, 204, 214, 0.25);
  text-decoration: none;
  border-left: 2px solid transparent;
  cursor: default;
  position: relative;

  &:hover {
    text-decoration: none;
  }

  &::after {
    content: "Coming soon";
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    margin-left: 8px;
    padding: 3px 8px;
    background: rgba(10, 10, 20, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    font-size: 11px;
    color: rgba(191, 204, 214, 0.5);
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const Overlay = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 99;
    background: rgba(0, 0, 0, 0.5);
  }
`;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => (
  <>
    {open && <Overlay onClick={onClose} />}
    <Nav data-open={open}>
      <Section>
        <StyledNavLink to="/" end onClick={onClose}>
          Home
        </StyledNavLink>
        <StyledNavLink to="/getting-started" onClick={onClose}>
          Getting Started
        </StyledNavLink>
        <StyledNavLink to="/playground" onClick={onClose}>
          Playground
        </StyledNavLink>
      </Section>

      <Section>
        <SectionTitle>Inputs</SectionTitle>
        <StyledNavLink to="/inputs" end onClick={onClose}>
          Overview
        </StyledNavLink>
        <StyledNavLink to="/inputs/buttons" onClick={onClose}>
          Buttons
        </StyledNavLink>
        <StyledNavLink to="/inputs/analog" onClick={onClose}>
          Analog Sticks
        </StyledNavLink>
        <StyledNavLink to="/inputs/triggers" onClick={onClose}>
          Triggers
        </StyledNavLink>
        <StyledNavLink to="/inputs/touchpad" onClick={onClose}>
          Touchpad
        </StyledNavLink>
        <StyledNavLink to="/inputs/motion" onClick={onClose}>
          Motion Sensors
        </StyledNavLink>
        <StyledNavLink to="/inputs/battery" onClick={onClose}>
          Battery
        </StyledNavLink>
        <StyledNavLink to="/inputs/connection" onClick={onClose}>
          Connection
        </StyledNavLink>
      </Section>

      <Section>
        <SectionTitle>Outputs</SectionTitle>
        <StyledNavLink to="/outputs" end onClick={onClose}>
          Overview
        </StyledNavLink>
        <StyledNavLink to="/outputs/rumble" onClick={onClose}>
          Rumble
        </StyledNavLink>
        <StyledNavLink to="/outputs/lightbar" onClick={onClose}>
          Lightbar
        </StyledNavLink>
        <StyledNavLink to="/outputs/player-leds" onClick={onClose}>
          Player LEDs
        </StyledNavLink>
        <StyledNavLink to="/outputs/mute-led" onClick={onClose}>
          Mute LED
        </StyledNavLink>
        <StyledNavLink to="/outputs/trigger-effects" onClick={onClose}>
          Trigger Effects
        </StyledNavLink>
        <StyledNavLink to="/outputs/audio" onClick={onClose}>
          Audio
        </StyledNavLink>
        <StyledNavLink to="/outputs/power-save" onClick={onClose}>
          Power Save
        </StyledNavLink>
      </Section>

      <Section>
        <SectionTitle>More</SectionTitle>
        <StyledNavLink to="/status" onClick={onClose}>
          Controller Info
        </StyledNavLink>
        <StyledNavLink to="/multiplayer" onClick={onClose}>
          Multiplayer
        </StyledNavLink>
        <StyledNavLink to="/react" onClick={onClose}>
          React Apps
        </StyledNavLink>
        <StyledNavLink to="/hid-reports" onClick={onClose}>
          HID Internals
        </StyledNavLink>
      </Section>

      <Section>
        <SectionTitle>Access Controller</SectionTitle>
        <StyledNavLink to="/access" end onClick={onClose}>
          Overview
        </StyledNavLink>
        <StyledNavLink to="/access/playground" onClick={onClose}>
          Access Playground
        </StyledNavLink>
        <StyledNavLink to="/access/hardware-inputs" onClick={onClose}>
          Hardware Inputs
        </StyledNavLink>
        <StyledNavLink to="/access/profile-inputs" onClick={onClose}>
          Profile Inputs
        </StyledNavLink>
        <StyledNavLink to="/access/led-control" onClick={onClose}>
          LED Control
        </StyledNavLink>
        <WipLink to="/access/profile-management" onClick={(e) => { e.preventDefault(); }}>
          Profile Management
        </WipLink>
        <WipLink to="/access/expansion-slots" onClick={(e) => { e.preventDefault(); }}>
          Expansion Slots
        </WipLink>
      </Section>

      <Section>
        <SectionTitle>API Reference</SectionTitle>
        <StyledNavLink to="/api" end onClick={onClose}>
          Overview
        </StyledNavLink>
        <StyledNavLink to="/api/dualsense" onClick={onClose}>
          Dualsense
        </StyledNavLink>
        <StyledNavLink to="/api/manager" onClick={onClose}>
          DualsenseManager
        </StyledNavLink>
        <StyledNavLink to="/api/input" onClick={onClose}>
          Input&lt;T&gt;
        </StyledNavLink>
        <StyledNavLink to="/api/momentary" onClick={onClose}>
          Momentary
        </StyledNavLink>
        <StyledNavLink to="/api/axis" onClick={onClose}>
          Axis
        </StyledNavLink>
        <StyledNavLink to="/api/analog" onClick={onClose}>
          Analog
        </StyledNavLink>
        <StyledNavLink to="/api/trigger" onClick={onClose}>
          Trigger
        </StyledNavLink>
        <StyledNavLink to="/api/unisense" onClick={onClose}>
          Unisense
        </StyledNavLink>
        <StyledNavLink to="/api/dpad" onClick={onClose}>
          Dpad
        </StyledNavLink>
        <StyledNavLink to="/api/touchpad" onClick={onClose}>
          Touchpad
        </StyledNavLink>
        <StyledNavLink to="/api/gyroscope" onClick={onClose}>
          Gyroscope
        </StyledNavLink>
        <StyledNavLink to="/api/accelerometer" onClick={onClose}>
          Accelerometer
        </StyledNavLink>
        <StyledNavLink to="/api/orientation" onClick={onClose}>
          Orientation
        </StyledNavLink>
        <StyledNavLink to="/api/shake-detector" onClick={onClose}>
          ShakeDetector
        </StyledNavLink>
        <StyledNavLink to="/api/battery" onClick={onClose}>
          Battery
        </StyledNavLink>
        <StyledNavLink to="/api/lightbar" onClick={onClose}>
          Lightbar
        </StyledNavLink>
        <StyledNavLink to="/api/player-leds" onClick={onClose}>
          PlayerLeds
        </StyledNavLink>
        <StyledNavLink to="/api/mute" onClick={onClose}>
          Mute
        </StyledNavLink>
        <StyledNavLink to="/api/audio" onClick={onClose}>
          Audio
        </StyledNavLink>
        <StyledNavLink to="/api/power-save" onClick={onClose}>
          PowerSaveControl
        </StyledNavLink>
        <StyledNavLink to="/api/trigger-feedback" onClick={onClose}>
          TriggerFeedback
        </StyledNavLink>
        <StyledNavLink to="/api/enums" onClick={onClose}>
          Enums
        </StyledNavLink>
        <StyledNavLink to="/api/types" onClick={onClose}>
          Types
        </StyledNavLink>
      </Section>
    </Nav>
  </>
);
