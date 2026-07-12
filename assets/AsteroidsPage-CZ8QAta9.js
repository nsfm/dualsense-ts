import{a as b,C as Oe,d as ce,j as s,g as l,h as je,f as pe,E as Ae}from"./index-B3Vc337h.js";import{C as we}from"./CodeBlock-C5O9LPzb.js";const Y=552,W=400,We=1200,Ve=.92,ue=400,Ye=12,Se=.15,Ue=.25,me=.5,le=600,Re=1,He=3,Be=150,qe=24,Ke=500,Xe=[-Math.PI/5,-Math.PI/7.5,-Math.PI/15,0,Math.PI/15,Math.PI/7.5,Math.PI/5],Pe=2,Ze=1.5,Je=2,ve={large:{radius:35,speedMin:30,speedMax:80,points:20},medium:{radius:20,speedMin:50,speedMax:120,points:50},small:{radius:10,speedMin:80,speedMax:160,points:100}},Fe=5,Qe=3,Ge=5;function de(e,f,n){const t=n-f;let o=e;for(;o<f;)o+=t;for(;o>=n;)o-=t;return o}function et(){const e=7+Math.floor(Math.random()*4),f=[];for(let n=0;n<e;n++){const t=n/e*Math.PI*2,o=.7+Math.random()*.3,h=50+Math.cos(t)*o*50,p=50+Math.sin(t)*o*50;f.push(`${h.toFixed(1)}% ${p.toFixed(1)}%`)}return`polygon(${f.join(", ")})`}function xe(e,f,n,t,o,h){const p=ve[t];let A,m;if(o!==void 0&&h!==void 0)A=o,m=h;else{const _=p.speedMin+Math.random()*(p.speedMax-p.speedMin),v=Math.random()*Math.PI*2;A=Math.cos(v)*_,m=Math.sin(v)*_}return{id:e,x:f,y:n,vx:A,vy:m,size:t,radius:p.radius,rotation:Math.random()*360,rotationSpeed:(Math.random()-.5)*60,shape:et()}}function De(e,f,n,t="large"){let o=0,h=0,p=0;for(;p<8;){const N=Math.floor(Math.random()*4);N===0?(o=Math.random()*Y,h=-20):N===1?(o=Y+20,h=Math.random()*W):N===2?(o=Math.random()*Y,h=W+20):(o=-20,h=Math.random()*W);const O=o-f,D=h-n;if(O*O+D*D>22500)break;p++}const A=Y/2-o,m=W/2-h,v=Math.atan2(m,A)+(Math.random()-.5)*(Math.PI/2),T=ve[t],S=T.speedMin+Math.random()*(T.speedMax-T.speedMin);return xe(e,o,h,t,Math.cos(v)*S,Math.sin(v)*S)}function ke(e,f,n,t){const o=Math.min(3+e,12),h=Math.floor(Math.max(0,e-3)/2),p=[];let A=t;for(let m=0;m<o;m++)p.push(De(A++,f,n,"large"));for(let m=0;m<h;m++)p.push(De(A++,f,n,"medium"));return{asteroids:p,nextId:A}}function tt(e){return e>=5?{r:0,g:150,b:30}:e===4?{r:80,g:180,b:0}:e===3?{r:200,g:200,b:0}:e===2?{r:220,g:100,b:0}:{r:255,g:20,b:20}}function $e(e,f,n,t){const o=[];let h=e;for(let p=0;p<t;p++){const A=Math.random()*Math.PI*2,m=100+Math.random()*150,_=.25+Math.random()*.2;o.push({id:h++,x:f,y:n,vx:Math.cos(A)*m,vy:Math.sin(A)*m,ttl:_,life:_})}return{particles:o,nextId:h}}function st(e,f){if(e.size==="small")return[];const n=e.size==="large"?"medium":"small",t=Math.sqrt(e.vx*e.vx+e.vy*e.vy),o=Math.atan2(e.vy,e.vx),h=Math.PI/4+Math.random()*(Math.PI/4),p=t*(1.2+Math.random()*.3),A=o+h,m=o-h;return[xe(f,e.x,e.y,n,Math.cos(A)*p,Math.sin(A)*p),xe(f+1,e.x,e.y,n,Math.cos(m)*p,Math.sin(m)*p)]}function rt(e){e.startTestTone("speaker","100hz").catch(()=>{}),setTimeout(()=>e.stopTestTone().catch(()=>{}),25)}function it(e){e.startTestTone("speaker","100hz").catch(()=>{}),setTimeout(()=>{e.stopTestTone().catch(()=>{}),setTimeout(()=>{e.startTestTone("speaker","1khz").catch(()=>{}),setTimeout(()=>e.stopTestTone().catch(()=>{}),20)},30)},60)}function nt(e){e.startTestTone("speaker","1khz").catch(()=>{}),setTimeout(()=>{e.stopTestTone().catch(()=>{}),setTimeout(()=>{e.startTestTone("speaker","1khz").catch(()=>{}),setTimeout(()=>e.stopTestTone().catch(()=>{}),40)},20)},40)}function ge(){return{x:Y/2,y:W/2,vx:0,vy:0,angle:-Math.PI/2,invulnerable:0}}function be(e){return{phase:"TITLE",prevPhase:"TITLE",ship:ge(),bullets:[],asteroids:[],particles:[],score:0,highScore:e,lives:Fe,wave:1,spreadAmmo:Qe,lastFireAt:0,lastSpreadAt:0,phaseTimer:0,destroyed:0,nextId:1,fireFlashAt:0,destroyFlashAt:0,prevL2:0}}function at(e,f){switch(f.type){case"START_GAME":{const n=ge(),t=ke(1,n.x,n.y,1);return{...be(e.highScore),phase:"PLAYING",ship:n,asteroids:t.asteroids,nextId:t.nextId}}case"RESTART":return{...be(Math.max(e.highScore,e.score)),phase:"TITLE"};case"TOGGLE_PAUSE":return e.phase==="PLAYING"?{...e,phase:"PAUSED",prevPhase:"PLAYING"}:e.phase==="PAUSED"?{...e,phase:e.prevPhase,prevPhase:"PLAYING"}:e;case"SKIP_DEATH":return e.phase!=="DEAD"?e:e.lives<=0?{...e,phase:"GAME_OVER",highScore:Math.max(e.highScore,e.score),phaseTimer:0}:{...e,phase:"PLAYING",phaseTimer:0,ship:{...ge(),invulnerable:Pe}};case"TICK":{if(e.phase==="TITLE"||e.phase==="GAME_OVER"||e.phase==="PAUSED")return e;const{dt:n,now:t,moveAngle:o,moveMag:h,aimAngle:p,aimMag:A,r2:m,l2:_}=f;let v=e.nextId;if(e.phase==="WAVE_CLEAR"&&e.phaseTimer-n<=0){const c=e.wave+1,x=ke(c,e.ship.x,e.ship.y,v);return{...e,phase:"PLAYING",wave:c,asteroids:x.asteroids,nextId:x.nextId,phaseTimer:0,spreadAmmo:Math.min(Ge,e.spreadAmmo+1)}}if(e.phase==="DEAD"&&e.phaseTimer-n<=0)return e.lives<=0?{...e,phase:"GAME_OVER",highScore:Math.max(e.highScore,e.score),phaseTimer:0}:{...e,phase:"PLAYING",phaseTimer:0,ship:{...ge(),invulnerable:Pe}};let{vx:T,vy:S,angle:N,invulnerable:O}=e.ship,{x:D,y:V}=e.ship;if(e.phase==="PLAYING"){if(h>0){const x=h*We*n;T+=Math.cos(o)*x,S+=Math.sin(o)*x}const r=Math.pow(Ve,n*60);T*=r,S*=r;const c=Math.sqrt(T*T+S*S);c>ue&&(T=T/c*ue,S=S/c*ue),D=de(D+T*n,0,Y),V=de(V+S*n,0,W),A>0&&(N=p),O=Math.max(0,O-n)}let C=[];for(const r of e.bullets){const c=r.ttl-n;if(c<=0)continue;const x=r.x+r.vx*n,j=r.y+r.vy*n;x<0||x>Y||j<0||j>W||C.push({...r,x,y:j,ttl:c})}let K=e.fireFlashAt,i=e.lastFireAt,a=e.spreadAmmo,M=e.lastSpreadAt;if(e.phase==="PLAYING"){if(m>me&&t-e.lastFireAt>Be&&C.length<qe){const r=N;C.push({id:v++,x:D+Math.cos(r)*18,y:V+Math.sin(r)*18,vx:Math.cos(r)*le,vy:Math.sin(r)*le,ttl:Re}),i=t,K=t}if(e.prevL2<me&&_>=me&&a>0&&t-e.lastSpreadAt>=Ke){for(const r of Xe){const c=N+r;C.push({id:v++,x:D+Math.cos(c)*18,y:V+Math.sin(c)*18,vx:Math.cos(c)*le,vy:Math.sin(c)*le,ttl:Re})}a-=1,M=t,K=t}}let u=e.asteroids.map(r=>({...r,x:de(r.x+r.vx*n,-r.radius,Y+r.radius),y:de(r.y+r.vy*n,-r.radius,W+r.radius),rotation:r.rotation+r.rotationSpeed*n}));const y=[];for(const r of e.particles){const c=r.ttl-n;c<=0||y.push({...r,x:r.x+r.vx*n,y:r.y+r.vy*n,vx:r.vx*.95,vy:r.vy*.95,ttl:c})}let E=e.score,R=e.destroyed,L=e.destroyFlashAt;const P=new Set,I=new Set,$=[];for(const r of C)if(!I.has(r.id))for(const c of u){if(P.has(c.id))continue;const x=c.x-r.x,j=c.y-r.y,F=c.radius+He;if(x*x+j*j<F*F){I.add(r.id),P.add(c.id),E+=ve[c.size].points,R+=1,L=t;const U=st(c,v);v+=U.length,$.push(...U);const H=$e(v,c.x,c.y,6);v=H.nextId,y.push(...H.particles);break}}I.size>0&&(C=C.filter(r=>!I.has(r.id))),P.size>0&&(u=u.filter(r=>!P.has(r.id))),$.length>0&&(u=[...u,...$]);let d=e.phase,z=e.lives,g=e.phaseTimer;if(d==="DEAD"&&(g-=n),d==="WAVE_CLEAR"&&(g-=n),d==="PLAYING"&&O<=0)for(const r of u){const c=r.x-D,x=r.y-V,j=r.radius+Ye;if(c*c+x*x<j*j){d="DEAD",g=Ze,z=Math.max(0,z-1);const F=$e(v,D,V,10);v=F.nextId,y.push(...F.particles);break}}return d==="PLAYING"&&u.length===0&&(d="WAVE_CLEAR",g=Je,E+=200*e.wave),{...e,phase:d,phaseTimer:g,lives:z,ship:{x:D,y:V,vx:T,vy:S,angle:N,invulnerable:O},bullets:C,asteroids:u,particles:y,score:E,destroyed:R,nextId:v,lastFireAt:i,lastSpreadAt:M,spreadAmmo:a,fireFlashAt:K,destroyFlashAt:L,prevL2:_}}default:return e}}const ot=Ae`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`,ye=Ae`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`,ct=Ae`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`,lt=l.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 24px 80px;
`,dt=l.div`
  margin-bottom: 24px;
`,ht=l.h1`
  margin-bottom: 4px;
`,pt=l.p`
  color: rgba(191, 204, 214, 0.5);
  font-size: 15px;
  margin: 0;
`,gt=l.div`
  padding: 20px;
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`,ft=l.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  z-index: 10;
`,ut=l.div`
  padding: 6px 14px;
  background: rgba(10, 10, 20, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: rgba(191, 204, 214, 0.7);
  font-size: 12px;
  white-space: nowrap;
`,mt=l.div`
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
`,xt=l.div`
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
`,_e=l.span`
  white-space: nowrap;
`,bt=l.span`
  flex: 1;
`,At=l.span`
  display: inline-flex;
  gap: 4px;
  align-items: center;
`,vt=l.span`
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 9px solid
    ${e=>e.$alive?"rgba(191, 204, 214, 0.85)":"rgba(191, 204, 214, 0.15)"};
  transition: border-bottom-color 0.3s;
`,yt=l.span`
  display: inline-flex;
  gap: 4px;
  align-items: center;
`,Et=l.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${e=>e.$active?"rgba(242, 158, 2, 0.85)":"rgba(255, 255, 255, 0.1)"};
  transition: background 0.2s;
`,Mt=l.div`
  position: relative;
  width: ${Y}px;
  height: ${W}px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  overflow: hidden;
  max-width: 100%;

  @media (max-width: 600px) {
    width: 100%;
    height: ${W*.8}px;
  }
`,Tt=l.div`
  position: absolute;
  width: 18px;
  height: 20px;
  left: 0;
  top: 0;
  pointer-events: none;
  opacity: ${e=>e.$blink?.35:1};
  transition: opacity 0.05s linear;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    clip-path: polygon(100% 50%, 0% 0%, 25% 50%, 0% 100%);
    background: rgba(191, 204, 214, 0.18);
    border: 0;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    clip-path: polygon(
      100% 50%,
      0% 0%,
      25% 50%,
      0% 100%,
      100% 50%,
      96% 50%,
      22% 8%,
      22% 92%,
      96% 50%
    );
    background: rgba(72, 175, 240, 0.9);
  }

  ${e=>e.$thrusting&&pe`
      filter: drop-shadow(0 0 4px rgba(72, 175, 240, 0.35));
    `}
`,Lt=l.div`
  position: absolute;
  width: 8px;
  height: 6px;
  background: rgba(255, 160, 40, 0.8);
  clip-path: polygon(0% 50%, 100% 0%, 75% 50%, 100% 100%);
  pointer-events: none;
  filter: drop-shadow(0 0 3px rgba(255, 120, 20, 0.6));
`,It=l.div`
  position: absolute;
  pointer-events: none;
  border-radius: 0;

  ${e=>e.$size==="large"&&pe`
      width: 70px;
      height: 70px;
    `}
  ${e=>e.$size==="medium"&&pe`
      width: 40px;
      height: 40px;
    `}
  ${e=>e.$size==="small"&&pe`
      width: 20px;
      height: 20px;
    `}

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(191, 204, 214, 0.06);
  }

  &::after {
    content: "";
    position: absolute;
    inset: 1px;
    background: rgba(0, 0, 0, 0.85);
  }
`,jt=l.div`
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(72, 175, 240, 0.95);
  box-shadow: 0 0 5px rgba(72, 175, 240, 0.6);
  pointer-events: none;
  transform: translate(-50%, -50%);
`,wt=l.div`
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(255, 180, 60, 0.9);
  pointer-events: none;
  transform: translate(-50%, -50%);
`,he=l.div`
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
`,St=l.div`
  font-size: 32px;
  font-weight: 700;
  color: rgba(191, 204, 214, 0.9);
  letter-spacing: 4px;
  margin-bottom: 16px;
  animation: ${ye} 0.4s ease;
`,ie=l.div`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.55);
  line-height: 1.7;
  margin-bottom: 24px;
  font-family: "Fira Code", monospace;
`,Ce=l.div`
  font-size: 14px;
  color: rgba(72, 175, 240, 0.8);
  animation: ${ot} 1.6s ease-in-out infinite;
`,Rt=l.div`
  font-size: 36px;
  font-weight: 700;
  color: #f29e02;
  font-family: "Fira Code", monospace;
  margin: 8px 0;
`,Pt=l.div`
  font-size: 24px;
  font-weight: 700;
  color: rgba(255, 60, 60, 0.9);
  letter-spacing: 3px;
  margin-bottom: 8px;
  animation: ${ye} 0.4s ease;
`,Dt=l.div`
  font-size: 24px;
  font-weight: 700;
  color: rgba(0, 230, 120, 0.9);
  letter-spacing: 2px;
  animation: ${ye} 0.3s ease, ${ct} 1s ease infinite;
`,kt=l.div`
  font-size: 22px;
  font-weight: 600;
  color: rgba(191, 204, 214, 0.85);
  letter-spacing: 3px;
`,$t=l.div`
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
`,_t=l.div`
  margin-top: 32px;
  color: rgba(191, 204, 214, 0.65);
  font-size: 14px;
  line-height: 1.65;
`,ze=l.h3`
  color: rgba(191, 204, 214, 0.85);
  font-size: 15px;
  margin: 24px 0 8px;
  &:first-child {
    margin-top: 0;
  }
`,Ct=l.ul`
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
`,Gt=()=>{var K;const e=b.useContext(Oe),[f,n]=b.useState(!!((K=e==null?void 0:e.connection)!=null&&K.state)),[t,o]=b.useReducer(at,void 0,()=>be(0)),h=b.useRef(t);h.current=t;const p=b.useRef(0),A=b.useRef("TITLE"),m=b.useRef(0),[,_]=b.useState(0);b.useEffect(()=>{if(!(e!=null&&e.connection))return;const i=()=>n(!!e.connection.state);return i(),e.connection.on("change",i),()=>{e.connection.removeListener("change",i)}},[e]),b.useEffect(()=>{var y,E;const i=(y=e==null?void 0:e.left)==null?void 0:y.analog,a=(E=e==null?void 0:e.right)==null?void 0:E.analog;if(!i||!a)return;const M=i.deadzone,u=a.deadzone;return i.deadzone=Se,a.deadzone=Ue,()=>{i.deadzone=M,a.deadzone=u}},[e]),b.useEffect(()=>{if(!(e!=null&&e.cross))return;const i=()=>{const{phase:a}=h.current;a==="TITLE"?o({type:"START_GAME"}):a==="GAME_OVER"?o({type:"RESTART"}):a==="DEAD"&&o({type:"SKIP_DEATH"})};return e.cross.on("press",i),()=>{e.cross.off("press",i)}},[e]),b.useEffect(()=>{if(!(e!=null&&e.triangle))return;const i=()=>{const{phase:a}=h.current;(a==="PLAYING"||a==="PAUSED")&&o({type:"TOGGLE_PAUSE"})};return e.triangle.on("press",i),()=>{e.triangle.off("press",i)}},[e]),b.useEffect(()=>{if(!e||!["PLAYING","WAVE_CLEAR","DEAD"].includes(t.phase))return;let a=performance.now(),M=0,u=0,y=0,E=0,R=0,L=!0;const P=1e3/60;let I=0;const $=d=>{var r,c,x,j,F,U,H,X,Z,J,Q,ee,te,se,B,G,q,Ee,Me,Te,Le,Ie;const z=d-a;for(a=d,I=Math.min(I+z,P*3);I>=P;){const w=(r=e.left)==null?void 0:r.analog,k=(c=e.right)==null?void 0:c.analog,fe=(w==null?void 0:w.magnitude)??0,re=-((w==null?void 0:w.angle)??0),ne=(k==null?void 0:k.magnitude)??0,ae=-((k==null?void 0:k.angle)??0),oe=((j=(x=e.right)==null?void 0:x.trigger)==null?void 0:j.state)??0,Ne=((U=(F=e.left)==null?void 0:F.trigger)==null?void 0:U.state)??0;o({type:"TICK",dt:1/60,now:d,moveAngle:re,moveMag:fe,aimAngle:ae,aimMag:ne,r2:oe,l2:Ne}),I-=P}const g=h.current;if(d-M>100)if(M=d,g.phase==="PLAYING"){let w=1/0;for(const re of g.asteroids){const ne=re.x-g.ship.x,ae=re.y-g.ship.y,oe=Math.sqrt(ne*ne+ae*ae)-re.radius;oe<w&&(w=oe)}const k=Math.max(0,Math.min(1,1-w/70)),fe=k*k*.45;(H=e.right)==null||H.rumble(fe)}else g.phase==="DEAD"?(X=e.right)==null||X.rumble(0):(Z=e.right)==null||Z.rumble(0);if(d-u>100)if(u=d,g.phase==="PLAYING"||g.phase==="DEAD"){const w=tt(g.lives);if(g.lives<=1&&g.lives>0&&g.phase==="PLAYING")d-R>300&&(R=d,L=!L),(J=e.lightbar)==null||J.set(L?w:{r:20,g:0,b:0});else if(g.ship.invulnerable>0&&g.phase==="PLAYING"){const k=.5+Math.sin(d/80)*.5;(Q=e.lightbar)==null||Q.set({r:Math.round(120+k*80),g:Math.round(120+k*80),b:Math.round(180+k*60)})}else(ee=e.lightbar)==null||ee.set(w)}else g.phase==="WAVE_CLEAR"&&((te=e.lightbar)==null||te.set({r:255,g:255,b:255}));d-y>200&&(y=d,g.phase==="PLAYING"&&((G=(B=(se=e.right)==null?void 0:se.trigger)==null?void 0:B.feedback)==null||G.set({effect:ce.TriggerEffect.Weapon,start:.15,end:.45,strength:.7}),g.spreadAmmo>0?(Me=(Ee=(q=e.left)==null?void 0:q.trigger)==null?void 0:Ee.feedback)==null||Me.set({effect:ce.TriggerEffect.Weapon,start:.2,end:.5,strength:.9}):(Ie=(Le=(Te=e.left)==null?void 0:Te.trigger)==null?void 0:Le.feedback)==null||Ie.reset())),d-E>16&&(E=d,m.current++,_(w=>(w+1)%1e6)),p.current=requestAnimationFrame($)};return p.current=requestAnimationFrame($),()=>{var d,z;cancelAnimationFrame(p.current),(d=e.left)==null||d.rumble(0),(z=e.right)==null||z.rumble(0)}},[e,t.phase]),b.useEffect(()=>{if(e!=null&&e.playerLeds)for(let i=0;i<5;i++)e.playerLeds.setLed(i,i<t.lives)},[e,t.lives]),b.useEffect(()=>{var M,u,y,E,R,L,P,I,$,d,z,g,r,c,x,j,F,U,H,X,Z,J,Q,ee,te,se;if(!e)return;const i=A.current,a=t.phase;if(A.current=a,i!==a){if(a==="DEAD"){(M=e.left)==null||M.rumble(1),(u=e.right)==null||u.rumble(.6),(y=e.mute)==null||y.setLed(ce.MuteLedMode.Pulse),it(e);const B=setTimeout(()=>{var G,q;(G=e.left)==null||G.rumble(0),(q=e.right)==null||q.rumble(0)},300);return()=>{clearTimeout(B)}}if(a==="WAVE_CLEAR"){nt(e),(E=e.right)==null||E.rumble(.35),(R=e.left)==null||R.rumble(.35);const B=setTimeout(()=>{var G,q;(G=e.left)==null||G.rumble(0),(q=e.right)==null||q.rumble(0)},250);return()=>clearTimeout(B)}if(a==="PLAYING"&&i==="DEAD"){(L=e.mute)==null||L.setLed(ce.MuteLedMode.On);const B=setTimeout(()=>{var G;return(G=e.mute)==null?void 0:G.resetLed()},2e3);return()=>clearTimeout(B)}a==="GAME_OVER"&&((P=e.left)==null||P.rumble(0),(I=e.right)==null||I.rumble(0),(z=(d=($=e.right)==null?void 0:$.trigger)==null?void 0:d.feedback)==null||z.reset(),(c=(r=(g=e.left)==null?void 0:g.trigger)==null?void 0:r.feedback)==null||c.reset(),(x=e.lightbar)==null||x.set({r:80,g:0,b:0}),(j=e.mute)==null||j.resetLed()),a==="TITLE"&&((F=e.left)==null||F.rumble(0),(U=e.right)==null||U.rumble(0),(Z=(X=(H=e.right)==null?void 0:H.trigger)==null?void 0:X.feedback)==null||Z.reset(),(ee=(Q=(J=e.left)==null?void 0:J.trigger)==null?void 0:Q.feedback)==null||ee.reset(),(te=e.lightbar)==null||te.set({r:0,g:30,b:80}),(se=e.mute)==null||se.resetLed())}},[e,t.phase]);const v=b.useRef(0),T=b.useRef(0);b.useEffect(()=>{e&&(t.fireFlashAt!==v.current&&t.fireFlashAt!==0&&(v.current,v.current=t.fireFlashAt),t.destroyFlashAt!==T.current&&t.destroyFlashAt!==0&&(T.current=t.destroyFlashAt,rt(e)))},[e,t.fireFlashAt,t.destroyFlashAt,t.phase]);const S=b.useRef(0);b.useEffect(()=>{e&&t.lastSpreadAt!==S.current&&t.lastSpreadAt!==0&&(S.current=t.lastSpreadAt)},[e,t.lastSpreadAt]),b.useEffect(()=>()=>{var i,a,M,u,y,E,R,L,P,I,$,d;(M=(a=(i=e==null?void 0:e.right)==null?void 0:i.trigger)==null?void 0:a.feedback)==null||M.reset(),(E=(y=(u=e==null?void 0:e.left)==null?void 0:u.trigger)==null?void 0:y.feedback)==null||E.reset(),(R=e==null?void 0:e.left)==null||R.rumble(0),(L=e==null?void 0:e.right)==null||L.rumble(0),(P=e==null?void 0:e.lightbar)==null||P.set({r:0,g:0,b:255}),(I=e==null?void 0:e.playerLeds)==null||I.clear(),($=e==null?void 0:e.mute)==null||$.resetLed(),(d=e==null?void 0:e.stopTestTone())==null||d.catch(()=>{}),cancelAnimationFrame(p.current)},[e]);const N=!je||!f,O=je?f?null:"Connect a controller to play":"Requires WebHID (Chrome, Edge, Opera)",D=(()=>{var M,u,y,E,R,L;if(t.phase!=="PLAYING"||!e)return!1;const i=((y=(u=(M=e.left)==null?void 0:M.analog)==null?void 0:u.x)==null?void 0:y.state)??0,a=((L=(R=(E=e.left)==null?void 0:E.analog)==null?void 0:R.y)==null?void 0:L.state)??0;return Math.sqrt(i*i+a*a)>Se})(),V=t.phase==="DEAD"?Math.floor(performance.now()/80)%2===0:t.ship.invulnerable>0?Math.floor(performance.now()/100)%2===0:!1,C=t.phase!=="TITLE"&&t.phase!=="GAME_OVER";return s.jsxs(lt,{children:[s.jsxs(dt,{children:[s.jsx(ht,{children:"Asteroids"}),s.jsx(pt,{children:"Twin-stick arcade shooter."})]}),s.jsxs(gt,{children:[O&&s.jsx(ft,{children:s.jsx(ut,{children:O})}),s.jsxs(mt,{$inactive:N,children:[s.jsxs(xt,{children:[s.jsxs(_e,{children:["Score ",t.score]}),s.jsxs(_e,{children:["Wave ",t.wave]}),s.jsx(bt,{}),s.jsx(At,{title:"Lives",children:Array.from({length:Fe},(i,a)=>s.jsx(vt,{$alive:a<t.lives},a))}),s.jsx(yt,{title:"Spread ammo",children:Array.from({length:Ge},(i,a)=>s.jsx(Et,{$active:a<t.spreadAmmo},a))})]}),s.jsxs(Mt,{children:[t.asteroids.map(i=>s.jsx(It,{$size:i.size,style:{left:`${i.x-i.radius}px`,top:`${i.y-i.radius}px`,clipPath:i.shape,transform:`rotate(${i.rotation}deg)`}},i.id)),t.bullets.map(i=>s.jsx(jt,{style:{left:`${i.x}px`,top:`${i.y}px`}},i.id)),t.particles.map(i=>s.jsx(wt,{style:{left:`${i.x}px`,top:`${i.y}px`,opacity:i.ttl/i.life}},i.id)),D&&C&&t.phase==="PLAYING"&&s.jsx(Lt,{style:{left:`${t.ship.x-Math.cos(t.ship.angle)*14-4}px`,top:`${t.ship.y-Math.sin(t.ship.angle)*14-3}px`,transform:`rotate(${t.ship.angle*180/Math.PI+180}deg)`}}),C&&s.jsx(Tt,{$thrusting:D,$blink:V,style:{left:`${t.ship.x-9}px`,top:`${t.ship.y-10}px`,transform:`rotate(${t.ship.angle}rad)`}}),t.phase==="TITLE"&&s.jsxs(he,{$dim:!0,children:[s.jsx(St,{children:"ASTEROIDS"}),s.jsxs(ie,{children:["Left stick to fly · Right stick to aim",s.jsx("br",{}),"R2: fire · L2: spread shot · Triangle: pause"]}),s.jsx(Ce,{children:"Press × to start"}),t.highScore>0&&s.jsxs(ie,{style:{marginTop:16,marginBottom:0},children:["Best: ",t.highScore]})]}),t.phase==="WAVE_CLEAR"&&s.jsxs(he,{children:[s.jsxs(Dt,{children:["WAVE ",t.wave," CLEAR"]}),s.jsxs(ie,{style:{marginTop:8},children:["+",200*t.wave," bonus"]})]}),t.phase==="PAUSED"&&s.jsxs(he,{$dim:!0,children:[s.jsx(kt,{children:"PAUSED"}),s.jsx(ie,{style:{marginTop:16},children:"Triangle to resume"})]}),t.phase==="GAME_OVER"&&s.jsxs(he,{$dim:!0,children:[s.jsx(Pt,{children:"GAME OVER"}),s.jsx(Rt,{children:t.score}),s.jsxs(ie,{children:["Wave ",t.wave," · ",t.destroyed," destroyed",t.score===t.highScore&&t.score>0&&" — new best!"]}),s.jsx(Ce,{children:"Press × to try again"})]})]}),(t.phase==="PLAYING"||t.phase==="DEAD"||t.phase==="WAVE_CLEAR"||t.phase==="PAUSED")&&s.jsxs($t,{children:[s.jsxs("span",{children:["Destroyed ",t.destroyed]}),t.highScore>0&&s.jsxs("span",{children:["Best ",t.highScore]})]})]})]}),s.jsxs(_t,{children:[s.jsx(ze,{children:"Controller Features"}),s.jsxs(Ct,{children:[s.jsxs("li",{children:[s.jsx("strong",{children:"Dual analog sticks"})," - Left stick controls ship movement with acceleration and friction physics. Right stick sets aim direction. Each stick is read via ",s.jsx("code",{children:".angle"})," and ",s.jsx("code",{children:".magnitude"}),", which apply the stick's configured ",s.jsx("code",{children:".deadzone"})," and rescale the live range to 0..1. Movement uses a 0.15 deadzone, aim uses 0.25 - set at mount and restored on unmount."]}),s.jsxs("li",{children:[s.jsx("strong",{children:"Adaptive triggers"})," - ",s.jsx("code",{children:"R2"})," fires the primary weapon (one bullet per 150ms while held past the click-stop). ",s.jsx("code",{children:"L2"})," fires a seven-bullet spread on each pull - the trigger uses ",s.jsx("code",{children:"TriggerEffect.Weapon"})," when spread ammo is available and resets when empty, giving you a physical sense of the remaining charges."]}),s.jsxs("li",{children:[s.jsx("strong",{children:"Face buttons"})," - ",s.jsx("code",{children:"Cross"})," to start / restart / skip death, ",s.jsx("code",{children:"Triangle"})," to pause. Discrete actions via ",s.jsx("code",{children:'.on("press", ...)'}),"."]}),s.jsxs("li",{children:[s.jsx("strong",{children:"Rumble"})," - Right (high-frequency) motor carries a proximity alert proportional to the nearest asteroid's edge distance, with a quadratic falloff over 70px so it only kicks in on near misses. Written from the rAF loop at 10Hz to stay within HID bandwidth. Both motors also fire coordinated bursts during death, wave clear, and spread shots via phase transitions."]}),s.jsxs("li",{children:[s.jsx("strong",{children:"Lightbar"})," - Maps to remaining lives: green→yellow→red. Flashes on last life, pulses white during respawn invulnerability, bright white on wave clear."]}),s.jsxs("li",{children:[s.jsx("strong",{children:"Player LEDs"})," - 5 LEDs = 5 lives. Turn off right-to-left as lives are lost. Reset on restart."]}),s.jsxs("li",{children:[s.jsx("strong",{children:"Mute LED"})," - ",s.jsx("code",{children:"MuteLedMode.Pulse"})," during death animation, ",s.jsx("code",{children:"On"})," during post-respawn invulnerability, off otherwise."]}),s.jsxs("li",{children:[s.jsx("strong",{children:"Speaker (test tones)"})," - Short 1kHz chirps on fire, 100Hz thuds on asteroid destruction, dual-tone patterns on death and wave clear via ",s.jsx("code",{children:"startTestTone"})," / ",s.jsx("code",{children:"stopTestTone"}),"."]})]}),s.jsx(ze,{children:"Implementation Notes"}),s.jsxs("p",{children:["The game runs on a consolidated ",s.jsx("code",{children:"requestAnimationFrame"})," loop using a fixed-timestep physics update (1/60s) with an accumulator capped to prevent runaway after a backgrounded tab. All rapid HID writes (rumble, lightbar, trigger effects) live in this same loop, throttled independently to avoid flooding the USB connection."]}),s.jsx(we,{code:`// Per-stick deadzones - set once at mount, restored on unmount.
controller.left.analog.deadzone = 0.15;   // movement
controller.right.analog.deadzone = 0.25;  // aim

// .magnitude applies the deadzone and rescales to 0..1.
// .angle is atan2(y, x) in stick-space (y positive up); negate
// for screen-space math (y positive down).
const moveMag = controller.left.analog.magnitude;
const moveAngle = -controller.left.analog.angle;
const aimMag = controller.right.analog.magnitude;
const aimAngle = -controller.right.analog.angle;

// Left stick → acceleration along stick direction
if (moveMag > 0) {
  vx += Math.cos(moveAngle) * moveMag * ACCEL * dt;
  vy += Math.sin(moveAngle) * moveMag * ACCEL * dt;
}

// Right stick → aim
if (aimMag > 0) ship.angle = aimAngle;

// R2 held → primary fire (rate limited)
// L2 edge-triggered → spread shot
if (r2 > 0.5 && timeSinceLastFire > 150) spawnBullet();
if (prevL2 < 0.5 && l2 >= 0.5 && spreadAmmo > 0) fireSpread();`}),s.jsxs("p",{children:["Entity positions use inline ",s.jsx("code",{children:"style"})," rather than styled-component props. The reducer stores arrays of bullets, asteroids, and particles; each tick filters out expired entities and appends new ones (splits, particles, fresh bullets). Asteroid clip-path polygons are generated once at spawn time and stored on the entity so their irregular shape is cached."]}),s.jsx(we,{code:`// R2 is primary fire - a click-stop keeps the break point tactile.
controller.right.trigger.feedback.set({
  effect: TriggerEffect.Weapon,
  start: 0.15, end: 0.45, strength: 0.7,
});

// L2 fires the spread. Weapon effect while ammo remains, so the
// trigger physically signals when you're out of charges.
if (spreadAmmo > 0) {
  controller.left.trigger.feedback.set({
    effect: TriggerEffect.Weapon,
    start: 0.2, end: 0.5, strength: 0.9,
  });
} else {
  controller.left.trigger.feedback.reset();
}`}),s.jsx("p",{children:"Asteroids split on hit: large → two medium, medium → two small, small → destroyed. Child velocities are the parent velocity rotated ±45–90° and scaled up, producing the classic spreading pattern. Wave generation adds more large asteroids with each wave and introduces medium asteroids from wave 4 onward."})]})]})};export{Gt as default};
