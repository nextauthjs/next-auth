"use strict";(self.webpackChunknext_auth_docs=self.webpackChunknext_auth_docs||[]).push([[400],{3905:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return m}});var r=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var p=r.createContext({}),s=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},c=function(e){var t=s(e.components);return r.createElement(p.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,o=e.originalType,p=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),d=s(n),m=i,v=d["".concat(p,".").concat(m)]||d[m]||u[m]||o;return n?r.createElement(v,a(a({ref:t},c),{},{components:n})):r.createElement(v,a({ref:t},c))}));function m(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=n.length,a=new Array(o);a[0]=d;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l.mdxType="string"==typeof e?e:i,a[1]=l;for(var s=2;s<o;s++)a[s]=n[s];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},7675:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return l},contentTitle:function(){return p},metadata:function(){return s},toc:function(){return c},default:function(){return d}});var r=n(7462),i=n(3366),o=(n(7294),n(3905)),a=["components"],l={id:"line",title:"LINE"},p=void 0,s={unversionedId:"providers/line",id:"providers/line",isDocsHomePage:!1,title:"LINE",description:"Documentation",source:"@site/docs/providers/line.md",sourceDirName:"providers",slug:"/providers/line",permalink:"/providers/line",editUrl:"https://github.com/nextauthjs/docs/edit/main/docs/providers/line.md",tags:[],version:"current",lastUpdatedBy:"Bal\xe1zs Orb\xe1n",lastUpdatedAt:1643984703,formattedLastUpdatedAt:"2/4/2022",frontMatter:{id:"line",title:"LINE"},sidebar:"docs",previous:{title:"Keycloak",permalink:"/providers/keycloak"},next:{title:"LinkedIn",permalink:"/providers/linkedin"}},c=[{value:"Documentation",id:"documentation",children:[],level:2},{value:"Configuration",id:"configuration",children:[],level:2},{value:"Options",id:"options",children:[],level:2},{value:"Example",id:"example",children:[],level:2},{value:"Instructions",id:"instructions",children:[{value:"Configuration",id:"configuration-1",children:[],level:3}],level:2}],u={toc:c};function d(e){var t=e.components,n=(0,i.Z)(e,a);return(0,o.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h2",{id:"documentation"},"Documentation"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://developers.line.biz/en/docs/line-login/integrate-line-login/"},"https://developers.line.biz/en/docs/line-login/integrate-line-login/")),(0,o.kt)("h2",{id:"configuration"},"Configuration"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://developers.line.biz/console/"},"https://developers.line.biz/console/")),(0,o.kt)("h2",{id:"options"},"Options"),(0,o.kt)("p",null,"The ",(0,o.kt)("strong",{parentName:"p"},"Line Provider")," comes with a set of default options:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/line.ts"},"Line Provider options"))),(0,o.kt)("p",null,"You can override any of the options to suit your own use case."),(0,o.kt)("h2",{id:"example"},"Example"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'import LineProvider from "next-auth/providers/line";\n...\nproviders: [\n  LineProvider({\n    clientId: process.env.LINE_CLIENT_ID,\n    clientSecret: process.env.LINE_CLIENT_SECRET\n  })\n]\n...\n')),(0,o.kt)("h2",{id:"instructions"},"Instructions"),(0,o.kt)("h3",{id:"configuration-1"},"Configuration"),(0,o.kt)("p",null,"Create a provider and a LINE login channel at ",(0,o.kt)("inlineCode",{parentName:"p"},"https://developers.line.biz/console/"),". In the settings of the channel under LINE Login, activate web app and configure the following:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Callback URL",(0,o.kt)("ul",{parentName:"li"},(0,o.kt)("li",{parentName:"ul"},"http://localhost:3000/api/auth/callback/line")))),(0,o.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"To retrieve email address, you need to apply for Email address permission. Open ",(0,o.kt)("a",{parentName:"p",href:"https://developers.line.biz/console/"},"Line Developer Console"),", go to your Login Channel. Scroll down bottom to find ",(0,o.kt)("strong",{parentName:"p"},"OpenID Connect")," -> ",(0,o.kt)("strong",{parentName:"p"},"Email address permission"),". Click ",(0,o.kt)("strong",{parentName:"p"},"Apply")," and follow the instruction."))))}d.isMDXComponent=!0}}]);