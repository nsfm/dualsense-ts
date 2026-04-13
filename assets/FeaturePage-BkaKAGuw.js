import{j as e,g as t,R as d,C as c,h as l}from"./index-DKhcrciQ.js";import"./CodeBlock-ByGo0dcz.js";const x=t.div`
  margin-bottom: 32px;
`,p=t.h1`
  margin-bottom: 8px;
`,g=t.p`
  color: rgba(191, 204, 214, 0.6);
  font-size: 15px;
  margin: 0;
`,j=t.h2`
  margin-top: 40px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`,n=t.div`
  margin: 24px 0;
  padding: 24px;
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
`,s=t.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.3);
  font-size: 13px;
  line-height: 1.6;
`,H=t.div`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(72, 175, 240, 0.5);
  margin-bottom: 8px;
`,w=t.div`
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
`,b=({title:o,subtitle:r,children:a})=>e.jsxs(e.Fragment,{children:[e.jsxs(x,{children:[e.jsx(p,{children:o}),r&&e.jsx(g,{children:r})]}),a]});b.displayName="FeaturePage";const v=o=>{var i;const r=d.useContext(c),a=(i=r==null?void 0:r.connection)==null?void 0:i.state;return l?a?e.jsx(n,{...o}):e.jsx(n,{...o,children:e.jsx(s,{children:"Connect a controller to try this demo"})}):e.jsx(n,{...o,children:e.jsxs(s,{children:["Live demo requires a WebHID-compatible browser",e.jsx("br",{}),"(Chrome 89+, Edge 89+, or Opera 75+)"]})})},m=t.div`
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
`,h=t.span`
  font-weight: 600;
  color: #f29e02;
`,z=({children:o})=>e.jsxs(m,{children:[e.jsx(h,{children:"Hardware note: "}),o]});export{H as D,b as F,z as H,w as P,j as S,v as a};
