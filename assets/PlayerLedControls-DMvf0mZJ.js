import{b as gn,R as f,a as j,g as y,C as T,j as s,d as m,E as vn}from"./index-GGWi0Ont.js";import{T as Mt,S as Wt,B as yn,C as Ot,b as Ue}from"./CodeBlock-Dvv7tnEL.js";var qt={exports:{}},Nt={exports:{}};/*!
 * Zdog v1.1.3
 * Round, flat, designer-friendly pseudo-3D engine
 * Licensed MIT
 * https://zzz.dog
 * Copyright 2020 Metafizzy
 */var mn=Nt.exports,Xe;function U(){return Xe||(Xe=1,(function(t){(function(i,e){t.exports?t.exports=e():i.Zdog=e()})(mn,function(){var e={};e.TAU=Math.PI*2,e.extend=function(o,c){for(var l in c)o[l]=c[l];return o},e.lerp=function(o,c,l){return(c-o)*l+o},e.modulo=function(o,c){return(o%c+c)%c};var r={2:function(o){return o*o},3:function(o){return o*o*o},4:function(o){return o*o*o*o},5:function(o){return o*o*o*o*o}};return e.easeInOut=function(o,c){if(c==1)return o;o=Math.max(0,Math.min(1,o));var l=o<.5,n=l?o:1-o;n/=.5;var u=r[c]||r[2],h=u(n);return h/=2,l?h:1-h},e})})(Nt)),Nt.exports}var Ut={exports:{}},bn=Ut.exports,Ye;function Or(){return Ye||(Ye=1,(function(t){(function(i,e){t.exports?t.exports=e():i.Zdog.CanvasRenderer=e()})(bn,function(){var e={isCanvas:!0};return e.begin=function(r){r.beginPath()},e.move=function(r,o,c){r.moveTo(c.x,c.y)},e.line=function(r,o,c){r.lineTo(c.x,c.y)},e.bezier=function(r,o,c,l,n){r.bezierCurveTo(c.x,c.y,l.x,l.y,n.x,n.y)},e.closePath=function(r){r.closePath()},e.setPath=function(){},e.renderPath=function(r,o,c,l){this.begin(r,o),c.forEach(function(n){n.render(r,o,e)}),l&&this.closePath(r,o)},e.stroke=function(r,o,c,l,n){c&&(r.strokeStyle=l,r.lineWidth=n,r.stroke())},e.fill=function(r,o,c,l){c&&(r.fillStyle=l,r.fill())},e.end=function(){},e})})(Ut)),Ut.exports}var Xt={exports:{}},wn=Xt.exports,Ke;function Ir(){return Ke||(Ke=1,(function(t){(function(i,e){t.exports?t.exports=e():i.Zdog.SvgRenderer=e()})(wn,function(){var e={isSvg:!0},r=e.round=function(c){return Math.round(c*1e3)/1e3};function o(c){return r(c.x)+","+r(c.y)+" "}return e.begin=function(){},e.move=function(c,l,n){return"M"+o(n)},e.line=function(c,l,n){return"L"+o(n)},e.bezier=function(c,l,n,u,h){return"C"+o(n)+o(u)+o(h)},e.closePath=function(){return"Z"},e.setPath=function(c,l,n){l.setAttribute("d",n)},e.renderPath=function(c,l,n,u){var h="";n.forEach(function(a){h+=a.render(c,l,e)}),u&&(h+=this.closePath(c,l)),this.setPath(c,l,h)},e.stroke=function(c,l,n,u,h){n&&(l.setAttribute("stroke",u),l.setAttribute("stroke-width",h))},e.fill=function(c,l,n,u){var h=n?u:"none";l.setAttribute("fill",h)},e.end=function(c,l){c.appendChild(l)},e})})(Xt)),Xt.exports}var Yt={exports:{}},Sn=Yt.exports,Je;function Ct(){return Je||(Je=1,(function(t){(function(i,e){if(t.exports)t.exports=e(U());else{var r=i.Zdog;r.Vector=e(r)}})(Sn,function(e){function r(n){this.set(n)}var o=e.TAU;r.prototype.set=function(n){return this.x=n&&n.x||0,this.y=n&&n.y||0,this.z=n&&n.z||0,this},r.prototype.write=function(n){return n?(this.x=n.x!=null?n.x:this.x,this.y=n.y!=null?n.y:this.y,this.z=n.z!=null?n.z:this.z,this):this},r.prototype.rotate=function(n){if(n)return this.rotateZ(n.z),this.rotateY(n.y),this.rotateX(n.x),this},r.prototype.rotateZ=function(n){c(this,n,"x","y")},r.prototype.rotateX=function(n){c(this,n,"y","z")},r.prototype.rotateY=function(n){c(this,n,"x","z")};function c(n,u,h,a){if(!(!u||u%o===0)){var d=Math.cos(u),p=Math.sin(u),g=n[h],x=n[a];n[h]=g*d-x*p,n[a]=x*d+g*p}}r.prototype.isSame=function(n){return n?this.x===n.x&&this.y===n.y&&this.z===n.z:!1},r.prototype.add=function(n){return n?(this.x+=n.x||0,this.y+=n.y||0,this.z+=n.z||0,this):this},r.prototype.subtract=function(n){return n?(this.x-=n.x||0,this.y-=n.y||0,this.z-=n.z||0,this):this},r.prototype.multiply=function(n){return n==null?this:(typeof n=="number"?(this.x*=n,this.y*=n,this.z*=n):(this.x*=n.x!=null?n.x:1,this.y*=n.y!=null?n.y:1,this.z*=n.z!=null?n.z:1),this)},r.prototype.transform=function(n,u,h){return this.multiply(h),this.rotate(u),this.add(n),this},r.prototype.lerp=function(n,u){return this.x=e.lerp(this.x,n.x||0,u),this.y=e.lerp(this.y,n.y||0,u),this.z=e.lerp(this.z,n.z||0,u),this},r.prototype.magnitude=function(){var n=this.x*this.x+this.y*this.y+this.z*this.z;return l(n)};function l(n){return Math.abs(n-1)<1e-8?1:Math.sqrt(n)}return r.prototype.magnitude2d=function(){var n=this.x*this.x+this.y*this.y;return l(n)},r.prototype.copy=function(){return new r(this)},r})})(Yt)),Yt.exports}var Kt={exports:{}},jn=Kt.exports,Qe;function gt(){return Qe||(Qe=1,(function(t){(function(i,e){if(t.exports)t.exports=e(U(),Ct(),Or(),Ir());else{var r=i.Zdog;r.Anchor=e(r,r.Vector,r.CanvasRenderer,r.SvgRenderer)}})(jn,function(e,r,o,c){var l=e.TAU,n={x:1,y:1,z:1};function u(a){this.create(a||{})}u.prototype.create=function(a){this.children=[],e.extend(this,this.constructor.defaults),this.setOptions(a),this.translate=new r(a.translate),this.rotate=new r(a.rotate),this.scale=new r(n).multiply(this.scale),this.origin=new r,this.renderOrigin=new r,this.addTo&&this.addTo.addChild(this)},u.defaults={},u.optionKeys=Object.keys(u.defaults).concat(["rotate","translate","scale","addTo"]),u.prototype.setOptions=function(a){var d=this.constructor.optionKeys;for(var p in a)d.indexOf(p)!=-1&&(this[p]=a[p])},u.prototype.addChild=function(a){this.children.indexOf(a)==-1&&(a.remove(),a.addTo=this,this.children.push(a))},u.prototype.removeChild=function(a){var d=this.children.indexOf(a);d!=-1&&this.children.splice(d,1)},u.prototype.remove=function(){this.addTo&&this.addTo.removeChild(this)},u.prototype.update=function(){this.reset(),this.children.forEach(function(a){a.update()}),this.transform(this.translate,this.rotate,this.scale)},u.prototype.reset=function(){this.renderOrigin.set(this.origin)},u.prototype.transform=function(a,d,p){this.renderOrigin.transform(a,d,p),this.children.forEach(function(g){g.transform(a,d,p)})},u.prototype.updateGraph=function(){this.update(),this.updateFlatGraph(),this.flatGraph.forEach(function(a){a.updateSortValue()}),this.flatGraph.sort(u.shapeSorter)},u.shapeSorter=function(a,d){return a.sortValue-d.sortValue},Object.defineProperty(u.prototype,"flatGraph",{get:function(){return this._flatGraph||this.updateFlatGraph(),this._flatGraph},set:function(a){this._flatGraph=a}}),u.prototype.updateFlatGraph=function(){this.flatGraph=this.getFlatGraph()},u.prototype.getFlatGraph=function(){var a=[this];return this.addChildFlatGraph(a)},u.prototype.addChildFlatGraph=function(a){return this.children.forEach(function(d){var p=d.getFlatGraph();Array.prototype.push.apply(a,p)}),a},u.prototype.updateSortValue=function(){this.sortValue=this.renderOrigin.z},u.prototype.render=function(){},u.prototype.renderGraphCanvas=function(a){if(!a)throw new Error("ctx is "+a+". Canvas context required for render. Check .renderGraphCanvas( ctx ).");this.flatGraph.forEach(function(d){d.render(a,o)})},u.prototype.renderGraphSvg=function(a){if(!a)throw new Error("svg is "+a+". SVG required for render. Check .renderGraphSvg( svg ).");this.flatGraph.forEach(function(d){d.render(a,c)})},u.prototype.copy=function(a){var d={},p=this.constructor.optionKeys;p.forEach(function(x){d[x]=this[x]},this),e.extend(d,a);var g=this.constructor;return new g(d)},u.prototype.copyGraph=function(a){var d=this.copy(a);return this.children.forEach(function(p){p.copyGraph({addTo:d})}),d},u.prototype.normalizeRotate=function(){this.rotate.x=e.modulo(this.rotate.x,l),this.rotate.y=e.modulo(this.rotate.y,l),this.rotate.z=e.modulo(this.rotate.z,l)};function h(a){return function(d){function p(g){this.create(g||{})}return p.prototype=Object.create(a.prototype),p.prototype.constructor=p,p.defaults=e.extend({},a.defaults),e.extend(p.defaults,d),p.optionKeys=a.optionKeys.slice(0),Object.keys(p.defaults).forEach(function(g){!p.optionKeys.indexOf(g)!=1&&p.optionKeys.push(g)}),p.subclass=h(p),p}}return u.subclass=h(u),u})})(Kt)),Kt.exports}var Jt={exports:{}},Cn=Jt.exports,Ze;function Br(){return Ze||(Ze=1,(function(t){(function(i,e){t.exports?t.exports=e():i.Zdog.Dragger=e()})(Cn,function(){var e=typeof window<"u",r="mousedown",o="mousemove",c="mouseup";e&&(window.PointerEvent?(r="pointerdown",o="pointermove",c="pointerup"):"ontouchstart"in window&&(r="touchstart",o="touchmove",c="touchend"));function l(){}function n(u){this.create(u||{})}return n.prototype.create=function(u){this.onDragStart=u.onDragStart||l,this.onDragMove=u.onDragMove||l,this.onDragEnd=u.onDragEnd||l,this.bindDrag(u.startElement)},n.prototype.bindDrag=function(u){u=this.getQueryElement(u),u&&(u.style.touchAction="none",u.addEventListener(r,this))},n.prototype.getQueryElement=function(u){return typeof u=="string"&&(u=document.querySelector(u)),u},n.prototype.handleEvent=function(u){var h=this["on"+u.type];h&&h.call(this,u)},n.prototype.onmousedown=n.prototype.onpointerdown=function(u){this.dragStart(u,u)},n.prototype.ontouchstart=function(u){this.dragStart(u,u.changedTouches[0])},n.prototype.dragStart=function(u,h){u.preventDefault(),this.dragStartX=h.pageX,this.dragStartY=h.pageY,e&&(window.addEventListener(o,this),window.addEventListener(c,this)),this.onDragStart(h)},n.prototype.ontouchmove=function(u){this.dragMove(u,u.changedTouches[0])},n.prototype.onmousemove=n.prototype.onpointermove=function(u){this.dragMove(u,u)},n.prototype.dragMove=function(u,h){u.preventDefault();var a=h.pageX-this.dragStartX,d=h.pageY-this.dragStartY;this.onDragMove(h,a,d)},n.prototype.onmouseup=n.prototype.onpointerup=n.prototype.ontouchend=n.prototype.dragEnd=function(){window.removeEventListener(o,this),window.removeEventListener(c,this),this.onDragEnd()},n})})(Jt)),Jt.exports}var Qt={exports:{}},En=Qt.exports,tr;function kn(){return tr||(tr=1,(function(t){(function(i,e){if(t.exports)t.exports=e(U(),gt(),Br());else{var r=i.Zdog;r.Illustration=e(r,r.Anchor,r.Dragger)}})(En,function(e,r,o){function c(){}var l=e.TAU,n=r.subclass({element:void 0,centered:!0,zoom:1,dragRotate:!1,resize:!1,onPrerender:c,onDragStart:c,onDragMove:c,onDragEnd:c,onResize:c});e.extend(n.prototype,o.prototype),n.prototype.create=function(h){r.prototype.create.call(this,h),o.prototype.create.call(this,h),this.setElement(this.element),this.setDragRotate(this.dragRotate),this.setResize(this.resize)},n.prototype.setElement=function(h){if(h=this.getQueryElement(h),!h)throw new Error("Zdog.Illustration element required. Set to "+h);var a=h.nodeName.toLowerCase();a=="canvas"?this.setCanvas(h):a=="svg"&&this.setSvg(h)},n.prototype.setSize=function(h,a){h=Math.round(h),a=Math.round(a),this.isCanvas?this.setSizeCanvas(h,a):this.isSvg&&this.setSizeSvg(h,a)},n.prototype.setResize=function(h){this.resize=h,this.resizeListener||(this.resizeListener=this.onWindowResize.bind(this)),h?(window.addEventListener("resize",this.resizeListener),this.onWindowResize()):window.removeEventListener("resize",this.resizeListener)},n.prototype.onWindowResize=function(){this.setMeasuredSize(),this.onResize(this.width,this.height)},n.prototype.setMeasuredSize=function(){var h,a,d=this.resize=="fullscreen";if(d)h=window.innerWidth,a=window.innerHeight;else{var p=this.element.getBoundingClientRect();h=p.width,a=p.height}this.setSize(h,a)},n.prototype.renderGraph=function(h){this.isCanvas?this.renderGraphCanvas(h):this.isSvg&&this.renderGraphSvg(h)},n.prototype.updateRenderGraph=function(h){this.updateGraph(),this.renderGraph(h)},n.prototype.setCanvas=function(h){this.element=h,this.isCanvas=!0,this.ctx=this.element.getContext("2d"),this.setSizeCanvas(h.width,h.height)},n.prototype.setSizeCanvas=function(h,a){this.width=h,this.height=a;var d=this.pixelRatio=window.devicePixelRatio||1;this.element.width=this.canvasWidth=h*d,this.element.height=this.canvasHeight=a*d;var p=d>1&&!this.resize;p&&(this.element.style.width=h+"px",this.element.style.height=a+"px")},n.prototype.renderGraphCanvas=function(h){h=h||this,this.prerenderCanvas(),r.prototype.renderGraphCanvas.call(h,this.ctx),this.postrenderCanvas()},n.prototype.prerenderCanvas=function(){var h=this.ctx;if(h.lineCap="round",h.lineJoin="round",h.clearRect(0,0,this.canvasWidth,this.canvasHeight),h.save(),this.centered){var a=this.width/2*this.pixelRatio,d=this.height/2*this.pixelRatio;h.translate(a,d)}var p=this.pixelRatio*this.zoom;h.scale(p,p),this.onPrerender(h)},n.prototype.postrenderCanvas=function(){this.ctx.restore()},n.prototype.setSvg=function(h){this.element=h,this.isSvg=!0,this.pixelRatio=1;var a=h.getAttribute("width"),d=h.getAttribute("height");this.setSizeSvg(a,d)},n.prototype.setSizeSvg=function(h,a){this.width=h,this.height=a;var d=h/this.zoom,p=a/this.zoom,g=this.centered?-d/2:0,x=this.centered?-p/2:0;this.element.setAttribute("viewBox",g+" "+x+" "+d+" "+p),this.resize?(this.element.removeAttribute("width"),this.element.removeAttribute("height")):(this.element.setAttribute("width",h),this.element.setAttribute("height",a))},n.prototype.renderGraphSvg=function(h){h=h||this,u(this.element),this.onPrerender(this.element),r.prototype.renderGraphSvg.call(h,this.element)};function u(h){for(;h.firstChild;)h.removeChild(h.firstChild)}return n.prototype.setDragRotate=function(h){if(h)h===!0&&(h=this);else return;this.dragRotate=h,this.bindDrag(this.element)},n.prototype.dragStart=function(){this.dragStartRX=this.dragRotate.rotate.x,this.dragStartRY=this.dragRotate.rotate.y,o.prototype.dragStart.apply(this,arguments)},n.prototype.dragMove=function(h,a){var d=a.pageX-this.dragStartX,p=a.pageY-this.dragStartY,g=Math.min(this.width,this.height),x=d/g*l,v=p/g*l;this.dragRotate.rotate.x=this.dragStartRX-v,this.dragRotate.rotate.y=this.dragStartRY-x,o.prototype.dragMove.apply(this,arguments)},n})})(Qt)),Qt.exports}var Zt={exports:{}},zn=Zt.exports,er;function pe(){return er||(er=1,(function(t){(function(i,e){if(t.exports)t.exports=e(Ct());else{var r=i.Zdog;r.PathCommand=e(r.Vector)}})(zn,function(e){function r(n,u,h){this.method=n,this.points=u.map(o),this.renderPoints=u.map(c),this.previousPoint=h,this.endRenderPoint=this.renderPoints[this.renderPoints.length-1],n=="arc"&&(this.controlPoints=[new e,new e])}function o(n){return n instanceof e?n:new e(n)}function c(n){return new e(n)}r.prototype.reset=function(){var n=this.points;this.renderPoints.forEach(function(u,h){var a=n[h];u.set(a)})},r.prototype.transform=function(n,u,h){this.renderPoints.forEach(function(a){a.transform(n,u,h)})},r.prototype.render=function(n,u,h){return this[this.method](n,u,h)},r.prototype.move=function(n,u,h){return h.move(n,u,this.renderPoints[0])},r.prototype.line=function(n,u,h){return h.line(n,u,this.renderPoints[0])},r.prototype.bezier=function(n,u,h){var a=this.renderPoints[0],d=this.renderPoints[1],p=this.renderPoints[2];return h.bezier(n,u,a,d,p)};var l=9/16;return r.prototype.arc=function(n,u,h){var a=this.previousPoint,d=this.renderPoints[0],p=this.renderPoints[1],g=this.controlPoints[0],x=this.controlPoints[1];return g.set(a).lerp(d,l),x.set(p).lerp(d,l),h.bezier(n,u,g,x,p)},r})})(Zt)),Zt.exports}var te={exports:{}},Rn=te.exports,rr;function vt(){return rr||(rr=1,(function(t){(function(i,e){if(t.exports)t.exports=e(U(),Ct(),pe(),gt());else{var r=i.Zdog;r.Shape=e(r,r.Vector,r.PathCommand,r.Anchor)}})(Rn,function(e,r,o,c){var l=c.subclass({stroke:1,fill:!1,color:"#333",closed:!0,visible:!0,path:[{}],front:{z:1},backface:!0});l.prototype.create=function(a){c.prototype.create.call(this,a),this.updatePath(),this.front=new r(a.front||this.front),this.renderFront=new r(this.front),this.renderNormal=new r};var n=["move","line","bezier","arc"];l.prototype.updatePath=function(){this.setPath(),this.updatePathCommands()},l.prototype.setPath=function(){},l.prototype.updatePathCommands=function(){var a;this.pathCommands=this.path.map(function(d,p){var g=Object.keys(d),x=g[0],v=d[x],w=g.length==1&&n.indexOf(x)!=-1;w||(x="line",v=d);var k=x=="line"||x=="move",R=Array.isArray(v);k&&!R&&(v=[v]),x=p===0?"move":x;var P=new o(x,v,a);return a=P.endRenderPoint,P})},l.prototype.reset=function(){this.renderOrigin.set(this.origin),this.renderFront.set(this.front),this.pathCommands.forEach(function(a){a.reset()})},l.prototype.transform=function(a,d,p){this.renderOrigin.transform(a,d,p),this.renderFront.transform(a,d,p),this.renderNormal.set(this.renderOrigin).subtract(this.renderFront),this.pathCommands.forEach(function(g){g.transform(a,d,p)}),this.children.forEach(function(g){g.transform(a,d,p)})},l.prototype.updateSortValue=function(){var a=this.pathCommands.length,d=this.pathCommands[0].endRenderPoint,p=this.pathCommands[a-1].endRenderPoint,g=a>2&&d.isSame(p);g&&(a-=1);for(var x=0,v=0;v<a;v++)x+=this.pathCommands[v].endRenderPoint.z;this.sortValue=x/a},l.prototype.render=function(a,d){var p=this.pathCommands.length;if(!(!this.visible||!p)&&(this.isFacingBack=this.renderNormal.z>0,!(!this.backface&&this.isFacingBack))){if(!d)throw new Error("Zdog renderer required. Set to "+d);var g=p==1;d.isCanvas&&g?this.renderCanvasDot(a,d):this.renderPath(a,d)}};var u=e.TAU;l.prototype.renderCanvasDot=function(a){var d=this.getLineWidth();if(d){a.fillStyle=this.getRenderColor();var p=this.pathCommands[0].endRenderPoint;a.beginPath();var g=d/2;a.arc(p.x,p.y,g,0,u),a.fill()}},l.prototype.getLineWidth=function(){return this.stroke?this.stroke==!0?1:this.stroke:0},l.prototype.getRenderColor=function(){var a=typeof this.backface=="string"&&this.isFacingBack,d=a?this.backface:this.color;return d},l.prototype.renderPath=function(a,d){var p=this.getRenderElement(a,d),g=this.pathCommands.length==2&&this.pathCommands[1].method=="line",x=!g&&this.closed,v=this.getRenderColor();d.renderPath(a,p,this.pathCommands,x),d.stroke(a,p,this.stroke,v,this.getLineWidth()),d.fill(a,p,this.fill,v),d.end(a,p)};var h="http://www.w3.org/2000/svg";return l.prototype.getRenderElement=function(a,d){if(d.isSvg)return this.svgElement||(this.svgElement=document.createElementNS(h,"path"),this.svgElement.setAttribute("stroke-linecap","round"),this.svgElement.setAttribute("stroke-linejoin","round")),this.svgElement},l})})(te)),te.exports}var ee={exports:{}},Mn=ee.exports,nr;function Fr(){return nr||(nr=1,(function(t){(function(i,e){if(t.exports)t.exports=e(gt());else{var r=i.Zdog;r.Group=e(r.Anchor)}})(Mn,function(e){var r=e.subclass({updateSort:!1,visible:!0});return r.prototype.updateSortValue=function(){var o=0;this.flatGraph.forEach(function(c){c.updateSortValue(),o+=c.sortValue}),this.sortValue=o/this.flatGraph.length,this.updateSort&&this.flatGraph.sort(e.shapeSorter)},r.prototype.render=function(o,c){this.visible&&this.flatGraph.forEach(function(l){l.render(o,c)})},r.prototype.updateFlatGraph=function(){var o=[];this.flatGraph=this.addChildFlatGraph(o)},r.prototype.getFlatGraph=function(){return[this]},r})})(ee)),ee.exports}var re={exports:{}},Tn=re.exports,sr;function Dr(){return sr||(sr=1,(function(t){(function(i,e){if(t.exports)t.exports=e(vt());else{var r=i.Zdog;r.Rect=e(r.Shape)}})(Tn,function(e){var r=e.subclass({width:1,height:1});return r.prototype.setPath=function(){var o=this.width/2,c=this.height/2;this.path=[{x:-o,y:-c},{x:o,y:-c},{x:o,y:c},{x:-o,y:c}]},r})})(re)),re.exports}var ne={exports:{}},Pn=ne.exports,ir;function _n(){return ir||(ir=1,(function(t){(function(i,e){if(t.exports)t.exports=e(vt());else{var r=i.Zdog;r.RoundedRect=e(r.Shape)}})(Pn,function(e){var r=e.subclass({width:1,height:1,cornerRadius:.25,closed:!1});return r.prototype.setPath=function(){var o=this.width/2,c=this.height/2,l=Math.min(o,c),n=Math.min(this.cornerRadius,l),u=o-n,h=c-n,a=[{x:u,y:-c},{arc:[{x:o,y:-c},{x:o,y:-h}]}];h&&a.push({x:o,y:h}),a.push({arc:[{x:o,y:c},{x:u,y:c}]}),u&&a.push({x:-u,y:c}),a.push({arc:[{x:-o,y:c},{x:-o,y:h}]}),h&&a.push({x:-o,y:-h}),a.push({arc:[{x:-o,y:-c},{x:-u,y:-c}]}),u&&a.push({x:u,y:-c}),this.path=a},r})})(ne)),ne.exports}var se={exports:{}},An=se.exports,or;function fe(){return or||(or=1,(function(t){(function(i,e){if(t.exports)t.exports=e(vt());else{var r=i.Zdog;r.Ellipse=e(r.Shape)}})(An,function(e){var r=e.subclass({diameter:1,width:void 0,height:void 0,quarters:4,closed:!1});return r.prototype.setPath=function(){var o=this.width!=null?this.width:this.diameter,c=this.height!=null?this.height:this.diameter,l=o/2,n=c/2;this.path=[{x:0,y:-n},{arc:[{x:l,y:-n},{x:l,y:0}]}],this.quarters>1&&this.path.push({arc:[{x:l,y:n},{x:0,y:n}]}),this.quarters>2&&this.path.push({arc:[{x:-l,y:n},{x:-l,y:0}]}),this.quarters>3&&this.path.push({arc:[{x:-l,y:-n},{x:0,y:-n}]})},r})})(se)),se.exports}var ie={exports:{}},$n=ie.exports,ar;function Ln(){return ar||(ar=1,(function(t){(function(i,e){if(t.exports)t.exports=e(U(),vt());else{var r=i.Zdog;r.Polygon=e(r,r.Shape)}})($n,function(e,r){var o=r.subclass({sides:3,radius:.5}),c=e.TAU;return o.prototype.setPath=function(){this.path=[];for(var l=0;l<this.sides;l++){var n=l/this.sides*c-c/4,u=Math.cos(n)*this.radius,h=Math.sin(n)*this.radius;this.path.push({x:u,y:h})}},o})})(ie)),ie.exports}var oe={exports:{}},On=oe.exports,cr;function In(){return cr||(cr=1,(function(t){(function(i,e){if(t.exports)t.exports=e(U(),Ct(),gt(),fe());else{var r=i.Zdog;r.Hemisphere=e(r,r.Vector,r.Anchor,r.Ellipse)}})(On,function(e,r,o,c){var l=c.subclass({fill:!0}),n=e.TAU;l.prototype.create=function(){c.prototype.create.apply(this,arguments),this.apex=new o({addTo:this,translate:{z:this.diameter/2}}),this.renderCentroid=new r},l.prototype.updateSortValue=function(){this.renderCentroid.set(this.renderOrigin).lerp(this.apex.renderOrigin,3/8),this.sortValue=this.renderCentroid.z},l.prototype.render=function(h,a){this.renderDome(h,a),c.prototype.render.apply(this,arguments)},l.prototype.renderDome=function(h,a){if(this.visible){var d=this.getDomeRenderElement(h,a),p=Math.atan2(this.renderNormal.y,this.renderNormal.x),g=this.diameter/2*this.renderNormal.magnitude(),x=this.renderOrigin.x,v=this.renderOrigin.y;if(a.isCanvas){var w=p+n/4,k=p-n/4;h.beginPath(),h.arc(x,v,g,w,k)}else a.isSvg&&(p=(p-n/4)/n*360,this.domeSvgElement.setAttribute("d","M "+-g+",0 A "+g+","+g+" 0 0 1 "+g+",0"),this.domeSvgElement.setAttribute("transform","translate("+x+","+v+" ) rotate("+p+")"));a.stroke(h,d,this.stroke,this.color,this.getLineWidth()),a.fill(h,d,this.fill,this.color),a.end(h,d)}};var u="http://www.w3.org/2000/svg";return l.prototype.getDomeRenderElement=function(h,a){if(a.isSvg)return this.domeSvgElement||(this.domeSvgElement=document.createElementNS(u,"path"),this.domeSvgElement.setAttribute("stroke-linecap","round"),this.domeSvgElement.setAttribute("stroke-linejoin","round")),this.domeSvgElement},l})})(oe)),oe.exports}var ae={exports:{}},Bn=ae.exports,hr;function Fn(){return hr||(hr=1,(function(t){(function(i,e){if(t.exports)t.exports=e(U(),pe(),vt(),Fr(),fe());else{var r=i.Zdog;r.Cylinder=e(r,r.PathCommand,r.Shape,r.Group,r.Ellipse)}})(Bn,function(e,r,o,c,l){function n(){}var u=c.subclass({color:"#333",updateSort:!0});u.prototype.create=function(){c.prototype.create.apply(this,arguments),this.pathCommands=[new r("move",[{}]),new r("line",[{}])]},u.prototype.render=function(x,v){this.renderCylinderSurface(x,v),c.prototype.render.apply(this,arguments)},u.prototype.renderCylinderSurface=function(x,v){if(this.visible){var w=this.getRenderElement(x,v),k=this.frontBase,R=this.rearBase,P=k.renderNormal.magnitude(),S=k.diameter*P+k.getLineWidth();this.pathCommands[0].renderPoints[0].set(k.renderOrigin),this.pathCommands[1].renderPoints[0].set(R.renderOrigin),v.isCanvas&&(x.lineCap="butt"),v.renderPath(x,w,this.pathCommands),v.stroke(x,w,!0,this.color,S),v.end(x,w),v.isCanvas&&(x.lineCap="round")}};var h="http://www.w3.org/2000/svg";u.prototype.getRenderElement=function(x,v){if(v.isSvg)return this.svgElement||(this.svgElement=document.createElementNS(h,"path")),this.svgElement},u.prototype.copyGraph=n;var a=l.subclass();a.prototype.copyGraph=n;var d=o.subclass({diameter:1,length:1,frontFace:void 0,fill:!0}),p=e.TAU;d.prototype.create=function(){o.prototype.create.apply(this,arguments),this.group=new u({addTo:this,color:this.color,visible:this.visible});var x=this.length/2,v=this.backface||!0;this.frontBase=this.group.frontBase=new l({addTo:this.group,diameter:this.diameter,translate:{z:x},rotate:{y:p/2},color:this.color,stroke:this.stroke,fill:this.fill,backface:this.frontFace||v,visible:this.visible}),this.rearBase=this.group.rearBase=this.frontBase.copy({translate:{z:-x},rotate:{y:0},backface:v})},d.prototype.render=function(){};var g=["stroke","fill","color","visible"];return g.forEach(function(x){var v="_"+x;Object.defineProperty(d.prototype,x,{get:function(){return this[v]},set:function(w){this[v]=w,this.frontBase&&(this.frontBase[x]=w,this.rearBase[x]=w,this.group[x]=w)}})}),d})})(ae)),ae.exports}var ce={exports:{}},Dn=ce.exports,ur;function Gn(){return ur||(ur=1,(function(t){(function(i,e){if(t.exports)t.exports=e(U(),Ct(),pe(),gt(),fe());else{var r=i.Zdog;r.Cone=e(r,r.Vector,r.PathCommand,r.Anchor,r.Ellipse)}})(Dn,function(e,r,o,c,l){var n=l.subclass({length:1,fill:!0}),u=e.TAU;n.prototype.create=function(){l.prototype.create.apply(this,arguments),this.apex=new c({addTo:this,translate:{z:this.length}}),this.renderApex=new r,this.renderCentroid=new r,this.tangentA=new r,this.tangentB=new r,this.surfacePathCommands=[new o("move",[{}]),new o("line",[{}]),new o("line",[{}])]},n.prototype.updateSortValue=function(){this.renderCentroid.set(this.renderOrigin).lerp(this.apex.renderOrigin,1/3),this.sortValue=this.renderCentroid.z},n.prototype.render=function(a,d){this.renderConeSurface(a,d),l.prototype.render.apply(this,arguments)},n.prototype.renderConeSurface=function(a,d){if(this.visible){this.renderApex.set(this.apex.renderOrigin).subtract(this.renderOrigin);var p=this.renderNormal.magnitude(),g=this.renderApex.magnitude2d(),x=this.renderNormal.magnitude2d(),v=Math.acos(x/p),w=Math.sin(v),k=this.diameter/2*p,R=k*w<g;if(R){var P=Math.atan2(this.renderNormal.y,this.renderNormal.x)+u/2,S=g/w,yt=Math.acos(k/S),$=this.tangentA,G=this.tangentB;$.x=Math.cos(yt)*k*w,$.y=Math.sin(yt)*k,G.set(this.tangentA),G.y*=-1,$.rotateZ(P),G.rotateZ(P),$.add(this.renderOrigin),G.add(this.renderOrigin),this.setSurfaceRenderPoint(0,$),this.setSurfaceRenderPoint(1,this.apex.renderOrigin),this.setSurfaceRenderPoint(2,G);var rt=this.getSurfaceRenderElement(a,d);d.renderPath(a,rt,this.surfacePathCommands),d.stroke(a,rt,this.stroke,this.color,this.getLineWidth()),d.fill(a,rt,this.fill,this.color),d.end(a,rt)}}};var h="http://www.w3.org/2000/svg";return n.prototype.getSurfaceRenderElement=function(a,d){if(d.isSvg)return this.surfaceSvgElement||(this.surfaceSvgElement=document.createElementNS(h,"path"),this.surfaceSvgElement.setAttribute("stroke-linecap","round"),this.surfaceSvgElement.setAttribute("stroke-linejoin","round")),this.surfaceSvgElement},n.prototype.setSurfaceRenderPoint=function(a,d){var p=this.surfacePathCommands[a].renderPoints[0];p.set(d)},n})})(ce)),ce.exports}var he={exports:{}},Vn=he.exports,lr;function Hn(){return lr||(lr=1,(function(t){(function(i,e){if(t.exports)t.exports=e(U(),gt(),vt(),Dr());else{var r=i.Zdog;r.Box=e(r,r.Anchor,r.Shape,r.Rect)}})(Vn,function(e,r,o,c){var l=c.subclass();l.prototype.copyGraph=function(){};var n=e.TAU,u=["frontFace","rearFace","leftFace","rightFace","topFace","bottomFace"],h=e.extend({},o.defaults);delete h.path,u.forEach(function(p){h[p]=!0}),e.extend(h,{width:1,height:1,depth:1,fill:!0});var a=r.subclass(h);a.prototype.create=function(p){r.prototype.create.call(this,p),this.updatePath(),this.fill=this.fill},a.prototype.updatePath=function(){u.forEach(function(p){this[p]=this[p]},this)},u.forEach(function(p){var g="_"+p;Object.defineProperty(a.prototype,p,{get:function(){return this[g]},set:function(x){this[g]=x,this.setFace(p,x)}})}),a.prototype.setFace=function(p,g){var x=p+"Rect",v=this[x];if(!g){this.removeChild(v);return}var w=this.getFaceOptions(p);w.color=typeof g=="string"?g:this.color,v?v.setOptions(w):v=this[x]=new l(w),v.updatePath(),this.addChild(v)},a.prototype.getFaceOptions=function(p){return{frontFace:{width:this.width,height:this.height,translate:{z:this.depth/2}},rearFace:{width:this.width,height:this.height,translate:{z:-this.depth/2},rotate:{y:n/2}},leftFace:{width:this.depth,height:this.height,translate:{x:-this.width/2},rotate:{y:-n/4}},rightFace:{width:this.depth,height:this.height,translate:{x:this.width/2},rotate:{y:n/4}},topFace:{width:this.width,height:this.depth,translate:{y:-this.height/2},rotate:{x:-n/4}},bottomFace:{width:this.width,height:this.depth,translate:{y:this.height/2},rotate:{x:n/4}}}[p]};var d=["color","stroke","fill","backface","front","visible"];return d.forEach(function(p){var g="_"+p;Object.defineProperty(a.prototype,p,{get:function(){return this[g]},set:function(x){this[g]=x,u.forEach(function(v){var w=this[v+"Rect"],k=typeof this[v]=="string",R=p=="color"&&k;w&&!R&&(w[p]=x)},this)}})}),a})})(he)),he.exports}var Wn=qt.exports,dr;function qn(){return dr||(dr=1,(function(t){(function(i,e){t.exports&&(t.exports=e(U(),Or(),Ir(),Ct(),gt(),Br(),kn(),pe(),vt(),Fr(),Dr(),_n(),fe(),Ln(),In(),Fn(),Gn(),Hn()))})(Wn,function(e,r,o,c,l,n,u,h,a,d,p,g,x,v,w,k,R,P){return e.CanvasRenderer=r,e.SvgRenderer=o,e.Vector=c,e.Anchor=l,e.Dragger=n,e.Illustration=u,e.PathCommand=h,e.Shape=a,e.Group=d,e.Rect=p,e.RoundedRect=g,e.Ellipse=x,e.Polygon=v,e.Hemisphere=w,e.Cylinder=k,e.Cone=R,e.Box=P,e})})(qt)),qt.exports}var Nn=qn();const L=gn(Nn);var Gr={exports:{}},Et={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var pr;function Un(){if(pr)return Et;pr=1;var t=f,i=Symbol.for("react.element"),e=Symbol.for("react.fragment"),r=Object.prototype.hasOwnProperty,o=t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,c={key:!0,ref:!0,__self:!0,__source:!0};function l(n,u,h){var a,d={},p=null,g=null;h!==void 0&&(p=""+h),u.key!==void 0&&(p=""+u.key),u.ref!==void 0&&(g=u.ref);for(a in u)r.call(u,a)&&!c.hasOwnProperty(a)&&(d[a]=u[a]);if(n&&n.defaultProps)for(a in u=n.defaultProps,u)d[a]===void 0&&(d[a]=u[a]);return{$$typeof:i,type:n,key:p,ref:g,props:d,_owner:o.current}}return Et.Fragment=e,Et.jsx=l,Et.jsxs=l,Et}Gr.exports=Un();var it=Gr.exports,Vr=(function(){if(typeof Map<"u")return Map;function t(i,e){var r=-1;return i.some(function(o,c){return o[0]===e?(r=c,!0):!1}),r}return(function(){function i(){this.__entries__=[]}return Object.defineProperty(i.prototype,"size",{get:function(){return this.__entries__.length},enumerable:!0,configurable:!0}),i.prototype.get=function(e){var r=t(this.__entries__,e),o=this.__entries__[r];return o&&o[1]},i.prototype.set=function(e,r){var o=t(this.__entries__,e);~o?this.__entries__[o][1]=r:this.__entries__.push([e,r])},i.prototype.delete=function(e){var r=this.__entries__,o=t(r,e);~o&&r.splice(o,1)},i.prototype.has=function(e){return!!~t(this.__entries__,e)},i.prototype.clear=function(){this.__entries__.splice(0)},i.prototype.forEach=function(e,r){r===void 0&&(r=null);for(var o=0,c=this.__entries__;o<c.length;o++){var l=c[o];e.call(r,l[1],l[0])}},i})()})(),Ie=typeof window<"u"&&typeof document<"u"&&window.document===document,ue=(function(){return typeof global<"u"&&global.Math===Math?global:typeof self<"u"&&self.Math===Math?self:typeof window<"u"&&window.Math===Math?window:Function("return this")()})(),Xn=(function(){return typeof requestAnimationFrame=="function"?requestAnimationFrame.bind(ue):function(t){return setTimeout(function(){return t(Date.now())},1e3/60)}})(),Yn=2;function Kn(t,i){var e=!1,r=!1,o=0;function c(){e&&(e=!1,t()),r&&n()}function l(){Xn(c)}function n(){var u=Date.now();if(e){if(u-o<Yn)return;r=!0}else e=!0,r=!1,setTimeout(l,i);o=u}return n}var Jn=20,Qn=["top","right","bottom","left","width","height","size","weight"],Zn=typeof MutationObserver<"u",ts=(function(){function t(){this.connected_=!1,this.mutationEventsAdded_=!1,this.mutationsObserver_=null,this.observers_=[],this.onTransitionEnd_=this.onTransitionEnd_.bind(this),this.refresh=Kn(this.refresh.bind(this),Jn)}return t.prototype.addObserver=function(i){~this.observers_.indexOf(i)||this.observers_.push(i),this.connected_||this.connect_()},t.prototype.removeObserver=function(i){var e=this.observers_,r=e.indexOf(i);~r&&e.splice(r,1),!e.length&&this.connected_&&this.disconnect_()},t.prototype.refresh=function(){var i=this.updateObservers_();i&&this.refresh()},t.prototype.updateObservers_=function(){var i=this.observers_.filter(function(e){return e.gatherActive(),e.hasActive()});return i.forEach(function(e){return e.broadcastActive()}),i.length>0},t.prototype.connect_=function(){!Ie||this.connected_||(document.addEventListener("transitionend",this.onTransitionEnd_),window.addEventListener("resize",this.refresh),Zn?(this.mutationsObserver_=new MutationObserver(this.refresh),this.mutationsObserver_.observe(document,{attributes:!0,childList:!0,characterData:!0,subtree:!0})):(document.addEventListener("DOMSubtreeModified",this.refresh),this.mutationEventsAdded_=!0),this.connected_=!0)},t.prototype.disconnect_=function(){!Ie||!this.connected_||(document.removeEventListener("transitionend",this.onTransitionEnd_),window.removeEventListener("resize",this.refresh),this.mutationsObserver_&&this.mutationsObserver_.disconnect(),this.mutationEventsAdded_&&document.removeEventListener("DOMSubtreeModified",this.refresh),this.mutationsObserver_=null,this.mutationEventsAdded_=!1,this.connected_=!1)},t.prototype.onTransitionEnd_=function(i){var e=i.propertyName,r=e===void 0?"":e,o=Qn.some(function(c){return!!~r.indexOf(c)});o&&this.refresh()},t.getInstance=function(){return this.instance_||(this.instance_=new t),this.instance_},t.instance_=null,t})(),Hr=function(t,i){for(var e=0,r=Object.keys(i);e<r.length;e++){var o=r[e];Object.defineProperty(t,o,{value:i[o],enumerable:!1,writable:!1,configurable:!0})}return t},jt=function(t){var i=t&&t.ownerDocument&&t.ownerDocument.defaultView;return i||ue},Wr=xe(0,0,0,0);function le(t){return parseFloat(t)||0}function fr(t){for(var i=[],e=1;e<arguments.length;e++)i[e-1]=arguments[e];return i.reduce(function(r,o){var c=t["border-"+o+"-width"];return r+le(c)},0)}function es(t){for(var i=["top","right","bottom","left"],e={},r=0,o=i;r<o.length;r++){var c=o[r],l=t["padding-"+c];e[c]=le(l)}return e}function rs(t){var i=t.getBBox();return xe(0,0,i.width,i.height)}function ns(t){var i=t.clientWidth,e=t.clientHeight;if(!i&&!e)return Wr;var r=jt(t).getComputedStyle(t),o=es(r),c=o.left+o.right,l=o.top+o.bottom,n=le(r.width),u=le(r.height);if(r.boxSizing==="border-box"&&(Math.round(n+c)!==i&&(n-=fr(r,"left","right")+c),Math.round(u+l)!==e&&(u-=fr(r,"top","bottom")+l)),!is(t)){var h=Math.round(n+c)-i,a=Math.round(u+l)-e;Math.abs(h)!==1&&(n-=h),Math.abs(a)!==1&&(u-=a)}return xe(o.left,o.top,n,u)}var ss=(function(){return typeof SVGGraphicsElement<"u"?function(t){return t instanceof jt(t).SVGGraphicsElement}:function(t){return t instanceof jt(t).SVGElement&&typeof t.getBBox=="function"}})();function is(t){return t===jt(t).document.documentElement}function os(t){return Ie?ss(t)?rs(t):ns(t):Wr}function as(t){var i=t.x,e=t.y,r=t.width,o=t.height,c=typeof DOMRectReadOnly<"u"?DOMRectReadOnly:Object,l=Object.create(c.prototype);return Hr(l,{x:i,y:e,width:r,height:o,top:e,right:i+r,bottom:o+e,left:i}),l}function xe(t,i,e,r){return{x:t,y:i,width:e,height:r}}var cs=(function(){function t(i){this.broadcastWidth=0,this.broadcastHeight=0,this.contentRect_=xe(0,0,0,0),this.target=i}return t.prototype.isActive=function(){var i=os(this.target);return this.contentRect_=i,i.width!==this.broadcastWidth||i.height!==this.broadcastHeight},t.prototype.broadcastRect=function(){var i=this.contentRect_;return this.broadcastWidth=i.width,this.broadcastHeight=i.height,i},t})(),hs=(function(){function t(i,e){var r=as(e);Hr(this,{target:i,contentRect:r})}return t})(),us=(function(){function t(i,e,r){if(this.activeObservations_=[],this.observations_=new Vr,typeof i!="function")throw new TypeError("The callback provided as parameter 1 is not a function.");this.callback_=i,this.controller_=e,this.callbackCtx_=r}return t.prototype.observe=function(i){if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");if(!(typeof Element>"u"||!(Element instanceof Object))){if(!(i instanceof jt(i).Element))throw new TypeError('parameter 1 is not of type "Element".');var e=this.observations_;e.has(i)||(e.set(i,new cs(i)),this.controller_.addObserver(this),this.controller_.refresh())}},t.prototype.unobserve=function(i){if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");if(!(typeof Element>"u"||!(Element instanceof Object))){if(!(i instanceof jt(i).Element))throw new TypeError('parameter 1 is not of type "Element".');var e=this.observations_;e.has(i)&&(e.delete(i),e.size||this.controller_.removeObserver(this))}},t.prototype.disconnect=function(){this.clearActive(),this.observations_.clear(),this.controller_.removeObserver(this)},t.prototype.gatherActive=function(){var i=this;this.clearActive(),this.observations_.forEach(function(e){e.isActive()&&i.activeObservations_.push(e)})},t.prototype.broadcastActive=function(){if(this.hasActive()){var i=this.callbackCtx_,e=this.activeObservations_.map(function(r){return new hs(r.target,r.broadcastRect())});this.callback_.call(i,e,i),this.clearActive()}},t.prototype.clearActive=function(){this.activeObservations_.splice(0)},t.prototype.hasActive=function(){return this.activeObservations_.length>0},t})(),qr=typeof WeakMap<"u"?new WeakMap:new Vr,Nr=(function(){function t(i){if(!(this instanceof t))throw new TypeError("Cannot call a class as a function.");if(!arguments.length)throw new TypeError("1 argument required, but only 0 present.");var e=ts.getInstance(),r=new us(i,e,this);qr.set(this,r)}return t})();["observe","unobserve","disconnect"].forEach(function(t){Nr.prototype[t]=function(){var i;return(i=qr.get(this))[t].apply(i,arguments)}});var ls=(function(){return typeof ue.ResizeObserver<"u"?ue.ResizeObserver:Nr})();function de(t,i){L.extend(t,i)}const W=t=>f.forwardRef(({children:i,...e},r)=>Yr(t,i,e,r)[0]);function Ur(){const t=Math.floor(Math.random()*16777216).toString(16).toUpperCase();return"#"+t.padStart(6,"0")=="#000000"?Ur():"#"+t.padStart(6,"0")}const je=t=>{let i=t.toString(16);return i.length==1?"0"+i:i},ds=(t,i,e)=>"#"+je(t)+je(i)+je(e);function Be(t,i,e){return new Proxy(t,{set(r,o,c){return typeof c=="object"&&c!==null&&(c=Be(c,i)),i(r,o,c,e),r[o]=c,!0},get(r,o){return typeof r[o]=="object"&&r[o]!==null?Be(r[o],i,o):r[o]}})}const xr=(t,i,e)=>{const r=t.getBoundingClientRect();return{x:(i.clientX-r.left)/(r.right-r.left)*e.width,y:(i.clientY-r.top)/(r.bottom-r.top)*e.height}},gr=({x:t,y:i,canvasContext:e})=>{let r=e.getImageData(t,i,1,1).data;return ds(r[0],r[1],r[2])},Xr=f.createContext(),vr=f.createContext(),yr=f.createContext();function ps(){const t=j.useRef(),[i,e]=j.useState({left:0,top:0,width:0,height:0}),[r]=j.useState(()=>new ls(([o])=>e(o.contentRect)));return j.useEffect(()=>(t.current&&r.observe(t.current),()=>r.disconnect()),[t.current]),[{ref:t},i]}function Yr(t,i,e,r){const o=j.useContext(Xr),c=j.useContext(vr),l=j.useContext(yr),n=j.useMemo(()=>Ur(),[]),u=j.useMemo(()=>({stroke:!1,...e,color:n,leftFace:n,rightFace:n,topFace:n,bottomFace:n}),[n,e]),[h]=j.useState(()=>new t(e)),[a]=j.useState(()=>new t(u)),d=(g,x,v,w)=>{w?a[w][x]=v:a[x]=v,o.current.illu.updateRenderGraph()},[p]=j.useState(()=>Be(h,d));return j.useImperativeHandle(r,()=>p),j.useLayoutEffect(()=>{de(h,e),c&&o.current.illu.updateRenderGraph()},[e]),j.useLayoutEffect(()=>{de(a,u)},[u]),j.useLayoutEffect(()=>{if(c)return c.addChild(h),o.current.illu.updateGraph(),()=>{c.removeChild(h),c.updateFlatGraph(),o.current.illu.updateGraph()}},[c]),j.useEffect(()=>{if(c)return o.current.itemMap[n]=h,e.onClick&&(o.current.clickEventMap[n]=e.onClick),e.onPointerMove&&(o.current.pointerMoveEventMap[n]=e.onPointerMove),e.onPointerEnter&&(o.current.pointerEnterEventMap[n]=e.onPointerEnter),e.onPointerLeave&&(o.current.pointerLeaveEventMap[n]=e.onPointerLeave),()=>{delete o.current.itemMap[n],delete o.current.clickEventMap[n],delete o.current.pointerMoveEventMap[n],delete o.current.pointerEnterEventMap[n],delete o.current.pointerLeaveEventMap[n]}},[e]),j.useLayoutEffect(()=>{if(l)return l.addChild(a),o.current.illu_ghost.updateGraph(),()=>{l.removeChild(a),l.updateFlatGraph(),o.current.illu_ghost.updateGraph()}},[l]),[it.jsx(yr.Provider,{value:a,children:it.jsx(vr.Provider,{value:h,children:i})},n),h,a]}const at=f.memo(({children:t,style:i,resize:e,element:r="svg",frameloop:o="always",dragRotate:c,onDragMove:l=()=>{},onDragStart:n=()=>{},onDragEnd:u=()=>{},pointerEvents:h=!1,...a})=>{const d=j.useRef(),p=j.useRef(),[g,x]=j.useState(null);j.useEffect(()=>{x(p.current.getContext("2d",{willReadFrequently:!0}))},[]);const[v,w]=ps(),[k,R,P]=Yr(L.Anchor,t),S=j.useRef({scene:R,illu:void 0,size:{},subscribers:[],subscribe:_=>(S.current.subscribers.push(_),()=>S.current.subscribers=S.current.subscribers.filter(I=>I!==_)),illu_ghost:void 0,itemMap:{},clickEventMap:{},pointerMoveEventMap:{},pointerEnterEventMap:{},pointerLeaveEventMap:{},pointerEvents:h});j.useEffect(()=>{S.current.size=w,S.current.illu&&(S.current.illu.setSize(w.width,w.height),S.current.illu_ghost.setSize(w.width,w.height),o==="demand"&&(S.current.illu.updateRenderGraph(),S.current.illu_ghost.updateRenderGraph()))},[w]),j.useEffect(()=>{S.current.illu=new L.Illustration({element:d.current,dragRotate:c,onDragMove:()=>{S.current.illu_ghost.rotate={x:S.current.illu.rotate.x,y:S.current.illu.rotate.y,z:S.current.illu.rotate.z},l()},onDragStart:n,onDragEnd:u,...a}),S.current.illu.addChild(R),S.current.illu.updateGraph(),S.current.illu_ghost=new L.Illustration({element:p.current,...a}),S.current.illu_ghost.addChild(P),S.current.illu_ghost.updateGraph();let _,I=!0;function M(A){const{size:B,subscribers:_t}=S.current;B.width&&B.height&&(_t.forEach(At=>At(A)),o!=="demand"&&S.current.illu.updateRenderGraph()),I&&o!=="demand"&&(_=requestAnimationFrame(M))}return M(),()=>{I=!1,cancelAnimationFrame(_)}},[o]),j.useLayoutEffect(()=>{S.current.illu&&de(S.current.illu,a),S.current.illu_ghost&&de(S.current.illu_ghost,a)},[a]);const yt=_=>{if(!h)return;S.current.illu_ghost&&S.current.illu_ghost.updateRenderGraph();const I=xr(d.current,_,p.current),M=gr({...I,canvasContext:g}).toUpperCase(),A=S.current.clickEventMap[M];A&&A(_,S.current.itemMap[M])},$=j.useRef(null),G=j.useRef(null),rt=_=>{G.current=_},ve=_=>{if(!h)return;S.current.illu_ghost&&S.current.illu_ghost.updateRenderGraph();const I=xr(d.current,_,p.current),M=gr({...I,canvasContext:g}).toUpperCase();if(M!=="#000000"&&$.current!==M&&G.current!==M){const B=S.current.pointerEnterEventMap[M];B&&B(_,S.current.itemMap[M]),rt($.current)}if($.current&&$.current!=="#000000"&&$.current!==M&&G.current){const B=S.current.pointerLeaveEventMap[$.current];B&&B(_,S.current.itemMap[$.current])}const A=S.current.pointerMoveEventMap[M];A&&A(_,S.current.itemMap[M]),$.current=M};return it.jsxs(it.Fragment,{children:[it.jsxs("div",{ref:v.ref,...a,style:{position:"relative",width:"100%",height:"100%",overflow:"hidden",boxSizing:"border-box",...i},children:[it.jsx(r,{ref:d,style:{display:"block",boxSizing:"border-box"},width:w.width,height:w.height,onClick:yt,onPointerMove:ve}),S.current.illu&&it.jsx(Xr.Provider,{value:S,children:k})]}),it.jsx("canvas",{ref:p,style:{display:"block",boxSizing:"border-box",opacity:"0",position:"fixed",zIndex:"1000",pointerEvents:"none",background:"black"},width:w.width,height:w.height})]})});W(L.Anchor);const C=W(L.Shape);W(L.Group);W(L.Rect);W(L.RoundedRect);const O=W(L.Ellipse),fs=W(L.Polygon);W(L.Hemisphere);W(L.Cylinder);W(L.Cone);W(L.Box);const ct=y.div`
  width: ${t=>t.width}px;
  height: ${t=>t.height}px;
`,xs=y.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`,gs=y.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  opacity: 0.4;
`,Ce=16,vs=Math.PI/6,bt=2.8,H=1.4,ge=.5,tt="#48aff0",et="#f29e02",ys=({x:t,z:i,pressed:e})=>s.jsxs(C,{translate:{x:t,z:i,y:e?ge:0},stroke:0,children:[s.jsx(O,{diameter:H*2,stroke:.2,color:e?et:tt}),s.jsx(fs,{radius:H*.55,sides:3,stroke:.25,color:e?et:tt,fill:e})]}),ms=({x:t,z:i,pressed:e})=>s.jsxs(C,{translate:{x:t,z:i,y:e?ge:0},stroke:0,children:[s.jsx(O,{diameter:H*2,stroke:.2,color:e?et:tt}),s.jsx(O,{diameter:H*.9,stroke:.25,color:e?et:tt,fill:e})]}),bs=({x:t,z:i,pressed:e})=>{const r=H*.4;return s.jsxs(C,{translate:{x:t,z:i,y:e?ge:0},stroke:0,children:[s.jsx(O,{diameter:H*2,stroke:.2,color:e?et:tt}),s.jsx(C,{path:[{x:-r,y:0,z:-r},{x:r,y:0,z:r}],stroke:.25,color:e?et:tt}),s.jsx(C,{path:[{x:r,y:0,z:-r},{x:-r,y:0,z:r}],stroke:.25,color:e?et:tt})]})},ws=({x:t,z:i,pressed:e})=>{const r=H*.38,o=H*.44;return s.jsxs(C,{translate:{x:t,z:i,y:e?ge:0},stroke:0,children:[s.jsx(O,{diameter:H*2,stroke:.2,color:e?et:tt}),s.jsx(C,{path:[{x:-r,y:0,z:-o},{x:r,y:0,z:-o},{x:r,y:0,z:o},{x:-r,y:0,z:o}],stroke:.25,color:e?et:tt,fill:e,closed:!0})]})},Ai=()=>{const t=f.useContext(T),[i,e]=f.useState(t.triangle.state),[r,o]=f.useState(t.circle.state),[c,l]=f.useState(t.cross.state),[n,u]=f.useState(t.square.state);return f.useEffect(()=>{t.triangle.on("change",({state:h})=>e(h)),t.circle.on("change",({state:h})=>o(h)),t.cross.on("change",({state:h})=>l(h)),t.square.on("change",({state:h})=>u(h))},[]),s.jsxs(xs,{children:[s.jsx(ct,{width:(bt*2+H*2+2)*Ce,height:(bt*2+H*2+3)*Ce,children:s.jsx(at,{element:"svg",zoom:Ce,children:s.jsxs(C,{rotate:{x:vs},stroke:0,children:[s.jsx(ys,{x:0,z:bt,pressed:i}),s.jsx(ms,{x:bt,z:0,pressed:r}),s.jsx(bs,{x:0,z:-bt,pressed:c}),s.jsx(ws,{x:-bt,z:0,pressed:n})]})})}),s.jsx(gs,{children:"Buttons"})]})},Ss=y.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`,js=y.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  opacity: 0.4;
`,Ee=16,Cs=Math.PI/5,Es=2.4,Kr=1.8,Jr=2.2,mr=.5,ks=.5,zs="#48aff0",Rs="#f29e02",Ms=.7,It=({x:t,z:i,pressed:e,rotateY:r=0,wide:o=!1})=>{const c=(o?Jr:Kr)/2,l=Es/2,n=e?Rs:zs;return s.jsxs(C,{translate:{x:t,z:i,y:e?ks:0},rotate:{y:r},stroke:0,children:[s.jsx(C,{path:[{x:0,y:0,z:-l-Ms},{x:-c,y:0,z:-l},{x:-c,y:0,z:l},{x:c,y:0,z:l},{x:c,y:0,z:-l}],stroke:.2,color:n,fill:e,closed:!0}),s.jsx(C,{path:[{x:-mr,y:0,z:l*.2},{x:0,y:0,z:l*.7},{x:mr,y:0,z:l*.2}],stroke:.2,color:n,closed:!1})]})},$i=()=>{const t=f.useContext(T),[i,e]=f.useState(t.dpad.up.state),[r,o]=f.useState(t.dpad.down.state),[c,l]=f.useState(t.dpad.left.state),[n,u]=f.useState(t.dpad.right.state);f.useEffect(()=>{t.dpad.up.on("change",({state:a})=>e(a)),t.dpad.down.on("change",({state:a})=>o(a)),t.dpad.left.on("change",({state:a})=>l(a)),t.dpad.right.on("change",({state:a})=>u(a))},[]);const h=2.8;return s.jsxs(Ss,{children:[s.jsx(ct,{width:(h*2+Jr+2)*Ee,height:(h*2+Kr+3)*Ee,children:s.jsx(at,{element:"svg",zoom:Ee,children:s.jsxs(C,{rotate:{x:Cs},stroke:0,children:[s.jsx(It,{x:0,z:h,pressed:i}),s.jsx(It,{x:0,z:-h,pressed:r,rotateY:Math.PI}),s.jsx(It,{x:-h,z:0,pressed:c,rotateY:Math.PI/2,wide:!0}),s.jsx(It,{x:h,z:0,pressed:n,rotateY:-Math.PI/2,wide:!0})]})})}),s.jsx(js,{children:"D-pad"})]})},Ts=y.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`,Ps=y.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  opacity: 0.4;
`,Bt=7,br=.3,ke=18,wr=2.2,Li=({label:t,x:i,y:e,pressed:r})=>s.jsxs(Ts,{children:[s.jsx(ct,{width:(Bt+2)*ke,height:(Bt+2)*ke,children:s.jsxs(at,{element:"svg",zoom:ke,children:[s.jsx(O,{stroke:br,diameter:Bt,color:r?"#f29e02":"#48aff0"}),s.jsx(O,{stroke:br,diameter:Bt*.6,color:"#f29e02",translate:{x:i*wr,y:-e*wr}})]})}),s.jsx(Ps,{children:t})]});y.div`
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
`;const _s=y.div`
  display: flex;
  align-items: center;
  gap: 4px;
`,Sr=y.span`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.35;
`,As=y.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`,Ft=14,jr=Math.PI/5,K=3.5,ht=5,$s=Math.PI/5,kt=3.5,Dt=1,Ls=.4,ze=2,Re="#48aff0",Me="#f29e02",Qr=({triggerLabel:t,bumperLabel:i,triggerPressure:e,triggerPressed:r,bumperPressed:o,labelSide:c})=>{const l=e*$s,n=r?Me:Re,u=r?"#ff8c00":e>0?`rgba(242, 158, 2, ${.2+e*.8})`:"rgba(72, 175, 240, 0.3)",h=o?Me:Re,a=ht+ze+Dt,d=(Math.max(K,kt)+2)*Ft,p=(a+3)*Ft,g=s.jsx(ct,{width:d,height:p,children:s.jsx(at,{element:"svg",zoom:Ft,children:s.jsxs(C,{rotate:{x:-jr},stroke:0,children:[s.jsx(C,{path:[{x:-K/2,y:0,z:0},{x:K/2,y:0,z:0},{x:K/2,y:0,z:-ht},{x:-K/2,y:0,z:-ht}],stroke:.3,color:n,fill:!1,closed:!0}),s.jsx(C,{rotate:{x:l},stroke:0,children:s.jsx(C,{path:[{x:-K/2+.3,y:0,z:-ht+.3},{x:K/2-.3,y:0,z:-ht+.3},{x:K/2-.3,y:0,z:-.3},{x:-K/2+.3,y:0,z:-.3}],stroke:.4,color:u,fill:!0,closed:!0})}),s.jsx(O,{diameter:.6,stroke:.2,color:r?Me:Re,translate:{y:e*2,z:-ht-.3}}),s.jsx(C,{translate:{z:ze},stroke:0,children:s.jsx(C,{path:[{x:-kt/2,y:0,z:0},{x:kt/2,y:0,z:0},{x:kt/2,y:0,z:Dt},{x:-kt/2,y:0,z:Dt}],stroke:.3,color:h,fill:o,closed:!0,translate:{y:o?Ls:0}})})]})})}),x=(ht/2+ze+Dt/2)*Ft*Math.cos(jr),v=s.jsxs(As,{style:{gap:`${x}px`},children:[s.jsx(Sr,{style:{marginTop:6},children:t}),s.jsx(Sr,{style:{marginTop:-6},children:i})]});return s.jsx(_s,{children:c==="right"?s.jsxs(s.Fragment,{children:[g,v]}):s.jsxs(s.Fragment,{children:[v,g]})})},Oi=()=>{const t=f.useContext(T),[i,e]=f.useState(t.left.trigger.pressure),[r,o]=f.useState(t.left.trigger.button.state),[c,l]=f.useState(t.left.bumper.state);return f.useEffect(()=>{t.left.trigger.on("change",({pressure:n})=>e(n)),t.left.trigger.button.on("change",({state:n})=>o(n)),t.left.bumper.on("change",({state:n})=>l(n))},[]),s.jsx(Qr,{triggerLabel:"L2",bumperLabel:"L1",triggerPressure:i,triggerPressed:r,bumperPressed:c,labelSide:"right"})},Ii=()=>{const t=f.useContext(T),[i,e]=f.useState(t.right.trigger.pressure),[r,o]=f.useState(t.right.trigger.button.state),[c,l]=f.useState(t.right.bumper.state);return f.useEffect(()=>{t.right.trigger.on("change",({pressure:n})=>e(n)),t.right.trigger.button.on("change",({state:n})=>o(n)),t.right.bumper.on("change",({state:n})=>l(n))},[]),s.jsx(Qr,{triggerLabel:"R2",bumperLabel:"R1",triggerPressure:i,triggerPressed:r,bumperPressed:c,labelSide:"left"})},Os=y.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`,Is=y.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 2px;
  opacity: 0.4;
`,Te=14,N=16,D=7,Cr=N/2-.5,Er=D/2-.5,Bi=()=>{const t=f.useContext(T),[i,e]=f.useState(t.touchpad.button.state),[r,o]=f.useState({active:t.touchpad.left.contact.state,x:t.touchpad.left.x.state,y:t.touchpad.left.y.state}),[c,l]=f.useState({active:t.touchpad.right.contact.state,x:t.touchpad.right.x.state,y:t.touchpad.right.y.state});return f.useEffect(()=>{t.touchpad.button.on("change",({state:n})=>e(n)),t.touchpad.left.on("change",n=>{o({active:n.contact.state,x:n.x.state,y:n.y.state})}),t.touchpad.right.on("change",n=>{l({active:n.contact.state,x:n.x.state,y:n.y.state})})},[]),s.jsxs(Os,{children:[s.jsx(ct,{width:(N+2)*Te,height:(D+2)*Te,children:s.jsxs(at,{element:"svg",zoom:Te,children:[s.jsx(C,{path:[{x:-N/2,y:-D/2},{x:N/2,y:-D/2},{x:N/2,y:D/2},{x:-N/2,y:D/2}],stroke:.2,color:i?"#48aff0":"#335577",fill:!0,closed:!0}),s.jsx(C,{path:[{x:-N/2,y:-D/2},{x:N/2,y:-D/2},{x:N/2,y:D/2},{x:-N/2,y:D/2}],stroke:.15,color:"#48aff0",fill:!1,closed:!0}),s.jsx(C,{path:[{x:0,y:-D/2+.5},{x:0,y:D/2-.5}],stroke:.08,color:"rgba(72, 175, 240, 0.3)"}),r.active&&s.jsx(O,{diameter:1.2,stroke:.3,color:"#f29e02",translate:{x:r.x*Cr,y:r.y*Er}}),c.active&&s.jsx(O,{diameter:1.2,stroke:.3,color:"#ff6b35",translate:{x:c.x*Cr,y:c.y*Er}})]})}),s.jsx(Is,{children:"Touchpad"})]})},Bs=y.div`
  display: flex;
  align-items: center;
  gap: 6px;
`,kr=y.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`,Fe=y.span`
  font-size: 7px;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.3;
`,Gt=6,zr=.2,Pe=14,Vt=4,ut=40,Fs="#48aff0",Ds="#f29e02",wt=({value:t,label:i})=>{const e=Math.min(1,Math.abs(t)),r=e*(ut/2),o=t<0;return s.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:1},children:[s.jsxs("svg",{width:Vt,height:ut,children:[s.jsx("rect",{x:0,y:0,width:Vt,height:ut,fill:"rgba(72, 175, 240, 0.08)",rx:1}),s.jsx("line",{x1:0,y1:ut/2,x2:Vt,y2:ut/2,stroke:"rgba(72, 175, 240, 0.15)",strokeWidth:.5}),r>0&&s.jsx("rect",{x:0,y:o?ut/2:ut/2-r,width:Vt,height:r,fill:e>.7?Ds:Fs,opacity:.4+e*.6,rx:1})]}),s.jsx(Fe,{children:i})]})},Rr=y.div`
  display: flex;
  gap: 2px;
`,Fi=()=>{const t=f.useContext(T),[i,e]=f.useState({x:t.gyroscope.x.force,y:t.gyroscope.y.force,z:t.gyroscope.z.force}),[r,o]=f.useState({x:t.accelerometer.x.force,y:t.accelerometer.y.force,z:t.accelerometer.z.force});return f.useEffect(()=>{t.gyroscope.on("change",c=>{e({x:c.x.force,y:c.y.force,z:c.z.force})}),t.accelerometer.on("change",c=>{o({x:c.x.force,y:c.y.force,z:c.z.force})})},[]),s.jsxs(Bs,{children:[s.jsxs(kr,{children:[s.jsxs(Rr,{children:[s.jsx(wt,{value:i.x,label:"x"}),s.jsx(wt,{value:i.y,label:"y"}),s.jsx(wt,{value:i.z,label:"z"})]}),s.jsx(Fe,{children:"Gyro"})]}),s.jsx(ct,{width:(Gt+2)*Pe,height:(Gt+2)*Pe,children:s.jsx(at,{element:"svg",zoom:Pe,children:s.jsxs(C,{rotate:{y:i.x*Math.PI*2,x:i.y*Math.PI*2,z:i.z*Math.PI*2},stroke:0,children:[s.jsx(O,{stroke:zr,diameter:Gt/3,translate:{x:r.x*3,y:r.y*3,z:r.z*3},color:"#f29e02"}),s.jsx(O,{stroke:zr,diameter:Gt,color:"#48aff0"})]})})}),s.jsxs(kr,{children:[s.jsxs(Rr,{children:[s.jsx(wt,{value:r.x,label:"x"}),s.jsx(wt,{value:r.y,label:"y"}),s.jsx(wt,{value:r.z,label:"z"})]}),s.jsx(Fe,{children:"Accel"})]})]})},Gs=y.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin-top: 6px;
`,Vs=y.span`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.35;
`,Hs=y.span`
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.25;
`,zt=22,J=48,Ws="#48aff0",qs="#f29e02",Zr=({value:t,onChange:i,label:e})=>{const r=f.useRef(null),o=f.useRef(!1),c=f.useCallback(a=>{const d=r.current;if(!d)return;const p=d.getBoundingClientRect(),g=a.clientY-p.top,x=Math.max(0,Math.min(1,1-g/p.height)),v=Math.round(x*20)/20;i(v)},[i]),l=f.useCallback(a=>{o.current=!0,c(a);const d=g=>{o.current&&c(g)},p=()=>{o.current=!1,window.removeEventListener("mousemove",d),window.removeEventListener("mouseup",p)};window.addEventListener("mousemove",d),window.addEventListener("mouseup",p)},[c]),n=t*J,u=t>0?qs:Ws,h=Math.round(t*100);return s.jsxs(Gs,{title:`${e}: ${h}% — drag to adjust`,children:[s.jsxs("svg",{ref:r,width:zt,height:J,style:{cursor:"ns-resize",borderRadius:3},onMouseDown:l,children:[s.jsx("rect",{x:0,y:0,width:zt,height:J,fill:"rgba(72, 175, 240, 0.1)",rx:2}),s.jsx("rect",{x:.5,y:.5,width:zt-1,height:J-1,fill:"none",stroke:"rgba(72, 175, 240, 0.3)",strokeWidth:1,rx:2}),n>0&&s.jsx("rect",{x:2,y:J-n,width:zt-4,height:n,fill:u,opacity:.3+t*.7,rx:1}),t>0&&s.jsx("line",{x1:1,y1:J-n,x2:zt-1,y2:J-n,stroke:u,strokeWidth:1,opacity:.8}),[.25,.5,.75].map(a=>s.jsx("line",{x1:0,y1:J*(1-a),x2:2,y2:J*(1-a),stroke:"rgba(72, 175, 240, 0.2)",strokeWidth:.5},a))]}),s.jsx(Vs,{children:e}),s.jsx(Hs,{children:"drag me"})]})},Di=()=>{const t=f.useContext(T),[i,e]=f.useState(t.left.rumble()),r=f.useCallback(o=>{e(o),t.left.rumble(o)},[t]);return s.jsx(Zr,{value:i,onChange:r,label:"Rumble"})},Gi=()=>{const t=f.useContext(T),[i,e]=f.useState(t.right.rumble()),r=f.useCallback(o=>{e(o),t.right.rumble(o)},[t]);return s.jsx(Zr,{value:i,onChange:r,label:"Rumble"})};function Ns(t,i,e){return"#"+[t,i,e].map(r=>r.toString(16).padStart(2,"0")).join("")}function Us(t){const i=parseInt(t.slice(1),16);return{r:i>>16&255,g:i>>8&255,b:i&255}}const Xs=y.div`
  position: relative;
  cursor: pointer;
`,Ys=y.div`
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
`,Ks=y.span`
  font-size: 7px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.9), 0 0 6px rgba(0, 0, 0, 0.6);
`,Js=y.input`
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
`,Vi=()=>{const t=f.useContext(T),i=t.lightbar.color,[e,r]=f.useState(Ns(i.r,i.g,i.b)),o=f.useRef(null),c=f.useCallback(n=>{const u=n.target.value;r(u),t.lightbar.set(Us(u))},[t]),l=f.useCallback(()=>{var n;(n=o.current)==null||n.click()},[]);return s.jsxs(Xs,{onClick:l,title:"Click to change lightbar color",children:[s.jsx(Ys,{$color:e,children:s.jsx(Ks,{children:"click to adjust lights"})}),s.jsx(Js,{ref:o,type:"color",value:e,onChange:c})]})},Qs=y.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  opacity: 0.7;
`,Zs=y.span`
  font-size: 11px;
  opacity: 0.6;
`,Mr=y.button`
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
`,Hi=()=>{const t=f.useContext(T),[i,e]=f.useState(t.connection.state);return f.useEffect(()=>{e(t.connection.state),t.connection.on("change",({state:r})=>e(r))},[t]),i?s.jsxs(Qs,{children:[s.jsx(Zs,{children:"Lightbar:"}),s.jsx(Mr,{onClick:()=>t.lightbar.fadeBlue(),children:"Fade Blue"}),s.jsx(Mr,{onClick:()=>t.lightbar.fadeOut(),children:"Fade Out"})]}):null},ti=y.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`,ei=y.div`
  display: flex;
  gap: 4px;
  align-items: center;
`,tn=y.div`
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
`,ri=y.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1.5px solid ${t=>t.$on?"#48aff0":"rgba(72, 175, 240, 0.3)"};
  background: ${t=>t.$on?"#48aff0":"transparent"};
  box-shadow: ${t=>t.$on?"0 0 8px #48aff0":"none"};
  transition: all 0.15s;

  ${tn}:hover & {
    border-color: #48aff0;
    background: ${t=>t.$on?"#48aff0":"rgba(72, 175, 240, 0.15)"};
  }
`,ni=y.div`
  display: flex;
  align-items: center;
  gap: 0;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 3px 6px;
`,si=y.div`
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
`,ii=({rays:t,active:i})=>{const n=i?"#48aff0":"rgba(72, 175, 240, 0.4)",u=Array.from({length:t},(h,a)=>{const d=a*2*Math.PI/t-Math.PI/2;return s.jsx("line",{x1:8+Math.cos(d)*4,y1:8+Math.sin(d)*4,x2:8+Math.cos(d)*6.5,y2:8+Math.sin(d)*6.5,stroke:n,strokeWidth:"1.2",strokeLinecap:"round"},a)});return s.jsxs("svg",{width:16,height:16,viewBox:"0 0 16 16",style:{display:"block"},children:[s.jsx("circle",{cx:8,cy:8,r:2.5,fill:i?n:"none",stroke:n,strokeWidth:"1"}),u]})},oi=y.span`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.3;
`,ai=y.span`
  font-size: 7px;
  opacity: 0.2;
`,ci=[{value:m.Brightness.Low,label:"Low",rays:4},{value:m.Brightness.Medium,label:"Medium",rays:6},{value:m.Brightness.High,label:"High",rays:8}],Wi=()=>{const t=f.useContext(T),[,i]=f.useState(0),[e,r]=f.useState(t.playerLeds.brightness),o=()=>i(n=>n+1),c=n=>{t.playerLeds.setLed(n,!t.playerLeds.getLed(n)),o()},l=n=>{r(n),t.playerLeds.setBrightness(n)};return s.jsxs(ti,{children:[s.jsx(ei,{children:[0,1,2,3,4].map(n=>{const u=t.playerLeds.getLed(n);return s.jsx(tn,{onClick:()=>c(n),title:`LED ${n+1}: ${u?"ON":"OFF"} — click to toggle`,children:s.jsx(ri,{$on:u})},n)})}),s.jsx(ni,{title:"LED brightness",children:ci.map(({value:n,label:u,rays:h})=>s.jsx(si,{onClick:()=>l(n),title:u,children:s.jsx(ii,{rays:h,active:e===n})},n))}),s.jsx(oi,{children:"Player LEDs"}),s.jsx(ai,{children:"click me"})]})},en=y.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`,rn=y.span`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.35;
`,St=14,nn=Math.PI/6,sn=.4,ot=1.8,Tr=2.8,Tt="#48aff0",Pt="#f29e02",De=({label:t,pressed:i,size:e,children:r})=>s.jsxs(en,{children:[s.jsx(ct,{width:(e+2)*St,height:(e+2)*St,children:s.jsx(at,{element:"svg",zoom:St,children:s.jsx(C,{rotate:{x:nn},stroke:0,children:s.jsx(C,{translate:{y:i?sn:0},stroke:0,children:r})})})}),s.jsx(rn,{children:t})]}),qi=()=>{const t=f.useContext(T),[i,e]=f.useState(t.create.state);f.useEffect(()=>{t.create.on("change",({state:u})=>e(u))},[]);const r=i?Pt:Tt,o=ot*.35,c=o*.65,l=ot*.22,n=.08;return s.jsxs(De,{label:"Create",pressed:i,size:ot,children:[s.jsx(O,{diameter:ot,stroke:.15,color:r}),s.jsx(C,{path:[{x:-l+n,y:0,z:-o},{x:-l-n,y:0,z:c}],stroke:.15,color:r}),s.jsx(C,{path:[{x:0,y:0,z:-o},{x:0,y:0,z:o}],stroke:.15,color:r}),s.jsx(C,{path:[{x:l-n,y:0,z:-o},{x:l+n,y:0,z:c}],stroke:.15,color:r})]})},Ni=()=>{const t=f.useContext(T),[i,e]=f.useState(t.options.state);f.useEffect(()=>{t.options.on("change",({state:n})=>e(n))},[]);const r=i?Pt:Tt,o=ot*.3,c=o*.7,l=ot*.24;return s.jsxs(De,{label:"Options",pressed:i,size:ot,children:[s.jsx(O,{diameter:ot,stroke:.15,color:r}),s.jsx(C,{path:[{x:-c,y:0,z:-l},{x:c,y:0,z:-l}],stroke:.15,color:r}),s.jsx(C,{path:[{x:-o,y:0,z:0},{x:o,y:0,z:0}],stroke:.15,color:r}),s.jsx(C,{path:[{x:-c,y:0,z:l},{x:c,y:0,z:l}],stroke:.15,color:r})]})},Ui=()=>{const t=f.useContext(T),[i,e]=f.useState(t.ps.state);f.useEffect(()=>{t.ps.on("change",({state:d})=>e(d))},[]);const r=i?Pt:Tt,o=i?Tt:r,c=.18,l=-.38,n=.42,u=.95,h=-.85,a=.05;return s.jsxs(De,{label:"PS",pressed:i,size:Tr,children:[s.jsx(O,{diameter:Tr,stroke:.25,color:r,fill:i}),s.jsx(C,{path:[{x:l,y:0,z:u},{x:l,y:0,z:h}],stroke:c,color:o}),s.jsx(C,{path:[{x:l,y:0,z:u},{arc:[{x:l+.65,y:0,z:u},{x:l+.65,y:0,z:(u+a)/2}]},{arc:[{x:l+.65,y:0,z:a},{x:l,y:0,z:a}]}],stroke:c,color:o,closed:!1}),s.jsx(C,{path:[{x:n+.22,y:0,z:a},{x:n-.22,y:0,z:a},{x:n-.22,y:0,z:(a+h)/2},{x:n+.22,y:0,z:(a+h)/2},{x:n+.22,y:0,z:h},{x:n-.22,y:0,z:h}],stroke:c,color:o,closed:!1})]})},Pr=2.4,_r=1,Xi=()=>{const t=f.useContext(T),[i,e]=f.useState(t.mute.state),[r,o]=f.useState(t.mute.status.state),[c,l]=f.useState(!1),n=f.useRef(c);n.current=c,f.useEffect(()=>{t.mute.on("change",({state:g})=>e(g)),t.mute.status.on("change",({state:g})=>{o(g),n.current&&(t.mute.setLed(g?m.MuteLedMode.On:m.MuteLedMode.Off),l(!1))})},[]);const u=()=>{c?(t.mute.setLed(t.mute.status.state?m.MuteLedMode.On:m.MuteLedMode.Off),l(!1)):(t.mute.setLed(m.MuteLedMode.Pulse),l(!0))},h=r||c||i?Pt:Tt,a=Pr/2,d=_r/2,p=d;return s.jsxs(en,{onClick:u,style:{cursor:"pointer"},children:[s.jsx(ct,{width:(Pr+2)*St,height:(_r+2)*St,style:{pointerEvents:"none"},children:s.jsx(at,{element:"svg",zoom:St,children:s.jsx(C,{rotate:{x:nn},stroke:0,children:s.jsx(C,{translate:{y:i?sn:0},stroke:0,children:s.jsx(C,{path:[{x:-a+p,y:0,z:-d},{x:a-p,y:0,z:-d},{arc:[{x:a,y:0,z:-d},{x:a,y:0,z:0}]},{arc:[{x:a,y:0,z:d},{x:a-p,y:0,z:d}]},{x:-a+p,y:0,z:d},{arc:[{x:-a,y:0,z:d},{x:-a,y:0,z:0}]},{arc:[{x:-a,y:0,z:-d},{x:-a+p,y:0,z:-d}]}],stroke:.15,color:h,fill:r||c,closed:!0})})})})}),s.jsx(rn,{children:r?c?"Pulsing":"Muted":"Mute"})]})};y.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;const hi=vn`
  0%, 100% { box-shadow: 0 0 0 0 rgba(242, 158, 2, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(242, 158, 2, 0); }
`;y.button`
  animation: ${hi} 2s ease-in-out infinite;
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
`;const ui=y.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;function li(t){switch(t){case m.ChargeStatus.Charging:return"Charging";case m.ChargeStatus.Full:return"Full";case m.ChargeStatus.Discharging:return"Battery";case m.ChargeStatus.AbnormalVoltage:return"Voltage Error";case m.ChargeStatus.AbnormalTemperature:return"Temp Error";case m.ChargeStatus.ChargingError:return"Error";default:return"Unknown"}}function di(t,i){return i===m.ChargeStatus.Charging||i===m.ChargeStatus.Full?"success":t<.2?"danger":t<.4?"warning":"primary"}const Yi=()=>{const t=j.useContext(T),[i,e]=j.useState(t.battery.level.state),[r,o]=j.useState(t.battery.status.state),[c,l]=j.useState(t.connection.state);if(j.useEffect(()=>{e(t.battery.level.state),o(t.battery.status.state),l(t.connection.state),t.battery.level.on("change",({state:a})=>e(a)),t.battery.status.on("change",({state:a})=>o(a)),t.connection.on("change",({state:a})=>l(a))},[t]),!c)return null;const n=Math.round(i*100),u=r===m.ChargeStatus.Charging||r===m.ChargeStatus.Full,h=s.jsxs("svg",{width:"18",height:"10",viewBox:"0 0 18 10",style:{display:"block"},children:[s.jsx("rect",{x:"0.5",y:"0.5",width:"14",height:"9",rx:"1.5",fill:"none",stroke:"currentColor",strokeWidth:"1"}),s.jsx("rect",{x:"15",y:"3",width:"2",height:"4",rx:"0.5",fill:"currentColor"}),s.jsx("rect",{x:"2",y:"2",width:Math.max(0,i*11),height:"6",rx:"0.5",fill:"currentColor",opacity:.6}),u&&s.jsx("path",{d:"M8 1.5 L6 5 L8.5 5 L7 8.5 L10 4.5 L7.5 4.5 L9 1.5Z",fill:"currentColor",opacity:.9})]});return s.jsx(ui,{children:s.jsxs(Mt,{$minimal:!0,$intent:di(i,r),children:[h," ",li(r),": ",n,"%"]})})},pi={"00":"#e8e8e8","01":"#1a1a2e","02":"#c8102e","03":"#f2a6c0","04":"#6b3fa0","05":"#5b9bd5","06":"#8a9a7b","07":"#9b2335","08":"#c0c0c0","09":"#1e3a5f",10:"#2db5a0",11:"#3d4f7c",12:"#e8dfd0",30:"#4a4a4a"},fi=y.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${t=>t.$color};
  border: 1px solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
`,Ki=()=>{const t=j.useContext(T),[i,e]=j.useState(t.factoryInfo),[r,o]=j.useState(t.connection.state);if(j.useEffect(()=>{o(t.connection.state),e(t.factoryInfo),t.on("change",n=>{n.factoryInfo&&e(n.factoryInfo)}),t.connection.on("change",({state:n})=>{o(n),n||e(void 0)})},[t]),!r||!i)return null;const c=pi[i.colorCode],l=i.colorName??i.colorCode;return s.jsxs(Mt,{$minimal:!0,title:`Controller color: ${l}${i.boardRevision?` (${i.boardRevision})`:""}`,children:[c&&s.jsx(fi,{$color:c})," ",l]})},xi=y.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  flex-wrap: wrap;
`,Ar=y.div`
  display: flex;
  align-items: center;
  gap: 10px;
`,gi=y.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 140px;
`,vi=y.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 200px;
`,$r=y.span`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.35;
`,lt=180,dt=28,_e="#48aff0",Ge=({label:t,value:i,onChange:e,min:r=0,max:o=1,step:c=.05,formatValue:l})=>{const n=f.useRef(null),u=f.useRef(!1),h=f.useCallback(x=>{const v=n.current;if(!v)return;const w=v.getBoundingClientRect(),k=x.clientX-w.left,R=Math.max(0,Math.min(1,k/w.width)),P=r+R*(o-r),S=Math.round(P/c)*c;e(Math.max(r,Math.min(o,S)))},[e,r,o,c]),a=f.useCallback(x=>{u.current=!0,h(x);const v=k=>{u.current&&h(k)},w=()=>{u.current=!1,window.removeEventListener("mousemove",v),window.removeEventListener("mouseup",w)};window.addEventListener("mousemove",v),window.addEventListener("mouseup",w)},[h]),d=(i-r)/(o-r),p=d*lt,g=l?l(i):i<=1?Math.round(i*100)+"%":String(i);return s.jsxs("svg",{ref:n,width:lt,height:dt,style:{cursor:"ew-resize",borderRadius:3,flex:"1 1 "+lt+"px",maxWidth:280},onMouseDown:a,children:[s.jsx("rect",{x:0,y:0,width:lt,height:dt,fill:"rgba(72, 175, 240, 0.08)",rx:3}),s.jsx("rect",{x:.5,y:.5,width:lt-1,height:dt-1,fill:"none",stroke:"rgba(72, 175, 240, 0.2)",strokeWidth:1,rx:3}),p>0&&s.jsx("rect",{x:1,y:1,width:Math.min(p,lt-2),height:dt-2,fill:_e,opacity:.15+d*.25,rx:2}),d>0&&s.jsx("line",{x1:p,y1:1,x2:p,y2:dt-1,stroke:_e,strokeWidth:1.5,opacity:.6}),s.jsx("text",{x:7,y:dt/2,dominantBaseline:"central",fill:"currentColor",fontSize:11,fontWeight:600,opacity:.5,children:t}),s.jsx("text",{x:lt-7,y:dt/2,dominantBaseline:"central",textAnchor:"end",fill:_e,fontSize:11,fontWeight:600,opacity:.7,children:g})]})},yi=y.button`
  background: ${t=>t.$active?"rgba(72, 175, 240, 0.2)":"rgba(72, 175, 240, 0.04)"};
  border: 1px solid ${t=>t.$active?"rgba(72, 175, 240, 0.5)":"rgba(72, 175, 240, 0.15)"};
  border-radius: 3px;
  color: ${t=>t.$active?"#48aff0":"rgba(72, 175, 240, 0.5)"};
  font-size: 11px;
  padding: 3px 10px;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { background: rgba(72, 175, 240, 0.15); color: #48aff0; }
`,Ae={[m.TriggerEffect.Off]:{effect:m.TriggerEffect.Off},[m.TriggerEffect.Feedback]:{effect:m.TriggerEffect.Feedback,position:.3,strength:.8},[m.TriggerEffect.Weapon]:{effect:m.TriggerEffect.Weapon,start:.15,end:.7,strength:.8},[m.TriggerEffect.Bow]:{effect:m.TriggerEffect.Bow,start:.1,end:.6,strength:.8,snapForce:.9},[m.TriggerEffect.Galloping]:{effect:m.TriggerEffect.Galloping,start:.1,end:.6,firstFoot:.3,secondFoot:.7,frequency:20},[m.TriggerEffect.Vibration]:{effect:m.TriggerEffect.Vibration,position:.1,amplitude:.7,frequency:40},[m.TriggerEffect.Machine]:{effect:m.TriggerEffect.Machine,start:.1,end:.9,amplitudeA:.5,amplitudeB:1,frequency:30,period:5}};function z({label:t,value:i,onChange:e}){return s.jsx(Ge,{label:t,value:i,onChange:e})}function $e({label:t,value:i,onChange:e}){return s.jsx(Ge,{label:t,value:i,onChange:e,min:1,max:255,step:1,formatValue:r=>String(Math.round(r))})}function mi({label:t,value:i,onChange:e}){return s.jsx(Ge,{label:t,value:i,onChange:e,min:0,max:20,step:1,formatValue:r=>String(Math.round(r))})}function bi({config:t,onChange:i}){switch(t.effect){case m.TriggerEffect.Off:return null;case m.TriggerEffect.Feedback:return s.jsxs(s.Fragment,{children:[s.jsx(z,{label:"Position",value:t.position,onChange:e=>i({...t,position:e})}),s.jsx(z,{label:"Strength",value:t.strength,onChange:e=>i({...t,strength:e})})]});case m.TriggerEffect.Weapon:return s.jsxs(s.Fragment,{children:[s.jsx(z,{label:"Start",value:t.start,onChange:e=>i({...t,start:e})}),s.jsx(z,{label:"End",value:t.end,onChange:e=>i({...t,end:e})}),s.jsx(z,{label:"Strength",value:t.strength,onChange:e=>i({...t,strength:e})})]});case m.TriggerEffect.Bow:return s.jsxs(s.Fragment,{children:[s.jsx(z,{label:"Start",value:t.start,onChange:e=>i({...t,start:e})}),s.jsx(z,{label:"End",value:t.end,onChange:e=>i({...t,end:e})}),s.jsx(z,{label:"Strength",value:t.strength,onChange:e=>i({...t,strength:e})}),s.jsx(z,{label:"Snap Force",value:t.snapForce,onChange:e=>i({...t,snapForce:e})})]});case m.TriggerEffect.Galloping:return s.jsxs(s.Fragment,{children:[s.jsx(z,{label:"Start",value:t.start,onChange:e=>i({...t,start:e})}),s.jsx(z,{label:"End",value:t.end,onChange:e=>i({...t,end:e})}),s.jsx(z,{label:"First Foot",value:t.firstFoot,onChange:e=>i({...t,firstFoot:e})}),s.jsx(z,{label:"Second Foot",value:t.secondFoot,onChange:e=>i({...t,secondFoot:e})}),s.jsx($e,{label:"Frequency",value:t.frequency,onChange:e=>i({...t,frequency:e})})]});case m.TriggerEffect.Vibration:return s.jsxs(s.Fragment,{children:[s.jsx(z,{label:"Position",value:t.position,onChange:e=>i({...t,position:e})}),s.jsx(z,{label:"Amplitude",value:t.amplitude,onChange:e=>i({...t,amplitude:e})}),s.jsx($e,{label:"Frequency",value:t.frequency,onChange:e=>i({...t,frequency:e})})]});case m.TriggerEffect.Machine:return s.jsxs(s.Fragment,{children:[s.jsx(z,{label:"Start",value:t.start,onChange:e=>i({...t,start:e})}),s.jsx(z,{label:"End",value:t.end,onChange:e=>i({...t,end:e})}),s.jsx(z,{label:"Amplitude A",value:t.amplitudeA,onChange:e=>i({...t,amplitudeA:e})}),s.jsx(z,{label:"Amplitude B",value:t.amplitudeB,onChange:e=>i({...t,amplitudeB:e})}),s.jsx($e,{label:"Frequency",value:t.frequency,onChange:e=>i({...t,frequency:e})}),s.jsx(mi,{label:"Period",value:t.period,onChange:e=>i({...t,period:e})})]})}}const wi=({controller:t})=>{const[i,e]=f.useState(m.TriggerEffect.Off),[r,o]=f.useState(Ae[m.TriggerEffect.Off]),[c,l]=f.useState("right"),n=f.useCallback(d=>{(c==="left"||c==="both")&&t.left.trigger.feedback.set(d),(c==="right"||c==="both")&&t.right.trigger.feedback.set(d)},[t,c]),u=f.useCallback(d=>{const p=d.target.value;e(p);const g={...Ae[p]};o(g),n(g)},[n]),h=f.useCallback(d=>{o(d),n(d)},[n]),a=i!==m.TriggerEffect.Off;return s.jsxs(xi,{children:[s.jsxs(gi,{children:[s.jsx($r,{children:"Effect"}),s.jsxs(Ar,{children:[s.jsxs(Wt,{value:i,onChange:u,style:{flex:"1 1 0",minWidth:0},children:[s.jsx("option",{value:m.TriggerEffect.Off,children:"Off"}),s.jsx("option",{value:m.TriggerEffect.Feedback,children:"Feedback"}),s.jsx("option",{value:m.TriggerEffect.Weapon,children:"Weapon"}),s.jsx("option",{value:m.TriggerEffect.Bow,children:"Bow"}),s.jsx("option",{value:m.TriggerEffect.Galloping,children:"Galloping"}),s.jsx("option",{value:m.TriggerEffect.Vibration,children:"Vibration"}),s.jsx("option",{value:m.TriggerEffect.Machine,children:"Machine"})]}),a&&s.jsx(Mt,{$intent:"warning",$minimal:!0,style:{flexShrink:0},children:"Active"})]}),s.jsx(Ar,{children:["left","right","both"].map(d=>s.jsx(yi,{$active:c===d,onClick:()=>l(d),children:d.charAt(0).toUpperCase()+d.slice(1)},d))}),a&&s.jsx(yn,{$small:!0,onClick:()=>{t.resetTriggerFeedback(),e(m.TriggerEffect.Off),o(Ae[m.TriggerEffect.Off])},style:{width:"100%"},children:"Reset"})]}),a&&s.jsxs(vi,{children:[s.jsx($r,{style:{width:"100%"},children:"Parameters"}),s.jsx(bi,{config:r,onChange:h})]})]})},Si=y.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`,ji=y.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  flex-wrap: wrap;
`,pt=y.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 140px;
`,Ci=y.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 200px;
`,Q=y.div`
  display: flex;
  align-items: center;
  gap: 10px;
`,V=y.span`
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
`,Le=y.button`
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
`,ft=180,xt=28,Oe="#48aff0",Ht=({label:t,value:i,onChange:e,min:r=0,max:o=1,step:c=.05,formatValue:l})=>{const n=f.useRef(null),u=f.useRef(!1),h=f.useCallback(x=>{const v=n.current;if(!v)return;const w=v.getBoundingClientRect(),k=x.clientX-w.left,R=Math.max(0,Math.min(1,k/w.width)),P=r+R*(o-r),S=Math.round(P/c)*c;e(Math.max(r,Math.min(o,S)))},[e,r,o,c]),a=f.useCallback(x=>{u.current=!0,h(x);const v=k=>{u.current&&h(k)},w=()=>{u.current=!1,window.removeEventListener("mousemove",v),window.removeEventListener("mouseup",w)};window.addEventListener("mousemove",v),window.addEventListener("mouseup",w)},[h]),d=(i-r)/(o-r),p=d*ft,g=l?l(i):Math.round(i*100)+"%";return s.jsxs("svg",{ref:n,width:ft,height:xt,style:{cursor:"ew-resize",borderRadius:3,flex:"1 1 "+ft+"px",maxWidth:280},onMouseDown:a,children:[s.jsx("rect",{x:0,y:0,width:ft,height:xt,fill:"rgba(72, 175, 240, 0.08)",rx:3}),s.jsx("rect",{x:.5,y:.5,width:ft-1,height:xt-1,fill:"none",stroke:"rgba(72, 175, 240, 0.2)",strokeWidth:1,rx:3}),p>0&&s.jsx("rect",{x:1,y:1,width:Math.min(p,ft-2),height:xt-2,fill:Oe,opacity:.15+d*.25,rx:2}),d>0&&s.jsx("line",{x1:p,y1:1,x2:p,y2:xt-1,stroke:Oe,strokeWidth:1.5,opacity:.6}),s.jsx("text",{x:7,y:xt/2,dominantBaseline:"central",fill:"currentColor",fontSize:11,fontWeight:600,opacity:.5,children:t}),s.jsx("text",{x:ft-7,y:xt/2,dominantBaseline:"central",textAnchor:"end",fill:Oe,fontSize:11,fontWeight:600,opacity:.7,children:g})]})},Ei=y.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 4px;
`,ki=y.button`
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
`,Rt=y.input`
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
`,zi=y.span`
  font-size: 9px;
  font-family: monospace;
  opacity: 0.35;
  text-align: center;
`,Ri=y.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`,Mi=y.pre`
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
`,Ti=({controller:t})=>{const[i,e]=f.useState(t.audio.speakerVolume),[r,o]=f.useState(t.audio.headphoneVolume),[c,l]=f.useState(t.audio.microphoneVolume),[n,u]=f.useState(t.audio.output),[h,a]=f.useState(t.audio.preampGain),[d,p]=f.useState(t.audio.beamForming),[g,x]=f.useState(t.audio.speakerMuted),[v,w]=f.useState(t.audio.headphoneMuted),[k,R]=f.useState(t.audio.microphoneMuted),P=f.useCallback(b=>{e(b),t.audio.setSpeakerVolume(b)},[t]),S=f.useCallback(b=>{o(b),t.audio.setHeadphoneVolume(b)},[t]),yt=f.useCallback(b=>{l(b),t.audio.setMicrophoneVolume(b)},[t]),$=f.useCallback(b=>{const E=Number(b.target.value);u(E),t.audio.setOutput(E)},[t]),G=f.useCallback(b=>{const E=Math.round(b);a(E),t.audio.setPreamp(E,d)},[t,d]),rt=f.useCallback(()=>{const b=!d;p(b),t.audio.setPreamp(h,b)},[t,h,d]),ve=f.useCallback(b=>{const E=b.target.value;E&&t.audio.setMicSelect(Number(E))},[t]),_=f.useCallback(b=>{t.audio.setMicMode(Number(b.target.value))},[t]),[I,M]=f.useState("speaker"),[A,B]=f.useState(!1),[_t,At]=f.useState(null),ye=f.useCallback(async b=>{At(null);try{A===b?(await t.stopTestTone(),B(!1)):(A&&await t.stopTestTone(),await t.startTestTone(I,b),B(b))}catch(E){At(E instanceof Error?E.message:"Failed to control tone"),B(!1)}},[t,A,I]),[me,on]=f.useState(!1),[nt,an]=f.useState(6),[st,cn]=f.useState(2),[$t,hn]=f.useState(Array(20).fill(0)),[q,un]=f.useState(3),[Ve,X]=f.useState(""),[He,We]=f.useState(!1),ln=(b,E)=>{hn(F=>{const Y=[...F];return Y[b]=E&255,Y})},be=b=>{const E=b.trim();return E.startsWith("0x")||E.startsWith("0X")?parseInt(E,16)&255:(parseInt(E,10)||0)&255},dn=async()=>{We(!0),X("");try{const b=new Uint8Array($t.slice(0,q));await t.hid.sendTestCommand(nt,st,b);const E=await t.hid.readTestResponse();if(E){const F=Array.from(E.slice(0,64)).map(Y=>Y.toString(16).padStart(2,"0")).join(" ");X(F)}else X("(no response)")}catch(b){X(`Error: ${b instanceof Error?b.message:String(b)}`)}We(!1)},[Lt,pn]=f.useState(1),[we,qe]=f.useState(!1),[fn,Ne]=f.useState(0),mt=f.useRef(null),Se=f.useCallback(()=>{mt.current&&(clearInterval(mt.current),mt.current=null),qe(!1);const b=new Uint8Array(q);b[1]=1,t.hid.sendTestCommand(nt,st,b).catch(()=>{})},[t,nt,st,q]),xn=f.useCallback(()=>{let b=0;qe(!0),Ne(0),X(""),mt.current=setInterval(async()=>{const E=new Uint8Array(q);if(E[1]=1,await t.hid.sendTestCommand(nt,st,E),b>255){Se(),X("Sweep complete (0–255)");return}const F=new Uint8Array(q);F[0]=1;for(let Y=1;Y<q;Y++)F[Y]=$t[Y];F[Lt]=b,Ne(b),X(`Sweeping byte[${Lt}] = ${b} (0x${b.toString(16).padStart(2,"0")})`),await t.hid.sendTestCommand(nt,st,F),b++},250)},[t,nt,st,$t,q,Lt,Se]);return f.useEffect(()=>()=>{mt.current&&clearInterval(mt.current)},[]),s.jsxs(Si,{children:[s.jsxs(ji,{children:[s.jsxs(pt,{children:[s.jsx(V,{children:"Output"}),s.jsxs(Wt,{value:n,onChange:$,style:{minWidth:0},children:[s.jsx("option",{value:m.AudioOutput.Headphone,children:"Headphone"}),s.jsx("option",{value:m.AudioOutput.HeadphoneMono,children:"Headphone (Mono)"}),s.jsx("option",{value:m.AudioOutput.Split,children:"Split (L→HP, R→Spk)"}),s.jsx("option",{value:m.AudioOutput.Speaker,children:"Speaker"})]}),s.jsxs(Q,{children:[s.jsx(Le,{$muted:g,onClick:()=>{t.audio.muteSpeaker(!g),x(!g)},children:g?"Spk Muted":"Spk"}),s.jsx(Le,{$muted:v,onClick:()=>{t.audio.muteHeadphone(!v),w(!v)},children:v?"HP Muted":"HP"}),s.jsx(Le,{$muted:k,onClick:()=>{t.audio.muteMicrophone(!k),R(!k)},children:k?"Mic Muted":"Mic"})]})]}),s.jsxs(pt,{children:[s.jsx(V,{children:"Microphone"}),s.jsxs(Q,{children:[s.jsxs(Wt,{onChange:ve,style:{minWidth:0},children:[s.jsx("option",{value:"",children:"Auto"}),s.jsx("option",{value:String(m.MicSelect.Internal),children:"Internal"}),s.jsx("option",{value:String(m.MicSelect.Headset),children:"Headset"})]}),s.jsxs(Wt,{onChange:_,style:{minWidth:0},children:[s.jsx("option",{value:String(m.MicMode.Default),children:"Default"}),s.jsx("option",{value:String(m.MicMode.Chat),children:"Chat"}),s.jsx("option",{value:String(m.MicMode.ASR),children:"ASR"})]})]}),s.jsxs(Q,{children:[s.jsx(Z,{$active:d,onClick:rt,children:"Beam Forming"}),d&&s.jsx(Mt,{$minimal:!0,$intent:"primary",children:"On"})]})]}),s.jsxs(pt,{children:[s.jsx(V,{children:"Test Tone"}),s.jsxs(Q,{children:[s.jsx(Z,{$active:I==="speaker",onClick:()=>M("speaker"),children:"Speaker"}),s.jsx(Z,{$active:I==="headphone",onClick:()=>M("headphone"),children:"Headphone"})]}),s.jsxs(Q,{children:[s.jsx(Z,{$active:A==="1khz",onClick:()=>ye("1khz"),children:A==="1khz"?"Stop":"1kHz"}),s.jsx(Z,{$active:A==="100hz",onClick:()=>ye("100hz"),children:A==="100hz"?"Stop":"~100Hz"}),s.jsx(Z,{$active:A==="both",onClick:()=>ye("both"),children:A==="both"?"Stop":"Both"}),_t&&s.jsx(Mt,{$minimal:!0,$intent:"danger",children:_t})]})]}),s.jsxs(Ci,{children:[s.jsx(V,{style:{width:"100%"},children:"Volume"}),s.jsx(Ht,{label:"Speaker",value:i,onChange:P}),s.jsx(Ht,{label:"Headphone",value:r,onChange:S}),s.jsx(Ht,{label:"Microphone",value:c,onChange:yt}),s.jsx(Ht,{label:"Preamp Gain",value:h,onChange:G,min:0,max:7,step:1,formatValue:b=>String(Math.round(b))})]})]}),s.jsxs(ki,{onClick:()=>on(!me),children:[me?"▾":"▸"," DSP Debug"]}),me&&s.jsxs(Ei,{children:[s.jsxs(Q,{children:[s.jsxs(pt,{style:{minWidth:0,gap:4},children:[s.jsx(V,{children:"Device ID"}),s.jsx(Rt,{value:nt,onChange:b=>an(be(b.target.value)),title:"Device ID (decimal or 0x hex)"})]}),s.jsxs(pt,{style:{minWidth:0,gap:4},children:[s.jsx(V,{children:"Action ID"}),s.jsx(Rt,{value:st,onChange:b=>cn(be(b.target.value)),title:"Action ID (decimal or 0x hex)"})]}),s.jsxs(pt,{style:{minWidth:0,gap:4},children:[s.jsx(V,{children:"Param Bytes"}),s.jsx(Rt,{value:q,onChange:b=>{const E=Math.max(0,Math.min(20,parseInt(b.target.value)||0));un(E)},title:"Number of parameter bytes to send (0–20)"})]})]}),s.jsxs(V,{children:["Params (report 0x80 → [",String(nt).padStart(2,"0"),", ",String(st).padStart(2,"0"),", ...])"]}),s.jsx(Q,{style:{flexWrap:"wrap",gap:4},children:Array.from({length:q},(b,E)=>s.jsxs(Ri,{children:[s.jsxs(zi,{children:["[",E,"]"]}),s.jsx(Rt,{value:$t[E],onChange:F=>ln(E,be(F.target.value)),title:`Param byte ${E} (decimal or 0x hex)`})]},E))}),s.jsxs(Q,{children:[s.jsx(Z,{$active:He,onClick:dn,children:He?"Sending...":"Send"}),s.jsx(Z,{$active:!1,onClick:async()=>{const b=await t.hid.readTestResponse();if(b){const E=Array.from(b.slice(0,64)).map(F=>F.toString(16).padStart(2,"0")).join(" ");X(E)}else X("(no response)")},children:"Read 0x81"})]}),s.jsx(V,{children:"Sweep (byte[0] locked to 1)"}),s.jsxs(Q,{children:[s.jsxs(pt,{style:{minWidth:0,gap:4},children:[s.jsx(V,{children:"Sweep Byte"}),s.jsx(Rt,{value:Lt,onChange:b=>pn(Math.max(1,Math.min(q-1,parseInt(b.target.value)||1))),title:"Which param byte to sweep (1–N)"})]}),s.jsx(Z,{$active:we,onClick:we?Se:xn,children:we?`Stop (${fn})`:"Sweep 0–255"})]}),Ve&&s.jsxs(s.Fragment,{children:[s.jsx(V,{children:"Response"}),s.jsx(Mi,{children:Ve})]})]})]})},Lr=y.pre`
  overflow: auto;
  word-break: normal !important;
  word-wrap: normal !important;
  white-space: pre !important;
  max-height: 200px;
  font-size: 11px;
`,Ji=({panel:t})=>{const i=f.useContext(T),[e,r]=f.useState(i.hid.state),[o,c]=f.useState(!1),[l,n]=f.useState(!1),[u,h]=f.useState(i.firmwareInfo),[a,d]=f.useState(i.factoryInfo);f.useEffect(()=>{i.on("change",x=>{r(x.hid.state),!u&&x.firmwareInfo&&h(x.firmwareInfo),!a&&x.factoryInfo&&d(x.factoryInfo)})},[]);let p="",g="";if(i.hid.provider.buffer){const x=i.hid.provider.buffer;p=`const report = Buffer.from([${new Uint8Array(x.buffer).join(", ")}])`,g=`${x.byteLength} bytes`}else p="Waiting for report...",g="unknown";return t==="triggers"?s.jsx(wi,{controller:i}):t==="audio"?s.jsx(Ti,{controller:i}):s.jsxs(s.Fragment,{children:[u&&s.jsxs(Ot,{children:[s.jsxs("p",{style:{fontSize:12,opacity:.7,margin:0},children:["Firmware: v",m.formatFirmwareVersion(u.mainFirmwareVersion)," · ","HW: ",u.hardwareInfo," · ","DSP: ",u.dspFirmwareVersion," · ","SBL: v",m.formatFirmwareVersion(u.sblFirmwareVersion)," · ","Built: ",u.buildDate," ",u.buildTime]}),a&&s.jsxs("p",{style:{fontSize:12,opacity:.7,margin:"4px 0 0"},children:["Color: ",a.colorName??a.colorCode," · ",a.boardRevision??"Unknown board"," · ","Serial: ",a.serialNumber]})]}),s.jsxs(Ot,{children:[s.jsx(Ue,{label:"Input State",checked:l,onChange:x=>n(x)}),s.jsx(Ue,{label:"Report Buffer",checked:o,onChange:x=>c(x)})]}),o&&s.jsxs(Ot,{children:[s.jsxs("p",{style:{fontSize:12,opacity:.7},children:["Buffer: ",g]}),s.jsx(Lr,{children:p})]}),l&&s.jsx(Ot,{children:s.jsx(Lr,{children:Object.entries(e).map(([x,v])=>`${x}: ${JSON.stringify(v)}`).join(`
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
`;export{Yi as B,qi as C,$i as D,Ai as F,Fi as G,Oi as L,Xi as M,Ni as O,Ui as P,Ii as R,Li as S,Bi as T,Ki as a,Hi as b,Ji as c,Di as d,Vi as e,Gi as f,Wi as g};
