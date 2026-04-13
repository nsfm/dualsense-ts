import{j as o,g as t,R as c,C as l,h as s}from"./index-GGWi0Ont.js";import"./CodeBlock-Dvv7tnEL.js";const p=t.div`
  margin-bottom: 32px;
`,x=t.h1`
  margin-bottom: 8px;
`,g=t.p`
  color: rgba(191, 204, 214, 0.6);
  font-size: 15px;
  margin: 0;
`,D=t.h2`
  margin-top: 40px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`,b=t.div`
  margin: 24px 0;
  padding: 24px;
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
`,m=t.div`
  position: relative;
  width: 100%;
`,h=t.div`
  opacity: ${e=>e.$inactive?.3:1};
  filter: ${e=>e.$inactive?"grayscale(0.8)":"none"};
  pointer-events: ${e=>e.$inactive?"none":"auto"};
  transition: opacity 0.2s, filter 0.2s;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`,f=t.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 6px 14px;
  background: rgba(10, 10, 20, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: rgba(191, 204, 214, 0.7);
  font-size: 12px;
  text-align: center;
  line-height: 1.5;
  white-space: nowrap;
  pointer-events: none;
  z-index: 1;
`,H=t.div`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(72, 175, 240, 0.5);
  margin-bottom: 8px;
`,z=t.div`
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
`,u=({title:e,subtitle:r,children:n})=>o.jsxs(o.Fragment,{children:[o.jsxs(p,{children:[o.jsx(x,{children:e}),r&&o.jsx(g,{children:r})]}),n]});u.displayName="FeaturePage";const C=e=>{var i;const r=c.useContext(l),n=(i=r==null?void 0:r.connection)==null?void 0:i.state,d=!s||!n,a=s?n?null:"Connect a controller to try this demo":"Requires WebHID (Chrome, Edge, Opera)";return o.jsx(b,{...e,children:o.jsxs(m,{children:[o.jsx(h,{$inactive:d,children:e.children}),a&&o.jsx(f,{children:a})]})})},v=t.div`
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
`,j=t.span`
  font-weight: 600;
  color: #f29e02;
`,$=({children:e})=>o.jsxs(v,{children:[o.jsx(j,{children:"Hardware note: "}),e]});export{H as D,u as F,$ as H,z as P,D as S,C as a};
