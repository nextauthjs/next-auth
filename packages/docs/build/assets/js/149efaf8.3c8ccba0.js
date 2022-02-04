"use strict";(self.webpackChunknext_auth_docs=self.webpackChunknext_auth_docs||[]).push([[3200],{3905:function(e,t,r){r.d(t,{Zo:function(){return p},kt:function(){return f}});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=n.createContext({}),l=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},p=function(e){var t=l(e.components);return n.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),d=l(r),f=o,m=d["".concat(s,".").concat(f)]||d[f]||u[f]||a;return r?n.createElement(m,i(i({ref:t},p),{},{components:r})):n.createElement(m,i({ref:t},p))}));function f(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=d;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:o,i[1]=c;for(var l=2;l<a;l++)i[l]=r[l];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},1380:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return c},contentTitle:function(){return s},metadata:function(){return l},toc:function(){return p},default:function(){return d}});var n=r(7462),o=r(3366),a=(r(7294),r(3905)),i=["components"],c={id:"salesforce",title:"Salesforce"},s=void 0,l={unversionedId:"providers/salesforce",id:"version-v3/providers/salesforce",isDocsHomePage:!1,title:"Salesforce",description:"Documentation",source:"@site/versioned_docs/version-v3/providers/salesforce.md",sourceDirName:"providers",slug:"/providers/salesforce",permalink:"/v3/providers/salesforce",editUrl:"https://github.com/nextauthjs/docs/edit/main/versioned_docs/version-v3/providers/salesforce.md",tags:[],version:"v3",lastUpdatedBy:"Bal\xe1zs Orb\xe1n",lastUpdatedAt:1643982356,formattedLastUpdatedAt:"2/4/2022",frontMatter:{id:"salesforce",title:"Salesforce"},sidebar:"version-v3/docs",previous:{title:"Reddit",permalink:"/v3/providers/reddit"},next:{title:"Slack",permalink:"/v3/providers/slack"}},p=[{value:"Documentation",id:"documentation",children:[],level:2},{value:"Options",id:"options",children:[],level:2},{value:"Example",id:"example",children:[],level:2}],u={toc:p};function d(e){var t=e.components,r=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"documentation"},"Documentation"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://help.salesforce.com/articleView?id=remoteaccess_authenticate.htm&type=5"},"https://help.salesforce.com/articleView?id=remoteaccess_authenticate.htm&type=5")),(0,a.kt)("h2",{id:"options"},"Options"),(0,a.kt)("p",null,"The ",(0,a.kt)("strong",{parentName:"p"},"Salesforce Provider")," comes with a set of default options:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/nextauthjs/next-auth/blob/main/src/providers/salesforce.js"},"Salesforce Provider options"))),(0,a.kt)("p",null,"You can override any of the options to suit your own use case."),(0,a.kt)("h2",{id:"example"},"Example"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"import Providers from `next-auth/providers`\n...\nproviders: [\n  Providers.Salesforce({\n    clientId: process.env.SALESFORCE_CLIENT_ID,\n    clientSecret: process.env.SALESFORCE_CLIENT_SECRET,\n  })\n]\n...\n")))}d.isMDXComponent=!0}}]);