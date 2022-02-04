"use strict";(self.webpackChunknext_auth_docs=self.webpackChunknext_auth_docs||[]).push([[9066],{3905:function(e,t,r){r.d(t,{Zo:function(){return s},kt:function(){return d}});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function p(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var c=n.createContext({}),l=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},s=function(e){var t=l(e.components);return n.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},v=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,i=e.originalType,c=e.parentName,s=p(e,["components","mdxType","originalType","parentName"]),v=l(r),d=o,m=v["".concat(c,".").concat(d)]||v[d]||u[d]||i;return r?n.createElement(m,a(a({ref:t},s),{},{components:r})):n.createElement(m,a({ref:t},s))}));function d(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=r.length,a=new Array(i);a[0]=v;var p={};for(var c in t)hasOwnProperty.call(t,c)&&(p[c]=t[c]);p.originalType=e,p.mdxType="string"==typeof e?e:o,a[1]=p;for(var l=2;l<i;l++)a[l]=r[l];return n.createElement.apply(null,a)}return n.createElement.apply(null,r)}v.displayName="MDXCreateElement"},5397:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return p},contentTitle:function(){return c},metadata:function(){return l},toc:function(){return s},default:function(){return v}});var n=r(7462),o=r(3366),i=(r(7294),r(3905)),a=["components"],p={id:"naver",title:"Naver"},c=void 0,l={unversionedId:"providers/naver",id:"version-v3/providers/naver",isDocsHomePage:!1,title:"Naver",description:"Documentation",source:"@site/versioned_docs/version-v3/providers/naver.md",sourceDirName:"providers",slug:"/providers/naver",permalink:"/v3/providers/naver",editUrl:"https://github.com/nextauthjs/docs/edit/main/versioned_docs/version-v3/providers/naver.md",tags:[],version:"v3",lastUpdatedBy:"Bal\xe1zs Orb\xe1n",lastUpdatedAt:1643982356,formattedLastUpdatedAt:"2/4/2022",frontMatter:{id:"naver",title:"Naver"},sidebar:"version-v3/docs",previous:{title:"Medium",permalink:"/v3/providers/medium"},next:{title:"Netlify",permalink:"/v3/providers/netlify"}},s=[{value:"Documentation",id:"documentation",children:[],level:2},{value:"Configuration",id:"configuration",children:[],level:2},{value:"Options",id:"options",children:[],level:2},{value:"Example",id:"example",children:[],level:2}],u={toc:s};function v(e){var t=e.components,r=(0,o.Z)(e,a);return(0,i.kt)("wrapper",(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h2",{id:"documentation"},"Documentation"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://developers.naver.com/docs/login/overview/overview.md"},"https://developers.naver.com/docs/login/overview/overview.md")),(0,i.kt)("h2",{id:"configuration"},"Configuration"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://developers.naver.com/docs/login/api/api.md"},"https://developers.naver.com/docs/login/api/api.md")),(0,i.kt)("h2",{id:"options"},"Options"),(0,i.kt)("p",null,"The ",(0,i.kt)("strong",{parentName:"p"},"Naver Provider")," comes with a set of default options:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/nextauthjs/next-auth/blob/main/src/providers/naver.js"},"Naver Provider options"))),(0,i.kt)("p",null,"You can override any of the options to suit your own use case."),(0,i.kt)("h2",{id:"example"},"Example"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"import Providers from `next-auth/providers`\n...\nproviders: [\n  Providers.Naver({\n    clientId: process.env.NAVER_CLIENT_ID,\n    clientSecret: process.env.NAVER_CLIENT_SECRET\n  })\n]\n...\n")))}v.isMDXComponent=!0}}]);