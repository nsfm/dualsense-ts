import React from "react";
import styled from "styled-components";
import { CodeBlock } from "./ui";
import { ControllerContext, hasWebHID } from "../controller";

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: rgba(191, 204, 214, 0.6);
  font-size: 15px;
  margin: 0;
`;

const SectionHeading = styled.h2`
  margin-top: 40px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const DemoAreaBase = styled.div`
  margin: 24px 0;
  padding: 24px;
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
`;

const DemoFallback = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.3);
  font-size: 13px;
  line-height: 1.6;
`;

const DemoLabel = styled.div`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(72, 175, 240, 0.5);
  margin-bottom: 8px;
`;

const Prose = styled.div`
  color: rgba(191, 204, 214, 0.85);
  line-height: 1.7;

  strong {
    color: #f5f5f5;
  }

  ul, ol {
    padding-left: 24px;
  }

  li {
    margin-bottom: 4px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
    font-size: 14px;
  }

  th, td {
    text-align: left;
    padding: 8px 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }

  th {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: rgba(191, 204, 214, 0.4);
    font-weight: 500;
  }

  td {
    color: rgba(191, 204, 214, 0.75);
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

interface FeaturePageProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const FeaturePage: React.FC<FeaturePageProps> = ({
  title,
  subtitle,
  children,
}) => (
  <>
    <Header>
      <Title>{title}</Title>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </Header>
    {children}
  </>
);

FeaturePage.displayName = "FeaturePage";

/**
 * DemoArea shows live HUD components when a controller is connected,
 * otherwise shows a contextual fallback message.
 */
const DemoArea: React.FC<React.ComponentProps<typeof DemoAreaBase>> = (props) => {
  const controller = React.useContext(ControllerContext);
  const connected = controller?.connection?.state;

  if (!hasWebHID) {
    return (
      <DemoAreaBase {...props}>
        <DemoFallback>
          Live demo requires a WebHID-compatible browser
          <br />
          (Chrome 89+, Edge 89+, or Opera 75+)
        </DemoFallback>
      </DemoAreaBase>
    );
  }

  if (!connected) {
    return (
      <DemoAreaBase {...props}>
        <DemoFallback>
          Connect a controller to try this demo
        </DemoFallback>
      </DemoAreaBase>
    );
  }

  return <DemoAreaBase {...props} />;
};

const HardwareNoteBox = styled.div`
  margin: 16px 0;
  padding: 12px 16px;
  background: rgba(242, 158, 2, 0.06);
  border-left: 3px solid rgba(242, 158, 2, 0.4);
  border-radius: 0 6px 6px 0;
  color: rgba(191, 204, 214, 0.85);
  font-size: 14px;
  line-height: 1.6;

  code {
    font-size: 13px;
  }
`;

const HardwareNoteLabel = styled.span`
  font-weight: 600;
  color: #f29e02;
`;

const HardwareNote: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <HardwareNoteBox>
    <HardwareNoteLabel>Hardware note: </HardwareNoteLabel>
    {children}
  </HardwareNoteBox>
);

export { SectionHeading, DemoArea, DemoLabel, Prose, HardwareNote, CodeBlock };
