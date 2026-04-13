import{j as e,g as o}from"./index-CqgUOPB5.js";import"./CodeBlock-D0xyfFu-.js";const x=o.div`
  margin-bottom: 32px;
`,p=o.h1`
  margin-bottom: 4px;
  font-family: monospace;
`,h=o.span`
  color: rgba(191, 204, 214, 0.4);
  font-size: 16px;
  font-weight: 400;
`,g=o.p`
  color: rgba(191, 204, 214, 0.6);
  font-size: 15px;
  margin: 0;
`,b=o.a`
  font-size: 12px;
  color: rgba(72, 175, 240, 0.5);
  text-decoration: none;
  margin-left: 12px;
  font-family: sans-serif;
  font-weight: 400;

  &:hover {
    color: #48aff0;
  }
`,y=o.h2`
  margin-top: 40px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;o.h3`
  margin-top: 24px;
  color: rgba(191, 204, 214, 0.9);
`;const P=o.div`
  color: rgba(191, 204, 214, 0.85);
  line-height: 1.7;

  strong {
    color: #f5f5f5;
  }
`,c=o.table`
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  font-size: 14px;
`,s=o.th`
  text-align: left;
  padding: 8px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(191, 204, 214, 0.5);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`,t=o.td`
  padding: 8px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  color: rgba(191, 204, 214, 0.8);
  vertical-align: top;
`,a=o.code`
  color: #48aff0;
  font-size: 13px;
`,j=o.code`
  color: #c792ea;
  font-size: 13px;
`,T=({name:n,extends:r,description:l,source:i,children:d})=>e.jsxs(e.Fragment,{children:[e.jsxs(x,{children:[e.jsxs(p,{children:[n,r&&e.jsxs(h,{children:[" extends ",r]}),i&&e.jsx(b,{href:`https://github.com/nsfm/dualsense-ts/blob/main/${i}`,target:"_blank",rel:"noopener noreferrer",children:"source"})]}),e.jsx(g,{children:l})]}),d]}),u=({properties:n})=>e.jsxs(c,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx(s,{children:"Property"}),e.jsx(s,{children:"Type"}),e.jsx(s,{children:"Description"})]})}),e.jsx("tbody",{children:n.map(r=>e.jsxs("tr",{children:[e.jsx(t,{children:e.jsxs(a,{children:[r.readonly?"readonly ":"",r.name]})}),e.jsx(t,{children:e.jsx(j,{children:r.type})}),e.jsx(t,{children:r.description})]},r.name))})]}),z=({methods:n})=>e.jsxs(c,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx(s,{children:"Method"}),e.jsx(s,{children:"Description"})]})}),e.jsx("tbody",{children:n.map(r=>e.jsxs("tr",{children:[e.jsx(t,{children:e.jsx(a,{children:r.signature})}),e.jsx(t,{children:r.description})]},r.name))})]});export{T as A,z as M,P,y as S,u as a};
