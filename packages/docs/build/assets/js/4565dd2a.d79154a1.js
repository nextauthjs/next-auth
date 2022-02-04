"use strict";(self.webpackChunknext_auth_docs=self.webpackChunknext_auth_docs||[]).push([[6628],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return f}});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var p=r.createContext({}),l=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=l(e.components);return r.createElement(p.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,p=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),d=l(n),f=o,m=d["".concat(p,".").concat(f)]||d[f]||s[f]||a;return n?r.createElement(m,i(i({ref:t},u),{},{components:n})):r.createElement(m,i({ref:t},u))}));function f(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,i=new Array(a);i[0]=d;var c={};for(var p in t)hasOwnProperty.call(t,p)&&(c[p]=t[p]);c.originalType=e,c.mdxType="string"==typeof e?e:o,i[1]=c;for(var l=2;l<a;l++)i[l]=n[l];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},7425:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return c},contentTitle:function(){return p},metadata:function(){return l},toc:function(){return u},default:function(){return d}});var r=n(7462),o=n(3366),a=(n(7294),n(3905)),i=["components"],c={id:"faceit",title:"FACEIT"},p=void 0,l={unversionedId:"providers/faceit",id:"providers/faceit",isDocsHomePage:!1,title:"FACEIT",description:"Documentation",source:"@site/docs/providers/faceit.md",sourceDirName:"providers",slug:"/providers/faceit",permalink:"/providers/faceit",editUrl:"https://github.com/nextauthjs/docs/edit/main/docs/providers/faceit.md",tags:[],version:"current",lastUpdatedBy:"Bal\xe1zs Orb\xe1n",lastUpdatedAt:1643984703,formattedLastUpdatedAt:"2/4/2022",frontMatter:{id:"faceit",title:"FACEIT"},sidebar:"docs",previous:{title:"Facebook",permalink:"/providers/facebook"},next:{title:"Foursquare",permalink:"/providers/foursquare"}},u=[{value:"Documentation",id:"documentation",children:[],level:2},{value:"Configuration",id:"configuration",children:[],level:2},{value:"Options",id:"options",children:[],level:2},{value:"Example",id:"example",children:[],level:2}],s={toc:u};function d(e){var t=e.components,n=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,r.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"documentation"},"Documentation"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://cdn.faceit.com/third_party/docs/FACEIT_Connect_3.0.pdf"},"https://cdn.faceit.com/third_party/docs/FACEIT_Connect_3.0.pdf")),(0,a.kt)("h2",{id:"configuration"},"Configuration"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://developers.faceit.com/apps"},"https://developers.faceit.com/apps")),(0,a.kt)("p",null,"Grant type: ",(0,a.kt)("inlineCode",{parentName:"p"},"Authorization Code")),(0,a.kt)("p",null,"Scopes to have basic infos (email, nickname, guid and avatar) : ",(0,a.kt)("inlineCode",{parentName:"p"},"openid"),", ",(0,a.kt)("inlineCode",{parentName:"p"},"email"),", ",(0,a.kt)("inlineCode",{parentName:"p"},"profile")),(0,a.kt)("h2",{id:"options"},"Options"),(0,a.kt)("p",null,"The ",(0,a.kt)("strong",{parentName:"p"},"FACEIT Provider")," comes with a set of default options:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/faceit.js"},"FACEIT Provider options"))),(0,a.kt)("p",null,"You can override any of the options to suit your own use case."),(0,a.kt)("h2",{id:"example"},"Example"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'import FaceItProvider from "next-auth/providers/faceit";\n...\nproviders: [\n  FaceItProvider({\n    clientId: process.env.FACEIT_CLIENT_ID,\n    clientSecret: process.env.FACEIT_CLIENT_SECRET\n  })\n]\n...\n')))}d.isMDXComponent=!0}}]);