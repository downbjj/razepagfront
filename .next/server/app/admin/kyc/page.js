(()=>{var e={};e.id=6124,e.ids=[6124],e.modules={47849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},55403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},94749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},39491:e=>{"use strict";e.exports=require("assert")},6113:e=>{"use strict";e.exports=require("crypto")},82361:e=>{"use strict";e.exports=require("events")},57147:e=>{"use strict";e.exports=require("fs")},13685:e=>{"use strict";e.exports=require("http")},85158:e=>{"use strict";e.exports=require("http2")},95687:e=>{"use strict";e.exports=require("https")},71017:e=>{"use strict";e.exports=require("path")},12781:e=>{"use strict";e.exports=require("stream")},57310:e=>{"use strict";e.exports=require("url")},73837:e=>{"use strict";e.exports=require("util")},59796:e=>{"use strict";e.exports=require("zlib")},53461:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>l.a,__next_app__:()=>p,originalPathname:()=>x,pages:()=>o,routeModule:()=>u,tree:()=>c});var s=r(50482),a=r(69108),i=r(62563),l=r.n(i),n=r(68300),d={};for(let e in n)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(d[e]=()=>n[e]);r.d(t,d);let c=["",{children:["admin",{children:["kyc",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,38181)),"/home/runner/work/razepagfront/razepagfront/app/admin/kyc/page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(r.bind(r,63243)),"/home/runner/work/razepagfront/razepagfront/app/admin/layout.tsx"]}]},{layout:[()=>Promise.resolve().then(r.bind(r,78062)),"/home/runner/work/razepagfront/razepagfront/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,69361,23)),"next/dist/client/components/not-found-error"]}],o=["/home/runner/work/razepagfront/razepagfront/app/admin/kyc/page.tsx"],x="/admin/kyc/page",p={require:r,loadChunk:()=>Promise.resolve()},u=new s.AppPageRouteModule({definition:{kind:a.x.APP_PAGE,page:"/admin/kyc/page",pathname:"/admin/kyc",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},67337:(e,t,r)=>{Promise.resolve().then(r.bind(r,89991))},89991:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>u});var s=r(95344),a=r(5037),i=r(15366),l=r(25545),n=r(71542),d=r(73229),c=r(63966),o=r(56506),x=r(18117);function p({label:e,value:t,icon:r,color:a,bg:i}){return s.jsx("div",{className:"bg-surface border border-border rounded-xl p-5",children:(0,s.jsxs)("div",{className:"flex items-start justify-between",children:[(0,s.jsxs)("div",{children:[s.jsx("p",{className:"text-xs text-gray-500 uppercase tracking-wider font-medium",children:e}),s.jsx("p",{className:`text-2xl font-bold mt-1 ${a}`,children:t})]}),s.jsx("div",{className:`w-10 h-10 ${i} rounded-lg flex items-center justify-center`,children:s.jsx(r,{className:`w-5 h-5 ${a}`})})]})})}function u(){let{data:e}=(0,a.a)({queryKey:["kyc-pending"],queryFn:()=>x.ZP.get("/admin/documents",{params:{status:"PENDING",limit:1}}).then(e=>e.data.data?.total||0),refetchInterval:3e4}),{data:t}=(0,a.a)({queryKey:["kyc-approved"],queryFn:()=>x.ZP.get("/admin/documents",{params:{status:"APPROVED",limit:1}}).then(e=>e.data.data?.total||0)}),{data:r}=(0,a.a)({queryKey:["kyc-rejected"],queryFn:()=>x.ZP.get("/admin/documents",{params:{status:"REJECTED",limit:1}}).then(e=>e.data.data?.total||0)}),u=(e||0)+(t||0)+(r||0);return(0,s.jsxs)("div",{className:"space-y-6 animate-fade-in",children:[(0,s.jsxs)("div",{children:[s.jsx("h1",{className:"text-2xl font-bold text-white",children:"Sistema KYC"}),s.jsx("p",{className:"text-gray-500 text-sm mt-1",children:"Painel de controle de verifica\xe7\xe3o de identidade"})]}),(0,s.jsxs)("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-4",children:[s.jsx(p,{label:"Total",value:u,icon:i.Z,color:"text-white",bg:"bg-surface-2"}),s.jsx(p,{label:"Pendentes",value:e||0,icon:l.Z,color:"text-yellow-400",bg:"bg-yellow-500/10"}),s.jsx(p,{label:"Aprovados",value:t||0,icon:n.Z,color:"text-green-400",bg:"bg-green-500/10"}),s.jsx(p,{label:"Rejeitados",value:r||0,icon:d.Z,color:"text-red-400",bg:"bg-red-500/10"})]}),(0,s.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[(0,s.jsxs)(o.default,{href:"/admin/documents",className:"bg-surface border border-border rounded-xl p-6 hover:border-yellow-500/30 transition-all group",children:[(0,s.jsxs)("div",{className:"flex items-center gap-3 mb-3",children:[s.jsx("div",{className:"w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center",children:s.jsx(c.Z,{className:"w-5 h-5 text-yellow-400"})}),(0,s.jsxs)("div",{children:[s.jsx("p",{className:"text-sm font-semibold text-white",children:"Revisar Pendentes"}),(0,s.jsxs)("p",{className:"text-xs text-gray-500",children:[e||0," aguardando revis\xe3o"]})]})]}),s.jsx("p",{className:"text-xs text-gray-600",children:"Analise e aprove ou rejeite documentos enviados pelos usu\xe1rios."})]}),(0,s.jsxs)(o.default,{href:"/admin/documents/approved",className:"bg-surface border border-border rounded-xl p-6 hover:border-green-500/30 transition-all group",children:[(0,s.jsxs)("div",{className:"flex items-center gap-3 mb-3",children:[s.jsx("div",{className:"w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center",children:s.jsx(n.Z,{className:"w-5 h-5 text-green-400"})}),(0,s.jsxs)("div",{children:[s.jsx("p",{className:"text-sm font-semibold text-white",children:"Documentos Aprovados"}),(0,s.jsxs)("p",{className:"text-xs text-gray-500",children:[t||0," aprovados"]})]})]}),s.jsx("p",{className:"text-xs text-gray-600",children:"Visualize todos os documentos j\xe1 aprovados na plataforma."})]}),(0,s.jsxs)(o.default,{href:"/admin/documents?status=REJECTED",className:"bg-surface border border-border rounded-xl p-6 hover:border-red-500/30 transition-all group",children:[(0,s.jsxs)("div",{className:"flex items-center gap-3 mb-3",children:[s.jsx("div",{className:"w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center",children:s.jsx(d.Z,{className:"w-5 h-5 text-red-400"})}),(0,s.jsxs)("div",{children:[s.jsx("p",{className:"text-sm font-semibold text-white",children:"Documentos Rejeitados"}),(0,s.jsxs)("p",{className:"text-xs text-gray-500",children:[r||0," rejeitados"]})]})]}),s.jsx("p",{className:"text-xs text-gray-600",children:"Visualize e gerencie documentos rejeitados."})]})]}),(0,s.jsxs)("div",{className:"bg-surface border border-border rounded-xl p-6",children:[s.jsx("h2",{className:"text-sm font-semibold text-white mb-4",children:"Como funciona o KYC"}),(0,s.jsxs)("div",{className:"space-y-3 text-sm text-gray-400",children:[(0,s.jsxs)("div",{className:"flex items-start gap-3",children:[s.jsx("div",{className:"w-6 h-6 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 text-xs text-purple-400 font-bold",children:"1"}),s.jsx("p",{children:"Usu\xe1rio envia documento via API ou painel (CPF, RG, CNH, Selfie, etc.)"})]}),(0,s.jsxs)("div",{className:"flex items-start gap-3",children:[s.jsx("div",{className:"w-6 h-6 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 text-xs text-purple-400 font-bold",children:"2"}),s.jsx("p",{children:'Admin analisa o documento na aba "Documentos" e aprova ou rejeita com observa\xe7\xe3o'})]}),(0,s.jsxs)("div",{className:"flex items-start gap-3",children:[s.jsx("div",{className:"w-6 h-6 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0 text-xs text-purple-400 font-bold",children:"3"}),s.jsx("p",{children:"Usu\xe1rio \xe9 notificado e pode continuar ou reenviar documentos conforme necess\xe1rio"})]})]})]})]})}},63024:(e,t,r)=>{"use strict";r.d(t,{Z:()=>s});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,r(69224).Z)("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]])},95128:(e,t,r)=>{"use strict";r.d(t,{Z:()=>s});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,r(69224).Z)("Bitcoin",[["path",{d:"M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727",key:"yr8idg"}]])},25545:(e,t,r)=>{"use strict";r.d(t,{Z:()=>s});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,r(69224).Z)("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]])},71542:(e,t,r)=>{"use strict";r.d(t,{Z:()=>s});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,r(69224).Z)("FileCheck",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"m9 15 2 2 4-4",key:"1grp1n"}]])},63966:(e,t,r)=>{"use strict";r.d(t,{Z:()=>s});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,r(69224).Z)("FileClock",[["path",{d:"M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3",key:"37hlfg"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["circle",{cx:"8",cy:"16",r:"6",key:"10v15b"}],["path",{d:"M9.5 17.5 8 16.25V14",key:"1o80t2"}]])},37121:(e,t,r)=>{"use strict";r.d(t,{Z:()=>s});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,r(69224).Z)("FileText",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]])},71206:(e,t,r)=>{"use strict";r.d(t,{Z:()=>s});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,r(69224).Z)("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]])},47180:(e,t,r)=>{"use strict";r.d(t,{Z:()=>s});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,r(69224).Z)("Moon",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]])},24576:(e,t,r)=>{"use strict";r.d(t,{Z:()=>s});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,r(69224).Z)("Percent",[["line",{x1:"19",x2:"5",y1:"5",y2:"19",key:"1x9vlm"}],["circle",{cx:"6.5",cy:"6.5",r:"2.5",key:"4mh3h7"}],["circle",{cx:"17.5",cy:"17.5",r:"2.5",key:"1mdrzq"}]])},13746:(e,t,r)=>{"use strict";r.d(t,{Z:()=>s});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,r(69224).Z)("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]])},73714:(e,t,r)=>{"use strict";r.d(t,{Z:()=>s});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,r(69224).Z)("ShoppingBag",[["path",{d:"M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z",key:"hou9p0"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M16 10a4 4 0 0 1-8 0",key:"1ltviw"}]])},12401:(e,t,r)=>{"use strict";r.d(t,{Z:()=>s});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,r(69224).Z)("ShoppingCart",[["circle",{cx:"8",cy:"21",r:"1",key:"jimo8o"}],["circle",{cx:"19",cy:"21",r:"1",key:"13723u"}],["path",{d:"M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12",key:"9zh506"}]])},59673:(e,t,r)=>{"use strict";r.d(t,{Z:()=>s});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,r(69224).Z)("Sliders",[["line",{x1:"4",x2:"4",y1:"21",y2:"14",key:"1p332r"}],["line",{x1:"4",x2:"4",y1:"10",y2:"3",key:"gb41h5"}],["line",{x1:"12",x2:"12",y1:"21",y2:"12",key:"hf2csr"}],["line",{x1:"12",x2:"12",y1:"8",y2:"3",key:"1kfi7u"}],["line",{x1:"20",x2:"20",y1:"21",y2:"16",key:"1lhrwl"}],["line",{x1:"20",x2:"20",y1:"12",y2:"3",key:"16vvfq"}],["line",{x1:"2",x2:"6",y1:"14",y2:"14",key:"1uebub"}],["line",{x1:"10",x2:"14",y1:"8",y2:"8",key:"1yglbp"}],["line",{x1:"18",x2:"22",y1:"16",y2:"16",key:"1jxqpz"}]])},98714:(e,t,r)=>{"use strict";r.d(t,{Z:()=>s});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,r(69224).Z)("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]])},36341:(e,t,r)=>{"use strict";r.d(t,{Z:()=>s});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,r(69224).Z)("Tag",[["path",{d:"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",key:"vktsd0"}],["circle",{cx:"7.5",cy:"7.5",r:".5",fill:"currentColor",key:"kqv944"}]])},15366:(e,t,r)=>{"use strict";r.d(t,{Z:()=>s});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,r(69224).Z)("UserCheck",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["polyline",{points:"16 11 18 13 22 9",key:"1pwet4"}]])},89895:(e,t,r)=>{"use strict";r.d(t,{Z:()=>s});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,r(69224).Z)("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]])},73229:(e,t,r)=>{"use strict";r.d(t,{Z:()=>s});/**
 * @license lucide-react v0.323.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,r(69224).Z)("XCircle",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]])},38181:(e,t,r)=>{"use strict";r.r(t),r.d(t,{$$typeof:()=>i,__esModule:()=>a,default:()=>l});let s=(0,r(86843).createProxy)(String.raw`/home/runner/work/razepagfront/razepagfront/app/admin/kyc/page.tsx`),{__esModule:a,$$typeof:i}=s,l=s.default}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[6674,2642,1093,3675,4039,2485],()=>r(53461));module.exports=s})();