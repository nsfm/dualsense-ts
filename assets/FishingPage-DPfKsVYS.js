import{a as c,C as nt,d as V,j as s,g as a,h as Me,f as z,E as $}from"./index-B3Vc337h.js";import{C as we}from"./CodeBlock-C5O9LPzb.js";const K={bluegill:{name:"Bluegill",strength:.3,thrashSpeed:2.5,thrashChance:.3,hookWindow:1200,minWeight:.2,maxWeight:.5,points:10},bass:{name:"Bass",strength:.45,thrashSpeed:3.5,thrashChance:.5,hookWindow:900,minWeight:1,maxWeight:3,points:25},catfish:{name:"Catfish",strength:.55,thrashSpeed:2,thrashChance:.4,hookWindow:1e3,minWeight:2,maxWeight:8,points:40},pike:{name:"Pike",strength:.7,thrashSpeed:5,thrashChance:.7,hookWindow:600,minWeight:3,maxWeight:10,points:60},marlin:{name:"Marlin",strength:.9,thrashSpeed:4,thrashChance:.8,hookWindow:400,minWeight:50,maxWeight:200,points:100}},it=["bluegill","bass","catfish","pike","marlin"],at={bluegill:0,bass:1,catfish:2,pike:3,marlin:4},ne=.12,ot={bluegill:.6,bass:.85,catfish:1.1,pike:1.3,marlin:1.8};function Ie(e,f=.5){const l=T((f-.35)/.55),t=[["bluegill",35*(1-l*.5)],["bass",28],["catfish",e>=2?12+l*12:0],["pike",e>=4?6+l*14:0],["marlin",e>=6?2+l*18:0]],u=t.reduce((b,[,v])=>b+v,0);let S=Math.random()*u;for(const[b,v]of t)if(S-=v,S<=0){const m=K[b],A=m.minWeight+Math.random()*(m.maxWeight-m.minWeight);return{species:m,weight:Math.round(A*10)/10}}const E=K.bluegill;return{species:E,weight:E.minWeight+Math.random()*(E.maxWeight-E.minWeight)}}function ct(e){const f=3e3+Math.random()*5e3,l=1-e*.2;return f*Math.max(.8,Math.min(1.2,l))}function T(e,f=0,l=1){return Math.max(f,Math.min(l,e))}function ze(e){return e<.3?{r:0,g:150,b:30}:e<.5?{r:180,g:180,b:0}:e<.7?{r:220,g:120,b:0}:e<.85?{r:220,g:30,b:0}:{r:255,g:0,b:0}}function ht(e){const f=ze(e);return`rgb(${f.r}, ${f.g}, ${f.b})`}function lt(e,f,l,t){if(f){const b=t*6+Math.sin(t*11)*.5,v=Math.sin(b)*.15,m=T(l+v,.1,.9),A=.1+Math.abs(Math.sin(b*.7))*.12,R=T(m-A,.05),D=T(m+A,R+.1);return{effect:V.TriggerEffect.Bow,start:R,end:D,strength:T(.6+e.strength*.5+Math.sin(b*1.3)*.15,.3,1),snapForce:T(.4+e.strength*.6+Math.sin(b*.9)*.15,.3,1)}}const u=Math.sin(t*2.5),S=T(.25+e.strength*.5+u*.18,.1,1),E=T(.08+Math.abs(u)*.12,.05,.5);return{effect:V.TriggerEffect.Feedback,position:E,strength:S}}function Pe(e){const f=.6+e*.5,l=(Math.random()-.5)*.15;return T(f+l,.35,.9)}function pt(e){return T(.6+e*.5,.35,.9)}function $e(e,f){if(e.length===0)return 0;const l=performance.now()-f;for(let t=e.length-1;t>=0;t--)if(e[t].time<=l)return e[t].value;return e[0].value}function dt(e){for(const[f,l]of Object.entries(K))if(l===e)return f;return"bluegill"}function ft(e){e.startTestTone("speaker","1khz").catch(()=>{}),setTimeout(()=>e.stopTestTone().catch(()=>{}),30)}function gt(e){e.startTestTone("speaker","100hz").catch(()=>{}),setTimeout(()=>{e.stopTestTone().catch(()=>{}),setTimeout(()=>{e.startTestTone("speaker","1khz").catch(()=>{}),setTimeout(()=>e.stopTestTone().catch(()=>{}),40)},20)},50)}function ut(e){e.startTestTone("speaker","100hz").catch(()=>{}),setTimeout(()=>e.stopTestTone().catch(()=>{}),40)}function bt(e){e.startTestTone("speaker","100hz").catch(()=>{}),setTimeout(()=>e.stopTestTone().catch(()=>{}),20)}const pe={fishPos:.5,fishVel:0,fishTarget:.5,catchProgress:0,tension:0,isThrashing:!1,thrashTimer:0,elapsed:0},mt={phase:"IDLE",fish:null,fightState:pe,score:0,caught:0,speciesCaught:new Set,biggestWeight:0,linesSnapped:0,escaped:0,streak:0,bestStreak:0,r2Position:0,rodTilt:0,bobberX:.5};function xt(e,f){switch(f.type){case"CAST":return e.phase!=="IDLE"?e:{...e,phase:"CAST",fish:null,fightState:pe,bobberX:f.bobberX};case"START_WAIT":return e.phase!=="CAST"?e:{...e,phase:"WAIT"};case"BITE":return e.phase!=="WAIT"?e:{...e,phase:"BITE",fish:f.fish};case"HOOK":return e.phase!=="BITE"||!e.fish?e:{...e,phase:"FIGHT",fightState:{fishPos:.3+Math.random()*.4,fishVel:0,fishTarget:Math.random(),catchProgress:0,tension:0,isThrashing:!1,thrashTimer:0,elapsed:0}};case"FIGHT_TICK":{if(e.phase!=="FIGHT"||!e.fish)return e;const{dt:l}=f,t=e.fish.species,u=e.fightState,S=u.elapsed+l;let{fishPos:E,fishVel:b,fishTarget:v,isThrashing:m,thrashTimer:A}=u;m?(A-=l,A<=0&&(m=!1,A=0)):Math.random()<t.thrashChance*1.6*l&&(m=!0,A=.35+Math.random()*.5,v=T(E+(Math.random()-.5)*.85,.05,.95)),!m&&Math.random()<3*l&&(v=T(v+(Math.random()-.5)*.55,.05,.95));const R=m?t.thrashSpeed*3:t.thrashSpeed*1,D=(v-E)*R;b=b*.85+D*l,b=T(b,-2,2),E=T(E+b*l);const ie=e.r2Position,_=Math.abs(E-ie),F=_<=ne,O=F?.12:0,Z=F?0:.1*t.strength,B=T(u.catchProgress+(O-Z)*l),Q=F?0:.3*(_/.5)*(1+t.strength),J=F?.08:0,L=m?.16*t.strength:0,G=T(u.tension+(Q+L-J)*l),M={fishPos:E,fishVel:b,fishTarget:v,catchProgress:B,tension:G,isThrashing:m,thrashTimer:A,elapsed:S};if(B>=1){const ae=new Set(e.speciesCaught);ae.add(e.fish.species.name);const ee=e.streak+1;return{...e,phase:"CATCH",score:e.score+e.fish.species.points,caught:e.caught+1,speciesCaught:ae,biggestWeight:Math.max(e.biggestWeight,e.fish.weight),streak:ee,bestStreak:Math.max(e.bestStreak,ee),fightState:{...M,catchProgress:1}}}return G>=1?{...e,phase:"SNAP",linesSnapped:e.linesSnapped+1,streak:0,fightState:{...M,tension:1}}:B<=0&&S>8?{...e,phase:"ESCAPE",streak:0,fightState:M}:{...e,fightState:M}}case"ESCAPE":return e.phase!=="BITE"?e:{...e,phase:"ESCAPE",streak:0};case"RETURN_TO_IDLE":return{...e,phase:"IDLE",fish:null,fightState:pe};case"UPDATE_R2":return{...e,r2Position:f.pos};case"UPDATE_TILT":{const l=T(f.pitch,-.4,.4);return Math.abs(l-e.rodTilt)<.005?e:{...e,rodTilt:l}}default:return e}}$`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
`;$`
  0% { transform: translateY(0); }
  30% { transform: translateY(12px); }
  100% { transform: translateY(8px); }
`;const Tt=$`
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
`,Et=$`
  0%, 100% { transform: rotate(var(--rod-tilt, 0deg)); }
  20% { transform: rotate(calc(var(--rod-tilt, 0deg) + 3deg)); }
  40% { transform: rotate(calc(var(--rod-tilt, 0deg) - 2deg)); }
  60% { transform: rotate(calc(var(--rod-tilt, 0deg) + 1deg)); }
`,yt=$`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); opacity: 1; }
`,St=$`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`,vt=$`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`,kt=$`
  0% { opacity: 1; }
  25% { transform: translateX(-4px); opacity: 0.8; }
  50% { transform: translateX(3px); opacity: 0.6; }
  75% { transform: translateX(-2px); opacity: 0.8; }
  100% { transform: translateX(0); opacity: 1; }
`,jt=a.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 24px 80px;
`,Ct=a.div`
  margin-bottom: 24px;
`,At=a.h1`
  margin-bottom: 4px;
`,Mt=a.p`
  color: rgba(191, 204, 214, 0.5);
  font-size: 15px;
  margin: 0;
`,wt=a.div`
  margin-top: 32px;
  color: rgba(191, 204, 214, 0.65);
  font-size: 14px;
  line-height: 1.65;
`,Re=a.h3`
  color: rgba(191, 204, 214, 0.85);
  font-size: 15px;
  margin: 24px 0 8px;
  &:first-child {
    margin-top: 0;
  }
`,It=a.ul`
  margin: 6px 0 16px;
  padding-left: 20px;
  li {
    margin: 4px 0;
  }
  code {
    font-size: 12px;
    padding: 1px 5px;
    background: rgba(0, 0, 0, 0.25);
    border-radius: 3px;
    color: rgba(191, 204, 214, 0.75);
  }
`,Pt=a.div`
  padding: 24px 24px 20px;
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 480px;
  position: relative;
`,$t=a.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  z-index: 2;
`,Rt=a.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: ${e=>e.$inactive?.3:1};
  filter: ${e=>e.$inactive?"grayscale(0.8)":"none"};
  pointer-events: ${e=>e.$inactive?"none":"auto"};
  transition:
    opacity 0.2s,
    filter 0.2s;
`,Ft=a.div`
  padding: 6px 14px;
  background: rgba(10, 10, 20, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: rgba(191, 204, 214, 0.7);
  font-size: 12px;
  white-space: nowrap;
  z-index: 3;
`,Lt=a.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 0 0 12px;
  margin-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 13px;
  font-family: "Fira Code", monospace;
  color: rgba(191, 204, 214, 0.7);
`,Fe=a.span`
  white-space: nowrap;
`,Wt=a.span`
  flex: 1;
`,Dt=a.span`
  display: inline-flex;
  gap: 4px;
  align-items: center;
`,Bt=a.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${e=>e.$caught?"#48aff0":"rgba(255, 255, 255, 0.1)"};
  transition: background 0.3s;
`,Xt=a.div`
  width: 100%;
  height: 240px;
  position: relative;
  overflow: hidden;
  margin-bottom: 8px;
`,Ht=a.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 55%;
  background: linear-gradient(
    180deg,
    rgba(10, 15, 30, 0.8) 0%,
    rgba(20, 35, 60, 0.5) 100%
  );
`,zt=a.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(
    90deg,
    rgba(20, 50, 80, 0.4) 0%,
    rgba(30, 70, 100, 0.5) 25%,
    rgba(20, 50, 80, 0.4) 50%,
    rgba(30, 70, 100, 0.5) 75%,
    rgba(20, 50, 80, 0.4) 100%
  );
  background-size: 200% 100%;
  animation: ${Tt} 8s linear infinite;
`,_t=a.div`
  position: absolute;
  top: 55%;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(72, 175, 240, 0.15);
`,Ot=a.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 18%;
  height: 50%;
  background: linear-gradient(
    180deg,
    rgba(80, 55, 30, 0.3) 0%,
    rgba(60, 40, 20, 0.4) 100%
  );
  border-right: 2px solid rgba(80, 55, 30, 0.25);
  z-index: 1;
`,Gt=a.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 18%;
  height: 50%;
  z-index: 2;
  /* Plank lines */
  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(80, 55, 30, 0.2);
  }
  &::before {
    top: 33%;
  }
  &::after {
    top: 66%;
  }
`,Nt=a.div`
  position: absolute;
  top: 10px;
  left: 14%;
  transform-origin: bottom center;
  transition: transform 0.08s ease-out;
  z-index: 3;
  ${e=>e.$shake&&z`
      animation: ${Et} 0.4s ease;
    `}
`,Yt=a.div`
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #f29e02;
  transform: translate(-50%, -50%);

  ${e=>e.$phase==="IDLE"&&z`
      opacity: 0;
    `}
  ${e=>(e.$phase==="FIGHT"||e.$phase==="CATCH"||e.$phase==="ESCAPE"||e.$phase==="SNAP")&&z`
      box-shadow: 0 0 6px rgba(242, 158, 2, 0.3);
    `}
`,Ut=a.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
`,qt=a.div`
  position: absolute;
  top: 52%;
  width: 16px;
  height: 5px;
  border: 1px solid rgba(242, 158, 2, 0.35);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 2;
`,Vt=a.div`
  position: absolute;
  transition: opacity 0.4s ease;
  opacity: ${e=>e.$hidden?0:e.$interested?.85:.4};
  pointer-events: none;
  z-index: 1;
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: ${e=>e.$interested?"rgba(255, 180, 100, 0.75)":"rgba(150, 180, 200, 0.55)"};
    border-radius: 60% 25% 25% 60%;
  }
  &::after {
    content: "";
    position: absolute;
    right: -3px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-top: 3px solid transparent;
    border-bottom: 3px solid transparent;
    border-left: 4px solid
      ${e=>e.$interested?"rgba(255, 180, 100, 0.75)":"rgba(150, 180, 200, 0.55)"};
  }
`,Kt=a.div`
  height: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`,re=a.div`
  font-size: 16px;
  font-weight: 600;
  color: rgba(191, 204, 214, 0.85);
  text-align: center;
  ${e=>e.$anim==="celebrate"&&z`
      animation: ${yt} 0.5s ease;
      color: #00e050;
    `}
  ${e=>e.$anim==="snap"&&z`
      animation: ${kt} 0.4s ease;
      color: #ff3030;
    `}
  ${e=>e.$anim==="escape"&&z`
      animation: ${St} 0.3s ease;
      color: rgba(191, 204, 214, 0.5);
    `}
`,Le=a.div`
  font-size: 13px;
  font-family: "Fira Code", monospace;
  color: rgba(191, 204, 214, 0.45);
  margin-top: 2px;
`,Zt=a.div`
  font-size: 14px;
  color: rgba(191, 204, 214, 0.6);
  text-align: center;
  line-height: 1.6;
  max-width: 320px;
`,Qt=a.div`
  width: 100%;
  max-width: 400px;
  margin: 8px 0;
  opacity: ${e=>e.$visible?1:0};
  transition: opacity 0.2s;
`,Jt=a.div`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(191, 204, 214, 0.3);
  margin-bottom: 3px;
`,es=a.div`
  position: relative;
  width: 100%;
  height: 28px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  overflow: hidden;
`,ts=a.div`
  position: absolute;
  top: 0;
  height: 100%;
  background: ${e=>e.$active?"rgba(0, 200, 80, 0.2)":"rgba(72, 175, 240, 0.12)"};
  border-left: 2px solid
    ${e=>e.$active?"rgba(0, 200, 80, 0.5)":"rgba(72, 175, 240, 0.25)"};
  border-right: 2px solid
    ${e=>e.$active?"rgba(0, 200, 80, 0.5)":"rgba(72, 175, 240, 0.25)"};
  transition:
    background 0.15s,
    border-color 0.15s;
`,ss=a.div`
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  transform: translate(-50%, -50%);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: ${e=>e.$thrashing?"#ff6030":"#f29e02"};
    box-shadow: 0 0
      ${e=>e.$thrashing?"8px rgba(255, 96, 48, 0.6)":"4px rgba(242, 158, 2, 0.4)"};
    transition: background 0.1s;
  }
`,rs=a.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 6px 0;
  opacity: ${e=>e.$visible?1:0};
  transition: opacity 0.2s;
`,We=a.div`
  width: 100%;
`,De=a.div`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(191, 204, 214, 0.3);
  margin-bottom: 2px;
  display: flex;
  justify-content: space-between;
`,Be=a.div`
  position: relative;
  width: 100%;
  height: 10px;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 3px;
  overflow: hidden;
`,Xe=a.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 3px 0 0 3px;
  transition: background 0.15s;
  opacity: 0.7;
`,He=a.span`
  font-size: 10px;
  font-family: "Fira Code", monospace;
  color: rgba(191, 204, 214, 0.4);
`,ns=a.div`
  font-size: 14px;
  color: rgba(191, 204, 214, 0.45);
  text-align: center;
  margin-top: 12px;
  animation: ${vt} 2.5s ease-in-out infinite;
  min-height: 21px;
`,is=a.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  font-size: 11px;
  font-family: "Fira Code", monospace;
  color: rgba(191, 204, 214, 0.35);
  justify-content: center;
  flex-wrap: wrap;
`,as=()=>s.jsxs("svg",{width:"60",height:"110",viewBox:"0 0 60 110",fill:"none",children:[s.jsx("line",{x1:"30",y1:"100",x2:"30",y2:"10",stroke:"rgba(191, 204, 214, 0.35)",strokeWidth:"2.5",strokeLinecap:"round"}),s.jsx("line",{x1:"30",y1:"10",x2:"30",y2:"2",stroke:"rgba(191, 204, 214, 0.2)",strokeWidth:"1.5",strokeLinecap:"round"}),s.jsx("circle",{cx:"30",cy:"82",r:"6",stroke:"rgba(191, 204, 214, 0.25)",strokeWidth:"1.5",fill:"rgba(191, 204, 214, 0.05)"}),s.jsx("line",{x1:"36",y1:"82",x2:"42",y2:"82",stroke:"rgba(191, 204, 214, 0.2)",strokeWidth:"1.5",strokeLinecap:"round"}),s.jsx("circle",{cx:"30",cy:"30",r:"2",stroke:"rgba(191, 204, 214, 0.15)",strokeWidth:"1",fill:"none"}),s.jsx("circle",{cx:"30",cy:"55",r:"2.5",stroke:"rgba(191, 204, 214, 0.15)",strokeWidth:"1",fill:"none"})]}),ls=()=>{var Te;const e=c.useContext(nt),[f,l]=c.useState(!!((Te=e==null?void 0:e.connection)!=null&&Te.state)),[t,u]=c.useReducer(xt,mt),S=c.useRef(t),E=c.useRef(0),b=c.useRef(),v=c.useRef(),m=c.useRef(),A=c.useRef("IDLE"),R=c.useRef(),D=c.useRef(null),[ie,_]=c.useState(800),F=c.useRef(0),O=c.useRef(0),Z=c.useRef(0),B=c.useRef(0),Q=c.useRef(.5),J=c.useRef(53),L=c.useRef([]),G=c.useRef(null),M=c.useRef([]);if(M.current.length===0)for(let r=0;r<5;r++)M.current.push({id:r,x:.5+Math.random()*.5,y:.25+Math.random()*.55,vx:-(.04+Math.random()*.06),size:.7+Math.random()*.5,facing:-1,interested:!1,bobX:Math.random()*Math.PI*2,hidden:!1,respawnAt:0});const[ae,ee]=c.useState(0);S.current=t,c.useEffect(()=>{if(!(e!=null&&e.connection))return;const r=()=>l(!!e.connection.state);return r(),e.connection.on("change",r),()=>{e.connection.removeListener("change",r)}},[e]),c.useEffect(()=>{var n;if(!((n=e==null?void 0:e.right)!=null&&n.trigger))return;const r=()=>{u({type:"UPDATE_R2",pos:e.right.trigger.state})};return e.right.trigger.on("change",r),()=>{e.right.trigger.removeListener("change",r)}},[e]),c.useEffect(()=>{if(!(e!=null&&e.cross))return;const r=()=>{const{phase:n}=S.current;if(n==="IDLE"){const o=$e(L.current,500);u({type:"CAST",bobberX:Pe(o)})}else n==="BITE"&&u({type:"HOOK"})};return e.cross.on("press",r),()=>{e.cross.off("press",r)}},[e]),c.useEffect(()=>{if(!(e!=null&&e.shake)||t.phase!=="IDLE"&&t.phase!=="BITE")return;let r,n;const o=()=>{const{phase:g}=S.current;if(!(g!=="IDLE"&&g!=="BITE"))if(e.shake.active&&e.shake.intensity>.3)if(g==="IDLE"){const p=$e(L.current,500);u({type:"CAST",bobberX:Pe(p)})}else g==="BITE"&&u({type:"HOOK"});else r=requestAnimationFrame(o)};return t.phase==="BITE"?n=setTimeout(()=>{r=requestAnimationFrame(o)},400):r=requestAnimationFrame(o),()=>{cancelAnimationFrame(r),n&&clearTimeout(n)}},[e,t.phase]),c.useEffect(()=>{if(!(e!=null&&e.orientation))return;let r,n=!0,o=0;const g=()=>{if(n){if(o++,o%4===0){const p=e.orientation.roll;u({type:"UPDATE_TILT",pitch:p});const d=T(p/(Math.PI/4),-1,1);L.current.push({time:performance.now(),value:d}),L.current.length>30&&L.current.shift()}r=requestAnimationFrame(g)}};return r=requestAnimationFrame(g),()=>{n=!1,cancelAnimationFrame(r)}},[e]),c.useEffect(()=>{const r=D.current;if(!r)return;_(r.clientWidth);const n=new ResizeObserver(()=>_(r.clientWidth));return n.observe(r),()=>n.disconnect()},[]),c.useEffect(()=>{let r,n=performance.now(),o=n;const g=p=>{const d=Math.min(.05,(p-n)/1e3);n=p;const j=S.current.phase,y=S.current.bobberX;for(const i of M.current){if(i.hidden){i.respawnAt>0&&p>i.respawnAt&&(i.hidden=!1,i.x=1.02,i.y=.25+Math.random()*.55,i.vx=-(.04+Math.random()*.06),i.size=.7+Math.random()*.5,i.facing=-1,i.respawnAt=0);continue}if(i.interested&&j==="WAIT"){const C=y-i.x,k=Math.abs(C);if(k>.025){const h=Math.min(.18,k*.4);i.vx=Math.sign(C)*h,i.facing=i.vx>=0?1:-1,i.x+=i.vx*d,i.y=Math.max(.1,i.y-d*.15)}else i.vx*=.6,i.x+=i.vx*d,i.y=Math.max(.09,i.y-d*.05),i.y+=Math.sin(p*.003+i.bobX)*d*.015}else if(i.interested&&j==="BITE"){const C=y-i.x;i.vx=Math.sign(C||1)*.6,i.facing=i.vx>=0?1:-1,i.x+=i.vx*d,i.y+=(.04-i.y)*d*8}else{if(i.x+=i.vx*d,i.x<.22&&(i.x=.22,i.vx=Math.abs(i.vx),i.facing=1),i.x>1.02){i.hidden=!0,i.respawnAt=p+3e3+Math.random()*5e3;continue}Math.random()<.4*d&&(i.vx=-i.vx,i.facing=i.vx>=0?1:-1),i.y+=Math.sin(p*8e-4+i.bobX)*d*.04,i.y=Math.max(.18,Math.min(.85,i.y))}}p-o>33&&(o=p,ee(i=>(i+1)%1e6)),r=requestAnimationFrame(g)};return r=requestAnimationFrame(g),()=>cancelAnimationFrame(r)},[]),c.useEffect(()=>{const r=t.phase;if(r==="WAIT"){const n=S.current,o=Ie(n.caught,n.bobberX);G.current=o;const g=n.bobberX;let p,d=1/0;for(const j of M.current){if(j.hidden)continue;const y=Math.abs(j.x-g);y<d&&(d=y,p=j)}p&&(p.interested=!0,p.size=ot[dt(o.species)]??1)}else if(r==="BITE"){F.current=performance.now();const n=setTimeout(()=>{for(const o of M.current)o.interested&&(o.hidden=!0,o.interested=!1,o.respawnAt=performance.now()+4e3+Math.random()*3e3)},220);return()=>clearTimeout(n)}else if(r==="IDLE")for(const n of M.current)n.hidden&&n.respawnAt===0&&(n.respawnAt=performance.now()+1e3+Math.random()*2e3),n.interested=!1;else if(r==="ESCAPE"||r==="SNAP"||r==="CATCH"){if(r==="CATCH"&&(Z.current=performance.now()),r==="ESCAPE"||r==="SNAP"){const n=S.current,o=.2;Q.current=n.bobberX+(o-n.bobberX)*n.fightState.catchProgress,J.current=55+n.fightState.fishPos*35,B.current=performance.now()}for(const n of M.current)n.interested=!1}else r==="CAST"&&(O.current=performance.now())},[t.phase]),c.useEffect(()=>{if(t.phase!=="CAST")return;const r=setTimeout(()=>u({type:"START_WAIT"}),800);return()=>clearTimeout(r)},[t.phase]),c.useEffect(()=>{if(t.phase!=="WAIT")return;const r=ct(t.rodTilt);return b.current=setTimeout(()=>{const n=G.current??Ie(S.current.caught,S.current.bobberX);u({type:"BITE",fish:n})},r),()=>{b.current&&clearTimeout(b.current)}},[t.phase]),c.useEffect(()=>{if(!(t.phase!=="BITE"||!t.fish))return v.current=setTimeout(()=>{u({type:"ESCAPE"})},t.fish.species.hookWindow),()=>{v.current&&clearTimeout(v.current)}},[t.phase,t.fish]),c.useEffect(()=>{var x;if(t.phase!=="FIGHT"||!e)return;(x=e.mute)==null||x.setLed(V.MuteLedMode.On);let r=performance.now(),n=0,o=0,g=0,p=0,d=0;const j=.15,y=180,i=1e3/30;let C=0;const k=h=>{var q,Ee,ye,Se,ve,ke,je,Ce,Ae;for(C+=h-r,r=h;C>=i;)u({type:"FIGHT_TICK",dt:1/30}),C-=i;const W=S.current;if(W.phase!=="FIGHT"||!W.fish){E.current=requestAnimationFrame(k);return}const{fightState:w,r2Position:se}=W,H=W.fish.species;if(h-n>50){n=h;const P=lt(H,w.isThrashing,se,w.elapsed);(ye=(Ee=(q=e.right)==null?void 0:q.trigger)==null?void 0:Ee.feedback)==null||ye.set(P)}if(h-o>100){o=h;const P=ze(w.tension);if(w.tension>=.85){const le=Math.floor(h/200)%2===0;(Se=e.lightbar)==null||Se.set(le?P:{r:0,g:0,b:0})}else(ve=e.lightbar)==null||ve.set(P)}if(Math.abs(w.fishVel)>j){const P=w.fishVel>0?1:-1;if(p!==0&&P!==p){d=h+y;const le=Math.min(1,.55+.35*H.strength);(ke=e.left)==null||ke.rumble(le),g=h}p=P}if(h-g>100)if(g=h,(je=e.right)==null||je.rumble(.15*w.tension),h<d){const P=Math.min(1,.55+.35*H.strength);(Ce=e.left)==null||Ce.rumble(P)}else(Ae=e.left)==null||Ae.rumble(w.isThrashing?.5*w.tension:.1*w.tension);E.current=requestAnimationFrame(k)};return E.current=requestAnimationFrame(k),()=>{var h,W,w,se,H,q;cancelAnimationFrame(E.current),(w=(W=(h=e.right)==null?void 0:h.trigger)==null?void 0:W.feedback)==null||w.reset(),(se=e.left)==null||se.rumble(0),(H=e.right)==null||H.rumble(0),(q=e.mute)==null||q.resetLed()}},[t.phase,e]),c.useEffect(()=>{var r,n;(n=(r=e==null?void 0:e.right)==null?void 0:r.trigger)!=null&&n.feedback&&t.phase!=="FIGHT"&&(t.phase==="CAST"||t.phase==="WAIT"?e.right.trigger.feedback.set({effect:V.TriggerEffect.Feedback,position:.2,strength:.15}):e.right.trigger.feedback.reset())},[e,t.phase]),c.useEffect(()=>{e!=null&&e.lightbar&&t.phase!=="FIGHT"&&(t.phase==="CATCH"?e.lightbar.set({r:0,g:255,b:80}):t.phase==="SNAP"?e.lightbar.set({r:255,g:20,b:20}):t.phase==="ESCAPE"?e.lightbar.set({r:80,g:80,b:100}):e.lightbar.set({r:0,g:40,b:100}))},[e,t.phase]),c.useEffect(()=>{var o,g,p,d,j,y,i,C;if(!e)return;const r=A.current,n=t.phase;if(A.current=n,r!==n){if(n==="BITE"){(o=e.right)==null||o.rumble(.6),(g=e.left)==null||g.rumble(.3),ft(e);const k=setTimeout(()=>{var x,h;(x=e.right)==null||x.rumble(0),(h=e.left)==null||h.rumble(0)},200);return()=>{var x,h;clearTimeout(k),(x=e.right)==null||x.rumble(0),(h=e.left)==null||h.rumble(0)}}if(n==="CATCH"){(p=e.left)==null||p.rumble(.4),(d=e.right)==null||d.rumble(.4),gt(e);const k=setTimeout(()=>{var x,h;(x=e.left)==null||x.rumble(0),(h=e.right)==null||h.rumble(0)},200);return()=>clearTimeout(k)}if(n==="SNAP"){(j=e.left)==null||j.rumble(.8),(y=e.right)==null||y.rumble(0),(i=e.mute)==null||i.setLed(V.MuteLedMode.Pulse),ut(e);const k=setTimeout(()=>{var h;return(h=e.left)==null?void 0:h.rumble(0)},300),x=setTimeout(()=>{var h;return(h=e.mute)==null?void 0:h.resetLed()},800);return()=>{clearTimeout(k),clearTimeout(x)}}if(n==="ESCAPE"){(C=e.right)==null||C.rumble(.2),bt(e);const k=setTimeout(()=>{var x;return(x=e.right)==null?void 0:x.rumble(0)},100);return()=>clearTimeout(k)}}},[e,t.phase]),c.useEffect(()=>{if(e!=null&&e.playerLeds)for(const[r,n]of Object.entries(at))e.playerLeds.setLed(n,t.speciesCaught.has(K[r].name))},[e,t.speciesCaught]),c.useEffect(()=>{if(!(t.phase!=="CATCH"&&t.phase!=="SNAP"&&t.phase!=="ESCAPE"))return m.current=setTimeout(()=>u({type:"RETURN_TO_IDLE"}),2e3),()=>{m.current&&clearTimeout(m.current)}},[t.phase]),c.useEffect(()=>()=>{var r,n,o,g,p,d,j,y,i,C,k,x;(o=(n=(r=e==null?void 0:e.right)==null?void 0:r.trigger)==null?void 0:n.feedback)==null||o.reset(),(d=(p=(g=e==null?void 0:e.left)==null?void 0:g.trigger)==null?void 0:p.feedback)==null||d.reset(),(j=e==null?void 0:e.left)==null||j.rumble(0),(y=e==null?void 0:e.right)==null||y.rumble(0),(i=e==null?void 0:e.lightbar)==null||i.set({r:0,g:0,b:255}),(C=e==null?void 0:e.playerLeds)==null||C.clear(),(k=e==null?void 0:e.mute)==null||k.resetLed(),(x=e==null?void 0:e.stopTestTone())==null||x.catch(()=>{}),b.current&&clearTimeout(b.current),v.current&&clearTimeout(v.current),m.current&&clearTimeout(m.current),cancelAnimationFrame(E.current),R.current&&clearInterval(R.current)},[e]);const _e=!Me||!f,de=Me?f?null:"Connect a controller to play":"Requires WebHID (Chrome, Edge, Opera)",N=t.phase==="FIGHT",Oe=t.caught>0||t.linesSnapped>0||t.escaped>0,oe=t.r2Position,fe=T(oe-ne),Ge=T(oe+ne)-fe,Ne=N&&Math.abs(t.fightState.fishPos-oe)<=ne,Ye=t.fightState.fishPos,ge=108,te=14,Ue=120,qe=240;let ce=0;if(t.phase==="CAST"){const r=Math.min(1,(performance.now()-O.current)/700),n=22;if(r<.3)ce=r/.3*n;else{const o=(r-.3)/.7;ce=n*(1-o*o)}}const ue=t.rodTilt*15+ce,be=ue*Math.PI/180,Ve=ge*Math.sin(be),Ke=-ge*Math.cos(be),me=te+Ve/ie*100,X=(Ue+Ke)/qe*100,Ze=t.phase==="FIGHT"||t.phase==="CATCH"||t.phase==="ESCAPE"||t.phase==="SNAP",xe=.2,Qe=t.fightState.catchProgress;let Y=t.bobberX,I=53;const U=performance.now();if(t.phase==="CAST"){const r=Math.min(1,(U-O.current)/800),n=1-(1-r)*(1-r),o=te/100;Y=o+(t.bobberX-o)*n,I=X+(53-X)*r-28*Math.sin(Math.PI*r)}else if(t.phase==="WAIT")I=53+Math.sin(U/2e3*Math.PI*2)*1.2;else if(t.phase==="BITE"){const r=U-F.current,n=Math.min(1,Math.max(0,r/300));I=53+(1-(1-n)*(1-n))*7}else if(t.phase==="CATCH"){const r=Math.min(1,(U-Z.current)/600),n=1-(1-r)*(1-r),o=xe,g=te/100;Y=o+(g-o)*n,I=53+(X-53)*n-22*Math.sin(Math.PI*r)}else if(t.phase==="ESCAPE"||t.phase==="SNAP"){const r=Math.min(1,(U-B.current)/900),n=Q.current,o=J.current,g=te/100,p=X,d=53,j=1-(1-r)*(1-r);if(Y=n+(g-n)*j,r<.4){const y=r/.4;I=o+(d-o)*y}else{const y=(r-.4)/.6,i=1-(1-y)*(1-y);I=d+(p-d)*i-12*Math.sin(Math.PI*y)}}else Ze&&(I=55+Ye*35,Y=t.bobberX+(xe-t.bobberX)*Qe);const he=Y*100,Je=t.phase!=="IDLE",et=(me+he)/2,tt=Math.max(X,I)+15,st=`M ${me} ${X} Q ${et} ${tt} ${he} ${I}`,rt=(()=>{switch(t.phase){case"IDLE":return"Flick controller to cast — or press ✕";case"CAST":return"Casting...";case"WAIT":return"Waiting for a bite...";case"BITE":return"Flick or press ✕ to hook!";case"FIGHT":return"Track the fish with R2!";case"CATCH":return t.fish?`${t.fish.species.name} caught!`:"Caught!";case"SNAP":return"Line snapped!";case"ESCAPE":return"It got away...";default:return" "}})();return s.jsxs(jt,{children:[s.jsxs(Ct,{children:[s.jsx(At,{children:"Fishing"}),s.jsx(Mt,{children:"Reel them in!"})]}),s.jsxs(Pt,{children:[de&&s.jsx($t,{children:s.jsx(Ft,{children:de})}),s.jsxs(Rt,{$inactive:_e,children:[s.jsxs(Lt,{children:[s.jsxs(Fe,{children:["Score ",t.score]}),s.jsxs(Fe,{children:["Caught ",t.caught]}),s.jsx(Wt,{}),s.jsx(Dt,{title:"Species collected",children:it.map(r=>s.jsx(Bt,{$caught:t.speciesCaught.has(K[r].name)},r))})]}),s.jsxs(Xt,{ref:D,children:[s.jsx(Ht,{}),s.jsx(zt,{}),s.jsx(_t,{}),t.phase==="IDLE"&&s.jsx(qt,{style:{left:`${pt(t.rodTilt)*100}%`}}),s.jsx(Ot,{}),s.jsx(Gt,{}),M.current.map(r=>s.jsx(Vt,{$interested:r.interested,$hidden:r.hidden,style:{left:`${r.x*100}%`,top:`${56+r.y*40}%`,width:`${14*r.size}px`,height:`${6*r.size}px`,transform:`translate(-50%, -50%) scaleX(${r.facing})`}},r.id)),s.jsx(Nt,{$shake:t.phase==="BITE",style:{transform:`translateX(-50%) rotate(${ue}deg)`},children:s.jsx(as,{})}),s.jsx(Ut,{viewBox:"0 0 100 100",preserveAspectRatio:"none",children:Je&&s.jsx("path",{d:st,stroke:"rgba(191, 204, 214, 0.15)",strokeWidth:"0.3",fill:"none"})}),s.jsx(Yt,{$phase:t.phase,style:{left:`${he}%`,top:`${I}%`}})]}),s.jsxs(Kt,{children:[t.phase==="IDLE"&&s.jsxs(Zt,{children:["Cast your line and wait for a bite.",s.jsx("br",{}),"Aim by tilting the controller.",s.jsx("br",{}),"Track the fish with R2."]}),t.phase==="FIGHT"&&t.fish&&s.jsxs(s.Fragment,{children:[s.jsx(re,{children:t.fish.species.name}),s.jsxs(Le,{children:[t.fish.weight," kg"]})]}),t.phase==="CATCH"&&t.fish&&s.jsxs(s.Fragment,{children:[s.jsx(re,{$anim:"celebrate",children:t.fish.species.name}),s.jsxs(Le,{children:[t.fish.weight," kg · +",t.fish.species.points]})]}),t.phase==="SNAP"&&s.jsx(re,{$anim:"snap",children:"Line snapped!"}),t.phase==="ESCAPE"&&s.jsx(re,{$anim:"escape",children:"It got away..."}),(t.phase==="CAST"||t.phase==="WAIT"||t.phase==="BITE")&&s.jsx("div",{style:{opacity:0},children:" "})]}),s.jsxs(Qt,{$visible:N,children:[s.jsx(Jt,{children:"Depth"}),s.jsxs(es,{children:[s.jsx(ts,{$active:Ne,style:{left:`${fe*100}%`,width:`${Ge*100}%`}}),N&&s.jsx(ss,{$thrashing:t.fightState.isThrashing,style:{left:`${t.fightState.fishPos*100}%`}})]})]}),s.jsxs(rs,{$visible:N,children:[s.jsxs(We,{children:[s.jsxs(De,{children:[s.jsx("span",{children:"Progress"}),s.jsxs(He,{children:[Math.round(t.fightState.catchProgress*100),"%"]})]}),s.jsx(Be,{children:s.jsx(Xe,{style:{width:`${t.fightState.catchProgress*100}%`,background:"rgba(0, 200, 80, 0.6)"}})})]}),s.jsxs(We,{children:[s.jsxs(De,{children:[s.jsx("span",{children:"Tension"}),s.jsxs(He,{children:[Math.round(t.fightState.tension*100),"%"]})]}),s.jsx(Be,{children:s.jsx(Xe,{style:{width:`${t.fightState.tension*100}%`,background:ht(t.fightState.tension)}})})]})]}),!N&&s.jsx("div",{style:{height:82}}),s.jsx(ns,{children:rt}),Oe&&s.jsxs(is,{children:[t.biggestWeight>0&&s.jsxs("span",{children:["Best ",t.biggestWeight," kg"]}),t.linesSnapped>0&&s.jsxs("span",{children:["Snapped ",t.linesSnapped]}),t.escaped>0&&s.jsxs("span",{children:["Escaped ",t.escaped]}),t.bestStreak>1&&s.jsxs("span",{children:["Streak ",t.bestStreak]})]})]})]}),s.jsxs(wt,{children:[s.jsx(Re,{children:"Controller Features"}),s.jsxs(It,{children:[s.jsxs("li",{children:[s.jsx("strong",{children:"Adaptive triggers"})," - ",s.jsx("code",{children:"TriggerEffect.Feedback"})," provides steady resistance during the reel, pulsing with the fish's pull. ",s.jsx("code",{children:"TriggerEffect.Bow"})," fires during thrash events, snapping the trigger back and physically disrupting R2 position."]}),s.jsxs("li",{children:[s.jsx("strong",{children:"Trigger position"})," - R2 analog position controls the catch zone on the depth gauge. The fight mechanic is built around physically maintaining trigger position against adaptive resistance."]}),s.jsxs("li",{children:[s.jsx("strong",{children:"Orientation (IMU)"})," - Controller roll maps to rod tilt, which aims the cast target and determines bobber landing position. A 500ms tilt buffer prevents flick motion from corrupting the aimed position."]}),s.jsxs("li",{children:[s.jsx("strong",{children:"Shake detection"})," - Flick to cast, flick to hook. A 400ms debounce after bite prevents rumble feedback from triggering a false hook."]}),s.jsxs("li",{children:[s.jsx("strong",{children:"Dual rumble"})," - Right motor carries ambient tension under the trigger finger. Left motor pulses on fish direction changes and thrash events, scaled by species strength. Both fire one-shot patterns on bite, catch, snap, and escape."]}),s.jsxs("li",{children:[s.jsx("strong",{children:"Lightbar"})," - Maps to tension color (green→yellow→red) during fight, flashes above 85%. Phase-specific colors on catch, snap, and escape."]}),s.jsxs("li",{children:[s.jsx("strong",{children:"Player LEDs"})," - Each of the 5 LEDs corresponds to a species. LEDs light up as you complete your collection."]}),s.jsxs("li",{children:[s.jsx("strong",{children:"Speaker (test tones)"})," - Short chirps via ",s.jsx("code",{children:"startTestTone"})," / ",s.jsx("code",{children:"stopTestTone"})," for bite, catch, snap, and escape feedback."]}),s.jsxs("li",{children:[s.jsx("strong",{children:"Mute LED"})," - Enabled during the fight as a visual status indicator."]})]}),s.jsx(Re,{children:"Implementation Notes"}),s.jsxs("p",{children:["The fight loop consolidates all high-frequency HID writes (trigger, lightbar, rumble) into a single ",s.jsx("code",{children:"requestAnimationFrame"})," loop throttled to 30fps, avoiding the performance penalty of multiple React effects with rapidly-changing dependencies."]}),s.jsx(we,{code:`// Adaptive trigger: steady pull with "breathing" resistance
const pulse = Math.sin(elapsed * 2.5);
const strength = clamp(0.25 + fish.strength * 0.5 + pulse * 0.18);
controller.right.trigger.feedback.set({
  effect: TriggerEffect.Feedback, position, strength
});

// Thrash: Bow effect drifts across player position
const drift = Math.sin(elapsed * 6) * 0.15;
controller.right.trigger.feedback.set({
  effect: TriggerEffect.Bow,
  start, end, strength, snapForce
});`}),s.jsxs("p",{children:["Continuously-changing values (positions, widths, colors) are set via inline ",s.jsx("code",{children:"style"})," rather than styled-component props to avoid class explosion in the stylesheet. Discrete state like phase and boolean flags stay as styled-component props."]}),s.jsx(we,{code:`// Buffered tilt: use position from 500ms ago to survive flick
const roll = controller.orientation.roll;
const normalized = clamp(roll / (Math.PI / 4), -1, 1);
tiltBuffer.push({ time: performance.now(), value: normalized });

// On cast, read the buffer instead of current tilt
const bufferedTilt = getBufferedTilt(tiltBuffer, 500);
const bobberX = getBobberXFromTilt(bufferedTilt);`}),s.jsx("p",{children:"Cast distance biases species rarity: further casts into deeper water increase the odds of rare species, giving the tilt-aiming mechanic gameplay significance beyond aesthetics."})]})]})};export{ls as default};
