(()=>{var e={};e.id=1171,e.ids=[1171],e.modules={47849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},55403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},94749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},39491:e=>{"use strict";e.exports=require("assert")},6113:e=>{"use strict";e.exports=require("crypto")},82361:e=>{"use strict";e.exports=require("events")},57147:e=>{"use strict";e.exports=require("fs")},13685:e=>{"use strict";e.exports=require("http")},85158:e=>{"use strict";e.exports=require("http2")},95687:e=>{"use strict";e.exports=require("https")},71017:e=>{"use strict";e.exports=require("path")},12781:e=>{"use strict";e.exports=require("stream")},57310:e=>{"use strict";e.exports=require("url")},73837:e=>{"use strict";e.exports=require("util")},59796:e=>{"use strict";e.exports=require("zlib")},23827:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>l.a,__next_app__:()=>x,originalPathname:()=>p,pages:()=>c,routeModule:()=>u,tree:()=>o});var a=r(50482),s=r(69108),i=r(62563),l=r.n(i),n=r(68300),d={};for(let e in n)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(d[e]=()=>n[e]);r.d(t,d);let o=["",{children:["admin",{children:["documents",{children:["approved",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,91595)),"/home/runner/work/razepagfront/razepagfront/app/admin/documents/approved/page.tsx"]}]},{}]},{}]},{layout:[()=>Promise.resolve().then(r.bind(r,63243)),"/home/runner/work/razepagfront/razepagfront/app/admin/layout.tsx"]}]},{layout:[()=>Promise.resolve().then(r.bind(r,78062)),"/home/runner/work/razepagfront/razepagfront/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,69361,23)),"next/dist/client/components/not-found-error"]}],c=["/home/runner/work/razepagfront/razepagfront/app/admin/documents/approved/page.tsx"],p="/admin/documents/approved/page",x={require:r,loadChunk:()=>Promise.resolve()},u=new a.AppPageRouteModule({definition:{kind:s.x.APP_PAGE,page:"/admin/documents/approved/page",pathname:"/admin/documents/approved",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:o}})},70368:(e,t,r)=>{Promise.resolve().then(r.bind(r,52324))},52324:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>p});var a=r(95344),s=r(3729),i=r(5037),l=r(71542),n=r(71532),d=r(97751),o=r(18117),c=r(91626);function p(){let[e,t]=(0,s.useState)(1),{data:r,isLoading:p}=(0,i.a)({queryKey:["admin-documents-approved",e],queryFn:()=>o.ZP.get("/admin/documents",{params:{page:e,limit:20,status:"APPROVED"}}).then(e=>e.data.data)}),x=r?.documents||[],u=r?.totalPages||1,h=r?.total||0;return(0,a.jsxs)("div",{className:"space-y-6 animate-fade-in",children:[(0,a.jsxs)("div",{children:[a.jsx("h1",{className:"text-2xl font-bold text-white",children:"Documentos Aprovados"}),(0,a.jsxs)("p",{className:"text-gray-500 text-sm mt-1",children:[h," documentos aprovados"]})]}),a.jsx("div",{className:"bg-surface border border-border rounded-xl overflow-hidden",children:p?a.jsx("div",{className:"flex items-center justify-center py-16",children:a.jsx("div",{className:"w-6 h-6 border-2 border-purple-500/30 border-t-purple-500 rounded-full spinner"})}):0===x.length?(0,a.jsxs)("div",{className:"text-center py-16 text-gray-600",children:[a.jsx(l.Z,{className:"w-8 h-8 mx-auto mb-2 opacity-40"}),a.jsx("p",{children:"Nenhum documento aprovado ainda"})]}):(0,a.jsxs)(a.Fragment,{children:[a.jsx("div",{className:"overflow-x-auto",children:(0,a.jsxs)("table",{className:"w-full",children:[a.jsx("thead",{children:a.jsx("tr",{className:"border-b border-border",children:["Usu\xe1rio","Tipo","Arquivo","Revisado por","Observa\xe7\xe3o","Aprovado em"].map(e=>a.jsx("th",{className:"text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider",children:e},e))})}),a.jsx("tbody",{className:"divide-y divide-border",children:x.map(e=>(0,a.jsxs)("tr",{className:"table-row-hover",children:[(0,a.jsxs)("td",{className:"px-5 py-3.5",children:[a.jsx("p",{className:"text-sm text-white font-medium",children:e.user?.name}),a.jsx("p",{className:"text-xs text-gray-500",children:e.user?.email})]}),a.jsx("td",{className:"px-5 py-3.5",children:a.jsx("span",{className:"text-sm text-gray-300 font-mono",children:e.type})}),a.jsx("td",{className:"px-5 py-3.5",children:a.jsx("a",{href:e.fileUrl,target:"_blank",rel:"noopener noreferrer",className:"text-xs text-purple-400 hover:text-purple-300 underline",children:e.fileName||"Ver arquivo"})}),a.jsx("td",{className:"px-5 py-3.5",children:a.jsx("span",{className:"text-xs text-gray-500 font-mono truncate max-w-[80px] block",children:e.reviewedBy?.slice(0,8)||"—"})}),a.jsx("td",{className:"px-5 py-3.5",children:a.jsx("span",{className:"text-xs text-gray-500",children:e.reviewNote||"—"})}),a.jsx("td",{className:"px-5 py-3.5",children:a.jsx("span",{className:"text-xs text-gray-500",children:(0,c.p6)(e.updatedAt)})})]},e.id))})]})}),u>1&&(0,a.jsxs)("div",{className:"flex items-center justify-between px-5 py-3 border-t border-border",children:[(0,a.jsxs)("p",{className:"text-xs text-gray-500",children:["P\xe1gina ",e," de ",u]}),(0,a.jsxs)("div",{className:"flex gap-2",children:[a.jsx("button",{onClick:()=>t(e=>Math.max(1,e-1)),disabled:1===e,className:"p-1.5 rounded-lg border border-border disabled:opacity-30 hover:border-purple-500/30 transition-all",children:a.jsx(n.Z,{className:"w-4 h-4 text-gray-400"})}),a.jsx("button",{onClick:()=>t(e=>Math.min(u,e+1)),disabled:e===u,className:"p-1.5 rounded-lg border border-border disabled:opacity-30 hover:border-purple-500/30 transition-all",children:a.jsx(d.Z,{className:"w-4 h-4 text-gray-400"})})]})]})]})})]})}},63024:(e,t,r)=>{"use strict";r.d(t,{Z:()=>a});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(69224).Z)("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]])},95128:(e,t,r)=>{"use strict";r.d(t,{Z:()=>a});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(69224).Z)("Bitcoin",[["path",{d:"M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727",key:"yr8idg"}]])},71532:(e,t,r)=>{"use strict";r.d(t,{Z:()=>a});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(69224).Z)("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]])},71542:(e,t,r)=>{"use strict";r.d(t,{Z:()=>a});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(69224).Z)("FileCheck",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"m9 15 2 2 4-4",key:"1grp1n"}]])},63966:(e,t,r)=>{"use strict";r.d(t,{Z:()=>a});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(69224).Z)("FileClock",[["path",{d:"M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3",key:"37hlfg"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["circle",{cx:"8",cy:"16",r:"6",key:"10v15b"}],["path",{d:"M9.5 17.5 8 16.25V14",key:"1o80t2"}]])},37121:(e,t,r)=>{"use strict";r.d(t,{Z:()=>a});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(69224).Z)("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]])},71206:(e,t,r)=>{"use strict";r.d(t,{Z:()=>a});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(69224).Z)("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]])},47180:(e,t,r)=>{"use strict";r.d(t,{Z:()=>a});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(69224).Z)("Moon",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]])},24576:(e,t,r)=>{"use strict";r.d(t,{Z:()=>a});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(69224).Z)("Percent",[["line",{x1:"19",x2:"5",y1:"5",y2:"19",key:"1x9vlm"}],["circle",{cx:"6.5",cy:"6.5",r:"2.5",key:"4mh3h7"}],["circle",{cx:"17.5",cy:"17.5",r:"2.5",key:"1mdrzq"}]])},13746:(e,t,r)=>{"use strict";r.d(t,{Z:()=>a});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(69224).Z)("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]])},73714:(e,t,r)=>{"use strict";r.d(t,{Z:()=>a});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(69224).Z)("ShoppingBag",[["path",{d:"M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z",key:"hou9p0"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M16 10a4 4 0 0 1-8 0",key:"1ltviw"}]])},12401:(e,t,r)=>{"use strict";r.d(t,{Z:()=>a});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(69224).Z)("ShoppingCart",[["circle",{cx:"8",cy:"21",r:"1",key:"jimo8o"}],["circle",{cx:"19",cy:"21",r:"1",key:"13723u"}],["path",{d:"M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12",key:"9zh506"}]])},59673:(e,t,r)=>{"use strict";r.d(t,{Z:()=>a});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(69224).Z)("Sliders",[["line",{x1:"4",x2:"4",y1:"21",y2:"14",key:"1p332r"}],["line",{x1:"4",x2:"4",y1:"10",y2:"3",key:"gb41h5"}],["line",{x1:"12",x2:"12",y1:"21",y2:"12",key:"hf2csr"}],["line",{x1:"12",x2:"12",y1:"8",y2:"3",key:"1kfi7u"}],["line",{x1:"20",x2:"20",y1:"21",y2:"16",key:"1lhrwl"}],["line",{x1:"20",x2:"20",y1:"12",y2:"3",key:"16vvfq"}],["line",{x1:"2",x2:"6",y1:"14",y2:"14",key:"1uebub"}],["line",{x1:"10",x2:"14",y1:"8",y2:"8",key:"1yglbp"}],["line",{x1:"18",x2:"22",y1:"16",y2:"16",key:"1jxqpz"}]])},98714:(e,t,r)=>{"use strict";r.d(t,{Z:()=>a});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(69224).Z)("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]])},36341:(e,t,r)=>{"use strict";r.d(t,{Z:()=>a});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(69224).Z)("Tag",[["path",{d:"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",key:"vktsd0"}],["circle",{cx:"7.5",cy:"7.5",r:".5",fill:"currentColor",key:"kqv944"}]])},15366:(e,t,r)=>{"use strict";r.d(t,{Z:()=>a});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(69224).Z)("UserCheck",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["polyline",{points:"16 11 18 13 22 9",key:"1pwet4"}]])},89895:(e,t,r)=>{"use strict";r.d(t,{Z:()=>a});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,r(69224).Z)("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]])},91595:(e,t,r)=>{"use strict";r.r(t),r.d(t,{$$typeof:()=>i,__esModule:()=>s,default:()=>l});let a=(0,r(86843).createProxy)(String.raw`/home/runner/work/razepagfront/razepagfront/app/admin/documents/approved/page.tsx`),{__esModule:s,$$typeof:i}=a,l=a.default}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[6674,2642,1093,3675,4039,2485],()=>r(23827));module.exports=a})();