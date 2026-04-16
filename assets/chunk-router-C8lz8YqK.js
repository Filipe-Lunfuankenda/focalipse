import{r as t,a0 as m,a1 as w,a2 as p,a3 as F}from"./vendor-BJIYC9Ha.js";/**
 * React Router DOM v6.30.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */const U="6";try{window.__reactRouterVersion=U}catch{}const E="startTransition",l=F[E];function v(e){let{basename:h,children:R,future:s,window:T}=e,n=t.useRef();n.current==null&&(n.current=m({window:T,v5Compat:!0}));let r=n.current,[a,i]=t.useState({action:r.action,location:r.location}),{v7_startTransition:o}=s||{},c=t.useCallback(u=>{o&&l?l(()=>i(u)):i(u)},[i,o]);return t.useLayoutEffect(()=>r.listen(c),[r,c]),t.useEffect(()=>w(s),[s]),t.createElement(p,{basename:h,children:R,location:a.location,navigationType:a.action,navigator:r,future:s})}var S;(function(e){e.UseScrollRestoration="useScrollRestoration",e.UseSubmit="useSubmit",e.UseSubmitFetcher="useSubmitFetcher",e.UseFetcher="useFetcher",e.useViewTransitionState="useViewTransitionState"})(S||(S={}));var f;(function(e){e.UseFetcher="useFetcher",e.UseFetchers="useFetchers",e.UseScrollRestoration="useScrollRestoration"})(f||(f={}));export{v as B};
