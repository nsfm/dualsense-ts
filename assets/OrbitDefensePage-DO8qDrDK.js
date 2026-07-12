import{a as h,C as Ne,d as ve,j as t,g as c,h as je,E as me}from"./index-B3Vc337h.js";import{C as Ie}from"./CodeBlock-C5O9LPzb.js";const q=520,H=q/2,O=q/2,K=26,ke=14,ae=110,ge=9,De=Math.PI/3,ze=Math.PI*2/9,Re=310,de=340,Le=460,Me=.3,Ye=1.1,Te=4,N=5,He=2,fe=150,he=.45,Ue=1.8,pe=.65,xe=[{count:10,minSpeed:55,maxSpeed:80,minR:14,maxR:22,spawnInterval:.9,burstSize:1},{count:14,minSpeed:75,maxSpeed:105,minR:12,maxR:20,spawnInterval:.7,burstSize:1},{count:18,minSpeed:95,maxSpeed:135,minR:10,maxR:18,spawnInterval:.55,burstSize:1},{count:24,minSpeed:115,maxSpeed:165,minR:9,maxR:16,spawnInterval:.45,burstSize:2},{count:34,minSpeed:135,maxSpeed:200,minR:8,maxR:15,spawnInterval:.32,burstSize:2}];function W(e,l){return e+Math.random()*(l-e)}function Ve(e,l){let o=e-l;for(;o>Math.PI;)o-=2*Math.PI;for(;o<-Math.PI;)o+=2*Math.PI;return o}function $e(e,l,o){return l.active?Math.abs(Ve(e,l.angle))<o/2:!1}function Fe(e,l){const o=W(0,Math.PI*2),s=H+Math.cos(o)*Re,d=O+Math.sin(o)*Re,u=W(e.minSpeed,e.maxSpeed),x=Math.atan2(O-d,H-s),j=W(-.15,.15),b=x+j;return{id:l,x:s,y:d,vx:Math.cos(b)*u,vy:Math.sin(b)*u,radius:W(e.minR,e.maxR),rotation:W(0,Math.PI*2),angularVel:W(-1.6,1.6)}}function Pe(e,l){return{id:e,x:H+Math.cos(l)*(K+6),y:O+Math.sin(l)*(K+6),vx:Math.cos(l)*Le,vy:Math.sin(l)*Le,life:Ye}}function ue(e,l,o,s){const d=.35+Math.min(.2,s*.01);return{id:e,x:l,y:o,life:d,maxLife:d,radius:s}}function We(e){e.startTestTone("speaker","1khz").catch(()=>{}),setTimeout(()=>e.stopTestTone().catch(()=>{}),18)}function qe(e){e.startTestTone("speaker","1khz").catch(()=>{}),setTimeout(()=>e.stopTestTone().catch(()=>{}),30)}function Ke(e){e.startTestTone("speaker","100hz").catch(()=>{}),setTimeout(()=>e.stopTestTone().catch(()=>{}),180)}function Xe(e){e.startTestTone("speaker","100hz").catch(()=>{}),setTimeout(()=>{e.stopTestTone().catch(()=>{}),setTimeout(()=>{e.startTestTone("speaker","1khz").catch(()=>{}),setTimeout(()=>e.stopTestTone().catch(()=>{}),60)},40)},120)}function Je(e){e.startTestTone("speaker","1khz").catch(()=>{}),setTimeout(()=>{e.stopTestTone().catch(()=>{}),setTimeout(()=>{e.startTestTone("speaker","1khz").catch(()=>{}),setTimeout(()=>e.stopTestTone().catch(()=>{}),120)},70)},80)}function Qe(e){const l=[0,90,160,240];l.forEach((o,s)=>{setTimeout(()=>{e.startTestTone("speaker","1khz").catch(()=>{}),setTimeout(()=>e.stopTestTone().catch(()=>{}),s===l.length-1?220:70)},o)})}function Ze(e){e.startTestTone("speaker","100hz").catch(()=>{}),setTimeout(()=>e.stopTestTone().catch(()=>{}),500)}function Se(e=0){return{phase:"TITLE",prevPhase:"TITLE",waveIndex:0,hp:N,asteroids:[],missiles:[],explosions:[],toSpawn:0,spawnTimer:0,r2Cooldown:0,l2Cooldown:0,prevR2:0,prevL2:0,shield1:{active:!1,angle:0},shield2:{active:!1,angle:0},empUses:He,empFlashAt:0,shieldBlockAt:0,missileKillAt:0,baseHitAt:0,score:0,bestScore:e,phaseTimer:0,elapsedMs:0,nextId:1}}function Ee(e,l){const o=xe[l];return{...e,phase:"PLAYING",waveIndex:l,asteroids:[],missiles:[],explosions:[],toSpawn:o.count,spawnTimer:.6,empUses:He,phaseTimer:0}}function et(e,l){switch(l.type){case"START_GAME":return Ee({...Se(e.bestScore),hp:N},0);case"RESTART":return Ee({...Se(e.bestScore),hp:N},0);case"TOGGLE_PAUSE":return e.phase==="PLAYING"?{...e,phase:"PAUSED",prevPhase:"PLAYING"}:e.phase==="PAUSED"?{...e,phase:e.prevPhase,prevPhase:"PLAYING"}:e;case"EMP_PRESS":{if(e.phase!=="PLAYING"||e.empUses<=0)return e;const o=[],s=[...e.explosions];let d=e.nextId,u=0;for(const x of e.asteroids){const j=x.x-H,b=x.y-O;j*j+b*b<fe*fe?(s.push(ue(d++,x.x,x.y,x.radius)),u++):o.push(x)}return{...e,asteroids:o,explosions:s,empUses:e.empUses-1,empFlashAt:performance.now(),score:e.score+u*(e.waveIndex+1)*2,nextId:d}}case"TICK":{if(e.phase==="TITLE"||e.phase==="GAME_OVER"||e.phase==="VICTORY"||e.phase==="PAUSED")return e;const{dt:o,now:s,shield1:d,shield2:u,r2:x,l2:j}=l;if(e.phase==="WAVE_CLEAR"){const a=e.phaseTimer-o;if(a<=0){const r=e.waveIndex+1;if(r>=xe.length){const g=Math.max(e.bestScore,e.score);return{...e,phase:"VICTORY",bestScore:g,phaseTimer:0}}return Ee({...e,hp:Math.min(N,e.hp+1)},r)}return{...e,phaseTimer:a}}const b=xe[e.waveIndex];let w=e.nextId,C=e.toSpawn,_=e.spawnTimer-o;const I=[],G=[],X=[];for(;_<=0&&C>0;){const a=Math.min(b.burstSize,C);for(let r=0;r<a;r++)I.push(Fe(b,w++)),C--;_+=b.spawnInterval}C===0&&(_=0);for(const a of e.explosions){const r=a.life-o;r>0&&G.push({...a,life:r})}let B=e.hp,Y=e.score,J=e.shieldBlockAt,Q=e.baseHitAt,Z=e.missileKillAt;const n=e.waveIndex+1;for(const a of e.asteroids){const r={...a,x:a.x+a.vx*o,y:a.y+a.vy*o,rotation:a.rotation+a.angularVel*o},g=r.x-H,f=r.y-O,L=g*g+f*f;if(L>de*de)continue;const $=(K+r.radius)*(K+r.radius);if(L<$){B=Math.max(0,B-1),Q=s,G.push(ue(w++,r.x,r.y,r.radius*1.3));continue}const A=Math.sqrt(L);if(A<ae+r.radius+ge/2&&A>ae-r.radius-ge/2){const M=Math.atan2(f,g);if($e(M,d,De)||$e(M,u,ze)){G.push(ue(w++,r.x,r.y,r.radius)),Y+=n,J=s;continue}}I.push(r)}let i=Math.max(0,e.r2Cooldown-o),p=Math.max(0,e.l2Cooldown-o);if(x>pe&&e.prevR2<=pe&&i===0&&d.active&&(X.push(Pe(w++,d.angle)),i=Me),j>pe&&e.prevL2<=pe&&p===0&&(u.active||d.active)){const a=u.active?u.angle:d.angle;X.push(Pe(w++,a)),p=Me}const E=X,k=[],R=I.map(()=>!0);for(const a of e.missiles){const r=a.life-o;if(r<=0)continue;const g={...a,x:a.x+a.vx*o,y:a.y+a.vy*o,life:r},f=g.x-H,L=g.y-O;if(f*f+L*L>de*de)continue;let $=!1;for(let A=0;A<I.length;A++){if(!R[A])continue;const S=I[A],M=S.x-g.x,D=S.y-g.y,z=S.radius+Te;if(M*M+D*D<z*z){R[A]=!1,G.push(ue(w++,S.x,S.y,S.radius)),Y+=n*2,Z=s,$=!0;break}}$||E.push(g)}for(let a=0;a<I.length;a++)R[a]&&k.push(I[a]);let T=e.phase,y=e.phaseTimer;return B>0&&C===0&&k.length===0&&E.length===0&&(T="WAVE_CLEAR",y=Ue),B<=0&&(T="GAME_OVER",y=0),{...e,phase:T,phaseTimer:y,hp:B,asteroids:k,missiles:E,explosions:G,toSpawn:C,spawnTimer:_,r2Cooldown:i,l2Cooldown:p,prevR2:x,prevL2:j,shield1:d,shield2:u,shieldBlockAt:J,missileKillAt:Z,baseHitAt:Q,score:Y,elapsedMs:e.phase==="PLAYING"?e.elapsedMs+o*1e3:e.elapsedMs,nextId:w}}default:return e}}const tt=me`
  0%, 100% { opacity: 0.55; }
  50% { opacity: 1; }
`,be=me`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`,st=me`
  0%, 100% { opacity: 0.85; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.12); }
`,nt=me`
  from { background-position: 0 0, 0 0, 0 0; }
  to { background-position: 520px 260px, -260px 520px, 130px -260px; }
`,it=c.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 24px 80px;
`,rt=c.div`
  margin-bottom: 24px;
`,at=c.h1`
  margin-bottom: 4px;
`,ot=c.p`
  color: rgba(191, 204, 214, 0.5);
  font-size: 15px;
  margin: 0;
`,ct=c.div`
  padding: 20px;
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`,lt=c.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  z-index: 10;
`,dt=c.div`
  padding: 6px 14px;
  background: rgba(10, 10, 20, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: rgba(191, 204, 214, 0.7);
  font-size: 12px;
  white-space: nowrap;
`,ht=c.div`
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
`,pt=c.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 0 0 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 13px;
  font-family: "Fira Code", monospace;
  color: rgba(191, 204, 214, 0.7);
`,ye=c.span`
  white-space: nowrap;
`,ut=c.span`
  flex: 1;
`,gt=c.span`
  display: inline-flex;
  gap: 4px;
  align-items: center;
`,ft=c.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${e=>e.$alive?e.$low?"rgba(255, 100, 100, 0.9)":"rgba(100, 220, 140, 0.85)":"rgba(191, 204, 214, 0.15)"};
  box-shadow: ${e=>e.$alive&&e.$low?"0 0 6px rgba(255, 100, 100, 0.6)":"none"};
  transition:
    background 0.2s,
    box-shadow 0.2s;
`,xt=c.div`
  position: relative;
  width: ${q}px;
  height: ${q}px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.06);
  cursor: ${e=>e.$locked?"none":"pointer"};
  background:
    radial-gradient(circle at 20% 25%, rgba(255, 255, 255, 0.5) 0.5px, transparent 1px),
    radial-gradient(circle at 70% 60%, rgba(255, 255, 255, 0.4) 0.5px, transparent 1px),
    radial-gradient(circle at 35% 80%, rgba(255, 255, 255, 0.3) 0.5px, transparent 1px),
    radial-gradient(
      circle at center,
      rgba(15, 20, 40, 0.95),
      rgba(8, 10, 22, 1) 70%
    );
  background-size:
    260px 260px,
    260px 260px,
    260px 260px,
    auto;
  overflow: hidden;
  max-width: 100%;

  @media (max-width: 600px) {
    width: 100%;
    height: auto;
    aspect-ratio: 1 / 1;
  }

  animation: ${nt} 60s linear infinite;
`,mt=c.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 8px;
  min-height: 24px;
`,bt=c.div`
  padding: 4px 10px;
  background: rgba(10, 10, 20, 0.85);
  border: 1px solid rgba(72, 175, 240, 0.3);
  border-radius: 14px;
  font-size: 11px;
  color: rgba(72, 175, 240, 0.85);
  font-family: "Fira Code", monospace;
  white-space: nowrap;
`,vt=c.div`
  position: absolute;
  left: 50%;
  top: 50%;
  width: ${ae*2}px;
  height: ${ae*2}px;
  border-radius: 50%;
  border: 1px dashed rgba(72, 175, 240, 0.15);
  transform: translate(-50%, -50%);
  pointer-events: none;
`,Et=c.div`
  position: absolute;
  left: 50%;
  top: 50%;
  width: ${K*2}px;
  height: ${K*2}px;
  border-radius: 50%;
  background: radial-gradient(
    circle at center,
    rgba(120, 180, 255, 0.35),
    rgba(40, 80, 180, 0.2) 70%,
    transparent
  );
  border: 1px solid rgba(120, 180, 255, 0.45);
  transform: translate(-50%, -50%);
  pointer-events: none;
  box-shadow:
    0 0 12px rgba(72, 175, 240, 0.3),
    inset 0 0 8px rgba(120, 180, 255, 0.25);
`,yt=c.div`
  position: absolute;
  left: 50%;
  top: 50%;
  width: ${ke*2}px;
  height: ${ke*2}px;
  border-radius: 50%;
  background: ${e=>e.$hpRatio>.6?"radial-gradient(circle, rgba(100, 255, 180, 0.95), rgba(0, 180, 120, 0.5))":e.$hpRatio>.3?"radial-gradient(circle, rgba(255, 220, 100, 0.95), rgba(200, 140, 0, 0.55))":"radial-gradient(circle, rgba(255, 100, 100, 0.95), rgba(200, 40, 40, 0.6))"};
  pointer-events: none;
  animation: ${st} 1.6s ease-in-out infinite;
`,At=c.div`
  position: absolute;
  width: ${e=>e.$radius*2}px;
  height: ${e=>e.$radius*2}px;
  border-radius: 45% 55% 40% 60% / 50% 45% 55% 50%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(180, 170, 160, 0.9),
    rgba(110, 100, 95, 0.85) 60%,
    rgba(70, 60, 55, 0.85)
  );
  border: 1px solid rgba(60, 50, 45, 0.6);
  pointer-events: none;
  box-shadow:
    inset 2px 2px 4px rgba(255, 255, 255, 0.12),
    inset -3px -3px 6px rgba(0, 0, 0, 0.45);
`,wt=c.div`
  position: absolute;
  width: ${Te*2}px;
  height: ${Te*2}px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 200, 1),
    rgba(255, 180, 60, 0.9) 60%,
    rgba(255, 100, 40, 0.2)
  );
  box-shadow:
    0 0 6px rgba(255, 200, 100, 0.9),
    0 0 12px rgba(255, 160, 60, 0.5);
  pointer-events: none;
  transform: translate(-50%, -50%);
`,Tt=c.div`
  position: absolute;
  width: ${e=>e.$radius*2}px;
  height: ${e=>e.$radius*2}px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 220, 160, ${e=>.9*(1-e.$progress)}),
    rgba(255, 120, 60, ${e=>.6*(1-e.$progress)}) 60%,
    transparent
  );
  transform: translate(-50%, -50%)
    scale(${e=>.8+e.$progress*1.4});
  pointer-events: none;
`,St=c.div`
  position: absolute;
  left: 50%;
  top: 50%;
  width: ${fe*2}px;
  height: ${fe*2}px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(120, 220, 255, ${e=>e.$alpha*.5}),
    rgba(72, 175, 240, ${e=>e.$alpha*.3}) 60%,
    transparent
  );
  border: 2px solid rgba(120, 220, 255, ${e=>e.$alpha});
  transform: translate(-50%, -50%);
  pointer-events: none;
`,jt=c.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`,ie=c.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  background: ${e=>e.$dim?"rgba(0, 0, 0, 0.55)":"transparent"};
  z-index: 5;
  pointer-events: none;
`,It=c.div`
  font-size: 30px;
  font-weight: 700;
  color: rgba(191, 204, 214, 0.9);
  letter-spacing: 4px;
  margin-bottom: 16px;
  animation: ${be} 0.4s ease;
`,re=c.div`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.55);
  line-height: 1.7;
  margin-bottom: 24px;
  font-family: "Fira Code", monospace;
`,Ae=c.div`
  font-size: 14px;
  color: rgba(72, 175, 240, 0.8);
  animation: ${tt} 1.6s ease-in-out infinite;
`,kt=c.div`
  font-size: 24px;
  font-weight: 700;
  color: rgba(255, 60, 60, 0.9);
  letter-spacing: 3px;
  margin-bottom: 8px;
  animation: ${be} 0.4s ease;
`,Rt=c.div`
  font-size: 24px;
  font-weight: 700;
  color: rgba(0, 230, 120, 0.9);
  letter-spacing: 2px;
  animation: ${be} 0.3s ease;
`,Lt=c.div`
  font-size: 30px;
  font-weight: 700;
  color: #f29e02;
  letter-spacing: 4px;
  margin-bottom: 12px;
  animation: ${be} 0.4s ease;
`,Mt=c.div`
  font-size: 22px;
  font-weight: 600;
  color: rgba(191, 204, 214, 0.85);
  letter-spacing: 3px;
`,$t=c.div`
  font-size: 28px;
  font-weight: 700;
  color: #48aff0;
  font-family: "Fira Code", monospace;
  margin: 6px 0;
`,Pt=c.div`
  display: flex;
  gap: 14px;
  font-size: 11px;
  font-family: "Fira Code", monospace;
  color: rgba(191, 204, 214, 0.4);
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
`,Ct=c.div`
  margin-top: 32px;
  color: rgba(191, 204, 214, 0.65);
  font-size: 14px;
  line-height: 1.65;
`,we=c.h3`
  color: rgba(191, 204, 214, 0.85);
  font-size: 15px;
  margin: 24px 0 8px;
  &:first-child {
    margin-top: 0;
  }
`,Ce=c.ul`
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
`;function _e(e,l){const o=e-l/2,s=e+l/2,d=ae,u=H+Math.cos(o)*d,x=O+Math.sin(o)*d,j=H+Math.cos(s)*d,b=O+Math.sin(s)*d,w=l>Math.PI?1:0;return`M ${u} ${x} A ${d} ${d} 0 ${w} 1 ${j} ${b}`}const zt=()=>{var Z;const e=h.useContext(Ne),[l,o]=h.useState(!!((Z=e==null?void 0:e.connection)!=null&&Z.state)),[s,d]=h.useReducer(et,void 0,()=>Se(0)),u=h.useRef(s);u.current=s;const x=h.useRef(0),j=h.useRef("TITLE"),b=h.useRef(0),w=h.useRef(0),C=h.useRef(0),_=h.useRef(null),[I,G]=h.useState(!1),[,X]=h.useState(0);h.useEffect(()=>{const n=()=>{G(document.pointerLockElement===_.current)};return document.addEventListener("pointerlockchange",n),()=>{document.removeEventListener("pointerlockchange",n),document.pointerLockElement===_.current&&document.exitPointerLock()}},[]),h.useEffect(()=>{if(!I)return;const n=document.body.style.overflow,i=document.documentElement.style.overflow;document.body.style.overflow="hidden",document.documentElement.style.overflow="hidden";const p=E=>E.preventDefault();return window.addEventListener("wheel",p,{passive:!1,capture:!0}),window.addEventListener("touchmove",p,{passive:!1,capture:!0}),()=>{document.body.style.overflow=n,document.documentElement.style.overflow=i,window.removeEventListener("wheel",p,{capture:!0}),window.removeEventListener("touchmove",p,{capture:!0})}},[I]);const B=()=>{var i;const n=_.current;!n||document.pointerLockElement===n||(i=n.requestPointerLock)==null||i.call(n)};h.useEffect(()=>{if(!(e!=null&&e.connection))return;const n=()=>o(!!e.connection.state);return n(),e.connection.on("change",n),()=>{e.connection.removeListener("change",n)}},[e]),h.useEffect(()=>{if(!(e!=null&&e.cross))return;const n=()=>{const{phase:i}=u.current;i==="TITLE"?d({type:"START_GAME"}):(i==="GAME_OVER"||i==="VICTORY")&&d({type:"RESTART"})};return e.cross.on("press",n),()=>{e.cross.off("press",n)}},[e]),h.useEffect(()=>{if(!(e!=null&&e.triangle))return;const n=()=>{const{phase:i}=u.current;(i==="PLAYING"||i==="PAUSED")&&d({type:"TOGGLE_PAUSE"})};return e.triangle.on("press",n),()=>{e.triangle.off("press",n)}},[e]),h.useEffect(()=>{var i;if(!((i=e==null?void 0:e.touchpad)!=null&&i.button))return;const n=()=>d({type:"EMP_PRESS"});return e.touchpad.button.on("press",n),()=>{e.touchpad.button.off("press",n)}},[e]),h.useEffect(()=>{if(!(e!=null&&e.touchpad)||!["PLAYING","WAVE_CLEAR"].includes(s.phase))return;let i=performance.now(),p=0,E=0,k=0,R=0;const T=1e3/60;let y=0;const a=r=>{var L,$,A,S,M,D,z,ee,te,se,U,P,ne,oe,ce,V,le;const g=r-i;for(i=r,y=Math.min(y+g,T*3);y>=T;){const v=e.touchpad.left,m=e.touchpad.right,F={active:((L=v==null?void 0:v.contact)==null?void 0:L.active)&&((v==null?void 0:v.magnitude)??0)>.08,angle:v?v.angle:0},Oe={active:(($=m==null?void 0:m.contact)==null?void 0:$.active)&&((m==null?void 0:m.magnitude)??0)>.08,angle:m?m.angle:0},Ge=((S=(A=e.right)==null?void 0:A.trigger)==null?void 0:S.state)??0,Be=((D=(M=e.left)==null?void 0:M.trigger)==null?void 0:D.state)??0;d({type:"TICK",dt:1/60,now:r,shield1:F,shield2:Oe,r2:Ge,l2:Be}),y-=T}const f=u.current;if(r-p>100&&(p=r,f.phase),r-E>100&&(E=r,f.phase==="PLAYING"||f.phase==="WAVE_CLEAR")){const v=(r-f.empFlashAt)/1e3;if(v<he){const m=1-v/he;(z=e.lightbar)==null||z.set({r:Math.round(120+60*m),g:Math.round(200+55*m),b:255})}else{const m=f.hp/N;if(m>.6)(ee=e.lightbar)==null||ee.set({r:20,g:200,b:80});else if(m>.3)(te=e.lightbar)==null||te.set({r:220,g:160,b:0});else if(m>.2)(se=e.lightbar)==null||se.set({r:220,g:60,b:30});else{const F=Math.floor(r/180)%2;(U=e.lightbar)==null||U.set(F===0?{r:255,g:0,b:0}:{r:60,g:0,b:0})}}}r-k>200&&(k=r,f.phase==="PLAYING"&&((oe=(ne=(P=e.right)==null?void 0:P.trigger)==null?void 0:ne.feedback)==null||oe.set({effect:ve.TriggerEffect.Weapon,start:.35,end:.55,strength:.7}),(le=(V=(ce=e.left)==null?void 0:ce.trigger)==null?void 0:V.feedback)==null||le.set({effect:ve.TriggerEffect.Weapon,start:.35,end:.55,strength:.55}))),r-R>16&&(R=r,X(v=>(v+1)%1e6)),x.current=requestAnimationFrame(a)};return x.current=requestAnimationFrame(a),()=>{var r;cancelAnimationFrame(x.current),(r=e.right)==null||r.rumble(0)}},[e,s.phase]),h.useEffect(()=>{var n;if(e&&s.shieldBlockAt!==b.current&&s.shieldBlockAt!==0){const i=b.current;b.current=s.shieldBlockAt,s.shieldBlockAt-i>60&&(We(e),(n=e.right)==null||n.rumble(.35),setTimeout(()=>{var p;u.current.phase==="PLAYING"&&((p=e.right)==null||p.rumble(0))},50))}},[e,s.shieldBlockAt]),h.useEffect(()=>{var n;if(e&&s.missileKillAt!==w.current&&s.missileKillAt!==0){const i=w.current;w.current=s.missileKillAt,s.missileKillAt-i>60&&(qe(e),(n=e.right)==null||n.rumble(.3),setTimeout(()=>{var p;u.current.phase==="PLAYING"&&((p=e.right)==null||p.rumble(0))},40))}},[e,s.missileKillAt]),h.useEffect(()=>{var n;e&&s.baseHitAt!==C.current&&s.baseHitAt!==0&&(C.current=s.baseHitAt,Ke(e),(n=e.right)==null||n.rumble(.75),setTimeout(()=>{var i;u.current.phase==="PLAYING"&&((i=e.right)==null||i.rumble(0))},180))},[e,s.baseHitAt]),h.useEffect(()=>{if(!(e!=null&&e.playerLeds))return;const n=s.phase==="VICTORY"?5:s.phase==="TITLE"||s.phase==="GAME_OVER"?0:s.waveIndex+1;for(let i=0;i<5;i++)e.playerLeds.setLed(i,i<n)},[e,s.waveIndex,s.phase]),h.useEffect(()=>{e!=null&&e.mute&&(s.phase==="PLAYING"&&s.hp<=1?e.mute.setLed(ve.MuteLedMode.Pulse):e.mute.resetLed())},[e,s.hp,s.phase]),h.useEffect(()=>{var i;if(!e||s.empFlashAt===0)return;Xe(e),(i=e.right)==null||i.rumble(.6);const n=setTimeout(()=>{var p;u.current.phase==="PLAYING"&&((p=e.right)==null||p.rumble(0))},220);return()=>clearTimeout(n)},[e,s.empFlashAt]),h.useEffect(()=>{var p,E,k,R,T,y,a,r,g,f,L,$,A,S,M,D,z,ee,te,se;if(!e)return;const n=j.current,i=s.phase;if(j.current=i,n!==i){if(i==="WAVE_CLEAR"){Je(e),(p=e.lightbar)==null||p.set({r:255,g:255,b:255}),(E=e.right)==null||E.rumble(.35);const U=setTimeout(()=>{var P;(P=e.right)==null||P.rumble(0)},260);return()=>clearTimeout(U)}if(i==="VICTORY"){Qe(e);const U=performance.now();let P=0;const ne=ce=>{var F;const V=(ce-U)/1e3,le=Math.round(128+127*Math.sin(V*2)),v=Math.round(128+127*Math.sin(V*2+2.094)),m=Math.round(128+127*Math.sin(V*2+4.188));(F=e.lightbar)==null||F.set({r:le,g:v,b:m}),P=requestAnimationFrame(ne)};P=requestAnimationFrame(ne);const oe=setTimeout(()=>{cancelAnimationFrame(P)},4e3);return()=>{cancelAnimationFrame(P),clearTimeout(oe)}}i==="GAME_OVER"&&(Ze(e),(k=e.right)==null||k.rumble(0),(y=(T=(R=e.left)==null?void 0:R.trigger)==null?void 0:T.feedback)==null||y.reset(),(g=(r=(a=e.right)==null?void 0:a.trigger)==null?void 0:r.feedback)==null||g.reset(),(f=e.lightbar)==null||f.set({r:80,g:0,b:0}),(L=e.mute)==null||L.resetLed()),i==="TITLE"&&(($=e.right)==null||$.rumble(0),(M=(S=(A=e.left)==null?void 0:A.trigger)==null?void 0:S.feedback)==null||M.reset(),(ee=(z=(D=e.right)==null?void 0:D.trigger)==null?void 0:z.feedback)==null||ee.reset(),(te=e.lightbar)==null||te.set({r:20,g:30,b:80}),(se=e.mute)==null||se.resetLed())}},[e,s.phase]),h.useEffect(()=>()=>{var n,i,p,E,k,R,T,y,a,r,g,f;(p=(i=(n=e==null?void 0:e.right)==null?void 0:n.trigger)==null?void 0:i.feedback)==null||p.reset(),(R=(k=(E=e==null?void 0:e.left)==null?void 0:E.trigger)==null?void 0:k.feedback)==null||R.reset(),(T=e==null?void 0:e.left)==null||T.rumble(0),(y=e==null?void 0:e.right)==null||y.rumble(0),(a=e==null?void 0:e.lightbar)==null||a.set({r:0,g:0,b:255}),(r=e==null?void 0:e.playerLeds)==null||r.clear(),(g=e==null?void 0:e.mute)==null||g.resetLed(),(f=e==null?void 0:e.stopTestTone())==null||f.catch(()=>{}),cancelAnimationFrame(x.current)},[e]);const Y=!je||!l,J=je?l?null:"Connect a controller to play":"Requires WebHID (Chrome, Edge, Opera)",Q=(()=>{if(s.empFlashAt===0)return 0;const n=(performance.now()-s.empFlashAt)/1e3;return n>he?0:1-n/he})();return t.jsxs(it,{children:[t.jsxs(rt,{children:[t.jsx(at,{children:"Orbit Defense"}),t.jsx(ot,{children:"Slide your thumb around the touchpad to orbit a shield around the base. Stop the asteroids."})]}),t.jsxs(ct,{children:[J&&t.jsx(lt,{children:t.jsx(dt,{children:J})}),t.jsxs(ht,{$inactive:Y,children:[t.jsxs(pt,{children:[t.jsxs(ye,{children:["Wave ",s.waveIndex+1,"/",xe.length]}),t.jsxs(ye,{children:["Score ",s.score]}),t.jsxs(ye,{children:["EMP ",s.empUses]}),t.jsx(ut,{}),t.jsx(gt,{title:"Base HP",children:Array.from({length:N},(n,i)=>t.jsx(ft,{$alive:i<s.hp,$low:s.hp<=1&&i<s.hp},i))})]}),t.jsx(mt,{children:!I&&!Y&&t.jsx(bt,{children:"click to lock cursor · Esc to release"})}),t.jsxs(xt,{ref:_,$locked:I,onClick:B,children:[t.jsx(vt,{}),Q>0&&t.jsx(St,{$alpha:Q}),s.asteroids.map(n=>t.jsx(At,{$radius:n.radius,style:{left:`${n.x}px`,top:`${n.y}px`,transform:`translate(-50%, -50%) rotate(${n.rotation}rad)`}},`a-${n.id}`)),s.missiles.map(n=>t.jsx(wt,{style:{left:`${n.x}px`,top:`${n.y}px`}},`m-${n.id}`)),s.explosions.map(n=>t.jsx(Tt,{$progress:1-n.life/n.maxLife,$radius:n.radius*2.2,style:{left:`${n.x}px`,top:`${n.y}px`}},`e-${n.id}`)),t.jsx(Et,{}),t.jsx(yt,{$hpRatio:s.hp/N}),t.jsxs(jt,{viewBox:`0 0 ${q} ${q}`,children:[s.shield1.active&&t.jsx("path",{d:_e(s.shield1.angle,De),stroke:"rgba(72, 175, 240, 0.9)",strokeWidth:ge,strokeLinecap:"round",fill:"none",style:{filter:"drop-shadow(0 0 6px rgba(72, 175, 240, 0.7))"}}),s.shield2.active&&t.jsx("path",{d:_e(s.shield2.angle,ze),stroke:"rgba(200, 140, 255, 0.9)",strokeWidth:ge,strokeLinecap:"round",fill:"none",style:{filter:"drop-shadow(0 0 6px rgba(200, 140, 255, 0.65))"}})]}),s.phase==="TITLE"&&t.jsxs(ie,{$dim:!0,children:[t.jsx(It,{children:"ORBIT DEFENSE"}),t.jsxs(re,{children:["Slide your thumb around the touchpad to orbit a shield",t.jsx("br",{}),"Two fingers = two shields · R2 / L2 fire missiles",t.jsx("br",{}),"Click the touchpad for an EMP pulse · Triangle pauses"]}),t.jsx(Ae,{children:"Press × to start"}),s.bestScore>0&&t.jsxs(re,{style:{marginTop:16,marginBottom:0},children:["Best: ",s.bestScore]})]}),s.phase==="WAVE_CLEAR"&&t.jsx(ie,{children:t.jsxs(Rt,{children:["WAVE ",s.waveIndex+1," CLEAR"]})}),s.phase==="PAUSED"&&t.jsxs(ie,{$dim:!0,children:[t.jsx(Mt,{children:"PAUSED"}),t.jsx(re,{style:{marginTop:16},children:"Triangle to resume"})]}),s.phase==="GAME_OVER"&&t.jsxs(ie,{$dim:!0,children:[t.jsx(kt,{children:"BASE DESTROYED"}),t.jsxs(re,{children:["Reached wave ",s.waveIndex+1,t.jsx("br",{}),"Score ",s.score]}),t.jsx(Ae,{children:"Press × to try again"})]}),s.phase==="VICTORY"&&t.jsxs(ie,{$dim:!0,children:[t.jsx(Lt,{children:"ALL WAVES CLEARED"}),t.jsx($t,{children:s.score}),t.jsx(re,{children:s.bestScore>0&&s.score===s.bestScore?"New best score!":s.bestScore>0?`Best: ${s.bestScore}`:" "}),t.jsx(Ae,{children:"Press × to play again"})]})]}),(s.phase==="PLAYING"||s.phase==="WAVE_CLEAR"||s.phase==="PAUSED")&&t.jsxs(Pt,{children:[t.jsxs("span",{children:["Shields"," ",s.shield1.active?"●":"○",s.shield2.active?"●":"○"]}),t.jsxs("span",{children:["Asteroids ",s.asteroids.length]}),t.jsxs("span",{children:["Missiles ",s.missiles.length]}),s.bestScore>0&&t.jsxs("span",{children:["Best ",s.bestScore]})]})]})]}),t.jsxs(Ct,{children:[t.jsx(we,{children:"Controller Features"}),t.jsxs(Ce,{children:[t.jsxs("li",{children:[t.jsx("strong",{children:"Touchpad as a dial"})," - the touchpad is mapped like an analog stick, with ",t.jsx("code",{children:"[0,0]"})," at the center."," ",t.jsx("code",{children:"controller.touchpad.left.angle"})," gives the thumb's angle from center - we use it directly as the shield's orbit angle around the base."]}),t.jsxs("li",{children:[t.jsx("strong",{children:"Multi-touch"})," - the second finger drives"," ",t.jsx("code",{children:".touchpad.right"})," as an independent input, lighting a second, narrower shield on a separate arc. One-thumb play is fully viable; two-thumb play lets you cover both sides at once."]}),t.jsxs("li",{children:[t.jsx("strong",{children:"Physical click"})," —"," ",t.jsx("code",{children:"controller.touchpad.button"})," is a proper"," ",t.jsx("code",{children:"Momentary"}),". Its ",t.jsx("code",{children:"press"})," event fires an EMP pulse that clears all asteroids currently within the shield ring - click is kept distinct from touch, so resting your thumb won't trigger it."]}),t.jsxs("li",{children:[t.jsx("strong",{children:"Adaptive triggers"})," - both triggers use"," ",t.jsx("code",{children:"TriggerEffect.Weapon"})," for a satisfying click-stop firing feel. R2 launches a missile along the primary shield's angle, L2 along the secondary. Edge-triggered on the rising pull, with a short cooldown."]}),t.jsxs("li",{children:[t.jsx("strong",{children:"Lightbar"})," - base HP at a glance: green → yellow → red, flashing red at 1 HP. Bright cyan pulse on EMP, white on wave clear, rainbow cycle on victory."]}),t.jsxs("li",{children:[t.jsx("strong",{children:"Rumble (right motor only)"})," - brief taps on each shield block or missile kill, a harder thump when an asteroid reaches the base, and an EMP thump on touchpad click. The left motor is deliberately unused so nothing blurs the feel of tracking the dial."]}),t.jsxs("li",{children:[t.jsx("strong",{children:"Player LEDs"})," - current wave (1..5). All lit on VICTORY."]}),t.jsxs("li",{children:[t.jsx("strong",{children:"Mute LED"}),' - pulses when the base is down to its last HP - a peripheral "danger" cue.']}),t.jsxs("li",{children:[t.jsx("strong",{children:"Speaker"})," - 1kHz click on shield blocks, a shorter pop on missile kills, 100Hz thud on base hits, EMP low- then-high burst, dual-tone wave clear, four-note victory fanfare."]})]}),t.jsx(we,{children:"Implementation Notes"}),t.jsxs("p",{children:[t.jsx("code",{children:"Touchpad"})," in dualsense-ts exposes each touch as a"," ",t.jsx("code",{children:"Touch"})," that extends ",t.jsx("code",{children:"Analog"}),", so"," ",t.jsx("code",{children:".angle"}),", ",t.jsx("code",{children:".magnitude"}),", and"," ",t.jsx("code",{children:".deadzone"})," are all available on individual contacts; no raw coordinate math required. The physical pad click is a separate"," ",t.jsx("code",{children:"Momentary"}),", so touch and click are cleanly distinguishable."]}),t.jsx(Ie,{code:`// Read both touches as independent dials.
const l = controller.touchpad.left;
const r = controller.touchpad.right;

// Touchpad Y is mapped screen-convention in the library
// (top of pad = -1, bottom = +1), so .angle is already screen-space.
const shield1 = {
  active: l.contact.active && l.magnitude > 0.08,
  angle: l.angle,
};
const shield2 = {
  active: r.contact.active && r.magnitude > 0.08,
  angle: r.angle,
};

// Physical click is a separate Momentary event - distinct from touch.
controller.touchpad.button.on("press", () => {
  dispatch({ type: "EMP_PRESS" });
});`}),t.jsx("p",{children:`Shield-vs-asteroid collision checks a band of the shield ring (thickness ≈ asteroid radius) and asks whether the asteroid's angle from the base falls inside the current shield arc. Missiles fire along the shield angle, giving a "your thumb aims the turret" feel even though the ship stays still.`}),t.jsx(Ie,{code:`// Shield arc hit test - signed angle difference mod 2π.
function angleDiff(a, b) {
  let d = a - b;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return d;
}

for (const ast of asteroids) {
  const dx = ast.x - CENTER_X;
  const dy = ast.y - CENTER_Y;
  const dist = Math.hypot(dx, dy);
  if (Math.abs(dist - SHIELD_RING_RADIUS) < ast.radius) {
    const astAngle = Math.atan2(dy, dx);
    if (Math.abs(angleDiff(astAngle, shield1.angle)) < SHIELD_ARC_1 / 2) {
      // Blocked by primary shield.
    }
  }
}`}),t.jsxs("p",{children:['Five waves of escalating difficulty. Wave configuration lives as a single array at the top of the file; tuning difficulty is one-line edits. Asteroid spawning uses a spawn-interval + burst-size pattern so late waves feel swarmy without the reducer doing anything more complex than "queue up ',t.jsx("code",{children:"count"}),' asteroids and dispense them on a timer".']}),t.jsx(we,{children:"Interacting with the OS cursor"}),t.jsx("p",{children:"On most platforms the DualSense touchpad also drives the OS mouse cursor and two-finger gestures emit scroll events - that's a great default for desktop use, but for a browser game that reads the touchpad directly it makes the cursor drift across the screen and the page scroll away under you. We mitigate with two standard browser APIs, both scoped to the arena element:"}),t.jsxs(Ce,{children:[t.jsxs("li",{children:[t.jsx("code",{children:"element.requestPointerLock()"})," - captures the cursor on click. Mouse events still fire but cursor position is frozen and hidden. ",t.jsx("code",{children:"Esc"})," releases."]}),t.jsxs("li",{children:["While locked, we set ",t.jsx("code",{children:'document.body.style.overflow = "hidden"'})," ","and add a ",t.jsx("code",{children:"wheel"})," listener with"," ",t.jsx("code",{children:"preventDefault()"})," on the arena - this stops the page-scroll that two-finger-drag would otherwise produce."]})]}),t.jsxs("p",{children:["Both are restored on release and on unmount. The touchpad HID stream is untouched by any of this - ",t.jsx("code",{children:"controller.touchpad"})," ","still reads normally, because it's coming from the WebHID interface, not the mouse-emulation layer."]})]})]})};export{zt as default};
