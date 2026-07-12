import{a as b,C as Oe,d as ae,j as s,g as a,h as Re,E as pe}from"./index-B3Vc337h.js";import{C as Le}from"./CodeBlock-C5O9LPzb.js";const ce=520,ne=400,d=40,we=ce/d,Se=ne/d,C=7,Me=1400,Ne=.985,le=520,z=.35,_=Math.PI/4,Ve=.04,ze=5,xe=12,he=16,ke=5,Ye=1.4,Ie=1,be=[["#############","#S..........#","#.#########.#","#...........#","#.#########.#","#...........#","#.#########.#","#...........#","#..........G#","#############"],["#############","#S....#.....#","#.###.#.###.#","#.#.......#.#","#.#.#####.#.#","#...#.......#","###.#.###.#.#","#...#.#.#...#","#.###.#.#..G#","#############"],["#############","#S.......o..#","#.#########.#","#.....o.....#","#.#######.#.#","#.#.......#.#","#.#.#####.#.#","#...#.o.....#","#.o.#......G#","#############"],["#############","#S..o......o#","#.#.#.###.#.#","#...#...#...#","#.#.###.###.#","#.#...o.....#","#.#.#####.#.#","#.#.#...#.#o#","#...o.#...#G#","#############"],["#############","#S#.......#G#","#.#.#####.#.#","#.#.#o..#.#.#","#...#.#.#.#.#","###.###.#.#.#","#..o....#.#.#","#.#######.#.#","#....o......#","#############"]];function S(e,l,o){return Math.max(l,Math.min(o,e))}function de(e,l){return`${e},${l}`}function qe(e){const l=new Set,o=[],t=[];let f={x:ce/2,y:ne/2},u={x:ce-d*1.5,y:ne-d*1.5};for(let h=0;h<Math.min(e.length,Se);h++){const x=e[h];for(let p=0;p<Math.min(x.length,we);p++){const g=x[p],n=p*d+d/2,v=h*d+d/2;g==="#"?(l.add(de(p,h)),o.push({col:p,row:h})):g==="o"?t.push({x:n,y:v,r:xe}):g==="S"?f={x:n,y:v}:g==="G"&&(u={x:n,y:v})}}return{walls:l,wallCells:o,holes:t,start:f,goal:u}}function Fe(e){const l=Math.floor(e.start.x/d),o=Math.floor(e.start.y/d),t=Math.floor(e.goal.x/d),f=Math.floor(e.goal.y/d),u=new Set([de(l,o)]),h=[[l,o]];for(;h.length;){const[x,p]=h.shift();if(x===t&&p===f)return!0;for(const[g,n]of[[1,0],[-1,0],[0,1],[0,-1]]){const v=x+g,T=p+n;if(v<0||v>=we||T<0||T>=Se)continue;const A=de(v,T);u.has(A)||e.walls.has(A)||(u.add(A),h.push([v,T]))}}return!1}const G=be.map(qe);G.forEach((e,l)=>{Fe(e)||console.error(`[Tilt Maze] Level ${l+1} is unsolvable: goal unreachable from start.`)});function re(e){return{x:e.x,y:e.y,vx:0,vy:0}}function He(e,l){let o=!1;const t=Math.floor(e.x/d),f=Math.floor(e.y/d);for(let u=-1;u<=1;u++)for(let h=-1;h<=1;h++){const x=t+h,p=f+u;if(!l.has(de(x,p)))continue;const g=x*d,n=p*d,v=S(e.x,g,g+d),T=S(e.y,n,n+d),A=e.x-v,k=e.y-T,$=A*A+k*k;if($<C*C)if(o=!0,$===0){const L=e.x-g,R=g+d-e.x,i=e.y-n,r=n+d-e.y,c=Math.min(L,R,i,r);c===L?(e.x=g-C,e.vx=-Math.abs(e.vx)*z):c===R?(e.x=g+d+C,e.vx=Math.abs(e.vx)*z):c===i?(e.y=n-C,e.vy=-Math.abs(e.vy)*z):(e.y=n+d+C,e.vy=Math.abs(e.vy)*z)}else{const L=Math.sqrt($),R=A/L,i=k/L,r=C-L;e.x+=R*r,e.y+=i*r;const c=e.vx*R+e.vy*i;c<0&&(e.vx-=(1+z)*c*R,e.vy-=(1+z)*c*i)}}return{hit:o}}function Ue(e,l){let o=1/0;for(const t of l){const f=t.x-e.x,u=t.y-e.y,h=Math.sqrt(f*f+u*u)-t.r;h<o&&(o=h)}return o}function Be(e,l){const o=Math.min(1,Math.sqrt(e*e+l*l)/_);if(o<.02)return{r:20,g:30,b:60};const t=S(l/_,-1,1),f=S(e/_,-1,1);let u=128+t*127-f*40,h=128-Math.abs(t)*40-f*40,x=128-t*127+f*80;u=S(u,10,255),h=S(h,10,255),x=S(x,10,255);const p=.3+o*.7;return{r:Math.round(u*p),g:Math.round(h*p),b:Math.round(x*p)}}function We(e){e.startTestTone("speaker","1khz").catch(()=>{}),setTimeout(()=>e.stopTestTone().catch(()=>{}),12)}function Xe(e){e.startTestTone("speaker","100hz").catch(()=>{}),setTimeout(()=>e.stopTestTone().catch(()=>{}),140)}function Ke(e){e.startTestTone("speaker","1khz").catch(()=>{}),setTimeout(()=>{e.stopTestTone().catch(()=>{}),setTimeout(()=>{e.startTestTone("speaker","1khz").catch(()=>{}),setTimeout(()=>e.stopTestTone().catch(()=>{}),80)},80)},60)}function Ze(e){e.startTestTone("speaker","1khz").catch(()=>{}),setTimeout(()=>{e.stopTestTone().catch(()=>{}),setTimeout(()=>{e.startTestTone("speaker","1khz").catch(()=>{}),setTimeout(()=>{e.stopTestTone().catch(()=>{}),setTimeout(()=>{e.startTestTone("speaker","1khz").catch(()=>{}),setTimeout(()=>e.stopTestTone().catch(()=>{}),200)},60)},50)},50)},50)}function me(e=0){const l=G[0];return{phase:"TITLE",prevPhase:"TITLE",levelIndex:0,ball:re(l.start),lives:ke,phaseTimer:0,deathProgress:0,neutralPitch:0,neutralRoll:0,effectivePitch:0,effectiveRoll:0,wallHitAt:0,bestTimeMs:e,elapsedMs:0,ballSpeed:0}}function Je(e,l){switch(l.type){case"START_GAME":{const o=G[0];return{...me(e.bestTimeMs),phase:"PLAYING",levelIndex:0,ball:re(o.start),neutralPitch:e.neutralPitch,neutralRoll:e.neutralRoll}}case"RESTART":return{...me(e.bestTimeMs),neutralPitch:e.neutralPitch,neutralRoll:e.neutralRoll};case"RECENTER":return{...e,neutralPitch:l.tiltPitch,neutralRoll:l.tiltRoll};case"TOGGLE_PAUSE":return e.phase==="PLAYING"?{...e,phase:"PAUSED",prevPhase:"PLAYING"}:e.phase==="PAUSED"?{...e,phase:e.prevPhase,prevPhase:"PLAYING"}:e;case"SKIP_DEATH":{if(e.phase!=="DEAD")return e;if(e.lives<=0)return{...e,phase:"GAME_OVER",phaseTimer:0};const o=G[e.levelIndex];return{...e,phase:"PLAYING",phaseTimer:0,deathProgress:0,ball:re(o.start)}}case"TICK":{if(e.phase==="TITLE"||e.phase==="GAME_OVER"||e.phase==="VICTORY"||e.phase==="PAUSED")return e;const{dt:o,now:t,tiltPitch:f,tiltRoll:u,r2:h}=l;if(e.phase==="LEVEL_CLEAR"){const r=e.phaseTimer-o;if(r<=0){const c=e.levelIndex+1;if(c>=be.length){const I=e.bestTimeMs===0?e.elapsedMs:Math.min(e.bestTimeMs,e.elapsedMs);return{...e,phase:"VICTORY",phaseTimer:0,bestTimeMs:I}}const y=G[c];return{...e,phase:"PLAYING",phaseTimer:0,levelIndex:c,ball:re(y.start)}}return{...e,phaseTimer:r}}if(e.phase==="DEAD"){const r=e.phaseTimer-o,c=Math.min(1,1-r/Ie);if(r<=0){if(e.lives<=0)return{...e,phase:"GAME_OVER",phaseTimer:0};const y=G[e.levelIndex];return{...e,phase:"PLAYING",phaseTimer:0,deathProgress:0,ball:re(y.start)}}return{...e,phaseTimer:r,deathProgress:c}}const x=G[e.levelIndex],p=S(f-e.neutralPitch,-_,_),g=S(u-e.neutralRoll,-_,_),n={x:e.ball.x,y:e.ball.y,vx:e.ball.vx,vy:e.ball.vy};if(Math.sqrt(p*p+g*g)>Ve){const r=-Math.sin(g)*Me,c=Math.sin(p)*Me;n.vx+=r*o,n.vy+=c*o}const T=1+S(h,0,1)*(ze-1),A=Math.pow(Ne,T*o*60);n.vx*=A,n.vy*=A;const k=Math.sqrt(n.vx*n.vx+n.vy*n.vy);k>le&&(n.vx=n.vx/k*le,n.vy=n.vy/k*le),n.x+=n.vx*o,n.y+=n.vy*o;let $=e.wallHitAt;const{hit:L}=He(n,x.walls);L&&($=t);const R=x.goal.x-n.x,i=x.goal.y-n.y;if(R*R+i*i<he*he)return{...e,phase:"LEVEL_CLEAR",phaseTimer:Ye,ball:n,wallHitAt:$,effectivePitch:p,effectiveRoll:g,elapsedMs:e.elapsedMs+o*1e3,ballSpeed:Math.sqrt(n.vx*n.vx+n.vy*n.vy)};for(const r of x.holes){const c=r.x-n.x,y=r.y-n.y;if(c*c+y*y<r.r*r.r)return{...e,phase:"DEAD",phaseTimer:Ie,deathProgress:0,lives:e.lives-1,ball:{...n,x:r.x,y:r.y,vx:0,vy:0},effectivePitch:p,effectiveRoll:g}}return{...e,ball:n,wallHitAt:$,effectivePitch:p,effectiveRoll:g,elapsedMs:e.elapsedMs+o*1e3,ballSpeed:Math.sqrt(n.vx*n.vx+n.vy*n.vy)}}default:return e}}const Qe=pe`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`,fe=pe`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`,et=pe`
  0%, 100% { box-shadow: 0 0 6px rgba(0, 220, 120, 0.6), 0 0 16px rgba(0, 220, 120, 0.25); transform: scale(1); }
  50% { box-shadow: 0 0 14px rgba(0, 220, 120, 0.95), 0 0 30px rgba(0, 220, 120, 0.45); transform: scale(1.08); }
`,tt=pe`
  0%, 100% { box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.9), 0 0 6px rgba(255, 60, 60, 0.25); }
  50% { box-shadow: inset 0 0 12px rgba(0, 0, 0, 0.95), 0 0 10px rgba(255, 60, 60, 0.45); }
`,st=a.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 24px 80px;
`,rt=a.div`
  margin-bottom: 24px;
`,nt=a.h1`
  margin-bottom: 4px;
`,it=a.p`
  color: rgba(191, 204, 214, 0.5);
  font-size: 15px;
  margin: 0;
`,ot=a.div`
  padding: 20px;
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`,at=a.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  z-index: 10;
`,lt=a.div`
  padding: 6px 14px;
  background: rgba(10, 10, 20, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: rgba(191, 204, 214, 0.7);
  font-size: 12px;
  white-space: nowrap;
`,ct=a.div`
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
`,ht=a.div`
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
`,Pe=a.span`
  white-space: nowrap;
`,dt=a.span`
  flex: 1;
`,pt=a.span`
  display: inline-flex;
  gap: 4px;
  align-items: center;
`,ft=a.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${e=>e.$alive?"rgba(191, 204, 214, 0.85)":"rgba(191, 204, 214, 0.15)"};
  transition: background 0.3s;
`,ut=a.div`
  position: relative;
  width: ${ce}px;
  height: ${ne}px;
  background:
    radial-gradient(
      circle at 1px 1px,
      rgba(255, 255, 255, 0.04) 1px,
      transparent 1px
    ),
    rgba(10, 14, 26, 0.9);
  background-size: ${d}px ${d}px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  overflow: hidden;
  max-width: 100%;

  @media (max-width: 600px) {
    width: 100%;
    height: ${ne*.8}px;
  }
`,gt=a.div`
  position: absolute;
  width: ${d}px;
  height: ${d}px;
  background: linear-gradient(
    135deg,
    rgba(72, 120, 200, 0.35),
    rgba(40, 70, 130, 0.45)
  );
  border: 1px solid rgba(120, 160, 220, 0.25);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3);
  pointer-events: none;
`,xt=a.div`
  position: absolute;
  width: ${C*2}px;
  height: ${C*2}px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(255, 255, 255, 1),
    rgba(180, 190, 210, 0.9) 60%,
    rgba(120, 130, 160, 0.9)
  );
  box-shadow:
    0 0 6px rgba(255, 255, 255, 0.4),
    0 1px 3px rgba(0, 0, 0, 0.5);
  pointer-events: none;
  transform: translate(-50%, -50%) scale(${e=>e.$scale});
  opacity: ${e=>e.$opacity};
  transition: opacity 0.05s linear;
`,mt=a.div`
  position: absolute;
  width: ${xe*2}px;
  height: ${xe*2}px;
  border-radius: 50%;
  background: radial-gradient(
    circle at center,
    rgba(0, 0, 0, 1) 40%,
    rgba(30, 10, 10, 0.8) 70%,
    rgba(60, 20, 20, 0.4)
  );
  border: 1px solid rgba(80, 30, 30, 0.6);
  pointer-events: none;
  transform: translate(-50%, -50%);
  animation: ${tt} 2.2s ease-in-out infinite;
`,bt=a.div`
  position: absolute;
  width: ${he*2}px;
  height: ${he*2}px;
  border-radius: 50%;
  background: radial-gradient(
    circle at center,
    rgba(100, 255, 180, 0.9),
    rgba(0, 200, 120, 0.7) 60%,
    rgba(0, 140, 80, 0.3)
  );
  border: 1px solid rgba(120, 255, 200, 0.5);
  pointer-events: none;
  transform: translate(-50%, -50%);
  animation: ${et} 1.6s ease-in-out infinite;
`,yt=a.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.1);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`,vt=a.div`
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: rgba(72, 175, 240, 0.9);
  box-shadow: 0 0 4px rgba(72, 175, 240, 0.6);
`,Tt=a.span`
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  pointer-events: none;
`,ee=a.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  background: ${e=>e.$dim?"rgba(0, 0, 0, 0.6)":"transparent"};
  z-index: 5;
  pointer-events: none;
`,Et=a.div`
  font-size: 32px;
  font-weight: 700;
  color: rgba(191, 204, 214, 0.9);
  letter-spacing: 4px;
  margin-bottom: 16px;
  animation: ${fe} 0.4s ease;
`,te=a.div`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.55);
  line-height: 1.7;
  margin-bottom: 24px;
  font-family: "Fira Code", monospace;
`,ge=a.div`
  font-size: 14px;
  color: rgba(72, 175, 240, 0.8);
  animation: ${Qe} 1.6s ease-in-out infinite;
`,At=a.div`
  font-size: 24px;
  font-weight: 700;
  color: rgba(255, 60, 60, 0.9);
  letter-spacing: 3px;
  margin-bottom: 8px;
  animation: ${fe} 0.4s ease;
`,Rt=a.div`
  font-size: 24px;
  font-weight: 700;
  color: rgba(0, 230, 120, 0.9);
  letter-spacing: 2px;
  animation: ${fe} 0.3s ease;
`,Lt=a.div`
  font-size: 30px;
  font-weight: 700;
  color: #f29e02;
  letter-spacing: 4px;
  margin-bottom: 12px;
  animation: ${fe} 0.4s ease;
`,Mt=a.div`
  font-size: 22px;
  font-weight: 600;
  color: rgba(191, 204, 214, 0.85);
  letter-spacing: 3px;
`,It=a.div`
  font-size: 28px;
  font-weight: 700;
  color: #48aff0;
  font-family: "Fira Code", monospace;
  margin: 6px 0;
`,Pt=a.div`
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
`,jt=a.div`
  margin-top: 32px;
  color: rgba(191, 204, 214, 0.65);
  font-size: 14px;
  line-height: 1.65;
`,je=a.h3`
  color: rgba(191, 204, 214, 0.85);
  font-size: 15px;
  margin: 24px 0 8px;
  &:first-child {
    margin-top: 0;
  }
`,wt=a.ul`
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
`;function se(e){const l=Math.floor(e/1e3),o=Math.floor(l/60),t=l%60,f=Math.floor(e%1e3/10);return`${o.toString().padStart(2,"0")}:${t.toString().padStart(2,"0")}.${f.toString().padStart(2,"0")}`}const $t=()=>{var R;const e=b.useContext(Oe),[l,o]=b.useState(!!((R=e==null?void 0:e.connection)!=null&&R.state)),[t,f]=b.useReducer(Je,void 0,()=>me(0)),u=b.useRef(t);u.current=t;const h=b.useRef(0),x=b.useRef("TITLE"),p=b.useRef(0),[,g]=b.useState(0);b.useEffect(()=>{if(!(e!=null&&e.connection))return;const i=()=>o(!!e.connection.state);return i(),e.connection.on("change",i),()=>{e.connection.removeListener("change",i)}},[e]),b.useEffect(()=>{if(!(e!=null&&e.cross))return;const i=()=>{const{phase:r}=u.current;r==="TITLE"?f({type:"START_GAME"}):r==="GAME_OVER"||r==="VICTORY"?f({type:"RESTART"}):r==="DEAD"&&f({type:"SKIP_DEATH"})};return e.cross.on("press",i),()=>{e.cross.off("press",i)}},[e]),b.useEffect(()=>{if(!(e!=null&&e.triangle))return;const i=()=>{const{phase:r}=u.current;(r==="PLAYING"||r==="PAUSED")&&f({type:"TOGGLE_PAUSE"})};return e.triangle.on("press",i),()=>{e.triangle.off("press",i)}},[e]),b.useEffect(()=>{if(!(e!=null&&e.square)||!(e!=null&&e.orientation))return;const i=()=>{f({type:"RECENTER",tiltPitch:e.orientation.tiltPitch,tiltRoll:e.orientation.tiltRoll})};return e.square.on("press",i),()=>{e.square.off("press",i)}},[e]),b.useEffect(()=>{if(!(e!=null&&e.orientation)||!["PLAYING","LEVEL_CLEAR","DEAD"].includes(t.phase))return;let r=performance.now(),c=0,y=0,I=0,O=0;const D=1e3/60;let P=0;const N=m=>{var Y,q,F,H,U,B,W,X,K,Z,J;const j=m-r;for(r=m,P=Math.min(P+j,D*3);P>=D;){const M=e.orientation.tiltPitch,ie=e.orientation.tiltRoll,oe=((q=(Y=e.right)==null?void 0:Y.trigger)==null?void 0:q.state)??0;f({type:"TICK",dt:1/60,now:m,tiltPitch:M,tiltRoll:ie,r2:oe}),P-=D}const E=u.current;if(m-c>100&&(c=m,E.phase!=="DEAD"&&E.phase!=="LEVEL_CLEAR"&&((F=e.left)==null||F.rumble(0),(H=e.right)==null||H.rumble(0))),m-y>100&&(y=m,E.phase==="PLAYING")){const M=Be(E.effectivePitch,E.effectiveRoll);(U=e.lightbar)==null||U.set(M)}if(m-I>200&&(I=m,E.phase==="PLAYING")){const M=Math.min(1,E.ballSpeed/le);(X=(W=(B=e.right)==null?void 0:B.trigger)==null?void 0:W.feedback)==null||X.set({effect:ae.TriggerEffect.Feedback,position:.1,strength:.3+M*.5}),(J=(Z=(K=e.left)==null?void 0:K.trigger)==null?void 0:Z.feedback)==null||J.set({effect:ae.TriggerEffect.Feedback,position:.2,strength:.2+M*.6})}m-O>16&&(O=m,g(M=>(M+1)%1e6)),h.current=requestAnimationFrame(N)};return h.current=requestAnimationFrame(N),()=>{var m,j;cancelAnimationFrame(h.current),(m=e.left)==null||m.rumble(0),(j=e.right)==null||j.rumble(0)}},[e,t.phase]),b.useEffect(()=>{var i;if(e&&t.wallHitAt!==p.current&&t.wallHitAt!==0){const r=p.current;p.current=t.wallHitAt,t.wallHitAt-r>120&&(We(e),(i=e.right)==null||i.rumble(.25),setTimeout(()=>{var c;u.current.phase==="PLAYING"&&((c=e.right)==null||c.rumble(0))},35))}},[e,t.wallHitAt]),b.useEffect(()=>{if(!(e!=null&&e.playerLeds))return;const i=t.phase==="VICTORY"?5:t.phase==="TITLE"||t.phase==="GAME_OVER"?0:t.levelIndex+1;for(let r=0;r<5;r++)e.playerLeds.setLed(r,r<i)},[e,t.levelIndex,t.phase]),b.useEffect(()=>{var c,y,I,O,D,P,N,m,j,E,Y,q,F,H,U,B,W,X,K,Z,J,M,ie,oe,ye,ve,Te,Ee;if(!e)return;const i=x.current,r=t.phase;if(x.current=r,i!==r){if(r==="DEAD"){Xe(e),(c=e.left)==null||c.rumble(.9),(y=e.right)==null||y.rumble(.7),(I=e.lightbar)==null||I.set({r:180,g:20,b:20}),(O=e.mute)==null||O.setLed(ae.MuteLedMode.Pulse);const Q=setTimeout(()=>{var w,V;(w=e.left)==null||w.rumble(0),(V=e.right)==null||V.rumble(0)},400);return()=>clearTimeout(Q)}if(r==="LEVEL_CLEAR"){Ke(e),(D=e.lightbar)==null||D.set({r:255,g:255,b:255}),(P=e.left)==null||P.rumble(.3),(N=e.right)==null||N.rumble(.3);const Q=setTimeout(()=>{var w,V;(w=e.left)==null||w.rumble(0),(V=e.right)==null||V.rumble(0)},250);return()=>clearTimeout(Q)}if(r==="PLAYING"&&i==="DEAD"&&((m=e.mute)==null||m.resetLed()),r==="VICTORY"){Ze(e);const Q=performance.now();let w=0;const V=De=>{var Ae;const ue=(De-Q)/1e3,Ce=Math.round(128+127*Math.sin(ue*2)),Ge=Math.round(128+127*Math.sin(ue*2+2.094)),_e=Math.round(128+127*Math.sin(ue*2+4.188));(Ae=e.lightbar)==null||Ae.set({r:Ce,g:Ge,b:_e}),w=requestAnimationFrame(V)};w=requestAnimationFrame(V);const $e=setTimeout(()=>{cancelAnimationFrame(w)},4e3);return()=>{cancelAnimationFrame(w),clearTimeout($e)}}r==="GAME_OVER"&&((j=e.left)==null||j.rumble(0),(E=e.right)==null||E.rumble(0),(F=(q=(Y=e.left)==null?void 0:Y.trigger)==null?void 0:q.feedback)==null||F.reset(),(B=(U=(H=e.right)==null?void 0:H.trigger)==null?void 0:U.feedback)==null||B.reset(),(W=e.lightbar)==null||W.set({r:80,g:0,b:0}),(X=e.mute)==null||X.resetLed()),r==="TITLE"&&((K=e.left)==null||K.rumble(0),(Z=e.right)==null||Z.rumble(0),(ie=(M=(J=e.left)==null?void 0:J.trigger)==null?void 0:M.feedback)==null||ie.reset(),(ve=(ye=(oe=e.right)==null?void 0:oe.trigger)==null?void 0:ye.feedback)==null||ve.reset(),(Te=e.lightbar)==null||Te.set({r:20,g:30,b:80}),(Ee=e.mute)==null||Ee.resetLed())}},[e,t.phase]),b.useEffect(()=>{if(!(e!=null&&e.mute)||t.phase!=="PLAYING")return;const i=G[t.levelIndex];Ue(t.ball,i.holes)<20?e.mute.setLed(ae.MuteLedMode.Pulse):e.mute.resetLed()},[e,t.ball.x,t.ball.y,t.levelIndex,t.phase]),b.useEffect(()=>()=>{var i,r,c,y,I,O,D,P,N,m,j,E;(c=(r=(i=e==null?void 0:e.right)==null?void 0:i.trigger)==null?void 0:r.feedback)==null||c.reset(),(O=(I=(y=e==null?void 0:e.left)==null?void 0:y.trigger)==null?void 0:I.feedback)==null||O.reset(),(D=e==null?void 0:e.left)==null||D.rumble(0),(P=e==null?void 0:e.right)==null||P.rumble(0),(N=e==null?void 0:e.lightbar)==null||N.set({r:0,g:0,b:255}),(m=e==null?void 0:e.playerLeds)==null||m.clear(),(j=e==null?void 0:e.mute)==null||j.resetLed(),(E=e==null?void 0:e.stopTestTone())==null||E.catch(()=>{}),cancelAnimationFrame(h.current)},[e]);const n=!Re||!l,v=Re?l?null:"Connect a controller to play":"Requires WebHID (Chrome, Edge, Opera)",T=G[t.levelIndex],A=t.phase!=="TITLE"&&t.phase!=="GAME_OVER"&&t.phase!=="VICTORY",k=t.phase==="DEAD"?Math.max(.1,1-t.deathProgress):1,$=t.phase==="DEAD"?Math.max(0,1-t.deathProgress):1,L={x:t.effectiveRoll/_*18,y:t.effectivePitch/_*18};return s.jsxs(st,{children:[s.jsxs(rt,{children:[s.jsx(nt,{children:"Tilt Maze"}),s.jsx(it,{children:"Roll a ball through the maze by tilting the controller."})]}),s.jsxs(ot,{children:[v&&s.jsx(at,{children:s.jsx(lt,{children:v})}),s.jsxs(ct,{$inactive:n,children:[s.jsxs(ht,{children:[s.jsxs(Pe,{children:["Level ",t.levelIndex+1,"/",be.length]}),s.jsx(Pe,{children:se(t.elapsedMs)}),s.jsx(dt,{}),s.jsx(pt,{title:"Lives",children:Array.from({length:ke},(i,r)=>s.jsx(ft,{$alive:r<t.lives},r))})]}),s.jsxs(ut,{children:[T.wallCells.map(i=>s.jsx(gt,{style:{left:`${i.col*d}px`,top:`${i.row*d}px`}},`w-${i.col}-${i.row}`)),T.holes.map((i,r)=>s.jsx(mt,{style:{left:`${i.x}px`,top:`${i.y}px`}},`h-${r}`)),s.jsx(bt,{style:{left:`${T.goal.x}px`,top:`${T.goal.y}px`}}),A&&s.jsx(xt,{$scale:k,$opacity:$,style:{left:`${t.ball.x}px`,top:`${t.ball.y}px`}}),t.phase==="PLAYING"&&s.jsxs(yt,{children:[s.jsx(Tt,{}),s.jsx(vt,{style:{transform:`translate(${L.x}px, ${L.y}px)`}})]}),t.phase==="TITLE"&&s.jsxs(ee,{$dim:!0,children:[s.jsx(Et,{children:"TILT MAZE"}),s.jsxs(te,{children:["Tilt the controller to roll the ball",s.jsx("br",{}),"Square: recenter · R2: brake · Triangle: pause"]}),s.jsx(ge,{children:"Press × to start"}),t.bestTimeMs>0&&s.jsxs(te,{style:{marginTop:16,marginBottom:0},children:["Best: ",se(t.bestTimeMs)]})]}),t.phase==="LEVEL_CLEAR"&&s.jsx(ee,{children:s.jsxs(Rt,{children:["LEVEL ",t.levelIndex+1," CLEAR"]})}),t.phase==="PAUSED"&&s.jsxs(ee,{$dim:!0,children:[s.jsx(Mt,{children:"PAUSED"}),s.jsx(te,{style:{marginTop:16},children:"Triangle to resume"})]}),t.phase==="GAME_OVER"&&s.jsxs(ee,{$dim:!0,children:[s.jsx(At,{children:"GAME OVER"}),s.jsxs(te,{children:["Reached level ",t.levelIndex+1]}),s.jsx(ge,{children:"Press × to try again"})]}),t.phase==="VICTORY"&&s.jsxs(ee,{$dim:!0,children:[s.jsx(Lt,{children:"YOU WIN"}),s.jsx(It,{children:se(t.elapsedMs)}),s.jsx(te,{children:t.bestTimeMs>0&&t.elapsedMs===t.bestTimeMs?"New best time!":t.bestTimeMs>0?`Best: ${se(t.bestTimeMs)}`:" "}),s.jsx(ge,{children:"Press × to play again"})]})]}),(t.phase==="PLAYING"||t.phase==="DEAD"||t.phase==="LEVEL_CLEAR"||t.phase==="PAUSED")&&s.jsxs(Pt,{children:[s.jsxs("span",{children:["Tilt (",t.effectiveRoll.toFixed(2),","," ",t.effectivePitch.toFixed(2),") rad"]}),t.bestTimeMs>0&&s.jsxs("span",{children:["Best ",se(t.bestTimeMs)]})]})]})]}),s.jsxs(jt,{children:[s.jsx(je,{children:"Controller Features"}),s.jsxs(wt,{children:[s.jsxs("li",{children:[s.jsx("strong",{children:"Orientation sensor"})," - The controller's fused IMU exposes a gravity-referenced tilt via"," ",s.jsx("code",{children:"controller.orientation.tiltPitch"})," and"," ",s.jsx("code",{children:".tiltRoll"}),". These are computed from the accelerometer alone, so they have ",s.jsx("em",{children:"zero drift"})," and no yaw - exactly the signal you want for a marble-on-a-tray metaphor. The ball accelerates along the projected gravity vector each tick."]}),s.jsxs("li",{children:[s.jsx("strong",{children:"Recenter"})," - ",s.jsx("code",{children:"Square"})," captures the current ",s.jsx("code",{children:"tiltPitch"})," / ",s.jsx("code",{children:"tiltRoll"}),' as the new "flat" reference, so the player can play at any comfortable rest angle without the ball drifting.']}),s.jsxs("li",{children:[s.jsx("strong",{children:"Adaptive triggers"})," - ",s.jsx("code",{children:"R2"})," is a brake: pulling it scales friction 1×–5× so the ball stops on a dime. ",s.jsx("code",{children:"TriggerEffect.Feedback"})," strength on both triggers is modulated by ball speed - you physically feel how fast the marble is rolling."]}),s.jsxs("li",{children:[s.jsx("strong",{children:"Dual rumble"})," - Left (low-frequency) motor carries a continuous rolling rumble scaled by ball speed. Right (high-frequency) motor fires a quadratic-falloff proximity pulse when near a hole, plus a brief tap on each wall collision."]}),s.jsxs("li",{children:[s.jsx("strong",{children:"Lightbar"})," - Live tilt indicator: hue shifts based on the dominant tilt direction (blue left, orange right, teal forward, magenta back), saturation scaled by tilt magnitude. Red flash on death, white pulse on level clear, rainbow cycle on victory."]}),s.jsxs("li",{children:[s.jsx("strong",{children:"Player LEDs"})," - Level progress: LEDs 1..N lit for current level (of 5). All 5 solid on VICTORY."]}),s.jsxs("li",{children:[s.jsx("strong",{children:"Mute LED"}),` - Pulses when the ball is within 20px of a hole edge. A physical "you're about to die" indicator you can feel without looking.`]}),s.jsxs("li",{children:[s.jsx("strong",{children:"Speaker (test tones)"})," - 1kHz click on wall taps (throttled), 100Hz thud on hole death, dual-click ascending pattern on level clear, four-note fanfare on victory."]})]}),s.jsx(je,{children:"Implementation Notes"}),s.jsxs("p",{children:["The whole game runs on a single ",s.jsx("code",{children:"requestAnimationFrame"})," ","loop with a fixed 1/60s timestep and accumulator capped at 3 ticks (50ms) to survive a backgrounded tab. Reading orientation is one property access per frame. The Dualsense instance updates the Madgwick filter on every HID report, and ",s.jsx("code",{children:"tiltPitch"}),"/",s.jsx("code",{children:"tiltRoll"})," are derived directly from the accelerometer norm."]}),s.jsx(Le,{code:`// Orientation - gravity-referenced tilt, no drift, no yaw.
const tiltPitch = controller.orientation.tiltPitch;
const tiltRoll = controller.orientation.tiltRoll;

// Subtract a captured neutral to allow playing at any rest angle,
// then clamp to ±π/4 saturation.
const effPitch = clamp(tiltPitch - neutralPitch, -MAX_TILT, MAX_TILT);
const effRoll = clamp(tiltRoll - neutralRoll, -MAX_TILT, MAX_TILT);

// Project onto screen-space gravity.
const gx = -Math.sin(effRoll) * GRAVITY;
const gy = Math.sin(effPitch) * GRAVITY;
ball.vx += gx * dt;
ball.vy += gy * dt;

// R2 brake: multiply friction so pulling fully stops the marble.
const brake = 1 + r2 * 4;
ball.vx *= Math.pow(FRICTION, brake * dt * 60);
ball.vy *= Math.pow(FRICTION, brake * dt * 60);`}),s.jsxs("p",{children:["Walls live as a ",s.jsx("code",{children:'Set<"col,row">'})," per level. The ball only checks the 9 cells surrounding it for collision - a bounded, allocation-free inner loop. Circle-vs-AABB resolution pushes the ball along the contact normal and reflects velocity with a 0.35 restitution coefficient for a satisfying tap."]}),s.jsx(Le,{code:`// Square button recenters the reference tilt - capture current pose as "flat".
controller.square.on("press", () => {
  dispatch({
    type: "RECENTER",
    tiltPitch: controller.orientation.tiltPitch,
    tiltRoll: controller.orientation.tiltRoll,
  });
});

// Lightbar becomes a live tilt indicator - hue from tilt direction,
// saturation from magnitude. The player feels the gravity they're applying.
controller.lightbar.set(lightbarFromTilt(effPitch, effRoll));

// Mute LED pulses when the ball is dangerously close to a hole -
// a tactile "danger" cue that doesn't require looking at the screen.
if (nearestHoleEdgeDist(ball, holes) < 20) {
  controller.mute.setLed(MuteLedMode.Pulse);
}`}),s.jsx("p",{children:"Five levels live as string arrays at the top of the file, parsed once at module load into walls, holes, start, and goal. Levels can be added or tweaked by editing the ASCII directly; no tooling required."})]})]})};export{$t as default};
