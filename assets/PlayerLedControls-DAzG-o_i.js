import{b as bn,R as f,a as S,g as y,C as z,j as n,d as m,E as Fr,f as wn}from"./index-Bm_ty-o0.js";import{T as Mt,S as Ut,B as jn,C as Ot,b as Ke}from"./CodeBlock-BDmjJVby.js";var Xt={exports:{}},Yt={exports:{}};/*!
 * Zdog v1.1.3
 * Round, flat, designer-friendly pseudo-3D engine
 * Licensed MIT
 * https://zzz.dog
 * Copyright 2020 Metafizzy
 */var Sn=Yt.exports,Je;function U(){return Je||(Je=1,(function(t){(function(i,e){t.exports?t.exports=e():i.Zdog=e()})(Sn,function(){var e={};e.TAU=Math.PI*2,e.extend=function(o,c){for(var u in c)o[u]=c[u];return o},e.lerp=function(o,c,u){return(c-o)*u+o},e.modulo=function(o,c){return(o%c+c)%c};var r={2:function(o){return o*o},3:function(o){return o*o*o},4:function(o){return o*o*o*o},5:function(o){return o*o*o*o*o}};return e.easeInOut=function(o,c){if(c==1)return o;o=Math.max(0,Math.min(1,o));var u=o<.5,s=u?o:1-o;s/=.5;var h=r[c]||r[2],l=h(s);return l/=2,u?l:1-l},e})})(Yt)),Yt.exports}var Kt={exports:{}},Cn=Kt.exports,Qe;function Dr(){return Qe||(Qe=1,(function(t){(function(i,e){t.exports?t.exports=e():i.Zdog.CanvasRenderer=e()})(Cn,function(){var e={isCanvas:!0};return e.begin=function(r){r.beginPath()},e.move=function(r,o,c){r.moveTo(c.x,c.y)},e.line=function(r,o,c){r.lineTo(c.x,c.y)},e.bezier=function(r,o,c,u,s){r.bezierCurveTo(c.x,c.y,u.x,u.y,s.x,s.y)},e.closePath=function(r){r.closePath()},e.setPath=function(){},e.renderPath=function(r,o,c,u){this.begin(r,o),c.forEach(function(s){s.render(r,o,e)}),u&&this.closePath(r,o)},e.stroke=function(r,o,c,u,s){c&&(r.strokeStyle=u,r.lineWidth=s,r.stroke())},e.fill=function(r,o,c,u){c&&(r.fillStyle=u,r.fill())},e.end=function(){},e})})(Kt)),Kt.exports}var Jt={exports:{}},En=Jt.exports,Ze;function Gr(){return Ze||(Ze=1,(function(t){(function(i,e){t.exports?t.exports=e():i.Zdog.SvgRenderer=e()})(En,function(){var e={isSvg:!0},r=e.round=function(c){return Math.round(c*1e3)/1e3};function o(c){return r(c.x)+","+r(c.y)+" "}return e.begin=function(){},e.move=function(c,u,s){return"M"+o(s)},e.line=function(c,u,s){return"L"+o(s)},e.bezier=function(c,u,s,h,l){return"C"+o(s)+o(h)+o(l)},e.closePath=function(){return"Z"},e.setPath=function(c,u,s){u.setAttribute("d",s)},e.renderPath=function(c,u,s,h){var l="";s.forEach(function(a){l+=a.render(c,u,e)}),h&&(l+=this.closePath(c,u)),this.setPath(c,u,l)},e.stroke=function(c,u,s,h,l){s&&(u.setAttribute("stroke",h),u.setAttribute("stroke-width",l))},e.fill=function(c,u,s,h){var l=s?h:"none";u.setAttribute("fill",l)},e.end=function(c,u){c.appendChild(u)},e})})(Jt)),Jt.exports}var Qt={exports:{}},kn=Qt.exports,tr;function Ct(){return tr||(tr=1,(function(t){(function(i,e){if(t.exports)t.exports=e(U());else{var r=i.Zdog;r.Vector=e(r)}})(kn,function(e){function r(s){this.set(s)}var o=e.TAU;r.prototype.set=function(s){return this.x=s&&s.x||0,this.y=s&&s.y||0,this.z=s&&s.z||0,this},r.prototype.write=function(s){return s?(this.x=s.x!=null?s.x:this.x,this.y=s.y!=null?s.y:this.y,this.z=s.z!=null?s.z:this.z,this):this},r.prototype.rotate=function(s){if(s)return this.rotateZ(s.z),this.rotateY(s.y),this.rotateX(s.x),this},r.prototype.rotateZ=function(s){c(this,s,"x","y")},r.prototype.rotateX=function(s){c(this,s,"y","z")},r.prototype.rotateY=function(s){c(this,s,"x","z")};function c(s,h,l,a){if(!(!h||h%o===0)){var d=Math.cos(h),p=Math.sin(h),g=s[l],x=s[a];s[l]=g*d-x*p,s[a]=x*d+g*p}}r.prototype.isSame=function(s){return s?this.x===s.x&&this.y===s.y&&this.z===s.z:!1},r.prototype.add=function(s){return s?(this.x+=s.x||0,this.y+=s.y||0,this.z+=s.z||0,this):this},r.prototype.subtract=function(s){return s?(this.x-=s.x||0,this.y-=s.y||0,this.z-=s.z||0,this):this},r.prototype.multiply=function(s){return s==null?this:(typeof s=="number"?(this.x*=s,this.y*=s,this.z*=s):(this.x*=s.x!=null?s.x:1,this.y*=s.y!=null?s.y:1,this.z*=s.z!=null?s.z:1),this)},r.prototype.transform=function(s,h,l){return this.multiply(l),this.rotate(h),this.add(s),this},r.prototype.lerp=function(s,h){return this.x=e.lerp(this.x,s.x||0,h),this.y=e.lerp(this.y,s.y||0,h),this.z=e.lerp(this.z,s.z||0,h),this},r.prototype.magnitude=function(){var s=this.x*this.x+this.y*this.y+this.z*this.z;return u(s)};function u(s){return Math.abs(s-1)<1e-8?1:Math.sqrt(s)}return r.prototype.magnitude2d=function(){var s=this.x*this.x+this.y*this.y;return u(s)},r.prototype.copy=function(){return new r(this)},r})})(Qt)),Qt.exports}var Zt={exports:{}},Rn=Zt.exports,er;function gt(){return er||(er=1,(function(t){(function(i,e){if(t.exports)t.exports=e(U(),Ct(),Dr(),Gr());else{var r=i.Zdog;r.Anchor=e(r,r.Vector,r.CanvasRenderer,r.SvgRenderer)}})(Rn,function(e,r,o,c){var u=e.TAU,s={x:1,y:1,z:1};function h(a){this.create(a||{})}h.prototype.create=function(a){this.children=[],e.extend(this,this.constructor.defaults),this.setOptions(a),this.translate=new r(a.translate),this.rotate=new r(a.rotate),this.scale=new r(s).multiply(this.scale),this.origin=new r,this.renderOrigin=new r,this.addTo&&this.addTo.addChild(this)},h.defaults={},h.optionKeys=Object.keys(h.defaults).concat(["rotate","translate","scale","addTo"]),h.prototype.setOptions=function(a){var d=this.constructor.optionKeys;for(var p in a)d.indexOf(p)!=-1&&(this[p]=a[p])},h.prototype.addChild=function(a){this.children.indexOf(a)==-1&&(a.remove(),a.addTo=this,this.children.push(a))},h.prototype.removeChild=function(a){var d=this.children.indexOf(a);d!=-1&&this.children.splice(d,1)},h.prototype.remove=function(){this.addTo&&this.addTo.removeChild(this)},h.prototype.update=function(){this.reset(),this.children.forEach(function(a){a.update()}),this.transform(this.translate,this.rotate,this.scale)},h.prototype.reset=function(){this.renderOrigin.set(this.origin)},h.prototype.transform=function(a,d,p){this.renderOrigin.transform(a,d,p),this.children.forEach(function(g){g.transform(a,d,p)})},h.prototype.updateGraph=function(){this.update(),this.updateFlatGraph(),this.flatGraph.forEach(function(a){a.updateSortValue()}),this.flatGraph.sort(h.shapeSorter)},h.shapeSorter=function(a,d){return a.sortValue-d.sortValue},Object.defineProperty(h.prototype,"flatGraph",{get:function(){return this._flatGraph||this.updateFlatGraph(),this._flatGraph},set:function(a){this._flatGraph=a}}),h.prototype.updateFlatGraph=function(){this.flatGraph=this.getFlatGraph()},h.prototype.getFlatGraph=function(){var a=[this];return this.addChildFlatGraph(a)},h.prototype.addChildFlatGraph=function(a){return this.children.forEach(function(d){var p=d.getFlatGraph();Array.prototype.push.apply(a,p)}),a},h.prototype.updateSortValue=function(){this.sortValue=this.renderOrigin.z},h.prototype.render=function(){},h.prototype.renderGraphCanvas=function(a){if(!a)throw new Error("ctx is "+a+". Canvas context required for render. Check .renderGraphCanvas( ctx ).");this.flatGraph.forEach(function(d){d.render(a,o)})},h.prototype.renderGraphSvg=function(a){if(!a)throw new Error("svg is "+a+". SVG required for render. Check .renderGraphSvg( svg ).");this.flatGraph.forEach(function(d){d.render(a,c)})},h.prototype.copy=function(a){var d={},p=this.constructor.optionKeys;p.forEach(function(x){d[x]=this[x]},this),e.extend(d,a);var g=this.constructor;return new g(d)},h.prototype.copyGraph=function(a){var d=this.copy(a);return this.children.forEach(function(p){p.copyGraph({addTo:d})}),d},h.prototype.normalizeRotate=function(){this.rotate.x=e.modulo(this.rotate.x,u),this.rotate.y=e.modulo(this.rotate.y,u),this.rotate.z=e.modulo(this.rotate.z,u)};function l(a){return function(d){function p(g){this.create(g||{})}return p.prototype=Object.create(a.prototype),p.prototype.constructor=p,p.defaults=e.extend({},a.defaults),e.extend(p.defaults,d),p.optionKeys=a.optionKeys.slice(0),Object.keys(p.defaults).forEach(function(g){!p.optionKeys.indexOf(g)!=1&&p.optionKeys.push(g)}),p.subclass=l(p),p}}return h.subclass=l(h),h})})(Zt)),Zt.exports}var te={exports:{}},zn=te.exports,rr;function Wr(){return rr||(rr=1,(function(t){(function(i,e){t.exports?t.exports=e():i.Zdog.Dragger=e()})(zn,function(){var e=typeof window<"u",r="mousedown",o="mousemove",c="mouseup";e&&(window.PointerEvent?(r="pointerdown",o="pointermove",c="pointerup"):"ontouchstart"in window&&(r="touchstart",o="touchmove",c="touchend"));function u(){}function s(h){this.create(h||{})}return s.prototype.create=function(h){this.onDragStart=h.onDragStart||u,this.onDragMove=h.onDragMove||u,this.onDragEnd=h.onDragEnd||u,this.bindDrag(h.startElement)},s.prototype.bindDrag=function(h){h=this.getQueryElement(h),h&&(h.style.touchAction="none",h.addEventListener(r,this))},s.prototype.getQueryElement=function(h){return typeof h=="string"&&(h=document.querySelector(h)),h},s.prototype.handleEvent=function(h){var l=this["on"+h.type];l&&l.call(this,h)},s.prototype.onmousedown=s.prototype.onpointerdown=function(h){this.dragStart(h,h)},s.prototype.ontouchstart=function(h){this.dragStart(h,h.changedTouches[0])},s.prototype.dragStart=function(h,l){h.preventDefault(),this.dragStartX=l.pageX,this.dragStartY=l.pageY,e&&(window.addEventListener(o,this),window.addEventListener(c,this)),this.onDragStart(l)},s.prototype.ontouchmove=function(h){this.dragMove(h,h.changedTouches[0])},s.prototype.onmousemove=s.prototype.onpointermove=function(h){this.dragMove(h,h)},s.prototype.dragMove=function(h,l){h.preventDefault();var a=l.pageX-this.dragStartX,d=l.pageY-this.dragStartY;this.onDragMove(l,a,d)},s.prototype.onmouseup=s.prototype.onpointerup=s.prototype.ontouchend=s.prototype.dragEnd=function(){window.removeEventListener(o,this),window.removeEventListener(c,this),this.onDragEnd()},s})})(te)),te.exports}var ee={exports:{}},Mn=ee.exports,nr;function Tn(){return nr||(nr=1,(function(t){(function(i,e){if(t.exports)t.exports=e(U(),gt(),Wr());else{var r=i.Zdog;r.Illustration=e(r,r.Anchor,r.Dragger)}})(Mn,function(e,r,o){function c(){}var u=e.TAU,s=r.subclass({element:void 0,centered:!0,zoom:1,dragRotate:!1,resize:!1,onPrerender:c,onDragStart:c,onDragMove:c,onDragEnd:c,onResize:c});e.extend(s.prototype,o.prototype),s.prototype.create=function(l){r.prototype.create.call(this,l),o.prototype.create.call(this,l),this.setElement(this.element),this.setDragRotate(this.dragRotate),this.setResize(this.resize)},s.prototype.setElement=function(l){if(l=this.getQueryElement(l),!l)throw new Error("Zdog.Illustration element required. Set to "+l);var a=l.nodeName.toLowerCase();a=="canvas"?this.setCanvas(l):a=="svg"&&this.setSvg(l)},s.prototype.setSize=function(l,a){l=Math.round(l),a=Math.round(a),this.isCanvas?this.setSizeCanvas(l,a):this.isSvg&&this.setSizeSvg(l,a)},s.prototype.setResize=function(l){this.resize=l,this.resizeListener||(this.resizeListener=this.onWindowResize.bind(this)),l?(window.addEventListener("resize",this.resizeListener),this.onWindowResize()):window.removeEventListener("resize",this.resizeListener)},s.prototype.onWindowResize=function(){this.setMeasuredSize(),this.onResize(this.width,this.height)},s.prototype.setMeasuredSize=function(){var l,a,d=this.resize=="fullscreen";if(d)l=window.innerWidth,a=window.innerHeight;else{var p=this.element.getBoundingClientRect();l=p.width,a=p.height}this.setSize(l,a)},s.prototype.renderGraph=function(l){this.isCanvas?this.renderGraphCanvas(l):this.isSvg&&this.renderGraphSvg(l)},s.prototype.updateRenderGraph=function(l){this.updateGraph(),this.renderGraph(l)},s.prototype.setCanvas=function(l){this.element=l,this.isCanvas=!0,this.ctx=this.element.getContext("2d"),this.setSizeCanvas(l.width,l.height)},s.prototype.setSizeCanvas=function(l,a){this.width=l,this.height=a;var d=this.pixelRatio=window.devicePixelRatio||1;this.element.width=this.canvasWidth=l*d,this.element.height=this.canvasHeight=a*d;var p=d>1&&!this.resize;p&&(this.element.style.width=l+"px",this.element.style.height=a+"px")},s.prototype.renderGraphCanvas=function(l){l=l||this,this.prerenderCanvas(),r.prototype.renderGraphCanvas.call(l,this.ctx),this.postrenderCanvas()},s.prototype.prerenderCanvas=function(){var l=this.ctx;if(l.lineCap="round",l.lineJoin="round",l.clearRect(0,0,this.canvasWidth,this.canvasHeight),l.save(),this.centered){var a=this.width/2*this.pixelRatio,d=this.height/2*this.pixelRatio;l.translate(a,d)}var p=this.pixelRatio*this.zoom;l.scale(p,p),this.onPrerender(l)},s.prototype.postrenderCanvas=function(){this.ctx.restore()},s.prototype.setSvg=function(l){this.element=l,this.isSvg=!0,this.pixelRatio=1;var a=l.getAttribute("width"),d=l.getAttribute("height");this.setSizeSvg(a,d)},s.prototype.setSizeSvg=function(l,a){this.width=l,this.height=a;var d=l/this.zoom,p=a/this.zoom,g=this.centered?-d/2:0,x=this.centered?-p/2:0;this.element.setAttribute("viewBox",g+" "+x+" "+d+" "+p),this.resize?(this.element.removeAttribute("width"),this.element.removeAttribute("height")):(this.element.setAttribute("width",l),this.element.setAttribute("height",a))},s.prototype.renderGraphSvg=function(l){l=l||this,h(this.element),this.onPrerender(this.element),r.prototype.renderGraphSvg.call(l,this.element)};function h(l){for(;l.firstChild;)l.removeChild(l.firstChild)}return s.prototype.setDragRotate=function(l){if(l)l===!0&&(l=this);else return;this.dragRotate=l,this.bindDrag(this.element)},s.prototype.dragStart=function(){this.dragStartRX=this.dragRotate.rotate.x,this.dragStartRY=this.dragRotate.rotate.y,o.prototype.dragStart.apply(this,arguments)},s.prototype.dragMove=function(l,a){var d=a.pageX-this.dragStartX,p=a.pageY-this.dragStartY,g=Math.min(this.width,this.height),x=d/g*u,v=p/g*u;this.dragRotate.rotate.x=this.dragStartRX-v,this.dragRotate.rotate.y=this.dragStartRY-x,o.prototype.dragMove.apply(this,arguments)},s})})(ee)),ee.exports}var re={exports:{}},Pn=re.exports,sr;function ge(){return sr||(sr=1,(function(t){(function(i,e){if(t.exports)t.exports=e(Ct());else{var r=i.Zdog;r.PathCommand=e(r.Vector)}})(Pn,function(e){function r(s,h,l){this.method=s,this.points=h.map(o),this.renderPoints=h.map(c),this.previousPoint=l,this.endRenderPoint=this.renderPoints[this.renderPoints.length-1],s=="arc"&&(this.controlPoints=[new e,new e])}function o(s){return s instanceof e?s:new e(s)}function c(s){return new e(s)}r.prototype.reset=function(){var s=this.points;this.renderPoints.forEach(function(h,l){var a=s[l];h.set(a)})},r.prototype.transform=function(s,h,l){this.renderPoints.forEach(function(a){a.transform(s,h,l)})},r.prototype.render=function(s,h,l){return this[this.method](s,h,l)},r.prototype.move=function(s,h,l){return l.move(s,h,this.renderPoints[0])},r.prototype.line=function(s,h,l){return l.line(s,h,this.renderPoints[0])},r.prototype.bezier=function(s,h,l){var a=this.renderPoints[0],d=this.renderPoints[1],p=this.renderPoints[2];return l.bezier(s,h,a,d,p)};var u=9/16;return r.prototype.arc=function(s,h,l){var a=this.previousPoint,d=this.renderPoints[0],p=this.renderPoints[1],g=this.controlPoints[0],x=this.controlPoints[1];return g.set(a).lerp(d,u),x.set(p).lerp(d,u),l.bezier(s,h,g,x,p)},r})})(re)),re.exports}var ne={exports:{}},$n=ne.exports,ir;function vt(){return ir||(ir=1,(function(t){(function(i,e){if(t.exports)t.exports=e(U(),Ct(),ge(),gt());else{var r=i.Zdog;r.Shape=e(r,r.Vector,r.PathCommand,r.Anchor)}})($n,function(e,r,o,c){var u=c.subclass({stroke:1,fill:!1,color:"#333",closed:!0,visible:!0,path:[{}],front:{z:1},backface:!0});u.prototype.create=function(a){c.prototype.create.call(this,a),this.updatePath(),this.front=new r(a.front||this.front),this.renderFront=new r(this.front),this.renderNormal=new r};var s=["move","line","bezier","arc"];u.prototype.updatePath=function(){this.setPath(),this.updatePathCommands()},u.prototype.setPath=function(){},u.prototype.updatePathCommands=function(){var a;this.pathCommands=this.path.map(function(d,p){var g=Object.keys(d),x=g[0],v=d[x],w=g.length==1&&s.indexOf(x)!=-1;w||(x="line",v=d);var E=x=="line"||x=="move",R=Array.isArray(v);E&&!R&&(v=[v]),x=p===0?"move":x;var P=new o(x,v,a);return a=P.endRenderPoint,P})},u.prototype.reset=function(){this.renderOrigin.set(this.origin),this.renderFront.set(this.front),this.pathCommands.forEach(function(a){a.reset()})},u.prototype.transform=function(a,d,p){this.renderOrigin.transform(a,d,p),this.renderFront.transform(a,d,p),this.renderNormal.set(this.renderOrigin).subtract(this.renderFront),this.pathCommands.forEach(function(g){g.transform(a,d,p)}),this.children.forEach(function(g){g.transform(a,d,p)})},u.prototype.updateSortValue=function(){var a=this.pathCommands.length,d=this.pathCommands[0].endRenderPoint,p=this.pathCommands[a-1].endRenderPoint,g=a>2&&d.isSame(p);g&&(a-=1);for(var x=0,v=0;v<a;v++)x+=this.pathCommands[v].endRenderPoint.z;this.sortValue=x/a},u.prototype.render=function(a,d){var p=this.pathCommands.length;if(!(!this.visible||!p)&&(this.isFacingBack=this.renderNormal.z>0,!(!this.backface&&this.isFacingBack))){if(!d)throw new Error("Zdog renderer required. Set to "+d);var g=p==1;d.isCanvas&&g?this.renderCanvasDot(a,d):this.renderPath(a,d)}};var h=e.TAU;u.prototype.renderCanvasDot=function(a){var d=this.getLineWidth();if(d){a.fillStyle=this.getRenderColor();var p=this.pathCommands[0].endRenderPoint;a.beginPath();var g=d/2;a.arc(p.x,p.y,g,0,h),a.fill()}},u.prototype.getLineWidth=function(){return this.stroke?this.stroke==!0?1:this.stroke:0},u.prototype.getRenderColor=function(){var a=typeof this.backface=="string"&&this.isFacingBack,d=a?this.backface:this.color;return d},u.prototype.renderPath=function(a,d){var p=this.getRenderElement(a,d),g=this.pathCommands.length==2&&this.pathCommands[1].method=="line",x=!g&&this.closed,v=this.getRenderColor();d.renderPath(a,p,this.pathCommands,x),d.stroke(a,p,this.stroke,v,this.getLineWidth()),d.fill(a,p,this.fill,v),d.end(a,p)};var l="http://www.w3.org/2000/svg";return u.prototype.getRenderElement=function(a,d){if(d.isSvg)return this.svgElement||(this.svgElement=document.createElementNS(l,"path"),this.svgElement.setAttribute("stroke-linecap","round"),this.svgElement.setAttribute("stroke-linejoin","round")),this.svgElement},u})})(ne)),ne.exports}var se={exports:{}},_n=se.exports,or;function qr(){return or||(or=1,(function(t){(function(i,e){if(t.exports)t.exports=e(gt());else{var r=i.Zdog;r.Group=e(r.Anchor)}})(_n,function(e){var r=e.subclass({updateSort:!1,visible:!0});return r.prototype.updateSortValue=function(){var o=0;this.flatGraph.forEach(function(c){c.updateSortValue(),o+=c.sortValue}),this.sortValue=o/this.flatGraph.length,this.updateSort&&this.flatGraph.sort(e.shapeSorter)},r.prototype.render=function(o,c){this.visible&&this.flatGraph.forEach(function(u){u.render(o,c)})},r.prototype.updateFlatGraph=function(){var o=[];this.flatGraph=this.addChildFlatGraph(o)},r.prototype.getFlatGraph=function(){return[this]},r})})(se)),se.exports}var ie={exports:{}},An=ie.exports,ar;function Hr(){return ar||(ar=1,(function(t){(function(i,e){if(t.exports)t.exports=e(vt());else{var r=i.Zdog;r.Rect=e(r.Shape)}})(An,function(e){var r=e.subclass({width:1,height:1});return r.prototype.setPath=function(){var o=this.width/2,c=this.height/2;this.path=[{x:-o,y:-c},{x:o,y:-c},{x:o,y:c},{x:-o,y:c}]},r})})(ie)),ie.exports}var oe={exports:{}},Ln=oe.exports,cr;function On(){return cr||(cr=1,(function(t){(function(i,e){if(t.exports)t.exports=e(vt());else{var r=i.Zdog;r.RoundedRect=e(r.Shape)}})(Ln,function(e){var r=e.subclass({width:1,height:1,cornerRadius:.25,closed:!1});return r.prototype.setPath=function(){var o=this.width/2,c=this.height/2,u=Math.min(o,c),s=Math.min(this.cornerRadius,u),h=o-s,l=c-s,a=[{x:h,y:-c},{arc:[{x:o,y:-c},{x:o,y:-l}]}];l&&a.push({x:o,y:l}),a.push({arc:[{x:o,y:c},{x:h,y:c}]}),h&&a.push({x:-h,y:c}),a.push({arc:[{x:-o,y:c},{x:-o,y:l}]}),l&&a.push({x:-o,y:-l}),a.push({arc:[{x:-o,y:-c},{x:-h,y:-c}]}),h&&a.push({x:h,y:-c}),this.path=a},r})})(oe)),oe.exports}var ae={exports:{}},In=ae.exports,hr;function ve(){return hr||(hr=1,(function(t){(function(i,e){if(t.exports)t.exports=e(vt());else{var r=i.Zdog;r.Ellipse=e(r.Shape)}})(In,function(e){var r=e.subclass({diameter:1,width:void 0,height:void 0,quarters:4,closed:!1});return r.prototype.setPath=function(){var o=this.width!=null?this.width:this.diameter,c=this.height!=null?this.height:this.diameter,u=o/2,s=c/2;this.path=[{x:0,y:-s},{arc:[{x:u,y:-s},{x:u,y:0}]}],this.quarters>1&&this.path.push({arc:[{x:u,y:s},{x:0,y:s}]}),this.quarters>2&&this.path.push({arc:[{x:-u,y:s},{x:-u,y:0}]}),this.quarters>3&&this.path.push({arc:[{x:-u,y:-s},{x:0,y:-s}]})},r})})(ae)),ae.exports}var ce={exports:{}},Bn=ce.exports,lr;function Fn(){return lr||(lr=1,(function(t){(function(i,e){if(t.exports)t.exports=e(U(),vt());else{var r=i.Zdog;r.Polygon=e(r,r.Shape)}})(Bn,function(e,r){var o=r.subclass({sides:3,radius:.5}),c=e.TAU;return o.prototype.setPath=function(){this.path=[];for(var u=0;u<this.sides;u++){var s=u/this.sides*c-c/4,h=Math.cos(s)*this.radius,l=Math.sin(s)*this.radius;this.path.push({x:h,y:l})}},o})})(ce)),ce.exports}var he={exports:{}},Dn=he.exports,ur;function Gn(){return ur||(ur=1,(function(t){(function(i,e){if(t.exports)t.exports=e(U(),Ct(),gt(),ve());else{var r=i.Zdog;r.Hemisphere=e(r,r.Vector,r.Anchor,r.Ellipse)}})(Dn,function(e,r,o,c){var u=c.subclass({fill:!0}),s=e.TAU;u.prototype.create=function(){c.prototype.create.apply(this,arguments),this.apex=new o({addTo:this,translate:{z:this.diameter/2}}),this.renderCentroid=new r},u.prototype.updateSortValue=function(){this.renderCentroid.set(this.renderOrigin).lerp(this.apex.renderOrigin,3/8),this.sortValue=this.renderCentroid.z},u.prototype.render=function(l,a){this.renderDome(l,a),c.prototype.render.apply(this,arguments)},u.prototype.renderDome=function(l,a){if(this.visible){var d=this.getDomeRenderElement(l,a),p=Math.atan2(this.renderNormal.y,this.renderNormal.x),g=this.diameter/2*this.renderNormal.magnitude(),x=this.renderOrigin.x,v=this.renderOrigin.y;if(a.isCanvas){var w=p+s/4,E=p-s/4;l.beginPath(),l.arc(x,v,g,w,E)}else a.isSvg&&(p=(p-s/4)/s*360,this.domeSvgElement.setAttribute("d","M "+-g+",0 A "+g+","+g+" 0 0 1 "+g+",0"),this.domeSvgElement.setAttribute("transform","translate("+x+","+v+" ) rotate("+p+")"));a.stroke(l,d,this.stroke,this.color,this.getLineWidth()),a.fill(l,d,this.fill,this.color),a.end(l,d)}};var h="http://www.w3.org/2000/svg";return u.prototype.getDomeRenderElement=function(l,a){if(a.isSvg)return this.domeSvgElement||(this.domeSvgElement=document.createElementNS(h,"path"),this.domeSvgElement.setAttribute("stroke-linecap","round"),this.domeSvgElement.setAttribute("stroke-linejoin","round")),this.domeSvgElement},u})})(he)),he.exports}var le={exports:{}},Wn=le.exports,dr;function qn(){return dr||(dr=1,(function(t){(function(i,e){if(t.exports)t.exports=e(U(),ge(),vt(),qr(),ve());else{var r=i.Zdog;r.Cylinder=e(r,r.PathCommand,r.Shape,r.Group,r.Ellipse)}})(Wn,function(e,r,o,c,u){function s(){}var h=c.subclass({color:"#333",updateSort:!0});h.prototype.create=function(){c.prototype.create.apply(this,arguments),this.pathCommands=[new r("move",[{}]),new r("line",[{}])]},h.prototype.render=function(x,v){this.renderCylinderSurface(x,v),c.prototype.render.apply(this,arguments)},h.prototype.renderCylinderSurface=function(x,v){if(this.visible){var w=this.getRenderElement(x,v),E=this.frontBase,R=this.rearBase,P=E.renderNormal.magnitude(),j=E.diameter*P+E.getLineWidth();this.pathCommands[0].renderPoints[0].set(E.renderOrigin),this.pathCommands[1].renderPoints[0].set(R.renderOrigin),v.isCanvas&&(x.lineCap="butt"),v.renderPath(x,w,this.pathCommands),v.stroke(x,w,!0,this.color,j),v.end(x,w),v.isCanvas&&(x.lineCap="round")}};var l="http://www.w3.org/2000/svg";h.prototype.getRenderElement=function(x,v){if(v.isSvg)return this.svgElement||(this.svgElement=document.createElementNS(l,"path")),this.svgElement},h.prototype.copyGraph=s;var a=u.subclass();a.prototype.copyGraph=s;var d=o.subclass({diameter:1,length:1,frontFace:void 0,fill:!0}),p=e.TAU;d.prototype.create=function(){o.prototype.create.apply(this,arguments),this.group=new h({addTo:this,color:this.color,visible:this.visible});var x=this.length/2,v=this.backface||!0;this.frontBase=this.group.frontBase=new u({addTo:this.group,diameter:this.diameter,translate:{z:x},rotate:{y:p/2},color:this.color,stroke:this.stroke,fill:this.fill,backface:this.frontFace||v,visible:this.visible}),this.rearBase=this.group.rearBase=this.frontBase.copy({translate:{z:-x},rotate:{y:0},backface:v})},d.prototype.render=function(){};var g=["stroke","fill","color","visible"];return g.forEach(function(x){var v="_"+x;Object.defineProperty(d.prototype,x,{get:function(){return this[v]},set:function(w){this[v]=w,this.frontBase&&(this.frontBase[x]=w,this.rearBase[x]=w,this.group[x]=w)}})}),d})})(le)),le.exports}var ue={exports:{}},Hn=ue.exports,pr;function Vn(){return pr||(pr=1,(function(t){(function(i,e){if(t.exports)t.exports=e(U(),Ct(),ge(),gt(),ve());else{var r=i.Zdog;r.Cone=e(r,r.Vector,r.PathCommand,r.Anchor,r.Ellipse)}})(Hn,function(e,r,o,c,u){var s=u.subclass({length:1,fill:!0}),h=e.TAU;s.prototype.create=function(){u.prototype.create.apply(this,arguments),this.apex=new c({addTo:this,translate:{z:this.length}}),this.renderApex=new r,this.renderCentroid=new r,this.tangentA=new r,this.tangentB=new r,this.surfacePathCommands=[new o("move",[{}]),new o("line",[{}]),new o("line",[{}])]},s.prototype.updateSortValue=function(){this.renderCentroid.set(this.renderOrigin).lerp(this.apex.renderOrigin,1/3),this.sortValue=this.renderCentroid.z},s.prototype.render=function(a,d){this.renderConeSurface(a,d),u.prototype.render.apply(this,arguments)},s.prototype.renderConeSurface=function(a,d){if(this.visible){this.renderApex.set(this.apex.renderOrigin).subtract(this.renderOrigin);var p=this.renderNormal.magnitude(),g=this.renderApex.magnitude2d(),x=this.renderNormal.magnitude2d(),v=Math.acos(x/p),w=Math.sin(v),E=this.diameter/2*p,R=E*w<g;if(R){var P=Math.atan2(this.renderNormal.y,this.renderNormal.x)+h/2,j=g/w,yt=Math.acos(E/j),A=this.tangentA,G=this.tangentB;A.x=Math.cos(yt)*E*w,A.y=Math.sin(yt)*E,G.set(this.tangentA),G.y*=-1,A.rotateZ(P),G.rotateZ(P),A.add(this.renderOrigin),G.add(this.renderOrigin),this.setSurfaceRenderPoint(0,A),this.setSurfaceRenderPoint(1,this.apex.renderOrigin),this.setSurfaceRenderPoint(2,G);var rt=this.getSurfaceRenderElement(a,d);d.renderPath(a,rt,this.surfacePathCommands),d.stroke(a,rt,this.stroke,this.color,this.getLineWidth()),d.fill(a,rt,this.fill,this.color),d.end(a,rt)}}};var l="http://www.w3.org/2000/svg";return s.prototype.getSurfaceRenderElement=function(a,d){if(d.isSvg)return this.surfaceSvgElement||(this.surfaceSvgElement=document.createElementNS(l,"path"),this.surfaceSvgElement.setAttribute("stroke-linecap","round"),this.surfaceSvgElement.setAttribute("stroke-linejoin","round")),this.surfaceSvgElement},s.prototype.setSurfaceRenderPoint=function(a,d){var p=this.surfacePathCommands[a].renderPoints[0];p.set(d)},s})})(ue)),ue.exports}var de={exports:{}},Nn=de.exports,fr;function Un(){return fr||(fr=1,(function(t){(function(i,e){if(t.exports)t.exports=e(U(),gt(),vt(),Hr());else{var r=i.Zdog;r.Box=e(r,r.Anchor,r.Shape,r.Rect)}})(Nn,function(e,r,o,c){var u=c.subclass();u.prototype.copyGraph=function(){};var s=e.TAU,h=["frontFace","rearFace","leftFace","rightFace","topFace","bottomFace"],l=e.extend({},o.defaults);delete l.path,h.forEach(function(p){l[p]=!0}),e.extend(l,{width:1,height:1,depth:1,fill:!0});var a=r.subclass(l);a.prototype.create=function(p){r.prototype.create.call(this,p),this.updatePath(),this.fill=this.fill},a.prototype.updatePath=function(){h.forEach(function(p){this[p]=this[p]},this)},h.forEach(function(p){var g="_"+p;Object.defineProperty(a.prototype,p,{get:function(){return this[g]},set:function(x){this[g]=x,this.setFace(p,x)}})}),a.prototype.setFace=function(p,g){var x=p+"Rect",v=this[x];if(!g){this.removeChild(v);return}var w=this.getFaceOptions(p);w.color=typeof g=="string"?g:this.color,v?v.setOptions(w):v=this[x]=new u(w),v.updatePath(),this.addChild(v)},a.prototype.getFaceOptions=function(p){return{frontFace:{width:this.width,height:this.height,translate:{z:this.depth/2}},rearFace:{width:this.width,height:this.height,translate:{z:-this.depth/2},rotate:{y:s/2}},leftFace:{width:this.depth,height:this.height,translate:{x:-this.width/2},rotate:{y:-s/4}},rightFace:{width:this.depth,height:this.height,translate:{x:this.width/2},rotate:{y:s/4}},topFace:{width:this.width,height:this.depth,translate:{y:-this.height/2},rotate:{x:-s/4}},bottomFace:{width:this.width,height:this.depth,translate:{y:this.height/2},rotate:{x:s/4}}}[p]};var d=["color","stroke","fill","backface","front","visible"];return d.forEach(function(p){var g="_"+p;Object.defineProperty(a.prototype,p,{get:function(){return this[g]},set:function(x){this[g]=x,h.forEach(function(v){var w=this[v+"Rect"],E=typeof this[v]=="string",R=p=="color"&&E;w&&!R&&(w[p]=x)},this)}})}),a})})(de)),de.exports}var Xn=Xt.exports,xr;function Yn(){return xr||(xr=1,(function(t){(function(i,e){t.exports&&(t.exports=e(U(),Dr(),Gr(),Ct(),gt(),Wr(),Tn(),ge(),vt(),qr(),Hr(),On(),ve(),Fn(),Gn(),qn(),Vn(),Un()))})(Xn,function(e,r,o,c,u,s,h,l,a,d,p,g,x,v,w,E,R,P){return e.CanvasRenderer=r,e.SvgRenderer=o,e.Vector=c,e.Anchor=u,e.Dragger=s,e.Illustration=h,e.PathCommand=l,e.Shape=a,e.Group=d,e.Rect=p,e.RoundedRect=g,e.Ellipse=x,e.Polygon=v,e.Hemisphere=w,e.Cylinder=E,e.Cone=R,e.Box=P,e})})(Xt)),Xt.exports}var Kn=Yn();const L=bn(Kn);var Vr={exports:{}},Et={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var gr;function Jn(){if(gr)return Et;gr=1;var t=f,i=Symbol.for("react.element"),e=Symbol.for("react.fragment"),r=Object.prototype.hasOwnProperty,o=t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,c={key:!0,ref:!0,__self:!0,__source:!0};function u(s,h,l){var a,d={},p=null,g=null;l!==void 0&&(p=""+l),h.key!==void 0&&(p=""+h.key),h.ref!==void 0&&(g=h.ref);for(a in h)r.call(h,a)&&!c.hasOwnProperty(a)&&(d[a]=h[a]);if(s&&s.defaultProps)for(a in h=s.defaultProps,h)d[a]===void 0&&(d[a]=h[a]);return{$$typeof:i,type:s,key:p,ref:g,props:d,_owner:o.current}}return Et.Fragment=e,Et.jsx=u,Et.jsxs=u,Et}Vr.exports=Jn();var it=Vr.exports,Nr=(function(){if(typeof Map<"u")return Map;function t(i,e){var r=-1;return i.some(function(o,c){return o[0]===e?(r=c,!0):!1}),r}return(function(){function i(){this.__entries__=[]}return Object.defineProperty(i.prototype,"size",{get:function(){return this.__entries__.length},enumerable:!0,configurable:!0}),i.prototype.get=function(e){var r=t(this.__entries__,e),o=this.__entries__[r];return o&&o[1]},i.prototype.set=function(e,r){var o=t(this.__entries__,e);~o?this.__entries__[o][1]=r:this.__entries__.push([e,r])},i.prototype.delete=function(e){var r=this.__entries__,o=t(r,e);~o&&r.splice(o,1)},i.prototype.has=function(e){return!!~t(this.__entries__,e)},i.prototype.clear=function(){this.__entries__.splice(0)},i.prototype.forEach=function(e,r){r===void 0&&(r=null);for(var o=0,c=this.__entries__;o<c.length;o++){var u=c[o];e.call(r,u[1],u[0])}},i})()})(),De=typeof window<"u"&&typeof document<"u"&&window.document===document,pe=(function(){return typeof global<"u"&&global.Math===Math?global:typeof self<"u"&&self.Math===Math?self:typeof window<"u"&&window.Math===Math?window:Function("return this")()})(),Qn=(function(){return typeof requestAnimationFrame=="function"?requestAnimationFrame.bind(pe):function(t){return setTimeout(function(){return t(Date.now())},1e3/60)}})(),Zn=2;function ts(t,i){var e=!1,r=!1,o=0;function c(){e&&(e=!1,t()),r&&s()}function u(){Qn(c)}function s(){var h=Date.now();if(e){if(h-o<Zn)return;r=!0}else e=!0,r=!1,setTimeout(u,i);o=h}return s}var es=20,rs=["top","right","bottom","left","width","height","size","weight"],ns=typeof MutationObserver<"u",ss=(function(){function t(){this.connected_=!1,this.mutationEventsAdded_=!1,this.mutationsObserver_=null,this.observers_=[],this.onTransitionEnd_=this.onTransitionEnd_.bind(this),this.refresh=ts(this.refresh.bind(this),es)}return t.prototype.addObserver=function(i){~this.observers_.indexOf(i)||this.observers_.push(i),this.connected_||this.connect_()},t.prototype.removeObserver=function(i){var e=this.observers_,r=e.indexOf(i);~r&&e.splice(r,1),!e.length&&this.connected_&&this.disconnect_()},t.prototype.refresh=function(){var i=this.updateObservers_();i&&this.refresh()},t.prototype.updateObservers_=function(){var i=this.observers_.filter(function(e){return e.gatherActive(),e.hasActive()});return i.forEach(function(e){return e.broadcastActive()}),i.length>0},t.prototype.connect_=function(){!De||this.connected_||(document.addEventListener("transitionend",this.onTransitionEnd_),window.addEventListener("resize",this.refresh),ns?(this.mutationsObserver_=new MutationObserver(this.refresh),this.mutationsObserver_.observe(document,{attributes:!0,childList:!0,characterData:!0,subtree:!0})):(document.addEventListener("DOMSubtreeModified",this.refresh),this.mutationEventsAdded_=!0),this.connected_=!0)},t.prototype.disconnect_=function(){!De||!this.connected_||(document.removeEventListener("transitionend",this.onTransitionEnd_),window.removeEventListener("resize",this.refresh),this.mutationsObserver_&&this.mutationsObserver_.disconnect(),this.mutationEventsAdded_&&document.removeEventListener("DOMSubtreeModified",this.refresh),this.mutationsObserver_=null,this.mutationEventsAdded_=!1,this.connected_=!1)},t.prototype.onTransitionEnd_=function(i){var e=i.propertyName,r=e===void 0?"":e,o=rs.some(function(c){return!!~r.indexOf(c)});o&&this.refresh()},t.getInstance=function(){return this.instance_||(this.instance_=new t),this.instance_},t.instance_=null,t})(),Ur=function(t,i){for(var e=0,r=Object.keys(i);e<r.length;e++){var o=r[e];Object.defineProperty(t,o,{value:i[o],enumerable:!1,writable:!1,configurable:!0})}return t},St=function(t){var i=t&&t.ownerDocument&&t.ownerDocument.defaultView;return i||pe},Xr=ye(0,0,0,0);function fe(t){return parseFloat(t)||0}function vr(t){for(var i=[],e=1;e<arguments.length;e++)i[e-1]=arguments[e];return i.reduce(function(r,o){var c=t["border-"+o+"-width"];return r+fe(c)},0)}function is(t){for(var i=["top","right","bottom","left"],e={},r=0,o=i;r<o.length;r++){var c=o[r],u=t["padding-"+c];e[c]=fe(u)}return e}function os(t){var i=t.getBBox();return ye(0,0,i.width,i.height)}function as(t){var i=t.clientWidth,e=t.clientHeight;if(!i&&!e)return Xr;var r=St(t).getComputedStyle(t),o=is(r),c=o.left+o.right,u=o.top+o.bottom,s=fe(r.width),h=fe(r.height);if(r.boxSizing==="border-box"&&(Math.round(s+c)!==i&&(s-=vr(r,"left","right")+c),Math.round(h+u)!==e&&(h-=vr(r,"top","bottom")+u)),!hs(t)){var l=Math.round(s+c)-i,a=Math.round(h+u)-e;Math.abs(l)!==1&&(s-=l),Math.abs(a)!==1&&(h-=a)}return ye(o.left,o.top,s,h)}var cs=(function(){return typeof SVGGraphicsElement<"u"?function(t){return t instanceof St(t).SVGGraphicsElement}:function(t){return t instanceof St(t).SVGElement&&typeof t.getBBox=="function"}})();function hs(t){return t===St(t).document.documentElement}function ls(t){return De?cs(t)?os(t):as(t):Xr}function us(t){var i=t.x,e=t.y,r=t.width,o=t.height,c=typeof DOMRectReadOnly<"u"?DOMRectReadOnly:Object,u=Object.create(c.prototype);return Ur(u,{x:i,y:e,width:r,height:o,top:e,right:i+r,bottom:o+e,left:i}),u}function ye(t,i,e,r){return{x:t,y:i,width:e,height:r}}var ds=(function(){function t(i){this.broadcastWidth=0,this.broadcastHeight=0,this.contentRect_=ye(0,0,0,0),this.target=i}return t.prototype.isActive=function(){var i=ls(this.target);return this.contentRect_=i,i.width!==this.broadcastWidth||i.height!==this.broadcastHeight},t.prototype.broadcastRect=function(){var i=this.contentRect_;return this.broadcastWidth=i.width,this.broadcastHeight=i.height,i},t})(),ps=(function(){function t(i,e){var r=us(e);Ur(this,{target:i,contentRect:r})}return t})(),fs=(function(){function t(i,e,r){if(this.activeObservations_=[],this.observations_=new Nr,typeof i!="function")throw new TypeError("The callback provided as parameter 1 is not a function.");this.callback_=i,this.controller_=e,this.callbackCtx_=r}return t.prototype.observe=function(i){if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");if(!(typeof Element>"u"||!(Element instanceof Object))){if(!(i instanceof St(i).Element))throw new TypeError('parameter 1 is not of type "Element".');var e=this.observations_;e.has(i)||(e.set(i,new ds(i)),this.controller_.addObserver(this),this.controller_.refresh())}},t.prototype.unobserve=function(i){if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");if(!(typeof Element>"u"||!(Element instanceof Object))){if(!(i instanceof St(i).Element))throw new TypeError('parameter 1 is not of type "Element".');var e=this.observations_;e.has(i)&&(e.delete(i),e.size||this.controller_.removeObserver(this))}},t.prototype.disconnect=function(){this.clearActive(),this.observations_.clear(),this.controller_.removeObserver(this)},t.prototype.gatherActive=function(){var i=this;this.clearActive(),this.observations_.forEach(function(e){e.isActive()&&i.activeObservations_.push(e)})},t.prototype.broadcastActive=function(){if(this.hasActive()){var i=this.callbackCtx_,e=this.activeObservations_.map(function(r){return new ps(r.target,r.broadcastRect())});this.callback_.call(i,e,i),this.clearActive()}},t.prototype.clearActive=function(){this.activeObservations_.splice(0)},t.prototype.hasActive=function(){return this.activeObservations_.length>0},t})(),Yr=typeof WeakMap<"u"?new WeakMap:new Nr,Kr=(function(){function t(i){if(!(this instanceof t))throw new TypeError("Cannot call a class as a function.");if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");var e=ss.getInstance(),r=new fs(i,e,this);Yr.set(this,r)}return t})();["observe","unobserve","disconnect"].forEach(function(t){Kr.prototype[t]=function(){var i;return(i=Yr.get(this))[t].apply(i,arguments)}});var xs=(function(){return typeof pe.ResizeObserver<"u"?pe.ResizeObserver:Kr})();function xe(t,i){L.extend(t,i)}const H=t=>f.forwardRef(({children:i,...e},r)=>Zr(t,i,e,r)[0]);function Jr(){const t=Math.floor(Math.random()*16777216).toString(16).toUpperCase();return"#"+t.padStart(6,"0")=="#000000"?Jr():"#"+t.padStart(6,"0")}const ke=t=>{let i=t.toString(16);return i.length==1?"0"+i:i},gs=(t,i,e)=>"#"+ke(t)+ke(i)+ke(e);function Ge(t,i,e){return new Proxy(t,{set(r,o,c){return typeof c=="object"&&c!==null&&(c=Ge(c,i)),i(r,o,c,e),r[o]=c,!0},get(r,o){return typeof r[o]=="object"&&r[o]!==null?Ge(r[o],i,o):r[o]}})}const yr=(t,i,e)=>{const r=t.getBoundingClientRect();return{x:(i.clientX-r.left)/(r.right-r.left)*e.width,y:(i.clientY-r.top)/(r.bottom-r.top)*e.height}},mr=({x:t,y:i,canvasContext:e})=>{let r=e.getImageData(t,i,1,1).data;return gs(r[0],r[1],r[2])},Qr=f.createContext(),br=f.createContext(),wr=f.createContext();function vs(){const t=S.useRef(),[i,e]=S.useState({left:0,top:0,width:0,height:0}),[r]=S.useState(()=>new xs(([o])=>e(o.contentRect)));return S.useEffect(()=>(t.current&&r.observe(t.current),()=>r.disconnect()),[t.current]),[{ref:t},i]}function Zr(t,i,e,r){const o=S.useContext(Qr),c=S.useContext(br),u=S.useContext(wr),s=S.useMemo(()=>Jr(),[]),h=S.useMemo(()=>({stroke:!1,...e,color:s,leftFace:s,rightFace:s,topFace:s,bottomFace:s}),[s,e]),[l]=S.useState(()=>new t(e)),[a]=S.useState(()=>new t(h)),d=(g,x,v,w)=>{w?a[w][x]=v:a[x]=v,o.current.illu.updateRenderGraph()},[p]=S.useState(()=>Ge(l,d));return S.useImperativeHandle(r,()=>p),S.useLayoutEffect(()=>{xe(l,e),c&&o.current.illu.updateRenderGraph()},[e]),S.useLayoutEffect(()=>{xe(a,h)},[h]),S.useLayoutEffect(()=>{if(c)return c.addChild(l),o.current.illu.updateGraph(),()=>{c.removeChild(l),c.updateFlatGraph(),o.current.illu.updateGraph()}},[c]),S.useEffect(()=>{if(c)return o.current.itemMap[s]=l,e.onClick&&(o.current.clickEventMap[s]=e.onClick),e.onPointerMove&&(o.current.pointerMoveEventMap[s]=e.onPointerMove),e.onPointerEnter&&(o.current.pointerEnterEventMap[s]=e.onPointerEnter),e.onPointerLeave&&(o.current.pointerLeaveEventMap[s]=e.onPointerLeave),()=>{delete o.current.itemMap[s],delete o.current.clickEventMap[s],delete o.current.pointerMoveEventMap[s],delete o.current.pointerEnterEventMap[s],delete o.current.pointerLeaveEventMap[s]}},[e]),S.useLayoutEffect(()=>{if(u)return u.addChild(a),o.current.illu_ghost.updateGraph(),()=>{u.removeChild(a),u.updateFlatGraph(),o.current.illu_ghost.updateGraph()}},[u]),[it.jsx(wr.Provider,{value:a,children:it.jsx(br.Provider,{value:l,children:i})},s),l,a]}const at=f.memo(({children:t,style:i,resize:e,element:r="svg",frameloop:o="always",dragRotate:c,onDragMove:u=()=>{},onDragStart:s=()=>{},onDragEnd:h=()=>{},pointerEvents:l=!1,...a})=>{const d=S.useRef(),p=S.useRef(),[g,x]=S.useState(null);S.useEffect(()=>{x(p.current.getContext("2d",{willReadFrequently:!0}))},[]);const[v,w]=vs(),[E,R,P]=Zr(L.Anchor,t),j=S.useRef({scene:R,illu:void 0,size:{},subscribers:[],subscribe:$=>(j.current.subscribers.push($),()=>j.current.subscribers=j.current.subscribers.filter(I=>I!==$)),illu_ghost:void 0,itemMap:{},clickEventMap:{},pointerMoveEventMap:{},pointerEnterEventMap:{},pointerLeaveEventMap:{},pointerEvents:l});S.useEffect(()=>{j.current.size=w,j.current.illu&&(j.current.illu.setSize(w.width,w.height),j.current.illu_ghost.setSize(w.width,w.height),o==="demand"&&(j.current.illu.updateRenderGraph(),j.current.illu_ghost.updateRenderGraph()))},[w]),S.useEffect(()=>{j.current.illu=new L.Illustration({element:d.current,dragRotate:c,onDragMove:()=>{j.current.illu_ghost.rotate={x:j.current.illu.rotate.x,y:j.current.illu.rotate.y,z:j.current.illu.rotate.z},u()},onDragStart:s,onDragEnd:h,...a}),j.current.illu.addChild(R),j.current.illu.updateGraph(),j.current.illu_ghost=new L.Illustration({element:p.current,...a}),j.current.illu_ghost.addChild(P),j.current.illu_ghost.updateGraph();let $,I=!0;function T(_){const{size:B,subscribers:$t}=j.current;B.width&&B.height&&($t.forEach(_t=>_t(_)),o!=="demand"&&j.current.illu.updateRenderGraph()),I&&o!=="demand"&&($=requestAnimationFrame(T))}return T(),()=>{I=!1,cancelAnimationFrame($)}},[o]),S.useLayoutEffect(()=>{j.current.illu&&xe(j.current.illu,a),j.current.illu_ghost&&xe(j.current.illu_ghost,a)},[a]);const yt=$=>{if(!l)return;j.current.illu_ghost&&j.current.illu_ghost.updateRenderGraph();const I=yr(d.current,$,p.current),T=mr({...I,canvasContext:g}).toUpperCase(),_=j.current.clickEventMap[T];_&&_($,j.current.itemMap[T])},A=S.useRef(null),G=S.useRef(null),rt=$=>{G.current=$},be=$=>{if(!l)return;j.current.illu_ghost&&j.current.illu_ghost.updateRenderGraph();const I=yr(d.current,$,p.current),T=mr({...I,canvasContext:g}).toUpperCase();if(T!=="#000000"&&A.current!==T&&G.current!==T){const B=j.current.pointerEnterEventMap[T];B&&B($,j.current.itemMap[T]),rt(A.current)}if(A.current&&A.current!=="#000000"&&A.current!==T&&G.current){const B=j.current.pointerLeaveEventMap[A.current];B&&B($,j.current.itemMap[A.current])}const _=j.current.pointerMoveEventMap[T];_&&_($,j.current.itemMap[T]),A.current=T};return it.jsxs(it.Fragment,{children:[it.jsxs("div",{ref:v.ref,...a,style:{position:"relative",width:"100%",height:"100%",overflow:"hidden",boxSizing:"border-box",...i},children:[it.jsx(r,{ref:d,style:{display:"block",boxSizing:"border-box"},width:w.width,height:w.height,onClick:yt,onPointerMove:be}),j.current.illu&&it.jsx(Qr.Provider,{value:j,children:E})]}),it.jsx("canvas",{ref:p,style:{display:"block",boxSizing:"border-box",opacity:"0",position:"fixed",zIndex:"1000",pointerEvents:"none",background:"black"},width:w.width,height:w.height})]})});H(L.Anchor);const C=H(L.Shape);H(L.Group);H(L.Rect);H(L.RoundedRect);const O=H(L.Ellipse),ys=H(L.Polygon);H(L.Hemisphere);H(L.Cylinder);H(L.Cone);H(L.Box);const ct=y.div`
  width: ${t=>t.width}px;
  height: ${t=>t.height}px;
`,ms=y.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`,bs=y.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  opacity: 0.4;
`,Re=16,ws=Math.PI/6,bt=2.8,q=1.4,me=.5,tt="#48aff0",et="#f29e02",js=({x:t,z:i,pressed:e})=>n.jsxs(C,{translate:{x:t,z:i,y:e?me:0},stroke:0,children:[n.jsx(O,{diameter:q*2,stroke:.2,color:e?et:tt}),n.jsx(ys,{radius:q*.55,sides:3,stroke:.25,color:e?et:tt,fill:e})]}),Ss=({x:t,z:i,pressed:e})=>n.jsxs(C,{translate:{x:t,z:i,y:e?me:0},stroke:0,children:[n.jsx(O,{diameter:q*2,stroke:.2,color:e?et:tt}),n.jsx(O,{diameter:q*.9,stroke:.25,color:e?et:tt,fill:e})]}),Cs=({x:t,z:i,pressed:e})=>{const r=q*.4;return n.jsxs(C,{translate:{x:t,z:i,y:e?me:0},stroke:0,children:[n.jsx(O,{diameter:q*2,stroke:.2,color:e?et:tt}),n.jsx(C,{path:[{x:-r,y:0,z:-r},{x:r,y:0,z:r}],stroke:.25,color:e?et:tt}),n.jsx(C,{path:[{x:r,y:0,z:-r},{x:-r,y:0,z:r}],stroke:.25,color:e?et:tt})]})},Es=({x:t,z:i,pressed:e})=>{const r=q*.38,o=q*.44;return n.jsxs(C,{translate:{x:t,z:i,y:e?me:0},stroke:0,children:[n.jsx(O,{diameter:q*2,stroke:.2,color:e?et:tt}),n.jsx(C,{path:[{x:-r,y:0,z:-o},{x:r,y:0,z:-o},{x:r,y:0,z:o},{x:-r,y:0,z:o}],stroke:.25,color:e?et:tt,fill:e,closed:!0})]})},Xi=()=>{const t=f.useContext(z),[i,e]=f.useState(t.triangle.state),[r,o]=f.useState(t.circle.state),[c,u]=f.useState(t.cross.state),[s,h]=f.useState(t.square.state);return f.useEffect(()=>{t.triangle.on("change",({state:l})=>e(l)),t.circle.on("change",({state:l})=>o(l)),t.cross.on("change",({state:l})=>u(l)),t.square.on("change",({state:l})=>h(l))},[]),n.jsxs(ms,{children:[n.jsx(ct,{width:(bt*2+q*2+2)*Re,height:(bt*2+q*2+3)*Re,children:n.jsx(at,{element:"svg",zoom:Re,children:n.jsxs(C,{rotate:{x:ws},stroke:0,children:[n.jsx(js,{x:0,z:bt,pressed:i}),n.jsx(Ss,{x:bt,z:0,pressed:r}),n.jsx(Cs,{x:0,z:-bt,pressed:c}),n.jsx(Es,{x:-bt,z:0,pressed:s})]})})}),n.jsx(bs,{children:"Buttons"})]})},ks=y.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`,Rs=y.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  opacity: 0.4;
`,ze=16,zs=Math.PI/5,Ms=2.4,tn=1.8,en=2.2,jr=.5,Ts=.5,Ps="#48aff0",$s="#f29e02",_s=.7,It=({x:t,z:i,pressed:e,rotateY:r=0,wide:o=!1})=>{const c=(o?en:tn)/2,u=Ms/2,s=e?$s:Ps;return n.jsxs(C,{translate:{x:t,z:i,y:e?Ts:0},rotate:{y:r},stroke:0,children:[n.jsx(C,{path:[{x:0,y:0,z:-u-_s},{x:-c,y:0,z:-u},{x:-c,y:0,z:u},{x:c,y:0,z:u},{x:c,y:0,z:-u}],stroke:.2,color:s,fill:e,closed:!0}),n.jsx(C,{path:[{x:-jr,y:0,z:u*.2},{x:0,y:0,z:u*.7},{x:jr,y:0,z:u*.2}],stroke:.2,color:s,closed:!1})]})},Yi=()=>{const t=f.useContext(z),[i,e]=f.useState(t.dpad.up.state),[r,o]=f.useState(t.dpad.down.state),[c,u]=f.useState(t.dpad.left.state),[s,h]=f.useState(t.dpad.right.state);f.useEffect(()=>{t.dpad.up.on("change",({state:a})=>e(a)),t.dpad.down.on("change",({state:a})=>o(a)),t.dpad.left.on("change",({state:a})=>u(a)),t.dpad.right.on("change",({state:a})=>h(a))},[]);const l=2.8;return n.jsxs(ks,{children:[n.jsx(ct,{width:(l*2+en+2)*ze,height:(l*2+tn+3)*ze,children:n.jsx(at,{element:"svg",zoom:ze,children:n.jsxs(C,{rotate:{x:zs},stroke:0,children:[n.jsx(It,{x:0,z:l,pressed:i}),n.jsx(It,{x:0,z:-l,pressed:r,rotateY:Math.PI}),n.jsx(It,{x:-l,z:0,pressed:c,rotateY:Math.PI/2,wide:!0}),n.jsx(It,{x:l,z:0,pressed:s,rotateY:-Math.PI/2,wide:!0})]})})}),n.jsx(Rs,{children:"D-pad"})]})},As=y.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`,Ls=y.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  opacity: 0.4;
`,Bt=7,Sr=.3,Me=18,Cr=2.2,Ki=({label:t,x:i,y:e,pressed:r})=>n.jsxs(As,{children:[n.jsx(ct,{width:(Bt+2)*Me,height:(Bt+2)*Me,children:n.jsxs(at,{element:"svg",zoom:Me,children:[n.jsx(O,{stroke:Sr,diameter:Bt,color:r?"#f29e02":"#48aff0"}),n.jsx(O,{stroke:Sr,diameter:Bt*.6,color:"#f29e02",translate:{x:i*Cr,y:-e*Cr}})]})}),n.jsx(Ls,{children:t})]});y.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;y.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  opacity: 0.4;
`;y.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;y.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  opacity: 0.4;
`;const Os=y.div`
  display: flex;
  align-items: center;
  gap: 4px;
`,Er=y.span`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.35;
`,Is=y.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`,Ft=14,kr=Math.PI/5,K=3.5,ht=5,Bs=Math.PI/5,kt=3.5,Dt=1,Fs=.4,Te=2,Pe="#48aff0",$e="#f29e02",rn=({triggerLabel:t,bumperLabel:i,triggerPressure:e,triggerPressed:r,bumperPressed:o,labelSide:c})=>{const u=e*Bs,s=r?$e:Pe,h=r?"#ff8c00":e>0?`rgba(242, 158, 2, ${.2+e*.8})`:"rgba(72, 175, 240, 0.3)",l=o?$e:Pe,a=ht+Te+Dt,d=(Math.max(K,kt)+2)*Ft,p=(a+3)*Ft,g=n.jsx(ct,{width:d,height:p,children:n.jsx(at,{element:"svg",zoom:Ft,children:n.jsxs(C,{rotate:{x:-kr},stroke:0,children:[n.jsx(C,{path:[{x:-K/2,y:0,z:0},{x:K/2,y:0,z:0},{x:K/2,y:0,z:-ht},{x:-K/2,y:0,z:-ht}],stroke:.3,color:s,fill:!1,closed:!0}),n.jsx(C,{rotate:{x:u},stroke:0,children:n.jsx(C,{path:[{x:-K/2+.3,y:0,z:-ht+.3},{x:K/2-.3,y:0,z:-ht+.3},{x:K/2-.3,y:0,z:-.3},{x:-K/2+.3,y:0,z:-.3}],stroke:.4,color:h,fill:!0,closed:!0})}),n.jsx(O,{diameter:.6,stroke:.2,color:r?$e:Pe,translate:{y:e*2,z:-ht-.3}}),n.jsx(C,{translate:{z:Te},stroke:0,children:n.jsx(C,{path:[{x:-kt/2,y:0,z:0},{x:kt/2,y:0,z:0},{x:kt/2,y:0,z:Dt},{x:-kt/2,y:0,z:Dt}],stroke:.3,color:l,fill:o,closed:!0,translate:{y:o?Fs:0}})})]})})}),x=(ht/2+Te+Dt/2)*Ft*Math.cos(kr),v=n.jsxs(Is,{style:{gap:`${x}px`},children:[n.jsx(Er,{style:{marginTop:6},children:t}),n.jsx(Er,{style:{marginTop:-6},children:i})]});return n.jsx(Os,{children:c==="right"?n.jsxs(n.Fragment,{children:[g,v]}):n.jsxs(n.Fragment,{children:[v,g]})})},Ji=()=>{const t=f.useContext(z),[i,e]=f.useState(t.left.trigger.pressure),[r,o]=f.useState(t.left.trigger.button.state),[c,u]=f.useState(t.left.bumper.state);return f.useEffect(()=>{t.left.trigger.on("change",({pressure:s})=>e(s)),t.left.trigger.button.on("change",({state:s})=>o(s)),t.left.bumper.on("change",({state:s})=>u(s))},[]),n.jsx(rn,{triggerLabel:"L2",bumperLabel:"L1",triggerPressure:i,triggerPressed:r,bumperPressed:c,labelSide:"right"})},Qi=()=>{const t=f.useContext(z),[i,e]=f.useState(t.right.trigger.pressure),[r,o]=f.useState(t.right.trigger.button.state),[c,u]=f.useState(t.right.bumper.state);return f.useEffect(()=>{t.right.trigger.on("change",({pressure:s})=>e(s)),t.right.trigger.button.on("change",({state:s})=>o(s)),t.right.bumper.on("change",({state:s})=>u(s))},[]),n.jsx(rn,{triggerLabel:"R2",bumperLabel:"R1",triggerPressure:i,triggerPressed:r,bumperPressed:c,labelSide:"left"})},Ds=y.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`,Gs=y.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  opacity: 0.4;
`,_e=14,N=16,D=7,Rr=N/2-.5,zr=D/2-.5,Zi=()=>{const t=f.useContext(z),[i,e]=f.useState(t.touchpad.button.state),[r,o]=f.useState({active:t.touchpad.left.contact.state,x:t.touchpad.left.x.state,y:t.touchpad.left.y.state}),[c,u]=f.useState({active:t.touchpad.right.contact.state,x:t.touchpad.right.x.state,y:t.touchpad.right.y.state});return f.useEffect(()=>{t.touchpad.button.on("change",({state:s})=>e(s)),t.touchpad.left.on("change",s=>{o({active:s.contact.state,x:s.x.state,y:s.y.state})}),t.touchpad.right.on("change",s=>{u({active:s.contact.state,x:s.x.state,y:s.y.state})})},[]),n.jsxs(Ds,{children:[n.jsx(ct,{width:(N+2)*_e,height:(D+2)*_e,children:n.jsxs(at,{element:"svg",zoom:_e,children:[n.jsx(C,{path:[{x:-N/2,y:-D/2},{x:N/2,y:-D/2},{x:N/2,y:D/2},{x:-N/2,y:D/2}],stroke:.2,color:i?"#48aff0":"#335577",fill:!0,closed:!0}),n.jsx(C,{path:[{x:-N/2,y:-D/2},{x:N/2,y:-D/2},{x:N/2,y:D/2},{x:-N/2,y:D/2}],stroke:.15,color:"#48aff0",fill:!1,closed:!0}),n.jsx(C,{path:[{x:0,y:-D/2+.5},{x:0,y:D/2-.5}],stroke:.08,color:"rgba(72, 175, 240, 0.3)"}),r.active&&n.jsx(O,{diameter:1.2,stroke:.3,color:"#f29e02",translate:{x:r.x*Rr,y:r.y*zr}}),c.active&&n.jsx(O,{diameter:1.2,stroke:.3,color:"#ff6b35",translate:{x:c.x*Rr,y:c.y*zr}})]})}),n.jsx(Gs,{children:"Touchpad"})]})},Ws=y.div`
  display: flex;
  align-items: center;
  gap: 6px;
`,Mr=y.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`,We=y.span`
  font-size: 7px;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.3;
`,Gt=6,Tr=.2,Ae=14,Wt=4,lt=40,qs="#48aff0",Hs="#f29e02",wt=({value:t,label:i})=>{const e=Math.min(1,Math.abs(t)),r=e*(lt/2),o=t<0;return n.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:1},children:[n.jsxs("svg",{width:Wt,height:lt,children:[n.jsx("rect",{x:0,y:0,width:Wt,height:lt,fill:"rgba(72, 175, 240, 0.08)",rx:1}),n.jsx("line",{x1:0,y1:lt/2,x2:Wt,y2:lt/2,stroke:"rgba(72, 175, 240, 0.15)",strokeWidth:.5}),r>0&&n.jsx("rect",{x:0,y:o?lt/2:lt/2-r,width:Wt,height:r,fill:e>.7?Hs:qs,opacity:.4+e*.6,rx:1})]}),n.jsx(We,{children:i})]})},Pr=y.div`
  display: flex;
  gap: 2px;
`,to=()=>{const t=f.useContext(z),[i,e]=f.useState({x:t.gyroscope.x.force,y:t.gyroscope.y.force,z:t.gyroscope.z.force}),[r,o]=f.useState({x:t.accelerometer.x.force,y:t.accelerometer.y.force,z:t.accelerometer.z.force});return f.useEffect(()=>{t.gyroscope.on("change",c=>{e({x:c.x.force,y:c.y.force,z:c.z.force})}),t.accelerometer.on("change",c=>{o({x:c.x.force,y:c.y.force,z:c.z.force})})},[]),n.jsxs(Ws,{children:[n.jsxs(Mr,{children:[n.jsxs(Pr,{children:[n.jsx(wt,{value:i.x,label:"x"}),n.jsx(wt,{value:i.y,label:"y"}),n.jsx(wt,{value:i.z,label:"z"})]}),n.jsx(We,{children:"Gyro"})]}),n.jsx(ct,{width:(Gt+2)*Ae,height:(Gt+2)*Ae,children:n.jsx(at,{element:"svg",zoom:Ae,children:n.jsxs(C,{rotate:{y:i.x*Math.PI*2,x:i.y*Math.PI*2,z:i.z*Math.PI*2},stroke:0,children:[n.jsx(O,{stroke:Tr,diameter:Gt/3,translate:{x:r.x*3,y:r.y*3,z:r.z*3},color:"#f29e02"}),n.jsx(O,{stroke:Tr,diameter:Gt,color:"#48aff0"})]})})}),n.jsxs(Mr,{children:[n.jsxs(Pr,{children:[n.jsx(wt,{value:r.x,label:"x"}),n.jsx(wt,{value:r.y,label:"y"}),n.jsx(wt,{value:r.z,label:"z"})]}),n.jsx(We,{children:"Accel"})]})]})},Vs=y.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin-top: 6px;
`,Ns=y.span`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.35;
`,Us=y.span`
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.25;
`,Rt=22,J=48,Xs="#48aff0",Ys="#f29e02",nn=({value:t,onChange:i,label:e})=>{const r=f.useRef(null),o=f.useRef(!1),c=f.useCallback(a=>{const d=r.current;if(!d)return;const p=d.getBoundingClientRect(),g=a.clientY-p.top,x=Math.max(0,Math.min(1,1-g/p.height)),v=Math.round(x*20)/20;i(v)},[i]),u=f.useCallback(a=>{o.current=!0,c(a);const d=g=>{o.current&&c(g)},p=()=>{o.current=!1,window.removeEventListener("mousemove",d),window.removeEventListener("mouseup",p)};window.addEventListener("mousemove",d),window.addEventListener("mouseup",p)},[c]),s=t*J,h=t>0?Ys:Xs,l=Math.round(t*100);return n.jsxs(Vs,{title:`${e}: ${l}% — drag to adjust`,children:[n.jsxs("svg",{ref:r,width:Rt,height:J,style:{cursor:"ns-resize",borderRadius:3},onMouseDown:u,children:[n.jsx("rect",{x:0,y:0,width:Rt,height:J,fill:"rgba(72, 175, 240, 0.1)",rx:2}),n.jsx("rect",{x:.5,y:.5,width:Rt-1,height:J-1,fill:"none",stroke:"rgba(72, 175, 240, 0.3)",strokeWidth:1,rx:2}),s>0&&n.jsx("rect",{x:2,y:J-s,width:Rt-4,height:s,fill:h,opacity:.3+t*.7,rx:1}),t>0&&n.jsx("line",{x1:1,y1:J-s,x2:Rt-1,y2:J-s,stroke:h,strokeWidth:1,opacity:.8}),[.25,.5,.75].map(a=>n.jsx("line",{x1:0,y1:J*(1-a),x2:2,y2:J*(1-a),stroke:"rgba(72, 175, 240, 0.2)",strokeWidth:.5},a))]}),n.jsx(Ns,{children:e}),n.jsx(Us,{children:"drag me"})]})},eo=()=>{const t=f.useContext(z),[i,e]=f.useState(t.left.rumble()),r=f.useCallback(o=>{e(o),t.left.rumble(o)},[t]);return n.jsx(nn,{value:i,onChange:r,label:"Rumble"})},ro=()=>{const t=f.useContext(z),[i,e]=f.useState(t.right.rumble()),r=f.useCallback(o=>{e(o),t.right.rumble(o)},[t]);return n.jsx(nn,{value:i,onChange:r,label:"Rumble"})};function Ks(t,i,e){return"#"+[t,i,e].map(r=>r.toString(16).padStart(2,"0")).join("")}function Js(t){const i=parseInt(t.slice(1),16);return{r:i>>16&255,g:i>>8&255,b:i&255}}const Qs=y.div`
  position: relative;
  cursor: pointer;
`,Zs=y.div`
  width: 100%;
  height: 14px;
  border-radius: 7px;
  background: ${t=>t.$color};
  border: 1px solid #48aff0;
  box-shadow: 0 0 8px ${t=>t.$color}66, 0 0 20px ${t=>t.$color}33;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 0 12px ${t=>t.$color}99, 0 0 30px ${t=>t.$color}55;
  }
`,ti=y.span`
  font-size: 7px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.9), 0 0 6px rgba(0, 0, 0, 0.6);
`,ei=y.input`
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
`,no=()=>{const t=f.useContext(z),i=t.lightbar.color,[e,r]=f.useState(Ks(i.r,i.g,i.b)),o=f.useRef(null),c=f.useCallback(s=>{const h=s.target.value;r(h),t.lightbar.set(Js(h))},[t]),u=f.useCallback(()=>{var s;(s=o.current)==null||s.click()},[]);return n.jsxs(Qs,{onClick:u,title:"Click to change lightbar color",children:[n.jsx(Zs,{$color:e,children:n.jsx(ti,{children:"click to adjust lights"})}),n.jsx(ei,{ref:o,type:"color",value:e,onChange:c})]})},ri=y.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  opacity: 0.7;
`,ni=y.span`
  font-size: 11px;
  opacity: 0.6;
`,$r=y.button`
  background: rgba(72, 175, 240, 0.1);
  border: 1px solid rgba(72, 175, 240, 0.25);
  border-radius: 3px;
  color: #48aff0;
  font-size: 10px;
  padding: 2px 8px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: rgba(72, 175, 240, 0.25);
  }

  &:active {
    background: rgba(72, 175, 240, 0.4);
  }
`,so=()=>{const t=f.useContext(z),[i,e]=f.useState(t.connection.state);return f.useEffect(()=>{e(t.connection.state),t.connection.on("change",({state:r})=>e(r))},[t]),i?n.jsxs(ri,{children:[n.jsx(ni,{children:"Lightbar:"}),n.jsx($r,{onClick:()=>t.lightbar.fadeBlue(),children:"Fade Blue"}),n.jsx($r,{onClick:()=>t.lightbar.fadeOut(),children:"Fade Out"})]}):null},si=y.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`,ii=y.div`
  display: flex;
  gap: 4px;
  align-items: center;
`,sn=y.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s;

  &:hover {
    background: rgba(72, 175, 240, 0.08);
  }
`,oi=y.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1.5px solid ${t=>t.$on?"#48aff0":"rgba(72, 175, 240, 0.3)"};
  background: ${t=>t.$on?"#48aff0":"transparent"};
  box-shadow: ${t=>t.$on?"0 0 8px #48aff0":"none"};
  transition: all 0.15s;

  ${sn}:hover & {
    border-color: #48aff0;
    background: ${t=>t.$on?"#48aff0":"rgba(72, 175, 240, 0.15)"};
  }
`,ai=y.div`
  display: flex;
  align-items: center;
  gap: 0;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 3px 6px;
`,ci=y.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s;

  &:hover {
    background: rgba(72, 175, 240, 0.1);
  }

  &:hover > div {
    border-color: #48aff0;
  }
`,hi=({rays:t,active:i})=>{const s=i?"#48aff0":"rgba(72, 175, 240, 0.4)",h=Array.from({length:t},(l,a)=>{const d=a*2*Math.PI/t-Math.PI/2;return n.jsx("line",{x1:8+Math.cos(d)*4,y1:8+Math.sin(d)*4,x2:8+Math.cos(d)*6.5,y2:8+Math.sin(d)*6.5,stroke:s,strokeWidth:"1.2",strokeLinecap:"round"},a)});return n.jsxs("svg",{width:16,height:16,viewBox:"0 0 16 16",style:{display:"block"},children:[n.jsx("circle",{cx:8,cy:8,r:2.5,fill:i?s:"none",stroke:s,strokeWidth:"1"}),h]})},li=y.span`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.3;
`,ui=y.span`
  font-size: 7px;
  opacity: 0.2;
`,di=[{value:m.Brightness.Low,label:"Low",rays:4},{value:m.Brightness.Medium,label:"Medium",rays:6},{value:m.Brightness.High,label:"High",rays:8}],io=()=>{const t=f.useContext(z),[,i]=f.useState(0),[e,r]=f.useState(t.playerLeds.brightness),o=()=>i(s=>s+1),c=s=>{t.playerLeds.setLed(s,!t.playerLeds.getLed(s)),o()},u=s=>{r(s),t.playerLeds.setBrightness(s)};return n.jsxs(si,{children:[n.jsx(ii,{children:[0,1,2,3,4].map(s=>{const h=t.playerLeds.getLed(s);return n.jsx(sn,{onClick:()=>c(s),title:`LED ${s+1}: ${h?"ON":"OFF"} — click to toggle`,children:n.jsx(oi,{$on:h})},s)})}),n.jsx(ai,{title:"LED brightness",children:di.map(({value:s,label:h,rays:l})=>n.jsx(ci,{onClick:()=>u(s),title:h,children:n.jsx(hi,{rays:l,active:e===s})},s))}),n.jsx(li,{children:"Player LEDs"}),n.jsx(ui,{children:"click me"})]})},on=y.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`,an=y.span`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.35;
`,jt=14,cn=Math.PI/6,hn=.4,ot=1.8,_r=2.8,Tt="#48aff0",Pt="#f29e02",qe=({label:t,pressed:i,size:e,children:r})=>n.jsxs(on,{children:[n.jsx(ct,{width:(e+2)*jt,height:(e+2)*jt,children:n.jsx(at,{element:"svg",zoom:jt,children:n.jsx(C,{rotate:{x:cn},stroke:0,children:n.jsx(C,{translate:{y:i?hn:0},stroke:0,children:r})})})}),n.jsx(an,{children:t})]}),oo=()=>{const t=f.useContext(z),[i,e]=f.useState(t.create.state);f.useEffect(()=>{t.create.on("change",({state:h})=>e(h))},[]);const r=i?Pt:Tt,o=ot*.35,c=o*.65,u=ot*.22,s=.08;return n.jsxs(qe,{label:"Create",pressed:i,size:ot,children:[n.jsx(O,{diameter:ot,stroke:.15,color:r}),n.jsx(C,{path:[{x:-u+s,y:0,z:-o},{x:-u-s,y:0,z:c}],stroke:.15,color:r}),n.jsx(C,{path:[{x:0,y:0,z:-o},{x:0,y:0,z:o}],stroke:.15,color:r}),n.jsx(C,{path:[{x:u-s,y:0,z:-o},{x:u+s,y:0,z:c}],stroke:.15,color:r})]})},ao=()=>{const t=f.useContext(z),[i,e]=f.useState(t.options.state);f.useEffect(()=>{t.options.on("change",({state:s})=>e(s))},[]);const r=i?Pt:Tt,o=ot*.3,c=o*.7,u=ot*.24;return n.jsxs(qe,{label:"Options",pressed:i,size:ot,children:[n.jsx(O,{diameter:ot,stroke:.15,color:r}),n.jsx(C,{path:[{x:-c,y:0,z:-u},{x:c,y:0,z:-u}],stroke:.15,color:r}),n.jsx(C,{path:[{x:-o,y:0,z:0},{x:o,y:0,z:0}],stroke:.15,color:r}),n.jsx(C,{path:[{x:-c,y:0,z:u},{x:c,y:0,z:u}],stroke:.15,color:r})]})},co=()=>{const t=f.useContext(z),[i,e]=f.useState(t.ps.state);f.useEffect(()=>{t.ps.on("change",({state:d})=>e(d))},[]);const r=i?Pt:Tt,o=i?Tt:r,c=.18,u=-.38,s=.42,h=.95,l=-.85,a=.05;return n.jsxs(qe,{label:"PS",pressed:i,size:_r,children:[n.jsx(O,{diameter:_r,stroke:.25,color:r,fill:i}),n.jsx(C,{path:[{x:u,y:0,z:h},{x:u,y:0,z:l}],stroke:c,color:o}),n.jsx(C,{path:[{x:u,y:0,z:h},{arc:[{x:u+.65,y:0,z:h},{x:u+.65,y:0,z:(h+a)/2}]},{arc:[{x:u+.65,y:0,z:a},{x:u,y:0,z:a}]}],stroke:c,color:o,closed:!1}),n.jsx(C,{path:[{x:s+.22,y:0,z:a},{x:s-.22,y:0,z:a},{x:s-.22,y:0,z:(a+l)/2},{x:s+.22,y:0,z:(a+l)/2},{x:s+.22,y:0,z:l},{x:s-.22,y:0,z:l}],stroke:c,color:o,closed:!1})]})},Ar=2.4,Lr=1,ho=()=>{const t=f.useContext(z),[i,e]=f.useState(t.mute.state),[r,o]=f.useState(t.mute.status.state),[c,u]=f.useState(!1),s=f.useRef(c);s.current=c,f.useEffect(()=>{t.mute.on("change",({state:g})=>e(g)),t.mute.status.on("change",({state:g})=>{o(g),s.current&&(t.mute.setLed(g?m.MuteLedMode.On:m.MuteLedMode.Off),u(!1))})},[]);const h=()=>{c?(t.mute.setLed(t.mute.status.state?m.MuteLedMode.On:m.MuteLedMode.Off),u(!1)):(t.mute.setLed(m.MuteLedMode.Pulse),u(!0))},l=r||c||i?Pt:Tt,a=Ar/2,d=Lr/2,p=d;return n.jsxs(on,{onClick:h,style:{cursor:"pointer"},children:[n.jsx(ct,{width:(Ar+2)*jt,height:(Lr+2)*jt,style:{pointerEvents:"none"},children:n.jsx(at,{element:"svg",zoom:jt,children:n.jsx(C,{rotate:{x:cn},stroke:0,children:n.jsx(C,{translate:{y:i?hn:0},stroke:0,children:n.jsx(C,{path:[{x:-a+p,y:0,z:-d},{x:a-p,y:0,z:-d},{arc:[{x:a,y:0,z:-d},{x:a,y:0,z:0}]},{arc:[{x:a,y:0,z:d},{x:a-p,y:0,z:d}]},{x:-a+p,y:0,z:d},{arc:[{x:-a,y:0,z:d},{x:-a,y:0,z:0}]},{arc:[{x:-a,y:0,z:-d},{x:-a+p,y:0,z:-d}]}],stroke:.15,color:l,fill:r||c,closed:!0})})})})}),n.jsx(an,{children:r?c?"Pulsing":"Muted":"Mute"})]})};y.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;const pi=Fr`
  0%, 100% { box-shadow: 0 0 0 0 rgba(242, 158, 2, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(242, 158, 2, 0); }
`;y.button`
  animation: ${pi} 2s ease-in-out infinite;
  background: transparent;
  border: 1px solid rgba(242, 158, 2, 0.5);
  border-radius: 3px;
  color: #f29e02;
  font-size: 13px;
  font-weight: 500;
  padding: 5px 14px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: rgba(242, 158, 2, 0.1);
  }
`;const fi=y.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;function xi(t){switch(t){case m.ChargeStatus.Charging:return"Charging";case m.ChargeStatus.Full:return"Full";case m.ChargeStatus.Discharging:return"Battery";case m.ChargeStatus.AbnormalVoltage:return"Voltage Error";case m.ChargeStatus.AbnormalTemperature:return"Temp Error";case m.ChargeStatus.ChargingError:return"Error";default:return"Unknown"}}function gi(t,i){return i===m.ChargeStatus.Charging||i===m.ChargeStatus.Full?"success":t<.2?"danger":t<.4?"warning":"primary"}const lo=()=>{const t=S.useContext(z),[i,e]=S.useState(t.battery.level.state),[r,o]=S.useState(t.battery.status.state),[c,u]=S.useState(t.connection.state);if(S.useEffect(()=>{e(t.battery.level.state),o(t.battery.status.state),u(t.connection.state),t.battery.level.on("change",({state:a})=>e(a)),t.battery.status.on("change",({state:a})=>o(a)),t.connection.on("change",({state:a})=>u(a))},[t]),!c)return null;const s=Math.round(i*100),h=r===m.ChargeStatus.Charging||r===m.ChargeStatus.Full,l=n.jsxs("svg",{width:"18",height:"10",viewBox:"0 0 18 10",style:{display:"block"},children:[n.jsx("rect",{x:"0.5",y:"0.5",width:"14",height:"9",rx:"1.5",fill:"none",stroke:"currentColor",strokeWidth:"1"}),n.jsx("rect",{x:"15",y:"3",width:"2",height:"4",rx:"0.5",fill:"currentColor"}),n.jsx("rect",{x:"2",y:"2",width:Math.max(0,i*11),height:"6",rx:"0.5",fill:"currentColor",opacity:.6}),h&&n.jsx("path",{d:"M8 1.5 L6 5 L8.5 5 L7 8.5 L10 4.5 L7.5 4.5 L9 1.5Z",fill:"currentColor",opacity:.9})]});return n.jsx(fi,{children:n.jsxs(Mt,{$minimal:!0,$intent:gi(i,r),children:[l," ",xi(r),": ",s,"%"]})})},vi={"00":"#e8e8e8","01":"#1a1a2e","02":"#c8102e","03":"#f2a6c0","04":"#6b3fa0","05":"#5b9bd5","06":"#8a9a7b","07":"#9b2335","08":"#c0c0c0","09":"#1e3a5f",10:"#2db5a0",11:"#3d4f7c",12:"#e8dfd0",30:"#4a4a4a"},yi=y.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${t=>t.$color};
  border: 1px solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
`,uo=()=>{const t=S.useContext(z),[i,e]=S.useState(t.factoryInfo),[r,o]=S.useState(t.connection.state);if(S.useEffect(()=>{o(t.connection.state),e(t.factoryInfo),t.on("change",s=>{s.factoryInfo&&e(s.factoryInfo)}),t.connection.on("change",({state:s})=>{o(s),s||e(void 0)})},[t]),!r||!i)return null;const c=vi[i.colorCode],u=i.colorName??i.colorCode;return n.jsxs(Mt,{$minimal:!0,title:`Controller color: ${u}${i.boardRevision?` (${i.boardRevision})`:""}`,children:[c&&n.jsx(yi,{$color:c})," ",u]})},mi=y.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  flex-wrap: wrap;
`,Or=y.div`
  display: flex;
  align-items: center;
  gap: 10px;
`,bi=y.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 140px;
`,wi=y.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 200px;
`,Ir=y.span`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.35;
`,ut=180,dt=28,Le="#48aff0",He=({label:t,value:i,onChange:e,min:r=0,max:o=1,step:c=.05,formatValue:u})=>{const s=f.useRef(null),h=f.useRef(!1),l=f.useCallback(x=>{const v=s.current;if(!v)return;const w=v.getBoundingClientRect(),E=x.clientX-w.left,R=Math.max(0,Math.min(1,E/w.width)),P=r+R*(o-r),j=Math.round(P/c)*c;e(Math.max(r,Math.min(o,j)))},[e,r,o,c]),a=f.useCallback(x=>{h.current=!0,l(x);const v=E=>{h.current&&l(E)},w=()=>{h.current=!1,window.removeEventListener("mousemove",v),window.removeEventListener("mouseup",w)};window.addEventListener("mousemove",v),window.addEventListener("mouseup",w)},[l]),d=(i-r)/(o-r),p=d*ut,g=u?u(i):i<=1?Math.round(i*100)+"%":String(i);return n.jsxs("svg",{ref:s,width:ut,height:dt,style:{cursor:"ew-resize",borderRadius:3,flex:"1 1 "+ut+"px",maxWidth:280},onMouseDown:a,children:[n.jsx("rect",{x:0,y:0,width:ut,height:dt,fill:"rgba(72, 175, 240, 0.08)",rx:3}),n.jsx("rect",{x:.5,y:.5,width:ut-1,height:dt-1,fill:"none",stroke:"rgba(72, 175, 240, 0.2)",strokeWidth:1,rx:3}),p>0&&n.jsx("rect",{x:1,y:1,width:Math.min(p,ut-2),height:dt-2,fill:Le,opacity:.15+d*.25,rx:2}),d>0&&n.jsx("line",{x1:p,y1:1,x2:p,y2:dt-1,stroke:Le,strokeWidth:1.5,opacity:.6}),n.jsx("text",{x:7,y:dt/2,dominantBaseline:"central",fill:"currentColor",fontSize:11,fontWeight:600,opacity:.5,children:t}),n.jsx("text",{x:ut-7,y:dt/2,dominantBaseline:"central",textAnchor:"end",fill:Le,fontSize:11,fontWeight:600,opacity:.7,children:g})]})},ji=y.button`
  background: ${t=>t.$active?"rgba(72, 175, 240, 0.2)":"rgba(72, 175, 240, 0.04)"};
  border: 1px solid ${t=>t.$active?"rgba(72, 175, 240, 0.5)":"rgba(72, 175, 240, 0.15)"};
  border-radius: 3px;
  color: ${t=>t.$active?"#48aff0":"rgba(72, 175, 240, 0.5)"};
  font-size: 11px;
  padding: 3px 10px;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { background: rgba(72, 175, 240, 0.15); color: #48aff0; }
`,Oe={[m.TriggerEffect.Off]:{effect:m.TriggerEffect.Off},[m.TriggerEffect.Feedback]:{effect:m.TriggerEffect.Feedback,position:.3,strength:.8},[m.TriggerEffect.Weapon]:{effect:m.TriggerEffect.Weapon,start:.15,end:.7,strength:.8},[m.TriggerEffect.Bow]:{effect:m.TriggerEffect.Bow,start:.1,end:.6,strength:.8,snapForce:.9},[m.TriggerEffect.Galloping]:{effect:m.TriggerEffect.Galloping,start:.1,end:.6,firstFoot:.3,secondFoot:.7,frequency:20},[m.TriggerEffect.Vibration]:{effect:m.TriggerEffect.Vibration,position:.1,amplitude:.7,frequency:40},[m.TriggerEffect.Machine]:{effect:m.TriggerEffect.Machine,start:.1,end:.9,amplitudeA:.5,amplitudeB:1,frequency:30,period:5}};function M({label:t,value:i,onChange:e}){return n.jsx(He,{label:t,value:i,onChange:e})}function Ie({label:t,value:i,onChange:e}){return n.jsx(He,{label:t,value:i,onChange:e,min:1,max:255,step:1,formatValue:r=>String(Math.round(r))})}function Si({label:t,value:i,onChange:e}){return n.jsx(He,{label:t,value:i,onChange:e,min:0,max:20,step:1,formatValue:r=>String(Math.round(r))})}function Ci({config:t,onChange:i}){switch(t.effect){case m.TriggerEffect.Off:return null;case m.TriggerEffect.Feedback:return n.jsxs(n.Fragment,{children:[n.jsx(M,{label:"Position",value:t.position,onChange:e=>i({...t,position:e})}),n.jsx(M,{label:"Strength",value:t.strength,onChange:e=>i({...t,strength:e})})]});case m.TriggerEffect.Weapon:return n.jsxs(n.Fragment,{children:[n.jsx(M,{label:"Start",value:t.start,onChange:e=>i({...t,start:e})}),n.jsx(M,{label:"End",value:t.end,onChange:e=>i({...t,end:e})}),n.jsx(M,{label:"Strength",value:t.strength,onChange:e=>i({...t,strength:e})})]});case m.TriggerEffect.Bow:return n.jsxs(n.Fragment,{children:[n.jsx(M,{label:"Start",value:t.start,onChange:e=>i({...t,start:e})}),n.jsx(M,{label:"End",value:t.end,onChange:e=>i({...t,end:e})}),n.jsx(M,{label:"Strength",value:t.strength,onChange:e=>i({...t,strength:e})}),n.jsx(M,{label:"Snap Force",value:t.snapForce,onChange:e=>i({...t,snapForce:e})})]});case m.TriggerEffect.Galloping:return n.jsxs(n.Fragment,{children:[n.jsx(M,{label:"Start",value:t.start,onChange:e=>i({...t,start:e})}),n.jsx(M,{label:"End",value:t.end,onChange:e=>i({...t,end:e})}),n.jsx(M,{label:"First Foot",value:t.firstFoot,onChange:e=>i({...t,firstFoot:e})}),n.jsx(M,{label:"Second Foot",value:t.secondFoot,onChange:e=>i({...t,secondFoot:e})}),n.jsx(Ie,{label:"Frequency",value:t.frequency,onChange:e=>i({...t,frequency:e})})]});case m.TriggerEffect.Vibration:return n.jsxs(n.Fragment,{children:[n.jsx(M,{label:"Position",value:t.position,onChange:e=>i({...t,position:e})}),n.jsx(M,{label:"Amplitude",value:t.amplitude,onChange:e=>i({...t,amplitude:e})}),n.jsx(Ie,{label:"Frequency",value:t.frequency,onChange:e=>i({...t,frequency:e})})]});case m.TriggerEffect.Machine:return n.jsxs(n.Fragment,{children:[n.jsx(M,{label:"Start",value:t.start,onChange:e=>i({...t,start:e})}),n.jsx(M,{label:"End",value:t.end,onChange:e=>i({...t,end:e})}),n.jsx(M,{label:"Amplitude A",value:t.amplitudeA,onChange:e=>i({...t,amplitudeA:e})}),n.jsx(M,{label:"Amplitude B",value:t.amplitudeB,onChange:e=>i({...t,amplitudeB:e})}),n.jsx(Ie,{label:"Frequency",value:t.frequency,onChange:e=>i({...t,frequency:e})}),n.jsx(Si,{label:"Period",value:t.period,onChange:e=>i({...t,period:e})})]})}}const Ei=({controller:t})=>{const[i,e]=f.useState(m.TriggerEffect.Off),[r,o]=f.useState(Oe[m.TriggerEffect.Off]),[c,u]=f.useState("right"),s=f.useCallback(d=>{(c==="left"||c==="both")&&t.left.trigger.feedback.set(d),(c==="right"||c==="both")&&t.right.trigger.feedback.set(d)},[t,c]),h=f.useCallback(d=>{const p=d.target.value;e(p);const g={...Oe[p]};o(g),s(g)},[s]),l=f.useCallback(d=>{o(d),s(d)},[s]),a=i!==m.TriggerEffect.Off;return n.jsxs(mi,{children:[n.jsxs(bi,{children:[n.jsx(Ir,{children:"Effect"}),n.jsxs(Or,{children:[n.jsxs(Ut,{value:i,onChange:h,style:{flex:"1 1 0",minWidth:0},children:[n.jsx("option",{value:m.TriggerEffect.Off,children:"Off"}),n.jsx("option",{value:m.TriggerEffect.Feedback,children:"Feedback"}),n.jsx("option",{value:m.TriggerEffect.Weapon,children:"Weapon"}),n.jsx("option",{value:m.TriggerEffect.Bow,children:"Bow"}),n.jsx("option",{value:m.TriggerEffect.Galloping,children:"Galloping"}),n.jsx("option",{value:m.TriggerEffect.Vibration,children:"Vibration"}),n.jsx("option",{value:m.TriggerEffect.Machine,children:"Machine"})]}),a&&n.jsx(Mt,{$intent:"warning",$minimal:!0,style:{flexShrink:0},children:"Active"})]}),n.jsx(Or,{children:["left","right","both"].map(d=>n.jsx(ji,{$active:c===d,onClick:()=>u(d),children:d.charAt(0).toUpperCase()+d.slice(1)},d))}),a&&n.jsx(jn,{$small:!0,onClick:()=>{t.resetTriggerFeedback(),e(m.TriggerEffect.Off),o(Oe[m.TriggerEffect.Off])},style:{width:"100%"},children:"Reset"})]}),a&&n.jsxs(wi,{children:[n.jsx(Ir,{style:{width:"100%"},children:"Parameters"}),n.jsx(Ci,{config:r,onChange:l})]})]})},ki=y.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`,Ri=y.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  flex-wrap: wrap;
`,pt=y.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 140px;
`,zi=y.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 200px;
`,Q=y.div`
  display: flex;
  align-items: center;
  gap: 10px;
`,W=y.span`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.35;
`,Z=y.button`
  background: ${t=>t.$active?"rgba(72, 175, 240, 0.2)":"rgba(72, 175, 240, 0.04)"};
  border: 1px solid
    ${t=>t.$active?"rgba(72, 175, 240, 0.5)":"rgba(72, 175, 240, 0.15)"};
  border-radius: 3px;
  color: ${t=>t.$active?"#48aff0":"rgba(72, 175, 240, 0.5)"};
  font-size: 11px;
  padding: 3px 10px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: rgba(72, 175, 240, 0.15);
    color: #48aff0;
  }
`,Be=y.button`
  background: ${t=>t.$muted?"rgba(242, 158, 2, 0.2)":"rgba(72, 175, 240, 0.04)"};
  border: 1px solid
    ${t=>t.$muted?"rgba(242, 158, 2, 0.5)":"rgba(72, 175, 240, 0.15)"};
  border-radius: 3px;
  color: ${t=>t.$muted?"#f29e02":"rgba(72, 175, 240, 0.5)"};
  font-size: 11px;
  padding: 3px 10px;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: ${t=>t.$muted?"rgba(242, 158, 2, 0.3)":"rgba(72, 175, 240, 0.15)"};
  }
`,ft=180,xt=28,Fe="#48aff0",qt=({label:t,value:i,onChange:e,min:r=0,max:o=1,step:c=.05,formatValue:u})=>{const s=f.useRef(null),h=f.useRef(!1),l=f.useCallback(x=>{const v=s.current;if(!v)return;const w=v.getBoundingClientRect(),E=x.clientX-w.left,R=Math.max(0,Math.min(1,E/w.width)),P=r+R*(o-r),j=Math.round(P/c)*c;e(Math.max(r,Math.min(o,j)))},[e,r,o,c]),a=f.useCallback(x=>{h.current=!0,l(x);const v=E=>{h.current&&l(E)},w=()=>{h.current=!1,window.removeEventListener("mousemove",v),window.removeEventListener("mouseup",w)};window.addEventListener("mousemove",v),window.addEventListener("mouseup",w)},[l]),d=(i-r)/(o-r),p=d*ft,g=u?u(i):Math.round(i*100)+"%";return n.jsxs("svg",{ref:s,width:ft,height:xt,style:{cursor:"ew-resize",borderRadius:3,flex:"1 1 "+ft+"px",maxWidth:280},onMouseDown:a,children:[n.jsx("rect",{x:0,y:0,width:ft,height:xt,fill:"rgba(72, 175, 240, 0.08)",rx:3}),n.jsx("rect",{x:.5,y:.5,width:ft-1,height:xt-1,fill:"none",stroke:"rgba(72, 175, 240, 0.2)",strokeWidth:1,rx:3}),p>0&&n.jsx("rect",{x:1,y:1,width:Math.min(p,ft-2),height:xt-2,fill:Fe,opacity:.15+d*.25,rx:2}),d>0&&n.jsx("line",{x1:p,y1:1,x2:p,y2:xt-1,stroke:Fe,strokeWidth:1.5,opacity:.6}),n.jsx("text",{x:7,y:xt/2,dominantBaseline:"central",fill:"currentColor",fontSize:11,fontWeight:600,opacity:.5,children:t}),n.jsx("text",{x:ft-7,y:xt/2,dominantBaseline:"central",textAnchor:"end",fill:Fe,fontSize:11,fontWeight:600,opacity:.7,children:g})]})},Mi=y.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 4px;
`,Ti=y.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.3);
  font-size: 10px;
  cursor: pointer;
  padding: 0;
  text-align: left;
  &:hover {
    color: rgba(255, 255, 255, 0.5);
  }
`,zt=y.input`
  width: 36px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(72, 175, 240, 0.2);
  border-radius: 3px;
  color: #48aff0;
  font-size: 11px;
  font-family: monospace;
  padding: 3px 4px;
  text-align: center;

  &:focus {
    outline: none;
    border-color: rgba(72, 175, 240, 0.5);
  }
`,Pi=y.span`
  font-size: 9px;
  font-family: monospace;
  opacity: 0.35;
  text-align: center;
`,$i=y.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`,_i=y.pre`
  font-size: 11px;
  font-family: monospace;
  color: rgba(72, 175, 240, 0.7);
  background: rgba(0, 0, 0, 0.3);
  padding: 6px 8px;
  border-radius: 3px;
  margin: 0;
  overflow-x: auto;
  white-space: pre;
  max-height: 80px;
`,Ai=({controller:t})=>{const[i,e]=f.useState(t.audio.speakerVolume),[r,o]=f.useState(t.audio.headphoneVolume),[c,u]=f.useState(t.audio.microphoneVolume),[s,h]=f.useState(t.audio.output),[l,a]=f.useState(t.audio.preampGain),[d,p]=f.useState(t.audio.beamForming),[g,x]=f.useState(t.audio.speakerMuted),[v,w]=f.useState(t.audio.headphoneMuted),[E,R]=f.useState(t.audio.microphoneMuted),P=f.useCallback(b=>{e(b),t.audio.setSpeakerVolume(b)},[t]),j=f.useCallback(b=>{o(b),t.audio.setHeadphoneVolume(b)},[t]),yt=f.useCallback(b=>{u(b),t.audio.setMicrophoneVolume(b)},[t]),A=f.useCallback(b=>{const k=Number(b.target.value);h(k),t.audio.setOutput(k)},[t]),G=f.useCallback(b=>{const k=Math.round(b);a(k),t.audio.setPreamp(k,d)},[t,d]),rt=f.useCallback(()=>{const b=!d;p(b),t.audio.setPreamp(l,b)},[t,l,d]),be=f.useCallback(b=>{const k=b.target.value;k&&t.audio.setMicSelect(Number(k))},[t]),$=f.useCallback(b=>{t.audio.setMicMode(Number(b.target.value))},[t]),[I,T]=f.useState("speaker"),[_,B]=f.useState(!1),[$t,_t]=f.useState(null),we=f.useCallback(async b=>{_t(null);try{_===b?(await t.stopTestTone(),B(!1)):(_&&await t.stopTestTone(),await t.startTestTone(I,b),B(b))}catch(k){_t(k instanceof Error?k.message:"Failed to control tone"),B(!1)}},[t,_,I]),[je,ln]=f.useState(!1),[nt,un]=f.useState(6),[st,dn]=f.useState(2),[At,pn]=f.useState(Array(20).fill(0)),[V,fn]=f.useState(3),[Ve,X]=f.useState(""),[Ne,Ue]=f.useState(!1),xn=(b,k)=>{pn(F=>{const Y=[...F];return Y[b]=k&255,Y})},Se=b=>{const k=b.trim();return k.startsWith("0x")||k.startsWith("0X")?parseInt(k,16)&255:(parseInt(k,10)||0)&255},gn=async()=>{Ue(!0),X("");try{const b=new Uint8Array(At.slice(0,V));await t.hid.sendTestCommand(nt,st,b);const k=await t.hid.readTestResponse();if(k){const F=Array.from(k.slice(0,64)).map(Y=>Y.toString(16).padStart(2,"0")).join(" ");X(F)}else X("(no response)")}catch(b){X(`Error: ${b instanceof Error?b.message:String(b)}`)}Ue(!1)},[Lt,vn]=f.useState(1),[Ce,Xe]=f.useState(!1),[yn,Ye]=f.useState(0),mt=f.useRef(null),Ee=f.useCallback(()=>{mt.current&&(clearInterval(mt.current),mt.current=null),Xe(!1);const b=new Uint8Array(V);b[1]=1,t.hid.sendTestCommand(nt,st,b).catch(()=>{})},[t,nt,st,V]),mn=f.useCallback(()=>{let b=0;Xe(!0),Ye(0),X(""),mt.current=setInterval(async()=>{const k=new Uint8Array(V);if(k[1]=1,await t.hid.sendTestCommand(nt,st,k),b>255){Ee(),X("Sweep complete (0–255)");return}const F=new Uint8Array(V);F[0]=1;for(let Y=1;Y<V;Y++)F[Y]=At[Y];F[Lt]=b,Ye(b),X(`Sweeping byte[${Lt}] = ${b} (0x${b.toString(16).padStart(2,"0")})`),await t.hid.sendTestCommand(nt,st,F),b++},250)},[t,nt,st,At,V,Lt,Ee]);return f.useEffect(()=>()=>{mt.current&&clearInterval(mt.current)},[]),n.jsxs(ki,{children:[n.jsxs(Ri,{children:[n.jsxs(pt,{children:[n.jsx(W,{children:"Output"}),n.jsxs(Ut,{value:s,onChange:A,style:{minWidth:0},children:[n.jsx("option",{value:m.AudioOutput.Headphone,children:"Headphone"}),n.jsx("option",{value:m.AudioOutput.HeadphoneMono,children:"Headphone (Mono)"}),n.jsx("option",{value:m.AudioOutput.Split,children:"Split (L→HP, R→Spk)"}),n.jsx("option",{value:m.AudioOutput.Speaker,children:"Speaker"})]}),n.jsxs(Q,{children:[n.jsx(Be,{$muted:g,onClick:()=>{t.audio.muteSpeaker(!g),x(!g)},children:g?"Spk Muted":"Spk"}),n.jsx(Be,{$muted:v,onClick:()=>{t.audio.muteHeadphone(!v),w(!v)},children:v?"HP Muted":"HP"}),n.jsx(Be,{$muted:E,onClick:()=>{t.audio.muteMicrophone(!E),R(!E)},children:E?"Mic Muted":"Mic"})]})]}),n.jsxs(pt,{children:[n.jsx(W,{children:"Microphone"}),n.jsxs(Q,{children:[n.jsxs(Ut,{onChange:be,style:{minWidth:0},children:[n.jsx("option",{value:"",children:"Auto"}),n.jsx("option",{value:String(m.MicSelect.Internal),children:"Internal"}),n.jsx("option",{value:String(m.MicSelect.Headset),children:"Headset"})]}),n.jsxs(Ut,{onChange:$,style:{minWidth:0},children:[n.jsx("option",{value:String(m.MicMode.Default),children:"Default"}),n.jsx("option",{value:String(m.MicMode.Chat),children:"Chat"}),n.jsx("option",{value:String(m.MicMode.ASR),children:"ASR"})]})]}),n.jsxs(Q,{children:[n.jsx(Z,{$active:d,onClick:rt,children:"Beam Forming"}),d&&n.jsx(Mt,{$minimal:!0,$intent:"primary",children:"On"})]})]}),n.jsxs(pt,{children:[n.jsx(W,{children:"Test Tone"}),n.jsxs(Q,{children:[n.jsx(Z,{$active:I==="speaker",onClick:()=>T("speaker"),children:"Speaker"}),n.jsx(Z,{$active:I==="headphone",onClick:()=>T("headphone"),children:"Headphone"})]}),n.jsxs(Q,{children:[n.jsx(Z,{$active:_==="1khz",onClick:()=>we("1khz"),children:_==="1khz"?"Stop":"1kHz"}),n.jsx(Z,{$active:_==="100hz",onClick:()=>we("100hz"),children:_==="100hz"?"Stop":"~100Hz"}),n.jsx(Z,{$active:_==="both",onClick:()=>we("both"),children:_==="both"?"Stop":"Both"}),$t&&n.jsx(Mt,{$minimal:!0,$intent:"danger",children:$t})]})]}),n.jsxs(zi,{children:[n.jsx(W,{style:{width:"100%"},children:"Volume"}),n.jsx(qt,{label:"Speaker",value:i,onChange:P}),n.jsx(qt,{label:"Headphone",value:r,onChange:j}),n.jsx(qt,{label:"Microphone",value:c,onChange:yt}),n.jsx(qt,{label:"Preamp Gain",value:l,onChange:G,min:0,max:7,step:1,formatValue:b=>String(Math.round(b))})]})]}),n.jsxs(Ti,{onClick:()=>ln(!je),children:[je?"▾":"▸"," DSP Debug"]}),je&&n.jsxs(Mi,{children:[n.jsxs(Q,{children:[n.jsxs(pt,{style:{minWidth:0,gap:4},children:[n.jsx(W,{children:"Device ID"}),n.jsx(zt,{value:nt,onChange:b=>un(Se(b.target.value)),title:"Device ID (decimal or 0x hex)"})]}),n.jsxs(pt,{style:{minWidth:0,gap:4},children:[n.jsx(W,{children:"Action ID"}),n.jsx(zt,{value:st,onChange:b=>dn(Se(b.target.value)),title:"Action ID (decimal or 0x hex)"})]}),n.jsxs(pt,{style:{minWidth:0,gap:4},children:[n.jsx(W,{children:"Param Bytes"}),n.jsx(zt,{value:V,onChange:b=>{const k=Math.max(0,Math.min(20,parseInt(b.target.value)||0));fn(k)},title:"Number of parameter bytes to send (0–20)"})]})]}),n.jsxs(W,{children:["Params (report 0x80 → [",String(nt).padStart(2,"0"),", ",String(st).padStart(2,"0"),", ...])"]}),n.jsx(Q,{style:{flexWrap:"wrap",gap:4},children:Array.from({length:V},(b,k)=>n.jsxs($i,{children:[n.jsxs(Pi,{children:["[",k,"]"]}),n.jsx(zt,{value:At[k],onChange:F=>xn(k,Se(F.target.value)),title:`Param byte ${k} (decimal or 0x hex)`})]},k))}),n.jsxs(Q,{children:[n.jsx(Z,{$active:Ne,onClick:gn,children:Ne?"Sending...":"Send"}),n.jsx(Z,{$active:!1,onClick:async()=>{const b=await t.hid.readTestResponse();if(b){const k=Array.from(b.slice(0,64)).map(F=>F.toString(16).padStart(2,"0")).join(" ");X(k)}else X("(no response)")},children:"Read 0x81"})]}),n.jsx(W,{children:"Sweep (byte[0] locked to 1)"}),n.jsxs(Q,{children:[n.jsxs(pt,{style:{minWidth:0,gap:4},children:[n.jsx(W,{children:"Sweep Byte"}),n.jsx(zt,{value:Lt,onChange:b=>vn(Math.max(1,Math.min(V-1,parseInt(b.target.value)||1))),title:"Which param byte to sweep (1–N)"})]}),n.jsx(Z,{$active:Ce,onClick:Ce?Ee:mn,children:Ce?`Stop (${yn})`:"Sweep 0–255"})]}),Ve&&n.jsxs(n.Fragment,{children:[n.jsx(W,{children:"Response"}),n.jsx(_i,{children:Ve})]})]})]})},Li=y.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
  align-items: stretch;
`,Ht=y.div`
  flex: 1 1 0;
  min-width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`,Vt=y.div`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(191, 204, 214, 0.35);
`,Oi=y.button`
  background: rgba(72, 175, 240, 0.15);
  border: 1px solid rgba(72, 175, 240, 0.25);
  border-radius: 3px;
  color: rgba(72, 175, 240, 0.7);
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1px 6px;
  cursor: pointer;
  &:hover { background: rgba(72, 175, 240, 0.25); color: rgba(72, 175, 240, 0.9); }
`,Ii=({pitch:t,roll:i,size:e})=>{const r=e/2,o=e/2,c=e/2-3,u=Math.max(-c,Math.min(c,t/(Math.PI/2)*c)),s=i*180/Math.PI;return n.jsxs("svg",{width:e,height:e,viewBox:`0 0 ${e} ${e}`,children:[n.jsx("defs",{children:n.jsx("clipPath",{id:"mc-horizon-clip",children:n.jsx("circle",{cx:r,cy:o,r:c})})}),n.jsx("circle",{cx:r,cy:o,r:c,fill:"rgba(0,0,0,0.3)",stroke:"rgba(255,255,255,0.08)",strokeWidth:1}),n.jsxs("g",{clipPath:"url(#mc-horizon-clip)",transform:`rotate(${s}, ${r}, ${o})`,children:[n.jsx("rect",{x:0,y:0,width:e,height:o+u,fill:"rgba(72,175,240,0.12)"}),n.jsx("rect",{x:0,y:o+u,width:e,height:e,fill:"rgba(139,90,43,0.15)"}),n.jsx("line",{x1:0,y1:o+u,x2:e,y2:o+u,stroke:"rgba(255,255,255,0.3)",strokeWidth:1.5})]}),n.jsx("line",{x1:r-14,y1:o,x2:r-4,y2:o,stroke:"#f29e02",strokeWidth:2,strokeLinecap:"round"}),n.jsx("line",{x1:r+4,y1:o,x2:r+14,y2:o,stroke:"#f29e02",strokeWidth:2,strokeLinecap:"round"}),n.jsx("circle",{cx:r,cy:o,r:1.5,fill:"#f29e02"}),n.jsx("circle",{cx:r,cy:o,r:c,fill:"none",stroke:"rgba(255,255,255,0.12)",strokeWidth:1.5})]})},Bi=({pitch:t,roll:i,size:e})=>{const r=e/2,o=e/2,c=e/2-3,u=c*.7,s=r+Math.max(-u,Math.min(u,-(i/(Math.PI/4))*u)),h=o+Math.max(-u,Math.min(u,t/(Math.PI/4)*u)),l=Math.sqrt((s-r)**2+(h-o)**2)/u,a=l<.15?"rgba(72,175,240,0.8)":`rgba(242,158,2,${.4+l*.5})`;return n.jsxs("svg",{width:e,height:e,viewBox:`0 0 ${e} ${e}`,children:[n.jsx("circle",{cx:r,cy:o,r:c,fill:"rgba(0,0,0,0.3)",stroke:"rgba(255,255,255,0.08)",strokeWidth:1}),n.jsx("line",{x1:r,y1:o-c*.4,x2:r,y2:o+c*.4,stroke:"rgba(255,255,255,0.06)",strokeWidth:.5}),n.jsx("line",{x1:r-c*.4,y1:o,x2:r+c*.4,y2:o,stroke:"rgba(255,255,255,0.06)",strokeWidth:.5}),n.jsx("circle",{cx:r,cy:o,r:c*.15,fill:"none",stroke:"rgba(255,255,255,0.08)",strokeWidth:.5}),n.jsx("circle",{cx:s,cy:h,r:6,fill:a}),n.jsx("circle",{cx:s,cy:h,r:6,fill:"none",stroke:"rgba(255,255,255,0.2)",strokeWidth:.5}),n.jsx("circle",{cx:r,cy:o,r:c,fill:"none",stroke:"rgba(255,255,255,0.12)",strokeWidth:1.5})]})},Fi=y.div`
  width: 100%;
  max-width: 120px;
  height: 8px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
`,Di=y.div`
  height: 100%;
  width: ${t=>t.$pct}%;
  background: ${t=>t.$active?"linear-gradient(90deg, #f29e02, #f25c02)":"rgba(191,204,214,0.15)"};
  border-radius: 4px;
  transition: width 0.05s, background 0.15s;
`,Gi=Fr`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-1px) rotate(-0.5deg); }
  75% { transform: translateX(1px) rotate(0.5deg); }
`,Wi=y.div`
  font-size: 18px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${t=>t.$active?"#f29e02":"rgba(191,204,214,0.15)"};
  transition: color 0.15s;
  ${t=>t.$active&&wn`animation: ${Gi} ${1/Math.max(1,t.$freq)}s ease-in-out infinite;`}
`,qi=y.span`
  font-size: 10px;
  font-weight: 400;
  margin-left: 3px;
  color: rgba(191,204,214,0.35);
`,Nt=8,Hi=({peakRef:t})=>{const e=S.useContext(z).shake,r=e.spectrum.filter(x=>x.freq<=Nt);let o=0;for(const x of r)x.power>o&&(o=x.power);o>t.current?t.current=o:t.current*=.995,t.current<1&&(t.current=1);const c=t.current,u=200,s=60,h=4,l=4,a=2,d=12,p=u-h-l,g=s-a-d;return n.jsxs("svg",{width:"100%",height:s,viewBox:`0 0 ${u} ${s}`,preserveAspectRatio:"xMidYMid meet",style:{maxWidth:200},children:[[0,2,4,6,8].map(x=>n.jsx("text",{x:h+x/Nt*p,y:s-1,fill:"rgba(191,204,214,0.25)",fontSize:7,textAnchor:"middle",fontFamily:"monospace",children:x},x)),r.map(x=>{const v=Math.max(1,p/(Nt/.25)-.5),w=h+x.freq/Nt*p-v/2,E=Math.min(g,x.power/c*g),R=e.fundamental>0&&Math.abs(x.freq-e.fundamental)<.13;return n.jsx("rect",{x:w,y:a+g-E,width:v,height:E,fill:R?"#f29e02":"rgba(72,175,240,0.35)",rx:.5},x.freq)})]})},Vi=()=>{const t=S.useContext(z),[,i]=S.useState(0),e=S.useRef(0),r=S.useRef(1);S.useEffect(()=>{const h=()=>{i(l=>l+1),e.current=requestAnimationFrame(h)};return e.current=requestAnimationFrame(h),()=>cancelAnimationFrame(e.current)},[t]);const o=S.useCallback(()=>{t.orientation.reset()},[t]),c=t.orientation,u=t.shake,s=90;return n.jsxs(Li,{children:[n.jsxs(Ht,{children:[n.jsx(Ii,{pitch:c.pitch,roll:c.roll,size:s}),n.jsxs("div",{style:{display:"flex",gap:6,alignItems:"center"},children:[n.jsx(Vt,{children:"Orientation"}),n.jsx(Oi,{onClick:o,children:"Reset"})]})]}),n.jsxs(Ht,{children:[n.jsx(Bi,{pitch:c.tiltPitch,roll:c.tiltRoll,size:s}),n.jsx(Vt,{children:"Tilt"})]}),n.jsxs(Ht,{children:[n.jsxs(Wi,{$active:u.active,$freq:u.frequency,children:[u.active?u.frequency.toFixed(1):"0.0",n.jsx(qi,{children:"Hz"})]}),n.jsx(Fi,{children:n.jsx(Di,{$pct:Math.min(100,u.frequency/10*100),$active:u.active})}),n.jsx(Vt,{children:u.active?"Shaking":"Still"})]}),n.jsxs(Ht,{style:{minWidth:180},children:[n.jsx(Hi,{peakRef:r}),n.jsx(Vt,{children:"Spectrum (fundamental Hz)"})]})]})},Br=y.pre`
  overflow: auto;
  word-break: normal !important;
  word-wrap: normal !important;
  white-space: pre !important;
  max-height: 200px;
  font-size: 11px;
`,po=({panel:t})=>{const i=f.useContext(z),[e,r]=f.useState(i.hid.state),[o,c]=f.useState(!1),[u,s]=f.useState(!1),[h,l]=f.useState(i.firmwareInfo),[a,d]=f.useState(i.factoryInfo);f.useEffect(()=>{i.on("change",x=>{r(x.hid.state),!h&&x.firmwareInfo&&l(x.firmwareInfo),!a&&x.factoryInfo&&d(x.factoryInfo)})},[]);let p="",g="";if(i.hid.provider.buffer){const x=i.hid.provider.buffer;p=`const report = Buffer.from([${new Uint8Array(x.buffer).join(", ")}])`,g=`${x.byteLength} bytes`}else p="Waiting for report...",g="unknown";return t==="triggers"?n.jsx(Ei,{controller:i}):t==="audio"?n.jsx(Ai,{controller:i}):t==="motion"?n.jsx(Vi,{}):n.jsxs(n.Fragment,{children:[h&&n.jsxs(Ot,{children:[n.jsxs("p",{style:{fontSize:12,opacity:.7,margin:0},children:["Firmware: v",m.formatFirmwareVersion(h.mainFirmwareVersion)," · ","HW: ",h.hardwareInfo," · ","DSP: ",h.dspFirmwareVersion," · ","SBL: v",m.formatFirmwareVersion(h.sblFirmwareVersion)," · ","Built: ",h.buildDate," ",h.buildTime]}),a&&n.jsxs("p",{style:{fontSize:12,opacity:.7,margin:"4px 0 0"},children:["Color: ",a.colorName??a.colorCode," · ",a.boardRevision??"Unknown board"," · ","Serial: ",a.serialNumber]})]}),n.jsxs(Ot,{children:[n.jsx(Ke,{label:"Input State",checked:u,onChange:x=>s(x)}),n.jsx(Ke,{label:"Report Buffer",checked:o,onChange:x=>c(x)})]}),o&&n.jsxs(Ot,{children:[n.jsxs("p",{style:{fontSize:12,opacity:.7},children:["Buffer: ",g]}),n.jsx(Br,{children:p})]}),u&&n.jsx(Ot,{children:n.jsx(Br,{children:Object.entries(e).map(([x,v])=>`${x}: ${JSON.stringify(v)}`).join(`
`)})})]})};y.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
`;y.input`
  width: 40px;
  height: 28px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  cursor: pointer;
  background: transparent;
  &::-webkit-color-swatch-wrapper {
    padding: 2px;
  }
`;y.span`
  font-size: 12px;
  opacity: 0.7;
  font-family: monospace;
`;y.span`
  min-width: 50px;
  font-size: 12px;
  opacity: 0.7;
`;y.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
`;y.span`
  min-width: 50px;
  font-size: 12px;
  opacity: 0.7;
`;export{lo as B,oo as C,Yi as D,Xi as F,to as G,Ji as L,ho as M,ao as O,co as P,Qi as R,Ki as S,Zi as T,uo as a,so as b,po as c,eo as d,no as e,ro as f,io as g};
