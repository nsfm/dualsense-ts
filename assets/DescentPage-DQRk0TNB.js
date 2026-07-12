import{a as E,C as Pt,d as Be,j as n,g as f,h as lt,f as Lt,E as Re}from"./index-B3Vc337h.js";import{C as Ve}from"./CodeBlock-C5O9LPzb.js";const D=520,C=400,h=40,ct=D/h,dt=C/h,Me=5,S=10,Ot=220,Ct=.5,_t=180,pt=.25,Dt=.2,yt=.6,Ye=1,Ft=3,ht=3,Tt=.8,Nt=.42,Ge=70,ft=3,ut=1,xt=50,Ze=4,Je=5,gt=450,Bt=200,Yt=1.2,Ut=3,Ht=2,zt=6,Gt=.2,Kt=.6,Wt=.18,Vt=.3,de=48,vt=50,Xt=.25,qt=2.4,pe={fly:{hp:1,radius:9,speed:140,color:"#b077ff"},shooter:{hp:2,radius:11,speed:90,color:"#ff6060"},turret:{hp:4,radius:14,speed:0,color:"#a0a0b0"},charger:{hp:3,radius:12,speed:400,color:"#ff9940"},boss:{hp:40,radius:26,speed:60,color:"#ff33aa"}},Se={heart:{label:"Heart",desc:"+1 max HP · full heal",color:"#ff4d6d",glyph:"♥"},damage:{label:"Damage Up",desc:"+1 damage per shot",color:"#f29e02",glyph:"◆"},rapid:{label:"Rapid",desc:"Fire rate × 1.5",color:"#48aff0",glyph:"»"},speed:{label:"Speed",desc:"+40 px/s movement",color:"#4fffc5",glyph:"➤"},homing:{label:"Homing",desc:"Bullets track enemies",color:"#a5f3fc",glyph:"◎"},pierce:{label:"Pierce",desc:"Bullets pass through",color:"#c084fc",glyph:"⇒"}},Qe=[["fly","fly","fly","shooter","shooter","turret"],["fly","shooter","shooter","turret","charger","fly"],["shooter","turret","charger","charger","fly","shooter"]],Zt=[40,60,90];function ke(e,r,o){return Math.max(r,Math.min(o,e))}function H(e,r){return e+Math.random()*(r-e)}function Ce(e,r){return Math.floor(H(e,r+1))}function Ie(e,r,o,t){return Math.atan2(t-r,o-e)}function te(e,r,o,t){const d=e-o,x=r-t;return d*d+x*x}function et(e,r,o,t){return Math.sqrt(te(e,r,o,t))}function $t(e){return e==="N"?"S":e==="S"?"N":e==="E"?"W":"E"}function Ke(e){switch(e){case"N":return{dc:0,dr:-1};case"S":return{dc:0,dr:1};case"E":return{dc:1,dr:0};case"W":return{dc:-1,dr:0}}}function me(e,r){return`${e},${r}`}function mt(e,r,o,t,d,x,m){const v=ke(e,t,t+x),A=ke(r,d,d+m),b=e-v,R=r-A,y=b*b+R*R;if(y>=o*o)return{x:e,y:r,hit:!1,normalX:0,normalY:0};const p=Math.sqrt(y)||1e-4,T=b/p,l=R/p;return{x:v+T*o,y:A+l*o,hit:!0,normalX:T,normalY:l}}function At(e){const r=6+e+Ce(0,2),o=new Map,t=new Map,d=0,x=Math.floor(Me/2),m=me(d,x);o.set(m,{col:d,row:x}),t.set(m,new Set);let v={col:d,row:x},A=0;for(;o.size<r&&A<500;){A++;const $=["N","S","E","W"];$.sort(()=>Math.random()-.5);let u=!1;for(const _ of $){const{dc:G,dr:J}=Ke(_),Y=v.col+G,K=v.row+J;if(Y<0||Y>=Me||K<0||K>=Me)continue;const z=me(Y,K),je=me(v.col,v.row);if(!o.has(z)){o.set(z,{col:Y,row:K}),t.set(z,new Set),t.get(je).add(_),t.get(z).add($t(_)),v={col:Y,row:K},u=!0;break}}if(!u){const _=Array.from(o.keys()),G=_[Math.floor(Math.random()*_.length)],[J,Y]=G.split(",").map(Number);v={col:J,row:Y}}}const b=new Map;b.set(m,0);const R=[m];for(;R.length;){const $=R.shift(),u=b.get($),_=o.get($),G=t.get($);for(const J of G){const{dc:Y,dr:K}=Ke(J),z=me(_.col+Y,_.row+K);b.has(z)||(b.set(z,u+1),R.push(z))}}let y=m,p=-1;for(const[$,u]of b)u>p&&(p=u,y=$);const T=Array.from(o.keys()).filter($=>$!==m&&$!==y),l=T.length>0?T[Math.floor(Math.random()*T.length)]:null,X=new Map;for(const[$,u]of o){const _=$===m?"START":$===y?"BOSS":$===l?"TREASURE":"COMBAT";X.set($,{col:u.col,row:u.row,type:_,neighbors:t.get($),pillars:Jt(_),cleared:_==="START",visited:$===m,enemies:[],bullets:[],pickups:[],bombs:[],particles:[],popups:[],pickupSpawned:!1})}return{rooms:X,currentKey:m}}function Jt(e,r){if(e==="START"||e==="TREASURE")return[];const o=Ce(1,3),t=[],d=30;for(let x=0;x<o;x++)for(let m=0;m<d;m++){const v=Ce(2,ct-3),A=Ce(2,dt-3);if(!(Math.abs(v-ct/2)<1&&Math.abs(A-dt/2)<1)&&!t.some(b=>Math.abs(b.x-v)+Math.abs(b.y-A)<2)){t.push({x:v,y:A});break}}return t}function Qt(e,r,o){if(r.type==="START"||r.type==="TREASURE")return{enemies:[],nextId:o};if(r.type==="BOSS"){const b=Zt[e];return{enemies:[{id:o,kind:"boss",x:D/2,y:C/2,vx:0,vy:0,hp:b,maxHp:b,radius:pe.boss.radius,timer:0,subtimer:0,phase:0,jitter:0,targetX:D/2,targetY:C/2,flash:0}],nextId:o+1}}const t=Qe[e]??Qe[0],d=2+Ce(1,2)+Math.floor(e/2),x=[];let m=o;const v=[];for(const b of r.neighbors)v.push(wt(b));const A=140;for(let b=0;b<d;b++){const R=t[Math.floor(Math.random()*t.length)],y=pe[R];let p=0,T=0,l=!1;for(let X=0;X<30;X++)if(p=H(h*2,D-h*2),T=H(h*2,C-h*2),!r.pillars.some($=>et(p,T,$.x*h+h/2,$.y*h+h/2)<h+y.radius)&&!v.some($=>et(p,T,$.x,$.y)<A)){l=!0;break}l||(p=D/2+H(-60,60),T=C/2+H(-60,60)),x.push({id:m++,kind:R,x:p,y:T,vx:0,vy:0,hp:y.hp,maxHp:y.hp,radius:y.radius,timer:H(0,2),subtimer:0,phase:0,jitter:H(0,Math.PI*2),targetX:p,targetY:T,flash:0})}return{enemies:x,nextId:m}}function Et(e,r,o,t){return{id:r,x:o,y:t,kind:e,bob:H(0,Math.PI*2)}}function kt(){const e=["heart","damage","rapid","speed","homing","pierce"];return e[Math.floor(Math.random()*e.length)]}function tt(e){switch(e){case"N":return{x:D/2-de/2,y:0,w:de,h};case"S":return{x:D/2-de/2,y:C-h,w:de,h};case"W":return{x:0,y:C/2-de/2,w:h,h:de};case"E":return{x:D-h,y:C/2-de/2,w:h,h:de}}}function wt(e){const r=tt(e);return{x:r.x+r.w/2,y:r.y+r.h/2}}function en(e){const r=wt(e);switch(e){case"N":return{x:r.x,y:r.y+h*.8};case"S":return{x:r.x,y:r.y-h*.8};case"E":return{x:r.x-h*.8,y:r.y};case"W":return{x:r.x+h*.8,y:r.y}}}function tn(e,r){const{player:o,dt:t}=r;e.jitter+=t*3;const d=Math.sin(e.jitter*1.7)*.4,x=Math.cos(e.jitter*2.1)*.4,m=Ie(e.x,e.y,o.x,o.y),v=Math.cos(m)+d,A=Math.sin(m)+x,b=Math.hypot(v,A)||1,R=pe.fly.speed;return e.vx=v/b*R,e.vy=A/b*R,e.x+=e.vx*t,e.y+=e.vy*t,e}function nn(e,r){const{player:o,dt:t}=r;e.timer-=t;const d=Ie(e.x,e.y,o.x,o.y),x=d+Math.PI/2;if(e.subtimer>0)e.subtimer-=t,e.vx=0,e.vy=0,e.subtimer<=0&&e.phase<3?(r.nextBullets.push(we(r.nextId++,e.x,e.y,d,1)),e.phase++,e.subtimer=.15):e.phase>=3&&(e.phase=0,e.subtimer=0,e.timer=H(2,3));else if(e.timer<=0)e.subtimer=.01,e.phase=0;else{const m=Math.cos(x)*(e.jitter>Math.PI?1:-1),v=Math.sin(x)*(e.jitter>Math.PI?1:-1),A=pe.shooter.speed;e.vx=m*A,e.vy=v*A,e.x+=e.vx*t,e.y+=e.vy*t,e.jitter+=t*.5,e.jitter>Math.PI*2&&(e.jitter=0)}return e}function rn(e,r){const{dt:o}=r;if(e.timer-=o,e.timer<=0){for(let d=0;d<8;d++){const x=d/8*Math.PI*2+e.jitter;r.nextBullets.push(we(r.nextId++,e.x,e.y,x,.9))}e.jitter+=.2,e.timer=3}return e}function sn(e,r){const{player:o,dt:t}=r;if(e.phase===0){const d=Ie(e.x,e.y,o.x,o.y),x=120;e.vx=Math.cos(d)*x,e.vy=Math.sin(d)*x,e.x+=e.vx*t,e.y+=e.vy*t,et(e.x,e.y,o.x,o.y)<160&&(e.phase=1,e.timer=.85,e.targetX=o.x,e.targetY=o.y)}else if(e.phase===1){if(e.timer-=t,e.flash=1-e.timer/.85,e.vx=0,e.vy=0,e.timer<=0){const d=Ie(e.x,e.y,e.targetX,e.targetY),x=pe.charger.speed;e.vx=Math.cos(d)*x,e.vy=Math.sin(d)*x,e.phase=2,e.timer=.3,e.flash=1}}else e.phase===2?(e.timer-=t,e.x+=e.vx*t,e.y+=e.vy*t,e.flash=Math.max(0,e.timer/.3),e.timer<=0&&(e.phase=3,e.timer=.6,e.flash=0)):(e.timer-=t,e.vx=0,e.vy=0,e.timer<=0&&(e.phase=0));return e}function on(e,r){const{player:o,dt:t}=r,d=e.subtimer+=t,x=D/2,m=C/2-30,v=Math.sin(d*.6)*80,A=Math.sin(d*1.2)*40;e.vx=(x+v-e.x)*1.5,e.vy=(m+A-e.y)*1.5,e.x+=e.vx*t,e.y+=e.vy*t;const b=e.hp/e.maxHp,R=b>.66?0:b>.33?1:2;if(R!==e.phase&&(e.phase=R,e.timer=0,e.flash=1),e.timer+=t,e.phase===0){if(e.timer>1.6){e.timer=0;const y=10;e.jitter+=.3;for(let p=0;p<y;p++){const T=p/y*Math.PI*2+e.jitter;r.nextBullets.push(we(r.nextId++,e.x,e.y,T,.85))}}}else if(e.phase===1){if(e.timer>1){e.timer=0;const y=Ie(e.x,e.y,o.x,o.y);for(let p=-1;p<=1;p++){const T=y+p*.22;r.nextBullets.push(we(r.nextId++,e.x,e.y,T,1.1))}}if(Math.floor(d)!==Math.floor(d-t)&&Math.floor(d)%2===0){e.jitter+=.3;for(let p=0;p<12;p++){const T=p/12*Math.PI*2+e.jitter;r.nextBullets.push(we(r.nextId++,e.x,e.y,T,.8))}}}else{if(e.timer>.7){e.timer=0;const y=Ie(e.x,e.y,o.x,o.y);for(let p=-2;p<=2;p++){const T=y+p*.2;r.nextBullets.push(we(r.nextId++,e.x,e.y,T,1.2))}}if(Math.floor(d*1.5)!==Math.floor((d-t)*1.5)){e.jitter-=.25;for(let p=0;p<14;p++){const T=p/14*Math.PI*2+e.jitter;r.nextBullets.push(we(r.nextId++,e.x,e.y,T,.95))}}}return e}function we(e,r,o,t,d){const x=Bt*d;return{id:e,x:r,y:o,vx:Math.cos(t)*x,vy:Math.sin(t)*x,ttl:Ut,damage:1,friendly:!1,pierce:!1,homing:!1,hitIds:[]}}function an(e,r){switch(e.flash=Math.max(0,e.flash-r.dt*6),e.kind){case"fly":return tn(e,r);case"shooter":return nn(e,r);case"turret":return rn(e,r);case"charger":return sn(e,r);case"boss":return on(e,r)}}function ln(e){return{damage:1+(e.items.damage??0),speed:Ot+40*(e.items.speed??0),fireRateMult:Math.pow(1.5,e.items.rapid??0),homing:(e.items.homing??0)>0,pierce:(e.items.pierce??0)>0}}function Mt(){return{x:vt,y:C/2,aimAngle:0,invuln:0,dashT:0,dashVx:0,dashVy:0,dashCooldown:0,fireCooldown:0,hp:ht,maxHp:ht,bombs:Ft,items:{heart:0,damage:0,rapid:0,speed:0,homing:0,pierce:0}}}function It(){return{phase:"TITLE",prevPhase:"TITLE",floorIndex:0,floor:null,player:Mt(),transitionDir:null,transitionT:0,pendingPickup:null,phaseTimer:0,runStats:{roomsCleared:0,kills:0,damageTaken:0,startedAt:0},hitAt:0,killAt:0,pickupAt:0,bombAt:0,explosionAt:0,doorClearedAt:0,elapsedMs:0,nextId:1,aimLast:0,moveAngle:0,moveMag:0,l2:0,lightbarFlash:null,showMap:!1,showInventory:!1}}function Ue(){const e=It(),r=At(0);return e.floor=r,e.phase="PLAYING",e.runStats.startedAt=performance.now(),e.player=Mt(),e}function cn(e,r){const o=At(r),t=e.player;return t.x=vt,t.y=C/2,t.dashT=0,t.dashCooldown=0,t.invuln=.5,{...e,phase:"PLAYING",floorIndex:r,floor:o,transitionDir:null,transitionT:0,player:t}}function nt(e){return e.floor?e.floor.rooms.get(e.floor.currentKey)??null:null}function rt(e,r){if(!e.floor)return e;const o=new Map(e.floor.rooms);return o.set(me(r.col,r.row),r),{...e,floor:{...e.floor,rooms:o}}}function Le(e){const r=nt(e);if(!r||r.cleared||r.enemies.length>0)return e;const{enemies:o,nextId:t}=Qt(e.floorIndex,r,e.nextId);let d={...r,enemies:o},x=t;return r.type==="TREASURE"&&r.pickups.length===0&&(d={...d,pickups:[Et(kt(),t,D/2,C/2)]},x=t+1),{...rt(e,d),nextId:x}}function dn(e,r){switch(r.type){case"START_RUN":return Le(Ue());case"RESTART":return Le(Ue());case"TOGGLE_PAUSE":return e.phase==="PLAYING"?{...e,phase:"PAUSED",prevPhase:"PLAYING"}:e.phase==="PAUSED"?{...e,phase:e.prevPhase}:e;case"TOGGLE_MAP":return e.phase!=="PLAYING"&&e.phase!=="PAUSED"?e:{...e,showMap:!e.showMap};case"TOGGLE_INVENTORY":return e.phase!=="PLAYING"&&e.phase!=="PAUSED"?e:{...e,showInventory:!e.showInventory};case"DASH":{if(e.phase!=="PLAYING")return e;const o=e.player;if(o.dashT>0||o.dashCooldown>0)return e;const t=e.moveMag>.1?e.moveAngle:o.aimAngle,d=_t/pt,x={...o,dashT:pt,dashVx:Math.cos(t)*d,dashVy:Math.sin(t)*d,dashCooldown:yt,invuln:Math.max(o.invuln,Dt)};return{...e,player:x}}case"BOMB":{if(e.phase!=="PLAYING")return e;const o=nt(e);if(!o)return e;const t=e.player;if(t.bombs<=0)return e;const d={id:e.nextId,x:t.x,y:t.y,fuse:Tt,exploding:0};return{...rt(e,{...o,bombs:[...o.bombs,d]}),nextId:e.nextId+1,player:{...t,bombs:t.bombs-1},bombAt:performance.now()}}case"CONFIRM":{if(e.phase==="TITLE"||e.phase==="DEAD"||e.phase==="VICTORY")return Le(Ue());if(e.phase==="ITEM_PICKUP")return e.pendingPickup?pn(e,e.pendingPickup):{...e,phase:"PLAYING"};if(e.phase==="FLOOR_CLEAR"){const o=e.floorIndex+1;return o>=Qe.length?{...e,phase:"VICTORY"}:Le(cn(e,o))}return e}case"TICK":return hn(e,r);default:return e}}function pn(e,r){const o={...e.player,items:{...e.player.items}};o.items[r.kind]=(o.items[r.kind]??0)+1,r.kind==="heart"&&(o.maxHp=o.maxHp+1,o.hp=o.maxHp);const t=nt(e);return{...t?rt(e,{...t,pickups:t.pickups.filter(x=>x.id!==r.id)}):e,phase:"PLAYING",player:o,pendingPickup:null,pickupAt:performance.now(),lightbarFlash:{r:200,g:80,b:255,at:performance.now()}}}function hn(e,r){if(e.phase==="TITLE"||e.phase==="PAUSED"||e.phase==="DEAD"||e.phase==="VICTORY"||e.phase==="ITEM_PICKUP")return e;const{dt:o,now:t,aimAngle:d,aimMag:x,r2:m,l2:v,dpad:A,moveAngle:b,moveMag:R}=r;if(e.phase==="ROOM_TRANSITION"){const a=e.transitionT-o;return a<=0?{...e,phase:"PLAYING",transitionT:0,transitionDir:null}:{...e,transitionT:a}}if(e.phase==="FLOOR_CLEAR"){const a=e.phaseTimer-o;return{...e,phaseTimer:a}}const y=e.floor;if(!y)return e;const p=y.rooms.get(y.currentKey);if(!p)return e;const T=ln(e.player);let l={...e.player};l.dashT=Math.max(0,l.dashT-o),l.dashCooldown=Math.max(0,l.dashCooldown-o),l.invuln=Math.max(0,l.invuln-o),l.fireCooldown=Math.max(0,l.fireCooldown-o);let X=0,$=0;if(l.dashT>0)X=l.dashVx*o,$=l.dashVy*o;else{const a=v>.25,i=T.speed*(a?Ct:1);R>0&&(X=Math.cos(b)*i*o*R,$=Math.sin(b)*i*o*R)}const u=p.cleared,_=de/2-S,G=Math.abs(l.x-D/2)<=_,J=Math.abs(l.y-C/2)<=_,Y=u&&p.neighbors.has("W")&&J,K=u&&p.neighbors.has("E")&&J,z=u&&p.neighbors.has("N")&&G,je=u&&p.neighbors.has("S")&&G,De=Y?S:h+S,Fe=K?D-S:D-h-S,Ne=z?S:h+S,s=je?C-S:C-h-S;l.x=ke(l.x+X,De,Fe),l.y=ke(l.y+$,Ne,s);for(const a of p.pillars){const i=mt(l.x,l.y,S,a.x*h,a.y*h,h,h);i.hit&&(l.x=i.x,l.y=i.y)}let c=l.aimAngle;if(x>0)c=d;else{let a=0,i=0;A.up&&(i-=1),A.down&&(i+=1),A.left&&(a-=1),A.right&&(a+=1),a!==0||i!==0?c=Math.atan2(i,a):c=e.aimLast}l.aimAngle=c;const M=m>Kt?zt*T.fireRateMult:m>Gt?Ht*T.fireRateMult:0,I=[...p.bullets];M>0&&l.fireCooldown<=0&&(I.push({id:e.nextId,x:l.x+Math.cos(c)*(S+2),y:l.y+Math.sin(c)*(S+2),vx:Math.cos(c)*gt,vy:Math.sin(c)*gt,ttl:Yt,damage:T.damage,friendly:!0,pierce:T.pierce,homing:T.homing,hitIds:[]}),l.fireCooldown=1/M);let g=e.nextId;I.length!==p.bullets.length&&(g+=1);const O=[],F={player:l,dt:o,nextId:g,nextBullets:O},L=p.enemies.map(a=>{const i={...a};return an(i,F)});g=F.nextId;for(const a of L){a.x=ke(a.x,h+a.radius,D-h-a.radius),a.y=ke(a.y,h+a.radius,C-h-a.radius);for(const i of p.pillars){const P=mt(a.x,a.y,a.radius,i.x*h,i.y*h,h,h);P.hit&&(a.x=P.x,a.y=P.y)}}const W=[...I,...O],k=[];let N=e.hitAt,j=e.killAt;const B=[...p.particles],ne=[...p.popups];let q=e.runStats.damageTaken,re=e.runStats.kills;for(const a of W){const i={...a,x:a.x+a.vx*o,y:a.y+a.vy*o,ttl:a.ttl-o,hitIds:a.hitIds.slice()};if(i.ttl<=0)continue;if(i.x<h||i.x>D-h||i.y<h||i.y>C-h){ce(B,i.x,i.y,i.friendly?"#48aff0":"#ff6060",3,g),g+=3;continue}let P=!1;for(const U of p.pillars)if(i.x>=U.x*h&&i.x<=U.x*h+h&&i.y>=U.y*h&&i.y<=U.y*h+h){ce(B,i.x,i.y,i.friendly?"#48aff0":"#ff6060",3,g),g+=3,P=!0;break}if(!P)if(i.friendly){if(i.homing&&L.length>0){let w=L[0],ge=te(i.x,i.y,w.x,w.y);for(const We of L){const at=te(i.x,i.y,We.x,We.y);at<ge&&(ge=at,w=We)}const jt=Ie(i.x,i.y,w.x,w.y),st=Math.atan2(i.vy,i.vx);let Oe=jt-st;for(;Oe>Math.PI;)Oe-=Math.PI*2;for(;Oe<-Math.PI;)Oe+=Math.PI*2;const St=ke(Oe,-4*o,4*o),ot=st+St,it=Math.hypot(i.vx,i.vy);i.vx=Math.cos(ot)*it,i.vy=Math.sin(ot)*it}let U=!1;for(const w of L){if(w.hp<=0||i.hitIds.includes(w.id))continue;const ge=w.radius+Ze;if(te(i.x,i.y,w.x,w.y)<ge*ge)if(w.hp-=i.damage,w.flash=1,ce(B,i.x,i.y,"#fff",4,g),g+=4,ne.push({id:g++,x:w.x+H(-6,6),y:w.y-w.radius,vy:-40,life:.55,maxLife:.55,value:i.damage,kind:w.hp<=0?"kill":"hit"}),w.hp<=0&&(re+=1,j=t,ce(B,w.x,w.y,pe[w.kind].color,8,g),g+=8),i.pierce)i.hitIds.push(w.id);else{U=!0;break}}U||k.push(i)}else{if(l.invuln<=0){const U=S+Je;if(te(i.x,i.y,l.x,l.y)<U*U){l.hp-=i.damage,N=t,l.invuln=Ye,q+=i.damage,ce(B,l.x,l.y,"#ff4d6d",6,g),g+=6;continue}}k.push(i)}}if(l.invuln<=0)for(const a of L){if(a.hp<=0||a.kind==="shooter"||a.kind==="turret")continue;const i=a.radius+S;if(te(l.x,l.y,a.x,a.y)<i*i){l.hp-=1,N=t,l.invuln=Ye,q+=1,ce(B,l.x,l.y,"#ff4d6d",6,g),g+=6;break}}if(l.invuln<=0)for(const a of L){if(a.kind!=="boss"||a.hp<=0)continue;const i=a.radius+S;if(te(l.x,l.y,a.x,a.y)<i*i){l.hp-=2,N=t,l.invuln=Ye,q+=2,ce(B,l.x,l.y,"#ff4d6d",8,g),g+=8;break}}const he=L.filter(a=>a.hp>0),fe=[];let ue=e.explosionAt;for(const a of p.bombs){const i={...a};if(i.exploding===0){if(i.fuse-=o,i.fuse<=0){i.exploding=Nt,ue=t;for(const P of he)te(i.x,i.y,P.x,P.y)<Ge*Ge&&(P.hp-=ft,P.flash=1,ne.push({id:g++,x:P.x+H(-6,6),y:P.y-P.radius,vy:-40,life:.55,maxLife:.55,value:ft,kind:P.hp<=0?"kill":"hit"}),P.hp<=0&&(re+=1,j=t,ce(B,P.x,P.y,pe[P.kind].color,8,g),g+=8));l.invuln<=0&&te(i.x,i.y,l.x,l.y)<xt*xt&&(l.hp-=ut,N=t,l.invuln=Ye,q+=ut),ce(B,i.x,i.y,"#ffb040",16,g),g+=16}}else if(i.exploding-=o,i.exploding<=0)continue;fe.push(i)}const se=he;let Q=e.pendingPickup,oe=e.phase;const ie=[];for(const a of p.pickups){const i=S+14;te(l.x,l.y,a.x,a.y)<i*i?(Q=a,oe="ITEM_PICKUP",ie.push({...a,bob:a.bob+o*4})):ie.push({...a,bob:a.bob+o*4})}const be=[];for(const a of B){const i=a.life-o;i<=0||be.push({...a,x:a.x+a.vx*o,y:a.y+a.vy*o,life:i})}const ae=[];for(const a of ne){const i=a.life-o;i<=0||ae.push({...a,y:a.y+a.vy*o,life:i})}let le=p.cleared,ye=e.doorClearedAt,Te=e.runStats.roomsCleared,xe=ie;!le&&se.length===0&&p.type!=="START"&&(le=!0,ye=t,Te+=1,p.type==="COMBAT"&&!p.pickupSpawned&&Math.random()<.28&&(xe=[...ie,Et(kt(),g,D/2,C/2)],g+=1));let ve=y.currentKey,V=null,Z=y;if(le)for(const a of p.neighbors){const i=tt(a);if(l.x>i.x-2&&l.x<i.x+i.w+2&&l.y>i.y-2&&l.y<i.y+i.h+2){const{dc:P,dr:U}=Ke(a),w=me(p.col+P,p.row+U);if(y.rooms.has(w)){ve=w,V=a;const ge=en($t(a));l.x=ge.x,l.y=ge.y,l.invuln=Math.max(l.invuln,.3),oe="ROOM_TRANSITION";break}}}const ee={...p,bullets:V?[]:k,enemies:se,bombs:V?[]:fe,pickups:xe,particles:V?[]:be,popups:V?[]:ae,cleared:le},$e=new Map(y.rooms);if($e.set(y.currentKey,ee),V){const a=$e.get(ve);$e.set(ve,{...a,visited:!0,bullets:[],bombs:[],particles:[],popups:[]})}Z={...y,rooms:$e,currentKey:ve};let Ae={...e,player:l,floor:Z,phase:oe,transitionDir:V,transitionT:V?Xt:0,pendingPickup:Q,hitAt:N,killAt:j,doorClearedAt:ye,explosionAt:ue,aimLast:l.aimAngle,moveAngle:b,moveMag:R,l2:r.l2,elapsedMs:e.elapsedMs+o*1e3,nextId:g,runStats:{...e.runStats,kills:re,damageTaken:q,roomsCleared:Te}};return V&&(Ae=Le(Ae)),l.hp<=0?{...Ae,phase:"DEAD",phaseTimer:0}:ee.type==="BOSS"&&ee.cleared&&ee.enemies.length===0?{...Ae,phase:"FLOOR_CLEAR",phaseTimer:qt}:Ae}function ce(e,r,o,t,d,x){for(let m=0;m<d;m++){const v=Math.random()*Math.PI*2,A=H(60,180);e.push({id:x+m,x:r,y:o,vx:Math.cos(v)*A,vy:Math.sin(v)*A,life:H(.15,.4),maxLife:.4,color:t,size:H(2,3.5)})}}function fn(e){e.startTestTone("speaker","100hz").catch(()=>{}),setTimeout(()=>e.stopTestTone().catch(()=>{}),80)}function un(e){e.startTestTone("speaker","1khz").catch(()=>{}),setTimeout(()=>e.stopTestTone().catch(()=>{}),25)}function xn(e){e.startTestTone("speaker","1khz").catch(()=>{}),setTimeout(()=>{e.stopTestTone().catch(()=>{}),setTimeout(()=>{e.startTestTone("speaker","1khz").catch(()=>{}),setTimeout(()=>e.stopTestTone().catch(()=>{}),60)},50)},50)}function gn(e){e.startTestTone("speaker","100hz").catch(()=>{}),setTimeout(()=>e.stopTestTone().catch(()=>{}),30)}function mn(e){e.startTestTone("speaker","100hz").catch(()=>{}),setTimeout(()=>e.stopTestTone().catch(()=>{}),160)}function Xe(e){const r=e%1100;return r<140?.06:r<280?0:r<380?.035:0}function bn(e){e.startTestTone("speaker","1khz").catch(()=>{}),setTimeout(()=>e.stopTestTone().catch(()=>{}),45)}function yn(e){const r=[0,90,180,280];r.forEach((o,t)=>{setTimeout(()=>{e.startTestTone("speaker","1khz").catch(()=>{}),setTimeout(()=>e.stopTestTone().catch(()=>{}),t===r.length-1?220:70)},o)})}function Tn(e){e.startTestTone("speaker","100hz").catch(()=>{}),setTimeout(()=>e.stopTestTone().catch(()=>{}),500)}function vn(e){const r=[0,140,280,420,600];r.forEach((o,t)=>{setTimeout(()=>{e.startTestTone("speaker","1khz").catch(()=>{}),setTimeout(()=>e.stopTestTone().catch(()=>{}),t===r.length-1?300:100)},o)})}const $n=Re`
  0%, 100% { opacity: 0.55; }
  50% { opacity: 1; }
`,_e=Re`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`,An=Re`
  0%, 100% { transform: translate(-50%, calc(-50% - 2px)); }
  50% { transform: translate(-50%, calc(-50% + 2px)); }
`;Re`
  0%, 100% { box-shadow: 0 0 12px rgba(255, 100, 220, 0.5); }
  50% { box-shadow: 0 0 24px rgba(255, 100, 220, 0.9); }
`;const En=Re`
  0%, 100% { box-shadow: 0 0 18px rgba(255, 80, 170, 0.6); }
  50% { box-shadow: 0 0 36px rgba(255, 80, 170, 1); }
`,kn=Re`
  0%, 100% { background: rgba(255, 60, 60, 0); }
  50% { background: rgba(255, 60, 60, 0.2); }
`,wn=f.div`
  max-width: 640px;
  margin: 0 auto;
  padding: 40px 24px 80px;
`,Mn=f.div`
  margin-bottom: 24px;
`,In=f.h1`
  margin-bottom: 4px;
`,Rn=f.p`
  color: rgba(191, 204, 214, 0.5);
  font-size: 15px;
  margin: 0;
`,jn=f.div`
  padding: 20px;
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`,Sn=f.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  z-index: 10;
`,Pn=f.div`
  padding: 6px 14px;
  background: rgba(10, 10, 20, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: rgba(191, 204, 214, 0.7);
  font-size: 12px;
  white-space: nowrap;
`,Ln=f.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: ${e=>e.$inactive?.3:1};
  filter: ${e=>e.$inactive?"grayscale(0.8)":"none"};
  pointer-events: ${e=>e.$inactive?"none":"auto"};
  transition: opacity 0.2s, filter 0.2s;
`,On=f.div`
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 0 0 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 13px;
  font-family: "Fira Code", monospace;
  color: rgba(191, 204, 214, 0.7);
`,He=f.span`
  white-space: nowrap;
`,Cn=f.span`
  display: inline-flex;
  gap: 4px;
  align-items: center;
`,_n=f.span`
  font-size: 14px;
  color: ${e=>e.$alive?e.$low?"rgba(255, 80, 80, 0.95)":"rgba(255, 80, 120, 0.95)":"rgba(191, 204, 214, 0.2)"};
  text-shadow: ${e=>e.$alive&&e.$low?"0 0 5px rgba(255, 80, 80, 0.7)":"none"};
  transition: color 0.2s, text-shadow 0.2s;
`,Dn=f.span`
  flex: 1;
`,Fn=f.div`
  position: relative;
  width: ${D}px;
  height: ${C}px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  background:
    radial-gradient(circle at 20% 20%, rgba(60, 40, 80, 0.22) 0%, transparent 55%),
    radial-gradient(circle at 80% 70%, rgba(40, 60, 90, 0.18) 0%, transparent 55%),
    linear-gradient(135deg, #10141e 0%, #0a0c16 100%);
  overflow: hidden;
  max-width: 100%;
  will-change: transform;

  @media (max-width: 600px) {
    width: 100%;
    height: auto;
    aspect-ratio: ${D} / ${C};
  }
`,Nn=Re`
  0%, 100% { opacity: 0.35; }
  50% { opacity: 0.7; }
`,Bn=f.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse at center,
    transparent 45%,
    rgba(180, 30, 50, 0.35) 80%,
    rgba(180, 30, 50, 0.6) 100%
  );
  animation: ${Nn} 1.1s ease-in-out infinite;
  z-index: 50;
`;f.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  &::before,
  &::after,
  span {
    position: absolute;
    background: linear-gradient(180deg, #26334a, #1a2234);
    box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.35);
  }
`;const Yn=f.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: ${h}px;
  background: linear-gradient(180deg, #26334a, #1a2234);
  box-shadow: inset 0 -2px 3px rgba(0, 0, 0, 0.4);
  pointer-events: none;
`,Un=f.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: ${h}px;
  background: linear-gradient(0deg, #26334a, #1a2234);
  box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.4);
  pointer-events: none;
`,Hn=f.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: ${h}px;
  background: linear-gradient(90deg, #26334a, #1a2234);
  box-shadow: inset -2px 0 3px rgba(0, 0, 0, 0.4);
  pointer-events: none;
`,zn=f.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: ${h}px;
  background: linear-gradient(-90deg, #26334a, #1a2234);
  box-shadow: inset 2px 0 3px rgba(0, 0, 0, 0.4);
  pointer-events: none;
`,Gn=f.div`
  position: absolute;
  width: ${h}px;
  height: ${h}px;
  background: linear-gradient(135deg, #3a4866, #1f2738);
  border: 1px solid rgba(120, 140, 180, 0.25);
  border-radius: 4px;
  box-shadow:
    inset 2px 2px 2px rgba(255, 255, 255, 0.05),
    inset -2px -2px 3px rgba(0, 0, 0, 0.5);
  pointer-events: none;
`,Kn=f.div`
  position: absolute;
  background: ${e=>e.$open?e.$kind==="BOSS"?"linear-gradient(180deg, rgba(255, 50, 120, 0.45), rgba(160, 20, 70, 0.35))":e.$kind==="TREASURE"?"linear-gradient(180deg, rgba(255, 200, 60, 0.45), rgba(180, 120, 20, 0.35))":"linear-gradient(180deg, rgba(60, 240, 140, 0.4), rgba(20, 160, 80, 0.25))":"linear-gradient(180deg, rgba(200, 60, 60, 0.55), rgba(120, 20, 20, 0.4))"};
  border: 1px solid
    ${e=>e.$open?e.$kind==="BOSS"?"rgba(255, 120, 180, 0.7)":e.$kind==="TREASURE"?"rgba(255, 220, 120, 0.7)":"rgba(120, 255, 180, 0.55)":"rgba(255, 120, 120, 0.55)"};
  box-shadow: 0 0 10px
    ${e=>e.$open?e.$kind==="BOSS"?"rgba(255, 80, 160, 0.6)":e.$kind==="TREASURE"?"rgba(255, 200, 80, 0.55)":"rgba(60, 220, 140, 0.5)":"rgba(220, 80, 80, 0.5)"};
  pointer-events: none;
  transition: all 0.25s ease;
`,qe=f.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 700;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.7);
`,Wn=f.div`
  position: absolute;
  width: ${S*2}px;
  height: ${S*2}px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 35% 35%,
    #f0f4ff,
    #a0b0d8 70%,
    #6070a0
  );
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow:
    0 0 8px rgba(180, 200, 255, 0.4),
    inset 1px 1px 2px rgba(255, 255, 255, 0.5);
  pointer-events: none;
  transform: translate(-50%, -50%);
  opacity: ${e=>e.$invuln?.55:1};
  filter: ${e=>e.$dashing?"brightness(1.3) blur(0.4px)":"none"};
  transition: opacity 0.08s;
`,Vn=f.div`
  position: absolute;
  width: ${(S+5)*2}px;
  height: ${(S+5)*2}px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  -webkit-mask: radial-gradient(
    circle,
    transparent ${S+2}px,
    black ${S+3}px
  );
  mask: radial-gradient(
    circle,
    transparent ${S+2}px,
    black ${S+3}px
  );
`,Xn=f.div`
  position: absolute;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(120, 200, 255, 0.55),
    rgba(120, 200, 255, 0)
  );
  transform-origin: 0 50%;
  pointer-events: none;
`,qn=f.div`
  position: absolute;
  width: 24px;
  height: 2px;
  background: linear-gradient(
    90deg,
    rgba(180, 220, 255, 0.15),
    rgba(180, 220, 255, 0.75)
  );
  transform-origin: 0 50%;
  pointer-events: none;
  border-radius: 2px;
`,Rt=f.div`
  position: absolute;
  width: ${e=>e.$radius*2}px;
  height: ${e=>e.$radius*2}px;
  border-radius: ${e=>e.$kind==="turret"?"20%":"50%"};
  background: ${e=>{const r=pe[e.$kind].color;return`radial-gradient(circle at 30% 30%, ${r}dd, ${r}88 65%, ${r}55)`}};
  border: 1px solid rgba(0, 0, 0, 0.4);
  pointer-events: none;
  transform: translate(-50%, -50%);
  box-shadow:
    ${e=>e.$flash>0?`0 0 ${8+e.$flash*14}px rgba(255, 60, 60, ${.3+e.$flash*.6})`:`0 0 6px ${pe[e.$kind].color}55`};
  filter: ${e=>e.$flash>0?`brightness(${1+e.$flash*1.2}) saturate(${1+e.$flash*.6})`:"none"};
`,Zn=f(Rt)`
  animation: ${En} 1.6s ease-in-out infinite;
`,Jn=f.div`
  position: absolute;
  width: ${e=>e.$friendly?Ze*2:Je*2}px;
  height: ${e=>e.$friendly?Ze*2:Je*2}px;
  border-radius: 50%;
  background: ${e=>e.$friendly?"radial-gradient(circle, #ffffff, #f0d060 55%, #c08020 90%)":"radial-gradient(circle, #ffe0e0, #ff6060 55%, #a02020)"};
  box-shadow: 0 0 ${e=>e.$friendly?6:7}px
    ${e=>e.$friendly?"rgba(255, 200, 80, 0.75)":"rgba(255, 100, 100, 0.7)"};
  pointer-events: none;
  transform: translate(-50%, -50%);
`,Qn=f.div`
  position: absolute;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    ${e=>e.$color}ee,
    ${e=>e.$color}55 70%,
    transparent
  );
  border: 1.5px solid ${e=>e.$color};
  box-shadow: 0 0 10px ${e=>e.$color}aa;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
  animation: ${An} 1.4s ease-in-out infinite;
`,er=f.div`
  position: absolute;
  width: ${e=>e.$exploding?Ge*2:18}px;
  height: ${e=>e.$exploding?Ge*2:18}px;
  border-radius: 50%;
  background: ${e=>e.$exploding?"radial-gradient(circle, rgba(255, 220, 160, 0.9), rgba(255, 120, 40, 0.5) 55%, transparent)":"radial-gradient(circle, #1a1a1a, #0a0a0a 60%, #000)"};
  border: ${e=>e.$exploding?"none":"1.5px solid rgba(255, 150, 60, 0.85)"};
  box-shadow: ${e=>e.$exploding?"0 0 40px rgba(255, 180, 80, 0.6)":`0 0 ${4+(1-e.$fuse/Tt)*10}px rgba(255, 120, 40, 0.6)`};
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: width 0.08s, height 0.08s;
`,tr=f.div`
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
`,nr=f.div`
  position: absolute;
  pointer-events: none;
  transform: translate(-50%, -50%);
  font-weight: 800;
  font-size: ${e=>e.$kind==="kill"?"15px":"12px"};
  color: ${e=>e.$kind==="kill"?"#ffd060":"#ffffff"};
  text-shadow:
    0 0 3px rgba(0, 0, 0, 0.9),
    0 1px 2px rgba(0, 0, 0, 0.8);
  letter-spacing: 0.5px;
  white-space: nowrap;
`,Pe=f.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  background: ${e=>e.$dim?"rgba(0, 0, 0, 0.65)":"transparent"};
  z-index: 5;
  pointer-events: none;
`,rr=f.div`
  font-size: 36px;
  font-weight: 700;
  color: rgba(255, 200, 220, 0.92);
  letter-spacing: 6px;
  margin-bottom: 16px;
  animation: ${_e} 0.4s ease;
  text-shadow: 0 0 16px rgba(255, 100, 180, 0.45);
`,Ee=f.div`
  font-size: 13px;
  color: rgba(191, 204, 214, 0.55);
  line-height: 1.7;
  margin-bottom: 24px;
  font-family: "Fira Code", monospace;
`,ze=f.div`
  font-size: 14px;
  color: rgba(72, 175, 240, 0.8);
  animation: ${$n} 1.6s ease-in-out infinite;
`,sr=f.div`
  font-size: 30px;
  font-weight: 700;
  color: rgba(255, 80, 80, 0.92);
  letter-spacing: 4px;
  margin-bottom: 8px;
  animation: ${_e} 0.4s ease;
`,or=f.div`
  font-size: 26px;
  font-weight: 700;
  color: rgba(255, 200, 80, 0.95);
  letter-spacing: 3px;
  animation: ${_e} 0.3s ease;
`,ir=f.div`
  font-size: 34px;
  font-weight: 700;
  color: #ffc44f;
  letter-spacing: 5px;
  margin-bottom: 12px;
  animation: ${_e} 0.4s ease;
`,ar=f.div`
  font-size: 24px;
  font-weight: 600;
  color: rgba(191, 204, 214, 0.85);
  letter-spacing: 3px;
`,lr=f.div`
  font-size: 22px;
  font-weight: 700;
  color: rgba(200, 160, 255, 0.95);
  letter-spacing: 2px;
  margin-bottom: 8px;
  animation: ${_e} 0.3s ease;
`,cr=f.div`
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
`,dr=f.div`
  position: absolute;
  top: ${h+4}px;
  right: ${h+4}px;
  display: grid;
  grid-template-columns: repeat(${Me}, 14px);
  grid-template-rows: repeat(${Me}, 14px);
  gap: 2px;
  padding: 6px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  pointer-events: none;
`,pr=f.div`
  width: 14px;
  height: 14px;
  border-radius: 2px;
  background: ${e=>e.$state==="empty"?"transparent":e.$state==="current"?e.$type==="BOSS"?"rgba(255, 100, 180, 0.95)":e.$type==="TREASURE"?"rgba(255, 200, 80, 0.95)":"rgba(120, 200, 255, 0.95)":e.$state==="visited"?e.$type==="BOSS"?"rgba(160, 50, 100, 0.6)":e.$type==="TREASURE"?"rgba(180, 140, 40, 0.6)":"rgba(80, 120, 180, 0.5)":e.$type==="BOSS"?"rgba(100, 30, 70, 0.3)":e.$type==="TREASURE"?"rgba(130, 100, 30, 0.3)":"rgba(50, 70, 100, 0.25)"};
  border: ${e=>e.$state==="current"?"1px solid rgba(255, 255, 255, 0.85)":e.$state==="empty"?"none":"1px solid rgba(255, 255, 255, 0.1)"};
  position: relative;

  &::after {
    content: ${e=>e.$state==="empty"?"''":e.$type==="BOSS"?"'!'":e.$type==="TREASURE"?"'?'":"''"};
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.9);
  }
`,hr=f.div`
  position: absolute;
  top: ${h+4}px;
  left: ${h+4}px;
  right: ${h+120}px;
  height: 8px;
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(255, 120, 180, 0.4);
  border-radius: 3px;
  overflow: hidden;
  pointer-events: none;
`,fr=f.div`
  height: 100%;
  width: ${e=>e.$ratio*100}%;
  background: linear-gradient(90deg, #ff3380, #ff77aa);
  box-shadow: 0 0 6px rgba(255, 100, 180, 0.5);
  transition: width 0.15s;
`,ur=f.div`
  position: absolute;
  inset: 0;
  background: rgba(6, 8, 16, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 6;
`,xr=f.div`
  font-size: 18px;
  color: rgba(191, 204, 214, 0.9);
  letter-spacing: 3px;
  margin-bottom: 16px;
  font-family: "Fira Code", monospace;
`,gr=f.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 24px;
  width: 100%;
  max-width: 380px;
`,mr=f.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-radius: 4px;
  background: ${e=>e.$owned?"rgba(255, 255, 255, 0.04)":"transparent"};
  opacity: ${e=>e.$owned?1:.4};
  font-size: 12px;
  font-family: "Fira Code", monospace;
`,br=f.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${e=>e.$color}cc;
  border: 1px solid ${e=>e.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #fff;
  font-size: 12px;
  flex-shrink: 0;
  box-shadow: 0 0 4px ${e=>e.$color}88;
`,yr=f.div`
  flex: 1;
  color: rgba(191, 204, 214, 0.9);
`,Tr=f.div`
  color: rgba(72, 175, 240, 0.9);
  font-weight: 700;
`,vr=f.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 4;
  opacity: ${e=>e.$on?1:0};
  animation: ${e=>e.$on?Lt`
          ${kn} 0.28s ease-out 1
        `:"none"};
`,$r=f.div`
  margin-top: 32px;
  color: rgba(191, 204, 214, 0.65);
  font-size: 14px;
  line-height: 1.65;
`,bt=f.h3`
  color: rgba(191, 204, 214, 0.85);
  font-size: 15px;
  margin: 24px 0 8px;
  &:first-child {
    margin-top: 0;
  }
`,Ar=f.ul`
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
`,wr=()=>{var K,z,je,De,Fe,Ne;const e=E.useContext(Pt),[r,o]=E.useState(!!((K=e==null?void 0:e.connection)!=null&&K.state)),[t,d]=E.useReducer(dn,void 0,()=>It()),x=E.useRef(t);x.current=t;const m=E.useRef(0),v=E.useRef("TITLE"),A=E.useRef(0),b=E.useRef(0),R=E.useRef(0),y=E.useRef(0),p=E.useRef(0),T=E.useRef(0),[,l]=E.useState(0);E.useEffect(()=>{if(!(e!=null&&e.connection))return;const s=()=>o(!!e.connection.state);return s(),e.connection.on("change",s),()=>{e.connection.removeListener("change",s)}},[e]),E.useEffect(()=>{if(!(e!=null&&e.cross))return;const s=()=>{const{phase:c}=x.current;c==="TITLE"||c==="DEAD"||c==="VICTORY"||c==="ITEM_PICKUP"||c==="FLOOR_CLEAR"?d({type:"CONFIRM"}):c==="PLAYING"&&d({type:"DASH"})};return e.cross.on("press",s),()=>{e.cross.off("press",s)}},[e]),E.useEffect(()=>{if(!(e!=null&&e.square))return;const s=()=>d({type:"BOMB"});return e.square.on("press",s),()=>{e.square.off("press",s)}},[e]),E.useEffect(()=>{if(!(e!=null&&e.triangle))return;const s=()=>d({type:"TOGGLE_PAUSE"});return e.triangle.on("press",s),()=>{e.triangle.off("press",s)}},[e]),E.useEffect(()=>{if(!(e!=null&&e.circle))return;const s=()=>d({type:"TOGGLE_INVENTORY"});return e.circle.on("press",s),()=>{e.circle.off("press",s)}},[e]),E.useEffect(()=>{var c;if(!((c=e==null?void 0:e.dpad)!=null&&c.up))return;const s=()=>d({type:"TOGGLE_MAP"});return e.dpad.up.on("press",s),()=>{e.dpad.up.off("press",s)}},[e]),E.useEffect(()=>{if(!e||!["PLAYING","ROOM_TRANSITION","FLOOR_CLEAR"].includes(t.phase))return;let c=performance.now(),M=0,I=0,g=0,O=0;const F=1e3/60;let L=0;const W=k=>{var B,ne,q,re,he,fe,ue,se,Q,oe,ie,be,ae,le,ye,Te,xe,ve,V;const N=k-c;for(c=k,L=Math.min(L+N,F*3);L>=F;){const Z=e.left.analog,ee=e.right.analog,$e=Z.magnitude>Wt?Z.magnitude:0,Ae=$e>0?-Z.angle:0,a=ee.magnitude>Vt?ee.magnitude:0,i=a>0?-ee.angle:0,P=e.right.trigger.state??0,U=e.left.trigger.state??0,w={up:!!((ne=(B=e.dpad)==null?void 0:B.up)!=null&&ne.active),down:!!((re=(q=e.dpad)==null?void 0:q.down)!=null&&re.active),left:!!((fe=(he=e.dpad)==null?void 0:he.left)!=null&&fe.active),right:!!((se=(ue=e.dpad)==null?void 0:ue.right)!=null&&se.active)};d({type:"TICK",dt:1/60,now:k,moveAngle:Ae,moveMag:$e,aimAngle:i,aimMag:a,r2:P,l2:U,dpad:w}),L-=F}const j=x.current;if(k-M>100&&(M=k,j.phase==="PLAYING"&&j.player.hp===1?e.left.rumble(Xe(k)):e.left.rumble(0)),k-I>100){if(I=k,j.lightbarFlash&&k-j.lightbarFlash.at<260)(Q=e.lightbar)==null||Q.set({r:j.lightbarFlash.r,g:j.lightbarFlash.g,b:j.lightbarFlash.b});else if(j.phase==="PLAYING"||j.phase==="ROOM_TRANSITION"){const Z=j.player.hp/Math.max(1,j.player.maxHp);if(Z>.6)(oe=e.lightbar)==null||oe.set({r:20,g:200,b:80});else if(Z>.3)(ie=e.lightbar)==null||ie.set({r:220,g:160,b:0});else if(j.player.hp>1)(be=e.lightbar)==null||be.set({r:220,g:60,b:30});else{const ee=Math.floor(k/180)%2;(ae=e.lightbar)==null||ae.set(ee===0?{r:255,g:0,b:0}:{r:50,g:0,b:0})}}}k-g>200&&(g=k,(j.phase==="PLAYING"||j.phase==="ROOM_TRANSITION")&&((Te=(ye=(le=e.right)==null?void 0:le.trigger)==null?void 0:ye.feedback)==null||Te.set({effect:Be.TriggerEffect.Weapon,start:.18,end:.5,strength:.75}),(V=(ve=(xe=e.left)==null?void 0:xe.trigger)==null?void 0:ve.feedback)==null||V.set({effect:Be.TriggerEffect.Feedback,position:.25,strength:.5}))),k-O>16&&(O=k,l(Z=>(Z+1)%1e6)),m.current=requestAnimationFrame(W)};return m.current=requestAnimationFrame(W),()=>{var k,N;cancelAnimationFrame(m.current),(k=e.left)==null||k.rumble(0),(N=e.right)==null||N.rumble(0)}},[e,t.phase]),E.useEffect(()=>{if(!e||t.hitAt===0||t.hitAt===A.current)return;A.current=t.hitAt,fn(e),e.left.rumble(.8);const s=setTimeout(()=>{x.current.phase==="PLAYING"&&e.left.rumble(x.current.player.hp===1?Xe(performance.now()):0)},250);return()=>clearTimeout(s)},[e,t.hitAt]),E.useEffect(()=>{if(!e||t.killAt===0||t.killAt===b.current)return;const s=b.current;if(b.current=t.killAt,t.killAt-s<45)return;un(e),e.right.rumble(.4);const c=setTimeout(()=>{e.right.rumble(0)},60);return()=>clearTimeout(c)},[e,t.killAt]),E.useEffect(()=>{e&&(t.pickupAt===0||t.pickupAt===R.current||(R.current=t.pickupAt,xn(e)))},[e,t.pickupAt]),E.useEffect(()=>{e&&(t.bombAt===0||t.bombAt===y.current||(y.current=t.bombAt,gn(e)))},[e,t.bombAt]),E.useEffect(()=>{if(!e||t.explosionAt===0||t.explosionAt===p.current)return;p.current=t.explosionAt,mn(e),e.left.rumble(.6),e.right.rumble(.8);const s=setTimeout(()=>{e.left.rumble(x.current.player.hp===1?Xe(performance.now()):0),e.right.rumble(0)},220);return()=>clearTimeout(s)},[e,t.explosionAt]),E.useEffect(()=>{if(!e||t.doorClearedAt===0||t.doorClearedAt===T.current)return;T.current=t.doorClearedAt,bn(e),e.right.rumble(.3);const s=setTimeout(()=>{e.right.rumble(0)},120);return()=>clearTimeout(s)},[e,t.doorClearedAt]),E.useEffect(()=>{if(e!=null&&e.playerLeds){if(t.phase==="VICTORY"){for(let s=0;s<5;s++)e.playerLeds.setLed(s,!0);return}if(t.phase==="TITLE"||t.phase==="DEAD"){e.playerLeds.clear();return}for(let s=0;s<5;s++)e.playerLeds.setLed(s,s<t.floorIndex+1)}},[e,t.floorIndex,t.phase]),E.useEffect(()=>{var c;if(!(e!=null&&e.mute))return;if(t.phase==="PAUSED"){e.mute.setLed(Be.MuteLedMode.Pulse);return}if(t.phase!=="PLAYING"&&t.phase!=="ROOM_TRANSITION"){e.mute.resetLed();return}const s=(c=t.floor)==null?void 0:c.rooms.get(t.floor.currentKey);s&&!s.cleared?e.mute.setLed(Be.MuteLedMode.On):e.mute.resetLed()},[e,t.phase,(z=t.floor)==null?void 0:z.currentKey,t.floor]),E.useEffect(()=>{var M,I,g,O,F,L,W,k,N,j,B,ne,q,re,he,fe,ue;if(!e)return;const s=v.current,c=t.phase;if(v.current=c,s!==c){if(c==="FLOOR_CLEAR"){yn(e),(M=e.lightbar)==null||M.set({r:255,g:255,b:255}),e.right.rumble(.4);const se=setTimeout(()=>{e.right.rumble(0)},280);return()=>clearTimeout(se)}if(c==="VICTORY"){vn(e);const se=performance.now();let Q=0;const oe=be=>{var xe;const ae=(be-se)/1e3,le=Math.round(128+127*Math.sin(ae*2.2)),ye=Math.round(128+127*Math.sin(ae*2.2+2.094)),Te=Math.round(128+127*Math.sin(ae*2.2+4.188));(xe=e.lightbar)==null||xe.set({r:le,g:ye,b:Te}),Q=requestAnimationFrame(oe)};Q=requestAnimationFrame(oe);const ie=setTimeout(()=>cancelAnimationFrame(Q),6e3);return()=>{cancelAnimationFrame(Q),clearTimeout(ie)}}c==="DEAD"&&(Tn(e),(I=e.lightbar)==null||I.set({r:120,g:0,b:0}),e.left.rumble(0),e.right.rumble(0),(F=(O=(g=e.right)==null?void 0:g.trigger)==null?void 0:O.feedback)==null||F.reset(),(k=(W=(L=e.left)==null?void 0:L.trigger)==null?void 0:W.feedback)==null||k.reset(),(N=e.mute)==null||N.resetLed()),c==="TITLE"&&(e.left.rumble(0),e.right.rumble(0),(ne=(B=(j=e.right)==null?void 0:j.trigger)==null?void 0:B.feedback)==null||ne.reset(),(he=(re=(q=e.left)==null?void 0:q.trigger)==null?void 0:re.feedback)==null||he.reset(),(fe=e.lightbar)==null||fe.set({r:30,g:20,b:60}),(ue=e.mute)==null||ue.resetLed()),c==="ITEM_PICKUP"&&(e.left.rumble(0),e.right.rumble(0))}},[e,t.phase]),E.useEffect(()=>()=>{var s,c,M,I,g,O,F,L,W,k,N,j;(s=e==null?void 0:e.left)==null||s.rumble(0),(c=e==null?void 0:e.right)==null||c.rumble(0),(g=(I=(M=e==null?void 0:e.right)==null?void 0:M.trigger)==null?void 0:I.feedback)==null||g.reset(),(L=(F=(O=e==null?void 0:e.left)==null?void 0:O.trigger)==null?void 0:F.feedback)==null||L.reset(),(W=e==null?void 0:e.lightbar)==null||W.set({r:0,g:0,b:255}),(k=e==null?void 0:e.playerLeds)==null||k.clear(),(N=e==null?void 0:e.mute)==null||N.resetLed(),(j=e==null?void 0:e.stopTestTone())==null||j.catch(()=>{}),cancelAnimationFrame(m.current)},[e]);const X=!lt||!r,$=lt?r?null:"Connect a controller to play":"Requires WebHID (Chrome, Edge, Opera)",u=((je=t.floor)==null?void 0:je.rooms.get(t.floor.currentKey))??null,_=(u==null?void 0:u.type)==="BOSS",G=_?u==null?void 0:u.enemies.find(s=>s.kind==="boss"):null,J=t.hitAt!==0&&performance.now()-t.hitAt<260,Y=[];for(let s=0;s<Me;s++)for(let c=0;c<Me;c++){const M=me(c,s),I=(De=t.floor)==null?void 0:De.rooms.get(M),g=((Fe=t.floor)==null?void 0:Fe.currentKey)===M,O=I?g?"current":I.visited?"visited":"unvisited":"empty",F=(I==null?void 0:I.type)??"empty";Y.push(n.jsx(pr,{$state:O,$type:F},`mm-${M}`))}return n.jsxs(wn,{children:[n.jsxs(Mn,{children:[n.jsx(In,{children:"Descent"}),n.jsx(Rn,{children:"Procedural roguelite. Twin-stick shoot, dodge-dash, and descend three floors of boss-gated rooms."})]}),n.jsxs(jn,{children:[$&&n.jsx(Sn,{children:n.jsx(Pn,{children:$})}),n.jsxs(Ln,{$inactive:X,children:[n.jsxs(On,{children:[n.jsx(Cn,{title:"HP",children:Array.from({length:t.player.maxHp},(s,c)=>n.jsx(_n,{$alive:c<t.player.hp,$low:t.player.hp<=1&&c<t.player.hp,children:"♥"},c))}),n.jsxs(He,{children:["💣 ",t.player.bombs]}),n.jsxs(He,{children:["Floor ",t.floorIndex+1,"/3"]}),n.jsx(Dn,{}),n.jsxs(He,{children:["Kills ",t.runStats.kills]}),n.jsxs(He,{children:["Rooms ",t.runStats.roomsCleared]})]}),n.jsxs(Fn,{style:{transform:(()=>{const s=performance.now();let c=0;const M=s-t.hitAt,I=s-t.explosionAt;if(t.hitAt>0&&M<250&&(c=Math.max(c,5*(1-M/250))),t.explosionAt>0&&I<400&&(c=Math.max(c,10*(1-I/400))),c<.1)return"none";const g=(Math.random()-.5)*c*2,O=(Math.random()-.5)*c*2;return`translate(${g.toFixed(1)}px, ${O.toFixed(1)}px)`})()},children:[n.jsx(Yn,{}),n.jsx(Un,{}),n.jsx(Hn,{}),n.jsx(zn,{}),u==null?void 0:u.pillars.map((s,c)=>n.jsx(Gn,{style:{left:`${s.x*h}px`,top:`${s.y*h}px`}},`pil-${c}`)),u&&Array.from(u.neighbors).map(s=>{var F;const c=(()=>{const{dc:L,dr:W}=Ke(s);return me(u.col+L,u.row+W)})(),M=(F=t.floor)==null?void 0:F.rooms.get(c),I=(M==null?void 0:M.type)??"COMBAT",g=tt(s),O=u.cleared;return n.jsxs(Kn,{$open:O,$kind:I,style:{left:`${g.x}px`,top:`${g.y}px`,width:`${g.w}px`,height:`${g.h}px`},children:[O&&I==="BOSS"&&n.jsx(qe,{children:"!"}),O&&I==="TREASURE"&&n.jsx(qe,{children:"?"}),!O&&n.jsx(qe,{children:"✕"})]},`door-${s}`)}),u==null?void 0:u.pickups.map(s=>{const c=Se[s.kind];return n.jsx(Qn,{$color:c.color,style:{left:`${s.x-13}px`,top:`${s.y-13}px`},title:c.label,children:c.glyph},`pu-${s.id}`)}),u==null?void 0:u.bombs.map(s=>n.jsx(er,{$fuse:s.fuse,$exploding:s.exploding>0,style:{left:`${s.x}px`,top:`${s.y}px`}},`b-${s.id}`)),u==null?void 0:u.bullets.map(s=>n.jsx(Jn,{$friendly:s.friendly,style:{left:`${s.x}px`,top:`${s.y}px`}},`bu-${s.id}`)),u==null?void 0:u.enemies.map(s=>s.kind==="boss"?n.jsx(Zn,{$kind:s.kind,$radius:s.radius,$flash:s.flash,style:{left:`${s.x}px`,top:`${s.y}px`}},`en-${s.id}`):n.jsx(Rt,{$kind:s.kind,$radius:s.radius,$flash:s.flash,style:{left:`${s.x}px`,top:`${s.y}px`}},`en-${s.id}`)),u==null?void 0:u.particles.map(s=>n.jsx(tr,{style:{left:`${s.x}px`,top:`${s.y}px`,width:`${s.size}px`,height:`${s.size}px`,background:s.color,opacity:Math.max(0,s.life/s.maxLife)}},`pt-${s.id}`)),u==null?void 0:u.popups.map(s=>{const c=s.life/s.maxLife;return n.jsx(nr,{$kind:s.kind,style:{left:`${s.x}px`,top:`${s.y}px`,opacity:Math.min(1,c*2),transform:`translate(-50%, -50%) scale(${s.kind==="kill"?1+(1-c)*.3:1})`},children:s.value},`pp-${s.id}`)}),t.phase!=="TITLE"&&t.phase!=="DEAD"&&n.jsxs(n.Fragment,{children:[t.l2>.15&&n.jsx(Xn,{style:{left:`${t.player.x}px`,top:`${t.player.y}px`,width:`${120+t.l2*120}px`,transform:`rotate(${t.player.aimAngle}rad)`,opacity:Math.min(1,(t.l2-.15)*2)}}),n.jsx(Wn,{$invuln:t.player.invuln>.05,$dashing:t.player.dashT>0,style:{left:`${t.player.x}px`,top:`${t.player.y}px`}}),t.player.dashCooldown>0&&n.jsx(Vn,{style:{left:`${t.player.x}px`,top:`${t.player.y}px`,background:`conic-gradient(from -90deg, rgba(120, 220, 255, 0.75) ${((1-t.player.dashCooldown/yt)*360).toFixed(1)}deg, transparent 0)`}}),n.jsx(qn,{style:{left:`${t.player.x}px`,top:`${t.player.y}px`,transform:`rotate(${t.player.aimAngle}rad)`}})]}),n.jsx(vr,{$on:J}),t.phase==="PLAYING"&&t.player.hp===1&&n.jsx(Bn,{}),t.floor&&n.jsx(dr,{children:Y}),_&&G&&n.jsx(hr,{children:n.jsx(fr,{$ratio:G.hp/G.maxHp})}),t.phase==="TITLE"&&n.jsxs(Pe,{$dim:!0,children:[n.jsx(rr,{children:"DESCENT"}),n.jsxs(Ee,{children:["Twin-stick. R2 fires. L2 focuses.",n.jsx("br",{}),"× to dash · □ for a bomb · △ pauses · ○ inventory",n.jsx("br",{}),"Clear three floors. Don't die."]}),n.jsx(ze,{children:"Press × to begin"})]}),t.phase==="PAUSED"&&!t.showInventory&&n.jsxs(Pe,{$dim:!0,children:[n.jsx(ar,{children:"PAUSED"}),n.jsx(Ee,{style:{marginTop:16},children:"△ to resume"})]}),t.phase==="ITEM_PICKUP"&&t.pendingPickup&&n.jsxs(Pe,{$dim:!0,children:[n.jsxs(lr,{children:[Se[t.pendingPickup.kind].glyph," ",Se[t.pendingPickup.kind].label.toUpperCase()]}),n.jsx(Ee,{children:Se[t.pendingPickup.kind].desc}),n.jsx(ze,{children:"× to pick up"})]}),t.phase==="FLOOR_CLEAR"&&n.jsxs(Pe,{$dim:!0,children:[n.jsxs(or,{children:["FLOOR ",t.floorIndex+1," CLEAR"]}),n.jsx(Ee,{style:{marginTop:16},children:"× to descend"})]}),t.phase==="DEAD"&&n.jsxs(Pe,{$dim:!0,children:[n.jsx(sr,{children:"YOU DIED"}),n.jsxs(Ee,{children:["Floor ",t.floorIndex+1," ·"," ",t.runStats.roomsCleared," rooms ·"," ",t.runStats.kills," kills"]}),n.jsx(ze,{children:"× to try again"})]}),t.phase==="VICTORY"&&n.jsxs(Pe,{$dim:!0,children:[n.jsx(ir,{children:"ASCENDED"}),n.jsxs(Ee,{children:[t.runStats.kills," kills · ",t.runStats.roomsCleared," ","rooms cleared",n.jsx("br",{}),"Items: ",Object.values(t.player.items).reduce((s,c)=>s+c,0)]}),n.jsx(ze,{children:"× to descend again"})]}),t.showInventory&&t.phase!=="TITLE"&&n.jsxs(ur,{children:[n.jsx(xr,{children:"INVENTORY"}),n.jsx(gr,{children:Object.keys(Se).map(s=>{const c=Se[s],M=t.player.items[s]??0;return n.jsxs(mr,{$owned:M>0,children:[n.jsx(br,{$color:c.color,children:c.glyph}),n.jsxs(yr,{children:[c.label,n.jsx("div",{style:{fontSize:10,color:"rgba(191,204,214,0.5)"},children:c.desc})]}),n.jsxs(Tr,{children:["×",M]})]},s)})}),n.jsx(Ee,{style:{marginTop:20},children:"○ to close"})]})]}),(t.phase==="PLAYING"||t.phase==="ROOM_TRANSITION"||t.phase==="PAUSED"||t.phase==="ITEM_PICKUP")&&n.jsxs(cr,{children:[n.jsxs("span",{children:["Room ",((Ne=t.floor)==null?void 0:Ne.currentKey)??"-"," ",u!=null&&u.cleared?"· cleared":`· ${(u==null?void 0:u.enemies.length)??0} enemies`]}),n.jsxs("span",{children:["Dash ",t.player.dashCooldown>0?"cd":"ready"]}),n.jsxs("span",{children:["Items"," ",Object.values(t.player.items).reduce((s,c)=>s+c,0)]})]})]})]}),n.jsxs($r,{children:[n.jsx(bt,{children:"Controller Features"}),n.jsxs(Ar,{children:[n.jsxs("li",{children:[n.jsx("strong",{children:"Twin-stick"})," - ",n.jsx("code",{children:"left.analog"})," moves,"," ",n.jsx("code",{children:"right.analog"})," aims. If the right stick is dead, the D-pad takes over as cardinal aim - showing off"," ",n.jsx("code",{children:"Momentary.active"})," as a readable boolean."]}),n.jsxs("li",{children:[n.jsx("strong",{children:"Analog fire rate"})," - ",n.jsx("code",{children:"R2"}),"'s"," ",n.jsx("code",{children:".state"})," maps to two fire-rate tiers: a slow trickle past 20% pull, full auto past 60%. Trigger uses"," ",n.jsx("code",{children:"TriggerEffect.Weapon"})," for a click-stop feel so both tiers are physically distinguishable."]}),n.jsxs("li",{children:[n.jsx("strong",{children:"Focus trigger"})," - ",n.jsx("code",{children:"L2"})," halves movement speed (for precise weaving) with a mild resistance via"," ",n.jsx("code",{children:"TriggerEffect.Feedback"}),' - an always-on "hold this for a benefit" button.']}),n.jsxs("li",{children:[n.jsx("strong",{children:"Cross - dash"})," with iframes. Press direction +"," ",n.jsx("code",{children:"×"})," to phase through a bullet wall or close a gap. The iframes end mid-dash, so it's reactive, not a panic button."]}),n.jsxs("li",{children:[n.jsx("strong",{children:"Square - bomb"}),", Circle - inventory, Triangle - pause, D-pad Up - full map toggle."]}),n.jsxs("li",{children:[n.jsx("strong",{children:"Left rumble"}),` - continuous low heartbeat when HP drops to 1, and a strong pulse whenever you take damage. Two channels of meaning on one motor: a peripheral "you're hurting" cue and an acute "you got hit" cue.`]}),n.jsxs("li",{children:[n.jsx("strong",{children:"Right rumble"})," - short tap on each enemy kill, tighter tap on door-unlock when a room clears, and a heavy dual-motor thump on bomb detonation (the only moment both motors fire together)."]}),n.jsxs("li",{children:[n.jsx("strong",{children:"Lightbar"})," - HP color: green → yellow → red, flashing red at 1 HP. Purple burst on item pickup, white on floor clear, rainbow on final victory."]}),n.jsxs("li",{children:[n.jsx("strong",{children:"Player LEDs"})," - current floor (1-3) with all five lit on victory."]}),n.jsxs("li",{children:[n.jsx("strong",{children:"Mute LED"}),' - solid when the current room still has enemies; dark once cleared. A glanceable "can I leave?" indicator. Pulses during pause.']}),n.jsxs("li",{children:[n.jsx("strong",{children:"Speaker"})," - short 1kHz click on enemy kills, 100Hz hit thump, ascending arpeggio on item pickup, low thud on bomb detonation, four-note floor clear, five-note ascended fanfare."]})]}),n.jsx(bt,{children:"Implementation Notes"}),n.jsx("p",{children:"Procedural floor generation is a random walk on a 5×5 logical grid. Pick a start cell on the left edge, walk to random unvisited neighbors until we have 6-9 rooms, then run BFS from start to find the farthest reachable cell and tag it as the boss. A random non-start, non-boss cell becomes the treasure room. All of it runs in a few hundred lines; no dungeon generator libraries needed."}),n.jsx(Ve,{code:`function generateFloor(floorIndex) {
  const target = 6 + floorIndex + randInt(0, 2);
  const visited = new Map();
  const conns = new Map();
  let cursor = { col: 0, row: 2 };
  visited.set(key(cursor), cursor);
  conns.set(key(cursor), new Set());

  while (visited.size < target) {
    const dirs = shuffle(["N", "S", "E", "W"]);
    for (const d of dirs) {
      const next = step(cursor, d);
      if (inBounds(next) && !visited.has(key(next))) {
        visited.set(key(next), next);
        conns.set(key(next), new Set([oppositeDir(d)]));
        conns.get(key(cursor)).add(d);
        cursor = next;
        break;
      }
    }
  }

  // BFS from start to pick farthest cell as boss.
  const dists = bfs(key(start), conns);
  const bossKey = argmax(dists);
  return { visited, conns, bossKey };
}`}),n.jsxs("p",{children:["Enemy AI is four pure per-tick functions:"," ",n.jsx("code",{children:"updateFly"}),", ",n.jsx("code",{children:"updateShooter"}),","," ",n.jsx("code",{children:"updateTurret"}),", ",n.jsx("code",{children:"updateCharger"}),", plus a phased ",n.jsx("code",{children:"updateBoss"}),". Each takes an enemy and a context (player, dt, bullet sink) and returns the next enemy. No side effects: testable in isolation, composable, easy to add a fifth type."]}),n.jsx(Ve,{code:`function updateCharger(e, ctx) {
  // 0 = pursue, 1 = windup (locked-on), 2 = charge, 3 = rest
  if (e.phase === 0) {
    const a = angleTo(e, ctx.player);
    e.vx = Math.cos(a) * 120;
    e.vy = Math.sin(a) * 120;
    if (dist(e, ctx.player) < 160) {
      e.phase = 1;
      e.timer = 0.85;
      e.targetX = ctx.player.x;
      e.targetY = ctx.player.y;
    }
  } else if (e.phase === 1) {
    e.timer -= ctx.dt;
    e.flash = 1 - e.timer / 0.85;
    if (e.timer <= 0) {
      const a = angleTo(e, { x: e.targetX, y: e.targetY });
      e.vx = Math.cos(a) * 400;
      e.vy = Math.sin(a) * 400;
      e.phase = 2;
      e.timer = 0.3;
    }
  }
  // ... phases 2 & 3
  return e;
}`}),n.jsxs("p",{children:["Items stack as typed counters on the player. Firing reads a computed stats object (",n.jsx("code",{children:"damage"}),", ",n.jsx("code",{children:"fireRateMult"}),", ",n.jsx("code",{children:"homing"}),", ",n.jsx("code",{children:"pierce"}),") so the bullet-spawn code doesn't care whether you have zero items or thirty. Adding a seventh item is one entry in the ",n.jsx("code",{children:"ITEM_DEFS"})," table plus a few lines in ",n.jsx("code",{children:"computePlayerStats"}),"."]}),n.jsx(Ve,{code:`function computePlayerStats(p) {
  return {
    damage: 1 + (p.items.damage ?? 0),
    speed: 220 + 40 * (p.items.speed ?? 0),
    fireRateMult: Math.pow(1.5, p.items.rapid ?? 0),
    homing: (p.items.homing ?? 0) > 0,
    pierce: (p.items.pierce ?? 0) > 0,
  };
}`}),n.jsxs("p",{children:["The whole game is a single reducer over one ",n.jsx("code",{children:"GameState"})," ","tree, fixed 60fps accumulator, no mutation in the hot path. The rendering layer is styled-components with ",n.jsx("code",{children:"left"}),"/",n.jsx("code",{children:"top"})," inline styles on each entity - not canvas. For a few hundred entities it's fine and diff'd by key cheaply."]})]})]})};export{wr as default};
