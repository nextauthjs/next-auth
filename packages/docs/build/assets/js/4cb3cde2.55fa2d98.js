"use strict";(self.webpackChunknext_auth_docs=self.webpackChunknext_auth_docs||[]).push([[375],{3905:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return l}});var r=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function u(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var p=r.createContext({}),d=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},c=function(e){var t=d(e.components);return r.createElement(p.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,o=e.originalType,p=e.parentName,c=u(e,["components","mdxType","originalType","parentName"]),m=d(n),l=i,v=m["".concat(p,".").concat(l)]||m[l]||s[l]||o;return n?r.createElement(v,a(a({ref:t},c),{},{components:n})):r.createElement(v,a({ref:t},c))}));function l(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=n.length,a=new Array(o);a[0]=m;var u={};for(var p in t)hasOwnProperty.call(t,p)&&(u[p]=t[p]);u.originalType=e,u.mdxType="string"==typeof e?e:i,a[1]=u;for(var d=2;d<o;d++)a[d]=n[d];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},2196:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return u},contentTitle:function(){return p},metadata:function(){return d},toc:function(){return c},default:function(){return m}});var r=n(7462),i=n(3366),o=(n(7294),n(3905)),a=["components"],u={id:"medium",title:"Medium"},p=void 0,d={unversionedId:"providers/medium",id:"version-v3/providers/medium",isDocsHomePage:!1,title:"Medium",description:"Documentation",source:"@site/versioned_docs/version-v3/providers/medium.md",sourceDirName:"providers",slug:"/providers/medium",permalink:"/v3/providers/medium",editUrl:"https://github.com/nextauthjs/docs/edit/main/versioned_docs/version-v3/providers/medium.md",tags:[],version:"v3",lastUpdatedBy:"Bal\xe1zs Orb\xe1n",lastUpdatedAt:1643982356,formattedLastUpdatedAt:"2/4/2022",frontMatter:{id:"medium",title:"Medium"},sidebar:"version-v3/docs",previous:{title:"Mail.ru",permalink:"/v3/providers/mailru"},next:{title:"Naver",permalink:"/v3/providers/naver"}},c=[{value:"Documentation",id:"documentation",children:[],level:2},{value:"Configuration",id:"configuration",children:[],level:2},{value:"Options",id:"options",children:[],level:2},{value:"Example",id:"example",children:[],level:2}],s={toc:c};function m(e){var t=e.components,n=(0,i.Z)(e,a);return(0,o.kt)("wrapper",(0,r.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h2",{id:"documentation"},"Documentation"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://github.com/Medium/medium-api-docs"},"https://github.com/Medium/medium-api-docs")),(0,o.kt)("h2",{id:"configuration"},"Configuration"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://medium.com/me/applications"},"https://medium.com/me/applications")),(0,o.kt)("h2",{id:"options"},"Options"),(0,o.kt)("p",null,"The ",(0,o.kt)("strong",{parentName:"p"},"Medium Provider")," comes with a set of default options:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/nextauthjs/next-auth/blob/main/src/providers/medium.js"},"Medium Provider options"))),(0,o.kt)("p",null,"You can override any of the options to suit your own use case."),(0,o.kt)("h2",{id:"example"},"Example"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"import Providers from `next-auth/providers`\n...\nproviders: [\n  Providers.Medium({\n    clientId: process.env.MEDIUM_CLIENT_ID,\n    clientSecret: process.env.MEDIUM_CLIENT_SECRET\n  })\n}\n...\n")),(0,o.kt)("div",{className:"admonition admonition-warning alert alert--danger"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M5.05.31c.81 2.17.41 3.38-.52 4.31C3.55 5.67 1.98 6.45.9 7.98c-1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-.3-6.61-.61 2.03.53 3.33 1.94 2.86 1.39-.47 2.3.53 2.27 1.67-.02.78-.31 1.44-1.13 1.81 3.42-.59 4.78-3.42 4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52.13-2.03 1.13-1.89 2.75.09 1.08-1.02 1.8-1.86 1.33-.67-.41-.66-1.19-.06-1.78C8.18 5.31 8.68 2.45 5.05.32L5.03.3l.02.01z"}))),"warning")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"Email address is not returned by the Medium API."))))}m.isMDXComponent=!0}}]);