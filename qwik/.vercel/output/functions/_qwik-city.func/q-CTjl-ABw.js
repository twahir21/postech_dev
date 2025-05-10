import{s as he,j as _,e as Ae,f as Fe,F as V,c as W,d as v,i as S,g as Re,u as Y,h as X,k as be,b as g,l as Te,m as ze,n as Oe,o as De,p as ve,q as D,r as Qe,t as H,w as k,x as Ge,S as Be,y as j,z as Me,A as we,B as Ve,C as de,D as We,E as Q}from"./q-INFc1i6r.js";/**
 * @license
 * @builder.io/qwik/server 1.13.0-dev+97aa67d
 * Copyright Builder.io, Inc. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/QwikDev/qwik/blob/main/LICENSE
 */var Ue=(n=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(n,{get:(e,t)=>(typeof require<"u"?require:e)[t]}):n)(function(n){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+n+'" is not supported')}),$e="<sync>";function ke(n,e){const t=e==null?void 0:e.mapper,o=n.symbolMapper?n.symbolMapper:(a,i,r)=>{var c;if(t){const m=J(a),l=t[m];if(!l){if(m===$e)return[m,""];if((c=globalThis.__qwik_reg_symbols)==null?void 0:c.has(m))return[a,"_"];if(r)return[a,`${r}?qrl=${a}`];console.error("Cannot resolve symbol",a,"in",t,r)}return l}};return{isServer:!0,async importSymbol(a,i,r){var f;const c=J(r),m=(f=globalThis.__qwik_reg_symbols)==null?void 0:f.get(c);if(m)return m;let l=String(i);l.endsWith(".js")||(l+=".js");const u=Ue(l);if(!(r in u))throw new Error(`Q-ERROR: missing symbol '${r}' in module '${l}'.`);return u[r]},raf:()=>(console.error("server can not rerender"),Promise.resolve()),nextTick:a=>new Promise(i=>{setTimeout(()=>{i(a())})}),chunkForSymbol(a,i,r){return o(a,t,r)}}}async function He(n,e){const t=ke(n,e);he(t)}var J=n=>{const e=n.lastIndexOf("_");return e>-1?n.slice(e+1):n},Ke="q:instance";function Je(n){if(n!=null&&n.mapping!=null&&typeof n.mapping=="object"&&n.symbols!=null&&typeof n.symbols=="object"&&n.bundles!=null&&typeof n.bundles=="object")return n}function Z(){let s=`const w=new Worker(URL.createObjectURL(new Blob(['onmessage=(e)=>{Promise.all(e.data.map(u=>fetch(u))).finally(()=>{setTimeout(postMessage({}),9999)})}'],{type:"text/javascript"})));`;return s+="w.postMessage(u.map(u=>new URL(u,origin)+''));",s+="w.onmessage=()=>{w.terminate()};",s}function Ze(n,e){const t={bundles:U(e).map(s=>s.split("/").pop())},o=JSON.stringify(["prefetch",n,...t.bundles]);return`document.dispatchEvent(new CustomEvent("qprefetch",{detail:${JSON.stringify(t)}}));
          (window.qwikPrefetchSW||(window.qwikPrefetchSW=[])).push(${o});`}function U(n){const e=[],t=o=>{if(Array.isArray(o))for(const s of o)e.includes(s.url)||(e.push(s.url),t(s.imports))};return t(n),e}function Ye(n){const e=new Map;let t=0;const o=(r,c)=>{if(Array.isArray(r))for(const m of r){const l=e.get(m.url)||0;e.set(m.url,l+1),t++,c.has(m.url)||(c.add(m.url),o(m.imports,c))}},s=new Set;for(const r of n)s.clear(),o(r.imports,s);const a=t/e.size*2,i=Array.from(e.entries());return i.sort((r,c)=>c[1]-r[1]),i.slice(0,5).filter(r=>r[1]>a).map(r=>r[0])}function Xe(n,e,t,o){const s=on(e==null?void 0:e.implementation),a=[];return s.prefetchEvent==="always"&&en(n,a,t,o),s.linkInsert==="html-append"&&nn(a,t,s),s.linkInsert==="js-append"?tn(a,t,s,o):s.workerFetchInsert==="always"&&sn(a,t,o),a.length>0?_(V,{children:a}):null}function en(n,e,t,o){const s=Ye(t);for(const a of s)e.push(_("link",{rel:"modulepreload",href:a,nonce:o}));e.push(_("script",{"q:type":"prefetch-bundles",dangerouslySetInnerHTML:Ze(n,t)+"document.dispatchEvent(new CustomEvent('qprefetch', {detail:{links: [location.pathname]}}))",nonce:o}))}function nn(n,e,t){const o=U(e),s=t.linkRel||"prefetch",a=t.linkFetchPriority;for(const i of o){const r={};r.href=i,r.rel=s,a&&(r.fetchpriority=a),(s==="prefetch"||s==="preload")&&i.endsWith(".js")&&(r.as="script"),n.push(_("link",r))}}function tn(n,e,t,o){const s=t.linkRel||"prefetch",a=t.linkFetchPriority;let i="";t.workerFetchInsert==="no-link-support"&&(i+="let supportsLinkRel = true;"),i+=`const u=${JSON.stringify(U(e))};`,i+="u.map((u,i)=>{",i+="const l=document.createElement('link');",i+='l.setAttribute("href",u);',i+=`l.setAttribute("rel","${s}");`,a&&(i+=`l.setAttribute("fetchpriority","${a}");`),t.workerFetchInsert==="no-link-support"&&(i+="if(i===0){",i+="try{",i+=`supportsLinkRel=l.relList.supports("${s}");`,i+="}catch(e){}",i+="}"),i+="document.body.appendChild(l);",i+="});",t.workerFetchInsert==="no-link-support"&&(i+="if(!supportsLinkRel){",i+=Z(),i+="}"),t.workerFetchInsert==="always"&&(i+=Z()),n.push(_("script",{type:"module","q:type":"link-js",dangerouslySetInnerHTML:i,nonce:o}))}function sn(n,e,t){let o=`const u=${JSON.stringify(U(e))};`;o+=Z(),n.push(_("script",{type:"module","q:type":"prefetch-worker",dangerouslySetInnerHTML:o,nonce:t}))}function on(n){return{...rn,...n}}var rn={linkInsert:null,linkRel:null,linkFetchPriority:null,workerFetchInsert:null,prefetchEvent:"always"};function K(){if(typeof performance>"u")return()=>0;const n=performance.now();return()=>(performance.now()-n)/1e6}function ge(n){let e=n.base;return typeof n.base=="function"&&(e=n.base(n)),typeof e=="string"?(e.endsWith("/")||(e+="/"),e):"/build/"}function an(n,e,t){if(!t)return[];const o=e.prefetchStrategy,s=ge(e);if(o!==null){if(!o||!o.symbolsToPrefetch||o.symbolsToPrefetch==="auto")return cn(n,t,s);if(typeof o.symbolsToPrefetch=="function")try{return o.symbolsToPrefetch({manifest:t.manifest})}catch(a){console.error("getPrefetchUrls, symbolsToPrefetch()",a)}}return[]}function cn(n,e,t){const o=[],s=n==null?void 0:n.qrls,{mapper:a,manifest:i}=e,r=new Map;if(Array.isArray(s))for(const c of s){const m=c.getHash(),l=a[m];if(l){const u=l[1];je(i,r,o,t,u)}}return o}function je(n,e,t,o,s){const a=o+s;let i=e.get(a);if(!i){i={url:a,imports:[]},e.set(a,i);const r=n.bundles[s];if(r&&Array.isArray(r.imports))for(const c of r.imports)je(n,e,i.imports,o,c)}t.push(i)}var ln='(()=>{var e=Object.defineProperty,t=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,r=Object.prototype.propertyIsEnumerable,n=(t,o,r)=>o in t?e(t,o,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[o]=r,s=(e,s)=>{for(var a in s||(s={}))o.call(s,a)&&n(e,a,s[a]);if(t)for(var a of t(s))r.call(s,a)&&n(e,a,s[a]);return e};((e,t)=>{const o="__q_context__",r=window,n=new Set,a=new Set([e]),i="replace",c="forEach",l="target",f="getAttribute",p="isConnected",b="qvisible",u="_qwikjson_",y=(e,t)=>Array.from(e.querySelectorAll(t)),h=e=>{const t=[];return a.forEach((o=>t.push(...y(o,e)))),t},d=e=>{S(e),y(e,"[q\\\\:shadowroot]").forEach((e=>{const t=e.shadowRoot;t&&d(t)}))},m=e=>e&&"function"==typeof e.then,w=(e,t,o=t.type)=>{h("[on"+e+"\\\\:"+o+"]")[c]((r=>g(r,e,t,o)))},q=t=>{if(void 0===t[u]){let o=(t===e.documentElement?e.body:t).lastElementChild;for(;o;){if("SCRIPT"===o.tagName&&"qwik/json"===o[f]("type")){t[u]=JSON.parse(o.textContent[i](/\\\\x3C(\\/?script)/gi,"<$1"));break}o=o.previousElementSibling}}},v=(e,t)=>new CustomEvent(e,{detail:t}),g=async(t,r,n,a=n.type)=>{const c="on"+r+":"+a;t.hasAttribute("preventdefault:"+a)&&n.preventDefault(),t.hasAttribute("stoppropagation:"+a)&&n.stopPropagation();const l=t._qc_,b=l&&l.li.filter((e=>e[0]===c));if(b&&b.length>0){for(const e of b){const o=e[1].getFn([t,n],(()=>t[p]))(n,t),r=n.cancelBubble;m(o)&&await o,r&&n.stopPropagation()}return}const u=t[f](c);if(u){const r=t.closest("[q\\\\:container]"),a=r[f]("q:base"),c=r[f]("q:version")||"unknown",l=r[f]("q:manifest-hash")||"dev",b=new URL(a,e.baseURI);for(const f of u.split("\\n")){const u=new URL(f,b),y=u.href,h=u.hash[i](/^#?([^?[|]*).*$/,"$1")||"default",d=performance.now();let w,v,g;const A=f.startsWith("#"),_={qBase:a,qManifest:l,qVersion:c,href:y,symbol:h,element:t,reqTime:d};if(A){const t=r.getAttribute("q:instance");w=(e["qFuncs_"+t]||[])[Number.parseInt(h)],w||(v="sync",g=Error("sync handler error for symbol: "+h))}else{const e=u.href.split("#")[0];try{const t=import(e);q(r),w=(await t)[h],w||(v="no-symbol",g=Error(`${h} not in ${e}`))}catch(e){v||(v="async"),g=e}}if(!w){E("qerror",s({importError:v,error:g},_)),console.error(g);break}const k=e[o];if(t[p])try{e[o]=[t,n,u],A||E("qsymbol",s({},_));const r=w(n,t);m(r)&&await r}catch(e){E("qerror",s({error:e},_))}finally{e[o]=k}}}},E=(t,o)=>{e.dispatchEvent(v(t,o))},A=e=>e[i](/([A-Z])/g,(e=>"-"+e.toLowerCase())),_=async e=>{let t=A(e.type),o=e[l];for(w("-document",e,t);o&&o[f];){const r=g(o,"",e,t);let n=e.cancelBubble;m(r)&&await r,n=n||e.cancelBubble||o.hasAttribute("stoppropagation:"+e.type),o=e.bubbles&&!0!==n?o.parentElement:null}},k=e=>{w("-window",e,A(e.type))},C=()=>{var o;const s=e.readyState;if(!t&&("interactive"==s||"complete"==s)&&(a.forEach(d),t=1,E("qinit"),(null!=(o=r.requestIdleCallback)?o:r.setTimeout).bind(r)((()=>E("qidle"))),n.has(b))){const e=h("[on\\\\:"+b+"]"),t=new IntersectionObserver((e=>{for(const o of e)o.isIntersecting&&(t.unobserve(o[l]),g(o[l],"",v(b,o)))}));e[c]((e=>t.observe(e)))}},O=(e,t,o,r=!1)=>e.addEventListener(t,o,{capture:r,passive:!1}),S=(...e)=>{for(const t of e)"string"==typeof t?n.has(t)||(a.forEach((e=>O(e,t,_,!0))),O(r,t,k,!0),n.add(t)):a.has(t)||(n.forEach((e=>O(t,e,_,!0))),a.add(t))};if(!(o in e)){e[o]=0;const t=r.qwikevents;Array.isArray(t)&&S(...t),r.qwikevents={events:n,roots:a,push:S},O(e,"readystatechange",C),C()}})(document)})()',un=`(() => {
    var __defProp = Object.defineProperty;
    var __getOwnPropSymbols = Object.getOwnPropertySymbols;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __propIsEnum = Object.prototype.propertyIsEnumerable;
    var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {
        enumerable: !0,
        configurable: !0,
        writable: !0,
        value: value
    }) : obj[key] = value;
    var __spreadValues = (a, b) => {
        for (var prop in b || (b = {})) {
            __hasOwnProp.call(b, prop) && __defNormalProp(a, prop, b[prop]);
        }
        if (__getOwnPropSymbols) {
            for (var prop of __getOwnPropSymbols(b)) {
                __propIsEnum.call(b, prop) && __defNormalProp(a, prop, b[prop]);
            }
        }
        return a;
    };
    ((doc, hasInitialized) => {
        const Q_CONTEXT = "__q_context__";
        const win = window;
        const events =  new Set;
        const roots =  new Set([ doc ]);
        const nativeQuerySelectorAll = (root, selector) => Array.from(root.querySelectorAll(selector));
        const querySelectorAll = query => {
            const elements = [];
            roots.forEach((root => elements.push(...nativeQuerySelectorAll(root, query))));
            return elements;
        };
        const findShadowRoots = fragment => {
            processEventOrNode(fragment);
            nativeQuerySelectorAll(fragment, "[q\\\\:shadowroot]").forEach((parent => {
                const shadowRoot = parent.shadowRoot;
                shadowRoot && findShadowRoots(shadowRoot);
            }));
        };
        const isPromise = promise => promise && "function" == typeof promise.then;
        const broadcast = (infix, ev, type = ev.type) => {
            querySelectorAll("[on" + infix + "\\\\:" + type + "]").forEach((el => dispatch(el, infix, ev, type)));
        };
        const resolveContainer = containerEl => {
            if (void 0 === containerEl._qwikjson_) {
                let script = (containerEl === doc.documentElement ? doc.body : containerEl).lastElementChild;
                while (script) {
                    if ("SCRIPT" === script.tagName && "qwik/json" === script.getAttribute("type")) {
                        containerEl._qwikjson_ = JSON.parse(script.textContent.replace(/\\\\x3C(\\/?script)/gi, "<$1"));
                        break;
                    }
                    script = script.previousElementSibling;
                }
            }
        };
        const createEvent = (eventName, detail) => new CustomEvent(eventName, {
            detail: detail
        });
        const dispatch = async (element, onPrefix, ev, eventName = ev.type) => {
            const attrName = "on" + onPrefix + ":" + eventName;
            element.hasAttribute("preventdefault:" + eventName) && ev.preventDefault();
            element.hasAttribute("stoppropagation:" + eventName) && ev.stopPropagation();
            const ctx = element._qc_;
            const relevantListeners = ctx && ctx.li.filter((li => li[0] === attrName));
            if (relevantListeners && relevantListeners.length > 0) {
                for (const listener of relevantListeners) {
                    const results = listener[1].getFn([ element, ev ], (() => element.isConnected))(ev, element);
                    const cancelBubble = ev.cancelBubble;
                    isPromise(results) && await results;
                    cancelBubble && ev.stopPropagation();
                }
                return;
            }
            const attrValue = element.getAttribute(attrName);
            if (attrValue) {
                const container = element.closest("[q\\\\:container]");
                const qBase = container.getAttribute("q:base");
                const qVersion = container.getAttribute("q:version") || "unknown";
                const qManifest = container.getAttribute("q:manifest-hash") || "dev";
                const base = new URL(qBase, doc.baseURI);
                for (const qrl of attrValue.split("\\n")) {
                    const url = new URL(qrl, base);
                    const href = url.href;
                    const symbol = url.hash.replace(/^#?([^?[|]*).*$/, "$1") || "default";
                    const reqTime = performance.now();
                    let handler;
                    let importError;
                    let error;
                    const isSync = qrl.startsWith("#");
                    const eventData = {
                        qBase: qBase,
                        qManifest: qManifest,
                        qVersion: qVersion,
                        href: href,
                        symbol: symbol,
                        element: element,
                        reqTime: reqTime
                    };
                    if (isSync) {
                        const hash = container.getAttribute("q:instance");
                        handler = (doc["qFuncs_" + hash] || [])[Number.parseInt(symbol)];
                        if (!handler) {
                            importError = "sync";
                            error = new Error("sync handler error for symbol: " + symbol);
                        }
                    } else {
                        const uri = url.href.split("#")[0];
                        try {
                            const module = import(
                                                        uri);
                            resolveContainer(container);
                            handler = (await module)[symbol];
                            if (!handler) {
                                importError = "no-symbol";
                                error = new Error(\`\${symbol} not in \${uri}\`);
                            }
                        } catch (err) {
                            importError || (importError = "async");
                            error = err;
                        }
                    }
                    if (!handler) {
                        emitEvent("qerror", __spreadValues({
                            importError: importError,
                            error: error
                        }, eventData));
                        console.error(error);
                        break;
                    }
                    const previousCtx = doc[Q_CONTEXT];
                    if (element.isConnected) {
                        try {
                            doc[Q_CONTEXT] = [ element, ev, url ];
                            isSync || emitEvent("qsymbol", __spreadValues({}, eventData));
                            const results = handler(ev, element);
                            isPromise(results) && await results;
                        } catch (error2) {
                            emitEvent("qerror", __spreadValues({
                                error: error2
                            }, eventData));
                        } finally {
                            doc[Q_CONTEXT] = previousCtx;
                        }
                    }
                }
            }
        };
        const emitEvent = (eventName, detail) => {
            doc.dispatchEvent(createEvent(eventName, detail));
        };
        const camelToKebab = str => str.replace(/([A-Z])/g, (a => "-" + a.toLowerCase()));
        const processDocumentEvent = async ev => {
            let type = camelToKebab(ev.type);
            let element = ev.target;
            broadcast("-document", ev, type);
            while (element && element.getAttribute) {
                const results = dispatch(element, "", ev, type);
                let cancelBubble = ev.cancelBubble;
                isPromise(results) && await results;
                cancelBubble = cancelBubble || ev.cancelBubble || element.hasAttribute("stoppropagation:" + ev.type);
                element = ev.bubbles && !0 !== cancelBubble ? element.parentElement : null;
            }
        };
        const processWindowEvent = ev => {
            broadcast("-window", ev, camelToKebab(ev.type));
        };
        const processReadyStateChange = () => {
            var _a;
            const readyState = doc.readyState;
            if (!hasInitialized && ("interactive" == readyState || "complete" == readyState)) {
                roots.forEach(findShadowRoots);
                hasInitialized = 1;
                emitEvent("qinit");
                (null != (_a = win.requestIdleCallback) ? _a : win.setTimeout).bind(win)((() => emitEvent("qidle")));
                if (events.has("qvisible")) {
                    const results = querySelectorAll("[on\\\\:qvisible]");
                    const observer = new IntersectionObserver((entries => {
                        for (const entry of entries) {
                            if (entry.isIntersecting) {
                                observer.unobserve(entry.target);
                                dispatch(entry.target, "", createEvent("qvisible", entry));
                            }
                        }
                    }));
                    results.forEach((el => observer.observe(el)));
                }
            }
        };
        const addEventListener = (el, eventName, handler, capture = !1) => el.addEventListener(eventName, handler, {
            capture: capture,
            passive: !1
        });
        const processEventOrNode = (...eventNames) => {
            for (const eventNameOrNode of eventNames) {
                if ("string" == typeof eventNameOrNode) {
                    if (!events.has(eventNameOrNode)) {
                        roots.forEach((root => addEventListener(root, eventNameOrNode, processDocumentEvent, !0)));
                        addEventListener(win, eventNameOrNode, processWindowEvent, !0);
                        events.add(eventNameOrNode);
                    }
                } else if (!roots.has(eventNameOrNode)) {
                    events.forEach((eventName => addEventListener(eventNameOrNode, eventName, processDocumentEvent, !0)));
                    roots.add(eventNameOrNode);
                }
            }
        };
        if (!(Q_CONTEXT in doc)) {
            doc[Q_CONTEXT] = 0;
            const qwikevents = win.qwikevents;
            Array.isArray(qwikevents) && processEventOrNode(...qwikevents);
            win.qwikevents = {
                events: events,
                roots: roots,
                push: processEventOrNode
            };
            addEventListener(doc, "readystatechange", processReadyStateChange);
            processReadyStateChange();
        }
    })(document);
})()`;function pe(n={}){return n.debug?un:ln}var mn="<!DOCTYPE html>";async function dn(n,e){var O,w,te;let t=e.stream,o=0,s=0,a=0,i=0,r="",c;const m=((O=e.streaming)==null?void 0:O.inOrder)??{strategy:"auto",maximunInitialChunk:5e4,maximunChunk:3e4},l=e.containerTagName??"html",u=e.containerAttributes??{},f=t,x=K(),y=ge(e),d=xe(e.manifest);function A(){r&&(f.write(r),r="",o=0,a++,a===1&&(i=x()))}function E(p){const h=p.length;o+=h,s+=h,r+=p}switch(m.strategy){case"disabled":t={write:E};break;case"direct":t=f;break;case"auto":let p=0,h=!1;const se=m.maximunChunk??0,$=m.maximunInitialChunk??0;t={write(I){I==="<!--qkssr-f-->"?h||(h=!0):I==="<!--qkssr-pu-->"?p++:I==="<!--qkssr-po-->"?p--:E(I),p===0&&(h||o>=(a===0?$:se))&&(h=!1,A())}};break}l==="html"?t.write(mn):(t.write("<!--cq-->"),e.qwikLoader?(e.qwikLoader.include===void 0&&(e.qwikLoader.include="never"),e.qwikLoader.position===void 0&&(e.qwikLoader.position="bottom")):e.qwikLoader={include:"never"},e.qwikPrefetchServiceWorker||(e.qwikPrefetchServiceWorker={}),e.qwikPrefetchServiceWorker.include||(e.qwikPrefetchServiceWorker.include=!1),e.qwikPrefetchServiceWorker.position||(e.qwikPrefetchServiceWorker.position="top")),e.manifest||console.warn("Missing client manifest, loading symbols in the client might 404. Please ensure the client build has run and generated the manifest for the server build."),await He(e,d);const P=d==null?void 0:d.manifest.injections,q=P?P.map(p=>_(p.tag,p.attributes??{})):[],L=((w=e.qwikLoader)==null?void 0:w.include)??"auto";if((((te=e.qwikLoader)==null?void 0:te.position)??"bottom")==="top"&&L!=="never"){const p=pe({debug:e.debug});q.push(_("script",{id:"qwikloader",dangerouslySetInnerHTML:p})),q.push(_("script",{dangerouslySetInnerHTML:"window.qwikevents.push('click')"}))}const ee=K(),R=[];let T=0,z=0;await Ae(n,{stream:t,containerTagName:l,containerAttributes:u,serverData:e.serverData,base:y,beforeContent:q,beforeClose:async(p,h,se,$)=>{var ie,ae,ce,le,ue;T=ee();const I=K();c=await Fe(p,h,void 0,$);const C=[];if(e.prefetchStrategy!==null){const b=an(c,e,d),Pe=u["q:base"];if(b.length>0){const me=Xe(Pe,e.prefetchStrategy,b,(ie=e.serverData)==null?void 0:ie.nonce);me&&C.push(me)}}const Ne=JSON.stringify(c.state,void 0,void 0);if(C.push(_("script",{type:"qwik/json",dangerouslySetInnerHTML:fn(Ne),nonce:(ae=e.serverData)==null?void 0:ae.nonce})),c.funcs.length>0){const b=u[Ke];C.push(_("script",{"q:func":"qwik/json",dangerouslySetInnerHTML:qn(b,c.funcs),nonce:(ce=e.serverData)==null?void 0:ce.nonce}))}const Ie=!c||c.mode!=="static",oe=L==="always"||L==="auto"&&Ie;if(oe){const b=pe({debug:e.debug});C.push(_("script",{id:"qwikloader",dangerouslySetInnerHTML:b,nonce:(le=e.serverData)==null?void 0:le.nonce}))}const re=Array.from(h.$events$,b=>JSON.stringify(b));if(re.length>0){const b=(oe?"window.qwikevents":"(window.qwikevents||=[])")+`.push(${re.join(", ")})`;C.push(_("script",{dangerouslySetInnerHTML:b,nonce:(ue=e.serverData)==null?void 0:ue.nonce}))}return _n(R,p),z=I(),_(V,{children:C})},manifestHash:(d==null?void 0:d.manifest.manifestHash)||"dev"+pn()}),l!=="html"&&t.write("<!--/cq-->"),A();const N=c.resources.some(p=>p._cache!==1/0);return{prefetchResources:void 0,snapshotResult:c,flushes:a,manifest:d==null?void 0:d.manifest,size:s,isStatic:!N,timing:{render:T,snapshot:z,firstFlush:i},_symbols:R}}function pn(){return Math.random().toString(36).slice(2)}function xe(n){if(n){if("mapper"in n)return n;if(n=Je(n),n){const e={};return Object.entries(n.mapping).forEach(([t,o])=>{e[J(t)]=[t,o]}),{mapper:e,manifest:n}}}}var fn=n=>n.replace(/<(\/?script)/gi,"\\x3C$1");function _n(n,e){var t;for(const o of e){const s=(t=o.$componentQrl$)==null?void 0:t.getSymbol();s&&!n.includes(s)&&n.push(s)}}var yn='document["qFuncs_HASH"]=';function qn(n,e){return yn.replace("HASH",n)+`[${e.join(`,
`)}]`}async function Kn(n){const e=ke({},xe(n));he(e)}const hn={manifestHash:"vt8lmu",symbols:{s_Ysfvd0zsHZc:{origin:"../node_modules/@builder.io/qwik-city/lib/index.qwik.mjs",displayName:"index.qwik.mjs_QwikCityProvider_component_useTask",canonicalFilename:"index.qwik.mjs_QwikCityProvider_component_useTask_Ysfvd0zsHZc",hash:"Ysfvd0zsHZc",ctxKind:"function",ctxName:"useTask$",captures:!0,parent:"s_p1yCGpFL1xE",loc:[28951,38327]},s_26Zk9LevwR4:{origin:"../node_modules/@builder.io/qwik-city/lib/index.qwik.mjs",displayName:"index.qwik.mjs_usePreventNavigateQrl_useVisibleTask",canonicalFilename:"index.qwik.mjs_usePreventNavigateQrl_useVisibleTask_26Zk9LevwR4",hash:"26Zk9LevwR4",ctxKind:"function",ctxName:"useVisibleTask$",captures:!0,loc:[22698,22726]},s_0vphQYqOdZI:{origin:"components/router-head/router-head.tsx",displayName:"router-head.tsx_RouterHead_component",canonicalFilename:"router-head.tsx_RouterHead_component_0vphQYqOdZI",hash:"0vphQYqOdZI",ctxKind:"function",ctxName:"component$",captures:!1,loc:[243,1201]},s_1raneLGffO8:{origin:"../node_modules/@builder.io/qwik-city/lib/index.qwik.mjs",displayName:"index.qwik.mjs_Link_component",canonicalFilename:"index.qwik.mjs_Link_component_1raneLGffO8",hash:"1raneLGffO8",ctxKind:"function",ctxName:"component$",captures:!1,loc:[39807,42097]},s_B0lqk5IDDy4:{origin:"routes/index.tsx",displayName:"index.tsx_routes_component",canonicalFilename:"index.tsx_routes_component_B0lqk5IDDy4",hash:"B0lqk5IDDy4",ctxKind:"function",ctxName:"component$",captures:!1,loc:[134,311]},s_MiPVFWJLcMo:{origin:"../node_modules/@builder.io/qwik-city/lib/index.qwik.mjs",displayName:"index.qwik.mjs_QwikCityMockProvider_component",canonicalFilename:"index.qwik.mjs_QwikCityMockProvider_component_MiPVFWJLcMo",hash:"MiPVFWJLcMo",ctxKind:"function",ctxName:"component$",captures:!1,loc:[38575,39780]},s_ScE8eseirUA:{origin:"../node_modules/@builder.io/qwik-city/lib/index.qwik.mjs",displayName:"index.qwik.mjs_RouterOutlet_component",canonicalFilename:"index.qwik.mjs_RouterOutlet_component_ScE8eseirUA",hash:"ScE8eseirUA",ctxKind:"function",ctxName:"component$",captures:!1,loc:[7044,8198]},s_VKFlAWJuVm8:{origin:"routes/layout.tsx",displayName:"layout.tsx_layout_component",canonicalFilename:"layout.tsx_layout_component_VKFlAWJuVm8",hash:"VKFlAWJuVm8",ctxKind:"function",ctxName:"component$",captures:!1,loc:[582,610]},s_bmV0oH7tsks:{origin:"../node_modules/@builder.io/qwik-city/lib/index.qwik.mjs",displayName:"index.qwik.mjs_ErrorBoundary_component",canonicalFilename:"index.qwik.mjs_ErrorBoundary_component_bmV0oH7tsks",hash:"bmV0oH7tsks",ctxKind:"function",ctxName:"component$",captures:!1,loc:[57458,57772]},s_p1yCGpFL1xE:{origin:"../node_modules/@builder.io/qwik-city/lib/index.qwik.mjs",displayName:"index.qwik.mjs_QwikCityProvider_component",canonicalFilename:"index.qwik.mjs_QwikCityProvider_component_p1yCGpFL1xE",hash:"p1yCGpFL1xE",ctxKind:"function",ctxName:"component$",captures:!1,loc:[24134,38373]},s_pWsmcogutG8:{origin:"../node_modules/@builder.io/qwik-city/lib/index.qwik.mjs",displayName:"index.qwik.mjs_GetForm_component",canonicalFilename:"index.qwik.mjs_GetForm_component_pWsmcogutG8",hash:"pWsmcogutG8",ctxKind:"function",ctxName:"component$",captures:!1,loc:[59098,60251]},s_tntnak2DhJ8:{origin:"root.tsx",displayName:"root.tsx_root_component",canonicalFilename:"root.tsx_root_component_tntnak2DhJ8",hash:"tntnak2DhJ8",ctxKind:"function",ctxName:"component$",captures:!1,loc:[310,943]},s_K4gvalEGCME:{origin:"../node_modules/@builder.io/qwik-city/lib/index.qwik.mjs",displayName:"index.qwik.mjs_QwikCityProvider_component_useStyles",canonicalFilename:"index.qwik.mjs_QwikCityProvider_component_useStyles_K4gvalEGCME",hash:"K4gvalEGCME",ctxKind:"function",ctxName:"useStyles$",captures:!1,parent:"s_p1yCGpFL1xE",loc:[24160,24194]},s_9KRx0IOCHt8:{origin:"../node_modules/@builder.io/qwik-city/lib/index.qwik.mjs",displayName:"index.qwik.mjs_spaInit_event",canonicalFilename:"index.qwik.mjs_spaInit_event_9KRx0IOCHt8",hash:"9KRx0IOCHt8",ctxKind:"function",ctxName:"event$",captures:!1,loc:[1346,7009]},s_A5SCimyrjAE:{origin:"../node_modules/@builder.io/qwik-city/lib/index.qwik.mjs",displayName:"index.qwik.mjs_Form_form_onSubmit",canonicalFilename:"index.qwik.mjs_Form_form_onSubmit_A5SCimyrjAE",hash:"A5SCimyrjAE",ctxKind:"function",ctxName:"$",captures:!0,loc:[58229,58343]},s_N26RLdG0oBg:{origin:"../node_modules/@builder.io/qwik-city/lib/index.qwik.mjs",displayName:"index.qwik.mjs_routeActionQrl_action_submit",canonicalFilename:"index.qwik.mjs_routeActionQrl_action_submit_N26RLdG0oBg",hash:"N26RLdG0oBg",ctxKind:"function",ctxName:"$",captures:!0,loc:[44800,46445]},s_WfTOxT4IrdA:{origin:"../node_modules/@builder.io/qwik-city/lib/index.qwik.mjs",displayName:"index.qwik.mjs_serverQrl_rpc",canonicalFilename:"index.qwik.mjs_serverQrl_rpc_WfTOxT4IrdA",hash:"WfTOxT4IrdA",ctxKind:"function",ctxName:"$",captures:!0,loc:[52878,55950]},s_FdQ8zERN4uM:{origin:"../node_modules/@builder.io/qwik-city/lib/index.qwik.mjs",displayName:"index.qwik.mjs_Link_component_handleClick",canonicalFilename:"index.qwik.mjs_Link_component_handleClick_FdQ8zERN4uM",hash:"FdQ8zERN4uM",ctxKind:"function",ctxName:"$",captures:!0,parent:"s_1raneLGffO8",loc:[41118,41544]},s_PmWjL2RrvZM:{origin:"../node_modules/@builder.io/qwik-city/lib/index.qwik.mjs",displayName:"index.qwik.mjs_QwikCityMockProvider_component_goto",canonicalFilename:"index.qwik.mjs_QwikCityMockProvider_component_goto_PmWjL2RrvZM",hash:"PmWjL2RrvZM",ctxKind:"function",ctxName:"$",captures:!1,parent:"s_MiPVFWJLcMo",loc:[38965,39043]},s_US0pTyQnOdc:{origin:"../node_modules/@builder.io/qwik-city/lib/index.qwik.mjs",displayName:"index.qwik.mjs_ErrorBoundary_component_useOnWindow",canonicalFilename:"index.qwik.mjs_ErrorBoundary_component_useOnWindow_US0pTyQnOdc",hash:"US0pTyQnOdc",ctxKind:"function",ctxName:"$",captures:!0,parent:"s_bmV0oH7tsks",loc:[57534,57581]},s_aww2BzpANGM:{origin:"../node_modules/@builder.io/qwik-city/lib/index.qwik.mjs",displayName:"index.qwik.mjs_QwikCityProvider_component_goto",canonicalFilename:"index.qwik.mjs_QwikCityProvider_component_goto_aww2BzpANGM",hash:"aww2BzpANGM",ctxKind:"function",ctxName:"$",captures:!0,parent:"s_p1yCGpFL1xE",loc:[26348,28422]},s_qGVD1Sz413o:{origin:"../node_modules/@builder.io/qwik-city/lib/index.qwik.mjs",displayName:"index.qwik.mjs_QwikCityProvider_component_registerPreventNav",canonicalFilename:"index.qwik.mjs_QwikCityProvider_component_registerPreventNav_qGVD1Sz413o",hash:"qGVD1Sz413o",ctxKind:"function",ctxName:"$",captures:!1,parent:"s_p1yCGpFL1xE",loc:[25451,26328]},s_xe8duyQ5aaU:{origin:"../node_modules/@builder.io/qwik-city/lib/index.qwik.mjs",displayName:"index.qwik.mjs_GetForm_component_form_onSubmit_1",canonicalFilename:"index.qwik.mjs_GetForm_component_form_onSubmit_1_xe8duyQ5aaU",hash:"xe8duyQ5aaU",ctxKind:"function",ctxName:"$",captures:!1,parent:"s_pWsmcogutG8",loc:[59853,60189]},s_zPJUEsxZLIA:{origin:"../node_modules/@builder.io/qwik-city/lib/index.qwik.mjs",displayName:"index.qwik.mjs_Link_component_handlePrefetch",canonicalFilename:"index.qwik.mjs_Link_component_handlePrefetch_zPJUEsxZLIA",hash:"zPJUEsxZLIA",ctxKind:"function",ctxName:"$",captures:!1,parent:"s_1raneLGffO8",loc:[40519,40868]},s_zpHcJzYZ88E:{origin:"../node_modules/@builder.io/qwik-city/lib/index.qwik.mjs",displayName:"index.qwik.mjs_GetForm_component_form_onSubmit",canonicalFilename:"index.qwik.mjs_GetForm_component_form_onSubmit_zpHcJzYZ88E",hash:"zpHcJzYZ88E",ctxKind:"function",ctxName:"$",captures:!0,parent:"s_pWsmcogutG8",loc:[59462,59842]}},mapping:{s_Ysfvd0zsHZc:"q-Bo7dAV0X.js",s_26Zk9LevwR4:"q-Bdpt8t5K.js",s_0vphQYqOdZI:"q-CyTaJsmd.js",s_1raneLGffO8:"q-B_YW69T0.js",s_B0lqk5IDDy4:"q-0h_sAcyT.js",s_MiPVFWJLcMo:"q-CIHZrzNr.js",s_ScE8eseirUA:"q-DfzGSy_T.js",s_VKFlAWJuVm8:"q-oRgKsCoe.js",s_bmV0oH7tsks:"q-bENsiZWe.js",s_p1yCGpFL1xE:"q-BRp5UGwa.js",s_pWsmcogutG8:"q-DdhWxLNM.js",s_tntnak2DhJ8:"q-jfCBAWJ3.js",s_K4gvalEGCME:"q-DLQXr_Uc.js",s_9KRx0IOCHt8:"q-BRBr7aun.js",s_A5SCimyrjAE:"q-Irah5Ve6.js",s_N26RLdG0oBg:"q-DHvTM6J4.js",s_WfTOxT4IrdA:"q-B5oPos0Z.js",s_FdQ8zERN4uM:"q-BznRI4Nw.js",s_PmWjL2RrvZM:"q-D0qVe7v-.js",s_US0pTyQnOdc:"q-D07pYJA8.js",s_aww2BzpANGM:"q-lt_Ct5P6.js",s_qGVD1Sz413o:"q-BVLPUf7g.js",s_xe8duyQ5aaU:"q-DM1gTTpz.js",s_zPJUEsxZLIA:"q-BPQmOhVA.js",s_zpHcJzYZ88E:"q-Csgg1ELg.js"},bundles:{"../service-worker.js":{size:2808,hasSymbols:!1,origins:["node_modules/@builder.io/qwik-city/lib/service-worker.mjs","src/routes/service-worker.ts"]},"q-0h_sAcyT.js":{size:270,hasSymbols:!0,imports:["q-C0fFbg-x.js"],origins:["src/routes/index.tsx_routes_component_B0lqk5IDDy4.js"],symbols:["s_B0lqk5IDDy4"]},"q-B5oPos0Z.js":{size:1341,hasSymbols:!0,imports:["q-C0fFbg-x.js","q-CScvGLep.js","q-uemlvruI.js"],origins:["node_modules/@builder.io/qwik-city/lib/index.qwik.mjs_serverQrl_rpc_WfTOxT4IrdA.js"],symbols:["s_WfTOxT4IrdA"]},"q-B_YW69T0.js":{size:962,hasSymbols:!0,imports:["q-C0fFbg-x.js","q-CScvGLep.js","q-uemlvruI.js"],dynamicImports:["q-BPQmOhVA.js","q-BznRI4Nw.js"],origins:["node_modules/@builder.io/qwik-city/lib/index.qwik.mjs_Link_component_1raneLGffO8.js"],symbols:["s_1raneLGffO8"]},"q-Bdpt8t5K.js":{size:150,hasSymbols:!0,imports:["q-C0fFbg-x.js"],origins:["node_modules/@builder.io/qwik-city/lib/index.qwik.mjs_usePreventNavigateQrl_useVisibleTask_26Zk9LevwR4.js"],symbols:["s_26Zk9LevwR4"]},"q-bENsiZWe.js":{size:339,hasSymbols:!0,imports:["q-C0fFbg-x.js","q-uemlvruI.js"],dynamicImports:["q-D07pYJA8.js"],origins:["node_modules/@builder.io/qwik-city/lib/index.qwik.mjs_ErrorBoundary_component_bmV0oH7tsks.js"],symbols:["s_bmV0oH7tsks"]},"q-Bo7dAV0X.js":{size:3662,hasSymbols:!0,imports:["q-C0fFbg-x.js","q-CScvGLep.js","q-d_x8HemV.js","q-uemlvruI.js"],origins:["node_modules/@builder.io/qwik-city/lib/index.qwik.mjs_QwikCityProvider_component_useTask_Ysfvd0zsHZc.js"],symbols:["s_Ysfvd0zsHZc"]},"q-BPQmOhVA.js":{size:338,hasSymbols:!0,imports:["q-C0fFbg-x.js","q-CScvGLep.js","q-uemlvruI.js"],origins:["node_modules/@builder.io/qwik-city/lib/index.qwik.mjs_Link_component_handlePrefetch_zPJUEsxZLIA.js"],symbols:["s_zPJUEsxZLIA"]},"q-BPVU32eL.js":{size:171,hasSymbols:!1,imports:["q-C0fFbg-x.js","q-uemlvruI.js"],dynamicImports:["q-jfCBAWJ3.js"],origins:["src/global.css","src/root.tsx"]},"q-BRBr7aun.js":{size:2297,hasSymbols:!0,origins:["node_modules/@builder.io/qwik-city/lib/index.qwik.mjs_spaInit_event_9KRx0IOCHt8.js"],symbols:["s_9KRx0IOCHt8"]},"q-BRp5UGwa.js":{size:1251,hasSymbols:!0,imports:["q-C0fFbg-x.js","q-CScvGLep.js","q-uemlvruI.js"],dynamicImports:["q-Bo7dAV0X.js","q-BVLPUf7g.js","q-DLQXr_Uc.js","q-lt_Ct5P6.js"],origins:["node_modules/@builder.io/qwik-city/lib/index.qwik.mjs_QwikCityProvider_component_p1yCGpFL1xE.js"],symbols:["s_p1yCGpFL1xE"]},"q-BVLPUf7g.js":{size:549,hasSymbols:!0,imports:["q-C0fFbg-x.js","q-CScvGLep.js","q-uemlvruI.js"],origins:["node_modules/@builder.io/qwik-city/lib/index.qwik.mjs_QwikCityProvider_component_registerPreventNav_qGVD1Sz413o.js"],symbols:["s_qGVD1Sz413o"]},"q-BznRI4Nw.js":{size:375,hasSymbols:!0,imports:["q-C0fFbg-x.js"],origins:["node_modules/@builder.io/qwik-city/lib/index.qwik.mjs_Link_component_handleClick_FdQ8zERN4uM.js"],symbols:["s_FdQ8zERN4uM"]},"q-C0fFbg-x.js":{size:65845,hasSymbols:!1,origins:["@builder.io/qwik/build","node_modules/@builder.io/qwik/dist/core.prod.mjs"]},"q-CIHZrzNr.js":{size:619,hasSymbols:!0,imports:["q-C0fFbg-x.js","q-CScvGLep.js","q-uemlvruI.js"],dynamicImports:["q-D0qVe7v-.js"],origins:["node_modules/@builder.io/qwik-city/lib/index.qwik.mjs_QwikCityMockProvider_component_MiPVFWJLcMo.js"],symbols:["s_MiPVFWJLcMo"]},"q-CQU5gBM3.js":{size:269,hasSymbols:!1,imports:["q-C0fFbg-x.js","q-uemlvruI.js"],dynamicImports:["q-0h_sAcyT.js"],origins:["src/routes/index.tsx"]},"q-CScvGLep.js":{size:7858,hasSymbols:!1,imports:["q-C0fFbg-x.js","q-uemlvruI.js"],dynamicImports:["q-BRBr7aun.js","q-BRp5UGwa.js","q-DfzGSy_T.js"],origins:["@qwik-city-sw-register","node_modules/@builder.io/qwik-city/lib/index.qwik.mjs"]},"q-Csgg1ELg.js":{size:293,hasSymbols:!0,imports:["q-C0fFbg-x.js"],origins:["node_modules/@builder.io/qwik-city/lib/index.qwik.mjs_GetForm_component_form_onSubmit_zpHcJzYZ88E.js"],symbols:["s_zpHcJzYZ88E"]},"q-CyTaJsmd.js":{size:903,hasSymbols:!0,imports:["q-C0fFbg-x.js","q-CScvGLep.js","q-uemlvruI.js"],origins:["src/components/router-head/router-head.tsx_RouterHead_component_0vphQYqOdZI.js"],symbols:["s_0vphQYqOdZI"]},"q-D07pYJA8.js":{size:158,hasSymbols:!0,imports:["q-C0fFbg-x.js"],origins:["node_modules/@builder.io/qwik-city/lib/index.qwik.mjs_ErrorBoundary_component_useOnWindow_US0pTyQnOdc.js"],symbols:["s_US0pTyQnOdc"]},"q-D0qVe7v-.js":{size:148,hasSymbols:!0,imports:["q-C0fFbg-x.js"],origins:["node_modules/@builder.io/qwik-city/lib/index.qwik.mjs_QwikCityMockProvider_component_goto_PmWjL2RrvZM.js"],symbols:["s_PmWjL2RrvZM"]},"q-d_x8HemV.js":{size:184,hasSymbols:!1,imports:["q-uemlvruI.js"],dynamicImports:["q-CQU5gBM3.js","q-DpUfZdPe.js"],origins:["@qwik-city-plan"]},"q-DdhWxLNM.js":{size:751,hasSymbols:!0,imports:["q-C0fFbg-x.js","q-CScvGLep.js","q-uemlvruI.js"],dynamicImports:["q-Csgg1ELg.js","q-DM1gTTpz.js"],origins:["node_modules/@builder.io/qwik-city/lib/index.qwik.mjs_GetForm_component_pWsmcogutG8.js"],symbols:["s_pWsmcogutG8"]},"q-DfzGSy_T.js":{size:1001,hasSymbols:!0,imports:["q-C0fFbg-x.js","q-CScvGLep.js","q-uemlvruI.js"],origins:["node_modules/@builder.io/qwik-city/lib/index.qwik.mjs_RouterOutlet_component_ScE8eseirUA.js"],symbols:["s_ScE8eseirUA"]},"q-DHvTM6J4.js":{size:811,hasSymbols:!0,imports:["q-C0fFbg-x.js"],origins:["node_modules/@builder.io/qwik-city/lib/index.qwik.mjs_routeActionQrl_action_submit_N26RLdG0oBg.js"],symbols:["s_N26RLdG0oBg"]},"q-DLQXr_Uc.js":{size:71,hasSymbols:!0,origins:["node_modules/@builder.io/qwik-city/lib/index.qwik.mjs_QwikCityProvider_component_useStyles_K4gvalEGCME.js"],symbols:["s_K4gvalEGCME"]},"q-DM1gTTpz.js":{size:254,hasSymbols:!0,imports:["q-C0fFbg-x.js"],origins:["node_modules/@builder.io/qwik-city/lib/index.qwik.mjs_GetForm_component_form_onSubmit_1_xe8duyQ5aaU.js"],symbols:["s_xe8duyQ5aaU"]},"q-DpUfZdPe.js":{size:274,hasSymbols:!1,imports:["q-C0fFbg-x.js","q-uemlvruI.js"],dynamicImports:["q-oRgKsCoe.js"],origins:["src/routes/layout.tsx"]},"q-FY-lGNUR.js":{size:125,hasSymbols:!1,imports:["q-uemlvruI.js"],dynamicImports:["../service-worker.js"],origins:["@qwik-city-entries"]},"q-Irah5Ve6.js":{size:170,hasSymbols:!0,imports:["q-C0fFbg-x.js"],origins:["node_modules/@builder.io/qwik-city/lib/index.qwik.mjs_Form_form_onSubmit_A5SCimyrjAE.js"],symbols:["s_A5SCimyrjAE"]},"q-jfCBAWJ3.js":{size:522,hasSymbols:!0,imports:["q-C0fFbg-x.js","q-CScvGLep.js","q-uemlvruI.js"],dynamicImports:["q-CyTaJsmd.js"],origins:["src/components/router-head/router-head.tsx","src/root.tsx_root_component_tntnak2DhJ8.js"],symbols:["s_tntnak2DhJ8"]},"q-lt_Ct5P6.js":{size:1226,hasSymbols:!0,imports:["q-C0fFbg-x.js","q-CScvGLep.js","q-d_x8HemV.js","q-uemlvruI.js"],origins:["node_modules/@builder.io/qwik-city/lib/index.qwik.mjs_QwikCityProvider_component_goto_aww2BzpANGM.js"],symbols:["s_aww2BzpANGM"]},"q-oRgKsCoe.js":{size:102,hasSymbols:!0,imports:["q-C0fFbg-x.js"],origins:["src/routes/layout.tsx_layout_component_VKFlAWJuVm8.js"],symbols:["s_VKFlAWJuVm8"]},"q-uemlvruI.js":{size:1077,hasSymbols:!1}},injections:[],version:"1",options:{target:"client",buildMode:"production",entryStrategy:{type:"smart"}},platform:{qwik:"1.13.0-dev+97aa67d",vite:"",rollup:"4.40.0",env:"node",os:"linux",node:"23.8.0"}},bn='((i,r,a,o)=>{a=e=>{const t=document.querySelector("[q\\\\:base]");t&&r.active&&r.active.postMessage({type:"qprefetch",base:t.getAttribute("q:base"),...e})},document.addEventListener("qprefetch",e=>{const t=e.detail;r?a(t):i.push(t)}),"serviceWorker"in navigator?navigator.serviceWorker.register("/service-worker.js").then(e=>{o=()=>{r=e,i.forEach(a),a({bundles:i})},e.installing?e.installing.addEventListener("statechange",t=>{t.target.state=="activated"&&o()}):e.active&&o()}).catch(e=>console.error(e)):console.log("Service worker not supported in this browser.")})([])',vn=j("qc-s"),wn=j("qc-c"),Se=j("qc-ic"),Ce=j("qc-h"),Ee=j("qc-l"),kn=j("qc-n"),gn=j("qc-a"),jn=j("qc-ir"),xn=j("qc-p"),Sn=ze(Me("s_9KRx0IOCHt8")),Cn=()=>{if(!X("containerAttributes"))throw new Error("PrefetchServiceWorker component must be rendered on the server.");be();const e=Y(Se);if(e.value&&e.value.length>0){const t=e.value.length;let o=null;for(let s=t-1;s>=0;s--)e.value[s].default&&(o=g(e.value[s].default,{children:o},1,"ni_0"));return g(V,{children:[o,v("script",{"document:onQCInit$":Sn,"document:onQInit$":Te(()=>{((s,a)=>{var i;if(!s._qcs&&a.scrollRestoration==="manual"){s._qcs=!0;const r=(i=a.state)==null?void 0:i._qCityScroll;r&&s.scrollTo(r.x,r.y),document.dispatchEvent(new Event("qcinit"))}})(window,history)},'()=>{((w,h)=>{if(!w._qcs&&h.scrollRestoration==="manual"){w._qcs=true;const s=h.state?._qCityScroll;if(s){w.scrollTo(s.x,s.y);}document.dispatchEvent(new Event("qcinit"));}})(window,history);}')},null,null,2,"ni_1")]},1,"ni_2")}return Oe},En=W(S(Cn,"s_ScE8eseirUA")),Ln=(n,e)=>new URL(n,e.href),fe=(n,e)=>n.origin===e.origin,_e=n=>n.endsWith("/")?n:n+"/",Nn=({pathname:n},{pathname:e})=>{const t=Math.abs(n.length-e.length);return t===0?n===e:t===1&&_e(n)===_e(e)},In=(n,e)=>n.search===e.search,M=(n,e)=>In(n,e)&&Nn(n,e),Pn=n=>n&&typeof n.then=="function",An=(n,e,t,o)=>{const s=Le(),i={head:s,withLocale:r=>de(o,r),resolveValue:r=>{const c=r.__id;if(r.__brand==="server_loader"&&!(c in n.loaders))throw new Error("You can not get the returned data of a loader that has not been executed for this request.");const m=n.loaders[c];if(Pn(m))throw new Error("Loaders returning a promise can not be resolved for the head function.");return m},...e};for(let r=t.length-1;r>=0;r--){const c=t[r]&&t[r].head;c&&(typeof c=="function"?ye(s,de(o,()=>c(i))):typeof c=="object"&&ye(s,c))}return i.head},ye=(n,e)=>{typeof e.title=="string"&&(n.title=e.title),G(n.meta,e.meta),G(n.links,e.links),G(n.styles,e.styles),G(n.scripts,e.scripts),Object.assign(n.frontmatter,e.frontmatter)},G=(n,e)=>{if(Array.isArray(e))for(const t of e){if(typeof t.key=="string"){const o=n.findIndex(s=>s.key===t.key);if(o>-1){n[o]=t;continue}}n.push(t)}},Le=()=>({title:"",meta:[],links:[],styles:[],scripts:[],frontmatter:{}}),Fn=()=>Y(Ce),Rn=()=>Y(Ee),Tn=()=>ve(X("qwikcity")),qe={},B={navCount:0},zn=":root{view-transition-name:none}",On=n=>{},Dn=async(n,e)=>{const[t,o,s,a]=we(),{type:i="link",forceReload:r=n===void 0,replaceState:c=!1,scroll:m=!0}=typeof e=="object"?e:{forceReload:e};B.navCount++;const l=s.value.dest,u=n===void 0?l:typeof n=="number"?n:Ln(n,a.url);if(qe.$cbs$&&(r||typeof u=="number"||!M(u,l)||!fe(u,l))){const f=B.navCount,x=await Promise.all([...qe.$cbs$.values()].map(y=>y(u)));if(f!==B.navCount||x.some(Boolean)){f===B.navCount&&i==="popstate"&&history.pushState(null,"",l);return}}if(typeof u!="number"&&fe(u,l)&&!(!r&&M(u,l)))return s.value={type:i,dest:u,forceReload:r,replaceState:c,scroll:m},t.value=void 0,a.isNavigating=!0,new Promise(f=>{o.r=f})},Qn=({track:n})=>{const[e,t,o,s,a,i,r,c,m,l,u]=we();async function f(){const[y,d]=n(()=>[l.value,e.value]),A=Ve(""),E=u.url,P=d?"form":y.type;y.replaceState;let q,L,F=null;if(q=new URL(y.dest,u.url),F=a.loadedRoute,L=a.response,F){const[ee,R,T,z]=F,N=T,ne=N[N.length-1],O=P==="form"&&!M(q,E);y.dest.search&&!O&&(q.search=y.dest.search),M(q,E)||(u.prevUrl=E),u.url=q,u.params={...R},l.untrackedValue={type:P,dest:q};const w=An(L,u,N,A);t.headings=ne.headings,t.menu=z,o.value=ve(N),s.links=w.links,s.meta=w.meta,s.styles=w.styles,s.scripts=w.scripts,s.title=w.title,s.frontmatter=w.frontmatter}}return f()},Gn=n=>{De(S(zn,"s_K4gvalEGCME"));const e=Tn();if(!(e!=null&&e.params))throw new Error("Missing Qwik City Env Data for help visit https://github.com/QwikDev/qwik/issues/6237");const t=X("url");if(!t)throw new Error("Missing Qwik URL Env Data");const o=new URL(t),s=D({url:o,params:e.params,isNavigating:!1,prevUrl:void 0},{deep:!1}),a={},i=Qe(D(e.response.loaders,{deep:!1})),r=H({type:"initial",dest:o,forceReload:!1,replaceState:!1,scroll:!0}),c=D(Le),m=D({headings:void 0,menu:void 0}),l=H(),u=e.response.action,f=u?e.response.loaders[u]:void 0,x=H(f?{id:u,data:e.response.formData,output:{result:f,status:e.response.status}}:void 0),y=S(On,"s_qGVD1Sz413o"),d=S(Dn,"s_aww2BzpANGM",[x,a,r,s]);return k(wn,m),k(Se,l),k(Ce,c),k(Ee,s),k(kn,d),k(vn,i),k(gn,x),k(jn,r),k(xn,y),Ge(S(Qn,"s_Ysfvd0zsHZc",[x,m,l,c,e,d,i,a,n,r,s])),g(Be,null,3,"ni_3")},Bn=W(S(Gn,"s_p1yCGpFL1xE")),Mn=n=>v("script",{nonce:Re(n,"nonce")},{dangerouslySetInnerHTML:bn},null,3,"ni_7"),Vn=()=>{const n=Fn(),e=Rn();return g(V,{children:[v("title",null,null,n.title,1,null),v("link",null,{rel:"canonical",href:We(t=>t.url.href,[e],"p0.url.href")},null,3,null),v("meta",null,{name:"viewport",content:"width=device-width, initial-scale=1.0"},null,3,null),v("link",null,{rel:"icon",type:"image/svg+xml",href:"/favicon.svg"},null,3,null),n.meta.map(t=>Q("meta",{...t},null,0,t.key)),n.links.map(t=>Q("link",{...t},null,0,t.key)),n.styles.map(t=>{var o;return Q("style",{...t.props,...(o=t.props)!=null&&o.dangerouslySetInnerHTML?{}:{dangerouslySetInnerHTML:t.style}},null,0,t.key)}),n.scripts.map(t=>{var o;return Q("script",{...t.props,...(o=t.props)!=null&&o.dangerouslySetInnerHTML?{}:{dangerouslySetInnerHTML:t.script}},null,0,t.key)})]},1,"0D_0")},Wn=W(S(Vn,"s_0vphQYqOdZI")),Un=()=>(be(),g(Bn,{children:[v("head",null,null,[v("meta",null,{charset:"utf-8"},null,3,null),v("link",null,{rel:"manifest",href:"/manifest.json"},null,3,"vp_0"),g(Wn,null,3,"vp_1")],1,null),v("body",null,{lang:"en"},[g(En,null,3,"vp_2"),g(Mn,null,3,"vp_3")],1,null)]},1,"vp_4")),$n=W(S(Un,"s_tntnak2DhJ8"));function Jn(n){return dn(g($n,null,3,"Qb_0"),{manifest:hn,...n,containerAttributes:{lang:"en-us",...n.containerAttributes},serverData:{...n.serverData}})}export{hn as m,Jn as r,Kn as s};
