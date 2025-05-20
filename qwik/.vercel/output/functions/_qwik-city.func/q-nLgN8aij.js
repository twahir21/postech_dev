import{y as p,z as ue,A as K,B as fe,F as L,b as Y,i as Z,C as pe,o as de,e as g,h as y,j as me,D as k,s as he,R as ve,E as ye,Q as be}from"./q-WKclwch2.js";/**
 * @license
 * @builder.io/qwik/server 1.13.0-dev+97aa67d
 * Copyright Builder.io, Inc. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/QwikDev/qwik/blob/main/LICENSE
 */var we=(n=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(n,{get:(e,t)=>(typeof require<"u"?require:e)[t]}):n)(function(n){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+n+'" is not supported')}),ge="<sync>";function G(n,e){const t=e==null?void 0:e.mapper,r=n.symbolMapper?n.symbolMapper:(i,s,a)=>{var l;if(t){const c=A(i),u=t[c];if(!u){if(c===ge)return[c,""];if((l=globalThis.__qwik_reg_symbols)==null?void 0:l.has(c))return[i,"_"];if(a)return[i,`${a}?qrl=${i}`];console.error("Cannot resolve symbol",i,"in",t,a)}return u}};return{isServer:!0,async importSymbol(i,s,a){var q;const l=A(a),c=(q=globalThis.__qwik_reg_symbols)==null?void 0:q.get(l);if(c)return c;let u=String(s);u.endsWith(".js")||(u+=".js");const v=we(u);if(!(a in v))throw new Error(`Q-ERROR: missing symbol '${a}' in module '${u}'.`);return v[a]},raf:()=>(console.error("server can not rerender"),Promise.resolve()),nextTick:i=>new Promise(s=>{setTimeout(()=>{s(i())})}),chunkForSymbol(i,s,a){return r(i,t,a)}}}async function qe(n,e){const t=G(n,e);K(t)}var A=n=>{const e=n.lastIndexOf("_");return e>-1?n.slice(e+1):n},ke="q:instance";function _e(n){if(n!=null&&n.mapping!=null&&typeof n.mapping=="object"&&n.symbols!=null&&typeof n.symbols=="object"&&n.bundles!=null&&typeof n.bundles=="object")return n}function T(){let o=`const w=new Worker(URL.createObjectURL(new Blob(['onmessage=(e)=>{Promise.all(e.data.map(u=>fetch(u))).finally(()=>{setTimeout(postMessage({}),9999)})}'],{type:"text/javascript"})));`;return o+="w.postMessage(u.map(u=>new URL(u,origin)+''));",o+="w.onmessage=()=>{w.terminate()};",o}function Ee(n,e){const t={bundles:_(e).map(o=>o.split("/").pop())},r=JSON.stringify(["prefetch",n,...t.bundles]);return`document.dispatchEvent(new CustomEvent("qprefetch",{detail:${JSON.stringify(t)}}));
          (window.qwikPrefetchSW||(window.qwikPrefetchSW=[])).push(${r});`}function _(n){const e=[],t=r=>{if(Array.isArray(r))for(const o of r)e.includes(o.url)||(e.push(o.url),t(o.imports))};return t(n),e}function Se(n){const e=new Map;let t=0;const r=(a,l)=>{if(Array.isArray(a))for(const c of a){const u=e.get(c.url)||0;e.set(c.url,u+1),t++,l.has(c.url)||(l.add(c.url),r(c.imports,l))}},o=new Set;for(const a of n)o.clear(),r(a.imports,o);const i=t/e.size*2,s=Array.from(e.entries());return s.sort((a,l)=>l[1]-a[1]),s.slice(0,5).filter(a=>a[1]>i).map(a=>a[0])}function Pe(n,e,t,r){const o=Ne(e==null?void 0:e.implementation),i=[];return o.prefetchEvent==="always"&&Oe(n,i,t,r),o.linkInsert==="html-append"&&Ae(i,t,o),o.linkInsert==="js-append"?Te(i,t,o,r):o.workerFetchInsert==="always"&&Le(i,t,r),i.length>0?p(L,{children:i}):null}function Oe(n,e,t,r){const o=Se(t);for(const i of o)e.push(p("link",{rel:"modulepreload",href:i,nonce:r}));e.push(p("script",{"q:type":"prefetch-bundles",dangerouslySetInnerHTML:Ee(n,t)+"document.dispatchEvent(new CustomEvent('qprefetch', {detail:{links: [location.pathname]}}))",nonce:r}))}function Ae(n,e,t){const r=_(e),o=t.linkRel||"prefetch",i=t.linkFetchPriority;for(const s of r){const a={};a.href=s,a.rel=o,i&&(a.fetchpriority=i),(o==="prefetch"||o==="preload")&&s.endsWith(".js")&&(a.as="script"),n.push(p("link",a))}}function Te(n,e,t,r){const o=t.linkRel||"prefetch",i=t.linkFetchPriority;let s="";t.workerFetchInsert==="no-link-support"&&(s+="let supportsLinkRel = true;"),s+=`const u=${JSON.stringify(_(e))};`,s+="u.map((u,i)=>{",s+="const l=document.createElement('link');",s+='l.setAttribute("href",u);',s+=`l.setAttribute("rel","${o}");`,i&&(s+=`l.setAttribute("fetchpriority","${i}");`),t.workerFetchInsert==="no-link-support"&&(s+="if(i===0){",s+="try{",s+=`supportsLinkRel=l.relList.supports("${o}");`,s+="}catch(e){}",s+="}"),s+="document.body.appendChild(l);",s+="});",t.workerFetchInsert==="no-link-support"&&(s+="if(!supportsLinkRel){",s+=T(),s+="}"),t.workerFetchInsert==="always"&&(s+=T()),n.push(p("script",{type:"module","q:type":"link-js",dangerouslySetInnerHTML:s,nonce:r}))}function Le(n,e,t){let r=`const u=${JSON.stringify(_(e))};`;r+=T(),n.push(p("script",{type:"module","q:type":"prefetch-worker",dangerouslySetInnerHTML:r,nonce:t}))}function Ne(n){return{...Ie,...n}}var Ie={linkInsert:null,linkRel:null,linkFetchPriority:null,workerFetchInsert:null,prefetchEvent:"always"};function O(){if(typeof performance>"u")return()=>0;const n=performance.now();return()=>(performance.now()-n)/1e6}function ee(n){let e=n.base;return typeof n.base=="function"&&(e=n.base(n)),typeof e=="string"?(e.endsWith("/")||(e+="/"),e):"/build/"}function Ce(n,e,t){if(!t)return[];const r=e.prefetchStrategy,o=ee(e);if(r!==null){if(!r||!r.symbolsToPrefetch||r.symbolsToPrefetch==="auto")return Re(n,t,o);if(typeof r.symbolsToPrefetch=="function")try{return r.symbolsToPrefetch({manifest:t.manifest})}catch(i){console.error("getPrefetchUrls, symbolsToPrefetch()",i)}}return[]}function Re(n,e,t){const r=[],o=n==null?void 0:n.qrls,{mapper:i,manifest:s}=e,a=new Map;if(Array.isArray(o))for(const l of o){const c=l.getHash(),u=i[c];if(u){const v=u[1];ne(s,a,r,t,v)}}return r}function ne(n,e,t,r,o){const i=r+o;let s=e.get(i);if(!s){s={url:i,imports:[]},e.set(i,s);const a=n.bundles[o];if(a&&Array.isArray(a.imports))for(const l of a.imports)ne(n,e,s.imports,r,l)}t.push(s)}var je='(()=>{var e=Object.defineProperty,t=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,r=Object.prototype.propertyIsEnumerable,n=(t,o,r)=>o in t?e(t,o,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[o]=r,s=(e,s)=>{for(var a in s||(s={}))o.call(s,a)&&n(e,a,s[a]);if(t)for(var a of t(s))r.call(s,a)&&n(e,a,s[a]);return e};((e,t)=>{const o="__q_context__",r=window,n=new Set,a=new Set([e]),i="replace",c="forEach",l="target",f="getAttribute",p="isConnected",b="qvisible",u="_qwikjson_",y=(e,t)=>Array.from(e.querySelectorAll(t)),h=e=>{const t=[];return a.forEach((o=>t.push(...y(o,e)))),t},d=e=>{S(e),y(e,"[q\\\\:shadowroot]").forEach((e=>{const t=e.shadowRoot;t&&d(t)}))},m=e=>e&&"function"==typeof e.then,w=(e,t,o=t.type)=>{h("[on"+e+"\\\\:"+o+"]")[c]((r=>g(r,e,t,o)))},q=t=>{if(void 0===t[u]){let o=(t===e.documentElement?e.body:t).lastElementChild;for(;o;){if("SCRIPT"===o.tagName&&"qwik/json"===o[f]("type")){t[u]=JSON.parse(o.textContent[i](/\\\\x3C(\\/?script)/gi,"<$1"));break}o=o.previousElementSibling}}},v=(e,t)=>new CustomEvent(e,{detail:t}),g=async(t,r,n,a=n.type)=>{const c="on"+r+":"+a;t.hasAttribute("preventdefault:"+a)&&n.preventDefault(),t.hasAttribute("stoppropagation:"+a)&&n.stopPropagation();const l=t._qc_,b=l&&l.li.filter((e=>e[0]===c));if(b&&b.length>0){for(const e of b){const o=e[1].getFn([t,n],(()=>t[p]))(n,t),r=n.cancelBubble;m(o)&&await o,r&&n.stopPropagation()}return}const u=t[f](c);if(u){const r=t.closest("[q\\\\:container]"),a=r[f]("q:base"),c=r[f]("q:version")||"unknown",l=r[f]("q:manifest-hash")||"dev",b=new URL(a,e.baseURI);for(const f of u.split("\\n")){const u=new URL(f,b),y=u.href,h=u.hash[i](/^#?([^?[|]*).*$/,"$1")||"default",d=performance.now();let w,v,g;const A=f.startsWith("#"),_={qBase:a,qManifest:l,qVersion:c,href:y,symbol:h,element:t,reqTime:d};if(A){const t=r.getAttribute("q:instance");w=(e["qFuncs_"+t]||[])[Number.parseInt(h)],w||(v="sync",g=Error("sync handler error for symbol: "+h))}else{const e=u.href.split("#")[0];try{const t=import(e);q(r),w=(await t)[h],w||(v="no-symbol",g=Error(`${h} not in ${e}`))}catch(e){v||(v="async"),g=e}}if(!w){E("qerror",s({importError:v,error:g},_)),console.error(g);break}const k=e[o];if(t[p])try{e[o]=[t,n,u],A||E("qsymbol",s({},_));const r=w(n,t);m(r)&&await r}catch(e){E("qerror",s({error:e},_))}finally{e[o]=k}}}},E=(t,o)=>{e.dispatchEvent(v(t,o))},A=e=>e[i](/([A-Z])/g,(e=>"-"+e.toLowerCase())),_=async e=>{let t=A(e.type),o=e[l];for(w("-document",e,t);o&&o[f];){const r=g(o,"",e,t);let n=e.cancelBubble;m(r)&&await r,n=n||e.cancelBubble||o.hasAttribute("stoppropagation:"+e.type),o=e.bubbles&&!0!==n?o.parentElement:null}},k=e=>{w("-window",e,A(e.type))},C=()=>{var o;const s=e.readyState;if(!t&&("interactive"==s||"complete"==s)&&(a.forEach(d),t=1,E("qinit"),(null!=(o=r.requestIdleCallback)?o:r.setTimeout).bind(r)((()=>E("qidle"))),n.has(b))){const e=h("[on\\\\:"+b+"]"),t=new IntersectionObserver((e=>{for(const o of e)o.isIntersecting&&(t.unobserve(o[l]),g(o[l],"",v(b,o)))}));e[c]((e=>t.observe(e)))}},O=(e,t,o,r=!1)=>e.addEventListener(t,o,{capture:r,passive:!1}),S=(...e)=>{for(const t of e)"string"==typeof t?n.has(t)||(a.forEach((e=>O(e,t,_,!0))),O(r,t,k,!0),n.add(t)):a.has(t)||(n.forEach((e=>O(t,e,_,!0))),a.add(t))};if(!(o in e)){e[o]=0;const t=r.qwikevents;Array.isArray(t)&&S(...t),r.qwikevents={events:n,roots:a,push:S},O(e,"readystatechange",C),C()}})(document)})()',xe=`(() => {
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
})()`;function X(n={}){return n.debug?xe:je}var De="<!DOCTYPE html>";async function $e(n,e){var D,$,F;let t=e.stream,r=0,o=0,i=0,s=0,a="",l;const c=((D=e.streaming)==null?void 0:D.inOrder)??{strategy:"auto",maximunInitialChunk:5e4,maximunChunk:3e4},u=e.containerTagName??"html",v=e.containerAttributes??{},q=t,re=O(),oe=ee(e),d=te(e.manifest);function N(){a&&(q.write(a),a="",r=0,i++,i===1&&(s=re()))}function I(f){const m=f.length;r+=m,o+=m,a+=f}switch(c.strategy){case"disabled":t={write:I};break;case"direct":t=q;break;case"auto":let f=0,m=!1;const B=c.maximunChunk??0,P=c.maximunInitialChunk??0;t={write(w){w==="<!--qkssr-f-->"?m||(m=!0):w==="<!--qkssr-pu-->"?f++:w==="<!--qkssr-po-->"?f--:I(w),f===0&&(m||r>=(i===0?P:B))&&(m=!1,N())}};break}u==="html"?t.write(De):(t.write("<!--cq-->"),e.qwikLoader?(e.qwikLoader.include===void 0&&(e.qwikLoader.include="never"),e.qwikLoader.position===void 0&&(e.qwikLoader.position="bottom")):e.qwikLoader={include:"never"},e.qwikPrefetchServiceWorker||(e.qwikPrefetchServiceWorker={}),e.qwikPrefetchServiceWorker.include||(e.qwikPrefetchServiceWorker.include=!1),e.qwikPrefetchServiceWorker.position||(e.qwikPrefetchServiceWorker.position="top")),e.manifest||console.warn("Missing client manifest, loading symbols in the client might 404. Please ensure the client build has run and generated the manifest for the server build."),await qe(e,d);const C=d==null?void 0:d.manifest.injections,E=C?C.map(f=>p(f.tag,f.attributes??{})):[],S=(($=e.qwikLoader)==null?void 0:$.include)??"auto";if((((F=e.qwikLoader)==null?void 0:F.position)??"bottom")==="top"&&S!=="never"){const f=X({debug:e.debug});E.push(p("script",{id:"qwikloader",dangerouslySetInnerHTML:f})),E.push(p("script",{dangerouslySetInnerHTML:"window.qwikevents.push('click')"}))}const se=O(),R=[];let j=0,x=0;await ue(n,{stream:t,containerTagName:u,containerAttributes:v,serverData:e.serverData,base:oe,beforeContent:E,beforeClose:async(f,m,B,P)=>{var M,W,U,z,V;j=se();const w=O();l=await fe(f,m,void 0,P);const b=[];if(e.prefetchStrategy!==null){const h=Ce(l,e,d),ce=v["q:base"];if(h.length>0){const J=Pe(ce,e.prefetchStrategy,h,(M=e.serverData)==null?void 0:M.nonce);J&&b.push(J)}}const ae=JSON.stringify(l.state,void 0,void 0);if(b.push(p("script",{type:"qwik/json",dangerouslySetInnerHTML:Be(ae),nonce:(W=e.serverData)==null?void 0:W.nonce})),l.funcs.length>0){const h=v[ke];b.push(p("script",{"q:func":"qwik/json",dangerouslySetInnerHTML:Me(h,l.funcs),nonce:(U=e.serverData)==null?void 0:U.nonce}))}const le=!l||l.mode!=="static",Q=S==="always"||S==="auto"&&le;if(Q){const h=X({debug:e.debug});b.push(p("script",{id:"qwikloader",dangerouslySetInnerHTML:h,nonce:(z=e.serverData)==null?void 0:z.nonce}))}const H=Array.from(m.$events$,h=>JSON.stringify(h));if(H.length>0){const h=(Q?"window.qwikevents":"(window.qwikevents||=[])")+`.push(${H.join(", ")})`;b.push(p("script",{dangerouslySetInnerHTML:h,nonce:(V=e.serverData)==null?void 0:V.nonce}))}return Qe(R,f),x=w(),p(L,{children:b})},manifestHash:(d==null?void 0:d.manifest.manifestHash)||"dev"+Fe()}),u!=="html"&&t.write("<!--/cq-->"),N();const ie=l.resources.some(f=>f._cache!==1/0);return{prefetchResources:void 0,snapshotResult:l,flushes:i,manifest:d==null?void 0:d.manifest,size:o,isStatic:!ie,timing:{render:j,snapshot:x,firstFlush:s},_symbols:R}}function Fe(){return Math.random().toString(36).slice(2)}function te(n){if(n){if("mapper"in n)return n;if(n=_e(n),n){const e={};return Object.entries(n.mapping).forEach(([t,r])=>{e[A(t)]=[t,r]}),{mapper:e,manifest:n}}}}var Be=n=>n.replace(/<(\/?script)/gi,"\\x3C$1");function Qe(n,e){var t;for(const r of e){const o=(t=r.$componentQrl$)==null?void 0:t.getSymbol();o&&!n.includes(o)&&n.push(o)}}var He='document["qFuncs_HASH"]=';function Me(n,e){return He.replace("HASH",n)+`[${e.join(`,
`)}]`}async function Ze(n){const e=G({},te(n));K(e)}const We=null,Ue=()=>{const n=pe(),e=de();return g(L,{children:[y("title",null,null,n.title,1,null),y("link",null,{rel:"canonical",href:me(t=>t.url.href,[e],"p0.url.href")},null,3,null),y("meta",null,{name:"viewport",content:"width=device-width, initial-scale=1.0"},null,3,null),y("link",null,{rel:"icon",type:"image/x-icon",href:"/favicon.ico"},null,3,null),n.meta.map(t=>k("meta",{...t},null,0,t.key)),n.links.map(t=>k("link",{...t},null,0,t.key)),n.styles.map(t=>{var r;return k("style",{...t.props,...(r=t.props)!=null&&r.dangerouslySetInnerHTML?{}:{dangerouslySetInnerHTML:t.style}},null,0,t.key)}),n.scripts.map(t=>{var r;return k("script",{...t.props,...(r=t.props)!=null&&r.dangerouslySetInnerHTML?{}:{dangerouslySetInnerHTML:t.script}},null,0,t.key)})]},1,"0D_0")},ze=Y(Z(Ue,"s_0vphQYqOdZI")),Ve=()=>(he(),g(be,{children:[y("head",null,null,[y("meta",null,{charset:"utf-8"},null,3,null),y("link",null,{rel:"manifest",href:"/manifest.json"},null,3,"vp_0"),g(ze,null,3,"vp_1")],1,null),y("body",null,{lang:"en"},[g(ve,null,3,"vp_2"),g(ye,null,3,"vp_3")],1,null)]},1,"vp_4")),Je=Y(Z(Ve,"s_tntnak2DhJ8"));function Ge(n){return $e(g(Je,null,3,"Qb_0"),{manifest:We,...n,containerAttributes:{lang:"sw",...n.containerAttributes},serverData:{...n.serverData}})}export{We as m,Ge as r,Ze as s};
