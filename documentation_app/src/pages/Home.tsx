import React from "react";
import styled from "styled-components";
import { Link } from "react-router";
import { Card } from "../components/ui";
import { requestPermission, manager } from "../controller";

const InlineCode = styled.code`
  background: rgba(255, 255, 255, 0.06);
  border-radius: 3px;
  padding: 1px 5px;
  font-size: 14px;
`;

const Hero = styled.div`
  text-align: center;
  padding: 40px 0 48px;
`;

const HeroTitle = styled.h1`
  display: inline-block;
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(242, 158, 2, 0.15);
  border-radius: 12px;
  padding: 12px 32px;

  @media (max-width: 600px) {
    font-size: 28px;
    padding: 10px 24px;
  }
`;

const HeroAccent = styled.span`
  color: #f29e02;
  text-shadow:
    0 0 20px rgba(242, 158, 2, 0.4),
    0 0 60px rgba(242, 158, 2, 0.15);
`;

const HeroSubtitle = styled.p`
  font-size: 17px;
  color: rgba(191, 204, 214, 0.8);
  margin: 0 auto 12px;
  line-height: 1.6;
`;

const HeroSummary = styled.p`
  font-size: 15px;
  color: rgba(191, 204, 214, 0.55);
  max-width: 560px;
  margin: 0 auto 28px;
  line-height: 1.7;
`;

const PlaygroundLink = styled(Link)`
  color: #48aff0;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const ConnectHero = styled.button`
  background: rgba(72, 175, 240, 0.2);
  border: 1px solid rgba(72, 175, 240, 0.5);
  border-radius: 6px;
  color: #48aff0;
  font-size: 15px;
  font-weight: 600;
  padding: 10px 28px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: rgba(72, 175, 240, 0.3);
  }
`;

const Install = styled.div`
  margin: 0 auto 48px;
  max-width: 320px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  padding: 12px 16px;
  font-family: "Fira Code", monospace;
  font-size: 13px;
  color: #48aff0;
  text-align: center;
  user-select: all;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  margin-top: 12px;
`;

const FeatureCard = styled(Card)`
  transition:
    border-color 0.15s,
    transform 0.1s;

  &:hover {
    border-color: rgba(72, 175, 240, 0.3);
    transform: translateY(-1px);
  }
`;

const CardTitle = styled.h3`
  font-size: 15px;
  margin-bottom: 6px;
`;

const CardDesc = styled.p`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.6);
  margin: 0;
  line-height: 1.5;
`;

const SectionTitle = styled.h2`
  margin-top: 48px;
  margin-bottom: 16px;
  font-size: 20px;
`;

const features = [
  {
    title: "Buttons & D-Pad",
    desc: "Read every button press with events, promises, or async iterators.",
    to: "/inputs/buttons",
  },
  {
    title: "Analog Sticks",
    desc: "Two thumbsticks with X/Y axes, magnitude, direction, and click.",
    to: "/inputs/analog",
  },
  {
    title: "Triggers",
    desc: "Pressure-sensitive L2/R2 with full 0–1 range reading.",
    to: "/inputs/triggers",
  },
  {
    title: "Touchpad",
    desc: "Multi-touch surface with two independent contact points.",
    to: "/inputs/touchpad",
  },
  {
    title: "Motion Sensors",
    desc: "6-axis IMU: 3-axis gyroscope and 3-axis accelerometer.",
    to: "/inputs/motion",
  },
  {
    title: "Battery",
    desc: "Battery level and charging status with change events.",
    to: "/inputs/battery",
  },
  {
    title: "Connection",
    desc: "Auto-connect, reconnection, and USB/Bluetooth transport detection.",
    to: "/inputs/connection",
  },
  {
    title: "Adaptive Triggers",
    desc: "7 feedback effects with configurable parameters per trigger.",
    to: "/outputs/trigger-effects",
  },
  {
    title: "Haptic Feedback",
    desc: "Independent left and right rumble motors with intensity control.",
    to: "/outputs/rumble",
  },
  {
    title: "Lightbar",
    desc: "Full RGB LED strip with color control and fade effects.",
    to: "/outputs/lightbar",
  },
  {
    title: "Player LEDs",
    desc: "5 white LEDs with individual control and brightness levels.",
    to: "/outputs/player-leds",
  },
  {
    title: "Mute LED",
    desc: "Software-controlled mute indicator with solid, pulse, and off modes.",
    to: "/outputs/mute-led",
  },
  {
    title: "Audio Controls",
    desc: "Speaker, headphone, and microphone volume, routing, and test tones.",
    to: "/outputs/audio",
  },
  {
    title: "Controller Info",
    desc: "Body color, serial number, firmware versions, and factory data.",
    to: "/status",
  },
  {
    title: "Multiplayer",
    desc: "Up to 31 controllers with identity-based reconnection and player LEDs.",
    to: "/multiplayer",
  },
  {
    title: "DualSense Access",
    desc: "Hardware inputs, profile-mapped controls, 4 LED systems, and full DualSense API compatibility.",
    to: "/access",
  },
];

const Home: React.FC = () => (
  <>
    <Hero>
      <HeroTitle>
        <HeroAccent>dualsense-ts</HeroAccent>
      </HeroTitle>
      <HeroSubtitle>
        The natural interface for your DualSense and DualSense Access
        controllers.
      </HeroSubtitle>
      <HeroSummary>
        Fully featured with support via WebHID in the browser or{" "}
        <InlineCode>node-hid</InlineCode> in Node.js. Connect your controller to
        explore the{" "}
        <PlaygroundLink to="/playground">interactive playground</PlaygroundLink>
        , or see your inputs live on every page of the docs. You can also
        connect multiple controllers and swap between them at any time from the
        top bar.
      </HeroSummary>
      {manager && (
        <ConnectHero onClick={requestPermission}>
          Connect a Controller
        </ConnectHero>
      )}
      <HeroSummary style={{ marginTop: 16, marginBottom: 0 }}>
        <br />
        Have a DualSense Access controller? Try the{" "}
        <PlaygroundLink to="/access/playground">Access playground</PlaygroundLink>.
      </HeroSummary>
    </Hero>

    <Install>npm install dualsense-ts</Install>

    <SectionTitle>Features</SectionTitle>
    <Grid>
      {features.map((f) => (
        <Link key={f.to} to={f.to} style={{ textDecoration: "none" }}>
          <FeatureCard $interactive>
            <CardTitle>{f.title}</CardTitle>
            <CardDesc>{f.desc}</CardDesc>
          </FeatureCard>
        </Link>
      ))}
    </Grid>
  </>
);

export default Home;
