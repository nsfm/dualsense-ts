import{a as l,C as U,d as h,j as r,g as s,h as M,f as $,E as v}from"./index-B3Vc337h.js";import{C as B}from"./CodeBlock-C5O9LPzb.js";const N={"pin-tumbler":{name:"Pin Tumbler",description:"A clear snap - find the detent"},"disc-detainer":{name:"Disc Detainer",description:"Subtle resistance - feel for the click"},wafer:{name:"Wafer Lock",description:"No snap, just a wall of resistance"},dimple:{name:"Dimple Lock",description:"The mechanism fights back"},tubular:{name:"Tubular Lock",description:"A faint vibration - barely there"}},G=["pin-tumbler","disc-detainer","wafer","dimple","tubular"];function _(e){return e<=2?"pin-tumbler":e<=4?"disc-detainer":e<=6?"wafer":e<=8?"dimple":e<=10?"tubular":G[Math.floor(Math.random()*G.length)]}function u(e,c=0,a=1){return Math.max(c,Math.min(a,e))}function A(e){const c=_(e),{name:a,description:t}=N[c],n=.15+Math.random()*.7;let d;switch(c){case"pin-tumbler":d={effect:h.TriggerEffect.Weapon,start:u(n-.15),end:u(n+.15),strength:.9};break;case"disc-detainer":d={effect:h.TriggerEffect.Weapon,start:u(n-.08),end:u(n+.08),strength:.6};break;case"wafer":d={effect:h.TriggerEffect.Feedback,position:n,strength:.8};break;case"dimple":d={effect:h.TriggerEffect.Bow,start:u(n-.1),end:u(n+.1),strength:.8,snapForce:.6};break;case"tubular":d={effect:h.TriggerEffect.Vibration,position:n,amplitude:.3,frequency:20};break}return{type:c,name:a,description:t,target:n,config:d}}function K(e){return e<.03?{result:"perfect",points:100}:e<.07?{result:"great",points:75}:e<.12?{result:"good",points:50}:e<.2?{result:"close",points:25}:{result:"miss",points:0}}function V(e){return e>.3?{r:0,g:30,b:80}:e>.15?{r:180,g:100,b:10}:e>.05?{r:0,g:150,b:30}:{r:0,g:255,b:50}}const R={perfect:"#00ff64",great:"#00e050",good:"#e0c020",close:"#d0a020",miss:"#ff3030"},W={perfect:"Perfect!",great:"Great!",good:"Good",close:"Close...",miss:"Miss"};function X(e){e.startTestTone("speaker","1khz").catch(()=>{}),setTimeout(()=>{e.stopTestTone().catch(()=>{}),setTimeout(()=>{e.startTestTone("speaker","100hz").catch(()=>{}),setTimeout(()=>e.stopTestTone().catch(()=>{}),20)},10)},60)}function z(e){var c;(c=e.right)==null||c.rumble(.4),setTimeout(()=>{var a;(a=e.right)==null||a.rumble(0),setTimeout(()=>{var t;(t=e.right)==null||t.rumble(.4),setTimeout(()=>{var n;return(n=e.right)==null?void 0:n.rumble(0)},50)},30)},50)}const w={phase:"TITLE",round:0,score:0,picks:5,currentLock:null,triggerPos:0,lastResult:null,blindMode:!1,successStreak:0};function q(e,c){switch(c.type){case"START":{const a=A(1);return{...w,phase:"PICKING",round:1,picks:5,currentLock:a,blindMode:e.blindMode}}case"UPDATE_TRIGGER":return e.phase!=="PICKING"?e:{...e,triggerPos:c.pos};case"ATTEMPT_PICK":{if(e.phase!=="PICKING"||!e.currentLock)return e;const a=Math.abs(e.triggerPos-e.currentLock.target),{result:t,points:n}=K(a),d=t==="miss",p=d?e.picks-1:e.picks,f=d?0:e.successStreak+1,j=!d&&f>0&&f%3===0&&p<5?p+1:p;return{...e,phase:j<=0?"GAME_OVER":"RESULT",score:e.score+n,picks:j,successStreak:f,lastResult:{result:t,points:n,distance:a,guessPos:e.triggerPos}}}case"ADVANCE_ROUND":{if(e.phase!=="RESULT")return e;const a=e.round+1,t=A(a);return{...e,phase:"PICKING",round:a,currentLock:t,triggerPos:0}}case"RESTART":return{...w,blindMode:e.blindMode};case"TOGGLE_BLIND":return{...e,blindMode:!e.blindMode};default:return e}}const H=v`
  0%, 100% { transform: translateX(0); }
  15% { transform: translateX(-6px); }
  30% { transform: translateX(5px); }
  45% { transform: translateX(-4px); }
  60% { transform: translateX(3px); }
  75% { transform: translateX(-2px); }
`,Y=v`
  0% { transform: rotate(0deg); opacity: 1; }
  100% { transform: rotate(15deg); opacity: 0.4; }
`,Z=v`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`,J=v`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`,Q=s.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 24px 80px;
`,ee=s.div`
  margin-bottom: 24px;
`,te=s.h1`
  margin-bottom: 4px;
`,re=s.p`
  color: rgba(191, 204, 214, 0.5);
  font-size: 15px;
  margin: 0;
`,se=s.div`
  margin-top: 32px;
  color: rgba(191, 204, 214, 0.65);
  font-size: 14px;
  line-height: 1.65;
`,D=s.h3`
  color: rgba(191, 204, 214, 0.85);
  font-size: 15px;
  margin: 24px 0 8px;
  &:first-child {
    margin-top: 0;
  }
`,ie=s.ul`
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
`,ne=s.div`
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
  opacity: ${e=>e.$visible?1:0};
  transition: opacity 0.2s;
`,O=s.span`
  white-space: nowrap;
`,oe=s.span`
  flex: 1;
`,ae=s.span`
  display: inline-flex;
  gap: 4px;
  align-items: center;
`,ce=s.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${e=>e.$filled?"#f29e02":"rgba(255, 255, 255, 0.1)"};
  transition: background 0.2s;
`,le=s.div`
  padding: 32px 24px;
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 340px;
  position: relative;
`,de=s.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  z-index: 2;
`,pe=s.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: ${e=>e.$inactive?.3:1};
  filter: ${e=>e.$inactive?"grayscale(0.8)":"none"};
  pointer-events: ${e=>e.$inactive?"none":"auto"};
  transition: opacity 0.2s, filter 0.2s;
`,ge=s.div`
  padding: 6px 14px;
  background: rgba(10, 10, 20, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: rgba(191, 204, 214, 0.7);
  font-size: 12px;
  white-space: nowrap;
  z-index: 3;
`,ue=s.div`
  margin-bottom: 20px;
  ${e=>e.$anim==="jam"&&$`
      animation: ${H} 0.5s ease;
    `}
  ${e=>e.$anim==="open"&&$`
      animation: ${Y} 0.6s ease forwards;
    `}
`,he=s.div`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: rgba(191, 204, 214, 0.4);
  text-align: center;
  margin-top: 10px;
`,fe=s.div`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.5);
  text-align: center;
  margin-top: 4px;
  font-style: italic;
`,xe=s.div`
  height: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`,me=s.div`
  width: 100%;
  max-width: 400px;
  margin: 16px 0 8px;
  opacity: ${e=>e.$visible===!1?0:1};
  transition: opacity 0.2s;
`,be=s.div`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(191, 204, 214, 0.3);
  margin-bottom: 4px;
`,ke=s.div`
  position: relative;
  width: 100%;
  height: 20px;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  overflow: hidden;
`,Te=s.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${e=>e.$width*100}%;
  background: linear-gradient(
    90deg,
    rgba(242, 158, 2, 0.25),
    rgba(242, 158, 2, 0.55)
  );
  border-radius: 4px 0 0 4px;
  transition: width 0.03s linear;
`,Le=s.div`
  position: absolute;
  top: 0;
  left: ${e=>e.$pos*100}%;
  width: 3px;
  height: 100%;
  background: ${e=>e.$color};
  transform: translateX(-1px);
  opacity: 0.9;
`,je=s.div`
  font-size: 13px;
  font-family: "Fira Code", monospace;
  color: rgba(191, 204, 214, 0.5);
  text-align: right;
  margin-top: 4px;
`,ye=s.div`
  font-size: 14px;
  color: rgba(191, 204, 214, 0.45);
  text-align: center;
  margin-top: 20px;
  animation: ${J} 2.5s ease-in-out infinite;
`,Ee=s.div`
  text-align: center;
  animation: ${Z} 0.3s ease;
  margin: 12px 0;
`,Re=s.div`
  font-size: 28px;
  font-weight: 700;
  color: ${e=>e.$color};
`,ve=s.div`
  font-size: 16px;
  font-family: "Fira Code", monospace;
  color: ${e=>e.$color};
  opacity: 0.8;
  margin-top: 2px;
`,Pe=s.div`
  font-size: 12px;
  font-family: "Fira Code", monospace;
  color: rgba(191, 204, 214, 0.35);
  margin-top: 4px;
`,we=s.button`
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  padding: 6px;
  color: rgba(191, 204, 214, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s, border-color 0.15s;
  z-index: 1;

  &:hover {
    color: rgba(191, 204, 214, 0.7);
    border-color: rgba(255, 255, 255, 0.15);
  }
`,Ce=s.div`
  font-size: 14px;
  color: rgba(191, 204, 214, 0.6);
  text-align: center;
  max-width: 320px;
  line-height: 1.6;
  margin-bottom: 8px;
`,Se=s.div`
  font-size: 36px;
  font-weight: 700;
  font-family: "Fira Code", monospace;
  color: #f29e02;
  margin: 8px 0;
`,F=s.div`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.5);
  margin-bottom: 4px;
`,Ie=({success:e})=>r.jsxs("svg",{width:"120",height:"120",viewBox:"0 0 120 120",fill:"none",children:[r.jsx("path",{d:"M40 52 V36 C40 22 80 22 80 36 V52",stroke:e?"rgba(0, 220, 80, 0.5)":"rgba(242, 158, 2, 0.25)",strokeWidth:"6",strokeLinecap:"round",fill:"none"}),r.jsx("rect",{x:"30",y:"52",width:"60",height:"48",rx:"6",fill:e?"rgba(0, 220, 80, 0.12)":"rgba(242, 158, 2, 0.08)",stroke:e?"rgba(0, 220, 80, 0.4)":"rgba(242, 158, 2, 0.3)",strokeWidth:"2"}),r.jsx("circle",{cx:"60",cy:"72",r:"7",fill:e?"rgba(0, 220, 80, 0.5)":"rgba(242, 158, 2, 0.4)"}),r.jsx("path",{d:"M57 78 L60 92 L63 78",fill:e?"rgba(0, 220, 80, 0.5)":"rgba(242, 158, 2, 0.4)"})]}),Ge=()=>{var C,S;const e=l.useContext(U),[c,a]=l.useState(!!((C=e==null?void 0:e.connection)!=null&&C.state)),[t,n]=l.useReducer(q,w),d=l.useRef(t),p=l.useRef();d.current=t,l.useEffect(()=>{if(!(e!=null&&e.connection))return;const i=()=>a(!!e.connection.state);return i(),e.connection.on("change",i),()=>{e.connection.removeListener("change",i)}},[e]),l.useEffect(()=>{var o;if(!((o=e==null?void 0:e.right)!=null&&o.trigger))return;const i=()=>{n({type:"UPDATE_TRIGGER",pos:e.right.trigger.state})};return e.right.trigger.on("change",i),()=>{e.right.trigger.removeListener("change",i)}},[e]),l.useEffect(()=>{if(!(e!=null&&e.cross))return;const i=()=>{const{phase:o}=d.current;o==="TITLE"?n({type:"START"}):o==="PICKING"?n({type:"ATTEMPT_PICK"}):o==="GAME_OVER"&&n({type:"RESTART"})};return e.cross.on("press",i),()=>{e.cross.off("press",i)}},[e]),l.useEffect(()=>{var i,o;(o=(i=e==null?void 0:e.right)==null?void 0:i.trigger)!=null&&o.feedback&&(t.phase==="PICKING"&&t.currentLock?e.right.trigger.feedback.set(t.currentLock.config):e.right.trigger.feedback.reset())},[e,t.phase,t.currentLock]),l.useEffect(()=>{if(e!=null&&e.lightbar)if(t.phase==="PICKING"&&t.currentLock&&!t.blindMode){const i=Math.abs(t.triggerPos-t.currentLock.target);e.lightbar.set(V(i))}else t.phase==="PICKING"&&t.blindMode&&e.lightbar.set({r:5,g:5,b:10})},[e,t.phase,t.triggerPos,t.currentLock,t.blindMode]),l.useEffect(()=>{if(e!=null&&e.playerLeds)for(let i=0;i<5;i++)e.playerLeds.setLed(i,i<t.picks)},[e,t.picks]),l.useEffect(()=>{var o,x,m,b,k,T;if(!e||t.phase!=="RESULT"&&t.phase!=="GAME_OVER"||!t.lastResult)return;const{result:i}=t.lastResult;if(i==="miss"){(o=e.lightbar)==null||o.set({r:255,g:20,b:20}),(x=e.left)==null||x.rumble(.8),(m=e.right)==null||m.rumble(.4),(b=e.mute)==null||b.setLed(h.MuteLedMode.Pulse),X(e);const y=setTimeout(()=>{var g,L;(g=e.left)==null||g.rumble(0),(L=e.right)==null||L.rumble(0)},400),E=setTimeout(()=>{var g;(g=e.mute)==null||g.resetLed()},800);return()=>{clearTimeout(y),clearTimeout(E)}}else i==="close"?((k=e.lightbar)==null||k.set({r:200,g:160,b:20}),z(e)):((T=e.lightbar)==null||T.set({r:0,g:255,b:80}),z(e))},[e,t.phase,t.lastResult]),l.useEffect(()=>{if(t.phase==="RESULT")return p.current=setTimeout(()=>{n({type:"ADVANCE_ROUND"})},1500),()=>{p.current&&clearTimeout(p.current)}},[t.phase,t.round]),l.useEffect(()=>()=>{var i,o,x,m,b,k,T,y,E,g,L,I;(x=(o=(i=e==null?void 0:e.right)==null?void 0:i.trigger)==null?void 0:o.feedback)==null||x.reset(),(k=(b=(m=e==null?void 0:e.left)==null?void 0:m.trigger)==null?void 0:b.feedback)==null||k.reset(),(T=e==null?void 0:e.left)==null||T.rumble(0),(y=e==null?void 0:e.right)==null||y.rumble(0),(E=e==null?void 0:e.lightbar)==null||E.set({r:0,g:0,b:255}),(g=e==null?void 0:e.playerLeds)==null||g.clear(),(L=e==null?void 0:e.mute)==null||L.resetLed(),(I=e==null?void 0:e.stopTestTone())==null||I.catch(()=>{}),p.current&&clearTimeout(p.current)},[e]);const f=!M||!c,P=M?c?null:"Connect a controller to play":"Requires WebHID (Chrome, Edge, Opera)",j=t.phase==="RESULT"&&t.lastResult?t.lastResult.result==="miss"?"jam":"open":void 0;return t.phase==="PICKING"||t.phase,r.jsxs(Q,{children:[r.jsxs(ee,{children:[r.jsx(te,{children:"Lock Picking"}),r.jsx(re,{children:"Feel for the sweet spot using only your trigger finger."})]}),r.jsxs(le,{children:[P&&r.jsx(de,{children:r.jsx(ge,{children:P})}),r.jsxs(pe,{$inactive:f,children:[r.jsxs(ne,{$visible:t.phase!=="TITLE",children:[r.jsxs(O,{children:["Round ",t.round]}),r.jsxs(O,{children:["Score ",t.score]}),r.jsx(oe,{}),r.jsx(ae,{children:Array.from({length:5},(i,o)=>r.jsx(ce,{$filled:o<t.picks},o))})]}),r.jsx(ue,{$anim:t.phase==="RESULT"||t.phase==="GAME_OVER"?j:void 0,children:r.jsx(Ie,{success:t.phase==="RESULT"&&((S=t.lastResult)==null?void 0:S.result)!=="miss"})}),r.jsxs(xe,{children:[t.phase==="TITLE"&&r.jsxs(Ce,{children:["Each lock hides a resistance point in your R2 trigger. Squeeze slowly, feel for it, and press ",r.jsx("strong",{children:"Cross"})," to pick."]}),t.phase==="PICKING"&&t.currentLock&&r.jsxs(r.Fragment,{children:[r.jsx(he,{children:t.currentLock.name}),r.jsx(fe,{children:t.currentLock.description})]}),t.phase==="RESULT"&&t.lastResult&&r.jsxs(Ee,{$color:R[t.lastResult.result],children:[r.jsx(Re,{$color:R[t.lastResult.result],children:W[t.lastResult.result]}),t.lastResult.points>0&&r.jsxs(ve,{$color:R[t.lastResult.result],children:["+",t.lastResult.points]}),r.jsxs(Pe,{children:["off by ",t.lastResult.distance.toFixed(3)]})]}),t.phase==="GAME_OVER"&&r.jsxs(r.Fragment,{children:[r.jsx(F,{children:"Game Over"}),r.jsx(Se,{children:t.score}),r.jsxs(F,{children:["Round ",t.round," reached"]})]})]}),r.jsxs(me,{$visible:t.phase==="PICKING"||t.phase==="RESULT",children:[r.jsx(be,{children:"R2"}),r.jsxs(ke,{children:[r.jsx(Te,{$width:t.phase==="RESULT"&&t.lastResult?t.lastResult.guessPos:t.triggerPos}),t.phase==="RESULT"&&t.lastResult&&t.currentLock&&r.jsx(Le,{$pos:t.currentLock.target,$color:R[t.lastResult.result]})]}),r.jsx(je,{children:t.phase==="RESULT"&&t.lastResult?t.lastResult.guessPos.toFixed(2):t.triggerPos.toFixed(2)})]}),r.jsxs(ye,{children:[t.phase==="TITLE"&&"Press ✕ to begin",t.phase==="PICKING"&&"Press ✕ to pick",t.phase==="GAME_OVER"&&"Press ✕ to restart",t.phase==="RESULT"&&" "]})]}),r.jsx(we,{onClick:()=>n({type:"TOGGLE_BLIND"}),title:t.blindMode?"Blind mode: on - lightbar hints disabled":"Blind mode: off - lightbar hints enabled",children:t.blindMode?r.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[r.jsx("path",{d:"M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"}),r.jsx("path",{d:"M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"}),r.jsx("line",{x1:"1",y1:"1",x2:"23",y2:"23"})]}):r.jsxs("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[r.jsx("path",{d:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"}),r.jsx("circle",{cx:"12",cy:"12",r:"3"})]})})]}),r.jsxs(se,{children:[r.jsx(D,{children:"Controller Features"}),r.jsxs(ie,{children:[r.jsxs("li",{children:[r.jsx("strong",{children:"Adaptive triggers (5 effects)"})," - Each lock type maps to a different trigger effect: ",r.jsx("code",{children:"Weapon"})," for pin-tumbler and disc-detainer (resistance zone around the sweet spot), ",r.jsx("code",{children:"Feedback"})," for wafer (point resistance), ",r.jsx("code",{children:"Bow"})," for dimple (snap-back at the target), and ",r.jsx("code",{children:"Vibration"})," for tubular (steady buzz at a position)."]}),r.jsxs("li",{children:[r.jsx("strong",{children:"Trigger position"})," - R2 analog position is the core input. The player feels for a hidden target using only the trigger's haptic feedback, then presses X to lock in their guess."]}),r.jsxs("li",{children:[r.jsx("strong",{children:"Lightbar"})," - In normal mode, the lightbar shifts from red (far from target) through yellow to green (on target), acting as a visual proximity hint. Blind mode disables this for a pure haptics-only challenge."]}),r.jsxs("li",{children:[r.jsx("strong",{children:"Player LEDs"})," - Each of the 5 LEDs represents a remaining pick attempt. LEDs turn off as picks are used, giving a glanceable lives indicator."]}),r.jsxs("li",{children:[r.jsx("strong",{children:"Dual rumble"})," - Double-tap pattern on successful picks. On miss, a heavy left rumble combined with lighter right rumble signals failure."]}),r.jsxs("li",{children:[r.jsx("strong",{children:"Mute LED"})," - Pulses during a miss result to reinforce the error feedback visually."]})]}),r.jsx(D,{children:"Implementation Notes"}),r.jsxs("p",{children:["Each lock type generates a ",r.jsx("code",{children:"TriggerFeedbackConfig"})," with its effect centered on a random target position. The player never sees the target - they have to feel for it through the trigger."]}),r.jsx(B,{code:`// Each lock type maps to a different adaptive trigger effect
switch (lockType) {
  case "pin-tumbler":
    return { effect: TriggerEffect.Weapon,
      start: target - 0.15, end: target + 0.15, strength: 0.9 };
  case "wafer":
    return { effect: TriggerEffect.Feedback,
      position: target, strength: 0.8 };
  case "dimple":
    return { effect: TriggerEffect.Bow,
      start: target - 0.1, end: target + 0.1,
      strength: 0.8, snapForce: 0.6 };
  case "tubular":
    return { effect: TriggerEffect.Vibration,
      position: target, amplitude: 0.3, frequency: 20 };
}`}),r.jsx("p",{children:'Scoring is distance-based: under 3% is a perfect pick (100 pts), under 8% is close (50 pts), and anything else is a miss that costs a pick. Blind mode disables the lightbar proximity hint, leaving only trigger haptics - the intended "expert" difficulty.'})]})]})};export{Ge as default};
