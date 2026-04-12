import React from "react";
import styled from "styled-components";
import { Link } from "react-router";
import { Card } from "../components/ui";
import { requestPermission, manager } from "../controller";

const Hero = styled.div`
  text-align: center;
  padding: 40px 0 48px;
`;

const HeroTitle = styled.h1`
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 12px;

  @media (max-width: 600px) {
    font-size: 28px;
  }
`;

const HeroAccent = styled.span`
  color: #48aff0;
`;

const HeroSub = styled.p`
  font-size: 16px;
  color: rgba(191, 204, 214, 0.65);
  max-width: 560px;
  margin: 0 auto 28px;
  line-height: 1.6;
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
  transition: border-color 0.15s, transform 0.1s;

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
    desc: "Pressure-sensitive L2/R2 with full 0-1 range reading.",
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
    title: "Audio Controls",
    desc: "Speaker, headphone, and microphone volume, routing, and test tones.",
    to: "/outputs/audio",
  },
  {
    title: "Battery & Status",
    desc: "Battery level, charge state, firmware, factory info, and color.",
    to: "/status",
  },
  {
    title: "Multiplayer",
    desc: "Manage up to 31 controllers with automatic player assignment.",
    to: "/multiplayer",
  },
];

const Home: React.FC = () => (
  <>
    <Hero>
      <HeroTitle>
        <HeroAccent>dualsense-ts</HeroAccent>
      </HeroTitle>
      <HeroSub>
        A natural TypeScript interface for the PS5 DualSense controller. Connect
        via WebHID in the browser or node-hid in Node.js. Every feature of the
        controller is fully supported.
      </HeroSub>
      {manager && (
        <ConnectHero onClick={requestPermission}>
          Connect a Controller
        </ConnectHero>
      )}
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
