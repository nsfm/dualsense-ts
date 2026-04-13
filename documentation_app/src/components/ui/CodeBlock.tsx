import React from "react";
import styled from "styled-components";
import { Highlight, themes } from "prism-react-renderer";

const Pre = styled.pre`
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  padding: 16px;
  overflow-x: auto;
  font-size: 13px;
  line-height: 1.5;
  margin: 0 0 16px;
  position: relative;
`;

const CopyButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 3px 8px;
  border-radius: 3px;
  font-size: 10px;
  cursor: pointer;
  color: rgba(191, 204, 214, 0.6);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: opacity 0.15s, color 0.15s;
  opacity: 0;

  ${Pre}:hover & {
    opacity: 1;
  }

  &:hover {
    color: #48aff0;
    border-color: rgba(72, 175, 240, 0.3);
  }
`;

const Line = styled.div`
  display: table-row;
`;

const LineContent = styled.span`
  display: table-cell;
`;

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "typescript",
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Highlight theme={themes.nightOwl} code={code.trim()} language={language}>
      {({ tokens, getLineProps, getTokenProps }) => (
        <Pre>
          <CopyButton onClick={handleCopy}>
            {copied ? "Copied" : "Copy"}
          </CopyButton>
          <code>
            {tokens.map((line, i) => (
              <Line key={i} {...getLineProps({ line })}>
                <LineContent>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </LineContent>
              </Line>
            ))}
          </code>
        </Pre>
      )}
    </Highlight>
  );
};
