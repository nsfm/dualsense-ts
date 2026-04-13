import React from "react";
import styled from "styled-components";
import { CodeBlock } from "./ui";

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  margin-bottom: 4px;
  font-family: monospace;
`;

const Extends = styled.span`
  color: rgba(191, 204, 214, 0.4);
  font-size: 16px;
  font-weight: 400;
`;

const Subtitle = styled.p`
  color: rgba(191, 204, 214, 0.6);
  font-size: 15px;
  margin: 0;
`;

const SourceLink = styled.a`
  font-size: 12px;
  color: rgba(72, 175, 240, 0.5);
  text-decoration: none;
  margin-left: 12px;
  font-family: sans-serif;
  font-weight: 400;

  &:hover {
    color: #48aff0;
  }
`;

const SectionHeading = styled.h2`
  margin-top: 40px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const SubHeading = styled.h3`
  margin-top: 24px;
  color: rgba(191, 204, 214, 0.9);
`;

const Prose = styled.div`
  color: rgba(191, 204, 214, 0.85);
  line-height: 1.7;

  strong {
    color: #f5f5f5;
  }
`;

const PropTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  font-size: 14px;
`;

const Th = styled.th`
  text-align: left;
  padding: 8px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(191, 204, 214, 0.5);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Td = styled.td`
  padding: 8px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  color: rgba(191, 204, 214, 0.8);
  vertical-align: top;
`;

const PropName = styled.code`
  color: #48aff0;
  font-size: 13px;
`;

const PropType = styled.code`
  color: #c792ea;
  font-size: 13px;
`;

interface ApiPageProps {
  name: string;
  extends?: string;
  description: string;
  source?: string;
  children?: React.ReactNode;
}

export const ApiPage: React.FC<ApiPageProps> = ({
  name,
  extends: ext,
  description,
  source,
  children,
}) => (
  <>
    <Header>
      <Title>
        {name}
        {ext && <Extends> extends {ext}</Extends>}
        {source && (
          <SourceLink
            href={`https://github.com/nsfm/dualsense-ts/blob/main/${source}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            source
          </SourceLink>
        )}
      </Title>
      <Subtitle>{description}</Subtitle>
    </Header>
    {children}
  </>
);

interface Property {
  name: string;
  type: string;
  description: string;
  readonly?: boolean;
}

interface PropertiesTableProps {
  properties: Property[];
}

export const PropertiesTable: React.FC<PropertiesTableProps> = ({
  properties,
}) => (
  <PropTable>
    <thead>
      <tr>
        <Th>Property</Th>
        <Th>Type</Th>
        <Th>Description</Th>
      </tr>
    </thead>
    <tbody>
      {properties.map((p) => (
        <tr key={p.name}>
          <Td>
            <PropName>
              {p.readonly ? "readonly " : ""}
              {p.name}
            </PropName>
          </Td>
          <Td>
            <PropType>{p.type}</PropType>
          </Td>
          <Td>{p.description}</Td>
        </tr>
      ))}
    </tbody>
  </PropTable>
);

interface Method {
  name: string;
  signature: string;
  description: string;
}

interface MethodsTableProps {
  methods: Method[];
}

export const MethodsTable: React.FC<MethodsTableProps> = ({ methods }) => (
  <PropTable>
    <thead>
      <tr>
        <Th>Method</Th>
        <Th>Description</Th>
      </tr>
    </thead>
    <tbody>
      {methods.map((m) => (
        <tr key={m.name}>
          <Td>
            <PropName>{m.signature}</PropName>
          </Td>
          <Td>{m.description}</Td>
        </tr>
      ))}
    </tbody>
  </PropTable>
);

export { SectionHeading, SubHeading, Prose, CodeBlock };
